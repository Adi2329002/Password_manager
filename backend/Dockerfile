FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc

# 1. Copy requirements from the BACKEND folder
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the manage.py file from the ROOT
COPY manage.py .

# 3. Copy the backend folder
COPY backend ./backend
COPY passwords ./passwords

EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]