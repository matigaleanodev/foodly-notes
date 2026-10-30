# foodly-notes-front

## Contexto de trabajo

Si existe un workspace con AGENTS.md en los directorios padre, leerlo explícitamente antes de editar y seguir sus referencias. Una raíz Git anidada puede impedir la herencia automática. Fuera de ese entorno, este archivo y el README deben ser suficientes para trabajar.

## Aplicación y límites

- Angular standalone, Ionic y Capacitor; código en src/ y recursos en assets/.
- La API suministra recetas, traducciones de contenido y agregación de ingredientes.
- Favoritos, lista de compras y traducción de interfaz son estado del cliente.
- Ionic Storage conserva estado local; no reemplaza la fuente de datos de recetas.
- Verificar DTOs y errores contra la implementación API compatible antes de cambiar servicios.
- Mantener paridad web/Android en flujos que utilizan Capacitor.

## Desarrollo y verificación

- Instalar con npm ci; iniciar con npm start; compilar con npm run build.
- npm test ejecuta Vitest mediante el builder Angular configurado.
- npm run test:ci incluye la suite y las comprobaciones de navegador configuradas.
- npm run i18n:check comprueba claves de traducción.
- Consultar DEVELOPMENT para los requisitos de navegador y Android.

## Restricciones

- No duplicar normalización de recetas ni integraciones de Spoonacular/Azure en el cliente.
- Conservar partición de solicitudes de ingredientes y tratamiento de errores de la API.
- Mantener configuración de entorno sin credenciales de proveedores.
- Un build web no demuestra ejecución nativa ni firma/distribución Android.
- Utilizar las convenciones existentes de servicios, componentes y traducciones.
