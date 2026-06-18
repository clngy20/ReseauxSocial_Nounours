// feed.js -> fedd.html

document.addEventListener("DOMContentLoaded", () => {
    verifierConnexion();    // Vérifie que l'utilisateur est connecté
    afficherInfosUtilisateur();  // Affiche nom + avatar
    renderPosts();  // Affiche les posts

    //Recherche dynamique dans les posts
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", rechercherPosts);
    }

    // Affichage image dans le composer
    const imageInput = document.getElementById("postImage");
    if (imageInput) {
        imageInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) {
                return;
            }
            if(!file.type.startsWith("image/")) {
                alert("Veuillez choisir une image.");
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                const preview = document.getElementById("postImagePreview");
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        });
    }
});

function clearPostImagePreview() {
  const preview = document.getElementById("postImagePreview");
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
}

// -- Affichage de l'utilisateur --
// Affiche le nom et l'avatar de l'utilisateur connecté
function afficherInfosUtilisateur() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }  

    // Nom dans le navbar
    const nameEl = document.getElementById("currentUserName");
    if (nameEl) {
        nameEl.textContent = user.firstname + " " + user.name;
    }

    // Avatars : navbar, composer, sidebar
    afficherAvatar(document.getElementById("currentUserAvatar"), user, 32);
    afficherAvatar(document.getElementById("composerAvatar"), user, 42);
    afficherAvatar(document.getElementById("sidebarAvatar"), user, 70);
}

// -- POSTS --
// Ajouter un post
function addPost() {
    const user = getCurrentUser();
    if (!user) {
        alert("Vous devez être connecté pour poster.");
        return;
    }

    const content    = document.getElementById("postContent").value.trim();
    const errorEl    = document.getElementById("postError");
    const imageInput = document.getElementById("postImage");

    // Réinitialisation du message d'erreur
    if (errorEl) {
        errorEl.textContent = "";
    }
    // Le contenu ne peut pas être vide
    if(content === ""){
        if (errorEl) {
            errorEl.textContent = "Le message ne peut pas être vide.";
        }
    }

    // Publication avec ou sans image du post
    function publish(imageData) {
        let posts = getPosts();
        let post = {
            id      : genererIdUnique(),
            author  : user.firstname + " " + user.name,
            email   : user.email,
            avatar  : user.avatar || "",
            content : content,
            image   : imageData || "",
            date    : Date.now(),
            likes   : 0,
            likedBy : []
        };
        posts.unshift(post); //Le post le plus récent en premier
        savePosts(posts);

        //Réinitialisation du formulaire
        const postContent = document.getElementById("postContent");
        if(postContent) {
            postContent.value = "";
        }
        if (imageInput) {
            imageInput.value = "";
        }
        clearPostImagePreview();
        renderPosts();
        afficherToast("Post publié ! 🐾", "success");
    }

    //Si une image est jointe, on la lit avant de publier
    if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        if(!file.type.startsWith("image/")) {
            if (errorEl) {
                errorEl.textContent = "Veuillez choisir une image.";
            }
            return;
        }
        const reader = new FileReader();
        reader.onload = e => publish(e.target.result);
        reader.readAsDataURL(file);
    } else {
        publish("");
    }
}

// Supprimer un post (seulement pour l'auteur du post)
function deletePost(id) {
    if (!confirm("Supprimer ce post ?")) {
        return;
    }
    let posts = getPosts().filter(p => String(p.id) !== String(id));
    savePosts(posts);
    renderPosts();
    afficherToast("Post supprimé", "success");
}

// Like / unlike un post
function likePost(id) {
    const user  = getCurrentUser();
    if(!user) {
        alert("Vous devez être connecté pour aimer un post.");
        return;
    }

    let posts   = getPosts();
    let post    = posts.find(p => String(p.id) === String(id));
    if (!post) {
        return;
    }

    if (post.likedBy.includes(user.email)) {
        // Enlève le like
        post.likedBy = post.likedBy.filter(e => e !== user.email);
        post.likes   = Math.max(0, post.likes - 1);
    } else {
        // Ajoute le like
        post.likedBy.push(user.email);
        post.likes++;
    }
    savePosts(posts);
    renderPosts();
}

