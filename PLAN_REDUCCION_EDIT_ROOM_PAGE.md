# Plan de refactor: reducir `EditRoomPage.jsx`

## Objetivo

Reducir de forma importante la cantidad de código en `EditRoomPage.jsx` manteniendo el flujo de carga, validación, edición parcial, confirmación y guardado. Evitar nuevas dependencias, lógica duplicada y componentes sin reutilización.

## Revisión previa

El proyecto ya contiene componentes adecuados para la presentación:

- `src/features/matches/components/EditRoom/EditRoomFields.jsx`: formulario controlado para los campos editables; usa el componente compartido `Input`.
- `src/components/ConfirmModal.jsx`: confirmación antes de guardar.
- `src/components/Button.jsx`: acciones de cancelar y guardar.
- `src/components/Spinner.jsx`: estado de carga.
- `src/features/matches/schemas/roomSchema.js`: validación Yup existente.
- `src/features/matches/services/matchService.js`: lectura y actualización de la sala.
- `src/features/matches/utils/dateUtils.js`: bloqueo temporal y conversión de fecha/hora.

No hace falta crear nuevos componentes visuales ni instalar paquetes. El trabajo que quedaba dentro de la página era la lógica de estado y del ciclo de edición, por lo que se concentra en un hook específico de la feature.

## Implementación

1. Crear `src/features/matches/hooks/useEditRoom.js` para:
   - cargar los datos y preparar valores iniciales del formulario;
   - calcular si fecha, hora y ubicación están bloqueadas;
   - manejar cambios, errores de validación Yup y errores del servicio;
   - construir el PATCH solo con los campos modificados;
   - abrir/cerrar la confirmación y guardar los cambios.
2. Mantener `EditRoomFields` como formulario controlado y pasarle estado, errores, bloqueo y callback de cambio.
3. Dejar `EditRoomPage.jsx` como composición de estados visuales, formulario, botones y modal.
4. Reutilizar `Button`, `ConfirmModal`, `Spinner`, `roomSchema`, `matchService` y `dateUtils`; no duplicar sus responsabilidades.
5. Mantener el uso de Yup ya presente en el proyecto, sin React Hook Form ni resolver adicional.

## Resultado esperado

- `EditRoomPage.jsx` queda como página de presentación compacta.
- La lógica queda encapsulada en `useEditRoom`, sin alterar el contrato de la API ni sus reglas de edición.
- Se conservan los cambios parciales, el bloqueo de campos críticos y la confirmación antes del PATCH.
- Si falla la carga, no se presenta un formulario vacío.
- Las peticiones completadas tras desmontar la página no actualizan su estado.

## Validación

- Ejecutar ESLint sobre la página, el hook y los campos del formulario.
- Ejecutar `npm run build`.
- Confirmar que `EditRoomPage.jsx` tiene sustancialmente menos líneas que antes y que no quedan imports a dependencias de formulario no instaladas.
