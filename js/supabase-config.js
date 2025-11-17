


// Supabase Configuration - REPLACE WITH YOUR ACTUAL KEYS
const supabaseUrl = 'https://zqqgnlryumrtxeyrzswe.supabase.co'; // ← REPLACE THIS
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcWdubHJ5dW1ydHhleXJ6c3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODM1NzYsImV4cCI6MjA3ODg1OTU3Nn0.x412AgTaWGssxLNdUKYON7dE7K5uXBGOsUck-_MXiac...'; // ← REPLACE THIS

// Initialize Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log('Supabase initialized successfully');

// Test connection
async function testConnection() {
    try {
        const { data, error } = await supabase.from('profiles').select('count');
        if (error) {
            console.error('Supabase connection failed:', error);
        } else {
            console.log('Supabase connected successfully');
        }
    } catch (error) {
        console.error('Connection test error:', error);
    }
}

// Run connection test
testConnection();
