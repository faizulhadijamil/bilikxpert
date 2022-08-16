import {
  CircularProgress
} from 'material-ui/Progress'
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {withStyles} from '@material-ui/core';
import Card, {
  CardContent
} from 'material-ui/Card';
import {Collapse, Divider, ExpandLessIcon, ExpandMoreIcon, Grid, List, ListItem, ListItemText, 
  TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, BottomNavigation, BottomNavigationAction} from '@material-ui/core';

import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Button from 'material-ui/Button';
import {FormLabel, FormControl, FormControlLabel} from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import BabelLogo from './BabelLogo';
import {getTheDate} from './actions'; 

var CryptoJS = require("crypto-js");

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
  },
  formContainer: {
  },
  card: {
    paddingBottom: theme.spacing(10)
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
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
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd'
  },
  bookButton: {
    margin: theme.spacing(1),
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

class Payments extends React.Component {

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
    amount: '000000025000',
    postURL: 'https://us-central1-babel-2c378.cloudfunctions.net/addTransaction',
    paymentHistoryOpen: false,
    infoDialogOpen:false,
    freeGift:'',
    luckyDraw:''
  }

  // componentDidMount() {
  //   const invoiceId = this.props.match.params.invoiceId;
  //   if (invoiceId) {
  //     this.props.actions.bootstrap(this.props.actions.getInvoiceAndDataById(invoiceId));
  //   }
  // }

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

  render() {
    const {
      classes,
      state
    } = this.props;

    const invoiceId = this.props.match.params.invoiceId;
    const invoiceData = this.props.state.hasIn(['invoices', 'invoicesById']) ? this.props.state.getIn(['invoices', 'invoicesById', invoiceId]) : null;
    const userId = invoiceData && invoiceData.get('userId');
    const userData = userId && this.props.state.hasIn(['users', 'usersById']) ? this.props.state.getIn(['users', 'usersById', userId]) : null;
    const packageId = invoiceData && invoiceData.get('packageId');
    const packageData = packageId && this.props.state.hasIn(['packages', 'packagesById', packageId]) ? this.props.state.getIn(['packages', 'packagesById', packageId]) : null;
    // console.log(invoiceId, userId, packageId);
    // console.log(invoiceData, userData, packageData);
    const invoiceNotFound = state.has('invoiceNotFound') && state.get('invoiceNotFound') ? true : false;
    // console.log(invoiceNotFound);

    if (invoiceNotFound) {
      return (
        <div className={classes.container}>
          <MenuAppBar />
          <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center', padding:16}}>
            {"Page Not Found"}
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
    const invoiceDate = invoiceData.get('createdAt') ? moment(getTheDate(invoiceData.get('createdAt'))).format('MMMM Do YYYY') : null;
    var invoicePaid = invoiceData.get('paid') ? invoiceData.get('paid') : false;
    const invoiceAmount = invoiceData.get('amount') ? invoiceData.get('amount') : '000000025000';
    const hasSST = invoiceData.get('hasSST');
    const invoiceCurrentPrice = invoiceData.get('unitPrice') ? parseInt(invoiceData.get('unitPrice')) : 250;
    const invoiceQuantity = invoiceData.get('quantity') ? invoiceData.get('quantity') : 1;
    const paymentFailedString = invoiceData.get('paymentFailed') === true && !invoicePaid ? 'Previous payment failed. Please try again.' : null;
    const paymentId = invoiceData.get('paymentId') ? invoiceData.get('paymentId') : null;

    var showLoadingForPayments = false;
    var userPaymentItems = [];
    var packageDisplayString = '';
    if (packageId) {
      const packageName = (packageData && packageData.get('name')) || 'Monthly';
      var packageStrings = packageName.split(' ');
      packageDisplayString = packageStrings.length > 0 ? `${packageStrings[0]} Package` : `${packageName} Package`;
      var membershipPeriodMoments = [];
      var membershipPeriods = [];
      const packageRenewalTerm = packageData && packageData.has('renewalTerm') ? packageData.get('renewalTerm') : null;
      if (packageRenewalTerm === 'month') {
        const membershipStartsDate = userData && userData.has('autoMembershipStarts') ? getTheDate(userData.get('autoMembershipStarts')) : (userData && userData.has('membershipStarts') ? getTheDate(userData.get('membershipStarts')) : null);
        const invoiceCreatedDate = invoiceData && invoiceData.has('createdAt') ? getTheDate(invoiceData.get('createdAt')) : null;

        const membershipStartsMoment = membershipStartsDate && moment(membershipStartsDate);
        const invoiceCreatedMoment = invoiceCreatedDate && moment(invoiceCreatedDate);

        const monthsDiff = invoiceCreatedMoment.diff(membershipStartsMoment, 'months') + 1;
        // console.log(monthsDiff, membershipStartsDate, invoiceCreatedDate);

        for (var i = 0; i < monthsDiff; i++) {
          const iterationStartMoment = membershipStartsMoment.clone().add(i, 'months');
          const iterationEndMoment = membershipStartsMoment.clone().add(i + 1, 'months');
          membershipPeriodMoments.push([iterationStartMoment, iterationEndMoment]);
          membershipPeriods.push(`${iterationStartMoment.format('D MMM')} - ${iterationEndMoment.format('D MMM YYYY')}`);
        }
      }

      // console.log(membershipPeriods);

      const userPayments = userId && this.props.state && this.props.state.hasIn(['payments', 'paymentsByUserId', userId]) ? this.props.state.getIn(['payments', 'paymentsByUserId', userId])
        .filter(x => x.get('status') !== 'FAILED').sort((a, b) => {
          const nameA = a.get('createdAt');
          const nameB = b.get('createdAt');
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          const sourceA = a.get('source');
          const sourceB = b.get('source')
          if (sourceA === 'join') {
            return -1;
          }
          if (sourceB === 'join') {
            return 1;
          }
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

          const unusedFreezeFor = getTheDate(freezeData.get('freezeFor'));
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
            const createdAtText = `${moment(getTheDate(v.get('createdAt'))).format('Do MMM YYYY')}`;
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

            const unusedFreezeFor = getTheDate(freezeData.get('freezeFor'));
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
      packageDisplayString = 'Monthly Membership';
      // packageDisplayString = invoiceData && invoiceData.get('vendProductName');
    } else {
      packageDisplayString = invoiceData && invoiceData.get('vendProductName');
    }

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
    // console.log(userName, packageName, packageDisplayString, paymentFailedString);



    // const {cardNumber, expiryDate, cvv, invoiceNo, amount, postURL, secCode} = this.state;
    const {
      cardNumber,
      expiryDate,
      cvv,
      postURL,
      secCode
    } = this.state;
    const invoiceNo = invoiceId;
    const amount = invoiceAmount;
    const merID = this.state.card.issuer === 'visa' ? '3301664172' : '5501652978';
    const secString = `${invoiceNo}${amount}${this.state.secCode}${this.state.merchantIds[this.state.card.issuer]}${this.state.cardNumber}${this.state.expiryDate}${this.state.cvv}`;
    const secKeyReq = CryptoJS.SHA256(secString).toString(CryptoJS.enc.Base64);
    const amountString = amount ? `${`RM${parseInt(amount)}`.slice(0, -2)}.00` : '';
    const subtotalAmount = Math.round((parseFloat(amount)/1.06));
    const taxAmount = parseFloat(amount)-subtotalAmount;
    const baseSubtotalString = hasSST ? `RM${subtotalAmount}` : amountString;
    const subtotalString = hasSST ? baseSubtotalString.substring(0, baseSubtotalString.length-2) + '.' + baseSubtotalString.substring(baseSubtotalString.length-2, ) : baseSubtotalString;
    const baseTaxString = hasSST ? `RM${taxAmount}` : 'RM0.00';
    const taxString = hasSST ? 'SST 6% : '+baseTaxString.substring(0, baseTaxString.length-2) + '.' + baseTaxString.substring(baseTaxString.length-2, ) : 'GST 0% : '+baseTaxString;
    // console.log(taxAmount, taxString, subtotalAmount, subtotalString);

    return (
      <div className={classes.container}>
        <MenuAppBar />
        <Card className={classes.card}>
        <CardContent className={classes.content}>
        <Typography type="display1" component="h1" gutterBottom color="primary" style={{textAlign:'center', marginBottom:32}}>
          {'Tax Invoice'}
        </Typography>
        <Typography type="title" component="h1" gutterBottom color="primary">
          {userName}
        </Typography>
        <Typography type="subheading" component="p" gutterBottom color="primary">
          Date : {invoiceDate}
        </Typography>
        <Typography type="subheading" component="p" gutterBottom color="primary">
          Invoice : {invoiceNo}
        </Typography>
        {(invoicePaid === false && userPaymentItems.length > 0) &&
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
          {packageDisplayString === 'Monthly Membership' &&
            <Typography type="title" component="h1" gutterBottom color="primary">
              {invoiceQuantity} x {packageDisplayString} - {`RM${invoiceCurrentPrice}.00`} {hasSST && ` (inclusive of SST)`}
              <span style={{float:'right'}}>S</span>
            </Typography>
          }
          <Typography type="title" component="h1" gutterBottom color="primary">
            {invoiceQuantity} x {packageDisplayString} - {`RM${invoiceCurrentPrice}.00`} {hasSST && ` (inclusive of SST)`}
            <span style={{float:'right'}}>S</span>
          </Typography>
          <Divider style={{marginTop:16, marginBottom:16}}/>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Subtotal : ${subtotalString}`}
          </Typography>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {taxString}
          </Typography>
          <Typography type="title" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Total : ${amountString}`}
          </Typography>
          </div>
        }
        {!invoicePaid &&
          <div>
          {packageDisplayString === 'Monthly Membership' &&
            <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'left'}}>
              {invoiceQuantity} x {'Joining Fee'} - {`RM${invoiceCurrentPrice}.00`} {hasSST && ` (inclusive of SST)`}
            </Typography>
          }
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'left'}}>
            {invoiceQuantity} x {packageDisplayString} - {`RM${invoiceCurrentPrice}.00`} {hasSST && ` (inclusive of SST)`}
          </Typography>
          <Divider style={{marginTop:16, marginBottom:16}}/>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Subtotal : ${subtotalString}`}
          </Typography>
          <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {taxString}
          </Typography>
          <Typography type="title" component="p" gutterBottom color="primary" style={{textAlign:'right'}}>
            {`Total : ${amountString}`}
          </Typography>
          </div>
        }
        {paymentFailedString &&
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{color:'red'}}>
            {paymentFailedString}
          </Typography>
        }
        {invoicePaid &&
          <div style={{textAlign:'right'}}>
          <Typography type="title" component="p" gutterBottom color="primary" style={{color:'green'}}>
            {'Paid'}
          </Typography>
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{color:'green'}}>
            {'Thank you for your payment!'}
          </Typography>
          </div>
        }
        {!invoicePaid &&
          <Grid container spacing={24} style={{marginTop:16}}>
          <Grid item xs={12} sm={6}>
          <Cards
            number={this.state.cardNumber}
            expiry={this.state.expiryDate}
            cvc={this.state.cvv}
            name={''}
            focused={this.state.focused}
            placeholders={{name:''}}
            acceptedCards={['visa', 'mastercard']}
            callback={(type, isValid)=>{
              this.setState({card :{issuer:type.issuer, isValid:isValid}});
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <form className={classes.formContainer} noValidate autoComplete="off" action={'https://ecom.pbebank.com/PGW/Pay/Process'} method='post'>
            <TextField
              margin="dense"
              id="cardNumber"
              label="Card Number"
              type="number"
              // defaultValue={editUser && editUser.get('phone')}
              fullWidth
              onChange={this.handleChange('cardNumber')}
              hidden={true}
              required
            />
            <TextField
              margin="dense"
              id="expiryDateField"
              label="Valid Thru/Expiry Date (MMYY)"
              type="number"
              // defaultValue={editUser && editUser.get('phone')}
              fullWidth
              onChange={this.handleChange('expiryDate')}
              required
            />
            <TextField
              margin="dense"
              id="cvv"
              label="CVV"
              type="number"
              // defaultValue={editUser && editUser.get('phone')}
              fullWidth
              onChange={this.handleChange('cvv')}
              required
            />
            <input id='merID' value={merID} name='merID' hidden={true} readOnly/>
            <input id='PAN' value={cardNumber} name='PAN' hidden={true} readOnly/>
            <input id='expiryDate' value={expiryDate} name='expiryDate' hidden={true} readOnly/>
            <input id='cvv2' value={cvv} name='cvv2' hidden={true} readOnly/>
            <input id='secretCode' value={secCode} name='secretCode' hidden={true} readOnly/>
            <input id='invoiceNo' value={invoiceNo} name='invoiceNo' hidden={true} readOnly/>
            <input id='amount' value={amount} name='amount' hidden={true} readOnly/>
            <input id='securityMethod' value='' name='securityMethod' hidden={true}  readOnly/>
            <input id='secretString' value={secString} name='secretString' hidden={true}  readOnly/>
            <input id='securityKeyReq' value={secKeyReq} name='securityKeyReq' hidden={true}  readOnly/>
            <input id="postURL" value={postURL} name="postURL" hidden={true} readOnly/>
            <div style={{justifyContent:'flex-end', display:'flex', flex:1}}><input className={isValid ? classes.button : classes.buttonDisabled} type="submit" value="Make Payment" disabled={!isValid}/></div>
          </form>
          </Grid>
          </Grid>
        }
        <Divider style={{marginTop:16, marginBottom:16}}/>
        {(invoicePaid && paymentId) &&
          <Typography id={'no-print'} type="button" component="h1" gutterBottom color="primary" style={{textAlign:'right'}} onClick={()=>{window.print()}}>
            {'Print'}
          </Typography>
        }
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
          {'B Fitness Asia Sdn. Bhd. (1204067-x)'}
        </Typography>
        {!hasSST &&
          <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'GST No. 000154726400'}
          </Typography>
        }
        {hasSST &&
          <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
            {'SST CP No: W10-1808-32001697'}
          </Typography>
        }
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
          {'Unit 3-6, Menara Ken TTDI,'}
        </Typography>
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
          {'No 37, Jalan Burhanuddin Helmi,'}
        </Typography>
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
          {'Taman Tun Dr Ismail,'}
        </Typography>
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
          {'60000 Kuala Lumpur.'}
        </Typography>
        <BabelLogo />
        <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}} onClick={()=>{
            this.props.actions.viewBetaPayments(invoiceId);
          }}>
          {'Beta'}
        </Typography>
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

Payments.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PaymentsStyled = withStyles(styles)(Payments);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsStyled)
