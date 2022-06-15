const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment-timezone');
const croSaleSheetId = '13HnQuzrqnQQhDVnfB2XLiNTFk5JB1jd1LZYx94XWB8I';
// write to spreadsheets
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');

// import { getApp } from "firebase/app";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// // const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, "localhost", 5001);

const CONFIG_CLIENT_ID = functions.config().googleapi.client_id;
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret;
// const CONFIG_SHEET_ID = functions.config().googleapi.sheet_id;
// babelasia sheet
const babelAsiaSheet = '1fzDvDBJyTR_r7rY8R0vq48xXlMzt3E0xjmoPTI9gs7Q';
// from fareza
const activeMembershipSheetId = '1Uqywmt1NT-4qFq2m_H6utzmLr_yjIFCniqOXAsthtj8';
const transactionSheetId = '11y7jQl9ieY299x9WJ2j4KMBy_SQxcxqjJ6X8RVT7Azc';
const babelLifeTimeValueId = '1ZprJ9PMvMyTAxibqdma82nW-8p2J6wmlKBblDXhvX9E';
const flxSheetId = '1tro5xTAHzW0HNanjmf9XHnIxuw0zj8L_76QhWkLAm_k';
const momMasterPerformanceTrackerId = `1v_cx_a301m8E4l67HQWYdO34WcX36SitQAqJmW2woOM`;
const allUserSheetId = '1HhPv1EDYxASBQ-tMXGTzliFCye4YrN-PD3AWI4IsK_s';
const invoicesSheetId = '1QEbSb-2UTZ0NVPOzepGrTr4buUScsJzmwnXCk1xW6Vw';
const instructorClassList = '1LpJnGWnZgH-DCIMVK1rMv-KXXE_0f3jJmW4OizATS_0';
const userChangeLogsId = '1wLvou1leq9T09JYNqK2yl2xLbVsZy1eWTz43xVWTTyE';
const babelExclusiveId = '1sp7N6EvC4sqyoQmkhJB-MykHR2SwavsVc2zttVUVGL0';
const babelAnalyticsId = '184GavJ6VtRV1oW87utQ0tG9XmaRT7tQTsItl6WaaulI';
const pgmTransactionId = '1JgmzjVO6oSTbgK3V_p9zJXokA9rxNsG0XEFvfRb-WI4';
const pgmAllUsersId = `1u9s7GbPjrWN6CI4-WfWR98UzGHOT5gXGAbdU7BqVx1Y`;
const pgmAllMembersId = `18j6OwuwZ0nvTLmhPTYUh9dtecF6xTBCJEpXlCbzQocY`;
const pgmAllMembers2Id = `1mwWEwCOfj3pcXYPjZqH14cYhbJ2YgOKWH287XxBgblU`;
const pgmEmployeeId = `1Jwkgtg_tJw28QmgyYvcHCgDFpnU0gfT6iRiZCPbVoYY`;
const pgmProductId = `1rP5hYr81ly9QOG9qry3Wb3ouG8J8tfN-Sk7zDzwkA7s`;
const pgmMassChangesId = `1LulJx8AvTwy7TjIQjQZqAe19tSmT6q8ZWZNBuW1xD6I`;
const klccExperienceId = `1OGbD96vfh03pF9koE9SGp61OQcnfSJw-i5GDE9poB6o`;

// for pgm live
const pgmClientIdLive = '8835b6c15719429bbfa8e6c025e612ab';
const pgmClientSecretLive = 'e6e0af12259e494c9231d7948e03c5a1f48e3ac9ec04434f90b9358239827b96';
const pgmURLLive = `https://babel.perfectgym.com/Api`;

// setup for OauthCallback
const DB_TOKEN_PATH = '/api_tokens';

// setup for authGoogleAPI
const FUNCTIONS_REDIRECT = `https://us-central1-babelasia-37615.cloudfunctions.net/oauthcallback`;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const functionsOauthClient = new OAuth2Client(CONFIG_CLIENT_ID, CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT);

// OAuth token cached locally.
let oauthTokens = null;

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

// get monthQty from renewalTerm
function getMonthQty(renewalTerm){
  var qty = 1;
  if (renewalTerm && renewalTerm.toLowerCase().includes('month') && renewalTerm!='4monthly'){
    qty = 1; 
  }
  else if (renewalTerm && renewalTerm.toLowerCase().includes('quarterly')){
    qty = 3;
  }
  else if (renewalTerm && renewalTerm === '4monthly'){
    qty = 4;
  }
  else if (renewalTerm && renewalTerm === 'biyearly'){
    qty = 6;
  }
  else if (renewalTerm && (renewalTerm === 'year' || renewalTerm === 'yearly')){
    qty = 12;
  }
  return qty;
}

function getMembershipStart (userData){
  if (userData){
      return (userData.autoMembershipStarts? userData.autoMembershipStarts:userData.membershipStarts?userData.membershipStarts:null);
  }
  else {return null}
}

function getMembershipEnd (userData){
  if (userData){
      return (userData.autoMembershipEnds? userData.autoMembershipEnds:userData.membershipEnds?userData.membershipEnds:null);
  }
  else {return null}
}

function getMonthDiff(endDate, startDate){
  if (endDate && startDate){ //todo, check if valid date
      return Math.max(moment(getTheDate(startDate)).diff(moment(getTheDate(endDate)), 'months')) + 1;
  }
  else{
      return 0; // 0 months
  }
}

// including terminated member
function userIsMember(userData){
  var isMember = false;
  if (userData){
    const membershipStarts = userData && (userData.autoMembershipStarts || userData.membershipStarts);
    const membershipEnds = userData && (userData.autoMembershipEnds || userData.membershipEnds);
    const packageId = userData && userData.packageId;
    if (membershipStarts && membershipEnds && packageId){
      isMember = true;
    }
  }
  return isMember;
}

function getGender (userData){
  var userGender = 'female';
  const gender = userData.gender;
  if (gender){
    // console.log('gender is already defined')
    userGender = gender;
  }
  else{
    if (userData){
      const name = userData && userData.name;
      const icNumber = userData.icNumber? userData.icNumber:userData.nric?userData.nric:null;
      if (icNumber){
        // console.log('icNumber: ', icNumber);
        if (icNumber.length > 11 && icNumber.charAt(11) % 2 == 0) {
          userGender = 'female';
        }else if (icNumber.length > 11){
          userGender = 'male';
        }
      }
      else if (name && name.length>2 && (name.toLowerCase().includes('binti ') || name.toLowerCase().includes('bt ') || name.toLowerCase().includes('bte '))
        || name.toLowerCase().includes('a/p') || name.toLowerCase().includes('nur')
      ){
        // console.log('user is female');
        userGender = 'female';
      }
      else if (name && name.length>2 && (name.toLowerCase().includes('bin ') || name.toLowerCase().includes('b. ') || name.toLowerCase().includes('b '))
        || name.toLowerCase().includes('a/l') || name.toLowerCase().includes('mohd')
      ){
        // console.log('user is male');
        userGender = 'male';
      }
    }
  }
  return userGender;
}

function getLastName (userData){
  var userLastName = 'not found';
  const lastName = userData && userData.lastName;
  // console.log(`lastNamelength: ${lastName.length}`);
  // const nameArraySpace1 = userData.name && userData.name.split(' ');
  // console.log('nameArraySpace: ', nameArraySpace1);

  if (userData){
    if (lastName && lastName.length>1){
      userLastName = lastName;
    }
    else{
        const name = userData && userData.name && userData.name.trim();

        if (name && name.length>2 && name.toLowerCase().includes('binti ')){
            const nameArray = name.toLowerCase().split('binti');
            // console.log('nameArray: ', nameArray);
            userLastName = nameArray[1]
        }
        else if (name && name.length>2 && name.toLowerCase().includes('bin ')){
          const nameArray = name.toLowerCase().split('bin');
          userLastName = nameArray[1];
        }
        else if (name && name.length>2 && name.toLowerCase().includes('bt ')){
          const nameArray = name.toLowerCase().split('bt');
          userLastName = nameArray[1];
        }
        else if (name && name.length>2 && name.toLowerCase().includes('b ')){
          const nameArray = name.toLowerCase().split('b ');
          userLastName = nameArray[1];
        }
        else if (name && name.length>2 && name.toLowerCase().includes('b. ')){
          const nameArray = name.toLowerCase().split('b. ');
          userLastName = nameArray[1];
        }
        // contains space, count how many space
        else{
            const nameArraySpace = name && name.split(' ');
            // console.log('nameArraySpace: ', nameArraySpace);
            if (nameArraySpace && nameArraySpace.length===2){
                userLastName = nameArraySpace[1];
            }
            else if (nameArraySpace && nameArraySpace.length>2){
                // userLastName = nameArraySpace[2];
                userLastName = (nameArraySpace.slice(2)).join(' ');
            }
            else{
                userLastName = name; // testing only
            }
        }
    }
  }
  // console.log('userLastName fn: ', userLastName);
  return userLastName;
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

        // console.log('theresponse: ', response);
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

    // console.log('addUserChangeLogToSheetsdocument: ', document);
    // perform desired operations ...
    const executerEmail = document && document.executerEmail;
    // console.log('executerEmail: ', executerEmail);
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
        spreadsheetId: userChangeLogsId,
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
            // console.log('freezeForArray: ', freezeForArray);
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
            
            // console.log('sheetReport: ', sheetReport);
      
            const updateSheetPromise = updateGoogleSheet({
              spreadsheetId: userChangeLogsId,
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

// cron job to add number of visitors to sheets
exports.addCroSalesReportToSheets = functions.https.onRequest((req, res) => {
    const usersQuery = admin.firestore().collection('users').get();
  
    return Promise.all([usersQuery]).then(result=>{
      var batch = admin.firestore().batch();
      const usersResults = result[0];
      const croUserResults = result[0];
  
      var croMap = {};
      croUserResults && croUserResults.forEach(doc=>{
        const data = doc.data();
        const isStaff = data && data.isStaff;
        // const mcId = data.mcId;
        if(isStaff){
            croMap[doc.id] = data;
        }
      });
  
      const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
      // const startOfMonth = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');
      // const endOfMonth = moment('20200731').tz('Asia/Kuala_Lumpur').startOf('day');
      // const dayDiff = endOfMonth.diff(startOfMonth, 'days');
      // console.log('dayDiff: ', dayDiff);
  
      var sheetReport = [];
      var visitorCountTTDI = 0;
      var visitorCountKLCC = 0;
      var visitorCountNonRegister = 0;
  
      var sheetArray = [];
      var sheetReportArray = [];
      usersResults.forEach(user=>{
        if (user && user.data()){
          const data = user.data();
          const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isSameOrAfter(startOfTodayMoment):false;
          // const isTodayJoinDate = (data && data.joinDate)? moment(getTheDate(data.joinDate)).tz('Asia/Kuala_Lumpur').startOf('day').isSame(moment('2020-09-07').startOf('day')):false;
          const firstJoinVisit = data && data.firstJoinVisit;
          const mcId = data && data.mcId;
          const CROData = mcId && croMap[mcId];
          const CROName = CROData && CROData.name;
          const name = data && data.name;
        const gender = (data && data.gender)? data.gender:'null';
        const phone = (data && data.phone)? data.phone:(data.phoneNumber)?data.phoneNumber:'null';
        const email = data && data.email;
        const achieveTarget = data && data.achieveTarget;  
        const refSource = data && data.refSource;


          // for (var i = 0; i<dayDiff; i++){
  
          // }
  
          // var sheetData = [
  
          // ]
          if (isTodayJoinDate){
            sheetArray.push(CROName, firstJoinVisit, name, gender, phone, email, achieveTarget, refSource);
          }
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
        spreadsheetId: croSaleSheetId,
        range: `registration!A10:Z`,
      });
    
      return getSheetPromise.then((result)=>{
        console.log('theresult: ', result);
        const values = result && result.values;
        const rowsCount = (values && values.length)? values.length:0;
        
        // sheetReport = [[
        //   rowsCount + 1,
        //   CROName,
        //   startOfTodayMoment.format('DD/MM/YYYY'),
        //   startOfTodayMoment.format('dddd'),
        //   visitorCountKLCC, 
        //   visitorCountTTDI,
        //   // visitorCountNonRegister
        // ]];
        
        sheetReportArray.push(sheetArray);
        // console.log('sheetReport: ', sheetReport);
  
        const updateSheetPromise = updateGoogleSheet({
            spreadsheetId: croSaleSheetId,
          // valueInputOption: 'RAW',
          
          resource: {
            // How the input data should be interpreted.
            valueInputOption: 'RAW',  // TODO: Update placeholder value.
      
            // The new values to apply to the spreadsheet.
            data: [
              {
                range: `registration!A${rowsCount+10}:Z`,
                majorDimension: "ROWS",
                values: sheetReportArray
              }
            ],  
          },
  
        });
  
        return updateSheetPromise.then((result)=>{
          // console.log('theresult: ', result);
          return res.status(200).send({
            success:true,
            data: 'data',
            sheetReportArray
          });
        });
      });
    });
});

exports.addAllAdyenSummaryToSheet = functions.https.onRequest((req, res) => {

  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('source', '==', 'adyen').get();
  const userQuery = admin.firestore().collection('users').get();
  const adyenQuery = admin.firestore().collection('adyTransactions').get();
  const invoiceQuery = admin.firestore().collection('invoices').get();

    // from SKU tab
    const getSheetSKUPromise = getGoogleSheetPromise({
      spreadsheetId:activeMembershipSheetId,
      range: `SKU!A2:J`,
    });

  return Promise.all([packageQuery, userQuery, paymentQuery, adyenQuery, invoiceQuery, getSheetSKUPromise]).then(result=>{
 
    const pkgRes = result[0];
    const userRes = result[1];
    const paymentRes = result[2];
    const adyenRes = result[3];
    const invoiceRes = result[4];
    const skuRes = result[5];

    var babelVendDetails = {};
    var babelGroupObj = {};
    var babelGroupArray = [];

    const skuValues = skuRes && skuRes.values;
    // const saleSummarynSKUValues = saleSummarynSKURes && saleSummarynSKURes.values;
    // the values from sheet (row)
    // 0. productId
    // 1. productTypeId
    // 2. BabelAccName (manually key in)?
    // 3. productTypeName
    // 4. price
    // 5. base_name
    // 6. name

    skuValues && skuValues.forEach(data2=>{
    //data1 && data1.forEach(data2=>{
        const productId = data2[0];
        const productTypeId = data2[1];
        const babelAccName = data2[2];
        const prodTypeName = data2[3];
        const price = data2[4];
        const base_name = data2[5];
        const name = data2[6];
        babelVendDetails[productId]={
            prodTypeName, productTypeId, babelAccName, price, base_name, name
        }
        //if (babelAccName && babelAccName.includes("Babel Dance")){
        babelGroupArray = babelGroupObj[babelAccName] || [];
        babelGroupArray.push(productId);
        babelGroupObj[babelAccName] = babelGroupArray;
        // }
    });

    var pkgMap = {};
    var sheetArray = [];
    pkgRes && pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});

    var userMap = {};
    userRes && userRes.forEach(doc=>{userMap[doc.id]=doc.data()});

    var theSheetArray = [];
    var paymentDocArray = [];
    var adyDocArray = [];

    var paymentMap = {}
    paymentRes && paymentRes.forEach(doc=>{
      const data = doc.data();
      const transactionId = data && data.transactionId;
      if (transactionId){
        paymentMap[transactionId] = data;
      }
    });

    var invoiceMap = {};
    invoiceRes && invoiceRes.forEach(doc=>{invoiceMap[doc.id]=doc.data()});

    adyenRes && adyenRes.forEach(doc=>{
      const pspRef = doc.id; // psp ref, transactionId
      const data = doc.data();
      const NotificationRequestItem = data.notificationItems && data.notificationItems[0] && data.notificationItems[0].NotificationRequestItem;
      const merchantReference = NotificationRequestItem && NotificationRequestItem.merchantReference; //invoiceId
      const merchantAccountCode = NotificationRequestItem && NotificationRequestItem.merchantAccountCode; // babelfit
      const eventDate = NotificationRequestItem && NotificationRequestItem.eventDate; 
      const eventCode = NotificationRequestItem && NotificationRequestItem.eventCode;
      const currency = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.currency; 
      const value = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.value; 
      const paymentMethod = NotificationRequestItem && NotificationRequestItem.paymentMethod; 
      const success = NotificationRequestItem && NotificationRequestItem.success; 
      const reason = NotificationRequestItem && NotificationRequestItem.reason; 
      const baseLink = 'https://app.babel.fit/payments/';
      const fullLink = merchantReference && `${baseLink}${merchantReference}`;
      const hyperLink = fullLink;
      const paymentData = paymentMap[pspRef];
      const packageId = paymentData && paymentData.packageId;
      const packageData = packageId && pkgMap[packageId];
      const clubBase = packageData && packageData.base;
      const packageName = packageData && packageData.name;
      const invoiceData = merchantReference && invoiceMap[merchantReference];
      const vendProductId = invoiceData && invoiceData.vendProductId;
      const vendProductName = invoiceData && invoiceData.vendProductName;
      const babelVendDetailsData = vendProductId && babelVendDetails[vendProductId];

      adyDocArray = [
        pspRef? pspRef:'',
        merchantReference? merchantReference:'',
        merchantAccountCode? merchantAccountCode:'',
        eventDate? moment(eventDate).tz('Asia/Kuala_Lumpur').format('YY/MM/DD HH:mm'):'',
        value? (value/100):0,
        currency? currency:'',
        paymentMethod? paymentMethod:'',
        baseLink,
        fullLink? fullLink:'',
        hyperLink? hyperLink: '',
        eventCode, success, reason,
        clubBase? clubBase: babelVendDetailsData? (babelVendDetailsData.babelAccName).toUpperCase() : '',
        eventDate? moment(eventDate).tz('Asia/Kuala_Lumpur').format('YY/MM'):'',
        '',// for sku
        vendProductId? vendProductId:'', // for vendId
        vendProductName? vendProductName:'',
        packageId? packageId:'',
        packageName? packageName:''
      ];
      theSheetArray.push(adyDocArray);
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId:activeMembershipSheetId,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `adyen summary!A2:BZ`,
            majorDimension: "ROWS",
            values: theSheetArray
          }
        ],  
      },

    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
      });
    }).catch(error=>{
      return res.status(200).send({
        success:false,
        error
      });
    });
  });
});

exports.addAllPaymentsToSheet = functions.https.onRequest((req, res) => {
  const userQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').get();
  const packageQuery = admin.firestore().collection('packages').get();

  return Promise.all([userQuery, paymentQuery, packageQuery]).then(result=>{
    const userRes = result[0];
    const paymentRes = result[1];
    const packageRes = result[2];

    var finalArray = [];

    var userMap = {};
    var pkgMap = {};
    userRes.forEach(doc=>{userMap[doc.id]=doc.data()});
    packageRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});

    paymentRes.forEach(doc=>{
      const data = doc.data();
      const createdAt = data.createdAt;
      const userId = data.userId;
      const source = data.source;
      const packageId = data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const packageName = packageData && packageData.name;
      const userData = userId && userMap[userId];
      const email = userData && userData.email;
      const name = userData && userData.name;
      const currentUserPkgId = userData && userData.packageId;
      const currentUserPkgData = currentUserPkgId && pkgMap[currentUserPkgId];
      const currentUserPkgName = currentUserPkgData && currentUserPkgData.name;
      const totalPrice = data.totalPrice;
      const membershipStart = getMembershipStart(userData);
      const membershipEnd = getMembershipEnd(userData);
      const status = data.status;
      const hasRecurring = userData && userData.hasRecurring;

      const paymentArray = [
        createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'null',
        email? email:'',
        name? name:'',
        userId? userId:'',
        totalPrice? totalPrice:'',
        source? source:'',
        packageId? packageId:'',
        packageName? packageName:'',
        currentUserPkgName? currentUserPkgName:'',
        membershipStart? getTheDateFormat(membershipStart):'',
        membershipEnd? getTheDateFormat(membershipEnd):'',
        status? status:'',
        hasRecurring? hasRecurring:''
      ];

      finalArray.push(paymentArray);
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: transactionSheetId,
      resource: {
          // How the input data should be interpreted.
          valueInputOption: 'RAW',  // TODO: Update placeholder value.
          // The new values to apply to the spreadsheet.
          data: [
          {
              range: `all transactions users!A2:Z`,
              majorDimension: "ROWS",
              values: finalArray
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
    }).catch(error=>{
        return res.status(200).send({
            success:false,
            error
        });
    });
  });
});

// add angpau payment only to sheet
// exports.addAllAngpauPaymentsToSheet = functions.https.onRequest((req, res) => {
//   const userQuery = admin.firestore().collection('users').get();
//   const paymentQuery = admin.firestore().collection('payments').get();
//   const packageQuery = admin.firestore().collection('packages').get();

//   return Promise.all([userQuery, paymentQuery, packageQuery]).then(result=>{
//     const userRes = result[0];
//     const paymentRes = result[1];
//     const packageRes = result[2];

//     var finalArray = [];

//     var userMap = {};
//     var pkgMap = {};
//     userRes.forEach(doc=>{userMap[doc.id]=doc.data()});
//     packageRes.forEach(doc=>{
//       if (doc.id === 'GjzBC8zwfUTDuefjMDQi' || doc.id === 'hhForDFr6YIbSQNgkUcF'){
//         pkgMap[doc.id]=doc.data();
//       }
//     });

//     paymentRes.forEach(doc=>{
//       const data = doc.data();
//       const createdAt = data.createdAt;
//       const userId = data.userId;
//       const source = data.source;
//       const packageId = data.packageId;
//       const packageData = packageId && pkgMap[packageId];
//       const packageName = packageData && packageData.name;
//       const userData = userId && userMap[userId];
//       const email = userData && userData.email;
//       const name = userData && userData.name;
//       const currentUserPkgId = userData && userData.packageId;
//       const currentUserPkgData = currentUserPkgId && pkgMap[currentUserPkgId];
//       const currentUserPkgName = currentUserPkgData && currentUserPkgData.name;
//       const totalPrice = data.totalPrice;
//       const membershipStart = getMembershipStart(userData);
//       const membershipEnd = getMembershipEnd(userData);
//       const status = data.status;
//       const hasRecurring = userData && userData.hasRecurring;

//       if (packageId && (packageId==='GjzBC8zwfUTDuefjMDQi'||packageId==='hhForDFr6YIbSQNgkUcF')){
//         const paymentArray = [
//           createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'null',
//           email? email:'',
//           name? name:'',
//           userId? userId:'',
//           totalPrice? totalPrice:'',
//           source? source:'',
//           packageId? packageId:'',
//           packageName? packageName:'',
//           currentUserPkgName? currentUserPkgName:'',
//           membershipStart? getTheDateFormat(membershipStart):'',
//           membershipEnd? getTheDateFormat(membershipEnd):'',
//           status? status:'',
//           hasRecurring? hasRecurring:''
//         ];
//         finalArray.push(paymentArray);
//       }
//     });

//     const updateSheetPromise = updateGoogleSheet({
//       spreadsheetId: transactionSheetId,
//       resource: {
//           // How the input data should be interpreted.
//           valueInputOption: 'RAW',  // TODO: Update placeholder value.
//           // The new values to apply to the spreadsheet.
//           data: [
//           {
//               range: `all angpau 2022 transaction!A2:Z`,
//               majorDimension: "ROWS",
//               values: finalArray
//           }
//           ],
//         },
//     });

//     return updateSheetPromise.then((result)=>{
//     // console.log('theresult: ', result);
//         return res.status(200).send({
//             success:true,
//         });
//     }).catch(error=>{
//         return res.status(200).send({
//             success:false,
//             error
//         });
//     });
//   });
// });

exports.addAllTransactionDetailsToSheet = functions.https.onRequest((req, res) => {
  const vendSalesQuery = admin.firestore().collection('vendSales').get();
  const adyenPaymentQuery = admin.firestore().collection('payments').get();
  // const pbOnlineQuery = admin.firestore().collection('payments').where('source', '==', 'pbonline').get();
  const packageQuery = admin.firestore().collection('packages').get();
  // const adyenQuery = admin.firestore().collection('adyTransactions').get();
  const userQuery = admin.firestore().collection('users').get();
  const vendProdQuery = admin.firestore().collection('vendProducts').get();
  // from SKU tab
  const getSheetSKUPromise = getGoogleSheetPromise({
    spreadsheetId:activeMembershipSheetId,
    range: `SKU!A2:J`,
  });
  // const pbOnlinePaymentQuery = admin.firestore('payments').where('source', '==', 'pbonline')

  // return Promise.all([vendSalesQuery, adyenPaymentQuery, pbOnlineQuery, packageQuery, getSheetSKUPromise, adyenQuery]).then(result=>{
  return Promise.all([adyenPaymentQuery, packageQuery, userQuery, vendSalesQuery, vendProdQuery, getSheetSKUPromise]).then(result=>{ 
    const adyenRes = result[0];
    const pkgRes = result[1];
    const userRes = result[2];
    const vendSaleRes = result[3];
    const vendProdRes = result[4];
    const skuRes = result[5];

    const skuValues = skuRes && skuRes.values;
    const skuRowsCount = (skuValues && skuValues.length)? skuValues.length:0;

    var babelVendDetails = {};
    var babelGroupObj = {};
    var babelGroupArray = [];


    skuValues && skuValues.forEach(data2=>{
      //data1 && data1.forEach(data2=>{
          const productId = data2[0];
          const productTypeId = data2[1];
          const babelAccName = data2[2];
          const prodTypeName = data2[3];
          const price = data2[4];
          const base_name = data2[5];
          const name = data2[6];
          babelVendDetails[productId]={
              prodTypeName, productTypeId, babelAccName, price, base_name, name
          }
          // if (babelAccName && babelAccName.includes("Babel Dance")){
              // babelGroupArray = babelGroupObj[babelAccName] || [];
              // babelGroupArray.push(productId);
              // babelGroupObj[babelAccName] = babelGroupArray;
          // }
      });


    var finalArray = [];
  
    var packageVendProdIdArray = [];
    pkgRes && pkgRes.forEach(doc=>{
        const data = doc.data();
        const vendProductIds = data && data.vendProductIds;
        if (vendProductIds){
            // packageVendProdIdArray.push(vendProductIds);
            vendProductIds && vendProductIds.forEach(vendProduct=>{
                packageVendProdIdArray.push(vendProduct);
            });
        }
    });

    var vendProdMap = {};
    vendProdRes && vendProdRes.forEach(doc=>{
      vendProdMap[doc.id]=doc.data();
    });

    var userMap = {};
    var userByVendCustIdMap = {}
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const vendCustomerId = data && data.vendCustomerId;
      const userId = doc.id;
      if (vendCustomerId){
        userByVendCustIdMap[vendCustomerId] = data;
        userByVendCustIdMap[vendCustomerId].userId = userId;
      }
      userMap[doc.id]=data;
    });
    var paymentArray = [];

    adyenRes && adyenRes.forEach(doc=>{
      const data = doc.data();
      const status = data && data.status;
      const totalPrice = data && data.totalPrice;
      const vendProductId = data.vendProductId;

      const type = data.type? data.type: vendProductId? babelVendDetails[vendProductId].prodTypeName? babelVendDetails[vendProductId].prodTypeName:null:null;
     
      const productName = data.productName;
      const createdAt = data && data.createdAt;
      const userId = data && data.userId;
      const userData = userId && userMap[userId];
      const userName = userData && userData.name;
      const userEmail = userData && userData.email;
      const phone = userData && userData.phone;
      const source = data && data.source;
      const freezeSource = data && data.freezeSource;

      if ((source && (source === 'adyen' || source === 'pbonline')) || (freezeSource && freezeSource === 'adyen')){
        paymentArray = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'null',
          userId? userId:'',
          userName? userName:'null',
          userEmail? userEmail:'null',
          phone? phone:'null',
          vendProductId? vendProductId:'null',
          productName? productName:'null',
          type? type:'null',
          status? status:'null',
          totalPrice? totalPrice:'null',
          source? source:'null'
        ];
        finalArray.push(paymentArray);
      }
      
    });

    vendSaleRes && vendSaleRes.forEach(doc=>{
      const data = doc.data();
      const status = data.status;
      const register_sale_products = data.register_sale_products;
      const line_items = data.line_items;
      const lineItems = register_sale_products? register_sale_products:line_items?line_items:null;
      var vendIdArray = [];
      var vendNameArray = [];
      const totalPrice = (data.totals && data.totals.total_payment)? parseFloat(data.totals.total_payment).toFixed(2):data.total_price_incl?parseFloat(data.total_price_incl).toFixed(2):0;
      const customer_id = data && data.customer_id;
      const created_at = data && data.created_at;
      const userData = userByVendCustIdMap[customer_id];
      const userId = userData && userData.userId;
      const userName = userData && userData.name;
      const userEmail = userData && userData.email;
      const phone = userData && userData.phone;
      lineItems && lineItems.forEach(product=>{
        const prodId = product.product_id;
        vendIdArray.push(prodId);
        const vendProdData = vendProdMap[prodId];
        const base_name = vendProdData && vendProdData.base_name;
        const name = vendProdData && vendProdData.name;
        vendNameArray.push(name);
      });
      
      var typeArray = [];
      vendIdArray && vendIdArray.forEach(prodId=>{
        const type = (prodId && babelVendDetails[prodId])? babelVendDetails[prodId].prodTypeName? babelVendDetails[prodId].prodTypeName:null:null;
        typeArray.push(type);
      });

      paymentArray = [
        created_at? moment(created_at.slice(0,10)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'null',
        userId? userId:'',
        userName? userName:'null',
        userEmail? userEmail:'null',
        phone? phone:'null',
        vendIdArray? vendIdArray.join():'null',
        vendNameArray? vendNameArray.join():'null',
        typeArray? typeArray.join():'null',
        // productName? productName:'null',
        // type? type:'null',
        status? status:'null',
        totalPrice? totalPrice:'null',
        'vend'
      ];
      finalArray.push(paymentArray);
    });

        // pbOnlineRes && pbOnlineRes.forEach(doc=>{
        // const data = doc.data();
        // const status = data && data.status;
        // const totalPrice = data && data.totalPrice;
        // const type = data && data.type;
        // const vendProductId = data.vendProductId;
        // const productName = data.productName;

        // if (status && status === 'CLOSED'){
        //     totalPBPrice+=parseFloat(totalPrice);
        //     totalPBCount+=1;
        //     if (type === 'membership'){
        //         totalMembershipPBOnlinePrice+=parseFloat(totalPrice);
        //         totalMembershipPBOnlineCount+=1;
        //     }
        //     // if doesnt has productName, check if its contains vendProductId from its document
        //     else if (productName && (productName.includes('Dance') 
        //         || productName.includes('Day Pass')
        //         || productName.includes('Valentine’s Special')
        //         || productName.includes('Choreography')
        //         || productName.includes('Pop-Up Class')
        //         || productName.includes('Alextbh')
        //         || productName.includes('Night Pass')
        //         || productName.includes('Fck The Floor')
        //         )){
        //         totalDancePBOnlinePrice += parseFloat(totalPrice);
        //         totalDancePBOnlineCount+=1;
        //     }
        //     else{
        //          // for dance
        //         Object.entries(babelGroupObj).forEach(([key,value]) => {
        //             if (value.includes(vendProductId)){
        //                 totalDancePBOnlinePrice += parseFloat(totalPrice);
        //                 totalDancePBOnlineCount+=1;
        //             }
        //         });
        //     }
        // }
        // });

        // var totalAdyen2Count = 0;
        // var totalAdyen2Price = 0;
        // adyenRes2 && adyenRes2.forEach(doc=>{
        //   const data = doc.data();
        //   const NotificationRequestItem = data.notificationItems && data.notificationItems[0] && data.notificationItems[0].NotificationRequestItem;
        //   const merchantReference = NotificationRequestItem && NotificationRequestItem.merchantReference; //invoiceId
        //   const merchantAccountCode = NotificationRequestItem && NotificationRequestItem.merchantAccountCode; // babelfit
        //   const eventDate = NotificationRequestItem && NotificationRequestItem.eventDate; 
        //   const eventCode = NotificationRequestItem && NotificationRequestItem.eventCode;
        //   const currency = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.currency; 
        //   const value = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.value; 
        //   const paymentMethod = NotificationRequestItem && NotificationRequestItem.paymentMethod; 
        //   const success = NotificationRequestItem && NotificationRequestItem.success; 
        //   const reason = NotificationRequestItem && NotificationRequestItem.reason; 
        //   const totalPrice = parseFloat(value)/100;

        //   if (eventCode && eventCode === 'AUTHORISATION' && success && success === 'true'){
        //     totalAdyen2Price+=totalPrice;
        //     totalAdyen2Count+=1;
        //   }
        // });

        // finalArray.push(
        //     [parseFloat(totalVendPrice).toFixed(2), totalVendCount, totalMembershipVendPrice, totalMembershipVendCount, totalDanceVendPrice, totalDanceVendCount], 
        //     [parseFloat(totalAdyenPrice).toFixed(2), totalAdyenCount, totalMembershipAdyenPrice, totalMembershipAdyenCount, totalDanceAdyenPrice, totalDanceAdyenCount], 
        //     [parseFloat(totalPBPrice).toFixed(2), totalPBCount, totalMembershipPBOnlinePrice, totalMembershipPBOnlineCount, totalDancePBOnlinePrice, totalDancePBOnlineCount],
        //     [parseFloat(totalAdyen2Price).toFixed(2), totalAdyen2Count], 
        // );

        // finalArray.push(paymentArray);
        const updateSheetPromise = updateGoogleSheet({
            spreadsheetId: transactionSheetId,
            resource: {
                // How the input data should be interpreted.
                valueInputOption: 'RAW',  // TODO: Update placeholder value.
                // The new values to apply to the spreadsheet.
                data: [
                {
                    range: `all transactions details!A2:Z`,
                    majorDimension: "ROWS",
                    values: finalArray
                }
                ],  // TODO: Update placeholder value.
        
                // TODO: Add desired properties to the request body.
            },
        });

        return updateSheetPromise.then((result)=>{
        // console.log('theresult: ', result);
            return res.status(200).send({
                success:true,
                // test hardcode
                babelVendTest:babelVendDetails['0a260e0d-8a3e-23ac-1a67-ddf54453ddbe'].prodTypeName,
                babelVendDetails
            });
        }).catch(error=>{
            return res.status(200).send({
                success:false,
                error
            });
        });
    });
});

