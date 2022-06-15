import {withStyles, CircularProgress, Dialog, DialogContent, DialogActions, Button, TextField, Typography, FormLabel, Chip, Avatar} from '@material-ui/core'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import BabelLogo from '../BabelLogo';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import {
  makeGetCnyRef,
  makeGetAllUsers,
  makeGetActiveMemberItems,
} from '../selectors';
import * as Actions from '../actions';
import StdButton from '../components/StdButton';
import IntegrationAutosuggest from '../IntegrationAutosuggest';
import {makeGetStaff} from '../selectors';
import AngpauButton from '../components/AngpauButton';
import KlccExperienceButton from '../components/KlccExperienceButton';

var ismobile = window.innerWidth<=550?true:false;

  const styles = theme => ({
    container: {
        // width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        // backgroundImage: `url("${backgroundImg}")`,
        // backgroundPosition: 'center',
        // backgroundSize: 'cover',
        // height:'100%',
        // backgroundRepeat:'repeat-y',
        backgroundColor:'#000',
        minHeight:window.innerHeight
    },
    contentInner: {
        maxWidth: 15 * 50,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems:'center',
        justifyContent:'center',
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        backgroundColor: 'rgba(0, 0, 0, 0.26)',
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
    extraLightMontSerrat:{
        fontFamily: "Montserrat",
        fontWeight: 200,
        color:'#fff',
    },
    mediumMontSerrat:{
        color:'#FFF', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        fontSize:ismobile?13:20
        // letterSpacing:0
    },
    boldMontSerrat:{
        color:'#E8C888', 
        fontFamily: "Montserrat",
        // fontFamily :'sans-serif', 
        fontWeight: 600,
        letterSpacing:2
    },
    floatingLabelStyle:{
        color:'#fff'
    },
    sendButtonStyle:{
        // marginTop: theme.spacing(2),
        marginTop:25,
        // marginBottom: theme.spacing(2),
        // paddingTop: 3,
        // paddingBottom: 3,
        paddingLeft: 80,
        paddingRight: 80,
        borderRadius: 10,
        // minHeight: 25,
        minWidth: 28,
        border: '1.5px solid white',
        // width: '100%',
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      },
      avatarList:{
        width: '100%',
        // backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'auto',
        // overflow: 'hidden',
        // height:800 - 20, // because borderradius = 20
        // istStyle: "none",
        marginLeft:10, 
        marginRight:10
      },
      subImage:{
        width: ismobile? '30%':'25%', border: '1.5px solid white'
      },
      whitetexInput:{
        fontFamily:'Montserrat',
        color:'white',
        '& .MuiInputBase-input': {
            color: '#red', // Text color
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'red', // Semi-transparent underline
          },
          '& .MuiInput-underline:hover:before': {
            borderBottomColor: 'FF00FF', // Solid underline on hover
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#FF00FF', // Solid underline on focus
          },
        // '&:hover:not($disabled):not($focused):not($error):before': {
        //     borderBottom: `2px solid white`
        // }
        // '&:hover': {color: "#fde298", background: '#062845'},
      },
      formLabelRoot:{
          color:'white'
      },
      textInputroot:{
        color:'white',
        '&:hover $notchedOutline': {
            borderColor: 'orange'
          }
      }
  });

  class buyKLCCExperience extends React.Component {
  
    state = {
      email: '',
      name: '',
      phone: '',
      isGuest:false,
      emailVerified:false,
      refSource: null,
      postcode:'',
      mcId: null,
      showEmailInput:false,
      refererEmail:'',
      achieveTargetSource:null,
      
      dialogOpen:false,
    showFirst:true,
    showExperience:false,
    showWhatUGet:false,
    showKeyInDetails:false,
      isMobile: false,
      //   showReferralLayout:false,
      //   showSaveButton:true,
      //   userReferralInput:[{email:'',name:''}],

      //   showErrorDialog:false,
      //   isSubmitted: false,
      showLoading:false,
      //   showSuccessPage:false,
    }
  
    componentDidMount() {
      this.setState({isMobile:(window.innerWidth<=550)?true:false});
      const urlSearchString = this.props.location.search;
      const urlEmailandName = urlSearchString && urlSearchString.indexOf('?name=' === -1) ? urlSearchString.replace('?name=', '') : null;
      const currentUserEmailandName = urlEmailandName && urlEmailandName.split('&email=');
      const currentUserEmail = currentUserEmailandName && currentUserEmailandName[1] || '';
      let currentUserName = currentUserEmailandName && currentUserEmailandName[0] || '';
      currentUserName = currentUserName.replace(/%20/g, " ");
      // console.log('currentUserEmail: ', currentUserEmail);

      // const userData = firebase.firestore().collection('users').where("email", "==", currentUserEmail).limit(1).get();
      // const cnyRefData = firebase.firestore().collection('cnyReferralList').where("email", "==", currentUserEmail).limit(1).get();

      // var theUserData = [];
      // userData.then((querySnapshot)=>{
      //   querySnapshot.forEach(doc=>{
      //     console.log(doc.id, '=>', doc.data());
      //     theUserData.push(doc.data());
      //   });
      //   this.setState({theUser:theUserData});
      // }).catch(function (error) {
      //   this.setState({ theUser: null });
      //   console.log("Error getting document:", error);
      // });
    }

    componentWillMount() {
      const urlSearchString = this.props.location.search;
      const urlEmailandName = urlSearchString && urlSearchString.indexOf('?name=' === -1) ? urlSearchString.replace('?name=', '') : null;
      const currentUserEmailandName = urlEmailandName && urlEmailandName.split('&email=');
      const currentUserEmail = currentUserEmailandName && currentUserEmailandName[1] || '';
      let currentUserName = currentUserEmailandName && currentUserEmailandName[0] || '';
      currentUserName = currentUserName.replace(/%20/g, " ");
      const theDate = moment().format('DD-MM-YYYY');
      const theTime = moment().format('hh:mm:ss');

      // firebase.firestore().collection('cnyRefSimpleAnalytic').add({currentUserEmail, currentUserName, theDate, theTime}).then(function(){
      //   console.log('success will mount');
      // })
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
      // else if (name === 'checkedPromo'){
      //   value = event.target.checked;
      //   //console.log('thecheckedValue: ', value);
      // }
      updatedState[name] = value;
      this.setState({ ...updatedState
      });
    }
    
    renderLoading(){
      const {classes} = this.props;
      return( 
        <div 
          className={classes.container}
          style= {{height:window.innerHeight}}
        >
           <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>
        </div>
        );
    }

  // renderBtn(){
  //     return(
  //         <StdButton  
  //             key={'BUYBtn'} 
  //             onClick={()=>{this.handleVerifyEmail()}}
  //             disabled={!isValidEmail || this.props.isFetchingEmail}
  //             text={'NEXT'}
  //         />
  //     )
  // }

  handleVerifyEmailBtn = () =>{
    console.log('isFetchingEmail: ', this.props.isFetchingEmail);

    // for verify email
    if (!this.props.isFetchingEmail) {
      const email = this.state.email;
      this.props.actions.fetchUserDataByEmail(email, (result) => {
        console.log('fetchMethodsForEmail: ', result);
        const success = result.success;
        const user = result.user;
        const membershipStart = (user && user.autoMembershipStarts)? user.autoMembershipStarts: (user && user.membershipStarts) ? user.membershipStarts:null;
        const membershipEnd = (user && user.autoMembershipEnds)? user.autoMembershipEnds: (user && user.membershipEnds)? user.membershipEnds:null;
        const packageId = user && user.packageId? user.packageId:null;
        const isMember = packageId && membershipEnd && membershipStart;
        // for new guest or existing guest
        const isGuest = !success || !isMember;
        console.log('isGuest: ', isGuest);
        this.setState({emailVerified: true, isGuest});
      });
    }
  }

  isValidEmail = (email) => {
    // const emailMatch = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // const emailMatchLength = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : email;
    // const isValidEmail = (emailMatchLength && emailMatchLength.length > 0) ? true : false;
    // return isValidEmail;
    // return emailMatch;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true;
    }
    else{
      return false;
    }
  }

  handleContinue = () => {
    // console.log('theState: ', this.state);
    const {name, phone, postcode, refSource, achieveTargetSource, refererEmail, selectedPkgId} = this.state;
    const inValidName = (!name || name.length<=5);
    const inValidPhone = (!phone || phone.length<8);
    const inValidPostCode = (!postcode || postcode < 4);
    const inValidRefSource = (!refSource || refSource <4);
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidRefererEmail = this.isValidEmail(refererEmail);
    // console.log('isValidEmail: ', isValidEmail);
    // console.log('isValidRefererEmail: ', isValidRefererEmail);
    const invalidEmailErrorMsg = 'Invalid Email, please enter a valid email';
    const invalidRefErrorMsg = `Invalid Referrer Email`;
    const invalidPkgIdMsg = `Please select your package`;
    const invalidNameMsg = `Please enter your name`;
    const invalidPhoneMsg = `Please enter your phone number`;
    const invalidPostCodeMsg = `invalid postcode`;
    const invalidArchieveTargetMsg = `please select your target`;
    const cantRewardYourself = `you can not reward to yourself`;

    if (!isValidEmail){
      console.log('invalid email: ', this.state.email);
      this.setState({dialogOpen:true, errorMessage:invalidEmailErrorMsg});
      return;
    }
    if (inValidName){
      console.log('invalid name: ', name);
      this.setState({dialogOpen:true, errorMessage:invalidNameMsg});
      return;
    }
    // todo: check for valid phone
    if (inValidPhone){
      console.log('invalid phone number: ', phone);
      this.setState({dialogOpen:true, errorMessage:invalidPhoneMsg});
      return;
    }
    if (inValidPostCode){
      console.log('invalid postcode label: ', postcode);
      this.setState({dialogOpen:true, errorMessage:invalidPostCodeMsg});
      return;
    }
    if (!achieveTargetSource){
      console.log('invalid achieveTargetSource: ', achieveTargetSource);
      this.setState({dialogOpen:true, errorMessage:invalidArchieveTargetMsg});
      return;
    }

    if (refererEmail === this.state.email){
      this.setState({dialogOpen:true, errorMessage:cantRewardYourself});
      return;
    }
    // // identify if existing member
    // if (isValidEmail){

    // }

    if (isValidEmail && !inValidName && !inValidPhone && !inValidPostCode && achieveTargetSource){
      this.setState({showLoading:true});
      // todo create invoice
      // this.props.actions.addInvoiceForAngpau(email, name, phone, null, refSource, achieveTargetSource, selectedVendPkgId, (result) => {
      console.log('email: ', this.state.email);
      const userData = {
        email: this.state.email,
        name: this.state.name,
        phone: this.state.phone,
        mcId: this.state.mcId,
        achieveTargetSource: achieveTargetSource,
        postcode:this.state.postcode,
        createdFrom:'klccExperience',
      }
    //   this.props.actions.getUserByEmail(this.state.email, response=>{
    //     console.log('userresponse: ', response);
    //     if (response && response.error){
    //         this.props.actions.saveUserData('NEW', userData);
    //     }
    //     else if (response && response.packageId){
    //         this.setState({dialogOpen:true, errorMessage:'You are already a member'});
    //     }
    //     else{
    //         console.log('go here...')
    //         this.props.actions.saveUserData('NEW', userData);
    //         // this.setState({dialogOpen:true, errorMessage:'Email already exist'});
    //     }
    //     this.setState({showLoading:false});
    //   });
    this.props.actions.saveUserData('NEW', userData);

    this.setState({showLoading:false});

    //   this.props.actions.getUsernRefDataByEmail(this.state.email, refererEmail, (result) => {
    //     console.log('fetchMethodsForEmail: ', result);
    //     const success = result.success;
    //     const user = result.user;
    //     const membershipStart = (user && user.autoMembershipStarts)? user.autoMembershipStarts: (user && user.membershipStarts) ? user.membershipStarts:null;
    //     const membershipEnd = (user && user.autoMembershipEnds)? user.autoMembershipEnds: (user && user.membershipEnds)? user.membershipEnds:null;
    //     const packageId = user && user.packageId? user.packageId:null;
    //     const isMember = packageId && membershipEnd && membershipStart;
    //     const userRefIsMember = result.userRefIsMember; 
    //     const userRef = result.userRef;
    //     const userRefName = userRef && userRef.name;
    //     console.log('userRefName: ', userRefName);
    //     console.log('theuser: ', user);

    //     // for new guest or existing guest
    //     const isGuest = !isMember;
    //     console.log('isGuest: ', isGuest);
    //     const errorMsg = result.message;
    //     this.setState({emailVerified: true, isGuest});
    //     if ((isGuest && userRefIsMember) || (!user)){
    //       this.props.actions.addInvoiceForAngpau(this.state.email, name, phone, null, null, achieveTargetSource, selectedPkgId, refererEmail, userRefName, (result) => {
    //         console.log('result: ', result);
    //         this.setState({showLoading:false});
    //       });
    //     }
    //     else{
    //       this.setState({showLoading:false, dialogOpen:true, errorMessage:errorMsg? errorMsg:'You are not eligible for this package'})
    //     }
    //   });
    }
  }

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap });
  }

  renderLoading(){
    // const {classes} = this.props;
    return( 
      <div 
        // className={classes.container}
        style= {{height:window.innerHeight}}
      >
         <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>
      </div>
    );
}


