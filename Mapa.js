var map = L.map('map').setView([0, 0], 2);
var antena1 = null;
var antena2 = null;
var line = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var antenaIcon = L.divIcon({
className: 'antena-icon',
iconSize: [20, 20]
});

function calcularDistancia(lat1, lon1, lat2, lon2) {
var R = 6371;
var dLat = (lat2 - lat1) * Math.PI / 180;
var dLon = (lon2 - lon1) * Math.PI / 180;
var a =
Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
Math.sin(dLon / 2) * Math.sin(dLon / 2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
var d = R * c;
return d;
}

function calcularPresupuestoEnlace(distancia) {
if (distancia === 0) return;

var potenciaTx = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
var gananciaTx = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
var gananciaRx = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
var perdidaCable = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
var margenDesvanecimiento = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

var frecuenciaMHz = 2400;
var perdidaEspacioLibre = 20 * Math.log10(distancia) + 20 * Math.log10(frecuenciaMHz) + 32.44;

var potenciaRecibida = potenciaTx + gananciaTx + gananciaRx - perdidaEspacioLibre - perdidaCable - margenDesvanecimiento;

var valoresHTML = `
<ul>
    <li>🔸 Potencia Transmitida: <strong>${potenciaTx} dBm</strong></li>
    <li>🔸 Ganancia Antena TX: <strong>${gananciaTx} dB</strong></li>
    <li>🔸 Ganancia Antena RX: <strong>${gananciaRx} dB</strong></li>
    <li>🔸 Pérdida por espacio libre: <strong>${perdidaEspacioLibre.toFixed(2)} dB</strong></li>
    <li>🔸 Pérdidas por cable y conectores: <strong>${perdidaCable} dB</strong></li>
    <li>🔸 Margen de desvanecimiento: <strong>${margenDesvanecimiento} dB</strong></li>
</ul>
`;

var resultadoHTML = `
<p><strong>Resultado:</strong></p>
<p>Potencia recibida = ${potenciaTx} + ${gananciaTx} + ${gananciaRx} - ${perdidaEspacioLibre.toFixed(2)} - ${perdidaCable} - ${margenDesvanecimiento}</p>
<p><strong>Potencia recibida final: ${potenciaRecibida.toFixed(2)} dBm</strong></p>
`;

var estado = potenciaRecibida > -85
? `<p class="estado-bueno">✅ Señal suficiente para comunicación.</p>`
: `<p class="estado-debil">⚠️ Señal débil, podría haber fallos en la comunicación.</p>`;

document.getElementById('valoresPresupuesto').innerHTML = valoresHTML;
document.getElementById('resultadoPresupuesto').innerHTML = resultadoHTML;
document.getElementById('estadoPresupuesto').innerHTML = estado;
}

function actualizarLinea() {
if (antena1 && antena2) {
if (line) {
    map.removeLayer(line);
}

line = L.polyline([antena1.getLatLng(), antena2.getLatLng()], {
    color: '#d9534f',
    weight: 3,
    dashArray: '5, 5'
}).addTo(map);

var lat1 = antena1.getLatLng().lat;
var lon1 = antena1.getLatLng().lng;
var lat2 = antena2.getLatLng().lat;
var lon2 = antena2.getLatLng().lng;
var distancia = calcularDistancia(lat1, lon1, lat2, lon2);

document.getElementById('distanceInfo').textContent =
    `Distancia: ${distancia.toFixed(2)} km`;

calcularPresupuestoEnlace(distancia);
map.fitBounds([antena1.getLatLng(), antena2.getLatLng()]);
}
}

function reiniciarMapa() {
if (antena1) map.removeLayer(antena1);
if (antena2) map.removeLayer(antena2);
if (line) map.removeLayer(line);
antena1 = null;
antena2 = null;
line = null;
document.getElementById('distanceInfo').textContent = 'Distancia: 0 km';
document.getElementById('valoresPresupuesto').innerHTML = '';
document.getElementById('resultadoPresupuesto').innerHTML = '';
document.getElementById('estadoPresupuesto').innerHTML = '';
map.setView([0, 0], 2);
}

function regresarMenu() {
window.location.href = "index.html";
}

map.on('click', function (e) {
if (!antena1) {
antena1 = L.marker(e.latlng, { icon: antenaIcon })
    .addTo(map)
    .bindPopup("Antena 1")
    .openPopup();
} else if (!antena2) {
antena2 = L.marker(e.latlng, { icon: antenaIcon })
    .addTo(map)
    .bindPopup("Antena 2")
    .openPopup();
actualizarLinea();
} else {
map.removeLayer(antena2);
antena2 = L.marker(e.latlng, { icon: antenaIcon })
    .addTo(map)
    .bindPopup("Antena 2")
    .openPopup();
actualizarLinea();
}
});

document.getElementById('resetBtn').addEventListener('click', reiniciarMapa);
document.getElementById('backBtn').addEventListener('click', regresarMenu);