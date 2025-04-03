// src/context/CartContext.js
import React, { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const generateCartItemId = (eventId, ticketType) => `${eventId}-${ticketType}`;
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (event, ticketType, price) => {
    setCartItems(prevItems => {
      const itemId = generateCartItemId(event.id, ticketType);
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Inclui imageUrl ao adicionar novo item
        return [...prevItems, {
          id: itemId,
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          eventLocation: event.location,
          imageUrl: event.imageUrl, // Salva a URL da imagem
          ticketType: ticketType,
          price: price,
          quantity: 1,
        }];
      }
    });
  };

  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0) // Remove se quantidade for 0
    );
  };

   const removeFromCart = (itemId) => {
     setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
   };

   // Função para limpar o carrinho
   const clearCart = () => {
     setCartItems([]);
     console.log("Carrinho limpo!");
   };

  // Cálculos Memoizados
  const cartSubtotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  const taxRate = 0.05; // Exemplo: Taxa de 5% definida aqui

  const cartTaxes = useMemo(() => cartSubtotal * taxRate, [cartSubtotal, taxRate]);

  const cartTotal = useMemo(() => cartSubtotal + cartTaxes, [cartSubtotal, cartTaxes]);

  // Valor fornecido pelo Contexto
  const value = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart, // <-- Exportando clearCart
    cartSubtotal,
    cartTaxes,
    cartTotal,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    taxRate, // <-- Exportando taxRate
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = { children: PropTypes.node.isRequired };

// Hook customizado para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};