import { mkdirSync, writeFileSync } from "node:fs";

const maxLength = 500;
const locales = ["en-US", "es-419", "es-US"];
const outputDirectory = process.env.RELEASE_NOTES_DIR;
const versionName = process.env.RELEASE_VERSION_NAME;

if (!outputDirectory) {
  throw new Error("Missing RELEASE_NOTES_DIR");
}

if (!versionName) {
  throw new Error("Missing RELEASE_VERSION_NAME");
}

mkdirSync(outputDirectory, { recursive: true });

for (const locale of locales) {
  writeFileSync(
    `${outputDirectory}/whatsnew-${locale}`,
    buildNotes(locale),
    "utf8",
  );
}

function buildNotes(locale) {
  const notesByLocale = {
    "en-US": [
      `What's new in ${versionName}`,
      "",
      "- Daily recipes now load more reliably when your app language is Spanish.",
      "- Recipe details open with a smoother loading flow while content is being prepared.",
      "- Search and recipe content stay more consistent with your selected language.",
    ].join("\n"),
    "es-419": [
      `Novedades de ${versionName}`,
      "",
      "- Las recetas diarias ahora cargan mejor cuando usas la app en espanol.",
      "- Los detalles de recetas se abren con una carga mas fluida mientras llega el contenido.",
      "- Las busquedas y el contenido de recetas respetan mejor el idioma elegido.",
    ].join("\n"),
    "es-US": [
      `Novedades de ${versionName}`,
      "",
      "- Las recetas diarias ahora cargan mejor cuando usas la app en espanol.",
      "- Los detalles de recetas se abren con una carga mas fluida mientras llega el contenido.",
      "- Las busquedas y el contenido de recetas respetan mejor el idioma elegido.",
    ].join("\n"),
  };

  const notes = notesByLocale[locale];

  if (!notes) {
    throw new Error(`Unsupported locale for release notes: ${locale}`);
  }

  if (notes.length > maxLength) {
    throw new Error(
      `Release notes exceed ${maxLength} characters for ${locale}`,
    );
  }

  return notes;
}
