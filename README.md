# Le Petit Marocain — Site web

Site vitrine du restaurant marocain fictif **Le Petit Marocain**, situé à Creil.

## 🗂️ Contenu du projet

- `index.html` — la totalité du site (structure HTML, styles CSS et interactions JavaScript sont dans ce seul fichier, pour rester simple à comprendre en tant que débutant).

C'est un site **statique** : pas de base de données, pas de serveur à gérer. Il fonctionne en ouvrant simplement le fichier, ou en le déployant sur un hébergeur comme Vercel.

## ✏️ Informations à personnaliser avant publication

Ouvrez `index.html` et remplacez ces valeurs fictives par les vraies coordonnées du restaurant :

| Élément | Où le trouver dans le fichier | Exemple actuel |
|---|---|---|
| Numéro de téléphone | recherchez `tel:+33344123456` (plusieurs endroits) | +33 3 44 12 34 56 |
| Numéro WhatsApp | recherchez `wa.me/33612345678` | +33 6 12 34 56 78 |
| Adresse | recherchez `12 Rue de la République` | 12 Rue de la République, 60100 Creil |
| Horaires | section `<section id="horaires">` | à ajuster selon les vrais horaires |
| Plats/prix | section `<section id="menu">` | voir ci-dessous |

### Ajouter ou modifier un plat

Chaque plat est un petit bloc de ce type, à copier/coller/modifier dans la bonne catégorie :

```html
<div class="menu-item-wrap">
  <div class="menu-item">
    <span class="name">Nom du plat</span>
    <span class="leader"></span>
    <span class="price">12 €</span>
  </div>
  <span class="desc">Courte description du plat</span>
</div>
```

**Note :** j'ai ajouté un dessert d'exemple (« Cornes de gazelle », 5 €) pour que la catégorie « Desserts » ne soit pas vide, puisqu'aucun dessert n'était fourni dans la demande initiale. Remplacez-le ou ajoutez vos vrais desserts.

## 🚀 Publier le site (GitHub + Vercel)

### Étape 1 — Créer le dépôt GitHub

1. Créez un compte sur [github.com](https://github.com) si ce n'est pas déjà fait.
2. Créez un nouveau dépôt (bouton **New repository**), par exemple nommé `le-petit-marocain`.
3. Sur votre ordinateur, dans le dossier du projet, exécutez :

```bash
git init
git add .
git commit -m "Première version du site"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/le-petit-marocain.git
git push -u origin main
```

### Étape 2 — Déployer sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com) (vous pouvez vous connecter directement avec votre compte GitHub).
2. Cliquez sur **Add New → Project**.
3. Sélectionnez votre dépôt `le-petit-marocain`.
4. Vercel détecte automatiquement qu'il s'agit d'un site statique — aucune configuration n'est nécessaire. Cliquez sur **Deploy**.
5. Après quelques secondes, Vercel vous donne une adresse du type `le-petit-marocain.vercel.app` : votre site est en ligne !

Chaque fois que vous ferez un `git push` sur GitHub, Vercel republiera automatiquement la nouvelle version.

## 🧪 Tester en local avant de publier

Le plus simple : double-cliquez sur `index.html`, il s'ouvre dans votre navigateur.

Pour un test plus proche des conditions réelles (recommandé si vous ajoutez d'autres fichiers plus tard), avec Python installé :

```bash
python3 -m http.server 8000
```

puis ouvrez `http://localhost:8000` dans votre navigateur.
