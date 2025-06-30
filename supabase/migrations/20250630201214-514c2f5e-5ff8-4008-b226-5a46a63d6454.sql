
-- Create table for storing evaluation data
CREATE TABLE public.evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  caregiver_name TEXT NOT NULL,
  caregiver_email TEXT NOT NULL,
  caregiver_whatsapp TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_date_of_birth DATE NOT NULL,
  selected_skills JSONB NOT NULL,
  scores JSONB NOT NULL,
  communication_age TEXT NOT NULL,
  data_hora_preenchimento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for notification preferences
CREATE TABLE public.notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  enable_reminders BOOLEAN DEFAULT true,
  last_evaluation TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for evaluations
CREATE POLICY "Users can view their own evaluations" 
  ON public.evaluations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own evaluations" 
  ON public.evaluations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evaluations" 
  ON public.evaluations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evaluations" 
  ON public.evaluations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for notification preferences
CREATE POLICY "Users can view their own notification preferences" 
  ON public.notification_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notification preferences" 
  ON public.notification_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" 
  ON public.notification_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences" 
  ON public.notification_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);
