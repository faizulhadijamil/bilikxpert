import 'react-credit-cards/es/styles-compiled.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Button, List, Typography} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import PropTypes from 'prop-types';
import {makeGetAllUsers} from '../selectors';
import * as Actions from '../actions';
import UserPayments from '../UserPayments';
import UserGantner from '../Cards/UserGantner';

const styles = theme => ({
  title: {
  },
  margin: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

class DropDown extends React.Component {

  state = {
    open: false,
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

  handleKeep = (userId) => {
    // console.log('handleKeep: ', userId);

  }

  // copy the payment data from currentUser to the other user
  transferPayment = (currentUserId, transferUserId) => {
    this.props.actions.transferPayment(currentUserId, transferUserId);
  }

  // copy the payment data from currentUser to the other user
  transferGantner = (currentUserId, transferUserId) => {
    this.props.actions.transferGantner(currentUserId, transferUserId);
  }

  removeData = (userId) =>{
    this.props.actions.removeUser(userId);
  }

  subHeadingText(theText, theStyle = {padding:6}){
    return(
      <Typography type="subheading" component="p" gutterBottom color="primary" style={theStyle}>
        {theText}
      </Typography>
    )
  }

  // subHeadingText(theText, theStyle = {padding:6}){
  //   return(
  //     <div style={{}}>
  //       <p style = {theStyle}>{theText}</p>
  //     </div>
  //   )
  // }
  

  render() {
    const {
      item
    } = this.props;
      return(
        <List component="div">
          <div 
            style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', backgroundColor : '#ccc', cursor: 'pointer'}}
            onClick={this.handleOpen}
          >
            {this.subHeadingText(item.count, {padding:6, width: '5%'})}
            {this.subHeadingText(item.name, {padding:6, width: '40%'})}
            {this.subHeadingText(item.email, {padding:6, width: '40%'})}
            {this.state.open? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
          {this.state.open? <div style={{flexDirection:'row', display:'flex', justifyContent:'space-between', backgroundColor : '#fff'}}>
            <div style = {{width:'50%', flexDirection:'column', display:'flex'}}>
              <Typography type="headline" component="p" gutterBottom color="primary" style={{padding:6}}>
                {'Option 1'}
              </Typography>
              
              {this.subHeadingText('user Info')}
              {this.subHeadingText('email: ' + item.email)}
              {this.subHeadingText('name: ' + item.name)}
              {this.subHeadingText('userId: ' + item.userId)}
              {this.subHeadingText('Vend Customer Id: ' + item.vendCustomerId)}
              <div 
                style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
                onClick={()=>{this.props.actions.getPaymentsByUserId(item.userId)}}
              >
                <UserPayments userId={item.userId} loadPayment={true}/>
              </div>
              <Button key={'transferPayment1'} raised onClick={() => this.transferPayment(item.userId, item.duplicateData.userId)}>
                {'TRANSFER PAYMENT =>'}
              </Button>
              <div 
                style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
                onClick={()=>{this.props.actions.getGantnerLogsByUserId(item.userId)}}
              >
                <UserGantner userId={item.userId}/>
              </div>
              <Button key={'transferGantner1'} raised onClick={() => this.transferGantner(item.userId, item.duplicateData.userId)}>
                {'TRANSFER GANTNER =>'}
              </Button>
              <Button key={'removeData1'} raised onClick={() => this.removeData(item.userId)}>
                {'DELETE DATA'}
              </Button>
            </div>
            <div style = {{width:'50%', flexDirection:'column', display:'flex'}}>
              <Typography type="headline" component="p" gutterBottom color="primary" style={{padding:6}}>
                {'Option 2'}
              </Typography>
              {this.subHeadingText('user Info')}
              {this.subHeadingText('email: ' + item.duplicateData.email)}
              {this.subHeadingText('name: ' + item.duplicateData.name)}
              {this.subHeadingText('userId: ' + item.duplicateData.userId)}
              {this.subHeadingText('Vend Customer Id: ' + item.duplicateData.vendCustomerId)}
              <div 
                style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
                onClick={()=>{this.props.actions.getPaymentsByUserId(item.duplicateData.userId)}}
              >
                <UserPayments userId={item.duplicateData.userId} />
              </div>
              <Button key={'transferPayment2'} raised onClick={() => this.transferPayment(item.duplicateData.userId, item.userId)}>
                {'<= TRANSFER PAYMENT'}
              </Button>
              <div 
                style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
                onClick={()=>{this.props.actions.getGantnerLogsByUserId(item.duplicateData.userId)}}
              >
                <UserGantner userId={item.duplicateData.userId}/>
              </div>
              <Button key={'transferGantner2'} raised onClick={() => this.transferGantner(item.duplicateData.userId, item.userId)}>
                {'<= TRANSFER GANTNER'}
              </Button>
              <Button key={'removeData2'} raised onClick={() => this.removeData(item.duplicateData.userId)}>
                {'DELETE DATA'}
              </Button>
            </div>
          </div>:null}

        </List>
      )
    //}
  }
}

DropDown.propTypes = {
  classes: PropTypes.object.isRequired,
};

DropDown.defaultProps = {
  open: false,
  title: "No title",
  items: [],
  type: 'none',
  headerBackgroundColor: '#062845'
}

const DropDownStyled = withStyles(styles)(DropDown);

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    var items;
    switch (props.type) {
      case 'vendCustomers':{
        const getAllUsers = makeGetAllUsers();
        items = getAllUsers(state, props);
        break;
      }
      default:{
        items = [];
      }
    }
    return {
      items: items,
    }
  }
  return mapStateToProps
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(makeMapStateToProps, mapDispatchToProps)(DropDownStyled)
