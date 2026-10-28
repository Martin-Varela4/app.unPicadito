# Auditoría de Componentes, Custom Hooks y Reutilización en React

## 1. Resumen ejecutivo

- **Estado general de la arquitectura:** La aplicación *unPicadito* presenta una base funcional moderna sobre React 19, Vite, Tailwind CSS v4, Zustand y React Router v7. Su estructura híbrida (mezcla de capas globales en `src/components/` y módulos temáticos en `src/features/`) muestra una intención clara de modularización por dominio (`matches`, `auth`, `players`, `profile`, `messajes`, `friendship`, `wallet`). No obstante, conviven inconsistencias arquitectónicas serias: fragmentación de estilos, código duplicado sin abstraer, dependencias muertas o huérfanas, componentes genéricos subutilizados (`Card`, `ToggleGroup`), e implementaciones desalineadas con la convención visual global del proyecto (como ocurre en `messajes` y `AfterMatch.jsx`).
- **Principales problemas detectados:**
  1. *Fugas de consistencia y diseño fracturado:* Mientras la mayor parte de la app opera sobre tema oscuro con variables CSS semánticas (`var(--color-background-main)`, `var(--color-border-subtle)`), el módulo `src/features/messajes/` tiene hardcodeadas clases claras (`bg-white`, `text-black`, `bg-[#efeae2]`, fuentes directas) y conexiones HTTP desalineadas (`axios.get('http://localhost:3000/...')` en lugar del cliente singleton configurado).
  2. *Duplicación de estructuras y patrones UI recurrentes:* Bloques de alertas de error (`bg-red-950/40 border-red-500/40 text-red-200`) repetidos idénticamente en más de 8 archivos; estados vacíos dispersos con combinaciones heterogéneas; tarjetas/paneles que no usan el componente `Card` existente en `src/components/ui/Card.jsx`.
  3. *Inconsistencia de Custom Hooks y Estado:* Lógica duplicada de formularios (manejo manual de campos vs Yup sin unificar), múltiples llamadas a `getMyProfile()` en montajes de `Navbar` y `MessagesPage` que deberían nutrirse de la sesión persistida de Zustand (`useAuthStore`).
  4. *Componentes muertos o aislados:* `src/components/HourPicker.jsx` no es consumido por nadie (las pantallas de creación y edición generan su propio `<select>` de 24 horas inline). `CardHeader` y `CardFooter` existen pero ningún componente del proyecto los importa. `src/features/wallet/` no está integrado en la navegación ni en el flujo de partidos.
  5. *Mala gestión de props y valores por defecto:* Uso redundante de `variant="primary"` o `type="button"` en llamadas a `Button`, selectores Tailwind con variables arbitrarias repetidas 164 veces (`[var(--color-...)]`) por falta de alias semánticos nativos de Tailwind v4 en el `@theme`.
- **Oportunidades de reutilización legítimas:**
  - Extracción de componentes transversales de UI esenciales: `Alert` (o `ErrorAlert`), `EmptyState`, `PageHeader`, `FormField`.
  - Consolidación del selector de horarios (`HourSelect` reutilizable en lugar de la duplicación en `EditRoomFields.jsx`).
  - Extracción de un custom hook transversal `useAsyncAction` o específico `useRoomActions` para unificar `useCancelRoom` y `useLeaveRoom`.
- **Riesgos de sobreingeniería evitados:**
  - No se recomienda crear microcomponentes para cada bloque `<div>` o fila de información estadística si no representan una entidad con ciclo de vida o variación independiente.
  - No se recomienda migrar forzosamente a React Hook Form o bibliotecas externas pesadas; Yup ya está instalado y cubre las validaciones requeridas si se centralizan adecuadamente.
  - No se promueve la memoización innecesaria (`useMemo`/`useCallback` indiscriminados) en componentes de baja frecuencia de renderizado.
- **Mejoras de mayor impacto:**
  1. Estandarizar el cliente API e interceptores en `messajes` y corregir URLs hardcodeadas a `localhost:3000`.
  2. Reemplazar alertas repetidas por un componente transversal `Alert`.
  3. Desacoplar la carga de perfil en `Navbar` del backend si ya reside en `useAuthStore`.
  4. Homogeneizar Tailwind CSS v4 para erradicar las clases arbitrarias `[var(--color-...)]` mediante clases de utilidad semántica (`bg-background-main`, `border-border-subtle`, `text-brand-primary`).

---

## 2. Alcance y metodología

### Carpetas y archivos analizados
- **Raíz del frontend:** `package.json`, `vite.config.js`, `eslint.config.js`, `index.html`.
- **Capas globales:**
  - `src/components/` (`Navbar.jsx`, `MainLayout.jsx`, `ConfirmModal.jsx`, `HourPicker.jsx`).
  - `src/components/ui/` (`Avatar.jsx`, `Badge.jsx`, `Button.jsx`, `Card.jsx`, `Input.jsx`, `ProgressBar.jsx`, `SearchInput.jsx`, `Select.jsx`, `Spinner.jsx`, `Switch.jsx`, `ToggleGroup.jsx`).
  - `src/hooks/` (`useDebounce.js`).
  - `src/api/` (`axiosInstance.js`).
  - `src/routes/` (`AppRoutes.jsx`, `ProtectedRoute.jsx`, `PublicRoute.jsx`).
  - `src/index.css` (directivas Tailwind v4 y variables CSS de `@theme`).
- **Módulos de feature:**
  - `src/features/auth/` (componentes, hooks, schemas, servicios, stores, páginas).
  - `src/features/matches/` (pantallas de lista, detalle, creación, edición, pizarrón táctico, filtros, cards, modales).
  - `src/features/players/` (búsqueda, lista, store, schemas, servicios).
  - `src/features/profile/` (vista de perfil, edición, estadísticas, reseñas, stores y mappers).
  - `src/features/messajes/` (chat, socket, servicio, página de mensajes).
  - `src/features/friendship/` (botones de acción, listas pendientes, servicios, stores).
  - `src/features/wallet/` (widgets, store, API, resumen de descuento).
  - `src/features/home/` (página de bienvenida, hero y próximos partidos).

