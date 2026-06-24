# Chitkara Full Stack Engineering Challenge

Full-stack project with **Node.js + Express** backend and **React + Vite** frontend.

## Project Structure

```
root
├── backend
│   ├── api/             # Vercel serverless entry point
│   ├── controllers/     # Route handler functions
│   ├── config/          # Constants and configuration
│   ├── middleware/       # Express middleware (error handling, etc.)
│   ├── routes/          # API route definitions
│   ├── utils/           # Shared utility / helper functions
│   ├── app.js           # Express app setup
│   ├── server.js        # Local dev server entry point
│   ├── vercel.json      # Vercel deployment config
│   └── .env             # Environment variables (local only)
│
└── frontend
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page-level components
    │   ├── services/    # API call helpers
    │   └── styles/      # Custom CSS
    ├── vite.config.js   # Vite + Tailwind config
    └── vercel.json      # Vercel SPA routing config
```

---

## Local Development

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

The Vite dev server proxies `/bfhl` and `/api` requests to `http://localhost:5000` automatically.

---

## Vercel Deployment

This project is deployed as **two separate Vercel projects** from the same GitHub repository.

### Step 1 — Deploy Backend

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. **Set Root Directory to:** `backend`
3. Vercel will auto-detect the config from `vercel.json`.
4. **Add these Environment Variables in Vercel dashboard:**

   | Variable       | Value                                    |
   |----------------|------------------------------------------|
   | `NODE_ENV`     | `production`                             |
   | `FRONTEND_URL` | `https://your-frontend-name.vercel.app`  |

5. Click **Deploy**.
6. Copy the deployed backend URL (e.g. `https://your-backend-name.vercel.app`).

#### Verify

```
POST https://your-backend-name.vercel.app/bfhl
Content-Type: application/json

{ "data": ["A->B", "A->C", "B->D"] }
```

---

### Step 2 — Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new) and import the **same** GitHub repo again.
2. **Set Root Directory to:** `frontend`
3. Vercel will auto-detect Vite and build the project.
4. **Add this Environment Variable in Vercel dashboard:**

   | Variable       | Value                                        |
   |----------------|----------------------------------------------|
   | `VITE_API_URL` | `https://your-backend-name.vercel.app`        |

5. Click **Deploy**.

---

### Step 3 — Update Backend CORS

After you have both URLs:

1. Go to your **backend** Vercel project → Settings → Environment Variables.
2. Set `FRONTEND_URL` to your deployed frontend URL (e.g. `https://your-frontend-name.vercel.app`).
3. **Redeploy** the backend for the change to take effect.

---

## Environment Variables Summary

### Backend (set in Vercel dashboard)

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `NODE_ENV`     | Yes      | Set to `production`                  |
| `FRONTEND_URL` | Yes      | Deployed frontend URL (for CORS)     |

### Frontend (set in Vercel dashboard)

| Variable       | Required | Description                          |
|----------------|----------|--------------------------------------|
| `VITE_API_URL` | Yes      | Deployed backend URL                 |

---

## API Endpoints

| Method | Path    | Description                        |
|--------|---------|------------------------------------|
| GET    | `/api`  | Health check                       |
| POST   | `/bfhl` | Process edges and build hierarchies |

---

## Tech Stack

- **Backend:** Node.js, Express, CORS, dotenv
- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Deployment:** Vercel (serverless)
