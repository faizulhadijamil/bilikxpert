// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
// To set the timestampsInSnapshots, to avoid the error/warning message from firestore (timestamp format changes);
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// admin.firestore().settings(settings);

const moment = require('moment-timezone');
const Blob = require('Blob');
const timestamp = admin.firestore.FieldValue.serverTimestamp();
const FileSaver = require('file-saver');

//write to spreadsheets
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');

// TODO: Use firebase functions:config:set to configure your googleapi object:
// googleapi.client_id = Google API client ID,
// googleapi.client_secret = client secret, and
// googleapi.sheet_id = Google Sheet id (long string in middle of sheet URL)
const CONFIG_CLIENT_ID = functions.config().googleapi.client_id;
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret;
const CONFIG_SHEET_ID = functions.config().googleapi.sheet_id;

// TODO: Use firebase functions:config:set to configure your watchedpaths object:
// watchedpaths.data_path = Firebase path for data to be synced to Google Sheet
const CONFIG_DATA_PATH = functions.config().watchedpaths.data_path;

// The OAuth Callback Redirect.
// const FUNCTIONS_REDIRECT = `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/oauthcallback`;
const FUNCTIONS_REDIRECT = `https://us-central1-babelasia-37615.cloudfunctions.net/oauthcallback`;

// setup for authGoogleAPI
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const functionsOauthClient = new OAuth2Client(CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT);

// OAuth token cached locally.
let oauthTokens = null;
var cors = require('cors');

function getTheDate(theDate){
  if (theDate === null){return}
  // for timestamp firebase
  if (typeof(theDate)==='object'){return theDate.toDate()}
  // for string date format
  else if (typeof(theDate)==='string'){return new Date(theDate)}
}

// visit the URL for this Function to request tokens
exports.authgoogleapi = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  res.redirect(functionsOauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  }));
});

// setup for OauthCallback
const DB_TOKEN_PATH = '/api_tokens';

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
exports.oauthcallback = functions.https.onRequest(async (req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  const code = req.query.code;
  try {
    const {tokens} = await functionsOauthClient.getToken(code);
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    await admin.database().ref(DB_TOKEN_PATH).set(tokens);
    return res.status(200).send('App successfully configured with new Credentials. '
        + 'You can now close this page.');
  } catch (error) {
    return res.status(400).send(error);
  }
});

// trigger function to write to Sheet when new data comes in on CONFIG_DATA_PATH
exports.appendrecordtospreadsheet = functions.database.ref(`${CONFIG_DATA_PATH}/{ITEM}`).onCreate(
    (snap) => {
      const newRecord = snap.val();
      console.log('newRecord: ', newRecord)
      return appendPromise({
        spreadsheetId: CONFIG_SHEET_ID,
        range: 'A:C',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[newRecord.firstColumn, newRecord.secondColumn, newRecord.thirdColumn]],
        },
      });
    });

// accepts an append request, returns a Promise to append it, enriching it with auth
function appendPromise(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      return sheets.spreadsheets.values.append(request, (err, response) => {
        if (err) {
          console.log(`The API returned an error: ${err}`);
          return reject(err);
        }
        return resolve(response.data);
      });
    });
  });
}

function updateGoogleSheet(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      // console.log('client request: ', client);
      return sheets.spreadsheets.values.batchUpdate(request, (err, response) => {
        // console.log('sheetRequest: ', request);
        if (err) {
          console.log(`The update API returned an error: ${err}`);
          return reject(err);
        }
        else{
          // console.log('Update', response.data);
          return resolve(response.data);
        }
      });
    }).catch(error=>{
      console.log('updateGoogleSheeterror: ', error);
      return reject(error);
    })
  });
}

function getGoogleSheetPromise(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      return sheets.spreadsheets.values.get(request, (err, response) => {

        console.log('theresponse: ', response);
        if (err) {
          console.log(`The update API returned an error: ${err}`);
          return reject(err);
        }
        else{
          console.log('Update', response.data);
          return resolve(response.data);
        }
      });
    }).catch(error=>{
      console.log('updateGoogleSheeterror: ', error);
      return reject(error);
    })
  });
}

// checks if oauthTokens have been loaded into memory, and if not, retrieves them
async function getAuthorizedClient() {
  if (oauthTokens) {
    return functionsOauthClient;
  }
  const snapshot = await admin.database().ref(DB_TOKEN_PATH).once('value');
  oauthTokens = snapshot.val();
  functionsOauthClient.setCredentials(oauthTokens);
  return functionsOauthClient;
}

// HTTPS function to write new data to CONFIG_DATA_PATH, for testing
exports.testsheetwrite = functions.https.onRequest(async (req, res) => {
  const random1 = Math.floor(Math.random() * 100);
  const random2 = Math.floor(Math.random() * 100);
  const random3 = Math.floor(Math.random() * 100);
  const ID = new Date().getUTCMilliseconds();
  await admin.database().ref(`${CONFIG_DATA_PATH}/${ID}`).set({
    firstColumn: random1,
    secondColumn: random2,
    thirdColumn: random3,
  });
  res.send(`Wrote ${random1}, ${random2}, ${random3} to DB, trigger should now update Sheet.`);
});

// cron job to add users to sheets
exports.addUsersToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('paid', '==', true)

  return Promise.all([usersQuery, packageQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResults = result[1];

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var pkgMap = {};
    packageResults && packageResults.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });


    var users = [];
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        // const membershipStarts = data.membershipStarts? data.membershipStarts:null;
        const membershipStarts = data.autoMembershipStarts? data.autoMembershipStarts: data.membershipStarts? data.membershipStarts:null; 
        const packageId = data.packageId||null;
        const packageData = packageId && pkgMap[packageId];
        const packageName = packageData && packageData.name;
        const isKLCCPkg = packageId && isKLCCPackage(packageId);
        const promoJan2020 = data && data.promoJan2020;

        const userData = [
          data.createdAt ? moment(getTheDate(data.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : null,
          data.index ? data.index:'',
          user.id,
          data.membershipCard ? data.membershipCard : '',
          data.gantnerCardNumber ? data.gantnerCardNumber : '',
          data.name ? data.name : '',
          data.firstName ? data.firstName : '',
          data.lastName ? data.lastName : '',
          data.nric ? data.nric : '',
          data.passport ? data.passport : '',
          data.nationality ? data.nationality : '',
          data.race ? data.race : '',
          data.gender ? data.gender : '',
          data.phone ? data.phone : '',
          data.email ? data.email : '',
          data.mcId ? data.mcId : '',
          // data.packageId ? data.packageId : '',
          isKLCCPkg? 'KLCC': ' ',
          packageName,
          data.paymentMode ? data.paymentMode : '',
          membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.autoDiff ? data.autoDiff : '',
          data.freeMonths ? data.freeMonths : '',
          data.freePT ? data.freePT : '',
          data.freeGift ? data.freeGift : '',
          data.referredByUserId ? data.referredByUserId : '',
          data.trainerId ? data.trainerId : '',
          data.inductionDate ? moment(getTheDate(data.inductionDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.inductionDone ? data.inductionDone : '',
          data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.cancellationReason ? data.cancellationReason : '',
          data.remarks ? data.remarks : '',
          data.hasRecurring? data.hasRecurring:'false',
          data.promoJan2020? data.promoJan2020:'null',
          data.promoAug2020? data.promoAug2020: 'null',
          data.promoSep2020? data.promoSep2020: 'null',
          data.promoMidSep2020? data.promoMidSep2020: 'null'
        ];

        // if (membershipStarts){
        // if (data.hasRecurring){
          users.push(userData);
        // }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    users.sort((a,b)=>{
      var dateA = new Date(a[18]);
      var dateB = new Date(b[18]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO USERS3!A2:AM`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        users: users,
        // theResponse
        // userCount
      });
    });
  });
});

// function for member before july2020
exports.addAllMembershipHistoryToSheet = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').where('email', '==', 'roshankanesan90@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments')
    .where('userId', '==', '1XrR1zRiUoJORRfdTo3z')
    // .where('type', '==', 'membership')
    // .where('createdAt', '<=', moment('20200630').startOf('day').toDate())
    .get();
  // const freezeQuery = admin.firestore().collection('payments').where('source', '==', 'freeze').get();


  return Promise.all([usersQuery, packageQuery, paymentQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResults = result[1];
    const paymentResults = result[2];

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var pkgMap = {};
    packageResults && packageResults.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });

    var paymentMap = {};
    var freezeMap = {};
    var freeAccessMap = {};
    var freezeTerminateMap = {};
    paymentResults && paymentResults.forEach(payment => {
      const data = payment && payment.data();
      const userId = data && data.userId;
      const source = data && data.source;
      const freezeFor = data && data.freezeFor;
      const createdAt = data && data.createdAt;
      const status = data && data.status;
      const paymentId = payment.id;

      // if (data && userId && source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
      //   freeAccessMap[userId][paymentId] = data;
      // }
      // else if (data && userId && source && (source === 'vend' || source === 'adyen' || source === 'pbonline') && (status && (status != 'CLOSED' || status != 'REFUNDED'))){
      //   paymentMap[userId][paymentId] = data;
      // }
      // else if (data && userId && source && (source === 'freeze')){
      //   freezeMap[userId][paymentId] = data;
      // }
      // else if (data && userId && source && (source === 'freeze')){
      //   freezeTerminateMap[userId][paymentId] = data;
      // }

      // if (data && userId && source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
      //   freeAccessMap[userId] = data;
      // }
      // else if (data && userId && source && (source === 'vend' || source === 'adyen' || source === 'pbonline') && (status && (status != 'CLOSED' || status != 'REFUNDED'))){
      //   paymentMap[userId] = data;
      // }
      // else if (data && userId && source && (source === 'freeze')){
      //   freezeMap[userId] = data;
      // }
      // else if (data && userId && source && (source === 'freeze')){
      //   freezeTerminateMap[userId] = data;
      // }

    });    

    // console.log('paymentMap: ', paymentMap);
    // console.log('freezeMap: ', freezeMap);
    // console.log('freeTerminate: ', freeTerminate);
    // console.log('freeAccessMap: ', freeAccessMap);

    var users = [];
    var membershipHistoryList = [];
  
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const userId = user && user.id;
        const cancelledMember = data.cancellationDate? true:false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        // const membershipStarts = data.membershipStarts? data.membershipStarts:null;
        const membershipStarts = data.autoMembershipStarts? data.autoMembershipStarts: data.membershipStarts? data.membershipStarts:null; 
        const packageId = data.packageId||null;
        const packageData = packageId && pkgMap[packageId];
        const packageName = packageData && packageData.name;
        const isKLCCPkg = packageId && isKLCCPackage(packageId);
        const promoJan2020 = data && data.promoJan2020;
        const paymentData = paymentMap? paymentMap[user.id]:null;
        const freezeData = freezeMap? freezeMap[user.id]:null;
        const freezeTerminateData = freezeTerminateMap? freezeTerminateMap[user.id]:null;
        const freeAccessData = freeAccessMap? freeAccessMap[user.id]:null;
        var addMonths = 0;

        // hardcode from jan2018 till june2020
        const monthsDiff = Math.max(moment('2020-06-30').diff(moment('2018-01-01'), 'months'));
        var currentMemberMonthDiff = 0;
        // user monthDiff up till june2020
        if (membershipStarts && autoMembershipEnds){
          currentMemberMonthDiff = Math.max(moment(getTheDate(membershipStarts)).diff(moment(getTheDate(autoMembershipEnds)), 'months'));
        }

        console.log('monthDiff: ', monthsDiff);
        console.log('currentMemberMonthDiff: ', currentMemberMonthDiff);
        // console.log('paymentData: ', paymentData);

        var userPaymentArrays = [];
        // paymentData && paymentData.forEach(payment=>{
        //   console.log('faizulPaymentData: ', payment.data());
        // });

        // if (paymentData && paymentData.createdAt && (paymentData.renewalTerm === 'yearly' || paymentData.renewalTerm === 'year')){
        //   for (var i=0; i<(qty*12); i++){
        //     userPaymentArrays.push({
        //       date:moment(paymentData.createdAt).add(i, 'months'),
        //       type: paymentData.renewalTerm
        //     });
        //   }
        // }
        // else if (paymentData && paymentData.createdAt && (paymentData.renewalTerm === 'biyearly' || paymentData.renewalTerm === 'biyear')){
        //   for (var j=0; j<(qty*6); j++){
        //     userPaymentArrays.push({
        //       date:moment(paymentData.createdAt).add(j, 'months'),
        //       type: paymentData.renewalTerm
        //     });
        //   }
        // }
        // else if (paymentData && paymentData.createdAt && (paymentData.renewalTerm === 'quarterly')){
        //   for (var k=0; k<(qty*3); k++){
        //     userPaymentArrays.push({
        //       date:moment(paymentData.createdAt).add(k, 'months'),
        //       type: paymentData.renewalTerm
        //     });
        //   }
        // }
        // else if (paymentData && paymentData.createdAt && (paymentData.renewalTerm === 'month')){
        //   for (var l=0; l<(qty); l++){
        //     userPaymentArrays.push({
        //       date:moment(paymentData.createdAt).add(l, 'months'),
        //       type: paymentData.renewalTerm
        //     });
        //   }
        // }

        // for (var a=0; a<=monthsDiff; a++){
        //   const iterationStartMoment = moment(getTheDate(membershipStarts)).clone().add(addMonths, 'months');
        //   membershipHistoryList.push({
        //     date:iterationStartMoment, 
        //     // type:'unpaid'
        //   });
        // }
        // console.log('paymentData: ', paymentData);
        // console.log('freezeData: ', freezeData);

      // console.log('userPaymentArrays: ', userPaymentArrays);
      // console.log('membershipHistoryList: ', membershipHistoryList);
      //   const monthsDiff = membershipEndsMoment.diff(moment(getTheDate(membershipStarts)), 'month');

      // // console.log('userFreezes: ', userFreezes)
      // const initialMonthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
      // var monthsDiff = initialMonthsDiff;
      // var totalArrayLength = userFreezeTerminated.length + userFreezes.length + userFreeAccess.length + combinedVendMth.length;
      // if (totalArrayLength>initialMonthsDiff){
      //   monthsDiff = totalArrayLength-1;
      // }

      // // default, if there is no payment detected
      // for (var i=0; i<=monthsDiff; i++){
      //   const iterationStartMoment = startMoment.clone().add(addMonths, 'months').add(addYears, 'years');
      //   // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
      //   primaryText = createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
      //   combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
      //   membershipHistoryList.push({
      //     date:iterationStartMoment, 
      //     type:'unpaid'
      //   });
      // }

        const userData = [
          // data.createdAt ? moment(getTheDate(data.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          // monthsDiff,
          data.name? data.name:'',
          data.email? data.email:'',
          packageName? packageName:'',
          membershipStarts? moment(getTheDate(membershipStarts)).format('YYYY-MM-DD'):'',
          // default for jan 2018 till jun2020
          '', // jan 2018
          '', // feb 2018
          '', // march 2018
          '', // april 2018
          '', // may 2018
          '', // june 2018
          '', // july 2018
          '', // aug 2018
          '', // sep 2018
          '', // oct 2018
          '', // nov 2018
          '', // dec 2018
          '', // jan 2019
          '', // feb 2019
          '', // march 2019
          '', // april 2019
          '', // may 2019
          '', // june 2019
          '', // july 2019
          '', // aug 2019
          '', // sep 2019
          '', // oct 2019
          '', // nov 2019
          '', // dec 2019
          '', // jan 2020
          '', // feb 2020
          '', // march 2020
          '', // april 2020
          '', // may 2020
          '', // june 2020
        ];


        // MembershipHistory =  [
          
        //   jun2018:'Source/n Package Name /n Transaction ID';



        // ]

        // emptyMonths =  [stardate]



        // userData.shift(data.name? data.name: '', data.email ? data.email : '',);
        // data.email ? data.email : '',
        // packageName,
        // membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
// )

        // if (membershipStarts){
        // if (data.hasRecurring){
          users.push(userData);
        // }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    // users.sort((a,b)=>{
    //   var dateA = new Date(a[18]);
    //   var dateB = new Date(b[18]);
    //   if (dateA < dateB) {return -1}
    //   if (dateA > dateB) {return 1}
    //   return 0;
    // });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO USERS4!A3:AX`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        users: users,
        // theResponse
        // userCount
      });
    });
  });
});

// cron job to add number of visitors to sheets
exports.addVisitorReportToSheets = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    const startOfMonth = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');
    const endOfMonth = moment('20200731').tz('Asia/Kuala_Lumpur').startOf('day');
    // const dayDiff = endOfMonth.diff(startOfMonth, 'days');
    // console.log('dayDiff: ', dayDiff);

    var sheetReport = [];
    var visitorCountTTDI = 0;
    var visitorCountKLCC = 0;
    var visitorCountNonRegister = 0;

    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isSameOrAfter(startOfTodayMoment):false;
        // const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isSame(moment('2020-09-07').startOf('day')):false;
        const firstJoinVisit = data && data.firstJoinVisit;
        
        // for (var i = 0; i<dayDiff; i++){

        // }

        // var sheetData = [

        // ]
        // for daily
        if (isTodayJoinDate && firstJoinVisit && firstJoinVisit==='TTDI'){
          visitorCountTTDI += 1;
        }
        else if (isTodayJoinDate && firstJoinVisit && firstJoinVisit==='KLCC'){
          visitorCountKLCC += 1;
        }
        // for visitors that created from vend (not created from the registration)
        else if (isTodayJoinDate){
          visitorCountNonRegister += 1;
        }
      }
    });

    const getSheetPromise = getGoogleSheetPromise({
      spreadsheetId: CONFIG_SHEET_ID,
      range: `AUTO VISITOR REPORT COUNT!A2:F`,
    });
  
    return getSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      const values = result && result.values;
      const rowsCount = (values && values.length)? values.length:0;
      
      sheetReport = [[
        rowsCount + 1,
        startOfTodayMoment.format('DD/MM/YYYY'),
        startOfTodayMoment.format('dddd'),
        visitorCountKLCC, 
        visitorCountTTDI,
        // visitorCountNonRegister
      ]];
      
      console.log('sheetReport: ', sheetReport);

      const updateSheetPromise = updateGoogleSheet({
        spreadsheetId: CONFIG_SHEET_ID,
        // valueInputOption: 'RAW',
        
        resource: {
          // How the input data should be interpreted.
          valueInputOption: 'RAW',  // TODO: Update placeholder value.
    
          // The new values to apply to the spreadsheet.
          data: [
            {
              range: `AUTO VISITOR REPORT COUNT!A${rowsCount+2}:F`,
              majorDimension: "ROWS",
              values: sheetReport
            }
          ],  
        },

      });

      return updateSheetPromise.then((result)=>{
        // console.log('theresult: ', result);
        return res.status(200).send({
          success:true,
          data: 'data',
          sheetReport
        });
      });
    });
  });
});

// cron job to add number of visitors to sheets
exports.addmemberReportToSheets = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();
  const paymentsQuery = admin.firestore().collection('payments')
    .where('source', '==', 'freeze')
    .get();

  return Promise.all([usersQuery, paymentsQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const paymentsResults = result[1];

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    const startOfMonth = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');
    const endOfMonth = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    
    const dayDiff = endOfMonth.diff(startOfMonth, 'days');
    console.log('dayDiff: ', dayDiff);

    var sheetReport = [];
    var allUsersCount = 0;
    var allUsersWithCreatedAtCount = 0;
    var allRegisteredUserCount = 0;
    var visitorCount = 0;
    var totalVisitorTier1Count = 0; // visitor with join date
    var totalVisitorTier2Count = 0; // visitor with created at, without join date
    var totalVisitorCount = 0; // combine visitor tier 1 and 2
    var visitorCountTTDI = 0;
    var visitorCountKLCC = 0;

    var activePaidCountTTDI = 0;
    var activePaidCountKLCC = 0;

    // for termination
    var cancelCountTTDI = 0;
    var cancelCountKLCC = 0;
    var totalCancelCountTTDI = 0
    var totalCancelCountKLCC = 0;
    var totalCancelComplimentary = 0;
    var totalCancelMonthlyAllAccess = 0;
    var totalCancelMonthlySingleAccess = 0;
    var totalCancel6MAllAccess = 0;
    var totalCancelCP290 = 0;
    var totalCancel6MRenewal = 0;
    var totalCancelComplimentaryPromo = 0;
    var totalCancel3MJanPromoAllAccess = 0;
    var totalCancel12TermRenewalSingleAccess = 0;
    var totalCancelYearlySingleAccess = 0;
    var totalCancelCP180 = 0;
    var totalCancel3MTermMembershipAllAccess = 0;
    var totalCancel6MSingleAccess = 0;
    var totalCancelCP210 = 0;
    var totalCancelCP310 = 0;
    var totalCancel3MJanPromoSingleAccess = 0;
    var totalCancel12TermYearlyAllAccess = 0;
    var totalCancel3MJan2020PromoSingleAcces = 0;
    var totalCancelCP230 = 0;
    var totalCancel3MTermSingle = 0;
    var totalCancelWithoutPkg = 0;
    var totalCancel = 0;
    var complimentaryCount = 0;

    // for freeze
    var totalFreezeCountTTDI = 0;
    var totalFreezeCountKLCC = 0;
    var totalFreezeCountComplimentary = 0;
    var totalFreezeMonthlyAllAccess = 0;
    var totalFreezeMonthlySingleAccess = 0;
    var totalFreeze6MAllAccess = 0;
    var totalFreezeCP290 = 0;
    var totalFreeze6MRenewal = 0;
    var totalFreezeComplimentaryPromo = 0;
    var totalFreeze3MJanPromoAllAccess = 0;
    var totalFreeze12TermRenewalSingleAccess = 0;
    var totalFreezeYearlySingleAccess = 0;
    var totalFreezeCP180 = 0;
    var totalFreeze3MTermMembershipAllAccess = 0;
    var totalFreeze6MSingleAccess = 0;
    var totalFreezeCP210 = 0;
    var totalFreezeCP310 = 0;
    var totalFreeze3MJanPromoSingleAccess = 0;
    var totalFreeze12TermYearlyAllAccess = 0;
    var totalFreeze3MJan2020PromoSingleAcces = 0;
    var totalFreezeCP230 = 0;
    var totalFreeze3MTermSingle = 0;
    var totalFreezeWithoutPkg = 0;
    var totalFreezeCount = 0;

    // for active member
    var totalActiveCountKLCC = 0;
    var totalActiveCountTTDI = 0;
    var totalActiveCountComplimentary = 0;
    var totalActiveMonthlyAllAccess = 0;
    var totalActiveMonthlySingleAccess = 0;
    var totalActive6MAllAccess = 0;
    var totalActiveCP290 = 0;
    var totalActive6MRenewal = 0;
    var totalActiveComplimentaryPromo = 0;
    var totalActive3MJanPromoAllAccess = 0;
    var totalActive12TermRenewalSingleAccess = 0;
    var totalActiveYearlySingleAccess = 0;
    var totalActiveCP180 = 0;
    var totalActive3MTermMembershipAllAccess = 0;
    var totalActive6MSingleAccess = 0;
    var totalActiveCP210 = 0;
    var totalActiveCP310 = 0;
    var totalActive3MJanPromoSingleAccess = 0;
    var totalActive12TermYearlyAllAccess = 0;
    var totalActive3MJan2020PromoSingleAcces = 0;
    var totalActiveCP230 = 0;
    var totalActive3MTermSingle = 0;
    var totalActiveWithoutPkg = 0;
    var totalActiveCount = 0;

    // for expired member
    var totalExpiredCountKLCC = 0;
    var totalExpiredCountTTDI = 0;
    var totalExpiredCountComplimentary = 0;
    var totalExpiredMonthlyAllAccess = 0;
    var totalExpiredMonthlySingleAccess = 0;
    var totalExpired6MAllAccess = 0;
    var totalExpiredCP290 = 0;
    var totalExpired6MRenewal = 0;
    var totalExpiredComplimentaryPromo = 0;
    var totalExpired3MJanPromoAllAccess = 0;
    var totalExpired12TermRenewalSingleAccess = 0;
    var totalExpiredYearlySingleAccess = 0;
    var totalExpiredCP180 = 0;
    var totalExpired3MTermMembershipAllAccess = 0;
    var totalExpired6MSingleAccess = 0;
    var totalExpiredCP210 = 0;
    var totalExpiredCP310 = 0;
    var totalExpired3MJanPromoSingleAccess = 0;
    var totalExpired12TermYearlyAllAccess = 0;
    var totalExpired3MJan2020PromoSingleAcces = 0;
    var totalExpiredCP230 = 0;
    var totalExpired3MTermSingle = 0;
    var totalExpiredWithoutPkg = 0;
    var totalExpiredCount = 0;

    const freezeMap = {};
    var userIdFreezeMap = {};
    paymentsResults.forEach(payment=>{
      const data = payment.data();
      const freezeFor = data && data.freezeFor;
      const userId = data && data.userId;
      // const isFreezeMonth = freezeFor && moment(getTheDate(freezeFor)).isBetween(startOfMonth.clone().subtract(1, 'days'), endOfMonth.clone().add(1, 'days'));
      const isFreezeMonth = freezeFor && moment(getTheDate(freezeFor)).isSameOrAfter(startOfMonth.clone().subtract(0, 'days'));
      if (isFreezeMonth){
        userIdFreezeMap[userId] = data;
      }
    });

    console.log('userIdFreezeMap: ', userIdFreezeMap);

    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const email = data && data.email;
        const isCreatedUser = (data && data.createdAt)? moment(getTheDate(data.createdAt)).clone().tz('Asia/Kuala_Lumpur').startOf('day').isSameOrBefore(endOfMonth.clone()):false;
        const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isBetween(startOfMonth.clone().subtract(1,'days'), endOfMonth.clone().add(1, 'days')):false;
        // for all member and visitors
        const isRegisteredUser = (data && data.joinDate)? moment(getTheDate(data.joinDate)).clone().tz('Asia/Kuala_Lumpur').startOf('day').isSameOrBefore(endOfMonth.clone()):false;
        // to calculate total visitor
        const isVisitor = (data && data.joinDate)? moment(getTheDate(data.joinDate)).clone().tz('Asia/Kuala_Lumpur').startOf('days').isSameOrBefore(endOfMonth.clone()):false;
        const roles = data && data.roles;
        const firstJoinVisit = data && data.firstJoinVisit;
        const packageId = data && data.packageId;
        const isKLCCMember = packageId && isKLCCPackage(packageId); // klcc
        const isTTDIMember = packageId && isTTDIPackage(packageId); // ttdi
        const membershipEnd = data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;
        const membershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts? data.membershipStarts:null;
        const cancellationDate = data && data.cancellationDate;
        // const isRegisteredMember = membershipStarts && startOfMonth.isBetween(moment(getTheDate(membershipStarts)).subtract(1, 'days'), moment(getTheDate(membershipStarts)).add(1, 'months'))
        const isExpired = membershipStarts && membershipEnd && endOfMonth.isBefore(moment(getTheDate(membershipEnd)));
        
        const freezeData = userIdFreezeMap[user.id];
        // console.log('freezeData: ', freezeData);

        const isActiveMember = membershipStarts && membershipEnd && moment(getTheDate(membershipEnd)).clone().isSameOrAfter(startOfMonth) && moment(getTheDate(membershipStarts)).clone().isSameOrBefore(startOfMonth);
        // const isActiveMember = membershipStarts && membershipEnd && moment(getTheDate(membershipEnd)).clone().isSameOrAfter(startOfMonth);
        // new terminated member
        const isCancelMember = cancellationDate && moment(getTheDate(cancellationDate)).clone().isBetween(startOfMonth.clone().subtract(1, 'days'), endOfMonth.clone().add(1, 'days'));
       // total terminated member
        const isTerminatedMember = cancellationDate && moment(getTheDate(cancellationDate)).clone().isSameOrBefore(endOfMonth.clone());
        const isComplimentaryPkg = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24');
        const isComplimentaryMember = isComplimentaryPkg && !isTerminatedMember && !freezeData;
        // const isCancel = cancellationDate;
        // const isFreeze = moment(getTheDate(freezeFor)).isBetween(moment(startDateString).clone(), moment(endDateString).clone());

        // for daily visitor
        // if (isTodayJoinDate && firstJoinVisit && firstJoinVisit==='TTDI'){
        //   visitorCountTTDI += 1;
        // }
        // else if (isTodayJoinDate && firstJoinVisit && firstJoinVisit==='KLCC'){
        //   visitorCountKLCC += 1;
        // }

        // for all users
        allUsersCount += 1;
        // for all user with createdAt field
        if(isCreatedUser){
          allUsersWithCreatedAtCount += 1;
        }
        // for all registered users
        if(isRegisteredUser){
          allRegisteredUserCount += 1;
        }
        // for visitor
        if (isTodayJoinDate && !roles && (!membershipStarts || moment(getTheDate(membershipStarts)).isSameOrBefore(endOfMonth))){
          visitorCount += 1;
        }
        // for total visitor count tier 1
        if (isVisitor && !roles && (!membershipStarts || !moment(getTheDate(membershipStarts)).clone().isSameOrBefore(startOfMonth.clone()))){
          totalVisitorTier1Count += 1;
        }
        // for total visitor count tier 2
        if (!isVisitor && !roles && isCreatedUser && (!membershipStarts || !moment(getTheDate(membershipStarts)).clone().isSameOrBefore(startOfMonth.clone()))){
          totalVisitorTier2Count += 1;
        }
        // for total visitor count
        if (!roles && (!membershipStarts || !moment(getTheDate(membershipStarts)).clone().isSameOrBefore(startOfMonth.clone()))){
          totalVisitorCount += 1;
        }

        // for new terminated member
        if (isKLCCMember && isCancelMember){
          cancelCountKLCC += 1;
        }
        else if (isTTDIMember && isCancelMember){
          cancelCountTTDI += 1;
        }
        
        if (isTerminatedMember){
          totalCancel += 1;
        }
        // for total terminated member
        if (isKLCCMember && isTerminatedMember){
          totalCancelCountKLCC += 1;
        }
        else if (isTTDIMember && isTerminatedMember){
          totalCancelCountTTDI += 1;
        }

        // termination for each package
        if (isComplimentaryPkg && isTerminatedMember){
          totalCancelComplimentary += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='89THMCx0BybpSVJ1J8oz'){ // 6M
          totalCancel6MAllAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='BKcaoWGrWKYihS40MpGd'){ // CP290
          totalCancelCP290 += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='DjeVJskpeZDdEGlcUlB1'){ // 6M renewal
          totalCancel6MRenewal += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='L6sJtsKG68LpEUH3QeD4'){ // complimentary promo
          totalCancelComplimentaryPromo += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='LNGWNSdm6kf4rz1ihj0i'){ // 3M JanPromo all access
          totalCancel3MJanPromoAllAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='TJ7Fiqgrt6EHUhR5Sb2q'){ // monthly all access
          totalCancelMonthlyAllAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='VWEHvdhNVW0zL8ZAeXJX'){ // 12M renewal
          totalCancel12TermRenewalSingleAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='WmcQo1XVXehGaxhSNCKa'){ // yearly
          totalCancelYearlySingleAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='ZEDcEHZp3fKeQOkDxCH8'){ // CP180
          totalCancelCP180 += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='aTHIgscCxbwjDD8flTi3'){ // 3M term all access
          totalCancel3MTermMembershipAllAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='duz1AkLuin8nOUd7r66L'){ // 6M single access
          totalCancel6MSingleAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='dz8SAwq99GWdEvHCKST2'){ // CP210
          totalCancelCP210 += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='eRMTW6cQen6mcTJgKEvy'){ // CP310
          totalCancelCP310 += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='k7As68CqGsFbKZh1Imo4'){ // 3M Jan2020 Promo (Single Club)
          totalCancel3MJan2020PromoSingleAcces += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='q7SXXNKv83MkkJs8Ql0n'){ // 12m Term (All Clubs)
          totalCancel12TermYearlyAllAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='vf2jCUOEeDDiIQ0S42BJ'){ // monthly single access
          totalCancelMonthlySingleAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='w12J3n9Qs6LTViI6HaEY'){ // 3M Jan2020 Promo (Single Club).
          totalCancel3MJanPromoSingleAccess += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='wpUO5vxWmme7KITqSITo'){ // CP230
          totalCancelCP230 += 1;
        }
        else if (isTerminatedMember && packageId && packageId==='yQFACCzpS4DKcDyYftBx'){ // 3M Term Membership
          totalCancel3MTermSingle += 1;
        }
        else if (isTerminatedMember){
          console.log('isterminated with no package', email);
          totalCancelWithoutPkg += 1;
        }

         // for freeze member
        if (freezeData){
          totalFreezeCount += 1;
        }
        if (freezeData && isKLCCMember){
          totalFreezeCountKLCC += 1;
        }
        else if(freezeData && isTTDIMember){
          totalFreezeCountTTDI += 1;
        }

        // freeze for each package
        if(freezeData && isComplimentaryPkg){ // complimentary
          totalFreezeCountComplimentary += 1;
        }
        else if (freezeData && packageId && packageId==='89THMCx0BybpSVJ1J8oz'){ // 6M
          totalFreeze6MAllAccess += 1;
        }
        else if (freezeData && packageId && packageId==='BKcaoWGrWKYihS40MpGd'){ // CP290
          totalFreezeCP290 += 1;
        }
        else if (freezeData && packageId && packageId==='DjeVJskpeZDdEGlcUlB1'){ // 6M renewal
          totalFreeze6MRenewal += 1;
        }
        else if (freezeData && packageId && packageId==='L6sJtsKG68LpEUH3QeD4'){ // complimentary promo
          totalFreezeComplimentaryPromo += 1;
        }
        else if (freezeData && packageId && packageId==='LNGWNSdm6kf4rz1ihj0i'){ // 3M JanPromo all access
          totalFreeze3MJanPromoAllAccess += 1;
        }
        else if (freezeData && packageId && packageId==='TJ7Fiqgrt6EHUhR5Sb2q'){ // monthly all access
          totalFreezeMonthlyAllAccess += 1;
        }
        else if (freezeData && packageId && packageId==='VWEHvdhNVW0zL8ZAeXJX'){ // 12M renewal
          totalFreeze12TermRenewalSingleAccess += 1;
        }
        else if (freezeData && packageId && packageId==='WmcQo1XVXehGaxhSNCKa'){ // yearly
          totalFreezeYearlySingleAccess += 1;
        }
        else if (freezeData && packageId && packageId==='ZEDcEHZp3fKeQOkDxCH8'){ // CP180
          totalFreezeCP180 += 1;
        }
        else if (freezeData && packageId && packageId==='aTHIgscCxbwjDD8flTi3'){ // 3M term all access
          totalFreeze3MTermMembershipAllAccess += 1;
        }
        else if (freezeData && packageId && packageId==='duz1AkLuin8nOUd7r66L'){ // 6M single access
          totalFreeze6MSingleAccess += 1;
        }
        else if (freezeData && packageId && packageId==='dz8SAwq99GWdEvHCKST2'){ // CP210
          totalFreezeCP210 += 1;
        }
        else if (freezeData && packageId && packageId==='eRMTW6cQen6mcTJgKEvy'){ // CP310
          totalFreezeCP310 += 1;
        }
        else if (freezeData && packageId && packageId==='k7As68CqGsFbKZh1Imo4'){ // 3M Jan2020 Promo (Single Club)
          totalFreeze3MJan2020PromoSingleAcces += 1;
        }
        else if (freezeData && packageId && packageId==='q7SXXNKv83MkkJs8Ql0n'){ // 12m Term (All Clubs)
          totalFreeze12TermYearlyAllAccess += 1;
        }
        else if (freezeData && packageId && packageId==='vf2jCUOEeDDiIQ0S42BJ'){ // monthly single access
          totalFreezeMonthlySingleAccess += 1;
        }
        else if (freezeData && packageId && packageId==='w12J3n9Qs6LTViI6HaEY'){ // 3M Jan2020 Promo (Single Club).
          totalFreeze3MJanPromoSingleAccess += 1;
        }
        else if (freezeData && packageId && packageId==='wpUO5vxWmme7KITqSITo'){ // CP230
          totalFreezeCP230 += 1;
        }
        else if (freezeData && packageId && packageId==='yQFACCzpS4DKcDyYftBx'){ // 3M Term Membership
          totalFreeze3MTermSingle += 1;
        }
        else if (freezeData){
          console.log('freeze without package ', email);
          totalFreezeWithoutPkg += 1;
        }

        if (isComplimentaryMember){
          complimentaryCount += 1;
        }
       
        const isActiveMemberWithoutFreezeTerminate = isActiveMember && !freezeData && !isTerminatedMember;

        // for active member
        if(isActiveMemberWithoutFreezeTerminate){
          totalActiveCount += 1;
        }
        if(isKLCCMember && isActiveMemberWithoutFreezeTerminate){
          totalActiveCountKLCC += 1;
        }
        else if (isTTDIMember && isActiveMemberWithoutFreezeTerminate){
          totalActiveCountTTDI += 1;
        }
        // active for each package
        if(isActiveMemberWithoutFreezeTerminate && isComplimentaryPkg){ // complimentary
          totalActiveCountComplimentary += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='89THMCx0BybpSVJ1J8oz'){ // 6M
          totalActive6MAllAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='BKcaoWGrWKYihS40MpGd'){ // CP290
          totalActiveCP290 += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='DjeVJskpeZDdEGlcUlB1'){ // 6M renewal
          totalActive6MRenewal += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='L6sJtsKG68LpEUH3QeD4'){ // complimentary promo
          totalActiveComplimentaryPromo += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='LNGWNSdm6kf4rz1ihj0i'){ // 3M JanPromo all access
          totalActive3MJanPromoAllAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='TJ7Fiqgrt6EHUhR5Sb2q'){ // monthly all access
          totalActiveMonthlyAllAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='VWEHvdhNVW0zL8ZAeXJX'){ // 12M renewal
          totalActive12TermRenewalSingleAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='WmcQo1XVXehGaxhSNCKa'){ // yearly
          totalActiveYearlySingleAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='ZEDcEHZp3fKeQOkDxCH8'){ // CP180
          totalActiveCP180 += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='aTHIgscCxbwjDD8flTi3'){ // 3M term all access
          totalActive3MTermMembershipAllAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='duz1AkLuin8nOUd7r66L'){ // 6M single access
          totalActive6MSingleAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='dz8SAwq99GWdEvHCKST2'){ // CP210
          totalActiveCP210 += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='eRMTW6cQen6mcTJgKEvy'){ // CP310
          totalActiveCP310 += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='k7As68CqGsFbKZh1Imo4'){ // 3M Jan2020 Promo (Single Club)
          totalActive3MJan2020PromoSingleAcces += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='q7SXXNKv83MkkJs8Ql0n'){ // 12m Term (All Clubs)
          totalActive12TermYearlyAllAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='vf2jCUOEeDDiIQ0S42BJ'){ // monthly single access
          totalActiveMonthlySingleAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='w12J3n9Qs6LTViI6HaEY'){ // 3M Jan2020 Promo (Single Club).
          totalActive3MJanPromoSingleAccess += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='wpUO5vxWmme7KITqSITo'){ // CP230
          totalActiveCP230 += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate && packageId && packageId==='yQFACCzpS4DKcDyYftBx'){ // 3M Term Membership
          totalActive3MTermSingle += 1;
        }
        else if (isActiveMemberWithoutFreezeTerminate){
          console.log('freeze without package ', email);
          totalActiveWithoutPkg += 1;
        }

        const isExpiredMember = isExpired && !isTerminatedMember 
          // && (!isComplimentaryPkg || packageId!=='L6sJtsKG68LpEUH3QeD4')
        // for expired member
        if(isExpiredMember && packageId){
          totalExpiredCount += 1;
        }
        if(isKLCCMember && isExpiredMember){
          totalExpiredCountKLCC += 1;
        }
        else if (isTTDIMember && isExpiredMember){
          totalExpiredCountTTDI += 1;
        }
        // active for each package
        if(isExpiredMember && isComplimentaryPkg){ // complimentary
          totalExpiredCountComplimentary += 1;
        }
        else if (isExpiredMember && packageId && packageId==='89THMCx0BybpSVJ1J8oz'){ // 6M
          totalExpired6MAllAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='BKcaoWGrWKYihS40MpGd'){ // CP290
          totalExpiredCP290 += 1;
        }
        else if (isExpiredMember && packageId && packageId==='DjeVJskpeZDdEGlcUlB1'){ // 6M renewal
          totalExpired6MRenewal += 1;
        }
        else if (isExpiredMember && packageId && packageId==='L6sJtsKG68LpEUH3QeD4'){ // complimentary promo
          totalExpiredComplimentaryPromo += 1;
        }
        else if (isExpiredMember && packageId && packageId==='LNGWNSdm6kf4rz1ihj0i'){ // 3M JanPromo all access
          totalExpired3MJanPromoAllAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='TJ7Fiqgrt6EHUhR5Sb2q'){ // monthly all access
          totalExpiredMonthlyAllAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='VWEHvdhNVW0zL8ZAeXJX'){ // 12M renewal
          totalExpired12TermRenewalSingleAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='WmcQo1XVXehGaxhSNCKa'){ // yearly
          totalExpiredYearlySingleAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='ZEDcEHZp3fKeQOkDxCH8'){ // CP180
          totalExpiredCP180 += 1;
        }
        else if (isExpiredMember && packageId && packageId==='aTHIgscCxbwjDD8flTi3'){ // 3M term all access
          totalExpired3MTermMembershipAllAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='duz1AkLuin8nOUd7r66L'){ // 6M single access
          totalExpired6MSingleAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='dz8SAwq99GWdEvHCKST2'){ // CP210
          totalExpiredCP210 += 1;
        }
        else if (isExpiredMember && packageId && packageId==='eRMTW6cQen6mcTJgKEvy'){ // CP310
          totalExpiredCP310 += 1;
        }
        else if (isExpiredMember && packageId && packageId==='k7As68CqGsFbKZh1Imo4'){ // 3M Jan2020 Promo (Single Club)
          totalExpired3MJan2020PromoSingleAcces += 1;
        }
        else if (isExpiredMember && packageId && packageId==='q7SXXNKv83MkkJs8Ql0n'){ // 12m Term (All Clubs)
          totalExpired12TermYearlyAllAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='vf2jCUOEeDDiIQ0S42BJ'){ // monthly single access
          totalExpiredMonthlySingleAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='w12J3n9Qs6LTViI6HaEY'){ // 3M Jan2020 Promo (Single Club).
          totalExpired3MJanPromoSingleAccess += 1;
        }
        else if (isExpiredMember && packageId && packageId==='wpUO5vxWmme7KITqSITo'){ // CP230
          totalExpiredCP230 += 1;
        }
        else if (isExpiredMember && packageId && packageId==='yQFACCzpS4DKcDyYftBx'){ // 3M Term Membership
          totalExpired3MTermSingle += 1;
        }
        else if (isExpiredMember){
          console.log('freeze without package ', email);
          totalExpiredWithoutPkg += 1;
        }
      }
    });

    const getSheetPromise = getGoogleSheetPromise({
      spreadsheetId: CONFIG_SHEET_ID,
      range: `AUTO MEMBER REPORT COUNT!A2:DT`,
    });
    
    return getSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      const values = result && result.values;
      const rowsCount = (values && values.length)? values.length:0;
      
      sheetReport = [[
        rowsCount + 1,
        startOfMonth.clone().format('YYYYMMDD'),
        allUsersCount,
        allUsersWithCreatedAtCount,
        allRegisteredUserCount,
        // visitorCountKLCC, 
        // visitorCountTTDI,
        // visitorCount,
        totalVisitorTier1Count,
        totalVisitorTier2Count,
        totalVisitorCount,
        complimentaryCount,
        // for termination
        totalCancel,
        totalCancelCountKLCC,
        totalCancelCountTTDI,
        totalCancelComplimentary,
        totalCancelMonthlyAllAccess,
        totalCancelMonthlySingleAccess,
        totalCancel6MAllAccess,
        totalCancelCP290,
        totalCancel6MRenewal,
        totalCancelComplimentaryPromo,
        totalCancel3MJanPromoAllAccess,
        totalCancel12TermRenewalSingleAccess,
        totalCancelYearlySingleAccess,
        totalCancelCP180,
        totalCancel3MTermMembershipAllAccess,
        totalCancel6MSingleAccess,
        totalCancelCP210,
        totalCancelCP310,
        totalCancel3MJanPromoSingleAccess,
        totalCancel12TermYearlyAllAccess,
        totalCancel3MJan2020PromoSingleAcces,
        totalCancelCP230,
        totalCancel3MTermSingle,
        totalCancelWithoutPkg,

        // for freeze
        totalFreezeCount,
        totalFreezeCountKLCC,
        totalFreezeCountTTDI,
        totalFreezeCountComplimentary,
        totalFreezeMonthlyAllAccess,
        totalFreezeMonthlySingleAccess,
        totalFreeze6MAllAccess,
        totalFreezeCP290,
        totalFreeze6MRenewal,
        totalFreezeComplimentaryPromo,
        totalFreeze3MJanPromoAllAccess,
        totalFreeze12TermRenewalSingleAccess,
        totalFreezeYearlySingleAccess,
        totalFreezeCP180,
        totalFreeze3MTermMembershipAllAccess,
        totalFreeze6MSingleAccess,
        totalFreezeCP210,
        totalFreezeCP310,
        totalFreeze3MJanPromoSingleAccess,
        totalFreeze12TermYearlyAllAccess,
        totalFreeze3MJan2020PromoSingleAcces,
        totalFreezeCP230,
        totalFreeze3MTermSingle,
        totalFreezeWithoutPkg,

        // for active
        totalActiveCount,
        totalActiveCountKLCC,
        totalActiveCountTTDI,
        totalActiveCountComplimentary,
        totalActiveMonthlyAllAccess,
        totalActiveMonthlySingleAccess,
        totalActive6MAllAccess,
        totalActiveCP290,
        totalActive6MRenewal,
        totalActiveComplimentaryPromo,
        totalActive3MJanPromoAllAccess,
        totalActive12TermRenewalSingleAccess,
        totalActiveYearlySingleAccess,
        totalActiveCP180,
        totalActive3MTermMembershipAllAccess,
        totalActive6MSingleAccess,
        totalActiveCP210,
        totalActiveCP310,
        totalActive3MJanPromoSingleAccess,
        totalActive12TermYearlyAllAccess,
        totalActive3MJan2020PromoSingleAcces,
        totalActiveCP230,
        totalActive3MTermSingle,
        totalActiveWithoutPkg,

        // for expired
        totalExpiredCount,
        totalExpiredCountKLCC,
        totalExpiredCountTTDI,
        totalExpiredCountComplimentary,
        totalExpiredMonthlyAllAccess,
        totalExpiredMonthlySingleAccess,
        totalExpired6MAllAccess,
        totalExpiredCP290,
        totalExpired6MRenewal,
        totalExpiredComplimentaryPromo,
        totalExpired3MJanPromoAllAccess,
        totalExpired12TermRenewalSingleAccess,
        totalExpiredYearlySingleAccess,
        totalExpiredCP180,
        totalExpired3MTermMembershipAllAccess,
        totalExpired6MSingleAccess,
        totalExpiredCP210,
        totalExpiredCP310,
        totalExpired3MJanPromoSingleAccess,
        totalExpired12TermYearlyAllAccess,
        totalExpired3MJan2020PromoSingleAcces,
        totalExpiredCP230,
        totalExpired3MTermSingle,
        totalExpiredWithoutPkg,
        
      ]];
      
      console.log('sheetReport: ', sheetReport);

      const updateSheetPromise = updateGoogleSheet({
        spreadsheetId: CONFIG_SHEET_ID,
        // valueInputOption: 'RAW',
        
        resource: {
          // How the input data should be interpreted.
          valueInputOption: 'RAW',  // TODO: Update placeholder value.
    
          // The new values to apply to the spreadsheet.
          data: [
            {
              range: `AUTO MEMBER REPORT COUNT!A${rowsCount+2}:DT`,
              majorDimension: "ROWS",
              values: sheetReport
            }
          ],  
        },

      });

      return updateSheetPromise.then((result)=>{
        // console.log('theresult: ', result);
        return res.status(200).send({
          success:true,
          data: 'data',
          sheetReport
        
        });
      });
    });
  });
});

// function add class to firebase
exports.addClass = functions.https.onCall((data, context) => {

  const name = data.name;
  const description = data.description;
  const instructorName = data.instructorName;
  const maxCapacity = data.maxCapacity;
  const venue = data.venue;
  const classDuration = data.classDuration;
  const availableDate = data.availableDate;
  const classDate = data.classDate;
  const expiredDate = data.expiredDate;
  const vendProductId = data.vendProductId;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  if(!name || !description || !instructorName || !maxCapacity || !venue || !classDuration
    || !availableDate || !classDate || !expiredDate || !vendProductId
    ){
    console.log('Missing data', name, description, instructorName, maxCapacity, venue, classDuration);
    return Promise.resolve();
  }

  console.log('Adding class...', name);
  const classDetails = {
    createdAt : timestamp,
    active:true,
    name, description, instructorName, maxCapacity, venue, classDuration, vendProductId,	
    availableDate: admin.firestore.Timestamp.fromDate(availableDate),
    classDate: admin.firestore.Timestamp.fromDate(classDate),
    expiredDate: admin.firestore.Timestamp.fromDate(expiredDate),
  }

  return admin.firestore().collection('classes').add(classDetails).then(classRef=>{
    return classRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

exports.addInvoiceForMembership = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const icNumber = data.icnumber;
  const refSource = data.refSource;
  const postcode = data.postcode;
  const mcId = data.mcId;
  const vendProductIds = data.vendProductIds;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  const userData = {
    createdAt:timestamp,
    email,
    name,
    phone,
    icNumber,
    refSource,
    postcode,
    mcId,
  }

  if(!email || (!vendProductIds) || (vendProductIds && !(Object.keys(vendProductIds).length > 0))){
    console.log('Missing data', email, name, phone, vendProductIds);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductIds);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  var vendQueryPromises = [];
  Object.keys(vendProductIds).forEach(vid=>{
    const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vid).get();
    vendQueryPromises.push(vendQueryPromise);
  });

  var userRef = null;

  return userQueryPromise.then(userResult=>{
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      return admin.firestore().collection('users').add(userData);
    }else{
      const userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      return Promise.resolve(userRef);
    }
  }).then(user=>{
    userRef = user;
    console.log('Adding invoice for user', userRef.id);
    return Promise.all(vendQueryPromises);

  }).then(vendResults=>{

    var sumTotalPrice = 0;
    var vendProducts = [];
    vendResults.forEach(vendDoc=>{
      if(vendDoc.exists){
        const id = vendDoc.id;
        const vendProductData = vendDoc.data();
        const vendProductName = vendProductData.name;
        const vendSupplyPrice = vendProductData.supply_price;
        const vendPriceBookPrice = vendProductData.price_book_entries && vendProductData.price_book_entries.length > 0 && vendProductData.price_book_entries[0].price;
        const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
        const unitPrice = parseInt(vendPriceAmount);
        const quantity = vendProductIds[id];
        const totalPrice = unitPrice*quantity;
        vendProducts.push({vendProductId:id, vendProductName, quantity, unitPrice, totalPrice});
        sumTotalPrice += totalPrice;
      }
    });

    var amount = `${sumTotalPrice}00`;
    const concatLength = 12-amount.length;
    for (var i = 0; i < concatLength; i++) {
      amount = '0'.concat(amount);
    }

    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      totalPrice : `${sumTotalPrice}`,
      amount : amount,
      receiptMailed : false,
      type : 'membership',
      vendProducts: vendProducts,
      hasSST : true
    }

    console.log('Adding invoice', invoiceData);

    return admin.firestore().collection('invoices').add(invoiceData);
  }).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// add invoice for freeze v2
exports.addInvoiceForFreezeMembershipv2 = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const vendProductId = data.vendProductId;
  var vendProductName, sstTax = 0;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  if(!email || !vendProductId){
    console.log('Missing data', email, name, vendProductId);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
 
  var userRef = null;

  return userQueryPromise.then(userResult=>{
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name);
      return Promise.resolve();
      // return admin.firestore().collection('users').add(userData);
    }else{
      const userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      return Promise.resolve(userRef);
    }
  }).then(user=>{
    userRef = user;
    console.log('Adding invoice for user', userRef.id);
    return Promise.all(vendQueryPromise);

  }).then(vendResults=>{

    var unitPrice = 0;
    var sumTotalPrice = 0;
    var vendProducts = [];
    vendResults.forEach(vendDoc=>{
      if(vendDoc.exists){
        const id = vendDoc.id;
        const vendProductData = vendDoc.data();
        vendProductName = vendProductData.name;
        const vendSupplyPrice = vendProductData.supply_price;
        const vendPriceBookPrice = vendProductData.price_book_entries && vendProductData.price_book_entries.length > 0 && vendProductData.price_book_entries[0].price;
        const vendPriceAmount = vendSupplyPrice;
        unitPrice = parseFloat(vendPriceAmount).toFixed(2);
        const quantity = 1; // hardcode
        const sstTax = parseFloat((unitPrice*quantity)*0.06).toFixed(2);
        console.log('sstTax: ', sstTax);
        const totalPrice = (unitPrice*quantity + sstTax);
        vendProducts.push({vendProductId:id, vendProductName, quantity, unitPrice, totalPrice});
        // vendProductId = id;
        sumTotalPrice += totalPrice;
      }
    });

    console.log('sumTotalPrice: ', sumTotalPrice);

    var amount = sumTotalPrice.toString().includes('.')? `${sumTotalPrice.toString().split('.').join("")}0`:`${sumTotalPrice}00`;
    const concatLength = 12-amount.length;
    for (var i = 0; i < concatLength; i++) {
      amount = '0'.concat(amount);
    }

    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      totalPrice : `${sumTotalPrice}`,
      amount : amount,
      receiptMailed : false,
      type : 'membership',
      vendProducts: vendProducts,
      vendProductId,
      vendProductName,
      unitPrice,
      tax:sstTax,
      withSST:true
    }

    console.log('Adding invoice', invoiceData);

    return admin.firestore().collection('invoices').add(invoiceData);
  }).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// amount with SST
exports.addInvoiceForMembershipv2 = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const icNumber = data.icnumber;
  const refSource = data.refSource;
  const postcode = data.postcode;
  const mcId = data.mcId;
  const vendProductIds = data.vendProductIds;
  const promoType = data.promoType;
  var vendProductId, vendProductName, sstTax = 0;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  const vAug20SingleAccess = '83d318ff-64ab-3cc8-9ba4-98f740bc48f2';
  const vAug20AllAccess = '211aad2d-0a2a-fdc7-d79a-7eabc28d5994';
  const vSep20AllAccess = 'e4c23eae-4a4d-9191-f92f-98afe0e3dd08';

  const vMidSep20SingleAccess = 'e456b524-4689-49eb-808a-08b9a3700aa3';
  const vMidSep20AllAccess = 'e1611259-cb7b-1854-df22-2f9a672233ba';

  const userData = {
    createdAt:timestamp,
    joinDate:timestamp,
    email,
    name,
    phone,
    icNumber,
    refSource,
    postcode,
    mcId,
  }

  if(!email || (!vendProductIds) || (vendProductIds && !(Object.keys(vendProductIds).length > 0))){
    console.log('Missing data', email, name, phone, vendProductIds);
    return Promise.resolve();
  }

  if (promoType){
    userData.createdFrom = promoType;
    if (promoType === 'aug2020'){
      userData.promoAug2020 = 0; 
    userData.promoAug2020 = 0; 
      userData.promoAug2020 = 0; 
    }
    else if (promoType === 'sep2020'){
      userData.promoSep2020 = 0;
    userData.promoSep2020 = 0; 
      userData.promoSep2020 = 0;
    }
    else if (promoType === 'midSep2020'){
      userData.promoMidSep2020 = 0;
    }
  }

  console.log('Adding invoice...', email, name, phone, vendProductIds);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  var vendQueryPromises = [];
  Object.keys(vendProductIds).forEach(vid=>{
    const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vid).get();
    vendQueryPromises.push(vendQueryPromise);
  });

  var userRef = null;

  return userQueryPromise.then(userResult=>{
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      return admin.firestore().collection('users').add(userData);
    }
    else{
      const userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      return Promise.resolve(userRef);
    }
  }).then(user=>{
    userRef = user;
    console.log('Adding invoice for user', userRef.id);
    return Promise.all(vendQueryPromises);

  }).then(vendResults=>{

    var sumTotalPrice = 0;
    var vendProducts = [];
    vendResults.forEach(vendDoc=>{
      if(vendDoc.exists){
        const id = vendDoc.id;

        const vendProductData = vendDoc.data();
        console.log('vendProductData: ', vendProductData);
        vendProductName = vendProductData && vendProductData.name;
        const vendSupplyPrice = vendProductData.supply_price;
        // const vendPriceBookPrice = vendProductData.price_book_entries && vendProductData.price_book_entries.length > 0 && vendProductData.price_book_entries[0].price;
        //const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
        const unitPrice = vendSupplyPrice;
        const quantity = vendProductIds[id];
        const sstTax = unitPrice*quantity*0.06;
        // console.log('sstTax: ', sstTax);

        const totalPrice = parseFloat(unitPrice*quantity + sstTax).toFixed(2);
        vendProducts.push({vendProductId:id, vendProductName, quantity, unitPrice, totalPrice});
        vendProductId = id;
        sumTotalPrice += totalPrice;
      }
    });

    // var optionsEdit = vendGetProductDetails(vendProductRef.id);
    // return rp2(optionsEdit).then(function (res){
    //   console.log('optionEditRes: ', res);

    //   const data = res && res.data;
    //   const priceWithTax = data && data.price_including_tax;
    //   const priceWithoutTax = data && data.price_excluding_tax;
    //   const tax = priceWithTax - priceWithoutTax;
    //   const unitPrice = priceWithTax || parseInt(vendProductData.supply_price);

    //   const quantity = 1
    //   const totalPrice = priceWithTax*quantity;
    //   amount = `${totalPrice*100}`;
    //   const concatLength = 12-amount.length;
    //   for (var i = 0; i < concatLength; i++) {
    //     amount = '0'.concat(amount);
    //   }
    //   //add invoice
    //   const invoiceData = {
    //     createdAt : timestamp,
    //     packageId : null,
    //     paid : false,
    //     paymentFailed : false,
    //     paymentId : null,
    //     userId : userRef.id,
    //     unitPrice : `${unitPrice}`,
    //     totalPrice : `${totalPrice}`,
    //     amount : amount,
    //     tax: parseFloat(tax).toFixed(2),
    //     quantity : quantity,
    //     receiptMailed : false,
    //     type : 'onlinemywellness',
    //     selectedDay,
    //     selectedAMPM,
    //     trainerName,
    //     coachName,
    //     ighandleName,
    //     phone,
    //     vendProductId : vendProductRef.id,
    //     vendProductName : vendProductData.name,
    //     withSST:true,
    //     // hasSST:true
    //   }
    //   console.log('invoiceData: ', invoiceData);
    //   invoiceRef = admin.firestore().collection('invoices').doc();
    //   batch.set(invoiceRef, invoiceData);
    //   return batch.commit();

    // })

    console.log('sumTotalPrice: ', sumTotalPrice);

    var amount = get12StringAmount(sumTotalPrice);

    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      totalPrice : `${sumTotalPrice}`,
      amount : amount,
      receiptMailed : false,
      type : 'membership',
      vendProducts: vendProducts,
      vendProductId,
      vendProductName,
      tax:sstTax,
      withSST:true,
    }

    console.log('Adding invoice', invoiceData);

    if (promoType){
      invoiceData.promoType = promoType;
      invoiceData.isPromo = true;
      if (promoType==='sep2020'){
        invoiceData.packageId = 'uQO2UsaRiqXtzPKjTSIS'; //packageId for september 2020 (all access)
      }
      if(vendProductId === vAug20SingleAccess){
        invoiceData.packageId = 'AHgEEavKwpJoGTMOzUdX'; //packageId for August 2020 (single access)
      }
      else if (vendProductId === vAug20AllAccess){
        invoiceData.packageId = 'YsOxVJGLRXrHDgNTBach'; //packageId for August 2020 (all access)
      }
      else if (vendProductId === vMidSep20SingleAccess){
        invoiceData.packageId = 'hUZjGJR77bP30I3fjvwD'; //packageId for mid september 2020 (single access)
      }
      else if (vendProductId === vMidSep20AllAccess){
        invoiceData.packageId = 'kh513XOaG7eLX4z9G0Ft'; //packageId for mid september 2020 (all access)
      }
    }

    return admin.firestore().collection('invoices').add(invoiceData);
  }).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

exports.addInvoiceForProducts = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductIds = data.vendProductIds;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  if(!email || (!vendProductIds) || (vendProductIds && !(Object.keys(vendProductIds).length > 0))){
    console.log('Missing data', email, name, phone, vendProductIds);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductIds);

  const userData = {
    createdAt:timestamp,
    email, phone, name
  }
  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  var vendQueryPromises = [];
  Object.keys(vendProductIds).forEach(vid=>{
    const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vid).get();
    vendQueryPromises.push(vendQueryPromise);
  });

  var userRef = null;

  return userQueryPromise.then(userResult=>{
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);

      return admin.firestore().collection('users').add(userData);
    }else{
      const userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());

      return Promise.resolve(userRef);
    }
  }).then(user=>{

    userRef = user;

    console.log('Adding invoice for user', userRef.id);

    return Promise.all(vendQueryPromises);

  }).then(vendResults=>{

    var sumTotalPrice = 0;
    var vendProducts = [];
    vendResults.forEach(vendDoc=>{
      if(vendDoc.exists){
        const id = vendDoc.id;
        const vendProductData = vendDoc.data();
        const vendProductName = vendProductData.name;
        const vendSupplyPrice = vendProductData.supply_price;
        const vendPriceBookPrice = vendProductData.price_book_entries && vendProductData.price_book_entries.length > 0 && vendProductData.price_book_entries[0].price;
        const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
        const unitPrice = parseInt(vendPriceAmount);
        const quantity = vendProductIds[id];
        const totalPrice = unitPrice*quantity;
        vendProducts.push({vendProductId:id, vendProductName, quantity, unitPrice, totalPrice});
        sumTotalPrice += totalPrice;
      }
      else{
        console.log('vendDoc not exist');
        return Promise.resolve();
      }
    });

    var amount = `${sumTotalPrice}00`;
    const concatLength = 12-amount.length;
    for (var i = 0; i < concatLength; i++) {
      amount = '0'.concat(amount);
    }

    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      totalPrice : `${sumTotalPrice}`,
      amount : amount,
      receiptMailed : false,
      type : 'product',
      vendProducts: vendProducts,
      hasSST : true
    }

    console.log('Adding invoice', invoiceData);

    return admin.firestore().collection('invoices').add(invoiceData);
  }).then(invoiceRef=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// add invoice for online mywellness
exports.addInvoiceForVWellness = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductId = data.vendProductId;
  const trainerName = data.selectedTrainer;
  const ighandleName = data.ighandlename;
  const coachName = data.selectedCoach;
  const selectedAMPM = data.selectedAMPM;
  const selectedDay = data.selectedDay;
  // console.log('data: ', data);

  if(!email || !vendProductId || !name || !trainerName || !phone || !ighandleName || !coachName || !selectedAMPM || !selectedDay){
    console.log('Missing data', email, name, phone, vendProductId, trainerName);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {createdAt:timestamp, email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    var rp2 = require('request-promise');
    var optionsEdit = vendGetProductDetails(vendProductRef.id);
    return rp2(optionsEdit).then(function (res){
      console.log('optionEditRes: ', res);

      const data = res && res.data;
      const priceWithTax = data && data.price_including_tax;
      const priceWithoutTax = data && data.price_excluding_tax;
      const tax = priceWithTax - priceWithoutTax;
      const unitPrice = priceWithTax || parseInt(vendProductData.supply_price);

      const quantity = 1
      const totalPrice = priceWithTax*quantity;
      const amount = get12StringAmount(totalPrice);
      //add invoice
      const invoiceData = {
        createdAt : timestamp,
        packageId : null,
        paid : false,
        paymentFailed : false,
        paymentId : null,
        userId : userRef.id,
        unitPrice : `${unitPrice}`,
        totalPrice : `${totalPrice}`,
        amount : amount,
        tax: parseFloat(tax).toFixed(2),
        quantity : quantity,
        receiptMailed : false,
        type : 'onlinemywellness',
        selectedDay,
        selectedAMPM,
        trainerName,
        coachName,
        ighandleName,
        phone,
        vendProductId : vendProductRef.id,
        vendProductName : vendProductData.name,
        withSST:true,
        // hasSST:true
      }
      console.log('invoiceData: ', invoiceData);
      invoiceRef = admin.firestore().collection('invoices').doc();
      batch.set(invoiceRef, invoiceData);
      return batch.commit();

    }).catch(function (err){
      console.log('error getting vend product: ', err);
      return Promise.resolve();
    });
  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// create invoice for virtual trainer
// exports.addInvoiceForProductVT = functions.region('asia-east2').https.onCall((data, context) => {
exports.addInvoiceForProductVT = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductId = data.vendProductId;
  const trainerName = data.trainerName;
  const selectedAMPM = data.selectedAMPM;
  const selectedDay = data.selectedDay;

  // console.log('data: ', data);

  if(!email || !vendProductId || !trainerName){
    console.log('Missing data', email, name, phone, vendProductId, trainerName);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {createdAt:timestamp, email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

  console.log('Adding invoice for user and product', userRef.id, vendProductData);
  
  var rp2 = require('request-promise');
  var optionsEdit = vendGetProductDetails(vendProductRef.id);
    return rp2(optionsEdit).then(function (res){
      console.log('optionEditRes: ', res);

      const data = res && res.data;
      const priceWithTax = data && data.price_including_tax;
      const priceWithoutTax = data && data.price_excluding_tax;
      const tax = priceWithTax - priceWithoutTax;
      const unitPrice = parseInt(vendProductData.supply_price) || priceWithTax;

      const quantity = 1
      const totalPrice = priceWithTax*quantity;
      const amount = get12StringAmount(totalPrice);
      //add invoice
      const invoiceData = {
        createdAt : timestamp,
        packageId : null,
        paid : false,
        paymentFailed : false,
        paymentId : null,
        userId : userRef.id,
        unitPrice : `${unitPrice}`,
        totalPrice : `${totalPrice}`,
        amount : amount,
        tax: parseFloat(tax).toFixed(2),
        quantity : quantity,
        receiptMailed : false,
        type : 'virtualTraining',
        selectedDay,
        selectedAMPM,
        trainerName,
        vendProductId : vendProductRef.id,
        vendProductName : vendProductData.name,
        withSST:true,
        // hasSST:true
      }
      console.log('invoiceData: ', invoiceData);
      invoiceRef = admin.firestore().collection('invoices').doc();
      batch.set(invoiceRef, invoiceData);
      return batch.commit();

    }).catch(function (err){
      console.log('error getting vend product: ', err);
      return Promise.resolve();
    });
  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

exports.addInvoiceForProductVClass = functions.https.onCall((data, context) => {
  
  const name = data.name;
  const ighandlename = data.ighandlename;
  const email = data.email;
  const phone = data.phone;
  const city = data.city;
  const selectedMemberOption = data.selectedMemberOption;
  const vendProductId = data.vendProductId;

  // console.log('data: ', data);

  if(!name || !email || !phone || !city || !selectedMemberOption || !vendProductId || !ighandlename ){
    console.log('Missing data', email, name, phone, vendProductId);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {createdAt:timestamp, email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    var rp2 = require('request-promise');
    var optionsEdit = vendGetProductDetails(vendProductRef.id);
    return rp2(optionsEdit).then(function (res){
      console.log('optionEditRes: ', res);

      const data = res && res.data;
      const priceWithTax = data && data.price_including_tax;
      const priceWithoutTax = data && data.price_excluding_tax;
      const tax = priceWithTax - priceWithoutTax;
      const unitPrice = parseInt(vendProductData.supply_price) || priceWithTax;

      const quantity = 1
      const totalPrice = priceWithTax*quantity;
      const amount = get12StringAmount(totalPrice);
      //add invoice
      const invoiceData = {
        createdAt : timestamp,
        packageId : null,
        paid : false,
        paymentFailed : false,
        paymentId : null,
        userId : userRef.id,
        unitPrice : `${unitPrice}`,
        totalPrice : `${totalPrice}`,
        tax:tax.toFixed(2),
        amount : amount,
        quantity : quantity,
        receiptMailed : false,
        type : 'virtualClass',
        ighandlename,
        phone,
        city,
        selectedMemberOption,
        vendProductId : vendProductRef.id,
        vendProductName : vendProductData.name,
        withSST:true,
        // hasSST:true
      }
      invoiceRef = admin.firestore().collection('invoices').doc();
      batch.set(invoiceRef, invoiceData);
      return batch.commit();

    }).catch(function (err){
      console.log('error getting vend product: ', err);
      return Promise.resolve();
    })
  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// create invoice for babel dance
exports.addInvoiceForBabelDance = functions.https.onCall((data, context) => {
  
  const name = data.name;
  const ighandlename = data.ighandleName;
  const email = data.email;
  const phone = data.phone;
  const city = data.city;
  const classDate = data.classDate;
  const classTime = data.classTime;
  const classRemark = data.classRemark;
  const selectedMemberOption = data.selectedMemberOption;
  const instructorName = data.instructorName;
  const vendProductId = data.vendProductId;
  const classId = data.classId;
  const classType = data.classType;

  console.log('data: ', data);

  if(!name || !email || !phone || !city || !vendProductId || !ighandlename ){
    console.log('Missing data', email, name, phone, vendProductId);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  const dancePaymentQueryPromise = admin.firestore().collection('payments').where('classType', '==', 'outdoor').get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {createdAt:timestamp, email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise, dancePaymentQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    var rp2 = require('request-promise');
    var optionsEdit = vendGetProductDetails(vendProductRef.id);
    return rp2(optionsEdit).then(function (res){
      console.log('optionEditRes: ', res);

      const data = res && res.data;
      const priceWithTax = data && data.price_including_tax;
      const priceWithoutTax = data && data.price_excluding_tax;
      const tax = priceWithTax - priceWithoutTax;
      const unitPrice = parseInt(vendProductData.supply_price) || priceWithTax;
      const is_active = data && data.is_active;

      if (!is_active){
        return Promise.resolve();
      }
      const quantity = 1
      const totalPrice = priceWithTax*quantity;
      const amount = get12StringAmount(totalPrice);
      //add invoice
      const invoiceData = {
        createdAt : timestamp,
        packageId : null,
        paid : false,
        paymentFailed : false,
        paymentId : null,
        userId : userRef.id,
        unitPrice : `${unitPrice}`,
        totalPrice : `${totalPrice}`,
        tax:tax.toFixed(2),
        amount : amount,
        quantity : quantity,
        receiptMailed : false,
        type : 'babelDance',
        vendProductId : vendProductRef.id,
        vendProductName : vendProductData.name,
        withSST:true,
        ighandlename,
        phone,
        city,
        instructorName,
        classDate,
        classTime,
        classRemark,
        selectedMemberOption,
        classId,
        classType
      }
      invoiceRef = admin.firestore().collection('invoices').doc();
      batch.set(invoiceRef, invoiceData);
      return batch.commit();
      // return Promise.resolve();
    }).catch(function (err){
      console.log('error getting vend product: ', err);
    });

    // const unitPrice = parseInt(vendProductData.supply_price);

    // const quantity = 1
    // const totalPrice = unitPrice*quantity;
    // amount = `${totalPrice}00`;
    // const concatLength = 12-amount.length;
    // for (var i = 0; i < concatLength; i++) {
    //   amount = '0'.concat(amount);
    // }
    // //add invoice
    // const invoiceData = {
    //   createdAt : timestamp,
    //   packageId : null,
    //   paid : false,
    //   paymentFailed : false,
    //   paymentId : null,
    //   userId : userRef.id,
    //   unitPrice : `${unitPrice}`,
    //   totalPrice : `${totalPrice}`,
    //   amount : amount,
    //   quantity : quantity,
    //   receiptMailed : false,
    //   type : 'babelDance',
    //   ighandlename,
    //   phone,
    //   city,
    //   instructorName,
    //   classDate,
    //   classTime,
    //   classRemark,
    //   selectedMemberOption,
    //   vendProductId : vendProductRef.id,
    //   vendProductName : vendProductData.name,
    //   hasSST:true
    // }
    // invoiceRef = admin.firestore().collection('invoices').doc();
    // batch.set(invoiceRef, invoiceData);
    // return batch.commit();

  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// create invoice for personal trainer v2
exports.addInvoiceForPersonalTraining = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const userId = data.userId;
  const vendProductId = data.vendProductId;
  const ptType = data.ptType? data.ptType:'limited';
  // const selectedTime = data.selectedTime;
  // const selectedAppointType = data.selectedAppointType;
  const credit = data.credit? data.credit:5;

  // console.log('data: ', data);

  if(!email || !vendProductId || !userId){
    console.log('Missing data', email, name, vendProductId);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {createdAt:timestamp, email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    const unitPrice = parseInt(vendProductData.supply_price);
    const quantity = 1
    const totalPrice = unitPrice*quantity;

    const amount = get12StringAmount(totalPrice);
    
    //add invoice
    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      unitPrice : `${unitPrice}`,
      totalPrice : `${totalPrice}`,
      amount : amount,
      quantity : quantity,
      receiptMailed : false,
      type : 'personalTraining',
      ptType, 
      // selectedTime,
      // appointmentType:selectedAppointType.id,
      // appoinmentName:selectedAppointType.name,
      // appoinmentScheduleUrl:selectedAppointType.schedulingUrl,
      vendProductId : vendProductRef.id,
      // calendarId: selectedAppointType.calendarIDs,
      vendProductName : vendProductData.name,
      hasSST:true,
      credit
    }
    invoiceRef = admin.firestore().collection('invoices').doc();
    batch.set(invoiceRef, invoiceData);
    return batch.commit();

  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// create invoice for personal trainer
exports.addInvoiceForProductPT = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductId = data.vendProductId;
  const selectedTime = data.selectedTime;
  const selectedAppointType = data.selectedAppointType;
  const credit = data.credit? data.credit:5;

  // console.log('data: ', data);

  if(!email || !vendProductId || !selectedAppointType || !selectedTime){
    console.log('Missing data', email, name, phone, vendProductId, selectedAppointType, selectedTime);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId, selectedAppointType, selectedTime);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    console.log('vendProductRef: ', vendProductRef);
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());
      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    const unitPrice = parseInt(vendProductData.supply_price);
    const quantity = 1
    const totalPrice = unitPrice*quantity;
    const amount = get12StringAmount(totalPrice);
    //add invoice
    const invoiceData = {
      createdAt : timestamp,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      unitPrice : `${unitPrice}`,
      totalPrice : `${totalPrice}`,
      amount : amount,
      quantity : quantity,
      receiptMailed : false,
      type : 'personalTraining',
      selectedTime,
      appointmentType:selectedAppointType.id,
      appoinmentName:selectedAppointType.name,
      appoinmentScheduleUrl:selectedAppointType.schedulingUrl,
      vendProductId : vendProductRef.id,
      calendarId: selectedAppointType.calendarIDs,
      vendProductName : vendProductData.name,
      hasSST:true,
      credit
    }
    invoiceRef = admin.firestore().collection('invoices').doc();
    batch.set(invoiceRef, invoiceData);
    return batch.commit();

  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

exports.addInvoiceForProduct = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductId = data.vendProductId;
   // for rm20 class
   const danceClassRemark = data.danceClassRemark||null;
   const ighandlename = data.ighandlename||null;

   // console.log('danceClassRemark: ', danceClassRemark);

  if(!email || !vendProductId){
    console.log('Missing data', email, name, phone, vendProductId);
    return Promise.resolve();
  }

  // add in temporarily. if the user doesnt clear the cache, he/she still can make payment from the app, disable it
  if (vendProductId === '51a1f440-45c3-d544-eba1-de1f28ed5e64'){
    console.log('vend product is no longer available');
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  var vendProductRef = null;
  var vendProductData = null;
  var userData = {email, name, phone};

  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    vendProductData = vendProductRef && vendProductRef.data();
    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());

      // return Promise.resolve(userRef);
    }

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    const unitPrice = parseInt(vendProductData.supply_price);
    const quantity = 1
    const totalPrice = unitPrice*quantity;
    const amount = get12StringAmount(totalPrice);
    //add invoice
    const invoiceData = {
      createdAt : timestamp,
      packageId : null,
      paid : false,
      paymentFailed : false,
      paymentId : null,
      userId : userRef.id,
      unitPrice : `${unitPrice}`,
      totalPrice : `${totalPrice}`,
      amount : amount,
      quantity : quantity,
      receiptMailed : false,
      type : 'product',
      vendProductId : vendProductRef.id,
      vendProductName : vendProductData.name,
      hasSST:true
    }
    if (danceClassRemark){
      invoiceData.danceClassRemark = danceClassRemark;
      invoiceData.phone = phone;
      invoiceData.ighandlename = ighandlename;
    }
    invoiceRef = admin.firestore().collection('invoices').doc();
    batch.set(invoiceRef, invoiceData);
    return batch.commit();

  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// add invoice for product v2
exports.addInvoiceForProductv2 = functions.https.onCall((data, context) => {
  const email = data.email;
  const name = data.name;
  const phone = data.phone;
  const vendProductId = data.vendProductId;
   // console.log('danceClassRemark: ', danceClassRemark);
   console.log('addInvoiceForProductv2 data: ', data);

  if(!email || !vendProductId){
    console.log('Missing data', email, name, phone, vendProductId);
    return Promise.resolve();
  }

  console.log('Adding invoice...', email, name, phone, vendProductId);

  const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  const vendQueryPromise = admin.firestore().collection('vendProducts').doc(vendProductId).get();
  const packageQuery = admin.firestore().collection('packages').get();

  var vendProductRef = null;
  var vendProductData = null;
  var userData = {email, name, phone};

  console.log('userData: ', userData);
  const batch = admin.firestore().batch();
  var invoiceRef = null;
  return Promise.all([userQueryPromise, vendQueryPromise, packageQuery]).then(results=>{
    const userResult = results[0];
    vendProductRef = results[1];
    vendProductData = vendProductRef && vendProductRef.data();
    const pkgRes = results[2];

    var userRef = null;
    if(userResult && userResult.docs.length === 0){
      //user doesn't exist so create
      console.log("Adding user...", email, name, phone);
      userRef = admin.firestore().collection('users').doc();
      batch.set(userRef, userData);
      // return Promise.resolve(userRef);
    }else{
      userRef = userResult.docs[0];
      console.log("Found user...", userRef.data());

      // return Promise.resolve(userRef);
    }

    var pkgMap = {};
    var pkgMapByVendProdId = {};
    pkgRes.forEach(doc=>{
      const data = doc.data();
      const vendProductIds = data.vendProductIds;
      if (vendProductIds){
        vendProductIds.forEach(vendId=>{
          pkgMapByVendProdId[vendId]=data;
        })
      }
      pkgMap[doc.id]=doc.data();
    });

    console.log('Adding invoice for user and product', userRef.id, vendProductData);

    var rp2 = require('request-promise');
    var optionsEdit = vendGetProductDetails(vendProductRef.id);
    return rp2(optionsEdit).then(function (res){
      console.log('optionEditRes: ', res);

      const data = res && res.data;
      const priceWithTax = data && data.price_including_tax;
      const priceWithoutTax = data && data.price_excluding_tax;
      const tax = priceWithTax - priceWithoutTax;
      const unitPrice = parseInt(vendProductData.supply_price) || priceWithTax;
      const pkgData = pkgMapByVendProdId[vendProductRef.id];
      console.log('packageName: ', pkgData && pkgData.name);

      const quantity = 1
      const totalPrice = priceWithTax*quantity;

      const amount = get12StringAmount(totalPrice);

      //add invoice
      const invoiceData = {
        createdAt : timestamp,
        packageId : null,
        paid : false,
        paymentFailed : false,
        paymentId : null,
        userId : userRef.id,
        unitPrice : `${unitPrice}`,
        totalPrice : `${totalPrice}`,
        tax:tax.toFixed(2),
        amount : amount,
        quantity : quantity,
        receiptMailed : false,
        // type : 'product',
        type : pkgData? 'membership':'product',
        vendProductId : vendProductRef.id,
        vendProductName : vendProductData.name,
        withSST:true,
        // hasSST:true
      }
      invoiceRef = admin.firestore().collection('invoices').doc();
      batch.set(invoiceRef, invoiceData);
      return batch.commit();

    }).catch(function (err){
      console.log('error getting vend product: ', err);
    });

  }).then(()=>{
    console.log('Added invoice', invoiceRef.id);
    return invoiceRef.id;
  }).catch((error)=>{
    console.log('Error', error.message);
    return Promise.resolve();
  });
});

// add invoice for product v2
// exports.addInvoiceForJoiningnMembershipProduct = functions.https.onCall((data, context) => {
//   const email = data.email;
//   const name = data.name;
//   const phone = data.phone;
//   const vendProductIds = data.vendProductIds;
//    // console.log('danceClassRemark: ', danceClassRemark);
//    console.log('addInvoiceForProductv2 data: ', data);

//   if(!email || !vendProductIds){
//     console.log('Missing data', email, name, phone, vendProductIds);
//     return Promise.resolve();
//   }

//   console.log('Adding invoice...', email, name, phone, vendProductIds);

//   const userQueryPromise = admin.firestore().collection('users').where('email', '==', email).limit(1).get();
  
 
//   var userData = {email, name, phone};

//   console.log('userData: ', userData);
//   const batch = admin.firestore().batch();
//   var invoiceRef = null;
//   return Promise.all([userQueryPromise]).then(results=>{
//     const userResult = results[0];
   
//     var userRef = null;
//     if(userResult && userResult.docs.length === 0){
//       //user doesn't exist so create
//       console.log("Adding user...", email, name, phone);
//       userRef = admin.firestore().collection('users').doc();
//       batch.set(userRef, userData);
//       // return Promise.resolve(userRef);
//     }else{
//       userRef = userResult.docs[0];
//       console.log("Found user...", userRef.data());

//       // return Promise.resolve(userRef);
//     }

//     console.log('Adding invoice for user and product', userRef.id);

//     var rp2 = require('request-promise');
//     var optionsEdit = vendGetProductDetails(vendProductRef.id);
//     return rp2(optionsEdit).then(function (res){
//       console.log('optionEditRes: ', res);

//       const data = res && res.data;
//       const priceWithTax = data && data.price_including_tax;
//       const priceWithoutTax = data && data.price_excluding_tax;
//       const tax = priceWithTax - priceWithoutTax;
//       const unitPrice = parseInt(vendProductData.supply_price) || priceWithTax;

//       const quantity = 1
//       const totalPrice = priceWithTax*quantity;
//       const amount = get12StringAmount(totalPrice);
//       //add invoice
//       const invoiceData = {
//         createdAt : timestamp,
//         packageId : null,
//         paid : false,
//         paymentFailed : false,
//         paymentId : null,
//         userId : userRef.id,
//         unitPrice : `${unitPrice}`,
//         totalPrice : `${totalPrice}`,
//         tax:tax.toFixed(2),
//         amount : amount,
//         quantity : quantity,
//         receiptMailed : false,
//         type : 'product',
//         vendProductId : vendProductRef.id,
//         vendProductName : vendProductData.name,
//         withSST:true,
//         // hasSST:true
//       }
//       invoiceRef = admin.firestore().collection('invoices').doc();
//       batch.set(invoiceRef, invoiceData);
//       return batch.commit();

//     }).catch(function (err){
//       console.log('error getting vend product: ', err);
//     });
    
//   }).then(()=>{
//     console.log('Added invoice', invoiceRef.id);
//     return invoiceRef.id;
//   }).catch((error)=>{
//     console.log('Error', error.message);
//     return Promise.resolve();
//   });
// });

// create custome token, response = custom token
exports.createCustomToken = functions.https.onRequest((request, response) => {

  const uid = 'some-uid';

  return admin
    .auth()
    .createCustomToken(uid)
    .then((customToken) => {
      console.log('customToken: ', customToken);
      // Send token back to client
      return response.status(200).send({
        customToken
      });
    })
    .catch((error) => {
      console.log('Error creating custom token:', error);
      return response.status(200).send({
        error
      });
    });
});

exports.addnullvptinvoice = functions.https.onRequest((request, response) => {
  const addInvoiceForProductVT = admin.firebase.functions().httpsCallable('addInvoiceForProductVT');
  addInvoiceForProductVT({}).then(invoiceRef=>{
    console.log('hello');
    return "test";
  }).catch(e=>{
    console.log(e);
  }) 
  response.send("Hello from Firebase!");
 });

var appointmentArray = [];

const express = require('express');
const app = express();
app.use(cors());
// Automatically allow cross-origin requests
// const cors = require("cors");
// app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(widgets.getById(req.params.id)));
// app.post('/', (req, res) => res.send(widgets.create()));
// app.put('/:id', (req, res) => res.send(widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(widgets.list()));
// View all packages
app.get('/packages', (req, res) => {
  const packageQuery = admin.firestore().collection('packages').get();
  return Promise.all([packageQuery]).then(results=>{
    const packagesResults = results[0];
    console.log('packagesResults: ', packagesResults);

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    console.log('packageMap: ', packageMap);
    // return Promise.resolve();
    return res.send(200).status(packageMap);
  })
})

app.get('/buypt', (req, res) => {

  var Acuity = require('acuityscheduling');
  var acuity = Acuity.basic({
    userId: '19463819',
    apiKey: 'ce1bf0313a0259f39b2e20c7fb48e11d'
  });

  acuity.request('/appointments', function (err, res, appointments) {
    if (err) return console.error(err);
    console.log('appointments:', appointments);
    // appointmentArray.push(appointments);
    console.log('theresult: ', res);
    // var session = req.session;
    // return res.status(200).send('OK');
    // return appointments;
    // return res;
    // return Promise.resolve();

  })

  return res.status(200).send({
    success:true,
    data:'data'
  });
})

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);


// for acuity
var Acuity = require('acuityscheduling');
var acuity = Acuity.basic({
  userId: '19463819',
  apiKey: 'ce1bf0313a0259f39b2e20c7fb48e11d'
});

var allAppointmentsArray = [];
exports.getAllAppointments = functions.https.onRequest((req, res) => {

  acuity.request('appointments', function (err, res, appointments) {
    if (err) return console.error(err);
    console.log('getAllAppointments: ', appointments);

    console.log('the response: ', res);
    allAppointmentsArray = appointments;
    return allAppointmentsArray
    // return res.status(200).send({
    //   appointments: appointments
    // })
  });

  return res.status(200).send({
    success:true,
    data:'data',
    appointments: allAppointmentsArray
  })
});

// transfer payment to vendSalesV2
exports.transferToVendSaleV2 = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  var batch = admin.firestore().batch();
  var vendSaleRef = null;

  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    const vendSalesQuery = admin.firestore().collection('vendSales').where('createdDay', '==', moment().tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY-MM-DD')).get();
    // const vendSalesQuery = admin.firestore().collection('vendSales').where('createdDay', '==', moment('2020-08-21').tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY-MM-DD')).get();

    return Promise.all([vendSalesQuery]).then(results=>{
     
      const vendSaleRes = results[0];

      var vendSaleMap = {};
      var vendSaleCountFB = 0; // vendsale count from firebase
      // console.log('vendSalesQuery: ', vendSaleRes);
      vendSaleRes.forEach((vendSale)=>{
        const data = vendSale.data();
        const status = data && data.status;
        // console.log('vendSaleData: ', data);
        if (data && vendSale.id && (status && status!=='VOIDED')){
          vendSaleCountFB += 1;
          vendSaleMap[vendSale.id] = data;
        }
      });

      var rp2 = require('request-promise');
      // var optionsEdit = vendGetVendSale();
      // const date_from = '2020-07-10'
      // const date_to = '2020-07-12';
      const date_from = moment().tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY-MM-DD');
      const date_to = moment().tz('Asia/Kuala_Lumpur').startOf('day').add(1, 'days').format('YYYY-MM-DD');
      // const date_from = moment().tz('Asia/Kuala_Lumpur').startOf('day').add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss') + `Z`;
      // const date_to = moment().tz('Asia/Kuala_Lumpur').startOf('day').add(8, 'hours').add(1, 'days').format('YYYY-MM-DDTHH:mm:ss') + `Z`;
  
      // const date_from = moment().startOf('day').format('YYYY-MM-DD') + `T00:00:00Z`;
      // const date_to = moment().startOf('day').add(1, 'days').format('YYYY-MM-DD') + `T00:00:00Z`;
      var optionEdit = searchVend(date_from, date_to);
  
      var paymentMap = {};
      var missingVend = [];
      var missingFB = [];
      var paymentIdArray = [];
      var newVendSaleCount = 0;
      return rp2(optionEdit).then(function (result){
        // get the data array
        const data = result && result.data;
        data && data.forEach((saleData)=>{
  
          const created_at = saleData && saleData.created_at;
          const paymentId = saleData && saleData.id;
         
          paymentMap[paymentId] = saleData;
          paymentIdArray.push(paymentId);
  
          // vendSaleRef = admin.firestore().collection('vendSalesV2').doc(paymentId);
          batch.set(admin.firestore().collection('vendSalesV2').doc(paymentId), saleData);
          if(newVendSaleCount >= 499){
            batch.commit();
            newVendSaleCount = 0
            batch = admin.firestore().batch();
          }
          newVendSaleCount += 1;
          // batch.set(vendSaleRef, saleData);
        });
      
        const version = result && result.version;
        // return batch.commit();
  
        var theObject = {
          success:true,
          message: 'no vendSale added',
          createdAt: timestamp
        }
    
        if(newVendSaleCount > 0){
          // return 
          return batch.commit().then(()=>{
            // console.log("Updated invoice", needsUpdatedInvoiceCount);
            // console.log('New invoices', newInvoiceCount);
            // console.log('Deleted invoices', needsDeleteCount);
            const keyPaymentArray = Object.keys(paymentMap);
           
            const keyVendSaleArray = Object.keys(vendSaleMap);

            for (var i in keyVendSaleArray){
              if (!keyPaymentArray.includes(keyVendSaleArray[i])){
                console.log('payment is missing: ', keyVendSaleArray[i]);
                missingVend.push(keyVendSaleArray[i]);
              }
            }

            for (var j in keyPaymentArray){
              if (!keyVendSaleArray.includes(keyPaymentArray[j])){
                console.log('payment is missing: ', keyPaymentArray[j]);
                missingFB.push(keyPaymentArray[j]);
              }
            }
            // keyVendSaleArray.forEach((keyVendSale)=>{
            //   keyPaymentArray.forEach((keyPayment)=>{

            //   });
            // });

            //if ()

            theObject = {
              success:true,
              message: 'OK',
              newVendSaleCount,
              vendSaleCountFB,
              keyPaymentMap: Object.keys(paymentMap),
              keyVendSaleMap: Object.keys(vendSaleMap),
              missingVend,
              missingFB,
              paymentMap,
              vendSaleMap,
              createdAtDate: moment(timestamp).format('DDMMYYYY'),
              createdAtTime: moment(timestamp).format('hh:mm:ss')
            };
            
            // return res.status(200).send({success:true, theObject}); 

            return sendWarningVendEmail(moment(timestamp).format('DD-MM-YYYY'), vendSaleCountFB, newVendSaleCount).then(results=>{
              return res.status(200).send(theObject);
            });
           
          }).catch((error)=>{
            console.log('error batch: ', error);
          });
          // return res.status(200).send(theObject);
        }else{
          // admin.firestore().collection('chargeInvoiceLogs').add(theObject);
          return res.status(200).send(theObject);
        }
  
        // return res.status(200).send({success:true, paymentMap, version}); 
      });
    });
  });
});

// get all vendSale
exports.getVendSale = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    var vendProductObj = {};
    var rp2 = require('request-promise');
    // var optionsEdit = vendGetVendSale();
    const date_from = '2020-07-27'
    const date_to = '2020-07-28';
    var optionEdit = searchVend(date_from, date_to);

    const paymentMap = {};
    var paymentCount = 0;
    return rp2(optionEdit).then(function (result){
      // get the data array
      const data = result && result.data;
      data && data.forEach((saleData)=>{

        const created_at = saleData && saleData.created_at;
        const paymentId = saleData && saleData.id;
        if (created_at && moment(created_at).isSameOrAfter(moment('20200101'))){
          paymentMap[paymentId] = saleData;
          paymentCount += paymentCount;
        }
      });
      // const created_at = data && data[0].created_at;
      // const paymentId = data && data[0].id;
      const version = result && result.version;
      // console.log('getVendSaleresult: ', result);
      // console.log(moment(created_at).format('DDMMYYYY'));
      // paymentMap[paymentId] = data;
      // if (created_at && moment(created_at).isValid() && moment(created_at).isAfter(moment('20180101'))){
      //   paymentMap[paymentId] = data;
      //   // return res.status(200).send({success:true, paymentMap, version}); 
      // }

      // else{
      //   return res.status(200).send({success:true, isBefore2020:true}); 
      // }  
      return res.status(200).send({success:true, paymentMap, paymentCount, version}); 
    });
  });
});

// get vend product details
exports.getVendProductDetails = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    var vendProductObj = {};
    var rp2 = require('request-promise');
    var optionsEdit = vendGetProductDetails();

    return rp2(optionsEdit).then(function (result){
      // console.log('getVendSaleresult: ', result);

      return res.status(200).send({success:true, result}); 
    });
  });
});

// acuity function with promise
function acuityRequest (route, options) {
  const promise = new Promise(function (resolve, reject) {

    // console.log('theroute: ', route);
    acuity.request(route, options, function (err, response, appointments) {
      // console.log('appointments: ', appointments);
      if (err) {
        reject(err); // reject with connection/network error
      } else {
        // console.log('appointmentsResolve: ', appointments);
        resolve(appointments); // resolve with response data
      }
    });
  });
  return promise;
}

// to get all acuityappointment
exports.getacuityappointment = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    const calendarID = optionBody.calendarID;
    const calendarIdLink = calendarID? `&calendarID=${calendarID}`:``;
    const maxList = optionBody.maxList? `max=${optionBody.maxList}`:``;
    const email = optionBody.email? `&email=${optionBody.email}`:``;
    const phone = optionBody.phone? `&phone=${optionBody.phone}`:``;
    const appointmentTypeID = optionBody.appointmentTypeID? `&appointmentTypeID=${optionBody.appointmentTypeID}`:``;

    var option = {};
    option.body = optionBody;
    option.method = 'GET';
    
    const availableUrl = `appointments?${maxList}${email}${phone}${appointmentTypeID}`;

    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointments:acuityResult
      })
    });
  });
});

// to get single acuityappointment by id (using POST to send the id)
exports.getacuityappointmentbyId = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);
    console.log('optionBody2: ', JSON.stringify(req.body));

    const acuityId = optionBody.acuityId;
    console.log('acuityId: ', acuityId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;

    // return get method?
    const acuityAppointmentsPromise = acuityRequest(`/appointments/${acuityId}`);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointments:acuityResult
      })
    });
  });
});

// to post an acuity appointment
exports.postacuityappointment = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;
    const userId = optionBody.userId;
    console.log('userId: ', userId);

    const acuityAppointmentsPromise = acuityRequest('/appointments', option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      var acuityId = acuityResult.id.toString();
      console.log('acuityResult: ', acuityResult);
     
      if (acuityResult.error){
        return res.status(200).send({
          success:false,
          appointments:acuityResult
        })
      }
      else{
        acuityResult.fromApp = true;
        acuityResult.userId = userId;
        // acuityId = String(acuity.id);
        console.log('acuityId: ', acuityResult.id);
        acuityId = (acuityResult.id).toString();
       
        // write to acuity firestore
        // return admin.firestore().collection('acuity').add(acuityResult).then((docRef) => {
        return admin.firestore().collection('acuity').doc(acuityId).set(acuityResult).then((docRef) => {
          console.log('docRef: ', docRef.id);
          return res.status(200).send({
            success:true,
            appointments:acuityResult
          })
        });
      }
    });
  });
});

// to put/update an acuity appointment
exports.updateacuityappointmentbyid = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const acuityId = optionBody.acuityId;
    console.log('acuityId: ', acuityId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;

    const acuityAppointmentsPromise = acuityRequest(`/appointments/${acuityId}`, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointments:acuityResult
      })
    });
  });
});

// to cancel (put method) an acuity appointment
exports.cancelacuityappointmentbyid = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const acuityId = optionBody.acuityId;
    console.log('acuityId: ', acuityId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;

    const acuityAppointmentsPromise = acuityRequest(`/appointments/${acuityId}/cancel`, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointments:acuityResult
      })
    });
  });
});

// to reschedule (put method) an acuity appointment
exports.rescheduleacuityappointmentbyid = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const acuityId = optionBody.acuityId;
    console.log('acuityId: ', acuityId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;

    const acuityAppointmentsPromise = acuityRequest(`/appointments/${acuityId}/reschedule`, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointments:acuityResult
      })
    });
  });
});

// to get all acuityappointment types
exports.getacuityappointmenttypes = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const acuityAppointmentsPromise = acuityRequest('appointment-types');
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointmenttypes:acuityResult
      })
    });
  });
});

// to get all acuityappointment available date (using POST to send the appointmentTypeID)
exports.getacuityappointmentavailabledate = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const appointmentTypeId = optionBody.appointmentTypeID;
    const month = optionBody.month;
    const calendarID = optionBody.calendarID;
    const calendarIdLink = calendarID? `&calendarID=${calendarID}`:``;
    console.log('appointmentTypeId: ', appointmentTypeId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;
    
    const availableUrl = `availability/dates?appointmentTypeID=${appointmentTypeId}&month=${month}${calendarIdLink}&timezone=Asia/Kuala_Lumpur`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointmenttypes:acuityResult
      })
    });
  });
});

// to get all acuityappointment available time (using POST to send the appointmentTypeID, month calendarID)
exports.getacuityappointmentavailabletime = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const appointmentTypeId = optionBody.appointmentTypeID;
    const date = optionBody.date;
    const calendarID = optionBody.calendarID;
    const calendarIdLink = calendarID? `&calendarID=${calendarID}`:``;
    console.log('appointmentTypeId: ', appointmentTypeId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;
    
    const availableUrl = `availability/times?appointmentTypeID=${appointmentTypeId}${calendarIdLink}&date=${date}&timezone=Asia/Kuala_Lumpur`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        times:acuityResult
      })
    });
  });
});

// to get all acuityappointment available class (using POST to send the month)
exports.getacuityappointmentavailableclass = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    const month = optionBody.month;
    const calendarID = optionBody.calendarID;
    const calendarIdLink = calendarID? `&calendarID=${calendarID}`:``;
    const appointmentTypeId = optionBody.appointmentTypeId;
    const appointmentTypeIdLink = appointmentTypeId? `appointmentTypeID=${appointmentTypeId}`:``;
    console.log('appointmentTypeId: ', appointmentTypeId);
    var option = {};
    option.body = optionBody;
    option.method = optionMethod;
    
    const availableUrl = `availability/classes?${appointmentTypeIdLink}${calendarIdLink}&month=${month}&timezone=Asia/Kuala_Lumpur`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointmenttypes:acuityResult
      })
    });
  });
});

// validate available times for an appointment
exports.validatetimesappoinment = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    console.log('optionBody: ', optionBody);
    console.log('optionMethod: ', optionMethod);

    var option = {};
    option.body = optionBody;
    option.method = optionMethod;
    
    const availableUrl = `availability/check-times?`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointment:acuityResult
      })
    });
  });
});

// Get a list of blocks for the authenticated user
exports.getacuityblocks = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const acuityAppointmentsPromise = acuityRequest('blocks?max=50');
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        blocks:acuityResult
      })
    });
  });
});

// POST request to block off time on your calendar.
exports.postacuityblocks = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    
    const availableUrl = `blocks`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointment:acuityResult
      })
    });
  });
});

// DELETE request to block off time on your calendar using Post to send block id.
exports.delacuityblocks = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:'DELETE'
    };
    
    const blockId = (JSON.parse(JSON.stringify(req.body))).blockId;

    const availableUrl = `blocks/${blockId}`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        appointment:acuityResult
      })
    });
  });
});

// Retrieves a list of calendars this user has access to
exports.getacuitycalendars = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const acuityAppointmentsPromise = acuityRequest('calendars');
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        calendars:acuityResult
      })
    });
  });
});

// Get package certificates.
exports.getacuitycertificates = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const acuityAppointmentsPromise = acuityRequest('certificates');
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        certificates:acuityResult
      })
    });
  });
});

// POST request to Create a package or coupon certificate.
exports.postacuitycertificate = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    
    const availableUrl = `certificates`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        certificates:acuityResult
      })
    });
  });
});

// client acuity api.
exports.clientacuity = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    
    var availableUrl = `clients`;
    const body = JSON.parse(JSON.stringify(req.body));
    const search = body.search || null;
    const removeClient = body.removeClient || null;
    const firstName = body.firstName || null;
    const lastName = body.lastName || null;

    if (search){
      availableUrl = `clients?search=${search}`;
      option.method = 'GET';
    }
    else if (removeClient){
      availableUrl = `clients?firstName=${firstName}&lastName=${lastName}`;
      option.method = 'DELETE';
    }
    
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);

    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        client:acuityResult
      })
    });
  });
});

// forms acuity api.
exports.formssacuity = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    var availableUrl = `forms`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        forms:acuityResult
      })
    });
  });
});

// label acuity api.
exports.labelsacuity = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    var availableUrl = `labels`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        label:acuityResult
      })
    });
  });
});

// products acuity api.
exports.productsacuity = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    var option = {
      body:JSON.parse(JSON.stringify(req.body)),
      method:req.method
    };
    var availableUrl = `products`;
    const acuityAppointmentsPromise = acuityRequest(availableUrl, option);
    return Promise.all([acuityAppointmentsPromise]).then(result=>{
      const acuityResult = result[0];
      // console.log('acuityResult: ', acuityResult);
      return res.status(200).send({
        success:true,
        products:acuityResult
      })
    });
  });
});

exports.addTransaction = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  // console.log("Begin transaction request");
  // console.log(req);
  // const original = req.query.text;
  var transactionData = JSON.parse(JSON.stringify(req.body));
  const response = transactionData.response;
  const invoiceId = transactionData.invoiceNo;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  transactionData.createdAt = timestamp;

  return admin.firestore().collection('transactions').add(transactionData).then((docRef) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    if(invoiceId && invoiceId.length > 0){
      console.log('Added transaction for invoice', docRef.id, invoiceId);
      if(response === '00'){
        return admin.firestore().collection('invoices').doc(invoiceId).update({paid:true, paymentId:null, transactionId:docRef.id}).then((docRef)=>{
          return res.redirect(303, `https://app.babel.fit/payments/${invoiceId}`);
        });
      }else{
        return res.redirect(303, `https://app.babel.fit/payments/${invoiceId}`);
      }
    }else{
      return res.redirect(303, 'https://app.babel.fit/');
    }

    //mark invoice as paid
  });
});

exports.addTransactionTest = functions.https.onRequest((req, res) => {
  // const myLocalIp = 'http://192.168.0.183:3000';
  const myLocalIp = 'http://192.168.2.53:3000';
  // Grab the text parameter.
  console.log("Begin transaction request test");
  // console.log(req);
  // const original = req.query.text;
  var transactionData = JSON.parse(JSON.stringify(req.body));
  console.log('transactionData: ', transactionData);
  const response = transactionData.response;
  const invoiceId = transactionData.invoiceNo;
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  transactionData.createdAt = timestamp;

  return admin.firestore().collection('transactions').add(transactionData).then((docRef) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    console.log('Received transaction for invoice', docRef.id, transactionData, invoiceId);
    if(invoiceId && invoiceId.length > 0){
      console.log('Added transaction for invoice', docRef.id, invoiceId);
      if(response === '00'){
        return admin.firestore().collection('invoices').doc(invoiceId).update({paid:true, paymentId:null, transactionId:docRef.id}).then((docRef)=>{
          // return res.redirect(303, `http://192.168.1.17:3000/payments/${invoiceId}`);
          return res.redirect(303, myLocalIp+`/payments/${invoiceId}`);
        });
      }else{
        // return res.redirect(303, `http://192.168.1.17:3000/payments/${invoiceId}`);
        return res.redirect(303, myLocalIp+`/payments/${invoiceId}`);
      }
    }else{
      return res.redirect(303, myLocalIp);
    }

    //mark invoice as paid
  });
});

// webhooks to update vendItem
exports.updateVendItem = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const itemCollectionMap = {
    'sale.update': 'vendSales',
    'customer.update': 'vendCustomers',
    'product.update': 'vendProducts'
  }
  const itemCollection = itemCollectionMap[itemData.type];
  const payload = JSON.parse(itemData.payload);
  console.log('updateVendItem: ', itemCollection, payload.id, payload);

  return admin.firestore().collection(itemCollection).doc(payload.id).set(payload).then((docRef) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.status(200).send('OK');
  });
});

// webhooks to update vendItem
exports.updateTheVendItem = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const itemCollectionMap = {
    'sale.update': 'vendSales',
    'customer.update': 'vendCustomers',
    'product.update': 'vendProducts'
  }
  const itemCollection = itemCollectionMap[itemData.type];
  const payload = JSON.parse(itemData.payload);
  // payload.createdDay = moment(payload.created_at).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD');
  payload.createdDay = moment(payload.created_at).format('YYYY-MM-DD');
  console.log('updateVendItem: ', itemCollection, payload.id, payload);

  return admin.firestore().collection(itemCollection).doc(payload.id).set(payload).then((docRef) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.status(200).send('OK');
  });
});

// // acuity webhooks listener
// exports.acuityListener = functions.https.onRequest((req, res) => {
 
//   const action = 
//   return res.status(200).send('OK');
// });

// webhooks to add acuity appointment
exports.addAcuityToFirestore = functions.https.onRequest((req, res) => {
  //const itemData = req.body;
  console.log('updateAppointmentItemReq: ', req.body);
  console.log('updateAppointmentItemRes: ', res);
  var appointmentData = JSON.parse(JSON.stringify(req.body));
  // console.log('appointmentData: ', appointmentData);
  const id = appointmentData.id || null;
  var emailPromise = null;

  var isAppoinmentCreatedFromApp = false;
  console.log('id from acuity webhook: ', id);
  // console.log('typedOf id: ', typeof(id));
  // const userQueryPromise = admin.firestore().collection('users').get();
  // const acuityPromise = admin.firestore().collection('acuity').where('id', '==', String(id)).get();

  const acuityPromise = admin.firestore().collection('acuity').get();

  return Promise.all([acuityPromise]).then(results=>{
    // const userRes = results[0];
    const acuityRes = results[0];
    const acuityMap = {};
    console.log('acuityRes: ', acuityRes);
    // if(acuityRes.exists){
      acuityRes.forEach(doc=>{
        const acuityData = doc.data();
        //console.log('acuityData: ', acuityData);
        // console.log('typedOf acuityDataId: ', typeof(acuityData.id));

        if (acuityData.id === parseInt(appointmentData.id)){
          console.log('same id')
          isAppoinmentCreatedFromApp = true;
          acuityMap[doc.id] = acuityData;
          appointmentData.fromApp = true;
        }
      });
      console.log('acuityMap: ', acuityMap);
      console.log('appointmentData: ', appointmentData);

      if (!isAppoinmentCreatedFromApp){
        // refetch, get it from acuity
        appointmentData.fromApp = false;
        const acuityAppointmentsPromise = acuityRequest(`/appointments/${appointmentData.id}`);
        return Promise.all([acuityAppointmentsPromise]).then(result=>{
          const acuityResult = result[0];
          console.log('acuityResult: ', acuityResult);
          acuityResult.fromApp = false;
          
          return admin.firestore().collection('acuity').add(acuityResult).then((docRef)=>{
            // sending email if appoinment is not from app
            emailPromise = sendManualFromAcuityEmail(acuityResult);
           
            return Promise.all([emailPromise]).then(result=>{
              return res.status(200).send({
                success:true,
                appointments:acuityResult
              })
            });
            // emailPromise = sendTerminationEmail(userData.email, userData.name, moment(timestamp).format('D MMM YYYY')).then(results=>{
            //   return admin.firestore().collection('users').doc(userId).update({autoTerminate:true, cancellationDate:timestamp, cancellationReason:'autoTerminated'});
            // });
            // return res.status(200).send({
            //   success:true,
            //   appointments:acuityResult
            // })
          })
        });
      }
    // }
    // else{
    //   console.log('acuity doesnt exist');
    //   appointmentData.fromApp = false;

   

    //   // return Promise.resolve();
    // }
   
    // return admin.firestore().collection('acuityAdd').doc(id).set(appointmentData).then((docRef)=>{
    //   return res.status(200).send('OK');
    // })
    // const acuityData = acuityRes.data();
    // console.log('acuityData: ', acuityData);

    return res.status(200).send('OK');
    // const userData = userRes.data();

  });
  
  // return admin.firestore().collection('acuityAdd').doc(id).set(appointmentData).then((docRef)=>{
  //   return res.status(200).send('OK');
  // })

});

// webhooks when an acuity appoinment is rescheduled
exports.rescheduleAcuityToFirestore = functions.https.onRequest((req, res) => {
  var appointmentData = JSON.parse(JSON.stringify(req.body));
  return admin.firestore().collection('acuityReschedule').add(appointmentData).then((docRef)=>{
    console.log('successfully added')
    return res.status(200).send('OK');
  }).catch((error)=>{
    console.log('error adding: ', error)
    return res.status(500).send('Error adding data: ', error);
  })
});

// webhooks when an acuity appoinment is changed
exports.updateAcuityToFirestore = functions.https.onRequest((req, res) => {
  //const itemData = req.body;
  // console.log('updateAppointmentItemReq: ', req.body);
  // console.log('updateAppointmentItemRes: ', res);
  console.log('updateAppointmentItemReq: ', req.body);
  console.log('updateAppointmentItemRes: ', res);
  var appointmentData = JSON.parse(JSON.stringify(req.body));
  // console.log('appointmentData: ', appointmentData);
  const id = appointmentData.id || null;
  var emailPromise = null;

  var isAppoinmentCreatedFromApp = false;
  console.log('id from acuity webhook: ', id);
  console.log('typedOf id: ', typeof(id));
  // const userQueryPromise = admin.firestore().collection('users').get();
  // const acuityPromise = admin.firestore().collection('acuity').where('id', '==', String(id)).get();

  const acuityPromise = admin.firestore().collection('acuity').get();

  return Promise.all([acuityPromise]).then(results=>{
    // const userRes = results[0];
    const acuityRes = results[0];
    const acuityMap = {};
    console.log('acuityRes: ', acuityRes);
    // if(acuityRes.exists){
      acuityRes.forEach(doc=>{
        const acuityData = doc.data();
        //console.log('acuityData: ', acuityData);
        // console.log('typedOf acuityDataId: ', typeof(acuityData.id));

        if (acuityData.id === parseInt(appointmentData.id)){
          console.log('same id')
          isAppoinmentCreatedFromApp = true;
          acuityMap[doc.id] = acuityData;
          appointmentData.fromApp = true;
        }
      });
      console.log('acuityMap: ', acuityMap);
      console.log('appointmentData: ', appointmentData);

      if (!isAppoinmentCreatedFromApp){
        // refetch, get it from acuity
        appointmentData.fromApp = false;
        const acuityAppointmentsPromise = acuityRequest(`/appointments/${appointmentData.id}`);
        return Promise.all([acuityAppointmentsPromise]).then(result=>{
          const acuityResult = result[0];
          console.log('acuityResult: ', acuityResult);
          acuityResult.fromApp = false;
          
          return admin.firestore().collection('acuity').add(acuityResult).then((docRef)=>{
            // sending email if appoinment is not from app
            emailPromise = sendManualFromAcuityEmail(acuityResult);
           
            return Promise.all([emailPromise]).then(result=>{
              return res.status(200).send({
                success:true,
                appointments:acuityResult
              })
            });
          })
        });
      }
    // }
    // else{
    //   console.log('acuity doesnt exist');
    //   appointmentData.fromApp = false;

   

    //   // return Promise.resolve();
    // }
   
    // return admin.firestore().collection('acuityAdd').doc(id).set(appointmentData).then((docRef)=>{
    //   return res.status(200).send('OK');
    // })
    // const acuityData = acuityRes.data();
    // console.log('acuityData: ', acuityData);

    return res.status(200).send('OK');

  // console.log('appointmentData: ', appointmentData);
  // const id = parseInt(appointmentData.id) || null;

  // const action = appointmentData.action;

  // if (appointmentData.action === "scheduled"){ //if exist, do not do anything.
  //     if(admin.firestore().collection('acuity').where('id','==',appointmentData.id))
  //       return null;//do nothing 
        
  //       // run acuity function to get appointmnet details

  //        //add returned data to firestore.
  //         admin.firestore().collection('acuity').add().then((docRef)=>{
  //         console.log('successfully added')
  //         return res.status(200).send('OK');
  //       }).catch((error)=>{
  //         console.log('error adding: ', error)
  //         return res.status(500).send('Error adding data: ', error);
  //       })
  //       //check if user exists
  //       // if (!admin.firestore().collection('users').where('phone','==',Faizul to fill) || !admin.firestore().collection('users').where('email','==',Faizul to fill))
  //       //   {
  //       //     //send email to boon and billy and faizul  with full details of appointment.
  //       //   }
  //       //check if user has credit
  // }

  // return admin.firestore().collection('acuityLogs').add(appointmentData).then((docRef)=>{
  //   console.log('successfully added')
  //   return res.status(200).send('OK');
  // }).catch((error)=>{
  //   console.log('error adding: ', error)
  //   return res.status(500).send('Error adding data: ', error);
  // })

  });
});

// action when triggering the acuity firestore
exports.modifyAcuity = functions.firestore
  .document('acuity/{acuityId}')
  .onWrite((change, context) => {
    const afterData = change.after.data();
    const previousData = change.before.data();

    console.log('previousData: ', previousData);
    console.log('changeAfterData: ', afterData);

    const userId = afterData.userId;
    // console.log('theData: ', data);
    if(!afterData || !userId){
      //deleted or no userId
      console.log('collections is deleted or no userId found!');
      return Promise.resolve();
    }

     //retrieve invoice and packages
     const paymentQuery = admin.firestore().collection('payments').where('userId', '==', userId).where('type', '==', 'personalTraining').get();

    return Promise.all([paymentQuery]).then(results=>{
      const paymentsResults = results[0];

      var totalAcuityCredit = 0;
      // search from the payment database
      paymentsResults.forEach(doc=>{
        // console.log('thePaymentResult: ', doc.data());
        const paymentData = doc.data();
        const type = paymentData && paymentData.type;
        console.log('paymentType: ', type);
        // if payment is not valid
        if(doc.data().status && (doc.data().status !== 'CLOSED' && doc.data().status !== 'ONACCOUNT')){
          return;
        }
     
        console.log('paymentData: ', paymentData);
        const credit = paymentData.credit;
        const appoinmentName = paymentData.appoinmentName;
        const invoiceId = paymentData.invoiceId;
        const userId = paymentData.userId;

        console.log('appoinment credit: ', credit);
        // if cancel, skip;
        if (afterData.canceled){
          console.log('appoinment has been canceled');
          // return Promise.resolve();
        }


        totalAcuityCredit = totalAcuityCredit + credit;
        console.log('totalCredit: ', totalAcuityCredit);
        
      });

      console.log('totalAcuityCredit: ', totalAcuityCredit);

      // const batch = admin.firestore().batch();
      // const userRef = admin.firestore().collection('users').doc(userId).get();

      // batch.update(userRef, {totalAcuityCredit});
      // return batch.commit();
     
      // const paymentData = paymentDoc.data();
    
      // const credit = paymentData.credit;
      // const appoinmentName = paymentData.appoinmentName;
      // const invoiceId = paymentData.invoiceId;
      // const userId = paymentData.userId;

      // console.log('userId: ', userId);
      // console.log('credit: ', credit);
      // const batch = admin.firestore().batch();
      // const userRef = admin.firestore().collection('users').doc(userId).get();

      // batch.update(userRef, {credit});
      // return batch.commit();
      return admin.firestore().collection('users').doc(userId).update({totalAcuityCredit}).then(res=>{
        console.log('totalAcuity updated: ', res);
        return Promise.resolve(); 
      })

      // return Promise.resolve();
    }); 

    // return Promise.resolve();
  }
);

exports.modifyTransaction = functions.firestore
  .document('transactions/{transactionId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const invoiceId = data && data.invoiceNo;
    const authorized = (data && data.response) ? data.response === '00' : false;
    console.log('Modifying transactionId for invoiceId', change.after.id, invoiceId, data);
    if(!invoiceId){
      console.log(`Transaction has no invoiceId ${change.after.id}`);
      return Promise.reject(new Error(`Transaction has no invoiceId ${change.after.id}`));
    }

    //retrieve invoice and packages
    const invoiceQuery = admin.firestore().collection('invoices').doc(invoiceId).get();
    const packagesQuery = admin.firestore().collection('packages').get();

    return Promise.all([invoiceQuery, packagesQuery]).then(results=>{
      const invoiceDoc = results[0];
      const packagesResults = results[1];

      var packageMap = {};
      var productIdPackageMap = {};
      packagesResults.forEach(doc=>{
        const data = doc.data();
        packageMap[doc.id] = data;

        const vendProductIds = data && data.vendProductIds;
        vendProductIds && vendProductIds.map(vendProductId=>{
          productIdPackageMap[vendProductId] = doc.id;
          return null;
        });
      });

      if(invoiceDoc.exists){
        const invoiceData = invoiceDoc.data();
        const paid = invoiceData.paid;
        const paymentId = invoiceData.paymentId;

        if(paid && paymentId && authorized){
          console.log(`Invoice already paid ${invoiceDoc.id}`);
          return Promise.resolve();
        }

        const userId = invoiceData.userId;
        const totalPrice = invoiceData.totalPrice;
        const vendProductId = invoiceData.vendProductId;
        var vendProductPackageId = productIdPackageMap[invoiceData.vendProductId];
        if(!vendProductId){
          const vendProducts = invoiceData.vendProducts;
          // console.log("VPS", vendProduct);
          vendProducts && vendProducts.forEach(vendProduct=>{
            // console.log("VP", vendProduct);
            const vendProductId = vendProduct.vendProductId;
            if(!vendProductPackageId){
              vendProductPackageId = productIdPackageMap[vendProductId];
            }
          });
        }
        const packageId = vendProductPackageId || invoiceData.packageId;
        const quantity = invoiceData.quantity ? invoiceData.quantity : 1;
        const packageData = packageId ? packageMap[packageId] : null;
        const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
        const type = vendProductPackageId ? 'membership' : invoiceData.type;
        const detailName = invoiceData.className;
        const detailDate = invoiceData.classDate;

        //add payment
        const batch = admin.firestore().batch();
        const paymentRef = admin.firestore().collection('payments').doc();
        var paymentData = {
          createdAt : data.createdAt,
          totalPrice : totalPrice ? totalPrice : 0,
          type : type,
          userId : userId,
          packageId : packageId,
          source : 'pbonline',
          renewalTerm : renewalTerm,
          status : authorized ? 'CLOSED' : 'FAILED',
          transactionId : change.after.id,
          quantity : quantity,
          invoiceId : invoiceDoc.id,
        }
        if(type === 'product'){
          paymentData.productName = invoiceData.vendProductName;
        }
        if(detailName){
          paymentData.detailName = detailName;
        }
        if(detailDate){
          paymentData.detailDate = detailDate;
        }
        console.log('Adding paymentData for transactionId and invoiceId', paymentData, change.after.id, invoiceId);
        // console.log('Adding paymentData for transactionId and invoiceId', paymentData, change.after.id, invoiceId);
        batch.set(paymentRef, paymentData);

        //mark invoice as paid
        batch.update(invoiceDoc.ref, {paid:authorized, paymentId:paymentRef.id, paymentFailed:!authorized});

        console.log("Saving invoice and payment for transaction", invoiceId, paymentRef.id, change.after.id);

        return batch.commit();
      }else{
        console.log(`Issue with invoice: ${invoiceId} ${change.after.id}`);
        return Promise.reject(new Error(`Issue with invoice: ${invoiceId} ${change.after.id}`));
      }
    });
  }
);

function vendCustomerEditOption(firstName, lastName, email, phone, customer_group_id, vendCustomerId){
  var options = { method: 'PUT',
    url: 'https://bfitness.vendhq.com/api/2.0/customers/'+`${vendCustomerId}`,
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    body:{
      first_name : firstName,
      last_name : lastName,
      email : email,
      phone : phone,
      customer_group_id : customer_group_id,
      // custom_field_1: 'faizulTest'
    },
    json:true
  };
  return options;
}

function vendCustomerAddOption(firstName, lastName, email, phone, customer_group_id){
  var options = { method: 'POST',
    url: 'https://bfitness.vendhq.com/api/2.0/customers',
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    body:{
      first_name : firstName,
      last_name : lastName,
      email : email,
      phone : phone,
      customer_group_id : customer_group_id
    },
    json:true
  };
  return options;
}
// vend get product details
function vendGetProductDetails(vendId){
  var productId = vendId? vendId:'';
  var options = { method: 'GET',
    url: `https://bfitness.vendhq.com/api/2.0/products/${productId}`,
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    json:true
  };
  return options;
}

// vend get vend sales
function vendGetVendSale(){
  var options = { method: 'GET',
    url: `https://bfitness.vendhq.com/api/2.0/sales`,
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    json:true
  };
  return options;
}

// search vend sales
function searchVend(date_from, date_to){ 
  console.log('date_from: ', date_from);
  console.log('date_to: ', date_to);
  var theUrl = `https://bfitness.vendhq.com/api/2.0/search?type=sales&status=CLOSED&date_from=${date_from}&date_to=${date_to}`
  var options = { method: 'GET',
    url: theUrl,
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    // body:{
    //   date_from : date_from,
    //   date_to : date_to,
    //   type : 'sales',
    //   status : 'CLOSED'
    // },
    json:true
  };
  return options;
}

// function to get package name without query
function getPackageDetails(packageId){
  var packageMap = {};
  if (packageId){
    return admin.firestore().collection('packages').doc(packageId).get().then(doc=>{
      const data = doc.data();
      const name = data && data.name;
      packageMap = data;
      console.log('packageMap: ', packageMap);
      return packageMap;
    });
    // return packageMap;
  }
  else{
    return null;
  }
}

// for successfull virtual PT transaction
exports.addUserChangeLogToSheets = functions.firestore
  .document('logs/{logId}')
  .onCreate((snap, context) => {
  // .onWrite((change, context) => {
  //.onUpdate((change, context) => {

    // const newData = change.after.data();
    // const previousData = change.before.data();

    const document = snap.data();
    // const document = (change.after && change.after.exists) ? change.after.data() : ((change.before && change.before.exists) ? change.before.data() : null);
    if(!document){
      //deleted
      return null;
    }
    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    console.log('addUserChangeLogToSheetsdocument: ', document);
    // perform desired operations ...
    const executerEmail = document && document.executerEmail;
    console.log('executerEmail: ', executerEmail);
    const executerId = document && document.executerId;
    const createdDate = document && document.time;
    const userId = document && document.userId;
    const BeforeuserData = document && document.BeforeuserData;
    const afterData = document && document.afterUserData;
    const beforePackageId = BeforeuserData? BeforeuserData.packageId? BeforeuserData.packageId:'':'' ;
    const afterPackageId = afterData? afterData.packageId? afterData.packageId:'':'';
    // const beforePackageDataPromise = BeforeuserData? BeforeuserData.packageId? getPackageDetails(BeforeuserData.packageId):'':'';
    // const afterPackageDataPromise = afterData? afterData.packageId? getPackageDetails(afterData.packageId):'':'';
    const beforeReferredByUserId = BeforeuserData? BeforeuserData.referredByUserId? BeforeuserData.referredByUserId:'':'' ;
    const afterReferredByUserId = afterData? afterData.referredByUserId? afterData.referredByUserId:'':'';
    const freezeFor = document && document.freezeFor;
    const freezeQuantity = document && document.freezeQuantity;
    const action = document && document.action;
    const freezeForRemoved = document && document.freezeForRemoved;
    const beforeCancellationDate = BeforeuserData? BeforeuserData.cancellationDate? BeforeuserData.cancellationDate:'':'';
    const afterCancellationDate = afterData? afterData.cancellationDate? afterData.cancellationDate:'':'';

    // console.log('theContext: ', context);
    // console.log('newData: ', newData);
    // console.log('beforePackageData: ', beforePackageDataPromise);
    // console.log('afterPackageData: ', afterPackageDataPromise);
    // beforePackageDataPromise && beforePackageDataPromise.then((res)=>{
    //   console.log('res: ', res);
    // });

    var sheetReport = [];

    if ((BeforeuserData && BeforeuserData.packageId) || (afterData && afterData.packageId) || (BeforeuserData && BeforeuserData.referredByUserId) || 
      (afterData && afterData.referredByUserId)
      || freezeFor || freezeQuantity || freezeForRemoved || beforeCancellationDate || afterCancellationDate
      ) {
    
      
      const getSheetPromise = getGoogleSheetPromise({
        spreadsheetId: CONFIG_SHEET_ID,
        range: `AUTO USER SIG CHANGE LOG!A2:S`
      });
      
      const userQuery = admin.firestore().collection('users').doc(userId).get();
      //const usersQuery = admin.firestore().collection('users').get();
      // const referralQueryBefore = admin.firestore().collection('users').doc(beforeReferredByUserId).get();
      // const referralQueryAfter = admin.firestore().collection('users').doc(afterReferredByUserId).get();
      const packagesQuery = admin.firestore().collection('packages').get();

      return Promise.all([userQuery, packagesQuery]).then(results=>{
        const userDoc = results[0];
        const packageResults = results[1];
        // const refBeforeRes = results[2];
        // const refAfterRes = results[3];
        // const userResults = results[2];
        
        var pkgMap = {};
        packageResults && packageResults.forEach(pkg=>{
          pkgMap[pkg.id] = pkg.data();
        });

        // var userMap = {};
        // userResults && userResults.forEach(user=>{
        //   userMap[user.id]=user.data();
        //   // const userData = user.data();

        // });

        // console.log('userMap: ', userMap);
        const beforePackageData = BeforeuserData? BeforeuserData.packageId? pkgMap[BeforeuserData.packageId]:null:null;
        const afterPackageData = afterData? afterData.packageId? pkgMap[afterData.packageId]:null:null;

        if(userDoc.exists){
          const userData = userDoc.data();
          const email = userData.email;
          
          // userResults && userResults.forEach(user=>{
          //   const userData = user.data();
          //   const referredByUserId = userData && userData.referredByUserId;
          //   if (referredByUserId){
          //     // todo - to convert from member referral id to its email
          //   }
          // });          

          return getSheetPromise.then((result)=>{
            // console.log('theresult: ', result);
            const values = result && result.values;
            const rowsCount = (values && values.length)? values.length:0;
            // const userDataRefBefore = beforeReferredByUserId? userMap[beforeReferredByUserId]:null;
            // const userDataRefAfter = afterReferredByUserId? userMap[afterReferredByUserId]:null;
            // const userDataRefEmailBefore = userDataRefBefore && userDataRefBefore.email;
            // const userDataRefEmailAfter = userDataRefAfter && userDataRefAfter.email;
            // console.log('beforeReferredByUserId: ', beforeReferredByUserId && beforeReferredByUserId);
            // console.log('afterReferredByUserId: ', afterReferredByUserId && afterReferredByUserId);
            // console.log('userDataRefBefore: ', userDataRefBefore);
            // console.log('userDataRefAfter: ', userDataRefAfter); 

            var freezeForArray = [];
            var freezeDate = '';
            if (freezeFor && freezeQuantity){
              for (var i = 0; i<freezeQuantity; i++){
                // freezeForArray.push(moment(getTheDate(freezeFor)).add(i, 'months').format('DD/MM/YYYY'));
                freezeDate = freezeDate.concat(moment(getTheDate(freezeFor)).add(i, 'months').add(1, 'days').subtract(freezeQuantity, 'months').format('DD/MM/YYYY') + ', ');
              }
            }
            freezeForArray.join(', ');
            console.log('freezeForArray: ', freezeForArray);
            sheetReport = [[
              rowsCount + 1,
              moment(getTheDate(createdDate)).tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY'),
              moment(getTheDate(createdDate)).tz('Asia/Kuala_Lumpur').format('HH:mm:ss'),
              email,
              // executerId,
              executerEmail, 
              beforePackageId,
              afterPackageId,
              beforePackageData? beforePackageData.name? beforePackageData.name: '':'',
              afterPackageData? afterPackageData.name? afterPackageData.name:'':'',
              beforeReferredByUserId,
              // '',
              //userDataRefEmailBefore,
              afterReferredByUserId,
              '',
              '',
              //userDataRefEmailAfter,
              // freezeFor? moment(getTheDate(freezeFor)).format('DD/MM/YYYY'):'',
              freezeFor? freezeDate:'',
              freezeQuantity? freezeQuantity:'',
              freezeForRemoved? moment(freezeForRemoved).format('DD/MM/YYYY'):'',
              beforeCancellationDate? (moment(getTheDate(beforeCancellationDate)).format('DD/MM/YYYY') === '01/01/1970')? '': moment(getTheDate(beforeCancellationDate)).format('DD/MM/YYYY'): '',
              afterCancellationDate? moment(getTheDate(afterCancellationDate)).format('DD/MM/YYYY'):'',
            ]];
            
            console.log('sheetReport: ', sheetReport);
      
            const updateSheetPromise = updateGoogleSheet({
              spreadsheetId: CONFIG_SHEET_ID,
              // valueInputOption: 'RAW',
              
              resource: {
                // How the input data should be interpreted.
                valueInputOption: 'RAW',  // TODO: Update placeholder value.
          
                // The new values to apply to the spreadsheet.
                data: [
                  {
                    range:`AUTO USER SIG CHANGE LOG!A${rowsCount+2}:S`,
                    majorDimension: "ROWS",
                    values: sheetReport
                  }
                ],  
              },
      
            });
      
            return updateSheetPromise.then((result)=>{
              return Promise.resolve();
            });
        
          });

        }
        else{
          return Promise.resolve();
        }
      });

      // return admin.firestore().collection('users').doc(userId).get().then(doc=>{
      //   const data = doc.data();
      //   const email = data && data.email;

      //   return getSheetPromise.then((result)=>{
      //     console.log('theresult: ', result);
      //     const values = result && result.values;
      //     const rowsCount = (values && values.length)? values.length:0;
          
      //     sheetReport = [[
      //       rowsCount + 1,
      //       moment(getTheDate(createdDate)).format('DD/MM/YYYY'),
      //       moment(getTheDate(createdDate)).format('hh:mm:ss'),
      //       email,
      //       // executerId,
      //       executerEmail, 
      //       beforePackageId,
      //       beforePackageData? beforePackageData.name? beforePackageData.name: '':'',
      //       afterPackageId,
      //       afterPackageData? afterPackageData.name? afterPackageData.name:'':'',
      //       beforeReferredByUserId,
      //       afterReferredByUserId,
      //       freezeFor? moment(getTheDate(freezeFor)).format('DD/MM/YYYY'):'',
      //       freezeQuantity? freezeQuantity:'',
      //       beforeCancellationDate? (moment(getTheDate(beforeCancellationDate)).format('DD/MM/YYYY') === '01/01/1970')? '': moment(getTheDate(beforeCancellationDate)).format('DD/MM/YYYY'): '',
      //       afterCancellationDate? moment(getTheDate(afterCancellationDate)).format('DD/MM/YYYY'):'',
      //     ]];
          
      //     console.log('sheetReport: ', sheetReport);
    
      //     const updateSheetPromise = updateGoogleSheet({
      //       spreadsheetId: CONFIG_SHEET_ID,
      //       // valueInputOption: 'RAW',
            
      //       resource: {
      //         // How the input data should be interpreted.
      //         valueInputOption: 'RAW',  // TODO: Update placeholder value.
        
      //         // The new values to apply to the spreadsheet.
      //         data: [
      //           {
      //             range:`AUTO USER SIG CHANGE LOG!A${rowsCount+2}:S`,
      //             majorDimension: "ROWS",
      //             values: sheetReport
      //           }
      //         ],  
      //       },
    
      //     });
    
      //     return updateSheetPromise.then((result)=>{
      //       return Promise.resolve();
      //     });
      
      //   });
      // });     
    }

    else{return Promise.resolve()}
  }
);

exports.modifyUser = functions.firestore
  .document('users/{userId}')
  .onWrite((change, context) => {

    const data = change.after.data();
    const previousData = change.before.data();

    // console.log('theData: ', data);
    if(!data){
      //deleted
      return Promise.resolve();
    }

    // const createdAt = data.createdAt;
    // if(!createdAt){
    //   console.log('no createdAt found, creating createdAt');
    //   const joinDate = data.joinDate;
    //   return change.after.ref.update({createdAt:data.joinDate?data.joinDate:createdAt});
    // }
    const name = data.name;
    const normalizedName = name && typeof name === 'string' && name.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(/([^\s/-]+)/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
    if(name && normalizedName && name !== normalizedName){
      // console.log('updated normalize name: ', normalizedName);
      return change.after.ref.update({name:normalizedName});
    }

    const currentUserId = change.after.id;
    const currentUserRef = change.after.ref;
    const tempUserId = data.tempUserId; //Visitor without passwords
    if(tempUserId && currentUserId && currentUserRef){
      // console.log('tempUserId: ', tempUserId);
    //Executes when Visitors without passwords converts to Users
      const roles = data.roles;
      const isStaff = roles && (roles.admin || roles.mc || roles.trainer);


      var queryPromises = [];
      //performUpdates for bookings, gantnerLogs, invoices, payments, users referrals
      const bookingsQuery = admin.firestore().collection('bookings').where('userId', '==', tempUserId).get();
      const gantnerLogsQuery = admin.firestore().collection('gantnerLogs').where('userId', '==', tempUserId).get();
      const invoicesQuery = admin.firestore().collection('invoices').where('userId', '==', tempUserId).get();
      const paymentsQuery = admin.firestore().collection('payments').where('userId', '==', tempUserId).get();
      const referredPaymentsQuery = admin.firestore().collection('payments').where('referredUserId', '==', tempUserId).get();
      const usersQuery = admin.firestore().collection('users').where('referredByUserId', '==', tempUserId).get();

      queryPromises.push(bookingsQuery, gantnerLogsQuery, invoicesQuery, paymentsQuery, referredPaymentsQuery, usersQuery);

      //for trainer, bookings, sessions, users
      if(isStaff){
        const bookingsTrainerQuery = admin.firestore().collection('bookings').where('trainerId', '==', tempUserId).get();
        const bookingsBookerQuery = admin.firestore().collection('bookings').where('bookerId', '==', tempUserId).get();
        const sessionsTrainerQuery = admin.firestore().collection('sessions').where('trainerId', '==', tempUserId).get();
        const mcsQuery = admin.firestore().collection('users').where('mcId', '==', tempUserId).get();
        const trainersQuery = admin.firestore().collection('users').where('trainerId', '==', tempUserId).get();

        queryPromises.push(bookingsTrainerQuery, bookingsBookerQuery, sessionsTrainerQuery, mcsQuery, trainersQuery);
      }

      return Promise.all(queryPromises).then(results=>{
        var updates = [];
        results.forEach(result=>{
          result.forEach(doc=>{
            const data = doc.data();
            const userId = data && data.userId;
            if(userId && tempUserId === userId){
              updates.push([doc.ref, {userId:currentUserId}]);
            }
            const referredUserId = data && data.referredUserId;
            if(referredUserId && tempUserId === referredUserId){
              updates.push([doc.ref, {referredUserId:currentUserId}]);
            }
            if(isStaff){
              const trainerId = data && data.trainerId;
              if(trainerId && tempUserId === trainerId){
                updates.push([doc.ref, {trainerId:currentUserId}]);
              }
              const bookerId = data && data.bookerId;
              if(bookerId && tempUserId === bookerId){
                updates.push([doc.ref, {bookerId:currentUserId}]);
              }
            }
          });
        });

        var batchCommitPromises = [];
        var batch = admin.firestore().batch();
        var batchCount = 0;
        updates.forEach(([ref, updates]) =>{
          if(batchCount >= 500){
            batchCommitPromises.push(batch.commit());
            batch = admin.firestore().batch();
            batchCount = 0;
          }
          batch.update(ref, updates);
          batchCount += 1;
        });

        if(batchCount > 0){
          batchCommitPromises.push(batch.commit());
        }

        if(batchCommitPromises.length){
          return Promise.all(batchCommitPromises).then(()=>{
            return currentUserRef.update({tempUserId:null, migratedTempUserId : tempUserId});
          });
        }else{
          return currentUserRef.update({tempUserId:null, migratedTempUserId : tempUserId});
        }

      });
    }
    //Ignore if no start date and complimentary.
    // var membershipStarts = data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
    // console.log('membershipStart: ', membershipStarts);
    // if((data.packageId && !membershipStarts) || (data.packageId && data.packageId === 'yKLfNYOPzXHoAiknAT24')){
    //   return Promise.resolve();
    // }

    //if vend customer does not exist, Create customer in Vend.
    if(!data.vendCustomerId || (typeof data.vendCustomerId === 'string' && data.vendCustomerId.trim().length === 0)){
      // if(data.packageId || data.vendCustomerId === previousData.vendCustomerId || data.vendCustomerId.trim().length === 0){
      const email = data.email && typeof data.email === 'string' && data.email.length > 0 ? data.email.toLowerCase() : null;
      const firstName = data.name;
      const lastName = ' ';
      if(email && firstName){
        const vendCustomersQuery = admin.firestore().collection('vendCustomers').where('email', '==', email).get();
        return vendCustomersQuery.then(querySnapshot => {
          if(querySnapshot.empty){
            //push to vend
            var rp = require('request-promise');
            var options = { method: 'POST',
              url: 'https://bfitness.vendhq.com/api/2.0/customers',
              auth: {
                bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
              },
              body:{
                first_name : firstName,
                last_name : lastName,
                email : email,
                phone : data.phone,
                customer_group_id : '0af7b240-aba0-11e7-eddc-d511a1c39612'
              },
              json:true
            };

            console.log('creating vend customer Id: ', email);
            return rp(options);

          }
          else{
            // going here?
            console.log('query snapshot is not empty');
            // return Promise.resolve();
            // return; // 29/7/2020
            var vendId = null;
            querySnapshot.forEach(doc=>{
              // console.log('theId: ', doc.id);
              vendId = doc.id;
            });
            return currentUserRef.update({vendCustomerId:vendId});
            // return;
          }


          // querySnapshot.forEach(doc=>{
          //
          // });
        });
      }else{
        console.log('no email & firstname');
        return Promise.resolve();
      }
    }

    const email = data.email;
    const prevEmail = previousData && previousData.email;
    const normalizedEmail = email && typeof email === 'string' && email.length > 0 ? email.toLowerCase() : null;
    const firstName = data.name;
    const lastName = ' ';
    const phone = data.phone;
    const vendCustomerId = data.vendCustomerId;
    const promoJan2020 = data.promoJan2020||null;

    // console.log('prevEmail: ', prevEmail);
    // for CRO user change the email address, update the changes to vend
    if (email && normalizedEmail && (normalizedEmail!==prevEmail) && vendCustomerId){
      // console.log('updated email: ', normalizedEmail);
      // check the email is already exist
      const vendCustomerPrevEmailQuery = admin.firestore().collection('vendCustomers').where('email', '==', prevEmail).get();
      const vendCustomerAfterEmailQuery = admin.firestore().collection('vendCustomers').where('email', '==', normalizedEmail).get();

      return Promise.all([vendCustomerPrevEmailQuery, vendCustomerAfterEmailQuery]).then((results) => {

        const prevEmailQuery = results[0];
        const afterEmailQuery = results[1];

        if (!afterEmailQuery.empty){
          console.log('no email updates, revert back to the old email')
          // return change.after.ref.update({email:prevEmail});
          return Promise.resolve();
        }
        else{
          console.log('updating the existing vend user email ', normalizedEmail);
          var rp2 = require('request-promise');
          var optionsEdit = vendCustomerEditOption(firstName, lastName, normalizedEmail, phone, '0af7b240-aba0-11e7-eddc-d511a1c39612', vendCustomerId);
          return rp2(optionsEdit);
        }
          // var rp2 = require('request-promise');
          // var optionsEdit = vendCustomerEditOption(firstName, lastName, normalizedEmail, phone, '0af7b240-aba0-11e7-eddc-d511a1c39612', vendCustomerId);
          // return rp2(optionsEdit);
      });
    }

    // checking the database from pakages, user vendsales record, payment record
    const packagesQuery = admin.firestore().collection('packages').get();
    const vendSalesQuery = admin.firestore().collection('vendSales').where('customer_id', '==', data.vendCustomerId).get();
    const paymentsQuery = admin.firestore().collection('payments').where('userId', '==', change.after.id).where('type', '==', 'membership').get();
    const membershipEndField = data && data.membershipEnds;
    // console.log('membershipEndField: ', moment(getTheDate(membershipEndField)).format('YYYY-MM-DD'));

    return Promise.all([packagesQuery, vendSalesQuery, paymentsQuery]).then((results) => {
      // console.log('results');
      const packagesResults = results[0];
      const vendSalesResults = results[1];
      const paymentsResults = results[2];

      var productIdPackageMap = {};
      packagesResults.forEach(doc=>{
        const data = doc.data();
        const vendProductIds = data && data.vendProductIds;

        vendProductIds && vendProductIds.map(vendProductId=>{
          productIdPackageMap[vendProductId] = doc.id;
          return null;
        });
      });

      var packageId = null;
      // if ((data.promoJan2020 && data.promoJan2020>=4) || (data.promoAug2020 && data.promoAug2020>=4)){

      // }
      if(data.packageLocked){
        packageId = data.packageId;
      }
      else if (data.complimentaryPromo){
        packageId = 'L6sJtsKG68LpEUH3QeD4';
      }
      else if (data.promoJan2020 || data.promoAug2020 || data.promoMidSep2020 || data.promoSep2020){
        packageId = data.packageId; // enable the memberconversion API
      }
      else{
        vendSalesResults.forEach(doc=>{

          if(doc.data().status !== 'CLOSED' && doc.data().status !== 'ONACCOUNT'){
            return;
          }

          const data = doc.data();
          const lineItems = data.line_items;
          const registerSaleProducts = data.register_sale_products;
          const items = lineItems ? lineItems : (registerSaleProducts?registerSaleProducts : null);

          // checking for the product that been sold
          items && items.map(registerSaleProduct=>{
            const productId = registerSaleProduct.product_id; //same like packageID
            const pId = productIdPackageMap[productId];
            if(pId){
              // console.log("package", pId);
              packageId = pId;
            }
            return null;
          });

          return;
        });

        // search from the payment database
        paymentsResults.forEach(doc=>{
          // console.log('thePaymentResult: ', doc.data());
          // if payment is not valid
          if(doc.data().status && (doc.data().status !== 'CLOSED' && doc.data().status !== 'ONACCOUNT')){
            return;
          }
          if(doc.data().packageId){
            packageId = doc.data().packageId;
          } 
        });
      }
      //check if User packages is updated through vend and adyen sales.
      var updates = {packageId : packageId}; // update the packageId based from payment record (if it is exist)
      //To check and update membership updates.
      const membershipStarts = data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;

      //possibility, if no 'membershipStarts', 'autoMembershipEnds' will never occured
      if (membershipStarts && membershipEndField && packageId==='yKLfNYOPzXHoAiknAT24'){
        // skip payment
        console.log('skip checking for payment for complimentary')
        updates.membershipEnds = membershipEndField;
      }
      else if(membershipStarts){
        var paymentsForUser = [];
        paymentsResults.forEach(doc=>{
          // console.log('paymentsResultsData: ', doc.data());
          const inValidPayment = doc.data().status && (doc.data().status !== 'CLOSED' && doc.data().status !== 'ONACCOUNT' && doc.data().status !== 'LAYBY_CLOSED');
          const inValidAdyenPayment = doc.data().source? doc.data().source === 'adyen'? (doc.data().totalPrice === '0' || doc.data().totalPrice === 0)? true:false:false:false;
          if(inValidPayment || inValidAdyenPayment){
            return;
          }
          paymentsForUser.push(doc.data());
        });
        // sort the payment data
        paymentsForUser.sort((a,b)=>{
          var dateA = a.createdAt;
          var dateB = b.createdAt;
          if (dateA < dateB) {
            return -1;
          }
          if (dateA > dateB) {
            return 1;
          }
          return 0;
        });

        console.log('paymentsForUser: ', paymentsForUser);

        var years = 0;
        var months = 0;
        var endMoment = moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').startOf('day');
        // console.log('momentMembershipStart: ', endMoment.format('DD MM YYYY'));

        //total up paid membership months without freeze
        paymentsForUser.forEach(payment=>{
          // console.log('modifyUserPayment: ', payment);
          if(payment.source === 'freeze'){
            return;
          }
          const renewalTerm = payment.renewalTerm ? payment.renewalTerm : 'month';
          const quantity = payment.quantity ? payment.quantity : 1;
          if((renewalTerm === 'year') || (renewalTerm === 'yearly')){
            years += 1;
          }else if((renewalTerm === 'biyear') || (renewalTerm === 'biyearly')){
            months += 6*quantity;
          }else if(renewalTerm === 'quarterly'){
            months += 3*quantity;
          }else if(renewalTerm === '4monthly'){
            months += 4*quantity;
          }else if((renewalTerm === 'month')||(renewalTerm === 'monthly')){
            months += quantity;
          }
        });

        // console.log('theMonth: ', months);
        // console.log('years: ', years);
        endMoment.add(moment.duration({months:months, years:years}));
        console.log('theEndMoment: ', endMoment);
        
        //add total freeze months to above
        paymentsForUser.forEach(payment=>{
          const freezeFor = getTheDate(payment.freezeFor);
          const freezeEnd = getTheDate(payment.freezeEnd);
          const quantity = (payment && payment.quantity)? payment.quantity:1;
          // console.log('thepaymentSource: ', payment.source);
          // if(payment.source === 'freeze' && freezeFor && moment(freezeFor).isSameOrBefore(endMoment)){
          //   console.log('addFreeze month: ', endMoment.tz('Asia/Kuala_Lumpur').toDate());
          //   endMoment.add(moment.duration({months:1}));
          // }
          // if (payment.source === 'freeze' && freezeFor && freezeEnd){
          //   const dayDiff = Math.max(moment(freezeEnd).diff(freezeFor, 'days'));
          //   // console.log('dayDiff: ', dayDiff);
          //   endMoment.add(moment.duration({days:dayDiff}));
          //   // console.log('addFreeze month: ', endMoment.tz('Asia/Kuala_Lumpur').toDate());
          // }
          if(payment.source === 'freeze' && freezeFor){
            // console.log('addFreeze month: ', endMoment.tz('Asia/Kuala_Lumpur').toDate());
            endMoment.add(moment.duration({months:quantity}));
          }
        });

        const autoMembershipEnds = endMoment.tz('Asia/Kuala_Lumpur').toDate();
        // console.log('autoMembershipEnds: ', endMoment.tz('Asia/Kuala_Lumpur').format('DD MM YYYY'))
        if(moment(getTheDate(membershipStarts)).isSame(moment(autoMembershipEnds), 'day')){
          updates.autoMembershipEnds = null;
        }
        else if ((packageId === 'L6sJtsKG68LpEUH3QeD4' || packageId === 'yKLfNYOPzXHoAiknAT24') && membershipEndField) {
          updates.autoMembershipEnds = membershipEndField;
        }
        else{
          updates.autoMembershipEnds = autoMembershipEnds;
        }
      }
      // no membership start, add membershipstart 28/7/2020
      // else{
      //   var paymentsForUser2 = [];
      //   paymentsResults.forEach(doc=>{
      //     // console.log('paymentsResultsData: ', doc.data());
      //     const inValidPayment = doc.data().status && (doc.data().status !== 'CLOSED' && doc.data().status !== 'ONACCOUNT' && doc.data().status !== 'LAYBY_CLOSED');
      //     const inValidAdyenPayment = doc.data().source? doc.data().source === 'adyen'? (doc.data().totalPrice === '0' || doc.data().totalPrice === 0)? true:false:false:false;
      //     if(inValidPayment || inValidAdyenPayment){
      //       return;
      //     }
      //     paymentsForUser2.push(doc.data());
      //   });
      //   // if valid payment found, add membership start
      //   if (paymentsForUser2.length>0){
      //     updates.autoMembershipStarts = data.joinDate? data.joinDate: timestamp;
      //   }
      // }

      const is3MthPkg = get3Mpkgs(packageId);
      // console.log('endMomentFaizul: ', endMoment);
      // console.log('theENdMOment: ', endMoment.isBefore(moment().tz('Asia/Kuala_Lumpur').startOf('day').subtract(0,'days')));

      if(packageId && (packageId !== 'yKLfNYOPzXHoAiknAT24')) {
        console.log("updating user", change.after.id, updates);
        return change.after.ref.update(updates);
      }
      else if (packageId === 'yKLfNYOPzXHoAiknAT24'){
        console.log("updating complimentary user", change.after.id, updates);
        return change.after.ref.update(updates);
      }
      // else if (packageId !== 'L6sJtsKG68LpEUH3QeD4'){
      //   return change.after.ref.update(updates);
      // }
      // else if (is3MthPkg && endMoment.isBefore(moment().tz('Asia/Kuala_Lumpur').startOf('day').subtract(0,'days'))){
      //   console.log('convert to monthly pkg');
      //   updates.packageId = 'vf2jCUOEeDDiIQ0S42BJ'; // convert to monthly package
      //   return change.after.ref.update(updates);
      // }
      else{
        console.log("no updates", change.after.id, updates);
        return Promise.resolve();
      }
    });
  }
);

function get3Mpkgs(pkgId){
  const ThreeStepPkgIdAllClub = 'LNGWNSdm6kf4rz1ihj0i';
  const ThreeStepPkgIdSingle = 'k7As68CqGsFbKZh1Imo4';
  const threeMonthTermPkg = 'w12J3n9Qs6LTViI6HaEY';
  const threeTermMembershipPkg = 'aTHIgscCxbwjDD8flTi3';
  const threeMTermMembership = 'yQFACCzpS4DKcDyYftBx';
  if (pkgId === ThreeStepPkgIdAllClub || pkgId === ThreeStepPkgIdSingle || pkgId === threeMonthTermPkg ||
    pkgId === threeTermMembershipPkg || pkgId === threeMTermMembership){
      return true;
  }
  else{
    return false;
  }
}

function isPromoPackage(pkgId){
  const threeMJan2020PromoAllClubs = 'LNGWNSdm6kf4rz1ihj0i'; //3M Jan2020 Promo (All Clubs)
  const threeMAug2020PromoSingle = 'AHgEEavKwpJoGTMOzUdX'; // 3M August 2020 (single access)
  const threeMAug2020PromoAllCLubs = 'YsOxVJGLRXrHDgNTBach'; // 3M August 2020 (all access)
  const threeMJan2020PromoSingle = 'k7As68CqGsFbKZh1Imo4'; // 3M Jan2020 Promo (Single Club)
  const threeMjan2020PromoSingle2 = 'w12J3n9Qs6LTViI6HaEY'; // 3M Jan2020 Promo (Single Club).
  const threeMMidSepPromoSingle = 'hUZjGJR77bP30I3fjvwD' // 3M Mid September 2020 (single access)
  const threeMMidSepPromoAllAccess = 'kh513XOaG7eLX4z9G0Ft' // 3M Mid September 2020 (all access)
  const threeMSepPromoUNO = 'uQO2UsaRiqXtzPKjTSIS' // Babel UNO! 4M September Promo

  if (pkgId === threeMJan2020PromoAllClubs || pkgId === threeMAug2020PromoSingle || pkgId === threeMAug2020PromoAllCLubs ||
    pkgId === threeMJan2020PromoSingle || pkgId === threeMjan2020PromoSingle2 ||
    pkgId === threeMMidSepPromoSingle || pkgId === threeMMidSepPromoAllAccess ||
    pkgId === threeMSepPromoUNO
    ){
      return true;
  }
  else{
    return false;
  }
}

// function get3MSInglepkgs(pkgId){
//   const ThreeStepPkgIdSingle = 'k7As68CqGsFbKZh1Imo4';
//   const threeMonthTermPkg = 'w12J3n9Qs6LTViI6HaEY';
//   const threeTermMembershipPkg = 'aTHIgscCxbwjDD8flTi3';
//   const threeMTermMembership = 'yQFACCzpS4DKcDyYftBx';
//   if (pkgId === ThreeStepPkgIdSingle || pkgId === threeMonthTermPkg ||
//     pkgId === threeTermMembershipPkg || pkgId === threeMTermMembership){
//       return true;
//   }
//   else{
//     return false;
//   }
// }

exports.modifyVendCustomer = functions.firestore
  .document('vendCustomers/{vendCustomerId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = (change.after && change.after.exists) ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    if (document && document.deleted_at && document.id){
      return admin.firestore().collection('users').where('vendCustomerId', '==', document.id).delete().then(function() {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
    // perform desired operations ...
    else if (document) {
      let {
        id,
        email,
        first_name,
        last_name,
        name,
        date_of_birth,
        created_at,
        gender,
        mobile,
        custom_field_1
      } = document;
      console.log(email, first_name, last_name, name, date_of_birth, created_at, gender, mobile, custom_field_1);
      if (email && typeof email === 'string' && email.trim().length > 0 && (name || first_name || last_name)) {
        // console.log('has email', email);
        const vendCustomerData = {
          vendCustomerId: id,
          email: email.trim().toLowerCase(),
          firstName: first_name ? first_name : null,
          lastName: last_name ? last_name : null,
          name: name ? name : (first_name ? first_name : '') + ' ' + (last_name ? last_name : ''),
          dateOfBirth: (date_of_birth && date_of_birth.length > 0) ? new Date(date_of_birth) : null,
          joinDate: (created_at && created_at.length > 0) ? new Date(created_at) : timestamp,
          gender: gender === 'M' ? 'male' : (gender === 'F' ? 'female' : null),
          phone: typeof mobile === 'string' && mobile.replace(/-/g, '').trim().length > 0 ? mobile.replace(/-/g, '').trim() : null,
          // ic number checking?
          nric: typeof custom_field_1 === 'string' && custom_field_1.replace(/-/g, '').trim().length > 0 && /^\d+$/.test(custom_field_1.replace(/-/g, '').trim()) ? custom_field_1.replace(/-/g, '').trim() : null,
          passport: typeof custom_field_1 === 'string' && custom_field_1.replace(/-/g, '').trim().length > 0 && /^\d+$/.test(custom_field_1.replace(/-/g, '').trim()) === false ? custom_field_1.replace(/-/g, '').trim() : null
        }
        // console.log(vendCustomerData);

        var userUpdates = {};
        return admin.firestore().collection('users').where('email', '==', vendCustomerData.email).get().then((querySnapshot) => {
          console.log('found users');
          const batch = admin.firestore().batch();
          var updateCount = 0;
          querySnapshot.forEach(doc => {
            updateCount += 1;
            const userData = doc.data();
            // const email = userData && userData.email;
            // const firstName = userData && userData.firstName;
            // const lastName = userData && userData.lastName;
            // const name = userData && userData.name;
            // const dateOfBirth = userData && userData.dateOfBirth;
            // const gender = userData && userData.gender;
            // userUpdates.email = email;
            // userUpdates.name = name;
            // userUpdates.gender = gender;
            // userUpdates.phone = mobile;
            // var userUpdates = {};
            Object.keys(vendCustomerData).map(key => {
              const value = vendCustomerData[key];
              // console.log('key: ', key);
              if (key !== 'email') {
                if (value) {
                  userUpdates[key] = value;
                }
              }
            // console.log('userUpdates: ', userUpdates);
            //   return null;
            });

          
            if (Object.keys(userUpdates).length > 0) {
              batch.update(doc.ref, userUpdates);
            }

          });

          console.log('update count: ', updateCount);
          if (updateCount === 0) {
            batch.set(admin.firestore().collection('users').doc(), vendCustomerData);
          }
          console.log("User updates:", userUpdates, updateCount);
          return batch.commit();
        });
      }
    }
    return Promise.resolve();
  });

exports.modifyVendSale = functions.firestore
  .document('vendSales/{vendSaleId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = (change.after && change.after.exists) ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    // perform desired operations ...
    if (document) {
      let {
        customer_id,
        totals,
        total_price,
        created_at,
        line_items,
        register_sale_products,
        id,
        status
      } = document;

      // console.log('document: ', document);

      // console.log(email, first_name, last_name, name, date_of_birth, created_at, gender, mobile, custom_field_1);
      if (customer_id && typeof customer_id === 'string' && customer_id.trim().length > 0) {
        // console.log('has customer_id', customer_id);

        const items = line_items ? line_items : (register_sale_products ? register_sale_products : null);
        const vendSaleId = id;

        const packagesQuery = admin.firestore().collection('packages').get();
        const paymentsQuery = admin.firestore().collection('payments').where('vendSaleId', '==', vendSaleId).get();
        const usersQuery = admin.firestore().collection('users').where('vendCustomerId', '==', customer_id).get();

        return Promise.all([packagesQuery, paymentsQuery, usersQuery]).then(results => {
          console.log('found users');
          const batch = admin.firestore().batch();
          // var updateCount = 0;

          const usersResults = results[2];
          var userId = null;
          usersResults.forEach(doc => {
            // updateCount += 1;
            userId = doc.id;
            var userData = doc.data();
            var totalPayments = userData && userData.totalPayments ? parseFloat(userData.totalPayments) : 0.0;
            const totalPrice = totals && totals.total_payment ? totals.total_payment : (total_price ? total_price : '0.0');
            const remarks = userData? userData.remarks? userData.remarks: " " : " ";
            totalPayments += parseFloat(totalPrice);

            items.forEach(item=>{
              // console.log('modifyVendSale Item: ', item);
              const vendProductId = item.product_id;
              if (vendProductId === 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7' && (totalPayments<=0 || !totalPayments)){
                batch.update(doc.ref, {complimentaryPromo:remarks});
              }
            });

            console.log("User total spent:", doc.id, totalPayments);
            batch.update(doc.ref, {totalPayments:totalPayments});
          });

          const packagesResults = results[0];
          var packageMap = {};
          var productIdPackageMap = {};
          packagesResults && packagesResults.forEach(doc=>{
            const data = doc.data();
            packageMap[doc.id] = data;
            const vendProductIds = data && data.vendProductIds;
            // console.log('vendProductId: ', data);
            vendProductIds && vendProductIds.forEach(vendProductId=>{
              productIdPackageMap[vendProductId] = doc.id;
            })
          });

          console.log('productIdPackageMap: ', productIdPackageMap);

          const paymentsResults = results[1];
          var existingPayments = [];
          paymentsResults.forEach(doc=>{
            existingPayments.push(doc);
          });

          var updateCount = 0;
          var newPaymentCount = 0;

          items.forEach(item=>{
            console.log('modifyVendSale Item: ', item);
            const vendProductId = item.product_id;
            const totalPrice = (item.price&& item.tax)? (parseFloat(item.price) + parseFloat(item.tax)).toFixed(2) : item.total_price? item.total_price : null;
            const packageId = productIdPackageMap[vendProductId];
            console.log('modifyVendPackageId: ', packageId);
            const packageData = packageMap[packageId];
            if (packageId === '89THMCx0BybpSVJ1J8oz'){
              console.log('packageData: ', packageData);
            }
            const quantity = item.quantity;
            const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
            // console.log('renewalTerm: ', renewalTerm);
            // console.log('renewalTermPkg: ', packageData && packageData.renewalTerm);

            if(packageId){

              var paymentRefs = [];
              existingPayments.forEach(existingPayment=>{

                // console.log('existingPayments: ', existingPayment);

                // const existingVendSaleId = existingPayment.vendSaleId;
                const existingVendSaleId = existingPayment.get('vendSaleId')? existingPayment.get('vendSaleId'):existingPayment.vendSaleId?existingPayment.vendSaleId:null;
                console.log('existingVendSaleId: ', existingVendSaleId);

                if(existingVendSaleId === vendSaleId){
                  paymentRefs.push(existingPayment);
                }
              });

              if(paymentRefs.length < quantity){
                for(var i=0; i < quantity; i++){
                  const paymentRef = admin.firestore().collection('payments').doc();
                  paymentRefs.push(paymentRef);
                }
              }

              paymentRefs.forEach(paymentRef=>{
                var data = paymentRef.exists && paymentRef.data();
                if(!data){
                  newPaymentCount += 1;
                  data = {
                    createdAt : moment(getTheDate(created_at)).toDate(),
                    totalPrice : totalPrice ? totalPrice : 0,
                    type : 'membership',
                    userId : userId,
                    packageId : packageId,
                    source : 'vend',
                    vendProductId : vendProductId,
                    vendSaleId : vendSaleId,
                    renewalTerm : renewalTerm,
                    status : status
                  }
                  console.log('Creating payment', paymentRef.id, vendSaleId, userId);
                  // data.status = status;
                  batch.set(paymentRef, data);
                }else{
                  
                  console.log('Updating existing payment', paymentRef.id, vendSaleId, userId);
                  updateCount += 1;
                  const updatedData = {
                    createdAt : moment(getTheDate(created_at)).toDate(),
                    totalPrice : totalPrice ? totalPrice : 0,
                    type : 'membership',
                    userId : userId,
                    packageId : packageId,
                    source : 'vend',
                    vendProductId : vendProductId,
                    vendSaleId : vendSaleId,
                    renewalTerm : renewalTerm,
                    status : status
                  };
                  batch.update(admin.firestore().collection('payments').doc(paymentRef.id), updatedData);
                }
              });

              // for (var i = 0; i < quantity; i++) {
              //   var paymentData;
              //
              //
              //
              //   if(existingPayments.length < i){
              //     const existingPayment = existingPayments[i];
              //     paymentRef = existingPayment.ref;
              //     paymentData = existingPayment.data();
              //     paymentData.status = status;
              //     console.log('Updating existing payment', paymentRef.id, vendSaleId, userId);
              //   }else{
              //     paymentRef = admin.firestore().collection('payments').doc();
              //     paymentData = {
              //       createdAt : moment(created_at).toDate(),
              //       totalPrice : totalPrice ? totalPrice : 0,
              //       type : 'membership',
              //       userId : userId,
              //       packageId : packageId,
              //       source : 'vend',
              //       vendProductId : vendProductId,
              //       vendSaleId : vendSaleId,
              //       renewalTerm : renewalTerm,
              //       status : status
              //     }
              //     console.log('Creating payment', paymentRef.id, vendSaleId, userId);
              //   }
              //   batch.set(paymentRef, paymentData);
              // }
            }
          });

          if (updateCount>0 || newPaymentCount>0){
            return batch.commit();
          }
          else{
            return null;
          }
        });
      }
    }
    return Promise.resolve();
});

// vendSaleV2
exports.modifyVendSaleV2 = functions.firestore
  .document('vendSalesV2/{vendSaleId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const document = (change.after && change.after.exists) ? change.after.data() : null;

    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    // perform desired operations ...
    if (document) {
      let {
        customer_id,
        //totals,
        total_price,
        total_price_incl,
        total_tax,
        created_at,
        line_items,
        register_sale_products,
        register_id,
        invoice_number,
        id,
        status
      } = document;

      // console.log('document: ', document);

      // console.log(customer_id, total_price, total_price_incl, total_tax, created_at, line_items, register_id, invoice_number, id, status);
      if (customer_id && typeof customer_id === 'string' && customer_id.trim().length > 0) {
        // console.log('has customer_id', customer_id);

        const items = line_items ? line_items : (register_sale_products ? register_sale_products : null);
        const vendSaleId = id;

        const packagesQuery = admin.firestore().collection('packages').get();
        const paymentsQuery = admin.firestore().collection('payments').where('vendSaleId', '==', vendSaleId).get();
        const usersQuery = admin.firestore().collection('users').where('vendCustomerId', '==', customer_id).get();

        return Promise.all([packagesQuery, paymentsQuery, usersQuery]).then(results => {
          console.log('found users');
          const batch = admin.firestore().batch();
          // var updateCount = 0;

          const usersResults = results[2];
          var userId = null;
          usersResults.forEach(doc => {
            // updateCount += 1;
            userId = doc.id;
            var userData = doc.data();
            var totalPayments = userData && userData.totalPayments ? parseFloat(userData.totalPayments) : 0.0;
            const totalPrice = total_price_incl? total_price_incl : '0.0';
            const remarks = userData? userData.remarks? userData.remarks: " " : " ";
            totalPayments += parseFloat(totalPrice);

            items.forEach(item=>{
              // console.log('modifyVendSale Item: ', item);
              const vendProductId = item.product_id;
              if (vendProductId === 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7' && (totalPayments<=0 || !totalPayments)){
                batch.update(doc.ref, {complimentaryPromo:remarks});
              }
            });

            console.log("User total spent:", doc.id, totalPayments);
            batch.update(doc.ref, {totalPayments:totalPayments});
          });

          const packagesResults = results[0];
          var packageMap = {};
          var productIdPackageMap = {};
          packagesResults && packagesResults.forEach(doc=>{
            const data = doc.data();
            packageMap[doc.id] = data;
            const vendProductIds = data && data.vendProductIds;
            console.log('vendProductId: ', data);
            vendProductIds && vendProductIds.forEach(vendProductId=>{
              productIdPackageMap[vendProductId] = doc.id;
            })
          });

          const paymentsResults = results[1];
          var existingPayments = [];
          paymentsResults.forEach(doc=>{
            existingPayments.push(doc);
          });

          var updateCount = 0;
          var newPaymentCount = 0;

          items.forEach(item=>{
            // console.log('modifyVendSale Item: ', item);
            const vendProductId = item.product_id;
            const totalPrice = (item.price&& item.tax)? (parseFloat(item.price) + parseFloat(item.tax)).toFixed(2) : item.total_price? item.total_price : null;
            const packageId = productIdPackageMap[vendProductId];
            // console.log('modifyVendPackageId: ', packageId);
            const packageData = packageMap[packageId];
            const quantity = item.quantity;
            const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';

            if(packageId){

              var paymentRefs = [];
              existingPayments.forEach(existingPayment=>{

                console.log('existingPayments: ', existingPayment);

                // const existingVendSaleId = existingPayment.vendSaleId;
                const existingVendSaleId = existingPayment.get('vendSaleId')? existingPayment.get('vendSaleId'):existingPayment.vendSaleId?existingPayment.vendSaleId:null;
                console.log('existingVendSaleId: ', existingVendSaleId);

                if(existingVendSaleId === vendSaleId){
                  paymentRefs.push(existingPayment);
                }
              });

              if(paymentRefs.length < quantity){
                for(var i=0; i < quantity; i++){
                  const paymentRef = admin.firestore().collection('payments').doc();
                  paymentRefs.push(paymentRef);
                }
              }

              paymentRefs.forEach(paymentRef=>{
                var data = paymentRef.exists && paymentRef.data();
                if(!data){
                  newPaymentCount += 1;
                  data = {
                    createdAt : moment(getTheDate(created_at)).toDate(),
                    totalPrice : total_price_incl ? total_price_incl : 0,
                    tax: total_tax,
                    type : 'membership',
                    userId : userId,
                    packageId : packageId,
                    source : 'vend',
                    vendProductId : vendProductId,
                    vendSaleId : vendSaleId,
                    renewalTerm : renewalTerm,
                    status : status
                  }
                  console.log('Creating payment', paymentRef.id, vendSaleId, userId);
                  // data.status = status;
                  batch.set(paymentRef, data);
                }else{
                  
                  console.log('Updating existing payment', paymentRef.id, vendSaleId, userId);
                  updateCount += 1;
                  const updatedData = {
                    createdAt : moment(getTheDate(created_at)).toDate(),
                    totalPrice : total_price_incl ? total_price_incl : 0,
                    tax: total_tax,
                    type : 'membership',
                    userId : userId,
                    packageId : packageId,
                    source : 'vend',
                    vendProductId : vendProductId,
                    vendSaleId : vendSaleId,
                    renewalTerm : renewalTerm,
                    status : status
                  };
                  batch.update(admin.firestore().collection('payments').doc(paymentRef.id), updatedData);
                }
              });
            }
          });

          if (updateCount>0 || newPaymentCount>0){
            return batch.commit();
          }
          else{
            return null;
          }
        });
      }
    }

    return Promise.resolve();
});

// for successfull virtual PT transaction
exports.addVirtualPTPaymentToSlack = functions.firestore
  .document('payments/{paymentId}')
  // .onWrite((change, context) => {
  .onCreate((snap, context) => {
    const document = snap.data();
    // const document = (change.after && change.after.exists) ? change.after.data() : ((change.before && change.before.exists) ? change.before.data() : null);
    if(!document){
      //deleted
      return null;
    }
    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    // perform desired operations ...
    const userId = document && document.userId;
    const vendProductId = document && document.vendProductId;
    const type = document && document.type;
    const trainerName = document && document.trainerName;
    const productName = document && document.productName;
    const promoType = document && document.promoType;

    // for virtual class
    const ighandlename = (document && document.ighandlename) || (document && document.ighandleName);
    const city = document && document.city;
    const phoneNum = document && document.phone;

    // for virtual online wellness
    const coachName = document && document.coachName;

    // for babel dance
    const instructorName = document && document.instructorName;
    const classRemark = document && document.classRemark;
    const classDate = document && document.classDate;
    const classTime = document && document.classTime;

    // for popupclass

    var request = require("request");

    if (userId && type === 'virtualTraining' && productName) {
      return admin.firestore().collection('users').doc(userId).get().then(doc=>{
        const data = doc.data();
        const email = data && data.email;
        const name = (data && data.name) || 'Customer';
        const phone = data && data.phone;
        return request.post(
          "https://hooks.slack.com/services/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",
          {json:{
            text:`New Virtual PT added, trainer: ${trainerName}, Product Name: ${productName}, please contact ${name} via ${email} or ${phone}`}
          }
        );
      });

      // var request = require("request");
      // return request.post(
      //   "https://hooks.slack.com/services/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",
      //   {json:{text:`New Virtual PT added, trainer: ${trainerName}, Product Name: ${productName}`}}
      // );
    
    }
    else if (userId && type === 'virtualClass'){
      return admin.firestore().collection('users').doc(userId).get().then(doc=>{
        const data = doc.data();
        const email = data && data.email;
        const name = (data && data.name) || 'Customer';
   
        return request.post(
          "https://hooks.slack.com/services/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",
          {json:{
            text:`${name} with ig handle name ${ighandlename} just bought a virtual class, Product Name: ${productName}, please contact ${email} or ${phoneNum}`}
          }
        );
      });
    }

    else if (userId && type === 'onlinemywellness'){
      return admin.firestore().collection('users').doc(userId).get().then(doc=>{
        const data = doc.data();
        const email = data && data.email;
        const name = (data && data.name) || 'Customer';
    
        return request.post(
          "https://hooks.slack.com/services/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",
          {json:{
            text:`New Babel At Home added, VPT Trainer Name: ${trainerName}, Nutrition Coach Name: ${coachName}, Product Name: ${productName}, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
          }
        );
      });
    }
    else if (userId && type === 'babelDance'){
      return admin.firestore().collection('users').doc(userId).get().then(doc=>{
        const data = doc.data();
        const email = data && data.email;
        const name = (data && data.name) || 'Customer';
        if (instructorName){
          return request.post(
            "https://hooks.slack.com/services/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",
            {json:{
              text:`${email} just bought a Babel Dance pass ${classRemark}, Instructor Name: ${instructorName}, Class Date: ${classDate}, Class Time: ${classTime}, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
            }
          );
        }
        else{
          return request.post(
            "https://hooks.slack.com/services/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",
            {json:{
              text:`${email} just bought a popup class, Class Date: 19/09/2020, please contact ${name} via ${email} or ${phoneNum} or  IG ${ighandlename}`}
            }
          );
        }
      });
    }
    else if (userId && (vendProductId === unlimitedOutdoorClassVendProductId)){
      return admin.firestore().collection('users').doc(userId).get().then(doc=>{
        const data = doc.data();
        const email = data && data.email;
        const name = (data && data.name) || 'Customer';

        return request.post(
          " https://hooks.slack.com/services/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",
          {json:{
            text:`${name} (${email}) just bought ${productName}.`}
          }
        );
      });
    }
    // else if (userId && promoType){
    //   return admin.firestore().collection('users').doc(userId).get().then(doc=>{
    //     const data = doc.data();
    //     const email = data && data.email;
    //     const name = (data && data.name) || 'Customer';

    //     return request.post(
    //       " https://hooks.slack.com/services/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",
    //       {json:{
    //         text:`${name} (${email}) has successfully bought ${productName}.`}
    //       }
    //     );
    //   });
    // }
    else{return Promise.resolve()}
  }
);

exports.modifyPayment = functions.firestore
  .document('payments/{paymentId}')
  .onWrite((change, context) => {

    const document = (change.after && change.after.exists) ? change.after.data() : ((change.before && change.before.exists) ? change.before.data() : null);
    if(!document){
      //deleted
      return null;
    }
    // Get an object with the previous document value (for update or delete)
    // const oldDocument = event.data.previous.data();

    // perform desired operations ...
    const userId = document && document.userId;
    const vendProductId = document && document.vendProductId;
    const type = document && document.type;

    if (userId && (type !== 'personalTraining')) {
      console.log("Payment updated - touching userId", userId);
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      let updatedPayment = {paymentsUpdatedAt:timestamp};
      // if payment were made, which is not complimentary month and membership type, change complimentary promo to false
      if (vendProductId !== 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7' && type === 'membership'){
        updatedPayment = {
          paymentsUpdatedAt:timestamp,
          complimentaryPromo:admin.firestore.FieldValue.delete(), 
        }
      }
      return admin.firestore().collection('users').doc(userId).update(updatedPayment);
    }

    else if (type === 'personalTraining'){
      console.log('personal training type: ', type);
      const paymentRef = admin.firestore().collection('payments').where('userId', '==', userId).where('type', '==', 'personalTraining').get();

      return Promise.all([paymentRef]).then(result=>{
        const paymentResult = result[0];
        var totalAcuityCredit = 0;

        paymentResult && paymentResult.forEach(doc=>{
          const paymentData = doc.data();
          const credit = paymentData.credit;
          const status = paymentData.status;
          const userId = paymentData.userId;
          if (credit && (status==='CLOSED') && userId){
            totalAcuityCredit = totalAcuityCredit + credit;
          }
        });

        // console.log('totalAcuityCredit: ', totalAcuityCredit);

        const updatedPayment = {
          paymentsUpdatedAt:timestamp,
          totalAcuityCredit:totalAcuityCredit
        }

        return admin.firestore().collection('users').doc(userId).update(updatedPayment);
      });    
    }
    else{
      //get vendSale
      const vendSaleId = document.vendSaleId;
      var vendCustomerId = null;
      if(vendSaleId){
        return admin.firestore().collection('vendSales').doc(vendSaleId).get().then(doc=>{
          const data = doc.data();
          vendCustomerId = data && data.customer_id;
          if(vendCustomerId){
            return admin.firestore().collection('vendCustomers').doc(vendCustomerId).get();
          }
          return null;
        }).then(doc=>{
          if(doc){
            const data = doc.data();
            const email = data && data.email;
            const processedEmail = email && email.trim().toLowerCase();
            if(processedEmail && processedEmail.length > 0){
              return admin.firestore().collection('users').where('email', '==', processedEmail).get()
            }
          }
          return null
        }).then(docs=>{
          if(docs){
            var updateCount = 0;
            const batch = admin.firestore().batch();
            docs.forEach(doc => {
              updateCount += 1;
              batch.update(doc.ref, {vendCustomerId:vendCustomerId});
            });
            if(updateCount > 0){
              return batch.commit();
            }
          }
          return null
        });
      }

      return Promise.reject(new Error("No userId for payment", document.id));
    }
  }
);


// for unlimited outdoor class product
// const unlimitedOutdoorClassVendProductId = '347cf233-d5d7-f452-dd2b-f533f7271a04';
const unlimitedOutdoorClassVendProductId = '629f766f-578d-f239-293b-fb8a016147b8';
const virtualDancePassVendProductId = '948feb3c-0447-0723-6817-5e4ab7daa399';

// Once the generateInvoices function is called, any changes in invoices db will update the user db
// and sendreceipt email to the user if it is paid.
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
  const packageId = afterData && afterData.packageId;
  const quantity = (afterData && afterData.quantity)? afterData.quantity:1;
  // const is3MthPkg = get3Mpkgs(packageId);
  const is3MKLCCPkg = packageId && is3MonthKLCCPackage(packageId);
  const is3MTTDIPkg = packageId && is3MonthTTDIPackage(packageId);
  const allAccessMonthlyDefaultPkg = 'TJ7Fiqgrt6EHUhR5Sb2q'; //330
  const singleAccessMonthlyDefaultPkg = 'vf2jCUOEeDDiIQ0S42BJ'; //250
  // const covertedPkgId = (packageId && is3MKLCCPkg)? allAccessMonthlyDefaultPkg : singleAccessMonthlyDefaultPkg;
  // for jan2020 and aug2020 promo, convert it to either single or all access
  const covertedPkgId = convertToSingleOrAllAccessPkg(packageId);  
  
  const type = afterData && afterData.type;
  const selectedAMPM = afterData && afterData.selectedAMPM;
  const selectedDay = afterData && afterData.selectedDay;
  const trainerName = afterData && afterData.trainerName;
  const vendProductId = afterData && afterData.vendProductId;
  // for virtual class
  const city = afterData && afterData.city;
  const ighandlename = afterData && (afterData.ighandlename || afterData.ighandleName);
  const phoneNum = afterData && afterData.phone;
  const selectedMemberOption = afterData && afterData.selectedMemberOption;
  // for online mywellness
  const coachName = afterData && afterData.coachName;
  // for babel dance
  const classDate = afterData && afterData.classDate;
  const classTime = afterData && afterData.classTime;
  const instructorName = afterData && afterData.instructorName;
  const classRemark = afterData && afterData.classRemark;
  // console.log('instructorName: ', instructorName);
  // console.log('classRemark: ', classRemark);

  if(!beforeRef.exists){
    //new
    console.log('no before ref data, no action');
    return Promise.resolve();
  }

  if(!afterRef.exists){
    //deleted
    console.log('no after ref data, no action');
    return Promise.resolve();
  }

  if(!beforeData.paid && afterData.paid && !afterData.receiptMailed && (type==='virtualTraining' || type==='onlinemywellness' || type==='virtualClass' || type==='babelDance')){
    return admin.firestore().collection('users').doc(userId).get().then(doc=>{
      const data = doc.data();
      const email = data && data.email;
      const name = (data && data.name) || 'Customer';
      const date = afterData.createdAt && moment(getTheDate(afterData.createdAt)).format('MMM YYYY');
      const phone = data && data.phone;
    
      var isklccProduct = vendProductId && (vendProductId === '2b3680b6-0c48-3e9f-fb88-e5b7827d046f' || 
      vendProductId === '2bbc5ceb-d5fb-ae53-4805-06025dbef4bd' || vendProductId === '6567972e-d12e-b51a-76cf-9972d47d54d2');

      if (type==='virtualTraining'){
        return sendVirtualTrainerEmail(email, name, totalPrice, afterRef.id, date, selectedAMPM, selectedDay, trainerName, phone, isklccProduct);
      }
      else if (type==='onlinemywellness'){
        return sendVirtualWelnessEmail(email, name, totalPrice, afterRef.id, date, selectedAMPM, selectedDay, trainerName, coachName, phone, ighandlename);
      }
      else if (type==='virtualClass'){
        return sendReceiptEmailForVirtualClass(email, name, totalPrice, afterRef.id, date, city, ighandlename, phoneNum, selectedMemberOption);
      }
      else if(type==='babelDance' && classRemark){
        return sendDanceReceiptEmail(email, name, totalPrice, afterRef.id, date, ighandlename, city, classDate, classTime, instructorName, classRemark, phoneNum);
      }
      else{
        return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
      }
    }).then(()=>{
      return afterRef.ref.update({receiptMailed:true, receiptMailedAt:timestamp});
    }).then((doc)=>{
      // console.log('thedoc: ', doc);
      return null;
    });
  }

  // for product && memberships
  else if(!beforeData.paid && afterData.paid && !afterData.receiptMailed){
    //invoice marked as paid so send receipt if not yet mailed then update receiptMailed
    //retrieve user
    return admin.firestore().collection('users').doc(userId).get().then(doc=>{
      const data = doc.data();
      const email = data && data.email;
      const name = (data && data.name) || 'Customer';
      const date = afterData.createdAt && moment(getTheDate(afterData.createdAt)).add(3, 'days').format('MMM YYYY');
      const promoJan2020 = data && data.promoJan2020;
      const promoAug2020 = data && data.promoAug2020;
      const promoMidSep2020 = data && data.promoMidSep2020;
      // var promoJanValue = 1;
      
      if (promoJan2020 === 4){
        if(is3MTTDIPkg){
          return admin.firestore().collection('users').doc(userId).update({
            promoJan2020:promoJan2020+quantity,
            packageId:'vf2jCUOEeDDiIQ0S42BJ'
          })
          .then(()=>{return sendReceiptEmail(email, name, totalPrice, afterRef.id, date)})
        }
      }
      if ((promoJan2020 <= 4) && (is3MKLCCPkg || is3MTTDIPkg)){
        // console.log('promoJan: ', promoJan2020);
        // convert to monthly package
        if (promoJan2020 === 4){
          return admin.firestore().collection('users').doc(userId).update({
            // promoJan2020:admin.firestore.FieldValue.delete(),
            promoJan2020:promoJan2020+quantity,
            packageId:covertedPkgId
          })
          .then(()=>{return sendReceiptEmail(email, name, totalPrice, afterRef.id, date)})
        }
        else if (promoJan2020 <= 3){
          return admin.firestore().collection('users').doc(userId).update({promoJan2020:promoJan2020+quantity})
          .then(()=>{
            return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
          });
        }
        else{
          // app should not go here
          return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
        }
      }
      // for august promo
      else if ((promoAug2020 <= 3) && (packageId==='YsOxVJGLRXrHDgNTBach' || packageId==='AHgEEavKwpJoGTMOzUdX')){
        if (promoAug2020 === 3){
          return admin.firestore().collection('users').doc(userId).update({
            promoAug2020:promoAug2020+quantity,
            packageId:covertedPkgId
          })
          .then(()=>{return sendReceiptEmail(email, name, totalPrice, afterRef.id, date)})
        }
        else if (promoAug2020 <= 2){
          return admin.firestore().collection('users').doc(userId).update({promoAug2020:promoAug2020+quantity})
          .then(()=>{
            return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
          })
        }
        else{
          // app should not go here
          return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
        }
      }
      // for mid september promo
      else if ((promoMidSep2020 <= 3) && (packageId==='hUZjGJR77bP30I3fjvwD' || packageId==='kh513XOaG7eLX4z9G0Ft')){
        if (promoMidSep2020 === 3){
          return admin.firestore().collection('users').doc(userId).update({
            promoMidSep2020:promoMidSep2020+quantity,
            packageId:covertedPkgId
          })
          .then(()=>{return sendReceiptEmail(email, name, totalPrice, afterRef.id, date)})
        }
        else if (promoMidSep2020 <= 2){
          return admin.firestore().collection('users').doc(userId).update({promoMidSep2020:promoMidSep2020+quantity})
          .then(()=>{
            return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
          })
        }
        else{
          // app should not go here
          return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
        }
      }
      // for unlimited outdoor class
      else if (vendProductId === virtualDancePassVendProductId){
        // send this email to Billy, Tony, Kish, Lychee and Davids
        return sendDanceReceiptEmail(email, name, totalPrice, afterRef.id, date);
      }
       // for dance class
       else if (vendProductId === unlimitedOutdoorClassVendProductId){
        // send this email to Billy, Tony, Kish, Lychee and Davids
        return sendCutomReceiptEmail(email, name, totalPrice, afterRef.id, date);
      }
      else{
        // console.log('modifyInvoiceDate: ', date);
        return sendReceiptEmail(email, name, totalPrice, afterRef.id, date);
      }
    }).then(()=>{
      return afterRef.ref.update({receiptMailed:true, receiptMailedAt:timestamp});
    });

  }else{
    //do nothing
    return Promise.resolve();
  }
});


// cron job to convert from firestore to google drive
exports.uploadToDrive = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([usersQuery]).then(result=>{
    // var users = {};
    var users = [];
    const usersResults = result[0];
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        if (!cancelledMember && isExpiredMember){
          // users[user.id] = user.data();
          users.push(user.id, user.data());
        }
      }
    });
    console.log('theusers: ', users);

    const user_csvFormat = convertToCSV(users);
    console.log('user_csvFormat: ', user_csvFormat);
    var blob = new Blob([user_csvFormat], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "userWithoutFreeze.csv");
    return res.status(200).send({
      success:true,
      data: 'data',
      user_csvFormat
    });
  });
});

// JSON to CSV Converter
function convertToCSV(objArray){
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  console.log('objArray: ', objArray);
  console.log('theArray: ', array);

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line !== '') line += ','
          line += array[i][index];
      }
      str += line + '\r\n';
  }
  return str;
  // return array;
}

// cron job to terminate the user
exports.terminateUser = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();
  // const usersQuery = admin.firestore().collection('users').
  // where('email', '==', 'tehowny@gmail.com').get();
  const invoiceQuery = admin.firestore().collection('invoices').
  where('paid', '==', false).where('type', '==', 'membership').
  get();
  
  var emailTerminationPromises = [];
  return Promise.all([usersQuery, invoiceQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const invoiceResults = result[1];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    var emailPromise = null;

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    var inActiveCount = 0;

    var users = {};
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        const membershipEnds = data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        if (!cancelledMember && isExpiredMember){
          users[user.id] = user.data();
        }
      }
    });

    invoiceResults.forEach(invoice=>{
      // console.log('invoiceId: ', invoice.id);
      const invoiceData = invoice.data();
      const userId = invoiceData && invoiceData.userId;
      const userData = users[userId];
      const qty = invoiceData && invoiceData.quantity;
      const invoiceMailedAt = invoiceData && invoiceData.invoiceMailedAt;
      //const isValidDate = moment(getTheDate(invoiceMailedAt)).isSameOrAfter(moment('2019-11-28'));

      if(userData && userData.email && invoiceData && invoiceData.createdAt && (qty>3)){
        console.log('userDataEmail: ', userData.email);
        inActiveCount = inActiveCount + 1;

        // return admin.firestore().collection('users').doc(userId).update({autoTerminate:true, cancellationDate:timestamp, cancellationReason:'autoTerminated'});

        // for sending receiptMail
        emailPromise = sendTerminationEmail(userData.email, userData.name, moment(timestamp).format('D MMM YYYY')).then(results=>{
          return admin.firestore().collection('users').doc(userId).update({autoTerminate:true, cancellationDate:timestamp, cancellationReason:'autoTerminated'});
        });
      }
      if(emailPromise){
        emailTerminationPromises.push(emailPromise);
      }
    });

    return Promise.all(emailTerminationPromises).then(results=>{
      return res.status(200).send({
        success:true,
        message: 'OK',
        inActiveCount
      });
    });
  });
});

// generate invoice ver 2
// exports.generateInvoicesv2 = functions.https.onRequest((req, res) => {
//   // const usersQuery = admin.firestore().collection('users').where('email', '==', 'viknesh_loginathan@mckinsey.com').get();
//   const usersQuery = admin.firestore().collection('users').get();
//   const packagesQuery = admin.firestore().collection('packages').get();
//   const invoicesQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership').get();
//   // const freezesQuery = admin.firestore().collection('payments').where('source', '==', 'freeze').get();
//   const timestamp = admin.firestore.FieldValue.serverTimestamp();
//   const allAccessMonthlyDefaultPkg = 'TJ7Fiqgrt6EHUhR5Sb2q'; //330
//   const singleAccessMonthlyDefaultPkg = 'vf2jCUOEeDDiIQ0S42BJ'; //250

//   return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
//     // Get a new write batch
//     var batch = admin.firestore().batch();

//     const usersResults = results[0];
//     const packagesResults = results[1];
//     const invoicesResults = results[2];
//     // const freezesResults = results[3];

//     var packageMap = {};
//     packagesResults.forEach(doc=>{
//       const data = doc.data();
//       if (((data.renewalTerm === 'month')||(data.renewalTerm === 'monthly')) &&
//         !is3MonthKLCCPackage(doc.id) && !is3MonthTTDIPackage(doc.id)
//       ) {
//         // console.log('packageData: ', data);
//         packageMap[doc.id] = data;
//       }
//     });

//     // console.log('packageMap: ', packageMap);

//     // var freezeMap = {};
//     // var userIdFreezeMap = {};
//     // freezesResults.forEach(doc=>{
//     //   const data = doc.data();
//     //   const freezeFor = data && data.freezeFor? moment(data.freezeFor).isValid()? data.freezeFor:null : null;
//     //   // const freezeFor = data && data.freezeFor;
//     //   const createdAt = data && data.createdAt? moment(data.createdAt).isValid()? data.createdAt:null:null;
//     //   // const createdAt = data && data.createdAt;
//     //   const userId = data && data.userId;
//     //   if(userId && (freezeFor!=='undefined') && (createdAt!=='undefined')){
//     //     freezeMap[doc.id] = data;
//     //     var userFreezes = userIdFreezeMap[userId];
//     //     if(!userFreezes){
//     //       userFreezes = [];
//     //     }
//     //     userFreezes.push(data);
//     //     userIdFreezeMap[userId] = userFreezes;
//     //   }
//     // });

//     // console.log('userIdFreezeMap: ', userIdFreezeMap);

//     var invoiceMap = {};
//     var invoiceIdForUserIdMap = {};
//     invoicesResults.forEach(doc=>{
//       const data = doc.data();
//       const userId = data && data.userId;
//       const packageId = data && data.packageId;
//       const paid = data && data.paid ? data.paid : false;
      
//       if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
//         invoiceIdForUserIdMap[userId] = doc.id;
//         invoiceMap[doc.id] = data;
//       }
//     });

//     const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
//     // console.log('startOfTodayMoment: ', startOfTodayMoment);
//     var needsUpdatedInvoiceCount = 0;
//     var newInvoiceCount = 0;
//     var needsDeleteCount = 0;
//     var invoiceList = [];
//     var existingInvoiceList = [];
//     var newInvoiceList = [];
//     var userSwitchToDefaultPkgCount = 0;
    
//     usersResults.forEach(doc=>{
//       const data = doc.data();
//       const packageId = data && data.packageId;
//       const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
//       const packageData = packageId && packageMap[packageId];
//       const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
//       const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
//       const membershipEnds = data && data.autoMembershipEnds;
//       const promoJan2020 = data && data.promoJan2020;
//       const cancellationDate = data && data.cancellationDate;
    
//       const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
//       const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(0, 'days')) && !cancellationDate;
    
//       var membershipCancelled = false;
//       if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
//         (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
//         membershipCancelled = true;
//       }
      
//       var invoiceId = invoiceIdForUserIdMap[doc.id];
//       const needsUpdate = (needsPayment === true || invoiceId) && !promoJan2020; // skip generate the promoJan2020 invoices

//       if(data.locked){
//         console.log("Locked invoice", invoiceId);
//         return;
//       }

//       // if the invoice is already existed, but if its not supposed to be charged, del the invoice
//       // if((!needsPayment || membershipCancelled) && invoiceId){
//       if(membershipCancelled){
//         if (!needsUpdate && invoiceId){
//           batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             batch = admin.firestore().batch();
//           }
//           console.log("Deleting unpaid invoice (terminated)", invoiceId);
//           needsDeleteCount += 1;
//         }
//         else{
//           // console.log('membershipcancelled, no invoice generated, do nothing.');
//         }
//       }
      
//       // generate invoice for monthly package
//       else if(packageData && needsUpdate && membershipCancelled === false && (renewalTerm === 'month')||(renewalTerm === 'monthly')){
//         // var applicableFreezeMonths = 0;
//         // const userFreezes = userIdFreezeMap[doc.id];
//         // if (userFreezes){
//         //   console.log('userFreeze123: ', userFreezes);
//         //   for (var freezeIndex = 0; userFreezes && freezeIndex < userFreezes.length; freezeIndex++) {
//         //     const userFreeze = userFreezes[freezeIndex];
//         //     const freezeFor = userFreeze.freezeFor;
//         //     const freezeForMoment = freezeFor && moment(getTheDate(freezeFor));

//         //     // if(freezeForMoment && freezeForMoment.isBetween(membershipEndsMoment, startOfTodayMoment, 'day', '[]')){
//         //       applicableFreezeMonths += 1;
//         //     // }
//         //   }
//         // }
        
//         // console.log('applicableFreezeMonths: ', applicableFreezeMonths)
//         var amount;
//         var invoiceData;
//         // if the invoice is already created
//         if(invoiceId){
//           const unitPrice = parseInt(packageData.monthlyFee);
//           console.log('membershipEndsMomentInvoiceId: ', membershipEndsMoment.format('DDMMYYYY'));
//           // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
//           const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
//           console.log('totalQuantity: ', quantity);
//           // to avoid creating the 0 or negative invoices
//           // 0 is occured when the user is currently freezing
//           if (quantity<=0){
//             console.log('qty is equal to 0');
//             return;
//           }
//           const totalPrice = unitPrice*quantity;
//           if (totalPrice<=0){
//             batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//           }
//           amount = get12StringAmount(totalPrice);
//           const existingInvoiceData = invoiceMap[invoiceId];
//           const existingCreatedAt = existingInvoiceData.createdAt || null;
//           const existingAmount = existingInvoiceData.amount;
//           const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

//           const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
//           const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
//           const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

//           const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
//           const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
//           const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

//           const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
//           const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
//           const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

//           const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;

//           invoiceData = {
//             createdAt : createdAt,
//             packageId : packageId,
//             paid : !needsPayment,
//             paymentFailed : false,
//             paymentId : null,
//             userId : doc.id,
//             unitPrice : `${unitPrice}`,
//             totalPrice : `${totalPrice}`,
//             amount : amount,
//             quantity : quantity,
//             invoiceMailed : invoiceMailed,
//             invoiceMailedAt : invoiceMailedAt,
//             dueMailed : dueMailed,
//             dueMailedAt : dueMailedAt,
//             overdueMailed : overdueMailed,
//             overdueMailedAt : overdueMailedAt,
//             receiptMailed : receiptMailed,
//             type : 'membership',
//             hasSST : moment(createdAt).isSameOrAfter(moment('2018-09-01'), 'day') ? true : false,
//             billingDate: membershipEnds?membershipEnds:null,
//             // auto billing is stop before PKP, this field is added after PKP 16/5/2020
//             isAfterPKPCharge: moment(createdAt).isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
//           }

//           existingInvoiceList.push(invoiceData);
//           console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
//           batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             batch = admin.firestore().batch();
//           }
//           needsUpdatedInvoiceCount += 1;
//         }
//         // create a new invoice
//         else if(membershipCancelled === false){
//           //TODO add invoice id
//           invoiceId = admin.firestore().collection('invoices').doc().id;
          
//           const unitPrice = parseInt(packageData.monthlyFee);
//           // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
//           const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
//           // 0 is occured when the user is currently freezing
//           if (quantity <= 0){
//             console.log('qty is equal to 0');
//             return;
//           }
//           const totalPrice = unitPrice*quantity;
//           if (totalPrice<=0){
//             batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//           }
//           amount = get12StringAmount(totalPrice);
//           invoiceData = {
//             createdAt : startOfTodayMoment.toDate(),
//             packageId : packageId,
//             paid : !needsPayment,
//             paymentFailed : false,
//             paymentId : null,
//             userId : doc.id,
//             unitPrice : `${unitPrice}`,
//             totalPrice : `${totalPrice}`,
//             amount : amount,
//             quantity : quantity,
//             invoiceMailed : false,
//             dueMailed : false,
//             overdueMailed : false,
//             receiptMailed : false,
//             type : 'membership',
//             hasSST : true,
//             billingDate: membershipEnds?membershipEnds:null,
//             isAfterPKPCharge: startOfTodayMoment.isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
//           }
//           // console.log("Adding invoice", amount, invoiceId, invoiceData, applicableFreezeMonths);
//           // console.log('invoiceData: ', invoiceData);
          
//           newInvoiceList.push(invoiceData);
//           batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             batch = admin.firestore().batch();
//           }
//           newInvoiceCount += 1;
//         }
//       }
//       // if the membership is expired and the current package is other than monthly package, 
//       // convert the package to monthly package first.
//       // the second time API call will generate monthly invoices
//       // else if (packageData && needsUpdate && membershipCancelled === false){
//       //   // check the package, convert it to monthly package, all access or single access
//       //   const updatedPkgId = isKLCCPkg? allAccessMonthlyDefaultPkg:singleAccessMonthlyDefaultPkg;
//       //   batch.update(admin.firestore().collection('users').doc(doc.id), {packageId:updatedPkgId});
//       //   if(userSwitchToDefaultPkgCount >= 499){
//       //     batch.commit();
//       //     userSwitchToDefaultPkgCount = 0;
//       //     batch = admin.firestore().batch();
//       //   }
//       //   userSwitchToDefaultPkgCount += 1;
//       // }
//     });

//     console.log('newInvoiceCount: ', newInvoiceCount);
//     var theObject = {
//       success:true,
//       message: 'no invoice updated',
//       createdAt: timestamp
//     }

//     if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
//       // return 
//       return batch.commit().then(()=>{
//         console.log("Updated invoice", needsUpdatedInvoiceCount);
//         console.log('New invoices', newInvoiceCount);
//         console.log('Deleted invoices', needsDeleteCount);
//         theObject = {
//           success:true,
//           message: 'OK',
//           needsUpdatedInvoiceCount,
//           newInvoiceCount,
//           needsDeleteCount,
//           existingInvoiceList,
//           newInvoiceList,
//           userSwitchToDefaultPkgCount,
//           createdAtDate: moment(timestamp).format('DDMMYYYY'),
//           createdAtTime: moment(timestamp).format('hh:mm:ss')
//         };
//       admin.firestore().collection('chargeInvoiceLogs').add(theObject);
//         return res.status(200).send(theObject);
//       }).catch((error)=>{
//         console.log('error batch: ', error);
//       });
//       // return res.status(200).send(theObject);
//     }else{
//       admin.firestore().collection('chargeInvoiceLogs').add(theObject);
//       return res.status(200).send(theObject);
//     }
//   });
// });

// generate invoice ver 4 (with SST) monthly all package only
exports.generateInvoicesv4 = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'seanlim88@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q').get();
  const packagesQuery = admin.firestore().collection('packages')
  .where('renewalTerm', '==', 'month')
  .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const isJuly2020 = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packagesResults = results[1];
    const invoicesResults = results[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      if (
          // doc.id === 'vf2jCUOEeDDiIQ0S42BJ' 
          doc.id === 'TJ7Fiqgrt6EHUhR5Sb2q'
        
      ){
        // console.log('packageData: ', data);
        packageMap[doc.id] = data;
      }
    });

    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    var userSwitchToDefaultPkgCount = 0;

    var amount;
    var invoiceData;
    
    usersResults.forEach(doc=>{
      const data = doc.data();
      const packageId = data && data.packageId;
      const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
      const packageData = packageId && packageMap[packageId];
      const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
      const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
      var paymentItems = [];
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId); 

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      // console.log('membershipendMoment: ', membershipEndsMoment && membershipEndsMoment.format('DD/MM/YYYY'));
      // console.log('membershipendMomentIsSameOrAfter: ', membershipEndsMoment && membershipEndsMoment.isSameOrAfter(isJuly2020));
      // console.log('packageId: ', packageId);
      // console.log('packageData: ', packageData);
      // console.log('needsUpdate: ', needsUpdate);
      // console.log('membershipCancel: ', membershipCancelled);
      // console.log('renewalTerm: ', renewalTerm);
      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          if (invoiceId){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
            if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
              batch.commit();
              needsUpdatedInvoiceCount = 0;
              newInvoiceCount = 0;
              needsDeleteCount = 0;
              batch = admin.firestore().batch();
            }
            console.log("Deleting unpaid invoice (terminated)", invoiceId);
            needsDeleteCount += 1;
          }
          else{
            // console.log('no invoice, do nothing.');
          }
        }
      }

      // generate new invoice for monthly package if it is on 1/7/2020;
      if(packageData && needsUpdate
        // && membershipEndsMoment.isSameOrAfter(moment('isJuly2020') && monthlyFees)
        // test for single monthly package only
        && monthlyFees && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        // console.log('create invoice')
        // price after july 2020
        const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        const unitTaxAfterJuly2020 = unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020;

        const unitPriceBeforeJuly2020 = parseFloat(parseFloat(packageData.monthlyFees[0])/1.06).toFixed(2);
        const unitPriceWithTaxBeforeJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitTaxBeforeJuly2020 = (unitPriceWithTaxBeforeJuly2020 - unitPriceBeforeJuly2020).toFixed(2);

        // console.log('unitPriceWithTaxBeforeJuly2020: ', unitPriceWithTaxBeforeJuly2020);
        // default unitPrice
        const unitPrice = parseFloat(packageData.monthlyFee).toFixed(2);

        // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
        const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
       
        const quantityBeforeJuly2020 = membershipEndsMoment.add(1, 'days').isBefore(isJuly2020)? ((isJuly2020.diff(membershipEndsMoment, 'months') + 1)): 0;
        // const quantityAfterJuly2020 = membershipEndsMoment.isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;
       
        // const quantityBeforeJuly2020 = membershipEndsMoment.isBefore(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) - (startOfTodayMoment.diff(isJuly2020, 'months') + 1):0;
        const quantityAfterJuly2020 = membershipEndsMoment.add(1, 'days').isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;

        // console.log('membershipEndsMoment.isSameOrAfter(isJuly2020): ', membershipEndsMoment.isSameOrAfter(isJuly2020));
        // console.log('quantityBeforeJuly: ', quantityBeforeJuly2020);
        // console.log('quantityAfterJuly: ', quantityAfterJuly2020);

        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
        if (quantity <= 0){
          console.log('qty is equal to 0');
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
        }
        // console.log('quantity: ', quantity);

        const totalPrice = unitPriceWithTaxBeforeJuly2020*quantityBeforeJuly2020 + unitPriceWithTaxAfterJuly2020*quantityAfterJuly2020;
        const totalTax = unitTaxBeforeJuly2020*quantityBeforeJuly2020 + unitTaxAfterJuly2020*quantityAfterJuly2020;

        if (quantityBeforeJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceBeforeJuly2020,
            unitPriceWithTax: unitPriceWithTaxBeforeJuly2020,
            tax:unitTaxBeforeJuly2020,
            quantity: quantityBeforeJuly2020,
            isAfterJuly2020:false
          });
        }
        if (quantityAfterJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceAfterJuly2020,
            unitPriceWithTax: unitPriceWithTaxAfterJuly2020,
            tax:unitTaxAfterJuly2020,
            quantity: quantityAfterJuly2020,
            isAfterJuly2020:true
          });
        }
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);
        // console.log('theamount: ', amount);

        // if the invoice is already created
        if(invoiceId){
          
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur');

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;
        
          invoiceData = {
            createdAt : createdAt,
            updatedAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            tax: `${totalTax.toFixed(2)}`,
            type: 'membership',
            hasSST :true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems,
            // auto billing is stop before PKP, this field is added after PKP 16/5/2020
            // isAfterPKPCharge: moment(createdAt).isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
            
          }

          existingInvoiceList.push(invoiceData);
          // console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        // create a new invoice
        else if(!invoiceId){
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            tax: `${totalTax}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems : paymentItems
          }
          console.log("Adding invoice", amount, invoiceId, invoiceData);
          // console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }

    });

    // console.log('newInvoiceCount: ', newInvoiceCount);
    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // const unpaidInvoiceSheetURL = 'https://us-central1-babelasia-37615.cloudfunctions.net/addUnpaidInvoiceToSheets';

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        // console.log("Updated invoice", needsUpdatedInvoiceCount);
        // console.log('New invoices', newInvoiceCount);
        // console.log('Deleted invoices', needsDeleteCount);
        theObject = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('chargeInvoiceLogs').add(theObject);
        // var request = require("request");
        // return request.get(unpaidInvoiceSheetURL)
        
        return res.status(200).send(theObject);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(theObject);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(theObject);
      return res.status(200).send(theObject);
    }
  });
});

// generate invoice ver 4 (with SST) monthly TTDI only
exports.generateInvoicesTTDIMonthly = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'dhanyaparameswaran95@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').where('packageId', '==', 'vf2jCUOEeDDiIQ0S42BJ').get();
  const packagesQuery = admin.firestore().collection('packages')
  .where('renewalTerm', '==', 'month')
  .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .where('packageId', '==', 'vf2jCUOEeDDiIQ0S42BJ')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const isJuly2020 = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packagesResults = results[1];
    const invoicesResults = results[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      if (
          doc.id === 'vf2jCUOEeDDiIQ0S42BJ' 
          // doc.id === 'TJ7Fiqgrt6EHUhR5Sb2q'
      ){
        // console.log('packageData: ', data);
        packageMap[doc.id] = data;
      }
    });

    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    var userSwitchToDefaultPkgCount = 0;

    var amount;
    var invoiceData;
    
    usersResults.forEach(doc=>{
      const data = doc.data();
      const packageId = data && data.packageId;
      const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
      const packageData = packageId && packageMap[packageId];
      const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
      const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
      var paymentItems = [];
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId); 

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      // console.log('membershipendMoment: ', membershipEndsMoment && membershipEndsMoment.format('DD/MM/YYYY'));
      // console.log('membershipendMomentIsSameOrAfter: ', membershipEndsMoment && membershipEndsMoment.isSameOrAfter(isJuly2020));
      // console.log('packageId: ', packageId);
      // console.log('packageData: ', packageData);
      // console.log('needsUpdate: ', needsUpdate);
      // console.log('membershipCancel: ', membershipCancelled);
      // console.log('renewalTerm: ', renewalTerm);
      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          if (invoiceId){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
            if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
              batch.commit();
              needsUpdatedInvoiceCount = 0;
              newInvoiceCount = 0;
              needsDeleteCount = 0;
              batch = admin.firestore().batch();
            }
            console.log("Deleting unpaid invoice (terminated)", invoiceId);
            needsDeleteCount += 1;
          }
          else{
            // console.log('no invoice, do nothing.');
          }
        }
      }

      // generate new invoice for monthly package if it is on 1/7/2020;
      if(packageData && needsUpdate
        // && membershipEndsMoment.isSameOrAfter(moment('isJuly2020') && monthlyFees)
        // test for single monthly package only
        && monthlyFees && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        console.log('create or update invoice')
        // price after july 2020
        const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        const unitTaxAfterJuly2020 = unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020;

        const unitPriceBeforeJuly2020 = parseFloat(parseFloat(packageData.monthlyFees[0])/1.06).toFixed(2);
        const unitPriceWithTaxBeforeJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitTaxBeforeJuly2020 = (unitPriceWithTaxBeforeJuly2020 - unitPriceBeforeJuly2020).toFixed(2);

        // console.log('unitPriceWithTaxBeforeJuly2020: ', unitPriceWithTaxBeforeJuly2020);
        // default unitPrice
        const unitPrice = parseFloat(packageData.monthlyFee).toFixed(2);

        // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
        const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
       
        const quantityBeforeJuly2020 = membershipEndsMoment.add(1, 'days').isBefore(isJuly2020)? ((isJuly2020.diff(membershipEndsMoment, 'months') + 1)): 0;
        // const quantityAfterJuly2020 = membershipEndsMoment.isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;
       
        // const quantityBeforeJuly2020 = membershipEndsMoment.isBefore(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) - (startOfTodayMoment.diff(isJuly2020, 'months') + 1):0;
        const quantityAfterJuly2020 = membershipEndsMoment.add(1, 'days').isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;

        // console.log('membershipEndsMoment.isSameOrAfter(isJuly2020): ', membershipEndsMoment.isSameOrAfter(isJuly2020));
        // console.log('quantityBeforeJuly: ', quantityBeforeJuly2020);
        // console.log('quantityAfterJuly: ', quantityAfterJuly2020);

        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
        if (quantity <= 0){
          console.log('qty is equal to 0');
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
        }
        // console.log('quantity: ', quantity);

        const totalPrice = unitPriceWithTaxBeforeJuly2020*quantityBeforeJuly2020 + unitPriceWithTaxAfterJuly2020*quantityAfterJuly2020;
        const totalTax = unitTaxBeforeJuly2020*quantityBeforeJuly2020 + unitTaxAfterJuly2020*quantityAfterJuly2020;

        if (quantityBeforeJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceBeforeJuly2020,
            unitPriceWithTax: unitPriceWithTaxBeforeJuly2020,
            tax:unitTaxBeforeJuly2020,
            quantity: quantityBeforeJuly2020,
            isAfterJuly2020:false
          });
        }
        if (quantityAfterJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceAfterJuly2020,
            unitPriceWithTax: unitPriceWithTaxAfterJuly2020,
            tax:unitTaxAfterJuly2020,
            quantity: quantityAfterJuly2020,
            isAfterJuly2020:true
          });
        }
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);
        // console.log('theamount: ', amount);

        // if the invoice is already created
        if(invoiceId){
          
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur');

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;
        
          invoiceData = {
            createdAt : createdAt,
            updatedAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            tax: `${totalTax.toFixed(2)}`,
            type: 'membership',
            hasSST :true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems,
            // auto billing is stop before PKP, this field is added after PKP 16/5/2020
            // isAfterPKPCharge: moment(createdAt).isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
            
          }

          existingInvoiceList.push(invoiceData);
          // console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        // create a new invoice
        else if(!invoiceId){
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            tax: `${totalTax}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems : paymentItems
          }
          console.log("Adding invoice", amount, invoiceId, invoiceData);
          // console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }

    });

    // console.log('newInvoiceCount: ', newInvoiceCount);
    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // const unpaidInvoiceSheetURL = 'https://us-central1-babelasia-37615.cloudfunctions.net/addUnpaidInvoiceToSheets';

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        // console.log("Updated invoice", needsUpdatedInvoiceCount);
        // console.log('New invoices', newInvoiceCount);
        // console.log('Deleted invoices', needsDeleteCount);
        theObject = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('chargeInvoiceLogs').add(theObject);
        // var request = require("request");
        // return request.get(unpaidInvoiceSheetURL)
        
        return res.status(200).send(theObject);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(theObject);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(theObject);
      return res.status(200).send(theObject);
    }
  });
});

// generate invoice ver 4 (with SST) corporate package only
exports.generateInvoicesCorp = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'jason.phung@my.ey.com').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages')
  .where('renewalTerm', '==', 'month')
  .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const isJuly2020 = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packagesResults = results[1];
    const invoicesResults = results[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      if ((data.renewalTerm === 'month')
        && (doc.id === 'BKcaoWGrWKYihS40MpGd' 
        || doc.id === 'ZEDcEHZp3fKeQOkDxCH8' 
        || doc.id === 'dz8SAwq99GWdEvHCKST2'
        || doc.id === 'eRMTW6cQen6mcTJgKEvy'
        || doc.id === 'wpUO5vxWmme7KITqSITo'
        )
      ) {
        // console.log('packageData: ', data);
        packageMap[doc.id] = data;
      }
    });

    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    var userSwitchToDefaultPkgCount = 0;

    var amount;
    var invoiceData;
    
    usersResults.forEach(doc=>{
      const data = doc.data();
      const packageId = data && data.packageId;
      const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
      const packageData = packageId && packageMap[packageId];
      const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
      const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
      const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
      var paymentItems = [];
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId) && !promoJan2020; // skip generate the promoJan2020 invoices

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      // console.log('membershipendMoment: ', membershipEndsMoment && membershipEndsMoment.format('DD/MM/YYYY'));
      // console.log('membershipendMomentIsSameOrAfter: ', membershipEndsMoment && membershipEndsMoment.isSameOrAfter(isJuly2020));
      // console.log('packageId: ', packageId);
      // console.log('packageData: ', packageData);
      // console.log('needsUpdate: ', needsUpdate);
      // console.log('membershipCancel: ', membershipCancelled);
      // console.log('renewalTerm: ', renewalTerm);
      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          if (invoiceId){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
            if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
              batch.commit();
              needsUpdatedInvoiceCount = 0;
              newInvoiceCount = 0;
              needsDeleteCount = 0;
              batch = admin.firestore().batch();
            }
            console.log("Deleting unpaid invoice (terminated)", invoiceId);
            needsDeleteCount += 1;
          }
          else{
            // console.log('no invoice, do nothing.');
          }
        }
      }

      // generate new invoice for monthly package if it is on 1/7/2020;
      else if(packageData && needsUpdate && !membershipCancelled && ((renewalTerm === 'month')||(renewalTerm === 'monthly'))
        // && membershipEndsMoment.isSameOrAfter(moment('isJuly2020') && monthlyFees)
        // test for single monthly package only
        && monthlyFees && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        // price after july 2020
        const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        const unitTaxAfterJuly2020 = unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020;

        const unitPriceBeforeJuly2020 = parseFloat(parseFloat(packageData.monthlyFees[0])/1.06).toFixed(2);
        const unitPriceWithTaxBeforeJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitTaxBeforeJuly2020 = (unitPriceWithTaxBeforeJuly2020 - unitPriceBeforeJuly2020).toFixed(2);

        // console.log('unitPriceWithTaxBeforeJuly2020: ', unitPriceWithTaxBeforeJuly2020);
        // default unitPrice
        const unitPrice = parseFloat(packageData.monthlyFee).toFixed(2);

        // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
        const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
       
        const quantityBeforeJuly2020 = membershipEndsMoment.add(1, 'days').isBefore(isJuly2020)? ((isJuly2020.diff(membershipEndsMoment, 'months') + 1)): 0;
        // const quantityAfterJuly2020 = membershipEndsMoment.isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;
       
        // const quantityBeforeJuly2020 = membershipEndsMoment.isBefore(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) - (startOfTodayMoment.diff(isJuly2020, 'months') + 1):0;
        const quantityAfterJuly2020 = membershipEndsMoment.add(1, 'days').isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;

        // console.log('membershipEndsMoment.isSameOrAfter(isJuly2020): ', membershipEndsMoment.isSameOrAfter(isJuly2020));
        // console.log('quantityBeforeJuly: ', quantityBeforeJuly2020);
        // console.log('quantityAfterJuly: ', quantityAfterJuly2020);

        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
        if (quantity <= 0){
          console.log('qty is equal to 0');
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
        }
        // console.log('quantity: ', quantity);

        const totalPrice = unitPriceWithTaxBeforeJuly2020*quantityBeforeJuly2020 + unitPriceWithTaxAfterJuly2020*quantityAfterJuly2020;
        const totalTax = unitTaxBeforeJuly2020*quantityBeforeJuly2020 + unitTaxAfterJuly2020*quantityAfterJuly2020;

        if (quantityBeforeJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceBeforeJuly2020,
            unitPriceWithTax: unitPriceWithTaxBeforeJuly2020,
            tax:unitTaxBeforeJuly2020,
            quantity: quantityBeforeJuly2020,
            isAfterJuly2020:false
          });
        }
        if (quantityAfterJuly2020>=1){
          paymentItems.push({
            createdAt:startOfTodayMoment.toDate(),
            unitPrice:unitPriceAfterJuly2020,
            unitPriceWithTax: unitPriceWithTaxAfterJuly2020,
            tax:unitTaxAfterJuly2020,
            quantity: quantityAfterJuly2020,
            isAfterJuly2020:true
          });
        }
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);

        // if the invoice is already created
        if(invoiceId){
          
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur');

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;
        
          invoiceData = {
            createdAt : createdAt,
            updatedAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            tax: `${totalTax.toFixed(2)}`,
            type: 'membership',
            hasSST :true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems,
            // auto billing is stop before PKP, this field is added after PKP 16/5/2020
            // isAfterPKPCharge: moment(createdAt).isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
            
          }

          existingInvoiceList.push(invoiceData);
          console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        // create a new invoice
        else if(!invoiceId){
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            tax: `${totalTax}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            paymentItems : paymentItems
          }
          console.log("Adding invoice", amount, invoiceId, invoiceData);
          // console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }

    });

    console.log('newInvoiceCount: ', newInvoiceCount);
    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // const unpaidInvoiceSheetURL = 'https://us-central1-babelasia-37615.cloudfunctions.net/addUnpaidInvoiceToSheets';

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        // console.log("Updated invoice", needsUpdatedInvoiceCount);
        // console.log('New invoices', newInvoiceCount);
        // console.log('Deleted invoices', needsDeleteCount);
        theObject = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('chargeInvoiceLogs').add(theObject);
        // var request = require("request");
        // return request.get(unpaidInvoiceSheetURL)
        
        return res.status(200).send(theObject);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(theObject);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(theObject);
      return res.status(200).send(theObject);
    }
  });
});

// generate invoice sheet for reporting (without creating invoice)
// exports.generateInvoicesForSheet = functions.https.onRequest((req, res) => {
//   // const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
//   const usersQuery = admin.firestore().collection('users').get();
//   const packagesQuery = admin.firestore().collection('packages').get();
//   const invoicesQuery = admin.firestore().collection('invoices')
//     .where('paid', '==', false)
//     .where('type', '==', 'membership')
//     // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
//     .get();
//   const timestamp = admin.firestore.FieldValue.serverTimestamp();

//   return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
//     // Get a new write batch
//     var batch = admin.firestore().batch();

//     const usersResults = results[0];
//     const packagesResults = results[1];
//     const invoicesResults = results[2];

//     var packageMap = {};
//     packagesResults.forEach(doc=>{
//       const data = doc.data();
//       if (((data.renewalTerm === 'month')||(data.renewalTerm === 'monthly')) &&
//         !is3MonthKLCCPackage(doc.id) && !is3MonthTTDIPackage(doc.id)
//       ) {
//         // console.log('packageData: ', data);
//         packageMap[doc.id] = data;
//       }
//     });

//     var invoiceMap = {};
//     var invoiceIdForUserIdMap = {};
//     invoicesResults.forEach(doc=>{
//       const data = doc.data();
//       const userId = data && data.userId;
//       const packageId = data && data.packageId;
//       const paid = data && data.paid ? data.paid : false;
//       if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
//         invoiceIdForUserIdMap[userId] = doc.id;
//         invoiceMap[doc.id] = data;
//       }
//     });

//     const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
//     // console.log('startOfTodayMoment: ', startOfTodayMoment);
//     var needsUpdatedInvoiceCount = 0;
//     var newInvoiceCount = 0;
//     var needsDeleteCount = 0;
//     var invoiceList = [];
//     var existingInvoiceList = [];
//     var newInvoiceList = [];
//     var userSwitchToDefaultPkgCount = 0;

//     var amount;
//     var invoiceData;
    
//     usersResults.forEach(doc=>{
//       const data = doc.data();
//       const packageId = data && data.packageId;
//       const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
//       const packageData = packageId && packageMap[packageId];
//       const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
//       const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
//       const membershipEnds = data && data.autoMembershipEnds;
//       const promoJan2020 = data && data.promoJan2020;
//       const cancellationDate = data && data.cancellationDate;
//       const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
//       var paymentItems = [];
    
//       const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
//       const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(30, 'days')) && !cancellationDate;
    
//       var membershipCancelled = false;
//       if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
//         (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
//         membershipCancelled = true;
//       }
      
//       var invoiceId = invoiceIdForUserIdMap[doc.id];
//       const needsUpdate = (needsPayment === true || invoiceId) && !promoJan2020; // skip generate the promoJan2020 invoices

//       if(data.locked){
//         console.log("Locked invoice", invoiceId);
//         return;
//       }

//       console.log('membershipendMoment: ', membershipEndsMoment.format('DD/MM/YYYY'));
//       // console.log('membershipendMomentIsSameOrAfter: ', membershipEndsMoment.isSameOrAfter(moment(isJuly2020)));
//       console.log('packageData: ', packageData);
//       console.log('needsUpdate: ', needsUpdate);
//       console.log('membershipCancel: ', membershipCancelled);
//       console.log('renewalTerm: ', renewalTerm);
//       // if the invoice is already existed, but if its not supposed to be charged, del the invoice
//       // if((!needsPayment || membershipCancelled) && invoiceId){
//       if(membershipCancelled){
//         if (!needsUpdate && invoiceId){
//           batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             batch = admin.firestore().batch();
//           }
//           console.log("Deleting unpaid invoice (terminated)", invoiceId);
//           needsDeleteCount += 1;
//         }
//         else{
//           // console.log('membershipcancelled, no invoice generated, do nothing.');
//         }
//       }
//       // generate new invoice for monthly package if it is on 1/7/2020;
//       else if(packageData && needsUpdate && !membershipCancelled && (renewalTerm === 'month')||(renewalTerm === 'monthly')
//         // && membershipEndsMoment.isSameOrAfter(moment(isJuly2020) && monthlyFees)
//       ){
        
//         // price after july 2020
//         const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
//         const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
//         const unitTaxAfterJuly2020 = unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020;

//         const unitPriceBeforeJuly2020 = parseFloat(parseFloat(packageData.monthlyFees[0])/1.06).toFixed(2);
//         const unitPriceWithTaxBeforeJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
//         const unitTaxBeforeJuly2020 = (unitPriceWithTaxBeforeJuly2020 - unitPriceBeforeJuly2020).toFixed(2);

//         // default unitPrice
//         const unitPrice = parseFloat(packageData.monthlyFee).toFixed(2);

//         // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
//         const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
       
//         const quantityBeforeJuly2020 = membershipEndsMoment.isBefore(isJuly2020)? ((moment(isJuly2020).diff(membershipEndsMoment, 'months') + 1) + (startOfTodayMoment.diff(moment(isJuly2020), 'months'))): 0;
//         const quantityAfterJuly2020 = membershipEndsMoment.isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;
//         console.log('quantityBeforeJuly: ', quantityBeforeJuly2020);
//         console.log('quantityAfterJuly: ', quantityAfterJuly2020);

//         // to avoid creating the 0 or negative invoices
//         // 0 is occured when the user is currently freezing
//         if (quantity <= 0){
//           console.log('qty is equal to 0');
//           batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//         }
//         console.log('quantity: ', quantity);

//         const totalPrice = unitPriceWithTaxBeforeJuly2020*quantityBeforeJuly2020 + unitPriceWithTaxAfterJuly2020*quantityAfterJuly2020;
//         const totalTax = unitTaxBeforeJuly2020*quantityBeforeJuly2020 + unitTaxAfterJuly2020*quantityAfterJuly2020;

//         if (quantityBeforeJuly2020>=1){
//           paymentItems.push({
//             createdAt:startOfTodayMoment.toDate(),
//             unitPrice:unitPriceBeforeJuly2020,
//             unitPriceWithTax: unitPriceWithTaxBeforeJuly2020,
//             tax:unitTaxBeforeJuly2020,
//             quantity: quantityBeforeJuly2020,
//             isAfterJuly2020:true
//           });
//         }
//         if (quantityAfterJuly2020>=1){
//           paymentItems.push({
//             createdAt:startOfTodayMoment.toDate(),
//             unitPrice:unitPriceAfterJuly2020,
//             unitPriceWithTax: unitPriceWithTaxAfterJuly2020,
//             tax:unitTaxAfterJuly2020,
//             quantity: quantityAfterJuly2020,
//             isAfterJuly2020:false
//           });
//         }
         
//         console.log('paymentItem: ', paymentItems);
//         console.log('totalPrice: ', totalPrice);
//         console.log('totalTax: ', totalTax);
//         amount = get12StringAmount(`${totalPrice}`);

//         // if the invoice is already created
//         if(invoiceId){
          
//           if (totalPrice<=0){
//             batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
//           }
        
//           const existingInvoiceData = invoiceMap[invoiceId];
//           const existingCreatedAt = existingInvoiceData.createdAt || null;
//           const existingAmount = existingInvoiceData.amount;
//           const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

//           const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
//           const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
//           const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

//           const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
//           const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
//           const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

//           const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
//           const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
//           const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

//           const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;
        
//           invoiceData = {
//             createdAt : createdAt,
//             packageId : packageId,
//             paid : !needsPayment,
//             paymentFailed : false,
//             paymentId : null,
//             userId : doc.id,
//             unitPrice : `${unitPrice}`,
//             totalPrice : `${totalPrice}`,
//             amount : amount,
//             quantity : quantity,
//             invoiceMailed : invoiceMailed,
//             invoiceMailedAt : invoiceMailedAt,
//             dueMailed : dueMailed,
//             dueMailedAt : dueMailedAt,
//             overdueMailed : overdueMailed,
//             overdueMailedAt : overdueMailedAt,
//             receiptMailed : receiptMailed,
//             tax: `${totalTax}`,
//             type: 'membership',
//             hasSST :true,
//             billingDate: membershipEnds?membershipEnds:null,
//             paymentItems,
//             // auto billing is stop before PKP, this field is added after PKP 16/5/2020
//             // isAfterPKPCharge: moment(createdAt).isSameOrAfter(moment('2020-06-15'), 'day') ? true : false,
            
//           }

//           existingInvoiceList.push(invoiceData);
//           console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
//           //batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             // batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             // batch = admin.firestore().batch();
//           }
//           needsUpdatedInvoiceCount += 1;
//         }
//         // create a new invoice
//         else if(membershipCancelled === false){
//           //TODO add invoice id
//           invoiceId = admin.firestore().collection('invoices').doc().id;

//           invoiceData = {
//             createdAt : startOfTodayMoment.toDate(),
//             packageId : packageId,
//             paid : !needsPayment,
//             paymentFailed : false,
//             paymentId : null,
//             userId : doc.id,
//             unitPrice : `${unitPrice}`,
//             tax: `${totalTax}`,
//             totalPrice : `${totalPrice}`,
//             amount : amount,
//             quantity : quantity,
//             invoiceMailed : false,
//             dueMailed : false,
//             overdueMailed : false,
//             receiptMailed : false,
//             type : 'membership',
//             hasSST : true,
//             billingDate: membershipEnds?membershipEnds:null,
//             paymentItems : paymentItems
//           }
//           console.log("Adding invoice", amount, invoiceId, invoiceData);
//           console.log('invoiceData: ', invoiceData);
          
//           newInvoiceList.push(invoiceData);
//           // batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
//           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
//             // batch.commit();
//             needsUpdatedInvoiceCount = 0;
//             newInvoiceCount = 0;
//             needsDeleteCount = 0;
//             // batch = admin.firestore().batch();
//           }
//           newInvoiceCount += 1;
//         }
//       }

//     });

//     console.log('newInvoiceCount: ', newInvoiceCount);
//     var theObject = {
//       success:true,
//       message: 'no invoice updated',
//       createdAt: timestamp
//     }

//     if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      
//       return res.status(200).send(theObject);
//     }else{
//       // admin.firestore().collection('chargeInvoiceLogs').add(theObject);
//       return res.status(200).send(theObject);
//     }
//   });
// });

function get12StringAmount(amount){
 
  //const theAmount = amount.includes('.')? `${amount.split('.').join("")}`:`${amount}`;
  // const startAmount = amount.includes('.')? `${amount}`:`${amount}00`;
  const startAmount = (parseFloat(amount)).toFixed(2).toString();
  const amountArray = startAmount.split('.');
  var combinedAmount = `${amountArray[0]}${amountArray[1]}`;
  var finalAmount;
  const concatLength = 12-combinedAmount.length; 
  // console.log('combinedAmount: ', combinedAmount);
  // console.log('concatLength: ', concatLength);

  // if (amount.includes('.')){
  //   console.log('theAmount: ', amount);
  //   var theAmounts = amount.split('.');
  //   // if 2 decimal points
  //   if (theAmounts.length === 2){
  //     amountString = theAmounts[0]+theAmounts[1];
  //   }
  //   else if (theAmounts.length === 1){
  //     amountString = theAmounts[0] + theAmounts[1] +'0';
  //   }
  //   console.log('amountString: ', amountString);
  //   for(var j = 0; j<concatLength; j++){
  //     finalAmount = '0'.concat(amountString);
  //   }
  // }
  // else{
    for (var i = 0; i < concatLength; i++) {
      combinedAmount = '0'.concat(combinedAmount);
    }
  // }
  return combinedAmount;
}

// this function will add autoStartDate for all members
exports.addmemberStartDate = functions.https.onRequest((req,res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
  const usersQuery = admin.firestore().collection('users').get();
  const freezesQuery = admin.firestore().collection('payments').where('source', '==', 'freeze')
    .where('freezeFor', '>=', moment('20200101').startOf('day').toDate())
    .get();
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([usersQuery, freezesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const freezesResults = results[1];
    var freezeCV19Count = 0;
    // var memberDataList = [];

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);

    var freezeMap = {};
    var userIdFreezeMap = {};
    freezesResults.forEach(doc=>{
      const data = doc.data();
      const freezeFor = data && data.freezeFor? moment(data.freezeFor).isValid()? data.freezeFor:null : null;
      // const freezeFor = data && data.freezeFor;
      const createdAt = data && data.createdAt? moment(data.createdAt).isValid()? data.createdAt:null:null;
      const freezeType = data && data.freezeType; 
      // const createdAt = data && data.createdAt;
      const existingCV19Freeze = moment(getTheDate(freezeFor)).isBetween(moment('20200218'), moment('20200413')) 
        || (freezeType === 'specialFreeze');

      const userId = data && data.userId;
      if(userId && (freezeFor!=='undefined') && (createdAt!=='undefined') && existingCV19Freeze){
        freezeMap[doc.id] = data;
        var userFreezes = userIdFreezeMap[userId];
        if(!userFreezes){
          userFreezes = [];
        }
        userFreezes.push(data);
        userIdFreezeMap[userId] = userFreezes;
      }
    });

    // console.log('userIdFreezeMap: ', userIdFreezeMap);

    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;

      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
      const memberIsExpired = membershipEndsMoment.isBefore(startOfTodayMoment);
      const memberIsCancel = data && data.cancellationDate;
      const userFreezes = userIdFreezeMap[doc.id];
      // console.log('userFreezes: ', userFreezes);

      if (!memberIsCancel && membershipStarts && membershipEnds && packageId && !userFreezes){
        // memberDataList.push(data);
        // console.log("Updating member data: ", memberId, data);
        // batch.update(admin.firestore().collection('users').doc(memberId), {packageId:updatedPkgId});
        const freezeData = {
          createdAt:timestamp,
          freezeFor:moment('20200317').tz('Asia/Kuala_Lumpur').startOf('day').toDate(),
          freezeEnd:moment('20200615').tz('Asia/Kuala_Lumpur').startOf('day').toDate(),
          source:'freeze',
          type:'membership',
          totalPrice:0,
          userId:memberId,
          freezeType:'specialFreeze'
        };

        admin.firestore().collection('payments').add(freezeData);
        if(freezeCV19Count >= 499){
          batch.commit();
          freezeCV19Count = 0;
          batch = admin.firestore().batch();
        }
        freezeCV19Count += 1;
      }
    });

    var CV19FreezeLogs = {
      success:true,
      message: 'no freeze added',
      createdAt: timestamp
    }

    // 
    if(freezeCV19Count > 0){
      // return 
      return batch.commit().then(()=>{
        CV19FreezeLogs = {
          success:true,
          message: 'OK',
          freezeCV19Count,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
        return res.status(200).send(CV19FreezeLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
      return res.status(200).send(CV19FreezeLogs);
    }
  });
});

// this function will add free special freeze for 3 month for all members during the
// covid19 Perintah Kawalan Pergerakan (PKP) - from 18/3/2020 - 17/6/2020 
// add a new field called specialFreeze=true (to skip the 4th month freeze payment)
exports.addPKPFreeze = functions.https.onRequest((req,res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'izzah.nadzri@accenture.com').get();
  const usersQuery = admin.firestore().collection('users').get();
  const freezesQuery = admin.firestore().collection('payments').where('source', '==', 'freeze')
    .where('freezeFor', '>=', moment('20200101').startOf('day').toDate())
    .get();
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([usersQuery, freezesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const freezesResults = results[1];
    var freezeCV19Count = 0;
    // var memberDataList = [];

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);

    var freezeMap = {};
    var userIdFreezeMap = {};
    freezesResults.forEach(doc=>{
      const data = doc.data();
      const freezeFor = data && data.freezeFor? moment(data.freezeFor).isValid()? data.freezeFor:null : null;
      // const freezeFor = data && data.freezeFor;
      const createdAt = data && data.createdAt? moment(data.createdAt).isValid()? data.createdAt:null:null;
      const freezeType = data && data.freezeType; 
      // const createdAt = data && data.createdAt;
      // const existingCV19Freeze = moment(getTheDate(freezeFor)).isBetween(moment('20200517'), moment('20200616')) 
      // && (freezeType === 'specialFreeze');
      const existingCV19Freeze = (freezeType==='specialFreezeM3')?true:false;

      const userId = data && data.userId;
      if(userId && existingCV19Freeze){
        freezeMap[doc.id] = data;
        var userFreezes = userIdFreezeMap[userId];
        if(!userFreezes){
          userFreezes = [];
        }
        userFreezes.push(data);
        userIdFreezeMap[userId] = userFreezes;
      }
    });

    // console.log('userIdFreezeMap: ', userIdFreezeMap);

    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;

      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
      const memberIsExpired = membershipEndsMoment.isBefore(startOfTodayMoment);
      const memberIsCancel = data && data.cancellationDate;
      const userFreezes = userIdFreezeMap[doc.id];
      // console.log('userFreezes: ', userFreezes);

      if (!memberIsCancel && membershipStarts && membershipEnds && packageId 
        && !userFreezes
        ){
        // memberDataList.push(data);
        // console.log("Updating member data: ", memberId, data);
        // batch.update(admin.firestore().collection('users').doc(memberId), {packageId:updatedPkgId});
        const freezeData = {
          createdAt:timestamp,
          freezeFor:moment('20200517').tz('Asia/Kuala_Lumpur').startOf('day').toDate(),
          // freezeEnd:moment('20200414').tz('Asia/Kuala_Lumpur').startOf('day').toDate(),
          source:'freeze',
          type:'membership',
          totalPrice:0,
          userId:memberId,
          freezeType:'specialFreezeM3',
          // freezeEnd:moment('20200614').tz('Asia/Kuala_Lumpur').startOf('day').toDate()
        };

        admin.firestore().collection('payments').add(freezeData);
        if(freezeCV19Count >= 499){
          batch.commit();
          freezeCV19Count = 0;
          batch = admin.firestore().batch();
        }
        freezeCV19Count += 1;
      }
    });

    var CV19FreezeLogs = {
      success:true,
      message: 'no freeze added',
      createdAt: timestamp
    }

    // 
    if(freezeCV19Count > 0){
      // return 
      return batch.commit().then(()=>{
        CV19FreezeLogs = {
          success:true,
          message: 'OK',
          freezeCV19Count,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
        return res.status(200).send(CV19FreezeLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
      return res.status(200).send(CV19FreezeLogs);
    }
  });
});

// remove PKPFreeze
exports.removePKPFreeze = functions.https.onRequest((req,res) => {
  //const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const freezesQuery = admin.firestore().collection('payments')
    // .where('freezeType', '==', 'specialFreezePKP2')
    .where('source', '==', 'freeze')
    .where('freezeType', '==', 'specialFreezePKP2')
    // .where('freezeFor', '>=', moment('20200315').startOf('day').toDate())
    .get();
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([freezesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const freezesResults = results[0];
    console.log('freezesResults: ', freezesResults);
    var freezeCV19Count = 0;

    // return Promise.resolve();
    // const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    freezesResults && freezesResults.forEach((doc, id)=>{
      //batch.delete(admin.firestore().collection('payments').doc(doc.id));
      const data = doc.data();
      const freezeFor = data && data.freezeFor;
      const specialFreeze = data && data.specialFreeze;
      // const isFrozenByCRO = moment(getTheDate(freezeFor)).isBetween(moment('20200517').startOf('day').toDate(), moment('20200614').startOf('day').toDate())
      // if (isFrozenByCRO){
        console.log('freezeFor: ', moment(getTheDate(freezeFor)).format('MMDDYYYY'))
        admin.firestore().collection('payments').doc(doc.id).delete();
        if(freezeCV19Count >= 499){
          batch.commit();
          freezeCV19Count = 0;
          batch = admin.firestore().batch();
        }
        freezeCV19Count += 1;
      // }
     
      // if ()
      // console.log('freezeData: ', data);
      // const createdAt = data && data.createdAt;
      // const isToday = moment(createdAt).isSameOrAfter(moment('2020-06-13'), 'day') ? true : false;
      // console.log('isToday: ', isToday);
      
    
     
    });
    var CV19FreezeLogs = {
      success:true,
      message: 'no freeze added',
      createdAt: timestamp
    }

    // 
    if(freezeCV19Count > 0){
      // return 
      return batch.commit().then(()=>{
        CV19FreezeLogs = {
          success:true,
          message: 'OK',
          freezeCV19Count,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
        return res.status(200).send(CV19FreezeLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
      return res.status(200).send(CV19FreezeLogs);
    }
  });
});

// remove hasrecurring
exports.removeHasRecurring = functions.https.onRequest((req,res) => {
  //const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const userQuery = admin.firestore().collection('users')
    // .where('freezeType', '==', 'specialFreezePKP2')
    .where('hasRecurring', '==', true)
    // .where('freezeFor', '>=', moment('20200315').startOf('day').toDate())
    .get();
  const paymentQuery = admin.firestore().collection('payments')
    .where('type', '==', 'membership')
    .get();
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([userQuery, paymentQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const userResults = results[0];
    const paymentResults = results[1];

    // console.log('userResults: ', userResults);
    // console.log('paymentResults: ', paymentResults);

    var hasRecurringCount = 0;

    var paymentMap = {};
    paymentResults && paymentResults.forEach((doc)=>{
      const data = doc.data();
      const source = data && data.source;
      const type = data && data.type;
      const userId = data && data.userId;
      const createdAt = data && data.createdAt;

      // 1st logic
      // if((source === 'vend') && type === 'membership' && userId && 
      //   createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment('20200101'))
      //   ){
      //   if(!paymentMap[userId] && data && userId){
      //     paymentMap[userId] = {};
      //   }
      //   else if (userId){
      //     paymentMap[userId][doc.id] = data;
      //   }
      // }

      // 2nd logic
      // if(source !== 'adyen' && type === 'membership'){
      //   if(!paymentMap[userId] && data && userId){
      //     paymentMap[userId] = {};
      //   }
      //   else if (userId){
      //     paymentMap[userId][doc.id] = data;
      //   }
      // }

      // 3rd logic
      if (source === 'adyen' && type === 'membership' && userId){
        if(!paymentMap[userId] && data && userId){
          paymentMap[userId] = {};
        }
        else if (userId){
          paymentMap[userId][doc.id] = data;
        }
      }
    });

    console.log('paymentMap: ', paymentMap);

    userResults && userResults.forEach((doc, id)=>{
      //batch.delete(admin.firestore().collection('payments').doc(doc.id));
      const data = doc.data();
      const hasRecurring = data && data.hasRecurring;
      const cancellationDate = data && data.cancellationDate;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;

      // const paymentViaAdyen
      const paymentData = paymentMap? paymentMap[doc.id]:null;
      // const monthDiff = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
      
      // console.log('paymentData: ', paymentData);

      var paymentArray = [];
      
      var adyenCount = 0;
      var vendCount = 0;
      if (hasRecurring && !paymentData){
        console.log('userData: ', data);

        // console.log('paymentData: ', paymentData);
        // Object.entries(paymentData).forEach(([key, value]) => {
        //   // console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
        //   const paymentId = key;
        //   const paymentSource = value && value.source;
        //   const userId = value && value.userId;

          
        //   // if (paymentSource !== 'adyen')
        //   console.log('paymentSource: ', paymentSource);
        //   if (paymentSource === 'adyen'){
        //     adyenCount += 1;
        //   }
        //   // else if (paymentSource === 'vend'){
        //   //   vendCount += 1;
        //   // }
        // });

        // console.log('adyenCount: ', adyenCount);
        // console.log('vendCount: ', vendCount);

        // paymentData && paymentData.forEach(payment=>{
        //   const source = payment && payment.source;
        //   console.log('paymentSource: ', source);
        //   // return true;
        // });
        // const userPaymentSource = paymentData.
        admin.firestore().collection('users').doc(doc.id).update({hasRecurring:false});
        if(hasRecurringCount >= 499){
          batch.commit();
          hasRecurringCount = 0;
          batch = admin.firestore().batch();
        }
        hasRecurringCount += 1;
      }
     
    });
    var recurringLogs = {
      success:true,
      message: 'no hasrecurring removed',
      createdAt: timestamp
    }

    // 
    if(hasRecurringCount > 0){
      // return 
      return batch.commit().then(()=>{
        recurringLogs = {
          success:true,
          message: 'OK',
          hasRecurringCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
        return res.status(200).send(recurringLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
      return res.status(200).send(recurringLogs);
    }
  });
});

// function to terminate all complimentaryPromo members
// remove PKPFreeze
exports.terminateComplimentaryPromo = functions.https.onRequest((req,res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'shuyiwong91@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([usersQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const userResults = results[0];
    // console.log('userResults: ', userResults);
    var complimentaryPromoCount = 0;

    // return Promise.resolve();
    // const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    userResults && userResults.forEach((doc, id)=>{
      //batch.delete(admin.firestore().collection('payments').doc(doc.id));
      const data = doc.data();
      const email = data && data.email;
      const name = data && data.name;
      const complimentaryPromo = data && data.complimentaryPromo;
      const packageId = data && data.packageId;
      const isComplimentaryPkg = (packageId === 'L6sJtsKG68LpEUH3QeD4')?true:false;

      if (complimentaryPromo || isComplimentaryPkg){
        console.log('complimentaryPromoEmail: ', email);

        admin.firestore().collection('users').doc(doc.id).update({
          cancellationDate:timestamp, cancellationReason:'auto terminate for complimentary promo'
        })
        // admin.firestore().collection('payments').doc(doc.id).delete();
        if(complimentaryPromoCount >= 499){
          batch.commit();
          complimentaryPromoCount = 0;
          batch = admin.firestore().batch();
        }
        complimentaryPromoCount += 1;
      }
     
    });
    var complimentaryLogs = {
      success:true,
      message: 'no complimentary removed',
      createdAt: timestamp
    }

    // 
    if(complimentaryPromoCount > 0){
      // return 
      return batch.commit().then(()=>{
        complimentaryLogs = {
          success:true,
          message: 'OK',
          complimentaryPromoCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
        return res.status(200).send(complimentaryLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
      return res.status(200).send(complimentaryLogs);
    }
  });
});

// this function will valide user end date, 
// automatically convert current non-monthly package to monthly pkg 
exports.memberConversion = functions.https.onRequest((req,res) => {

  // const MonthlyPkgAllClub = 'TJ7Fiqgrt6EHUhR5Sb2q';
  // const MonthlyPkgSingle = 'vf2jCUOEeDDiIQ0S42BJ';

  const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulseptemberpromo@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  // during the conversion, make sure to delete all of the unpaid invoices
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('type', '==', 'membership')
    .where('paid', '==', false).get();
  // query to check if the september promo member is eligible for the free months
  // const freezesQuery = admin.firestore().collection('payments').where('source', '==', 'freeze').get();

  // const timestamp = admin.firestore.FieldValue.serverTimestamp();

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packageResults = results[1];
    const invoiceResults = results[2];
    // const freezeResults = results[3];

    var userSwitchToDefaultPkgCount = 0;
    var needsDeleteCount = 0;
    var memberDataList = [];

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var packageMap = {};
    packageResults && packageResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
      // if (((data.renewalTerm === 'month')||(data.renewalTerm === 'monthly')) &&
      // !is3MonthKLCCPackage(doc.id) && !is3MonthTTDIPackage(doc.id)
      // ) {
      // // console.log('packageData: ', data);
      //   packageMap[doc.id] = data;
      // }
    });

    // var freezeMap = {};
    // freezeResults && freezeResults.forEach((doc)=>{
    //   const data = doc.data();
    //   const source = data && data.source;
    //   const userId = data && data.userId;
    //   const freezeFor = data && data.freezeFor;
    //   if(freezeFor && moment(getTheDate(freezeFor)).isAfter(moment('2020')))
    // })
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoiceResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const email = data && data.email;
      const name = data && data.name;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;
      const promoJan2020 = data && data.promoJan2020;
      const promoAug2020 = data && data.promoAug2020;
      const promoMidSep2020 = data && data.promoMidSep2020;
      const promoSep2020 = data && data.promoSep2020;

      console.log('theuserdata: ', data);
      // var unitPrice = 0; //default
      // const isPromoPackageId = get3Mpkgs(packageId);
      const isPromoPackageId = isPromoPackage(packageId);
      const cancellationDate = data && data.cancellationDate;

      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
      // const isMembershipStartPromo = membershipStarts && moment(getTheDate(membershipStarts)).isSameOrAfter(moment('20200101').tz('Asia/Kuala_Lumpur').startOf('day'));
      // console.log('isMembershipStartPromo: ', isMembershipStartPromo);
      const memberIsExpired = membershipEndsMoment.isBefore(startOfTodayMoment);

      const packageData = packageId && packageMap[packageId];
      const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : null;
      const currentPackageName = packageData && packageData.name;
      const isNonMonthlyPackageId = (renewalTerm === '4monthly' || renewalTerm === 'quarterly' || renewalTerm === 'biyearly' || renewalTerm === 'year' || renewalTerm === 'yearly')

      // console.log('memberIsExpired: ', memberIsExpired);
      // console.log('renewalTerm: ', renewalTerm);
      // const updatedPkgId = (packageId === 'L6sJtsKG68LpEUH3QeD4')? 'TJ7Fiqgrt6EHUhR5Sb2q':'TJ7Fiqgrt6EHUhR5Sb2q';

      const updatedPkgId = convertToSingleOrAllAccessPkg(packageId); 
      const updatedPackageData = packageId && packageMap[updatedPkgId];
      const updatedPackageName = updatedPackageData && updatedPackageData.name;

      // map the invoice for the user
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const existingInvoiceData = invoiceMap[invoiceId];
      const pkgIdFromInvoice = existingInvoiceData && existingInvoiceData.packageId;
      const isStaff = data && data.isStaff;
      
      // if (invoiceId && (pkgIdFromInvoice === 'AHgEEavKwpJoGTMOzUdX' || pkgIdFromInvoice === 'YsOxVJGLRXrHDgNTBach' || pkgIdFromInvoice === 'uQO2UsaRiqXtzPKjTSIS')){
      //   console.log('remove all unpaid invoice');
      //   batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
      //     if(userSwitchToDefaultPkgCount + needsDeleteCount >= 499){
      //       batch.commit();
      //       userSwitchToDefaultPkgCount = 0;
      //       needsDeleteCount = 0;
      //       batch = admin.firestore().batch();
      //     }
      //     console.log("Deleting unpaid invoice (change package)", invoiceId);
      //     needsDeleteCount += 1;
      // }
      // remove if current user package is not the same as package from invoice
      if (packageId && pkgIdFromInvoice && (packageId!==pkgIdFromInvoice) && invoiceId){
        console.log('remove all unpaid invoice');
        batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(userSwitchToDefaultPkgCount + needsDeleteCount >= 499){
            batch.commit();
            userSwitchToDefaultPkgCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (change package)", invoiceId);
          needsDeleteCount += 1;
      }
      // if cancel, remove all unpaid invoice
      else if ((cancellationDate && invoiceId)){
        console.log('remove all unpaid invoice');
        batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(userSwitchToDefaultPkgCount + needsDeleteCount >= 499){
            batch.commit();
            userSwitchToDefaultPkgCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
      }
      else if (memberIsExpired && isNonMonthlyPackageId && !cancellationDate){
        // convert to default package, send email? 
      }
      // checking condition to change the member package
      else if (!cancellationDate && isPromoPackageId && memberIsExpired
        && ((promoJan2020 >= 4) || ((promoJan2020 >= 3) && (packageId === 'LNGWNSdm6kf4rz1ihj0i')) 
        || promoAug2020 >= 3 || promoMidSep2020 >= 3 || promoSep2020 >= 3) 
        ){
        
        console.log('need to switch package: ', data);

        if (invoiceId){
          // remove the invoice if it is existed
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
         
          if(userSwitchToDefaultPkgCount + needsDeleteCount >= 499){
            batch.commit();
            // userSwitchToDefaultPkgCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice", invoiceId);
          needsDeleteCount += 1;
        }
        
         // update the users
        batch.update(admin.firestore().collection('users').doc(memberId), {packageId:updatedPkgId})
          // .then(()=>{
          //   return sendUpdatedPackageEmail(email, name, currentPackageName, updatedPackageName, moment().format('DD-MM-YYYY'))
          // })
        // sendUpdatedPackageEmail(email, name, currentPackageName, updatedPackageName, moment().format('DD-MM-YYYY'));

        if(userSwitchToDefaultPkgCount + needsDeleteCount >= 499){
          batch.commit();
          userSwitchToDefaultPkgCount = 0;
          batch = admin.firestore().batch();
        }
        userSwitchToDefaultPkgCount += 1;
      }
    });

    var memberValidationLogs = {
      success:true,
      message: 'no member updated',
      createdAt: timestamp
    }

    // 
    if(userSwitchToDefaultPkgCount + needsDeleteCount > 0){
      // return 
      return batch.commit().then(()=>{
        memberValidationLogs = {
          success:true,
          message: 'OK',
          userSwitchToDefaultPkgCount,
          needsDeleteCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('memberValidationLogs').add(memberValidationLogs);
        return res.status(200).send(memberValidationLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      admin.firestore().collection('memberValidationLogs').add(memberValidationLogs);
      return res.status(200).send(memberValidationLogs);
    }
  });
});

// this function will add createdAt to user if it is not exist, 
// automatically convert current non-monthly package to monthly pkg 
exports.addCreatedAtToUsers = functions.https.onRequest((req,res) => {

  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([usersQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];

    var memberDataList = [];
    var userCount = 0;
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;

      if (joinDate && !createdAt){
  
        console.log("Updating member data: ", memberId, data);
        batch.update(admin.firestore().collection('users').doc(memberId), {createdAt:joinDate});

        if(userCount >= 499){
          batch.commit();
          userCount = 0;
          batch = admin.firestore().batch();
        }
        userCount += 1;
      }
      
    });

    var memberValidationLogs = {
      success:true,
      message: 'no member updated',
      createdAt: timestamp
    }

    // 
    if(userCount > 0){
      // return 
      return batch.commit().then(()=>{
        memberValidationLogs = {
          success:true,
          message: 'OK',
          userCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
        admin.firestore().collection('memberValidationLogs').add(memberValidationLogs);
        return res.status(200).send(memberValidationLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      
    }else{
      admin.firestore().collection('memberValidationLogs').add(memberValidationLogs);
      return res.status(200).send(memberValidationLogs);
    }
  });
});

// remove packageId if autoBilling date is not found
// exports.removePackage = functions.https.onRequest((req,res) => {
//   //const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
//   // const usersQuery = admin.firestore().collection('users').get();
//   const userQuery = admin.firestore().collection('users')
//     // .where('freezeType', '==', 'specialFreezePKP2')
//     // .where('hasRecurring', '==', true)
//     // .where('freezeFor', '>=', moment('20200315').startOf('day').toDate())
//     .get();
//   const paymentQuery = admin.firestore().collection('payments')
//     .where('type', '==', 'membership')
//     .get();

//   return Promise.all([userQuery, paymentQuery]).then(results=>{
//     // Get a new write batch
//     var batch = admin.firestore().batch();

//     const userResults = results[0];
//     const paymentResults = results[1];

//     // console.log('userResults: ', userResults);
//     // console.log('paymentResults: ', paymentResults);

//     var hasRecurringCount = 0;

//     var paymentMap = {};
//     paymentResults && paymentResults.forEach((doc)=>{
//       const data = doc.data();
//       const source = data && data.source;
//       const type = data && data.type;
//       const userId = data && data.userId;
//       const createdAt = data && data.createdAt;
//       const status = data && data.status;

//       // 3rd logic
//       if (type === 'membership' && userId && status === 'CLOSED'){
//         if(!paymentMap[userId] && data && userId){
//           paymentMap[userId] = {};
//         }
//         else if (userId){
//           paymentMap[userId][doc.id] = data;
//         }
//       }
//     });

//     // console.log('paymentMap: ', paymentMap);

//     var count = 0;
//     userResults && userResults.forEach((doc, id)=>{
//       //batch.delete(admin.firestore().collection('payments').doc(doc.id));
//       const data = doc.data();
//       const packageId = data && data.packageId;
//       const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
//       const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;
//       const cancellationDate = data && data.cancellationDate;
//       // const paymentViaAdyen
//       const paymentData = paymentMap? paymentMap[doc.id]:null;
//       // const monthDiff = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
      
//       // console.log('paymentData: ', paymentData);

//       var paymentArray = [];

//       if (membershipStarts && !packageId && !cancellationDate){
//         console.log('userData: ', data);
//         // count += 1;
      
//         admin.firestore().collection('users').doc(doc.id).update({autoMembershipStarts:null, membershipStarts:null});
//         if(count >= 499){
//           batch.commit();
//           count = 0;
//           batch = admin.firestore().batch();
//         }
//         count += 1;
//       }
     
//     });
//     var countLogs = {
//       success:true,
//       message: 'no membershipstart removed',
//       createdAt: timestamp
//     }

//     // 
//     if(count > 0){
//       // return 
//       return batch.commit().then(()=>{
//         countLogs = {
//           success:true,
//           message: 'OK',
//           count,
//           createdAtDate: moment(timestamp).format('DDMMYYYY'),
//           createdAtTime: moment(timestamp).format('hh:mm:ss')
//         };
//         // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
//         return res.status(200).send(countLogs);
//       }).catch((error)=>{
//         console.log('error batch: ', error);
//       });
      
//     }else{
//       // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
//       return res.status(200).send(countLogs);
//     }
//   });
// });

// // remove promo jan 2020 for 3M term Membership
// exports.removePromoJan2020 = functions.https.onRequest((req,res) => {
//   //const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizulklcc@babel.fit').get();
//   // const usersQuery = admin.firestore().collection('users').get();
//   const userQuery = admin.firestore().collection('users')
//     .where('promoJan2020', '==', 3)
//     .where('packageId', '==', 'yQFACCzpS4DKcDyYftBx')
//     .get();
 

//   return Promise.all([userQuery]).then(results=>{
//     // Get a new write batch
//     var batch = admin.firestore().batch();

//     const userResults = results[0];

//     var count = 0;
//     userResults && userResults.forEach((doc, id)=>{
//       //batch.delete(admin.firestore().collection('payments').doc(doc.id));
//       const data = doc.data();
//       const packageId = data && data.packageId;
//       const promoJan2020 = data && data.promoJan2020;
     

//       if (promoJan2020 === 3 && packageId && packageId === 'yQFACCzpS4DKcDyYftBx'){
//         console.log('userData: ', data);
//         // count += 1;
      
//         admin.firestore().collection('users').doc(doc.id).update({promoJan2020:admin.firestore.FieldValue.delete()});
//         if(count >= 499){
//           batch.commit();
//           count = 0;
//           batch = admin.firestore().batch();
//         }
//         count += 1;
//       }
     
//     });
//     var countLogs = {
//       success:true,
//       message: 'no membershipstart removed',
//       createdAt: timestamp
//     }

//     // 
//     if(count > 0){
//       // return 
//       return batch.commit().then(()=>{
//         countLogs = {
//           success:true,
//           message: 'OK',
//           count,
//           createdAtDate: moment(timestamp).format('DDMMYYYY'),
//           createdAtTime: moment(timestamp).format('hh:mm:ss')
//         };
//         // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
//         return res.status(200).send(countLogs);
//       }).catch((error)=>{
//         console.log('error batch: ', error);
//       });
      
//     }else{
//       // admin.firestore().collection('CV19FreezeLogs').add(CV19FreezeLogs);
//       return res.status(200).send(countLogs);
//     }
//   });
// });

exports.generateInvoice3StepPromo = functions.https.onRequest((req,res) => {
  // const MonthlyPkgAllClub = 'TJ7Fiqgrt6EHUhR5Sb2q';
  // const MonthlyPkgSingle = 'vf2jCUOEeDDiIQ0S42BJ';

  const usersQuery = admin.firestore().collection('users').where('email', '==', 'cancer22@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const invoicesQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership').get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const priceSequence = [110, 220, 330];
  const allAccessPriceSeq = [110, 220, 330, 330];
  const singleAccessPriceSeq = [110, 220, 330, 170];
  // const priceSequence = [1, 2, 3]; // testing

  return Promise.all([usersQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const invoicesResults = results[1];

    // console.log('userIdFreezeMap: ', userIdFreezeMap);
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      const is3MKLCCPkg = packageId && is3MonthKLCCPackage(packageId);
      const is3MTTDIPkg = packageId && is3MonthTTDIPackage(packageId);
      
      if(userId && userId.length > 0 && packageId && (is3MKLCCPkg || is3MTTDIPkg) && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    console.log('invoiceIdForUserIdMap: ', invoiceIdForUserIdMap);
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var userSwitchToDefaultPkgCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    const currentMonth = moment().startOf('today').subtract(2, 'days').get('month'); // 0 to 11
    
    // hardcode first
    // const currentMonth = 1; //february;
    // console.log('currentMonth: ', currentMonth);
    
    // for 3 step promo, membership start is on 1/1/2020
    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds;
      const promoJan2020 = data && data.promoJan2020;
      const isKLCCPkg = packageId && is3MonthKLCCPackage(packageId);
      const isTTDIPkg = packageId && is3MonthTTDIPackage(packageId);

      var unitPrice = 0;
      if (promoJan2020 && promoJan2020<=3 && (isKLCCPkg || isTTDIPkg)){
        unitPrice = promoJan2020? (isKLCCPkg? allAccessPriceSeq[promoJan2020]:isTTDIPkg?singleAccessPriceSeq[promoJan2020]:0):0;
      }

      // var unitPrice = 0; //default
      // const unitPrice = promoJan2020? priceSequence[promoJan2020]:0; 

      // const promoPackageId = get3Mpkgs(packageId);
     
      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
      const isMembershipStartPromo = membershipStarts && moment(getTheDate(membershipStarts)).isSameOrAfter(moment('20200101').tz('Asia/Kuala_Lumpur').startOf('day'));
      // console.log('isMembershipStartPromo: ', isMembershipStartPromo);
      
      // const needsPayment = (isKLCCPkg || isTTDIPkg) && promoJan2020 && isMembershipStartPromo && membershipEnds && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
      const needsPayment = (isKLCCPkg || isTTDIPkg) && promoJan2020 && membershipEnds && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
      console.log('needsPayment: ', needsPayment);
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      console.log('invoiceId: ', invoiceId);
      const needsUpdate = (needsPayment === true || invoiceId);
      console.log('needsupdate: ', needsUpdate);

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;

      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          console.log('membershipcancelled, no invoice generated, do nothing.');
        }
      }
      // else if (promoJan2020 >= 4){
       
      //   if (!needsUpdate && invoiceId){
      //     batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
      //     if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
      //       batch.commit();
      //       needsUpdatedInvoiceCount = 0;
      //       newInvoiceCount = 0;
      //       needsDeleteCount = 0;
      //       batch = admin.firestore().batch();
      //     }
      //     console.log("Deleting unpaid invoice", invoiceId);
      //     needsDeleteCount += 1;
      //   }
      //   // else{
      //   //   console.log('switching package');
      //   //   // convert to ttdi package
      //   //   // batch.update(admin.firestore().collection('users').doc(memberId), {packageId:'vf2jCUOEeDDiIQ0S42BJ'});
      //   //   //batch.commit();
      //   //   if (isTTDIPkg){
      //   //     admin.firestore().collection('users').doc(memberId).update({packageId: 'vf2jCUOEeDDiIQ0S42BJ'});
      //   //   }
      //   //   else if (isKLCCPkg){
      //   //     admin.firestore().collection('users').doc(memberId).update({packageId: 'TJ7Fiqgrt6EHUhR5Sb2q'});
      //   //   }
      //   // }
      // }
      else if ((isKLCCPkg || isTTDIPkg) && needsUpdate && membershipCancelled === false && quantity<=3){
        
        var amount;
        var invoiceData;
        // const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1;

        // if (promoJan2020){
        //   unitPrice = priceSequence[promoJan2020]; // charge 220;
        // }
        var totalPrice = unitPrice;

        if(invoiceId){
          console.log('existing invoices: ', invoiceId);
          if (quantity === 2 && promoJan2020 === 1){
            totalPrice = 550;
          }
          else if (quantity === 3 && promoJan2020 === 1){
            totalPrice = isKLCCPkg? 880:720;
          }
          // else if (quantity === 4 && promoJan2020 === 1){
          //   totalPrice = isKLCCPkg? 660:500;
          // }

          else if (quantity === 2 && promoJan2020 === 2){
            totalPrice = isKLCCPkg? 660:500;
          }
          else if (quantity === 3 && promoJan2020 === 2){
            totalPrice = isKLCCPkg? 990:750;
          }

          else if (quantity === 2 && promoJan2020 === 3){
            totalPrice = isKLCCPkg? 660:420;
          }
          else if (quantity === 3 && promoJan2020 === 3){
            totalPrice = isKLCCPkg? 990:670;
          }
          else if (quantity === 4 && promoJan2020 === 4){
            totalPrice = isKLCCPkg? 660:420;
          }

          amount = get12StringAmount(totalPrice);
         
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;

          invoiceData = {
            createdAt : createdAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            type : 'membership',
            hasSST : moment(createdAt).isSameOrAfter(moment('2018-09-01'), 'day') ? true : false,
            billingDate: membershipEnds?membershipEnds:null,
            promoJan2020:true,
          }

          existingInvoiceList.push(invoiceData);
          console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        else{
          console.log('create a new invoice');
          invoiceId = admin.firestore().collection('invoices').doc().id;
        
          const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
          // const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1;
          // var totalPrice = unitPrice;
          if (quantity === 2 && promoJan2020 === 1){
            totalPrice = 550;
          }
          else if (quantity === 3 && promoJan2020 === 1){
            totalPrice = isKLCCPkg? 880:720;
          }
          else if (quantity === 2 && promoJan2020 === 2){
            totalPrice = isKLCCPkg? 660:500;
          }
          else if (quantity === 3 && promoJan2020 === 2){
            totalPrice = isKLCCPkg? 990:750;
          }

          else if (quantity === 2 && promoJan2020 === 3){
            totalPrice = isKLCCPkg? 660:420;
          }
          else if (quantity === 3 && promoJan2020 === 3){
            totalPrice = isKLCCPkg? 990:670;
          }
          else if (quantity === 4 && promoJan2020 === 4){
            totalPrice = isKLCCPkg? 660:420;
          }

          amount = get12StringAmount(totalPrice);
          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            promoJan2020:true,
          }
          console.log("Adding invoice", amount, invoiceId, invoiceData);
          console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }
      // create a new invoice
      // else if(membershipCancelled === false){
      //   //TODO add invoice id
      //   invoiceId = admin.firestore().collection('invoices').doc().id;
      //   console.log('create a new invoice')
      
      //   const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
      //   // const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1;

      //   if (promoJan2020){
      //     unitPrice = priceSequence[promoJan2020]; // charge 220;
      //   }
      //   // 0 is occured when the user is currently freezing
      //   if (quantity <= 0){
      //     console.log('qty is equal to 0');
      //     return;
      //   }
      //   const totalPrice = unitPrice;
      //   if (totalPrice<=0){
      //     batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
      //   }
      //   amount = `${totalPrice}00`;
      //   console.log('theAmount: ', amount);
      //   const concatLength = 12-amount.length;
      //   for (var x = 0; x < concatLength; x++) {
      //     amount = '0'.concat(amount);
      //   }
      //   invoiceData = {
      //     createdAt : startOfTodayMoment.toDate(),
      //     packageId : packageId,
      //     paid : !needsPayment,
      //     paymentFailed : false,
      //     paymentId : null,
      //     userId : doc.id,
      //     unitPrice : `${unitPrice}`,
      //     totalPrice : `${totalPrice}`,
      //     amount : amount,
      //     quantity : quantity,
      //     invoiceMailed : false,
      //     dueMailed : false,
      //     overdueMailed : false,
      //     receiptMailed : false,
      //     type : 'membership',
      //     hasSST : true,
      //     billingDate: membershipEnds?membershipEnds:null
      //   }
      //   console.log("Adding invoice", amount, invoiceId, invoiceData, applicableFreezeMonths);
      //   console.log('invoiceData: ', invoiceData);
        
      //   newInvoiceList.push(invoiceData);
      //   batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
      //   if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
      //     batch.commit();
      //     needsUpdatedInvoiceCount = 0;
      //     newInvoiceCount = 0;
      //     needsDeleteCount = 0;
      //     batch = admin.firestore().batch();
      //   }
      //   newInvoiceCount += 1;
      // }
    });

    var invoiceLogs = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // 
    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        console.log("Updated invoice", needsUpdatedInvoiceCount);
        console.log('New invoices', newInvoiceCount);
        console.log('Deleted invoices', needsDeleteCount);
        invoiceLogs = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
        return res.status(200).send(invoiceLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(invoiceLogs);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
      return res.status(200).send(invoiceLogs);
    }
  });
});

// generate invoice for aug2020 promo
exports.generateInvoice3StepPromoAug2020 = functions.https.onRequest((req,res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizul9ttdi@babel.fit').get();
  const usersQuery = admin.firestore().collection('users').where('createdFrom', '==', 'aug2020').get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false).where('type', '==', 'membership')
    .where('promoType', '==', 'aug2020')
    .get();
 
  const allAccessPriceSeq = [63, 330, 330];
  const singleAccessPriceSeq = [63, 250, 250];

  return Promise.all([usersQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const invoicesResults = results[1];

    // console.log('userIdFreezeMap: ', userIdFreezeMap);
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    // console.log('invoiceIdForUserIdMap: ', invoiceIdForUserIdMap);
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var userSwitchToDefaultPkgCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    // const currentMonth = moment().startOf('today').subtract(2, 'days').get('month'); // 0 to 11
    
    // hardcode first
    // const currentMonth = 1; //february;
    // console.log('currentMonth: ', currentMonth);
    
    // for 3 step promo, 
    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds;
      const promoAug2020 = data && data.promoAug2020;
      const promoJan2020 = data && data.promoJan2020;
     
      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
     

      const needsPayment = packageId && (packageId === 'AHgEEavKwpJoGTMOzUdX' || packageId === 'YsOxVJGLRXrHDgNTBach') && promoAug2020 && (promoAug2020>=1) && membershipEnds && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
      console.log('needsPayment: ', needsPayment);
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      console.log('invoiceId: ', invoiceId);
      const needsUpdate = (needsPayment === true || invoiceId);
      console.log('needsupdate: ', needsUpdate);

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;

      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          console.log('membershipcancelled, no invoice generated, do nothing.');
        }
      }
      else if ((packageId === 'AHgEEavKwpJoGTMOzUdX' || packageId === 'YsOxVJGLRXrHDgNTBach') && needsUpdate && membershipCancelled === false){
        
        var invoiceData;
  
        // const unitPrice = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        // const unitPriceWithTax = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        // hardcode first
        const unitPrice = packageId === 'YsOxVJGLRXrHDgNTBach'? 330 : packageId === 'AHgEEavKwpJoGTMOzUdX'? 250:250;
        const unitPriceWithTax = packageId === 'YsOxVJGLRXrHDgNTBach'? 349.8 : packageId === 'AHgEEavKwpJoGTMOzUdX'? 265:265;
        const unitTax = unitPriceWithTax - unitPrice;
        const totalPrice = unitPriceWithTax*quantity;
        const totalTax = unitTax*quantity;
        const amount = get12StringAmount(totalPrice);

        if(invoiceId){
          console.log('existing invoices: ', invoiceId);

          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;

          invoiceData = {
            createdAt : createdAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            type : 'membership',
            billingDate: membershipEnds?membershipEnds:null,
            promoType:'aug2020',
            // paymentCycle: 
            // unitPrice : `${unitPrice}`,
            // totalPrice : `${totalPrice}`,
            // amount : amount,
            tax: parseFloat(totalTax).toFixed(2),
          }

          existingInvoiceList.push(invoiceData);
          console.log("Updating unpaid invoice", amount, invoiceId);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        else{
          console.log('create a new invoice');
          invoiceId = admin.firestore().collection('invoices').doc().id;
        
          const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
          // const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1;
          // var totalPrice = unitPrice;
         
          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            promoType:'aug2020',
            // paymentCycle: 
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            tax: parseFloat(totalTax).toFixed(2),
          }
          console.log("Adding invoice", amount, invoiceId);
          // console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }
    });

    var invoiceLogs = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // 
    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        console.log("Updated invoice", needsUpdatedInvoiceCount);
        console.log('New invoices', newInvoiceCount);
        console.log('Deleted invoices', needsDeleteCount);
        invoiceLogs = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
        return res.status(200).send(invoiceLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(invoiceLogs);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
      return res.status(200).send(invoiceLogs);
    }
  });
});

// generate invoice for mid sep 2020 promo
exports.generateInvoice3StepPromoMidSep2020 = functions.https.onRequest((req,res) => {
  const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizultestmidsep2020@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').where('createdFrom', '==', 'midSep2020').get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false).where('type', '==', 'membership')
    .where('promoType', '==', 'midSep2020')
    .get();

  return Promise.all([usersQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const invoicesResults = results[1];

    // console.log('userIdFreezeMap: ', userIdFreezeMap);
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    // console.log('invoiceIdForUserIdMap: ', invoiceIdForUserIdMap);
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var userSwitchToDefaultPkgCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];
    // const currentMonth = moment().startOf('today').subtract(2, 'days').get('month'); // 0 to 11
    
    // hardcode first
    // const currentMonth = 1; //february;
    // console.log('currentMonth: ', currentMonth);
    
    // for 3 step promo, 
    usersResults.forEach(doc=>{
      const data = doc.data();
      const memberId = doc.id;
      const packageId = data && data.packageId;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds;
      const promoMidSep2020 = data && data.promoMidSep2020;
     
      const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
      // console.log('membershipEndMoment: ', membershipEndsMoment);
      // console.log('todayMoment: ', startOfTodayMoment);
     

      const needsPayment = packageId && (packageId === 'kh513XOaG7eLX4z9G0Ft' || packageId === 'hUZjGJR77bP30I3fjvwD') && promoMidSep2020 && (promoMidSep2020>=1 && promoMidSep2020<=3) && membershipEnds && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
      console.log('needsPayment: ', needsPayment);
    
      var membershipCancelled = false;
      if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
        (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
        membershipCancelled = true;
      }
      
      var invoiceId = invoiceIdForUserIdMap[doc.id];
      console.log('invoiceId: ', invoiceId);
      const needsUpdate = (needsPayment === true || invoiceId);
      console.log('needsupdate: ', needsUpdate);

      if(data.locked){
        console.log("Locked invoice", invoiceId);
        return;
      }

      const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;

      // if the invoice is already existed, but if its not supposed to be charged, del the invoice
      // if((!needsPayment || membershipCancelled) && invoiceId){
      if(membershipCancelled){
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice (terminated)", invoiceId);
          needsDeleteCount += 1;
        }
        else{
          console.log('membershipcancelled, no invoice generated, do nothing.');
        }
      }
      else if ((packageId === 'hUZjGJR77bP30I3fjvwD' || packageId === 'kh513XOaG7eLX4z9G0Ft') && needsUpdate && membershipCancelled === false){
        
        var invoiceData;
  
        // const unitPrice = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        // const unitPriceWithTax = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        // hardcode first
        const unitPrice = packageId === 'kh513XOaG7eLX4z9G0Ft'? 330 : packageId === 'hUZjGJR77bP30I3fjvwD'? 250:250;
        const unitPriceWithTax = packageId === 'kh513XOaG7eLX4z9G0Ft'? 349.8 : packageId === 'hUZjGJR77bP30I3fjvwD'? 265:265;
        const unitTax = unitPriceWithTax - unitPrice;
        const totalPrice = unitPriceWithTax*quantity;
        const totalTax = unitTax*quantity;
        const amount = get12StringAmount(totalPrice);

        if(invoiceId){
          console.log('existing invoices: ', invoiceId);

          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

          const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
          const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
          const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

          const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
          const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
          const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

          const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
          const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
          const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

          const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;

          invoiceData = {
            createdAt : createdAt,
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            quantity : quantity,
            invoiceMailed : invoiceMailed,
            invoiceMailedAt : invoiceMailedAt,
            dueMailed : dueMailed,
            dueMailedAt : dueMailedAt,
            overdueMailed : overdueMailed,
            overdueMailedAt : overdueMailedAt,
            receiptMailed : receiptMailed,
            type : 'membership',
            billingDate: membershipEnds?membershipEnds:null,
            promoType:'midSep2020',
            // paymentCycle: 
            // unitPrice : `${unitPrice}`,
            // totalPrice : `${totalPrice}`,
            // amount : amount,
            tax: parseFloat(totalTax).toFixed(2),
          }

          existingInvoiceList.push(invoiceData);
          console.log("Updating unpaid invoice", amount, invoiceId);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          needsUpdatedInvoiceCount += 1;
        }
        else{
          console.log('create a new invoice');
          invoiceId = admin.firestore().collection('invoices').doc().id;
        
          const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
          // const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1;
          // var totalPrice = unitPrice;
         
          invoiceData = {
            createdAt : startOfTodayMoment.toDate(),
            packageId : packageId,
            paid : !needsPayment,
            paymentFailed : false,
            paymentId : null,
            userId : doc.id,
            quantity : quantity,
            invoiceMailed : false,
            dueMailed : false,
            overdueMailed : false,
            receiptMailed : false,
            type : 'membership',
            hasSST : true,
            billingDate: membershipEnds?membershipEnds:null,
            promoType:'midSep2020',
            // paymentCycle: 
            unitPrice : `${unitPrice}`,
            totalPrice : `${totalPrice}`,
            amount : amount,
            tax: parseFloat(totalTax).toFixed(2),
          }
          console.log("Adding invoice", amount, invoiceId);
          // console.log('invoiceData: ', invoiceData);
          
          newInvoiceList.push(invoiceData);
          batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          newInvoiceCount += 1;
        }
      }
    });

    var invoiceLogs = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    // 
    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
      // return 
      return batch.commit().then(()=>{
        console.log("Updated invoice", needsUpdatedInvoiceCount);
        console.log('New invoices', newInvoiceCount);
        console.log('Deleted invoices', needsDeleteCount);
        invoiceLogs = {
          success:true,
          message: 'OK',
          needsUpdatedInvoiceCount,
          newInvoiceCount,
          needsDeleteCount,
          existingInvoiceList,
          newInvoiceList,
          userSwitchToDefaultPkgCount,
          createdAtDate: moment(timestamp).format('DDMMYYYY'),
          createdAtTime: moment(timestamp).format('hh:mm:ss')
        };
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
        return res.status(200).send(invoiceLogs);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(invoiceLogs);
    }else{
      admin.firestore().collection('chargeInvoiceLogs').add(invoiceLogs);
      return res.status(200).send(invoiceLogs);
    }
  });
});

  // for Jan2020 promo
  // Jan2020 is already paid during registration, this logic is to create an invoice for 
  // 3 step promo 110, 220 and 330. January fee: RM110, Feb fee: RM 220, March fee: RM 330
  // 
  // exports.generateInvoice3Step = functions.https.onRequest((req,res) => {
  //   const ThreeStepPkgIdAllClub = 'LNGWNSdm6kf4rz1ihj0i';
  //   const ThreeStepPkgIdSingle = 'k7As68CqGsFbKZh1Imo4';
  //   const threeMonthTermPkg = 'w12J3n9Qs6LTViI6HaEY';
  //   const threeTermMembershipPkg = 'aTHIgscCxbwjDD8flTi3';
  //   const threeMTermMembership = 'yQFACCzpS4DKcDyYftBx';

  //   const MonthlyPkgAllClub = 'TJ7Fiqgrt6EHUhR5Sb2q';
  //   const MonthlyPkgSingle = 'vf2jCUOEeDDiIQ0S42BJ';

  //   const usersQuery = admin.firestore().collection('users').where('email', '==', 'ibrahimdiyana@gmail.com').get();
  //   // const usersQuery = admin.firestore().collection('users').get();
  //   const invoicesQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership').get();
  //   const timestamp = admin.firestore.FieldValue.serverTimestamp();
  //   const priceSequence = [110, 220, 330];
  //   // const priceSequence = [1, 2, 3]; // testing
  //   const packagesQuery = admin.firestore().collection('packages').get();
  //   const freezesQuery = admin.firestore().collection('payments').where('source', '==', 'freeze').get();
  //   const referQuery = admin.firestore().collection('payments').where('source', '==', 'refer').get();

  //   return Promise.all([usersQuery, packagesQuery, invoicesQuery, freezesQuery, referQuery]).then(results=>{
  //     // Get a new write batch
  //     var batch = admin.firestore().batch();

  //     const usersResults = results[0];
  //     const packagesResults = results[1];
  //     const invoicesResults = results[2];
  //     const freezeResults = results[3];
  //     const referResults = results[4];

  //     var packageMap = {};
  //     packagesResults.forEach(doc=>{
  //       const data = doc.data();
  //       if ((doc.id===ThreeStepPkgIdAllClub) || (doc.id===ThreeStepPkgIdSingle) || (doc.id===threeMonthTermPkg) || (doc.id===threeTermMembershipPkg) || (doc.id)===threeMTermMembership) {
  //         // console.log('packageData: ', data);
  //         packageMap[doc.id] = data;
  //       }
  //     });

  //     // console.log('userIdFreezeMap: ', userIdFreezeMap);
  //     var invoiceMap = {};
  //     var invoiceIdForUserIdMap = {};
  //     invoicesResults.forEach(doc=>{
  //       const data = doc.data();
  //       const userId = data && data.userId;
  //       const packageId = data && data.packageId;
  //       const paid = data && data.paid ? data.paid : false;
        
  //       if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid){
  //         invoiceIdForUserIdMap[userId] = doc.id;
  //         invoiceMap[doc.id] = data;
  //       }
  //     });

  //     var freezeMap = {};
  //     var userIdFreezeMap = {};
  //     freezeResults.forEach(doc=>{
  //       const data = doc.data();
  //       const freezeFor = data && data.freezeFor? moment(data.freezeFor).isValid()? data.freezeFor:null : null;
  //       // const freezeFor = data && data.freezeFor;
  //       const createdAt = data && data.createdAt? moment(data.createdAt).isValid()? data.createdAt:null:null;
  //       // const createdAt = data && data.createdAt;
  //       const userId = data && data.userId;
  //       if(userId && (freezeFor!=='undefined') && (createdAt!=='undefined')){
  //         freezeMap[doc.id] = data;
  //         var userFreezes = userIdFreezeMap[userId];
  //         if(!userFreezes){
  //           userFreezes = [];
  //         }
  //         userFreezes.push(data);
  //         userIdFreezeMap[userId] = userFreezes;
  //       }
  //     });

  //     var referMap = {};
  //     var userIdFreeMap = {};
  //     referResults.forEach(doc=>{
  //       const data = doc.data();
  //       const createdAt = data && data.createdAt? moment(data.createdAt).isValid()? data.createdAt:null:null;
  //       // const createdAt = data && data.createdAt;
  //       const userId = data && data.userId;
  //       if(userId && (createdAt!=='undefined')){
  //         referMap[doc.id] = data;
  //         var userRefers = userIdFreeMap[userId];
  //         if(!userRefers){
  //           userRefers = [];
  //         }
  //         userRefers.push(data);
  //         userIdFreeMap[userId] = userRefers;
  //       }
  //     });

  //     console.log('userRefers: ', userRefers);

  //     const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
  //     // console.log('startOfTodayMoment: ', startOfTodayMoment);
  //     var needsUpdatedInvoiceCount = 0;
  //     var newInvoiceCount = 0;
  //     var needsDeleteCount = 0;
  //     var userSwitchToDefaultPkgCount = 0;
  //     var invoiceList = [];
  //     var existingInvoiceList = [];
  //     var newInvoiceList = [];
  //     const currentMonth = moment().startOf('today').subtract(2, 'days').get('month'); // 0 to 11
     
  //     // hardcode first
  //     // const currentMonth = 1; //february;
  //     console.log('currentMonth: ', currentMonth);
     
  //     // for 3 step promo, membership start is on 1/1/2020
  //     usersResults.forEach(doc=>{
  //       const data = doc.data();
  //       const memberId = doc.id;
  //       const packageId = data && data.packageId;
  //       const packageData = packageId && packageMap[packageId];
  //       const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
  //       const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
  //       const membershipEnds = data && data.autoMembershipEnds;
  //       const promoJan2020 = data && data.promoJan2020;
  //       var unitPrice = 0; //default
  //       const promoPackageId = (packageId===ThreeStepPkgIdAllClub) || (packageId===ThreeStepPkgIdSingle) || (packageId===threeMonthTermPkg) || (packageId===threeTermMembershipPkg) || (packageId===threeMTermMembership) 

     
  //       console.log('packageData: ', packageData);

  //       const membershipEndsMoment = moment(getTheDate(membershipEnds)).clone();
  //       console.log('membershipEndMoment: ', membershipEndsMoment);
  //       console.log('todayMoment: ', startOfTodayMoment);
  //       const isMembershipStartPromo = membershipStarts && moment(getTheDate(membershipStarts)).isSameOrAfter(moment('20200101').tz('Asia/Kuala_Lumpur').startOf('day'));
  //       console.log('isMembershipStartPromo: ', isMembershipStartPromo);
        
  //       const needsPayment = promoPackageId && promoJan2020 && isMembershipStartPromo && membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
  //       console.log('needsPayment: ', needsPayment);
      
  //       var membershipCancelled = false;
  //       if (data && (data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'))) || 
  //         (data.tempCancellationDate && moment(getTheDate(data.tempCancellationDate)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')))){
  //         membershipCancelled = true;
  //       }
       
  //       var invoiceId = invoiceIdForUserIdMap[doc.id];
  //       console.log('invoiceId: ', invoiceId);
  //       const needsUpdate = (needsPayment === true || invoiceId);
  //       console.log('needsupdate: ', needsUpdate);

  //       if(data.locked){
  //         console.log("Locked invoice", invoiceId);
  //         return;
  //       }

  //       const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;

  //       // if the invoice is already existed, but if its not supposed to be charged, del the invoice
  //       // if((!needsPayment || membershipCancelled) && invoiceId){
  //       if(membershipCancelled){
  //         if (!needsUpdate && invoiceId){
  //           batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
  //           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
  //             batch.commit();
  //             needsUpdatedInvoiceCount = 0;
  //             newInvoiceCount = 0;
  //             needsDeleteCount = 0;
  //             batch = admin.firestore().batch();
  //           }
  //           console.log("Deleting unpaid invoice (terminated)", invoiceId);
  //           needsDeleteCount += 1;
  //         }
  //         else{
  //           console.log('membershipcancelled, no invoice generated, do nothing.');
  //         }
  //       }
  //       // generate 220 invoice
  //       else if (promoJan2020 === 1 && packageData && needsUpdate && membershipCancelled === false){
          
  //         if(invoiceId){
  //           unitPrice = priceSequence[1]; // charge 220;

  //         }
  //       }
  //       // convert the package to monthly package
  //       else if (currentMonth>=3){
  //         console.log('convert the package to monthly package');
  //         console.log('memberId: ', memberId);
  //         const updatedPkgId = (packageId === ThreeStepPkgIdSingle)? MonthlyPkgSingle:MonthlyPkgAllClub;
  //         batch.update(admin.firestore().collection('users').doc(memberId), {packageId:updatedPkgId});
  //         if(userSwitchToDefaultPkgCount >= 499){
  //           batch.commit();
  //           userSwitchToDefaultPkgCount = 0;
  //           batch = admin.firestore().batch();
  //         }
  //         userSwitchToDefaultPkgCount+=1;
  //       }
  //       // updating the existing invoice
  //       else if(packageData && needsUpdate && membershipCancelled === false && (renewalTerm === 'month')||(renewalTerm === 'monthly')){
          
  //         var applicableFreezeMonths = 0;
  //         const userFreezes = userIdFreezeMap[doc.id];
  //         if (userFreezes){
  //           // console.log('userFreeze123: ', userFreezes);
  //           for (var freezeIndex = 0; userFreezes && freezeIndex < userFreezes.length; freezeIndex++) {
  //             const userFreeze = userFreezes[freezeIndex];
  //             const freezeFor = userFreeze.freezeFor;
  //             const freezeForMoment = freezeFor && moment(getTheDate(freezeFor));
  
  //             if(freezeForMoment && freezeForMoment.isBetween(membershipEndsMoment, startOfTodayMoment, 'day', '[]')){
  //               applicableFreezeMonths += 1;
  //             }
  //           }
  //         }

  //         var applicableFreeMonths = 0;
  //         const userFreeMth = userIdFreeMap[doc.id];
  //         if (userFreeMth){
  //           // console.log('userFreeze123: ', userFreezes);
  //           for (var freeIndex = 0; userFreeMth && freeIndex < userFreeMth.length; freeIndex++) {
  //             const userFree = userFreeMth[freeIndex];
  //             const createdAt = userFree.createdAt;
  //             const createdAtMoment = createdAt && moment(getTheDate(createdAt));
  
  //             if(createdAtMoment && createdAtMoment.isBetween(membershipEndsMoment, startOfTodayMoment, 'day', '[]')){
  //               applicableFreeMonths += 1;
  //             }
  //           }
  //         }

  //         console.log('applicableFreeMonth: ', applicableFreeMonths);

  //         var amount;
  //         var invoiceData;
  //         const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths - applicableFreeMonths;
  //         const activeMonthQty = startOfTodayMoment.diff(moment(getTheDate(membershipStarts)), 'months') + 1 - applicableFreezeMonths;
  //         // const activeMonthQty = 4;
  //         console.log('quantity: ', quantity);
  //         console.log('activeMonthQty: ', activeMonthQty);
          
  //         if (activeMonthQty === 2 || activeMonthQty === 3){
  //           unitPrice = priceSequence[activeMonthQty-1];
  //         }
  //         else if (activeMonthQty>3){
  //           console.log('convert the package to monthly package');
  //           //   console.log('memberId: ', memberId);
  //           // const updatedPkgId = (packageId === ThreeStepPkgIdSingle)? MonthlyPkgSingle:MonthlyPkgAllClub;
  //           var updatedPkgId = MonthlyPkgAllClub;
  //           if (packageId === ThreeStepPkgIdSingle || packageId === ThreeStepPkgIdSingle)
  //           batch.update(admin.firestore().collection('users').doc(memberId), {packageId:updatedPkgId});
  //           if(userSwitchToDefaultPkgCount >= 499){
  //             batch.commit();
  //             userSwitchToDefaultPkgCount = 0;
  //             batch = admin.firestore().batch();
  //           }
  //           userSwitchToDefaultPkgCount+=1;
  //           return;
  //         }
  //         else{
  //           return;
  //         }
  //         console.log('unitPrice: ', unitPrice);
  //         // if the invoice is already created
  //         if(invoiceId){

  //           // if (quantity===1){
  //           //   if (currentMonth===1 || currentMonth===2){
  //           //     console.log('if qty is 1 and month is february');
  //           //     unitPrice = priceSequence[currentMonth]; // for february or march, 220, 330
  //           //   }
             
  //           // }
  //           // else if ((quantity===2) && (currentMonth===2)){ // for march
  //           //   // unitPrice = priceSequence[currentMonth]+priceSequence[currentMonth-1];
  //           //   unitPrice = 550; // hardcode
  //           // }
  //           // else{
  //           //   return;
  //           // }

  //           console.log('theUnitPrice existing invoice: ', unitPrice);
        
  //           const totalPrice = unitPrice;
  //           if (totalPrice<=0 || quantity===0){
  //             console.log('delete the invoice')
  //             batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
  //           }
  //           amount = `${totalPrice}00`;
  //           const concatLength = 12-amount.length;
  //           for (var i = 0; i < concatLength; i++) {
  //             amount = '0'.concat(amount);
  //           }
  //           const existingInvoiceData = invoiceMap[invoiceId];
  //           const existingCreatedAt = existingInvoiceData.createdAt || null;
  //           const existingAmount = existingInvoiceData.amount;
  //           const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;

  //           const invoiceMailed = !needsPayment ? true : existingInvoiceData.invoiceMailed;
  //           const existingInvoiceMailedAt = existingInvoiceData.invoiceMailedAt || null;
  //           const invoiceMailedAt = (needsPayment && existingAmount !== amount) ? null : existingInvoiceMailedAt;

  //           const dueMailed = !needsPayment ? true : existingInvoiceData.dueMailed;
  //           const existingDueMailedAt = existingInvoiceData.dueMailedAt || null;
  //           const dueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingDueMailedAt;

  //           const overdueMailed = !needsPayment ? true : existingInvoiceData.overdueMailed;
  //           const existingOverdueMailedAt = existingInvoiceData.overdueMailedAt || null;
  //           const overdueMailedAt = (needsPayment && existingAmount !== amount) ? null : existingOverdueMailedAt;

  //           const receiptMailed = !needsPayment ? true : existingInvoiceData.receiptMailed;

  //           invoiceData = {
  //             createdAt : createdAt,
  //             packageId : packageId,
  //             paid : !needsPayment,
  //             paymentFailed : false,
  //             paymentId : null,
  //             userId : doc.id,
  //             unitPrice : `${unitPrice}`,
  //             totalPrice : `${totalPrice}`,
  //             amount : amount,
  //             quantity : quantity,
  //             invoiceMailed : invoiceMailed,
  //             invoiceMailedAt : invoiceMailedAt,
  //             dueMailed : dueMailed,
  //             dueMailedAt : dueMailedAt,
  //             overdueMailed : overdueMailed,
  //             overdueMailedAt : overdueMailedAt,
  //             receiptMailed : receiptMailed,
  //             type : 'membership',
  //             hasSST : moment(createdAt).isSameOrAfter(moment('2018-09-01'), 'day') ? true : false,
  //             billingDate: membershipEnds?membershipEnds:null
  //           }

  //           existingInvoiceList.push(invoiceData);
  //           console.log("Updating unpaid invoice", amount, invoiceId, invoiceData);
  //           batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);

  //           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
  //             batch.commit();
  //             needsUpdatedInvoiceCount = 0;
  //             newInvoiceCount = 0;
  //             needsDeleteCount = 0;
  //             batch = admin.firestore().batch();
  //           }
  //           needsUpdatedInvoiceCount += 1;
  //         }
  //         // create a new invoice
  //         else if(membershipCancelled === false){
  //           //TODO add invoice id
  //           invoiceId = admin.firestore().collection('invoices').doc().id;
  //           // to avoid creating the 0 or negative invoices

  //           // // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
  //           // if (quantity===1){
  //           //   unitPrice = priceSequence[currentMonth];
  //           // }
  //           // else if (quantity===2){
  //           //   // unitPrice = priceSequence[currentMonth]+priceSequence[currentMonth-1];
  //           //   unitPrice = 550; //hardcode
  //           // }
  //           // else{
  //           //   unitPrice = priceSequence[currentMonth];
  //           //   return;
  //           // }
  //           // console.log('theUnitPrice new invoice: ', unitPrice);
        
  //           const totalPrice = unitPrice;
  //           if (totalPrice<=0){
  //             batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
  //           }
  //           amount = `${totalPrice}00`;
  //           console.log('theAmount: ', amount);
  //           const concatLength = 12-amount.length;
  //           for (var x = 0; x < concatLength; x++) {
  //             amount = '0'.concat(amount);
  //           }
  //           invoiceData = {
  //             createdAt : startOfTodayMoment.toDate(),
  //             packageId : packageId,
  //             paid : !needsPayment,
  //             paymentFailed : false,
  //             paymentId : null,
  //             userId : doc.id,
  //             unitPrice : `${unitPrice}`,
  //             totalPrice : `${totalPrice}`,
  //             amount : amount,
  //             quantity : quantity,
  //             invoiceMailed : false,
  //             dueMailed : false,
  //             overdueMailed : false,
  //             receiptMailed : false,
  //             type : 'membership',
  //             hasSST : true,
  //             billingDate: membershipEnds?membershipEnds:null
  //           }
  //           console.log("Adding invoice", amount, invoiceId, invoiceData);
  //           console.log('invoiceData: ', invoiceData);
            
  //           newInvoiceList.push(invoiceData);
  //           batch.set(admin.firestore().collection('invoices').doc(invoiceId), invoiceData);
  //           if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
  //             batch.commit();
  //             needsUpdatedInvoiceCount = 0;
  //             newInvoiceCount = 0;
  //             needsDeleteCount = 0;
  //             batch = admin.firestore().batch();
  //           }
  //           newInvoiceCount += 1;
  //         }
  //       }
  //     });

  //     var theObject = {
  //       success:true,
  //       message: 'no invoice updated',
  //       createdAt: timestamp
  //     }

  //     if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount + userSwitchToDefaultPkgCount > 0){
  //       // return 
  //       return batch.commit().then(()=>{
  //         console.log("Updated invoice", needsUpdatedInvoiceCount);
  //         console.log('New invoices', newInvoiceCount);
  //         console.log('Deleted invoices', needsDeleteCount);
  //         theObject = {
  //           success:true,
  //           message: 'OK',
  //           needsUpdatedInvoiceCount,
  //           newInvoiceCount,
  //           needsDeleteCount,
  //           existingInvoiceList,
  //           newInvoiceList,
  //           userSwitchToDefaultPkgCount,
  //           createdAtDate: moment(timestamp).format('DDMMYYYY'),
  //           createdAtTime: moment(timestamp).format('hh:mm:ss')
  //         };
  //       admin.firestore().collection('chargeInvoiceLogs').add(theObject);
  //         return res.status(200).send(theObject);
  //       }).catch((error)=>{
  //         console.log('error batch: ', error);
  //       });
  //       // return res.status(200).send(theObject);
  //     }else{
  //       admin.firestore().collection('chargeInvoiceLogs').add(theObject);
  //       return res.status(200).send(theObject);
  //     }
  //   });
  // });
  //Charge or Send Invoice Email
  // This function will verify all the existing invoices db from firebase,
  // then charge the user if it is on due & update the invoices
  // if hasRecurring is true, auto charge will be called 
  exports.chargeOrSendInvoiceEmail = functions.https.onRequest((req, res) => {

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // if (req){
    //   console.log('thereq: ', req);
    //   if (req.params.email){
    //     console.log('email: ', req.params.email);
    //   }
    // }
    
    const usersQuery = admin.firestore().collection('users').get();
    
    // const usersQuery = admin.firestore().collection('users').where('email', '==', 'alfi_alizar@yahoo.com').get();
    const invoicesQuery = admin.firestore().collection('invoices').
    where('type', '==', 'membership').
    where('paid', '==', false).
    // where('quantity', '==', 1).
    get();

    return Promise.all([usersQuery, invoicesQuery]).then(results=>{
      const usersResults = results[0];
      const invoicesResults = results[1];

      var users = {};
      usersResults.forEach(user=>{
        const data = user.data();
        const cancelledMember = data.cancellationDate? moment(getTheDate(data.cancellationDate)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').startOf('day'))? true:false:false;
        if (!cancelledMember){
          users[user.id] = user.data();
        }
      });

      var emailInvoicePromises = [];
      var sendMail = 0;
      var sendDueMail = 0;
      var sendOverdueMail = 0;
      var recurringCount = 0;
      var chargeCount = 0;
      var chargeErrorCount = 0;
      var emailList = [];
      invoicesResults.forEach(invoice=>{
        // if(invoiceIdsToSend.includes(invoice.id)){
          const invoiceData = invoice.data();
          const userId = invoiceData && invoiceData.userId;
          const userData = users[userId];
          const amount = invoiceData && invoiceData.amount && parseInt(invoiceData.amount);
          // const isValidEmail = userData && userData.email && validateEmail(userData.email);
          var chargeAttempts = invoiceData.chargeAttempts || 0;
          const email = userData && userData.email;

          // if (isValidEmail){
            if(userData && email && invoiceData && !invoiceData.paid && invoiceData.createdAt){
              const hasRecurring = userData.hasRecurring;
              const name = userData.name;
              const date = moment(invoiceData.createdAt).format('MMM YYYY');
              var emailPromise = null;
              //if charge failed more than 5 times, send email.
              if(hasRecurring && !(chargeAttempts > 5)){
                
                recurringCount += 1;
                const billingDate = getTheDate(userData.autoMembershipEnds);
                // console.log('billingDate: ', billingDate && moment(billingDate).format('DD MM YYYY'));
                // console.log('billingDateToDate: ', moment(getTheDate(billingDate)).format('DD MM YYYY'));
                // console.log('moment(billingDate):', moment(billingDate).tz('Asia/Kuala_Lumpur').startOf('day'));
                // console.log('moment().tz', moment().tz('Asia/Kuala_Lumpur')); 
                if(billingDate && moment(billingDate).tz('Asia/Kuala_Lumpur').startOf('day').isSameOrBefore(moment().tz('Asia/Kuala_Lumpur'), 'day')){
                  emailPromise = charge(invoice.id, userId, amount, email).then(results=>{//charge method  
                    chargeCount += 1;
                    console.log('Succesfully requested charge', invoice.id, userId, amount, email);
                    emailList.push({charge:true, email});
                    return admin.firestore().collection('invoices').doc(invoice.id).update({chargeAttempts:chargeAttempts+1, lastChargeAttempt:timestamp});
                  }).catch((error)=>{
                    chargeErrorCount += 1;
                    console.log("Error charging", error, invoice.id, userId, amount, email);
                    emailList.push({charge:false, email});
                    return admin.firestore().collection('invoices').doc(invoice.id).update({chargeAttempts:chargeAttempts+1, lastChargeAttempt:timestamp});
                  });
                }else{ 
                  console.log("Error with billing date", billingDate, invoice.id, userId, amount, email);
                  emailList.push({charge:false, errorBillingDate:true, email});
                }
              }
              else{
                //deciding which email to send. 
                if(!invoiceData.invoiceMailed || !invoiceData.invoiceMailedAt){
                  sendMail+= 1;
                  emailPromise = sendInvoiceEmail(email, name, invoice.id, date).then(results=>{
                    console.log('sendInvoiceEmailResult: ', results);
                    emailList.push({sendInvoiceMail:true, email});
                    return admin.firestore().collection('invoices').doc(invoice.id).update({invoiceMailed:true, invoiceMailedAt:timestamp});
                  }).catch((error)=>{
                    console.log('sendInvoiceEmailError: ', error);
                    return admin.firestore().collection('invoices').doc(invoice.id).update({invoiceMailedErrorMsg:error, errorAt:timestamp});
                  });
                }else if(invoiceData.invoiceMailed && (!invoiceData.dueMailed || !invoiceData.dueMailedAt)){
                  const invoiceMailedAt = invoiceData.invoiceMailedAt;
                  if (!invoiceMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(invoiceMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
                  sendDueMail += 1;
                    emailPromise = sendDueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                      emailList.push({sendDueInvoiceMail:true, email});
                      return admin.firestore().collection('invoices').doc(invoice.id).update({dueMailed:true, dueMailedAt:timestamp});
                    }).catch((error)=>{
                      console.log('sendDueInvoiceEmailError: ', error);
                      return admin.firestore().collection('invoices').doc(invoice.id).update({dueMailedErrorMsg:error, errorAt:timestamp});
                    });
                  }
                }else if (invoiceData.invoiceMailed && invoiceData.dueMailed && (!invoiceData.overdueMailed || !invoiceData.overdueMailedAt)){
                  const dueMailedAt = invoiceData.dueMailedAt;
                  if (!dueMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(dueMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
                  sendOverdueMail += 1;
                    emailPromise = sendOverdueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                      // return console.log('update firebase');
                      emailList.push({sendOverDueInvoiceMail:true, email});
                      return admin.firestore().collection('invoices').doc(invoice.id).update({overdueMailed:true, overdueMailedAt:timestamp});
                    }).catch((error)=>{
                      console.log('sendOverdueMailError: ', error);
                      return admin.firestore().collection('invoices').doc(invoice.id).update({overDueMailedErrorMsg:error, errorAt:timestamp});
                    });
                  }
                }
              }
  
              if(emailPromise){
                emailInvoicePromises.push(emailPromise);
              }
            }
         
      });

      console.log('emails count', sendMail, sendDueMail, sendOverdueMail, recurringCount, chargeCount, chargeErrorCount);
      // return res.status(200).send('OK');

      return Promise.all(emailInvoicePromises).then(results=>{
        
        const theSuccesObject = {
          success: true,
          message: 'OK',
          sendMail: sendMail,
          sendDueMail: sendDueMail,
          sendOverdueMail: sendOverdueMail,
          recurringCount: recurringCount,
          chargeCount: chargeCount,
          chargeErrorCount: chargeErrorCount,
          createdAt: timestamp,
        };

        admin.firestore().collection('adyenLogs').add(emailList);
        admin.firestore().collection('adyenLogs').add(theSuccesObject);

        return res.status(200).send(theSuccesObject);
      });
    });
  });

  exports.chargeOrSendInvoiceEmailv2 = functions.https.onRequest((req, res) => {

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    // const usersQuery = admin.firestore().collection('users').where('email', '==', 'cancer22@gmail.com').get();
    const usersQuery = admin.firestore().collection('users').get();
    const invoicesQuery = admin.firestore().collection('invoices').
    where('type', '==', 'membership').
    where('paid', '==', false).
    // where('packageId', '==', 'ZEDcEHZp3fKeQOkDxCH8').
    get();

    var emailInvoicePromises = [];
    var sendMail = 0;
    var sendDueMail = 0;
    var sendOverdueMail = 0;
    var recurringCount = 0;
    var chargeCount = 0;
    var chargeErrorCount = 0;
    var emailList = [];
    var recurringList = [];
    var invoiceMailList = [];
    var invoiceDueMailList = [];
    var invoiceOverDueMailList = [];


    return Promise.all([usersQuery, invoicesQuery]).then(results=>{
      const usersResults = results[0];
      const invoicesResults = results[1];
      const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

      var users = {};
      usersResults.forEach(user=>{
        const data = user.data();
        const cancelledMember = data.cancellationDate? moment(getTheDate(data.cancellationDate)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').startOf('day'))? true:false:false;
        const membershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds: null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone()); 
        const isTestAccount = data.roles? data.roles.testAccount? data.roles.testAccount:false:false;
        const isFaizulAccount = data.email? data.email.includes('faizul')? true:false:false;
        if (!cancelledMember && isExpiredMember && !isTestAccount && !isFaizulAccount){
          users[user.id] = user.data();
        }
      });

      invoicesResults.forEach(invoice=>{
        // if(invoiceIdsToSend.includes(invoice.id)){
          const invoiceData = invoice.data();
          const userId = invoiceData && invoiceData.userId;
          const userData = users[userId];
          const amount = invoiceData && invoiceData.amount && parseInt(invoiceData.amount);
          var chargeAttempts = invoiceData.chargeAttempts || 0;
          const email = userData && userData.email;
          const promoJan2020 = userData && userData.promoJan2020;
          const quantity = invoiceData && invoiceData.quantity;
          var chargeAttemptsLimit = promoJan2020? ((chargeAttempts >= 1) ? true:false) : ((chargeAttempts >= 5)? true:false);
          const packageId = invoiceData && invoiceData.packageId;

          // test for monthly package only
          if (email && userData && invoiceData && !invoiceData.paid && invoiceData.createdAt){
            const hasRecurring = userData.hasRecurring;
            const name = userData.name;
            const date = moment(getTheDate(invoiceData.createdAt)).tz('Asia/Kuala_Lumpur').startOf('day').format('MMM YYYY');
            var emailPromise = null;
           //if charge failed more than 5 times, send email.
           if(hasRecurring && !(chargeAttemptsLimit) && (quantity && quantity===1)){
            recurringCount += 1;
            const billingDate = getTheDate(userData.autoMembershipEnds);
            if(billingDate && moment(billingDate).tz('Asia/Kuala_Lumpur').startOf('day').isSameOrBefore(moment().tz('Asia/Kuala_Lumpur'), 'day')){
              emailPromise = charge(invoice.id, userId, amount, email).then(results=>{//charge method  
                chargeCount += 1;
                console.log('Succesfully requested charge', invoice.id, userId, amount, email);
                recurringList.push({email, invoiceId:invoice.id, userId, amount, requestedForCharge:true});
                return admin.firestore().collection('invoices').doc(invoice.id).update({chargeAttempts:chargeAttempts+1, lastChargeAttempt:timestamp});
              }).catch((error)=>{
                chargeErrorCount += 1;
                console.log("Error charging", error, invoice.id, userId, amount, email);
                recurringList.push({email, invoiceId:invoice.id, userId, amount, requestedForCharge:false});
              });
              // console.log('userEmail: ', email);
            }
            else{ 
              console.log("Error with billing date", billingDate, invoice.id, userId, amount, email);
              emailList.push({charge:false, errorBillingDate:true, email});
            }
          }
          else{
            //deciding which email to send. 
            if ((!invoiceData.invoiceMailed || !invoiceData.invoiceMailedAt) && (promoJan2020)){
              sendMail+= 1;
              emailPromise = sendInvoiceJan2020Email(email, name, invoice.id, date).then(results=>{
                console.log('sendInvoiceJan2020EmailResult: ', results);
                invoiceMailList.push({email, name, invoice:invoice.id, date, sendInvoiceMail:true});
                return admin.firestore().collection('invoices').doc(invoice.id).update({invoiceMailed:true, invoiceMailedAt:timestamp});
              }).catch((error)=>{
                console.log('sendInvoiceEmailError: ', error);
                console.log('sendInvoiceEmailErrorEmail: ', email);
                sendMail-=1;
                invoiceMailList.push({email, sendInvoiceMail:false});
              });
            }
            else if((!invoiceData.invoiceMailed || !invoiceData.invoiceMailedAt) && (!promoJan2020)){
              sendMail+= 1;
              emailPromise = sendInvoiceEmail(email, name, invoice.id, date).then(results=>{
                console.log('sendInvoiceEmailResult: ', results);
                invoiceMailList.push({email, name, invoice:invoice.id, date, sendInvoiceMail:true});
                return admin.firestore().collection('invoices').doc(invoice.id).update({invoiceMailed:true, invoiceMailedAt:timestamp});
              }).catch((error)=>{
                console.log('sendInvoiceEmailError: ', error);
                console.log('sendInvoiceEmailErrorEmail: ', email);
                sendMail-=1;
                invoiceMailList.push({email, sendInvoiceMail:false});
              });
            }
            else if(invoiceData.invoiceMailed && (!invoiceData.dueMailed || !invoiceData.dueMailedAt)){
              const invoiceMailedAt = invoiceData.invoiceMailedAt;
              if (!invoiceMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(invoiceMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
              sendDueMail += 1;
                emailPromise = sendDueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                  invoiceDueMailList.push({email, name, invoice:invoice.id, date, sendDueInvoiceMail:true});
                  return admin.firestore().collection('invoices').doc(invoice.id).update({dueMailed:true, dueMailedAt:timestamp});
                }).catch((error)=>{
                  console.log('sendDueInvoiceEmailError: ', error);
                  invoiceDueMailList.push({email, name, invoice:invoice.id, date, sendDueInvoiceMail:false});
                  // return admin.firestore().collection('invoices').doc(invoice.id).update({dueMailedErrorMsg:error, errorAt:timestamp});
                });
              }
            }
            else if (invoiceData.invoiceMailed && invoiceData.dueMailed && (!invoiceData.overdueMailed || !invoiceData.overdueMailedAt)){
              const dueMailedAt = invoiceData.dueMailedAt;
              if (!dueMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(dueMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
              sendOverdueMail += 1;
                emailPromise = sendOverdueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                 invoiceOverDueMailList.push({email, name, invoice:invoice.id, date, sendOverDueInvoiceMail:true});
                  return admin.firestore().collection('invoices').doc(invoice.id).update({overdueMailed:true, overdueMailedAt:timestamp});
                }).catch((error)=>{
                  console.log('sendOverdueMailError: ', error);
                  invoiceOverDueMailList.push({email, name, invoice:invoice.id, date, sendOverDueInvoiceMail:false});
                  // return admin.firestore().collection('invoices').doc(invoice.id).update({overDueMailedErrorMsg:error, errorAt:timestamp});
                });
              }
            }
          }
          if(emailPromise){
            emailInvoicePromises.push(emailPromise);
          }
        }
      });

      return Promise.all(emailInvoicePromises).then(results=>{
        
        const theSuccesObject = {
          success: true,
          message: 'OK',
          sendMail,
          sendDueMail: sendDueMail,
          sendOverdueMail: sendOverdueMail,
          recurringCount,
          chargeCount,
          chargeErrorCount,
          createdAt: timestamp,
          recurringList,
          invoiceMailList,
          invoiceDueMailList,
          invoiceOverDueMailList,
        };
        admin.firestore().collection('chargeInvoiceLogs').add(theSuccesObject);
        return res.status(200).send(theSuccesObject);
      });
    });
  });

  exports.manualCharge = functions.https.onCall((data, context) => {

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const theDate = moment(timestamp).tz('Asia/Kuala_Lumpur').format('DDMMYYYY');
    const theTime = moment(timestamp).tz('Asia/Kuala_Lumpur').format('hh:mm:ss');

    const currentUserEmail = data.currentUserEmail;
    const currentUserName = data.currentUserName;
    const selectedAvatar = data.selectedAvatar;
    const selectedAngPowCover = data.selectedAngPowCover||null;
    const referralUserObj = data.referralUserObj;
    const referredToEmail = referralUserObj[0].email;
    const referredToName = referralUserObj[0].name;

    console.log('referralUserObj: ', referralUserObj);
    console.log('selectedAngPowCover: ',selectedAngPowCover);

    // Checking attribute.
    if (!(typeof currentUserEmail === 'string') || currentUserEmail.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
          'one arguments "text" containing the message text to add.');
    }

    referralUserObj && referralUserObj.forEach((referralUser)=>{
      console.log('referralUser: ',referralUser);
      // sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime);
    });

    return admin.firestore().collection('cnyReferralList').add({
      currentUserEmail, currentUserName, selectedAvatar, selectedAngPowCover, referralUserObj, theDate, theTime, referredToEmail, referredToName
    }).then(()=>{
      console.log('write to firestore');
      return {success:true}
    }).then(()=>{
      return {success:true}
    }).catch((error)=>{
      // Re-throwing the error as an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('unknown', error.message, error);
    });
    
  });

  exports.testCharge = functions.https.onRequest((req, res) => {
    return charge('DEKh9mKL6AVbj87Ns8Rc', 'I8imxoiVYadUWHP7p0a9QpkQWDQ2', 18000, 'feliciasee91@gmail.com').then(results=>{
      console.log('Succesfully requested charge');
      return res.status(200).send('OK');
    }).catch((error)=>{
      console.log('Error requesting charge', error);
      return res.status(200).send('OK');
    });
  });


  function charge(invoiceId, userId, amount, email){
    if(!invoiceId || !userId || !amount || amount <= 0 || !email){
      console.log('Error with charge data', invoiceId, userId, amount, email);
      return Promise.resolve();
    }

    console.log('Charging', invoiceId, userId, amount, email);

    var rp = require('request-promise');
    var options = { method: 'POST',
      uri: paymentPath + 'authorise',
      headers: {
          'content-type': 'application/json',
          'x-API-Key': APIKey,
      },
      body:{
        amount: {
          value: amount,
          currency: "MYR"
        },
        shopperEmail: email,
        shopperReference: userId,
        selectedRecurringDetailReference: "LATEST",
        recurring: {
          contract: "RECURRING"
        },
        shopperInteraction: "ContAuth",
        reference: invoiceId,
        merchantAccount: "BabelTestBFIT"
      },
      json:true
    };

    console.log('Request options', options);

    return rp(options);
  }

  // send email new year 2020
  // exports.sendNewYearEmail = functions.https.onRequest((req, res) => {
  //   // const usersQuery = admin.firestore().collection('users').where('email', '==', 'sakinaadam@gmail.com').get();
  //   const usersQuery = admin.firestore().collection('users').
  //   // where('paymentsUpdatedAt', '>=', moment('2019-11-21').toDate()).
  //   where('email', '==', 'jennming.w@babel.fit').
  //   get();
  
  //   var userCount = 0;

  //   return Promise.all([usersQuery]).then(results=>{
  //     // console.log('UQueryresults: ', results);
  //     const usersResults = results[0];
  //     var users = {};
  //     sendNewYearWishEmail('marketeers@babel.fit');
  //     // usersResults.forEach(user=>{
  //     //   users[user.id] = user.data();
  //     //   const email = user.get('email') || null;
  //     //   if (email){
  //     //     return sendNewYearWishEmail(email);
  //     //   }
  //     // });

  //     // console.log('theusers: ', users);

  //     // invoiceResults.forEach(invoice=>{
  //     //   // console.log('invoiceId: ', invoice.id);
  //     //   const invoiceData = invoice.data();
  //     //   const userId = invoiceData && invoiceData.userId;
  //     //   const userData = users[userId];
  //     //   const invoiceMailedAt = invoiceData && invoiceData.invoiceMailedAt;
  //     //   const isValidDate = moment(getTheDate(invoiceMailedAt)).isSameOrAfter(moment('2019-11-28'));
  
  //     //   if(userData && userData.email && invoiceData && invoiceData.createdAt && isValidDate){
  //     //     console.log('userDataEmail: ', userData.email);
  //     //     userCount = userCount + 1;

  //     //     // for sending receiptMail
  //     //     return sendReceiptEmail(userData.email, userData.name, invoiceData.totalPrice, invoice.id, moment(invoiceData.lastChargeAttempt.toDate()).format('DD MMM YYYY'));
  //     //     // for sending invoiceMail
  //     //     // return sendInvoiceEmail(userData.email, userData.name, invoice.id, moment(invoiceData.createdAt.toDate()).format('MMM YYYY'))
  //     //   }
  //     // });


  //     // usersResults.forEach(user=>{
  //     //   const email = user.get('email') || null;
  //     //   // const email = 'faizul.j@boontan.net';
  //     //   const name = user.get('name') || null;
  //     //   const totalPrice = '230';
  //     //   const invoiceId = 'b0gT1xlcGUfy2Kvnoy69';
  //     //   const date = '13 Nov 2019';
  //     //   const qty = 1;

  //     //   // for sending receiptMail
  //     //   return sendReceiptEmail(email, name, totalPrice, invoiceId, date, qty);

  //     // });

  //     //   // for sending invoiceMail
  //     //   // return sendInvoiceEmail(email, name, invoiceId, date);

  //     //   // var thePromise = null;
  //     //   // console.log('usertestParam: ', user.get('testParam'));
  //     //   // if (!user.get('testParam')){
  //     //   //   // console.log('addtestparam');
  //     //   //   // const userRef = admin.firestore().collection('users').doc(user.id);
  //     //   //   // batch.update(userRef, {testParam:'saya'});
  //     //   //   // batch.commit();
  //     //   //   return admin.firestore().collection('users').doc(user.id).update({testParam: "saya"});
  //     //   // }
  //     //   // return batch.commit();
  //     // });

  //     return res.status(200).send({
  //       success:true,
  //       data: 'data',
  //       // userCount
  //     });
  //   });
  // });

  exports.saveUserAvatar = functions.https.onCall((data, context) => {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const theDate = moment(timestamp).format('DDMMYYYY');
    const theTime = moment(timestamp).format('hh:mm:ss');
  
    const currentUserEmail = data.currentUserEmail;
    const currentUserName = data.currentUserName;
    const selectedAvatar = data.selectedAvatar;
  
    // Checking attribute.
    if (!(typeof currentUserEmail === 'string') || currentUserEmail.length === 0) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
          'one arguments "text" containing the message text to add.');
    }
  
    const usersQuery = admin.firestore().collection('users').where('email', '==', currentUserEmail).get().then(doc=>{
      const id = doc.id
      const data = doc.data();
      // console.log('theuserId: ', id);
      return admin.firestore().collection('users').doc(id).update({selectedAvatar}).then(()=>{
        console.log('update the user in firebase');
        return {success:true}
      }).catch((error)=>{
        // Re-throwing the error as an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('unknown', error.message, error);
      });
    });

    // return {success:true, finalRes:true};

  });

//   exports.cnyPromoRef = functions.https.onCall((data, context) => {
//     const timestamp = admin.firestore.FieldValue.serverTimestamp();
//     const theDate = moment(timestamp).tz('Asia/Kuala_Lumpur').format('DDMMYYYY');
//     const theTime = moment(timestamp).tz('Asia/Kuala_Lumpur').format('hh:mm:ss');

//     const currentUserEmail = data.currentUserEmail;
//     const currentUserName = data.currentUserName;
//     const selectedAvatar = data.selectedAvatar;
//     const selectedAngPowCover = data.selectedAngPowCover||null;
//     const referralUserObj = data.referralUserObj;
//     const referredToEmail = referralUserObj[0].email;
//     const referredToName = referralUserObj[0].name;

//     console.log('referralUserObj: ', referralUserObj);
//     console.log('selectedAngPowCover: ',selectedAngPowCover);

//     // Checking attribute.
//     if (!(typeof currentUserEmail === 'string') || currentUserEmail.length === 0) {
//       // Throwing an HttpsError so that the client gets the error details.
//       throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
//           'one arguments "text" containing the message text to add.');
//     }

//     referralUserObj && referralUserObj.forEach((referralUser)=>{
//       console.log('referralUser: ',referralUser);
//       // sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime);
//     });

//     return admin.firestore().collection('cnyReferralList').add({
//       currentUserEmail, currentUserName, selectedAvatar, selectedAngPowCover, referralUserObj, theDate, theTime, referredToEmail, referredToName
//     }).then(()=>{
//       console.log('write to firestore');
//       return {success:true}
//     }).then(()=>{
//       return {success:true}
//     }).catch((error)=>{
//       // Re-throwing the error as an HttpsError so that the client gets the error details.
//       throw new functions.https.HttpsError('unknown', error.message, error);
//     });
// });

exports.sendRefEmail = functions.https.onCall((data, context) => {
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const theDate = moment(timestamp).format('DDMMYYYY');
  const theTime = moment(timestamp).format('hh:mm:ss');

  const currentUserEmail = data.currentUserEmail;
  const currentUserName = data.currentUserName;
  const selectedAvatar = data.selectedAvatar;
  const referralUserObj = data.referralUserObj;

  console.log('referralUserObj: ', referralUserObj);

  // Checking attribute.
  if (!(typeof currentUserEmail === 'string') || currentUserEmail.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
        'one arguments "text" containing the message text to add.');
  }

  referralUserObj && referralUserObj.forEach((referralUser)=>{
    console.log('referralUser: ',referralUser);
    sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime);
  });

  return admin.firestore().collection('referralList').add({
    currentUserEmail, currentUserName, selectedAvatar, referralUserObj, theDate, theTime
  }).then(()=>{
    console.log('write to firestore');
    return {success:true}
  }).catch((error)=>{
     // Re-throwing the error as an HttpsError so that the client gets the error details.
     throw new functions.https.HttpsError('unknown', error.message, error);
  })
});

// to send referral email
exports.sendReferralEmail = functions.https.onCall((data, context) => {
  
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const theDate = moment(timestamp).format('DDMMYYYY');
  const theTime = moment(timestamp).format('hh:mm:ss');

  const currentUserEmail = data.currentUserEmail;
  const currentUserName = data.currentUserName;
  const selectedAvatar = data.selectedAvatar;
  const selectedAngPowCover = data.selectedAngPowCover||null;
  const referralUserObj = data.referralUserObj;

  console.log('referralUserObj: ', referralUserObj);
  console.log('selectedAngPowCover: ',selectedAngPowCover);

  // Checking attribute.
  if (!(typeof currentUserEmail === 'string') || currentUserEmail.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
        'one arguments "text" containing the message text to add.');
  }

  referralUserObj && referralUserObj.forEach((referralUser)=>{
    console.log('referralUser: ',referralUser);
    // sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime);
  });

  return admin.firestore().collection('referralList').add({
    currentUserEmail, currentUserName, selectedAvatar, selectedAngPowCover, referralUserObj, theDate, theTime
  }).then(()=>{
    console.log('write to firestore');
    return {success:true}
  }).catch((error)=>{
     // Re-throwing the error as an HttpsError so that the client gets the error details.
     throw new functions.https.HttpsError('unknown', error.message, error);
  });
  
  // console.log('sendReferralEmailData: ', data);

  // const timestamp = admin.firestore.FieldValue.serverTimestamp();
  // const theDate = moment(timestamp).format('DDMMYYYY');
  // const theTime = moment(timestamp).format('hh:mm:ss');

  // const currentUserEmail = data.currentUserEmail;
  // const currentUserName = data.currentUserName;
  // const selectedAvatar = data.selectedAvatar;
  // const referralUserObj = data.referralUserObj;

  // console.log('referralUserObj: ', referralUserObj);

  // if(!currentUserEmail || (!currentUserName) || !selectedAvatar || (!referralUserObj) || (referralUserObj.length === 0)){
  //   console.log('Missing data', currentUserEmail, currentUserName, selectedAvatar, referralUserObj);
  //   return Promise.resolve();
  // }
  
  // var emailPromise = null;
  // var emailReferralPromises = [];

  // referralUserObj && referralUserObj.forEach((referralUser)=>{
  //   console.log('referralUser: ',referralUser);
  //   // emailPromise = sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate).then(results=>{
  //   //   // todo: update the users if it is found
  //   //   return admin.firestore().collection('users').doc(invoice.id).update({invoiceMailed:true, invoiceMailedAt:timestamp});
      
  //   // });
  //   emailPromise = sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime).then(results=>{
  //     console.log('writing to firebase..', currentUserEmail, currentUserName, selectedAvatar, referralUser.email, referralUser.name, theDate, theTime);
  //     return admin.firestore().collection('referralList').add(
  //       {
  //         referredByEmail:currentUserEmail, 
  //         referredByName:currentUserName,
  //         referredByAvatar:selectedAvatar,
  //         referredToUserEmail:referralUser.email, 
  //         referredToUserName:referralUser.name,
  //         sentDate:theDate,
  //         sentTime:theTime
  //       }
  //     );
  //   }).catch(error=>{
  //     console.log('error writing to firestore: ', error);
  //     return Promise.resolve();
  //   });
  
  //   if(emailPromise){
  //     emailReferralPromises.push(emailPromise);
  //   }

  //   return Promise.all(emailReferralPromises).then(results=>{  
  //     const theSuccesObject = {
  //       success: true,
  //       message: 'OK',
  //       createdAt: timestamp,
  //     };
  //     // admin.firestore().collection('chargeInvoiceLogs').add(theSuccesObject);
  //     return results;
  //   });
  // });
});


  // to manually send the email
  exports.sendEmailManually = functions.https.onRequest((req, res) => {
    // const usersQuery = admin.firestore().collection('users').where('email', '==', 'sakinaadam@gmail.com').get();
    const usersQuery = admin.firestore().collection('users').
    // where('paymentsUpdatedAt', '>=', moment('2019-11-21').toDate()).
    where('email', '==', 'feliciasee91@gmail.com').
    get();

    const invoiceQuery = admin.firestore().collection('invoices').
    // where('paid', '==', false).where('type', '==', 'membership').
    // where('invoiceMailed', '==', true).
    // where('invoiceMailedAt', '>=', moment('2019-11-28').toDate()).
    // where('receiptMailed', '==', true).
    // where('lastChargeAttempt', '>=', moment('2019-11-15').toDate()).
    // where('quantity', '==', 1)
    get();
  
    var userCount = 0;

    return Promise.all([usersQuery, invoiceQuery]).then(results=>{
      // console.log('UQueryresults: ', results);
      const usersResults = results[0];
      const invoiceResults = results[1];
  
      // var batch = admin.firestore().batch();
  
      var users = {};
      // usersResults.forEach(user=>{
      //   users[user.id] = user.data();
      // });

      // console.log('theusers: ', users);

      // invoiceResults.forEach(invoice=>{
      //   // console.log('invoiceId: ', invoice.id);
      //   const invoiceData = invoice.data();
      //   const userId = invoiceData && invoiceData.userId;
      //   const userData = users[userId];
      //   const invoiceMailedAt = invoiceData && invoiceData.invoiceMailedAt;
      //   const isValidDate = moment(getTheDate(invoiceMailedAt)).isSameOrAfter(moment('2019-11-28'));
  
      //   if(userData && userData.email && invoiceData && invoiceData.createdAt && isValidDate){
      //     console.log('userDataEmail: ', userData.email);
      //     userCount = userCount + 1;

      //     // for sending receiptMail
      //     return sendReceiptEmail(userData.email, userData.name, invoiceData.totalPrice, invoice.id, moment(invoiceData.lastChargeAttempt.toDate()).format('DD MMM YYYY'));
      //     // for sending invoiceMail
      //     // return sendInvoiceEmail(userData.email, userData.name, invoice.id, moment(invoiceData.createdAt.toDate()).format('MMM YYYY'))
      //   }
      // });


      // usersResults.forEach(user=>{
      //   const email = user.get('email') || null;
      //   // const email = 'faizul.j@boontan.net';
      //   const name = user.get('name') || null;
      //   const totalPrice = '230';
      //   const invoiceId = 'b0gT1xlcGUfy2Kvnoy69';
      //   const date = '13 Nov 2019';
      //   const qty = 1;

      //   // for sending receiptMail
      //   return sendReceiptEmail(email, name, totalPrice, invoiceId, date, qty);

      // });

      //   // for sending invoiceMail
      //   // return sendInvoiceEmail(email, name, invoiceId, date);

      //   // var thePromise = null;
      //   // console.log('usertestParam: ', user.get('testParam'));
      //   // if (!user.get('testParam')){
      //   //   // console.log('addtestparam');
      //   //   // const userRef = admin.firestore().collection('users').doc(user.id);
      //   //   // batch.update(userRef, {testParam:'saya'});
      //   //   // batch.commit();
      //   //   return admin.firestore().collection('users').doc(user.id).update({testParam: "saya"});
      //   // }
      //   // return batch.commit();
      // });

      return res.status(200).send({
        success:true,
        data: 'data',
        // userCount
      });
    });
  });


// manually add promo2020 to user DB 
exports.addPromoUser2020 = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'syauqisafwan@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();

  const ThreeStepPkgIdAllClub = 'LNGWNSdm6kf4rz1ihj0i';
  const ThreeStepPkgIdSingle = 'k7As68CqGsFbKZh1Imo4';
  const threeMonthTermPkg = 'w12J3n9Qs6LTViI6HaEY';
  const threeTermMembershipPkg = 'aTHIgscCxbwjDD8flTi3';
  const threeMTermMembership = 'yQFACCzpS4DKcDyYftBx';

  const MonthlyPkgAllClub = 'TJ7Fiqgrt6EHUhR5Sb2q';
  const MonthlyPkgSingle = 'vf2jCUOEeDDiIQ0S42BJ';

  return Promise.all([usersQuery]).then(results=>{
    // console.log('UQueryresults: ', results);
    const usersResults = results[0];

    // var batch = admin.firestore().batch();

    usersResults.forEach(user=>{
      // var thePromise = null;
      // console.log('usertestParam: ', user.get('testParam'));
      const packageId = user.get('packageId')||null;
      const membershipStarts = user.get('autoMembershipStarts') ? user.get('autoMembershipStarts') : (user.get('membershipStarts')? user.get('membershipStarts'):null);
      const isPromoStartDate = membershipStarts && moment(getTheDate(membershipStarts)).isBetween(moment('20191231').tz('Asia/Kuala_Lumpur'), moment('20200203').tz('Asia/Kuala_Lumpur'));
      const totalPayments = user.get('totalPayments')||null;

      if (membershipStarts && isPromoStartDate && (packageId === ThreeStepPkgIdAllClub) || (packageId===ThreeStepPkgIdSingle) || (packageId===threeMonthTermPkg)||
      (packageId===threeTermMembershipPkg) || (packageId===threeMTermMembership)){
        // return admin.firestore().collection('users').doc(user.id).update({promoJan2020: 1});
        if (totalPayments === 660){
          return admin.firestore().collection('users').doc(user.id).update({promoJan2020: 3});
        }
      }
    });

    return res.status(200).send({
      success:true,
      data: 'data',
    });
  });
});

// script to change all payment db based from vendsales
// exports.addPromoUser2020 = functions.https.onRequest((req, res) => {
//   // const usersQuery = admin.firestore().collection('users').where('email', '==', 'syauqisafwan@gmail.com').get();
//   const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').where('source', '==', 'vend').get();
//   const vendSaleQuery = admin.firestore().collection('vendSales').get();

//   return Promise.all([paymentQuery, vendSaleQuery]).then(results=>{
//     // console.log('UQueryresults: ', results);
//     // const usersResults = results[0];
//     const paymentResult = results[0];
//     const vendSaleResult = results[1];

//     vendSaleResult && vendSaleResult.forEach(vendSale=>{

//     });

//     // var batch = admin.firestore().batch();

//     usersResults.forEach(user=>{
//       // var thePromise = null;
//       // console.log('usertestParam: ', user.get('testParam'));
//       const packageId = user.get('packageId')||null;
//       const membershipStarts = user.get('autoMembershipStarts') ? user.get('autoMembershipStarts') : (user.get('membershipStarts')? user.get('membershipStarts'):null);
//       const isPromoStartDate = membershipStarts && moment(getTheDate(membershipStarts)).isBetween(moment('20191231').tz('Asia/Kuala_Lumpur'), moment('20200203').tz('Asia/Kuala_Lumpur'));
//       const totalPayments = user.get('totalPayments')||null;

//       if (membershipStarts && isPromoStartDate && (packageId === ThreeStepPkgIdAllClub) || (packageId===ThreeStepPkgIdSingle) || (packageId===threeMonthTermPkg)||
//       (packageId===threeTermMembershipPkg) || (packageId===threeMTermMembership)){
//         // return admin.firestore().collection('users').doc(user.id).update({promoJan2020: 1});
//         if (totalPayments === 660){
//           return admin.firestore().collection('users').doc(user.id).update({promoJan2020: 3});
//         }
//       }
//     });

//     return res.status(200).send({
//       success:true,
//       data: 'data',
//     });
//   });
// });

  // to manually change the users so it will call the modifyUser & update the billingdate
// exports.sendTestModifyUser = functions.https.onRequest((req, res) => {
//   // const usersQuery = admin.firestore().collection('users').where('email', '==', 'sakinaadam@gmail.com').get();
//   const usersQuery = admin.firestore().collection('users').
//   where('hasRecurring', '==', true).
//   get();

//   return Promise.all([usersQuery]).then(results=>{
//     // console.log('UQueryresults: ', results);
//     const usersResults = results[0];

//     // var batch = admin.firestore().batch();

//     // usersResults.forEach(user=>{
//     //   // var thePromise = null;
//     //   // console.log('usertestParam: ', user.get('testParam'));
//     //   if (!user.get('testParam')){
//     //     // console.log('addtestparam');
//     //     // const userRef = admin.firestore().collection('users').doc(user.id);
//     //     // batch.update(userRef, {testParam:'saya'});
//     //     // batch.commit();
//     //     return admin.firestore().collection('users').doc(user.id).update({testParam: "saya"});
//     //   }
//     //   // return batch.commit();
//     // });
//     return res.status(200).send({
//       success:true,
//       data: 'data',
//     });
//   });
// });

// to del testParam in users
exports.sendDelModifyUser = functions.https.onRequest((req, res) => {
  const testParam = {saya:'test'};
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'frankleongfrankleong@gmail.com').get();

  const usersQuery = admin.firestore().collection('users').where('testParam', '==', 'saya').limit(200).get();

  return Promise.all([usersQuery]).then(results=>{
    const usersResults = results[0];
    usersResults.forEach(user=>{
        console.log('theUser: ', user);
       // var thePromise = null;
       return admin.firestore().collection('users').doc(user.id).update({testParam: admin.firestore.FieldValue.delete()});
    });

    return res.status(200).send({
      success:true,
      data: 'successfully deleted',
    });
  });
});

// delete all unpaid invoices
exports.sendDelUnpaidInvoices = functions.https.onRequest((req, res) => {
  // const testParam = {saya:'test'};
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'frankleongfrankleong@gmail.com').get();

  const invoiceQuery = admin.firestore().collection('invoices').
  where('paid', '==', false).where('type', '==', 'membership').
  // where('quantity', '==', 1).
  where('totalPrice', '==', '110').
  get();

  return Promise.all([invoiceQuery]).then(results=>{
    const invoicesResults = results[0];
    console.log('invoicesResults: ', invoicesResults);
   
    // var batch = admin.firestore().batch();

    invoicesResults.forEach(invoice=>{
      console.log('invoiceId: ', invoice.id);
      const invoiceData = invoice.data();
      // const userId = invoiceData && invoiceData.userId;
      // const userData = users[userId];

      // if(userData && userData.email && invoiceData && invoiceData.createdAt){
      //   console.log('userDataEmail: ', userData.email);
      // }
      // batch.delete(admin.firestore().collection('invoices').doc(invoice.id));
      // // batch.commit().then(function () {
      // //   // ...
      // //   console.log('thebatchDelete')
      // // });
      // batch.commit();
      // batch = admin.firestore().batch();
      // return admin.firestore().collection('users').doc(invoice.id).delete();
      // admin.firestore().collection('users').doc(invoice.id).delete();
      admin.firestore().collection('invoices').doc(invoice.id).delete();
    }) 

    return res.status(200).send({
      success:true,
      data: 'successfully deleted',
    });
  });

});

  exports.sendTestEmail = functions.https.onRequest((req, res) => {

    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const usersQuery = admin.firestore().collection('users').get();
    const invoicesQuery = admin.firestore().collection('invoices').where('type', '==', 'membership').get();

    return Promise.all([usersQuery, invoicesQuery]).then(results=>{
      const usersResults = results[0];
      const invoicesResults = results[1];

      var users = {};
      usersResults.forEach(user=>{
        users[user.id] = user.data();
      });

      var emailInvoicePromises = [];
      var sendMail = 0;
      var sendDueMail = 0;
      var sendOverdueMail = 0;
      invoicesResults.forEach(invoice=>{
        // if(invoiceIdsToSend.includes(invoice.id)){
          const invoiceData = invoice.data();
          const userId = invoiceData && invoiceData.userId;
          const userData = users[userId];
          if(userData && userData.email && invoiceData && !invoiceData.paid && invoiceData.createdAt){
            const email = userData.email;
            const name = userData.name;
            const date = moment(invoiceData.createdAt).format('MMM YYYY');
            var emailPromise = null;
            if(!invoiceData.invoiceMailed || !invoiceData.invoiceMailedAt){
              sendMail+= 1;
              emailPromise = sendInvoiceEmail(email, name, invoice.id, date).then(results=>{
                return admin.firestore().collection('invoices').doc(invoice.id).update({invoiceMailed:true, invoiceMailedAt:timestamp});
              });
            }else if(invoiceData.invoiceMailed && (!invoiceData.dueMailed || !invoiceData.dueMailedAt)){
              const invoiceMailedAt = invoiceData.invoiceMailedAt;
              if (!invoiceMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(invoiceMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
                sendDueMail += 1;
                emailPromise = sendDueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                  return admin.firestore().collection('invoices').doc(invoice.id).update({dueMailed:true, dueMailedAt:timestamp});
                });
              }
            }else if (invoiceData.invoiceMailed && invoiceData.dueMailed && (!invoiceData.overdueMailed || !invoiceData.overdueMailedAt)){
              const dueMailedAt = invoiceData.dueMailedAt;
              if (!dueMailedAt || moment().tz('Asia/Kuala_Lumpur').startOf('day').diff(moment(dueMailedAt).tz('Asia/Kuala_Lumpur').startOf('day'), 'days') >= 3) {
                sendOverdueMail += 1;
                emailPromise = sendOverdueInvoiceEmail(email, name, invoice.id, date).then(results=>{
                  return admin.firestore().collection('invoices').doc(invoice.id).update({overdueMailed:true, overdueMailedAt:timestamp});
                });
              }
            }

            if(emailPromise){
              emailInvoicePromises.push(emailPromise);
            }
          }
        // }
      });

      console.log('emails count', sendMail, sendDueMail, sendOverdueMail);
      // return res.status(200).send('OK');

      return Promise.all(emailInvoicePromises).then(results=>{
        return res.status(200).send('OK');
      });
    });
  });

  function sendNewYearWishEmail (email){
    console.log("sending new year 2020 mail", email);
    var data = {
      from: 'hello@babel.fit',
      subject: `[Babel -test] - HAPPY NEW YEAR 2020`,
      html: ` <tr>
              <td align="center" valign="top" id="m_-2782824453462011356bodyCell" style="height:100%;margin:0;padding:0;width:100%">
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                      <tbody><tr>
                          <td align="center" valign="top" id="m_-2782824453462011356templateHeader" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px">
                              
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-2782824453462011356templateContainer" style="border-collapse:collapse;max-width:600px!important">
                                  <tbody><tr>
                                      <td valign="top" class="m_-2782824453462011356headerContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px"></td>
                                  </tr>
                              </tbody></table>
                              
                          </td>
                      </tr>
                      <tr>
                          <td align="center" valign="top" id="m_-2782824453462011356templateBody" style="background:#ffffff url(&quot;https://ci3.googleusercontent.com/proxy/7hbXNb6DZlMBTx10hVwiFmlqQsvESYblw5IfJc1lp4EHRA-MFTGzohxuY6YssdNf1bpa3XR9885ZL4yRJhUpL43XKPvDAr4GPZ9s2o3t3Cx9tmbGUAwXMFCC1venQ2oN7vyOFtaJfFo_BBYn79OjuT_2QQT_AGxuFX1GC6QhFv4=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/_compresseds/35d5f0d4-3803-4085-9c4b-b37c39f8e00d.jpg&quot;) no-repeat center/cover;background-color:#ffffff;background-image:url(https://ci3.googleusercontent.com/proxy/7hbXNb6DZlMBTx10hVwiFmlqQsvESYblw5IfJc1lp4EHRA-MFTGzohxuY6YssdNf1bpa3XR9885ZL4yRJhUpL43XKPvDAr4GPZ9s2o3t3Cx9tmbGUAwXMFCC1venQ2oN7vyOFtaJfFo_BBYn79OjuT_2QQT_AGxuFX1GC6QhFv4=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/_compresseds/35d5f0d4-3803-4085-9c4b-b37c39f8e00d.jpg);background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:62px;padding-bottom:62px">
                              
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-2782824453462011356templateContainer" style="border-collapse:collapse;max-width:600px!important">
                                  <tbody><tr>
                                      <td valign="top" class="m_-2782824453462011356bodyContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
      <tr>
          <td valign="top" style="padding:0px">
              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
                  <tbody><tr>
                      <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0;text-align:center">


                                  <img align="center" alt="" src="https://ci3.googleusercontent.com/proxy/i5nxxUf9ukTE_iVtg9tvI_6WT5Xcr1kJlMrv7aC0Rq6uwlLXUlfGNgJBWJd8Qn4K-xjrz7OBTI2CZZQRKVQJp8E665JqkXp7XXyBIrfQ6ee_iYn5yYHkPhq6qnhpB1k2Oz3Nwt2BTAPhHe3VN_QwmsrI71RYgd7eGlM=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/beaee5ca-ddce-4d58-b8b9-6c567440452b.png" width="104.89" style="max-width:617px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="m_-2782824453462011356mcnRetinaImage CToWUd">


                      </td>
                  </tr>
              </tbody></table>
          </td>
      </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-2782824453462011356mcnDividerBlock" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important">
<tbody>
  <tr>
      <td style="min-width:100%;padding:18px 18px 30px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top:2px solid #ffffff;border-collapse:collapse">
              <tbody><tr>
                  <td>
                      <span></span>
                  </td>
              </tr>
          </tbody></table>

      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

                      <div style="text-align:center"><span style="color:#ffffff"><span style="font-size:23px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><strong id="m_-2782824453462011356docs-internal-guid-1f79deff-7fff-b55c-b01c-b0d332917475">Resolutions</strong><strong> on repeat every year?</strong></span></span></span></div>

                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">


                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
      <tr>
          <td valign="top" style="padding:0px">
              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
                  <tbody><tr>
                      <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0;text-align:center">


                                  <img align="center" alt="" src="https://ci5.googleusercontent.com/proxy/fObX7kauDdhYsLIG6uyN2eWcfDQB7C7kXxIA6uayWYCDT5jqrRhihShjx8fL5p9wTVVUaRF2CRVSR2svyPQgqW6ODUXkgR-COIZej3QUmQVdTNrsnJ5iMDZNf7RJsNwahHn9GdGHtVai8Cr5Z9HgHcI1MycqFvsvnek=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/97e996d1-161f-4dcc-b16a-9f4697d08382.gif" width="400" style="max-width:400px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="m_-2782824453462011356mcnImage CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 452px; top: 644px;"><div id=":17o" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>


                      </td>
                  </tr>
              </tbody></table>
          </td>
      </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:Helvetica;line-height:150%;text-align:left">

                      <div style="text-align:center">&nbsp;</div>

<div style="text-align:center">
<p dir="ltr" style="text-align:center;color:#807e7e;font-size:16px;margin:10px 0;padding:0;font-family:Helvetica;line-height:150%"><span style="color:#ffffff"><span style="font-size:17px"><strong id="m_-2782824453462011356docs-internal-guid-05e72b44-7fff-9bc9-a665-8759528bc56d">You’ve been here before. Even though everything's different - New Year, New Resolutions, New You... You still feel the same. Here are the 3 steps to finally achieve your resolution.</strong></span></span></p>

<div style="text-align:center">&nbsp;</div>

<p dir="ltr" style="text-align:center;color:#807e7e;font-size:16px;margin:10px 0;padding:0;font-family:Helvetica;line-height:150%"><span style="color:#ffffff"><span style="font-size:17px"><strong id="m_-2782824453462011356docs-internal-guid-05e72b44-7fff-9bc9-a665-8759528bc56d">Make this year different by taking steps to get to know yourself, develop what matters and master your goal. Get special rates on your first 3 months of membership, to gear up for the New Year!</strong></span></span></p>
</div>

                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

                      <br>
&nbsp;
                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
      <tr>
          <td valign="top" style="padding:9px">
              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
                  <tbody><tr>
                      <td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center">


                                  <img align="center" alt="" src="https://ci4.googleusercontent.com/proxy/bSoMy33m9oywSOVICkBraufZwuV-FzdwD-f_-2po9E7FjcL012b_cklGb04zb7UgrBhe_VXSGTbN03ZmDAkYeTkAwxIMOL6UhNcdjhDXN3nJtN0FNE97WoFpobij3-fWSxzWkgNokqyV6VF8l5aBcibEUdiUPIeNj84=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/eef642ed-8b0c-4769-8d92-b8a26c08c032.png" width="535.8" style="max-width:3780px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="m_-2782824453462011356mcnImage CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 520.094px; top: 1191px;"><div id=":17n" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>


                      </td>
                  </tr>
              </tbody></table>
          </td>
      </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:Helvetica;line-height:150%;text-align:left">

                      <div style="text-align:center">&nbsp;</div>

<div style="text-align:center">
<p dir="ltr" style="text-align:center;color:#807e7e;font-size:16px;margin:10px 0;padding:0;font-family:Helvetica;line-height:150%"><span style="color:#ffffff"><span style="font-size:17px"><strong id="m_-2782824453462011356docs-internal-guid-c5a1bb61-7fff-f70f-6348-44fc02d4bcae">Get 1 FREE PT for KLCC members or&nbsp;RM80 OFF membership fee (rebated from 3rd month payment)&nbsp;for TTDI members for your fourth month!&nbsp;&nbsp;</strong></span></span></p>

<div style="text-align:center">&nbsp;</div>

<p dir="ltr" style="text-align:center;color:#807e7e;font-size:16px;margin:10px 0;padding:0;font-family:Helvetica;line-height:150%"><span style="color:#ffffff"><span style="font-size:17px"><strong id="m_-2782824453462011356docs-internal-guid-c5a1bb61-7fff-f70f-6348-44fc02d4bcae">With Babel’s ‘3-Steps to Wellness’, it’s never been simpler to achieve your goal.</strong></span></span></p>
</div>

                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:Helvetica;line-height:150%;text-align:left">

                      <div style="text-align:center"><a href="https://www.babel.fit/3-step-wellness-programme" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.babel.fit/3-step-wellness-programme&amp;source=gmail&amp;ust=1578052891930000&amp;usg=AFQjCNGVE5GGpDjIjs4IE6Z78qJmHO-sCA">Find out more</a><br>
&nbsp;</div>

                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border-radius:4px;background-color:#ffffff">
              <tbody>
                  <tr>
                      <td align="center" valign="middle" style="font-family:&quot;Open Sans&quot;,&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size:16px;padding:18px">
                          <a class="m_-2782824453462011356mcnButton" title="REGISTER NOW" href="https://babelfit.typeform.com/to/hI0E7Y?fbclid=IwAR0p_eRRW8HzvspZgEuegouFNYxkrti4gEAtkNw9ETr8qvmNcNCZM8WRbuM" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#686868;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://babelfit.typeform.com/to/hI0E7Y?fbclid%3DIwAR0p_eRRW8HzvspZgEuegouFNYxkrti4gEAtkNw9ETr8qvmNcNCZM8WRbuM&amp;source=gmail&amp;ust=1578052891930000&amp;usg=AFQjCNEsiLFsi-Y207ZpDYufxAgajQL2Kw">REGISTER NOW</a>
                      </td>
                  </tr>
              </tbody>
          </table>
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:Helvetica;line-height:150%;text-align:left">


                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:Helvetica;line-height:150%;text-align:left">

                      <div style="text-align:center"><span style="color:#ffffff"><strong><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="font-size:20px">Contact Us</span></span></strong></span><br>
<br>
<span style="font-size:18px"><span style="color:#ffffff"><a href="tel:+60163193520" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank"><img height="16" src="https://ci5.googleusercontent.com/proxy/U7gdjFj8g_AcrUh05Fp7Jc5pPz5USKhQGOey74RiEm8KWfb41DnrqkY6rXDNf7apy_KsxvrRWBhGQxqS5bkmyQOgq6oRQ5Zls3LxL9gJNtSHxbmjsaKsdKggN9zNfksFvLcB3iIbDvVfvzrloXbWMO-N3z-tmQPQFPQ=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/e4e4d1f4-1b67-4ead-a3a8-d84d5b983182.png" style="border:0px;width:12px;height:16px;margin:0px;outline:none;text-decoration:none" width="12" class="CToWUd"></a>&nbsp;&nbsp;<strong><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">TTDI&nbsp; &nbsp;|&nbsp;&nbsp;+6016 319 3520&nbsp;&nbsp;<a href="https://api.whatsapp.com/send?phone=60163723520&amp;text=Hi!%20I%20want%20to%20join%20Babel%27s%203%20Step%20Wellness%20Program!" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://api.whatsapp.com/send?phone%3D60163723520%26text%3DHi!%2520I%2520want%2520to%2520join%2520Babel%2527s%25203%2520Step%2520Wellness%2520Program!&amp;source=gmail&amp;ust=1578052891930000&amp;usg=AFQjCNFAhEK7aZTmgE_jgpZbiUf8GrySmA"><img height="18" src="https://ci6.googleusercontent.com/proxy/VMz-d60Zx5YtMPgYgAomIxjTESw-RU_qvK6hx3pHwsrlCZfZLpC1lneR4w1CZQt5nEWtaLA8QA7BdCgJvQPigeBNux2idDvEyaUirL6e4dwvRMD75euiO15ba7U_1JrexeTh_En8fv321p9TlTaYTs0yPdo1tDdZfxY=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/7fb63099-b6d9-4843-a21c-0199e607cc06.png" style="border:0px;width:19px;height:18px;margin:0px;outline:none;text-decoration:none" width="19" class="CToWUd"></a></span></strong><br>
<a href="tel:+60163723520" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank"><img height="16" src="https://ci5.googleusercontent.com/proxy/U7gdjFj8g_AcrUh05Fp7Jc5pPz5USKhQGOey74RiEm8KWfb41DnrqkY6rXDNf7apy_KsxvrRWBhGQxqS5bkmyQOgq6oRQ5Zls3LxL9gJNtSHxbmjsaKsdKggN9zNfksFvLcB3iIbDvVfvzrloXbWMO-N3z-tmQPQFPQ=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/e4e4d1f4-1b67-4ead-a3a8-d84d5b983182.png" style="border:0px;width:12px;height:16px;margin:0px;outline:none;text-decoration:none" width="12" class="CToWUd"></a>&nbsp;&nbsp;</span><span style="color:#ffffff"><strong><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">KLCC&nbsp; |&nbsp;&nbsp;+6016 372 3520&nbsp;&nbsp;<a href="https://api.whatsapp.com/send?phone=60163723520&amp;text=Hi!%20I%20want%20to%20join%20Babel%27s%203%20Step%20Wellness%20Program!" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://api.whatsapp.com/send?phone%3D60163723520%26text%3DHi!%2520I%2520want%2520to%2520join%2520Babel%2527s%25203%2520Step%2520Wellness%2520Program!&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNEyNNtRYTj_Vw-uYHP7faK57WP7Og"><img height="18" src="https://ci6.googleusercontent.com/proxy/VMz-d60Zx5YtMPgYgAomIxjTESw-RU_qvK6hx3pHwsrlCZfZLpC1lneR4w1CZQt5nEWtaLA8QA7BdCgJvQPigeBNux2idDvEyaUirL6e4dwvRMD75euiO15ba7U_1JrexeTh_En8fv321p9TlTaYTs0yPdo1tDdZfxY=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/7fb63099-b6d9-4843-a21c-0199e607cc06.png" style="border:0px;width:19px;height:18px;margin:0px;outline:none;text-decoration:none" width="19" class="CToWUd"></a></span></strong></span></span></div>

                  </td>
              </tr>
          </tbody></table>
  

  
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td align="center" valign="top" style="padding:9px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody><tr>
  <td align="center" style="padding-left:9px;padding-right:9px">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
          <tbody><tr>
              <td align="center" valign="top" style="padding-top:9px;padding-right:9px;padding-left:9px">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                      <tbody><tr>
                          <td align="center" valign="top">
                              

                                  


                                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                          <tbody><tr>
                                              <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                      <tbody><tr>
                                                          <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                  <tbody><tr>

                                                                          <td align="center" valign="middle" width="24">
                                                                              <a href="http://www.facebook.com/babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.facebook.com/babel.fit&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNFF_e60wQjCEQRe380xoKbvZTxsSg"><img src="https://ci4.googleusercontent.com/proxy/wh1SzDj6ZyhwV3yJVEIMbK6Rx5tTRN-k1zQjgT7IEG7DuJeyBuawW5E5HScprC5P7U6oLOLyjQrSNoTyCJD8kjYxoqtLgrkt3jJBI7w5c2kZCvuKYGmoIQzbEsWDcSqR1P4xyEje=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-facebook-48.png" alt="Facebook" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                          </td>


                                                                  </tr>
                                                              </tbody></table>
                                                          </td>
                                                      </tr>
                                                  </tbody></table>
                                              </td>
                                          </tr>
                                      </tbody></table>

                                  

                                  


                                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                          <tbody><tr>
                                              <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                      <tbody><tr>
                                                          <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                  <tbody><tr>

                                                                          <td align="center" valign="middle" width="24">
                                                                              <a href="http://www.instagram.com/babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.instagram.com/babel.fit&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNGqR91Gq2EiNiAETZi1kKtjE6eyHg"><img src="https://ci4.googleusercontent.com/proxy/dyNd02SZEzITYE_TmIYXnWohAwkHeYI2wwzrCs_kOx448tmHpndVZ7GeLNU3cWUaRh9fESBSpyYtvY9jFmJWMittGX8zVrwhQWtC9mksdFJeJLRVH8z_VUOPn7EtoRRtU0LITElX4g=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-instagram-48.png" alt="Link" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                          </td>


                                                                  </tr>
                                                              </tbody></table>
                                                          </td>
                                                      </tr>
                                                  </tbody></table>
                                              </td>
                                          </tr>
                                      </tbody></table>

                                  

                                  


                                      <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                          <tbody><tr>
                                              <td valign="top" style="padding-right:0;padding-bottom:9px">
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                      <tbody><tr>
                                                          <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                              <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                  <tbody><tr>

                                                                          <td align="center" valign="middle" width="24">
                                                                              <a href="http://babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://babel.fit&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNEvDcXgCk_zvDUT6p_tTlOfpmKicg"><img src="https://ci3.googleusercontent.com/proxy/x0BpIQDIq_8f1ntOBLJUDjT5W7KH8IfjwbjjKuwmmPCLt2DEp_SwnLw5oeL0YdviUZuOJMHW_0U2JhpZqAXEkp3AkixMZLljpzUEue4u5MtFu10zLB_aQNTbrGBaiMJ3IZU=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-link-48.png" alt="Website" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                          </td>


                                                                  </tr>
                                                              </tbody></table>
                                                          </td>
                                                      </tr>
                                                  </tbody></table>
                                              </td>
                                          </tr>
                                      </tbody></table>

                                  

                              
                          </td>
                      </tr>
                  </tbody></table>
              </td>
          </tr>
      </tbody></table>
  </td>
</tr>
</tbody></table>

      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-2782824453462011356mcnDividerBlock" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important">
<tbody>
  <tr>
      <td style="min-width:100%;padding:18px 18px 30px">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top:2px solid #ffffff;border-collapse:collapse">
              <tbody><tr>
                  <td>
                      <span></span>
                  </td>
              </tr>
          </tbody></table>

      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding-top:9px">
          

  
          <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-2782824453462011356mcnTextContentContainer">
              <tbody><tr>

                  <td valign="top" class="m_-2782824453462011356mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

                      <div style="text-align:center"><span style="font-size:12px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3">Feel free to reach us at</span>&nbsp;<a href="mailto:hello@babel.fit" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank">hello@babel.fit</a>&nbsp;<br>
<br>
<span style="color:#d3d3d3"><strong>Location:</strong><br>
Babel TTDI<br>
Rooftop Menara Ken TTDI,<br>
Jalan Burhanuddin Helmi, KL, 60000</span></span><br>
<a href="tel:+60163193520" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank">+6016 319&nbsp;3520</a><br>
<br>
<span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3">Babel KLCC<br>
Lot C-G-02, Suria KLCC,<br>
Kuala Lumpur City Centre,<br>
50088 Kuala Lumpur, Wilayah Persekutuan</span></span><br>
<a href="tel:+60163723520" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank">+6016 372&nbsp;3520</a><br>
<br>
<span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3"><strong>Opening Hours:</strong><br>
Weekdays&nbsp;<br>
6.30 am - 11.00 pm<br>
Weekends &amp; Public Holidays<br>
7.00 am - 9.00 pm<br>
<br>
Want to change how you receive these emails?</span><br>
<span style="color:#d3d3d3">You can</span>&nbsp;<em><strong><a href="https://fit.us16.list-manage.com/profile?u=24e110fcf0a6c0b59d11b5b0b&amp;id=9e45f8413f&amp;e=" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fit.us16.list-manage.com/profile?u%3D24e110fcf0a6c0b59d11b5b0b%26id%3D9e45f8413f%26e%3D&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNFz6p4wr7FBEILTHmhfvtjq2UrmVQ">update your preferences</a></strong></em>&nbsp;<span style="color:#d3d3d3">or</span>&nbsp;<em><a href="https://fit.us16.list-manage.com/unsubscribe?u=24e110fcf0a6c0b59d11b5b0b&amp;id=9e45f8413f&amp;e=&amp;c=84107285a4" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fit.us16.list-manage.com/unsubscribe?u%3D24e110fcf0a6c0b59d11b5b0b%26id%3D9e45f8413f%26e%3D%26c%3D84107285a4&amp;source=gmail&amp;ust=1578052891931000&amp;usg=AFQjCNG_tQQwOGh_SXxgcupoJaWJiQQfsA">unsubscribe from this list</a>.</em></span></span></div>

                  </td>
              </tr>
          </tbody></table>
      </td>
  </tr>
</tbody>
</table></td>
                                  </tr>
                              </tbody></table>
                              
                          </td>
                      </tr>
                      <tr>
                          <td align="center" valign="top" id="m_-2782824453462011356templateFooter" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px">
                              
                              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-2782824453462011356templateContainer" style="border-collapse:collapse;max-width:600px!important">
                                  <tbody><tr>
                                      <td valign="top" class="m_-2782824453462011356footerContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"></td>
                                  </tr>
                              </tbody></table>
                              
                          </td>
                      </tr>
                  </tbody></table>
                  
              </td>
          </tr>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }
 
  function sendEmailReferral(currentUserEmail, currentUserName, selectedAvatar, referralUserEmail, referralUserName, date, time){
    console.log("sending referral email", currentUserEmail, currentUserName, selectedAvatar, referralUserEmail, referralUserName);
    currentUserEmail = currentUserEmail[0].toUpperCase() + currentUserEmail.slice(1);
    currentUserName = currentUserName.toUpperCase();
    referralUserEmail = referralUserEmail[0].toUpperCase() + referralUserEmail.slice(1);
    referralUserName = referralUserName[0].toUpperCase() + referralUserName.slice(1);
    // console.log('currentUserEmail: ', currentUserEmail);
    var data = {
      from: `hello@babel.fit`,
      subject: `${currentUserName} would like to workout with you at Babel!`,
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_-3756121099947607273bodyTable" style="border-collapse:collapse;height:100%;margin:0;padding:0;width:100%">
      <tbody><tr>
          <td align="center" valign="top" id="m_-3756121099947607273bodyCell" style="height:100%;margin:0;padding:0;width:100%">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                  <tbody><tr>
                      <td align="center" valign="top" id="m_-3756121099947607273templateHeader" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px">
                          
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-3756121099947607273templateContainer" style="border-collapse:collapse;max-width:600px!important">
                              <tbody><tr>
                                  <td valign="top" class="m_-3756121099947607273headerContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px"></td>
                              </tr>
                          </tbody></table>
                          
                      </td>
                  </tr>
                  <tr>
                      <td align="center" valign="top" id="m_-3756121099947607273templateBody" style="background-color:#4c4a48;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:50px;padding-bottom:50px">
                          
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-3756121099947607273templateContainer" style="border-collapse:collapse;max-width:600px!important">
                              <tbody><tr>
                                  <td valign="top" class="m_-3756121099947607273bodyContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
  <tr>
      <td valign="top" style="padding:0px">
          <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
              <tbody><tr>
                  <td valign="top" style="padding-right:0px;padding-left:0px;padding-top:0;padding-bottom:0;text-align:center">


                              <img align="center" alt="" src="https://ci3.googleusercontent.com/proxy/i5nxxUf9ukTE_iVtg9tvI_6WT5Xcr1kJlMrv7aC0Rq6uwlLXUlfGNgJBWJd8Qn4K-xjrz7OBTI2CZZQRKVQJp8E665JqkXp7XXyBIrfQ6ee_iYn5yYHkPhq6qnhpB1k2Oz3Nwt2BTAPhHe3VN_QwmsrI71RYgd7eGlM=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/beaee5ca-ddce-4d58-b8b9-6c567440452b.png" width="104.89" style="max-width:617px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="m_-3756121099947607273mcnRetinaImage CToWUd">


                  </td>
              </tr>
          </tbody></table>
      </td>
  </tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:150%;text-align:left">

                  <div style="text-align:center"><br>
<span style="font-size:25px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#ffffff">Let's Gym Together</span></span></span></div>

              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:150%;text-align:left">


              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-3756121099947607273mcnDividerBlock" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important">
<tbody>
<tr>
  <td style="min-width:100%;padding:18px 18px 30px">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top:2px solid #ffffff;border-collapse:collapse">
          <tbody><tr>
              <td>
                  <span></span>
              </td>
          </tr>
      </tbody></table>

  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:150%;text-align:left">


              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;line-height:150%;text-align:left">

                  <div style="text-align:left"><span style="color:#d3d3d3"><span style="font-size:18px">Hey ${referralUserName},</span></span><br>
&nbsp;</div>

<div style="text-align:center"><img height="300" src=${selectedAvatar} style="border:0px;width:300px;height:300px;margin:0px;outline:none;text-decoration:none" width="300" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 317px; top: 629px;"></div><div id=":nv" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div><br>
<div style="text-align:center"><span style="color:#ffffff;">${currentUserName}</span><br><span style="color:#ffffff;">${currentUserEmail}</span></div>

<div style="text-align:left">&nbsp;</div>

<div style="text-align:center"><br>
<span style="color:#d3d3d3">Flash my character when you sign up with Babel and we'll both</span> <br><span style="color:#ffffff;font-weight:bold;">get ONE Free Month worth RM660.&nbsp;</span><br>
<br>
Our Privileges: Unlimited Group Classes, Luxurious Amenities, World Class Equipment, Certified Professional Trainers, 3 Month Wellness Programme @ KLCC and so much more!&nbsp;</div>

<div style="text-align:left">&nbsp;</div>

<div style="text-align:center"><span style="color:#d3d3d3">Hurry! The offer is only valid on </span><br><span style="color:#ffffff;font-weight:bold;">16-19 January 2020.</span></div>

<div style="text-align:left"><br>
&nbsp;</div>

              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
      <table border="0" cellpadding="0" cellspacing="0" style="width:70%;border-collapse:separate!important;border-radius:4px;background-color:#c39c00">
          <tbody>
              <tr>
                  <td align="center" valign="middle" style="font-family:Arial;font-size:16px;padding:18px">
                      <a class="m_-3756121099947607273mcnButton" title="REFER NOW" href="http://app.babel.fit/referral?email=${referralUserEmail}&name=${referralUserName}" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank">REFER NOW</a>
                  </td>
              </tr>
          </tbody>
      </table>
  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;line-height:150%;text-align:left">

                  <div style="text-align:center"><span style="color:#d3d3d3">Refer now and get rewarded when you sign up later!<br>
                  </span></div>

              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      


      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding:0px 18px 9px;color:#807e7e;font-size:16px;word-break:break-word;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;line-height:150%;text-align:left">

                  <div style="text-align:center"><br>
<span style="font-size:16px"><span style="color:#ffffff"><font face="open sans, helvetica neue, helvetica, arial, sans-serif"><strong>Questions? Contact them below.&nbsp;</strong></font><br>
<a href="tel:+60163723520" style="color:#007c89;text-decoration:underline;font-weight:normal" target="_blank"><img height="16" src="https://ci5.googleusercontent.com/proxy/U7gdjFj8g_AcrUh05Fp7Jc5pPz5USKhQGOey74RiEm8KWfb41DnrqkY6rXDNf7apy_KsxvrRWBhGQxqS5bkmyQOgq6oRQ5Zls3LxL9gJNtSHxbmjsaKsdKggN9zNfksFvLcB3iIbDvVfvzrloXbWMO-N3z-tmQPQFPQ=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/e4e4d1f4-1b67-4ead-a3a8-d84d5b983182.png" style="border:0px initial;width:12px;height:16px;margin:0px;outline:none;text-decoration:none" width="12" class="CToWUd"></a>&nbsp;<strong><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">TTDI&nbsp; &nbsp;| +6016 319 3520&nbsp;<a href="https://api.whatsapp.com/send?phone=60163193520&amp;text=Hi!%20I%20want%20to%20know%20more%20about%20the%20referral%20rewards!" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://api.whatsapp.com/send?phone%3D60163193520%26text%3DHi!%2520I%2520want%2520to%2520know%2520more%2520about%2520the%2520referral%2520rewards!&amp;source=gmail&amp;ust=1579070203532000&amp;usg=AFQjCNFurH0A9lOwh54cbWqKpmLV-YSQAQ"><img height="18" src="https://ci6.googleusercontent.com/proxy/VMz-d60Zx5YtMPgYgAomIxjTESw-RU_qvK6hx3pHwsrlCZfZLpC1lneR4w1CZQt5nEWtaLA8QA7BdCgJvQPigeBNux2idDvEyaUirL6e4dwvRMD75euiO15ba7U_1JrexeTh_En8fv321p9TlTaYTs0yPdo1tDdZfxY=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/7fb63099-b6d9-4843-a21c-0199e607cc06.png" style="border:0px initial;width:19px;height:18px;margin:0px;outline:none;text-decoration:none" width="19" class="CToWUd"></a></span></strong></span><br>
<span style="color:#ffffff"><a href="tel:+60163723520" style="color:#007c89;text-decoration:underline;font-weight:normal" target="_blank"><img height="16" src="https://ci5.googleusercontent.com/proxy/U7gdjFj8g_AcrUh05Fp7Jc5pPz5USKhQGOey74RiEm8KWfb41DnrqkY6rXDNf7apy_KsxvrRWBhGQxqS5bkmyQOgq6oRQ5Zls3LxL9gJNtSHxbmjsaKsdKggN9zNfksFvLcB3iIbDvVfvzrloXbWMO-N3z-tmQPQFPQ=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/e4e4d1f4-1b67-4ead-a3a8-d84d5b983182.png" style="border:0px initial;width:12px;height:16px;margin:0px;outline:none;text-decoration:none" width="12" class="CToWUd"></a>&nbsp;<strong><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">KLCC&nbsp; |&nbsp;+6016 372 3520&nbsp;<a href="https://api.whatsapp.com/send?phone=60163193520&amp;text=Hi!%20I%20want%20to%20know%20more%20about%20the%20referral%20rewards!" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://api.whatsapp.com/send?phone%3D60163193520%26text%3DHi!%2520I%2520want%2520to%2520know%2520more%2520about%2520the%2520referral%2520rewards!&amp;source=gmail&amp;ust=1579070203533000&amp;usg=AFQjCNHLKF7gfzbstTrKX--zenP87Kk8mQ"><img height="18" src="https://ci6.googleusercontent.com/proxy/VMz-d60Zx5YtMPgYgAomIxjTESw-RU_qvK6hx3pHwsrlCZfZLpC1lneR4w1CZQt5nEWtaLA8QA7BdCgJvQPigeBNux2idDvEyaUirL6e4dwvRMD75euiO15ba7U_1JrexeTh_En8fv321p9TlTaYTs0yPdo1tDdZfxY=s0-d-e1-ft#https://gallery.mailchimp.com/24e110fcf0a6c0b59d11b5b0b/images/7fb63099-b6d9-4843-a21c-0199e607cc06.png" style="border:0px initial;width:19px;height:18px;margin:0px;outline:none;text-decoration:none" width="19" class="CToWUd"></a></span></strong></span></span></div>

              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td align="center" valign="top" style="padding:9px">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody><tr>
<td align="center" style="padding-left:9px;padding-right:9px">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
      <tbody><tr>
          <td align="center" valign="top" style="padding-top:9px;padding-right:9px;padding-left:9px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                  <tbody><tr>
                      <td align="center" valign="top">
                          

                              


                                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                      <tbody><tr>
                                          <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                  <tbody><tr>
                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                          <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                              <tbody><tr>

                                                                      <td align="center" valign="middle" width="24">
                                                                          <a href="http://www.facebook.com/babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.facebook.com/babel.fit&amp;source=gmail&amp;ust=1579070203533000&amp;usg=AFQjCNFPuXwZWRLnT-aY7LF77VLa1d6sLQ"><img src="https://ci4.googleusercontent.com/proxy/wh1SzDj6ZyhwV3yJVEIMbK6Rx5tTRN-k1zQjgT7IEG7DuJeyBuawW5E5HScprC5P7U6oLOLyjQrSNoTyCJD8kjYxoqtLgrkt3jJBI7w5c2kZCvuKYGmoIQzbEsWDcSqR1P4xyEje=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-facebook-48.png" alt="Facebook" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                      </td>


                                                              </tr>
                                                          </tbody></table>
                                                      </td>
                                                  </tr>
                                              </tbody></table>
                                          </td>
                                      </tr>
                                  </tbody></table>

                              

                              


                                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                      <tbody><tr>
                                          <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                  <tbody><tr>
                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                          <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                              <tbody><tr>

                                                                      <td align="center" valign="middle" width="24">
                                                                          <a href="http://www.instagram.com/babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.instagram.com/babel.fit&amp;source=gmail&amp;ust=1579070203533000&amp;usg=AFQjCNE8_Rr1XgM6cYpjwMe9odg_3e3GqA"><img src="https://ci4.googleusercontent.com/proxy/dyNd02SZEzITYE_TmIYXnWohAwkHeYI2wwzrCs_kOx448tmHpndVZ7GeLNU3cWUaRh9fESBSpyYtvY9jFmJWMittGX8zVrwhQWtC9mksdFJeJLRVH8z_VUOPn7EtoRRtU0LITElX4g=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-instagram-48.png" alt="Link" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                      </td>


                                                              </tr>
                                                          </tbody></table>
                                                      </td>
                                                  </tr>
                                              </tbody></table>
                                          </td>
                                      </tr>
                                  </tbody></table>

                              

                              


                                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                      <tbody><tr>
                                          <td valign="top" style="padding-right:0;padding-bottom:9px">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                  <tbody><tr>
                                                      <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                          <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                              <tbody><tr>

                                                                      <td align="center" valign="middle" width="24">
                                                                          <a href="http://babel.fit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://babel.fit&amp;source=gmail&amp;ust=1579070203534000&amp;usg=AFQjCNEDDLjBy23h3FyckBXtg9JD5Z0v3w"><img src="https://ci3.googleusercontent.com/proxy/x0BpIQDIq_8f1ntOBLJUDjT5W7KH8IfjwbjjKuwmmPCLt2DEp_SwnLw5oeL0YdviUZuOJMHW_0U2JhpZqAXEkp3AkixMZLljpzUEue4u5MtFu10zLB_aQNTbrGBaiMJ3IZU=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-gray-link-48.png" alt="Website" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                      </td>


                                                              </tr>
                                                          </tbody></table>
                                                      </td>
                                                  </tr>
                                              </tbody></table>
                                          </td>
                                      </tr>
                                  </tbody></table>

                              

                          
                      </td>
                  </tr>
              </tbody></table>
          </td>
      </tr>
  </tbody></table>
</td>
</tr>
</tbody></table>

  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-3756121099947607273mcnDividerBlock" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important">
<tbody>
<tr>
  <td style="min-width:100%;padding:18px 18px 30px">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-top:2px solid #ffffff;border-collapse:collapse">
          <tbody><tr>
              <td>
                  <span></span>
              </td>
          </tr>
      </tbody></table>

  </td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
  <td valign="top" style="padding-top:9px">
      <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%" class="m_-3756121099947607273mcnTextContentContainer">
          <tbody><tr>

              <td valign="top" class="m_-3756121099947607273mcnTextContent" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:150%;text-align:left">

                  <div style="text-align:center"><span style="font-size:12px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3">Feel free to reach us at</span>&nbsp;<a href="mailto:hello@babel.fit" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank">hello@babel.fit</a>&nbsp;<br>
<br>
<span style="color:#d3d3d3"><strong>Location:</strong><br>
Babel TTDI<br>
Rooftop Menara Ken TTDI,<br>
Jalan Burhanuddin Helmi, KL, 60000</span></span><br>
<a href="tel:+60163193520" style="color:#007c89;text-decoration:underline;font-weight:normal" target="_blank">+6016 319&nbsp;3520</a><br>
<br>
<span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3">Babel KLCC<br>
Lot C-G-02, Suria KLCC,<br>
Kuala Lumpur City Centre,<br>
50088 Kuala Lumpur, Wilayah Persekutuan</span></span><br>
<a href="tel:+60163723520" style="color:#007c89;text-decoration:underline;font-weight:normal" target="_blank">+6016 372&nbsp;3520</a><br>
<br>
<span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"><span style="color:#d3d3d3"><strong>Opening Hours:</strong><br>
Weekdays&nbsp;<br>
6.30 am - 11.00 pm<br>
Weekends &amp; Public Holidays<br>
7.00 am - 9.00 pm<br>
<br>
Want to change how you receive these emails?</span><br>
<span style="color:#d3d3d3">You can</span>&nbsp;<em><strong><a href="https://fit.us16.list-manage.com/profile?u=24e110fcf0a6c0b59d11b5b0b&amp;id=9e45f8413f&amp;e=" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fit.us16.list-manage.com/profile?u%3D24e110fcf0a6c0b59d11b5b0b%26id%3D9e45f8413f%26e%3D&amp;source=gmail&amp;ust=1579070203534000&amp;usg=AFQjCNHoIwQ0jG3kwVELrsnWWBhQf52e2Q">update your preferences</a></strong></em>&nbsp;<span style="color:#d3d3d3">or</span>&nbsp;<em><a href="https://fit.us16.list-manage.com/unsubscribe?u=24e110fcf0a6c0b59d11b5b0b&amp;id=9e45f8413f&amp;e=&amp;c=84107285a4" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://fit.us16.list-manage.com/unsubscribe?u%3D24e110fcf0a6c0b59d11b5b0b%26id%3D9e45f8413f%26e%3D%26c%3D84107285a4&amp;source=gmail&amp;ust=1579070203534000&amp;usg=AFQjCNEn2nkhB6f0UVZ1YNc5QeRvxKrLyw">unsubscribe from this list</a>.</em></span></span></div>

              </td>
          </tr>
      </tbody></table>



  </td>
</tr>
</tbody>
</table></td>
                              </tr>
                          </tbody></table>
                          
                      </td>
                  </tr>
                  <tr>
                      <td align="center" valign="top" id="m_-3756121099947607273templateFooter" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0px;padding-bottom:0px">
                          
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="m_-3756121099947607273templateContainer" style="border-collapse:collapse;max-width:600px!important">
                              <tbody><tr>
                                  <td valign="top" class="m_-3756121099947607273footerContainer" style="background:#transparent none no-repeat center/cover;background-color:#transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"></td>
                              </tr>
                          </tbody></table>
                          
                      </td>
                  </tr>
              </tbody></table>
              
          </td>
      </tr>
  </tbody></table>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      // to: `faizulhadijamil@gmail.com`,
      to: `${referralUserEmail}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }
    console.log('theData: ', data);
    return sendEmail(data);
  }

  function sendUpdatedPackageEmail(email, name, currentPackageName, updatedPackageName, date){
    console.log("sending updated package", email, name, currentPackageName, updatedPackageName);
    var data = {
      from: 'billing@babel.fit',
      subject: `[Babel] - ${date}: package changes`,
      html: `<p>Dear ${name},</p>
            <p>Your membership package is now automatically converted</p>
            <p>Previous package: ${currentPackageName}</p>
            <p>Current package: ${updatedPackageName}</p>
            <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
            <p>Thanks for being a Babel member!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      // to: `faizulhadijamil@gmail.com`,
      to: `${email}`,
      bcc: `faizul.j@boontan.net`,
      cc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  function sendInvoiceEmail(email, name, invoiceId, date){
    console.log("sending invoice mail", email, name, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: `[Babel] - ${date}: You have a new invoice`,
      html: `<p>Dear ${name},</p>
            <p>Your invoice is now ready. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
            <p>Please ignore this message if you have paid</p>
            <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
            <p>Thanks for being a Babel member!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      // to: `faizulhadijamil@gmail.com`,
      to: `${email}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  // if the charging is failed, send the invoice link to the user
  function sendInvoiceJan2020Email(email, name, invoiceId, date){
    console.log("sending jan2020 invoice mail", email, name, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: `[Babel] - ${date}: You have a new invoice`,
      html: `<p>Dear ${name},</p>
            <p>We hope you’re doing well and enjoying Babel! There’s seems to be an issue with the auto debit process on the credit card regarding your monthly payments. </p>
            <p>We would greatly appreciate it if you would kindly visit this link to make payment. </p>
            <p>Your invoice is now ready. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
            <p>Please ignore this message if you have paid</p>
            <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
            <p>Thanks for being a Babel member!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      // to: `faizulhadijamil@gmail.com`,
      to: `${email}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  function sendDueInvoiceEmail(email, name, invoiceId, date){
    console.log("sending due invoice mail", email, name, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: `[Babel] - ${date}: Your invoice is now due`,
      html: `<p>Dear ${name},</p>
            <p>Your invoice is now due. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
            <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
            <p>Thanks for being a Babel member!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      to: `${email}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
    // return null;
  }

  function sendOverdueInvoiceEmail(email, name, invoiceId, date){
    console.log("sending overdue invoice mail", email, name, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: `URGENT [Babel] - ${date}: Your invoice is overdue`,
      html: `<p>Dear ${name},</p>
            <p>Your invoice is now overdue. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
            <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
            <p>Thanks for being a Babel member!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      // to: `sharasandravel@gmail.com`,
      to: `${email}`,
      // bcc: `faizul.j@boontan.net`
      bcc: `ops@babel.fit`
    }

    return sendEmail(data);
  }

  function sendReceiptEmail(email, name, amount, invoiceId, date){
    console.log("sending receipt mail", email, name, amount, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: 'We have received your payment',
      html: `<p>Dear ${name},</p>
            <p>We have received your payment for ${date}.</p>
            <p>Invoice No: ${invoiceId} <br/>
            Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
            <p>Thank you very much and see you soon!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email}`,
      // to: 'faizul.j@boontan.net',
      cc: `ops@babel.fit`,
      bcc: `faizul.j@boontan.net`
    }
    return sendEmail(data);
  }

  // for dance class
  function sendDanceReceiptEmail(email, name, amount, invoiceId, date, ighandlename, city, classDate, classTime, instructorName, danceClassRemark, phoneNum){
    console.log("sending receipt mail", email, name, amount, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: 'We have received your payment',
      html: `<p>Dear ${name},</p>
            <p>We have received your payment for Babel Dance’s ${danceClassRemark} on ${date} Thank you!
            <p>Invoice No: ${invoiceId} <br/>
            Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
            <p>Do note that virtual dance pass is NOT transferable &amp; NOT refundable.</p>
            <p>If you purchased a Virtual Dance Pass, the Zoom link will be emailed to you 12 hours before
            the class.</p>
            <p>Refunds are only allowed for Outdoor Dance Pass in the event that Babel Dance cancels due
            to unforeseen circumstances.</p>
            <p>If you purchased an outdoor dance pass, directions to the venue will be emailed to you 48
            hours before the class.</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>

            <p>Instructor Name: ${instructorName}<br/>
            Class Name: ${danceClassRemark}<br/>
            Class date: ${classDate}<br/>
            Class time: ${classTime}</p>
            <p>Participant’s IG Account: ${ighandlename}<br/>
            Participants Contact Number: ${phoneNum}<br/>
            </p>

            <p>Thank you for being part of our community. Looking forward to dance with you!</p>
            <p>Peace and love,</p>
            <p>Team Babel Dance</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email}`,
      // to: 'faizul.j@boontan.net',
      cc: `holla@babel.dance`,
      bcc: `ops@babel.fit, faizul.j@boontan.net`,
    }
    return sendEmail(data);
  }

  // for unlimited outdoor class
  function sendCutomReceiptEmail(email, name, amount, invoiceId, date){
    console.log("sending receipt mail", email, name, amount, invoiceId);
    var data = {
      from: 'billing@babel.fit',
      subject: 'We have received your payment',
      html: `<p>Dear ${name},</p>
            <p>We have received your payment for Unlimited Outdoor Class.</p>
            <p>Invoice No: ${invoiceId} <br/>
            Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
            <p>Thank you very much and see you soon!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email}`,
      // to: 'faizul.j@boontan.net',
      cc: `faizul.j@boontan.net, billy.w@babel.fit, david.p@babel.fit, kish@babel.fit, lychee.l@babel.fit, tony.r@babel.fit`,
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  //for virtual class
  function sendReceiptEmailForVirtualClass(email, name, totalPrice, invoiceId, date, city, ighandlename, phoneNum, selectedMemberOption){
    console.log("sending virtual class receipt mail", email, name, invoiceId);

    var data = {
      from: 'billing@babel.fit',
      subject: 'Thank you for purchasing the BABEL LIVE access!',
      html: `<p>Dear ${name},</p>
            <p>We received your payment for the BABEL LIVE access on ${date}</p>
            <p>Invoice No: ${invoiceId} <br/>
            Total Amount: RM${parseFloat(totalPrice).toFixed(2)}</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
            <p>Don't forget to send in a request to follow us on our private BABEL LIVE Instagram account @babel.live for access. We will accept your requests upon confirmation. </p>
            <p>Thank you, we're excited to see you in 'class' soon! 😎</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email},`,
      // to: 'faizul.j@boontan.net',
      cc: `faizul.j@boontan.net, billy.w@babel.fit, `,
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  // for Virtual online wellness
  function sendVirtualWelnessEmail(email, name, amount, invoiceId, date, selectedAMPM, selectedDay, trainerName, coachName, phone, ighandleName){
    console.log("sending receipt mail", email, name, amount, invoiceId);
    const preferredAM = selectedAMPM.AM? 'yes':'no';
    const preferredPM = selectedAMPM.PM? 'yes':'no';
    var dayArray = [];
    // console.log('selectedDay: ', selectedDay);
    dayArray.push(selectedDay.mon? 'Monday':null, selectedDay.tues? 'Tuesday':null, selectedDay.wed? 'Wednesday':null,
    selectedDay.thurs? 'Thursday':null, selectedDay.fri? 'Friday':null, selectedDay.sat? 'Saturday':null, selectedDay.sun? 'Sunday':null);
    dayArray = dayArray.filter(Boolean); // to remove all null value
    console.log('dayArray: ', dayArray);

    var data = {
      from: 'billing@babel.fit',
      subject: `We received your payment for the 'Babel at Home' programme`,
      html: `<p>Dear ${name},</p>
            <p>We received your payment for the 'Babel at Home' programme on ${date}</p>
            <p>Invoice No: ${invoiceId}</p>
            Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
            <p>Trainer Name: ${trainerName}</p>
            <p>Nutrition Coach Name: ${coachName}</p>
            <p>Member IG Account: ${ighandleName}</p>
            <p>Preferred AM Time: ${preferredAM}</p>
            <p>Preferred PM Time: ${preferredPM}</p>
            <p>Preferred Days: ${dayArray}</p>
            <p>Preferred Contact Number: ${phone}</p>
            <p>Don't forget to send in a request to follow us on our private BABEL LIVE Instagram account @babel.live for access. We will accept your requests upon confirmation. </p>
            <p>Your coach will be in touch, so let's get started on turning those goals into results. 😎 Also, see you in 'class' on @babel.live soon!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email},`,
      // to: 'faizul.j@boontan.net',
      cc: `faizul.j@boontan.net, billy.w@babel.fit, maybelline.w@boontan.net`,
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  // for Virtual Trainer
  function sendVirtualTrainerEmail(email, name, amount, invoiceId, date, selectedAMPM, selectedDay, trainerName, phone, isKLCC){
    console.log("sending receipt mail", email, name, amount, invoiceId);
    const preferredAM = selectedAMPM.AM? 'yes':'no';
    const preferredPM = selectedAMPM.PM? 'yes':'no';
    var dayArray = [];
    console.log('selectedDay: ', selectedDay);
    const preferredMon = selectedDay.mon? 'Monday':null;
    const preferredTues = selectedDay.tues? 'Tuesday':null;
    const preferredWed = selectedDay.wed? 'Wednesday':null;
    const preferredThurs = selectedDay.thurs? 'Thursday':null;
    const preferredFri = selectedDay.fri? 'Friday':null;
    const preferredSat = selectedDay.sat? 'Saturday':null;
    const preferredSun = selectedDay.sun? 'Sunday':null;
    dayArray.push(selectedDay.mon? 'Monday':null, selectedDay.tues? 'Tuesday':null, selectedDay.wed? 'Wednesday':null,
    selectedDay.thurs? 'Thursday':null, selectedDay.fri? 'Friday':null, selectedDay.sat? 'Saturday':null, selectedDay.sun? 'Sunday':null);
    dayArray = dayArray.filter(Boolean); // to remove all null value
    console.log('dayArray: ', dayArray);

    var data = {
      from: 'billing@babel.fit',
      subject: 'We have recieved your payment for VPT',
      html: `<p>Dear ${name},</p>
            <p>We have recieved your payment for VPT</p>
            Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
            <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
            <p>Trainer Name: ${trainerName}</p>
            <p>Preferred AM Time: ${preferredAM}</p>
            <p>Preferred PM Time: ${preferredPM}</p>
            <p>Preferred Days: ${dayArray}</p>
            <p>Preferred Contact Number: ${phone}</p>
            <p>Thank you for your payment, your Virtual Personal Trainer will be in touch shortly.</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email},`,
      // to: 'faizul.j@boontan.net',
      cc: `faizul.j@boontan.net, billy.w@babel.fit, david.p@babel.fit, kish@babel.fit`,
      bcc: `ops@babel.fit`
    }
    if (isKLCC){
      data = {
        from: 'billing@babel.fit',
        subject: 'We have recieved your payment for VPT',
        html: `<p>Dear ${name},</p>
              <p>We have recieved your payment for VPT</p>
              <p>Invoice No: ${invoiceId} <br/>
              Total Amount: RM${parseFloat(amount).toFixed(2)}</p>
              <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
              <p>Trainer Name: ${trainerName}</p>
              <p>Preferred AM Time: ${preferredAM}</p>
              <p>Preferred PM Time: ${preferredPM}</p>
              <p>Preferred Days: ${dayArray}</p>
              <p>Preferred Contact Number: ${phone}</p>
              <p>Thank you for your payment, your Virtual Personal Trainer will be in touch shortly.</p>
              <p>-Babel Team</p>`,
        'h:Reply-To': 'support@babel.fit',
        to: `${email},`,
        // to: 'faizul.j@boontan.net',
        cc: `faizul.j@boontan.net, billy.w@babel.fit, lychee.l@babel.fit, tony.r@babel.fit`,
        bcc: `ops@babel.fit`
      }
    }
    return sendEmail(data);
  }

  function sendTerminationEmail(email, name, date){
    console.log("sending termination mail", email, name, date);
    var data = {
      from: 'billing@babel.fit',
      subject: 'Member Auto Termination',
      html: `<p>Dear ${name},</p>
            <p>Hope you're well! We noticed that you haven't been active for more than 3 months, and unfortunately we will have to proceed with terminating your Babel gym membership.</p>
            <p>We would greatly appreciate it if you would kindly share some feedback with us so that we can continue to improve on our services via this link below:</p>
            <p>https://babelfit.typeform.com/to/FqgjPD</p>
            <p>We will proceed with your membership termination effective ${date}.</p>
            <p>Thank you for allowing us to be part of your fitness journey and we hope that we can serve you in the near future.</p>
            <p>Stay healthy always!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `${email}`,
      // to: 'faizul.j@boontan.net',
      bcc: `ops@babel.fit`
    }
    return sendEmail(data);
  }

  function sendManualFromAcuityEmail(acuityData){
    console.log("sending aquity mail");
    var data = {
      from: 'billing@babel.fit',
      subject: 'Member Booking Directly from the acuity',
      html: `<p>Member ${acuityData.email} has booked Directly from the acuity at ${acuityData.dateCreated} by ${acuityData.scheduledBy}</p>
            <p>Stay healthy always!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `faizul.j@boontan.net`,
      // to: 'faizul.j@boontan.net',
      cc: `boon@boontan.net, billy.w@babel.fit`
      // bcc: `ops@babel.fit`,
    }
    return sendEmail(data);
  }

  function sendWarningVendEmail(date, saleCountFromFirebase, saleCountFromVend){
    console.log("sending warning email");
    var data = {
      from: 'billing@babel.fit',
      subject: 'vend sales number',
      html: `<p> Date: ${date} </p>
            <p> Sale Count from Firebase : ${saleCountFromFirebase} </p>
            <p> Sale Count from Vend : ${saleCountFromVend} </p>
            <p>Stay healthy always!</p>
            <p>-Babel Team</p>`,
      'h:Reply-To': 'support@babel.fit',
      to: `faizul.j@boontan.net`,
      // to: 'faizul.j@boontan.net',
      cc: `boon@boontan.net, jeshua@boontan.net, billy.w@boontan.net`
      // bcc: `ops@babel.fit`,
    }
    return sendEmail(data);
  }

  // function sendInvoiceEmail(email, name, invoiceId, date){
  //   console.log("sending invoice mail", email, name, invoiceId);
  //   var data = {
  //     from: 'billing@babel.fit',
  //     subject: `[Babel] - ${date}: You have a new invoice`,
  //     html: `<p>Dear ${name},</p>
  //       <p>We're sorry! 😞 We regret to inform you that we have been experiencing technical difficulties with our automated system for past few weeks, which is why you are receiving this delayed invoice. 
  //       Please be rest assured that we're working hard to resolve this issue. 
  //       Thank you for being patient with us, we look forward to serving you better</p>
  //       <p>Your invoice is now ready. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
  //       <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
  //       <p>Thanks for being a Babel member!</p>
  //       <p>Babel Team</p>`,
  //     'h:Reply-To': 'support@babel.fit',
  //     // to: `sharasandravel@gmail.com`,
  //     to: `${email}`,
  //     // to: `faizul.j@boontan.net`,
  //     // bcc: `faizul.j@boontan.net`
  //     bcc: `ops@babel.fit`
  //   }

  //   return sendEmail(data);
  // }

  // function sendDueInvoiceEmail(email, name, invoiceId, date){
  //   console.log("sending due invoice mail", email, name, invoiceId);
  //   var data = {
  //     from: 'billing@babel.fit',
  //     subject: `[Babel] - ${date}: Your invoice is now due`,
  //     html: `<p>Dear ${name},</p>
  //     <p>We're sorry! 😞 We regret to inform you that we have been experiencing technical difficulties with our automated system for past few weeks, 
  //     which is why you are receiving this delayed invoice due email. 
  //     Please be rest assured that we're working hard to resolve this issue. 
  //     Thank you for being patient with us, we look forward to serving you better.</p>
  //     <p>Your invoice is now due. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
  //     <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
  //     <p>Thanks for being a Babel member!</p>
  //     <p>Babel Team.</p>`,
  //     'h:Reply-To': 'support@babel.fit',
  //     // to: `sharasandravel@gmail.com`,
  //     to: `${email}`,
  //     // to: `faizul.j@boontan.net`,
  //     // bcc: `faizul.j@boontan.net`
  //     bcc: `ops@babel.fit`
  //   }
  //   return sendEmail(data);
  // }

  // function sendOverdueInvoiceEmail(email, name, invoiceId, date){
  //   console.log("sending overdue invoice mail", email, name, invoiceId);
  //   var data = {
  //     from: 'billing@babel.fit',
  //     subject: `URGENT [Babel] - ${date}: Your invoice is overdue`,
  //     html: `<p>Dear ${name},</p>
  //           <p>We're sorry! 😞 We regret to inform you that we have been experiencing technical difficulties with our automated system for past few weeks, 
  //           which is why you are receiving this delayed invoice overdue email. 
  //           Please be rest assured that we're working hard to resolve this issue. 
  //           Thank you for being patient with us, we look forward to serving you better.</p>
  //           <p>Your invoice is now overdue. Kindly visit this link to make payment : https://app.babel.fit/payments/${invoiceId}</p>
  //           <p>This is a computer generated email. If there are any discrepancies, please do not hesitate to send us an email at support@babel.fit.</p>
  //           <p>Thanks for being a Babel member!</p>
  //           <p>Babel Team</p>`,
  //     'h:Reply-To': 'support@babel.fit',
  //     // to: `sharasandravel@gmail.com`,
  //     // to: `faizul.j@boontan.net`,
  //     to: `${email}`,
  //     // bcc: `faizul.j@boontan.net`
  //     bcc: `ops@babel.fit`
  //   }
  //   return sendEmail(data);
  // }

  // function sendReceiptEmail(email, name, amount, invoiceId, date){
  //   console.log("sending receipt mail", email, name, amount, invoiceId);
  //   var data = {
  //     from: 'billing@babel.fit',
  //     subject: 'We have received your payment',
  //     html: `<p>Dear ${name},</p>
  //           <p>We're sorry! 😞 We regret to inform you that we have been experiencing technical difficulties with our automated system for past few weeks, 
  //           and we're working hard to resolve this issue. Thank you for being patient with us, we look forward to serving you better.</p>
  //           <p>We have received your payment for ${date}.</p>
  //           <p>Invoice No: ${invoiceId} <br/>
  //           Total Amount: RM${amount}</p>
  //           <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
  //           <p>Thank you very much and see you soon!</p>
  //           <p>-Babel Team</p>`,
  //     'h:Reply-To': 'support@babel.fit',
  //     // to: `faizul.j@boontan.net`,
  //     to: `${email}`,
  //     bcc: `ops@babel.fit`
  //   }
  //   return sendEmail(data);
  // }

  // function sendReceiptEmail(email, name, amount, invoiceId, date, quantity){
  //   console.log("sending receipt mail", email, name, amount, invoiceId, quantity);
  //   var data = {
  //     from: 'billing@babel.fit',
  //     subject: 'We have received your payment',
  //     html: `<p>Dear ${name},</p>
  //     <p>We have received your payment for ${date}.</p>
  //     <p>Invoice No: ${invoiceId} <br/>
  //     Total Amount: RM${amount}</p>
  //     <style>
  //     table, th, td {
  //       border: 1px solid black;
  //         line-height: inherit;
  //         text-align: left;
  //     }
  //     </style>
  //     <table style="width:100%">
  //       <tr>
  //         <th>Date</th>
  //         <th>Name</th>
  //         <th>Invoice Number</th>
  //         <th>Quantity</th>
  //         <th>Amount</th>
  //       </tr>
  //       <tr>
  //         <td>${date}</td>
  //         <td>${name}</td>
  //         <td>${invoiceId}</td>
  //         <td>${quantity}</td>
  //         <td>${amount}</td>
  //       </tr>
  //     </table>
  //     <br>
  //     <p>Please click here to print your receipt: https://app.babel.fit/payments/${invoiceId}</p>
  //     <p>Thank you very much and see you soon!</p>
  //     <p>-Babel Team-</p>`,
  //     'h:Reply-To': 'support@babel.fit',
  //     to: `faizul.j@boontan.net`,
  //     // to: `${email}`,
  //     bcc: `ops@babel.fit`
  //   }
  //   return sendEmail(data);
  // }

function sendEmail(data){
  const mailgun = require('mailgun-js')({apiKey:'key-c52c4056bdec1f0d03667db361a899c2', domain:'mx.babel.fit'});
  return mailgun.messages().send(data);
}

// valide email
// function validateEmail(email) {
//   var re = /\S+@\S+\.\S+/;
//   return re.test(email);
// }

function fetchSheetAPI(sheetId){
  var options = { method: 'PUT',
    url: `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`,
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    body:
    {
      "valueInputOption": "USER_ENTERED",
      "data": [
        {
          "range": "AUTO USERS!A2:S",
          "values": [
            [
              "saya",
              "NAME"
            ],
            [
              "aku",
              "test"
            ]
          ]
        }
      ]
    },
    json:true
  };
  return options;
}

// add virtual babel at home payment to sheet
exports.addVbabelwellnessPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'onlinemywellness').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const phone = userData? userData.phone? userData.phone: " ":" ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const productName = data.productName? data.productName: " ";
        const ighandlename = data.ighandlename? data.ighandlename: " ";
        const trainerName = data.trainerName? data.trainerName: " ";
        const coachName = data.coachName? data.coachName: " ";
        const selectedAMPM = data.selectedAMPM? data.selectedAMPM: " ";
        const selectedDay = data.selectedDay? data.selectedDay: " ";
        const AM = selectedAMPM.AM? 'yes':'no';
        const PM = selectedAMPM.PM? 'yes':'no';
        const mon = selectedDay.mon? 'yes':'no';
        const tues = selectedDay.tues? 'yes':'no';
        const wed = selectedDay.wed? 'yes':'no';
        const thurs = selectedDay.thurs? 'yes':'no';
        const fri = selectedDay.fri? 'yes':'no';
        const sat = selectedDay.sat? 'yes':'no';
        const sun = selectedDay.sun? 'yes':'no';

        const paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          userName,
          userEmail,
          ighandlename,
          invoiceId,
          status,
          totalPrice,
          type,
          phone,
          transactionId,
          // vendProductId,
          productName,
          trainerName,
          coachName,
          AM, PM,
          mon, tues, wed, thurs, fri, sat, sun
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO VIRTUAL BABELATHOME!A2:Z`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add virtual payment to sheet
exports.addVTPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'virtualTraining').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const phone = userData? userData.phone? userData.phone: " ":" ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const packageId = data.packageId? data.packageId:" ";
        const quantity = data.quantity? data.quantity:" ";
        const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const productName = data.productName? data.productName: " ";
        const trainerName = data.trainerName? data.trainerName: " ";
        const selectedAMPM = data.selectedAMPM? data.selectedAMPM: " ";
        const selectedDay = data.selectedDay? data.selectedDay: " ";
        const AM = selectedAMPM.AM? 'yes':'no';
        const PM = selectedAMPM.PM? 'yes':'no';
        const mon = selectedDay.mon? 'yes':'no';
        const tues = selectedDay.tues? 'yes':'no';
        const wed = selectedDay.wed? 'yes':'no';
        const thurs = selectedDay.thurs? 'yes':'no';
        const fri = selectedDay.fri? 'yes':'no';
        const sat = selectedDay.sat? 'yes':'no';
        const sun = selectedDay.sun? 'yes':'no';

        const paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          userName,
          userEmail,
          invoiceId,
          status,
          totalPrice,
          type,
          phone,
          transactionId,
          // vendProductId,
          productName,
          trainerName,
          AM, PM,
          mon, tues, wed, thurs, fri, sat, sun
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO VIRTUAL PAYMENT!A2:V`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add unpaid invoice to sheet
exports.addUnpaidInvoiceToSheets = functions.https.onRequest((req, res) => {
  const invoiceQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').get();

  return Promise.all([invoiceQuery, usersQuery, packagesQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const invoiceResults = result[0];
    const userResults = result[1];
    const packageResults = result[2];

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var packageMap = {};
    packageResults.forEach(doc=>{
      const data = doc.data();
      const renewalTerm = data && data.renewalTerm;
      if (data && (renewalTerm==='month'||renewalTerm==='monthly')){
        packageMap[doc.id] = data;
      }
    });

    var invoices = [];
    invoiceResults.forEach(invoice=>{
      if (invoice && invoice.data()){
        const data = invoice.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const membershipEnd = userData? userData.autoMembershipEnds? 
          moment(getTheDate(userData.autoMembershipEnds)).format('YYYYMMDD') : userData.membershipEnd? 
          moment(getTheDate(membershipEnd)).format('YYYYMMDD') : " " : " ";
       
        const invoiceId = invoice.id;
        const quantity = data.quantity? data.quantity:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const tax = data.tax? data.tax:0;
        const type = data.type? data.type:" ";
        const packageId = data.packageId? data.packageId:" ";
        const packageData = packageId? packageMap[packageId]:null;
        const packageName = packageData? packageData.name:" ";
        const userPkgId = userData && userData.packageId;
        const userPkgData = userPkgId? packageMap[userPkgId]:null;
        const userPkgName = userPkgData? userPkgData.name:" ";
        const paid = data.paid? data.paid:" ";
        const invoiceMailed = data.invoiceMailed? data.invoiceMailed: " ";
        const invoiceMailedAt = data.invoiceMailedAt? moment(getTheDate(data.invoiceMailedAt)).format('YYYYMMDD'):" ";
        const promoJan2020 = userData? userData.promoJan2020? userData.promoJan2020:" ":" ";
        const hasRecurring = userData? userData.hasRecurring? userData.hasRecurring:false:false;
        const amount = data.amount? data.amount:' ';

        const paymentItems = data.paymentItems? data.paymentItems:null;

        const invoiceData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          userName,
          userEmail,
          membershipEnd,
          quantity,
          invoiceId,
          tax,
          totalPrice,
          amount,
          type,
          packageName,
          userPkgName,
          invoiceMailed, invoiceMailedAt,
          promoJan2020,
          paid,
          hasRecurring
        ];
        invoices.push(invoiceData);
      }
    });

    invoices.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `UNPAID INVOICES!A2:V`,
            majorDimension: "ROWS",
            values: invoices
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        invoices: invoices,
      });
    });
  });
});

// add all invoice to sheets
exports.addMembershipInvoiceToSheets = functions.https.onRequest((req, res) => {
  const invoiceQuery = admin.firestore().collection('invoices').where('type', '==', 'membership').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').get();

  return Promise.all([invoiceQuery, usersQuery, packagesQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const invoiceResults = result[0];
    const userResults = result[1];
    const packageResults = result[2];

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var packageMap = {};
    packageResults.forEach(doc=>{
      const data = doc.data();
      const renewalTerm = data && data.renewalTerm;
      if (data && (renewalTerm==='month'||renewalTerm==='monthly')){
        packageMap[doc.id] = data;
      }
    });

    var invoices = [];
    invoiceResults.forEach(invoice=>{
      if (invoice && invoice.data()){
        const data = invoice.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const membershipEnd = userData? userData.autoMembershipEnds? 
          moment(getTheDate(userData.autoMembershipEnds)).format('YYYYMMDD') : userData.membershipEnd? 
          moment(getTheDate(membershipEnd)).format('YYYYMMDD') : " " : " ";
       
        const invoiceId = invoice.id;
        const quantity = data.quantity? data.quantity:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const tax = data.tax? data.tax:0;
        const type = data.type? data.type:" ";
        const packageId = data.packageId? data.packageId:" ";
        const packageData = packageId? packageMap[packageId]:null;
        const packageName = packageData? packageData.name:" ";
        const userPkgId = userData && userData.packageId;
        const userPkgData = userPkgId? packageMap[userPkgId]:null;
        const userPkgName = userPkgData? userPkgData.name:" ";
        const paid = data.paid? data.paid:" ";
        const invoiceMailed = data.invoiceMailed? data.invoiceMailed: " ";
        const invoiceMailedAt = data.invoiceMailedAt? moment(getTheDate(data.invoiceMailedAt)).format('YYYYMMDD'):" ";
        const promoJan2020 = userData? userData.promoJan2020? userData.promoJan2020:" ":" ";
        const promoAug2020 = userData? userData.promoAug2020? userData.promoAug2020:" ":" ";
        const hasRecurring = userData? userData.hasRecurring? userData.hasRecurring:false:false;
        const amount = data.amount? data.amount:' ';
        const transactionId = data.transactionId? data.transactionId: '';
        const paymentId = data.paymentId? data.paymentId: '';

        const paymentItems = data.paymentItems? data.paymentItems:null;

        const invoiceData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          userName,
          userEmail,
          membershipEnd,
          quantity,
          invoiceId, transactionId, paymentId,
          tax,
          totalPrice,
          amount,
          type,
          packageName,
          userPkgName,
          invoiceMailed, invoiceMailedAt,
          promoJan2020, promoAug2020,
          paid,
          hasRecurring
        ];
        invoices.push(invoiceData);
      }
    });

    invoices.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO INVOICES!A2:Z`,
            majorDimension: "ROWS",
            values: invoices
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        invoices: invoices,
      });
    });
  });
});

// add gantner app-registration klcc to sheet
exports.addGantnerAppRegistrationCount = functions.https.onRequest((req, res) => {
  const gantnerQuery = admin.firestore().collection('gantnerLogs')
    .where('deviceId', '==', 'App - Registration (KLCC)')
    // .where('createdAt', '>=', moment('1/8/2020').startOf('day').toDate())
    .get();

  return Promise.all([gantnerQuery]).then(result=>{
    const gantnerResults = result[0];
   
    var gantnerCount = 0;
    var allgantnerCount = 0;
    var gantnerArray = [];

    gantnerResults && gantnerResults.forEach((gantner)=>{
      const data = gantner && gantner.data();
      gantnerArray.push(data);
      const createdAt = data && data.createdAt;
      const registered = data && data.registered;
      const userId = data && data.userId;

      allgantnerCount += 1;
      //for september
      // const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isBetween(startOfMonth.clone().subtract(1,'days'), endOfMonth.clone().add(1, 'days')):false;
      const isSeptember2020 = createdAt && moment(getTheDate(createdAt)).isBetween(moment('2020-05-31'), moment('2020-07-01'));
      if (isSeptember2020){
        gantnerCount += 1;
        console.log('gantnerCount: ', gantnerCount);
      }
    });
    return res.status(200).send({
      success:true,
      gantnerCount: gantnerCount,
      allgantnerCount,
      gantnerArray
    });
  });
});

// add gantner app-registration TTDI to sheet
exports.addGantnerAppRegistrationCountTTDI = functions.https.onRequest((req, res) => {
  const gantnerQuery = admin.firestore().collection('gantnerLogs').where('deviceId', '==', 'App - Registration').get();

  return Promise.all([gantnerQuery]).then(result=>{
    const gantnerResults = result[0];
   
    var gantnerCount = 0;
    var allgantnerCount = 0;
    var gantnerArray = [];

    gantnerResults && gantnerResults.forEach((gantner)=>{
      const data = gantner && gantner.data();
      gantnerArray.push(data);
      const createdAt = data && data.createdAt;
      const registered = data && data.registered;
      const userId = data && data.userId;

      allgantnerCount += 1;
      //for september
      // const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isBetween(startOfMonth.clone().subtract(1,'days'), endOfMonth.clone().add(1, 'days')):false;
      const isSeptember2020 = createdAt && moment(getTheDate(createdAt)).isBetween(moment('2020-05-31'), moment('2020-07-01'));
      if (isSeptember2020){
        gantnerCount += 1;
        console.log('gantnerCount: ', gantnerCount);
      }
    });
    return res.status(200).send({
      success:true,
      gantnerCount: gantnerCount,
      allgantnerCount,
      gantnerArray
    });
  });
});

// add virtual class payment to sheet
exports.addVClassPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'virtualClass').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const userResults = result[1];

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        // const phone = userData? userData.phone? userData.phone: " ":" ";
        const phone = data.phone? data.phone : " ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const quantity = data.quantity? data.quantity:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const productName = data.productName? data.productName: " ";
        const city = data.city? data.city: " ";
        const ighandlename = data.ighandlename? data.ighandlename: " ";
        const selectedMemberOption = data.selectedMemberOption? data.selectedMemberOption: " ";
        const isTTDIMember = selectedMemberOption.isTTDIMember? 'yes':'no';
        const isKLCCMember = selectedMemberOption.isKLCCMember? 'yes':'no';
        const isNonMember = selectedMemberOption.isNonMember? 'yes':'no';

        const paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          userName,
          userEmail,
          ighandlename,
          invoiceId,
          status,
          totalPrice,
          type,
          phone,
          transactionId,
          // vendProductId,
          productName,
          city,
          isTTDIMember, isKLCCMember, isNonMember
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO VIRTUAL CLASS PAYMENT!A2:V`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add unlimited outdoor class payments to sheets
exports.addUnlimitedOutdoorPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('vendProductId', '==', unlimitedOutdoorClassVendProductId).get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const packageId = userData? userData.packageId? userData.packageId : " " : " ";
        const quantity = data.quantity? data.quantity:" ";
        const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const vendSaleId = data.vendSaleId? data.vendSaleId:" ";
        var packageData = packageId ? packageMap[packageId] : " ";
        var packageName = packageData && packageData.name? packageData.name:" ";
        const isKLCCMember = isKLCCPackage(packageId)? "yes":"no";
        const isTTDIMember = isTTDIPackage(packageId)? "yes":"no"
        const isNonMember = (!isKLCCMember && !isTTDIMember)? "yes":"no";

        const paymentData = [
          payment.id,
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          userId, userName, userEmail, isKLCCMember, isTTDIMember, isNonMember,
          invoiceId, quantity, status, totalPrice, type, transactionId,
          vendProductId, vendSaleId
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `UNLIMITED OUTDOOR CLASSES!A2:S`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add babel dance payment to sheet
exports.addBabelDancePaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'babelDance').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const userResults = result[1];

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        // const phone = userData? userData.phone? userData.phone: " ":" ";
        const phone = data.phone? data.phone : " ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const quantity = data.quantity? data.quantity:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const productName = data.productName? data.productName: " ";
        const city = data.city? data.city: " ";
        const ighandlename = data.ighandlename? data.ighandlename: " ";
        const selectedMemberOption = data.selectedMemberOption? data.selectedMemberOption: " ";
        const isTTDIMember = selectedMemberOption.isTTDIMember? 'yes':'no';
        const isKLCCMember = selectedMemberOption.isKLCCMember? 'yes':'no';
        const isNonMember = selectedMemberOption.isNonMember? 'yes':'no';
        const classRemark = data.classRemark? data.classRemark:" ";
        const instructorName = data.instructorName? data.instructorName:"";
        const classDate = data.classDate? data.classDate:"";
        const classTime = data.classTime? data.classTime:"";

        const paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('HH:mm:ss') : '',
          userName,
          userEmail,
          ighandlename,
          invoiceId,
          status,
          totalPrice,
          type,
          phone,
          classDate,
          classTime,
          transactionId,
          instructorName,
          productName,
          city,
          isTTDIMember, isKLCCMember, isNonMember,
          classRemark
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      var timeA = a[1];
      var timeB = b[1];
      if (timeA < timeB) {return -1}
      if (timeA > timeB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `BABEL DANCE CLASS PAYMENT!A2:V`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add payments to user sheets
exports.addPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const packageId = data.packageId? data.packageId:" ";
        const quantity = data.quantity? data.quantity:" ";
        const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const vendProductName = data.vendProductName || null;
        const vendSaleId = data.vendSaleId? data.vendSaleId:" ";
        var packageData = packageId ? packageMap[packageId] : " ";
        var packageName = (packageData && packageData.name)? packageData.name: vendProductName? vendProductName: " ";
        //  isKLCCMember = 
        const isKLCCMembershipPkg = isKLCCPackage(packageId)? "YES":"NO";
        const isTTDIMembershipPkg = isTTDIPackage(packageId)? "YES":"NO";
        const isMembershipPkg = data.type? (data.type==='membership')? "YES":"NO":"NO";
        // const isKLCCProduct = 
        const userComplimentaryPromo = userData && userData.complimentaryPromo;
        if (vendProductId === 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7' && userComplimentaryPromo && createdAt){
          // const userPkgId = userData && userData.packageId;
          packageName = 'complimentary promo';
        }

        const paymentData = [
          payment.id,
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
          userId,
          userName,
          userEmail,
          invoiceId,
          // packageId,
          packageName,
          isKLCCMembershipPkg,
          isTTDIMembershipPkg,
          isMembershipPkg,
          quantity,
          renewalTerm,
          source,
          status,
          totalPrice,
          type,
         
          transactionId,
          vendProductId,
          vendSaleId
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO MEMBERSHIP PAYMENT!A2:S`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add payments to user sheets
exports.addPaymentAcademyToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'product').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var payments = [];
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        // const packageId = data.packageId? data.packageId:" ";
        const quantity = data.quantity? data.quantity:" ";
        const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
        const source = data.source? data.source:" ";
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const transactionId = data.transactionId? data.transactionId:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const vendSaleId = data.vendSaleId? data.vendSaleId:" ";
        const detailName = data.detailName? data.detailName:" ";
        const productName = data.productName? data.productName:" ";
        // const packageData = packageId ? packageMap[packageId] : " ";
        // const packageName = packageData && packageData.name? packageData.name:" ";

        const paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          userName,
          invoiceId,
          detailName,
          productName,
          quantity,
          renewalTerm,
          source,
          status,
          totalPrice,
          type,
          userId,
          transactionId,
          vendProductId,
          vendSaleId
        ];
        payments.push(paymentData);
      }
    });

    payments.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO ACADEMY!A2:S`,
            majorDimension: "ROWS",
            values: payments
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        payments: payments,
      });
    });
  });
});

// add all payments to user sheets
exports.addAllInvoicesToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const invoicesQuery = admin.firestore().collection('invoices').where('paid', '==', true).get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();
  const vendProductQuery = admin.firestore().collection('vendProducts').get();

  return Promise.all([invoicesQuery, packagesQuery, usersQuery, vendProductQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const invoiceResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];
    const vendResults = result[3];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var vendProductMap = {};
    vendResults && vendResults.forEach(product=>{
      const data = product.data();
      if (data){
        vendProductMap[product.id] = data;
      }
    });

    var invoices = [];
    invoiceResults.forEach(invoice=>{
      if (invoice && invoice.data()){
        const data = invoice.data();
        const createdAt = data.createdAt || null;
        const receiptMailed = data.receiptMailed || null; // 1
        const receiptMailedAt = data.receiptMailedAt? data.receiptMailedAt:null;
        const paymentId = data.paymentId || null; // 2
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email : " " : " "; // 3
        const packageId = data.packageId? data.packageId:null;
        const packageData = packageId ? packageMap[packageId] : null;
        const packageName = packageData && packageData.name? packageData.name:" "; // 4
        const vendProductId = data.vendProductId||null;
        const vendProductData = vendProductId? vendProductMap[vendProductId]:null;
        const productName = vendProductData && (vendProductData.product_type? (vendProductData.product_type.name? vendProductData.product_type.name : "n/a") : "n/a"); 
        const totalPrice = data.totalPrice? data.totalPrice:" "; //5
        const quantity = data.quantity? data.quantity:1;
        const chargeAttempts = data.chargeAttempts? data.chargeAttempts:" "; // 6
        const paid = data.refunded? 'refunded':data.paid? 'paid': 'n/a';
        const invoiceMailed = data.invoiceMailed? data.invoiceMailed:false;
        const invoiceMailedAt = data.invoiceMailedAt? data.invoiceMailedAt:null;
        const dueMailed = data.dueMailed? data.dueMailed:false;
        const dueMailedAt = data.dueMailedAt? data.dueMailedAt:null;

        const invoiceData = [
          //receiptMailed? moment(getTheDate(receiptMailed)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          receiptMailed,
          receiptMailedAt? moment(getTheDate(receiptMailedAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          paymentId,
          invoice.id,
          userEmail,
          userName,
          packageName,
          productName,
          quantity,
          totalPrice,
          chargeAttempts,
          paid,
          invoiceMailed,
          invoiceMailedAt? moment(getTheDate(invoiceMailedAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'',
          dueMailed,
          dueMailedAt? moment(getTheDate(dueMailedAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'',
        ];
        invoices.push(invoiceData);
      }
    });

    invoices.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO ALL PAYMENTS!A2:S`,
            majorDimension: "ROWS",
            values: invoices
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        invoices: invoices,
      });
    });
  });
});
// add gantnerlogs
// exports.addGantnerToSheets = functions.https.onRequest((req, res) => {
//   const usersQuery = admin.firestore().collection('users').get();
//   // where('email', '==', 'tehowny@gmail.com').get();
//   const gantnerQuery = admin.firestore().collection("gantnerLogs").where('createdAt', '>=', moment('20200301').startOf('day').toDate()).where('createdAt', '<=', moment('20200315').startOf('day').toDate()).orderBy('createdAt').get();
//   const packageQuery = admin.firestore().collection('packages').get();
//   // const gantnerQuery = admin.firestore().collection("gantnerLogs").get();

//   return Promise.all([usersQuery, packageQuery, gantnerQuery]).then(results=>{
//     const userResults = results[0];
//     var users = {};
//     userResults.forEach(doc => {
//       users[doc.id] = doc.data();
//     });

//     const packagesResults = results[1];
//     var packages = {};
//     packagesResults.forEach(doc => {
//       packages[doc.id] = doc.data();
//     });

//     const logResults = results[2];
//     var gantnerLogs = [];
//     logResults.forEach(function(doc) {
//       const data = doc.data();
//       const createdAt = data && data.createdAt;
//       const userId = data && data.userId;
//       const deviceId = data && data.deviceId;
//       // const deviceIdIsKLCC = deviceId && deviceId.toLowerCase().indexOf('klcc') !== -1;
//       // if (userId && createdAt && !deviceIdIsKLCC) {
//       if (userId && createdAt && deviceId) {  
//         gantnerLogs.push(doc.data());
//       }
//     });

//     gantnerLogs.sort((a,b)=>{
      
//       const aId = a.userId;
//       const bId = b.userId;
//       if (aId < bId) {return -1}
//       if (bId < aId) {return 1}

//       const createdAtA = a.createdAt;
//       const createdAtB = b.createdAt;
//       if (createdAtA < createdAtB) {return -1}
//       if (createdAtB < createdAtA) {return 1}

//       return 0;
//     });

//     var startMoment = moment("2020-02-01").startOf('day') //.add(6, 'hours');
//     var endMoment = moment().startOf('day') //.add(10, 'hours');

//     var checkinData = [];
//     var allCheckins = 0;
//     var allCheckinDetails = [];

//     var inGym = {};
//     var inGymDetails = {};
//     var detailsArray = [];

//     var allGantnerArray = [];
//     var finalArray = [];
//     gantnerLogs.forEach((logs)=>{
//       const createdAt = logs && logs.createdAt;
//       const date = createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):null;
//       const day = createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('ddd'):null;
//       const userId = logs && logs.userId;
//       const userData = userId ? users[userId]:null;
//       const userName = userData? userData.name? userData.name : " " : " ";
//       const userEmail = userData? userData.email? userData.email : " " : " ";
//       const packageId = userData? userData.packageId? userData.packageId : null : null;
//       const packageData = packageId? packages[packageId]:null;
//       const packageName = packageData? packageData.name:"n/a";
//       const checkIn = createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm A'):null;
//       const deviceId = logs && logs.deviceId;
//       // var checkOut = null;

//       if (allGantnerArray && allGantnerArray.length>1 && allGantnerArray[allGantnerArray.length-1].checkIn && moment(getTheDate(allGantnerArray[allGantnerArray.length-1].createdAt)).isSame(moment(getTheDate(createdAt)), 'day' ) 
//         && (allGantnerArray[allGantnerArray.length-1].userId === userId) && !(allGantnerArray[allGantnerArray.length-1].checkOut)
//       ) {
//         allGantnerArray[allGantnerArray.length-1].checkOut = moment(getTheDate(createdAt)).format('hh:mm A');
//       }
//       else{
//         allGantnerArray.push({
//           createdAt,
//           date,
//           day,
//           userId,
//           userEmail,
//           userName,
//           packageName,
//           checkIn,
//           checkOut:null,
//           deviceId
//         })
//       }
//     });

//     console.log('allGantnerArray: ', allGantnerArray);
//     // allGantnerArray.sort((a,b)=>{

//     // });

//     allGantnerArray.forEach((logs)=>{
//       const date = logs.date||null;
//       const day = logs.day||null;
//       const userName = logs.userName||null;
//       const userEmail = logs.userEmail||null;
//       const packageName = logs.packageName||null;
//       const checkIn = logs.checkIn||null;
//       const checkOut = logs.checkOut? logs.checkOut:"n/a";
//       const deviceId = logs.deviceId? logs.deviceId:"n/a";
//       finalArray.push(
//         [date, day, userEmail, userName, packageName, checkIn, checkOut, deviceId]
//       )
//     });
//     // while (startMoment <= endMoment) {
//     //   console.log('inside while loop');
//     //   var hourLogs = gantnerLogs.filter(log => {
//     //     const checkInDate = moment(getTheDate(log.createdAt)).startOf('hour');
//     //     return checkInDate.valueOf() === startMoment.valueOf()
//     //   });

//     //   var checkins = 0;
//     //   // hourLogs.map(log => {
//     //   //   const userId = log.userId;
//     //   //   const user = users[userId];
//     //   //   const roles = user && user.roles;
//     //   //   const isStaff = roles && (roles.admin || roles.mc || roles.trainer);
//     //   //   var visit;

//     //   //   // if(user && !isStaff){
//     //   //   //   if (inGymDetails[userId]) {
//     //   //   //     visit = inGymDetails[userId];
//     //   //   //     if(moment(log.createdAt).diff(moment(visit.RawIn), 'hours', true) >= 6){
//     //   //   //       delete visit.RawIn;
//     //   //   //       detailsArray.push(visit);
//     //   //   //       delete inGymDetails[userId];
//     //   //   //     }
//     //   //   //     visit.Out = moment(log.createdAt).format('HH:mm A');
//     //   //   //   } else {
//     //   //   //     checkins += 1;
//     //   //   //     allCheckins += 1;
//     //   //   //     inGym[userId] = true;
//     //   //   //     var packageName = user.packageId ? packages[user.packageId].name : '';
//     //   //   //     if(packageName !== '' && user.email && (user.email.indexOf('@bfm.my') !== -1 || user.email.indexOf('@bfmedge.com') !== -1) || user.email.indexOf('@bfmedge.com') !== -1 || user.email.indexOf('fi.life') !== -1){
//     //   //   //       packageName = packageName + ' - BFM';
//     //   //   //     }
//     //   //   //     visit = {
//     //   //   //       Date: startMoment.format("YYYY-MM-DD"),
//     //   //   //       Day: startMoment.format('ddd'),
//     //   //   //       Name: user.name,
//     //   //   //       Package:packageName,
//     //   //   //       In: moment(log.createdAt).format('HH:mm A'),
//     //   //   //       Out: ' ',
//     //   //   //       RawIn:log.createdAt
//     //   //   //     }
//     //   //   //     inGymDetails[userId] = visit;
//     //   //   //   }
//     //   //   // }
//     //   // });

//     //   checkinData.push({
//     //     Date: startMoment.format("YYYY-MM-DD"),
//     //     Day: startMoment.format('ddd'),
//     //     Time: startMoment.format('HH:mm'),
//     //     Checkins: checkins
//     //   });
//     //   // console.log(startMoment.format("ddd, DD-MM-YYYY") + ` : ${checkins}`);
//     //   console.log('checkInData: ', checkinData);
//     // }
//     //   // const oldStartMoment = startMoment.clone();
//     //   // startMoment = startMoment.add(1, 'hour');

//     //   // if (!oldStartMoment.isSame(startMoment, 'day')) {

//     //   //   inGym = {};
//     //   //   Object.keys(inGymDetails).forEach(userId => {
//     //   //     detailsArray.push(inGymDetails[userId]);
//     //   //   });
//     //   //   inGymDetails = {};

//     //   //   detailsArray.sort((a, b) => {
//     //   //     const aIn = a.in;
//     //   //     const bIn = b.in;

//     //   //     if (aIn < bIn) {
//     //   //       return -1;
//     //   //     }
//     //   //     if (bIn < aIn) {
//     //   //       return 1
//     //   //     }
//     //   //     const aOut = a.out;
//     //   //     const bOut = b.out;
//     //   //     if (aOut < bOut) {
//     //   //       return -1;
//     //   //     }
//     //   //     if (bOut < aOut) {
//     //   //       return 1
//     //   //     }
//     //   //     return 0;
//     //   //   });

//     //   //   // console.log(oldStartMoment.format("ddd, DD-MM-YYYY"), detailsArray.length);
//     //   //   detailsArray.forEach(detail=>{
//     //   //     delete detail.RawIn;
//     //   //   });
//     //   //   allCheckinDetails = allCheckinDetails.concat(detailsArray);
//     //   //   detailsArray = [];
//     //   // }
//     // }
//     // console.log('payments: ', payments);

//     // allCheckinDetails.sort((a,b)=>{
//     //   const aDate = a.Date;
//     //   const bDate = b.Date;
//     //   if (aDate < bDate) {
//     //     return -1;
//     //   }
//     //   if (bDate < aDate) {
//     //     return 1;
//     //   }
//     //   const aIn = a.In;
//     //   const bIn = b.In;
//     //   if (aIn < bIn) {
//     //     return -1;
//     //   }
//     //   if (bIn < aIn) {
//     //     return 1;
//     //   }
//     //   return 0;
//     // });

//     // console.log('allCheckinDetails: ', allCheckinDetails);
//     const updateSheetPromise = updateGoogleSheet({
//       spreadsheetId: CONFIG_SHEET_ID,
//       resource: {
//         // How the input data should be interpreted.
//         valueInputOption: 'RAW',  // TODO: Update placeholder value.
//         // The new values to apply to the spreadsheet.
//         data: [
//           {
//             range: `GANTNER LOGS!A2:S`,
//             majorDimension: "ROWS",
//             values: finalArray
//           }
//         ],  // TODO: Update placeholder value.
  
//         // TODO: Add desired properties to the request body.
//       },
//     });

//     // return res.status(200).send({
//     //   success:true,
//     //   data: 'data',
//     //   finalArray
//     // });

//     return updateSheetPromise.then((result)=>{
//       // console.log('theresult: ', result);
//       return res.status(200).send({
//         success:true,
//         // data: 'data',
//         finalArray
//       });
//     });
//   });
// });

function isKLCCPackage(packageId){
  var isKLCCPackage = false;
  if ((packageId === '89THMCx0BybpSVJ1J8oz')
  || (packageId === 'BKcaoWGrWKYihS40MpGd')
  || (packageId === 'LNGWNSdm6kf4rz1ihj0i')
  || (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q')
  || (packageId === 'aTHIgscCxbwjDD8flTi3')
  || (packageId === 'eRMTW6cQen6mcTJgKEvy')
  || (packageId === 'q7SXXNKv83MkkJs8Ql0n')
  )
  {
    isKLCCPackage = true;
  }
  return isKLCCPackage;
}

function isTTDIPackage(packageId){
  var isTTDIPackage = false;
  if ((packageId === 'DjeVJskpeZDdEGlcUlB1')
  || (packageId === 'VWEHvdhNVW0zL8ZAeXJX')
  || (packageId === 'WmcQo1XVXehGaxhSNCKa')
  || (packageId === 'ZEDcEHZp3fKeQOkDxCH8')
  || (packageId === 'duz1AkLuin8nOUd7r66L')
  || (packageId === 'dz8SAwq99GWdEvHCKST2')
  || (packageId === 'vf2jCUOEeDDiIQ0S42BJ')
  || (packageId === 'wpUO5vxWmme7KITqSITo')
  || (packageId === 'yQFACCzpS4DKcDyYftBx')
  || (packageId === 'w12J3n9Qs6LTViI6HaEY')
  || (packageId === 'k7As68CqGsFbKZh1Imo4')
  ){
    isTTDIPackage = true;
  }
  return isTTDIPackage;
}

function is3MonthKLCCPackage(packageId){
  var isKLCCPackage = false;
  if ((packageId === 'LNGWNSdm6kf4rz1ihj0i') || (packageId === 'aTHIgscCxbwjDD8flTi3')) 
  {isKLCCPackage = true}
  return isKLCCPackage;
}

function is3MonthTTDIPackage(packageId){
  var isTTDIPackage = false;
  if ((packageId === 'yQFACCzpS4DKcDyYftBx') // '3M Term Membership' // need to clarify
  || (packageId === 'w12J3n9Qs6LTViI6HaEY') // 3M Jan2020 Promo (Single Club).
  || (packageId === 'k7As68CqGsFbKZh1Imo4')) // 3M Jan2020 Promo (Single Club)
  {isTTDIPackage = true}
  return isTTDIPackage;
}

// 3/8/2020 - this function is to convert the package promoJan2020 and Aug2020 to single RM250 or All access RM330 package
function convertToSingleOrAllAccessPkg(packageId){
  if (
    packageId === 'AHgEEavKwpJoGTMOzUdX' //3M August 2020 (single access)
    || packageId === 'k7As68CqGsFbKZh1Imo4' // 3M Jan2020 Promo (Single Club)
    || packageId === 'w12J3n9Qs6LTViI6HaEY' // 3M Jan2020 Promo (Single Club).
    || packageId === 'hUZjGJR77bP30I3fjvwD' // 3M Mid September Promo (single access)
    ){
      return 'vf2jCUOEeDDiIQ0S42BJ'; // convert to monthly single package
  }
  else if (
    packageId === 'LNGWNSdm6kf4rz1ihj0i' // 3M Jan2020 Promo (All Clubs)
    || packageId === 'YsOxVJGLRXrHDgNTBach' // 3M August 2020 (all access)
    || packageId === 'kh513XOaG7eLX4z9G0Ft' // 3M mid september (all access)
    || packageId === 'uQO2UsaRiqXtzPKjTSIS' // 4Monthly UNO (all access)
  ){
    return 'TJ7Fiqgrt6EHUhR5Sb2q' // convert to monthly all access package
  }
  else{
    return null;
  }
}

// cron job to add active users to sheets (monthly basis)
// exports.addActiveUsersToSheets = functions.https.onRequest((req, res) => {
//   // const usersQuery = admin.firestore().collection('users').get();
//   const usersQuery = admin.firestore().collection('users').get();
//   const packagesQuery = admin.firestore().collection('packages').get();
//   const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership')
//     .where('createdAt', '>=', moment('20200301').startOf('day').toDate())
//     .where('createdAt', '<=', moment('20200331').startOf('day').toDate())
//     .get();

//   return Promise.all([usersQuery, packagesQuery, paymentQuery]).then(result=>{
//     var batch = admin.firestore().batch();
//     const usersResults = result[0];
//     const packageResult = result[1];
//     const paymentsResults = result[2];
//     const timestamp = admin.firestore.FieldValue.serverTimestamp();

//     const startOfTodayMoment = moment('20200331').tz('Asia/Kuala_Lumpur').startOf('day');

//     var pkgMap = {};
//     packageResult && packageResult.forEach(pkg=>{
//       pkgMap[pkg.id] = pkg.data();
//     });

//     var paymentMap = {};
//     paymentsResults && paymentsResults.forEach(payment=>{
//       const data = payment && payment.data();
//       const userId = data && data.userId;
//       if (userId){
//         // paymentMap[payment.id] = payment.data();
//         paymentMap[userId] = payment.data();
//       }
//     });

//     // console.log('paymentMap: ', paymentMap);

//     var users = [];
//     usersResults.forEach(user=>{
//       if (user && user.data()){
//         const data = user.data();
//         const cancelledMember = data.cancellationDate? true:false;
//         const isCancel = data.cancellationDate? moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment):false;
//         // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
//         const membershipEnds = data.membershipEnds? data.membershipEnds: null;
//         const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
//         // const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
//         const membershipEndsMoment = autoMembershipEnds? moment(getTheDate(autoMembershipEnds)):membershipEnds? moment(getTheDate(membershipEnds)):null;
//         // console.log('membershipEndsMoment123: ', membershipEndsMoment);
//         const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isBefore(startOfTodayMoment.clone()); 
//         const membershipStarts = data.membershipStarts? data.membershipStarts:null;
//         const autoMembershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null;
//         const isValidStartDate = moment(getTheDate(autoMembershipStarts)).isBefore(startOfTodayMoment.clone());
//         const packageId = data && data.packageId;
//         const packageData = packageId ? pkgMap[packageId] : null;
//         const packageName = packageData? packageData.name:" ";
//         const paymentData = paymentMap? paymentMap[user.id]:null;
//         const paymentCreatedAt = paymentData? paymentData.createdAt? moment(getTheDate(paymentData.createdAt)).format('YYYY-MM-DD'):" ": " ";
//         const isFreeze = paymentData? paymentData.freezeFor? true:false:false;

//         const userData = [
//           data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : null,
//           // data.index ? data.index:'',
//           user.id,
//           data.membershipCard ? data.membershipCard : '',
//           // data.gantnerCardNumber ? data.gantnerCardNumber : '',
//           data.name ? data.name : '',
//           // data.firstName ? data.firstName : '',
//           // data.lastName ? data.lastName : '',
//           data.nric ? data.nric : '',
//           data.passport ? data.passport : '',
//           // data.nationality ? data.nationality : '',
//           data.race ? data.race : '',
//           data.gender ? data.gender : '',
//           data.phone ? data.phone : '',
//           data.email ? data.email : '',
//           // data.mcId ? data.mcId : '',
//           packageName,
//           // data.paymentMode ? data.paymentMode : '',
//           autoMembershipStarts ? moment(getTheDate(autoMembershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'): ' ',
//           // membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
//           // membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
//           autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
//           data.referredByUserId ? data.referredByUserId : '',
//           // data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
//           // data.cancellationReason ? data.cancellationReason : '',
//           data.remarks ? data.remarks : '',
//           paymentCreatedAt
//         ];

//         if (autoMembershipStarts && !isExpiredMember && !isCancel && isValidStartDate && autoMembershipEnds && (packageId!=='L6sJtsKG68LpEUH3QeD4') && !isFreeze){
//         // if (packageName === 'Complimentary Promo'){
//           users.push(userData);
//         }
//       }
//     });

//     // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
//     users.sort((a,b)=>{
//       var dateA = new Date(a[18]);
//       var dateB = new Date(b[18]);
//       if (dateA < dateB) {return -1}
//       if (dateA > dateB) {return 1}
//       return 0;
//     });

//     // var userMap = {};
//     // usersResults && usersResults.forEach(user=>{
//     //   if (user && user.data()){
//     //     userMap[user.id]=user.data();
//     //   }
//     // });

//     const updateSheetPromise = updateGoogleSheet({
//       spreadsheetId: CONFIG_SHEET_ID,
//       // valueInputOption: 'RAW',
      
//       resource: {
//         // How the input data should be interpreted.
//         valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
//         // The new values to apply to the spreadsheet.
//         data: [
//           {
//             range: `ACTIVE USERS MONTHLY!A2:AG`,
//             majorDimension: "ROWS",
//             values: users
//           }
//         ],  // TODO: Update placeholder value.
  
//         // TODO: Add desired properties to the request body.
//       },

//     });

//     return updateSheetPromise.then((result)=>{
//       console.log('theresult: ', result);
//       return res.status(200).send({
//         success:true,
//         data: 'data',
//         users: users,
//         // theResponse
//         // userCount
//       });
//     });
//   });
// });

// cron job to add complementary users to sheets (monthly basis)
exports.addComplementaryUsersToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership')
    // .where('freezeFor', '>=', moment('20200201').startOf('day').toDate())
    // .where('freezeFor', '<=', moment('20200229').startOf('day').toDate())
    // .where('vendProductId', '==', 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7')
    .where('source', '==', 'freeze')
    .get();

  return Promise.all([usersQuery, packagesQuery, paymentQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResult = result[1];
    const paymentsResults = result[2];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment('20200229').tz('Asia/Kuala_Lumpur').startOf('day');

    var pkgMap = {};
    packageResult && packageResult.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });

    var paymentMap = {};
    paymentsResults && paymentsResults.forEach(payment=>{
      const data = payment && payment.data();
      const userId = data && data.userId;
      if (userId){
        // paymentMap[payment.id] = payment.data();
        paymentMap[userId] = payment.data();
      }
    });

    // console.log('paymentMap: ', paymentMap);


    var users = [];
    var paymentFreezeArray = [];

    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        const isCancel = data.cancellationDate? moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment):false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        // const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        const membershipEndsMoment = autoMembershipEnds? moment(getTheDate(autoMembershipEnds)):membershipEnds? moment(getTheDate(membershipEnds)):null;
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isBefore(startOfTodayMoment.clone()); 
        const membershipStarts = data.membershipStarts? data.membershipStarts:null;
        const autoMembershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null;
        const isValidStartDate = moment(getTheDate(autoMembershipStarts)).isBefore(startOfTodayMoment.clone());
        const packageId = data && data.packageId;
        const packageData = packageId ? pkgMap[packageId] : null;
        const packageName = packageData? packageData.name:" ";
        const paymentData = paymentMap? paymentMap[user.id]:null;
        const paymentCreatedAt = paymentData? paymentData.createdAt? moment(getTheDate(paymentData.createdAt)).format('YYYY-MM-DD'):" ": " ";

        paymentCreatedAt && paymentFreezeArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        // if (paymentCreatedAt){
        //   if(paymentFreezeArray.length>0 && paymentFreezeArray[paymentFreezeArray.length-1].userId === user.id){
        //     paymentFreezeArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        //   }
        //   else{
        //     paymentFreezeArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        //   }
        // }

        console.log('paymentFreezeArray: ', paymentFreezeArray);

        const userData = [
          data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : null,
          // data.index ? data.index:'',
          user.id,
          data.membershipCard ? data.membershipCard : '',
          // data.gantnerCardNumber ? data.gantnerCardNumber : '',
          data.name ? data.name : '',
          // data.firstName ? data.firstName : '',
          // data.lastName ? data.lastName : '',
          data.nric ? data.nric : '',
          data.passport ? data.passport : '',
          // data.nationality ? data.nationality : '',
          data.race ? data.race : '',
          data.gender ? data.gender : '',
          data.phone ? data.phone : '',
          data.email ? data.email : '',
          // data.mcId ? data.mcId : '',
          packageName,
          // data.paymentMode ? data.paymentMode : '',
          autoMembershipStarts ? moment(getTheDate(autoMembershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'): ' ',
          // membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          // membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.referredByUserId ? data.referredByUserId : '',
          // data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          // data.cancellationReason ? data.cancellationReason : '',
          data.remarks ? data.remarks : '',
          paymentCreatedAt
        ];

        if (autoMembershipStarts && autoMembershipEnds && paymentData && paymentData.createdAt){
          users.push(userData);
        }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    users.sort((a,b)=>{
      var dateA = new Date(a[18]);
      var dateB = new Date(b[18]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // var userMap = {};
    // usersResults && usersResults.forEach(user=>{
    //   if (user && user.data()){
    //     userMap[user.id]=user.data();
    //   }
    // });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `COMPLIMENTARY USERS!A2:AG`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        users: users,
        // theResponse
        // userCount
      });
    });
  });
});

// cron job to add complementary users to sheets (monthly basis)
exports.addAllUsersPaymentToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership')
    // .where('freezeFor', '>=', moment('20200201').startOf('day').toDate())
    // .where('freezeFor', '<=', moment('20200229').startOf('day').toDate())
    // .where('vendProductId', '==', 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7')
    // .where('source', '==', 'freeze')
    .get();

  const gymStartDate = moment('20180101');
  const monthDiff = Math.max(moment(new Date()).diff(gymStartDate, 'months'));
  const dateObject = [];
    // default, if there is no payment detected
    for (var i=0; i<=monthDiff; i++){
    const iterationStartMoment = gymStartDate.clone().add(i, 'months');
    dateObject.push({effectiveDate:iterationStartMoment});
  }

  // console.log('dateObject: ', dateObject);

  return Promise.all([usersQuery, packagesQuery, paymentQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResult = result[1];
    const paymentsResults = result[2];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    // console.log('dateObjectInsidePromise: ', dateObject);

    // const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var pkgMap = {};
    packageResult && packageResult.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });
    console.log('packageMap: ', pkgMap);


    var paymentMap = {};
    // var paymentArray = [];
    paymentsResults && paymentsResults.forEach(payment=>{
      const data = payment && payment.data();
      const userId = data && data.userId;
      if(!paymentMap[userId] && data && userId)
        // paymentMap[userId][payment.id] = {};
        paymentMap[userId] = {};
      else if (userId){
        //paymentMap[payment.id] = payment.data();
         paymentMap[userId][payment.id] = payment.data();
        // paymentMap[userId] = paymentArray.push(payment.data());
      }
    });

    console.log('paymentMap: ', paymentMap);

    var users = [];
    // // var paymentArray = [];


    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        // const isCancel = data.cancellationDate? moment(getTheDate(data.cancellationDate)).isSameOrBefore(startOfTodayMoment):false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        // const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        const membershipEndsMoment = autoMembershipEnds? moment(getTheDate(autoMembershipEnds)):membershipEnds? moment(getTheDate(membershipEnds)):null;
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        // const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isBefore(startOfTodayMoment.clone()); 
        const membershipStarts = data.membershipStarts? data.membershipStarts:null;
        const autoMembershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null;
        // const isValidStartDate = moment(getTheDate(autoMembershipStarts)).isBefore(startOfTodayMoment.clone());
        const packageId = data && data.packageId;
        const packageData = packageId ? pkgMap[packageId] : null;
        const packageName = packageData? packageData.name:" ";
        const paymentData = paymentMap? paymentMap[user.id]:null;
        // const monthDiff = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
        
        console.log('paymentData: ', paymentData);
        var paymentArray = [];
        
        // if (paymentData){
        //     //for (var userKey in paymentData){
        //       // console.log('userKey: ' + userKey + ' paymentData[userKey]: ' + paymentData[userKey]);
        //       for (var paymentKey in paymentData){
        //         console.log('paymentKey: ' + paymentKey + ' paymentData[paymentKey]: ' + paymentData[paymentKey]);
        //          Object.keys(paymentData).forEach(item => {
        //           console.log('paymentItem: ', item);
        //         });
        //       }
        //     //}
        //   }

        // if (paymentData){
        //   //for (var userKey in paymentData){
        //     // console.log('userKey: ' + userKey + ' paymentData[userKey]: ' + paymentData[userKey]);
        //     for (var paymentKey in paymentData[userKey]){
        //       const source = paymentData[userKey][paymentKey].source||null;
        //       const totalPrice = paymentData[userKey][paymentKey].totalPrice||null;
        //       const createdAt = paymentData[userKey][paymentKey].createdAt||null;
        //       paymentArray.push({createdAt, source, totalPrice});
        //     }
        //   //}
        // }
       
        if (paymentData){
          Object.keys(paymentData).forEach(item => {
            console.log('paymentData: ', item);
            
          });
        }
       

        // Object.entries(paymentData).forEach(([key, value]) => {
        //   console.log(`theObject: ${key} ${value}`); // "a 5", "b 7", "c 9"
        //   // const source = value.source||null;
        //   // const totalPrice = payment.totalPrice||null;
        //   // const createdAt = payment.createdAt||null;
        //   // paymentArray.push({createdAt, source, totalPrice});
        // });
        // paymentData && paymentData.forEach(payment=>{
        //   const source = payment.source||null;
        //   const totalPrice = payment.totalPrice||null;
        //   const createdAt = payment.createdAt||null;
        //   paymentArray.push({createdAt, source, totalPrice});
        // });

        console.log('paymentArray: ', paymentArray);

        // const paymentCreatedAt = paymentData? paymentData.createdAt? moment(getTheDate(paymentData.createdAt)).format('YYYY-MM-DD'):" ": " ";

        // paymentCreatedAt && paymentArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        // if (paymentCreatedAt){
        //   if(paymentFreezeArray.length>0 && paymentFreezeArray[paymentFreezeArray.length-1].userId === user.id){
        //     paymentFreezeArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        //   }
        //   else{
        //     paymentFreezeArray.push({userId: user.id, paymentCreatedAt:paymentCreatedAt});
        //   }
        // }

        // console.log('paymentData: ', paymentData);
        // console.log('paymentArray: ', paymentArray);

        // var paymentData = "250, adyen";

        const userData = [
          user.id,
          autoMembershipStarts ? moment(getTheDate(autoMembershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'): ' ',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.email ? data.email : '',
          data.name ? data.name : '',
          data.phone ? data.phone : '',
          packageName,
          data.remarks ? data.remarks : '',
          // for every month payment status
          // paymentData
          // paymentCreatedAt
        ];

        if (autoMembershipStarts && autoMembershipEnds && paymentData && paymentData.createdAt){
          users.push(userData);
        }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    // users.sort((a,b)=>{
    //   var dateA = new Date(a[18]);
    //   var dateB = new Date(b[18]);
    //   if (dateA < dateB) {return -1}
    //   if (dateA > dateB) {return 1}
    //   return 0;
    // });

    var userMap = {};
    usersResults && usersResults.forEach(user=>{
      if (user && user.data()){
        userMap[user.id]=user.data();
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `USER PAYMENT MEMBERSHIP!A2:AG`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        // users: users,
        // theResponse
        // userCount
      });
    });
  });
});

// cron job to add visitors to sheet
exports.addVisitorsToSheet = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var users = [];
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        // const membershipStarts = data.membershipStarts? data.membershipStarts:null;
        const membershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null;

        if (!membershipStarts){

          const userData = [
            data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : null,
            data.index ? data.index:'',
            user.id,
            data.membershipCard ? data.membershipCard : '',
            data.gantnerCardNumber ? data.gantnerCardNumber : '',
            data.name ? data.name : '',
            data.firstName ? data.firstName : '',
            data.lastName ? data.lastName : '',
            data.nric ? data.nric : '',
            data.passport ? data.passport : '',
            data.nationality ? data.nationality : '',
            data.race ? data.race : '',
            data.gender ? data.gender : '',
            data.phone ? data.phone : '',
            data.email ? data.email : '',
            data.mcId ? data.mcId : '',
            data.packageId ? data.packageId : '',
            data.paymentMode ? data.paymentMode : '',
            membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
            membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
            autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
            data.autoDiff ? data.autoDiff : '',
            data.freeMonths ? data.freeMonths : '',
            data.freePT ? data.freePT : '',
            data.freeGift ? data.freeGift : '',
            data.referredByUserId ? data.referredByUserId : '',
            data.trainerId ? data.trainerId : '',
            data.inductionDate ? moment(getTheDate(data.inductionDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
            data.inductionDone ? data.inductionDone : '',
            data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD') : '',
            data.cancellationReason ? data.cancellationReason : '',
            data.remarks ? data.remarks : ''
          ];

          users.push(userData);
        }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    users.sort((a,b)=>{
      var dateA = a[0];
      var dateB = b[0];
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO VISITORS!A2:AG`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        users: users,
        // theResponse
        // userCount
      });
    });
  });
});
// cron job to add users to sheets for 3 month promo
exports.addUsers3MonthPromoToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const usersQuery = admin.firestore().collection('users').where('promoJan2020', '<=', 4).get();

  return Promise.all([usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var users = [];
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
        const cancelledMember = data.cancellationDate? true:false;
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.membershipEnds? data.membershipEnds: null;
        const autoMembershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:null;
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        // const membershipEndsMoment = membershipEnds && moment(membershipEnds.toDate());
        // console.log('membershipEndsMoment123: ', membershipEndsMoment);
        const isExpiredMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().subtract(3, 'months')); 
        const membershipStarts = data.membershipStarts? data.membershipStarts:null;

        const userData = [
          data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : null,
          data.index ? data.index:'',
          user.id,
          data.membershipCard ? data.membershipCard : '',
          data.gantnerCardNumber ? data.gantnerCardNumber : '',
          data.name ? data.name : '',
          data.firstName ? data.firstName : '',
          data.lastName ? data.lastName : '',
          data.nric ? data.nric : '',
          data.passport ? data.passport : '',
          data.nationality ? data.nationality : '',
          data.race ? data.race : '',
          data.gender ? data.gender : '',
          data.phone ? data.phone : '',
          data.email ? data.email : '',
          data.mcId ? data.mcId : '',
          data.packageId ? data.packageId : '',
          data.paymentMode ? data.paymentMode : '',
          membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.referredByUserId ? data.referredByUserId : '',
          data.trainerId ? data.trainerId : '',
          data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.cancellationReason ? data.cancellationReason : '',
          data.promoJan2020 ? data.promoJan2020 : '',
          data.remarks ? data.remarks : '',
        ];

        if (membershipStarts){
          users.push(userData);
        }
      }
    });

    // users.sort((a,b) => moment(a.membershipStarts).format('YYYYMMDD') - moment(b.membershipStarts).format('YYYYMMDD'));
    users.sort((a,b)=>{
      var dateA = new Date(a[18]);
      var dateB = new Date(b[18]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `3M PROMO USERS!A2:AG`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        users: users,
        // theResponse
        // userCount
      });
    });
  });
});


// script to add complimentary promo to user collections
// 1. get all active member
// 2. get all payment for the active user, check if user has made any payment. if there is no payment record found, group inside complimentary_promo
exports.addComplimentaryPromoFieldToUser = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();
  const paymentsQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();

  return Promise.all([usersQuery, paymentsQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const paymentResults = result[1];
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var paymentsMap = {};
    var paymentUserMap = {};
    paymentResults.forEach(payment=>{
      const data = payment.data();
      const type = data.type||null;
      const userId = data.userId||null;
      // const userData = users[userId]||null;
      const source = data.source||null;
      const vendProductId = data.vendProductId||null;
      const createdAt = data.createdAt;
      if (userId && (vendProductId === 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7') && type === 'membership' && moment(getTheDate(createdAt)).isSameOrAfter(moment('20191201'))){
        // paymentsMap[userId]=true;
        // paymentsMap[payment.id];
        paymentsMap[payment.id] = data;
        paymentUserMap[userId] = true;
      }
    });

    // console.log('paymentsMap: ', paymentsMap);
    // console.log('paymentUserMap: ',paymentUserMap);

    // var users = {};
    var users = [];
    usersResults.forEach((user, id)=>{
      if (user && user.data()){
        const data = user.data();
        // const membershipEnds = data.membershipEnds? data.membershipEnds: (data.autoMembershipEnds? data.autoMembershipEnds:null)
        const membershipEnds = data.autoMembershipEnds? data.autoMembershipEnds: (data.membershipEnds? data.membershipEnds:null)
        const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
        const isActiveMember = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));
        const membershipStarts = data.membershipStarts? data.membershipStarts:data.autoMembershipStarts?data.autoMembershipStarts:null;
        const isCancel = data.cancellationDate? true:false;
        // console.log('payment[id]: ', paymentsMap[id]? paymentsMap[id]: null);
        //if (paymentUserMap[id]){
          //console.log('paymentUserMap2: ', paymentUserMap);

          // users[user.id] = user.data();
          const userData = [
            data.joinDate ? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : null,
            user.id,
            data.membershipCard ? data.membershipCard : '',
            data.gantnerCardNumber ? data.gantnerCardNumber : '',
            data.name ? data.name : '',
            // data.firstName ? data.firstName : '',
            // data.lastName ? data.lastName : '',
            data.nric ? data.nric : '',
            data.passport ? data.passport : '',
            data.nationality ? data.nationality : '',
            data.race ? data.race : '',
            data.gender ? data.gender : '',
            data.phone ? data.phone : '',
            data.email ? data.email : '',
            data.packageId ? data.packageId : '',
            membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
            membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
            data.promoJan2020 ? data.promoJan2020 : '',
            data.complimentaryPromo? data.complimentaryPromo: null,
            data.remarks ? data.remarks : '',
          ];

          if (data.complimentaryPromo){
            users.push(userData);
          }
          
        // }
        // else{
        //   users.push(["saya"]);
        // }
      }
    });
    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `COMPLIMENTARY PROMO!A2:AG`,
            majorDimension: "ROWS",
            values: users
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },

    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        users: users,
        // theResponse
        // userCount
      });
    });

    // return res.status(200).send({
    //   success:true,
    //   userSize: Object.keys(users).length,
    //   paymentSize: Object.keys(payments).length,
    //   users: users,
    //   payments
    // });
  });
});


// exports.addComplimentaryPayment = functions.https.onRequest((req, res) => {

//   const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
//   // where('email', '==', 'tehowny@gmail.com').get();
//   const packagesQuery = admin.firestore().collection('packages').get();
//   const usersQuery = admin.firestore().collection('users').get();

//   return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
//     var batch = admin.firestore().batch();
//     const paymentResults = result[0];
//     const packagesResults = result[1];
//     const userResults = result[2];

//     var packageMap = {};
//     packagesResults.forEach(doc=>{
//       const data = doc.data();
//       packageMap[doc.id] = data;
//     });

//     var userMap = {};
//     userResults.forEach(doc=>{
//       const data = doc.data();
//       if (data){
//         userMap[doc.id] = data;
//       }
//     });

//     var payments = [];
//     paymentResults.forEach(payment=>{
//       if (payment && payment.data()){
//         const data = payment.data();
//         const createdAt = data.createdAt? data.createdAt:null;
//         const userId = data.userId? data.userId:null;
//         const userData = userId ? userMap[userId]:null;
//         const userName = userData? userData.name? userData.name : " " : " ";
//         const userEmail = userData? userData.email? userData.email: " " : " ";
//         const invoiceId = data.invoiceId? data.invoiceId:" ";
//         // const packageId = data.packageId? data.packageId:" ";
//         const quantity = data.quantity? data.quantity:1;
//         const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
//         const source = data.source? data.source:" ";
//         const status = data.status? data.status:" ";
//         const totalPrice = data.totalPrice? data.totalPrice:0;
//         const type = data.type? data.type:" ";
//         const transactionId = data.transactionId? data.transactionId:" ";
//         const vendProductId = data.vendProductId? data.vendProductId:" ";
//         const vendSaleId = data.vendSaleId? data.vendSaleId:" ";
//         const detailName = data.detailName? data.detailName:" ";
//         const productName = data.productName? data.productName:" ";
//         const complimentaryPromo = userData? userData.complimentaryPromo? userData.complimentaryPromo : "null" : "null";
//         // const packageData = packageId ? packageMap[packageId] : " ";
//         // const packageName = packageData && packageData.name? packageData.name:" ";

//         if (vendProductId === "b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7"){
//           const paymentData = [
//             createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
//             userEmail,
//             userName,
//             quantity,
//             renewalTerm,
//             source,
//             status,
//             totalPrice,
//             type,
//             userId,
//             // vendProductId,
//             vendSaleId,
//             complimentaryPromo
//           ];
//           payments.push(paymentData);
//         }
//       }
//     });

//     payments.sort((a,b)=>{
//       var dateA = new Date(a[0]);
//       var dateB = new Date(b[0]);
//       if (dateA < dateB) {return -1}
//       if (dateA > dateB) {return 1}
//       return 0;
//     });

//     // console.log('payments: ', payments);

//     const updateSheetPromise = updateGoogleSheet({
//       spreadsheetId: CONFIG_SHEET_ID,
//       resource: {
//         // How the input data should be interpreted.
//         valueInputOption: 'RAW',  // TODO: Update placeholder value.
//         // The new values to apply to the spreadsheet.
//         data: [
//           {
//             range: `ALL COMPLIMENTARY PAYMENT!A2:AG`,
//             majorDimension: "ROWS",
//             values: payments
//           }
//         ],  // TODO: Update placeholder value.
  
//         // TODO: Add desired properties to the request body.
//       },
//     });

//     return updateSheetPromise.then((result)=>{
//       // console.log('theresult: ', result);
//       return res.status(200).send({
//         success:true,
//         data: 'data',
//         payments: payments,
//       });
//     });
//   });
// });

exports.appendVTPaymenttospreadsheet = functions.firestore
  .document('payments/{paymentId}')
  .onWrite((change, context)=>{

    const paymentId = change.after.id;
    const document = (change.after && change.after.exists) ? change.after.data() : null;
    
    if (!document){
      return Promise.resolve();
    }

    const userId = document.userId? document.userId:'';
    const source = document.source;
    const totalPrice = document.totalPrice;
    const type = document.type;
    const createdAt = document.createdAt? moment(document.createdAt).format('YYYY-MM-DD'):'';
    const invoiceId = document.invoiceId? document.invoiceId:'';
    const packageId = document.packageId? document.packageId:'';
    // const packageName = packageId? packages[packageId].name : '';
    const status = document.status? document.status:'';
    const quantity = document.quantity? document.quantity:1;
  
    if (type === 'virtualTraining'){
      const paymentData = [
        paymentId,
        createdAt,
        source,
        type,
        status,
        quantity, 
        totalPrice,
        userId,
        invoiceId,
      ];
      console.log('paymentData: ', paymentData);

      const sheetValue = getGoogleSheet({
        spreadsheetId: CONFIG_SHEET_ID,
        resource: {
          // How the input data should be interpreted.
          valueInputOption: 'RAW',  // TODO: Update placeholder value.
    
          // The new values to apply to the spreadsheet.
          data: [
            {
              range: `AUTO VIRTUAL PAYMENT!A2:T`,
              majorDimension: "ROWS",
              // values: payments
            }
          ],  // TODO: Update placeholder value.
    
          // TODO: Add desired properties to the request body.
        },
      });
      console.log('sheetValue: ', sheetValue);
    }
    return Promise.resolve();
});

// todo: add invoice to the sheet (not in bulk) -update row by row. 31/8/2020
exports.addPromoInvoicetospreadsheet = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const invoiceQuery = admin.firestore().collection('invoices').where('isPromo', '==', true).get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users').get();

  return Promise.all([invoiceQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const invoiceResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    var userMap = {};
    userResults.forEach(doc=>{
      const data = doc.data();
      if (data){
        userMap[doc.id] = data;
      }
    });

    var invoices = [];
    invoiceResults.forEach(invoice=>{
      if (invoice && invoice.data()){
        const data = invoice.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const promoType = data.promoType? data.promoType:null;
        const userId = data.userId? data.userId:null;
        const userData = userId ? userMap[userId]:null;
        const userName = userData? userData.name? userData.name : " " : " ";
        const userEmail = userData? userData.email? userData.email: " " : " ";
        const phone = userData? userData.phone? userData.phone: " " : " ";
        const mcId = userData? userData.mcId? userData.mcId: " ": " ";
        const invoiceId = invoice.id? invoice.id:" ";
        const packageId = data.packageId? data.packageId:" ";
        const packageData = packageId? packageMap[packageId]:" ";
        const packageName = packageData? packageData.name? packageData.name:" ":" ";

        const paid = data.paid? data.paid:false;
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const amount = data.amount? data.amount:0;
        const type = data.type? data.type:" ";
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const vendProductName = data.vendProductName? data.vendProductName: " ";

        const invoiceData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('HH:mm:ss') : '',
          promoType,
          userName,
          userEmail,
          invoiceId,
          phone,
          mcId,
          packageId,
          packageName,
          paid,
          totalPrice,
          amount,
          type,
        ];
        invoices.push(invoiceData);
      }
    });

    invoices.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: CONFIG_SHEET_ID,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO MEMBERSHIP PROMO PAYMENT!A2:V`,
            majorDimension: "ROWS",
            values: invoices
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        data: 'data',
        invoices: invoices,
      });
    });
  });
});

function getGoogleSheet(requestWithoutAuth) {
  return new Promise((resolve, reject) => {
    return getAuthorizedClient().then((client) => {
      const sheets = google.sheets('v4');
      const request = requestWithoutAuth;
      request.auth = client;
      console.log('client request getGoogleSheet: ', client);
      return sheets.spreadsheets.values.get(request);

    }).catch(error=>{
      console.log('updateGoogleSheeterror: ', error);
      return reject(error);
    })
  });

  // Sheets.Spreadsheets.Values.batchUpdate(resource, spreadsheetId);
}

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * Sharp.
 */
exports.generateThumbnail = functions.storage.object().onFinalize((object) => {

  const gcs = require('@google-cloud/storage')();
  const path = require('path');
  const sharp = require('sharp');
  const _ = require('lodash');

  const SIZES = [64, 256, 512, 1024, 2048];

  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    const fileNameParts = fileName.split('_');
    const fileNameEnd = fileNameParts[fileNameParts.length-1];
    const imagePath = `images/${fileNameEnd}`;
    console.log('Already a Thumbnail.', fileName, imagePath);

    return null;

    // var updates = {};
    // var propertyToUpdate = null;
    // if(fileName.startsWith('thumb_64_')){
    //   propertyToUpdate = 'thumb_64';
    // }else if(fileName.startsWith('thumb_128_')){
    //   propertyToUpdate = 'thumb_128';
    // }else if(fileName.startsWith('thumb_256_')){
    //   propertyToUpdate = 'thumb_256';
    // }else if(fileName.startsWith('thumb_512_')){
    //   propertyToUpdate = 'thumb_512';
    // }else if(fileName.startsWith('thumb_1024_')){
    //   propertyToUpdate = 'thumb_1024';
    // }else if(fileName.startsWith('thumb_2048_')){
    //   propertyToUpdate = 'thumb_2048';
    // }
    //
    // updates[propertyToUpdate] = object.mediaLink;
    // const userQueryPromise = admin.firestore().collection('users').where('imagePath', '==', imagePath).limit(1).get();
    // const classQueryPromise = admin.firestore().collection('classes').where('imagePath', '==', imagePath).limit(1).get();
    //
    // return Promise.all([userQueryPromise, classQueryPromise]).then(results=>{
    //   const userDoc = results[0] && results[0].docs && results[0].docs.length > 0 ? results[0].docs[0].ref : null;
    //   const classDoc = results[1] && results[1].docs && results[1].docs.length > 0 ? results[1].docs[0].ref : null;
    //   if(userDoc){
    //     return userDoc.update(updates);
    //   }else if(classDoc){
    //     return classDoc.update(updates);
    //   }
    //     return null;
    // });

  }

  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);

  const metadata = {
    contentType: 'image/jpeg',
  };

  var resizePromises = [];
  _.each(SIZES, (size) => {

    const thumbFileName = `thumb_${size}_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Create write stream for uploading thumbnail
    const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({metadata});

    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
    const pipeline = sharp();
    pipeline
      .jpeg({
        progressive:true
      })
      .resize(size, size)
      .max()
      .pipe(thumbnailUploadStream);

    bucket.file(filePath).createReadStream().pipe(pipeline);

    const streamAsPromise = new Promise((resolve, reject) =>
      thumbnailUploadStream.on('finish', resolve).on('error', reject));

    resizePromises.push(streamAsPromise);
  })
  // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.

  return Promise.all(resizePromises).then(() => {
    console.log('Thumbnails created successfully');
    return null;
  });

});


//Adyen Payments
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
// const cors = require("cors");
const CryptoJS = require("crypto-js");
const base64 = require("base-64");
const { PaymentInstrumentType } = require('@adyen/api-library/dist/lib/src/typings/terminal');
const APIKey = 'AQElhmfuXNWTK0Qc+iSSk2Y9q9CeW59vbxshCZshV1EXTAGefxgJhxDBXVsNvuR83LVYjEgiTGAH-R6kuIqL+550D1qTX5kJZCc2qwiPqT3x46lzQOEudnjo=-t3wZv9F8d36xGKqJ';
const checkoutPath = 'https://12ed7539c396525e-BabelTestB-checkout-live.adyenpayments.com/checkout/';
const paymentPath = 'https://12ed7539c396525e-BabelTestB-pal-live.adyenpayments.com/pal/servlet/Payment/';
const recurringPath = 'https://12ed7539c396525e-BabelTestB-pal-live.adyenpayments.com/pal/servlet/Recurring/';
const paymentMethod = 'https://4a2ad753ebda1f37-BabelTestB-checkout-live.adyenpayments.com/checkout/';
// for test adyen account
const capturePayment = `https://pal-test.adyen.com/pal/servlet/Payment/V52/capture`;

const corsFn = cors({ origin: true });

exports.captureAdyenPayment = functions.https.onRequest((req, res) => {
  const cors = require("cors");
  const corsFunction = cors({ origin: true });
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
    return corsFunction(req, res, () => {
        if (req.method === 'POST') {
            console.info('capture Session Body:', req.body);
            const option = {
                uri: capturePayment,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: {
                    amount: {
                        value: req.body.data.amount.value,
                        currency: req.body.data.amount.currency
                    },
                    additionalData:{
                        "executeThreeD":"true"
                     },
                    reference: req.body.data.reference,
                    merchantAccount: req.body.data.merchantAccount,
                    shopperReference: req.body.data.shopperReference,
                    channel: 'Web',
                    html: true,
                    origin: req.body.data.origin,
                    returnUrl: req.body.data.returnUrl,
                    countryCode: req.body.data.countryCode,
                    enableRecurring: req.body.data.enableRecurring,
                    enableOneClick: req.body.data.enableOneClick,
                    sdkVersion: req.body.data.sdkVersion
                },  
                json: true
            };
            console.log('paymentOption: ', option);
            request(option, (error, response, body) => {
                res.contentType('application/json');

                console.log('theresponse: ', response);

                if (!response){
                  res.send({ 'paymentSession': 'no response' });
                }
                else if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);

                    console.log('Info:', {data:body});
                    console.log('paymentResponse: ', response);
                    console.log('paymentBody: ', body);
                    res.json(response.statusCode, {data:body});
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ 'paymentSession': 'Fail in creating payment session' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});

exports.createPaymentSession = functions.https.onRequest((req, res) => {
  const cors = require("cors");
  const corsFunction = cors({ origin: true });
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
    return corsFunction(req, res, () => {
        if (req.method === 'POST') {
            const endPoint = 'v32/paymentSession';
            console.info('Payment Session Body:', req.body);
            const option = {
                uri: checkoutPath + endPoint,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: {
                    amount: {
                        value: req.body.data.amount.value,
                        currency: req.body.data.amount.currency
                    },
                    additionalData:{
                        "executeThreeD":"true"
                     },
                    reference: req.body.data.reference,
                    merchantAccount: req.body.data.merchantAccount,
                    shopperReference: req.body.data.shopperReference,
                    channel: 'Web',
                    html: true,
                    origin: req.body.data.origin,
                    returnUrl: req.body.data.returnUrl,
                    countryCode: req.body.data.countryCode,
                    enableRecurring: req.body.data.enableRecurring,
                    enableOneClick: req.body.data.enableOneClick,
                    sdkVersion: req.body.data.sdkVersion
                },  
                json: true
            };
            console.log('paymentOption: ', option);
            request(option, (error, response, body) => {
                res.contentType('application/json');

                // console.log('theresponse: ', response);

                if (!response){
                  res.send({ 'paymentSession': 'no response' });
                }
                else if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);

                    console.log('Info:', {data:body});
                    console.log('paymentResponse: ', response);
                    console.log('paymentBody: ', body);
                    res.json(response.statusCode, {data:body});
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ 'paymentSession': 'Fail in creating payment session' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});

exports.makePaymentDropIn = functions.https.onRequest((req, res) => {
  const cors = require("cors");
  const corsFunction = cors({ origin: true });
  const timestamp = admin.firestore.FieldValue.serverTimestamp();
    return corsFunction(req, res, () => {
      if (req.method === 'POST') {
        console.log(req.body.payload);
        const endPoint = 'v52/payments';

      }
      res.send('makepaymenttest: ', );
    });
});

exports.getPaymentResult = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
        if (req.method === 'POST') {
            console.log(req.body.payload);
            const endPoint = 'v32/payments/result';
            const paymentBody = {
                url: checkoutPath + endPoint,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: JSON.stringify({
                    'payload': req.body.payload
                })
            };
            request(paymentBody, function (error, response, body) {
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    res.status(response.statusCode).send(body);
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ paymentSession: 'Error' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});

exports.getAdyenPaymentMethods = functions.https.onRequest((req, res) => {
  return corsFn(req, res, () => {
    const body = {
      "merchantAccount": "BabelTestBFIT",
      "countryCode": "MY",
      "amount": {
        "currency": "MYR",
        "value": 0
      },
      "channel": "Web",
      "shopperLocale": "en-US"
    }

    if (req.method === 'GET') {
        console.log('getAdyenPaymentMethodsBody: ', req.body);
        const endPoint = 'v49/paymentMethods';
        const paymentMethodBody = {
            url: checkoutPath + endPoint,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-API-Key': APIKey,
            },
            body: Object.assign({}, body),
            json: true
        };
        console.log('paymentMethodBody: ', paymentMethodBody);
        request(paymentMethodBody, function (error, response, body) {
          res.contentType('application/json');
          console.log('getAdyenPaymentMethodsError: ', error);
            if (response.statusCode === 200) {
                console.log('Status:', response.statusCode, response.statusMessage);
                res.status(response.statusCode).send(body);
            }
            else {
                console.log('Status:', response.statusCode, response.statusMessage);
                console.log('Error:', error);
                console.log('Info:', body);
                res.status(response.statusCode).send({ paymentSession: 'Error' });
            }
            res.status(200).send('OK');
        });
    }
  });
});

exports.authoriseRecurringPayment = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
        if (req.method === 'POST') {
            const endPoint = 'authorise';
            console.info('Payment Session Body:', req.body);
            const option = {
                uri: paymentPath + endPoint,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: Object.assign({}, req.body),
                json: true
            };
            console.log(option);
            request(option, (error, response, body) => {
                res.contentType('application/json');
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    res.status(response.statusCode).send(body);
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ 'recurringPayment': 'Fail in authorising recurring payment' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});

exports.listRecurringDetails = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
      const endPoint = 'listRecurringDetails';
      // shopperReference is userId
      const body = {
        "shopperReference": "I8imxoiVYadUWHP7p0a9QpkQWDQ2",
        "merchantAccount": "BabelTestBFIT"
      }
      console.info('Payment Session Body:', body);
      const option = {
          uri: recurringPath + endPoint,
          method: 'POST',
          headers: {
              'content-type': 'application/json',
              'x-API-Key': APIKey,
          },
          body: Object.assign({}, body),
          json: true
      };
      console.log(option);
      request(option, function (error, response, body) {
          res.contentType('application/json');
          if (response.statusCode === 200) {
              console.log('Status:', response.statusCode, response.statusMessage);
              res.status(response.statusCode).send(body);
          }
          else {
              console.log('Status:', response.statusCode, response.statusMessage);
              console.log('Error:', error);
              console.log('Info:', body);
              res.status(response.statusCode).send({ 'recurringPayment': 'Fail in authorising recurring payment' });
          }
      });
    });
});
// For ecwid
exports.createPaymentSession_Ecwid = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
        if (req.method === 'POST') {
            const endPoint = 'v32/paymentSession';
            console.info('Payment Session Body:', req.body);
            const option = {
                uri: checkoutPath + endPoint,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: {
                    amount: {
                        value: req.body.amount.value,
                        currency: req.body.amount.currency
                    },
                    additionalData: {
                        executeThreeD: true
                    },
                    reference: req.body.reference,
                    merchantAccount: req.body.merchantAccount,
                    shopperReference: req.body.shopperReference,
                    channel: 'Web',
                    html: true,
                    origin: req.body.origin,
                    returnUrl: req.body.returnUrl,
                    countryCode: req.body.countryCode,
                    enableRecurring: req.body.enableRecurring,
                    sdkVersion: '1.3.2'
                },
                json: true
            };
            console.log(option);
            request(option, function (error, response, body) {
                res.contentType('application/json');
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    res.status(response.statusCode).send(body);
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ 'paymentSession': 'Fail in creating payment session' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});
exports.getPaymentResult_Ecwid = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
        if (req.method === 'POST') {
            console.log(req.body.payload);
            const endPoint = 'v32/payments/result';
            const paymentBody = {
                url: checkoutPath + endPoint,
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-API-Key': APIKey,
                },
                body: JSON.stringify({
                    'payload': req.body.payload
                })
            };
            request(paymentBody, function (error, response, body) {
                if (response.statusCode === 200) {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    res.status(response.statusCode).send(body);
                }
                else {
                    console.log('Status:', response.statusCode, response.statusMessage);
                    console.log('Error:', error);
                    console.log('Info:', body);
                    res.status(response.statusCode).send({ paymentSession: 'Error' });
                }
            });
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});
exports.getEcwidData = functions.https.onRequest((req, res) => {
    return corsFn(req, res, () => {
        if (req.method === 'POST') {
            let secretKEy = 'payment-app-secret-key';
            let data = req.body;
            let data1 = data.replace('-', '_');
            let data2 = data1.replace('+', '/');
            let encryptKey = secretKEy.substring(0, 16);
            let decodeData = base64.decode(data2);
            console.log("Decode:", decodeData);
            let iv = decodeData.substr(0, 16);
            let payload = decodeData.substr(16);
            console.log("Payload:", payload);
            let bytes = CryptoJS.AES.decrypt(payload, encryptKey, { iv: iv });
            console.log(bytes);
            console.log(bytes.toString(CryptoJS.enc.Utf8));
            //    const mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
            //  let mystr = mykey.update(data, 'hex', 'utf8')
            //mystr += mykey.final('utf8');
            //console.log(mystr);
            //res.send(mystr);
            /*
                        let payload = data.substring(16);

                        let decoded = base64.decode(data);

                        console.log(secretKey);
                        console.log(data);

                        console.log(decoded);
            */
            // Decrypt
            /*  let bytes = CryptoJS.AES.decrypt(data, secretKey, {iv:data.substring(0,16), mode:CryptoJS.mode.CBC});
              console.log(bytes);
              console.log(bytes.toString(CryptoJS.enc.Base64));

              //let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

             // console.log(decryptedData);
              res.send(bytes);*/
        }
        else {
            res.status(500).send('Invalid request method');
        }
    });
});

exports.addAdyenTransaction = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  // console.log("Begin transaction request");
  // console.log(req);
  // const original = req.query.text;
  var transactionData = JSON.parse(JSON.stringify(req.body));
  const notificationItem = transactionData.notificationItems && transactionData.notificationItems.length > 0 && transactionData.notificationItems[0];
  const notificationRequestItem = notificationItem && notificationItem.NotificationRequestItem;
  const pspReference = notificationRequestItem.pspReference;
  const invoiceId = notificationRequestItem.merchantReference;
  const eventCode = notificationRequestItem.eventCode;
  const success = notificationRequestItem.success;

  // console.log("Data", transactionData);
  console.log("Notification", notificationItem);
  // const response = transactionData.response;
  // const invoiceId = notificationItem && notificationItem.NotificationRequestItem && notificationItem.NotificationRequestItem.merchantReference;
  // const timestamp = admin.firestore.FieldValue.serverTimestamp();
  // transactionData.createdAt = timestamp;
  //
  return admin.firestore().collection('adyTransactions').doc(pspReference).set(transactionData).then((docRef) => {
    res.status(200).send({
    	"notificationResponse" : "[accepted]"
    });

    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    if(invoiceId && invoiceId.length > 0){
      console.log('Added transaction for invoice', pspReference, invoiceId, eventCode, success);
      if(eventCode === 'AUTHORISATION'){
        if(success === 'true'){
          return admin.firestore().collection('invoices').doc(invoiceId).update({paid:true, paymentFailed:false, paymentId:null, transactionId:pspReference});
        }else{
          return admin.firestore().collection('invoices').doc(invoiceId).update({paid:false, paymentFailed:true, paymentId:null, transactionId:pspReference});
        }

      }else{
        // return res.redirect(303, `https://app.babel.fit/payments/${invoiceId}`);
      }
    }else{
      // return res.redirect(303, 'https://app.babel.fit/');
    }

    return null;

    //mark invoice as paid
  });
});

exports.modifyAdyTransaction = functions.firestore
  .document('adyTransactions/{transactionId}')
  .onWrite((change, context) => {
    const data = change.after.data();
    if(!data){
      //deleted
      return Promise.resolve();
    }
    const notificationItem = data.notificationItems && data.notificationItems.length > 0 && data.notificationItems[0];
    const notificationRequestItem = notificationItem && notificationItem.NotificationRequestItem;
    const invoiceId = notificationRequestItem.merchantReference;
    const eventCode = notificationRequestItem.eventCode;
    const createdAt = notificationRequestItem.eventDate;
    const success = notificationRequestItem.success;
    const authorized = (success === 'true' && eventCode === 'AUTHORISATION') ? true : false;
    console.log('Modifying transactionId for invoiceId', change.after.id, invoiceId, data);
    if(!authorized){
      console.log('Not Authorization/Authorized');
      //if refunded
      if(eventCode === 'REFUND'){
        console.log('Is Refund');
        //get invoice
        const invoiceQuery = admin.firestore().collection('invoices').doc(invoiceId).get();
        return invoiceQuery.then(doc=>{
          const data = doc.data();
          const paymentId = data && data.paymentId;
          if(paymentId){
            //set payment as refunded
            const batch = admin.firestore().batch();

            const invoiceRef = admin.firestore().collection('invoices').doc(invoiceId);
            batch.update(invoiceRef, {refunded:true});

            const paymentRef = admin.firestore().collection('payments').doc(paymentId);
            batch.update(paymentRef, {status:'REFUNDED'});

            console.log('Refunding invoiceId paymentId', invoiceId, paymentId);

            return batch.commit();
          }else{
            return null;
          }

        })
      }else{
        return null;
      }

    }
    if(!invoiceId){
      console.log(`Transaction has no invoiceId ${change.after.id}`);
      return Promise.reject(new Error(`Transaction has no invoiceId ${change.after.id}`));
    }

    //retrieve invoice and packages
    const invoiceQuery = admin.firestore().collection('invoices').doc(invoiceId).get();
    const packagesQuery = admin.firestore().collection('packages').get();

    return Promise.all([invoiceQuery, packagesQuery]).then(results=>{
      const invoiceDoc = results[0];
      const packagesResults = results[1];
      const freezeVendId = 'a3be38de-934f-aa1c-7f69-89f8fcc16f4a';

      var packageMap = {};
      var productIdPackageMap = {};
      packagesResults.forEach(doc=>{
        const data = doc.data();
        packageMap[doc.id] = data;

        const vendProductIds = data && data.vendProductIds;
        vendProductIds && vendProductIds.map(vendProductId=>{
          productIdPackageMap[vendProductId] = doc.id;
          return null;
        });
      });

      if(invoiceDoc.exists){
        const invoiceData = invoiceDoc.data();
        const paid = invoiceData.paid;
        const paymentId = invoiceData.paymentId;

        if(paid && paymentId && authorized){
          console.log(`Invoice already paid ${invoiceDoc.id}`);
          return Promise.resolve();
        }

        const userId = invoiceData.userId;
        const totalPrice = invoiceData.totalPrice;
        const vendProductId = invoiceData.vendProductId;
        var vendProductPackageId = productIdPackageMap[invoiceData.vendProductId];
        if(!vendProductId){
          const vendProducts = invoiceData.vendProducts;
          // console.log("VPS", vendProduct);
          vendProducts && vendProducts.forEach(vendProduct=>{
            // console.log("VP", vendProduct);
            const vendProductId = vendProduct.vendProductId;
            if(!vendProductPackageId){
              vendProductPackageId = productIdPackageMap[vendProductId];
            }
          });
        }
        const packageId = vendProductPackageId || invoiceData.packageId;
        const quantity = invoiceData.quantity ? invoiceData.quantity : 1;
        const packageData = packageId ? packageMap[packageId] : null;
        const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
        // const type = vendProductPackageId ? 'membership' : invoiceData.type;
        const type = (vendProductPackageId || (vendProductId === freezeVendId)) ? 'membership' : invoiceData.type;
        const promoType = invoiceData.promoType? invoiceData.promoType:null;
        const detailName = invoiceData.className;
        const detailDate = invoiceData.classDate;

        //add payment
        const batch = admin.firestore().batch();
        const paymentRef = admin.firestore().collection('payments').doc();
        var paymentData = {
          createdAt : createdAt,
          totalPrice : totalPrice ? totalPrice : 0,
          type : type,
          userId : userId,
          source : 'adyen',
          status : authorized ? 'CLOSED' : 'FAILED',
          transactionId : change.after.id,
          quantity : quantity,
          invoiceId : invoiceDoc.id
        }
        if (promoType){
          paymentData.promoType = promoType;
          // paymentData.productName = invoiceData && invoiceData.vendProductName;
          paymentData.productName = 'PROMO';
        }
        if ((type === 'product') && (vendProductId === unlimitedOutdoorClassVendProductId)){
          paymentData.productName = invoiceData.vendProductName;
          paymentData.vendProductId = vendProductId;
        }
        else if (type === 'babelDance'){
          paymentData.productName = invoiceData.vendProductName;
          paymentData.vendProductId = vendProductId;
          paymentData.classRemark = invoiceData.classRemark? invoiceData.classRemark:"";
          paymentData.city = invoiceData.city;
          paymentData.ighandlename = invoiceData.ighandlename;
          paymentData.phone = invoiceData.phone;
          paymentData.selectedMemberOption = invoiceData.selectedMemberOption;
          paymentData.instructorName = invoiceData.instructorName;
          paymentData.classDate = invoiceData.classDate;
          paymentData.classTime = invoiceData.classTime;
          paymentData.classId = invoiceData.classId;
        }
        else if(type === 'product'){
          paymentData.productName = invoiceData.vendProductName;
          paymentData.packageId = packageId;
          paymentData.renewalTerm = renewalTerm;
        }
        else if (type === 'virtualTraining'){
          paymentData.vendProductId = invoiceData.vendProductId;
          paymentData.productName = invoiceData.vendProductName;
          paymentData.selectedDay = invoiceData.selectedDay;
          paymentData.selectedAMPM = invoiceData.selectedAMPM;
          paymentData.trainerName = invoiceData.trainerName;
        }
        else if (type === 'virtualClass'){
          paymentData.vendProductId = invoiceData.vendProductId;
          paymentData.productName = invoiceData.vendProductName;
          paymentData.city = invoiceData.city;
          paymentData.ighandlename = invoiceData.ighandlename;
          paymentData.phone = invoiceData.phone;
          paymentData.selectedMemberOption = invoiceData.selectedMemberOption;
        }
        else if (type === 'onlinemywellness'){
          paymentData.vendProductId = invoiceData.vendProductId;
          paymentData.productName = invoiceData.vendProductName;
          paymentData.ighandlename = invoiceData.ighandleName || invoiceData.ighandlename;
          paymentData.phone = invoiceData.phone;
          paymentData.trainerName = invoiceData.trainerName;
          paymentData.coachName = invoiceData.coachName;
          paymentData.selectedDay = invoiceData.selectedDay;
          paymentData.selectedAMPM = invoiceData.selectedAMPM;
        }
        else if(type === 'personalTraining'){
          paymentData.vendProductId = invoiceData.vendProductId;
          // paymentData.appoinmentName = invoiceData.appoinmentName;
          // paymentData.appoinmentScheduleUrl = invoiceData.appoinmentScheduleUrl;
          // paymentData.appointmentType = invoiceData.appointmentType;
          // paymentData.calendarId = invoiceData.calendarId;
          // paymentData.selectedTime = invoiceData.selectedTime;
          paymentData.ptType = invoiceData.ptType;
          paymentData.credit = invoiceData.credit;
        }
        else if (type === 'membership' && vendProductId === freezeVendId){
          paymentData.freezeFor = invoiceData.freezeFor || createdAt;
          paymentData.source = 'freeze';
          paymentData.freezeSource = 'adyen';
        }
        // else if (type === 'membership' && (vendProductId === ))
        else if (type === 'membership'){
          paymentData.packageId = packageId;
          paymentData.renewalTerm = renewalTerm;
        }

        if(detailName){
          paymentData.detailName = detailName;
        }
        if(detailDate){
          paymentData.detailDate = detailDate;
        }
        console.log('Adding paymentData for transactionId and invoiceId', paymentData, change.after.id, invoiceId);
        batch.set(paymentRef, paymentData);

        // update the user credit?
        // batch.update(admin.firestore().collection('users').doc(userId).get(), {credit:invoiceData.credit});

        //mark invoice as paid
        batch.update(invoiceDoc.ref, {paid:authorized, paymentId:paymentRef.id, paymentFailed:!authorized});
        // const userRef = admin.firestore().collection('users').doc(userId)

        console.log("Saving invoice and payment for transaction", invoiceId, paymentRef.id, change.after.id);

        const babelAtHomeSheetUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addVbabelwellnessPaymentToSheets`;
        const vClassSheetUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addVClassPaymentToSheets`;
        const vPTSheetUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addVTPaymentToSheets`;
        const unlimitedClassUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addUnlimitedOutdoorPaymentToSheets`;
        const babelDanceClassUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addBabelDancePaymentToSheets`;
        const promoMembershipUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/addPromoInvoicetospreadsheet`;

        return batch.commit().then((res)=>{
          console.log('batchResult: ', res);
          // return Promise.resolve();
          const cors = require("cors");
          const corsFunction = cors({ origin: true });
          const timestamp = admin.firestore.FieldValue.serverTimestamp();
          var request = require("request");
          if (type === 'onlinemywellness'){
            return request.get(babelAtHomeSheetUrl);
          }
          else if (type === 'virtualClass'){
            return request.get(vClassSheetUrl)
          }
          else if (type === 'virtualTraining'){
            return request.get(vPTSheetUrl)
          }
          else if (type === 'babelDance'){
            return request.get(babelDanceClassUrl);
          }
          else if ((type === 'product') && (vendProductId === unlimitedOutdoorClassVendProductId)){
            return request.get(unlimitedClassUrl)
          }
          else if (promoType){
            return request.get(promoMembershipUrl);
          }
          else{
            // do nothing (not updating any sheets)
            return Promise.resolve();
          }
        });
      }else{
        console.log(`Issue with invoice: ${invoiceId} ${change.after.id}`);
        return Promise.reject(new Error(`Issue with invoice: ${invoiceId} ${change.after.id}`));
      }
    });
  }
);
