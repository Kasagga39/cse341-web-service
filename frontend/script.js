// API request helper supporting multiple methods
async function apiFetch(url, options = {}) {
    // Redirect API calls to local port 3000 when opened via file:// or other local dev servers (e.g. port 5500)
    let targetUrl = url;
    const isLocalhostDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol === 'file:' || (isLocalhostDev && window.location.port !== '3000')) {
        targetUrl = 'http://localhost:3000' + url;
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const body = options.body;
    const requestBody = body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;

    const response = await fetch(targetUrl, {
        ...options,
        body: requestBody,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        let errMsg = `Request failed with status ${response.status}`;
        try {
            const errData = await response.json();
            if (errData && errData.message) {
                errMsg = errData.message;
            }
        } catch (e) {
            // Ignore if response is not JSON
        }
        throw new Error(errMsg);
    }

    // Some routes (like delete) might not return content or return simple text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

// Global state
let allContacts = [];

// DOM Elements
const contactsGrid = document.getElementById('contactsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addContactBtn = document.getElementById('addContactBtn');
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const contactForm = document.getElementById('contactForm');
const modalTitle = document.getElementById('modalTitle');
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.getElementById('toastMessage');

// Form Fields
const contactIdInput = document.getElementById('contactId');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const favoriteColorInput = document.getElementById('favoriteColor');
const birthdayInput = document.getElementById('birthday');

// Form Error Elements
const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const emailError = document.getElementById('emailError');

// Initialize App
function init() {
    loadContacts();

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);
    addContactBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    contactForm.addEventListener('submit', handleFormSubmit);

    // Dynamic Validation on blur
    firstNameInput.addEventListener('blur', () => validateField(firstNameInput, firstNameError));
    lastNameInput.addEventListener('blur', () => validateField(lastNameInput, lastNameError));
    emailInput.addEventListener('blur', () => validateEmailField());
}

// Load Contacts from Database
async function loadContacts() {
    showLoading(true);
    try {
        const data = await apiFetch('/api/contacts');
        allContacts = Array.isArray(data) ? data : [];
        renderContacts(allContacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        showToast('Failed to load contacts from live database.', true);
        showLoading(false);
    }
}

// Render Contacts Grid
function renderContacts(contacts) {
    showLoading(false);
    contactsGrid.innerHTML = '';

    if (contacts.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    contacts.forEach(contact => {
        const card = createContactCard(contact);
        contactsGrid.appendChild(card);
    });
}

// Create Card Element
function createContactCard(contact) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.id = `contact-${contact._id}`;

    // Formatting fields
    const initials = ((contact.firstName[0] || '') + (contact.lastName[0] || '')).toUpperCase();
    const fullName = `${contact.firstName} ${contact.lastName}`;
    const birthdayStr = contact.birthday ? formatDate(contact.birthday) : 'Not specified';
    const favColor = contact.favoriteColor || 'Slate';

    // Set dynamic color for avatar
    const avatarColor = getAvatarColor(favColor);

    card.innerHTML = `
        <div class="card-header">
            <div class="avatar" style="background: ${avatarColor}">
                <span>${initials}</span>
            </div>
            <div class="card-actions">
                <button class="action-btn edit-btn" title="Edit Contact" aria-label="Edit contact">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete Contact" aria-label="Delete contact">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <h3>${fullName}</h3>
            <div class="contact-details">
                <p class="detail-item">
                    <i class="fas fa-envelope detail-icon"></i>
                    <a href="mailto:${contact.email}" class="detail-link" title="Send Email">${contact.email}</a>
                </p>
                <p class="detail-item">
                    <i class="fas fa-birthday-cake detail-icon"></i>
                    <span>${birthdayStr}</span>
                </p>
                <p class="detail-item">
                    <i class="fas fa-palette detail-icon"></i>
                    <span class="color-badge" style="border-left: 4px solid ${avatarColor}">
                        ${favColor}
                    </span>
                </p>
            </div>
        </div>
    `;

    // Add action event listeners
    card.querySelector('.edit-btn').addEventListener('click', () => openModal('edit', contact));
    card.querySelector('.delete-btn').addEventListener('click', () => handleDeleteContact(contact));

    return card;
}

// Helpers for Avatars and Colors
function getAvatarColor(colorStr) {
    const cleanColor = colorStr.trim().toLowerCase();

    // Check if it's a hex or standard color name, otherwise map or generate a stable color
    const colorMap = {
        red: '#e74c3c',
        blue: '#3498db',
        green: '#2ecc71',
        yellow: '#f1c40f',
        orange: '#e67e22',
        purple: '#9b59b6',
        pink: '#e84393',
        teal: '#1abc9c',
        gray: '#95a5a6',
        grey: '#95a5a6',
        black: '#2d3436',
        white: '#dfe6e9',
        slate: '#70a1ff'
    };

    if (colorMap[cleanColor]) {
        return colorMap[cleanColor];
    }

    // If it looks like a hex color, return it
    if (/^#([0-9a-f]{3}){1,2}$/i.test(cleanColor) || /^rgb/i.test(cleanColor) || /^hsl/i.test(cleanColor)) {
        return colorStr;
    }

    // Hash string to map to a list of beautiful gradients/colors
    const standardColors = [
        '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#e67e22',
        '#e74c3c', '#1abc9c', '#fd79a8', '#6c5ce7', '#00b894'
    ];
    let hash = 0;
    for (let i = 0; i < colorStr.length; i++) {
        hash = colorStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % standardColors.length);
    return standardColors[index];
}

// Date Formatter
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        // Return structured date format
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC' // Keep date exact as seeded
        });
    } catch (e) {
        return dateString;
    }
}

