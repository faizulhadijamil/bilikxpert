
const functions = require('firebase-functions');
var cors = require('cors');
const admin = require('firebase-admin');
const moment = require('moment');

// for demo
const pgmClientId = '0cba2d6506d74651a2156ae7667beca4';
const pgmClientSecret = '62e0b28e92e14271b7664d11a7570b3863cfe70bdc064ac28647e526b91e27bf';
const pgmURL = `https://presentation.perfectgym.pl/Api/`;

// for live
const pgmClientIdLive = '8835b6c15719429bbfa8e6c025e612ab';
const pgmClientSecretLive = 'e6e0af12259e494c9231d7948e03c5a1f48e3ac9ec04434f90b9358239827b96';
const pgmURLLive = `https://babel.perfectgym.com/Api/`;

var rp2 = require('request-promise');
const { concat } = require('lodash');

// const homeClubIdEuphoria = 22; // for demo
const homeClubIdTTDI = 1;
const homeClubIdKLCC = 2;
const homeClubIdEuphoria = 3; // for prod
const timeStamp = admin.firestore.FieldValue.serverTimestamp();

// spin club id = 20

function getTheDate(theDate){
    if (theDate === null || !theDate){return}
    // for timestamp firebase
    if (typeof(theDate)==='object'){return theDate.toDate()}
    // for string date format
    else if (typeof(theDate)==='string'){return new Date(theDate)}
}

function getPaymentPlanPkg (clubId = null){
    var paymentPlanMap = {};
    var optionsEdit = {
        'method': 'GET',
        'url': clubId? `${pgmURLLive}/PaymentPlans/PaymentPlans?isActive=true&clubid=${clubId}`:
            `${pgmURLLive}/PaymentPlans/PaymentPlans?isActive=true`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive
        }
    };
    // return rp2(optionsEdit);
    // return rp2(optionsEdit).then(result=>{
    //     return {result:JSON.parse(result)}
    // });
    return rp2(optionsEdit).then(results=>{
        const elements = results && JSON.parse(results);
        console.log('payment plan package result: ', elements);
        return elements;
    })
}

// execute online payment
// userId (required), amount (required)
exports.executeOnlinePayment = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
        const amount = optionBody? optionBody.amount? optionBody.amount:null:null;
        const redirectUrl =  optionBody? optionBody.redirectUrl? optionBody.redirectUrl:null:null;

        var optionsEdit = {
            'method': 'GET',
            'url': redirectUrl? 
                `${pgmURL}/Payments/Pay?userId=${userId}&amount=${amount}`:
                `${pgmURL}/Payments/Pay?userId=${userId}&amount=${amount}&redirectUrl=${redirectUrl}`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret
            }
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    }); 
});

// execute prepaid payment
// userId (required), amount (required)
//sample response
// operationType = Operation type
// paymentKey =	Payment key
// billNumber =	Bill identifier
// customerBalance = User prepaid account value
// operationDate = Date of operation
exports.executePrepaidPayment = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
        const totalAmount = optionBody? optionBody.totalAmount? optionBody.totalAmount:null:null;
        const redirectUrl =  optionBody? optionBody.redirectUrl? optionBody.redirectUrl:null:null;
        const clubId = optionBody? optionBody.clubId?optionBody.clubId:null:null;
        const paymentMethod = optionBody? optionBody.paymentMethod? optionBody.paymentMethod:null:null;
        const prepaidSource = optionBody? optionBody.prepaidSource? optionBody.prepaidSource:null:null;
        const operationDescription = optionBody? optionBody.operationDescription? optionBody.operationDescription:null:null;

        console.log('optionBody: ', optionBody);
        var optionsEdit = {
            'method': 'POST',
            'url': `${pgmURL}/Payments/Prepaid`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": userId,
                "totalAmount": totalAmount,
                "clubId": clubId,
                "paymentMethod": paymentMethod,
                "prepaidSource": prepaidSource,
                "operationDescription": operationDescription
            })
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    }); 
});

// get all members
exports.getMembers = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
        var optionsEdit = {
            'method': 'GET',
            'url': userId? `${pgmURL}/v2/odata/members(${userId})`:`${pgmURL}/v2/odata/members`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

// get transaction payments
exports.getTransactionPayments = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        // const optionBody = JSON.parse(JSON.stringify(req.body));
        var optionsEdit = {
            'method': 'GET',
            'url': `${pgmURLLive}/v2/odata/TransactionPayments`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive,
                'Content-Type': 'application/json',
            },
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

// search user
// currently test for search by email only
exports.searchUser = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
        const email = optionBody? optionBody.email? optionBody.email:null:null;
        const cardNumber = optionBody? optionBody.cardNumber? optionBody.cardNumber:null:null;
        const userNumber = optionBody? optionBody.userNumber? optionBody.userNumber:null:null;
        const personalId = optionBody? optionBody.personalId? optionBody.personalId:null:null;
        const phone = optionBody? optionBody.phone? optionBody.phone:null:null;

        console.log('optionBody: ', optionBody);
        var optionsEdit = {
            'method': 'GET',
            'url': email? `${pgmURLLive}/Users/Search?email=${email}`:`${pgmURLLive}/Users/Search`, // need to reedit
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive,
                'Content-Type': 'application/json',
            },
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    }); 
});

function searchPGMUserByEmail (email){
    // euphoria clubId
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Users/Search?email=${email}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
    }
    return rp2(options);
}

function compareFBPGMUserByEmail (email){
    // euphoria clubId
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Users/Search?email=${email}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
    }
    return rp2(options).then(result=>{
        return {result:JSON.parse(result)}
    });
}
// function searchPGMUserByEmail(email){

//     if (email){
//         console.log('searchPGMUserByEmail: ', email);
//         const optionsEdit = {
//             'method': 'GET',
//             'url': email? `${pgmURLLive}/Users/Search?email=${email}`:`${pgmURLLive}/Users/Search`, // need to reedit
//             'headers': {
//                 'X-Client-Id': pgmClientIdLive,
//                 'X-Client-Secret': pgmClientSecretLive,
//                 'Content-Type': 'application/json',
//             },
//         };
//         return rp2(optionsEdit);
//         // return rp2(optionsEdit).then(result=>{
//         //     // console.log('searchResult: ', JSON.parse(result));
//         //     return {success:true, result:JSON.parse(result)}
//         // })
//     }
//     else{
//         return null
//     }
// }

// bossfit clubId = 3
function getUserByClubId (clubId = homeClubIdEuphoria){
    // euphoria clubId
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Users/Users?clubId=${clubId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
    }
    return rp2(options);
}

function getHomeClubIdByPackage (packageId){
    // default pkgId is TTDI (pgm require homeClubId)
    var homeClubId = 1;
    if (packageId){
        const packagesQuery = admin.firestore().collection('packages').doc(packageId).get();
        return Promise.all([packagesQuery]).then(results=>{
            const pkgRes = results[0];
            const pkgData = pkgRes && pkgRes.data();
            const pkgBase = pkgData && pkgData.base;
            if (pkgBase && pkgBase === 'KLCC'){
                homeClubId = 2;
                console.log('inside homeClubId: ', homeClubId);
            }
            return homeClubId;
        });
        // console.log('outside homeClubId: ', homeClubId);
        // return homeClubId;
    }
    
}

function getHomeClubIdByFirstJoinVisit (firstJoinVisit){
      // default pkgId is TTDI (pgm require homeClubId)
      var homeClubId = 1;
      if (firstJoinVisit && firstJoinVisit === 'KLCC'){
        homeClubId = 2;
      }
      return homeClubId;
}

function getFirstName (userData){
    var userFirstName = '';
    const firstName = userData && userData.firstName;
    if (firstName && firstName.length>1){
        userFirstName = firstName;
    }
    else {
        const name = userData && userData.mame;
        if (name && (name.toLowerCase().split('bin') || name.toLowerCase().split('bt'))){
            const nameArray = (name.toLowerCase().split('bin') || name.toLowerCase().split('bt'));
            userFirstName = nameArray[0];
        }
        else{
            const nameArraySpace = name && name.split(' ');
            if (nameArraySpace && nameArraySpace.length===2){
                userFirstName = nameArraySpace[0];
            }
            else if (nameArraySpace && nameArraySpace.length>=2){
                userFirstName = `${nameArraySpace[0]} ${nameArraySpace[1]}`;
            }
            else{
                userFirstName = name; // testing only
            }
        }
    }
    return userFirstName;
}

function getLastName (userData){
    var userLastName = '';
    const lastName = userData && userData.lastName;
    // console.log(`lastNamelength: ${lastName.length}`);

    if (lastName && lastName.length>1){
        userLastName = lastName;
    }
    else{
        const name = userData && userData.name;
        if (name && name.toLowerCase().includes('binti')){
            const nameArray = name.toLowerCase().split('binti');
            // console.log('nameArray: ', nameArray);
            userLastName = nameArray[1]
        }
        else if (name && (name.toLowerCase().includes('bin') || name.toLowerCase().split('bt') || name.toLowerCase().split('b '))){
            const nameArray = (name.toLowerCase().split('bin') || name.toLowerCase().split('bt') || name.toLowerCase().split('b '));
            // console.log('nameArray: ', nameArray);
            userLastName = nameArray[1];
        }
        // contains space, count how many space
        else{
            const nameArraySpace = name && name.split(' ');
            if (nameArraySpace && nameArraySpace.length===2){
                userLastName = nameArraySpace[1];
            }
            else if (nameArraySpace && nameArraySpace.length>=2){
                userLastName = nameArraySpace[2];
            }
            else{
                userLastName = name; // testing only
            }
        }
    }
    // console.log('userLastName: ', userLastName);
    return userLastName;
}

function getMonthDiff(endDate, startDate){
    if (endDate && startDate){ //todo, check if valid date
        return Math.max(moment(getTheDate(startDate)).diff(moment(getTheDate(endDate)), 'months')) + 1;
    }
    else{
        return 0; // 0 months
    }
}

function getDayDiffFromFreezeNBillingDate(freezeFor, membershipStart){
    if (freezeFor && membershipStart){ //todo, check if valid date
        return Math.max(moment(getTheDate(membershipStart)).diff(moment(getTheDate(freezeFor)), 'months')) + 1;
    }
    else{
        return 0; // 0 months
    }
}

// to get the billingDate of day to adjust the freezeDate
function getBillingDay(freezeFor, membershipStart){
    if (freezeFor && membershipStart){ //todo, check if valid date
        return membershipStart && moment(getTheDate(membershipStart)).tz('Asia/Kuala_Lumpur').startOf('day').format('DD');
    }
    else{
        return '01'; // 0 months
    }
}

// to get the billingDate of day to adjust the freezeDate
function getNewFreezeDate(freezeFor, membershipStart){
    if (freezeFor && membershipStart){ //todo, check if valid date
        const theBillingDay = membershipStart && moment(getTheDate(membershipStart)).tz('Asia/Kuala_Lumpur').startOf('day').format('DD');
        const theBillingMonth = membershipStart && moment(getTheDate(membershipStart)).tz('Asia/Kuala_Lumpur').startOf('day').format('MM');
        const theBillingYear = membershipStart && moment(getTheDate(membershipStart)).tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY');

        // const freezeDay = freezeFor && getTheDateFormat(freezeFor, 'DD');
        const freezeMonth = freezeFor && getTheDateFormat(freezeFor, 'MM');
        const freezeYear = freezeFor && getTheDateFormat(freezeFor, 'YYYY');

        // const newFreezeMonth = (freezeMonth === theBillingMonth)? freezeMonth:

        const newFreezeDate = `${freezeYear}-${freezeMonth}-${theBillingDay}T00:00:00`;
        return newFreezeDate;
    }
    else{
        return null;
    }
}

