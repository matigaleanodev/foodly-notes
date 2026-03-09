<p align="center">
  <img src="src/assets/images/foodly_notes_solid_green.png" alt="Foodly Notes" width="200" />
</p>

# Foodly Notes – Frontend

🌐 Versión en español: [README.md](./README.md)

**Foodly Notes** is an application focused on searching, saving and organizing cooking recipes.
It supports **favorites**, **shopping lists**, and **automatic translation** of content.

This repository contains the **frontend** of the application, built with Ionic and Angular,
designed for real-world mobile and web usage.

---

## 🧩 General architecture

- **Framework**: Ionic + Angular (standalone)
- **Styling**: SCSS
- **Internationalization**: ES / EN
- **Local storage**: Ionic Storage
- **API consumption**: Custom backend (NestJS)

---

## 🛠️ Tech stack

![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)

---

## 🌍 Internationalization

- Supported languages: **Spanish** and **English**
- Centralized translation keys
- Validation script to detect missing keys

```bash
npm run i18n:check
```

---

## 🧭 Ownership and Boundaries

- Bilingual UI and language preference are handled in this frontend through local dictionaries and persisted language selection.
- Recipe translation, response normalization, and external provider integration belong to `foodly-notes-api`.
- `Ionic Storage` is used only as local application state for language, favorites, and shopping-list progress.
- Favorites and shopping-list flows remain frontend-owned and local until an explicit backend decision changes that boundary.
- The API remains the source of truth for recipe, search, similar-recipe, and ingredient-aggregation data.
- In the current product state there is no backend contract for syncing favorites or shopping-list progress across devices; for this release both remain fully local.

---

## 📱 Main features

- Daily recipes
- Advanced search
- Favorites
- Recipe-based shopping lists
- Detailed recipe view
- Legal pages (Terms and Privacy Policy)
- App info screen with version and stage

---

## 🧑‍💻 Development

For local setup and development instructions:

👉 [DEVELOPMENT.md](./DEVELOPMENT.md)
