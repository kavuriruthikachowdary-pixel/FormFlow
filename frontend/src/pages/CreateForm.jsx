import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Trash, Plus, Save } from 'lucide-react';

const CreateForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { type: 'text', questionText: '', options: [''], required: false }
    ]);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, { type: 'text', questionText: '', options: [''], required: false }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push('');
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/forms', { title, description, questions });
            navigate('/dashboard');
        } catch (err) {
            alert('Error creating form');
        }
    };

    return (
        <div className="glass-card">
            <h1>Create Form</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Form Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                    required 
                />
                <textarea 
                    placeholder="Form Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="questions-list">
                    {questions.map((q, index) => (
                        <div key={index} className="form-item">
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <input 
                                    type="text" 
                                    placeholder="Question Text" 
                                    value={q.questionText} 
                                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                                    required 
                                />
                                <select 
                                    value={q.type} 
                                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="text">Short Answer</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                </select>
                                <button type="button" onClick={() => removeQuestion(index)} style={{ background: 'none' }}>
                                    <Trash size={20} color="#ef4444" />
                                </button>
                            </div>

                            {q.type !== 'text' && (
                                <div style={{ marginLeft: '1rem' }}>
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input 
                                                type="text" 
                                                placeholder={`Option ${oIndex + 1}`} 
                                                value={opt} 
                                                onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                                                required 
                                            />
                                            <button type="button" onClick={() => removeOption(index, oIndex)} style={{ background: 'none' }}>
                                                <Trash size={16} color="#94a3b8" />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addOption(index)} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                                        + Add Option
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" onClick={addQuestion} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> Add Question
                    </button>
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={20} /> Save Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
