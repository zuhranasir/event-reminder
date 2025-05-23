// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Form tabs functionality
    const formTabs = document.querySelectorAll('.form-tabs button');
    const registerForm = document.getElementById('register');
    const loginForm = document.getElementById('login');
    
    // Set up form tab switching
    if (formTabs.length > 0) {
        formTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                formTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle between register and login forms
                if (this.textContent.trim() === 'Register') {
                    document.querySelector('.form-content form').innerHTML = `
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" required>
                        </div>
                        <div class="form-group">
                            <label for="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" required>
                        </div>
                        <button type="submit" class="form-btn">Create Your Account</button>
                    `;
                } else {
                    document.querySelector('.form-content form').innerHTML = `
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" required>
                        </div>
                        <div class="form-group">
                            <div style="display: flex; justify-content: flex-end;">
                                <a href="#" class="forgot-password">Forgot Password?</a>
                            </div>
                        </div>
                        <button type="submit" class="form-btn">Log In</button>
                    `;
                }
            });
        });
    }
    
    // Calendar functionality
    const calendar = document.querySelector('.calendar');
    const calendarHeader = document.querySelector('.calendar-header h3');
    const prevBtn = document.querySelector('.calendar-nav.prev');
    const nextBtn = document.querySelector('.calendar-nav.next');
    const calendarGrid = document.querySelector('.calendar-grid');
    
    // Current date to handle calendar
    let currentDate = new Date();
    
    // Calendar navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
        
        nextBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Event handling
    if (calendar) {
        // Initialize events storage
        let events = JSON.parse(localStorage.getItem('ebventora-events')) || [];
        
        // Render calendar initially
        renderCalendar(currentDate);
        
        // Add event button functionality
        const addEventBtn = document.querySelector('.add-event-btn');
        const createEventSection = document.getElementById('create-event');
        
        if (addEventBtn) {
            addEventBtn.addEventListener('click', function() {
                // Smooth scroll to event creation form
                createEventSection.scrollIntoView({ behavior: 'smooth' });
                
                // Set default date to currently selected date in calendar
                const eventDateInput = document.getElementById('event-date');
                if (eventDateInput) {
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    eventDateInput.value = formattedDate;
                }
            });
        }
        
        // Event form submission
        const eventForm = document.querySelector('#create-event form');
        if (eventForm) {
            eventForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const title = document.getElementById('event-title').value;
                const date = document.getElementById('event-date').value;
                const time = document.getElementById('event-time').value;
                const description = document.getElementById('event-description').value;
                const reminderTime = document.getElementById('reminder-time').value;
                const emailReminder = document.getElementById('email-reminder').checked;
                const browserReminder = document.getElementById('browser-reminder').checked;
                
                // Create new event object
                const newEvent = {
                    id: Date.now(),
                    title: title,
                    date: date,
                    time: time,
                    description: description,
                    reminderTime: reminderTime,
                    reminderMethods: {
                        email: emailReminder,
                        browser: browserReminder
                    }
                };
                
                // Add to events array and store in localStorage
                events.push(newEvent);
                localStorage.setItem('ebventora-events', JSON.stringify(events));
                
                // Show success message
                showNotification('Event created successfully!');
                
                // Clear form
                eventForm.reset();
                
                // Rerender calendar to show new event
                renderCalendar(currentDate);
                
                // Scroll back to calendar
                calendar.scrollIntoView({ behavior: 'smooth' });
            });
        }
        
        // Calendar day click handler
        calendarGrid.addEventListener('click', function(e) {
            const day = e.target.closest('.calendar-day');
            
            if (day) {
                // Remove 'selected' class from all days
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                });
                
                // Add 'selected' class to clicked day
                day.classList.add('selected');
                
                // Get day number
                const dayNumber = parseInt(day.textContent);
                
                // If it's a valid day (not NaN from clicking on event)
                if (!isNaN(dayNumber)) {
                    // Set date for event creation
                    const selectedDate = new Date(currentDate);
                    
                    // Adjust for previous/next month days
                    if (day.classList.contains('prev-month')) {
                        selectedDate.setMonth(selectedDate.getMonth() - 1);
                    } else if (day.classList.contains('next-month')) {
                        selectedDate.setMonth(selectedDate.getMonth() + 1);
                    }
                    
                    selectedDate.setDate(dayNumber);
                    
                    // Update event date input if available
                    const eventDateInput = document.getElementById('event-date');
                    if (eventDateInput) {
                        const formattedDate = selectedDate.toISOString().split('T')[0];
                        eventDateInput.value = formattedDate;
                    }
                }
            }
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.id !== 'event-form') { // Skip validation for event form as we handle it separately
                e.preventDefault();
                
                // Basic validation
                let isValid = true;
                const inputs = this.querySelectorAll('input[required]');
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        showInputError(input, 'This field is required');
                    } else {
                        clearInputError(input);
                        
                        // Email validation
                        if (input.type === 'email') {
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(input.value)) {
                                isValid = false;
                                showInputError(input, 'Please enter a valid email address');
                            }
                        }
                        
                        // Password match validation for registration
                        if (input.id === 'confirm-password') {
                            const password = document.getElementById('password');
                            if (password && input.value !== password.value) {
                                isValid = false;
                                showInputError(input, 'Passwords do not match');
                            }
                        }
                    }
                });
                
                if (isValid) {
                    // Show success message
                    showNotification('Form submitted successfully!');
                    
                    // Here you would normally submit the form data to a server
                    // For demo purposes, we'll just reset the form
                    this.reset();
                }
            }
        });
    });
});

