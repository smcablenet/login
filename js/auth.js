// Authentication System with Sample Admin
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Create sample admin if not exists
    createSampleAdmin();
    
    // Check if user is already logged in
    checkExistingLogin();
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        
        // Clear previous messages
        showMessage('', '');
        
        // Validate phone number
        if (!isValidPhone(phone)) {
            showMessage('Please enter a valid 11-digit Bangladeshi phone number', 'error');
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
            
            // For testing: Use sample admin credentials
            if (phone === '01955255066' && password === 'admin@milon') {
                const sampleAdmin = {
                    id: 'sample-admin-id',
                    user_id: 'SYS001',
                    full_name: 'System Administrator',
                    phone: '01955255066',
                    role: 'system_admin',
                    created_at: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(sampleAdmin));
                showMessage('Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = '../login/dashboard/system-admin.html';
                }, 1000);
                return;
            }
            
            // For other users, try Supabase
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
            
            setTimeout(() => {
                redirectToDashboard(user.role);
            }, 1000);
            
        } catch (error) {
            console.error('Login system error:', error);
            showMessage('Login failed. Please try again.', 'error');
        }
    }
    
    function createSampleAdmin() {
        // Store sample admin in localStorage for testing
        const sampleAdmins = {
            '01955255066': {
                id: 'sample-system-admin',
                user_id: 'SYS001',
                full_name: 'System Administrator',
                phone: '01955255066',
                password: 'admin@milon',
                role: 'system_admin',
                address: 'Dhaka, Bangladesh',
                service_type: 'Administration',
                monthly_bill: 0,
                created_at: new Date().toISOString()
            },
            '01642311987': {
                id: 'sample-admin',
                user_id: 'ADM001',
                full_name: 'Admin User',
                phone: '01642311987',
                password: 'sojib.sarmin',
                role: 'admin',
                address: 'Dhaka, Bangladesh',
                service_type: 'Administration',
                monthly_bill: 0,
                created_at: new Date().toISOString()
            }
        };
        
        localStorage.setItem('sampleAdmins', JSON.stringify(sampleAdmins));
    }
    
    function redirectToDashboard(role) {
        switch(role) {
            case 'system_admin':
                window.location.href = '../dashboard/system-admin.html';
                break;
            case 'admin':
                window.location.href = '../dashboard/admin.html';
                break;
            case 'user':
                window.location.href = '../dashboard/user.html';
                break;
            default:
                window.location.href = '../dashboard/user.html';
        }
    }
    
    function checkExistingLogin() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                const userData = JSON.parse(user);
                redirectToDashboard(userData.role);
            } catch (error) {
                localStorage.removeItem('currentUser');
            }
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

// Global logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
        }
                
