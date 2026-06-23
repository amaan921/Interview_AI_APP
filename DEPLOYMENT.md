# Deployment Guide

This guide covers deploying InterviewIQ.AI to production using Docker and cloud services.

## Prerequisites

- Docker & Docker Compose installed locally
- GitHub account with repository access
- Render.com account (for backend)
- Vercel account (for frontend)
- MongoDB Atlas account
- Environment variables prepared

## Local Development with Docker

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Services will be available at:
- Backend API: `http://localhost:5001`
- Frontend: `http://localhost:5173`
- MongoDB: `localhost:27017`

### Database Seeding

```bash
docker-compose exec mongo mongosh interview-ai --eval "
  db.users.insertOne({name: 'Test User', email: 'test@example.com', credits: 100})
"
```

---

## Production Deployment

### 1. Backend Deployment (Render.com)

#### Step 1: Prepare Repository

```bash
# Create separate branch for deployment
git checkout -b production/backend

# Create Render-specific start script
echo "node server/index.js" > start.sh
chmod +x start.sh

git add start.sh
git commit -m "add: render deployment script"
git push origin production/backend
```

#### Step 2: Create Render Service

1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name:** interview-ai-backend
   - **Environment:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `node index.js`
   - **Plan:** Starter (free tier)

#### Step 3: Environment Variables

Add in Render dashboard:

```
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/interview-ai
JWT_SECRET=your_jwt_secret_key_here
OPENROUTER_API_KEY=sk-or-v1-xxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NODE_ENV=production
```

#### Step 4: Deploy

```bash
git push origin production/backend
# Render auto-deploys on push
```

**Backend URL:** `https://interview-ai-backend.onrender.com`

---

### 2. Frontend Deployment (Vercel)

#### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client/vite-project`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 2: Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://interview-ai-backend.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_key
```

#### Step 3: Deploy

Click "Deploy" - Vercel auto-deploys on push

**Frontend URL:** `https://interview-ai.vercel.app`

---

### 3. MongoDB Atlas Setup

#### Step 1: Create Cluster

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster
3. Choose **M0 Shared** (free)
4. Configure network access:
   - Add IP: `0.0.0.0/0` (allows all)
   - Better: Whitelist specific IPs

#### Step 2: Create Connection String

1. Click "Connect"
2. Choose "Drivers"
3. Copy connection string
4. Replace `<password>` with actual password

Example:
```
mongodb+srv://admin:password123@cluster.mongodb.net/interview-ai?retryWrites=true&w=majority
```

---

## Production Checklist

- [ ] All environment variables set
- [ ] MongoDB indexes created
- [ ] SSL certificates configured
- [ ] CORS properly set for production domain
- [ ] Email notifications working
- [ ] Logging enabled
- [ ] Monitoring/alerts set up
- [ ] Backup strategy in place
- [ ] Database password is strong
- [ ] API rate limiting enabled

---

## Monitoring

### Render Logs

```bash
# View live logs
curl https://api.render.com/v1/services/{SERVICE_ID}/logs \
  -H "authorization: Bearer $RENDER_API_KEY"
```

### MongoDB Monitoring

1. Go to Atlas dashboard
2. Click "Monitoring" tab
3. View:
   - Query performance
   - Database size
   - Connection count

---

## Rollback

If production breaks:

```bash
# Revert last commit
git revert HEAD
git push

# Render/Vercel auto-redeploy
```

---

## Cost Analysis (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render Backend | Yes (0.5 CPU, 512MB RAM) | $0 |
| Vercel Frontend | Yes | $0 |
| MongoDB Atlas | Yes (512MB) | $0 |
| **Total** | | **$0** |

Upgrade when needed (expected: $5-20/month at scale).

---

## Troubleshooting

### Backend not starting

```bash
# Check environment variables
echo $MONGODB_URL

# Restart service
docker-compose restart backend

# View detailed logs
docker-compose logs backend -f
```

### Frontend blank page

```bash
# Check build
npm run build

# Verify environment variables
echo $VITE_API_URL

# Test API connectivity
curl $VITE_API_URL
```

### Database connection timeout

- Whitelist IP in MongoDB Atlas
- Check connection string password
- Verify network access rules

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Configure MongoDB Atlas
4. ✅ Set up monitoring
5. ⏭️ Add analytics (Mixpanel, Posthog)
6. ⏭️ Setup error tracking (Sentry)
7. ⏭️ Configure email service (SendGrid)

