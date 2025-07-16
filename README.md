# Deliveroo Courier Service – Phase 5 Team Project

Deliveroo is a courier service application that allows users to send parcels to various destinations and track them in real-time via Google Maps. This is a collaborative full-stack project built with **React (frontend)** and **Flask (backend)** using **PostgreSQL (prod)** and **SQLite (dev)**.

---

## Project Structure

```
deliveroo/
├── client/                # React frontend (created with Create React App)
├── server/               # Flask backend
│   ├── app.py
│   ├── config.py
│   ├── models.py
├── seed.py               # DB seeder
├── .env                  # Environment config (Not committed to Git)
├── .gitignore
```

---

## Branching Strategy

We are following a simple and clean Git workflow:

- `main` → Production-ready code
- `dev` → Integrates all **tested and stable** feature branches
- `feature/your-feature-name` → New features or bug fixes

### Workflow Guidelines

1. **Clone** the repo
   ```bash
   git clone <repo-url>
   cd deliveroo
   ```

2. **Create a feature branch**
   ```bash
   git checkout dev
   git checkout -b feature/your-feature-name
   ```

3. Work on your changes.

4. **Commit regularly**
   ```bash
   git add .
   git commit -m "Add: <your meaningful message>"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** into the `dev` branch and request review.

---

## Setting Up Your Development Environment

### Backend (Flask + SQLite)

1. **Navigate to the root project folder**:
   ```bash
   cd deliveroo
   ```

2. **Install dependencies and activate virtual env**
   ```bash
   pipenv install
   pipenv shell
   ```

3. **Create your local `.env` file**

   Create a `.env` file in the root and add:
   ```env
   FLASK_APP=server/app.py
   FLASK_SQLALCHEMY_DATABASE_URI=sqlite:///app.db
   FLASK_SQLALCHEMY_TRACK_MODIFICATIONS=False
   FLASK_SECRET_KEY=devsecret
   FLASK_DEBUG=True
   FLASK_RUN_PORT=5000
   ```

4. **Run the backend**
   ```bash
   flask run
   ```

---

### Frontend (React)

1. Navigate to the frontend folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React dev server:
   ```bash
   npm start
   ```

## Notes

- Keep your feature branches **short-lived and focused**.
- **Avoid direct commits to `dev` or `main`.**
- Pull changes from `dev` before pushing your feature branch to resolve conflicts early.

