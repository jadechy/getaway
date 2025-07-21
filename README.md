# 🎉 Getaway — Créateur de sorties personnalisées

> Application Nuxt 3 permettant aux utilisateurs de générer des journées ou demi-journées personnalisées en fonction de leurs préférences (type d'activité, budget, nombre de personnes, etc.).

---

## 🚀 Stack utilisée

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/) — Store
- [PrimeVue](https://www.primevue.org/) — UI kit
- [Vuefire](https://vuefire.vuejs.org/) — Liaison Nuxt ↔️ Firebase
- [Firebase Auth & Firestore](https://firebase.google.com/)
- TypeScript

---

## 📦 Installation

```bash
# Clone du projet
git clone https://github.com/jadechy/getaway.git
cd getaway

# Installation des dépendances
npm install

# Lancement du serveur de dev
npm run dev
```

---

## 🔐 Configuration Firebase

Crée un fichier `.env` à la racine avec tes identifiants Firebase :

```
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
```

> ⚠️ Assure-toi d’avoir activé **Firebase Authentication** (Email/Password) et **Firestore Database**.

---

## 🗃 Structure principale

```
components/
composables/
data/
layout/
middleware/
pages/
plugin/
stores/
types/
utils/

```

---

## ✅ Fonctionnalités

- Authentification utilisateur (via Firebase)
- Création guidée d’une sortie via formulaire multi-étapes
- Types d’activités : famille, amis, couple, aléatoire
- Personnalisation par budget, accessibilité, nombre de participants
- Stockage des données dans Firestore
- Interface responsive & accessible
- Voir les sorties enregistrés

---

## 📦 Scripts utiles

```bash
npm run dev       # Démarrage local
npm run build     # Build pour production
npm run start     # Pour lancer la production
npm run lint      # Linter ESLint
npm run lint:fix  # Correction automatique des erreurs ESLint
```

---

## 🛠 Développement

Les étapes du formulaire sont dynamiques. Tu peux en ajouter facilement dans le tableau `steps` :

```ts
const steps = [
  { label: "Type de sortie", component: FormChooseType },
  { label: "Infos", component: FormIntro },
  ...
];
```

---

## 🔒 Sécurité

> Le projet est configuré avec ESLint (Vue/TypeScript) et empêche les usages dangereux comme `v-html` sans purification.

---

## 👤 Auteur

- Cecile LECERF & Jade Chiyen
