
const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors');
const moment = require('moment-timezone');
// admin.initializeApp({
//   serviceAccountId: 'firebase-adminsdk-wun9f@babelasia-37615.iam.gserviceaccount.com',
// });

const msgBirdAPIKeyTest = `EqIdcTqJWI4Dy0ZeLMmlMOrwc`;
const msgBirdAPIKeyLive = `glmvwc39W1U2eYxbSiSdTiKGf`;
const msgBirdAPIIdTest = `f402fce3-6315-4904-9b21-5e1621735b85`;
const msgBirdAPIIdLive = `b99c7b76-b0e9-438a-874e-0e3415755d6c`;

const signingKey = `n0Ad2NTaNFi0nQy9y2e9ZnD2HkA09VqC`;

// const messagebirdWhatsappSandBoxKey = (msgBirdAPIKeyLive, null, ["ENABLE_CONVERSATIONSAPI_WHATSAPP_SANDBOX"]);
const whatsappChannelId = `254b0913-4ba5-482b-b4ab-8684b74a89f7`; // klcc
// var messagebird = require('messagebird')(msgBirdAPIKeyTest);
var messagebird = require('messagebird')(msgBirdAPIKeyLive);

// var Validator = require('messagebird/lib/webookSignatureJwt');

// requestSignature is the value of the 'MessageBird-Signature-JWT' HTTP header.
// var requestSignature = 'YOUR_REQUEST_SIGNATURE';
// var requestURL = '';
// var requestBody = ;

// Validator.verify(requestURL, requestBody, requestSignature, signingKey)
//   .then(...)
//   .catch(err => ...);

// Or you can use ExpressMiddlewareVerify:
// const {ExpressMiddlewareVerify} = require('messagebird/lib/webhook-signature-jwt');

// const verifySignature = new ExpressMiddlewareVerify(signingKey);
const express = require('express');
const { getDefaultLibFilePath } = require('typescript');
const timeStamp = admin.firestore.FieldValue.serverTimestamp();
const app = express();
app.use(cors({ origin: true }));
app.set('trust proxy', () => true);

// Retrieve the raw body as a buffer.
app.use(express.raw({ 'type': '*/*' }));

const appTrainer = express();
appTrainer.use(cors({ origin: true }));
appTrainer.set('trust proxy', () => true);

// Retrieve the raw body as a buffer.
appTrainer.use(express.raw({ 'type': '*/*' }));

app.get('/', function (req, res){
  res.send('GET reequest to home page')
});

app.get('/:id', (req, res) => {
  console.log('do the action here');

  if (req.params.id){
    // todo: fetch firebase
    const bookingQuery = admin.firestore().collection('bookings').doc(req.params.id).get();
    return Promise.all([bookingQuery]).then(results=>{
      const bookingResult = results[0];
      if(bookingResult.exists){
        const bookingData = bookingResult.data();
        const hostEmail = bookingData.hostEmail;

        let tacNumber = Math.round(Math.random()*1000000+1);
        // todo, send whatsapp webhook api?

       
        res.send({bookingId: req.params.id, tacNumber, hostEmail});

      }
      else{
        res.send("booking doesnt exist!!");
      }
    });
  }
}); 

// passing the phone number
app.post('/:id', (req, res, next)=>{
  const body = req.body;
  const phone = body && body.phone;
  const name = body && body.name;
  const userId = body && body.userId;
  const additionalClaims = {premiumAccount: true};

  let tacNumber = Math.round(Math.random()*1000000+1);

  if (phone){
    console.log('userPhoneNumber: ', phone);

    var rp2 = require('request-promise');
    var optionEdit = {
      method:'POST',
      // url: `https://flows.messagebird.com/flows/07bc04f6-2b99-469d-b3cb-d62c8c1747d3/invoke`,
      url:`https://flows.messagebird.com/flows/e0af2113-1c98-431a-88bf-dcd3821f8fc5/invoke`,
      headers:{
        'Content-Type': 'application/json'
      },
      body:{
        tac:tacNumber,
        phoneNumber:phone
      },
      json:true
    };
    
     // to enable cors
    //  res.set({
    //   'content-type': 'application/json',
    //   'warning': "with content type charset encoding will be added by default",
    //   "Access-Control-Allow-Headers" : "Content-Type",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    // });

    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
      return rp2(optionEdit).then(function (result){
        if (userId){
          return admin.auth().createCustomToken(userId)
          .then((customToken) => {
               // return write to firestore
            return admin.firestore().collection('tacs').add({
              tacNumber, phone,
              createdAt:timeStamp,
              name, customToken
            }).then((docRef)=>{
               // Send token back to client
              return res.status(200).send({
                success:true,
                result, phone,
                customToken
              })
            }).catch(error=>{
              return res.status(200).send({
                success:false,
                error
              })
            })
          }).catch((error) => {
            console.log('Error creating custom token:', error);
            return res.status(200).send({
              success:false,
              error,
              errorToken:true
            })
          });
        }
        else{
          return admin.firestore().collection('tacs').add({
            tacNumber, phone,
            createdAt:timeStamp,
            name
          }).then((docRef)=>{
             // Send token back to client
            return res.status(200).send({
              success:true,
              result, phone
            })
          }).catch(error=>{
            return res.status(200).send({
              success:false,
              error
            })
          })
        }
       
      })
    });
  }
  else{
    return res.status(200).send({
      success:false,
      message:"no phone number"
    })
  }

});
// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err
  }
  console.log('Server started on port 3000')
})

