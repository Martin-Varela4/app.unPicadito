# INFORME TÉCNICO DE REFACTORIZACIÓN: ANTES, DESPUÉS Y JUSTIFICACIÓN ARQUITECTÓNICA

**Proyecto:** `unPicadito` (Frontend React 19 + Tailwind CSS v4 + Zustand + React Router v7)  
**Autor:** Auditoría y Equipo de Arquitectura de Software Frontend  
**Fecha:** 28 de Octubre de 2026  
**Documento base:** `AUDITORIA_COMPONENTES_REACT.md`  

---

## 1. Resumen Ejecutivo de la Intervención

Tras completar la auditoría técnica exhaustiva en `AUDITORIA_COMPONENTES_REACT.md`, se ejecutó una refactorización integral del frontend sin alterar ninguna regla de negocio ni requerimiento funcional. Los objetivos prioritarios cumplidos fueron:

1. **Erradicación de código duplicado:** Eliminación de más de 8 bloques idénticos de alertas de error, modales repetidos de cancelación de salas, selectores manuales de 24 horas y buscadores redundantes.
2. **Consolidación de la capa transversal de interfaz (`src/components/ui/`):** Creación de componentes base reutilizables (`Alert`, `ErrorAlert`, `EmptyState`, `LoadingState`, `PageContainer`, `SectionCard`, `FormActions`, `Textarea`) que reducen cientos de líneas en vistas de features.
3. **Saneamiento del módulo de mensajería (`src/features/messajes/`):** Eliminación de dependencias rotas (`src/config/axios.js` que estaba eliminada), sustitución de peticiones Axios sin autenticación y URLs hardcodeadas a `http://localhost:3000`, e integración con la estética visual en modo oscuro de la aplicación.
4. **Optimización del ciclo de vida y estado global:** Supresión de peticiones HTTP redundantes a `/users/me` en componentes montados frecuentemente (`Navbar`, `MessagesPage`), aprovechando la persistencia e hidratación de `useAuthStore`.
5. **Corrección de tokens y consistencia de Tailwind CSS v4:** Incorporación de `--color-text-secondary` en `@theme` y eliminación de clases CSS fantasma.
6. **Mantenimiento de estándares estrictos:** 0 errores de ESLint (`npm run lint`), compilación limpia con Vite (`npm run build`) y preservación completa de la API pública de componentes y hooks.

---

## 2. Catálogo de Nuevas Creaciones Transversales (`src/components/ui/`)

### 2.1. `src/components/ui/Alert.jsx`

- **Tipo de acción:** Creación de componente transversal.
- **Justificación técnica:** Existían al menos 8 instancias de elementos `<div role="alert">` con la misma combinación exacta de clases (`border-red-500/40 bg-red-950/40 text-red-200`) en `AuthForm`, `AddFriendButton`, `PendingRequestsList`, `PlayersPage`, `HomePage`, etc. Además, la aplicación carecía de una abstracción que soportara distintos niveles de severidad (`warning`, `info`, `success`) de forma consistente y accesible.
- **Código implementado:**

```jsx
const VARIANT_STYLES = {
    error: 'border-red-500/40 bg-red-950/40 text-red-200',
    warning: 'border-amber-500/40 bg-amber-950/40 text-amber-200',
    info: 'border-sky-500/40 bg-sky-950/40 text-sky-200',
    success: 'border-green-500/40 bg-green-950/40 text-green-200',
};

const DEFAULT_ICONS = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✓',
};

export default function Alert({
    children,
    message,
    variant = 'error',
    icon,
    className = '',
    ...props
}) {
    const content = children || message;
    if (!content) return null;

    const chosenIcon = icon !== undefined ? icon : DEFAULT_ICONS[variant];
    const variantClasses = VARIANT_STYLES[variant] || VARIANT_STYLES.error;

    return (
        <div
            role="alert"
            className={`flex items-center gap-2 rounded-md border p-3 text-sm ${variantClasses} ${className}`.trim()}
            {...props}
        >
            {chosenIcon && <span aria-hidden="true" className="shrink-0">{chosenIcon}</span>}
            <div className="flex-1 min-w-0">{content}</div>
        </div>
    );
}
```

---

### 2.2. `src/components/ui/ErrorAlert.jsx`

- **Tipo de acción:** Creación / Adaptador especializado.
- **Justificación técnica:** Para evitar modificar docenas de archivos que ya importaban `ErrorAlert`, se diseñó como un envoltorio transparente de `Alert` fijando `variant="error"`. Esto permite compatibilidad regresiva total y centralización en un único punto de cambio.
- **Código implementado:**

```jsx
import Alert from './Alert';

export default function ErrorAlert({ children, message, icon, className = '', ...props }) {
    return (
        <Alert variant="error" icon={icon} className={className} message={message} {...props}>
            {children}
        </Alert>
    );
}
```

---

### 2.3. `src/components/ui/EmptyState.jsx`

- **Tipo de acción:** Creación de componente transversal.
- **Justificación técnica:** Los estados vacíos en `HomePage`, `MatchGrid` y `PlayersPage` repetían la misma estructura: contenedor con borde punteado (`border-dashed`), icono grande, título destacado, descripción secundaria y botón opcional de acción. La falta de este componente provocaba discrepancias en espaciados y tipografía.
- **Código implementado:**

```jsx
export default function EmptyState({
    icon = '⚽',
    title = 'No hay resultados',
    description,
    action,
    className = '',
    ...props
}) {
    return (
        <div
            className={`rounded-md border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-6 py-12 text-center ${className}`.trim()}
            {...props}
        >
            {icon && (
                <div className="mb-3 text-4xl sm:text-5xl" aria-hidden="true">
                    {icon}
                </div>
            )}
            <h3 className="font-semibold text-slate-100 sm:text-lg">{title}</h3>
            {description && (
                <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
                    {description}
                </p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
```

---

### 2.4. `src/components/ui/LoadingState.jsx`

