# Desarrollo – Frontend de Foodly Notes

Este documento describe cómo ejecutar y mantener el **frontend de Foodly Notes** en un entorno local.

---

## 📦 Requisitos

- Node.js
- npm
- Angular CLI
- Ionic CLI (opcional)
- JDK 21 para builds Android/Capacitor

---

## 🚀 Instalación

Cloná el repositorio e instalá las dependencias:

```bash
npm install
```

---

## ▶️ Ejecución local

Levantá el servidor de desarrollo:

```bash
npm run start
```

La aplicación queda disponible en:

```
http://localhost:4200
```

---

## 🧪 Testing

Corré la suite node/jsdom de Vitest para trabajo local:

```bash
npm run test
```

Corré el comando soportado de CI:

```bash
npm run test:ci
```

Corré la suite de Vitest que hoy apunta a servicios y utilidades en Node/jsdom:

```bash
npm run test:vitest
```

Corré la suite browser-mode de Vitest para componentes Angular e Ionic con Playwright + Chromium:

```bash
npm run test:vitest:browser
```

Corré el flujo combinado de Vitest para CI:

```bash
npm run test:vitest:ci
```

Si Playwright todavía no descargó los navegadores, ejecutá:

```bash
npx playwright install chromium
```

Vitest es el runner soportado del proyecto y ya cubre servicios, utilidades, componentes Angular y componentes Ionic standalone.

---

## 🌍 Validación i18n

Verificá keys faltantes de traducción:

```bash
npm run i18n:check
```

---

## 🏗️ Build

Generá el build de producción:

```bash
npm run build
```

La salida real se genera en `www/`.

---

## 🤖 Android / Capacitor

Antes de validar el contenedor Android, asegurate de que `java -version` resuelva a JDK 21.

Sincronizá el build web actual dentro del proyecto nativo:

```bash
npx cap copy android
```

Compilá el build debug de Android desde el proyecto nativo:

```bash
cd android
gradlew.bat assembleDebug
```

Si PowerShell resuelve mal `gradlew.bat`, ejecutá:

```bash
cmd /c gradlew.bat assembleDebug
```

---

## 📁 Estructura

La estructura principal del proyecto se organiza con:

- `pages/` para pantallas
- `shared/` para componentes, servicios y utilidades reutilizables
- `environments/` para configuración por entorno
- `scripts/` para tooling auxiliar

---

## 📌 Notas

- Los valores por entorno viven en `environment*.ts`
- `npm run test:ci` es la entrada estable de CI y ejecuta la suite completa de Vitest
- `npm run test:vitest:ci` sigue disponible como comando explícito de Vitest
- Capacitor se usa solo para capacidades nativas
- La validación Android asume que el bundle web fue copiado después del último `npm run build`
