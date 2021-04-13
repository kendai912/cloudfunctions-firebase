var admin = require("firebase-admin");

var serviceAccount = require("./react-firebase-d79a3-firebase-adminsdk-w6lix-06275d9ec4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
