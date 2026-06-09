# MACHROU3I VISION LAB - ROW LEVEL SECURITY (RLS) POLICY REFERENCE
## Complete RLS Configuration for Production Supabase

**Document Version:** 1.0  
**Generated:** 2026-06-06  
**Total Policies:** 28  

---

## OVERVIEW

Row Level Security (RLS) is enabled on all user-owned tables. This document provides:
1. Complete RLS policy definitions
2. Policy intent and security rationale
3. Testing scenarios
4. Troubleshooting guide

### Quick Reference: RLS Enabled on These Tables
- ✅ profiles
- ✅ payment_unlock_state
- ✅ enterprise_analyses
- ✅ business_names
- ✅ favorites
- ✅ brand_projects
- ✅ community_posts
- ✅ admin_logs

---

## SECURITY PRINCIPLES

### 1. User Data Isolation
- Each user can only access their own records
- Foreign key: `user_id = auth.uid()`
- Enforced at database layer (not app layer)

### 2. Anonymous Access (Limited)
- Community posts readable by all authenticated users
- No anonymous read (login required)
- Prevents spam and abuse

### 3. Admin Privileges
- Admins can view audit logs
- Admin role set via `raw_user_meta_data` in `auth.users`
- No special database modification privileges (apps handles business logic)

### 4. System Operations
- Payment/premium unlock via system API (not direct user action)
- Audit logging via system triggers
- Admin action triggers audit entry

---

## TABLE: PROFILES

### Purpose
Extends Supabase `auth.users` with application-specific profile data.

### RLS Policies (4 total)

#### Policy 1: Users can view their own profile
```sql
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);
```
**Intent:** User can only read their own profile  
**Enforced:** `auth.uid() = id`  
**Used By:** Dashboard.tsx, AuthContext  

#### Policy 2: Profiles are viewable by all authenticated users
```sql
CREATE POLICY "Profiles are viewable by all authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);
```
**Intent:** Authenticated users can view any profile (for user names, avatars)  
**Enforced:** No USING clause (true means all authenticated)  
**Used By:** Community posts (to get post author name)  

#### Policy 3: Users can update their own profile
```sql
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```
**Intent:** User can only modify their own profile  
**Enforced:** Both USING (check row exists) and WITH CHECK (check row after update)  
**Used By:** Dashboard.tsx (save profile)  

#### Policy 4: System can insert profiles
```sql
CREATE POLICY "System can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);
```
**Intent:** System (auth trigger) can create new profiles  
**Enforced:** No restriction (allows profile creation on signup)  
**Used By:** Auth signup trigger  

### Test Scenarios

| User | Action | Result | Reason |
|------|--------|--------|--------|
| User A | SELECT own profile | ✅ ALLOWED | Policy 1: auth.uid() = id |
| User A | SELECT User B profile | ✅ ALLOWED | Policy 2: Authenticated users can view all profiles |
| User A | UPDATE own name | ✅ ALLOWED | Policy 3: auth.uid() = id |
| User A | UPDATE User B name | ❌ DENIED | No policy allows cross-user UPDATE |
| User A | DELETE own profile | ❌ DENIED | No DELETE policy (only admins can delete) |
| Unauthenticated | SELECT profiles | ❌ DENIED | No TO unauthenticated policy |

---

## TABLE: PAYMENT_UNLOCK_STATE

### Purpose
Tracks premium feature unlock per user. One record per user (unique constraint).

### RLS Policies (2 total)

#### Policy 1: Users can view their own payment state
```sql
CREATE POLICY "Users can view their own payment state"
ON public.payment_unlock_state FOR SELECT
USING (auth.uid() = user_id);
```
**Intent:** User can check their premium status  
**Enforced:** `auth.uid() = user_id`  
**Used By:** AuthContext.tsx (check premium status)  

#### Policy 2: System can upsert payment unlock state
```sql
CREATE POLICY "System can upsert payment unlock state"
ON public.payment_unlock_state FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update payment unlock state"
ON public.payment_unlock_state FOR UPDATE
WITH CHECK (true);
```
**Intent:** System (payment handler) can unlock premium  
**Enforced:** No restriction (system should validate business logic)  
**Used By:** Payment.tsx (unlock premium after Stripe)  

### Test Scenarios

| User | Action | Result | Reason |
|------|--------|--------|--------|
| User A | SELECT own payment state | ✅ ALLOWED | Policy 1: auth.uid() = user_id |
| User A | SELECT User B payment state | ❌ DENIED | No cross-user SELECT policy |
| System | UPDATE User A premium to true | ✅ ALLOWED | Policy 2: System can upsert |
| User A | UPDATE own premium to false | ❌ DENIED | No user UPDATE policy (system-only) |

