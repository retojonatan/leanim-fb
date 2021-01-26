const formCompras = document.getElementById('formCompras')
const listaProveedores = document.getElementById('listaProveedores')
const listaProductos = document.getElementById('listaProductos')
const filaProducto = document.getElementById('filaProducto')
const comprobante = document.getElementById('comprobante')
const iva = document.getElementById('iva')
const ivaPesos = document.getElementById('ivaPesos')
const ivaTotal = document.getElementById('ivaTotal')
const montoTotal = document.getElementById('montoTotal')
const fechaFc = document.getElementById("fechaFc")
const precioBruto = document.getElementById('precioBruto')
const precio = document.getElementById('precio')
const subtotal = document.getElementById('subtotal')
const cantidad = document.getElementById('cantidad')
const marca = document.getElementById('marca')
let idEditable = ""
let count = 1;
// fecha de facturacion maxima
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
fechaFc.setAttribute("max", hoy);

// Handler de vista para agregar productos
function addProduct() {
  listaProveedores.setAttribute('disabled', 'disabled');
  comprobante.setAttribute('disabled', 'disabled');
  let clon = filaProducto.firstElementChild.cloneNode(true);
  clon.id = "columnaProducto" + count;
  for (var i = 0; i < clon.getElementsByTagName('select').length; i++) {
    clon.getElementsByTagName('select')[i].id = filaProducto.getElementsByTagName('select')[i].id + count;
    clon.getElementsByTagName('select')[i].value = "";
    // lista de productos clonada
    clon.getElementsByTagName('select')[0].addEventListener('change', function (e) {
      var opcionElegida = e.target.options.selectedIndex;
      var productoId = e.srcElement[opcionElegida].id;
      presentarDatosProducto(productoId);
    });
    clon.getElementsByTagName('select')[0].removeAttribute('disabled');
    // inicializar guardar precio en 'No'
    clon.getElementsByTagName('select')[1].value = "No";
    // iva clonado
    clon.getElementsByTagName('select')[2].value = filaProducto.firstElementChild.getElementsByTagName('select')[2].value;
    clon.getElementsByTagName('select')[2].addEventListener('change', function (e) {
      calcularIva();
      calcularSubtotal();
    });
  }
  for (var i = 0; i < clon.getElementsByTagName('input').length; i++) {
    clon.getElementsByTagName('input')[i].id = filaProducto.getElementsByTagName('input')[i].id + count;
    clon.getElementsByTagName('input')[i].value = 0;
  }
  let precioProd = "precio" + count;
  let cantidadProd = "cantidad" + count;
  filaProducto.appendChild(clon);
  document.getElementById(precioProd.toString()).addEventListener('change', function () {
    calcularIva()
    calcularSubtotal();
  });
  document.getElementById(cantidadProd.toString()).addEventListener('change', function () {
    calcularSubtotal();
  });
  document.getElementById(cantidadProd.toString()).value = 1;
  count++;
  document.getElementById('borrarProducto').style.display = "inline-block";
}

// Handler de vista para borrar productos
function deleteProduct() {
  if (filaProducto.lastChild != filaProducto.firstElementChild) {
    filaProducto.lastChild.remove();
    count--;
    esconderDelete();
    calcularIva();
    if (count != 1) {
      document.getElementById('listaProductos' + (count - 1)).removeAttribute('disabled');
    }
  }
}

// Handler cuando tenes un solo producto
function esconderDelete() {
  if (count == 1) {
    document.getElementById('borrarProducto').style.display = "none";
    comprobante.removeAttribute("disabled");
    listaProveedores.removeAttribute("disabled");
    listaProductos.removeAttribute('disabled');
  }
}