handleClose = () => {
  this.setState({
    dialogOpen: false
  });
}

renderShowDialog(){
  const {classes} = this.props;
  const {errorMessage} = this.state;
  return(
    <Dialog open={this.state.dialogOpen} onClose={this.handleClose}>
      <DialogContent>
        <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginBottom:8}}>
          {errorMessage}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button raised key={'okDialog'} onClick={this.handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

renderBabelLogo(){
    const {classes} = this.props;
  const {isMobile} = this.state;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:0, marginTop:70}}>
          <img src ={require("../assets/logo-04.png")} alt="logo" style={{width: isMobile? '20%':'20%'}} />
      </div>
  )
}

renderLogoImg(){
  const {classes} = this.props;
  const {isMobile} = this.state;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:50, marginTop:20}}>
          <img src ={require("../assets/01-02.png")} alt="logo" style={{width: isMobile? '90%':'80%'}} />
      </div>
  )
}

renderTitle(){
  const {classes} = this.props;
  const {isMobile} = this.state;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginBottom:50}}>
        <Typography 
            className={classes.mediumMontSerrat}
            type="subheading" component="h1" noWrap={true}
            style={{textAlign:'center', marginTop:0, marginBottom:0}}>
            {'An All-Inclusive 3 Day Free Fitness Experience'}
        </Typography>
        <Typography 
            className={classes.mediumMontSerrat}
            type="subheading" component="h1" noWrap={true}
            style={{textAlign:'center', marginTop:0, marginBottom:40}}>
            {'At Babel KLCC'}
        </Typography>
      </div>
  )
}

