
import express from 'express'
import cors from 'cors'
import admin from 'firebase-admin'
import { User } from '../../shared/types'

const app = express()
app.use(cors())
app.use(express.json())

// Initialize Firebase Admin
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : require('../../../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// CRUD Endpoints
app.get('/users/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get()
    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(doc.data())
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/users', async (req, res) => {
  try {
    const user: User = req.body
    await db.collection('users').doc(user.uid).set(user)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const user: Partial<User> = req.body
    await db.collection('users').doc(req.params.id).update(user)
    res.json({ message: 'User updated' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).delete()
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
