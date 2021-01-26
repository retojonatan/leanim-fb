let listaMercaderia = document.getElementById('listaMercaderia');
let tipoPeso = document.getElementById('tipoPeso');
let peso = document.getElementById('peso');
let precioPorKilo = document.getElementById('precioKilo');
let precioLista = document.getElementById('precioLista');
let cantidad = document.getElementById('cantidad');
let subtotal = document.getElementById('subtotal');
let precioTotal = document.getElementById('precioTotal');
let formMercaderia = document.getElementById('formMercaderia');
let ctaCte = document.getElementById('ctacte');
let comprasAcc = document.getElementById('comprasAcumuladas');
let clienteId = document.getElementById('clienteId').innerText;
let nombreCliente = document.getElementById('nombreCliente').innerText;
let totalVenta = document.getElementById('totalVenta')
let totales = document.getElementsByName('total')
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

function clasificarCuenta() {
  if (ctaCte.innerText > 0) {
    document.getElementById('cta-bg').className = 'info-box bg-teal';
  } else if (ctaCte.innerText < 0) {
    document.getElementById('cta-bg').className = 'info-box bg-danger';
  } else {
    document.getElementById('cta-bg').className = 'info-box bg-purple';
  }
}

$(window).on("load", () => {
  clasificarCuenta()
  uploadTable()
  cargarTabla()
  listarMercaderia()
  listaMercaderia.addEventListener('change', () => filtrarPeso(tipoPeso, listaMercaderia.selectedOptions[0].getAttribute('data-id')));
  tipoPeso.addEventListener('change', e => ponerPesoYPrecio(e));
  peso.addEventListener('change', e => categorizarPeso(e));
  cantidad.addEventListener('change', () => actualizarTotal());
  precioPorKilo.addEventListener('change', () => actualizarTotal());
  precioTotal.addEventListener('change', e => calcularCambios(e));
  formMercaderia.addEventListener('submit', e => altaMercaderia(e));
})

