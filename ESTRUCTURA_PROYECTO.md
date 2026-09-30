# Estructura del proyecto app.unPicadito

## Descripción

**app.unPicadito** es una aplicación web desarrollada con React y Vite para organizar partidos recreativos. El frontend está organizado por funcionalidades: cada módulo reúne sus páginas, componentes, servicios, hooks, validaciones y estado relacionados.

## Árbol de carpetas

```text
app.unPicadito/
├── public/                         # Archivos estáticos públicos
├── src/
│   ├── api/
│   │   └── axiosInstance.js        # Instancia compartida para solicitudes HTTP
│   ├── assets/                      # Imágenes y otros recursos de la aplicación
│   ├── components/                  # Componentes reutilizables
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Input.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── SearchInput.jsx
│   │   ├── Select.jsx
│   │   ├── Spinner.jsx
│   │   ├── Switch.jsx
│   │   └── ToggleGroup.jsx
│   ├── config/
│   │   └── axios.js                 # Configuración relacionada con Axios
│   ├── features/                    # Módulos agrupados por funcionalidad
│   │   ├── auth/                    # Autenticación y gestión de salas
│   │   │   ├── components/
│   │   │   │   ├── AuthForm.jsx
│   │   │   │   └── EditRoomform.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   ├── pages/
│   │   │   │   ├── AuthPage.jsx
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── schemas/
│   │   │   │   ├── authSchema.js
│   │   │   │   └── roomEditSchema.js
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   └── store/
│   │   │       └── useAuthStore.js
│   │   ├── friendship/              # Relaciones y solicitudes de amistad
│   │   │   ├── components/
│   │   │   │   ├── AddFriendButton.jsx
│   │   │   │   └── PendingRequestsList.jsx
│   │   │   ├── services/
│   │   │   │   └── friendshipService.js
│   │   │   └── store/
│   │   │       └── useFriendshipStore.js
│   │   ├── matches/                 # Partidos, salas y participantes
│   │   │   ├── components/
│   │   │   │   ├── MatchCard.jsx
│   │   │   │   ├── MatchFilters.jsx
│   │   │   │   ├── MatchGrid.jsx
│   │   │   │   ├── PlayerCard.jsx
│   │   │   │   ├── RoomHeader.jsx
│   │   │   │   ├── RoomInfoCard.jsx
│   │   │   │   ├── RoomParticipantsList.jsx
│   │   │   │   ├── RoomSlotsSummary.jsx
│   │   │   │   └── CreateRoom/
│   │   │   │       ├── CapacitySection.jsx
│   │   │   │       ├── DateTimeSection.jsx
│   │   │   │       ├── LocationSection.jsx
│   │   │   │       └── PrivacySection.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useMatches.js
│   │   │   ├── pages/
│   │   │   │   ├── CreateRoomPage.jsx
│   │   │   │   ├── MatchesPage.jsx
│   │   │   │   └── RoomDetail.jsx
│   │   │   ├── schemas/
│   │   │   │   └── createRoomSchema.js
│   │   │   └── services/
│   │   │       └── matchService.js
│   │   ├── players/                 # Búsqueda y listado de jugadores
│   │   │   ├── components/
│   │   │   │   ├── PlayerCard.jsx
│   │   │   │   ├── PlayerList.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useDebounce.js
│   │   │   ├── pages/
│   │   │   │   └── PlayersPage.jsx
│   │   │   ├── schemas/
│   │   │   │   └── searchPlayer.schema.js
│   │   │   ├── services/
│   │   │   │   └── player.service.js
│   │   │   └── store/
│   │   │       └── player.store.js
│   │   └── profile/                 # Perfil, estadísticas y reseñas
│   │       ├── components/
│   │       │   ├── aboutSection.jsx
│   │       │   ├── connectionSection.jsx
│   │       │   ├── profileHeader.jsx
│   │       │   ├── ProfileRanking.jsx
│   │       │   ├── ProfileReviews.jsx
│   │       │   └── ProfileStats.jsx
│   │       ├── hooks/
│   │       │   └── useProfile.js
│   │       ├── pages/
│   │       │   └── ProfileView.jsx
│   │       └── services/
│   │           ├── profile.mapper.js
│   │           └── profile.service.js
│   ├── hooks/
│   │   └── useDebounce.js           # Hook compartido para retrasar actualizaciones
│   ├── routes/                      # Definición y protección de rutas
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   ├── App.css                      # Estilos de la aplicación
│   ├── App.jsx                      # Componente raíz
│   ├── index.css                    # Estilos globales
│   └── main.jsx                     # Punto de entrada de React
├── eslint.config.js                 # Configuración de ESLint
├── index.html                       # Documento HTML base
├── package.json                     # Dependencias y scripts
├── README.md                        # Documentación general del proyecto
└── vite.config.js                   # Configuración de Vite
```

## Organización del código

- **`components/`**: componentes de interfaz reutilizables en distintas áreas.
- **`features/`**: código separado por funcionalidad. Cada módulo puede incluir páginas, componentes, hooks, esquemas de validación, servicios y estado propio.
- **`services/`**: funciones que gestionan la comunicación con la API.
- **`schemas/`**: reglas para validar datos de entrada.
- **`store/`**: estado compartido de las funcionalidades.
- **`routes/`**: configuración de navegación y control de acceso a las rutas.
- **`api/` y `config/`**: configuración y utilidades para las solicitudes HTTP.
- **`assets/` y `public/`**: recursos estáticos de la aplicación.

## Tecnologías principales

- React
- Vite
- React Router
- Axios
- Zustand
- Yup
- Tailwind CSS

## Comandos disponibles

```bash
npm run dev     # Inicia el servidor de desarrollo
npm run build   # Genera la versión de producción
npm run lint    # Ejecuta ESLint
npm run preview # Previsualiza la compilación
```