// Search Handler
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderContacts(allContacts);
        return;
    }

    const filtered = allContacts.filter(contact => {
        const firstName = (contact.firstName || '').toLowerCase();
        const lastName = (contact.lastName || '').toLowerCase();
        const email = (contact.email || '').toLowerCase();
        const color = (contact.favoriteColor || '').toLowerCase();

        return firstName.includes(query) ||
            lastName.includes(query) ||
            email.includes(query) ||
            color.includes(query);
    });

    renderContacts(filtered);
}

// Modal management
function openModal(mode, contact = null) {
    resetFormErrors();

    if (mode === 'edit' && contact) {
        modalTitle.textContent = 'Edit Contact';
        contactIdInput.value = contact._id;
        firstNameInput.value = contact.firstName || '';
        lastNameInput.value = contact.lastName || '';
        emailInput.value = contact.email || '';
        favoriteColorInput.value = contact.favoriteColor || '';

        // Format date to YYYY-MM-DD for date input
        if (contact.birthday) {
            const date = new Date(contact.birthday);
            if (!isNaN(date.getTime())) {
                birthdayInput.value = date.toISOString().split('T')[0];
            } else {
                birthdayInput.value = '';
            }
        } else {
            birthdayInput.value = '';
        }
    } else {
        modalTitle.textContent = 'Add New Contact';
        contactForm.reset();
        contactIdInput.value = '';
    }

    contactModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scroll under modal
    firstNameInput.focus();
}

function closeModal() {
    contactModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Form Submission (Add/Edit)
async function handleFormSubmit(e) {
    e.preventDefault();

    const isFirstNameValid = validateField(firstNameInput, firstNameError);
    const isLastNameValid = validateField(lastNameInput, lastNameError);
    const isEmailValid = validateEmailField();

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid) {
        return;
    }

    const contactId = contactIdInput.value;
    const contactData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        favoriteColor: favoriteColorInput.value.trim() || undefined,
        birthday: birthdayInput.value ? new Date(birthdayInput.value).toISOString() : undefined
    };

    const isEdit = !!contactId;
    const url = isEdit ? `/api/contacts/${contactId}` : '/api/contacts';
    const method = isEdit ? 'PUT' : 'POST';

    try {
        showSubmitButtonLoading(true);
        await apiFetch(url, {
            method,
            body: contactData
        });

        showToast(isEdit ? 'Contact updated successfully!' : 'Contact added successfully!', false);
        closeModal();
        loadContacts();
    } catch (error) {
        console.error('Error saving contact:', error);
        showToast(error.message || 'Error occurred while saving contact.', true);
    } finally {
        showSubmitButtonLoading(false);
    }
}

// Delete Contact
async function handleDeleteContact(contact) {
    const confirmDelete = confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`);
    if (!confirmDelete) return;

    try {
        const card = document.getElementById(`contact-${contact._id}`);
        if (card) card.style.opacity = '0.5';

        await apiFetch(`/api/contacts/${contact._id}`, {
            method: 'DELETE'
        });

        showToast('Contact deleted successfully.', false);
        loadContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
        showToast(error.message || 'Failed to delete contact.', true);
        loadContacts(); // Refresh UI to restore opacity
    }
}

// Validation Helpers
function validateField(inputEl, errorEl) {
    if (!inputEl.value.trim()) {
        errorEl.classList.add('visible');
        inputEl.classList.add('invalid');
        return false;
    } else {
        errorEl.classList.remove('visible');
        inputEl.classList.remove('invalid');
        return true;
    }
}

function validateEmailField() {
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
        emailError.textContent = 'Email address is required';
        emailError.classList.add('visible');
        emailInput.classList.add('invalid');
        return false;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('visible');
        emailInput.classList.add('invalid');
        return false;
    }

    emailError.classList.remove('visible');
    emailInput.classList.remove('invalid');
    return true;
}

function resetFormErrors() {
    firstNameError.classList.remove('visible');
    lastNameError.classList.remove('visible');
    emailError.classList.remove('visible');

    firstNameInput.classList.remove('invalid');
    lastNameInput.classList.remove('invalid');
    emailInput.classList.remove('invalid');
}

// UI States
function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        contactsGrid.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        contactsGrid.classList.remove('hidden');
    }
}

function showSubmitButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Contact';
    }
}

// Toast Notifications
let toastTimeout;
function showToast(message, isError = false) {
    clearTimeout(toastTimeout);

    toastMessage.textContent = message;

    if (isError) {
        notificationToast.classList.add('toast-error');
    } else {
        notificationToast.classList.remove('toast-error');
    }

    notificationToast.classList.remove('hidden');
    notificationToast.classList.add('visible');

    toastTimeout = setTimeout(() => {
        notificationToast.classList.remove('visible');
        setTimeout(() => notificationToast.classList.add('hidden'), 300);
    }, 4000);
}

// Start Application
init();