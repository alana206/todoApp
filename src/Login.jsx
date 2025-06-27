import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from './firebase'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isCreating && username === 'user' && password === 'pass') {
            onLogin()
        } else if (isCreating) {
            alert('Account created! (Demo only)')
            setIsCreating(false)
        } else {
            alert('Invalid credentials')
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider)
            onLogin()
        } catch (err) {
            alert('Google login failed')
            console.error(err)
        }
    }

    return (
        <div>
            <h1>{isCreating ? 'Create Account' : 'Login'}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">{isCreating ? 'Create Account' : 'Login'}</button>
            </form>
            <button
                type="button"
                onClick={handleGoogleLogin}
                style={{ marginTop: 10, background: '#4285F4', color: 'white' }}
            >
                Login with Google
            </button>
            <div style={{ marginTop: 10 }}>
                {isCreating ? (
                    <span>
                        Already have an account?{' '}
                        <button type="button" onClick={() => setIsCreating(false)}>Login</button>
                    </span>
                ) : (
                    <span>
                        No account?{' '}
                        <button type="button" onClick={() => setIsCreating(true)}>Create Account</button>
                    </span>
                )}
            </div>
        </div>
    )
}