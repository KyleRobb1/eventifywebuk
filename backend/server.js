const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage path
const dataPath = path.join(__dirname, 'data');
const eventsFile = path.join(dataPath, 'events.json');

// Ensure data directory exists
if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
}

// Initialize events data if it doesn't exist
if (!fs.existsSync(eventsFile)) {
    const initialEvents = [
        {
            id: 1,
            name: "Summer Music Festival",
            date: "2025-05-25",
            time: "19:00",
            location: "Central Park, New York",
            category: "Music",
            price: 59.99,
            description: "Experience the ultimate summer music festival featuring top artists and bands.",
            image: "concert.jpg",
            status: "published"
        },
        {
            id: 2,
            name: "Tech Innovation Summit",
            date: "2025-06-10",
            time: "09:00",
            location: "Convention Center, San Francisco",
            category: "Technology",
            price: 129.99,
            description: "Join industry leaders and innovators at this premier tech conference.",
            image: "conference.jpg",
            status: "published"
        },
        {
            id: 3,
            name: "Creative Art Workshop",
            date: "2025-06-15",
            time: "14:00",
            location: "Art Gallery, London",
            category: "Arts & Culture",
            price: 45.00,
            description: "Learn new techniques and express your creativity in this hands-on workshop.",
            image: "workshop.jpg",
            status: "draft"
        },
        {
            id: 4,
            name: "International Food Festival",
            date: "2025-06-20",
            time: "12:00",
            location: "Waterfront Park, Chicago",
            category: "Food & Drink",
            price: 25.00,
            description: "Taste delicious cuisines from around the world at this exciting food festival.",
            image: "food-festival.jpg",
            status: "pending"
        }
    ];
    fs.writeFileSync(eventsFile, JSON.stringify(initialEvents, null, 2));
}

// Helper function to read events
const getEvents = () => {
    const eventsData = fs.readFileSync(eventsFile);
    return JSON.parse(eventsData);
};

// Helper function to write events
const saveEvents = (events) => {
    fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
};

// Routes
// Get all events
app.get('/events', (req, res) => {
    try {
        const events = getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// Get a single event by ID
app.get('/events/:id', (req, res) => {
    try {
        const events = getEvents();
        const event = events.find(e => e.id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve event' });
    }
});

// Create a new event
app.post('/events', (req, res) => {
    try {
        const events = getEvents();
        const newEvent = {
            id: Date.now(),
            ...req.body
        };
        
        events.push(newEvent);
        saveEvents(events);
        
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update an event
app.put('/events/:id', (req, res) => {
    try {
        const events = getEvents();
        const id = parseInt(req.params.id);
        const eventIndex = events.findIndex(e => e.id === id);
        
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        const updatedEvent = {
            ...events[eventIndex],
            ...req.body,
            id // Ensure ID doesn't change
        };
        
        events[eventIndex] = updatedEvent;
        saveEvents(events);
        
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete an event
app.delete('/events/:id', (req, res) => {
    try {
        const events = getEvents();
        const id = parseInt(req.params.id);
        const filteredEvents = events.filter(e => e.id !== id);
        
        if (filteredEvents.length === events.length) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        saveEvents(filteredEvents);
        
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// User routes (simplified for demo)
// Get all users
app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
    ]);
});

// Categories
app.get('/categories', (req, res) => {
    res.json([
        { id: 1, name: 'Music' },
        { id: 2, name: 'Technology' },
        { id: 3, name: 'Arts & Culture' },
        { id: 4, name: 'Food & Drink' },
        { id: 5, name: 'Sports' },
        { id: 6, name: 'Education' }
    ]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
