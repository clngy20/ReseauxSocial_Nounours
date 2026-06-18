// auth.js

let avatarBase64 = ""; // Variable pour stocker l'avatar
document.addEventListener("DOMContentLoaded", () => {
    // -- AVATAR --
    const avatarInput = document.getElementById("regAvatar");
    const avatarPreview = document.getElementById("regAvatarPreview");

    if (avatarInput) {
        avatarInput.addEventListener("change", function() {
            const file = this.files[0];
            if (!file) return;
            if (!file.type.startsWith("image/")) {
                alert("Veuillez choisir une image.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                if (avatarPreview) {
                    avatarPreview.src = e.target.result;
                }
                avatarBase64 = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // -- INSCRIPTION --
    window.register = function() {
        let users = getUsers();
        let errorEl = document.getElementById("registerError");

        let name = document.getElementById("regName").value.trim();
        let firstname = document.getElementById("regFirstname").value.trim();
        let email = document.getElementById("regEmail").value.trim();
        let password = document.getElementById("regPassword").value;
        let confirm = document.getElementById("regConfirm").value;

        function showError(msg) {
            if (errorEl) errorEl.textContent = msg;
            else alert(msg);
        }

        if (name === "") {
            return showError("Le nom est obligatoire.");
        }
        if (firstname === "") {
            return showError("Le prénom est obligatoire.");
        }
        if (email === "") {
            return showError("L'email est obligatoire.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showError("Email invalide.");
        }
        if (password === "") {
            return showError("Le mot de passe est obligatoire.");
        }
        if (password.length < 6) {
            return showError("Le mot de passe doit contenir au moins 6 caractères.");
        }
        if (password !== confirm) {
            return showError("Les mots de passe ne correspondent pas.");
        }
        if (users.find(u => u.email === email)) {
            return showError("Email déjà utilisé.");
        }

        sauvegarderNouvelUtilisateur(name, firstname, email, password, avatarBase64, users);
    };

    // -- CONNEXION --
    window.login = function() {
        let users = getUsers();
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        let errorEl = document.getElementById("loginError");

        function showError(msg) {
            if (errorEl) errorEl.textContent = msg;
            else alert(msg);
        }

        if (email === "" || password === "") {
            return showError("Veuillez remplir tous les champs.");
        }
        let user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return showError("Identifiants incorrects.");
        }

        setCurrentUser(user);
        window.location.href = "feed.html";
    };
});

function sauvegarderNouvelUtilisateur(nom, prenom, email, password, avatar, users) {
    let user = {
        id: genererIdUnique(),
        name: nom,
        firstname: prenom,
        email: email,
        password: password,
        avatar: avatar,
        abonnements: []
    };
    users.push(user);
    sauvergarderUtilisateurs(users);
    setCurrentUser(user);
    window.location.href = "welcome.html";
}