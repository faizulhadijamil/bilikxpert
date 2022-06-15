import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import * as Actions from './actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import BabelLogo from './BabelLogo';
import Card, {CardContent,CardMedia} from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {CircularProgress} from 'material-ui/Progress';

import {
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText
} from 'material-ui';

import AddIcon from '@material-ui/icons/Add';
import Button from 'material-ui/Button';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/functions';

const cors = require('cors')({ origin: true });

const backGroundImg = 'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2Fwebsite-background-HQ-min.jpg?alt=media&token=c3d60661-8802-4cce-97fb-752c051f0e39';

let thereferralList = [];

const avatarImages = [
  {
    imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-08.png?alt=media&token=2a691a50-23bc-4746-9811-077af9bb82ae',
    key:1
  },
  {
      imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-02.png?alt=media&token=4f44bf8c-f657-47da-9986-4a5d8ce38b9f',
      key:2
  },
  {
    imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-01.png?alt=media&token=9fd61bce-18fe-43a6-98d8-8b722dfb82e2',
    key:3
  },
  {
      imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-03.png?alt=media&token=23ce1229-d0aa-45a7-9f45-f348654cc3a5',
      key:4
  },
  {
      imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-04.png?alt=media&token=30dca4d6-5585-432d-89b8-d73884edf02c',
      key:5
  },
  {
    imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-05.png?alt=media&token=15e57e03-6c80-4469-aef4-17724ff14f86',
    key:6,
  },
  {
    imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-07.png?alt=media&token=71ebf741-884d-4de8-b2fc-e6fffbdd2b0e',
    key:7
  },
  {
    imageLink:'https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/avatarReferralImg%2FAvatar-06.png?alt=media&token=af00e93a-4f46-4fe7-96e7-7fede2779315',
    key:8
  },
];

