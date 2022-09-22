const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld3 = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// // Listens for new messages added to /messages/:documentId/original
// //and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document(("/branches/{branchId}"))
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log("Uppercasing", context.params.documentId, original);
      const uppercase = original.toUpperCase();
      // // You must return a Promise when performing asynchronous tasks
      // //inside a Functions such as
      // // writing to Firestore.
      // // Setting an 'uppercase' field in Firestore document
      // //returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });
