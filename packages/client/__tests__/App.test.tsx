
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'
import { auth } from '../src/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

jest.mock('../src/firebase', () => ({
  auth: {},
  googleProvider: {},
  microsoftProvider: {}
}))

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn()
}))

describe('App', () => {
  it('renders registration form', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('handles registration', async () => {
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByText('Register'))
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password')
  })

  it('handles login', async () => {
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByText('Login'))
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password')
  })

  it('handles Google sign-in', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Sign in with Google'))
    expect(signInWithPopup).toHaveBeenCalled()
  })

  it('handles Microsoft sign-in', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Sign in with Microsoft'))
    expect(signInWithPopup).toHaveBeenCalled()
  })
})
