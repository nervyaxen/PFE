# MACHROU3I VISION LAB - SUPABASE DEPLOYMENT GUIDE
## Production-Ready Step-by-Step Deployment (15-20 minutes)

**Document Version:** 1.0  
**Generated:** 2026-06-06  
**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner-Friendly  

---

## PRE-DEPLOYMENT CHECKLIST

- [ ] Supabase account created (https://supabase.com)
- [ ] Project created in Supabase (or using existing project)
- [ ] Access to Supabase Dashboard
- [ ] `.env` file in project root (see STEP 1)
- [ ] Copy of `supabase_production_schema.sql`
- [ ] Web browser with access to Supabase SQL Editor

---

## STEP 1: PREPARE ENVIRONMENT VARIABLES

### 1a. Create `.env.local` File (for local development)

In your project root, create a file named `.env.local` (or update existing):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Services
VITE_GEMINI_API_KEY=AIzaSy...
VITE_OPENAI_API_KEY=sk-proj-...
VITE_HF_TOKEN=hf_...

# Admin Email (for RBAC)
VITE_ADMIN_EMAIL=your-email@example.com
```

### 1b. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Anon Public Key` → `VITE_SUPABASE_PUBLISHABLE_KEY`

### 1c. Verify Environment Setup

```bash
# Check if .env.local is loaded
npm run dev

# In browser console, verify:
console.log(import.meta.env.VITE_SUPABASE_URL)
// Should show: https://your-project.supabase.co
```

---

## STEP 2: DEPLOY DATABASE SCHEMA

### 2a. Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query** button

### 2b. Copy Schema SQL

1. Open file: `supabase_production_schema.sql` (in project root)
2. Copy entire content (Ctrl+A, Ctrl+C)

### 2c. Paste and Execute

1. In Supabase SQL Editor, paste the entire SQL
2. Click **RUN** button (or Cmd+Enter / Ctrl+Enter)
3. Wait for completion (should take 10-30 seconds)

**Expected Output:**
```
Query executed successfully
```

### 2d. Verify Schema Created

In SQL Editor, run verification query:

```sql
-- Verify all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Expected Result:**
```
admin_logs
brand_projects
business_names
community_posts
enterprise_analyses
favorites
payment_unlock_state
profiles
```

---

## STEP 3: CREATE STORAGE BUCKETS

### 3a. Go to Storage Section

1. Supabase Dashboard → **Storage** (left sidebar)
2. Click **Create New Bucket** button

### 3b. Create Bucket 1: AVATARS

**Settings:**
- **Bucket Name:** `avatars`
- **Visibility:** PUBLIC
- **File size limit:** 5MB

**Steps:**
1. Fill in name and settings
2. Click **Create Bucket**
3. Click bucket name → **Policies** tab

**Add Policy:**
Click **New Policy** → **For public access**
- Allow: `SELECT` (read)
- For authenticated users

### 3c. Create Bucket 2: LOGOS

**Settings:**
- **Bucket Name:** `logos`
- **Visibility:** PUBLIC
- **File size limit:** 10MB

(Same policy as avatars)

### 3d. Create Bucket 3: BRAND-ASSETS

**Settings:**
- **Bucket Name:** `brand-assets`
- **Visibility:** PUBLIC
- **File size limit:** 50MB

(Same policy as avatars)

### 3e. Create Bucket 4: MOCKUPS

**Settings:**
- **Bucket Name:** `mockups`
- **Visibility:** PUBLIC
- **File size limit:** 50MB

(Same policy as avatars)

### 3f. Create Bucket 5: DOCUMENTS

**Settings:**
- **Bucket Name:** `documents`
- **Visibility:** PRIVATE
- **File size limit:** 100MB

**Add Policy:**
Click **New Policy** → **For authenticated users**
- Allow: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- Only own files: `storage.objects.owner_id = auth.uid()`

---

## STEP 4: CREATE ADMIN USER

### 4a. Create Auth User

1. Supabase Dashboard → **Authentication** (left sidebar)
2. Click **Users** tab
3. Click **Add User** button
4. Fill in:
   - **Email:** your-email@example.com
   - **Password:** Strong password
5. Click **Create User**

### 4b. Set Admin Role

1. Find the user in list
2. Click the user row
3. Scroll down to **User Metadata**
4. Add JSON:
```json
{
  "role": "admin",
  "name": "Admin Name"
}
```
5. Click **Save**

### 4c. Update .env

```bash
VITE_ADMIN_EMAIL=your-email@example.com
```

---

## STEP 5: TEST DATABASE CONNECTION

### 5a. Start Development Server

```bash
npm run dev
```

### 5b. Test Auth Flow

1. Open http://localhost:5173
2. Click **Sign Up**
3. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Password: Any strong password
4. Should redirect to Dashboard
5. Check Dashboard loads without errors

### 5c. Verify Profile Created

In Supabase SQL Editor:

```sql
SELECT * FROM profiles WHERE email = 'test@example.com';
```

**Expected:** 1 row with user data

### 5d. Test Premium Feature

1. In app, go to **Dashboard** → Click **"Unlock Premium"**
2. In Development mode, should allow unlock without payment
3. Verify banner shows "PREMIUM ACTIVATED"

### 5e. Verify Premium Unlock Recorded

In SQL Editor:

```sql
SELECT * FROM payment_unlock_state 
WHERE unlocked = true 
ORDER BY created_at DESC LIMIT 1;
```

**Expected:** 1 row for test user

---

## STEP 6: TEST FEATURES

### 6a. Test Business Names Generation

1. Navigate to **Business Names** page
2. Should see "Premium Required" (if not unlocked) or generation form
3. Unlock premium if needed
4. Fill in: Industry, Keywords
5. Click **Generate**
6. Should display 20 generated business names

**Verify in Database:**
```sql
SELECT COUNT(*) FROM business_names WHERE user_id = 'YOUR_TEST_USER_UUID';
```

### 6b. Test Enterprise Analysis

1. Navigate to **Enterprise** page
2. Fill form: Name, Industry, Team Size, Goal, Challenge
3. Click **Generate**
4. Should display SWOT analysis and team structure

**Verify:**
```sql
SELECT COUNT(*) FROM enterprise_analyses;
```

### 6c. Test Community Posts

1. Navigate to **OpportunityFinder** page
2. Should see community feed (may be empty)
3. Create new post: Title, Type, Content
4. Should display in feed
5. Like and react to posts

**Verify:**
```sql
SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 5;
```

### 6d. Test Favorites

1. Generate business names
2. Click star icon on a name → Add to Favorites
3. Navigate to **Dashboard** → Check favorites section

**Verify:**
```sql
SELECT * FROM favorites WHERE type = 'business_name';
```

### 6e. Test 3D Brand Mockup

1. Navigate to **Brands** page
2. Adjust colors and logo position in 3D viewer
3. Should save design automatically
4. Refresh page → Design should be restored

**Verify:**
```sql
SELECT COUNT(*) FROM brand_projects;
```

---

## STEP 7: SET UP ADMIN DASHBOARD

### 7a. Login as Admin

1. Logout current user
2. Login with admin email (created in STEP 4)
3. Should redirect to Admin dashboard (not Dashboard)

### 7b. Verify Admin Features

1. Should see user list
2. Should see system statistics (users, AI calls, unlocks)
3. Should see audit logs
4. Navigate **Logout** button works

**Verify Logs:**
```sql
SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 20;
```

---

## STEP 8: SECURITY VERIFICATION

### 8a. Test RLS Policies

**Verify User Data Isolation:**

Login with Test User 1, then create a test SQL query:

```sql
-- Run as Test User 1 (should see own data only)
SELECT * FROM business_names;
-- Expected: Only Test User 1's business names

-- Try to access other user's data
SELECT * FROM business_names WHERE user_id != auth.uid();
-- Expected: Empty result (RLS blocks it)
```

**Verify Admin Access:**

Login with Admin, then:

```sql
SELECT COUNT(*) FROM admin_logs;
-- Expected: Logs visible (admin can read)

-- Regular user trying:
SELECT COUNT(*) FROM admin_logs;
-- Expected: Permission denied
```

### 8b. Check Auth Tokens

In browser DevTools (F12) → Application → Cookies:

- Look for `sb-access-token` (Supabase auth token)
- Look for `sb-refresh-token`
- Should be present and valid

### 8c. Verify HTTPS (Production)

Production environment:
- Use `https://` URLs only
- Tokens transmitted securely
- Check browser lock icon 🔒

---

## STEP 9: ENVIRONMENT-SPECIFIC CONFIGURATION

### 9a. Development Environment

**`.env.local` (already created in STEP 1)**

```bash
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_GEMINI_API_KEY=...
```

### 9b. Staging Environment (Optional)

Create `.env.staging`:

```bash
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_GEMINI_API_KEY=...
```

Build and deploy:
```bash
npm run build -- --mode staging
```

### 9c. Production Environment

Set environment variables in deployment platform (Vercel, Netlify, etc.):

1. Go to hosting provider dashboard
2. Project settings → Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_GEMINI_API_KEY`
   - `VITE_ADMIN_EMAIL`

### 9d. Secrets Management (Production)

**Never commit API keys to git:**

```bash
# .gitignore (should already have)
.env
.env.local
.env.*.local
```

**Use environment variables:**
```bash
# In CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
environment:
  VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.SUPABASE_KEY }}