function calcularIva() {
  for (let i = 0; i < count; i++) {
    let porcentaje = parseFloat(iva.value / 100);
    ivaPesos.value = (precio.value * porcentaje).toFixed(4);
    if (comprobante.value == "Fc A") {
      if (porcentaje == 1) precioBruto.value = parseFloat(ivaPesos.value).toFixed(4)
      else {
        precioBruto.value = parseFloat(parseFloat(precio.value) + parseFloat(ivaPesos.value)).toFixed(4);
      }
    } else {
      precioBruto.value = precio.value;
    }
    if (i != 0) {
      porcentaje = document.getElementById('iva' + i).value / 100;
      document.getElementById('ivaPesos' + i).value = (document.getElementById('precio' + i).value * porcentaje).toFixed(4);
      if (comprobante.value == "Fc A") {
        if (porcentaje == 1) document.getElementById('precioBruto' + i).value = parseFloat(document.getElementById('ivaPesos' + i).value).toFixed(4)
        else {
          document.getElementById('precioBruto' + i).value = parseFloat(parseFloat(document.getElementById('precio' + i).value) + parseFloat(document.getElementById('ivaPesos' + i).value)).toFixed(4);
        }
      } else {
        document.getElementById('precioBruto' + i).value = document.getElementById('precio' + i).value;
      }
    }
    calcularIvaTotal();
  }
}

function calcularSubtotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      subtotal.value = parseFloat(parseFloat(precioBruto.value) * parseFloat(cantidad.value)).toFixed(4);
    } else {
      let precioBrutoProd = document.getElementById('precioBruto' + i);
      let cantidadProd = document.getElementById('cantidad' + i);
      document.getElementById('subtotal' + i).value = parseFloat(parseFloat(precioBrutoProd.value) * parseFloat(cantidadProd.value)).toFixed(4);
    }
  }
  calcularIvaTotal();
}

function calcularIvaTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      ivaTotal.value = parseFloat(parseFloat(ivaPesos.value) * parseFloat(cantidad.value)).toFixed(4);
    } else {
      ivaProducto = parseFloat(parseFloat(document.getElementById('ivaPesos' + i).value) * parseFloat(document.getElementById('cantidad' + i).value)).toFixed(4);
      ivaTotal.value = parseFloat(parseFloat(ivaProducto) + parseFloat(ivaTotal.value)).toFixed(4);
    }
  }
  calcularMontoTotal();
}

function calcularMontoTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) montoTotal.value = parseFloat(precioBruto.value) * parseFloat(cantidad.value);
    else {
      let totales = parseFloat(document.getElementById('precioBruto' + i).value) * parseFloat(document.getElementById('cantidad' + i).value);
      montoTotal.value = parseFloat(parseFloat(montoTotal.value) + parseFloat(totales)).toFixed(4);
    }
  }
}

listaProductos.addEventListener('click', e => {
  if (!comprobante.value) {
    toastr.error('elegir comprobante')
    comprobante.focus()
  }
})

comprobante.addEventListener('change', function (e) {
  // limpia la lista de opciones anteriores de iva
  while (iva.childElementCount != 0) {
    iva.lastElementChild.remove();
  }
  // manejos de la eleccion de comprobantes
  switch (e.target.value) {
    case 'Fc A':
      var opcion = document.createElement('option');
      opcion.appendChild(document.createTextNode('10.5%'));
      opcion.value = 10.5;
      iva.appendChild(opcion);
      var opcion2 = document.createElement('option');
      opcion2.appendChild(document.createTextNode('21%'));
      opcion2.value = 21;
      opcion2.setAttribute('selected', 'selected');
      iva.appendChild(opcion2);
      var opcion3 = document.createElement('option');
      opcion3.appendChild(document.createTextNode('27%'));
      opcion3.value = 27;
      iva.appendChild(opcion3);
      var opcion4 = document.createElement('option');
      opcion4.appendChild(document.createTextNode('30%'));
      opcion4.value = 30;
      iva.appendChild(opcion4);
      var opcion5 = document.createElement('option');
      opcion5.appendChild(document.createTextNode('0%'));
      opcion5.value = 0;
      iva.appendChild(opcion5);
      var opcion6 = document.createElement('option');
      opcion6.appendChild(document.createTextNode('Percepcion RG2408'));
      opcion6.value = 100;
      iva.appendChild(opcion6);
      calcularIva();
      break;
    default:
      var opcion = document.createElement('option');
      opcion.appendChild(document.createTextNode('0%'));
      opcion.value = 0;
      opcion.setAttribute('selected', 'selected');
      iva.appendChild(opcion);
      calcularIva();
      break;
  }
  calcularSubtotal();
})

// handler para vaciar los campos de los productos
function limpiarFilasProductos(lista) {
  for (var i = 0; i < lista.getElementsByTagName('input').length; i++) {
    lista.getElementsByTagName('input')[i].value = 0;
  }
  for (var j = 0; j < document.getElementsByName('cantidad').length; j++) {
    document.getElementsByName('cantidad')[j].value = "1";
  }
  while (lista.childElementCount != 1) {
    if (lista.firstElementChild != lista.lastElementChild)
      lista.lastElementChild.remove();
  }
}