// list the vendProducts to sheets
exports.vendProductToSheet = functions.https.onRequest((req, res)=>{
  const vendProductsQuery = admin.firestore().collection('vendProducts').get();

  var sheetReport = [];
  var productData = [];
  return Promise.all([vendProductsQuery]).then(results=>{
    const productRes = results[0];
    productRes && productRes.forEach(doc=>{
      const data = doc.data();
      const productId = data && data.id;
      const product_type = data && data.product_type;
      const product_type_id = product_type && product_type.id;
      const product_type_name = product_type && product_type.name;
      const supply_price = data && data.supply_price;
      const base_name = data && data.base_name;
      const name = data && data.name;
      const active = data && data.active;
      const sku = data && data.sku;

      productData = [
        productId? productId:'',
        product_type_id? product_type_id:'',
        product_type_name? product_type_name:'',
        supply_price? supply_price:'',
        base_name? base_name:'',
        name? name:'',
        active? active:'',
        sku? sku:''
      ];
      sheetReport.push(productData);
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: babelLifeTimeValueId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `vend products!A2:P`,
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
        sheetReport
      });
    });

  });
});

// list of members whose purchase the flx
exports.flxPayment = functions.https.onRequest((req, res)=>{
  const paymentQuery = admin.firestore().collection('payments')
    .where('type', '==', 'membership')
    // .where('promoType', '==', 'flx')
    .get();
  const userQuery = admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();

  var sheetReport = [];
  var paymentData = [];

  return Promise.all([userQuery, paymentQuery, packageQuery]).then(results=>{
    const userRes = results[0];
    const paymentRes = results[1];
    const packageRes = results[2];
    var userMap = {};
    var packageMap = {};
    userRes && userRes.forEach(doc=>{userMap[doc.id]=doc.data()});
    packageRes && packageRes.forEach(doc=>{packageMap[doc.id]=doc.data()});

    paymentRes && paymentRes.forEach(doc=>{
      const data = doc.data();
      const type = data && data.type;
      const userId = data && data.userId;
      const totalPrice = data && data.totalPrice;
      const status = data && data.status;
      const transactionId = data && data.transactionId;
      const source = data && data.source;
      const promoType = data && data.promoType;
      const createdAt = data && data.createdAt;
      const userData = userId && userMap[userId];
      const userEmail = userData && userData.email;
      const userPackageId = userData && userData.packageId;
      const userPackageData = userPackageId && packageMap[userPackageId];
      const userPackageName = userPackageData && userPackageData.name;
      const packageId = data && data.packageId;
      const packageData = packageId && packageMap[packageId];
      const packageName = packageData && packageData.name;
      const packagePromoName = packageData && packageData.promoName;

      if (source && (source === 'adyen'||source ==='vend') && packagePromoName){
        paymentData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'):'',
          doc.id? doc.id:'',
          type? type:'',
          userId? userId:'',
          userEmail? userEmail:'',
          totalPrice? totalPrice:'',
          status? status:'',
          transactionId? transactionId:'',
          packageId? packageId:'',
          packageName? packageName:'',
          source? source:'',
          promoType? promoType:'',
          userPackageId? userPackageId:'',
          userPackageName? userPackageName:'',
          packagePromoName? packagePromoName:''
        ];
        sheetReport.push(paymentData);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: flxSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `payments!A2:P`,
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
        sheetReport
      });
    });
  });
});

exports.addMomFreezenCancelToSheet = functions.https.onRequest((req, res)=>{
  const freezeQuery = admin.firestore().collection('payments')
    .where('source', '==', 'freeze')
    // .where('promoType', '==', 'flx')
    .get();
  const userQuery = admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();

  var sheetReport = [];
  var paymentData = [];
  var freezeCountObj = {};
  var cancelCountObj = {};
  console.log('faizul1....');
  freezeCountObj['TTDI']={}; // default
  freezeCountObj['KLCC']={}; // default
  cancelCountObj['TTDI']={};
  cancelCountObj['KLCC']={};

  console.log('faizul2....', freezeCountObj);
  var TTDIFreezeArray = [];
  var KLCCFreezeArray = [];
  var TTDICancelArray = [];
  var KLCCCancelArray = [];

  //default 
  // just count from january to may 2021
  for (var i=0; i<5; i++){
    freezeCountObj['TTDI'][i+1]=0;
    freezeCountObj['KLCC'][i+1]=0;
    cancelCountObj['TTDI'][i+1]=0;
    cancelCountObj['KLCC'][i+1]=0;
  }

  console.log('freezeCountObj: ', freezeCountObj); 
  console.log('cancelCountObj: ', cancelCountObj); 

  var userMap = {};
  var pkgMap = {};

  return Promise.all([freezeQuery, userQuery, packageQuery]).then(results=>{
    const freezeRes = results[0];
    const userRes = results[1];
    const pkgRes = results[2];

    pkgRes && pkgRes.forEach(doc=>{
      pkgMap[doc.id]=doc.data();
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      userMap[doc.id]=data;
      const cancellationDate = data && data.cancellationDate;
      const packageId = data && data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const pkgBase = packageData && packageData.base;

      if (cancellationDate && pkgBase){
        for (var i=0; i<5; i++){
          if (moment(getTheDate(cancellationDate)).isSameOrAfter(moment(`2021-0${i+1}-01`)) && 
            moment(getTheDate(cancellationDate)).isBefore(moment(`2021-0${(i+2)}-01`))){
              cancelCountObj[pkgBase][i+1] += 1; 
            }
        }
      }
    });

    freezeRes && freezeRes.forEach(doc=>{
      const data = doc.data();
      const createdAt = data && data.createdAt;
      const freezeFor = data && data.freezeFor;
      const userId = data && data.userId;
      const userData = userId && userMap[userId];
      const userPackageId = userData && userData.packageId;
      const pkgData = userPackageId && pkgMap[userPackageId];
      const pkgBase = pkgData && pkgData.base;

      // with pkgbase will exclude complimentary package
      if (freezeFor && userId && pkgBase){
        // just count from january to may 2021
        for (var i=0; i<5; i++){
          if (moment(getTheDate(freezeFor)).isSameOrAfter(moment(`2021-0${i+1}-01`)) && 
            moment(getTheDate(freezeFor)).isBefore(moment(`2021-0${(i+2)}-01`))){
              freezeCountObj[pkgBase][i+1] += 1; 
            }
        }
      }
    });

    Object.entries(freezeCountObj['TTDI']).forEach(([key,value]) => {TTDIFreezeArray.push(value)});
    Object.entries(freezeCountObj['KLCC']).forEach(([key,value]) => {KLCCFreezeArray.push(value)});
    Object.entries(cancelCountObj['TTDI']).forEach(([key,value]) => {TTDICancelArray.push(value)});
    Object.entries(cancelCountObj['KLCC']).forEach(([key,value]) => {KLCCCancelArray.push(value)});
   
    sheetReport.push(TTDIFreezeArray, TTDICancelArray, KLCCFreezeArray, KLCCCancelArray);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: momMasterPerformanceTrackerId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Master Numbers 2021 (faizul)!B12:M`,
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
        sheetReport,
        freezeCountObj, cancelCountObj
      });
    });


  });
});

function getMemberStatus(userData, isFreeze = false){
  var status = '';
  if (userData){
    const membershipEnd = getMembershipEnd(userData);
    const membershipStart = getMembershipStart(userData);
    const packageId = userData && userData.packageId;
    const cancellationDate = userData && userData.cancellationDate;

    if (cancellationDate){
      status = 'CANCEL';
    }
    else if (isFreeze){
      status = 'FREEZE';
    }
    else if (membershipEnd && membershipStart && packageId && moment(getTheDate(membershipEnd)).isSameOrAfter(moment()) ){
      status = 'ACTIVE';
    }
    else if (membershipEnd && membershipStart && packageId && moment(getTheDate(membershipEnd)).isBefore(moment())){
      status = 'OUTSTANDING';
    }
  }
  
  return status;
}
// cron job to add users to sheets
exports.addUsersToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  // test for yeeseen@gmail.com
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments')
    .where('type', '==', 'membership')
    // .where('userId', '==', 'KiUWdU0l1NhFxOU1K2va8sR0ztB2')
    .get();
  const gantnerQuery = admin.firestore().collection('gantnerLogs')
    .where('createdAt', '>=', moment('2021-09-24').startOf('day').toDate())
    .orderBy('createdAt', 'desc')
    .get();

  return Promise.all([usersQuery, packageQuery, paymentQuery, gantnerQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResults = result[1];
    const paymentResults = result[2];
    const gantnerResults = result[3];

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var gantnerMap = {}
    var pkgMap = {};
    var paymentMap = {};
    var paymentArray = [];

    packageResults && packageResults.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });

    gantnerResults.forEach(doc=>{
      const data = doc.data();
      const userId = data.userId;
      gantnerMap[userId]=data;
    });

    paymentResults && paymentResults.forEach(doc=>{
      const data = doc.data();
      const source = data && data.source;
      const userId = data && data.userId;
      const status = data && data.status;
      // if (source && source !== 'freeze'){
      if (source){
        paymentArray = paymentMap[userId] || [];
        paymentArray.push(data);
        paymentMap[userId]=paymentArray;
      }
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
        const packageBase = packageData && packageData.base;
        const packagePrice = packageData && packageData.price;
        const prevPackageId = data.prevPackageId;
        const prevPackageData = prevPackageId && pkgMap[prevPackageId];
        const prevPackageName = prevPackageData && prevPackageData.name;
        // const isKLCCPkg = packageId && isKLCCPackage(packageId);
        const isKLCCPkg = packageBase && (packageBase === 'KLCC');
        const promoJan2020 = data && data.promoJan2020;
        const phone = data && data.phone;
        const malaysiaPhoneNum = phone? (typeof phone === 'string')? (phone.charAt(0)==='0')? `6${phone}`:phone:phone:null;
        // const isSpecialFreeze2021Data = freezeMap[user.id];
        // const isContainFreeze = freezeMap[user.id];
        const achieveTarget = data && data.achieveTarget;
        const paymentData = paymentMap[user.id];

        const gantnerData = gantnerMap[user.id]||null;
        const lastCheckIn = (gantnerData && gantnerData.createdAt)? moment(getTheDate(gantnerData.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'no last check in';

        var totalPaymentMade = 0.00;
        var zeroPaymentCount = 0;
        var freezeCount = 0;
        var normalFreezeCount = 0;
        var specialFreezeCount = 0;
        var totalOwePayment = 0.00;
        var currentMonthisFreeze = false

        paymentData && paymentData.forEach(payment=>{
          // const totalPrice = (payment.totalPrice).toString();
          const totalPrice = parseFloat(payment.totalPrice);
          // totalPaymentMade+=parseFloat(totalPrice).toFixed(2);
          const status = payment.status;
          if (status && status === 'CLOSED'){
            totalPaymentMade+=totalPrice;
          }
          const source = payment.source;
          const freezeType = payment.freezeType;
          const validFreezeFor = payment.freezeFor && moment(getTheDate(payment.freezeFor)).isSameOrBefore(moment());
          const validCreatedAt = payment.createdAt && moment(getTheDate(payment.createdAt)).isSameOrBefore(moment());
          const freezeFor = payment.freezeFor;

          // console.log('totalPaymentMade: ', totalPaymentMade);
          if (totalPrice === 0 && source && source!=='freeze' && validCreatedAt && status && status === 'CLOSED'){
            zeroPaymentCount+=1;
          }
          else if (source && source === 'freeze' && !freezeType && validFreezeFor){
            normalFreezeCount+=1;
            freezeCount+=1;
          }
          else if (source && source === 'freeze' && freezeType && validFreezeFor){
            specialFreezeCount+=1;
            freezeCount+=1;
          }

          if (source && source === 'freeze' && freezeFor && moment(getTheDate(freezeFor)).isSameOrAfter(moment().subtract(1, 'month')) && moment(getTheDate(freezeFor)).isBefore(moment().add(1, 'month'))){
            currentMonthisFreeze=true;
          }

        });

        var monthDiff = 0;
        const membershipEndsDate = autoMembershipEnds? moment(getTheDate(autoMembershipEnds)):membershipEnds?moment(getTheDate(membershipEnds)):null;
        const membershipStartsDate = membershipStarts? moment(getTheDate(membershipStarts)):null;

        const todayDate = moment().tz("Asia/Kuala_Lumpur").startOf('day'); // hardcode for June 2021
        monthDiff = (membershipEndsDate && membershipStartsDate)? (membershipEndsDate.diff(membershipStartsDate, 'months')):0;

        // extra month
        var monthDiffUptillToday = (membershipEndsDate && membershipStartsDate)? (membershipEndsDate.isSameOrAfter(todayDate))?
          `${(membershipEndsDate.diff(todayDate, 'months'))}`: `${(membershipEndsDate.diff(todayDate, 'months'))}`:0;

        var totalOwe = 0;
        totalOwe = (monthDiffUptillToday)*parseFloat(packagePrice).toFixed(2);
        // totalOwe = (monthDiffUptillToday-zeroPaymentCount)*parseFloat(packagePrice).toFixed(2);
        // Object.entries(paymentData).forEach(([key,value]) => {
        //   console.log('thevalue: ', value)
        //   const totalPrice = value.totalPrice;
        //   console.log('totalPrice: ', totalPrice);
        // });
        // const totalPayment = paymentData && parseFloat(paymentData.totalPrice).toFixed(2);
        const memberStatus = getMemberStatus(data, currentMonthisFreeze);

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
          malaysiaPhoneNum? malaysiaPhoneNum:'',
          data.email ? data.email : '',
          data.mcId ? data.mcId : '',
          // data.packageId ? data.packageId : '',
          isKLCCPkg? 'KLCC': ' ',
          packageName,
          prevPackageName,
          data.firstJoinVisit? data.firstJoinVisit:'',
          data.paymentMode ? data.paymentMode : '',
          membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          totalPaymentMade,
          monthDiff,
          monthDiffUptillToday,
          totalOwe,
          zeroPaymentCount,
          freezeCount,
          normalFreezeCount,
          specialFreezeCount,
          // data.autoDiff ? data.autoDiff : '',
          // data.freeMonths ? data.freeMonths : '',
          // data.freePT ? data.freePT : '',
          // data.freeGift ? data.freeGift : '',
          data.referredByUserId ? data.referredByUserId : '',
          data.trainerId ? data.trainerId : '',
          data.inductionDate ? moment(getTheDate(data.inductionDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.inductionDone ? data.inductionDone : '',
          data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.cancellationReason ? data.cancellationReason : '',
          data.remarks ? data.remarks : '',
          data.hasRecurring? data.hasRecurring:'false',
          data.isStaff? data.isStaff:'',
          data.promoJan2020? data.promoJan2020:'',
          data.promoAug2020? data.promoAug2020: '',
          data.promoSep2020? data.promoSep2020: '',
          data.promoMidSep2020? data.promoMidSep2020: '',
          data.PrivateClassCredit? data.PrivateClassCredit:'',
          achieveTarget? achieveTarget:'no target yet',
          lastCheckIn? lastCheckIn:'no check in',
          memberStatus? memberStatus:''// member status: Active, freeze, outstanding
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
      spreadsheetId: allUserSheetId,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO USERS!A2:AY`,
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
        // paymentMap
        // users: users,
        // theResponse
        // userCount
      });
    }).catch(error=>{
      return res.status(200).send({
        error
      });
    })
  });
});

// add trainer into sheets
// exports.addTrainerToSheets = functions.https.onRequest((req, res) => {
//   const itemData = req.body;
//   const userEmail = itemData && itemData.email;
//   const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();

//   return Promise.all([usersQuery]).then(result=>{
//     var batch = admin.firestore().batch();
//     const usersResults = result[0];

//     var users = [];
    
//     usersResults.forEach(user=>{
//       if (user && user.data()){
//         const data = user.data();
//         const roles = data.roles;

//         if (data && data.isStaff){
//           const userData = [
//             user.id,
//             data.email ? data.email : '',
//             data.name? data.name:'',
//             data.staffBranch? data.staffBranch: '',
//             data.isStaff? data.isStaff:'',
//             data.staffRole? data.staffRole:'',
//             roles? roles.trainer? 'trainer':'':''
//           ];
//           users.push(userData);
//         }
//       }
//     });

//     const updateSheetPromise = updateGoogleSheet({
//       spreadsheetId: instructorClassList,
//       resource: {
//         // How the input data should be interpreted.
//         valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
//         // The new values to apply to the spreadsheet.
//         data: [
//           {
//             range: `staff details!A2:AX`,
//             majorDimension: "ROWS",
//             values: users
//           }
//         ], 
//       },

//     });

//     return updateSheetPromise.then((result)=>{
//       return res.status(200).send({success:true});
//     }).catch(error=>{
//       return res.status(200).send({error});
//     })
//   });
// });

// cron job to add klcc visitor to sheets
exports.addklccVisitorsToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).where('createdFrom', '==', 'klccExperience').get():admin.firestore().collection('users').where('createdFrom', '==', 'klccExperience').get();

  return Promise.all([usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    var gantnerMap = {}

    var users = [];
    
    usersResults.forEach(user=>{
      if (user && user.data()){
        const data = user.data();
       
        // const isKLCCPkg = packageId && isKLCCPackage(packageId);
        const phone = data && data.phone;
        const malaysiaPhoneNum = phone? (typeof phone === 'string')? (phone.charAt(0)==='0')? `6${phone}`:phone:phone:null;
        // const isSpecialFreeze2021Data = freezeMap[user.id];
        // const isContainFreeze = freezeMap[user.id];
        const achieveTarget = (data && data.achieveTarget)? data.achieveTarget: data.achieveTargetSource? data.achieveTargetSource:null;

        const userData = [
          data.createdAt ? moment(getTheDate(data.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          user.id,
          data.name ? data.name : '',
          data.race ? data.race : '',
          data.gender ? data.gender : '',
          malaysiaPhoneNum? malaysiaPhoneNum:'',
          data.email ? data.email : '',
          data.remarks ? data.remarks : '',
          achieveTarget? achieveTarget:'no target yet',
          data.klccExpFirstEmailAt? getTheDateFormat(data.klccExpFirstEmailAt):'not send',
          data.klccExpReminderEmailAt? getTheDateFormat(data.klccExpReminderEmailAt):'not yet send',
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
      spreadsheetId: klccExperienceId,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `KLCCEXPERIENCE VISITORS!A2:AY`,
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
        // paymentMap
        users: users,
        // theResponse
        // userCount
      });
    }).catch(error=>{
      return res.status(200).send({
        error
      });
    })
  });
});

