// 🔹 Loading (début d'une action asynchrone)
export const LOAD_COURSE = "LOAD_COURSE"; // Utilisé pour indiquer que les cours sont en cours de chargement

// 🔹 Success / Fail (résultat d'une action asynchrone)
export const SUCC_COURSE = "SUCC_COURSE"; // Succès général pour les actions liées aux cours
export const FAIL_COURSE = "FAIL_COURSE"; // Échec d'une action (erreur serveur ou autre)

// 🔹 Récupération des cours
export const GET_COURSES = "GET_COURSES"; // Liste de tous les cours
export const GET_COURSE = "GET_COURSE";   // Détails d'un cours spécifique (ex: pour l'édition)

// 🔹 Assignation / désassignation d’un cours à un utilisateur
export const ASSIGN_COURSE = "ASSIGN_COURSE";                // Assignation réussie
export const UNASSIGN_COURSE_SUCCESS = "UNASSIGN_COURSE_SUCCESS"; // Désassignation réussie
export const UNASSIGN_COURSE_FAIL = "UNASSIGN_COURSE_FAIL";       // Désassignation échouée

// 🔹 Progression des utilisateurs
export const COMPLETE_COURSE = "COMPLETE_COURSE";           // Marquer un cours comme terminé
export const REMOVE_COURSE_PROGRESS = "REMOVE_COURSE_PROGRESS"; // Supprimer la progression d’un cours
