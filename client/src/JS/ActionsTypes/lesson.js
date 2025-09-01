// 🔹 Gestion du cycle asynchrone pour les leçons
export const LOAD_LESSON = "LOAD_LESSON";   // Déclenché au début du fetch des leçons (affichage du spinner)
export const SUCC_LESSON = "SUCC_LESSON";   // Déclenché quand les leçons sont récupérées avec succès
export const FAIL_LESSON = "FAIL_LESSON";   // Déclenché en cas d'erreur lors de la récupération

// 🔹 Action spécifique pour une seule leçon
export const GET_LESSON = "GET_LESSON";     // Déclenché quand une leçon précise est récupérée (ex: pour l’édition)
