import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, IconButton, CircularProgress, Avatar, Button,
  Card, CardContent, CardMedia, Chip, Snackbar, TextField, Typography,
  Radio, RadioGroup, FormLabel, FormControl, FormControlLabel
} from '@material-ui/core';

import React from 'react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PropTypes from 'prop-types';
import {
  getMessageState,
  makeGetAllUsers,
  makeGetCurrentUser,
  makeGetStaff
} from './selectors';
import * as Actions from './actions';
import IntegrationAutosuggest from './IntegrationAutosuggest';
import OnboardingCarousel from './OnboardingCarousel';
import StdButton from './components/StdButton';
import { FacebookProvider, Like, Login } from 'react-facebook';

const styles = theme => ({
  container: {
    overflow: 'hidden',
    marginLeft: 'auto', marginRight: 'auto',
    marginTop: theme.spacing(5),
    padding: 16
  },
  content: {
    maxWidth: 8 * 50,
    marginRight: 'auto', marginLeft: 'auto',
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
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: 16, paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
    width: '100%',
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd',
    '&:hover': {color: "#fde298", background: '#062845'},
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
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: 16, paddingRight: 16,
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
  red: { color: 'red',
    // backgroundColor:'red',
  },
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9
    width: 256, height: 256,
    marginRight: 'auto', marginLeft: 'auto'
  },
  snackbarMessage: {textAlign: 'center', flex: 1, fontSize: '1.3125rem', padding: theme.spacing(2)},
  snackbarRoot: {backgroundColor: 'rgba(6,40,69,0.96)'},
  fileInput: {display: 'none'},
});

const joinOptions = ["Cahaya Maju", "Cahaya Warisan", "Cahaya Midah", "Cahaya Hanson", "Pandan Cahaya", "Pandan Indah", "Cempaka", "Tenaga", "Wangsa Maju"];

class Registration extends React.Component {

