# Development – Foodly Notes Frontend

This document describes how to run and work with the **Foodly Notes frontend** in a local environment.

---

## 📦 Requirements

- Node.js (LTS recommended)
- npm
- Angular CLI
- Ionic CLI (optional but recommended)

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

Run the Karma test runner in watch mode:

```bash
npm run test
```

Run the reliable CI command with `ChromeHeadlessCI` and fail-fast behavior on unexpected `console.error` output:

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

Vitest is now validated for service, utility, Angular component, and Ionic standalone component tests. Karma/Jasmine still remain in the repo until the remaining legacy specs are migrated.

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
- `npm run test:ci` is the current stable Karma command used by CI
- `npm run test:vitest:ci` is the validated migration path for the Vitest stack

---
