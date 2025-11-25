# Backyard Adventures Management System

This project couples a rich HTML dashboard (`Untitled-1.html`) with a lightweight Node/Express backend (`server.js`). The backend exposes REST endpoints for reservations, customers, analytics, and mock auth so the frontend can manage state without hard-coded demo data.

## Requirements

- Node.js 18+
- npm (ships with Node)

## Installation

PowerShell blocks `npm.ps1` by default. Either run the install from Command Prompt **or** temporarily bypass the policy in your PowerShell window.

### Option 1 – Command Prompt (no policy change)

```powershell
cmd /c "npm install"
```

### Option 2 – PowerShell with temporary bypass

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm install
```

## Running the server

Development with auto-restart (uses `nodemon`):

```powershell
cmd /c "npm run dev"
# or, after applying the temporary bypass shown above:
npm run dev
```

Production-style start:

```powershell
cmd /c "npm start"
```

The server listens on the `PORT` environment variable when provided, otherwise defaults to `3000`.

## Available endpoints

| Method | Path                  | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/health`             | Health check / uptime                     |
| GET    | `/api/reservations`   | List reservations                         |
| POST   | `/api/reservations`   | Create reservation                        |
| PUT    | `/api/reservations/:id` | Update reservation                      |
| DELETE | `/api/reservations/:id` | Cancel (delete) reservation             |
| GET    | `/api/customers`      | List customers                            |
| POST   | `/api/customers`      | Create customer                           |
| PUT    | `/api/customers/:id`  | Update customer                           |
| GET    | `/api/analytics`      | Synthetic analytics summary               |
| POST   | `/api/auth/login`     | Mock login (returns demo token)           |
| POST   | `/api/auth/signup`    | Mock signup (returns demo token)          |

The frontend calls these endpoints directly via `fetch`.

## Frontend integration

- Opening `Untitled-1.html` in a browser will load dashboard data from the running backend. When served from the filesystem, it defaults to `http://localhost:3000` for API calls.
- All create/update/delete actions refresh both the tables and the analytics summary.

## Project structure

```text
BA system/
├── node_modules/        # Installed dependencies
├── package.json         # npm scripts and dependencies
├── package-lock.json
├── README.md            # This file
├── server.js            # Express backend
└── Untitled-1.html      # Dashboard UI consuming the API
```

## Troubleshooting

- **Execution policy errors**: Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` before `npm` commands, or prefix them with `cmd /c`.
- **Port already in use**: Stop other processes on the target port, or start the server with `PORT=4000 npm start` (Command Prompt syntax: `set PORT=4000 && npm start`).

Enjoy building on the Backyard Adventures management dashboard!
