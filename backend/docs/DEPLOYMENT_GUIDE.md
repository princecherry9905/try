# Backend Cloud Deployment & MongoDB Atlas Setup Guide

This guide details deployment of the Express backend and connection to MongoDB Atlas satisfying Issue #37.

## 1. MongoDB Atlas Configuration
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create or select a free-tier cluster (e.g. M0 Cluster).
3. Under **Database Access**, create a database user with read and write privileges.
4. Under **Network Access**, add an IP Access entry for `0.0.0.0/0` (Allow access from anywhere) to permit connections from dynamic cloud provider IPs.
5. In **Database** > **Connect** > **Drivers**, copy the standard connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/studentDB?retryWrites=true&w=majority
   ```

## 2. Deploying to Render (Recommended)
1. Link your GitHub repository (`princecherry9905/try` or fork) on Render.
2. Select **New** > **Web Service** or use the included Blueprint `backend/render.yaml`.
3. Set the Root Directory to `backend`.
4. Configure Build and Start commands:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Configure Environment Variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/studentDB?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<secure-random-secret-string>`
   - `CLIENT_URL`: `https://<your-frontend-domain>.vercel.app`

## 3. Verification & Health Check
Once deployed, verify the service is running and responsive:
```bash
curl https://<your-backend-app>.onrender.com/api/health
# Expected Output: {"status":"OK","timestamp":"...","uptime":...}
```
