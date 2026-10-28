# Plan de actualización visual y responsive

## Objetivo

Unificar la interfaz de unPicadito para que sea legible, consistente y fácil de usar en móvil, tablet y escritorio. Mantener Tailwind CSS como mecanismo de estilos en los componentes React, reutilizar el sistema visual existente y corregir las inconsistencias visibles en la referencia actual.

Este documento es un plan de implementación. No implica cambios de código ni de comportamiento de negocio en esta etapa.

## Estado actual observado

### Ya aplicado

- Tailwind CSS 4 está integrado mediante `@tailwindcss/vite` y `@import "tailwindcss"` en `src/index.css`. No hace falta crear un `tailwind.config.js` para el setup actual.
- `src/index.css` ya declara tokens `@theme` para los colores de marca y superficies:
  - `brand-light`: `#C7CEE8`
  - `brand-primary`: `#D0D34D`
  - `brand-primary-dark`: `#b8bb43`
  - `brand-green`: `#157954`
  - `brand-dark`: `#21263A`
  - Fondos y bordes basados en `slate-900`, `slate-800` y `slate-700`.
- Hay componentes reutilizables en `src/components/`, entre ellos `Button`, `Card`, `Badge`, `Input`, `Select`, `SearchInput`, `ProgressBar`, `Switch`, `ToggleGroup` y `Spinner`.
- Algunas vistas ya usan breakpoints y utilidades Tailwind, por ejemplo las grillas de partidos y la portada.

### Pendiente o inconsistente

- `src/App.css` contiene reglas globales y una paleta clara anterior. Se importa después de `src/index.css` desde `src/main.jsx`, por lo que sus reglas globales pueden sobrescribir el tema oscuro. La captura muestra el efecto: fondo claro con títulos blancos y filtros/tarjetas oscuras, causando contraste insuficiente y una apariencia mezclada.
- La paleta de marca existe, pero algunos componentes y páginas todavía usan colores hardcodeados o una paleta verde/neutral distinta.
- `src/features/players/pages/PlayersPage.jsx`, `src/features/players/components/SearchBar.jsx` y `src/features/players/components/PlayerList.jsx` conservan estilos en línea extensos y colores independientes del tema.
- La navegación, los filtros y las tarjetas deben revisarse en anchos móviles reales; la captura actual no demuestra por sí sola el comportamiento responsive.
- Las primitivas UI compartidas ya están agrupadas en `src/components/`, pero todavía no existe una separación explícita `src/components/ui/`.

## Dirección visual y reglas

1. Tomar la captura del estado actual y la imagen de paleta adjuntas como referencia visual. Usar los tokens existentes como fuente de verdad; verificar los valores contra la paleta antes de introducir tonos nuevos.
2. Resolver primero el conflicto entre el tema global y las reglas antiguas. No mezclar fondo claro, textos pensados para fondo oscuro y superficies oscuras en una misma vista.
3. Definir jerarquía semántica consistente: fondo de página, superficie, borde, texto principal, texto secundario, acento, éxito, advertencia y error. Mantener el lima para acciones y estados destacados, no para párrafos largos.
4. Usar texto claro sobre superficies oscuras y texto oscuro sobre el botón lima. Validar contraste legible para texto normal, placeholders, badges, focus y estados deshabilitados.
5. Mantener el idioma y tono rioplatense existentes. No alterar validaciones, rutas, datos, permisos ni flujos de creación/unión a salas como parte del rediseño.
6. Utilizar clases utilitarias Tailwind para presentación en todos los JSX. Los estilos en línea solo se conservarán cuando el valor sea verdaderamente dinámico y no se pueda expresar de forma fiable como clase, por ejemplo posiciones de jugadores en el tablero o el ancho porcentual del progreso; documentar cada excepción.

## Plan por fases

### Fase 1 — Consolidar el tema y quitar conflictos globales

- Auditar `src/index.css`, `src/App.css` y el orden de importación desde `src/main.jsx`.
- Dejar una única definición de estilos globales compatible con Tailwind 4 y los tokens de marca.
- Retirar o migrar reglas globales antiguas solo después de comprobar qué selectores todavía usa la aplicación; no borrar reglas por nombre sin verificar sus consumidores.
- Sustituir colores hardcodeados de componentes compartidos por tokens/clases de Tailwind cuando expresen el mismo rol visual.
- No añadir una configuración clásica de Tailwind si los tokens `@theme` existentes cubren la necesidad.

**Resultado esperado:** una sola paleta efectiva en todas las rutas y ningún override global accidental del fondo o color de texto.

### Fase 2 — Organizar y completar los componentes UI compartidos

- Revisar las primitivas actuales (`Button`, `Card`, `Badge`, `Input`, `Select`, `SearchInput`, `ProgressBar`, `Switch`, `ToggleGroup` y `Spinner`) antes de crear componentes nuevos.
- Crear `src/components/ui/` para las primitivas visuales reutilizables y migrar allí los componentes existentes de forma agrupada, actualizando todos sus imports en el mismo cambio. Mantener `Navbar` y `MainLayout` como componentes de aplicación, fuera del UI kit.
- Normalizar variantes, tamaños, estados hover/focus/disabled, bordes, radios, tipografía y soporte de `className` sin duplicar estilos en las páginas.
- Asegurar labels, estados accesibles, foco visible y áreas táctiles de al menos 44 × 44 px donde corresponda.
- Añadir un avatar solo si la interfaz actual realmente lo necesita; no ampliar el UI kit con elementos sin consumidor.

