let listaMercaderia = document.getElementById('listaMercaderia');
let tipoPeso = document.getElementById('tipoPeso');
let peso = document.getElementById('peso');
let precioPorKilo = document.getElementById('precioKilo');
let precioLista = document.getElementById('precioLista');
let cantidad = document.getElementById('cantidad');
let subtotal = document.getElementById('subtotal');
let precioTotal = document.getElementById('precioTotal');
let formMercaderia = document.getElementById('formMercaderia');
let ctaCte = document.getElementById('ctacte').innerHTML;
let clienteId = document.getElementById('clienteId').innerText;
let count = 1

// fecha de venta
let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1; //January is 0!
let yyyy = hoy.getFullYear();
if (dd < 10) {
  dd = '0' + dd
}
if (mm < 10) {
  mm = '0' + mm
}
hoy = yyyy + '-' + mm + '-' + dd;

if (ctaCte > 0) {
  document.getElementById('cta-bg').className = 'info-box bg-teal';
} else {
  document.getElementById('cta-bg').className = 'info-box bg-danger';
}

$(window).on("load", () => {
  console.log(clienteId)
  uploadTable()
  listarMercaderia()
  listaMercaderia.addEventListener('change', () => filtrarPeso(listaMercaderia.value, tipoPeso, listaMercaderia.selectedOptions[0].getAttribute('data-id')));
  tipoPeso.addEventListener('change', () => ponerPesoMaximo(tipoPeso.value));
  peso.addEventListener('change', () => categorizarPeso(peso.value));
  cantidad.addEventListener('change', () => actualizarTotal());
  precioPorKilo.addEventListener('focus', () => precioPorKilo.value = "");
  precioPorKilo.addEventListener('change', () => actualizarTotal());
  precioTotal.addEventListener('change', () => calcularCambios());
  formMercaderia.addEventListener('submit', e => altaMercaderia(e));
})

function agregarMercaderia() {
  let clon = filaMercaderia.firstElementChild.cloneNode(true);
  clon.id = "columnaMercaderia" + count;
  for (var i = 0; i < clon.getElementsByTagName('select').length; i++) {
    clon.getElementsByTagName('select')[i].id = filaMercaderia.getElementsByTagName('select')[i].id + count;
    clon.getElementsByTagName('select')[i].value = "";
    clon.getElementsByTagName('select')[0].addEventListener('change', function (e) {
      var opcionElegida = e.target.options.selectedIndex;
      var productoId = e.srcElement[opcionElegida].getAttribute('data-id')
      console.log(clon.getElementsByTagName('select')[0].value, clon.getElementsByTagName('select')[1], productoId)
      filtrarPeso(clon.getElementsByTagName('select')[0].value, clon.getElementsByTagName('select')[1], productoId)
    })
  }
  for (var i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = filaMercaderia.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = 0;
  }
  filaMercaderia.appendChild(clon)
  count++;
  document.getElementById('borrarProducto').style.display = "inline-block";
}

function borrarMercaderia() {
  if (filaMercaderia.lastChild != filaMercaderia.firstElementChild) {
    filaMercaderia.lastChild.remove();
    count--;
    if (count == 1) {
      document.getElementById('borrarProducto').style.display = "none";
    }
  }
}

function listarMercaderia() {
  db.collection('mercaderia').get()
    .then(docs => {
      docs.forEach(mercaderia => {
        let doc = mercaderia.data()
        let mercaderiaOpt = document.createElement('option');
        mercaderiaOpt.appendChild(document.createTextNode(doc.Nombre));
        mercaderiaOpt.value = doc.Nombre;
        mercaderiaOpt.dataset.id = mercaderia.id;
        listaMercaderia.appendChild(mercaderiaOpt);
      })
    })
}

function filtrarPeso(mercaderia, listaPeso, id) {
  db.collection('mercaderia').doc(id)
    .get()
    .then(doc => {
      limpiarListaPeso()
      let filtros = doc.data().Categoria
      filtros.forEach(cat => {
        let option = document.createElement('option')
        option.value = cat
        switch (cat) {
          case "A":
            option.appendChild(document.createTextNode('A - hasta 20kg'));
            break;
          case "B":
            option.appendChild(document.createTextNode('B - entre 20 a 30kg'));
            break;
          case "C":
            option.appendChild(document.createTextNode('C - entre 30 a 40kg'));
            break;
          case "D":
            option.appendChild(document.createTextNode('D - entre 40 a 50kg'));
            break;
          case "E":
            option.appendChild(document.createTextNode('E - entre 50 y 70kg'));
            break;
          case "F":
            option.appendChild(document.createTextNode('F - entre 70 a 100kg'));
            break;
          default:
            option.appendChild(document.createTextNode('G - más de 100kg'));
            break;
        }
        listaPeso.appendChild(option);
      })
      switch (mercaderia) {
        case "Lechón":
          peso.min = 0;
          peso.max = 50;
          break;
        case "Capón":
          peso.min = 50;
          break;
        case "Ternero":
          peso.min = 0;
          peso.max = 40;
          break;
        default:
          peso.min = 0;
          peso.max = 20;
          break;
      }
      precioLista.value = precioPorKilo.value = doc.data().PrecioLista
    })
}

