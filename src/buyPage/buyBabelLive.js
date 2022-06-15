import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Button, CircularProgress, Dialog, TextField, Typography,
  FormGroup, FormControlLabel, Checkbox, FormControl, 
} from '@material-ui/core';
import React from 'react';
import BabelLogo from '../BabelLogo';
import PropTypes from 'prop-types';
import {
  getVendProducts,
  makeGetStaff
} from '../selectors';
import * as Actions from '../actions';

import firebase from 'firebase/app';
import 'firebase/firestore';
  
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
        backgroundColor: "#06318B",
        // padding:10,
        paddingTop:50,
        paddingBottom:50
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
        backgroundColor: "#06318B",
        flex:1,
        marginTop:30,
        // border: '1.5px solid white',
    },
    textInputStyle:{
        backgroundColor:'#06318B', border:'none', 
        borderBottom: '1px solid lightgray', width:'100%', 
        fontSize:16, color:'#fff', fontFamily: "Montserrat",
        fontWeight: 400,
        marginBottom:15,
        lineHeight:2
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
        alignItems:'center', justifyContent:'center', width:'90%', maxWidth: ismobile? 600:800, resizeMode: 'stretch', 
        boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)',
        marginTop:30
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
    
  });

  let lastScrollY = 0;

  const timeTableImg = [
    {
      imageSrc:require("../assets/week1.jpg"),
      key:0
    },
    {
      imageSrc:require("../assets/week2.jpg"),
      key:1
    },
    {
      imageSrc:require("../assets/week3.jpg"),
      key:2
    },
    {
      imageSrc:require("../assets/week4.jpg"),
      key:3
    },
  ];
  class buyBabelLive extends React.Component {
  
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
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
    }
  
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);

        this.scrollTo(0);
        this.setState({isMobile:(window.innerWidth<=550)?true:false});
      // this.props.actions.addInvoiceForProduct();
        const refMainImg = firebase.storage().ref('virtualClass/BabelLiveTop.jpg');
    //   const url = ref.getDownloadURL();
    //   console.log('theurl: ', url);
        refMainImg.getDownloadURL()
        .then(url => {this.setState({mainImgUrl:url})})
        .catch(e=>{console.log(e);});

        var timeTableImg = [];
        const refWeek1Img = firebase.storage().ref('virtualClass/week1.jpg');
        refWeek1Img.getDownloadURL()
          .then(url => {
            this.setState({week1ImgUrl:url})
            timeTableImg.push(url);
          })
          .catch(e=>{console.log(e);})

        const refWeek2Img = firebase.storage().ref('virtualClass/week2.jpg');
        refWeek2Img.getDownloadURL()
          .then(url => {
            this.setState({week2ImgUrl:url})
            timeTableImg.push(url);
          })
          .catch(e=>{console.log(e)})

        const refWeek3Img = firebase.storage().ref('virtualClass/week3.jpg');
        refWeek3Img.getDownloadURL()
          .then(url => {
            this.setState({week3ImgUrl:url})
            timeTableImg.push(url);
          })
          .catch(e=>{console.log(e)})
        
        const refWeek4Img = firebase.storage().ref('virtualClass/week4.jpg');
        refWeek4Img.getDownloadURL()
          .then(url => {
            this.setState({week4ImgUrl:url})
            timeTableImg.push(url);
          })
          .catch(e=>{console.log(e)})

          console.log('timeTableImg: ', timeTableImg);
          this.setState({timeTableImg})
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
      console.log('theValue: ', value);
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
          <div style={{display:'flex', flex:1, flexDirection:'column', justifyContent:'space-around', marginTop:40}}>
            <Typography type="title" component="h1" color="primary" 
                className={classes.boldMontSerrat}
                style={{textAlign:'center', marginBottom:2, marginTop:20, letterSpacing:2, fontSize: isMobile? 14:25}}
            >{'UNLIMITED ACCESS TO LIVE CLASSES'}
            </Typography>
            <br/>
            <Typography type="title" component="h1" color="primary" 
                className={classes.smallMontSerrat}
                style={{textAlign:'center', marginBottom:0, letterSpacing:isMobile? 10:15, fontSize: isMobile? 14:25}}
            >{'whenever. wherever.'}
            </Typography>
          </div>
      )
    }

    renderTitleTextImg(){
        const {classes} = this.props;
        const {isMobile} = this.state;
        return(
            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginTop:40}}>
                <img src ={require("../assets/virtualClasstitleLogo.png")} alt="logo" style={{width: isMobile? '60%':'60%', height:isMobile? 40:70}} />
            </div>
        )
    }

    handleSelectImg = (img) =>{this.setState({selectedImg:img.imageSrc, selectedImgKey:img.key})}

    renderTimeTableImg(){
        const {mainImgUrl, week1ImgUrl, week2ImgUrl, week3ImgUrl, week4ImgUrl, selectedImg, selectedImgKey, isMobile} = this.state;
        const {classes} = this.props;
        
        return(
            <div style = {{justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column'}}>
              <img src = {mainImgUrl} className={classes.mainImgClass}/>
              <Typography type="title" component="h1" color="primary" 
                  className={classes.smallMontSerrat}
                  style={{textAlign:'center', marginTop:30, letterSpacing:isMobile? 10:15, fontSize: isMobile? 14:25}}
              >{'On Demand via IGTV'}
              </Typography> 
              <img src = {selectedImg} className={classes.mainImgClass}/> 
              <div style={{display:'flex', flex:1, flexDirection:'row', maxWidth:screenWidth*0.9, justifyContent:'center', alignItems:'center'}}>
                {timeTableImg && timeTableImg.map(img=>{
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
              </div>             
            </div>
        )
    }

    // React Checkboxes onChange Methods
    onChangeTTDICheckBox = () => {
      this.setState(initialState => ({
        checkedTTDI: !initialState.checkedTTDI,
      }));
    }
  
    onChangeNonMemberCheckBox = () => {
      this.setState(initialState => ({
        checkedNonMember: !initialState.checkedNonMember,
      }));
    }
  
    onChangeKLCCCheckBox = () => {
      this.setState(initialState => ({
        checkedKLCC: !initialState.checkedKLCC,
      }));
    }
  
    // Submit
    onSubmit = (e) => {
      e.preventDefault();

      console.log('submit: ', this.state);
    }

    handleCheckBox = name => event => {
        this.setState({[name]: event.target.checked });
    };

    handleViewTermsConditions = () => {this.setState({showTermNCondition:true})}

    renderShowKeyInDetails(){
        const {classes} = this.props;
        var {email, name, phone, ighandlename, city} = this.state;

        // console.log('renderShowKeyInDetailsState: ', this.state);

        const TextFieldEmail = <TextField id="email" label="EMAIL ADDRESS" fullWidth
            onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8, color:'#fff'}}
            labelClassName = {{ color:'#fff' }}
            InputLabelProps = {{color:'#fff'}}
            />;

        const TextFieldName = <TextField id="name" label="FULL NAME" fullWidth
            onChange={this.handleChange('name')} autoComplete='off' value={name} style={{marginBottom:8}}/>;

        const TextFieldIGHandle = <TextField id="ighandle" label="INSTAGRAM HANDLE" fullWidth
            onChange={this.handleChange('ighandlename')} autoComplete='off' value={ighandlename} style={{marginBottom:8}}/>;

        const TextFieldCity = <TextField id="city" label="WHICH CITY DO YOU LIVE IN?" fullWidth
            onChange={this.handleChange('city')} autoComplete='off' value={city} style={{marginBottom:8}}/>;

        const TextFieldPhoneNum = <TextField id="phone" label="CONTACT NUMBER" fullWidth
            onChange={this.handleChange('phone')} autoComplete='off' value={phone} type='number'
            style={{marginBottom:8}}/>;

        return(
            <div className={classes.keyInDetailscontainer}>
               
                    <div style = {{marginTop:20, borderRadius:20, margin:20, width:'72%', padding:20, border: '1.5px solid white'}}>
                        <Typography type="title" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{textAlign:'center', marginBottom:30, marginTop:20, letterSpacing:1, fontSize:18}}
                        >{'FIELD REQUIREMENTS'}
                        </Typography>
                      
                        <input className={classes.textInputStyle} 
                            id="name" type="text" name="name" placeholder="FULL NAME" 
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

                        {false && TextFieldName}
                        {false && TextFieldIGHandle}
                        {false && TextFieldPhoneNum}
                        {false && TextFieldEmail}
                        {false && TextFieldCity}
                        <Typography type="subheading" component="h1" color="primary" 
                            className={classes.boldMontSerrat}
                            style={{marginBottom:10, marginTop:40, letterSpacing:1}}
                        >{'MEMBER OF:'}
                        </Typography>
                        {true && <FormGroup row style={{}}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedTTDI}
                                    onChange={this.handleCheckBox('checkedTTDI')}
                                    value="checkedTTDI"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>TTDI</p>)}
                            />
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedKLCC}
                                    onChange={this.handleCheckBox('checkedKLCC')}
                                    value="checkedKLCC"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>KLCC</p>)}
                            />
                             <FormControlLabel
                                control={
                                <Checkbox
                                    checked={this.state.checkedNonMember}
                                    onChange={this.handleCheckBox('checkedNonMember')}
                                    value="checkedNonMember"
                                />
                                }
                                label={(<p className = {classes.smallMontSerrat}>NON-MEMBER</p>)}
                            />
                            {false && <FormControlLabel
                                control={
                                  <input type="checkbox"
                                    checked={this.state.checkedTTDI}
                                    onChange={this.onChangeTTDICheckBox}
                                    value="checkedTTDI"
                                  />
                                }
                                label="TTDI"
                                style = {{width:100, color:'white', fontSize:16, color:'#fff', fontFamily: "Montserrat"}}
                                className={classes.smallMontSerrat}
                            />}
                             {false && <FormControlLabel
                                control={
                                  <input type="checkbox"
                                    checked={this.state.checkedKLCC}
                                    onChange={this.onChangeKLCCCheckBox}
                                    value="checkedKLCC"
                                  />
                                }
                                label="KLCC"
                            />}
                            {false && <FormControlLabel
                                control={
                                  <input type="checkbox"
                                    checked={this.state.checkedNonMember}
                                    onChange={this.onChangeNonMemberCheckBox}
                                    value="checkedNonMember"
                                  />
                                }
                                label="NON-MEMBER"
                            />}
                        </FormGroup>}
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

                <div style = {{marginTop:20, borderRadius:20, margin:20, width:'72%', padding:20, border: '1.5px solid white'}}>
                    <Typography type="title" component="h1" color="primary" 
                        className={classes.smallMontSerrat}
                        style={{textAlign:'center', marginBottom:10, marginTop:10, letterSpacing:1, fontSize:15}}
                    >{'Upon purchase, please send in a request to follow us on our private BABEL LIVE Instagram account @babel.live for access. We will accept your requests upon confirmation. Thank you!'}
                    </Typography>
                
                </div>

                {this.renderBuyBtn()}
                <img src = {require("../assets/BabelLiveText.png")} 
                alt="logo" style={{width:'60%', maxWidth:300, height:ismobile? 90:120}}/>
                {true && <BabelLogo hideLogo = {true} textColor = '#fff'/>}
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

        const invalidEmailTxt = 'Oops! Error: Email not valid. Please enter one that works :(';
        const invalidNameTxt = `Oops!, Error: Please enter full name.`
        const invalidIGTxt = `Oops!, Error: Please enter Instagram Handle Name.`
        const invalidPhoneTxt = `Oops!, Error: Please enter your phone number.`
        const invalidCheckedTncText= `Oops!, Error: Please tick on Term and Condition and Privacy Policy.`
        const invalidCheckedMember= `Oops!, Error: Please tick on Member option.`
        const invalidCityText= `Oops!, Error: Please enter city name.`

        // this.props.actions.addInvoiceForProduct(this.state.name, urlEmail || this.state.email, this.state.phone, vendProductIds);
        if (this.state.name.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidNameTxt});
            return;
        }
        if (this.state.ighandlename.length<=2){
            this.setState({showErrorDialog:true, errorMessage:invalidIGTxt});
            return;
        }
        if (this.state.phone.length<=3){
            this.setState({showErrorDialog:true, errorMessage:invalidPhoneTxt});
            return;
        }
        if (!isValidEmail){
            // ('invalid email');
            this.setState({showErrorDialog:true, errorMessage:invalidEmailTxt});
            return
        }
        if (this.state.city.length<=2){
            // ('invalid email');
            this.setState({showErrorDialog:true, errorMessage:invalidCityText});
            return
        }
        if (!this.state.checked){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedTncText});
            return;
        }
        if (!this.state.checkedTTDI && !this.state.checkedKLCC && !this.state.checkedNonMember){
            this.setState({showErrorDialog:true, errorMessage:invalidCheckedMember});
            return;
        }

        this.setState({showLoading:true});
        const selectedMemberOption = {isKLCCMember:this.state.checkedKLCC, isTTDIMember:this.state.checkedTTDI, isNonMember:this.state.checkedNonMember};
      
        this.props.actions.addInvoiceForVClass(this.state.name, this.state.ighandlename, lowerCaseEmail, this.state.phone, this.state.city, selectedMemberOption, this.state.vendProductId, (response)=>{
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
                        {`All registrants must provide relevant details by filling in all particulars required for the purpose of the BABEL LIVE access.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`BABEL LIVE access is valid for purchase by Babel Members and non-members and is limited to one Instagram account per payment. Registrants are entitled to view the contents at BABEL LIVE’s private Instagram account from 18 May 2020 onwards. BABEL LIVE classes will be running from 18 May 2020 until 15 June 2020.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Purchased access to BABEL LIVE is non-transferable, not re-sellable, non-refundable and cannot be converted into cash or actual membership packages or purchase of any other items at Babel outlets.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`The fee of RM150 is payable in advance of granting registrants access to the contents of virtual classes on the BABEL LIVE Instagram page via the @babel.live Instagram handle. Payments can only be made online on app.babel.fit/babellive.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`BABEL LIVE access is non-refundable, even if the registrant cannot or does not participate in or view all of the IG Live or IGTV videos. There shall be no refund of any monies by Babel in any event whatsoever.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel reserves the rights to sell the BABEL LIVE unlimited access package at different rates and terms, without prior notice.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`In any event should the scheduled Fitness Instructor be unable to conduct the IG Live class, Babel reserves the right to change the class, the Fitness Instructor, class timing or cancel the session altogether.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Fitness Instructors expressly note that results will differ for each individual registrant based upon various factors including without limitation; body type, nutrition, etc. and no guarantees of results are possible.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`During each IG Live class or IGTV workout session, the registrant is advised to wear appropriate athletic footwear and loose, comfortable clothing to facilitate ease of movement.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel’s Fitness Instructors conducting classes via Instagram Live and IGTV on the BABEL LIVE platform are not medical professionals and are without expertise to diagnose medical conditions or impairments. The registrant acknowledges his or her own injuries, condition or impairment which may have a detrimental effect on or be impacted by participating in BABEL LIVE workouts. Babel will not be held responsible for any injuries or harm caused to the registrant at any point of time.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel and its Fitness Instructors/Personal Trainers shall not be held liable for any damages or injury to the registrants. Babel is also not responsible for the safety of facilities or equipment (if applicable) within the registrant’s workout area.`}
                    </li>
                    <li color="primary" type="body1" className={classes.fontTermNCond}>
                        {`Babel shall not be held responsible for the internet connection or data speed of registrants during the streaming of the IG Live classes. However, registrants can still view the full class video via BABEL LIVE’s IGTV section after the live class`}
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

    render() {
      const {classes} = this.props;
    
      return (
        <div className={classes.container}>
            {true && !this.state.showLoading && this.renderLogoImg()}
            {false && !this.state.showLoading && this.renderTitleTextImg()}
            {true && !this.state.showLoading && this.renderTitleText()}
            {true && !this.state.showLoading && this.renderTimeTableImg()}
            {true && !this.state.showLoading && this.renderShowKeyInDetails()}
           
            {!this.state.showLoading && this.state.showErrorDialog && this.renderShowDialog(this.state.errorMessage)}
            {true && !this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
            {this.state.showLoading && this.renderLoading()}
        </div>
      );
    }
  }
  
  buyBabelLive.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyBabelLiveStyled = withStyles(styles)(buyBabelLive);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyBabelLiveStyled)
  