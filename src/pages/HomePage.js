import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Carousel from '../components/banner';
import EventSection from '../components/eventSection';
import Footer from '../components/footer';

const sampleEventsData = [
    { id: 1, name: "Show de Rock Incrível", description: "A maior banda de rock ao vivo!", imageUrl: "https://via.placeholder.com/350x230.png?text=Rock+Show" },
    { id: 2, name: "Festival de Jazz & Blues", description: "Um ambiente relaxante com boa música.", imageUrl: "https://via.placeholder.com/350x230.png?text=Jazz+Fest" },
    { id: 3, name: "Peça Teatral: O Mistério", description: "Um suspense intrigante.", imageUrl: "https://via.placeholder.com/350x230.png?text=Theatre+Play" },
];

function HomePage() {
    const [events, setEvents] = useState([]);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        setEvents(sampleEventsData);
    }, []);

    const handleBuyTicket = (id, name) => {
        alert(`Ingresso para "${name}" comprado!`);
    };

    const toggleTheme = () => { 
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const scrollToEvents = () => {
        const eventSection = document.getElementById('events');
        if (eventSection) eventSection.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div style={{ background: theme === 'dark' ? '#f8f9fa' : '#121212', color: theme === 'light' ? '#212529' : '#e9ecef', minHeight: '100vh' }}>
          
            <Carousel onExplore={scrollToEvents} />
            <div id="events">
                <EventSection events={events} handleBuyTicket={handleBuyTicket} />
            </div>
            <Footer theme={theme} />
        </div>
    );
}

export default HomePage;