function createPGMMember (userData){
    console.log('creating memberData... ', userData.email);

    const email = (userData && userData.email)? userData.email:'';
    const phoneNumber = (userData && userData.phone)? getPhoneNumberFormat(userData.phone):'';
    // const firstName = (userData && userData.firstName)? userData.firstName:userData.name?userData.name:'';
    const firstName = userData && getFirstName(userData);
    // const lastName = (userData && userData.lastName)? userData.lastName:'';
    const lastName = userData && getLastName(userData);
    const sex = (userData && userData.gender)? userData.gender:null;
    const birthDate = (userData && userData.dateOfBirth)? moment(getTheDateFormat(userData.dateOfBirth), 'YYYY-MM-DDTHH:mm:ss'):null
    const packageId = (userData && userData.packageId)? userData.packageId:null;
    const firstJoinVisit = (userData && userData.firstJoinVisit)? userData.firstJoinVisit:null;
    const userId = userData && userData.id;
    const cancellationDate = userData && userData.cancellationDate;
    const membershipStarts = userData && (userData.autoMembershipStarts? userData.autoMembershipStarts:userData.membershipStarts?userData.membershipStarts:null);
    const membershipEnds = userData && (userData.autoMembershipEnds? userData.autoMembershipEnds:userData.membershipEnds?userData.membershipEnds:null);

    console.log('userId: ', userId);
    // const gantnerQuery = admin.firestore().collection('gantnerLogs').where('userId', '==', userId).get();
    const packagesQuery = packageId? admin.firestore().collection('packages').doc(packageId).get():null;
    const paymentQuery = admin.firestore().collection('payments').where('userId', '==', userId).get();

    var memberHomeClubId = 1;  //default TTDI
    var guestHomeClubId = 1; // default TTDI
    var homeClubId = 1; 
    var isMember = false; // guest
    var deviceIdGantnerArray = [];

    console.log('before createPGMUser promise...');

    return Promise.all([packagesQuery, paymentQuery]).then(result=>{
        console.log('inside the createPGMUser promise...')
        const homeClubIdByPkgRes = result[0];
        // const homeClubIdByGantnerLogRes = result[1];
        const paymentRes = result[1];

        const pkgData = homeClubIdByPkgRes && homeClubIdByPkgRes.data();
        const pkgBase = pkgData && pkgData.base;
        if (pkgBase && pkgBase === 'KLCC'){
            memberHomeClubId = 2;
            isMember = true;
        }
        else if (pkgBase && pkgBase === 'TTDI'){
            memberHomeClubId = 1;
            isMember = true;
        }

        var paymentArray = [];
        var userPaymentMap = {};
        var monthDiff = getMonthDiff(membershipEnds, membershipStarts);

        var totalActiveMonth = 0;
        paymentRes && paymentRes.forEach(doc=>{
            const data = doc.data();
            const type = data && data.type;
            const status = data && data.status;
            const source = data && data.source;
            const renewalTerm = data && (data.renewalTerm? data.renewalTerm:'monthly');
            const quantity = data && (data.quantity? data.quantity:1);
            const userId = data && data.userId;

            // for payment
            // if (type && type==='membership' && status === 'CLOSED' && source && (source === 'vend' || source === 'adyen' || source === 'pbonline')){
            if (type && type==='membership'){
                totalActiveMonth+=1;
                paymentArray.push(data);
            }
            // // for freeze
            // else if (source && source === 'freeze'){
            //     totalActiveMonth+=1;
            // }
            // else if (source && (source === 'jfr' || source === 'refer' || source === 'free' || source === 'join')){
            //     totalActiveMonth+=1;
            // }
        });

        paymentArray && paymentArray.sort((a,b)=>{
            const createdAtA = a.createdAt;
            const createdAtB = b.createdAt;
            if (createdAtA < createdAtB) {return -1}
            if (createdAtA > createdAtB) {return 1}
            return 0;
        });

        const filteredPaymentArray = paymentArray && paymentArray.filter(data=>{
            const status = data && data.status;
            if (status && (!status.includes("CLOSED"))){
                return false;
            }
            else{
                return true;
            }
        });

        return null; // test

    });
}

function createPGMUser (userData){
    console.log('creating userData... ', userData.email);
    console.log('userId: ', userData.id);

    const email = (userData && userData.email)? userData.email:'';
    const phoneNumber = (userData && userData.phone)? getPhoneNumberFormat(userData.phone):'';
    // const firstName = (userData && userData.firstName)? userData.firstName:userData.name?userData.name:'';
    const firstName = userData && getFirstName(userData);
    // const lastName = (userData && userData.lastName)? userData.lastName:'';
    const lastName = userData && getLastName(userData);
    const sex = (userData && userData.gender)? userData.gender:null;
    const birthDate = (userData && userData.dateOfBirth)? moment(getTheDateFormat(userData.dateOfBirth), 'YYYY-MM-DDTHH:mm:ss'):null
    const packageId = (userData && userData.packageId)? userData.packageId:null;
    const firstJoinVisit = (userData && userData.firstJoinVisit)? userData.firstJoinVisit:null;
    const userId = userData && userData.id;
    const cancellationDate = userData && userData.cancellationDate;

    const gantnerQuery = admin.firestore().collection('gantnerLogs').where('userId', '==', userId).get();
    const packagesQuery = packageId? admin.firestore().collection('packages').doc(packageId).get():null;
    // const paymentQuery = admin.firestore().collection('payments').where('userId', '==', userId).get();

    // const homeClubIdByPackageQuery = packageId? getHomeClubIdByPackage (packageId):null;
    // const homeClubIdByFirstGantnerLogQuery = getHomeClubIdByFirstGantnerLog(userId);
    
    var memberHomeClubId = 1;  //default TTDI
    var guestHomeClubId = 1; // default TTDI
    var homeClubId = 1; 
    var isMember = false; // guest
    var deviceIdGantnerArray = [];

    console.log('before createPGMUser promise...')
    // console.log('gantnerQuery: ', gantnerQuery);
    // console.log('packagesQuery: ', packagesQuery);

    return Promise.all([packagesQuery, gantnerQuery]).then(result=>{
        console.log('inside the createPGMUser promise...')
        const homeClubIdByPkgRes = result[0];
        const homeClubIdByGantnerLogRes = result[1];
        // const paymentRes = result[2];

        const pkgData = homeClubIdByPkgRes && homeClubIdByPkgRes.data();
        const pkgBase = pkgData && pkgData.base;
        if (pkgBase && pkgBase === 'KLCC'){
            memberHomeClubId = 2;
            isMember = true;
        }
        else if (pkgBase && pkgBase === 'TTDI'){
            memberHomeClubId = 1;
            isMember = true;
        }

        homeClubIdByGantnerLogRes && homeClubIdByGantnerLogRes.forEach(doc=>{
            const data = doc.data();
            const deviceId = data.deviceId;
            if (deviceId){
                deviceIdGantnerArray.push(deviceId);
            }
        });

        if (deviceIdGantnerArray.length>0) {
            deviceIdGantnerArray && deviceIdGantnerArray.forEach(gantnerData=>{
                if (gantnerData && gantnerData.includes('KLCC')){
                    guestHomeClubId = 2;
                }
            });
        }

        // var totalActiveMonth = 0;
        // paymentRes && paymentRes.forEach(doc=>{
        //     const data = doc.data();
        //     const type = data && data.type;
        //     const status = data && data.status;
        //     const source = data && data.source;

        //     // for payment
        //     if (type && type==='membership' && status === 'CLOSED'){
        //         totalActiveMonth+=1;
        //     }
        //     // for freeze
        //     else if (source && source === 'freeze'){
        //         totalActiveMonth+=1;
        //     }
        //     else if (source && (source === 'jfr' || source === 'refer' || source === 'free' || source === 'join')){
        //         totalActiveMonth+=1;
        //     }
        // });

        console.log(`user ${email} is member:${isMember} isFirstJoinVisit: ${firstJoinVisit} guestHomeClubId: ${guestHomeClubId}`);

        homeClubId = isMember? memberHomeClubId: firstJoinVisit? getHomeClubIdByFirstJoinVisit(firstJoinVisit):guestHomeClubId;

        const membershipEnds = userData && (userData.autoMembershipEnds? userData.autoMembershipEnds:userData.membershipEnds?userData.membershipEnds:null);
        const membershipStarts = userData && (userData.autoMembershipStarts? userData.autoMembershipStarts:userData.membershipStarts? userData.membershipStarts:null);
        const isActiveMember = membershipEnds && membershipStarts && moment(getTheDate(membershipEnds)).isSameOrAfter(moment('2021-12-01'));
        var options = {};

        // if (isActiveMember){

        //     // const paymentPlanPromise = getPaymentPlanPkg();
        //     // console.log('paymentPlanArray: ', paymentPlanArray);
        //     // var paymentPlanMap = {};
        //     const paymentPlanId = pkgData && pkgData.planId;

        //     // return paymentPlanPromise.then(result=>{
        //     //     const paymentPlanRes = result;
        //     //     console.log('paymentPlanRes: ', paymentPlanRes);

        //          // testing
        //         console.log('member is active, add contracts....');
        //         options = {
        //             'method': 'POST',
        //             'url': `${pgmURLLive}/Users/UserContract`,
        //             'headers': {
        //                 'X-Client-Id': pgmClientIdLive,
        //                 'X-Client-Secret': pgmClientSecretLive,
        //                 'Content-Type': 'application/json',
        //             },
        //             body:JSON.stringify({
        //                 paymentPlanId: paymentPlanId?paymentPlanId:5, // default is TTDI? need to remove
        //                 // startDate: "2021-01-26T00:00:00",
        //                 // signDate: "2020-01-26T00:00:00",
        //                 // startDate: getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss.ss'), // contract start date
        //                 // signDate: "2021-12-03T00:00:00", // contract sign date
        //                 startDate: getTheDateFormat(moment(getTheDate(membershipEnds)).subtract(1, 'month'), 'YYYY-MM-DDTHH:mm:ss.ss'), // contract start date
        //                 signDate: getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss.ss'), // contract sign date
        //                 // "discountIds": [10],
        //                 firstName:firstName,
        //                 lastName:lastName,
        //                 email:email,
        //                 phoneNumber:phoneNumber,
        //                 // "idCardName": "Passport",
        //                 // "idCardNumber": "ABC 123456",
        //                 // "legalGuardian": "",
        //                 // contract require birthdate. put 2000-01-01T00:00:00 if it doesnt exist
        //                 birthDate:birthDate? birthDate:"2000-01-01T00:00:00",
        //                 // isForeigner: false,
        //                 sex: sex,
        //                 homeClubId: homeClubId,
        //                 address: {
        //                     // "line1": "al. Jerozolimskie 114",
        //                     // "line2": "",
        //                     // "city": "Warszawa",
        //                     // "postalCode": "20-259",
        //                     country: "Malaysia"
        //                 }       
        //             })
        //         }
        //         console.log('createPGMMember options: ', options);
        //         return rp2(options);
        //     // });
        //     // return null;
        // }
        // else{
            // for visitors and terminated member
            options = {
                'method': 'POST',
                'url': `${pgmURLLive}/Users/User`,
                'headers': {
                    'X-Client-Id': pgmClientIdLive,
                    'X-Client-Secret': pgmClientSecretLive,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    email:email,
                    homeClubId:homeClubId,
                    phoneNumber:phoneNumber,
                    firstName:firstName,
                    lastName:lastName,
                    sex:sex,
                    birthDate:birthDate,
                    isGuest:true,
                    address:{
                        countrySymbol:"MY"
                    }
                })
            }
            // console.log('createPGMUser options: ', options);
            return rp2(options)
        // }
        // console.log('createPGMUser options: ', options);
        // return rp2(options);

    });
    // default is TTDI
    // const homeClubId = packageId? getHomeClubIdByPackage (packageId):firstJoinVisit? getHomeClubIdByFirstJoinVisit(firstJoinVisit):
    //     // 1 
    //     getHomeClubIdByFirstGantnerLog(userId);
    // console.log('create PGM homeClubId: ', homeClubId);
}

// todo... 
function updatePGMUser (userData){
    console.log('updating existing PG visitor, convert to member....: ', userData);

    return null;
}

// this doesnt work. need to call API directly from the UI
// todo, update to firebase collection too
// add user
// body:
// email: required
// clubId: required (euphoria is 22)
// addUser directly
exports.addUser = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        var userPromise;
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const bodyEmail = optionBody && optionBody.email;
        const homeClubId = optionBody && optionBody.homeClubId;
        var emailMatchArray = [];
        var uniqueEmailMatchArray = [];

        // check if email is already exist from pgm
        if (bodyEmail && homeClubId){
            userPromise = getUserByClubId();
            return Promise.all([userPromise]).then(result=>{
                const userRes = result[0] && JSON.parse(result[0]);
                const elements = userRes && userRes.elements
                elements && elements.forEach(data=>{
                    const email = data && data.email;
                    if (email && bodyEmail.trim().toLowerCase() === email.trim().toLowerCase()){
                        // email match, dont add new user, update the club instead (todo)?
                        emailMatchArray.push(email);
                    }
                });
               
                if (emailMatchArray.length>0 && bodyEmail && emailMatchArray.includes(bodyEmail.trim().toLowerCase())){
                    // email match, dont add new user, update the club instead (todo)?
                    return res.status(200).send({success:true, bodyEmail, emailMatchArray, message:"email already exist in the PGM, SKIP!"});
                }
                else{
                    var optionsEdit = {
                        'method': 'POST',
                        'url': `${pgmURL}/Users/User`,
                        'headers': {
                            'X-Client-Id': pgmClientId,
                            'X-Client-Secret': pgmClientSecret,
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(req.body)
                    };
                    return rp2(optionsEdit).then(function (result){
                        return res.status(200).send({success:true, elements, bodyEmail, emailMatchArray});
                    }).catch(error=>{
                        return res.status(200).send({success:false, error:error.message, optionBody})
                    });
                }
                
            });
        }
        else{
            return res.status(200).send({success:false, error:'No email or homeClubId'}); 
        }
        
        // console.log('optionBody: ', optionBody);
       
        
     
    });
});

