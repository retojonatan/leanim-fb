const functions = require('firebase-functions');
const express = require('express')
const engines = require('consolidate')
const admin = require("firebase-admin");

const firebaseApp = admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
// const auth = admin.auth();


const app = express()
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

app.get('/panelClientes/:id', (req, res) => {
  db.collection('clientes')
    .doc(req.params.id)
    .get()
    .then(doc => {
      let clienteData = doc.data()
      clienteData.Id = req.params.id
      return res.render('panelClientes', {
        clienteData
      })
    })
    .catch(err => console.error(err))
})


app.get('/', (req, res) => {
  return res.render('index')
})

exports.app = functions.https.onRequest(app)