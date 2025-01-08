import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SignupProps {
    onLogin: (userType: 'organizer' | 'attendee', user: { firstName: string, email: string, phone: string }) => void;
}

function Signup({ onLogin }: SignupProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState<'organizer' | 'attendee'>('attendee');

    //    const uri = `${process.env.REACT_APP_API_URL}/api/users/signup`;
    const uri = `https://book-it-now-backend.onrender.com/api/users/signup`;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const signupData = {
            firstName,
            lastName,
            email,
            password,
            phone,
            userType,
        };

        try {
            const response = await fetch(uri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData),
            });

            console.log('Environment Variable:', process.env.REACT_APP_API_URL);
            console.log('Full URL /api/users/signup:', uri);

            if (response.ok) {
                const data = await response.json();
                console.log('User signed up:', data);
                onLogin(userType, { firstName: data.firstName, email: data.email, phone: data.phone });
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSignup} className="w-50 mx-auto">
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="firstName" className="form-label">
                            <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                First Name
                            </p>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col">
                        <label htmlFor="lastName" className="form-label">
                            <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                                Last Name
                            </p>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
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
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                            Phone Number
                        </p>
                    </label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="userType" className="form-label">
                        <p style={{ color: '#e0e0e0', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                            Role
                        </p>
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