function limpiarListaPeso() {
  $(tipoPeso).empty();
  var option = document.createElement('option');
  option.setAttribute('selected', 'selected');
  option.setAttribute('hidden', 'hidden');
  option.setAttribute('disabled', 'disabled');
  tipoPeso.appendChild(option)
  peso.value = ""
}

//FALTA EL CLIENTE
function altaMercaderia(e) {
  e.preventDefault();
  var jsonVentas = {
    Fecha: hoy,
    NumeroRemito: yyyy + count,
    Mercaderia: listaMercaderia.value,
    TipoPeso: tipoPeso.value,
    Peso: peso.value,
    PrecioPorKilo: precioPorKilo.value,
    Cantidad: cantidad.value,
    Subtotal: subtotal.value,
    MontoTotal: precioTotal.value,
    // Cliente: nombreCliente.value
    Cliente: 'matias'
  }

  db.collection('ventas').doc().set(jsonVentas)
    .then(() => {
      uploadTable()
      formMercaderia.reset()
      while (count != 1) {
        deleteProduct();
      }
    })
    .catch(err => {
      console.error(err)
    })
}

function actualizarTotal() {
  precioTotal.value = parseFloat(peso.value * precioPorKilo.value * cantidad.value).toFixed(2);
  subtotal.value = parseFloat(peso.value * precioPorKilo.value * cantidad.value).toFixed(2);
}

function calcularCambios() {
  precioPorKilo.value = parseFloat((precioTotal.value / cantidad.value) / peso.value).toFixed(2);
  subtotal.value = precioTotal.value;
}

function ponerPesoMaximo(categoria) {
  switch (categoria) {
    case "A":
      peso.value = 20;
      break;
    case "B":
      peso.value = 30;
      break;
    case "C":
      peso.value = 40;
      break;
    case "D":
      peso.value = 50;
      break;
    case "E":
      peso.value = 70;
      break;
    case "F":
      peso.value = 100;
      break;
    default:
      peso.value = "";
      break;
  }
  actualizarTotal()
}

function categorizarPeso(peso) {
  switch (true) {
    case (peso <= 20):
      tipoPeso.value = "A";
      break;
    case (peso <= 30):
      tipoPeso.value = "B";
      break;
    case (peso <= 40):
      tipoPeso.value = "C";
      break;
    case (peso <= 50):
      tipoPeso.value = "D";
      break;
    case (peso <= 70):
      tipoPeso.value = "E";
      break;
    case (peso <= 100):
      tipoPeso.value = "F";
      break;
    default:
      tipoPeso.value = "G";
      break;
  }
  actualizarTotal();
}

function uploadTable() {
  let datos = []
  db.collection('ventas').get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const venta = doc.data()
        venta.CompraId = doc.id
        datos.push(venta)
      })
    })
    .then(() => {
      $('#tablaVentas').DataTable().clear().destroy();
      $('#tablaVentas').DataTable({
        pageLength: 25,
        data: datos,
        columns: [{
            "data": "Fecha",
            render: function (data, type, row) {
              if (data === null) return '-';
              var tdat = data.split('T');
              var fecha = tdat[0].split('-');
              return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
            }
          },
          {
            "data": "NumeroFactura",
            render: function (data, type, row) {
              return 'Nº ' + data;
            }
          },
          {
            "data": "MontoTotal",
            render: function (data, type, row) {
              return '$ ' + data;
            }
          },
          {
            "data": "CompraId",
            "data": "Cliente",
            "data": function (data, type, row) {
              return `
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.CompraId}','${data.Proveedor}','${data.MontoTotal}')">Borrar <i class="far fa-trash-alt"></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarCompra('${data.CompraId}')">Modificar <i class="fa fa-edit"></i></a>`;
            }
          }
        ]
      })
    })
    .catch(err => {
      console.error(err)
    })
}