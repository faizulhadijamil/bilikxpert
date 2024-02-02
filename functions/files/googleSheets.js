const functions = require('firebase-functions');

const admin = require('firebase-admin');
const moment = require('moment-timezone');
const bilikXpertSheetId = '17HArdPF7zq3Yi0ivEQU1H-M25ICFDeDotYmGO2vQvco';
// write to spreadsheets

const CONFIG_CLIENT_ID = functions.config().googleapi.client_id;
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret;
// // setup for OauthCallback
const DB_TOKEN_PATH = '/api_tokens';
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');

const FUNCTIONS_REDIRECT = `https://us-central1-faizroom-36b74.cloudfunctions.net/googleSheets-oauthcallback`;

// OAuth token cached locally.
let oauthTokens = null;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: SCOPES,
// });
const functionsOauthClient = new OAuth2Client(CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET, FUNCTIONS_REDIRECT);

// visit the URL for this Function to request tokens
exports.authgoogleapi = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  res.redirect(functionsOauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  }));
});

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
exports.oauthcallback = functions.https.onRequest(async (req, res) => {
  res.set('Cache-Control', 'private, max-age=0, s-maxage=0');
  const code = req.query.code;
  try {
    const {tokens} = await functionsOauthClient.getToken(code);
    console.log('tokens: ', tokens);
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    await admin.database().ref(DB_TOKEN_PATH).set(tokens);
    return res.status(200).send('App successfully configured with new Credentials. '
        + 'You can now close this page.');
  } catch (error) {
    return res.status(400).send({error});
  }
});

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

  
exports.helloWorldSheets = functions.https.onRequest((req, res) => {
  // Retrieve the client_id from functions.config()
  const clientId = functions.config().googleapi.client_id;
  const clientSecret = functions.config().googleapi.client_secret;

  // console.log('Google API Client ID:', clientId);
  
  return res.status(200).send({
    success:true,
    clientId, clientSecret
  });
});

