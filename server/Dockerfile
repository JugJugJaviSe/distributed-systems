FROM python:3.9.13-slim

WORKDIR /app

# Install dependencies for MySQL client
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code
COPY . .

# Make wait_for_db.sh executable
RUN chmod +x wait_for_db.sh

# Expose Flask port
EXPOSE 5000

# Run wait_for_db.sh then Flask
CMD ["./wait_for_db.sh", "users_db", "python", "run.py"]
