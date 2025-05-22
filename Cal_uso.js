const DOM = {
potencia: () => document.getElementById("potencia"),
unidad: () => document.getElementById("unidad"),
explicacion: () => document.getElementById("explicacionPotencia"),
potenciaConvertida: () => document.getElementById("potenciaConvertida"),
cantidadCambios: () => document.getElementById("cantidadCambios"),
contenedorCambios: () => document.getElementById("contenedorCambios"),
potenciaFinal: () => document.getElementById("potenciaFinal"),
ecuacionesContainer: () => document.getElementById("ecuaciones-container"),
graficodBm: () => document.getElementById("graficoPotencia_dBm"),
graficomW: () => document.getElementById("graficoPotencia_mW")
};

const Graficos = {
dBm: null,
mW: null,

inicializar: function() {
    this.destruir();
},

actualizar: function(pi_dBm, pf_dBm, pi_mW, pf_mW) {
    this.destruir();
    
    const configdBm = this._crearConfiguracion("dBm", ["Inicial", "Final"], [pi_dBm, pf_dBm], ["blue", "green"]);
    const configmW = this._crearConfiguracion("mW", ["Inicial", "Final"], [pi_mW, pf_mW], ["red", "orange"]);
    
    this.dBm = new Chart(DOM.graficodBm().getContext("2d"), configdBm);
    this.mW = new Chart(DOM.graficomW().getContext("2d"), configmW);
},

_crearConfiguracion: function(label, labels, data, colores) {
    return {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: colores,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${label}: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        }
    };
},

destruir: function() {
    if (this.dBm) this.dBm.destroy();
    if (this.mW) this.mW.destroy();
}
};

// Funciones de utilidad
const Utils = {
mostrarElemento: (elemento, mostrar = true) => {
    elemento.classList.toggle("oculto", !mostrar);
},

validarNumero: (valor, min = -Infinity, max = Infinity) => {
    const num = parseFloat(valor);
    return !isNaN(num) && num >= min && num <= max;
},

calcularPotencia: {
    dBmToMw: (dBm) => Math.pow(10, dBm / 10),
    mWToDBm: (mW) => 10 * Math.log10(mW)
}
};

// Funciones principales
function mostrarExplicacion() {
const potencia = DOM.potencia().value;
const unidad = DOM.unidad().value;
const explicacion = DOM.explicacion();

if (!potencia) {
    Utils.mostrarElemento(explicacion, false);
    return;
}

const texto = unidad === "dBm" 
    ? "dBm es una unidad logarítmica que expresa potencia en decibelios relativa a 1 milivatio." 
    : "mW (miliwatts) es una unidad lineal de potencia, donde 1 mW = 0 dBm.";

explicacion.textContent = texto;
Utils.mostrarElemento(explicacion);
}

function convertirPotencia() {
const potencia = DOM.potencia().value;
const unidad = DOM.unidad().value;
const resultado = DOM.potenciaConvertida();

if (!Utils.validarNumero(potencia)) return;

const valor = parseFloat(potencia);
let textoResultado;

if (unidad === "dBm") {
    const mW = Utils.calcularPotencia.dBmToMw(valor);
    textoResultado = `Potencia en mW: ${mW.toFixed(4)} mW`;
} else {
    const dBm = Utils.calcularPotencia.mWToDBm(valor);
    textoResultado = `Potencia en dBm: ${dBm.toFixed(2)} dBm`;
}

resultado.textContent = textoResultado;
Utils.mostrarElemento(resultado);
}

function generarCampos() {
const cantidad = DOM.cantidadCambios().value;
const contenedor = DOM.contenedorCambios();

if (!Utils.validarNumero(cantidad, 1, 20)) return;

contenedor.innerHTML = "";
const fragment = document.createDocumentFragment();

for (let i = 0; i < parseInt(cantidad); i++) {
    const div = document.createElement("div");
    div.className = "input-group";
    
    const label = document.createElement("label");
    label.textContent = `Ganancia/Pérdida ${i + 1} (dB):`;
    label.htmlFor = `ganancia-${i}`;
    
    const input = document.createElement("input");
    input.type = "number";
    input.id = `ganancia-${i}`;
    input.className = "gananciaPerdida";
    input.step = "0.01";
    input.placeholder = "Ejemplo: 3.5 o -2.3";
    
    div.appendChild(label);
    div.appendChild(input);
    fragment.appendChild(div);
}

contenedor.appendChild(fragment);
}

