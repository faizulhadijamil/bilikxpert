'use strict';
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const moment = require("moment");
admin.initializeApp();

const timestamp = admin.firestore.FieldValue.serverTimestamp();

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

exports.helloWorldLocal = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

exports.helloWorldLocal2 = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!2222", {structuredData: true});
  response.send("Hello from Firebase!222");
});

exports.addInvoiceForRental = functions.https.onCall((data, context) => {
  const userId = data.userId;
  const branchId = data.branchId; 
  const roomId = data.roomId; 
  const packages = data.packages;
  const monthlyDeposit = data.monthlyDeposit;
  const roomPrice = data.roomPrice;
  const startDate = data.startDate; 
  const endDate = data.endDate; 
  const mcId = data.mcId; 
  const paymentType = data.paymentType? data.paymentType:'CASH';
  const paymentStatus = data.paymentStatus? data.paymentStatus:'PAID'; 
  const paid = data.paymentStatus && data.paymentStatus === 'PAID'? true:false;
  const remark = data.remark;

  if (!userId || !branchId || !roomId || !packages || !monthlyDeposit || !roomPrice || !startDate || !endDate || !mcId || !paymentType || !paymentStatus){
    console.log('data missing....')
    return Promise.resolve();
  }

  console.log('adding rental invoice....');
  const invoiceData = {
    createdAt:timestamp,
    userId, branchId, roomId, packages, monthlyDeposit, roomPrice, 
    startDate: startDate? moment(startDate).tz('Asia/Kuala_Lumpur').toDate():null,
    endDate: endDate? moment(endDate).tz('Asia/Kuala_Lumpur').toDate():null, 
    mcId, paymentType, paymentStatus, remark,
    imgURL:data.imgURL? data.imgURL:null, paid
  };

  return admin.firestore().collection('invoices').add(invoiceData).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});
