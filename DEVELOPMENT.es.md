# Desarrollo – Frontend de Foodly Notes

Este documento describe cómo ejecutar y mantener el **frontend de Foodly Notes** en un entorno local.

---

## 📦 Requisitos

- Node.js
- npm
- Angular CLI
- Ionic CLI (opcional)

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

Corré Karma en modo watch para trabajo local:

```bash
npm run test
```

Corré el comando confiable de CI con `ChromeHeadlessCI` y falla inmediata ante `console.error` inesperados:

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

Vitest ya quedó validado para servicios, utilidades, componentes Angular y componentes Ionic standalone. Karma/Jasmine siguen presentes mientras existan specs legacy sin migrar.

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

## 📁 Estructura

La estructura principal del proyecto se organiza con:

- `pages/` para pantallas
- `shared/` para componentes, servicios y utilidades reutilizables
- `environments/` para configuración por entorno
- `scripts/` para tooling auxiliar

---

## 📌 Notas

- Los valores por entorno viven en `environment*.ts`
- `npm run test:ci` es el comando estable actual de Karma para CI
- `npm run test:vitest:ci` es el camino validado de migración hacia Vitest
- Capacitor se usa solo para capacidades nativas