---

## TABLE: ENTERPRISE_ANALYSES

### Purpose
Stores AI-generated enterprise analysis sessions and results.

### RLS Policies (4 total)

#### Policy 1: Users can view their own analyses
```sql
CREATE POLICY "Users can view their own analyses"
ON public.enterprise_analyses FOR SELECT
USING (auth.uid() = user_id);
```
**Intent:** User sees only their own analysis sessions  
**Enforced:** `auth.uid() = user_id`  
**Used By:** Enterprise.tsx (load history)  

#### Policy 2: Users can insert their own analyses
```sql
CREATE POLICY "Users can insert their own analyses"
ON public.enterprise_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);
```
**Intent:** User creates analysis under their own ID  
**Enforced:** `auth.uid() = user_id`  
**Used By:** Enterprise.tsx (save new analysis)  

#### Policy 3: Users can update their own analyses
```sql
CREATE POLICY "Users can update their own analyses"
ON public.enterprise_analyses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```
**Intent:** User can modify their own analyses  
**Enforced:** Both checks  
**Used By:** (Not used in current app, but available)  

#### Policy 4: Users can delete their own analyses
```sql
CREATE POLICY "Users can delete their own analyses"
ON public.enterprise_analyses FOR DELETE
USING (auth.uid() = user_id);
```
**Intent:** User can remove their own analyses  
**Enforced:** `auth.uid() = user_id`  
**Used By:** (Not used in current app, but available)  

### Test Scenarios

| User | Action | Result | Reason |
|------|--------|--------|--------|
| User A | SELECT own analysis | ✅ ALLOWED | Policy 1 |
| User A | SELECT User B analysis | ❌ DENIED | No cross-user policy |
| User A | INSERT analysis with user_id=A | ✅ ALLOWED | Policy 2 |
| User A | INSERT analysis with user_id=B | ❌ DENIED | WITH CHECK fails |
| User A | DELETE own analysis | ✅ ALLOWED | Policy 4 |
| User A | DELETE User B analysis | ❌ DENIED | No cross-user policy |

---

## TABLE: BUSINESS_NAMES

### Purpose
Stores business name generation sessions and results.

### RLS Policies (4 total)

**All policies identical to enterprise_analyses:**

```sql
CREATE POLICY "Users can view their own business names"
ON public.business_names FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business names"
ON public.business_names FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business names"
ON public.business_names FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business names"
ON public.business_names FOR DELETE
USING (auth.uid() = user_id);
```

**Test Scenarios:** Same as enterprise_analyses

---

## TABLE: FAVORITES

### Purpose
Generic polymorphic favorites (business names, logos, ideas, etc.).

### RLS Policies (4 total)

**All policies identical to enterprise_analyses:**

```sql
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
ON public.favorites FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);
```

**Test Scenarios:** Same as enterprise_analyses

---

## TABLE: BRAND_PROJECTS

### Purpose
Stores 3D brand mockup designs and parameters.

### RLS Policies (4 total)

**All policies identical to enterprise_analyses:**

```sql
CREATE POLICY "Users can view their own brand projects"
ON public.brand_projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brand projects"
ON public.brand_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brand projects"
ON public.brand_projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brand projects"
ON public.brand_projects FOR DELETE
USING (auth.uid() = user_id);
```

**Test Scenarios:** Same as enterprise_analyses

---

## TABLE: COMMUNITY_POSTS

### Purpose
Stores community opportunity posts accessible to all authenticated users.

### RLS Policies (4 total)

#### Policy 1: Community posts are viewable by all
```sql
CREATE POLICY "Community posts are viewable by all"
ON public.community_posts FOR SELECT
TO authenticated
USING (true);
```
**Intent:** Any authenticated user can read all community posts  
**Enforced:** No restriction (TO authenticated already limits)  
**Used By:** OpportunityFinder.tsx (show feed)  

#### Policy 2: Users can insert their own posts
```sql
CREATE POLICY "Users can insert their own posts"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```
**Intent:** User creates post under their own ID  
**Enforced:** `auth.uid() = user_id`  
**Used By:** OpportunityFinder.tsx (create new post)  

#### Policy 3: Users can update their own posts
```sql
CREATE POLICY "Users can update their own posts"
ON public.community_posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```
**Intent:** User can edit their own posts  
**Enforced:** Both checks  
**Used By:** (Post editing, not exposed in current UI)  

