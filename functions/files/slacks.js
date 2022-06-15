const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors');
const moment = require('moment-timezone');
var request = require("request");
const { result } = require('lodash');

function getTheDate(theDate){
    if (theDate === null){return}
    // for timestamp firebase
    if (typeof(theDate)==='object'){return theDate.toDate()}
    // for string date format
    else if (typeof(theDate)==='string'){return new Date(theDate)}
}

function toRM(theString){
    if (theString === null){return 'RM0.00'}
    else{
      return `RM${parseFloat(theString).toFixed(2)}`;
    }
}

exports.addMTDnDTDToSlack = functions.https.onRequest((req, res) => {
  const usersQuery = admin.firestore().collection('users').get();
  const paymentQuery = admin.firestore().collection('payments')
  .where('type', '==', 'membership')
  // .where('createdAt', '>=', moment().startOf('month').toDate())
  .get();
  // where('email', '==', 'tehowny@gmail.com').get();
  const packagesQuery = admin.firestore().collection('packages').get();
  const logsQuery = admin.firestore().collection('logs').get();
  const gantnerLogsQuery = admin.firestore().collection('gantnerLogs')
    .where('createdAt', '>=', moment().startOf('day').toDate())
    .get();
  
  // const vendSaleQuery = admin.firestore().coll

  return Promise.all([paymentQuery, packagesQuery, usersQuery, logsQuery, gantnerLogsQuery]).then(result=>{
    var batch = admin.firestore().batch();
    const paymentResults = result[0];
    const packagesResults = result[1];
    const userResults = result[2];
    const logResults = result[3];
    const gantnerLogResults = result[4];

    var packageMap = {};
    packagesResults.forEach(doc=>{
      const data = doc.data();
      data.countDaily = 0;
      packageMap[doc.id] = data;
    });

    var gantnerLogsMapTTDIToday = {};
    var gantnerLogsMapKLCCToday = {};
    gantnerLogResults && gantnerLogResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const deviceId = data && data.deviceId;
      const isKLCCCheckIn = deviceId && deviceId.includes("KLCC");
      if (isKLCCCheckIn && userId){gantnerLogsMapKLCCToday[userId] = data}
      else if (userId){
        // for TTDI
        gantnerLogsMapTTDIToday[userId] = data;
      }
    });

    var logsByUserIdMap = {};
    // var freezeAddCountDaily = 0;
    var freezeRemovedCountDaily = 0;
    // var freezeAddLogsByUserIdMap = {};
    // to get the freeze and freezeRemove action
    logResults && logResults.forEach(doc=>{
      const data = doc.data();
      const userId = data && data.userId;
      const source = data && data.source;
      const action = data && data.action;
      const time = data && data.time;
      const freezeQuantity = data && data.freezeQuantity;

      const isTodayTime = moment(getTheDate(time)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'));
      if ((action && action === "freezeRemoved") && isTodayTime){
        logsByUserIdMap[userId] = data;
        freezeRemovedCountDaily+=1;
      }
      // if (source === "freeze" && isTodayTime){
      //   freezeAddCountDaily = freezeAddCountDaily + freezeQuantity;
      // }
      // if (action && action === "freezeRemoved" && isTodayTime){
      //   freezeRemovedCountDaily+=1;
      // }
    });

    var payments = [];
    var freezeMap = {};
    var freezeCreatedTodayMap = {};
    var freezeCreatedThisMonthMap = {};

    var vendCountDaily = 0;
    var vendCountDailyClosed = 0;
    var vendCountDailyVoided = 0;
    var vendCountDailyLaybyClosed = 0;
    
    var adyenCountDaily = 0;
    var adyenCountDailyClosed = 0;
    var adyenCountDailyRefunded = 0;

    var vendCountMonthly = 0;
    var vendCountMonthlyClosed = 0;
    var vendCountMonthlyVoided = 0;
    var vendCountMonthlyLaybyClosed = 0;

    var adyenCountMonthly = 0;
    var adyenCountMonthlyClosed = 0;
    var adyenCountMonthlyRefunded = 0;

    var adyenAutoChargeCountMonthly = 0;
    

    var vendTotalCollection = 0;

    var vendTotalCollectionDaily = 0;
    var adyenTotalCollectionDaily = 0;
    var vendTotalCollectionMonthly = 0;
    var adyenTotalCollectionMonthly = 0;

    var freezeMap = {};

    var vendCountDaily = 0;
    var vendCountDailyClosed = 0;
    var vendCountDailyVoided = 0;
    var vendCountDailyLaybyClosed = 0;
    
    var adyenCountDaily = 0;
    var adyenCountDailyClosed = 0;
    var adyenCountDailyRefunded = 0;

    var vendCountMonthly = 0;
    var vendCountMonthlyClosed = 0;
    var vendCountMonthlyVoided = 0;
    var vendCountMonthlyLaybyClosed = 0;

    // for package membership total Price daily TTDI Vend
    var monthlyPkgTTDITotalPriceDaily = 0;
    var augustPromo3MPkgTTDITotalPriceDaily = 0;
    var midSepPromo3MPkgTTDITotalPriceDaily = 0;
    var renewal6MTTDITotalPriceDaily = 0;
    var renewal12MTTDITotalPriceDaily = 0;
    var term3MTTDITotalPriceDaily = 0;
    var term6MTTDITotalPriceDaily = 0;
    var term12MTTDITotalPriceDaily = 0;
    var CP180PkgTTDITotalPriceDaily = 0; 
    var CP210PkgTTDITotalPriceDaily = 0; 
    var CP230PkgTTDITotalPriceDaily = 0; 
    // for package membership total Price daily KLCC vend
    var CP290PkgKLCCTotalPriceDaily = 0;
    var CP310PkgKLCCTotalPriceDaily = 0; 
    var monthlyPkgKLCCTotalPriceDaily = 0;
    var augustPromo3MPkgKLCCTotalPriceDaily = 0;
    var midSepPromo3MPkgKLCCTotalPriceDaily = 0;
    var unoPromo4MPkgKLCCTotalPriceDaily = 0;
    var term3MKLCCTotalPriceDaily = 0;
    var term6MKLCCTotalPriceDaily = 0;
    var term12MKLCCTotalPriceDaily = 0;

    // for package membership total Price monthly TTDI Vend
    var monthlyPkgTTDITotalPriceMonthly = 0;
    var augustPromo3MPkgTTDITotalPriceMonthly = 0;
    var midSepPromo3MPkgTTDITotalPriceMonthly = 0;
    var renewal6MTTDITotalPriceMonthly = 0;
    var renewal12MTTDITotalPriceMonthly = 0;
    var term3MTTDITotalPriceMonthly = 0;
    var term6MTTDITotalPriceMonthly = 0;
    var term12MTTDITotalPriceMonthly = 0;
    var CP180PkgTTDITotalPriceMonthly = 0; 
    var CP210PkgTTDITotalPriceMonthly = 0; 
    var CP230PkgTTDITotalPriceMonthly = 0; 
    // for package membership total Price Monthly KLCC vend
    var CP290PkgKLCCTotalPriceMonthly = 0;
    var CP310PkgKLCCTotalPriceMonthly = 0; 
    var monthlyPkgKLCCTotalPriceMonthly = 0;
    var augustPromo3MPkgKLCCTotalPriceMonthly = 0;
    var midSepPromo3MPkgKLCCTotalPriceMonthly = 0;
    var unoPromo4MPkgKLCCTotalPriceMonthly = 0;
    var term3MKLCCTotalPriceMonthly = 0;
    var term6MKLCCTotalPriceMonthly = 0;
    var term12MKLCCTotalPriceMonthly = 0;

    // for new membership transaction
    var adyenFirstTimeCountDaily = 0;
    var adyenAutoChargeCountDaily = 0;
    var adyenFirstTimeTotalPriceDaily = 0;
    var adyenAutoChargeTotalPriceDaily = 0;
    var adyenAutoChargeTotalPriceMonthly = 0;
    var adyenCountManualChargeTTDIMonthly = 0;
    var adyenTotalCollectionManualKLCCMonthly = 0;
    var adyenMaxPriceDaily = 0;

    // for package membership total Price daily TTDI adyen
    var adyenmonthlyPkgTTDITotalPriceDaily = 0;
    var adyenaugustPromo3MPkgTTDITotalPriceDaily = 0;
    var adyenmidSepPromo3MPkgTTDITotalPriceDaily = 0;
    var adyenrenewal6MTTDITotalPriceDaily = 0;
    var adyenrenewal12MTTDITotalPriceDaily = 0;
    var adyenterm3MTTDITotalPriceDaily = 0;
    var adyenterm6MTTDITotalPriceDaily = 0;
    var adyenterm12MTTDITotalPriceDaily = 0;
    var adyenCP180PkgTTDITotalPriceDaily = 0; 
    var adyenCP210PkgTTDITotalPriceDaily = 0; 
    var adyenCP230PkgTTDITotalPriceDaily = 0; 
    // for package membership total Price daily KLCC adyen
    var adyenCP290PkgKLCCTotalPriceDaily = 0;
    var adyenCP310PkgKLCCTotalPriceDaily = 0; 
    var adyenmonthlyPkgKLCCTotalPriceDaily = 0;
    var adyenaugustPromo3MPkgKLCCTotalPriceDaily = 0;
    var adyenmidSepPromo3MPkgKLCCTotalPriceDaily = 0;
    var adyenunoPromo4MPkgKLCCTotalPriceDaily = 0;
    var adyenterm3MKLCCTotalPriceDaily = 0;
    var adyenterm6MKLCCTotalPriceDaily = 0;
    var adyenterm12MKLCCTotalPriceDaily = 0;

    var adyenCountMonthly = 0;
    var adyenCountMonthlyClosed = 0;
    var adyenCountMonthlyRefunded = 0;

    var vendTotalCollectionDaily = 0;
    var adyenTotalCollectionDaily = 0;
    var vendTotalCollectionMonthly = 0;
    var adyenTotalCollectionMonthly = 0;

    var adyenCountManualChargeTTDIDaily = 0;
    var adyenCountManualChargeKLCCDaily = 0;
    var adyenTotalCollectionManualTTDIDaily = 0;
    var adyenTotalCollectionManualKLCCDaily = 0;

    // adyen daily
    var adyenCountAutoChargeTTDIDaily = 0;
    var adyenCountAutoChargeKLCCDaily = 0;
    var adyenTotalCollectionAutoTTDIDaily = 0;
    var adyenTotalCollectionAutoKLCCDaily = 0;
    // adyen monthly
    var adyenCountAutoChargeTTDIMonthly = 0;
    var adyenCountAutoChargeKLCCMonthly = 0;
    var adyenCountManualChargeTTDIMonthly = 0;
    var adyenTotalCollectionAutoTTDIMonthly = 0;
    var adyenTotalCollectionAutoKLCCMonthly = 0;
    var adyenTotalCollectionManualTTDIMonthly = 0
    var adyenTotalCollectionManualKLCCMonthly = 0;
  
    var adyenMaxPriceTTDIDaily = 0;
    var adyenMaxPriceKLCCDaily = 0;
  
    var packageSaleMapVendDaily = {};
    var packageWithPaymentArray = [];
    var packageSaleMapVend = {};
    var packageSaleMapAdyen = {};
    
    var activeTTDICorpPkgMap = {};
    var activeKLCCCorpPkgMap = {};

    var vendTextTTDI = '';
    var vendTextKLCC = '';

    var adyenTextTTDI = '';
    var adyenTextKLCC = '';

    var corpActiveTextTTDI = '';
    var corpActiveTextKLCC = '';

    var corpCancelTextTTDI = '';
    var corpCancelTextKLCC = '';

    var corpExpiredTextTTDI = '';
    var corpExpiredTextKLCC = '';
    
    paymentResults.forEach(payment=>{
      if (payment && payment.data()){
        const data = payment.data();
        const createdAt = data.createdAt? data.createdAt:null;
        const userId = data.userId? data.userId:null;
       
        const invoiceId = data.invoiceId? data.invoiceId:" ";
        const packageId = data.packageId? data.packageId:null;
        const packageData = packageId? packageMap[packageId]:null;
        const packageName = (packageData && packageData.shortName)? (packageData && packageData.shortName):(packageData && packageData.name);
        const packageBase = packageData && packageData.base;
        const quantity = data.quantity? data.quantity:" ";
        const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
        const source = data.source;
        const status = data.status? data.status:" ";
        const totalPrice = data.totalPrice? data.totalPrice:0;
        const type = data.type? data.type:" ";
        const manualAdd = data.manualAdd? data.manualAdd:"false";
        const transactionId = data.transactionId;
        const vendProductId = data.vendProductId? data.vendProductId:" ";
        const vendProductName = data.vendProductName || null;
        const vendSaleId = data.vendSaleId;
        const freezeFor = data && data.freezeFor;
        const isAutoCharge = (data && data.isAutoCharge)? true:false;
        const slackReportIndex = packageData && packageData.slackReportIndex;
        const outlet = data.outlet? data.outlet:packageBase;
    
        // const shortName = packageData && packageData.shortName;

        if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
          freezeCreatedTodayMap[userId] = data;
        }
        if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
          freezeCreatedThisMonthMap[userId] = data;
        }
        // freezeFor that valid up till today
        if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(freezeFor)).tz('Asia/Kuala_Lumpur').add(1, 'month').isAfter(moment().tz('Asia/Kuala_Lumpur'))){
        // if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(freezeFor)).isSameOrAfter(moment().startOf('day').subtract(1, 'months'))){  
          freezeMap[userId] = data;
        }
        // for daily
        if (source === 'vend' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
          vendCountDaily+=1;
          if (status && status === 'CLOSED'){
            vendCountDailyClosed+=1;
            vendTotalCollectionDaily = vendTotalCollectionDaily + parseFloat(totalPrice);
            var countDaily = 0;
          
            // packageData.map(item=>{
              // let obj = {};
              // obj["name"]=packageName;
              // obj["countDaily"] = obj.countDaily? obj.countDaily+1:1;
              // packageWithPaymentArray.push({obj});
              // packageWithPaymentArray.push({
              //   [item.name]:
              // })
            // });
            // packageSaleMapVendDaily[packageId]= {

            // };
            // packageWithPaymentArray.push({
              
            // });
            // packageSaleMapVendDaily[]
            // if(!packageSaleMapVend[packageId]){
            //   packageSaleMapVend[packageId]= {
            //     packageName,
            //     packageBase,
            //     totalPriceDaily:0,
            //     totalPriceMonthly:0,
            //     packageCountDaily:0,
            //     packageCountMonthly:0,
            //     outlet
            //   };  
            // }

            // packageSaleMapVend[packageId].packageCountDaily+=1;
            // packageSaleMapVend[packageId].totalPrice += parseFloat(totalPrice);
            // vendText = `${vendText} ${packageSaleMapVend[packageId].packageName} (${packageSaleMapVend[packageId].packageCountDaily})`

          
          }
          else if (status && status === 'VOIDED'){
            vendCountDailyVoided+=1;
          }
          else if (status && status === 'LAYBY_CLOSED'){
            vendCountDailyLaybyClosed+=1;
          }
        }

        else if (source ==='adyen' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
          adyenCountDaily+=1;
          if (status && status === 'CLOSED'){
            adyenCountDailyClosed+=1;
            adyenTotalCollectionDaily = adyenTotalCollectionDaily + parseFloat(totalPrice);
            if (isAutoCharge){
              adyenAutoChargeCountDaily+=1;
              adyenAutoChargeTotalPriceDaily = adyenAutoChargeTotalPriceDaily + parseFloat(totalPrice);
              adyenMaxPriceDaily = (parseFloat(totalPrice)>adyenMaxPriceDaily)? totalPrice:adyenMaxPriceDaily;
              if (packageBase && packageBase === "TTDI"){
                adyenCountAutoChargeTTDIDaily+=1;
                adyenTotalCollectionAutoTTDIDaily = adyenTotalCollectionAutoTTDIDaily+parseFloat(totalPrice);
                adyenMaxPriceTTDIDaily = (parseFloat(totalPrice)>adyenMaxPriceTTDIDaily)? totalPrice:adyenMaxPriceTTDIDaily;
              }
              else if (packageBase && packageBase === "KLCC"){
                adyenCountAutoChargeKLCCDaily+=1;
                adyenTotalCollectionAutoKLCCDaily = adyenTotalCollectionAutoKLCCDaily+parseFloat(totalPrice);
                adyenMaxPriceKLCCDaily = (parseFloat(totalPrice)>adyenMaxPriceKLCCDaily)? totalPrice:adyenMaxPriceKLCCDaily;
              }
            }
            // other than auto charge, assume as new card for now
            else if (!isAutoCharge){
              adyenFirstTimeCountDaily+=1;
              adyenFirstTimeTotalPriceDaily = adyenFirstTimeTotalPriceDaily + parseFloat(totalPrice);
              if (packageBase && packageBase === "TTDI"){
                adyenCountManualChargeTTDIDaily+=1;
                adyenTotalCollectionManualTTDIDaily = adyenTotalCollectionManualTTDIDaily+parseFloat(totalPrice);
              }
              else if (packageBase && packageBase === "KLCC"){
                adyenCountManualChargeKLCCDaily+=1;
                adyenTotalCollectionManualKLCCDaily = adyenTotalCollectionManualKLCCDaily+parseFloat(totalPrice);
              }
            }
          }
          else if (status && status === 'REFUNDED'){
            adyenCountDailyRefunded+=1;
          }
        }

        // for monthly
        if (source === 'vend' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
          vendCountMonthly+=1;
          if (status && status === 'CLOSED'){
            vendCountMonthlyClosed+=1;
            vendTotalCollectionMonthly = vendTotalCollectionMonthly + parseFloat(totalPrice);
            
            if(!packageSaleMapVend[packageId]){
              packageSaleMapVend[packageId]= {
                packageName,
                packageBase,
                totalPriceDaily:0,
                totalPriceMonthly:0,
                packageCountDaily:0,
                packageCountMonthly:0,
                source,
                outlet,
                vendSaleId: [],
                createdAt: []
              };  
            }
            packageSaleMapVend[packageId].packageCountMonthly+=1;
            packageSaleMapVend[packageId].totalPriceMonthly += parseFloat(totalPrice);
            packageSaleMapVend[packageId].vendSaleId.push(vendSaleId);
            packageSaleMapVend[packageId].createdAt.push(moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('day').format("YYYY-MM-DD"));
            
            // for daily
            if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
              packageSaleMapVend[packageId].packageCountDaily+=1;
              packageSaleMapVend[packageId].totalPriceDaily += parseFloat(totalPrice);
            }

          }
          else if (status && status === 'VOIDED'){
            vendCountMonthlyVoided+=1;
          }
          else if (status && status === 'LAYBY_CLOSED'){
            vendCountMonthlyLaybyClosed+=1;
          }
        }

        else if (source ==='adyen' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
          adyenCountMonthly+=1;
          if (status && status === 'CLOSED'){
            adyenCountMonthlyClosed+=1;
            adyenTotalCollectionMonthly = adyenTotalCollectionMonthly + parseFloat(totalPrice);

            if(!packageSaleMapAdyen[packageId]){
              packageSaleMapAdyen[packageId]= {
                packageName,
                packageBase,
                totalPriceDaily:0,
                totalPriceMonthly:0,
                packageCountDaily:0,
                packageCountMonthly:0,
                source,
                outlet, 
                transactionId:[],
                createdAt: []
              };  
              // just to view the details in postman
              packageSaleMapAdyen[packageId].createdAt.push(moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('day').format("YYYY-MM-DD"));
              packageSaleMapAdyen[packageId].transactionId.push(transactionId);
            }
            packageSaleMapAdyen[packageId].packageCountMonthly+=1;
            packageSaleMapAdyen[packageId].totalPriceMonthly+=parseFloat(totalPrice);
           
            // for daily
            if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
              // if(!packageSaleMapAdyen[packageId]){
              //   packageSaleMapAdyen[packageId]= {
              //     packageName,
              //     packageBase,
              //     totalPriceDaily:0,
              //     totalPriceMonthly:0,
              //     packageCountDaily:0,
              //     packageCountMonthly:0,
              //     source,
              //     outlet,
              //     createdAt: moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('days').format("YYYY-MM-DD")
              //   };  
              // }
              packageSaleMapAdyen[packageId].packageCountDaily+=1;
              packageSaleMapAdyen[packageId].totalPriceDaily += parseFloat(totalPrice);
            }

            if (isAutoCharge){
              adyenAutoChargeCountMonthly+=1;
              adyenAutoChargeTotalPriceMonthly = adyenAutoChargeTotalPriceMonthly + parseFloat(totalPrice);
              if (packageBase && packageBase === "TTDI"){
                adyenCountAutoChargeTTDIMonthly+=1;
                adyenTotalCollectionAutoTTDIMonthly = adyenTotalCollectionAutoTTDIMonthly+parseFloat(totalPrice);
              }
              else if (packageBase && packageBase === "KLCC"){
                adyenCountAutoChargeKLCCMonthly+=1;
                adyenTotalCollectionAutoKLCCMonthly = adyenTotalCollectionAutoKLCCMonthly+parseFloat(totalPrice);
              }
            }
            // other than auto charge, assume as new card for now
            else if (!isAutoCharge){
              if (packageBase && packageBase === "TTDI"){
                adyenCountManualChargeTTDIMonthly+=1;
                adyenTotalCollectionManualTTDIMonthly = adyenTotalCollectionManualTTDIMonthly+parseFloat(totalPrice);
              }
              else if (packageBase && packageBase === "KLCC"){
                adyenCountManualChargeKLCCDaily+=1;
                adyenTotalCollectionManualKLCCMonthly = adyenTotalCollectionManualKLCCMonthly+parseFloat(totalPrice);
              }
            }
          }
          else if (status && status === 'REFUNDED'){
            adyenCountMonthlyRefunded+=1;
          }
        }
      }
    });

    var activeMonthlyTTDIdaily = 0;
    var activeQuarterlyTTDIdaily = 0;
    var activeBiyearlyTTDIdaily = 0;
    var active4MonthlyTTDIdaily = 0;
    var activeYearlyTTDIdaily = 0;
    var activeMonthlyKLCCdaily = 0;
    var activeQuarterlyKLCCdaily = 0;
    var activeBiyearlyKLCCdaily = 0;
    var active4MonthlyKLCCdaily = 0;
    var activeYearlyKLCCdaily = 0;
    var activeCorpTTDIDaily = 0;
    var activeCorpKLCCDaily = 0;
    var allActivePackage = 0;
    var allActiveTTDIPackage = 0;
    var allActiveKLCCPackage = 0;
    var activeFreezeCount = 0;
    var activeFreezeTTDICount = 0;
    var activeFreezeKLCCCount = 0;

    var unpaidAll = 0;
    var unpaidTTDI = 0;
    var unpaidKLCC = 0;
    var unpaid1MonthTTDI = 0;
    var unpaid1to3MonthTTDI = 0;
    var unpaid3MonthTTDI = 0;
    var unpaid1MonthKLCC = 0;
    var unpaid1to3MonthKLCC = 0;
    var unpaid3MonthKLCC = 0;

    var allComplimentary = 0;
    var freezeCountChanges = 0;
    var freezeAddCountTTDIDaily = 0;
    var freezeAddCountKLCCDaily = 0;
    var freezeAddCountTTDIMonthly = 0;
    var freezeAddCountKLCCMonthly = 0;
    var freezeExecutedUniqueUserTTDICountDaily = 0;
    var freezeExecutedUniqueUserKLCCCountDaily = 0;
    var freezeExecutedUniqueUserTTDICountMonthly = 0;
    var freezeExecutedUniqueUserKLCCCountMonthly = 0;
    var freezeExecutedUniqueUserRemovedTTDICountDaily = 0;
    var freezeExecutedUniqueUserRemovedKLCCCountDaily = 0;
    var cancelExecutedTTDIToday = 0;
    var cancelExecutedKLCCToday = 0;
    var cancelExecutedTTDIThisMonth = 0;
    var cancelExecutedKLCCThisMonth = 0;
    var checkInVisitorCountTTDIToday = 0;
    var checkInVisitorCountKLCCToday = 0;

    // var userMap = {};
    userResults && userResults.forEach(doc=>{
      const data = doc.data();
      // userMap[doc.id] = data;
      const packageId = data && data.packageId;
      const packageData = packageId? packageMap[packageId]:null;
      const packageBase = packageData && packageData.base;
      const packageName = packageData && packageData.shortName;
      const isTTDICorpPackage = packageData && (packageBase && packageBase === "TTDI") && packageData.type === "corp";
      const isKLCCCorpPackage = packageData && (packageBase && packageBase === "KLCC") && packageData.type === "corp";
      const renewalTerm = packageData && packageData.renewalTerm;
      const userTerminated = data && data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(moment(), 'day');
      const membershipEnd = data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;
      const freezeData = freezeMap? freezeMap[doc.id]:null;
      const userFreezeFor = freezeData && freezeData.freezeFor;
      const membershipStarts = data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
      const membershipEnds = data.autoMembershipEnds ? data.autoMembershipEnds : data.membershipEnds;
      const isComplimentaryPkg = renewalTerm && renewalTerm === 'never';
      const isActiveMember = (!userFreezeFor && !isComplimentaryPkg && membershipStarts && !userTerminated && (moment(getTheDate(membershipStarts)) < moment()) && membershipEnds && moment(getTheDate(membershipEnds)) >= moment())
      const isExpiredMember = packageId && membershipStarts && (moment(getTheDate(membershipStarts)) < moment()) && membershipEnds && (moment(getTheDate(membershipEnds)) < moment()) && !userTerminated 
      const isStaff = data && data.isStaff;
      const freezeExecutedToday = freezeCreatedTodayMap? freezeCreatedTodayMap[doc.id]:null;
      const freezeExecutedThisMonth = freezeCreatedThisMonthMap? freezeCreatedThisMonthMap[doc.id]:null;
      
      freezeExecutedToday && Object.keys(freezeExecutedToday).forEach(key => {
        const quantity = freezeExecutedThisMonth[key].quantity? freezeExecutedToday[key].quantity:1;
        if (packageBase && packageBase === "TTDI"){
          freezeAddCountTTDIDaily += quantity;
        }
        else if (packageBase && packageBase === "KLCC"){
          freezeAddCountKLCCDaily += quantity;
        }
      });

      freezeExecutedThisMonth && Object.keys(freezeExecutedThisMonth).forEach(key => {
        const quantity = freezeExecutedThisMonth[key].quantity? freezeExecutedThisMonth[key].quantity:1;
        if (packageBase && packageBase === "TTDI"){
          freezeAddCountTTDIMonthly = freezeAddCountTTDIMonthly+ quantity;
        }
        else if (packageBase && packageBase === "KLCC"){
          freezeAddCountKLCCMonthly = freezeAddCountKLCCMonthly + quantity;
        }
      });
    
      const cancellationCreatedAt = data && data.cancellationCreatedAt;

      const logData = logsByUserIdMap && logsByUserIdMap[doc.id];
      // logData && logData.sort((a,b)=>{
      //   var dateA = new Date(a.time);
      //   var dateB = new Date(b.time);
      //   if (dateA < dateB) {return -1}
      //   if (dateA > dateB) {return 1}
      //   return 0;
      // });

      const isVisitorCheckInTTDIToday = gantnerLogsMapTTDIToday? gantnerLogsMapTTDIToday[doc.id]:null;
      const isVisitorCheckInKLCCToday = gantnerLogsMapKLCCToday? gantnerLogsMapKLCCToday[doc.id]:null;

      if (isVisitorCheckInTTDIToday && !membershipEnds){checkInVisitorCountTTDIToday+=1}
      else if (isVisitorCheckInKLCCToday && !membershipEnds){checkInVisitorCountKLCCToday+=1}

      if (logData){
        // freezeExecutedUniqueUserRemovedCountDaily+=1;
        if (packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserRemovedTTDICountDaily+=1}
        else if (packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserRemovedKLCCCountDaily+=1}
      }
      if (freezeExecutedToday && packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserTTDICountDaily+=1}
      if (freezeExecutedToday && packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserKLCCCountDaily+=1}
      if (freezeExecutedThisMonth && packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserTTDICountMonthly+=1}
      if (freezeExecutedThisMonth && packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserKLCCCountMonthly+=1}

      if (cancellationCreatedAt && packageBase && packageBase === "TTDI" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){cancelExecutedTTDIToday+=1}
      else if (cancellationCreatedAt && packageBase && packageBase === "KLCC" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){cancelExecutedKLCCToday+=1}

      if (cancellationCreatedAt && packageBase && packageBase === "TTDI" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('months'))){cancelExecutedTTDIThisMonth+=1}
      else if (cancellationCreatedAt && packageBase && packageBase === "KLCC" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('months'))){cancelExecutedKLCCThisMonth+=1}

      if (userFreezeFor && !userTerminated){activeFreezeCount+=1}
      if (userFreezeFor && packageBase && packageBase === 'TTDI'){activeFreezeTTDICount+=1}
      else if (userFreezeFor && packageBase && packageBase === 'KLCC'){activeFreezeKLCCCount+=1}
      
      if (isActiveMember && packageBase){allActivePackage+=1}
      // if (!userFreezeFor && packageBase && packageBase === 'TTDI' && !userTerminated && membershipEnd && moment(getTheDate(membershipEnd)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur'))){
      
      if (packageBase && packageBase === "TTDI" && isTTDICorpPackage){
        activeCorpTTDIDaily+=1;
        if(!activeTTDICorpPkgMap[packageId]){
          activeTTDICorpPkgMap[packageId]= {
            packageName,
            packageBase,
            activeCount:0,
            cancelCount:0,
            expiredCount:0
          };  
        }
        if (isActiveMember){activeTTDICorpPkgMap[packageId].activeCount+=1}
        else if (userTerminated){activeTTDICorpPkgMap[packageId].cancelCount+=1}
        else if (isExpiredMember){activeTTDICorpPkgMap[packageId].expiredCount+=1}
      }
      else if (packageBase && packageBase === "KLCC" && isKLCCCorpPackage){
        activeCorpKLCCDaily+=1
        if(!activeKLCCCorpPkgMap[packageId]){
          activeKLCCCorpPkgMap[packageId]= {
            packageName,
            packageBase,
            activeCount:0,
            cancelCount:0,
            expiredCount:0
          };  
        }
        if (isActiveMember){activeKLCCCorpPkgMap[packageId].activeCount+=1}
        else if (userTerminated){activeKLCCCorpPkgMap[packageId].cancelCount+=1}
        else if (isExpiredMember){activeKLCCCorpPkgMap[packageId].expiredCount+=1}
      }

      if (packageBase && packageBase === 'TTDI' && isActiveMember){allActiveTTDIPackage+=1}
      else if (packageBase && packageBase === 'KLCC' && isActiveMember){allActiveKLCCPackage+=1}
      
      // for ttdi daily
      if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && (renewalTerm === 'month'||renewalTerm === 'monthly'))
      {activeMonthlyTTDIdaily+=1}
      // quarterly
      else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === 'quarterly'){
        activeQuarterlyTTDIdaily+=1}
      // 4monthly
      else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === '4monthly'){
        active4MonthlyTTDIdaily+=1}
      // biyearly
      else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === 'biyearly'){
        activeBiyearlyTTDIdaily+=1}
      // yearly
      else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && (renewalTerm === 'year'||renewalTerm==='yearly')){
        activeYearlyTTDIdaily+=1}
      // complimentary && complimentary promo
      else if (renewalTerm && (renewalTerm === 'never') && !userTerminated)
      {allComplimentary+=1}

      // for klcc daily
      else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'monthly' || renewalTerm === 'month') ){
        activeMonthlyKLCCdaily+=1}
      // quarterly
      else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'quarterly')){
          activeQuarterlyKLCCdaily+=1}
      // 4monthly
      else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === '4monthly')){
        active4MonthlyKLCCdaily+=1}
      // biyearly
      else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'biyearly')){
        activeBiyearlyKLCCdaily+=1}
      //yearly
      else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'year'||renewalTerm === 'yearly')){
        activeYearlyKLCCdaily+=1}

      // for all expired
      if (isExpiredMember && packageBase){unpaidAll+=1}
      if (isExpiredMember && packageBase && packageBase === 'TTDI'){unpaidTTDI+=1}
      else if (isExpiredMember && packageBase && packageBase === 'KLCC'){unpaidKLCC+=1}

      // for 1 month expired member ttdi
      if (isExpiredMember && packageBase && packageBase === 'TTDI'
        && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(1, 'months').subtract(1,'days'), moment().add(1, 'days')))
      {unpaid1MonthTTDI+=1}
      else if (isExpiredMember && packageBase && packageBase === 'TTDI'
      && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(3, 'months').subtract(1,'days'), moment().add(1, 'months').add(1, 'days'))
      )
      {unpaid1to3MonthTTDI+=1}
      else if (isExpiredMember && packageBase && packageBase === 'TTDI'
      && moment(getTheDate(membershipEnd)).isBefore(moment().subtract(3, 'months')))
      {unpaid3MonthTTDI+=1}
      
      // for klcc
      if (isExpiredMember && packageBase && packageBase === 'KLCC'
      && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(1, 'months').subtract(1,'days'), moment().add(1, 'days'))
      )
      {unpaid1MonthKLCC+=1}
      else if (isExpiredMember && packageBase && packageBase === 'KLCC'
      && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(3, 'months').subtract(1,'days'), moment().add(1, 'months').add(1, 'days'))
      )
      {unpaid1to3MonthKLCC+=1}
      else if (isExpiredMember && packageBase && packageBase === 'KLCC'
      && moment(getTheDate(membershipEnd)).isBefore(moment().subtract(3, 'months'))
      )
      {unpaid3MonthKLCC+=1}
  });

  Object.keys(packageSaleMapVend).forEach(key=>{
    const packageDataVend = packageSaleMapVend[key];
    const outlet = packageDataVend.outlet;
    const source = packageDataVend.source;
    vendTextTTDI = ((outlet === "TTDI") && (source === 'vend'))? `${vendTextTTDI}${packageDataVend.packageName} (${packageDataVend.packageCountDaily}|${packageDataVend.packageCountMonthly}) : ${toRM(packageDataVend.totalPriceDaily)}|${parseFloat(packageDataVend.totalPriceMonthly).toFixed(2)}\n`:vendTextTTDI;
    vendTextKLCC = ((outlet === "KLCC") && (source==='vend'))? `${vendTextKLCC}${packageDataVend.packageName} (${packageDataVend.packageCountDaily}|${packageDataVend.packageCountMonthly}) : ${toRM(packageDataVend.totalPriceDaily)}|${parseFloat(packageDataVend.totalPriceMonthly).toFixed(2)}\n`:vendTextKLCC;
  });

  Object.keys(packageSaleMapAdyen).forEach(key=>{
    const packageDataAdyen = packageSaleMapAdyen[key];
    const outlet = packageDataAdyen.outlet;
    const source = packageDataAdyen.source;
    adyenTextTTDI = ((outlet === "TTDI") && (source === 'adyen'))? `${adyenTextTTDI}${packageDataAdyen.packageName} (${packageDataAdyen.packageCountDaily}|${packageDataAdyen.packageCountMonthly}) : ${toRM(packageDataAdyen.totalPriceDaily)}|${parseFloat(packageDataAdyen.totalPriceMonthly).toFixed(2)}\n`:adyenTextTTDI;
    adyenTextKLCC = ((outlet === "KLCC") && (source === 'adyen'))? `${adyenTextKLCC}${packageDataAdyen.packageName} (${packageDataAdyen.packageCountDaily}|${packageDataAdyen.packageCountMonthly}) : ${toRM(packageDataAdyen.totalPriceDaily)}|${parseFloat(packageDataAdyen.totalPriceMonthly).toFixed(2)}\n`:adyenTextKLCC;
  });

  Object.keys(activeTTDICorpPkgMap).forEach(key=>{
    const activeTTDICorpPkg = activeTTDICorpPkgMap[key];
    corpActiveTextTTDI = `${corpActiveTextTTDI}${activeTTDICorpPkg.packageName}:${activeTTDICorpPkg.activeCount}\n`;
    corpCancelTextTTDI = `${corpCancelTextTTDI}${activeTTDICorpPkg.packageName}:${activeTTDICorpPkg.cancelCount}\n`;
  });

  Object.keys(activeKLCCCorpPkgMap).forEach(key=>{
    const activeKLCCCorpPkg = activeKLCCCorpPkgMap[key];
    corpActiveTextKLCC = `${corpActiveTextKLCC}${activeKLCCCorpPkg.packageName}:${activeKLCCCorpPkg.activeCount}\n`;
    corpCancelTextKLCC = `${corpCancelTextKLCC}${activeKLCCCorpPkg.packageName}:${activeKLCCCorpPkg.cancelCount}\n`;
  });

    request.post(
      "https://hooks.slack.com/services/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",
         {json:{
          blocks:[
            {
              "type": "divider"
            },
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": `Babel Membership ${moment().format('DD-MM-YYYY')}`,
                "emoji": true
              }
            },
            {
              "type": "section",
              "fields": [
                {
                  "type": "mrkdwn",
                  "text": `*ACTIVE*\ncomplimentary: ${allComplimentary}\nAll Active Members:${allActivePackage}\nFreezes: ${activeFreezeCount}\n`,
                },
                {
                  "type": "mrkdwn",
                  "text": `MTD movement (as for today)\nvend sale count (monthly):${vendCountMonthly}\nmembership payment from vend (monthly):RM${parseFloat(vendTotalCollectionMonthly).toFixed(2)}\nmembership payment from vend (daily):${toRM(vendTotalCollectionDaily)}\nadyen sale count (monthly):${adyenCountMonthly}\nmembership payment from adyen (monthly):${toRM(adyenTotalCollectionMonthly)}\nmembership payment from adyen (daily):${toRM(adyenTotalCollectionDaily)}\n`,
                },
              ]
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "fields": [
                {
                  "type": "mrkdwn",
                  "text": `*TTDI Membership*\nActive:${allActiveTTDIPackage}\n-Complimentary:${allComplimentary}\n-Monthly:${activeMonthlyTTDIdaily}\n-3M package:${activeQuarterlyTTDIdaily}\n-4M package:${active4MonthlyTTDIdaily}\n-6M package:${activeBiyearlyTTDIdaily}\n-12M package:${activeYearlyTTDIdaily}\n*Corporate package*:${activeCorpTTDIDaily}\n${corpActiveTextTTDI}\nFrozen:${activeFreezeTTDICount}\nUnpaid (<1M):${unpaid1MonthTTDI}\nUnpaid (1 to 3M):${unpaid1to3MonthTTDI}\nUnpaid (3M+): ${unpaid3MonthTTDI}\n${corpCancelTextKLCC}`,
                },
                {
                  "type": "mrkdwn",
                  "text": `*KLCC Membership*\nActive:${allActiveKLCCPackage}\n-Complimentary:${allComplimentary}\n-Monthly:${activeMonthlyKLCCdaily}\n-3M package:${activeQuarterlyKLCCdaily}\n-4M package:${active4MonthlyKLCCdaily}\n-6M package:${activeBiyearlyKLCCdaily}\n-12M package:${activeYearlyKLCCdaily}\n*Corporate package*:${activeCorpKLCCDaily}\n${corpActiveTextKLCC}\nFrozen:${activeFreezeKLCCCount}\nUnpaid (<1M):${unpaid1MonthKLCC}\nUnpaid (1 to 3M):${unpaid1to3MonthKLCC}\nUnpaid (3M+): ${unpaid3MonthKLCC}\n${corpCancelTextTTDI}`,
                },
              ]
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "fields": [
                {
                  "type": "mrkdwn",
                  "text": `*TTDI Movement*:smile:\n*Vend*\n${vendTextTTDI}*Adyen*\n${adyenTextTTDI}ManualCharge(${adyenCountManualChargeTTDIDaily}):${toRM(adyenTotalCollectionManualTTDIDaily)}\nAutoCharge(${adyenCountAutoChargeTTDIDaily}):${toRM(adyenTotalCollectionAutoTTDIDaily)}|${toRM(adyenMaxPriceTTDIDaily)}\nFrozen(${freezeExecutedUniqueUserTTDICountDaily}):${freezeAddCountTTDIDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedTTDICountDaily}\nCancelled:${cancelExecutedTTDIToday}\nVisitors:${checkInVisitorCountTTDIToday}`,
                },
                {
                  "type": "mrkdwn",
                  "text": `*KLCC Movement*:smile:\n*Vend*\n${vendTextKLCC}*Adyen*\n${adyenTextKLCC}ManualCharge(${adyenCountManualChargeKLCCDaily}):${toRM(adyenTotalCollectionManualKLCCDaily)}\nAutoCharge(${adyenCountAutoChargeKLCCDaily}):${toRM(adyenTotalCollectionAutoKLCCDaily)}|${toRM(adyenMaxPriceKLCCDaily)}\nFrozen(${freezeExecutedUniqueUserKLCCCountDaily}):${freezeAddCountKLCCDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedKLCCCountDaily}\nCancelled:${cancelExecutedKLCCToday}\nVisitors:${checkInVisitorCountKLCCToday}`,
                },
              ]
            },
            // {
            //   "type": "section",
            //   "fields": [
            //     {
            //       "type": "mrkdwn",
            //       "text": `*Daily TTDI Movement*\n*Vend*\nMonthly Package(${monthlyPkgTTDICountDaily}):${toRM(monthlyPkgTTDITotalPriceDaily)}\n3M term package(${term3MTTDICountDaily}):${toRM(term3MTTDITotalPriceDaily)}\n6M term package(${term6MTTDICountDaily}):${toRM(term6MTTDITotalPriceDaily)}\n6M renewal(${renewal6MTTDICountDaily}):${toRM(renewal6MTTDITotalPriceDaily)}\n12M term(${term12MTTDICountDaily}):${toRM(term12MTTDITotalPriceDaily)}\n12M renewal(${renewal12MTTDICountDaily}):RM${toRM(renewal12MTTDITotalPriceDaily)}\nAugust Promo(${augustPromo3MPkgTTDICountDaily}):${toRM(augustPromo3MPkgTTDITotalPriceDaily)}\nMid Sept Promo(${midSepPromo3MPkgTTDICountDaily}):${toRM(midSepPromo3MPkgTTDITotalPriceDaily)}\nCorporate180(${CP180PkgTTDICountDaily}):${toRM(CP180PkgTTDITotalPriceDaily)}\nCorporate210(${CP210PkgTTDICountDaily}):${toRM(CP210PkgTTDITotalPriceDaily)}\nCorporate230(${CP230PkgTTDICountDaily}):${toRM(CP230PkgTTDITotalPriceDaily)}\n*Adyen*\nManual-Charge(${adyenCountManualChargeTTDIDaily}):${toRM(adyenTotalCollectionManualTTDIDaily)}\nAuto-Charge(${adyenCountAutoChargeTTDIDaily}):${toRM(adyenTotalCollectionAutoTTDIDaily)}|${toRM(adyenMaxPriceTTDIDaily)}\nFrozen(${freezeExecutedUniqueUserTTDICountDaily}):${freezeAddCountTTDIDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedTTDICountDaily}\nCancelled:${cancelExecutedTTDIToday}\nVisitors:${checkInVisitorCountTTDIToday}`,
            //     },
            //     {
            //       "type": "mrkdwn",
            //       "text": `*Daily KLCC Movement*\n*Vend*\nMonthly Package(${monthlyPkgKLCCCountDaily}):${toRM(monthlyPkgKLCCTotalPriceDaily)}\n3M term package(${term3MKLCCCountDaily}):${toRM(term3MKLCCTotalPriceDaily)}\n6M term package(${term6MKLCCCountDaily}):${toRM(term6MKLCCTotalPriceDaily)}\n12M term package(${term12MKLCCCountDaily}):RM${term12MKLCCTotalPriceDaily}\nAugust 2020 Promo(${augustPromo3MPkgKLCCCountDaily}):${toRM(augustPromo3MPkgKLCCTotalPriceDaily)}\nMid Sep Promo(${midSepPromo3MPkgKLCCCountDaily}):${toRM(midSepPromo3MPkgKLCCTotalPriceDaily)}\nUNO promo(${unoPromo4MPkgKLCCCountDaily}):${toRM(unoPromo4MPkgKLCCTotalPriceDaily)}\nCorporate290(${CP290PkgKLCCCountDaily}):${toRM(CP290PkgKLCCTotalPriceDaily)}\nCorporate310(${CP310PkgKLCCCountDaily}):${toRM(CP310PkgKLCCTotalPriceDaily)}\n*Adyen*\nManual-Charge(${adyenCountManualChargeKLCCDaily}):${toRM(adyenTotalCollectionManualKLCCDaily)}\nAuto-Charge(${adyenCountAutoChargeKLCCDaily}):${toRM(adyenTotalCollectionAutoKLCCDaily)}|${toRM(adyenMaxPriceKLCCDaily)}\nFrozen(${freezeExecutedUniqueUserKLCCCountDaily}):${freezeAddCountKLCCDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedKLCCCountDaily}\nCancelled:${cancelExecutedKLCCToday}\nVisitors:${checkInVisitorCountKLCCToday}`,
            //     },
            //   ]
            // },
            // {
            //   "type": "divider"
            // },
            // {
            //   "type": "section",
            //   "fields": [
            //     {
            //       "type": "mrkdwn",
            //       "text": `*MTD TTDI Movement*\nMTD Frozen(${freezeExecutedUniqueUserTTDICountMonthly}):${freezeAddCountTTDIMonthly} months\nMTD Canceled:${cancelExecutedTTDIThisMonth}\nMTD Unpaid:${unpaidTTDI}\nMTD Adyen\n-Renewals:`,
            //     },
            //     {
            //       "type": "mrkdwn",
            //       "text": `*MTD KLCC Movement*\nMTD Frozen(${freezeExecutedUniqueUserKLCCCountMonthly}):${freezeAddCountKLCCMonthly} months\nMTD Canceled:${cancelExecutedKLCCThisMonth}\nMTD Unpaid:${unpaidKLCC}\nMTD Adyen\nRenewals:`,
            //     },
            //   ]
            // },
          ]
        }
      }
    )

    return res.status(200).send({
      success:true,
      adyenCountDaily, adyenCountDailyClosed, adyenCountDailyRefunded,
      adyenCountMonthly, adyenCountMonthlyClosed, adyenCountMonthlyRefunded,
      vendCountDaily, vendCountDailyClosed, vendCountDailyVoided, vendCountDailyLaybyClosed,
      vendCountMonthly, vendCountMonthlyClosed,vendCountMonthlyVoided, vendCountMonthlyLaybyClosed,
      vendTotalCollection,
      activeFreezeCount,
      allComplimentary,
      allActiveTTDIPackage,
      allActiveKLCCPackage,
      //ttdi
      activeMonthlyTTDIdaily,
      activeQuarterlyTTDIdaily,
      active4MonthlyTTDIdaily,
      activeBiyearlyTTDIdaily,
      activeYearlyTTDIdaily,
      //klcc
      activeMonthlyKLCCdaily,
      activeQuarterlyKLCCdaily,
      active4MonthlyKLCCdaily,
      activeBiyearlyKLCCdaily,
      activeYearlyKLCCdaily,

      unpaidAll, unpaidTTDI, unpaidKLCC,
      unpaid1MonthTTDI, unpaid1to3MonthTTDI, unpaid3MonthTTDI,
      unpaid1MonthKLCC, unpaid1to3MonthKLCC, unpaid3MonthKLCC,
      packageSaleMapVend,packageSaleMapAdyen, activeTTDICorpPkgMap, activeKLCCCorpPkgMap,
      vendTextTTDI, vendTextKLCC, adyenTextTTDI, adyenTextKLCC, corpActiveTextTTDI, corpActiveTextKLCC,
      packageMap, packageWithPaymentArray,
    })
    // .then(result=>{
    //   console.log('addDailyTransactionToSlackMessage: ', result);
    //   return request.post(
    //     "https://hooks.slack.com/services/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",
    //     {json:{
    //       text:`Sales on ${moment().format('DD-MM-YYYY')} \n
    //       active\n: 
    //       complimentary: 25\n
    //       monthly: 16\n
    //       3M:212\n
    //       `}
    //     }
    //   )
    // }).catch(error=>{
    //   console.log('addDailyTransactionToSlackError: ', error);

    // });
    // console.log('payments: ', payments);
  });
});


