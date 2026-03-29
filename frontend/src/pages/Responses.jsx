import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { ArrowLeft, Download } from 'lucide-react';

const Responses = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const formRes = await API.get(`/forms/${id}`);
            const respRes = await API.get(`/responses/${id}`);
            setForm(formRes.data);
            setResponses(respRes.data);
        };
        fetchData();
    }, [id]);

    const downloadCSV = () => {
        let csv = 'Submission Date,' + form.questions.map(q => q.questionText).join(',') + '\n';
        responses.forEach(r => {
            let row = [new Date(r.submittedAt).toLocaleString()];
            form.questions.forEach(q => {
                const answer = r.answers.find(a => a.questionId === q._id)?.answer || '';
                row.push(Array.isArray(answer) ? `"${answer.join(', ')}"` : `"${answer}"`);
            });
            csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `responses_${form.title}.csv`;
        a.click();
    };

    if (!form) return <div className="glass-card"><p>Loading...</p></div>;

    return (
        <div className="glass-card">
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#4f46e5', textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>Responses: {form.title}</h1>
                <button onClick={downloadCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={18} /> Download CSV
                </button>
            </div>
            <p style={{ marginBottom: '2rem' }}>Total Responses: {responses.length}</p>

            <div className="responses-table" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '1rem' }}>S.No</th>
                            <th style={{ textAlign: 'left', padding: '1rem' }}>Date</th>
                            {form.questions.map(q => (
                                <th key={q._id} style={{ textAlign: 'left', padding: '1rem' }}>{q.questionText}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((resp, idx) => (
                            <tr key={resp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{idx + 1}</td>
                                <td style={{ padding: '1rem' }}>{new Date(resp.submittedAt).toLocaleDateString()}</td>
                                {form.questions.map(q => {
                                    const ans = resp.answers.find(a => a.questionId === q._id)?.answer;
                                    return (
                                        <td key={q._id} style={{ padding: '1rem' }}>
                                            {Array.isArray(ans) ? ans.join(', ') : ans}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Responses;
