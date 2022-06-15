const functions = require('firebase-functions');
var cors = require('cors');
const admin = require('firebase-admin');
const moment = require('moment-timezone');

const msgBirdAPIKeyTest = `EqIdcTqJWI4Dy0ZeLMmlMOrwc`;
const msgBirdAPIKeyLive = `glmvwc39W1U2eYxbSiSdTiKGf`;
const msgBirdAPIIdTest = `f402fce3-6315-4904-9b21-5e1621735b85`;
const msgBirdAPIIdLive = `b99c7b76-b0e9-438a-874e-0e3415755d6c`;

const signingKey = `n0Ad2NTaNFi0nQy9y2e9ZnD2HkA09VqC`;

// const messagebirdWhatsappSandBoxKey = (msgBirdAPIKeyLive, null, ["ENABLE_CONVERSATIONSAPI_WHATSAPP_SANDBOX"]);
const whatsappChannelId = `254b0913-4ba5-482b-b4ab-8684b74a89f7`; // klcc
// var messagebird = require('messagebird')(msgBirdAPIKeyTest);
var messagebird = require('messagebird')(msgBirdAPIKeyLive);

const express = require('express');
const app = express();
app.use(cors({ origin: true }));
app.set('trust proxy', () => true);

// Retrieve the raw body as a buffer.
app.use(express.raw({ 'type': '*/*' }));

app.get('/', function (req, res){
  res.send('GET reequest to home page')
});

app.get('/login', function (req, res){
  res.send('Go to login page')
});

app.get('/buy123', function (req, res){
  res.send('Go to buy page test')
});

app.get('/babelexclusive', function (req, res){
  res.send('Go to buy page test')
});

exports.bookingWidget = functions.https.onRequest(app);

// send the notification to trainers via whatsapp
// exports.onCreateBookings = functions.firestore
//   .document('bookings/{bookingId}')
//   // .onWrite((change, context) => {
//   .onCreate((snap, context) => {
//     const document = snap.data();
//     // const document = (change.after && change.after.exists) ? change.after.data() : ((change.before && change.before.exists) ? change.before.data() : null);
//     if(!document){
//       //deleted
//       return null;
//     }
//     // Get an object with the previous document value (for update or delete)
//     // const oldDocument = event.data.previous.data();

//     // perform desired operations ...
//     const userId = document && document.userId;


//     var request = require("request");

//     if (userId && type === 'virtualTraining' && productName) {
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';
//         const phone = (data && data.phone)? data.phone:phoneNum;
//         return request.post(
//           "https://hooks.slack.com/services/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",
//           {json:{
//             text:`New Virtual PT added, trainer: ${trainerName}, Product Name: ${productName}, please contact ${name} via ${email} or ${phone}`}
//           }
//         );
//       });

//       // var request = require("request");
//       // return request.post(
//       //   "https://hooks.slack.com/services/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",
//       //   {json:{text:`New Virtual PT added, trainer: ${trainerName}, Product Name: ${productName}`}}
//       // );
    
//     }
//     else if (userId && type === 'vClass'){
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';
//         const phone = (data && data.phone)? data.phone:phoneNum;
//         return request.post(
//           "https://hooks.slack.com/services/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",
//           {json:{
//             text:`New Virtual PT Class added, trainer: ${trainerName}, Class: ${className}, Product Name: ${productName}, please contact ${name} via ${email} or ${phone}`}
//           }
//         );
//       });
//     }
//     else if (userId && type === 'virtualClass'){
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';
   
//         return request.post(
//           "https://hooks.slack.com/services/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",
//           {json:{
//             text:`${name} with ig handle name ${ighandlename} just bought a virtual class, Product Name: ${productName}, please contact ${email} or ${phoneNum}`}
//           }
//         );
//       });
//     }

//     else if (userId && type === 'onlinemywellness'){
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';
    
//         return request.post(
//           "https://hooks.slack.com/services/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",
//           {json:{
//             text:`New Babel At Home added, VPT Trainer Name: ${trainerName}, Nutrition Coach Name: ${coachName}, Product Name: ${productName}, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//           }
//         );
//       });
//     }
//     else if (userId && type === 'babelDance'){
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';
//         if (instructorName){
//           return request.post(
//             "https://hooks.slack.com/services/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",
//             {json:{
//               text:`${email} just bought a Babel Dance pass ${classRemark}, Instructor Name: ${instructorName}, Class Date: ${classDate}, Class Time: ${classTime}, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//             }
//           );
//         }
//         else{
//           // temporarily disable
//           // return request.post(
//           //   "https://hooks.slack.com/services/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",
//           //   {json:{
//           //     text:`${email} just bought a popup class, Class Date: 19/09/2020, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//           //   }
//           // );
//           if (vendProductId === '491c8f9f-1e00-a9c4-a82c-8fdba5de6329'){
//             return request.post(
//               "https://hooks.slack.com/services/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",
//               {json:{
//                 text:`${email} just bought a single virtual class, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//               }
//             );
//           }
//           else if (vendProductId === '06e22a00-c8e9-e3fb-ed46-46324ad1b0b9'){
//             return request.post(
//               "https://hooks.slack.com/services/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",
//               {json:{
//                 text:`${email} just bought a Choreography Video Project class, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//               }
//             );
//           }
//           else if (vendProductId === '7a154af8-b067-b337-aa1c-06ab6d1df79a'){
//             return request.post(
//               "https://hooks.slack.com/services/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",
//               {json:{
//                 text:`${email} just bought a Double Class Virtual Dance Pass, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
//               }
//             );
//           }
//         }
//       });
//     }
//     else if (userId && (vendProductId === unlimitedOutdoorClassVendProductId)){
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';

//         return request.post(
//           " https://hooks.slack.com/services/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",
//           {json:{
//             text:`${name} (${email}) just bought ${productName}.`}
//           }
//         );
//       });
//     }
//     else if (userId && promoType && !isAutoInvoice){
     
//       return admin.firestore().collection('users').doc(userId).get().then(doc=>{
//         const data = doc.data();
//         const email = data && data.email;
//         const name = (data && data.name) || 'Customer';

//         if (promoType && promoType === 'flx'){
//           // for single
//           if (packageId && packageId === 'D5WcUdxQNbUmltbE3fWk'){
//             return request.post(
//               "https://hooks.slack.com/services/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",
//               {json:{
//                 text:`${name} (${email}) has successfully bought flxsingleaccess promo.`}
//               }
//             );
//           }
//           else if (packageId && packageId === 'ciha9165NwgeF7wQz7GP'){
//             return request.post(
//               "https://hooks.slack.com/services/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",
//               {json:{
//                 text:`${name} (${email}) has successfully bought flxallaccess promo.`}
//               }
//             );
//           }
//         }
//       });
//     }
//     else{return Promise.resolve()}
//   }
// );