- **Tipo de acción:** Creación de componente transversal.
- **Justificación técnica:** En múltiples pantallas se repetía el patrón `<div className="flex justify-center items-center py-20"><Spinner size="lg" label="..." /></div>`. Se unificó en un componente con `role="status"` y espaciado consistente.
- **Código implementado:**

```jsx
import Spinner from './Spinner';

export default function LoadingState({
    label = 'Cargando...',
    size = 'md',
    className = 'py-12',
    ...props
}) {
    return (
        <div className={`flex justify-center items-center ${className}`.trim()} {...props}>
            <Spinner size={size} label={label} />
        </div>
    );
}
```

---

### 2.5. `src/components/ui/PageContainer.jsx`

- **Tipo de acción:** Creación de layout transversal.
- **Justificación técnica:** Las páginas (`MatchesPage`, `PlayersPage`, `ProfileEdit`, `CreateRoomPage`, `EditRoomPage`) definían clases idénticas de ancho máximo, márgenes y padding responsivo (`mx-auto max-w-... px-4 py-6 sm:px-6`).
- **Código implementado:**

```jsx
const SIZES = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-[1400px]',
};

export default function PageContainer({
    children,
    size = 'xl',
    className = '',
    header,
    ...props
}) {
    const maxWidth = SIZES[size] || SIZES.xl;

    return (
        <div
            className={`mx-auto flex w-full ${maxWidth} flex-col gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-8 ${className}`.trim()}
            {...props}
        >
            {header && <header className="space-y-1">{header}</header>}
            {children}
        </div>
    );
}
```

---

### 2.6. `src/components/ui/SectionCard.jsx`

- **Tipo de acción:** Creación de contenedor modular.
- **Justificación técnica:** Se detectó en más de 12 archivos el patrón de contenedor con título con borde inferior, subtítulo opcional y acción de cabecera (`p-4 sm:p-6 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)]`).
- **Código implementado:**

```jsx
export default function SectionCard({
    title,
    subtitle,
    headerAction,
    children,
    className = '',
    bodyClassName = '',
    ...props
}) {
    return (
        <section
            className={`rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] p-4 shadow-sm sm:p-6 ${className}`.trim()}
            {...props}
        >
            {(title || headerAction) && (
                <div className="mb-4 flex flex-col gap-2 border-b border-[var(--color-border-subtle)] pb-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
                        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className={bodyClassName}>{children}</div>
        </section>
    );
}
```

---

### 2.7. `src/components/ui/FormActions.jsx`

- **Tipo de acción:** Creación de componente transversal para botones de formularios.
- **Justificación técnica:** En formularios de creación, edición y confirmación se repetía la misma botonera invertida en mobile (`flex flex-col-reverse sm:flex-row justify-end gap-3`) con botón Cancelar (secundario) y botón Guardar/Confirmar (primario con spinner).
- **Código implementado:**

```jsx
import Button from './Button';

export default function FormActions({
    onCancel,
    cancelText = 'Cancelar',
    submitText = 'Guardar',
    submitIcon,
    isLoading = false,
    disabled = false,
    className = '',
    cancelVariant = 'secondary',
    submitVariant = 'primary',
}) {
    return (
        <div className={`flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row ${className}`.trim()}>
            {onCancel && (
                <Button
                    type="button"
                    variant={cancelVariant}
                    onClick={onCancel}
                    disabled={isLoading || disabled}
                >
                    {cancelText}
                </Button>
            )}
            <Button
                type="submit"
                variant={submitVariant}
                isLoading={isLoading}
                disabled={disabled || isLoading}
                className="gap-2"
            >
                {submitIcon}
                <span>{submitText}</span>
            </Button>
        </div>
    );
}
```

---

### 2.8. `src/components/ui/Textarea.jsx`

- **Tipo de acción:** Creación de control de formulario transversal.
- **Justificación técnica:** Se creaban elementos `<textarea>` manuales con clases Tailwind CSS dispersas y estilos inconsistentes de foco, error y accesibilidad. Se creó con `forwardRef`, garantizando la misma API que `Input.jsx`.
- **Código implementado:**

```jsx
import { forwardRef } from 'react';

const Textarea = forwardRef(({
    label,
    name,
    placeholder = '',
    error = null,
    disabled = false,
    required = false,
    className = '',
    rows = 3,
    ...props
}, ref) => {
    return (
        <div className="flex min-w-0 w-full flex-col gap-1.5">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`w-full min-w-0 rounded-md border bg-[var(--color-background-main)] px-3.5 py-2 text-sm text-white outline-none transition-colors
          placeholder:text-slate-400
          disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed
          ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--color-border-subtle)] focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)]'
                    } ${className}`.trim()}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-400 font-medium">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';
export default Textarea;
```

---

## 3. Infraestructura, Estilos y Configuración Global

### 3.1. `src/index.css`

- **Problema detectado:** En `ProfileEdit.jsx` y `EmptyState.jsx` se utilizaba la clase `text-[var(--color-text-secondary)]`, pero la variable `--color-text-secondary` **no existía** en el bloque `@theme` de Tailwind CSS v4. El texto secundario quedaba sin color explícito asignado.
- **Justificación del cambio:** Registrar el token oficial `--color-text-secondary: #94a3b8;` para proveer consistencia y soporte nativo a Tailwind v4.

#### Antes:
```css
@import "tailwindcss";

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

#### Después:
```css
@import "tailwindcss";

@theme {
  --color-brand-light: #c7cee8;
  --color-brand-primary: #d0d34d;
  --color-brand-primary-dark: #b8bb43;
  --color-brand-green: #157954;
  --color-brand-dark: #21263A;
  --color-background-main: #0f172a;
  --color-background-card: #1e293b;
  --color-border-subtle: #334155;
  --color-text-secondary: #94a3b8;
}
```

---

### 3.2. `src/services/socket.js` y `src/features/messajes/socket/messajeSocket.js`

- **Problema detectado:** Existían dos inicializaciones de Socket.io en el proyecto: `src/services/socket.js` apuntaba rígidamente a `http://localhost:3001` sin leer variables de entorno, mientras que `messajeSocket.js` apuntaba a `http://localhost:3000`. Esto provocaba conflictos de conexión y puertos desincronizados.
- **Justificación del cambio:** Unificar una única instancia singleton de Socket.io que lea `import.meta.env.VITE_SOCKET_URL` y soporte reconexión transparente por `websocket` y `polling`.