function agregarMercaderia() {
  let clon = filaMercaderia.firstElementChild.cloneNode(true);
  clon.id = "columnaMercaderia" + count;
  for (let i = 0; i < clon.getElementsByTagName('select').length; i++) {
    clon.getElementsByTagName('select')[i].id = filaMercaderia.getElementsByTagName('select')[i].id + count;
    clon.getElementsByTagName('select')[i].value = "";
  }
  clon.getElementsByTagName('select')[0].addEventListener('change', function (e) {
    let opcionElegida = e.target.options.selectedIndex;
    let productoId = e.srcElement[opcionElegida].getAttribute('data-id')
    filtrarPeso(clon.getElementsByTagName('select')[1], productoId)
  })
  clon.getElementsByTagName('select')[1].addEventListener('change', e => ponerPesoYPrecio(e))
  for (let i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = filaMercaderia.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = '';
  }
  clon.getElementsByTagName('input')[0].addEventListener('change', e => categorizarPeso(e));
  clon.getElementsByTagName('input')[2].addEventListener('change', () => actualizarTotal());
  clon.getElementsByTagName('input')[3].value = 1;
  clon.getElementsByTagName('input')[3].addEventListener('change', () => actualizarTotal());
  clon.getElementsByTagName('input')[5].addEventListener('change', e => calcularCambios(e));
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

function filtrarPeso(listaPeso, id) {
  toastr.info('Seleccione el tipo de mercadería para obtener el precio de lista', 'AVISO:')
  db.collection('mercaderia').doc(id)
    .get()
    .then(doc => {
      limpiarListaPeso(listaPeso)
      let filtros = doc.data().Categoria
      filtros.forEach(cat => {
        let option = document.createElement('option')
        option.value = cat.Tipo
        option.dataset.precio = cat.PrecioLista
        switch (cat.Tipo) {
          case "A":
            option.appendChild(document.createTextNode('A - hasta 20kg'));
            option.setAttribute('min', 0)
            break;
          case "B":
            option.appendChild(document.createTextNode('B - entre 20 a 30kg'));
            option.setAttribute('min', 0)
            break;
          case "C":
            option.appendChild(document.createTextNode('C - entre 30 a 40kg'));
            option.setAttribute('min', 0)
            break;
          case "D":
            option.appendChild(document.createTextNode('D - entre 40 a 50kg'));
            option.setAttribute('min', 0)
            break;
          case "E":
            option.appendChild(document.createTextNode('E - entre 50 y 70kg'));
            option.setAttribute('min', 0)
            break;
          case "F":
            option.appendChild(document.createTextNode('F - entre 70 a 100kg'));
            option.setAttribute('min', 0)
            break;
          default:
            option.appendChild(document.createTextNode('G - más de 100kg'));
            option.setAttribute('min', 0)
            break;
        }
        listaPeso.appendChild(option);
      })
    })
}

function limpiarListaPeso(lista) {
  $(lista).empty();
  let option = document.createElement('option');
  option.setAttribute('selected', 'selected');
  option.setAttribute('hidden', 'hidden');
  option.setAttribute('disabled', 'disabled');
  lista.appendChild(option)
}

function actualizarTotal() {
  totales.forEach(total => {
    let kgs = total.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
    let ppk = total.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
    let cant = total.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild
    let subt = total.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
    total.value = parseFloat(kgs.value * ppk.value * cant.value).toFixed(2);
    subt.value = parseFloat(kgs.value * ppk.value * cant.value).toFixed(2);
  })
  agregarTotal()
}

function agregarTotal() {
  totalVenta.innerText = ''
  let valor = 0;
  totales.forEach(total => {
    valor = parseFloat(valor) + parseFloat(total.value)
  })
  totalVenta.innerText = valor + " $"
}

function calcularCambios(e) {
  let kgs = e.target.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
  let ppk = e.target.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
  let cant = e.target.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.firstElementChild.lastElementChild
  let subt = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.firstElementChild
  ppk.value = parseFloat((e.target.value / cant.value) / kgs.value).toFixed(2);
  subt.value = e.target.value;
  agregarTotal()
}

function ponerPesoYPrecio(e) {
  try {
    let pLista = e.currentTarget.selectedOptions[0].getAttribute("data-precio")
    let pesoInput = e.target.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild
    let precioInput = e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.firstElementChild
    let precioKgInput = e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.firstElementChild
    precioKgInput.value = precioInput.value = pLista
    switch (e.target.value) {
      case "A":
        pesoInput.value = 20;
        break;
      case "B":
        pesoInput.value = 30;
        break;
      case "C":
        pesoInput.value = 40;
        break;
      case "D":
        pesoInput.value = 50;
        break;
      case "E":
        pesoInput.value = 70;
        break;
      case "F":
        pesoInput.value = 100;
        break;
      default:
        pesoInput.value = "";
        toastr.info('Especifique el peso para el calculo', 'AVISO:')
        break;
    }
  } catch (error) {
    toastr.error('El peso que ingresó no es acorde a la clasificación de la mercadería, verifique bien el tipo de mercadería y el peso', 'AVISO IMPORTANTE')
  }
  actualizarTotal()
}

function categorizarPeso(e) {
  try {
    let kgs = e.target.value
    let tipoMerc = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild
    switch (true) {
      case (kgs <= 20):
        tipoMerc.value = "A";
        break;
      case (kgs <= 30):
        tipoMerc.value = "B";
        break;
      case (kgs <= 40):
        tipoMerc.value = "C";
        break;
      case (kgs <= 50):
        tipoMerc.value = "D";
        break;
      case (kgs <= 70):
        tipoMerc.value = "E";
        break;
      case (kgs <= 100):
        tipoMerc.value = "F";
        break;
      default:
        tipoMerc.value = "G";
        break;
    }
    actualizarTotal();
  } catch (err) {
    console.error('error dentro de la categorización de pesos')
    toastr.error('Hubo un error dentro de la categorización del peso, revise las categorías', 'AVISO')
  }
}

async function obtenerNumeroRemito() {
  return await db.collection('remito').doc('numeroRemito').get().then(async doc => {
      let contador = await doc.data().ContadorRemito
      return contador
    })
    .catch(err => {
      console.error(err)
    })
}

function altaMercaderia(e) {
  e.preventDefault();
  let valorTotal = 0
  totales.forEach(total => {
    valorTotal = parseFloat(valorTotal) + parseFloat(total.value)
  })
  let remito = yyyy + (Math.random() * 10).toFixed(1) + (Math.random() * 10).toFixed(1);
  let formaDePago = document.querySelector('input[name="forma"]:checked').value;
  let jsonMercaderia = [{
    Mercaderia: listaMercaderia.value,
    Categoria: tipoPeso.value,
    Peso: peso.value,
    PrecioPorKilo: precioPorKilo.value,
    Cantidad: cantidad.value,
    PrecioTotal: precioTotal.value,
  }]
  for (let i = 1; i < count; i++) {
    let mercaderia = {
      Mercaderia: document.getElementById('listaMercaderia' + i).value,
      Categoria: document.getElementById('tipoPeso' + i).value,
      Peso: document.getElementById('peso' + i).value,
      PrecioPorKilo: document.getElementById('precioKilo' + i).value,
      Cantidad: document.getElementById('cantidad' + i).value,
      PrecioTotal: document.getElementById('precioTotal' + i).value,
    }
    jsonMercaderia.push(mercaderia)
  }
  let jsonVentas = {
    Fecha: hoy,
    NumeroRemito: remito,
    Cliente: nombreCliente,
    ClienteId: clienteId,
    MontoVenta: valorTotal,
    MercaderiaVendida: jsonMercaderia,
    FormaPago: document.querySelector('input[name="forma"]:checked').dataset.forma,
    Pagado: false,
  }
  if (formaDePago != 'forma-cuenta') {
    jsonVentas.Pagado = true
  }

  db.collection('ventas').doc().set(jsonVentas)
    .then(() => {
      uploadTable()
      formMercaderia.reset()
      while (count != 1) {
        borrarMercaderia();
      }
    })
    .catch(err => {
      console.error(err)
    })

  anotarVentaCliente(formaDePago, valorTotal, remito)
  clasificarCuenta()
}

function anotarVentaCliente(formaDePago, valorTotal, remito) {
  let increment = firebase.firestore.FieldValue.increment(valorTotal)
  let remitos = firebase.firestore.FieldValue.arrayUnion(remito)

  let numeroPago = yyyy + (Math.random() * 10).toFixed(1) + (Math.random() * 10).toFixed(1)
  let jsonPago = {
    NumeroPago: numeroPago,
    Fecha: hoy,
    Cliente: nombreCliente,
    ClienteId: clienteId,
    Importe: valorTotal,
    Observaciones: 'Venta rápida',
    Metodo: document.querySelector('input[name="forma"]:checked').dataset.forma,
  }
  switch (formaDePago) {
    case 'forma-efectivo':
      db.collection('clientes').doc(clienteId).update({
          Debe: increment,
          Haber: increment,
          ComprasAcumuladas: increment,
          RemitosVentas: remitos,
          NumerosPagos: firebase.firestore.FieldValue.arrayUnion(jsonPago.NumeroPago),
        })
        .catch(err => {
          console.error(err)
        })
      comprasAcc.innerText = parseFloat(comprasAcc.innerText) + parseFloat(valorTotal)
      cargarPago(jsonPago)
      break;
    case 'forma-transferencia':
      db.collection('clientes').doc(clienteId).update({
          Haber: increment,
          ComprasAcumuladas: increment,
          RemitosVentas: remitos,
          NumerosPagos: firebase.firestore.FieldValue.arrayUnion(jsonPago.NumeroPago),
        })
        .catch(err => {
          console.error(err)
        })
      comprasAcc.innerText = parseFloat(comprasAcc.innerText) + parseFloat(valorTotal)

      jsonPago.NumeroTransferencia = document.getElementById('num-trans')
      jsonPago.FechaCobro = document.getElementById('f-cobro')
      jsonPago.Observaciones = document.getElementById('obs')
      cargarPago(jsonPago)
      break;
    case 'forma-cheque':
      db.collection('clientes').doc(clienteId).update({
          Haber: increment,
          ComprasAcumuladas: increment,
          RemitosVentas: remitos,
          NumerosPagos: firebase.firestore.FieldValue.arrayUnion(jsonPago.NumeroPago),
        })
        .catch(err => {
          console.error(err)
        })
      comprasAcc.innerText = parseFloat(comprasAcc.innerText) + parseFloat(valorTotal)

      jsonPago.NumeroCheque = document.getElementById('num-cheque').value
      jsonPago.FechaCobro = document.getElementById('f-cobro').value
      jsonPago.Observaciones = document.getElementById('obs').value
      cargarPago(jsonPago)
      break;
    default:
      db.collection('clientes').doc(clienteId).update({
          Debe: increment,
          ComprasAcumuladas: increment,
          RemitosVentas: remitos
        })
        .catch(err => {
          console.error(err)
        })
      ctaCte.innerText = parseFloat(ctaCte.innerText) - parseFloat(valorTotal)
      comprasAcc.innerText = parseFloat(comprasAcc.innerText) + parseFloat(valorTotal)
      break;
  }
}

function uploadTable() {
  let datos = []
  db.collection('ventas').where('ClienteId', "==", clienteId).get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const venta = doc.data()
        venta.VentaId = doc.id
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
            "data": "NumeroRemito",
            render: function (data, type, row) {
              return 'Nº ' + data;
            }
          },
          {
            "data": "MontoVenta",
            render: function (data, type, row) {
              return '$ ' + data;
            }
          },
          {
            "data": "VentaId",
            "data": "Cliente",
            "data": "MontoVenta",
            "data": function (data, type, row) {
              return `
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.VentaId}', '${data.Cliente}', '${data.MontoVenta}')"> Borrar <i class="far fa-trash-alt"></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarVenta('${data.VentaId}')">Modificar <i class="fa fa-edit"></i></a>`;
            }
          }
        ]
      })
    })
    .catch(err => {
      console.error(err)
    })
}

