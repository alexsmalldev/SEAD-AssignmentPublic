# FacilityCare

A full-stack facility maintenance platform that enables users to report and manage building maintenance requests. Built as part of my Level 6 Software Engineering and DevOps module, extending an original Level 5 project.

**Live:** [https://facility-care.alexsmall.dev](https://facility-care.alexsmall.dev)

> **Demo credentials**
> | Role | Username | Password |
> |------|----------|----------|
> | Admin | `demo_admin` | `demo1234` |
> | Customer | `demo_customer` | `demo1234` |

---

## Features

- Role-based access control (admin and regular users)
- JWT authentication with token refresh and blacklisting
- Real-time notifications via WebSockets (Django Channels)
- Building and service type management (admin only)
- Maintenance request lifecycle management
- Media uploads stored on AWS S3
- Fully automated CI/CD pipeline

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, TailwindCSS |
| Backend | Django, Django REST Framework, Daphne |
| Database | PostgreSQL |
| Real-time | Django Channels (WebSockets) |
| Media Storage | AWS S3 |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions → AWS EC2 |
| Tests | Vitest (frontend), Django unit tests (backend) |

## Architecture

```
User → Cloudflare (SSL) → NGINX (EC2)
                               ├── /* → React (static files)
                               ├── /api/ → Django (port 8000)
                               └── /ws/ → Django Channels (WebSocket)
```

The CI/CD pipeline runs on every push to `main`:
1. Frontend tests (Vitest) and backend tests (Django) run in parallel
2. On success, a Docker image is built and pushed to Docker Hub
3. The EC2 instance pulls the new image, restarts containers, and runs migrations

## Local Setup

### Prerequisites
- Python 3.12
- Node.js 20
- Docker (optional, for running with compose)

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Create `backend/.env`:

```env
DJANGO_ENV=development
DEBUG=True
SECRET_KEY=your-django-secret
JWT_SIGNING_KEY=your-jwt-secret
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

To generate secret keys:

```bash
python manage.py shell -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.development`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000
```

```bash
npm run dev
```

## Running Tests

```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && python manage.py test requestAPI.tests
```