function dbmToWatts(dbm) {
    return 10 ** ((dbm - 30) / 10);
  }
  
  function wattsToDbm(watts) {
    return 10 * Math.log10(watts) + 30;
  }
  
  function dbToRatio(db) {
    return 10 ** (db / 10);
  }
  
  function ratioToDb(ratio) {
    return 10 * Math.log10(ratio);
  }
  
  function realizarConversion() {
    const valor = parseFloat(document.getElementById("valorEntrada").value);
    const tipo = document.getElementById("tipoConversion").value;
    if (isNaN(valor)) return;
    let resultado;
    switch (tipo) {
      case "dbm_watts": resultado = `${valor} dBm = ${dbmToWatts(valor).toFixed(6)} W`; break;
      case "watts_dbm": resultado = `${valor} W = ${wattsToDbm(valor).toFixed(2)} dBm`; break;
      case "db_ratio": resultado = `${valor} dB = ${dbToRatio(valor).toFixed(4)} (relación)`; break;
      case "ratio_db": resultado = `${valor} (relación) = ${ratioToDb(valor).toFixed(2)} dB`; break;
    }
    document.getElementById("resultadoConversion").innerText = resultado;
  }
  
  function calcularPerdidaEspacioLibre() {
    const f = parseFloat(document.getElementById("frecuencia").value);
    const d = parseFloat(document.getElementById("distancia").value);
    if (isNaN(f) || isNaN(d)) return;
    const perdida = 32.45 + 20 * Math.log10(f) + 20 * Math.log10(d);
    document.getElementById("resultadoEnlace").innerText = `Pérdida: ${perdida.toFixed(2)} dB`;
  }
  
  function calcularAM() {
    const A_c = parseFloat(document.getElementById("am_carrier").value);
    const A_m = parseFloat(document.getElementById("am_mensaje").value);
    if (isNaN(A_c) || isNaN(A_m)) return;
    const m = A_m / A_c;
    document.getElementById("resultadoAM").innerText = `Índice de modulación AM: ${m.toFixed(2)}`;
  }
  
  function calcularFM() {
    const deltaF = parseFloat(document.getElementById("fm_desviacion").value);
    const B_m = parseFloat(document.getElementById("fm_mensaje").value);
    if (isNaN(deltaF) || isNaN(B_m)) return;
    const BW = 2 * (deltaF + B_m);
    document.getElementById("resultadoFM").innerText = `Ancho de banda FM: ${BW.toFixed(2)} Hz`;
  }
  
  function calcularBitRate() {
    const BW = parseFloat(document.getElementById("anchoBanda").value);
    const SNR = parseFloat(document.getElementById("snr").value);
    if (isNaN(BW) || isNaN(SNR)) return;
    const snrRatio = 10 ** (SNR / 10);
    const R = BW * Math.log2(1 + snrRatio);
    document.getElementById("resultadoBitRate").innerText = `Tasa máxima: ${R.toFixed(2)} bps`;
  }
  
  function calcularSymbolRate() {
    const M = parseFloat(document.getElementById("ordenModulacion").value);
    const Rb = parseFloat(document.getElementById("bitrate").value);
    if (isNaN(M) || isNaN(Rb)) return;
    const k = Math.log2(M);
    const Rs = Rb / k;
    document.getElementById("resultadoSymbolRate").innerText = `Tasa de símbolos: ${Rs.toFixed(2)} baudios`;
  }