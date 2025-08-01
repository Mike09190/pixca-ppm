const btn_plot = document.getElementById("btn_plot"); //declarar los botones y cuadros
btn_plot.addEventListener("click", plot);
const station = document.getElementById("plantel");
const sel_year = document.getElementById("year");
const sel_month = document.getElementById("mes");
const sel_fecha = document.getElementById("Fecha");
const btn_download = document.getElementById("btn_download");
let estadoPanel = "años";
let añoSeleccionado = null;
let mesSeleccionado = null;
const btnBack = document.getElementById("btn_back");
let DescargaActi = null;


const ImagenesDeEstaciones ={
  "pmpembu20230001": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pmpembu20230002": "Imageness/Satandard.jpeg",
  "pmpembu20230003": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pmpembu20230004": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pmpembu20230005": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pmpembu20230006": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pixca_ppm012": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pixca_ppm013" : "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg",
  "pixca_ppm015": "https://i.pinimg.com/736x/91/1e/61/911e61e3631fe0a489bf72070ae314b5.jpg"
};

function mostrarDatosEstacion(estacionId) {
  const datosSimulados = {
    "pmpembu20230001": {
      nombre: "Estación PEMBU 01",
      ubicacion: "Ciudad Universitaria, CDMX",
      lat: "19.3321",
      lon: "-99.1890",
      altura: "2250"
    },
    "pmpembu20230002": {
      nombre: "Estación PEMBU 02",
      ubicacion: "Sipirili",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "777"
    },
     "pmpembu20230003": {
      nombre: "Estación PEMBU 03",
      ubicacion: "Papulandia",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "2240"
    },
     "pmpembu20230004": {
      nombre: "Estación PEMBU 04",
      ubicacion: "Nogales, Sonora",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "2240"
    },
     "pmpembu20230005": {
      nombre: "Estación PEMBU 05",
      ubicacion: "Tlaxcala",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "2240"
    },
     "pmpembu20230006": {
      nombre: "Estación PEMBU 06",
      ubicacion: "Perú",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "2240"
    },
     "pixca_ppm012": {
      nombre: "Estación PEMBU 012",
      ubicacion: "Zona rosa",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "2240"
    },
      "pixca_ppm013": {
      nombre: "Estación pixca 013",
      ubicacion: "La Central de abastos",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "666"
    },
      "pixca_ppm015": {
      nombre: "Estación pixca 015",
      ubicacion: "fantasmas tasqueña",
      lat: "19.3432",
      lon: "-99.1612",
      altura: "5543473610"
    },

    // Aqui se agregaron las estaciones
  };

  const datos = datosSimulados[estacionId];
  const infoDiv = document.getElementById("info-estacion");

  if (datos) {
    infoDiv.innerHTML = `
      <strong>Nombre:</strong> ${datos.nombre}<br>
      <strong>Ubicación:</strong> ${datos.ubicacion}<br>
      <strong>Coordenadas:</strong> ${datos.lat}, ${datos.lon}<br>
      <strong>Altura:</strong> ${datos.altura} m
    `;
  } else {
    infoDiv.innerHTML = `<em>No hay información disponible para esta estación.</em>`;
  }
}

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

async function load_years() {
  DescargaActi = "none";
  const estacionActual = station.value;
  const yearsRaw = await get_year(estacionActual);
  console.log('Estación:', station.value);
  calendar.innerHTML = "";

  
  const years = yearsRaw.filter(y => /^\d{4}$/.test(y.trim()));//formato
  if (years.length === 0) {
    calendar.innerHTML = "<h4>No hay años disponibles para esta estación.</h4>";
    return;
  }

  calendar.innerHTML = "<h4>Selecciona un año: </h4>";

  years.forEach(y => {
    const btn = document.createElement("button");
    btn.textContent = y;
    btn.classList.add("calendar-button");

    btn.addEventListener("click", () => {
      calendar.innerHTML = "";
      load_months(y);
    });
    if(DescargaActi === "none"){
      btn_download.style.display="none";
      btn_plot.style.display = "none";
    }
    calendar.appendChild(btn);
    estadoPanel = "años";
    btnBack.style.display = "none";
  });
}


async function load_months(year) {
  DescargaActi = "none";
  console.log('Año:', year);
  console.log('Estación:', station.value);
  const monthsRaw = await get_months(station.value, year);
  calendar.innerHTML = "";
  añoSeleccionado = year;
  const months = monthsRaw.filter(m => {
    return (
      !m.includes(".txt") &&
      !m.includes(".tar.gz") &&
      /^(\d{4}-\d{2})$/.test(m.trim()) //formato
    );
  });

  if (months.length === 0) {
    calendar.innerHTML = `<h4>No hay meses válidos para ${year}</h4>`;
    return;
  }

  calendar.innerHTML = `<h4>Meses disponibles en ${year}</h4>`;

  months.forEach(m => {
    const btn = document.createElement("button");
    btn.textContent = m;
    btn.classList.add("calendar-button");

    btn.addEventListener("click", () => {
      calendar.innerHTML = "";
      load_dates(year, m);
    });
    if(DescargaActi === "none"){
      btn_download.style.display="none";
      btn_plot.style.display = "none";
    }

    calendar.appendChild(btn);

    estadoPanel = "meses";
    btnBack.style.display = "inline-block";


  });
}

async function load_dates(year, rawMonth) {
  DescargaActi = "Acti";
  console.log("mes: ", rawMonth)
  const onlyMonth = rawMonth.split("-").pop(); // evita duplicación
  const days = await get_days(station.value, rawMonth);
  mesSeleccionado = rawMonth;
  calendar.innerHTML = `<h4>Días disponibles para ${year}-${onlyMonth}:</h4>`;
  calendar.innerHTML = "";

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
      if(DescargaActi === "Acti"){
      btn_download.style.display="inline-block";
      btn_plot.style.display = "inline-block"
    }
  
    });

    calendar.appendChild(btn);

        estadoPanel = "días";
    btnBack.style.display = "inline-block";
  });
}



btn_plot.addEventListener("click", plot);
station.addEventListener("change", load_years);

station.addEventListener("change", () => {load_years();
const SelecStation = station.value;
const img= document.getElementById("right_image");

if(ImagenesDeEstaciones[SelecStation])
{
  img.src= ImagenesDeEstaciones[SelecStation];
  img.style.display="block";
}else
{
  img.style.display= "none";
}
mostrarDatosEstacion(SelecStation);
});
btnBack.addEventListener("click", () => {
  if (estadoPanel === "días") {
    if (añoSeleccionado) {
      load_months(añoSeleccionado);
      estadoPanel = "meses";
      //btn_download.style.display="inline-block"
    }
  } else if (estadoPanel === "meses") {
    load_years();
    estadoPanel = "años";
    
  }
});