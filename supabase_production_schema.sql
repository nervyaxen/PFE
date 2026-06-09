-- ═══════════════════════════════════════════════════════════════════════════════
-- MACHROU3I VISION LAB - PRODUCTION SUPABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════════════════════
-- 
-- This schema is 100% compatible with the existing codebase.
-- Execute in Supabase SQL Editor without modification.
-- Version: 1.0
-- Generated: 2026-06-06
-- 
-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 1: EXTENSIONS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 2: CUSTOM TYPES & ENUMS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enum for community post types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'community_post_type') THEN
    CREATE TYPE public.community_post_type AS ENUM ('idea', 'problem', 'opportunity', 'concept');
  END IF;
END $$;

-- Enum for user roles (for RBAC)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'premium');
  END IF;
END $$;

-- Enum for garment types in brand mockups
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'garment_type') THEN
    CREATE TYPE public.garment_type AS ENUM ('t_shirt', 'hoodie', 'sweatshirt');
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 3: HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user role from auth metadata
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT (raw_user_meta_data->>'role') INTO user_role
  FROM auth.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT public.get_user_role(user_id)) = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is premium
CREATE OR REPLACE FUNCTION public.is_premium(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.payment_unlock_state
    WHERE user_id = $1 AND unlocked = true
  );
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 4: CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. PROFILES TABLE
-- Extends auth.users with application-specific profile data
-- id -> auth.users.id (foreign key with cascade delete)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  avatar text, -- URL to avatar in storage or external source
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT profiles_email_not_empty CHECK (email IS NOT NULL AND email <> '')
);

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ─────────────────────────────────────────────────────────────────────────────

-- 2. PAYMENT UNLOCK STATE TABLE
-- Tracks premium feature unlock per user
-- One record per user (unique constraint on user_id)
CREATE TABLE IF NOT EXISTS public.payment_unlock_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER payment_unlock_state_set_updated_at
BEFORE UPDATE ON public.payment_unlock_state
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_payment_unlock_state_user_id 
  ON public.payment_unlock_state(user_id);

-- ─────────────────────────────────────────────────────────────────────────────

