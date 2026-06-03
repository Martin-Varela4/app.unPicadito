# app.unPicadito

**app.unPicadito** es una plataforma web desarrollada en React y Vite diseñada para la gestión de partidos de fútbol 5 y otras disciplinas recreativas. Permite a los organizadores crear salas de juego públicas o privadas, facilitando la organización de los equipos.

## Características Principales

* **Salas Públicas**: Cualquier usuario de la plataforma puede ver la sala y unirse libremente.
* **Salas Privadas**: Acceso restringido. Los jugadores solo pueden ingresar mediante invitación directa del organizador.
* **Flexibilidad de Medidas**: Configuración adaptable para fútbol 5, 7 o 11 según el complejo deportivo.

## Estructura del Proyecto

El frontend del proyecto sigue una arquitectura modular basada en características (`features`):

```text
UNPICADITO-FRONT/
├── node_modules/
├── public/
└── src/
    ├── assets/          # Imágenes, fuentes y archivos estáticos
    ├── components/      # Componentes globales y reutilizables
    ├── features/        # Módulos específicos de la aplicación
    │   ├── auth/        # Módulo de Autenticación (Login/Registro)
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   └── authPage.jsx
    │   └── profile/     # Módulo de Perfil de Usuario
    │       ├── components/
    │       └── profilePagr.jsx
    ├── App.jsx          # Componente raíz de la aplicación
    ├── main.jsx         # Punto de entrada de React
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js
```

## Instalación

Asegúrate de tener [Node.js](https://nodejs.org) instalado en tu equipo. Luego, sigue estos pasos para configurar el proyecto localmente:

1. Clona el repositorio:
```bash
git clone https://github.com/Martin-Varela4/app.unPicadito.git
```

2. Navega a la carpeta del proyecto:
```bash
cd app.unPicadito
```

3. Instala las dependencias del proyecto utilizando npm:
```bash
npm install
```

## Uso

Para iniciar el servidor de desarrollo local con Vite, ejecuta el siguiente comando:

```bash
npm run dev
```

Una vez ejecutado, abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación en funcionamiento.

## Contribución

¡Las contribuciones del equipo son bienvenidas! Para mantener el orden en el desarrollo grupal, por favor sigue estos lineamientos:

1. Crea una rama secundaria para tu característica (`git checkout -b feature/nueva-caracteristica`).
2. Sube tus cambios locales (`git commit -m 'Añade nueva funcionalidad'`).
3. Envía los cambios a GitHub (`git push origin feature/nueva-caracteristica`).
4. Abre un **Pull Request** para que el resto del grupo pueda revisar el código antes de unificarlo a `main`.

## Licencia

Este proyecto es de uso interno y privado para el equipo de desarrollo.

