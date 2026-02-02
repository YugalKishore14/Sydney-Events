import React, { useEffect, useState } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import TicketModal from '../components/TicketModal';
import { Search } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/api/events/public');
                setEvents(data);
            } catch (err) {
                console.error('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(evt =>
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evt.location && evt.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sydney's Best</span> Events
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    From festivals to workshops, find what's happening in the city.
                </p>

                <div className="mt-8 max-w-md mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <>
                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map(event => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onGetTicket={(evt) => setSelectedEvent(evt)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg">No events found matching your search.</p>
                        </div>
                    )}
                </>
            )}

            {selectedEvent && (
                <TicketModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

export default Home;
