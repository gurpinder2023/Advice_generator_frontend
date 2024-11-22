// Check if the user is logged in and is an admin
const token = localStorage.getItem('token');

if (!token) {
    // Not logged in, redirect to login page
    window.location.href = 'index.html';
} else {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
    if (!payload.isAdmin) {
        // User is not an admin, redirect to index page
        window.location.href = 'main.html';
    }
}

// Fetch user requests data from the API
async function fetchUserRequests() {
    try {
        const response = await fetch(`${BASE_URL}/userRequests`, { // Adjust the URL as needed
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        populateRequestsTable(data);
    } catch (error) {
        console.error('Error fetching user requests data:', error);
    }
}

// Populate user request data in the table
function populateRequestsTable(requests) {
    const tableBody = document.getElementById('requests-table-body');
    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.name}</td>
            <td>${request.email}</td>
            
            <td>${request.requestCount || 0}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditModal('${request.email}', ${request.requestCount || 0})">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
// Open the modal to edit the request count
function openEditModal(email, currentCount) {
    document.getElementById('editEmail').value = email;
    document.getElementById('editRequestCount').value = currentCount;
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}



// Submit the updated request count
async function submitEditForm(event) {
    event.preventDefault();
    const email = document.getElementById('editEmail').value;
    const requestCount = parseInt(document.getElementById('editRequestCount').value);

    try {
        const response = await fetch(`${BASE_URL}/updateRequestCount`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, requestCount }),
        });

        if (response.ok) {
            alert('Request count updated successfully.');
            location.reload(); // Refresh to reflect changes
        } else {
            throw new Error('Failed to update request count');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the request count.');
    }
}

// Fetch API stats and populate the table
async function fetchApiStats() {
    try {
        const response = await fetch(`${BASE_URL}/apiStats`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const stats = await response.json();
            populateApiStatsTable(stats);
        } else {
            throw new Error('Failed to fetch API stats');
        }
    } catch (error) {
        console.error('Error fetching API stats:', error);
    }
}

// Populate API stats data in the table
function populateApiStatsTable(stats) {
    const tableBody = document.getElementById('api-stats-table-body');
    tableBody.innerHTML = ''; // Clear existing data
    stats.forEach((stat) => {
        const row = `
            <tr>
                <td>${stat.method}</td>
                <td>${stat.endpoint}</td>
                <td>${stat.requestCount || 0}</td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}

// Fetch data on page load
window.onload = async () => {
    await fetchUserRequests();
    await fetchApiStats();
};

// Attach event listener to the edit form
document.getElementById('editForm').addEventListener('submit', submitEditForm);