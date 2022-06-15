  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, Collapse, List, ListItem, ListItemText} from '@material-ui/core';
  import ExpandLessIcon from '@material-ui/icons/ExpandLess';
  import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
  import React from 'react';
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetSelectedUser,
    makeGetSelectedUserFreezeItems
  } from '../selectors'

  import * as Actions from '../actions';
  import FreezeItem from '../components/FreezeItem';
  // import PaymentItem from './PaymentItem';
  // import {getPaymentsByUserIdv2} from './actions'; 
  
  const styles = theme => ({});
  
  class FreezePayments extends React.Component {
  
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
        userId,
        executorId, executorEmail
      } = this.props;
  
      // const open = this.state && this.state.open || false;
      // const userPayments = this.state && this.state.userPayments || [];
      // for the manual firebase call without redux
      let userPaymentData = null;
      const isOpen = this.state && this.state.open ? true : this.props.open;
      // console.log(user && user.toJS(), userPayments && userPayments.toJS(), userPaymentItems);
      // var paymentItems = [];
      var freezeItems = [];
      
        userFreezeItems && userFreezeItems.forEach(userPaymentItem => {
            // console.log('userFreezeItems: ', userPaymentItem);
            //paymentItems.push(<PaymentItem key={userPaymentItem.primaryText} primaryText={userPaymentItem.primaryText} secondaryText={userPaymentItem.secondaryText} id={userPaymentItem.id} secondaryAction={userPaymentItem.secondaryAction}/>)
            freezeItems.push(<FreezeItem 
                key={userPaymentItem.primaryText} 
                primaryText={userPaymentItem.primaryText} 
                secondaryText={userPaymentItem.secondaryText} 
                id={userPaymentItem.id} 
                secondaryAction={userPaymentItem.secondaryAction}
                executorId={executorId}
                executorEmail={executorEmail}
                freezeStartMoment = {userPaymentItem.freezeStartMoment}
                userId = {userId}
                removeDisable = {(userPaymentItem.freezeSource === 'adyen' 
                  || userPaymentItem.freezeSource === 'vend' 
                  // || userPaymentItem.freezeType
                  )? true:false}
                />);
        });
    
      return (
        <div>
        {(freezeItems.length>0) && <List>
          <ListItem button onClick={this.handleOpen}>
            <ListItemText primary={"Existing Freezes"} />
            {isOpen? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {freezeItems}
            </List>
          </Collapse>
        </List>}
        </div>
      );
    }
  }
  
  FreezePayments.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  FreezePayments.defaultProps = {
    open: false
  }
  
  const FreezePaymentsStyled = withStyles(styles)(FreezePayments);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    // const getUserPaymentItems = makeGetSelectedUserPaymentItems();
    const getUserFreezeItems = makeGetSelectedUserFreezeItems();
    const getSelectedUser = makeGetSelectedUser();
    const mapStateToProps = (state, props) => {
      return {
        // userPaymentItems: getUserPaymentItems(state, props),
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(FreezePaymentsStyled)