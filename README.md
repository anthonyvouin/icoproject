

## Introduction
Ce projet est un **proof of concept (POC)** dans le cadre d’un projet RNCP. Il vise à digitaliser un jeu de rôle en créant une application qui gère automatiquement les différentes étapes du jeu et facilite l’expérience des joueurs. Ce POC présente une implémentation initiale et n'est pas encore destiné à une production finale.

---

## Mapping Nom et Prénom des collaborateurs :

| Nom           | Prénom     |
|---------------|------------|
| VOUIN         | Anthony    |
| TCHOUNGA      | Choeurtis  |
| BERKI         | KHALIDA    |
| URITY         | Loanie     |
---

## Procédure de Lancement


### Récuprer le projet
Pour récuperer le projet  :
```bash
git clone
```

### Installer les dépendances
Avant de lancer le projet, assurez-vous d’installer toutes les dépendances nécessaires avec la commande :
```bash
npm install
```

### Lancer le serveur en mode développement
Pour démarrer le serveur en mode développement, exécutez la commande suivante :
```bash
npm run dev
```

### Générer et appliquer les migrations Prisma
Pour générer et appliquer les migrations Prisma, utilisez la commande suivante :
```bash
npx prisma migrate dev
```

### Créer une nouvelle migration Prisma
Si vous devez créer une nouvelle migration, utilisez cette commande en remplaçant `nom_de_la_migration` par un nom explicite :
```bash
npx prisma migrate dev --name nom_de_la_migration
```

### Construire le projet pour la production
Pour préparer l'application à être déployée en production, utilisez la commande suivante :
```bash
npm run build
```

### Lancer le serveur en mode production
Une fois le projet construit, vous pouvez démarrer le serveur en mode production avec la commande :
```bash
npm start
```

### Alimenter la base de donnée avec le fichier seed
Si vous devez alimenter la base de données, utilisez cette commande :
```bash
npx prisma db seed
```


