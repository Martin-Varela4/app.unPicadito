# Plan corregido de implementación: UP-018 | Editar sala

## 1. Veredicto

El plan original cubre reglas de negocio pertinentes, pero no se debe ejecutar tal cual: difiere de los dos proyectos disponibles y presenta código de ejemplo que no coincide con las rutas HTTP reales. La edición solo será fiable cuando frontend, API y base de datos compartan el mismo contrato y las mutaciones concurrentes se sincronicen.

Este documento reemplaza como guía de ejecución al plan anterior; no modifica ni elimina `PLAN_IMPLEMENTACION_UP-018.md`.

## 2. Estado observado en los proyectos

Proyectos revisados:
- Frontend: `app.unPicadito` (React, React Router, React Hook Form, Yup, Zustand, Axios).
- Backend: `api.unPicadito` (Express, TypeScript, Zod, TypeORM, MySQL).

Hallazgos que afectan directamente a UP-018:

1. `api.unPicadito/src/modules/sala/sala.routes.ts` registra `PATCH /:id` para editar, pero `app.unPicadito/src/features/matches/services/matchService.js` hace `PUT /salas/:id`. En su estado actual, el submit no alcanza la ruta de edición registrada.
2. `RoomHeader.jsx` importa el store desde `../../../stores/authStore` y usa `currentUser` sin declararlo. El store real está en `src/features/auth/store/useAuthStore.js`; al renderizar, la referencia no definida puede romper la pantalla.
3. La API responde `{ success, data }`. `getMatchById` en `matchService.js` desenvuelve `data`, pero `RoomDetail.jsx` consume `response.data` como si fuera directamente la sala. El mapeo del detalle no es consistente con la respuesta real.
4. `RoomDetail.jsx` asigna `description` desde `rawMatch.direccion`, no desde `descripcion`, y no construye `date`, `time`, `location` y `privacy`, que son campos leídos por `RoomInfoCard.jsx`. También fija la modalidad y el estado de todos los participantes sin evidencia de que esos valores sean correctos.
5. `EditRoomPage.jsx` construye `fechaHoraPartido` con `Date` local y `toISOString()`, mientras que al cargar usa una combinación de fecha UTC (`toISOString`) y hora local (`toTimeString`). Esa mezcla puede cambiar la fecha/hora que se muestra o guarda.
6. El formulario envía todos los campos en cada actualización, mientras el schema de edición admite campos opcionales y el backend está montado como `PATCH`. Además, cuando los campos críticos están bloqueados, hay que verificar que Yup/React Hook Form permitan guardar cambios no críticos sin omitir valores requeridos.
7. `editarSalaService` lee la sala, cuenta confirmados y actualiza por pasos sin transacción. `unirseSalaService`, `leaveSalaService` y la expulsión también modifican participantes/cupos sin un bloqueo compartido. Una edición concurrente con unirse/salir puede validar contra un conteo obsoleto.
8. La API ya valida UUID, autenticación y cuerpo Zod; conserva reglas de creador, estado cerrado, ventana de 24 horas y cupos. Se deben corregir y probar estas reglas en el servicio existente, no duplicarlas en una nueva ruta o módulo.

## 3. Reglas acordadas para el flujo

- La API es la autoridad para permisos, estados, ventana temporal y capacidad. El frontend solo mejora la experiencia; nunca sustituye las validaciones del backend.
- Solo el creador autenticado puede editar. Un usuario no autorizado recibe `403`, aunque navegue directamente a `/salas/:id/editar` o manipule la petición.
- Una sala inexistente responde `404`; una sala cancelada o finalizada no se edita (`409`).
- Los campos críticos son `fechaHoraPartido`, `nombreCancha`, `direccion` y `ubicacion`. No pueden cambiarse si al partido actual le quedan **24 horas o menos**.
- Si se modifica la fecha, la nueva fecha debe quedar a **más de 24 horas** del momento validado por el servidor. El servidor define el instante de evaluación.
- Los cupos totales no pueden ser inferiores al número de participaciones `CONFIRMADO`. `PENDIENTE` no consume cupo. Una participación confirmada con rol `SUPLENTE` debe contabilizarse según la regla vigente del dominio; actualmente la búsqueda del backend cuenta todas las participaciones confirmadas, por lo que el plan conserva esa regla salvo decisión de producto en contrario.
- El estado de sala se deriva del conteo confirmado tras cada cambio de cupos: `COMPLETA` cuando confirmados >= cupos, si no `ABIERTA`. Los estados terminales nunca se reabren mediante edición.
- Un PATCH vacío se rechaza. Solo se incluyen en el payload campos que el formulario permite editar; las omisiones conservan los valores existentes.

