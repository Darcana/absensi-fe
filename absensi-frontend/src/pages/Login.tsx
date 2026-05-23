import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth.service'
import { useLocation } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [showPopup, setShowPopup] = useState(false)

const handleLogin = async () => {
  try {
    const data = await login(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('employee', JSON.stringify(data.employee))
    navigate('/dashboard')
  } catch (_err) {
    setError('Invalid email or password')
  }
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') handleLogin()
}


  useEffect(() => {
    if (location.state?.message) {
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)
      }, 3000)
    }
  }, [location.state])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow">
          {location.state.message}
        </div>
      )}
    </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Absensi App</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
         <button
            onClick={() => navigate(`/register`)}
            className="text-blue-600 text-sm hover:underline"
          >Register</button>
      </div>
    </div>
  )
}

export default Login