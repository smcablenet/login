// User Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadUserData();
});

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }
    
    document.getElementById('userName').textContent = user.full_name || user.phone;
    currentUserId = user.id;
}

let currentUserId = null;

async function loadUserData() {
    await loadUserOverview();
    await loadUserBills();
    await loadUserProfile();
}

async function loadUserOverview() {
    try {
        // Get current user's bills
        const { data: bills, error } = await supabase
            .from('bills')
            .select('*')
            .eq('user_id', currentUserId)
            .order('month', { ascending: false });
            
        if (error) throw error;
        
        // Calculate overview stats
        const currentBill = bills.find(bill => bill.status === 'unpaid');
        const totalDue = bills
            .filter(bill => bill.status === 'unpaid')
            .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);
            
        document.getElementById('currentBill').textContent = 
            currentBill ? currentBill.amount + ' BDT' : '0 BDT';
        document.getElementById('dueAmount').textContent = totalDue + ' BDT';
        
    } catch (error) {
        console.error('Error loading user overview:', error);
    }
}

async function loadUserBills() {
    try {
        const { data: bills, error } = await supabase
            .from('bills')
            .select('*')
            .eq('user_id', currentUserId)
            .order('month', { ascending: false });
            
        if (error) throw error;
        
        const tbody = document.getElementById('billsTableBody');
        tbody.innerHTML = '';
        
        bills.forEach(bill => {
            const row = document.createElement('tr');
            const billDate = new Date(bill.month);
            const monthYear = billDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
            
            row.innerHTML = `
                <td>${bill.bill_number || 'N/A'}</td>
                <td>${monthYear}</td>
                <td>${bill.amount} BDT</td>
                <td>${new Date(bill.month).toLocaleDateString()}</td>
                <td>
                    <span class="${bill.status === 'paid' ? 'user-role' : 'btn-logout'}">
                        ${bill.status}
                    </span>
                </td>
                <td>
                    ${bill.status === 'unpaid' ? 
                        `<button class="btn-primary" onclick="payBill('${bill.id}')">Pay Now</button>` : 
                        'Paid'
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading user bills:', error);
    }
}

async function loadUserProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        const profileHtml = `
            <div class="form-row">
                <div class="form-group">
                    <label><strong>User ID:</strong></label>
                    <p>${user.user_id}</p>
                </div>
                <div class="form-group">
                    <label><strong>Full Name:</strong></label>
                    <p>${user.full_name || 'N/A'}</p>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label><strong>Phone Number:</strong></label>
                    <p>${user.phone}</p>
                </div>
                <div class="form-group">
                    <label><strong>Service Type:</strong></label>
                    <p>${user.service_type || 'N/A'}</p>
                </div>
            </div>
            <div class="form-group">
                <label><strong>Address:</strong></label>
                <p>${user.address || 'N/A'}</p>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label><strong>Monthly Bill:</strong></label>
                    <p>${user.monthly_bill ? user.monthly_bill + ' BDT' : 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label><strong>Account Status:</strong></label>
                    <p>Active</p>
                </div>
            </div>
            ${user.payment_link ? `
                <div class="form-group">
                    <label><strong>Payment Link:</strong></label>
                    <p><a href="${user.payment_link}" target="_blank">${user.payment_link}</a></p>
                </div>
            ` : ''}
        `;
        
        document.getElementById('userProfileInfo').innerHTML = profileHtml;
        
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function payBill(billId) {
    alert('Payment functionality for bill: ' + billId);
    // Implement payment integration
}

// Navigation (same as admin)
function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('section-active');
        section.classList.add('section-hidden');
    });
    
    document.getElementById(sectionId).classList.remove('section-hidden');
    document.getElementById(sectionId).classList.add('section-active');
    
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('nav-active');
    });
    event.target.classList.add('nav-active');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}