// for trainer notification
appTrainer.post('/:id', (req, res, next)=>{
  const body = req.body;
  const phone = body && body.phone;
  const name = body && body.name;
  const text = body.text;

  // let text = `You have received a booking from ...bla2`
  if (phone){
    console.log('userPhoneNumber: ', phone);

    var rp2 = require('request-promise');
    var optionEdit = {
      method:'POST',
      url:`https://flows.messagebird.com/flows/fabd8dcc-f767-49f2-b4bc-56a5f3280679/invoke`,
      headers:{
        'Content-Type': 'application/json'
      },
      body:{
        phoneNumber:phone,
        text
      },
      json:true
    };

    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
      return rp2(optionEdit).then(function (result){
        // return write to firestore
        // return admin.firestore().collection('tacs').add({
        //   tacNumber, phone,
        //   createdAt:timeStamp,
        //   name
        // }).then((docRef)=>{
          return res.status(200).send({
            success:true,
            result, phone, text
          })
        // }).catch(error=>{
        //   return res.status(200).send({
        //     success:false,
        //     error
        //   })
        // })
      })
    });
  }
  else{
    return res.status(200).send({
      success:false,
      message:"no phone number"
    })
  }
});

exports.appWidgets = functions.https.onRequest(app);

exports.appTrainers = functions.https.onRequest(appTrainer);

function getTheDate(theDate){
  if (theDate === null){return}
  // for timestamp firebase
  if (typeof(theDate)==='object'){return theDate.toDate()}
  // for string date format
  else if (typeof(theDate)==='string'){return new Date(theDate)}
}

// cron job to remind member 1 day before the class
exports.exclusiveReminderDay = functions.https.onRequest((req,res) => {
  const itemData = req.body;
  const bookingId = itemData && itemData.bookingId;
  const bookingQuery = bookingId? admin.firestore().collection('bookings').doc(bookingId).get():admin.firestore().collection('bookings').where('type', '==', 'babelExclusive').where('status', '==', 'CONFIRM').get();
  const userQuery = admin.firestore().collection('users').get();

  return Promise.all([bookingQuery, userQuery]).then(results=>{
    const bookingRes = results[0];
    const userRes = results[1];

    var userMap = {};
    var bookingMap = {};
    var whatsappPromise;
    var whatsappPromises = [];

    userRes && userRes.forEach(doc=>{userMap[doc.id]=doc.data()});
    var bookingData;
    // result for bookingId
    if (bookingId){
      bookingData = bookingRes && bookingRes.data();
      bookingMap[bookingId] = bookingRes && bookingRes.data();
      const userMapBooking = bookingData && bookingData.userMap;
      const trainerId = bookingData && bookingData.trainerId;
      const trainerData = trainerId && userMap[trainerId];
      const trainerName = trainerData && trainerData.name;
      const location = bookingData && bookingData.location;
      const startAt = bookingData && bookingData.startAt;
      const timeFormat = moment(getTheDate(startAt)).tz('Asia/Kuala_Lumpur').format('h:mm a');

      Object.entries(userMapBooking).forEach(([key,value]) => {
        const phoneNumber = value.phoneNumber;
        const guestName = value.name;

        if (phoneNumber){
          whatsappPromise = sendWhatsappReminderToGuest(phoneNumber, guestName, location, timeFormat);
          whatsappPromises.push(whatsappPromise);
        }
      });
    }
    else{
      bookingRes && bookingRes.forEach(doc=>{
        bookingMap[doc.id]=doc.data();
      })
    }

    return Promise.all(whatsappPromises).then(whRes=>{
      // console.log('whRes: ', whRes);
      return res.status(200).send({whRes});
    }).catch(error=>{
      return res.status(200).send(error);
    })
  });
});

