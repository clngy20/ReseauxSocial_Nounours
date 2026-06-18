# ReseauxSocial_Nounours
Réseau social Nounours - Projet HTML/CSS/JS

## Présentation
**Nounours** est un réseau social minimaliste et bienveillant, conçut pour offrir une expérience utilisateur simple et intuitive.

Il permet de : 
- Créer un compte et s'authentifier
- Publier des messages avec textes et des images
- Interagir avec les posts d'autres utilisateurs (likes, suppression)
- Rechercher des posts ou des utilisateurs grâce au choix déroulant
- S'abonner à d'auters comptes
- Modifier ses informations de profil

## Structure du projet
/Nounours
├── 📁 img/
├── 📁 JS/
│   ├── storage.js 	
│   ├── utils.js		
│   ├── auth.js
│   ├── welcome.js
│   ├── feed.js
│   ├── profil.js
│   ├── abonnement.js
│   └── edit-profil.js
├── 📁 CSS/
│   ├── base.css 	#Variables CSS, resets, animations
│   ├── layout.css 	#Structure (navbar, sidebar, conteneurs)
│   ├── composant.css 	#Composants (boutons, cartes, formulaires)
│   ├── pages.css 	#Styles spécifiques par page
│   ├── main.css 	#Fichier principal
├── 📁 HTML/      
│   ├── main.html
│   ├── login.html
│   ├── register.html
│   ├── welcome.html
│   ├── feed.html
│   ├── profil.html
│   ├── edit-profil
│   └── abonnement.html


## Fonctionnalités

## Authentification
  - Inscription : création d'un nouveau compte via un formulaire
  - Connexion : accès au compte déjà existant
  - Deconnexion : disponible dans la page principale
 
## Page principale
  - Fil d'actualité avec les différents posts
  - Recherche par contenu de post ou d'utilisateur
  - Création de post : texte + image
 
## Interaction avec les posts
  - Liker un post (coeur blanc : non liké, coeur rouge : liké)
  - Supprimer ses propres posts avec la corbeille
 
## Profil utilisateur (currentUser)
  - Accès en cliquant à gauche sur profil ou en haut à droite sur l'avatar et votre nom
  - Consultation des posts récents et des informations
  - Consultation du tableau de bord (like, commentaire, post, abonné)
 
## Pour lancer le site
Ouvrir main.html : attention nécessite un serveur local comme Live Server sur VS Code.
