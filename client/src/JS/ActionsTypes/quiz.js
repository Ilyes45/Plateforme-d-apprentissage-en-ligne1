// 🔹 Gestion du cycle asynchrone pour les quiz
export const LOAD_QUIZ = "LOAD_QUIZ";   // Déclenché au début d'une requête quiz (ex: fetch)
export const SUCC_QUIZ = "SUCC_QUIZ";   // Déclenché lorsque la requête quiz réussit
export const FAIL_QUIZ = "FAIL_QUIZ";   // Déclenché en cas d'erreur lors de la requête quiz

// 🔹 Récupération d'un quiz spécifique
export const GET_QUIZ = "GET_QUIZ";     // Permet de stocker un quiz précis dans le store pour édition ou consultation
