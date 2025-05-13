# Mini Project Management Tool  
**Backend – Laravel 11 · PHP 8.3 · MySQL · Sanctum**

A slim REST API that powers a two-role project-tracking app (**Admin / Member**).  
It covers projects, tasks, activity logs, and full user management business
 logic—backed by a tight test-suite and seed data for instant demos.

---

##  Key Features

| Area          |                      Details                                                 |
|---------------|------------------------------------------------------------------------------|
| **Auth**      | Laravel Sanctum bearer tokens                                                |
| **Roles**     | `admin` → full CRUD · `member` → read-only + update task status              |
| **Projects**  | Name, description, start/end, status (`Planned / In Progress / Completed`)   |
| **Tasks**     | Assigned user, status (`To Do / In Progress / Done`), due date, project link |
| **Audit**     | Central _Activity Log_ stores every mutating action with actor + timestamp   |
| **Tests**     | feature coverage (auth, users, projects, tasks, logs)                        |
| **Seed**      | 6 demo users + factories for all models                                      |
| **Dev-UX**    | Vite/Tailwind stub, one-liner DB reset, Tinker-ready factories               |

---

## Quick Start

```bash
# 1 Clone & install
git clone
cd mini-pm-tool
composer install

# 2 Environment
cp .env.example .env

# 3 Database
php artisan key:generate
php artisan migrate --seed

# 4 Serve API (http://127.0.0.1:8000)
php artisan serve
```

---

## Demo Credentials <small>(local & CI **only**)</small>

| Role  | Email                       |  Password  |
|-------|-----------------------------|------------|
| Admin | alice.admin@example.com     | `password` |
| Admin | aaron.admin@example.com     | `password` |
| Admin | anna.admin@example.com      | `password` |
| Member| bob.member@example.com      | `password` |
| Member| bella.member@example.com    | `password` |
| Member| ben.member@example.com      | `password` |

---

## API Reference (v1)

_All routes are prefixed with **`/api`** and require a **Bearer token** unless noted._

### Authentication

| Method | Path      | Body                      |    200 Response   |
|--------|-----------|---------------------------|-------------------|
| POST   | `/login`  | `{ "email", "password" }` | `{ token, role }` |
| POST   | `/logout` | —                         | `{ message }`     |

### Users (Admin)

| Method | Path               | Body                                          | Purpose  |
|--------|--------------------|-----------------------------------------------|----------|
| GET    | `/users`           | —                                             | List all |
| POST   | `/users`           | `name, email, password, role`                 | Create   |
| GET    | `/users/{id}`      | —                                             | Show     |
| PUT    | `/users/{id}`      | any subset (`name / email / password / role`) | Update   |
| DELETE | `/users/{id}`      | —                                             | Delete   |

### Projects

| Method | Path                  | Body                                                  | Access                   |
|--------|-----------------------|-------------------------------------------------------|--------------------------|
| GET    | `/projects`           | —                                                     | Admin: all · Member: own |
| POST   | `/projects`           | `name, description, start_date, end_date, status`     | **Admin**                |
| GET    | `/projects/{id}`      | —                                                     | Role aware               |
| PUT    | `/projects/{id}`      | same as POST                                          | **Admin**                |
| DELETE | `/projects/{id}`      | —                                                     | **Admin**                |

### Tasks

| Method | Path                | Body                                                                    | Access     |
|--------|---------------------|-------------------------------------------------------------------------|------------|
| GET    | `/tasks`            | —                                                                       | Admin: all · Member: own |
| POST   | `/tasks`            | `title, description, assigned_user_id, project_id, due_date, status`    | **Admin**  |
| GET    | `/tasks/{id}`       | —                                                                       | Role aware |
| PUT    | `/tasks/{id}`       | Admin: any field · Member: `{ status }`                                 | Role aware |
| DELETE | `/tasks/{id}`       | —                                                                       | **Admin**  |

### Activity Log

| Method | Path            | Access                 |
|--------|-----------------|------------------------|
| GET    | `/activity-log` | Any authenticated user |

Sample response:

```json
[
  {
    "id": 42,
    "action": "Updated task \"Ship README\"",
    "user": { "id": 5, "name": "Bella Member" },
    "metadata": { "task_id": 11 },
    "created_at": "2025-05-10T10:05:22Z"
  }
]
```
---

## Development Scripts

| Command | What it does             |
|------------------------------------|--------------------------------------------------------|
| `php artisan serve`                | Launch local server                                    |
| `php artisan migrate:fresh --seed` | Rebuild DB with demo data                              |
| `php artisan test`                 | Run full PHPUnit & Pest suite                          |
| `php artisan tinker`               | Interactive REPL (factories pre-loaded)                |
| `composer unused`                  | List dead dependencies (if you have `composer-unused`) |

---

## Running Tests

```bash
php artisan test
```

The suite covers:

* **Auth** – valid & invalid credentials  
* **RBAC** – admin vs member capability matrix  
* **Validation** – e.g., member cannot alter task title  
* **Persistence** – DB assertions after every mutation  

---

## Security Notes

| Concern | Mitigation                                                                                    |
|------------------------|--------------------------------------------------------------------------------|
| **Password storage**   | Bcrypt (`BCRYPT_ROUNDS=12`)                                                    |
| **Token auth**         | Laravel Sanctum personal-access tokens; `/logout` revokes all tokens           |
| **Role enforcement**   | `RoleMiddleware` guards every admin route, server-side                         |
| **Seed data**          | Demo accounts flagged in README; production seeds skip or overwrite them       |
| **Rate limiting**      | `throttle:api` (60 req / min default) configurable in `RouteServiceProvider`   |
| **Secrets management** | Real credentials live in env vars / CI secrets; repo ships only `.env.example` |

---

## License

MIT © 2025 Acme Corp  
See `LICENSE` for details.