// setup de ejecucion inicial con handlers y eventlisteners
$(window).on("load", function () {
  uploadTable();
  listarProveedores();
  precio.addEventListener('change', function () {
    calcularIva();
    calcularSubtotal();
  })
  formCompras.addEventListener("submit", function (e) {
    altaCompra();
    e.preventDefault();
  })
  listaProveedores.addEventListener('change', function (e) {
    presentarDatosProveedor(e.target.selectedOptions[0].getAttribute('data-id'));
    listarProductos(listaProductos, e.target.value);
    limpiarFilasProductos(filaProducto);
  })
  listaProductos.addEventListener('change', () => {
    var productoId = listaProductos.selectedOptions[0].id
    presentarDatosProducto(productoId);
  })
  iva.addEventListener('change', function () {
    calcularIva();
    calcularSubtotal();
  })
  cantidad.addEventListener('change', function () {
    calcularSubtotal();
    calcularMontoTotal();
  })
});

// Funcion que los datos del proveedor seleccionado
function presentarDatosProveedor(idProveedor) {
  db.collection('proveedores').doc(idProveedor).get()
    .then(doc => {
      let proveedor = doc.data()
      document.getElementById('razonSocial').value = proveedor.RazonSocial;
      document.getElementById('condicion').value = proveedor.CondicionFiscal;
      document.getElementById('tipo').value = proveedor.TipoRubro;
      document.getElementById('cuit').value = proveedor.Cuit;
      document.getElementById('proveedorId').value = proveedor.ProveedorId;
    })
    .catch(err => {
      console.error(err)
    })
}

// Funcion que los datos del producto seleccionado
function presentarDatosProducto(idProducto) {
  db.collection('productos').doc(idProducto).get()
    .then(doc => {
      productoElegido = doc.data()
      // caso que sea seleccionado el primer producto
      if (count == 1) {
        marca.value = productoElegido.Marca;
        precio.value = productoElegido.Precio;
        iva.value = productoElegido.IVA;
        precio.addEventListener('change', function () {
          calcularIva();
          calcularSubtotal();
        });
      }
      // caso que se seleccione mas de un producto
      else {
        var productoCount = count - 1;
        document.getElementById('marca' + productoCount).value = productoElegido.Marca;
        document.getElementById('precio' + productoCount).value = productoElegido.Precio;
        document.getElementById('iva' + productoCount).value = productoElegido.IVA;
        document.getElementById('precio' + productoCount).addEventListener('change', function () {
          calcularIva();
          calcularSubtotal();
        });
      }
      calcularIva();
      calcularSubtotal();
    })
    .catch(err => {
      console.error(err);
    })
}

// Creacion de compras en base
async function altaCompra() {
  let nombreProv = listaProveedores.options[listaProveedores.selectedIndex].value
  let jsonProductos = [{
    Producto: listaProductos.value,
    Marca: marca.value,
    Precio: parseFloat(precio.value),
    Cantidad: parseFloat(cantidad.value),
    Subtotal: parseFloat(subtotal.value),
    PorcentajeIVA: parseFloat(iva.value),
    MontoIVA: parseFloat(ivaPesos.value),
    PrecioBruto: parseFloat(precioBruto.value),
  }]
  // Handler para el caso que haya mas de un producto
  for (let i = 1; i < count; i++) {
    let producto = {
      Producto: document.getElementById('listaProductos' + i).value,
      Marca: document.getElementById('marca' + i).value,
      Precio: parseFloat(document.getElementById('precio' + i).value),
      Cantidad: parseFloat(document.getElementById('cantidad' + i).value),
      Subtotal: parseFloat(document.getElementById('subtotal' + i).value),
      PorcentajeIVA: parseFloat(document.getElementById('iva' + i).value),
      MontoIVA: parseFloat(document.getElementById('ivaPesos' + i).value),
      PrecioBruto: parseFloat(document.getElementById('precioBruto' + i).value),
    }
    jsonProductos.push(producto);
  }
  // json con la compra con productos
  let jsonCompra = {
    Proveedor: nombreProv,
    RazonSocial: document.getElementById('razonSocial').value,
    CondicionFiscal: document.getElementById('condicion').value,
    TipoProveedor: document.getElementById('tipo').value,
    NumeroFactura: document.getElementById('numFc').value,
    FechaFactura: fechaFc.value,
    MontoTotal: parseFloat(montoTotal.value),
    MontoTotalIVA: parseFloat(ivaTotal.value),
    Cuit: document.getElementById('cuit').value,
    TipoComprobante: comprobante.value,
    Observaciones: document.getElementById('observaciones').value,
    ListaProductosComprados: jsonProductos,
  }

  await db.collection('compras').doc().set(jsonCompra)
    .then(() => {
      if (document.getElementById('guardarPrecio').value == "Si") {
        cambiarPrecio(listaProductos[listaProductos.selectedIndex].id, parseFloat(jsonProductos[0].Precio));
      }
      for (let i = 1; i < count; i++) {
        if (document.getElementById('guardarPrecio' + i).value == "Si") {
          cambiarPrecio(document.getElementById('listaProductos' + i)[document.getElementById('listaProductos' + i).selectedIndex].id, parseFloat(jsonProductos[i].Precio));
        }
      }
    })
    .then(() => {
      uploadTable()
      formCompras.reset()
      while (count != 1) {
        deleteProduct();
      }
    })
    .catch(err => {
      console.error(err)
    })
}

