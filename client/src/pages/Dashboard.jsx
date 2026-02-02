import React, { useEffect, useState } from 'react';
import api from '../api';
import { RefreshCw, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import EventCard from '../components/EventCard';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [filter, setFilter] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const url = filter === 'all' ? '/api/events/admin' : `/api/events/admin?status=${filter}`;
            const { data } = await api.get(url);
            setEvents(data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [filter]);

    const handleScrape = async () => {
        setScraping(true);
        try {
            await api.post('/api/events/admin/scrape');
            alert('Scraping started! Check back in a moment.');
            // Poll or wait a bit then refresh
            setTimeout(fetchEvents, 5000);
        } catch (err) {
            alert('Scrape failed to start');
        } finally {
            setScraping(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/events/admin/${id}`, { status });
            setEvents(events.map(e => e._id === id ? { ...e, status } : e));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const statusColors = {
        new: 'bg-blue-100 text-blue-800',
        updated: 'bg-amber-100 text-amber-800',
        imported: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
    };

    return (
        <div className="flex bg-gray-50 h-[calc(100vh-64px)] overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
                    <button
                        onClick={handleScrape}
                        disabled={scraping}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} />
                        {scraping ? 'Importing...' : 'Import Events'}
                    </button>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4 overflow-x-auto">
                    <Filter className="w-5 h-5 text-gray-500" />
                    {['all', 'new', 'updated', 'imported', 'inactive'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${filter === f ? 'bg-white shadow text-primary' : 'text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-900 font-semibold">
                                <tr>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map(event => (
                                    <tr
                                        key={event._id}
                                        className={`hover:bg-blue-50/50 cursor-pointer ${selectedEvent?._id === event._id ? 'bg-blue-50' : ''}`}
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        <td className="p-4 font-medium text-gray-900 line-clamp-1 max-w-xs">{event.title}</td>
                                        <td className="p-4 whitespace-nowrap">{event.dateString || new Date(event.date).toDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[event.status] || 'bg-gray-100'}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(event._id, 'imported'); }}
                                                className="p-1 hover:text-green-600" title="Approve/Import"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(event._id, 'inactive'); }}
                                                className="p-1 hover:text-red-500" title="Mark Inactive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">No events found. Try importing some!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Side Preview Panel */}
            {selectedEvent && (
                <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-xl z-10 transition-transform">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Preview</h3>
                        <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">Close</button>
                    </div>

                    <EventCard event={selectedEvent} onGetTicket={() => window.open(selectedEvent.sourceUrl, '_blank')} />

                    <div className="mt-8 space-y-4">
                        <h4 className="font-semibold text-gray-800">Admin Controls</h4>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => updateStatus(selectedEvent._id, 'imported')}
                                className="w-full py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100"
                            >
                                Mark as Imported (Public)
                            </button>
                            <button
                                onClick={() => updateStatus(selectedEvent._id, 'updated')}
                                className="w-full py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100"
                            >
                                Mark as Updated
                            </button>
                            <button
                                onClick={() => updateStatus(selectedEvent._id, 'inactive')}
                                className="w-full py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
                            >
                                Mark as Inactive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
