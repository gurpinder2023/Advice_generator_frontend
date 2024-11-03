document.addEventListener('DOMContentLoaded', async () => {
    const requestCount = await fetchRequestCount();
    document.getElementById('countValue').innerText = requestCount; // Display request count
    // Add event listener to the advice form
    document.getElementById("adviceForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const age = document.getElementById("age").value;
        const name = document.getElementById("name").value;
        const behavior = document.getElementById("behaviour").value; // Ensure this matches the HTML ID

        const advice = await getAdvice(age, name, behavior); // Fetch the advice
        document.getElementById("adviceResult").innerText = advice; // Display the advice
        document.getElementById("adviceResult").style.display = "block"; // Make the advice alert visible
    });
});

// Function to fetch request count
const fetchRequestCount = async () => {
    const token = localStorage.getItem('token'); // Get the stored token

    try {
        const response = await fetch('https://advice-generator-backend-5jgh.onrender.com/requestCount', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        const data = await response.json();

        if (response.ok) {
            if (data.warning) {
                // console.log(data.warning);
                showWarning(data.warning); // Display the warning message
            }
            return data.requestCount; // Return the request count
        } else {
            console.error(data.error || 'Failed to fetch request count');
            return 0; // Return 0 or some default value in case of an error
        }
    } catch (error) {
        console.error('Error fetching request count:', error);
        return 0; // Return 0 if there was an error
    }
};


// Function to fetch health advice
const getAdvice = async (age, name, behavior) => {
    const token = localStorage.getItem('token'); // Get the stored token

    // Show loading message
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // Show the loading message

    try {
        const response = await fetch('https://advice-generator-backend-5jgh.onrender.com/getAdvice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify({ age, name, behavior })
        });

        const data = await response.json();

         // Hide loading message once the response is received
         loadingMessage.style.display = 'none'; // Hide the loading message

        if (response.ok) {
            return data.advice; // Return the advice from the server
        } else {
            console.error(data.error || 'Failed to fetch advice');
            return 'An error occurred while fetching advice.'; // Default error message
        }
    } catch (error) {
        console.error('Error fetching advice:', error);
        return 'An error occurred while fetching advice.'; // Default error message
    }
};

const showWarning = (message) => {
    const warningElement = document.getElementById('warningMessage');
    warningElement.innerText = message; // Set the warning message text
    warningElement.style.display = 'block'; // Make the warning message visible
};