// -- Affichage des posts
// Affiche tous les posts (ou une liste filtrée)
function renderPosts(posts = getPosts()) {
    const container = document.getElementById("posts");
    const user      = getCurrentUser();

    if(!container) {
        console.error("Element 'posts' non trouvé.");
        return;
    }

    // Message si aucun post
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="feed-empty">
                <span class="feed-empty-bear">🐻</span>
                <p>Aucun post pour l'instant…<br>Sois le premier à partager quelque chose !</p>
            </div>`;
        return;
    }

    //Abonnement en priorité
    if (user && user.abonnements && user.abonnements.length > 0) {
        const abonnements = user.abonnements;
        const postsAbonnes = posts.filter(post => abonnements.includes(post.email));
        const postsAutres = posts.filter(post => !abonnements.includes(post.email));

        // Tri par date (plus récent en premier)
        postsAbonnes.sort((a, b) => b.date - a.date);
        postsAutres.sort((a, b) => b.date - a.date);

        // Concaténation: abonnés d'abord
        posts = [...postsAbonnes, ...postsAutres];
    } else {
        // Pas d'abonnements: tri simple par date
        posts.sort((a, b) => b.date - a.date);
    }

    // Génère le HTML de chaque post
    container.innerHTML = posts.map(post => createPostHTML(post, user)).join("");
}

// Génère le HTML de chaque post
function createPostHTML(post, currentUser) {
    const isOwner  = currentUser && currentUser.email === post.email;
    const hasLiked = currentUser && post.likedBy.includes(currentUser.email);
    const initials = post.author.split(" ").map(w => w[0]).join("").toUpperCase();

    // Avatar : photo ou initiales
    const avatarHTML = post.avatar
        ? `<img src="${post.avatar}" class="post-avatar" alt="avatar">`
        : `<div class="post-avatar-placeholder">${initials}</div>`;

    // Image du post s'il y en a
    const imageHTML = post.image
        ? `<div class="post-img-wrap"><img src="${post.image}" class="post-img" alt="image du post"></div>`
        : "";

    // Bouton abonnement (masqué sur ses propres posts)
    const abonnements = currentUser ? (currentUser.abonnements || []) : [];
    const estAbonne   = abonnements.includes(post.email);
    const abonnBtn = !isOwner ?
    `<button
        class="subscription-btn ${estAbonne ? "subscription-btn-unsubscribe" : "subscription-btn-subscribe"}"
        onclick="toggleSubscription('${post.email}'); renderPosts();">
        ${estAbonne ? "Abonné" : "S'abonner 🐾"}
    </button>` : "";

    // Bouton suppression (visible uniquement pour l'auteur)
    const deleteBtn = isOwner
    ? `<button class="post-btn post-btn-delete" onclick="deletePost('${post.id}')" title="Supprimer">🗑️</button>`
    : "";

    return `
        <div class="post-card">
            <div class="post-header">
                ${avatarHTML}
                <div class="post-meta">
                    <span class="post-author">${post.author}</span>
                    <span class="post-date">📅 ${new Date(Number(post.date)).toLocaleDateString('fr-FR')}</span>
                </div>
                ${deleteBtn}
            </div>
            <p class="post-content">${post.content}</p>
            ${imageHTML}
            <div class="post-footer">
                <button
                    class="like-btn post-btn-like ${hasLiked ? "liked" : ""}"
                    onclick="likePost('${post.id}')">
                    ${hasLiked ? "🩷" : "🤍"} ${post.likes} J'adore
                </button>
                ${abonnBtn}
            </div>
        </div>
    `;

}

// -- Recherche --
function rechercherPosts() {
    const recherche= document.getElementById("search").value.toLowerCase();
    const posts = getPosts().filter(post =>
        post.content.toLowerCase().includes(recherche) ||
        post.author.toLowerCase().includes(recherche)
    );
    renderPosts(posts);
}

