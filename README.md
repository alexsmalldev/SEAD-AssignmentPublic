# SEAD-Assignment

A full-stack facility maintenance platform built with Django (backend) and React (frontend). It supports regular and admin users with role-based access, JWT authentication, live WebSocket notifications and CI/CD via GitHub Actions.

This application was orginally developed for my level 5 module, Software Engineering and Agile. It has now being updated for my current level 6 module Software Engineering and DevOps.

The application enables users to report and manage building maintenance requests. It supports admin and regular users role-based access, and integrates real-time updates via WebSockets.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL
- **Deployment:** Docker + GitHub Actions → AWS EC2
- **Media Storage:** AWS S3
- **Tests:**
  - Vitest (frontend)
  - Django unit tests (backend)

## Live Deployment

- **Frontend:** [https://sead-facility-care.com/](https://sead-facility-care.com/)
- **Backend API:** [https://sead-facility-care.com/api](https://sead-facility-care.com/api)

## Installation

### Clone the repo

```bash
git clone https://github.com/alexsmalldev/SEAD-AssignmentPublic.git
cd SEAD-Assignment
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Backend Environment Variables

Create a `.env` file in `backend/`:

```env
DJANGO_ENV=development
SECRET_KEY=your-django-secret
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
JWT_SIGNING_KEY=your-jwt-secret
```

To generate django and jwt signing keys:

```bash
python manage.py shell
>>> from django.core.management.utils import get_random_secret_key
>>> get_random_secret_key()
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.development`:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_WS_URL=ws://127.0.0.1:8000
```

Then run:

```bash
npm run dev
```

## Running Tests

### Frontend

```bash
cd frontend
npm run test
```

### Backend

```bash
cd backend
python manage.py test requestAPI.tests
```

## CI/CD

Automated CI/CD is triggered on each push to `main`:

- Frontend & backend tests
- Docker image build & push
- Auto-deploy to EC2
- Environment is rebuilt, migrations run, and superuser created if needed

