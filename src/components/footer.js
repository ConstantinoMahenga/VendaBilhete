import React from 'react';

function Footer({ theme }) {
    const footerStyle = {
        background: theme === 'light' ? '#f1f1f1' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        padding: '20px',
        textAlign: 'center',
        fontSize: '1rem',
    };

    return (
        <footer style={footerStyle}>
            <p>&copy; {new Date().getFullYear()} TicketHub - Todos os direitos reservados.</p>
        </footer>
    );
}

export default Footer;
