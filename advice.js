document.addEventListener('DOMContentLoaded', () => {
    const requestCount = localStorage.getItem('requestCount') || 0; // Get request count or default to 0
    document.getElementById('countValue').innerText = requestCount; // Display request count
});