## 4. Contrato HTTP único

### Obtener sala

`GET /api/salas/:id` (autenticado) responde `{ success: true, data: Sala }`.
El frontend debe consumir la misma función `getMatchById` desde edición y detalle, y desenvolver la respuesta en un solo lugar.

### Actualizar sala

Usar el endpoint ya implementado:

```http
PATCH /api/salas/:id
Authorization: Bearer <token>
Content-Type: application/json
```

El cuerpo es parcial y usa nombres de la entidad/API:
`nombre`, `descripcion`, `nombreCancha`, `direccion`, `fechaHoraPartido`, `cuposTotales`, `permiteSuplentes`, `cuposSuplentesMax`, `esPublica`, `ubicacion`.

No cambiarlo a `PUT` salvo que se decida y migre explícitamente toda la API a semántica de reemplazo completo. La ruta y el controlador existentes ya son `PATCH`.

Respuesta exitosa: `{ success: true, data: SalaActualizada }`. La API devuelve errores de negocio con `success: false` y `message`; Axios normaliza errores en `Error.message`, así que los componentes no deben depender de `error.response` como única fuente.

## 5. Plan de implementación

### Fase A — Contrato y mapeo frontend

1. Crear/ajustar `app.unPicadito/src/features/matches/services/matchMapper.js` como único mapper `Sala API -> modelo de UI`. Mapear nombres, descripción, fecha/hora, cancha/dirección, privacidad, creador, estado y participantes desde campos reales.
2. No deducir `modality` desde `cuposTotales` ni marcar todas las participaciones como confirmadas. Mapear valores reales; si la API no los entrega, documentar el dato faltante y acordar el contrato con backend.
3. Hacer que `getMatchById` sea la única frontera que desempaqueta `{ success, data }`. `RoomDetail` y edición consumen el objeto ya normalizado o acuerdan explícitamente si el mapper se invoca en el servicio.
4. Alinear `RoomDetail` y `RoomInfoCard` con el modelo resultante; después de guardar, volver al detalle y recargar desde API para mostrar el dato persistido, no una copia local posiblemente obsoleta.

### Fase B — Permisos y acceso a edición

1. Corregir `RoomHeader.jsx`: usar `useAuthStore((state) => state.user)` desde el store real; eliminar la referencia no declarada `currentUser`.
2. Mostrar el botón solo al creador y solo en estados editables, usando los IDs reales y una comparación consistente de tipos.
3. Mantener `/salas/:id/editar` bajo `ProtectedRoute`, que ya existe en `AppRoutes.jsx`.
4. Mantener la verificación de creador en `editarSalaService`. La visibilidad del botón y la ruta frontend no son controles de autorización.

### Fase C — Formulario y serialización de fechas

1. Mantener `EditRoomPage` como orquestador y `EditRoomFields` como presentación; reutilizar `Input`, `Button`, `ConfirmModal` y `Spinner`. Mantener los archivos nuevos/modificados dentro del límite de líneas acordado, sin dividir en abstracciones diminutas para cumplirlo.
2. Al cargar, convertir `fechaHoraPartido` a valores `date` y `time` en una sola zona horaria definida por producto. Al enviar, convertir esos valores a timestamp ISO 8601 con zona/offset explícito conforme al contrato.
3. No mezclar `toISOString().split('T')[0]` con hora local. Definir si los horarios representan la zona del complejo; idealmente persistir UTC y editar/mostrar en la zona IANA del lugar. Si todas las salas usan una sola zona, configurarla explícitamente. Probar el round-trip con navegador y servidor en zonas distintas.
4. Cuando la regla de 24 horas bloquea campos críticos, conservar sus valores originales y permitir guardar campos no críticos. No enviar valores `undefined` ni bloquear el formulario por reglas `required` sobre campos que no se están editando.
5. Enviar un PATCH parcial: incluir los campos editables, normalizados y cambiados; omitir los demás. Para las fechas, enviar `fechaHoraPartido` solamente cuando el usuario la haya podido modificar y cambiado.
6. La pantalla debe distinguir carga, error de carga, sala no encontrada/no autorizada y formulario disponible. No renderizar un formulario vacío si la consulta falla. Evitar navegación/actualizaciones de estado si el componente se desmonta durante la petición.
7. Mantener la confirmación previa al envío. Deshabilitar confirmación mientras guarda y evitar doble submit; cerrar modal y navegar solo si PATCH resulta exitoso.

