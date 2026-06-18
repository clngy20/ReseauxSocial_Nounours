// FONCTIONS UTILITAIRES

function verifierConnexion(redirectionVers = "login.html") {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = redirectionVers;
    }
}

function seDeconnecter(redirectionVers = "main.html") {
    logout();
    window.location.href = redirectionVers;
}

function afficherAvatar(element, user, taile = 40) {
    if(!element || !user) return;

    element.style.width = taile + "px";
    element.style.height = taile + "px";
    element.style.borderRadius = "50%";
    element.style.overflow = "hidden";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    element.style.fontSize = (taile * 0.38) + "px";
    element.style.fontWeight = "700";

    if(user.avatar) {
        element.style.background = "transparent";
        element.innerHTML = `<img src="${user.avatar}" alt="Avatar" 
                            style="width: 100%; 
                            height: 100%; 
                            object-fit: cover;
                            alt = "Avatar de ${user.firstname} ${user.name}">`;
    } else {
        element.style.background = "var(--primary)";
        element.style.color = "#fff";
        element.style.border = "2px solid var(--primary-light)";
        const initials = ((user.firstname[0] || "") + (user.name[0] || "")).toUpperCase() || "🐻";
        element.textContent = initials;
    }
}

function toggleSubscription(targetEmail) {
    const me = getCurrentUser();
    if (!me) {
        alert("Vous devez être connecté pour vous abonner ou vous désabonner.");
        return;
    }

    let abonnements = me.abonnements || [];

    if(abonnements.includes(targetEmail)) {
        // Se désabonner
        abonnements = abonnements.filter(email => email !== targetEmail);
    } else {
        // S'abonner
        abonnements.push(targetEmail);
    }

    const updatedUser = { ...me, abonnements };
    const usersList = getUsers().map(user => user.email === me.email ? updatedUser : user);
    sauvergarderUtilisateurs(usersList);
    setCurrentUser(updatedUser);
}

function getFollowersCount(email) {
    if (!email) {
        return 0;
    }
    const users = getUsers();
    return users.filter(user => user.abonnements && user.abonnements.includes(email)).length;
}

function calculerLikesTotaux(emailUtilisateur) {
    if (!emailUtilisateur) {
        return 0;
    }
    const posts = getPosts();
    return posts.filter(post => post.email === emailUtilisateur)
                .reduce((totalLikes, post) => totalLikes + (post.likes || 0), 0);
}

function afficherToast(message, type="success"){
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    toast.textContent = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "50px";
    toast.style.fontWeight = "700";
    toast.style.fontSize = "0.9rem";
    toast.style.zIndex = "1000";
    toast.style.animation = 'fadeInOut 0.3s ease both';
    toast.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";

    if(type === "success") {
        toast.style.backgroundColor = "var(--success)";
        toast.style.color = "#fff";
    } else if(type === "error") {
        toast.style.backgroundColor = "var(--danger)";
        toast.style.color = "#fff";
    } else {
        toast.style.backgroundColor = "var(--primary)";
        toast.style.color = "#fff";
    }

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease both';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function clearImagePreview(previewId) {
    const preview = document.getElementById(previewId);
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
}