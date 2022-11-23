const moneda = document.getElementById("moneda");
const boton = document.getElementById("boton");
const montoIngresado = document.getElementById("montoIngresado");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById('myChart');
var myChart=null;

let monedasJSON = {};
async function getMonedasApi() {
  try {
    const url = "https://mindicador.cl/api";
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    alert("ha ocurrido un problema al obtener las monedas");
  }

  console.log(data);
}

getMonedasApi();

async function poblarMonedas() {
  monedasJSON = await getMonedasApi();
  let template = "";
  template += `
    <option value="-1">Seleccione Moneda</option>
    `;
  template += `
    <option value="${monedasJSON.dolar.codigo}">${monedasJSON.dolar.nombre} </option>
    `;
  template += `
    <option value="${monedasJSON.euro.codigo}">${monedasJSON.euro.nombre} </option>
    `;
  template += `
    <option value="${monedasJSON.bitcoin.codigo}">${monedasJSON.bitcoin.nombre} </option>
    `;
  moneda.innerHTML += template;
}

boton.addEventListener("click", () => {
  resultado.innerHTML = "...";
  if(myChart!=null){
    myChart.destroy();
}
  if (!montoIngresado.value) {
    alert("Ingrese un monto a convertir");
    return;
  }
  if (moneda.value == -1) {
    alert("Seleccione una moneda");
    return;
  }
  let valorConvertido = "";
  if (moneda.value == monedasJSON.dolar.codigo) {
    valorConvertido = montoIngresado.value / monedasJSON.dolar.valor;
  }
  if (moneda.value == monedasJSON.euro.codigo) {
    valorConvertido = montoIngresado.value / monedasJSON.euro.valor;
  }
  if (moneda.value == monedasJSON.bitcoin.codigo) {
    valorConvertido = montoIngresado.value / monedasJSON.bitcoin.valor;
  }
  resultado.innerHTML = "Resultado: $" + valorConvertido.toFixed(2);

  getChart(moneda.value);
});

async function getChart(codigo){
    try {
        const url = "https://mindicador.cl/api/"+codigo;
        const res = await fetch(url);
        let historico = await res.json();
     


        myChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: historico.nombre,
          data: historico.serie,
          borderColor: "#0d6efd",
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            callback: function (v, i, ticks) {
              let date = new Date(historico.serie[i].fecha);
              return `${date.getDate()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
            },
          },
        },
      },
      parsing: { xAxisKey: "fecha", yAxisKey: "valor" },
    },
  });
} catch (e) {
    alert("ha ocurrido un problema al obtener el historico");
  }
}

poblarMonedas();