class Referral extends React.Component {

  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectAvatar = this.handleSelectAvatar.bind(this);
  }

    state = {
      email: '',
      name: '',
      phone: '',
      icnumber: '',
      className: '',
      referralListLayout:[],
      referralList:null,
      referralListCount:4,
      emailList:[],
      nameList:[],
      currentReferral:{
        email:'',
        name:''
      },

      userReferralInput:[{email:'',name:''},{email:'',name:''},{email:'',name:''},{email:'',name:''},{email:'',name:''}
      ],

      currentUserEmail: '',
      currentUserName: '',
      selectedAvatar:avatarImages[0].imageLink,

      email1:'',
      name1:'',
      email2:'',
      name2:'',
      email3:'',
      name3:'',
      email4:'',
      name4:'',
      email5:'',
      name5:'',

      showErrorDialog:false,
      showSuccessDialog:false,
      showLoading:false,
      errorMessage:''

    }

    componentDidMount(){

    }

    handleChange = name => event => {

      var updatedState = {};
      var theValue = [];
      // console.log('handleChangeName: ', name);

      var value = event.target.value;
      // console.log('theValue: ', value);
      if (name === 'email1' && value && value.length > 0) {
        value = value.toLowerCase();
        // theValue[index] = value.toLowerCase();
      }

      updatedState[name] = value;
     // console.log('updatedState: ', updatedState);

      this.setState({ ...updatedState});
    }

  //   handleChange(e) {
  //     this.setState({ [e.target.name] : e.target.value });
  //  }
   
    handleAddReferral = (email, name) =>{
      // console.log('theemail: ', email);
      // console.log('thename: ', name);
      
      if ((email.length<=4)||(name.length<=4)){
        //console.log('not valid');
        return;
      }
      this.setState({currentReferral:{email, name}});
      // console.log('currentReferral: ', this.state.currentReferral);
      thereferralList.push({email, name});
      this.setState({email:'', name:''});
      // console.log('thereferralList: ', thereferralList);
      // this.setState({
      //   referralListCount: (this.state.referralList===null)? 0: this.state.referralList.length+1,
      //   referralList:thereferralList,
      //   // emailList:this.state.emailList.push(email),
      //   // nameList:this.state.nameList.push(name)
      // });
      // console.log('thereferralState: ', this.state);
    }

    isValidRefUserEmail = (email) => {
      var isValidEmail = true;
      if ((email === '')||(email===' ')){
        return isValidEmail; // assume true
      }
      else{
        const lowerCaseEmail = email.toLowerCase();
        const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // console.log('emailMatch: ', emailMatch);
        var userEmail = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : email.toLowerCase();
        isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
        // console.log('isValidEmail: ', isValidEmail);
        return isValidEmail;
      }
    };

    isValidRefUserName = (name) => {
      var isValidName = true;
      if ((name === '')||(name===' ')||(name.length>=4)){
        return isValidName; // assume true
      }
      else {     
        return false;
      }
    };

    isValidRefEmailName = (email, name, index) => {
      const validMail = this.isValidRefUserEmail(email);
      const validName = this.isValidRefUserName(name);
      const valid = validMail && validName;
      const errorMsgMail = (!validMail)? `Oops! Error: Email ${email} is not valid. Please enter one that works :(`:null;
      const errorMsgName = (!validName)? `Oops!, Error: looks like you don't know ${name} so well. Please enter full name.`:null;
      const theObj = {
        email, name, index, validMail, validName, valid,
        errorMsgMail, errorMsgName
      };
      return theObj;
    };

    onSendReferralEmail = (currentUserEmail, currentUserName, selectedAvatar, referralUsers) =>{
      console.log('onSendReferralEmail: ', this.state);
      console.log('currentUserEmail: ', currentUserEmail);
      console.log('currentUserName: ', currentUserName);
      console.log('selectedAvatar: ', selectedAvatar);
      console.log('referralUsers: ', referralUsers);
      const{email1, name1, email2, name2, email3, name3, email4, name4, email5, name5} = referralUsers;
      const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
      const invalidNameTxt = `Oops!, Error: looks like you don't know friend so well. Please enter full name.`

      // error checking
      let isValidRefEmail1 = this.isValidRefUserEmail(email1);
      let isValidRefEmail2 = this.isValidRefUserEmail(email2);
      let isValidRefEmail3 = this.isValidRefUserEmail(email3);
      let isValidRefEmail4 = this.isValidRefUserEmail(email4);
      let isValidRefEmail5 = this.isValidRefUserEmail(email5);

      // let isValidRefName1 = this.isValidRefUserName(name1);
      // let isValidRefName2 = this.isValidRefUserName(name2);
      // let isValidRefName3 = this.isValidRefUserName(name3);
      // let isValidRefName4 = this.isValidRefUserName(name4);
      // let isValidRefName5 = this.isValidRefUserName(name5);

      // let isUserValid1 = this.isValidRefEmailName(email1, name1, 1);
      // let isUserValid2 = this.isValidRefEmailName(email2, name2, 2);
      // let isUserValid3 = this.isValidRefEmailName(email3, name3, 3);
      // let isUserValid4 = this.isValidRefEmailName(email4, name4, 4);
      // let isUserValid5 = this.isValidRefEmailName(email5, name5, 5);

      // console.log('isUserValid1: ', isUserValid1);

      if (email1.length<=3 && email2.length<=3 && email3.length <= 3 && email4.length <= 3 && email5.length <= 3){
        this.setState({showErrorDialog:true, errorMessage:`Please key in at least one email to proceed, don't be shy!`});
        return;
      }
      // if (isUserValid1.valid)
      if (!isValidRefEmail1 || !isValidRefEmail2 || !isValidRefEmail3 || !isValidRefEmail4 || !isValidRefEmail5){
        this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
        return;
      }
      // if (!isValidRefName1 || !isValidRefName2 || !isValidRefName3 || !isValidRefName4 || !isValidRefName5){
      //   this.setState({showErrorDialog:true, errorMessage:`Oops!, Error: looks like you don't know friend so well. Please enter full name.`});
      //   return;
      // }

      if (!selectedAvatar){
        selectedAvatar = avatarImages[0].imageLink; // if no avatar selected, default to the 1 avatar
      }

      // recreate the ref Obj;
      let referralUserObj = [];
      referralUserObj = [];
      if (this.isValidRefUserEmail(email1) && email1.length>3 && name1.length>1){
        referralUserObj.push({email:email1, name:name1});
      }
      if (this.isValidRefUserEmail(email2) && email2.length>3 && name2.length>1){
        referralUserObj.push({email:email2, name:name2});
      }
      if (this.isValidRefUserEmail(email3) && email3.length>3 && name3.length>1){
        referralUserObj.push({email:email3, name:name3});
      }
      if (this.isValidRefUserEmail(email4) && email4.length && name4.length>1){
        referralUserObj.push({email:email4, name:name4});
      }
      if (this.isValidRefUserEmail(email5) && email5.length && name5.length>1){
        referralUserObj.push({email:email5, name:name5});
      }

      // console.log('referralUserObj: ', referralUserObj.length);

      if (currentUserEmail && currentUserEmail.length>5 && currentUserName && currentUserName.length>2 && 
        selectedAvatar && selectedAvatar.length>5 && referralUserObj.length>=1){
          this.setState({showLoading:true}); // to show overlay loading
          // const userEmailRef = firebase.functions().httpsCallable('sendReferralEmail');
          const userEmailRef = firebase.functions().httpsCallable('sendRefEmail');
          // console.log('userEmailRef: ', userEmailRef);
          return userEmailRef({currentUserEmail, currentUserName, selectedAvatar, referralUserObj}).then(result=>{
            // console.log('theresult: ', result);
            const {data} = result;
            // clear all textboxt 
            this.setState({email1:'',name1:'',email2:'',name2:'',email3:'',name3:'',email4:'',name4:'',email5:'',name5:''});
            // show success message
            if (data.success){
              this.setState({showSuccessDialog:true, showLoading:false});
            }
            else{
              // todo should show error message
              this.setState({showSuccessDialog:true, showLoading:false});
            }
            // this.setState({})
          });
      }
      else{
        console.log('Please Enter a valid  referral email!');
        this.setState({showErrorDialog:true, errorMessage:'Error sending the email'});
      }


      // console.log('theprops: ', this.props);

      // this.props.actions.sendreferralEmail(currentUserEmail, currentUserName, selectedAvatar, referralUsers);
      // this.props.actions.addFreeze();

    }

    renderTextField = () =>{
      const { classes } = this.props;
      const {currentReferral} = this.state;
      const {email, name} = currentReferral;
      let index = currentReferral.length;

      let referralListLayout = [];
      const TextFieldEmail = <TextField
                            id="email"
                            label="Email*"
                            fullWidth
                            onChange={this.handleChange('email')}
                            autoComplete='off'
                            value={email}
                            style={{marginBottom:8}}
                          />;
        const TextFieldName = <TextField
                            id="name"
                            label="Full Name (as stated in your IC/Passport) *"
                            fullWidth
                            onChange={this.handleChange('name')}
                            autoComplete='off'
                            value={name}
                            style={{marginBottom:8}}
                          />;
        let addBtn =  <div style= {{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button fab className={classes.fab} color='primary' onClick={()=>this.handleAddReferral(email, name, index)}>
                          <AddIcon/>
                        </Button>
                      </div>
        
      return(
        <div className={classes.contentInner}>
            {TextFieldEmail}
            {TextFieldName}
            {addBtn}  
        </div> 
      )                    
    }

    // renderCarousel = () => {

    //   return (
    //     <Carousel 
    //       responsive={{
    //         desktop: {
    //           breakpoint: {
    //             max: 3000,
    //             min: 1024
    //           },
    //           items: 3,
    //           partialVisibilityGutter: 40
    //         },
    //         mobile: {
    //           breakpoint: {
    //             max: 464,
    //             min: 0
    //           },
    //           items: 1,
    //           partialVisibilityGutter: 30
    //         },
    //         tablet: {
    //           breakpoint: {
    //             max: 1024,
    //             min: 464
    //           },
    //           items: 2,
    //           partialVisibilityGutter: 30
    //         }
    //       }}
    //     >
    //       <div>Item 1</div>
    //       <div>Item 2</div>
    //       <div>Item 3</div>
    //       <div>Item 4</div>
    //     </Carousel>
    //   );
    // }

    handleSelectAvatar = (imageLink) => {
      console.log('handleSelectAvatar: ', imageLink);
    }

    // renderRefInput = (TextFieldEmail, TextFieldName, index=1) => {
    renderRefInput = (email, name, index=1) => {
      const {classes} = this.props;
      const {email1, name1, email2, name2, email3, name3, email4, name4, email5, name5} = this.state;

      // console.log('theIndex:', index);
      const TextFieldEmailLayout = <TextField
                            id={email}
                            label="Email*"
                            fullWidth
                            onChange={this.handleChange(email)}
                            autoComplete='off'
                            value={email}
                            style={{marginBottom:8}}
                          />;

      const TextFieldNameLayout = <TextField
                          id={name}
                          label="Full Name (as stated in your IC/Passport) *"
                          fullWidth
                          onChange={this.handleChange('name')}
                          autoComplete='off'
                          value={name}
                          style={{marginBottom:8}}
                        />;

      return(
        <div 
          className={classes.contentInner}
          style={{marginBottom:10, borderRadius:10, borderColor:'#ccc', border:'#ccc', padding:10}}
          >
            <p>Friend {index}</p>
            {TextFieldEmailLayout}
            {TextFieldNameLayout}
        </div>
      )
    }

  renderTxtField = (id, label, name, value) => {
    const {classes} = this.props;
    return(
      <TextField
        id={id}
        label={label}
        fullWidth
        onChange={this.handleChange(name)}
        autoComplete='off'
        value={value}
        style={{marginBottom:8}}
        className={classes.fontRegularWhite}
        InputProps={{
          className: classes.fontRegularWhite,
      }}
      />
    )
  }

  renderCardLayout = (friendText, TextFieldEmail, TextFieldName) => {
    const {classes} = this.props;
    return(
      <div 
        className={classes.contentInner}
        style={{marginBottom:10, borderRadius:10, paddingBottom:10, border: '1.5px solid white', paddingLeft:50, paddingRight:50}}
        >
        <p className = {classes.regularTxt} style = {{fontSize:15}} >{friendText.toUpperCase()}</p>
        {TextFieldEmail}
        {TextFieldName}
    </div>
    )
  }

  onClickThumb = (index) => {
    console.log('onClickThumb: ', index);
  };

  onCarouselChange = (index) => {
    console.log('onCarouselChange: ', index);
    this.setState({selectedAvatar:avatarImages[index].imageLink});
  };

  handleCloseDialog = () => this.setState({showErrorDialog:false, showSuccessDialog:false});

  renderShowDialog = (message) => {
    const {classes} = this.props;
    return(
      <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showErrorDialog}>
        <DialogContent 
          style = {{backgroundColor:'#d4c5b9', borderRadius:10, paddingBottom:10, border: '1.5px solid white', paddingLeft:50, paddingRight:50}}
          className = {classes.contentInner}
          >
          <Typography 
            style={{textAlign:'center', marginBottom:20}}
            className={classes.fontRegularWhite}
            >
            {message}
          </Typography>
          <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
            <Button 
              raised color='primary' 
              key={'okButton'} 
              className={classes.fontRegularWhite}
              style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#d4c5b9'}} 
              onClick={()=>this.setState({showErrorDialog:false})}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  renderShowSuccessDialog = () => {
    const {classes} = this.props;
    return(
      <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showSuccessDialog}>
        <DialogContent 
          style = {{backgroundColor:'#d4c5b9', borderRadius:10, paddingBottom:10, border: '1.5px solid white', paddingLeft:50, paddingRight:50}}
          className = {classes.contentInner}
          >
          <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginBottom:8}}>
            Success! Once they sign up we'll seal the deal ;)
          </Typography>
          <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
            <Button 
              raised color='primary' 
              key={'okButton'} 
              style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center'}} 
              className={classes.fontRegularWhite}
              onClick={this.handleCloseDialog}
              >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  };

  renderLoading(){
    return( <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>);
  }

  thumbAvatarClick = (imageLink) => {
    this.setState({selectedAvatar:imageLink});
  };

  renderAvatar(currentUserName){
    const {classes} = this.props;

    var avatarLayout = [];
    avatarImages && avatarImages.forEach(img=>{
      const bgColor = (img.imageLink === this.state.selectedAvatar)? '#fff':'#d4c5b9';
      const borderStyle = (img.imageLink === this.state.selectedAvatar)? '1.4px solid white':null;
      const borderRad = (img.imageLink === this.state.selectedAvatar)? 6:0;

      avatarLayout.push(
        <div 
          key = {img.key} 
          onClick = {()=>this.thumbAvatarClick(img.imageLink)}
        >
          <img src = {img.imageLink} style = {{alignItems:'center', justifyContent:'center', border: borderStyle, borderRadius: borderRad, width:'100%',maxWidth:'130px'}}/>
      </div>
      )
    });

    return(
      <div 
        className={classes.contentOuter}
        style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}
        >
        <img src = {this.state.selectedAvatar} style = {{alignItems:'center', justifyContent:'center', backgroundColor:'#d4c5b9', width:'80%', maxWidth:'600px'}}/>
        <Typography 
          className={classes.fontBold}
          style={{textAlign:'center', marginBottom:25, fontSize:25, letterSpacing:3, marginTop:-10}}>
            {currentUserName.toUpperCase()}
        </Typography>
        <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'row'}}>
          {avatarLayout}
        </div>
      </div>
    );
  }

  render(){
        const {classes} = this.props;
        // const {currentReferral} = this.state;
        const {email, name} = this.state;
        const {email1, name1, email2, name2, email3, name3, email4, name4, email5, name5} = this.state;
        
        // let index = currentReferral.length;
        // const userEmail = 'faizul@gmail.com';
        // const userName = 'faizul kacak';

        const urlSearchString = this.props.location.search;
        const urlEmailandName = urlSearchString && urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;

        const currentUserEmailandName = urlEmailandName && urlEmailandName.split('&name=');

        const currentUserEmail = currentUserEmailandName && currentUserEmailandName[0] || '';
        let currentUserName = currentUserEmailandName && currentUserEmailandName[1] || '';
        currentUserName = currentUserName.replace(/%20/g, " ");
        // console.log('currentUserEmail: ', currentUserEmail.length);
        // console.log('currentUserName: ', currentUserName);

        // console.log('referralListCount: ', this.state.referralListCount);
        let referralListCount = this.state.referralListCount;
        let referralListLayout = [];

        let addBtn =  
                  <div style= {{ display: 'flex', justifyContent: 'flex-end'}}>
                    <Button fab className={classes.fab} color='primary' onClick={()=>this.handleAddReferral(email, name)}>
                      <AddIcon/>
                    </Button>
                  </div>

        const emailTxt = 'Email*';
        const nameTxt = 'Full Name*';

        const TextFieldUserEmail = this.renderTxtField('currentUserEmail', emailTxt, 'currentUserEmail', currentUserEmail);
        const TextFieldUserName = this.renderTxtField('currentUserName', nameTxt, 'currentUserName', currentUserName);  

        const TextFieldEmail1 = this.renderTxtField('email1', emailTxt, 'email1', email1); 
        const TextFieldName1 = this.renderTxtField('name1', nameTxt, 'name1', name1); 
        const TextFieldEmail2 = this.renderTxtField('email2', emailTxt, 'email2', email2); 
        const TextFieldName2 = this.renderTxtField('name2', nameTxt, 'name2', name2); 
        const TextFieldEmail3 = this.renderTxtField('email3', emailTxt, 'email3', email3); 
        const TextFieldName3 = this.renderTxtField('name3', nameTxt, 'name3', name3); 
        const TextFieldEmail4 = this.renderTxtField('email4', emailTxt, 'email4', email4); 
        const TextFieldName4 = this.renderTxtField('name4', nameTxt, 'name4', name4); 
        const TextFieldEmail5 = this.renderTxtField('email5', emailTxt, 'email5', email5); 
        const TextFieldName5 = this.renderTxtField('name5', nameTxt, 'name5', name5); 

        const referralInput = 
                <div>
                  {false && (currentUserEmail.length<=1) && this.renderCardLayout('Member Details', TextFieldUserEmail, TextFieldUserName)}
                  {this.renderCardLayout('Friend 1', TextFieldEmail1, TextFieldName1)}
                  {this.renderCardLayout('Friend 2', TextFieldEmail2, TextFieldName2)}
                  {this.renderCardLayout('Friend 3', TextFieldEmail3, TextFieldName3)}
                  {this.renderCardLayout('Friend 4', TextFieldEmail4, TextFieldName4)}
                  {this.renderCardLayout('Friend 5', TextFieldEmail5, TextFieldName5)}
                </div>;

        // for (let i=0; i<=referralListCount; i++){
        //   // referralListLayout.push(referralInput);
        //   // referralListLayout.push(this.renderRefInput(TextFieldEmail, TextFieldName, i+1));
        //   referralListLayout.push(this.renderRefInput(email, name, i+1));
        // }        

        // referralListLayout.push(this.renderRefInput(email1, name1, 1));
        // referralListLayout.push(this.renderRefInput(email2, name2, 2));
        // referralListLayout.push(this.renderRefInput(email3, name3, 3));
        // referralListLayout.push(this.renderRefInput(email4, name4, 4));
        // referralListLayout.push(this.renderRefInput(email5, name5, 5));

        referralListLayout.push(referralInput);

        let imgLayout = [];

        const avatarLayout = 
        <div>
            <Typography 
              // className = {classes.fontItalic}
              className = {classes.extraLight}
              style={{textAlign:'center', marginBottom:12, fontSize:'1.3rem', marginTop:7}}>
                CHOOSE YOUR CHARACTER
            </Typography>
            <div 
                style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'center'}}
            >
                {false && <div 
                  className={classes.contentOuter}
                  // style = {{justifyContent:'center', alignItems:'center', width:'70%'}}
                  >
                    {false && <Carousel
                      style = {{alignItems:'center', justifyContent:'center'}}
                      selectedItem = {0}
                      // showArrows={true}
                      showStatus={false}
                      showIndicators={false}
                      showArrows={false}
                      // autoPlay={true}
                      // onClickItem = {()=>{this.onImgClick(item)}}
                      // onClickItem = {this.onImgClick}
                      // onClickThumb = {(index)=>this.onClickThumb(index)}
                      onChange = {(index)=>{this.onCarouselChange(index)}}
                      thumbWidth={20}
                      emulateTouch={true}
                      >
                      {true && imgLayout}
                    </Carousel>}
                </div>}
                {this.renderAvatar(currentUserName)}
            </div>
            {false && <Typography 
              className={classes.fontBold}
              style={{textAlign:'center', marginBottom:25, fontSize:25, letterSpacing:3}}>
                {currentUserName.toUpperCase()}
            </Typography>}
            {false && <Typography 
              className={classes.fontBold}
              style={{textAlign:'center', marginBottom:15}}>
                {currentUserName}
            </Typography>}
            <Typography 
              className={classes.regularTxt}
              style={{textAlign:'center', marginBottom:30, marginTop:20}}>
                {'Refer your friends now by entering their names & email addresses'}
            </Typography>
        </div>;

        const referralUsers = {
          email1, name1, email2, name2, email3, name3, email4, name4, email5, name5,
        }

        const sendButton =  <Button 
          variant="contained"
          raised 
          color='primary' 
          key={'sendReferralEmail'} 
          classes={{raisedPrimary:classes.sendButton}} 
          style = {{alignItems:'center', justifyContent:'center', color:'white' }}
          onClick={()=>this.onSendReferralEmail(currentUserEmail, currentUserName, this.state.selectedAvatar, referralUsers)}>SEND</Button>

        if (this.state.showLoading){
          return(
            <div 
              className={classes.container}
              style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}
              >
              {this.renderLoading()}
            </div>
          )
        }
        else{
          return(
            <div 
              className={classes.container}
              // style = {{
              //   backgroundImage: `url("${backGroundImg}")`,
              //   backgroundPosition: 'center',
              //   backgroundSize: 'cover',
              //   backgroundRepeat: 'no-repeat'
              // }}
              >
              <Card className={classes.content} elevation={0} style = {{backgroundColor:'#d4c5b9'}}>
                <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                  <img src ={require("../src/assets/babelLogo_white.png")} alt="logo" style={{width:90, height:90, marginTop:50}} />
                </div>
                <CardContent style = {{}} >
                  <div style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                      <Typography 
                        className = {classes.fontBold}
                        style={{textAlign:'center', fontSize:'1.7rem', letterSpacing:3, marginTop:20}}>
                          PERSONALISE YOUR REFERRALS
                      </Typography>
                      {avatarLayout}
                      {false && this.renderTextField()}
                      {referralListLayout}
                      {sendButton}
                      {false && this.renderCarousel()}
                      {false && this.renderCarouselResponsive()}
                  </div>
                  <BabelLogo
                    hideLogo = {true}
                    textColor = {'#fff'}
                  />
                </CardContent>
              </Card>
              {this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
              {this.state.showSuccessDialog && this.renderShowSuccessDialog()}
            </div>
          ); 
        }
    }
}

