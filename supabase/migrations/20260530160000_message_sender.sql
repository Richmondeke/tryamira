-- Alter public.messages table to add sender_id referencing profiles(id)
ALTER TABLE public.messages
ADD COLUMN sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
