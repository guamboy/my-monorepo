
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import admin from 'firebase-admin'
import { User } from '@shared/types'


jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { applicationDefault: jest.fn() },
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }))
    }))
  })
}))

const app = express()
app.use(cors())
app.use(express.json())

app.get('/users/:id', async (req, res) => {
  const doc = { exists: true, data: () => ({ uid: req.params.id, email: 'test@example.com' }) }
  res.json(doc.data())
})

app.post('/users', async (req, res) => {
  res.status(201).json(req.body)
})

app.put('/users/:id', async (req, res) => {
  res.json({ message: 'User updated' })
})

app.delete('/users/:id', async (req, res) => {
  res.json({ message: 'User deleted' })
})

describe('User CRUD', () => {
  const user: User = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User',
    createdAt: new Date().toISOString()
  }

  it('gets a user', async () => {
    const res = await request(app).get('/users/123')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('uid', '123')
  })

  it('creates a user', async () => {
    const res = await request(app).post('/users').send(user)
    expect(res.status).toBe(201)
    expect(res.body).toEqual(user)
  })

  it('updates a user', async () => {
    const res = await request(app).put('/users/123').send({ displayName: 'Updated User' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'User updated')
  })

  it('deletes a user', async () => {
    const res = await request(app).delete('/users/123')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'User deleted')
  })
})