renderWhatUGet () {
    const {classes} = this.props;
    const {isMobile, showWhatUGet} = this.state;
    // if (showWhatUGet){
        return (
            <div style={{display:'flex', flex:1, flexDirection:'column',  justifyContent:'center', alignItems:'center', marginBottom:50}}>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:30, fontSize:isMobile? 25:30}}>
                    {'WHAT YOU GET'}
                </Typography>
                <div style={{display:'flex', flex:1, flexDirection:'column',  justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'white'}}>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:5, fontSize:isMobile? 14:20, color:'black', fontWeight:500}}>
                        {'START YOUR JOURNEY'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0, color:'black'}}>
                        {'Workout at Babel KLCC for 3 days based'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0, color:'black'}}>
                        {'on your goal'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:10, marginBottom:0, color:'black'}}>
                        {'Attend any 2 classes that tie back to your'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0, color:'black'}}>
                        {'fitness goals'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:10, marginBottom:0, color:'black'}}>
                        {'Book & Train on the Gym Floor'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:10, marginBottom:0, color:'black'}}>
                        {'Complete and in-body scan with your PT'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:10, marginBottom:0, color:'black'}}>
                        {'Follow our IG page @babel.fit'}
                    </Typography>
                </div>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:20, marginBottom:0}}>
                    {'Complete all of the above?'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                    {'Not only will you be on the right path to achieve'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                    {`your goals, but you'll also qualify for:`}
                </Typography>
                <div style={{display:'flex', flex:1, flexDirection:'column',  justifyContent:'center', alignItems:'center', padding:20, border: '1.5px solid white', marginBottom:20}}>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:5, fontSize:isMobile? 14:20, fontWeight:500}}>
                        {'PREPAY + MEMBERSHIP'}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                        {`Get 1 month FREE when you sign-up`}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                        {`for our 3 month plan (3+1)`}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                        {`Get 2 months FREE when you sign-up`}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                        {`for our 6 month plan (6+2)`}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                        {`Get 5 months FREE when you sign-up`}
                    </Typography>
                    <Typography 
                        className={classes.mediumMontSerrat}
                        type="subheading" component="h1" noWrap={true}
                        style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                        {`for our 1 year plan (12+5)`}
                    </Typography>
    
                </div>
          
                {false && <KlccExperienceButton
                    key={'getKLCCExpButton'} 
                    text = {'GET MY FREE KLCC EXPERIENC3-D'}
                    onClick={()=>{this.handleShowKeyInDetails()}}
                />}
            </div>
        );
    // }
}

renderKeyInDetails(){
    const {classes} = this.props;
    const {isGuest, emailVerified, isMobile, showKeyInDetails} = this.state;
    const fullNameLabel = 'Full Name';
    const phoneNumberLabel = 'Phone Number';
    const postCodeLabel = 'Where are you from? (Postcode)';
    const howDidUknowLabel = 'How did you know about us?';
    const whatUWantToAchieveLabel = 'What would you like to achieve?';
    const mcId = this.state.mcId;
    const staff = this.props.staff || null;
    const mc = mcId && staff && staff.get(mcId) ? staff.get(mcId) : null;
    // console.log('themcId: ', staff);
    // console.log('themc: ', mc);
    const mcName = mc && mc.has('name') ? mc.get('name') : null;
    const mcImage = mc && mc.has('image') ? mc.get('image') : null;
    const mcAvatar = mcImage || (mcName && mcName.length > 0) ?
      (mcImage ? (<Avatar src={mcImage} />) : (<Avatar>{mcName.charAt(0).toUpperCase()}</Avatar>)) :
      null;

    const emailMatch = this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email;
    const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

    
    const TextFieldEmail = <TextField id="email" label="Email*" fullWidth
      onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8}}
      disabled = {emailVerified && isGuest}
      // labelClassName = {{ color:'#fff' }}
      // inputProps={{ style: {color: 'white'}}}
      
    //   InputProps={{
    //     classes: {
    //        root: classes.textInputroot,
    //        focused: classes.textInputFocused,
    //        notchedOutline: classes.textInputNotchedOutline
    //     }
    //  }}
    // InputProps={{className: classes.whitetexInput}}
    //   className={{backgroundColor: 'red' }}
    //   inputStyle={{ backgroundColor: 'red' }}
    // InputLabelProps={{
    // //  shrink: true,
    //     className:classes.whitetexInput,
    // // classes:{
    // //     root:{className:classes.whitetexInput}
    // // },
    //     FormLabelClasses: {
    //         root: {color:'white'},
    //         focused: {color:'white'}
    //     },
    // }}
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

    // if (showKeyInDetails){
        return (
            <div style={{display:'flex', flex:1, flexDirection:'column',  justifyContent:'center', 
            alignItems:'center', marginBottom:50, padding:20}}>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:30, fontSize:isMobile? 25:30}}>
                    {'REGISTRATION'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:20, fontSize:isMobile? 14:20, fontWeight:500}}>
                    {'WELCOME TO BABEL'}
                </Typography>
    
                 <div style = {{backgroundColor:'white', padding:20, marginBottom:20}}>
                    
                    {TextFieldEmail}
                    {/* {this.renderBtn()} */}
                    {false && !isGuest && emailVerified && <p>{'already member'}</p>}
                    {nameTextInput}
                    {phoneTextInput}
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
                    {false && !mcId && <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>}
                    {false && mcId &&
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
    
                  </div>
                  <KlccExperienceButton
                        key={'contBtn'} 
                        text = {'CONTINUE'}
                        onClick={()=>{this.handleContinue()}}
                    />
            </div>
        );
    // }
}

