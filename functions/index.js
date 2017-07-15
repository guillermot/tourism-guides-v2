const functions = require('firebase-functions');
var admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getGuides = functions.https.onRequest((req, resp) => {
    var serviceAccount = require('./tourism-guides-firebase-adminsdk-425nr-0181c9d078.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://tourism-guides.firebaseio.com'
    })

    const database = admin.database();

    return database.ref('/places').once('value', snap => {
        resp.status(200).send(snap.val());
    });
});

