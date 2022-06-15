const functions = require('firebase-functions');
var cors = require('cors');
const admin = require('firebase-admin');
const moment = require('moment');
const timestamp = admin.firestore.FieldValue.serverTimestamp();

function getTheDate(theDate){
    if (theDate === null){return}
    // for timestamp firebase
    if (typeof(theDate)==='object'){return theDate.toDate()}
    // for string date format
    else if (typeof(theDate)==='string'){return new Date(theDate)}
}

function get12StringAmount(amount){
    const startAmount = (parseFloat(amount)).toFixed(2).toString();
    const amountArray = startAmount.split('.');
    var combinedAmount = `${amountArray[0]}${amountArray[1]}`;
    var finalAmount;
    const concatLength = 12-combinedAmount.length; 
    for (var i = 0; i < concatLength; i++) {
        combinedAmount = '0'.concat(combinedAmount);
    }
    return combinedAmount;
}

// this hardcode is faster response time than doing the query
function isKLCCPackage(packageId){

  // var isKLCCPackage = false;
  // const packageQuery = admin.firestore().collection('packages').doc(packageId).get();
  // return Promise.all([packageQuery]).then((doc)=>{
  //   //if (doc.exists){
  //     const data = doc.data();
  //     const base = data.base;
  //     if(base && base === 'KLCC'){
  //       isKLCCPackage = true;
  //     }
  //   //}
  //   return isKLCCPackage;
  // });
  // return admin.firestore().collection('packages').doc(packageId).get().then((doc)=>{
  // // admin.firestore().collection('packages').doc(packageId).get().then((doc)=>{  
  //   if (doc.exists){
  //     const data = doc.data();
  //     const base = data.base;
  //     if(base && base === 'KLCC'){
  //       isKLCCPackage = true;
  //     }
  //   }
  //   return isKLCCPackage;
  // });

  // return Promise.all([packageQuery]).then(result=>{
  //   const pkgRes = result[0];
  //   pkgRes && pkgRes.forEach
  // });

  var isKLCCPackage = false;
  if ((packageId === '89THMCx0BybpSVJ1J8oz') // 6M term
  || (packageId === 'BKcaoWGrWKYihS40MpGd')
  || (packageId === 'LNGWNSdm6kf4rz1ihj0i')
  || (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q')
  || (packageId === 'aTHIgscCxbwjDD8flTi3')
  || (packageId === 'eRMTW6cQen6mcTJgKEvy') //310
  || (packageId === 'q7SXXNKv83MkkJs8Ql0n')
  || (packageId === 'AdXIzAK4qTgVNAK2t9be')
  || (packageId === 'YsOxVJGLRXrHDgNTBach')
  || (packageId === 'ciha9165NwgeF7wQz7GP') // flx290
  || (packageId === 'kh513XOaG7eLX4z9G0Ft')
  || (packageId === 'uQO2UsaRiqXtzPKjTSIS') // UNO
  || (packageId === '8yHoIQAkBd7NZ75y0OZe') // 12MPrepaidAll
  || (packageId === 'fh2P4R9YYtqDaU2yKRiX') // 12MContractAll
  || (packageId === 'hhForDFr6YIbSQNgkUcF') // angpauallaccess
  || (packageId === 'TlhkyieN2eB8Gc6f6rTX') // monthly due all access 2022
  )
  {
    isKLCCPackage = true;
  }
  return isKLCCPackage;
}

// this hardcode is faster response time than doing the query
function isTTDIPackage(packageId){
  var isTTDIPackage = false;
  if ((packageId === 'DjeVJskpeZDdEGlcUlB1')
  || (packageId === 'VWEHvdhNVW0zL8ZAeXJX')
  || (packageId === 'WmcQo1XVXehGaxhSNCKa')
  || (packageId === 'ZEDcEHZp3fKeQOkDxCH8')
  || (packageId === 'duz1AkLuin8nOUd7r66L')
  || (packageId === 'dz8SAwq99GWdEvHCKST2') // 210
  || (packageId === 'vf2jCUOEeDDiIQ0S42BJ')
  || (packageId === 'wpUO5vxWmme7KITqSITo')
  || (packageId === 'yQFACCzpS4DKcDyYftBx')
  || (packageId === 'w12J3n9Qs6LTViI6HaEY')
  || (packageId === 'k7As68CqGsFbKZh1Imo4')
  || (packageId === '2G3bVcJ3F8xXsMUhwOnJ')
  || (packageId === 'AHgEEavKwpJoGTMOzUdX') // 3M Aug2020
  || (packageId === 'AdXIzAK4qTgVNAK2t9be') // 12M term
  || (packageId === 'BKcaoWGrWKYihS40MpGd') // corp290
  || (packageId === 'D5WcUdxQNbUmltbE3fWk') // 210
  || (packageId === 'GjzBC8zwfUTDuefjMDQi') // angpausingle
  || (packageId === 'YeTJrScRWvVzC1gApYZc') // 12MContractSingle
  || (packageId === 'hUZjGJR77bP30I3fjvwD') // 3M Mid Sept2020
  || (packageId === 'WO1OJGAS3h0KpcNsHAmB') // monthly due single access 2022
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

// generate invoice ver 4 (with SST) monthly all package only
exports.invoicesMonthly = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'seanlim88@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;

  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users')
    // .where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q')
    .get();

  const packagesQuery = admin.firestore().collection('packages')
  // .where('renewalTerm', '==', 'month')
  .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    // .where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
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
      if (doc.id === 'vf2jCUOEeDDiIQ0S42BJ' || doc.id === 'TJ7Fiqgrt6EHUhR5Sb2q'
        || doc.id === 'YeTJrScRWvVzC1gApYZc' || doc.id === 'fh2P4R9YYtqDaU2yKRiX' // 12 month contract (started on dec 2021)
        || doc.id === 'WO1OJGAS3h0KpcNsHAmB' || doc.id === 'TlhkyieN2eB8Gc6f6rTX' // monthly due 2022
        ){
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
      const packageData = packageId && packageMap[packageId];

      if(userId && userId.length > 0 && packageData && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var newInvoiceCntAll = 0;
    var updatedInvoiceCntAll = 0;
    var deletedInvoiceCntAll = 0;

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
      // console.log('needsPayment: ', needsPayment);
    
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
      // console.log('monthlyFees: ', monthlyFees);
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
          deletedInvoiceCntAll+=1;
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
            deletedInvoiceCntAll+=1;
          }
          else{
            // console.log('no invoice, do nothing.');
          }
        }
      }

      // console.log('needsUpdate: ', needsUpdate);
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
            renewalTerm
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
          updatedInvoiceCntAll+=1;
        }
        // create a new invoice
        else if(!invoiceId){
        // if(!invoiceId){
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            paymentItems : paymentItems,
            renewalTerm
          }
          // console.log("Adding invoice", amount, invoiceId, invoiceData);
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
          newInvoiceCntAll += 1;
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
          newInvoiceCntAll,
          updatedInvoiceCntAll,
          deletedInvoiceCntAll,
          // existingInvoiceList,
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

// generate invoice for quarterly package
exports.invoicesQuarterly = functions.https.onRequest((req, res)=>{
  const itemData = req.body;
  const emailInput = itemData && itemData.email;
  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').where('renewalTerm', '==', 'quarterly').where('active', '==', true).get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .where('renewalTerm', '==', 'quarterly')
    .get();

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    const userRes = results[0];
    const pkgRes = results[1];
    const invoiceRes = results[2];
    
    var batch = admin.firestore().batch();

    var pkgMap = {};
    pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});
    
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoiceRes.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageData && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var userMap = {};
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];

    var amount;
    var invoiceData;

    userRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const membershipEnds = getMembershipEnd(data);
      const membershipStarts = getMembershipStart(data);
      const isExpired = membershipEnds && moment(getTheDate(membershipEnds)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const renewalTerm = packageData && packageData.renewalTerm;
      const packageBase = packageData && packageData.base;
     
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (cancellationDate){
        membershipCancelled = true;
      }

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId); 

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

      else if(packageData && needsUpdate && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        console.log('creating invoice for quarterly packages....')
        // default unitPrice
        const priceWithTax = packageData && packageData.priceWithTax;
        const priceWithoutTax = packageData && packageData.priceWithoutTax;

        const unitPrice = priceWithTax && parseFloat(priceWithTax).toFixed(2);
        const quantity = 1; // default.
        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
       
        // console.log('quantity: ', quantity);

        const totalPrice = priceWithTax;
        const totalTax = priceWithTax - priceWithoutTax;
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);
        // console.log('theamount: ', amount);

        // if the invoice is already created
        if(invoiceId){
          console.log('existing invoice id....');
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur').toDate();

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
            updatedAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            isAutoInvoice:true,
            renewalTerm:'quarterly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:1
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
          console.log('new invoice....');
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            renewalTerm:'quarterly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:1
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
      else{
        console.log('no invoice created...')
      }

    });

    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount > 0){
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

// generate invoice for biyearly package
exports.invoicesBiyearly = functions.https.onRequest((req, res)=>{
  const itemData = req.body;
  const emailInput = itemData && itemData.email;
  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').where('renewalTerm', '==', 'biyearly').where('active', '==', true).get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .where('renewalTerm', '==', 'biyearly')
    .get();

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    const userRes = results[0];
    const pkgRes = results[1];
    const invoiceRes = results[2];
    
    var batch = admin.firestore().batch();

    var pkgMap = {};
    pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});
    
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoiceRes.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageData && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var userMap = {};
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];

    var amount;
    var invoiceData;

    userRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const membershipEnds = getMembershipEnd(data);
      const membershipStarts = getMembershipStart(data);
      const isExpired = membershipEnds && moment(getTheDate(membershipEnds)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const renewalTerm = packageData && packageData.renewalTerm;
      const packageBase = packageData && packageData.base;
     
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (cancellationDate){
        membershipCancelled = true;
      }

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId); 

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

      else if(packageData && needsUpdate && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        console.log('creating invoice for quarterly packages....')
        // default unitPrice
        const priceWithTax = packageData && packageData.priceWithTax;
        const priceWithoutTax = packageData && packageData.priceWithoutTax;

        const unitPrice = priceWithTax && parseFloat(priceWithTax).toFixed(2);
        const quantity = 1; // default.
        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
       
        // console.log('quantity: ', quantity);

        const totalPrice = priceWithTax;
        const totalTax = priceWithTax - priceWithoutTax;
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);
        // console.log('theamount: ', amount);

        // if the invoice is already created
        if(invoiceId){
          console.log('existing invoice id....');
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur').toDate();

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
            updatedAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            isAutoInvoice:true,
            renewalTerm:'biyearly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:2
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
          console.log('new invoice....');
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            renewalTerm:'biyearly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:2
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
      else{
        console.log('no invoice created...')
      }

    });

    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount > 0){
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

// generate invoice for biyearly package
exports.invoicesYearly = functions.https.onRequest((req, res)=>{
  const itemData = req.body;
  const emailInput = itemData && itemData.email;
  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();
  const packagesQuery = admin.firestore().collection('packages').where('renewalTerm', '==', 'yearly').where('active', '==', true).get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .where('renewalTerm', '==', 'yearly')
    .get();

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    const userRes = results[0];
    const pkgRes = results[1];
    const invoiceRes = results[2];
    
    var batch = admin.firestore().batch();

    var pkgMap = {};
    pkgRes.forEach(doc=>{pkgMap[doc.id]=doc.data()});
    
    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoiceRes.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const paid = data && data.paid ? data.paid : false;
      if(userId && userId.length > 0 && packageData && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');

    var userMap = {};
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var invoiceList = [];
    var existingInvoiceList = [];
    var newInvoiceList = [];

    var amount;
    var invoiceData;

    userRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data.packageId;
      const packageData = packageId && pkgMap[packageId];
      const membershipEnds = getMembershipEnd(data);
      const membershipStarts = getMembershipStart(data);
      const isExpired = membershipEnds && moment(getTheDate(membershipEnds)).isSameOrBefore(startOfTodayMoment.clone().add(3, 'days'));

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const renewalTerm = packageData && packageData.renewalTerm;
      const packageBase = packageData && packageData.base;
     
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
    
      var membershipCancelled = false;
      if (cancellationDate){
        membershipCancelled = true;
      }

      var invoiceId = invoiceIdForUserIdMap[doc.id];
      const needsUpdate = (needsPayment === true || invoiceId); 

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

      else if(packageData && needsUpdate && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        console.log('creating invoice for quarterly packages....')
        // default unitPrice
        const priceWithTax = packageData && packageData.priceWithTax;
        const priceWithoutTax = packageData && packageData.priceWithoutTax;

        const unitPrice = priceWithTax && parseFloat(priceWithTax).toFixed(2);
        const quantity = 1; // default.
        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
       
        // console.log('quantity: ', quantity);

        const totalPrice = priceWithTax;
        const totalTax = priceWithTax - priceWithoutTax;
         
        // console.log('paymentItem: ', paymentItems);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        amount = totalPrice && get12StringAmount(totalPrice);
        // console.log('theamount: ', amount);

        // if the invoice is already created
        if(invoiceId){
          console.log('existing invoice id....');
          if (totalPrice<=0){
            batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          }
        
          const existingInvoiceData = invoiceMap[invoiceId];
          const existingCreatedAt = existingInvoiceData.createdAt || null;
          const existingAmount = existingInvoiceData.amount;
          const createdAt = existingAmount !== amount ? startOfTodayMoment.toDate() : existingCreatedAt;
          const updatedAt = moment().tz('Asia/Kuala_Lumpur').toDate();

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
            updatedAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            isAutoInvoice:true,
            renewalTerm:'yearly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:4
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
          console.log('new invoice....');
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            renewalTerm:'yearly',
            containFreeMonth:true,
            freeMonthPackageId: packageBase? (packageBase==='TTDI')? 'vf2jCUOEeDDiIQ0S42BJ':(packageBase==='KLCC')?'TJ7Fiqgrt6EHUhR5Sb2q':null:null,
            freeMonthQty:4
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
      else{
        console.log('no invoice created...')
      }

    });

    var theObject = {
      success:true,
      message: 'no invoice updated',
      createdAt: timestamp
    }

    if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount > 0){
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

// generate invoice for flx
exports.invoicesFLX = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'seanlim88@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;

  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();

  // const packagesQuery = admin.firestore().collection('packages').where('promoName', '==', 'flx').get();
  const packagesQuery = admin.firestore().collection('packages').where('active', '==', true).get();
  const invoicesQuery = admin.firestore().collection('invoices').where('paid', '==', false).where('type', '==', 'membership')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
  // const freezeQuery = admin.firestore().collection('payments').where('source', '==', 'freeze').get();

  const isJuly2020 = moment('20200701').tz('Asia/Kuala_Lumpur').startOf('day');

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packagesResults = results[1];
    const invoicesResults = results[2];
    // const freezeResults = results[3];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      const promoName = data.promoName;
      if (promoName && promoName.includes('flx')){
        packageMap[doc.id] = doc.data();
      }
    });

    // var specialFreezeForUserIdMap = {};
    // freezeResults.forEach(doc=>{
    //   const data = doc.data();
    //   const freezeType = data && data.freezeType;
    //   const userId = data && data.userId;
    //   if (userId && freezeType && freezeType.includes('specialFreezeQ')){
    //     specialFreezeForUserIdMap[userId]=data;
    //   }
    // });

    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      const packageData = packageId && packageMap[packageId];
      if(userId && userId.length > 0 && packageId && packageId.length > 0 && !paid && packageData){
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
      const packageData = packageId && packageMap[packageId];
      const renewalTerm = packageData && packageData.renewalTerm;
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
      //const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
      const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
      var paymentItems = [];
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
      console.log('needsPayment: ', needsPayment);
    
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

      // console.log('needsUpdate: ', needsUpdate);
      // generate new invoice for monthly package if it is on 1/7/2020;
      if(packageData && needsUpdate
        // && membershipEndsMoment.isSameOrAfter(moment('isJuly2020') && monthlyFees)
        // test for single monthly package only
        && monthlyFees && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        console.log('create invoice')
        // price after july 2020
        const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        const unitTaxAfterJuly2020 = (unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020).toFixed(2);

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
            promoType:'flx',
            isAutoInvoice:true
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
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
            paymentItems : paymentItems,
            promoType:'flx',
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
      else{
        console.log('no invoice created...')
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
exports.invoicesCorps = functions.https.onRequest((req, res) => {

  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;

  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();

  const packagesQuery = admin.firestore().collection('packages')
  .where('renewalTerm', '==', 'month')
  .where('type', '==', 'corp')
  .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    // .where('createdAt', '>=', moment('20200626').startOf('day').toDate())
    .get();
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
        && (data && data.type === 'corp')
        // && (doc.id === 'BKcaoWGrWKYihS40MpGd' 
        // || doc.id === 'ZEDcEHZp3fKeQOkDxCH8' 
        // || doc.id === 'dz8SAwq99GWdEvHCKST2'
        // || doc.id === 'eRMTW6cQen6mcTJgKEvy'
        // || doc.id === 'wpUO5vxWmme7KITqSITo'
        // )
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
      // const isKLCCPkg = packageId && isKLCCPackage(packageId); // full access
      const packageData = packageId && packageMap[packageId];
      const isKLCCPkg = (packageData && packageData.base && packageData.base === 'KLCC');
      const renewalTerm = packageData && packageData.renewalTerm ? packageData.renewalTerm : 'month';
      const membershipStarts = data && data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data && data.autoMembershipEnds? data.autoMembershipEnds: data.membershipEnds? data.membershipEnds:null;
      const promoJan2020 = data && data.promoJan2020;
      const cancellationDate = data && data.cancellationDate;
      const monthlyFees = packageData && packageData.monthlyFees? packageData.monthlyFees:null;
      var paymentItems = [];
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(6, 'days')) && !cancellationDate;
    
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
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
        // admin.firestore().collection('chargeInvoiceLogs').add(theObject);
        // var request = require("request");
        // return request.get(unpaidInvoiceSheetURL)
        
        return res.status(200).send(theObject);
      }).catch((error)=>{
        console.log('error batch: ', error);
      });
      // return res.status(200).send(theObject);
    }else{
      // admin.firestore().collection('chargeInvoiceLogs').add(theObject);
      return res.status(200).send(theObject);
    }
  });
});

