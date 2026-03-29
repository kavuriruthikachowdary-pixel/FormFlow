import { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/signup', { username, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Signup failed';
            setError(msg);
        }
    };

    return (
        <div className="auth-form glass-card">
            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="btn-primary">Signup</button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
