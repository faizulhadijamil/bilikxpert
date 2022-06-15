import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {CircularProgress, Dialog, DialogActions, 
  DialogContent, List, ListItem, ListItemText, Button,
  Card, CardContent, CardMedia, Grid, Snackbar, TextField, 
  InputAdornment, Typography, FormGroup, FormControlLabel,
  Checkbox, FormLabel, Chip, Avatar
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import moment from 'moment';
import BabelLogo from './BabelLogo';
import IntegrationAutosuggest from './IntegrationAutosuggest';
import StdButton from './components/StdButton';
import StdText from './components/StdText';
import PropTypes from 'prop-types';
import {getVendProducts, makeGetStaff} from './selectors';
import * as Actions from './actions';

import firebase from 'firebase/app';
import 'firebase/firestore';
import axios from 'axios';

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
    marginTop: 2,
    padding: 16
  },
  formContainer: {
    // display: 'flex',
    // flexWrap: 'wrap'
  },
  card: {
    paddingBottom: 10
  },
  content: {
    // maxWidth: 8 * 50,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  contentInner: {
    maxWidth: 8 * 50,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  button: {
    fontSize: "0.875rem",
    // textTransform: "uppercase",
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
    
  },
  buttonLarge: {
    fontSize: "1.5rem",
    textTransform: "capitalize",
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
    maxWidth:600,
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd'
  },
  buttonRed: {
    fontSize: "0.875rem",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#F71A38",
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
  red: {
    color: 'red',
    // backgroundColor:'red',
  },
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9
    // width: 256,
    // height: 256,
    width: 100,
    height: 100,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  snackbarMessage: {
    textAlign: 'center',
    flex: 1,
    fontSize: '1.3125rem',
    padding: 2,
  },
  snackbarRoot: {
    backgroundColor: 'rgba(6,40,69,0.96)'
  },
  fileInput: {
    display: 'none'
  },
  quantityInput:{
    fontSize: '2rem',
    alignItems: 'center'
  },
  formControl: {
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 88,
    width: '100%',
    // paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 2,
    minHeight: 36,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: 2,
    marginBottom: 2,
    justifyContent: 'flexEnd'
  },
}); 

// const vBuyDancePassTTDI = '9a20891f-ac31-6688-4189-1767ceb6d941';
const vBuyDancePassTTDI = 'bf1be4bc-0701-c5d3-0533-6bf27a4ec42c';
const vBuyFreeze = 'a3be38de-934f-aa1c-7f69-89f8fcc16f4a';
// const vBuyDanceKLCC = '03bdc243-2501-1787-16d8-4dd6b6a88369';
const vBuyDanceKLCC = '0272b66d-4dc3-285d-e948-37b0088a5750';
const vBuyFckFloor = 'b788bc60-2fde-2039-7862-05caa7957abf';
const vBuySpecialClass = '6fc5baef-129c-79e0-97f1-ce4e8fc366fa';
const vBuy6MthPrepaidMembership = '98f9aab1-1c0b-1673-52e5-d9216a84b509';
const vBuy12MthPrepaidMembership = '0af7b240-aba0-11e7-eddc-dbd880f58a4f';
const vBuyDayPass = '04de7e6c-409f-488c-e6d4-9df5cc745fff';
const vBuyDancePass = '51a1f440-45c3-d544-eba1-de1f28ed5e64'; // RM 35. disable this
const vBuyPT60minsTier1 = '0af7b240-aba0-11e7-eddc-dbd88108ce9f';
const vBuyPT60minsTier2 = '0af7b240-aba0-11e7-eddc-dbd8811ef4d5';
const vBuyPT60minsTier3 = '0af7b240-aba0-11e7-eddc-dbd8813329fe'; 
const vBuyPT60minsTierX = '0af7b240-aba0-11e7-eddc-dbd8814628a1';
const vBuyAnimalFlow = '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
const vBuyPilatesFoundation = 'ae01cd09-ba08-9176-917a-07ab2d24b88d';
const vBuyFaizTest = '8aea002d-7eaa-1a6b-362d-933243a75823test';
const vComplimentary = '553071c8-43ad-df86-7b27-51bb655c5b49';
const vBuyJan2020Single = '4933bd88-e457-243c-9751-f98768f74473';
const vBuyJan2020AllAccess = 'b9c3f298-2a65-319f-cfee-58dd029a3cba';
const vBuyValentineSingleClassMember = '072f066b-73a0-62d5-4f42-832b1364fad6';
const vBuyValentineSingleClassNonMember = '000eb1e5-ff89-9396-da46-751752b101ed';
const vBuyValentineDoubleClassMember = '2c5110d9-af4d-e37e-fbb5-08165c693baf';
const vBuyValentineDoubleClassNonMember = '30198d7b-68ff-d2d6-ec0d-d7bb9f6e0735';
const vBuyDanceRM20Class = '948feb3c-0447-0723-6817-5e4ab7daa399';
const vBuyDanceDanceParkClass = 'ee048d6e-c2b7-0f07-156b-ef337c0aa2e3'; //RM45
const vBuySSTtest = '1a7510e3-e535-e125-f9d5-8241a0b59bd3';
const vBuyChoreographyProject = '06e22a00-c8e9-e3fb-ed46-46324ad1b0b9';

const vBuyAug2020Single = '83d318ff-64ab-3cc8-9ba4-98f740bc48f2'; 
const vBuyAug2020AllAccess = '211aad2d-0a2a-fdc7-d79a-7eabc28d5994';
const vBuySep2020 = 'e4c23eae-4a4d-9191-f92f-98afe0e3dd08';
const vBuyMidSep2020AllAccess = 'e1611259-cb7b-1854-df22-2f9a672233ba'; 
const vBuyMidSep2020SingleAccess = 'e456b524-4689-49eb-808a-08b9a3700aa3'; 
const vBuySingleFLX2022 = `47fb7227-5ac2-403c-ac57-50d906cb3c7c`;
const vBuyAllFLX2022 = `9effa0bd-59d8-4d55-a470-f34fadd3d5eb`;

// for 3M vendProdId
const vBuy3MSingleAccess = `4208ae87-5052-c06c-fd6a-8acdf892187b`;
const vBuy3MAllAccess = `e30c71cd-282b-1c2b-041a-9b4ababc2b00`;

// for 6M vendProdId
const vBuy6MSingleAccess = `9432c162-a74d-bdfa-d1ad-27c1e3b5d653`;
const vBuy6MAllAccess = `4ddc74ce-db5f-0d4d-f3e2-4c44f87fff4f`;

// for 12M vendProdId
const vBuy12MSingleAccess = `0af7b240-aba0-11e7-eddc-dbd880f58a4f` || `d282c703-a741-0aac-9b07-a719ca323d6f`;
const vBuy12MAllAccess = `2d6c5a58-dc00-1186-f6fb-37f63454dcd0`||`4ad967da-8d67-8d93-6d7a-81b3e52040a4`;

const vBuyPopupClass = [
  '0cd234f0-7056-01dc-371c-05f953649051', // Single Class Pass (Member)
  '1abb5848-7e32-0366-e400-2275e0302b18', // Single Class Pass (Non-Member)
  '5f36132e-4a5a-3d74-1b0e-d815131e04e9', // Double Class Pass (Member)
  '66992658-5abb-b723-07d1-ea28aaf0e4d9', // Double Class Pass (Non-Member)
  '491c8f9f-1e00-a9c4-a82c-8fdba5de6329', // virtual dance class
  '06e22a00-c8e9-e3fb-ed46-46324ad1b0b9', // videography class
  '7a154af8-b067-b337-aa1c-06ab6d1df79a' // double virtual class
];
const instructorNameList = ["Maybelline", "donna"];

class Buy extends React.Component {

  constructor(props){
    super(props);
    this.handleCheckExistingMember = this.handleCheckExistingMember.bind(this);
  }

  state = {
    email: '',
    name: '',
    phone: '',
    icnumber: '',
    className: '',
    classDate: '',
    classTime: '',
    ighandleName: '',
    city:'',
    dialogOpen: false,
    checked:false,
    checkedPromo:false,
    promoOpt:null,
    refSource: null,
    mcId: null,
    isrm20DanceClass:false,
    isDanceClass:false,
    isExistingActiveMember:false,
    showMemberDetails: false,
    showErrorMsg:false,
    classId:null,
    vendPromoIdObj:null
  }

