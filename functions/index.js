const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./tourism-guides-firebase-adminsdk-425nr-0181c9d078.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tourism-guides.firebaseio.com'
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getGuides = functions.https.onRequest((req, resp) => {

    const database = admin.database();

    return database.ref('/guides').once('value', snap => {
        const guides = snap.val();

        for (var key in guides) {
            if (guides.hasOwnProperty(key)) {
                const guide = guides[key];
                if (guide.places && guide.places.length > 0) {
                    for (var i = 0; i < guide.places.length; i++) {
                        const placeKey = guide.places[i];
                        const placeRef = `/places/${placeKey}`;
                        console.info('placeRef: ' + placeRef);
                        database.ref(placeRef).once('value', placeSnap => guide.places[i] = placeSnap.val());
                    }
                }
            }
        }

        resp.status(200).send(guides);
    });
});

