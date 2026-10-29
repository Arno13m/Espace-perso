# Landing page « Plus de clients pour indépendants »

Page de conversion en un seul fichier (`index.html`, HTML/CSS/JS sans dépendance), dont l'unique objectif est la demande de devis. Tous les CTA pointent vers `#devis`.

| Fichier | Rôle |
| --- | --- |
| `index.html` | La landing page |
| `google-apps-script.gs` | Script qui reçoit le formulaire et l'écrit dans un Google Doc |
| `mentions-legales.html`, `confidentialite.html` | Modèles de pages légales à compléter |

## Envoyer les demandes dans un Google Doc

Le formulaire envoie chaque demande à une petite application Google Apps Script, qui l'ajoute à la fin de votre Google Doc (un titre + un tableau par demande). Aucun serveur ni abonnement n'est nécessaire.

1. **Créez le Google Doc** qui recevra les demandes (ex. « Demandes de devis »). Copiez son ID : la partie de l'URL entre `/d/` et `/edit`.
2. **Créez le script** : sur [script.google.com](https://script.google.com), cliquez sur *Nouveau projet*, puis collez tout le contenu de `google-apps-script.gs` à la place du code existant.
3. **Renseignez** `DOC_ID` avec l'ID copié. Facultatif : mettez votre adresse dans `NOTIFY_EMAIL` pour recevoir un email à chaque demande.
4. **Autorisez et testez** : choisissez la fonction `testerEcriture` dans la barre d'outils, cliquez sur *Exécuter* et acceptez les autorisations. Une demande « Test Installation » doit apparaître dans le Doc.
5. **Déployez** : *Déployer* → *Nouveau déploiement* → type *Application Web*.
   - Exécuter en tant que : **Moi**
   - Qui peut accéder : **Tout le monde**

   Copiez l'URL qui se termine par `/exec`.
6. **Branchez la page** : dans `index.html`, collez cette URL dans la constante en haut du script :

   ```js
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

Tant que cette URL est vide, le formulaire fonctionne en **mode démo** : la validation et le message de confirmation s'affichent, mais rien n'est envoyé (un bandeau jaune le signale).

> Si vous modifiez le script plus tard, publiez une nouvelle version via *Déployer* → *Gérer les déploiements* → *Modifier* → *Nouvelle version*. L'URL `/exec` reste alors la même.

## À personnaliser avant la mise en ligne

Cherchez les crochets `[` dans les fichiers : ce sont les emplacements à remplacer.

- `[Nom de la marque]` : header, footer, titre de la page, case RGPD.
- **Étapes de la méthode** (section `#methode`) : contenu et durées, à adapter à votre offre.
- **Témoignages** : les trois cartes marquées « À remplacer ». N'utilisez que de vrais témoignages, avec l'accord de vos clients, puis supprimez les badges `placeholder-tag`.
- **FAQ** : fourchette de prix et temps à consacrer.
- `contact@exemple.fr` et `[Ville, France]` : footer, message d'erreur du formulaire et pages légales.
- **Pages légales** : complétez `mentions-legales.html` et `confidentialite.html` (obligatoires en France dès que vous collectez des données).

## Mise en ligne

Le dossier est statique : déposez-le tel quel sur n'importe quel hébergeur (GitHub Pages, Netlify, OVH, o2switch…).
