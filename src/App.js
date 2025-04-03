import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import EventSection from './components/eventSection';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import AddEvent from './components/addEvent';

// --- Importações ---
import { FiHome, FiShoppingCart } from 'react-icons/fi'; // Usando Feather Icons
import logo from './context/logo.png'; // Certifique-se que o caminho está correto

// Componente opcional para o contador
function CartIconWithCount() {
  const { itemCount } = useCart();
  const cartIconContainerStyle = { position: 'relative', display: 'inline-block' };
  const itemCountBadgeStyle = {
    position: 'absolute', top: '-10px', right: '-12px',
    // --- COR DO BADGE VERMELHA (JÁ ESTAVA) ---
    background: '#e63946', // Um vermelho vivo para o badge
    color: 'white', borderRadius: '50%', padding: '3px 7px',
    fontSize: '0.8rem', fontWeight: 'bold', lineHeight: '1', minWidth: '18px',
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

  // --- Estilo base para os links dos ícones ATUALIZADO ---
  const navIconLinkStyle = {
    // --- COR VERMELHA ---
    color: '#dc3545', // Vermelho (mesmo do botão danger do Bootstrap)
    textDecoration: 'none',
    fontSize: '1.5rem', // Tamanho do ícone
    verticalAlign: 'middle',
    padding: '0 12px',
    transition: 'color 0.2s ease-in-out'
  };

  // Cor para o hover (mantendo branco para contraste)
  const hoverColor = '#ffffff';

  return (
    <Router>
      <CartProvider>
        {/* --- Barra de Navegação --- */}
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 30px',
            background: 'black', // Fundo preto
            marginBottom: '30px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
           }}>

            {/* Logo à Esquerda */}
            <Link to="/" title="Página Inicial">
                <img
                    src={logo}
                    alt="Logotipo da Empresa"
                    style={{ height: '45px', display: 'block' }}
                />
            </Link>

            {/* Ícones à Direita */}
            <div>
                <Link
                    to="/"
                    style={navIconLinkStyle} // Aplica o estilo base (agora vermelho)
                    title="Eventos"
                    onMouseEnter={e => e.currentTarget.style.color = hoverColor} // Hover branco
                    onMouseLeave={e => e.currentTarget.style.color = navIconLinkStyle.color} // Restaura VERMELHO
                >
                    <FiHome />
                </Link>
                <Link
                    to="/cart"
                    style={{...navIconLinkStyle, marginLeft: '10px'}} // Aplica estilo base + margem
                    title="Ver Carrinho"
                    onMouseEnter={e => e.currentTarget.style.color = hoverColor} // Hover branco
                    onMouseLeave={e => e.currentTarget.style.color = navIconLinkStyle.color} // Restaura VERMELHO
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
          <Route path="/add" element={<AddEvent />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;