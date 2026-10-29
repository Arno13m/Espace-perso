/**
 * Réception des demandes de devis de la landing page → Google Doc.
 *
 * Installation : voir README.md (section « Envoyer les demandes dans un Google Doc »).
 *  1. Collez ce code dans un projet Google Apps Script.
 *  2. Renseignez DOC_ID (et NOTIFY_EMAIL si vous voulez une alerte par email).
 *  3. Déployez en « Application Web » (Exécuter en tant que : moi ; Accès : tout le monde).
 *  4. Copiez l'URL /exec dans GOOGLE_SCRIPT_URL, dans index.html.
 */

// ID du Google Doc : la partie entre /d/ et /edit dans son URL.
const DOC_ID = 'COLLEZ_ICI_L_ID_DU_GOOGLE_DOC';

// Optionnel : adresse qui reçoit un email à chaque nouvelle demande ('' pour désactiver).
const NOTIFY_EMAIL = '';

const FIELDS = [
  ['envoye_le', 'Date'],
  ['prenom', 'Prénom'],
  ['nom', 'Nom'],
  ['email', 'Email'],
  ['telephone', 'Téléphone'],
  ['activite', 'Activité / métier'],
  ['ca', 'CA mensuel actuel'],
  ['defi', 'Principal défi'],
  ['rgpd', 'Consentement RGPD'],
  ['page', 'Page'],
];

const MAX_LENGTH = 2000;

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Champ piège anti-spam rempli, ou demande incomplète : on ignore.
  if (p.website || !p.email || !p.prenom) {
    return json_({ ok: false });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const clean = {};
    FIELDS.forEach(([key]) => {
      clean[key] = String(p[key] || '').trim().slice(0, MAX_LENGTH);
    });
    if (!clean.envoye_le) {
      clean.envoye_le = Utilities.formatDate(new Date(), 'Europe/Paris', 'dd/MM/yyyy HH:mm');
    }

    const doc = DocumentApp.openById(DOC_ID);
    const body = doc.getBody();

    body
      .appendParagraph(`Demande de devis — ${clean.prenom} ${clean.nom}`)
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);

    const rows = FIELDS.map(([key, label]) => [label, clean[key] || '—']);
    const table = body.appendTable(rows);
    table.setBorderColor('#E1E7EF');
    for (let i = 0; i < table.getNumRows(); i++) {
      table.getCell(i, 0).setBackgroundColor('#F4F7FB').editAsText().setBold(true);
      table.getCell(i, 0).setWidth(150);
    }

    body.appendHorizontalRule();
    doc.saveAndClose();

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: clean.email,
        subject: `Nouvelle demande de devis : ${clean.prenom} ${clean.nom}`,
        body: rows.map(([label, value]) => `${label} : ${value}`).join('\n') +
          `\n\nGoogle Doc : ${doc.getUrl()}`,
      });
    }

    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Permet de vérifier dans le navigateur que le déploiement répond.
function doGet() {
  return json_({ ok: true, message: 'Le script de réception des devis est actif.' });
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// À lancer une fois depuis l'éditeur pour autoriser le script et tester l'écriture.
function testerEcriture() {
  doPost({
    parameter: {
      prenom: 'Test',
      nom: 'Installation',
      email: 'test@exemple.fr',
      activite: 'Test du formulaire',
      ca: 'Je préfère ne pas répondre',
      defi: 'Vérifier que les demandes arrivent bien dans le Google Doc.',
      rgpd: 'Oui',
      page: 'éditeur Apps Script',
    },
  });
}
