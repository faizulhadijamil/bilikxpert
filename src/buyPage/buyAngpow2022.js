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
        backgroundColor:'#600E0A',
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
        color:'#E8C888', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        fontSize:15.6,
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
      }
  });
  
  const angPauPkgIds = [
    {
      packageId:'hhForDFr6YIbSQNgkUcF', // all access
      vendProdId:'51644068-46f7-46a0-8704-4de89d5b89e3'
    },
    {
      packageId:'GjzBC8zwfUTDuefjMDQi', // single access (TTDI)
      vendProdId: '152eea01-07e2-44bb-99f5-f5709db96bb9'
    }
  ];

  var ismobile = window.innerWidth<=550?true:false;

  class buyAngpow2022 extends React.Component {
  
    state = {
      email: '',
      name: '',
      phone: '',
      isGuest:false,
      emailVerified:false,
      refSource: null,
      postcode:'',
      mcId: null,
      selectedPkgId:angPauPkgIds[1], //single access
      showEmailInput:false,
      refererEmail:'',
      achieveTargetSource:null,
      showKeyInDetails:false,
      dialogOpen:false,
      // icnumber: '',
      // className: '',
      // classDate: '',
      // dialogOpen: false,
      // checked:false,
      // checkedPromo:false,
      // refSource: null,
      // mcId: null,
      // currentUserEmail:'',
      // currentUserName:'',
      // referralUsers:[],
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

  handleCreateInvoice = () => {
    console.log('theState: ', this.state);
    const {name, phone, postcode, refSource, achieveTargetSource, refererEmail, selectedPkgId} = this.state;
    const inValidName = (!name || name.length<=5);
    const inValidPhone = (!phone || phone.length<8);
    const inValidPostCode = (!postcode || postcode < 4);
    const inValidRefSource = (!refSource || refSource <4);
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidRefererEmail = this.isValidEmail(refererEmail);
    console.log('isValidEmail: ', isValidEmail);
    console.log('isValidRefererEmail: ', isValidRefererEmail);
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
    if (!isValidRefererEmail){
      console.log('invalid referrer email: ', refererEmail);
      this.setState({dialogOpen:true, errorMessage:invalidRefErrorMsg});
      return;
    }
    if (!selectedPkgId){
      console.log('invalid selectedPkgId: ', selectedPkgId);
      this.setState({dialogOpen:true, errorMessage:invalidPkgIdMsg});
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

    if (isValidEmail && isValidRefererEmail && !inValidName && !inValidPhone && !inValidPostCode){
      this.setState({showLoading:true});
      const selectedVendPkgId = selectedPkgId? selectedPkgId.vendProdId:null;
      // todo create invoice
      // this.props.actions.addInvoiceForAngpau(email, name, phone, null, refSource, achieveTargetSource, selectedVendPkgId, (result) => {
      console.log('email: ', this.state.email);
      this.props.actions.getUsernRefDataByEmail(this.state.email, refererEmail, (result) => {
        console.log('fetchMethodsForEmail: ', result);
        const success = result.success;
        const user = result.user;
        const membershipStart = (user && user.autoMembershipStarts)? user.autoMembershipStarts: (user && user.membershipStarts) ? user.membershipStarts:null;
        const membershipEnd = (user && user.autoMembershipEnds)? user.autoMembershipEnds: (user && user.membershipEnds)? user.membershipEnds:null;
        const packageId = user && user.packageId? user.packageId:null;
        const isMember = packageId && membershipEnd && membershipStart;
        const userRefIsMember = result.userRefIsMember; 
        const userRef = result.userRef;
        const userRefName = userRef && userRef.name;
        console.log('userRefName: ', userRefName);
        console.log('theuser: ', user);

        // for new guest or existing guest
        const isGuest = !isMember;
        console.log('isGuest: ', isGuest);
        const errorMsg = result.message;
        this.setState({emailVerified: true, isGuest});
        if ((isGuest && userRefIsMember) || (!user)){
          this.props.actions.addInvoiceForAngpau(this.state.email, name, phone, null, null, achieveTargetSource, selectedPkgId, refererEmail, userRefName, (result) => {
            console.log('result: ', result);
            this.setState({showLoading:false});
          });
        }
        else{
          this.setState({showLoading:false, dialogOpen:true, errorMessage:errorMsg? errorMsg:'You are not eligible for this package'})
        }
      });
      
      
    }
  }

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap });
  }

  handleSelectSingleAccess = () => {
    this.setState({
      selectedPkgId:angPauPkgIds[0],
      showEmailInput:true
    })
  }

  handleSelectAllAccess = () => {
    this.setState({
      selectedPkgId:angPauPkgIds[1],
      showEmailInput:true
    })
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

renderLogoImg(){
  const {classes} = this.props;
  const {isMobile} = this.state;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:50, marginTop:50}}>
          <img src ={require("../assets/babellogoangpow.png")} alt="logo" style={{height: isMobile? '50px':'70px'}} />
      </div>
  )
}