// phone format
function getPhoneNumberFormat(phone){
    if (phone && typeof(phone)==='string'){
      return (phone && (phone.charAt(0)==='0')? `+6${phone}`: (phone && (phone.charAt(0)==='6'))? `+${phone}`: phone);
    }
    else if (phone && typeof(phone)!='string'){
        return `${phone}` // convert to string
    }
    else{
      return '';
    }
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

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// add User from firebase to PGM (all will be guest first)
// this function should update too...
exports.addUserFromFBToPGM = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(2000) // for testing only, need to remove
        .get();
    // const pgmUserPromise = getUserByClubId();
    // const pgmKLCCUserPromise = getUserByClubId(homeClubIdKLCC);
    // const pgmTTDIUserPromise = getUserByClubId(homeClubIdTTDI);
    // const pgmEuphoriaUserPromise = getUserByClubId(homeClubIdEuphoria);
    
    return Promise.all([userQuery]).then(result=>{
        const userRes = result[0];
        // const PGMKLCCuserRes = result[1] && JSON.parse(result[1]);
        // const PGMTTDIuserRes = result[2] && JSON.parse(result[2]);
        // const PGMEuphoriauserRes = result[3] && JSON.parse(result[3]);
        var PGMUserMapByEmail = {};
        var userMapByEmail = {};
        var PGMemailArray = [];
        var FBemailArray = [];
        var FBExistEmailArray = [];
        var FBuserPromise;
        var FBuserPromises = [];
        var FBExistUserPromise;
        var FBExistUserPromises = [];

        // const KLCCelements = PGMKLCCuserRes && PGMKLCCuserRes.elements
        // KLCCelements && KLCCelements.forEach(data=>{
        //     const email = data && data.email;
        //     PGMUserMapByEmail[email]=data;
        //     PGMemailArray.push(email);
        // });

        // const TTDIelements = PGMTTDIuserRes && PGMTTDIuserRes.elements
        // TTDIelements && TTDIelements.forEach(data=>{
        //     const email = data && data.email;
        //     PGMUserMapByEmail[email]=data;
        //     PGMemailArray.push(email);
        // });

        // const Euphoriaelements = PGMEuphoriauserRes && PGMEuphoriauserRes.elements
        // Euphoriaelements && Euphoriaelements.forEach(data=>{
        //     const email = data && data.email;
        //     PGMUserMapByEmail[email]=data;
        //     PGMemailArray.push(email);
        // });

        var userSearchPromise = null;
        var userSearchPromises = [];

        var userMap = {};
        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            const email = data && data.email;
            const userId = doc.id;
            const isValidEmail = email && validateEmail(email);
            if (email && email.length>3 && isValidEmail){
                userMapByEmail[email]=data;
                userMapByEmail[email].id = userId;

                userSearchPromise = compareFBPGMUserByEmail(email);
                
                if (userSearchPromise){
                    userSearchPromises.push(userSearchPromise);
                } 
                // for email that not exist in PGM yet
                // if (!PGMemailArray.includes(email)){
                //     FBemailArray.push(email);
                // }
                // else{
                //     // update the existing users
                //     console.log('updating existing user')
                //     FBExistEmailArray.push(email);
                // }
            }
        });

        // if (userSearchPromises && userSearchPromises.length>1){
            return Promise.all(userSearchPromises).then(result=>{
                const searchUserRes = result;
                // const searchUserRes = result && result.forEach
                var userElements = [];
                var userEmailPGMArrays = [];
                searchUserRes && searchUserRes.forEach(userRes=>{
                    const result = userRes.result;
                    const elements = result && result.elements;
                    if (elements){
                        userElements.push(elements);
                        elements && elements.forEach(theElement=>{
                            const email = theElement && theElement.email;
                            // console.log('theElement: ', theElement);
                            console.log('userElements email: ', email);
                            if (email){
                                userEmailPGMArrays.push(email);
                            }
                            // const pgmUserId = elements && elements.id;
                            // const existUserData = email && userMapByEmail[email];
                             // if (email && !existUserData){
                            //     FBuserPromise = createPGMUser(userData);
                            //     FBuserPromises.push(FBuserPromise);
                            // }
                        });
                    }
                });

                var successCount = 0;
                var failCount = 0;
                userRes && userRes.forEach(doc=>{
                    const data = doc.data();
                    const email = data && data.email;
                    data.id = doc.id;
                    // if not inside PGMarray, call create PGMUser
                    if (!userEmailPGMArrays.includes(email)){
                        let userRef = admin.firestore().collection('users').doc(doc.id);
                        let pgmTransferRef = admin.firestore().collection('pgmTransfer').doc();

                        setTimeout(function() {
                            FBuserPromise = createPGMUser(data).then(fbUserRes=>{
                                console.log('fbUserRes: ', fbUserRes);
                                userRef.update({uploadedToPGM:true, uploadedAtPGM:timeStamp});
                                pgmTransferRef.set({userId: doc.id, email, uploadedAtPGM:timeStamp, success:true});
                                successCount+=1;
                            }).catch(err=>{
                                console.log('fbUserError: ', err);
                                userRef.update({uploadedToPGM:true, uploadedAtPGM:timeStamp});
                                pgmTransferRef.set({userId: doc.id, email, uploadedAtPGM:timeStamp, success:false})
                                failCount+=1;
                            })
                            FBuserPromises.push(FBuserPromise);
                        }, 1000);

                    }
                });

                return Promise.all([FBuserPromises]).then((result)=>{
                    return res.status(200).send({
                        success:true, 
                        // searchUserRes, 
                        // userSearchPromises, 
                        userElements, 
                        userElementsLength:userElements.length,
                        userEmailPGMArrays,
                        userEmailPGMArraysLength:userEmailPGMArrays.length,
                        FBuserPromisesLength:FBuserPromises.length,
                        result:result,
                        successCount,
                        failCount
                    });
                });
            });
        // }
        // const corsFn = cors({ origin: true });
        // return corsFn(req, res, () => {
        // const homeClubId = homeClubIdEuphoria;
        // FBemailArray && FBemailArray.forEach(email=>{
        //     const userData = email && userMapByEmail[email];
        //     if (userData){
        //         FBuserPromise = createPGMUser(userData);
        //         FBuserPromises.push(FBuserPromise);
        //     }
        // });
        
        // FBExistEmailArray && FBExistEmailArray.forEach(email=>{
        //     const userData = email && userMapByEmail[email];

        //     const phoneNumber = (userData && userData.phone)? getPhoneNumberFormat(userData.phone):'';
        //     const firstName = (userData && userData.firstName)? userData.firstName:'';
        //     const lastName = (userData && userData.lastName)? userData.lastName:'';
        //     FBExistUserPromise = updatePGMUser(userData);
        //     FBExistUserPromises.push(FBuserPromise);
        // });

        // if (FBuserPromises && FBuserPromises.length>0 || (FBExistEmailArray && FBExistEmailArray.length>0)){
        //     return Promise.all([FBuserPromises]).then((result)=>{
        //         return res.status(200).send({success:true, FBemailArray, PGMemailArray, PGMemailArrayLength: PGMemailArray.length, FBuserPromisesLength: FBuserPromises.length, PGMUserMapByEmail});
        //     }).catch(error=>{
        //         return res.status(200).send({success:false, error});
        //     })
        // }
        // else{
        //     return res.status(200).send({success:false, error:'No FB promise?'}); 
        // }
        // return res.status(200).send({success:false, error:'No FB promise?'}); 
    });

    // });
});

// add basic user to pgm
exports.addUsersFromFBToPGMBasic = functions.https.onRequest((req, res) => {

    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(500) // for testing only, need to remove
        .get();

    return Promise.all([userQuery]).then(result=>{
        const userRes = result[0];

        var FBuserPromise;
        var FBuserPromises = [];
        var emailArrays = [];

        // for (var i=0;i<userRes.length;i++){
        //     const data = userRes && userRes.data();
        //     console.log('theData: ', data);
        //     const email = data && data.email;
        //     const isValidEmail = email && validateEmail(email);
        //     data.id = userRes.id;
        //     if (email && isValidEmail){
        //         setTimeout(function() {
        //             console.log('adding timeout.... ')
        //             FBuserPromise = createPGMUser(data);
        //             FBuserPromises.push(FBuserPromise);
        //             emailArrays.push(email);
        //           }, 1000);
        //     }
        // }

        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            const email = data && data.email;
            const isValidEmail = email && validateEmail(email);
            data.id = doc.id;
            if (email && isValidEmail){
                setTimeout(function() {
                    console.log('adding timeout.... ')
                    FBuserPromise = createPGMUser(data).then(pgmRes=>{
                        console.log('pgmRes: ', pgmRes);
                        console.log('hai faizul.....')
                    }).catch(error=>{
                        console.log('error creatting PGM user...:', error);
                    });
                    FBuserPromises.push(FBuserPromise);
                    emailArrays.push(email);
                  }, 1000);
            }
        });

        return Promise.all([FBuserPromises]).then((result)=>{
            return res.status(200).send({
                success:true, 
                // searchUserRes, 
                // userSearchPromises
                emailArrays,
                FBuserPromises,
                FBuserPromisesLength:FBuserPromises.length,
                result:result,
                userRes
            });
        });
    });

});
// add User from firebase to PGM (all will be guest first)
// this function should update too...
exports.addMemberFromFBToPGM = functions.https.onRequest((req, res) => {

    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(200) // for testing only, need to remove
        .get();
    const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();

    const pgmUserPromise = getUserByClubId();
    const pgmKLCCUserPromise = getUserByClubId(homeClubIdKLCC);
    const pgmTTDIUserPromise = getUserByClubId(homeClubIdTTDI);
    const pgmEuphoriaUserPromise = getUserByClubId(homeClubIdEuphoria);
    
    return Promise.all([userQuery, pgmKLCCUserPromise, pgmTTDIUserPromise, pgmEuphoriaUserPromise, paymentQuery]).then(result=>{
        const userRes = result[0];
        const PGMKLCCuserRes = result[1] && JSON.parse(result[1]);
        const PGMTTDIuserRes = result[2] && JSON.parse(result[2]);
        const PGMEuphoriauserRes = result[3] && JSON.parse(result[3]);
        const paymentRes = result[4];

        var PGMUserMapByEmail = {};
        var userMapByEmail = {};
        var PGMemailArray = [];
        var FBemailArray = [];
        var FBExistEmailArray = [];
        var FBuserPromise;
        var FBuserPromises = [];
        var FBExistUserPromise;
        var FBExistUserPromises = [];

        const KLCCelements = PGMKLCCuserRes && PGMKLCCuserRes.elements
        KLCCelements && KLCCelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        const TTDIelements = PGMTTDIuserRes && PGMTTDIuserRes.elements
        TTDIelements && TTDIelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        const Euphoriaelements = PGMEuphoriauserRes && PGMEuphoriauserRes.elements
        Euphoriaelements && Euphoriaelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        var paymentArray = [];
        var paymentMap = {};
        paymentRes && paymentRes.forEach(doc=>{
            const data = doc.data();
            const userId = data && data.userId;
            paymentArray = (userId && paymentMap[userId]) || [];
            paymentArray.push(data);
            paymentMap[userId] = paymentArray;
        });

        var userMap = {};
        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            const email = data && data.email;
            const userId = doc.id;
            const packageId = data && data.packageId;
            const membershipStarts = data && (data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null);
            const membershipEnds =  data && (data.autoMembershipEnds?data.autoMembershipEnds:data.membershipEnds?data.membershipEnds:null);
            const isActiveMember = membershipStarts && membershipEnds && packageId; // get all first
            // const isActiveMember = membershipStarts && membershipEnds && packageId && moment(getTheDate(membershipEnds)).isSameOrAfter(moment('2021-12-01'));

            if (email && email.length>3 && isActiveMember){
                userMapByEmail[email]=data;
                userMapByEmail[email].id = userId;
                // for email that not exist in PGM yet
                if (!PGMemailArray.includes(email)){
                    FBemailArray.push(email);
                }
                else{
                    // update the existing users
                    FBExistEmailArray.push(email);
                }
            }
        });

        // const corsFn = cors({ origin: true });
        // return corsFn(req, res, () => {
        const homeClubId = homeClubIdEuphoria;
        FBemailArray && FBemailArray.forEach(email=>{
            const userData = email && userMapByEmail[email];
            if (userData){
                // FBuserPromise = createPGMUser(userData);
                FBuserPromise = createPGMMember(userData);
                FBuserPromises.push(FBuserPromise);
            }
        });
        
        FBExistEmailArray && FBExistEmailArray.forEach(email=>{
            const userData = email && userMapByEmail[email];
            FBExistUserPromise = updatePGMUser(userData);
            FBExistUserPromises.push(FBuserPromise);
        });

        if (FBuserPromises && FBuserPromises.length>0 || (FBExistEmailArray && FBExistEmailArray.length>0)){
            return Promise.all([FBuserPromises]).then((result)=>{
                return res.status(200).send({success:true, FBemailArray, PGMemailArray, FBuserPromises, FBuserPromisesLength: FBuserPromises.length, PGMUserMapByEmail, result});
            }).catch(error=>{
                return res.status(200).send({success:false, error});
            })
        }
        else{
            return res.status(200).send({success:false, error:'No FB promise?'}); 
        }
        // return res.status(200).send({success:false, error:'No FB promise?'}); 
    });

    // });
});

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

