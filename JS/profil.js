//  profil.js -> profil.html


document.addEventListener("DOMContentLoaded", () => {
    verifierConnexion();

    const user  = getCurrentUser();
    if(!user) {
        alert("Utilisateur non trouvé.");
        window.location.href = "login.html";
        return;
    }

    const posts = getPosts();
    // Posts publiés par l'utilisateur connecté
    const userPosts = posts.filter(p => p.email === user.email);

    // --- Profil ---
    const profileFullNameEl = document.getElementById("profileFullName");
    if(profileFullNameEl) {
        profileFullNameEl.textContent = user.firstname + " " + user.name;
    }

    const profileEmailEl = document.getElementById("profileEmail");
    if(profileEmailEl) {
        profileEmailEl.textContent = user.email;
    }

    const profileAvatarEl = document.getElementById("profileAvatar");
    if(profileAvatarEl) {
        afficherAvatar(profileAvatarEl, user, 100);
    }
    // --- Stats ---
    const statPostsEl = document.getElementById("statPosts");
    if(statPostsEl) {
        statPostsEl.textContent = userPosts.length;
    }

    const statLikesEl = document.getElementById("statLikes");
    if(statLikesEl) {
        statLikesEl.textContent = calculerLikesTotaux(user.email);
    }

    const statFollowersEl = document.getElementById("statFollowers");
    if(statFollowersEl) {
        statFollowersEl.textContent = getFollowersCount(user.email);
    }

    // --- Activité récente ---
    const activityList = document.getElementById("recentActivity");
    if(activityList) {
        if(userPosts.length === 0) {
            activityList.innerHTML = `<p class="activity-empty">Aucune activité récente...</p>`;
        } else {
            activityList.innerHTML = userPosts.slice(0, 3).map(p => `
                <div class="activity-item">
                    <div class="activity-icon">🐾</div>
                    <div class="activity-content">
                        <p class="activity-text">${p.content}</p>
                        <p class="activity-date">${new Date(Number(p.date)).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                </div>
            `).join("");
        }
    }
});
