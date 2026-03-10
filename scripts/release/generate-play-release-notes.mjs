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
      "- Better release reliability and Android delivery.",
      "- Stability improvements and minor polish across the app.",
      "- Small fixes for a smoother everyday experience.",
    ].join("\n"),
    "es-419": [
      `Novedades de ${versionName}`,
      "",
      "- Mejoramos la confiabilidad de las actualizaciones en Android.",
      "- Ajustes de estabilidad y mejoras generales en la app.",
      "- Correcciones menores para una experiencia más fluida.",
    ].join("\n"),
    "es-US": [
      `Novedades de ${versionName}`,
      "",
      "- Mejoramos la confiabilidad de las actualizaciones en Android.",
      "- Ajustes de estabilidad y mejoras generales en la app.",
      "- Correcciones menores para una experiencia más fluida.",
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
