import 'react-credit-cards/es/styles-compiled.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, CircularProgress, Card, CardContent, Collapse, Divider,
  Grid, List, ListItem, ListItemText, Typography, Dialog,  DialogActions,
  DialogContent, DialogTitle, BottomNavigation, BottomNavigationAction, Button,
  FormLabel, FormControl, FormGroup, FormControlLabel, Radio, RadioGroup,
  Checkbox, 
} from '@material-ui/core';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import LockIcon from '@material-ui/icons/Lock';
import moment from 'moment';
import StdButton from './components/StdButton';
import StdText from './components/StdText';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import BabelLogo from './BabelLogo';
import UserPayments from './UserPayments';


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
    marginTop: 10
  },
  formContainer: {
  },
  card: {
    paddingBottom: 10
  },
  content: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  button: {
    fontSize: "0.875rem",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#fde298",
    color: '#062845',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
    width: '100%',
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd',
    '&:hover': {
      color: "#fde298",
      background: '#062845'
    },
  },
  buttonDisabled: {
    fontSize: "0.875rem",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#ccc",
    color: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
    width: '100%',
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd'
  },
  bookButton: {
    margin: 1,
    backgroundColor: "#fde298",
    color: '#fff',
  },
  red: {
    color: 'red',
    // backgroundColor:'red',
  },
  bottomNav: {
    bottom: 0,
    position: 'fixed',
    zIndex: 1200,
    width: '100%',
    flex: 1
  }
});

let checkout = null;
let checkoutValid = false;
const unlimitedOutdoorClassVendId = "347cf233-d5d7-f452-dd2b-f533f7271a04";
const faizulmembershipvID = "8aea002d-7eaa-1a6b-362d-933243a75823";
const isSSTStartDate = '20200626';
const vBuyAug20SingleAccess = '83d318ff-64ab-3cc8-9ba4-98f740bc48f2';
const vBuyAug20AllAccess = '211aad2d-0a2a-fdc7-d79a-7eabc28d5994';
const vBuySep2020 = 'e4c23eae-4a4d-9191-f92f-98afe0e3dd08';
const vBuyMidSep2020Single = 'e456b524-4689-49eb-808a-08b9a3700aa3';
const vBuyMidSep2020AllAccess = 'e1611259-cb7b-1854-df22-2f9a672233ba';
const vAngpauSingleAccess = `152eea01-07e2-44bb-99f5-f5709db96bb9`;
const vAngpauAllAccess = `51644068-46f7-46a0-8704-4de89d5b89e3`;

class PaymentsAdyen extends React.Component {

  state = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    focused: 'number',
    card: {
      issuer: '',
      isValid: false
    },
    merchantIds: {
      visa: '3301664172',
      mastercard: '5501652978'
    },
    secCode: 'BFITMYP01',
    secString: '',
    secKeyReq: '',
    invoiceNo: 'BFITPBMERCHPAY000011',
    amount: '000000000000',
    postURL: 'https://us-central1-babel-2c378.cloudfunctions.net/addTransaction',
    // postURL: 'https://us-central1-babel-2c378.cloudfunctions.net/addTransactionTest',
    paymentHistoryOpen: false,
    infoDialogOpen:false,
    freeGift:'',
    luckyDraw:'',

    paymentSessionData: {
      amount: {
        value: 0,
        currency: "MYR"
      },
      reference: null,
      merchantAccount: "BabelTestBFIT",
      shopperReference: null,
      html: true,
      origin: 'https://app.babel.fit',
      returnUrl: 'https://app.babel.fit',
      // origin: 'http://192.168.2.5:3000',
      // returnUrl: 'http://192.168.2.5:3000',
      // origin: 'http://10.91.7.63:3000',
      // returnUrl: 'http://10.91.7.63:3000',
      countryCode: "MY",
      enableRecurring: true,
      enableOneClick:true,
      sdkVersion:'1.3.0'
      // sdkVersion:'1.9.5'
    },
    checked1:false,
    checked2:false,
    checked3:false,
    checkedPromo:false,
    checkedPromo2:false,
    isPaying:false,
    checkoutValid:false
  }

  componentDidMount() {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.innerHTML = "document.write('This is output by document.write()!')";
    s.src = "https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSDK.1.3.0.min.js";
    // s.src = "https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSDK.1.9.14.min.js";
    // this.instance.appendChild(s);
    // window.instance.appendChild(s);
    var head = document.getElementsByTagName('head').item(0);
    head.appendChild(s);

    // const invoiceId = this.props.match.params.invoiceId;
    // if (invoiceId) {
    //   this.props.actions.bootstrap(this.props.actions.getInvoiceAndDataById(invoiceId));
    // }
    // this.handleSubmit();
    // <script type="text/javascript" src="https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSDK.1.9.7.min.js"></script>
  }

  componentDidUpdate(prevProps){
    const invoiceId = this.props.match.params.invoiceId;
    const prevInvoiceData = prevProps.state.hasIn(['invoices', 'invoicesById']) ? prevProps.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const invoiceData = this.props.state.hasIn(['invoices', 'invoicesById']) ? this.props.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const userId = invoiceData && invoiceData.get('userId');
    if(invoiceData && userId && prevInvoiceData !== invoiceData){
      this.handleSubmit();
    }

  }

  handleClickPaymentHistory = () => {
    this.setState({
      paymentHistoryOpen: !this.state.paymentHistoryOpen
    });
  };

  handleChange = name => event => {

    var updatedState = {};
    if (name === 'cardNumber') {
      updatedState.focused = 'number';
    } else if (name === 'expiryDate') {
      updatedState.focused = 'expiry';
    } else if (name === 'cvv') {
      updatedState.focused = 'cvc';
    }

    updatedState[name] = event.target.value;

    this.setState({ ...updatedState
    });
  }

  // handleChangeInfo = name => event => {
  //
  //   var updatedState = {};
  //   updatedState[name] = event.target.value;
  //
  //   console.log(updatedState);
  //   this.setState({ ...updatedState
  //   });
  // }

  handleChangeFreeGift = (event, value) => {
    // console.log(event, 'value', value);
    this.setState({ freeGift:value });
  };

  handleChangeLuckyDraw = (event, value) => {
    // console.log(event, 'value', value);
    this.setState({ luckyDraw:value });
  };

  handleSavePromoForUser = (userId) =>{
    const invoiceId = this.props.match.params.invoiceId;
    const invoiceData = this.props.state.hasIn(['invoices', 'invoicesById']) ? this.props.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const invoiceIsNewMonthly = invoiceData && invoiceData.get('vendProducts');
    const vendProductId = invoiceData && invoiceData.get('vendProductId');
    const invoiceIs6Month = vendProductId && vendProductId === '98f9aab1-1c0b-1673-52e5-d9216a84b509';
    const invoiceIs12Month = vendProductId && vendProductId === '0af7b240-aba0-11e7-eddc-dbd880f58a4f';


    var freeGift = this.state.freeGift;
    if(!freeGift){
      if(invoiceIsNewMonthly){
        freeGift = "1 Technogym Band";
      }else if(invoiceIs6Month){
        freeGift = "1 Technogym Band, 3 PT Sessions";
      }else if(invoiceIs12Month){
        freeGift = "1 Technogym Band, 5 PT Sessions";
      }
    }

    const luckyDraw = this.state.luckyDraw || "1 Week VIP Pass";
    this.props.actions.saveUserData(userId, {freeGift:freeGift, luckyDraw:luckyDraw});
    this.props.actions.viewPromo();
  }

  handleClose = () =>{
    this.setState({infoDialogOpen:false});
  }

  handleSubmit = (event) => {
    event && event.preventDefault();
    const invoiceId = this.props.match.params.invoiceId;
    const invoiceData = this.props.state.hasIn(['invoices', 'invoicesById']) ? this.props.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const userId = invoiceData && invoiceData.get('userId');
    const amount = invoiceData && invoiceData.get('amount');
    const createdAt = invoiceData && invoiceData.get('createdAt');
    const totalPrice = invoiceData && invoiceData.get('totalPrice');
    const isWithSSTAmount = moment(Actions.getTheDate(createdAt)).isAfter(isSSTStartDate)?true:false;
    // const type = 
    // console.log('isWithSSTAmount: ', isWithSSTAmount);

    const amountInt = isWithSSTAmount? parseInt(amount):parseInt(amount);
    var paymentSessionData = this.state.paymentSessionData;
    if(invoiceId){
      paymentSessionData.reference = invoiceId;
      paymentSessionData.returnUrl = `https://app.babel.fit/payments/${invoiceId}`
      // paymentSessionData.returnUrl = `http://192.168.2.5:3000/payments/${invoiceId}`
    }
    if(userId){
      paymentSessionData.shopperReference = userId;
    }
    if(amountInt){
      paymentSessionData.amount.value = amountInt;
    }
    // invoiceData && console.log(invoiceId, invoiceData.toJS());
    // console.log(paymentSessionData);

    if(!paymentSessionData.reference || invoiceData.get('paid')){
      return;
    }

    this.props.actions.getPaymentSession(paymentSessionData, (body=>{

      var translationObject = {
           "payButton" : {
             "formatted":{
               "en_US" : "Pay %@",
               "en_GB" : "Pay %@",
               "en_MY" : "Pay %@"
             },
             "en_US" : "Pay",
             "en_GB" : "Pay",
             "en_MY" : "Pay",
          },
          // "storeDetails" : {
          //   "en_US" : "Save for my next payment and charge me automatically for membership dues if any",
          //   "en_GB" : "Save for my next payment and charge me automatically for membership dues if any",
          //   "en_MY" : "Save for my next payment and charge me automatically for membership dues if any",
          // }
      };

      var sdkConfigObj = {
        context: 'live',
        translations : translationObject,
        allowAddedLocales: true,
        // initiatePayment:false
      };

      checkoutValid = body && body.data && body.data.paymentSession ? true : false;
      if(this.state.checkoutValid !== checkoutValid){
        // console.log('checkoutValid', this.state.checkoutValid, checkoutValid);
        this.setState({checkoutValid:checkoutValid});
      }
      // console.log('body',body.data);
      // console.log('paymentsd',paymentSessionData);
      checkout = window.chckt.checkout(body.data, '#checkout', sdkConfigObj);
      
      // if (checkoutValid === true){
      //   this.props.actions.addRecurring(userId);
      // }

      // console.log("checkout", checkout);
      // console.log("chckt", window.chckt);
      // window.chckt.hooks.getDataFromSubmissionProcess = function(checkoutNode/*HTML Node*/, formData/*JSON string*/){
      //   // Add your logic here
      //   console.log("fd", formData);
      //   return true;
      // }
      // window.chckt.hooks.onSubmitAction = function(actionButton/*HTML Node*/, extraData/*Object*/){
      //
      //   console.log("ed", extraData);
      //
      //   // Hide the 'pay' & 'show more payment methods' buttons
      //   window.chckt.toggleActionButton(false);
      //   window.chckt.toggleShowMorePMsButton(false);
      //
      //   // Give all paymentMethod divs a disabled state
      //   window.chckt.toggleEnableAllPaymentMethods(false);
      //
      //   // Block default functionality
      //   return true;
      // }
      // console.log('ck',checkout);
    }));
  }

  // if membership package, return true