renderTitle(){
  const {classes} = this.props;
  return(
      <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:50}}>
          <img src ={require("../assets/wishyougetfit.png")} alt="logo" style={{height:'30px'}} />
      </div>
  )
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
  this.setState({
    showKeyInDetails:true
  })
}

  render() {
      const {classes} = this.props;
      const {isGuest, emailVerified, showEmailInput, showLoading, refererEmail, isMobile, showKeyInDetails, selectedPkgId} = this.state;
      const fullNameLabel = 'Full Name (as stated on your IC/Passport)';
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

      const TextFieldEmail = <TextField id="email" label="Your Email*" fullWidth
        onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8}}
        disabled = {emailVerified && isGuest}
        />;

      const TextFieldRefererEmail = <TextField id="refererEmail" label="Referrer Email*" fullWidth
        onChange={this.handleChange('refererEmail')} autoComplete='off' value={refererEmail} style={{marginBottom:8}}
        // disabled = {emailVerified && isGuest}
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

      if (showLoading){
        return (this.renderLoading())
      }
      else{
        return(
          <div
            className={classes.container}
            // style= {{height:window.innerHeight}}
          >
            {this.renderLogoImg()}
            {this.renderTitle()}
            {!showKeyInDetails && this.renderAngpauImage()}
            
            {!showKeyInDetails && <Typography 
                  className={classes.boldMontSerrat}
                  type="subheading" component="h1" noWrap={true}
                  style={{textAlign:'center', marginTop:0, marginBottom:0, fontSize:isMobile? '0.8rem':'1.1rem'}}>
                  {'GET 1 MONTH MEMBERSHIP FOR ONLY RM1!'}
            </Typography>}
            {!showKeyInDetails && <Typography 
                  className={classes.mediumMontSerrat}
                  type="subheading" component="h1" noWrap={true}
                  style={{textAlign:'center', marginTop:20, marginBottom:40, fontSize:isMobile? '0.8rem':'1.1rem'}}>
                  {'*Valid for redemption 1 Feb - 28 Feb 2022'}
            </Typography>}
            {showKeyInDetails && <Typography 
                  className={classes.boldMontSerrat}
                  type="subheading" component="h1" noWrap={true}
                  style={{textAlign:'center', marginTop:0, marginBottom:30, fontSize:isMobile? '1.1rem':'1.1rem'}}>
                  {'PLEASE SELECT YOUR MEMBERSHIP'}
            </Typography>}

              {showKeyInDetails && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center', marginLeft:20, marginRight:20}}>
                <div style = {{padding:10, backgroundColor: (selectedPkgId === angPauPkgIds[0])? 'white' : 'black', cursor:'pointer', paddingLeft:20, paddingRight:20, margin:10, width:'38%', marginBottom:20}}
                  onClick = {()=>{this.setState({selectedPkgId:angPauPkgIds[1]})}}
                >
                  <Typography 
                      className={classes.boldMontSerrat}
                      type="subheading" component="h1" noWrap={true}
                      style={{textAlign:'center', marginTop:0, color:'black', fontSize:isMobile? '0.8rem':'1.1rem', spacing:0, color: (selectedPkgId === angPauPkgIds[0])? 'black' : 'white',}}>
                      {'Single Access'}
                  </Typography>
                  <Typography 
                      className={classes.boldMontSerrat}
                      type="subheading" component="h1" noWrap={true}
                      style={{textAlign:'center', color:'black', fontSize:isMobile? '0.8rem':'1.1rem', spacing:0, color: (selectedPkgId === angPauPkgIds[0])? 'black' : 'white'}}>
                      {'TTDI'}
                  </Typography>
                </div>
               
                <div style = {{padding:10, backgroundColor: (selectedPkgId === angPauPkgIds[1])? 'white' : 'black', cursor:'pointer', paddingLeft:20, paddingRight:20, margin:10, width:'38%', marginBottom:20}}
                   onClick = {()=>{this.setState({selectedPkgId:angPauPkgIds[0]})}}
                >
                  <Typography 
                      className={classes.boldMontSerrat}
                      type="subheading" component="h1" noWrap={true}
                      style={{textAlign:'center', marginTop:0, color:'black', fontSize:isMobile? '0.8rem':'1.1rem', spacing:0, color:(selectedPkgId === angPauPkgIds[1])? 'black' : 'white'}}>
                      {'All Access'}
                  </Typography>
                  <Typography 
                      className={classes.boldMontSerrat}
                      type="subheading" component="h1" noWrap={true}
                      style={{textAlign:'center', color:'black', fontSize:isMobile? '0.8rem':'1.1rem', spacing:0, color:(selectedPkgId === angPauPkgIds[1])? 'black' : 'white'}}>
                      {'TTDI & KLCC'}
                  </Typography>
                </div>
              </div>}

              {showKeyInDetails && <Typography 
                  className={classes.boldMontSerrat}
                  type="subheading" component="h1" noWrap={true}
                  style={{textAlign:'center', marginTop:20, marginBottom:30, fontSize:isMobile? '1.1rem':'1.1rem'}}>
                  {'PLEASE FILL THE FORM'}
            </Typography>}

              {showKeyInDetails && <div style = {{backgroundColor:'white', padding:10, width:'85%', maxWidth:'600px', paddingBottom:30}}>
                
                {TextFieldEmail}
                {/* {this.renderBtn()} */}
                {false && !isGuest && emailVerified && <p>{'already member'}</p>}
                {nameTextInput}
                {phoneTextInput}
                {TextFieldRefererEmail}
                {false && !this.state.refSource && <IntegrationAutosuggest selections='referralSource' placeholder={howDidUknowLabel} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>}
                {false && this.state.refSource && 
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

              </div>}

              {!showKeyInDetails && <AngpauButton
                key={'nextBtn'} 
                text = {'NEXT'}
                onClick={()=>{this.handleShowKeyInDetails()}}
              />}
              {showKeyInDetails && <AngpauButton
                key={'nextPaymentPage'} 
                text = {'NEXT'}
                onClick={()=>{this.handleCreateInvoice()}}
                style = {{marginTop:30}}
              />}
              <BabelLogo hideLogo={true} textColor={`#E8C888`} fontStyle = {'montserrat'}/>

              {/* <StdButton  
                  key={'single'} 
                  onClick={()=>{this.handleSelectSingleAccess()}}
                  text={'SINGLE ACCESS'}
              />
              <StdButton  
                  key={'allAccess'} 
                  onClick={()=>{this.handleSelectAllAccess()}}
                  text={'ALL ACCESS'}
              />

              {TextFieldRefererEmail}
              {TextFieldEmail}
              {/* {this.renderBtn()} */}
            
            
              {false && <StdButton  
                  key={'CreateUser'} 
                  onClick={()=>{this.handleCreateInvoice()}}
                  // disabled={!isValidEmail || this.props.isFetchingEmail}
                  text={'NEXT'}
                  style = {{marginTop:30}}
              />}
            {this.renderShowDialog()}
          </div>
        )
      }

    }

  }
  
  buyAngpow2022.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const buyAngpow2022Styled = withStyles(styles)(buyAngpow2022);
  
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
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyAngpow2022Styled)