// via webhook
function sendWhatsappReminderToGuest(phoneNumber='', guestName='', location='', time=''){
  var optionEdit = { method: 'POST',
  url:`https://flows.messagebird.com/flows/4485dccd-c3c4-43e2-98a3-cbf6164e5b5f/invoke`,
  body:{phoneNumber, guestName, location, time},
    json:true 
  };
  // return optionEdit;
  let rp2 = require('request-promise');
  return rp2(optionEdit);
}

// // // Verify webhook.
// // app.get('/webhook', verifySignature, (req, res) => {
// //   res.send('verified');
// // });

// // // Tell our app to listen on port 3000
// // app.listen(3000, function (err) {
// //   if (err) {
// //     throw err
// //   }
// //   console.log('Server started on port 3000')
// // })
// // exports.sendTestWhatsappMsgBird = functions.https.onRequest((req, res) => {
// //   var params = {
// //     'to': '+601156866885',
// //     'from': whatsappChannelId,
// //     'type': 'text',
// //     'content': {
// //       'text': 'Hello! faizul hadi babel test'
// //     },
// //     'reportUrl': 'https://www.babel.fit'
// //   };

// //    return messagebird.conversations.send(params, function (err, response) {
// //     if (err) {
// //       console.log(err);
// //       return res.status(200).send({err});
// //     }
// //     console.log('messagebirdResponse:', response);
// //     return res.status(200).send({
// //       success:true,
// //       data:'data',
// //       response
// //     })
// //   })
// // });

// // exports.testStartSendConversation = functions.https.onRequest((req, res)=>{

// //   var params = {
// //     'to': '+601156866885',
// //     'channelId': whatsappChannelId,
// //     'type': 'text',
// //     'content': { 'text': 'Hello! faizul todo send tac number' },
// //     'source': { 'foo': 'bar' }
// //   };
  
// //   return messagebird.conversations.start(params, function (err, response) {
// //     if (err) {
// //       return res.status(200).send({err});
// //     }
// //     return res.status(200).send({
// //       success:true,
// //       data:'data',
// //       response
// //     });
// //   });
// // });

// // send tac via whatsapp
// exports.sendTACtoUser = functions.https.onRequest((req, res)=>{
//   const itemData = req.body;
//   const phoneInput = itemData && itemData.phone;
//   let tacNumber = Math.round(Math.random()*1000000+1);

//   var params = {
//     'to': phoneInput? `${phoneInput}`:'+601156866885',
//     'channelId': whatsappChannelId,
//     'type': 'text',
//     'content': { 'text': phoneInput? `Your TAC number is ${tacNumber}`:`no phone input, send TAC to faizul ${tacNumber}`},
//     'source': { 'faizul': 'hadi' }
//   };
  
//   return messagebird.conversations.start(params, function (err, response) {
//     if (err) {
//       return res.status(200).send({err});
//     }
//     return res.status(200).send({
//       success:true,
//       tacNumber,
//       response
//     });
//   });
// });

// // send tac via app http call
// exports.sendTACtoGuest = functions.https.onCall((data, context) => {
//   const whatsappNumber = data.whatsappNumber;
//   console.log('whatsappNumber: ', whatsappNumber);
//   const tacNumber = Math.round(Math.random()*1000000+1);
//   var params = {
//     'to': whatsappNumber? `${whatsappNumber}`:'+601156866885',
//     'channelId': whatsappChannelId,
//     'type': 'text',
//     'content': { 'text': whatsappNumber? `Your TAC number is ${tacNumber}`:`no phone input, send TAC to faizul ${tacNumber}`},
//     'source': { 'faizul': 'hadi' }
//   }

//   const msgBirdPromise = messageBirdPromise(params, 'start');
//   return Promise.all([msgBirdPromise]).then(result=>{
//     console.log('resultMsgBird: ', result);
    
//     // todo, add to firestore?
//     return {tacNumber, result};
//   });
// });

// exports.sendTACtoGuest2 = functions.https.onCall((data, context) => {
//   const whatsappNumber = data.whatsappNumber;
//   console.log('whatsappNumber: ', whatsappNumber);
//   let tacNumber = Math.round(Math.random()*1000000+1);

//   if (!whatsappNumber || !tacNumber){
//     console.log('missing data: ', whatsappNumber, tacNumber);
//     return Promise.resolve();
//   }
//   // todo: if phone number is not valid
//   var rp2 = require('request-promise');
//   var optionEdit = {
//     method:'POST',
//     // url: `https://flows.messagebird.com/flows/07bc04f6-2b99-469d-b3cb-d62c8c1747d3/invoke`,
//     url:`https://flows.messagebird.com/flows/e0af2113-1c98-431a-88bf-dcd3821f8fc5/invoke`,
//     body:{
//       tacCode:tacNumber,
//       phoneNumber:whatsappNumber
//     },
//     json:true
//   };
  
