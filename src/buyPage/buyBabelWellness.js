import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, CircularProgress, Dialog, TextField, InputAdornment, 
    Button, Card, CardContent, CardMedia, Typography, FormGroup, FormControlLabel, 
    Grid, Checkbox, FormControl
} from '@material-ui/core';

  import React from 'react';
  import AddIcon from '@material-ui/icons/Add';
  import RemoveIcon from '@material-ui/icons/Remove';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import RoundButton from '../components/RoundButton';
  
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff,
    getTrainers
  } from '../selectors';
  import * as Actions from '../actions';

  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
//   const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
const screenWidth = window.innerWidth;
var ismobile = window.innerWidth<=550?true:false;

const vBuyOnlineWellnessTier1 = 'a360a14d-3927-b199-e866-8d16463f406b';
const vBuyOnlineWellnessTier2 = 'a295499b-5523-3beb-9d19-993efa2eec76';
const vBuyOnlineWellnessTier3 = '311a8b21-3fe5-44fa-031e-774a4eabd7cb';
const vBuyOnlineWellnessTierX = '659a8ca6-1a97-715b-ee2d-b8c43886fb3f';


const trainerKLCCTier1 = ['Shaun C', 'Sofia', 'Rishon', 'Bryan'];
const trainerKLCCTier2 = ['CRAWFORD'];
const trainerKLCCTierX = ['Tony'];

const trainerTTDITier1 = ['Adam V', 'Naim', 'Kenneth', 'Fadly', 'Soniyah', 'Ren Kai'];
const trainerTTDITier2 = ['Ming Shao', 'Qhalid', 'Delphine'];
const trainerTTDITier3 = ['Sean Lim', 'Hanna', 'Kish'];
const weekButton = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

