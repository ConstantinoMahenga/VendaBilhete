// src/components/Carousel.js (ou onde quer que esteja seu componente)

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// --- Importe a imagem local ---
import localBackgroundImage from '../background.jpeg'; // Ajuste o caminho se necessário

// --- Configuration ---
const placeholderImage = "https://via.placeholder.com/1200x400/CCCCCC/FFFFFF?text=Carregando...";
const errorImage = "https://via.placeholder.com/1200x400/FF7F7F/FFFFFF?text=Erro";
const slideTexts = [
    { title: "Shows Inesquecíveis", subtitle: "Vibre com seus artistas favoritos ao vivo." },
    { title: "Festivais de Música", subtitle: "A energia contagiante que você procura." },
    { title: "Eventos Culturais", subtitle: "Explore arte, teatro e muito mais." },
    { title: "Noites de Comédia", subtitle: "Garanta suas risadas com os melhores humoristas." },
];
const textChangeInterval = 5000;

// --- Component ---

function Carousel({ onExplore }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [imageDisplaySource, setImageDisplaySource] = useState(placeholderImage);

    useEffect(() => {
        setImageDisplaySource(localBackgroundImage);
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % slideTexts.length);
        }, textChangeInterval);
        return () => clearInterval(interval);
    }, []);

    const handleImageError = (e) => {
        if (e.target.src !== errorImage) {
             console.error("Erro ao exibir imagem local do carrossel:", e.target.src);
             e.target.onerror = null;
             setImageDisplaySource(errorImage);
        }
    };

    const currentText = slideTexts[currentTextIndex] || { title: "Eventos Incríveis", subtitle: "Descubra novas experiências." };

    // --- Estilos ---
    const carouselStyle = { /* ... (mantido igual) ... */
        position: 'relative', textAlign: 'center', color: 'white',
        backgroundColor: '#333', width: '100%', height: '400px',
        overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    };
    const imageStyle = { /* ... (mantido igual) ... */
        display: 'block', width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center center',
    };
    const textOverlayStyle = { /* ... (mantido igual) ... */
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        padding: '0 20px', width: '80%', maxWidth: '700px', zIndex: 2,
        transition: 'opacity 0.5s ease-in-out', opacity: 1,
    };
    const titleTextStyle = { /* ... (mantido igual) ... */
        fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2,
        textShadow: '0px 2px 8px rgba(0, 0, 0, 0.7)', marginBottom: '10px',
    };
    const subtitleStyle = { /* ... (mantido igual) ... */
        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 400,
        textShadow: '0px 1px 6px rgba(0, 0, 0, 0.7)', opacity: 0.9,
    };
    const gradientOverlayStyle = { /* ... (mantido igual) ... */
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 60%)',
        pointerEvents: 'none', zIndex: 1,
    };

    // --- Estilo do Botão Atualizado para VERMELHO ---
    const buttonStyle = {
         position: 'absolute',
         bottom: '40px',
         left: '50%',
         transform: 'translateX(-50%)',
         padding: '15px 35px',
         // --- COR VERMELHA ---
         // Exemplo com gradiente vermelho (Bootstrap danger)
         background: 'linear-gradient(145deg, #dc3545, #c82333)',
         // Ou uma cor sólida: background: '#dc3545',
         color: '#ffffff', // Texto branco continua bom
         borderRadius: '50px',
         fontSize: '1.1rem',
         fontWeight: 600,
         cursor: 'pointer',
         border: 'none',
         // --- SOMBRA VERMELHA ---
         boxShadow: '0 5px 15px rgba(200, 35, 51, 0.4)', // Sombra avermelhada
         transition: 'background 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease',
         zIndex: 2,
         textTransform: 'uppercase',
         letterSpacing: '0.5px',
    };

    // --- Render ---
    return (
        <section style={carouselStyle}>
            <img
                src={imageDisplaySource}
                alt="Plano de fundo do carrossel de eventos"
                style={imageStyle}
                onError={handleImageError}
            />
            <div style={gradientOverlayStyle}></div>
            <div key={currentTextIndex} style={textOverlayStyle}>
                <h2 style={titleTextStyle}>{currentText.title}</h2>
                <p style={subtitleStyle}>{currentText.subtitle}</p>
            </div>

            {/* Botão Explorar Eventos com handlers atualizados para VERMELHO */}
            <button
                onClick={onExplore}
                style={buttonStyle}
                 // --- EFEITOS HOVER/LEAVE VERMELHOS ---
                 onMouseEnter={(e) => {
                    // Escurece o vermelho no hover
                    e.target.style.background = 'linear-gradient(145deg, #c82333, #bd2130)';
                    // Ou cor sólida: e.target.style.background = '#c82333';
                    // Sombra vermelha mais pronunciada
                    e.target.style.boxShadow = '0 8px 20px rgba(200, 35, 51, 0.5)';
                 }}
                 onMouseLeave={(e) => {
                    // Volta para o vermelho padrão
                    e.target.style.background = 'linear-gradient(145deg, #dc3545, #c82333)';
                    // Ou cor sólida: e.target.style.background = '#dc3545';
                    // Volta para a sombra padrão
                    e.target.style.boxShadow = '0 5px 15px rgba(200, 35, 51, 0.4)';
                    e.target.style.transform = 'translateX(-50%) scale(1)'; // Garante reset do scale
                 }}
                 // Efeitos de clique mantidos
                 onMouseDown={(e) => e.target.style.transform = 'translateX(-50%) scale(0.97)'}
                 onMouseUp={(e) => e.target.style.transform = 'translateX(-50%) scale(1)'}
            >
                Explorar Eventos
            </button>
        </section>
    );
}

Carousel.propTypes = {
  onExplore: PropTypes.func.isRequired,
};

export default Carousel;