exports.addTransactionSummaryToSheet = functions.https.onRequest((req, res) => {
  const vendSalesQuery = admin.firestore().collection('vendSales').get();
  const adyenPaymentQuery = admin.firestore().collection('payments').where('source', '==', 'adyen').get();
  const pbOnlineQuery = admin.firestore().collection('payments').where('source', '==', 'pbonline').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const adyenQuery = admin.firestore().collection('adyTransactions').get();

  // from SKU tab
  const getSheetSKUPromise = getGoogleSheetPromise({
    spreadsheetId:activeMembershipSheetId,
    range: `SKU!A2:J`,
  });

  return Promise.all([vendSalesQuery, adyenPaymentQuery, pbOnlineQuery, packageQuery, getSheetSKUPromise, adyenQuery]).then(result=>{
        const vendSaleRes = result[0];
        const adyenRes = result[1];
        const pbOnlineRes = result[2];
        const pkgRes = result[3];
        const skuRes = result[4];
        const adyenRes2 = result[5];

        var babelVendDetails = {};
        var babelGroupObj = {};
        var babelGroupArray = [];

        const skuValues = skuRes && skuRes.values;
        const skuRowsCount = (skuValues && skuValues.length)? skuValues.length:0;
        const saleSumnSKUCount = 92;
        // const saleSummarynSKUValues = saleSummarynSKURes && saleSummarynSKURes.values;
        // the values from sheet (row)
        // 0. productId
        // 1. productTypeId
        // 2. BabelAccName (manually key in)?
        // 3. productTypeName
        // 4. price
        // 5. base_name
        // 6. name

        skuValues && skuValues.forEach(data2=>{
        //data1 && data1.forEach(data2=>{
            const productId = data2[0];
            const productTypeId = data2[1];
            const babelAccName = data2[2];
            const prodTypeName = data2[3];
            const price = data2[4];
            const base_name = data2[5];
            const name = data2[6];
            babelVendDetails[productId]={
                prodTypeName, productTypeId, babelAccName, price, base_name, name
            }
            if (babelAccName && babelAccName.includes("Babel Dance")){
                babelGroupArray = babelGroupObj[babelAccName] || [];
                babelGroupArray.push(productId);
                babelGroupObj[babelAccName] = babelGroupArray;
            }
        });

        var finalArray = [];
        var totalAdyenPrice = 0;
        var totalPBPrice = 0;
        var totalVendPrice = 0;

        var totalAdyenCount = 0;
        var totalVendCount = 0;
        var totalPBCount = 0;

        var totalMembershipVendPrice = 0;
        var totalMembershipAdyenPrice = 0;
        var totalMembershipPBOnlinePrice = 0;

        var totalMembershipVendCount = 0;
        var totalMembershipAdyenCount = 0;
        var totalMembershipPBOnlineCount = 0;

        var totalDanceVendPrice = 0;
        var totalDanceAdyenPrice = 0;
        var totalDancePBOnlinePrice = 0;

        var totalDanceVendCount = 0;
        var totalDanceAdyenCount = 0;
        var totalDancePBOnlineCount = 0;

        var packageVendProdIdArray = [];
        pkgRes && pkgRes.forEach(doc=>{
            const data = doc.data();
            const vendProductIds = data && data.vendProductIds;
            if (vendProductIds){
                // packageVendProdIdArray.push(vendProductIds);
                vendProductIds && vendProductIds.forEach(vendProduct=>{
                    packageVendProdIdArray.push(vendProduct);
                });
            }
        });

        vendSaleRes && vendSaleRes.forEach(doc=>{
        const data = doc.data();
        const status = data.status;
        const register_sale_products = data.register_sale_products;
        const line_items = data.line_items;
        const lineItems = register_sale_products? register_sale_products:line_items?line_items:null;
        var vendIdArray = [];
       

        const totalPrice = (data.totals && data.totals.total_payment)? parseFloat(data.totals.total_payment).toFixed(2):data.total_price_incl?parseFloat(data.total_price_incl).toFixed(2):0;
        if (status && (status === 'CLOSED'||status==='LAYBY_CLOSED')){
            totalVendPrice+=parseFloat(totalPrice);
            totalVendCount+=1;
           
            lineItems && lineItems.forEach(item=>{
                const vendId = item.product_id;
                 // for membership
                if (packageVendProdIdArray.includes(vendId)){
                    totalMembershipVendPrice+=parseFloat(totalPrice);
                    totalMembershipVendCount+=1;
                }
                // for dance
                Object.entries(babelGroupObj).forEach(([key,value]) => {
                    // console.log('theValue: ', value);
                    // console.log('vendId: ', vendId);
                    if (value.includes(vendId)){
                        totalDanceVendPrice+=parseFloat(totalPrice);
                        totalDanceVendCount+=1;
                    }
                });
            });
           
        }
        });

        adyenRes && adyenRes.forEach(doc=>{
        const data = doc.data();
        const status = data && data.status;
        const totalPrice = data && data.totalPrice;
        const type = data && data.type;
        const vendProductId = data.vendProductId;
        const productName = data.productName;

        if (status && status === 'CLOSED'){
            totalAdyenPrice+=parseFloat(totalPrice);
            totalAdyenCount+=1;
            if (type === 'membership'){
                totalMembershipAdyenPrice+=parseFloat(totalPrice);
                totalMembershipAdyenCount+=1;
            }
            // if doesnt has productName, check if its contains vendProductId from its document
            else if (productName && (productName.includes('Dance')
            || productName.includes('Day Pass')
            || productName.includes('Valentine’s Special')
            || productName.includes('Choreography')
            || productName.includes('Pop-Up Class')
            || productName.includes('Alextbh')
            || productName.includes('Night Pass')
            || productName.includes('Fck The Floor')
            )){
                totalDanceAdyenPrice += parseFloat(totalPrice);
                totalDanceAdyenCount+=1;
            }
            else{
                 // for dance
                Object.entries(babelGroupObj).forEach(([key,value]) => {
                    if (value.includes(vendProductId)){
                        totalDanceAdyenPrice += parseFloat(totalPrice);
                        totalDanceAdyenCount+=1;
                    }
                });
            }
           
        }
        });

        pbOnlineRes && pbOnlineRes.forEach(doc=>{
        const data = doc.data();
        const status = data && data.status;
        const totalPrice = data && data.totalPrice;
        const type = data && data.type;
        const vendProductId = data.vendProductId;
        const productName = data.productName;

        if (status && status === 'CLOSED'){
            totalPBPrice+=parseFloat(totalPrice);
            totalPBCount+=1;
            if (type === 'membership'){
                totalMembershipPBOnlinePrice+=parseFloat(totalPrice);
                totalMembershipPBOnlineCount+=1;
            }
            // if doesnt has productName, check if its contains vendProductId from its document
            else if (productName && (productName.includes('Dance') 
                || productName.includes('Day Pass')
                || productName.includes('Valentine’s Special')
                || productName.includes('Choreography')
                || productName.includes('Pop-Up Class')
                || productName.includes('Alextbh')
                || productName.includes('Night Pass')
                || productName.includes('Fck The Floor')
                )){
                totalDancePBOnlinePrice += parseFloat(totalPrice);
                totalDancePBOnlineCount+=1;
            }
            else{
                 // for dance
                Object.entries(babelGroupObj).forEach(([key,value]) => {
                    if (value.includes(vendProductId)){
                        totalDancePBOnlinePrice += parseFloat(totalPrice);
                        totalDancePBOnlineCount+=1;
                    }
                });
            }
        }
        });

        var totalAdyen2Count = 0;
        var totalAdyen2Price = 0;
        adyenRes2 && adyenRes2.forEach(doc=>{
          const data = doc.data();
          const NotificationRequestItem = data.notificationItems && data.notificationItems[0] && data.notificationItems[0].NotificationRequestItem;
          const merchantReference = NotificationRequestItem && NotificationRequestItem.merchantReference; //invoiceId
          const merchantAccountCode = NotificationRequestItem && NotificationRequestItem.merchantAccountCode; // babelfit
          const eventDate = NotificationRequestItem && NotificationRequestItem.eventDate; 
          const eventCode = NotificationRequestItem && NotificationRequestItem.eventCode;
          const currency = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.currency; 
          const value = NotificationRequestItem && NotificationRequestItem.amount && NotificationRequestItem.amount.value; 
          const paymentMethod = NotificationRequestItem && NotificationRequestItem.paymentMethod; 
          const success = NotificationRequestItem && NotificationRequestItem.success; 
          const reason = NotificationRequestItem && NotificationRequestItem.reason; 
          const totalPrice = parseFloat(value)/100;

          if (eventCode && eventCode === 'AUTHORISATION' && success && success === 'true'){
            totalAdyen2Price+=totalPrice;
            totalAdyen2Count+=1;
          }
        });

        finalArray.push(
            [parseFloat(totalVendPrice).toFixed(2), totalVendCount, totalMembershipVendPrice, totalMembershipVendCount, totalDanceVendPrice, totalDanceVendCount], 
            [parseFloat(totalAdyenPrice).toFixed(2), totalAdyenCount, totalMembershipAdyenPrice, totalMembershipAdyenCount, totalDanceAdyenPrice, totalDanceAdyenCount], 
            [parseFloat(totalPBPrice).toFixed(2), totalPBCount, totalMembershipPBOnlinePrice, totalMembershipPBOnlineCount, totalDancePBOnlinePrice, totalDancePBOnlineCount],
            [parseFloat(totalAdyen2Price).toFixed(2), totalAdyen2Count], 
        );

        const updateSheetPromise = updateGoogleSheet({
            spreadsheetId: activeMembershipSheetId,
            resource: {
                // How the input data should be interpreted.
                valueInputOption: 'RAW',  // TODO: Update placeholder value.
                // The new values to apply to the spreadsheet.
                data: [
                {
                    range: `TOTAL TRANSACTION!B2:G`,
                    majorDimension: "ROWS",
                    values: finalArray
                }
                ],  // TODO: Update placeholder value.
        
                // TODO: Add desired properties to the request body.
            },
        });

        return updateSheetPromise.then((result)=>{
        // console.log('theresult: ', result);
            return res.status(200).send({
                success:true,
                packageVendProdIdArray,
                babelGroupObj
            });
        }).catch(error=>{
            return res.status(200).send({
                success:false,
                error
            });
        });
    });
});

// add all membership babel payment to sheet summary (just show price by package)
exports.addTotalPaymentByPackageSalesToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();s
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users')
  // .where('email', '==', 'lyanaothman2020@gmail.com')
  .get();
  // const usersQuery = admin.firestore().collection('users').get();

  // const startDate = '2017-06-01';
  // const endDate = '2022-06-30';
  const startDate = '2017-06-01';
  // const endDate = '2017-12-31';
  // const endDate = '2020-03-18';
  // const endDate = '2022-06-30';
  // const startDate = '2018-01-01';
  const endDate = '2024-12-31';
  
  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var finalUserData = [];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    // var userMap = {};
    // userResults.forEach(doc=>{
    //   const data = doc.data();
    //   if (data){
    //     userMap[doc.id] = data;
    //   }
    // });

    var paymentsForUserId = [];
    var paymentsByUserId = {};
    var payments = {};
    
    var paymentFreezeForUserId = [];
    var paymentFreezeByUserId = {};

    var paymentFreezeTerminatedForUserId = [];
    var paymentFreezeTerminatedByUserId = {};

    var paymentFreeForUserId = [];
    var paymentFreeByUserId = {};

    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const type = data && data.type;
        const userId = data && data.userId;
        const status = data && data.status;
        const source = data && data.source;
        const renewalTerm = data && data.renewalTerm;
        const quantity = data && (data.quantity?data.quantity:1);
        const transactionId = data && data.transactionId;
        const vendSaleId = data && data.vendSaleId;
        const packageId = data && data.packageId;
        const packageData = packageMap[packageId];
        const packageName = packageData && packageData.name;
        const packageBase = packageData && packageData.base;
        var totalPrice = data && data.totalPrice;

        // store the payment
        if((status === 'CLOSED' || status === 'LAYBY_CLOSED') && type === 'membership' && userId &&
        source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
       ){

        // store yearly package
        if (renewalTerm && (renewalTerm === 'yearly'||renewalTerm === 'year')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var i = 0; i< quantity*12; i++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(i, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId, 
              visitLeft: (quantity*12) - i,
              visitMax: quantity*12,
              packageName, totalPrice,
              pricePermonth:(totalPrice/(quantity*12)),
              cycle:`${i+1}/${quantity*12}`,
              cycleNumber:i+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'biyearly'||renewalTerm === 'biyear')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var j = 0; j< quantity*6; j++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(j, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*6 - j,
              visitMax: quantity*6,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*6)),
              cycle:`${j+1}/${quantity*6}`,
              cycleNumber:j+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'quarterly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var k = 0; k< quantity*3; k++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(k, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*3 - k,
              visitMax: quantity*3,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*3)),
              cycle:`${k+1}/${quantity*3}`,
              cycleNumber:k+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === '4monthly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var l = 0; l< quantity*4; l++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(l, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*4 - l,
              visitMax: quantity*4,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*4)),
              cycle:`${l+1}/${quantity*4}`,
              cycleNumber: l+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'month'||renewalTerm === 'monthly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
        
          if(totalPrice && (totalPrice === 0 || totalPrice === '0.00' || totalPrice === '0')){
          paymentsForUserId.push({
            createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
            paymentDate:createdAt,
            source, transactionId, vendSaleId,
            visitLeft: 1,
            visitMax: 1,
            packageName, totalPrice, 
            pricePermonth:(totalPrice/(quantity)),
            cycleNumber:1, packageBase,
            // cycle:`${m+1}/${quantity}`,
            quantity,
            status: 'reward / free'
          });
          }
          else{
            for (var m = 0; m< quantity; m++){
              paymentsForUserId.push({
                createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
                paymentDate:createdAt,
                source, transactionId, vendSaleId,
                visitLeft: 1,
                visitMax: 1,
                packageName, totalPrice, 
                pricePermonth:(totalPrice/(quantity)),
                cycle:`${m+1}/${quantity}`,
                cycleNumber:m+1,
                quantity, packageBase
              });
            }
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
      }
      else if (source && source === 'freezeTerminate'){
        paymentFreezeTerminatedForUserId = paymentFreezeTerminatedByUserId[userId] || [];
        paymentFreezeTerminatedForUserId.push(data);
        paymentFreezeTerminatedByUserId[userId] = paymentFreezeTerminatedForUserId;
      }
      else if (source && source === 'freeze'){
        paymentFreezeForUserId = paymentFreezeByUserId[userId] || [];
        for (var n = 0; n<quantity; n++){
          paymentFreezeForUserId.push(data);
          paymentFreezeByUserId[userId] = paymentFreezeForUserId;
          paymentFreezeByUserId[userId].freezeFor = data && data.freezeFor && moment(getTheDate(data.freezeFor)).add(n, 'months')
          paymentFreezeByUserId[userId].quantity = quantity;
        }
      }
      else if (source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
        paymentFreeForUserId = paymentFreeByUserId[userId] || [];
        paymentFreeForUserId.push(data);
        paymentFreeByUserId[userId] = paymentFreeForUserId;
        paymentFreeByUserId[userId].createdAt = data && data.createdAt && moment(getTheDate(data.createdAt))
      }
    }
    else{
      // console.log('not related data: ', data);
    }
    // else if (status === 'VOIDED'){
    //   console.log(moment(getTheDate(createdAt)).format('YYYY-MM-DD'));
    // }

    });

    userResults && userResults.forEach(doc=>{
      var paymentHistory = [];
      var combinedData = [];

      const data = doc && doc.data();
      const userId = doc.id;

      const name = data && data.name;
      const email = data && data.email;
      const phone = data && data.phone;
      const packageId = data && data.packageId;
      const packageData = packageMap[packageId];
      const packageName = packageData && packageData.name;
      const packageBase = (packageData && packageData.base)? packageData.base:"complimentary";
      const autoMembershipEnds = data && (data.autoMembershipEnds?data.autoMembershipEnds: data.membershipEnds?data.membershipEnds:null);
      const autoMembershipStarts = data && (data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null);
      const membershipStartText = autoMembershipStarts && moment(getTheDate(autoMembershipStarts)).format('YYYY-MM-DD')
      const startMoment = moment(getTheDate(autoMembershipStarts));
      const icNumber = (data && data.nric)? data.nric:'';
      const passportNumber = (data && data.passport)? data.passport:'';
      const race = (data && data.race)? data.race:'';
      const gender = (data && data.gender)? data.gender:'';
      const memberCurrentPkgBase = packageBase;
      const cancellationReason = data && data.cancellationReason;

       // add automembership start by 1 month
       const autoMembershipStartsAdd1Month = autoMembershipStarts && moment(getTheDate(autoMembershipStarts)).add(1,'momnths');
       const cancellationDate = data && data.cancellationDate;
       const cancellationFormat = cancellationDate &&  moment(getTheDate(cancellationDate)).format('YYYY-MM-DD');

       const freeAccessData = paymentFreeByUserId[userId];
       const freezeUserData = paymentFreezeByUserId[userId];
       const paymentUserData = paymentsByUserId[userId];
       const freezeTerminateUserData = paymentFreezeTerminatedByUserId[userId];

       // do the sorting
       freezeUserData && freezeUserData.sort((a,b)=>{
        const createdA = moment(getTheDate(a.freezeFor)).tz('Asia/Kuala_Lumpur').toDate();
        const createdB = moment(getTheDate(b.freezeFor)).tz('Asia/Kuala_Lumpur').toDate(); 
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });
      // freezeUserData && freezeUserData.reverse();

      freezeTerminateUserData && freezeTerminateUserData.sort((a,b)=>{
        const createdA = moment(getTheDate(a.freezeFor)).tz('Asia/Kuala_Lumpur').toDate();
        const createdB = moment(getTheDate(b.freezeFor)).tz('Asia/Kuala_Lumpur').toDate(); 
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });
      // freezeTerminateUserData && freezeTerminateUserData.reverse();
      freeAccessData && freeAccessData.sort((a,b)=>{
        // const createdA = moment(getTheDate(a.createdAt)).tz('Asia/Kuala_Lumpur').toDate();
        // const createdB = moment(getTheDate(b.createdAt)).tz('Asia/Kuala_Lumpur').toDate(); 
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });

      // freeAccessData && freeAccessData.reverse();
      paymentUserData && paymentUserData.sort((a,b)=>{
        // const createdA = moment(getTheDate(a.createdAt)).tz('Asia/Kuala_Lumpur').toDate();
        // const createdB = moment(getTheDate(b.createdAt)).tz('Asia/Kuala_Lumpur').toDate(); 
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        const cycleA = a.cycle;
        const cycleB = b.cycle;
        const cycleNumberA = a.cycleNumber;
        const cycleNumberB = b.cycleNumber;

        // if (cycleA < cycleB){return -1}
        // else if(cycleB < cycleA){return 1}

        if(createdA < createdB){return -1;
        }else if(createdB < createdA){return 1
        }

        if (cycleNumberA < cycleNumberB){return -1}
        else if(cycleNumberB < cycleNumberA){return 1}
        //else{return 0}
        else{return 0}
      });
      paymentUserData && paymentUserData.reverse();

      // const monthsDiff = Math.max(moment('2022-06-30').diff(moment('2018-01-01'), 'months')) + 1;
      const monthsDiff = Math.max(moment(endDate).diff(moment(startDate), 'months')) + 1;
      const userMonthsDiff = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment(getTheDate(autoMembershipEnds)), 'months')); 
      const userMonthsDiffSinceJan2018 = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment('2018-01-01'), 'months')); 

      if (autoMembershipStarts && autoMembershipEnds && (!email.includes('faizul'))){
        var isActiveMember;
        var isTerminatedMember;
        for (var i = 0; i<=monthsDiff; i++){
          // const iterationStartMoment = startMoment.clone().add(i, 'months');
          const iterationStartMoment = moment(startDate).clone().add(i, 'months');
          paymentHistory.push({iterationStartMoment, type:'', userId, text:''});
        }
        // console.log('paymentHistory: ', paymentHistory);
        
        paymentHistory && paymentHistory.forEach(doc=>{
          // isActiveMember = moment(getTheDate(autoMembershipEnds)).clone().isSameOrAfter(doc.iterationStartMoment)?'ACTIVE MEMBER':'NOT ACTIVE';
          // isTerminatedMember = (cancellationDate && moment(getTheDate(cancellationDate)).clone().isSameOrAfter(doc.iterationStartMoment))?'TERMINATED MEMBER':'NOT TERMINATED';
          
          isActiveMember = doc.iterationStartMoment.isSameOrBefore(moment(getTheDate(autoMembershipEnds)).subtract(1, 'months'))? 'ACTIVE MEMBER':'NOT ACTIVE';
          isTerminatedMember = (cancellationDate && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(cancellationDate)).subtract(1, 'months'))) ? 'TERMINATED MEMBER':'NOT TERMINATED';

          // if(moment(getTheDate(autoMembershipStarts)).isBetween(doc.iterationStartMoment.startOf('months'), doc.iterationStartMoment.endOf('month'))){

          // }
          if(freezeTerminateUserData && freezeTerminateUserData.length>0 
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).clone())
            // && doc.iterationStartMoment.isBefore(moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).clone().add('months', 1)) 
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            )
            {
              combinedData.push({
                date:freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor,
                memberBase: packageBase,
                type:`freezeTerminated
                `,
              })
              freezeTerminateUserData.pop();
          }
          else if (freezeUserData && freezeUserData.length>0
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).clone().subtract(1, 'months'))
            // && doc.iterationStartMoment.isBefore(moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).clone().add('months', 1)) 
            // && moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).isBetween(doc.iterationStartMoment.subtract(1, 'days'), doc.iterationStartMoment.add(1, 'months').add(1, 'days'))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                date:freezeUserData[freezeUserData.length-1].freezeFor,
                memberBase: packageBase,
                type:`freeze 
                `
              })
              freezeUserData.pop();
          }
          else if (freeAccessData && freeAccessData.length>0
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freeAccessData[freeAccessData.length-1].createdAt)))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                date:freeAccessData[freeAccessData.length-1].createdAt,
                type:`FREEACCESS `,
                source:'free',
                memberBase: packageBase,
              })
              freeAccessData.pop();
          }
          else if (paymentUserData && paymentUserData.length>0
            // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(paymentUserData[paymentUserData.length-1].createdAt)))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                // type: parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2),
                // packageName:paymentUserData[paymentUserData.length-1].packageName,
                date:paymentUserData[paymentUserData.length-1].createdAt,
                memberBase: packageBase,
                type: (paymentUserData[paymentUserData.length-1].pricePermonth)? `${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}` : 0,
                price: (paymentUserData[paymentUserData.length-1].pricePermonth)? `${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}` : 0

                // type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? `PAID : ${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                // \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                // `,
                

                // type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? `PAID : ${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                // \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                // \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
                // \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
                // \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
                // \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
                // \nMemberBase: ${packageBase}
                // \nPackageBase: ${(paymentUserData[paymentUserData.length-1].packageBase)? (paymentUserData[paymentUserData.length-1].packageBase):'complimentary'}
                // \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
                // \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
                // \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}
                // \n${isActiveMember}\n${isTerminatedMember}`,
                // transactionId:paymentUserData[paymentUserData.length-1].transactionId,
                // vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
                // packageName:paymentUserData[paymentUserData.length-1].packageName,
                // packageBase:paymentUserData[paymentUserData.length-1].packageBase,
              });
              
              paymentUserData.pop();
          }
          // place the remaining
          // else if (paymentUserData && paymentUserData.length>0){
          //   combinedData.push({
          //     date:paymentUserData[paymentUserData.length-1].createdAt,
          //     type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2):'0.00'}   
          //     \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
          //     \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
          //     \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
          //     \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
          //     \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
          //     \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
          //     \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
          //     \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}`,
          //     transactionId:paymentUserData[paymentUserData.length-1].transactionId,
          //     vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
          //     packageName:paymentUserData[paymentUserData.length-1].packageName
          //   })
          //   paymentUserData.pop();
          // }
          else if (doc.iterationStartMoment.isBefore(moment(getTheDate(autoMembershipStarts)).startOf('months'))){
          // else if (autoMembershipStartsAdd1Month && doc.iterationStartMoment.isBefore(autoMembershipStartsAdd1Month.startOf('months'))){
            combinedData.push({
               date:doc.iterationStartMoment.toDate(),
               type:`not yet started`
             }) 
          }
          // else if
          else{
            combinedData.push({
              date:doc.iterationStartMoment.toDate(),
              type:`unpaid \n${isActiveMember}\n${isTerminatedMember}`
            })
          }
        });
        // combinedData.reverse();

        //identify unknown packagebase
        combinedData.forEach((data, index) => {
          // if contain free access
          if (data.source && data.source === 'free'){
            // console.log('dataSource: ', data);
            // check for previous package base
            var i = index;
            combinedData.forEach((data2, index2) => {
              var j = index2;
              if (data2.packageBase){
                combinedData[index].packageBase = data2.packageBase;
              }
            });
            // while(index!=0 ){
            //   combinedData[index].packageBase = data.packageBase;
            // }
          }
          // if (!data.packageBase){
          //   if (!combinedData[index-1].packageBase)
          //     i = index;
          //     while(!combinedData[i].packageBase )
          //     i++;
          // }
        });

        var totalPayment = 0.00;
        var totalExtraMonth = 0;
        var totalExtraPay = 0.00;

        // 2nd loop for rechecking, if not exist, package base is memberBase
        combinedData.forEach((data, index) => {
          if (data.source && data.source === 'free' && !data.packageBase){
            combinedData[index].packageBase = data.memberBase;
          }
          if (data.price){
            const theTotalPrice = parseFloat(data.price);
            totalPayment+=theTotalPrice;
          }
          if (data.date && data.price){
            if (moment(getTheDate(data.date)).isSameOrAfter(moment())){
              totalExtraMonth+=1;
              const totalExtraPrice = parseFloat(data.price);
              totalExtraPay+=totalExtraPrice;
            }
          }
        });

        // console.log('combinedData: ', combinedData);

        if (combinedData && combinedData.length>=1){
          const paymentData = [
            name, email, packageName, membershipStartText, 
            icNumber, passportNumber, race, phone, gender, packageBase,
            cancellationDate? cancellationFormat: '', 
            cancellationReason? cancellationReason:'',
            
            // 2017 (June 2017)
            combinedData[0].type, // june 2017
            combinedData[1].type,
            combinedData[2].type,
            combinedData[3].type,
            combinedData[4].type,
            combinedData[5].type,
            combinedData[6].type,
            
            // 2018
            combinedData[6].type, // jan2018
            combinedData[7].type,
            combinedData[8].type,
            combinedData[9].type,
            combinedData[10].type,
            combinedData[11].type,
            combinedData[12].type,
            combinedData[13].type,
            combinedData[14].type,
            combinedData[15].type,
            combinedData[16].type,
            combinedData[17].type,

            // 2019
            combinedData[18].type, // jan2019
            combinedData[19].type,
            combinedData[20].type,
            combinedData[21].type,
            combinedData[22].type,
            combinedData[23].type,
            combinedData[24].type,
            combinedData[25].type,
            combinedData[26].type,
            combinedData[27].type,
            combinedData[28].type,
            combinedData[29].type,

            // 2020
            combinedData[30].type, // jan2020
            combinedData[31].type,
            combinedData[32].type,
            combinedData[33].type,
            combinedData[34].type,
            combinedData[35].type,
            combinedData[36].type,
            combinedData[37].type,
            combinedData[38].type,
            combinedData[39].type,
            combinedData[40].type,
            combinedData[41].type,

            // 2021
            combinedData[42].type, // jan 2021
            combinedData[43].type,
            combinedData[44].type,
            combinedData[45].type,
            combinedData[46].type,
            combinedData[47].type,
            combinedData[48].type,
            combinedData[49].type,
            combinedData[50].type,
            combinedData[51].type,
            combinedData[52].type,
            combinedData[53].type,

            // 2022
            combinedData[54].type, // jan 2022
            combinedData[55].type,
            combinedData[56].type,
            combinedData[57].type,
            combinedData[58].type,
            combinedData[59].type,
            combinedData[60].type,
            combinedData[61].type,
            combinedData[62].type,
            combinedData[63].type,
            combinedData[64].type,
            combinedData[65].type,

            // 2023
            combinedData[66].type, // jan 2023
            combinedData[67].type,
            combinedData[68].type,
            combinedData[69].type,
            combinedData[70].type,
            combinedData[71].type,
            combinedData[72].type,
            combinedData[73].type,
            combinedData[74].type,
            combinedData[75].type,
            combinedData[76].type,
            combinedData[77].type,

             // 2024
            combinedData[78].type, // jan 2024
            combinedData[79].type,
            combinedData[80].type,
            combinedData[81].type,
            combinedData[82].type,
            combinedData[83].type,
            combinedData[84].type,
            combinedData[85].type,
            combinedData[86].type,
            combinedData[87].type,
            combinedData[88].type,
            combinedData[89].type,

              // for total price
            totalPayment? totalPayment.toFixed(2):0,
            totalExtraPay, 
            totalExtraMonth
          ];


          finalUserData.push(paymentData);
        }
      }
    });
    // console.log('payments: ', payments);

    // convert array to object?
    // combinedData && combinedData.forEach((data, index)=>{
        
    // });

    
    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: allUserSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `AUTO MEMBERSHIP PAYMENT MONTHLY SUMMARY!A2:DG`,
            majorDimension: "ROWS",
            values: finalUserData
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        // payments: finalUserData,
      });
    }).catch(error=>{
      return res.status(200).send({
        success:false,
        error
        // payments: finalUserData,
      });
    })
  });
});