```

---

## STEP 10: PRODUCTION DEPLOYMENT

### 10a. Build for Production

```bash
npm run build
```

**Expected Output:**
```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-XXX.js
  │   └── index-XXX.css
  └── robots.txt
```

### 10b. Deploy to Hosting

**Option 1: Vercel (Recommended)**

```bash
npm install -g vercel
vercel --prod
```

**Option 2: Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option 3: Docker**

Create `Dockerfile`:
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:
```bash
docker build -t machrou3i-vision-lab .
docker push your-registry/machrou3i-vision-lab
```

### 10c. Configure CORS (Supabase)

1. Supabase Dashboard → Settings → API
2. Add CORS hosts:
```
https://yourdomain.com
https://www.yourdomain.com
https://app.yourdomain.com
```

### 10d. Enable Row Level Security (Already Done)

Verify all tables have RLS enabled:

```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

**Expected:** All tables show `rowsecurity = true`

---

## STEP 11: MONITORING & LOGS

### 11a. Check Supabase Logs

1. Dashboard → **Logs** (left sidebar)
2. Filter by:
   - **Auth Logs:** Authentication events
   - **API Logs:** Database queries
   - **Edge Logs:** Function execution

### 11b. Monitor Database Performance

```sql
-- Slow queries
SELECT query, calls, mean_time FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

### 11c. Set Up Alerts (Supabase Pro Plan)

1. Dashboard → Settings → Alerts
2. Set up notifications for:
   - High CPU usage
   - High memory usage
   - Query failures
   - Auth failures

---

## STEP 12: BACKUP & DISASTER RECOVERY

### 12a. Enable Automated Backups

1. Supabase Dashboard → Settings → Backups
2. Select backup frequency (daily recommended)
3. Configure retention (30 days minimum)

### 12b. Manual Backup

```sql
-- Export database dump
pg_dump postgres://user:password@host/dbname > backup.sql
```

### 12c. Restore from Backup

1. Dashboard → Backups
2. Click **Restore** on desired backup
3. Choose **"Restore to new project"** or **"Restore current"**
4. Wait for completion

---

## TROUBLESHOOTING DEPLOYMENT ISSUES

### Issue: "Permission Denied" on Auth Operations

**Cause:** RLS policy blocking request  
**Solution:**
1. Check user is authenticated: `console.log(user)`
2. Verify RLS policy for that table
3. Check `user.id` matches `user_id` in row

### Issue: "CORS Error" on API Requests

**Cause:** Frontend domain not in CORS whitelist  
**Solution:**
1. Go to Supabase Settings → API
2. Add your domain to CORS hosts
3. Restart app

### Issue: Storage Upload Fails

**Cause:** Bucket policy not configured  
**Solution:**
1. Storage → Select bucket
2. Policies → Add policy for authenticated users
3. Retry upload

### Issue: Premium Features Not Unlocking

**Cause:** payment_unlock_state record not created  
**Solution:**
```sql
-- Check record exists
SELECT * FROM payment_unlock_state WHERE user_id = 'UUID';

