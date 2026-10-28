# Plan de ajustes visuales y acciones en salas

## Objetivo

Corregir los detalles visuales señalados en las capturas y uniformar la presentación de búsqueda, creación de sala, autenticación y participantes.

## Estado de implementación

Implementado: se corrigió la opción vacía duplicada en selectores, se reforzaron los layouts responsive, se añadió el fondo de cancha, se unificó el avatar fallback, se mapeó la reputación del jugador y se reemplazaron las acciones directas por un menú compacto de tres puntos.

## Alcance y criterios de implementación

- Mantener las rutas, contratos de API, validaciones y permisos existentes.
- Reutilizar los componentes UI y patrones Tailwind actuales; evitar duplicar estilos o introducir dependencias.
- Usar los recursos ya disponibles en `src/assets/cancha-fondo.jpg` y `src/assets/usuario.png`.
- No inferir una calificación de jugador si el servicio no proporciona el dato y su escala.

## Plan de trabajo

### 1. Corregir la presentación de filtros y campos de sala

**Puntos de revisión**

- `src/features/matches/components/MatchFilters.jsx`
- `src/features/matches/components/EditRoom/EditRoomFields.jsx`
- `src/features/matches/pages/CreateRoomPage.jsx`
- `src/components/ui/Input.jsx`, `src/components/ui/Select.jsx` y `src/components/ui/Switch.jsx`

**Acciones**

1. Reproducir el defecto de alineación, dimensiones o espaciado que muestran las capturas y localizar si se origina en el contenedor de filtros, la grilla responsive o los componentes compartidos.
2. Corregir los filtros de búsqueda de canchas/partidos y comprobar el mismo patrón en los campos del formulario de creación de sala, sin cambiar qué filtros se envían ni qué campos valida el formulario.
3. Conservar labels vinculados a sus controles, mensajes de error legibles y foco visible. Asegurar que las columnas se reacomoden sin recortes ni scroll horizontal en móvil y escritorio.
4. Revisar los toggles y las acciones de «Cancelar» y «Crear Sala» en el pie del formulario junto con los campos: la captura muestra que pertenecen al mismo flujo visual.

### 2. Actualizar el fondo de autenticación

**Punto principal**

- `src/features/auth/pages/AuthPage.jsx`

**Acciones**

1. Aplicar `src/assets/cancha-fondo.jpg` como imagen de fondo de la pantalla de acceso/registro.
2. Mantener la tarjeta del formulario claramente distinguible del fondo mediante el tratamiento visual existente; ajustar recorte y posición para escritorio y móvil.
3. Verificar que ambos modos —inicio de sesión y registro— usen el mismo fondo y que los labels, errores y controles mantengan contraste suficiente.

### 3. Unificar la imagen por defecto de usuario

**Puntos que deben auditarse**

- `src/components/Navbar.jsx`
- `src/features/matches/components/PlayerCard.jsx`
- `src/features/matches/components/RoomJoinRequests.jsx`
- `src/features/friendship/components/PendingRequestsList.jsx`
- `src/features/profile/components/profileHeader.jsx`

**Acciones**

1. Sustituir iconos genéricos, placeholders y rutas de avatar que no correspondan por `src/assets/usuario.png` cuando el usuario no tenga una imagen cargada.
2. Preservar siempre la imagen de perfil recibida cuando exista; el recurso local solo debe ser el fallback.
3. Comprobar el fallback también ante una imagen remota que no pueda cargarse, de modo que no quede un espacio roto o un icono distinto según la pantalla.
4. Mantener textos alternativos descriptivos y dimensiones/recorte consistentes para cada avatar.

### 4. Mostrar calificación con estrellas en las tarjetas de participantes

**Puntos principales**

- `src/features/matches/components/PlayerCard.jsx`
- `src/features/matches/services/matchMapper.js`
- `src/features/matches/services/matchService.js` (solo si hace falta confirmar o ampliar el dato servido)

