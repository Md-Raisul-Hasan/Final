// gradebadge.js

function addBadgeOverText(gradeValue) {
    // Similar to the old code but adapted for the new design
    const range = quill.getSelection();
    const bounds = quill.getBounds(range.index);

    const badgeElem = document.createElement('span');
    badgeElem.className = 'badge';
    badgeElem.textContent = gradeValue;
    badgeElem.style.top = `${bounds.top}px`;
    badgeElem.style.left = `${bounds.left}px`;

    const rangeIndex = JSON.stringify(range);
    badgeElem.setAttribute('data-range-index', rangeIndex);

    // Assuming we have an updated mechanism to insert badges
    insertBadgeToQuillContainer(badgeElem, rangeIndex);
}

function insertBadgeToQuillContainer(badge, rangeIndex) {
    const quillContainer = document.querySelector('#textInput');
    quillContainer.appendChild(badge);
}

export { addBadgeOverText };