-- If missing, insert manually (for testing)
INSERT INTO payment_unlock_state (user_id, unlocked)
VALUES ('UUID', true)
ON CONFLICT (user_id) DO UPDATE SET unlocked = true;
```

### Issue: Admin Dashboard Not Accessible

**Cause:** User doesn't have admin role  
**Solution:**
1. Dashboard → Authentication → Users
2. Edit user → User Metadata
3. Add: `{"role": "admin"}`
4. Logout and login again

---

## FINAL CHECKLIST

- [ ] Schema deployed (all 8 tables created)
- [ ] Storage buckets created (5 total)
- [ ] Admin user created and role set
- [ ] `.env.local` configured with credentials
- [ ] App tested locally (all features working)
- [ ] RLS policies verified (user data isolation working)
- [ ] Production build created
- [ ] Application deployed to hosting
- [ ] Domain configured with CORS
- [ ] Backups enabled
- [ ] Monitoring set up
- [ ] SSL certificate active (HTTPS)

---

## POST-DEPLOYMENT TASKS

### Immediate (First 24 Hours)
- [ ] Monitor error logs and performance
- [ ] Verify auth flow works end-to-end
- [ ] Test all premium features
- [ ] Confirm email notifications working (if enabled)

### Week 1
- [ ] Set up monitoring/alerting
- [ ] Train team on admin dashboard
- [ ] Create backup schedule
- [ ] Test disaster recovery procedure

### Ongoing
- [ ] Review logs weekly
- [ ] Update dependencies monthly
- [ ] Monitor database performance
- [ ] Review audit logs for suspicious activity

---

## SUPPORT & RESOURCES

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [React Router Docs](https://reactrouter.com)
- [TanStack Query Docs](https://tanstack.com/query)

### Get Help
1. **Supabase Status:** https://status.supabase.com
2. **Supabase Discord:** https://discord.supabase.com
3. **GitHub Issues:** In your project repo
4. **Machrou3i Docs:** Check SUPABASE_COMPATIBILITY_MAP.md

---

## DEPLOYMENT SUCCESS CRITERIA

✅ **All users can:**
- Create account and login
- View dashboard with profile
- Generate business names (premium)
- Generate enterprise analysis (premium)
- View community posts
- Create community posts
- Like and react to posts

✅ **Admins can:**
- Access admin dashboard
- View system statistics
- View audit logs
- Manage user accounts

✅ **Data is:**
- Persisted to Supabase
- Protected by RLS policies
- Backed up daily
- Queryable via SQL

✅ **Performance is:**
- Sub-500ms for most queries
- 99.9% uptime target
- All assets cached properly

---

## DOCUMENT COMPLETION

**Schema:** ✅ `supabase_production_schema.sql`  
**Compatibility:** ✅ `SUPABASE_COMPATIBILITY_MAP.md`  
**RLS Policies:** ✅ `RLS_POLICIES_REFERENCE.md`  
**Deployment:** ✅ `DEPLOYMENT_GUIDE.md` (this file)  

**Total Setup Time:** 15-20 minutes  
**No Code Changes Required:** ✅  
**Production Ready:** ✅  

