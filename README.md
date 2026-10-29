# ⚽ app.unPicadito

Plataforma web moderna para la organización, gestión y reserva de partidos de fútbol y deportes recreativos. Facilita la creación de salas públicas o privadas, la búsqueda de jugadores y canchas con mapas interactivos, la coordinación táctica, la gestión de reputación y el chat en tiempo real entre participantes.

---

## 🚀 Tecnologías y Stack Técnico

El frontend está construido sobre una arquitectura moderna basada en componentes, hooks desacoplados y gestión de estado predecible:

* **Core:** [React 19](https://react.dev/) (`^19.2.6`) + [React DOM 19](https://react.dev/)
* **Enrutamiento:** [React Router v7](https://reactrouter.com/) (`^7.18.2`) — Importado directamente desde `react-router`
* **Build Tool:** [Vite 8](https://vite.dev/) con compilación ultrarrápida y Hot Module Replacement (HMR)
* **Estilos y Diseño:** [Tailwind CSS v4](https://tailwindcss.com/) (`^4.3.3`) + `@tailwindcss/vite` con variables de tema personalizadas (`@theme`)
* **Estado Global:** [Zustand 5](https://zustand-demo.pmnd.rs/) (`^5.0.15`) con middleware `persist` sincronizado en `localStorage`
* **Cliente HTTP:** [Axios](https://axios-http.com/) (`^1.19.0`) con interceptores para inyección segura de token JWT y auto-logout en 401/403
* **Tiempo Real:** [Socket.IO Client](https://socket.io/) (`^4.8.4`) para el servicio de mensajería instantánea
* **Mapas y Geolocalización:** [Leaflet](https://leafletjs.com/) (`^1.9.4`) + [React Leaflet 5](https://react-leaflet.js.org/) (`^5.0.0`)
* **Validación de Formularios:** [Yup](https://github.com/jquense/yup) (`^1.7.1`)
* **Iconografía:** [Lucide React](https://lucide.dev/) (`^1.48.0`)
* **Linter y Calidad de Código:** [ESLint 10](https://eslint.org/) con reglas estrictas para React 19 y Hooks

---

## ✨ Características Principales

### 🏟️ Partidos y Salas de Juego (`matches`)
* **Salas Públicas y Privadas:** Creación y edición con validación de capacidad (fútbol 5, 7 u 11), fecha, hora en punto y restricciones horarias.
* **Mapas y Geolocalización:** Selección y visualización interactiva de la cancha mediante OpenStreetMap con Leaflet.
* **Alineación y Cupos:** Gestión de participantes confirmados, suplentes y cupos disponibles en tiempo real.
* **Solicitudes de Ingreso:** Aprobación o rechazo de solicitudes para organizadores de salas.
* **Pizarra Táctica:** Visualización de posiciones tácticas de los jugadores en la cancha.
* **Cancelación Justificada:** Diálogo de cancelación con motivo obligatorio para resguardar la experiencia de la comunidad.
* **Abandono Seguro:** Modales de confirmación accesibles (`ConfirmModal`) para cancelar participación sin recarga de página.

### 🏃 Comunidad de Jugadores (`players`)
* **Búsqueda Reactiva:** Explorador de jugadores con debounce optimizado (400 ms) por nombre, apodo o posición.
* **Filtros por Posición:** Filtrado dinámico (Arquero, Defensor, Mediocampista, Delantero, Polifuncional).
* **Navegación Fluida:** Acceso directo al perfil público de cualquier jugador.

### 👤 Perfil y Sistema de Calificaciones (`profile`)
* **Identidad del Jugador:** Información personal, apodo, posición principal y foto de perfil (`Avatar`).
* **Calificaciones y Estrellas:** Visualización unificada del puntaje promedio mediante `RatingBadge` (mostrando *"Aún sin calificar"* cuando el jugador es nuevo o no posee reseñas).
* **Muro de Reseñas:** Listado de comentarios y valoraciones recibidas tras disputar partidos.
* **Edición Integral:** Formulario desacoplado con validaciones Yup para actualizar datos y cambio seguro de contraseña.

### 🤝 Amistad y Contactos (`friendship`)
* **Solicitudes de Amistad:** Envío, aceptación o rechazo reactivo de solicitudes entre jugadores.
* **Estado Inmediato:** Botón inteligente (`AddFriendButton`) con feedback visual de estado (pendiente, aceptar, enviar).

### 💬 Mensajería en Tiempo Real (`messajes`)
* **Chat Privado:** Mensajería bidireccional instantánea mediante WebSockets (Socket.IO).
* **Historial Persistente:** Carga de conversaciones anteriores a través de la API autenticada.
* **Diseño Responsivo:** Panel adaptado con soporte completo para modo oscuro y estados vacíos (`EmptyState`).

### 💳 Billetera Virtual (`wallet`)
* Gestión de saldo, depósitos e historial de transacciones vinculados al usuario.

### 🔐 Autenticación y Seguridad (`auth`)
* Registro e inicio de sesión con JWT.
* Sesión persistida e hidratada mediante Zustand en `localStorage`.
* Protección de rutas con `ProtectedRoute` (privadas) y `PublicRoute` (login/registro).
* El token JWT **nunca se expone ni se renderiza en la interfaz visual** y viaja encriptado en las cabeceras `Authorization: Bearer <token>`.

---

## 📂 Estructura del Proyecto

El código está estructurado bajo una arquitectura modular por características (*Feature-driven Architecture*), separando la lógica de negocio, servicios, hooks y componentes transversales:

```text
app.unPicadito/
├── public/                 # Favicons y recursos estáticos públicos
├── src/
│   ├── api/                # Cliente Axios centralizado con interceptores JWT
│   │   └── axiosInstance.js
│   ├── assets/             # Imágenes del banner, texturas y assets locales
│   ├── components/         # Componentes transversales y Layouts globales
│   │   ├── ConfirmModal.jsx    # Diálogo modal de confirmación accesible
│   │   ├── HourPicker.jsx      # Selector normalizado de 24 horas (en punto)
│   │   ├── MainLayout.jsx      # Layout envolvente con barra de navegación
│   │   ├── Navbar.jsx          # Barra de navegación adaptable (Desktop / Mobile)
│   │   └── ui/                 # Sistema de diseño y átomos reutilizables:
│   │       ├── Alert.jsx           # Alertas accesibles (error, warning, info, success)
│   │       ├── Avatar.jsx          # Imagen de usuario con fallback de iniciales
│   │       ├── Badge.jsx           # Etiquetas y pastillas de estado
│   │       ├── Button.jsx          # Botón con variantes, iconos y spinner de carga
│   │       ├── Card.jsx            # Contenedor base de tarjetas
│   │       ├── EmptyState.jsx      # Vista de estado vacío consistente
│   │       ├── ErrorAlert.jsx      # Adaptador de alerta de errores
│   │       ├── FormActions.jsx     # Barra de acciones (Guardar / Cancelar)
│   │       ├── Input.jsx           # Campo de entrada con label y error accesibles
│   │       ├── LoadingState.jsx    # Vista de carga con spinner y mensaje
│   │       ├── PageContainer.jsx   # Envoltorio responsivo con anchos estandarizados
│   │       ├── ProgressBar.jsx     # Barra de progreso visual
│   │       ├── RatingBadge.jsx     # Insignia de estrellas y calificación estándar
│   │       ├── SearchInput.jsx     # Buscador con icono de lupa y botón de limpieza
│   │       ├── SectionCard.jsx     # Tarjeta de sección con título y acción superior
│   │       ├── Select.jsx          # Selector desplegable estilizado
│   │       ├── Spinner.jsx         # Indicador de carga animado
│   │       ├── Switch.jsx          # Interruptor toggle booleano
│   │       ├── Textarea.jsx        # Área de texto estilizada con forwardRef
│   │       └── ToggleGroup.jsx     # Grupo de botones de opción única
│   ├── constants/          # Constantes globales de la aplicación
│   ├── features/           # Módulos específicos de dominio
│   │   ├── auth/           # Login, Registro, store de sesión y hooks
│   │   ├── friendship/     # Solicitudes y lista de amigos
│   │   ├── home/           # Pantalla de bienvenida principal
│   │   ├── matches/        # Salas, filtros, mapas, alineaciones y cancelación
│   │   ├── messajes/       # Chat por WebSocket, socket singleton y vistas
│   │   ├── players/        # Directorio de jugadores y búsqueda con debounce
│   │   ├── profile/        # Perfil propio, público, ranking y formulario de edición
│   │   └── wallet/         # Estado y operaciones de la billetera virtual
│   ├── hooks/              # Custom hooks transversales
│   ├── routes/             # Configuración central de rutas y guardianes de acceso
│   │   ├── AppRoutes.jsx       # Tabla de rutas React Router v7
│   │   ├── ProtectedRoute.jsx  # Guardián de rutas autenticadas
│   │   └── PublicRoute.jsx     # Guardián de rutas públicas
│   ├── services/           # Conexiones singleton globales (ej. Socket.io)
│   ├── utils/              # Funciones puras (validación Yup, formato, etc.)
│   ├── App.jsx             # Árbol raíz con BrowserRouter
│   ├── index.css           # Configuración Tailwind CSS v4 (@theme)
│   └── main.jsx            # Punto de entrada ReactDOM
├── .env.example            # Plantilla de variables de entorno
├── eslint.config.js        # Configuración de ESLint
├── package.json            # Dependencias y scripts
└── vite.config.js          # Configuración de Vite con plugins de React y Tailwind
```

---

## ⚙️ Configuración y Variables de Entorno

Copia el archivo `.env.example` a `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Configura las variables según tu entorno:

```env
# URL base de la API REST del backend
VITE_API_URL=http://localhost:8080/api

# URL del servidor de WebSockets para el Chat (Socket.IO)
VITE_SOCKET_URL=http://localhost:3000

# Endpoints específicos (opcionales)
VITE_MATCHES_ENDPOINT=/matches
VITE_MATCHES_SEARCH_ENDPOINT=/salas/buscar
VITE_MODALITIES_ENDPOINT=/modalities
VITE_ZONES_ENDPOINT=/zones
VITE_LEVELS_ENDPOINT=/levels
```

---

## 🛠️ Instalación y Puesta en Marcha

### Requisitos previos
* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [npm](https://www.npmjs.com/) (versión 9 o superior)

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Martin-Varela4/app.unPicadito.git
   cd app.unPicadito
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 📜 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con Vite y HMR. |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run lint` | Ejecuta ESLint sobre todo el código fuente verificando sintaxis y buenas prácticas. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |

---

## 🧭 Rutas de la Aplicación

| Ruta | Acceso | Descripción |
| :--- | :--- | :--- |
| `/login` | Público | Formulario de inicio de sesión. |
| `/registro` | Público | Formulario de creación de cuenta. |
| `/` o `/partidos` | Protegido | Explorador de partidos y salas con filtros y búsqueda. |
| `/inicio` | Protegido | Página de bienvenida e introducción. |
| `/salas/nueva` | Protegido | Creador de nueva sala de partido con mapa y cupos. |
| `/salas/:id` | Protegido | Detalle de la sala: alineación, mapa, cupos y chat. |
| `/salas/:id/editar` | Protegido | Edición de sala (solo para el organizador). |
| `/players` | Protegido | Directorio y buscador de jugadores de la comunidad. |
| `/profile` | Protegido | Perfil del usuario autenticado con reseñas y estrellas. |
| `/profile/edit` | Protegido | Formulario de edición de perfil y contraseña. |
| `/users/:id` | Protegido | Perfil público de cualquier jugador. |
| `/messages` | Protegido | Mensajería instantánea en tiempo real con contactos. |

---

## 🤝 Lineamientos de Contribución

1. Crea una rama para tu funcionalidad o corrección (`git checkout -b feature/nombre-de-la-feature` o `git checkout -b fix/nombre-del-fix`).
2. Realiza tus modificaciones asegurando que `npm run lint` y `npm run build` pasen sin errores.
3. Haz commit de tus cambios (`git commit -m "feat: agrega soporte para..."`).
4. Sube tu rama al repositorio remoto (`git push origin feature/nombre-de-la-feature`).
5. Abre un **Pull Request** detallando los cambios introducidos.

---

## 📄 Licencia

Proyecto de uso interno y privado para el equipo de desarrollo de **app.unPicadito**.