// add MTD and DTD transaction to slack message
// exports.addMTDnDTDToSlack = functions.https.onRequest((req, res) => {
//   const usersQuery = admin.firestore().collection('users').get();
//   const paymentQuery = admin.firestore().collection('payments')
//   .where('type', '==', 'membership')
//   // .where('createdAt', '>=', moment().startOf('month').toDate())
//   .get();
//   // where('email', '==', 'tehowny@gmail.com').get();
//   const packagesQuery = admin.firestore().collection('packages').get();
//   const logsQuery = admin.firestore().collection('logs').get();
//   const gantnerLogsQuery = admin.firestore().collection('gantnerLogs')
//     .where('createdAt', '>=', moment().startOf('day').toDate())
//     .get();
  
//   // const vendSaleQuery = admin.firestore().coll

//   return Promise.all([paymentQuery, packagesQuery, usersQuery, logsQuery, gantnerLogsQuery]).then(result=>{
//     var batch = admin.firestore().batch();
//     const paymentResults = result[0];
//     const packagesResults = result[1];
//     const userResults = result[2];
//     const logResults = result[3];
//     const gantnerLogResults = result[4];

//     var packageMap = {};
//     packagesResults.forEach(doc=>{
//       const data = doc.data();
//       data.countDaily = 0;
//       packageMap[doc.id] = data;
//     });

