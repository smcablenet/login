

// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadDashboardData();
    
    // Event Listeners
    document.getElementById('userRegistrationForm')?.addEventListener('submit', createNewUser);
});

// Authentication Check
function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }
    
    // Display user info
    document.getElementById('userName').textContent = user.full_name || user.phone;
    
    // Show/hide features based on role
    if (user.role !== 'system_admin') {
        // Hide system admin only features
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        adminOnlyElements.forEach(el => el.style.display = 'none');
    }
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('section-active');
        section.classList.add('section-hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('section-hidden');
    document.getElementById(sectionId).classList.add('section-active');
    
    // Update nav active state
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('nav-active');
    });
    event.target.classList.add('nav-active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'userManagement':
            loadUsersTable();
            break;
        case 'overview':
            loadDashboardStats();
            break;
    }
}

// Dashboard Data
async function loadDashboardData() {
    await loadDashboardStats();
    await loadUsersTable();
}

async function loadDashboardStats() {
    try {
        // Get total users
        const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id');
            
        if (!usersError) {
            document.getElementById('totalUsers').textContent = users.length;
            document.getElementById('activeUsers').textContent = users.length; // Simplified
        }
        
        // Get pending bills
        const { data: bills, error: billsError } = await supabase
            .from('bills')
            .select('amount')
            .eq('status', 'unpaid');
            
        if (!billsError) {
            document.getElementById('pendingBills').textContent = bills.length;
            const totalRevenue = bills.reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
            document.getElementById('totalRevenue').textContent = totalRevenue + ' BDT';
        }
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// User Management
function showAddUserForm() {
    document.getElementById('addUserForm').classList.remove('hidden');
}

function hideAddUserForm() {
    document.getElementById('addUserForm').classList.add('hidden');
    document.getElementById('userRegistrationForm').reset();
}

async function createNewUser(event) {
    event.preventDefault();
    
    const formData = {
        user_id: document.getElementById('newUserId').value,
        full_name: document.getElementById('newUserName').value,
        phone: document.getElementById('newUserPhone').value,
        password: document.getElementById('newUserPassword').value,
        address: document.getElementById('newUserAddress').value,
        service_type: document.getElementById('newUserService').value,
        monthly_bill: parseFloat(document.getElementById('newUserBill').value),
        payment_link: document.getElementById('newUserPaymentLink').value,
        role: document.getElementById('newUserRole').value
    };
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([formData])
            .select();
            
        if (error) {
            alert('Error creating user: ' + error.message);
            return;
        }
        
        alert('User created successfully!');
        hideAddUserForm();
        loadUsersTable(); // Refresh table
        
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user');
    }
}

async function loadUsersTable() {
    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error loading users:', error);
            return;
        }
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.full_name || 'N/A'}</td>
                <td>${user.phone}</td>
                <td>${user.service_type || 'N/A'}</td>
                <td>${user.monthly_bill ? user.monthly_bill + ' BDT' : 'N/A'}</td>
                <td><span class="user-role">${user.role}</span></td>
                <td>
                    <button class="btn-primary" onclick="editUser('${user.id}')">Edit</button>
                    <button class="btn-secondary" onclick="viewUser('${user.id}')">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading users table:', error);
    }
}

function editUser(userId) {
    alert('Edit user: ' + userId);
    // Implement edit functionality
}

function viewUser(userId) {
    alert('View user: ' + userId);
    // Implement view functionality
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
