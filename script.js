document.addEventListener('DOMContentLoaded', () => {
    // Real-Time Data Elements
    const temperatureElement = document.querySelector('.conditions-container p:nth-child(2) span');
    const humidityElement = document.querySelector('.conditions-container p:nth-child(3) span');
    const co2Element = document.querySelector('.conditions-container p:nth-child(4) span');
    const pmElement = document.querySelector('.conditions-container p:nth-child(5) span');
    const noiseElement = document.querySelector('.conditions-container p:nth-child(6) span');

    const chartElement = document.getElementById('sensorChart')?.getContext('2d');

    // Initialize Chart.js for data visualization
    const sensorChart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: [], // Timestamps
            datasets: [
                { label: 'Temperature (°C)', data: [], borderColor: 'red', fill: false },
                { label: 'Humidity (%)', data: [], borderColor: 'blue', fill: false },
                { label: 'CO₂ (ppm)', data: [], borderColor: 'green', fill: false },
                { label: 'Particulate Matter (µm)', data: [], borderColor: 'purple', fill: false },
                { label: 'Noise (dB)', data: [], borderColor: 'orange', fill: false }
            ]
        }
    });

    // Function to fetch and update sensor data (mock data for now)
    async function fetchSensorData() {
        try {
            const response = await fetch('https://api.example.com/sensor-data'); // Replace with real endpoint
            const data = await response.json();

            const timestamp = new Date().toLocaleTimeString();

            // Update HTML values
            if (temperatureElement) temperatureElement.innerText = `${data.temperature} °C`;
            if (humidityElement) humidityElement.innerText = `${data.humidity} %`;
            if (co2Element) co2Element.innerText = `${data.co2} ppm`;
            if (pmElement) pmElement.innerText = `${data.pm} µm`;
            if (noiseElement) noiseElement.innerText = `${data.noise} dB`;

            // Update Chart
            sensorChart.data.labels.push(timestamp);
            sensorChart.data.datasets[0].data.push(data.temperature);
            sensorChart.data.datasets[1].data.push(data.humidity);
            sensorChart.data.datasets[2].data.push(data.co2);
            sensorChart.data.datasets[3].data.push(data.pm);
            sensorChart.data.datasets[4].data.push(data.noise);

            sensorChart.update();
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            if (temperatureElement) temperatureElement.innerText = 'N/A';
            if (humidityElement) humidityElement.innerText = 'N/A';
            if (co2Element) co2Element.innerText = 'N/A';
            if (pmElement) pmElement.innerText = 'N/A';
            if (noiseElement) noiseElement.innerText = 'N/A';
        }
    }

    // Update data every 5 seconds
    setInterval(fetchSensorData, 5000);
});
