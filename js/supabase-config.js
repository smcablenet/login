// Supabase Configuration
const supabaseUrl = 'https://zqqgnlryumrtxeyrzswe.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcWdubHJ5dW1ydHhleXJ6c3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODM1NzYsImV4cCI6MjA3ODg1OTU3Nn0.x412AgTaWGssxLNdUKYON7dE7K5uXBGOsUck-_MXiac'; // Replace with your anon key

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized:', supabase);

