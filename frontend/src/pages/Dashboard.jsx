import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Trash, Eye, BarChart, Copy } from 'lucide-react';

const Dashboard = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            const { data } = await API.get('/forms');
            setForms(data);
        };
        fetchForms();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this form?')) return;
        await API.delete(`/forms/${id}`);
        setForms(forms.filter(f => f._id !== id));
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Your Forms</h2>
                <Link to="/create" className="btn-primary" style={{ textDecoration: 'none' }}>+ New Form</Link>
            </div>
            {forms.length === 0 ? (
                <p>You haven't created any forms yet.</p>
            ) : (
                <div className="form-list">
                    {forms.map(form => (
                        <div key={form._id} className="form-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{form.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.875rem' }}>{new Date(form.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button 
                                    onClick={() => {
                                        const url = `${window.location.origin}/form/${form._id}`;
                                        navigator.clipboard.writeText(url);
                                        alert('Link copied to clipboard!');
                                    }}
                                    title="Copy shareable link"
                                    style={{ background: 'none', padding: 0 }}
                                >
                                    <Copy size={20} color="#94a3b8" />
                                </button>
                                <Link to={`/form/${form._id}`} title="View public form">
                                    <Eye size={20} color="#6366f1" />
                                </Link>
                                <Link to={`/responses/${form._id}`} title="View responses">
                                    <BarChart size={20} color="#10b981" />
                                </Link>
                                <button onClick={() => handleDelete(form._id)} style={{ background: 'none', padding: 0 }}>
                                    <Trash size={20} color="#ef4444" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