// Helper Functions
function renderCalendar(date) {
    const calendarGrid = document.querySelector('.calendar-grid');
    const calendarHeader = document.querySelector('.calendar-header h3');
    
    if (!calendarGrid || !calendarHeader) return;
    
    // Update calendar header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarHeader.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Get events from localStorage
    const events = JSON.parse(localStorage.getItem('ebventora-events')) || [];
    
    // Clear existing grid
    calendarGrid.innerHTML = '';
    
    // Create new calendar grid
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Get previous month's days to fill the first week
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    // Get next month's days to fill the last week
    const lastDayIndex = lastDay.getDay();
    const nextDays = 7 - lastDayIndex - 1;
    
    // Add previous month's days
    for (let i = firstDayIndex; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'prev-month');
        dayElement.textContent = prevLastDay - i + 1;
        calendarGrid.appendChild(dayElement);
    }
    
    // Add current month's days
    const today = new Date();
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = i;
        
        // Highlight today
        if (i === today.getDate() && date.getMonth() === today.getMonth() && 
            date.getFullYear() === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Add events for this day
        const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === dayDate.getDate() && 
                   eventDate.getMonth() === dayDate.getMonth() && 
                   eventDate.getFullYear() === dayDate.getFullYear();
        });
        
        // Add event indicators
        dayEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.classList.add('event-item');
            eventItem.textContent = event.title;
            eventItem.dataset.eventId = event.id;
            
            // Event click handler
            eventItem.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent day click
                showEventDetails(event);
            });
            
            dayElement.appendChild(eventItem);
        });
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Add next month's days
    for (let i = 1; i <= nextDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'next-month');
        dayElement.textContent = i;
        calendarGrid.appendChild(dayElement);
    }
}

