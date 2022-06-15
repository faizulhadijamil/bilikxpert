  // import Firebase from "./actions";
  // import firebase from 'firebase/app';

  // import * as firebase from 'firebase';
  // import 'firebase/firestore';
  import firebase from 'firebase'
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, Avatar, Chip, Grid, Button, TextField, Typography} from '@material-ui/core';
  import React from 'react';
  import {getTheDate, getGantnerLogsByUId} from './actions'; 
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetCurrentUser,
    makeGetAllUsers,
    makeGetPaymentsMembersItems,
    makeGetInvoicesMembersItems,
    makeGetReferralsMembersItems,
    makeGetFreezeMemberItems,
    getAllFreezePayments,
    makeGetSelectedUserGantnerLogs,
    makeGetCurrentUserGantnerLogs,
    getPackagesList,
    makeGetExpiredMemberItems,
    makeGetCancelledMemberItems,
    getAllVendSales,
    getAllVendProducts,
    makeGetInGymKLCCItems,
    makeGetInGymTTDIItems,
    makeGetCnyRef,
    getFreezePayments
  } from './selectors'
  import * as Actions from './actions';
  import BabelLogo from './BabelLogo';
  import MenuAppBar from './MenuAppBar';
  import PersonCard from './PersonCard';
  import UserList from './UserList';
  import moment from 'moment';
  import { promises } from 'fs';
import { resolve } from 'path';
  
  // const { Storage } = require('@google-cloud/storage');
  // const storage = new Storage();
  var FileSaver = require('file-saver');

  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
    contentFirstRow: {
      maxWidth: 600,
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(8),
    },
    content: {
      maxWidth: 600,
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    search: {
      // marginTop: 64,
      marginTop: -48,
      marginBottom: 32,
      position: 'fixed',
      // top: 64,
      backgroundColor: '#fff',
      zIndex: 1200,
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      width: '90%',
      // alignItems: 'end'
      // borderRadius: 8,
      // padding: 8
    },
    selectedUser: {
      position: 'fixed',
      zIndex: 1200
    },
    title: {
      marginBottom: theme.spacing(1)
    },
    addButton: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#fde298",
      color: '#fff',
    },
    fileInput: {
      display: 'none'
    },
    fab: {
      position: 'fixed',
      bottom: 56 + theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1300
    },
    media: {
      minHeight: 32,
      backgroundColor: 'rgba(6,40,69,0.62)'
    },
    card: {
      marginTop: theme.spacing(8),
      marginRight: theme.spacing(3),
      overflow: 'hidden',
      // position:'fixed'
      // zIndex: 1200,
      // position: 'fixed',
      // maxWidth: 300
    },
  });
  
  const packagesList = [
    'q7SXXNKv83MkkJs8Ql0n', // yearly all clubs // 0
    'WmcQo1XVXehGaxhSNCKa', // yearly           // 1
    'VWEHvdhNVW0zL8ZAeXJX', // 1 year renewal   // 2
    'yQFACCzpS4DKcDyYftBx', // 3 mths           // 3
    'aTHIgscCxbwjDD8flTi3', // 3 mths all clubs // 4
    'duz1AkLuin8nOUd7r66L', // 6 mths           // 5
    '89THMCx0BybpSVJ1J8oz', // 6 mths all clubs // 6
    'DjeVJskpeZDdEGlcUlB1', // 6 mths renewal   // 7
    'yKLfNYOPzXHoAiknAT24', // complimentary    // 8
    'ZEDcEHZp3fKeQOkDxCH8', // CP 180           // 9
    'dz8SAwq99GWdEvHCKST2', // CP 210           // 10
    'wpUO5vxWmme7KITqSITo', // CP 230           // 11
    'BKcaoWGrWKYihS40MpGd', // CP 290           // 12
    'eRMTW6cQen6mcTJgKEvy', // CP 310           // 13
    'vf2jCUOEeDDiIQ0S42BJ', // Monthly          // 14
    'TJ7Fiqgrt6EHUhR5Sb2q', // Monthly All Clubs// 15
    'LNGWNSdm6kf4rz1ihj0i', // 3M Jan Promo Term (all club) // 16
    'k7As68CqGsFbKZh1Imo4',  // 3M Jan Promo Term (single) // 17
    'w12J3n9Qs6LTViI6HaEY' // 3m term single // 18
  ];

  const klccPackage = 
  [
  'q7SXXNKv83MkkJs8Ql0n', // 12m all clubs
  'TJ7Fiqgrt6EHUhR5Sb2q', // monthly all club
  'eRMTW6cQen6mcTJgKEvy', // CP310
  '89THMCx0BybpSVJ1J8oz', // 6M all clubs
  'BKcaoWGrWKYihS40MpGd', // CP290
  'aTHIgscCxbwjDD8flTi3', // 3M all clubs
  'LNGWNSdm6kf4rz1ihj0i', // 3M Jan2020 promo all clubs
  'YsOxVJGLRXrHDgNTBach', // 3M August 2020 (all access)
  'uQO2UsaRiqXtzPKjTSIS', // 3M UNO
  'kh513XOaG7eLX4z9G0Ft', // 3M September 2020 (All Access) Promo
];