//   const corsFn = cors({ origin: true });
//   return corsFn(data, () => {
//     return rp2(optionEdit).then(function (res){
//       console.log('res: ', res);
//       return res;
//     }).catch(error=>{
//       console.log('error: ', error);
//       return error;
//     });
//   });
// });

// send notification to trainer

exports.sendTACtoGuest3 = functions.https.onRequest((req, res)=>{
  const itemData = req.body;
  const whatsappNumber = itemData && itemData.phone;
  let tacNumber = Math.round(Math.random()*1000000+1);

  if (whatsappNumber){
    var rp2 = require('request-promise');
    var optionEdit = {
      method:'POST',
      // url: `https://flows.messagebird.com/flows/07bc04f6-2b99-469d-b3cb-d62c8c1747d3/invoke`,
      url:`https://flows.messagebird.com/flows/e0af2113-1c98-431a-88bf-dcd3821f8fc5/invoke`,
      headers:{
        'Content-Type': 'application/json'
      },
      body:{
        tac:tacNumber,
        phoneNumber:whatsappNumber
      },
      json:true
    };
    
     // to enable cors
     res.set({
      'content-type': 'application/json',
      'warning': "with content type charset encoding will be added by default",
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    });
    
    // res.set('Access-Control-Allow-Origin', '*');
    // console.log('requestMethod: ', req.method);

    // if (req.method) {
    //   // Send response to OPTIONS requests
    //   res.set('Access-Control-Allow-Methods', 'GET');
    //   res.set('Access-Control-Allow-Methods', 'POST');
    //   res.set('Access-Control-Allow-Headers', 'Content-Type');
    //   res.set('Access-Control-Max-Age', '3600');
    //   // res.status(204).send('');
    // } else {
    //   res.send('Hello World!');
    // }

    const corsFn = cors({ 
      origin: true,
      // credentials:true,            //access-control-allow-credentials:true
      // optionSuccessStatus:200,
    });

    return corsFn(req, res, () => {
      return rp2(optionEdit).then(function (result){
        // res.set('Access-Control-Allow-Methods', 'POST');
        // res.set('Access-Control-Allow-Headers', 'Content-Type');
        // res.set('Access-Control-Max-Age', '3600');
        // res.set('Access-Control-Allow-Credentials', 'true');
        // res.set('Access-Control-Allow-Origin', '*');

        res.set({
          'content-type': 'application/json',
          'warning': "with content type charset encoding will be added by default",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        });

        console.log('resTACGuest3: ', result);
        // return res;
        return res.status(200).send({
          success:true,
          result, tacNumber
        })
      }).catch(error=>{
        console.log('error: ', error);
        return res.status(200).send({
          success:false,
          error
        })
      });
    });
  }
  else{
    return res.status(200).send({
      success:false
    })
  }
});

// for testing
// for testing
exports.corsEnabledFunctionAuth = functions.https.onRequest((req, res) => {
  // Set CORS headers for preflight requests
  // Allows GETs from origin https://mydomain.com with Authorization header

  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');

  // if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Authorization');
    res.set('Access-Control-Max-Age', '3600');
    return res.send("Hello faizul blabla");
  // } else {
  //   res.send('Hello World!');
  // }
});

// save webhook to firestore
// exports.saveWebHook = functions.https.onRequest((req, res)=>{
//   const itemData = req.body;
//   const whatsappNumber = itemData && itemData.phone;
//   console.log('whatsappNumber: ', whatsappNumber);
//   let tacNumber = Math.round(Math.random()*1000000+1);

//   var params = {
//     events: ['message.created', 'message.updated'],
//     channelId: whatsappChannelId,
//     url: 'https://flows.messagebird.com/flows/e0af2113-1c98-431a-88bf-dcd3821f8fc5/invoke',
//   }
    
//   const msgBirdPromise = messageBirdPromise(params, 'webhook');
//   return Promise.all([msgBirdPromise]).then(result=>{
//     console.log('resultMsgBird: ', result);
    
//     // todo, add to firestore?
//     return ({success:true, result})
//   }).catch(error=>{
//     return ({success:false, error});
//   })
// });

// // retrieve list of webhook
// exports.retrieveWebhook = functions.https.onRequest((req, res)=>{
//   var params = {}
//   const msgBirdPromise = messageBirdPromise(params, 'webhookList');
//   return Promise.all([msgBirdPromise]).then(result=>{
//     // console.log('resultMsgBird: ', result);
    
