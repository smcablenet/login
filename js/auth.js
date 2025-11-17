// Authentication System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Check if user is already logged in
    checkExistingLogin();
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate phone number
        if (!isValidPhone(phone)) {
            showMessage('Please enter a valid 11-digit phone number', 'error');
            return;
        }
        
        // Validate password
        if (password.length < 5) {
            showMessage('Password must be at least 5 characters', 'error');
            return;
        }
        
        await loginUser(phone, password);
    });
    
    async function loginUser(phone, password) {
        try {
            showMessage('Logging in...', 'success');
            
            // Check user in database
            const { data: user, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('phone', phone)
                .eq('password', password)
                .single();
            
            if (error || !user) {
                showMessage('Invalid phone number or password', 'error');
                return;
            }
            
            // Store user session
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                redirectToDashboard(user.role);
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Login failed. Please try again.', 'error');
        }
    }
    
    function redirectToDashboard(role) {
        switch(role) {
            case 'system_admin':
                window.location.href = 'dashboard/system-admin.html';
                break;
            case 'admin':
                window.location.href = 'dashboard/admin.html';
                break;
            case 'user':
                window.location.href = 'dashboard/user.html';
                break;
            default:
                window.location.href = 'dashboard/user.html';
        }
    }
    
    function checkExistingLogin() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            redirectToDashboard(userData.role);
        }
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^(?:\+88|01[3-9]\d{8})$/;
        return phoneRegex.test(phone) && phone.length === 11;
    }
    
    function showMessage(text, type) {
        loginMessage.textContent = text;
        loginMessage.className = `message ${type}`;
    }
});
