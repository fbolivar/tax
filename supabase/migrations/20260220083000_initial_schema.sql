-- Create initial schema for TAX Application
-- Generated on 2026-02-20

-- 1. Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'viewer'::text CHECK (role = ANY (ARRAY['admin'::text, 'viewer'::text])),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month integer NOT NULL,
  year integer NOT NULL,
  file_name text,
  opening_balance numeric DEFAULT 0,
  total_deposits numeric DEFAULT 0,
  total_withdrawals numeric DEFAULT 0,
  closing_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statement_id uuid REFERENCES public.statements(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['DEPOSIT'::text, 'WITHDRAWAL'::text])),
  category text DEFAULT 'Uncategorized'::text,
  check_number text,
  balance numeric,
  raw_text text,
  created_at timestamptz DEFAULT now()
);

-- 2. RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins_Select_Policy" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins_Insert_Policy" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins_Update_Policy" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Admins_Delete_Policy" ON public.profiles FOR DELETE USING (true);

-- Statements policies
CREATE POLICY "Users can view own statements" ON public.statements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own statements" ON public.statements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own statements" ON public.statements FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own statements" ON public.statements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE TO authenticated USING (auth.uid() = user_id);
