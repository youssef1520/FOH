# Mini PM Tool – Client (Angular 19 + Material)

> Front-end for the “Mini Project Management Tool” technical task  
> Works with the companion **Laravel API** in `backend/`

---

## ✨ Features

| Role | Capabilities |
|------|--------------|
| **Admin** | • Login<br>• CRUD projects and tasks<br>• Assign tasks to any user<br>• Manage users (+ reset password)<br>• View real-time activity log |
| **Member** | • Login<br>• View own tasks & update their status<br>• Browse activity log |

Additional tech:

* Angular **standalone components** (v19) – no NgModules.
* Angular Material & SCSS-modules for styling.
* HTTP interceptor adds `Authorization: Bearer …`.
* Route-level role guard.
* Server-side-rendering with **@angular/ssr** + Express (production build only).

---

## 🖥️ Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Angular CLI | `npm i -g @angular/cli` |

The API must be running at **`http://127.0.0.1:8000`** (default from the Laravel repo).  
If you changed the host/port on the back-end, update `src/environments/*/environment.ts → apiUrl`.

---

## 🚀 Quick start (dev mode)

```bash
cd client
npm i           # install deps
npm start       # ng serve --open