function addPGContract(combData, userData, PGUserData){

    console.log('PGUserData: ', PGUserData);

    if (combData && userData && PGUserData){
       
        const paymentPlanId = combData && combData.paymentPlanId;
        console.log('paymentPlanId: ', paymentPlanId);


        // const options = {
        //     'method': 'POST',
        //     'url': `${pgmURLLive}/Users/User`,
        //     'headers': {
        //         'X-Client-Id': pgmClientIdLive,
        //         'X-Client-Secret': pgmClientSecretLive,
        //         'Content-Type': 'application/json',
        //     },
        //     body:JSON.stringify({
        //         email:email,
        //         homeClubId:homeClubId,
        //         phoneNumber:phoneNumber,
        //         firstName:firstName,
        //         lastName:lastName,
        //         sex:sex,
        //         birthDate:birthDate,
        //         isGuest:true,
        //         address:{
        //             countrySymbol:"MY"
        //         }
        //     })
        // }
        // console.log('createPGMUser options: ', options);
        // return rp2(options);
        return null // testing only
    }
  
}

exports.addPGContractToMember = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users').where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(200) // for testing only, need to remove
        .get();
    const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();

    const pgmUserPromise = getUserByClubId();
    const pgmKLCCUserPromise = getUserByClubId(homeClubIdKLCC);
    const pgmTTDIUserPromise = getUserByClubId(homeClubIdTTDI);
    const pgmEuphoriaUserPromise = getUserByClubId(homeClubIdEuphoria);
    const packageQuery = admin.firestore().collection('packages').get();

    // console.log('useremail: ', userEmail);

    return Promise.all([userQuery, paymentQuery, pgmKLCCUserPromise, pgmTTDIUserPromise, pgmEuphoriaUserPromise, packageQuery]).then(result=>{
        const userRes = result[0];
        const paymentRes = result[1];
        const PGMKLCCuserRes = result[1] && JSON.parse(result[2]);
        const PGMTTDIUserRes = result[2] && JSON.parse(result[3]);
        const PGMEuphoriaUserRes = result[3] && JSON.parse(result[4]);
        const pkgRes = result[5];
        
        var pkgMap = {};
        var paymentArray = [];
        var paymentMap = {};
        var freezeArray = [];
        var freezeMap = {};
        var freePaymentArray = [];
        var freePaymentMap = {};

        var PGMUserMapByEmail = {};
        var userMapByEmail = {};
        var PGMemailArray = [];
        var FBemailArray = [];
        var FBExistEmailArray = [];
        var FBuserPromise;
        var FBuserPromises = [];
        var FBExistUserPromise;
        var FBExistUserPromises = [];

        pkgRes && pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});

        const KLCCelements = PGMKLCCuserRes && PGMKLCCuserRes.elements
        KLCCelements && KLCCelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        const TTDIelements = PGMTTDIUserRes && PGMTTDIUserRes.elements
        TTDIelements && TTDIelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        const Euphoriaelements = PGMEuphoriaUserRes && PGMEuphoriaUserRes.elements
        Euphoriaelements && Euphoriaelements.forEach(data=>{
            const email = data && data.email;
            PGMUserMapByEmail[email]=data;
            PGMemailArray.push(email);
        });

        paymentRes && paymentRes.forEach(doc=>{
            const data = doc.data();
            const userId = data && data.userId;
            const status = data && data.status;
            const source = data && data.source;
            const renewalTerm = data && data.renewalTerm;
            const quantity = data && (data.quantity?data.quantity:1);
            const transactionId = data && data.transactionId;
            const vendSaleId = data && data.vendSaleId;
            const packageId = data && data.packageId;
            const packageData = pkgMap[packageId];
            const packageName = packageData && packageData.name;
            const packageBase = packageData && packageData.base;
            var totalPrice = data && data.totalPrice;

                    // store the payment
            if((status === 'CLOSED' || status === 'LAYBY_CLOSED') && userId &&
                source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
            ){
                paymentArray = paymentMap[userId] || [];
                for (var i = 0; i< quantity; i++){
                    paymentArray.push({...data, count:i});
                }
                paymentMap[userId] = paymentArray;   
            }
            else if (source && source.includes('freeze')){
                freezeArray = freezeMap[userId] || [];
                for (var j = 0; j<quantity; j++){
                    freezeArray.push({...data, count:j});
                }
                freezeMap[userId] = freezeArray;
            }
            else if (source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')){
                freePaymentArray = freePaymentMap[userId]||[];
                for (var k = 0; k<quantity; k++){
                    freePaymentArray.push({...data, count:k});
                }
                freePaymentMap[userId] = freePaymentArray;
            }
            // if (userId){
            //     // paymentArray = paymentMap[userId] || [];
            //     // // if (!(status && status.includes('VOIDED'))){
            //     //     paymentArray.push(data);
            //     // // }
            //     // paymentMap[userId] = paymentArray;   
            // }
        });
        // // todo - sorting and add object at user
        
        // // paymentArray && paymentArray.sort((a,b)=>{
        // //     const createdAtA = a.createdAt;
        // //     const createdAtB = b.createdAt;
        // //     if (createdAtA < createdAtB) {return -1}
        // //     if (createdAtA > createdAtB) {return 1}
        // //     return 0;
        // // });

        var finalData = [] // test output only... may need to remove

        var PGuserContractPromise = null;
        var PGuserContractPromises = [];

        var searchUserPromise = null;
        var searchUserPromises = [];
        var userMap = {};
        var fbUserMapByEmail = {};
        var pgmUserMapByEmail = {};
        var activeMemberCount = 0;

        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            const email = data.email;
            const packageId = data && data.packageId;
            const userPackageData = packageId && pkgMap[packageId];
            const membershipStart = getMembershipStart(data);
            const membershipEnd = getMembershipEnd(data);
            const cancellationDate = data && data.cancellationDate;
            const isActiveMember = !cancellationDate && membershipStart && membershipEnd && packageId && moment(getTheDate(membershipEnd)).isSameOrAfter(moment('2021-12-01'));
            // const isActiveMember = !cancellationDate && membershipStart && membershipEnd && packageId;
            const paymentData = paymentMap[doc.id];
            // console.log('userData: ', data);

            console.log('isActiveMember: ', isActiveMember);
            // console.log('paymentData: ', paymentData);

            // search for active member first with payments
            if (email && paymentData && isActiveMember){
                activeMemberCount+=1;
                // search PGM if exist
                searchUserPromise = searchPGMUserByEmail(email);
                if (searchUserPromise){
                     searchUserPromises.push(searchUserPromise);
                }   
                
                userMap[doc.id]=data;
                fbUserMapByEmail[email] = data;
                // console.log('searchUserPromises: ', searchUserPromises);
            }
        });

        // userRes && userRes.forEach(doc=>{
        //     //default payment history
        //     var paymentHistory = [];
        //     var combinedData = [];
        
        //     const data = doc.data();
        //     const packageId = data && data.packageId;
        //     const userPackageData = packageId && pkgMap[packageId];
        //     const membershipStart = getMembershipStart(data);
        //     const membershipEnd = getMembershipEnd(data);
        //     const email = data.email;

        //     // check if member exist

        //     if (membershipStart && membershipEnd && packageId){
        //         console.log('isMember....');
        //         // search if exist


        //         const monthDiff = getMonthDiff(membershipStart, membershipEnd);
        //         console.log('monthDiff: ', monthDiff);
        //         for (var i = 0; i<=monthDiff; i++){
        //             const iterationStartMoment = moment(getTheDate(membershipStart)).clone().add(i, 'months');
        //             paymentHistory.push({iterationStartMoment, userId:doc.id, paymentPlanId:null});
        //         }         
        //         console.log('paymentHistory: ', paymentHistory);
        //         const paymentData = paymentMap[doc.id];
        //         const freezeData = freezeMap[doc.id];
        //         const freePaymentData = freePaymentMap[doc.id];

        //         // sorting payment
        //         paymentData && paymentData.sort((a,b)=>{
        //             const createdA = a.createdAt;
        //             const createdB = b.createdAt;
        //             if(createdA > createdB){return 1;
        //             }else if(createdB < createdA){return -1
        //             }else{return 0}
        //         });
        //         // sorting freeze
        //         freezeData && freezeData.sort((a,b)=>{
        //             const createdA = a.createdAt;
        //             const createdB = b.createdAt;
        //             if(createdA > createdB){return 1;
        //             }else if(createdB < createdA){return -1
        //             }else{return 0}
        //         });
        //         // sorting free payment
        //         freePaymentData && freePaymentData.sort((a,b)=>{
        //             const createdA = a.createdAt;
        //             const createdB = b.createdAt;
        //             if(createdA > createdB){return 1;
        //             }else if(createdB < createdA){return -1
        //             }else{return 0}
        //         });
                
        //         paymentHistory && paymentHistory.forEach((pData, index)=>{
        //             const iterationStartMoment = pData.iterationStartMoment;
        //             if(freezeData && freezeData.length>0 
        //             && iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeData[freezeData.length-1].freezeFor)).clone())
        //             // && doc.iterationStartMoment.isBefore(moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).clone().add('months', 1)) 
        //             && iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStart)))
        //             // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
        //             )
        //             {
        //                 combinedData.push({
        //                     ...pData,
        //                     ...freezeData[freezeData.length-1],
        //                     freezeEnd: (moment(getTheDate(freezeData[freezeData.length-1].freezeFor)).add(1, 'month').subtract(1, 'day')).toDate()
        //                 })
        //                 freezeData.pop();
        //             }

        //             else if (freePaymentData && freePaymentData.length>0
        //                 && iterationStartMoment.isSameOrAfter(moment(getTheDate(freePaymentData[freePaymentData.length-1].createdAt)))
        //                 && iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStart)).startOf('months'))
        //                 // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
        //                 ){
        //                 combinedData.push({
        //                     ...pData,
        //                     // startDate:iterationStartMoment.toDate(),
        //                     signDate:membershipStart,
        //                     ...freePaymentData[freePaymentData.length-1]
        //                     // source:freePaymentData[freePaymentData.length-1].source
        //                 })
        //                 freePaymentData.pop();
        //             }

        //             else if (paymentData && paymentData.length>0
        //                 && iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStart)).startOf('months'))
        //                 ){
        //                 combinedData.push({
        //                    ...pData,
        //                    // startDate:iterationStartMoment.toDate(),
        //                    signDate:membershipStart,
        //                    ...paymentData[paymentData.length-1],
        //                    paymentPlanId: paymentData[paymentData.length-1].packageId? pkgMap[paymentData[paymentData.length-1].packageId].planId? pkgMap[paymentData[paymentData.length-1].packageId].planId:null:null
        //                 });
        //                 paymentData.pop();
        //             }

        //             console.log('combinedData: ', combinedData);

        //         });

        //         combinedData && combinedData.forEach(combData=>{
        //             const PGUserData = email && PGMUserMapByEmail[email];
        //             // to update member with contract
        //             PGuserContractPromise = addPGContract(combData, data, PGUserData);
        //             PGuserContractPromises.push(PGuserContractPromise);
        //         });
        //     }
        //     else{
        //         console.log('not member, no memberstart, packageId');
        //     }

        //     finalData = combinedData;
        // });

        //if (PGuserContractPromises && PGuserContractPromises.length>=1){
            // return Promise.all([PGuserContractPromises, searchUserPromises]).then(result=>{
            // return Promise.all([searchUserPromises]).then(result=>{
            return Promise.all(searchUserPromises).then(result=>{
                // const PGUserContractRes = result[1];
                // const searchUserRes = result[0];
                const searchUserRes = result;
                // const searchUserRes = result && result.forEach
                var userElements = [];
                searchUserRes && searchUserRes.forEach(user=>{
                    const data = user && JSON.parse(user);
                    const elements = data && data.elements;
                    if (elements){
                        userElements.push(elements);
                        const email = elements && elements.email;
                        const pgmUserId = elements && elements.id;
                        
                    }
                });
               

                return res.status(200).send({
                    success:true,
                    activeMemberCount,
                    result,
                    finalData,
                    PGMUserMapByEmail,
                    searchUserRes,
                    userElements,
                    userElementsLength:userElements.length
                })
            })
        //}
        // else{
        //     return res.status(200).send({
        //         success:true,
        //         finalData,
        //         PGMUserMapByEmail,
        //         searchUserPromises
        //         // paymentMap
        //     });
        // } 
    });
});

