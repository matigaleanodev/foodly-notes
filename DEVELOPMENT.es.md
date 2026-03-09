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

## ⚙️ GitHub Actions

El repositorio mantiene workflows operativos separados por responsabilidad:

- `CI - Foodly Front`: corre lint, validación i18n, `npm run test:ci` y `npm run build` en pull requests hacia `dev` y `main`
- `Sync Dev From Main`: mergea `main` de vuelta sobre `dev` en cada push a `main` y también puede dispararse manualmente
- `Deploy Web - Firebase Hosting`: publica el build web en Firebase Hosting sobre pushes a `main`
- `Deploy Android - Google Play`: construye un Android App Bundle firmado y lo publica en Google Play sobre pushes a `main`

La automatización de release Android / Google Play se mantiene intencionalmente fuera del deploy web y corre como pipeline propio con secretos y reintentos separados.

---

## ✅ Checklist de release

### Release web

- confirmar la versión objetivo en `package.json` y en la metadata de `environment`
- correr `npm run lint`
- correr `npm run i18n:check`
- correr `npm run test:ci`
- correr `npm run build`
- verificar la salida en `www/`
- mergear o pushear la release validada a `main` para que pueda correr el workflow de deploy web

### Release mobile

- confirmar la versión objetivo en `package.json`, `environment*` y `android/app/build.gradle`
- asegurarse de que `java -version` resuelva a JDK 21
- correr `npm run build`
- correr `npx cap copy android`
- desde `android/`, correr como mínimo `cmd /c gradlew.bat assembleDebug` para validar el contenedor nativo
- verificar `versionName` y `versionCode` antes de publicar cualquier artefacto firmado
- mantener Google Play en un workflow propio, separado del deploy web

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
- La modernización Angular debe seguir siendo incremental: mantener `signals`, `computed`, `resource` y control flow moderno en UI nueva o tocada, pero evitar reescrituras amplias de pantallas existentes cuando el `subscribe()` imperativo actual está atado al lifecycle o al refresher de Ionic y ya se comporta de forma predecible
- Priorizar esa modernización solo cuando elimine manejo de estado duplicado, flujo de datos confuso o templates frágiles; no conviene reescribir pantallas estables como legales/info solo por consistencia estilística
- Favoritos y shopping list siguen siendo estado local intencional de este frontend; no conviene sumar sincronización backend sin contrato explícito ni decisión de roadmap en `foodly-notes-api`

---