function showEventDetails(event) {
    // Create modal element
    const modal = document.createElement('div');
    modal.classList.add('event-modal');
    
    // Format time
    let formattedTime = '';
    if (event.time) {
        const timeObj = new Date(`1970-01-01T${event.time}`);
        formattedTime = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create modal content
    modal.innerHTML = `
        <div class="event-modal-content">
            <span class="close-modal">&times;</span>
            <h2>${event.title}</h2>
            <p class="event-date"><strong>Date:</strong> ${formattedDate}</p>
            ${event.time ? `<p class="event-time"><strong>Time:</strong> ${formattedTime}</p>` : ''}
            ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
            <div class="event-reminder">
                <p><strong>Reminder:</strong> ${getReminderText(event.reminderTime)}</p>
                <p><strong>Notification via:</strong> 
                    ${event.reminderMethods.email ? 'Email' : ''}
                    ${event.reminderMethods.email && event.reminderMethods.browser ? ' & ' : ''}
                    ${event.reminderMethods.browser ? 'Browser' : ''}
                </p>
            </div>
            <div class="modal-actions">
                <button class="edit-event-btn">Edit</button>
                <button class="delete-event-btn">Delete</button>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
    
    // Close modal on X click
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        closeModal(modal);
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Edit event handler
    const editBtn = modal.querySelector('.edit-event-btn');
    editBtn.addEventListener('click', function() {
        closeModal(modal);
        editEvent(event);
    });
    
    // Delete event handler
    const deleteBtn = modal.querySelector('.delete-event-btn');
    deleteBtn.addEventListener('click', function() {
        // Confirm deletion
        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
            // Get events from localStorage
            let events = JSON.parse(localStorage.getItem('ebventora-events')) || [];
            
            // Remove event
            events = events.filter(e => e.id !== event.id);
            
            // Update localStorage
            localStorage.setItem('ebventora-events', JSON.stringify(events));
            
            // Show success message
            showNotification('Event deleted successfully!');
            
            // Close modal
            closeModal(modal);
            
            // Rerender calendar
            renderCalendar(new Date());
        }
    });
}

function editEvent(event) {
    // Scroll to event form
    const createEventSection = document.getElementById('create-event');
    createEventSection.scrollIntoView({ behavior: 'smooth' });
    
    // Update form title
    const sectionTitle = createEventSection.querySelector('h2');
    if (sectionTitle) {
        sectionTitle.textContent = 'Edit Event';
    }
    
    // Fill form with event data
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-date').value = event.date;
    if (event.time) document.getElementById('event-time').value = event.time;
    document.getElementById('event-description').value = event.description || '';
    document.getElementById('reminder-time').value = event.reminderTime;
    document.getElementById('email-reminder').checked = event.reminderMethods.email;
    document.getElementById('browser-reminder').checked = event.reminderMethods.browser;
    
    // Change form submission behavior
    const eventForm = document.querySelector('#create-event form');
    
    // Remove existing event listener if any
    const newEventForm = eventForm.cloneNode(true);
    eventForm.parentNode.replaceChild(newEventForm, eventForm);
    
    // Add event id as data attribute
    newEventForm.dataset.eventId = event.id;
    
    // Add update event listener
    newEventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        const reminderTime = document.getElementById('reminder-time').value;
        const emailReminder = document.getElementById('email-reminder').checked;
        const browserReminder = document.getElementById('browser-reminder').checked;
        
        // Get existing events
        let events = JSON.parse(localStorage.getItem('ebventora-events')) || [];
        
        // Find and update the event
        const eventIndex = events.findIndex(e => e.id === event.id);
        if (eventIndex !== -1) {
            events[eventIndex] = {
                ...events[eventIndex],
                title: title,
                date: date,
                time: time,
                description: description,
                reminderTime: reminderTime,
                reminderMethods: {
                    email: emailReminder,
                    browser: browserReminder
                }
            };
            
            // Update localStorage
            localStorage.setItem('ebventora-events', JSON.stringify(events));
            
            // Show success message
            showNotification('Event updated successfully!');
            
            // Reset form and title
            newEventForm.reset();
            if (sectionTitle) {
                sectionTitle.textContent = 'Create a New Event';
            }
            
            // Remove event ID from form
            delete newEventForm.dataset.eventId;
            
            // Restore default form behavior
            setupDefaultFormBehavior(newEventForm);
            
            // Rerender calendar
            renderCalendar(new Date(date));
            
            // Scroll back to calendar
            document.querySelector('.calendar').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

function setupDefaultFormBehavior(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const description = document.getElementById('event-description').value;
        const reminderTime = document.getElementById('reminder-time').value;
        const emailReminder = document.getElementById('email-reminder').checked;
        const browserReminder = document.getElementById('browser-reminder').checked;
        
        // Create new event object
        const newEvent = {
            id: Date.now(),
            title: title,
            date: date,
            time: time,
            description: description,
            reminderTime: reminderTime,
            reminderMethods: {
                email: emailReminder,
                browser: browserReminder
            }
        };
        
        // Get existing events
        let events = JSON.parse(localStorage.getItem('ebventora-events')) || [];
        
        // Add to events array and store in localStorage
        events.push(newEvent);
        localStorage.setItem('ebventora-events', JSON.stringify(events));
        
        // Show success message
        showNotification('Event created successfully!');
        
        // Clear form
        form.reset();
        
        // Rerender calendar
        renderCalendar(new Date(date));
        
        // Scroll back to calendar
        document.querySelector('.calendar').scrollIntoView({ behavior: 'smooth' });
    });
}

function closeModal(modal) {
    modal.classList.remove('visible');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300); // Match transition time
}

function getReminderText(minutes) {
    if (minutes === '15') return '15 minutes before';
    if (minutes === '30') return '30 minutes before';
    if (minutes === '60') return '1 hour before';
    if (minutes === '120') return '2 hours before';
    if (minutes === '1440') return '1 day before';
    return `${minutes} minutes before`;
}

function showInputError(input, message) {
    // Remove any existing error
    clearInputError(input);
    
    // Add error class to input
    input.classList.add('input-error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    
    // Insert error after input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function clearInputError(input) {
    // Remove error class
    input.classList.remove('input-error');
    
    // Remove error message if exists
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.parentNode.removeChild(errorElement);
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Auto hide after a delay
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300); // Match transition time
    }, 3000);
}

// Add necessary styles for JavaScript-enhanced components
const styleElement = document.createElement('style');
styleElement.textContent = `
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: var(--light-color);
            padding: 1rem;
            box-shadow: var(--box-shadow);
            z-index: 100;
            animation: slideDown 0.3s ease-out forwards;
        }
        
        .nav-links.active li {
            margin: 1rem 0;
            text-align: center;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 6px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -6px);
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
    
    /* Calendar day selected state */
    .calendar-day.selected {
        border: 2px solid var(--secondary-color);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
    }
    
    /* Form validation styles */
    .input-error {
        border-color: var(--secondary-color) !important;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
    }
    
    .error-message {
        color: var(--secondary-color);
        font-size: 0.8rem;
        margin-top: 0.3rem;
        animation: fadeIn 0.3s ease-out forwards;
    }
    
    /* Event modal styles */
    .event-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }
    
    .event-modal.visible {
        opacity: 1;
        pointer-events: auto;
    }
    
    .event-modal-content {
        background-color: white;
        border-radius: var(--border-radius);
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: var(--box-shadow);
        position: relative;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }
    
    .event-modal.visible .event-modal-content {
        transform: translateY(0);
    }
    
    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--dark-color);
        transition: var(--transition);
    }
    
    .close-modal:hover {
        color: var(--secondary-color);
    }
    
    .event-modal h2 {
        margin-bottom: 1rem;
        color: var(--primary-color);
        font-size: 1.8rem;
    }
    
    .event-date, .event-time {
        margin-bottom: 0.5rem;
    }
    
    .event-description {
        margin: 1rem 0;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    
    .event-reminder {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
        gap: 1rem;
    }
    
    .edit-event-btn, .delete-event-btn {
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
    }
    
    .edit-event-btn {
        background-color: var(--primary-color);
        color: white;
        border: none;
    }
    
    .edit-event-btn:hover {
        background-color: #7d32a8;
    }
    
    .delete-event-btn {
        background-color: white;
        color: var(--secondary-color);
        border: 1px solid var(--secondary-color);
    }
    
    .delete-event-btn:hover {
        background-color: var(--secondary-color);
        color: white;
    }
    
    /* Notification styles */
    .notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .notification.visible {
        transform: translateY(0);
        opacity: 1;
    }
    
    /* Forgot password link */
    .forgot-password {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 0.9rem;
        transition: var(--transition);
    }
    
    .forgot-password:hover {
        color: var(--secondary-color);
        text-decoration: underline;
    }
    
    /* Animation for new content */
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

document.head.appendChild(styleElement);