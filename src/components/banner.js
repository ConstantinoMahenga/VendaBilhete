// src/components/Carousel.js (ou onde quer que esteja seu componente)

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// --- Importe a imagem local ---
// !!! AJUSTE O CAMINHO E NOME DO ARQUIVO CONFORME NECESSÁRIO !!!
import localBackgroundImage from '../background.jpeg'; // Exemplo de caminho

// --- Configuration ---

// Não precisamos mais da URL externa para o fundo principal
// const backgroundImageUrl = "...";

// Fallback images (ainda úteis se a imagem local falhar por algum motivo raro, ou para o placeholder)
const placeholderImage = "https://via.placeholder.com/1200x400/CCCCCC/FFFFFF?text=Carregando..."; // Placeholder mais genérico
const errorImage = "https://via.placeholder.com/1200x400/FF7F7F/FFFFFF?text=Erro";

// Text content for each "slide" - This will cycle
const slideTexts = [
    { title: "Shows Inesquecíveis", subtitle: "Vibre com seus artistas favoritos ao vivo." },
    { title: "Festivais de Música", subtitle: "A energia contagiante que você procura." },
    { title: "Eventos Culturais", subtitle: "Explore arte, teatro e muito mais." },
    { title: "Noites de Comédia", subtitle: "Garanta suas risadas com os melhores humoristas." },
];

// Interval time for text change (in milliseconds)
const textChangeInterval = 5000; // 5 seconds

// --- Component ---

function Carousel({ onExplore }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    // O estado agora gerencia se mostra placeholder, a imagem local ou erro
    const [imageDisplaySource, setImageDisplaySource] = useState(placeholderImage); // Começa com placeholder

    useEffect(() => {
        // Define a fonte da imagem como a imagem local importada
        // Não precisamos mais de pré-carregamento complexo com new Image()
        // porque o processo de build do React já otimiza e disponibiliza a imagem importada.
        setImageDisplaySource(localBackgroundImage);

        // Configura o intervalo para trocar de *texto*
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % slideTexts.length);
        }, textChangeInterval);

        // Limpa o intervalo quando o componente desmonta
        return () => clearInterval(interval);

    }, []); // Roda apenas uma vez na montagem

    const handleImageError = (e) => {
        // Se ocorrer um erro ao carregar a imagem (mesmo local, embora raro), mostra a imagem de erro
        if (e.target.src !== errorImage) {
             console.error("Erro ao exibir imagem local do carrossel:", e.target.src);
             e.target.onerror = null; // Previne loop infinito
             setImageDisplaySource(errorImage); // Define a URL da imagem de erro
        }
    };

    // Recupera o texto do slide atual
    const currentText = slideTexts[currentTextIndex] || { title: "Eventos Incríveis", subtitle: "Descubra novas experiências." };

    // --- Estilos (sem grandes mudanças necessárias) ---
    const carouselStyle = {
        position: 'relative',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#333', // Fundo enquanto carrega ou em erro
        width: '100%',
        height: '400px',
        overflow: 'hidden',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    };

    const imageStyle = {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center center',
        // A transição de opacidade pode ser removida ou mantida para um leve fade-in
        // transition: 'opacity 0.5s ease-in-out',
        // opacity: 1, // Não depende mais de 'isLoading'
    };

    const textOverlayStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '0 20px',
        width: '80%',
        maxWidth: '700px',
        zIndex: 2,
        transition: 'opacity 0.5s ease-in-out', // Mantém transição para texto
        opacity: 1,
    };

    const titleTextStyle = {
        fontSize: 'clamp(1.8rem, 4vw, 3rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        textShadow: '0px 2px 8px rgba(0, 0, 0, 0.7)',
        marginBottom: '10px',
    };

    const subtitleStyle = {
        fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
        fontWeight: 400,
        textShadow: '0px 1px 6px rgba(0, 0, 0, 0.7)',
        opacity: 0.9,
    };

    const gradientOverlayStyle = {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 60%)',
        pointerEvents: 'none',
        zIndex: 1,
    };

    const buttonStyle = {
         position: 'absolute',
         bottom: '40px',
         left: '50%',
         transform: 'translateX(-50%)',
         padding: '15px 35px',
         background: 'linear-gradient(145deg, rgb(207, 220, 25), rgb(207, 220, 25))', // Dourado
         color: '#ffffff',
         borderRadius: '50px',
         fontSize: '1.1rem',
         fontWeight: 600,
         cursor: 'pointer',
         border: 'none',
         boxShadow: '0 5px 15px  rgb(207, 220, 25)',
         transition: 'background 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease',
         zIndex: 2,
         textTransform: 'uppercase',
         letterSpacing: '0.5px',
    };

    // --- Render ---
    return (
        <section style={carouselStyle}>
            {/* Imagem de Fundo Estática (Local) */}
            <img
                src={imageDisplaySource} // Usa o estado que contém placeholder OU a imagem local OU erro
                alt="Plano de fundo do carrossel de eventos"
                style={imageStyle}
                onError={handleImageError} // Ainda útil para um fallback raro
            />

            {/* Overlay Gradiente */}
            <div style={gradientOverlayStyle}></div>

            {/* Conteúdo de Texto Dinâmico */}
            <div key={currentTextIndex} style={textOverlayStyle}>
                <h2 style={titleTextStyle}>{currentText.title}</h2>
                <p style={subtitleStyle}>{currentText.subtitle}</p>
            </div>

            {/* Botão Explorar Eventos */}
            <button
                onClick={onExplore}
                style={buttonStyle}
                 onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(145deg, #cfdc19, #b9c815)'; e.target.style.boxShadow = '0 8px 20px rgba(207, 220, 25, 0.5)'; }}
                 onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(145deg, rgb(207, 220, 25), rgb(207, 220, 25))'; e.target.style.boxShadow = '0 5px 15px rgb(207, 220, 25)'; e.target.style.transform = 'translateX(-50%) scale(1)'; }}
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