'use strict';
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
const moment = require('moment-timezone');
admin.initializeApp();

const timestamp = admin.firestore.FieldValue.serverTimestamp();


exports.generateInvoices = require('./files/generateInvoices.js');

function getTheDate(theDate){
    // for timestamp firebase
    if (typeof(theDate)==='object'){return theDate.toDate()}
    // for string date format
    else if (typeof(theDate)==='string'){return new Date(theDate)}
    else{return null}
}
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
  const monthlyDeposit = data.monthlyDeposit? parseFloat(data.monthlyDeposit):0;
  const roomPrice = data.roomPrice? parseFloat(data.roomPrice):0;
  const startDate = data.startDate; 
  const endDate = data.endDate; 
  const mcId = data.mcId; 
  const paymentType = data.paymentType? data.paymentType:'CASH';
  const paymentStatus = data.paymentStatus? data.paymentStatus:'PAID'; 
  const paid = data.paymentStatus && data.paymentStatus === 'PAID'? true:false;
  const remark = data.remark;
  const totalPrice = (monthlyDeposit+roomPrice).toFixed(2);

  if (!userId || !branchId || !roomId || !packages || !roomPrice || !startDate || !endDate || !mcId || !paymentType || !paymentStatus){
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
    imgURL:data.imgURL? data.imgURL:null, paid, totalPrice,
    // type:'', todo: type = firstTime Invoice, nextCycle, etc
  };

  return admin.firestore().collection('invoices').add(invoiceData).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

exports.modifyUser = functions.firestore
  .document('users/{userId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    // console.log('theData: ', data);
    if(!data){
      //deleted
      return Promise.resolve();
    }
    // if (data.updatedAt && previousData.updatedAt){
    //   return Promise.resolve();
    // }
    // temporary
    // return Promise.resolve();
    
    const membershipStarts = (data && data.autoMembershipStarts)? (data.autoMembershipStarts):(data && data.membershipStarts)? data.membershipStarts:null;
    const membershipEnds = (data && data.autoMembershipEnds)? (data.autoMembershipEnds):(data && data.membershipEnds)? data.membershipEnds:null;
    const beforemembershipStarts = (previousData && previousData.autoMembershipStarts)? (previousData.autoMembershipStarts):(previousData && previousData.membershipStarts)? previousData.membershipStarts:null;
    const beforemembershipEnds = (previousData && previousData.autoMembershipEnds)? (previousData.autoMembershipEnds):(previousData && previousData.membershipEnds)? previousData.membershipEnds:null;
    const packageId = data && data.packageId;

    const name = data.name;
    const normalizedName = name && typeof name === 'string' && name.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/([^\s/-]+)/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());

    const email = data.email;
    const prevEmail = previousData && previousData.email;
    const normalizedEmail = email && typeof email === 'string' && email.length > 0 ? email.toLowerCase() : null;
    const firstName = data.name;
    const lastName = ' ';
    const phone = data.phone;

    // checking the database from payment record
    const paymentsQuery = admin.firestore().collection('payments')
      .where('userId', '==', change.after.id)
      .get();
    // const membershipEndField = data && data.membershipEnds;
    // console.log('membershipEndField: ', moment(getTheDate(membershipEndField)).format('YYYY-MM-DD'));

    return Promise.all([paymentsQuery]).then((results) => {
      const paymentsResults = results[0];
      // search from the payment database
      paymentsResults.forEach(doc=>{
        // console.log('thePaymentResult: ', doc.data());
        // if payment is not valid
        if(doc.data().status && (doc.data().status !== 'CLOSED')){
          return;
        }
      });

      //check if User packages is updated through vend and adyen sales.
      var updates = {}; // update the packageId based from payment record (if it is exist)
      //To check and update membership updates.
      const membershipStarts = data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;

      if(membershipStarts){
        var paymentsForUser = [];
        paymentsResults.forEach(doc=>{  
          paymentsForUser.push(doc.data());
        });
        // sort the payment data
        // paymentsForUser.sort((a,b)=>{
        //   var dateA = a.createdAt;
        //   var dateB = b.createdAt;
        //   if (dateA < dateB) {return -1}
        //   if (dateA > dateB) {return 1}
        //   return 0;
        // });

        var months = 0;
        var endMoment = moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').startOf('day');
        // console.log('momentMembershipStart: ', endMoment.format('DD MM YYYY'));

        //total up paid membership months without freeze
        paymentsForUser.forEach(payment=>{
          const renewalTerm = payment.renewalTerm ? payment.renewalTerm : 'month';
          const quantity = payment.quantity ? payment.quantity : 1;
          // const freeMonthQuantity = payment.freeMonthQuantity? payment.freeMonthQuantity:0;
          if((renewalTerm.includes('month') || !renewalTerm)){
            months += quantity;
          }
        });
        // console.log('years: ', years);
        endMoment.add(moment.duration({months:months}));
        const autoMembershipEnds = endMoment.tz('Asia/Kuala_Lumpur').toDate();
        if(moment(getTheDate(membershipStarts)).isSame(moment(autoMembershipEnds), 'day')){
          updates.autoMembershipEnds = null;
        }
        else{
          updates.autoMembershipEnds = autoMembershipEnds;
        }
      }
      // updates.updatedAt = timestamp;
      console.log('modifyUserUpdates: ', updates);
      return change.after.ref.update(updates).then(()=>{
        return Promise.resolve();
      });
    });
  }
);