//     // todo, add to firestore?
//     return ({success:true, result})
//       .catch(error=>{
//       return ({success:false, result});
//     })
//   });
// });

// exports.testSendWhatsappMsgBird = functions.https.onRequest((req, res) => {
//   var messagebird = require('messagebird')(msgBirdAPIKeyTest);
//   var params = {
//     'to': '+601156866885',
//     'from': whatsappChannelId,
//     'type': 'text',
//     'content': {
//       'text': 'Hello! faizul hadi babel test'
//     },
//     'reportUrl': 'https://www.babel.fit'
//   };

//   return messagebird.conversations.send(params, function (err, response) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log('messagebirdResponse:', response);
//     return res.status(200).send({
//       success:true,
//       data:'data',
//       response
//     })
//   })
//     // .then((response)=>{
//     // return res.status(200).send({
//     //   success:true,
//     //   data:'data',
//     //   response
//     // })
//   // });

//   // return res.status(200).send({
//   //   success:true,
//   //   data:'data',
    
//   // })
// });

// // exports.sendTAC = functions.https.onCall((data, context) => {
// //   const whatsappNumber = data.whatsappNumber;
// //   const tacNumber = data.tacNumber;
// //   if (!whatsappNumber || !tacNumber){
// //     console.log('missing data: ', whatsappNumber, tacNumber);
// //     return Promise.resolve();
// //   }
// //   // todo: if phone number is not valid
// //   var rp2 = require('request-promise');
// //   var optionEdit = {
// //     method:'POST',
// //     url: `https://flows.messagebird.com/flows/07bc04f6-2b99-469d-b3cb-d62c8c1747d3/invoke`,
// //     body:{
// //       tacCode:tacNumber,
// //       phoneNumber:whatsappNumber
// //     },
// //     json:true
// //   };
// //   return rp2(optionEdit).then(function (res){
// //     console.log('res: ', res);
// //     return res;
// //   }).catch(error=>{
// //     console.log('error: ', error);
// //     return error;
// //   });
// // });

// // meesagebird function with promise
// function messageBirdPromise (params, type) {
//   const promise = new Promise(function (resolve, reject) {
//     var messagebird = require('messagebird')(msgBirdAPIKeyLive);
//     // var messagebird = require('messagebird')(msgBirdAPIKeyLive, null, ["ENABLE_CONVERSATIONSAPI_WHATSAPP_SANDBOX"]);
//     // console.log('messageBird params: ', params);
//     if (type && type === 'conversation'){
//       messagebird.conversations.send(params, function (err, response) {
//         // console.log('appointments: ', appointments);
//         if (err) {
//           reject(err); // reject with connection/network error
//         } else {
//           // console.log('appointmentsResolve: ', appointments);
//           resolve(response); // resolve with response data
//         }
//       });
//     }
//     else if (type && type === 'getconversation'){
//       messagebird.conversations.list(20, 0, function (err, response) {
//         if (err) {
//           reject(err);
//         }
//         resolve(response); 
//       });
//     }
//     else if (type && type === 'balance'){
//       messagebird.balance.read(function (err, response) {
//         if (err) {
//           reject(err);
//         }
//         resolve(response);
//       });
//     }
//     else if (type && type === 'create'){
//       messagebird.messages.create(params, function (err, response){
//         if (err) {
//           reject(err);
//         }
//         resolve(response);
//       });
//     }
//     else if (type && type === 'verify'){
//       messagebird.verify.create('601156866885', params, function (err, response){
//         if (err) {
//           reject(err);
//         }
//         resolve(response);
//       })
//     }
//     else if (type && type === 'createContact'){
//       messagebird.contacts.create(60178719704, function (err, response) {
//         if (err)
//           return console.log(err);
//         console.log(response);
//       });
//     }
//     else if (type && type === 'readContact'){
//       messagebird.contacts.read('', function (err, response) {
//         if (err)
//           return console.log(err);
//         console.log(response);
//       });
//     }
//     else if (type && type === 'start'){
//       messagebird.conversations.start(params, function (err, response) {
//         if (err) return console.log(err);
//           resolve(response);
//       });
//     }
//     else if (type && type === 'webhook'){
//       messagebird.conversations.webhooks.create(params, function (err, response) {
//         if (err) {
//           reject(err);
//         }
//         resolve(response); 
//       });
//     }
//     else if (type && type === 'webhookList'){
//       messagebird.conversations.webhooks.list(100, 0, function (err, response) {
//         if (err) {
//         return console.log(err);
//         }
//         resolve(response);
//       });
//     }
    
