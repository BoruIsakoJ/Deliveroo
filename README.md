# How to Have a Running Code on Your Machine 

## Download Guidelines

1. **Clone** the repo
   ```bash
   git clone git@github.com:BoruIsakoJ/Deliveroo.git
   cd deliveroo
   ```

   **If you cloned the project before go ahead to step 2**
   <br/>

2. **Switch to develop branch**
   ```bash
   git checkout develop
   ```

3. **Pull all the new changes**
```bash
   git pull origin develop
```

4. **Create a local file called `.env` at the `ROOT` of the project**

   Create a `.env` file in the root and paste:
   ```env
   FLASK_APP=server/app.py
   FLASK_SQLALCHEMY_DATABASE_URI=sqlite:///app.db
   FLASK_SQLALCHEMY_TRACK_MODIFICATIONS=False
   FLASK_SECRET_KEY=devsecret
   FLASK_DEBUG=True
   FLASK_RUN_PORT=5000
   ```

### Run Backend (Flask)

1. **Install dependencies and activate virtual env**
   ```bash
   pipenv install && pipenv shell
   ```

2. **Run the backend**
   ```bash
   flask run
   ```

### Run Frontend (React)
Open a **NEW** Terminal and cd into client folder and run the following lines one by one:
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

### Working on Future Features
1. **Create a feature branch**
   ```bash
   git checkout develop
   git flow feature start your-feature-name
   ```

2. Work on your changes.

3. **Commit regularly**
   ```bash
   git add .
   git commit -m "Add: <your meaningful message>"
   ```

5. **Push and create a PR**
   ```bash
   git push origin your-feature-name
   ```

6. Open a **Pull Request** into the `develop` branch and request review.
