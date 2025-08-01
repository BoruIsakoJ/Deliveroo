# Deliveroo – Courier Service Application

Deliveroo is a courier service web application built as a capstone project by **Group 3** during the final phase at Moringa School. It enables users to create parcel delivery orders, track delivery status, view route maps, and get pricing based on parcel weight and distance. Admins can manage and update delivery statuses.

---

## Features

### User Functionality
- Sign up and log in
- Create a parcel delivery order
- View delivery details
- Change the destination (if not yet delivered)
- Cancel the delivery (if not yet delivered)

### Admin/Courier Functionality
- Update parcel status (e.g., In Transit, Delivered)
- Update present location of parcel

### Google Maps Integration
- Display pickup and destination markers
- Draw a route line between pickup and destination
- Calculate and display distance and estimated duration

### Price Calculation Logic
Pricing is calculated based on:
- Parcel **Weight**  
- Travel **Distance**

---

## Tech Stack

| Layer       | Technology                   |
|-------------|-------------------------------|
| Frontend    | ReactJS, Bootstrap, Material UI (DataGrid) |
| Backend     | Flask (Python)                |
| Database    | PostgreSQL                    |
| Maps        | Google Maps API               |
| Deployment  | Render                        |
| Project Management | GitHub Projects, Git Flow Workflow |

---

## Installation Instructions

### Prerequisites
- Python 3.x
- Node.js and npm
- Pipenv
- Git

---

### Clone the Repository
```bash
git clone https://github.com/BoruIsakoJ/Deliveroo.git
cd Deliveroo
```

---

### Backend Setup (Flask)

1. Create a `.env` file at the **project root**:
```env
FLASK_APP=server/app.py
FLASK_SQLALCHEMY_DATABASE_URI=sqlite:///app.db
FLASK_SQLALCHEMY_TRACK_MODIFICATIONS=False
FLASK_SECRET_KEY=devsecret
FLASK_DEBUG=True
FLASK_RUN_PORT=5000
```

> You can change the `SQLALCHEMY_DATABASE_URI` to PostgreSQL for production.

2. Install dependencies & activate virtual environment:
```bash
pipenv install && pipenv shell
```

3. Run the backend server:
```bash
flask run
```

---

### Frontend Setup (React)

1. Open a new Terminal. Navigate to the frontend directory:
```bash
cd client
```

2. Create a `.env` file inside the `client` directory:
```env
REACT_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

3. Install frontend dependencies:
```bash
npm install
```

4. Start the frontend dev server:
```bash
npm start
```

> React will run on [http://localhost:4000](http://localhost:4000) (or whichever port React App uses)

---

## Project Structure

```
Deliveroo/
├── client/                 # React frontend
│   ├── src/
│   └── .env                # Google Maps API Key
├── server/                 # Flask backend
│   ├── app.py
│   ├── models.py/
│   └── seed.py/
├── .env                    # Backend environment config
├── Pipfile
└── README.md
```

---

## Pricing Algorithm Overview

```js
function calculateWeightFee(weight) {
  if (weight <= 2) return 80;
  if (weight <= 10) return 150;
  if (weight <= 30) return 250;
  if (weight <= 60) return 400;
  return 600 + (weight - 60) * 10;
}

function calculateDistanceFee(distance) {
  if (distance <= 5) return Math.round(distance * 20);
  if (distance <= 20) return Math.round(distance * 15);
  if (distance <= 100) return Math.round(distance * 10);
  if (distance <= 200) return Math.round(distance * 8);
  return Math.round(distance * 6);
}

function calculatePrice(weight, distance) {
  const weightFee = calculateWeightFee(weight);
  const distanceFee = calculateDistanceFee(distance);
  return { weightFee, distanceFee, total: weightFee + distanceFee };
}
```

---

## Notes
- Parcel destinations can only be changed **before delivery is marked delivered**
- Only the user who created a parcel can cancel it or the admin
- Google Maps API key is required for route, distance, and duration features

---

## Contributors

| Name            | Role                |
|------------------|---------------------|
| **Boru Isako**   | Team Lead, Full Stack Developer |
| Suzzane Kiago    | Backend Developer   |
| Boniface Mburu   | Backend Developer   |
| Robert Kutwa     | Frontend Developer  |
| Joel Mwaga       | Frontend Developer  |

---

## Acknowledgements

- Technical Mentors(**Julius Mwangi** and **Stella Margy**)
- Moringa School