  state = {
    email: '',
    name: '',
    phone: '',
    whatsappPhone:'',
    password: '',
    confirmPassword: '',
    referralSource: '',
    fbUserData:null,
    mcId: null,
    refSource: null,
    continue: false,
    checkinDisabled: false,
    continueRegistration: false,
    completeRegistration: false,
    image: null,
    imagePath:null,
    postcode:null,
    slideshowOpen:true,
    joinOption:joinOptions[0]
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const isLogin = this.props.match.path === '/login';
    const user = this.props.currentUser;
    if (isLogin && user && user.size > 0) {
      const packageId = user.get('packageId');
      const image = user.get('image');
      const roles = user.get('roles');
      const isTrainer = roles && roles.get('trainer') === true;
     
      if (((packageId && !image) || (!image && roles && isTrainer))) {
      // temporarily disable for trainer image
      // if (((packageId && !image) || (roles && isTrainer))) {
        if (!this.state.continue || !this.state.continue) {
          console.log('go here... ', this.state);
          this.setState({
            continue: true,
            continueRegistration: true
          });
        }
      } else {
        this.props.actions.viewNext();
      }
    }

    if (this.props.uploadedImageURL || this.props.uploadedImagePath) {
      var updatedState = {};
      updatedState.image = this.props.uploadedImageURL;
      updatedState.imagePath = this.props.uploadedImagePath;
      updatedState.completeRegistration = true;
      this.setState({ ...updatedState })
      this.props.actions.setUploadedImage(null, null);
    }
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
      if (name === 'email' && value && value.length > 0) {
        value = value.toLowerCase();
        if (value === 'exitf1t' && (this.props.match.path === '/registrationbycro' || this.props.match.path === '/promo')) {
          this.props.actions.viewHome();
        }
      }else if(name==='phone'){
        value = value.replace(/[^0-9]/g, '');
      }else if(name==='name'){
        value = value.replace(/[0-9:]+/g, '');
      }
      updatedState[name] = value;
    }
    this.setState({ ...updatedState });
  }

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap });
  }

  handleCheckin = (enteredUserId) => {
    // this.setState({
    //   checkinDisabled: true
    // });
    // console.log('enteredUserId: ', enteredUserId);

    const joinOption = this.state.joinOption;
    const isPromo = this.props.match.path === '/promo';
    if (enteredUserId && !isPromo) {
      const checkInOption = (joinOption === 'KLCC')? 'App - Registration (KLCC)':'App - Registration';
      console.log('checkIn Option: ', checkInOption);
      this.props.actions.addCheckIn(enteredUserId, checkInOption);
      setTimeout(() => {
        this.handleClear();
      }, 3000);

    } 
    else {

      var userData = {
        email: this.state.email,
        name: this.state.name,
        phone: this.state.phone,
        referralSource: this.state.referralSource,
        mcId: this.state.mcId,
        refSource: this.state.refSource,
        postcode:this.state.postcode,
        firstJoinVisit:this.state.joinOption,
        achieveTarget:this.state.achieveTargetSource
      }

      if(isPromo){
        if(!enteredUserId){
          userData.joiningPromo = 'IN Festival';
          this.props.actions.saveUserData('NEW_REG', userData);
        }
        this.props.actions.viewBuyPromo(this.state.email);
      }else{

        this.props.actions.saveUserData('NEW_REG', userData);
        setTimeout(() => {
          this.handleClear();
        }, 3000);
      }

    }
  }

  handleClear = () => {
    this.setState({
      email: '',
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      referralSource: '',
      refSource: null,
      mcId: null,
      continue: false,
      checkinDisabled: false,
      continueRegistration: false,
      image: null,
      imagePath:null,
      postcode:'',
      slideshowOpen:true
    });
  }

  handleContinue = () => {
    if (!this.props.isFetchingEmail) {
      const isLogin = this.props.match.path === '/login';
      if (!isLogin) {
        this.setState({continue: true});
      } else {
        const email = this.state.email;
        this.props.actions.fetchMethodsForEmail(email, (success) => {
          console.log('fetchMethodsForEmail: ', success);
          this.setState({continue: success});
        });
      }
    }
  }

  handleContinueWhatsapp = () => {
    console.log('handleContinueWhatsapp: ', this.state);
    // this will generate TAC number
    this.props.actions.generateTAC(this.state.whatsappPhone, (response)=>{
      console.log('tac response: ', response);
      this.setState({showTACNumber:true});
    });
  }

  handleLoginFB = () => {
    // console.log('handleLogin: ', this.state);
    // console.log('handleProps: ', this.props);
    const email = this.state.email;
    console.log('theemail: ', email);
    // this.props.actions.FBLoginv2(email, response=>{
    //   console.log('theresponse: ', response);
    // });
    this.props.actions.FBLogin(email, response=>{
      console.log('fbLoginResponse: ', response);
      if (response.success && response.user){
        this.setState({fbUserData: response});
        if (response.result.additionalUserInfo){
          
        }
      } 
      else if (!response.success){
        this.setState({fbErrorMsg: response.error});
      }
    });
  }

  handleContinueRegistration = () => {this.setState({continueRegistration: true})}
  handleChangeJoinOptions = (event, value) => {this.setState({ joinOption:value });};

  handleCompleteSignUp = () => {

    // if () {
    // console.log('get the props....', this.props);
    // const fromCV19Page = this.props.location && this.props.location.pathname && this.props.location.pathname.indexOf('covidform');
    // console.log('isFromCV19Page: ', fromCV19Page);

    // if (fromCV19Page !== -1){
    //   console.log('isFromCV19Page: ', fromCV19Page);
    //   this.props.actions.signUp(this.state.email, this.state.password, this.state.name, this.state.phone, this.state.mcId, this.state.refSource, this.state.image, this.state.imagePath, this.state.postcode, true);
    // }
    if (this.props.currentUser && this.props.currentUser.get('id')) {
      console.log('savingData');
      this.props.actions.saveUserData(this.props.currentUser.get('id'), {
        image: this.state.image,
        imagePath: this.state.imagePath
      });
    } else {
      // every new registration will have to key in too
      this.props.actions.signUp(this.state.email, this.state.password, this.state.name, this.state.phone, this.state.mcId, this.state.refSource, this.state.image, this.state.imagePath, this.state.postcode, true);
    }
  }

  // for FB
  handleResponse = (data) => {
    console.log('fb data:', data);

  }

  handleError = (error) => {
    console.log('fb error: ', error);
    this.setState({ error });
  }

  render() {
    const {classes} = this.props;
    const {fbUserData, fbErrorMsg, whatsappPhone} = this.state;

    const users = this.props.users || null;
    const staff = this.props.staff || null;
    const user = this.props.currentUser;
    const userId = user && user.get('id');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isAuthorized = isAdmin || isMC;
    console.log('theStaffProps: ', this.props.staff);
    console.log('theUsers: ', this.props.users);
    console.log('currentUser: ', user);
    
    const isStaff = user && user.get('isStaff');
    const currentStaffBranch = user && user.get('staffBranch');
    
    const isLogin = this.props.match.path === '/login';
    const isPromo = this.props.match.path === '/promo';
    const fewMoreStepText = 'Just a few more steps...';
    const fullNameLabel = 'Full Name (as stated on your IC/Passport)';
    const howDidUknowLabel = 'How did you know about us?';
    const branchLabel = 'Branch';
    const whatUWantToAchieveLabel = 'What would you like to achieve?';
    const emailLabel = 'Email';
    const phoneNumberLabel = 'Phone Number';
    const postCodeLabel = 'Where are you from? (Just the postcode would do)';

    if(this.state.slideshowOpen && isPromo){return <OnboardingCarousel handleClose={()=>this.setState({slideshowOpen:false})}/>}

    console.log('isStaff: ', isStaff);
    console.log('users.size: ', users && users.size);
    console.log('staff.size: ', staff && staff.size);


    const isReady = (users && users.size && staff && staff.size) ? true : false;
    console.log('isLogin:', isLogin, isReady, this.props.match);

    // if (!isLogin && (!isReady || !isAuthorized)) {
    if (!isLogin && (!isReady || !isStaff)) {
      return (
        <div className={classes.container}>
          <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
        </div>
      );
    }

    const message = this.props.message || ' ';

    const emailMatch = this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email;
    const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
    const isCorp180Email =  isValidEmail && (email.indexOf('bfm.my') !== -1 || email.indexOf('bfmedge.com') !== -1 || email.indexOf('fi.life') !== -1);

    var enteredUserId = null;
    const enteredUser = (isValidEmail && this.state.continue) && users && users.size && users.filter((x, key) => {

      if (x.get('email') && x.get('email').toLowerCase() === email.toLowerCase()) {
        enteredUserId = key;
        return true;
      }
      return false;

    }).first();
    const enteredUserHasPackage = enteredUser && enteredUser.get('packageId') && !(enteredUser.get('cancellationDate') && enteredUser.get('cancellationReason'));

    const isValidName = this.state.name && this.state.name.length > 0;
    const isValidPhone = this.state.phone && this.state.phone.length > 7;
    const isValidReferralSource = this.state.referralSource && this.state.referralSource.trim().length > 0;
    const isValidRefSource = this.state.refSource;
    const isValidAchieveTarget = this.state.achieveTargetSource;
    const isValidConsultant = this.state.mcId;
    const isValidPassword = this.state.password && this.state.password.length > 5;
    const isValidConfirmPassword = isValidPassword && this.state.password === this.state.confirmPassword;
    const checkinDisabled = this.state.checkinDisabled;
    const isValidPostCode = this.state.postcode && this.state.postcode.length>=4;

    console.log(isValidEmail, isValidName, isValidPhone, isValidReferralSource, isValidConsultant, !checkinDisabled);
    // console.log('refSOurce: ', this.state.refSource);


    const {joinOption} = this.state;
    const radioButtonOptionsLayout = 
    <FormControl style={{marginTop:16}} component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Branch that you rent?</FormLabel>
      <RadioGroup
        aria-label="Location"
        name="joinOptions"
        className={classes.group}
        value={joinOption}
        onChange={this.handleChangeJoinOptions}
      >
        <FormControlLabel value={joinOptions[0]} control={<Radio />} label={joinOptions[0]} />
        <FormControlLabel value={joinOptions[1]} control={<Radio />} label={joinOptions[1]} />
        <FormControlLabel value={joinOptions[2]} control={<Radio />} label={joinOptions[2]} />
        <FormControlLabel value={joinOptions[3]} control={<Radio />} label={joinOptions[3]} />
        <FormControlLabel value={joinOptions[4]} control={<Radio />} label={joinOptions[4]} />
        <FormControlLabel value={joinOptions[5]} control={<Radio />} label={joinOptions[5]} />
        <FormControlLabel value={joinOptions[6]} control={<Radio />} label={joinOptions[6]} />
        <FormControlLabel value={joinOptions[7]} control={<Radio />} label={joinOptions[7]} />
      </RadioGroup>
    </FormControl>;

    var signUpDisabled = false;
    if (this.props.emailNeedsSignUpDetails) {
      signUpDisabled = !(isValidEmail && isValidName && isValidPhone && this.state.password && this.state.confirmPassword && this.state.password.length > 4 && this.state.password === this.state.confirmPassword);
    } else {
      signUpDisabled = !(this.state.password && this.state.confirmPassword && this.state.password.length > 4 && this.state.password === this.state.confirmPassword);
    }

    // define the layout
    const emailTextInput =  
      <TextField margin="dense" id="emailAdd" label={emailLabel} fullWidth
        onChange={this.handleChange('email')} required autoComplete='off'
        value={email}
      />;

    const nameTextInput = 
      <TextField
        margin="dense" id="name" label={fullNameLabel} type="text" fullWidth
        onChange={this.handleChange('name')} required autoComplete='off'
        value={this.state.name}
      />;

    const phoneTextInput =
      <TextField
        value={this.state.phone} margin="dense" id="phone" label={phoneNumberLabel} type="number" fullWidth
        onChange={this.handleChange('phone')} required autoComplete='off'
      />;

    const postCodeTextInput = 
      <TextField
        margin="dense" id="postCode" label={postCodeLabel} type="number" fullWidth
        onChange={this.handleChange('postcode')} autoComplete='off'
        onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,5)}}
      />;

    var userItem = null;
    if (!isLogin && enteredUser) {
      console.log('not login user & entered user: ', this.state);
      userItem = (
        <div>
          <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
            Welcome back,
          </Typography>
          <Typography type="display1" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
            {enteredUser.get('name')}!
          </Typography>
          <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
            {enteredUser.get('email')}
          </Typography>
          {(!isPromo) &&
            <Button raised color='primary' key={'checkin'} classes={{containedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleCheckin(enteredUserId)} disabled={!isValidEmail && checkinDisabled}>
              {isPromo ? 'Continue' : 'Check In'}
            </Button>
          }
          {(isPromo && !enteredUserHasPackage) &&
            <Button raised color='primary' key={'checkin'} classes={{containedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleCheckin(enteredUserId)} disabled={!isValidEmail && checkinDisabled}>
              {isPromo ? 'Continue' : 'Check In'}
            </Button>
          }
          {(isPromo && enteredUserHasPackage) &&
            <Typography type="subheading" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
              {"You're already a member!"}
            </Typography>
          }
          <Button color='primary' key={'clear'} classes={{disabled:classes.buttonDisabled}} onClick={()=>this.handleClear()} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
            Clear
          </Button>
        </div>
      );
    } else if (isValidEmail && (this.state.continue && !this.state.continueRegistration && ((isLogin && !this.props.isFetchingEmail) || !isLogin))) {

      const mcId = this.state.mcId;
      const mc = mcId && staff && staff.get(mcId) ? staff.get(mcId) : null;
      // console.log('themcId: ', staff);
      // console.log('themc: ', mc);
      const mcName = mc && mc.has('name') ? mc.get('name') : null;
      const mcImage = mc && mc.has('image') ? mc.get('image') : null;
      const mcAvatar = mcImage || (mcName && mcName.length > 0) ?
        (mcImage ? (<Avatar src={mcImage} />) : (<Avatar>{mcName.charAt(0).toUpperCase()}</Avatar>)) :
        null;

      if (isLogin) {
        console.log('user is login')
        if (!this.props.emailNeedsSignUp) {
          console.log('is login need signed up')
          userItem = (
            <div>
              <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
                {this.state.email}
              </Typography>
              <TextField
                margin="dense"
                id="password"
                label="Password"
                fullWidth
                onChange={this.handleChange('password')}
                required
                type={'password'}
                autoComplete='off'
                value={this.state.password}
              />
              <StdButton
                text = {'Login'}
                key = {'LoginBtn'}
                disabled={!this.state.password || this.state.password.length < 4}
                onClick={()=>this.props.actions.login(email, this.state.password)}
              />
              {/* <Button raised color='primary' key={'login'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.login(email, this.state.password)} disabled={!this.state.password || this.state.password.length < 4}>
                Login
              </Button> */}
              <Button color='primary' key={'forgot'} classes={{raisedPrimary:classes.buttonRed, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.forgotPassword(this.state.email)} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
                Reset Password
              </Button>
              <Button color='primary' key={'clear'} classes={{raisedPrimary:classes.buttonRed, disabled:classes.buttonDisabled}} onClick={()=>this.handleClear()} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
                Clear
              </Button>
            </div>
          );
        } else {
          
          userItem = (
            <div>
              <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
                {this.state.email}
              </Typography>
              <TextField
                margin="dense"
                id="password"
                label="Password (min 6 chars)"
                fullWidth
                onChange={this.handleChange('password')}
                required
                type={'password'}
                autoComplete='off'
                value={this.state.password}
                error={!isValidPassword}
              />
              <TextField
                margin="dense"
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                onChange={this.handleChange('confirmPassword')}
                required
                error={!isValidConfirmPassword}
              />
            {this.props.emailNeedsSignUpDetails &&
              <div>
                {nameTextInput}
                {phoneTextInput}
                {!this.state.refSource && <IntegrationAutosuggest selections='referralSource' placeholder={howDidUknowLabel} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>}
                {this.state.refSource && 
                  <div style={{marginTop:16}}>
                    <FormLabel component="legend">Referral Source</FormLabel>
                    <Chip
                      avatar={null}
                      label={this.state.refSource}
                      style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                      onDelete={()=>this.handleAutosuggest('refSource', null)}
                    />
                  </div>
                }
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
                {!mcId &&
                  <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>
                }
                {mcId &&
                  <div style={{marginTop:16}}>
                    <FormLabel component="legend">Customer Relations Officer's Name</FormLabel>
                    <Chip
                    avatar={mcAvatar}
                    label={mcName}
                    style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                    onDelete={()=>this.handleAutosuggest('mcId', null)}
                    />
                  </div>
                }
                {postCodeTextInput}
                {radioButtonOptionsLayout}
              </div>
            }
              <Button raised color='primary' key={'continue2'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>{
                  // if(this.state.email.indexOf('babel.fit')===-1){
                  //   this.handleContinueRegistration();
                  // }else{
                    this.handleCompleteSignUp();
                  // }
                }} disabled={signUpDisabled || this.props.isSigningUp}>
                Continue
                {this.props.isSigningUp && <CircularProgress style={{color:'white', marginLeft:8}}/>}
              </Button>
              <Button color='primary' key={'clear'} classes={{raisedPrimary:classes.buttonRed, disabled:classes.buttonDisabled}} onClick={()=>this.handleClear()} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
                Clear
              </Button>
            </div>
          );
        }

      } else {
        userItem = (
          <div>
            <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
              {fewMoreStepText}
            </Typography>
            {emailTextInput}
            {nameTextInput}
            {phoneTextInput}
            {false && <TextField
              margin="dense"
              id="referralSource"
              label={howDidUknowLabel}
              fullWidth
              onChange={this.handleChange('referralSource')}
              required
              autoComplete='off'
            />}
            {!this.state.refSource && <IntegrationAutosuggest selections='referralSource' placeholder={howDidUknowLabel} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>}
            {this.state.refSource && 
              <div style={{marginTop:16}}>
                <FormLabel component="legend">Referral Source</FormLabel>
                <Chip
                label={this.state.refSource}
                style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                onDelete={()=>this.handleAutosuggest('refSource', null)}
                />
              </div>
            }
            {!this.state.achieveTargetSource && <IntegrationAutosuggest selections='achieveTargetSource' placeholder={whatUWantToAchieveLabel} onSelectionChange={selectedAchieveTargetSource => this.handleAutosuggest('achieveTargetSource', selectedAchieveTargetSource)}/>}
            {this.state.achieveTargetSource && 
              <div style={{marginTop:16}}>
                <FormLabel component="legend">Achieve Target</FormLabel>
                <Chip
                  avatar={null}
                  label={this.state.achieveTargetSource}
                  style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                  onDelete={()=>this.handleAutosuggest('achieveTargetSource', null)}
                />
              </div>
            }
            {!mcId &&
              <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>
            }
            {mcId &&
              <div style={{marginTop:16}}>
                <FormLabel component="legend">Customer Relations Officer's Name</FormLabel>
                <Chip
                avatar={mcAvatar}
                label={mcName}
                style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                onDelete={()=>this.handleAutosuggest('mcId', null)}
                />
              </div>
            }
            {postCodeTextInput}

            {radioButtonOptionsLayout}
            <Button raised color='primary' key={'checkin'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleCheckin(enteredUserId)} disabled={!(isValidEmail && isValidName && isValidPhone && isValidRefSource && isValidAchieveTarget && isValidPostCode && isValidConsultant && !checkinDisabled)}>
              {isPromo ? 'Continue' : 'Check In'}
            </Button>
            <Button color='primary' key={'clear'} classes={{raisedPrimary:classes.buttonRed, disabled:classes.buttonDisabled}} onClick={()=>this.handleClear()} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
              Clear
            </Button>
          </div>
        );
      }

    } 
    else if (this.state.continue && this.state.continueRegistration) {

      console.log('registartion state: ', this.state);

      const image = this.state.image;
      var editUserAvatar = <PhotoCameraIcon style={{width:128, height:128}} />;
      if (image) {
        editUserAvatar = <Avatar style={{width:128, height:128, marginLeft:'auto', marginRight:'auto'}} src={image} />;
      }

      // console.log('isNative: ', this.props.isNative);
      
      userItem = (
        <div>
            {this.props.isNative &&
              <div>
                {this.state.imageURLToUpload}
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                  <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:48}} disabled={this.props.isUploadingImage} onClick={()=>this.props.actions.useNativeCamera()}>
                    {editUserAvatar}
                  </IconButton>
                </div>
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                  <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}} onClick={()=>this.props.actions.useNativeLibrary()}>
                    {this.state.image ? 'Change Photo' : 'Upload Photo' }
                    {this.props.isUploadingImage && <CircularProgress style={{color:'white', marginLeft:8}}/>}
                  </Button>
                </div>
              </div>
            }
            {!this.props.isNative &&
              <div>
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} disabled={this.props.isUploadingImage} />
                  <label htmlFor="icon-button-file" >
                    <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:48}}>
                      {editUserAvatar}
                    </IconButton>
                  </label>
                </div>
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
                  <label htmlFor="icon-button-file" >
                    <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}}>
                      {this.state.image ? 'Change Photo' : 'Upload Photo' }
                      {this.props.isUploadingImage && <CircularProgress style={{color:'white', marginLeft:8}}/>}
                    </Button>
                  </label>
                </div>
              </div>
            }
            <Typography type="title" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
              Kindly upload your front facial photo to activate your app.
            </Typography>
            <Typography type="caption" component="h1" gutterBottom color="primary" style={{textAlign:'center'}}>
              This is important as it enables our team to ensure better security and safety
              during members check in process. Thank you.
            </Typography>
            <Button raised color='primary' key={'complete'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleCompleteSignUp()} disabled={!this.state.image || this.props.isSigningUp}>
              Complete
              {this.props.isSigningUp && <CircularProgress style={{color:'white', marginLeft:8}}/>}
            </Button>
            <Button color='primary' key={'clear'} classes={{raisedPrimary:classes.buttonRed, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewNext(userId)} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
              Skip
            </Button>
          </div>
      );
    } 
    else {
      userItem = (
        <div>
          <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
            Welcome to BilikXpert
          </Typography>
          <TextField
            id="email"
            label="Please enter your email address"
            fullWidth
            onChange={this.handleChange('email')}
            autoComplete='off'
            value={email}
            style = {{marginBottom:5}}
          />
         
          <StdButton
            text = {'Continue'}
            key = {'continue'}
            disabled={!isValidEmail || this.props.isFetchingEmail}
            onClick={()=>this.handleContinue()}
            showCircularProgress = {this.props.isFetchingEmail}
          />
        
           {/* <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center', cursor:'pointer', backgroundColor:'#4968ad', padding:20}}>
            <FacebookProvider appId="476078559432892">
                <Login
                scope="email"
                onCompleted={this.handleResponse}
                onError={this.handleError}
                >
                {({ loading, handleClick, error, data }) => (
                    <span onClick={handleClick}>
                    Login via Facebook
                    {loading && (
                        <span>Loading...</span>
                    )}
                    </span>
                )}
                </Login>
            </FacebookProvider>
          </div> */}
          {false && <StdButton
            text = {'Facebook Login'}
            key = {'fbLoginBtn'}
            // disabled={!isValidEmail || this.props.isFetchingEmail}
            onClick={()=>this.handleLoginFB()}
            // showCircularProgress = {this.props.isFetchingEmail}
          />}
          {fbUserData && 
            <div>
               <Typography>
                {`FB connected`}
              </Typography>
              
              <img src = {`https://graph.facebook.com/${fbUserData.result.additionalUserInfo.profile.id}/picture?type=large`} style = {{width:300, height:300}}/>
              <Typography>
                {`email: ${fbUserData.result.additionalUserInfo.profile.email}`}
              </Typography>
              <Typography>
                {`isNewUser: ${fbUserData.result.additionalUserInfo.isNewUser}`}
              </Typography>
              <Typography>
                {`display name: ${fbUserData.result.additionalUserInfo.profile.name}`}
              </Typography>
              <Typography>
                {`photoURL: ${fbUserData.user.photoURL}`}
              </Typography>
              <Typography>
                {`userId: ${fbUserData.user.uid}`}
              </Typography>
              <Typography>
                {`FBUserId: ${fbUserData.result.additionalUserInfo.profile.id}`}
              </Typography>
             
            </div>
          }
          {fbErrorMsg && 
            <div>
              <Typography>
                {`FBError: ${fbErrorMsg}`}
              </Typography>
            </div>
          }
         
          {(this.state.email.length > 0 || isPromo) && false && 
            <Button color='primary' key={'clear'} classes={{disabled:classes.buttonDisabled}} onClick={()=>this.handleClear()} style={{color:'#F71A38', width:'100%', marginTop:8*4}}>
              {this.state.email.length === 0 && isPromo ? 'Show Intro' : 'Clear'}
            </Button>
          }
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <Card className={classes.content} elevation={0}>
        {!this.state.continueRegistration &&
          <CardMedia
            className={classes.media}
            image={require('./assets/bilikxpert_logos_black.png')}
            // title="Babel - Inspire. Change"
          />
        }
        <CardContent>{userItem}</CardContent>
        </Card>
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

Registration.propTypes = {
  classes: PropTypes.object.isRequired,
};

const RegistrationStyled = withStyles(styles)(Registration);

// const mapStateToProps = (state, ownProps) => ({
//   ...state
// });

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    const getStaff = makeGetStaff();
    const getAllUsers = makeGetAllUsers();
    const getCurrentUser = makeGetCurrentUser();
    const isLogin = props.match.path === '/login';
    var users = null;
    if (!isLogin) {
      users = getAllUsers(state, props);
    }
    return {
      staff: getStaff(state, props),
      users: users,
      message: getMessageState(state, props),
      currentUser: getCurrentUser(state, props),
      isNative: state && state.state && state.state.get('isNative') ? true : false,
      isFetchingEmail: state && state.state && state.state.get('isFetchingEmail') ? true : false,
      emailNeedsSignUp: state && state.state && state.state.get('emailNeedsSignUp') ? true : false,
      emailNeedsSignUpDetails: state && state.state && state.state.get('emailNeedsSignUpDetails') ? true : false,
      emailNeedsUserDetails: state && state.state && state.state.get('emailNeedsUserDetails') ? true : false,
      isUploadingImage: state && state.state && state.state.get('isUploadingImage') ? true : false,
      isSigningUp: state && state.state && state.state.get('isSigningUp') ? true : false,
      uploadedImageURL: state && state.state && state.state.get('uploadedImageURL') ? state.state.get('uploadedImageURL') : null,
      uploadedImagePath: state && state.state && state.state.get('uploadedImagePath') ? state.state.get('uploadedImagePath') : null
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(Actions, dispatch)}
}

export default connect(makeMapStateToProps, mapDispatchToProps)(RegistrationStyled)