//   });
//   return promise;
// }

// // verify
// exports.verifyMsgBirdSMS = functions.https.onRequest((req, res) => {
  
//   const testMsg = {
//     originator: '601156866885',
//     type: 'sms'
//   }
//   const msgBirdPromise = messageBirdPromise(testMsg, 'verify',);
//   return Promise.all([msgBirdPromise]).then(result=>{
//     const msgBirdResult = result[0];
//     console.log('msgBirdResult: ', msgBirdResult);
//     return res.status(200).send({
//       success:true,
//       msgBirdResult
//     })
//   }).catch(e=>{
//     return res.status(500).send({
//       success:false,
//       error:e
//     })
//   })
// });

// // to get messagebird whatsapp
// // exports.sendWhatsappBird1 = functions.https.onRequest((req, res) => {
  
// //   const testMsg = {
// //     'to': '601156866885',
// //     // 'channelId': 'cbe243d3f07f4a0d98b276ef53313807',
// //     // 'channelId': '714c40eb4721467f89a16a2d1c1ff87e',
// //     'channelId':'254b0913-4ba5-482b-b4ab-8684b74a89f7',
// //     'type': 'hsm',
// //       'content': {
// //         'hsm': {
// //           'namespace': '42ace5e9_5c72_4638_8f82_55ac4ec2100b',
// //           'templateName': 'support',
// //           'language': {
// //             'policy': 'deterministic',
// //             'code': 'en'
// //           },
// //           'params': [
// //             {"default": "faizul hadi"},
// //             {"default": "123"},
// //             {"default": "new coffee machine"},
// //             {"default": "MessageBird, Trompenburgstraat 2C, 1079TX Amsterdam"}
// //           ]
// //         }
// //       }
// //     }

// //   const msgBirdPromise = messageBirdPromise(testMsg, 'sendWhatsapp1');
// //   return Promise.all([msgBirdPromise]).then(result=>{
// //     const msgBirdResult = result[0];
// //     console.log('msgBirdResult: ', msgBirdResult);
// //     return res.status(200).send({
// //       success:true,
// //       msgBirdResult
// //     })
// //   }).catch(e=>{
// //     return res.status(500).send({
// //       success:false,
// //       error:e
// //     })
// //   })
// // });

// const whatsappChannelmsgBird = `714c40eb4721467f89a16a2d1c1ff87e`;
// const emailChannelmsgBird = `e98f917a1e05476e8780cf07226f15eb`;
// const FBMessenggermsgBird = `fd0385f731ba4fa6ba77ee40d4a4b47b`;

// // to get messagebird whatsapp
// exports.sendWhatsappMsgBird = functions.https.onRequest((req, res) => {
  
//   const itemData = req.body;
//   // console.log('itemData: ', itemData);
//   const phoneInput = itemData && itemData.phoneInput;
//   const messageInput = itemData && itemData.messageInput;

//   const testMsg = {
//     'to': phoneInput? phoneInput:'+601156866885',
//     'from': whatsappChannelmsgBird, // channel ID: BABEL SURIA KLCC
//     'type': 'text',
//     'content': {
//       'text': messageInput? messageInput:'Hello! faizul hadi babel test, faizul is awesome'
//     },
//     // 'reportUrl': 'https://www.babel.fit', 
//     // The URL for delivery of status reports for the message. Must be HTTPS.
//     "fallback": {
//       "from": whatsappChannelmsgBird, // channel ID: BABEL SURIA KLCC
//       "after": "1m"
//     },
//     // "source": {
//     //   "agentId": "abc123", 
//     //   // "userId": [1,2,3], 
//     //   // "botId": 1234567890
//     // }
//   }
//   const msgBirdPromise = messageBirdPromise(testMsg, 'conversation');
//   return Promise.all([msgBirdPromise]).then(result=>{
//     const msgBirdResult = result[0];
//     console.log('msgBirdResult: ', msgBirdResult);
//     return res.status(200).send({
//       success:true,
//       msgBirdResult
//     })
//   }).catch(e=>{
//     return res.status(500).send({
//       success:false,
//       error:e
//     })
//   })
// });

// // to get messagebird whatsapp
// exports.getWhatsappMsgBird = functions.https.onRequest((req, res) => {
  
//   const itemData = req.body;
//   // console.log('itemData: ', itemData);
//   const phoneInput = itemData && itemData.phoneInput;
//   const messageInput = itemData && itemData.messageInput;

