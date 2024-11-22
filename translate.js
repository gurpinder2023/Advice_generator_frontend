document.addEventListener('DOMContentLoaded', async () => {
    const requestCount = await fetchRequestCount();
    document.getElementById('countValue').innerText = requestCount; // Display request count

    // Add event listener to the translate form
    document.getElementById("translateForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const text = document.getElementById("text").value;
        const language = document.getElementById("language").value;

        const translation = await getTranslation(text, language); // Fetch the translation
        document.getElementById("translationResult").innerText = translation; // Display the translation
        document.getElementById("translationResult").style.display = "block"; // Make the translation alert visible
    });
});

// Function to fetch request count
const fetchRequestCount = async () => {
    const token = localStorage.getItem('token'); // Get the stored token

    try {
        const response = await fetch(`${BASE_URL}/requestCount`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
        });

        const data = await response.json();

        if (response.ok) {
            if (data.warning) {
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

// Function to fetch translation
const getTranslation = async (text, language) => {
    const token = localStorage.getItem('token'); // Get the stored token

    // Show loading message
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.style.display = 'block'; // Show the loading message

    try {
        const response = await fetch(`${BASE_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify({ text, language })
        });

        const data = await response.json();

        // Hide loading message once the response is received
        loadingMessage.style.display = 'none'; // Hide the loading message

        if (response.ok) {
            return data.translation; // Return the translation from the server
        } else {
            console.error(data.error || 'Failed to fetch translation');
            return `An error occurred while fetching the translation. ${data.error}`; // Default error message
        }
    } catch (error) {
        console.error('Error fetching translation:', error);
        return `An error occurred while fetching the translation. ${error}`; // Default error message
    }
};

const showWarning = (message) => {
    const warningElement = document.getElementById('warningMessage');
    warningElement.innerText = message; // Set the warning message text
    warningElement.style.display = 'block'; // Make the warning message visible
};
