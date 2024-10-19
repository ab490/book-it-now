import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SignupProps {
    onLogin: (userType: 'organizer' | 'attendee') => void;
}

function Signup({ onLogin }: SignupProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<'organizer' | 'attendee'>('attendee');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const signupData = {
            email,
            password,
            userType,
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User signed up:', data);
                onLogin(userType);
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSignup} className="w-50 mx-auto">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
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
                        Password
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
                <div className="mb-3">
                    <label htmlFor="userType" className="form-label">
                        Role
                    </label>
                    <select
                        id="userType"
                        className="form-select"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as 'organizer' | 'attendee')}
                    >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                    </select>
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-block">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Signup;