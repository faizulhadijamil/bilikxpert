import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Collapse, List, ListItem, ListItemText} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import PropTypes from 'prop-types';
import {
  makeGetSelectedUser,
  makeGetSelectedUserPaymentItems,
  makeGetSelectedUserFreezeItems
} from './selectors'
import * as Actions from './actions';
import PaymentItem from './PaymentItem';
// import {getPaymentsByUserIdv2} from './actions'; 

const styles = theme => ({});

class UserPayments extends React.Component {
  state = {
    open: this.props.isOpen? this.props.isOpen:false,
  }

  componentDidMount(){
    // console.log('userIdProps: ', this.props);
    if (this.props.userId){
        this.props.actions.getPaymentsByUserId(this.props.userId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.props.actions.getPaymentsByUserId(this.props.userId);
    }
  }

  handleOpen = () => {
    this.setState({
      open: !(this.state && this.state.open ? this.state.open : false)
    });
  };

  render() {
    const {
      userPaymentItems,
      userFreezeItems,
      showFreezesOnly,
      loadPayment,
      userId
    } = this.props;

    // const open = this.state && this.state.open || false;
    // const userPayments = this.state && this.state.userPayments || [];
    // for the manual firebase call without redux
    let userPaymentData = null;
    const isOpen = this.state && this.state.open ? true : this.props.open;
    // console.log(user && user.toJS(), userPayments && userPayments.toJS(), userPaymentItems);
    var paymentItems = [];
    if (showFreezesOnly) {
      userFreezeItems && userFreezeItems.forEach(userPaymentItem => {
        // console.log(userPaymentItem.id);
        paymentItems.push(<PaymentItem key={userPaymentItem.primaryText} primaryText={userPaymentItem.primaryText} secondaryText={userPaymentItem.secondaryText} id={userPaymentItem.id} secondaryAction={userPaymentItem.secondaryAction}/>)
      });
    } 
    else if (loadPayment && userId){

      // userPaymentData = getPaymentsByUserIdv2(userId);
      // console.log('userPaymentData: ', userPaymentData)

      userPaymentItems && userPaymentItems.forEach(userPaymentItem => {
        // console.log('userPaymentItem: ', userPaymentItem);
        paymentItems.push(<PaymentItem key={userPaymentItem.primaryText + ' (' + userPaymentItems.size + ')'} primaryText={userPaymentItem.primaryText} secondaryText={userPaymentItem.secondaryText} id={userPaymentItem.id} bgColor={userPaymentItem.bgroundColor}/>)
      });
    }
    else {
      userPaymentItems && userPaymentItems.forEach(userPaymentItem => {
        paymentItems.push(<PaymentItem key={userPaymentItem.primaryText} primaryText={userPaymentItem.primaryText} secondaryText={userPaymentItem.secondaryText} id={userPaymentItem.id} bgColor={userPaymentItem.bgroundColor}/>)
      });
    }
    // console.log('isOpen: ', isOpen);
    return (
      <div>
      {(paymentItems.length>0) && <List>
        <ListItem button onClick={this.handleOpen}>
          <ListItemText primary={this.props.primaryText? this.props.primaryText : showFreezesOnly ? "Existing Freezes" : `Payments/Freezes`} />
          {isOpen? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
          {paymentItems}
          </List>
        </Collapse>
      </List>}
      </div>
    );
  }
}

// {userVisitItems.length > 0 &&
//   <List>
//     <ListItem button onClick={this.handleOpen}>
//       <ListItemText primary={`Payments (${userVisitItems.length})`} />
//       {this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//     </ListItem>
//     <Collapse in={this.state.open} timeout="auto" unmountOnExit>
//       <List component="div" disablePadding>
//         {userVisitItems}
//       </List>
//     </Collapse>
//   </List>
// }

UserPayments.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserPayments.defaultProps = {
  open: false
}

const UserPaymentsStyled = withStyles(styles)(UserPayments);

// const mapStateToProps = (state, ownProps) => ({
//   ...state
// });

const makeMapStateToProps = () => {
  const getUserPaymentItems = makeGetSelectedUserPaymentItems();
  const getUserFreezeItems = makeGetSelectedUserFreezeItems();
  const getSelectedUser = makeGetSelectedUser();
  const mapStateToProps = (state, props) => {
    return {
      userPaymentItems: getUserPaymentItems(state, props),
      userFreezeItems: getUserFreezeItems(state, props),
      user: getSelectedUser(state, props)
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(UserPaymentsStyled)