//     var gantnerLogsMapTTDIToday = {};
//     var gantnerLogsMapKLCCToday = {};
//     gantnerLogResults && gantnerLogResults.forEach(doc=>{
//       const data = doc.data();
//       const userId = data && data.userId;
//       const deviceId = data && data.deviceId;
//       const isKLCCCheckIn = deviceId && deviceId.includes("KLCC");
//       if (isKLCCCheckIn && userId){gantnerLogsMapKLCCToday[userId] = data}
//       else if (userId){
//         // for TTDI
//         gantnerLogsMapTTDIToday[userId] = data;
//       }
//     });

//     var logsByUserIdMap = {};
//     // var freezeAddCountDaily = 0;
//     var freezeRemovedCountDaily = 0;
//     // var freezeAddLogsByUserIdMap = {};
//     // to get the freeze and freezeRemove action
//     logResults && logResults.forEach(doc=>{
//       const data = doc.data();
//       const userId = data && data.userId;
//       const source = data && data.source;
//       const action = data && data.action;
//       const time = data && data.time;
//       const freezeQuantity = data && data.freezeQuantity;

//       const isTodayTime = moment(getTheDate(time)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'));
//       if ((action && action === "freezeRemoved") && isTodayTime){
//         logsByUserIdMap[userId] = data;
//         freezeRemovedCountDaily+=1;
//       }
//       // if (source === "freeze" && isTodayTime){
//       //   freezeAddCountDaily = freezeAddCountDaily + freezeQuantity;
//       // }
//       // if (action && action === "freezeRemoved" && isTodayTime){
//       //   freezeRemovedCountDaily+=1;
//       // }
//     });

