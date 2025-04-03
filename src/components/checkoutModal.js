import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

// --- Definição dos Objetos de Estilo Inline Aprimorados ---

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(3px)',
};

const modalContentStyle = {
  backgroundColor: '#ffffff',
  padding: '25px 30px', // Reduzi o padding interno
  borderRadius: '10px',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  position: 'relative',
  width: '85%',
  maxWidth: '380px', // Diminuição da largura máxima do popup
  color: '#343a40',
  borderTop: '4px solid #007bff',
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  background: 'transparent',
  border: 'none',
  fontSize: '1.4rem',
  cursor: 'pointer',
  color: '#adb5bd',
  padding: '4px',
  lineHeight: 1,
  transition: 'color 0.2s ease',
};

const h2Style = {
  marginTop: '0',
  marginBottom: '1.5rem', 
  textAlign: 'center',
  color: '#212529',
  fontWeight: 700,
  fontSize: '1.4rem', // Título um pouco menor
};

const formGroupStyle = {
  marginBottom: '1.2rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontWeight: 600,
  fontSize: '0.9rem',
  color: '#495057',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px', 
  border: '1px solid #ced4da',
  borderRadius: '6px',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  backgroundColor: '#f8f9fa',
  color: '#495057',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const baseSubmitButtonStyle = {
  width: '100%',
  padding: '12px 18px', // Redução do padding do botão
  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '6px', 
  fontSize: '1rem', // Texto menor
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  boxShadow: '0 3px 10px rgba(0, 123, 255, 0.3)',
  transition: 'background 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
};

const disabledSubmitButtonStyle = {
  ...baseSubmitButtonStyle,
  background: 'linear-gradient(135deg, #adb5bd 0%, #6c757d 100%)',
  boxShadow: 'none',
  cursor: 'not-allowed',
  opacity: 0.7,
};

// --- Componente CheckoutModal ---
function CheckoutModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setPaymentNumber('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !email || !paymentNumber) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Dados da Compra:', { name, email, paymentNumber });
      onSubmit({ name, email, paymentNumber });
      setIsSubmitting(false);
    }, 500);
  };

  if (!isOpen) {
    return null;
  }

  const submitButtonStyle = isSubmitting ? disabledSubmitButtonStyle : baseSubmitButtonStyle;

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <button style={modalCloseButtonStyle} onClick={onClose} aria-label="Fechar modal">
          <FaTimes />
        </button>
        <h2 style={h2Style}>Finalizar Compra</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="checkout-name" style={labelStyle}>Nome Completo:</label>
            <input
              type="text"
              id="checkout-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="checkout-email" style={labelStyle}>Email:</label>
            <input
              type="email"
              id="checkout-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              placeholder="seuemail@dominio.com"
              style={inputStyle}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="checkout-payment" style={labelStyle}>Número para Pagamento:</label>
            <input
              type="tel"
              id="checkout-payment"
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              placeholder="+258 8XXXXXXXX"
              required
              aria-required="true"
              style={inputStyle}
            />
          </div>
          <button type="submit" style={submitButtonStyle} disabled={isSubmitting}>
            {isSubmitting ? 'Processando...' : 'Comprar'}
          </button>
        </form>
      </div>
    </div>
  );
}

CheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CheckoutModal;