function preguntaBorrar(id, nombre, monto) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando la compra al proveedor: <b>${nombre}</b> por <b>$ ${monto}</b>`;
  document.getElementById('idBorrar').value = id;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

async function eliminarCompra() {
  let id = document.getElementById('idBorrar').value;

  await db.collection('compras').doc(id).delete()
    .then(() => {
      uploadTable();
      id.value = ''
      document.getElementById('borrarBtn').setAttribute('disabled', 'disabled')
    })
    .catch(err => {
      console.error(err);
    })
}

// Funcion para presentar la lista de proveedores
async function listarProveedores() {
  await db.collection('proveedores').get()
    .then(docs => {
      docs.forEach(querysnapshot => {
        let doc = querysnapshot.data()
        let proveedor = document.createElement('option');
        proveedor.appendChild(document.createTextNode(doc.Nombre));
        proveedor.value = doc.Nombre;
        proveedor.dataset.id = querysnapshot.id;
        listaProveedores.appendChild(proveedor);
      })
    })
    .catch(err => {
      console.error(err)
    })
}

async function cambiarPrecio(productoId, precio) {
  let precioNuevo = precio
  await db.collection('productos').doc(productoId).get()
    .then(doc => {
      let producto = doc.data()
      let cambioPrecio = {
        FechaCambio: hoy,
        PrecioAnterior: producto.Precio,
      }
      producto.Precio = precioNuevo
      if (producto.PreciosAnteriores) {
        producto.PreciosAnteriores.push(cambioPrecio)
        db.collection('productos').doc(productoId).update(producto)
      } else {
        producto.PreciosAnteriores = [cambioPrecio]
        db.collection('productos').doc(productoId).update(producto)
      }
    })
}

// Handler para cuando se cambia de proveedor, limpia la lista de productos
function limpiarListaProductos(lista) {
  $(lista).empty();
  var option = document.createElement('option');
  option.setAttribute('selected', 'selected');
  option.setAttribute('hidden', 'hidden');
  option.setAttribute('disabled', 'disabled');
  lista.appendChild(option)
}

// Funcion para presentar la lista de productos
async function listarProductos(lista, nombreProveedor) {
  let datos = []
  await db.collection('productos').where('Proveedor', "==", nombreProveedor)
    .get()
    .then(querysnapshot => {
      querysnapshot.forEach(doc => {
        const producto = doc.data()
        producto.ProductoId = doc.id
        datos.push(producto)
      })
    })
    .then(async () => {
      limpiarListaProductos(lista);
      return await datos.forEach(producto => {
        let productoOpcion = document.createElement('option');
        productoOpcion.appendChild(document.createTextNode(producto.Nombre));
        productoOpcion.value = producto.Nombre;
        productoOpcion.id = producto.ProductoId;
        lista.appendChild(productoOpcion);
      })
    })
    .catch(err => {
      console.error(err);
    })
}

// carga de la tabla de compras
function uploadTable() {
  let datos = []
  db.collection('compras').get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const compra = doc.data()
        compra.CompraId = doc.id
        datos.push(compra)
      })
    })
    .then(() => {
      $('#tablaCompras').DataTable().clear().destroy();
      $('#tablaCompras').DataTable({
        pageLength: 25,
        data: datos,
        columns: [{
            "data": "FechaFactura",
            render: function (data, type, row) {
              if (data === null) return '-';
              var tdat = data.split('T');
              var fecha = tdat[0].split('-');
              return fecha[2] + '-' + fecha[1] + '-' + fecha[0];
            }
          },
          {
            "data": "TipoProveedor"
          },
          {
            "data": "Proveedor"
          },
          {
            "data": "Cuit"
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
            "data": "Proveedor",
            "data": "MontoTotal",
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

HTMLSelectElement.prototype.contains = function (value) {
  for (let i = 0, l = this.options.length; i < l; i++) {
    if (this.options[i].value == value) {
      return true;
    }
  }
  return false;
}

function mostrarCompra(id) {
  idEditable = id;
  db.collection('compras').doc(id)
    .get()
    .then(async compra => {
      let compraActual = compra.data()
      formCompras.reset()
      while (count != 1) {
        deleteProduct()
      }
      let result = await cargarTareas(compraActual)
      return result
    })
    .then(compra => {
      return volcarDatos(compra)
    })
    .then(prodCompras => {
      agregarProductos(prodCompras)
    })
    .then(() => {
      cambiarBtn()
      toastr.success("Ya puede modificar la compra", "AVISO:")
    })
    .catch(err => {
      console.error(err)
    })
}

function cambiarBtn() {
  let btnsub = document.getElementById('submitBtn')
  let btncancel = document.getElementById('cancelar')
  btnsub.innerText = 'MODIFICAR COMPRA'
  btnsub.classList.replace('btn-warning', 'btn-success')
  btnsub.type = 'button'
  btnsub.setAttribute('onclick', 'modificarCompra()')
  btncancel.innerHTML = 'CANCELAR EDICIÓN'
  btncancel.setAttribute('onclick', 'reiniciarBtn()')
  btncancel.classList.replace('btn-default', 'btn-secondary')
}

function reiniciarBtn() {
  let btnsub = document.getElementById('submitBtn')
  let btncancel = document.getElementById('cancelar')
  btnsub.innerText = 'INGRESAR COMPRA'
  btnsub.classList.replace('btn-success', 'btn-warning')
  btnsub.type = "submit"
  btnsub.removeAttribute('onclick', 'modificarCompra()')
  btncancel.innerHTML = 'Cancelar'
  btncancel.removeAttribute('onclick', 'reiniciarBtn()')
  btncancel.classList.replace('btn-secondary', 'btn-default')
  while (count != 1) {
    deleteProduct()
  }
  toastr.info('Ya puede cargar una nueva compra', 'AVISO:')
}

function volcarDatos(compra) {
  try {
    comprobante.value = compra.TipoComprobante
    comprobante.dispatchEvent(new Event('change'))
    document.getElementById('razonSocial').value = compra.RazonSocial
    document.getElementById('condicion').value = compra.CondicionFiscal
    document.getElementById('tipo').value = compra.TipoProveedor
    document.getElementById('numFc').value = compra.NumeroFactura
    fechaFc.value = compra.FechaFactura
    montoTotal.value = compra.MontoTotal
    ivaTotal.value = compra.MontoTotalIVA
    document.getElementById('cuit').value = compra.Cuit
    document.getElementById('observaciones').value = compra.Observaciones
    return compra.ListaProductosComprados
  } catch (err) {
    console.error(err)
  }
}

async function cargarTareas(compra) {
  listaProveedores.contains(compra.Proveedor) ? listaProveedores.value = compra.Proveedor : toastr.error('El proveedor de la compra: "' + compraActual.Proveedor + '" no fue encontrado en la base de datos')
  presentarDatosProveedor(listaProveedores.selectedOptions[0].getAttribute('data-id'))
  await listarProductos(listaProductos, listaProveedores.value)
  limpiarFilasProductos(filaProducto)
  return compra
}

function agregarProductos(productos) {
  for (let i = 0; i < productos.length; i++) {
    let productoActual = productos[i]
    if (i == 0) {
      marca.value = productoActual.Marca
      precio.value = productoActual.Precio
      cantidad.value = productoActual.Cantidad
      subtotal.value = productoActual.Subtotal
      iva.value = productoActual.PorcentajeIVA
      ivaPesos.value = productoActual.MontoIVA
      precioBruto.value = productoActual.PrecioBruto
      listaProductos.contains(productoActual.Producto) ? listaProductos.value = productoActual.Producto : toastr.error('El producto: "' + productoActual.Producto + '" no fue encontrado en la base de datos', 'AVISO IMPORTANTE:')
    } else {
      addProduct()
      document.getElementById('marca' + i).value = productoActual.Marca
      document.getElementById('precio' + i).value = productoActual.Precio
      document.getElementById('cantidad' + i).value = productoActual.Cantidad
      document.getElementById('subtotal' + i).value = productoActual.Subtotal
      document.getElementById('iva' + i).value = productoActual.PorcentajeIVA
      document.getElementById('ivaPesos' + i).value = productoActual.MontoIVA
      document.getElementById('precioBruto' + i).value = productoActual.PrecioBruto
      document.getElementById('listaProductos' + i).contains(productoActual.Producto) ? document.getElementById('listaProductos' + i).value = productoActual.Producto : toastr.error('El producto: "' + productoActual.Producto + '" no fue encontrado en la base de datos', 'AVISO IMPORTANTE:')
    }
  }
}

// Creacion de compras en base
async function modificarCompra() {
  let nombreProv = listaProveedores.options[listaProveedores.selectedIndex].value
  let jsonProductos = [{
    Producto: listaProductos.value,
    Marca: marca.value,
    Precio: parseFloat(precio.value),
    Cantidad: parseFloat(cantidad.value),
    Subtotal: parseFloat(subtotal.value),
    PorcentajeIVA: parseFloat(iva.value),
    MontoIVA: parseFloat(ivaPesos.value),
    PrecioBruto: parseFloat(precioBruto.value),
  }]
  // Handler para el caso que haya mas de un producto
  for (let i = 1; i < count; i++) {
    let producto = {
      Producto: document.getElementById('listaProductos' + i).value,
      Marca: document.getElementById('marca' + i).value,
      Precio: parseFloat(document.getElementById('precio' + i).value),
      Cantidad: parseFloat(document.getElementById('cantidad' + i).value),
      Subtotal: parseFloat(document.getElementById('subtotal' + i).value),
      PorcentajeIVA: parseFloat(document.getElementById('iva' + i).value),
      MontoIVA: parseFloat(document.getElementById('ivaPesos' + i).value),
      PrecioBruto: parseFloat(document.getElementById('precioBruto' + i).value),
    }
    jsonProductos.push(producto);
  }
  // json con la compra con productos
  let jsonEdit = {
    Proveedor: nombreProv,
    RazonSocial: document.getElementById('razonSocial').value,
    CondicionFiscal: document.getElementById('condicion').value,
    TipoProveedor: document.getElementById('tipo').value,
    NumeroFactura: document.getElementById('numFc').value,
    FechaFactura: fechaFc.value,
    MontoTotal: parseFloat(montoTotal.value),
    MontoTotalIVA: parseFloat(ivaTotal.value),
    Cuit: document.getElementById('cuit').value,
    TipoComprobante: comprobante.value,
    Observaciones: document.getElementById('observaciones').value,
    ListaProductosComprados: jsonProductos,
  }

  await db.collection('compras').doc(idEditable).update(jsonEdit)
    .then(() => {
      if (document.getElementById('guardarPrecio').value == "Si") {
        cambiarPrecio(listaProductos[listaProductos.selectedIndex].id, parseFloat(jsonProductos[0].Precio));
      }
      for (let i = 1; i < count; i++) {
        if (document.getElementById('guardarPrecio' + i).value == "Si") {
          cambiarPrecio(document.getElementById('listaProductos' + i)[document.getElementById('listaProductos' + i).selectedIndex].id, parseFloat(jsonProductos[i].Precio));
        }
      }
    })
    .then(() => {
      reiniciarBtn()
      uploadTable()
      formCompras.reset()
      while (count != 1) {
        deleteProduct();
      }
      idEditable = ""
    })
    .catch(err => {
      console.error(err)
    })
}