getMembershipPackage (packageId){
  if (packageId 
    //&& (
    // packageId==='89THMCx0BybpSVJ1J8oz' // 6 month term (all clubs)
    // || packageId==='BKcaoWGrWKYihS40MpGd' // CP290
    // || packageId==='DjeVJskpeZDdEGlcUlB1' // 6M term renewal
    // || packageId==='L6sJtsKG68LpEUH3QeD4' // complimentaryPromo
    // || packageId==='LNGWNSdm6kf4rz1ihj0i' // 3M Jan2020 Promo All Clubs
    // || packageId==='TJ7Fiqgrt6EHUhR5Sb2q' // monthly all clubs
    // || packageId==='VWEHvdhNVW0zL8ZAeXJX' // 12M Term renewal club
    // || packageId==='WmcQo1XVXehGaxhSNCKa' // yearly
    // || packageId==='ZEDcEHZp3fKeQOkDxCH8' // CP180
    // || packageId==='aTHIgscCxbwjDD8flTi3' // 3 term all clubs
    // || packageId==='duz1AkLuin8nOUd7r66L' // 6 month
    // || packageId==='dz8SAwq99GWdEvHCKST2' // CP210
    // || packageId==='eRMTW6cQen6mcTJgKEvy' // CP310
    // || packageId==='k7As68CqGsFbKZh1Imo4' // 3M Jan2020
    // || packageId==='q7SXXNKv83MkkJs8Ql0n' // 12M term all clubs
    // || packageId==='vf2jCUOEeDDiIQ0S42BJ' // monthly 250
    // || packageId==='w12J3n9Qs6LTViI6HaEY' // 3M Jan2020 promo
    // || packageId==='wpUO5vxWmme7KITqSITo' // CP230
    // || packageId==='yKLfNYOPzXHoAiknAT24' //complimentary
    // || packageId==='yQFACCzpS4DKcDyYftBx' // 3M Term Membership
    // || packageId===
    // )
    ){
      return true
    }
    else{
      return false
    }
}

  render() {
    const {
      classes,
      state
    } = this.props;

    // return <div ref={el => (this.instance = el)} />;

    const invoiceId = this.props.match.params.invoiceId;
    const invoiceData = this.props.state.hasIn(['invoices', 'invoicesById']) ? this.props.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const userId = invoiceData && invoiceData.get('userId');
    const userData = userId && this.props.state.hasIn(['users', 'usersById']) ? this.props.state.getIn(['users', 'usersById', userId]) : null;
    const packageId = (invoiceData && invoiceData.get('packageId')) || (userData && userData.get('packageId'));
    const packageData = packageId && this.props.state.hasIn(['packages', 'packagesById', packageId]) ? this.props.state.getIn(['packages', 'packagesById', packageId]) : null;
    // console.log(invoiceId, userId, packageId);
    // console.log(invoiceData, userData, packageData);
    const invoiceNotFound = state.has('invoiceNotFound') && state.get('invoiceNotFound') ? true : false;
    // console.log(invoiceNotFound);

    const augSingleAccessAgreement = 'I understand and agree that this membership package requires a total payment of RM596.78, made payable via debit card or credit card for my first month’s payment (RM66.78), second month’s payment (RM265.00) and third month’s payment (RM265.00) via monthly auto-debit on my billing date.';
    const augAllAccessAgreement = 'I understand and agree that this membership package requires a total payment of RM766.38, made payable via debit card or credit card for my first month’s payment (RM66.78), second month’s payment (RM349.80) and third month’s payment (RM349.80) via monthly auto-debit on my billing date.';
    const septAllAccessAgreement1 = 'I understand and agree that this membership promotion package is for 4 months. Freezing of the membership is allowed during the membership promotion package period, however, there will not be a complimentary month credited upon expiry of this package.'
    const septAllAccessAgreement2 = 'I agree that I can apply for a refund during the first 2 months of the membership, subjected to the minimum notice period and criteria stated in the terms and conditions. Refunds are only made for the remaining unused months. Upon expiry of the membership promotion package, I understand and agree that my membership will be automatically converted into a monthly All Access membership at the relevant shelf rate unless I have informed Babel at least 7 days in advance by emailing to hello@babel.fit.'
    const septmidPromoAgreement1 = 'I understand and agree that this membership package requires a total payment of RM716.56, made payable via debit card or credit card for my first month’s payment (RM16.96), second month’s payment (RM349.80) and third month’s payment (RM349.80) via monthly auto-debit on my billing date. Upon expiry of the membership promotion package, I understand and agree that my membership will be automatically converted into a monthly All Access membership at the relevant shelf rate unless I have informed Babel at least 7 days in advance by emailing to hello@babel.fit.'
    const septmidPromoAgreement2 = ''
    // console.log('sepmidpromoState: ', this.state);

    if (invoiceNotFound) {
      return (
        <div className={classes.container}>
          <MenuAppBar />
          <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center', padding:16}}>
            {"Page Not Found or Invoice link is expired"}
          </Typography>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'center', padding:16}}>
            {"Sorry, your link appears to be broken. Please contact support@babel.fit if you believe this is an error."}
          </Typography>
          <BottomNavigation
            value={0}
            showLabels
            classes={{root:classes.bottomNav}}
          >
            <BottomNavigationAction label={"Cancel"} icon={<CloseIcon />} onClick={()=>this.props.actions.viewNext()} />
          </BottomNavigation>
        </div>
      );
    } else if (!invoiceData) {
      return (
        <div className={classes.container}>
          <MenuAppBar />
          <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
        </div>
      );
    }

    const isValid = this.state.card.isValid && this.state.cvv && this.state.cvv.length === 3 && this.state.expiryDate && this.state.expiryDate.length === 4;

    const userName = userData && userData.get('name');
    const userIsPromo = userData && userData.get('joiningPromo') && userData.get('joiningPromo') === 'IN Festival' && (moment().isSame(moment('2018-09-22'), 'day') || moment().isSame(moment('2018-09-22'), 'day'));
    // for membership type only
    const userBillingDate = invoiceData.get('billingDate')? moment(Actions.getTheDate(invoiceData.get('billingDate'))).format('DD MMMM YYYY') : null;
    const invoiceDate = invoiceData.get('createdAt') ? moment(Actions.getTheDate(invoiceData.get('createdAt'))).add(0, 'days').format('DD MMMM YYYY') : null;
    var invoicePaid = invoiceData.get('paid') ? invoiceData.get('paid') : false;
    const paymentDate = (invoiceData.get('receiptMailedAt') && invoicePaid)? moment(Actions.getTheDate(invoiceData.get('createdreceiptMailedAtAt'))).format('DD MMMM YYYY') : moment(Actions.getTheDate(invoiceData.get('createdAt'))).add(3, 'days').format('DD MMMM YYYY'); 
    const invoiceRefunded = invoiceData.get('refunded') ? invoiceData.get('refunded') : false;
    const invoiceAmount = invoiceData.get('amount') ? invoiceData.get('amount') : '000000000000';
    const hasSST = invoiceData.get('hasSST') || invoiceData.get('withSST');
    var invoiceCurrentPrice = invoiceData.get('unitPrice') ? parseInt(invoiceData.get('unitPrice')) : 0;
    const invoiceQuantity = invoiceData.get('quantity') ? invoiceData.get('quantity') : 1;
    const paymentFailedString = invoiceData.get('paymentFailed') === true && !invoicePaid ? 'Previous payment failed. Please try again.' : null;
    const paymentId = invoiceData.get('paymentId') ? invoiceData.get('paymentId') : null;
    const receiptMailedAt = invoiceData.get('receiptMailedAt') ? invoiceData.get('receiptMailedAt'):null;
    const paymentItems = invoiceData.get('paymentItems')? invoiceData.get('paymentItems'):null;

    var showLoadingForPayments = false;
    var userPaymentItems = [];
    var packageDisplayString = '';
    var packageName = '';
    var packageAgreementArray = [];
    const packageMonthlyFee = packageData && (typeof(packageData.get('monthlyFee')) === 'string'? packageData.get('monthlyFee'):null);
    const packageMonthlyFeeString = packageMonthlyFee && `RM${packageMonthlyFee}`;
    const packageAgreements = packageData && packageData.get('agreements');
    // console.log('packageAgreements: ', packageAgreements);

    if (packageAgreements){
      packageAgreements && packageAgreements.forEach(data=>{
        packageAgreementArray.push(data);
        // packageAgreementArray.push(<>);
      })
    }

    console.log('packageAgreementArray: ', packageAgreementArray);

    if (packageId && (invoiceData && invoiceData.get('packageId'))) {
      console.log('packageId: ', packageId);
      packageName = (packageData && packageData.get('name')) || '';
      if(packageName.indexOf('Corporate') !== -1){
        packageName = 'Corporate';
      }
      // console.log('packageName: ', packageName);
      var packageStrings = packageName.split(' ');
      // packageDisplayString = packageStrings.length > 0 ? `${packageStrings[0]} Package` : `${packageName} Package`;
      packageDisplayString = `${packageName}`;
      var membershipPeriodMoments = [];
      var membershipPeriods = [];
      const packageRenewalTerm = packageData && packageData.has('renewalTerm') ? packageData.get('renewalTerm') : null;
      if (packageRenewalTerm === 'month') {
        const membershipStartsDate = userData && userData.has('autoMembershipStarts') ? Actions.getTheDate(userData.get('autoMembershipStarts')) : (userData && userData.has('membershipStarts') ? Actions.getTheDate(userData.get('membershipStarts')) : null);
        const invoiceCreatedDate = invoiceData && invoiceData.has('createdAt') ? Actions.getTheDate(invoiceData.get('createdAt')): null;

        const membershipStartsMoment = membershipStartsDate && moment(membershipStartsDate);
        const invoiceCreatedMoment = invoiceCreatedDate && moment(invoiceCreatedDate);

        const monthsDiff = invoiceCreatedMoment.diff(membershipStartsMoment, 'months') + 1;
        // console.log(monthsDiff, membershipStartsDate, invoiceCreatedDate);

        if (membershipStartsMoment){
          for (var i = 0; i < monthsDiff; i++) {
            const iterationStartMoment = membershipStartsMoment.clone().add(i, 'months');
            const iterationEndMoment = membershipStartsMoment.clone().add(i + 1, 'months');
            membershipPeriodMoments.push([iterationStartMoment, iterationEndMoment]);
            membershipPeriods.push(`${iterationStartMoment.format('D MMM')} - ${iterationEndMoment.format('D MMM YYYY')}`);
          }
        }
      }

      // console.log(membershipPeriods);

      const userPayments = userId && this.props.state && this.props.state.hasIn(['payments', 'paymentsByUserId', userId]) ? this.props.state.getIn(['payments', 'paymentsByUserId', userId])
        .filter(x => x.get('status') !== 'FAILED').sort((a, b) => {
          const nameA = a.get('createdAt');
          const nameB = b.get('createdAt');
          if (nameA < nameB) {return -1}
          if (nameA > nameB) {return 1}

          const sourceA = a.get('source');
          const sourceB = b.get('source')
          if (sourceA === 'join') {return -1}
          if (sourceB === 'join') {return 1}
          return 0;
        }) : null;

      var unusedFreezes = [];
      userPaymentItems = [];
      var index = 0;
      var primaryText = membershipPeriods[index];
      var secondaryText = `Unpaid`;

      userPayments && userPayments.toKeyedSeq().forEach((v, k) => {
        if (v.get('type') === 'membership' && v.get('source') === 'freeze') {
          unusedFreezes.push([v, k]);
        }
      });

      userPayments && userPayments.toKeyedSeq().forEach((v, k) => {
        primaryText = membershipPeriods[index];

        const periodMoments = membershipPeriodMoments[index];
        if (!periodMoments) {
          return;
        }
        const periodStartMoment = periodMoments[0];
        const periodEndMoment = periodMoments[1];
        var foundUnusedFreeze = false;
        unusedFreezes.forEach(([freezeData, freezeKey]) => {

          const unusedFreezeFor = Actions.getTheDate(freezeData.get('freezeFor'));
          const unusedFreezeForMoment = unusedFreezeFor && moment(unusedFreezeFor);
          unusedFreezeForMoment.add(1, 'months');

          if (!foundUnusedFreeze && unusedFreezeForMoment && unusedFreezeForMoment.isBetween(periodStartMoment, periodEndMoment, 'day', '(]')) {
            foundUnusedFreeze = true;
            secondaryText = 'Freeze';
            // console.log('freeze', primaryText);

            userPaymentItems.push(
              <ListItem divider button key={freezeKey}>
                <ListItemText primary={primaryText} secondary={secondaryText} />
              </ListItem>
            );
            index += 1;
          }
        });

        const quantity = v.get('quantity') ? v.get('quantity') : 1;
        for (var i = 0; i < quantity; i++) {
          primaryText = membershipPeriods[index];

          const type = v.get('type');
          if (type === 'membership') {
            const packageId = v.get('packageId');
            const paymentSource = v.get('source');
            const createdAtText = `${moment(Actions.getTheDate(v.get('createdAt'))).format('Do MMM YYYY')}`;
            if (packageId) {
              secondaryText = `Paid on ${createdAtText}`;
            } else if (paymentSource === 'freeze') {
              return;
            } else if (paymentSource === 'join') {
              secondaryText = `Paid on ${createdAtText}`;
            } else if (paymentSource === 'free') {
              secondaryText = `Free on ${createdAtText}`;
            } else if (paymentSource === 'refer') {
              const referredUserId = v.get('referredUserId');
              const referredUser = referredUserId && this.props.state.has('users') ? this.props.state.getIn(['users', 'usersById', referredUserId]) : null;
              const referredUserName = referredUser && referredUser.get('name') ? referredUser.get('name') : 'member';
              secondaryText = `Free Month - Referred ${referredUserName} on ${createdAtText}`;
            }
          }

          userPaymentItems.push(
            <ListItem divider button key={k}>
              <ListItemText primary={primaryText} secondary={secondaryText} />
            </ListItem>
          );

          index += 1;

        }
      });

      if (index < membershipPeriods.length) {
        for (var i = index; i < membershipPeriods.length; i++) {
          primaryText = membershipPeriods[index];

          const periodMoments = membershipPeriodMoments[index];
          const periodStartMoment = periodMoments[0];
          const periodEndMoment = periodMoments[1];
          var foundUnusedFreeze = false;
          unusedFreezes.forEach(([freezeData, freezeKey]) => {

            const unusedFreezeFor = Actions.getTheDate(freezeData.get('freezeFor'));
            const unusedFreezeForMoment = unusedFreezeFor && moment(unusedFreezeFor);
            unusedFreezeForMoment.add(1, 'months');

            if (!foundUnusedFreeze && unusedFreezeForMoment && unusedFreezeForMoment.isBetween(periodStartMoment, periodEndMoment, 'day', '(]')) {
              foundUnusedFreeze = true;
              secondaryText = 'Freeze';
              userPaymentItems.push(
                <ListItem divider button key={freezeKey}>
                  <ListItemText primary={primaryText} secondary={secondaryText} />
                </ListItem>
              );
            }
          });

          if (!foundUnusedFreeze) {
            secondaryText = `Unpaid`;
            userPaymentItems.push(
              <ListItem divider button key={i}>
                <div>
                  {primaryText &&
                    <Typography
                      type="subheading"
                    >
                      {primaryText}
                    </Typography>
                  }
                  {secondaryText &&
                    <Typography
                      color="secondary"
                      type="body1"
                      style={{color:'red'}}
                    >
                      {secondaryText}
                    </Typography>
                  }
                </div>
              </ListItem>
            );
          }

          index += 1;
        }
      }

      for (var i = index; i < membershipPeriods.length; i++) {

        primaryText = membershipPeriods[i];
        secondaryText = `Unpaid`;

        userPaymentItems.push(
          <ListItem divider button key={i}>
            <div>
              {primaryText &&
                <Typography
                  type="subheading"
                >
                  {primaryText}
                </Typography>
              }
              {secondaryText &&
                <Typography
                  color="secondary"
                  type="body1"
                  style={{color:'red'}}
                >
                  {secondaryText}
                </Typography>
              }
            </div>
          </ListItem>
        );
      }

      // userPaymentItems.reverse();
      // console.log(userPayments && userPayments.count());
      // console.log(invoicePaid, paymentId);
      showLoadingForPayments = userPayments ? false : true;
    } else if(invoiceData.get('vendProducts')) {
      const vBuyJan2020Single = '4933bd88-e457-243c-9751-f98768f74473';
      const vBuyJan2020AllAccess = 'b9c3f298-2a65-319f-cfee-58dd029a3cba';
      const vendProductItems = invoiceData.get('vendProducts').toJS();
      vendProductItems.length > 0 && vendProductItems.forEach(vendProductItem=>{
        console.log('vendProductItem: ', vendProductItem);
        if(vendProductItem.vendProductId === 'b910986f-cc5e-797b-22eb-16d329593138'){
          packageDisplayString = 'Monthly Membership';
          invoiceCurrentPrice = 250;
        }
        else if(vendProductItem.vendProductId === '98f9aab1-1c0b-1673-52e5-d9216a84b509'){
          packageDisplayString = '6 Month Term Membership';
          invoiceCurrentPrice = 1500;
        }
        else if((vendProductItem.vendProductId === vBuyJan2020Single)||(vendProductItem.vendProductId === vBuyJan2020AllAccess)){
          invoiceCurrentPrice = vendProductItem.totalPrice;
          packageDisplayString = vendProductItem && vendProductItem.vendProductName;
        }
        else{
          packageDisplayString = vendProductItem && vendProductItem.vendProductName;
        }
      });
      // packageDisplayString = invoiceData && invoiceData.get('vendProductName');
    } else {
      packageDisplayString = invoiceData && invoiceData.get('vendProductName');
      console.log('else, packageDisplayString: ', packageDisplayString);
    }

    const invoiceIsNewMonthly = invoiceData && invoiceData.get('vendProducts');
    const vendProductId = invoiceData && invoiceData.get('vendProductId');
    const invoiceIs6Month = vendProductId && vendProductId === '98f9aab1-1c0b-1673-52e5-d9216a84b509';
    const invoiceIs12Month = vendProductId && vendProductId === '0af7b240-aba0-11e7-eddc-dbd880f58a4f';


    // console.log('vendId: ', vendProductId);

    var freeGift = this.state.freeGift;
    if(!freeGift){
      if(invoiceIsNewMonthly){
        freeGift = "1 Technogym Band";
      }else if(invoiceIs6Month){
        freeGift = "1 Technogym Band, 3 PT Sessions";
      }else if(invoiceIs12Month){
        freeGift = "1 Technogym Band, 5 PT Sessions";
      }
    }

    // determine if payment is need to seperated with SST
    const showSST = (invoiceData.get('tax') || invoiceData.get('withSST'))? true:false;
    // console.log('showSST: ', showSST);
    const invoicePackageId =  packageId && (invoiceData && invoiceData.get('packageId'));
    const promoType = invoiceData && invoiceData.get('promoType');
    const isAutoInvoice = invoiceData && invoiceData.get('isAutoInvoice');
    const invoiceType = invoiceData && invoiceData.get('type');
    const containFreeMonth = invoiceData && invoiceData.get('containFreeMonth');
    const freeMonthPackageId = invoiceData && invoiceData.get('freeMonthPackageId');
    const freeMonthQty = invoiceData && invoiceData.get('freeMonthQty');
    // const freePackageData = freeMonthPackageId && this.props.state.hasIn(['packages', 'packagesById', freeMonthPackageId]) ? this.props.state.getIn(['packages', 'packagesById', freeMonthPackageId]) : null;
    // const freePackageName = freePackageData && freePackageData.has('name') ? freePackageData.get('name') : null;
    // console.log('invoiceType: ', invoiceType);
    // console.log('promoType: ', promoType);
    // console.log('invoicePackageId: ', invoicePackageId);
    const isMembershipType = invoicePackageId? this.getMembershipPackage(invoicePackageId) : false;
    // console.log('isMembershipType: ', isMembershipType);
    const isAfterSSTStartDate = moment(Actions.getTheDate(invoiceData.get('createdAt'))).isAfter(isSSTStartDate)?true:false;

    const luckyDraw = this.state.luckyDraw || "1 Week VIP Pass";
    const invoiceNo = invoiceId;
    const amount = invoiceAmount;
    // console.log('amount: ', amount);
    // const amountString = amount ? `${`RM${parseInt(amount)}`.slice(0, -2)}.00` : '';
    // const amountString = amount? (amount === '000000000000')? `${`RM${parseInt(amount)}`}.00`:`${`RM${parseInt(amount)}`.slice(0, -2)}.00` : '';
    // const amountString = (parseFloat(amount).toFixed(2)).toString();
    const amountString = `RM ${(parseFloat(amount)/100).toFixed(2)}`;
    // console.log('amountString: ', amountString);
    const totalAmountWithoutTax = invoiceData.get('totalPrice')? invoiceData.get('totalPrice'):null;
    // check if price is combined with SST
    const subtotalAmount = invoiceData.get('tax')? (parseFloat(totalAmountWithoutTax)) - parseFloat(invoiceData.get('tax')) : (parseFloat(amount)/1.06)/100;
    // const sstTax = invoiceData.get('tax')? parseFloat(invoiceData.get('tax')).toFixed(2) : isAfterSSTStartDate? 0: (parseFloat(amount)/100)*0.06;
    // console.log('sstTax: ', sstTax);
    // const subtotalAmount = (parseFloat(amount)/100)-sstTax;
    // console.log('subtotalAmount: ', subtotalAmount);
    const taxAmount = invoiceData.get('tax')? invoiceData.get('tax') : (parseFloat(amount)/100)-subtotalAmount;
    // console.log('taxAmount: ', taxAmount);
    // const baseSubtotalString = hasSST ? (subtotalAmount === 0)? `RM${subtotalAmount}00`:`RM${subtotalAmount}` : amountString;
    
    // const subtotalString = hasSST ? baseSubtotalString.substring(0, baseSubtotalString.length-2) + '.' + baseSubtotalString.substring(baseSubtotalString.length-2, ) : baseSubtotalString;
    const subtotalString = `RM ${subtotalAmount.toFixed(2)}`;

    // for discount
    const totalDiscount = invoiceData.get('totalDiscount')? parseFloat(invoiceData.get('totalDiscount')).toFixed(2):null;

    // const baseTaxString = hasSST ? (taxAmount === 0)? `RM000`:`RM${taxAmount}` : 'RM0.00';
    // const baseTaxString = hasSST ? parseFloat(taxAmount/100).toFixed(2).toString():'';
    const baseTaxString = parseFloat(taxAmount).toFixed(2).toString();
    // const taxString = hasSST ? 'SST 6% : '+baseTaxString.substring(0, baseTaxString.length-2) + '.' + baseTaxString.substring(baseTaxString.length-2, ) : 'GST 0% : '+baseTaxString;
    const taxString = 'Tax : RM '+ baseTaxString;

    // with SST seperately
    // const subtotalAmountWithoutSST = Math.round((parseFloat(amount)));
    // console.log('subtotalAmountWithoutSST: ', subtotalAmountWithoutSST);
    // const SSTtaxAmount = parseFloat(invoiceData.get('sstTax'));
    // console.log('SSTtaxAmount: ', SSTtaxAmount);
    // const baseSubtotalStringWithoutSST = (subtotalAmountWithoutSST === 0)? `RM${subtotalAmountWithoutSST}00`:`RM${subtotalAmountWithoutSST}`;
    // const subTotalStringWithoutSST = baseSubtotalStringWithoutSST.substring(0, baseSubtotalStringWithoutSST.length-2) + '.' + baseSubtotalStringWithoutSST.substring(baseSubtotalStringWithoutSST.length-2, );
    // const baseTaxStringSST = (SSTtaxAmount === 0)? `RM000` : (Math.floor(SSTtaxAmount)===0)? `RM ${SSTtaxAmount}` : `RM${SSTtaxAmount}`;
    // console.log('baseTaxStringSST: ', baseTaxStringSST);
    // const taxStringSST = 'SST 6% : '+baseTaxStringSST.substring(0, baseTaxStringSST.length-2) + '.' + baseTaxStringSST.substring(baseTaxStringSST.length-2, );
    // // const taxStringSST = 'SST 6% : ' +  (Math.floor(SSTtaxAmount)===0)? `0${parseFloat(baseTaxStringSST).toFixed(2)}`:parseFloat(baseTaxStringSST).toFixed(2);
    // const amountSST = subtotalAmountWithoutSST + SSTtaxAmount;
    // const amountSSTString = 'RM '+ amountSST;
    // console.log('amountSSTString: ', amountSSTString);
    // const amountStringSST = amountSSTString.substring(0, amountSSTString.length-2) + '.' + amountSSTString.substring(amountSSTString.length-2, );

    // console.log(taxAmount, taxString, subtotalAmount, subtotalString);
    var titleMsg = invoicePaid? 'Receipt':'Invoice';
    const invoiceDateTxt = 'Invoice Date : ';
    const billingDateTxt = 'Billing Date : ';
    
    // const dateInvoiceTitle = (invoicePaid && userBillingDate)?  billingDateTxt + invoiceDate : invoiceDateTxt + paymentDate;
    const dateInvoiceTitle = invoiceDateTxt + invoiceDate;
    const invoiceNumberTitle = 'Invoice Number : ' + invoiceNo;
    const receiptDateTitle = receiptMailedAt? ('Paid on : ' + moment(Actions.getTheDate(receiptMailedAt)).format('DD MMM YYYY')):null;
    const billingDateTitle =  userBillingDate? (billingDateTxt + userBillingDate):null;

    // console.log('paymentItems: ', paymentItems && paymentItems.size);
    var paymentItemsArray = [];
    var invoiceQtyArray = [];

    paymentItems && paymentItems.forEach((item, key)=>{
      const quantity = item.get('quantity')||1;
      const isAfterJuly2020 = item.get('isAfterJuly2020');
      const unitPriceWithTax = item.get('unitPriceWithTax')||'0';
      const unitPrice = item.get('unitPrice')||0;
      const tax = item.get('tax')||'0';
      const createdAt = item.get('createdAt')||null;
      const july2020Text = isAfterJuly2020? `After July 1st 2020`:`Before June 30th 2020`;
    
      // console.log('isAfterJuly2020: ', isAfterJuly2020); 

      paymentItemsArray.push(
        <div key={key}>
         
          {false && <div style = {{justifyContent:'space-between', alignItems: 'center', display: 'flex'}}>
            <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'left'}}>
              {`Item ${key+1}`}
            </Typography>

            <div>
              <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
                {`Unit Price : RM ${parseFloat(unitPrice).toFixed(2)}`}
              </Typography>
              <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
                {`Quantity : ${parseInt(quantity)}`}
              </Typography>
              <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
                {`Total Tax : ${(parseFloat(tax)*parseInt(quantity)).toFixed(2)}`}
              </Typography>
              <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
                {`Subtotal : RM ${(parseFloat(unitPrice)*parseFloat(quantity)).toFixed(2)}`}
              </Typography>
            </div>
          </div>}
          <Typography type="subheading" component="h1" gutterBottom color="primary">
            {july2020Text} {quantity} x {packageDisplayString} - {`RM ${(parseFloat(unitPriceWithTax)*parseFloat(quantity)).toFixed(2)} `}
          </Typography>
        </div>
      );
    });
    

    const invoiceQtyTitleLayout = (paymentItemsArray.length>0)?
      paymentItemsArray:
      <Typography type="subheading" component="h1" gutterBottom color="primary">
        {invoiceQuantity} x {packageDisplayString} - {amountString}
      </Typography>;

    // console.log('thestate: ', this.state);

    // const disablePaymentButton = packageId? (!this.state.checked1 || !this.state.checked2 || !this.state.checked3) : (!this.state.checked1)
    var disablePaymentButton = false;
    if ((vendProductId === vBuySep2020) && invoicePackageId){
      disablePaymentButton = (!this.state.checkedPromo || !this.state.checkedPromo2 || !this.state.checked1 || !this.state.checked2 || !this.state.checked3)
    }
    else if (vendProductId === vBuyMidSep2020AllAccess && invoicePackageId){
      disablePaymentButton = (!this.state.checkedPromo || !this.state.checked1 || !this.state.checked2 || !this.state.checked3)
    }
    else if (invoicePackageId && promoType && promoType === 'angpau2022'){
      disablePaymentButton = !this.state.checked1
    }
    else if (invoicePackageId && vendProductId && vendProductId!='a3be38de-934f-aa1c-7f69-89f8fcc16f4a'){
      disablePaymentButton = (!this.state.checked1 || !this.state.checked2 || !this.state.checked3)
    }
    else if (invoicePackageId && invoiceType && invoiceType === 'membership'){
      disablePaymentButton = (!this.state.checked1 || !this.state.checked2 || !this.state.checked3);
    } 
    else {
      disablePaymentButton = !this.state.checked1
    }

    var promoAgreementText = '';
    var promoAgreementText2 = '';
    if (vendProductId === vBuyAug20SingleAccess){
      promoAgreementText = augAllAccessAgreement;
    }
    else if (vendProductId === vBuyAug20SingleAccess){
      promoAgreementText = augSingleAccessAgreement;
    }
    else if (vendProductId === vBuySep2020){
      promoAgreementText = septAllAccessAgreement1;
      promoAgreementText2 = septAllAccessAgreement2;
    }
    else if (vendProductId === vBuyMidSep2020AllAccess){
      promoAgreementText = septmidPromoAgreement1;
      promoAgreementText2 = septmidPromoAgreement2;
    }

    // console.log('vendProdId: ', vendProductId);
    // console.log('invoicePkgId: ', invoicePackageId);
    return (
      <div className={classes.container}>
        <MenuAppBar />
        <Card className={classes.card}>
        <CardContent className={classes.content}>
        <StdText text = {titleMsg} variant = 'h3' style={{textAlign:'center', marginTop:70, marginBottom:32}}/>
        <StdText text = {userName} variant = 'h4'/>
        <StdText text = {dateInvoiceTitle}/>
        <StdText text = {invoiceNumberTitle}/>
        <StdText text = {receiptDateTitle}/>
        <StdText text = {billingDateTitle}/>
        {(invoicePaid === false && userPaymentItems.length > 0) && 
          <UserPayments userId={userId} 
            primaryText = {this.state.paymentHistoryOpen ? "Hide Payment History" : 'View Payment History'}
          />
        }

        {false && (invoicePaid === false && userPaymentItems.length > 0) &&
          <List>
            <ListItem button onClick={this.handleClickPaymentHistory} style={{padding:0}}>
              <ListItemText primary={this.state.paymentHistoryOpen ? "Hide Payment History" : 'View Payment History'} />
              {this.state.paymentHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={this.state.paymentHistoryOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {showLoadingForPayments &&
                  <CircularProgress style={{margin:'auto', display:'block', marginTop:16, marginBottom:16, height:120, width:120}}/>
                }
                {!showLoadingForPayments &&
                  userPaymentItems
                }
              </List>
            </Collapse>
          </List>
        }
        <Divider style={{marginTop:8, marginBottom:16}}/>
        {(invoicePaid && paymentId) &&
          <div>
          {(packageDisplayString === 'Monthly Membership' || packageDisplayString === '6 Month Term Membership') &&
             <StdText text = {`${invoiceQuantity} x ${packageDisplayString}`}/>
          }
          {invoiceQtyTitleLayout}
          <Divider style={{marginTop:16, marginBottom:16}}/>
          <StdText text = {`Subtotal : ${subtotalString}`} style={{textAlign:'right'}}/>
          <StdText text = {taxString} style={{textAlign:'right'}}/>
          <StdText text = {`Total : ${amountString}`} variant="h4" style={{textAlign:'right'}}/>
          </div>
        }
        {/* {false && (invoicePaid && paymentId) &&
          <div>
            <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'left'}}>
              {invoiceQuantity} x {packageDisplayString} - {`RM${invoiceCurrentPrice}.00`} {hasSST && ` (without SST)`}
            </Typography>
            <Divider style={{marginTop:16, marginBottom:16}}/>
            <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
              {`Subtotal : ${subTotalStringWithoutSST}`}
            </Typography>
            <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
              {taxStringSST}
            </Typography>
            <Typography type="title" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
              {`Total : ${amountStringSST}`}
            </Typography>
          </div>
        }
        {false && !invoicePaid && showSST &&
          <div>
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'left'}}>
            {invoiceQuantity} x {packageDisplayString} - {`RM${invoiceCurrentPrice}.00`}
          </Typography>
          <Divider style={{marginTop:16, marginBottom:16}}/>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Subtotal : ${subTotalStringWithoutSST}`}
          </Typography>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {taxStringSST}
          </Typography>
          <Typography type="title" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Total : ${amountStringSST}`}
          </Typography>
          </div>
        } */}
        {!invoicePaid &&
          <div>
          {invoiceQtyTitleLayout}
          {containFreeMonth && freeMonthQty && freeMonthPackageId && <Typography type="subheading" component="h1" gutterBottom color="primary">
            {`${freeMonthQty} x FREE MONTH MEMBERSHIP - RM 0.00`}
          </Typography>}
          <Divider style={{marginTop:16, marginBottom:16}}/>
          {false && (paymentItemsArray.length>0) && paymentItemsArray}
          <StdText text = {`Subtotal : ${subtotalString}`} style={{textAlign:'right'}}/>
          <StdText text = {taxString} style={{textAlign:'right'}}/>
          {totalDiscount && <StdText text =  {`Discount : - RM ${totalDiscount}`} style={{textAlign:'right'}}/>}
          <StdText text =  {`Total : ${amountString}`} variant="h4" style={{textAlign:'right'}}/>
         
          </div>
        }
        {paymentFailedString &&
          <StdText text =  {paymentFailedString} style={{color:'red'}} />
        }
        {invoicePaid &&
          <div style={{textAlign:'right'}}>
            <StdText text =  {invoiceRefunded ? 'Refunded' : 'Paid'} style={{color:'green'}} />
          
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{color:'green'}}>
            {invoiceRefunded ? 'Your payment has been refunded' : 'Thank you for your payment!'}
          </Typography>
          </div>
        }
        {!invoicePaid && promoType && promoType === 'angpau2022' && !isAutoInvoice &&
          <Grid container spacing={10} style={{marginTop:16}}>
           <Grid item xs={12} sm={12}>
           {true && <div id="checkout"/>}
           {!this.state.checkoutValid &&
             <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
           }
           {this.state.checkoutValid &&
             <div style={{marginTop:240}}>
               {packageName &&
                 <StdText text = {`Current Plan : ${packageName ? packageName : 'None'} ${packageMonthlyFeeString ? packageMonthlyFeeString : ''}`} variant = 'h4' style={{marginBottom:8}}/>
               }

               <StdText text = {`Babel Ang Pau Membership`} variant = 'subheading' style={{marginBottom:8, marginTop:10,fontWeight:800}}/>
                <div style = {{display:'flex', flex:1, flexDirection:'row', marginTop:10}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`RM1 Gym Membership`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row'}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`All or Single Access`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row'}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`Unlimited Group Classes`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row'}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`Full use of Main Gym & All Facilities`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row'}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`Luxurious Towels & Amenities`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row'}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`Hassle-Free Auto Renewal`}/>
                </div>
                <div style = {{display:'flex', flex:1, flexDirection:'row', marginBottom:20}}>
                  <CheckIcon style={{marginRight:20}}/>
                  <StdText text = {`Cancel Anytime`}/>
                </div>
               <FormControl>
                 <FormGroup row>
                   <FormControlLabel key={0} control={<Checkbox
                     checked = {this.state.checked1}
                     onChange ={ e=> {
                       this.setState({checked1:e.target.checked})
                     }}
                     value = {
                       `${this.state.checked1}`
                     }
                     />} 
                     label={<div>By starting your RM1 Ang Pao Membership you agree to our <span style={{textDecoration: 'underline', color:'rgba(0, 0, 0, 0.54)'}} onClick={()=>this.props.actions.viewTermsConditions()}>Terms & Conditions</span> and Babel's <span style={{textDecoration: 'underline', color:'rgba(0, 0, 0, 0.54)'}} onClick={()=>this.props.actions.viewPrivacyPolicy()}>Privacy Policy</span>. You agree for Babel to charge your card on file and that your monthly membership continues until cancelled.</div>}/>
                 </FormGroup>
               </FormControl>

               <StdButton
                 text = {'Pay'}
                 key = {'complete'}
                 onClick={()=>{
                   console.log("Valid",window.chckt.checkPaymentMethodIsValid());
                   // add recurring for membership type
                   if(window.chckt.checkPaymentMethodIsValid() && isMembershipType){
                     // console.log('isMembershipType: ', isMembershipType);
                     this.setState({isPaying:true});
                     window.chckt.submitPaymentForm();
                     this.props.actions.addRecurring(userId);
                   }
                   else if(window.chckt.checkPaymentMethodIsValid() && !isMembershipType){
                     // console.log('isMembershipType: ', isMembershipType);
                     this.setState({isPaying:true});
                     window.chckt.submitPaymentForm();
                     // this.props.actions.addRecurring(userId);
                   }
                 }} 
                 disabled={this.state.isPaying 
                 || disablePaymentButton
                 // || (!this.state.checkedPromo && (vendProductId === vBuyAug20SingleAccess || vendProductId === vBuyAug20AllAccess))
                 // || (!this.state.checkedPromo && !this.state.checkedPromo2 && (vendProductId === vBuySep2020))
                 }
                 showCircularProgress = {this.state.isPaying}
               />

               <Typography variant="caption" display="block" gutterBottom color="primary" style={{display:'flex', flex:1, justifyContent:'center', alignItems:'center', textAlign:'center', margin:10}} onClick={()=>this.props.actions.viewPrivacyPolicy()}>
                 <LockIcon />Your payments will be processed securely.
               </Typography>
             </div>
           }
         </Grid>
         </Grid>
        }
        {!invoicePaid && (!promoType || promoType != 'angpau2022') &&
          <Grid container spacing={10} style={{marginTop:16}}>
          <Grid item xs={12} sm={12}>
            {true && <div id="checkout"/>}
            {!this.state.checkoutValid &&
              <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
            }
            {this.state.checkoutValid &&
              <div style={{marginTop:240}}>
                {packageName &&
                  <StdText text = {`Current Plan : ${packageName ? packageName : 'None'} ${packageMonthlyFeeString ? packageMonthlyFeeString : ''}`} variant = 'h4' style={{marginBottom:8}}/>
                }
                <FormControl>
                  <FormGroup row>
                    <FormControlLabel key={0} control={<Checkbox
                      checked = {this.state.checked1}
                      onChange ={ e=> {
                        this.setState({checked1:e.target.checked})
                      }}
                      value = {
                        `${this.state.checked1}`
                      }
                      />} label={<div>By checking this box, I agree to save my card details and hereby understand and accept Babel's <span style={{textDecoration: 'underline', color:'rgba(0, 0, 0, 0.54)'}} onClick={()=>this.props.actions.viewTermsConditions()}>Terms & Conditions</span> and <span style={{textDecoration: 'underline', color:'rgba(0, 0, 0, 0.54)'}} onClick={()=>this.props.actions.viewPrivacyPolicy()}>Privacy Policy</span>.</div>}/>
                  </FormGroup>
                  {
                  (vendProductId === vBuyAug20AllAccess 
                  || vendProductId === vBuyAug20SingleAccess 
                  || vendProductId === vBuySep2020
                  || vendProductId === vBuyMidSep2020AllAccess
                  ) && 
              
                  <FormGroup row style={{justifyContent:'center', marginTop:10, marginBottom:0}}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={this.state.checkedPromo}
                            // onChange={this.handleChange('checkedPromo')}
                            onChange ={ e=> {
                              this.setState({checkedPromo:e.target.checked})
                            }}
                            value={`${this.state.checkedPromo}`}
                          />
                        }
                        label={(<div>{promoAgreementText}</div>)}/>
                    </FormGroup>}
                  {(vendProductId === vBuySep2020) && 
                  <FormGroup row style={{justifyContent:'center', marginTop:10, marginBottom:0}}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={this.state.checkedPromo2}
                            // onChange={this.handleChange('checkedPromo')}
                            onChange ={ e=> {
                              this.setState({checkedPromo2:e.target.checked})
                            }}
                            value={`${this.state.checkedPromo2}`}
                          />
                        }
                        label={(<div>{promoAgreementText2}</div>)}/>
                    </FormGroup>}
                  {invoicePackageId && ((vendProductId && vendProductId!='a3be38de-934f-aa1c-7f69-89f8fcc16f4a') || (invoiceType && invoiceType==='membership')) && 
                    <FormGroup row style={{justifyContent:'center', marginTop:10, marginBottom:0}}>
                    <FormControlLabel key={1} control={<Checkbox
                      checked = {this.state.checked2}
                      onChange ={ e=> {
                        this.setState({checked2:e.target.checked})
                      }}
                      value = {
                        `${this.state.checked2}`
                      }
                      />} label={<div>{invoicePackageId && ` I understand that this card will be charged every month automatically for my monthly membership +/- 3 days from the billing date at the monthly plan's rate.`}</div>}/>
                  </FormGroup>}
                  {invoicePackageId && ((vendProductId && vendProductId!='a3be38de-934f-aa1c-7f69-89f8fcc16f4a') || (invoiceType && invoiceType==='membership')) && 
                  <FormGroup row style={{justifyContent:'center', marginTop:10, marginBottom:0}}>
                    <FormControlLabel key={2} control={<Checkbox
                      checked = {this.state.checked3}
                      onChange ={ e=> {
                        this.setState({checked3:e.target.checked})
                      }}
                      value = {
                        `${this.state.checked3}`
                      }
                      />} label={<div>{invoicePackageId && ` To opt out of auto-billing in the future, I agree to email hello@babel.fit at least 7 days before the next billing date.`}</div>}/>
                  </FormGroup>}
              
                </FormControl>

                <StdButton
                  text = {'Pay'}
                  key = {'complete'}
                  onClick={()=>{
                    console.log("Valid",window.chckt.checkPaymentMethodIsValid());
                    // add recurring for membership type
                    if(window.chckt.checkPaymentMethodIsValid() && isMembershipType){
                      // console.log('isMembershipType: ', isMembershipType);
                      this.setState({isPaying:true});
                      window.chckt.submitPaymentForm();
                      this.props.actions.addRecurring(userId);
                    }
                    else if(window.chckt.checkPaymentMethodIsValid() && !isMembershipType){
                      // console.log('isMembershipType: ', isMembershipType);
                      this.setState({isPaying:true});
                      window.chckt.submitPaymentForm();
                      // this.props.actions.addRecurring(userId);
                    }
                  }} 
                  disabled={this.state.isPaying 
                  || disablePaymentButton
                  // || (!this.state.checkedPromo && (vendProductId === vBuyAug20SingleAccess || vendProductId === vBuyAug20AllAccess))
                  // || (!this.state.checkedPromo && !this.state.checkedPromo2 && (vendProductId === vBuySep2020))
                  }
                  showCircularProgress = {this.state.isPaying}
                />

                {/* <Button raised color='primary' key={'complete'} className={classes.button} onClick={()=>{
                    console.log("Valid",window.chckt.checkPaymentMethodIsValid());
                    // add recurring for membership type
                    if(window.chckt.checkPaymentMethodIsValid() && isMembershipType){
                      // console.log('isMembershipType: ', isMembershipType);
                      this.setState({isPaying:true});
                      window.chckt.submitPaymentForm();
                      this.props.actions.addRecurring(userId);
                    }
                    else if(window.chckt.checkPaymentMethodIsValid() && !isMembershipType){
                      // console.log('isMembershipType: ', isMembershipType);
                      this.setState({isPaying:true});
                      window.chckt.submitPaymentForm();
                      // this.props.actions.addRecurring(userId);
                    }
                  }} 
                    disabled={this.state.isPaying 
                    || disablePaymentButton
                    // || (!this.state.checkedPromo && (vendProductId === vBuyAug20SingleAccess || vendProductId === vBuyAug20AllAccess))
                    // || (!this.state.checkedPromo && !this.state.checkedPromo2 && (vendProductId === vBuySep2020))
                    }>
                  Pay
                  {this.state.isPaying &&
                    <CircularProgress style={{color:'white', marginLeft:8}}/>
                  }
                </Button> */}

                <Typography variant="caption" display="block" gutterBottom color="primary" style={{display:'flex', flex:1, justifyContent:'center', alignItems:'center', textAlign:'center', margin:10}} onClick={()=>this.props.actions.viewPrivacyPolicy()}>
                  <LockIcon />Your payments will be processed securely.
                </Typography>
              </div>
            }
          </Grid>
          </Grid>
        }
        <Divider style={{marginTop:16, marginBottom:16}}/>
        {(invoicePaid && paymentId) &&
          <Typography id={'no-print'} variant="button" gutterBottom color="primary" style={{textAlign:'right'}} onClick={()=>{window.print()}}>
            {'Print'}
          </Typography>
        }
          <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'B Fitness Asia Sdn. Bhd. (1204067-x)'}
          </Typography>
          {false &&
            <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
              {'GST No. 000154726400'}
            </Typography>
          }
          {true && 
            <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
              {`SST CP No: W10-1808-32001697`}
            </Typography>
          }
          <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'Unit 3-6, Menara Ken TTDI,'}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'No 37, Jalan Burhanuddin Helmi,'}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'Taman Tun Dr Ismail,'}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'60000 Kuala Lumpur.'}
          </Typography>
        
        <BabelLogo />
        </CardContent>
        </Card>
        <Dialog key={'infoDialog'} open={this.state.infoDialogOpen} onClose={this.handleClose}>
          <DialogContent>
          <DialogTitle style={{textAlign:'center'}}>{'Promo'}</DialogTitle>
          <FormControl style={{marginTop:16}} component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Free Gift</FormLabel>
            <RadioGroup
              aria-label="Free Gift"
              name="freeGift"
              className={classes.group}
              value={freeGift}
              onChange={this.handleChangeFreeGift}
            >
              {invoiceIsNewMonthly &&
                <FormControlLabel value="1 Technogym Band" control={<Radio />} label="One Technogym Band (RM200)" />
              }
              {invoiceIsNewMonthly &&
                <FormControlLabel value="3 PT Sessions" control={<Radio />} label="Three PT Sessions (RM360)" />
              }
              {invoiceIs6Month &&
                <FormControlLabel value="1 Technogym Band, 3 PT Sessions" control={<Radio />} label="One Technogym Band (RM200) plus Three PT Sessions (RM360)" />
              }
              {invoiceIs12Month &&
                <FormControlLabel value="1 Technogym Band, 5 PT Sessions" control={<Radio />} label="One Technogym Band (RM200) plus Five PT Sessions (RM600)" />
              }

            </RadioGroup>
          </FormControl>
          <FormControl style={{marginTop:16}} component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Lucky Draw</FormLabel>
            <RadioGroup
              aria-label="Lucky Draw"
              name="luckyDraw"
              className={classes.group}
              value={luckyDraw}
              onChange={this.handleChangeLuckyDraw}
            >
              <FormControlLabel value="1 Week VIP Pass" control={<Radio />} label="One Week VIP Pass" />
              <FormControlLabel value="1 Month VIP Pass" control={<Radio />} label="One Month VIP Pass" />
              <FormControlLabel value="1 Mini Blackroll" control={<Radio />} label="One Mini Blackroll" />
            </RadioGroup>
          </FormControl>
          </DialogContent>
          <DialogActions>
          <Button key={'cancel'} onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button key={'saveEdit'} className={classes.bookButton} raised onClick={()=>this.handleSavePromoForUser(userId)}>
            {'Save'}
          </Button>
          </DialogActions>
        </Dialog>
        {(userIsPromo) &&
          <BottomNavigation
            value={0}
            showLabels
            classes={{root:classes.bottomNav}}
          >
            {(invoicePaid) &&
              <BottomNavigationAction label="Done" icon={<CheckIcon />} onClick={()=>this.setState({infoDialogOpen:true})} />
            }
            {!(invoicePaid) &&
              <BottomNavigationAction label="Cancel" icon={<CloseIcon />} onClick={()=>this.props.actions.viewPromo()} />
            }
          </BottomNavigation>
        }
        {(!userIsPromo) &&
          <BottomNavigation
            value={0}
            showLabels
            classes={{root:classes.bottomNav}}
          >
            <BottomNavigationAction label={invoicePaid ? "Done" : "Cancel"} icon={invoicePaid ? <CheckIcon /> : <CloseIcon />} onClick={()=>this.props.actions.viewNext()} />
          </BottomNavigation>
        }

      </div>
    );
  }
}

PaymentsAdyen.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PaymentsAdyenStyled = withStyles(styles)(PaymentsAdyen);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsAdyenStyled)