import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LoginProps {
    onLogin: (userType: 'organizer' | 'attendee', user: { firstName: string, email: string, phone: string }) => void;
}

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call your backend login API here
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User logged in:', data);
                onLogin(data.userType, { firstName: data.firstName, email: data.email, phone: data.phone });
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleLogin} className="w-50 mx-auto">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                            Email address
                        </p>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                            Password
                        </p>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-block">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;