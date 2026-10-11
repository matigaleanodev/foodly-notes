# Cierre de auditoría frontend — 11/10/2026

Rama: `feat/frontend-quality-framework-update`. Se aplicaron los 19 hallazgos de la auditoría visual, UX, accesibilidad y código. Se preservaron e integraron los cambios del hilo de backend; los commits de este documento corresponden al frontend.

## Hallazgos y cambios

| ID | Cambio aplicado | Verificación |
| --- | --- | --- |
| C01 | Favoritos se hidratan una sola vez antes de mutar. Las escrituras se serializan y el estado se publica después de persistir. | Regresión con dos favoritos, acceso directo al detalle, eliminación y recarga; prueba de fallo de almacenamiento. |
| C02 | Búsquedas y detalles cancelan solicitudes anteriores. Inicio y compras descartan respuestas de versiones anteriores. | Subjects con respuestas fuera de orden; respuesta asincrónica del detalle; actualización de idioma. |
| A01 | Viewport permite zoom. | Meta viewport sin restricciones; captura a 320 px y texto al 200%. |
| A02 | Ingredientes y títulos completos, con altura variable y margen de cuaderno adaptado. | Texto largo en detalle y compras a 320/390 px, sin desbordes. |
| A03 | La etiqueta forma parte del checkbox de Ionic; un solo evento cambia su estado. | Nombre accesible, activación y persistencia tras recarga. |
| A04 | Colores semánticos con contraste, paleta específica para tema oscuro y texto oscuro sobre el verde de marca. Resumen y legales usan texto del tema. | axe en ambos temas; revisión visual de capturas. |
| A05 | Footer de receta flexible, acciones con texto y altura mínima de 44 px. | 320 px y texto al 200%, sin recortes. |
| A06 | Cada tarjeta tiene un botón de apertura y acciones hermanas. | Prueba de estructura y controles accesibles en navegador. |
| C03 | Validador de resúmenes en API, caché y favoritos. Se elimina caché inválida y se presenta un error recuperable. | Respuesta sin ID rechazada y caché corrupta descartada. |
| C04 | Inicio observa cambios de idioma y vuelve a cargar su caché correspondiente. | Regresión en la misma vista y flujo real en español. |
| C05 | El error se captura dentro de cada actualización de idioma en compras. | Tras un fallo, el próximo cambio de idioma vuelve a solicitar datos. |
| U01 | Búsqueda con etiqueta nativa y botón visible. Se mantiene consulta, se aceptan 1–200 caracteres y se informa cantidad de resultados. | Consulta restaurada desde URL, búsquedas cortas, reintento sin perder texto. |
| U02 | Tiempo/porciones cerca del título, accesos a ingredientes/preparación y resumen desplegable. | Revisión mobile y navegación por controles nativos. |
| U03 | Navegación persistente a partir de 1024 px; hero compacto y alineado con la grilla. | Desktop 1440 px y navegación mobile conservada. |
| U04 | Acciones con texto y etiquetas traducidas. Dietas se muestran con explicación visible en el contenido. Se quitaron atributos de tooltip sin implementación. | Capturas y nombres accesibles ES/EN. |
| U05 | Vacíos con exploración o edición; errores con reintento y separación respecto del estado vacío. | Favoritos vacíos → inicio; búsqueda fallida → reintento correcto. |
| A07 | Etiqueta de búsqueda, listas y encabezados semánticos, iconos decorativos ocultos, navegación con landmark y scroll legal accesible por teclado. | axe WCAG A/AA y buenas prácticas; revisión de árbol accesible. |
| V01 | Imágenes con proporción estable y título completo sobre superficie sólida. | Comparación desktop/mobile, tema claro/oscuro. |
| C06 | Eliminados tres resolvers sin rutas, sus pruebas desconectadas y el bootstrap/configuración de Karma. | Búsqueda de referencias, build y suites activas. |

## Dependencias y compatibilidad

- Angular/CLI/build 22.2.2; Ionic Angular 9.0.7 y toolkit 13.0.0.
- Capacitor core/Android/CLI 8.5.3 y plugins actualizados.
- TypeScript 6.0.3, Vitest 5.0.3, Playwright 1.64.0, ESLint 10.12.0 y Angular ESLint 22.6.0.
- TypeScript 7 se excluye porque Angular 22 requiere `>=6.0 <6.1`.
- CI usa Node 24; `.nvmrc` permite seleccionar esa misma versión.
- Migraciones oficiales de Angular; imports standalone de Ionic 9; ESLint flat config. Se conserva Zone.js y la estrategia Eager migrada para las páginas retenidas por Ionic.
- `xcode > uuid` se fija mediante override a 11.1.1 para corregir GHSA-w5hq-g745-h8pq. Esta versión conserva CommonJS y la API `v4` utilizada por Xcode. Se verificó generación de UUID con la librería real; revisar el override cuando Xcode actualice su dependencia.
- Se quitaron animaciones/bootstrap dinámico de Angular y paquetes de tooling que no tenían uso.

## Integración del backend

Se integraron lotes secuenciales de hasta 20 IDs para ingredientes, deduplicación y mensajes traducidos para HTTP 429/503. El límite de búsqueda de 200 caracteres se conserva en el input nativo. Los lotes esperan la inicialización del idioma y usan el mismo idioma durante toda la operación.

El proceso antiguo del puerto 3000 todavía devolvía algunas recetas diarias mal serializadas. Se verificó el backend actualizado en una instancia temporal del puerto 3001: diario y detalle respondieron 200, ingredientes 201 y todos los IDs fueron válidos. El flujo real en español mostró 12 recetas y 17 checkboxes, con cero infracciones automáticas de accesibilidad en compras. Luego se activó la versión verificada en el puerto 3000 y se cerró la instancia temporal.

## Validación

- `npm ci`, `npm run lint`, `npm run i18n:check`, `npm run test:ci`, `npm run build`.
- 178 pruebas activas: 58 de servicios/lógica y 120 en Chromium. La reducción de suites respecto del bloque anterior corresponde a las pruebas de resolvers eliminados.
- `npm audit`: cero vulnerabilidades reportadas al cierre.
- `npx cap sync android`: sincronización correcta de assets y cuatro plugins.
- Playwright + axe 4.10.3: 16 capturas/escenarios en 1440, 390 y 320 px, incluyendo modo oscuro y detalle con texto al 200%. Sin infracciones automáticas ni desbordamiento horizontal en esos escenarios.
- Regresiones visuales con datos controlados: acceso directo y conservación de favoritos, checkbox persistente y consulta restaurada. Flujo adicional con API actualizada y recuperación tras error.

Las comprobaciones automáticas no equivalen a una certificación WCAG. No se verificaron lector de pantalla real, Safari/iOS ni dispositivo Android físico; quedan como validación manual de plataformas. No se publicó ni se hizo push de esta rama.
