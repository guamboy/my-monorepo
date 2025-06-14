
import { useState } from 'react'
import { auth, googleProvider, microsoftProvider } from './firebase'
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { User } from '@shared/types'
import { getErrorMessage } from '@shared/utils'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithPopup(auth, microsoftProvider)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const test: User ={
    uid: 'test-uid',
    email: '',
    createdAt: 'new Date()',
  }

  return (
    <div>
      <h1>Auth Demo</h1>
      {error && <p>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button onClick={handleMicrosoftSignIn}>Sign in with Microsoft</button>
    </div>
  )
}

export default App
