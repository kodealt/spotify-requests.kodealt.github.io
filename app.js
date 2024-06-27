// Your client ID from Spotify
const CLIENT_ID = 'fe08728ab28b4094a989f511c9b2ebd5';
const REDIRECT_URI = window.location.href;

// When the user clicks the login button, redirect to Spotify's authorization page
document.getElementById('login-btn').addEventListener('click', () => {
    const scopes = 'user-read-recently-played';
    window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
});

// Function to get the access token from the URL hash
function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Function to fetch the user's recently played tracks
async function getRecentlyPlayed(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.items;
}

// Function to render the chart
function renderChart(playCounts) {
    const ctx = document.getElementById('listening-chart').getContext('2d');
    const labels = Object.keys(playCounts);
    const data = Object.values(playCounts);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Play Count',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Check if the user is redirected back with an access token
window.onload = async () => {
    const token = getAccessToken();
    if (token) {
        const tracks = await getRecentlyPlayed(token);
        const playCounts = {};

        tracks.forEach(item => {
            const trackName = item.track.name;
            playCounts[trackName] = (playCounts[trackName] || 0) + 1;
        });

        renderChart(playCounts);
    }
};
