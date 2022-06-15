import {
    CircularProgress
  } from 'material-ui/Progress'
  import {
    Dialog,
    DialogActions,
    DialogContent,
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
  import RoundButton from '../components/RoundButton2';
  
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff
  } from '../selectors';
  import * as Actions from '../actions';

  // import ReactPixel from 'react-facebook-pixel';

  import * as firebase from 'firebase';
  import 'firebase/firestore';
  
//   const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
var ismobile = window.innerWidth<=550?true:false;
  
  const styles = theme => ({
    checkBoxStyle:{
        color:'#F7B23D',
        '&:hover': {
            backgroundColor: 'transparent',
          },  
    },
    container: {
        // width: '100%',
        // maxWidth:'1080px',
        // justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#ececec",
        minHeight:screenHeight
        // backgroundColor: "#fcebbe",
    },
    topContainer:{
        // width: screenWidth*0.9,
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        // backgroundColor: "#0C0C07",
        paddingBottom: theme.spacing(5),
        marginTop:50

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
        flex:1,
        marginTop:20,
        marginBottom:30
    },

    boldMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing:1,
        
    },
    normalMontSerrat:{
        fontFamily: "Montserrat",
        fontWeight: 400,
        //textTransform: "uppercase",
    },
    smallMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        fontWeight: 200,
        textAlign:'center', marginLeft:'10%', marginRight:'10%', marginTop:0, letterSpacing:1
        // textTransform: "uppercase",
    },
    mainImgClass:{
        alignItems:'center', justifyContent:'center', width:'80%', maxWidth:'600px', maxHeight:'750px', resizeMode: 'stretch', 
        // boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)', 
        // borderRadius: 15,
        // border: '2.5px solid black',
    },
    pcnphoneImgClass:{
        alignItems:'center', justifyContent:'center', width:'25%', maxWidth:'300px', maxHeight:'300px', resizeMode: 'stretch', 
    },
    spinImgClass:{
        alignItems:'center', justifyContent:'center', width:'70%', maxWidth:'550px', maxHeight:'700px', resizeMode: 'stretch', 
        // boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)', 
        // borderRadius: 15,
        // border: '2.5px solid black',
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
    
  });
  
  let lastScrollY = 0;

  class buySpinBikeRental extends React.Component {
  
    state = {
      email: '',
      name: '',
      firstName:'',
      lastName:'',
      phone: '',
      icNumber: '',
      deliveryAddress:'',
      deliveryCity:'',
      deliveryCountry:'',
      landedOrCondo:'',
      deliveryNotes:'',
      dialogOpen: false,
      checked:false,
      refSource: null,
      mcId: null,

      qty:1,
      spinRentalArray:[],
      selectedPackage:null,
      selectedPackageName:null,
      mainImgUrl:null,
      refSpinImgUrl:null,
      showSelection:true,
      showKLCC:true,
      showTTDI:false,
      showTermNCondition:false,
      showKeyInDetails:false,
      showLoading:false,
      isMobile: false,
      vendProductId: null,
      showErrorDialog:false,

      showBikeOptions:false,
    }
  
    componentDidMount() {
        // ReactPixel.init('372348337059911');

        window.addEventListener('scroll', this.handleScroll, true);
        this.scrollTo(0);
        this.setState({isMobile:(window.innerWidth<=550)?true:false});
      // this.props.actions.addInvoiceForProduct();
        const refMainImg = firebase.storage().ref('virtualClass/spinbikerental01.png');
        refMainImg.getDownloadURL()
        .then(url => {this.setState({mainImgUrl:url})})
        .catch(e=>{console.log(e);});

        const refSpinImg = firebase.storage().ref('virtualClass/group_cycle.jpg');
        //   const url = ref.getDownloadURL();
        //   console.log('theurl: ', url);
        refSpinImg.getDownloadURL()
        .then(url => {this.setState({refSpinImgUrl:url})})
        .catch(e=>{console.log(e);})

        const refpcnphoneImg = firebase.storage().ref('virtualClass/pc_phone.png');
        refpcnphoneImg.getDownloadURL()
        .then(url => {this.setState({refpcnphoneImgUrl:url})})
        .catch(e=>{console.log(e);});

        // to fetch all spinRental
        const spinRentalData= firebase.firestore().collection('products')
        .where('type', '==', 'spinBikeRental')
        .get();

        var spinRentalArray = [];
        spinRentalData && spinRentalData.then((querySnapshot)=>{
            querySnapshot.forEach(doc=>{
                var data = doc.data();
                // console.log('trainerData: ', data);
                spinRentalArray.push(data);
            });
            console.log('spinRentalArray: ', spinRentalArray);
            this.setState({spinRentalArray});
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

    handleChange = name => event => {
      var updatedState = {};
      var value = event.target.value;
      if(name === 'checked'){
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

    // onTrainerBtnPress = name => event => {
    //     console.log('onTrainerBtnPressName: ', name);
    //     console.log('onTrainerBtnPressEvent: ', event);

    //     this.setState({

    //     })
    // };
    onTrainerBtnPress = (name) => {
        // console.log('onTrainerBtnPressName: ', name);
     
    }

    renderTrainerBtnSelection(name = null){
        // console.log('renderTrainerBtnSelectionState: ', this.state);
        const {classes} = this.props;
        const {isMobile} = this.state;
        const bgColorSelected = '#fff';
        const bgColorNotSelected = '#fcebbe';
        // console.log('renderTrainerBtnSelectionName: ', name);
        // console.log('selectedTrainer: ', this.state.selectedTrainer);
        const isSelected = (name === this.state.selectedTrainer)? true:false;

        return(
            <div
                className={classes.buttonStyle}
                style = {{
                    cursor: 'pointer', 
                    backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
                    border: '1.5px solid white',
                    borderColor: isSelected? bgColorNotSelected:bgColorSelected,
                    margin:'2%',
                    paddingTop:'1%',
                    paddingBottom:'1%',
                    paddingLeft:'5%',
                    paddingRight:'5%',
                    width: isMobile? '4rem':'7.5rem'
                    // maxWidth:'30%'
                }}
                onClick = {()=>{if (name){this.onTrainerBtnPress(name)}}}
            >
                <Typography 
                    className={classes.boldMontSerrat}
                    type="subheading" component="h1" color="primary" noWrap={true}
                    style={{textAlign:'center', marginTop:0, marginBottom:0, fontSize:isMobile? '0.5rem':'1.1rem'}}>
                    {name? name: 'NOT AVAILABLE'}
                </Typography>
            </div>
        )
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

    showTrainerList = (trainerArray, className) =>{
        if (!this.state.selectedTrainerList){
            this.setState({selectedTrainerList:trainerArray, selectedClass:className, selectedTrainer:null});
        }
        else if (this.state.selectedClass === className){
            this.setState({selectedTrainerList:null, selectedClass:null, selectedTrainer:null});
        }
        else{
            this.setState({selectedTrainerList:null, selectedTrainer:null, selectedClass:null});
        }
    }

    renderConfirmButton(){
        const {classes} = this.props;
        const bgColorSelected = '#fcebbe';
        const bgColorNotSelected = '#fff';

        return(
           
                <RoundButton
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
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:20}}>
                <img src ={require("../assets/babelIconBlack.png")} alt="logo" style={{width:'70px', height:'70px'}} />
            </div>
        )
    }

    renderShowClassSelection () {
        const {classes} = this.props;

        console.log('renderShowClassSelection: ', this.state);
        const {classesArray, selectedTrainerList, selectedClass, selectedTrainer} = this.state;

        var classLayout = [];

       classesArray && classesArray.forEach((theClass)=>{
          const className = theClass.name;
          const instructorNames = theClass.instructorNames;
        
          classLayout.push(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                 <RoundButton
                    text = {className}
                    key = {className}
                    onClick = {()=>this.showTrainerList(instructorNames, className)}
                    selectedButton = {(selectedClass === className)? true:false}
                />
                {selectedTrainerList && (selectedClass === className) && instructorNames && instructorNames.map(item => {
                    return (
                        <RoundButton  
                            key={item} 
                            text = {item}
                            smallbutton = {true}
                            onClick={()=>{this.setState({selectedTrainer: item})}}
                            selectedButton = {(selectedTrainer === item)? true:false}
                            style = {{width: '10rem'}}
                        />
                    )
                })
              }
            </div>
            )
       });

       if (this.state.showClassOptions){
        return(
            <div 
                // className = "columns"
                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:50}}
                >
                {this.renderBackArrow()}
                {this.renderLogoImg()}
                <Typography 
                    type="title"
                    style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, color:'#F7B23D'}}
                    >{'SELECT YOUR CLASS'}
                </Typography>
                {true && classLayout}
                <div 
                // className = "columns"
                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginTop:30, marginBottom:30}}
                >
                    {!this.state.showKeyInDetails && this.renderConfirmButton()}
                </div>
            </div>
        )
       }
    }

    renderShowSelection () {
        const {classes} = this.props;
        const {mainImgUrl, isMobile} = this.state;

        if (!this.state.showClassOptions){
            return(
                <div style = {{maxWidth:'1080px'}}>
                    <div className={classes.topContainer}>
                        {this.renderLogoImg()}
                        {<div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:20}}>
                            <img src = {mainImgUrl} className={classes.mainImgClass}/>               
                        </div>}
                        <RoundButton
                            text = {'START'}
                            onClick = {()=>{this.setState({showClassOptions:true})}}
                            selectedButton = {(this.state.showClassOptions)? true:false}
                        />
                    </div>
                </div>
            );
        }
    }

    handleCheckBox = name => event => {
        this.setState({[name]: event.target.checked });
    };

    handleViewTermsConditions = () => {this.setState({showTermNCondition:true})}

    renderBackArrow () {
        return(
            <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} onClick={()=>{
                    this.setState({showKeyInDetails:false, showBikeOptions:false})
                }}>
                <ArrowBackIcon style = {{width:'2rem', height:'2rem', color:'black'}}/>
            </div>
        )
    }
    renderShowKeyInDetails(){
        const {classes} = this.props;
        var {email, name, phone, icNumber, deliveryAddress, deliveryCity, landedOrCondo, deliveryCountry, deliveryNotes, firstName, lastName} = this.state;

        // console.log('renderShowKeyInDetailsState: ', this.state);

        const TextFieldEmail = <TextField id="email" label="EMAIL*" fullWidth
            onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8}}/>;

        const TextFieldName = <TextField id="name" label="Full Name (as stated in your IC/Passport) *" fullWidth
            onChange={this.handleChange('name')} autoComplete='off' value={name} style={{marginBottom:8}} 
            multiline rowsMax={3}
            />;

        const TextFieldFirstName = <TextField id="fname" label="FIRST NAME*" fullWidth
            onChange={this.handleChange('firstName')} autoComplete='off' value={firstName} style={{marginBottom:8}} 
            multiline rowsMax={3}
            />;
        
        const TextFieldLastName = <TextField id="lastName" label="LAST NAME*" fullWidth
            onChange={this.handleChange('lastName')} autoComplete='off' value={lastName} style={{marginBottom:8}} 
            multiline rowsMax={3}
            />;
        
        const TextFieldICNumber = <TextField id="icNumber" label="IC NUMBER/PASSPORT*" fullWidth
            onChange={this.handleChange('icNumber')} autoComplete='off' value={icNumber} type='number' style={{marginBottom:8}}/>;

        const TextFieldPhoneNum = <TextField id="phone" label="CONTACT NUMBER*" fullWidth
            onChange={this.handleChange('phone')} autoComplete='off' value={phone} type='number'
            style={{marginBottom:8}}/>;
        
        const TextFieldDeliveryAddress = <TextField id="deliveryAddress" label="DELIVERY ADDRESS*" fullWidth
            onChange={this.handleChange('deliveryAddress')} autoComplete='off' value={deliveryAddress} style={{marginBottom:8}}
            multiline rowsMax={4}
            />;
        
        const TextFieldDeliveryCity = <TextField id="deliveryCity" label="CITY" fullWidth
            onChange={this.handleChange('deliveryCity')} autoComplete='off' value={deliveryCity} style={{marginBottom:8}}
            />;

        const TextFieldDeliveryCountry = <TextField id="deliveryCountry" label="COUNTRY" fullWidth
            onChange={this.handleChange('deliveryCountry')} autoComplete='off' value={deliveryCountry} style={{marginBottom:8}}
            />;

        const TextFieldLandedOrCondo = <TextField id="landedOrCondo" label="LANDED OR CONDO PROPERTY" fullWidth
            onChange={this.handleChange('landedOrCondo')} autoComplete='off' value={landedOrCondo} style={{marginBottom:8}}
            multiline rowsMax={4}
            />;
            
        const TextFielddeliveryNotes = <TextField id="deliveryNotes" label="NOTES" fullWidth
            onChange={this.handleChange('deliveryNotes')} autoComplete='off' value={deliveryNotes} style={{marginBottom:8}}
            />;

        return(
            <div className={classes.keyInDetailscontainer}>
                <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} onClick={()=>{this.setState({showKeyInDetails:false})}}>
                    <ArrowBackIcon style = {{width:'2rem', height:'2rem'}}/>
                </div>
                <Grid container spacing={24} direction="row" justify="center" alignItems="center">
                    <div style = {{marginTop:0, borderRadius:20, border:'2px solid black', margin:20, width:'80%', padding:15}}>
                        <Typography type="title" 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', marginBottom:10, marginTop:10, letterSpacing:1}}
                        >{'FILL IN YOUR DETAILS'}
                        </Typography>
                        {TextFieldFirstName}
                        {TextFieldLastName}
                        {TextFieldEmail}
                        {TextFieldICNumber}
                        {TextFieldDeliveryAddress}
                        {TextFieldDeliveryCity}
                        {TextFieldDeliveryCountry}
                        {TextFieldPhoneNum}
                        {TextFieldLandedOrCondo}
                        {TextFielddeliveryNotes}
                    </div>
                </Grid>
                {false && <FormGroup row style={{justifyContent:'center', marginLeft:30, marginRight:20}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            className={classes.checkBoxStyle}
                            checked={this.state.checked}
                            onChange={this.handleChange('checked')}
                            value="checked"
                            color={'primary'}
                        />
                        }
                        label={(
                        <div><a style = {{color:'#F7B23D'}}>I agree to the</a> <a style={{textDecoration: 'underline', color:'#F7B23D'}} 
                            onClick={()=>this.handleViewTermsConditions()}>Terms & Conditions</a>
                        </div>)}
                    />
                </FormGroup>}
                {this.renderBuyBtn()}
                {false && <BabelLogo hideLogo = {true}/>}
            </div>
        );
    }

    handleBuy = () =>{
        // console.log('handleBuyState: ', this.state);
        // const vendVirtualPTID = 'bb719703-58e5-1490-1fd5-f99cafb60333'; // testing

        const lowerCaseEmail = this.state.email.toLowerCase();
        const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
       
        const vendProductId = this.state.selectedPackage && this.state.selectedPackage.vendProductId;

        const invalidFirstNameTxt = `Oops!, Error: Please enter first name.`;
        const invalidLastNameTxt = `Oops!, Error: Please enter last name.`;
        const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        const invalidICTxt = `Oops!, Error: Please enter IC.`;
        const invalidDeliveryAddress = `Oops!, Error: Please enter your delivery address.`;
        const invalidDeliveryCity = `Oops!, Error: Please enter your delivery city.`;
        const invalidDeliveryCountry = `Oops!, Error: Please enter your delivery country.`;
        const invalidPhoneTxt = `Oops!, Error: Please enter your phone number`;

        // this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        if (this.state.firstName.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidFirstNameTxt});
            return;
        }
        if (this.state.lastName.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidLastNameTxt});
            return;
        }
        if (!isValidEmail){
            // ('invalid email');
            this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
            return
        }
        if (this.state.icNumber.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidICTxt});
            return;
        }
        if (this.state.deliveryAddress.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidDeliveryAddress});
            return;
        }
        if (this.state.deliveryCity.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidDeliveryCity});
            return;
        }
        if (this.state.phone.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidPhoneTxt});
            return;
        }
        // if (!this.state.checked){
        //     this.setState({showErrorDialog:true, errorMessage:invalidCheckedTncText});
        //     return;
        // }
       
        // console.log('theFinalState: ', this.state);

        this.setState({showLoading:true});
        // const selectedAMPM = {AM:this.state.checkedAM? this.state.checkedAM:false, PM:this.state.checkedPM?this.state.checkedPM:false};
        // const selectedDay = {mon:this.state.checkedMon, tues:this.state.checkedTues, wed:this.state.checkedWed, thurs:this.state.checkedThurs, fri:this.state.checkedFri, sat:this.state.checkedSat, sun:this.state.checkedSun};
        // // this.props.actions.addInvoiceForVT('faizul', 'faizulklcc@babel.fit', '011192929292', vendVirtualPTID, trainerName, selectedAMPM, selectedDay);
        this.props.actions.addInvoiceForSpinBikeRental(this.state.firstName, this.state.lastName, lowerCaseEmail, this.state.icNumber, this.state.qty, this.state.deliveryAddress, this.state.deliveryCity, this.state.deliveryCountry, this.state.phone, this.state.landedOrCondo, this.state.deliveryNotes, vendProductId, (response)=>{
        // this.props.actions.addInvoiceForVTHongKong(this.state.name, lowerCaseEmail, this.state.phone, this.state.vendProductId, this.state.selectedTrainer, selectedAMPM, selectedDay, (response)=>{ 
            console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
            }
        });
    }

    handleBuyNow = () =>{this.setState({showKeyInDetails:true, showBikeOptions:false})}

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

    renderBuyBtn(){
        return(
            <RoundButton  
                key={'BUYBtn'} 
                text = {'CHECK OUT'}
                onClick={()=>{this.handleBuy()}}
            />
        )
    }

    handleCloseDialog = () => this.setState({showTermNCondition:false, showErrorDialog:false});

    renderTextWithNumber (numString, theText){
        const {classes} = this.props;
        const {isMobile} = this.state;

        return(
            <div style={{display:'flex', flex:1, flexDirection:'row'}}>
                <Typography type="body1" component="h1" color="primary" style={{marginBottom:1, color:'rgba(0, 0, 0, 0.54)', width:20}}>
                {numString + ' '}</Typography>
                {<Typography type="body1" component="h1" color="primary" style={{marginBottom:10, color:'rgba(0, 0, 0, 0.54)',}}>
                {theText}</Typography>}
            </div>
        )
    }

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
              style = {{backgroundColor:'#ececec', paddingTop:10, paddingBottom:10, paddingLeft:50, paddingRight:50, border:'2px solid black'}}
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

    renderTopLayout (){
        const {classes} = this.props;
        return(
            <div style = {{marginTop:50}}>
                 {this.renderLogoImg()}
                 <Typography 
                    style={{textAlign:'center', marginBottom:0, fontWeight:600, fontSize:30}}
                    className={classes.normalMontSerrat}
                    >
                    {'RENT A BIKE'}
                </Typography>
                <Typography 
                    style={{textAlign:'center', marginBottom:20, fontWeight:200, fontSize:15}}
                    className={classes.smallMontSerrat}
                    >
                    {'SPIN@HOME'}
                </Typography>
            </div>
        )
    }

    renderFirstPage (){
        const {classes} = this.props;
        const {mainImgUrl, refpcnphoneImgUrl} = this.state;
        return(
            <div style = {{marginTop:0, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:50}}>
                <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:20, borderRadius: 15, border: '2.5px solid black', paddingBottom:20, width:'80%'}}>
                    <img src = {mainImgUrl} className={classes.mainImgClass}/>  
                    <img src = {refpcnphoneImgUrl} className={classes.pcnphoneImgClass}/>                 
                </div>
                <RoundButton
                    text = {`LET'S GET STARTED!`}
                    onClick = {()=>{this.setState({showBikeOptions:true})}}
                    selectedButton = {(this.state.showBikeOptions)? true:false}
                />
            </div>
        );
    }

    renderShowPkg(){
        const {classes} = this.props;
        const {refSpinImgUrl, spinRentalArray, selectedPackage, selectedPackageName, qty} = this.state;
        return(
            <div style = {{marginTop:0, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:50}}>
                {false && <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginBottom:20}}>
                    <img src = {refSpinImgUrl} className={classes.spinImgClass}/>               
                </div>}
                {spinRentalArray && spinRentalArray.map((item, index)=>{
                    const text1 = item.text1;
                    const text2 = item.text2;
                    const text3 = item.text3;
                    const name = item.name||'';
                    const totalPrice = item.totalPrice||'';
                    const rentalPrice = item.rentalPrice||'';
                    const deposit = item.deposit||'';
                    const deliveryFee = item.deliveryFee||'';
                    const packages = item.packages||[];
                    const descriptions = item.descriptions||[];
                    const shippingInfo = item.shippingInfo||'';

                    return(
                        <div>
                            <div 
                                style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', borderRadius:25, marginLeft:'8%', marginRight:'8%', cursor:'pointer', 
                                    border:(selectedPackageName && selectedPackageName === text1)? '2px solid black':null, marginBottom:20}}
                                onClick = {()=>{this.setState({selectedPackage:item, selectedPackageName:text1})}}
                                key = {index}
                                >
                                <img src = {refSpinImgUrl} className={classes.spinImgClass} style={{marginBottom:20}}/>  
                                <Typography 
                                    style={{textAlign:'center', marginBottom:10, fontWeight:400, fontSize:20}}
                                    className={classes.normalMontSerrat}
                                >
                                    {text1}
                                </Typography>
                                <Typography 
                                    style={{textAlign:'center', marginBottom:0, fontWeight:800, fontSize:20}}
                                    className={classes.normalMontSerrat}
                                    >
                                    {text2}
                                </Typography>
                                <Typography 
                                    style={{textAlign:'center', marginBottom:10, fontWeight:400, fontSize:20}}
                                    className={classes.normalMontSerrat}
                                    >
                                    {text3}
                                </Typography>
                            </div>
                            {(selectedPackageName && selectedPackageName === text1) && 
                                <div 
                                    style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginLeft:'15%', marginRight:'15%', marginBottom:20}}
                                    key = {text1}>
                                    {false && <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'row', marginLeft:'15%', marginRight:'15%', marginBottom:20}}>
                                        <Typography 
                                            style={{textAlign:'center', marginBottom:3, fontWeight:800, fontSize:15, marginTop:15}}
                                            className={classes.normalMontSerrat}
                                        >
                                            {`QUANTITY`}
                                        </Typography>
                                        <TextField margin="dense" id="qty" fullWidth
                                            onChange={this.handleChange('qty')} required autoComplete='off'
                                            variant="outlined"
                                            type="number"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={qty}
                                            style={{marginLeft:30, textAlign:'center'}}
                                            
                                        />
                                    </div>}
                                    <RoundButton
                                        text = {`BUY NOW`}
                                        onClick = {()=>{this.handleBuyNow()}}
                                        selectedButton = {true}
                                    />
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:3, fontWeight:800, fontSize:15, marginTop:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {`${name} : ${text1}`}
                                    </Typography>
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:3, fontWeight:200, fontSize:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {`TOTAL : RM${totalPrice}`}
                                    </Typography>
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:3, fontWeight:200, fontSize:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {`(RM${rentalPrice} + SST + RM${deposit} DEPOSIT + RM${deliveryFee} DELIVERY FEE)`}
                                    </Typography>
                                    {(packages && packages.length>0) && 
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:3, fontWeight:800, fontSize:15, marginTop:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {`PACKAGE INCLUDES`}
                                    </Typography>}
                                    {(packages && packages.length>0) && 
                                        packages && packages.map((pkg, index)=>{
                                          return(
                                            <Typography 
                                                style={{textAlign:'center', marginBottom:3, fontWeight:200, fontSize:15}}
                                                className={classes.normalMontSerrat}
                                            >
                                                {pkg}
                                            </Typography>
                                            )  
                                        })
                                    }
                                    <div style = {{marginTop:20}}/>
                                    {(descriptions && descriptions.length>0) && 
                                        descriptions && descriptions.map((desc)=>{
                                          return(
                                            <Typography 
                                                style={{textAlign:'center', marginBottom:3, fontWeight:200, fontSize:15}}
                                                className={classes.normalMontSerrat}
                                            >
                                                {desc}
                                            </Typography>
                                            )  
                                        })
                                    }
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:3, fontWeight:800, fontSize:15, marginTop:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {`SHIPPING INFO`}
                                    </Typography>
                                    <Typography 
                                        style={{textAlign:'center', marginBottom:30, fontWeight:200, fontSize:15}}
                                        className={classes.normalMontSerrat}
                                    >
                                        {shippingInfo}
                                    </Typography>
                                </div>
                            }
                        </div>
                    );
                })}
               
            </div>
        );
    }

    render() {
      const {classes} = this.props;

      const staff = this.props.staff || null;
      const vendProductId = this.props.match.params.vendProductId;
      const urlSearchString = this.props.location.search;
      const urlEmail = urlSearchString.indexOf('?email=' === -1) ? urlSearchString.replace('?email=', '') : null;
  
      var vId = vendProductId;
      var showDetails = false;
      var isAvailable = true;
      var showQuantity = false;
      var isMembershipProduct = false;
      var jan2020Promo = false;
      
      const vendProducts = this.props.vendProducts;
      const vendProduct = (vendProducts && vId) ? vendProducts.get(vId) : null
      const vendProductName = vendProduct && vendProduct.get('name');
      const vendSupplyPrice = vendProduct && vendProduct.get('supply_price');
      const vendPriceBookPrice = vendProduct && vendProduct.get('price_book_entries') && vendProduct.get('price_book_entries').first() && vendProduct.get('price_book_entries').first().get('price');
      const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
      const vendPrice = vendPriceAmount ? `${parseInt(vendPriceAmount)}` : null;
  
      const message = this.props.message || ' ';
  
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
      const isCorpEmail = isValidEmail && (email.indexOf('bfm.my') !== -1 || email.indexOf('bfmedge.com') !== -1 || email.indexOf('fi.life') !== -1);
      const isValidName = this.state.name && this.state.name.length>=4;
      const isValidPhone = this.state.phone && this.state.phone.length>=6;
  
      const name = this.state.name;
      const phone = this.state.phone;
      const quantity = this.state.quantity || 1;
      const icNumber = this.state.icNumber;
      const isValidPostCode = this.state.postcode && this.state.postcode.length>=4;
      const isValidRefSource = this.state.refSource && this.state.refSource.length>=3;
      const isValidMcId = this.state.mcId;
  
      const disableContinue = jan2020Promo? (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone || !isValidPostCode || !isValidRefSource || !isValidMcId ):
      (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone);
  
      const isSpecialTnC = vendProductId === 'd2a533fc-270b-e6e4-ce6e-1f36c942b3f1';

      return (
        <div className={classes.container}>
            {this.renderTopLayout()}
            {!this.state.showKeyInDetails && !this.state.showBikeOptions && this.renderFirstPage()}
            {!this.state.showKeyInDetails && this.state.showBikeOptions && this.renderShowPkg()}
            {true && !this.state.showLoading && this.state.showKeyInDetails && this.renderShowKeyInDetails()}
            {true && !this.state.showLoading && this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            {false && !this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
            {false && this.state.showLoading && this.renderLoading()}
        </div>
      );
    }
  }
  
  buySpinBikeRental.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buySpinBikeRentalStyled = withStyles(styles)(buySpinBikeRental);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getStaff = makeGetStaff();
      return {
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        vendProducts: getVendProducts(state, props),
        staff: getStaff(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buySpinBikeRentalStyled)
  