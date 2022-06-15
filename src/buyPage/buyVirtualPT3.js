  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, CircularProgress, Dialog, Button, Grid, TextField,
    Typography, FormGroup, FormControlLabel, Checkbox, FormControl, Avatar
    } from '@material-ui/core';
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';
  import React from 'react';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff
  } from '../selectors';
  import * as Actions from '../actions';

  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
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
        // height: screenWidth * 0.22,
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    fontTermNCond: {
        marginBottom:7, color:'rgba(0, 0, 0, 0.54)'
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
  
  // const vBuyVirtualTrainerTier1 = 'bb719703-58e5-1490-1fd5-f99cafb60333';
  const vBuyVirtualTrainerKLCCTier1 = '2b3680b6-0c48-3e9f-fb88-e5b7827d046f';
  const vBuyVirtualTrainerKLCCTier2 = '2bbc5ceb-d5fb-ae53-4805-06025dbef4bd';
  const vBuyVirtualTrainerKLCCTier3 = 'b361d927-c3a9-919c-f714-dea36c7f5583';
  const vBuyVirtualTrainerKLCCTierX = '6567972e-d12e-b51a-76cf-9972d47d54d2';

  const vBuyVirtualTrainerTTDITier1 = 'cad41465-ee59-6e76-ffff-bc9de7f2cbe7';
  const vBuyVirtualTrainerTTDITier2 = '097fcccd-3f5b-884e-be8e-345dfd96c3dd';
  const vBuyVirtualTrainerTTDITier3 = '149f61ab-8c8a-aa66-cc9c-3e6d62449596';

//   const trainerKLCCTier1 = ['SHAUN C', 'SOFIA', 'RISHON', 'BRYAN'];
    const trainerKLCCTier1 = ['BELEDEES'];
  const trainerKLCCTier2 = ['SHAUN', 'PRIYA', 'SHENG'];
  const trainerKLCCTier3 = ['JEAN', "ESTHER"];
  // const trainerKLCCTierX = ['TONY'];

  const trainerTTDITier1 = ['ADAM V', 'NAIM', 'SONIYAH', 'LEWIS', 'BRYAN'];
  const trainerTTDITier2 = ['FADLY', 'MING SHAO', 'QHALID', 'KENNETH', 'DELPHINE', 'REN KAI'];
  const trainerTTDITier3 = ['HANNA', 'KISH', 'SEAN'];

  let lastScrollY = 0;

  class buyVirtualPT extends React.Component {
  
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
    }
  
    componentDidMount() {
        // ReactPixel.init('372348337059911');

        window.addEventListener('scroll', this.handleScroll, true);
        this.scrollTo(0);
        this.setState({isMobile:(window.innerWidth<=550)?true:false});
      // this.props.actions.addInvoiceForProduct();
        const refMainImg = firebase.storage().ref('virtualTrainer/vt.png');
    //   const url = ref.getDownloadURL();
    //   console.log('theurl: ', url);
        refMainImg.getDownloadURL()
        .then(url => {this.setState({mainImgUrl:url})})
        .catch(e=>{console.log(e);});

        const refBottomImg = firebase.storage().ref('virtualTrainer/vtBottom.png');
        //   const url = ref.getDownloadURL();
        //   console.log('theurl: ', url);
        refBottomImg.getDownloadURL()
        .then(url => {this.setState({bottomImgUrl:url})})
        .catch(e=>{console.log(e);})

        // to fetch all trainers
        const trainersData= firebase.firestore().collection('users')
        .where('isStaff', '==', true)
        .where('staffRole', '==', 'trainer')
        .get();

        var trainersArray = [];
        trainersData && trainersData.then((querySnapshot)=>{
            querySnapshot.forEach(doc=>{
                var data = doc.data();
                // console.log('trainerData: ', data);
                trainersArray.push(data);
            });
            console.log('trainersArray: ', trainersArray);
            this.setState({trainersArray});
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
        if (trainerKLCCTier1.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerKLCCTier1})}
        else if (trainerKLCCTier2.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerKLCCTier2})}
        else if (trainerKLCCTier3.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerKLCCTier3})}
        // else if (trainerKLCCTierX.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerKLCCTierX})}
        else if (trainerTTDITier1.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerTTDITier1})}
        else if (trainerTTDITier2.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerTTDITier2})}
        else if (trainerTTDITier3.includes(name)){this.setState({vendProductId:vBuyVirtualTrainerTTDITier3})}
        this.setState({selectedTrainer: name});
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

    renderTTDISelection(){
        const {classes} = this.props;
        const {isMobile} = this.state;

        return(
            <div style={{alignItem:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                <Typography type="display2" component="h1" color="primary" 
                    className={classes.boldMontSerrat}
                    style={{textAlign:'center', marginBottom:30, marginTop:10, letterSpacing:1, fontSize:'3rem'}}
                >{'TTDI'}
                </Typography>
                    <div className={classes.boxContainer}>
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 1 - 5 for RM250'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            {this.renderTrainerBtnSelection('ADAM V')}
                            {this.renderTrainerBtnSelection('NAIM')}
                            {this.renderTrainerBtnSelection('SONIYAH')}
                        </div>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            {this.renderTrainerBtnSelection('LEWIS')}
                            {this.renderTrainerBtnSelection('BRYAN')}
                        </div>
                    </div>
                   
                    <div className={classes.boxContainer} style = {{marginTop:20}}>
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 2 - 5 for RM300'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            {this.renderTrainerBtnSelection('FADLY')}
                            {this.renderTrainerBtnSelection('MING SHAO')}
                            {this.renderTrainerBtnSelection('QHALID')}
                           
                        </div>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            {this.renderTrainerBtnSelection('KENNETH')}
                            {this.renderTrainerBtnSelection('DELPHINE')}
                            {this.renderTrainerBtnSelection('REN KAI')}
                        </div>
                    </div>
                   
                    <div className={classes.boxContainer} style = {{marginTop:20}}>
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 3 - 5 for RM350'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            {this.renderTrainerBtnSelection('HANNA')}
                            {this.renderTrainerBtnSelection('KISH')}
                            {this.renderTrainerBtnSelection('SEAN')}
                        </div>
                    </div>
                   
               
                <Grid container spacing={24} direction="row" justify="center" alignItems="center" style = {{marginTop:20}}>
                    {!this.state.showKeyInDetails && this.renderConfirmButton()}
                </Grid>
                {this.renderBottomImg()}
            </div>
        )
    }

    renderKLCCSelection(){
        const {classes} = this.props;
        const {isMobile} = this.state;

        return(
            <div style={{alignItem:'center', justifyContent:'center', display:'flex', flexDirection:'column'}}>
                <Typography type="display2" component="h1" color="primary" 
                    className={classes.boldMontSerrat}
                    style={{textAlign:'center', marginBottom:30, marginTop:10, letterSpacing:1, fontSize:'3rem'}}
                >{'KLCC'}
                </Typography>
               
                    <div className={classes.boxContainer}>
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 1 - 5 for RM250'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            {this.renderTrainerBtnSelection('BELEDEES')}
                        </div>
                        {false && <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            {this.renderTrainerBtnSelection('KUANG JIN')}
                        </div>}
                    </div>
                   
                    {true && <div className={classes.boxContainer}
                        style = {{marginTop:20}}
                    >
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 2 - 5 For RM300'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            {this.renderTrainerBtnSelection('SHAUN')}
                            {this.renderTrainerBtnSelection('PRIYA')}
                            {this.renderTrainerBtnSelection('SHENG')}
                        </div>
                        {false && <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            {this.renderTrainerBtnSelection('SHENG')}
                        </div>}
                    </div>}
                   
                    <div className={classes.boxContainer}
                        style = {{marginTop:20}}
                    >
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier 3 - 5 for RM350'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            {this.renderTrainerBtnSelection('JEAN')}
                            {this.renderTrainerBtnSelection('ESTHER')}
                        </div>
                    </div>

                    {false && <div className={classes.boxContainer}
                        style = {{marginTop:20}}
                    >
                        <Typography 
                            className={classes.boldMontSerrat}
                            type="title" component="h1" color="primary" style={{marginLeft:20, marginBottom:0, fontSize:isMobile? '1rem':'1.3125rem'}}>
                        {'Tier X - RM1800'}
                        </Typography>
                        <div style={{display:'flex', flex:1, flexDirection:'row'}}>
                            {this.renderTrainerBtnSelection('TONY')}
                        </div>
                    </div>}
                   
             
                <Grid container spacing={24} direction="row" justify="center" alignItems="center" style = {{marginTop:20}}>
                    {!this.state.showKeyInDetails && this.renderConfirmButton()}
                </Grid>
                {this.renderBottomImg()}
            </div>
        )
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
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <img src ={require("../assets/babel-icon-blue.png")} alt="logo" style={{width:128, height:128}} />
            </div>
        )
    }

    renderButton(){
        const {classes} = this.props;
        // const {selectedAvatar, email, name, selectedAngPowCover} = this.state;
        const {isMobile} = this.state;
        const bgColorSelected = '#fcebbe';
        const bgColorNotSelected = '#fff';
        // console.log('getScrollPosition: ', window.pageYOffset);

        return(
            <div style = {{alignItems:'center', justifyContent:'center', display:'flex', flexDirection:'row', marginTop:20}}>
                <div 
                    className={classes.buttonStyle}
                    style = {{cursor: 'pointer', marginRight:50, 
                        backgroundColor: this.state.showKLCC? bgColorSelected:bgColorNotSelected,
                        border: '2px solid white',
                        borderColor: this.state.showKLCC? bgColorNotSelected:bgColorSelected,
                        width: isMobile? '6rem':'9rem',
                    }}
                    onClick = {()=>this.handlePress('KLCC')}
                    >
                    <p className={classes.boldMontSerrat} style={{textAlign:'center', fontSize:isMobile? '1.3rem':'2rem', verticalAlign:'center', lineHeight:'1rem'}}>KLCC</p>
                </div>
                <div 
                    className={classes.buttonStyle}
                    style = {{cursor: 'pointer', 
                        backgroundColor: this.state.showTTDI? bgColorSelected:bgColorNotSelected,
                        border: '2px solid white',
                        borderColor: this.state.showTTDI? bgColorNotSelected:bgColorSelected,
                        width: isMobile? '6rem':'9rem'
                    }}
                    onClick = {()=>this.handlePress('TTDI')}
                    >
                    <p className={classes.boldMontSerrat} style={{textAlign:'center', fontSize:isMobile?'1.3rem':'2rem', verticalAlign:'center', lineHeight:'1rem'}}>TTDI</p>
                </div>
            </div>
        )
    }

    renderShowSelection () {
        const {classes} = this.props;
        const {mainImgUrl, isMobile} = this.state;

        // const buyLabel1 = 'BUY 5 SESSIONS OF VPTS, INCLUDE ONE MONTH OF MEMBERSHIP DUES FOR FREE (Buy 5 VPT + get 1 month free: To be redeemed for August 2020 onwards)';
        // const buyLabel1 = `Progress better, faster and become stronger while you're at home with Babel's Virtual Personal Training Sessions from only RM260 for FIVE(5) sessions and get *ONE FREE MONTH (1) on your Babel membership!`;
        const buyLabel1 = `Don't let the MCO side-track your fitness goals. Your home, our Personal Trainers; we'll bring Babel to you!`;
        const buyLabel2 = 'Introducing our Virtual Personal Training from only RM250!';
        const buyLabel3 = `What's included:`;
        const buyLabel4 = `FIVE (5) Virtual Personal Training sessions`;
        const buyLabel5 = `*ONE FREE MONTH (1) on your Babel membership`;
        const tncText = `*Terms & conditions apply`;

        return(
            <div style = {{maxWidth:'1080px'}}>
                <div className={classes.topContainer}>
                    {this.renderLogoImg()}
                    <p
                        className={classes.boldMontSerrat}
                        style={{textAlign:'center', marginBottom:30, marginTop:10, letterSpacing:1, marginLeft:20, marginRight:20}}
                    >{'HOME ASSIST'}
                    </p>
                    <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
                        <img src = {mainImgUrl} className={classes.mainImgClass}/>               
                    </div>
                </div>
                <div className={classes.secondContainer}>
                    <Typography type="title" component="h1" color="primary" 
                        className={classes.boldMontSerrat}
                        style={{textAlign:'center', marginBottom:30, marginTop:10, letterSpacing:1, marginLeft:20, marginRight:20}}
                    >{'VIRTUAL PERSONAL TRAINING'}
                    </Typography>
                    <Typography type="subheading" component="h1" color="primary" className={classes.smallMontSerrat}>{buyLabel1}</Typography>
                    <Typography type="subheading" component="h1" color="primary" className={classes.smallMontSerrat}>{buyLabel2}</Typography>
                    <Typography type="subheading" component="h1" color="primary" className={classes.smallMontSerrat}>{buyLabel3}</Typography>
                    {true && <ul>
                        <li className={classes.smallMontSerrat}> <span>{buyLabel4}</span></li>
                        {false && <li className={classes.smallMontSerrat}>{buyLabel5}</li>}
                    </ul>}
                    <Typography type="body2" component="h1" color="primary" className={classes.smallMontSerrat} style={{fontWeight: 400, fontStyle: 'italic'}}>{tncText}</Typography>
                    {this.renderButton()}
                </div> 
            </div>
        );
    }

    handleCheckBox = name => event => {
        this.setState({[name]: event.target.checked });
    };

    handleViewTermsConditions = () => {this.setState({showTermNCondition:true})}

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
                <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} onClick={()=>{this.setState({showKeyInDetails:false})}}>
                    <ArrowBackIcon style = {{width:'2rem', height:'2rem'}}/>
                </div>
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
                        >{'Preferred Time of Training'}
                        </Typography>
                        <FormGroup row style={{}}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedAM}
                                    onChange={this.handleCheckBox('checkedAM')}
                                    value="checkedAM"
                                />
                                }
                                label="AM"
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
                                label="PM"
                            />
                        </FormGroup>
                        <Typography type="subheading" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{marginBottom:10, marginTop:40, letterSpacing:1}}
                        >{'Preferred Days of Training'}
                        </Typography>
                        <FormGroup row style={{paddingBottom:20}}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedMon}
                                    onChange={this.handleCheckBox('checkedMon')}
                                    value="checkedMon"
                                />
                                }
                                label="Mon"
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
                                label="Tues"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedWed}
                                    onChange={this.handleCheckBox('checkedWed')}
                                    value="checkedWed"
                                />
                                }
                                label="Wed"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedThurs}
                                    onChange={this.handleCheckBox('checkedThurs')}
                                    value="checkedThurs"
                                />
                                }
                                label="Thurs"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedFri}
                                    onChange={this.handleCheckBox('checkedFri')}
                                    value="checkedFri"
                                />
                                }
                                label="Fri"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedSat}
                                    onChange={this.handleCheckBox('checkedSat')}
                                    value="checkedSat"
                                />
                                }
                                label="Sat"
                            />
                              <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedSun}
                                    onChange={this.handleCheckBox('checkedSun')}
                                    value="checkedSun"
                                />
                                }
                                label="Sun"
                            />
                        </FormGroup>
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

    handleBuy = () =>{
        // console.log('handleBuyState: ', this.state);
        // const vendVirtualPTID = 'bb719703-58e5-1490-1fd5-f99cafb60333'; // testing

        const trainerName = 'tony';
        const lowerCaseEmail = this.state.email.toLowerCase();
        const emailMatch = lowerCaseEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email.toLowerCase();
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

        const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        const invalidNameTxt = `Oops!, Error: Please enter full name.`
        const invalidPhoneTxt = `Oops!, Error: Please enter your phone number.`
        const invalidCheckedTncText= `Oops!, Error: Please tick on Term and Condition and Privacy Policy.`
        const invalidCheckedTimeText= `Oops!, Error: Please tick on AM or PM option.`
        const invalidCheckedDayText= `Oops!, Error: Please tick on the preferred day option.`

        // this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
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
        if (!this.state.checked){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedTncText});
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

        this.setState({showLoading:true});
        const selectedAMPM = {AM:this.state.checkedAM? this.state.checkedAM:false, PM:this.state.checkedPM?this.state.checkedPM:false};
        const selectedDay = {mon:this.state.checkedMon, tues:this.state.checkedTues, wed:this.state.checkedWed, thurs:this.state.checkedThurs, fri:this.state.checkedFri, sat:this.state.checkedSat, sun:this.state.checkedSun};
        // this.props.actions.addInvoiceForVT('faizul', 'faizulklcc@babel.fit', '011192929292', vendVirtualPTID, trainerName, selectedAMPM, selectedDay);
        this.props.actions.addInvoiceForVT(this.state.name, lowerCaseEmail, this.state.phone, this.state.vendProductId, this.state.selectedTrainer, selectedAMPM, selectedDay, (response)=>{
        // this.props.actions.addInvoiceForVTHongKong(this.state.name, lowerCaseEmail, this.state.phone, this.state.vendProductId, this.state.selectedTrainer, selectedAMPM, selectedDay, (response)=>{ 
            console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
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
                  type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}
                  className={classes.boldMontSerrat}
                >
                {`TERMS & CONDITIONS`}
                </Typography>
                <ol type="1">
                    <li color="primary" type="body1"  className={classes.fontTermNCond}>
                        {`All members must provide relevant details by filling in all particulars required for the purpose of Virtual Personal Training (VPT) programme.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`VPT sessions are only valid for purchase by Babel Members and the duration of each VPT session is or ONE (1) hour.`}
                    </li>
                    {false && <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`ONE (1) free month of membership credited with the purchase of FIVE (5) virtual personal training sessions, is only valid to be redeemed from 1 August 2020 onwards and is only applicable to the first purchase. This means that the complimentary month will only be inclusive for the first package of VPT purchased.`}
                    </li>}
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`VPT sessions purchased are non-transferable, not re-sellable, non-refundable and cannot be converted into cash or physical Personal Training sessions.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`A Member's VPT is an arrangement between him or her and the operator of the selected Club (KLCC or TTDI). Once he or she has made payment to solicit Babel’s VPT session, the member agrees to be bound by a binding contract.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`A Fitness Instructor/Personal Trainer is not a medical professional and is without expertise to diagnose medical conditions or impairments. The member agrees to promptly and fully disclose to our Fitness Instructor/Personal Trainer regarding any injury, condition or impairment which may have a detrimental effect on or be impacted by this virtual training program. The Fitness Instructor/Personal Trainer has a right to make the decision to discontinue training because of any condition which presents an adverse risk or threat to the health or safety of the member or others.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The fee for the program is payable in advance of Sessions in one lump sum at least 2 days (48 hours) prior to the scheduled session appointment. Payments should be made via online on the Babel App page. The member is not allowed to pay the Fitness Instructor/Personal Trainer directly for a session.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel’s VPT sessions are valid for redemption throughout the duration of the Movement Control Order (MCO), should the MCO be extended then redemption period will be automatically extended accordingly.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`All VPT sessions have an ‘End Date’ or 'Expiration Date'. If in any case the purchased VPT Package is not finished before the "Expiration Date", in this case, before the end of the MCO period, all the remaining sessions will be forfeited.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The time of sessions is to be agreed upon between the trainer and the member. You must be present virtually on time for the scheduled appointment. If you arrive late (virtually) by any chance, do understand that your session will end at the originally scheduled time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The member must give a TWENTY-FOUR (24) hour cancellation notice. It is required for rescheduling or cancelling any and all individual Sessions. Failure to do so will result in forfeiture of the sessions and no sessions or payment reimbursement will be granted.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Any tardiness of more than 15 minutes or absence without proper notification will result in forfeiting the session and no sessions or payment reimbursement will be granted. All one-on-one VPT sessions will start and end no more than allocated time, as per purchased package (1 hour).`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Shall his or her Fitness Instructor/Personal Trainer cancels the session within the 24-hour notice period, he or she will be ensured of a substitute Coach for the scheduled session. If the member is not satisfied with services of the current Fitness Instructor/Personal Trainer with solid reasons, we will be glad to offer him or her a different Fitness Instructor/Personal Trainer.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Refunds - All personal training package fees are non-refundable, even if the member cannot or does not participate in all of the VPT sessions in the program. There shall be no refund of any monies paid by Babel in any event whatsoever.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel reserves the rights to sell VPT packages at different rates and terms, without prior notice.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Fitness Instructor/Personal Trainer expressly notes that results will differ for each individual member based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Proper nutrition and adequate rest are essential to this training program and the member must not be under the influence of drugs or alcohol at any time during the training session.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`During each session the member is required to wear appropriate athletic footwear and loose, comfortable clothing to facilitate ease of movement. The member is not permitted to bring other individuals with him or her for the virtual sessions.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel and its Fitness Instructors/Personal Trainers shall not be held liable for any damages or injury to the member during VPT sessions. Babel is also not responsible for the safety of facilities or equipment (if applicable) within the member’s workout area, whether provided by the member himself or herself, Fitness Instructor/Personal Trainer, or others.`}
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
      
  
    //   if (vendProductId === 'daypass' || vendProductId === '04de7e6c-409f-488c-e6d4-9df5cc745fff') {
    //     vId = vBuyDayPass;
    //     showDetails = true;
    //   } else if (vendProductId === 'nightpass' || vendProductId === vBuyDancePass) {
    //     isAvailable = moment().isBefore(moment('2019-11-30'));
    //     vId = vBuyDancePass;
    //     showDetails = true;
    //   } else if (vendProductId === 'animalfloweb' || vendProductId === '90bb7eae-5cf8-c556-e147-d0b80192d03f') {
    //     isAvailable = moment().isBefore(moment('2019-02-18'));
    //     vId = isAvailable ? '90bb7eae-5cf8-c556-e147-d0b80192d03f' : '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
    //     isAvailable = moment().isBefore(moment('2019-03-01'));
    //   }else if (vendProductId === 'animalflow' || vendProductId === '3b0740b8-dde5-1891-c0ff-d4f6d33d9086') {
    //     vId = '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
    //     isAvailable = moment().isBefore(moment('2019-03-01'));
    //   }else if(vendProductId === '0af7b240-aba0-11e7-eddc-dbd880e1f8d5' || vendProductId === 'monthly'){
    //     vId = '0af7b240-aba0-11e7-eddc-dbd880e1f8d5';
    //     showQuantity = false;
    //     isMembershipProduct = true;
    //   }else if (vendProductId === vBuyPT60minsTier1 || vendProductId === vBuyPT60minsTier2 || vendProductId === vBuyPT60minsTier3 || vendProductId === vBuyPT60minsTierX){
    //     showQuantity = true;
    //   }else if(vendProductId === vBuy6MthPrepaidMembership || vendProductId === vBuy12MthPrepaidMembership || vendProductId === 'd2a533fc-270b-e6e4-ce6e-1f36c942b3f1' || vendProductId === 'b84e0748-c532-27d1-c24a-49cb496be254'){
    //     showQuantity = false;
    //     isMembershipProduct = true;
    //   }
    //   else if (vendProductId === vBuyDancePassTTDI || vendProductId === vBuyDanceKLCC){
    //     showDetails = true;
    //   }
    //   else if (vendProductId === vBuyValentineSingleClassMember 
    //     || vendProductId === vBuyValentineSingleClassNonMember || vendProductId === vBuyValentineDoubleClassMember 
    //     || vendProductId === vBuyValentineDoubleClassNonMember){
    //       showDetails = true;
    //       isAvailable = moment().isBetween(moment('2020-01-29 10:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-08 17:00').tz('Asia/Kuala_Lumpur'));
    //   }
    //   else if (vendProductId === vBuyJan2020AllAccess || vendProductId === vBuyJan2020Single){
    //     jan2020Promo = true;
    //     isAvailable = moment().isBetween(moment('2020-01-01 00:00').tz('Asia/Kuala_Lumpur'), moment('2020-02-03 23:00').tz('Asia/Kuala_Lumpur'));
    //   }
      
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
      const className = this.state.className;
      const classDate = this.state.classDate ? moment(this.state.classDate).format('YYYY-MM-DD') : null;
      const quantity = this.state.quantity || 1;
      const icnumber = this.state.icnumber;
      const isValidPostCode = this.state.postcode && this.state.postcode.length>=4;
      const isValidRefSource = this.state.refSource && this.state.refSource.length>=3;
      const isValidMcId = this.state.mcId;
  
      const disableContinue = jan2020Promo? (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone || !isValidPostCode || !isValidRefSource || !isValidMcId ):
      (!isValidEmail || this.props.isAddingInvoice || !this.state.checked || !isValidName || !isValidPhone);
  
      const isSpecialTnC = vendProductId === 'd2a533fc-270b-e6e4-ce6e-1f36c942b3f1';

      return (
        <div className={classes.container}>
            {!this.state.showLoading && !this.state.showKeyInDetails && this.renderShowSelection()}
            {!this.state.showLoading && !this.state.showKeyInDetails && this.state.showKLCC && this.renderKLCCSelection()}
            {!this.state.showLoading && !this.state.showKeyInDetails && this.state.showTTDI && this.renderTTDISelection()}
            {!this.state.showLoading && this.state.showKeyInDetails && this.renderShowKeyInDetails()}
            {!this.state.showLoading && this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            {!this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
            {this.state.showLoading && this.renderLoading()}
        </div>
      );
    }
  }
  
  buyVirtualPT.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyVirtualPTStyled = withStyles(styles)(buyVirtualPT);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyVirtualPTStyled)
  