  componentDidMount() {
    // this.props.actions.addInvoiceForProduct();
    // console.log('this.props.match.params: ', this.props);
    const vendProductId = this.props.match.params.vendProductId;
    const pathname = this.props.location && this.props.location.pathname;
    const pathStringSplit = pathname && pathname.split("/");
    // console.log('pathStringSplit: ', pathStringSplit);
    const vendQty = (pathStringSplit && pathStringSplit.length === 4 && pathStringSplit[3])?pathStringSplit[3]:1;
    this.setState({quantity:parseInt(vendQty)});
  
    const paymentBody = { 
      "vendProductId":vendProductId,
      "quantity": vendQty? parseInt(vendQty):1 // if no qty, default qty is 1
    }
    
    axios.post('https://us-central1-babelasia-37615.cloudfunctions.net/vendAPI-getVendPromoByVendId', paymentBody)
    .then(res => {
        // console.log('response: ', res);
        const data = res && res.data;
        if (data){
          // console.log('thedata: ', data);
          const vendPromoIdObj = data && data.matchedpromo;

          // todo: fetch vendprod by variant, tag_id, type_id

          this.setState({vendPromoIdObj});
        }
        // const promoByProdIdMap = data && data.promoByProdIdMap;
        // console.log('promoByProdIdMap: ', promoByProdIdMap);
        // Object.entries(promoByProdIdMap).forEach(([key,value]) => {
        //   // if match with vendproductId, save it to react state
        //   if (key === vendProductId){
        //     // const action = value && value.action;
        //     // const actionType = action && action.type;
        //     // const actionValue = action && action.value;
        //     // console.log('actionType: ',actionType);
        //     // console.log('actionValue: ', actionValue);
        //     this.setState({vendPromoIdObj:value});
        //   }
        // });
        // const promoFromVendProdDetails = Object.keys(promoByProdIdMap).filter(key=>{
        //   if (key === vendProductId){
        //     return true;
        //   }
        // });
        // console.log('promoFromVendProdDetails: ', promoFromVendProdDetails);
        // Object.keys
        // const appointments = res && res.data && res.data.appointments;
        // if (data && data.users){
        //   this.setState({zoomUsers: data.users});
        // }
    })
    .catch((e)=>{
      console.log('error: ', e);
    });
    // fetch if the payment contains promos
    // const promosData = firebase.firestore().collection('vendPromos').where('status', '==', 'active').get();
    // var includePromoArray = [];
    // var excludePromoArray = [];
    // promosData && promosData.then((querySnapshot)=>{
    //   querySnapshot.forEach(doc=>{
    //     var promoData = doc.data();
    //     const promoId = doc.id;
    //     const condition = promoData && promoData.condition;
    //     const include = condition && condition.include;
    //     const exclude = condition && condition.exclude;

    //     if(condition && include && exclude
    //       ){
    //         if (include.length>0){
    //           include && include.forEach(data=>{
    //             includePromoArray.push(data);
    //           });
    //         }
    //         if (exclude.length>0){
    //           exclude && exclude.forEach(data=>{
    //             excludePromoArray.push(data);
    //           });
    //         }
    //     }
    //   });
    //   // console.log('danceClassArray1: ', danceClassArray);
    //   this.setState({includePromoArray, excludePromoArray});
    // });

    // for virtualdance pass
    const danceClassData = firebase.firestore().collection('classes')
      .where('classType', '==', 'babelDance')
      .where('active', '==', true)
      .get();

    var danceClassArray = [];
    danceClassData && danceClassData.then((querySnapshot)=>{
      querySnapshot.forEach(doc=>{
        var classData = doc.data();
        const classId = doc.id;
        const availableDate = classData && classData.availableDate;
        const expiredDate = classData && classData.expiredDate;
        const maxCapacity = classData && classData.maxCapacity;
        classData.classId = doc.id;
        if(availableDate && expiredDate
          && (moment(Actions.getTheDate(availableDate))).isSameOrBefore(moment())
          && (moment(Actions.getTheDate(expiredDate))).isSameOrAfter(moment())
          ){
            danceClassArray.push(classData);
        }
      });
      console.log('danceClassArray1: ', danceClassArray);
      this.setState({danceClassArray});
    });

    // hardcode first for videography class for limited class
    const dancePaymentData = firebase.firestore().collection('payments').
      where("type", "==", "babelDance").
      // where('classRemark', '==', risenGrindTitle2Remark).
      // where("classId", '==', '1TMaqExhAc7dOc3dTI2M').
      where('vendProductId', '==', '06e22a00-c8e9-e3fb-ed46-46324ad1b0b9').
      where('status', '==', 'CLOSED').
      get();

    // var riseGriindClassCount = 0;
    var danceLimitClassCount = 0;
    dancePaymentData && dancePaymentData.then((querySnapshot)=>{
      querySnapshot.forEach(doc=>{
        // console.log(doc.id, '=>', doc.data());
        // theUserData.push(doc.data());
        danceLimitClassCount+=1;
      });
      // console.log('riseGriindClassCount: ', riseGriindClassCount);
      this.setState({danceLimitClassCount});
      // this.setState({theUser:theUserData});
    }).catch(function (error) {
      // this.setState({ theUser: null });
      console.log("Error getting document:", error);
    });

    // for popup class
    const popupClassData = firebase.firestore().collection('classes')
    .where('classType', '==', 'popupClass')
    .where('active', '==', true)
    .get();

    var popupClassArray = [];
    popupClassData && popupClassData.then((querySnapshot)=>{
      querySnapshot.forEach(doc=>{
        var classData = doc.data();
        const classId = doc.id;
        const availableDate = classData && classData.availableDate;
        const expiredDate = classData && classData.expiredDate;
        classData.classId = doc.id;
        if(availableDate && expiredDate
          && (moment(Actions.getTheDate(availableDate))).isSameOrBefore(moment())
          && (moment(Actions.getTheDate(expiredDate))).isSameOrAfter(moment())
          ){
            popupClassArray.push(classData);
        }
      });
      // console.log('danceClassArray1: ', danceClassArray);
      this.setState({popupClassArray});
    });

    // for dance class
    // const popupClassData = firebase.firestore().collection('classes')
    // .where('classType', '==', 'popupClass')
    // .where('active', '==', true)
    // .get();

    // var popupClassArray = [];
    // popupClassData && popupClassData.then((querySnapshot)=>{
    //   querySnapshot.forEach(doc=>{
    //     var classData = doc.data();
    //     const classId = doc.id;
    //     const availableDate = classData && classData.availableDate;
    //     const expiredDate = classData && classData.expiredDate;
    //     classData.classId = doc.id;
    //     if(availableDate && expiredDate
    //       && (moment(Actions.getTheDate(availableDate))).isSameOrBefore(moment())
    //       && (moment(Actions.getTheDate(expiredDate))).isSameOrAfter(moment())
    //       ){
    //         popupClassArray.push(classData);
    //     }
    //   });
    //   // console.log('danceClassArray1: ', danceClassArray);
    //   this.setState({popupClassArray});
    // });


  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleChange = name => event => {
    var updatedState = {};
    var value = event.target.value;
    if(name === 'quantity' && value < 1){
      value = 1;
    }else if(name === 'checked'){
      value = event.target.checked;
    }
    else if (name === 'freezeDate'){
      console.log('freezeValue: ', value);
    }
    // else if (name === 'checkedPromo'){
    //   value = event.target.checked;
    //   //console.log('thecheckedValue: ', value);
    // }
    updatedState[name] = value;
    this.setState({ ...updatedState
    });
  }

  handleCheckBox = name => event => {
    this.setState({[name]: event.target.checked });
  };

  handleCheckExistingMember = () => {
    // console.log('handleCheckExistingMember: ', this.state);
    const {email} = this.state;

    const emailMatch = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
    if (isValidEmail){
      // console.log('valid email')
      this.props.actions.getUserByEmail(email, response => {
        console.log('theresponse: ', response);
        if (response && response.packageId){
          this.setState({isExistingActiveMember:true, showMemberDetails:false, email:'', errorMsg:'Unfortunately, this package is eligible for new members only. Please contact us at hello@babel.fit for assistance.', showErrorMsg:true});
        }
        else if (response && response.isStaff){
          this.setState({isExistingActiveMember:true, showMemberDetails:false, email:'', errorMsg:'Babel Staff is not eligible for this package', showErrorMsg:true});
        }
        else if (response && !response.membershipStarts && !response.packageId && response.name){
          this.setState({isExistingActiveMember:false, showMemberDetails:true, showErrorMsg:false, errorMsg:null});
          // show it to the field
          this.setState({name:response.name, postcode: parseInt(response.postcode), phone:response.phone, refSource:response.refSource})
        }
        else{
          console.log('no response')
          this.setState({isExistingActiveMember:false, showMemberDetails:true, showErrorMsg:false, errorMsg:null});
        }
      });
    }
    else{
      this.setState({errorMsg:'Please enter a valid email address', showErrorMsg:true});
    }
    console.log('isExistingActiveMember: ', this.state.isExistingActiveMember);
  }

  handleContinue = () => {
    console.log('handleContinue: ', this.state);
    const {ighandleName, instructorName, city, danceClassRemark, name, option, classId, email, freezeDate, vendPromoIdObj, isDanceClass} = this.state;
    const vendProductId = this.props.match.params.vendProductId;
    const matchedpromo = vendPromoIdObj && vendProductId && vendPromoIdObj[vendProductId]
    // console.log('matchedpromo1:', matchedpromo);
    // console.log('vId: ', vendProductId);
    // console.log('vendPromoIdObj: ', vendPromoIdObj);
    // console.log('vendPromoIdObj[]: ', vendPromoIdObj[`2d6c5a58-dc00-1186-f6fb-37f63454dcd0`]);
    // const vendProducts = this.props.vendProducts;
    // const vendProduct = (vendProducts && vId) ? vendProducts.get(vId) : null
    // const vendProductName = vendProduct && vendProduct.get('name');
    // const vendSupplyPrice = vendProduct && vendProduct.get('supply_price');
    // const vendPriceBookPrice = vendProduct && vendProduct.get('price_book_entries') && vendProduct.get('price_book_entries').first() && vendProduct.get('price_book_entries').first().get('price');
    // const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
    // // todo: fetch all the price from vend API instead of from vend firebase
    // // const vendPrice = vendPriceAmount ? (vendProductId === vBuySep2020)? `${parseFloat(vendPriceAmount*1.06).toFixed(2)}`:`${parseFloat(vendPriceAmount).toFixed(2)}` : null;
    // const vendPrice = vendPriceAmount ? `${parseFloat(vendPriceAmount*1.06).toFixed(2)}`: null;

    // const actionPromoType = vendPromoIdObj && vendPromoIdObj.action && vendPromoIdObj.action.type;
    // const actionPromoValue = vendPromoIdObj && vendPromoIdObj.action && vendPromoIdObj.action.value;
    // const promoPriceTax = vendPromoIdObj && vendPrice && vendPrice*actionPromoValue;
    // const priceAfterPromo = vendPrice - promoPriceTax;
    var quantity = this.state.quantity||1;

    // const classId = option||null;
   
    // console.log('vendProductId: ', vendProductId);
    if ((vendProductId === 'daypass' || vendProductId === '04de7e6c-409f-488c-e6d4-9df5cc745fff' || vendProductId === 'nightpass' || vendProductId === vBuyDancePass) && !this.state.dialogOpen) {
      this.setState({
        dialogOpen: true
      });
    } else {
      var vId = vendProductId;
      var isAvailable = true;
      
      if (vendProductId === 'daypass') {
        vId = vBuyDayPass;
      } 
      // else if (vendProductId === 'nightpass') {
      //   vId = vBuyDancePass;
      // } 
      else if (vendProductId === 'animalfloweb') {
        isAvailable = moment().isBefore(moment('2019-02-18'));
        vId = isAvailable ? '90bb7eae-5cf8-c556-e147-d0b80192d03f' : '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
        isAvailable = moment().isBefore(moment('2019-03-01'));
      }else if (vendProductId === 'animalflow') {
        vId = '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
        isAvailable = moment().isBefore(moment('2019-03-01'));
      }else if(vendProductId === '0af7b240-aba0-11e7-eddc-dbd880e1f8d5' || vendProductId === 'monthly'){
        vId = '0af7b240-aba0-11e7-eddc-dbd880e1f8d5';
        quantity = this.state.quantity;
      }else if (vendProductId === vBuyPT60minsTier1 || vendProductId === vBuyPT60minsTier2 || vendProductId === vBuyPT60minsTier3 || vendProductId === vBuyPT60minsTierX){
        quantity = this.state.quantity;
      }
      else if ((vendProductId === vBuyJan2020AllAccess) || (vendProductId === vBuyJan2020Single)){
        isAvailable = moment().isBetween(moment('2020-01-01 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-03 23:00').tz('Asia/Kuala_Lumpur')) 
      }
      else if ((vendProductId === vBuyAug2020AllAccess) || (vendProductId === vBuyAug2020Single)){
        isAvailable = moment().isBetween(moment('2020-07-30 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-09-13 00:00').tz('Asia/Kuala_Lumpur'));
      }
      else if (vendProductId === vBuySep2020){
        isAvailable = moment().isBetween(moment('2020-08-31 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-10-01 00:00').tz('Asia/Kuala_Lumpur'));
      }
      else if (vendProductId === vBuyMidSep2020AllAccess || vendProductId === vBuyMidSep2020SingleAccess){
        isAvailable = moment().isBetween(moment('2020-09-15 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-10-01 01:00').tz('Asia/Kuala_Lumpur'));
      }
      else if (vendProductId === vBuyDancePass){
        isAvailable = moment().isBefore(moment('2019-11-30'));
      }
      else if (vendProductId === vBuyChoreographyProject){
        isAvailable = (this.state.danceLimitClassCount && this.state.danceLimitClassCount<=22)? true:false;
        // console.log('danceClassLimit: ', this.state.danceLimitClassCount);
        // console.log('isAvailable: ', isAvailable);
      }

      if (!this.props.isAddingInvoice && vendProductId && isAvailable) {
        const urlSearchString = this.props.location.search;
        // console.log('urlSearchString: ', urlSearchString);
        const urlEmail = urlSearchString && urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
        // console.log('urlEmail: ', urlEmail);
        if(vendProductId === 'monthly' || vendProductId === vBuy6MthPrepaidMembership){
          console.log('addInvoiceForJoiningnMembershipProduct: ');
          const vendProductIds = {};
          vendProductIds[vId] = 1;
          const joiningFeeProductId = vendProductId === 'monthly' ? 'b910986f-cc5e-797b-22eb-16d329593138' : '377b80ec-43fa-7a44-57b6-4ffca6b94973';
          vendProductIds[joiningFeeProductId] = 1;
          // this.props.actions.addInvoiceForProductv2(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
          this.props.actions.addInvoiceForJoiningnMembershipProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        }
        else if ((vendProductId === vBuyJan2020AllAccess)|| (vendProductId === vBuyJan2020Single)){
          const vendProductIds = {};
          vendProductIds[vId] = 1;
          // this.props.actions.addInvoiceForProducts(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
          this.props.actions.addInvoiceForMembership(this.state.name, this.state.email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds);
        }
        else if (vendProductId === vBuyFreeze){
          this.props.actions.addInvoiceForFreezeMembershipv2(urlEmail || this.state.email, this.state.name, vendProductId, freezeDate);
        }
        // for freezing
        else if (vendProductId === 'a3be38de-934f-aa1c-7f69-89f8fcc16f4a'){
          const vendProductIds = {};
          vendProductIds[vId] = 1;
          // this.props.actions.addInvoiceForProducts(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
          this.props.actions.addInvoiceForMembershipv2(this.state.name, urlEmail || this.state.email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds);
        }
        // else if (vendProductId === '8aea002d-7eaa-1a6b-362d-933243a75823'){
        //   const vendProductIds = {};
        //   vendProductIds[vId] = 1;
        //   // this.props.actions.addInvoiceForProducts(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        //   this.props.actions.addInvoiceForMembershipv2(this.state.name, urlEmail || this.state.email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds);
        // }
        else if (vendProductId === vBuyDanceRM20Class){
          // for babel dance only
          const selectedMemberOption = {isKLCCMember:this.state.checkedKLCC, isTTDIMember:this.state.checkedTTDI, isNonMember:this.state.checkedNonMember};
          this.props.actions.addInvoiceForBabelDance(name, urlEmail || this.state.email, this.state.phone, vId, this.state.classDate, this.state.classTime, quantity, danceClassRemark, ighandleName, instructorName, city, selectedMemberOption, classId, 'virtual', (response)=>{
            // console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
                if(response.success){
                    console.log('successfully adding invoice: ', response);
                }
                else{
                    console.log('error adding invoice', response.error);
                }
            }
          });
        }
        else if (vendProductId === vBuyDanceDanceParkClass || isDanceClass){
          console.log('isDanceClass33: ', isDanceClass);
          const selectedMemberOption = {isKLCCMember:this.state.checkedKLCC, isTTDIMember:this.state.checkedTTDI, isNonMember:this.state.checkedNonMember};
          const classDate = this.state.classDate||null;
          const classTime = this.state.classTime||null;
          const danceClassRemark = this.state.danceClassRemark;
          const instructorName = this.state.instructorName;
          const classId = this.state.classId;

          this.props.actions.addInvoiceForBabelDance(name, urlEmail || this.state.email, this.state.phone, vId, classDate, classTime, quantity, danceClassRemark, ighandleName, instructorName, city, selectedMemberOption, classId, 'outdoor', (response)=>{
            if (response){
                this.setState({showLoading:false});
                if(response.success){
                    console.log('successfully adding invoice: ', response);
                }
                else{
                    console.log('error adding invoice', response.error);
                }
            }
          });
        }
        else if (vBuyPopupClass.includes(vendProductId)){
          const selectedMemberOption = {isKLCCMember:this.state.checkedKLCC, isTTDIMember:this.state.checkedTTDI, isNonMember:this.state.checkedNonMember};
          this.props.actions.addInvoiceForBabelDance(name, urlEmail || this.state.email, this.state.phone, vId, '', null, quantity, danceClassRemark, ighandleName, instructorName, city, selectedMemberOption, classId, 'outdoor', (response)=>{
            if (response){
                this.setState({showLoading:false});
                if(response.success){
                    console.log('successfully adding invoice: ', response);
                }
                else{
                    console.log('error adding invoice', response.error);
                }
            }
          });
        }
        else if ((vendProductId === vBuyAug2020AllAccess) 
          || (vendProductId === vBuyAug2020Single) 
          || (vendProductId === vBuySep2020) 
          || (vendProductId === vBuyMidSep2020AllAccess) 
          || (vendProductId === vBuyMidSep2020SingleAccess)
          || (vendProductId === vBuyAllFLX2022)
          || (vendProductId === vBuySingleFLX2022)
          ){
          if (this.state.isExistingActiveMember){
            console.log('cant proceed');
          }
          else{
            console.log('generate invoice for the promo');
            const vendProductIds = {};
            vendProductIds[vId] = 1;
            // this.props.actions.addInvoiceForProducts(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
            this.props.actions.addInvoiceForMembershipv2(this.state.name, email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds, 
              (vendProductId === vBuySep2020)? 'sep2020': (vendProductId === vBuyMidSep2020AllAccess || vendProductId === vBuyMidSep2020SingleAccess)? 'midSep2020': (vendProductId === vBuySingleFLX2022 || vendProductId === vBuyAllFLX2022)? 'flx2022':'unknownPromo', 
              );
          }
        }
        else if ((vendProductId === vBuy3MAllAccess)||(vendProductId === vBuy3MSingleAccess)||(vendProductId === vBuy6MSingleAccess)||(vendProductId===vBuy6MAllAccess)||(vendProductId===vBuy12MSingleAccess)||(vendProductId===vBuy12MAllAccess)){
          const vendProductIds = {};
          vendProductIds[vId] = 1;
          this.props.actions.addInvoiceForMembershipv2(this.state.name, email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds, 'freeMonthPromo');
        }
        else if (vendProductId === vBuySSTtest){
          this.props.actions.addInvoiceForProductv2(this.state.name, urlEmail || this.state.email, this.state.phone, vId, this.state.className, this.state.classDate, quantity);
        }
        else{
          // for product
          // this.props.actions.addInvoiceForProductv2(this.state.name, urlEmail || this.state.email, this.state.phone, vId, this.state.className, this.state.classDate, quantity);
          console.log('matchedPromo123: ', matchedpromo);
          this.props.actions.addInvoiceForProductv2(this.state.name, urlEmail || this.state.email, this.state.phone, vId, this.state.className, this.state.classDate, quantity, null, null, matchedpromo);
        }
      }
    }
  }

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap
    });
  }

  handleClose = () => {
    this.setState({
      dialogOpen: false
    });
  }

  handleBuyRM20DanceClass = (remark, option) => {
    var instructorName = instructorNameList[0];
    // var classDate = moment('11/06/2020 21:00:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    var classDate = '2020/06/11';
    var classTime = '21:00:00';
    
    if(option === 'vdDonna1'){
      instructorName = instructorNameList[1];
      // classDate = moment('11/06/2020 21:00:00', "DD MM YYYY hh:mm:ss").format('YYYYMMDD', 'hh:mm:ss');
      classDate = '2020/07/02';
      classTime = '21:00:00';
    }

    else if (option === 'vdMaybelline1'){
      instructorName = instructorNameList[0];
      // classDate = moment('18/06/2020 21:00:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
      classDate = '2020/07/09';
      classTime = '21:00:00';
    }

    else if (option === 'vdDonna2'){
      instructorName = instructorNameList[1];
      // classDate = moment('25/06/2020 21:00:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
      classDate = '2020/07/16';
      classTime = '21:00:00';
    }

    else if (option === 'vdMaybelline2'){
      instructorName = instructorNameList[0];
      // classDate = moment('25/06/2020 21:00:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
      classDate = '2020/07/23';
      classTime = '21:00:00';
    }
    this.setState({isrm20DanceClass:true, danceClassRemark:remark, instructorName, option, classDate, classTime, isDanceClass:true});
    this.props.actions.viewVendItem(vBuyDanceRM20Class);
  }

  handleBackPress = (vendProductId = null) =>{
    // console.log('handleBackPress: ', this.state);
    if (this.state.name || this.state.phone || this.state.postcode || this.state.refSource){
      this.setState({name:'', phone:'', postcode:'', refSource:'', showMemberDetails:false})
    }
    else if (vendProductId && (vendProductId === vBuyAug2020AllAccess || vendProductId === vBuyAug2020Single)){
      this.props.actions.viewBuyAug20Promo();
    }
    else if (vendProductId && (vendProductId === vBuySep2020)){
      this.props.actions.viewBuySep20Promo();
    }
    else if (vendProductId && (vendProductId === vBuyMidSep2020AllAccess || vendProductId === vBuyMidSep2020SingleAccess)){
      this.props.actions.viewBuyMidSep20Promo();
    }
    else{
      
    }
    // this.props.actions.viewBuyAug20Promo();
  }

  handleBuyParkDanceClass = (data) => {
    console.log('handleBuyParkDanceClassData: ', data);
    // const instructorName
    // var instructorName = instructorNameList[0];
    // // var classDate = moment('13/06/2020 19:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    // var classDate = '2020/06/13';
    // var classTime = '19:30:00';
    // if(option === 'risenGrindTitle1'){
    //   instructorName = instructorNameList[0];
    //   // classDate = moment('13/06/2020 19:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    //   classDate = '2020/07/04';
    //   classTime = '08:30:00';
    // }
    // else if(option === 'risenGrindTitle2'){
    //   instructorName = instructorNameList[1];
    //   // classDate = moment('13/06/2020 20:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    //   classDate = '2020/06/27';
    //   classTime = '8:30:00';
    // }
    this.setState({
      danceClassRemark:data.description, 
      instructorName:data.instructorName, 
      classId:data.classId,
      classDate:moment(Actions.getTheDate(data.classDate)).format('YYYY/MM/DD'), 
      classTime:moment(Actions.getTheDate(data.classDate)).format('hh:mm:ss'), 
      isDanceClass:true
    });
    this.props.actions.viewVendItem(data.vendProductId);
  }

  handleBuyDanceClass = (data) => {
    this.setState({
      danceClassRemark:data.description, 
      instructorName:data.instructorName, 
      classId:data.classId,
      // classDate:moment(Actions.getTheDate(data.classDate)).format('YYYY/MM/DD'), 
      // classTime:moment(Actions.getTheDate(data.classDate)).format('hh:mm:ss'), 
      isDanceClass:true
    });
    this.props.actions.viewVendItem(data.vendProductId);
  }

  // for popup class
  handleBuyPopupClass = (data) => {
    console.log('handleBuyPopupClass: ', data);
    // const instructorName
    // var instructorName = instructorNameList[0];
    // // var classDate = moment('13/06/2020 19:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    // var classDate = '2020/06/13';
    // var classTime = '19:30:00';
    // if(option === 'risenGrindTitle1'){
    //   instructorName = instructorNameList[0];
    //   // classDate = moment('13/06/2020 19:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    //   classDate = '2020/07/04';
    //   classTime = '08:30:00';
    // }
    // else if(option === 'risenGrindTitle2'){
    //   instructorName = instructorNameList[1];
    //   // classDate = moment('13/06/2020 20:30:00').tz('Asia/Kuala_Lumpur').format('YYYYMMDD', 'hh:mm:ss');
    //   classDate = '2020/06/27';
    //   classTime = '8:30:00';
    // }
    // this.setState({
    //   danceClassRemark:data.description, 
    //   instructorName:data.instructorName, 
    //   classId:data.classId,
    //   classDate:moment(Actions.getTheDate(data.classDate)).format('YYYY/MM/DD'), 
    //   classTime:moment(Actions.getTheDate(data.classDate)).format('hh:mm:ss'), 
    //   isDanceClass:true
    // });
    if (data && data.vendProductId){
      this.props.actions.viewVendItem(data.vendProductId);
    }
    
  }

  renderDescriptionText(theText){
    return(
      <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:12}}>
        {theText}
      </Typography>
    )
  }
  render() {
    console.log('renderState: ', this.state);

    const {classes} = this.props;
    const {name, ighandleName, phone, className, icnumber, city, freezeDate, vendPromoIdObj} = this.state;

    const staff = this.props.staff || null;
    const vendProductId = this.props.match.params.vendProductId;
    const urlSearchString = this.props.location.search;
    // console.log('urlSearchString: ', urlSearchString);
    const urlEmail = urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
    // for freezing date
    // const urlDate = urlSearchString.indexOf('/?date=' === -1) ? urlSearchString.replace('?date=', '') : null;
    console.log('urlEmail: ', urlEmail);
    const isPromo = this.props.match.path.indexOf('promo') !== -1;
    const isJoin = this.props.match.path.indexOf('join') !== -1;
    const pathname = this.props.location && this.props.location.pathname;
    const pathStringSplit = pathname && pathname.split("/");
    // console.log('pathStringSplit: ', pathStringSplit);
    const vendQty = (pathStringSplit && pathStringSplit.length === 4 && pathStringSplit[3]) || 1;
    // console.log('isJoin: ', this.props.match.path.indexOf('join'));

    console.log('danceClassArray: ', this.state);

    // console.log('vendProducIdisPopups: ', vBuyPopupClass.includes(vendProductId));

    var vId = vendProductId;
    var showDetails = false;
    var isAvailable = true;
    var showQuantity = false;
    var isMembershipProduct = false;
    var jan2020Promo = false;
    var aug2020Promo = false;
    var sep2020Promo = false;
    var midSep2020Promo = false;
    
    // console.log('vendProductId: ', vendProductId);
    
    const isValentinePromo = moment().isBetween(moment('2020-01-29 10:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-08 17:00').tz('Asia/Kuala_Lumpur'))? true:false; 
    const isJan2020Promo = moment().isBetween(moment('2020-01-01 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-03 23:00').tz('Asia/Kuala_Lumpur'))? true:false; 

    if (vendProductId === 'daypass' || vendProductId === '04de7e6c-409f-488c-e6d4-9df5cc745fff') {
      vId = vBuyDayPass;
      showDetails = true;
    } else if (vendProductId === 'nightpass' || vendProductId === vBuyDancePass) {
      isAvailable = moment().isBefore(moment('2019-11-30'));
      vId = vBuyDancePass;
      showDetails = true;
    } else if (vendProductId === 'animalfloweb' || vendProductId === '90bb7eae-5cf8-c556-e147-d0b80192d03f') {
      isAvailable = moment().isBefore(moment('2019-02-18'));
      vId = isAvailable ? '90bb7eae-5cf8-c556-e147-d0b80192d03f' : '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
      isAvailable = moment().isBefore(moment('2019-03-01'));
    }else if (vendProductId === 'animalflow' || vendProductId === '3b0740b8-dde5-1891-c0ff-d4f6d33d9086') {
      vId = '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
      isAvailable = moment().isBefore(moment('2019-03-01'));
    }else if(vendProductId === '0af7b240-aba0-11e7-eddc-dbd880e1f8d5' || vendProductId === 'monthly'){
      vId = '0af7b240-aba0-11e7-eddc-dbd880e1f8d5';
      showQuantity = false;
      isMembershipProduct = true;
    }else if (vendProductId === vBuyPT60minsTier1 || vendProductId === vBuyPT60minsTier2 || vendProductId === vBuyPT60minsTier3 || vendProductId === vBuyPT60minsTierX){
      showQuantity = true;
    }else if(vendProductId === vBuy6MthPrepaidMembership || vendProductId === vBuy12MthPrepaidMembership || vendProductId === 'd2a533fc-270b-e6e4-ce6e-1f36c942b3f1' || vendProductId === 'b84e0748-c532-27d1-c24a-49cb496be254'){
      showQuantity = false;
      isMembershipProduct = true;
    }
    else if (vendProductId === vBuyDancePassTTDI || vendProductId === vBuyDanceKLCC){
      showDetails = true;
    }
    else if (vendProductId === vBuyValentineSingleClassMember 
      || vendProductId === vBuyValentineSingleClassNonMember || vendProductId === vBuyValentineDoubleClassMember 
      || vendProductId === vBuyValentineDoubleClassNonMember){
        showDetails = true;
        isAvailable = moment().isBetween(moment('2020-01-29 10:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-08 17:00').tz('Asia/Kuala_Lumpur'));
    }
    else if (vendProductId === vBuyJan2020AllAccess || vendProductId === vBuyJan2020Single){
      jan2020Promo = true;
      isAvailable = moment().isBetween(moment('2020-01-01 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-03 23:00').tz('Asia/Kuala_Lumpur'));
    }
    else if (vendProductId === vBuyAug2020Single || vendProductId === vBuyAug2020AllAccess){
      aug2020Promo = true;
      isAvailable = moment().isBetween(moment('2020-07-30 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-09-15 23:00').tz('Asia/Kuala_Lumpur'));
    }
    else if (vendProductId === vBuySep2020){
      sep2020Promo = true;
      isAvailable = moment().isBetween(moment('2020-08-28 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-09-30 23:00').tz('Asia/Kuala_Lumpur'));
    }
    else if (vendProductId === vBuyMidSep2020AllAccess || vendProductId === vBuyMidSep2020SingleAccess){
      midSep2020Promo = true;
      isAvailable = moment().isBetween(moment('2020-09-15 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-10-01 01:00').tz('Asia/Kuala_Lumpur'));
    }
    
    var isLimitedPromo = (
      vendProductId === vBuyAug2020Single || 
      vendProductId === vBuyAug2020AllAccess || 
      vendProductId === vBuySep2020 ||
      vendProductId === vBuyMidSep2020AllAccess ||
      vendProductId === vBuyMidSep2020SingleAccess
      // vendProductId === vBuySingleFLX2022 ||
      // vendProductId === vBuyAllFLX2022
      );

    const vendProducts = this.props.vendProducts;
    const vendProduct = (vendProducts && vId) ? vendProducts.get(vId) : null;
    const vendProductName = vendProduct && vendProduct.get('name');
    const vendSupplyPrice = vendProduct && vendProduct.get('supply_price');
    const vendPriceBookPrice = vendProduct && vendProduct.get('price_book_entries') && vendProduct.get('price_book_entries').first() && vendProduct.get('price_book_entries').first().get('price');
    const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
    // todo: fetch all the price from vend API instead of from vend firebase
    // const vendPrice = vendPriceAmount ? (vendProductId === vBuySep2020)? `${parseFloat(vendPriceAmount*1.06).toFixed(2)}`:`${parseFloat(vendPriceAmount).toFixed(2)}` : null;
    // const vendPrice = vendPriceAmount ? `${parseFloat(vendPriceAmount*1.06).toFixed(2)}`: null;
    const vendPrice = vendPriceAmount;

    // for promotion
    const vendPromoObj = vendPromoIdObj && vId && vendPromoIdObj[vId];
    
    const vendPromoName = vendPromoObj && vendPromoObj.name;
    const actionPromo = vendPromoObj && vendPromoObj.action;
    
    // for condition
    const condition = vendPromoObj && vendPromoObj.condition;
    const conditionType = condition && condition.type;
    const conditionPromoMinQty = condition && condition.min_quantity;
    const conditionPromoMaxQty = condition && condition.max_quantity;

    // for action
    const actionPromoType = vendPromoObj && vendPromoObj.action && vendPromoObj.action.type;
    const actionPromoValue = vendPromoObj && vendPromoObj.action && vendPromoObj.action.value;
    const actionInc = vendPromoObj && vendPromoObj.action && vendPromoObj.action.include;
    const actionQty = (vendPromoObj && vendPromoObj.action && vendPromoObj.action.quantity) || 1;
    // const variant_options = vendProducts &&

    var actionIncValueArray = [];
    // var actionIncValueObj = {};
    var actionValueArrayRender = [];
    var vendProdActionData;
    // actionInc && actionInc.forEach(actionData=>{
    //   const actionField = actionData.field;
    //   const actionValue = actionData.value;
    //   console.log('actionValue: ', actionValue);
    //   console.log('actionField: ', actionField);
    //   var vendProdAction, vendProdActionName;
    //   if (actionField && actionField === 'product_id' && actionValue){
    //     vendProdActionData = (vendProducts) ? vendProducts.get(actionValue) : null;
    //     const vendProdActionName = vendProdActionData && vendProdActionData.get('name');
    //     actionValueArrayRender.push(this.renderDescriptionText(`Discount on product: ${vendProdActionName}`));
    //   }
    //   else if (actionField && actionField === 'variant_parent_id' && actionValue){
    //     // vendProdActionData = (vendProducts) ? vendProducts.data() : null;
    //     // console.log('vendProdActionData2:', vendProdActionData);
      
    //   }
    // });

    // for subproduct display (discount)
    const vendProdDiscountList = vendPromoObj && vendPromoObj.vendProdDiscountList;
    vendProdDiscountList && Object.entries(vendProdDiscountList).forEach(([key,value]) => {
      const vendProdActionName = value.name;

      const vendProdActionSupplyPrice = value.supply_price;
      const vendProdActionPriceBookPrice = value && value.price_book_entries && value.price_book_entries[0] && value.price_book_entries[0].price;
      // const vendProdActionPriceAmount = vendProdActionSupplyPrice && parseFloat(vendProdActionSupplyPrice) > 0 ? vendProdActionSupplyPrice : vendProdActionPriceBookPrice;
      const vendProdActionPriceAmount = vendProdActionPriceBookPrice? vendProdActionPriceBookPrice : vendProdActionSupplyPrice && parseFloat(vendProdActionSupplyPrice) > 0 ? vendProdActionSupplyPrice : 0;

      if (vendProdActionName){
        actionValueArrayRender.push(this.renderDescriptionText(`Discount on product: ${vendProdActionName}`));
        actionValueArrayRender.push(this.renderDescriptionText(`Original Price: ${parseFloat(vendProdActionPriceAmount).toFixed(2)}`));
      }
    });


    const isBasicPercentDiscProdSet = (actionPromoType === 'basic_percent_discount' && conditionType && conditionType === 'product_set' && (!conditionPromoMinQty||!conditionPromoMaxQty))? true:false;
    const isBasicFixedDiscProdSet = actionPromoType === 'basic_fixed_discount' && conditionType && conditionType === 'product_set' && (!conditionPromoMinQty||!conditionPromoMaxQty)? true:false;
    const isBasicPercentDiscProdSetWithMinMaxQty = actionPromoType === 'percent_discount' && conditionType && conditionType === 'product_set' && (conditionPromoMinQty||conditionPromoMaxQty)? true:false;
    const isBasicFixedDiscProdSetWithMinMaxQty = actionPromoType === 'fixed_discount' && conditionType && conditionType === 'product_set' && (conditionPromoMinQty||conditionPromoMaxQty)? true:false;
    const isFixedPoolDiscount = actionPromoType === 'fixed_pool_discount' && conditionType && conditionType === 'product_set'? true:false;
    const isPercentPoolDiscount = actionPromoType === 'percent_pool_discount' && conditionType && conditionType === 'product_set'? true:false;
    const isFixedPriceDiscProdSet = actionPromoType === 'fixed_price_discount' && conditionType && conditionType === 'product_set'? true:false;

    const promoPriceTax = vendPromoObj && vendPrice && actionPromoType && 
      isBasicPercentDiscProdSet? vendPrice*actionPromoValue:
      (isBasicFixedDiscProdSet)? parseFloat(vendPrice) - actionPromoValue:
      isBasicPercentDiscProdSetWithMinMaxQty? vendPrice:
      isBasicFixedDiscProdSetWithMinMaxQty? vendPrice:
      null;
    
    console.log('isBasicPercentDiscProdSetWithMinMaxQty: ', isBasicPercentDiscProdSetWithMinMaxQty);
    console.log('vendPrice: ', parseFloat(vendPrice));
    console.log('actionPromoType: ', actionPromoType);
    console.log('promoPriceTax: ', promoPriceTax);
    console.log('actionPromoValue: ', actionPromoValue);

    const priceAfterPromo = (actionPromoType === 'basic_percent_discount' || actionPromoType === '')? parseFloat(vendPrice - promoPriceTax).toFixed(2):
      (actionPromoType === 'basic_fixed_discount')? promoPriceTax:null; 
    ;
    console.log('priceAfterPromo: ', priceAfterPromo);

    const message = this.props.message || ' ';

    const mcId = this.state.mcId;
    const mc = mcId && staff && staff.get(mcId) ? staff.get(mcId) : null;
    const mcName = mc && mc.has('name') ? mc.get('name') : null;
    const mcImage = mc && mc.has('image') ? mc.get('image') : null;
    const mcAvatar = mcImage || (mcName && mcName.length > 0) ?
      (mcImage ? (<Avatar src={mcImage} />) : (<Avatar>{mcName.charAt(0).toUpperCase()}</Avatar>)) :
      null;

    const lowerCaseEmail = urlEmail ? urlEmail.toLowerCase() : this.state.email.toLowerCase();
    const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
    const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
    const isCorpEmail = isValidEmail && (email.indexOf('bfm.my') !== -1 || email.indexOf('bfmedge.com') !== -1 || email.indexOf('fi.life') !== -1);
    const isValidName = this.state.name && this.state.name.length>=4;
    const isValidPhone = this.state.phone && this.state.phone.length>=6;

    const classDate = this.state.classDate ? moment(this.state.classDate).format('YYYY-MM-DD') : null;
    const quantity = this.state.quantity || 1;
    const isValidIc =icnumber.length>=10;
    const isValidPostCode = this.state.postcode && this.state.postcode.length>=4;
    const isValidRefSource = this.state.refSource && this.state.refSource.length>=3;
    const isValidMcId = this.state.mcId;

    // console.log('isAddingInvoice: ', this.props.isAddingInvoice);
    const disableContinue = isLimitedPromo? (!isValidEmail || this.props.isAddingInvoice || !isValidName || !isValidPhone || !isValidPostCode || !isValidRefSource || !isValidMcId || !isValidIc ):
    (!isValidEmail || this.props.isAddingInvoice || !this.state.checked);

    const isSpecialTnC = vendProductId === 'd2a533fc-270b-e6e4-ce6e-1f36c942b3f1';
    // console.log(isJoin, isPromo, vendProductId, isCorpEmail, isSpecialTnC);
    const membershipText = 'Membership';
    const the3MthAgreement = 'I understand and agree that this membership package requires a total payment of RM660, made payable via debit card or credit card for my first month’s payment (RM110), second month’s payment (RM220) and third month’s payment (RM330) via monthly auto-debit on my billing date.';

    const TextFieldEmail = <TextField
                            id="email"
                            label="Email*"
                            fullWidth
                            onChange={this.handleChange('email')}
                            autoComplete='off'
                            value={email}
                            style={{marginBottom:8}}
                          />;
    const TextFieldName = <TextField
                            id="name"
                            label="Full Name (as stated in your IC/Passport) *"
                            fullWidth
                            onChange={this.handleChange('name')}
                            autoComplete='off'
                            value={name}
                            style={{marginBottom:8}}
                          />;
    const TextFieldIGHandleName = <TextField
                          id="ighandleName"
                          label="Instagram Handle"
                          fullWidth
                          onChange={this.handleChange('ighandleName')}
                          autoComplete='off'
                          value={ighandleName}
                          style={{marginBottom:8}}
                        />;
    const TextFieldIC = <TextField
                          id="icnumber"
                          label="IC/Passport Number *"
                          fullWidth
                          onChange={this.handleChange('icnumber')}
                          autoComplete='off'
                          value={icnumber}
                          // type='number'
                          style={{marginBottom:8}}
                        />;
    const TextFieldPhoneNum = <TextField
                                id="phone"
                                label="Phone Number *"
                                fullWidth
                                onChange={this.handleChange('phone')}
                                autoComplete='off'
                                value={phone}
                                type='number'
                                style={{marginBottom:8}}
                              />;
    
    const TextFieldCity = <TextField id="city" label="which city you live in" fullWidth
                              onChange={this.handleChange('city')} autoComplete='off' value={city} style={{marginBottom:8}}/>;

    const termNConditions = <FormGroup row style={{justifyContent:'center'}}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={this.state.checked}
                                    onChange={this.handleChange('checked')}
                                    value="checked"
                                  />
                                }
                                label={(
                                  <div>I have read and agreed to the <a style={{textDecoration: 'underline'}} onClick={()=>this.props.actions.viewTermsConditions(isSpecialTnC)}>Terms & Conditions</a> and <a style={{textDecoration: 'underline'}} onClick={()=>this.props.actions.viewPrivacyPolicy()}>Privacy Policy</a>.</div>)}
                              />
                            </FormGroup>;
    
    const promoRadBtn = <FormGroup row style={{justifyContent:'center', marginTop:20}}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.checked}
                                  onChange={this.handleChange('checked')}
                                  value={this.state.checked}
                                />
                              }
                              label={(<div>{the3MthAgreement}</div>)}/>
                          </FormGroup>;

    const continueBtn = <Button 
                          raised color='primary' key={'continue'} 
                          classes={{disabled:classes.buttonDisabled}} 
                          onClick={()=>this.handleContinue()} 
                          disabled={disableContinue}>
                          {isAvailable? 'Continue' : 'Not Available'}
                          {this.props.isAddingInvoice &&
                            <CircularProgress style={{color:'white', marginLeft:8}}/>
                          }
                        </Button>
    
    const festPromo = <div>
                        <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                          Enjoy special perks when you join as a member only during IN Festival!
                        </Typography>
                        <Grid container spacing={10}>
                          <Grid item xs={12} sm={12} lg={12}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                              <Button raised color='primary' key={'6month'} classes={{disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem('monthly', true, urlEmail)}>Monthly Membership</Button>
                            </div>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                              One Technogym Band (RM200)
                            </Typography>
                            <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0, fontStyle:'italic'}}>
                              or
                            </Typography>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:16}}>
                              Three PT sessions (RM360)
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={12} lg={12}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                              <Button raised color='primary' key={'6month'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy6MthPrepaidMembership, true, urlEmail)}>6 Months Prepaid Membership</Button>
                            </div>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                              One Technogym Band (RM200)
                            </Typography>
                            <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0, fontStyle:'italic'}}>
                              plus
                            </Typography>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:16}}>
                              Three PT sessions (RM360)
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={12} lg={12}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                              <Button raised color='primary' key={'12month'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy12MthPrepaidMembership, true, urlEmail)}>12 Months Prepaid Membership</Button>
                            </div>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                              One Technogym Band (RM200)
                            </Typography>
                            <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0, fontStyle:'italic'}}>
                              plus
                            </Typography>
                            <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:16}}>
                              Five PT sessions (RM600)
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:32}}>
                          New members are also entitled to lucky draw for:
                        </Typography>
                        <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                          1 Month VIP Pass, 1 Week VIP Pass or Mini Blackroll
                        </Typography>
                      </div>;
    
    const jan2020PromoLayout = <div>
                          <Grid item xs={12}>
                            <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                              {membershipText}
                            </Typography>
                            <Button raised color='primary' key={'jan2020PromoSingle'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyJan2020Single, false, urlEmail)}>Buy January 2020 Promo (Single)</Button>
                            <Button raised color='primary' key={'jan2020PromoAll'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyJan2020AllAccess, false, urlEmail)}>Buy January 2020 Promo (All Access)</Button>
                          </Grid>
                        </div>;

    const postCodeLabel = 'Postcode (of home address) *';      
    const howDidUknowLabel = 'How did you know about us? *';

    const postCodeTextInput = 
                      <TextField
                        margin="dense"
                        id="postCode"
                        label={postCodeLabel}
                        type="number"
                        fullWidth
                        onChange={this.handleChange('postcode')}
                        autoComplete='off'
                        onInput = {(e) =>{
                          e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,5)
                        }}
                      />;
    
    const refSourceLayoutFalse = <IntegrationAutosuggest selections='referralSource' placeholder={howDidUknowLabel} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>;
    const refSourceLayoutTrue =  <div style={{marginTop:16}}>
                                    <FormLabel component="legend">Referral Source</FormLabel>
                                    <Chip
                                      avatar={null}
                                      label={this.state.refSource}
                                      style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                                      onDelete={()=>this.handleAutosuggest('refSource', null)}
                                    />
                                  </div>;
    const mcLayoutFalse = <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name *" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>;
    const mcLayoutTrue = <div style={{marginTop:16}}>
                            <FormLabel component="legend">Customer Relations Officer's Name</FormLabel>
                            <Chip
                            avatar={mcAvatar}
                            label={mcName}
                            style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                            onDelete={()=>this.handleAutosuggest('mcId', null)}
                            />
                          </div>
    
    const ChoreographyMaybellineTitle = `Choreography by Mayhem (Maybelline) Zoom | 9PM | 11/6`;
    const classTitle1 = `GRIIND (Intro) (Donna) ZOOM | 9PM | THU (2/7)`;
    const classTitle2 = `Choreography by Mayhem (Maybelline) ZOOM | 9PM | THU (9/7)`;
    const classTitle3 = `Choreography by Mayhem (Donna) ZOOM | 9PM | THU (16/7)`;
    const classTitle4 = `GRIIND (Maybelline) ZOOM | 9PM | THU (23/7)`;

    const ChoreographyDonnaTitle = `Choreography by Mayhem (Donna) Zoom | 9PM | 18/6`;
    const GriindMaybellineTitle = `GRIIND (Maybelline) Zoom | 9PM | 25/6`;
    const risenGrindTitle1 = `Rise & Griind (Maybelline) Park in TTDI | 7.30AM | 13/6`;
    // const risenGrindTitle2 = `Rise & GRIIND (Maybelline) Park in TTDI | 8:30am | 20/6`;
    const risenGrindTitle2 = 'Groove Thang (Donna) PARK IN TTDI | 8:30AM | SAT (4/7)';
    // const donnaText = <Typography component="h2" color="primary" style={{textAlign:'center', marginBottom:32}}>{'Donna'}</Typography>
    const whatUWantToAchieveLabel = 'What would you like to achieve?';

    // console.log('vendProductIdfreeze: ', vendProductId);
    // console.log('vbuyfreeze3221: ', vBuyFreeze);
    // console.log('dance class limit: ', this.state.danceLimitClassCount);

    return (
      <div className={classes.container}>
        <Card className={classes.content} elevation={0}>
        {(!this.state.continueRegistration && (!isPromo || (isPromo && vendProductId))) &&
          <CardMedia
          className={classes.media}
          image={require('./assets/babel-icon-blue.png')}
          title="Babel - Inspire. Change"
          />
        }
        <CardContent >
          {(!vendProductId && !isPromo && !isJoin) &&
            <div>
              <Grid container spacing={10}>
                {false && <Grid item xs={12} sm={6} lg={4}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    {membershipText}
                  </Typography>
                  <Button raised color='primary' key={'jan2020Promo'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyJan2020AllAccess)}>Buy January 2020 Promo</Button>
                  {true && <Button raised color='primary' key={'6month'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy6MthPrepaidMembership)}> Buy 6 Months Prepaid Membership</Button>}
                  {false && <Button raised color='primary' key={'12month'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy12MthPrepaidMembership)}> Buy 12 Months Prepaid Membership</Button>}
                </Grid>}
                {false && <Grid item xs={12} sm={6} lg={4}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Day Passes
                  </Typography>
                  <Button raised color='primary' key={'dayPass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyDayPass)}> Buy Day Pass</Button>
                  {false && <Button raised color='primary' key={'nightPass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyDancePass)}> Buy Dance Pass</Button>}
                </Grid>}
                {false && <Grid item xs={12} sm={6} lg={4}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Personal Training
                  </Typography>
                  <Button raised color='primary' key={'tier1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPT60minsTier1)}> Buy PT60mins Tier 1</Button>
                  <Button raised color='primary' key={'tier2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPT60minsTier2)}> Buy PT60mins Tier 2</Button>
                  <Button raised color='primary' key={'tier3'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPT60minsTier3)}> Buy PT60mins Tier 3</Button>
                  <Button raised color='primary' key={'tierx'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPT60minsTierX)}> Buy PT60mins Tier X</Button>
                </Grid>}
                <Grid item xs={12}>
                  <StdText text = {'Academy'} variant = 'h4' style={{textAlign:'center', marginTop:16, marginBottom:16}}/>
                  {/* <Typography variant="h4" component="h1" color="primary" gutterBottom style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Academy
                  </Typography> */}
                  <StdButton
                    text = {'Buy Animal Flow'}
                    key = {'animalflow'}
                    // disabled={!isValidEmail || this.props.isFetchingEmail}
                    onClick={()=>this.props.actions.viewVendItem(vBuyAnimalFlow)}
                  />
                  {false && <Button raised color='primary' key={'animalflow'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyAnimalFlow)}> Buy Animal Flow</Button>}
                  {false && <Button raised color='primary' key={'pilatesfoundation'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPilatesFoundation)}> Buy Pilates Foundation</Button>}
                </Grid>

                {false && (this.state.danceClassArray && this.state.danceClassArray.length>=1) && <Grid item xs={12}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Babel Dance
                  </Typography>
                  <Button raised color='primary' key={'vptClass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.props.actions.viewVendItem('491c8f9f-1e00-a9c4-a82c-8fdba5de6329')}}>{'Single Class Virtual Dance Pass'}</Button>
                  <Button raised color='primary' key={'doubleClass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.props.actions.viewVendItem('7a154af8-b067-b337-aa1c-06ab6d1df79a')}}>{'Double Class Virtual Dance Pass'}</Button>
                  <Button raised color='primary' key={'videographyClass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.props.actions.viewVendItem('06e22a00-c8e9-e3fb-ed46-46324ad1b0b9')}}>{'Choreography Video Project'}</Button>
                </Grid>}
                {false && <Grid item xs={12}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                  </Typography>
                  <Button raised color='primary' key={'vptClass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.props.actions.viewVendItem('491c8f9f-1e00-a9c4-a82c-8fdba5de6329')}}>{'VIRTUAL DANCE PASS'}</Button>
                </Grid>}
                {false && <Grid item xs={12} sm={6} lg={4}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Babel Dance
                  </Typography>
                  <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    {'Virtual Dance Pass'}
                  </Typography>

                  {true && <Button raised color='primary' key={'vdDonna1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyRM20DanceClass(classTitle1, 'vdDonna1')}}>{classTitle1}</Button>}
                  {true && <Button raised color='primary' key={'vdMaybelline1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyRM20DanceClass(classTitle2, 'vdMaybelline1')}}>{classTitle2}</Button>}
                  <Button raised color='primary' key={'vdDonna2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyRM20DanceClass(classTitle3, 'vdDonna2')}}>{classTitle3}</Button>
                  <Button raised color='primary' key={'vdMaybelline2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyRM20DanceClass(classTitle4, 'vdMaybelline2')}}>{classTitle4}</Button>

                  {false && <Button raised color='primary' key={'tier1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyDancePassTTDI)}> Buy Dance Pass (TTDI)</Button>}
                  {false && <Button raised color='primary' key={'tier2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyDanceKLCC)}> Buy Dance Pass (KLCC)</Button>}
                  {false && <Button raised color='primary' key={'tier3'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyFckFloor)}> Buy Fck the Floor (3 Sessions)</Button>}
                  {false && <Button raised color='primary' key={'tierx'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuySpecialClass)}> Buy Special Class/Workshop Pass</Button>}
                  {isValentinePromo && <Button raised color='primary' key={'vSpeacialSingleMem'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyValentineSingleClassMember)}> Valentine’s Special | Single Class (Member) </Button>}
                  {isValentinePromo && <Button raised color='primary' key={'vSpeacialSingleNonMem'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyValentineSingleClassNonMember)}> Valentine’s Special | Single Class (Non-member) </Button>}
                  {isValentinePromo && <Button raised color='primary' key={'vSpeacialDoubleMem'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyValentineDoubleClassMember)}> Valentine’s Special | Double Class (Member) </Button>}
                  {isValentinePromo && <Button raised color='primary' key={'vSpeacialDoubleNonMem'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyValentineDoubleClassNonMember)}> Valentine’s Special | Double Class (Non-Member) </Button>}
                </Grid>}
                {true && (this.state.danceClassArray && this.state.danceClassArray.length>=1) && <Grid item xs={12}>
                  <StdText text = {'Babel Dance'} variant = 'h4' style={{textAlign:'center', marginTop:16, marginBottom:16}}/>
                  {this.state.danceClassArray.map((data)=>{
                      return(
                        <StdButton
                          text = {data.name}
                          key = {data.name}
                          // disabled={!isValidEmail || this.props.isFetchingEmail}
                          // onClick={()=>this.props.actions.viewVendItem(data.vendProductId)}
                          onClick={()=>this.handleBuyDanceClass(data)}
                        />
                      )
                  })}
                  {false && <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    {'Open-Air Dance Pass'}
                  </Typography>}
                
                  {false && (this.state.riseGriindClassCount <= 10) && <Button raised color='primary' key={'MayhemMabellineOutDoor2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyParkDanceClass(risenGrindTitle2, 'risenGrindTitle2')}}>{risenGrindTitle2}</Button>}
                  {false && (this.state.riseGriindClassCount <= this.state.danceClassArray[0].maxCapacity) && this.state.danceClassArray.map((data)=>{
                    // console.log('danceClassArrayMap: ', data);
                    return(
                      <Button raised color='primary' key={data.name} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyParkDanceClass(data)}}>{data.description}</Button>
                    )
                  })}
                  {false && <Button raised color='primary' key={'MayhemMabellineOutDoor2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyParkDanceClass(risenGrindTitle2, 'risenGrindTitle2')}}>{risenGrindTitle2}</Button>}
                  
                </Grid>}
                {(this.state.popupClassArray && this.state.popupClassArray.length>=1) && <Grid item xs={12}>
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                    Pop-Up Class
                  </Typography>
                  {this.state.popupClassArray && this.state.popupClassArray.map((data)=>{
                    // console.log('danceClassArrayMap: ', data);
                    return(
                      <Button raised color='primary' key={data.name} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{this.handleBuyPopupClass(data)}}>{data.description}</Button>
                    )
                  })}
                </Grid>}
              </Grid>
            </div>
          }
          {(!vendProductId && isPromo && !isJoin) &&
            <div>
              {false && festPromo}
              {isJan2020Promo && jan2020PromoLayout}
            </div>
          }

          {(!vendProductId && !isPromo && isJoin) &&
            <div>
              <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                Join now as a Babel Member
              </Typography>
              {isCorpEmail &&
                <Grid container spacing={10}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'corp180'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem('d2a533fc-270b-e6e4-ce6e-1f36c942b3f1', false, urlEmail)}>12 Months Contract</Button>
                    </div>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 180/month
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'corp230'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem('b84e0748-c532-27d1-c24a-49cb496be254', false, urlEmail)}>Monthly Rolling Membership</Button>
                    </div>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 230/month
                    </Typography>
                  </Grid>
                </Grid>
              }
              {!isCorpEmail &&
                <Grid container spacing={10}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'monthly'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem('monthly', false, urlEmail)}>Monthly Membership</Button>
                    </div>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 250 monthly
                    </Typography>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 350 Joining Fee
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'6month'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy6MthPrepaidMembership, false, urlEmail)}>6 Months Prepaid Membership</Button>
                    </div>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 1500 biyearly
                    </Typography>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 100 Joining Fee
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'12month'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy12MthPrepaidMembership, false, urlEmail)}>12 Months Prepaid Membership</Button>
                    </div>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      RM 3000 yearly
                    </Typography>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      No Joining Fee
                    </Typography>
                    <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      Plus one free month!
                    </Typography>
                  </Grid>
                </Grid>
              }

            </div>
          }

          {(vendProductId && (vendProductId === 'monthly' || vendProductId === vBuy6MthPrepaidMembership)) &&
            <div className={classes.contentInner}>
              <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                {'Joining Fee'}
              </Typography>
              <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                {vendProductId === 'monthly' ? 'RM350' : 'RM100'}
              </Typography>
              {vendProductName &&
                <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                  {vendProductName}
                </Typography>
              }
              {vendPrice &&
                <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                RM{vendPrice}
                </Typography>
              }
              {!vendProductName &&
                <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
              }
              {isAvailable &&
                <div>
                {!urlEmail &&
                  <div>
                    {TextFieldEmail}
                    {TextFieldName}
                    {TextFieldPhoneNum}
                    {jan2020Promo && TextFieldIC}
                    {jan2020Promo && postCodeTextInput}
                    {jan2020Promo && !this.state.refSource && refSourceLayoutFalse}
                    {jan2020Promo && this.state.refSource && refSourceLayoutTrue}
                    {jan2020Promo && !mcId && mcLayoutFalse}
                    {jan2020Promo && mcId && mcLayoutTrue}
                  </div>
                }
                {showDetails &&
                  <div>
                    <TextField
                      id="className"
                      label="Which class would you like to attend?"
                      fullWidth
                      onChange={this.handleChange('className')}
                      autoComplete='off'
                      value={className || ''}
                      style={{marginBottom:8}}
                    />
                    <TextField
                      id="classDate"
                      label="Which date would you like to attend?"
                      type="date"
                      value={classDate || ''}
                      margin="dense"
                      fullWidth
                      onChange={this.handleChange('classDate')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  }
                  {(showQuantity && !isPromo) &&
                    <TextField
                      id="quantity"
                      label="Quantity"
                      onChange={this.handleChange('quantity')}
                      autoComplete='off'
                      value={quantity}
                      type='number'
                      style={{marginBottom:8}}
                      InputProps={{
                        endAdornment: (
                          <div>
                            <InputAdornment position="end" style={{fontSize:'1rem'}}>
                              <Button style={{padding:0, minWidth:0, minHeight:0}} onClick={()=>{
                                  var quantity = this.state.quantity || 1;
                                  quantity+=1;
                                  this.setState({quantity:quantity})
                                }}>
                                <AddIcon style={{width:22, height:22}}/>
                              </Button>
                              <Button style={{padding:0, minWidth:0, minHeight:0}} disabled={!this.state.quantity || this.state.quantity === 1} onClick={()=>{
                                  var quantity = this.state.quantity || 1;
                                  quantity-=1;
                                  this.setState({quantity:quantity})
                                }}>
                                <RemoveIcon style={{width:22, height:22}}/>
                              </Button>
                            </InputAdornment>
                          </div>
                        ),
                        disableUnderline:false,
                        className: classes.quantityInput
                      }}
                    />
                  }

              </div>
            }
            {jan2020Promo && promoRadBtn}
            {termNConditions}
            {continueBtn}
            </div>
          }

          {(vendProductId && (vendProductId === vBuyDanceDanceParkClass) 
            || (vBuyPopupClass.includes(vendProductId)) || this.state.isDanceClass)
          &&
            <div className={classes.contentInner}>
              {vendProductName &&
                <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                  {'Buy'} {vendProductName}
                </Typography>
              }
              {vendPrice &&
                <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                RM{vendPrice}
                </Typography>
              }
              <Typography component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                {this.state.danceClassRemark}
              </Typography>
              {!vendProductName &&
                <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
              }
              {isAvailable &&
                <div>
                {!urlEmail &&
                  <div>
                    {TextFieldEmail}
                    {TextFieldName}
                    {TextFieldPhoneNum}
                    {TextFieldIGHandleName}
                    {TextFieldCity}
                  </div>
                }          
              </div>
            }
            {<FormGroup row style={{justifyContent:'center', alignItems:'center'}}>
              <FormControlLabel
                  control={
                  <Checkbox
                      checked={this.state.checkedTTDI}
                      onChange={this.handleCheckBox('checkedTTDI')}
                      value="checkedTTDI"
                  />
                  }
                  label={(<p className = {classes.smallMontSerrat}>TTDI</p>)}
              />
              <FormControlLabel
                  control={
                  <Checkbox
                      checked={this.state.checkedKLCC}
                      onChange={this.handleCheckBox('checkedKLCC')}
                      value="checkedKLCC"
                  />
                  }
                  label={(<p className = {classes.smallMontSerrat}>KLCC</p>)}
              />
                <FormControlLabel
                  control={
                  <Checkbox
                      checked={this.state.checkedNonMember}
                      onChange={this.handleCheckBox('checkedNonMember')}
                      value="checkedNonMember"
                  />
                  }
                  label={(<p className = {classes.smallMontSerrat}>NON-MEMBER</p>)}
              />
            </FormGroup>}
            {termNConditions}
            {continueBtn}
          </div>
          }

          {vendProductId && isLimitedPromo &&
            <div className={classes.contentInner}>
               {vendProductName &&
                <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32, marginTop:70}}>
                  Buy {vendProductName}
                </Typography>
              }
              {vendPrice &&
                <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                RM{vendPrice}
                </Typography>
              }
              {!vendProductName &&
                <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
              }
              {isAvailable &&
                <div>
                {!urlEmail &&
                  <div>
                    {TextFieldEmail}
                    {this.state.showMemberDetails && TextFieldName}
                    {this.state.showMemberDetails && TextFieldPhoneNum}
                    {this.state.showMemberDetails && TextFieldIC}
                    {this.state.showMemberDetails && postCodeTextInput}
                    {this.state.showMemberDetails && !this.state.refSource && refSourceLayoutFalse}
                    {this.state.showMemberDetails && this.state.refSource && refSourceLayoutTrue}
                    {this.state.showMemberDetails && !mcId && mcLayoutFalse}
                    {this.state.showMemberDetails && mcId && mcLayoutTrue}
                    {this.state.showErrorMsg && this.state.errorMsg && 
                      <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32, fontSize:'0.875rem', color:'red'}}>
                        {this.state.errorMsg}
                      </Typography>
                    }
                  </div>
                }

              </div>
            }
           
            {false && this.state.showMemberDetails && termNConditions}
            
            {!this.state.showMemberDetails && <Button 
              raised color='primary' key={'checkExistingMember'} 
              classes={{disabled:classes.buttonDisabled}} 
              onClick={()=>this.handleCheckExistingMember()} 
              disabled={disableContinue}
              >
              {isAvailable? 'Continue' : 'Not Available'}
              {this.props.isAddingInvoice &&
                <CircularProgress style={{color:'white', marginLeft:8}}/>
              }
            </Button>}
            {this.state.showMemberDetails && continueBtn}
            {
              <div style = {{cursor:'pointer'}} onClick = {()=>{this.handleBackPress(vendProductId)}}> 
                <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginBottom:32, fontSize: '0.875rem', fontWeight:500}}>
                  {(this.state.phone && this.state.name)? 'CLEAR':'BACK'}
               </Typography>
              </div>
            }
          </div>
          }

          {(vendProductId && (vendProductId !== 'monthly' && vendProductId !== vBuy6MthPrepaidMembership && vendProductId !== vBuyDanceRM20Class && vendProductId !== vBuyDanceDanceParkClass) 
          && !isLimitedPromo && !vBuyPopupClass.includes(vendProductId) && !this.state.isDanceClass) &&
            <div className={classes.contentInner}>
              {vendProductName &&
                <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                  {isMembershipProduct ? 'Join' : 'Buy'} {vendProductName}
                </Typography>
              }
              {vendPromoObj && vendPromoName && this.renderDescriptionText(`Discount Name: ${vendPromoName}`)}
              {vendPromoObj && actionPromoType && this.renderDescriptionText(`Promo Type: ${actionPromoType}`)}
              {vendPrice && this.renderDescriptionText(`Unit Price: RM${vendPrice}`)}
              {vendPrice && vendQty && (vendQty > 1) && this.renderDescriptionText(`Total Price: RM${(vendPrice*vendQty).toFixed(2)}`)}
              {vendQty && this.renderDescriptionText(`Quantity: ${vendQty}`)}
              {vendPromoObj && actionPromoType && actionPromoValue && (actionPromoType === 'basic_percent_discount') && this.renderDescriptionText(`Discount: ${actionPromoValue*100}%`)}
              {vendPromoObj && actionPromoType && actionPromoValue && (actionPromoType === 'basic_fixed_discount') && this.renderDescriptionText(`Discount: - RM${actionPromoValue}`)}
              {vendPromoObj && actionPromoValue && priceAfterPromo && vendQty && (actionPromoType!='fixed_pool_discount') && this.renderDescriptionText(`Total Price after Discount: RM${(priceAfterPromo*vendQty).toFixed(2)}`)}
              {vendPromoObj && actionPromoValue && vendQty && (actionPromoType==='fixed_pool_discount') && this.renderDescriptionText(`Total Price after Discount: RM${((vendPrice*vendQty) - actionPromoValue).toFixed(2)}`)}
              {vendPromoObj && actionPromoValue && vendQty && (actionPromoType==='percent_pool_discount') && this.renderDescriptionText(`Total Price after Discount: RM${((vendPrice*vendQty)*(1-actionPromoValue)).toFixed(2)}`)}
              {vendPromoObj && actionPromoValue && vendQty && (actionPromoType==='fixed_price_discount') && this.renderDescriptionText(`Total Price after Discount: RM${(actionPromoValue).toFixed(2)}`)}
              {vendPromoObj && actionPromoValue && actionValueArrayRender.length>0 && actionValueArrayRender}

              {!vendProductName &&
                <CircularProgress style={{margin:'auto', display:'block', height:120, width:120}}/>
              }
              {isAvailable &&
                <div>
                {!urlEmail &&
                  <div>
                    {TextFieldEmail}
                    {TextFieldName}
                    {TextFieldPhoneNum}
                    {TextFieldIC}
                    {postCodeTextInput}
                    {!this.state.refSource && refSourceLayoutFalse}
                    {this.state.refSource && refSourceLayoutTrue}
                    {!mcId && mcLayoutFalse}
                    {mcId && mcLayoutTrue}
                    {!this.state.achieveTargetSource && <IntegrationAutosuggest selections='achieveTargetSource' placeholder={whatUWantToAchieveLabel} onSelectionChange={selectedAchieveTargetSource => this.handleAutosuggest('achieveTargetSource', selectedAchieveTargetSource)}/>}
                    {this.state.achieveTargetSource && 
                      <div style={{marginTop:16}}>
                        <FormLabel component="legend">Referral Source</FormLabel>
                        <Chip
                          avatar={null}
                          label={this.state.achieveTargetSource}
                          style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                          onDelete={()=>this.handleAutosuggest('achieveTargetSource', null)}
                        />
                      </div>
                    }
                  </div>
                }
                {showDetails &&
                  <div>
                    <TextField
                      id="className"
                      label="Which class would you like to attend?"
                      fullWidth
                      onChange={this.handleChange('className')}
                      autoComplete='off'
                      value={className || ''}
                      style={{marginBottom:8}}
                    />
                    <TextField
                      id="classDate"
                      label="Which date would you like to attend?"
                      type="date"
                      value={classDate || ''}
                      margin="dense"
                      fullWidth
                      onChange={this.handleChange('classDate')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  }
                  {(showQuantity && !isPromo) &&
                    <TextField
                      id="quantity"
                      label="Quantity"
                      onChange={this.handleChange('quantity')}
                      autoComplete='off'
                      value={quantity}
                      type='number'
                      style={{marginBottom:8}}
                      InputProps={{
                        endAdornment: (
                          <div>
                            <InputAdornment position="end" style={{fontSize:'1rem'}}>
                              <Button style={{padding:0, minWidth:0, minHeight:0}} onClick={()=>{
                                  var quantity = this.state.quantity || 1;
                                  quantity+=1;
                                  this.setState({quantity:quantity})
                                }}>
                                <AddIcon style={{width:22, height:22}}/>
                              </Button>
                              <Button style={{padding:0, minWidth:0, minHeight:0}} disabled={!this.state.quantity || this.state.quantity === 1} onClick={()=>{
                                  var quantity = this.state.quantity || 1;
                                  quantity-=1;
                                  this.setState({quantity:quantity})
                                }}>
                                <RemoveIcon style={{width:22, height:22}}/>
                              </Button>
                            </InputAdornment>
                          </div>
                        ),
                        disableUnderline:false,
                        className: classes.quantityInput
                      }}
                    />
                  }
                  {(vendProductId === vBuyFreeze) &&
                     <TextField
                     id="freezeDate"
                     label="Select freeze date"
                     type="date"
                     value={freezeDate || ''}
                     margin="dense"
                     fullWidth
                     onChange={this.handleChange('freezeDate')}
                     InputLabelProps={{
                       shrink: true,
                     }}
                     style={{marginBottom:10}}
                   />     
                  }

              </div>
            }
            {jan2020Promo && promoRadBtn}
            {!isLimitedPromo && termNConditions}
            {continueBtn}
          </div>
          }
          
          <BabelLogo 
              hideLogo={true}
              tncLink = {'https://www.babel.fit/terms-conditions'}
              privacyPolicyLink = {'https://www.babel.fit/terms-conditions'}
          />

        </CardContent>
        </Card>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
          <DialogContent>
            <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginBottom:8}}>
              To make and confirm a class booking, please:
            </Typography>
            <List>
              <ListItem>
                1.
                <ListItemText primary="Complete payment and screenshot your receipt" style={{paddingLeft:16, paddingBottom:0}}/>
              </ListItem>
              <ListItem>
                2.
                <ListItemText primary="Call Customer Support at 016-3193520" style={{paddingLeft:16}}/>
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button key={'cancel'} onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button raised key={'pay'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={this.handleContinue} color="primary" disabled={this.props.isAddingInvoice}>
              Continue
              {this.props.isAddingInvoice &&
                <CircularProgress style={{color:'white', marginLeft:8}}/>
              }
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={message && message.trim().length > 0 }
          message={message}
          key={message}
          ContentProps={{classes:{message:classes.snackbarMessage, root:classes.snackbarRoot}}}
          autoHideDuration={200}
        />
      </div>
    );
  }
}

Buy.propTypes = {
  classes: PropTypes.object.isRequired,
};

const BuyStyled = withStyles(styles)(Buy);

// const mapStateToProps = (state, ownProps) => ({
//   ...state
// });

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    const getStaff = makeGetStaff();
    return {
      isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
      // outDoorDancePayment: state && state.state && state.state.getIn(['payments', 'paymentsByUserId']),
      vendProducts: getVendProducts(state, props),
      staff: getStaff(state, props),

    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(BuyStyled)
