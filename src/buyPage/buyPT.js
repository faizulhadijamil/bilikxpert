  import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    List,
    ListItem,
    ListItemText,
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
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';
  import Card, {
    CardContent,
    CardMedia
  } from 'material-ui/Card';
  import Grid from 'material-ui/Grid';
  import React from 'react';
  import Snackbar from 'material-ui/Snackbar';
  import TextField from 'material-ui/TextField';
  // import TextField from '@material-ui/core/TextField';
  import {
    InputAdornment
  } from 'material-ui/Input';
  import Typography from 'material-ui/Typography';
  import {FormGroup, FormControlLabel} from 'material-ui/Form';
  import Checkbox from 'material-ui/Checkbox';
  import AddIcon from '@material-ui/icons/Add';
  import RemoveIcon from '@material-ui/icons/Remove';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import {FormControl} from 'material-ui/Form';
  import Select from 'material-ui/Select';
  import {MenuItem} from 'material-ui/Menu';
  import IntegrationAutosuggest from '../IntegrationAutosuggest';
  import {
    FormLabel
  } from 'material-ui/Form';
  import Chip from 'material-ui/Chip';
  import Avatar from 'material-ui/Avatar';
  import {
    GridList,
    GridListTile
  } from 'material-ui/GridList';
  import AppoinmentCard from '../Appointment/AppointmentCard';
  // import { Button } from 'reactstrap';

  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff,
    makeGetCurrentUser,
    getCurrentUserData,
    makeGetSelectedUserPayments,
    getCurrentUserId,
    makeGetCurrentUserPayments
  } from '../selectors';
  import * as Actions from '../actions';

  import * as firebase from 'firebase';
  import 'firebase/firestore';
  import axios from 'axios';
  import CalendarList from './CalendarList';
  import MenuAppBar from '../MenuAppBar';
  