const TTDIPackage = 
  [
  'vf2jCUOEeDDiIQ0S42BJ', // monthly
  'WmcQo1XVXehGaxhSNCKa', // yearly
  'VWEHvdhNVW0zL8ZAeXJX', // 12M term renewal
  'wpUO5vxWmme7KITqSITo', // CP230
  'w12J3n9Qs6LTViI6HaEY', // 3M term
  'ZEDcEHZp3fKeQOkDxCH8', // CP180
  'yQFACCzpS4DKcDyYftBx', // 3M term membership
  'DjeVJskpeZDdEGlcUlB1', // 6M term renewal
  'dz8SAwq99GWdEvHCKST2', // CP210
  'duz1AkLuin8nOUd7r66L', // 6M
  'k7As68CqGsFbKZh1Imo4', // 3M promo single club
  'AHgEEavKwpJoGTMOzUdX', // 3M August 2020 (single access)
  'hUZjGJR77bP30I3fjvwD', //3M Mid September 2020 (single access)
];

  class Report extends React.Component {
  
    state = {
      selectedUserId: null,
      search: '',
      searchDisplay: '',
      enableGenerateReportBtn:false,
      editData: {},
    }
  
    componentWillMount() {
      this.timer = null;
    }
  
    componentWillUnmount() {
      clearTimeout(this.timer);
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);
      

    }
  
    componentDidUpdate(prevProps) {
      if (this.props.userId !== prevProps.userId) {
        this.handleSelectPerson(this.props.userId);
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }
  
    handleSearch = name => event => {
      window.scrollTo(0, 0);
      this.setState({
        searchDisplay: event.target.value
      });
      clearTimeout(this.timer);
      event.persist();
      this.timer = setTimeout(() => {
        this.setState({
          search: event.target.value,
        });
      }, 250);
    }
  
    handleSelectPerson = (userId, viewPerson = false) => {
      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      if (!(isAdmin || isMC || isTrainer)) {
        return;
      }
      this.setState({
        selectedUserId: userId
      })
      this.props.actions.getInvoicesByUserId(userId);
      this.props.actions.getPaymentsByUserId(userId);
      const selectedUser = this.props.users.get(userId);
      const selectedUserRoles = selectedUser && selectedUser.get('roles');
      const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
      if(viewPerson || (window.innerWidth < window.innerHeight && !selectedUserIsTrainer && userId !== null)){
        this.props.actions.viewPerson(userId);
      }
      // // console.log(userId);
      // // this.props.actions.removeCardToRegister();
      // window.scrollTo(0, 0);
  
      // console.log(window.innerWidth, window.innerHeight);
    }
  
    handleClickSearchCloseIcon = () => {
      window.scrollTo(0, 0);
      this.setState({
        searchDisplay: ''
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({
          search: '',
        });
      }, 250);
    }
  
    handleDeleteInvoice = () => {
      // const timestamp = Firebase.firestore.FieldValue.serverTimestamp();
      // console.log('timestamp: ', timestamp)
    } 

    handleRemovePKPFreeze = () => {
     console.log('handleRemovePKPFreeze: ');
      const pkpFreezeQuery = firebase.firestore().collection('payments')
      .where('source', '==', 'freeze')
      // .where('freezeFor', '>=', moment('20200320').toDate())
      .where('freezeType', '==', 'specialFreezePKP2')
      .get();
      
      return Promise.all([pkpFreezeQuery]).then(results=>{
        var pkpPaymentRes = results[0];

        pkpPaymentRes && pkpPaymentRes.forEach((payment)=>{
          const data = payment.data();
          const createdAt = data && data.createdAt;
          const freezeFor = data && data.freezeFor;
          const freezeType = data && data.freezeType;

          // if(moment(getTheDate(freezeFor)) >= moment('20200320').toDate() && 
          //   moment(getTheDate(freezeFor)) <= moment('20200420').toDate()
          //   // && (freezeType !== 'specialFreeze')
          //   ){
          if (freezeType === 'specialFreezePKP2'){
            console.log('paymentData: ',  moment(getTheDate(freezeFor)).format('DDMMYYYY'));
            // console.log('paymentData: ', data);
            // console.log('paymentId: ', payment.id);
            firebase.firestore().collection('payments').doc(payment.id).delete().then(function(){
              console.log("Document successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing document: ", error);
            });
          }

        })
      })
    }

    handleRemoveUnPaidInvoice = () => {
      console.log('handleRemoveUnPaidInvoice: ');
       const unPaidInvoiceQuery = firebase.firestore().collection('invoices')
       .where('paid', '==', false)
       // .where('amount', '==', '0000000NaN00')
       // .where('freezeFor', '>=', moment('20200320').toDate())
       //.where('freezeType', '==', 'specialFreeze')
       .get();
       
       return Promise.all([unPaidInvoiceQuery]).then(results=>{
         var unpaidInvoiceRes = results[0];
 
         unpaidInvoiceRes && unpaidInvoiceRes.forEach((invoice)=>{
           const data = invoice.data();
           const createdAt = data && data.createdAt;
          const paid = data && data.paid;
          
           // console.log('invoiceData: ',  moment(getTheDate(createdAt)).format('DDMMYYYY'));

           if (invoice.id === 't4GfxM9RjxkmqNT9XqzG'){
             console.log('dont remove this: ', invoice.id);
           }
           else {
            firebase.firestore().collection('invoices').doc(invoice.id).delete().then(function(){
              console.log("Document successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing document: ", error);
            });
           }
         })
       })
     }

     handleViewKLCCSalesSubmit = () =>{
       // console.log('handleViewKLCCSalesSubmit: ');
      var theString=''; 
      var theDateString = '2021-04-28';
      // const vendSalesQuery = firebase.firestore().collection('vendSales').where('createdDay', '==', moment().tz('Asia/Kuala_Lumpur').startOf('day').format('YYYY-MM-DD')).get();
      const vendSalesQuery = firebase.firestore().collection('vendSales')
        .where('createdDay', '==', theDateString)
        .where('outlet_id', '==', '0af7b240-aba0-11e9-fb5b-b0907137b026') // klcc outlet
        .get();
      // const adyenPaymentQuery = firebase.firestore().collection('adyTransactions').get();
      const packageQuery = firebase.firestore().collection('packages').where('base', '==', 'KLCC').get();
      const paymentQuery = firebase.firestore().collection('payments').where('source', '==', 'adyen').get();

      var posObj = {};
      var posArray = [];
      // var posObjTemp = {};
      // to create 24hour obj
      for (var i=0; i<=23; i++){
        posObj[moment(theDateString).tz('Asia/Kuala_Lumpur').startOf('days').add(i, 'hour').format('YYYY-MM-DDTHH')] = {
          currentTime:moment(theDateString).tz('Asia/Kuala_Lumpur').startOf('days').add(i, 'hour'),
          machineId:71000010, 
          batchId:moment(theDateString).tz('Asia/Kuala_Lumpur').startOf('days').format('YYYYMMDD'),
          date:moment(theDateString).tz('Asia/Kuala_Lumpur').startOf('days').format('DDMMYYYY'),
          hour:moment(theDateString).tz('Asia/Kuala_Lumpur').startOf('days').add(i, 'hour').format('HH'),
          receiptCount:0, //default
          totalnetSales:'0.00', //before SST
          totalSST:'0.00',
          totalDiscount:'0.00',
          totalServiceCharge:'0.00',
          totalPax:0, // for F&B only
          totalCash:'0.00',
          totalTNG:'0.00',
          totalVisa:'0.00',
          totalMasterCard:'0.00',
          totalAmex:'0.00',
          totalVoucher:'0.00',
          totalOthers:'0.00',
          sstRegistered:'Y'
        };
        // posArray.push(posObjTemp);
      }
      
      return Promise.all([vendSalesQuery, paymentQuery, packageQuery]).then(results=>{
    
        const vendSaleRes = results[0];
        const paymentRes = results[1];
        const packageRes = results[2];
    
        var vendSaleMap = {};
        var vendSaleCountFB = 0; // vendsale count from firebase
        var finalString = 'saya';
        var finalArrayString = [];
        // console.log('vendSalesQuery: ', vendSaleRes);
        vendSaleRes.forEach((vendSale)=>{
          const data = vendSale.data();
          console.log('vendData: ', data);
          const status = data && data.status;
          const created_at = data && data.created_at;
          const createdTime = data && data.createdTime;
          const createdAtMalaysia = created_at && moment(created_at).tz('Asia/Kuala_Lumpur');
          const register_sale_payments = data && data.register_sale_payments;
          const payment_type = register_sale_payments && register_sale_payments[0] && register_sale_payments[0].payment_type;
          const payment_type_name = payment_type && payment_type.name;
          const totals = data && data.totals;
          const total_price = (totals && totals.total_price)? totals.total_price:0
          const total_tax = totals && totals.total_tax;
          const register_sale_products = data.register_sale_products;
          var total_discount = 0.0;
          // console.log('createdTime: ', createdTime);
          // console.log('totals: ', totals);
          console.log('total_price: ', total_price);

          register_sale_products && register_sale_products.forEach(prod=>{
            const discount = prod && prod.discount;
            const prodId = prod && prod.id;
            const price_total = prod && prod.price_total;

            if (discount && parseFloat(discount)>0){
              total_discount+=discount;
            }
            // for discount SKU
            if (prodId && prodId === 'd14ffa87-ea1c-ae38-11eb-92a9d8656e3e'){
              total_discount+=Math.abs(price_total);
            }
          });
    
          const outlet_id = data && data.outlet_id;
          const createdAtMalaysiaHour = createdAtMalaysia && createdAtMalaysia.add(8, 'hours').format('HH');
          // const createdAtMalaysiaHour = createdAtMalaysia && moment(created_at).format('HH');
          // console.log('vendSaleData: ', data);
          // for KLCC
          if (data && vendSale.id && (status && status!=='VOIDED') && (outlet_id === '0af7b240-aba0-11e9-fb5b-b0907137b026')){
            vendSaleCountFB += 1;
            vendSaleMap[vendSale.id] = data;
    

            Object.entries(posObj).forEach(([key,value]) => {
              const hourKey = moment(key).format('HH');
              // posObj[key].receiptCount = posObj[key].receiptCount + 1;
              // posObj[key].totalnetSales = posObj[key].totalnetSales + total_price;
    
              // if (createdAtMalaysia && createdAtMalaysia.isSameOrAfter(moment(key)) && createdAtMalaysia.add(1, 'hours').isBefore(moment(key))){
              // if (createdAtMalaysia && moment(key).isSameOrAfter(createdAtMalaysia) && moment(key).add(1, 'hours').isBefore(createdAtMalaysia)){
              if (createdAtMalaysia && (hourKey===createdAtMalaysiaHour)){
                posObj[key].receiptCount = posObj[key].receiptCount + 1;
                posObj[key].totalnetSales = parseFloat(parseFloat(posObj[key].totalnetSales) + parseFloat(total_price)).toFixed(2);
                posObj[key].totalSST = parseFloat(parseFloat(posObj[key].totalSST) + parseFloat(total_tax)).toFixed(2);
                posObj[key].totalDiscount = parseFloat(parseFloat(posObj[key].totalDiscount) + parseFloat(total_discount)).toFixed(2);
                
                if (payment_type_name && payment_type_name==='Cash'){
                  posObj[key].totalCash = parseFloat(parseFloat(posObj[key].totalCash) + parseFloat(total_price)).toFixed(2);
                }
                else if (payment_type_name && (payment_type_name.includes('Credit') || payment_type_name.includes('Debit'))){
                  posObj[key].totalVisa = parseFloat(parseFloat(posObj[key].totalVisa) + parseFloat(total_price)).toFixed(2);
                }
    
              }
            });
          }
        });
  
        var pkgMap = {};
        packageRes && packageRes.forEach(doc=>{
          pkgMap[doc.id]=doc.data();
        })
        // console.log('posObj: ', posObj);

        var adyenSaleMap = {};
        var adyenSaleCountFB = 0; // adyen count from firebase
        var adyenSaleArray = [];
    
        paymentRes && paymentRes.forEach(doc=>{
          // console.log('adyen payment');
          const data = doc.data();
          const createdAt = data && data.createdAt;
          const status = data && data.status;
          const totalPrice = data && data.totalPrice;
          const packageId = data && data.packageId;
          const packageData = packageId && pkgMap[packageId];
          const isKLCCPkg = packageData && (packageData.base === 'KLCC');
          const valueWithSST = totalPrice;
          const valueWithoutSST = valueWithSST && (valueWithSST/1.06);
          const paymentMethod = data && data.paymentType;
          const createdAtMalaysia = createdAt && moment(createdAt).tz('Asia/Kuala_Lumpur');
          const createdAtMalaysiaHour = createdAtMalaysia && createdAtMalaysia.format('HH');
          const sstTax = parseFloat(valueWithSST) - parseFloat(valueWithoutSST);

          if (status && status === 'CLOSED' && moment(getTheDate(createdAt)).isSameOrAfter(moment(theDateString)) 
            && isKLCCPkg
            && moment(getTheDate(createdAt)).isBefore(moment(theDateString).add(1,'day'))
          ){
            console.log('found adyen moment: ', moment(createdAt).format('DDMMYYYY'));
            console.log('found adyen hour: ', moment(createdAt).format('HH'));
            console.log('valueWithSST: ', valueWithSST);
            console.log('adyId: ', doc.id);

            Object.entries(posObj).forEach(([key,value]) => {
              const hourKey = moment(key).format('HH');
              // posObj[key].receiptCount = posObj[key].receiptCount + 1;
              // posObj[key].totalnetSales = posObj[key].totalnetSales + total_price;
    
              // if (createdAtMalaysia && createdAtMalaysia.isSameOrAfter(moment(key)) && createdAtMalaysia.add(1, 'hours').isBefore(moment(key))){
              // if (createdAtMalaysia && moment(key).isSameOrAfter(createdAtMalaysia) && moment(key).add(1, 'hours').isBefore(createdAtMalaysia)){
              if (createdAtMalaysia && (hourKey===createdAtMalaysiaHour)){
                posObj[key].receiptCount = posObj[key].receiptCount + 1;
                posObj[key].totalnetSales = (parseFloat(posObj[key].totalnetSales) + parseFloat(valueWithoutSST)).toFixed(2);
                posObj[key].totalSST = (parseFloat(posObj[key].totalSST) + parseFloat(sstTax)).toFixed(2);
                // for visa
                if(paymentMethod && paymentMethod === 'visa'){
                  posObj[key].totalVisa = (parseFloat(posObj[key].totalVisa) + parseFloat(valueWithoutSST)).toFixed(2);
                }
                // for mastercard
                else if(paymentMethod && paymentMethod === 'mc'){
                  posObj[key].totalMasterCard = (parseFloat(posObj[key].totalMasterCard) + parseFloat(valueWithoutSST)).toFixed(2);
                }
                // posObj[key].totalDiscount = parseFloat(posObj[key].totalDiscount) + parseFloat(total_discount);
                // if (payment_type_name && (payment_type_name.includes('Credit') || payment_type_name.includes('Debit'))){
                //   posObj[key].totalVisa = parseFloat(posObj[key].totalVisa) + parseFloat(total_price);
                // }
    
              }
            });
          }
          // else{
          //   console.log('no adyen payment found on this date');
          // }
          
        });
        // adyenRes && adyenRes.forEach(doc=>{
        //   const data = doc.data();
        //   const notificationItem = data.notificationItems && data.notificationItems.length > 0 && data.notificationItems[0];
        //   const notificationRequestItem = notificationItem && notificationItem.NotificationRequestItem;
        //   const pspReference = notificationRequestItem.pspReference;
        //   const invoiceId = notificationRequestItem.merchantReference;
        //   const eventCode = notificationRequestItem.eventCode;
        //   const eventDate = notificationRequestItem.eventDate;
        //   const success = notificationRequestItem.success;
        //   const reason = notificationRequestItem.reason;
        //   const amount = notificationRequestItem.amount;
        //   const valueWithSST = amount && amount.value && ((amount.value)/100);
        //   const valueWithoutSST = valueWithSST && (valueWithSST/1.06);
        //   const sstTax = parseFloat(valueWithSST) - parseFloat(valueWithoutSST);
        //   const additionalData = notificationRequestItem && notificationRequestItem.additionalData;
        //   const createdAt = eventDate;
        //   const createdAtMalaysia = createdAt && moment(createdAt).tz('Asia/Kuala_Lumpur');
        //   const createdAtMalaysiaHour = createdAtMalaysia && createdAtMalaysia.format('HH');
        //   const paymentMethod = notificationRequestItem.paymentMethod;
         
        //   // if(createdAtMalaysia && success && moment(createdAt).tz('Asia/Kuala_Lumpur').isBefore(moment(theDateString))) {
        //   //   console.log('found adyen');
        //   // }

        //   if(success && (success === 'true') && createdAt && moment(createdAt).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment(theDateString).tz('Asia/Kuala_lumpur').startOf('day'))
        //     // && moment(createdAt).tz('Asia/Kuala_Lumpur').isBefore(moment(theDateString).add(2, 'day').startOf('day'))
        //   ){
        //   // if(success && createdAt && moment(createdAt).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur').startOf('day'))){
        //     console.log('found adyen moment: ', moment(createdAt).format('DDMMYYYY'));
        //     console.log('found adyen hour: ', moment(createdAt).format('HH'));
        //     console.log('valueWithSST: ', valueWithSST);
        //     console.log('adyId: ', doc.id);
        //     adyenSaleCountFB+=1;
        //     adyenSaleMap = notificationRequestItem;

        //     // adyenSaleArray.push
        //     Object.entries(posObj).forEach(([key,value]) => {
        //       const hourKey = moment(key).format('HH');
        //       // posObj[key].receiptCount = posObj[key].receiptCount + 1;
        //       // posObj[key].totalnetSales = posObj[key].totalnetSales + total_price;
    
        //       // if (createdAtMalaysia && createdAtMalaysia.isSameOrAfter(moment(key)) && createdAtMalaysia.add(1, 'hours').isBefore(moment(key))){
        //       // if (createdAtMalaysia && moment(key).isSameOrAfter(createdAtMalaysia) && moment(key).add(1, 'hours').isBefore(createdAtMalaysia)){
        //       if (createdAtMalaysia && (hourKey===createdAtMalaysiaHour)){
        //         posObj[key].receiptCount = posObj[key].receiptCount + 1;
        //         posObj[key].totalnetSales = (parseFloat(posObj[key].totalnetSales) + parseFloat(valueWithoutSST)).toFixed(2);
        //         posObj[key].totalSST = (parseFloat(posObj[key].totalSST) + parseFloat(sstTax)).toFixed(2);
        //         // for visa
        //         if(paymentMethod && paymentMethod === 'visa'){
        //           posObj[key].totalVisa = (parseFloat(posObj[key].totalVisa) + parseFloat(valueWithoutSST)).toFixed(2);
        //         }
        //         // for mastercard
        //         else if(paymentMethod && paymentMethod === 'mc'){
        //           posObj[key].totalMasterCard = (parseFloat(posObj[key].totalMasterCard) + parseFloat(valueWithoutSST)).toFixed(2);
        //         }
        //         // posObj[key].totalDiscount = parseFloat(posObj[key].totalDiscount) + parseFloat(total_discount);
        //         // if (payment_type_name && (payment_type_name.includes('Credit') || payment_type_name.includes('Debit'))){
        //         //   posObj[key].totalVisa = parseFloat(posObj[key].totalVisa) + parseFloat(total_price);
        //         // }
    
        //       }
        //     });
        //   }
        //   // else{
        //   //   console.log('not found adyen');
        //   // }
        // });
    
        // adyenSaleMap && adyenSaleMap
        Object.fromEntries(Object.entries(posObj).sort());
        Object.entries(posObj).forEach(([key,value]) => {
          const hourKey = moment(key).format('HH');
          theString = `${value.machineId}|${value.batchId}|${value.date}|${value.hour}|${value.receiptCount}|${value.totalnetSales}|${value.totalSST}|${value.totalDiscount}|${value.totalServiceCharge}|${value.totalPax}|${value.totalCash}|${value.totalTNG}|${value.totalVisa}|${value.totalMasterCard}|${value.totalAmex}|${value.totalVoucher}|${value.totalOthers}|${value.sstRegistered}`;
          // finalString.concat(`${value.machineId} | ${value.batchId} | ${value.date} | ${value.hour} | ${value.receiptCount} | ${value.totalnetSales} | ${value.totalSST} | ${value.totalDiscount} | ${value.totalServiceCharge} | ${value.totalPax} | ${value.totalCash} | ${value.totalTNG} | ${value.totalVisa} | ${value.totalMasterCard} | ${value.totalAmex} | ${value.totalVoucher} | ${value.totalOthers} | ${value.sstRegistered}` + "\n");
          finalString = [theString];
          finalArrayString.push(finalString);
        });

        // console.log('klccSales: ', finalArrayString);
        var textoDownload = finalArrayString.join("\n");
        console.log("textoDownload", textoDownload);

        // var blob = new Blob(textoDownload, {type: "text/plain;charset=utf-8"});
        var blob = new Blob([textoDownload], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `H71000010_${moment(theDateString).format('YYYYMMDD')}`); 
       
      });

     }

     handleViewGantner = () => {
      const {users, packages} = this.props;

      const startDate = moment('20200901')
      const endDate = moment('20200925')
      this.setState({isLoading:true});
   
      // console.log('theusers: ', users);
      var UserArray = [];

      const theUsers = users && users.filter((user, id)=>{
          const packageGroup = user.get('packageGroup')||null;
          const userEmail = user.get('email')||null;
          const userName = user.get('name')||null;
          const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
          if ((userEmail && userEmail.includes('@bfm')) || packageGroup==='BFM'){
            UserArray.push({
                  userId: id,
                  name:userName,
                  email:userEmail,
                  memberEndDate
              })
              return true;
          }
      });

      console.log('theUsers: ', theUsers);
      console.log('UserArray: ', UserArray);

      var gantnerData = [];
      var BFMGantnerArray = [];
      var BFMNoVisitsRecord = [];
      var userVisitItem = [];

      // get gantnerLogs for each user
      UserArray.forEach((user, index)=>{
          const userId = user.userId||null;
          const userData = users.get(userId)||null;
          // console.log('user.memberEndate: ', moment(getTheDate(user.memberEndDate)).format('DD MM YYYY'));
          const paidStatus = user.memberEndDate? moment(getTheDate(user.memberEndDate)).isSameOrAfter(endDate)? 'PAID':'UNPAID':'UNPAID';
          const terminatedStatus = userData? userData.get('cancellationDate')? 'TERMINATED':null:null;

          const userGantnerLogs = firebase.firestore().collection('gantnerLogs').where("userId", "==", userId)
              .where("createdAt", ">=", startDate)
              .where("createdAt", "<=", endDate)
              .orderBy('createdAt')
              .get();
          var checkInCount = 0;
          userGantnerLogs.then((querySnapshot)=>{
            if (querySnapshot.empty){
              console.log('no visit found!');
              BFMNoVisitsRecord.push({
                key:userId,
                userId:userId, 
                name:user.name, 
                email:user.email,
                checkInCount:0, 
                dateWithFormat:null,
                checkIn:null,
                checkInFormat:null,
                checkOut:null,
                checkOutFormat:null,
                status:terminatedStatus? terminatedStatus:paidStatus,
                visitFound:false,
              });
            }
            else{
              querySnapshot.forEach(doc=>{
                // console.log(doc.id, '=>', doc.data());
                const data = doc.data();
                gantnerData.push(doc.data());
                const createdAt = data.createdAt;
                if (createdAt) {
                    if (BFMGantnerArray.length>=1 && BFMGantnerArray[BFMGantnerArray.length-1].checkIn && moment(getTheDate(BFMGantnerArray[BFMGantnerArray.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')){
                        // console.log('contains check out');
                        // BFMGantnerArray.pop();
                        BFMGantnerArray[BFMGantnerArray.length-1].checkOut = createdAt;
                        BFMGantnerArray[BFMGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
                    }
                    else{
                        checkInCount = checkInCount + 1;
                        BFMGantnerArray.push({
                            userId:userId, 
                            name:user.name, 
                            email:user.email,
                            checkInCount, 
                            dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
                            checkIn:createdAt,
                            checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
                            checkOut:null,
                            checkOutFormat:null,
                            status:terminatedStatus? terminatedStatus:paidStatus,
                            visitFound:true
                        });
                    }
                }
              });
            } 
            this.setState({gantnerData:BFMGantnerArray, noVisitData:BFMNoVisitsRecord, isLoading:false, showDownloadBtn:true});
          }).catch(function (error) {
              // this.setState({ gantnerData: null });
              console.log("Error getting document:", error);
          });
      });
      // const gantnerQuery = firebase.firestore().collection('gantnerLogs')
      // .where('authorized', '==', true)
      // .where('createdAt', '>=', moment('20200601').startOf('day').toDate())
      // .get();

      // var gantnerArray = [];
      // var usersArray = [];
      // var gantnerObj = {};

      // return Promise.all([gantnerQuery]).then(results=>{
      //   const gantnerRes = results[0];
      //   gantnerRes && gantnerRes.forEach(gantnerLog => {
      //     const data = gantnerLog.data();
      //     const cardNumber = data && data.cardNumber;
      //     const createdAt = data && data.createdAt;
      //     const userId = data && data.userId;
      //     if (userId){
      //       // console.log('cardNumber: ', cardNumber);
      //       gantnerObj[userId]=data;
      //     }
         
      //     // if(createdAt>=moment().subtract(2, 'days').toDate()){
      //     //    console.log('cardNumber: ', cardNumber);
      //     // }
         
      //     // const data = freezePayment.data();
      //     // const createdAt = data && data.createdAt;
      //     // const type = data && data.type;
      //     // const userId = data && data.userId;
      //     // const userData = users.get(userId)||null;
      //     // const email = userData? userData.get('email'):null;
      //     // const packageId = data && data.packageId;
      //     // const packageData = packages.get(packageId)||null;
      //     // const packageName = packageData? packageData.get('name') : null;
      //     // const quantity = data && data.quantity;
      //     // const totalPrice = data && data.totalPrice;

      //     // // for promojan2020
      //     // const promoJan2020 = data && (data.promoJan2020? data.promoJan2020:null);
         
      //     // invoicesArray.push({
      //     //   createdAt: moment(getTheDate(createdAt)).format('YYYYMMDD'), 
      //     //   type, userId, email, packageId, packageName,
      //     //   quantity, totalPrice, promoJan2020
      //     // });
        
      //   });

      //   console.log('gantnerObj: ', gantnerObj);

      //   users && users.forEach((v, k)=>{
      //     const remarks = v.get('remarks') || null;
      //     const cancelDate = v.get('cancellationDate')||null;
      //     const cancelReason = v.get('cancellationReason')||null;
      //     const userStartDate = v.get('autoMembershipStarts')||null
      //     const userEndDate = v.get('autoMembershipEnds') || null;
      //     const name = v.get('name')||null;
          
      //     const gantnerData = gantnerObj[k];
      //     usersArray.push()
         
      //   });

      //   console.log('gantnerArray: ', gantnerArray);
        // var blob = new Blob([this.ConvertToCSV(invoicesArray)], {type: "text/plain;charset=utf-8"});
        // FileSaver.saveAs(blob, "invoicesArray.csv");

     //  });
    }
    
    handleUploadExerciseToFB = () => {

      var reader = new FileReader();

    }

    handleViewCV19submit = () => {

      const {users, packages} = this.props;
      const cv19FormQuery = firebase.firestore().collection('CV19Forms').get();

      var cvformArray = [];

      return Promise.all([cv19FormQuery]).then(results => {
        const cv19Res = results[0];

        cv19Res && cv19Res.forEach(res=>{
          const data = res.data();
          const CV19Agree = data && data.CV19Agree;
          const CV19CloseContact = data && data.CV19CloseContact;
          const travelToWithinCountry = data && data.travelToWithinCountry;
          const createdAt = data && data.createdAt;
          const userId = data && data.userId;
          const userData = users.get(userId)||null;
          const email = userData? userData.get('email'):null;
          const name = userData? userData.get('name'):null;

          cvformArray.push({
            createdAt: moment(getTheDate(createdAt)).format('YYYYMMDD'), 
            CV19Agree, CV19CloseContact, travelToWithinCountry, userId, email, name
          })          
        });
        
        console.log('cvformArray: ', cvformArray);
        var blob = new Blob([this.ConvertToCSV(cvformArray)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "cvformArray.csv");

      });
    }

    handleViewUnPaidInvoice = () => {
      const {users, packages} = this.props;
      const unpaidInvoiceQuery = firebase.firestore().collection('invoices')
      .where('paid', '==', false).get();

      var invoicesArray = [];

      return Promise.all([unpaidInvoiceQuery]).then(results=>{
        const unpaidInvoiceRes = results[0];
        unpaidInvoiceRes && unpaidInvoiceRes.forEach(freezePayment => {
          const data = freezePayment.data();
          const createdAt = data && data.createdAt;
          const type = data && data.type;
          const userId = data && data.userId;
          const userData = users.get(userId)||null;
          const email = userData? userData.get('email'):null;
          const packageId = data && data.packageId;
          const packageData = packages.get(packageId)||null;
          const packageName = packageData? packageData.get('name') : null;
          const quantity = data && data.quantity;
          const totalPrice = data && data.totalPrice;

          // for promojan2020
          const promoJan2020 = data && (data.promoJan2020? data.promoJan2020:null);
         
          invoicesArray.push({
            createdAt: moment(getTheDate(createdAt)).format('YYYYMMDD'), 
            type, userId, email, packageId, packageName,
            quantity, totalPrice, promoJan2020
          });
        
        });

        console.log('invoicesArray: ', invoicesArray);
        var blob = new Blob([this.ConvertToCSV(invoicesArray)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "invoicesArray.csv");

      });
    }

    handleViewFreeze = () => {
      const freezePaymentQuery = firebase.firestore().collection('payments')
      .where('source', '==', 'freeze').get();

      var freezeArray = [];

      return Promise.all([freezePaymentQuery]).then(results=>{
        const freezeRes = results[0];
        freezeRes && freezeRes.forEach(freezePayment => {
          const data = freezePayment.data();
          const createdAt = data && data.createdAt;
          const freezeFor = data && data.freezeFor;
          const freezeType = data && data.freezeType;
          const type = data && data.type;
          const userId = data && data.userId;
  
          if (freezeFor && (moment(getTheDate(freezeFor)) >= moment('20200316').toDate())){
            freezeArray.push({
             createdAt: moment(getTheDate(createdAt)).format('YYYYMMDD'), 
             freezeFor: moment(getTheDate(freezeFor)).format('YYYYMMDD'),
             freezeType, 
             type, userId
            });
          }
        });

        console.log('freezeArray: ', freezeArray);
        var blob = new Blob([this.ConvertToCSV(freezeArray)], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "freezeArray.csv");

      });

      // const {freezePayment} = this.props;
      // console.log('freezePayment: ', freezePayment);
      // freezePayment && freezePayment.forEach(freezePayment => {
      //   console.log('freezePayment: ', freezePayment);
      // });
      // console.log('handleViewFreeze: ', usersWithPayment);
      // usersWithPayment && usersWithPayment.forEach(payment => {
      //   const data = payment.data();
      //   console.log('freezeData: ', data);
      //   const source = data && data.source;
      //   const freezeFor = data && data.freezeFor;
      //   if (freezeFor){
      //     console.log('freezeFor: ', freezeFor);
      //   }
      // });
    }

    handleViewAllRemarksUser = () => {
      console.log('search for all remark users');
      const users = this.props.users || null;
      const userWithRemark = [];
      var userData = null;
      // console.log('themomentDate: ', moment('2019-11-13'));
      var userData = null;
      users && users.forEach((v, k)=>{
        const remarks = v.get('remarks') || null;
        const cancelDate = v.get('cancellationDate')||null;
        const cancelReason = v.get('cancellationReason')||null;
        const userStartDate = v.get('autoMembershipStarts')||null
        const userEndDate = v.get('autoMembershipEnds') || null;
        const name = v.get('name')||null;

        if (remarks){
          userData = users.get(k);

          userWithRemark.push({
            email:userData.get('email'),
            name,
            userStartDate: moment(getTheDate(userStartDate)).format('DD-MM-YYYY'),
            userEndDate: moment(getTheDate(userEndDate)).format('DD-MM-YYYY'),
            cancelDate: cancelDate? moment(getTheDate(cancelDate)).format('DD-MM-YYYY'):null,
            cancelReason,
            remarks
          });
        }
      });

      console.log('userWithRemark: ', userWithRemark);
      var blob = new Blob([this.ConvertToCSV(userWithRemark)], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allRemarkUser.csv");
    }

    handleViewAllTerminatedUser = () => {
      console.log('search for all terminated users');
      const users = this.props.users || null;
      const terminatedUser = [];
      var userData = null;
      users && users.forEach((v, k)=>{
        const cancelDate = v.get('cancellationDate')||null;
        const cancelReason = v.get('cancellationReason')||null;
        const userStartDate = v.get('autoMembershipStarts')||null
        const userEndDate = v.get('autoMembershipEnds') || null;
        const name = v.get('name')||null;
        const remarks = v.get('remarks') || null;

        if (cancelDate || cancelReason){
          userData = users.get(k);

          terminatedUser.push({
            email:userData.get('email'),
            name,
            userStartDate: moment(getTheDate(userStartDate)).format('DD-MM-YYYY'),
            userEndDate: moment(getTheDate(userEndDate)).format('DD-MM-YYYY'),
            cancelDate: cancelDate? moment(getTheDate(cancelDate)).format('DD-MM-YYYY'):null,
            cancelReason,
            remarks
          });
        }
      });

      console.log('terminatedUser: ', terminatedUser);
      var blob = new Blob([this.ConvertToCSV(terminatedUser)], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allTerminatedUser.csv");
    }

    generateAllAdyenPaymentReport = () => {
        const usersWithPayment = this.props.usersWithPayment||null;
        const users = this.props.users || null;
        var allAdyenReport = [];
        
        console.log('generateAllAdyenPaymentReport: ', this.state);
        const startDateAllAdyen = this.state.editData.allAdyenStartDate || null;
        const endDateAllAdyen = this.state.editData.allAdyenEndDate || null;

        if (startDateAllAdyen && endDateAllAdyen){
          const adyenPayment = usersWithPayment && usersWithPayment.filter((v,k)=>{
            const isAdyenPayment = v.get('source')? (v.get('source') === 'adyen')?true:false:false; 
            const isPaymentSuccess = v.get('status')? (v.get('status')==='CLOSED')?true:false:false;
            const dateCreated = v.get('createdAt')||null;
            const isValidDate = dateCreated && moment(getTheDate(dateCreated)).isBetween(moment(this.state.editData.allAdyenStartDate), moment(this.state.editData.allAdyenEndDate))
            //if (isAdyenPayment && isPaymentSuccess && isValidDate){
            if (isPaymentSuccess && isValidDate){
                // console.log('usersWithPayment: ', v.get('createdAt'));
                return true;
            }
        });

        adyenPayment && adyenPayment.forEach((a,b)=>{
            const userId = a.get('userId') || null;
            const userData = users.get(userId)||null;
            const email = userData? userData.get('email'):null;
            const name = userData? userData.get('name'):null;
            const totalPrice = a.get('totalPrice') || null;
            const productName = a.get('productName') || null;
            const quantity = a.get('quantity')||1;
            const invoiceId = a.get('invoiceId')||null;
            const type = a.get('type')||null;
            const detailName = a.get('detailName')||null;
            const dateCreated = a.get('createdAt')||null;
            const theDateCreated = dateCreated? moment(getTheDate(dateCreated)).format('DD MMM YYYY'):null
            const source = a.get('source')||null;

            allAdyenReport.push({
                theDateCreated,
                email,
                name,
                detailName,
                productName,
                type,
                quantity,
                invoiceId:'https://app.babel.fit/payments/'+invoiceId,
                totalPrice,
                source
            })
        });
        console.log('allAdyenReport: ', allAdyenReport);
        var theCSVformat = this.ConvertToCSV(allAdyenReport);
        var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "allAdyenReport.csv");
        }
        else{
          console.log('no startdate or enddate');
        }
    }

    handleGenBFMReport = () => {
     
      const startDateBFMMember = this.state.editData.BFMStartDate || null;
      const endDateBFMMember = this.state.editData.BFMEndDate || null;
     
      console.log('handleGenBFMReportStart: ', startDateBFMMember);
      console.log('handleGenBFMReportEnd: ', endDateBFMMember);

      const users = this.props.users || null;

      this.props.actions.getGantnerLogsByUserId('13AthW5HDAczlK16op5ncOKLQgh1');

      console.log('handleGenBFMReport: ', this.props.selectedUserGanterLogs);
      
      // const selectedUserGanterLogs = this.props.selectedUserGanterLogs ? this.props.selectedUserGanterLogs.sort((a, b) => {
      //   const nameA = a.get('createdAt');
      //   const nameB = b.get('createdAt');
      //   if (nameA < nameB) {
      //     return -1;
      //   }
      //   if (nameA > nameB) {
      //     return 1;
      //   }

      //   return 0;

      // }) : null;

      

    }

    handleViewAllUser = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      var sortedUser = null;

      var userArray = [];
      var duplicateData = [];

      if(users && users.size > 0){
       
        // sortedUser = users.sort((a,b)=>a.get('vendCustomerId').localCompare(b.get('vendCustomerId')));
        // sortedUser = users.sort((a,b) => (a.get('vendCustomerId') > b.get('vendCustomerId')) ? 1 : ((b.get('vendCustomerId') > a.get('vendCustomerId')) ? -1 : 0)); 
        sortedUser = users.sort((a,b)=>{
          const aName = a.get('vendCustomerId');
          const bName = b.get('vendCustomerId');
          if (aName < bName) return -1;
          if (aName > bName) return 1; 
          // if (aName === bName){
          //   console.log('duplicateVend: ', aName);
          //   // const email = a.get('email')||null;
          //   // const name = a.get('name')||null;
          //   // const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
          //   // const startDateFormat = startDate && moment(getTheDate(startDate)).format('DD MM YYYY');
          //   // const packageId = a.get('packageId') || null;
          //   // const packageData = packages.get(packageId)||null;
          //   // const packageName = packageData? packageData.get('name') : null;
          //   // const phoneNumber = a.get('phone')||null;
          //   // const vendCustomerId = a.get('vendCustomerId') || null;

          //   // duplicateData.push({
          //   //   // userId:b,
          //   //   userId: a.id,
          //   //   email,
          //   //   name,
          //   //   startDateFormat,
          //   //   packageName,
          //   //   phoneNumber,
          //   //   vendCustomerId
          //   // });

          // }
          return 0;
        });
      };

      if (sortedUser && sortedUser.size > 0){
        sortedUser && sortedUser.forEach((a,b)=>{
          const email = a.get('email')||null;
          const name = a.get('name')||null;
          const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
          const startDateFormat = startDate && moment(getTheDate(startDate)).format('DD MM YYYY');
          const packageId = a.get('packageId') || null;
          // const packageData = packages.get(packageId)||null;
          // const packageName = packageData? packageData.get('name') : null;
          const phoneNumber = a.get('phone')||null;
          const vendCustomerId = a.get('vendCustomerId') || null;
          const createdAt = a.get('createdAt') || null;
          const createdAtString = createdAt? moment(getTheDate(createdAt)).format('YYYYMMDD'): 'none';
  
          //if (vendCustomerId){
            userArray.push({
              createdAtString,
              email,
              name,
              startDateFormat,
              // packageName,
              phoneNumber,
              vendCustomerId
            })
          //}
        });
      }
     
      // userArray && userArray.forEach((a,b)=>{

      // });

      console.log('userArray: ', userArray);
      var theCSVformat = this.ConvertToCSV(userArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allUsersReport.csv");
      
      // console.log('userArray: ', userArray);
      // var theCSVformat = this.ConvertToCSV(duplicateData);
      // var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "allDuplicateUsersReport.csv");
    }

    handleViewContactReport = () =>{
      const users = this.props.users || null;
      const packages = this.props.packages || null;

      var userArray = [];
      const filteredUsers = users && users.forEach((a,b)=>{
        const email = a.get('email')||null;
        const name = a.get('name')||null;
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const startDateFormat = startDate && moment(getTheDate(startDate)).format('DD MM YYYY');
        const packageId = a.get('packageId') || null;
        // const packageData = packageId? packages.get(packageId):null;
        const packageData = packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const phoneNumber = a.get('phone')||null;

        if (email && packageName){
          userArray.push({
            email,
            name,
            startDateFormat,
            packageName,
            phoneNumber
          })
        }
      });
      console.log('userArray: ', userArray);
      var theCSVformat = this.ConvertToCSV(userArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allUserReport.csv");

    };

    handleViewFinanceIndividualReport = () => {

      const users = this.props.users || null;
      const vendSales = this.props.vendSales || null;
      const usersWithPayment = this.props.usersWithPayment || null;

      const startDate = '20180101';
      const startMoment = moment(startDate);
      const endMoment = moment('20191231');
      var addMonths = 0;

      var monthsDiff = Math.max(moment(endMoment).diff(startMoment, 'months'));
      var theDateArray = [];
      var theFinalArray = [];

      for (var i=0; i<=monthsDiff; i++){
        const iterationStartMoment = startMoment.clone().add(addMonths, 'months');
        addMonths++;
        //console.log('iterationStartMoment: ', iterationStartMoment);
        theDateArray.push({iterationStartMoment, monthYear: iterationStartMoment.format('MMM YYYY')});
      }

      console.log('theDateArray: ', theDateArray);
      
      // filetered the payment if source not equal vend
      // const paymentsWithoutVend = usersWithPayment && usersWithPayment.filter((c,d)=>{return ((c.get('source')? c.get('source')==='vend'? false:true:true))})

      // activeUsers && activeUsers.forEach((a,b)=>{
      //   const name = a.get('name')||null;
      //   theFinalArray.push({
      //     name,
      //     theDateArray,
      //   })
      // })

      // console.log('theFinalArray: ', theFinalArray);
      // paymentsWithoutVend && paymentsWithoutVend.forEach((a,b)=>{

      // });

      var theCSVformat = this.ConvertToCSV(theFinalArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "eachUserFinanceReport.csv");

    };

    // manually modify the vendsale
    modifyTheVendSale = () => {
      const vendSalesQuery = firebase.firestore().collection('vendSales')
      .where('updated', '==', true)
      .get();

      return Promise.all([vendSalesQuery]).then(result=>{
        const vendSaleRes = result[0];

         var batch = firebase.firestore().batch();
        var updateCount = 0;
        // console.log('testMoment: ', moment('2018-01-08T02:14:36+00:00').format('YYYY-MM-DD'));

        vendSaleRes && vendSaleRes.forEach(doc=>{
          const data = doc.data();
          const created_at = data && data.created_at;
          const updated = data && data.updated;
          const register_sale_products = data && data.register_sale_products;
          const id = data.id;
          var vendProductArray = [];
          var containTheSelectedProduct = false;
          const updated2 = data && data.updated2;

          if (!updated2){
            register_sale_products && register_sale_products.forEach((item)=>{
              const vendProductId = item.product_id;
              if (vendProductId === '0af7b240-aba0-11e7-eddc-dbd880f58a4f'){
                console.log(`updating the vendsales ${doc.id}`);
                updateCount += 1;
                // vendProductArray.pus
                // containTheSelectedProduct = true;
                firebase.firestore().collection('vendSales').doc(doc.id).update({updated2:true}).then(()=>{console.log(`${doc.id} is now updated`)});
              }
            });
          }
        
          // const vendProductId = data && data.register_sale_products[0].;

          // if (updated && vendProductId && (vendProductId === '98f9aab1-1c0b-1673-52e5-d9216a84b509')){
          //   firebase.firestore().collection('vendSales').doc(doc.id).update({updated2:true});
          // }
          // console.log('theCreatedAt: ', moment(created_at).format('YYYY-MM-DD'));

          // if (updated && created_at && moment(created_at).isSameOrBefore(moment('2020-03-31')) && moment(getTheDate(created_at)).isSameOrAfter(moment('2020-03-01'))){
          //   console.log('thevendpayment: ', data);
          //   firebase.firestore().collection('vendSales').doc(doc.id).update({updated:true});
          //   if (updateCount>=499){
          //     batch.commit();
          //     updateCount = 0;
          //     batch = firebase.firestore().batch();
          //   }
          //   updateCount += 1;
          // }
        });

        if (updateCount>0){
          return batch.commit().then(()=>{
              console.log('updating payment data');
          }).catch((error)=>{
            console.log('error batch: ', error);
          });
        }
        else{
          console.log('payment is already updated')
        }
      });
    }

    removeAllPaymentsFromVend = () => {
      const paymentsQuery = firebase.firestore().collection('payments')
        .where('source', '==', 'vend')
        .where('type', '==', 'membership')
        // .where('packageId', '==', 'yQFACCzpS4DKcDyYftBx') // 3-Month Term Membership (Single Access)
        // .where('manualAdd', '==', true)
        // .where('vendSaleId', '==', '111dcd7e-ccdd-af4d-11ea-2ba1e8b51f0c')
        // .limit(10)
        .get();
      // const vend

      const packagesQuery = firebase.firestore().collection('packages').where('type', '==', 'corp').get();
         
        return Promise.all([paymentsQuery, packagesQuery]).then(result=>{
          console.log('starting.....');
          const paymentResult = result[0];
          const packagesResult = result[1];

          var batch = firebase.firestore().batch();
          var paymentCount = 0;

          var packageMap = {};

          packagesResult && packagesResult.forEach(doc=>{
            const data = doc.data();
            packageMap[doc.id] = data;
          });

          paymentResult && paymentResult.forEach(doc=>{
            const data = doc.data();
            const source = data && data.source;
            const createdAt = data && data.createdAt;
            const status = data && data.status;
            const freezeFor = data && data.freezeFor;
            const vendSaleId = data && data.vendSaleId;
            const vendProductId = data && data.vendProductId;
            const totalPrice = data && data.totalPrice;
            const manualAdd = data && data.manualAdd;
            const packageId = data && data.packageId;
            const packageData = packageId && packageMap[packageId];
            const packageType = packageData && packageData.type;

            // console.log('theData: ', data);
            if (!freezeFor && vendSaleId && !manualAdd
              && moment(getTheDate(createdAt)).isSameOrBefore(moment('2018-05-31')) && moment(getTheDate(createdAt)).isSameOrAfter(moment('2018-05-01'))
                // && ((totalPrice === '0') || totalPrice === 0)
                // && (packageId === 'vf2jCUOEeDDiIQ0S42BJ')
                // && (status === 'CLOSED')
                // && (vendProductId === '0af7b240-aba0-11e7-eddc-dbd880e1f8d5')
                // && (packageType === 'corp')
                && (!status)
              ){

              // var paymentRef = firebase.firestore().collection('payments').doc(doc.id);
              var vendSaleRef = firebase.firestore().collection('vendSales').doc(vendSaleId);
              
              console.log('paymentData: ', data);
              
                // batch.delete(paymentRef);

                // batch.update(vendSaleRef, {updated:true});
             

              firebase.firestore().collection('payments').doc(doc.id).delete().then(function() {
                  console.log(`Document ${doc.id} was successfully deleted!`);

                  // const vendSaleRef = firebase.firestore().collection('vendSales').doc(vendSaleId)
                  // .get()
                  // vendSaleRef.get().then(function(doc){
                  //   if (doc.exists) {
                  //     // console.log('vendSale exist')
                  //     const data = doc.data();
                  //     const updated = data && data.updated;
                  //     if (!updated){
                  vendSaleRef.update({updated:true}).then(()=>{console.log(`payment ${doc.id} successfully updated`)});
                  //     }
                  //     else{
                  //       console.log(`payment ${doc.id} is already updated`);
                  //     }
                  //   }
                  // })
                  // update({updated:true});
                  
                    // vendSaleRef.get().then(function(doc){
                    // if (doc.exists) {

                    // }
                  // firebase.firestore().collection('vendSales').doc(vendSaleId).update({updated:true}).then(function(){
                  //   console.log("vendSales successfully updated!");
                  // })
              });
              
              

              if(paymentCount >= 499){
                batch.commit();
                paymentCount = 0;
                batch = firebase.firestore().batch();
              }
              paymentCount+=1;

            }
            else{
              // console.log('no vend payment found anymore')
            }
          });

          if (paymentCount>0){
            console.log('paymentCount: ', paymentCount);
             return batch.commit().then(()=>{
               console.log('removing payment data');
            }).catch((error)=>{
              console.log('error batch: ', error);
            });
          }
          else{
            console.log('no vend payment found')
          }
        });
    }

    handleViewAllPaymentsFromVend = () => {
      const packagesQuery = firebase.firestore().collection('packages').get();
      const paymentsQuery = firebase.firestore().collection('payments').get();

      return Promise.all([packagesQuery, paymentsQuery]).then(results=>{
        const packagesResults = results[0];
        const paymentResult = results[1];

        var packages = {};
        packagesResults.forEach(doc=>{
          packages[doc.id] = doc.data();
        });

        var finalAllPayments = [];
        var result = {};
    
        paymentResult && paymentResult.forEach(payment=>{
          const data = payment.data();
          const source = data && data.source;
          const vendSaleId = data && data.vendSaleId;
          const vendProductId = data && data.vendProductId;
          const totalPrice = data && data.totalPrice;
          const status = data && data.status;
          const renewalTerm = data && data.renewalTerm;
          const packageId = data && data.packageId;
          const packageData = packages[packageId];
          const packageName = packageData && packageData.name;
          const type = data && data.type;
          const userId = data && data.userId;
          const createdAt = data && data.createdAt;
          const quantity = data && data.quantity;
         
          
          if (source === 'vend' && vendSaleId && (status !== 'FAILED' || status !== 'VOIDED' || status !== 'REFUNDED') && type === 'membership' && userId && createdAt 
            && moment(getTheDate(createdAt)).isBefore(moment('2018-02-01'))
            ){
            // console.log('paymentData: ', data);
            // to count all duplicates
            result[vendSaleId] = (result[vendSaleId]||0)+1;
            // console.log('thresult: ', result);
            // to store it if it is the same
            //if (Object.keys(result).length>1){
            
            // if(result[vendSaleId] > 1){
            //   const vendSaleRef = firebase.firestore().collection('vendSales').doc(vendSaleId);
            //   vendSaleRef.get().then(function(doc){
            //     if (doc.exists) {
            //       // console.log("Document data:", doc.data());
            //       const data = doc.data();
            //       const register_sale_products = data.register_sale_products;
            //       const resgisterSaleSize = register_sale_products && register_sale_products.length;
            //       const status = data.status;

            //       if ((resgisterSaleSize !== result[vendSaleId] ) && (status!=='VOIDED')){
                    
            //         console.log("Document data:", doc.data());
            //         // remove all payment with the vendSaleId
            //         firebase.firestore().collection('payments').where('vendSaleId', '==', vendSaleId).delete().then(function(){
            //           console.log("Document successfully deleted!");
            //         }).catch(function(error) {
            //           console.error("Error removing document: ", error);
            //         });
            //       }

            //     } else {
            //       // doc.data() will be undefined in this case
            //       console.log("No such document!");
            //     }
            //   }).catch(function(error) {
            //       console.log("Error getting document:", error);
            //   });
            //   finalAllPayments.push({
            //     createdAt:moment(getTheDate(createdAt)).format('YYYY-MM-DD'),
            //     vendSaleId,
            //     vendProductId,
            //     totalPrice,
            //     renewalTerm,
            //     packageName,
            //     totalPrice,
            //     status,
            //     quantity:quantity? quantity:1
            //   });
            // }
          }
        });

        // console.log('thresult: ', result);
        finalAllPayments.sort()

        console.log('finalAllPayments: ', finalAllPayments);
        
        // const Papa = require('papaparse');
        // const csv = Papa.unparse(finalAllPayments);
        // var fileDownload = require('js-file-download');
    
        // fileDownload(csv, `finalAllPayments.csv`);

        return Promise.resolve();
      });

    }

    handleViewAllPaymentsHistory = () => {
      // const usersQuery = firebase.firestore().collection('users').get();
      const usersQuery = firebase.firestore().collection('users')
      // .where('email', '==', 'jane.tangshu@gmail.com')
      .get();
      const packagesQuery = firebase.firestore().collection('packages').get();
      const paymentsQuery = firebase.firestore().collection('payments')
      .where('type', '==', 'membership')
      // .where('userId', '==', 'eqy7eB6ICVjh7cYVc8TR')
      .get();

      return Promise.all([usersQuery, packagesQuery, paymentsQuery]).then(results=>{

        const userResults = results[0];

        const packagesResults = results[1];
        const paymentResult = results[2];

        var packages = {};
        packagesResults.forEach(doc=>{
          packages[doc.id] = doc.data();
        });
    
        // console.log('Packages', Object.keys(packages).length, packages);
    
        var users = {};
        var migratedTempUsers = {};
        var usersSummary = {
          active:0,
          activeEnd:0,
          freeze:0,
          terminated:0
        }

        // userResults.forEach(doc=>{
        //   const data =  doc.data() || null;
        //   const packageId = data.packageId;
        //   const email = data.email;
        //   const notTestEmail = email && email.indexOf('@babel.fit') ===-1 && email.indexOf('@boontan.net') === -1;
    
        //   const autoMembershipStarts = data.autoMembershipStarts;
        //   const membershipStarts = data.membershipStarts;
    
        //   if(packageId && notTestEmail && (autoMembershipStarts || membershipStarts)){
        //     users[doc.id] = data;
        //     const migratedTempUserId = data.migratedTempUserId;
        //     if(migratedTempUserId){
        //       migratedTempUsers[migratedTempUserId] = data;
        //       // console.log(tempUserId, migratedTempUserId);
        //     }
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

        var paymentFreeAccess = {};
       
        var paymentVendOrAdyen = {};

        paymentResult && paymentResult.forEach(payment=>{
          const data = payment && payment.data();
          const type = data && data.type;
          const userId = data && data.userId;
          const status = data && data.status;
          const source = data && data.source;
          const renewalTerm = data && data.renewalTerm;
          const quantity = data && (data.quantity?data.quantity:1);
          const createdAt = data && data.createdAt;
          const transactionId = data && data.transactionId;
          const vendSaleId = data && data.vendSaleId;
          const packageId = data && data.packageId;
          const packageData = packages[packageId];
          const packageName = packageData && packageData.name;
          var totalPrice = data && data.totalPrice;
          var pricePermonth = totalPrice;

          if (moment(getTheDate(createdAt)).isSameOrBefore(moment('2020-11-30'))){

            if((status === 'CLOSED' || status === 'LAYBY_CLOSED') && type === 'membership' && userId &&
            source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
           ){
            // console.log('theData: ', data);
             // payments[payment.id] = data;
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
                   quantity
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
                   quantity
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
                   quantity
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
                   quantity
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
                  cycleNumber:1,
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
                    quantity
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
             paymentFreezeForUserId.push(data);
             paymentFreezeByUserId[userId] = paymentFreezeForUserId;
             paymentFreezeByUserId[userId].freezeFor = data && data.freezeFor && moment(getTheDate(data.freezeFor))
             paymentFreezeByUserId[userId].quantity = quantity;
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
        
        // console.log('paymentFreeByUserId: ', paymentFreeByUserId);

        var finalUserData = [];

        userResults && userResults.forEach(doc=>{
          var paymentHistory = [];
          var combinedData = [];
          var addMonths = 0;
          const data = doc && doc.data();
          const userId = doc.id;
          const name = data && data.name;
          const email = data && data.email;
          const packageId = data && data.packageId;
          const packageData = packages[packageId];
          const packageName = packageData && packageData.name;
          const autoMembershipEnds = data && (data.autoMembershipEnds?data.autoMembershipEnds: data.membershipEnds?data.membershipEnds:null);
          const autoMembershipStarts = data && (data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null);
          const membershipStartText = autoMembershipStarts && moment(getTheDate(autoMembershipStarts)).format('YYYY-MM-DD')
          const startMoment = moment(getTheDate(autoMembershipStarts));
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
            if(createdA < createdB){return -1;
            }else if(createdB < createdA){return 1
            }else{return 0}
          });
          freezeUserData && freezeUserData.reverse();

          freezeTerminateUserData && freezeTerminateUserData.sort((a,b)=>{
            const createdA = moment(getTheDate(a.freezeFor)).tz('Asia/Kuala_Lumpur').toDate();
            const createdB = moment(getTheDate(b.freezeFor)).tz('Asia/Kuala_Lumpur').toDate(); 
            if(createdA < createdB){return -1;
            }else if(createdB < createdA){return 1
            }else{return 0}
          });
          freezeTerminateUserData && freezeTerminateUserData.reverse();
          freeAccessData && freeAccessData.sort((a,b)=>{
            // const createdA = moment(getTheDate(a.createdAt)).tz('Asia/Kuala_Lumpur').toDate();
            // const createdB = moment(getTheDate(b.createdAt)).tz('Asia/Kuala_Lumpur').toDate(); 
            const createdA = a.createdAt;
            const createdB = b.createdAt;
            
            if(createdA < createdB){return -1;
            }else if(createdB < createdA){return 1
            }else{return 0}
          });

          freeAccessData && freeAccessData.reverse();
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

          const monthsDiff = Math.max(moment('2022-06-30').diff(moment('2018-01-01'), 'months')) + 1;
          const userMonthsDiff = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment(getTheDate(autoMembershipEnds)), 'months')); 
          const userMonthsDiffSinceJan2018 = Math.max(moment(getTheDate(autoMembershipStarts)).diff(moment('2018-01-01'), 'months')); 

          // if (packageName && autoMembershipStarts && autoMembershipEnds){
          if (autoMembershipStarts && autoMembershipEnds){

            for (var i = 0; i<=monthsDiff; i++){
              // const iterationStartMoment = startMoment.clone().add(i, 'months');
              const iterationStartMoment = moment('2018-01-01').clone().add(i, 'months');
              paymentHistory.push({iterationStartMoment, type:'', userId, text:''});
            }
            // console.log('paymentHistory: ', paymentHistory);
            
            paymentHistory && paymentHistory.forEach(doc=>{
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
                    type:`freezeTerminated
                    \nFreezeTerminated Date: ${(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)? moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].freezeFor)).format('YYYY-MM-DD'):'n/a'}
                    \nFreezeTerminated created Date: ${(freezeTerminateUserData[freezeTerminateUserData.length-1].createdAt)? moment(getTheDate(freezeTerminateUserData[freezeTerminateUserData.length-1].createdAt)).format('YYYY-MM-DD'):'n/a'}`,
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
                    type:`freeze 
                      \nFreeze Date: ${(freezeUserData[freezeUserData.length-1].freezeFor)? moment(getTheDate(freezeUserData[freezeUserData.length-1].freezeFor)).format('YYYY-MM-DD'):'n/a'}
                      \nFreeze created Date: ${(freezeUserData[freezeUserData.length-1].createdAt)? moment(getTheDate(freezeUserData[freezeUserData.length-1].createdAt)).format('YYYY-MM-DD'):'n/a'}`
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
                    type:`free 
                      \nDateRewarded: ${(freeAccessData[freeAccessData.length-1].createdAt)? 
                      moment(getTheDate((freeAccessData[freeAccessData.length-1].createdAt))).format('YYYY-MM-DD'):'n/a'}
                      \nSource: ${(freeAccessData[freeAccessData.length-1].source)? freeAccessData[freeAccessData.length-1].source:'n/a'}`,
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
                    type: `${(paymentUserData[paymentUserData.length-1].pricePermonth)? parseFloat((paymentUserData[paymentUserData.length-1].pricePermonth)).toFixed(2):'0.00'}   
                    \ntotal Price: ${(paymentUserData[paymentUserData.length-1].totalPrice)? (paymentUserData[paymentUserData.length-1].totalPrice):'0.00'} 
                    \npayment Date: ${(paymentUserData[paymentUserData.length-1].paymentDate)? moment(getTheDate(paymentUserData[paymentUserData.length-1].paymentDate)).format('YYYY-MM-DD'):'n/a'}
                    \nvendSaleId: ${(paymentUserData[paymentUserData.length-1].vendSaleId)? (paymentUserData[paymentUserData.length-1].vendSaleId):' '}
                    \nTransactionId: ${(paymentUserData[paymentUserData.length-1].transactionId)? (paymentUserData[paymentUserData.length-1].transactionId):' '}
                    \nPackageName: ${(paymentUserData[paymentUserData.length-1].packageName)? (paymentUserData[paymentUserData.length-1].packageName):' '}
                    \nQuantity: ${(paymentUserData[paymentUserData.length-1].quantity)? (paymentUserData[paymentUserData.length-1].quantity):'1'}
                    \ncycle: ${(paymentUserData[paymentUserData.length-1].cycle)? (paymentUserData[paymentUserData.length-1].cycle):'n/a'}
                    \nstatus: ${(paymentUserData[paymentUserData.length-1].status)? (paymentUserData[paymentUserData.length-1].status):'n/a'}`,
                    transactionId:paymentUserData[paymentUserData.length-1].transactionId,
                    vendSaleId:paymentUserData[paymentUserData.length-1].vendSaleId,
                    packageName:paymentUserData[paymentUserData.length-1].packageName
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
                   type:'n/a'
                 }) 
              }
              // else if
              else{
                combinedData.push({
                  date:doc.iterationStartMoment.toDate(),
                  type:'unpaid'
                })
              }
            });
            // combinedData.reverse();

            // console.log('combinedData: ', combinedData);

            if (combinedData && combinedData.length>=1){
              finalUserData.push({name, email, packageName, membershipStartText, 
                cancellationDate: cancellationFormat,
                // need to change, hardcode first
                jan2018: combinedData[0].type,
                feb2018: combinedData[1].type,
                march2018: combinedData[2].type,
                april2018: combinedData[3].type,
                may2018: combinedData[4].type,
                june2018: combinedData[5].type,
                july2018: combinedData[6].type,
                aug2018: combinedData[7].type,
                sep2018: combinedData[8].type,
                oct2018: combinedData[9].type,
                nov2018: combinedData[10].type,
                dec2018: combinedData[11].type,

                jan2019: combinedData[12].type,
                feb2019: combinedData[13].type,
                march2019: combinedData[14].type,
                april2019: combinedData[15].type,
                may2019: combinedData[16].type,
                june2019: combinedData[17].type,
                july2019: combinedData[18].type,
                aug2019: combinedData[19].type,
                sep2019: combinedData[20].type,
                oct2019: combinedData[21].type,
                nov2019: combinedData[22].type,
                dec2019: combinedData[23].type,

                jan2020: combinedData[24].type,
                feb2020: combinedData[25].type,
                march2020: combinedData[26].type,
                april2020: combinedData[27].type,
                may2020: combinedData[28].type,
                june2020: combinedData[29].type,
                july2020: combinedData[30].type,
                aug2020: combinedData[31].type,
                sep2020: combinedData[32].type,
                oct2020: combinedData[33].type,
                nov2020: combinedData[34].type,
                dec2020: combinedData[35].type,

                jan2021: combinedData[36].type,
                feb2021: combinedData[37].type,
                march2021: combinedData[38].type,
                april2021: combinedData[39].type,
                may2021: combinedData[40].type,
                june2021: combinedData[41].type,
                july2021: combinedData[42].type,
                aug2021: combinedData[43].type,
                sep2021: combinedData[44].type,
                oct2021: combinedData[45].type,
                nov2021: combinedData[46].type,
                dec2021: combinedData[47].type,

                jan2022: combinedData[48].type,
                feb2022: combinedData[49].type,
                march2022: combinedData[50].type,
                april2022: combinedData[51].type,
                may2022: combinedData[52].type,
                june2022: combinedData[53].type,

              });
            }
           
          }
          
        });

        console.log('finalUserData: ', finalUserData);
        
        const Papa = require('papaparse');
        const csv = Papa.unparse(finalUserData);
        var fileDownload = require('js-file-download');
    
        fileDownload(csv, `finalUserData.csv`);

        return Promise.resolve();
      });
    }

    createVar = () =>{
      var dates = [];
      const dateSize = Math.max(moment().diff(moment('2018-01-01'), 'days'));
      console.log('daySize: ', dateSize);

      // for (var i = 1; i < dateSize; i++) {
      //   dates[i] = moment('2018-01-01').clone().add(i, 'days').format('YYYY-MM-DD');
      // }

      for (var i = 1; i < dateSize; i++) {
        dates[moment('2018-01-01').clone().add(i, 'days').format('YYYY-MM-DD')] = null;
      }
      return dates;
    }

    handleViewAllPaymentsDaily = () => {
      const paymentsQuery = firebase.firestore().collection('payments').get();

      return Promise.all([paymentsQuery]).then(results=>{

        const paymentResult = results[0];


        var paymentsForUserId = [];
        var paymentsByUserId = {};
        var payments = {};
        
        var paymentFreezeForUserId = [];
        var paymentFreezeByUserId = {};

        var paymentFreezeTerminatedForUserId = [];
        var paymentFreezeTerminatedByUserId = {};

        var paymentFreeForUserId = [];
        var paymentFreeByUserId = {};

        var paymentFreeAccess = {};
       
        var paymentVendOrAdyen = {};

        // const daySize = this.createVar();
        // console.log('daySize2: ', daySize);
        const theDayObj = this.createVar();
        // console.log('theDayObj: ', theDayObj);
        // console.log('theDayObjSize: ',  Object.keys(theDayObj).length);

        paymentResult && paymentResult.forEach(payment=>{
          const data = payment && payment.data();
          const type = data && data.type;
          const userId = data && data.userId;
          const status = data && data.status;
          const source = data && data.source;
          const renewalTerm = data && data.renewalTerm;
          const quantity = data && (data.quantity?data.quantity:1);
          const createdAt = data && data.createdAt;
          const transactionId = data && data.transactionId;
          const vendSaleId = data && data.vendSaleId;
          // const packageId = data && data.packageId;
          // const packageData = packages[packageId];
          // const packageName = packageData && packageData.name;
          const totalPrice = data && data.totalPrice;


          
          if (moment(getTheDate(createdAt)).isSameOrBefore(moment('2021-12-31')) ){

            if((status !== 'FAILED' || status !== 'VOIDED' || status !== 'REFUNDED') && type === 'membership' && userId &&
            source && (source === 'vend' || source === 'adyen' || source === 'pbonline')
           ){

           }
          }
        });
        

        
        // const Papa = require('papaparse');
        // const csv = Papa.unparse(finalUserData);
        // var fileDownload = require('js-file-download');
    
        // fileDownload(csv, `finalUserData.csv`);

        return Promise.resolve();
      });
    }

    handleViewAllPayments = () => {
      
      const usersQuery = firebase.firestore().collection('users').get();
      const packagesQuery = firebase.firestore().collection('packages').get();
      const paymentsQuery = firebase.firestore().collection('payments').get();

      return Promise.all([usersQuery, packagesQuery, paymentsQuery]).then(results=>{

        const userResults = results[0];

        const packagesResults = results[1];
        var packages = {};
        packagesResults.forEach(doc=>{
          packages[doc.id] = doc.data();
        });
    
        console.log('Packages', Object.keys(packages).length, packages);
    
        var users = {};
        var migratedTempUsers = {};
        var usersSummary = {
          active:0,
          activeEnd:0,
          freeze:0,
          terminated:0
        }
        userResults.forEach(doc=>{
          const data =  doc.data() || null;
          const packageId = data.packageId;
          const email = data.email;
          const notTestEmail = email && email.indexOf('@babel.fit') ===-1 && email.indexOf('@boontan.net') === -1;
    
          const autoMembershipStarts = data.autoMembershipStarts;
          const membershipStarts = data.membershipStarts;
    
          if(packageId && notTestEmail && (autoMembershipStarts || membershipStarts)){
            users[doc.id] = data;
            const migratedTempUserId = data.migratedTempUserId;
            if(migratedTempUserId){
              migratedTempUsers[migratedTempUserId] = data;
              // console.log(tempUserId, migratedTempUserId);
            }
          }
        });
    
        console.log('Users', Object.keys(users).length, users);
        const paymentsResults = results[2];
        var payments = {};
        var paymentsByUserId = {};
        var sources = {};
        var types = {};
        var statuses = {};
        var selectedSources = ['complimentary', 'free', 'freeze', 'jfr', 'join', 'luckyDraw', 'refer', 'promo']
        paymentsResults.forEach(doc=>{
          const data = doc.data();
          const status = data.status;
          const type = data.type;
          const createdAt = data.createdAt;
          const createdAtIsDate = createdAt && (typeof createdAt.getMonth === 'function' || moment(createdAt).isValid());
          const userId = data.userId;
          const source = data.source;
          if(!sources[source]){
            sources[source] = 1;
          }else{
            sources[source] += 1;
          }
          if(!statuses[status]){
            statuses[status] = 1;
          }else{
            statuses[status] += 1;
          }
          if(!types[type]){
            types[type] = 1;
          }else{
            types[type] += 1;
          }
          // source === 'freeze' && console.log('FREEEEEZE');
          if((status !== 'FAILED' || status !== 'VOIDED' || status !== 'REFUNDED') && type === 'membership' && createdAtIsDate && userId){
            payments[doc.id] = data;
            var paymentsForUserId = paymentsByUserId[userId] || [];
            paymentsForUserId.push(data);
            paymentsByUserId[userId] = paymentsForUserId;
          }
        });
        console.log('Payments', Object.keys(payments).length, payments);
        console.log('Payments By User ID', Object.keys(paymentsByUserId).length, paymentsByUserId);
    
        var paymentsArray = [];
        var missingUserCount = 0;
        Object.keys(payments).forEach(paymentId=>{
          const payment = payments[paymentId];
          const createdAt = payment.createdAt;
          const userId = payment.userId;
          const user = users[userId] || migratedTempUsers[userId] || null;
          const name = user ? user.name : ' ';
          const email = user ? user.email : ' ';
          const autoMembershipStarts = user ? user.autoMembershipStarts : null;
          const membershipStarts = user ? user.membershipStarts : null;
          const startsValue = autoMembershipStarts || membershipStarts;
          const membershipStartsString = startsValue ? moment(getTheDate(startsValue)).format('YYYY-MM-DD') : ' ';
          if(!user){
            missingUserCount += 1;
            console.log(missingUserCount, paymentId, payment);
    
          }
    
          const packageId = payment.packageId ? payment.packageId : (user ? user.packageId : null);
          const packageData = packages[packageId] || null;
          const packageName = packageData? packageData.name : ' ';
          const renewalTerm = payment.renewalTerm || 'month'
          const quantity = payment.quantity || 1;
          var monthQuantity = 1;
          if(renewalTerm === 'yearly'){
            monthQuantity = 12*quantity;
          }else if(renewalTerm === 'biyearly'){
            monthQuantity = 6*quantity;
          }else{
            monthQuantity = quantity;
          }
          const source = payment.source;
    
          paymentsArray.push({createdAt:moment(getTheDate(createdAt)).format('YYYY-MM-DD'), name, email, membershipStartsString, packageName, monthQuantity, source});
          // console.log(createdAt, name, email, packageName, monthQuantity, source);
        });
    
        paymentsArray.sort((a,b)=>{
          const createdA = moment(a.createdAt).tz('Asia/Kuala_Lumpur').toDate();
          const createdB = moment(b.createdAt).tz('Asia/Kuala_Lumpur').toDate();
    
          if(createdA < createdB){
            return -1;
          }else if(createdB < createdA){
            return 1
          }else{
            return 0;
          }
        });
    
        console.log(paymentsArray);
    
        const Papa = require('papaparse');
        const csv = Papa.unparse(paymentsArray);
        var fileDownload = require('js-file-download');
    
        fileDownload(csv, `AllPayments.csv`);

        console.log('test', results);

        return Promise.resolve();
      });

      // const users = this.props.users || null;
      // const packages = this.props.packages || null;
      // const usersWithPayment = this.props.usersWithPayment||null;

      // console.log('userswithpayment: ', usersWithPayment);

      // const successfullPayment = usersWithPayment && usersWithPayment.filter((v,k)=>{
      //   const isAdyenPayment = v.get('source')? (v.get('source') === 'adyen')?true:false:false; 
      //   const isPaymentSuccess = v.get('status')? (v.get('status')==='CLOSED')?true:false:false;
      //   const dateCreated = v.get('createdAt')||null;
        
      //   if (isPaymentSuccess){
      //       // console.log('usersWithPayment: ', v.get('createdAt'));
      //       return true;
      //   }
      // });

      // console.log('successfullPayment: ', successfullPayment)
    }

    handleViewAllInActiveMembers = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      const userWithInvoices = this.props.usersWithInvoices || null;
      console.log('userWithInvoices: ', userWithInvoices);

      var inActiveMember = [];

      users && users.forEach((v,k)=>{
        const packageId = v.get('packageId') || null;
        const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
        const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
        const name = v.get('name') || null;
        const phone = v.get('phone')||null;
        const email = v.get('email')||null;
        const source = v.get('referralSource')||null;
        const cancelDate = v.get('cancellationDate')||null;
        const packageData = packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const gender = v.get('gender') || null;
        
        const isLessThan3Mths = moment(getTheDate(memberEndDate)).clone().isSameOrAfter(moment().subtract(3,'months'));
        const isOutStanding = moment(getTheDate(memberEndDate)).clone().isBefore(moment().startOf('day'));
        var monthsDiff = Math.max(moment(getTheDate(memberEndDate)).diff(moment().startOf('day'), 'months'));

        if (email && packageId && (memberstartDate!==null) && memberstartDate && !cancelDate && isOutStanding){
          inActiveMember.push({
            email,
            memberstartDate:moment(getTheDate(memberstartDate)).format('DD-MM-YYYY'),
            memberstartDateMoment: moment(getTheDate(memberstartDate)),
            memberEndDateMoment: moment(getTheDate(memberEndDate)),
            memberEndDate:moment(getTheDate(memberEndDate)).format('DD-MM-YYYY'),
            packageName,
            quantity:monthsDiff,
            name,
            phone,
            source,
            gender
          })
        }
      });

      inActiveMember.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));
    
      var theCSVformat = this.ConvertToCSV(inActiveMember);
      console.log('inactiveMember: ', inActiveMember);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "inActiveMemberReport.csv");
    }

    handleViewNotShareCNY = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      const cnyRef = this.props.cnyRef || null;

      var activeMember = [];
      var angpowList = [];
      var notYetShareAngpow = [];

      cnyRef && cnyRef.forEach((angpow)=>{
        const currentUserEmail = angpow.get('currentUserEmail')||null;
        const currentUserName = angpow.get('currentUserName')||null;
        const referredToEmail = angpow.get('referredToEmail')|| null;
        const referredToName = angpow.get('referredToName')||null;
        const theTime = angpow.get('theTime')||null;
        const theDate = angpow.get('theDate')||null;
        const selectedAvatar = angpow.get('selectedAvatar')||null;
        const selectedCover = angpow.get('selectedCover')||null

        angpowList.push({
          email:currentUserEmail, name:currentUserName, 
          referredToEmail, referredToName, selectedAvatar, selectedCover, theDate, theTime
        });
      });

      users && users.forEach((v,k)=>{
        const packageId = v.get('packageId') || null;
        const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
        const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
        const name = v.get('name') || null;
        const phone = v.get('phone')||null;
        const email = v.get('email')||null;
        const source = v.get('referralSource')||null;
        const cancelDate = v.get('cancellationDate')||null;
        const packageData = packages && packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const gender = v.get('gender') || null;
        
       
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;
        const isOutStandingPayment = moment(getTheDate(memberEndDate)).clone().isAfter(moment().startOf('today'));

        if (email && packageId && (memberstartDate!==null) && memberstartDate && !cancelDate && !isComplimentaryPackage && isOutStandingPayment){
          activeMember.push({
            email,
            memberstartDate:moment(getTheDate(memberstartDate)).format('DD-MM-YYYY'),
            memberstartDateMoment: moment(getTheDate(memberstartDate)),
            memberEndDateMoment: moment(getTheDate(memberEndDate)),
            memberEndDate:moment(getTheDate(memberEndDate)).format('DD-MM-YYYY'),
            packageName,
            name,
            phone,
            source,
            gender
          })
        }
      });

      // activeMember.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));  

    
      // for (var i = 0; i< activeMember.length; i++){
      //   for (var j = 0; j < angpowList.length; j++){
      //     if (activeMember[i].email.toLowerCase() === angpowList[j].currentUserEmail.toLowerCase()){
      //       // member has shared
      //     }
      //     else {
      //       // member not yet share
      //     }
      //   }
      // }
      
      //const objMap={};

      // activeMember && activeMember.filter((member, index)=>{
      //   // const email = member.email||null;
      //   angpowList && angpowList.forEach(angpow=>{
      //     // active user shared the CNY
      //     if (angpow.currentUserEmail.toLowerCase() === member.email.toLowerCase()){
      //       // angpow
      //       console.log('its matched')
      //       objMap[member]=objMap[member]+1||1;
      //     }
      //     else{
      //       // notYetShareAngpow.push(member);
      //       notYetShareAngpow[index]=member
      //     }
      //   });
      // });
      // console.log(Object.keys(objMap).map(e=>Number(e)));

      const theDiff = this.diffOfArray(activeMember, angpowList);
      console.log('theDiff: ', theDiff);

      console.log('notYetShareAngpow: ', theDiff);
      var theCSVformat = this.ConvertToCSV(theDiff);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "notYetShareAngpow.csv");
    }

    differenceOf2Arrays = (array1, array2) => {
      var temp = [];
      array1 = array1.toString().split(',').map(Number);
      array2 = array2.toString().split(',').map(Number);
      
      for (var i in array1) {
      if(array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
      }
      for(i in array2) {
      if(array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
      }
      return temp.sort((a,b) => a-b);
    }

    diffOfArray = (arr1, arr2) => {
      var temp = [];
      var bigArray = arr1;
      // if (arr1.length>0 && arr2.length>0){
      //   for (var i in arr1){
      //     if(arr2[i].email !== arr1[i].email) temp.push(arr1[i]);
      //   }
      //   for(i in arr2) {
      //     if (arr1[i].email !== arr2[i].email) temp.push(arr2[i]);
      //   }
      // }
      for (var i in arr1){
        // console.log('arr1.email: ', arr1[i].email);
        for (var j in arr2){
          if (arr1[i].email === arr2[j].email){
            temp.push(arr1[i]);
            bigArray.splice(i, 1);
          } 
        }
      }

      // for (i in arr2){
      //   console.log('arr2.email: ', arr2[i].email);
      //   if (arr2[i].email !== arr1[i].email) temp.push(arr2[i]);
      // }
      // return temp.sort((a,b) => a-b);
      return bigArray;
    }

    diffArray = (arr1, arr2) => {
      var temp = [];
      return arr1.some(item => arr2.includes(item))
    }

    handleViewAllRawMembers = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      // const freezeItems = this.props.freezeItems || null;
      // console.log('freezeItems: ', freezeItems);
      const freezePayments = this.props.freezePayments || null;
      console.log('freezePayments: ', freezePayments);
      
      var freezePaymentMap = {};
      freezePayments && freezePayments.toKeyedSeq().forEach((v,k)=>{
        const userId = v.get('userId') || null;
        freezePaymentMap[userId] = true;
      });
      
      console.log('freezePaymentMap: ', freezePaymentMap);
      // const filteredUserFreeze = freezePayments && freezePayments.filter((a,b)=>{
      //   const freezeFor = a.get('freezeFor') || null;
      //   const userId = a.get('userId') || null;
      //   const userData = users.get(userId)||null;
      //   const packageId = userData? userData.get('packageId'):null;
      //   if (userId && freezeFor && packageId){
      //     return true;
      //   }
      // });

      var activeMember = [];

      users && users.forEach((v,k)=>{
        const packageId = v.get('packageId') || null;
        const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
        const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
        const name = v.get('name') || null;
        const phone = v.get('phone')||null;
        const email = v.get('email')||null;
        const source = v.get('referralSource')||null;
        const cancelDate = v.get('cancellationDate')||null;
        const isTerminate = v.get('cancellationDate')? true:false;
        const packageData = packages && packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const gender = v.get('gender') || null;
        const IC = v.get('nric')||null;
        const membershipNo = v.get('membershipCard')||null;
        const race = v.get('race')||null;
        const monthOutstanding = memberEndDate? Math.max(moment(new Date()).diff(getTheDate(memberEndDate), 'months')):null;

        const hasRecurring = v.get('hasRecurring')? v.get('hasRecurring'):false;
      
        
        const isLessThan3Mths = moment(getTheDate(memberEndDate)).clone().isSameOrAfter(moment().subtract(3,'months'));
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;
        const isOutStandingPayment = moment(getTheDate(memberEndDate)).clone().isAfter(moment().startOf('today'));
        // const totalCheckIn = 

        if (email && packageId){
          activeMember.push({
            fullName: name?name:'',
            IC:IC?IC:'',
            membershipNo:membershipNo?membershipNo:'', 
            phone:phone?phone:'',
            race:race?race:'',
            gender:gender?gender:'',
            packageName,
            memberstartDate: memberstartDate? moment(getTheDate(memberstartDate)).format('DD-MM-YYYY'):'',
            memberEndDate: memberEndDate? moment(getTheDate(memberEndDate)).format('DD-MM-YYYY'):'',
            isTerminate,
            terminateDate: cancelDate? moment(getTheDate(cancelDate)).format('DD-MM-YYYY'):'',
            email: email? email:'',
            name: name? name:'',
            monthOutstanding: monthOutstanding? monthOutstanding:'',
            autoBilling: hasRecurring
            
          })
        }
      });

      // activeMember.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));
  
      var theCSVformat = this.ConvertToCSV(activeMember);
      console.log('activeRawMember: ', activeMember);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "activeRawMemberReport.csv");
    }

    handleViewAllComplimentaryPromo = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      const usersWithPayment = this.props.usersWithPayment || null;

      var usersComplimentaryPromo = [];

      const userWithComplimentaryPromoPkg = users && users.filter((user, id)=>{
        const complimentaryPromo = user.get('complimentaryPromo')||null;
        const email = user.get('email')||null;
        const name = user.get('name')||null;
        const mcId = user.get('mcId')||null;
        const mcData = users.get(mcId)||null;
        const mcEmail = mcData? mcData.get('email'):null;
        const mcName = mcData? mcData.get('name'):null;
        if (complimentaryPromo){
          return true;
        }
      });

      userWithComplimentaryPromoPkg && userWithComplimentaryPromoPkg.forEach((user, id)=>{
        const complimentaryPromo = user.get('complimentaryPromo')||null;
        const email = user.get('email')||null;
        const name = user.get('name')||null;
        const mcId = user.get('mcId')||null;
        const mcData = users.get(mcId)||null;
        const mcEmail = mcData? mcData.get('email'):null;
        const mcName = mcData? mcData.get('name'):null;
        const userIC = user.get('nric')||null;
        const phone = user.get('phone')||null;

        usersComplimentaryPromo.push({
          email: email? email:'',
          name: name? name:'',
          IC:userIC?userIC:'',
          phone: phone? '0'+phone:'',
          mcEmail: mcEmail? mcEmail:'',
          mcName: mcName? mcName:''
        })
      });

      var theCSVformat = this.ConvertToCSV(usersComplimentaryPromo);
      console.log('usersComplimentaryPromo: ', usersComplimentaryPromo);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "usersComplimentaryPromo.csv");

      // const userWithComplimentaryPromoPkg = usersWithPayment && usersWithPayment.filter((payment, id)=>{
      //   const source = payment.get('source')||null;
      //   const vendProductId = payment.get('vendProductId') || null;
      //   const userId = payment.get('userId')||null;
      //   const type = payment.get('type')||null;
      //   const createdAt = payment.get('createdAt')||null;
      //   // const userData = users.get(userId)||null;
      //   // const totalPayment = userData? userData.get('totalPayments')? userData.get('totalPayments'):null:null;
      //   if (userId && (vendProductId==='b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7') && (type==='membership') && (moment(getTheDate(createdAt))).isSameOrAfter(moment('20191201'))){
      //     return true;
      //   }
      // });

      // var memberWithComplimentaryPromo = [];

      // const userRef = firebase.firestore().collection('users').get();
      // var userRefData = [];

      // userRef.then((querySnapshot)=>{
      //   querySnapshot.forEach(doc=>{
      //     console.log(doc.id, '=>', doc.data());
      //     userRefData.push(doc.data());
      //   });
      //   this.setState({userRefData});
      // }).catch(function (error) {
      //   this.setState({ userRefData: null });
      //   console.log("Error getting document:", error);
      // });

      // var i = 0;

      // userWithComplimentaryPromoPkg && userWithComplimentaryPromoPkg.forEach((payment, id)=>{
      //   const userId = payment.get('userId')||null;
      //   const source = payment.get('source')||null;
      //   // console.log('thesource: ', source);
      //   const userData = users.get(userId)||null;
        
      //   const email = userData? userData.get('email')? userData.get('email'):null:null;
      //   const totalPayments = userData? userData.get('totalPayments')? userData.get('totalPayments'):null:null;

      //   const packageId = userData? userData.get('packageId')? userData.get('packageId'):null:null;
      //   const currentPkgData = packageId && packages.get(packageId);
      //   const packageName = currentPkgData? currentPkgData.get('name')? currentPkgData.get('name'):null:null;
      //   const memberstartDate = userData? userData.get('autoMembershipStarts')? userData.get('autoMembershipStarts'): userData.get('membershipStarts')? userData.get('membershipStarts'):null:null;
      //   const memberEndDate = userData? userData.get('autoMembershipEnds')? userData.get('autoMembershipEnds'): userData.get('membershipEnds')? userData.get('membershipEnds'):null:null;
      //   const name = userData? userData.get('name')?userData.get('name'):null:null;
      //   const cancelDate = userData? userData.get('cancellationDate')? userData.get('cancellationDate'):null:null;
      //   const isMonthlyPkg = (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q' || packageId === 'vf2jCUOEeDDiIQ0S42BJ');
      //   const complimentaryPromo = userData? userData.get('complimentaryPromo')? userData.get('complimentaryPromo'):null:null;
      //   const remarks = userData? userData.get('remarks')? userData.get('remarks'):null:null;
      //   const packageLocked = userData? userData.get('packageLocked')? userData.get('packageLocked'):null:null;

      //   if (userData && email && (!totalPayments || totalPayments && totalPayments <= 0) && memberEndDate && memberstartDate && !cancelDate){
      //     // console.log('userData: ', userData);
      //     // console.log('userEmail: ', email);

      //     console.log('count: ', i++);

      //     // firebase.firestore().collection('users').doc(userId).update({
      //     //   packageId:'L6sJtsKG68LpEUH3QeD4',
      //     //   complimentaryPromo: remarks? remarks:" ",
      //     // }).then(function(){
      //     //   console.log("Document successfully updated!");
      //     // }).catch((err)=>{
      //     //   console.log('error updating firestore: ', err);
      //     // });

      //     // if (memberWithComplimentaryPromo.length >= 1 && memberWithComplimentaryPromo[memberWithComplimentaryPromo.length-1].email === email){
      //     //   console.log('already exist')
      //     // }
      //     // else{
      //       memberWithComplimentaryPromo.push({
      //         email,
      //         name,
      //         memberstartDate: moment(getTheDate(memberstartDate)).format('YYYYMMDD'),
      //         memberEndDate: moment(getTheDate(memberEndDate)).format('YYYYMMDD'),
      //         packageName,
      //         complimentaryPromo,
      //         remarks
      //         // cancelDate: cancelDate? moment(getTheDate(cancelDate)).format('DD MM YYYY'):' '
      //       });
            
      //       // console.log('complimentaryPromoType: ', typeof(complimentaryPromo));
      //       // if (typeof(complimentaryPromo) === 'object'){
      //       //   firebase.firestore().collection('users').doc(userId).update({
      //       //     // packageId:'L6sJtsKG68LpEUH3QeD4'
      //       //     complimentaryPromo: remarks? remarks:" ",
      //       //   }).then(function(){
      //       //     console.log("Document successfully updated!");
      //       //   }).catch((err)=>{
      //       //     console.log('error updating firestore: ', err);
      //       //   })
      //       // }
      //     //}
      //   } 
       
      //   // var batch = firebase.firestore().batch();
    
      //   // if (complimentaryPromo && packageId !== 'L6sJtsKG68LpEUH3QeD4'){
          
      //   //   console.log('count: ', i++);
      //   //   var userRef = firebase.firestore().collection('users').doc(userId);
      //   //   // console.log('complimentaryPromo, package is not locked');
      //   //   batch.update(userRef, {
      //   //     // packageLocked:true,
      //   //     packageId:'L6sJtsKG68LpEUH3QeD4'
      //   //   });

      //   //   // firebase.firestore().collection('users').doc(userId).update({
      //   //   //   // packageLocked:true,
      //   //   //   packageId:'L6sJtsKG68LpEUH3QeD4'
      //   //   //   // complimentaryPromo: remarks? remarks:" ",
      //   //   // }).then(function(){
      //   //   //   console.log("Document successfully updated!");
      //   //   // }).catch((err)=>{
      //   //   //   console.log('error updating firestore: ', err);
      //   //   // });
      //   // }

      //   // // else if (complimentaryPromo && packageLocked && packageId !== 'L6sJtsKG68LpEUH3QeD4'){
      //   // //   console.log('complimentaryPromo, package is locked');
      //   // //   firebase.firestore().collection('users').doc(userId).update({
      //   // //     // packageLocked:true,
      //   // //     packageId:'L6sJtsKG68LpEUH3QeD4'
      //   // //     // complimentaryPromo: remarks? remarks:" ",
      //   // //   }).then(function(){
      //   // //     console.log("Document successfully updated!");
      //   // //   }).catch((err)=>{
      //   // //     console.log('error updating firestore: ', err);
      //   // //   });
      //   // // }

      //   // batch.commit();
      // });

      // if (userWithComplimentaryPromoPkg){
      //   var theCSVformat = this.ConvertToCSV(memberWithComplimentaryPromo);
      //   console.log('memberWithComplimentaryPromo: ', memberWithComplimentaryPromo);
      //   var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      //   FileSaver.saveAs(blob, "memberWithComplimentaryPromo.csv");
      // }

      // var memberWithComplimentaryPromo = [];
      // const userWithComplimentaryPromoPkg = users && users.filter((v, i)=>{
      //   const packageId = v.get('packageId') || null;
      //   const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
      //   const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
      //   const name = v.get('name') || null;
      //   const phone = v.get('phone')||null;
      //   const email = v.get('email')||null;
      //   const source = v.get('referralSource')||null;
      //   const cancelDate = v.get('cancellationDate')||null;
      //   const packageData = packages && packages.get(packageId)||null;
      //   const packageName = packageData? packageData.get('name') : null;
      //   const gender = v.get('gender') || null;
      //   const complimentaryPromo = v.get('complimentaryPromo') || null;
      //   if (complimentaryPromo){
      //     memberWithComplimentaryPromo.push({
      //       email,
      //       name,
      //       startDate: moment(getTheDate(memberstartDate)).format('YYYYMMDD'),
      //       endDate: moment(getTheDate(memberEndDate)).format('YYYYMMDD'),
      //       packageName,
      //       complimentaryPromo
      //     })
      //   }
      // });
  
      // if (memberWithComplimentaryPromo.length>0){
      //   var theCSVformat = this.ConvertToCSV(memberWithComplimentaryPromo);
      //   console.log('memberWithComplimentaryPromo: ', memberWithComplimentaryPromo);
      //   var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      //   FileSaver.saveAs(blob, "memberWithComplimentaryPromo.csv");
      // }
    }

    handleViewAllActiveMembers = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      const userWithInvoices = this.props.usersWithInvoices || null;
      const freezePayments = this.props.freezePayments || null;

      var activeMember = [];

      var freezePaymentMap = {};
      var freezeUserMap = {};
      var freezePaymentArray = [];

      freezePayments && freezePayments.forEach((payment, index)=>{
        const createdAt = payment.get('createdAt') || null;
        const freezeFor = payment.get('freezeFor') || null;
        const userId = payment.get('userId')||null;

          //   if (userId && moment(getTheDate(freezeFor)).isAfter(moment().subtract(1, 'months'))){
          //     freezeUserMap[userId] = true;
          //     // freezeCount++
          //   }

        if (userId && moment(getTheDate(freezeFor)).isAfter(moment().subtract(1, 'months'))){
          freezePaymentMap[userId]=payment;
        }
      });

      // console.log('freezePaymentMap: ', freezePaymentMap);

      users && users.forEach((v,k)=>{
        const packageId = v.get('packageId') || null;
        const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
        const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
        const name = v.get('name') || null;
        const phone = v.get('phone')||null;
        const email = v.get('email')||null;
        const source = v.get('referralSource')||null;
        const cancelDate = v.get('cancellationDate')||null;
        const packageData = packages && packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const gender = v.get('gender') || null;
        const freezeData = freezePaymentMap[k];
        
        // console.log('freezeData: ', freezeData);
        // if (freezeData){
        //   // freezeData && freezeData.forEach((freeze,k)=>{
        //   //   const freezeFor = freeze && freeze.freezeFor;
        //   //   const userId = freeze && freeze.userId;

        //   //   console.log('theUserId: ', k);
        //   //   // const freezeFor = v.get('freezeFor')||null;
        //   //   // const userId = v.get('userId')||null;
        //   //   // const freezeStartMoment = (freezeFor && moment(getTheDate(freezeFor))) || null;
        //   //   if (userId && moment(getTheDate(freezeFor)).isAfter(moment().subtract(1, 'months'))){
        //   //     freezeUserMap[userId] = true;
        //   //     // freezeCount++
        //   //   }
        //   // });
        //   // const freezeFor = 
        // }
        
        const isLessThan3Mths = moment(getTheDate(memberEndDate)).clone().isSameOrAfter(moment().subtract(3,'months'));
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;
        const isOutStandingPayment = moment(getTheDate(memberEndDate)).clone().isAfter(moment().startOf('today'));
      
        if (email && packageId && (TTDIPackage.includes(packageId) || klccPackage.includes(packageId))
          && memberstartDate && !cancelDate && !isComplimentaryPackage && isOutStandingPayment && !freezeData)
          {
          activeMember.push({
            email,
            memberstartDate:moment(getTheDate(memberstartDate)).format('DD-MM-YYYY'),
            memberstartDateMoment: moment(getTheDate(memberstartDate)),
            memberEndDateMoment: moment(getTheDate(memberEndDate)),
            memberEndDate:moment(getTheDate(memberEndDate)).format('DD-MM-YYYY'),
            packageName,
            name,
            phone,
            source,
            gender
          })
        }
      });

      activeMember.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));
      // const sortedArray = activeMember.sort((a,b)=>{
      //   return moment(a.memberstartDate).format('YYYYMMDD') - moment(b.memberstartDate).format('YYYYMMDD');
      // })
      // userWithInvoices && userWithInvoices.forEach((v,k)=>{
      //   const userId = v.get('userId') || null;
      //   var userData = users.get(userId)||null;
      //   const packages = this.props.packages || null;
      //   var email = userData? userData.get('email'):'null';
      //   var name = userData? userData.get('name'):'null';
      //   const billingDate = userData? moment(getTheDate(userData.get('autoMembershipEnds'))).format('DD') : null;
      //   const packageId = v.get('packageId') || '';
      //   const amount = v.get('totalPrice') || '0';
      //   const paid = v.get('paid') || false;
      //   const packageData = packages.get(packageId)||null;
      //   const createdAt = v.get('createdAt')? moment(getTheDate(v.get('createdAt'))):null;
      //   // console.log('packageData: ', packageData);
      //   // const packageName = packageData.get('name') || '';
      //   const packageName = packageData? packageData.get('name') : '';
      //   if (paid && createdAt){
      //     //console.log('createdAt: ', createdAt.format('DD-MM-YYYY'));
      //     const isLessThan3Mths = createdAt.clone().isSameOrAfter(moment().subtract(3,'months'));
      //     // console.log('isLessThan3Mths: ', isLessThan3Mths);
      //     if (isLessThan3Mths){
      //       activeMember.push({
      //         // userId,
      //         name,
      //         email,
      //         packageName,
      //         amount,
      //         createdAt: createdAt.format('DD-MM-YYYY'),
      //         billingDate: 'Every ' + billingDate + ' of the month',
      //         paid
      //       });
      //     }
      //   }
      // });
    
      var theCSVformat = this.ConvertToCSV(activeMember);
      console.log('activeMember: ', activeMember);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "activeMemberReport.csv");
    }

    handleViewMonthlyReport = () => {
      const users = this.props.users || null;

      const startDate = '20200101';
      const startMoment = moment(startDate).tz('Asia/Kuala_Lumpur').startOf('day');
      const endMoment = moment('20200131').tz('Asia/Kuala_Lumpur').startOf('day');
      var addMonths = 0;

      // 0 - yearly all clubs;
      // 1 - yearly, 
      // 2 - 1 year renewal, 
      // 3 - 3 mths
      // 4 - 3 mths all clubs
      // 5 - 6 mths
      // 6 - 6 mths all clubs
      // 7 - 6 mths renewal
      // 8 - complimentary
      // 9 - CP 180
      // 10 - CP 210
      // 11 - CP 230
      // 12 - CP 290 
      // 13 - CP 310
      // 14 - Monthly
      // 15 - Monthly all clubs
      const packages = [
        'q7SXXNKv83MkkJs8Ql0n', // yearly all clubs // 0
        'WmcQo1XVXehGaxhSNCKa', // yearly           // 1
        'VWEHvdhNVW0zL8ZAeXJX', // 1 year renewal   // 2
        'yQFACCzpS4DKcDyYftBx', // 3 mths           // 3
        'aTHIgscCxbwjDD8flTi3', // 3 mths all clubs // 4
        'duz1AkLuin8nOUd7r66L', // 6 mths           // 5
        '89THMCx0BybpSVJ1J8oz', // 6 mths all clubs // 6
        'DjeVJskpeZDdEGlcUlB1', // 6 mths renewal   // 7
        'yKLfNYOPzXHoAiknAT24', // complimentary    // 8
        'ZEDcEHZp3fKeQOkDxCH8', // CP 180           // 9
        'dz8SAwq99GWdEvHCKST2', // CP 210           // 10
        'wpUO5vxWmme7KITqSITo', // CP 230           // 11
        'BKcaoWGrWKYihS40MpGd', // CP 290           // 12
        'eRMTW6cQen6mcTJgKEvy', // CP 310           // 13
        'vf2jCUOEeDDiIQ0S42BJ', // Monthly          // 14
        'TJ7Fiqgrt6EHUhR5Sb2q', // Monthly All Clubs// 15
        'LNGWNSdm6kf4rz1ihj0i', // 3M Jan Promo Term (all club) // 16
        'k7As68CqGsFbKZh1Imo4',  // 3M Jan Promo Term (single) // 17
        'L6sJtsKG68LpEUH3QeD4' // Complimentary promo
      ];

      var monthsDiff = Math.max(moment(endMoment).diff(startMoment, 'months'));
      var theDateArray = [];
      var theFilteredUser = [];
      var theFilteredUserByTTDI = [];
      var theFilteredUserByKLCC = [];
      var theFilteredUserByFreeze = [];
      var theFilteredUserByFreezeTTDI = [];
      var theFilteredUserByFreezeKLCC = [];
      var theFilteredUserCancel = [];
      var theFilteredUserCancelTTDI = [];
      var theFilteredUserCancelKLCC = [];
      
      var theFilteredByPackageYearAllClub = [];
      var theFilteredByPackageYearly = [];
      var theFilteredByPackageYearlyRenew = [];
      var theFilteredByPkg3Mths = [];
      var theFilteredByPkg3MthsAllClub = [];
      var theFilteredByPkg6Mths = [];
      var theFilteredByPkg6MthsAllClub = [];
      var theFilteredByPkg6MthsRenew = [];
      var theFilteredByPkgComplimentary = [];
      var theFilteredByPkg180 = [];
      var theFilteredByPkg210 = [];
      var theFilteredByPkg230 = [];
      var theFilteredByPkg290 = [];
      var theFilteredByPkg310 = [];
      var theFilteredByPkgMonthly = [];
      var theFilteredByPkgMonthlyAllClub = [];
      var theFilteredByPkg3MJan2020Promo = [];

      var combinedArray = [];

      // console.log('monthsDiff: ', monthsDiff);
      for (var i=0; i<=monthsDiff; i++){
        const iterationStartMoment = startMoment.clone().add(addMonths, 'months');
        addMonths++;
        //console.log('iterationStartMoment: ', iterationStartMoment);
        theDateArray.push({iterationStartMoment});
      }

      theDateArray.forEach((a,b)=>{
        // console.log('theDateArrayUser: ', a.iterationStartMoment.format('YYYYMMDD'));
        
        // for all members
        const filteredUserData = this.filteredUser(a.iterationStartMoment.format('YYYYMMDD'));
        // console.log('filteredUserData: ', filteredUserData);
        const theDataSize = filteredUserData && filteredUserData.size;
        // console.log('theDataSize: ', theDataSize);
        theFilteredUser.push(theDataSize);

        const filteredUserByTTDI = this.filteredTTDIUser(a.iterationStartMoment.format('YYYYMMDD'));
        const theFilteredTTDISize = filteredUserByTTDI.size;
        theFilteredUserByTTDI.push(theFilteredTTDISize);

        const filteredUserByKLCC = this.filteredKLCCUser(a.iterationStartMoment.format('YYYYMMDD'));
        const theFilteredKLCCSize = filteredUserByKLCC.size;
        theFilteredUserByKLCC.push(theFilteredKLCCSize);

        const filteredUserByFreeze = this.filteredFreezeUser(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserByFreeze.push(filteredUserByFreeze.size);

        const filteredUserByFreezeTTDI = this.filteredFreezeTTDIUser(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserByFreezeTTDI.push(filteredUserByFreezeTTDI.size);

        const filteredUserByFreezeKLCC = this.filteredFreezeKLCCUser(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserByFreezeKLCC.push(filteredUserByFreezeKLCC.size);

        const filteredUserCancel = this.filteredCancelUser(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserCancel.push(filteredUserCancel.size);

        const filteredUserCancelTTDI = this.filteredCancelUserTTDI(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserCancelTTDI.push(filteredUserCancelTTDI.size);

        const filteredUserCancelKLCC = this.filteredCancelUserKLCC(a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredUserCancelKLCC.push(filteredUserCancelKLCC.size);

        const filteredByPackageYearlyAllClubs = this.filterUserByPackage(packages[0], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPackageYearAllClub.push(filteredByPackageYearlyAllClubs.size);

        const filteredByPackageYearly = this.filterUserByPackage(packages[1], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPackageYearly.push(filteredByPackageYearly.size);

        const filteredByPackageYearlyRenew = this.filterUserByPackage(packages[2], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPackageYearlyRenew.push(filteredByPackageYearlyRenew.size);

        const filteredByPackage3Mths = this.filterUserByPackage(packages[3], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg3Mths.push(filteredByPackage3Mths.size);

        const filteredByPackage3MthsAllClubs = this.filterUserByPackage(packages[4], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg3MthsAllClub.push(filteredByPackage3MthsAllClubs.size);

        const filteredByPackage6Mths = this.filterUserByPackage(packages[5], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg6Mths.push(filteredByPackage6Mths.size);

        const filteredByPackage6MthsAllClubs = this.filterUserByPackage(packages[6], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg6MthsAllClub.push(filteredByPackage6MthsAllClubs.size);

        const filteredByPackage6MthsRenew = this.filterUserByPackage(packages[7], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg6MthsRenew.push(filteredByPackage6MthsRenew.size);

        const filteredByPackageComplimentary = this.filterUserByPackage(packages[8], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkgComplimentary.push(filteredByPackageComplimentary.size);

        const filteredByPackage180 = this.filterUserByPackage(packages[9], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg180.push(filteredByPackage180.size);

        const filteredByPackage210 = this.filterUserByPackage(packages[10], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg210.push(filteredByPackage210.size);

        const filteredByPackage230 = this.filterUserByPackage(packages[11], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg230.push(filteredByPackage230.size);

        const filteredByPackage290 = this.filterUserByPackage(packages[12], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg290.push(filteredByPackage290.size);

        const filteredByPackage310 = this.filterUserByPackage(packages[13], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg310.push(filteredByPackage310.size);

        const filteredByPackageMonthly = this.filterUserByPackage(packages[14], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkgMonthly.push(filteredByPackageMonthly.size);

        const filteredByPackageMonthlyAllClub = this.filterUserByPackage(packages[15], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkgMonthlyAllClub.push(filteredByPackageMonthlyAllClub.size);

        const filteredByPackage3MJan2020Promo = this.filterUserByPackage(packages[16], a.iterationStartMoment.format('YYYYMMDD'));
        theFilteredByPkg3MJan2020Promo.push(filteredByPackage3MJan2020Promo.size);

      });
      
      console.log('theFilteredUser: ', theFilteredUser);
      console.log('theFilteredUserByTTDI: ', theFilteredUserByTTDI);
      console.log('theFilteredUserByKLCC: ', theFilteredUserByKLCC);
      console.log('theFilteredUserByFreeze: ', theFilteredUserByFreeze);
      console.log('theFilteredUserByFreezeTTDI: ', theFilteredUserByFreezeTTDI);
      console.log('theFilteredUserByFreezeKLCC: ', theFilteredUserByFreezeKLCC);
      console.log('theFilteredUserCancel: ', theFilteredUserCancel);
      console.log('theFilteredUserCancelTTDI: ', theFilteredUserCancelTTDI);
      console.log('theFilteredUserCancelKLCC: ', theFilteredUserCancelKLCC);
      console.log('theFilteredByPkg3MJan2020Promo: ', theFilteredByPkg3MJan2020Promo);
      
      // console.log('combinedArray: ', combinedArray);
      var theCSVformatFilteredUser = this.ConvertToCSV2(theFilteredUser);
      var theCSVFormatFilteredCancel = this.ConvertToCSV2(theFilteredUserCancel);
      var theCSVFormatFilteredCancelTTDI = this.ConvertToCSV2(theFilteredUserCancelTTDI);
      var theCSVFormatFilteredCancelKLCC = this.ConvertToCSV2(theFilteredUserCancelKLCC);
      var theCSVFormatFilteredFreeze = this.ConvertToCSV2(theFilteredUserByFreeze);
      var theCSVFormatFilteredFreezeTTDI = this.ConvertToCSV2(theFilteredUserByFreezeTTDI);
      var theCSVFormatFilteredFreezeKLCC = this.ConvertToCSV2(theFilteredUserByFreezeKLCC);
      var theCSVFormatFilteredPkgYearlyAllClubs = this.ConvertToCSV2(theFilteredByPackageYearAllClub);
      var theCSVFormatFilteredPkgYearly = this.ConvertToCSV2(theFilteredByPackageYearly);
      var theCSVFormatFilteredPkgYearlyRenew = this.ConvertToCSV2(theFilteredByPackageYearlyRenew);
      var theCSVFormatFilteredPkg3Mths = this.ConvertToCSV2(theFilteredByPkg3Mths);
      var theCSVFormatFilteredPkg3MthsAllClubs = this.ConvertToCSV2(theFilteredByPkg3MthsAllClub);
      var theCSVFormatFilteredPkg6Mths = this.ConvertToCSV2(theFilteredByPkg6Mths);
      var theCSVFormatFilteredPkg6MthsAllClubs = this.ConvertToCSV2(theFilteredByPkg6MthsAllClub);
      var theCSVFormatFilteredPkg6MthsRenew = this.ConvertToCSV2(theFilteredByPkg6MthsRenew);
      var theCSVFormatComplimentary = this.ConvertToCSV2(theFilteredByPkgComplimentary);
      var theCSVFormatFilteredPkg180 = this.ConvertToCSV2(theFilteredByPkg180);
      var theCSVFormatFilteredPkg210 = this.ConvertToCSV2(theFilteredByPkg210);
      var theCSVFormatFilteredPkg230 = this.ConvertToCSV2(theFilteredByPkg230);
      var theCSVFormatFilteredPkg290 = this.ConvertToCSV2(theFilteredByPkg290);
      var theCSVFormatFilteredPkg310 = this.ConvertToCSV2(theFilteredByPkg310);
      var theCSVFormatFilteredPkgMonthly = this.ConvertToCSV2(theFilteredByPkgMonthly);
      var theCSVFormatFilteredPkgMonthlyAllClub = this.ConvertToCSV2(theFilteredByPkgMonthlyAllClub);
      var theCSVFormatFilteredPkg3MJan2020Promo = this.ConvertToCSV2(theFilteredByPkg3MJan2020Promo);

      var theCSVFormatCombined = this.convertAllToCSV(theCSVformatFilteredUser, theCSVFormatFilteredCancel,
        theCSVFormatFilteredCancelTTDI, theCSVFormatFilteredCancelKLCC, theCSVFormatFilteredFreeze, theCSVFormatFilteredFreezeTTDI, theCSVFormatFilteredFreezeKLCC, 
        theCSVFormatFilteredPkgYearlyAllClubs, theCSVFormatFilteredPkgYearly, theCSVFormatFilteredPkgYearlyRenew,
        theCSVFormatFilteredPkg3Mths, theCSVFormatFilteredPkg3MthsAllClubs,
        theCSVFormatFilteredPkg6Mths, theCSVFormatFilteredPkg6MthsAllClubs, theCSVFormatFilteredPkg6MthsRenew,
        theCSVFormatComplimentary, theCSVFormatFilteredPkg180, theCSVFormatFilteredPkg210,
        theCSVFormatFilteredPkg230, theCSVFormatFilteredPkg290, theCSVFormatFilteredPkg310,
        theCSVFormatFilteredPkgMonthly, theCSVFormatFilteredPkgMonthlyAllClub, theCSVFormatFilteredPkg3MJan2020Promo
        );

      console.log('theCSVFormatCombined: ', theCSVFormatCombined);
      var blob = new Blob([theCSVFormatCombined], {type: "text/plain;charset=utf-8"});
      // var blob = new Blob(combinedArray, {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allOutStandingReport.csv");
    }

    filterUserByPackage = (thePackageId, startDateString) => {
      const users = this.props.users || null;
      const filteredUserByPackage = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(startDateString));
        const packageId = a.get('packageId') || null;
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;

        if (packageId === thePackageId && moment(getTheDate(endDate)).isSameOrAfter(moment(startDateString)) && !isComplimentaryPackage && !isCancel && startDate && moment(getTheDate(startDate)).isSameOrBefore(moment(startDateString))){
          return true;
        }
      });
      return filteredUserByPackage;
    }

  ConvertArrayToCSV = (array) => {
    var theArray = '';
    var theArrayCol = '';
    console.log('theArray: ', array);
    console.log('arrayLength: ', array.length);

    for (var i = 0; i < array.length; i++) {
      theArray += array[i] + ',';
      // console.log('theArray: ', theArray)
    }

    for (var j = 0; j<theArray.length; j++){
      theArrayCol += theArray[j] + '\n';
    }
    return theArrayCol;
  }

  ConvertToCSV2 = (theArray) => {
    var str = '';
    for (var i = 0; i < theArray.length; i++) {
      str += theArray[i] + ',';
    }
    return str;
  }

  convertAllToCSV = (theCSVformatFilteredUser, theCSVFormatFilteredCancel, 
    theCSVFormatFilteredCancelTTDI, theCSVFormatFilteredCancelKLCC, theCSVFormatFilteredFreeze, theCSVFormatFilteredFreezeTTDI, theCSVFormatFilteredFreezeKLCC, 
    theCSVFormatFilteredPkgYearlyAllClubs, theCSVFormatFilteredPkgYearly, theCSVFormatFilteredPkgYearlyRenew,
    theCSVFormatFilteredPkg3Mths, theCSVFormatFilteredPkg3MthsAllClubs,
    theCSVFormatFilteredPkg6Mths, theCSVFormatFilteredPkg6MthsAllClubs, theCSVFormatFilteredPkg6MthsRenew,
    theCSVFormatComplimentary, theCSVFormatFilteredPkg180, theCSVFormatFilteredPkg210,
    theCSVFormatFilteredPkg230, theCSVFormatFilteredPkg290, theCSVFormatFilteredPkg310,
    theCSVFormatFilteredPkgMonthly, theCSVFormatFilteredPkgMonthlyAllClub, theCSVFormatFilteredPkg3MJan2020Promo
    ) => {
    var str = '';
    str = 'allActiveUser' +','+ theCSVformatFilteredUser + '\r\n' 
      + 'allTerminatedmember' + ',' + theCSVFormatFilteredCancel + '\r\n' 
      + 'terminated TTDI' + ',' + theCSVFormatFilteredCancelTTDI + '\r\n'
      + 'terminated KLCC' + ',' +  theCSVFormatFilteredCancelKLCC + '\r\n'
      + 'freeze' + ',' + theCSVFormatFilteredFreeze + '\r\n'
      + 'freezeTTDI' + ',' + theCSVFormatFilteredFreezeTTDI + '\r\n'
      + 'freezeKLCC' + ',' + theCSVFormatFilteredFreezeKLCC + '\r\n'
      + 'yearlyAllClubs' + ',' + theCSVFormatFilteredPkgYearlyAllClubs + '\r\n'
      + 'pkgYearly' + ',' + theCSVFormatFilteredPkgYearly + '\r\n' 
      + 'pkgYearlyRenew' + ',' + theCSVFormatFilteredPkgYearlyRenew + '\r\n'
      + 'pkg3Months' + ',' + theCSVFormatFilteredPkg3Mths + '\r\n'
      + '3monthAllclubs' + ',' + theCSVFormatFilteredPkg3MthsAllClubs + '\r\n'
      + '6mths' + ',' + theCSVFormatFilteredPkg6Mths + '\r\n'
      + '6mthsAllclubs' + ',' + theCSVFormatFilteredPkg6MthsAllClubs + '\r\n'
      + '6mthrenew' + ',' + theCSVFormatFilteredPkg6MthsRenew + '\r\n'
      + 'complimentary' + ',' + theCSVFormatComplimentary + '\r\n'
      + 'pkg180' + ',' + theCSVFormatFilteredPkg180 + '\r\n'
      + 'pkg210' + ',' + theCSVFormatFilteredPkg210 + '\r\n'
      + 'pkg230' + ',' + theCSVFormatFilteredPkg230 + '\r\n'
      + 'pkg290' + ',' + theCSVFormatFilteredPkg290 + '\r\n'
      + 'pkg310' + ',' + theCSVFormatFilteredPkg310 + '\r\n'
      + 'pkgMonthly' + ',' + theCSVFormatFilteredPkgMonthly + '\r\n'
      + 'pkgmonthlyAllclub' + ',' + theCSVFormatFilteredPkgMonthlyAllClub + '\r\n'
      + '3mthJanPromo' + ',' + theCSVFormatFilteredPkg3MJan2020Promo + '\r\n'
    return str;
  }

     // for both klcc and ttdi
     filteredCancelUser = (startDateString) => {
      const users = this.props.users || null;
      const filteredCancelUsers = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isBetween(moment(startDateString).clone().subtract(1,'days'), moment(startDateString).clone().add(1, 'months'));
        const packageId = a.get('packageId') || null;
        if (isCancel){
          return true;
        }
      });
      return filteredCancelUsers;
    }

    filteredCancelUserTTDI = (startDateString) => {
      const users = this.props.users || null;
      const filteredCancelUsers = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isBetween(moment(startDateString).clone().subtract(1,'days'), moment(startDateString).clone().add(1, 'months'));
        const packageId = a.get('packageId') || null;
        var isTTDIpkg = this.isTTDIPackage(packageId);
        if (isCancel && isTTDIpkg){
          return true;
        }
      });
      return filteredCancelUsers;
    }

    filteredCancelUserKLCC = (startDateString) => {
      const users = this.props.users || null;
      const filteredCancelUsers = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isBetween(moment(startDateString).clone().subtract(1,'days'), moment(startDateString).clone().add(1, 'months'));
        const packageId = a.get('packageId') || null;
        var isKLCCpkg = this.isKLCCPackage(packageId);
        if (isCancel && isKLCCpkg){
          return true;
        }
      });
      return filteredCancelUsers;
    }

    filteredUserWithoutFreeze = (startDateString, endDateString) => {
      const users = this.props.users || null;
      // console.log('freezeUser: ', this.props.freezePayments);
      const freezePayments = this.props.freezePayments || null;
      const filteredWithoutFreeze = freezePayments && freezePayments.filter((a,b)=>{
        const freezeFor = a.get('freezeFor') || null;
        const userId = a.get('userId') || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const packageId = userData? userData.get('packageId'):null;

        const memberStartDate = userData.get('autoMembershipStarts')? userData.get('autoMembershipStarts'):userData.get('membershipStarts')?userData.get('membershipStarts'):null;
        const memberEndDate = userData.get('autoMembershipEnds')? userData.get('autoMembershipEnds'):userData.get('membershipEnds')? userData.get('membershipEnds'):null;
        const cancellationDate = userData.get('cancellationDate') || null;
       
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;

        // hardcode
        const isActiveMember = memberStartDate && memberEndDate && moment(getTheDate(memberEndDate)).clone().isSameOrAfter(moment('20191001')) && moment(getTheDate(memberStartDate)).clone().isSameOrBefore(moment('20190101'));
        const isCancel = cancellationDate;
        const isFreeze = moment(getTheDate(freezeFor)).isBetween(moment(startDateString).clone(), moment(endDateString).clone());

        if (userId && packageId && isActiveMember && !isCancel && !isComplimentaryPackage){
        // if (userId && packageId && isActiveMember && !isCancel && !isFreeze){
          return true;
        }
      });
      return filteredWithoutFreeze;
    };

    // for both klcc and ttdi
    filteredFreezeUser = (startDateString) => {
      const users = this.props.users || null;
      // console.log('freezeUser: ', this.props.freezePayments);
      const freezePayments = this.props.freezePayments || null;
      
      const filteredFreeze = freezePayments && freezePayments.filter((a,b)=>{
        const freezeFor = a.get('freezeFor') || null;
        const userId = a.get('userId') || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const packageId = userData? userData.get('packageId'):null;
        if (userId && freezeFor && packageId && moment(getTheDate(freezeFor)).isBetween(moment(startDateString).clone().subtract(1, 'days'), moment(startDateString).clone().add(1, 'months'))){
        // if (userId && freezeFor && packageId && moment(getTheDate(freezeFor)).isBetween(moment(startDateString), moment(startDateString).add(1, 'months'))){ 
          return true;
        }
      });
      return filteredFreeze;
    }

    filteredFreezeTTDIUser = (startDateString) => {
      const users = this.props.users || null;
      console.log('freezeUser: ', this.props.freezePayments);
      const freezePayments = this.props.freezePayments || null;
      
      const filteredFreeze = freezePayments && freezePayments.filter((a,b)=>{
        const freezeFor = a.get('freezeFor') || null;
        const userId = a.get('userId') || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const packageId = userData? userData.get('packageId'):null;
        var isTTDIpkg = this.isTTDIPackage(packageId);
        // console.log('isTTDIpkg: ', isTTDIpkg);
        if (userId && freezeFor && isTTDIpkg && moment(getTheDate(freezeFor)).isBetween(moment(startDateString).clone().subtract(1, 'days'), moment(startDateString).clone().add(1, 'months'))){
          return true;
        }
      });
      return filteredFreeze;
    }

    filteredFreezeKLCCUser = (startDateString) => {
      const users = this.props.users || null;
      // console.log('freezeUser: ', this.props.freezePayments);
      const freezePayments = this.props.freezePayments || null;
      const filteredFreeze = freezePayments && freezePayments.filter((a,b)=>{
        const freezeFor = a.get('freezeFor') || null;
        const userId = a.get('userId') || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const packageId = userData? userData.get('packageId'):null;
        var isKLCCpkg = this.isKLCCPackage(packageId);
        // console.log('isTTDIpkg: ', isTTDIpkg);
        if (userId && freezeFor && isKLCCpkg && moment(getTheDate(freezeFor)).isBetween(moment(startDateString).clone().subtract(1, 'days'), moment(startDateString).clone().add(1, 'months'))){
          return true;
        }
      });
      return filteredFreeze;
    }

    isTTDIPackage(packageId){
      var isTTDIPackage = false;
      if ((packageId === 'DjeVJskpeZDdEGlcUlB1') || (packageId === 'VWEHvdhNVW0zL8ZAeXJX') || (packageId === 'WmcQo1XVXehGaxhSNCKa') ||
      (packageId === 'ZEDcEHZp3fKeQOkDxCH8') || (packageId === 'duz1AkLuin8nOUd7r66L') || (packageId === 'dz8SAwq99GWdEvHCKST2') ||
      (packageId === 'vf2jCUOEeDDiIQ0S42BJ') || (packageId === 'wpUO5vxWmme7KITqSITo') || (packageId === 'yQFACCzpS4DKcDyYftBx')){
        isTTDIPackage = true;
      }
      return isTTDIPackage;
    };

    isKLCCPackage(packageId){
      var isKLCCPackage = false;
      if ((packageId === '89THMCx0BybpSVJ1J8oz') || (packageId === 'BKcaoWGrWKYihS40MpGd') || (packageId === 'TJ7Fiqgrt6EHUhR5Sb2q') ||
      (packageId === 'aTHIgscCxbwjDD8flTi3') || (packageId === 'eRMTW6cQen6mcTJgKEvy') || (packageId === 'q7SXXNKv83MkkJs8Ql0n')){
        isKLCCPackage = true;
      }
      return isKLCCPackage;
    }
    // for both klcc & ttdi
    filteredUser = (startDateString) => {
      // console.log('startDateString: ', startDateString);
      const users = this.props.users || null;

      const filteredUser = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(startDateString));
        const packageId = a.get('packageId') || null;
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;

        if (moment(getTheDate(endDate)).isSameOrAfter(moment(startDateString)) && !isComplimentaryPackage && !isCancel && packageId && startDate && moment(getTheDate(startDate)).isSameOrBefore(moment(startDateString))){
          // console.log('endDate: ', moment(getTheDate(endDate)).format('DD MM YYYY'));
          return true;
        }
      });
      // console.log('filteredUserFn: ', filteredUser);
      // console.log('startDateString: ', startDateString);
      return filteredUser;
    }

    filteredKLCCUser (startDateString) {
      const users = this.props.users || null;
      const filteredUser = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(startDateString));
        const packageId = a.get('packageId') || null;
        var isKLCC = this.isKLCCPackage(packageId);
        if (moment(getTheDate(endDate)).isSameOrAfter(moment(startDateString)) && !isCancel && isKLCC && startDate && moment(getTheDate(startDate)).isSameOrBefore(moment(startDateString))){
          // console.log('endDate: ', moment(getTheDate(endDate)).format('DD MM YYYY'));
          return true;
        }
      });
      // console.log('filteredUserKLCC: ', filteredUser);
      // console.log('startDateStringKLCC: ', startDateString);
      return filteredUser;
    }

    filteredTTDIUser (startDateString) {
      const users = this.props.users || null;
      const filteredUser = users && users.filter((a,b)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(startDateString));
        const packageId = a.get('packageId') || null;
        var isTTDI = this.isTTDIPackage(packageId);
        if (moment(getTheDate(endDate)).isSameOrAfter(moment(startDateString)) && !isCancel && isTTDI && startDate && moment(getTheDate(startDate)).isSameOrBefore(moment(startDateString))){
          // console.log('endDate: ', moment(getTheDate(endDate)).format('DD MM YYYY'));
          return true;
        }
      });
      // console.log('filteredUserTTDI: ', filteredUser);
      // console.log('startDateStringTTDI: ', startDateString);
      return filteredUser;
    }

    filteredVisitorUser (dateString) {
      const users = this.props.users || null;
      const filteredUser = users && users.filter((a)=>{
        const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
        const endDate = a.get('autoMembershipEnds')? a.get('autoMembershipEnds'):a.get('membershipEnds')? a.get('membershipEnds'):null;
        const cancellationDate = a.get('cancellationDate') || null;
        const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(dateString));
        const packageId = a.get('packageId') || null;
        const joinDate = a.get('joinDate') || null;
        // const theTime = v.get('joinDate') || null;
        const validVisitors = joinDate && !startDate && !isCancel && !packageId;
        const validDay = joinDate && (moment(getTheDate(joinDate)).format('DD') === moment(dateString).format('DD'))
        if (validVisitors && validDay){
          return true;
        }
      });
      // console.log('filteredUserTTDI: ', filteredUser);
      // console.log('startDateStringTTDI: ', startDateString);
      return filteredUser;
    }

    filteredVisitorTTDI (dateString) {
      const users = this.props.users || null;
      const gantnerKLCC = this.props.gantnerKLCC || null;
      const gantnerTTDI = this.props.gantnerTTDI || null;

      const filteredGantnerTTDI = gantnerTTDI && gantnerTTDI.filter((a)=>{
        console.log('filteredGantnerTTDI: ', a);
        const theDate = a.secondaryText || null;
        const userId = a.id || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const role = userData? userData.get('roles'):null;
        const membershipStart = userData? userData.get('membershipStarts'):null;
        const packageId = userData? userData.get('packageId'):null;
        const isVisitor = !role && !membershipStart && !packageId;
        const validDate = moment(dateString).startOf('day').isSame(moment(theDate).startOf('day'));
        if (validDate && isVisitor){
          return true;
        }
      })
      // const filteredUser = users && users.filter((a,b)=>{
      //   const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
      //   const cancellationDate = a.get('cancellationDate') || null;
      //   const isCancel = cancellationDate && moment(getTheDate(cancellationDate)).isSameOrBefore(moment(dateString));
      //   const packageId = a.get('packageId') || null;
      //   const joinDate = a.get('joinDate') || null;
      //   // const theTime = v.get('joinDate') || null;
      //   const validVisitors = joinDate && !startDate && !isCancel && !packageId;
      //   const validDay = joinDate && (moment(getTheDate(joinDate)).format('DD') === moment(dateString).format('DD'))
        
      //   if (validVisitors && validDay){
      //     const userGantnerLogs = getGantnerLogsByUId(b);
      //     console.log('userGantnerLogs: ', userGantnerLogs);
      //     //console.log('theB: ', b);
      //     return true;
      //   }
      // });
      return filteredGantnerTTDI;
    }
    
    handleExpiredMemberReport = () => {
      // console.log('handleExpiredMemberReport: ', this.props.expiredMember);
      const users = this.props.users || null;
      const expiredMember = this.props.expiredMember || null;
      const packages = this.props.packages || null;
      // console.log('thepackage: ', packages);

      var expiredMemberArray = [];
      expiredMember && expiredMember.forEach((a,b)=>{
        // console.log('thea: ', a);
        const userId = a.id || null;
        const userData = users.get(userId)||null;
        const email = userData? userData.get('email'):null;
        const name = userData? userData.get('name'):null;
        const billingDate = userData? moment(getTheDate(userData.get('autoMembershipEnds'))).format('DD MMM YYYY') : null;
        const packageId = userData? userData.get('packageId') : null;
        const packageData = packages? packages.get(packageId):null;
        const packageName = packages? packageData.get('name') : null;
        const memberStartDate = userData? moment(getTheDate(userData.get('autoMembershipStarts'))).format('DD MMM YYYY'):null;
        const terminatedDate = userData? userData.get('cancellationDate')? userData.get('cancellationDate'):null:null;
        const remarks = userData? userData.get('remarks'):'null';
        const phoneNumber = userData? userData.get('phone'):null;

        expiredMemberArray.push({
          email, 
          name,
          packageName,
          memberStartDate,
          billingDate,
          remarks,
          phoneNumber,
          terminatedDate
        });
      });
      // console.log('expiredMemberArray: ', expiredMemberArray);
      var theCSVformat = this.ConvertToCSV(expiredMemberArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "allOutStandingReport.csv");
    }

    // for referral report
    handleViewReferralReport = () => {
      console.log('handleViewReferralReport: ', this.props.users);
      const users = this.props.users || null;
      const referralUsers = this.props.referralUsers||null;
      const packages = this.props.packages || null;
     
      var userRefArray = [];
      const userReferral = users && users.forEach((a,b)=>{
        const referredByUserId = a.get('referredByUserId') || null;
        if (referredByUserId){
          const name = a.get('name') || null;
          const email = a.get('email') || null;
          const userId = b;
          const referredUserData = users.get(referredByUserId)||null;
          // console.log('referredUserData: ', referredUserData);
          const referredEmail = referredUserData? referredUserData.get('email'):null;
          const referredName = referredUserData? referredUserData.get('name'):null;
          const startDate = a.get('autoMembershipStarts')? a.get('autoMembershipStarts'):a.get('membershipStarts')?a.get('membershipStarts'):null;
          const startDateMoment = startDate? moment(getTheDate(startDate)).format('DD MM YYYY'):null;

          const validDate = startDate? moment(getTheDate(startDate)).isSameOrAfter('20191130'):false;
          if (validDate){
            userRefArray.push({
              startDate: startDateMoment,
              email,
              name,
              userId,
              referredEmail,
              referredName,
              referredByUserId
            })
          }
        }
      });

      userRefArray.sort((a,b)=>{
        return moment(a.startDate).format('DD MM YYYY') - moment(b.startDate).format('DD MM YYYY')
      });

      console.log('userRefArray: ', userRefArray);
      var theCSVformat = this.ConvertToCSV(userRefArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "referralReport.csv");

      //var referralUserArray = [];
      // referralUsers && referralUsers.forEach((c,d)=>{
      //   const userId = c.get('userId') || null;
      //   const createdAt = c.get('createdAt')? moment(getTheDate(c.get('createdAt'))).format('DD MM YYYY'):null;
      //   const createdAtTimeStamp = c.get('createdAt') || null;
      //   const referredUserId = c.get('referredUserId')||null;
        
      //   const userData = users.get(userId)||null;
      //   const referredUserData = users.get(referredUserId)||null;
      //   const userEmail = userData? userData.get('email'):null;
      //   const referredUserEmail = referredUserData? referredUserData.get('email'):null;
      //   const userName = userData? userData.get('name'):null;
      //   const refferedUserName = referredUserData? referredUserData.get('name'):null;
      //   const userPackageId = userData? userData.get('packageId') : null;
      //   const userPackageData = packages? packages.get(userPackageId):null;
      //   const userPackageName = packages? userPackageData.get('name') : null;
      //   const refferedPackageId = referredUserData? referredUserData.get('packageId') : null;
      //   const refferedPackageData = packages? packages.get(refferedPackageId):null;
      //   const refferredPackageName = refferedPackageData? refferedPackageData.get('name') : null;

      //   const validDate = moment(getTheDate(createdAtTimeStamp)).isAfter(moment('20191201'))
      //   //if (validDate){
      //     referralUserArray.push({
      //       createdAt,
      //       userEmail,
      //       userName,
      //       userPackageName,
      //       referredUserEmail,
      //       refferedUserName,
      //       refferredPackageName
      //     });
      //   //}
      //   referralUserArray.sort((a,b)=>{
      //     const dateA = moment(a.createdAt);
      //     const dateB = moment(b.createdAt);
      //     if(moment(dateA).isAfter(dateB)){
      //       return 1
      //     }
      //     if(moment(dateB).isAfter(dateA)){
      //       return -1;
      //     }
      //     return 0;
      //   });
      // });
      // console.log('referralUserArray: ', referralUserArray);
      // var theCSVformat = this.ConvertToCSV(referralUserArray);
      // var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "referralReport.csv");
    };

    handleViewVendReport = () =>{
      // console.log('handleViewVendReport: ', this.props.vendSales);
      const startDate = '20180101';
      const endDate = '20191231'
      const startMoment = moment(startDate);
      var monthsDiff = Math.max(moment(endDate).diff(startDate, 'months'));
      console.log('monthsDiff: ', monthsDiff);
      var theDateArray = [];
      var paymentByMonth = [];
      var vendSales = this.props.vendSales || null;
      var vendProducts = this.props.vendProducts || null;
      var ttdi_id = '0af7b240-abc5-11e7-eddc-d4a1c0133102'; //ttdi
      var klcc_id = '0af7b240-aba0-11e9-fb5b-b0907137b026'; //klcc
      var vendProductArray = [];
      var sortedArray = [];
      sortedArray[ttdi_id] = [];
      sortedArray[klcc_id] = [];
      vendProductArray = [];


      console.log('vendProducts: ', vendProducts);


      vendProducts && vendProducts.forEach((a,b)=>{
        const name = a.get('name') || null;
        const productType = a.get('product_type')||null;
        const productTypeName = productType && productType.get('name');
        
        vendProductArray[b]= productTypeName;

        if (!sortedArray[ttdi_id][productTypeName]){
          sortedArray[ttdi_id][productTypeName] = {};
          sortedArray[klcc_id][productTypeName] = {};
          var addMonths = 0;
          for (var i=0; i<=monthsDiff; i++){
            const iterationStartMoment = startMoment.clone().add(addMonths, 'months');
            const monthText = iterationStartMoment.format('MMM YYYY');
            addMonths++;
            //console.log('iterationStartMoment: ', iterationStartMoment);
            sortedArray[ttdi_id][productTypeName][iterationStartMoment] = 0;
            sortedArray[klcc_id][productTypeName][iterationStartMoment] = 0;
          }
        }
      });

      // get all venProduct
      vendSales && vendSales.forEach((a,b)=>{
        const theDate = a.get('created_at')||null;
        const theOutlet = a.get('outlet_id')||ttdi_id;
        // console.log("theoutlet",theOutlet);
        // console.log('register_sale_products: ', a.get('register_sale_products'));

        const lineItems = a.get('line_items') || null
        const registerSaleProducts = a.get('register_sale_products');
        const items = lineItems ? lineItems : (registerSaleProducts?registerSaleProducts : null);

        registerSaleProducts && registerSaleProducts.forEach((d)=>{

          const date = moment(getTheDate(theDate));
          // console.log('payment_date: ', date);
          const dateString = date.format('MMM YYYY');

          const newDate = moment(date).tz('Asia/Kuala_Lumpur').startOf('month');

          const prodId = d.get('product_id') || null;
          const price_total = d.get('price_total')||null;
          // console.log('thetotalPrice: ', price_total);

          let productid = vendProductArray[prodId];
          
  
            sortedArray[theOutlet][productid][newDate] +=  parseInt(price_total);

        });

        lineItems && lineItems.forEach((d)=>{
          const date = moment(getTheDate(theDate));
          // console.log('payment_date: ', date);
          const dateString = date.format('MMM YYYY');

          const newDate = moment(date).tz('Asia/Kuala_Lumpur').startOf('month');

          const prodId = d.get('product_id') || null;
          const price_total = d.get('price_total')||null;
          // console.log('thetotalPrice: ', price_total);

          let productid = vendProductArray[prodId];

            sortedArray[theOutlet][productid][newDate] +=  parseInt(price_total);

        });

        

       // checking for the product that been sold
      //  items && items.map(registerSaleProduct=>{
      //    console.log()
      //   const productId = registerSaleProduct.product_id; //same like packageID
      //   // const pId = productIdPackageMap[productId];
      //   // if(pId){
      //   //   // console.log("package", pId);
      //   //   packageId = pId;
      //   // }
      //   return null;
      // });

        
        //if ()

        // if (register_sale_products && vendProductArray.length === 0 ){
        //   vendProductArray.push(register_sale_products);
        // }
        // else if ()
      });
      // console.log(register_sale_products);

      console.log('vendProductArray: ', vendProductArray);

      console.log('sortedArray', sortedArray);
      console.log('vendSales', vendSales);
 

      console.log('theDateArray: ', theDateArray);

      // get all venProduct
      // var vendProductId = 

      theDateArray.forEach((a,b)=>{
        const filteredPayment = this.filteredPayment(a.iterationStartMoment.format('YYYYMMDD'));
      });

      // console.log('referralUserArray: ', referralUserArray);
      var theCSVformat = this.ConvertToCSV(sortedArray);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "VendReport.csv");
    }

    filteredPayment = (startDateString) => {
      console.log('handleViewVendReport: ', this.props.vendSales);
      // const vendSales = this.props.vendSales || null;

      // const filteredByMonthPayment = vendSales && vendSales.filter((a,b)=>{
      //   const created_at = a.get('created_at') || null;
      //   if (moment(created_at).isBetween(moment(startDateString).clone(), moment(startDateString).clone().add(1, 'months').subtract(1, 'days'))){
      //     return true;
      //   }
      // });
      // return filteredByMonthPayment;
    };

    // CSV to JSON Converter
    ConvertFromCSV = (string) => {
       
        var str = '';
        var comaCount = 0;
        var strArray = [];

        // console.log('thestring: ', string);
        const Papa = require('papaparse');
        var results = Papa.parse(string);
        // console.log('paparesult: ', results);
        strArray = results && results.data;
        strArray.splice(0, 1);
        // console.log('strArray: ', strArray)

        // strArray && strArray.forEach(array=>{
        //   firebase.firestore().collection('exercises').add({
        //     name:array[1],
        //     focus:array[2],
        //     equipment:array[3],
        //     type:array[4],
        //     fitnessComponent:array[5],
        //     level:array[6],
        //     style:array[7],
        //     myofascial:array[8] 
        //   }).then(()=>{
        //     console.log('successfully add execises')
        //   }).catch(e=>{
        //     console.log('error: ', e)
        //   })
        // });

        return strArray;
    }

    // JSON to CSV Converter
    ConvertToCSV = (objArray) => {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        // for (var i = 0; i < array.length; i++) {
        //     var line = '';
        //     for (var index in array[i]) {
        //         if (line != '' || line != "") line += ','
        //         line += array[i][index];
        //     }
        //     str += line + '\r\n';
        // }

        const Papa = require('papaparse');
        const csv = Papa.unparse(array);
        str = csv;
      return str;
    }

    handleChange = name => event => {
        var editData = this.state.editData;
        var value = event.target.value;
        
        if (name === 'startDate' || name === 'endDate') {
          value = moment(value).toDate();
        }

        editData[name] = value;
        this.setState({
            editData: {
            ...editData
            },
        });
        console.log('editData: ', this.state.editData);
    }

    handleViewAllMembersWithoutFreeze = () => {

      const startDate = '20180101';
      const startMoment = moment(startDate);
      const endDate = '20200115';
      const endMoment = moment('20200115');
      const users = this.props.users || null;
      const packages = this.props.packages || null;

      const filteredUserwithoutFreeze = this.filteredUserWithoutFreeze(startDate, endDate);
      console.log('filteredUserwithoutFreeze: ', filteredUserwithoutFreeze);

      let userWithoutFreeze = [];

      filteredUserwithoutFreeze && filteredUserwithoutFreeze.forEach((user)=>{
        console.log('theFilteredUser: ', user);
        const packageId = user.get('packageId') || null;
        const memberstartDate = user.get('autoMembershipStarts')? user.get('autoMembershipStarts'): user.get('membershipStarts')? user.get('membershipStarts'):null;
        const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
        const name = user.get('name') || null;
        const phone = user.get('phone')||null;
        const email = user.get('email')||null;
        const source = user.get('referralSource')||null;
        const cancelDate = user.get('cancellationDate')||null;
        const packageData = packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const gender = user.get('gender') || null;

        userWithoutFreeze.push({
          email,
          memberstartDate:moment(getTheDate(memberstartDate)).format('DD-MM-YYYY'),
          memberstartDateMoment: moment(getTheDate(memberstartDate)),
          memberEndDateMoment: moment(getTheDate(memberEndDate)),
          memberEndDate:moment(getTheDate(memberEndDate)).format('DD-MM-YYYY'),
          packageName,
          name,
          phone,
          source,
          gender
        })
      })

      userWithoutFreeze.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));
    
      var theCSVformat = this.ConvertToCSV(userWithoutFreeze);
      console.log('userWithoutFreeze: ', userWithoutFreeze);
      // var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "userWithoutFreeze.csv");

    };

    handleDownloadFromFBToCSV = () => {
      const execisesPromise = firebase.firestore().collection('exercises').get();
      var exerciseArray = [];
      return Promise.all([execisesPromise]).then(result=>{
        const exerciseRes = result[0];
        console.log('exerciseRes: ', exerciseRes);
        exerciseRes && exerciseRes.forEach(exercise=>{
          const data = exercise.data();
          const id = exercise.id;
          const name = data.name;
          const focus = data.focus;
          const equipment = data.equipment;
          const fitnessComponent = data.fitnessComponent;
          const level = data.level;
          const myofascial = data.myofascial;
          const style = data.style;
          const type = data.type;
          exerciseArray.push({
            id, name, focus, equipment, type, fitnessComponent, level, style, myofascial
          })
        });

        var theCSVformat = this.ConvertToCSV(exerciseArray);
        console.log('exerciseArray: ', exerciseArray);
        var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "exerciseArray.csv");

        return exerciseArray;
      })
    }

    handleCompareWithFB = () => {
      var uploadedExerciseCSV = this.ConvertFromCSV(this.state.uploadedExerciseCSV);
      var uploadedExCSVToObj = [];
      var exerciseArray = [];
      var exerciseArrayFromCSV = [];
      var exerciseChanges = {};
      // then fetch from firestore
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      var exerciseCSV = {};
      var exerciseFB = {};
      var allExerciseCSV = [];
      var allExerciseFB = [];
      var allChangesBefore = [];
      var allChangesAfter = [];

      const exercisePromise = firebase.firestore().collection('exercises').get();
      return Promise.all([exercisePromise]).then(result=>{
        const exerciseResult = result[0];
        exerciseResult && exerciseResult.forEach(exercise=>{
          const data = exercise.data();
          const id = exercise.id;
          const name = data.name;
          const focus = data.focus;
          const equipment = data.equipment;
          const fitnessComponent = data.fitnessComponent;
          const level = data.level;
          const myofascial = data.myofascial;
          const style = data.style;
          const type = data.type;
          exerciseArray.push({
            id, name, focus, equipment, type, fitnessComponent, level, style, myofascial
          });
        });
        // convert uploadedExercise to object
        uploadedExerciseCSV && uploadedExerciseCSV.forEach(exercise=>{
          const id = exercise[0];
          const name = exercise[1];
          const focus = exercise[2];
          const equipment = exercise[3];
          const type = exercise[4];
          const fitnessComponent = exercise[5];
          const level = exercise[6];
          const style = exercise[7];
          const myofascial = exercise[8];
          exerciseArrayFromCSV.push({
            id, name, focus, equipment, type, fitnessComponent, level, style, myofascial
          });
        });
        exerciseArrayFromCSV.sort((a,b)=>{
          var idA = a.id
          var idB = b.id
          if (idA < idB) {return -1}
          if (idA > idB) {return 1}
          return 0;
        });
        exerciseArray.sort((a,b)=>{
          var idA = a.id
          var idB = b.id
          if (idA < idB) {return -1}
          if (idA > idB) {return 1}
          return 0;
        });

        console.log('exerciseArrayFromCSV: ', exerciseArrayFromCSV);
        console.log('exerciseArray: ', exerciseArray);
        // compare 2 arrays
        exerciseArrayFromCSV.forEach(exerciseFromCSV=>{
          const idFromCSV = exerciseFromCSV.id;
          const nameFromCSV = exerciseFromCSV.name;
          const focusFromCSV = exerciseFromCSV.focus;
          const equipmentFromCSV = exerciseFromCSV.equipment;
          const fitnessComponentFromCSV = exerciseFromCSV.fitnessComponent;
          const levelFromCSV = exerciseFromCSV.level;
          const myofascialFromCSV = exerciseFromCSV.myofascial;
          const styleFromCSV = exerciseFromCSV.style
          const typeFromCSV = exerciseFromCSV.type;

          exerciseArray.forEach(exercise=>{
            
            const exerciseId = exercise.id;
            const exerciseName = exercise.name;
            const exerciseFocus = exercise.focus;
            const exerciseEquipment = exercise.equipment;
            const exerciseFitnessComponent = exercise.fitnessComponent;
            const exerciseLevel = exercise.level;
            const exerciseMyofascial = exercise.myofascial;
            const exerciseStyle = exercise.style
            const exerciseType = exercise.type;

            // compare with the same id first
            if (exerciseId === idFromCSV){
              // console.log('exerciseName: ', exercise.name);
              if (exerciseName !== nameFromCSV || exerciseFocus !== focusFromCSV 
                || exerciseEquipment !== equipmentFromCSV 
                || exerciseFitnessComponent !== fitnessComponentFromCSV 
                || exerciseLevel !== levelFromCSV
                || exerciseMyofascial !== myofascialFromCSV 
                || exerciseStyle !== styleFromCSV 
                || exerciseType!== typeFromCSV
                ){
                  if (exerciseName !== nameFromCSV){
                    exerciseFB['name']=exerciseName;
                    exerciseCSV['name']=nameFromCSV;
                  }
                  if (exerciseFocus !== focusFromCSV){
                    exerciseFB['focus']=exerciseFocus;
                    exerciseCSV['focus']=focusFromCSV;
                  }
                  if (exerciseEquipment !== equipmentFromCSV){
                    exerciseFB['equipment']=exerciseEquipment;
                    exerciseCSV['equipment']=equipmentFromCSV;
                  }
                  if (exerciseLevel !== levelFromCSV){
                    exerciseFB['level']=exerciseLevel;
                    exerciseCSV['level']=levelFromCSV;
                  }
                  if (exerciseMyofascial !== myofascialFromCSV){
                    exerciseFB['myofascial']=exerciseMyofascial;
                    exerciseCSV['myofascial']=myofascialFromCSV;
                  }
                  if (exerciseStyle !== styleFromCSV){
                    exerciseFB['style']=exerciseStyle;
                    exerciseCSV['style']=styleFromCSV;
                  }
                  if (exerciseType !== typeFromCSV){
                    exerciseFB['type']=exerciseType;
                    exerciseCSV['type']=typeFromCSV;
                  }
                  
                  // console.log('exerciseFB: ', exerciseFB);
                  // console.log('exerciseCSV: ', exerciseCSV);

                  if ((Object.keys(exerciseFB).length > 0) && (Object.keys(exerciseCSV).length > 0)){
                    firebase.firestore().collection('exercises').doc(exerciseId).update({
                      ...exerciseCSV
                    }).then(()=>{
                      console.log(`successfully updating exercise data ${exerciseId}`);
                      // allExerciseCSV.push(...exerciseCSV);
                      // allExerciseFB.push(...exerciseFB);
                      allChangesBefore.push(exerciseFB);
                      allChangesAfter.push(exerciseCSV);
                      // console.log('allChangesAfter1: ', allChangesAfter);
                      // firebase.firestore().collection('exerciseLogs').add({
                      //   date:timestamp,
                      //   exerciseId,
                      //   change:{
                      //     before:{...exerciseFB},
                      //     after:{...exerciseCSV}
                      //   },
                      //   beforeChangeData:exercise, afterChangeData:exerciseFromCSV
                      // }).then(()=>{
                      //   console.log('successfully added to exerciseLogs');
                      // }).catch(e=>{
                      //   console.log('error adding to exerciseLogs: ', e);
                      // })
                    }).catch(e=>{
                      console.log('error adding data to exercise collections: ', e);
                    });
                  }
              }
              else{
                console.log('all matched ');
              }
            }

          });

      });

      if ((Object.keys(exerciseFB).length > 0) && (Object.keys(exerciseCSV).length > 0)){
        return firebase.firestore().collection('exerciseLogs').add({
          date:timestamp,
          change:{
            before:allChangesBefore,
            after:allChangesAfter
          },
          beforeChangeData:exerciseArray, afterChangeData:exerciseArrayFromCSV
        }).then(()=>{
          console.log('successfully added to exerciseLogs');
        }).catch(e=>{
          console.log('error adding to exerciseLogs: ', e);
        })
      }
      // console.log('allChangesAfter: ', allChangesAfter);

      // if (allChangesAfter.length>0){
      //   firebase.firestore().collection('exerciseLogs').add({
      //     date:timestamp,
      //     change:{
      //       before:allChangesBefore,
      //       after:allChangesAfter
      //     },
      //     beforeChangeData:exerciseArray, afterChangeData:exerciseArrayFromCSV
      //   }).then(()=>{
      //     console.log('successfully added to exerciseLogs');
      //   }).catch(e=>{
      //     console.log('error adding to exerciseLogs: ', e);
      //   })
      // }
      // else {
      //   console.log('no changes found')
      // }
    });
  }

    handleConvertToJSON = () => {
       // console.log('uploadedExerciseCSV: ', this.state.uploadedExerciseCSV);
       var newData = this.ConvertFromCSV(this.state.uploadedExerciseCSV);
      //  console.log('newData: ', newData);
    }

    handleFile = (e) => {
      const content = e.target.result;
      // console.log('file content',  content)
      this.setState({uploadedExerciseCSV: content});
      this.setState({uploadedContent:content});
      // You can set content in state and show it in render.
    }

    handleChangeFile = (file) => {
      let fileData = new FileReader();
      fileData.onloadend = this.handleFile;
      fileData.readAsText(file);
    }

    handleUploadLaJuCeria = () => {
      // let reader = new FileReader();
      // let file = 
      console.log('handleUploadLaJuCeria state: ', this.state);
      var uploadedContent = this.state.uploadedContent;
      var uploadedContent2 = this.state.uploadedContent && this.state.uploadedContent.split("\n");
      var arrayLajuCeria = [uploadedContent];
      var theLine;
      var indexOfY = 0;
      var theLineArray = [];
      var saleObj = {};

      //uploadedContent2 = uploadedContent2.pop();
      // to remove the last \n - hardcode
      uploadedContent2.splice(24, 1);
      console.log('uploadedContent: ', uploadedContent);
      console.log('uploadedContent2: ', uploadedContent2);
      var arrayContent = [];
      var objContent = {};

      uploadedContent2 && uploadedContent2.forEach((data,index)=>{
        arrayContent = data.split('|');
        // console.log('arrayContent: ', arrayContent);
        const machineId = arrayContent[0];
        const batchId = arrayContent[1];
        const date = arrayContent[2];
        const hour = arrayContent[3];
        const receiptCount = arrayContent[4];
        const totalnetSales = arrayContent[5];
        const totalSST = arrayContent[6];
        const totalDiscount = arrayContent[7];
        const totalServiceCharge = arrayContent[8];
        const totalPax = arrayContent[9];
        const totalCash =  arrayContent[10];
        const totalTNG = arrayContent[11];
        const totalVisa = arrayContent[12];
        const totalMasterCard = arrayContent[13];
        const totalAmex = arrayContent[14];
        const totalVoucher = arrayContent[15];
        const totalOthers = arrayContent[16];
        const sstRegistered = arrayContent[17];
      
        objContent[index]={
          machineId, batchId, date, hour, receiptCount, totalnetSales, totalSST, totalDiscount, totalServiceCharge,
          totalPax, totalCash, totalTNG, totalVisa, totalMasterCard, totalAmex, totalVoucher, totalOthers, sstRegistered
        }
      });
      this.setState({lajuCeriaSales:uploadedContent2, lajuCeriaSalesObj:objContent});
    }

    handleUploadKLCC = () => {
      console.log('handleUploadKLCC state: ', this.state);
      var uploadedContent = this.state.uploadedContent;
      var uploadedContent2 = this.state.uploadedContent && this.state.uploadedContent.split("\n");

      //uploadedContent2 = uploadedContent2.pop();
      // to remove the last \n - hardcode
      uploadedContent2.splice(24, 1);
      // console.log('uploadedContent2: ', uploadedContent2);
      var arrayContent = [];
      var objContent = {};

      uploadedContent2 && uploadedContent2.forEach((data,index)=>{
        arrayContent = data.split('|');
        // console.log('arrayContent: ', arrayContent);
        const machineId = arrayContent[0];
        const batchId = arrayContent[1];
        const date = arrayContent[2];
        const hour = arrayContent[3];
        const receiptCount = arrayContent[4];
        const totalnetSales = arrayContent[5];
        const totalSST = arrayContent[6];
        const totalDiscount = arrayContent[7];
        const totalServiceCharge = arrayContent[8];
        const totalPax = arrayContent[9];
        const totalCash =  arrayContent[10];
        const totalTNG = arrayContent[11];
        const totalVisa = arrayContent[12];
        const totalMasterCard = arrayContent[13];
        const totalAmex = arrayContent[14];
        const totalVoucher = arrayContent[15];
        const totalOthers = arrayContent[16];
        const sstRegistered = arrayContent[17];
      
        objContent[index]={
          machineId, batchId, date, hour, receiptCount, totalnetSales, totalSST, totalDiscount, totalServiceCharge,
          totalPax, totalCash, totalTNG, totalVisa, totalMasterCard, totalAmex, totalVoucher, totalOthers, sstRegistered
        }
      });

      this.setState({klccSales:uploadedContent2, klccSalesObj:objContent});
    }

    handleCombineSale = () => {
      console.log('handleCombineSale: ', this.state);
      const klccSalesObj = this.state.klccSalesObj;
      const lajuCeriaSalesObj = this.state.lajuCeriaSalesObj;
      var combinedObj = {};

      Object.entries(klccSalesObj).forEach(([keyklcc,valueklcc]) => {
        Object.entries(lajuCeriaSalesObj).forEach(([keylaju,valuelaju]) => {
          if (keyklcc === keylaju){
            combinedObj[keyklcc]={
              machineId:valuelaju.machineId, // 1
              batchId:valuelaju.batchId, // 2
              date:valuelaju.date, // 3
              hour:valuelaju.hour, // 4
              receiptCount:parseInt(valuelaju.receiptCount)+parseInt(valueklcc.receiptCount), // 5
              totalnetSales:parseFloat(parseFloat(valuelaju.totalnetSales)+parseFloat(valueklcc.totalnetSales)).toFixed(2), // 6
              totalSST:parseFloat(parseFloat(valuelaju.totalSST)+parseFloat(valueklcc.totalSST)).toFixed(2), // 7
              totalDiscount: parseFloat(parseFloat(valuelaju.totalDiscount)+parseFloat(valueklcc.totalDiscount)).toFixed(2), //8
              totalServiceCharge: (parseFloat(valuelaju.totalServiceCharge)+parseFloat(valueklcc.totalServiceCharge)).toFixed(2), // 9
              totalPax: parseFloat(valuelaju.totalPax)+parseFloat(valueklcc.totalPax), //10
              totalCash: (parseFloat(valuelaju.totalCash)+parseFloat(valueklcc.totalCash)).toFixed(2), //11
              totalTNG: (parseFloat(valuelaju.totalTNG)+parseFloat(valueklcc.totalTNG)).toFixed(2), //12
              totalVisa: (parseFloat(valuelaju.totalVisa)+parseFloat(valueklcc.totalVisa)).toFixed(2), //13
              totalMasterCard: (parseFloat(valuelaju.totalMasterCard)+parseFloat(valueklcc.totalMasterCard)).toFixed(2), //14
              totalAmex: (parseFloat(valuelaju.totalAmex)+parseFloat(valueklcc.totalAmex)).toFixed(2), //15
              totalVoucher:(parseFloat(valuelaju.totalVoucher)+parseFloat(valueklcc.totalVoucher)).toFixed(2), //16
              totalOthers:(parseFloat(valuelaju.totalOthers)+parseFloat(valueklcc.totalOthers)).toFixed(2), //17
              sstRegistered:'Y'
            }
          }
        });
      });

      console.log('combinedObj: ', combinedObj);

      var theString = '';
      var finalString = [];
      var finalArrayString = [];
      Object.entries(combinedObj).forEach(([key,value]) => {
        const hourKey = moment(key).format('HH');
        theString = `${value.machineId}|${value.batchId}|${value.date}|${value.hour}|${value.receiptCount}|${value.totalnetSales}|${value.totalSST}|${value.totalDiscount}|${value.totalServiceCharge}|${value.totalPax}|${value.totalCash}|${value.totalTNG}|${value.totalVisa}|${value.totalMasterCard}|${value.totalAmex}|${value.totalVoucher}|${value.totalOthers}|${value.sstRegistered}`;
        // finalString.concat(`${value.machineId} | ${value.batchId} | ${value.date} | ${value.hour} | ${value.receiptCount} | ${value.totalnetSales} | ${value.totalSST} | ${value.totalDiscount} | ${value.totalServiceCharge} | ${value.totalPax} | ${value.totalCash} | ${value.totalTNG} | ${value.totalVisa} | ${value.totalMasterCard} | ${value.totalAmex} | ${value.totalVoucher} | ${value.totalOthers} | ${value.sstRegistered}` + "\n");
        finalString = [theString];
        finalArrayString.push(finalString);
      });

      // console.log('klccSales: ', finalArrayString);
      var textoDownload = finalArrayString.join("\n");
      console.log("textoDownload", textoDownload);

      // var blob = new Blob(textoDownload, {type: "text/plain;charset=utf-8"});
      var blob = new Blob([textoDownload], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `H71000010_${moment('2021-04-07').tz('Asia/Kuala_Lumpur').startOf('day').format('YYYYMMDD')}`); 
    }

    handleViewAllVisitors = () => {
      console.log('handleViewAllVisitors: ' );
      const users = this.props.users || null;
      
      var visitors = [];
      users && users.forEach((v,k)=>{
        const packageId = v.get('packageId') || null;
        const joinDate = v.get('joinDate') || null;
        // const theTime = v.get('joinDate') || null;
        const name = v.get('name') || null;
        const phone = v.get('phone')||null;
        const email = v.get('email')||null;
        const source = v.get('referralSource')||null;
        if (!packageId){
          visitors.push({
            joinDate:moment(getTheDate(joinDate)).format('DD-MM-YYYY'),
            joinMoment:moment(getTheDate(joinDate)),
            theTime:moment(getTheDate(joinDate)).format('hh:mm:ss'),
            name,
            phone: '0' + phone,
            email,
            source,
          })
        }
      });
      visitors.sort((a,b) => moment(a.joinMoment).format('YYYYMMDD') - moment(b.joinMoment).format('YYYYMMDD'));
      // activeMember.sort((a,b) => a.memberstartDateMoment.format('YYYYMMDD') - b.memberstartDateMoment.format('YYYYMMDD'));
      var theCSVformat = this.ConvertToCSV(visitors);
      console.log('thevisitors: ', visitors);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "visitorsReport.csv");
    }

    handleViewVisitorsDaily = () => {
      console.log('handleViewVisitorsDaily: ' );
      const users = this.props.users || null;
      const startDate = '20200101';
      const todayDate = moment();
      const dayDiff =  Math.max(todayDate.diff(moment(startDate), 'days'));
      console.log('dayDiff: ', dayDiff);
      var addDays = 0;
      var daysArray = [];

      for (var i=0; i<=dayDiff; i++){
        const iterationStartMoment = moment(startDate).clone().add(addDays, 'days');
        addDays++;
        daysArray.push({daysMoment: iterationStartMoment, days: iterationStartMoment.format('DD MMM YYYY') })
      }

      console.log('daysArray: ', daysArray);

      var visitorsDaily = []
      daysArray.forEach((day)=>{
        console.log('theDay: ', day);
        const filteredUserVisitor = this.filteredVisitorUser(day.daysMoment.format('YYYYMMDD'));
        console.log('filteredUserVisitor: ', filteredUserVisitor);
        const filteredVisTTDI = this.filteredVisitorTTDI(day.daysMoment.format('YYYYMMDD'));
        console.log('filteredVisTTDI: ', filteredVisTTDI);

        // visitorsDaily[day.days]={size:filteredUserVisitor.size}
      });

      // console.log('visitorsDaily: ', visitorsDaily);


      // var theCSVformat = this.ConvertToCSV(visitors);
      // var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "visitorsReport.csv");
    }

    // btnLayout = (keyBtn, callback, isDisable, displayText) => {
    //    return <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
    //       <Button 
    //           key={keyBtn}
    //           onClick={()=>callback}
    //           disabled = {isDisable}
    //           >
    //           {displayText}
    //       </Button>
    //     </Grid>
    // }

    handleViewVisitorsDaily2 = () => {
      console.log('handleViewVisitorsDaily2:', this.props);
      const user = this.props.currentUser || null;
      const gantnerKLCC = this.props.gantnerKLCC || null;
      const gantnerTTDI = this.props.gantnerTTDI || null;

      const startDate = '20200101';
      const todayDate = moment();
      const dayDiff =  Math.max(todayDate.diff(moment(startDate), 'days'));
      var addDays = 0;
      var daysArray = [];

      for (var i=0; i<=dayDiff; i++){
        const iterationStartMoment = moment(startDate).clone().add(addDays, 'days');
        addDays++;
        daysArray.push({daysMoment: iterationStartMoment, days: iterationStartMoment.format('DD MMM YYYY') })
      }

      console.log('daysArray: ', daysArray);

      var visitorsDaily = [];
      var theCSVformatArray;
      daysArray.forEach((day)=>{
        console.log('theDay: ', day);
        
        const filteredVisTTDI = this.filteredVisitorTTDI(day.daysMoment.format('YYYYMMDD'));
        console.log('filteredVisTTDI: ', filteredVisTTDI);
        // visitorsDaily[day.days]={filteredVisTTDI}
        // theCSVformat = this.ConvertToCSV(filteredVisTTDI);
        //console.log('theCSVformat: ', theCSVformat);
        visitorsDaily.push(filteredVisTTDI);
      });

      console.log('visitorsDaily: ', visitorsDaily);
      // theCSVformatArray = this.ConvertToCSV2(visitorsDaily);
      theCSVformatArray = this.ConvertArrayToCSV(visitorsDaily);
      console.log('theCSVformatArray: ', theCSVformatArray);
      // theCSVformat = this.ConvertToCSV(visitorsDaily);
      // var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "visitorsDailyReport.csv");

    }

    handleViewPkgPromo2020 = () => {
      const users = this.props.users || null;
      const packages = this.props.packages || null;
      const userWithPkgPromo = users && users.filter((user)=>{
        const packageId = user.get('packageId')||null;
        if (packageId === packagesList[16] || packageId === packagesList[17] || packageId === packagesList[18] || packageId === packagesList[3] || packageId === packagesList[4]){
          return true;
        }
      });
      var userPkgPromoList = [];
      userWithPkgPromo && userWithPkgPromo.forEach((user)=>{
        const packageId = user.get('packageId')||null;
        const email = user.get('email')||null;
        const name = user.get('name')||null;
        const memberStartDate = user.get('autoMembershipStarts')? user.get('autoMembershipStarts'): user.get('membershipStarts')? user.get('membershipStarts'):null;
        const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
        const packageData = packages.get(packageId)||null;
        const packageName = packageData? packageData.get('name') : null;
        const promoJan2020 = user.get('promoJan2020')? user.get('promoJan2020'):'';
        const totalPayment = user.get('totalPayments')? user.get('totalPayments'):'';
        userPkgPromoList.push({
          name, 
          email, 
          startDate: moment(getTheDate(memberStartDate)).format('DD/MM/YYYY'), 
          endDate: moment(getTheDate(memberEndDate)).format('DD/MM/YYYY'), 
          packageId,
          packageName,
          promoJan2020,
          totalPayment
        });
      });
      const theCSVformat = this.ConvertToCSV(userPkgPromoList);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "userWithPkgPromoReport.csv");
    };

    handleViewCNY = () =>{
      console.log('handleViewVisitorsDaily2:', this.props);
      const cnyRef = this.props.cnyRef || null;
      console.log('cnyRef: ', cnyRef);

      const users = this.props.users||null;

      var angpowList = [];
      var angpowUser = [];

      cnyRef && cnyRef.forEach((angpow)=>{
        const currentUserEmail = angpow.get('currentUserEmail')||null;
        const currentUserName = angpow.get('currentUserName')||null;
        const referredToEmail = angpow.get('referredToEmail')|| null;
        const referredToName = angpow.get('referredToName')||null;
        const theTime = angpow.get('theTime')||null;
        const theDate = angpow.get('theDate')||null;
        const selectedAvatar = angpow.get('selectedAvatar')||null;
        const selectedCover = angpow.get('selectedCover')||null

        angpowUser.push({
          currentUserEmail, currentUserName, referredToEmail, referredToName, selectedAvatar, selectedCover, theDate, theTime
        });

        // angpowList.push({
        //   currentUserEmail, currentUserName, referredToEmail, referredToName, selectedAvatar, selectedCover, theDate, theTime
        // });
      });
   
      // angpowList.sort((a,b)=>{
      //   const currentUserEmailA = a.currentUserEmail||null;
      //   const currentUserEmailB = b.currentUserEmail||null;
      //   if (currentUserEmailA < currentUserEmailB) return -1;
      //   if (currentUserEmailB > currentUserEmailA) return 1; 
      //   return 0;
      // });

      console.log('angpowUser: ', angpowUser);
      users && users.forEach(user=>{
        const email = user.get('email')||null;
        const name = user.get('name')||null;
        const memberStartDate = user.get('autoMembershipStarts')? user.get('autoMembershipStarts'): user.get('membershipStarts')? user.get('membershipStarts'):null;
        const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
        if (email){
          angpowUser && angpowUser.forEach((angpow)=>{
            const currentUserEmail = angpow.currentUserEmail || null ;
            const referredToEmail = angpowUser.referredToEmail || null;
            const referredToName = angpowUser.referredToName || null;
            if (email === referredToEmail){
              // console.log('membershipStart: ', membershipStart);
              angpowList.push(angpow);
            }
          })
        }
        
      });

      // angpowList && angpowList.filter((angpow, index)=>{
      //   const email = angpow.referredToEmail || null;
      //   // if (angpow.referredToEmail.indexOf(angpow)===index)
      //   if (email.indexOf(angpow)===index){
      //     return true;
      //   }

      // });

      // angpowList = angpowList && angpowList.filter((v, i, a) => a.indexOf(v.referredToEmail) === i); 

      console.log('angpowlist: ', angpowList);
      var theCSVformat = this.ConvertToCSV(angpowList);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "angpowReport.csv");
    };

    handleDownLoadCNYAnalytic = () => {
      // console.log('cnyRefDataState: ', this.state.cnyRefData);
      const {cnyRefData} = this.state;

      var theCSVformat = this.ConvertToCSV(cnyRefData);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "angpowAnalyticReport.csv");
    }

    handleLoadCNYAnalytic = () =>{
      const cnyRefAnalytic = firebase.firestore().collection('cnyRefSimpleAnalytic').get();
      var cnyRefData = [];

      cnyRefAnalytic.then((querySnapshot)=>{
        querySnapshot.forEach(doc=>{
          console.log(doc.id, '=>', doc.data());
          cnyRefData.push(doc.data());
        });
        this.setState({cnyRefData});
      }).catch(function (error) {
        this.setState({ cnyRefData: null });
        console.log("Error getting document:", error);
      });

      console.log('cnyRefData: ', cnyRefData);
      // console.log('cnyRefDataState: ', this.state.cnyRefData);
    };

    render() {
      const {
        classes
      } = this.props;
  
      // console.log('users: ', this.props);
      // console.log('theState: ', this.state);

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      const isKLCC = email && email.indexOf('+klcc@babel.fit') !== -1 ? true : false;
  
      const users = this.props.users || null;
  
      const selectedUserId = this.state.selectedUserId;
      var userData = users && selectedUserId ? users.get(selectedUserId) : null;
      var selectedStaffId = null;
      if(!isAdmin && !isMC && isTrainer){
        selectedStaffId = user.get('id');
      }
      var selectedStaffChip = null;
      const selectedUserRoles = (userData && userData.get('roles')) || null;
      const selectedUserRolesIsAdmin = selectedUserRoles && roles.get('admin') === true;
      const selectedUserRolesIsMC = selectedUserRoles && selectedUserRoles.get('mc') === true;
      const selectedUserRolesIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
      const selectedUserRolesIsStaff = selectedUserRolesIsAdmin || selectedUserRolesIsMC || selectedUserRolesIsTrainer;
      if (selectedUserRolesIsStaff) {
        selectedStaffId = selectedUserId;
        const selectedStaffName = userData && userData.get('name');
        const selectedStaffImage = (userData && userData.get('image')) || null;
        const selectedStaffAvatar = selectedStaffName || (selectedStaffName && selectedStaffName.length > 0) ?
          (selectedStaffImage ? (<Avatar src={selectedStaffImage} />) : (<Avatar>{selectedStaffName.charAt(0).toUpperCase()}</Avatar>)) :
          null;
        selectedStaffChip = (
          <Chip
          avatar={selectedStaffAvatar}
          label={selectedStaffName}
          style={{marginLeft:'auto', marginRight:'auto', marginTop:16, fontSize:'1rem', fontWeight:'500'}}
          onDelete={()=>this.handleSelectPerson(null)}
          />
        );
      }

  
      return (
        <div className={classes.container}>
          <MenuAppBar />
            <Grid container spacing={24}>
              <Grid item xs={12} sm={8}>
              <Grid container style={{marginTop:32}}>   
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                    <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                        {'Generate All Adyen Payment Report'}   
                    </Typography>
                    <TextField
                        id="startDate"
                        label="Start Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('allAdyenStartDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="endDate"
                        label="End Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('allAdyenEndDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button 
                        key='generateReport' 
                        onClick={()=>this.generateAllAdyenPaymentReport()}
                        disabled = {!this.props.usersWithPayment}
                        margin="dense"
                        >
                        {'download'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                    <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                        {'Generate BFM Report'}   
                    </Typography>
                    <TextField
                        id="startDateBFM"
                        label="Start Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('BFMStartDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="endDateBFM"
                        label="End Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('BFMEndDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button 
                        key='generateReport' 
                        onClick={()=>this.handleGenBFMReport()}
                        disabled = {!this.props.usersWithPayment}
                        margin="dense"
                        >
                        {'download'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                    <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                        {'Getexpired member'}   
                    </Typography>
                    <Button 
                        key='generateReport' 
                        onClick={()=>this.handleExpiredMemberReport()}
                        disabled = {!this.props.expiredMember && !this.props.packages}
                        margin="dense"
                        >
                        {'download'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <Button 
                        key='allReferralsUser' 
                        onClick={()=>this.handleViewReferralReport()}
                        disabled = {!this.props.users}
                        >
                        {'Referral Report'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <Button 
                        key='theFinanceReport' 
                        onClick={()=>this.handleViewMonthlyReport()}
                        // disabled = {!this.props.getAllUsers}
                        // disabled = {!this.props.usersWithPayment}
                        >
                        {'Finance Report'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <Button 
                        key='userContactReport' 
                        onClick={()=>this.handleViewContactReport()}
                        disabled = {!this.props.packages}
                        >
                        {'All user with package Report'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <Button 
                        key='vendSale' 
                        onClick={()=>this.handleViewVendReport()}
                        disabled = {!this.props.vendSales}
                        >
                        {'Vend Report'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <Button 
                        key='financeIndividualReport' 
                        onClick={()=>this.handleViewFinanceIndividualReport()}
                        disabled = {!this.props.vendSales}
                        >
                        {'Vend Finance Report each user'}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='userReport' 
                      onClick={()=>this.handleViewAllUser()}
                      disabled = {!this.props.users}
                      >
                      {'All user Report'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllRawActiveMembers' 
                      onClick={()=>this.handleViewAllRawMembers()}
                      disabled = {!this.props.users}
                      >
                      {'View all Raw Members'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllComplimentaryPromo' 
                      onClick={()=>this.handleViewAllComplimentaryPromo()}
                      disabled = {!this.props.users}
                      >
                      {'View all complimentary Members'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllActiveMembers' 
                      onClick={()=>this.handleViewAllActiveMembers()}
                      disabled = {!this.props.users}
                      >
                      {'View all Active Members'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewNotShareAngPow' 
                      onClick={()=>this.handleViewNotShareCNY()}
                      disabled = {!this.props.users}
                      >
                      {'View not sharing angpow Members'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllinActiveMembers' 
                      onClick={()=>this.handleViewAllInActiveMembers()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'View all inActive Members'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllPayments' 
                      onClick={()=>this.handleViewAllPayments()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'View all payments'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllPaymentsHistory' 
                      onClick={()=>this.handleViewAllPaymentsHistory()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'View all payments By months'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllPaymentsDaily' 
                      onClick={()=>this.handleViewAllPaymentsDaily()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'View all payments daily'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllPaymentsFromVendSale' 
                      onClick={()=>this.handleViewAllPaymentsFromVend()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'View all payments from vend'}
                  </Button>
              </Grid>
               <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllPaymentsFromVendSale2' 
                      onClick={()=>this.removeAllPaymentsFromVend()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'Remove all payments from vend'}
                  </Button>
              </Grid>
               <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='modifyThevendSale' 
                      onClick={()=>this.modifyTheVendSale()}
                      // disabled = {!this.props.userWithInvoices}
                      >
                      {'manually modify the vend sale'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllActiveMembers' 
                      onClick={()=>this.handleViewAllMembersWithoutFreeze()}
                      disabled = {!this.props.users}
                      >
                      {'View all Active Members (without freeze)'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllMemberpkgpromo' 
                      onClick={()=>this.handleViewPkgPromo2020()}
                      disabled = {!this.props.users}
                      >
                      {'View member by package (promo2020)'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewAllVisitors' 
                      onClick={()=>this.handleViewAllVisitors()}
                      disabled = {!this.props.users}
                      >
                      {'View all visitors'}
                  </Button>
              </Grid>
              {false && this.btnLayout('viewVisitorsDaily', this.handleViewVisitorsDaily(), !this.props.users, 'View visitors daily')}
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewVisitorsDaily' 
                      onClick={()=>this.handleViewVisitorsDaily()}
                      disabled = {!this.props.users}
                      >
                      {'View visitors daily'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewVisitorsDaily2' 
                      onClick={()=>this.handleViewVisitorsDaily2()}
                      disabled = {!this.props.users}
                      >
                      {'View visitors daily2'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewCNYReport' 
                      onClick={()=>this.handleViewCNY()}
                      disabled = {!this.props.cnyRef}
                      >
                      {'View CNY Report'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewCNYReport' 
                      onClick={()=>this.handleLoadCNYAnalytic()}
                      >
                      {'Load CNY Analaytic Report'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewCNYReport' 
                      onClick={()=>this.handleDownLoadCNYAnalytic()}
                      >
                      {'Download CNY Analaytic Report'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='removePKPFreeze' 
                      onClick={()=>this.handleRemovePKPFreeze()}
                      >
                      {'remove PKP freeze'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewFreezingList' 
                      onClick={()=>this.handleViewFreeze()}
                      >
                      {'View PKP freeze'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='removeunpaidInvoice' 
                      onClick={()=>this.handleRemoveUnPaidInvoice()}
                      >
                      {'remove unpaid invoice'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewunpaidInvoice' 
                      onClick={()=>this.handleViewUnPaidInvoice()}
                      disabled = {!this.props.packages}
                      >
                      {'view unpaid invoice'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewGantner' 
                      onClick={()=>this.handleViewGantner()}
                      disabled = {!this.props.users}
                      >
                      {'view gantner logs'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewCVform' 
                      onClick={()=>this.handleViewCV19submit()}
                      disabled = {!this.props.users}
                      >
                      {'view CV forms'}
                  </Button>
              </Grid>
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewCVform' 
                      onClick={()=>this.handleUploadExerciseToFB()}
                      disabled = {!this.props.users}
                      >
                      {'upload new exxersices to csv'}
                  </Button>
                  <input type="file" accept=".csv" onChange={e => 
                      this.handleChangeFile(e.target.files[0])} /> 
              </Grid>
              <Button 
                  key='downloadCSV' 
                  onClick={()=>this.handleConvertToJSON()}
                  disabled = {!this.state.uploadedExerciseCSV}
                  >
                  {'save csv to firebase (start, All)'}
              </Button>
              <Button 
                  key='compareToFB' 
                  onClick={()=>this.handleCompareWithFB()}
                  disabled = {!this.state.uploadedExerciseCSV}
                  >
                  {'compare with firestore exercises collection'}
              </Button>
              <Button 
                  key='downloadfromFB' 
                  onClick={()=>this.handleDownloadFromFBToCSV()}
                  >
                  {'Download from FB to csv'}
              </Button>
              {(isAdmin || ((isMC || isTrainer) && isKLCC)) &&
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <UserList title ={'In Gym (KLCC)'} type={'inGymKLCCByDay'} searchText={''} filteredStaffId={selectedStaffId} useNew={true} selectAction={this.handleSelectPerson} open={true}/>
                </Grid>
              }
              {(isAdmin || ((isMC || isTrainer) && !isKLCC)) &&
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <UserList title ={'In Gym (TTDI)'} type={'inGymTTDI'} searchText={''} filteredStaffId={selectedStaffId} useNew={true} selectAction={this.handleSelectPerson} open={true}/>
                </Grid>
              }
               <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='uploadLaJuCeria' 
                      onClick={()=>this.handleUploadLaJuCeria()}
                      // disabled = {!this.props.users}
                      >
                      {'upload La Juceria Sales'}
                  </Button>
                  <input type="file" accept=".txt" onChange={e => 
                      this.handleChangeFile(e.target.files[0])} /> 
              </Grid>

              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='uploadKLCC' 
                      onClick={()=>this.handleUploadKLCC()}
                      // disabled = {!this.props.users}
                      >
                      {'upload KLCC'}
                  </Button>
                  <input type="file" accept=".txt" onChange={e => 
                      this.handleChangeFile(e.target.files[0])} /> 
              </Grid>

               <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='viewKLCCSales' 
                      onClick={()=>this.handleViewKLCCSalesSubmit()}
                      // disabled = {!this.props.users}
                      >
                      {'VIEW KLCC SALES'}
                  </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                  <Button 
                      key='combineSale' 
                      onClick={()=>this.handleCombineSale()}
                      disabled = {!this.state.lajuCeriaSales || !this.state.klccSales}
                      >
                      {'Combine Sale'}
                  </Button>
              </Grid>

              </Grid>
              </Grid>
            </Grid>
            <BabelLogo />
        </div>
      );
    }
  }
  
  Report.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const ReportStyled = withStyles(styles)(Report);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const getAllUsers = makeGetAllUsers();
    const getInvoicesUserItem = makeGetInvoicesMembersItems();
    const getPaymentsUserItem = makeGetPaymentsMembersItems();
    const getReferralUserItem = makeGetReferralsMembersItems();
    const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
    const getCurrentUserGantnerLogs = makeGetCurrentUserGantnerLogs();
    const getExpiredMember = makeGetExpiredMemberItems();
    const getFreezeMembersItems = makeGetFreezeMemberItems();
    const getCanceledMember = makeGetCancelledMemberItems();
    const getInGymKLCCItems = makeGetInGymKLCCItems();
    const getInGymTTDIItems = makeGetInGymTTDIItems();
    const getCnyRef = makeGetCnyRef();
    
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        // users: getAllUsers(state, props),
        //usersWithPayment: getPaymentsUserItem(state, props),
        //usersWithInvoices: getInvoicesUserItem(state, props),
        referralUsers: getReferralUserItem(state, props),
        packages: getPackagesList(state, props),
        freezePayments: getAllFreezePayments(state, props),
        selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
        // userGantnerLogs: getCurrentUserGantnerLogs(state, props),
        expiredMember: getExpiredMember(state, props),
        freezeItems: getFreezeMembersItems(state, props),
        canceledMembers: getCanceledMember(state, props),
        // vendSales: getAllVendSales(state, props),
        // vendProducts: getAllVendProducts(state, props),
        gantnerKLCC: getInGymKLCCItems(state, props),
        gantnerTTDI: getInGymTTDIItems(state, props),
        cnyRef: getCnyRef(state, props),
        freezePayment: getFreezePayments
        // getFreezePayments
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(ReportStyled)