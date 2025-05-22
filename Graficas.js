let isPlaying = true;
let time = 0;
let animationSpeed = 5;
let animationId;
let binaryPattern = '10101010';

const configASK = {
type: 'line',
data: {
datasets: [{
    label: 'Señal ASK',
    borderColor: '#3C8D99',
    borderWidth: 2,
    pointRadius: 0,
    data: []
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
scales: {
    x: {
    type: 'linear',
    position: 'center',
    min: 0,
    max: 8,
    title: {
        display: true,
        text: 'Tiempo (s)',
        color: '#333'
    },
    grid: { color: 'rgba(0, 0, 0, 0.1)' },
    ticks: { color: '#333' }
    },
    y: {
    min: -2.5,
    max: 2.5,
    title: {
        display: true,
        text: 'Amplitud',
        color: '#333'
    },
    grid: { color: 'rgba(0, 0, 0, 0.1)' },
    ticks: { color: '#333' }
    }
},
plugins: {
    title: {
    display: true,
    text: 'Modulación ASK (Amplitude Shift Keying)',
    font: { size: 16 },
    color: '#333'
    },
    legend: { labels: { color: '#333' } }
}
}
};

const configFSK = {
type: 'line',
data: {
datasets: [{
    label: 'Señal FSK',
    borderColor: '#d9534f',
    borderWidth: 2,
    pointRadius: 0,
    data: []
}]
},
options: JSON.parse(JSON.stringify(configASK.options)) // copiar opciones de ASK
};

configFSK.options.plugins.title.text = 'Modulación FSK (Frequency Shift Keying)';

const configCombined = {
type: 'line',
data: {
datasets: [
    {
    label: 'ASK',
    borderColor: '#3C8D99',
    borderWidth: 2,
    pointRadius: 0,
    data: []
    },
    {
    label: 'FSK',
    borderColor: '#d9534f',
    borderWidth: 2,
    pointRadius: 0,
    data: []
    }
]
},
options: JSON.parse(JSON.stringify(configASK.options))
};

configCombined.options.plugins.title.text = 'Comparación ASK y FSK';

const ctxASK = document.getElementById('askChart').getContext('2d');
const ctxFSK = document.getElementById('fskChart').getContext('2d');
const ctxCombined = document.getElementById('combinedChart').getContext('2d');
const askChart = new Chart(ctxASK, configASK);
const fskChart = new Chart(ctxFSK, configFSK);
const combinedChart = new Chart(ctxCombined, configCombined);

function generateASKSignal(freq, amp, bits) {
const data = [];
const pointsPerBit = 100;
const bitDuration = 1;
const totalBits = bits.length;
const totalPoints = pointsPerBit * totalBits;
for (let i = 0; i <= totalPoints; i++) {
const x = (i / pointsPerBit) * bitDuration;
const currentBit = bits[Math.floor(x) % totalBits];
const y = currentBit === '1' ? amp * Math.sin(2 * Math.PI * freq * (x + time)) : 0;
data.push({ x, y });
}
return data;
}

function generateFSKSignal(freq1, freq2, amp, bits) {
const data = [];
const pointsPerBit = 100;
const bitDuration = 1;
const totalBits = bits.length;
const totalPoints = pointsPerBit * totalBits;

for (let i = 0; i <= totalPoints; i++) {
const x = (i / pointsPerBit) * bitDuration;
const currentBit = bits[Math.floor(x) % totalBits];
const freq = currentBit === '1' ? freq1 : freq2;
const y = amp * Math.sin(2 * Math.PI * freq * (x + time));
data.push({ x, y });
}
return data;
}

function animate() {
binaryPattern = document.getElementById("binaryPattern").value || "10101010";
const freqASK = parseFloat(document.getElementById("frecuenciaASK").value);
const ampASK = parseFloat(document.getElementById("amplitudASK").value);
const freqFSK1 = parseFloat(document.getElementById("frecuenciaFSK1").value);
const freqFSK2 = parseFloat(document.getElementById("frecuenciaFSK2").value);

askChart.data.datasets[0].data = generateASKSignal(freqASK, ampASK, binaryPattern);
fskChart.data.datasets[0].data = generateFSKSignal(freqFSK1, freqFSK2, 1, binaryPattern);
combinedChart.data.datasets[0].data = generateASKSignal(freqASK, ampASK, binaryPattern);
combinedChart.data.datasets[1].data = generateFSKSignal(freqFSK1, freqFSK2, 1, binaryPattern);

askChart.update();
fskChart.update();
combinedChart.update();

time += 0.01 * animationSpeed;

if (isPlaying) animationId = requestAnimationFrame(animate);
}

document.getElementById("frecuenciaASK").addEventListener("input", function () {
document.getElementById("frecuenciaASKValue").textContent = this.value;
});
document.getElementById("amplitudASK").addEventListener("input", function () {
document.getElementById("amplitudASKValue").textContent = this.value;
});
document.getElementById("frecuenciaFSK1").addEventListener("input", function () {
document.getElementById("frecuenciaFSK1Value").textContent = this.value;
});
document.getElementById("frecuenciaFSK2").addEventListener("input", function () {
document.getElementById("frecuenciaFSK2Value").textContent = this.value;
});
document.getElementById("velocidadAnimacion").addEventListener("input", function () {
animationSpeed = parseInt(this.value);
document.getElementById("velocidadAnimacionValue").textContent = this.value;
});
document.getElementById("playPauseBtn").addEventListener("click", function () {
isPlaying = !isPlaying;
this.textContent = isPlaying ? "⏸ Pausar" : "▶️ Reanudar";
if (isPlaying) animate();
});
document.getElementById("resetBtn").addEventListener("click", function () {
time = 0;
animate();
});

animate();