exports.addOutstandingPaymentToSheet = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments')
    .where('type', '==', 'membership')
    // .where('userId', '==', 'KiUWdU0l1NhFxOU1K2va8sR0ztB2')
    .get();

  return Promise.all([usersQuery, packageQuery, paymentQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const usersResults = result[0];
    const packageResults = result[1];
    const paymentResults = result[2];
    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var pkgMap = {};
    packageResults && packageResults.forEach(pkg=>{
      pkgMap[pkg.id] = pkg.data();
    });

    var paymentMap = {};
    var paymentArray = [];
   
    paymentResults && paymentResults.forEach(doc=>{
      const data = doc.data();
      const source = data && data.source;
      const userId = data && data.userId;
      const status = data && data.status;
      // if (source && source !== 'freeze'){
      if (source){
        paymentArray = paymentMap[userId] || [];
        paymentArray.push(data);
        paymentMap[userId]=paymentArray;
      }
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
        const packageBase = packageData && packageData.base;
        const packagePrice = packageData && packageData.price;
        // const isKLCCPkg = packageId && isKLCCPackage(packageId);
        const isKLCCPkg = packageBase && (packageBase === 'KLCC');
        const promoJan2020 = data && data.promoJan2020;
        const phone = data && data.phone;
        const malaysiaPhoneNum = phone? (typeof phone === 'string')? (phone.charAt(0)==='0')? `6${phone}`:phone:phone:null;
        // const isSpecialFreeze2021Data = freezeMap[user.id];
        // const isContainFreeze = freezeMap[user.id];
        const achieveTarget = data && data.achieveTarget;
        const paymentData = paymentMap[user.id];

        var totalPaymentMade = 0.00;
        var zeroPaymentCount = 0;
        var freezeCount = 0;
        var normalFreezeCount = 0;
        var specialFreezeCount = 0;
        var specialFreeze4Count = 0;
        var totalOwePayment = 0.00;

        var latestZeroPaymentArray = [];

        paymentData && paymentData.forEach(payment=>{
          // const totalPrice = (payment.totalPrice).toString();
          const totalPrice = parseFloat(payment.totalPrice);
          const paymentId = payment.id;
          const paymentData = payment;
          paymentData.id = payment.id;
          // totalPaymentMade+=parseFloat(totalPrice).toFixed(2);
          const status = payment.status;
          if (status && status === 'CLOSED'){
            totalPaymentMade+=totalPrice;
          }
          const createdAt = payment && payment.createdAt;
          const vendSaleId = payment && payment.vendSaleId;

          const source = payment.source;
          const freezeType = payment.freezeType;
          const validFreezeFor = payment.freezeFor && moment(getTheDate(payment.freezeFor)).isSameOrAfter(moment());
          const validCreatedAt = payment.createdAt && moment(getTheDate(payment.createdAt)).isSameOrAfter(moment('2020-12-31'));

          if (totalPrice === 0 && source && source!=='freeze' && status && status === 'CLOSED'){
            if (latestZeroPaymentArray.length === 0){
              latestZeroPaymentArray.push(paymentData);
            }
            else if (latestZeroPaymentArray.length>0){
              latestZeroPaymentArray && latestZeroPaymentArray.forEach(zeroPayment=>{
                const zeroPayCreatedAt = zeroPayment.createdAt;
                if (moment(getTheDate(createdAt)).isSame(moment(getTheDate(zeroPayCreatedAt)), 'day') && (zeroPayment.id != payment.id)){
                  latestZeroPaymentArray.push(paymentData);
                }
                else if(moment(getTheDate(createdAt)).isAfter(moment(getTheDate(zeroPayCreatedAt)), 'day') && (zeroPayment.id != payment.id)){
                  // latestZeroPaymentArray = []; //reset 
                  latestZeroPaymentArray.push(paymentData);
                }
              });
            }
          }

          // to compare with zero payment
          // if (latestZeroPaymentArray && latestZeroPaymentArray.length > 0 && totalPrice === 0 && source && source!=='freeze' && status && status === 'CLOSED'){
          //   latestZeroPaymentArray && latestZeroPaymentArray.forEach(zeroPayment=>{
          //     const zeroCreatedAt = zeroPayment.createdAt;
          //     if (moment(getTheDate(createdAt)).isSame(moment(getTheDate(zeroCreatedAt))), 'day'){
          //       latestZeroPaymentArray.push(payment);
          //     }
          //     else if (moment(getTheDate(createdAt)).isAfter(moment(getTheDate(zeroCreatedAt))), 'day'){
          //       latestZeroPaymentArray = []; // clear the array and reeinsert
          //       latestZeroPaymentArray.push(payment);
          //     }
          //   });
          // }
          // else if (totalPrice === 0 && source && source!=='freeze' && status && status === 'CLOSED' && latestZeroPaymentArray.length === 0){
          //   latestZeroPaymentArray.push(payment);
          // }

          // console.log('totalPaymentMade: ', totalPaymentMade);
          if (totalPrice === 0
            && source && source!='freeze' 
            && status && status === 'CLOSED'
            && validCreatedAt
            ){
            zeroPaymentCount+=1;
          }
          else if (source && source === 'freeze' && !freezeType && validFreezeFor){
            normalFreezeCount+=1;
            freezeCount+=1;
          }
          else if (source && source === 'freeze' && freezeType && validFreezeFor){
            specialFreezeCount+=1;
            freezeCount+=1;
          }
          if (source && source === 'freeze' && freezeType && freezeType.includes('specialFreezeQ')){
            specialFreeze4Count+=1;
          }
        });

        var monthDiff = 0;
        const membershipEndsDate = autoMembershipEnds? moment(getTheDate(autoMembershipEnds)):membershipEnds?moment(getTheDate(membershipEnds)):null;
        const membershipStartsDate = membershipStarts? moment(getTheDate(membershipStarts)):null;

        const todayDate = moment().tz("Asia/Kuala_Lumpur").startOf('day'); // hardcode for June 2021
        monthDiff = (membershipEndsDate && membershipStartsDate)? (membershipEndsDate.diff(membershipStartsDate, 'months')):0;

        // extra month
        var monthDiffUptillToday = (membershipEndsDate && membershipStartsDate)? (membershipEndsDate.isSameOrAfter(todayDate))?
          `${(membershipEndsDate.diff(todayDate, 'months'))}`: `${(membershipEndsDate.diff(todayDate, 'months'))}`:0;

        var monthDiffWithoutFreeze = monthDiffUptillToday - freezeCount - zeroPaymentCount;
        
        var totalOwe = 0;
        totalOwe = (monthDiffWithoutFreeze)*parseFloat(packagePrice).toFixed(2);
        // totalOwe = (monthDiffUptillToday-zeroPaymentCount)*parseFloat(packagePrice).toFixed(2);
        // Object.entries(paymentData).forEach(([key,value]) => {
        //   console.log('thevalue: ', value)
        //   const totalPrice = value.totalPrice;
        //   console.log('totalPrice: ', totalPrice);
        // });
        // const totalPayment = paymentData && parseFloat(paymentData.totalPrice).toFixed(2);

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
          malaysiaPhoneNum? malaysiaPhoneNum:'',
          data.email ? data.email : '',
          data.mcId ? data.mcId : '',
          // data.packageId ? data.packageId : '',
          isKLCCPkg? 'KLCC': ' ',
          packageName,
          data.paymentMode ? data.paymentMode : '',
          membershipStarts ? moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          membershipEnds ? moment(getTheDate(data.membershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          autoMembershipEnds ? moment(getTheDate(data.autoMembershipEnds)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          totalPaymentMade,
          monthDiff,
          monthDiffWithoutFreeze,
          totalOwe, 
          zeroPaymentCount,
          // latestZeroPaymentArray.length,
          freezeCount,
          normalFreezeCount,
          specialFreeze4Count,
          // specialFreezeCount,
          // data.autoDiff ? data.autoDiff : '',
          // data.freeMonths ? data.freeMonths : '',
          // data.freePT ? data.freePT : '',
          // data.freeGift ? data.freeGift : '',
          data.referredByUserId ? data.referredByUserId : '',
          data.trainerId ? data.trainerId : '',
          data.inductionDate ? moment(getTheDate(data.inductionDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.inductionDone ? data.inductionDone : '',
          data.cancellationDate ? moment(getTheDate(data.cancellationDate)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          data.cancellationReason ? data.cancellationReason : '',
          data.remarks ? data.remarks : '',
          data.hasRecurring? data.hasRecurring:'false',
          data.isStaff? data.isStaff:'',
          data.promoJan2020? data.promoJan2020:'null',
          data.promoAug2020? data.promoAug2020: 'null',
          data.promoSep2020? data.promoSep2020: 'null',
          data.promoMidSep2020? data.promoMidSep2020: 'null',
          data.PrivateClassCredit? data.PrivateClassCredit:'',
          achieveTarget? achieveTarget:'no target yet'
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
      spreadsheetId: allUserSheetId,
      // valueInputOption: 'RAW',
      
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `USERS!A2:AX`,
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
        // paymentMap
        // users: users,
        // theResponse
        // userCount
      });
    }).catch(error=>{
      return res.status(200).send({
        error
      });
    })
  });
});

// add unpaid invoice to sheet
exports.addUnpaidInvoiceToSheets = functions.https.onRequest((req, res) => {
  
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  const invoiceQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership').get();
  // where('email', '==', 'tehowny@gmail.com').get()
  const packagesQuery = admin.firestore().collection('packages').get();
  const gantnerQuery = admin.firestore().collection('gantnerLogs')
  // .where('authorized', '==', true)
  .where('createdAt', '>=', moment('2021-09-24').startOf('day').toDate())
  .orderBy('createdAt', 'desc')
  // .limit(1)
  .get();

  return Promise.all([invoiceQuery, usersQuery, packagesQuery, gantnerQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const invoiceResults = result[0];
    const userResults = result[1];
    const packageResults = result[2];
    const gantnerResults = result[3];

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

    var gantnerMap = {};
    gantnerResults && gantnerResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const createdAt = data && data.createdAt;
      gantnerMap[userId]=data;
      // if (gantnerMap[userId].createdAt 
      //   // && moment(getTheDate(gantnerMap[userId].createdAt)).isAfter(moment(getTheDate(createdAt)))
      //   && moment(getTheDate(createdAt)).isAfter(moment(getTheDate(gantnerMap[userId].createdAt)))
      //   ){
      //   // replace with the new data
      //   gantnerMap[userId]=data;
      // }
      // else{
      //   gantnerMap[userId]=data;
      // }
      //gantnerMap[userId]=data;
    });

    // console.log('gantnerMap: ', gantnerMap);
    
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
        const userPrevPkgId = data.prevPackageId? data.prevPackageId:null;
        const userPrevPkgData = userPrevPkgId? packageMap[userPrevPkgId]:null;
        const userPrevPkgName = userPrevPkgData && userPrevPkgData.name;
        const paid = data.paid? data.paid:" ";
        const invoiceMailed = data.invoiceMailed? data.invoiceMailed: " ";
        const invoiceMailedAt = data.invoiceMailedAt? moment(getTheDate(data.invoiceMailedAt)).format('YYYYMMDD'):" ";
        const promoJan2020 = userData? userData.promoJan2020? userData.promoJan2020:" ":" ";
        const promoAug2020 = userData? userData.promoAug2020? userData.promoAug2020:" ":" ";
        const hasRecurring = userData? userData.hasRecurring? userData.hasRecurring:false:false;
        const amount = data.amount? data.amount:' ';
        const gantnerData = gantnerMap[userId]||null;
        const lastCheckIn = (gantnerData && gantnerData.createdAt)? moment(getTheDate(gantnerData.createdAt)).tz('Asia/Kuala_Lumpur').format('YYYYMMDD'):'no last check in';
        const chargeAttempts = data.chargeAttempts? data.chargeAttempts:null;
        const paymentFailed = data.paymentFailed? data.paymentFailed:null;

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
          userPrevPkgName,
          invoiceMailed, invoiceMailedAt,
          promoJan2020,
          promoAug2020,
          paid,
          hasRecurring,
          lastCheckIn,
          chargeAttempts,
          paymentFailed
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
      spreadsheetId: invoicesSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `UNPAID INVOICES!A2:AA`,
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

// add babel exclusive booking to sheet
exports.addBabelExclusiveBookingToSheets = functions.https.onRequest((req, res) => {
  
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const bookingQuery = admin.firestore().collection('bookings').where('type', '==', 'babelExclusive').get();
  const usersQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();  
  const packagesQuery = admin.firestore().collection('packages').get();
  const classQuery = admin.firestore().collection('classes').where('classType', '==', 'vClass').get();
  const roomQuery = admin.firestore().collection('rooms').get();

  return Promise.all([bookingQuery, usersQuery, packagesQuery, classQuery, roomQuery]).then(result=>{
    const bookingRes = result[0];
    const userResults = result[1];
    const packageResults = result[2];
    const classRes = result[3];
    const roomRes = result[4];

    var userMap = {};
    userResults.forEach(doc=>{
      userMap[doc.id] = doc.data()
    });

    var packageMap = {};
    packageResults.forEach(doc=>{packageMap[doc.id] = doc.data()});
    
    var classMap = {};
    classRes.forEach(doc=>{classMap[doc.id]=doc.data()});

    var roomMap = {};
    roomRes.forEach(doc=>{roomMap[doc.id]=doc.data()});

    var bookings = [];
    bookingRes.forEach(doc=>{
      if (doc && doc.data()){
        const data = doc.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
        const hostId = data.hostId? data.hostId:null;
        const hostData = hostId && userMap[hostId];
        const hostEmail = data.hostEmail? data.hostEmail:'';
        const location = data.location? data.location:'';
        const hostName = data.name? data.name:'';
        const classId = data.classId? data.classId:null;
        const classData = classId && classMap[classId];
        const className = classData.name? classData.name:'';
        const confirmAt = data.confirmAt? getTheDateFormat(data.confirmAt): '';
        const confirmBy = data.confirmBy? data.confirmBy:'';
        const confirmEmailSend = data.confirmEmailSend? data.confirmEmailSend:'FALSE';
        const confirmEmailSendAt = data.confirmEmailSendAt? getTheDateFormat(data.confirmEmailSendAt):'';
        const confirmWhatsappSend = data.confirmWhatsappSend? data.confirmWhatsappSend:'';
        const confirmWhatsappSendAt = data.confirmWhatsappSendAt? getTheDateFormat(data.confirmWhatsappSendAt):'';
        const roomId = data && data.roomId;
        const roomData = roomId && roomMap[roomId];
        const roomName = roomData && roomData.name? roomData.name:'';
        const startAt = data.startAt? getTheDateFormat(data.startAt):'';
        const status = data.status? data.status:'';
        const trainerId = data.trainerId;
        const trainerData = trainerId && userMap[trainerId];
        const trainerName = (trainerData && trainerData.name)? trainerData.name:'';
        const trainerEmail = (trainerData && trainerData.email)? trainerData.email:'';
        const type = data.type? data.type:'';
        const updatedAt = data.updatedAt? getTheDateFormat(data.updatedAt):'';
        const cancelAt = data.cancelAt? getTheDateFormat(data.cancelAt):'';
        const cancelBy = data.cancelBy? data.cancelBy:'';
        const cancelEmailSend = data.cancelEmailSend? true:false;
        const cancelEmailSendAt = data.cancelEmailSendAt? getTheDateFormat(data.cancelEmailSendAt):'';
        const cancelWhatsappSend = data.cancelWhatsappSend? true:false;
        const cancelWhatsappSendAt = data.cancelWhatsappSendAt? getTheDateFormat(data.cancelWhatsappSendAt):'';

        const userMapList = data.userMap; // todo...
        var userArray = [];
        var userCombinedString;
        var userCombinedStringArray = [];
        if (userMapList && Object.keys(userMapList).length > 0){
          Object.entries(userMapList).forEach(([key,values])=> {
            userArray.push(values);
            const name = values.name? values.name:'';
            const phoneNumber = values.phoneNumber? values.phoneNumber:'';
            const userType = values.userType? values.userType:'';
            const email = values.email? values.email:'';
            const createdAt = values.createdAt? getTheDateFormat(values.createdAt):'';
            // userCombinedString += `${createdAt}` + `,` + `${name}` + `,` + `${email}` + `,` + `${userType}` + `,`;
            userCombinedStringArray.push(createdAt, name, email, userType);
          });
          userCombinedString = userCombinedStringArray.join(",");
        }

        const bookingData = [
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD') : '',
          createdAt? moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').format('hh:mm:ss') : '',
          doc.id,
          hostName,
          hostEmail,
          confirmAt,
          confirmBy,
          confirmEmailSend,
          confirmEmailSendAt,
          confirmWhatsappSend,
          confirmWhatsappSendAt,
          roomName,
          startAt,
          status,
          trainerName, 
          trainerEmail,
          type,
          updatedAt,
          cancelAt,
          cancelBy,
          cancelEmailSend,
          cancelEmailSendAt,
          cancelWhatsappSend,
          cancelWhatsappSendAt,
          userCombinedString
        ];
        bookings.push(bookingData);
      }
    });

    bookings.sort((a,b)=>{
      var dateA = new Date(a[0]);
      var dateB = new Date(b[0]);
      if (dateA < dateB) {return -1}
      if (dateA > dateB) {return 1}
      return 0;
    });

    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: babelExclusiveId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `BOOKINGS!A2:BZ`,
            majorDimension: "ROWS",
            values: bookings
          }
        ],
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true, bookings
      });
    });
  });
});

// add babel regain user to sheets
exports.addRegainUsersToSheets = functions.https.onRequest((req, res) => {

  const userQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').where('source', '==', 'vend').get();
  const gantnerQuery = admin.firestore().collection('gantnerLogs').where('authorized', '==', true).get();

  return Promise.all([userQuery, paymentQuery, gantnerQuery]).then(results=>{
    const userRes = results[0];
    const paymentRes = results[1];
    const gantnerRes = results[2];

    var paymentMap = {};
    var gantnerMap = {};
    var userSheets = [];

    gantnerRes && gantnerRes.forEach(doc=>{
      const data = doc.data();
      data.count = 1;
      const userId = data && data.userId;
      if (userId && !gantnerMap[userId]){
        gantnerMap[userId] = data;
        // gantnerMap[userId].count = 1;
      }
      // else if (userId && gantnerMap[userId] && !gantnerMap[userId].count){
      //   gantnerMap[userId] = data;

      // }
      else if (userId && gantnerMap[userId] && gantnerMap[userId].count){
        // data.count = data.count + 1;
        gantnerMap[userId].count += 1;
      }
    });

    paymentRes && paymentRes.forEach(doc=>{
      const data = doc.data();
      const note = data && data.note;
      const status = data && data.status;
      const userId = data && data.userId;
      if (userId && note && note.toLowerCase().includes('regain') && status && status === 'CLOSED'){
        paymentMap[userId] = data;
      }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const userPaymentData = userId && paymentMap[userId];
      const email = data && data.email;
      const name = data && data.name;
      const phone = data && data.phone;
      const paymentNote = userPaymentData && userPaymentData.note;
      const paymentOutlet = userPaymentData && userPaymentData.outlet;
      const gantnerData = userId && gantnerMap[userId];
      const gantnerCount = gantnerData && gantnerData.count;

      if (userPaymentData){
        var userInfo = [
          name? name:'',
          email? email:'',
          gantnerCount? Math.floor(gantnerCount/2):0,
          paymentOutlet? paymentOutlet:'',
          phone? phone:'',
          paymentNote? paymentNote:''
        ];
        userSheets.push(userInfo);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: allUserSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `REGAIN USERS!A2:AZ`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true, userSheets
      });
    });
  });
});

// add visitors to sheets
exports.addVisitorsToSheet = functions.https.onRequest((req, res) => {
  const userQuery = admin.firestore().collection('users').get();
  return Promise.all([userQuery]).then(results=>{
    const userRes = results[0];

    var croMap = {};
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const roles = data && data.roles;
      const staffRole = data && data.staffRole;
      if (roles || staffRole){
        croMap[doc.id]=data;
      }
    });

    var userSheets = [];
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;
      const userId = doc.id;
      const name = data && data.name;
      const firstName = data && data.firstName;
      const lastName = data && data.lastName;
      const icNumber = data && (data.nric || data.icNumber);
      const race = data && data.race;
      const gender = data && data.gender;
      const phone = data && data.phone;
      const email = data && data.email;
      const mcId = data && data.mcId;
      const croData = mcId && croMap[mcId];
      const croName = croData && croData.name;
      const firstJoinVisit = data && data.firstJoinVisit;
    
      if (data && userIsMember(data) === false){
        var userData = [
          createdAt? getTheDateFormat(createdAt):'',
          joinDate? getTheDateFormat(joinDate):'',
          userId? userId:'',
          name? name:'',
          firstName? firstName:'',
          lastName? lastName:'',
          email? email:'',
          race? race:'',
          gender? gender:'',
          phone? phone:'',
          icNumber? icNumber:'',
          mcId? mcId:'',
          croName? croName:'',
          firstJoinVisit? firstJoinVisit:''
        ];
        userSheets.push(userData);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: allUserSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `VISITORS!A2:Z`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true, userSheets
      });
    });
  });
});

// add memberLastPayment to sheet (for PGM) 
exports.addMemberLastPaymentToSheet = functions.https.onRequest((req, res) => {
  const userQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  const packageQuery = admin.firestore().collection('packages').get();

  const startDate = '2017-06-01';
  const endDate = '2024-12-31';
  const monthsDiff = Math.max(moment(endDate).diff(moment(startDate), 'months')) + 1;

  return Promise.all([userQuery, paymentQuery, packageQuery]).then(results=>{
    const userRes = results[0];
    const paymentRes = results[1];
    const pkgRes = results[2];

    var paymentMap = {};
    var freezeMap = {};
    var freezesForUserId = [];
    var freezesByUserId = {};
    var pkgMap = {};

    var paymentMapByUserId = {};
    var lastPaymentMapByUserId = {};
    var paymentsForUserId = [];

    var freePaymentMapByUserId = {};
    var freePaymentForUserId = [];
   
    paymentRes && paymentRes.forEach(doc=>{
      const data = doc.data();
      const source = data && data.source;
      const userId = data && data.userId;
      const status = data && data.status;
      const createdAt = data && data.createdAt;
      const renewalTerm = data && data.renewalTerm;
      const quantity = data && data.quantity||1;
      const totalPrice = data && data.totalPrice;
      const transactionId = data && data.transactionId;
      const vendSaleId = data && data.vendSaleId;
      const packageId = data && data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const packageName = packageData && packageData.name;
      const packageBase = packageData && packageData.base;

      if (userId && source && source.includes('freeze')){
        freezeMap[doc.id] = data;
        freezesForUserId = freezesByUserId[userId]||[];
        freezesForUserId.push({...data});
        freezesByUserId[userId] = freezesForUserId;
      }
      else{

        if(userId && (status && (status === 'CLOSED' || status === 'LAYBY_CLOSED')) &&
          source 
          && (source === 'vend' || source === 'adyen' || source === 'pbonline')
         ){
          paymentMap[doc.id]=data;
        
            // store yearly package
            if (renewalTerm && (renewalTerm === 'yearly'||renewalTerm === 'year')){
              paymentsForUserId = paymentMapByUserId[userId] || [];
              for (var i = 0; i< quantity*12; i++){
                paymentsForUserId.push({
                  createdAt:moment(getTheDate(createdAt)).add(i, 'months'),
                  paymentDate:createdAt,
                  source, transactionId, vendSaleId, 
                  visitLeft: (quantity*12) - i,
                  visitMax: quantity*12,
                  packageName, totalPrice,
                  pricePermonth:(totalPrice/(quantity*12)),
                  cycle:`${i+1}/${quantity*12}`,
                  cycleNumber:i+1,
                  quantity, packageBase,
                  paymentId:doc.id
                });
              }
              paymentMapByUserId[userId] = paymentsForUserId;
            }
            else if (renewalTerm && (renewalTerm === 'biyearly'||renewalTerm === 'biyear')){
              paymentsForUserId = paymentMapByUserId[userId] || [];
              for (var j = 0; j< quantity*6; j++){
                paymentsForUserId.push({
                  createdAt:moment(getTheDate(createdAt)).add(j, 'months'),
                  paymentDate:createdAt,
                  source, transactionId, vendSaleId,
                  visitLeft: quantity*6 - j,
                  visitMax: quantity*6,
                  packageName, totalPrice, 
                  pricePermonth:(totalPrice/(quantity*6)),
                  cycle:`${j+1}/${quantity*6}`,
                  cycleNumber:j+1,
                  quantity, packageBase,
                  paymentId:doc.id
                });
              }
              paymentMapByUserId[userId] = paymentsForUserId;
            }
            else if (renewalTerm && (renewalTerm === 'quarterly')){
              paymentsForUserId = paymentMapByUserId[userId] || [];
              for (var k = 0; k< quantity*3; k++){
                paymentsForUserId.push({
                  createdAt:moment(getTheDate(createdAt)).add(k, 'months'),
                  paymentDate:createdAt,
                  source, transactionId, vendSaleId,
                  visitLeft: quantity*3 - k,
                  visitMax: quantity*3,
                  packageName, totalPrice, 
                  pricePermonth:(totalPrice/(quantity*3)),
                  cycle:`${k+1}/${quantity*3}`,
                  cycleNumber:k+1,
                  quantity, packageBase,
                  paymentId:doc.id
                });
              }
              paymentMapByUserId[userId] = paymentsForUserId;
            }
            else if (renewalTerm && (renewalTerm === '4monthly')){
              paymentsForUserId = paymentMapByUserId[userId] || [];
              for (var l = 0; l< quantity*4; l++){
                paymentsForUserId.push({
                  createdAt:moment(getTheDate(createdAt)).add(l, 'months'),
                  paymentDate:createdAt,
                  source, transactionId, vendSaleId,
                  visitLeft: quantity*4 - l,
                  visitMax: quantity*4,
                  packageName, totalPrice, 
                  pricePermonth:(totalPrice/(quantity*4)),
                  cycle:`${l+1}/${quantity*4}`,
                  cycleNumber: l+1,
                  quantity, packageBase,
                  paymentId:doc.id
                });
              }
              paymentMapByUserId[userId] = paymentsForUserId;
            }
            else if (renewalTerm && (renewalTerm === 'month'||renewalTerm === 'monthly')){
              paymentsForUserId = paymentMapByUserId[userId] || [];
            
              if(totalPrice && (totalPrice === 0 || totalPrice === '0.00' || totalPrice === '0')){
              paymentsForUserId.push({
                createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
                paymentDate:createdAt,
                source, transactionId, vendSaleId,
                visitLeft: 1,
                visitMax: 1,
                packageName, totalPrice, 
                pricePermonth:(totalPrice/(quantity)),
                cycleNumber:1, packageBase,
                // cycle:`${m+1}/${quantity}`,
                quantity,
                status: 'reward / free',
                paymentId:doc.id
              });
              }
              else{
                for (var m = 0; m< quantity; m++){
                  paymentsForUserId.push({
                    createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
                    paymentDate:createdAt,
                    source, transactionId, vendSaleId,
                    visitLeft: 1,
                    visitMax: 1,
                    packageName, totalPrice, 
                    pricePermonth:(totalPrice/(quantity)),
                    cycle:`${m+1}/${quantity}`,
                    cycleNumber:m+1,
                    quantity, packageBase,
                    paymentId:doc.id
                  });
                }
              }
              paymentMapByUserId[userId] = paymentsForUserId;
            }
          }

          // paymentsForUserId = paymentMapByUserId[userId] || [];
          // paymentsForUserId.push({...data});
          // paymentMapByUserId[userId] = paymentsForUserId;
        
        else if (userId && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
          freePaymentForUserId = freePaymentMapByUserId[userId] || [];
          freePaymentForUserId.push({...data});
          freePaymentMapByUserId[userId] = freePaymentForUserId;
        }
      }
    });

    pkgRes && pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});

    var userSheets = [];
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const name = data && data.name;
      const email = data && data.email;
      const phone = data && data.phone;
      const membershipStarts = data && data.membershipStarts;
      const autoMembershipStarts = data && data.autoMembershipStarts;
      const membershipEnds = data && data.membershipEnds;
      const autoMembershipEnds = data && data.autoMembershipEnds;
      const createdAt = data && data.createdAt;
      const packageId = data && data.packageId;
      const userPackageData = packageId && pkgMap[packageId];
      const userPackageName = userPackageData && userPackageData.name;
      const userPackageBase = userPackageData && userPackageData.base;
      const cancellationDate = data && data.cancellationDate;
      const cancellationReason = data && data.cancellationReason;
      const paymentUserData = paymentMapByUserId[doc.id];
      const freezeUserData = freezesByUserId[doc.id];
      const freePaymentUserData = freePaymentMapByUserId[doc.id];
      var combinedData = [];
      var paymentHistory = [];

      // sorting...
      paymentUserData && paymentUserData.sort((a,b)=>{
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        const cycleNumberA = a.cycleNumber;
        const cycleNumberB = b.cycleNumber;

        if(createdA < createdB){return -1;
        }else if(createdB < createdA){return 1}
        if (cycleNumberA < cycleNumberB){return -1}
        else if(cycleNumberB < cycleNumberA){return 1}
        else{return 0}
      });
      paymentUserData && paymentUserData.reverse();

      paymentUserData && paymentUserData.forEach((data, index, array)=>{
        // var lastDate = paymentUserData[0];
        const paymentDate = data && data.paymentDate;
        if (paymentDate && (index === 0 || (moment(getTheDate(paymentDate)).isSameOrAfter(moment(getTheDate(array[0].paymentDate)))))){
         array[index].lastDate = paymentDate;
        }
        // else if (paymentDate && ){
        //   var lastDate = moment(getTheDate(paymentDate)).isSameOrAfter(moment(getTheDate(array[index].paymentDate)))? paymentDate:array[0];
        //   array[index].lastDate = paymentDate;
        // }
      });

      var lastDate;
      var lastPaymentUserData = paymentUserData && paymentUserData.filter((data, index)=>{
          const paymentDate = data && data.paymentDate;
          if (index === 0){
            lastDate = paymentDate;
          }
          else{
            if (paymentDate && moment(getTheDate(paymentDate)).isSameOrAfter(moment(getTheDate(lastDate)))){
              lastDate = paymentDate;
            }
          }
          return lastDate;
        });

      freezeUserData && freezeUserData.sort((a,b)=>{
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        if(createdA < createdB){return -1;
        }else if(createdB < createdA){return 1
        }
        else{return 0}
      });
      freezeUserData && freezeUserData.reverse();

      freePaymentUserData && freePaymentUserData.sort((a,b)=>{
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        if(createdA < createdB){return -1;
        }else if(createdB < createdA){return 1
        }
        else{return 0}
      });
      freePaymentUserData && freePaymentUserData.reverse();

      if (packageId){

        // if (paymentData){
          for (var i = 0; i<=monthsDiff; i++){
            // const iterationStartMoment = startMoment.clone().add(i, 'months');
            const iterationStartMoment = moment(startDate).clone().add(i, 'months');
            paymentHistory.push({iterationStartMoment, userId:doc.id});
          }

          paymentHistory && paymentHistory.forEach(doc=>{
            if(freezeUserData && freezeUserData.length>0 
              && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).clone())
              && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)))
              )
              {
                combinedData.push({
                  date:freezeUserData[freezeUserData.length-1].freezeFor,
                  memberBase: userPackageBase,
                  type:`${freezeUserData[freezeUserData.length-1].source} date:${getTheDateFormat(freezeUserData[freezeUserData.length-1].freezeFor, 'DD-MM-YYYY')}`,
                })
                freezeUserData.pop();
            }

            else if (freePaymentUserData && freePaymentUserData.length>0
              && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freePaymentUserData[freePaymentUserData.length-1].createdAt)))
              && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
              // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
              ){
                combinedData.push({
                  date:freePaymentUserData[freePaymentUserData.length-1].createdAt,
                  type:`FREEACCESS `,
                  source:'free',
                  memberBase:userPackageBase,
                })
                freePaymentUserData.pop();
            }
            else if (paymentUserData && paymentUserData.length>0
              // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(paymentUserData[paymentUserData.length-1].createdAt)))
              && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
              // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
              ){
                combinedData.push({
                  // type: parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2),
                  // packageName:paymentUserData[paymentUserData.length-1].packageName,
                  date:paymentUserData[paymentUserData.length-1].createdAt,
                  memberBase: userPackageBase,
                  type: (paymentUserData[paymentUserData.length-1].pricePermonth)? `${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)} \n LastDate: ${getTheDateFormat(paymentUserData[paymentUserData.length-1].lastDate, 'DD-MM-YYYY')}` : 0,
                  price: (paymentUserData[paymentUserData.length-1].pricePermonth)? `${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}` : 0
  
                  // type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? `PAID : ${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                  // \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                  // `,
                  
  
                  // type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? `PAID : ${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                  // \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                  // \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
                  // \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
                  // \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
                  // \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
                  // \nMemberBase: ${packageBase}
                  // \nPackageBase: ${(paymentUserData[paymentUserData.length-1].packageBase)? (paymentUserData[paymentUserData.length-1].packageBase):'complimentary'}
                  // \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
                  // \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
                  // \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}
                  // \n${isActiveMember}\n${isTerminatedMember}`,
                  // transactionId:paymentUserData[paymentUserData.length-1].transactionId,
                  // vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
                  // packageName:paymentUserData[paymentUserData.length-1].packageName,
                  // packageBase:paymentUserData[paymentUserData.length-1].packageBase,
                });
                
                paymentUserData.pop();
            }

            else if (doc.iterationStartMoment.isBefore(moment(getTheDate(autoMembershipStarts)).startOf('months'))){
              // else if (autoMembershipStartsAdd1Month && doc.iterationStartMoment.isBefore(autoMembershipStartsAdd1Month.startOf('months'))){
                combinedData.push({
                   date:doc.iterationStartMoment.toDate(),
                   type:`not yet started`
                 }) 
              }
              // else if
              else{
                combinedData.push({
                  date:doc.iterationStartMoment.toDate(),
                  type:`unpaid`
                })
              }
          });

          if (combinedData && combinedData.length>=1){
            const userData = [
              createdAt? getTheDateFormat(createdAt, 'YYYYMMDD'):'',
              name? name:'',
              email?email:'',
              phone? phone:'',
              membershipStarts? getTheDateFormat(membershipStarts):'',
              membershipEnds? getTheDateFormat(membershipEnds):'',
              autoMembershipStarts? getTheDateFormat(autoMembershipStarts):'',
              autoMembershipEnds? getTheDateFormat(autoMembershipEnds):'',
              userPackageName? userPackageName:'',
              userPackageBase? userPackageBase:'',
              cancellationDate? getTheDateFormat(cancellationDate):'',
              cancellationReason? getTheDateFormat(cancellationReason):'',

              // 2017 (June 2017)
              combinedData[0].type, // june 2017
              combinedData[1].type,
              combinedData[2].type,
              combinedData[3].type,
              combinedData[4].type,
              combinedData[5].type,
              combinedData[6].type,
              
              // 2018
              combinedData[6].type, // jan2018
              combinedData[7].type,
              combinedData[8].type,
              combinedData[9].type,
              combinedData[10].type,
              combinedData[11].type,
              combinedData[12].type,
              combinedData[13].type,
              combinedData[14].type,
              combinedData[15].type,
              combinedData[16].type,
              combinedData[17].type,
  
              // 2019
              combinedData[18].type, // jan2019
              combinedData[19].type,
              combinedData[20].type,
              combinedData[21].type,
              combinedData[22].type,
              combinedData[23].type,
              combinedData[24].type,
              combinedData[25].type,
              combinedData[26].type,
              combinedData[27].type,
              combinedData[28].type,
              combinedData[29].type,
  
              // 2020
              combinedData[30].type, // jan2020
              combinedData[31].type,
              combinedData[32].type,
              combinedData[33].type,
              combinedData[34].type,
              combinedData[35].type,
              combinedData[36].type,
              combinedData[37].type,
              combinedData[38].type,
              combinedData[39].type,
              combinedData[40].type,
              combinedData[41].type,
  
              // 2021
              combinedData[42].type, // jan 2021
              combinedData[43].type,
              combinedData[44].type,
              combinedData[45].type,
              combinedData[46].type,
              combinedData[47].type,
              combinedData[48].type,
              combinedData[49].type,
              combinedData[50].type,
              combinedData[51].type,
              combinedData[52].type,
              combinedData[53].type,
  
              // 2022
              combinedData[54].type, // jan 2022
              combinedData[55].type,
              combinedData[56].type,
              combinedData[57].type,
              combinedData[58].type,
              combinedData[59].type,
              combinedData[60].type,
              combinedData[61].type,
              combinedData[62].type,
              combinedData[63].type,
              combinedData[64].type,
              combinedData[65].type,
  
              // 2023
              combinedData[66].type, // jan 2023
              combinedData[67].type,
              combinedData[68].type,
              combinedData[69].type,
              combinedData[70].type,
              combinedData[71].type,
              combinedData[72].type,
              combinedData[73].type,
              combinedData[74].type,
              combinedData[75].type,
              combinedData[76].type,
              combinedData[77].type,
  
               // 2024
              combinedData[78].type, // jan 2024
              combinedData[79].type,
              combinedData[80].type,
              combinedData[81].type,
              combinedData[82].type,
              combinedData[83].type,
              combinedData[84].type,
              combinedData[85].type,
              combinedData[86].type,
              combinedData[87].type,
              combinedData[88].type,
              combinedData[89].type,

            ];
            userSheets.push(userData);
        }
      }  
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: allUserSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `MEMBERSHIP PAYMENT MONTHLY FOR PGM!A2:DG`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

// cron job to add gantnerlogs daily
exports.addDailyGantnerToSheets = functions.https.onRequest((req, res) => {
  
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const dateInput = itemData && itemData.dateInput;
  
  const usersQuery = admin.firestore().collection('users').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const gantnerQuery = dateInput? admin.firestore().collection("gantnerLogs").where('createdAt', '>=', moment(dateInput).startOf('day').toDate()).get():
  admin.firestore().collection("gantnerLogs").where('createdAt', '>=', moment().startOf('day').toDate()).get();

  return Promise.all([usersQuery, gantnerQuery]).then(results=>{
    const userResults = results[0];
    var users = {};
    // userResults.forEach(doc => {
    //   users[doc.id] = doc.data();
    // });

    var finalArray = [];
    var totalGantnerCount = 0;
    var gantnerCountKLCC = 0;
    var gantnerCountTTDI = 0;
    var gantnerCountAppRegKLCC = 0;
    var gantnerCountAppRegTTDI = 0;
    var gantnerCountCardCheckInKLCC = 0;
    var gantnerCountCardCheckInTTDI = 0;
    var gantnerCountCardManualCheckInKLCC = 0;
    var gantnerCountCardManualCheckInTTDI = 0;

    const gantnerLogResults = results[1];
    var gantnerLogs = [];
    var gantnerMap = {};
    var gantnerMapKLCC = {};
    var gantnerMapTTDI = {};
    var gantnerAppRegKLCC = {};
    var gantnerAppRegTTDI = {};
    var gantnerCardCheckInKLCC = {};
    var gantnerCardCheckInTTDI = {};
    var gantnerManualCheckInKLCC = {};
    var gantnerManualCheckInTTDI = {};
    var sheetReport = [];

    gantnerLogResults && gantnerLogResults.forEach(function(doc) {
      const data = doc.data();
      const createdAt = data && data.createdAt;
      const userId = data && data.userId;
      const deviceId = data && data.deviceId;
      const isTodayDate = dateInput? (moment(dateInput).tz("Asia/Kuala_Lumpur").startOf('day')
        .isBetween((moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').startOf('day').add(1, 'day'), (moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').startOf('day').subtract(1, 'day'))))):true;
      
      if (deviceId && isTodayDate){
        gantnerMap[userId] = data;
      }
      if (isTodayDate && (deviceId === "App - Registration (KLCC)" || deviceId === "Check In - KLCC" || deviceId === "App - Manual (KLCC)")){
        gantnerMapKLCC[userId] = data;
      }
      else if (isTodayDate && (deviceId === "App - Registration" || deviceId === "Check In" || deviceId === "App - Manual")){
        gantnerMapTTDI[userId] = data;
      }
      if (isTodayDate && (deviceId === "App - Registration (KLCC)")){
        gantnerAppRegKLCC[userId] = data;
      }
      if (isTodayDate && (deviceId === "App - Registration")){
        gantnerAppRegTTDI[userId] = data;
      }
      if (isTodayDate && (deviceId === "Check In - KLCC")){
        gantnerCardCheckInKLCC[userId] = data;
      }
      if (isTodayDate && (deviceId === "Check In")){
        gantnerCardCheckInTTDI[userId] = data;
      }
      if (isTodayDate && (deviceId === "App - Manual (KLCC)")){
        gantnerManualCheckInKLCC[userId] = data;
      }
      if (isTodayDate && (deviceId === "App - Manual")){
        gantnerManualCheckInTTDI[userId] = data;
      }
    });

    userResults && userResults.forEach(doc=>{
      const userId = doc.id;
      const data = doc.data();
      const gantnerData = data && gantnerMap[userId];
      const gantnerDataKLCC = data && gantnerMapKLCC[userId];
      const gantnerDataTTDI = data && gantnerMapTTDI[userId];
      const gantnerAppRegKLCCData = data && gantnerAppRegKLCC[userId];
      const gantnerAppRegTTDIData = data && gantnerAppRegTTDI[userId];
      const gantnerCardCheckInKLCCData = data && gantnerCardCheckInKLCC[userId];
      const gantnerCardCheckInTTDIData = data && gantnerCardCheckInTTDI[userId];
      const gantnerManualCheckInKLCCData = data && gantnerManualCheckInKLCC[userId];
      const gantnerManualCheckInTTDIData = data && gantnerManualCheckInTTDI[userId];

      const isCheckInToday = gantnerData;
      const isKLCCCheckInToday = gantnerDataKLCC;
      const isTTDICheckInToday = gantnerDataTTDI;
     
      if (isCheckInToday){
        totalGantnerCount+=1;
      }
      if (isKLCCCheckInToday){
        gantnerCountKLCC+=1;
      }
      else if (isTTDICheckInToday){
        gantnerCountTTDI+=1;
      }
      if (gantnerAppRegKLCCData){
        gantnerCountAppRegKLCC+=1;
      }
      else if (gantnerAppRegTTDIData){
        gantnerCountAppRegTTDI+=1;
      }
      if (gantnerCardCheckInKLCCData){
        gantnerCountCardCheckInKLCC+=1;
      }
      else if (gantnerCardCheckInTTDIData){
        gantnerCountCardCheckInTTDI+=1;
      }
      if (gantnerManualCheckInKLCCData){
        gantnerCountCardManualCheckInKLCC+=1;
      }
      else if (gantnerManualCheckInTTDIData){
        gantnerCountCardManualCheckInTTDI+=1;
      }
    });


    finalArray.push([
      moment().tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY-MM-DD'),
      gantnerCountKLCC, gantnerCountTTDI, totalGantnerCount,
      gantnerCountAppRegKLCC, gantnerCountAppRegTTDI, gantnerCountCardCheckInKLCC, gantnerCountCardCheckInTTDI,
      gantnerCountCardManualCheckInKLCC, gantnerCountCardManualCheckInTTDI
    ]);

    const getSheetPromise = getGoogleSheetPromise({
      spreadsheetId: babelAnalyticsId,
      range: `GANTNER LOGS DAILY!A2:N`,
    });
  
    return getSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      const values = result && result.values;
      const rowsCount = (values && values.length)? values.length:0;
      
      sheetReport = [[
        rowsCount + 1,
        dateInput? moment(dateInput).tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY'):moment().tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY'),
        dateInput? moment(dateInput).tz('Asia/Kuala_Lumpur').format('dddd'):moment().tz('Asia/Kuala_Lumpur').format('dddd'),
        gantnerCountKLCC, 
        gantnerCountTTDI,
        totalGantnerCount,
        gantnerCountAppRegKLCC,
        gantnerCountAppRegTTDI,
        gantnerCountCardCheckInKLCC, 
        gantnerCountCardCheckInTTDI,
        gantnerCountCardManualCheckInKLCC,
        gantnerCountCardManualCheckInTTDI
        // visitorCountNonRegister
      ]];
      
      // console.log('sheetReport: ', sheetReport);

      const updateSheetPromise = updateGoogleSheet({
        spreadsheetId: babelAnalyticsId,
        // valueInputOption: 'RAW',
        
        resource: {
          // How the input data should be interpreted.
          valueInputOption: 'RAW',  // TODO: Update placeholder value.
    
          // The new values to apply to the spreadsheet.
          data: [
            {
              range: `GANTNER LOGS DAILY!A${rowsCount+2}:N`,
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
          sheetReport,
          gantnerMap, gantnerMapKLCC, gantnerMapTTDI
        });
      });
    });
  });
});

