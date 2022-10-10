const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment-timezone');
const timestamp = admin.firestore.FieldValue.serverTimestamp();

// function getTheDate(theDate){
//     if (theDate === null){return}
//     // for timestamp firebase
//     if (typeof(theDate)==='object'){return theDate.toDate()}
//     // for string date format
//     else if (typeof(theDate)==='string'){return new Date(theDate)}
// }