//     var payments = [];
//     var freezeMap = {};
//     var freezeCreatedTodayMap = {};
//     var freezeCreatedThisMonthMap = {};

//     var vendCountDaily = 0;
//     var vendCountDailyClosed = 0;
//     var vendCountDailyVoided = 0;
//     var vendCountDailyLaybyClosed = 0;
    
//     var adyenCountDaily = 0;
//     var adyenCountDailyClosed = 0;
//     var adyenCountDailyRefunded = 0;

//     var vendCountMonthly = 0;
//     var vendCountMonthlyClosed = 0;
//     var vendCountMonthlyVoided = 0;
//     var vendCountMonthlyLaybyClosed = 0;

//     var adyenCountMonthly = 0;
//     var adyenCountMonthlyClosed = 0;
//     var adyenCountMonthlyRefunded = 0;

//     var adyenAutoChargeCountMonthly = 0;
    

//     var vendTotalCollection = 0;

//     var vendTotalCollectionDaily = 0;
//     var adyenTotalCollectionDaily = 0;
//     var vendTotalCollectionMonthly = 0;
//     var adyenTotalCollectionMonthly = 0;

//     var freezeMap = {};

//     var vendCountDaily = 0;
//     var vendCountDailyClosed = 0;
//     var vendCountDailyVoided = 0;
//     var vendCountDailyLaybyClosed = 0;
    
//     var adyenCountDaily = 0;
//     var adyenCountDailyClosed = 0;
//     var adyenCountDailyRefunded = 0;

//     var vendCountMonthly = 0;
//     var vendCountMonthlyClosed = 0;
//     var vendCountMonthlyVoided = 0;
//     var vendCountMonthlyLaybyClosed = 0;

//     // for package membership total Price daily TTDI Vend
//     var monthlyPkgTTDITotalPriceDaily = 0;
//     var augustPromo3MPkgTTDITotalPriceDaily = 0;
//     var midSepPromo3MPkgTTDITotalPriceDaily = 0;
//     var renewal6MTTDITotalPriceDaily = 0;
//     var renewal12MTTDITotalPriceDaily = 0;
//     var term3MTTDITotalPriceDaily = 0;
//     var term6MTTDITotalPriceDaily = 0;
//     var term12MTTDITotalPriceDaily = 0;
//     var CP180PkgTTDITotalPriceDaily = 0; 
//     var CP210PkgTTDITotalPriceDaily = 0; 
//     var CP230PkgTTDITotalPriceDaily = 0; 
//     // for package membership total Price daily KLCC vend
//     var CP290PkgKLCCTotalPriceDaily = 0;
//     var CP310PkgKLCCTotalPriceDaily = 0; 
//     var monthlyPkgKLCCTotalPriceDaily = 0;
//     var augustPromo3MPkgKLCCTotalPriceDaily = 0;
//     var midSepPromo3MPkgKLCCTotalPriceDaily = 0;
//     var unoPromo4MPkgKLCCTotalPriceDaily = 0;
//     var term3MKLCCTotalPriceDaily = 0;
//     var term6MKLCCTotalPriceDaily = 0;
//     var term12MKLCCTotalPriceDaily = 0;