renderExperience () {
    const {classes} = this.props;
    const {isMobile, showExperience} = this.state;

    // if (showExperience){
        return (
            <div style={{display:'flex', flex:1, flexDirection:'column',  justifyContent:'center', 
            alignItems:'center', marginBottom:50}}>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:40, fontSize:isMobile? 25:30}}>
                    {'YOUR EXPERIENCE'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:10, fontSize:isMobile? 14:20}}>
                    {'GROUP CLASSES'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                    {'A variation of dynamic classes that target your'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                    {'specific fitness needs.'}
                </Typography>
                <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center'}}>
                    <img src ={require("../assets/Classlogo-05.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/Classlogo-07.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/Classlogo-06.jpg")} alt="logo" className={classes.subImage} />
                </div>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:20, marginBottom:10, fontSize:isMobile? 14:20}}>
                    {'FITNESS COACHES'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                    {'A selection of experienced Personal Trainers to'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                    {'help steer you toward your fitness goals.'}
                </Typography>
                <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center'}}>
                    <img src ={require("../assets/Coach-07.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/Coach-08.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/Coach-09.jpg")} alt="logo" className={classes.subImage} />
                </div>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:20, marginBottom:10, fontSize:isMobile? 14:20}}>
                    {'FACILITIES'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                    {'A World-class environment with branded'}
                </Typography>
                <Typography 
                    className={classes.mediumMontSerrat}
                    type="subheading" component="h1" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:20}}>
                    {'equipment and amenities'}
                </Typography>
                <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center', marginBottom:20}}>
                    <img src ={require("../assets/facilities-11.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/facilities-12.jpg")} alt="logo" className={classes.subImage} />
                    <img src ={require("../assets/facilities-10.jpg")} alt="logo" className={classes.subImage} />
                </div>
                {false && <KlccExperienceButton
                    key={'nextBtn'} 
                    text = {'NEXT'}
                    onClick={()=>{this.handleShowWhatUGet()}}
                />}
            </div>
        );
    // }
}

