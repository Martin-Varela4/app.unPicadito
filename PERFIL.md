# Plan de corrección de edición de perfil

## Objetivo

Corregir el formulario de edición de perfil con cambios pequeños, preservar la lógica de actualización de los demás datos y evitar que el email de inicio de sesión pueda editarse o enviarse como parte de una actualización normal del perfil.

## Hallazgos

- La pantalla ya utiliza componentes compartidos: `Input`, `Select`, `Button` y `Card`.
- Existe un componente `Switch` con las props `checked`, `onChange` y `label`, suficiente para habilitar explícitamente el cambio de contraseña.
- El campo de usuario con prefijo `@` tiene un único uso localizado. No hace falta extraerlo a un componente reutilizable global por ahora.
- El formulario inicializa `email` dentro de `formData` y crea el payload copiando todo el estado. Aunque se quite la edición visual, mantenerlo en ese objeto permitiría que el email siguiera enviándose al servicio.
- Actualmente, completar cualquier campo de contraseña activa una validación que exige los tres valores. Sin una acción explícita para habilitar el cambio, esto puede bloquear el guardado normal si se escribe accidentalmente en uno de esos campos.

## Decisiones y motivos

### 1. Reutilizar los componentes que ya existen

- Mantener `Input` para los campos de texto y contraseña, `Select` para la posición, `Card` para la presentación y `Button` para las acciones.
- Usar el `Switch` existente para optar explícitamente por cambiar la contraseña.
- No crear nuevos componentes para esta corrección: los componentes disponibles cubren las necesidades y el prefijo `@` no tiene suficiente repetición para justificar una abstracción compartida.
- Crear un componente nuevo solo si, durante la implementación, se descubre otro uso real que necesite exactamente el mismo control compuesto.

### 2. No permitir editar ni enviar el email

- Quitar el campo de email editable del formulario.
- Si se decide conservar el email visible como referencia, mostrarlo como texto de solo lectura, fuera del conjunto de controles editables.
- Retirar `email` del estado del formulario usado para editar y construir el payload únicamente con campos permitidos del perfil.
- No confiar solo en ocultar o deshabilitar un input: el email tampoco debe incluirse en la petición `PATCH` de actualización de perfil.
- Motivo: el email es un identificador sensible para el inicio de sesión y no debe modificarse desde este flujo ni enviarse accidentalmente al servicio.

### 3. Hacer optativo el cambio de contraseña

- Añadir un estado booleano local, inicialmente desactivado, asociado al `Switch` con un texto claro como “Quiero cambiar mi contraseña”.
- Con el switch desactivado, ocultar o mantener deshabilitados los campos de contraseña y omitir `currentPassword`, `password` y `passwordConfirm` del payload. El usuario podrá guardar los otros cambios sin tocar su contraseña.
- Al activar el switch, mostrar y habilitar contraseña actual, nueva contraseña y confirmación; exigir los tres valores antes de enviar.
- Validar que la nueva contraseña cumpla el mínimo existente y que coincida con su confirmación. Mostrar un error comprensible y detener la petición si la validación falla.
- Al desactivar el switch, limpiar los tres valores del estado para evitar enviar datos ingresados previamente por accidente.
- Motivo: el cambio se vuelve una acción intencional y separada de la edición normal, y las credenciales solo se incluyen cuando el usuario realmente las quiere cambiar.

## Alcance de implementación

- `src/features/profile/pages/ProfileEdit.jsx`
  - Reutilizar los componentes compartidos existentes.
  - Retirar el email del formulario editable y del objeto que se envía.
  - Añadir el opt-in de cambio de contraseña y condicionar los campos y la validación.
  - Mantener intactos la carga del perfil, la edición de datos no sensibles, los estados de carga/guardado/error y la navegación actual.
- No modificar `profile.service.js`, rutas ni el contrato del endpoint salvo que la validación de la implementación demuestre que el backend requiere un ajuste independiente. Primero se debe confirmar que el endpoint acepta la omisión del email y de los campos de contraseña cuando no se cambia la contraseña.

## Flujo esperado

| Acción | Campos de contraseña requeridos | Campos de contraseña enviados |
|---|---|---|
| Editar perfil con el switch apagado | Ninguno | Ninguno |
| Activar cambio y dejar algún campo vacío | Los tres | No se envía la petición; se muestra validación |
| Activar cambio y completar datos válidos | Contraseña actual, nueva y confirmación coincidente | Los campos necesarios para cambiar la contraseña |
| Desactivar el cambio después de escribir credenciales | Ninguno | Ninguno; limpiar los valores locales |

En todos los flujos, el email queda fuera del payload de actualización.

## Verificación

- Ejecutar ESLint en `src/features/profile/pages/ProfileEdit.jsx` y `npm run build`.
- Comprobar que se pueden guardar cambios de perfil con el switch apagado y sin ingresar contraseñas.
- Comprobar que, con el switch activado, se exigen los tres campos y se rechazan contraseñas nuevas que no coinciden con la confirmación.
- Comprobar que apagar el switch limpia los campos y no envía credenciales.
- Inspeccionar el payload de `PATCH /users/me`: no debe incluir email; solo debe incluir datos de contraseña cuando el cambio fue activado y validado.
- Verificar que el email no tenga control editable y que el resto de los campos, la carga, los errores y la navegación mantengan su comportamiento.
