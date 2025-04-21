import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gggnrmwishakhoxjbvdp.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZ25ybXdpc2hha2hveGpidmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjUxNzgsImV4cCI6MjA2MDMwMTE3OH0.9zdEJ15EF2_ZusQSV7sAZrY7_8j-CjDwKVQvYVwCGpE'

export const supabase = createClient(supabaseUrl, supabaseKey)
