const btn_plot = document.getElementById("btn_plot");/*boton*/
btn_plot.addEventListener("click", plot);/*graficar*/
const station = document.getElementById("plantel");/*estacion*/
const flatpick = flatpickr("#date",dateFormat: "d/m/Y")
const sel_year
const sel_month
const sel_date
let currentStep = 1; 

function get_csv(){
  const sta = document.getElementById("plantel");
  sid=sta.value;

  const dte = document.getElementById("Fecha");
  date = dte.value;
  console.log( sid, date);

  const url = 'https://ruoa.unam.mx:8042/pm_api&sid='+ sid + '&date='+ date;
  var a = document.getElementById('csvURL');
  a.href=url;
}

hideButtons();

function hideButtons() {
  station.style.display = "none";
  sel_year.style.display = "none";
  sel_month.style.display = "none";
  sel_fecha.style.display = "none";
  btn_plot.style.display = "none";
  document.getElementById("btn_download").style.display = "none";
/*switch para las opciones y bloquearlas*/
  switch (currentStep) {
    case 1:
      station.style.display = "block";
      station.disabled = false; 
      break;
    case 2:
      station.style.display = "block";
      sel_year.style.display = "block";
      station.disabled = true; 
      sel_year.disabled = false; 
      break;
    case 3:
      station.style.display = "block";
      sel_year.style.display = "block";
      sel_month.style.display = "block";
      station.disabled = true; 
      sel_year.disabled = true; 
      sel_month.disabled = false; 
      break;
    case 4:
      station.style.display = "block";
      sel_year.style.display = "block";
      sel_month.style.display = "block";
      sel_fecha.style.display = "block";
      station.disabled = true; 
      sel_year.disabled = true; 
      sel_month.disabled = true; 
      sel_fecha.disabled = false; 
      break;
    case 5:
      station.style.display = "block";
      sel_year.style.display = "block";
      sel_month.style.display = "block";
      sel_fecha.style.display = "block";
      station.disabled = true; 
      sel_year.disabled = true;
      sel_month.disabled = true; 
      sel_fecha.disabled = true; 
      btn_plot.style.display = "block";
      get_csv();
      document.getElementById("btn_download").style.display = "block";
      break;
  }
}
if (selectedDates.length > 0) {
  const fecha = selectedDates[0];

  sel_year= fecha.getFullYear();
  sel_month = fecha.getMonth() + 1;
  sel_date = fecha.getDate();
}

/*
async function load_years() {
  console.log('cambio', station.value);
  var year = await get_year(station.value);
  for (y of year) {
    var opt = document.createElement('option');
    opt.value = y;
    opt.innerHTML = y;
    sel_year.appendChild(opt);
  }
  currentStep = 2;
  hideButtons();
}

async function load_months() {
  console.log('cambio', sel_year.value);
  var months = await get_months(station.value, sel_year.value);
  console.log(months);
  for (m of months) {
    var opt = document.createElement('option');
    opt.value = m;
    opt.innerHTML = m;
    sel_month.appendChild(opt);
  }
  currentStep = 3;
  hideButtons();
}

async function load_dates() {
  console.log('cambio', sel_month.value);
  var dates = await get_days(station.value, sel_month.value);
  console.log(dates);
  for (d of dates) {
    var opt = document.createElement('option');
    opt.value = d;
    opt.innerHTML = d;
    sel_fecha.appendChild(opt);
  }
  currentStep = 4;
  hideButtons();
}*/
document.getElementById('sel_year').textContent: sel_year;
station.addEventListener("change", load_years);
sel_year.addEventListener("change", load_months);
sel_month.addEventListener("change", load_dates);
sel_fecha.addEventListener("change", () => {
  currentStep = 5;
  hideButtons();
});

hideButtons();