// generate invoice for aug2020 promo
exports.generateInvoice3StepPromoAug2020 = functions.https.onRequest((req,res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'rachel.eaton@mail.mcgill.ca').get();
  const usersQuery = admin.firestore().collection('users')
    .where('createdFrom', '==', 'aug2020')
    .get();
  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false).where('type', '==', 'membership')
    // .where('promoType', '==', 'aug2020')
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

      // temporary for abwan8@gmail.com, do nothing
      if (data.email && data.email === 'abwan8@gmail.com'){
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
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'faizultestmidsep2020@gmail.com').get();
  const usersQuery = admin.firestore().collection('users').where('createdFrom', '==', 'midSep2020').get();
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
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
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

// generate invoice for promoJan
exports.generateInvoice3StepPromo = functions.https.onRequest((req,res) => {
  // const MonthlyPkgAllClub = 'TJ7Fiqgrt6EHUhR5Sb2q';
  // const MonthlyPkgSingle = 'vf2jCUOEeDDiIQ0S42BJ';

  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;

  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users').get();
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
      else if (promoJan2020 >= 4){
       
        if (!needsUpdate && invoiceId){
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
          if(needsUpdatedInvoiceCount + newInvoiceCount + needsDeleteCount >= 499){
            batch.commit();
            needsUpdatedInvoiceCount = 0;
            newInvoiceCount = 0;
            needsDeleteCount = 0;
            batch = admin.firestore().batch();
          }
          console.log("Deleting unpaid invoice", invoiceId);
          needsDeleteCount += 1;
        }
        // else{
        //   console.log('switching package');
        //   // convert to ttdi package
        //   // batch.update(admin.firestore().collection('users').doc(memberId), {packageId:'vf2jCUOEeDDiIQ0S42BJ'});
        //   //batch.commit();
        //   if (isTTDIPkg){
        //     admin.firestore().collection('users').doc(memberId).update({packageId: 'vf2jCUOEeDDiIQ0S42BJ'});
        //   }
        //   else if (isKLCCPkg){
        //     admin.firestore().collection('users').doc(memberId).update({packageId: 'TJ7Fiqgrt6EHUhR5Sb2q'});
        //   }
        // }
      }
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

function convertAngpauPkgIdToMonthly (packageId){
  if (packageId === 'GjzBC8zwfUTDuefjMDQi'){ // angpau single
    return 'WO1OJGAS3h0KpcNsHAmB' // monthly due single access
  }
  else if (packageId === 'hhForDFr6YIbSQNgkUcF'){ // angpau all access
    return 'TlhkyieN2eB8Gc6f6rTX' // monthly due all access
  }
  else return null;
}

function isAngpau2022Pkg (packageId){
  if (packageId && (packageId === 'GjzBC8zwfUTDuefjMDQi' || packageId === 'hhForDFr6YIbSQNgkUcF')){ 
    return true
  }
  else return false;
}

function getMembershipEnd (userData){
  if (userData){
      return (userData.autoMembershipEnds? userData.autoMembershipEnds:userData.membershipEnds?userData.membershipEnds:null);
  }
  else {return null}
}

function getMembershipStart (userData){
  if (userData){
      return (userData.autoMembershipStarts? userData.autoMembershipStarts:userData.membershipStarts?userData.membershipStarts:null);
  }
  else {return null}
}

// to create this invoice, run a cron job to convert the member to the respective monthly due package
exports.convertAngpauToMonthlyDuePackage = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;
  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
  admin.firestore().collection('users')
  // .where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q')
  .get();

  return Promise.all([usersQuery]).then(results=>{
    const userRes = results[0];
    var batch = admin.firestore().batch();
    var angpauMemberCnt = 0;
    userRes.forEach(doc=>{
      const data = doc.data();
      const packageId = data.packageId;
      const isAngpauPkg = packageId && isAngpau2022Pkg(packageId);
      const membershipEnd = getMembershipEnd(data);
      // console.log('isAngpauPkg: ', isAngpauPkg);
      // console.log('membershipEnds: ', membershipEnd && moment(getTheDate(membershipEnd)).format('DD-MM-YYYY'));
      // console.log('isExpired: ', membershipEnd && moment(getTheDate(membershipEnd)).isSameOrBefore(moment().add(3, 'days')));
      const cancellationDate = data.cancellationDate;
      
      if (!cancellationDate && isAngpauPkg && membershipEnd && moment(getTheDate(membershipEnd)).isSameOrBefore(moment().add(3, 'days'))){
        angpauMemberCnt += 1;
        // converting member to its respective packageId
        const convertedPkgId = convertAngpauPkgIdToMonthly(packageId);
        console.log('convertedPkgId: ', convertedPkgId);
        // updating...
        batch.update(admin.firestore().collection('users').doc(doc.id), {packageId:convertedPkgId, prevPackageId:packageId});
        if(angpauMemberCnt >= 499){
          batch.commit();
          angpauMemberCnt = 0;
          batch = admin.firestore().batch();
        }
      }
    });
    if (angpauMemberCnt > 0){
      return batch.commit().then(()=>{
        const theObject = {
          success:true,
          angpauMemberCnt
        }
        return res.status(200).send(theObject);
      });
    }
    else{
      return res.status(200).send({success:false, message:'no package switched'})
    }

  });

});

