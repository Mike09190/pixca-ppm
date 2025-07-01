const btn_plot = document.getElementById("btn_plot");
btn_plot.addEventListener("click", plot);
const station = document.getElementById("plantel");
const sel_fecha = document.getElementById("month_input");

let currentStep = 1; 
let sta_global;

function get_csv(){

  sta_global = station.value; 
  const selectedDate = sel_fecha.value;
  console.log(sta_global, selectedDate);

  const url = 'https://ruoa.unam.mx:8042/pm_api&sid='+ sid + '&date='+ date;
  var a = document.getElementById('csvURL');
  a.href=url;
}

hideButtons();

function hideButtons() {
  station.style.display = "none";
  
  sel_fecha.style.display = "none";
  btn_plot.style.display = "none";
  document.getElementById("btn_download").style.display = "none";

  switch (currentStep) {
    case 1:
      station.style.display = "block";
      station.disabled = false; 
      break;
    case 2:
      station.style.display = "block";
      station.disabled = true; 
      sel_fecha.style.display="block";
      sel_fecha.disabled = false;
      break;
    case 3:
      station.style.display = "block";
      station.disabled = true; 
      sel_fecha.style.display="block"
      sel_fecha.disabled = true; 

      btn_plot.style.display = "block";
      document.getElementById("btn_download").style.display = "block";
      get_csv();
      break;
  }
}

station.addEventListener("change", () => {
  console.log('Estación cambiada:', station.value);
  // Limpia cualquier selección de mes anterior
  sta_global =station.value
  month_input.value = '';
  if (sta_global && sta_global !== "a") { // Asegúrate de que no sea la opción "Selecciona"
    // Establecer el rango fijo y dinámico
    const min_date = '2023-01-01'; // Límite mínimo fijo

    // Límite máximo: la fecha actual
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son base 0, por eso +1
    const day = String(today.getDate()).padStart(2, '0');
    const max_date = `${year}-${month}-${day}`;

    sel_fecha.min = min_date;
    sel_fecha.max = max_date;
    console.log(`Rango del input de fecha establecido de ${min_date} a ${max_date}`);
    currentStep = 2; // Pasa al paso 2 (selección de fecha)
  } else {
      sel_fecha.disabled = true; // Deshabilita si no hay estación seleccionada
      sel_fecha.min = "";
      sel_fecha.max = "";
      currentStep = 1;
  }
  hideButtons();
});

// EVENT LISTENER DEL INPUT DE FECHA (La lógica de validación se mantiene)
sel_fecha.addEventListener("change", async () => {
  console.log('Fecha cambiada:', sel_fecha.value);
  const selectedDate = sel_fecha.value;
  // Extrae año, mes y día de la fecha seleccionada
  const [year, month, day] = selectedDate.split('-');

  if (sta_global && selectedDate) { // Asegúrate de que haya estación y fecha seleccionada
    try {
      // Obtener los días disponibles para el mes seleccionado usando get_days de plot.js
      const availableDays = await get_days(sta_global, month);
      // Validar si el día seleccionado está entre los días disponibles
      if (availableDays && availableDays.includes(day)) {
        console.log("La fecha seleccionada es válida.");
        currentStep = 3; // Pasa al paso 3 (listo para graficar/descargar)
      } else {
        alert(`La fecha seleccionada (${selectedDate}) no tiene datos disponibles para esta estación. Por favor, selecciona una fecha válida.`);
        sel_fecha.value = ''; // Limpia la selección inválida
        currentStep = 2; // Permanece en el paso de selección de fecha
      }
    } catch (error) {
      console.error("Error al validar la fecha:", error);
      alert("Error al validar la fecha. Por favor, inténtalo de nuevo.");
      sel_fecha.value = '';
      currentStep = 2;
    }
  } else {
      currentStep = 2; // Si la estación o la fecha no están seleccionadas por algún motivo
  }
  hideButtons();
});
