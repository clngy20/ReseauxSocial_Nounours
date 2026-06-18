// edit-profil.js -> edit-profil.html
// Modification du profil de l'utilisateur connecté

// Stocke le nouvel avatar si l'utilisateur en choisit un
let nouvelAvatar = "";

document.addEventListener("DOMContentLoaded", () => {

    verifierConnexion();

    const utilisateur = getCurrentUser();
    if (!utilisateur) {
        alert("Utilisateur non trouvé.");
        window.location.href = "login.html";
        return;
    }
    // Remplissage du formulaire
    // Pré-rempli avec les données actuelles
    document.getElementById("editName").value      = utilisateur.name;
    document.getElementById("editFirstName").value = utilisateur.firstname;
    document.getElementById("editMail").value      = utilisateur.email;
    document.getElementById("editHeaderName").textContent = utilisateur.firstname + " " + utilisateur.name;


    afficherAvatar(document.getElementById("editAvatar"), utilisateur, 60);
    // Changement d'avatar
    document.getElementById("editAvatarInput").addEventListener("change", function () {
        const fichier = this.files[0];
        if (!fichier) {
            return;
        }

        if(!fichier.type.startsWith("image/")) {
            alert("Veuillez choisir une image.");
            return;
        }

        //Lecture conversion en base64
        const lecteur = new FileReader();
        lecteur.onload = e => {
            nouvelAvatar = e.target.result;
            // Aperçu de la nouvelle photo
            document.getElementById("editAvatar").innerHTML =
                `<img src="${nouvelAvatar}" 
                style="width:60px;
                height:60px;
                object-fit:cover;
                border-radius:50%;">`;
        };
        lecteur.readAsDataURL(fichier);
    });
});

// Sauvegarde le profil
function sauvegarderProfil() {
    const utilisateur = getCurrentUser();
    if(!utilisateur) {
        alert("Utilisateur non trouvé.");
        window.location.href = "login.html";
        return;
    }

    const erreurEl    = document.getElementById("editError");
    const succesEl    = document.getElementById("editSuccess");

    //Récupération des valeurs du formulaire
    const nom          = document.getElementById("editName").value.trim();
    const prenom       = document.getElementById("editFirstName").value.trim();
    const email        = document.getElementById("editMail").value.trim();
    const motDePasse   = document.getElementById("editPassword").value;
    const confirmation = document.getElementById("ConfirmPassword").value;

    //Reinitialisation des messages
    erreurEl.textContent = "";
    succesEl.textContent = "";

    // Vérifications
    if (!nom || !prenom) { 
        return erreurEl.textContent = "Nom et prénom obligatoires.";
    }

    if (!email) { 
        return erreurEl.textContent = "Email obligatoire.";
    }

    if (motDePasse && motDePasse.length < 6){
        return erreurEl.textContent = "Mot de passe trop court (6 caractères minimum).";
    }

    if (motDePasse !== confirmation) {
         return erreurEl.textContent = "Les mots de passe ne correspondent pas.";
    }

    // Nouvelle version de l'utilisateur
    const misAJour = {
        ...utilisateur,
        name      : nom,
        firstname : prenom,
        email     : email,
        password  : motDePasse || utilisateur.password, // Ne change pas si vide
        avatar    : nouvelAvatar || utilisateur.avatar // '''
    };

    // Mise à jour dans la liste + session
    const listeUtilisateurs = getUsers().map(u => u.email === utilisateur.email ? misAJour : u);
    sauvergarderUtilisateurs(listeUtilisateurs);
    setCurrentUser(misAJour);

    if(succesEl) {
        succesEl.textContent = "Profil mis à jour ! 🐾";
    }
    setTimeout(() => window.location.href = "profil.html", 1500);
}
