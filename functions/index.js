const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require('./tourism-guides-firebase-adminsdk-425nr-0181c9d078.json');
const app = express();

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

app.get('/api/guides', (req, resp) => {
    const database = admin.database();

    return database.ref('/guides')
        .once('value')
        .then(snap => resp.status(200).send(snap.val()));
});

app.get('/api/place/:id', (req, resp) => {
    const database = admin.database();

    const id = req.params.id;

    if (id) {
        return database.ref(`/places/${id}`)
            .once('value')
            .then(snap => resp.status(200).send(snap.val()));
    }

    resp.status(404);
});

app.get('/api/fullGuides', (req, resp) => {
    const database = admin.database();
    let guides = undefined;

    return database.ref('/guides').once('value')
        .then(snap => {
            let promises = [];
            guides = snap.val();
            for (var key in guides) {
                if (guides.hasOwnProperty(key)) {
                    const guide = guides[key];

                    if (guide.places) {
                        for (var i = 0; i < guide.places.length; i++) {
                            const placeIndex = i;
                            const placePromise = database.ref(`/places/${guide.places[i]}`).once('value', placeSnap => {
                                return placeSnap.val();
                            }).then(place => {
                                guide.places[placeIndex] = place.val();
                            });

                            promises.push(placePromise);
                        }
                    }
                }
            }

            return Promise.all(promises);
        }).then(() => {
            resp.status(200).send(guides);
        });
});

exports.api = functions.https.onRequest(app);

// exports.guides = functions.https.onRequest((req, resp) => {

//     const database = admin.database();

//     return database.ref('/guides').once('value')
//         .then(snap => {
//             const guides = snap.val();

//             resp.status(200).send(guides);
//         });
// });

// exports.fullGuides = functions.https.onRequest((req, resp) => {

//     const database = admin.database();
//     let guides = undefined;

//     return database.ref('/guides').once('value')
//         .then(snap => {
//             let promises = [];
//             guides = snap.val();
//             for (var key in guides) {
//                 if (guides.hasOwnProperty(key)) {
//                     const guide = guides[key];

//                     if (guide.places) {
//                         for (var i = 0; i < guide.places.length; i++) {
//                             const placeIndex = i;
//                             const placePromise = database.ref(`/places/${guide.places[i]}`).once('value', placeSnap => {
//                                 return placeSnap.val();
//                             }).then(place => {
//                                 guide.places[placeIndex] = place.val();
//                             });

//                             promises.push(placePromise);
//                         }
//                     }
//                 }
//             }

//             return Promise.all(promises);
//         }).then(() => {
//             resp.status(200).send(guides);
//         });
// });

