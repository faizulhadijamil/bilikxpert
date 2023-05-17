import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, TextField, Grid, Button, Typography, CircularProgress} from '@material-ui/core';

  import React from 'react';
  import moment from 'moment';
  
  import PropTypes from 'prop-types';
  
  import {makeGetCurrentUser} from './selectors'
  import * as Actions from './actions';
  import BabelLogo from './BabelLogo';
  import MenuAppBar from './MenuAppBar';
  
  var FileSaver = require('file-saver');

  const styles = theme => ({
    container: {
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingTop: theme.spacing(8),
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
    },
  });
  
  class rooms extends React.Component {
  
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
      roomNumber:'',
      branchId:'',
      monthlyDeposit:100,
      monthlyPrice:'',
      weeklyDeposit:50,
      weeklyPrice:'',
      dailyDeposit:50,
      dailyPrice:'',
      showAddRoom:false,
      editData: {},
      isLoading:true
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

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    handleChange = name => event => {
        var updatedState = {};
    
        if (name === 'image') {
    
          const imageFile = event.target.files[0];
          if (imageFile) {
            this.props.actions.uploadImage(imageFile, (imageURL, imagePath) => {
              if (imageURL) {
                updatedState.image = imageURL;
                updatedState.imagePath = imagePath;
                updatedState.completeRegistration = true;
              }
              this.setState({ ...updatedState});
            });
          }
        } else {
          var value = event.target.value;
          if (name === 'availableDate' || name === 'classDate' || name === 'expiredDate') {
            value = moment(value).toDate();
          } 
          updatedState[name] = value;
        }
        this.setState({ ...updatedState });
    }
    
    handleAddRoom = () => {
        console.log('handleAddRoom: ', this.state);
        const {roomNumber, branchId, monthlyDeposit, monthlyPrice, weeklyDeposit, weeklyPrice, dailyDeposit, dailyPrice} = this.state;
        // this.props.actions.addClass(name, description, instructorName, maxCapacity, venue, classDuration, availableDate, classDate, expiredDate, vendProductId);
        this.props.actions.addRoom(roomNumber, branchId, monthlyDeposit, monthlyPrice, weeklyDeposit, weeklyPrice, dailyDeposit, dailyPrice, response=>{
          console.log('addroomResponse: ', response)
        });
    }

    renderAddRoom(){

      const {classes,currentUser} = this.props;
      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      const isKLCC = email && email.indexOf('+klcc@babel.fit') !== -1 ? true : false;

      // define the layout
      const roomNumberTextInput =  
          <TextField margin="dense" id="className" label={'Room Number'} fullWidth
          onChange={this.handleChange('roomNumber')} required autoComplete='off'
          value={this.state.roomNumber}
          />;

      const branchIdTextInput =  
        <TextField margin="dense" id="branchId" label={'Branch Id'} fullWidth
        onChange={this.handleChange('branchId')} required autoComplete='off'
        value={this.state.branchId}
        />;

      const monthlyDepositTextInput =  
        <TextField margin="dense" id="monthlyDeposit" label={'monthlyDeposit'} fullWidth
        onChange={this.handleChange('monthlyDeposit')} required autoComplete='off'
        value={this.state.monthlyDeposit}
        />;

      const monthlyPriceTextInput =  
        <TextField margin="dense" id="monthlyPrice" label={'Monthly Price'} fullWidth
        onChange={this.handleChange('monthlyPrice')} required autoComplete='off'
        value={this.state.monthlyPrice}
        />;

      const weeklyDepositTextInput =  
        <TextField margin="dense" id="weeklyDeposit" label={'Weekly Deposit'} fullWidth
        onChange={this.handleChange('weeklyDeposit')} required autoComplete='off'
        value={this.state.weeklyDeposit}
        />;

      const weeklyPriceTextInput =  
        <TextField margin="dense" id="weeklyPrice" label={'Weekly Price'} fullWidth
        onChange={this.handleChange('weeklyPrice')} required autoComplete='off'
        value={this.state.weeklyPrice}
        />;

      const dailyDepositTextInput =  
        <TextField margin="dense" id="dailyDeposit" label={'Daily Deposit'} fullWidth
        onChange={this.handleChange('dailyDeposit')} required autoComplete='off'
        value={this.state.dailyDeposit}
        />;

      const dailyPriceTextInput =  
        <TextField margin="dense" id="dailyPrice" label={'Daily Price'} fullWidth
        onChange={this.handleChange('dailyPrice')} required autoComplete='off'
        value={this.state.dailyPrice}
        />;

        return (
        
                <div style={{padding:20}}>
                  <Grid item xs={12}>
                      <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                          {'CREATE ROOM'}
                      </Typography>
                      {roomNumberTextInput}
                      {branchIdTextInput}
                      {monthlyDepositTextInput}
                      {monthlyPriceTextInput}
                      {weeklyDepositTextInput}
                      {weeklyPriceTextInput}
                      {dailyDepositTextInput}
                      {dailyPriceTextInput}

                  <Button raised key={'rooms'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} 
                      onClick={this.handleAddRoom} color="primary" 
                      //disabled={this.props.isAddingInvoice}
                      >
                          Create Room
                      {false && this.props.isAddingInvoice &&
                          <CircularProgress style={{color:'white', marginLeft:8}}/>
                      }
                  </Button>
                  </Grid>
                </div>

        );
      }

    render() {
      const {classes,currentUser} = this.props;
      return (
        <div className={classes.container}>
            <MenuAppBar />
              <div style={{padding:20}}>
                <Button raised key={'showAddRoom'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} 
                      onClick={()=>{
                        !this.state.showAddRoom?this.setState({showAddRoom:true}):this.setState({showAddRoom:false})
                      }
                      } color="primary" 
                      //disabled={this.props.isAddingInvoice}
                      >
                        ADD ROOM ↓
                </Button>
                {this.state.showAddRoom && this.renderAddRoom()}
                <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                    {'EDIT ROOM, Need to list all available rooms by branches'}
                </Typography>
              </div>
            <BabelLogo />
        </div>
      );
    }
  }
  
  rooms.propTypes = {classes: PropTypes.object.isRequired};
  
  const roomsStyled = withStyles(styles)(rooms);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        // users: getAllUsers(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(roomsStyled)