// add user to PGM (single user)
function addUserToPGM(reqBody){
    var options = {};

    console.log("reqBody: ", reqBody);
    reqBody.homeClubId = 12 // hardcode first
    reqBody.phoneNumber = reqBody.phone;
    
    if (reqBody){
        options = { 
            'method': 'POST',
            'url': `${pgmURL}/Users/User`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(reqBody)
        };
    }
    return options;
}

// add user to PGM with contract (single user)
function addUserToPGMWithContract(reqBody){
    var options = {};
    // console.log("reqBody: ", reqBody);
    // var address = {
    //     line1:
    // }
    // reqBody.personalId = reqBody.userId;
    // reqBody.paymentPlanId = 44 // hardcode first. need to add similar to packages
    // reqBody.startDate = reqBody.autoMembershipStarts? moment(getTheDate(reqBody.autoMembershipStarts)).format():null;
    // reqBody.signDate = reqBody.joinDate? moment(getTheDate(reqBody.joinDate)).format():null;
    // // reqBody.discountIds = 'Array of discount identifiers to be applied to contract.'
    // reqBody.homeClubId = 12 // hardcode first
    // reqBody.birthDate = reqBody.dateOfBirth? moment(getTheDate(reqBody.dateOfBirth)).format():"1900-06-01T00:00:00"; // this is cumpolsory with value
    // reqBody.phoneNumber = reqBody.phone;
    // reqBody.idCardName = reqBody.nric?"IC":reqBody.passport?"passport":reqBody.icNumber?"IC":null;
    // reqBody.idCardNumber = reqBody.nric?reqBody.nric:reqBody.passport?reqBody.passport:reqBody.icNumber?reqBody.icNumber:null;
    // reqBody.isForeigner = reqBody.passport? true:false;
    // reqBody.isPaidByDifferentPerson = false // hardcode this for now
    // reqBody.sex = reqBody.gender? reqBody.gender:null;
    // reqBody.address
    // reqBody.additionalContracts = 

    // console.log('reqbody: ', reqBody);
    var pgmBody = {
        // personalId:reqBody.userId, // only accept short string. output is error if we use userId
        paymentPlanId : 7, // hardcode first. need to add similar to packages, Required. Payment plan identifier. Request creates new contract based on payment plan identified by paymentPlanId
        // Required. Contract start date.
        startDate : reqBody.autoMembershipStarts? moment(getTheDate(reqBody.autoMembershipStarts)).format('YYYY-MM-DDTHH:mm:ss'):reqBody.membershipStarts? moment(getTheDate(reqBody.membershipStarts)).format('YYYY-MM-DDTHH:mm:ss'):"1900-06-01T00:00:00",
        // Required. Contract sign date.
        signDate:reqBody.autoMembershipStarts? moment(getTheDate(reqBody.autoMembershipStarts)).format('YYYY-MM-DDTHH:mm:ss'):"1900-06-01T00:00:00",
        // why signdate cant be the same as joindate?
        // signDate:reqBody.joinDate? moment(getTheDate(reqBody.joinDate)).format('YYYY-MM-DDTHH:mm:ss'):"1900-06-01T00:00:00",
        // startDate : "2016-01-26T00:00:00",
        // signDate:"2016-01-26T00:00:00",
        // Array of discount identifiers to be applied to contract.
        // discountIds: 
        firstName:reqBody.firstName,
        // Required. User email address.
        email:reqBody.email,
        // Required. User home club identifier.
        homeClubId:1,
        // birthDate: "1978-06-01T00:00:00",
        // Required. User birth date.
        birthDate:reqBody.dateOfBirth? moment(getTheDate(reqBody.dateOfBirth)).format('YYYY-MM-DDTHH:mm:ss'):"1900-06-01T00:00:00", // this is cumpolsory with value
        phoneNumber:reqBody.phone,
        // idCardName:reqBody.nric?"IC":reqBody.passport?"passport":reqBody.icNumber?"IC":null, // need to find all acccepted values. in example just passport
        // idCardName:"Passport",
        // idCardNumber:reqBody.nric?reqBody.nric:reqBody.passport?reqBody.passport:reqBody.icNumber?reqBody.icNumber:null,
        isForeigner:reqBody.passport? true:false,
        isPaidByDifferentPerson:false, // hardcode this for nows
        sex:reqBody.gender? reqBody.gender:null,
        discountIds: [6],
    }

    // var pgmBody = 
    // {
    //         "paymentPlanId": 44,
    //         "startDate": "2016-01-26T00:00:00",
    //         "signDate": "2016-01-26T00:00:00",
    //         "discountIds": [10],
    //         "firstName": "John",
    //         "lastName": "Fibo",
    //         "email": "john.fibo@perfectgym.pl",
    //         "phoneNumber": "0048123456789",
    //         "idCardName": "Passport",
    //         "idCardNumber": "ABC 123456",
    //         "legalGuardian": "",
    //         "birthDate": "1978-06-01T00:00:00",
    //         "isForeigner": false,
    //         "sex": "Male",
    //         "homeClubId": 12,
    //         "address": {
    //             "line1": "al. Jerozolimskie 114",
    //             "line2": "",
    //             "city": "Warszawa",
    //             "postalCode": "20-259",
    //             "country": "Poland"
    //         }       
    // }

    console.log('pgmBody: ', pgmBody);
    if (reqBody && pgmBody){
        options = { 
            'method': 'POST',
            'url': `${pgmURLLive}/Users/UserContract`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(pgmBody)
        };
    }
    return options;
}


// step to transfer the data
// 1. try to transfer all user without contract (all will be guest first), skip same email if already exist in PGM
// 2. update all members with contract
// 3. update all members with freeze
// addMember from firebase to PGM
exports.transferUserFromFBtoPGM = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    
    const userQuery = userEmail? admin.firestore().collection('users')
        .where('email', '==', userEmail).get():
        admin.firestore().collection('users').where('email', '==', 'faizulseptemberpromo@gmail.com').get();

    const paymentQuery = admin.firestore().collection('payments')
        .where('type', '==', 'membership')
        .where('userId', '==', '5aFXGD0aaEQYZYWsejq4CqMne9i2')
        .get();
    
    return Promise.all([userQuery, paymentQuery]).then(results=>{ 
        const userRes = results[0];
        const paymentRes = results[1];

        var userMap = {}
        var userData; // testing for single user only 
        userRes && userRes.forEach(doc=>{
            userMap[doc.id]=doc.data();
            userData = doc.data(); // hardcode for 1 member only
            userData.userId = doc.id;
        });

        var paymentMapByUserId = {};
        var paymentArray = [];
        paymentRes && paymentRes.forEach(doc=>{
            const data = doc.data();
            const userId = data.userId;
            const source = data.source;
            if (userId && source && source !== 'freeze'){
                paymentMapByUserId[userId]=data;
                paymentArray.push(data); // hardcode for 1 member only
            }
        });

        userData.contracts = paymentArray;

        var rp2 = require('request-promise');
        var optionsEdit = addUserToPGMWithContract(userData);
        // console.log('optionsEdit: ', optionsEdit);
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
        //return res.status(200).send({success:true}); 
    });
});


// to test, faizul.j@boontan.net userId = 115507
// assign credit card to a club user -- not working
exports.assignCreditCardToClubUser = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const userId = optionBody && optionBody.userId;
        var optionsEdit = {
            'method': 'POST',
            'url': userId? `${pgmURL}/Users/CreditCard?userId=${userId}`:`${pgmURL}/Users/CreditCard`, // need to reedit
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
            // body:req.body
            body:{
                "bankName": "Bank",
                "cardNumber": "5555555555554444",
                "expirationYear": 2016,
                "expirationMonth": 12,
                "addressCity": "Warsaw",
                "addressLine": "ul. Przyczolkowa 334",
                "addressZipCode": "02-962",
                "cardHolderName": "John Fibo",
                "cvcCvv": "000"
            }
        };
        console.log('optionBody: ', optionBody);
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

// buy product
exports.buyProduct = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        var optionsEdit = {
            'method': 'POST',
            'url': `${pgmURL}/Products/Product/Buy`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(req.body)
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

// add user and assign contract to the user
exports.addUsernAssignContract = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        var optionsEdit = {
            'method': 'POST',
            'url': `${pgmURL}/Users/UserContract`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(req.body)
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

function updateUserContract (PGMUserId = null, paymentPlanId, startDate, signDate, discountIds = [], userData = null){
    var options = {};

    // for existing visitor, add with contract
    if (PGMUserId){
        // console.log('startDate: ', startDate);
        // console.log('signDate: ', signDate);
        // console.log('discountIds: ', discountIds);

        options = {
            'method':'POST',
            'url': `${pgmURLLive}/Users/Contract?userId=${PGMUserId}`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "paymentPlanId": paymentPlanId,
                "startDate": startDate,
                "signDate": signDate,
                // "discountIds": [6]  // hardcode, for testing  
                // "discountIds": discountIds
            })
        }
    }
    // if not exist in pgm yet
    else if (userData && paymentPlanId){
        const email = (userData && userData.email)? userData.email:'';
        const phoneNumber = (userData && userData.phone)? getPhoneNumberFormat(userData.phone):'';
        // const firstName = (userData && userData.firstName)? userData.firstName:userData.name?userData.name:'';
        const firstName = userData && getFirstName(userData);
        // const lastName = (userData && userData.lastName)? userData.lastName:'';
        const lastName = userData && getLastName(userData);
        const sex = (userData && userData.gender)? userData.gender:null;
        const birthDate = (userData && userData.dateOfBirth)? moment(getTheDateFormat(userData.dateOfBirth), 'YYYY-MM-DDTHH:mm:ss'):"1978-06-01T00:00:00"
        const packageId = (userData && userData.packageId)? userData.packageId:null;
        const firstJoinVisit = (userData && userData.firstJoinVisit)? userData.firstJoinVisit:null;
        const cancellationDate = userData && userData.cancellationDate;
        const membershipStarts = getMembershipStart(userData);
        const membershipEnds = getMembershipEnd(userData);
       
        const homeClubId = packageId && getHomeClubByPackage(packageId);
        console.log('homeClubId: ', homeClubId);
        console.log('paymentPlanId: ', paymentPlanId);
        console.log('birthDate: ', birthDate);
        console.log('startDate: ', startDate);
        console.log('signDate: ', signDate);
        
        if (membershipStarts && membershipEnds){
            options = {
                'method': 'POST',
                'url': `${pgmURLLive}/Users/UserContract`,
                'headers': {
                    'X-Client-Id': pgmClientIdLive,
                    'X-Client-Secret': pgmClientSecretLive,
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    paymentPlanId: paymentPlanId?paymentPlanId:7, // default is TTDI? need to remove
                    startDate: startDate,
                    signDate: signDate,
                    // startDate: getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss.ss'), // contract start date
                    // signDate: "2021-12-03T00:00:00", // contract sign date
                    // startDate: getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss.ss'), // contract start date
                    // signDate: getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss.ss'), // contract sign date
                    // discountIds: discountIds,
                    firstName:firstName,
                    lastName:lastName,
                    email:email,
                    phoneNumber:phoneNumber,
                    // "idCardName": "Passport",
                    // "idCardNumber": "ABC 123456",
                    // "legalGuardian": "",
                    // contract require birthdate. put 2000-01-01T00:00:00 if it doesnt exist
                    // birthDate:birthDate? birthDate:"2000-01-01T00:00:00",
                    birthDate: "1978-06-01T00:00:00",
                    // birthDate:"2000-01-01T00:00:00",
                    // isForeigner: false,
                    sex: sex,
                    homeClubId: homeClubId,
                    address: {
                        // "line1": "al. Jerozolimskie 114",
                        // "line2": "",
                        // "city": "Warszawa",
                        // "postalCode": "20-259",
                        country: "Malaysia"
                    }       
                })
            }
        }
    }
    return rp2(options);
}

