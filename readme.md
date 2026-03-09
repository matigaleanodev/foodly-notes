<p align="center">
  <img src="src/assets/images/foodly_notes_solid_green.png" alt="Foodly Notes" width="200" />
</p>

# Foodly Notes – Frontend

🌐 English version: [README.en.md](./README.en.md)

**Foodly Notes** es una aplicación orientada a la búsqueda, guardado y organización de recetas de cocina.
Permite trabajar con **favoritos**, **listas de compras** y ofrece **traducción automática** del contenido.

Este repositorio contiene el **frontend** de la aplicación, desarrollado con Ionic y Angular, pensado para
consumo mobile y web como producto real listo para producción.

---

## 🧩 Arquitectura general

- **Framework**: Ionic + Angular (standalone)
- **Estilos**: SCSS
- **Internacionalización**: ES / EN
- **Almacenamiento local**: Ionic Storage
- **Consumo de API**: Backend propio (NestJS)

---

## 🛠️ Stack tecnológico

![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white)

---

## 🌍 Internacionalización

- Idiomas soportados: **español** e **inglés**
- Traducciones centralizadas por keys
- Script de validación para detectar keys faltantes

```bash
npm run i18n:check
```

---

## 🧭 Ownership y límites

- La UI bilingüe y la preferencia de idioma se resuelven en este frontend mediante diccionarios locales y persistencia del idioma elegido.
- La traducción de recetas, la normalización de respuestas y la integración con proveedores externos pertenecen a `foodly-notes-api`.
- `Ionic Storage` se usa solo como estado local de aplicación para idioma, favoritos y progreso de shopping list.
- Favoritos y shopping list siguen siendo flujos frontend-owned y locales mientras no exista una decisión backend que cambie ese límite.
- La API sigue siendo la fuente de verdad para datos de recetas, búsqueda, similares y agregación de ingredientes.

---

## 📱 Funcionalidades principales

- Recetas diarias
- Búsqueda avanzada
- Favoritos
- Listas de compras generadas por recetas
- Información detallada de cada receta
- Páginas legales (Términos y Política de Privacidad)
- Pantalla de información con versión y estado de la app

---

## 🧑‍💻 Desarrollo

Para instrucciones de instalación y ejecución en entorno local:

👉 [DEVELOPMENT.md](./DEVELOPMENT.md)
