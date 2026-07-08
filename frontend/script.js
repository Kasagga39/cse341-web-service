// helpful link for converting image to base64: https://elmah.io/tools/base64-image-encoder/
async function apiFetch(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
}

const getData = async () => {
    try {
        const data = await apiFetch('/professional');
        const profile = Array.isArray(data) ? data[0] : data;
        if (profile) {
            displayAllData(profile);
        }
    } catch (error) {
        console.error('Unable to load profile data:', error);
    }
};

function displayAllData(data) {
    displayProfessionalName(data.professionalName || `${data.firstName || ''} ${data.lastName || ''}`.trim());
    displayPrimaryDescription(data);
    displayWorkDescription(data);
    displayLinkTitleText(data.linkTitleText || 'Links');
    displayLinkedInLink(data.linkedInLink || {});
    displayGitHubLink(data.githubLink || {});
    displayContactText(data.contactText || '');

    if (data.base64Image) {
        displayImage(data.base64Image);
    } else {
        hideUnusedFields();
    }
}

function hideUnusedFields() {
    const image = document.getElementById('professionalImage');
    image.style.display = 'none';
}

function displayProfessionalName(n) {
    const professionalName = document.getElementById('professionalName');
    professionalName.innerHTML = n;
}

function displayImage(img) {
    const image = document.getElementById('professionalImage');
    image.src = `data:image/png;base64,${img}`;
    image.style.display = 'block';
}

function displayPrimaryDescription(data) {
    const nameLink = document.getElementById('nameLink');
    const primaryDescription = document.getElementById('primaryDescription');

    if (data.nameLink) {
        nameLink.innerHTML = data.nameLink.firstName || 'Profile';
        nameLink.href = data.nameLink.url || '#';
        nameLink.style.display = 'inline';
    } else {
        nameLink.style.display = 'none';
    }

    primaryDescription.innerHTML = data.primaryDescription || '';
}

function displayWorkDescription(data) {
    const workDescription1 = document.getElementById('workDescription1');
    const workDescription2 = document.getElementById('workDescription2');
    workDescription1.innerHTML = data.workDescription1 || '';
    workDescription2.innerHTML = data.workDescription2 || '';
}

function displayLinkTitleText(data) {
    const linkTitle = document.getElementById('linkTitleText');
    linkTitle.innerHTML = data;
}

function displayLinkedInLink(data) {
    const linkedInLink = document.getElementById('linkedInLink');
    linkedInLink.innerHTML = data.text || 'LinkedIn';
    linkedInLink.href = data.link || '#';
}

function displayGitHubLink(data) {
    const githubLink = document.getElementById('githubLink');
    githubLink.innerHTML = data.text || 'GitHub';
    githubLink.href = data.link || '#';
}

function displayContactText(data) {
    const contactText = document.getElementById('contactText');
    contactText.innerHTML = data;
}

getData();