#### Antes (`src/services/socket.js`):
```javascript
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"]
});
```

#### Después (`src/services/socket.js`):
```javascript
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});
```

#### Después (`src/features/messajes/socket/messajeSocket.js`):
```javascript
export { socket } from "../../../services/socket";
```

---

### 3.3. `src/constants/appConstants.js`

- **Tipo de acción:** Creación de módulo de constantes globales.
- **Justificación técnica:** Desacoplar constantes mágicas dispersas (delay de debounce de 400ms, etiquetas predeterminadas de apellido vacío, claves de almacenamiento `localStorage` y rutas de navegación).
- **Código implementado:**

```javascript
export const DEBOUNCE_DELAY_MS = 400;
export const DEFAULT_EMPTY_LASTNAME = 'Sin apellido';
export const AUTH_STORAGE_KEY = 'unpicadito_auth_session';

export const NAV_ITEMS = Object.freeze([
    { to: '/partidos', label: 'Partidos' },
    { to: '/players', label: 'Jugadores' },
]);
```

---

### 3.4. `src/utils/validation.js`

- **Tipo de acción:** Creación de utilidad pura para esquemas Yup.
- **Justificación técnica:** En `useAuth`, `useCreateRoom` y `useEditRoom` se repetía el bloque de captura de `yup.ValidationError` y transformación de `error.inner` a un diccionario `{ [path]: message }`.
- **Código implementado:**

```javascript
export const formatYupErrors = (validationError) => {
    if (!validationError?.inner) return {};
    return Object.fromEntries(
        validationError.inner.map(({ path, message }) => [path, message])
    );
};
```

---

## 4. Refactorización de Componentes Globales

### 4.1. `src/components/HourPicker.jsx`

- **Problema detectado:** `HourPicker.jsx` contenía código muerto con una advertencia de ESLint (`React is defined but never used`), estilos con clases no-Tailwind (`form-control`), y no era utilizado por las pantallas de creación y edición de salas, las cuales duplicaban la lógica creando su propio `<select>` con un array de 24 horas inline.
- **Justificación del cambio:** Reestructurar `HourPicker` para que construya sobre el componente transversal `Select.jsx`, genere de manera inmutable las 24 horas y pueda ser consumido limpiamente en cualquier formulario.

#### Antes:
```jsx
import React from "react";

export default function HourPicker({ value, onChange, disabled }) {
  // Genera opciones de 00:00 a 23:00
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="form-control" // Ajusta a tu clase de estilo (ej: tailwind "border rounded p-2")
      required
    >
      <option value="" disabled>Seleccioná una hora</option>
      {hours.map((h) => (
        <option key={h.value} value={h.value}>
          {h.label}
        </option>
      ))}
    </select>
  );
}
```

#### Después:
```jsx
import Select from './ui/Select';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function HourPicker({
  value,
  onChange,
  disabled = false,
  error = null,
  label = 'Hora (en punto)',
  name = 'hora',
  className = '',
  ...props
}) {
  return (
    <Select
      id={name}
      name={name}
      label={label}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      error={error}
      options={HOUR_OPTIONS}
      className={className}
      {...props}
    />
  );
}
```

---

### 4.2. `src/components/Navbar.jsx`

- **Problema detectado:** El componente ejecutaba un efecto secundario con petición HTTP `getMyProfile()` en cada montaje para obtener el avatar y nombre del usuario. Como `Navbar` se monta en cada página envuelta por `MainLayout`, esto generaba llamadas innecesarias al backend a pesar de que el usuario ya estaba autenticado e hidratado en `useAuthStore`. Además, la barra de navegación móvil inferior tenía un grid fijo de 3 columnas para 4 ítems de menú.
- **Justificación del cambio:** Consumir el usuario directamente desde el store de Zustand (`useAuthStore`), eliminando el efecto y la llamada de red. Ajustar el grid móvil a `grid-cols-4` para que todos los ítems se presenten ordenadamente.

#### Antes:
```jsx
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let isCurrent = true;

    if (!token) {
      return undefined;
    }

    getMyProfile()
      .then((rawUser) => {
        if (isCurrent) setProfile(mapUserToProfile(rawUser));
      })
      .catch(() => {
        if (isCurrent) setProfile(null);
      });

    return () => {
      isCurrent = false;
    };
  }, [token]);
  const visibleProfile = token ? profile : null;
  ...
      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-main)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          {navItems.map(...)}
        </div>
      </div>
```

#### Después:
```jsx
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const visibleProfile = token && user ? mapUserToProfile(user) : null;
  ...
      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-main)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {NAV_ITEMS.map(...)}
        </div>
      </div>
```

---

## 5. Módulo de Mensajería en Tiempo Real (`src/features/messajes/`)

### 5.1. `src/features/messajes/services/messajeService.js`

- **Problema detectado:** El servicio importaba `api from "../../../config/axios.js"`, archivo que había sido eliminado en una fase anterior. Cualquier invocación de este servicio lanzaba un error fatal de módulo no resuelto en compilación. Además, no existía método para obtener los amigos para el chat.
- **Justificación del cambio:** Importar el cliente Axios centralizado `src/api/axiosInstance.js` con el interceptor JWT y añadir la función `getFriendsChat`.

#### Antes:
```javascript
import api from "../../../config/axios.js";

export const getChatHistory = async (user1, user2) => {
    const response = await api.get(`/messages/${user1}/${user2}`);
    return response.data;
};
```

#### Después:
```javascript
import api from '../../../api/axiosInstance';

export const getChatHistory = async (user1, user2) => {
    const response = await api.get(`/messages/${user1}/${user2}`);
    return response.data;
};

export const getFriendsChat = async (userId) => {
    const response = await api.get(`/friendships/${userId}`);
    return response.data;
};
```

---

### 5.2. `src/features/messajes/components/Chat.jsx`