function preguntaBorrar(id, nombre, monto) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando la venta al cliente: <b>${nombre}</b> por <b>$ ${monto}</b>`;
  document.getElementById('idBorrar').value = id;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

// PAGOS

const formPagos = document.getElementById('formPagos')
const metodo = document.getElementById('metodo')
const cheque = document.getElementById('cheque')
const transferencia = document.getElementById('transferencia')
const numeroCheque = document.getElementById('numeroCheque')
const numeroTransferencia = document.getElementById('numeroTransferencia')
const fechaForm = document.getElementById('fechaForm')
const fechaCobro = document.getElementById('fechaCobro')
const importe = document.getElementById('importe')
const observaciones = document.getElementById('observaciones')

const agregarPago = (e) => {
  let numeroPago = yyyy + (Math.random() * 10).toFixed(1) + (Math.random() * 10).toFixed(1);
  e.preventDefault()
  let jsonPago = {
    NumeroPago: numeroPago,
    Fecha: hoy,
    Cliente: nombreCliente,
    ClienteId: clienteId,
    Importe: parseFloat(importe.value),
    Observaciones: observaciones.value,
    Metodo: metodo.value,
  }
  switch (metodo.value) {
    case 'transferencia':
      jsonPago.NumeroTransferencia = numeroTransferencia.value
      jsonPago.FechaCobro = fechaCobro.value
      console.log('transferencia', jsonPago)
      break;
    case 'cheque':
      jsonPago.NumeroCheque = numeroCheque.value
      jsonPago.FechaCobro = fechaCobro.value
      console.log('cheque', jsonPago)
      break;
    default:
      console.log('efectivo', jsonPago)
      break;
  }
  cargarPago(jsonPago)
  ingresarPagoCliente(jsonPago)
}

function cargarPago(jsonPago) {
  db.collection('pagos').doc().set(jsonPago)
    .then(() => {
      cargarTabla()
      fechaCobro.removeAttribute('required')
      numeroCheque.removeAttribute('required')
      numeroTransferencia.removeAttribute('required')
      fechaForm.setAttribute('hidden', 'hidden')
      cheque.setAttribute('hidden', 'hidden')
      transferencia.setAttribute('hidden', 'hidden')
      formPagos.reset()
      $('#modalPagos').modal('hide')
    })
    .catch(err => {
      console.error(err)
    })
}

function ingresarPagoCliente(json) {
  let increment = firebase.firestore.FieldValue.increment(json.Importe)
  console.log(increment, json.Importe)
  db.collection('clientes').doc(clienteId).update({
      Haber: increment,
      NumerosPagos: firebase.firestore.FieldValue.arrayUnion(json.NumeroPago)
    })
    .catch(err => {
      console.error(err)
    })
  ctaCte.innerText = parseFloat(ctaCte.innerText) + parseFloat(json.Importe)
  clasificarCuenta()
}

function seleccionarMetodo(e) {
  switch (e.target.value) {
    case 'transferencia':
      cheque.setAttribute('hidden', 'hidden')
      numeroCheque.removeAttribute('required')
      numeroTransferencia.setAttribute('required', 'required')
      fechaCobro.setAttribute('required', 'required')
      transferencia.removeAttribute('hidden')
      fechaForm.removeAttribute('hidden')
      break;
    case 'cheque':
      transferencia.setAttribute('hidden', 'hidden')
      numeroTransferencia.removeAttribute('required')
      numeroCheque.setAttribute('required', 'required')
      fechaCobro.setAttribute('required', 'required')
      cheque.removeAttribute('hidden')
      fechaForm.removeAttribute('hidden')
      break;
    default:
      fechaCobro.removeAttribute('required')
      numeroCheque.removeAttribute('required')
      numeroTransferencia.removeAttribute('required')
      fechaForm.setAttribute('hidden', 'hidden')
      cheque.setAttribute('hidden', 'hidden')
      transferencia.setAttribute('hidden', 'hidden')
      break;
  }
}

function cargarTabla() {
  let datos = []
  db.collection('pagos').where('ClienteId', "==", clienteId).get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const pagos = doc.data()
        pagos.PagoId = doc.id
        datos.push(pagos)
      })
    })
    .then(() => {
      $('#tablaPagos').DataTable().clear().destroy();
      $('#tablaPagos').DataTable({
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
            "data": "NumeroPago",
            render: function (data, type, row) {
              return 'Nº ' + data;
            }
          },
          {
            "data": "Importe",
            render: function (data, type, row) {
              return '$ ' + data;
            }
          },
          {
            "data": "Metodo"
          },
          {
            "data": "PagoId",
            "data": "Cliente",
            "data": "Importe",
            "data": function (data, type, row) {
              return `
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.PagoId}', '${data.Cliente}', '${data.Importe}')"> Borrar <i class="far fa-trash-alt"></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarPagos('${data.PagoId}')">Modificar <i class="fa fa-edit"></i></a>`;
            }
          }
        ]
      })
    })
    .catch(err => {
      console.error(err)
    })
}

