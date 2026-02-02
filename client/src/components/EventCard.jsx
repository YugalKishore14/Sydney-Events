import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

const EventCard = ({ event, onGetTicket }) => {
    const placeholderImage = "/placeholder.jpg";
    const [imgSrc, setImgSrc] = useState(event.imageUrl || placeholderImage);

    const handleError = () => {
        if (imgSrc !== placeholderImage) {
            setImgSrc(placeholderImage);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={imgSrc}
                    alt={event.title}
                    onError={handleError}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-primary">
                    {event.status === 'new' ? '✨ New' : 'Event'}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.title}</h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{event.dateString || new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="line-clamp-1">{event.location || event.city || "Sydney"}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{event.description}</p>

                <div className="mt-auto flex gap-3">
                    <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-100 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                        Details <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                        onClick={() => onGetTicket(event)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition font-medium"
                    >
                        Get Tickets
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
