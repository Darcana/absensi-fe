import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/employee.service'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await register(name, email, password)
      navigate('/', {
      state: { message: 'Register succeed' }
    })
    } catch (err: any) {
        setError(err.message)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') handleRegister()
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Absensi App</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="Name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border p-2 rounded mb-6"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </div>
    </div>
  )
}

export default Register