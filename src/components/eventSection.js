// src/components/EventSection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Certifique-se que o path está correto
import { db } from '../firebaseconfig'; // Importa a instância do Firestore
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'; // Funções do Firestore

// --- Funções Helper ---
const formatDate = (date) => { // Recebe Timestamp do Firestore ou null/undefined
    if (!date) return "Data não informada";
    try {
        let dateObject;
        // Verifica se é um Timestamp do Firestore e converte para Date
        if (date instanceof Timestamp) {
            dateObject = date.toDate();
        } else if (date instanceof Date) {
            // Se já for um objeto Date (pouco provável vindo do Firestore assim, mas por segurança)
            dateObject = date;
        } else {
             // Tenta converter se for string ou número (fallback, menos ideal)
             dateObject = new Date(date);
             if (isNaN(dateObject.getTime())) throw new Error("Data inválida");
        }

        return dateObject.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', // Inclui a hora
            minute: '2-digit' // Inclui os minutos
        });
    } catch (error) {
        console.error("Erro ao formatar data:", date, error);
        return "Data inválida";
    }
};

const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) { return 'N/A'; }
    return `MZN ${price.toFixed(2).replace('.', ',')}`;
};

// --- Componente ---
function EventSection() {
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Hook do contexto do carrinho
    const [events, setEvents] = useState([]); // Estado para armazenar eventos do Firestore
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros de fetch

    // --- Efeito para buscar eventos do Firestore na montagem do componente ---
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Cria uma query para buscar documentos da coleção 'events'
                // Ordena por 'date' em ordem descendente (mais recentes primeiro)
                const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(eventsQuery);

                // Mapeia os documentos para o formato esperado, incluindo o ID do documento
                const eventsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,      // ID único do documento no Firestore
                    ...doc.data()    // Todos os outros campos (name, date, location, prices, etc.)
                }));

                setEvents(eventsData); // Atualiza o estado com os eventos buscados

            } catch (err) {
                console.error("Erro ao buscar eventos do Firestore:", err);
                setError("Não foi possível carregar os eventos. Verifique sua conexão ou tente novamente mais tarde.");
            } finally {
                setIsLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchEvents(); // Executa a busca
    }, []); // Array de dependências vazio significa que executa apenas uma vez

    // --- Manipulador para clique no botão de comprar ---
    const handleBuyTicketClick = (event, ticketType) => {
        // Acesso seguro ao preço usando optional chaining (?.)
        const price = event?.prices?.[ticketType];

        if (typeof price === 'number' && !isNaN(price)) {
            // Adiciona ao carrinho (o objeto event já contém id, name, prices, etc.)
            addToCart(event, ticketType, price);
            navigate('/cart'); // Navega para a página do carrinho
        } else {
            console.warn("Tentativa de adicionar item com preço inválido ou inexistente:", event?.id, ticketType);
            alert("Desculpe, este tipo de bilhete não está disponível ou tem um preço inválido.");
        }
    };

    // --- Estilos Inline (mantidos para consistência com o pedido anterior) ---
    const sectionStyle = { padding: '60px 20px', maxWidth: '1200px', margin: '40px auto', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '15px', fontFamily: 'system-ui, sans-serif' };
    const sectionTitleStyle = { marginBottom: '50px', fontSize: '2.8rem', fontWeight: 700, color: 'rgb(80, 80, 80)', letterSpacing: '-0.5px' };
    const gridStyle = { display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', justifyItems: 'center' };
    const cardStyle = { background: '#fff', borderRadius: '12px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', textAlign: 'left', transition: 'transform 0.2s ease, box-shadow 0.2s ease' };
    // Efeito hover simples no card:
    // const cardHoverStyle = { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)' }; // (Implementar com state ou CSS)
    const cardContentStyle = { padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 };
    const imgStyle = { width: '100%', height: '220px', objectFit: 'cover', display: 'block', backgroundColor: '#e9ecef', borderBottom: '1px solid #eee' };
    const titleStyle = { margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 600, color: '#343a40', lineHeight: 1.3 };
    const descriptionStyle = { color: '#6c757d', fontSize: '0.95rem', marginBottom: '15px', lineHeight: 1.6, flexGrow: 1, minHeight: '60px' }; // Garante altura mínima
    const detailsContainerStyle = { marginBottom: '20px', fontSize: '0.9rem', color: '#495057' };
    const detailParagraphStyle = { margin: '6px 0' }; // Aumenta um pouco o espaço
    const detailStrongStyle = { fontWeight: 600, marginRight: '5px', color: '#495057' };
    const priceInfoStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '15px', flexWrap: 'wrap' }; // Aumenta o gap
    const priceBaseStyle = { fontSize: '1.15rem', fontWeight: 700 };
    const priceLabelStyle = { fontWeight: 500, fontSize: '0.9rem', color: '#6c757d', marginRight: '5px' };
    const normalPriceSpecificStyle = { color: '#198754' }; // Verde
    const vipPriceSpecificStyle = { color: '#b38600' }; // Dourado/Mostarda
    const buttonGroupStyle = { display: 'flex', gap: '10px', marginTop: 'auto' }; // 'auto' empurra para baixo
    const buttonBaseStyle = { flexGrow: 1, padding: '12px 15px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', border: 'none', outline: 'none', textAlign: 'center', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', transition: 'background-color 0.2s ease, transform 0.1s ease', whiteSpace: 'nowrap' };
    // Efeito de clique simples no botão:
    // const buttonActiveStyle = { transform: 'scale(0.98)' }; // (Implementar com state ou CSS)
    const buttonNormalSpecificStyle = { backgroundColor: '#20c997', color: '#fff' }; // Verde mais claro
    const buttonVipSpecificStyle = { backgroundColor: '#ffc107', color: '#343a40' }; // Amarelo
    const buttonDisabledStyle = { backgroundColor: '#ced4da', color: '#6c757d', cursor: 'not-allowed', boxShadow: 'none' };
    const fallbackImage = 'https://via.placeholder.com/600x440/E0E0E0/AAAAAA?text=Sem+Imagem';
    const errorImage = 'https://via.placeholder.com/600x440/DC3545/FFFFFF?text=Erro+Imagem'; // Imagem de erro mais visível
    const loadingStyle = { fontSize: '1.3rem', color: '#6c757d', gridColumn: '1 / -1', marginTop: '50px', fontWeight: '500' };
    const errorStyle = { fontSize: '1.2rem', color: '#842029', gridColumn: '1 / -1', marginTop: '30px', border: '1px solid #f5c2c7', padding: '20px', backgroundColor: '#f8d7da', borderRadius: '8px', fontWeight: '500' };
    const noEventsStyle = { fontSize: '1.1rem', color: '#6c757d', gridColumn: '1 / -1', marginTop: '40px' };

    return (
        <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Eventos em Destaque</h2>

            {/* Exibe estado de carregamento */}
            {isLoading && <p style={loadingStyle}>A carregar eventos...</p>}

            {/* Exibe estado de erro */}
            {error && <p style={errorStyle}>{error}</p>}

            {/* Exibe eventos se não estiver carregando e não houver erro */}
            {!isLoading && !error && (
                <div style={gridStyle}>
                    {events.length > 0 ? (
                        // Mapeia e renderiza cada evento
                        events.map((event) => {
                            // Verificação básica se o evento e ID existem
                            if (!event || !event.id) {
                                console.warn("Evento inválido ou sem ID encontrado:", event);
                                return null;
                            }

                            // Extração segura de preços
                            const prices = event.prices || { normal: null, vip: null };
                            const normalPrice = prices.normal;
                            const vipPrice = prices.vip;

                            // Verifica se os botões devem estar desabilitados
                            const isNormalDisabled = typeof normalPrice !== 'number' || isNaN(normalPrice);
                            const isVipDisabled = typeof vipPrice !== 'number' || isNaN(vipPrice);

                            // Define estilos condicionais para os botões
                            const normalButtonStyle = { ...buttonBaseStyle, ...(isNormalDisabled ? buttonDisabledStyle : buttonNormalSpecificStyle) };
                            const vipButtonStyle = { ...buttonBaseStyle, ...(isVipDisabled ? buttonDisabledStyle : buttonVipSpecificStyle) };

                            return (
                                <div key={event.id} style={cardStyle} /* onMouseEnter/Leave para hoverStyle */>
                                    <img
                                        src={event.imageUrl || fallbackImage} // Usa fallback se imageUrl for null/vazio
                                        alt={`Imagem de ${event.name || 'evento sem nome'}`} style={imgStyle}
                                        onError={(e) => { e.target.onerror = null; e.target.src = errorImage; }} // Handler para erro ao carregar img
                                    />
                                    <div style={cardContentStyle}>
                                        <h3 style={titleStyle}>{event.name || 'Evento Sem Nome'}</h3>
                                        <p style={descriptionStyle}>{event.description || 'Descrição não disponível.'}</p>
                                        <div style={detailsContainerStyle}>
                                            {/* Formata a data (Timestamp) vinda do Firestore */}
                                            <p style={detailParagraphStyle}><strong style={detailStrongStyle}>Data:</strong> {formatDate(event.date)}</p>
                                            <p style={detailParagraphStyle}><strong style={detailStrongStyle}>Local:</strong> {event.location || 'Local não informado'}</p>
                                        </div>
                                        <div style={priceInfoStyle}>
                                            {/* Exibe preço Normal */}
                                            <span style={{ ...priceBaseStyle, ...normalPriceSpecificStyle }}>
                                                <span style={priceLabelStyle}>Normal:</span> {formatPrice(normalPrice)}
                                            </span>
                                            {/* Exibe preço VIP */}
                                            <span style={{ ...priceBaseStyle, ...vipPriceSpecificStyle }}>
                                                <span style={priceLabelStyle}>VIP:</span> {formatPrice(vipPrice)}
                                            </span>
                                        </div>
                                        <div style={buttonGroupStyle}>
                                            {/* Botão Comprar Normal */}
                                            <button
                                                onClick={() => handleBuyTicketClick(event, 'normal')}
                                                style={normalButtonStyle}
                                                disabled={isNormalDisabled}
                                                // onMouseDown/Up para activeStyle
                                            >
                                                Comprar Normal
                                            </button>
                                            {/* Botão Comprar VIP */}
                                            <button
                                                onClick={() => handleBuyTicketClick(event, 'vip')}
                                                style={vipButtonStyle}
                                                disabled={isVipDisabled}
                                                // onMouseDown/Up para activeStyle
                                            >
                                                Comprar VIP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // Mensagem exibida se não houver eventos
                        <p style={noEventsStyle}>De momento, não existem eventos disponíveis.</p>
                    )}
                </div>
            )}
        </section>
    );
}

export default EventSection;