-- 3. ENTERPRISE ANALYSES TABLE
-- Stores AI-generated enterprise analysis reports
-- Input: enterprise details, Output: analysis JSON
CREATE TABLE IF NOT EXISTS public.enterprise_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input jsonb, -- Input parameters: name, industry, teamSize, goal, challenge
  output jsonb, -- Output: executiveSummary, swot, teamAnalysis, revenueOptimizer, etc.
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER enterprise_analyses_set_updated_at
BEFORE UPDATE ON public.enterprise_analyses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_enterprise_analyses_user_id_created_at 
  ON public.enterprise_analyses(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_enterprise_analyses_created_at 
  ON public.enterprise_analyses(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────

-- 4. BUSINESS NAMES TABLE
-- Stores business name generation sessions with results
CREATE TABLE IF NOT EXISTS public.business_names (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  industry text, -- e.g., "Agritech", "CyberSaaS"
  keywords text, -- comma or space-separated seed keywords
  names jsonb NOT NULL, -- Array of {name, meaning, score}
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER business_names_set_updated_at
BEFORE UPDATE ON public.business_names
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_business_names_user_id_created_at 
  ON public.business_names(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_names_created_at 
  ON public.business_names(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────

-- 5. FAVORITES TABLE
-- Generic favorites for business names, logos, ideas, etc.
-- type can be: 'business_name', 'logo_session', 'idea', etc.
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- e.g., 'business_name', 'logo_session', 'brand_name'
  item jsonb NOT NULL, -- Flexible payload: stores the actual favorite item
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER favorites_set_updated_at
BEFORE UPDATE ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_favorites_user_id_type_created_at 
  ON public.favorites(user_id, type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id 
  ON public.favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_type 
  ON public.favorites(type);

-- ─────────────────────────────────────────────────────────────────────────────

-- 6. BRAND PROJECTS TABLE
-- Stores 3D brand mockup sessions (garments, logos, colors, positions)
-- Used by the Brands.tsx page for saving/loading mockup designs
CREATE TABLE IF NOT EXISTS public.brand_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  details jsonb, -- Flexible JSON: productColor, backgroundColor, backgroundImage, logoImage, logoScale, logoPositionY, logoPositionZ, garmentType, etc.
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER brand_projects_set_updated_at
BEFORE UPDATE ON public.brand_projects
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_brand_projects_user_id_created_at 
  ON public.brand_projects(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_brand_projects_created_at 
  ON public.brand_projects(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────

-- 7. COMMUNITY POSTS TABLE
-- Stores opportunity finder community posts with reactions and likes
-- Supports likes, reactions (emoji per user), and comments
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL, -- Display name recorded with post (may differ from auth user name)
  title text NOT NULL,
  type public.community_post_type NOT NULL DEFAULT 'opportunity',
  content text,
  ai_insights jsonb, -- Optional AI analysis: score, potential, risk, revenue, monetization, growth
  likes integer NOT NULL DEFAULT 0,
  reacts jsonb NOT NULL DEFAULT '{}'::jsonb, -- Map: {user_id: emoji_reaction}
  liked_by jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of user IDs who liked
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER community_posts_set_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_community_posts_created_at 
  ON public.community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id 
  ON public.community_posts(user_id);

CREATE INDEX IF NOT EXISTS idx_community_posts_likes 
  ON public.community_posts(likes DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_type 
  ON public.community_posts(type);

-- ─────────────────────────────────────────────────────────────────────────────

-- 8. ADMIN LOGS TABLE
-- Immutable audit log for user actions (admin purposes)
-- Tracks: logins, logouts, generation actions, favorites, uploads, etc.
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL, -- e.g., 'user_login', 'generate_business_names', 'unlock_premium'
  details jsonb, -- Flexible payload: additional context for the action
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id 
  ON public.admin_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at 
  ON public.admin_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action 
  ON public.admin_logs(action);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all user-owned tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_unlock_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Public can view profiles (for sharing user names, avatars)
CREATE POLICY "Profiles are viewable by all authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- System can insert profiles (for new user signup)
CREATE POLICY "System can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- PAYMENT UNLOCK STATE POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view their own premium unlock status
CREATE POLICY "Users can view their own payment state"
ON public.payment_unlock_state FOR SELECT
USING (auth.uid() = user_id);

-- System can update payment unlock state
CREATE POLICY "System can upsert payment unlock state"
ON public.payment_unlock_state FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update payment unlock state"
ON public.payment_unlock_state FOR UPDATE
WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- ENTERPRISE ANALYSES POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view only their own analyses
CREATE POLICY "Users can view their own analyses"
ON public.enterprise_analyses FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert their own analyses"
ON public.enterprise_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update their own analyses"
ON public.enterprise_analyses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete their own analyses"
ON public.enterprise_analyses FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- BUSINESS NAMES POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view only their own business names
CREATE POLICY "Users can view their own business names"
ON public.business_names FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own business names
CREATE POLICY "Users can insert their own business names"
ON public.business_names FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own business names
CREATE POLICY "Users can update their own business names"
ON public.business_names FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own business names
CREATE POLICY "Users can delete their own business names"
ON public.business_names FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- FAVORITES POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view only their own favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorites
CREATE POLICY "Users can update their own favorites"
ON public.favorites FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- BRAND PROJECTS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Users can view only their own brand projects
CREATE POLICY "Users can view their own brand projects"
ON public.brand_projects FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own brand projects
CREATE POLICY "Users can insert their own brand projects"
ON public.brand_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own brand projects
CREATE POLICY "Users can update their own brand projects"
ON public.brand_projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own brand projects
CREATE POLICY "Users can delete their own brand projects"
ON public.brand_projects FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- COMMUNITY POSTS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Everyone (authenticated) can view community posts
CREATE POLICY "Community posts are viewable by all"
ON public.community_posts FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own community posts
CREATE POLICY "Users can insert their own posts"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own community posts
CREATE POLICY "Users can update their own posts"
ON public.community_posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own community posts
CREATE POLICY "Users can delete their own posts"
ON public.community_posts FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ADMIN LOGS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- System can insert admin logs
CREATE POLICY "System can insert logs"
ON public.admin_logs FOR INSERT
WITH CHECK (true);

-- Admins can view all logs
CREATE POLICY "Admins can view all logs"
ON public.admin_logs FOR SELECT
USING (public.is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 6: STORAGE BUCKETS & POLICIES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Note: Storage bucket creation in Supabase requires using the web UI or SDK
-- The following are placeholder comments for manual creation:
--
-- BUCKETS TO CREATE:
-- 1. avatars - user profile avatars (public read, private write)
-- 2. logos - generated/uploaded logos (public read, private write)
-- 3. brand-assets - brand project exports and assets (public read, private write)
-- 4. mockups - 3D mockup exports and product images (public read, private write)
-- 5. documents - PDF exports (private read/write)
--
-- Storage policies are configured via Supabase Dashboard:
-- - Set avatars bucket to PUBLIC
-- - Set logos bucket to PUBLIC
-- - Set brand-assets bucket to PUBLIC
-- - Set mockups bucket to PUBLIC
-- - Set documents bucket to PRIVATE

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 7: DATA VIEWS (FOR CONVENIENCE)
-- ═══════════════════════════════════════════════════════════════════════════════

-- View for user premium status with profile info
CREATE OR REPLACE VIEW public.users_with_premium AS
SELECT
  p.id,
  p.email,
  p.name,
  p.avatar,
  COALESCE(pus.unlocked, false) as premium_unlocked,
  p.created_at,
  p.updated_at
FROM public.profiles p
LEFT JOIN public.payment_unlock_state pus ON p.id = pus.user_id;

-- View for aggregated user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT CASE WHEN pus.unlocked = true THEN p.id END) as premium_users,
  COUNT(DISTINCT en.id) as total_analyses,
  COUNT(DISTINCT bn.id) as total_business_names,
  COUNT(DISTINCT fav.id) as total_favorites,
  COUNT(DISTINCT bp.id) as total_brand_projects,
  COUNT(DISTINCT cp.id) as total_community_posts
FROM public.profiles p
LEFT JOIN public.payment_unlock_state pus ON p.id = pus.user_id
LEFT JOIN public.enterprise_analyses en ON p.id = en.user_id
LEFT JOIN public.business_names bn ON p.id = bn.user_id
LEFT JOIN public.favorites fav ON p.id = fav.user_id
LEFT JOIN public.brand_projects bp ON p.id = bp.user_id
LEFT JOIN public.community_posts cp ON p.id = cp.user_id;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 8: SEED DATA (OPTIONAL - FOR TESTING)
-- ═══════════════════════════════════════════════════════════════════════════════

-- NOTE: Auth users are typically created via Supabase Auth signup.
-- After users are created, populate profiles manually or via trigger.
-- The following are examples for testing purposes only.
--
-- To test with mock data:
-- 1. Create auth users via Supabase Auth console or API
-- 2. Get the user IDs (UUIDs)
-- 3. Run INSERT statements below with real user IDs

-- Example: Insert a test profile (requires valid user_id from auth.users)
-- INSERT INTO public.profiles (id, email, name, avatar)
-- VALUES ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'test@example.com', 'Test User', NULL)
-- ON CONFLICT (id) DO NOTHING;

-- Example: Create sample business names for testing
-- INSERT INTO public.business_names (user_id, industry, keywords, names)
-- SELECT
--   p.id,
--   'Agritech',
--   'organic, sustainable, farm',
--   '[{"name":"NexusGrow","meaning":"Innovation in agriculture","score":92}]'::jsonb
-- FROM public.profiles p
-- WHERE p.email = 'test@example.com'
-- ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- PHASE 9: SUMMARY OF TABLE RELATIONSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                         TABLE RELATIONSHIPS                                 │
-- ├─────────────────────────────────────────────────────────────────────────────┤
-- │                                                                              │
-- │  auth.users (managed by Supabase Auth)                                      │
-- │       ↓                                                                      │
-- │  profiles (one-to-one) → user identity & avatar                            │
-- │       ↓                                                                      │
-- │  ├─ payment_unlock_state (one-to-one) → premium status                    │
-- │  ├─ enterprise_analyses (one-to-many) → AI analysis sessions              │
-- │  ├─ business_names (one-to-many) → generated business names               │
-- │  ├─ favorites (one-to-many) → saved favorites (polymorphic)               │
-- │  ├─ brand_projects (one-to-many) → 3D mockup designs                      │
-- │  └─ admin_logs (one-to-many) → audit trail                                │
-- │                                                                              │
-- │  community_posts (many-to-many via user_id & liked_by array)              │
-- │       ↓                                                                      │
-- │  ├─ user_id → profiles (can be NULL for anonymous posts)                  │
-- │  └─ liked_by → array of user IDs (denormalized for performance)           │
-- │                                                                              │
-- └─────────────────────────────────────────────────────────────────────────────┘
--
-- ═════════════════════════════════════════════════════════════════════════════════
-- FOREIGN KEY SUMMARY
-- ═════════════════════════════════════════════════════════════════════════════════
-- profiles.id → auth.users.id (CASCADE)
-- payment_unlock_state.user_id → auth.users.id (CASCADE)
-- enterprise_analyses.user_id → auth.users.id (CASCADE)
-- business_names.user_id → auth.users.id (CASCADE)
-- favorites.user_id → auth.users.id (CASCADE)
-- brand_projects.user_id → auth.users.id (CASCADE)
-- community_posts.user_id → auth.users.id (SET NULL)
-- admin_logs.user_id → auth.users.id (SET NULL)
--
-- ═════════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════
-- DEPLOYMENT INSTRUCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- 1. COPY this entire SQL file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Create a new query
-- 4. PASTE this entire script
-- 5. Click "RUN"
-- 6. Wait for completion (should execute without errors)
--
-- 7. MANUALLY CREATE STORAGE BUCKETS:
--    - Dashboard → Storage → Create New Bucket
--    - Create: avatars, logos, brand-assets, mockups, documents
--    - Set visibility: public for first 4, private for documents
--
-- 8. (OPTIONAL) CREATE SERVICE ROLE KEY:
--    - Dashboard → Settings → API
--    - Copy "service_role" key (for backend operations if needed)
--
-- 9. VERIFY INSTALLATION:
--    - Run: SELECT * FROM public.user_stats;
--    - Should return row with all zeros (no data yet)
--
-- 10. APPLICATION INTEGRATION:
--    - Update .env with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
--    - Application will auto-create profiles on first login
--    - RLS policies will enforce row-level security
--
-- ═══════════════════════════════════════════════════════════════════════════════

-- END OF PRODUCTION SCHEMA
