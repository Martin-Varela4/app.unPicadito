# Revisión del flujo de edición de sala

## Resumen ejecutivo

El flujo de edición de sala no está listo para producción en su estado actual. Hay varios problemas de consistencia entre el front, la ruta, la forma en que se leen los datos del backend y la lógica de permisos. El problema principal no es solo de estilo: varios puntos pueden provocar errores de runtime o que la pantalla de detalle no muestre información correcta.

En términos prácticos: el flujo es posible, pero requiere una corrección de contrato de datos y de permisos antes de seguir con más desarrollo.

## Hallazgos críticos

### 1) Error de estado de usuario en el header de la sala

Archivo: [src/features/matches/components/RoomHeader.jsx](src/features/matches/components/RoomHeader.jsx)

Problema:
- Se importa `useAuthStore` desde una ruta incorrecta: `../../../stores/authStore`
- La variable `currentUser` nunca se define en el componente
- La condición `const esCreador = currentUser?.id === room?.creadorId;` rompe el render si `currentUser` no existe

Impacto:
- El botón “Editar Sala” puede fallar al renderizar
- El componente puede romper la pantalla de detalle de la sala

Corrección requerida:
- Importar correctamente desde `../../auth/store/useAuthStore`
- Obtener el usuario real con `const { user: currentUser } = useAuthStore();`

### 2) Mapeo de datos del backend incompatibles con la UI

Archivo: [src/features/matches/pages/RoomDetail.jsx](src/features/matches/pages/RoomDetail.jsx)

Problema:
- El código mapea a propiedades de UI con nombres que no coinciden con las que luego consume el resto de la vista
- Ejemplos:
  - `title: rawMatch.nombre` → correcto
  - `description: rawMatch.direccion` → incorrecto si la descripción real es `descripcion`
  - `status: rawMatch.estado` → puede estar bien, pero no siempre coincide con el resto del flujo
  - `maxPlayers: rawMatch.cuposTotales` → correcto
  - `participants` se crea, pero no hay normalización uniforme de `userId`, `id` o `status`

Además, [src/features/matches/components/RoomInfoCard.jsx](src/features/matches/components/RoomInfoCard.jsx) espera campos como:
- `room.date`
- `room.time`
- `room.location`
- `room.privacy`

Pero `RoomDetail` no llena esos campos al mapear `rawMatch`, por lo que la tarjeta de información puede renderizar valores vacíos o inconsistentes.

Impacto:
- La vista de detalle puede mostrar datos incompletos o incorrectos
- El flujo de edición puede cargar un formulario con valores distintos a lo que el usuario vio antes

Corrección requerida:
- Definir un contrato de mapeo único para el backend y la UI
- Normalizar todos los campos al mismo nombre antes de pasar al componente
- Por ejemplo:
  - `title` → `nombre`
  - `description` → `descripcion`
  - `date` → `fecha` o `fechaHoraPartido`
  - `time` → `hora`
  - `location` → `direccion` o `nombreCancha`
  - `maxPlayers` → `cuposTotales`

### 3) Inconsistencia entre el dominio del backend y el formulario de edición

Archivos:
- [src/features/matches/pages/EditRoomPage.jsx](src/features/matches/pages/EditRoomPage.jsx)
- [src/features/matches/schemas/roomSchema.js](src/features/matches/schemas/roomSchema.js)
- [src/features/matches/services/matchService.js](src/features/matches/services/matchService.js)

Problema:
- El formulario de edición usa `nombre`, `nombreCancha`, `direccion`, `fecha`, `hora`, `cuposTotales` y `descripcion`
- El backend parece devolver/esperar `fechaHoraPartido`, `cuposTotales`, `direccion`, `nombreCancha`, `nombre`, `descripcion`, etc.
- El flujo hace una conversión manual con `new Date(...)` y `toISOString()`, lo cual puede romper la zona horaria y la representación exacta del horario del partido

Impacto:
- Se puede perder precisión temporal
- La hora puede cambiar según la zona horaria del navegador
- La edición puede producir fechas/horas inconsistentes en el backend

