const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Dynamically locate the serviceAccountKey.json 
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("FATAL ERROR: serviceAccountKey.json is missing in the backend folder.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { admin, db };
