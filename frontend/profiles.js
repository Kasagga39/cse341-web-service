async function apiFetch(url, options = {}) {
    let targetUrl = url;
    const isLocalhostDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (window.location.protocol === 'file:' || (isLocalhostDev && window.location.port !== '3000')) {
        targetUrl = 'http://localhost:3000' + url;
    }

    const defaultHeaders = { 'Content-Type': 'application/json' };
    const body = options.body;
    const requestBody = body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined;

    const response = await fetch(targetUrl, {
        ...options,
        body: requestBody,
        headers: { ...defaultHeaders, ...(options.headers || {}) }
    });

    if (!response.ok) {
        let errMsg = `Request failed with status ${response.status}`;
        try {
            const errData = await response.json();
            if (errData && errData.message) errMsg = errData.message;
        } catch (e) {}
        throw new Error(errMsg);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) return response.json();
    return response.text();
}

let allProfiles = [];

const profilesGrid = document.getElementById('profilesGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addProfileBtn = document.getElementById('addProfileBtn');
const profileModal = document.getElementById('profileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const profileForm = document.getElementById('profileForm');
const modalTitle = document.getElementById('modalTitle');
const notificationToast = document.getElementById('notificationToast');
const toastMessage = document.getElementById('toastMessage');

const profileIdInput = document.getElementById('profileId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const bioInput = document.getElementById('bio');
const skillsInput = document.getElementById('skills');
const experienceInput = document.getElementById('experience');
const educationInput = document.getElementById('education');
const locationInput = document.getElementById('location');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const bioError = document.getElementById('bioError');
const skillsError = document.getElementById('skillsError');
const experienceError = document.getElementById('experienceError');
const educationError = document.getElementById('educationError');
const locationError = document.getElementById('locationError');

function init() {
    loadProfiles();
    searchInput.addEventListener('input', handleSearch);
    addProfileBtn.addEventListener('click', () => openModal('add'));
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    profileForm.addEventListener('submit', handleFormSubmit);

    nameInput.addEventListener('blur', () => validateField(nameInput, nameError));
    emailInput.addEventListener('blur', () => validateEmailField());
    phoneInput.addEventListener('blur', () => validateField(phoneInput, phoneError));
    bioInput.addEventListener('blur', () => validateField(bioInput, bioError));
    skillsInput.addEventListener('blur', () => validateField(skillsInput, skillsError));
    experienceInput.addEventListener('blur', () => validateField(experienceInput, experienceError));
    educationInput.addEventListener('blur', () => validateField(educationInput, educationError));
    locationInput.addEventListener('blur', () => validateField(locationInput, locationError));
}

async function loadProfiles() {
    showLoading(true);
    try {
        const data = await apiFetch('/api/profiles');
        allProfiles = Array.isArray(data) ? data : [];
        renderProfiles(allProfiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        showToast('Failed to load profiles from live database.', true);
        showLoading(false);
    }
}

function renderProfiles(profiles) {
    showLoading(false);
    profilesGrid.innerHTML = '';

    if (profiles.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    profiles.forEach(profile => {
        const card = createProfileCard(profile);
        profilesGrid.appendChild(card);
    });
}

function createProfileCard(profile) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.id = `profile-${profile._id}`;

    const initials = (profile.name || '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const skillsHtml = skills.slice(0, 3).map(s => `<span class="color-badge">${s}</span>`).join('');
    const moreSkills = skills.length > 3 ? `<span class="color-badge">+${skills.length - 3} more</span>` : '';

    const avatarColors = ['#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#e74c3c', '#1abc9c'];
    let hash = 0;
    for (let i = 0; i < (profile.name || '').length; i++) {
        hash = (profile.name || '').charCodeAt(i) + ((hash << 5) - hash);
    }
    const avatarColor = avatarColors[Math.abs(hash) % avatarColors.length];

    card.innerHTML = `
        <div class="card-header">
            <div class="avatar" style="background: ${avatarColor}">
                <span>${initials}</span>
            </div>
            <div class="card-actions">
                <button class="action-btn edit-btn" title="Edit Profile" aria-label="Edit profile">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" title="Delete Profile" aria-label="Delete profile">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        <div class="card-body">
            <h3>${profile.name}</h3>
            <div class="contact-details">
                <p class="detail-item">
                    <i class="fas fa-envelope detail-icon"></i>
                    <a href="mailto:${profile.email}" class="detail-link" title="Send Email">${profile.email}</a>
                </p>
                <p class="detail-item">
                    <i class="fas fa-phone detail-icon"></i>
                    <span>${profile.phone}</span>
                </p>
                <p class="detail-item">
                    <i class="fas fa-map-marker-alt detail-icon"></i>
                    <span>${profile.location}</span>
                </p>
                <p class="detail-item">
                    <i class="fas fa-briefcase detail-icon"></i>
                    <span>${profile.experience}</span>
                </p>
                <p class="detail-item">
                    <i class="fas fa-graduation-cap detail-icon"></i>
                    <span>${profile.education}</span>
                </p>
                <p class="detail-item bio-text">
                    <i class="fas fa-info-circle detail-icon"></i>
                    <span>${profile.bio}</span>
                </p>
                <div class="detail-item skills-row">
                    <i class="fas fa-tools detail-icon"></i>
                    <div class="skills-tags">${skillsHtml}${moreSkills}</div>
                </div>
            </div>
        </div>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => openModal('edit', profile));
    card.querySelector('.delete-btn').addEventListener('click', () => handleDeleteProfile(profile));

    return card;
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderProfiles(allProfiles);
        return;
    }

    const filtered = allProfiles.filter(profile => {
        return (profile.name || '').toLowerCase().includes(query) ||
            (profile.email || '').toLowerCase().includes(query) ||
            (profile.location || '').toLowerCase().includes(query) ||
            (profile.bio || '').toLowerCase().includes(query) ||
            (Array.isArray(profile.skills) ? profile.skills.some(s => s.toLowerCase().includes(query)) : false);
    });

    renderProfiles(filtered);
}

function openModal(mode, profile = null) {
    resetFormErrors();

    if (mode === 'edit' && profile) {
        modalTitle.textContent = 'Edit Profile';
        profileIdInput.value = profile._id;
        nameInput.value = profile.name || '';
        emailInput.value = profile.email || '';
        phoneInput.value = profile.phone || '';
        bioInput.value = profile.bio || '';
        skillsInput.value = Array.isArray(profile.skills) ? profile.skills.join(', ') : '';
        experienceInput.value = profile.experience || '';
        educationInput.value = profile.education || '';
        locationInput.value = profile.location || '';
    } else {
        modalTitle.textContent = 'Add New Profile';
        profileForm.reset();
        profileIdInput.value = '';
    }

    profileModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    nameInput.focus();
}

function closeModal() {
    profileModal.classList.add('hidden');
    document.body.style.overflow = '';
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameError);
    const isEmailValid = validateEmailField();
    const isPhoneValid = validateField(phoneInput, phoneError);
    const isBioValid = validateField(bioInput, bioError);
    const isSkillsValid = validateField(skillsInput, skillsError);
    const isExpValid = validateField(experienceInput, experienceError);
    const isEduValid = validateField(educationInput, educationError);
    const isLocValid = validateField(locationInput, locationError);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isBioValid || !isSkillsValid || !isExpValid || !isEduValid || !isLocValid) {
        return;
    }

    const profileId = profileIdInput.value;
    const profileData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        bio: bioInput.value.trim(),
        skills: skillsInput.value.split(',').map(s => s.trim()).filter(s => s),
        experience: experienceInput.value.trim(),
        education: educationInput.value.trim(),
        location: locationInput.value.trim()
    };

    const isEdit = !!profileId;
    const url = isEdit ? `/api/profiles/${profileId}` : '/api/profiles';
    const method = isEdit ? 'PUT' : 'POST';

    try {
        showSubmitButtonLoading(true);
        await apiFetch(url, { method, body: profileData });
        showToast(isEdit ? 'Profile updated successfully!' : 'Profile added successfully!', false);
        closeModal();
        loadProfiles();
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast(error.message || 'Error occurred while saving profile.', true);
    } finally {
        showSubmitButtonLoading(false);
    }
}

async function handleDeleteProfile(profile) {
    const confirmDelete = confirm(`Are you sure you want to delete ${profile.name}?`);
    if (!confirmDelete) return;

    try {
        const card = document.getElementById(`profile-${profile._id}`);
        if (card) card.style.opacity = '0.5';

        await apiFetch(`/api/profiles/${profile._id}`, { method: 'DELETE' });
        showToast('Profile deleted successfully.', false);
        loadProfiles();
    } catch (error) {
        console.error('Error deleting profile:', error);
        showToast(error.message || 'Failed to delete profile.', true);
        loadProfiles();
    }
}

function validateField(inputEl, errorEl) {
    if (!inputEl.value.trim()) {
        errorEl.classList.add('visible');
        inputEl.classList.add('invalid');
        return false;
    }
    errorEl.classList.remove('visible');
    inputEl.classList.remove('invalid');
    return true;
}

function validateEmailField() {
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
        emailError.textContent = 'Email address is required';
        emailError.classList.add('visible');
        emailInput.classList.add('invalid');
        return false;
    }
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
    [nameError, emailError, phoneError, bioError, skillsError, experienceError, educationError, locationError].forEach(el => el.classList.remove('visible'));
    [nameInput, emailInput, phoneInput, bioInput, skillsInput, experienceInput, educationInput, locationInput].forEach(el => el.classList.remove('invalid'));
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        profilesGrid.classList.add('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
        profilesGrid.classList.remove('hidden');
    }
}

function showSubmitButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Profile';
    }
}

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

init();
