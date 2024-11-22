async function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
  
    const data = await response.json();
    if (response.ok) {alert('Registration successful!')
        window.location.href = '/index.html';}

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
        const response = await fetch(`${BASE_URL}/login`, {
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
            
            if (data.isAdmin) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'landing.html';
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


// Attach the submit event listener to the login form
document.getElementById('loginForm').addEventListener('submit', submitLoginForm);