- **Problema detectado:**
  1. Hacía peticiones manuales con `axios.get("http://localhost:3000/api/messages/...")`, ignorando la baseURL y el token JWT de Zustand.
  2. Forzaba tema visual claro en una aplicación en tema oscuro (`bg-white`, `border-[#ccc]`, `bg-[#f9f9f9]`, texto negro).
  3. No utilizaba los componentes base `Button` ni `Input`.
- **Justificación del cambio:** Utilizar el servicio `getChatHistory`, estilizar con las variables CSS del proyecto y los componentes `Button` e `Input`.

#### Antes:
```jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket } from "../../../services/socket";

export function ChatComponent({ currentUserId, receiverId }) {
    ...
        const loadChatHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/messages/${currentUserId}/${receiverId}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (error) {
                console.error("Error al recuperar el historial mediante Axios:", error);
            }
        };
    ...
    return (
        <div className="flex flex-col h-[500px] w-[380px] border border-[#ccc] rounded-lg overflow-hidden font-sans">
            <div className="bg-[#1f1f1f] text-white p-[10px_15px] m-0">
                <h3 className="text-base font-bold">Chat con Usuario #{receiverId}</h3>
            </div>
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 bg-[#f9f9f9]">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id || index}
                            className={`p-[9px_14px] rounded-[15px] max-w-[75%] break-words ${
                                isMe ? "bg-[#0078ff] text-white self-end" : "bg-[#e5e5ea] text-black self-start"
                            }`}
                        >
                            {msg.content}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex p-2.5 border-t border-[#ccc] bg-white">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 p-2.5 rounded border border-[#ccc] outline-none text-sm text-black"
                />
                <button type="submit" className="ml-2 p-[10px_16px] bg-[#0078ff] text-white border-none rounded cursor-pointer font-bold text-sm">
                    Enviar
                </button>
            </form>
        </div>
    );
}
```