// Once the generateInvoices function is called, any changes in invoices db will update the user db
// todo:- send receipt to user email or phone number is status is paid
exports.modifyInvoice = functions.firestore
  .document('invoices/{invoiceId}')
  .onWrite((change, context) => {

  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  const beforeRef = change.before;
  const afterRef = change.after;
  const beforeData = beforeRef.data();
  const afterData = afterRef.data();
  const userId = afterData && afterData.userId;
  const totalPrice = afterData && afterData.totalPrice;
  // const packageId = afterData && afterData.packageId;
  const quantity = (afterData && afterData.quantity)? afterData.quantity:1;
  const branchId = afterData.branchId;
  const roomId = afterData.roomId;
  const packages = afterData.packages;
  const monthlyDeposit = afterData.monthlyDeposit || 0;
  const roomPrice = afterData.roomPrice || 0;
  const startDate = afterData.startDate;
  const endDate = afterData.endDate;
  const mcId = afterData.mcId;
  const paymentType = afterData.paymentType;
  const paymentStatus = afterData.paymentStatus; 
  const remark = afterData.remark;
  const imgURL = afterData.imgURL

  // if(!beforeRef.exists || !userId){
  //   //new
  //   console.log('no before ref data, no action');
  //   return Promise.resolve();
  // }

  if(!afterRef.exists){
    //deleted
    console.log('no after ref data, no action');
    return Promise.resolve();
  }

  //
  // if(!beforeData.paid && afterData.paid && !afterData.receiptMailed){
  if (afterData.paid){
    //invoice marked as paid so send receipt if not yet mailed then update receiptMailed
    //retrieve user
    return admin.firestore().collection('users').doc(userId).get().then(doc=>{
      const data = doc.data();
      const email = data && data.email;
      const name = (data && data.name) || 'Customer';
      const paymentRef = admin.firestore().collection('payments').doc();

      return paymentRef.set({
        // ...afterData,
        status:'CLOSED',
        createdAt:timestamp,
        quantity,
        userId, totalPrice, 
        branchId, roomId, packages, monthlyDeposit, roomPrice,
        startDate, endDate, mcId, paymentType, paymentStatus, 
        remark, imgURL
      });
      // todo:- send receipt to member
      // return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
     
    })
    // .then(()=>{
    //   return afterRef.ref.update({receiptMailed:true, receiptMailedAt:timestamp});
    // });

  }else{
    //do nothing
    return Promise.resolve();
  }
});

