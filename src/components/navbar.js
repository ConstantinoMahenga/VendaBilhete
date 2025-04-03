import React from 'react';

function Navbar({ theme, toggleTheme }) {
    const navbarStyle = {
        padding: '20px 0',
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const buttonStyle = {
        background: theme === 'light' ? '#f0f0f0' : '#555',
        color: theme === 'light' ? '#333' : '#fff',
        borderRadius: '50%',
        padding: '12px 16px',
        fontSize: '1.2rem',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
    };

    return (
        <header style={navbarStyle}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={toggleTheme} style={buttonStyle} aria-label={theme === 'light' ? "Dark Mode" : "Light Mode"}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </header>
    );
}

export default Navbar;


