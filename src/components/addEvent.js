import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseconfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function AddEventPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        description: '',
        priceNormal: '',
        priceVip: '',
        imageUrl: ''
    });
    const [imageBase64, setImageBase64] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertToBase64(file);
                setImageBase64(base64);
                setFormData(prevData => ({ ...prevData, imageUrl: base64 }));
            } catch (error) {
                console.error("Erro ao converter imagem:", error);
                setStatusMessage('Erro: Não foi possível carregar a imagem.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setStatusMessage('');

        try {
            const normalPriceNumber = parseFloat(formData.priceNormal);
            const vipPriceNumber = parseFloat(formData.priceVip);

            let eventTimestamp = null;
            if (formData.date) {
                eventTimestamp = Timestamp.fromDate(new Date(formData.date));
            } else {
                setStatusMessage('Erro: Data e Hora são obrigatórios.');
                setIsSubmitting(false);
                return;
            }

            if (!formData.name.trim() || !formData.location.trim()) {
                setStatusMessage('Erro: Nome e Local são obrigatórios.');
                setIsSubmitting(false);
                return;
            }

            const eventData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                date: eventTimestamp,
                location: formData.location.trim(),
                imageUrl: imageBase64 || null,
                prices: {
                    normal: !isNaN(normalPriceNumber) ? normalPriceNumber : null,
                    vip: !isNaN(vipPriceNumber) ? vipPriceNumber : null,
                },
                createdAt: Timestamp.now()
            };

            await addDoc(collection(db, 'events'), eventData);
            setStatusMessage(`Evento "${eventData.name}" adicionado com sucesso!`);
            setFormData({
                name: '', date: '', location: '', description: '',
                priceNormal: '', priceVip: '', imageUrl: ''
            });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error("Erro ao adicionar evento: ", error);
            setStatusMessage(`Erro ao adicionar evento: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Estilo dos campos e da página
    const pageStyle = { padding: '20px', maxWidth: '500px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
    const titleStyle = { textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem', fontWeight: 'bold' };
    const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
    const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '10px', fontSize: '1rem' };
    const buttonStyle = { padding: '12px', borderRadius: '6px', backgroundColor: '#007bff', color: '#fff', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' };
    const buttonDisabledStyle = { ...buttonStyle, backgroundColor: '#6c757d', cursor: 'not-allowed', opacity: 0.7 };
    const messageStyle = { marginTop: '15px', textAlign: 'center', padding: '10px', borderRadius: '6px', fontSize: '1rem' };
    const successStyle = { ...messageStyle, backgroundColor: '#d1e7dd', color: '#0f5132', border: '1px solid #badbcc' };
    const errorStyle = { ...messageStyle, backgroundColor: '#f8d7da', color: '#842029', border: '1px solid #f5c2c7' };

    return (
        <div style={pageStyle}>
            <h2 style={titleStyle}>Adicionar Novo Evento</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input type="text" name="name" placeholder="Nome do Evento *" value={formData.name} onChange={handleChange} style={inputStyle} required />
                <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} required />
                <input type="datetime-local" name="date" placeholder="Data e Hora *" value={formData.date} onChange={handleChange} style={inputStyle} required />
                <input type="text" name="location" placeholder="Local *" value={formData.location} onChange={handleChange} style={inputStyle} required />
                <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} style={inputStyle} rows="4"></textarea>
                <input type="number" name="priceNormal" placeholder="Preço Normal (MZN)" value={formData.priceNormal} onChange={handleChange} style={inputStyle} min="0" step="0.01" />
                <input type="number" name="priceVip" placeholder="Preço VIP (MZN)" value={formData.priceVip} onChange={handleChange} style={inputStyle} min="0" step="0.01" />
                {statusMessage && (
                    <div style={statusMessage.includes('Erro:') ? errorStyle : successStyle}>
                        {statusMessage}
                    </div>
                )}
                <button type="submit" style={isSubmitting ? buttonDisabledStyle : buttonStyle} disabled={isSubmitting}>
                    {isSubmitting ? 'Adicionando...' : 'Adicionar Evento'}
                </button>
            </form>
        </div>
    );
}

export default AddEventPage;