metodo.addEventListener('change', seleccionarMetodo)
formPagos.addEventListener('submit', agregarPago)

let radios = document.querySelectorAll('input[type=radio][name="forma"]');

function handlerRadios(event) {
  switch (this.value) {
    case 'forma-cheque':
      console.log('seleccionaste cheques')
      document.getElementById('datosExtras').innerHTML = `
      <div class="col-sm-4">
      <label>Numero de Cheque</label> 
      <div class="input-group">
      <div class="input-group-prepend">
      <span class="input-group-text">Nº</span></div>
      <input type="text" class="form-control" id="num-cheque" required>
      </div></div>
      <div class="col-sm-4">
      <label>Fecha del cobro</label> 
      <input type="date" id="f-cobro" class="form-control datetimepicker-input" data-target="#timepicker" required>
      </div>
      <div class="col-sm-4">
      <label>Observaciones</label> 
      <input type="text" id="obs" class="form-control">
      </div>
      `
      break;
    case 'forma-transferencia':
      console.log('seleccionaste transferencia')
      document.getElementById('datosExtras').innerHTML = `
      <div class="col-sm-4">
      <label>Numero de Transferencia</label> 
      <div class="input-group">
      <div class="input-group-prepend">
      <span class="input-group-text">Nº</span></div>
      <input type="text" class="form-control" id="num-trans" required>
      </div></div>
      <div class="col-sm-4">
      <label>Fecha del cobro</label> 
      <input type="date" id="f-cobro" class="form-control datetimepicker-input" data-target="#timepicker" required>
      </div>
      <div class="col-sm-4">
      <label>Observaciones</label> 
      <input type="text" id="obs" class="form-control">
      </div>
      `
      break;
    default:
      document.getElementById('datosExtras').innerHTML = ``
      break;
  }
}

Array.prototype.forEach.call(radios, function (radio) {
  radio.addEventListener('change', handlerRadios);
});