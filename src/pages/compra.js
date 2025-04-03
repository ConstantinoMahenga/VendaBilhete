import React, { useState } from 'react';
import { formatPrice } from './EventSection'; // Reutilizando a função formatPrice

const ShoppingCart = ({ selectedEvent, handleCheckout }) => {
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  // Calcula o subtotal com base na quantidade e no preço
  const normalPrice = selectedEvent.prices.normal;
  const vipPrice = selectedEvent.prices.vip;
  const price = selectedEvent.ticketType === 'normal' ? normalPrice : vipPrice;

  const subtotal = price * quantity;
  const total = subtotal + 10.0; // Taxas fixas de exemplo (pode ser alterado para uma taxa dinâmica)

  const handleQuantityChange = (operation) => {
    if (operation === 'increase' && quantity < 10) {
      setQuantity(quantity + 1);
    } else if (operation === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)' }}>
      <h2>Carrinho de Compras</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <img
          src={selectedEvent.imageUrl || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Sem+Imagem'}
          alt={selectedEvent.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
        />
        <div>
          <h3>{selectedEvent.name}</h3>
          <p>{selectedEvent.description}</p>
          <p><strong>Tipo de Ingresso:</strong> {selectedEvent.ticketType === 'normal' ? 'Normal' : 'VIP'}</p>
        </div>
      </div>

      {/* Quantidade */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Quantidade:</strong>
        <button onClick={() => handleQuantityChange('decrease')}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange('increase')}>+</button>
      </div>

      {/* Subtotal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span><strong>Subtotal:</strong></span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {/* Taxas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span><strong>Taxas:</strong></span>
        <span>{formatPrice(10.0)}</span> {/* Taxa fixa de exemplo */}
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span><strong>Total:</strong></span>
        <span>{formatPrice(total)}</span>
      </div>

      {/* Aplicar desconto */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="discount">Aplicar Desconto:</label>
        <input
          id="discount"
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          min="0"
          max="100"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      {/* Botão de compra */}
      <button onClick={() => handleCheckout(total)} style={{ padding: '10px 20px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '8px' }}>
        Efectuar Compra
      </button>
    </div>
  );
};

export default ShoppingCart;
