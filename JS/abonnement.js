// abonnement.js relié à abonnement.html
// Gestion des abonnements et desabonnements

document.addEventListener("DOMContentLoaded", () => {
    verifierConnexion();
    afficherInfosnav();
    afficherAbonnements();
    afficherTousUtilisateurs();
});

// -- Navigation --
// Affiche le nom et l'avatar dans la navbar
function afficherInfosnav() {
    const moi = getCurrentUser();
    if (!moi) {
        window.location.href = "login.html";
        return;
    }
    const nomEl = document.getElementById("currentUserName");
    const avatarEl = document.getElementById("currentUserAvatar");

    if(nomEl) {
        nomEl.textContent = moi.firstname + " " + moi.name;
    }

    if(avatarEl) {
        afficherAvatar(avatarEl, moi, 32);
    }
}

// -- Mes abonnements --
// Affiche uniquement les utilisateurs que je suis
function afficherAbonnements() {
    const moi = getCurrentUser();
    if(!moi) {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("listeAbonnements");
    if(!container) {
        console.error("Element 'listeAbonnements' non trouvé.");
        return;
    }

    const abonnements = moi.abonnements || []; // Tableau des emails suivis
    if (abonnements.length === 0) {
        container.innerHTML = `<p class="activity-empty">Tu ne suis personne pour l'instant...</p>`;
        return;
    }

    // Filtre les utilisateurs dont l'email est dans ma liste d'abonnements
    const tousUtilisateurs = getUsers();
    const suivi = tousUtilisateurs.filter(u => abonnements.includes(u.email));

    container.innerHTML = suivi.map(u => carteUtilisateur(u, true)).join("");
}

// -- Tous les utilisateurs --
// Affiche tous les membres sauf moi
function afficherTousUtilisateurs() {
    const moi = getCurrentUser();
    if(!moi) {
        window.location.href = "login.html";
        return;
    }
    const container = document.getElementById("listeTousUtilisateurs");
    if(!container) {
        console.error("Element 'listeTousUtilisateurs' non trouvé.");
        return;
    }

    const utilisateurs = getUsers().filter(u => u.email !== moi.email);
    if(utilisateurs.length === 0){
        container.innerHTML = `<p class="activity-empty">Aucun autre membre pour l'instant...</p>`;
        return;
    }

    const abonnements = moi.abonnements || [];
    // Pour chaque utilisateur, on sait si je le suis ou non
    container.innerHTML = utilisateurs.map
        (u => carteUtilisateur(u, abonnements.includes(u.email)))
        .join("");
}

// -- Carte utilisateur --
// Génère le HTML d'une carte membre
function carteUtilisateur(utilisateur, estAbonne) {
    const initiales = (utilisateur.firstname[0] + utilisateur.name[0]).toUpperCase();

    // Avatar : photo ou initiales
    const avatarHTML = utilisateur.avatar ? 
    `<img src="${utilisateur.avatar}"
    style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-light);">` :
    `<div style="width: 48px;height: 48px;border-radius: 50%;background: var(--primary);color: #fff;display: flex;align-items: center;justify-content: center;font-weight: 700;font-size: 1rem;border: 2px solid var(--primary-light);"> ${initiales}</div>`;

    return `
    <div class="subscription-card">
        <div class="subscription-card-left">
            ${avatarHTML}
            <div class="subscription-card-info">
                <span class="subscription-card-name">
                ${utilisateur.firstname} ${utilisateur.name} 
                </span>
                <span class="subscription-card-email">
                ${utilisateur.email}
                </span>
            </div>
        </div>
        <button 
        class="subscription-btn ${estAbonne ? "subscription-btn-unsubscribe" : "subscription-btn-subscribe"}"
            onclick ="toggleSubscription('${utilisateur.email}');
            afficherAbonnements(); afficherTousUtilisateurs();">
            ${estAbonne ? "Se desabonner" : "S'abonner"}
        </button>
    </div>`;
}
