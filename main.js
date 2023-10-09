var quill = new Quill('#textInput', {
    modules: {
        toolbar: false
    },
    theme: 'snow'
});

var badgeData = {};
let isMultipleSelect = true;
let multipleSelections = [];
let selectedRange = null;

let activeSubSkillButton = null;

quill.on('selection-change', function (range) {
    if (range) {
        if (range.length !== 0) {
            showSubSkillTooltip(range);
        }
    }
});

function highlightText() {
    if (isMultipleSelect) {
        quill.format('background', '#6495ED');
        if (!activeSubSkillButton) {
            colour_level();
        }
    }
}

function clearFormatting() {
    var selection = quill.getSelection();
    if (selection) {
        quill.removeFormat(selection.index, selection.length);
    } else {
        console.warn('No text selected');
    }
}

// Unsure is this refering drop down menu ??
function colour_level() {
    var selectedOption = document.forms["Colour_selection"]["levels"].value;
    if (selectedOption === 'Level_2') {
        quill.format('background', '#6278f6');
    } else if (selectedOption === 'Level_3') {
        quill.format('background', '#8596f8');
    } else if (selectedOption === 'Level_4') {
        quill.format('background', '#b9c3fb');
    } else {
        quill.format('background', '#F5F5F5');
    }
}

var currentSubSkill;

function showGrading(subSkill) {
    currentSubSkill = subSkill;
    document.getElementById("grading").style.display = "block";

    let clickedButton = document.querySelector(`button[data-subskill="${subSkill}"]`);

    if (activeSubSkillButton && activeSubSkillButton !== clickedButton) {
        activeSubSkillButton.classList.remove('active-subskill');
    }

    clickedButton.classList.add('active-subskill');
    activeSubSkillButton = clickedButton;
}

let lastSelectedRange = null;
document.getElementById("textInput").addEventListener("mouseup", () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        lastSelectedRange = selection.getRangeAt(0);
    }
});

function addComment() {
    const commentText = document.getElementById("commentbox").value.trim();
    console.log("Comment:", commentText); // Log the comment text for debugging

    if (commentText === "") {
        console.log("Comment Text is empty"); // Log the comment text for debugging
        return;
    }

    if (lastSelectedRange) {
        const range = lastSelectedRange;

        const selectedText = range.toString();
        const skill = range.startContainer.parentElement.getAttribute('data-skill');

        const commentElem = document.createElement('span');
        commentElem.className = 'comment-badge';
        commentElem.textContent = "💬";
        commentElem.title = commentText + ' (Skill: ' + skill + ')';
        commentElem.style.position = 'sticky';
        commentElem.style.textDecoration = 'underline';
        commentElem.style.top = `${range.top}px`;
        commentElem.style.left = `${range.left + range.width}px`;

        const span = document.createElement('span');
        span.appendChild(range.cloneContents());
        range.deleteContents();
        range.insertNode(span);
        span.appendChild(commentElem);

        document.getElementById("user_comment").value = "";

        //  *****  Save comment data in session storage *****
        sessionStorage.setItem("user_comment", commentText);

        document.querySelector(".commpopup").style.display = "none";
    } else {
        console.warn('No text selected');
    }
}

function toggleCommentPopup() {
    var popup = document.querySelector(".commpopup");
    popup.classList.toggle("commentInput");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
        const selectedText = window.getSelection().toString();
        document.getElementById("selectedText").value = selectedText;
    } else {
        popup.style.display = "none";
    }
}

function getAcronym(subSkillName) {
    const words = subSkillName.split(' ');
    if (words.length > 1) {
        return words.map(word => word.charAt(0)).join('').toUpperCase();
    } else {
        return words[0].charAt(0).toUpperCase() + words[0].charAt(1);
    }
}

function confirmGrade() {
    var gradeValue = document.getElementById("gradeValue").value;
    let subSkillColor;

    switch (currentSubSkill) {
        case 'Propositional Phrase':
            subSkillColor = '#FFB6C1';
            break;
        case 'Transition':
            subSkillColor = '#FFD700';
            break;
        case 'Proper Noun':
            subSkillColor = '#ADD8E6';
            break;
        case 'Sub Conjunction':
            subSkillColor = '#FF6347';
            break;
        case 'Pronoun':
            subSkillColor = '#98FB98';
            break;
    }

    if (isMultipleSelect) {
        for (let selection of multipleSelections) {
            quill.formatText(selection.index, selection.length, 'background', subSkillColor);
            addBadgeOverText(gradeValue, subSkillColor, selection);
        }
        multipleSelections = [];
        quill.format('background', subSkillColor); // Reset the general background to default
    }
    else {
        // existing logic for single selection
        const range = quill.getSelection();
        if (range) {
            quill.format('background', subSkillColor);
            if (currentSubSkill === 'Sentence Beginnings') {
                quill.format('bold', true);
            }
            addBadgeOverText(gradeValue, subSkillColor, range);
        }
    }

    // Hide the grade selector after confirming
    gradeSelector.style.display = "none";
    multipleSelections = []; // Reset the multiple selections

    addBadgeOverText(gradeValue, subSkillColor);

    document.getElementById("grading").style.display = "none";
}

function addBadgeOverText(gradeValue, subSkillColor, range) {
    const quillContainer = document.querySelector('#textInput');
    const bounds = quill.getBounds(range.index);

    const badgeElem = document.createElement('span');
    badgeElem.className = 'badge';
    badgeElem.textContent = getAcronym(currentSubSkill);
    badgeElem.style.backgroundColor = subSkillColor;
    badgeElem.style.position = "absolute"; // Ensure positioning is absolute
    badgeElem.style.top = `${bounds.top}px`;
    badgeElem.style.left = `${bounds.left + bounds.width}px`;

    const rangeIndex = JSON.stringify(range);
    badgeElem.setAttribute('data-range-index', rangeIndex);
    quillContainer.appendChild(badgeElem);

}

