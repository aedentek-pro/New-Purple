# Purple LMS Backend

The Purple LMS backend provides a RESTful API that powers the LMS frontend. It is built with Node.js, Express, and MongoDB using the MVC pattern.

## Features

- CRUD endpoints for core LMS domains: users, courses, quizzes, student progress, notifications, chat messages, live sessions, assignments, one-to-one sessions, live session progress, and banners.
- Modular MVC architecture with controllers, models, and routes.
- Request validation with `express-validator`.
- Centralised error handling, logging, security, and CORS configuration.
- TypeScript build tooling and linting.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or hosted)

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy `.env.example` to `.env` and update the values as needed:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/purple_lms
JWT_SECRET=your_jwt_secret_here
```

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### Build and Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Environment and database setup
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Error and not-found handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # (Reserved for future business logic)
│   ├── types/          # (Reserved for shared TypeScript types)
│   └── utils/          # Helpers (async handler, API responses, HttpError)
├── app.ts              # Express app factory
├── server.ts           # HTTP server bootstrap
├── package.json
└── tsconfig.json
```

## API Overview

| Resource | Base Path | Description |
|----------|-----------|-------------|
| Users | `/api/users` | Manage platform users and roles |
| Courses | `/api/courses` | Manage courses, modules, and linked quizzes |
| Quizzes | `/api/quizzes` | Manage quiz banks and questions |
| Student Progress | `/api/student-progress` | Track course progress for students |
| Notifications | `/api/notifications` | Deliver system and course messages |
| Chat Messages | `/api/chat-messages` | Manage community chat threads |
| Live Sessions | `/api/live-sessions` | Schedule and manage live webinars |
| Assignments | `/api/assignments` | Manage course assignments |
| One-to-One Sessions | `/api/one-to-one-sessions` | Manage direct mentoring sessions |
| Live Session Progress | `/api/live-session-progress` | Track quiz progress for live sessions |
| Banners | `/api/banners` | Manage promotional and informational banners |

Each endpoint supports standard CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) and uses MongoDB ObjectIds for references.

## Next Steps

- Integrate authentication (e.g., JWT) and role-based access control.
- Add domain services (`src/services`) for complex business workflows.
- Extend automated testing and CI pipelines.

## License

MIT

