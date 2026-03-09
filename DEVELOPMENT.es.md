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

Corré el piloto incremental de Vitest para servicios y utilidades:

```bash
npm run test:vitest
```

Por ahora el alcance de Vitest está limitado a servicios y utilidades. Los componentes Ionic siguen en Karma hasta validar un setup browser-mode de Vitest para este repo.

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
- `npm run test:ci` es el comando que debe usar CI
- Capacitor se usa solo para capacidades nativas