const coachList = ["Tony", "Kenneth", "Sean Lim", "Delphine"];

  const styles = theme => ({
    container: {
        width: '100%',
        // maxWidth:'1080px',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#836C64",
        // padding:10,
        paddingTop:50,
        // paddingBottom:50
    },
    topContainer:{
        // width: screenWidth*0.9,
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#836C64",
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
        flex:1,
        marginTop:0,
        // border: '1.5px solid white',
    },
    boxKeyInDetailscontainer:{
        alignItem:'center', justifyContent:'center', display:'flex', flexDirection:'column', 
        marginBottom:0, marginTop:30, marginLeft:ismobile? 10:50, marginRight:ismobile? 10:50,
        // boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        borderRadius:ismobile?15:30,
        //backgroundColor:'#BBAFA3',
        width:ismobile? '90%':'70%'
    },
    textInputStyle:{
        backgroundColor:'#836C64', 
        border:'none', 
        borderBottom: '1px solid lightgray', width:'100%', 
        fontSize:16, color:'#fff', fontFamily: "Montserrat",
        fontWeight: 400,
        marginBottom:15,
        lineHeight:2
    },
    textInput:{
        marginBottom:8, width:'95%', margin:'2.5%'
    },
    boldMontSerrat:{
        color:'white', 
        fontFamily: "Montserrat",
        fontWeight: 800,
        textTransform: "uppercase",
    },
    smallMontSerrat:{
        color:'white', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        // textAlign:'center', marginLeft:'10%', marginRight:'10%', 
        // marginTop:10, letterSpacing:1
        // textTransform: "uppercase",
    },
    mainImgClass:{
        alignItems:'center', justifyContent:'center', 
        width: ismobile? '95%':'65%', 
        // maxWidth: ismobile? 600:800, 
        resizeMode: 'stretch', 
        // boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)',
        // marginTop:30
    },
    thumbImgClass:{
      alignItems:'center', justifyContent:'center', width:'18%', maxWidth: ismobile? 50:200, resizeMode: 'stretch', 
      boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)',
      margin:10, cursor: 'pointer', marginTop:20
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
        alignItem:'center', justifyContent:'center', display:'flex', flexDirection:'column', 
        marginBottom:0, marginTop:30, marginLeft:ismobile? 10:50, marginRight:ismobile? 10:50,
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        borderRadius:ismobile?15:30,
        backgroundColor:'#BBAFA3',
        width:ismobile? '90%':'70%'
    },
    topBox:{
        backgroundColor:'#A7998B', padding:ismobile?10:20, 
        borderTopLeftRadius:ismobile? 15:30, borderTopRightRadius:ismobile? 15:30
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
    gridRoot: {
        flexGrow: 1,
        marginTop:ismobile?5:20,
        //marginLeft:20, marginRight:20
    },
    gridContainer:{

    },
    gridLine:{
        height:1, backgroundColor:'#525252', marginLeft:ismobile?10:50, marginRight:ismobile?10:50, 
        marginTop:ismobile? 10:30
    },
    titleFont:{
        letterSpacing:1, fontSize:ismobile? '0.8rem':'1.6rem', color:'#525252', 
        marginLeft:ismobile?25:50,  fontFamily: "Montserrat", fontWeight: 800
    },
    borderLine:{
        border: '1.5px solid white'
    }
  });

  let lastScrollY = 0;

  const timeTableImg = [
    {
      imageSrc:require("../assets/BabelLiveSchedule1.png"),
      key:0
    },
    {
      imageSrc:require("../assets/BabelLiveSchedule2.png"),
      key:1
    },
    {
      imageSrc:require("../assets/BabelLiveSchedule3.png"),
      key:2
    },
    {
      imageSrc:require("../assets/BabelLiveSchedule4.png"),
      key:3
    },
  ];
  class buyBabelWellness extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            ighandlename: '',
            icnumber: '',
            city:'',
            className: '',
            classDate: '',
            dialogOpen: false,
            checked:false,
            refSource: null,
            mcId: null,

            mainImgUrl:null,
            benefitImgUrl:null,
            bottomImgUrl:null,
            week1ImgUrl:null,
            week2ImgUrl:null,
            week3ImgUrl:null,
            week4ImgUrl:null,
            selectedImg:timeTableImg[0].imageSrc, // default
            selectedImgKey:timeTableImg[0].key, // default
            timeTableImg:[],
            showSelection:true,
            showKLCC:true,
            showTTDI:false,
            showTermNCondition:false,
            showKeyInDetails:false,
            showLoading:false,
            isMobile: false,
            vendProductId: '2210efa9-1378-8fe1-1823-3a4bf275e013', // vendproduct for virtual class
            showErrorDialog:false,

            isKLCCSelect:false,
            isTTDISelect:true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }
  
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);

        this.scrollTo(0);
        this.setState({isMobile:(window.innerWidth<=550)?true:false});
      // this.props.actions.addInvoiceForProduct();
        const refMainImg = firebase.storage().ref('virtualmywellness/OnlineWellnessTop1.jpg');
        refMainImg.getDownloadURL()
        .then(url => {this.setState({mainImgUrl:url})})
        .catch(e=>{console.log(e);});

        const refBenefitImg = firebase.storage().ref('virtualmywellness/OnlineWellnesstable.jpg');
        refBenefitImg.getDownloadURL()
        .then(url => {this.setState({benefitImgUrl:url})})
        .catch(e=>{console.log(e);});

        const refBottomImg = firebase.storage().ref('virtualmywellness/onlineWellnessBottomImg.png');
        //   const url = ref.getDownloadURL();
        //   console.log('theurl: ', url);
        refBottomImg.getDownloadURL()
        .then(url => {this.setState({bottomImgUrl:url})})
        .catch(e=>{console.log(e);})
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
      // console.log('theValue: ', value);
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

    scrollTo(number){
        window.scrollTo({
            top: number,
            behavior: "smooth"
        });
    }

    renderConfirmButton(){
        const {classes} = this.props;
        const bgColorSelected = '#fcebbe';
        const bgColorNotSelected = '#fff';

        return(
            <div 
                className={classes.buttonStyle}
                style = {{
                    cursor: 'pointer', 
                    marginTop:20,
                    backgroundColor: this.state.showKeyInDetails? bgColorSelected:bgColorNotSelected,
                    border: '1.5px solid white',
                    borderColor: this.state.showKeyInDetails? bgColorNotSelected:bgColorSelected,
                    justifyContent:'center',
                    alignItems:'center',
                    width:'25%',
                }}
                onClick = {()=>this.handleConfirm()}
                >
                <p className={classes.boldMontSerrat} style = {{textAlign:'center'}}>{'CONFIRM'}</p>
            </div>
        );
    }

    renderLogoImg(blue = false){
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <img src = {blue? require("../assets/babel-icon-blue.png") : require("../assets/babelLogo_white.png")} 
                    alt="logo" style={{width:60, height:60}} />
            </div>
        )
    }

    renderTitleText(){
      const {classes} = this.props;
      const {isMobile} = this.state;
      return(
          <div style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginTop:20}}>
            <Typography type="title" component="h1" color="primary" 
                className={classes.boldMontSerrat}
                style={{textAlign:'center', marginBottom:0, letterSpacing:8, fontSize: isMobile? 24:35}}
            >{'BABEL AT HOME'}
            </Typography>
            <br/>
            <Typography type="title" component="h1" color="primary" 
                className={classes.smallMontSerrat}
                style={{textAlign:'center', marginBottom:10, letterSpacing:isMobile? 2:5, fontSize: isMobile? 12:20}}
            >{'Virtual Classes | Virtual PT | Nutrition Advice'}
            </Typography>
          </div>
      )
    }

    renderTitleTextImg(){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginTop:40}}>
                <img src ={require("../assets/virtualClasstitleLogo.png")} alt="logo" style={{width: isMobile? '60%':'40%', height:isMobile? 40:70}} />
            </div>
        )
    }

    handleSelectImg = (img) =>{this.setState({selectedImg:img.imageSrc, selectedImgKey:img.key})}

    renderh3Text(text){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <Typography type="title" component="h1" color="primary" 
                className={classes.smallMontSerrat}
                style={{textAlign:'center', marginTop:15, letterSpacing:isMobile? 1:1, fontSize: isMobile? 12:15}}
            >{text}
            </Typography> 
        )
    }

    renderTopText(){
        const {mainImgUrl, benefitImgUrl, week1ImgUrl, week2ImgUrl, week3ImgUrl, week4ImgUrl, selectedImg, selectedImgKey, isMobile} = this.state;
        const {classes} = this.props;
        
        return(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', marginLeft:isMobile? 10:50, marginRight:isMobile? 10:50}}>
                <img src = {mainImgUrl} className={classes.mainImgClass} style = {{border:'1.5px solid white'}}/>
                {this.renderh3Text('Experience the Babel you know and love through personalised plans to reach your goals!')}
                {this.renderh3Text(`Cultivate a lifetime of healthy habits with 'Babel At Home' in the safety and comfort of your own home.`)}
                {this.renderh3Text('Get with the programme, select your preferred trainer to get started today.')}
                <img src = {benefitImgUrl} className={classes.mainImgClass} style = {{marginTop:20}}/>
                
                {false && <Grid container className={classes.gridRoot} spacing={isMobile? 8:16}>
                    <Grid item xs={6} justify="center" className={classes.borderLine}>
                        <Typography type="title" component="h1" color="primary" 
                            className={classes.smallMontSerrat}
                            style={{textAlign:'center', marginTop:15, letterSpacing:isMobile? 1:1, fontSize: isMobile? 12:20}}
                        >{'WHAT YOU GET'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography type="title" component="h1" color="primary" 
                            className={classes.smallMontSerrat}
                            style={{textAlign:'center', marginTop:15, letterSpacing:isMobile? 1:1, fontSize: isMobile? 12:20}}
                        >{`WHAT'S INCLUDED`}
                        </Typography>
                    </Grid>
                </Grid>}


            </div>
        )
    }

    handleCheckBox = name => event => {
        this.setState({[name]: event.target.checked });
    };

    handleViewTermsConditions = () => {this.setState({showTermNCondition:true})}

    renderShowKeyInDetails(){
        const {classes} = this.props;
        var {email, name, phone, ighandlename, city, isMobile} = this.state;

        // console.log('renderShowKeyInDetailsState: ', this.state);

        const TextFieldEmail = <TextField id="email" label="EMAIL ADDRESS" className = {classes.textInput}
            onChange={this.handleChange('email')} autoComplete='off' value={email}
            labelClassName = {{ color:'#fff' }}
            inputProps={{ style: {color: 'white'}}}
            />;

        const TextFieldName = <TextField id="name" label="FULL NAME" className = {classes.textInput}
            onChange={this.handleChange('name')} autoComplete='off' value={name}
            inputProps={{ style: {color: 'white'}}}
            />;

        const TextFieldIGHandle = <TextField id="ighandle" label="INSTAGRAM ACCOUNT @" className = {classes.textInput}
            onChange={this.handleChange('ighandlename')} autoComplete='off' value={ighandlename}
            inputProps={{ style: {color: 'white'}}}
            />;

        const TextFieldCity = <TextField id="city" label="WHICH CITY DO YOU LIVE IN?" className = {classes.textInput}
            onChange={this.handleChange('city')} autoComplete='off' value={city}
            inputProps={{ style: {color: 'white'}}}
            />;

        const TextFieldPhoneNum = <TextField id="phone" label="CONTACT NUMBER" className = {classes.textInput}
            onChange={this.handleChange('phone')} autoComplete='off' value={phone} type='number'
            inputProps={{ style: {color: 'white'}}}/>;

        return(
            <div className={classes.keyInDetailscontainer}>
                <div className={classes.boxKeyInDetailscontainer}>
                    <Typography type="title" component="h1" color="primary" 
                        className={classes.boldMontSerrat}
                        style={{textAlign:'center', marginBottom:20, marginTop:0, letterSpacing:1, fontSize: isMobile? 18:40}}
                    >{'FILL IN YOUR DETAILS'}
                    </Typography>
                    
                    <div style = {{border: '1.5px solid white', padding:1, borderRadius:isMobile?15:20}}>
                        {TextFieldName}
                        {TextFieldEmail}
                        {TextFieldPhoneNum}
                        {TextFieldIGHandle}
                        <div style = {{backgroundColor:'#614E45', padding:10}}>
                            <Typography type="title" component="h1" color="primary" 
                                className={classes.boldMontSerrat}
                                style={{textAlign:'center', letterSpacing:isMobile? 1:1, fontSize: isMobile? 12:20}}
                            >{`PREFERRED TIME OF TRAINING`}
                            </Typography>
                        </div>
                        <FormGroup row style={{justifyContent:'center', alignItems:'center'}}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedAM}
                                    onChange={this.handleCheckBox('checkedAM')}
                                    value="checkedAM"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>AM</p>)}
                                style={{marginRight:50}}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedAM}
                                    onChange={this.handleCheckBox('checkedPM')}
                                    value="checkedPM"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>PM</p>)}
                            />
                        </FormGroup>
                        <div style = {{backgroundColor:'#614E45', padding:10}}>
                            <Typography type="title" component="h1" color="primary" 
                                className={classes.boldMontSerrat}
                                style={{textAlign:'center', letterSpacing:isMobile? 1:1, fontSize: isMobile? 12:20}}
                            >{`PREFERRED DAYS OF TRAINING`}
                            </Typography>
                        </div>
                        <FormGroup row style={{paddingBottom:10, paddingTop:10, justifyContent:'center', alignItems:'center'}}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedMon}
                                    onChange={this.handleCheckBox('checkedMon')}
                                    value="checkedMon"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Mon</p>)}
                                // style={{marginRight:50}}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedTues}
                                    onChange={this.handleCheckBox('checkedTues')}
                                    value="checkedTues"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Tues</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedWed}
                                    onChange={this.handleCheckBox('checkedWed')}
                                    value="checkedWed"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Wed</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedThurs}
                                    onChange={this.handleCheckBox('checkedThurs')}
                                    value="checkedThurs"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Thurs</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedFri}
                                    onChange={this.handleCheckBox('checkedFri')}
                                    value="checkedFri"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Fri</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedSat}
                                    onChange={this.handleCheckBox('checkedSat')}
                                    value="checkedSat"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Sat</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedSun}
                                    onChange={this.handleCheckBox('checkedSun')}
                                    value="checkedSun"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>Sun</p>)}
                            />
                        </FormGroup>
                    </div>

                    {false && <div style = {{border: '1.5px solid white', padding:10, borderRadius:isMobile?15:20}}>
                        <input className={classes.textInputStyle} 
                            id="name" type="text" name="name" placeholder="Full Name (as stated in IC/Passport)" 
                            onChange={this.handleChange('name')}
                            autoComplete='off' value={name}
                        />
                    
                        <input className={classes.textInputStyle} 
                            id="ighandle" type="text" name="ighandle" placeholder="INSTAGRAM HANDLE" 
                            onChange={this.handleChange('ighandlename')}
                            autoComplete='off' value={ighandlename}
                        />

                        <input className={classes.textInputStyle} 
                            id="phone" type="number" name="phone" placeholder="CONTACT NUMBER" 
                            onChange={this.handleChange('phone')}
                            autoComplete='off' value={phone}
                        />

                        <input className={classes.textInputStyle} 
                            id="email" type="text" name="email" placeholder="EMAIL ADDRESS" 
                            onChange={this.handleChange('email')}
                            autoComplete='off' value={email}
                        />

                        <input className={classes.textInputStyle} 
                            id="city" type="text" name="city" placeholder="WHICH CITY DO YOU LIVE IN?" 
                            onChange={this.handleChange('city')}
                            autoComplete='off' value={city}
                        />
                    </div>}

                    {false && TextFieldName}
                    {false && TextFieldIGHandle}
                    {false && TextFieldPhoneNum}
                    {false && TextFieldEmail}
                    {false && TextFieldCity}
                    
                </div>
            
                <FormGroup row style={{justifyContent:'center', marginLeft:20, marginRight:20}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleChange('checked')}
                            value="checked"
                        />
                        }
                        label={(
                        <div style = {{color:'white'}}>I agree to the <a style={{textDecoration: 'underline'}} 
                            onClick={()=>this.handleViewTermsConditions()}>Terms & Conditions</a>
                        </div>)}
                    />
                </FormGroup>

                {false && <div style = {{marginTop:20, borderRadius:20, margin:20, width:'72%', padding:20, border: '1.5px solid white'}}>
                    <Typography type="title" component="h1" color="primary" 
                        className={classes.smallMontSerrat}
                        style={{textAlign:'center', marginBottom:10, marginTop:10, letterSpacing:1, fontSize:15}}
                    >{'Upon purchase, please send in a request to follow us on our private BABEL LIVE Instagram account @babel.live for access. We will accept your requests upon confirmation. Thank you!'}
                    </Typography>
                </div>}

                {this.renderBuyBtn()}
                {true && <BabelLogo hideLogo = {true} textColor = '#fff'/>}
                {this.renderBottomImg()}
            </div>
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

    handleBuy = () =>{
        // console.log('handleBuyState: ', this.state.vendProductId);
        // const vendVirtualPTID = 'bb719703-58e5-1490-1fd5-f99cafb60333'; // testing

        const lowerCaseEmail = this.state.email.toLowerCase();
        const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

        const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        const invalidNameTxt = `Oops!, Error: Please enter full name.`
        const invalidIGTxt = `Oops!, Error: Please enter Instagram Handle Name.`
        const invalidPhoneTxt = `Oops!, Error: Please enter your phone number.`
        const invalidCheckedTncText= `Oops!, Error: Please tick on Term and Condition and Privacy Policy.`
        const invalidSelectedTrainerText= `Oops!, Error: Please pick any trainer.`;
        const invalidSelectedCoachText= `Oops!, Error: Please pick any nutrition coach.`
        const invalidCheckedTimeText= `Oops!, Error: Please tick on AM or PM option.`
        const invalidCheckedDayText= `Oops!, Error: Please tick on the preferred day option.`

        // this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        if (!this.state.selectedTrainer){
            this.setState({showErrorDialog:true, errorMessage:invalidSelectedTrainerText});
            return;
        }
        if (!this.state.selectedCoach){
            this.setState({showErrorDialog:true, errorMessage:invalidSelectedCoachText});
            return;
        }
        if (this.state.name.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidNameTxt});
            return;
        }
        if (!isValidEmail){
            // ('invalid email');
            this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
            return
        }
        if (this.state.phone.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidPhoneTxt});
            return;
        }
        if (this.state.ighandlename.length<=2){
            this.setState({showErrorDialog:true, errorMessage:invalidIGTxt});
            return;
        }
        if (!this.state.checkedAM && !this.state.checkedPM){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedTimeText});
            return;
        }
        if (!this.state.checkedMon && !this.state.checkedTues && !this.state.checkedWed && !this.state.checkedThurs && !this.state.checkedFri && !this.state.checkedSat && !this.state.checkedSun){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedDayText});
            return;
        }
        if (!this.state.checked){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedTncText});
            return;
        }

        this.setState({showLoading:true});
      
        const selectedAMPM = {AM:this.state.checkedAM? this.state.checkedAM:false, PM:this.state.checkedPM?this.state.checkedPM:false};
        const selectedDay = {mon:this.state.checkedMon, tues:this.state.checkedTues, wed:this.state.checkedWed, thurs:this.state.checkedThurs, fri:this.state.checkedFri, sat:this.state.checkedSat, sun:this.state.checkedSun};

        this.props.actions.addInvoiceForVWellness(this.state.selectedTrainer, this.state.selectedCoach, lowerCaseEmail, this.state.name, this.state.phone, this.state.ighandlename, selectedAMPM, selectedDay, this.state.vendProductId, (response)=>{
            console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
                if(response.success){
                    console.log('successfully adding invoice');
                }
                else{
                    console.log('error adding invoice', response.error);
                }
            }
        });
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

    renderBuyBtn(){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <div 
                className={classes.buttonStyle}
                style = {{cursor: 'pointer',
                    // backgroundColor: '#fff',
                    width:isMobile? '4.5rem':'8rem',
                    alignItems:'center', justifyContent:'center',
                    display:'flex', flexDirection:'row', marginTop:20, marginBottom:30,
                    borderRadius:35, border: '1.5px solid white'
                }}
                onClick = {()=>this.handleBuy()}
                >
                <p className={classes.boldMontSerrat} style = {{textAlign:'center', fontSize: isMobile? '1rem':'1.3rem',}}>BUY</p>
            </div>
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
                style = {{margin:30, width:'80%', maxWidth:800, display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto'}}
                className = {classes.termNConditionContainer}
                >
                {this.renderLogoImg(true)}
                <Typography 
                  type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}
                  className={classes.boldMontSerrat}
                >
                {`TERMS & CONDITIONS`}
                </Typography>
                <ol type="1">
                    <li color="primary" type="body1"  className={classes.fontTermNCond}>
                        {`All members must provide relevant details by filling in all particulars required for the purpose of the Babel at Home programme (package).`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel at Home programme is valid for purchase by Babel Members only and is limited to one member (one individual) per payment. Members are entitled to start the programme within 24 hours after payment, and will be considered as completed 30 days after the introductory consultation.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Purchased Babel at Home package is non-transferable, not re-sellable, non-refundable and cannot be converted into cash or actual membership packages or purchase of any other items at Babel outlets or Babel Online.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`All interactions required between members and Babel representatives for this programme will be conducted virtually only. Consultation, Virtual Personal Training (VPT), Virtual Group Classes (Babel Live), Nutritional Coaching or any other activities involved under the Babel at Home programme cannot be converted into physical or face-to-face sessions/activities at any point of time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The fee for Babel at Home is payable in advance of granting registrants access to the contents and scheduled activities under the programme. Payments can only be made online on app.babel.fit/babelathome.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The member is not allowed to pay any Babel representative directly for the purpose of purchasing the Babel at Home package or any single item deemed as part of the programme.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel at Home package purchased is non-refundable, even if the member cannot or does not participate in all consultations, check-ins, Virtual Personal Training, Virtual Group Classes (Babel Live), Nutritional Coaching or any other activities involved under the programme. There shall be no refund of any monies by Babel in any event whatsoever.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`All activities scheduled under the Babel at Home programme have an ‘End Date’ or 'Expiration Date', which is 30 days after the member’s start date. The start date will be considered as the date of the Introductory Consultation. If in any case should any item(s) under the purchased package is not finished before the "Expiration Date", all remaining or pending activities under the programme will be forfeited.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Shall his or her Fitness Instructor/Personal Trainer cancels a VPT session within a 24-hour notice period, he or she will be ensured of a substitute Coach for the scheduled session or a mutually agreeable time will be arranged. If the member is not satisfied with services of the current Fitness Instructor/Personal Trainer with solid reasons, we will be glad to offer him or her a different Fitness Instructor/Personal Trainer.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`In any event should the scheduled Fitness Instructor be unable to conduct the scheduled Babel Live streaming session, Babel reserves the right to alter the class, the Fitness Instructor, class timing or cancel the session altogether.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Fitness Instructors expressly note that results will differ for each individual based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The scheduled time for virtual interaction sessions is to be agreed between the trainer and the member. The member must be present virtually on time for the scheduled appointment. If you arrive late (virtually) by any chance, do understand that your session will end at the originally scheduled time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The member must give a TWENTY-FOUR (24) hour cancellation notice for any VPT or the consultation session. It is required for rescheduling or cancelling any scheduled interaction sessions. Failure to do so will result in forfeiture of the sessions and no sessions or payment reimbursement will be granted.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Any tardiness of more than 15 minutes or absence without proper notification will result in forfeiting the VPT session and no sessions or payment reimbursement will be granted. All VPT sessions under the programme will start and end no more than allocated time, as per purchased package (1 hour). Babel or Babel’s Instructors/Personal Trainer reserves the right to end the session if it exceeds over 60 minutes.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Proper nutrition and adequate rest are essential to this programme and the member must not be under the influence of drugs or alcohol at any time during any of the activities scheduled under the programme.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`During each VPT, Babel Live or any workout session, the member is advised to wear appropriate athletic footwear and loose, comfortable clothing to facilitate ease of movement.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel’s Fitness Instructors who are conducting any form of training, coaching or consultation via Zoom or other communication platforms under the Babel at Home programme are not medical professionals and are without expertise to diagnose medical conditions or impairments. The registrant acknowledges his or her own injuries, condition or impairment which may have a detrimental effect on or be impacted by participating in the Babel at Home programme. Babel will not be held responsible for any injuries or harm caused to the registrant at any point of time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The member is obliged to inform Fitness Instructors/Personal Trainers of any dietary restrictions or health conditions for the purpose of undergoing this programme.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel and its Fitness Instructors/Personal Trainers shall not be held liable for any damages, sickness or injury to the member. Babel is also not responsible for the safety of facilities or equipment (if applicable) within the registrant’s workout area, whether provided by the member himself or herself, Fitness Instructor/Personal Trainer, or others.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel shall not be held responsible for the internet connection or data speed of registrants during the streaming of all activities under the Babel at Home programme.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel reserves the rights to sell the Babel at Home package at different rates and terms, without prior notice.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`No implied warranties or representations are made other than those expressly contained herein and this document contains all of the terms of the Agreement between the parties.`}
                    </li>
                </ol>

                <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
                  <Button 
                    raised
                    key={'okButton'} 
                    style={{textAlign:'center', marginBottom:30, alignItems:'center', justifyContent:'center', backgroundColor:'#06318B', color:'#fff'}} 
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
              style = {{paddingBottom:20, paddingTop:20, paddingLeft:50, paddingRight:50}}
              // className = {classes.contentInner}
              >
              <Typography 
                style={{textAlign:'center', marginBottom:20, fontWeight:800, color:'#000'}}
                className={classes.smallMontSerrat}
                >
                {message}
              </Typography>
              <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
                <Button 
                  raised
                  key={'okButton'} 
                  className={classes.smallMontSerrat}
                  style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#06318B', fontWeight:800}} 
                  onClick={()=>this.setState({showErrorDialog:false})}>
                  OK
                </Button>
              </div>
            </div>
          </Dialog>
        );
    };

    onCoachBtnPress = (name) => {this.setState({selectedCoach: name})}

    onTrainerBtnPress = (name) => {
        // console.log('onTrainerBtnPressName: ', name);
        if (trainerKLCCTier1.includes(name) || trainerTTDITier1.includes(name)){this.setState({vendProductId:vBuyOnlineWellnessTier1})}
        else if (trainerKLCCTier2.includes(name) || trainerTTDITier2.includes(name)){this.setState({vendProductId:vBuyOnlineWellnessTier2})}
        else if (trainerTTDITier3.includes(name)){this.setState({vendProductId:vBuyOnlineWellnessTier3})}
        else if (trainerKLCCTierX.includes(name)){this.setState({vendProductId:vBuyOnlineWellnessTierX})}
        this.setState({selectedTrainer: name});
    }

    handleBranchClick = (text = null) => {
        // this.props.actions.buyVT(text);
        if(text === 'KLCC') this.setState({isKLCCSelect:true, isTTDISelect:false, selectedTrainer:null})
        else if (text === 'TTDI') this.setState({isKLCCSelect:false, isTTDISelect:true, selectedTrainer:null});
    }

    handleSelectWeek = (week) => {
        this.setState({selectedWeek:week});
        if (week === weekButton[0]){
            this.setState({selectedImg:timeTableImg[0].imageSrc})
        }
        else if (week === weekButton[1]){
            this.setState({selectedImg:timeTableImg[1].imageSrc})
        }
        else if (week === weekButton[2]){
            this.setState({selectedImg:timeTableImg[2].imageSrc})
        }
        else if (week === weekButton[3]){
            this.setState({selectedImg:timeTableImg[3].imageSrc})
        }
    }

    renderTimeTable(){
        const {classes} = this.props;
        const {isMobile, selectedImg, selectedImgKey} = this.state;
        
        return(
            <div className={classes.boxContainer}>
                 <div className={classes.topBox}>
                    <Typography type="display2" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', letterSpacing:1, fontSize:isMobile? '0.8rem':'1.5rem', color:'#525252'}}
                        >{'BABEL LIVE SCHEDULE'}
                    </Typography>
                    <Typography type="display2" component="h1" color="primary" 
                            className={classes.smallMontSerrat}
                            style={{textAlign:'center', letterSpacing:3, fontSize:isMobile? '0.8rem':'1.5rem', color:'#525252'}}
                        >{'On Demand via IGTV'}
                    </Typography>
                </div>
                <div style={{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column',}}>
                    <img src = {selectedImg} className={classes.mainImgClass}/> 
                    <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                        {false && timeTableImg && timeTableImg.map(img=>{
                        var imgStyle = {padding:10};
                        if (img.key === selectedImgKey){
                            // console.log('imageKey: ',img.key);
                            // console.log('selectedImgKey: ', selectedImgKey);
                            imgStyle = {padding:10, border: '1.5px solid white', borderRadius: isMobile? 10:20}
                        }
                        return(
                            <img src = {img.imageSrc} 
                            className={classes.thumbImgClass}
                            style = {imgStyle}
                            onClick={()=>{this.handleSelectImg(img)}}
                            /> 
                        )
                        })}
                        
                        {weekButton && weekButton.map(week=>{
                            return(
                                <RoundButton
                                    text = {week}
                                    onClick = {()=>{this.handleSelectWeek(week)}}
                                    selectedButton = {(this.state.selectedWeek === week)? true:false}
                                />
                            )
                        })}

                        {false && <Grid container className={classes.gridRoot} spacing={isMobile? 8:16}>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={isMobile?8:16}>
                                {weekButton && weekButton.map(week=>{
                                    return(
                                        <RoundButton
                                            text = {week}
                                        />
                                    )
                                })}
                                </Grid>
                            </Grid>
                        </Grid>}
                    </div>         
                </div>
            </div>
        );
    }

    renderCoachSelection(){
        const {classes} = this.props;
        const {isMobile, selectedCoach} = this.state;
        
        return(
            <div className={classes.boxContainer}>
                 <div className={classes.topBox}>
                    <Typography type="display2" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', letterSpacing:1, fontSize:isMobile? '0.8rem':'1.5rem', color:'#525252'}}
                        >{'CHOOSE YOUR NUTRITION COACH'}
                    </Typography>
                </div>
                {false && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginLeft:0, marginRight:0, marginBottom:10}}>
                    {coachList && coachList.map(coach=>{
                        return(
                            <RoundButton
                                text = {coach}
                                onClick = {()=>{this.onCoachBtnPress(coach)}}
                                selectedButton = {(this.state.selectedCoach===coach)?true:false}
                            />
                            )
                        })
                    }
                </div>}
               
                {true && <Grid container className={classes.gridRoot} spacing={isMobile? 8:16}>
                    <Grid item xs={12}>
                        <Grid container className={classes.gridContainer} justify="center" spacing={isMobile?8:16} style={{marginBottom:10}}>
                            {coachList && coachList.map(coach=>{
                            return(
                                <RoundButton
                                    text = {coach}
                                    onClick = {()=>{this.onCoachBtnPress(coach)}}
                                    selectedButton = {(this.state.selectedCoach===coach)?true:false}
                                />
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>}
                
            </div>
        );
    }

    renderTrainerSelection(){
        const {classes} = this.props;
        const {isMobile, isKLCCSelect, isTTDISelect, selectedTrainer} = this.state;
        // console.log('trainer: ', this.props.trainer);

        return(
            <div className={classes.boxContainer}>
                <div className={classes.topBox}>
                    <Typography type="display2" component="h1" color="primary" 
                        className={classes.boldMontSerrat}
                        style={{textAlign:'center', letterSpacing:1, fontSize:isMobile? '0.55rem':'1.5rem', color:'#525252'}}
                    >{'CHOOSE YOUR VIRTUAL TRAINER'}
                    </Typography>
                </div>
                <div style = {{backgroundColor:'#BBAFA3', padding: isMobile?10:20, 
                    borderBottomLeftRadius:isMobile? 15:30, borderBottomRightRadius:isMobile?15:30}}>
                    <Typography className={classes.titleFont}>
                        {'TIER 1 - RM360'}
                    </Typography>

                    {true && <Grid container className={classes.gridRoot} spacing={isMobile? 8:16}>
                        <Grid item xs={12}>
                            <Grid container className={classes.gridContainer} justify="center" spacing={isMobile?8:16}>
                                {isTTDISelect? trainerTTDITier1 && trainerTTDITier1.map(trainer=>{
                                return(
                                    <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                    />
                                    )
                                }):
                                trainerKLCCTier1 && trainerKLCCTier1.map(trainer=>{
                                    return(
                                        <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                        />
                                    )
                                })
                                }
                            </Grid>
                        </Grid>
                    </Grid>}
                    <div className={classes.gridLine}></div>
                    {isTTDISelect && <Typography className={classes.titleFont} style={{marginTop:10}}>
                        {'TIER 2 - RM395'}
                    </Typography>}
                    {isTTDISelect && <Grid container className={classes.gridRoot} spacing={isMobile? 8:16}>
                        <Grid item xs={12}>
                        <Grid container className={classes.gridContainer} justify="center" spacing={isMobile?8:16}>
                                {isTTDISelect? trainerTTDITier2 && trainerTTDITier2.map(trainer=>{
                                return(
                                    <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                    />
                                    )
                                }):
                                trainerKLCCTier2 && trainerKLCCTier2.map(trainer=>{
                                    return(
                                        <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                        />
                                    )
                                })
                                }
                            </Grid>
                        </Grid>
                    </Grid>}
                    {isTTDISelect && <div className={classes.gridLine}></div>}
                    
                    {isTTDISelect && <Typography className={classes.titleFont} style={{marginTop:10}}>
                    {'TIER 3 - RM430'}
                    </Typography>}
                    {isKLCCSelect && <Typography className={classes.titleFont} style={{marginTop:10}}>
                    {'TIER X - RM500'}
                    </Typography>}
                    <Grid container className={classes.gridRoot} spacing={16}>
                        <Grid item xs={12}>
                            <Grid container className={classes.gridContainer} justify="center" spacing={isMobile?8:16}>
                                {isTTDISelect? trainerTTDITier3 && trainerTTDITier3.map(trainer=>{
                                return(
                                    <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                    />
                                    )
                                }):
                                trainerKLCCTierX && trainerKLCCTierX.map(trainer=>{
                                    return(
                                        <RoundButton
                                        text = {trainer}
                                        onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                        selectedButton = {(selectedTrainer===trainer)?true:false}
                                        />
                                    )
                                })
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                   
                    <Grid container className={classes.gridRoot} spacing={16} style = {{marginTop:15, marginBottom:15}}>
                        <Grid item xs={12}>
                            <Grid container className={classes.gridContainer} justify="center" spacing={24}>
                                <RoundButton
                                    text = {'TTDI'} bigbutton
                                    onClick = {()=>this.handleBranchClick('TTDI')}
                                    // onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                    selectedButton = {(this.state.isTTDISelect)?true:false}
                                />
                                <RoundButton
                                    text = {'KLCC'} bigbutton
                                    onClick = {()=>this.handleBranchClick('KLCC')}
                                    // onClick = {()=>{this.onTrainerBtnPress(trainer)}}
                                    selectedButton = {(this.state.isKLCCSelect)?true:false}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {false && <div style = {{backgroundColor:'#BBAFA3', padding:20}}>
                        {isTTDISelect? trainerTTDITier1 && trainerTTDITier1.map(trainer=>{
                            return(
                                <RoundButton
                                    text = {trainer}
                                />
                            )
                        }):
                        trainerKLCCTier1 && trainerKLCCTier1.map(trainer=>{
                            return(
                            <p>{trainer}</p>
                            )
                        })
                        }
                    </div>}
                </div>
            </div>
        );
    }

    render() {
      const {classes} = this.props;
    
      return (
        <div className={classes.container}>
            {true && !this.state.showLoading && this.renderLogoImg()}
            {true && !this.state.showLoading && this.renderTitleText()}
            {true && !this.state.showLoading && this.renderTopText()}
            {!this.state.showLoading && this.renderTrainerSelection()}
            {!this.state.showLoading && this.renderCoachSelection()}
            {!this.state.showLoading && this.renderTimeTable()}
            {true && !this.state.showLoading && this.renderShowKeyInDetails()}
           
            {!this.state.showLoading && this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            {true && !this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
            {this.state.showLoading && this.renderLoading()}
        </div>
      );
    }
  }
  
  buyBabelWellness.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyBabelWellnessStyled = withStyles(styles)(buyBabelWellness);
  
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
        trainer: getTrainers(state, props)
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyBabelWellnessStyled)
  