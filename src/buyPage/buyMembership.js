import {
    CircularProgress
  } from 'material-ui/Progress'
  import {
    Dialog,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemText
  } from 'material-ui';
  import {
    bindActionCreators
  } from 'redux';
  import {
    connect
  } from 'react-redux';
  import {
    withStyles
  } from '@material-ui/core';
  import Button from 'material-ui/Button';
  import Card, {
    CardContent,
    CardMedia
  } from 'material-ui/Card';
  import Grid from 'material-ui/Grid';
  import React from 'react';
  import Snackbar from 'material-ui/Snackbar';
  import TextField from 'material-ui/TextField';
  import {
    InputAdornment
  } from 'material-ui/Input';
  import Typography from 'material-ui/Typography';
  import {FormGroup, FormControlLabel} from 'material-ui/Form';
  import Checkbox from 'material-ui/Checkbox';
  import AddIcon from '@material-ui/icons/Add';
  import RemoveIcon from '@material-ui/icons/Remove';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import {FormControl} from 'material-ui/Form';
  import Select from 'material-ui/Select';
  import {MenuItem} from 'material-ui/Menu';
  import IntegrationAutosuggest from '../IntegrationAutosuggest';
  import {
    FormLabel
  } from 'material-ui/Form';
  import Chip from 'material-ui/Chip';
  import Avatar from 'material-ui/Avatar';
  
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff
  } from '../selectors';
  import * as Actions from '../actions';
  
  
  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      // maxWidth: theme.spacing(7)5,
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingTop: theme.spacing(8),
      marginTop: theme.spacing(5),
      // paddingBottom: theme.spacing(10),
      padding: 16
    },
    formContainer: {
      // marginLeft: theme.spacing(3),
      // marginRight: theme.spacing(3)
      // display: 'flex',
      // flexWrap: 'wrap'
    },
    card: {
      paddingBottom: theme.spacing(10)
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
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
      justifyContent: 'flexEnd'
    },
    buttonLarge: {
      fontSize: "1.5rem",
      textTransform: "capitalize",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
      width: 256,
      height: 256,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    snackbarMessage: {
      textAlign: 'center',
      flex: 1,
      fontSize: '1.3125rem',
      padding: theme.spacing(2)
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
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      justifyContent: 'flexEnd'
    },
  });
  
  // const vBuyDancePassTTDI = '9a20891f-ac31-6688-4189-1767ceb6d941';
  const vBuyDancePassTTDI = 'bf1be4bc-0701-c5d3-0533-6bf27a4ec42c';
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
  const vBuyFaizTest = '8aea002d-7eaa-1a6b-362d-933243a75823';
  const vComplimentary = '553071c8-43ad-df86-7b27-51bb655c5b49';
  const vBuyJan2020Single = '4933bd88-e457-243c-9751-f98768f74473';
  const vBuyJan2020AllAccess = 'b9c3f298-2a65-319f-cfee-58dd029a3cba';
  const vBuyValentineSingleClassMember = '072f066b-73a0-62d5-4f42-832b1364fad6';
  const vBuyValentineSingleClassNonMember = '000eb1e5-ff89-9396-da46-751752b101ed';
  const vBuyValentineDoubleClassMember = '2c5110d9-af4d-e37e-fbb5-08165c693baf';
  const vBuyValentineDoubleClassNonMember = '30198d7b-68ff-d2d6-ec0d-d7bb9f6e0735';
  
  const promoOptions = [
    {
      name:'single',
      vendId: vBuyFaizTest
    },
    {
      name: 'all',
      vendId: vComplimentary
    }
  ];
  
  class buyMembership extends React.Component {
  
    state = {
      email: '',
      name: '',
      phone: '',
      icnumber: '',
      className: '',
      classDate: '',
      dialogOpen: false,
      checked:false,
      checkedPromo:false,
      // promoOpt: promoOptions[0],
      promoOpt:null,
      promoName: promoOptions[0].name,
      refSource: null,
      mcId: null,
    }
  
    // componentDidMount() {
    //   this.props.actions.addInvoiceForProduct();
    // }
  
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
      // else if (name === 'checkedPromo'){
      //   value = event.target.checked;
      //   //console.log('thecheckedValue: ', value);
      // }
      updatedState[name] = value;
      this.setState({ ...updatedState
      });
    }
  
    handleContinue = () => {
      console.log('handleContinue')
      const vendProductId = this.props.match.params.vendProductId;
      if ((vendProductId === 'daypass' || vendProductId === '04de7e6c-409f-488c-e6d4-9df5cc745fff' || vendProductId === 'nightpass' || vendProductId === vBuyDancePass) && !this.state.dialogOpen) {
        this.setState({
          dialogOpen: true
        });
      } else {
        var vId = vendProductId;
        var isAvailable = true;
        var quantity = 1;
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
        else if (vendProductId === vBuyDancePass){
          isAvailable = moment().isBefore(moment('2019-11-30'));
        }
  
        if (!this.props.isAddingInvoice && vendProductId && isAvailable) {
          const urlSearchString = this.props.location.search;
          const urlEmail = urlSearchString && urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
          if(vendProductId === 'monthly' || vendProductId === vBuy6MthPrepaidMembership){
            const vendProductIds = {};
            vendProductIds[vId] = 1;
            const joiningFeeProductId = vendProductId === 'monthly' ? 'b910986f-cc5e-797b-22eb-16d329593138' : '377b80ec-43fa-7a44-57b6-4ffca6b94973';
            vendProductIds[joiningFeeProductId] = 1;
            this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
          }
          else if ((vendProductId === vBuyJan2020AllAccess)|| (vendProductId === vBuyJan2020Single)){
            const vendProductIds = {};
            vendProductIds[vId] = 1;
            // this.props.actions.addInvoiceForProducts(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
            this.props.actions.addInvoiceForMembership(this.state.name, this.state.email, this.state.phone, this.state.icnumber, this.state.refSource, this.state.postcode, this.state.mcId, vendProductIds);
          }
          else{
            this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vId, this.state.className, this.state.classDate, quantity);
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
  
    render() {
      const {
        classes
      } = this.props;
  
      const staff = this.props.staff || null;
      const vendProductId = this.props.match.params.vendProductId;
      const urlSearchString = this.props.location.search;
      const urlEmail = urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
      const isPromo = this.props.match.path.indexOf('promo') !== -1;
      const isJoin = this.props.match.path.indexOf('join') !== -1;
  
      var vId = vendProductId;
      var showDetails = false;
      var isAvailable = true;
      var showQuantity = false;
      var isMembershipProduct = false;
      var jan2020Promo = false;
      
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
      
      const vendProducts = this.props.vendProducts;
      const vendProduct = (vendProducts && vId) ? vendProducts.get(vId) : null
      const vendProductName = vendProduct && vendProduct.get('name');
      const vendSupplyPrice = vendProduct && vendProduct.get('supply_price');
      const vendPriceBookPrice = vendProduct && vendProduct.get('price_book_entries') && vendProduct.get('price_book_entries').first() && vendProduct.get('price_book_entries').first().get('price');
      const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
      const vendPrice = vendPriceAmount ? `${parseInt(vendPriceAmount)}` : null;
  
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
  
      const name = this.state.name;
      const phone = this.state.phone;
      const className = this.state.className;
      const classDate = this.state.classDate ? moment(this.state.classDate).format('YYYY-MM-DD') : null;
      const quantity = this.state.quantity || 1;
      const icnumber = this.state.icnumber;
      const isValidIc =this.state.icnumber.length>=10;
      const isValidPostCode = this.state.postcode && this.state.postcode.length>=4;
      const isValidRefSource = this.state.refSource && this.state.refSource.length>=3;
      const isValidMcId = this.state.mcId;
  
      const disableContinue = jan2020Promo? (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone || !isValidPostCode || !isValidRefSource || !isValidMcId ):
      (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone);
  
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
  
      const promoOptionInputLabel = <FormControl className={classes.formControl}>
                                      <Typography component="h6" color="primary" style={{marginTop:0}}>
                                        Membership Type
                                      </Typography>
                                      <Select
                                        open={this.state.open}
                                        onClose={this.handleClose}
                                        onOpen={this.handleOpen}
                                        value={this.state.promoName}
                                        onChange={this.handleChange('promoName')}
                                        inputProps={{
                                          name: 'promoOption',
                                          id: 'promotion-select',
                                        }}
                                      >
                                        <MenuItem value={'single'}>Single</MenuItem>
                                        <MenuItem value={'all'}>All Access</MenuItem>
                                      </Select>
                                    </FormControl>
  
      const continueBtn = <Button 
                            raised color='primary' key={'continue'} 
                            classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} 
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
                          <Grid container spacing={24}>
                            <Grid item xs={12} sm={12} lg={12}>
                              <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <Button raised color='primary' key={'6month'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem('monthly', true, urlEmail)}>Monthly Membership</Button>
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
  
      const postCodeLabel = 'Where are you from? (Just the postcode would do)';      
      const howDidUknowLabel = 'How did you know about us?';
  
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
      const mcLayoutFalse = <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>;
      const mcLayoutTrue = <div style={{marginTop:16}}>
                              <FormLabel component="legend">Customer Relations Officer's Name</FormLabel>
                              <Chip
                              avatar={mcAvatar}
                              label={mcName}
                              style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                              onDelete={()=>this.handleAutosuggest('mcId', null)}
                              />
                            </div>
  
      return (
        <div className={classes.container}>
          <Card className={classes.content} elevation={0}>
          {(!this.state.continueRegistration && (!isPromo || (isPromo && vendProductId))) &&
            <CardMedia
            className={classes.media}
            image={require('../assets/babel-icon-blue.png')}
            title="Babel - Inspire. Change"
            />
          }
          <CardContent >
            {(!vendProductId && !isPromo && !isJoin) &&
              <div>
                <Grid container spacing={24}>
                  {false && <Grid item xs={12} sm={6} lg={4}>
                    <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                      {membershipText}
                    </Typography>
                    <Button raised color='primary' key={'jan2020Promo'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyJan2020AllAccess)}>Buy January 2020 Promo</Button>
                  </Grid>}
                 
                  <Grid item xs={12} sm={6} lg={4}>
                    <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                      Academy
                    </Typography>
                    <Button raised color='primary' key={'animalflow'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyAnimalFlow)}> Buy Animal Flow</Button>
                    {false && <Button raised color='primary' key={'pilatesfoundation'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyPilatesFoundation)}> Buy Pilates Foundation</Button>}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                      Babel Dance
                    </Typography>
                    <Button raised color='primary' key={'tier1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyDancePassTTDI)}> Buy Dance Pass (TTDI)</Button>
                    <Button raised color='primary' key={'tier2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyFaizTest)}> Buy Dance Pass (KLCC)</Button>
                  </Grid>
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
                  <Grid container spacing={24}>
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
                  <Grid container spacing={24}>
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
                      {false && (jan2020Promo) && promoOptionInputLabel}
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
            {(vendProductId && (vendProductId !== 'monthly' && vendProductId !== vBuy6MthPrepaidMembership)) &&
              <div className={classes.contentInner}>
                {vendProductName &&
                  <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                    {isMembershipProduct ? 'Join' : 'Buy'} {vendProductName}
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
                      {false && jan2020Promo && promoOptionInputLabel}
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
            <BabelLogo />
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
  
  buyMembership.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const buyMembershipStyled = withStyles(styles)(buyMembership);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getStaff = makeGetStaff();
      return {
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyMembershipStyled)
  