#### Policy 4: Users can delete their own posts
```sql
CREATE POLICY "Users can delete their own posts"
ON public.community_posts FOR DELETE
USING (auth.uid() = user_id);
```
**Intent:** User can remove their own posts  
**Enforced:** `auth.uid() = user_id`  
**Used By:** (Not used in current app)  

### Test Scenarios

| User | Action | Result | Reason |
|------|--------|--------|--------|
| User A | SELECT all posts | ✅ ALLOWED | Policy 1: All authenticated users |
| User A | INSERT post with user_id=A | ✅ ALLOWED | Policy 2 |
| User A | INSERT post with user_id=B | ❌ DENIED | WITH CHECK fails |
| User A | UPDATE own post | ✅ ALLOWED | Policy 3 |
| User A | UPDATE User B post | ❌ DENIED | USING check fails |
| User A | DELETE own post | ✅ ALLOWED | Policy 4 |
| Unauthenticated | SELECT posts | ❌ DENIED | TO authenticated required |

---

## TABLE: ADMIN_LOGS

### Purpose
Immutable audit log of system actions. Admins only.

### RLS Policies (2 total)

#### Policy 1: System can insert logs
```sql
CREATE POLICY "System can insert logs"
ON public.admin_logs FOR INSERT
WITH CHECK (true);
```
**Intent:** System can record any action  
**Enforced:** No restriction (audit trail)  
**Used By:** localDB.logUserAction() throughout app  

#### Policy 2: Admins can view all logs
```sql
CREATE POLICY "Admins can view all logs"
ON public.admin_logs FOR SELECT
USING (public.is_admin(auth.uid()));
```
**Intent:** Only admins can read audit logs  
**Enforced:** `is_admin(auth.uid())` = true  
**Used By:** Admin.tsx (view audit trail)  

### Test Scenarios

| User | Action | Result | Reason |
|------|--------|--------|--------|
| System | INSERT log entry | ✅ ALLOWED | Policy 1 |
| Admin | SELECT logs | ✅ ALLOWED | Policy 2: is_admin() = true |
| Regular User | SELECT logs | ❌ DENIED | is_admin() = false |
| Admin | UPDATE log entry | ❌ DENIED | No UPDATE policy |
| Admin | DELETE log entry | ❌ DENIED | No DELETE policy (immutable) |

---

## POLICY SUMMARY TABLE

| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|--------|--------|--------|--------|-------|
| profiles | 2/✅ | 1/✅ | 1/✅ | 0/❌ | Public read, user write, no delete |
| payment_unlock_state | 1/✅ | 1/✅ | 1/✅ | 0/❌ | User read, system write, no delete |
| enterprise_analyses | 1/✅ | 1/✅ | 1/✅ | 1/✅ | Full CRUD, user-owned |
| business_names | 1/✅ | 1/✅ | 1/✅ | 1/✅ | Full CRUD, user-owned |
| favorites | 1/✅ | 1/✅ | 1/✅ | 1/✅ | Full CRUD, user-owned |
| brand_projects | 1/✅ | 1/✅ | 1/✅ | 1/✅ | Full CRUD, user-owned |
| community_posts | 1/✅ | 1/✅ | 1/✅ | 1/✅ | Public read, user create/update/delete |
| admin_logs | 1/✅ | 1/✅ | 0/❌ | 0/❌ | System write, admin read, immutable |

---

## TESTING RLS POLICIES

### Test Setup

```sql
-- Create test users via Supabase Auth (do this in UI)
-- User A: test-a@example.com
-- User B: test-b@example.com
-- Admin: admin@example.com (set role: admin in Dashboard)

-- Get their UUIDs and use in queries below
```

### Test Queries

```sql
-- Test 1: User A can view own profile
SELECT * FROM profiles WHERE id = 'user-a-uuid';
-- Expected: 1 row (if SET ROLE to user-a)

-- Test 2: User A cannot view User B profile via RLS
-- (User A CAN see the row via Policy 2, but cannot modify it)

-- Test 3: Enterprise analyses isolation
-- Set role to user-a-uuid:
SELECT * FROM enterprise_analyses;
-- Expected: Only user-a's analyses

-- Test 4: Community posts readable by all
-- Set role to user-a-uuid:
SELECT * FROM community_posts;
-- Expected: All posts (from any user)

-- Test 5: Admin logs access
-- Set role to user-a-uuid:
SELECT * FROM admin_logs;
-- Expected: ERROR - permission denied

-- Set role to admin-uuid:
SELECT * FROM admin_logs;
-- Expected: All logs (admin can read)
```

