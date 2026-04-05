# Web Chat App

Single Page Application de mensajería que implementa renderizado por plantillas Handlebars, manejo de estado por componente y comunicación entre componentes mediante un bus de eventos.

---

## Enlaces importantes

| Recurso | Estado                                                   |
| ------- | -------------------------------------------------------- |
| Netlify | Pendiente                                                |
| Figma   | [Ver proyecto](https://acortar.link/fRM6nS)              |
| Gemini  | [IA usada](https://gemini.google.com/share/85349714c0d2) |

---

## Stack tecnológico

| Aspecto      | Tecnología         |
| ------------ | ------------------ |
| Lenguaje     | TypeScript         |
| Empaquetador | Vite               |
| Plantillas   | Handlebars         |
| Estilos      | CSS                |
| Pruebas      | Vitest             |
| Linting      | ESLint y Stylelint |
| Despliegue   | Netlify            |

---

## Cómo ejecutar en local

#### Requisitos previos

- Node.js instalado
- npm

#### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/alejandroramirezucb/web-chat-app.git

# Entrar a la carpeta del proyecto
cd web-chat-app/Code

# Instalar dependencias
npm install

# Levantar servidor
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

---

## Scripts disponibles

#### Desarrollo

- `npm run dev` — Inicia servidor de desarrollo con Vite
- `npm run build` — Valida TypeScript y construye para producción
- `npm run preview` — Sirve la build de producción localmente

#### Pruebas

- `npm run test` — Ejecuta pruebas con Vitest
- `npm run test:run` — Ejecuta pruebas una sola vez
- `npm run test:unit` — Ejecuta pruebas unitarias
- `npm run test:integration` — Ejecuta pruebas de integración
- `npm run test:coverage` — Ejecuta pruebas con cobertura

#### Calidad de código

- `npm run lint` — Valida TypeScript y JavaScript con ESLint
- `npm run lint:fix` — Corrige problemas automáticos de ESLint
- `npm run lint:styles` — Valida estilos con Stylelint
- `npm run lint:styles:fix` — Corrige estilos automáticamente

---

## Arquitectura del proyecto

## Estructura de carpetas

```
Code/src/
├── components/
│   ├── ChatHeader/
│   ├── ChatItem/
│   ├── ChatList/
│   ├── ChatSidebar/
│   ├── ChatWindow/
│   ├── MessageInput/
│   ├── MessageItem/
│   ├── MessageList/
│   └── SearchInput/
├── pages/
│   └── ChatPage/
├── core/
│   ├── Block.ts
│   └── EventBus.ts
├── props/
│   ├── Chat.ts
│   └── Message.ts
├── data/
│   ├── chats.json
│   └── messages.json
├── styles/
└── index.ts

Code/tests/
├── unit/
└── integration/
```

---

#### Componentes

**Block**

- Clase base para todos los componentes
- Gestiona ciclo de vida: render, montaje de hijos, registro de eventos

**EventBus**

- Bus de eventos para permitir la comunicacion entre componentes

**Componentes**

- Tienen su propio template, eventos del DOM y lógica

**Páginas**

- Layouts principales que se componen mediante componentes
- Orquestan comunicación entre componentes mediante el EventBus

#### Flujo de renderizado

1. Una página crea instancias de componentes hijos
2. Cada componente renderiza su template Handlebars con props
3. Los eventos del DOM se registran mediante el método `events()`
4. Los eventos globales se propagan usando EventBus (on, emit, off)
5. Las actualizaciones de datos invocan `update()` para re-renderizar