// add visitors count to sheet
exports.addVisitorsCountToSheets = functions.https.onRequest((req, res) => {

  const userQuery = admin.firestore().collection('users').get();
  const gantnerQuery = admin.firestore().collection('gantnerLogs').where('authorized', '==', true).get();

  return Promise.all([userQuery, gantnerQuery]).then(results=>{
    const userRes = results[0];
    const gantnerRes = results[1];

    var paymentMap = {};
    var gantnerMap = {};
    var userSheets = [];

    gantnerRes && gantnerRes.forEach(doc=>{
      const data = doc.data();
      
      data.count = 1;
      // data.klccCount = 1;
      // data.ttdiCount = 1;
      const deviceId = data && data.deviceId;

      const userId = data && data.userId;
      if (userId && !gantnerMap[userId]){
        gantnerMap[userId] = data;
        gantnerMap[userId].klccCount = 0;
        gantnerMap[userId].ttdiCount = 0;
      }
      // else if (userId && gantnerMap[userId] && !gantnerMap[userId].count){
      //   gantnerMap[userId] = data;

      // }
      else if (userId && gantnerMap[userId] && gantnerMap[userId].count){
        // data.count = data.count + 1;
        gantnerMap[userId].count += 1;
        if (deviceId && deviceId.includes('KLCC')){
          gantnerMap[userId].klccCount += 1;
        }
        else{
          gantnerMap[userId].ttdiCount += 1;
        }
      }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const userPaymentData = userId && paymentMap[userId];
      const email = data && data.email;
      const name = data && data.name;
      const phone = data && data.phone;
      const gantnerData = userId && gantnerMap[userId];
      const gantnerCount = gantnerData && gantnerData.count;
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;
      const icNumber = data && (data.nric || data.icNumber);
      const klccGantnerCount = gantnerData && gantnerData.klccCount;
      const ttdiGantnerCount = gantnerData && gantnerData.ttdiCount;
      const packageId = data && data.packageId;
      const membershipEnds = data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;

      if (!packageId && !membershipEnds){
        var userInfo = [
          createdAt? getTheDateFormat(createdAt, 'YYYY-MM-DD'):'',
          joinDate? getTheDateFormat(joinDate, 'YYYY-MM-DD'):'',
          userId? userId:'',
          name? name:'',
          email? email:'',
          phone? phone:'',
          icNumber? icNumber:'',
          klccGantnerCount? Math.floor(klccGantnerCount/2):0,
          ttdiGantnerCount? Math.floor(ttdiGantnerCount)/2:0
        ];
        userSheets.push(userInfo);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: allUserSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `VISITORS COUNT!A2:AZ`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

// add all users to pgm to sheet
exports.addAllUsersToPGMSheets = functions.https.onRequest((req, res) => {

  const itemData = req.body;
  const userEmail = itemData && itemData.email;

  const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  return Promise.all([userQuery, packageQuery, paymentQuery]).then(results=>{
    const userRes = results[0];
    const pkgRes = results[1];
    const paymentRes = results[2];
    var paymentMap = {};
    var pkgMap = {};
    var freezeMap = {};
    var staffMap = {};
    var userSheets = [];
    pkgRes && pkgRes.forEach(doc=>{
      const data = doc.data();
      pkgMap[doc.id]=data;
    });

    paymentRes && paymentRes.forEach(doc=>{
      var paymentArray = [];
      var freezeArray = [];
      const data = doc.data();
      const userId = data && data.userId;
      const freezeFor = data && data.freezeFor;
      const status = data && data.status;
      if (!(status && status.includes('VOIDED'))||!(status && status.includes("CANCEL"))||!(status && status.includes('faizul'))){
        paymentArray = paymentMap[userId] || [];
        paymentArray.push(data);
        paymentMap[userId]=paymentArray;
      }
      // if (freezeFor){
      //   freezeArray = freezeMap[userId]||[];
      //   freezeArray.push(data);
      //   freezeMap[userId]=freezeArray;
      // }
      // if (status && status.includes('CLOSED')){
      //   paymentArray = paymentMap[userId] || [];
      //   paymentArray.push(data);
      //   paymentMap[userId]=paymentArray;
      // }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      const isCRO = isStaff || roles;
      if (isCRO){
        staffMap[doc.id]=data;
      }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const packageId = data && data.packageId;
      const email = data && data.email;
      const name = data && data.name;
      const lastName = data && data.lastName;
      const phone = data && data.phone;
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;
      const icNumber = data && (data.nric || data.icNumber || data.passport);
      const gender = data && data.gender;
      const dateOfBirth = data && data.dateOfBirth;
      const image = data && data.image;
      const nric = data && data.nric;
      const packageData = pkgMap[packageId];
      const packageBase = packageData && packageData.base;
      const firstJoinVisit = data && data.firstJoinVisit;
      const clubId = (packageBase && packageBase === 'TTDI')? 101 : (packageBase && packageBase === 'KLCC')? 102 : 
        firstJoinVisit? (firstJoinVisit === 'TTDI')? 101 : (firstJoinVisit === 'KLCC')? 102 : 101 : 101;
      const gantnerCardNumber = data && data.gantnerCardNumber;
      const membershipEnds = data && getMembershipEnd(data);
      const membershipStarts = data && getMembershipStart(data);
      const cancellationDate = data && data.cancellationDate;
      const isActive = packageId && membershipEnds && membershipStarts && moment(getTheDate(membershipEnds)).isSameOrAfter('2021-12-23');
      const isGuest = !membershipEnds && !membershipStarts;
      // const signUpDate = joinDate? getTheDateFormat(joinDate, 'YYYY-MM-DD'): createdAt? getTheDateFormat(createdAt, 'YYYY-MM-DD'):'';
      const signUpDate = membershipStarts? getTheDateFormat(membershipStarts, 'YYYY-MM-DD'):'';
      const startDate = membershipStarts? getTheDateFormat(membershipStarts, 'YYYY-MM-DD'):'';
      const endDate = membershipEnds? getTheDateFormat(membershipEnds, 'YYYY-MM-DD'):'';
      const packageName = packageData && packageData.name;
      const paymentData = paymentMap[doc.id];
      const isMember = (packageId && membershipEnds && paymentData)? true:false;

      const monthDiff = (membershipEnds && membershipStarts)? getMonthDiff(membershipEnds, membershipStarts):'';
      const VatRate = isMember? '6':'';
      const automaticRenew = isActive? 1:0;
      const freezeData = freezeMap[doc.id];
      const FreezeAvailable = freezeData? 1:0;
      const mcId = data && data.mcId;
      const consultantData = mcId && staffMap[mcId];
      const consultantEmail = consultantData && consultantData.email;

      var userInfo = [];
      if (!isMember){
        userInfo = [
          userId? userId:'', // external userId
          packageId? packageId:'',// external contractId
          name? name:'',
          lastName? lastName:'',
          '', //secondName
          gender? gender:'', //sex
          dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'', //birthOfDate
          email? email:'', // email
          '', // personal Id
          '', // member home phone
          phone? phone:'', //mobilePhone
          image? image:'', //photoURL
          '', // company
          '', // street
          '', // postalcode
          '', // city
          '', // state
          'Malaysia', // default?
          icNumber? icNumber:'', // DocumentNumber
          '', // DocumentIssuedBy
          '', // DocumentIssueDate
          '', // UserNumber
          clubId? clubId:'', // ClubNumber
          gantnerCardNumber? gantnerCardNumber:'', // MemberCardNumber
          consultantEmail? consultantEmail:'', // Consultant
          isActive? 1:0,
          isGuest? 1:0,
          '', // TodayBalance
          '', // PrepaidBalance
          '', // signupdate
          '', // startDate,
          '', // endDate,
          '', //MinCancelTimeMonths
          isActive? 'no':'', // IsProrata
          '', // IsEndProrata
          '', // ProrataDay
          '', // membershipType
          '', // paymentPlan
          packageName? packageName:'', // paymentPlan
          '', // PaymentPlanType
          '', // visitLimit
          '', // RemainingVisitCount
          '', // VisitPeriod
          '', // SynchronizeWithContract
          isMember? 'Month':'', // TimePeriod
          '', // monthDiff, // ContractLength
          '', // monthDiff, // ContractFrequency
          '', // IsUpfront
          '', // VatRate,
          '', // AdminFee
          '', // membershipFee, put 0?
          '', // StartChargingFromDate
          '', // StartGeneratingTransactionsFromDate
          '', // ForcePaymentPlan
          '', // PaymentPlanAutoName
          '', // IsPaymentChosenDay
          '', // IsAutomaticallyEnded
          '', // IsAdditionalContract
          '', // StopChargingAfterMinPeriod
          '', // FreezeAvailable
          '', // AutomaticRenew																					
          '', // PayerName
          '', // PayerAddress
          '', // PayerPostalCode
          '', // PayerCity
          '', // AccountNumber
          '', // VirtualAccountNumber
          '', // BankAccountBic
          '', // BankAccountMandatoryId
          '', // BankAccountFirstPayment
          '', // BankAccountMandatorySignUpDate
          '', // CreditCardNumber
          '', // CreditCardReferenceNumber
          '', // CreditCardExpityDate
          '', // Comment1
          '', // Comment2
          '', // Comment3
          '', // Comment4
          '', // Tags
        ];
        userSheets.push(userInfo);
      }
      // for membership
      else{
        // sort the payment
        paymentData && paymentData.sort((a,b)=>{
          const createdA = a.createdAt;
          const createdB = b.createdAt;
          if(createdA < createdB){return -1}
          else if(createdB < createdA){return 1;}
          else{return 0}
        });
        paymentData && paymentData.reverse();

        // paymentData && paymentData.forEach((data, index)=>{
        //   const type = data.type;
        //   const source = data.source;
        //   const freezeFor = data.freezeFor;
        //   const packageId = data.packageId;
        //   const packageName = packageData && packageData.name;
        //   const createdAt = data.createdAt;
        //   const renewalTerm = data.renewalTerm;
        //   const quantity = data.quantity||1;
        //   const monthQuantity = renewalTerm? (quantity * getMonthQty(renewalTerm)) : quantity;
        //   const paymentType = data.paymentType? data.paymentType:'';

        //   const signUpDateContract = membershipStarts? moment(getTheDate(membershipStarts)).add(index, 'month').add(monthQuantity-1, 'month').format('YYYY-MM-DD'):'';
        //   const startDateContract = membershipStarts? moment(getTheDate(membershipStarts)).add(index, 'month').add(monthQuantity-1, 'month').format('YYYY-MM-DD'):'';
        //   const endDateContract = membershipStarts? moment(getTheDate(membershipStarts)).add(index, 'month').add(monthQuantity, 'month').format('YYYY-MM-DD'):'';

          // for membership
          // if (type && type === 'membership'){
            userInfo = [
              userId? userId:'', // external userId
              packageId? packageId:'',// external contractId
              name? name:'',
              lastName? lastName:'',
              '', //secondName
              gender? gender:'', //sex
              dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'', //birthOfDate
              email? email:'', // email
              '', // personal Id
              '', // member home phone
              phone? phone:'', //mobilePhone
              image? image:'', //photoURL
              '', // company
              '', // street
              '', // postalcode
              '', // city
              '', // state
              'Malaysia', // default?
              icNumber? icNumber:'', // DocumentNumber
              '', // DocumentIssuedBy
              '', // DocumentIssueDate
              '', // UserNumber
              clubId? clubId:'', // ClubNumber
              gantnerCardNumber? gantnerCardNumber:'', // MemberCardNumber
              consultantEmail? consultantEmail:'', // Consultant
              isActive? 1:0,
              isGuest? 1:0,
              '', // TodayBalance
              '', // PrepaidBalance
              // signUpDateContract,
              // startDateContract,
              // endDateContract,
              signUpDate,
              startDate,
              endDate,
              '', //MinCancelTimeMonths
              isActive? 'no':'', // IsProrata
              '', // IsEndProrata
              '', // ProrataDay
              // 'membershipType - need to add', // membershipType
              'membership',
              // 'paymentPlan - need to add', // paymentPlan
              'FREE MONTH', // paymentPlan
              // packageName? packageName:'', // paymentPlanType
              'membership',
              '', // visitLimit
              '', // RemainingVisitCount
              '', // VisitPeriod
              '', // SynchronizeWithContract
              isMember? 'Month':'', // TimePeriod
              monthDiff, // ContractLength
              monthDiff, // ContractFrequency
              '', // IsUpfront
              VatRate,
              '', // AdminFee
              '', // AdminFee VatRate
              0, // membershipFee, put 0?
              'credit', // paymentType, hardcode?
              getTheDateFormat(membershipStarts, 'YYYY-MM-DD'), // StartChargingFromDate
              '', // StartGeneratingTransactionsFromDate
              '', // ForcePaymentPlan
              '', // PaymentPlanAutoName
              '', // IsPaymentChosenDay
              '', // IsAutomaticallyEnded
              '', // IsAdditionalContract
              '', // StopChargingAfterMinPeriod
              1, // FreezeAvailable
              automaticRenew, // AutomaticRenew																					
              '', // PayerName
              '', // PayerAddress
              '', // PayerPostalCode
              '', // PayerCity
              '', // AccountNumber
              '', // VirtualAccountNumber
              '', // BankAccountBic
              '', // BankAccountMandatoryId
              '', // BankAccountFirstPayment
              '', // BankAccountMandatorySignUpDate
              '', // CreditCardNumber
              '', // CreditCardReferenceNumber
              '', // CreditCardExpityDate
              '', // Comment1
              '', // Comment2
              '', // Comment3
              '', // Comment4
              '', // Tags
            ];
            userSheets.push(userInfo);
          // }
        // })
      }
      
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmAllUsersId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `all users!A2:CB`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

// add all transactions to pgm to sheet
exports.addAllTransToPGMSheets = functions.https.onRequest((req, res) => {
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const userQuery = admin.firestore().collection('users').get();
  const pgmContractQuery = admin.firestore().collection('pgmContracts').get();

  return Promise.all([paymentQuery, packageQuery, userQuery, pgmContractQuery]).then(result=>{
    const paymentRes = result[0];
    const pkgRes = result[1];
    const userRes = result[2];
    const pgmContractRes = result[3];

    var paymentSheets = [];
    var pkgMap = {};
    pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});

    var userMap={};
    var userPGMMap = {};
    userRes.forEach(doc=>{
      const data = doc.data();
      const pgmUserId = data.pgmUserId;
      if (pgmUserId){
        userMap[doc.id]=data;
        userPGMMap[pgmUserId]=data;
      }
    });

    var pgmContractMap = {};
    pgmContractRes.forEach(doc=>{
      const data=doc.data();
      const pgmUserId = data.userId;
      if (pgmUserId){
        pgmContractMap[pgmUserId]=data;
      }
    });

    paymentRes && paymentRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data && data.packageId; // similar as ExternalContractId?
      const externalTransId = doc.id;
      const createdAt = data && data.createdAt;
      const totalAmount = data && data.totalPrice;
      const priceWithoutTax = (parseFloat(totalAmount))/1.06;
      const taxValue = 0.06*priceWithoutTax;
      const userId = data && data.userId;
      const userData = userId && userMap[userId];
      const pgmUserId = userData && userData.pgmUserId;
      const pgmContractData = pgmUserId && pgmContractMap[pgmUserId];
      const pgmContractId = pgmContractData.contractId;
      
      // need to reconfirm
      // const VatRate = parseFloat(taxValue).toFixed(2);
      const VatRate = taxValue? 6:0
      const description = (data && data.notes)? data.notes:'';
      const source = data && data.source; // transactionType
      const type = data && data.type; // transactionCategory
      const status = data && data.status;
      const freezeFor = data && data.freezeFor;
      const freezeSource = data && data.freezeSource;
      const packageData = packageId && pkgMap[packageId];
      const packageName = packageData && packageData.name;

      if ((source && source === 'freeze' && freezeFor && freezeSource && freezeSource === 'adyen') 
        || (status && status === 'CLOSED')
        && packageId
        ){
          var paymentInfo = [
            packageId? packageId:doc.id, // for freeze, use payment id?
            pgmContractId?pgmContractId:'', // contractId, 
            externalTransId? externalTransId:'',
            createdAt? getTheDateFormat(createdAt, 'YYYY-MM-DD'):'',
            totalAmount? totalAmount: 0,
            VatRate? VatRate:6,
            description? description:packageName?packageName:'',
            type? type:'',
            'debit transaction'
            // type? type:'' // temporarily
          ];
          paymentSheets.push(paymentInfo);
        }
        else if ((source && (source === 'free' || source === 'jfr' || source === 'refer' || source === 'join'))){
          var paymentInfo = [
            'vf2jCUOEeDDiIQ0S42BJ', // default to this package first (for testing)
            pgmContractId?pgmContractId:'', // contractId, 
            externalTransId? externalTransId:'',
            createdAt? getTheDateFormat(createdAt, 'YYYY-MM-DD'):'',
            totalAmount? totalAmount: 0,
            VatRate? VatRate:0,
            description? description:packageName?packageName:'FREE',
            type? type:'',
            'debit transaction'
            // type? type:'' // temporarily
          ];
          paymentSheets.push(paymentInfo);
        }
      
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmTransactionId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Migration Template!A2:CB`,
            majorDimension: "ROWS",
            values: paymentSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

// add all employee to pgm to sheet
exports.addAllEmployeeToPGMSheets = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  return Promise.all([userQuery]).then(results=>{
    const userRes = results[0];

    var userSheets = [];
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      
      const email = data && data.email;
      const name = data && data.name;
      const lastName = data && data.lastName;
      const phone = data && data.phone;
      const gender = data && data.gender;
      const dateOfBirth = data && data.dateOfBirth;
      const staffRole = data && data.staffRole;
      const isCRO = ((staffRole === 'CRO' || (roles && roles.mc)) && !(staffRole==='terminatedStaff'));

      var userInfo = [];
 
      if (isCRO){
        userInfo = [
          name? name:'',
          lastName? lastName:'',
          email? email:'', // login
          'babelpgm123', // Employee's temporary password - to be changed by employee after migration
          gender? gender:'male', // sex
          dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'',
          email? email:'',
          phone? phone:'',
          userId? userId:'', // Employee's personal Id or other data
          '',
          '', // Should the employee be auto assigned to new clubs created in perfect gym
          // staffRole, // role
          'Customer Relations',
          'Customer service', // employee position
          '', //street
          '', // postal code
          '', // city
          'Malaysia' // country 
        ];
        userSheets.push(userInfo);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmEmployeeId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `sheet3!A1:CB`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

// function to getPGMUsers
function getPGMUsers (userId, page = 1, clubId = 3){
  // const corsFn = cors({ origin: true });
  // return corsFn(req, res, () => {
  var optionsEdit = {
      'method': 'GET',
      'url': userId? `${pgmURLLive}/Users/User?userId=${userId}`: 
          (page && clubId)? `${pgmURLLive}/Users/Users?homeClubId=${clubId}&page=${page}`:
          `${pgmURLLive}/Users/User`,
      'headers': {
          'X-Client-Id': pgmClientIdLive,
          'X-Client-Secret': pgmClientSecretLive,
          'Content-Type': 'application/json',
      },
  };
  var rp2 = require('request-promise');
  console.log('getPGMUsersoptionsEdit: ', optionsEdit);
  return rp2(optionsEdit).then(function (result){
      return {success:true, result:JSON.parse(result)}; 
  }).catch(error=>{
      return {success:false, error:error.message};
  })
 //  }); 
}

// add all visitors to pgm to sheet
exports.addAllVisitorsToPGMSheets = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  
  return Promise.all([userQuery]).then(results=>{
    const userRes = results[0];
   
    var staffMap = {};
    var userSheets = [];

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      const isCRO = isStaff || roles;
      if (isCRO){
        staffMap[doc.id]=data;
      }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const userId = doc.id;
      const packageId = data && data.packageId;
      const email = data && data.email;
      const name = data && data.name;
      const lastName = getLastName(data);
      // console.log('lastName: ', lastName);
      const phone = data && data.phone;
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;
      const icNumber = data && (data.nric || data.icNumber || data.passport);
      // const gender = data && data.gender;
      const gender = getGender(data);  
      // console.log('thegender: ', gender);    
      const dateOfBirth = data && data.dateOfBirth;
      const image = data && data.image;
      const nric = data && data.nric;
      const firstJoinVisit = data && data.firstJoinVisit;
      const clubId = firstJoinVisit? (firstJoinVisit === 'TTDI')? 101 : (firstJoinVisit === 'KLCC')? 102 : 101 : 101;
      const gantnerCardNumber = data && data.gantnerCardNumber;
      const membershipEnds = data && getMembershipEnd(data);
      const membershipStarts = data && getMembershipStart(data);
      const isActive = packageId && membershipEnds && membershipStarts && moment(getTheDate(membershipEnds)).isSameOrAfter('2021-12-23');
      const isGuest = !membershipEnds && !membershipStarts;
      const isMember = (packageId && membershipEnds)? true:false;
      const automaticRenew = isActive? 1:0;
      const mcId = data && data.mcId;
      const consultantData = mcId && staffMap[mcId];
      const consultantEmail = consultantData && consultantData.email;
      const remarks = data && data.remarks;
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      const staffRole = data && data.staffRole;

      var userInfo = [];
      // not inclde duplicate name
      if (!isMember 
        && name && !(name.includes('(d)') || (lastName && lastName.includes('(d)')) || (name.includes('duplicate')))
        // && gender 
        && !isStaff
        && !roles
        && !staffRole
        && isGuest
      ){
        userInfo = [
          userId? userId:'', // external userId
          packageId? packageId:'',// external contractId
          name? name:'',
          lastName? lastName:'',
          '', //secondName
          gender? gender:'', //sex
          dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'', //birthOfDate
          email? email:'', // email
          '', // personal Id
          '', // member home phone
          phone? phone:'', //mobilePhone
          image? image:'', //photoURL
          '', // company
          '', // street
          '', // postalcode
          '', // city
          '', // state
          'Malaysia', // default?
          icNumber? icNumber:'', // DocumentNumber
          '', // DocumentIssuedBy
          '', // DocumentIssueDate
          '', // UserNumber
          clubId? clubId:'', // ClubNumber
          gantnerCardNumber? gantnerCardNumber:'', // MemberCardNumber
          consultantEmail? consultantEmail:'', // Consultant
          isActive? 1:0,
          isGuest? 1:0,
          '', // TodayBalance
          '', // PrepaidBalance
          '', // signupdate
          '', // startDate,
          '', // endDate,
          '', //MinCancelTimeMonths
          isActive? 'no':'', // IsProrata
          '', // IsEndProrata
          '', // ProrataDay
          '', // membershipType
          '', // paymentPlan
          '', // paymentPlan
          '', // PaymentPlanType
          '', // visitLimit
          '', // RemainingVisitCount
          '', // VisitPeriod
          '', // SynchronizeWithContract
          isMember? 'Month':'', // TimePeriod
          '', // monthDiff, // ContractLength
          '', // monthDiff, // ContractFrequency
          '', // IsUpfront
          '', // VatRate,
          '', // AdminFee
          '', // membershipFee, put 0?
          'Cash', // paymentType
          '', // StartChargingFromDate
          '', // StartGeneratingTransactionsFromDate
          '', // ForcePaymentPlan
          '', // PaymentPlanAutoName
          '', // IsPaymentChosenDay
          '', // IsAutomaticallyEnded
          '', // IsAdditionalContract
          '', // StopChargingAfterMinPeriod
          '', // FreezeAvailable
          '', // AutomaticRenew																					
          '', // PayerName
          '', // PayerAddress
          '', // PayerPostalCode
          '', // PayerCity
          '', // AccountNumber
          '', // VirtualAccountNumber
          '', // BankAccountBic
          '', // BankAccountMandatoryId
          '', // BankAccountFirstPayment
          '', // BankAccountMandatorySignUpDate
          '', // CreditCardNumber
          '', // CreditCardReferenceNumber
          '', // CreditCardExpityDate
          remarks? remarks:'', // Comment1
          '', // Comment2
          '', // Comment3
          '', // Comment4
          '', // Tags
        ];
        userSheets.push(userInfo);
      }
      
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmAllUsersId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Migration Template!A2:CC`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  });
});

function getClubIdByUserData (userData, packageData){
  if ((packageData && packageData.base && packageData.base === "TTDI")||(!packageData && userData && userData.firstJoinVisit === "TTDI")){
    return '101';
  }
  else if ((packageData && packageData.base && packageData.base === "KLCC")||(!packageData && userData && userData.firstJoinVisit === "KLCC")){
    return '102';
  }
  else{
    return '101' // TTDI club (default)
  }
}

// add all members to pgm to sheet
exports.addAllMembersToPGMSheets = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const userEmail = itemData && itemData.email;
  const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():admin.firestore().collection('users').get();
  const packageQuery = admin.firestore().collection('packages').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  const monthlyPackageQuery = admin.firestore().collection('pgmPackages').get();

  // return res.status(200).send({success:true});

  return Promise.all([userQuery, packageQuery, paymentQuery, monthlyPackageQuery]).then(results=>{
    const userRes = results[0];
    const pkgRes = results[1];
    const paymentRes = results[2];
    const monthlyPkgRes = results[3];
   
    var staffMap = {};
    var userSheets = [];
    var pkgMap = {};
    var paymentMap = {};
    var paymentArray = [];

    pkgRes.forEach(doc=>{
      const data = doc.data();
      pkgMap[doc.id]=data;
    });

    var monthlyPkgMap = {}
    var monthlypkgMapByPrice = {};
    var monthlyPkgArray = [];
    monthlyPkgRes.forEach(doc=>{
      const data = doc.data();
      const packageIds = data.packageIds;
      const price = data.price && parseFloat(data.price).toFixed(2);
      monthlypkgMapByPrice[price]=data;
      monthlypkgMapByPrice[price].id = doc.id;
      // packageIds && packageIds.forEach(packageId=>{
      //   monthlyPkgMap[]
      // });
    });

    paymentRes.forEach(doc=>{
      const data = doc.data();
      const userId = data.userId;
      const status = data.status;
      const freezeFor = data.freezeFor;
      const source = data.source;
      if ((status && status.includes('CLOSE')) || (freezeFor) || 
        (source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer'))
        ){
        paymentArray = paymentMap[userId] || [];
        paymentArray.push({...data, paymentId:doc.id});
        paymentMap[userId]=paymentArray;
      }
    });

    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      const isCRO = isStaff || roles;
      if (isCRO){
        staffMap[doc.id]=data;
      }
    });

    var userPaymentDetails = {}
    userRes && userRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data && data.packageId;
      const email = data && data.email;
      const name = data && data.name;
      const lastName = getLastName(data);
      // console.log('lastName: ', lastName);
      const phone = data && data.phone;
      const createdAt = data && data.createdAt;
      const joinDate = data && data.joinDate;
      const icNumber = data && (data.nric || data.icNumber || data.passport);
      // const gender = data && data.gender;
      const gender = getGender(data);  
      // console.log('thegender: ', gender);    
      const dateOfBirth = data && data.dateOfBirth;
      const image = data && data.image;
      const firstJoinVisit = data && data.firstJoinVisit;
      const clubId = firstJoinVisit? (firstJoinVisit === 'TTDI')? 101 : (firstJoinVisit === 'KLCC')? 102 : 101 : 101;
      const gantnerCardNumber = data && data.gantnerCardNumber;
      const membershipEnds = data && getMembershipEnd(data);
      const membershipStarts = data && getMembershipStart(data);
      const isActive = packageId && membershipEnds && membershipStarts && moment(getTheDate(membershipEnds)).isSameOrAfter('2021-12-23');
      const isGuest = !membershipEnds && !membershipStarts;
      const isMember = (packageId && membershipEnds)? true:false;
      const automaticRenew = isActive? 1:0;
      const mcId = data && data.mcId;
      const consultantData = mcId && staffMap[mcId];
      const consultantEmail = consultantData && consultantData.email;
      const remarks = data && data.remarks;
      const isStaff = data && data.isStaff;
      const roles = data && data.roles;
      const staffRole = data && data.staffRole;
      const paymentData = paymentMap[doc.id];

      var userInfo = [];
      // not inclde duplicate name
      if (isMember 
        && name 
        // && !(name.includes('(d)') || (lastName && lastName.includes('(d)')) || (name.includes('duplicate')))
        // && gender 
        && !isStaff
        && !roles
        && !staffRole
        && !isGuest
        && paymentData
      ){
        
        
         // sort the payment
         paymentData && paymentData.sort((a,b)=>{
          const createdA = a.createdAt;
          const createdB = b.createdAt;
          if(createdA < createdB){return 1}
          else if(createdB < createdA){return -1;}
          else{return 0}
        });
        paymentData && paymentData.reverse();

        var monthStartCount = 0;
        var monthEndCount = 1;
        var startMoment = moment(getTheDate(membershipStarts)).tz('Asia/Kuala_Lumpur').startOf('day');
        var endMoment = moment(getTheDate(membershipEnds)).tz('Asia/Kuala_Lumpur').startOf('day');

        var userFreezes = [];
        var userFreezeTerminated = [];
        var userFreeAccess = [];
        var membershipHistoryList = [];
        var combinedData = [];
        var combinedVendMth = [];
        var combinedTransactions = [];
        var addMonths = 0;
        var addYears = 0;
        
        var paymentCount = 0;
        paymentData && paymentData.forEach((payData, index)=>{
          const freezeFor = payData.freezeFor;
          const packageId = payData.packageId;
          const paymentCreatedDate = payData.createdAt;
          const renewalTerm = (payData && payData.renewalTerm) || 'month';
          const source = payData.source;
          const qty = payData.quantity||1;
          const cardSummary = payData.cardSummary;
          const cardExpired = payData.cardExpiryDate;
          const price = payData.totalPrice? payData.totalPrice:0;
          const status = payData.status;
          const type = payData.type;
          const paymentType = payData.paymentType;
          const userId = payData.userId;
          const paymentId = payData.paymentId;
       
          // console.log('renewalTerm: ', renewalTerm);
          // console.log('theIndex: ', index);
          
          // 1. need to sort the freeze first
          if (source && freezeFor){
            const freezeType = payData.freezeType;
            for (var a = 0; a<qty; a++){
              userFreezes.push({
                date:moment(getTheDate(freezeFor)).add(a, 'months'),
                freezeType,
                yearOfFreeze: moment(freezeFor).format('YYYY'),
                cardSummary, cardExpired, paymentId,
                ...payData,
                isFreeze:true
                // need to link with contract?
              });
            }
          }
          else if (source==='freezeTerminate'){
            userFreezeTerminated.push({date:moment(freezeFor), paymentId});
          }
          else if ((source==='join') || (source==='luckyDraw') || (source==='promo')|| (source==='free')
          || (source==='complimentary') || (source==='jfr') || (source==='refer') 
          || (parseInt(price)===0)
          ){
            userFreeAccess.push({
              date:moment(getTheDate(paymentCreatedDate)), type:source, paymentId, 
              ...payData,
              isFree:true
            });
          }

          else if (((source === 'vend') || ((source === 'adyen') && (parseInt(price)!=0)) || (source==='pbonline'))
          && (status === 'CLOSED') && (type === 'membership')){
            for (var h=0; h<qty; h++){
              combinedTransactions.push({
                ...payData,
                cycle:h+1
              })
              // combinedVendMth.push({
              //   date:moment(paymentCreatedDate).add(i, 'months'), 
              //   paymentDate:paymentCreatedDate,
              //   type:source,
              //   price, paymentType, cardSummary, cardExpired,
              //   packageId, paymentId, renewalTerm, 
              //   ...payData
              // });
            }
            // for the combined transactions
           
            var monthlyPkgPrice = 0;
            var monthlyPkgData;
            if (renewalTerm && (renewalTerm === 'year' || renewalTerm === 'yearly')){
              monthlyPkgPrice = price && (parseFloat(price)/12).toFixed(2);
              monthlyPkgData = monthlyPkgPrice && monthlypkgMapByPrice[monthlyPkgPrice];
              const pkgIds = monthlyPkgData && monthlyPkgData.packageIds;
              const monthlyPkgId = monthlyPkgData && monthlyPkgData.id;
    
              for (var i=0; i<(qty*12); i++){
                combinedVendMth.push({
                  date:moment(getTheDate(paymentCreatedDate)).add(i, 'months'), 
                  paymentDate:moment(getTheDate(paymentCreatedDate)).format('YYYY-MM-DD'),
                  type:source,
                  cycle:i+1,
                  ...payData,
                  ...monthlyPkgData,
                  monthlyPkgId,
                  monthlyPkgPrice:monthlyPkgPrice?monthlyPkgPrice:0,
                  isFree: (!monthlyPkgData && parseFloat(monthlyPkgPrice)>0 && parseFloat(monthlyPkgPrice)<=220)? true:false
                });
                // if (cardSummary){
                //   combinedVendMth[i].cardSummary = `${cardSummary} ${cardExpired}`;
                // }
              }
            }
            else if (renewalTerm && (renewalTerm === 'month' || renewalTerm === 'monthly')){
              monthlyPkgPrice = price && (parseFloat(price)).toFixed(2);
              monthlyPkgData = monthlyPkgPrice && monthlypkgMapByPrice[monthlyPkgPrice];
              const pkgIds = monthlyPkgData && monthlyPkgData.packageIds;
              const monthlyPkgId = monthlyPkgData && monthlyPkgData.id;
              for (var j=0; j<qty; j++){
                combinedVendMth.push({
                  date:moment(getTheDate(paymentCreatedDate)).add(j, 'months'),
                  paymentDate:moment(getTheDate(paymentCreatedDate)).format('YYYY-MM-DD'),
                  type:source,
                  cycle:j+1,
                  ...payData,
                  ...monthlyPkgData,
                  monthlyPkgId,
                  monthlyPkgPrice:monthlyPkgPrice?monthlyPkgPrice:0,
                  // isFree: (!monthlyPkgData && parseFloat(monthlyPkgPrice)>0 && parseFloat(monthlyPkgPrice)<=220)? true:false
                  isFree: (price && parseInt(price)<220)? true:false
                });
                // if (cardSummary){
                //   combinedVendMth[j].cardSummary = `${cardSummary} ${cardExpired}`;
                // }
              }
            }
            else if (renewalTerm && (renewalTerm === 'biyearly' || renewalTerm === 'biyear')){
              monthlyPkgPrice = price && (parseFloat(price)/6).toFixed(2);
              monthlyPkgData = monthlyPkgPrice && monthlypkgMapByPrice[monthlyPkgPrice];
              const pkgIds = monthlyPkgData && monthlyPkgData.packageIds;
              const monthlyPkgId = monthlyPkgData && monthlyPkgData.id;
              for (var k=0; k<qty*6; k++){
                combinedVendMth.push({
                  date:moment(getTheDate(paymentCreatedDate)).add(k, 'months'), 
                  paymentDate:moment(getTheDate(paymentCreatedDate)).format('YYYY-MM-DD'),
                  cycle:k+1,
                  ...payData,
                  ...monthlyPkgData,
                  monthlyPkgId,
                  monthlyPkgPrice:monthlyPkgPrice?monthlyPkgPrice:0,
                  isFree: (!monthlyPkgData && parseFloat(monthlyPkgPrice)>0 && parseFloat(monthlyPkgPrice)<=220)? true:false
                });
                // if (cardSummary){
                //   combinedVendMth[k].cardSummary = `${cardSummary} ${cardExpired}`;
                // }
              }
            }
            else if (renewalTerm && renewalTerm === 'quarterly'){
              monthlyPkgPrice = price && (parseFloat(price)/3).toFixed(2);
              monthlyPkgData = monthlyPkgPrice && monthlypkgMapByPrice[monthlyPkgPrice];
              const pkgIds = monthlyPkgData && monthlyPkgData.packageIds;
              const monthlyPkgId = monthlyPkgData && monthlyPkgData.id;
              for (var l=0; l<qty*3; l++){
                combinedVendMth.push({
                  date:moment(getTheDate(paymentCreatedDate)).add(l, 'months'), 
                  paymentDate:moment(getTheDate(paymentCreatedDate)).format('YYYY-MM-DD'),
                  cycle:l+1,
                  ...payData,
                  ...monthlyPkgData,
                  monthlyPkgId,
                  monthlyPkgPrice:monthlyPkgPrice?monthlyPkgPrice:0,
                  isFree: (!monthlyPkgData && parseFloat(monthlyPkgPrice)>0 && parseFloat(monthlyPkgPrice)<=220)? true:false
                });
                // if (cardSummary){
                //   combinedVendMth[l].cardSummary = `${cardSummary} ${cardExpired}`;
                // }
              }
            }
            else if (renewalTerm && renewalTerm === '4monthly'){
              monthlyPkgPrice = price && (parseFloat(price)/4).toFixed(2);
              monthlyPkgData = monthlyPkgPrice && monthlypkgMapByPrice[monthlyPkgPrice];
              const pkgIds = monthlyPkgData && monthlyPkgData.packageIds;
              const monthlyPkgId = monthlyPkgData && monthlyPkgData.id;
              for (var m=0; m<qty*4; m++){
                combinedVendMth.push({
                  date:moment(getTheDate(paymentCreatedDate)).add(m, 'months'), 
                  paymentDate:moment(getTheDate(paymentCreatedDate)).format('YYYY-MM-DD'),
                  cycle:m+1,
                  ...payData,
                  ...monthlyPkgData,
                  monthlyPkgId,
                  monthlyPkgPrice:monthlyPkgPrice?monthlyPkgPrice:0,
                  isFree: (!monthlyPkgData && parseFloat(monthlyPkgPrice)>0 && parseFloat(monthlyPkgPrice)<=220)? true:false
                });
                // if (cardSummary){
                //   combinedVendMth[m].cardSummary = `${cardSummary} ${cardExpired}`;
                // }
              }
            }
          }

          // resort the array dates
          userFreezes.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
          userFreezes.reverse();
          userFreezeTerminated.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
          userFreezeTerminated.reverse();
          userFreeAccess.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
          userFreeAccess.reverse();
          combinedVendMth.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
          combinedVendMth.reverse();

          const initialMonthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
          var monthsDiff = initialMonthsDiff;
          var totalArrayLength = userFreezeTerminated.length + userFreezes.length + userFreeAccess.length + combinedVendMth.length;
          if (totalArrayLength>initialMonthsDiff){
            monthsDiff = totalArrayLength-1;
          }

          // default, if there is no payment detected
          for (var i=0; i<=monthsDiff; i++){
            const iterationStartMoment = startMoment.clone().add(i, 'months');
            // combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
            membershipHistoryList.push({
              iterationDate:iterationStartMoment.format('YYYY-MM-DD'), 
              count:i,
              userId
              // addMonths, addYears,
              // startMoment:startMoment && startMoment.format('YYYY-MM-DD')
            });
          }

          membershipHistoryList && membershipHistoryList.forEach((x,indexx)=>{
            // console.log('userFreezes[userFreezes.length-1].date', userFreezes[userFreezes.length-1].date.format('YYYY-MM-DD'));
            // console.log('xDate: ', x.date.format('YYYY-MM-DD'));
            // console.log('xDateAdd1Month: ', x.date.add(1, 'months').format('YYYY-MM-DD'));
            if (userFreezeTerminated && userFreezeTerminated.length>0 
              && moment(x.iterationDate).isSameOrAfter(userFreezeTerminated[userFreezeTerminated.length-1].date)
              // && moment(userFreezeTerminated[userFreezeTerminated.length-1].date).isBetween(x.date, moment(x.date).add(1,'month'))
              // && moment(x.date).isBetween(userFreezeTerminated[userFreezeTerminated.length-1].date, userFreezeTerminated[userFreezeTerminated.length-1].date.add('months', 1))
            ){
                combinedData.push({
                  date:userFreezeTerminated[userFreezeTerminated.length-1].date,
                  // type:'freezeTerminated',
                  index:indexx,
                  ...userFreezeTerminated[userFreezeTerminated.length-1]
                });
                userFreezeTerminated.pop();
            }
            else if (userFreezes && userFreezes.length>0
              && moment(x.iterationDate).isSameOrAfter(userFreezes[userFreezes.length-1].date.clone()) 
              && moment(x.iterationDate).isBefore(userFreezes[userFreezes.length-1].date.clone().add(1, 'months')) 
              // && moment(userFreezes[userFreezes.length-1].date).isBetween(x.date, (x.date).add('month', 1).subtract('days', 1))
              // && moment(x.date).isBetween(userFreezes[userFreezes.length-1].date, userFreezes[userFreezes.length-1].date.add('months', 1))
              ){
              // console.log('userFreezes[userFreezes.length].price: ', userFreezes[userFreezes.length-1].price);
              // console.log('userFreezesDate: ', userFreezes[userFreezes.length-1].date.format('DDMMYYYY'));
              // console.log('thexDate: ', x.date.format('DDMMYYYY'));
              combinedData.push({
                // date:userFreezes[userFreezes.length-1].date,
                // type:'freeze',
                // freezeType: userFreezes[userFreezes.length-1].freezeType? userFreezes[userFreezes.length-1].freezeType:null,
                // price:userFreezes[userFreezes.length-1].price, 
                // freezeCountPerYear:userFreezes[userFreezes.length-1].freezeCountPerYear,
                index:indexx,
                // paymentId:userFreezes[userFreezes.length-1].paymentId,
                ...userFreezes[userFreezes.length-1]
              });
              userFreezes.pop();
            }
            else if (userFreeAccess && userFreeAccess.length>0 
              // && userFreeAccess[userFreeAccess.length-1].date.isSameOrAfter(moment(x.date))
              && moment(x.iterationDate).isSameOrAfter(userFreeAccess[userFreeAccess.length-1].date)
              // && userFreeAccess[userFreeAccess.length-1].date.isBetween(x.date, moment(x.date).add(1,'month'))
              ){
              combinedData.push({
                // date:userFreeAccess[userFreeAccess.length-1].date,
                // type:userFreeAccess[userFreeAccess.length-1].type,
                index:indexx,
              //  paymentId:userFreeAccess[userFreeAccess.length-1].paymentId,
               ...userFreeAccess[userFreeAccess.length-1]
              })
              userFreeAccess.pop();   
            }
            else if (combinedVendMth && combinedVendMth.length>0){
              combinedData.push({
                // date:combinedVendMth[combinedVendMth.length-1].date,
                // paymentDate: combinedVendMth[combinedVendMth.length-1].paymentDate,
                // type:combinedVendMth[combinedVendMth.length-1].type,
                // // visitLeft:combinedVendMth[combinedVendMth.length-1].visitLeft,
                // // visitMax: combinedVendMth[combinedVendMth.length-1].visitMax,
                // price:combinedVendMth[combinedVendMth.length-1].price, 
                // paymentType: combinedVendMth[combinedVendMth.length-1].paymentType,
                // cardSummary: combinedVendMth[combinedVendMth.length-1].cardSummary,
                // cardExpired: combinedVendMth[combinedVendMth.length-1].cardExpired,
                // index:indexx,
                // packageId:combinedVendMth[combinedVendMth.length-1].packageId,
                // paymentId:combinedVendMth[combinedVendMth.length-1].paymentId,
                // renewalTerm: combinedVendMth[combinedVendMth.length-1].renewalTerm,
                index:indexx,
                ...combinedVendMth[combinedVendMth.length-1]
              })
              combinedVendMth.pop();
            }
           
            else{
              // combinedData.push({
              //   ...x,
              //   test: 'outside of loop',
              //   iterationDate:x.iterationDate
              // })
            }
          });

          // sorting...
          combinedData.sort((a,b) => {
            const totalPriceA = a.totalPrice? parseInt(a.totalPrice):0;
            const totalPriceB = b.totalPrice? parseInt(a.totalPrice):0;
            const dateA = a.date.format('YYYY-MM-DD');
            const dateB = b.date.format('YYYY-MM-DD');
            if (dateA>dateB){
              return 1
              // if (totalPriceA>totalPriceB){
              //   return 1;
              // }
              // else if (totalPriceA<totalPriceB){
              //   return -1;
              // }
              // else{
              //   return 1
              // }
            }
            else if (dateA<dateB){
              return -1;
              // if (totalPriceA>totalPriceB){
              //   return -1;
              // }
              // else if (totalPriceA<totalPriceB){
              //   return 1;
              // }
              // else{
              //   return -1
              // }
            }
            else if (dateA === dateB){
              if (totalPriceA>totalPriceB){
                return 1;
              }
              else if (totalPriceA<totalPriceB){
                return -1;
              }
              else{
                return 0
              }
            }
            else {
              return 0
            }

            // if (dateA === dateB)
            // a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD')
            // const createdA = a.createdAt;
            // const createdB = b.createdAt;
            // if(createdA < createdB){return 1}
            // else if(createdB < createdA){return -1;}
            // else{return 0}
          });
          combinedTransactions.sort((a,b)=>a.createdAt - b.createdAt);
          // combinedData.reverse();

          // this loop is just to set the packageId, startdate and enddate with empty payments

        

          // combinedItems.reverse();
       
          // var monthQty = 0;
          // if (renewalTerm && (renewalTerm.includes('month') || renewalTerm.includes('never'))){
          //   paymentCount+=1;
          //   monthStartCount=monthEndCount;
          //   monthEndCount=monthStartCount+1;
          //   monthQty=1;
          //   // monthStartCount=paymentCount+monthEndCount;
          //   // monthEndCount=(paymentCount+monthStartCount);
          //   // monthStartCount=monthEndCount+paymentCount-1;
          //   // monthEndCount=(monthStartCount+1);
          //   // monthEndCount+=index;
          //   // console.log('monthEndCount monthly: ', monthEndCount);
          // }
          // else if (renewalTerm && renewalTerm.includes('quarter')){
          //   paymentCount+=1;
          //   monthStartCount=monthEndCount;
          //   monthEndCount=(monthStartCount+3);
          //   // monthStartCount=paymentCount+monthEndCount;
          //   // monthEndCount=(3+paymentCount+monthStartCount);
          //   monthQty = 3;
          //   // months+=(3+index);
          //   // monthStartCount+=(monthEndCount+index);
          //   // monthEndCount+=(monthStartCount+3+index);
          //   // console.log('monthEndCount quarterly: ', monthEndCount);
          // }
          // else if (renewalTerm && renewalTerm.includes('4month')){
          //   monthStartCount=monthEndCount;
          //   monthEndCount=(monthStartCount+4);
          //   monthQty=4;
          //   // monthStartCount+=monthEndCount;
          //   // monthEndCount+=(monthStartCount+4);
          // }
          // else if (renewalTerm && renewalTerm.includes('biyear')){
          //   monthStartCount=monthEndCount;
          //   monthEndCount=(monthStartCount+6);
          //   monthQty=6;
          //   // monthStartCount+=monthEndCount;
          //   // monthEndCount+=(monthStartCount+6);
          // }
          // else if (renewalTerm && renewalTerm.includes('year')){
          //   monthStartCount=monthEndCount;
          //   monthEndCount=(monthStartCount+12);
          //   monthQty=12;
          //   // monthStartCount+=monthEndCount;
          //   // monthEndCount+=(monthStartCount+12);
          // }

          // const startDate = moment(getTheDate(membershipStarts)).clone().add(monthStartCount, 'months').tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD');
          // const endDate = moment(getTheDate(membershipStarts)).clone().add(monthEndCount+1, 'months').tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD');

          // const startDate = startMoment.clone().add(moment.duration({months:monthStartCount})).format('YYYY-MM-DD');
          // const endDate = endMoment.clone().add(moment.duration({months:monthEndCount})).format('YYYY-MM-DD');
          // const packageData = packageId && pkgMap[packageId];
          // const pkgName = packageData && packageData.name;
          // const pkgBase = packageData && packageData.base;
          // const totalPrice = paymentData.totalPrice;

        });

        var contractLength = 0;
        var refMonthCount = 0;
        var paidMonthCount = 0;
        var paymentsByContract = [];
        var contractpackageID = null;
        var contractCounter = 0;
        var freezeCount = 0;
        var freeMonthCount = 0;
        var startDate;
        var endDate;
        var transactionsByContract=[];
        var combinedTotalPrice = 0;

        membershipHistoryList.forEach((x, indexx, array)=>{
        // combinedData.forEach((x, indexx, array)=>{
          // else if (!userPaymentDetails[doc.id][contractCounter]['paymentId']){
          //   // userPaymentDetails[doc.id][contractCounter]={combinedData}; 
          //   userPaymentDetails[doc.id][contractCounter]['paymentId']={}; // default
          // }

          if (combinedData && combinedData.length>0 && indexx<combinedData.length){
            if (!userPaymentDetails){
              userPaymentDetails={}
            }
            if (!userPaymentDetails[doc.id]){
              userPaymentDetails[doc.id]={}; // test first
            }
            if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]){
              // userPaymentDetails[doc.id][contractCounter]={combinedData}; 
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={
                packageId:'', // packageId of the current contract
                monthlyPkgId:'',
                startDate:'', // start date of the current contract
                endDate:'', // endDate of the current contract
                payments:[], // payments for the contract
                contractLength: 0, // month count
                freezeCount:0,
                freeMonthCount:0,
                paidMonthCount:0,
                refMonthCount:0,
                combinedTotalPrice:0
              }; // default
            }
            if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']){
              // userPaymentDetails[doc.id][contractCounter]={combinedData}; 
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']=[]; // default
              // console.log('userPaymentDetails: ', userPaymentDetails);
            }
            userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['userId'] = x.userId;
            userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['userData'] = data;
            userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['userData']['lastName'] = lastName;
            if (combinedData[indexx].totalPrice && parseFloat(combinedData[indexx].totalPrice)>0 && !combinedData[indexx].isFree){
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['combinedTotalPrice'] += parseFloat(combinedData[indexx].totalPrice);
            }

            if (combinedData[indexx].monthlyPkgId && (!contractpackageID || (contractpackageID===combinedData[indexx].monthlyPkgId))
              && (!combinedData[indexx].isFree)
              ){
              if (!contractpackageID){
                contractpackageID = combinedData[indexx].monthlyPkgId;
                startDate = startMoment.format('YYYY-MM-DD');
              }
              if (startDate && contractLength === 0){ // for the next contract
                startDate = moment(x.iterationDate).format('YYYY-MM-DD');
              }
              if (!endDate){
                endDate = moment(startDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              else if (endDate && moment(x.iterationDate).isSameOrAfter(moment(endDate))){
                endDate = moment(x.iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              
              // endDate = moment(startDate).add(contractLength+1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              // if (moment(x.iterationDate).isAfter(startDate) && ){
              //   startDate = x.date;
              // }
              contractLength++;
              paidMonthCount++;
              // userPaymentDetails[doc.id][contractCounter]['startDate'] = moment(startDate).format('YYYY-MM-DD'); // need to have 1 more loop?
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['startDate'] = startDate;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['endDate'] = endDate;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['packageId'] = contractpackageID;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['monthlyPkgId'] = contractpackageID;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['contractLength'] = contractLength;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['paidMonthCount'] = paidMonthCount;
              paymentsByContract.push({
                // date:array[indexx].date,
                ...x,
                ...combinedData[indexx],
                payType:'paid',
                paidMonthCount,
                endDate
              });
              transactionsByContract.push({
                ...combinedTransactions[indexx]
              });
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = paymentsByContract;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['transactions'] = transactionsByContract;
              // remove the combinedData to avoid repetition
              // combinedData.splice(indexx, 1); 
            }
            // for referral
            else if(!combinedData[indexx].monthlyPkgId && combinedData[indexx].source && combinedData[indexx].source === 'refer'){
              refMonthCount++;
              contractLength++
              paymentsByContract.push({
                ...x,
                ...combinedData[indexx],
                payType:'refer',
                endDate
              });
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['refMonthCount'] = refMonthCount;
              if (!endDate){
                endDate = moment(startDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              else if (endDate && moment(x.iterationDate).isSameOrAfter(moment(endDate))){
                endDate = moment(x.iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['endDate'] = endDate;
            }
            else if ((combinedData[indexx].monthlyPkgId && combinedData[indexx].totalPrice && (parseInt(combinedData[indexx].totalPrice)===0 && contractpackageID && combinedData[indexx].isFree))
              || (combinedData[indexx].totalPrice && parseInt(combinedData[indexx].totalPrice)===0 && combinedData[indexx].source && combinedData[indexx].source != 'freeze')
              || (contractpackageID && combinedData[indexx].isFree)
            ){ // for free, use the current contract packageId
              // console.log('inside freee: ', freeMonthCount);
              // console.log('combinedData[indexx]: ', combinedData[indexx]);
              paymentsByContract.push({
                ...x,
                ...combinedData[indexx],
                payType:'free',
                endDate
              });
              if (!userPaymentDetails){
                userPaymentDetails={}
              }
              if (!userPaymentDetails[doc.id]){
                userPaymentDetails[doc.id]={}; // test first
              }
              if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]){
                // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={
                  pgmContractId:'',
                  pgmTransactions:{},
                  packageId:'', // packageId of the current contract
                  monthlyPkgId:'', // monthly pkgId
                  startDate:'', // start date of the current contract
                  endDate:'', // endDate of the current contract
                  payments:[], // payments for the contract
                  contractLength: 0, // month count
                  freezeCount:0,
                  freeMonthCount:0,
                  refMonthCount:0
                }; // default
              }
              if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']){
                // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']=[]; // default
                // console.log('userPaymentDetails: ', userPaymentDetails);
              }
              contractLength++;
              freeMonthCount++;
              if (!endDate){
                endDate = moment(startDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              else if (endDate && moment(x.iterationDate).isSameOrAfter(moment(endDate))){
                endDate = moment(x.iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['endDate'] = endDate;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['contractLength'] = contractLength;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = paymentsByContract;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['freeMonthCount'] = freeMonthCount;
            }
            else if (combinedData[indexx].source && (combinedData[indexx].source.includes('freezeTerminate'))){ // for freezeTerminate
              // skip?
              // if (startDate && contractLength === 0){ // for the next contract
              //   startDate = moment(x.iterationDate).format('YYYY-MM-DD');
              // }

            }
            else if (combinedData[indexx].source && (combinedData[indexx].source.includes('reeze'))){ // for freeze & specialFreeze
              freezeCount++;
              contractLength++
              // console.log('inside freeze: ', freezeCount);
              // console.log('combinedData[indexx]: ', combinedData[indexx]);
              if (!endDate){
                endDate = moment(startDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              else if (endDate && moment(x.iterationDate).isSameOrAfter(moment(endDate))){
                endDate = moment(x.iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['endDate'] = endDate;
              paymentsByContract.push({
                ...x,
                ...combinedData[indexx],
                payType:'freeze',
                endDate
              });
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['contractLength'] = contractLength;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['freezeCount'] = freezeCount;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = paymentsByContract;
               // remove the combinedData to avoid repetition
               // combinedData.splice(indexx, 1); 
            }

            else if (combinedData[indexx].monthlyPkgId && (combinedData[indexx].monthlyPkgId != contractpackageID)){ 
              // for new contract
              contractLength = 0;
              contractCounter++;
              freeMonthCount=0;
              freezeCount=0;
              paidMonthCount=0;
              refMonthCount=0;

              if (!userPaymentDetails){
                userPaymentDetails={}
              }
              if (!userPaymentDetails[doc.id]){
                userPaymentDetails[doc.id]={}; // test first
              }
              if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]){
                // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={
                  packageId:'', // packageId of the current contract
                  monthlyPkgId:'', // monthly packageId
                  startDate:'', // start date of the current contract
                  endDate:'', // endDate of the current contract
                  payments:[], // payments for the contract
                  contractLength: 0, // month count
                  freezeCount:0,
                  freeMonthCount:0,
                  refMonthCount:0,
                  paidMonthCount:1,
                  combinedTotalPrice:0
                }; // default
              }
              if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']){
                // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']=[]; // default
                // console.log('userPaymentDetails: ', userPaymentDetails);
              }
              if (combinedData[indexx].totalPrice && parseFloat(combinedData[indexx].totalPrice)>0 && !combinedData[indexx].isFree){
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['combinedTotalPrice'] += parseFloat(combinedData[indexx].totalPrice);
              }
              contractLength++
              contractpackageID = combinedData[indexx].monthlyPkgId; // replace with the new packageId
              startDate = moment(x.iterationDate).format('YYYY-MM-DD');
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['startDate'] = startDate;
             
              // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['startDate'] = moment(x.date).format('YYYY-MM-DD'); // need to have 1 more loop?
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['contractLength'] = contractLength;
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['packageId'] = contractpackageID;
             // reset the payments
              paymentsByContract = [{
                ...x,
                // date:array[indexx].date,
                ...combinedData[indexx],
                endDate
              }];
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = paymentsByContract;
              if (!endDate){
                endDate = moment(startDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              else if (endDate && moment(x.iterationDate).isSameOrAfter(moment(endDate))){
                endDate = moment(x.iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD');
              }
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['endDate'] = endDate;
               // remove the combinedData to avoid repetition
               // combinedData.splice(indexx, 1); 
              // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'].push({
              //   ...x,
              //   ...combinedData[indexx]
              // })
            }
            else{
              contractLength++;
              if (!userPaymentDetails){
                userPaymentDetails={}
              }
              if (!userPaymentDetails[doc.id]){
                userPaymentDetails[doc.id]={}; // test first
              }
              if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]){
                // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
                userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={
                  packageId:'', // packageId of the current contract
                  monthlyPkgId:'', // monthly packageId
                  startDate:'', // start date of the current contract
                  endDate:'', // endDate of the current contract
                  payments:[], // payments for the contract
                  contractLength: 0, // month count
                  freezeCount:0,
                  freeMonthCount:0,
                  refMonthCount:0,
                  paidMonthCount:0
                }; // default
              }
              console.log('only freezeTerminated should go here... ', combinedData[indexx]);
              // test first
              // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['contractLength'] = contractLength;
              paymentsByContract.push({
                // date:x.date,
                ...x,
                ...combinedData[indexx],
                test:'unknown',
                endDate
              });
              userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = paymentsByContract;
            }


            // if (contractpackageID == null){
              
            // }
            // else if (contractpackageID){ // if contain contractpackageID, identify whether the previous id contains the same package
            //   if (contractpackageID!=combinedData[indexx].packageId){
            //     contractpackageID = combinedData[indexx].packageId;
            //     // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`].packageId = contractpackageID;
            //     contractCounter++;
            //     // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`].payments.push({
            //     //   test:'1'
            //     //   // ...x,
            //     //   // startDate:x.iterationStartMoment,
            //     //   // packageId:contractpackageID,
            //     //   // ...combinedData[indexx]
            //     // });
            //     // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`][paymentId] = {
            //     //   ...x,
            //     //   startDate:x.iterationStartMoment,
            //     //   // packageId:contractpackageID,
            //     //   ...combinedData[index]
            //     // }
            //     if (!userPaymentDetails){
            //       userPaymentDetails={}
            //     }
            //     if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]){
            //       // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
            //       userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={
            //         // packageId:'',
            //         // payments:[]
            //       }; // default
            //     }
            //     if (!userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']){
            //       // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]={combinedData}; 
            //       userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments']={}; // default
            //       console.log('userPaymentDetails: ', userPaymentDetails);
            //     }
            //     //  userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`].payments.push({
            //     //   test:'1'
            //     //   // ...x,
            //     //   // startDate:x.iterationStartMoment,
            //     //   // packageId:contractpackageID,
            //     //   // ...combinedData[indexx]
            //     // });
            //     // userPaymentDetails[doc.id][`${doc.id}_${contractCounter}`]['payments'] = {
            //     //   test:1
            //     //   // ...x,
            //     //   // startDate:x.iterationStartMoment,
            //     //   // // packageId:contractpackageID,
            //     //   // ...combinedData[indexx]
            //     // }
            //   }
             
            // }


        
            // if(!paymentHistoryByContract[userID][ContractCounter].StartDate)
            //   {paymentHistoryByContract[userID][ContractCounter].StartDate = payment.date;}
        
            //   paymentHistoryByContract[userID][ContractCounter].packageID = payment.packageID;
            //   contractpackageID = payment.packageID;
            //   paymentHistoryByContract[userID][ContractCounter].payment.push(payment);
            // } 

            // const visitText = combinedData[indexx].visitLeft? `(${combinedData[indexx].visitLeft}/${combinedData[indexx].visitMax})`:null;
            // const referredUserTxt = (combinedData[indexx].referredUser!=null)?combinedData[indexx].referredUser:null;
            // const paymentDate = combinedData[indexx].paymentDate? combinedData[indexx].paymentDate:combinedData[indexx].date;
            // const paymentType = combinedData[indexx].paymentType? combinedData[indexx].paymentType:null;
            // const cardSummary = combinedData[indexx].cardSummary? combinedData[indexx].cardSummary:null;
            // const cardExpired = combinedData[indexx].cardExpired? combinedData[indexx].cardExpired:null;
            // const freezeTypeText = combinedData[indexx].freezeType? combinedData[indexx].freezeType:null;
            // console.log('freezeTypeText: ', freezeTypeText);
            // secondaryText = createSecondaryText(combinedData[indexx].type, paymentDate, paymentType, cardSummary, cardExpired, visitText, combinedData[indexx].price, referredUserTxt, freezeCount, freezeTypeText);
            // combinedItems[indexx].secondaryText = secondaryText;
            // combinedItems[indexx].primaryText = `${combinedItems[indexx].effectiveDate.format('D MMM')} - ${combinedItems[indexx].effectiveDate.add(1, 'month').subtract(1, 'days').format('D MMM YYYY')}`
            // combinedItems[indexx].bgroundColor = combinedData[indexx].bgroundColor? combinedData[indexx].bgroundColor : null;
          }
          userPaymentDetails[doc.id]['totalContracts']=contractCounter+1;
          // userPaymentDetails[doc.id]['allMonthCount']=allMonthCount++;
          // userPaymentDetails[doc.id]['index']=indexx;
          // userPaymentDetails[doc.id]['initialMonthsDiff']=initialMonthsDiff;
          userPaymentDetails[doc.id]['allPayments']=combinedData;
          // userPaymentDetails[doc.id]['membershipHistoryArray']=array;

          //if (userPaymentDetails[doc.id][contractCounter] && userPaymentDetails[doc.id][contractCounter].monthlyPkgId){
            // userInfo = [
            //   x.userId? x.userId:'', // external userId
            //   userPaymentDetails[doc.id][contractCounter]? userPaymentDetails[doc.id][contractCounter].monthlyPkgId:'',// external contractId
            //   x.iterationDate? x.iterationDate:'', // temporary
            //   x.count? x.count:'' // temporary
            //   // name? name:'',
            //   // lastName? lastName:'',
            //   // '', //secondName
            //   // gender? gender:'', //sex
            //   // dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'', //birthOfDate
            //   // email? email:'', // email
            //   // '', // personal Id
            //   // '', // member home phone
            //   // phone? phone:'', //mobilePhone
            //   // image? image:'', //photoURL
            //   // '', // company
            //   // '', // street
            //   // '', // postalcode
            //   // '', // city
            //   // '', // state
            //   // 'Malaysia', // default?
            //   // icNumber? icNumber:'', // DocumentNumber
            //   // '', // DocumentIssuedBy
            //   // '', // DocumentIssueDate
            //   // '', // UserNumber
            //   // clubId? clubId:'', // ClubNumber
            //   // gantnerCardNumber? gantnerCardNumber:'', // MemberCardNumber
            //   // consultantEmail? consultantEmail:'', // Consultant
            //   // isActive? 1:0,
            //   // isGuest? 1:0,
            //   // '', // TodayBalance
            //   // '', // PrepaidBalance
            //   // '', // signupdate
            //   // '',// startDate? startDate:'', // startDate,
            //   // '',// endDate? endDate:'', // endDate,
            //   // '', //MinCancelTimeMonths
            //   // isActive? 1:0, // IsProrata, Yes, if contract user
            //   // '', // IsEndProrata
            //   // '', // ProrataDay
            //   // (pkgBase === 'KLCC')? 'multi club access rules': 'single club access rules', // membership, multi club access rules, single club access rules
            //   // pkgName, // paymentPlan
            //   // 'contract', // paymentPlan
            //   // '', // visitLimit
            //   // '', // RemainingVisitCount
            //   // '', // VisitPeriod
            //   // '', // SynchronizeWithContract
            //   // isMember? 'Month':'', // Timeperiod. Is contract time interval based on days or months
            //   // monthQty, // monthDiff, // ContractLength
            //   // 1, // monthDiff, // ContractFrequency
            //   // '', // IsUpfront
            //   // 6, // VatRate, SST?
            //   // '', // AdminFee
            //   // '', // AdminFee VatRate
            //   // totalPrice? totalPrice:0, // membershipFee, put 0?
            //   // 'Cash', // paymentType
            //   // '',
            //   // '', // StartChargingFromDate
            //   // '', // StartGeneratingTransactionsFromDate
            //   // '', // ForcePaymentPlan
            //   // '', // PaymentPlanAutoName
            //   // '', // IsPaymentChosenDay
            //   // '', // IsAutomaticallyEnded
            //   // '', // IsAdditionalContract
            //   // '', // StopChargingAfterMinPeriod
            //   // '', // FreezeAvailable
            //   // '', // AutomaticRenew																					
            //   // '', // PayerName
            //   // '', // PayerAddress
            //   // '', // PayerPostalCode
            //   // '', // PayerCity
            //   // '', // AccountNumber
            //   // '', // VirtualAccountNumber
            //   // '', // BankAccountBic
            //   // '', // BankAccountMandatoryId
            //   // '', // BankAccountFirstPayment
            //   // '', // BankAccountMandatorySignUpDate
            //   // '', // CreditCardNumber
            //   // '', // CreditCardReferenceNumber
            //   // '', // CreditCardExpityDate
            //   // remarks? remarks:'', // Comment1
            //   // '', // Comment2
            //   // '', // Comment3
            //   // '', // Comment4
            //   // '', // Tags
            //   // // this line and below need to remove
            //   // // renewalTerm?renewalTerm:'null',
            //   // // paymentCount,
            //   // // monthStartCount,
            //   // // monthEndCount
            // ];
            // userSheets.push(userInfo);
          // }

        });
      } 
    });

    var userInfo = [];

    Object.entries(userPaymentDetails).forEach(([userId, contractValue]) => {
      Object.entries(contractValue).forEach(([contractCounter, contractValue]) => {
        const userData = contractValue && contractValue.userData;
        const packageId = userData && userData.packageId;
        const packageData = packageId && pkgMap[packageId];
        const clubId = getClubIdByUserData(userData, packageData);
        const mcId = userData && userData.mcId;
        const consultantData = mcId && staffMap[mcId];
        const consultantEmail = consultantData && consultantData.email;
        const membershipEnds = userData && getMembershipEnd(userData);
        const membershipStarts = userData && getMembershipStart(userData);
        const isActive = packageId && membershipEnds && membershipStarts && moment(getTheDate(membershipEnds)).isSameOrAfter(moment());
        const isGuest = !membershipEnds && !membershipStarts;
        const isMember = (packageId && membershipEnds)? true:false;
        const pkgBase = packageData && packageData.base;
        const pkgName = packageData && packageData.name;
        const payments = contractValue && contractValue.payments;
        const remarks = userData && userData.remarks;
        const combinedTotalPrice = contractValue.combinedTotalPrice;
        const freezeCount = contractValue.freezeCount;
        var paymentType = 'Cash';

        // payments && payments.forEach(payment=>{
        //   const iterationDate = payment.iterationDate;
        //   const totalPrice = payment.totalPrice;
        //   const paymentType = payment.paymentType? payment.paymentType:'Cash';

          if (userId && (contractValue.packageId || contractValue.startDate || contractValue.endDate) && userData){
            userInfo = [
              userId? userId:'', // external userId
              // contractValue.monthlyPkgId? contractValue.monthlyPkgId:contractValue.packageId? contractValue.packageId:'',// external contractId
              contractCounter? contractCounter:'',
              userData? userData.name? userData.name:'':'',
              userData? userData.lastName? userData.lastName:'':'',
              '', //secondName
              userData? userData.gender? userData.gender:'':'',
              userData? userData.dateOfBirth? getTheDateFormat(userData.dateOfBirth, 'YYYY-MM-DD'):'':'',
              userData? userData.email? userData.email:'':'',
              '', // personal Id
              '', // member home phone
              userData? userData.phone? userData.phone:'':'', // mobilePhone
              userData? userData.image? userData.image:'':'', // photoURL
              '', // company
              '', // street
              '', // postalcode
              '', // city
              '', // state
              'Malaysia', // default?
              userData? userData.icNumber? userData.icNumber:'':'', // DocumentNumber
              '', // DocumentIssuedBy
              '', // DocumentIssueDate
              '', // UserNumber
              clubId, // clubId
              userData? userData.gantnerCardNumber? userData.gantnerCardNumber:'':'', // MemberCardNumber
              consultantEmail? consultantEmail:'', // Consultant
              isActive? 1:0,
              isGuest? 1:0,
              '', // TodayBalance
              '', // PrepaidBalance
              '', // signupdate
              contractValue.startDate?contractValue.startDate:'', // startDate,
              contractValue.endDate? contractValue.endDate:'',// endDate? endDate:'', // endDate,
              // iterationDate? iterationDate:'',
              // iterationDate? moment(iterationDate).add(1, 'months').subtract(1, 'days').format('YYYY-MM-DD'):'',
              '', //MinCancelTimeMonths
              isActive? 1:0, // IsProrata, Yes, if contract user
              '', // IsEndProrata
              '', // ProrataDay
              (pkgBase === 'KLCC')? 'multi club access rules': 'single club access rules', // Membership with given name must exist in PG system
              pkgName, // paymentPlan
              'contract', // paymentPlan
              '', // visitLimit
              '', // RemainingVisitCount
              '', // VisitPeriod
              '', // SynchronizeWithContract
              isMember? 'Month':'', // Timeperiod. Is contract time interval based on days or months
              (contractValue && contractValue.contractLength)? contractValue.contractLength:'', // monthQty, // monthDiff, // ContractLength
              1, // monthDiff, // ContractFrequency
              '', // IsUpfront
              6, // VatRate, SST?
              '', // AdminFee
              '', // AdminFee VatRate
              // totalPrice? totalPrice:0, // membershipFee, put 0?
              combinedTotalPrice?combinedTotalPrice:0,
              paymentType, // paymentType
              '', // StartChargingFromDate
              '', // StartGeneratingTransactionsFromDate
              '', // ForcePaymentPlan
              '', // PaymentPlanAutoName
              '', // IsPaymentChosenDay
              '', // IsAutomaticallyEnded
              '', // IsAdditionalContract
              '', // StopChargingAfterMinPeriod
              freezeCount? freezeCount>0? 1:0:0, // FreezeAvailable
              '', // AutomaticRenew																					
              userData? userData.name? userData.name:'':'', // PayerName, default to userName
              '', // PayerAddress
              '', // PayerPostalCode
              '', // PayerCity
              '', // AccountNumber
              '', // VirtualAccountNumber
              '', // BankAccountBic
              '', // BankAccountMandatoryId
              '', // BankAccountFirstPayment
              '', // BankAccountMandatorySignUpDate
              '', // CreditCardNumber
              '', // CreditCardReferenceNumber
              '', // CreditCardExpityDate
              remarks? remarks:'', // Comment1
              '', // Comment2
              '', // Comment3
              '', // Comment4
              '', // Tags

              // name? name:'',
              // lastName? lastName:'',
              // '', //secondName
              // gender? gender:'', //sex
              // dateOfBirth? getTheDateFormat(dateOfBirth, 'YYYY-MM-DD'):'', //birthOfDate
              // email? email:'', // email
              // '', // personal Id
              // '', // member home phone
              // phone? phone:'', //mobilePhone
              // image? image:'', //photoURL
              // '', // company
              // '', // street
              // '', // postalcode
              // '', // city
              // '', // state
              // 'Malaysia', // default?
              // icNumber? icNumber:'', // DocumentNumber
              // '', // DocumentIssuedBy
              // '', // DocumentIssueDate
              // '', // UserNumber
              // clubId? clubId:'', // ClubNumber
              // gantnerCardNumber? gantnerCardNumber:'', // MemberCardNumber
              // consultantEmail? consultantEmail:'', // Consultant
              // isActive? 1:0,
              // isGuest? 1:0,
              // '', // TodayBalance
              // '', // PrepaidBalance
              // '', // signupdate
              // '',// startDate? startDate:'', // startDate,
              // '',// endDate? endDate:'', // endDate,
              // '', //MinCancelTimeMonths
              // isActive? 1:0, // IsProrata, Yes, if contract user
              // '', // IsEndProrata
              // '', // ProrataDay
              // (pkgBase === 'KLCC')? 'multi club access rules': 'single club access rules', // membership, multi club access rules, single club access rules
              // pkgName, // paymentPlan
              // 'contract', // paymentPlan
              // '', // visitLimit
              // '', // RemainingVisitCount
              // '', // VisitPeriod
              // '', // SynchronizeWithContract
              // isMember? 'Month':'', // Timeperiod. Is contract time interval based on days or months
              // monthQty, // monthDiff, // ContractLength
              // 1, // monthDiff, // ContractFrequency
              // '', // IsUpfront
              // 6, // VatRate, SST?
              // '', // AdminFee
              // '', // AdminFee VatRate
              // totalPrice? totalPrice:0, // membershipFee, put 0?
              // 'Cash', // paymentType
              // '',
              // '', // StartChargingFromDate
              // '', // StartGeneratingTransactionsFromDate
              // '', // ForcePaymentPlan
              // '', // PaymentPlanAutoName
              // '', // IsPaymentChosenDay
              // '', // IsAutomaticallyEnded
              // '', // IsAdditionalContract
              // '', // StopChargingAfterMinPeriod
              // '', // FreezeAvailable
              // '', // AutomaticRenew																					
              // '', // PayerName
              // '', // PayerAddress
              // '', // PayerPostalCode
              // '', // PayerCity
              // '', // AccountNumber
              // '', // VirtualAccountNumber
              // '', // BankAccountBic
              // '', // BankAccountMandatoryId
              // '', // BankAccountFirstPayment
              // '', // BankAccountMandatorySignUpDate
              // '', // CreditCardNumber
              // '', // CreditCardReferenceNumber
              // '', // CreditCardExpityDate
              // remarks? remarks:'', // Comment1
              // '', // Comment2
              // '', // Comment3
              // '', // Comment4
              // '', // Tags
              // // this line and below need to remove
              // // renewalTerm?renewalTerm:'null',
              // // paymentCount,
              // // monthStartCount,
              // // monthEndCount
            ];
            userSheets.push(userInfo);
          }

        // });

     
      });
    });

    const updateSheetPromise = updateGoogleSheet({
      // spreadsheetId: pgmAllMembersId,
      spreadsheetId: pgmAllMembers2Id,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Migration Template!A2:CM`,
            majorDimension: "ROWS",
            values: userSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        userPaymentDetails:userPaymentDetails?userPaymentDetails:null,
        // monthlypkgMapByPrice
      })
    });
  });

});

// add all product to pgm to sheet
exports.addAllProductsToPGMSheets = functions.https.onRequest((req, res) => {
  const vendProdQuery = admin.firestore().collection('vendProducts').get();
  
  return Promise.all([vendProdQuery]).then(result=>{
    const vendProdRes = result[0];
    
    var prodSheets = [];

    vendProdRes.forEach(doc=>{
      const data = doc.data();
      const name = data.name;
      const base_name = data.base_name;
      const supply_price = data.supply_price;
      const active = data.active;
      // const 

      if (active){
        var prodInfo = [
          '', // ExternalUserId
          doc.id, // externalProdId
          base_name? base_name:'', // prodName
          supply_price? supply_price:'',// basePrice
          supply_price? supply_price:'',// sellingprice ? need to recheck
          '6', //vatRate
          '1', // initial qty
          '', // remaining qty
          '', // isbundle
          '', //selldate
          '', //expirydate
          '', // defaultEmployeeLogin
          '', // selfEmployeeLogin
          '51', // userNumber (faizul.j@boontan.net)
          '', // paymentType
          '' // barcode
        ];
        prodSheets.push(prodInfo);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmProductId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Migration Template!A2:Z`,
            majorDimension: "ROWS",
            values: prodSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  }); 
});

// add all mass changes migration to sheet
exports.addAllMassChangesToPGMSheets = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  const page = (itemData && itemData.page)? itemData.page:1;
  const paymentQuery = admin.firestore().collection('payments').get();
  const pgmUserQuery = getPGMUsers(null, page, 3);
  const userQuery = admin.firestore().collection('users').get();
  
  return Promise.all([paymentQuery, pgmUserQuery, userQuery]).then(result=>{
    const paymentRes = result[0];
    const pgmUserRes = result[1] && result[1].result && result[1].result.elements;
    const userRes = result[2];

    pgmUserRes && pgmUserRes.forEach(data=>{
      
    });

    var userMap = {};
    userRes.forEach(doc=>{
      const data = doc.data();
      const pgmUserId = data.pgmUserId;
      if (pgmUserId){
        userMap[doc.id]=data;
      }
    });

    var paymentSheet = [];

    paymentRes.forEach(doc=>{
      const data = doc.data();
      const status = data.status;
      const source = data.source;
      const userId = data.userId;
      const freezeFor = data.freezeFor;
      const freezeForStartFormat = getTheDateFormat(freezeFor, 'YYYY-MM-DD');
      const freezeForEnd = freezeFor && moment(getTheDate(freezeFor)).add(1, 'month');
      const freezeForEndFormat = getTheDateFormat(freezeForEnd, 'YYYY-MM-DD');
      const freezeType = data.freezeType;
      const freezeSource = data.freezeSource;
      const freezeTypeString = (freezeType && freezeType.includes('special'))? 'special freeze':(freezeSource && freezeSource==='adyen')? 'paid freeze':'yearly free quota';
      const freezeReason = (freezeType && freezeType.includes('special'))? 'coronavirus':(freezeSource && freezeSource==='adyen')? 'holiday':'holiday';
      const userData = userId && userMap[userId];
      const pgmUserId = userData && userData.pgmUserId;
      const pgmUserNumber = userData && userData.pgmUserNumber;
      const cancellationDate = userData && userData.cancellationDate;

      if (freezeFor && source && source === 'freeze'
        && pgmUserId // temporary, for testing
        && !cancellationDate
        ){
        var paymentInfo = [
          1, // IsUpdate, Is it an update of contract or an insert
          pgmUserId, // userId (in number format, this is user Id from PGM. not from payment collection)
          '', // userNumber
          '', // contractId
          '', // signupDate - Contract Signup date (not required)
          '', // startDate - not required
          '', // contract endDate - not required
          '', // cancel reason - Must exist in the system, default: "EndOfContract"
          '', // accessRule, contract membership type name (required if insert)
          '', // paymentPlan (required if insert),
          '', // StartingPackage (Contract starting package product name)
          '', // contract discount
          '', // discount additional value 
          '', // ContractDiscountAdditionalValue2
          '', // ContractDiscountAdditionalDate
          freezeTypeString, // freezeType, free freeze - carnet, free freeze - memberships, freeze - last month free, special freeze, yearly free quota, paid freeze
          freezeForStartFormat, // freeze start date
          freezeForEndFormat, // freeze end date
          freezeReason, // freezeReason required if freezeType is entered & contractFreezeId is empty, holiday/injury/medical/pregnancy/workorstudyabroad/coronavirus
          '', // isFreezeUpdate (Not required)
          '', // contractFreezeId, If IsFreezeUpdate = 1 then you can directly specify the Id of the freeze to be updated, Id must exist in the system 
        ];
        paymentSheet.push(paymentInfo);
      }
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: pgmMassChangesId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `Migration Template!A2:Z`,
            majorDimension: "ROWS",
            values: paymentSheet
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        paymentSheet
        // pgmUserRes
      });
    });
  }); 
});

// add all membership babel payment to sheet summary - cron job
exports.addAllMembershipPaymentSummaryToSheets = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const usersQuery = admin.firestore().collection('users')
  // .where('email', '==', 'lyanaothman2020@gmail.com')
  .get();
  // const usersQuery = admin.firestore().collection('users').get();

  // const startDate = '2017-06-01';
  // const endDate = '2022-06-30';
  const startDate = '2017-06-01';
  // const endDate = '2017-12-31';
  // const endDate = '2020-03-18';
  // const endDate = '2022-06-30';
  // const startDate = '2018-01-01';
  const endDate = '2024-12-31';
  
  return Promise.all([paymentQuery, packagesQuery, usersQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];

    var finalUserData = [];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      packageMap[doc.id] = data;
    });

    // var userMap = {};
    // userResults.forEach(doc=>{
    //   const data = doc.data();
    //   if (data){
    //     userMap[doc.id] = data;
    //   }
    // });

    var paymentsForUserId = [];
    var paymentsByUserId = {};
    var payments = {};
    
    var paymentFreezeForUserId = [];
    var paymentFreezeByUserId = {};

    var paymentFreezeTerminatedForUserId = [];
    var paymentFreezeTerminatedByUserId = {};

    var paymentFreeForUserId = [];
    var paymentFreeByUserId = {};

    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const type = data && data.type;
        const userId = data && data.userId;
        const status = data && data.status;
        const source = data && data.source;
        const renewalTerm = data && data.renewalTerm;
        const quantity = data && (data.quantity?data.quantity:1);
        const transactionId = data && data.transactionId;
        const vendSaleId = data && data.vendSaleId;
        const packageId = data && data.packageId;
        const packageData = packageMap[packageId];
        const packageName = packageData && packageData.name;
        const packageBase = packageData && packageData.base;
        var totalPrice = data && data.totalPrice;

        // store the payment
        if((status === 'CLOSED' || status === 'LAYBY_CLOSED') && type === 'membership' && userId &&
        source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
       ){

        // store yearly package
        if (renewalTerm && (renewalTerm === 'yearly'||renewalTerm === 'year')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var i = 0; i< quantity*12; i++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(i, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId, 
              visitLeft: (quantity*12) - i,
              visitMax: quantity*12,
              packageName, totalPrice,
              pricePermonth:(totalPrice/(quantity*12)),
              cycle:`${i+1}/${quantity*12}`,
              cycleNumber:i+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'biyearly'||renewalTerm === 'biyear')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var j = 0; j< quantity*6; j++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(j, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*6 - j,
              visitMax: quantity*6,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*6)),
              cycle:`${j+1}/${quantity*6}`,
              cycleNumber:j+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'quarterly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var k = 0; k< quantity*3; k++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(k, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*3 - k,
              visitMax: quantity*3,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*3)),
              cycle:`${k+1}/${quantity*3}`,
              cycleNumber:k+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === '4monthly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
          for (var l = 0; l< quantity*4; l++){
            paymentsForUserId.push({
              createdAt:moment(getTheDate(createdAt)).add(l, 'months'),
              paymentDate:createdAt,
              source, transactionId, vendSaleId,
              visitLeft: quantity*4 - l,
              visitMax: quantity*4,
              packageName, totalPrice, 
              pricePermonth:(totalPrice/(quantity*4)),
              cycle:`${l+1}/${quantity*4}`,
              cycleNumber: l+1,
              quantity, packageBase
            });
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
        else if (renewalTerm && (renewalTerm === 'month'||renewalTerm === 'monthly')){
          paymentsForUserId = paymentsByUserId[userId] || [];
        
          if(totalPrice && (totalPrice === 0 || totalPrice === '0.00' || totalPrice === '0')){
          paymentsForUserId.push({
            createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
            paymentDate:createdAt,
            source, transactionId, vendSaleId,
            visitLeft: 1,
            visitMax: 1,
            packageName, totalPrice, 
            pricePermonth:(totalPrice/(quantity)),
            cycleNumber:1, packageBase,
            // cycle:`${m+1}/${quantity}`,
            quantity,
            status: 'reward / free'
          });
          }
          else{
            for (var m = 0; m< quantity; m++){
              paymentsForUserId.push({
                createdAt:moment(getTheDate(createdAt)).add(m, 'months'),
                paymentDate:createdAt,
                source, transactionId, vendSaleId,
                visitLeft: 1,
                visitMax: 1,
                packageName, totalPrice, 
                pricePermonth:(totalPrice/(quantity)),
                cycle:`${m+1}/${quantity}`,
                cycleNumber:m+1,
                quantity, packageBase
              });
            }
          }
          paymentsByUserId[userId] = paymentsForUserId;
        }
      }
      else if (source && source === 'freezeTerminate'){
        paymentFreezeTerminatedForUserId = paymentFreezeTerminatedByUserId[userId] || [];
        paymentFreezeTerminatedForUserId.push(data);
        paymentFreezeTerminatedByUserId[userId] = paymentFreezeTerminatedForUserId;
      }
      else if (source && source === 'freeze'){
        paymentFreezeForUserId = paymentFreezeByUserId[userId] || [];
        for (var n = 0; n<quantity; n++){
          paymentFreezeForUserId.push(data);
          paymentFreezeByUserId[userId] = paymentFreezeForUserId;
          paymentFreezeByUserId[userId].freezeFor = data && data.freezeFor && moment(getTheDate(data.freezeFor)).add(n, 'months')
          paymentFreezeByUserId[userId].quantity = quantity;
        }
      }
      else if (source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
        paymentFreeForUserId = paymentFreeByUserId[userId] || [];
        paymentFreeForUserId.push(data);
        paymentFreeByUserId[userId] = paymentFreeForUserId;
        paymentFreeByUserId[userId].createdAt = data && data.createdAt && moment(getTheDate(data.createdAt))
      }
    }
    else{
      // console.log('not related data: ', data);
    }
    // else if (status === 'VOIDED'){
    //   console.log(moment(getTheDate(createdAt)).format('YYYY-MM-DD'));
    // }

    });

    userResults && userResults.forEach(doc=>{
      var paymentHistory = [];
      var combinedData = [];

      const data = doc && doc.data();
      const userId = doc.id;

      const name = data && data.name;
      const email = data && data.email;
      const phone = data && data.phone;
      const packageId = data && data.packageId;
      const packageData = packageMap[packageId];
      const packageName = packageData && packageData.name;
      const packageBase = (packageData && packageData.base)? packageData.base:"complimentary";
      const autoMembershipEnds = data && (data.autoMembershipEnds?data.autoMembershipEnds: data.membershipEnds?data.membershipEnds:null);
      const autoMembershipStarts = data && (data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null);
      const membershipStartText = autoMembershipStarts && moment(getTheDate(autoMembershipStarts)).format('YYYY-MM-DD')
      const startMoment = moment(getTheDate(autoMembershipStarts));
      const icNumber = (data && data.nric)? data.nric:'';
      const passportNumber = (data && data.passport)? data.passport:'';
      const race = (data && data.race)? data.race:'';
      const gender = (data && data.gender)? data.gender:'';
      const memberCurrentPkgBase = packageBase;
      const cancellationReason = data && data.cancellationReason;

       // add automembership start by 1 month
       const autoMembershipStartsAdd1Month = autoMembershipStarts && moment(getTheDate(autoMembershipStarts)).add(1,'momnths');
       const cancellationDate = data && data.cancellationDate;
       const cancellationFormat = cancellationDate &&  moment(getTheDate(cancellationDate)).format('YYYY-MM-DD');

       const freeAccessData = paymentFreeByUserId[userId];
       const freezeUserData = paymentFreezeByUserId[userId];
       const paymentUserData = paymentsByUserId[userId];
       const freezeTerminateUserData = paymentFreezeTerminatedByUserId[userId];

       // do the sorting
       freezeUserData && freezeUserData.sort((a,b)=>{
        const createdA = moment(getTheDate(a.freezeFor)).tz('Asia/Kuala_Lumpur').toDate();
        const createdB = moment(getTheDate(b.freezeFor)).tz('Asia/Kuala_Lumpur').toDate(); 
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });
      // freezeUserData && freezeUserData.reverse();

      freezeTerminateUserData && freezeTerminateUserData.sort((a,b)=>{
        const createdA = moment(getTheDate(a.freezeFor)).tz('Asia/Kuala_Lumpur').toDate();
        const createdB = moment(getTheDate(b.freezeFor)).tz('Asia/Kuala_Lumpur').toDate(); 
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });
      // freezeTerminateUserData && freezeTerminateUserData.reverse();
      freeAccessData && freeAccessData.sort((a,b)=>{
        // const createdA = moment(getTheDate(a.createdAt)).tz('Asia/Kuala_Lumpur').toDate();
        // const createdB = moment(getTheDate(b.createdAt)).tz('Asia/Kuala_Lumpur').toDate(); 
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        if(createdA < createdB){return 1;
        }else if(createdB < createdA){return -1
        }else{return 0}
      });

      // freeAccessData && freeAccessData.reverse();
      paymentUserData && paymentUserData.sort((a,b)=>{
        // const createdA = moment(getTheDate(a.createdAt)).tz('Asia/Kuala_Lumpur').toDate();
        // const createdB = moment(getTheDate(b.createdAt)).tz('Asia/Kuala_Lumpur').toDate(); 
        const createdA = a.createdAt;
        const createdB = b.createdAt;
        const cycleA = a.cycle;
        const cycleB = b.cycle;
        const cycleNumberA = a.cycleNumber;
        const cycleNumberB = b.cycleNumber;

        // if (cycleA < cycleB){return -1}
        // else if(cycleB < cycleA){return 1}

        if(createdA < createdB){return -1;
        }else if(createdB < createdA){return 1
        }

        if (cycleNumberA < cycleNumberB){return -1}
        else if(cycleNumberB < cycleNumberA){return 1}
        //else{return 0}
        else{return 0}
      });
      paymentUserData && paymentUserData.reverse();

      // const monthsDiff = Math.max(moment('2022-06-30').diff(moment('2018-01-01'), 'months')) + 1;
      const monthsDiff = Math.max(moment(endDate).diff(moment(startDate), 'months')) + 1;
      const userMonthsDiff = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment(getTheDate(autoMembershipEnds)), 'months')); 
      const userMonthsDiffSinceJan2018 = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment('2018-01-01'), 'months')); 

      if (autoMembershipStarts && autoMembershipEnds && (!email.includes('faizul'))){
        var isActiveMember;
        var isTerminatedMember;
        for (var i = 0; i<=monthsDiff; i++){
          // const iterationStartMoment = startMoment.clone().add(i, 'months');
          const iterationStartMoment = moment(startDate).clone().add(i, 'months');
          paymentHistory.push({iterationStartMoment, type:'', userId, text:''});
        }
        // console.log('paymentHistory: ', paymentHistory);
        
        paymentHistory && paymentHistory.forEach(doc=>{
          // isActiveMember = moment(getTheDate(autoMembershipEnds)).clone().isSameOrAfter(doc.iterationStartMoment)?'ACTIVE MEMBER':'NOT ACTIVE';
          // isTerminatedMember = (cancellationDate && moment(getTheDate(cancellationDate)).clone().isSameOrAfter(doc.iterationStartMoment))?'TERMINATED MEMBER':'NOT TERMINATED';
          
          isActiveMember = doc.iterationStartMoment.isSameOrBefore(moment(getTheDate(autoMembershipEnds)).subtract(1, 'months'))? 'ACTIVE MEMBER':'NOT ACTIVE';
          isTerminatedMember = (cancellationDate && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(cancellationDate)).subtract(1, 'months'))) ? 'TERMINATED MEMBER':'NOT TERMINATED';

          // if(moment(getTheDate(autoMembershipStarts)).isBetween(doc.iterationStartMoment.startOf('months'), doc.iterationStartMoment.endOf('month'))){

          // }
          if(freezeTerminateUserData && freezeTerminateUserData.length>0 
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).clone())
            // && doc.iterationStartMoment.isBefore(moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).clone().add('months', 1)) 
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            )
            {
              combinedData.push({
                date:freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor,
                memberBase: packageBase,
                type:`freezeTerminated
                \nFreezeTerminated Date: ${(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)? moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).format('YYYY-MM-DD'):'n/a'}
                \nFreezeTerminated created Date: ${(freezeTerminateUserData[freezeTerminateUserData.length-1].createdAt)? moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].createdAt)).format('YYYY-MM-DD'):'n/a'}
                `,
              })
              freezeTerminateUserData.pop();
          }
          else if (freezeUserData && freezeUserData.length>0
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).clone().subtract(1, 'months'))
            // && doc.iterationStartMoment.isBefore(moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).clone().add('months', 1)) 
            // && moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).isBetween(doc.iterationStartMoment.subtract(1, 'days'), doc.iterationStartMoment.add(1, 'months').add(1, 'days'))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                date:freezeUserData[freezeUserData.length-1].freezeFor,
                memberBase: packageBase,
                type:`freeze 
                  \nFreeze Date: ${(freezeUserData[freezeUserData.length-1].freezeFor)? moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).format('YYYY-MM-DD'):'n/a'}
                  \nFreeze created Date: ${(freezeUserData[freezeUserData.length-1].createdAt)? moment(getTheDate(freezeUserData[freezeUserData.length-1].createdAt)).format('YYYY-MM-DD'):'n/a'}
                  \n${isActiveMember}\n${isTerminatedMember}`
              })
              freezeUserData.pop();
          }
          else if (freeAccessData && freeAccessData.length>0
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freeAccessData[freeAccessData.length-1].createdAt)))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                date:freeAccessData[freeAccessData.length-1].createdAt,
                type:`FREEACCESS 
                  \nDateRewarded: ${(freeAccessData[freeAccessData.length-1].createdAt)? 
                  moment(getTheDate((freeAccessData[freeAccessData.length-1].createdAt))).format('YYYY-MM-DD'):'n/a'}
                  \nSource: ${(freeAccessData[freeAccessData.length-1].source)? freeAccessData[freeAccessData.length-1].source:'n/a'}
                  \nMemberBase: ${packageBase}
                  \n${isActiveMember}\n${isTerminatedMember}`,
                source:'free',
                memberBase: packageBase,
              })
              freeAccessData.pop();
          }
          else if (paymentUserData && paymentUserData.length>0
            // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(paymentUserData[paymentUserData.length-1].createdAt)))
            && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(autoMembershipStarts)).startOf('months'))
            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
            ){
              combinedData.push({
                date:paymentUserData[paymentUserData.length-1].createdAt,
                memberBase: packageBase,
                type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? `PAID : ${parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
                \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
                \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
                \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
                \nMemberBase: ${packageBase}
                \nPackageBase: ${(paymentUserData[paymentUserData.length-1].packageBase)? (paymentUserData[paymentUserData.length-1].packageBase):'complimentary'}
                \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
                \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
                \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}
                \n${isActiveMember}\n${isTerminatedMember}`,
                transactionId:paymentUserData[paymentUserData.length-1].transactionId,
                vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
                packageName:paymentUserData[paymentUserData.length-1].packageName,
                packageBase:paymentUserData[paymentUserData.length-1].packageBase,
              })
              paymentUserData.pop();
          }
          // place the remaining
          // else if (paymentUserData && paymentUserData.length>0){
          //   combinedData.push({
          //     date:paymentUserData[paymentUserData.length-1].createdAt,
          //     type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2):'0.00'}   
          //     \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
          //     \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
          //     \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
          //     \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
          //     \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
          //     \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
          //     \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
          //     \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}`,
          //     transactionId:paymentUserData[paymentUserData.length-1].transactionId,
          //     vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
          //     packageName:paymentUserData[paymentUserData.length-1].packageName
          //   })
          //   paymentUserData.pop();
          // }
          else if (doc.iterationStartMoment.isBefore(moment(getTheDate(autoMembershipStarts)).startOf('months'))){
          // else if (autoMembershipStartsAdd1Month && doc.iterationStartMoment.isBefore(autoMembershipStartsAdd1Month.startOf('months'))){
            combinedData.push({
               date:doc.iterationStartMoment.toDate(),
               type:`not yet started`
             }) 
          }
          // else if
          else{
            combinedData.push({
              date:doc.iterationStartMoment.toDate(),
              type:`unpaid \n${isActiveMember}\n${isTerminatedMember}`
            })
          }
        });
        // combinedData.reverse();

        //identify unknown packagebase
        combinedData.forEach((data, index) => {
          // if contain free access
          if (data.source && data.source === 'free'){
            // console.log('dataSource: ', data);
            // check for previous package base
            var i = index;
            combinedData.forEach((data2, index2) => {
              var j = index2;
              if (data2.packageBase){
                combinedData[index].packageBase = data2.packageBase;
              }
            });
            // while(index!=0 ){
            //   combinedData[index].packageBase = data.packageBase;
            // }
          }
          // if (!data.packageBase){
          //   if (!combinedData[index-1].packageBase)
          //     i = index;
          //     while(!combinedData[i].packageBase )
          //     i++;
          // }
        });

        // 2nd loop for rechecking, if not exist, package base is memberBase
        combinedData.forEach((data, index) => {
          if (data.source && data.source === 'free' && !data.packageBase){
            combinedData[index].packageBase = data.memberBase;
          }
        });


        // console.log('combinedData: ', combinedData);

        if (combinedData && combinedData.length>=1){
          const paymentData = [
            name, email, packageName, membershipStartText, 
            icNumber, passportNumber, race, phone, gender, packageBase,
            cancellationDate? cancellationFormat: '', 
            cancellationReason? cancellationReason:'',
            
            // 2017 (June 2017)
            combinedData[0].type, // june 2017
            combinedData[1].type,
            combinedData[2].type,
            combinedData[3].type,
            combinedData[4].type,
            combinedData[5].type,
            combinedData[6].type,
            
            // 2018
            combinedData[6].type, // jan2018
            combinedData[7].type,
            combinedData[8].type,
            combinedData[9].type,
            combinedData[10].type,
            combinedData[11].type,
            combinedData[12].type,
            combinedData[13].type,
            combinedData[14].type,
            combinedData[15].type,
            combinedData[16].type,
            combinedData[17].type,

            // 2019
            combinedData[18].type, // jan2019
            combinedData[19].type,
            combinedData[20].type,
            combinedData[21].type,
            combinedData[22].type,
            combinedData[23].type,
            combinedData[24].type,
            combinedData[25].type,
            combinedData[26].type,
            combinedData[27].type,
            combinedData[28].type,
            combinedData[29].type,

            // 2020
            combinedData[30].type, // jan2020
            combinedData[31].type,
            combinedData[32].type,
            combinedData[33].type,
            combinedData[34].type,
            combinedData[35].type,
            combinedData[36].type,
            combinedData[37].type,
            combinedData[38].type,
            combinedData[39].type,
            combinedData[40].type,
            combinedData[41].type,

            // 2021
            combinedData[42].type, // jan 2021
            combinedData[43].type,
            combinedData[44].type,
            combinedData[45].type,
            combinedData[46].type,
            combinedData[47].type,
            combinedData[48].type,
            combinedData[49].type,
            combinedData[50].type,
            combinedData[51].type,
            combinedData[52].type,
            combinedData[53].type,

            // 2022
            combinedData[54].type, // jan 2022
            combinedData[55].type,
            combinedData[56].type,
            combinedData[57].type,
            combinedData[58].type,
            combinedData[59].type,
            combinedData[60].type,
            combinedData[61].type,
            combinedData[62].type,
            combinedData[63].type,
            combinedData[64].type,
            combinedData[65].type,

            // 2023
            combinedData[66].type, // jan 2023
            combinedData[67].type,
            combinedData[68].type,
            combinedData[69].type,
            combinedData[70].type,
            combinedData[71].type,
            combinedData[72].type,
            combinedData[73].type,
            combinedData[74].type,
            combinedData[75].type,
            combinedData[76].type,
            combinedData[77].type,

             // 2024
             combinedData[78].type, // jan 2024
             combinedData[79].type,
             combinedData[80].type,
             combinedData[81].type,
             combinedData[82].type,
             combinedData[83].type,
             combinedData[84].type,
             combinedData[85].type,
             combinedData[86].type,
             combinedData[87].type,
             combinedData[88].type,
             combinedData[89].type,

          ];
          finalUserData.push(paymentData);
        }
      }
    });
    // console.log('payments: ', payments);

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: activeMembershipSheetId,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            // range: `AUTO MEMBERSHIP PAYMENT MONTHLY SUMMARY!A52:CU`,
            range: `AUTO MEMBERSHIP PAYMENT MONTHLY SUMMARY(UPDATED)!A81:CZ`,
            majorDimension: "ROWS",
            values: finalUserData
          }
        ],  // TODO: Update placeholder value.
  
        // TODO: Add desired properties to the request body.
      },
    });

    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true,
        // payments: finalUserData,
      });
    }).catch(error=>{
      return res.status(200).send({
        success:false,
        error
        // payments: finalUserData,
      });
    })
  });
});