Archivos frontend esperados:
- `src/features/matches/services/matchService.js` — unificar GET/PATCH y desempaquetado.
- `src/features/matches/services/matchMapper.js` — adaptación de API a modelo UI.
- `src/features/matches/utils/dateUtils.js` — conversiones probadas para zona acordada y cálculo visual del bloqueo.
- `src/features/matches/components/RoomHeader.jsx` — identidad del usuario y condición visual de edición.
- `src/features/matches/pages/RoomDetail.jsx` — consumir modelo consistente.
- `src/features/matches/pages/EditRoomPage.jsx` y `src/features/matches/components/EditRoom/EditRoomFields.jsx` — flujo y formulario.
- `src/features/matches/schemas/roomSchema.js` — conservar como esquema compartido; ajustar validación para campos bloqueados o enviar solo valores válidos.
- `src/routes/AppRoutes.jsx` — ya tiene la ruta; solo modificar si la verificación confirma que falta.

### Fase D — Integridad backend y concurrencia

1. Mantener `PATCH /:id`, autenticación JWT, validación de parámetros UUID y `editarSalaBodySchema`. Rechazar cuerpos vacíos y entradas inválidas antes del servicio.
2. Actualizar `editarSalaService` en una transacción TypeORM. Dentro de la transacción:
   - adquirir primero el bloqueo de escritura de la fila `Sala`;
   - cargar/contar las participaciones confirmadas desde el mismo manager/transacción;
   - comprobar existencia, creador, estado, ventana temporal y cupos;
   - aplicar la actualización y el estado derivado;
   - leer la sala persistida para la respuesta antes del commit.
3. No usar `baseSalaRepo` global para parte de la operación transaccional ni actualizar fuera de la transacción. Evitar `as any` para la ubicación: centralizar el formato espacial aceptado por TypeORM/MySQL y tiparlo contra la entidad/driver.
4. Usar el mismo orden de bloqueo sobre la fila `Sala` en toda operación que cambie participantes o disponibilidad: unirse, salir, expulsar y aprobar solicitudes si corresponde. Leer conteos y actualizar estado bajo esa transacción. La restricción única usuario/sala es una defensa adicional, no un sustituto del bloqueo.
5. Verificar soporte de `pessimistic_write` con la versión de TypeORM y MySQL del proyecto. Bloquear la fila sala con QueryBuilder/manager dentro de transacción y no asumir que un `findOne` con joins bloquea de forma idéntica todas las tablas relacionadas.
6. Asegurar que el resultado del conteo trata `CONFIRMADO` consistentemente (incluyendo/excluyendo suplentes según la decisión del dominio). No aceptar un estado derivado obsoleto; para capacidades no excedidas calcular `ABIERTA`, para capacidad alcanzada o superada calcular `COMPLETA`.
7. Mantener los códigos actuales de negocio: `400` para regla temporal/cuerpo inválido, `403` para usuario sin permiso, `404` para inexistente, `409` para estado no editable o cupos incompatibles. No exponer errores internos en la respuesta.