//     // for package membership total Price monthly TTDI Vend
//     var monthlyPkgTTDITotalPriceMonthly = 0;
//     var augustPromo3MPkgTTDITotalPriceMonthly = 0;
//     var midSepPromo3MPkgTTDITotalPriceMonthly = 0;
//     var renewal6MTTDITotalPriceMonthly = 0;
//     var renewal12MTTDITotalPriceMonthly = 0;
//     var term3MTTDITotalPriceMonthly = 0;
//     var term6MTTDITotalPriceMonthly = 0;
//     var term12MTTDITotalPriceMonthly = 0;
//     var CP180PkgTTDITotalPriceMonthly = 0; 
//     var CP210PkgTTDITotalPriceMonthly = 0; 
//     var CP230PkgTTDITotalPriceMonthly = 0; 
//     // for package membership total Price Monthly KLCC vend
//     var CP290PkgKLCCTotalPriceMonthly = 0;
//     var CP310PkgKLCCTotalPriceMonthly = 0; 
//     var monthlyPkgKLCCTotalPriceMonthly = 0;
//     var augustPromo3MPkgKLCCTotalPriceMonthly = 0;
//     var midSepPromo3MPkgKLCCTotalPriceMonthly = 0;
//     var unoPromo4MPkgKLCCTotalPriceMonthly = 0;
//     var term3MKLCCTotalPriceMonthly = 0;
//     var term6MKLCCTotalPriceMonthly = 0;
//     var term12MKLCCTotalPriceMonthly = 0;

//     // for new membership transaction
//     var adyenFirstTimeCountDaily = 0;
//     var adyenAutoChargeCountDaily = 0;
//     var adyenFirstTimeTotalPriceDaily = 0;
//     var adyenAutoChargeTotalPriceDaily = 0;
//     var adyenAutoChargeTotalPriceMonthly = 0;
//     var adyenCountManualChargeTTDIMonthly = 0;
//     var adyenTotalCollectionManualKLCCMonthly = 0;
//     var adyenMaxPriceDaily = 0;

//     // for package membership total Price daily TTDI adyen
//     var adyenmonthlyPkgTTDITotalPriceDaily = 0;
//     var adyenaugustPromo3MPkgTTDITotalPriceDaily = 0;
//     var adyenmidSepPromo3MPkgTTDITotalPriceDaily = 0;
//     var adyenrenewal6MTTDITotalPriceDaily = 0;
//     var adyenrenewal12MTTDITotalPriceDaily = 0;
//     var adyenterm3MTTDITotalPriceDaily = 0;
//     var adyenterm6MTTDITotalPriceDaily = 0;
//     var adyenterm12MTTDITotalPriceDaily = 0;
//     var adyenCP180PkgTTDITotalPriceDaily = 0; 
//     var adyenCP210PkgTTDITotalPriceDaily = 0; 
//     var adyenCP230PkgTTDITotalPriceDaily = 0; 
//     // for package membership total Price daily KLCC adyen
//     var adyenCP290PkgKLCCTotalPriceDaily = 0;
//     var adyenCP310PkgKLCCTotalPriceDaily = 0; 
//     var adyenmonthlyPkgKLCCTotalPriceDaily = 0;
//     var adyenaugustPromo3MPkgKLCCTotalPriceDaily = 0;
//     var adyenmidSepPromo3MPkgKLCCTotalPriceDaily = 0;
//     var adyenunoPromo4MPkgKLCCTotalPriceDaily = 0;
//     var adyenterm3MKLCCTotalPriceDaily = 0;
//     var adyenterm6MKLCCTotalPriceDaily = 0;
//     var adyenterm12MKLCCTotalPriceDaily = 0;

//     var adyenCountMonthly = 0;
//     var adyenCountMonthlyClosed = 0;
//     var adyenCountMonthlyRefunded = 0;

//     var vendTotalCollectionDaily = 0;
//     var adyenTotalCollectionDaily = 0;
//     var vendTotalCollectionMonthly = 0;
//     var adyenTotalCollectionMonthly = 0;

//     var adyenCountManualChargeTTDIDaily = 0;
//     var adyenCountManualChargeKLCCDaily = 0;
//     var adyenTotalCollectionManualTTDIDaily = 0;
//     var adyenTotalCollectionManualKLCCDaily = 0;

//     // adyen daily
//     var adyenCountAutoChargeTTDIDaily = 0;
//     var adyenCountAutoChargeKLCCDaily = 0;
//     var adyenTotalCollectionAutoTTDIDaily = 0;
//     var adyenTotalCollectionAutoKLCCDaily = 0;
//     // adyen monthly
//     var adyenCountAutoChargeTTDIMonthly = 0;
//     var adyenCountAutoChargeKLCCMonthly = 0;
//     var adyenCountManualChargeTTDIMonthly = 0;
//     var adyenTotalCollectionAutoTTDIMonthly = 0;
//     var adyenTotalCollectionAutoKLCCMonthly = 0;
//     var adyenTotalCollectionManualTTDIMonthly = 0
//     var adyenTotalCollectionManualKLCCMonthly = 0;
  
//     var adyenMaxPriceTTDIDaily = 0;
//     var adyenMaxPriceKLCCDaily = 0;
  
//     var packageSaleMapVendDaily = {};
//     var packageWithPaymentArray = [];
//     var packageSaleMapVend = {};
//     var packageSaleMapAdyen = {};
    
//     var activeTTDICorpPkgMap = {};
//     var activeKLCCCorpPkgMap = {};

//     var vendTextTTDI = '';
//     var vendTextKLCC = '';

//     var adyenTextTTDI = '';
//     var adyenTextKLCC = '';

//     var corpActiveTextTTDI = '';
//     var corpActiveTextKLCC = '';

//     var corpCancelTextTTDI = '';
//     var corpCancelTextKLCC = '';

//     var corpExpiredTextTTDI = '';
//     var corpExpiredTextKLCC = '';
    
//     paymentResults.forEach(payment=>{
//       if (payment && payment.data()){
//         const data = payment.data();
//         const createdAt = data.createdAt? data.createdAt:null;
//         const userId = data.userId? data.userId:null;
       
//         const invoiceId = data.invoiceId? data.invoiceId:" ";
//         const packageId = data.packageId? data.packageId:null;
//         const packageData = packageId? packageMap[packageId]:null;
//         const packageName = packageData && packageData.shortName;
//         const packageBase = packageData && packageData.base;
//         const quantity = data.quantity? data.quantity:1;
//         const renewalTerm = data.renewalTerm? data.renewalTerm:" ";
//         const source = data.source;
//         const status = data.status? data.status:" ";
//         const totalPrice = data.totalPrice? data.totalPrice:0;
//         const type = data.type? data.type:" ";
//         const manualAdd = data.manualAdd? data.manualAdd:"false";
//         const transactionId = data.transactionId;
//         const vendProductId = data.vendProductId? data.vendProductId:" ";
//         const vendProductName = data.vendProductName || null;
//         const vendSaleId = data.vendSaleId;
//         const freezeFor = data && data.freezeFor;
//         const isAutoCharge = (data && data.isAutoCharge)? true:false;
//         const slackReportIndex = packageData && packageData.slackReportIndex;
//         const outlet = data.outlet? data.outlet:packageBase;
//         // test
//         data.quantity = quantity;
    
//         // const shortName = packageData && packageData.shortName;

//         if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
//           freezeCreatedTodayMap[userId] = data;
//         }
//         if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(createdAt)).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
//           freezeCreatedThisMonthMap[userId] = data;
//         }
//         // freezeFor that valid up till today
//         if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(freezeFor)).tz('Asia/Kuala_Lumpur').add(1, 'month').isAfter(moment().tz('Asia/Kuala_Lumpur'))){
//         // if (userId && data && source === 'freeze' && freezeFor && moment(getTheDate(freezeFor)).isSameOrAfter(moment().startOf('day').subtract(1, 'months'))){  
//           freezeMap[userId] = data;
//         }
//         // for daily
//         if (source === 'vend' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
//           vendCountDaily+=1;
//           if (status && status === 'CLOSED'){
//             vendCountDailyClosed+=1;
//             vendTotalCollectionDaily = vendTotalCollectionDaily + parseFloat(totalPrice);
//             var countDaily = 0;
          
//             // packageData.map(item=>{
//               // let obj = {};
//               // obj["name"]=packageName;
//               // obj["countDaily"] = obj.countDaily? obj.countDaily+1:1;
//               // packageWithPaymentArray.push({obj});
//               // packageWithPaymentArray.push({
//               //   [item.name]:
//               // })
//             // });
//             // packageSaleMapVendDaily[packageId]= {

//             // };
//             // packageWithPaymentArray.push({
              
//             // });
//             // packageSaleMapVendDaily[]
//             // if(!packageSaleMapVend[packageId]){
//             //   packageSaleMapVend[packageId]= {
//             //     packageName,
//             //     packageBase,
//             //     totalPriceDaily:0,
//             //     totalPriceMonthly:0,
//             //     packageCountDaily:0,
//             //     packageCountMonthly:0,
//             //     outlet
//             //   };  
//             // }

//             // packageSaleMapVend[packageId].packageCountDaily+=1;
//             // packageSaleMapVend[packageId].totalPrice += parseFloat(totalPrice);
//             // vendText = `${vendText} ${packageSaleMapVend[packageId].packageName} (${packageSaleMapVend[packageId].packageCountDaily})`

          
//           }
//           else if (status && status === 'VOIDED'){
//             vendCountDailyVoided+=1;
//           }
//           else if (status && status === 'LAYBY_CLOSED'){
//             vendCountDailyLaybyClosed+=1;
//           }
//         }

//         else if (source ==='adyen' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
//           adyenCountDaily+=1;
//           if (status && status === 'CLOSED'){
//             adyenCountDailyClosed+=1;
//             adyenTotalCollectionDaily = adyenTotalCollectionDaily + parseFloat(totalPrice);
//             if (isAutoCharge){
//               adyenAutoChargeCountDaily+=1;
//               adyenAutoChargeTotalPriceDaily = adyenAutoChargeTotalPriceDaily + parseFloat(totalPrice);
//               adyenMaxPriceDaily = (parseFloat(totalPrice)>adyenMaxPriceDaily)? totalPrice:adyenMaxPriceDaily;
//               if (packageBase && packageBase === "TTDI"){
//                 adyenCountAutoChargeTTDIDaily+=1;
//                 adyenTotalCollectionAutoTTDIDaily = adyenTotalCollectionAutoTTDIDaily+parseFloat(totalPrice);
//                 adyenMaxPriceTTDIDaily = (parseFloat(totalPrice)>adyenMaxPriceTTDIDaily)? totalPrice:adyenMaxPriceTTDIDaily;
//               }
//               else if (packageBase && packageBase === "KLCC"){
//                 adyenCountAutoChargeKLCCDaily+=1;
//                 adyenTotalCollectionAutoKLCCDaily = adyenTotalCollectionAutoKLCCDaily+parseFloat(totalPrice);
//                 adyenMaxPriceKLCCDaily = (parseFloat(totalPrice)>adyenMaxPriceKLCCDaily)? totalPrice:adyenMaxPriceKLCCDaily;
//               }
//             }
//             // other than auto charge, assume as new card for now
//             else if (!isAutoCharge){
//               adyenFirstTimeCountDaily+=1;
//               adyenFirstTimeTotalPriceDaily = adyenFirstTimeTotalPriceDaily + parseFloat(totalPrice);
//               if (packageBase && packageBase === "TTDI"){
//                 adyenCountManualChargeTTDIDaily+=1;
//                 adyenTotalCollectionManualTTDIDaily = adyenTotalCollectionManualTTDIDaily+parseFloat(totalPrice);
//               }
//               else if (packageBase && packageBase === "KLCC"){
//                 adyenCountManualChargeKLCCDaily+=1;
//                 adyenTotalCollectionManualKLCCDaily = adyenTotalCollectionManualKLCCDaily+parseFloat(totalPrice);
//               }
//             }
//           }
//           else if (status && status === 'REFUNDED'){
//             adyenCountDailyRefunded+=1;
//           }
//         }

//         // for monthly
//         if (source === 'vend' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
//           vendCountMonthly+=1;
//           if (status && status === 'CLOSED'){
//             vendCountMonthlyClosed+=1;
//             vendTotalCollectionMonthly = vendTotalCollectionMonthly + parseFloat(totalPrice);
            
//             if(!packageSaleMapVend[packageId]){
//               packageSaleMapVend[packageId]= {
//                 packageName,
//                 packageBase,
//                 totalPriceDaily:0,
//                 totalPriceMonthly:0,
//                 packageCountDaily:0,
//                 packageCountMonthly:0,
//                 source,
//                 outlet,
//                 vendSaleId: [],
//                 createdAt: []
//               };  
//             }
//             packageSaleMapVend[packageId].packageCountMonthly+=1;
//             packageSaleMapVend[packageId].totalPriceMonthly += parseFloat(totalPrice);
//             packageSaleMapVend[packageId].vendSaleId.push(vendSaleId);
//             packageSaleMapVend[packageId].createdAt.push(moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('day').format("YYYY-MM-DD"));
            
//             // for daily
//             if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
//               packageSaleMapVend[packageId].packageCountDaily+=1;
//               packageSaleMapVend[packageId].totalPriceDaily += parseFloat(totalPrice);
//             }

//           }
//           else if (status && status === 'VOIDED'){
//             vendCountMonthlyVoided+=1;
//           }
//           else if (status && status === 'LAYBY_CLOSED'){
//             vendCountMonthlyLaybyClosed+=1;
//           }
//         }

