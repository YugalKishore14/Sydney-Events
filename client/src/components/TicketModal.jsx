import React, { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';
import api from '../api';

const TicketModal = ({ event, onClose }) => {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consent) return alert('Please agree to the terms.');

        setLoading(true);
        try {
            await api.post('/api/events/tickets', { email, eventId: event._id, consent });
            setSuccess(true);
            setTimeout(() => {
                // Redirect to external site as fallback/part of flow
                window.open(event.sourceUrl, '_blank');
                onClose();
            }, 2000);
        } catch (err) {
            alert('Error requesting ticket');
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-1">Get Tickets</h2>
                    <p className="text-gray-500 text-sm mb-6">for {event.title}</p>

                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-800">Request Sent!</p>
                            <p className="text-gray-500 text-sm">Redirecting to official booking page...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-1 rounded text-accent focus:ring-accent"
                                />
                                <label htmlFor="consent" className="text-xs text-gray-600">
                                    I consent to receiving emails about this event and agree to the Privacy Policy.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!consent || loading}
                                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Proceed to Booking'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
