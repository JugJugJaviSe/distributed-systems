# Quiz Platform

The goal of the system is to simulate the core functionalities of an online quiz platform, including user management, quiz creation, real-time communication, and asynchronous processing.

## Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Roles & Permissions](#roles--permissions)
- [Requirements](#requirements)
- [First-time Setup](#first-time-setup)
- [Running the Project](#running-the-project)
- [Database Setup](#database-setup--mysql-workbench)
- [Stopping / Starting / Cleaning Up](#stopping--cleaning-up)
- [Deployment](#deployment)

## Key Features

- JWT-based authentication and role-based access control
- User roles: Player, Moderator, Administrator
- Quiz creation, approval, and asynchronous evaluation
- Real-time notifications via WebSockets
- Quiz rankings and result tracking
- PDF report generation and email delivery

## Tech Stack

- Frontend: React (Vite)
- Backend: Flask (Python)
- Databases: MySQL
- Communication: REST + WebSockets
- Containerization: Docker & Docker Compose

## Roles & Permissions

#### Player

- Registers and logs into the platform
- Browses and plays available quizzes
- Submits quiz answers within the given time limit
- Views personal quiz results and rankings
- Updates personal profile information

#### Moderator

- Has all Player permissions
- Creates new quizzes with questions, answers, scoring, and duration
- Edits or deletes their own quizzes
- Submits quizzes for administrator approval
- Receives feedback if a quiz is rejected and updates it accordingly

#### Administrator

- Has full system access
- Approves or rejects newly created quizzes (with a rejection reason)
- Manages user accounts (list users, delete users, change roles)
- Assigns the Moderator role to players
- Generates PDF reports with quiz results
- Receives real-time notifications about newly submitted quizzes

## Requirements
- Docker
- Docker Compose
- Python 3.9+ (only if you want to run scripts locally)
- MySQL Workbench (optional, for inspecting DB)
- Linux users: Make sure Docker daemon is running and you have permission to run Docker commands (sudo may be required).

## First-time Setup
```bash
git clone <repo_url>
cd <repo_folder>
```

1️⃣ Make scripts executable (Linux only)
```bash
chmod +x wait_for_db.sh
```
2️⃣ Verify
```bash
ls -l wait_for_db.sh
# Should show: -rwxr-xr-x
```
3️⃣ Build and start containers
```bash
docker compose up --build
```
or add -d to run in the background:
```bash
docker compose up -d --build
```
## Running the Project
Check running containers
```bash
docker compose ps
```
All services should be Up.
Logs
```bash
docker compose logs -f
```
or log a container
```bash
docker compose logs -f <container_name>
```
## Database Setup / MySQL Workbench

Check the mapped port from Docker:
```bash
docker compose ps
```
Example output:
```
NAME        PORTS
users_db    0.0.0.0:3307->3306/tcp
quiz_db     0.0.0.0:3308->3306/tcp
```
Open MySQL Workbench (or your client) and create a new connection:
```
- Field	Value
- Connection Name	anything (e.g., users_db)
- Hostname	127.0.0.1
- Port	the mapped host port (e.g., 3307)
- Username	root
- Password	1234
```
Test the connection — it should succeed if the container is running.

Note: Inside Docker, services communicate using service names, not localhost.

## Stopping / Cleaning Up

Stop containers
```bash
docker compose down
```

Start containers
```bash
docker compose up -d
```
## Deployment

Database: Neon (PostgreSQL)
- Connection via Neon’s provided connection string
- Automatic backups and scaling

Backend API: Render (Flask app)

- Deployed using Gunicorn
- Exposes REST endpoints and WebSocket connections for real-time notifications

Frontend: Render (React app)

- Communicates securely with backend via HTTPS
- Live updates using WebSockets
