// src/components/Cart.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaPlusCircle, FaMinusCircle, FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import CheckoutModal from './checkoutModal'; // Importa o Modal
import './cart.css'; // Importa o CSS

// --- Funções Helper ---
const formatDate = (dateString) => {
    if (!dateString) return "Data não informada";
    try { return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch (error) { console.error("Erro ao formatar data:", dateString, error); return "Data inválida"; }
};
const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'N/A';
    return `MZN ${price.toFixed(2).replace('.', ',')}`;
};

// --- Componente Cart ---
function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart, // Obtém clearCart
    cartSubtotal, // O subtotal agora será o total final
    // Removido: cartTaxes, cartTotal, taxRate
  } = useCart();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const fallbackImage = 'https://via.placeholder.com/80x80/CCCCCC/FFFFFF?text=Sem+Img';

  const handleOpenCheckoutModal = () => setIsCheckoutModalOpen(true);
  const handleCloseCheckoutModal = () => setIsCheckoutModalOpen(false);

  const handleCheckoutSubmit = (formData) => {
    console.log("Compra finalizada com os dados:", formData);
    alert(`Compra realizada com sucesso!\nNome: ${formData.name}\nBI: ${formData.bi}\nPagamento: ${formData.paymentNumber}`);
    clearCart(); // Limpa o carrinho após sucesso
    handleCloseCheckoutModal(); // Fecha o modal
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title"><FaShoppingCart /> Seu Carrinho</h2>
        <p className="empty-cart">Seu carrinho de compras está vazio.</p>
         <div className="cart-actions">
            <Link to="/" className="continue-shopping-btn"> Voltar aos Eventos </Link>
         </div>
      </div>
    );
  }

  // Calcula o total final (que agora é igual ao subtotal)
  const finalTotal = cartSubtotal;

  return (
    <> {/* Fragment */}
      <div className="cart-page">
         <h2 className="cart-title"><FaShoppingCart /> Seu Carrinho</h2>
          <div className="cart-grid">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                   <img
                     src={item.imageUrl || fallbackImage}
                     alt={`Imagem ${item.eventName}`}
                     className="cart-item-image"
                     onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                   />
                    <div className="item-details">
                        <span className="event-name">{item.eventName}</span>
                        <span className="event-info"> {formatDate(item.eventDate)} - {item.eventLocation} - Tipo: {item.ticketType.toUpperCase()} </span>
                    </div>
                    <div className="item-controls-group">
                        <div className="item-price">{formatPrice(item.price)}</div>
                        <div className="quantity-control">
                            <button onClick={() => decreaseQuantity(item.id)} className="quantity-btn" disabled={item.quantity <= 1} aria-label="Diminuir quantidade"> <FaMinusCircle /> </button>
                            <span className="quantity-display">{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)} className="quantity-btn" aria-label="Aumentar quantidade"> <FaPlusCircle /> </button>
                        </div>
                    </div>
                    <div className="item-subtotal"> {formatPrice(item.price * item.quantity)} </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn" aria-label="Remover item"> <FaTrashAlt /> </button>
                 </div>
               ))}
          </div>

         {/* Sumário do Carrinho Atualizado - Sem Taxas */}
         <div className="cart-summary">
             {/* Removida a linha do Subtotal explícito se apenas o Total for necessário */}
             {/* <div className="summary-line"> Subtotal: <strong>{formatPrice(cartSubtotal)}</strong> </div> */}
             {/* Removida a linha de Taxas */}
             {/* <div className="summary-line"> Taxas ({ (taxRate * 100).toFixed(0) }%): <strong>{formatPrice(cartTaxes)}</strong> </div> */}
             {/* A linha Total agora usa o valor final (que é o antigo subtotal) */}
             <div className="summary-line summary-total"> Total: <strong>{formatPrice(finalTotal)}</strong> </div>
         </div>

        <div className="cart-actions">
          <Link to="/" className="continue-shopping-btn">
            Continuar Comprando
          </Link>
          <button
             className="checkout-btn"
             onClick={handleOpenCheckoutModal} // Abre o modal
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      {/* Renderiza o Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckoutModal}
        onSubmit={handleCheckoutSubmit}
      />
    </>
  );
}

export default Cart;