**Acciones**

1. Reemplazar la línea secundaria con `@usuario` por la calificación del jugador representada visualmente con estrellas, siguiendo el ejemplo de la captura.
2. Revisar primero qué campo y escala de rating entrega el detalle de sala. Si el dato no llega en esa respuesta, acordar de dónde obtenerlo antes de agregar una petición o modificar el contrato.
3. Definir presentación para rating ausente y valor parcial según la escala confirmada; no mostrar un rating inventado ni asumir un rango sin validar el contrato.
4. Mantener el nombre, la posición principal y la marca de organizador que ya presenta la tarjeta. Añadir una etiqueta accesible para que el rating no dependa solo del símbolo de estrella.

### 5. Reemplazar acciones con iconos por un menú de tres puntos

**Puntos principales**

- `src/features/matches/components/PlayerCard.jsx`
- `src/features/matches/components/RoomParticipantsList.jsx`
- `src/features/matches/pages/RoomDetail.jsx`
- `src/features/matches/hooks/useRoomOrganizer.js`

**Acciones**

1. Para las tarjetas que el organizador puede administrar, reemplazar los botones de icono de expulsar y transferir organización por un único botón de tres puntos horizontales.
2. Al activarlo, mostrar un menú contextual compacto con acciones escritas: **«Hacer organizador»** y **«Expulsar de la sala»**. No representar esas acciones con iconos.
3. Conservar los permisos actuales: el menú solo aparece al organizador actual para otros participantes, y las acciones siguen ejecutando los callbacks y confirmaciones existentes.
4. Cerrar el menú al seleccionar una opción, al pulsar Escape o al hacer clic fuera; hacer que el botón y las opciones sean utilizables mediante teclado y tengan nombres/estados accesibles.
5. Mantener el menú dentro de los límites de la tarjeta y la pantalla, incluyendo las listas de titulares y suplentes en anchos móviles.

## Verificación propuesta

- Revisar las pantallas de filtros y creación de sala con los anchos de móvil (360–390 px), tablet (768–1024 px) y escritorio (1280–1440 px).
- Confirmar el fondo en inicio de sesión y registro, y comprobar contraste del formulario sobre la imagen.
- Probar avatares con imagen cargada, sin imagen y con URL de imagen inválida en las pantallas enumeradas.
- Comprobar tarjetas de participantes con calificación presente/ausente y que el rating corresponda al campo y escala confirmados por el servicio.
- Probar el menú de acciones como organizador y como participante no organizador; verificar teclado, clic exterior, Escape, límites del menú y los flujos de confirmación existentes.
- Ejecutar `npm run lint` y `npm run build` tras implementar. El repositorio no declara un script de pruebas automatizadas; completar con revisión visual y pruebas manuales de los flujos.

## Criterios de aceptación

- Los controles de búsqueda y creación se ven alineados, legibles y adaptables, y el mismo defecto queda corregido en ambos flujos.
- Las pantallas de acceso y registro muestran `cancha-fondo.jpg` sin sacrificar la legibilidad del formulario.
- Todos los avatares sin imagen cargada usan `usuario.png`, sin reemplazar imágenes válidas de perfil.
- Las tarjetas de participantes muestran estrellas basadas en la calificación real, en lugar de `@usuario`; la falta de rating tiene un estado claro y no engañoso.
- Las opciones para expulsar o hacer organizador son texto dentro del menú de tres puntos; permisos, confirmaciones y efectos actuales se conservan.
- Los cambios visuales funcionan en móvil, tablet y escritorio, y lint/build terminan correctamente.

## Decisión confirmada para la implementación

La tarjeta usa el campo `usuario.reputacion` ya empleado por el mapper de perfil como valor junto a una estrella, sin asumir un rango fijo de cinco estrellas. Cuando el detalle de sala no incluya reputación, muestra «Sin estrellas».