//         else if (source ==='adyen' && createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))){
//           adyenCountMonthly+=1;
//           if (status && status === 'CLOSED'){
//             adyenCountMonthlyClosed+=1;
//             adyenTotalCollectionMonthly = adyenTotalCollectionMonthly + parseFloat(totalPrice);

//             if(!packageSaleMapAdyen[packageId]){
//               packageSaleMapAdyen[packageId]= {
//                 packageName,
//                 packageBase,
//                 totalPriceDaily:0,
//                 totalPriceMonthly:0,
//                 packageCountDaily:0,
//                 packageCountMonthly:0,
//                 source,
//                 outlet, 
//                 transactionId:[],
//                 createdAt: []
//               };  
//               // just to view the details in postman
//               packageSaleMapAdyen[packageId].createdAt.push(moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('day').format("YYYY-MM-DD"));
//               packageSaleMapAdyen[packageId].transactionId.push(transactionId);
//             }
//             packageSaleMapAdyen[packageId].packageCountMonthly+=1;
//             packageSaleMapAdyen[packageId].totalPriceMonthly+=parseFloat(totalPrice);
           
//             // for daily
//             if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
//               // if(!packageSaleMapAdyen[packageId]){
//               //   packageSaleMapAdyen[packageId]= {
//               //     packageName,
//               //     packageBase,
//               //     totalPriceDaily:0,
//               //     totalPriceMonthly:0,
//               //     packageCountDaily:0,
//               //     packageCountMonthly:0,
//               //     source,
//               //     outlet,
//               //     createdAt: moment(getTheDate(createdAt)).tz("Asia/Kuala_Lumpur").startOf('days').format("YYYY-MM-DD")
//               //   };  
//               // }
//               packageSaleMapAdyen[packageId].packageCountDaily+=1;
//               packageSaleMapAdyen[packageId].totalPriceDaily += parseFloat(totalPrice);
//             }

//             if (isAutoCharge){
//               adyenAutoChargeCountMonthly+=1;
//               adyenAutoChargeTotalPriceMonthly = adyenAutoChargeTotalPriceMonthly + parseFloat(totalPrice);
//               if (packageBase && packageBase === "TTDI"){
//                 adyenCountAutoChargeTTDIMonthly+=1;
//                 adyenTotalCollectionAutoTTDIMonthly = adyenTotalCollectionAutoTTDIMonthly+parseFloat(totalPrice);
//               }
//               else if (packageBase && packageBase === "KLCC"){
//                 adyenCountAutoChargeKLCCMonthly+=1;
//                 adyenTotalCollectionAutoKLCCMonthly = adyenTotalCollectionAutoKLCCMonthly+parseFloat(totalPrice);
//               }
//             }
//             // other than auto charge, assume as new card for now
//             else if (!isAutoCharge){
//               if (packageBase && packageBase === "TTDI"){
//                 adyenCountManualChargeTTDIMonthly+=1;
//                 adyenTotalCollectionManualTTDIMonthly = adyenTotalCollectionManualTTDIMonthly+parseFloat(totalPrice);
//               }
//               else if (packageBase && packageBase === "KLCC"){
//                 adyenCountManualChargeKLCCDaily+=1;
//                 adyenTotalCollectionManualKLCCMonthly = adyenTotalCollectionManualKLCCMonthly+parseFloat(totalPrice);
//               }
//             }
//           }
//           else if (status && status === 'REFUNDED'){
//             adyenCountMonthlyRefunded+=1;
//           }
//         }
//       }
//     });

//     var activeMonthlyTTDIdaily = 0;
//     var activeQuarterlyTTDIdaily = 0;
//     var activeBiyearlyTTDIdaily = 0;
//     var active4MonthlyTTDIdaily = 0;
//     var activeYearlyTTDIdaily = 0;
//     var activeMonthlyKLCCdaily = 0;
//     var activeQuarterlyKLCCdaily = 0;
//     var activeBiyearlyKLCCdaily = 0;
//     var active4MonthlyKLCCdaily = 0;
//     var activeYearlyKLCCdaily = 0;
//     var activeCorpTTDIDaily = 0;
//     var activeCorpKLCCDaily = 0;
//     var allActivePackage = 0;
//     var allActiveTTDIPackage = 0;
//     var allActiveKLCCPackage = 0;
//     var activeFreezeCount = 0;
//     var activeFreezeTTDICount = 0;
//     var activeFreezeKLCCCount = 0;

//     var unpaidAll = 0;
//     var unpaidTTDI = 0;
//     var unpaidKLCC = 0;
//     var unpaid1MonthTTDI = 0;
//     var unpaid1to3MonthTTDI = 0;
//     var unpaid3MonthTTDI = 0;
//     var unpaid1MonthKLCC = 0;
//     var unpaid1to3MonthKLCC = 0;
//     var unpaid3MonthKLCC = 0;

//     var allComplimentary = 0;
//     var freezeCountChanges = 0;
//     var freezeAddCountTTDIDaily = 0;
//     var freezeAddCountKLCCDaily = 0;
//     var freezeAddCountTTDIMonthly = 0;
//     var freezeAddCountKLCCMonthly = 0;
//     var freezeExecutedUniqueUserTTDICountDaily = 0;
//     var freezeExecutedUniqueUserKLCCCountDaily = 0;
//     var freezeExecutedUniqueUserTTDICountMonthly = 0;
//     var freezeExecutedUniqueUserKLCCCountMonthly = 0;
//     var freezeExecutedUniqueUserRemovedTTDICountDaily = 0;
//     var freezeExecutedUniqueUserRemovedKLCCCountDaily = 0;
//     var cancelExecutedTTDIToday = 0;
//     var cancelExecutedKLCCToday = 0;
//     var cancelExecutedTTDIThisMonth = 0;
//     var cancelExecutedKLCCThisMonth = 0;
//     var checkInVisitorCountTTDIToday = 0;
//     var checkInVisitorCountKLCCToday = 0;

//     // var userMap = {};
//     userResults && userResults.forEach(doc=>{
//       const data = doc.data();
//       // userMap[doc.id] = data;
//       const packageId = data && data.packageId;
//       const packageData = packageId? packageMap[packageId]:null;
//       const packageBase = packageData && packageData.base;
//       const packageName = packageData && packageData.shortName;
//       const isTTDICorpPackage = packageData && (packageBase && packageBase === "TTDI") && packageData.type === "corp";
//       const isKLCCCorpPackage = packageData && (packageBase && packageBase === "KLCC") && packageData.type === "corp";
//       const renewalTerm = packageData && packageData.renewalTerm;
//       const userTerminated = data && data.cancellationDate && moment(getTheDate(data.cancellationDate)).isSameOrBefore(moment(), 'day');
//       const membershipEnd = data.autoMembershipEnds? data.autoMembershipEnds:data.membershipEnds? data.membershipEnds:null;
//       const freezeData = freezeMap? freezeMap[doc.id]:null;
//       const userFreezeFor = freezeData && freezeData.freezeFor;
//       const membershipStarts = data.autoMembershipStarts ? data.autoMembershipStarts : data.membershipStarts;
//       const membershipEnds = data.autoMembershipEnds ? data.autoMembershipEnds : data.membershipEnds;
//       const isComplimentaryPkg = renewalTerm && renewalTerm === 'never';
//       const isActiveMember = (!userFreezeFor && !isComplimentaryPkg && membershipStarts && !userTerminated && (moment(getTheDate(membershipStarts)) < moment()) && membershipEnds && moment(getTheDate(membershipEnds)) >= moment())
//       const isExpiredMember = packageId && membershipStarts && (moment(getTheDate(membershipStarts)) < moment()) && membershipEnds && (moment(getTheDate(membershipEnds)) < moment()) && !userTerminated 
//       const isStaff = data && data.isStaff;
//       const freezeExecutedToday = freezeCreatedTodayMap? freezeCreatedTodayMap[doc.id]:null;
//       const freezeExecutedThisMonth = freezeCreatedThisMonthMap? freezeCreatedThisMonthMap[doc.id]:null;
      
//       freezeExecutedToday && (Object.keys(freezeExecutedToday).length > 0) && Object.entries(freezeExecutedToday).forEach(([key, value]) => {
//         // const quantity = value.quantity || 1;
//         const quantity = 1;
//         if (packageBase && packageBase === "TTDI"){
//             freezeAddCountTTDIDaily += quantity;
//           }
//           else if (packageBase && packageBase === "KLCC"){
//             freezeAddCountKLCCDaily += quantity;
//           }
//       });

//     //   console.log('freezeAddCountKLCCDaily: ', freezeAddCountKLCCDaily);
//     //   console.log('freezeAddCountTTDIDaily: ', freezeAddCountTTDIDaily);
//     //   freezeExecutedToday && Object.keys(freezeExecutedToday).forEach(key => {
//     //     const quantity = freezeExecutedToday[key].quantity||1;
//     //     if (packageBase && packageBase === "TTDI"){
//     //       freezeAddCountTTDIDaily += quantity;
//     //     }
//     //     else if (packageBase && packageBase === "KLCC"){
//     //       freezeAddCountKLCCDaily += quantity;
//     //     }
//     //   });

//     freezeExecutedThisMonth && (Object.keys(freezeExecutedThisMonth).length > 0) && Object.entries(freezeExecutedThisMonth).forEach(([key, value]) => {
//         // const quantity = value.quantity || 1;
//         const quantity = 1;
//         if (packageBase && packageBase === "TTDI"){
//             freezeAddCountTTDIMonthly += quantity;
//           }
//           else if (packageBase && packageBase === "KLCC"){
//             freezeAddCountKLCCMonthly += quantity;
//           }
//     });

//     // console.log('freezeAddCountKLCCMonthly: ', freezeAddCountKLCCMonthly);

//     //   freezeExecutedThisMonth && Object.keys(freezeExecutedThisMonth).forEach(key => {
//     //     const quantity = freezeExecutedThisMonth[key].quantity||1;
//     //     if (packageBase && packageBase === "TTDI"){
//     //       freezeAddCountTTDIMonthly = freezeAddCountTTDIMonthly+ quantity;
//     //     }
//     //     else if (packageBase && packageBase === "KLCC"){
//     //       freezeAddCountKLCCMonthly = freezeAddCountKLCCMonthly + quantity;
//     //     }
//     //   });
    
//       const cancellationCreatedAt = data && data.cancellationCreatedAt;

//       const logData = logsByUserIdMap && logsByUserIdMap[doc.id];
//       // logData && logData.sort((a,b)=>{
//       //   var dateA = new Date(a.time);
//       //   var dateB = new Date(b.time);
//       //   if (dateA < dateB) {return -1}
//       //   if (dateA > dateB) {return 1}
//       //   return 0;
//       // });

//       const isVisitorCheckInTTDIToday = gantnerLogsMapTTDIToday? gantnerLogsMapTTDIToday[doc.id]:null;
//       const isVisitorCheckInKLCCToday = gantnerLogsMapKLCCToday? gantnerLogsMapKLCCToday[doc.id]:null;

//     //   console.log('isVisitorCheckInTTDIToday: ', isVisitorCheckInTTDIToday);
//     //   console.log('isVisitorCheckInKLCCToday: ', isVisitorCheckInKLCCToday);

//       if (isVisitorCheckInTTDIToday && !membershipEnds){checkInVisitorCountTTDIToday+=1}
//       else if (isVisitorCheckInKLCCToday && !membershipEnds){checkInVisitorCountKLCCToday+=1}

//       if (logData){
//         // freezeExecutedUniqueUserRemovedCountDaily+=1;
//         if (packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserRemovedTTDICountDaily+=1}
//         else if (packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserRemovedKLCCCountDaily+=1}
//       }
//       if (freezeExecutedToday && packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserTTDICountDaily+=1}
//       if (freezeExecutedToday && packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserKLCCCountDaily+=1}
//       if (freezeExecutedThisMonth && packageBase && packageBase === "TTDI"){freezeExecutedUniqueUserTTDICountMonthly+=1}
//       if (freezeExecutedThisMonth && packageBase && packageBase === "KLCC"){freezeExecutedUniqueUserKLCCCountMonthly+=1}

//       if (cancellationCreatedAt && packageBase && packageBase === "TTDI" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){cancelExecutedTTDIToday+=1}
//       else if (cancellationCreatedAt && packageBase && packageBase === "KLCC" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){cancelExecutedKLCCToday+=1}

//       if (cancellationCreatedAt && packageBase && packageBase === "TTDI" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('months'))){cancelExecutedTTDIThisMonth+=1}
//       else if (cancellationCreatedAt && packageBase && packageBase === "KLCC" && moment(getTheDate(cancellationCreatedAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('months'))){cancelExecutedKLCCThisMonth+=1}

//       if (userFreezeFor && !userTerminated){activeFreezeCount+=1}
//       if (userFreezeFor && packageBase && packageBase === 'TTDI'){activeFreezeTTDICount+=1}
//       else if (userFreezeFor && packageBase && packageBase === 'KLCC'){activeFreezeKLCCCount+=1}
      
//       if (isActiveMember && packageBase){allActivePackage+=1}
//       // if (!userFreezeFor && packageBase && packageBase === 'TTDI' && !userTerminated && membershipEnd && moment(getTheDate(membershipEnd)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur'))){
      