Archivos backend esperados:
- `src/modules/sala/sala.schema.ts` — ajustar validación de fechas/campos solo si las pruebas contractuales lo requieren; definir explícitamente cómo se aceptan timestamps con zona.
- `src/modules/sala/sala.service.ts` — transacción y reglas de negocio.
- `src/modules/sala/sala.repository.ts` — añadir operaciones que reciban el manager transaccional o mover lecturas al servicio transaccional.
- `src/modules/sala/sala.routes.ts` y `sala.controller.ts` — conservar la ruta PATCH y respuesta envelope actual; evitar duplicar validaciones/autorización en varias capas.
- Revisar los servicios de participantes para que bloqueen la misma fila sala al modificar conteos/estado.

## 6. Pruebas y criterios de aceptación

### Backend

- Schema: PATCH vacío, campos inválidos, fecha inválida/no futura, coordenadas fuera de rango y cupos no enteros son rechazados.
- Permisos/estado: creador actualiza; otro usuario recibe 403; UUID inexistente recibe 404; cancelada/finalizada recibe 409.
- Regla temporal: exactamente 24 horas restantes bloquea cambio crítico; más de 24 permite si la nueva fecha respeta el mínimo; nueva fecha en/antes del límite mínimo se rechaza.
- Capacidad: menos confirmados que cupos deja ABIERTA; igualdad o exceso deja COMPLETA; nunca permite cupos inferiores a confirmados. `PENDIENTE` no cuenta.
- Concurrencia: ejecutar simultáneamente uniones y reducción de cupos no sobrepasa la capacidad ni permite guardar una capacidad incompatible. Verificar edición concurrente con alta, baja y expulsión.
- PATCH parcial: omitir un campo conserva el valor previo; editar un campo no borra otros.
- Integración: ruta responde `{ success, data }` y el frontend interpreta tanto el éxito como los errores de negocio.

### Frontend

- El creador ve botón y puede abrir la ruta; otros usuarios no ven botón y al entrar manualmente no pueden editar (la API mantiene la última palabra).
- GET rellena correctamente todos los campos a partir de una respuesta envelope real.
- La pantalla de detalle muestra título, descripción, fecha, hora, cancha, dirección, privacidad, estado y participantes correctos.
- Con 24 horas o menos se bloquean los campos críticos, pero aún se pueden guardar cambios permitidos.
- Round-trip de fecha/hora conserva el mismo instante bajo la zona horaria acordada.
- Confirmar persiste el PATCH y al volver a detalle se ven los datos actualizados; cancelar modal no envía cambios; errores se muestran sin perder el formulario.
- Ejecutar ESLint/build del frontend y TypeScript build del backend; agregar pruebas al runner disponible o pruebas de integración enfocadas donde aún no haya runner configurado.

## 7. Orden de entrega

1. Alinear el request PATCH y respuesta GET entre frontend y backend; reparar el runtime del header.
2. Implementar el mapper y corregir el detalle antes de usarlo como verificación visual post-edición.
3. Corregir el round-trip de fecha/hora y los campos bloqueados; verificar payload parcial.
4. Hacer transaccionales edición y operaciones de participación con orden de bloqueo compartido.
5. Añadir y ejecutar pruebas de reglas, permisos, zona horaria y concurrencia.
6. Probar manualmente el recorrido completo: creador abre sala → edita campos permitidos → confirma → se actualiza el detalle; repetir con no creador, sala cercana al partido y peticiones concurrentes.

## 8. Decisiones de producto necesarias antes de cerrar implementación

1. ¿Los suplentes confirmados ocupan parte de `cuposTotales`? El backend actual los incluye porque cuenta cualquier participación `CONFIRMADO`; la UI debe adoptar la misma regla o backend y frontend deben cambiar juntos.
2. ¿Qué zona horaria define la fecha/hora de una sala? No asumir la zona horaria del navegador ni serializar una hora local como UTC sin conversión.
3. ¿Editar cupos, privacidad o suplentes sigue permitido dentro de las 24 horas? La regla documentada solo bloquea fecha/hora/ubicación; mantener esa interpretación hasta que producto diga lo contrario.

## 9. Aprobación

UP-018 queda listo para implementar tras acordar las decisiones de la sección 8. El plan original debe corregirse en sus ejemplos: reemplazar `PUT` por `PATCH`, usar la respuesta envelope existente, no duplicar GET/mappers, no asumir modalidad o estado de participantes, y hacer que la transacción cubra todas las operaciones que compiten por los cupos.
