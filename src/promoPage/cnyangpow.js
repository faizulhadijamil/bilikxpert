import {
    CircularProgress
  } from 'material-ui/Progress'
  import {
    Dialog,
    DialogActions,
    DialogContent,
    List,
  } from 'material-ui';
  import {
    bindActionCreators
  } from 'redux';
  import {
    connect
  } from 'react-redux';
  import {
    withStyles
  } from '@material-ui/core';
  import Button from 'material-ui/Button';
  import Grid from 'material-ui/Grid';
  import React from 'react';
  import TextField from 'material-ui/TextField';
  import Typography from 'material-ui/Typography';
  import BabelLogo from '../BabelLogo';
  import PropTypes from 'prop-types';
  import moment from 'moment-timezone';
  
  import {
    makeGetCnyRef,
    makeGetAllUsers,
    makeGetActiveMemberItems,
  } from '../selectors';
  import * as Actions from '../actions';

  import * as firebase from 'firebase';
  import 'firebase/firestore';

  const goldCNYText = 'https://sandbox-uploads.imgix.net/u/1579418740-94263e760630f52c9fe14cdd1773784c';
  const goldCNYText2 = 'https://sandbox-uploads.imgix.net/u/1579510510-9f582c85e09199a5850c6d0b8ef602ab';
  const backgroundImg = 'https://sandbox-uploads.imgix.net/u/1579262899-a8b74e3e85fed0504d7847cc3e10c3b6';
  const babelGoldLogo = require('../assets/babelGoldLogo.png');
  const avatarImages = [
    {
      imageLink:'https://sandbox-uploads.imgix.net/u/1579367001-85ecd3ce9bcb67c70825b62e28c0f031',
      key:1
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579367057-b15039d63d8ec893ba38416637dbd415',
        key:2
    },
    {
      imageLink:'https://sandbox-uploads.imgix.net/u/1579367108-0654acdc8765945d1f72f0a188b973df',
      key:3
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579367140-e70db81119efb2e9a0c8a077bbfc1085',
        key:4
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579367168-46ebbe8b13f13fc7396ef0d3f64ec7cb',
        key:5
    },
    {
      imageLink:'https://sandbox-uploads.imgix.net/u/1579367207-faa3fc4377ba6ade90d63bebbab24ac0',
      key:6,
    },
    {
      imageLink:'https://sandbox-uploads.imgix.net/u/1579367290-e1e2c403ef68516ef6c11392d6606930',
      key:7
    },
    {
      imageLink:'https://sandbox-uploads.imgix.net/u/1579367329-b27a51cb6a04e0711826ba8eba155e69',
      key:8
    },
    {
        imageLink: 'https://sandbox-uploads.imgix.net/u/1579355490-b50c0f7f1a12cb8610cbb1a8488149ca',
        key:9
    },
    {
        imageLink: 'https://sandbox-uploads.imgix.net/u/1579355555-8636f984ea5b405f12239c0c31fb845e',
        key:10
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579418503-d03ab6b42fec34404f9a0deedcc0e629',
        key:11
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579418569-2603ad56c5a71e0be9a27a31fbbde45a',
        key:12
    }
  ];

  const angPowBG = [
    {
          imageLink:'https://sandbox-uploads.imgix.net/u/1579418846-ba50b28ef94bebb464b07dcb5ceda7dc',
          color:'#730202', // red
          key:1
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579418802-3e5898f37d407e517cba5edd4bf86f2e',
        color:'#BC7773', //pink
        key:2
    },
    {
        imageLink:'https://sandbox-uploads.imgix.net/u/1579418891-b7bb0eb66a73f161717ac85f5c4242e1',
        color:'#193454', //blue
        key:3
    },
  ];

  const styles = theme => ({
    container: {
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundImage: `url("${backgroundImg}")`,
        // backgroundPosition: 'center',
        backgroundSize: 'cover',
        // height:'100%',
        backgroundRepeat:'repeat-y'
        // backgroundRepeat: 'no-repeat',
        // position:'fixed',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      //  overflow: 'hidden',
    //   // maxWidth: theme.spacing(7)5,
    //   marginLeft: 'auto',
    //   marginRight: 'auto',
    //   // paddingTop: theme.spacing(8),
    //   marginTop: theme.spacing(5),
    //   // paddingBottom: theme.spacing(10),
    //   padding: 16
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
        color:'#fff', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        fontSize:15.6,
        // letterSpacing:0
    },
    boldMontSerrat:{
        color:'#fff', 
        fontFamily: "Montserrat",
        // fontFamily :'sans-serif', 
        fontWeight: 800,
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
  
  class cnyangpow extends React.Component {
  
    state = {
      email: '',
      name: '',
      phone: '',
      icnumber: '',
      className: '',
      classDate: '',
      dialogOpen: false,
      checked:false,
      checkedPromo:false,
      refSource: null,
      mcId: null,
      currentUserEmail:'',
      currentUserName:'',
      selectedAvatar:avatarImages[0].imageLink,
      selectedAngPowCover:angPowBG[0].imageLink,
      referralUsers:[],
        isMobile: false,
        showReferralLayout:false,
        showSaveButton:true,
        userReferralInput:[{email:'',name:''}],

        showErrorDialog:false,
        isSubmitted: false,
        showLoading:false,
        showSuccessPage:false,
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

      const userData = firebase.firestore().collection('users').where("email", "==", currentUserEmail).limit(1).get();
      const cnyRefData = firebase.firestore().collection('cnyReferralList').where("email", "==", currentUserEmail).limit(1).get();

      var theUserData = [];
      userData.then((querySnapshot)=>{
        querySnapshot.forEach(doc=>{
          console.log(doc.id, '=>', doc.data());
          theUserData.push(doc.data());
        });
        this.setState({theUser:theUserData});
      }).catch(function (error) {
        this.setState({ theUser: null });
        console.log("Error getting document:", error);
      });

      // cnyData.then((querySnapshot)=>{

      // });
      // userData.then((doc)=>{
      //   if (doc.exists) {
      //     let data = doc.data();
      //     this.setState({ theUser: data });
      //     console.log("Document data:", data);
      //   } else {
      //     // doc.data() will be undefined in this case
      //     this.setState({ theUser: null });
      //     console.log("No such document!");
      //   }
      // }).catch(function (error) {
      //   this.setState({ theUser: null });
      //   console.log("Error getting document:", error);
      // });
      // var theUserData = [];
      // userData.then(function(querySnapshot){
      //   querySnapshot.forEach(function(doc){
      //     console.log(doc.id, '=>', doc.data());
      //     // this.setState({theUser: doc.data()});
      //     theUserData.push(doc.data());
      //     console.log('theUserData1: ', theUserData);
      //   });
      //   this.setState({theUser:theUserData});
      //   console.log('theUserData1: ', theUserData);
      // }).catch(error=>console.log("Error getting documents: ", error));
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

      firebase.firestore().collection('cnyRefSimpleAnalytic').add({currentUserEmail, currentUserName, theDate, theTime}).then(function(){
        console.log('success will mount');
      })
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
  
    handleContinue = () => {
    
    }
  
    handleAutosuggest = (name, value) => {
      var valueMap = {};
      valueMap[name] = value;
      this.setState({ ...valueMap
      });
    }
  
    handleClose = () => {
      this.setState({
        dialogOpen: false
      });
    }
  
    renderTxtField = (id, label, name, value) => {
        const {classes} = this.props;
        return(
          <TextField
            id={id}
            label={label}
            labelClassName = {classes.floatingLabelStyle}
            // variant="outlined"
            fullWidth
            onChange={this.handleChange(name)}
            autoComplete='off'
            value={value}
            style={{marginBottom:8}}
            className={classes.mediumMontSerrat}
            InputProps={{
              className: classes.mediumMontSerrat,
            //   classes: {
            //       focus:this.props.classes.underlineStyle
            //   }
            }}
          />
        )
    }

    renderCardFriendLayout = (friendText) => {
        const emailTxt = 'Email*';
        const nameTxt = 'Full Name*';

        const {classes} = this.props;
        const {email, name, isMobile} = this.state;

        return(
          <div 
            className={classes.contentInner}
            style={{marginTop:25, marginBottom:10, borderRadius:10, paddingBottom:10, paddingLeft: isMobile? 15:70, paddingRight:isMobile?15:70}}
            >
            <p className = {classes.mediumMontSerrat} style = {{fontSize:15}} >{friendText.toUpperCase()}</p>
            {this.renderTxtField('email', emailTxt, 'email', email)} 
            {this.renderTxtField('name', nameTxt, 'name', name)} 
        </div>
        )
    }

    renderSendButton(currentUserEmail, currentUserName){
        const {classes} = this.props;
        const {selectedAvatar, email, name, selectedAngPowCover} = this.state;
        return(
            <div 
                className={classes.sendButtonStyle}
                style = {{cursor: 'pointer'}}
                onClick = {()=>this.onSendReferralEmail(currentUserEmail, currentUserName, selectedAvatar, email, name, selectedAngPowCover)}
                >
                <p className={classes.mediumMontSerrat}>SEND</p>
            </div>
        )
    }

    thumbAvatarClick = (imageLink) => {this.setState({selectedAvatar:imageLink})};
    thumbColorClick = (angpow) => {
      this.setState({selectedAngPowCover:angpow.imageLink})
    };

    onSaveUserInfo = (currentUserEmail, currentUserName, selectedAvatar) => {
        this.setState({showReferralLayout:true, showSaveButton:false});
    }

    isValidRefUserEmail = (email) => {
        var isValidEmail = true;
        // if ((email === '')||(email===' ')){
        //   return isValidEmail; // assume true
        // }
        // else{
          const lowerCaseEmail = email.toLowerCase();
          const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
          var userEmail = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : email.toLowerCase();
          isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
          return isValidEmail;
        // }
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

    onSendReferralEmail = (currentUserEmail, currentUserName, selectedAvatar, email, name, selectedAngPowCover) =>{
        // console.log('onSendReferralEmail: ', this.state);
        console.log('currentUserEmail: ', currentUserEmail);
        console.log('currentUserName: ', currentUserName);
        console.log('selectedAvatar: ', selectedAvatar);
        console.log('email: ', email);
        console.log('name: ', name);
        console.log('selectedAngpowCover: ', selectedAngPowCover);
        
        const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        const invalidNameTxt = `Oops!, Error: looks like you don't know friend so well. Please enter full name.`

        var referralUserObj = [];
  
        // error checking
        let isValidRefEmail = this.isValidRefUserEmail(email);

        if (email.length<=3){
          this.setState({showErrorDialog:true, errorMessage:`Please key in an email to proceed, don't be shy!`});
          return;
        }
        if (!isValidRefEmail){
            this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
            return;
        }
        if (name.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidNameTxt});
            return;
        }
  
        referralUserObj.push({email, name});
        // referralUserObj[email] = email;
        // const combinedName = name.replace(" ", "%20");
        const combinedName = name.replace(/\s+/g, '-');

        // const whatsappLink = `https://api.whatsapp.com/send?text=Gong%20Xi%20Fa%20Cai%2C%20%F0%9F%8F%AE%F0%9F%A7%A7%0A%0AI%20want%20to%20give%20you%20this%20Ang%20Pow%20for%201%20Free%20Month%20of%20Membership%20at%20Babel.%F0%9F%8E%81%20Let%27s%20workout%20together%20Babel%2C%20they%E2%80%99ve%20got%20Huat%20you%20need%21%F0%9F%92%AA%0A%0AFlash%20this%20Ang%20Pow%20character%20at%20Babel%27s%20frontdesk%20to%20redeem%2C%20No%20Strings%20Attached.%20Valid%20until%20Chap%20Go%20Meh%20%28February%208th%202020%29%21%20Don%E2%80%99t%20delay%21%F0%9F%99%8C%0A%0Ahttp%3A%2F%2Fapp.babel.fit%2FCNYangpow%3Femail%3D${email}`;
        const whatsappLink = `https://api.whatsapp.com/send?text=Gong%20Xi%20Fa%20Cai%2C%20%F0%9F%8F%AE%F0%9F%A7%A7%0A%0AI%20want%20to%20give%20you%20this%20Ang%20Pow%20for%201%20Free%20Month%20of%20Membership%20at%20Babel.%F0%9F%8E%81%20Let%27s%20workout%20together%2C%20they%E2%80%99ve%20got%20Huat%20you%20need%21%F0%9F%92%AA%0A%0AFlash%20this%20Ang%20Pow%20character%20at%20Babel%27s%20frontdesk%20to%20redeem%2C%20No%20Strings%20Attached.%20Valid%20until%20Chap%20Go%20Meh%20%28February%208th%202020%29%21%20Don%E2%80%99t%20delay%21%F0%9F%99%8C%0A%0Ahttp%3A%2F%2Fapp.babel.fit%2FCNYangpow%3Fname%3D${combinedName}%26email%3D${email}`;

        if (currentUserEmail && currentUserName && referralUserObj && referralUserObj.length>=1){
            this.setState({showLoading:true}); // to show overlay loading
            const userEmailRef = firebase.functions().httpsCallable('cnyPromoRef');
            // const userEmailRef = firebase.functions().httpsCallable('sendRefEmail');
            // console.log('userEmailRef: ', userEmailRef);
            return userEmailRef({currentUserEmail, currentUserName, selectedAvatar, selectedAngPowCover, referralUserObj}).then(result=>{
              // console.log('theresult: ', result);
              const {data} = result;
              // clear all textboxt 
             this.setState({email:'', name:''});
              // show success message
              if (data.success){
                window.open(whatsappLink);
                this.setState({showSuccessDialog:true, showLoading:false, showSuccessPage:true});
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
      }

    renderScrollAvatar(){
        const {classes} = this.props;
        const {currentUserName, selectedAvatar, selectedAngPowCover, isMobile} = this.state;

        var avatarLayout = [];
        var avatarLayoutM1 = [];
        var avatarLayoutM2 = [];
        avatarImages && avatarImages.forEach(img=>{
          const bgColor = (img.imageLink === this.state.selectedAvatar)? '#fff':'#d4c5b9';
          const borderStyle = (img.imageLink === this.state.selectedAvatar)? '1.4px solid white':null;
          const borderRad = (img.imageLink === this.state.selectedAvatar)? 12:0;
    
          if (isMobile){
            if(avatarLayoutM1.length<6){
              avatarLayoutM1.push(
                <Grid 
                  item xs
                  onClick = {()=>this.thumbAvatarClick(img.imageLink)}
                  >
                  <img src = {img.imageLink} style = {{alignItems:'center', justifyContent:'center', border: borderStyle, borderRadius: borderRad, width:'100%',maxWidth:'130px'}}/>
                </Grid>
              )
            }
            else{
              avatarLayoutM2.push(
                <Grid 
                item xs
                onClick = {()=>this.thumbAvatarClick(img.imageLink)}
                >
                  <img src = {img.imageLink} style = {{alignItems:'center', justifyContent:'center', border: borderStyle, borderRadius: borderRad, width:'100%',maxWidth:'130px'}}/>
                </Grid>
              )
            }
          }
          else{
            avatarLayout.push(
              <div 
                key = {img.key} 
                onClick = {()=>this.thumbAvatarClick(img.imageLink)}
              >
                <img src = {img.imageLink} style = {{alignItems:'center', justifyContent:'center', border: borderStyle, borderRadius: borderRad, width:'100%',maxWidth:'130px'}}/>
            </div>
            );
          }
        });

        if (isMobile){
          return(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius:12, marginTop:10}}>
              <Grid container spacing={3}>
                {avatarLayoutM1}
              </Grid>
              <Grid container spacing={3}>
                {avatarLayoutM2}
              </Grid>
            </div>
          )
        }
        else{
          return(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'row', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius:12, marginTop:10}}>
                <List 
                  className = {classes.avatarList}
                  style = {{maxHeight:'726px', maxWidth:360}}
                  >
                    {avatarLayout}
                </List>
            </div>
          );
        }
    }

    renderAngpowColorSelection(){
        const {classes} = this.props;
        const {currentUserName, selectedAvatar, selectedAngPowCover, isMobile} = this.state;

        var colorSelections = [];
        angPowBG && angPowBG.forEach(angpow=>{
        //   const bgColor = (img.imageLink === this.state.selectedAngPowCover)? '#fff':'#d4c5b9';
        const borderStyle = (angpow.imageLink === this.state.selectedAngPowCover)? '1.4px solid white':null;
        // const borderRad = (angpow.imageLink === this.state.selectedAngPowCover)? 10:0;
        const borderRad = 12;
          colorSelections.push(
            <div 
              key = {angpow.key} 
              onClick = {()=>this.thumbColorClick(angpow)}
              style = {{backgroundColor:angpow.color, width: isMobile? '50px':'100px', height: isMobile? '50px':'100px', minHeight:'40px', minWeight:'40px', borderRadius:borderRad, border:borderStyle, marginTop:10, boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)', cursor: 'pointer'}}
            >
          </div>
          )
        });
        return(
            <div style = {{alignItems:'center', display:'flex', flexDirection:'row', marginTop:isMobile? 10:100}}>
                <List>
                    {colorSelections}
                </List>
            </div>
        );
    }

    renderAngpow(currentUserName, currentUserEmail, selectedAvatar=this.state.selectedAvatar, showSelection=true){
        const {classes} = this.props;
        const {selectedAngPowCover, isMobile, showSaveButton} = this.state;
        if (isMobile){
          return(
            <div 
                style = {{justifyContent:'space-around', alignItems:'center', display:'flex', flexDirection:'column', maxHeight:'750px', marginTop:60, marginLeft:20, marginRight:20}}
                >
                {!isMobile && this.state.showSaveButton && showSelection && this.renderAngpowColorSelection()}
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                    <img src = {selectedAngPowCover} style = {{alignItems:'center', justifyContent:'center', width:'68%', maxWidth:'600px', maxHeight:'750px', resizeMode: 'stretch', boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)'}}/>
                    <div style = {{position:'absolute', alignSelf:'center'}}>
                        <img src = {selectedAvatar} style = {{marginLeft:'auto', marginRight:'auto', marginTop:isMobile? 20:30, display:'block', width: isMobile? '50%':'70%', maxWidth:'600px'}}/>
                        <Typography 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', marginBottom:'10px',letterSpacing:3, marginTop: isMobile? -10:-50, fontSize:isMobile? 9:12}}>
                            {currentUserName.toUpperCase()}
                        </Typography>                   
                    </div>
                    {showSelection && this.renderBullet()}
                </div>
                {showSaveButton && showSelection && this.renderScrollAvatar()}
            </div>
          )
        }
        else{
          return(
            <div 
                style = {{justifyContent:'space-around', alignItems:'center', display:'flex', flexDirection:'row', maxHeight:'750px', marginTop:60, marginLeft:20, marginRight:20}}
                >
                {!isMobile && this.state.showSaveButton && showSelection && this.renderAngpowColorSelection()}
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                    <img src = {selectedAngPowCover} style = {{alignItems:'center', justifyContent:'center', width:'68%', maxWidth:'600px', maxHeight:'750px', resizeMode: 'stretch', boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)'}}/>
                    <div style = {{position:'absolute', alignSelf:'center'}}>
                        <img src = {selectedAvatar} style = {{marginLeft:'auto', marginRight:'auto', marginTop:isMobile? 20:30, display:'block', width: isMobile? '40%':'70%', maxWidth:'600px'}}/>
                        <Typography 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', marginBottom:'25px',letterSpacing:3, marginTop: isMobile? -10:-50, fontSize:isMobile? 9:12}}>
                            {currentUserName.toUpperCase()}
                        </Typography>                   
                    </div>
                    {showSelection && this.renderBullet()}
                </div>
                {showSaveButton && showSelection && this.renderScrollAvatar()}
            </div>
        );
        }
    }

    renderSaveUserInfo(){
        const {classes} = this.props;
        const {currentUserEmail, currentUserName, selectedAvatar, referralUsers} = this.state;
        return(
            <div 
                className={classes.sendButtonStyle}
                style = {{cursor: 'pointer', marginTop:40, justifyContent:'center', alignItem:'center'}}
                onClick = {()=>this.onSaveUserInfo(currentUserEmail, currentUserName, this.state.selectedAvatar)}
                >
                <p className={classes.mediumMontSerrat}>SAVE</p>
            </div>
        )
    }

    renderBullet(){
        const {classes} = this.props;
        return(
            <div style = {{alignItems:'center', justifyContent:'center', display:'flex', marginTop:'25px'}}>
                <div style = {{width: '7px', height: '7px', background: this.state.showSaveButton? 'white':'black', opacity:this.state.showSaveButton? '100%':'50%', borderRadius: '50%', marginRight:13}}></div>
                <div style = {{width: '7px', height: '7px', background: this.state.showReferralLayout? 'white':'black', opacity:this.state.showReferralLayout? '100%':'50%', borderRadius: '50%',}}></div>
            </div>
        )
    }

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
    
    renderShowSuccessPage (){
        const {classes} = this.props;
        return (
            <div 
                className={classes.container}
            >
                <Typography 
                    className = {classes.extraLightMontSerrat}
                    style={{textAlign:'center', fontSize:this.state.isMobile? '1.0rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                      COMPLETE
                </Typography>
            </div>
        )
    }

    renderAlreadyRefer(currentUserName, currentUserEmail, selectedAvatar, invalidPage=false, theMsg=null){
      const {classes} = this.props;
      const message = theMsg? theMsg: (!invalidPage)? 'YOU HAVE SUCCESSFULLY SHARED THIS PROMOTION':'INVALID LINK, PLEASE CHECK YOUR URL';
      // const secondMsg = theMsg? theMsg: (!invalidPage)? ''
      return(
        <div
          className={classes.container}
          style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                  <img src ={babelGoldLogo} alt="logo" style={{marginTop:'50px', marginBottom:'30px', width: this.state.isMobile? '15%':'25%', height:this.state.isMobile? '20%':'auto'}} />
              </div>
              <div style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                  {false && <img src = {goldCNYText} style = {{alignItems:'center', justifyContent:'center', width:'85%', maxWidth:'750px', marginTop:20}}/>}
                  <Typography 
                      className = {classes.extraLightMontSerrat}
                      style={{textAlign:'center', fontSize:this.state.isMobile? '1.0rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                      {message}
                  </Typography>
              </div>
            {this.renderAngpow(currentUserName, currentUserEmail, selectedAvatar, false)}
            <BabelLogo
                hideLogo = {true}
                textColor = {'#fff'}
            />
        </div>
      );
    }

    renderReceivedAngpow(referredByName, referredByEmail, referredToName, referredToEmail, selectedAvatar, selectedAngPowCover){
      const {classes} = this.props;
      const {isMobile} = this.state;
      const message1 = `Here's an Ang Pow from your friend ${referredByName}, to come Heng out with them at Babel!`
      const message2 = `Welcome aboard and we hope you'll have an awesome Babel experience`;
      const message3 = `*Please redeem your complimentary membership by showing this Ang Pow at our front desk before Chap Goh Meh (8 February 2020) to enjoy this privilege.`;
      const msg4 = `Referred By: ${referredByEmail}`;
      // const secondMsg = theMsg? theMsg: (!invalidPage)? ''
      return(
        <div
          className={classes.container}
          style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column', marginLeft:150, marginRight:150}}>
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
              <img src ={babelGoldLogo} alt="logo" style={{marginTop:'50px', marginBottom:'30px', width: this.state.isMobile? '15%':'25%', height:this.state.isMobile? '20%':'auto'}} />
            </div>
            <div style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
              <img src = {goldCNYText2} style = {{alignItems:'center', justifyContent:'center', width:'85%', maxWidth:'750px', marginTop:20}}/>
                  <Typography 
                      className = {classes.extraLightMontSerrat}
                      style={{textAlign:'center', fontSize:this.state.isMobile? '0.7rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                      {message1.toUpperCase()}
                  </Typography>
                  <Typography 
                  className = {classes.extraLightMontSerrat}
                  style={{textAlign:'center', fontSize:this.state.isMobile? '0.7rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                    {message2.toUpperCase()}
                </Typography>
              </div>
            {this.renderAngpow(referredToName, referredToEmail, selectedAvatar, false)}
            <Typography 
              className = {classes.mediumMontSerrat}
              style={{textAlign:'center', fontSize:this.state.isMobile? '0.7rem':'0.9rem', letterSpacing:1, marginTop:20}}>
                {msg4}
            </Typography>
            <Typography 
              className = {classes.mediumMontSerrat}
              style={{textAlign:'center', fontSize:this.state.isMobile? '0.7rem':'0.9rem', letterSpacing:1, marginTop:70}}>
                {message3}
            </Typography>
            <BabelLogo
                hideLogo = {true}
                textColor = {'#fff'}
            />
        </div>
      );
    }
    render() {
      console.log('renderTheUserData: ', this.state.theUser);
      const {classes, cnyRef, users, activeMember} = this.props;
      const {theUser} = this.state;
      
      const packages = [
        'vf2jCUOEeDDiIQ0S42BJ', // Monthly
        'WmcQo1XVXehGaxhSNCKa', // yearly
        'VWEHvdhNVW0zL8ZAeXJX', // 1 year renewal
        'q7SXXNKv83MkkJs8Ql0n', // yearly all clubs
        'wpUO5vxWmme7KITqSITo', // CP 230
        'TJ7Fiqgrt6EHUhR5Sb2q', // Monthly All Clubs
        'w12J3n9Qs6LTViI6HaEY', // 3 mths term
        'ZEDcEHZp3fKeQOkDxCH8', // CP 180
        'yQFACCzpS4DKcDyYftBx', // 3M term membership 
        'DjeVJskpeZDdEGlcUlB1', // 6 mths renewal
        'eRMTW6cQen6mcTJgKEvy', // CP 310
        'dz8SAwq99GWdEvHCKST2', // CP 210
        '89THMCx0BybpSVJ1J8oz', // 6 mths all clubs
        'duz1AkLuin8nOUd7r66L', // 6 mths
        'BKcaoWGrWKYihS40MpGd', // CP 290
        'aTHIgscCxbwjDD8flTi3', // 3 mths all clubs
        'LNGWNSdm6kf4rz1ihj0i', // 3M Jan Promo Term
        'yKLfNYOPzXHoAiknAT24' // complimentary
      ];

      const urlSearchString = this.props.location.search;
      const urlEmailandName = urlSearchString && urlSearchString.indexOf('?name=' === -1) ? urlSearchString.replace('?name=', '') : null;

      const currentUserEmailandName = urlEmailandName && urlEmailandName.split('&email=');

      const currentUserEmail = currentUserEmailandName && currentUserEmailandName[1] || '';
      let currentUserName = currentUserEmailandName && currentUserEmailandName[0] || '';
      currentUserName = currentUserName.replace(/%20/g, " ");
      var selectedAvatar = this.state.selectedAvatar;
      var selectedAngPowCover = this.state.selectedAngPowCover;
      var userHasReffered = false;
      var userIsReceivedAngPow = false;
      var invalidPage = false;
      var memberIsActive = false; //default it to true first
      var isLoading = true;
      var userReferredToEmail = null;
      var userReferredToName = null;
      var userReferredByEmail = null;
      var userReferredByName = null;
      var openReferredToLayout = false;
      var rewardCount = 0; // default

      // console.log('theCurrentUseremail1: ', currentUserEmail);
      if (currentUserName.length<=1 || currentUserEmail.length<=1){
        invalidPage = true;
      }

      if (cnyRef){
        cnyRef && cnyRef.forEach((data)=>{
          const referralEmail = data.get('currentUserEmail')||null;
          const referralName = data.get('currentUserName')||null;
          const selectedAvatarDB = data.get('selectedAvatar')||null;
          const referralUserObj = data.get('referralUserObj')|null;
          const referredToEmail = data.get('referredToEmail')||null;
          const referredToName = data.get('referredToName')||null;
        
          if(currentUserEmail && referralEmail && (currentUserEmail.toLowerCase().trim() === referralEmail.toLowerCase().trim())){
            // console.log('match data')
            currentUserName = referralName;
            selectedAvatar = selectedAvatarDB;
            userHasReffered = true;
            isLoading = false;
          }
          else if (currentUserEmail && referredToEmail && (currentUserEmail.toLowerCase().trim() === referredToEmail.toLowerCase().trim())){
            userReferredToName = referredToName;
            userReferredToEmail = referredToEmail;
            userReferredByName = referralName;
            userReferredByEmail = referralEmail;
            selectedAvatar = selectedAvatarDB;
            userIsReceivedAngPow = true;
            isLoading = false;
          }
        });
      }

    
      theUser && theUser.forEach(user=>{
        // console.log('theUser: ', user);
        const packageId = user.packageId;
        const memberstartDate = user.autoMembershipStarts? user.autoMembershipStarts: user.membershipStarts? user.membershipStarts:null;
        const memberEndDate = user.autoMembershipEnds? user.autoMembershipEnds: user.membershipEnds? user.membershipEnds:null;
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;
        const cancelDate = user.cancellationDate||null;
        if (packageId && memberstartDate && memberEndDate && !cancelDate && !isComplimentaryPackage){
          memberIsActive = true;
          isLoading = false;
        }

        if (packageId === packages[1] || packageId === packages[2] || packageId === packages[5] || 
          packageId === packages[9] || packageId === packages[10] || packageId === packages[13] || packageId === packages[14]){
          rewardCount = 2;
        }
        else if (packageId === packages[3] || packageId === packages[12]){
          rewardCount = 3;
        }
        else{
          rewardCount = 1;
        }
      });

      const activeUsers = users && users.filter((v)=>{
        const packageId = v.get('packageId') || null;
        const memberstartDate = v.get('autoMembershipStarts')? v.get('autoMembershipStarts'): v.get('membershipStarts')? v.get('membershipStarts'):null;
        const memberEndDate = v.get('autoMembershipEnds')? v.get('autoMembershipEnds'): v.get('membershipEnds')? v.get('membershipEnds'):null;
        var isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24')?true:false;
        const cancelDate = v.get('cancellationDate')||null;
        if (packageId && memberstartDate && memberEndDate && !cancelDate && !isComplimentaryPackage){
          return true;
        }
      });
      // check if current email is an active member
      activeUsers && activeUsers.forEach((activeUser)=>{
        const activeUserEmail = activeUser.get('email')||null;
        if (activeUserEmail.toLowerCase() === currentUserEmail.toLowerCase()){
          memberIsActive = true;
          isLoading = false;
          return;
        }
        isLoading = false;
      });

      // console.log('openReferredToLayout: ', openReferredToLayout);
      // if (this.state.showLoading || isLoading){
      //   return(
      //     <div className={classes.container} style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
      //       {this.renderLoading()}
      //     </div>
      //   )
      // }
      // else if (userHasReffered || invalidPage){
      //   return(
      //     <div 
      //       className={classes.container}
      //     >
      //       {this.renderAlreadyRefer(currentUserName, currentUserEmail, selectedAvatar, invalidPage)}
      //   </div>
      //   )
      // }
      // else if (userIsReceivedAngPow){
      //   return(
      //     <div 
      //       className={classes.container}
      //     >
      //       {this.renderReceivedAngpow(userReferredByName, userReferredByEmail, userReferredToName, userReferredToEmail, selectedAvatar, selectedAngPowCover)}
      //     </div>
      //   )
      // }
      // else if (!memberIsActive){
      //   const message = 'SORRY ONLY ACTIVE MEMBERS ARE ALLOWED TO SHARE'
      //   return(<div className={classes.container}>
      //       {this.renderAlreadyRefer(currentUserName, currentUserEmail, selectedAvatar, false, message)}</div>
      //   )
      // }
      // else if (this.state.showSuccessPage){
      //   return(
      //     <div 
      //       className={classes.container}
      //     >
      //       {this.renderShowSuccessPage()}
      //   </div>
      //   )
      // }
      // else if (memberIsActive && rewardCount<=3){
      //   return(
      //     <div 
      //         className={classes.container}
      //     >
      //         <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
      //             <img src ={babelGoldLogo} alt="logo" style={{marginTop:'50px', marginBottom:'30px', width: this.state.isMobile? '15%':'25%', height:this.state.isMobile? '20%':'auto'}} />
      //         </div>
      //         <div style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
      //             <img src = {goldCNYText} style = {{alignItems:'center', justifyContent:'center', width:'85%', maxWidth:'750px', marginTop:20}}/>
      //             {<Typography 
      //                 className = {classes.extraLightMontSerrat}
      //                 style={{textAlign:'center', fontSize:this.state.isMobile? '1.0rem':'1.2rem', letterSpacing:3, marginTop:15}}>
      //                 {this.state.showSaveButton? 'CHOOSE YOUR CHARACTER AND ANG POW DESIGN': 'ANGPOW DESIGN IS SELECTED! SHARE IT WITH YOUR FRIEND NOW!'}
      //             </Typography>}
      //         </div>
      //         {this.renderAngpow(currentUserName)}
      //         {this.state.showReferralLayout && <Typography 
      //           className={classes.mediumMontSerrat}
      //           style={{textAlign:'center', marginBottom:15, marginTop:40, letterSpacing:1}}>
      //             {'Give Us The Details'}
      //         </Typography>}
      //         {this.state.showSaveButton && this.renderSaveUserInfo()}
      //         {this.state.showReferralLayout && this.renderCardFriendLayout('your heng-out buddy')}
      //         {this.state.showReferralLayout && this.renderSendButton(currentUserEmail, currentUserName)}
      //         {this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
      //         {this.state.showSuccessPage && this.renderShowSuccessPage()}
      //         <BabelLogo
      //             hideLogo = {true}
      //             textColor = {'#fff'}
      //         />
      //     </div>
      //   );
      // }
      return(
        <div>
          
        </div>
      )
    }
  }
  
  cnyangpow.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const cnyangpowStyled = withStyles(styles)(cnyangpow);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getCnyRef = makeGetCnyRef();
      const getUsers = makeGetAllUsers();
      const getActiveMembers = makeGetActiveMemberItems();
      const test = null;
      return {
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        test,
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
  export default connect(makeMapStateToProps, mapDispatchToProps)(cnyangpowStyled)