// get payment plan by packageId
function getPaymentPlanByPackage (packageId){
    if ((packageId === '89THMCx0BybpSVJ1J8oz')
        || (packageId === 'BKcaoWGrWKYihS40MpGd')
        || (packageId === 'LNGWNSdm6kf4rz1ihj0i')
        || (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q')
        || (packageId === 'aTHIgscCxbwjDD8flTi3')
        || (packageId === 'eRMTW6cQen6mcTJgKEvy')
        || (packageId === 'q7SXXNKv83MkkJs8Ql0n')
        || (packageId === 'AdXIzAK4qTgVNAK2t9be')
        || (packageId === 'YsOxVJGLRXrHDgNTBach')
        || (packageId === 'ciha9165NwgeF7wQz7GP')
        || (packageId === 'kh513XOaG7eLX4z9G0Ft')
        || (packageId === 'uQO2UsaRiqXtzPKjTSIS')
        ){
        // KLCC unlimited paymentPlan package (unlimited)
        return 8
    }
    else{
        return 10 // TTDI unlimited paymentPlan 
    }
    // const packageQuery = admin.firestore().collection('packages').doc(packageId);
    // return Promise.all(packageQuery).then(result=>{
    //     const pkgRes = result;
    //     const data = pkgRes && pkgRes.data();
    //     const base = data && data.base;
    //     if (base){
    //         return {base}
    //     }
    //     else{
    //         return {base:'TTDI'}
    //     }
    // });
}

// for faster without firebase query
function getHomeClubByPackage (packageId){
    if ((packageId === '89THMCx0BybpSVJ1J8oz')
        || (packageId === 'BKcaoWGrWKYihS40MpGd')
        || (packageId === 'LNGWNSdm6kf4rz1ihj0i')
        || (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q')
        || (packageId === 'aTHIgscCxbwjDD8flTi3')
        || (packageId === 'eRMTW6cQen6mcTJgKEvy')
        || (packageId === 'q7SXXNKv83MkkJs8Ql0n')
        || (packageId === 'AdXIzAK4qTgVNAK2t9be')
        || (packageId === 'YsOxVJGLRXrHDgNTBach')
        || (packageId === 'ciha9165NwgeF7wQz7GP')
        || (packageId === 'kh513XOaG7eLX4z9G0Ft')
        || (packageId === 'uQO2UsaRiqXtzPKjTSIS')
        ){
        // KLCC unlimited paymentPlan package (unlimited)
        return 2
    }
    else{
        return 1 // TTDI unlimited paymentPlan 
    }
}

// function to add freeze to contract
function addFreezeToContract (contractId, freezeTypeId = 4, reasonId = 4, startDate, endDate){
    // var options = {};

    var options = {
        'method':'POST',
        'url': `${pgmURLLive}/Contracts/Freeze?contractId=${contractId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "freezeTypeId": freezeTypeId,
                "reasonId": reasonId,
                "startDate": startDate,
                "endDate": endDate    
            })
    }

    return rp2(options);
}

// get from pgm user data, add pgmUserId & pgmUserNumber to users collection
exports.updateUsers = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const pgmPage = (itemData && itemData.page)? itemData.page:1;
    const userQuery = userEmail? admin.firestore().collection('users')
        .where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(200)
        .get();
    const getPGUsers = getPGMUsers();

    return Promise.all([userQuery, getPGUsers]).then(result=>{
        const userRes = result[0];
        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            
        });
        const pgUsers = result[1];
        var pgElements = [];
        var pgmUserMapByEmail = {};
        if (pgUsers && pgUsers.success){
            pgElements = pgUsers && pgUsers.result && pgUsers.result.elements;
            pgElements && pgElements.forEach(data=>{
                const number = data.number;
                const email = data.email;
                pgmUserMapByEmail[email]=data;
            });
        }

        return res.status(200).send({
            success:true, 
            pgElements,
            pgmUserMapByEmail
        });
    });
    
});

exports.updateUsersContract = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users')
        .where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(1200)
        .get();

    const paymentQuery = admin.firestore().collection('payments').where('type', '==', 'membership').get();
    const TTDIpaymentPlanPromise = getPaymentPlanPkg(1);
    const KLCCpaymentPlanPromise = getPaymentPlanPkg(2);
    const packageQuery = admin.firestore().collection('packages').get();

    return Promise.all([userQuery, paymentQuery, TTDIpaymentPlanPromise, KLCCpaymentPlanPromise, packageQuery]).then(result=>{
        const userRes = result[0];
        const paymentRes = result[1];
        var paymentArray = [];
        var paymentMapByUserId = {};
        const TTDIPaymentPlanRes = result[2];
        const KLCCPaymentPlanRes = result[3];
        const pkgRes = result[4];

        var paymentsForUserId = [];
        var paymentsByUserId = {};
        var paymentFreezeForUserId = [];
        var paymentFreezeByUserId = {};
        var paymentFreeForUserId = [];
        var paymentFreeByUserId = {};

        var paymentPlanMap = {};
        var packageMapByPaymentPlanId = {};
        var pkgMap = {}

        pkgRes && pkgRes.forEach(doc=>{
            const data = doc.data();
            const paymentPlanId = data.paymentPlanId;
            packageMapByPaymentPlanId[paymentPlanId]=data;
            pkgMap[doc.id]=data;
        });

        // TTDIPaymentPlanRes && TTDIPaymentPlanRes.forEach(theElement=>{
        //     const paymentPlanId = theElement.id;

        // });

        paymentRes && paymentRes.forEach(doc=>{
            const data = doc.data();
            const status = data && data.status;
            const userId = data && data.userId;
            const source = data && data.source;
            const quantity = data.quantity || 1;
            const transactionId = data && data.transactionId;
            const vendSaleId = data && data.vendSaleId;
            const createdAt = data && data.createdAt;
            const totalPrice = data && data.totalPrice;
            const type = data && data.type;
            const packageId = data && data.packageId;
            const packageData = packageId && pkgMap[packageId];
            const renewalTerm = packageData && packageData.renewalTerm;

            if((status === 'CLOSED' || status === 'LAYBY_CLOSED') && type === 'membership' && userId &&
                source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
                && totalPrice && (parseInt(totalPrice)!=0)
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
                            totalPrice,
                            pricePermonth:(totalPrice/(quantity*12)),
                            cycle:`${i+1}/${quantity*12}`,
                            cycleNumber:i+1,
                            quantity,
                            paymentId:doc.id
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
                        totalPrice, 
                        pricePermonth:(totalPrice/(quantity*6)),
                        cycle:`${j+1}/${quantity*6}`,
                        cycleNumber:j+1,
                        quantity,
                        paymentId:doc.id
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
                        totalPrice, 
                        pricePermonth:(totalPrice/(quantity*3)),
                        cycle:`${k+1}/${quantity*3}`,
                        cycleNumber:k+1,
                        quantity,
                        paymentId:doc.id
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
                            totalPrice, 
                            pricePermonth:(totalPrice/(quantity*4)),
                            cycle:`${l+1}/${quantity*4}`,
                            cycleNumber: l+1,
                            quantity,
                            paymentId:doc.id
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
                            totalPrice, 
                            pricePermonth:(totalPrice/(quantity)),
                            cycleNumber:1,
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
                                totalPrice, 
                                pricePermonth:(totalPrice/(quantity)),
                                cycle:`${m+1}/${quantity}`,
                                cycleNumber:m+1,
                                quantity,
                                paymentId:doc.id
                            });
                        }
                    }
                    paymentsByUserId[userId] = paymentsForUserId;
                }
            }
            else if (source && source.includes('freeze')){
                paymentFreezeForUserId = paymentFreezeByUserId[userId] || [];
                for (var n = 0; n<quantity; n++){
                    paymentFreezeForUserId.push(data);
                    paymentFreezeByUserId[userId] = paymentFreezeForUserId;
                    paymentFreezeByUserId[userId].freezeFor = data && data.freezeFor && moment(getTheDate(data.freezeFor)).add(n, 'months')
                    paymentFreezeByUserId[userId].quantity = quantity;
                    paymentFreezeByUserId[userId].paymentId = doc.id
                }
            }
            else if (source && (source === 'join' || source === 'luckyDraw' || source === 'promo' || source === 'free' || source === 'complimentary' || source === 'jfr' || source === 'refer')
                || (totalPrice && parseInt(totalPrice)===0)
                ){
                paymentFreeForUserId = paymentFreeByUserId[userId] || [];
                paymentFreeForUserId.push(data);
                paymentFreeByUserId[userId] = paymentFreeForUserId;
                // paymentFreeByUserId[userId].createdAt = data && data.createdAt && moment(getTheDate(data.createdAt))
                paymentFreeByUserId[userId].paymentId = doc.id;
            }
                // paymentArray = paymentMapByUserId[userId] || [];

                // paymentArray.push(data);
                // paymentMapByUserId[userId]=paymentArray;
            
        });

        var searchUserPromise = null;
        var searchUserPromises = [];

        var paymentMapByEmail = {};
        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            const userPackageId = data && data.packageId;
            const email = data && data.email;
        
            // search for user from pgm
            if (email){
                // setTimeout(function() {
                    searchUserPromise = compareFBPGMUserByEmail(email);
                    if (searchUserPromise){
                        searchUserPromises.push(searchUserPromise);
                    }
                // }, 1000);
            }
            // paymentDataArray && paymentDataArray.forEach(paymentData=>{

            // });
        });

        var userElements = [];
        var userEmailPGMArrays = [];
        var userPGMMapByEmail = {};
        var PGMContractPromise = null;
        var PGMContractPromises = [];

        return Promise.all(searchUserPromises).then(result=>{
            const searchUserRes = result;
            searchUserRes && searchUserRes.forEach(result=>{
                // userElements.push(result);
                const theResult = result.result;
                const elements = theResult && theResult.elements;
                if (elements){
                    userElements.push(elements);
                    elements && elements.forEach(theElement=>{
                        const email = theElement && theElement.email;
                        if (email){
                            userEmailPGMArrays.push(email);
                            userPGMMapByEmail[email]=theElement;

                        }
                        // const pgmUserId = elements && elements.id;
                        // const existUserData = email && userMapByEmail[email];
                         // if (email && !existUserData){
                        //     FBuserPromise = createPGMUser(userData);
                        //     FBuserPromises.push(FBuserPromise);
                        // }
                    });
                    
                }
                else{
                    console.log('no elements,');
                    // userElements.push('no elements:', result);
                }
            });

            var finalPaymentArray = []; // to display only...
            // test moment
            console.log('test moment: ', moment('2021-01-01').isSameOrAfter(moment()));

            userRes && userRes.forEach(doc=>{
                const data = doc.data();
                const email = data.email;
                paymentMapByEmail[email] = paymentsByUserId[doc.id];
                const paymentDataArray = paymentsByUserId[doc.id];
                const freezeDataArray = paymentFreezeByUserId[doc.id];
                const freeAccessDataArray = paymentFreeByUserId[doc.id];
                var packagePaymentPlanId = null;

                const pgmUserData = userPGMMapByEmail[email];
                const packageId = data && data.packageId;
                const currentPaymentPlanIdByPackage = getPaymentPlanByPackage(packageId);
                console.log('currentPaymentPlanId1: ', currentPaymentPlanIdByPackage);
                const membershipStarts = getMembershipStart(data);
                const membershipEnds = getMembershipEnd(data);
                var monthDiff = getMonthDiff(membershipStarts, membershipEnds);
                var paymentHistory = [];
                const membershipMoment = membershipStarts && moment(getTheDate(membershipStarts));
                console.log('membership format.... ');
                console.log('membershipMoment format....: ', membershipMoment.format('YYYY-MM-DD'));

                const discountIds = [7] // testing only... // todo

                // update the contract for the existing guest
                if (userEmailPGMArrays.includes(email) && pgmUserData && membershipStarts && membershipEnds){
                    const pgmUserId = pgmUserData.id;
                    const userRef = admin.firestore().collection('users').doc(doc.id);
                   
                    // setTimeout(function() {
                    //     PGMContractPromise = updateUserContract(pgmUserId, currentPaymentPlanIdByPackage, getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss'), getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss'), discountIds, null)
                    // .then(userResult=>{
                    //     console.log('updating to member successfully: ');
                    //     userRef.update({uploadedContractToPGM:true, uploadedContractToPGMAt:timeStamp});
                    // }).catch(e=>{
                    //     userRef.update({uploadedContractToPGM:false, uploadedContractToPGMFailedAt:timeStamp, uploadedContractToPGMErro: e});
                    //     console.log('error updating to member: ');
                    // })
                    // }, 1500);

                    // // if (PGMContractPromise){
                    //     PGMContractPromises.push(PGMContractPromise);
                    // // }

                    console.log('monthDiff: ', monthDiff);

                    for (var i = 0; i<=monthDiff; i++){
                        const iterationStartMoment = moment(getTheDate(membershipStarts)).clone().add(i, 'months');
                        paymentHistory.push({iterationStartMoment, userId:doc.id, paymentPlanId:null});
                    }        

                    // sorting...
                    paymentDataArray && paymentDataArray.sort((a,b)=>{
                        const createdAtA = a.createdAt;
                        const createdAtB = b.createdAt;
                        if (createdAtA < createdAtB) {return -1}
                        if (createdAtA > createdAtB) {return 1}
                        return 0;
                    }); 

                    freezeDataArray && freezeDataArray.sort((a,b)=>{
                        const createdAtA = a.createdAt;
                        const createdAtB = b.createdAt;
                        if (createdAtA < createdAtB) {return -1}
                        if (createdAtA > createdAtB) {return 1}
                        return 0;
                    }); 

                    freeAccessDataArray && freeAccessDataArray.sort((a,b)=>{
                        const createdAtA = a.createdAt;
                        const createdAtB = b.createdAt;
                        if (createdAtA < createdAtB) {return -1}
                        if (createdAtA > createdAtB) {return 1}
                        return 0;
                    }); 

                    console.log('payment sorted....')

                    var newPaymentArray = [];

                    // if (paymentHistory && paymentHistory.length>0){
                        paymentHistory && paymentHistory.forEach(paymentData=>{
                            const iterationStartMoment = paymentData.iterationStartMoment;
                            // console.log('iterationStartMoment: ', iterationStartMoment.format('YYYY-MM-DD'));
                            if (membershipStarts && freezeDataArray && freezeDataArray.length>0 
                                && iterationStartMoment && iterationStartMoment.isSameOrAfter(moment(getTheDate(freezeDataArray[freezeDataArray.length-1].freezeFor)).clone())
                            // && paymentData.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)))
                            ){
                                console.log('adding freeze....')
                                // add freeze contract?
                                newPaymentArray.push({
                                    date:freezeDataArray[freezeDataArray.length-1].freezeFor,
                                    // memberBase: packageBase,
                                    type:`freeze`,
                                    index:newPaymentArray.length,
                                    ...freezeDataArray[freezeDataArray.length-1]
                                })
                                freezeDataArray.pop();
                            }

                            else if (membershipStarts && freeAccessDataArray && freeAccessDataArray.length>0
                            && freeAccessDataArray[freeAccessDataArray.length-1].createdAt
                            // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(freeAccessDataArray[freeAccessDataArray.length-1].createdAt)).clone())
                            //&& doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)))
                            // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)))
                            
                            // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)).startOf('months'))
                            // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
                            ){
                                console.log('adding freeAccess.... ');
                                newPaymentArray.push({
                                    date:freeAccessDataArray[freeAccessDataArray.length-1].createdAt,
                                    type:`FREEACCESS`,
                                    source:'free',
                                    // memberBase: packageBase,
                                    index:newPaymentArray.length,
                                    ...freeAccessDataArray[freeAccessDataArray.length-1]
                                });
                                freeAccessDataArray.pop();
                            }

                            else if (membershipStarts && paymentDataArray && paymentDataArray.length>0
                                //&& doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)))
                                // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)).clone())
                                // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(paymentDataArray[paymentDataArray.length-1].createdAt)))
                                // && doc.iterationStartMoment.isSameOrAfter(moment(getTheDate(membershipStarts)).startOf('months'))
                                // && doc.iterationStartMoment.isSameOrAfter(autoMembershipStartsAdd1Month)
                                ){
                                    console.log('adding payment.... ');
                                    newPaymentArray.push({
                                    // type: parseFloat((paymentDataArray[paymentDataArray.length-1].pricePermonth)).toFixed(2),
                                    // packageName:paymentDataArray[paymentDataArray.length-1].packageName,
                                    date:paymentDataArray[paymentDataArray.length-1].createdAt,
                                    // memberBase: packageBase,
                                    type: `${(paymentDataArray[paymentDataArray.length-1].pricePermonth)? `PAID : ${parseFloat((paymentDataArray[paymentDataArray.length-1].pricePermonth)).toFixed(2)}`:'PAID 0.00'}   
                                    \ntotal Price: ${(paymentDataArray[paymentDataArray.length-1].totalPrice)? (paymentDataArray[paymentDataArray.length-1].totalPrice):'0.00'} 
                                    `,
                                    index:newPaymentArray.length,
                                    ...paymentDataArray[paymentDataArray.length-1]
                                })

                                paymentDataArray.pop();
                            }
                            else{
                                console.log('none of any, should not go here....')
                            }
                        })
                    // }

                    console.log('newPaymentArray....: ');

                    finalPaymentArray.push(newPaymentArray);

                    newPaymentArray && newPaymentArray.forEach(payment=>{
                        const createdAt = payment.createdAt;
                        const source = payment.source;
                        const totalPrice = payment.totalPrice;
                        const type = payment.type;
                        const userId = payment.userId;
                        const packageId = payment.packageId;
                        const index = payment.index;
                        // hardcode, if price is zero for any package, harcode to 13 (FREE 1 MONTH MEMBERSHIP)
                        if (totalPrice && (totalPrice === 0 || parseInt(totalPrice)===0)){
                            packagePaymentPlanId = 13;
                        }


                        const currentPaymentPlanId = packagePaymentPlanId? packagePaymentPlanId:currentPaymentPlanIdByPackage;
                        console.log('currentPaymentPlanId2: ', currentPaymentPlanId);
                        const startAtDate = membershipStarts && moment(getTheDate(membershipStarts)).add(index, 'months').toDate();

                        setTimeout(function() {
                            PGMContractPromise = updateUserContract(pgmUserId, currentPaymentPlanId, getTheDateFormat(startAtDate, 'YYYY-MM-DDTHH:mm:ss'), getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss'), discountIds, null)
                        .then(userResult=>{
                            console.log('updating to member successfully: ');
                            // userRef.update({uploadedContractToPGM:true, uploadedContractToPGMAt:timeStamp});
                        }).catch(e=>{
                            // userRef.update({uploadedContractToPGM:false, uploadedContractToPGMFailedAt:timeStamp, uploadedContractToPGMError: 'error'});
                            console.log('error updating to member: ');
                        })
                        }, 1500);
    
                        // if (PGMContractPromise){
                            PGMContractPromises.push(PGMContractPromise);
                        // }
                    });

                }
                else if (!userEmailPGMArrays.includes(email) && !pgmUserData && membershipStarts && membershipEnds){
                    // PGMContractPromise = createPGMMember
                    console.log('create a new member.... ');
                    const currentPaymentPlanId = packagePaymentPlanId? packagePaymentPlanId:currentPaymentPlanIdByPackage;
                    const userRef = admin.firestore().collection('users').doc(doc.id);
                    setTimeout(function() {
                        PGMContractPromise = updateUserContract(null, currentPaymentPlanId, getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss'), getTheDateFormat(membershipStarts, 'YYYY-MM-DDTHH:mm:ss'), discountIds, data)
                        .then(userResult=>{
                            console.log('successfully creating member: ');
                            userRef.update({uploadedContractToPGM:true, uploadedContractToPGMAt:timeStamp}).catch(err=>{console.log('error updating user, ', err)})
                        }).catch(e=>{
                            console.log('error adding user: ', e);
                            userRef.update({uploadedContractToPGM:false, uploadedContractToPGMFailedAt:timeStamp, uploadedContractToPGMError: e});
                        })

                    }, 1500);

                    // if (PGMContractPromise){
                        PGMContractPromises.push(PGMContractPromise);
                    // }
                }
                
            });

            if (PGMContractPromises && PGMContractPromises.length>0){
                return Promise.all(PGMContractPromises).then(pgmRes=>{
                    return res.status(200).send({success:true, userElements, finalPaymentArray, paymentFreeByUserId, paymentMapByEmail, userPGMMapByEmail, userEmailPGMArrays, PGMContractPromises, pgmRes, TTDIPaymentPlanRes, KLCCPaymentPlanRes}); 
                })
            }
            else{
                 // return 
                return res.status(200).send({success:false, userElements, finalPaymentArray, paymentFreeByUserId, paymentMapByEmail, userPGMMapByEmail, userEmailPGMArrays, TTDIPaymentPlanRes, KLCCPaymentPlanRes}); 
            }
        });
    });
});


// add freeze to contract users
exports.addFreezeToContractMembers = functions.https.onRequest((req, res) => {
    const itemData = req.body;
    const userEmail = itemData && itemData.email;
    const userQuery = userEmail? admin.firestore().collection('users')
        .where('email', '==', userEmail).get():
        admin.firestore().collection('users')
        .limit(500)
        .get();
    const freezeQuery = admin.firestore().collection('payments')
        .where('type', '==', 'membership')
        .where('source', '==', 'freeze')
        .get();
    
    return Promise.all([userQuery, freezeQuery]).then(results=>{
        const userRes = results[0];
        const freezeRes = results[1];
        var freezeMapByUserId = {};
        var freezeArray = [];
        freezeRes && freezeRes.forEach(doc=>{
            const data = doc.data();
            const userId = data && data.userId;
            const freezeUploaded = data && data.freezeUploaded;
            if (!freezeUploaded){
                freezeArray = freezeMapByUserId[userId]||[];
                freezeArray.push({...data, id:doc.id});
                freezeMapByUserId[userId]=freezeArray;
            }
        });

        var userSearchPromise = null;
        var userSearchPromises = [];

        userRes && userRes.forEach(doc=>{
            const data = doc.data();
            // const paymentData = freezeMapByUserId[doc.id];
            const email = data.email;
            const isValidEmail = email && validateEmail(email);
            if (isValidEmail && email && email.length>3){
                userSearchPromise = compareFBPGMUserByEmail(email);
                if (userSearchPromise){
                    userSearchPromises.push(userSearchPromise);
                } 
            }
            // if (paymentData){
            //     const freezeFor = data && data.freezeFor;
            // }
        });

        return Promise.all(userSearchPromises).then(result=>{

            const searchUserRes = result;
            // const searchUserRes = result && result.forEach
            var userElements = [];
            var userEmailPGMArrays = [];
            var userPGMMap = {};
            searchUserRes && searchUserRes.forEach(userRes=>{
                const result = userRes.result;
                const elements = result && result.elements;
                if (elements){
                    userElements.push(elements);
                    elements && elements.forEach(theElement=>{
                        const email = theElement && theElement.email;
                        const pgmUserId = theElement && theElement.id;
                        const contracts = theElement && theElement.contracts
                        // console.log('theElement: ', theElement);
                        console.log('userElements email: ', email);
                        if (email && contracts && pgmUserId){
                            userEmailPGMArrays.push(email);
                            userPGMMap[email]=theElement;
                        }
                        // const pgmUserId = elements && elements.id;
                        // const existUserData = email && userMapByEmail[email];
                         // if (email && !existUserData){
                        //     FBuserPromise = createPGMUser(userData);
                        //     FBuserPromises.push(FBuserPromise);
                        // }
                    });
                }
            });

            var freezeForPromise = null;
            var freezeForPromises = [];
            userRes && userRes.forEach(doc=>{
                const data = doc.data();
                const membershipStarts = getMembershipStart(data);
                const membershipEnds = getMembershipEnd(data);
                const freezeData = freezeMapByUserId[doc.id];
                const email = data.email;
                var currentContractId;
                if (freezeData && membershipEnds && membershipStarts && email){
                    const userPGMData = userPGMMap[email];
                    const contracts = userPGMData && userPGMData.contracts;
                    contracts && contracts.forEach(contract=>{
                        const contractId = contract.id;
                        const isCurrent = contract.isCurrent;
                        if (isCurrent){
                            currentContractId = contractId;
                        }
                    });

                    if (currentContractId){
                        freezeData && freezeData.forEach(freeze=>{
                            const freezeFor = freeze.freezeFor;
                            // const membershipStartDateDayDiff = Math.max(moment(getTheDate(membershipStarts)).startOf('day').diff(moment(getTheDate(freezeFor)), 'day'));
                    
                            // const membershipStartDateDayDiff = freezeFor && membershipStarts && getDayDiffFromFreezeNBillingDate(freezeFor, membershipStarts);
                            // console.log('membershipStartDateDayDiff: ', membershipStartDateDayDiff);
                            // const theBillingDay = getBillingDay(freezeFor, membershipStarts);
                            // const freezeMonth

                            const newFreezeForStartDate = getNewFreezeDate(freezeFor, membershipStarts);
                            const newFreezeForEndDate = getNewFreezeDate(moment(getTheDate(freezeFor)).add(1, 'month'), membershipStarts);
                            console.log('newFreezeForStartDate: ', newFreezeForStartDate);
                            console.log('newFreezeForEndDate: ', newFreezeForEndDate);
                            
                            // const freezeForStartDate = freezeFor && getTheDateFormat(freezeFor, 'YYYY-MM-DDTHH:mm:ss');
                            // const freezeForEndDate = freezeFor && moment(getTheDate(freezeFor)).add(1, 'month').add(1, 'day').tz('Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss');
                            // call add freeze function
                            if (freezeFor && moment(getTheDate(freezeFor)).isValid()){
                                setTimeout(function() {
                                    freezeForPromise =  addFreezeToContract (currentContractId, 4, 4, newFreezeForStartDate, newFreezeForEndDate).then(freezeRes=>{
                                        // console.log('freezeRes: ', freezeRes);
                                        admin.firestore().collection('payments').doc(freeze.id).update({
                                            freezeUploaded:true,
                                            freezeUploadedAt:timeStamp
                                          });
                                    }).catch(error=>{
                                        console.log(`error, freezestartdate: ${newFreezeForStartDate}, freezeEndDate: ${newFreezeForEndDate}`);
                                        // console.log('therror: ', error);
                                    });
                                    if (freezeForPromise){
                                        freezeForPromises.push(freezeForPromise);
                                    }
                                }, 1000);
                            }
                            else{
                                console.log('no freezeFor found');
                            }
                           
                        })
                    }
                }
            });

            return Promise.all(freezeForPromises).then(freezeRes=>{
                return res.status(200).send({success:true, userElements, userEmailPGMArrays, freezeForPromises});
            });
        });
    });
});

exports.getPGMDiscounts = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;
    const paymentPlanId = optionBody? optionBody.paymentPlanId? optionBody.paymentPlanId:7:7;
    const clubId = optionBody? optionBody.clubId? optionBody.clubId:1:1; // default is TTDI
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Discounts/Discounts?paymentPlanId=${paymentPlanId}&clubId=${clubId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// function to getPGMUsers
function getPGMUsers (userId, page = 1, clubId = 1){
    // const corsFn = cors({ origin: true });
    // return corsFn(req, res, () => {
    var optionsEdit = {
        'method': 'GET',
        'url': userId? `${pgmURLLive}/Users/User?userId=${userId}`: 
            page? `${pgmURLLive}/Users/Users?page=${page}`:
            clubId? `${pgmURLLive}/Users/Users?clubId=${clubId}`:
            `${pgmURLLive}/Users/Users`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
    };
    var rp2 = require('request-promise');
    return rp2(optionsEdit).then(function (result){
        return {success:true, result:JSON.parse(result)}; 
    }).catch(error=>{
        return {success:false, error:error.message};
    })
   //  }); 
}

// function to getPGMUsers
function getPGMUsersByPage (page = 1){
    // const corsFn = cors({ origin: true });
    // return corsFn(req, res, () => {
    var optionsEdit = {
        'method': 'GET',
        'url': page? `${pgmURLLive}/Users/Users?page=${page}`:
            `${pgmURLLive}/Users/Users`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
    };
    var rp2 = require('request-promise');
    return rp2(optionsEdit).then(function (result){
        return {success:true, result:JSON.parse(result)}; 
    }).catch(error=>{
        return {success:false, error:error.message};
    })
   //  }); 
}

// get user details by userId
exports.getUsers = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
        const page = optionBody? optionBody.page? optionBody.page:null:null;
        const clubId = optionBody? optionBody.clubId? optionBody.clubId:null:null;

        console.log('optionBody: ', optionBody);
        var optionsEdit = {
            'method': 'GET',
            'url': userId? `${pgmURLLive}/Users/User?userId=${userId}`: 
                page? `${pgmURLLive}/Users/Users?page=${page}`:
                clubId? `${pgmURLLive}/Users/Users?clubId=${clubId}`:
                `${pgmURLLive}/Users/Users`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive,
                'Content-Type': 'application/json',
            },
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    }); 
});

// get PGM contractCharges
exports.getPGMContractCharges = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
    var theUrl = `${pgmURLLive}/v2/odata/ContractCharges`;
  
    const options = {
        'method':'GET',
        'url': theUrl,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// get PGM contracts by users
exports.getPGMContractsByUsers = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
    var contractUrl = `${pgmURLLive}/Contracts/Contracts`;
    if (userId){
        contractUrl = `${pgmURLLive}/Contracts/Contracts?userId=${userId}`
    }
    const options = {
        'method':'GET',
        'url': contractUrl,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// get contracts
exports.getPGMContractsByUserId = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const userId = optionBody? optionBody.userId? optionBody.userId:null:null;
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Contracts/Contracts?userId=${userId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// get freeze types
exports.getPGMFreezeTypes = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const contractId = optionBody? optionBody.contractId? optionBody.contractId:7:7;
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Contracts/FreezeTypes?contractId=${contractId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// get freeze reason
exports.getPGMFreezeReasons = functions.https.onRequest((req, res) => {
    const options = {
        'method':'GET',
        'url': `${pgmURLLive}/Contracts/FreezeReasons`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        }
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// execute contract freeze
exports.postFreezeByContractId = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const contractId = optionBody? optionBody.contractId? optionBody.contractId:null:null; //long, required
    const freezeTypeId = optionBody? optionBody.freezeTypeId? optionBody.freezeTypeId:null:null; // long, required
    const reasonId = optionBody? optionBody.reasonId? optionBody.reasonId:null:null; // long, required
    const startDate = optionBody? optionBody.startDate? optionBody.startDate:null:null; // string date
    const endDate = optionBody? optionBody.endDate? optionBody.endDate:null:null; // string date

    const options = {
        'method':'POST',
        'url': `${pgmURLLive}/Contracts/Freeze?contractId=${contractId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "freezeTypeId": freezeTypeId,
                "reasonId": reasonId,
                "startDate": startDate,
                "endDate": endDate    
            })
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// execute manual payment (to transfer payment from firebase to PGM)
exports.postManualContractPayment = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const userId = optionBody? optionBody.userId? optionBody.userId:null:null; //string, required (header)
    const paidAmount = optionBody? optionBody.paidAmount? optionBody.paidAmount:null:null; //decimal, required
    const contractTransactionType = optionBody? optionBody.contractTransactionType? optionBody.contractTransactionType:'Membership':'Membership'; // string, required
    const description = optionBody? optionBody.description? optionBody.description:'manualTransfer':'manualTransfer'; // string, NOT required
    const options = {
        'method':'POST',
        'url': `${pgmURLLive}/Payments/ManualContractPayment?userId=${userId}`,
        'headers': {
            'X-Client-Id': pgmClientIdLive,
            'X-Client-Secret': pgmClientSecretLive,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "paidAmount": paidAmount,
                "contractTransactionType": contractTransactionType,
                "description": description
            })
    };
    return rp2(options).then(function (result){
        return res.status(200).send({success:true, result:JSON.parse(result)}); 
    }).catch(error=>{
        return res.status(200).send({success:false, error:error.message})
    })
});

