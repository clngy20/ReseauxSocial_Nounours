// welcome.js -> welcome.html
// Affichage d'une page bienvenue après inscription

document.addEventListener("DOMContentLoaded", () => {
    verifierConnexion();

    const utilisateur = getCurrentUser();
    if(!utilisateur) {
        alert("Utilisateur non trouvé.");
        window.location.href = "login.html";
        return;
    }
    const prenom = utilisateur.firstname || "";
    const nom    = utilisateur.name      || "";

    // Prénom dans le titre de bienvenue
    const welcomeNameEl = document.getElementById("welcomeName");
    if(welcomeNameEl) {
        welcomeNameEl.textContent = prenom || nom || "ami(e)";
    }
    // Nom complet dans la carte de résumé
    const welcomeFullNameEl = document.getElementById("welcomeFullName");
    if(welcomeFullNameEl) {
        welcomeFullNameEl.textContent = prenom + " " + nom;
    }
    // Email
    const welcomeEmailEl = document.getElementById("welcomeEmail");
    if(welcomeEmailEl) {
        welcomeEmailEl.textContent = utilisateur.email || "";
    }
    // Avatar
    const avatarEl = document.getElementById("welcomeAvatar");
    if(avatarEl) {
        afficherAvatar(avatarEl, utilisateur, 72);
    }
});
