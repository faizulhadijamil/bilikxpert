import moment from 'moment-timezone';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withStyles
} from '@material-ui/core';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List, {ListItem, ListItemText} from 'material-ui/List';
import {CircularProgress} from 'material-ui/Progress'
import React from 'react';
import Typography from 'material-ui/Typography';
import PaymentItem from '../PaymentItem';

import PropTypes from 'prop-types';

import {
    makeGetSelectedUserPayments, 
    makeGetCurrentUser,
    makeGetAllUsers} from '../selectors';
import * as Actions from '../actions';

const styles = theme => ({
  title: {
  },
  margin: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

class UserPayment extends React.Component {

  state = {
    open: this.props.isOpen? this.props.isOpen:false,
  }

  componentDidMount(){
    // console.log('userIdProps: ', this.props);
    if (this.props.userId){
        // console.log('userIdProps: ', this.props.userId);
        this.props.actions.getPaymentsByUserId(this.props.userId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.actions.getPaymentsByUserId(this.props.userId);
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleOpen = () => {
    this.setState({
      open: !this.state.open,
    });

  };

  subHeadingText(theText, theStyle = {padding:6}){
    return(
      <Typography type="subheading" component="p" gutterBottom color="primary" style={theStyle}>
        {theText}
      </Typography>
    )
  }
  
  createPrimaryText = (date1, date2, index) => {
    // return (date1 && date2)? `${index} : ${date1} - ${date2}`: 'Date not found';
    return (date1 && date2)? `${date1} - ${date2}`: 'Date not found';
  }

  render() {
    const {userId, currentUser, users} = this.props;

    // console.log('currentUser: ', currentUser);
    var primaryText =`Not Started`;
    var secondaryText = `Unpaid`;
    var action = () => {
        // console.log('nothing');
    }

    var addMonths = 0;
    var freezePayment = [];
    var paymentArray = [];
    var combinedItems =  [];
    var membershipHistoryList = [];
    var combinedData = [];

    const currentUserId = currentUser && currentUser.get('id');
    const roles = currentUser && currentUser.get('roles');
    const membershipStart = currentUser.get('autoMembershipStarts')?currentUser.get('autoMembershipStarts'):currentUser.get('membershipStarts')?currentUser.get('membershipStarts'):null;
    const membershipEnd = currentUser.get('autoMembershipEnds')?currentUser.get('autoMembershipEnds'):currentUser.get('membershipEnds')?currentUser.get('membershipEnds'):null;

    // console.log('membershipEnd: ', moment(Actions.getTheDate(membershipEnd)).format('DD MM YYYY'));
    const startMoment = moment(Actions.getTheDate(membershipStart));

    var paymentItems = [];
    const selectedUserPayments = this.props.selectedUserPayments ? this.props.selectedUserPayments.sort((a,b)=>{
        const nameA = a.get('createdAt');
        const nameB = b.get('createdAt');
        if (nameA < nameB) {return -1}
        if (nameA > nameB) {return 1}
        return 0;
    }):null;

    if (membershipStart && selectedUserPayments && selectedUserPayments.size>0){
        selectedUserPayments.toKeyedSeq().forEach((payment, index) => {
            const paymentCreatedDate = Actions.getTheDate(payment.get('createdAt'));
            const source = payment.get('source')||null;
            var paymentStatus = payment.get('status')? payment.get('status'):null;
            var referredUserId = payment.get('referredUserId')? payment.get('referredUserId'):null;
            const referredUser = referredUserId? (users.get(referredUserId)? users.get(referredUserId):null) : null;
            const referredUserName = (referredUser && referredUser.get('name')) || null;
            const price = payment.get('totalPrice')? (typeof(payment.get('totalPrice')) === Object)? '0':payment.get('totalPrice'):'0';
            const renewalTerm = payment.get('renewalTerm')? payment.get('renewalTerm'):null;

            var qty = payment.get('quantity')? payment.get('quantity'):1;
            const type = payment.get('type')||null;
            // console.log('thePrice: ', price);
            // console.log('typeOf: ', typeof(price));
           
            if (source === 'freeze' || source === 'freezeTerminate'){
                const freezeFor = Actions.getTheDate(payment.get('freezeFor'));
                paymentArray.push({date:moment(freezeFor), source, price});
                // console.log('paymentArray: ', paymentArray);
            }
            else if ((source==='join') || (source==='luckyDraw') || (source==='promo')|| (source==='free')
            || (source==='complimentary') || (source==='jfr') || (source==='refer')){
                paymentArray.push({date:moment(paymentCreatedDate), source, referredUser: referredUserName, type:'free'});
            }
            else if (((source === 'vend') || ((source === 'adyen') && ((price!=="0") || (price!==0))) || (source==='pbonline'))
                && (paymentStatus !== 'VOIDED')){
                // check if the payment is yearly or monthly via the renewalTerm.
                if (renewalTerm && (renewalTerm === 'year' || renewalTerm === 'yearly')){
                    for (var i=0; i<(qty*12); i++){
                        paymentArray.push({
                            date:moment(paymentCreatedDate).add(i, 'months'), 
                            paymentDate:paymentCreatedDate,
                            visitLeft: (qty*12) - i,
                            visitMax: qty*12,
                            source
                        });
                    }
                }
                else if (renewalTerm && (renewalTerm === 'month' || renewalTerm === 'monthly')){
                    for (var j=0; j<qty; j++){
                        paymentArray.push({
                            date:moment(paymentCreatedDate),
                            paymentDate:paymentCreatedDate,
                            visitLeft: 1,
                            visitMax: 1,
                            source
                        });
                    }
                }
                else if (renewalTerm && (renewalTerm === 'biyearly' || renewalTerm === 'biyear')){
                    for (var k=0; k<qty*6; k++){
                        paymentArray.push({
                            date:moment(paymentCreatedDate).add(k, 'months'), 
                            paymentDate:paymentCreatedDate,
                            visitLeft: qty*6 - k,
                            visitMax: qty*6,
                            source
                        });
                    }
                }
                else if (renewalTerm && renewalTerm === 'quarterly'){
                    for (var l=0; l<qty*3; l++){
                        paymentArray.push({
                            date:moment(paymentCreatedDate).add(l, 'months'), 
                            paymentDate:paymentCreatedDate,
                            visitLeft: qty*3 - l,
                            visitMax: qty*3,
                            source
                        });
                    }
                }
            }
        });

        // resort the array dates
        // paymentArray.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
        paymentArray.reverse();
        // console.log('paymentArray: ', paymentArray);

        const initialMonthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
        var monthsDiff = initialMonthsDiff;
        var totalArrayLength = paymentArray.length;
        if (totalArrayLength>initialMonthsDiff){
          monthsDiff = totalArrayLength-1;
        }
        // console.log('monthsDiff: ', monthsDiff);

          // default, if there is no payment detected
      for (var i=0; i<=monthsDiff; i++){
        const iterationStartMoment = startMoment.clone().add(addMonths, 'months');
        // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
        primaryText = this.createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
        combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
        membershipHistoryList.push({
          date:iterationStartMoment, 
          type:'unpaid'
        });
      }

    }
    else{
        var monthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
        // console.log('monthDiff: ', monthsDiff);
        for (var i=0; i<=monthsDiff; i++){
          const iterationStartMoment = startMoment.clone().add(addMonths, 'months');
          // console.log('iterationStartMoment: ', iterationStartMoment);
          // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
          // primaryText = createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
            combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
        //   membershipHistoryList.push({
        //     date:iterationStartMoment, 
        //     type:'unpaid'
        //   });
        }
    }

    // console.log('combinedItems: ', combinedItems);
   
    combinedItems && combinedItems.forEach((item, index)=>{
        // console.log('item: ', item);
        if (paymentArray.length>0 && (paymentArray[paymentArray.length-1].source === 'freeze') 
        && moment(item.effectiveDate).isSameOrAfter(paymentArray[paymentArray.length-1].date)){
            combinedData.push({
                date:paymentArray[paymentArray.length-1].date,
                source:'freeze',
                price:paymentArray[paymentArray.length-1].price
            });
            paymentArray.pop();
        }
        else if (paymentArray.length>0 && (paymentArray[paymentArray.length-1].type === 'free') 
        && moment(item.effectiveDate).isSameOrAfter(paymentArray[paymentArray.length-1].date)){
            combinedData.push({
                date:paymentArray[paymentArray.length-1].date,
                source:paymentArray[paymentArray.length-1].source,
                type:paymentArray[paymentArray.length-1].type,
                referredUser: paymentArray[paymentArray.length-1].referredUser
            });
            paymentArray.pop();
        }
        else if (paymentArray.length>0 && (paymentArray[paymentArray.length-1].source === 'vend') 
        && moment(item.effectiveDate).isSameOrAfter(paymentArray[paymentArray.length-1].date)){
            combinedData.push({
                date:paymentArray[paymentArray.length-1].date,
                source:paymentArray[paymentArray.length-1].source,
                visitLeft:paymentArray[paymentArray.length-1].visitLeft,
                visitMax:paymentArray[paymentArray.length-1].visitMax,
                // bgroundColor: combinedData.length>(initialMonthsDiff)? "#20BF55":null
            });
            paymentArray.pop();
        }

        // paymentItems.push(<PaymentItem key={item.primaryText} primaryText={item.primaryText} secondaryText={item.secondaryText} id={item.id} bgColor={item.bgroundColor}/>)
    }); 

    // console.log('combinedItems2: ', combinedItems);
    // console.log('paymentItems: ', paymentItems);
    // console.log('combinedData: ', combinedData);
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

    // console.log('selectedUserGanterLogs: ', selectedUserGanterLogs);

    // if (selectedUserGanterLogs && selectedUserGanterLogs.size > 0) {
    //     // const selectedUserLastVisitDate = selectedUserGanterLogs && selectedUserGanterLogs.last().get('createdAt') ? Actions.getTheDate(selectedUserGanterLogs.last().get('createdAt')) : null;
    //     // if (selectedUserLastVisitDate) {
    //     //   selectedUserLastVisit = moment(selectedUserLastVisitDate).format('Do MMM YYYY')
    //     // }

    //     var previousCheckinMoment = null;
    //     selectedUserGanterLogs.toKeyedSeq().forEach((v, k) => {
    //       const createdAt = v.get('createdAt') ? Actions.getTheDate(v.get('createdAt')) : null;
    //       const createdAtMoment = createdAt && moment(createdAt);
    //       if (createdAtMoment) {
    //         if (previousCheckinMoment && previousCheckinMoment.isSame(createdAtMoment, 'day')) {
    //           //check out
    //           userVisitItems.pop();
    //           userVisitItems.push(
    //             <ListItem divider button key={k} >
    //               <ListItemText primary={createdAtMoment.format('D MMM YYYY')} secondary={`${previousCheckinMoment.format('h:mm A')} - ${createdAtMoment.format('h:mm A')}`} />
    //             </ListItem>
    //           );
    //           previousCheckinMoment = null;

    //         } else {
    //           //check in
    //           previousCheckinMoment = createdAtMoment;
    //           userVisitItems.push(
    //             <ListItem divider button key={k} >
    //               <ListItemText primary={createdAtMoment.format('D MMM YYYY')} secondary={createdAtMoment.format('h:mm A')} />
    //             </ListItem>
    //           );
    //         }
    //       }
    //     });
    //     if (userVisitItems.length > 1) {
    //       userVisitItems.reverse();
    //     }
    //   }


      return(
        <List component="div">
          <div 
            style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
            // onClick={this.handleOpen}
          >
              {selectedUserPayments && paymentItems && paymentItems.length>0 && 
                <List>
                    <ListItem button onClick={this.handleOpen}>
                        <ListItemText primary={`Payments (${paymentItems.length})`} />
                        {this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {paymentItems}
                        </List>
                    </Collapse>
                </List>}
            {!selectedUserPayments && this.state.open && <CircularProgress style={{margin:'auto', display:'block', marginTop:16, marginBottom:16, height:120, width:120}}/>}
        </div>
      </List>
      )
    //}
  }
}

UserPayment.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserPayment.defaultProps = {
  open: false,
}

const UserPaymentStyled = withStyles(styles)(UserPayment);

const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const getAllUsers = makeGetAllUsers();
    const getUserPayments = makeGetSelectedUserPayments();
  const mapStateToProps = (state, props) => {
    return {
        currentUser: getCurrentUser(state, props),
        users: getAllUsers(state, props),
        selectedUserPayments: getUserPayments(state, props),
    }
  }
  return mapStateToProps
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(makeMapStateToProps, mapDispatchToProps)(UserPaymentStyled)