// delete user contract
exports.deleteUserContract = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const userId = optionBody && optionBody.userId;
        const contractId = optionBody && optionBody.contractId;
        var optionsEdit = {
            'method': 'DELETE',
            'url': (userId && contractId)? `${pgmURL}/Users/contract?userId=${userId}&contractId=${contractId}`:null,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret,
                'Content-Type': 'application/json',
            },
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        }).catch(error=>{
            return res.status(200).send({success:false, error:error.message})
        })
    });
});

// spin class clubId = 20
exports.productElementByClubId = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const clubId = optionBody? optionBody.clubId? optionBody.clubId:'20':'20';
        var optionsEdit = {
            'method': 'GET',
            'url': `${pgmURL}Products/products?clubid=${clubId}`,
            'headers': {
                'X-Client-Id': pgmClientId,
                'X-Client-Secret': pgmClientSecret
            }
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        });
    }); 
});

// get all club. if clubId is defined, show only the specific club
exports.getClubs = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const clubId = optionBody? optionBody.clubId? optionBody.clubId:null:null;
        console.log('theclubId: ', clubId);
        var optionsEdit = {
            'method': 'GET',
            'url': clubId? `${pgmURLLive}Clubs/Clubs?clubid=${clubId}`:
                `${pgmURLLive}Clubs/Clubs`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive
            }
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        });
    }); 
});

