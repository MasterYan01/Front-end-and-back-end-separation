# Django + Vite + React E-commerce

A simple e-commerce project with Django backend and Vite+React frontend.

## Setup

### Backend
1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
2. Install dependencies
   pip install -r requirements.txt
3. Run migrations and server
   cd backend
   python manage.py migrate
   python manage.py runserver
### Frontend
1. Install dependencies
   cd frontend
   npm install
2. Run development server
   npm run dev
