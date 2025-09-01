// 🔹 Gestion du cycle asynchrone pour les messages
export const LOAD_MESSAGES = "LOAD_MESSAGES";   // Déclenché au début du fetch des messages (chargement)
export const GET_MESSAGES = "GET_MESSAGES";     // Déclenché quand les messages sont récupérés avec succès
export const FAIL_MESSAGES = "FAIL_MESSAGES";   // Déclenché en cas d'erreur lors de la récupération

// 🔹 Actions spécifiques aux messages
export const DELETE_MESSAGE = "DELETE_MESSAGE"; // Supprimer un message du store après suppression côté backend
export const MARK_AS_READ = "MARK_AS_READ";     // Marquer un message comme lu dans le store
