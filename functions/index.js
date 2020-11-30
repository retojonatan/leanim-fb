const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const serviceAccount = require('./credentials.json')
const app = express()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://leanim-crm-83458.firebaseio.com"
})

const db = admin.firestore()

app.get('/clientes/:id', (req, res) => {
  try {
    db.collection('clientes').doc(req.params.id).get()
      .then(doc => {
        let cliente = doc.data()
        return res.send(cliente)
      })
  } catch (error) {
    console.error(error)
  }
})

app.post('/api/products', async (req, res) => {
  await db.collection('products')
    .doc('/' + req.body.id + '/')
    .create({
      name: req.body.name
    })
  return res.status(204).json()
})

exports.app = functions.https.onRequest(app)