//       if (packageBase && packageBase === "TTDI" && isTTDICorpPackage){
//         activeCorpTTDIDaily+=1;
//         if(!activeTTDICorpPkgMap[packageId]){
//           activeTTDICorpPkgMap[packageId]= {
//             packageName,
//             packageBase,
//             activeCount:0,
//             cancelCount:0,
//             expiredCount:0
//           };  
//         }
//         if (isActiveMember){activeTTDICorpPkgMap[packageId].activeCount+=1}
//         else if (userTerminated){activeTTDICorpPkgMap[packageId].cancelCount+=1}
//         else if (isExpiredMember){activeTTDICorpPkgMap[packageId].expiredCount+=1}
//       }
//       else if (packageBase && packageBase === "KLCC" && isKLCCCorpPackage){
//         activeCorpKLCCDaily+=1
//         if(!activeKLCCCorpPkgMap[packageId]){
//           activeKLCCCorpPkgMap[packageId]= {
//             packageName,
//             packageBase,
//             activeCount:0,
//             cancelCount:0,
//             expiredCount:0
//           };  
//         }
//         if (isActiveMember){activeKLCCCorpPkgMap[packageId].activeCount+=1}
//         else if (userTerminated){activeKLCCCorpPkgMap[packageId].cancelCount+=1}
//         else if (isExpiredMember){activeKLCCCorpPkgMap[packageId].expiredCount+=1}
//       }

//       if (packageBase && packageBase === 'TTDI' && isActiveMember){allActiveTTDIPackage+=1}
//       else if (packageBase && packageBase === 'KLCC' && isActiveMember){allActiveKLCCPackage+=1}
      
//       // for ttdi daily
//       if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && (renewalTerm === 'month'||renewalTerm === 'monthly'))
//       {activeMonthlyTTDIdaily+=1}
//       // quarterly
//       else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === 'quarterly'){
//         activeQuarterlyTTDIdaily+=1}
//       // 4monthly
//       else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === '4monthly'){
//         active4MonthlyTTDIdaily+=1}
//       // biyearly
//       else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && renewalTerm === 'biyearly'){
//         activeBiyearlyTTDIdaily+=1}
//       // yearly
//       else if (isActiveMember && packageBase && packageBase === 'TTDI' && !isComplimentaryPkg && renewalTerm && (renewalTerm === 'year'||renewalTerm==='yearly')){
//         activeYearlyTTDIdaily+=1}
//       // complimentary && complimentary promo
//       else if (renewalTerm && (renewalTerm === 'never') && !userTerminated)
//       {allComplimentary+=1}

//       // for klcc daily
//       else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'monthly' || renewalTerm === 'month') ){
//         activeMonthlyKLCCdaily+=1}
//       // quarterly
//       else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'quarterly')){
//           activeQuarterlyKLCCdaily+=1}
//       // 4monthly
//       else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === '4monthly')){
//         active4MonthlyKLCCdaily+=1}
//       // biyearly
//       else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'biyearly')){
//         activeBiyearlyKLCCdaily+=1}
//       //yearly
//       else if (isActiveMember && packageBase && packageBase === 'KLCC' && renewalTerm && (renewalTerm === 'year'||renewalTerm === 'yearly')){
//         activeYearlyKLCCdaily+=1}

//       // for all expired
//       if (isExpiredMember && packageBase){unpaidAll+=1}
//       if (isExpiredMember && packageBase && packageBase === 'TTDI'){unpaidTTDI+=1}
//       else if (isExpiredMember && packageBase && packageBase === 'KLCC'){unpaidKLCC+=1}

//       // for 1 month expired member ttdi
//       if (isExpiredMember && packageBase && packageBase === 'TTDI'
//         && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(1, 'months').subtract(1,'days'), moment().add(1, 'days')))
//       {unpaid1MonthTTDI+=1}
//       else if (isExpiredMember && packageBase && packageBase === 'TTDI'
//       && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(3, 'months').subtract(1,'days'), moment().add(1, 'months').add(1, 'days'))
//       )
//       {unpaid1to3MonthTTDI+=1}
//       else if (isExpiredMember && packageBase && packageBase === 'TTDI'
//       && moment(getTheDate(membershipEnd)).isBefore(moment().subtract(3, 'months')))
//       {unpaid3MonthTTDI+=1}
      
//       // for klcc
//       if (isExpiredMember && packageBase && packageBase === 'KLCC'
//       && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(1, 'months').subtract(1,'days'), moment().add(1, 'days'))
//       )
//       {unpaid1MonthKLCC+=1}
//       else if (isExpiredMember && packageBase && packageBase === 'KLCC'
//       && moment(getTheDate(membershipEnd)).isBetween(moment().subtract(3, 'months').subtract(1,'days'), moment().add(1, 'months').add(1, 'days'))
//       )
//       {unpaid1to3MonthKLCC+=1}
//       else if (isExpiredMember && packageBase && packageBase === 'KLCC'
//       && moment(getTheDate(membershipEnd)).isBefore(moment().subtract(3, 'months'))
//       )
//       {unpaid3MonthKLCC+=1}
//   });

//   Object.keys(packageSaleMapVend).forEach(key=>{
//     const packageDataVend = packageSaleMapVend[key];
//     const outlet = packageDataVend.outlet;
//     const source = packageDataVend.source;
//     vendTextTTDI = ((outlet === "TTDI") && (source === 'vend'))? `${vendTextTTDI}${packageDataVend.packageName} (${packageDataVend.packageCountDaily}|${packageDataVend.packageCountMonthly}) : ${toRM(packageDataVend.totalPriceDaily)}|${parseFloat(packageDataVend.totalPriceMonthly).toFixed(2)}\n`:vendTextTTDI;
//     vendTextKLCC = ((outlet === "KLCC") && (source==='vend'))? `${vendTextKLCC}${packageDataVend.packageName} (${packageDataVend.packageCountDaily}|${packageDataVend.packageCountMonthly}) : ${toRM(packageDataVend.totalPriceDaily)}|${parseFloat(packageDataVend.totalPriceMonthly).toFixed(2)}\n`:vendTextKLCC;
//   });

//   Object.keys(packageSaleMapAdyen).forEach(key=>{
//     const packageDataAdyen = packageSaleMapAdyen[key];
//     const outlet = packageDataAdyen.outlet;
//     const source = packageDataAdyen.source;
//     adyenTextTTDI = ((outlet === "TTDI") && (source === 'adyen'))? `${adyenTextTTDI}${packageDataAdyen.packageName} (${packageDataAdyen.packageCountDaily}|${packageDataAdyen.packageCountMonthly}) : ${toRM(packageDataAdyen.totalPriceDaily)}|${parseFloat(packageDataAdyen.totalPriceMonthly).toFixed(2)}\n`:adyenTextTTDI;
//     adyenTextKLCC = ((outlet === "KLCC") && (source === 'adyen'))? `${adyenTextKLCC}${packageDataAdyen.packageName} (${packageDataAdyen.packageCountDaily}|${packageDataAdyen.packageCountMonthly}) : ${toRM(packageDataAdyen.totalPriceDaily)}|${parseFloat(packageDataAdyen.totalPriceMonthly).toFixed(2)}\n`:adyenTextKLCC;
//   });

//   Object.keys(activeTTDICorpPkgMap).forEach(key=>{
//     const activeTTDICorpPkg = activeTTDICorpPkgMap[key];
//     corpActiveTextTTDI = `${corpActiveTextTTDI}${activeTTDICorpPkg.packageName}:${activeTTDICorpPkg.activeCount}\n`;
//     corpCancelTextTTDI = `${corpCancelTextTTDI}${activeTTDICorpPkg.packageName}:${activeTTDICorpPkg.cancelCount}\n`;
//   });

//   Object.keys(activeKLCCCorpPkgMap).forEach(key=>{
//     const activeKLCCCorpPkg = activeKLCCCorpPkgMap[key];
//     corpActiveTextKLCC = `${corpActiveTextKLCC}${activeKLCCCorpPkg.packageName}:${activeKLCCCorpPkg.activeCount}\n`;
//     corpCancelTextKLCC = `${corpCancelTextKLCC}${activeKLCCCorpPkg.packageName}:${activeKLCCCorpPkg.cancelCount}\n`;
//   });

//     request.post(
//       "https://hooks.slack.com/services/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",
//          {json:{
//           blocks:[
//             {
//               "type": "divider"
//             },
//             {
//               "type": "header",
//               "text": {
//                 "type": "plain_text",
//                 "text": `Babel Membership ${moment().format('DD-MM-YYYY')}`,
//                 "emoji": true
//               }
//             },
//             {
//               "type": "section",
//               "fields": [
//                 {
//                   "type": "mrkdwn",
//                   "text": `*ACTIVE*\ncomplimentary: ${allComplimentary}\nAll Active Members:${allActivePackage}\nFreezes: ${activeFreezeCount}\n`,
//                 },
//                 {
//                   "type": "mrkdwn",
//                   "text": `MTD movement (as for today)\nvend sale count (monthly):${vendCountMonthly}\nmembership payment from vend (monthly):RM${parseFloat(vendTotalCollectionMonthly).toFixed(2)}\nmembership payment from vend (daily):${toRM(vendTotalCollectionDaily)}\nadyen sale count (monthly):${adyenCountMonthly}\nmembership payment from adyen (monthly):${toRM(adyenTotalCollectionMonthly)}\nmembership payment from adyen (daily):${toRM(adyenTotalCollectionDaily)}\n`,
//                 },
//               ]
//             },
//             {
//               "type": "divider"
//             },
//             {
//               "type": "section",
//               "fields": [
//                 {
//                   "type": "mrkdwn",
//                   "text": `*TTDI Membership*\nActive:${allActiveTTDIPackage}\n-Complimentary:${allComplimentary}\n-Monthly:${activeMonthlyTTDIdaily}\n-3M package:${activeQuarterlyTTDIdaily}\n-4M package:${active4MonthlyTTDIdaily}\n-6M package:${activeBiyearlyTTDIdaily}\n-12M package:${activeYearlyTTDIdaily}\n*Corporate package*:${activeCorpTTDIDaily}\n${corpActiveTextTTDI}\nFrozen:${activeFreezeTTDICount}\nUnpaid (<1M):${unpaid1MonthTTDI}\nUnpaid (1 to 3M):${unpaid1to3MonthTTDI}\nUnpaid (3M+): ${unpaid3MonthTTDI}\n${corpCancelTextKLCC}`,
//                 },
//                 {
//                   "type": "mrkdwn",
//                   "text": `*KLCC Membership*\nActive:${allActiveKLCCPackage}\n-Complimentary:${allComplimentary}\n-Monthly:${activeMonthlyKLCCdaily}\n-3M package:${activeQuarterlyKLCCdaily}\n-4M package:${active4MonthlyKLCCdaily}\n-6M package:${activeBiyearlyKLCCdaily}\n-12M package:${activeYearlyKLCCdaily}\n*Corporate package*:${activeCorpKLCCDaily}\n${corpActiveTextKLCC}\nFrozen:${activeFreezeKLCCCount}\nUnpaid (<1M):${unpaid1MonthKLCC}\nUnpaid (1 to 3M):${unpaid1to3MonthKLCC}\nUnpaid (3M+): ${unpaid3MonthKLCC}\n${corpCancelTextTTDI}`,
//                 },
//               ]
//             },
//             {
//               "type": "divider"
//             },
//             {
//               "type": "section",
//               "fields": [
//                 {
//                   "type": "mrkdwn",
//                   "text": `*TTDI Movement*:smile:\n*Vend*\n${vendTextTTDI}*Adyen*\n${adyenTextTTDI}ManualCharge(${adyenCountManualChargeTTDIDaily}):${toRM(adyenTotalCollectionManualTTDIDaily)}\nAutoCharge(${adyenCountAutoChargeTTDIDaily}):${toRM(adyenTotalCollectionAutoTTDIDaily)}|${toRM(adyenMaxPriceTTDIDaily)}\nFrozen(${freezeExecutedUniqueUserTTDICountDaily}):${freezeAddCountTTDIDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedTTDICountDaily}\nCancelled:${cancelExecutedTTDIToday}\nVisitors:${checkInVisitorCountTTDIToday}`,
//                 },
//                 {
//                   "type": "mrkdwn",
//                   "text": `*KLCC Movement*:smile:\n*Vend*\n${vendTextKLCC}*Adyen*\n${adyenTextKLCC}ManualCharge(${adyenCountManualChargeKLCCDaily}):${toRM(adyenTotalCollectionManualKLCCDaily)}\nAutoCharge(${adyenCountAutoChargeKLCCDaily}):${toRM(adyenTotalCollectionAutoKLCCDaily)}|${toRM(adyenMaxPriceKLCCDaily)}\nFrozen(${freezeExecutedUniqueUserKLCCCountDaily}):${freezeAddCountKLCCDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedKLCCCountDaily}\nCancelled:${cancelExecutedKLCCToday}\nVisitors:${checkInVisitorCountKLCCToday}`,
//                 },
//               ]
//             }
//           ]
//         }
//       }
//     )

//     return res.status(200).send({
//       success:true,
//       adyenCountDaily, adyenCountDailyClosed, adyenCountDailyRefunded,
//       adyenCountMonthly, adyenCountMonthlyClosed, adyenCountMonthlyRefunded,
//       vendCountDaily, vendCountDailyClosed, vendCountDailyVoided, vendCountDailyLaybyClosed,
//       vendCountMonthly, vendCountMonthlyClosed,vendCountMonthlyVoided, vendCountMonthlyLaybyClosed,
//       vendTotalCollection,
//       activeFreezeCount,
//       allComplimentary,
//       allActiveTTDIPackage,
//       allActiveKLCCPackage,
//       //ttdi
//       activeMonthlyTTDIdaily,
//       activeQuarterlyTTDIdaily,
//       active4MonthlyTTDIdaily,
//       activeBiyearlyTTDIdaily,
//       activeYearlyTTDIdaily,
//       //klcc
//       activeMonthlyKLCCdaily,
//       activeQuarterlyKLCCdaily,
//       active4MonthlyKLCCdaily,
//       activeBiyearlyKLCCdaily,
//       activeYearlyKLCCdaily,