//   const msgBirdPromise = messageBirdPromise(null, 'getconversation');
//   return Promise.all([msgBirdPromise]).then(result=>{
//     const msgBirdResult = result[0];
//     console.log('msgBirdResult: ', msgBirdResult);
//     return res.status(200).send({
//       success:true,
//       msgBirdResult
//     })
//   }).catch(e=>{
//     return res.status(500).send({
//       success:false,
//       error:e
//     })
//   })
// });

// // to get messagebird contact
// // exports.createContactMsgBird = functions.https.onRequest((req, res) => {
  
// //   const msgBirdPromise = messageBirdPromise(null, 'contact');

// //   return Promise.all([msgBirdPromise]).then(result=>{
// //     const msgBirdResult = result[0];
// //     console.log('msgBirdResult: ', msgBirdResult);
// //     return res.status(200).send({
// //       success:true,
// //       msgBirdResult
// //     })
// //   }).catch(e=>{
// //     return res.status(500).send({
// //       success:false,
// //       error:e
// //     })
// //   })
// // });

// // to get messagebird contact
// // exports.getAllContactMsgBird = functions.https.onRequest((req, res) => {
  
// //   var url = `https://rest.messagebird.com/contacts?access_key=glmvwc39W1U2eYxbSiSdTiKGf`;
// //   var request = require("request");
// //   const corsFn = cors({ origin: true });
// //   return corsFn(req, res, () => {
// //       // const optionBody = JSON.parse(JSON.stringify(req.body));
// //     // const optionMethod = req.method;

// //     // token will be expired on 22/10/2021
// //     const option = {
// //         uri: url,
// //         method: 'GET',
// //         // body: Object.assign({}, body),
// //         // json: true
// //     };
// //     request(option, function (error, response) {
// //         res.contentType('application/json');
// //         if (response.statusCode === 200) {
// //           var responseBody = JSON.parse(response.body);
// //           console.log('resStatus:', response.statusCode, response.statusMessage);
// //           // console.log('theRes:')
// //           // to enable cors
// //           res.set({
// //             'content-type': 'application/json',
// //             'warning': "with content type charset encoding will be added by default",
// //             "Access-Control-Allow-Headers" : "Content-Type",
// //             "Access-Control-Allow-Origin": "*",
// //             "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
// //           });
// //           res.status(response.statusCode).send({
// //             success:true, 
// //             responseBody:responseBody,
// //             status: response.statusCode,
// //             // theRes: res,
// //           });
// //         }
// //         else {
// //             console.log('Status:', response.statusCode, response.statusMessage);
// //             console.log('Error:', error);
// //             res.status(response.statusCode).send({ data: 'Fail in authorising recurring payment' });
// //         }
// //     });
// //   });
// // });

// // to get individual message by conversation ID
// exports.getMessageMsgBirdByConvId = functions.https.onRequest((req, res) => {
//     const itemData = req.body;
//     // console.log('itemData: ', itemData);
//     const conversationId = itemData && itemData.conversationId;
    
//     var url = `https://conversations.messagebird.com/v1/conversations/${conversationId}`;
//     var request = require("request");
//     const corsFn = cors({ origin: true });
//     return corsFn(req, res, () => {
//         // const optionBody = JSON.parse(JSON.stringify(req.body));
//       // const optionMethod = req.method;
    
//       // token will be expired on 22/10/2021
//       const option = {
//           uri: url,
//           // method: 'GET',
//           // body: Object.assign({}, body),
//           // json: true,
//           headers:{
//             // 'content-type': 'application/json',
//             'Authorization': `AccessKey ${msgBirdAPIKeyLive}`
//           }
//       };
//       request(option, function (error, response) {
//           // res.contentType('application/json');
//           if (response.statusCode === 200) {
//             var responseBody = JSON.parse(response.body);
//             console.log('resStatus:', response.statusCode, response.statusMessage);
//             // console.log('theRes:')
//             // to enable cors
//             // res.set({
//             //   'content-type': 'application/json',
//             //   'warning': "with content type charset encoding will be added by default",
//             //   "Access-Control-Allow-Headers" : "Content-Type",
//             //   "Access-Control-Allow-Origin": "*",
//             //   "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
//             // });
//             res.status(response.statusCode).send({
//               success:true, 
//               responseBody:responseBody,
//               status: response.statusCode,
//               // theRes: res,
//             });
//           }
//           else {
//               console.log('Status:', response.statusCode, response.statusMessage);
//               console.log('Error:', error);
//               res.status(response.statusCode).send({ data: 'error', response });
//           }
//       });
//     });
//   });
  
//   // to get messagebird whatsapp
//   // exports.sendMsgBirdSMS = functions.https.onRequest((req, res) => {
    
