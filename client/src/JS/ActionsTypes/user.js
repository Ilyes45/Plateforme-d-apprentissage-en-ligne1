// 🔹 Succès / Échec / Chargement des actions liées aux utilisateurs
export const SUCC_USER = "SUCC_USER";       // Action succès lors de l'inscription ou login
export const FAIL_USER = "FAIL_USER";       // Action en cas d'échec (ex: erreur serveur ou validation)
export const LOAD_USER = "LOAD_USER";       // Indique le début d'une requête utilisateur
export const LOGOUT_USER = "LOGOUT_USER";   // Déconnecte l'utilisateur et vide le store

// 🔹 Gestion d'un utilisateur spécifique
export const CURRENT_USER = "CURRENT_USER"; // Récupère l'utilisateur courant connecté
export const GET_USER = "GET_USER";         // Récupère un utilisateur précis (ex: pour édition)
export const USER_ERRORS = "USER_ERRORS";   // Ajoute une erreur spécifique à la liste des erreurs

// 🔹 Gestion de tous les utilisateurs (admin)
export const GET_ALL_USERS = "GET_ALL_USERS"; // Récupère tous les utilisateurs

// 🔹 Gestion du progrès utilisateur
export const GET_USER_PROGRESS = "GET_USER_PROGRESS";       // Récupère le progrès d’un utilisateur pour un cours
export const UPDATE_USER_PROGRESS = "UPDATE_USER_PROGRESS"; // Met à jour le progrès utilisateur