renderAngpauImage(){
  const {classes} = this.props;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:50}}>
          <img src ={require("../assets/CNYangpau.png")} alt="logo" style={{height:'250px'}} />
      </div>
  )
}

handleShowKeyInDetails = () => {
  this.setState({showFirst:false, showExperience:false, showWhatUGet:false, showKeyInDetails:true});
  window.scrollTo(0, 0);
}

handleShowExperience = () => {
    this.setState({showFirst:false, showExperience:true, showWhatUGet:false, showKeyInDetails:false});
    window.scrollTo(0, 0);
}

handleShowWhatUGet = () => {
    this.setState({showFirst:false, showExperience:false, showWhatUGet:true, showKeyInDetails:false});
    window.scrollTo(0, 0);
}


  render() {
      const {classes} = this.props;
      const {showLoading} = this.state;

      if (showLoading){
        return (this.renderLoading())
      }
      else{
        return(
          <div
            className={classes.container}
            // style= {{height:window.innerHeight}}
          >
            {this.renderBabelLogo()}
            {this.state.showFirst && this.renderLogoImg()}
            {this.state.showFirst && this.renderTitle()}
            {false && this.state.showFirst && <KlccExperienceButton
                key={'startBtn'} 
                text = {'START'}
                onClick={()=>{this.handleShowExperience()}}
              />}
            {this.renderExperience()}
            {this.renderWhatUGet()}
            {this.renderKeyInDetails()}
           
              <BabelLogo hideLogo={true} textColor={`#FFF`} fontStyle = {'montserrat'} hideTnC={true}/>

            
            {this.renderShowDialog()}
          </div>
        )
      }
    }
  }
  
  buyKLCCExperience.propTypes = {classes: PropTypes.object.isRequired};
  
  const buyKLCCExperienceStyled = withStyles(styles)(buyKLCCExperience);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getCnyRef = makeGetCnyRef();
      const getUsers = makeGetAllUsers();
      const getActiveMembers = makeGetActiveMemberItems();
      const getStaff = makeGetStaff();
      const test = null;
      return {
        staff: getStaff(state, props),
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        isFetchingEmail: state && state.state && state.state.get('isFetchingEmail') ? true : false,
        cnyRef: getCnyRef(state, props),
        users: getUsers(state, props),
        activeMember: getActiveMembers(state, props)
      }
    }
    return mapStateToProps
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyKLCCExperienceStyled)