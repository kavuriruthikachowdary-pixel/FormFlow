## Deployment on Vercel

The application is structured for easy deployment on **Vercel** as a single project.

### Steps to Deploy:
1.  **Project Root**: Import the entire `Forms` directory to Vercel.
2.  **Zero Config**: Vercel should automatically detect the `vercel.json` from the root.
3.  **Environment Variables**:
    - Go to your Vercel Project **Settings** → **Environment Variables**.
    - Add `MONGO_URI` (your MongoDB Atlas connection string).
    - Add `JWT_SECRET` (any secret string for token signing).
4.  **Automatic Build**: Vercel will build the React frontend and deploy the Node.js API as a serverless function.

### Local Development (Vercel Simulation)
You can use the **Vercel CLI** to simulate the deployment locally:
```bash
npm i -g vercel
vercel dev
```

## How to use
1. **Sign up** for a new account.
2. Go to **Create Form** to build your custom form.
3. Once saved, find your form in the **Dashboard**.
4. Click the **Eye icon** to view/share the public form link.
5. Click the **Chart icon** to view collected responses and download them as CSV.
