// sub-skill.js

function chooseSubSkill(subSkill) {
    if (window.chosenSubSkill) {
        document.querySelector(`.grade-bar[data-subskill="${window.chosenSubSkill}"]`).style.display = 'none';
    }
    window.chosenSubSkill = subSkill;
    document.querySelector(`.grade-bar[data-subskill="${window.chosenSubSkill}"]`).style.display = 'inline-flex';
}

function applySubSkillFormatting(subSkill, grade) {
    console.log("Applying formatting for:", subSkill, "with grade:", grade);
    const subSkillColors = {
        'Propositional Phrase': '#FFB6C1',
        'Transition': '#FFD700',
        'Proper Noun': '#ADD8E6',
        'Sub Conjunction': '#FF6347',
        'Pronoun': '#98FB98',
    };
    const mainSkillColor = '#5169f5';

    quill.format('color', subSkillColors[subSkill]);
    quill.format('background', mainSkillColor); // This is the main skill color
}

export { chooseSubSkill, applySubSkillFormatting };
