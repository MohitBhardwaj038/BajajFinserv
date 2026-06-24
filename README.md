# Chitkara Full Stack Engineering Challenge

Full-stack project with **Node.js + Express** backend and **React + Vite** frontend.

## Project Structure

```
root
├── backend
│   ├── controllers/    # Route handler functions
│   ├── middleware/      # Express middleware (error handling, etc.)
│   ├── routes/          # API route definitions
│   ├── utils/           # Shared utility / helper functions
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   └── .env             # Environment variables
│
└── frontend
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page-level components
    │   ├── services/    # API call helpers
    │   └── styles/      # Custom CSS
    └── vite.config.js   # Vite + Tailwind config
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev        # starts with nodemon on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # starts Vite dev server on port 5173
```

## Environment Variables

Copy `.env.example` to `.env` inside the `backend/` directory and adjust as needed.

| Variable   | Default       | Description           |
|------------|---------------|-----------------------|
| `PORT`     | `5000`        | Backend server port   |
| `NODE_ENV` | `development` | Runtime environment   |