//   //   const testMsg = {
//   //     originator : '601156866885',
//   //     recipients : [ '60178719704' ],
//   //     body : 'Hi! This is your first message'
//   //   }
//   //   const msgBirdPromise = messageBirdPromise(testMsg, 'create');
//   //   return Promise.all([msgBirdPromise]).then(result=>{
//   //     const msgBirdResult = result[0];
//   //     console.log('msgBirdResult: ', msgBirdResult);
//   //     return res.status(200).send({
//   //       success:true,
//   //       msgBirdResult
//   //     })
//   //   }).catch(e=>{
//   //     return res.status(500).send({
//   //       success:false,
//   //       error:e
//   //     })
//   //   })
//   // });
  
//   // to get messagebird balance
//   exports.getMsgBirdBalance = functions.https.onRequest((req, res) => {
  
//     const testMsg = {
//       'to': '+60178719704',
//       'from': '714c40eb4721467f89a16a2d1c1ff87e',
//       'type': 'text',
//       'content': {
//         'text': 'Hello! faizul hadi babel test'
//       },
//       'reportUrl': 'https://www.babel.fit'
//     }
//     const msgBirdPromise = messageBirdPromise(testMsg, 'balance');
//     return Promise.all([msgBirdPromise]).then(result=>{
//       const msgBirdResult = result[0];
//       console.log('msgBirdResult: ', msgBirdResult);
//       return res.status(200).send({
//         success:true,
//         msgBirdResult
//       })
//     }).catch(e=>{
//       return res.status(500).send({
//         success:false,
//         error:e
//       })
//     })
  
//     // const corsFn = cors({ origin: true });
//     // return corsFn(req, res, () => {
     
//     //   var option = {};
//     //   option.method = 'GET';
      
//     //   const balanceUrl = `balance?access_key=${msgBirdAPIKeyTest}`;
  
//     //   const msgBirdBalancePromise = messageBird(balanceUrl, 'balance');
//     //   return Promise.all([msgBirdBalancePromise]).then(result=>{
//     //     const msgBirdResult = result[0];
//     //     console.log('msgBirdResult: ', msgBirdResult);
//     //     return res.status(200).send({
//     //       success:true,
//     //       msgBirdResult
//     //     })
//     //   }).catch(e=>{
//     //     return res.status(500).send({
//     //       success:false,
//     //       error:e
//     //     })
//     //   })
//     // });
//   });

// // // messagebird flow - webhook URL
// // exports.sendMessageToUserWebhookTest = functions.https.onRequest((req, res) => {
// //   const itemData = req.body;
// //   const phoneNumber = itemData && itemData.phoneNumber;
// //   const email = itemData && itemData.email;
// //   const name = itemData && itemData.name;
// //   var url = `https://flows.messagebird.com/flows/07bc04f6-2b99-469d-b3cb-d62c8c1747d3/invoke`;
// //   const body = {
// //     phoneNumber:phoneNumber,
// //     email:email,
// //     name:name
// //   }

// //   var request = require("request");
// //   const corsFn = cors({ origin: true });
// //   return corsFn(req, res, () => {
// //     // const optionBody = JSON.parse(JSON.stringify(req.body));
// //     const optionBody = JSON.stringify(req.body);
// //     // const optionMethod = req.method;
  
// //     // token will be expired on 22/10/2021
// //     const option = {
// //         uri: url,
// //         method: 'POST',
// //         body:optionBody,
// //         // body: Object.assign({}, body),
// //         // json: true,
// //         headers:{
// //           'content-type': 'application/json',
// //           // 'Authorization': `AccessKey ${msgBirdAPIKeyLive}`
// //         }
// //     };
// //     request(option, function (error, response) {
// //         res.contentType('application/json');
// //         // console.log('error: ', error);
// //         // console.log('response: ', response);

// //         if (response.statusCode === 200) {
// //           var responseBody = JSON.parse(response.body);
// //           // console.log('resStatus:', response.statusCode, response.statusMessage);
// //           // console.log('theRes:')
// //           // to enable cors
// //           // res.set({
// //           //   'content-type': 'application/json',
// //           //   'warning': "with content type charset encoding will be added by default",
// //           //   "Access-Control-Allow-Headers" : "Content-Type",
// //           //   "Access-Control-Allow-Origin": "*",
// //           //   "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
// //           // });
// //           res.status(response.statusCode).send({
// //             success:true, 
// //             responseBody:responseBody,
// //             status: response.statusCode,
// //             // theRes: res,
// //           });
// //         }
// //         else {
// //             // console.log('Status:', response.statusCode, response.statusMessage);
// //             console.log('Error:', error);
// //             res.status(response.statusCode).send({ data: 'error', response });
// //         }
// //     });
// //   });
// // });
  