import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const outputDirectory = process.env.RELEASE_NOTES_DIR;
const versionName = process.env.RELEASE_VERSION_NAME;
const releaseRef = process.env.RELEASE_REF;
const githubSha = process.env.GITHUB_SHA ?? "";

if (!outputDirectory) {
  throw new Error("Missing RELEASE_NOTES_DIR");
}

if (!versionName) {
  throw new Error("Missing RELEASE_VERSION_NAME");
}

mkdirSync(outputDirectory, { recursive: true });

const commits = getCommitLines();
const header = tagHeader(versionName, releaseRef);
const notes =
  commits.length > 0
    ? `${header}\n\n${commits.map((line) => `- ${line}`).join("\n")}\n`
    : `${header}\n\n- Release generated from ${githubSha.slice(0, 7)}\n`;

writeFileSync(`${outputDirectory}/whatsnew-en-US`, notes, "utf8");
writeFileSync(`${outputDirectory}/whatsnew-es-AR`, notes, "utf8");

function getCommitLines() {
  const previousTag = resolvePreviousTag();
  const range = previousTag ? `${previousTag}..HEAD` : "HEAD~20..HEAD";
  const output = execGit([
    "log",
    "--no-merges",
    "--pretty=format:%s",
    range,
  ]).trim();

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function resolvePreviousTag() {
  try {
    if (releaseRef.startsWith("tag:")) {
      return execGit(["describe", "--tags", "--abbrev=0", "HEAD^"]).trim();
    }

    return execGit(["describe", "--tags", "--abbrev=0"]).trim();
  } catch {
    return "";
  }
}

function tagHeader(name, ref) {
  if (ref.startsWith("tag:")) {
    return `Release ${ref.slice(4)} (${name})`;
  }

  return `Release ${name}`;
}

function execGit(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
