/**
 * LAM ÉVÉNEMENTIEL & EVENTS — Références automatiques des demandes
 *
 * À déployer comme application Web Google Apps Script.
 * Exécuter chaque soumission via POST (application/x-www-form-urlencoded).
 *
 * Les références sont séquentielles et protégées contre les doublons
 * par LockService : LAM-2026-000001, LAM-2026-000002, etc.
 */

const LAM_CONFIG = {
  adminEmail: 'infolamevenementiels@gmail.com',
  prefix: 'LAM',
  year: '2026',
  propertyKey: 'LAM_LAST_REFERENCE_NUMBER'
};

function doPost(e) {
  const data = (e && e.parameter) ? e.parameter : {};
  const customerEmail = findCustomerEmail_(data);

  if (!customerEmail) {
    return HtmlService.createHtmlOutput(
      '<p>Votre demande n’a pas pu être traitée : adresse e-mail manquante. Veuillez revenir au formulaire LAM.</p>'
    );
  }

  const reference = nextReference_();
  const subject = 'LAM ÉVÉNEMENTIEL & EVENTS | Référence : ' + reference;
  const customerName = findCustomerName_(data);
  const greeting = customerName ? 'Bonjour ' + customerName + ',' : 'Bonjour,';

  const body = [
    greeting,
    '',
    'Nous vous remercions d’avoir contacté LAM ÉVÉNEMENTIEL & EVENTS.',
    '',
    'Nous vous confirmons que votre demande a bien été reçue et enregistrée dans notre système.',
    '',
    'Votre numéro de référence : ' + reference,
    '',
    'Ce numéro est personnel et unique. Il permettra à notre équipe d’identifier votre dossier et d’assurer le suivi de votre demande.',
    '',
    'Notre équipe procédera à l’examen des informations transmises et vous contactera dans les meilleurs délais pour les prochaines étapes.',
    '',
    'Veuillez conserver votre numéro de référence pour toute communication ultérieure concernant votre demande.',
    '',
    'Nous vous remercions pour votre confiance et l’intérêt que vous portez à LAM ÉVÉNEMENTIEL & EVENTS.',
    '',
    'L’élégance au service de vos moments d’exception.',
    '',
    'Cordialement,',
    'L’équipe LAM ÉVÉNEMENTIEL & EVENTS',
    'infolamevenementiels@gmail.com',
    '+509 37 46 9553',
    '@lamevenementielevents'
  ].join('\n');

  const adminLines = Object.keys(data)
    .filter(function(key) { return key.charAt(0) !== '_'; })
    .map(function(key) { return key + ' : ' + data[key]; });

  MailApp.sendEmail({
    to: customerEmail,
    subject: subject,
    body: body,
    name: 'LAM ÉVÉNEMENTIEL & EVENTS',
    replyTo: LAM_CONFIG.adminEmail
  });

  MailApp.sendEmail({
    to: LAM_CONFIG.adminEmail,
    subject: 'NOUVELLE DEMANDE — ' + reference,
    body: [
      'Une nouvelle demande a été soumise sur le site LAM.',
      'Référence : ' + reference,
      'E-mail client : ' + customerEmail,
      '',
      adminLines.join('\n')
    ].join('\n'),
    replyTo: customerEmail,
    name: 'Système de suivi LAM'
  });

  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Demande reçue — LAM</title></head>' +
    '<body style="font-family:Arial,sans-serif;background:#f5f0e6;color:#25221f;padding:36px 18px;text-align:center">' +
    '<main style="max-width:560px;margin:8vh auto;background:#fff;padding:36px 24px;border-radius:12px">' +
    '<h1 style="font-size:22px">LAM ÉVÉNEMENTIEL &amp; EVENTS</h1>' +
    '<p>Votre demande a bien été transmise.</p><p>Votre numéro de référence :</p>' +
    '<p style="font-size:24px;font-weight:bold;letter-spacing:1px">' + reference + '</p>' +
    '<p>Un e-mail de confirmation vient de vous être envoyé. Veuillez conserver votre référence.</p>' +
    '<p>L’élégance au service de vos moments d’exception.</p>' +
    '</main></body></html>'
  );
}

function nextReference_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const last = Number(props.getProperty(LAM_CONFIG.propertyKey) || '0');
    const next = last + 1;
    props.setProperty(LAM_CONFIG.propertyKey, String(next));
    return LAM_CONFIG.prefix + '-' + LAM_CONFIG.year + '-' + String(next).padStart(6, '0');
  } finally {
    lock.releaseLock();
  }
}

function findCustomerEmail_(data) {
  const preferred = [
    'email', 'E-mail', 'Adresse e-mail', 'Adresse e-mail de contact',
    'E-mail de contact', 'E-mail du parent ou représentant légal',
    'E-mail du jeune'
  ];
  for (var i = 0; i < preferred.length; i++) {
    if (data[preferred[i]] && String(data[preferred[i]]).indexOf('@') > 0) {
      return String(data[preferred[i]]).trim();
    }
  }
  const keys = Object.keys(data);
  for (var j = 0; j < keys.length; j++) {
    if (/e.?mail|courriel/i.test(keys[j]) && String(data[keys[j]]).indexOf('@') > 0) {
      return String(data[keys[j]]).trim();
    }
  }
  return '';
}

function findCustomerName_(data) {
  const preferred = ['Nom complet', 'Nom et prénom', 'Nom', 'Nom du représentant'];
  for (var i = 0; i < preferred.length; i++) {
    if (data[preferred[i]]) return String(data[preferred[i]]).trim();
  }
  return '';
}
