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
      "- Improved navigation, readable recipes and layouts on mobile and desktop.",
      "- Better keyboard access, contrast and labels for assistive technology.",
      "- More reliable favorites, shopping lists, language changes and error recovery.",
    ].join("\n"),
    "es-419": [
      `Novedades de ${versionName}`,
      "",
      "- Mejor navegación, recetas más legibles y diseño adaptable a cada pantalla.",
      "- Mejor acceso con teclado, contraste y etiquetas accesibles.",
      "- Favoritos, compras, cambios de idioma y recuperación de errores más confiables.",
    ].join("\n"),
    "es-US": [
      `Novedades de ${versionName}`,
      "",
      "- Mejor navegación, recetas más legibles y diseño adaptable a cada pantalla.",
      "- Mejor acceso con teclado, contraste y etiquetas accesibles.",
      "- Favoritos, compras, cambios de idioma y recuperación de errores más confiables.",
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
