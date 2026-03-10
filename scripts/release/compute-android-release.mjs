import { createSign } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
);

const serviceAccountJson = process.env.PLAY_SERVICE_ACCOUNT_JSON;
const packageName = process.env.PLAY_PACKAGE_NAME;
const track = process.env.GOOGLE_PLAY_TRACK;
const githubRef = process.env.GITHUB_REF ?? "";
const githubRefName = process.env.GITHUB_REF_NAME ?? "";
const githubSha = process.env.GITHUB_SHA ?? "";
const githubRunNumber = Number(process.env.GITHUB_RUN_NUMBER ?? "0");
const githubOutput = process.env.GITHUB_OUTPUT;

if (!serviceAccountJson) {
  throw new Error("Missing PLAY_SERVICE_ACCOUNT_JSON");
}

if (!packageName) {
  throw new Error("Missing PLAY_PACKAGE_NAME");
}

if (!track) {
  throw new Error("Missing GOOGLE_PLAY_TRACK");
}

if (!githubOutput) {
  throw new Error("Missing GITHUB_OUTPUT");
}

const packageVersion = packageJson.version;
const tagVersion = githubRef.startsWith("refs/tags/v")
  ? githubRefName.replace(/^v/, "")
  : null;

if (tagVersion && tagVersion !== packageVersion) {
  throw new Error(
    `Tag version ${tagVersion} does not match package.json version ${packageVersion}`,
  );
}

const semanticVersion = tagVersion ?? packageVersion;
const versionName = `v${semanticVersion}`;
const shortSha = githubSha.slice(0, 7);
const releaseRef = tagVersion ? `tag:${githubRefName}` : `commit:${shortSha}`;
const releaseName = versionName;

const semverMatch = semanticVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);

if (!semverMatch) {
  throw new Error(`Unsupported version format: ${versionName}`);
}

const [, majorText, minorText, patchText] = semverMatch;
const major = Number(majorText);
const minor = Number(minorText);
const patch = Number(patchText);

const baseVersionCode = major * 10000 + minor * 100 + patch;

const serviceAccount = JSON.parse(serviceAccountJson);
const token = await getAccessToken(serviceAccount);
const tracks = await getTracks(token, packageName, track);
const targetTrack = tracks.find((item) => item.track === track) ?? {
  releases: [],
};
const releases = targetTrack.releases ?? [];
const existingRelease = releases.find(
  (release) => release.name === releaseName,
);

if (existingRelease) {
  writeOutput("skip_publish", "true");
  writeOutput("release_name", releaseName);
  writeOutput("release_ref", releaseRef);
  writeOutput("version_name", versionName);
  writeOutput(
    "version_code",
    String(existingRelease.versionCodes?.at(-1) ?? baseVersionCode),
  );
  writeOutput("base_version_code", String(baseVersionCode));
  process.exit(0);
}

const publishedVersionCodes = tracks.flatMap((trackItem) =>
  (trackItem.releases ?? []).flatMap((release) =>
    (release.versionCodes ?? []).map((value) => Number(value)),
  ),
);
const highestPublishedVersionCode = publishedVersionCodes.length
  ? Math.max(...publishedVersionCodes)
  : 0;

const computedVersionCode =
  highestPublishedVersionCode >= baseVersionCode
    ? highestPublishedVersionCode + 1
    : baseVersionCode;

if (githubRunNumber > 0 && computedVersionCode < baseVersionCode) {
  throw new Error(
    "Computed version code is lower than semver base version code",
  );
}

writeOutput("skip_publish", "false");
writeOutput("release_name", releaseName);
writeOutput("release_ref", releaseRef);
writeOutput("version_name", versionName);
writeOutput("version_code", String(computedVersionCode));
writeOutput("base_version_code", String(baseVersionCode));

async function getTracks(accessToken, applicationId, targetTrack) {
  const response = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${applicationId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status === 404) {
    return [{ track: targetTrack, releases: [] }];
  }

  if (!response.ok) {
    const fallbackResponse = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${applicationId}/tracks/${targetTrack}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (fallbackResponse.status === 404) {
      return [{ track: targetTrack, releases: [] }];
    }

    if (!fallbackResponse.ok) {
      throw new Error(
        `Failed to fetch Google Play track data: ${fallbackResponse.status} ${await fallbackResponse.text()}`,
      );
    }

    return [await fallbackResponse.json()];
  }

  const body = await response.json();
  return body.tracks ?? [];
}

async function getAccessToken(account) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 3600;
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: account.client_email,
      scope: "https://www.googleapis.com/auth/androidpublisher",
      aud: account.token_uri,
      exp: expiresAt,
      iat: issuedAt,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(account.private_key);
  const assertion = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const response = await fetch(account.token_uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get Google access token: ${response.status} ${await response.text()}`,
    );
  }

  const body = await response.json();
  return body.access_token;
}

function base64UrlEncode(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);

  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function writeOutput(name, value) {
  const line = `${name}=${value}\n`;
  appendFileSync(githubOutput, line);
}