function clearBadge() {
    const quillContainer = document.querySelector('#textInput');
    const rangeIndex = quill.getSelection().index;
    const badgeToRemove = quillContainer.querySelector(`.badge[data-range-index="${rangeIndex}"]`);
    const badgeNextToButton = document.querySelector(`.badge-next-to-button[data-range-index="${rangeIndex}"]`);
    if (badgeToRemove) {
        badgeToRemove.remove();
    }
    if (badgeNextToButton) {
        badgeNextToButton.remove();
    }
}

function clearSubSkillFormatting() {
    var range = quill.getSelection();
    if (range) {
        var rangeIndex = JSON.stringify(range);
        var data = badgeData[rangeIndex];
        if (data) {
            quill.removeFormat(data.range.index, data.range.length);
            data.badge.remove();
            data.badgeCopy.remove();
            delete badgeData[rangeIndex];
        } else {
            console.warn('No badge data found for selected range');
        }
    } else {
        var selectedBadge = document.querySelector('.badge-next-to-button.selected');
        if (selectedBadge) {
            var rangeIndex = selectedBadge.getAttribute('data-range-index');
            var data = badgeData[rangeIndex];
            if (data) {
                quill.removeFormat(data.range.index, data.range.length);
                data.badge.remove();
                data.badgeCopy.remove();
                delete badgeData[rangeIndex];
            } else {
                console.warn('No badge data found for selected badge');
            }
        } else {
            console.warn('No text selected');
        }
    }
}

function clearBadgeByClickingOnIt(range) {
    const quillContainer = document.querySelector('#textInput');
    const rangeIndex = range.index;
    const badgeToRemove = quillContainer.querySelector(`.badge[data-range-index="${rangeIndex}"]`);
    const badgeNextToButton = document.querySelector(`.badge-next-to-button[data-range-index='${JSON.stringify(range)}']`);
    if (badgeToRemove) {
        badgeToRemove.remove();
    }
    if (badgeNextToButton) {
        badgeNextToButton.remove();
    }
    if (badgeData[rangeIndex]) {
        delete badgeData[rangeIndex];
    }
}

function clearAllSubSkillFormatting() {
    const quillContainer = document.querySelector('#textInput');
    const badgesToRemove = document.querySelectorAll('.badge, .badge-next-to-button');
    badgesToRemove.forEach(badge => badge.remove());
    quill.removeFormat(0, quill.getLength());
}

function highlightSelected(range, subSkillColor) {
    const quillContainer = document.querySelector('#textInput');
    const badge = quillContainer.querySelector(`.badge[data-range-index='${JSON.stringify(range)}']`);
    if (badge) {
        badge.classList.add('selected');
    }
    quill.formatText(range.index, range.length, 'background', subSkillColor);
    quill.formatText(range.index, range.length, 'underline', 'red');
}

function unhighlightSelected(range, subSkillColor) {
    const quillContainer = document.querySelector('#textInput');
    const badge = quillContainer.querySelector(`.badge[data-range-index='${JSON.stringify(range)}']`);
    if (badge) {
        badge.classList.remove('selected');
    }
    quill.formatText(range.index, range.length, 'background', subSkillColor);
    quill.formatText(range.index, range.length, 'underline', false);
}


function updateTextArea() {
    var content = quill.root.innerHTML;
    document.getElementById("annotatedtext").value = content;

}



// Get the modal
var modal = document.getElementById("markingCriteriaModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Show the modal
function showModal() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// If you'd like the modal to close when clicking outside of it:
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function showSubSkillTooltip(range) {
    const bounds = quill.getBounds(range.index);
    const tooltip = document.getElementById('subSkillTooltip');

    tooltip.style.top = (bounds.top + bounds.height + 95) + 'px';
    tooltip.style.left = (bounds.left + bounds.width / 2 - tooltip.offsetWidth / 2) + 'px';  // Center the tooltip

    tooltip.style.display = 'flex';
}

function hideSubSkillTooltip() {
    const tooltip = document.getElementById('subSkillTooltip');
    tooltip.style.display = 'none';
}

function selectSubSkill(subSkill) {
    showGrading(subSkill);  // Existing function to handle sub-skill
    hideSubSkillTooltip();
}

// Modify the `selection-change` event listener
quill.on('selection-change', function (range) {
    if (range) {
        if (range.length !== 0) {
            if (isMultipleSelect) {
                multipleSelections.push(range);
            } else {
                showSubSkillTooltip(range);  // Show the tooltip when text is highlighted
            }
        } else {
            hideSubSkillTooltip();  // Hide the tooltip when no text is highlighted
        }
    }
});


let currentZoom = 100; // Starting zoom percentage
const zoomIncrement = 10; // 10% increment/decrement
const maxZoom = 200; // 200% zoom-in limit
const minZoom = 50;  // 50% zoom-out limit

function updateZoomDisplay() {
    document.getElementById('zoom-percentage').innerText = `${currentZoom}%`;
}

function applyZoom() {
    // Apply zoom to the Quill editor
    document.getElementById('textInput').style.fontSize = `${currentZoom}%`;
    updateZoomDisplay();
}

function zoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom += zoomIncrement;
        applyZoom();
    }
}

function zoomOut() {
    if (currentZoom > minZoom) {
        currentZoom -= zoomIncrement;
        applyZoom();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateZoomDisplay();
});