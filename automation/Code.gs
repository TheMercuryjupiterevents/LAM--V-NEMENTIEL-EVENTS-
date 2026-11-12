/**
 * LAM ÉVÉNEMENTIEL & EVENTS — Référence client unique
 *
 * À déployer comme application Web Google Apps Script.
 * Une même adresse e-mail reçoit toujours la même référence LAM,
 * même si le client soumet plusieurs formulaires.
 *
 * IMPORTANT : ce fichier seul ne rend pas le système actif.
 * Le site doit envoyer ses soumissions à l'URL de déploiement Web App.
 */

const LAM_CONFIG = {
  adminEmail: 'infolamevenementiels@gmail.com',
  prefix: 'LAM',
  year: '2026',
  counterKey: 'LAM_LAST_REFERENCE_NUMBER',
  emailMapPrefix: 'LAM_CLIENT_REFERENCE_'
};

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const callback = String(params.callback || '');
  const email = String(params.email || '').trim();

  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  if (!email || email.indexOf('@') < 1) {
    return jsonp_(callback, { ok: false, message: 'Adresse e-mail invalide.' });
  }

  try {
    const reference = getOrCreateClientReference_(email);
    return jsonp_(callback, { ok: true, reference: reference });
  } catch (err) {
    return jsonp_(callback, { ok: false, message: 'Impossible de générer la référence.' });
  }
}

function jsonp_(callback, payload) {
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  const data = (e && e.parameter) ? e.parameter : {};
  const customerEmail = findCustomerEmail_(data);

  if (!customerEmail) {
    return output_({
      ok: false,
      message: 'Adresse e-mail manquante. Veuillez vérifier le formulaire et réessayer.'
    });
  }

  const customerName = findCustomerName_(data);
  const reference = getOrCreateClientReference_(customerEmail);
  const subject = 'LAM ÉVÉNEMENTIEL & EVENTS | Référence client : ' + reference;

  const customerBody = [
    customerName ? 'Bonjour ' + customerName + ',' : 'Bonjour,',
    '',
    'LAM ÉVÉNEMENTIEL & EVENTS vous remercie pour votre demande.',
    'Votre demande a bien été reçue.',
    '',
    'VOTRE NUMÉRO CLIENT PERSONNEL : ' + reference,
    '',
    'Cette référence est unique et reste la même pour vos prochaines demandes envoyées avec cette adresse e-mail.',
    'Veuillez la conserver et la rappeler lors de vos échanges avec notre équipe.',
    '',
    'Notre équipe étudiera votre demande et vous contactera pour les prochaines étapes.',
    '',
    'PUISSANCE. PRESTIGE. PERFECTION.',
    '',
    'L’équipe LAM ÉVÉNEMENTIEL & EVENTS',
    LAM_CONFIG.adminEmail,
    '+509 37 46 9553',
    '@lamevenementielevents'
  ].join('\n');

  const adminLines = Object.keys(data)
    .filter(function(key) { return key.charAt(0) !== '_'; })
    .map(function(key) { return key + ' : ' + data[key]; });

  MailApp.sendEmail({
    to: customerEmail,
    subject: subject,
    body: customerBody,
    name: 'LAM ÉVÉNEMENTIEL & EVENTS',
    replyTo: LAM_CONFIG.adminEmail
  });

  MailApp.sendEmail({
    to: LAM_CONFIG.adminEmail,
    subject: 'NOUVELLE DEMANDE — ' + reference,
    body: [
      'Nouvelle demande reçue depuis le site LAM.',
      'Référence client : ' + reference,
      'Nom : ' + (customerName || 'Non renseigné'),
      'E-mail : ' + customerEmail,
      '',
      adminLines.join('\n')
    ].join('\n'),
    replyTo: customerEmail,
    name: 'Système de suivi LAM'
  });

  return output_({
    ok: true,
    reference: reference,
    message: 'Votre demande a bien été transmise. Votre référence client personnelle est ' + reference + '.'
  });
}

function getOrCreateClientReference_(email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const emailKey = LAM_CONFIG.emailMapPrefix + digest_(normalizedEmail);
  const lock = LockService.getScriptLock();

  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const existing = props.getProperty(emailKey);
    if (existing) return existing;

    const last = Number(props.getProperty(LAM_CONFIG.counterKey) || '0');
    const next = last + 1;
    const reference = LAM_CONFIG.prefix + '-' + LAM_CONFIG.year + '-' + String(next).padStart(6, '0');

    props.setProperty(LAM_CONFIG.counterKey, String(next));
    props.setProperty(emailKey, reference);
    return reference;
  } finally {
    lock.releaseLock();
  }
}

function digest_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    const n = (b + 256) % 256;
    return ('0' + n.toString(16)).slice(-2);
  }).join('');
}

function output_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function findCustomerEmail_(data) {
  const preferred = [
    'email', 'E-mail', 'Adresse e-mail', 'Adresse e-mail de contact',
    'E-mail de contact', 'E-mail du parent ou représentant légal',
    'E-mail du jeune', 'Adresse électronique'
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