//   const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const screenWidth = window.innerWidth;
var ismobile = window.innerWidth<=550?true:false;
  
  const styles = theme => ({
    container: {
        width: '100%',
        // maxWidth:'1080px',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        // backgroundColor: "#fcebbe",
    },
    topContainer:{
        // width: screenWidth*0.9,
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#fcebbe",
        paddingBottom: theme.spacing(5),

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
    keyInDetailscontainer:{
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#fcebbe",
        flex:1,
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
        alignItems:'center', justifyContent:'center', width:'90%', maxWidth:'600px', maxHeight:'750px', resizeMode: 'stretch', boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)', borderRadius: 15
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
        height: screenWidth * 0.22,
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
    gridList: {
        // minWidth: 280,
        alignSelf: 'center',
        // height: 'auto',
        backgroundColor: '#fff',
        padding: theme.spacing(2),
        justifyContent:'center',
        alignItems:'center'
        // paddingBottom: theme.spacing(2)2,
        // flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        // transform: 'translateZ(0)',
    },
  });

  const monthAvailableUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/getAppointmentDaysAvailable`;
  const timeAvailableUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/getAppointmentTimeAvailable`;
  const appointmentUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/getDatesAvailable`;
  
  const getAppointmentsUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointment`;
  const addAppointmentUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/postacuityappointment`;
  const getAppointmentById = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentbyId`;
  const updateAppointmentById = `https://us-central1-babelasia-37615.cloudfunctions.net/updateacuityappointmentbyid`;
  const cancelAppoinmentById = `https://us-central1-babelasia-37615.cloudfunctions.net/cancelacuityappointmentbyid`;
  const rescheduleAppoinmentById = `https://us-central1-babelasia-37615.cloudfunctions.net/rescheduleacuityappointmentbyid`;
  const getAllAppointmentType = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmenttypes`;
  const getAvailableAppoinmentDate = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailabledate`;
  const getAvailableAppointmentTime = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailabletime`;
  const getAvailableClasses = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailableclass`;
  const validateTimesAppoinment = `https://us-central1-babelasia-37615.cloudfunctions.net/validatetimesappoinment`;
  const getAppointmentBlocks = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityblocks`;
  const postAppointmentBlock = `https://us-central1-babelasia-37615.cloudfunctions.net/postacuityblocks`;
  const removeAppointmentBlock = `https://us-central1-babelasia-37615.cloudfunctions.net/delacuityblocks`;
  const getAcuityCalendar = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuitycalendars`; 
  const clientAcuity = `https://us-central1-babelasia-37615.cloudfunctions.net/clientacuity`;
  const getLabelAcuity = `https://us-central1-babelasia-37615.cloudfunctions.net/labelsacuity`;
  const getFormsAcuity = `https://us-central1-babelasia-37615.cloudfunctions.net/formssacuity`;

  class buyPT extends React.Component {
  
    state = {
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
      showErrorDialog:false,
      daysAvailable:[],
      selectedDate:null,
      
      // for acuity 
      calendars:[],
      appointmentTypes:[],
      selectedCalendar:null,
      selectedTime:null,
      rescheduleSelectedTime:null,
      selectedAppointType:null,
      selectedRescheduleAppointType:null,
      selectedRescheduleId:null,
      availableDate:[],
      availableTimes:[],
      availableRescheduleDate:[],
      avaialableRescheduleTime:[],

      currentUserPayments: this.props.currentUserPayments||null,
      userappointments:[],
      showsUserAppointment:false,
      availableCredit:0,
      showReschedulePopup:false
    }
  
    componentDidMount() {

      const injectedScript = document.createElement('script');

        // get all appointments
        axios.get(getAppointmentsUrl)
        .then(res => {
            console.log('allAppoinments: ', res);
            const appointments = res && res.data && res.data.appointments;
            this.setState({appointments});
        });
        // this.fetchData();
        // post, add appointment or booking (hardcode)
        // var addAppointmentBody = {
        //     "appointmentTypeID" : 14239364,
        //     // "calendarID": 3933580,
        //     "calendarID": 3933422, // KJ
        //       "datetime" : "2020-05-15T09:00",
        //       "firstName":"faizul",
        //       "lastName": "hadikish",
        //       "email": "faizulklcc@babel.fit",
        //       "phone": "01102928282"
        // }

        // axios.post(addAppointmentUrl, addAppointmentBody)
        // .then(res => {
        //     console.log('addAppoinmentRes: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        // }).catch(e=>{
        //   console.log('addAppoinmentResError: ',e);
        // })

        // // get appointment or booking by id (hardcode)
        // var appointmentIdBody = {"acuityId":"377332900"}
        // axios.post(getAppointmentById, appointmentIdBody)
        // .then(res => {
        //   console.log('getAppoinmentById: ', res);
        //   const appointments = res && res.data && res.data.appointments;
        //   // this.setState({appointments});
        // });

        //  // update appointment or booking by id (hardcode)
        //  var updateAppointmentIdBody = {
        //     "acuityId":"377332900",
        //     "email":"faizulklcc@babel.fit"
        //   }
        //  axios.put(updateAppointmentById, updateAppointmentIdBody)
        //  .then(res => {
        //    console.log('updateAppointmentById: ', res);
        //    const appointments = res && res.data && res.data.appointments;
        //    // this.setState({appointments});
        //  });

          // cancel appointment or booking by id (hardcode)
          // var cancelAppointmentIdBody = {
          //   "acuityId":"378184917",
          //   "cancelNote":"Test cancel!"
          //   }
          // axios.put(cancelAppoinmentById, cancelAppointmentIdBody)
          // .then(res => {
          //   console.log('cancelAppoinmentById: ', res);
          //   const appointments = res && res.data && res.data.appointments;
          //   // this.setState({appointments});
          // });

          // reschedule appointment or booking by id (hardcode)
          // var rescheduleAppointmentIdBody = {
          //   "acuityId":"377927385",
          //   "datetime": "2020-05-13T14:00:00+0800"
          // }
          // axios.put(rescheduleAppoinmentById, rescheduleAppointmentIdBody)
          // .then(res => {
          //   console.log('rescheduleAppoinmentById: ', res);
          //   const appointments = res && res.data && res.data.appointments;
          //   // this.setState({appointments});
          // });

          // get all appointments types
          axios.get(getAllAppointmentType)
          .then(res => {
              console.log('allAppoinment types: ', res);
              const appointmentTypes = res && res.data && res.data.appointmenttypes;
              this.setState({appointmentTypes});
          });

        //   // get available appointment date (hardcode)
        //   var availableDateappointmentIdBody = {
        //     "appointmentTypeID" : 13983587,
        //     "month":"2020-05",
        //     "calendarID": 3866248 // optional
        //   }
        //   axios.post(getAvailableAppoinmentDate, availableDateappointmentIdBody)
        //   .then(res => {
        //     console.log('getAvailableAppoinmentDate: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

        //    // get available appointment time (hardcode)
        //    var availableTimeappointmentIdBody = {
        //     "appointmentTypeID" : 13983587,
        //     "date":"2020-05-08",
        //     "calendarID": 3866248
        //   }
        //   axios.post(getAvailableAppointmentTime, availableTimeappointmentIdBody)
        //   .then(res => {
        //     console.log('getAvailableAppointmentTime: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

        //    // get available class (hardcode)
        //    var availableClassappointmentIdBody = {
        //     "appointmentTypeID" : 13983587, // optional
        //     "month":"2020-05", // must
        //     "calendarID": 3866248 // optional
        //   }
        //   axios.post(getAvailableClasses, availableClassappointmentIdBody)
        //   .then(res => {
        //     console.log('getAvailableClasses: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

          // post, add appointment or booking (hardcode)
          // var validateAppointmentBody = {
          // 	"appointmentTypeID" : 14239364,
          //   "datetime":"2020-05-15T16:00:00-0800",
          //   "calendarID": 3933422
          // }
          // axios.post(validateTimesAppoinment, validateAppointmentBody)
          // .then(res => {
          //     console.log('validateAppoinmentRes: ', res);
          //     const appointments = res && res.data && res.data.appointments;
          //     // this.setState({appointments});
          // });

        //   // get appointments blocks
        //   axios.get(getAppointmentBlocks)
        //   .then(res => {
        //       console.log('getAppointmentBlocks: ', res);
        //       const appointments = res && res.data && res.data.appointments;
        //       // this.setState({appointments});
        //   });

        //    // post, add appointment block (hardcode)
        //    var appointmentBlockBody = {
        //   	"start": "2020-05-06 12:00am", 
        //     "end": "2020-05-10 11:59pm", 
        //     "calendarID": "3866248",
        //     "notes": "Happy New Year!"
        //   }
        //   axios.post(postAppointmentBlock, appointmentBlockBody)
        //   .then(res => {
        //       console.log('postAppointmentBlock: ', res);
        //       const appointments = res && res.data && res.data.appointments;
        //       // this.setState({appointments});
        //   });

        //   // post, remove appointment block (hardcode)
        //   var removeAppointmentBlockBody = {
        //     "blockId": "3400734213"
        //   }
        //   axios.post(removeAppointmentBlock, removeAppointmentBlockBody)
        //   .then(res => {
        //       console.log('removeAppointmentBlock: ', res);
        //       const appointments = res && res.data && res.data.appointments;
        //       // this.setState({appointments});
        //   });

          // get calendars
          axios.get(getAcuityCalendar)
          .then(res => {
              console.log('getAcuityCalendar: ', res);
              const calendars = res && res.data && res.data.calendars;
              this.setState({calendars});
          });

        //   // search for client
          // var clientBody = {
          //   "search": "faizul"
          // }
          // axios.post(clientAcuity, clientBody)
          // .then(res => {
          //     console.log('clientAcuityRes: ', res);
          //     const appointments = res && res.data && res.data.appointments;
          //     // this.setState({appointments});
          // });

        //   // add client
        //   var addclientBody = {
        //     "firstName": "hadijamil", 
        //     "lastName": "Burger", 
        //     "phone": "555-555-5555",
        //     "email":"jamil@boontan.net",
        //     "notes":"manually add, optional to add"
        //   }
        //   axios.post(clientAcuity, addclientBody)
        //   .then(res => {
        //     console.log('clientAcuityadd: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

        //   // update client - doesnt work?
        //   var updateclientBody = {
        //     "firstName": "hadijamil", 
        //     "lastName": "Burger", 
        //     "phone": "555-555-5555",
        //     "email":"jam@boontan.net",
        //     "notes":"manually add, optional to add"
        //   }
        //   axios.put(clientAcuity, updateclientBody)
        //   .then(res => {
        //     console.log('clientAcuityupdate: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

        //   // remove client - working
        //   var removeclientBody = {
        //     "firstName": "hadijamil", 
        //     "lastName": "Burger", 
        //     "removeClient":true
        //   }
        //   axios.post(clientAcuity, removeclientBody)
        //   .then(res => {
        //     console.log('clientAcuityremove: ', res);
        //     const appointments = res && res.data && res.data.appointments;
        //     // this.setState({appointments});
        //   });

        //    // get forms
        //    axios.get(getFormsAcuity)
        //    .then(res => {
        //        console.log('getFormsAcuity: ', res);
        //        const label = res && res.data && res.data.label;
        //        // this.setState({appointments});
        //    });

        //    // get label
        //    axios.get(getLabelAcuity)
        //    .then(res => {
        //        console.log('getLabelAcuity: ', res);
        //        const label = res && res.data && res.data.label;
        //        // this.setState({appointments});
        //    });

        // axios.post('/user', {
        //   firstName: 'Fred',
        //   lastName: 'Flintstone'
        // })
        // .then(function (response) {
        //   console.log(response);
        // })
        // .catch(function (error) {
        //   console.log(error);
        // }); 

      
        // var acuity = Acuity.basic({
        //   userId: '19463819',
        //   apiKey: 'ce1bf0313a0259f39b2e20c7fb48e11d'
        // });

        // acuity.request('appointments', function (err, res, appointments) {
        //   if (err) return console.error(err);
        //   console.log('appointmentsFaizul:', appointments);
        // });

        // axios.get(timeAvailableUrl)
        // .then(res => {
        //     console.log('axiosTest: ', res);
        //     const timeAvailable = res && res.data && res.data.timeAvailable;
        //     this.setState({timeAvailable});
        // });

        // let username = '19463819';
        // let password = 'ce1bf0313a0259f39b2e20c7fb48e11d';
        // let headers = new Headers();
        // headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

        // let url = "https://acuityscheduling.com/api/v1/availability/dates?appointmentTypeID=13983587&month=2020-04&calendarID=3866248&timezone=Asia/Kuala_Lumpur";

        // axios.get(url)
        // .then(res => {
        //     console.log('axiosTest: ', res);
        //     const persons = res.data;
        //     this.setState({ persons });
        // });
        
        // let username = '19463819';
        // let password = 'ce1bf0313a0259f39b2e20c7fb48e11d';
        // let headers = new Headers();
        // headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
        // let url = "https://acuityscheduling.com/api/v1/availability/dates?appointmentTypeID=13983587&month=2020-04&calendarID=3866248&timezone=Asia/Kuala_Lumpur";
        // fetch(url,
        // {
        //     method:'GET',
        //     headers:headers
        // })
        // .then(res => {
        //     console.log('result: ', res);
        //     res.json()
        // })
        // .then(res => this.setState({ planets: res }))
        // .catch(()=>{console.log("Can’t access " + url + " response. Blocked by browser?")});
      
      // console.log('didmountProps: ', this.props);
      // this.props.actions.getPaymentsByUserId(userId);
    }
  
    componentWillUnmount() {
      
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    fetchData(){
      // get all appoinment from the current member (hardcode)
      const currentUserData = this.props.currentUserData;
      const email = currentUserData && currentUserData.get('email');
      const name = currentUserData && currentUserData.get('name');
      const phone = currentUserData && currentUserData.get('phone');
      console.log('fetchDataphone: ', phone);
      console.log('fetchDataemail: ', email);

      var memberAppointmentBody = {
        "email": email,
        "phone": phone
      }
      axios.post(getAppointmentsUrl, memberAppointmentBody)
      .then(res => {
          console.log('getAppointmentsUrl: ', res);
          const appointments = res && res.data && res.data.appointments;
          this.setState({userappointments:appointments});
      }).catch(e=>{
        console.log('getAppointmentsUrlError: ',e);
      })

      // const acuityRef = firebase.firestore().collection('acuity').where("userId", "==", userId).get();

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
        }else if (name === 'scheduleDate') {
          value = moment(value).toDate();
          // defaultValue = moment(defaultValue).toDate();
        }else if(name === 'checked'){
          value = event.target.checked;
        }
        updatedState[name] = value;
        this.setState({...updatedState});
    }
    
    handleCloseDialog = () => this.setState({showTermNCondition:false, showErrorDialog:false});

    handleSelectDay = (dayDate) => {
        console.log('daydate: ', dayDate);
        const timeAvailableUrl = `https://us-central1-babelasia-37615.cloudfunctions.net/getAppointmentTimeAvailable`;

        axios.post(timeAvailableUrl, {
           selectedDate:dayDate
        }).then(function (response) {
            console.log('response:' , response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    handleBuy = () =>{
        // console.log('handleBuyState: ', this.state);
        // const vendVirtualPTID = 'bb719703-58e5-1490-1fd5-f99cafb60333'; // testing

        // const trainerName = 'tony';
        // const lowerCaseEmail = this.state.email.toLowerCase();
        // const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
        // const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

        // const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        // const invalidNameTxt = `Oops!, Error: Please enter full name.`
        // const invalidPhoneTxt = `Oops!, Error: Please enter your phone number.`
        // const invalidCheckedTncText= `Oops!, Error: Please tick on Term and Condition and Privacy Policy.`
        // const invalidCheckedTimeText= `Oops!, Error: Please tick on AM or PM option.`
        // const invalidCheckedDayText= `Oops!, Error: Please tick on the preferred day option.`

        // // this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        // if (this.state.name.length<=3){
        //     this.setState({showErrorDialog:true, errorMessage:invalidNameTxt});
        //     return;
        // }
        // if (!isValidEmail){
        //     // ('invalid email');
        //     this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
        //     return
        // }
        // if (this.state.phone.length<=3){
        //     this.setState({showErrorDialog:true, errorMessage:invalidPhoneTxt});
        //     return;
        // }
        // if (!this.state.checked){
        //     this.setState({showErrorDialog:true, errorMessage:invalidCheckedTncText});
        //     return;
        // }
        // if (!this.state.checkedAM && !this.state.checkedPM){
        //     this.setState({showErrorDialog:true, errorMessage:invalidCheckedTimeText});
        //     return;
        // }
        // if (!this.state.checkedMon && !this.state.checkedTues && !this.state.checkedWed && !this.state.checkedThurs && !this.state.checkedFri && !this.state.checkedSat && !this.state.checkedSun){
        //     this.setState({showErrorDialog:true, errorMessage:invalidCheckedDayText});
        //     return;
        // }

        this.setState({showLoading:true});
        // const selectedAMPM = {AM:this.state.checkedAM? this.state.checkedAM:false, PM:this.state.checkedPM?this.state.checkedPM:false};
        // const selectedDay = {mon:this.state.checkedMon, tues:this.state.checkedTues, wed:this.state.checkedWed, thurs:this.state.checkedThurs, fri:this.state.checkedFri, sat:this.state.checkedSat, sun:this.state.checkedSun};
       
        // hardcode
        const name = 'faizulTest';
        const lowerCaseEmail = 'faizulklcc@babel.fit';
        const phone = '0202020202';
        const vendProductId = 'bb719703-58e5-1490-1fd5-f99cafb60333';
        const credit = 5;
        // const selectedDate = '2020-05-15T09:00:00+0800';
        const {selectedTime, selectedAppointType} = this.state;

        this.props.actions.addInvoiceForPT(name, lowerCaseEmail,phone, vendProductId, selectedAppointType, selectedTime, credit, (response)=>{
        // this.props.actions.addInvoiceForVT(this.state.name, lowerCaseEmail, this.state.phone, this.state.vendProductId, this.state.selectedTrainer, selectedDate, (response)=>{
            console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
            }
        });
    }

    renderShowDialog = (message) => {
        const {classes} = this.props;
        return(
          <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showErrorDialog}>
            <div 
              style = {{backgroundColor:'#fcebbe', paddingBottom:10, paddingLeft:50, paddingRight:50}}
              // className = {classes.contentInner}
              >
              <Typography 
                style={{textAlign:'center', marginBottom:20, fontWeight:800}}
                className={classes.smallMontSerrat}
                >
                {message}
              </Typography>
              <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
                <Button 
                  raised color='primary' 
                  key={'okButton'} 
                  className={classes.smallMontSerrat}
                  style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                  onClick={()=>this.setState({showErrorDialog:false})}>
                  OK
                </Button>
              </div>
            </div>
          </Dialog>
        );
    };

    renderLogoImg(){
        const {classes} = this.props;
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <img src ={require("../assets/babel-icon-blue.png")} alt="logo" style={{width:128, height:128}} />
            </div>
        )
    }
    renderBuyBtn(){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <div 
                className={classes.buttonStyle}
                style = {{cursor: 'pointer',
                    backgroundColor: '#fff',
                    width:isMobile? '4.5rem':'8rem',
                    alignItems:'center', justifyContent:'center',
                    display:'flex', flexDirection:'row', marginTop:20, marginBottom:50
                    // border: '1.5px #solid white',
                    // borderColor: this.state.showKLCC? bgColorNotSelected:bgColorSelected
                }}
                onClick = {()=>this.handleBuy()}
                >
                <p className={classes.boldMontSerrat} style = {{textAlign:'center', fontSize: isMobile? '1rem':'1.5rem',}}>BUY</p>
            </div>
        )
    }

    renderAvailableDays(){
        const {classes} = this.props;
        const {daysAvailable} = this.state;

        console.log('renderAvailableDaysState: ', daysAvailable);
        var theDayList = [];
        console.log('daysAvailableLength: ', daysAvailable.length);
        if (daysAvailable && daysAvailable.length>0){
            // for (var i = 0; i<daysAvailable.length; i++){
            //     console.log('daysAvailable.date: ',daysAvailable[i].date);
            //     theDayList.push(<p style={{color:'red'}}>{daysAvailable[i].date}</p>)
            // }
            daysAvailable && daysAvailable.forEach(days => {
                theDayList.push(
                    <div 
                        style = {{cursor: 'pointer'}}
                        onClick = {()=>this.handleSelectDay(days.date)}
                    >
                         <p key={days.date}>{days.date}</p>
                    </div>
                    )
            });
        }
       
        return(
            <div>
                 <GridList className={classes.gridList} cols={10} cellHeight={50}>
                    {theDayList}
                 </GridList>
            </div>
        )
    }

    // renderAvailableTimes(){
    //     const {classes} = this.props;
    //     const {availableTime} = this.state;

    //     console.log('availableTime: ', availableTime);
    //     var theTimeList = [];
    //     console.log('availableTimeLength: ', availableTime.length);
    //     if (availableTime && availableTime.length>0){
    //         // for (var i = 0; i<daysAvailable.length; i++){
    //         //     console.log('daysAvailable.date: ',daysAvailable[i].date);
    //         //     theDayList.push(<p style={{color:'red'}}>{daysAvailable[i].date}</p>)
    //         // }
    //         availableTime && availableTime.forEach(time => {
    //             theTimeList.push(
    //                 <div 
    //                     style = {{cursor: 'pointer'}}
    //                     // onClick = {()=>this.handleSelectDay(days.date)}
    //                 >
    //                      <p key={time.time}>{time.time}</p>
    //                 </div>
    //                 )
    //         });
    //     }
       
    //     return(
    //         <div>
    //              <GridList className={classes.gridList} cols={10} cellHeight={50}>
    //                 {theTimeList}
    //              </GridList>
    //         </div>
    //     )
    // }

    renderShowKeyInDetails(){
        const {classes} = this.props;
        var {email, name, phone} = this.state;

        // console.log('renderShowKeyInDetailsState: ', this.state);

        const TextFieldEmail = <TextField id="email" label="Email*" fullWidth
            onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8}}/>;

        const TextFieldName = <TextField id="name" label="Full Name (as stated in your IC/Passport) *" fullWidth
            onChange={this.handleChange('name')} autoComplete='off' value={name} style={{marginBottom:8}}/>;

        const TextFieldPhoneNum = <TextField id="phone" label="Phone Number *" fullWidth
            onChange={this.handleChange('phone')} autoComplete='off' value={phone} type='number'
            style={{marginBottom:8}}/>;

        return(
            <div className={classes.keyInDetailscontainer}>
                {this.renderLogoImg()}
                <Grid container spacing={24} direction="row" justify="center" alignItems="center" 
                    >
                    <div style = {{marginTop:20, backgroundColor:'#fff', borderRadius:20, margin:20, width:'80%', padding:20}}>
                        <Typography type="title" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1}}
                        >{'FILL IN YOUR DETAILS'}
                        </Typography>
                        {TextFieldName}
                        {TextFieldEmail}
                        {TextFieldPhoneNum}
                        <Typography type="subheading" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{marginBottom:10, marginTop:40, letterSpacing:1}}
                        >{'Available Days'}
                        </Typography>
                        {this.renderAvailableDays()}
                        <Typography type="subheading" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{marginBottom:10, marginTop:40, letterSpacing:1}}
                        >{'Available Time'}
                        </Typography>
                    
                    </div>
                </Grid>
                <FormGroup row style={{justifyContent:'center', marginLeft:30, marginRight:20}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleChange('checked')}
                            value="checked"
                        />
                        }
                        label={(
                        <div>I agreed to the <a style={{textDecoration: 'underline'}} 
                            onClick={()=>this.handleViewTermsConditions()}>Terms & Conditions</a>
                        </div>)}
                    />
                </FormGroup>
                {this.renderBuyBtn()}
                <BabelLogo hideLogo = {true}/>
            </div>
        );
    }

    renderGetAppointment(){
        const {classes} = this.props;
        return null;
        // return(
        //     <div>
        //       <a 
        //         href="https://app.acuityscheduling.com/schedule.php?owner=19463819" 
        //         target="_blank" class="acuity-embed-button" 
        //         style="background: #313131; color: #fff; padding: 8px 12px; border: 0px; -webkit-box-shadow: 0 -2px 0 rgba(0,0,0,0.15) inset;-moz-box-shadow: 0 -2px 0 rgba(0,0,0,0.15) inset;box-shadow: 0 -2px 0 rgba(0,0,0,0.15) inset;border-radius: 4px; text-decoration: none; display: inline-block;">
        //           Schedule Appointment</a>
        //         <link rel="stylesheet" href="https://embed.acuityscheduling.com/embed/button/19463819.css" id="acuity-button-styles" />
        //         <script src="https://embed.acuityscheduling.com/embed/button/19463819.js" async></script>
        //     </div>
        // )
    }

    handleSelectCalendar(data){
      console.log('handleSelectCalendar: ', data)
      this.setState({selectedCalendar:data});
      const getAvailableAppoinmentDate = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailabledate`;
      
      // get available appointment date (hardcode)
      // var availableDateappointmentIdBody = {
      //   "appointmentTypeID" : 13983587,
      //   "month":"2020-05",
      //   "calendarID": 3866248 // optional
      // }
      // axios.post(getAvailableAppoinmentDate, availableDateappointmentIdBody)
      // .then(res => {
      //   console.log('getAvailableAppoinmentDate: ', res);
      //   const appointments = res && res.data && res.data.appointments;
      //   // this.setState({appointments});
      // });
    }

    handleSelectAppoinmentType(data, reschedule=false){
      
      console.log('handleSelectAppoinmentType: ', data);
      this.setState({selectedAppointType:data});
      console.log('handleSelectAppoinmentTypeState: ', this.state.selectedAppointType);
      const getAvailableAppoinmentDate = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailabledate`;
      
      // get available appointment date (hardcode)
      var availableDateappointmentIdBody = {
        "appointmentTypeID" : reschedule? data.appointmentTypeID:data.id,
        // "month":"2020-05",
        "month":moment().format('YYYY-MM')
        // "calendarID": 3866248 // optional
      }
      axios.post(getAvailableAppoinmentDate, availableDateappointmentIdBody)
      .then(res => {
        console.log('getAvailableAppoinmentDate: ', res);
        const availableDate = res && res.data && res.data.availableDate;
        if (!reschedule){
          this.setState({availableDate});
        }
        else{
          this.setState({availableRescheduleDate:availableDate});
        }
      });
    }

    handleSelectDate(data, reschedule=false){
      const {reschedulePopupData, selectedAppointType} = this.state;

      this.setState({selectedDate:data.date});
      console.log('handleSelectDate: ', data);
      const getAvailableAppointmentTime = `https://us-central1-babelasia-37615.cloudfunctions.net/getacuityappointmentavailabletime`;

      // get available appointment time (hardcode)
      var availableTimeappointmentIdBody = {
        "appointmentTypeID" : reschedule? reschedulePopupData.appointmentTypeID:selectedAppointType.id,
        "date":data.date,
        // "calendarID": 3866248
      }
      axios.post(getAvailableAppointmentTime, availableTimeappointmentIdBody)
      .then(res => {
        console.log('getAvailableAppointmentTime: ', res);
        const availableTimes = res && res.data && res.data.times;
        if (!reschedule){
          this.setState({availableTimes});
        }
        else{
          this.setState({availableRescheduleTime:availableTimes});
        }
      });
    }

    handleSelectTime(data, reschedule=false){
      if(!reschedule){
        this.setState({selectedTime: data.time});
      }
      else{
        this.setState({rescheduleSelectedTime:data.time});
      }
    }

    // renderShowAvailableCalendar(){
    //   const {classes} = this.props;
    //   const {calendars} = this.state;

    //   console.log('thecalendars: ', calendars);
    //   // shoulfd use this style instead
    //   // return (
    //   //   <div>
    //   //     <CalendarList data = {calendars}/>
    //   //   </div>
    //   // )

    //   return(
    //     <div>
    //       <p>show available calendar</p>
    //       {calendars.map((data)=>{
    //       return (
    //         <div>
    //           <img src = {data.image} width={100} height={100}/>
    //           <p>{data.email}</p>
    //           <Button 
    //               raised color='primary' 
    //               key={'okButton'} 
    //               style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
    //               onClick={()=>this.handleSelectCalendar(data)}>
    //                 SELECT
    //             </Button>
    //         </div>
    //       )
    //     })}
    //     </div>
    //   )
    // }

    renderShowAvailableAppoinmentsDates(){
      const {classes} = this.props;
      const {selectedCalendar, selectedAppointType, availableDate} = this.state;

      console.log('renderShowAvailableAppoinmentsDates: ', this.state);
      if (selectedAppointType){
        return(
          <div>
            <p>{'selected Appoinment: ' + selectedAppointType.name}</p>
            {
              availableDate.map((data)=>{
                return(
                  <div>
                     <Button 
                      raised color='primary' 
                      key={'okButton'} 
                      style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                      onClick={()=>this.handleSelectDate(data)}>
                        {data.date}
                    </Button>
                  </div>
                )
              })
            }
          </div>
        )
      }
    }

    renderShowAvailableAppoinmentsTimes(){
      const {classes} = this.props;
      const {selectedCalendar, selectedAppointType, availableDate, availableTimes} = this.state;

      console.log('renderShowAvailableAppoinmentsTimes: ', this.state);
      if (selectedAppointType){
        return(
          <div>
            <p>{'selected Appoinment: ' + selectedAppointType.name}</p>
            {
              availableTimes.map((data)=>{
                return(
                  <div>
                     <Button 
                      raised color='primary' 
                      key={'okButton'} 
                      style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                      onClick={()=>this.handleSelectTime(data)}>
                        {data.time}
                        {data.slotsAvailable}
                    </Button>
                  </div>
                )
              })
            }
          </div>
        )
      }
    }

    // rendershowAvailableAppoinmentType(){
    //   const {classes} = this.props;
    //   const {appointmentTypes} = this.state;

    //   return(
    //     <div>
    //     <p>show available appoinment</p>
    //     {appointmentTypes && appointmentTypes.map((data)=>{
    //     return (
    //       <div>
    //         <p>{data.name}</p>
    //         <Button 
    //             raised color='primary' 
    //             key={'okButton'} 
    //             style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
    //             onClick={()=>this.handleSelectAppoinmentType(data)}>
    //               SELECT
    //           </Button>
    //       </div>
    //     )
    //   })}
    //   </div>
    //   )
    // }

    renderShowAvailableAppoinmentTimes(){

    }

    renderCurrentUser(){

      const currentUserData = this.props.currentUserData;
      const roles = currentUserData && currentUserData.get('roles');
      const isNormalMember = !roles;
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = currentUserData && currentUserData.get('email');
      
      const name = currentUserData && currentUserData.get('name');

      const currentUserId = this.props.currentUserId;

      return(
        <div>
          <h1>currentuser</h1>
          <h2>{email}</h2>
          <h2>{name}</h2>
        </div>
      )
    }

    renderAvailableCredit(){

      const currentUserPayments = this.props.currentUserPayments;
      // const userId = currentUserPayments && currentUserPayments.get("userId");
      // const type = currentUserPayments && currentUserPayments.get('type');
      // console.log('currentUserPayments: ', currentUserPayments);
      // console.log('currentUserPaymentsUID: ', userId);
      // console.log('currentUserPaymentsType: ', type);

      var currentPayment = [];
      var currentPaymentLayout = [];
      currentUserPayments && currentUserPayments.toKeyedSeq().forEach((payment, index) => {
        const userId = payment.get('userId')||null;
        const type = payment.get('type')||null;
        const credit = payment.get('credit')||null;
        const selectedTime = payment.get('selectedTime')||null;
        const createdAt = payment.get('createdAt')||null;
        const appoinmentName = payment.get('appoinmentName')||null;
        const paidStatus = payment.get('status')||null;
        console.log('currentUserPaymentsUID: ', userId);
        console.log('currentUserPaymentsType: ', type);

        console.log('credit: ', credit);
        if (type === 'personalTraining'){
          // currentPayment.push({createdAt, credit, selectedTime, appoinmentName})
          currentPaymentLayout.push(
            <div>
              <h2>credit left: {credit}</h2>
              <h2>created on: {createdAt}</h2>
              <h2>paid status: {paidStatus}</h2>
              <h2>appoinment Name: {appoinmentName}</h2>
              <h2>selected appoinment Time: {selectedTime}</h2>
            </div>
          )
        }
      })

      if (currentPaymentLayout.length>0){
        return(
          <div>
            {currentPaymentLayout}
          </div>
        )
      }
    }

    handleBook = () =>{
      const currentUserPayments = this.props.currentUserPayments;
      var currentPayment = [];
      var currentPaymentMap = {};
      currentUserPayments && currentUserPayments.toKeyedSeq().forEach((payment, index) => {
        const userId = payment.get('userId')||null;
        const type = payment.get('type')||null;
        const credit = payment.get('credit')||null;
        const selectedTime = payment.get('selectedTime')||null;
        const createdAt = payment.get('createdAt')||null;
        const appoinmentName = payment.get('appoinmentName')||null;
        const paidStatus = payment.get('status')||null;
        const paymentId = index||null;
        console.log('currentUserPaymentsUID: ', userId);
        console.log('currentUserPaymentsType: ', type);
        console.log('paymentId: ', index);

        console.log('credit: ', credit);
        if (type === 'personalTraining' && credit>0){
          currentPayment.push({createdAt, credit, selectedTime, appoinmentName, paymentId})
        }
      });

      console.log('currentPayment: ', currentPayment);
      
      // hardcode first. need to change
      if (currentPayment.length <= 0){
        alert('not enough credit, please buy more credit');
        return;
      }
      if (currentPayment[0].credit < 1){
        alert('not enough credit');
        return;
      }

      const currentUserData = this.props.currentUserData;
      const email = currentUserData && currentUserData.get('email');
      const name = currentUserData && currentUserData.get('name');
      var lastName = currentUserData && currentUserData.get('lastName');
      const phone = currentUserData && currentUserData.get('phone');

      if (!lastName.replace(/\s/g, '').length) {
        console.log('string only contains whitespace (ie. spaces, tabs or line breaks)');
        lastName = 'not provided';
      }
      const {selectedTime, selectedCalendar, selectedAppointType} = this.state;
      // post, add appointment or booking 
      var addAppointmentBody = {};
      if (currentUserData && email && name && phone && selectedTime, selectedAppointType){
        addAppointmentBody = {
          "appointmentTypeID" : selectedAppointType.id,
          // "calendarID": 3933580,
          "calendarID": selectedCalendar,
          "datetime" : selectedTime,
          "firstName":name,
          "lastName": lastName? lastName:'null',
          "email": email,
          "phone": phone
        }

        console.log('addAppointmentBody: ', addAppointmentBody);
        axios.post(addAppointmentUrl, addAppointmentBody)
        .then(res => {
            console.log('addAppoinmentRes: ', res);
            const appointments = res && res.data && res.data.appointments;
            if (appointments.error){
              alert(appointments.message);
            }
            else{
              alert('appoinment successfully added');
              // hardcode
              const paymentId = currentPayment[0].paymentId;
              const updatedCredit = currentPayment[0].credit - 1;
              // updated the credit
              this.props.actions.updateAppoinmentCredit(paymentId, updatedCredit);
            }

            // this.setState({appointments});
        }).catch(e=>{
          console.log('addAppoinmentResError: ',e);
        })
      }

      

      // this.props.actions.addInvoiceForPT(name, lowerCaseEmail,phone, vendProductId, selectedAppointType, selectedTime, credit, (response)=>{
      //   // this.props.actions.addInvoiceForVT(this.state.name, lowerCaseEmail, this.state.phone, this.state.vendProductId, this.state.selectedTrainer, selectedDate, (response)=>{
      //       console.log('response: ', response);
      //       if (response){
      //           this.setState({showLoading:false});
      //       }
      //   });
    }

    renderBookAppoinment(){
      const {classes} = this.props;
      const {isMobile} = this.state;
      return(
          <div 
              className={classes.buttonStyle}
              style = {{cursor: 'pointer',
                  backgroundColor: '#fff',
                  width:isMobile? '4.5rem':'8rem',
                  alignItems:'center', justifyContent:'center',
                  display:'flex', flexDirection:'row', marginTop:20, marginBottom:50
                  // border: '1.5px #solid white',
                  // borderColor: this.state.showKLCC? bgColorNotSelected:bgColorSelected
              }}
              onClick = {()=>this.handleBook()}
              >
              <p className={classes.boldMontSerrat} style = {{textAlign:'center', fontSize: isMobile? '1rem':'1.5rem',}}>BOOK</p>
          </div>
      )
    }

    handleShowUserAvailableAppoinment = () => {
      this.fetchData();
      this.setState({showsUserAppointment:true});
    }

    renderUserShowAvailableAppointment(){

      const {classes} = this.props;
      const {isMobile} = this.state;
        return(
          <div 
              className={classes.buttonStyle}
              style = {{cursor: 'pointer',
                  backgroundColor: '#fff',
                  width:isMobile? '4.5rem':'8rem',
                  alignItems:'center', justifyContent:'center',
                  display:'flex', flexDirection:'row', marginTop:20, marginBottom:50
                  // border: '1.5px #solid white',
                  // borderColor: this.state.showKLCC? bgColorNotSelected:bgColorSelected
              }}
              onClick = {()=>this.handleShowUserAvailableAppoinment()}
              >
              <p className={classes.boldMontSerrat} style = {{textAlign:'center', fontSize: isMobile? '1rem':'1.5rem',}}>show selectedAppoinment</p>
          </div>
        );
    }

    handleRescheduleAppoinment = (id, datetime) => {
      // reschedule appointment or booking by id (hardcode)
      var rescheduleAppointmentIdBody = {
        "acuityId":id,
        "datetime": datetime
      }
      axios.put(rescheduleAppoinmentById, rescheduleAppointmentIdBody)
      .then(res => {
        console.log('rescheduleAppoinmentById: ', res);
        const appointments = res && res.data && res.data.appointments;
        // this.setState({appointments});
      });
    }
    
    handleCancelAppoinment = (data) => {

      const canCancelAppointment = moment().subtract(72, 'hours');

      const currentUserPayments = this.props.currentUserPayments;
      var currentPayment = [];
      var currentPaymentMap = {};
      currentUserPayments && currentUserPayments.toKeyedSeq().forEach((payment, index) => {
        const userId = payment.get('userId')||null;
        const type = payment.get('type')||null;
        const credit = payment.get('credit')||null;
        const selectedTime = payment.get('selectedTime')||null;
        const createdAt = payment.get('createdAt')||null;
        const appoinmentName = payment.get('appoinmentName')||null;
        const paidStatus = payment.get('status')||null;
        const paymentId = index||null;
        console.log('currentUserPaymentsUID: ', userId);
        console.log('currentUserPaymentsType: ', type);
        console.log('paymentId: ', index);

        console.log('credit: ', credit);
        if (type === 'personalTraining'){
          currentPayment.push({createdAt, credit, selectedTime, appoinmentName, paymentId})
        }
      });
      
      if (moment(data.datetime).isBefore(moment().add(12, 'hours'))){
        alert('appointment cant be cancelled 12 hours before the event time');
        return;
      }
      // cancel appointment or booking by id (hardcode)
      var cancelAppointmentIdBody = {
        "acuityId":data.id,
        "cancelNote":"cancel from app"
        }
      axios.put(cancelAppoinmentById, cancelAppointmentIdBody)
      .then(res => {
        console.log('cancelAppoinmentById: ', res);
        const appointments = res && res.data && res.data.appointments;
        
        console.log('currentPayment: ', currentPayment);

         // hardcode
        const paymentId = currentPayment[0].paymentId;
        const updatedCredit = currentPayment[0].credit + 1;

        // updated the credit
        this.props.actions.updateAppoinmentCredit(paymentId, updatedCredit);
        // this.setState({appointments});
      });
    }

    handleShowRescheduleOption = (data) => {
      
    }

    handleShowRescheduleAppoinment = (data) => {
      console.log('handleShowRescheduleAppoinmentData: ', data)
      this.handleSelectAppoinmentType(data, true);
      this.setState({showReschedulePopup:true, reschedulePopupData:data});
    }

    // renderShowAvailableAppointment(){

    //   const {classes} = this.props;
    //   const {isMobile, showsUserAppointment, userappointments} = this.state;

    //   console.log('renderShowAvailableAppointment: ', this.state);

    //   if (showsUserAppointment){
    //     return (
    //       <div>
    //         {userappointments && userappointments.map((data)=>{
    //           return (
    //             <AppoinmentCard 
    //               data = {data}  
    //               onCancel = {()=>{this.handleCancelAppoinment(data)}}
    //               // onShowAppoinment = {()=>{this.show}}
    //               onShowRescheduleAppointment = {()=>{this.handleShowRescheduleAppoinment(data)}}
    //             />
    //           )
    //         })}
    //       </div>
        
    //     )
    //     // return(
    //     //   <div>
    //     //     {userappointments && userappointments.map((data)=>{
    //     //       return (
    //     //         <div>
    //     //           <h3>date created: {data.dateCreated}</h3>
    //     //           <h3>location: {data.location}</h3>
    //     //           <h3>appoinment date: {data.datetime}</h3>
    //     //           <h3>type: {data.type}</h3>
    //     //           <h3>calendar: {data.calendar}</h3>
    //     //           <div style = {{flexDirection:'row'}}> 
    //     //             {/* <Button onClick={()=>{this.handleRescheduleAppoinment(data.id, "2020-05-21T13:00:00+0800")}}>reschedule</Button> */}
                    
    //     //             <Button onClick = {()=>{this.handleShowRescheduleOption(data)}}>reschedule</Button>

    //     //             <Button onClick={()=>{this.handleCancelAppoinment(data)}}>cancel</Button>
    //     //           </div>
                 
    //     //           <br/>
    //     //         </div>
    //     //       )
    //     //     })}
    //     //   </div>
    //     // )
    //   }
    // }

    handleClose = () => {
      this.setState({showReschedulePopup:false});
    }

    handleSaveReschedule = (data) => {
      console.log('handleSaveRescheduleState: ', data);
      const {rescheduleSelectedTime} = this.state;
      this.handleRescheduleAppoinment(data.id, rescheduleSelectedTime);
    }

    renderReschedulePopup(){
      const {classes} = this.props;
      const {reschedulePopupData} = this.state;
      const {selectedCalendar, selectedRescheduleAppointType, availableRescheduleDate, availableRescheduleTime} = this.state;

      console.log('reschedulePopupData: ', reschedulePopupData);
      console.log('availableRescheduleDate: ', availableRescheduleDate);
      return(
        <Dialog 
            key={'recheduleDialog'} 
            open={this.state.showReschedulePopup} 
            onClose={this.handleClose}
            >
            <DialogContent>
            <DialogTitle style={{textAlign:'center'}}>{'RESCHEDULE'}</DialogTitle>
            <DialogContentText>{'pick the date'}</DialogContentText>
            {
              availableRescheduleDate && availableRescheduleDate.map((data)=>{
                return(
                  <div>
                     <Button 
                      raised color='primary' 
                      key={'okButton'} 
                      style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                      onClick={()=>this.handleSelectDate(data, true)}>
                        {data.date}
                    </Button>
                  </div>
                )
              })
            }
            {
              availableRescheduleTime && availableRescheduleTime.map((data)=>{
                return(
                  <div>
                     <Button 
                      raised color='primary' 
                      key={'okButton'} 
                      style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                      onClick={()=>this.handleSelectTime(data, true)}>
                        {data.time}
                        {data.slotsAvailable}
                    </Button>
                  </div>
                )
              })
            }
            </DialogContent>
            <DialogActions>
            <Button key={'cancel'} onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button 
              key={'saveEdit'} 
              className={classes.bookButton} 
              raised 
              onClick={()=>this.handleSaveReschedule(reschedulePopupData)}
              // disabled = {!this.state.editUserData.cancellationDate}
              >
              {'Save'}
            </Button>
            </DialogActions>
          </Dialog>
      );
    }

    render() {
      const {classes} = this.props;
      
      return (
        <div className={classes.container}>
          <MenuAppBar/>
            <p>testbuypt</p>
            {this.renderCurrentUser()}
            {this.renderAvailableCredit()}
            {this.renderUserShowAvailableAppointment()}
            {false && this.renderShowAvailableAppointment()}
            {false && this.renderShowAvailableCalendar()}
            {false && this.rendershowAvailableAppoinmentType()}
            {this.renderShowAvailableAppoinmentsDates()}
            {this.renderShowAvailableAppoinmentsTimes()}
            {this.renderReschedulePopup()}
            {this.renderBookAppoinment()}
            {this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            {this.renderShowKeyInDetails()}
            {false && this.renderGetAppointment()}
            {true && <iframe 
                src="https://app.acuityscheduling.com/schedule.php?owner=19463819" 
                width="100%" height="800" frameBorder="0" title="Schedule Appointment"
                >
            </iframe>}
            {true && <script src="https://d3gxy7nm8y4yjr.cloudfront.net/js/embed.js" type="text/javascript"></script>}
        </div>
      );
    }
  }
  
  buyPT.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyPTStyled = withStyles(styles)(buyPT);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const getStaff = makeGetStaff();
    const getCurrentUser = makeGetCurrentUser();
    const getUserPayments = makeGetCurrentUserPayments();

    const mapStateToProps = (state, props) => {
      return {
        currentuser: getCurrentUser(state, props),
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        vendProducts: getVendProducts(state, props),
        staff: getStaff(state, props),
        currentUserData: getCurrentUserData(state, props),
        currentUserId:getCurrentUserId(state, props),
        currentUserPayments: getUserPayments(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyPTStyled)
  