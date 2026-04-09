const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const useServiceAccountFile = process.env.FIREBASE_USE_SERVICE_ACCOUNT_FILE !== 'false';
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

const readServiceAccountFromEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  };
};

const serviceAccountFromEnv = readServiceAccountFromEnv();

let credential;

if (serviceAccountFromEnv) {
  credential = admin.credential.cert(serviceAccountFromEnv);
} else if (useServiceAccountFile && fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  credential = admin.credential.cert(serviceAccount);
} else {
  console.error('FATAL ERROR: Firebase Admin credentials missing. Use env vars or serviceAccountKey.json.');
  process.exit(1);
}

admin.initializeApp({
  credential,
});

const db = admin.firestore();

module.exports = { admin, db };