**Resultado esperado:** las vistas componen los mismos controles y superficies, en vez de implementar una apariencia distinta por feature.

### Fase 3 — Navegación y estructura adaptables

- Adaptar `Navbar` y `MainLayout` para móvil, tablet y escritorio.
- Conservar accesibles las rutas principales, la acción “Crear sala” y el menú de usuario en pantallas pequeñas; evitar que el contenido quede tapado por la navegación fija.
- Revisar espaciados, ancho máximo de lectura y márgenes laterales para que el layout no quede comprimido ni excesivamente extendido en pantallas grandes.
- Mantener estados activos, etiquetas accesibles y navegación por teclado.

**Resultado esperado:** navegación utilizable sin desbordamiento horizontal en móvil y con distribución equilibrada en escritorio.

### Fase 4 — Portada, búsqueda y partidos

- Unificar el tema de `HomePage`, `MatchesPage`, `MatchFilters`, `MatchGrid` y `MatchCard`.
- Corregir en la vista de partidos el contraste entre el encabezado, el fondo y las tarjetas que evidencia la captura.
- Mantener filtros visibles y ordenados en móvil en una columna; pasar a dos columnas en tablet y varias columnas en escritorio según el ancho disponible.
- Dar a las tarjetas de partidos una silueta más cuadrada, reduciendo al mínimo los radios de borde y evitando el aspecto de píldora o tarjeta muy redondeada.
- Añadir al hover una iluminación sutil en el borde con un color de contraste de la paleta, manteniendo una intensidad baja para no competir con el contenido. Proveer un estado equivalente de foco visible para teclado.
- Hacer que cualquier zona no interactiva de la tarjeta permita abrir la sala correspondiente. Implementar la interacción con semántica accesible y navegación por teclado, sin anidar enlaces ni botones ni interferir con botones internos como unirse, salir u organizar.
- Adaptar las tarjetas de partidos a una columna en móvil, dos en tablet y una grilla de hasta cuatro columnas en escritorio. Evitar truncar información necesaria y mantener botones utilizables.
- Definir comportamiento visual de carga, error, lista vacía, filtros activos y acciones pendientes usando las primitivas compartidas.

**Resultado esperado:** las tareas de buscar, filtrar y revisar un partido se entienden y ejecutan sin zoom ni desplazamiento lateral; las tarjetas conservan una silueta sobria, un hover discreto y un acceso directo a la sala.

### Fase 5 — Resto de las features y uso consistente de Tailwind

- Recorrer formularios de crear/editar sala, detalle de sala, jugadores, perfiles, autenticación y estados de partido.
- Migrar primero los estilos en línea estáticos y los colores aislados; preservar estilos dinámicos que representen datos o geometría.
- Priorizar `PlayersPage`, `SearchBar` y `PlayerList` por su uso extensivo de estilos en línea y valores visuales desconectados del tema.
- Reutilizar los componentes UI cuando exista equivalencia semántica; mantener los componentes de dominio en sus features.
- Verificar que las pantallas de solo lectura y edición sigan compartiendo el mismo lenguaje visual.

**Resultado esperado:** todas las vistas JSX usan Tailwind para el estilo ordinario y los pocos casos dinámicos que requieren estilos directos quedan justificados.

### Fase 6 — Verificación responsive y accesibilidad visual

- Revisar manualmente las rutas principales en anchos de referencia:
  - Móvil: 360–390 px.
  - Tablet: 768–1024 px.
  - Escritorio: 1280–1440 px.
- Confirmar que no haya scroll horizontal, controles recortados, textos ilegibles ni elementos fijos superpuestos.
- Probar estados hover, foco por teclado, disabled, carga, error y datos vacíos.
- Validar contraste de texto y controles contra sus superficies; comprobar particularmente el lima sobre oscuro, el texto sobre el lima y los textos secundarios.
- Ejecutar `npm run lint` y `npm run build` al completar la implementación. El repositorio no declara un script automatizado de tests; complementar con revisión visual en navegador.

## Criterios de aceptación

- El tema y el contraste son consistentes en navegación, fondo, formularios, tarjetas y estados de todos los features.
- La vista de partidos corrige la baja legibilidad mostrada en la captura.
- Las acciones principales, filtros, formularios y tarjetas son utilizables en móvil, tablet y escritorio, sin desbordamiento horizontal.
- Las tarjetas de partidos tienen bordes poco redondeados, muestran una iluminación leve y contrastante del borde al pasar el mouse, y presentan foco equivalente al navegar con teclado.
- Al activar una zona no interactiva de la tarjeta se abre su sala; sus controles internos conservan su comportamiento y no disparan accidentalmente la navegación de la tarjeta.
- Los controles comunes proceden del UI kit existente reorganizado y no de estilos visuales duplicados.
- Los estilos estáticos de JSX se implementan con Tailwind; cualquier excepción dinámica está identificada y justificada.
- El rediseño no modifica contratos de API, datos, lógica de negocio ni navegación funcional.
- Lint y build terminan correctamente y las rutas principales pasan la revisión visual en los tres tamaños indicados.