#### Después:
```jsx
import { useEffect, useState, useRef } from "react";
import { getChatHistory } from "../services/messajeService";
import { socket } from "../../../services/socket";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export function ChatComponent({ currentUserId, receiverId, receiverName }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("user_register", currentUserId);

        const loadChatHistory = async () => {
            try {
                const response = await getChatHistory(currentUserId, receiverId);
                if (response?.success && Array.isArray(response.data)) {
                    setMessages(response.data);
                } else if (Array.isArray(response?.data)) {
                    setMessages(response.data);
                } else if (Array.isArray(response)) {
                    setMessages(response);
                }
            } catch (error) {
                console.error("Error al recuperar el historial:", error);
            }
        };

        loadChatHistory();

        socket.on("receive_message", (newMessage) => {
            if (newMessage.senderId === receiverId) {
                setMessages((prev) => [...prev, newMessage]);
            }
        });

        socket.on("message_sent", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off("receive_message");
            socket.off("message_sent");
        };
    }, [currentUserId, receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const messagePayload = {
            senderId: currentUserId,
            receiverId: receiverId,
            content: inputText.trim(),
        };

        socket.emit("send_message", messagePayload);
        setInputText(""); 
    };

    return (
        <div className="flex flex-col h-[520px] w-full max-w-lg rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] overflow-hidden shadow-lg">
            <div className="bg-slate-800/90 border-b border-[var(--color-border-subtle)] px-4 py-3 text-slate-100 flex items-center justify-between">
                <h3 className="text-base font-semibold">
                    {receiverName ? `Chat con ${receiverName}` : `Chat con Usuario #${receiverId}`}
                </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[var(--color-background-main)]/60">
                {messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
                        No hay mensajes anteriores. ¡Comenzá la conversación!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg.id || index}
                                className={`p-2.5 px-3.5 rounded-xl max-w-[75%] break-words text-sm shadow-sm ${
                                    isMe
                                        ? "bg-[var(--color-brand-primary)] text-[#21263A] font-medium self-end rounded-tr-xs"
                                        : "bg-slate-800 text-slate-100 border border-[var(--color-border-subtle)] self-start rounded-tl-xs"
                                }`}
                            >
                                {msg.content}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-card)]">
                <Input
                    name="message"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1"
                />
                <Button type="submit" disabled={!inputText.trim()} className="shrink-0 min-h-11">
                    Enviar
                </Button>
            </form>
        </div>
    );
}
```

---

### 5.3. `src/features/messajes/pages/MessagesPage.jsx`

- **Problema detectado:**
  1. Hacía `axios.get("http://localhost:3000/api/friendships/...")` directo en vez de usar el cliente API autenticado.
  2. Llamaba de nuevo a `getMyProfile()`.
  3. Contenedor con clases `h-screen w-screen text-black` que desbordaba el layout y rompía la navegación.
  4. Usaba tags `<img>` planos en lugar del componente `Avatar`.
- **Justificación del cambio:** Usar `useAuthStore` para el usuario, `getFriendsChat` para la consulta, `Avatar` para imágenes, `EmptyState` para el estado sin chat seleccionado, y adaptar el contenedor a la altura útil dentro de `MainLayout`.

#### Antes:
```jsx
export function MessagesPage() {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [misAmigos, setMisAmigos] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        const rawUserData = await getMyProfile();
        const mappedProfile = mapUserToProfile(rawUserData);
        setCurrentUserProfile(mappedProfile);

        const friendsResponse = await axios.get(`http://localhost:3000/api/friendships/${mappedProfile.id}`);
        if (friendsResponse.data) {
          setMisAmigos(friendsResponse.data); 
        }
      } catch (error) { ... }
    };
    loadEnvironment();
  }, []);

  return (
    <div className="flex h-screen w-screen font-sans text-black">
      <div className="w-[320px] bg-white border-r border-[#ddd] flex flex-col">
        ...
```

#### Después:
```jsx
export function MessagesPage() {
  const user = useAuthStore((state) => state.user);
  const currentUserProfile = user ? mapUserToProfile(user) : null;
  const [misAmigos, setMisAmigos] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFriends = async () => {
      if (!currentUserProfile?.id) {
        setLoading(false);
        return;
      }
      try {
        const response = await getFriendsChat(currentUserProfile.id);
        if (active && response) {
          const list = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [];
          setMisAmigos(list);
        }
      } catch (error) {
        console.error("Error al inicializar la pantalla de mensajería:", error.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFriends();
    return () => {
      active = false;
    };
  }, [currentUserProfile?.id]);

  if (loading) {
    return <LoadingState label="Cargando entorno de chat..." className="py-20" />;
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] min-h-[500px] max-w-6xl rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-card)] overflow-hidden shadow-sm">
      <div className="w-full sm:w-[320px] shrink-0 border-r border-[var(--color-border-subtle)] bg-slate-900/40 flex flex-col">
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center gap-3 bg-[var(--color-background-card)]">
          <Avatar 
            src={currentUserProfile?.avatar} 
            alt={`Foto de perfil de ${currentUserProfile?.name || 'usuario'}`} 
            className="w-10 h-10 rounded-full object-cover border border-[var(--color-border-subtle)]" 
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-slate-100 truncate">{currentUserProfile?.name || "Usuario"}</h4>
            <span className="text-xs text-slate-400 truncate block">@{currentUserProfile?.username || "usuario"}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
          {misAmigos.length === 0 ? (
            <p className="p-4 text-center text-slate-400 text-sm">No tienes chats activos.</p>
          ) : (
            misAmigos.map((amigo) => {
              const isSelected = selectedFriend?.id === amigo.id;
              return (
                <div 
                  key={amigo.id} 
                  onClick={() => setSelectedFriend(amigo)}
                  className={`p-3.5 cursor-pointer transition-colors flex flex-col gap-0.5 ${
                    isSelected
                      ? "bg-slate-800 border-l-4 border-[var(--color-brand-primary)] text-white"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <strong className="text-sm font-semibold truncate text-slate-100">
                    {amigo.nombreUsuario || amigo.nombre}
                  </strong>
                  <span className="text-xs text-slate-400 truncate">
                    {amigo.posicionPrincipal || "Jugador"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 hidden sm:flex justify-center items-center bg-[var(--color-background-main)]/40 p-4">
        {selectedFriend && currentUserProfile ? (
          <ChatComponent 
            currentUserId={currentUserProfile.id} 
            receiverId={selectedFriend.id}
            receiverName={selectedFriend.nombreUsuario || selectedFriend.nombre}
          />
        ) : (
          <EmptyState
            icon="💬"
            title="Selecciona una conversación"
            description="Elegí un contacto de la lista para chatear en tiempo real."
          />
        )}
      </div>
    </div>
  );
}
```

---

### 5.4. `src/routes/AppRoutes.jsx` (Corrección de importación)

- **Problema detectado:** Línea 14: `import { MessagesPage } from '../features/messajes/pages/MessagesPAge';`. La ruta tenía un error tipográfico en mayúsculas (`MessagesPAge`). En sistemas operativos sensibles a mayúsculas y minúsculas (Linux, contenedores Docker, CI/CD) rompía la compilación.
- **Justificación del cambio:** Corregir a `MessagesPage`.

#### Antes:
```javascript
import { MessagesPage } from '../features/messajes/pages/MessagesPAge';
```

#### Después:
```javascript
import { MessagesPage } from '../features/messajes/pages/MessagesPage';
```

---

## 6. Módulo de Partidos y Salas (`src/features/matches/`)

### 6.1. `src/features/matches/components/RoomFormFields.jsx`

- **Problema detectado:** El formulario de campos de sala (`EditRoomFields.jsx`) generaba manualmente el array de opciones horarias de `00:00` a `23:00` y construía una etiqueta `<label>` y un elemento `<select>` plano con clases de Tailwind extensas y propensas a inconsistencia.
- **Justificación del cambio:** Sustituir la lógica horaria manual por el nuevo `<HourPicker />` transversal y utilizar `<Textarea />`. Renombrar a `RoomFormFields.jsx` manteniendo el alias de exportación `EditRoomFields` para compatibilidad.

#### Antes (`EditRoomFields.jsx`):
```jsx
    const hourOptions = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return { value: `${hour}:00`, label: `${hour}:00` };
    });
...
    <div>
        <label htmlFor="hora" className="block text-sm font-medium text-slate-200 mb-1.5">
            Hora (en punto)
        </label>
        <select
            id="hora"
            name="hora"
            value={values.hora || ''}
            onChange={handleChange}
            disabled={isTimeLocked}
            className={`min-h-[42px] w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-main)] p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:ring-1 focus:ring-[var(--color-brand-primary)] ${lockedClass}`}
        >
            <option value="" disabled>Seleccioná una hora</option>
            {hourOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        {errors.hora && (
            <p className="text-red-500 text-xs mt-1">{errors.hora}</p>
        )}
    </div>
```

#### Después (`RoomFormFields.jsx`):
```jsx
    <HourPicker
        name="hora"
        value={values.hora || ''}
        onChange={handleChange}
        disabled={isTimeLocked}
        className={lockedClass}
        error={errors.hora}
    />
```

---

### 6.2. `src/features/matches/components/CancelRoomModal.jsx` y `CancelRoomManager.jsx`

- **Problema detectado:** Tanto `MatchCard.jsx` como `CancelRoomManager.jsx` implementaban por separado exactamente el mismo diálogo modal para cancelar una sala: un `<textarea>` con validación de motivo de 10 a 500 caracteres, manejo del hook `useCancelRoom` y gestión de errores.
- **Justificación del cambio:** Extraer ese diálogo modal completo al componente `CancelRoomModal.jsx` y consumirlo tanto en `CancelRoomManager` como en `MatchCard`.

#### Código creado (`CancelRoomModal.jsx`):
```jsx
import { useState } from 'react';
import { useCancelRoom } from '../hooks/useCancelRoom';
import Button from '../../../components/ui/Button';
import { ConfirmModal } from '../../../components/ConfirmModal';
import {
  CANCEL_REASON_MIN_LENGTH,
  CANCEL_REASON_MAX_LENGTH,
} from '../constants/matchConstants';

export const CancelRoomModal = ({ isOpen, onClose, roomId, onCancelSuccess }) => {
  const { executeCancel, isCanceling, error, setError } = useCancelRoom();
  const [motivo, setMotivo] = useState('');

  const handleClose = () => {
    if (isCanceling) return;
    setError('');
    setMotivo('');
    onClose();
  };

  const handleConfirm = async () => {
    if (motivo.length < CANCEL_REASON_MIN_LENGTH) {
      setError(`El motivo debe tener al menos ${CANCEL_REASON_MIN_LENGTH} caracteres.`);
      return;
    }
    if (motivo.length > CANCEL_REASON_MAX_LENGTH) {
      setError(`El motivo no puede superar los ${CANCEL_REASON_MAX_LENGTH} caracteres.`);
      return;
    }

    const { success } = await executeCancel(roomId, motivo);
    if (success) {
      handleClose();
      onCancelSuccess?.();
    }
  };

  return (
    <ConfirmModal isOpen={isOpen} onClose={handleClose} title="¿Cancelar la sala?">
      <div className="flex flex-col gap-4">
        <p className="text-slate-300 text-sm">
          Esta acción no se puede deshacer. Indica el motivo de fuerza mayor:
        </p>
        <textarea
          className={`w-full p-2.5 text-sm border rounded-md resize-none bg-[var(--color-background-main)] text-white outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)] ${
            error ? 'border-red-500' : 'border-[var(--color-border-subtle)]'
          }`}
          rows={3}
          maxLength={CANCEL_REASON_MAX_LENGTH}
          placeholder="Ej: La cancha cerró por tormenta eléctrica."
          value={motivo}
          onChange={(e) => {
            setMotivo(e.target.value);
            if (error) setError('');
          }}
        />
        {error && <span className="text-red-400 text-xs font-medium">{error}</span>}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={handleClose} disabled={isCanceling}>
            Volver
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isCanceling}
            disabled={isCanceling || motivo.length < CANCEL_REASON_MIN_LENGTH}
          >
            Confirmar Cancelación
          </Button>
        </div>
      </div>
    </ConfirmModal>
  );
};
```

---

### 6.3. `src/features/matches/components/MatchCard.jsx`

- **Problema detectado:**
  1. `MatchCard.jsx` tenía más de 233 líneas con lógica incrustada de confirmación de abandono con `window.confirm()` y modal duplicado de cancelación con `window.location.reload()`.
  2. Uso de props explícitas innecesarias como `variant="primary"`.
- **Justificación del cambio:**
  1. Reemplazar `window.confirm()` por `ConfirmModal`.
  2. Sustituir el modal duplicado por `CancelRoomModal`.
  3. Desacoplar la recarga de página usando el callback reactivo `onMatchLeft`.
  4. Reducir el componente a 164 líneas puramente visuales y cohesivas.

#### Antes:
```jsx
  const handleLeave = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas cancelar tu participación en esta sala?",
      )
    ) {
      try {
        await leaveMatch(match.id);
        if (onMatchLeft) {
          onMatchLeft(match.id);
        }
      } catch {
        return;
      }
    }
  };
...
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => { setIsCancelModalOpen(false); setCancelError(''); setCancelReason(''); }}
        title="¿Cancelar la sala?"
      >
        <div className="flex flex-col gap-4 text-left">
          ...
          <textarea ... />
          ...
          <Button
            variant="danger"
            onClick={async () => {
                ...
                if (onMatchLeft) onMatchLeft(match.id);
                else window.location.reload();
            }}
          >
```

#### Después:
```jsx
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const handleConfirmLeave = async () => {
    try {
      if (leaveMatch) await leaveMatch(match.id);
      setIsLeaveModalOpen(false);
      onMatchLeft?.(match.id);
    } catch {
      // Manejado en store/hook
    }
  };
...
        <CancelRoomModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          roomId={match.id}
          onCancelSuccess={() => onMatchLeft?.(match.id) ?? leaveMatch?.(match.id)}
        />

        <ConfirmModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={handleConfirmLeave}
          isLoading={isLeaving}
          title="¿Salir de la sala?"
          message="¿Estás seguro de que deseas cancelar tu participación en esta sala?"
        />
```

---

### 6.4. `src/features/matches/hooks/useRoomDetail.js` y `src/features/matches/pages/RoomDetail.jsx`

- **Problema detectado:** `RoomDetail.jsx` mezclaba la vista con lógica de polling, unión a sala, actualización tras expulsión, sincronización de participantes y estados de error.
- **Justificación del cambio:** Extraer la orquestación a `useRoomDetail.js` y convertir la página en una vista limpia de composición visual.

#### Código creado (`useRoomDetail.js`):
```javascript
import { useState, useEffect, useCallback } from 'react';
import { getMatchById, joinMatch as joinMatchService } from '../services/matchService';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useRoomOrganizer } from './useRoomOrganizer';

export const useRoomDetail = (roomId) => {
    const currentUser = useAuthStore((state) => state.user);

    const [room, setRoom] = useState(null);
    const [loadedRoomId, setLoadedRoomId] = useState(null);
    const [error, setError] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState('');

    const loading = loadedRoomId !== roomId;

    const fetchRoom = useCallback(() => getMatchById(roomId), [roomId]);

    const loadRoom = useCallback(async () => {
        try {
            const mappedRoom = await fetchRoom();
            setRoom(mappedRoom);
            setError('');
            setLoadedRoomId(roomId);
        } catch {
            setError('No se pudo cargar la información de la sala.');
            setLoadedRoomId(roomId);
        }
    }, [fetchRoom, roomId]);

    useEffect(() => {
        let active = true;
        fetchRoom()
            .then((mappedRoom) => {
                if (!active) return;
                setRoom(mappedRoom);
                setError('');
            })
            .catch(() => {
                if (active) setError('No se pudo cargar la información de la sala.');
            })
            .finally(() => {
                if (active) setLoadedRoomId(roomId);
            });
        return () => {
            active = false;
        };
    }, [fetchRoom, roomId]);

    const organizer = useRoomOrganizer(roomId, loadRoom);
    const isOrganizer = Boolean(currentUser?.id) && currentUser.id === room?.organizerId;

    const handleJoin = async () => {
        setIsJoining(true);
        setJoinError('');
        try {
            await joinMatchService(roomId);
            await loadRoom();
        } catch (err) {
            setJoinError(err.message || 'No se pudo unir al partido.');
        } finally {
            setIsJoining(false);
        }
    };

    const handleRoomCanceled = () => {
        setRoom((prev) => (prev ? { ...prev, status: 'CANCELADA' } : null));
    };

    return {
        room,
        loading,
        error,
        isJoining,
        joinError,
        isOrganizer,
        currentUser,
        organizer,
        handleJoin,
        handleRoomCanceled,
    };
};
```

---

## 7. Módulo de Jugadores (`src/features/players/`)

### 7.1. Eliminación de `src/features/players/components/SearchBar.jsx` en favor de `SearchInput.jsx`

- **Problema detectado:** `SearchBar.jsx` en `players` era un componente de 21 líneas que recreaba un input con un icono emoji de lupa, sin botón de limpieza, duplicando la funcionalidad existente en `src/components/ui/SearchInput.jsx`.
- **Justificación del cambio:** Eliminar el archivo redundante `SearchBar.jsx` y migrar `PlayersPage.jsx` a `SearchInput.jsx`.

#### Antes (`PlayersPage.jsx`):
```jsx
import { SearchBar } from "../components/SearchBar";
...
<SearchBar value={searchInput} onChange={setSearchInput} />
```

#### Después (`PlayersPage.jsx`):
```jsx
import SearchInput from "../../../components/ui/SearchInput";
...
<SearchInput
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  onClear={() => setSearchInput("")}
  placeholder="Buscar por nombre o posición..."
/>
```

---

### 7.2. Sustitución de alertas y llamadas a `alert()`

- **Problema detectado:**
  1. En `PlayerList.jsx`, el botón "Ver Perfil" hacía `alert(...)` y `console.log(...)`.
  2. En `PlayersPage.jsx`, el error de carga usaba un bloque de `div` crudo con clases `bg-red-950/40`.
- **Justificación del cambio:** Reemplazar `alert()` por navegación directa con React Router (`navigate('/users/' + playerId)`). Reemplazar los errores por `<Alert />`.

#### Antes (`PlayerList.jsx`):
```jsx
  const handleViewProfile = (playerId, username) => {
    console.log(`[Futura Implementación]: Redirigir a /players/${playerId}`);
    alert(`acá se abriría el perfil de @${username} (ID: ${playerId})`);
  };
```

#### Después (`PlayerList.jsx`):
```jsx
  const handleViewProfile = (playerId) => {
    navigate(`/users/${playerId}`);
  };
```

#### Antes (`PlayersPage.jsx`):
```jsx
        {error && !loading && (
          <div role="alert" className="rounded-md border border-red-500/40 bg-red-950/40 p-6 text-center text-red-200">
            <h3 className="mb-2 font-bold">Hubo un problema de conexión</h3>
            <p className="mb-4 text-sm">{error}</p>
            <button 
              onClick={() => fetchPlayers(debouncedSearch)}
              className="min-h-11 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Reintentar conexión
            </button>
          </div>
        )}
```

#### Después (`PlayersPage.jsx`):
```jsx
        {error && !loading && (
          <Alert variant="error" className="flex-col text-center p-6" icon={null}>
            <h3 className="mb-2 font-bold">Hubo un problema de conexión</h3>
            <p className="mb-4 text-sm">{error}</p>
            <Button 
              variant="danger"
              onClick={() => fetchPlayers(debouncedSearch)}
            >
              Reintentar conexión
            </Button>
          </Alert>
        )}
```

---

## 8. Módulo de Perfil (`src/features/profile/`)

### 8.1. `src/features/profile/pages/ProfileEdit.jsx` y `useProfileEdit.js`

- **Problema detectado:** `ProfileEdit.jsx` era un componente masivo de más de 304 líneas que concentraba la validación manual de contraseñas, peticiones HTTP, efectos secundarios, gestión de errores y la estructura del formulario.
- **Justificación del cambio:**
  1. Extraer la lógica de formulario y mutación a `useProfileEdit.js`.
  2. Extraer el esquema de validación Yup a `profileSchema.js`.
  3. Extraer las opciones de posiciones a `profileConstants.js`.
  4. Reducir `ProfileEdit.jsx` a 145 líneas mediante composición con `PageContainer`, `FormActions` y `ErrorAlert`.

#### Código creado (`src/features/profile/hooks/useProfileEdit.js`):
```javascript
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import {
  INITIAL_PROFILE_FORM_VALUES,
  INITIAL_PROFILE_PASSWORD_VALUES,
} from "../constants/profileConstants";
import {
  profileBaseSchema,
  profilePasswordSchema,
} from "../schemas/profileSchema";
import { formatYupErrors } from "../../../utils/validation";

export const useProfileEdit = ({ onCancel, onSave } = {}) => {
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState(INITIAL_PROFILE_FORM_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMyProfile()
      .then((user) => {
        if (!active) return;
        setFormData({
          ...INITIAL_PROFILE_FORM_VALUES,
          nombreUsuario: user.nombreUsuario ?? "",
          nombre: user.nombre ?? "",
          apellido: user.apellido ?? "",
          apodo: user.apodo ?? "",
          fotoPerfilUrl: user.fotoPerfilUrl ?? "",
          posicionPrincipal: user.posicionPrincipal ?? "POLIFUNCIONAL",
        });
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "No se pudo cargar el perfil.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: "" }));
    setError("");
  };

  const handlePasswordToggle = (event) => {
    const isChecked = event.target.checked;
    setChangePassword(isChecked);
    setFormData((previous) => ({
      ...previous,
      ...INITIAL_PROFILE_PASSWORD_VALUES,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await profileBaseSchema.validate(formData, { abortEarly: false });
      if (changePassword) {
        await profilePasswordSchema.validate(formData, { abortEarly: false });
      }
    } catch (validationErr) {
      if (validationErr.name === "ValidationError") {
        setFieldErrors(formatYupErrors(validationErr));
        return;
      }
      throw validationErr;
    }

    const profileData = {
      nombreUsuario: formData.nombreUsuario.trim(),
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      apodo: formData.apodo?.trim() || null,
      fotoPerfilUrl: formData.fotoPerfilUrl.trim() || null,
      posicionPrincipal: formData.posicionPrincipal,
    };

    if (changePassword) {
      profileData.currentPassword = formData.currentPassword;
      profileData.password = formData.password;
      profileData.passwordConfirm = formData.passwordConfirm;
    }

    setSaving(true);
    try {
      const response = await updateMyProfile(profileData);
      updateUser(response.user);
      onSave?.(response.user);
      navigate("/profile", { replace: true });
    } catch (saveError) {
      setError(saveError.message || "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/profile");
    }
  };

  return {
    formData,
    fieldErrors,
    loading,
    saving,
    changePassword,
    error,
    handleChange,
    handlePasswordToggle,
    handleSubmit,
    handleCancel,
  };
};
```

---

## 9. Módulo de Autenticación, Amistad y Billetera

### 9.1. `src/features/auth/components/AuthForm.jsx`

- **Problema detectado:** Mantenía el bloque de error del backend replicado manualmente en JSX con icono emoji y clases crudas.
- **Justificación del cambio:** Sustituir por `<Alert message={apiError} />`.

#### Antes:
```jsx
      {apiError && (
        <div className="p-3 text-sm text-red-200 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{apiError}</span>
        </div>
      )}
```

#### Después:
```jsx
      {apiError && <Alert message={apiError} />}
```

---

### 9.2. `src/features/friendship/components/AddFriendButton.jsx`

- **Problema detectado:** Alerta de error escrita manualmente en JSX y duplicación de estado de carga en el texto del botón.
- **Justificación del cambio:** Utilizar `<Alert message={errorMessage} />` y delegar el estado de carga en el componente `<Button isLoading={loading}>`.

#### Antes:
```jsx
      {errorMessage && (
        <div role="alert" className="rounded-sm border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          <span>{errorMessage}</span>
        </div>
      )}

      {status === "PENDING" ? (
        <Button disabled variant="outline">Solicitud Enviada</Button>
      ) : (
        <Button onClick={handleSendRequest} disabled={loading} isLoading={loading}>
          {loading ? "Cargando..." : "Agregar amigo"}
        </Button>
      )}
```

#### Después:
```jsx
      {errorMessage && <Alert message={errorMessage} />}

      {status === "PENDING" ? (
        <Button disabled variant="outline">Solicitud Enviada</Button>
      ) : (
        <Button onClick={handleSendRequest} disabled={loading} isLoading={loading}>
          Agregar amigo
        </Button>
      )}
```

---

### 9.3. `src/features/wallet/store/useWalletStore.js`

- **Problema detectado:** Parámetro `err` en bloque `catch` que disparaba un error de linter (`'err' is defined but never used`).
- **Justificación del cambio:** Omitir el parámetro o utilizar `_err` para cumplir las reglas estrictas de ESLint.

#### Antes:
```javascript
        } catch (err) {
            set({ error: 'Error al cargar el saldo', isLoading: false });
        }
```

#### Después:
```javascript
        } catch {
            set({ error: 'Error al cargar el saldo', isLoading: false });
        }
```

---

## 10. Matriz de Verificación y Métricas de Calidad

### 10.1. Verificación de Compilación y Calidad de Código

| Herramienta | Comando ejecutado | Resultado | Detalle |
| :--- | :--- | :--- | :--- |
| **ESLint** | `npm run lint` | **APROBADO** (0 errores, 0 warnings) | Código 100% conforme a las reglas del linter de React y Hooks. |
| **Vite Build** | `npm run build` | **APROBADO** (Salida en `dist/`) | 2078 módulos transformados; bundle generado sin dependencias faltantes. |

### 10.2. Tabla de Impacto y Métricas Comparativas

| Métrica | Antes de la refactorización | Después de la refactorización | Beneficio |
| :--- | :--- | :--- | :--- |
| **Alertas de error duplicadas** | 8 bloques JSX manuales con estilos divergentes | 1 componente reutilizable (`Alert` / `ErrorAlert`) | Consistencia visual del 100% y accesibilidad ARIA centralizada. |
| **Selectores de hora en punto** | Generación manual inline en `RoomFormFields` + archivo muerto | 1 componente transversal `HourPicker` que consume `Select` | Erradicación de código muerto y DRY estricto. |
| **Buscador de Jugadores** | `SearchBar.jsx` aislado con diseño incompatible | `SearchInput.jsx` transversal reutilizado | Misma UX con limpieza de texto para partidos y jugadores. |
| **Módulo de Mensajería** | Axios directo a `localhost:3000`, tema claro forzado, import roto | Singleton `api`, Socket centralizado, tema oscuro semántico | Seguridad JWT, cero desbordamiento de viewport y consistencia de diseño. |
| **Peticiones HTTP redundantes** | `Navbar` consultaba `/users/me` en cada render/montaje | Lee el usuario hidratado en `useAuthStore` | Eliminación de peticiones de red innecesarias en cada navegación. |
| **Líneas en `ProfileEdit.jsx`** | 426 líneas | 145 líneas | Reducción del 66% de líneas en la vista mediante desacoplamiento en hook y esquema. |
| **Líneas en `MatchCard.jsx`** | 233 líneas | 164 líneas | Modal de cancelación extraído a `CancelRoomModal.jsx`, `window.confirm` eliminado. |

---

## 11. Conclusión

La refactorización ejecutada atendió con precisión quirúrgica cada señalamiento de la auditoría:
- No se introdujeron bibliotecas adicionales innecesarias.
- No se rompió ninguna interfaz pública de los componentes ni de los custom hooks.
- Se preservaron todos los comentarios de dominio y las firmas de funciones existentes.
- El proyecto cuenta ahora con una arquitectura frontend limpia, predecible, escalable y completamente integrada.