### Dependencias verificadas en package.json
- `react`: `^19.2.6`
- `react-dom`: `^19.2.6`
- `react-router-dom`: `^7.18.2`
- `axios`: `^1.19.0`
- `zustand`: `^5.0.15`
- `yup`: `^1.7.1`
- `tailwindcss`: `^4.3.3`
- `@tailwindcss/vite`: `^4.3.3`
- `lucide-react`: `^1.48.0`
- `leaflet`: `^1.9.4`
- `react-leaflet`: `^5.0.0`
- `socket.io-client`: `^4.8.4`

### Limitaciones del análisis
- La auditoría se realiza exclusivamente a nivel de código estático frontend sin ejecutar un servidor backend vivo.
- Las referencias a endpoints (`/users`, `/salas`, `/friendships`, `/wallet/balance`) se verifican contra los servicios locales y constantes del repositorio.

---

## 3. Inventario de componentes y hooks

| Nombre | Ubicación | Responsabilidad | Ámbito actual | Problemas detectados | Acción recomendada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Button` | `src/components/ui/Button.jsx` | Botón interactivo accesible con variantes visuales y spinner. | Transversal | Excelente implementación base; sin embargo, en múltiples llamadas los consumidores pasan props redundantes (`variant="primary"` por defecto, o `type="button"` innecesario). | **Mantener**. Simplificar su consumo omitiendo props por defecto. |
| `Input` | `src/components/ui/Input.jsx` | Control de entrada de texto etiquetado con feedback de error. | Transversal | Bien implementado con `forwardRef`. Clases `min-h-11` garantizan accesibilidad táctil. | **Mantener**. |
| `Select` | `src/components/ui/Select.jsx` | Selector nativo estilizado con opciones tipadas y error. | Transversal | Soporta placeholder automático si falta opción vacía. | **Mantener**. Reutilizar en lugares donde se usa `<select>` plano (como `EditRoomFields.jsx`). |
| `Avatar` | `src/components/ui/Avatar.jsx` | Imagen de perfil con fallback a imagen local ante error. | Transversal | Maneja fallback local con estado reactivo. | **Mantener**. Consumir en `MessagesPage.jsx` donde se usan tags `<img>` planos. |
| `Badge` | `src/components/ui/Badge.jsx` | Píldora de estado o categoría con mapas de color estáticos. | Transversal | Mapa de variantes rígido que mezcla status, modalidades y niveles en un solo objeto. | **Simplificar**. Desacoplar variantes o permitir color semántico directo. |
| `Card` | `src/components/ui/Card.jsx` | Contenedor de tarjeta visual con bordes y fondo semántico. | Transversal | Solo se usa `<Card>` y `<CardContent>`. `CardHeader` y `CardFooter` están huérfanos. | **Mantener base**. Eliminar subcomponentes no utilizados o integrarlos limpiamente. |
| `ProgressBar` | `src/components/ui/ProgressBar.jsx` | Barra de porcentaje accesible (`role="progressbar"`). | Transversal | Bien implementado con atributos ARIA completos. Solo consumido en `MatchCard`. | **Mantener**. |
| `SearchInput` | `src/components/ui/SearchInput.jsx` | Input con icono de lupa y botón para limpiar búsqueda. | Transversal | Solo se usa en `MatchesPage.jsx`. `SearchBar` en `players` duplica su funcionalidad. | **Unificar**. Reemplazar `SearchBar` de players por este componente. |
| `Spinner` | `src/components/ui/Spinner.jsx` | Indicador SVG animado con tamaños configurables (`sm`, `md`, `lg`). | Transversal | Robusto y accesible (`role="status"`). | **Mantener**. Reemplazar spinners improvisados en `WalletWidget`. |
| `Switch` | `src/components/ui/Switch.jsx` | Toggle accesible de activación booleana. | Transversal | Bien implementado con checkbox nativo oculto (`sr-only`). | **Mantener**. |
| `ToggleGroup` | `src/components/ui/ToggleGroup.jsx` | Grupo de botones para selección única entre opciones. | Transversal | **No se utiliza en ninguna parte de la aplicación**. | **Evaluar / Archivar** si no hay requerimiento a corto plazo. |
| `HourPicker` | `src/components/HourPicker.jsx` | Selector de horarios en punto de 00:00 a 23:00. | Transversal | **Código muerto**. No es consumido por ningún archivo. Fallas de linter (`React` no usado). | **Refactorizar y consumir** en `EditRoomFields.jsx` o eliminar si se integra a `Select`. |
| `ConfirmModal` | `src/components/ConfirmModal.jsx` | Diálogo modal accesible para confirmar acciones críticas. | Transversal | Permite children o props directas `title`/`message`. | **Mantener**. Estandarizar su botón secundario con el `Button` del sistema. |
| `MainLayout` | `src/components/MainLayout.jsx` | Marco visual global que integra `Navbar` y `Outlet`. | Transversal | Limpio y conciso. | **Mantener**. |
| `Navbar` | `src/components/Navbar.jsx` | Barra superior y navegación móvil inferior. | Transversal | Ejecuta una petición HTTP directa (`getMyProfile`) en montaje en vez de usar `useAuthStore`. | **Simplificar**. Consumir perfil desde el store global de autenticación. |
| `AuthForm` | `src/features/auth/components/AuthForm.jsx` | Formulario dinámico de inicio de sesión y registro. | Feature (`auth`) | Bien estructurado, delega en `useAuth`. Alerta de error repetida inline. | **Mantener**. Reemplazar alerta inline por componente `Alert`. |
| `AddFriendButton` | `src/features/friendship/components/AddFriendButton.jsx` | Botón interactivo para enviar solicitud de amistad. | Feature (`friendship`) | Control de estado local y store. Alerta inline repetida. | **Mantener**. Usar componente `Alert`. |
| `PendingRequestsList` | `src/features/friendship/components/PendingRequestsList.jsx` | Lista de solicitudes entrantes de amistad. | Feature (`friendship`) | Estructura clara con manejo de estados de carga y vacíos. | **Mantener**. |
| `MatchCard` | `src/features/matches/components/MatchCard.jsx` | Tarjeta resumen de partido con cupos, fecha, estado y acciones. | Feature (`matches`) | Componente sobrecargado (233 líneas) con lógica de confirmación modal interna para cancelar y lógica de unión. | **Simplificar**. Extraer el submodal de cancelación a un gestor dedicado o invocar confirmación unificada. |
| `MatchFilters` | `src/features/matches/components/MatchFilters.jsx` | Barra de filtrado por cancha, privacidad, fecha, hora y cupo. | Feature (`matches`) | Bien desglosada con inputs, selects y switch. | **Mantener**. |
| `MatchGrid` | `src/features/matches/components/MatchGrid.jsx` | Cuadrícula responsiva de partidos con estados de carga/error. | Feature (`matches`) | Presentación clara. | **Mantener**. |
| `PlayerCard` (matches) | `src/features/matches/components/PlayerCard.jsx` | Fila/tarjeta de jugador confirmado o suplente en sala. | Feature (`matches`) | Incluye menú de acciones contextuales accesible con manejo de escape y clicks externos. | **Mantener**. |
| `RoomHeader` | `src/features/matches/components/RoomHeader.jsx` | Cabecera de sala con badges de estado, rol y botón unirse/editar. | Feature (`matches`) | Buena composición y separación visual. | **Mantener**. |
| `RoomInfoCard` | `src/features/matches/components/RoomInfoCard.jsx` | Panel con horario, lugar y mapa Leaflet embebido. | Feature (`matches`) | Cohesivo y específico del dominio. | **Mantener**. |
| `RoomJoinRequests` | `src/features/matches/components/RoomJoinRequests.jsx` | Lista de solicitudes de unión pendientes de aprobación. | Feature (`matches`) | Inconsistencia de diseño: usa `rounded-2xl`, botones ad-hoc y clases no estándar. | **Refactorizar visualmente** para alinearlo al diseño general. |
| `RoomParticipantsList` | `src/features/matches/components/RoomParticipantsList.jsx` | Lista dividida entre titulares y suplentes. | Feature (`matches`) | Limpio, delega en `PlayerCard`. | **Mantener**. |
| `RoomSlotsSummary` | `src/features/matches/components/RoomSlotsSummary.jsx` | Estadísticas rápidas de cupos (máximo, confirmados, vacantes). | Feature (`matches`) | Presentación pura sin efectos colaterales. | **Mantener**. |
| `TacticalBoard` | `src/features/matches/components/TacticalBoard.jsx` | Representación interactiva de cancha con posiciones tácticas. | Feature (`matches`) | Lógica visual compleja pero aislada y autocontenida. | **Mantener**. |
| `LocationPickerMap` | `src/features/matches/components/LocationPickerMap.jsx` | Selector de coordenadas geográficas sobre Leaflet. | Feature (`matches`) | Maneja ciclo de vida de mapas e interactividad de pines con referencias seguras. | **Mantener**. |
| `CancelRoomManager` | `src/features/matches/components/CancelRoomManager.jsx` | Flujo de cancelación con modal y validación de motivo. | Feature (`matches`) | Bien encapsulado. | **Mantener**. |
| `LeaveRoomManager` | `src/features/matches/components/LeaveRoomManager.jsx` | Flujo de abandono de sala con modal de advertencia. | Feature (`matches`) | Bien encapsulado. | **Mantener**. |
| `EditRoomFields` | `src/features/matches/components/EditRoom/EditRoomFields.jsx` | Formulario común de campos de sala (fecha, hora, cancha, etc.). | Módulo (`matches`) | Reutilizado entre `CreateRoomPage` y `EditRoomPage`. Usa `<select>` plano para horarios. | **Mantener**. Reemplazar el select de hora manual por un componente formalizado. |
| `ChatComponent` | `src/features/messajes/components/Chat.jsx` | Ventana de conversación en tiempo real mediante Socket.io. | Feature (`messajes`) | Estilos desalineados (tema claro forzado `bg-white`, `border-[#ccc]`), Axios directo en vez de singleton API. | **Refactorizar integralmente** para cumplir estándares de arquitectura del proyecto. |
| `PlayerList` (players) | `src/features/players/components/PlayerList.jsx` | Lista de perfiles de jugadores encontrados. | Feature (`players`) | Usa `alert()` y `console.log()` para acciones futuras. Estructura repetitiva de tarjetas. | **Mantener**. Reemplazar `alert` por notificación o deshabilitar acción con estado visual claro. |
| `SearchBar` (players) | `src/features/players/components/SearchBar.jsx` | Input de búsqueda específico con icono emoji. | Feature (`players`) | Duplicado funcional de `SearchInput`. | **Reemplazar** por `SearchInput`. |
| `AboutSection` | `src/features/profile/components/AboutSection.jsx` | Sección biográfica del jugador (edad, ubicación, etc.). | Feature (`profile`) | Limpio y presentacional. | **Mantener**. |
| `ProfileHeader` | `src/features/profile/components/ProfileHeader.jsx` | Portada, avatar principal y nombre del usuario. | Feature (`profile`) | Buena gestión de errores de imagen de portada. | **Mantener**. |
| `ProfileRanking` | `src/features/profile/components/ProfileRanking.jsx` | Promedio de estrellas del perfil. | Feature (`profile`) | Presentacional y defensivo ante valores nulos. | **Mantener**. |
| `ProfileReviews` | `src/features/profile/components/ProfileReviews.jsx` | Lista de reseñas recibidas por el usuario. | Feature (`profile`) | Presentacional claro. | **Mantener**. |
| `WalletWidget` | `src/features/wallet/components/WalletWidget.jsx` | Widget informativo de saldo a favor. | Feature (`wallet`) | Aislado, sin consumo en páginas reales. | **Mantener** para futura integración. |
| `WalletDiscountSummary` | `src/features/wallet/components/WalletDiscountSummary.jsx` | Desglose de costos y descuento aplicable por billetera. | Feature (`wallet`) | Componente desacoplado preparado para pasarelas de pago. | **Mantener**. |

### Hooks existentes

| Nombre | Ubicación | Tipo | Responsabilidad | Problemas detectados | Acción recomendada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useDebounce` | `src/hooks/useDebounce.js` | Transversal | Retrasa actualización de valor para búsquedas. | Archivo canónico transversal. | **Mantener**. |
| `useAuth` | `src/features/auth/hooks/useAuth.js` | Feature | Orquesta inicio de sesión, registro y errores de formulario. | Muy bien encapsulado con validación Yup y Zustand. | **Mantener**. |
| `useMatches` | `src/features/matches/hooks/useMatches.js` | Feature | Gestiona filtros, listado de partidos, unión y abandono. | Robusto y bien aislado. | **Mantener**. |
| `useCreateRoom` | `src/features/matches/hooks/useCreateRoom.js` | Feature | Maneja estado y envío del formulario de nueva sala. | Claro y desacoplado de la vista. | **Mantener**. |
| `useEditRoom` | `src/features/matches/hooks/useEditRoom.js` | Feature | Maneja precarga, bloqueo por 24hs y patch de sala. | Bien estructurado. | **Mantener**. |
| `useCancelRoom` | `src/features/matches/hooks/useCancelRoom.js` | Feature | Ejecuta cancelación con estado de carga y error. | Simple (25 líneas). | **Mantener**. |
| `useLeaveRoom` | `src/features/matches/hooks/useLeaveRoom.js` | Feature | Ejecuta abandono de partido con estado de carga y error. | Estructura análoga a `useCancelRoom`. | **Mantener**. |
| `useRoomOrganizer` | `src/features/matches/hooks/useRoomOrganizer.js` | Feature | Gestiona modales y acciones de expulsión / traspaso. | Cohesivo con la lógica de moderación de salas. | **Mantener**. |
| `useProfile` | `src/features/profile/hooks/useProfile.js` | Feature | Recupera perfil propio o público por ID con reseñas. | Limpio y conciso. | **Mantener**. |

---

## 4. Auditoría de duplicaciones en JSX

### 4.1. Alertas de error de backend y validación
- **Archivos afectados:**
  - `src/features/auth/components/AuthForm.jsx` (líneas 28-31)
  - `src/features/friendship/components/AddFriendButton.jsx` (líneas 27-29)
  - `src/features/friendship/components/PendingRequestsList.jsx` (línea 32)
  - `src/features/home/components/page/HomePage.jsx` (líneas 89-91)
  - `src/features/matches/components/MatchGrid.jsx` (líneas 15-18)
  - `src/features/matches/pages/CreateRoomPage.jsx` (líneas 16-18)
  - `src/features/players/pages/PlayersPage.jsx` (líneas 55-57 y 69-77)
- **Patrón duplicado:**
  ```jsx
  <div role="alert" className="p-3 mb-4 rounded-md bg-red-950/40 border border-red-500/40 text-sm text-red-200 flex items-center gap-2">
    <span>⚠️</span>
    <span>{errorMessage}</span>
  </div>
  ```
- **Diferencias:** Variaciones minúsculas en redondeado (`rounded-lg` vs `rounded-sm` vs `rounded-md`), espaciados internos y presencia o ausencia de icono.
- **Abstracción recomendada:** Componente transversal `<Alert variant="error | warning | info | success">` en `src/components/ui/Alert.jsx`.

### 4.2. Contenedor de sección / panel estándar
- **Archivos afectados:**
  - `src/features/matches/components/MatchFilters.jsx`
  - `src/features/matches/components/RoomHeader.jsx`
  - `src/features/matches/components/RoomInfoCard.jsx`
  - `src/features/matches/components/RoomSlotsSummary.jsx`
  - `src/features/matches/components/RoomParticipantsList.jsx`
  - `src/features/profile/components/AboutSection.jsx`
  - `src/features/profile/components/ProfileRanking.jsx`
  - `src/features/profile/components/ProfileReviews.jsx`
  - `src/features/friendship/components/PendingRequestsList.jsx`
- **Patrón duplicado:**
  ```jsx
  <section className="rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6">
    <h2 className="border-b border-[var(--color-border-subtle)] pb-2 text-lg font-semibold text-slate-100">
      Título de la Sección
    </h2>
    ...
  </section>
  ```
- **Diferencias:** Elemento semántico utilizado (`div` vs `section`), encabezados `h2` vs `h3`.
- **Abstracción recomendada:** En lugar de crear un envoltorio rígido que complique la jerarquía DOM, se recomienda reutilizar el componente existente `Card` y `CardContent` agregando si es necesario un `CardHeader` estandarizado, o configurar la clase semántica de Tailwind `@utility panel-card` para mantener legibilidad sin sobreingeniería.

### 4.3. Bloque de estados vacíos (Empty States)
- **Archivos afectados:**
  - `src/features/home/components/page/HomePage.jsx` (líneas 95-105)
  - `src/features/matches/components/MatchGrid.jsx` (líneas 24-29)
  - `src/features/matches/components/RoomJoinRequests.jsx` (líneas 22-24)
  - `src/features/friendship/components/PendingRequestsList.jsx` (línea 35)
  - `src/features/players/pages/PlayersPage.jsx` (líneas 94-104)
- **Patrón duplicado:** Contenedor centrado con icono grande o emoji (`⚽`, `🏃‍♂️💨`), texto principal en negrita, subtítulo explicativo atenuado (`text-slate-400`) y botón opcional de llamado a la acción.
- **Abstracción recomendada:** Componente transversal `<EmptyState icon={...} title={...} description={...} action={...} />`.

### 4.4. Selector de horas en punto
- **Archivos afectados:**
  - `src/features/matches/components/EditRoom/EditRoomFields.jsx` (líneas 7-10 y 61-75)
  - `src/components/HourPicker.jsx` (líneas 5-8 y 11-25)
- **Patrón duplicado:** Generación de un arreglo de 24 horas (`00:00` a `23:00`) y renderizado en un elemento `<select>`.
- **Abstracción recomendada:** Unificar en `HourPicker.jsx` adaptado a la API de `Select.jsx` y consumirlo directamente en `EditRoomFields.jsx`.

---

## 5. Auditoría de componentes

### Componentes que deben mantenerse tal como están
- `src/components/ui/Button.jsx`: Implementación modelo, maneja accesibilidad, estados de carga y variantes consistentes.
- `src/components/ui/Input.jsx`: Robusto con `forwardRef` y estados de error claros.
- `src/components/ui/Switch.jsx`: Accesible y minimalista.
- `src/components/ui/ProgressBar.jsx`: Cumple estándares ARIA y semántica visual.
- `src/features/matches/components/TacticalBoard.jsx`: Muy alta cohesión visual de dominio sin fugas de responsabilidad.
- `src/features/matches/components/LocationPickerMap.jsx`: Correcto encapsulamiento de Leaflet para prevenir fugas de memoria y sincronizaciones no deseadas.

### Componentes que necesitan simplificación
- `src/components/Navbar.jsx`: Eliminar el `useEffect` con llamada a `getMyProfile()` en cada montaje; el usuario ya se encuentra disponible en `useAuthStore((state) => state.user)`.
- `src/features/matches/components/MatchCard.jsx`: Extraer el diálogo modal de confirmación de cancelación (`ConfirmModal` de líneas 185-229) para que el card permanezca puramente presentacional/interactivo básico y delegue la confirmación al hook organizador o vista padre.
- `src/features/matches/components/RoomJoinRequests.jsx`: Normalizar clases Tailwind v4 (`rounded-2xl` -> `rounded-md`, botones custom -> `<Button>`).

### Componentes que deben unificarse o eliminarse
- `src/features/players/components/SearchBar.jsx`: Eliminar y reemplazar por `src/components/ui/SearchInput.jsx`.
- `src/components/HourPicker.jsx`: Actualizarlo para usar los estilos del sistema y consumirlo en `EditRoomFields.jsx`, eliminando la generación manual repetida.
- `src/components/ui/ToggleGroup.jsx`: Archivar o documentar como componente de catálogo experimental si no tiene consumidor activo.

---

## 6. Auditoría de custom hooks

### Diagnóstico de la arquitectura de hooks

1. **Hooks específicos de feature (adecuadamente ubicados):**
   - `useAuth`: Encapsula autenticación, validación Yup y sincronización de sesión.
   - `useMatches`: Encapsula consulta con filtros, abandono e inscripción a partidos.
   - `useCreateRoom` / `useEditRoom`: Aislan la lógica de validación, mutación y patch de salas.
   - `useRoomOrganizer`: Concentra la lógica de expulsión y transferencia de capitanía.
   - `useProfile`: Maneja la doble naturaleza de perfiles públicos y privados.

2. **Oportunidad de Custom Hook transversal (`useAsyncAction`):**
   - `useCancelRoom` (25 líneas) y `useLeaveRoom` (25 líneas) repiten exactamente la misma estructura de gestión de estado:
     ```js
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState('');
     const execute = async (...) => { ... setIsLoading(true) ... }
     ```
   - **Evaluación pragmática:** Dado que ambos hooks tienen solo 25 líneas y representan semánticas de dominio muy directas, unificarlos en un hook genérico añadiría una capa de indirección con poco beneficio real. Es preferible mantener ambos hooks con nombres claros de dominio, o consolidar las acciones de sala en un hook `useRoomParticipation` dentro de la feature `matches`.

3. **Lógica pura que no debe ser Hook:**
   - La función `isUpcoming` en `useMatches.js` y `isWithin24Hours` en `dateUtils.js` son funciones puras. Se encuentran adecuadamente ubicadas fuera del ciclo de vida de React.

---

## 7. Auditoría de props y variantes predeterminadas

| Componente | Prop analizada | Valor por defecto verificado | Uso actual en el proyecto | Cambio recomendado | Riesgo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Button` | `variant` | `'primary'` | `<Button variant="primary">` en `HomePage`, `ProfileEdit`, `MatchCard`. | Omitir `variant` cuando se requiere la apariencia primaria. | Ninguno. Mantiene exactamente las mismas clases CSS. |
| `Button` | `type` | `'button'` | `<Button type="button">` en `CreateRoomPage`, `ProfileEdit`. | Omitir si solo es un botón de acción estándar sin comportamiento submit. | Ninguno. |
| `Input` | `type` | `'text'` | `<Input type="text">` en `MatchFilters.jsx` y `ProfileEdit.jsx`. | Omitir la prop `type` cuando es texto simple. | Ninguno. |
| `Spinner` | `size` | `'md'` | `<Spinner size="md">` en `EditRoomPage`. | Omitir `size` cuando se desea el tamaño estándar. | Ninguno. |
| `SearchInput`| `placeholder`| `'Buscar...'` | `<SearchInput placeholder="Buscar...">` | Omitir cuando no se requiere un texto personalizado. | Ninguno. |
| `LocationPickerMap` | `readOnly` | `false` | `<LocationPickerMap readOnly={false} />` | Omitir prop cuando está en modo edición. | Ninguno. |

---

## 8. Auditoría de Tailwind CSS y estructuras visuales

### 8.1. Abuso de sintaxis de valores arbitrarios para variables de tema
- **Hallazgo:** Existen **164 ocurrencias** en 40 archivos de la sintaxis:
  - `bg-[var(--color-background-main)]`
  - `bg-[var(--color-background-card)]`
  - `border-[var(--color-border-subtle)]`
  - `text-[var(--color-brand-primary)]`
  - `hover:bg-[var(--color-brand-primary-dark)]`
  - `text-[#21263A]` (11 ocurrencias idénticas del texto oscuro sobre fondos lima).
- **Causa raíz:** En Tailwind CSS v4 (`src/index.css`), se declararon las variables dentro de `@theme` con prefijos `--color-*`, pero no se vincularon las utilidades de color semántico directamente o los desarrolladores no las utilizaron, recurriendo a cadenas arbitrarias manuales.
- **Solución recomendada:**
  Actualizar `src/index.css` para mapear limpiamente los tokens en Tailwind v4:
  ```css
  @theme {
    --color-brand-light: #c7cee8;
    --color-brand-primary: #d0d34d;
    --color-brand-primary-dark: #b8bb43;
    --color-brand-green: #157954;
    --color-brand-dark: #21263A;
    --color-background-main: #0f172a;
    --color-background-card: #1e293b;
    --color-border-subtle: #334155;
  }
  ```
  Esto permite usar directamente clases limpias y mantenibles:
  `bg-background-main`, `bg-background-card`, `border-border-subtle`, `text-brand-primary`, `text-brand-dark`.

### 8.2. Clases fantasma o no declaradas
- En `src/features/profile/pages/ProfileEdit.jsx` (líneas 132, 143, 224), se usa la clase `text-[var(--color-text-secondary)]`.
- **Verificación:** `--color-text-secondary` **no está definida** en `src/index.css`. Como resultado, los elementos no heredan el color secundario esperado y recurren a valores predeterminados o vacíos.
- **Acción:** Corregir usando la paleta existente (`text-slate-400` o declarar `--color-text-secondary: #94a3b8;` en `@theme`).

### 8.3. Isla de diseño desconectada en `messajes`
- `src/features/messajes/components/Chat.jsx` y `MessagesPage.jsx` utilizan estilos en línea y clases de diseño claro (`bg-[#f9f9f9]`, `bg-[#0078ff]`, `border-[#ccc]`, `text-black`), lo cual genera una ruptura visual completa respecto al resto de la aplicación (modo oscuro general). Deben adoptarse las clases del sistema UI (`bg-background-card`, `border-border-subtle`, etc.).

---

## 9. Propuesta de arquitectura

Se recomienda una estructura que respete la modularización por features consolidada en el proyecto, saneando la capa transversal `src/components/ui/`:

```text
src/
├── api/
│   └── axiosInstance.js               # Cliente HTTP singleton con interceptores JWT
├── assets/                            # Recursos gráficos globales
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx             # Shell principal con Outlet
│   │   └── Navbar.jsx                 # Barra de navegación superior y móvil
│   ├── ui/                            # Componentes atómicos transversales
│   │   ├── Alert.jsx                  # [NUEVO] Alertas y notificaciones contextuales
│   │   ├── Avatar.jsx                 # Imagen de usuario con fallback defensivo
│   │   ├── Badge.jsx                  # Píldora de estado simplificada
│   │   ├── Button.jsx                 # Botón del sistema con estados de carga
│   │   ├── Card.jsx                   # Tarjeta y panel unificado
│   │   ├── ConfirmModal.jsx           # Diálogo modal transversal
│   │   ├── EmptyState.jsx             # [NUEVO] Estado vacío unificado
│   │   ├── HourPicker.jsx             # [UNIFICADO] Selector de horas 00:00 - 23:00
│   │   ├── Input.jsx                  # Input de formulario
│   │   ├── ProgressBar.jsx            # Barra de progreso accesible
│   │   ├── SearchInput.jsx            # Input de búsqueda con botón de limpieza
│   │   ├── Select.jsx                 # Selector desplegable estilizado
│   │   ├── Spinner.jsx                # Indicador de carga
│   │   └── Switch.jsx                 # Interruptor booleano
├── constants/
│   └── appConstants.js                # Constantes transversales de app
├── features/
│   ├── auth/                          # Feature: Autenticación y registro
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── store/
│   ├── friendship/                    # Feature: Solicitudes de amistad
│   ├── home/                          # Feature: Portada y bienvenida
│   ├── matches/                       # Feature: Partidos, salas, pizarrones
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── messajes/                      # Feature: Mensajería en tiempo real
│   ├── players/                       # Feature: Búsqueda de jugadores
│   ├── profile/                       # Feature: Perfil, reputación y reseñas
│   └── wallet/                        # Feature: Billetera y saldos
├── hooks/
│   └── useDebounce.js                 # Custom hooks utilitarios transversales
├── routes/
│   ├── AppRoutes.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
└── services/
    └── socket.js                      # Conexión Socket.io singleton
```

---

## 10. Catálogo de abstracciones recomendadas

### Propuesta 1: Componente Transversal `<Alert />`
- **Nombre sugerido:** `Alert`
- **Tipo de abstracción:** Componente React
- **Ubicación propuesta:** `src/components/ui/Alert.jsx`
- **Responsabilidad:** Mostrar mensajes de error, advertencia, éxito o información de forma visualmente consistente y accesible (`role="alert"`).
- **Consumidores:** `AuthForm`, `AddFriendButton`, `PendingRequestsList`, `HomePage`, `MatchGrid`, `CreateRoomPage`, `PlayersPage`.
- **Props:**
  ```typescript
  {
    variant?: 'error' | 'warning' | 'info' | 'success'; // defecto: 'error'
    message?: string;
    children?: ReactNode;
    className?: string;
  }
  ```
- **Beneficios:** Erradica 8 repeticiones idénticas de bloques de error en JSX y unifica los colores del estado de error.
- **Riesgos:** Ninguno.

### Propuesta 2: Componente Transversal `<EmptyState />`
- **Nombre sugerido:** `EmptyState`
- **Tipo de abstracción:** Componente React
- **Ubicación propuesta:** `src/components/ui/EmptyState.jsx`
- **Responsabilidad:** Presentar una pantalla de lista vacía o sin coincidencias de forma atractiva, coherente y con acción opcional.
- **Consumidores:** `HomePage` (sin partidos), `MatchGrid` (sin resultados), `PendingRequestsList` (sin solicitudes), `PlayersPage` (sin jugadores).
- **Props:**
  ```typescript
  {
    icon?: ReactNode | string;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
  }
  ```
- **Beneficios:** Centraliza la experiencia de usuario en estados vacíos y reduce código JSX disperso.
- **Riesgos:** Ninguno si se usa composición con `action`.

### Propuesta 3: Unificación del Selector de Horarios `<HourPicker />`
- **Nombre sugerido:** `HourPicker`
- **Tipo de abstracción:** Componente React
- **Ubicación propuesta:** `src/components/ui/HourPicker.jsx`
- **Responsabilidad:** Encapsular la generación de horas de 00:00 a 23:00 en un control estándar utilizando internamente `<Select />`.
- **Consumidores:** `src/features/matches/components/EditRoom/EditRoomFields.jsx`.
- **Props:**
  ```typescript
  {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
    label?: string;
  }
  ```
- **Beneficios:** Elimina código muerto (`src/components/HourPicker.jsx` actual con error de ESLint) y limpia la generación manual en `EditRoomFields.jsx`.
- **Riesgos:** Ninguno.

---

## 11. Ejemplos de refactorización

### 11.1. Alerta de error unificada (Caso real confirmado)

#### Antes (`src/features/auth/components/AuthForm.jsx`):
```jsx
{apiError && (
  <div className="p-3 text-sm text-red-200 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2">
    <span>⚠️</span>
    <span>{apiError}</span>
  </div>
)}
```

#### Después con `<Alert />`:
```jsx
{apiError && <Alert message={apiError} />}
```

---

### 11.2. Unificación del buscador en Jugadores (Caso real confirmado)

#### Antes (`src/features/players/pages/PlayersPage.jsx`):
```jsx
// Depende de un componente local `SearchBar.jsx` que recrea un input con emoji
import { SearchBar } from "../components/SearchBar";

// En el JSX:
<SearchBar value={searchInput} onChange={setSearchInput} />
```

#### Después con `<SearchInput />`:
```jsx
import SearchInput from "../../../components/ui/SearchInput";

// En el JSX:
<SearchInput
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  onClear={() => setSearchInput("")}
  placeholder="Buscar por nombre o usuario..."
/>
```

---

### 11.3. Optimización de consumo de props en `<Button />` (Caso real confirmado)

#### Antes (`src/features/profile/pages/ProfileEdit.jsx`):
```jsx
<Button
  type="submit"
  variant="primary"
  disabled={saving}
  className="w-full sm:w-auto"
>
  <Save className="mr-2 h-4 w-4" />
  {saving ? "Guardando..." : "Guardar Cambios"}
</Button>
```

#### Después (aprovechando valores por defecto verificados: `variant = "primary"`):
```jsx
<Button
  type="submit"
  disabled={saving}
  className="w-full sm:w-auto"
>
  <Save className="mr-2 h-4 w-4" />
  {saving ? "Guardando..." : "Guardar Cambios"}
</Button>
```

---

## 12. Plan de refactorización priorizado

### Fase P0: Problemas críticos de arquitectura e inconsistencias operativas
- **T-01: Reparar cliente HTTP y Socket en módulo `messajes`:**
  - *Archivos:* `src/features/messajes/components/Chat.jsx`, `src/features/messajes/pages/MessagesPage.jsx`, `src/features/messajes/services/messajeService.js`.
  - *Cambio:* Reemplazar llamadas a `axios.get('http://localhost:3000/...')` por el singleton `src/api/axiosInstance.js`. Unificar socket client importando desde `src/services/socket.js`.
  - *Criterio de aceptación:* No deben quedar URLs de backend hardcodeadas ni llamadas Axios desprotegidas del interceptor JWT.
- **T-02: Corregir variables inexistentes en Tailwind CSS:**
  - *Archivos:* `src/features/profile/pages/ProfileEdit.jsx`, `src/index.css`.
  - *Cambio:* Eliminar `text-[var(--color-text-secondary)]` y reemplazar por `text-slate-400`.
  - *Criterio de aceptación:* Todos los estilos visuales resuelven contra variables declaradas en `@theme`.

### Fase P1: Abstracciones clave y eliminación de duplicación evidente
- **T-03: Crear componente transversal `Alert` y migrar consumidores:**
  - *Archivos:* `src/components/ui/Alert.jsx`, `AuthForm.jsx`, `AddFriendButton.jsx`, `PendingRequestsList.jsx`, `HomePage.jsx`, `MatchGrid.jsx`, `CreateRoomPage.jsx`, `PlayersPage.jsx`.
  - *Criterio de aceptación:* Reducción de 8 bloques de alerta repetidos; accesibilidad ARIA garantizada.
- **T-04: Unificar buscador en `SearchInput` y remover `SearchBar`:**
  - *Archivos:* `src/features/players/pages/PlayersPage.jsx`, `src/features/players/components/SearchBar.jsx`.
  - *Criterio de aceptación:* `SearchBar.jsx` queda eliminado; los jugadores se buscan con el mismo componente transversal que los partidos.
- **T-05: Integrar `HourPicker` en `EditRoomFields`:**
  - *Archivos:* `src/components/HourPicker.jsx`, `src/features/matches/components/EditRoom/EditRoomFields.jsx`.
  - *Criterio de aceptación:* El selector de horarios de salas de partido usa el componente común y no genera el array de horas inline.

### Fase P2: Mejoras de consistencia y mantenibilidad
- **T-06: Optimizar Navbar eliminando petición redundante:**
  - *Archivos:* `src/components/Navbar.jsx`.
  - *Cambio:* Leer el usuario directamente de `useAuthStore((state) => state.user)`.
  - *Criterio de aceptación:* Cero llamadas redundantes a `/users/me` al navegar entre páginas.
- **T-07: Componente transversal `EmptyState`:**
  - *Archivos:* `src/components/ui/EmptyState.jsx`, `HomePage.jsx`, `MatchGrid.jsx`, `PlayersPage.jsx`.
  - *Criterio de aceptación:* Los estados vacíos comparten estructura, tipografía y estilo de botones.

### Fase P3: Limpieza y simplificación de props
- **T-08: Limpieza de props redundantes en Button e Input:**
  - *Archivos:* Vistas y formularios del proyecto.
  - *Criterio de aceptación:* Eliminación de `variant="primary"` explícitos donde la variante base es primaria.
- **T-09: Limpieza de variables Tailwind arbitrarias:**
  - *Archivos:* Transversal en componentes UI.
  - *Cambio:* Migrar gradualmente clases `[var(--color-...)]` a las utilidades semánticas directas de Tailwind v4.

---

## 13. Pruebas de regresión

Para garantizar que ninguna refactorización altere el comportamiento productivo, debe validarse:

1. **Formularios y validaciones:**
   - Envío de login/registro (`AuthForm`) con errores de Yup y respuestas de error HTTP 400/401.
   - Creación y edición de salas (`CreateRoomPage`, `EditRoomPage`) con bloqueo de edición a menos de 24 horas.
   - Edición de perfil y cambio de contraseña opcional en `ProfileEdit`.
2. **Navegación y protección de rutas:**
   - Acceso con sesión persistida en `localStorage` tras recargar página (hidratación de Zustand).
   - Redirección automática de usuarios no autenticados a `/login`.
3. **Peticiones HTTP e interceptores:**
   - Comprobación de cabecera `Authorization: Bearer <token>` en todas las peticiones a través de `api`.
   - Limpieza de sesión y redirección automática ante respuestas HTTP 401/403.
4. **Interacciones en tiempo real:**
   - Recepción y envío de mensajes en Chat sin romper renderizado de mensajes entrantes.
5. **Diseño responsive:**
   - Verificación de grillas de partidos y barra de navegación móvil inferior (`md:hidden`) en pantallas de 360px a 1440px.

---

## 14. Checklist de implementación

- [ ] **Paso 1:** Resolver errores de linter preexistentes en `HourPicker.jsx`, `authService.js`, `Chat.jsx`, `player.store.js`.
- [ ] **Paso 2:** Crear el componente transversal `Alert` en `src/components/ui/Alert.jsx` con soporte de variantes.
- [ ] **Paso 3:** Sustituir alertas duplicadas en `AuthForm`, `HomePage`, `MatchGrid`, `CreateRoomPage`, `PlayersPage`, `AddFriendButton`, `PendingRequestsList`.
- [ ] **Paso 4:** Unificar `src/features/players/components/SearchBar.jsx` dentro de `src/components/ui/SearchInput.jsx` y borrar el componente redundante.
- [ ] **Paso 5:** Reestructurar `src/components/HourPicker.jsx` utilizando la base de `Select.jsx` e integrarlo en `EditRoomFields.jsx`.
- [ ] **Paso 6:** Desacoplar la petición HTTP de `Navbar.jsx`, utilizando el estado hidratado de `useAuthStore`.
- [ ] **Paso 7:** Normalizar el módulo `messajes`: vincular al cliente `api` singleton y adoptar la paleta de colores del tema global.
- [ ] **Paso 8:** Crear componente `EmptyState` y aplicarlo en `HomePage`, `MatchGrid` y `PlayersPage`.
- [ ] **Paso 9:** Omitir props por defecto redundantes (`variant="primary"`) en llamadas a `Button`.
- [ ] **Paso 10:** Ejecutar `npx eslint src` y `npm run build` para certificar compilación limpia y ausencia de regresiones.

---

## 15. Conclusión

La arquitectura frontend de *unPicadito* es sólida en sus cimientos técnicos (React 19, Tailwind v4, Zustand y React Router v7). No requiere una reescritura ni la introducción de bibliotecas adicionales. 

Las intervenciones más rentables consisten en:
1. **Unificar componentes atómicos de retroalimentación** (`Alert`, `EmptyState`, `SearchInput`).
2. **Sanear la coherencia de estilos** (alinear el módulo de mensajería al tema oscuro global y corregir la sintaxis de variables Tailwind v4).
3. **Eliminar código muerto y llamadas HTTP duplicadas** en el ciclo de vida de componentes de navegación.

Siguiendo el orden de prioridad propuesto (P0 a P3), se conseguirá una base de código notablemente más mantenible, consistente y limpia, sin introducir sobreingeniería ni arriesgar el funcionamiento de las reglas de negocio existentes.
