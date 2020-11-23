const formClientes = document.getElementById('formClientes')
let idEditable

$(window).on("load", function () {
  uploadTable();
  formClientes.addEventListener('submit', function (e) {
    registrarCliente()
    e.preventDefault()
  })
})

function registrarCliente() {
  let jsonCliente = {
    Nombre: document.getElementById('nombre').value,
    Alias: document.getElementById('alias').value,
    Telefono: document.getElementById('tel').value,
    Direccion: document.getElementById('dir').value,
    Localidad: document.getElementById('localidad').value,
    CtaCte: 0,
    Deuda: 0,
    ComprasAcumuladas: 0,
    CantidadVentas: 0,
    Ventas: []
  }

  db.collection('clientes').doc().set(jsonCliente)
    .then(() => {
      uploadTable()
      formClientes.reset()
    })
    .catch(err => {
      console.log(err);
    })
}

function mostrarCliente(clienteId) {
  db.collection('clientes').doc(clienteId).get()
    .then(doc => {
      completarModal(doc.data(), clienteId)
      $('#modalEdit').modal('show');
    })
    .catch(err => {
      console.error(err)
    })
}

function completarModal(data, clienteId) {
  document.getElementById('nombreEdit').value = data.Nombre
  document.getElementById('aliasEdit').value = data.Alias
  document.getElementById('telEdit').value = data.Telefono
  document.getElementById('dirEdit').value = data.Direccion
  document.getElementById('localidadEdit').value = data.Localidad
  idEditable = clienteId
}

async function editarCliente() {
  let jsonEditado = {
    Nombre: document.getElementById('nombreEdit').value,
    Alias: document.getElementById('aliasEdit').value,
    Telefono: document.getElementById('telEdit').value,
    Direccion: document.getElementById('dirEdit').value,
    Localidad: document.getElementById('localidadEdit').value,
  }
  await db.collection('clientes').doc(idEditable).update(jsonEditado)
    .then(() => {
      uploadTable()
    })
    .catch(err => {
      console.error(err)
    })

}

function preguntaBorrar(idCliente, nombre) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById('idBorrar').value = idCliente;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

async function eliminarCliente() {
  let id = document.getElementById('idBorrar').value
  await db.collection('clientes').doc(id).delete()
    .then(() => {
      uploadTable();
      id.value = ''
      document.getElementById('borrarBtn').setAttribute('disabled', 'disabled')
    })
    .catch(err => {
      console.error(err);
    })
}

function uploadTable() {
  let datos = []
  db.collection('clientes').get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {
        const cliente = doc.data()
        cliente.ClienteId = doc.id
        datos.push(cliente)
      })
    })
    .then(() => {
      $('#tablaClientes').DataTable().clear().destroy();
      $('#tablaClientes').DataTable({
        pageLength: 25,
        data: datos,
        columns: [{
            "data": "Nombre"
          },
          {
            "data": "Alias"
          },
          {
            "data": "Telefono"
          },
          {
            "data": "Localidad"
          },
          {
            "data": "ClienteId",
            "data": "Nombre",
            "data": function (data, type, row) {
              return `<a href="./panelClientes.html" class="btn btn-sm btn-info">Acceder <i class="fa fa-user-cog"></i></a>
            <a class="btn btn-sm btn-warning" href="#" onclick="mostrarCliente('${data.ClienteId}')">Editar <i class="fa fa-edit" ></i></a>
            <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data.ClienteId}', '${data.Nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            }
          }
        ]
      });
      formClientes.reset();
    })
    .catch(err => {
      console.error(err)
    })
}