const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      // overflow: 'hidden',
      // backgroundImage: `url("${backGroundImg}")`,
      // backgroundPosition: 'center',
      // backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat'
    },
    formContainer: {
      // display: 'flex',
      // flexWrap: 'wrap'
    },
    regularTxt:{
      color:'#fff', 
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize:15.6,
      letterSpacing:0
    },
    fontBold:{
      color:'#fff', 
      fontFamily: "Montserrat",
      // fontFamily :'sans-serif', 
      fontWeight: 800,
    },
    fontRegularWhite:{
      fontFamily: "Montserrat",
      fontWeight: 400,
      fontSize:15,
      color:'#fff'
    },
    fontBoldBlack:{
      fontFamily: "Montserrat",
      fontWeight: 800,
      fontSize:15,
      color:'#fff'
    },
    extraLight:{
      fontFamily: "Montserrat",
      // fontFamily :'sans-serif', 
      fontWeight: 200,
      color:'#fff',
    },
    fontItalic:{
      color:'#fff', fontFamily :'sans-serif', fontWeight: 700, fontStyle:'italic',
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
      maxWidth: 10 * 50,
      marginRight: 'auto',
      marginLeft: 'auto',
      alignItems:'center',
      justifyContent:'center',
      boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    contentOuter:{
      maxWidth: '90%',
      marginRight: 'auto',
      marginLeft: 'auto',
      alignItems:'center',
      justifyContent:'center',
      // boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    button: {
      fontSize: "1.2rem",
      textTransform: "uppercase",
      fontWeight: 700,
      fontStyle:'italic',
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
      minWidth: 28,
      // width: '100%',
      boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      // justifyContent: 'flexEnd'
    },
    sendButton:{
      fontSize: 13,
      textTransform: "uppercase",
      fontWeight: 400,
      fontFamily: "Montserrat",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#d4c5b9",
       color: '#fde298 ',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 50,
      paddingRight: 50,
      borderRadius: 5,
      minHeight: 36,
      minWidth: 28,
      // border: '5px solid white',
      // width: '100%',
      boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
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
    fab: {
      // position: 'fixed',
      // bottom: 56 + theme.spacing(2),
      // right: theme.spacing(2),
      // zIndex: 1300
      alignItems:'flexEnd',
    },
  });

// export default Referral

Referral.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
const ReferralStyled = withStyles(styles)(Referral);

// const mapStateToProps = (state, ownProps) => ({
//   ...state
// });

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    var items = [];
    // switch (props.type) {
    //   case 'vendCustomers':{
    //     items = [];
    //     break;
    //   }
    //   default:{
    //     items = [];
    //   }
    // }
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
  
export default connect(makeMapStateToProps, mapDispatchToProps)(ReferralStyled)