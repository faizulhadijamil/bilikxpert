import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, CircularProgress, Dialog, Button,
    Card, CardContent, CardMedia, Grid, TextField, Typography,
    FormGroup, FormControlLabel, FormLabel, Chip,
    Avatar, Checkbox,  MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/core';
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';

  import React from 'react';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import SquareButton from '../components/SquareButton1';
  import IntegrationAutosuggest from '../IntegrationAutosuggest';
  
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff, makeGetCurrentUser, makeGetBabelExclusiveBookings
  } from '../selectors';
  import * as Actions from '../actions';
  import axios from 'axios';

  // import ReactPixel from 'react-facebook-pixel';

import firebase from 'firebase/app';
import 'firebase/firestore';
  
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
var ismobile = window.innerWidth<=550?true:false;

// for babel image
const imgSizeWidth = ismobile? '16rem':'20rem';
const imgSizeHeight = imgSizeWidth + '2rem';
  
  const styles = theme => ({
    checkBoxStyle:{
        color:'white',
        // color:'black',
        '&:hover': {
            backgroundColor: 'transparent',
          },  
    },
    inputTextStyle:{
        color:'black'
    },
    inputTextIPadStyle:{
        color:'white',
    },
    textFieldStyle:{
        marginBottom:8,
        backgroundColor:'white',
        width: ismobile? '16rem':'20rem',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%'
        // paddingBottom:3 
    },
    textFieldSmall:{
        marginBottom:8,
        backgroundColor:'white',
        width: ismobile? '8rem':'12rem',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        height: ismobile? '1.8rem':'4rem'
    },
    textFieldIPadMain:{
        width:315,
        height:60,
        // backgroundColor:'white',
        alignItems:'center', justifyContent:'center',
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '16rem':'20rem'
    },
    textFieldIPad:{
        // backgroundColor:'white',
        alignItems:'center', justifyContent:'center',
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '16rem':'20rem'
    },
    goButton:{
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1px solid white',
        borderColor: 'white',
        backgroundColor:'black',
        display:'flex',
        alignItems:'center', 
        justifyContent:'center',
        cursor: 'pointer', 
        margin:'2%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '4rem':'6rem',
        height: ismobile? '1.5rem':'3rem'
    },
    smallbutton:{
        display:'flex',
        alignItems:'center', 
        justifyContent:'center',
        cursor: 'pointer', 
        backgroundColor:'white',
        margin:'2%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '4rem':'6rem',
        height: ismobile? '1.5rem':'3rem'
    },
    container: {
        width: '100%',
        // maxWidth:'1080px',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        // backgroundColor: "#0C0C07",
        minHeight:screenHeight,
        // backgroundColor: "green",
        backgroundColor: "black",
    },
    center:{
        alignItems:'center', justifyContent:'center', flexDirection:'column', display:'flex'
    },
    centerRow:{
        alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex'
    },
    confirmMsgTxtBox:{
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        border: '1.3px solid #fff',
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '16rem':'20rem'
    },
    msgTxtBox:{
        letterSpacing:1, fontSize:ismobile?'1.4rem':'1.4rem', color:'white', textAlign:'center'
    },
    topContainer:{
        // width: screenWidth*0.9,
        justifyContent:'center', 
        alignItems:'center', 
        // display:'flex', 
        flexDirection:'column',
        // backgroundColor: "#0C0C07",
        paddingBottom: theme.spacing(5),
        paddingTop: 30
        // marginTop:50
    },
    secondContainer:{
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        paddingBottom: theme.spacing(5),
        paddingTop: theme.spacing(3),
    },
    Gridroot: {
        flexGrow: 1,
        // backgroundColor:'green',
        width:'100%'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    keyInDetailscontainer:{
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        flex:1,
        marginTop:20
    },
    boldMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        // fontFamily :'sans-serif', 
        fontWeight: 800,
        textTransform: "uppercase",
    },
    smallMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        textAlign:'center', marginLeft:'10%', marginRight:'10%', marginTop:10, letterSpacing:1
        // textTransform: "uppercase",
    },
    mainImgClass:{
        width:imgSizeWidth, height:imgSizeHeight, border:'1.3px solid white', marginBottom:20,  paddingTop:'1%', paddingBottom:'1%', paddingLeft:'4%', paddingRight:'4%'
    },
    bottomImgClass:{
        alignItems:'center', justifyContent:'center', width:'100%', resizeMode: 'stretch', marginTop:20
    },
    buttonStyle:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        // minWidth: 100,
        // border: '1.5px solid white',
        borderRadius: 30,
        // boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    boxContainer:{
        // paddingLeft: '5%',
        // paddingRight: '5%',
        padding:'2%',
        backgroundColor: "#fcebbe",
        borderRadius: 20,
        marginLeft: "auto",
        marginRight: "auto",
        // marginLeft:'6%',
        // marginRight:'5%',
        // marginLeft:5,
        // marginRight:5,
        // width:'90%',
        width: screenWidth * 0.85,
        // height: screenWidth * 0.22,
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    fontTermNCond: {
        marginBottom:7, color:'rgba(0, 0, 0, 0.54)'
    },
    card: {
      paddingBottom: theme.spacing(10)
    },
    content: {
      // maxWidth: 8 * 50,
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    termNConditionContainer:{
        maxWidth:screenWidth * 0.9,
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    contentInner: {
      maxWidth: 8 * 50,
      marginRight: 'auto',
      marginLeft: 'auto',
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
    
    
  });

  let lastScrollY = 0;

  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  class bookBabelExclusive extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            icnumber: '',
            className: '',
            classDate: '',
            dialogOpen: false,
            checked:false,
            refSource: null,
            mcId: null,
            currentUser:null,
            guestWhNumber:'',
            guestMap:{},
            guestExist:false,
            inValidCredit:false,
            whPhoneNumber:'',
            customToken:'',
            allBookingMap:{},
            isTrainerLink:false,

            bookingId:null,
            bookingMap:{},
            classMap:{},
            trainerMap:{},
            roomMap:{},
      
            mainImgUrl:null,
            bottomImgUrl:null,
            showSelection:true,
            showKLCC:true,
            showTTDI:false,
            showTermNCondition:false,
            showKeyInDetails:false,
            showLoading:false,
            isMobile: false,
            vendProductId: null,
            showErrorDialog:false,
            showClassOptions:false,
            klccLoc:false,
            ttdiLoc:true,
            venue:'',
            maxcapacity:'10',
            availableDate:null,
            availableTime:null,
            showLogin:true,
            showLocation:false,
            showSelectTrainer:false,
            showSelectVenue:false,
            showUserConfirm:false,
            showGuestResult:false,
            showTrainerPhoneTextInput:false,
            showTrainerTacTextInput:false,
            loginTacNumber:'',

            selectedTrainer:null,
            selectedVenue:null,
            selectedDate:moment().format('YYYY-MM-DD'),
            selectedTime:moment().format('HH:mm'),

            hostClientsObj:{},
            hostClientArray:[]
            // proposed hostClientObj
            // userId1:{
            //  name:'faizul',
            //  role:'host'/'client',
            //  whNumber:'+60328383883',
            //  verified:true/false
            //},
            // userId2:{
            //  name:'hadi',
            //  role:'client',
            //  whNumber:'+60328383883',
            //  verified:false
            //},
        };
        this.handleChange = this.handleChange.bind(this);
        // this.handleCheckBox = this.handleCheckBox.bind(this);
    }
  
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);
        this.scrollTo(0);
        this.setState({isMobile:(window.innerWidth<=550)?true:false});

        const hostClientArray = this.state.hostClientArray;
        const hostClientObj = {
            userId:'',
            name:'',
            whNumber:'',
            tac:'',
            tacFromServer:'',
            role:'',
            isMember:false,
            joinPress:false,
            verifyPress:false,
            verified:false,
            submitTac:false,
            tacVerified:false,
        }

        var hostClientsObj = this.state.hostClientsObj;
        for (var i=0; i<10; i++){
            hostClientArray.push({
                // [i]:hostClientObj
                hostClientObj
            }) // default
            hostClientsObj[i]=hostClientObj
        }

        const pathname = this.props.location && this.props.location.pathname;
        const pathStringSplit = pathname && pathname.split("/");
        const bookingId = (pathStringSplit && pathStringSplit.length >= 3 && pathStringSplit[2])?pathStringSplit[2]:null;
        console.log('pathStringSplit: ', pathStringSplit);
        const trainerSavePageLink = (pathStringSplit && pathStringSplit.length === 4 && pathStringSplit[3])?pathStringSplit[3]:null;
        console.log('trainerSavePageLink: ', trainerSavePageLink);
        console.log('bookingId: ', bookingId);

        if (bookingId){
            this.setState({bookingId});
            if (trainerSavePageLink){
                this.setState({isTrainerLink:true});
            }
            // fetch from bookings
            const bookingQuery = firebase.firestore().collection('bookings').doc(bookingId).get();
            var bookingMap = {};
            var bookingData = null;
            bookingQuery && bookingQuery.then((doc)=>{
                const data = doc.data();
                if (data){
                    const userMap = data.userMap;
                    bookingMap[doc.id]=data;
                    hostClientsObj[0]={
                        ...hostClientsObj[0],
                        ...data
                    }
                    // already contains userMap
                    if (userMap && Object.keys(userMap).length != 0){
                        Object.entries(userMap).forEach(([key,value]) => {
                            const whNumber = value.phoneNumber;
                            hostClientsObj[key]={
                                ...hostClientsObj[key],
                                whNumber,
                                name:value.name,
                                userId:value.userId,
                                userType:value.userType,
                                email:value.email,
                                createdAt:value.createdAt,
                                tacVerified:true
                            }
                        });
                    }
                    this.setState({bookingMap});
                }
            });
        }

        if (bookingId && trainerSavePageLink){
            console.log('redirect to trainer login page if not yet login');
            
        }
       
        this.setState({hostClientArray, hostClientsObj});

        // to fetch all rooms
        const roomsData = firebase.firestore().collection('rooms').get();
        var roomMap = {};

        roomsData && roomsData.then((querySnapshot)=>{
            querySnapshot.forEach(doc=>{
                var data = doc.data();
                roomMap[doc.id]=data;
            });
            this.setState({roomMap});
        });
        // to fetch all trainers
        const trainersData= firebase.firestore().collection('users')
        .where('isStaff', '==', true)
        // .where('staffRole', '==', 'trainer')
        .get();

        var trainersArray = [];
        var trainerMap = {};
        trainersData && trainersData.then((querySnapshot)=>{
            querySnapshot.forEach(doc=>{
                var data = doc.data();
                const staffRole = data && data.staffRole;
                const roles = data && data.roles;
                const isTrainer = ((staffRole && staffRole === 'trainer') || (roles && roles.trainer));
                if (isTrainer){
                    trainersArray.push(data);
                    trainerMap[doc.id]=data;
                }
            });
            this.setState({trainersArray, trainerMap});
        });

         // to fetch all classes where 
         const classesData= firebase.firestore().collection('classes')
         .where('classType', '==', 'vClass')
         .where('active', '==', true)
         .get();
 
         var classesArray = [];
         var classMap = {};
         classesData && classesData.then((querySnapshot)=>{
             querySnapshot.forEach(doc=>{
                 var data = doc.data();
                 const classId = doc.id;
                 data.classId = classId;
                 classesArray.push(data);
                 classMap[doc.id] = data;
             });
             this.setState({classesArray, classMap});
         });

         // to fetch all booking query
         const bookingQuery = firebase.firestore().collection('bookings')
            .where('type', '==', 'babelExclusive')
            // .orderBy('createdAt', 'desc')
            .get();

        // this is for trainer only
        var allBookingMap = {};
        bookingQuery && bookingQuery.then((snapshot)=>{
            snapshot.forEach(doc=>{
                allBookingMap[doc.id]=doc.data();
            });
            // if ( Object.keys(allBookingMap).length === 0){
            //     this.setState({})
            // }
            this.setState({allBookingMap});
        });

    }
  
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }
  
    handleScroll = () => {lastScrollY = window.scrollY}

    handleFocus = (key=null) => event => {
        const {hostClientsObj} = this.state;
        var updatedState = {};
        if (key){
            updatedState[hostClientsObj[key].whNumber] = '60';
            console.log('theUpdatedState: ', updatedState[hostClientsObj[key].whNumber]);
        }
        this.setState({ ...updatedState});
    }

    handleChange = (name, key=null) => event => {
        const {hostClientsObj} = this.state;
      var updatedState = {};
      var value = event.target.value;
      if(name === 'quantity' && value < 1){
        value = 1;
      }else if(name === 'checked'){
        value = event.target.checked;
      }
      else if (name === 'whPhoneNumber'){
        if (value && value.charAt(0) != '6'){
            value = `6${value}`;
        }
      }

      // else if (name === 'checkedPromo'){
      //   value = event.target.checked;
      // 
      // }
      if (name === 'name' && key){
          hostClientsObj[key].name = value;
          updatedState[hostClientsObj[key].name] = value;
        //   updatedState[hostClientsObj[key].name]=value;
      }
      // this will cause a problem for non malaysia number
      else if (name === 'whNumber' && key){
          if (value && value.charAt(0) != '6'){
              value = `6${value}`;
          }
        //   else if (value && value.charAt(1) != '0'){
        //     value = `60${value}`
        //   }
        hostClientsObj[key].whNumber = value;
        updatedState[hostClientsObj[key].whNumber] = value;
      }
      else if (name === 'tac' && key){
        hostClientsObj[key].tac = value;
        updatedState[hostClientsObj[key].tac] = value;
      }
      else{
        updatedState[name] = value;
      }
      this.setState({ ...updatedState});
    }
  

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap
    });
  }

    handleCreateBooking = (userId, email, name) => {
        const {selectedTrainer, selectedClass, selectedDate, selectedTime, ttdiLoc, klccLoc, selectedVenue, maxcapacity} = this.state;
        const invalidMaxCapacity = 'Please key in a number between 1 to 10';
        const invalidSelectedDate = 'Date must be after today or before January 2022';
        if (maxcapacity && parseInt(maxcapacity)>10){
            this.setState({showErrorDialog:true, errorMessage:invalidMaxCapacity});
            return;
        }
        if (selectedDate && moment(selectedDate).isSameOrBefore(moment()) || (selectedDate && moment(selectedDate).isSameOrAfter(moment('2022-01-31')))){
            this.setState({showErrorDialog:true, errorMessage:invalidSelectedDate});
            return;
        }
        if (userId && email){
            firebase.firestore().collection('bookings').add({
                userId:userId, // hostId
                trainerId: selectedTrainer && selectedTrainer.userId,
                createdAt:timestamp,
                type:'babelExclusive',
                startAt:moment(`${selectedDate}T${selectedTime}`).toDate(),
                status:'PENDING',
                hostId:userId, // userId
                users:[],
                classId:selectedClass && selectedClass.classId,
                location: ttdiLoc? 'TTDI':klccLoc? 'KLCC':'',
                roomId:selectedVenue && selectedVenue.venueId,
                hostEmail:email,
                name,
                max:maxcapacity
            }).then((result)=>{
                // should go to booking page
                console.log('go to booking page...');
                this.props.actions.viewBookExclusiveId(result.id);

            }).catch(e=>{
                console.log('error creating bookings: ', e);
            }); 
        }
        else{
            console.log('no userId or email');
        }
    }

    handlePress = (text = null) => {
        // this.props.actions.buyVT(text);
        if(text === 'KLCC') this.setState({showKLCC:true, showTTDI:false, showSelection:false})
        else if (text === 'TTDI') this.setState({showKLCC:false, showTTDI:true, showSelection:false});

        this.scrollTo(900);
    }

    scrollTo(number){
        window.scrollTo({
            top: number,
            behavior: "smooth"
        });
    }

    handleContinueEmail = () => {
        // const email = emailFromProps? emailFromProps : this.state.email && this.state.email.toLowerCase();
        const user = this.props.currentUser || null;
        const roles = (user && user.get('roles')) || (user && user.get('staffRole'));
        const email = (user && user.get('email')) ? user.get('email'):this.state.email;
        const emailMatch = email && email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
        const {isTrainerLink, bookingId} = this.state;

        if (!isValidEmail){
            this.setState({showErrorDialog:true, errorMessage:'Invalid email address'});
            return;
        }
        if (isValidEmail){
            // if (this.state.showTrainerTacTextInput){
            //     this.setState({showTrainerPhoneTextInput:false, showTrainerTacTextInput:true});
            //     console.log('showTrainerPhoneTextInput state: ', this.state);
            //     const {currentUserData} = this.state;
            //     const trainerName = (currentUserData && currentUserData.name)? currentUserData.name:'';
            //     // send tac to trainer
            //     var config = {
            //         method: 'POST',
            //         // url: 'https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-sendTACtoGuest3',
            //         url:`https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-appWidgets/trainer`,
            //         headers: { 
            //             'Content-Type': 'application/json',
            //         },
            //         data : JSON.stringify({"phone":this.state.whPhoneNumber, "name":trainerName, "userId":this.state.currentUserId})
            //     }

            //     axios(config).then(response=>{
            //         if (response){
            //             console.log('theresponse ', response)
            //             const data = response.data;
            //             if (data && data.success){
            //                // login, save it to cache
            //                // redirect to trainer page?
            //                console.log('theData: ', data);
            //                if (data && data.customToken){
            //                    console.log('data.customToken: ',  `${data.customToken}`);
            //                     this.setState({customToken: `${data.customToken}`});
            //                }
            //             }
            //             else{
            //                 console.log('no tac from server?', data);
            //             }
            //         }
            //         else{
            //             console.log('no tac from server?')
            //         }
            //     }).catch(e=>{
            //         console.log('error: ', e);
            //     });

            //     // this.setState({showTrainerPhoneTextInput:false, showTrainerTacTextInput:true});
            // }
            if (this.state.showTrainerTacTextInput && this.state.whPhoneNumber){
                console.log('send TAC for trainer login... ');
                const {loginTacNumber} = this.state;
                 // compare with tacFromServer
                 const tacQuery = firebase.firestore().collection('tacs').where('phone', '==', this.state.whPhoneNumber).orderBy("createdAt", "desc").limit(1).get();
                 var isValidTAC = false;
                 Promise.all([tacQuery]).then(result=>{
                    const tacRes = result[0];
                    tacRes && tacRes.forEach(doc=>{
                        const data = doc.data();
                        const tacNumber = data.tacNumber;
                        if (tacNumber === parseInt(loginTacNumber)){
                            isValidTAC=true;
                            // save it to cache and
                            console.log('save it to cache...', this.state.customToken);
                            // this.props.actions.setUserByUserId(this.state.currentUserId, response=>{
                            //     console.log('setUserByUserId response: ', response)
                            // });
                            this.props.actions.whLogin(this.state.currentUserId, this.state.currentUserData, this.state.customToken, response=>{
                                console.log('theresponse: ', response);
                                const data = response.data;
                                if (data && data.success && isTrainerLink && bookingId){
                                    console.log('redirect to bookingId page......')
                                    // going to bookingExclusive
                                    this.props.actions.viewBookExclusiveId(bookingId);
                                }

                            });
                            // proceed to trainer page/booking page
                        }
                        else{
                            this.setState({showErrorDialog:true, errorMessage:"invalid TAC number"})
                        }
                    });
                 });
            }
            else{
                // fetch from user collection
                // host must be an active to host the class
                const userQuery = firebase.firestore().collection('users').where('email', '==', email).limit(1).get();
                var userMap = {};
                userQuery && userQuery.then((querySnapshot)=>{
                    if (querySnapshot.empty) {
                        console.log('query is empty');
                        // user is not register yet
                        this.setState({showErrorDialog:true, errorMessage:"No Email found"});
                    }
                    else{
                        querySnapshot.forEach(doc=>{
                            var data = doc.data();
                            const userId = doc.id;
                            userMap[doc.id] = data;
                            const roles = data && data.roles;
                            const staffRole = data && data.staffRole;
                            const userIsTrainer = (staffRole && staffRole === 'trainer') || (roles && roles.trainer);
                            this.setState({currentUserId:userId, currentUserData:data});
                            // if user is not a trainer
                            if (!userIsTrainer){
                                const PrivateClassCredit = data.PrivateClassCredit;
                                if (PrivateClassCredit && PrivateClassCredit>0){
                                    this.setState({showLocation:true, showLogin:false});
                                }
                                else{
                                    // todo: show not enough credit
                                    this.setState({inValidCredit:true});
                                }
                            }
                            else{
                                console.log('user is trainer: ', data);
                                // show the textbox to key in the phone number
                                // this.setState({showTrainerPhoneTextInput:true});
                                this.setState({showTrainerTacTextInput:true});

                                const phone = data && data.phone;
                                console.log('thePhone: ', phone);
                                if (phone){
                                    const phoneString = (phone.charAt(0) != '6')? `6${phone}`:phone;
                                    this.setState({whPhoneNumber:phoneString});

                                    const {currentUserData} = this.state;
                                    const trainerName = (currentUserData && currentUserData.name)? currentUserData.name:'';
                                    // send tac to trainer
                                    var config = {
                                        method: 'POST',
                                        // url: 'https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-sendTACtoGuest3',
                                        url:`https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-appWidgets/trainer`,
                                        headers: { 
                                            'Content-Type': 'application/json',
                                        },
                                        data : JSON.stringify({"phone":this.state.whPhoneNumber, "name":trainerName, "userId":this.state.currentUserId})
                                    }

                                    axios(config).then(response=>{
                                        if (response){
                                            console.log('theresponse ', response)
                                            const data = response.data;
                                            if (data && data.success){
                                            // login, save it to cache
                                            // redirect to trainer page?
                                            console.log('theData: ', data);
                                            if (data && data.customToken){
                                                console.log('data.customToken: ',  `${data.customToken}`);
                                                    this.setState({customToken: `${data.customToken}`});
                                            }
                                            }
                                            else{
                                                console.log('no tac from server?', data);
                                            }
                                        }
                                        else{
                                            console.log('no tac from server?')
                                        }
                                    }).catch(e=>{
                                        console.log('error: ', e);
                                    });
                                }
                            }
                            
                        });
                    }
                    // this.setState({});
                });
            }
           
        }
        // fetch from props
        else{
            const user = this.props.currentUser || null;
            const PrivateClassCredit = user && user.get('PrivateClassCredit');
            if (PrivateClassCredit && PrivateClassCredit>0){
                this.setState({showLocation:true, showLogin:false});
            }
            else{
                // todo: show not enough credit
                this.setState({inValidCredit:true});
            }
        }
    }

    refreshPage = () => {window.location.reload(false)}

    handleCancelBooking = () => {
        const user = this.props.currentUser || null;
        const currentUserEmail = (user && user.get('email')) ? user.get('email'):this.state.email;
        const {bookingId} = this.state;

        if (bookingId){
            firebase.firestore().collection('bookings').doc(bookingId).update({
                status:'CANCEL',
                cancelBy:currentUserEmail,
                cancelAt:timestamp,
                updatedAt:timestamp
            }).then((result)=>{
                console.log('resultBookingId: ', result);
                this.refreshPage();
            }).catch(e=>{
                console.log('error updating bookings: ', e);
            });
        }
    }

    handleConfirmBookings = () => {
        const user = this.props.currentUser || null;
        const currentUserEmail = (user && user.get('email')) ? user.get('email'):this.state.email;
        const {bookingId} = this.state;

        if (bookingId){
            firebase.firestore().collection('bookings').doc(bookingId).update({
                status:'CONFIRM',
                confirmBy:currentUserEmail,
                confirmAt:timestamp,
                updatedAt:timestamp
            }).then((result)=>{
                console.log('resultBookingId: ', result);
                this.refreshPage();
            }).catch(e=>{
                console.log('error updating bookings: ', e);
            });
        }
    }

    handleNext = (num) => {
        const invalidSelectedClassText= `Oops!, Error: Please pick any class.`;
        console.log('handleNextState: ', this.state);
        console.log('nextNumber: ', num);
        const user = this.props.currentUser || null;
        const currentUserEmail = (user && user.get('email')) ? user.get('email'):this.state.email;
        const {bookingId, selectedDate, selectedTime} = this.state;
        // for trainer to reconfirm the date, this will update the existing booking id
        if (bookingId && num && num ===4 && currentUserEmail){
            this.setState({showSelectVenue:false});

            firebase.firestore().collection('bookings').doc(bookingId).update({
                startAt:moment(`${selectedDate}T${selectedTime}`).toDate(),
                // status:'pending',
                changedBy:currentUserEmail,
                changedAt:timestamp,
                updatedAt:timestamp
               
            }).then((result)=>{
                console.log('resultBookingId: ', result);
                this.refreshPage();
            }).catch(e=>{
                console.log('error updating bookings: ', e);
            });
        }
        else {
            if (!this.state.selectedClass && num && num === 2){
                this.setState({showErrorDialog:true, errorMessage:invalidSelectedClassText});
                return;
            }
            if (this.state.selectedClass && num && num === 2){
                this.setState({showLocation:false, showSelectTrainer:true, showUserConfirm:false, showSelectVenue:false});
            }
            else if (this.state.selectedTrainer && num && num === 3){
                this.setState({showLocation:false, showSelectVenue:true, showSelectTrainer:false});
            }
            else if (this.state.selectedVenue && num && num === 4){
                // this.setState({showLocation:false, showSelectVenue:false, showSelectTrainer:false, showUserConfirm:true});
            }
        }
        this.scrollTo(0);
    }

    handleConfirm = () => {
        const invalidSelectedTrainerText= `Oops!, Error: Please pick any trainer.`

        if (!this.state.selectedTrainer){
            this.setState({showErrorDialog:true, errorMessage:invalidSelectedTrainerText});
            return;
        }
        this.setState({showKeyInDetails:true});
        this.scrollTo(0);
    }

    handleAddAvailableDate = name => event => {
        this.setState({[name]: event.target.value});
    }

    selectClass = (trainerArray, className, theClass) =>{
        if (!this.state.selectedTrainerList){
            var venueList = theClass.venueList;
            var defaultSelectedVenue = {};
            // for default
            if (venueList && venueList.length>0){
                // defaultSelectedVenue = theClass.
                defaultSelectedVenue = this.state.roomMap && this.state.roomMap[venueList[0]];
                defaultSelectedVenue.venueId = venueList[0];
            }
            this.setState({selectedTrainerList:trainerArray, selectedClassName:className, selectedClass:theClass, selectedTrainer:null, selectedVenue:defaultSelectedVenue});
        }
        else if (this.state.selectedClassName === className){
            this.setState({selectedTrainerList:null, selectedClassName:null, selectedTrainer:null, selectedClass:null});
        }
        else{
            this.setState({selectedTrainerList:null, selectedTrainer:null, selectedClass:null, selectedClass:null});
        }
    }

    selectTrainer = (data, userId) => {
        if (data){
            data.userId = userId;
            this.setState({selectedTrainer:data})
        }
    }

    selectRoom = (data, venueId) =>{
        if (data){
            data.venueId = venueId;
            this.setState({selectedVenue:data});
        }
    }

    renderConfirmButton(){
        const {classes} = this.props;
        const bgColorSelected = '#fcebbe';
        const bgColorNotSelected = '#fff';

        return(
           
                <SquareButton
                    text = {'CONFIRM'}
                    key = {'confirmBtn'}
                    onClick = {()=>this.handleConfirm()}
                    // marginTop = {'50px'}
                    // style = {{marginTop:50}}
                    // selectedButton = {(selectedClass === className)? true:false}
                />
           
        );
    }

    renderBottomImg(){
        const {classes} = this.props;
        const {bottomImgUrl} = this.state;
        return(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                <img src = {bottomImgUrl} className={classes.bottomImgClass}/>               
            </div>
        );
    }

    renderLogoImg(){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:20, marginTop:40}}>
                <img src ={require("../assets/babelGold.png")} alt="logo" style={{width:'50px', height:'50px'}} />
            </div>
        )
    }

    renderShowClassSelection () {
        const {classes} = this.props;
        const {classesArray, selectedTrainerList, selectedClass, selectedClassName, selectedTrainer, isMobile, klccLoc, ttdiLoc, showLocation} = this.state;

        var classLayout = [];
        var TTDIClassLayout = [];
        var KLCCClassLayout = [];

       classesArray && classesArray.forEach((theClass)=>{
          const className = theClass && theClass.name && theClass.name.toUpperCase();
          const instructorNames = theClass && theClass.instructorNames;
          const locBase = theClass && theClass.locBase;
          if (locBase && locBase === 'TTDI'){
            TTDIClassLayout.push(
                <div key = {className} style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                    <SquareButton
                        text = {className}
                        key = {className}
                        onClick = {()=>this.selectClass(instructorNames, className, theClass)}
                        selectedButton = {(selectedClassName === className)? true:false}
                    />
                </div>
            )
          }
          else if (locBase && locBase === 'KLCC'){
            KLCCClassLayout.push(
                <div key = {className} style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                    <SquareButton
                    text = {className}
                    key = {className}
                    onClick = {()=>this.selectClass(instructorNames, className, theClass)}
                    selectedButton = {(selectedClassName === className)? true:false}
                />
                </div>
            )
          }

          classLayout.push(
            <div key = {className} style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                 <SquareButton
                    text = {className}
                    key = {className}
                    onClick = {()=>this.selectClass(instructorNames, className, theClass)}
                    selectedButton = {(selectedClassName === className)? true:false}
                />
            </div>
            )
       });

       if (showLocation){
        return(
            <div 
                // className = "columns"
                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:0}}
                >
                {this.renderBackArrow()}
                {this.renderHeader(false)}
                {false && this.renderLogoImg()}
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:10}}>
                    <Typography type="title" component="h1" color="#fffff" 
                            style={{textAlign:'center', marginBottom:0, marginTop:0, letterSpacing:1, fontSize:isMobile?'1.4rem':'2.5rem', color:'white', textAlign:'center'}}> 
                        {'BABEL EXCLUSIVE'}
                    </Typography>         
                </div>
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:20}}>
                    <Typography type="title" component="h1" color="#fffff" 
                            style={{textAlign:'center', marginBottom:0, marginTop:0, letterSpacing:1, fontSize:isMobile?'0.65rem':'1.4rem', color:'white', textAlign:'center'}}> 
                        {'CHOOSE LOCATION'}
                    </Typography>  
                    <FormGroup row style={{color:'white'}}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                className={classes.checkBoxStyle}
                                checked={this.state.klccLoc}
                                onChange={this.handleCheckBox('klccLoc')}
                                value="klccLoc"
                            />
                            }
                            label=
                            {<Typography type="title" component="h1" 
                                style={{textAlign:'center', letterSpacing:1, fontSize:isMobile?'0.65rem':'1.4rem', color:'white', textAlign:'center'}}> 
                                {'KLCC'}
                            </Typography>} 
                            style={{marginRight:50}}
                        />
                        <FormControlLabel
                            control={
                            <Checkbox
                                className={classes.checkBoxStyle}
                                checked={this.state.ttdiLoc}
                                onChange={this.handleCheckBox('ttdiLoc')}
                                value="ttdiLoc"
                            />
                            }
                            label=
                            {<Typography type="title" component="h1" 
                            style={{textAlign:'center', letterSpacing:1, fontSize:isMobile?'0.65rem':'1.4rem', color:'white', textAlign:'center'}}> 
                            {'TTDI'}
                            </Typography>} 
                        />
                    </FormGroup>       
                </div>
                <Typography 
                    type="title"
                    style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, color:'white'}}
                    >{'SELECT YOUR CLASS'}
                </Typography>
                {(classLayout && classLayout.length===0)? this.renderLoading():null}
                {(TTDIClassLayout && TTDIClassLayout.length>0 && ttdiLoc)? TTDIClassLayout:null}
                {(KLCCClassLayout && KLCCClassLayout.length>0 && klccLoc)? KLCCClassLayout:null}
                <div 
                // className = "columns"
                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:30, marginBottom:30}}
                >
                     <SquareButton
                        text = {'NEXT'}
                        key = {'nextBtn'}
                        onClick = {()=>this.handleNext(2)}
                    />
                </div>
            </div>
        )
       }
  
    //    else{
    //        return this.renderLoading()
           
    //    }
    }

    renderShowSelection () {
        const {classes} = this.props;
        const {mainImgUrl, isMobile} = this.state;
       
        return(
            <div style = {{maxWidth:'1080px'}}>
                <div className={classes.topContainer}>
                    {this.renderLogoImg()}
                    {<div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:20}}>
                        <img src = {mainImgUrl} className={classes.mainImgClass}/>               
                    </div>}
                    <SquareButton
                        text = {'START'}
                        onClick = {()=>{this.setState({showClassOptions:true})}}
                        selectedButton = {(this.state.showClassOptions)? true:false}
                    />
                </div>
            </div>
        );
      
    }

    renderHeader (showBabelExclusive = true, showSubTitle = false){
        const {classes} = this.props;
        const {mainImgUrl, isMobile} = this.state;
        return (
            <div className={classes.topContainer}>
                {this.renderLogoImg()}
                {showBabelExclusive && <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:0}}>
                    <Typography type="title" component="h1" color="#fffff" 
                        style={{textAlign:'center', marginBottom:0, marginTop:0, letterSpacing:1, fontSize:isMobile?'1.4rem':'2.5rem', color:'white', textAlign:'center'}}> 
                        {'BABEL EXCLUSIVE'}
                    </Typography>         
                </div>}
                {showSubTitle && this.renderMedText('YOUR TRAINER, YOUR FRIEND, YOUR TIME')}
            </div>
        )
    }

    renderShowSelectVenue (){
        const {classes} = this.props;
        const {mainImgUrl, isMobile, selectedClass, roomMap, maxcapacity, bookingId, bookingMap} = this.state;
        const bookingData = bookingId && bookingMap[bookingId];
        const roomId = bookingData && bookingData.roomId;
        const roomData = roomId && roomMap[roomId];
        const roomName = roomData && roomData.name;
        const venueList = selectedClass && selectedClass.venueList;
        const startAt = bookingData && bookingData.startAt;
        const selectedDate = this.state.selectedDate? this.state.selectedDate:startAt?startAt:null;
        const defaultValueDate = startAt?moment(startAt.toDate()).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        const selectedTime = this.state.selectedTime? this.state.selectedTime:startAt?startAt:null;
        const defaultValueTime = startAt?moment(startAt.toDate()).format('HH:mm'):moment().format('HH:mm');

        const user = this.props.currentUser || null;
        const email = (user && user.get('email')) ? user.get('email'):this.state.email;
        const currentUserId = (user && user.get('id'))? user.get('id'):this.state.currentUserId? this.state.currentUserId:null;
        const currentUserName = (user && user.get('name')) ? user.get('name'):this.state.currentUserData? this.state.currentUserData.name:'';
       
        // var selectedVenue = this.state.selectedVenue? this.state.selectedVenue:null;
        var selectedVenue = this.state.selectedVenue? this.state.selectedVenue:null;

        const TextFieldMaxCapacity = 
        <TextField id="maxcapacity" 
            label= {this.renderLabelText("MAXIMUM CAPACITY*", 'gray')}
            placeholder = {'How many guests?'}
            fullWidth
            onChange={this.handleChange('maxcapacity')} autoComplete='off' value={maxcapacity}
            className={classes.textFieldStyle} 
            InputProps={{className: classes.inputTextStyle}}
            />;
        
        // todo: change this with datePicker (latest and more accurate)
        const TextFieldAvailableDate = <TextField
            id="selectedDate"
            label={<Typography type="title" component="h1" 
            style={{textAlign:'center', letterSpacing:1, fontSize:isMobile?'0.65rem':'1.4rem', color:'white', textAlign:'center'}}> 
                {"DD/MM/YYYY"}
            </Typography>} 
            type="date"
            // required
            margin="dense"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{className: classes.inputTextStyle}}
            onChange={this.handleAddAvailableDate('selectedDate')}
            className={classes.textFieldStyle} 
            defaultValue={defaultValueDate}
        />

        const TextFieldAvailableTime = <TextField
            id="selectedTime"
            label={<Typography type="title" component="h1" 
            style={{textAlign:'center', letterSpacing:1, fontSize:isMobile?'0.65rem':'1.4rem', color:'white', textAlign:'center'}}> 
                {"00:00"}
            </Typography>} 
            type="time"
            // required
            margin="dense"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ className: classes.inputTextStyle }}
            onChange={this.handleAddAvailableDate('selectedTime')}
            className={classes.textFieldStyle} 
            defaultValue={defaultValueTime}
        />

        return(
            <div style = {{maxWidth:'1080px'}}>
                {this.renderHeader()} 
                {this.renderBackArrow()}
                {(venueList && venueList.length>0) && <Typography type="title" component="h1" color="#fffff" 
                        style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, fontSize:isMobile?'0.65rem':'1.45rem', color:'white', textAlign:'center'}}> 
                    {'SELECT YOUR VENUE'}
                </Typography>} 
               {(venueList && venueList.length>0) && venueList.map((venueId)=>{
                   const roomData = roomMap[venueId];
                   const roomName = roomData && roomData.name;
                   
                   // if venueList length is 1, select the default class
                   // default venue
                    if (roomName){
                        return(
                            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:30}}>
                                <SquareButton
                                    text = {roomName}
                                    key = {roomName}
                                    onClick = {()=>this.selectRoom(roomData, venueId)}
                                    selectedButton = {((selectedVenue && selectedVenue.name) === roomName)? true:false}
                                />
                            </div>
                        )
                    }
                })}

                {roomData && <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:30}}>
                    <SquareButton
                        text = {roomName}
                        key = {roomName}
                        onClick = {()=>this.selectRoom(roomData, roomId)}
                        // selectedButton = {((selectedVenue && selectedVenue.name) === roomName)? true:false}
                    />
                </div>}
                <div className={classes.center}>
                    {TextFieldMaxCapacity}
                    {TextFieldAvailableDate}
                    {TextFieldAvailableTime}
                </div>
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:30, marginBottom:30}}>
                     <SquareButton
                        text = {'DONE'}
                        key = {'done'}
                        // onClick = {()=>{this.handleNext(4)}}
                        onClick = {()=>{
                            if (bookingId){this.handleNext(4)}
                            else{this.handleCreateBooking(currentUserId, email, currentUserName)}
                        }}
                    />
                </div>
            </div>
        );
    }

    renderShowSelectTrainer (){
        const {classes} = this.props;
        const {mainImgUrl, isMobile, selectedClass, trainerMap, selectedTrainer} = this.state;
        const instructorList = selectedClass && selectedClass.instructorList;
       
        return(
            <div style = {{maxWidth:'1080px', paddingBottom:50}}>
                {this.renderBackArrow()}
                {this.renderHeader()}
                <Typography type="title" component="h1" color="#fffff" 
                        style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, fontSize:isMobile?'0.65rem':'1.45rem', color:'white', textAlign:'center'}}> 
                    {this.state.selectedClassName}
                </Typography>  
                {(instructorList && instructorList.length>0) && <Typography type="title" component="h1" color="#fffff" 
                        style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, fontSize:isMobile?'0.65rem':'1.45rem', color:'white', textAlign:'center'}}> 
                    {'CHOOSE YOUR TRAINER'}
                </Typography>} 
               {(instructorList && instructorList.length>0) && instructorList.map((userId)=>{
                   const trainerData = trainerMap[userId];
                   const trainerName = trainerData && trainerData.name;
                    if (trainerName){
                        return(
                            <div className={classes.center}>
                                <SquareButton
                                    text = {trainerName.toUpperCase()}
                                    key = {trainerName}
                                    onClick = {()=>this.selectTrainer(trainerData, userId)}
                                    selectedButton = {((selectedTrainer && selectedTrainer.name) === trainerName)? true:false}
                                />
                            </div>
                        )
                    }
                })}
                 <div 
                // className = "columns"
                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:30, marginBottom:30, paddingBottom:50}}
                >
                     <SquareButton
                        text = {'NEXT'}
                        key = {'nextBtn3'}
                        onClick = {()=>this.handleNext(3)}
                    />
                </div>
            </div>
        );
    }

    capitalizeFirstLetter(string) {return string.charAt(0).toUpperCase()+string.slice(1)}

    // for both trainer and host
    renderBookingPage(){
        const {classes} = this.props;
        const {bookingId, bookingMap, isMobile, classMap, trainerMap, roomMap} = this.state;
        const bookingData = bookingId && bookingMap[bookingId];
        const classId = bookingData && bookingData.classId;
        const classData = classId && classMap[classId];
        const trainerId = bookingData && bookingData.trainerId;
        const trainerData = trainerId && trainerMap[trainerId];
        const startAt = bookingData && bookingData.startAt;
        const startAtDate = startAt && startAt.toDate();
        const startAtDateFormat = startAtDate && (`${moment(startAtDate).format('ddd').toUpperCase()} ${moment(startAtDate).format('DD/MM')} ${moment(startAtDate).format('h:mm a')}`);
        const roomId = bookingData && bookingData.roomId;
        const roomData = roomId && roomMap[roomId];
        const hostId = bookingData && bookingData.hostId;
        const hostEmail = bookingData && bookingData.hostEmail;
        const hostName = (bookingData && bookingData.name)? bookingData.name:'';
        const className = (classData && classData.name) || '';
        const trainerName = (trainerData && trainerData.name) || '';
        const roomName = (roomData && roomData.name) || '';
        const user = this.props.currentUser || null;
        const currentUserEmail = (user && user.get('email')) ? user.get('email'):this.state.email;
        // const isTrainer = (user && user.get('roles')) && user.get('roles');
        const roles = (user && user.get('roles')) || (user && user.get('staffRole'));
        const status = bookingData && bookingData.status;
        const confirmStatus = status && status === 'CONFIRM';
        const location = bookingData && bookingData.location;

        var hostClientsObj = this.state.hostClientsObj;

        // update the object
        hostClientsObj = {
            ...hostClientsObj,
            0:{
                ...hostClientsObj[0],
                userId:hostId,
                email:hostEmail,
                name:hostName,
                role:'host',
                verified:false,
                isMember:true,
                joinPress:false,
                submitTac:false
            }
        }

        return(
            <div style = {{paddingBottom:50}} className={classes.center}>
                {this.renderHeader(true, true)}
                {roles && this.renderMedText(`TRAINER ${currentUserEmail}`)}
                {roles && this.renderMedText('CONFIRMATION')}
                {bookingData && <div 
                    // color='primary' 
                    key={'confirmMsgText'} 
                    className = {classes.confirmMsgTxtBox}
                    >
                    {this.renderSmallText(`${className} by ${trainerName}`)}
                    {this.renderSmallText(`${startAtDateFormat}`)}
                    {this.renderSmallText(`${roomName} at ${location}`)}
                    {this.renderSmallText(`FOR ${hostName}`)}
                    {this.renderSmallText(`Status ${status.toUpperCase()}`)}
                </div>}
                {!bookingData && this.renderLoading()}
                {roles && <div style={{marginTop:20}} className={classes.center}>
                     <SquareButton
                        text = {'CHANGE'}
                        key = {'changeInfo'}
                        onClick = {()=>{this.handleChangeVenue()}}
                    />

                    <SquareButton
                        text = {'CONFIRM'}
                        key = {'confirm1Btn'}
                        onClick = {()=>{this.handleConfirmBookings()}}
                    />
                    <SquareButton
                        text = {'CANCEL'}
                        key = {'cancelBtn'}
                        onClick = {()=>{this.handleCancelBooking()}}
                    />
                 </div>
                }
                {((!roles && confirmStatus) || (roles)) && 
                    <div className={classes.center} style = {{marginTop:20, width:'80%'}}>
                        {false && <div className={classes.centerRow} style = {{marginTop:0}}>
                            <SquareButton
                                text = {'CHANGE'}
                                key = {'change1Btn'}
                                onClick = {()=>{this.handleChangeBookings()}}
                                smallbutton={true}
                            />
                            <SquareButton
                                text = {'CONFIRM'}
                                key = {'confirm1Btn'}
                                onClick = {()=>{this.handleChangeBookings()}}
                                smallbutton={true}
                            />
                            <SquareButton
                                text = {'CANCEL'}
                                key = {'cancel1Btn'}
                                onClick = {()=>{this.handleChangeBookings()}}
                                smallbutton={true}
                            />
                        </div>}
                        {this.renderMedText('GUEST LIST')}
                        {Object.keys(hostClientsObj).map((item, i)=>{
                            const name = this.capitalizeFirstLetter(hostClientsObj[i].name);
                             const key = i;
                             const joinPress = hostClientsObj[i].joinPress;
                             const verifyPress = hostClientsObj[i].verifyPress;
                             const tacVerified = hostClientsObj[i].tacVerified;

                             if (i===0){
                                 return(
                                    <div className={classes.Gridroot}>
                                        <Grid container xs={12} spacing = {1}>
                                            <Grid container item xs={2}>
                                                {}
                                            </Grid>
                                            <Grid container item xs = {4}>
                                                {this.renderSmallText('SLOT 1')}
                                            </Grid>
                                            <Grid container item xs = {6}>
                                                {this.renderSmallText(name)}
                                            </Grid>
                                        </Grid>
                                    </div>
                                 )
                             }
                             else if (i != 0){
                                return(
                                    <div className={classes.Gridroot}>
                                         <Grid container xs={12} spacing = {1} >
                                            <Grid container item xs={2} style={{marginTop:15}}>
                                                <img src ={require("../assets/chess_icon.svg")} alt="logo" style={{width:'9px', height:'15px'}} />
                                            </Grid>
                                            <Grid container item xs={4}>
                                                {this.renderSmallText(`FRIEND ${key+1}`)}
                                            </Grid>
                                            <Grid container item xs={6}>
                                                {name && !joinPress && tacVerified && this.renderSmallText(name)}
                                                {!tacVerified && !name && !joinPress && 
                                                    <div style = {{alignSelf:'center'}}>
                                                        {this.renderSmallButton('JOIN', key)}
                                                    </div>
                                                }
                                                {!tacVerified && verifyPress && this.renderSendTACCode(i, hostClientsObj[i])}
                                                {!tacVerified && joinPress && !verifyPress && this.renderNameNPhoneTextInput(i, hostClientsObj[i])}
                                            </Grid>
                                        </Grid>
                                        {false && <Grid container spacing = {3}>
                                            {!tacVerified && joinPress && !verifyPress && <Grid container item xs>
                                                {this.renderNameNPhoneTextInput(i, hostClientsObj[i])}
                                            </Grid>}
                                            {false && verifyPress && <Grid container item xs> {this.renderSendTACCode(i, hostClientsObj[i])}
                                            </Grid>}
                                        </Grid>}
                                        {false && <div style = {{display:'flex', flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:0}}>
                                            <img src ={require("../assets/chess_icon.svg")} alt="logo" style={{width:'8px', height:'12px', marginRight:20}} />
                                            {this.renderSmallText(`Friend ${key+1}: `)}
                                            {name && !joinPress && this.renderSmallText(name)}
                                            {!name && !joinPress && this.renderSmallButton('JOIN', key)}
                                            {verifyPress && this.renderSendTACCode(i, hostClientsObj[i])}
                                        </div>}
                                        
                                        {false && joinPress && !verifyPress && this.renderNameNPhoneTextInput(i, hostClientsObj[i])}
                                    </div>
                                 )
                             }
                        })
                        }
                    </div>
                }
            </div>
        );
    }

    // for confirmation page (for user)
    renderShowConfirm () {
        const {classes} = this.props;
        const {mainImgUrl, isMobile, selectedClass, selectedTrainer, 
            selectedDate, selectedTime, selectedVenue, hostClientArray} = this.state;
        
        const user = this.props.currentUser || null;
        const email = (user && user.get('email')) ? user.get('email'):this.state.email;
        const name = (user && user.get('name'))? user.get('name'):null;
        const phone = (user && user.get('phone'))? user.get('phone'):null;
        const currentUserId = user && user.get('id');

        var hostClientsObj = this.state.hostClientsObj || {}
        if (email){
            hostClientsObj = {
                ...hostClientsObj,
                0:{
                    userId:'',
                    email:email,
                    role:'host',
                    verified:false,
                    name,
                    whNumber:phone,
                    isMember:false,
                    joinPress:false,
                    submitTac:false  
                }
            }
        }

        if (this.state.showUserConfirm && selectedClass && selectedTrainer && selectedVenue){
            return(
                <div style = {{}} className={classes.center}>
                    {this.renderHeader()}
                    <Typography type="title" component="h1" color="#fffff" 
                            style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, fontSize:isMobile?'0.65rem':'1.45rem', color:'white', textAlign:'center'}}> 
                        {'CONFIRMATION'}
                    </Typography>  
                    <div 
                        // color='primary' 
                        key={'confirmMsgText'} 
                        className = {classes.confirmMsgTxtBox}
                        >
                        <Typography className={classes.msgTxtBox}>
                            {`${selectedClass.name} by ${selectedTrainer.name}`}
                        </Typography>
                        <Typography className={classes.msgTxtBox}>
                            {`${moment(selectedDate).format('ddd')} ${moment(selectedDate).format('DD/MM')} ${selectedTime}`}
                        </Typography>
                        <Typography className={classes.msgTxtBox}>
                            {`${selectedVenue.name}`}
                        </Typography>
                        <Typography className={classes.msgTxtBox}>
                            {`FOR ${email}`}
                        </Typography>
                    </div>

                    <SquareButton
                        text = {'CHANGE'}
                        key = {'changeInfo'}
                        onClick = {()=>{this.handleBackArrow(true)}}
                    />

                    <SquareButton
                        text = {'CONFIRM'}
                        key = {'confirm1Btn'}
                        onClick = {()=>{this.handleCreateBooking(currentUserId, email, name)}}
                    />

                    <SquareButton
                        text = {'CANCEL'}
                        key = {'cancelBtn'}
                        onClick = {()=>{this.handleBackArrow(true)}}
                    />
                    {this.renderMedText(`CLIENT's ENTOURAGE`)}

                    <div style = {{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginBottom:20}}>
                        <div style = {{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:20}}>
                            {this.renderSmallText('HOST')}
                            {this.renderSmallText(name)}
                        </div>
                        {false && hostClientArray && hostClientArray.map((data, index)=>{
                            const name = data.name;
                            const key = index;
                            const joinPress = data.joinPress;
                            return(
                                <div style = {{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:10}}>
                                    <img src ={require("../assets/chessicon.png")} alt="logo" style={{width:'8px', height:'12px'}} />
                                    {this.renderSmallText(`Friend ${key+1}: `)}
                                    {name && this.renderSmallText(name)}
                                    {!name && this.renderSmallButton('JOIN', key)}
                                </div>
                            )
                        })} 
                        {Object.keys(hostClientsObj).map((item, i)=>{
                             const name = hostClientsObj[i].name;
                             const key = i;
                             const joinPress = hostClientsObj[i].joinPress;
                             const verifyPress = hostClientsObj[i].verifyPress;

                             if (i != 0){
                                return(
                                    <div style = {{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginBottom:10}}>
                                        <div style = {{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:10}}>
                                            <img src ={require("../assets/chess_icon.svg")} alt="logo" style={{width:'8px', height:'12px'}} />
                                            {this.renderSmallText(`Friend ${key+1}: `)}
                                            {name && !joinPress && this.renderSmallText(name)}
                                            {!name && !joinPress && this.renderSmallButton('JOIN', key)}
                                            {verifyPress && this.renderSendTACCode(i, hostClientsObj[i])}
                                        </div>
                                        
                                        {joinPress && !verifyPress && this.renderNameNPhoneTextInput(i, hostClientsObj[i])}
                                    </div>
                                 )
                             }
                        })
                        }
                    </div>
                </div>
            )
        }
    }

    renderSendTACCode (key, item){

        const {classes} = this.props;
        const {isMobile, hostClientsObj, bookingId, bookingMap} = this.state;
        const bookingData = bookingId && bookingMap[bookingId];
        var userMapFromBooking = bookingData && bookingData.userMap;

        // todo: show transparent loading when user press submit button
        return(
            <div style = {{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginBottom:20}}>
                 {this.renderSmallText(`${hostClientsObj[key].whNumber}`)}
                 <TextField id = {`tac${key}`} 
                    // label={this.renderLabelText("whatsapp tac code", 'gray')}
                    placeholder={'whatsapp tac code'}
                    fullWidth
                    onChange={this.handleChange('tac', key)} 
                    autoComplete='off' 
                    value={hostClientsObj[key].tac} 
                    defaultValue={hostClientsObj[key].tac}
                    className={classes.textFieldSmall} 
                    InputProps={{className: classes.inputTextStyle}}
                    variant="standard"
                />
                 <div 
                    // color='primary' 
                    key={'submitButton'} 
                    onClick={()=>{
                        const whNumber = item.whNumber;
                        const whNumber1 = whNumber.substring(1); // phone number without 6
                        const whNumber2 = `+${whNumber}`; // phone number with +6
                        const whNumber3 = whNumber.substring(2); // phone number without 60

                        // compare with tacFromServer
                        const tacQuery = firebase.firestore().collection('tacs').where('phone', '==', whNumber).orderBy("createdAt", "desc").limit(1).get();
                        // get user via phone number
                        const userQuery1 = firebase.firestore().collection('users').where('phone', '==', whNumber).limit(1).get();
                        const userQuery2 = firebase.firestore().collection('users').where('phone', '==', whNumber1).limit(1).get();
                        const userQuery3 = firebase.firestore().collection('users').where('phone', '==', whNumber2).limit(1).get();
                        const userQuery4 = firebase.firestore().collection('users').where('phone', '==', whNumber3).limit(1).get();

                        var matchedTAC = false;
                        console.log('before promise: ', moment().format('hh:mm:ss'));
                        return Promise.all([tacQuery, userQuery1, userQuery2, userQuery3, userQuery4]).then((result)=>{
                            console.log('after promise: ', moment().format('hh:mm:ss'));
                            const tacRes = result[0];
                            const userRes1 = result[1];
                            const userRes2 = result[2];
                            const userRes3 = result[3];
                            const userRes4 = result[4];

                            var userMap1 = {};
                            var userMap2 = {};
                            var userMap3 = {};
                            var userMap4 = {};
                            var userMapCombined = {};

                            userRes1 && userRes1.forEach(doc=>{
                                userMap1[doc.id]=doc.data();
                            });
                            userRes2 && userRes2.forEach(doc=>{
                                userMap2[doc.id]=doc.data();
                            });
                            userRes3 && userRes3.forEach(doc=>{
                                userMap3[doc.id]=doc.data();
                            });
                            userRes4 && userRes4.forEach(doc=>{
                                userMap4[doc.id]=doc.data();
                            });
                            // for any existing user, transfer it to userMap
                            if (Object.keys(userMap1).length != 0){
                                userMapCombined=userMap1;
                            }
                            else if (Object.keys(userMap2).length != 0){
                                userMapCombined=userMap2;
                            }
                            else if (Object.keys(userMap3).length != 0){
                                userMapCombined=userMap3;
                            } 
                            else if (Object.keys(userMap4).length != 0){
                                userMapCombined=userMap4;
                            }

                            tacRes && tacRes.forEach(doc=>{
                                const data = doc.data();
                                const tacFromServer = data.tacNumber;

                                if (tacFromServer === parseInt(item.tac)){
                                    matchedTAC = true;
                                    this.setState(prevState => ({
                                        hostClientsObj:{
                                            ...prevState.hostClientsObj,
                                            [key]:{
                                                ...prevState.hostClientsObj[key],
                                                submitTac:true,
                                                tacVerified:true,
                                                joinPress:false
                                            },
                                        }
                                    }));

                                    var userEmail, userName, theUserId, userType = 'newVisitor';
                                    // for new guest
                                    if (Object.keys(userMapCombined).length === 0){
                                       
                                        userEmail = hostClientsObj[key].email||"";
                                        userName = hostClientsObj[key].name||"";
                                        userType = 'newVisitor';

                                        // create a new member
                                        const userData = {
                                            email:hostClientsObj[key].email || '',
                                            name: hostClientsObj[key].name,
                                            createdAt: timestamp,
                                            createdFrom: 'babelExclusive',
                                            phone: hostClientsObj[key].whNumber
                                          };
                                          firebase.firestore().collection('users').add(userData).then((docRef)=>{
                                            theUserId = docRef.id;
                                          }).catch(error=>{
                                            console.error("Error adding document: ", error);
                                          })
                                    }
                                    // check the existing user
                                    else {
                                        Object.entries(userMapCombined).forEach(([key,value]) => {
                                            userEmail = value.email;
                                            userName = value.name;
                                            theUserId = key;
                                            const membershipStarts = value.autoMembershipStarts? value.autoMembershipStarts:value.membershipStarts?value.membershipStarts:null;
                                            const membershipEnds = value.autoMembershipEnds? value.autoMembershipEnds:value.membershipEnds? value.membershipEnds:null;
                                            const packageId = value.packageId;
                                            const createdAt = value.createdAt;
                                            const cancellationDate = value.cancellationDate;
                                            const isStaff = value.isStaff;

                                            // visitors: all visitor after createdAt 1/10/2021
                                            if ((!membershipStarts || !membershipEnds || !packageId) && moment(Actions.getTheDate(createdAt)).isSameOrAfter(moment('2021-10-01'))){
                                                userType = 'visitor';
                                            }
                                            else if (!membershipStarts || !membershipEnds || !packageId){
                                                userType = 'oldVisitor';
                                            }
                                            else if (cancellationDate){
                                                userType = 'terminated';
                                            }
                                            else if (membershipStarts && membershipEnds && packageId){
                                                userType = 'member';
                                            }
                                            else if (isStaff){
                                                userType = 'staff';
                                            }
                                        });
                                    }

                                    // update the data into bookingId
                                    firebase.firestore().collection('bookings').doc(bookingId).update({
                                        userMap:{
                                            ...userMapFromBooking,
                                            [key]:{
                                                name:item && item.name,
                                                createdAt:timestamp,
                                                phoneNumber:whNumber,
                                                userType,
                                                email:userEmail,
                                                userId:theUserId
                                            }
                                        }
                                    });
                                    //
                                    // this.refreshPage();
                                    setTimeout(() => {this.refreshPage()}, 1000);

                                }
                                else{
                                    //tac is not matched
                                    // todo: show error dialog
                                    console.log('tac is not matched!');
                                }
                            });
                        });
                        // else{
                        //     this.setState(prevState => ({
                        //         hostClientsObj:{
                        //             ...prevState.hostClientsObj,
                        //             [key]:{
                        //                 ...prevState.hostClientsObj[key],
                        //                 submitTac:true,
                        //                 tacVerified:false
                        //             },
                        //         }
                        //     }))
                        // }
                    }} 
                    className = {classes.goButton}
                    // disabled={}
                    // style = {}
                    >
                    {this.renderSmallText('SUBMIT')}
                </div>
            </div>
        )
    }

    renderNameNPhoneTextInput (key, item){
        const {classes} = this.props;
        const {isMobile, hostClientsObj, bookingId} = this.state;

        const invalidNameTxt = `Oops!, Error: Please enter name.`;
        const invalidPhoneTxt = `Oops!, Error: Please enter a correct phone number`;
        const duplicatePhoneTxt = `Oops!, Error: phone number already exist`;

        return (
            <div style = {{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginBottom:20}}>
                <TextField id = {`name${key}`} 
                    // label={this.renderLabelText("name (as per ic)", 'gray')}
                    placeholder="name (as per ic)"
                    fullWidth
                    onChange={this.handleChange('name', key)} 
                    autoComplete='off' 
                    value={hostClientsObj[key].name} 
                    defaultValue={hostClientsObj[key].name}
                    className={classes.textFieldSmall} 
                    InputProps={{className: classes.inputTextStyle}}
                    // variant="outlined"
                    variant="standard"
                />
                 <TextField id = {`phoneNumber${key}`} 
                    // label= {this.renderLabelText("Whatsapp number", 'gray')}
                    placeholder={"Whatsapp number"}
                    fullWidth
                    onChange={this.handleChange('whNumber', key)} 
                    onFocus={()=>this.handleFocus(key)}
                    type='number'
                    autoComplete='off' 
                    value={item.whNumber} 
                    defaultValue={item.whNumber}
                    className={classes.textFieldSmall} 
                    InputProps={{className: classes.inputTextStyle}}
                    // variant="outlined"
                    variant="standard"
                />
                <div 
                    // color='primary' 
                    key={'goButton'} 
                    onClick={()=>{
                        var phoneNumberIsExist = false;
                        if (hostClientsObj[key].name === ''){
                            this.setState({showErrorDialog:true, errorMessage:invalidNameTxt});
                        }
                        else if (hostClientsObj[key].whNumber === '' || hostClientsObj[key].whNumber.length<11){
                            this.setState({showErrorDialog:true, errorMessage:invalidPhoneTxt});
                        }
                        else{
                             // compare with the other phone number first
                            Object.entries(hostClientsObj).forEach(([key1,value]) => {
                                const whNumber = value && value.whNumber;
                                const userId = value && value.userId;

                                if (whNumber && whNumber!="" && whNumber === item.whNumber && (key!=key1)){
                                    phoneNumberIsExist = true;
                                }
                                if (userId && userId!="" && userId === item.userId && (key!=key1)){
                                    phoneNumberIsExist = true;
                                }
                            });
                        
                            if (!phoneNumberIsExist){
                                var config = {
                                    method: 'POST',
                                    // url: 'https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-sendTACtoGuest3',
                                    url:`https://us-central1-babelasia-37615.cloudfunctions.net/messageBird-appWidgets/${bookingId}`,
                                    headers: { 
                                        'Content-Type': 'application/json',
                                        // "Access-Control-Allow-Headers" : "Content-Type",
                                        // "Access-Control-Allow-Origin": "*",
                                        // "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                                    },
                                    data : JSON.stringify({"phone":`${item.whNumber}`, "name":`${item.name}`})
                                }
        
                                axios(config).then(function(response){
                                    if (response){
                                        const data = response.data;
                                        // this.setState({
                                        //     showTACNumber:true,
                                        // });
                                        // if (tacFromServer){
                                        if (data && data.success){
                                            // this.setState(prevState=>({
                                            //     hostClientsObj:{
                                            //         ...prevState.hostClientsObj,
                                            //         [key]:{
                                            //             ...prevState.hostClientsObj[key],
                                            //             // tacFromServer:'123'
                                            //             // tacFromServer
                                            //         },
                                            //     }
                                            // }));
                                        }
                                        // }
                                    }
                                    else{
                                        console.log('no tac from server?')
                                    }
                                    
                                }).catch(e=>{
                                    console.log('error: ', e);
                                });
                                this.setState(prevState => ({
                                    hostClientsObj:{
                                        ...prevState.hostClientsObj,
                                        [key]:{
                                            ...prevState.hostClientsObj[key],
                                            verifyPress:true,
                                        },
                                    }
                                }))
                            }
                            else{
                                // todo: show error dialog
                                this.setState({showErrorDialog:true, errorMessage:duplicatePhoneTxt});
                            }
                        }
                    }} 
                    // className = {classes.smallbutton}
                    className = {classes.goButton}
                    // disabled={}
                    // style = {}
                    >
                    {this.renderSmallText('GO')}
                </div>

            </div>
        )
    }

    renderSmallButton(text, key){
        const {classes} = this.props;
        const {isMobile, hostClientsObj} = this.state;

        return(
            <div 
            // color='primary' 
            key={key} 
            onClick={()=>{
                    this.setState(prevState => ({
                        hostClientsObj:{
                            ...prevState.hostClientsObj,
                            [key]:{
                                ...prevState.hostClientsObj[key],
                                joinPress:true,
                             },
                        }
                    }));
                // }
            }} 
            className = {classes.smallbutton}
            // disabled={}
            // style = {}
            >
            <Typography type="title" component="h2" 
                    style={{textAlign:'center', letterSpacing:1, fontSize:isMobile?'0.6rem':'1rem', color:'black'}}>
                {text}
            </Typography>
        </div>
        )
    }

    renderMedText (text){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <Typography type="title" component="h2"
                    style={{textAlign:'center', marginBottom:10, marginTop:10, letterSpacing:1, fontSize:isMobile?'0.8rem':'1.45rem', color:'white', textAlign:'center'}}> 
                {text}
            </Typography>  
        )
    }

    renderSmallText (text, color = "white", margin = 15){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <Typography component="h2" 
                style={{textAlign:'center', marginBottom:margin, marginTop:margin, letterSpacing:0, fontSize:isMobile?'0.8rem':'1rem', color:color, textAlign:'center'}}> 
                {text}
            </Typography>  
        )
    }

    renderLabelText (text, color = "white"){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <Typography type="title" component="h2" 
                style={{textAlign:'center', marginBottom:40, letterSpacing:1, fontSize:isMobile?'0.8rem':'1rem', color:color}}> 
                {text}
            </Typography>  
        )
    }
    
    renderShowLogin (bookingId = null) {
        const {classes} = this.props;
        const {mainImgUrl, isMobile, showLogin, showTrainerPhoneTextInput, showTrainerTacTextInput, whPhoneNumber, loginTacNumber} = this.state;

        const user = this.props.currentUser || null;
        const roles = (user && user.get('roles')) || (user && user.get('staffRole'));
        // const userEmail = user && user.get('email');
        const email = (user && user.get('email')) ? user.get('email'):this.state.email;
        const emailMatch = email && email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

        const TextFieldEmail = 
            <TextField id="email" 
                // label={this.renderLabelText('Please enter your email address', 'gray')} 
                placeholder={"Please enter your email address"}
                fullWidth
                onChange={this.handleChange('email')} 
                autoComplete='off' 
                value={email} 
                defaultValue={email}
                className={classes.textFieldStyle} 
                InputProps={{className: classes.inputTextStyle}}
                // variant="outlined"
                variant="standard"
            />;

        const TextFieldPhoneNumber = 
            <TextField id="whPhoneNumber" 
                // label={this.renderLabelText('Please enter your email address', 'gray')} 
                placeholder={"Whatsapp phone number"}
                fullWidth
                onChange={this.handleChange('whPhoneNumber')} 
                autoComplete='off' 
                value={whPhoneNumber} 
                defaultValue={whPhoneNumber}
                disabled={true}
                className={classes.textFieldStyle} 
                InputProps={{className: classes.inputTextStyle}}
                // variant="outlined"
                variant="standard"
            />;

        const TextFieldTACNumber = 
            <TextField id="loginTacNumber" 
                // label={this.renderLabelText('Please enter your email address', 'gray')} 
                placeholder={"TAC Number"}
                fullWidth
                onChange={this.handleChange('loginTacNumber')} 
                autoComplete='off' 
                value={loginTacNumber} 
                defaultValue={loginTacNumber}
                className={classes.textFieldStyle} 
                InputProps={{className: classes.inputTextStyle}}
                // variant="outlined"
                variant="standard"
            />;

        if (showLogin){
            return(
                <div style = {{maxWidth:'1080px', alignItems:'center', justifyContent:'center', flex:1, display:'flex', flexDirection:'column'}}>
                    {this.renderHeader(false)}
                    {this.state.inValidCredit && this.renderMedText('Not enough Credit')}
                    <img 
                        src ={require("../assets/babelExclusive.png")} 
                        alt="logo" 
                        className={classes.mainImgClass}
                    />
                    {TextFieldEmail}
                    {false && showTrainerPhoneTextInput && TextFieldPhoneNumber}
                    {showTrainerTacTextInput && TextFieldTACNumber}
                    <SquareButton
                        text = {'CONTINUE'}
                        key = {'continue1Btn'}
                        onClick = {()=>{this.handleContinueEmail()}}
                        // disabled={!isValidEmail}
                    />
                </div>
            );
        }
    }

    handleCheckBox = name => event => {
        // this.setState({[name]: event.target.checked });
        // select only 1
        this.setState({[name]: event.target.checked });
        if (name === 'klccLoc'){
            this.setState({ttdiLoc:false});
        }
        else if (name === 'ttdiLoc'){
            this.setState({klccLoc:false})
        }

    };

    handleViewTermsConditions = () => {this.setState({showTermNCondition:true})}

    handleFetchGuest = () => {
        const {guestWhNumber} = this.state;
        this.setState({showLoading:true});
        const guestWhNumber2 = `6${guestWhNumber}`;
        const userQuery1 = firebase.firestore().collection('users').where('phone', '==', guestWhNumber).get();
        const userQuery2 = firebase.firestore().collection('users').where('phone', '==', guestWhNumber2).get();
        var guestMap = {};
        var guestExist = false;

        return Promise.all([userQuery1, userQuery2]).then((result)=>{
            const userRes1 = result[0];
            const userRes2 = result[1];
            userRes1 && userRes1.forEach(doc=>{
                guestExist=true;
                var data = doc.data();
                guestMap[doc.id]=data;
            });
            userRes2 && userRes2.forEach(doc=>{
                guestExist=true;
                var data = doc.data();
                guestMap[doc.id]=data;
            });
            this.setState({guestMap, showLoading:false, guestExist, showGuestResult:true});
        });
    }

    handleAddGuestEmail = (userId, guestName, postcode) => {
        const {guestWhNumber, guestEmail} = this.state;
        this.setState({showLoading:true});
        if (userId){
            firebase.firestore().collection('users').doc(userId).update({
               email:guestEmail, 
               name:guestName, postcode
            }).then((result)=>{
                console.log('resultBookingId: ', result);
                this.setState({showLoading:false});
                this.refreshPage();
            }).catch(e=>{
                console.log('error updating bookings: ', e);
                this.setState({showLoading:false});
            });
        }
    }

    handleChangeVenue = () => {
        this.setState({
            showLogin:false,  
            showLocation:false,
            showSelectTrainer:false,
            showSelectVenue:true,
            showUserConfirm:false
        })
    }

    handleBackArrow = (resetAll = false) => {
        if (resetAll){
            this.setState({showLogin:false,  
                showLocation:true,
                showSelectTrainer:false,
                showSelectVenue:false,
                showUserConfirm:false
            });
        }
        if (this.state.showLocation){
            this.setState({showLogin:true,  
                showLocation:false,
                showSelectTrainer:false,
                showSelectVenue:false,
                showUserConfirm:false
            });
        }
        else if (this.state.showSelectTrainer){
            this.setState({showLogin:false,  
                showLocation:true,
                showSelectTrainer:false,
                showSelectVenue:false,
                showUserConfirm:false
            });
        }
        else if (this.state.showSelectVenue){
            this.setState({showLogin:false,  
                showLocation:false,
                showSelectTrainer:true,
                showSelectVenue:false,
                showUserConfirm:false
            });
        }
    };

    renderBackArrow () {
        return(
            <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} 
            onClick={()=>{this.handleBackArrow()}}>
                <ArrowBackIcon style = {{width:'2rem', height:'2rem', color:'white'}}/>
            </div>
        )
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

    handleCloseDialog = () => this.setState({showTermNCondition:false, showErrorDialog:false});

    renderShowTermsNCondition () {
        const {classes} = this.props;
        const {isMobile} = this.state;

        return(
            <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showTermNCondition}>
              <div 
                style = {{margin:30, width:'90%', maxWidth:800, display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto'}}
                className = {classes.termNConditionContainer}
                >
                {this.renderLogoImg()}
                <Typography 
                  type="title" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}
                  className={classes.boldMontSerrat}
                >
                {`TERMS & CONDITIONS`}
                </Typography>
                <ol type="1">
                    <li color="primary" type="body1"  className={classes.fontTermNCond}>
                        {`All members must provide relevant details by filling in all particulars required for the purpose of Virtual Private Class (VPC).`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`VPC sessions are valid for purchase by both Babel Members and non-members.`}
                    </li>
                    {true && <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The duration of each VPC session is 40mins except HIIT30, which is 30mins.`}
                    </li>}
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`VPC sessions purchased are non-transferable, not re-sellable, non-refundable and cannot be converted into cash or physical Personal Training sessions.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`All VPC sessions will be conducted via the ZOOM App, your chosen trainer will be in touch with the link to the private room.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`VPC is an arrangement between the buyer and Babel. Upon payment, Babel will notify the chosen trainer who will contact the buyer to confirm date and time of VPC. The buyer agrees to be bound by a binding contract.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`A Fitness Instructor/Personal Trainer is not a medical professional and is without expertise to diagnose medical conditions or impairments. The member agrees to promptly and fully disclose to our Fitness Instructor/Personal Trainer regarding any injury, condition or impairment which may have a detrimental effect on or be impacted by this virtual training program. The Fitness Instructor/Personal Trainer has a right to make the decision to discontinue training because of any condition which presents an adverse risk or threat to the health or safety of the member or others.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The recommended Age Range for this PVC is 16 to 65 years old.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The fee for the program is payable in advance of Sessions in one lump sum at least 1 days (24 hours) prior to the scheduled VPC session. Payments should be made via online on the Babel App page. The member is not allowed to pay the Fitness Instructor/Personal Trainer directly for a session.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The fee entitles you to One (1) VPC session.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel’s VPC sessions are valid for redemption throughout the duration of the Movement Control Order (MCO), should the MCO be extended then redemption period will be automatically extended accordingly.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`All VPC sessions have an ‘End Date’ or 'Expiration Date'. If in any case the purchased VPC Package is not finished before the "Expiration Date", in this case, before the end of the MCO period, all the remaining sessions will be forfeited.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The time of sessions is to be agreed upon between the trainer and the member. You must be present virtually on time for the scheduled appointment. If you arrive late (virtually) by any chance, do understand that your session will end at the originally scheduled time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The member must give a TWENTY-FOUR (24) hour cancellation notice. It is required for rescheduling or cancelling any and all individual Sessions. Failure to do so will result in forfeiture of the sessions and no sessions or payment reimbursement will be granted.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Any tardiness of more than 15 minutes or absence without proper notification will result in forfeiting the session and no sessions or payment reimbursement will be granted. All one-on-one VPC sessions will start and end no more than allocated time, as per purchased package (1 hour).`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Shall his or her Fitness Instructor cancels the session within the 24-hour notice period, he or she will be ensured of a substitute Coach for the scheduled session. If the member is not satisfied with services of the current Fitness Instructor with solid reasons, we will be glad to offer him or her a different Fitness Instructor.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Refunds - All personal training package fees are non-refundable, even if the member cannot or does not participate in all of the VPC sessions in the program. There shall be no refund of any monies paid by Babel in any event whatsoever.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel reserves the rights to sell VPC packages at different rates and terms, without prior notice.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Fitness Instructor/Personal Trainer expressly notes that results will differ for each individual member based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Fitness Instructor/Personal Trainer expressly notes that results will differ for each individual member based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`During each session the member is required to wear appropriate athletic footwear and loose, comfortable clothing to facilitate ease of movement. The member is not permitted to bring other individuals with him or her for the virtual sessions.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel and its Fitness Instructors shall not be held liable for any damages or injury to the member during VPC sessions. Babel is also not responsible for the safety of facilities or equipment (if applicable) within the member’s workout area, whether provided by the member himself or herself, Fitness Instructor/Personal Trainer, or others.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`No implied warranties or representations are made other than those expressly contained herein and this document contains all of the terms of the Agreement between the parties.`}
                    </li>
                </ol>

                <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
                  <Button 
                    raised color='primary' 
                    key={'okButton'} 
                    style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe'}} 
                    onClick={()=>this.setState({showTermNCondition:false})}>
                    OK
                  </Button>
                </div>
              </div>
            </Dialog>
        );
    };

    renderShowDialog = (message) => {
        const {classes} = this.props;
        return(
          <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showErrorDialog}>
            <div 
              style = {{backgroundColor:'white', paddingBottom:10, paddingLeft:50, paddingRight:50}}
              // className = {classes.contentInner}
              >
              <Typography 
                style={{textAlign:'center', marginBottom:20, fontWeight:800}}
                className={classes.smallMontSerrat}
                >
                {message}
              </Typography>
              <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex'}}>
                <SquareButton
                    text = {'OK'}
                    key = {'okDialogButton'}
                    onClick={()=>this.setState({showErrorDialog:false})}
                />
              </div>
            </div>
          </Dialog>
        );
    };

    renderBookingList () {
        const {classes} = this.props;
        console.log('renderBookingList state: ', this.state);
        console.log('renderBookingList props: ', this.props);
        const {allBookingMap} = this.state;
        const user = this.props.currentUser || null;
        const roles = (user && user.get('roles')) || (user && user.get('staffRole'));
        const userEmail = user && user.get('email');
        const currentUserId = user && user.get('id');
        var currentTrainerBookingMap = {};
        const currentTrainerBookings = this.props.bookings || null;
        console.log('currentTrainerBookings: ', currentTrainerBookings);
        console.log('theBookingMap: ', allBookingMap);

        // const bookingType = currentTrainerBookings && currentTrainerBookings.get('type');
        // console.log('bookingType: ', bookingType);
        // const bookingStatus = currentTrainerBookings && currentTrainerBookings.get('status');
        // console.log('bookingStatus: ', bookingStatus);

        return(
            <div style = {{maxWidth:'1080px', alignItems:'center', justifyContent:'center', flex:1, display:'flex', flexDirection:'column'}}>
                {this.renderHeader()}
                {this.renderMedText('BOOKER HOST EMAIL')}
                {false && (currentTrainerBookings && Object.keys(currentTrainerBookings).length > 0) && Object.keys(currentTrainerBookings).map((itemParent, i)=>{
                    Object.keys(itemParent).map((item, j)=>{
                        const bookingData = allBookingMap[item];
                        const hostEmail = bookingData && bookingData.hostEmail;
                        const trainerId = bookingData && bookingData.trainerId;
                        const startAt = bookingData && bookingData.startAt;
                        const startAtDateFormat = startAt && moment(Actions.getTheDate(startAt)).tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY h:mm a');
                        const location = bookingData && bookingData.location;
                        return(
                            <div 
                                // color='primary' 
                                key={`confirmMsgText${j}`} 
                                className = {classes.confirmMsgTxtBox}
                                onClick = {()=>{
                                    console.log('go to booking page...');
                                    this.props.actions.viewBookExclusiveId(item)
                                }}
                                style = {{cursor:'pointer'}}
                                >
                                {this.renderSmallText(`daya jlkasjd`, 'white', 2)}
                                {this.renderSmallText(`HOST: ${hostEmail}`, 'white', 2)}
                                {this.renderSmallText(`Date: ${startAtDateFormat}`, 'white', 2)}
                                {this.renderSmallText(`${location}`, 'white', 2)}
                                
                            </div>
                        )
                    });
                })

                }
                {(allBookingMap && Object.keys(allBookingMap).length != 0) && Object.keys(allBookingMap).map((item, i)=>{
                    // console.log('allbookingI: ', i);
                    // console.log('allBookingItem: ', item);
                    const bookingData = allBookingMap[item];
                    const hostEmail = bookingData && bookingData.hostEmail;
                    const trainerId = bookingData && bookingData.trainerId;
                    const startAt = bookingData && bookingData.startAt;
                    const startAtDateFormat = startAt && moment(Actions.getTheDate(startAt)).tz('Asia/Kuala_Lumpur').format('DD/MM/YYYY h:mm a');
                    const location = bookingData && bookingData.location;
                    // console.log('trainerId: ', trainerId);
                    if (currentUserId === trainerId){
                        return(
                            <div 
                                // color='primary' 
                                key={`confirmMsgText${i}`} 
                                className = {classes.confirmMsgTxtBox}
                                onClick = {()=>{
                                    console.log('go to booking page...');
                                    this.props.actions.viewBookExclusiveId(item)
                                }}
                                style = {{cursor:'pointer'}}
                                >
                                {this.renderSmallText(`HOST: ${hostEmail}`, 'white', 2)}
                                {this.renderSmallText(`Date: ${startAtDateFormat}`, 'white', 2)}
                                {this.renderSmallText(`${location}`, 'white', 2)}
                              
                            </div>
                        )
                    }
                    else{
                        {this.renderMedText('SORRY, NO BOOKING FOR YOU YET')}
                    }
                })}
                {(allBookingMap && Object.keys(allBookingMap).length === 0) && this.renderLoading()}
                <SquareButton
                    text = {'Log Out'}
                    key = {'logOutBtn'}
                    onClick = {()=>{
                        console.log('log out');
                        this.props.actions.logout();
                    }}
                    selectedButton = {true}
                />
            </div>
        )
    }

    render() {
      const {classes} = this.props;
    //   console.log('theprops: ', this.props)
      const staff = this.props.staff || null;
      const vendProductId = this.props.match.params.vendProductId;
      const urlSearchString = this.props.location.search;
      const urlEmail = urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
  
      var vId = vendProductId;
      const {bookingId, showLoading, guestMap, guestWhNumber, guestExist, showGuestResult, isTrainerLink} = this.state;
      var guestEmail = this.state.guestEmail;
    
        // get the current user first

        const user = this.props.currentUser || null;
        const roles = (user && user.get('roles')) || (user && user.get('staffRole'));
        const userEmail = user && user.get('email');
        const isTrainer = (user && user.get('roles'))? user.get('roles').get('trainer'):(user && user.get('staffRole') === 'trainer')?true:false;
        const isCRO = (user && user.get('roles'))? user.get('roles').get('mc'):(user && user.get('staffRole') === 'CRO')?true:false;
        
      const vendProducts = this.props.vendProducts;
      const vendProduct = (vendProducts && vId) ? vendProducts.get(vId) : null
      const vendProductName = vendProduct && vendProduct.get('name');
      const vendSupplyPrice = vendProduct && vendProduct.get('supply_price');
      const vendPriceBookPrice = vendProduct && vendProduct.get('price_book_entries') && vendProduct.get('price_book_entries').first() && vendProduct.get('price_book_entries').first().get('price');
      const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
      const vendPrice = vendPriceAmount ? `${parseInt(vendPriceAmount)}` : null;
  
      const mcId = this.state.mcId;
      const mc = mcId && staff && staff.get(mcId) ? staff.get(mcId) : null;
      const mcName = mc && mc.has('name') ? mc.get('name') : null;
      const mcImage = mc && mc.has('image') ? mc.get('image') : null;
      const mcAvatar = mcImage || (mcName && mcName.length > 0) ?
        (mcImage ? (<Avatar src={mcImage} />) : (<Avatar>{mcName.charAt(0).toUpperCase()}</Avatar>)) :
        null;
  
      const lowerCaseEmail = urlEmail ? urlEmail.toLowerCase() : this.state.email.toLowerCase();
      const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
      const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
      
      var guestArray = [];
      Object.entries(guestMap).forEach(([key, data])=>{
        if (data){
            data.userId = key;
            guestArray.push(data);
        }
      });

    const fullNameLabel = 'Full Name (as stated on your IC/Passport)';
    const howDidUknowLabel = 'How did you know about us?';
    const whatUWantToAchieveLabel = 'What would you like to achieve?';
    const emailLabel = 'Email';
    const phoneNumberLabel = 'Phone Number';
    const postCodeLabel = 'Where are you from? (Just the postcode would do)';


      if (bookingId && !isTrainerLink){
          return(
            <div className={classes.container}>
                {!this.state.showSelectVenue && this.renderBookingPage()}
                {this.state.showSelectVenue && this.renderShowSelectVenue()}
                {this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            </div>
          )
      }
      else if (isTrainerLink && bookingId && !user){
        return(
            <div className={classes.container}>
                {this.renderShowLogin(bookingId)}
            </div>
        )
      }
      else if (isCRO){
        return(
            <div className={classes.container}>
                {this.renderHeader()}
                {showLoading && this.renderLoading()}
                {!showLoading && !showGuestResult && <div style={{marginTop:100}} className={classes.center}>
                    {this.renderMedText('GUEST REGISTRATION')}
                    <TextField id = {`whNumberGuest`} 
                        // label= {this.renderLabelText("Whatsapp number", 'gray')}
                        placeholder={"Whatsapp number"}
                        fullWidth
                        onChange={this.handleChange('guestWhNumber')} 
                        type='number'
                        autoComplete='off' 
                        value={guestWhNumber} 
                        defaultValue={guestWhNumber}
                        // className={classes.textFieldIPadMain} 
                        // InputProps={{className: classes.inputTextIPadStyle}}
                        className={classes.textFieldStyle} 
                        InputProps={{className: classes.inputTextStyle}}
                        // InputLabelProps={{
                        //     style: {
                        //       textOverflow: 'ellipsis',
                        //       whiteSpace: 'nowrap',
                        //       overflow: 'hidden',
                        //       width: '100%',
                        //       color: 'green'
                        //     }}}
                        variant="standard"
                        // variant="outlined"
                    />
                    <SquareButton  
                        key={'checkGuestBtn'} 
                        text = {'GO'}
                        onClick={()=>{this.handleFetchGuest()}}
                    />
                </div>}
                {!guestExist && showGuestResult && !showLoading && this.renderMedText('USER DOESNT EXIST')}
                {!guestExist && showGuestResult && !showLoading &&
                    <div className={classes.center}>
                    <SquareButton  
                        key={'resetButton'} 
                        text = {'CHECK AGAIN'}
                        onClick={()=>{this.setState({showGuestResult:false})}}
                    />
                    </div>
                }
                {guestExist && showGuestResult && !showLoading &&
                    guestArray.map(data=>{
                        const guestName = data.name;
                        const whNumber = data.whNumber;
                        const guestUserId = data.userId;
                        const email = data.email;
                        const membershipStarts = data.autoMembershipStarts? data.autoMembershipStarts:data.membershipStarts?data.membershipStarts:null;
                        const isStaff = data.isStaff;
                        const postcode = data.postcode;

                        // if (!email){
                        if (email){
                            return(
                                <div className = {classes.center}>
                                    {this.renderMedText(`WELCOME ${guestName}`)}
                                    {this.renderMedText(whNumber)}
                                    <div style = {{marginLeft:50, marginRight:50}}>
                                        {this.renderSmallText('Before we proceed, I would need a little more information from you')}
                                    </div>
                                    <TextField id = {`emailGuest`} 
                                        // label= {this.renderLabelText(emailLabel, 'gray')}
                                        placeholder={emailLabel}
                                        fullWidth
                                        onChange={this.handleChange('guestEmail')} 
                                        autoComplete='off' 
                                        value={guestEmail} 
                                        defaultValue={email}
                                        // className={classes.textFieldIPad} 
                                        // InputProps={{className: classes.inputTextIPadStyle}}
                                        className={classes.textFieldStyle} 
                                        InputProps={{className: classes.inputTextStyle}}
                                        variant="standard"
                                    />

                                    <TextField
                                        margin="dense" id="name" 
                                        // label={fullNameLabel} 
                                        placeholder={fullNameLabel}
                                        type="text" fullWidth
                                        onChange={this.handleChange('name')} autoComplete='off'
                                        value={this.state.name}
                                        defaultValue={guestName}
                                        // className={classes.textFieldIPad} 
                                        // InputProps={{className: classes.inputTextIPadStyle}}
                                        className={classes.textFieldStyle} 
                                        InputProps={{className: classes.inputTextStyle}}
                                        variant="standard"
                                    />
                                    
                                    <TextField
                                        margin="dense" 
                                        id="postCode" 
                                        // label={postCodeLabel} 
                                        placeholder={postCodeLabel}
                                        type="number" fullWidth
                                        defaultValue={postcode}
                                        onChange={this.handleChange('postcode')} autoComplete='off'
                                        onInput = {(e) =>{ e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,5)}}
                                        // className={classes.textFieldIPad} 
                                        // InputProps={{className: classes.inputTextIPadStyle}}
                                        className={classes.textFieldStyle} 
                                        InputProps={{className: classes.inputTextStyle}}
                                        variant="standard"
                                    />
                                   

                                    {false && !this.state.refSource && <IntegrationAutosuggest selections='referralSource' placeholder={this.renderSmallText(howDidUknowLabel, 'white')} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>}
                                    {false && this.state.refSource && 
                                    <div style={{marginTop:16}}>
                                        <FormLabel component="legend">
                                            {this.renderSmallText('Referral Source')}
                                        </FormLabel>
                                        <Chip
                                        avatar={null}
                                        label={this.state.refSource}
                                        style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                                        onDelete={()=>this.handleAutosuggest('refSource', null)}
                                        />
                                    </div>
                                    }
                                    {false && !this.state.achieveTargetSource && <IntegrationAutosuggest selections='achieveTargetSource' placeholder={whatUWantToAchieveLabel} onSelectionChange={selectedAchieveTargetSource => this.handleAutosuggest('achieveTargetSource', selectedAchieveTargetSource)}/>}
                                    {false && this.state.achieveTargetSource && 
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
                                    {false && !mcId &&
                                    <IntegrationAutosuggest selections='membershipConsultants' placeholder="Customer Relations Officer's Name" onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>
                                    }
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
                                     <SquareButton  
                                        key={'submitGuestEmail'} 
                                        text = {'GO'}
                                        onClick={()=>{this.handleAddGuestEmail(guestUserId, guestName, postcode)}}
                                    />
                                </div>
                            );
                        }
                        // else if (email && !membershipStarts && !isStaff){
                        else if (email && !membershipStarts){
                            return(
                                <div className = {classes.center}>
                                    {this.renderMedText(`Guest Email: ${email}`)}
                                </div>
                            )
                        }
                        else if (email && !membershipStarts && isStaff){
                            return(
                                <div className = {classes.center}>
                                    {this.renderMedText(`Staff Email: ${email}`)}
                                </div>
                            )
                        }
                        else if (email && membershipStarts){
                            return(
                                <div className = {classes.center}>
                                    {this.renderMedText(`member is not eligible for this program: ${email}`)}
                                </div>
                            )
                        }
                    })
                }
            </div>
          )
      }
      else if (isTrainer && !isTrainerLink){
          // show all booking id by the trainer
          return(
            <div className={classes.container}>
                {this.renderBookingList()}
            </div>
          );
      }
      else{
        return (
            <div className={classes.container}>
                {this.renderShowLogin()}
                {false && !this.state.showLoading && !this.state.showKeyInDetails && !this.state.showSelectVenue && this.renderShowSelection()}
                {true && !this.state.showLoading && !this.state.showSelectTrainer && !this.state.showSelectVenue && this.renderShowClassSelection()}
                {this.state.showSelectVenue && !this.state.showLoading && !this.state.showSelectTrainer && this.renderShowSelectVenue()}
                {this.renderShowConfirm()}
                {!this.state.showLoading && this.state.showSelectTrainer && this.renderShowSelectTrainer()}
                {!this.state.showLoading && this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
                {!this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
                {false && this.state.showLoading && this.renderLoading()}
            </div>
          );
      }
    }
  }
  
  bookBabelExclusive.propTypes = {classes: PropTypes.object.isRequired};

  const bookBabelExclusiveStyled = withStyles(styles)(bookBabelExclusive);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getStaff = makeGetStaff();
      const getCurrentUser = makeGetCurrentUser();
      const getBookings = makeGetBabelExclusiveBookings();
      return {
        vendProducts: getVendProducts(state, props),
        staff: getStaff(state, props),
        currentUser: getCurrentUser(state, props),
        bookings: getBookings(state, props)
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(bookBabelExclusiveStyled)
  