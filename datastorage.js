// datastorage.js

const dataStorage = {
    "Propositional Phrase": {
        "grade_1": [],
        "grade_2": [],
        "grade_3": [],
        "grade_4": [],
        "grade_5": []
    },
    "Transition": {
        "grade_1": [],
        "grade_2": [],
        "grade_3": [],
        "grade_4": [],
        "grade_5": []
    },
    "Proper Noun": {
        "grade_1": [],
        "grade_2": [],
        "grade_3": [],
        "grade_4": [],
        "grade_5": []
    },
    "Sub Conjunction": {
        "grade_1": [],
        "grade_2": [],
        "grade_3": [],
        "grade_4": [],
        "grade_5": []
    },
    "Pronoun": {
        "grade_1": [],
        "grade_2": [],
        "grade_3": [],
        "grade_4": [],
        "grade_5": []
    }


    // ... Same for other sub-skills ...
};

function saveData(subSkill, grade, text, comment = '') {
    dataStorage[subSkill][`grade_${grade}`].push({
        text: text,
        comment: comment
    });
}

export { dataStorage, saveData };