exports.getUsers = functions.https.onRequest((req, res) => {
  // todo:- post for user email or id
  const usersQuery = admin.firestore().collection('users').get();
  const branchQuery = admin.firestore().collection('branches').get();
  const roomQuery = admin.firestore().collection('rooms').get();

  return Promise.all([usersQuery, branchQuery, roomQuery]).then(results=>{
    const userRes = results[0];
    const branchRes = results[1];
    const roomRes = results[2];

    var branchMap = {};
    branchRes.forEach(doc=>{branchMap[doc.id]=doc.data()});
    var roomMap = {};
    roomRes.forEach(doc=>{roomMap[doc.id]=doc.data()});
    var croMapName = {};
    userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data.isStaff;
      const name = data.name;
      if (isStaff){
        croMapName[doc.id]=name;
      }
    });

    var userMap = {};
    var userDataArray = [];
    userRes.forEach(doc=>{
      const data = doc.data();
      const createdAt = data.createdAt;
      const email = data.email;
      const name = data.name;
      const phone = data.phone;
      const nric = data.nric;
      const gender = data.gender;
      const branch = data.branch;
      const branchData = branch && branchMap[branch];
      const branchName = branchData && branchData.name;
      const roomId = data.roomId;
      const roomData = roomId && roomMap[roomId];
      const roomName = roomData && roomData.name;
      const startDate = data.autoMembershipStarts;
      const endDate = data.autoMembershipEnds;
      const cancellationDate = data.cancellationDate;
      const mcId = data.mcId;
      const mcName = mcId && croMapName[mcId];
      const remarks = data.remarks;
      const monthlyPrice = roomData && roomData.monthlyPrice;
      const status = moment().tz('Asia/Kuala_Lumpur').isAfter(moment(getTheDate(endDate)))? 'OUTSTANDING':'ACTIVE';

      if (data){
        userMap[doc.id]=data;
        userDataArray.push([
          (createdAt && moment(getTheDate(createdAt)) && moment(getTheDate(createdAt)))?
          moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          doc.id, // userId
          email? email:'',
          name? name:'',
          phone? phone:'',
          nric? nric:'',
          gender? gender:'',
          branchName? branchName:'',
          roomName? roomName:'',
          (startDate && moment(getTheDate(startDate)) && moment(getTheDate(startDate)))?
          moment(getTheDate(startDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          (endDate && moment(getTheDate(endDate)) && moment(getTheDate(endDate)))?
          moment(getTheDate(endDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          (cancellationDate && moment(getTheDate(cancellationDate)) && moment(getTheDate(cancellationDate)))?
          moment(getTheDate(cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          monthlyPrice? monthlyPrice:'',
          mcName? mcName:'',
          remarks? remarks:'',
          status? status:''
        ]);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: bilikXpertSheetId,
      resource: {
        valueInputOption: 'RAW',  
        data: [
          {
            range: `All Users!A2:S`,
            majorDimension: "ROWS",
            values: userDataArray
          }
        ], 
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
      });
    }).catch(err=>{
      return res.status(200).send({success:false, err});
    });
  });
});

exports.getPayments = functions.https.onRequest((req, res) => {
  
  const usersQuery = admin.firestore().collection('users').get();
  const branchQuery = admin.firestore().collection('branches').get();
  const roomQuery = admin.firestore().collection('rooms').get();
  const paymentQuery = admin.firestore().collection('payments').get();

  return Promise.all([usersQuery, branchQuery, roomQuery, paymentQuery]).then(results=>{
    const userRes = results[0];
    const branchRes = results[1];
    const roomRes = results[2];
    const paymentRes = results[3];

    var branchMap = {};
    branchRes.forEach(doc=>{branchMap[doc.id]=doc.data()});
    var roomMap = {};
    roomRes.forEach(doc=>{roomMap[doc.id]=doc.data()});
    var croMapName = {};
    var userMap = {};
    userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data.isStaff;
      const name = data.name;
      userMap[doc.id] = data;
      if (isStaff){
        croMapName[doc.id]=name;
      }
    });

    var paymentArray = [];
    paymentRes.forEach(doc=>{
      const data = doc.data();
      const userData = data.userId && userMap[data.userId];
      const branchData = data.branchId && branchMap[data.branchId];
      const roomData = data.roomId && roomMap[data.roomId];
      const mcId = userData && userData.mcId;
      const croName = mcId && croMapName[mcId];

      if (data){
        paymentArray.push([
          (data.createdAt && moment(getTheDate(data.createdAt)) && moment(getTheDate(data.createdAt)))?
          moment(getTheDate(data.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          (data.transDate && moment(getTheDate(data.transDate)) && moment(getTheDate(data.transDate)))?
          moment(getTheDate(data.transDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          doc.id,
          data.invoiceId? data.invoiceId:'',
          data.userId? data.userId:'',
          userData? userData.name? userData.name:'':'',
          userData? userData.email? userData.email:'':'',
          userData? userData.phone? userData.phone:'':'',
          branchData? branchData.name? branchData.name:'':'',
          roomData? roomData.roomNumber? roomData.roomNumber:'':'',
          data.status? data.status:'',
          data.packages? data.packages:'',
          (data.startDate && moment(getTheDate(data.startDate)) && moment(getTheDate(data.startDate)))?
          moment(getTheDate(data.startDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'',
          (data.endDate && moment(getTheDate(data.endDate)) && moment(getTheDate(data.endDate)))?
          moment(getTheDate(data.endDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'',
          data.monthlyDeposit? data.monthlyDeposit:'',
          data.totalPrice? parseFloat(data.totalPrice).toFixed(2):'',
          data.paymentType? data.paymentType:'',
          data.imgURL? data.imgURL:'',
          data.remark? data.remark:'',
          croName? croName:''						
        ]);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: bilikXpertSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `All Payments!A2:T`,
            majorDimension: "ROWS",
            values: paymentArray
          }
        ],  // TODO: Update placeholder value.
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
      });
    }).catch(err=>{
      return res.status(200).send({success:false, err});
    });
  });
});

// this function will auto create all payments by months.
// Need to add manually first
exports.getPaymentsByMonth = functions.https.onRequest((req, res) => {
  
  let startOfTheMonth = moment().tz('Asia/Kuala_Lumpur').startOf('month');
  const monthName = startOfTheMonth.format('MMMM');
  const yearFormat = startOfTheMonth.format('YYYY');
  let startOfTheMonthDate = startOfTheMonth.toDate();

  const usersQuery = admin.firestore().collection('users').get();
  const branchQuery = admin.firestore().collection('branches').get();
  const roomQuery = admin.firestore().collection('rooms').get();
  const paymentQuery = admin.firestore().collection('payments').where('transDate', '>=', startOfTheMonthDate).get();
  

  return Promise.all([usersQuery, branchQuery, roomQuery, paymentQuery]).then(results=>{
    const userRes = results[0];
    const branchRes = results[1];
    const roomRes = results[2];
    const paymentRes = results[3];

    var branchMap = {};
    branchRes.forEach(doc=>{branchMap[doc.id]=doc.data()});
    var roomMap = {};
    roomRes.forEach(doc=>{roomMap[doc.id]=doc.data()});
    var croMapName = {};
    var userMap = {};
    userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data.isStaff;
      const name = data.name;
      userMap[doc.id] = data;
      if (isStaff){
        croMapName[doc.id]=name;
      }
    });

    var paymentArray = [];
    paymentRes.forEach(doc=>{
      const data = doc.data();
      const userData = data.userId && userMap[data.userId];
      const branchData = data.branchId && branchMap[data.branchId];
      const roomData = data.roomId && roomMap[data.roomId];
      const mcId = userData && userData.mcId;
      const croName = mcId && croMapName[mcId];

      if (data){
        paymentArray.push([
          (data.createdAt && moment(getTheDate(data.createdAt)) && moment(getTheDate(data.createdAt)))?
          moment(getTheDate(data.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          (data.transDate && moment(getTheDate(data.transDate)) && moment(getTheDate(data.transDate)))?
          moment(getTheDate(data.transDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD HH:mm:ss'):'',
          doc.id,
          data.invoiceId? data.invoiceId:'',
          data.userId? data.userId:'',
          userData? userData.name? userData.name:'':'',
          userData? userData.email? userData.email:'':'',
          userData? userData.phone? userData.phone:'':'',
          branchData? branchData.name? branchData.name:'':'',
          roomData? roomData.roomNumber? roomData.roomNumber:'':'',
          data.status? data.status:'',
          data.packages? data.packages:'',
          (data.startDate && moment(getTheDate(data.startDate)) && moment(getTheDate(data.startDate)))?
          moment(getTheDate(data.startDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'',
          (data.endDate && moment(getTheDate(data.endDate)) && moment(getTheDate(data.endDate)))?
          moment(getTheDate(data.endDate)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'',
          data.monthlyDeposit? data.monthlyDeposit:'',
          data.totalPrice? parseFloat(data.totalPrice).toFixed(2):'',
          data.paymentType? data.paymentType:'',
          data.imgURL? data.imgURL:'',
          data.remark? data.remark:'',
          croName? croName:''						
        ]);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: bilikXpertSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `All Payments ${monthName} ${yearFormat}!A2:T`,
            majorDimension: "ROWS",
            values: paymentArray
          }
        ], 
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
      });
    }).catch(err=>{
      return res.status(200).send({success:false, err});
    });
  });
});

function getTheDate(theDate){
    if (theDate === null){return}
    // for timestamp firebase
    if (typeof(theDate)==='object'){return theDate.toDate()}
    // for string date format
    else if (typeof(theDate)==='string'){return new Date(theDate)}
}

function getTheDateFormat(theDate, format = null){
  if (theDate === null){return ''}
  // for timestamp firebase
  if (typeof(theDate)==='object'){
    return !format? moment(theDate.toDate()).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD h:mm a'):moment(theDate.toDate()).tz('Asia/Kuala_Lumpur').format(format) 
  }
  // for string date format
  else if (typeof(theDate)==='string'){
    return !format? moment(new Date(theDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD h:mm a'):moment(new Date(theDate)).tz('Asia/Kuala_Lumpur').format(format)
  }
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

exports.helloSheet = functions.https.onRequest((req, res)=>{
  return res.status(200).send({success:true});
});