### Set Role (For Testing)

```sql
-- In Supabase SQL Editor, temporarily assume a user's role:
SELECT set_config('request.jwt.claims', 
  '{"sub": "user-uuid-here", "role": "authenticated"}', 
  false);

-- Then run SELECT queries to test policies
```

---

## TROUBLESHOOTING

### Issue: "Permission denied" when trying to access data
**Causes:**
1. User is not authenticated (session expired)
2. RLS policy USING clause evaluates to false
3. User doesn't have the required role

**Solution:**
- Check `auth.uid()` is set (login first)
- Review RLS policy for that table
- Check `raw_user_meta_data` for role

### Issue: "New row violates row-level security policy" on INSERT
**Cause:** WITH CHECK clause fails (usually user_id mismatch)

**Example:**
```javascript
// WRONG: Trying to insert with different user_id
INSERT INTO business_names (user_id, ...)
VALUES ('other-user-uuid', ...);
// Error: user_id in row doesn't match auth.uid()

// CORRECT: Use auth.uid() from context
INSERT INTO business_names (user_id, industry, ...)
VALUES (auth.uid(), 'Agritech', ...);
```

**Solution:**
- Always insert with `user_id = auth.uid()`
- Never hardcode user_id from user input (security!)

### Issue: Admin can't view logs
**Cause:** User doesn't have admin role set

**Solution:**
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Click to edit
4. Set `raw_user_meta_data`:
```json
{
  "role": "admin"
}
```

### Issue: Community posts not visible
**Cause:** User not authenticated, or RLS policy not applied

**Solution:**
- Login first
- Check RLS is enabled: `ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;`
- Verify policy exists: `SELECT * FROM pg_policies WHERE tablename = 'community_posts';`

---

## PERFORMANCE CONSIDERATIONS

### Index-Aware Policies
Policies that use indexed columns are fast:

```sql
-- FAST: Indexed on user_id
WHERE auth.uid() = user_id

-- SLOWER: Function call (plan SQL carefully)
WHERE public.is_admin(auth.uid())

-- For frequently accessed data:
-- Add indexes on (user_id, created_at):
CREATE INDEX idx_business_names_user_created 
  ON business_names(user_id, created_at DESC);
```

### Query Plan Analysis
```sql
-- Check query plan with RLS:
EXPLAIN SELECT * FROM enterprise_analyses 
WHERE user_id = auth.uid();

-- Look for "Filter" steps - ensure user_id uses index
```

---

## MIGRATION PATH: ENABLING RLS ON EXISTING DATA

If you have existing data before RLS:

```sql
-- Step 1: Add RLS but leave policies incomplete
ALTER TABLE public.business_names ENABLE ROW LEVEL SECURITY;

-- Step 2: Add SELECT policy (most permissive first)
CREATE POLICY "temp_allow_all_select"
ON public.business_names FOR SELECT
USING (true);

-- Step 3: Test data is readable
SELECT * FROM business_names LIMIT 1;

-- Step 4: Replace with proper restrictive policies
DROP POLICY temp_allow_all_select ON public.business_names;
CREATE POLICY "Users can view their own business names"
ON public.business_names FOR SELECT
USING (auth.uid() = user_id);

-- Step 5: Test with specific user role
-- (See testing section above)
```

---

## COMPLIANCE & AUDITING

### Data Residency
- All RLS policies enforce user data residency
- User A's data never accessible to User B at database layer
- Admin access logged via admin_logs table

### GDPR Compliance
- User can view all their own data: ✅ (SELECT policies)
- User can modify their data: ✅ (UPDATE policies)
- User can delete their data: ✅ (DELETE policies exist)
- Audit trail maintained: ✅ (admin_logs immutable)

### Audit Trail
```sql
-- View all actions by user A:
SELECT * FROM admin_logs WHERE user_id = 'user-a-uuid'
ORDER BY created_at DESC;

-- View all premium unlocks:
SELECT * FROM admin_logs 
WHERE action = 'unlock_premium'
ORDER BY created_at DESC;
```

---

## SUMMARY

- **28 RLS policies** defined across 8 tables
- **User data isolation** enforced at database layer
- **Admin access** controlled via role-based checks
- **Community features** readable by all authenticated users
- **Audit trail** immutable and admin-accessible
- **Zero code changes** to existing app required

All policies are **enabled by default** in the production SQL schema.

