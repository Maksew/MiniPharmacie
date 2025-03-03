# Gestion de Pharmacie

Application web front-end développée dans le cadre du mini-projet ISIS FIE3 - Technologies du Web.

## 📋 Description

Cette application permet de gérer le stock de médicaments d'une pharmacie en utilisant une API REST. Elle offre une interface intuitive et moderne respectant les codes visuels des pharmacies (couleurs vertes, croix de pharmacie, etc.).

## ✨ Fonctionnalités

- Affichage des médicaments disponibles en stock
- Recherche de médicaments par nom ou forme pharmaceutique
- Ajout d'un nouveau médicament avec photo
- Modification des informations d'un médicament existant
- Ajout/Suppression d'unités dans le stock (gestion des quantités)
- Suppression complète d'un médicament
- Interface responsive et animations UI

## 🛠️ Technologies utilisées

- Vue.js 3 (Composition API)
- Single File Components (SFC)
- Vuetify 3 - Framework UI
- Vite - Build tool
- JavaScript ES6+
- Sass/SCSS pour les styles personnalisés
- API REST (https://apipharmacie.pecatte.fr)

## 🚀 Installation et démarrage

1. Cloner le dépôt
```bash
   git clone <url-du-depot>
   cd minipharmacie
```

2. Installer les dépendances
```bash
   npm install
```

3. Lancer le serveur de développement
```bash
   npm run dev
```

## 📁 Structure du projet

- `/src/components/` - Composants Vue
    - `PharmacyView.vue` - Vue principale des médicaments
    - `AddMedicamentForm.vue` - Formulaire d'ajout de médicament
    - `EditMedicamentForm.vue` - Formulaire de modification
- `/src/composables/` - Logique métier réutilisable
    - `usePharmacy.js` - Interactions avec l'API
- `/src/assets/` - Ressources statiques (CSS, images)
- `/src/App.vue` - Composant racine

## 💡 Utilisation

L'application est intuitive et permet de :
- Visualiser tous les médicaments disponibles dans un tableau
- Filtrer les médicaments avec la barre de recherche
- Ajouter un médicament via le bouton "Ajouter un médicament"
- Modifier un médicament en cliquant sur l'icône de crayon
- Ajouter/Retirer des unités avec les boutons +/-
- Supprimer un médicament avec l'icône de corbeille

## ⚠️ Notes importantes

- Cette application est uniquement front-end et nécessite l'API fournie pour fonctionner

## 📝 Crédits

Développé pour le mini-projet Technologies du Web - API & AJAX, ISIS FIE3 2024-2025.