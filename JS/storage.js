//storage.js
//Gestion du localStorage (utilisateurs, posts, session)

// -- Utilisateurs --
// Récupère la liste des utilisateurs
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Sauvegarde la liste des utilisateurs
function sauvergarderUtilisateurs(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// -- POSTS --
// Récupère tous les pots
function getPosts() {
  const posts = localStorage.getItem('posts');
  return posts ? JSON.parse(posts) : [];
}

// Sauvergarde tous les posts
function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// -- SESSION --
// Utilisateur connecté
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// Définit l'utilisateur connecté
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

// Déconnexion
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "main.html";
}

//ID UNIQUE
function genererIdUnique() {
  return 'post-' + Date.now().toString(36) + 
Math.random().toString(36).substring(2);
}