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
  const vBuy3MonthAllAccess = 'c8356e28-49e6-8173-912a-1e3698dbc0d9';
  const vBuy3MonthSingleAccess = '4208ae87-5052-c06c-fd6a-8acdf892187b';

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
  
  class renewMembership extends React.Component {
  
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
    
      return (
        <div className={classes.container}>
          <Card className={classes.content} elevation={0}>
          <CardContent >
              <div>
                  <Grid item xs={12}>
                    <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:16, marginBottom:16}}>
                      Renew Membership
                    </Typography>
                    <Button raised color='primary' key={'tier1'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy3MonthAllAccess)}>{'Buy 3 months All Club (KLCC and TTDI)'}</Button>
                    <Button raised color='primary' key={'tier2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuy3MonthSingleAccess)}>{'Buy 3 months Single Club (TTDI Only)'}</Button>
                  </Grid>
              </div>
            <BabelLogo />
          </CardContent>
          </Card>
        </div>
      );
    }
  }
  
  renewMembership.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const renewMembershipStyled = withStyles(styles)(renewMembership);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(renewMembershipStyled)
  