// babel monthly revenue
// exports.

// add all product to pgm to sheet
exports.addAllPackagesToSheets = functions.https.onRequest((req, res) => {
  const pkgQuery = admin.firestore().collection('packages').get();
  const vendProductQuery = admin.firestore().collection('vendProducts').get();
  
  return Promise.all([pkgQuery, vendProductQuery]).then(result=>{
    const pkgRes = result[0];
    const vendProdRes = result[1];
    
    var pkgSheets = [];

    var vendProdMap = {};
    vendProdRes.forEach(doc=>{
      const data = doc.data();
      vendProdMap[doc.id]=data;
    });

    pkgRes.forEach(doc=>{
      const data = doc.data();
      const pkgId = doc.id;
      const name = data.name;
      const price = data.price;
      const priceWithTax = data.priceWithTax;
      // const monthlyFee = data.monthlyFee; // monthly price for yearly, biyearly, 3m, 4m packages
      const base = data.base;
      const renewalTerm = data.renewalTerm;
      const active = data.active;
      const vendProductIds = data.vendProductIds;
      
      
      // vendProductIds && vendProductIds.forEach(vendId=>{

      // });

      var pkgInfo = [
        pkgId? pkgId:'',
        name? name:'', 
        price? price:'', 
        priceWithTax? priceWithTax:'',
        // monthlyFee? monthlyFee:'',
        base? base:'', 
        renewalTerm? renewalTerm:'',
        active? active:'',
        vendProductIds? vendProductIds[0]? vendProductIds[0]:'':'',
        vendProductIds? vendProductIds[0]? vendProdMap[vendProductIds[0]].price_book_entries[0]? vendProdMap[vendProductIds[0]].price_book_entries[0].price? vendProdMap[vendProductIds[0]].price_book_entries[0].price:'':'':'':'',
        vendProductIds? vendProductIds[1]? vendProductIds[1]:'':'',
        vendProductIds? vendProductIds[1]? vendProdMap[vendProductIds[1]].price_book_entries[0]? vendProdMap[vendProductIds[0]].price_book_entries[0].price? vendProdMap[vendProductIds[0]].price_book_entries[0].price:'':'':'':'',
        vendProductIds? vendProductIds[2]? vendProductIds[2]:'':'',
        vendProductIds? vendProductIds[2]? vendProdMap[vendProductIds[2]].price_book_entries[0]? vendProdMap[vendProductIds[0]].price_book_entries[0].price? vendProdMap[vendProductIds[0]].price_book_entries[0].price:'':'':'':'',
        vendProductIds? vendProductIds[3]? vendProductIds[3]:'':'',
        vendProductIds? vendProductIds[3]? vendProdMap[vendProductIds[3]].price_book_entries[0]? vendProdMap[vendProductIds[0]].price_book_entries[0].price? vendProdMap[vendProductIds[0]].price_book_entries[0].price:'':'':'':'',

      ];
      pkgSheets.push(pkgInfo);
    });

    const updateSheetPromise = updateGoogleSheet({
      spreadsheetId: babelAsiaSheet,
      resource: {
        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.
        // The new values to apply to the spreadsheet.
        data: [
          {
            range: `2022 packages!A2:R`,
            majorDimension: "ROWS",
            values: pkgSheets
          }
        ],
      },
    });
    return updateSheetPromise.then((result)=>{
      // console.log('theresult: ', result);
      return res.status(200).send({
        success:true
      });
    });
  }); 
});