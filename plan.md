# Plan: adaptar la edición de perfil a Tailwind y diseño responsive

## Objetivo

Actualizar visualmente la pantalla de edición de perfil para que use el mismo enfoque de composición con Tailwind y componentes reutilizables que las demás páginas, se adapte a móvil, tablet y escritorio, y no dependa de estilos en línea ni de las clases heredadas de `App.css`.

## Alcance y restricciones

- Limitar los cambios a la presentación de la pantalla de edición de perfil y, si hiciera falta, a componentes visuales propios de esta funcionalidad.
- Mantener intactos la carga y actualización del perfil, la validación de contraseñas, la vista previa del avatar, la navegación de cancelar/volver y los estados de carga, guardado y error.
- No modificar servicios, rutas ni el modelo de datos.
- No agregar atributos `style` ni estilos específicos en CSS para resolver el diseño.
- Reutilizar los componentes y tokens existentes antes de crear nuevas abstracciones.

## Implementación propuesta

1. **Reemplazar las clases heredadas por utilidades Tailwind**
   - Aplicar al contenedor de página fondo, ancho, espaciado y altura mínima con clases Tailwind y los tokens visuales ya definidos en `src/index.css`.
   - Construir una cabecera con botón de regreso accesible y título. Mantenerla dentro del flujo del documento, salvo que la revisión visual confirme que debe ser sticky.
   - Centrar el contenido con un ancho máximo legible y evitar que los controles o mensajes generen desbordamiento horizontal.

2. **Componer el formulario con los componentes compartidos**
   - Usar `Card`, `CardContent`, `CardHeader` o `CardFooter` de `src/components/ui/Card.jsx` para agrupar el formulario de manera consistente.
   - Reutilizar `Input` y `Button` de `src/components/ui/` donde sus props cubran el caso. Usar el control compartido de selección si es compatible; en caso contrario, estilizar el `select` localmente con clases Tailwind, sin añadir CSS global.
   - Mantener labels asociados a sus controles, estados de error visibles y foco perceptible.
   - Para el campo de usuario con prefijo `@`, componer el prefijo y el control con un contenedor Tailwind; preservar el nombre, valor, `onChange`, autocomplete y obligatoriedad actuales.
   - Separar visualmente los datos personales y el cambio de contraseña mediante encabezados, espaciado y un divisor accesible, sin alterar la estructura de datos enviada.

3. **Estilizar la vista previa del avatar con Tailwind**
   - Mantener la imagen con tamaño fijo, recorte `object-cover`, forma circular y borde que contraste con el fondo.
   - Para el placeholder, conservar la inicial de `nombre` (o `?`) y usar utilidades equivalentes al diseño previo:

     ```jsx
     className="flex items-center justify-center bg-[var(--color-brand-primary)] text-white text-2xl font-bold"
     ```

   - Mantener la pista de ayuda debajo del avatar con texto legible y centrado. La URL de la imagen seguirá editándose desde el campo actual.

4. **Definir el comportamiento responsive**
   - **Móvil (320 px en adelante):** una sola columna; controles y tarjeta a ancho completo dentro de márgenes seguros; pares de campos apilados; acciones de cancelar y guardar apiladas y de ancho completo; textos largos con ajuste de línea.
   - **Tablet y escritorio:** centrar la tarjeta con un ancho máximo; pasar nombre/apellido y nueva contraseña/confirmación a dos columnas solo cuando haya espacio suficiente; mantener email, usuario y contraseña actual a ancho completo.
   - Usar variantes responsive de Tailwind (`sm:`, `md:`, etc.) en lugar de media queries manuales. Comprobar específicamente que no aparezca scroll horizontal en anchos pequeños.

5. **Mantener consistencia y accesibilidad**
   - Conservar `role="status"` para carga y `role="alert"` para errores.
   - Mantener los atributos `disabled` durante carga/guardado, los textos de acción y el orden de tabulación.
   - Usar los colores y fondos definidos por los tokens de la aplicación, evitando recuperar variables antiguas de `App.css`.

## Archivos previstos

- `src/features/profile/pages/ProfileEdit.jsx`: migración de las clases heredadas a composición Tailwind, sin cambiar lógica.
- Componentes de `src/components/ui/`: solo se modificarían si se identifica una carencia concreta que afecte a la reutilización de esta pantalla.
- `plan.md`: este documento de implementación.

## Verificación

- Ejecutar ESLint sobre los archivos JSX modificados.
- Ejecutar `npm run build`.
- Revisar la pantalla en anchos de 320 px, 375 px, 768 px y escritorio.
- Confirmar que no hay desbordamiento horizontal y que carga, errores, cambio de avatar, edición de campos, cambio opcional de contraseña, cancelar y guardar conservan su comportamiento.
- Confirmar que la pantalla no depende de selectores de `App.css` ni introduce estilos en línea.
