const btn_plot = document.getElementById("btn_plot"); //declarar los botones y cuadros
btn_plot.addEventListener("click", plot);
const station = document.getElementById("plantel");
const sel_year = document.getElementById("year");e
const sel_month = document.getElementById("mes");
const sel_fecha = document.getElementById("Fecha");
const btn_download = document.getElementById("btn_download");


const calendar = document.getElementById("availability-calendar"); //calendario
if (!calendar) {
  console.error("No se encontró el contenedor #availability-calendar");
}

function get_csv(){ //extraer el api
  const sta = document.getElementById("plantel");
  sid=sta.value;

  const dte = document.getElementById("Fecha");
  date = dte.value;
  console.log( sid, date);

  const url = 'https://ruoa.unam.mx:8042/pm_api&sid='+ sid + '&date='+ date;
  var a = document.getElementById('csvURL');
  a.href=url;
  
}
/*
document.addEventListener('DOMContentLoaded', function() {
    const selectEstacion = document.getElementById('plantel');
    const infoBox = document.getElementById('info_box');
    selectEstacion.addEventListener('change', function() {
        const selectedValue = this.value;
        fetch('estaciones.txt') // Asegúrate de que la ruta sea correcta
            .then(response => response.text())
            .then(data => {
                const estaciones = data.split('\n');
                const estacion = estaciones.find(est => est.split('|')[0] === selectedValue);
                if (estacion) {
                    const [id, nombre, descripcion] = estacion.split('|');
                    infoBox.innerHTML = `
                        <h2>${nombre}</h2>
                        <p>${descripcion}</p>
                    `;
                } else {
                    infoBox.innerHTML = `<p>No se encontró información para la estación seleccionada.</p>`;
                }
            })
            .catch(error => console.error('Error al cargar el archivo:', error));
    });
});*/

async function load_years() { //poner los años y guardar y borrar para meses
  console.log('Estación:', station.value);
  const years = await get_year(station.value);
  calendar.innerHTML = "<h4>Selecciona un año: </h4>";

  years.forEach(y => {
    const btn = document.createElement("button");
    btn.textContent = y;
    btn.classList.add("calendar-button");

    btn.addEventListener("click", () => {
      calendar.innerHTML = ""; 
      load_months(y);
    });
    calendar.appendChild(btn);
  });
}

async function load_months(year) {
  console.log('Año:', year);
  const months = await get_months(station.value, year);

  calendar.innerHTML = `<h4>Meses disponibles: ${year}:</h4>`;

  months.forEach(m => {
    const btn = document.createElement("button");
    btn.textContent = m;
    btn.classList.add("calendar-button");

    btn.addEventListener("click", () => {
      calendar.innerHTML = ""; 
      load_dates(year, m);
    });

    calendar.appendChild(btn);
  });
}


async function load_dates(year, rawMonth) {
  const onlyMonth = rawMonth.split("-").pop(); // evita duplicación
  const days = await get_days(station.value, rawMonth);
  calendar.innerHTML = `<h4>Días disponibles para ${year}-${onlyMonth}:</h4>`;

  days.forEach(d => {
    const fechaCompleta = d.trim();
    
    const btn = document.createElement("button");
    btn.textContent = fechaCompleta;
    btn.classList.add("calendar-button");

    btn.addEventListener("click", () => {
      console.log("Fecha seleccionada:", fechaCompleta);
      document.getElementById("Fecha").value = fechaCompleta;

      get_csv();
      document.getElementById("btn_plot").disabled = false;
      document.getElementById("btn_download").disabled = false;

      const allButtons = calendar.querySelectorAll(".calendar-button");
      allButtons.forEach(b => b.classList.remove("selected-date"));
      btn.classList.add("selected-date");

    });
    calendar.appendChild(btn);
  });
}

btn_plot.addEventListener("click", plot);
station.addEventListener("change", load_years);
