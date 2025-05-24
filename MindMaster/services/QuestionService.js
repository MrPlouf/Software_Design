// services/QuestionService.js

// --- Load All JSON Data ---
const englishQuestions = require('../assets/json_questions/english_questions.json');
// Make sure to create these files and update paths if different
// const geographyQuestions = require('../assets/json_questions/geography_questions.json');
// const historyQuestions = require('../assets/json_questions/history_questions.json');
const mathematicsQuestions = require('../assets/json_questions/mathematics_questions.json');
// const physicsQuestions = require('../assets/json_questions/physics_questions.json');
// const scienceQuestions = require('../assets/json_questions/science_questions.json');


const allQuestionData = {
  'English': englishQuestions.questions || [],
  // Uncomment and add themes as you create their JSON files and require them above
  // 'Geography': geographyQuestions.questions || [],
  // 'History': historyQuestions.questions || [],
  'Mathematics': mathematicsQuestions.questions || [],
  // 'Physics': physicsQuestions.questions || [],
  // 'Science': scienceQuestions.questions || [],
};

// Optional: Log to confirm loading
// Object.keys(allQuestionData).forEach(theme => {
//   console.log(`[QuestionService] Theme: ${theme}, Questions loaded: ${allQuestionData[theme]?.length || 0}`);
// });

export const getRandomQuestionsForThemeLevelDifficulty = (themeName, level, userDifficulty, count = 5) => {
  if (!allQuestionData[themeName]) {
    console.warn(`[QuestionService] No question data loaded for theme: ${themeName}. Check require path and JSON structure.`);
    return [];
  }

  const themeQuestions = allQuestionData[themeName];
  if (!Array.isArray(themeQuestions)) {
    console.warn(`[QuestionService] Data for theme ${themeName} is not an array. Check JSON structure.`);
    return [];
  }

  const matchingQuestions = themeQuestions.filter(q => {
    const questionDifficulty = q.difficulty && typeof q.difficulty === 'string' ? q.difficulty.toLowerCase() : '';
    const targetDifficulty = userDifficulty && typeof userDifficulty === 'string' ? userDifficulty.toLowerCase() : '';
    return q.level === level && questionDifficulty === targetDifficulty;
  });

  if (matchingQuestions.length === 0) {
    // console.warn(`[QuestionService] No questions found for ${themeName} - Level ${level} - Difficulty ${userDifficulty}`);
    return [];
  }
  
  const shuffled = [...matchingQuestions].sort(() => 0.5 - Math.random());
  const result = shuffled.slice(0, count);
  // console.log(`[QuestionService] Returning ${result.length} questions for ${themeName} L${level} ${userDifficulty}`);
  return result;
};

export const getAvailableThemes = () => { // Themes available in the JSON data
  return Object.keys(allQuestionData).filter(theme => allQuestionData[theme] && allQuestionData[theme].length > 0);
};