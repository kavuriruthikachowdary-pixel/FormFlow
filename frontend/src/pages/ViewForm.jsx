import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const ViewForm = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            const { data } = await API.get(`/forms/${id}`);
            setForm(data);
            setAnswers(data.questions.map(q => ({ questionId: q._id, answer: '' })));
        };
        fetchForm();
    }, [id]);

    const handleAnswerChange = (qIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[qIndex].answer = value;
        setAnswers(newAnswers);
    };

    const handleCheckboxChange = (qIndex, value, checked) => {
        const newAnswers = [...answers];
        const currentAnswer = Array.isArray(newAnswers[qIndex].answer) 
            ? newAnswers[qIndex].answer 
            : [];
        
        if (checked) {
            newAnswers[qIndex].answer = [...currentAnswer, value];
        } else {
            newAnswers[qIndex].answer = currentAnswer.filter(v => v !== value);
        }
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/responses/${id}`, { answers });
            setSubmitted(true);
        } catch (err) {
            alert('Error submitting response');
        }
    };

    if (!form) return <div className="glass-card"><p>Loading form...</p></div>;
    if (submitted) return (
        <div className="glass-card auth-form">
            <h2>Success!</h2>
            <p>Your response has been recorded.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Submit another response</button>
        </div>
    );

    return (
        <div className="glass-card">
            <h1>{form.title}</h1>
            <p>{form.description}</p>
            <form onSubmit={handleSubmit}>
                {form.questions.map((q, qIndex) => (
                    <div key={q._id || qIndex} className="form-item">
                        <h3 style={{ marginBottom: '1rem' }}>{q.questionText}</h3>
                        
                        {q.type === 'text' && (
                            <input 
                                type="text" 
                                placeholder="Short answer" 
                                value={answers[qIndex]?.answer || ''} 
                                onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                                required={q.required}
                            />
                        )}

                        {(q.type === 'multiple-choice' || q.type === 'radio') && q.options.map(opt => (
                            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <input 
                                    type="radio" 
                                    name={`q-${qIndex}`} 
                                    value={opt} 
                                    onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                                    style={{ width: 'auto', marginBottom: 0 }}
                                    required={q.required}
                                />
                                <label style={{ color: 'white' }}>{opt}</label>
                            </div>
                        ))}

                        {q.type === 'checkbox' && q.options.map(opt => (
                            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    value={opt} 
                                    onChange={(e) => handleCheckboxChange(qIndex, opt, e.target.checked)}
                                    style={{ width: 'auto', marginBottom: 0 }}
                                />
                                <label style={{ color: 'white' }}>{opt}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Submit Response</button>
            </form>
        </div>
    );
};

export default ViewForm;
