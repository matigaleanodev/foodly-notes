# Development – Foodly Notes Frontend

This document describes how to run and work with the **Foodly Notes frontend** in a local environment.

---

## 📦 Requirements

- Node.js (LTS recommended)
- npm
- Angular CLI
- Ionic CLI (optional but recommended)
- JDK 21 for Android/Capacitor builds

---

## 🚀 Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## ▶️ Run locally

Start the development server:

```bash
npm run start
```

The application will be available at:

```
http://localhost:4200
```

---

## 🧪 Testing

Run the Vitest node/jsdom suite for local work:

```bash
npm run test
```

Run the supported CI command:

```bash
npm run test:ci
```

Run the Vitest suite that currently targets services and utilities in Node/jsdom:

```bash
npm run test:vitest
```

Run the browser-mode Vitest suite for Angular and Ionic components with Playwright + Chromium:

```bash
npm run test:vitest:browser
```

Run the combined Vitest CI flow:

```bash
npm run test:vitest:ci
```

If Playwright browsers are not installed yet, run:

```bash
npx playwright install chromium
```

Vitest is the supported test runner for the project, covering services, utilities, Angular components, and Ionic standalone components.

---

## 🌍 i18n validation

Check for missing translation keys:

```bash
npm run i18n:check
```

This script validates that all translation keys used in templates
exist in both language files.

---

## 🏗️ Build

Generate a production build:

```bash
npm run build
```

The output is generated in the `www/` directory.

---

## 🤖 Android / Capacitor

Before validating the Android container, make sure `java -version` resolves to JDK 21.

Sync the current web build into the native project:

```bash
npx cap copy android
```

Compile the Android debug build from the native project:

```bash
cd android
gradlew.bat assembleDebug
```

If the current shell resolves `gradlew.bat` incorrectly in PowerShell, run:

```bash
cmd /c gradlew.bat assembleDebug
```

---

## 📁 Project structure

The project follows a feature-based structure with:

- `pages/` for screens
- `shared/` for reusable components, services and utilities
- `environments/` for environment configuration
- `scripts/` for auxiliary tooling (i18n validation)

---

## 📌 Notes

- Environment-specific values are defined in `environment*.ts`
- App version and stage are resolved dynamically depending on platform
- Capacitor is used only for native-specific features
- Android validation currently assumes the web bundle was copied after the latest `npm run build`
- `npm run test:ci` is the stable CI entrypoint and runs the full Vitest stack
- `npm run test:vitest:ci` remains available as the explicit Vitest command

---
