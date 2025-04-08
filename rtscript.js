// See ChatGPT Real-time Data and Forms to change the below based on how you code the io platform

document.addEventListener('DOMContentLoaded', () => {
    // === Insect DOM Elements and Chart ===
    const insectCountElement = document.getElementById('insectCount');
    const insectCtx = document.getElementById('insectChart')?.getContext('2d');
    const insectChart = new Chart(insectCtx, {
        type: 'line',
        data: {
         labels: [],
         datasets: [
                {
                    label: 'Average Ant Count',
                    data: [],
                    borderColor: 'darkgreen',
                    fill: false
                }
         ]
        }
    });
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
            const response = await fetch('https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds/last.json?api_key=YOUR_READ_API_KEY'); //or change endpoint
            const data = await response.json();
    
            const parsedData = {
                temperature: parseFloat(data.field1),
                humidity: parseFloat(data.field2),
                co2: parseFloat(data.field3),   // skip if not used
                pm: parseFloat(data.field4),
                noise: parseFloat(data.field5)
            };
    
            const timestamp = new Date().toLocaleTimeString();
    
            if (temperatureElement) temperatureElement.innerText = `${parsedData.temperature} °C`;
            if (humidityElement) humidityElement.innerText = `${parsedData.humidity} %`;
            if (co2Element) co2Element.innerText = `${parsedData.co2 || 'N/A'} ppm`;
            if (pmElement) pmElement.innerText = `${parsedData.pm} µm`;
            if (noiseElement) noiseElement.innerText = `${parsedData.noise} dB`;
    
            sensorChart.data.labels.push(timestamp);
            sensorChart.data.datasets[0].data.push(parsedData.temperature);
            sensorChart.data.datasets[1].data.push(parsedData.humidity);
            sensorChart.data.datasets[2].data.push(parsedData.co2 || null);
            sensorChart.data.datasets[3].data.push(parsedData.pm);
            sensorChart.data.datasets[4].data.push(parsedData.noise);
            
            // limit chart to 50 data points
            if (sensorChart.data.labels.length > 50) {
                sensorChart.data.labels.shift();
                sensorChart.data.datasets.forEach(ds => ds.data.shift());
            }            

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
    
    // === Load Insect History from JSON ===
    fetch('data/insect_history.json')
    .then(response => response.json())
    .then(history => {
        if (history && history.length > 0) {
            // Update chart
            history.forEach(entry => {
                const ts = entry.timestamp; // e.g. "04062136"
                const month = parseInt(ts.slice(0, 2), 10);
                const day = parseInt(ts.slice(2, 4), 10);
                const hour = parseInt(ts.slice(4, 6), 10);
                const minute = ts.slice(6, 8);

                const ampm = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 === 0 ? 12 : hour % 12;

                const label = `${new Date(2024, month - 1, day).toLocaleString('en-US', { month: 'short' })} ${day} ${hour12}:${minute} ${ampm}`;

                insectChart.data.labels.push(label);
                insectChart.data.datasets[0].data.push(entry.average);
            });

            insectChart.update();

            // Update latest count
            const latest = history[history.length - 1];
            if (insectCountElement) {
                insectCountElement.innerText = `${latest.average} (±${latest.std_dev})`;
            }
        }
    })
    .catch(err => {
        console.error("Failed to load insect data:", err);
    });


    // Update data every 5 seconds
    setInterval(fetchSensorData, 5000);


});

document.addEventListener('DOMContentLoaded', function () {
    function loadImages(folder, galleryId) {
        const gallery = document.getElementById(galleryId);
        gallery.innerHTML = ""; // Clear current content

        const images = [
            `${folder}/image1.jpg`,
            `${folder}/image2.jpg`,
            `${folder}/image3.jpg`
        ]; // Add image filenames as needed

        images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            gallery.appendChild(img);
        });
    }

    function formatDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toLocaleDateString();
    }

    document.getElementById('yesterdayDate').innerText = formatDate(1);
    document.getElementById('todayDate').innerText = formatDate(0);

    loadImages('assets/images/photos of yesterday', 'yesterdayGallery');
    loadImages('assets/images/photos of today', 'todayGallery');
});