//       unpaidAll, unpaidTTDI, unpaidKLCC,
//       unpaid1MonthTTDI, unpaid1to3MonthTTDI, unpaid3MonthTTDI,
//       unpaid1MonthKLCC, unpaid1to3MonthKLCC, unpaid3MonthKLCC,
//       packageSaleMapVend,packageSaleMapAdyen, activeTTDICorpPkgMap, activeKLCCCorpPkgMap,
//       vendTextTTDI, vendTextKLCC, adyenTextTTDI, adyenTextKLCC, corpActiveTextTTDI, corpActiveTextKLCC,
//       packageMap, packageWithPaymentArray,
//     })
//     // .then(result=>{
//     //   console.log('addDailyTransactionToSlackMessage: ', result);
//     //   return request.post(
//     //     "https://hooks.slack.com/services/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",
//     //     {json:{
//     //       text:`Sales on ${moment().format('DD-MM-YYYY')} \n
//     //       active\n: 
//     //       complimentary: 25\n
//     //       monthly: 16\n
//     //       3M:212\n
//     //       `}
//     //     }
//     //   )
//     // }).catch(error=>{
//     //   console.log('addDailyTransactionToSlackError: ', error);

//     // });
//     // console.log('payments: ', payments);
//   });
// });

exports.addMTDnDTDBookingsToSlack = functions.https.onRequest((req, res) => {

    const bookingQuery = admin.firestore().collection('bookings').where('type', '==', 'babelExclusive').get();
    // all
    var ttdiAllBookingCount = 0;
    var ttdiAllConfirmBookingCount = 0;
    var ttdiAllPendingBookingCount = 0;
    var ttdiAllCancelBookingCount = 0;
    var ttdiAllCompleteBookingCount = 0;
    var klccAllBookingCount = 0;
    var klccAllConfirmBookingCount = 0;
    var klccAllPendingBookingCount = 0;
    var klccAllCancelBookingCount = 0;
    var klccAllCompleteBookingCount = 0;
    // monthly
    var ttdiMonthlyBookingCount = 0;
    var ttdiMonthlyConfirmBookingCount = 0;
    var ttdiMonthlyPendingBookingCount = 0;
    var ttdiMonthlyCancelBookingCount = 0;
    var ttdiMonthlyCompleteBookingCount = 0;
    var klccMonthlyBookingCount = 0;
    var klccMonthlyConfirmBookingCount = 0;
    var klccMonthlyPendingBookingCount = 0;
    var klccMonthlyCancelBookingCount = 0;
    var klccMonthlyCompleteBookingCount = 0;
    // daily
    var ttdiDailyBookingCount = 0;
    var ttdiDailyConfirmBookingCount = 0;
    var ttdiDailyPendingBookingCount = 0;
    var ttdiDailyCancelBookingCount = 0;
    var ttdiDailyCompleteBookingCount = 0;
    var klccDailyBookingCount = 0;
    var klccDailyConfirmBookingCount = 0;
    var klccDailyPendingBookingCount = 0;
    var klccDailyCancelBookingCount = 0;
    var klccDailyCompleteBookingCount = 0;

    return Promise.all([bookingQuery]).then(result=>{
        const bookingRes = result[0];
        bookingRes.forEach(doc=>{
            const data = doc.data();
            const status = data.status;
            const createdAt = data.createdAt;
            const location = data.location;
            const isConfirm = status && status === 'CONFIRM';
            const isPending = status && status === 'PENDING';
            const isCancel = status && status === 'CANCEL';

            if (location && location === 'TTDI'){
                ttdiAllBookingCount+=1;
                if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))
                    && moment(getTheDate(createdAt)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').endOf('month'))
                ){
                    ttdiMonthlyBookingCount+=1;
                    if (isConfirm){
                        ttdiMonthlyConfirmBookingCount+=1;
                    }
                    else if (isPending){
                        ttdiMonthlyPendingBookingCount+=1;
                    }
                    else if (isCancel){
                        ttdiMonthlyCancelBookingCount+=1;
                    }
                }
                if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))
                    && moment(getTheDate(createdAt)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').endOf('month'))
                ){
                    ttdiDailyBookingCount+=1;
                    if (isConfirm){
                        ttdiDailyConfirmBookingCount+=1;
                    }
                    else if (isPending){
                        ttdiDailyPendingBookingCount+=1;
                    }
                    else if (isCancel){
                        ttdiDailyCancelBookingCount+=1;
                    }
                }
                if (isConfirm){
                    ttdiAllConfirmBookingCount+=1;
                }
                else if (isPending){
                    ttdiAllPendingBookingCount+=1;
                }
                else if (isCancel){
                    ttdiAllCancelBookingCount+=1;
                }
            }
            else if (location && location === 'KLCC'){
                klccAllBookingCount+=1;
                if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('month'))
                    && moment(getTheDate(createdAt)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').endOf('month'))
                ){
                    klccMonthlyBookingCount+=1;
                    if (isConfirm){
                        klccMonthlyConfirmBookingCount+=1;
                    }
                    else if (isPending){
                        klccMonthlyPendingBookingCount+=1;
                    }
                    else if (isCancel){
                        klccMonthlyCancelBookingCount+=1;
                    }
                }
                if (createdAt && moment(getTheDate(createdAt)).isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))
                    && moment(getTheDate(createdAt)).isSameOrBefore(moment().tz('Asia/Kuala_Lumpur').endOf('day'))
                ){
                    klccDailyBookingCount+=1;
                    if (isConfirm){
                        klccDailyConfirmBookingCount+=1;
                    }
                    else if (isPending){
                        klccDailyPendingBookingCount+=1;
                    }
                    else if (isCancel){
                        klccDailyCancelBookingCount+=1;
                    }
                }
                if (isConfirm){
                    klccAllConfirmBookingCount+=1;
                }
                else if (isPending){
                    klccAllPendingBookingCount+=1;
                }
                else if (isCancel){
                    klccAllCancelBookingCount+=1;
                }
            }
           
        });

        request.post(
            "https://hooks.slack.com/services/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",
               {json:{
                blocks:[
                  {
                    "type": "divider"
                  },
                  {
                    "type": "header",
                    "text": {
                      "type": "plain_text",
                      "text": `Babel Bookings `,
                      "emoji": true
                    }
                  },
                  {
                    "type": "section",
                    "fields": [
                      {
                        "type": "mrkdwn",
                        "text": `All TTDI Bookings: ${ttdiAllBookingCount}\nCONFIRM:${ttdiAllConfirmBookingCount}\nPENDING:${ttdiAllPendingBookingCount}\nCANCEL:${ttdiAllCancelBookingCount}`,
                      },
                      {
                        "type": "mrkdwn",
                        "text": `All KLCC Bookings: ${klccAllBookingCount}\nCONFIRM:${klccAllConfirmBookingCount}\nPENDING:${klccAllPendingBookingCount}\nCANCEL:${klccAllCancelBookingCount}`,
                      },
                    ]
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "section",
                    "fields": [
                      {
                        "type": "mrkdwn",
                        "text": `Monthly TTDI Bookings: ${ttdiMonthlyBookingCount}\nCONFIRM:${ttdiMonthlyConfirmBookingCount}\nPENDING:${ttdiMonthlyPendingBookingCount}\nCANCEL:${ttdiMonthlyCancelBookingCount}`,
                      },
                      {
                        "type": "mrkdwn",
                        "text": `Monthly KLCC Bookings: ${klccMonthlyBookingCount}\nCONFIRM:${klccMonthlyConfirmBookingCount}\nPENDING:${klccMonthlyPendingBookingCount}\nCANCEL:${klccMonthlyCancelBookingCount}`,
                      },
                    ]
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "section",
                    "fields": [
                      {
                        "type": "mrkdwn",
                        "text": `Daily TTDI Bookings: ${ttdiDailyBookingCount}\nCONFIRM:${ttdiDailyConfirmBookingCount}\nPENDING:${ttdiDailyPendingBookingCount}\nCANCEL:${ttdiDailyCancelBookingCount}`,
                      },
                      {
                        "type": "mrkdwn",
                        "text": `Daily KLCC Bookings: ${klccDailyBookingCount}\nCONFIRM:${klccDailyConfirmBookingCount}\nPENDING:${klccDailyPendingBookingCount}\nCANCEL:${klccDailyCancelBookingCount}`,
                      },
                    ]
                  },
                  // {
                  //   "type": "section",
                  //   "fields": [
                  //     {
                  //       "type": "mrkdwn",
                  //       "text": `*Daily TTDI Movement*\n*Vend*\nMonthly Package(${monthlyPkgTTDICountDaily}):${toRM(monthlyPkgTTDITotalPriceDaily)}\n3M term package(${term3MTTDICountDaily}):${toRM(term3MTTDITotalPriceDaily)}\n6M term package(${term6MTTDICountDaily}):${toRM(term6MTTDITotalPriceDaily)}\n6M renewal(${renewal6MTTDICountDaily}):${toRM(renewal6MTTDITotalPriceDaily)}\n12M term(${term12MTTDICountDaily}):${toRM(term12MTTDITotalPriceDaily)}\n12M renewal(${renewal12MTTDICountDaily}):RM${toRM(renewal12MTTDITotalPriceDaily)}\nAugust Promo(${augustPromo3MPkgTTDICountDaily}):${toRM(augustPromo3MPkgTTDITotalPriceDaily)}\nMid Sept Promo(${midSepPromo3MPkgTTDICountDaily}):${toRM(midSepPromo3MPkgTTDITotalPriceDaily)}\nCorporate180(${CP180PkgTTDICountDaily}):${toRM(CP180PkgTTDITotalPriceDaily)}\nCorporate210(${CP210PkgTTDICountDaily}):${toRM(CP210PkgTTDITotalPriceDaily)}\nCorporate230(${CP230PkgTTDICountDaily}):${toRM(CP230PkgTTDITotalPriceDaily)}\n*Adyen*\nManual-Charge(${adyenCountManualChargeTTDIDaily}):${toRM(adyenTotalCollectionManualTTDIDaily)}\nAuto-Charge(${adyenCountAutoChargeTTDIDaily}):${toRM(adyenTotalCollectionAutoTTDIDaily)}|${toRM(adyenMaxPriceTTDIDaily)}\nFrozen(${freezeExecutedUniqueUserTTDICountDaily}):${freezeAddCountTTDIDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedTTDICountDaily}\nCancelled:${cancelExecutedTTDIToday}\nVisitors:${checkInVisitorCountTTDIToday}`,
                  //     },
                  //     {
                  //       "type": "mrkdwn",
                  //       "text": `*Daily KLCC Movement*\n*Vend*\nMonthly Package(${monthlyPkgKLCCCountDaily}):${toRM(monthlyPkgKLCCTotalPriceDaily)}\n3M term package(${term3MKLCCCountDaily}):${toRM(term3MKLCCTotalPriceDaily)}\n6M term package(${term6MKLCCCountDaily}):${toRM(term6MKLCCTotalPriceDaily)}\n12M term package(${term12MKLCCCountDaily}):RM${term12MKLCCTotalPriceDaily}\nAugust 2020 Promo(${augustPromo3MPkgKLCCCountDaily}):${toRM(augustPromo3MPkgKLCCTotalPriceDaily)}\nMid Sep Promo(${midSepPromo3MPkgKLCCCountDaily}):${toRM(midSepPromo3MPkgKLCCTotalPriceDaily)}\nUNO promo(${unoPromo4MPkgKLCCCountDaily}):${toRM(unoPromo4MPkgKLCCTotalPriceDaily)}\nCorporate290(${CP290PkgKLCCCountDaily}):${toRM(CP290PkgKLCCTotalPriceDaily)}\nCorporate310(${CP310PkgKLCCCountDaily}):${toRM(CP310PkgKLCCTotalPriceDaily)}\n*Adyen*\nManual-Charge(${adyenCountManualChargeKLCCDaily}):${toRM(adyenTotalCollectionManualKLCCDaily)}\nAuto-Charge(${adyenCountAutoChargeKLCCDaily}):${toRM(adyenTotalCollectionAutoKLCCDaily)}|${toRM(adyenMaxPriceKLCCDaily)}\nFrozen(${freezeExecutedUniqueUserKLCCCountDaily}):${freezeAddCountKLCCDaily} months\nFreeze Removed:${freezeExecutedUniqueUserRemovedKLCCCountDaily}\nCancelled:${cancelExecutedKLCCToday}\nVisitors:${checkInVisitorCountKLCCToday}`,
                  //     },
                  //   ]
                  // },
                  // {
                  //   "type": "divider"
                  // },
                  // {
                  //   "type": "section",
                  //   "fields": [
                  //     {
                  //       "type": "mrkdwn",
                  //       "text": `*MTD TTDI Movement*\nMTD Frozen(${freezeExecutedUniqueUserTTDICountMonthly}):${freezeAddCountTTDIMonthly} months\nMTD Canceled:${cancelExecutedTTDIThisMonth}\nMTD Unpaid:${unpaidTTDI}\nMTD Adyen\n-Renewals:`,
                  //     },
                  //     {
                  //       "type": "mrkdwn",
                  //       "text": `*MTD KLCC Movement*\nMTD Frozen(${freezeExecutedUniqueUserKLCCCountMonthly}):${freezeAddCountKLCCMonthly} months\nMTD Canceled:${cancelExecutedKLCCThisMonth}\nMTD Unpaid:${unpaidKLCC}\nMTD Adyen\nRenewals:`,
                  //     },
                  //   ]
                  // },
                ]
              }
            }
          )

        return res.status(200).send({
            success:true,
            ttdiAllBookingCount,
            ttdiMonthlyBookingCount,
            ttdiDailyBookingCount,
            klccAllBookingCount,
            klccMonthlyBookingCount,
            klccDailyBookingCount
        });
    });
});