// get payment plan
exports.getPaymentPlan = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
        const optionBody = JSON.parse(JSON.stringify(req.body));
        const optionMethod = req.method;
        const clubId = optionBody? optionBody.clubId? optionBody.clubId:null:null;
        // console.log('theclubId: ', clubId);
        var optionsEdit = {
            'method': 'GET',
            'url': clubId? `${pgmURLLive}/PaymentPlans/PaymentPlans?isActive=true&clubid=${clubId}`:
                `${pgmURLLive}/PaymentPlans/PaymentPlans?isActive=true`,
            'headers': {
                'X-Client-Id': pgmClientIdLive,
                'X-Client-Secret': pgmClientSecretLive
            }
        };
        var rp2 = require('request-promise');
        return rp2(optionsEdit).then(function (result){
            return res.status(200).send({success:true, result:JSON.parse(result)}); 
        });
    }); 
});

// // pgm require gender
// exports.addGenderToFB = functions.https.onRequest((req, res) => {
//     const itemData = req.body;
//     const userEmail = itemData && itemData.email;
//     const userQuery = userEmail? admin.firestore().collection('users')
//         .where('email', '==', userEmail).get():
//         admin.firestore().collection('users')
//         // .limit(500)
//         .get();
  
//     return Promise.all([userQuery]).then(result=>{
//         const userRes = result[0];
//         userRes && userRes.forEach(doc=>{
//             const gender = data.gender;
//             const name = data.name;
//             if (!gender){
//                 if (name && (name.toLowerCase().includes('b ') || name.toLowerCase().includes('bin') || name.toLowerCase().includes('b.'))){

//                 }
//             }
//         });
//     });
// });

// secret: babelPGM
// webhook update PGM
exports.updatePGM = functions.https.onRequest((req, res) => {
    console.log('updating the pgm....');
    const theData = JSON.parse(JSON.stringify(req.body));
    // console.log('theData: ', theData);
    const event = theData && theData.event;

    const collectionName = `pgm${event}`
    // console.log('collectionName: ', collectionName);
    // usermodified not sending the detail changes.
    if (event && event === 'UserModified'){
        const pgmUserData = theData.data;
        const createdAt = timeStamp;
        const pgmUserInfo = pgmUserData && pgmUserData.user;
        const pgmUserId = pgmUserInfo && pgmUserInfo.userId && pgmUserInfo.userId.toString();
        const userType = pgmUserData && pgmUserData.userType;
        const homeClubId = pgmUserData && pgmUserData.homeClubId;
        const pgmUserEmail = pgmUserInfo && pgmUserInfo.userEmail;
        const pgmUserNumber = pgmUserInfo && pgmUserInfo.userNumber;
        // console.log('homeClubId: ', homeClubId);
        // console.log('pgmUserId: ', pgmUserId);
        // add pgmUsers
        return admin.firestore().collection('pgmUsers').doc(pgmUserId).set({
            createdAt,
            ...pgmUserInfo,
            userType,
            homeClubId
        }).then(()=>{
            console.log('successfully added to pgmUsers collection');
            const usersQuery = admin.firestore().collection('users').where('email', '==', pgmUserEmail).limit(1).get();
            return Promise.all([usersQuery]).then(result=>{
                const userRes = result[0];
                userRes.forEach(doc=>{
                    const data = doc.data();
                    // const pgmUserId = data.pgmUserId;
                    if (!(data && data.pgmUserId && data.pgmUserNumber)){
                        console.log('updating pgmUserId...', pgmUserId);
                        return admin.firestore().collection('users').doc(doc.id).update({pgmUserId, homeClubId, pgmUserNumber});
                    }
                    else{
                        console.log('pgmUserId already existed...');
                        return res.status(200).send({success:true});
                    }
                });
            });
            // return res.status(200).send({success:true});
        }).catch(err=>{
            console.log('error adding to pgmUsers...', err);
            return res.status(500).send(err);
        })
    }
    else if (event && event === 'ContractCreated'){
        const contractData = theData.data;
        const createdAt = timeStamp;
        const contractId = contractData && contractData.contractId && contractData.contractId.toString();
        const pgmUserInfo = contractData && contractData.user;
        const pgmUserEmail = pgmUserInfo && pgmUserInfo.userEmail;
        return admin.firestore().collection('pgmContracts').doc(contractId).set({
            createdAt,
            ...contractData
        }).then(()=>{
            console.log('successfully added to pgmContracts collection');
            const usersQuery = admin.firestore().collection('users').where('email', '==', pgmUserEmail).limit(1).get();
            return Promise.all([usersQuery]).then(result=>{
                const userRes = result[0];
                userRes.forEach(doc=>{
                    const data = doc.data();
                    // const pgmUserId = data.pgmUserId;
                    return admin.firestore().collection('users').doc(doc.id).update({pgmCurrentContractId:contractId});
                });
            });
        }).catch(err=>{
            console.log('error adding at ContractCreated event', err);
            return res.status(500).send(err);
        });

    }
    else{
        return admin.firestore().collection(collectionName).add(theData).then((docRef)=>{
            console.log('successfully added');
            return res.status(200).send({success:true});
        }).catch((error)=>{
            console.log('error adding: ', error)
            return res.status(500).send(error);
        })
    }
});

// update all firebase users with pgm userId
exports.addPGMUserIdToUsers = functions.https.onRequest((req, res) => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const page = optionBody? optionBody.page? optionBody.page:1:1;
    const userQuery = admin.firestore().collection('users').get();
    const pgmUsers = getPGMUsersByPage(page);
    return Promise.all([userQuery, pgmUsers]).then(result=>{
        return null; //
    });
});
