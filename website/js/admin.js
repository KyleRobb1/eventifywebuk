document.addEventListener('DOMContentLoaded', function() {
    // API URL for backend
    const API_URL = 'http://localhost:3001';
    
    // DOM Elements
    const adminSections = document.querySelectorAll('.admin-section');
    const adminNavLinks = document.querySelectorAll('.admin-nav a');
    const eventModal = document.getElementById('event-modal');
    const eventForm = document.getElementById('event-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelEventBtn = document.getElementById('cancel-event');
    const addEventBtn = document.querySelector('.section-header .btn-primary');
    
    // State
    let currentEventId = null;
    
    // Navigation
    adminNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all sections and links
            adminSections.forEach(section => section.classList.remove('active'));
            adminNavLinks.forEach(link => link.parentElement.classList.remove('active'));
            
            // Add active class to target section and clicked link
            document.getElementById(targetId).classList.add('active');
            this.parentElement.classList.add('active');
        });
    });
    
    // Modal Functions
    function openModal(title = 'Add New Event') {
        document.querySelector('.modal-header h2').textContent = title;
        eventModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal() {
        eventModal.style.display = 'none';
        document.body.style.overflow = '';
        eventForm.reset();
        currentEventId = null;
    }
    
    // Event Handlers
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            openModal('Add New Event');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelEventBtn) {
        cancelEventBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === eventModal) {
            closeModal();
        }
    });
    
    // API Functions
    async function fetchEvents() {
        try {
            const response = await fetch(`${API_URL}/events`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }
    
    async function fetchEvent(id) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching event:', error);
            return null;
        }
    }
    
    async function createEvent(eventData) {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating event:', error);
            return null;
        }
    }
    
    async function updateEvent(id, eventData) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update event');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating event:', error);
            return null;
        }
    }
    
    async function deleteEvent(id) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting event:', error);
            return null;
        }
    }
    
    // Render Functions
    async function renderEventsTable() {
        const events = await fetchEvents();
        const tableBody = document.querySelector('#events tbody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="select-item"></td>
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>${event.category}</td>
                <td>$${parseFloat(event.price).toFixed(2)}</td>
                <td><span class="status ${event.status}">${event.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view-event" data-id="${event.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-event" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-event" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-event').forEach(btn => {
            btn.addEventListener('click', handleEditEvent);
        });
        
        document.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', handleDeleteEvent);
        });
        
        document.querySelectorAll('.view-event').forEach(btn => {
            btn.addEventListener('click', handleViewEvent);
        });
    }
    
    async function renderDashboardEvents() {
        const events = await fetchEvents();
        const tableBody = document.querySelector('.upcoming-events tbody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Show only the first 5 events
        const upcomingEvents = events.slice(0, 5);
        
        upcomingEvents.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>${event.category}</td>
                <td><span class="status ${event.status}">${event.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view-event" data-id="${event.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit-event" data-id="${event.id}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-event" data-id="${event.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-event').forEach(btn => {
            btn.addEventListener('click', handleEditEvent);
        });
        
        document.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', handleDeleteEvent);
        });
        
        document.querySelectorAll('.view-event').forEach(btn => {
            btn.addEventListener('click', handleViewEvent);
        });
    }
    
    // Event Handlers
    async function handleEditEvent() {
        const eventId = parseInt(this.dataset.id);
        const event = await fetchEvent(eventId);
        
        if (!event) return;
        
        // Populate form with event data
        document.getElementById('event-name').value = event.name;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-time').value = event.time;
        document.getElementById('event-location').value = event.location;
        document.getElementById('event-category').value = event.category.toLowerCase();
        document.getElementById('event-price').value = event.price;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-status').value = event.status;
        
        // Set current event ID
        currentEventId = eventId;
        
        // Open modal
        openModal('Edit Event');
    }
    
    async function handleDeleteEvent() {
        const eventId = parseInt(this.dataset.id);
        
        if (confirm('Are you sure you want to delete this event?')) {
            const result = await deleteEvent(eventId);
            
            if (result) {
                // Refresh events tables
                renderEventsTable();
                renderDashboardEvents();
            }
        }
    }
    
    async function handleViewEvent() {
        const eventId = parseInt(this.dataset.id);
        const event = await fetchEvent(eventId);
        
        if (!event) return;
        
        // Create a modal to display event details
        const viewModal = document.createElement('div');
        viewModal.className = 'modal';
        viewModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Event Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="event-details-view">
                        <div class="event-image">
                            <img src="../images/${event.image}" alt="${event.name}">
                        </div>
                        <div class="event-info">
                            <h3>${event.name}</h3>
                            <p><strong>Date:</strong> ${event.date}</p>
                            <p><strong>Time:</strong> ${event.time}</p>
                            <p><strong>Location:</strong> ${event.location}</p>
                            <p><strong>Category:</strong> ${event.category}</p>
                            <p><strong>Price:</strong> $${parseFloat(event.price).toFixed(2)}</p>
                            <p><strong>Status:</strong> <span class="status ${event.status}">${event.status}</span></p>
                            <div class="event-description">
                                <h4>Description</h4>
                                <p>${event.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary close-view">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewModal);
        viewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close button functionality
        viewModal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(viewModal);
            document.body.style.overflow = '';
        });
        
        viewModal.querySelector('.close-view').addEventListener('click', function() {
            document.body.removeChild(viewModal);
            document.body.style.overflow = '';
        });
        
        // Close when clicking outside
        viewModal.addEventListener('click', function(e) {
            if (e.target === viewModal) {
                document.body.removeChild(viewModal);
                document.body.style.overflow = '';
            }
        });
    }
    
    // Form Submission
    if (eventForm) {
        eventForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const eventData = {
                name: document.getElementById('event-name').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-location').value,
                category: document.getElementById('event-category').options[document.getElementById('event-category').selectedIndex].text,
                price: parseFloat(document.getElementById('event-price').value),
                description: document.getElementById('event-description').value,
                status: document.getElementById('event-status').value,
                image: 'event-placeholder.jpg' // Default image
            };
            
            let result;
            
            if (currentEventId) {
                // Update existing event
                result = await updateEvent(currentEventId, eventData);
            } else {
                // Create new event
                result = await createEvent(eventData);
            }
            
            if (result) {
                // Close modal
                closeModal();
                
                // Refresh events tables
                renderEventsTable();
                renderDashboardEvents();
            }
        });
    }
    
    // Select all checkbox functionality
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.select-item');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Initialize
    renderEventsTable();
    renderDashboardEvents();
});