Corrección requerida:
- Mantener una única representación temporal del backend y convertir solo en el punto de frontera
- Preferir `date + time` como valores del formulario y serializar al backend con una convención explícita
- Validar que el backend acepte exactamente ese formato antes de seguir con la vista

### 4) El flujo de permisos de edición no está correctamente validado

Archivos:
- [src/features/matches/components/RoomHeader.jsx](src/features/matches/components/RoomHeader.jsx)
- [src/features/matches/pages/RoomDetail.jsx](src/features/matches/pages/RoomDetail.jsx)
- [src/features/matches/components/CancelRoomManager.jsx](src/features/matches/components/CancelRoomManager.jsx)

Problema:
- La lógica de quién puede editar se basa en `creadorId`, pero no hay una validación más robusta del usuario autenticado
- En algunos componentes se compara con `currentUser?.id` sin confirmar que el usuario exista o que el payload del backend tenga exactamente la estructura esperada

Impacto:
- Un usuario puede ver un botón de edición aunque no tenga permisos reales
- O puede fallar la UI si el perfil no está cargado correctamente

Corrección requerida:
- Resolver el `currentUser` desde el store autenticado
- Comparar con la propiedad real del creador (`room.creadorId` o `room.creador?.id`)
- Centralizar la validación en un helper o selector reutilizable

### 5) El detalle de la sala se basa en assumptions de UI que no están respaldadas por la API

Archivo: [src/features/matches/pages/RoomDetail.jsx](src/features/matches/pages/RoomDetail.jsx)

Problema:
- Hay asunciones como:
  - `status: "CONFIRMED"` para todos los participantes
  - `modality: 'F5'` fija
  - `description: rawMatch.direccion`
- Esto hace que la UI no refleje la realidad del backend

Impacto:
- Los datos de la sala y la lista de participantes pueden ser incorrectos
- Las reglas de cupos y estado pueden no coincidir con el estado real del partido

Corrección requerida:
- Mapear datos reales del backend
- Si el backend no los entrega, definir claramente la API antes de consumirla
- No hardcodear valores de dominio que no estén respaldados por el servicio

## Recomendaciones de arquitectura

### A. Definir un mapper único de sala

Crear un mapper específico para transformar el backend en la estructura visual esperada por los componentes:

```js
const mapRoomFromApi = (rawRoom) => ({
  id: rawRoom.id,
  title: rawRoom.nombre,
  description: rawRoom.descripcion ?? '',
  date: rawRoom.fechaHoraPartido?.split('T')[0] ?? '',
  time: rawRoom.fechaHoraPartido?.split('T')[1]?.slice(0, 5) ?? '',
  location: rawRoom.direccion ?? rawRoom.nombreCancha ?? '',
  maxPlayers: rawRoom.cuposTotales,
  creatorId: rawRoom.creadorId ?? rawRoom.creador?.id,
  status: rawRoom.estado,
  participants: rawRoom.participantes ?? [],
});
```

Esto reduce la duplicación y evita que cada componente “adivine” el formato del backend.

### B. Mantener una sola fuente de verdad para el usuario autenticado

Usar el Zustand auth store como único origen de identidad del usuario. Evitar variables locales o referencias a `currentUser` sin inicializar.

### C. Separar validación, transformación y render

- Validación Yup: [src/features/matches/schemas/roomSchema.js](src/features/matches/schemas/roomSchema.js)
- Transformación del payload al backend: [src/features/matches/pages/EditRoomPage.jsx](src/features/matches/pages/EditRoomPage.jsx)
- Render de detalle: [src/features/matches/pages/RoomDetail.jsx](src/features/matches/pages/RoomDetail.jsx)

Esto hace que cada capa tenga una responsabilidad clara.

## Conclusión

El flujo de edición de sala puede implementarse correctamente, pero no en su estado actual. Hay tres problemas principales que bloquean la confiabilidad del flujo:

1. Error real de runtime en el header de la sala
2. Mapeo inconsistente entre API y UI
3. Falta de un contrato claro de permisos y formato de datos

Antes de continuar, se recomienda corregir estos puntos y validar el flujo completo con un caso real de sala creada por el usuario autenticado.