// generate invoice for angpau
exports.invoicesAngpau2022 = functions.https.onRequest((req, res) => {
  // const usersQuery = admin.firestore().collection('users').where('email', '==', 'seanlim88@gmail.com').get();
  // const usersQuery = admin.firestore().collection('users').get();
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const emailInput = itemData && itemData.email;

  const usersQuery = emailInput? admin.firestore().collection('users').where('email', '==', emailInput).get():
    admin.firestore().collection('users')
    // .where('packageId', '==', 'TJ7Fiqgrt6EHUhR5Sb2q')
    .get();

  const packagesQuery = admin.firestore().collection('packages')
    // .where('promoType', '==', 'angpau2022')
    .get();

  const invoicesQuery = admin.firestore().collection('invoices')
    .where('paid', '==', false)
    .where('type', '==', 'membership')
    .get();

  return Promise.all([usersQuery, packagesQuery, invoicesQuery]).then(results=>{
    // Get a new write batch
    var batch = admin.firestore().batch();

    const usersResults = results[0];
    const packagesResults = results[1];
    const invoicesResults = results[2];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      if (doc.id === 'WO1OJGAS3h0KpcNsHAmB' || doc.id === 'TlhkyieN2eB8Gc6f6rTX'){
        packageMap[doc.id]=doc.data();
      }
    });

    var invoiceMap = {};
    var invoiceIdForUserIdMap = {};
    invoicesResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const packageId = data && data.packageId;
      const paid = data && data.paid ? data.paid : false;
      const packageData = packageId && packageMap[packageId];

      if(userId && userId.length > 0 && packageData && !paid){
        invoiceIdForUserIdMap[userId] = doc.id;
        invoiceMap[doc.id] = data;
      }
    });

    const startOfTodayMoment = moment().tz('Asia/Kuala_Lumpur').startOf('day');
    // console.log('startOfTodayMoment: ', startOfTodayMoment);
    var needsUpdatedInvoiceCount = 0;
    var newInvoiceCount = 0;
    var needsDeleteCount = 0;
    var newInvoiceCntAll = 0;
    var updatedInvoiceCntAll = 0;
    var deletedInvoiceCntAll = 0;

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
    
      const membershipEndsMoment = membershipEnds && moment(getTheDate(membershipEnds)).clone();
      
      const needsPayment = membershipEndsMoment && membershipEndsMoment.isSameOrBefore(startOfTodayMoment.clone().add(3, 'days')) && !cancellationDate;
      // console.log('needsPayment: ', needsPayment);
    
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
      // console.log('monthlyFees: ', monthlyFees);
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
          deletedInvoiceCntAll+=1;
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
            deletedInvoiceCntAll+=1;
          }
          else{
            // console.log('no invoice, do nothing.');
          }
        }
      }

      // console.log('needsUpdate: ', needsUpdate);
      // generate new invoice for monthly package if it is on 1/7/2020;
      if(packageData && needsUpdate
        // && membershipEndsMoment.isSameOrAfter(moment('isJuly2020') && monthlyFees)
        // test for single monthly package only
        && monthlyFees && membershipEndsMoment && membershipEndsMoment.isValid()
      ){
        
        // console.log('create invoice')
        // price after july 2020
        // const unitPriceAfterJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        // const unitPriceWithTaxAfterJuly2020 = parseFloat(packageData.monthlyFees[1]).toFixed(2);
        // const unitTaxAfterJuly2020 = unitPriceWithTaxAfterJuly2020 - unitPriceAfterJuly2020;

        // const unitPriceBeforeJuly2020 = parseFloat(parseFloat(packageData.monthlyFees[0])/1.06).toFixed(2);
        // const unitPriceWithTaxBeforeJuly2020 = parseFloat(packageData.monthlyFees[0]).toFixed(2);
        // const unitTaxBeforeJuly2020 = (unitPriceWithTaxBeforeJuly2020 - unitPriceBeforeJuly2020).toFixed(2);

        // console.log('unitPriceWithTaxBeforeJuly2020: ', unitPriceWithTaxBeforeJuly2020);
        // default unitPrice
        const unitPrice = parseFloat(monthlyFees[0]).toFixed(2);
        const unitPriceWithTax = parseFloat(monthlyFees[1]).toFixed(2);
        const unitTax = parseFloat(monthlyFees[1]-monthlyFees[0]).toFixed(2);

        // const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1 - applicableFreezeMonths;
        const quantity = startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1;
        const totalPrice = unitPriceWithTax*quantity;
        const totalTax = unitTax*quantity;

        // const quantityBeforeJuly2020 = membershipEndsMoment.add(1, 'days').isBefore(isJuly2020)? ((isJuly2020.diff(membershipEndsMoment, 'months') + 1)): 0;
        // // const quantityAfterJuly2020 = membershipEndsMoment.isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;
       
        // // const quantityBeforeJuly2020 = membershipEndsMoment.isBefore(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) - (startOfTodayMoment.diff(isJuly2020, 'months') + 1):0;
        // const quantityAfterJuly2020 = membershipEndsMoment.add(1, 'days').isSameOrAfter(isJuly2020)? (startOfTodayMoment.diff(membershipEndsMoment, 'months') + 1) : quantity - quantityBeforeJuly2020;

        // console.log('membershipEndsMoment.isSameOrAfter(isJuly2020): ', membershipEndsMoment.isSameOrAfter(isJuly2020));
        // console.log('quantityBeforeJuly: ', quantityBeforeJuly2020);
        // console.log('quantityAfterJuly: ', quantityAfterJuly2020);

        // to avoid creating the 0 or negative invoices
        // 0 is occured when the user is currently freezing
        
        const amount = get12StringAmount(totalPrice);

        if (quantity <= 0){
          console.log('qty is equal to 0');
          batch.delete(admin.firestore().collection('invoices').doc(invoiceId));
        }
        // console.log('quantity: ', quantity);
        // console.log('totalPrice: ', totalPrice);
        // console.log('totalTax: ', totalTax);
        // amount = totalPrice && get12StringAmount(totalPrice);
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
            packageId,
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
            promoType:'angpau2022',
            isAutoInvoice:true
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
          updatedInvoiceCntAll+=1;
        }
        // create a new invoice
        else if(!invoiceId){
          //TODO add invoice id
          invoiceId = admin.firestore().collection('invoices').doc().id;

          invoiceData = {
            createdAt : moment().tz('Asia/Kuala_Lumpur').toDate(),
            packageId,
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
            promoType:'angpau2022',
            isAutoInvoice:true
          }

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
          newInvoiceCntAll+=1;
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
          newInvoiceCntAll,
          updatedInvoiceCntAll,
          deletedInvoiceCntAll,
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

