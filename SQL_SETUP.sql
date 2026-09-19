-- Auto Maintenance Tracker - Supabase Setup
-- Copy and paste this entire script into your Supabase SQL Editor

-- Create maintenance_logs table
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  parts TEXT[] NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  mileage INTEGER,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_id ON public.maintenance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_service_date ON public.maintenance_logs(service_date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_service_type ON public.maintenance_logs(service_type);

-- Enable Row Level Security
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only view their own logs" ON public.maintenance_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own logs" ON public.maintenance_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own logs" ON public.maintenance_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own logs" ON public.maintenance_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create search function (optional, for better text search)
CREATE OR REPLACE FUNCTION search_maintenance(search_query TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  service_date DATE,
  parts TEXT[],
  service_type VARCHAR,
  description TEXT,
  mileage INTEGER,
  cost DECIMAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT ml.* FROM public.maintenance_logs ml
  WHERE ml.user_id = auth.uid()
  AND (
    ml.service_type ILIKE '%' || search_query || '%'
    OR ml.description ILIKE '%' || search_query || '%'
    OR ml.notes ILIKE '%' || search_query || '%'
    OR EXISTS (
      SELECT 1 FROM unnest(ml.parts) AS part
      WHERE part ILIKE '%' || search_query || '%'
    )
  )
  ORDER BY ml.service_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on search function
GRANT EXECUTE ON FUNCTION search_maintenance(TEXT) TO authenticated;