function calcularPotenciaFinal() {
const potencia = DOM.potencia().value;
const unidad = DOM.unidad().value;

if (!Utils.validarNumero(potencia, 0)) return;

const valor = parseFloat(potencia);
let potencia_dBm, potenciaInicial_mW;

if (unidad === "mW") {
    potencia_dBm = Utils.calcularPotencia.mWToDBm(valor);
    potenciaInicial_mW = valor;
} else {
    potencia_dBm = valor;
    potenciaInicial_mW = Utils.calcularPotencia.dBmToMw(valor);
}

const { totalGanancia, pasos } = calcularGanancias();
const potenciaFinal_dBm = potencia_dBm + totalGanancia;
const potenciaFinal_mW = Utils.calcularPotencia.dBmToMw(potenciaFinal_dBm);

mostrarResultados(potenciaFinal_dBm, potenciaFinal_mW);
Graficos.actualizar(potencia_dBm, potenciaFinal_dBm, potenciaInicial_mW, potenciaFinal_mW);
mostrarProcedimiento(potenciaInicial_mW, potenciaFinal_mW, totalGanancia, pasos);
}

function calcularGanancias() {
const inputs = document.querySelectorAll(".gananciaPerdida");
let totalGanancia = 0;
const pasos = [];

inputs.forEach((input, index) => {
    const valor = input.value;
    if (Utils.validarNumero(valor)) {
        const num = parseFloat(valor);
        totalGanancia += num;
        pasos.push(`Paso ${index + 1}: ${num > 0 ? 'Ganancia' : 'Pérdida'} de ${Math.abs(num).toFixed(2)} dB`);
    }
});

return { totalGanancia, pasos };
}

function mostrarResultados(dBm, mW) {
const resultado = DOM.potenciaFinal();
resultado.innerHTML = `
    <p><strong>Potencia Final:</strong> ${dBm.toFixed(2)} dBm</p>
    <p><strong>Equivalente en mW:</strong> ${mW.toFixed(4)} mW</p>
    <p><strong>Relación de Potencia:</strong> ${(mW / Utils.calcularPotencia.dBmToMw(0)).toFixed(2)} veces 1 mW</p>
`;
Utils.mostrarElemento(resultado);
}

function mostrarProcedimiento(pIni, pFin, ganancia, pasos) {
const cont = DOM.ecuacionesContainer();
cont.innerHTML = `
    <article class="procedimiento">
        <h3>Procedimiento de Cálculo</h3>
        <section>
            <h4>Datos Iniciales</h4>
            <p>Potencia Inicial: ${pIni.toFixed(4)} mW</p>
        </section>
        
        <section>
            <h4>Etapas de Ganancia/Pérdida</h4>
            ${pasos.map(paso => `<p>${paso}</p>`).join('')}
            <p>Ganancia/Pérdida Total: ${ganancia.toFixed(2)} dB</p>
        </section>
        
        <section>
            <h4>Cálculo Final</h4>
            <p>Fórmula: P<sub>final</sub> = P<sub>inicial</sub> × 10<sup>(Ganancia/10)</sup></p>
            <p>Desarrollo: ${pIni.toFixed(4)} × 10<sup>(${ganancia.toFixed(2)}/10)</sup> = ${pFin.toFixed(4)} mW</p>
            <p>Conversión a dBm: 10 × log<sub>10</sub>(${pFin.toFixed(4)}) = ${Utils.calcularPotencia.mWToDBm(pFin).toFixed(2)} dBm</p>
        </section>
    </article>
`;
}

function mostrarExplicacion() {
const potencia = document.getElementById("potencia").value;
const unidad = document.getElementById("unidad").value;
const explicacion = document.getElementById("explicacionPotencia");

if (potencia && unidad) {
    explicacion.textContent = unidad === "dBm" 
    ? `Potencia de ${potencia} dBm (equivalente a ${Math.pow(10, potencia/10).toFixed(2)} mW)`
    : `Potencia de ${potencia} mW (equivalente a ${(10 * Math.log10(potencia)).toFixed(2)} dBm)`;
    explicacion.classList.remove("oculto");
} else {
    explicacion.classList.add("oculto");
}
}
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('btnTelecom').addEventListener('click', function() {
    window.location.href = 'telecomunicacion.html';
});
});

function reiniciarCalculadora() {
DOM.potencia().value = "";
DOM.potenciaConvertida().textContent = "";
DOM.potenciaFinal().textContent = "";
DOM.contenedorCambios().innerHTML = "";
DOM.cantidadCambios().value = "";
DOM.explicacion().textContent = "";
Utils.mostrarElemento(DOM.explicacion(), false);
Utils.mostrarElemento(DOM.potenciaConvertida(), false);
Utils.mostrarElemento(DOM.potenciaFinal(), false);
Graficos.destruir();
DOM.ecuacionesContainer().innerHTML = "";
}

document.addEventListener('DOMContentLoaded', () => {
Graficos.inicializar();
});