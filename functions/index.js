const functions = require('firebase-functions');
const express = require('express')
const app = express()
var admin = require("firebase-admin");
var serviceAccount = require("./cert.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-leanim.firebaseio.com"
});

app.get('/clientes/:id', (req, res) => {
  db.collection('clientes')
    .doc(req.params.id)
    .get()
    .then(cliente => {
      let datos = cliente.data()
      return res.send(datos)
    })
    .catch(err => console.error(err))
})

app.get('/hola', (req, res) => {
  return res.send('HOLAAAAAAAAAAAAAA')
})

exports.app = functions.https.onRequest(app)