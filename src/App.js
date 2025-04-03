import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import EventSection from './components/eventSection'; // Verifique se o nome do arquivo é EventSection ou eventSection
import Cart from './components/Cart';
import HomePage from './pages/HomePage'
import AddEvent from './components/addEvent';

// --- Importações Atualizadas ---
import { FiHome, FiShoppingCart } from 'react-icons/fi'; // Usando Feather Icons
import logo from './context/logo.png'; // <-- CORRIGIDO O CAMINHO

// Componente opcional para o contador (atualizado com FiShoppingCart)
function CartIconWithCount() {
  const { itemCount } = useCart();
  const cartIconContainerStyle = { position: 'relative', display: 'inline-block' };
  const itemCountBadgeStyle = {
    position: 'absolute', top: '-10px', right: '-12px', // Ajustado para ícone maior
    background: '#e63946',
    color: 'white', borderRadius: '50%', padding: '3px 7px', // Levemente maior
    fontSize: '0.8rem', // Levemente maior
    fontWeight: 'bold', lineHeight: '1', minWidth: '18px',
    textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };
  return (
    <span style={cartIconContainerStyle}>
      <FiShoppingCart /> {/* Ícone base */}
      {itemCount > 0 && <span style={itemCountBadgeStyle}>{itemCount}</span>}
    </span>
  );
}

// Componente Principal App
function App() {

  // Estilo base para os links dos ícones
  const navIconLinkStyle = {
    color: 'gold', // <-- COR VOLTOU PARA DOURADO
    textDecoration: 'none',
    fontSize: '1.5rem', // <-- TAMANHO DO ÍCONE AUMENTADO
    verticalAlign: 'middle',
    padding: '0 12px', // Padding ligeiramente aumentado
    transition: 'color 0.2s ease-in-out'
  };

  // Cor para o hover (ex: branco)
  const hoverColor = '#ffffff';

  return (
    <Router>
      <CartProvider>
        {/* --- Barra de Navegação Atualizada --- */}
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 30px', // Padding horizontal aumentado
            background: 'black', // <-- COR DE FUNDO PRETA
            marginBottom: '30px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)' // Sombra um pouco mais visível
           }}>

            {/* Logo à Esquerda */}
            <Link to="/" title="Página Inicial">
                <img
                    src={logo}
                    alt="Logotipo da Empresa"
                    style={{
                        height: '45px', // Pode ajustar a altura do logo também
                        display: 'block'
                    }}
                />
            </Link>

            {/* Ícones à Direita */}
            <div>
                <Link
                    to="/"
                    style={navIconLinkStyle}
                    title="Eventos"
                    onMouseEnter={e => e.currentTarget.style.color = hoverColor} // Hover branco
                    onMouseLeave={e => e.currentTarget.style.color = navIconLinkStyle.color} // Restaura dourado
                >
                    <FiHome />
                </Link>
                <Link
                    to="/cart"
                    style={{...navIconLinkStyle, marginLeft: '10px'}} // Aumenta espaço antes do carrinho
                    title="Ver Carrinho"
                    onMouseEnter={e => e.currentTarget.style.color = hoverColor} // Hover branco
                    onMouseLeave={e => e.currentTarget.style.color = navIconLinkStyle.color} // Restaura dourado
                >
                    <CartIconWithCount />
                </Link>
            </div>
        </nav>

        {/* Conteúdo Principal */}
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path="/event" element={<EventSection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add" element={<AddEvent  />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;