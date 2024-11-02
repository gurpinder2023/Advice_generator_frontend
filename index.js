async function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
  
    const data = await response.json();
    if (response.ok) {alert('Registration successful!')
        window.location.href = '/login.html';}

    else alert(data.error);
  }
  


//   login functionality
// app.js

async function submitLoginForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the email and password values from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the login endpoint
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Parse the response
        const data = await response.json();

        if (response.ok) {
            // Login successful
            alert('Login successful! Redirecting to dashboard...');
            // Store the JWT in localStorage or cookies (for demonstration purposes)
            localStorage.setItem('token', data.token);
            // Redirect to the dashboard or another page
            // Fetch the request count and store it in localStorage
            const requestCount = await fetchRequestCount();
            localStorage.setItem('requestCount', requestCount);
            // Redirect based on the isAdmin attribute
            if (data.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
            // Fetch the request count
         // Change to your desired redirect page
        } else {
            // Handle errors (e.g., invalid credentials)
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again later.');
    }
}

// Function to fetch request count
const fetchRequestCount = async () => {
    const token = localStorage.getItem('token'); // Get the stored token

    const response = await fetch('http://localhost:3000/requestCount', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
    });

    const data = await response.json();

    if (response.ok) {
        return data.requestCount; // Return the request count
    } else {
        console.error(data.error || 'Failed to fetch request count');
        return 0; // Return 0 or some default value in case of an error
    }
};

// Attach the submit event listener to the login form
document.getElementById('loginForm').addEventListener('submit', submitLoginForm);
document.addEventListener('DOMContentLoaded', () => {
    const requestCount = localStorage.getItem('requestCount') || 0; // Get request count or default to 0
    document.getElementById('requestCount').innerText = requestCount; // Display request count
});