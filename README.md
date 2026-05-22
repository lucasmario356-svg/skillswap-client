# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Es la interfaz de usuario de SkillSwap. Está diseñada para ser rápida y mostrar la información de forma clara, permitiendo a los usuarios navegar por el catálogo de habilidades y gestionar su propio contenido.

Características destacadas

Interfaz dinámica de habilidades: La lista de clases gestiona automáticamente los errores de carga. Por ejemplo, si una habilidad no tiene una imagen válida, el código muestra una foto de respaldo para que el diseño no se rompa.

Formularios de edición: La página de editar carga automáticamente los datos existentes desde la base de datos. He añadido una función de previsualización para que el usuario vea cómo queda la imagen antes de confirmar los cambios.

Identificación visual de rangos: En la barra de navegación, el usuario puede ver su nombre y su rol actual (Admin, Helper o User). Cada rol tiene un color diferente para facilitar la navegación administrativa.

Control de autoría: La aplicación reconoce si el usuario es el dueño de una clase. Si lo es, le muestra botones para editar o borrar; si no, le permite enviar una solicitud de reserva.

Stack técnico

React como base del proyecto.

React Router para gestionar las direcciones de la web.

Axios para la comunicación con el backend.

Context API para mantener la sesión del usuario activa en todas las páginas.