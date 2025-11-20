// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadSampleData(); // Load sample data first
    loadDashboardData();
    
    document.getElementById('userRegistrationForm')?.addEventListener('submit', createNewUser);
});

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('userName').textContent = user.full_name || user.phone;
}

// Load sample data for testing
function loadSampleData() {
    // Sample users data
    const sampleUsers = [
        {
            user_id: 'USER001',
            full_name: 'John Doe',
            phone: '01712345678',
            service_type: 'Dish Services',
            monthly_bill: 500,
            role: 'user'
        },
        {
            user_id: 'USER002', 
            full_name: 'Jane Smith',
            phone: '01812345678',
            service_type: 'Internet Service',
            monthly_bill: 800,
            role: 'user'
        }
    ];
    
    localStorage.setItem('sampleUsers', JSON.stringify(sampleUsers));
}
