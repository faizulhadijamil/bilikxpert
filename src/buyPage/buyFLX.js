import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Checkbox, FormGroup, FormControlLabel, TextField, Typography, FormLabel, Chip, Dialog, Button,CircularProgress} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import {
  getVendProducts,
  makeGetStaff
} from '../selectors';
import IntegrationAutosuggest from '../IntegrationAutosuggest';
import * as Actions from '../actions';
import edm from '../assets/edm.gif';
import RoundButton from '../components/RoundButton';
import BabelLogo from '../BabelLogo';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
var ismobile = window.innerWidth<=550?true:false;
  
  const styles = theme => ({
    container: {
        width: '100%',
        // height:screenHeight,
        // maxWidth:'1080px',
        //justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#f3ebe8",
        // padding:10,
        // paddingTop:50,
        // paddingBottom:50
    },
    boldTxt:{
      color:'#000', 
      fontFamily: "Montserrat",
      fontWeight: 700,
      fontSize:15.6,
      letterSpacing:0
    },
    topcontainer:{
        width: '100%',
        // height: screenHeight,
        // maxWidth:'1080px',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        //backgroundColor: "#06318B",
        // padding:10,
        paddingTop:10,
        paddingBottom:10
    },
    keyInDetailscontainer:{
        width: '100%',
        height: screenHeight,
        // maxWidth:'1080px',
        // justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        paddingTop:10,
        paddingBottom:50,
        backgroundColor: "#f3ebe8",
    },
    boldMontSerrat:{
      color:'#000', 
      fontFamily: "Montserrat",
      // fontFamily :'sans-serif', 
      fontWeight: 800,
      textTransform: "uppercase",
      fontSize:'2.3rem'
  },
  termNConditionContainer:{
    maxWidth:screenWidth * 0.9,
    marginRight: 'auto',
    marginLeft: 'auto',
},
    buybtn:{

    }
  });

  let lastScrollY = 0;
  const flxSingleAccess240VendProdId = '47fb7227-5ac2-403c-ac57-50d906cb3c7c';
  const flxAllAccess320VendProdId = '9effa0bd-59d8-4d55-a470-f34fadd3d5eb';
  
  class buyFLX extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            phone: '',
            nric:'',
            city:'',
            showErrorDialog:false,
            errorMessage:'',
            selectedVendPkgId:null,
            selectedPackageName:null,
            showDetails:false,
            showTermNCondition:false,
            checked:false,
            showLoading:false,
        };
        this.handleChange = this.handleChange.bind(this);
        // this.handleCheckBox = this.handleCheckBox.bind(this);
    }
  
    componentDidMount() {
        this.setState({isMobile:(window.innerWidth<=550)?true:false});
      // this.props.actions.addInvoiceForProduct();
    }
  

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    scrollTo(number){window.scrollTo({top:number, behavior: "smooth"})}
    
    handleScroll = () => {lastScrollY = window.scrollY}

    handlePickPkg = (vendPkgId) => {
        //scroll to the next page
        // this.scrollTo(screenHeight+50);
        // const vendProducts = this.props.vendProducts;
        // const vendProduct = (vendProducts && vendPkgId) ? vendProducts.get(vendPkgId) : null
        // const vendProductName = vendProduct && vendProduct.get('name');
        // console.log('thevendProducts: ', vendProducts);
        var vendProductName = '';
        // todo: fetch from firebase
        if (vendPkgId === flxSingleAccess240VendProdId){
            vendProductName = 'single access RM 240'
        }
        else if (vendPkgId === flxAllAccess320VendProdId){
            vendProductName = 'All access RM 320';
        }
        this.setState({
          selectedVendPkgId:vendPkgId, selectedPackageName:vendProductName
        });
        this.scrollTo(0);
    }

    handleAutosuggest = (name, value) => {
        var valueMap = {};
        valueMap[name] = value;
        this.setState({ ...valueMap });
      }

    handleContinueEmail = () => {
        // check for email first
        // console.log('handleContinueEmail: ', this.state);
        // this.props.actions.fetchUserDataByEmail(this.state.email, (response) => {
        //     console.log('fetchUserDataByEmail: ', response);
        //     if (response && response.success && response.user){
        //         const user = response.user;
        //         const name = user && user.name;
        //         const phone = user && user.phone;
        //         this.setState({name,phone});
        //     }
            
        //     // this.setState({continue: response});
        // });
        
        const emailMatch = this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email;
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
        if (isValidEmail){
          this.props.actions.getUserByEmail(this.state.email, response=>{
            if (response && response.name){this.setState({name:response.name})}
            if (response && response.phone){this.setState({phone:response.phone})}
            if (response && response.nric){this.setState({nric:response.nric})}
            if (response && response.city){this.setState({city:response.city})}
          });
        }
        else{
          this.setState({showErrorDialog:true, errorMessage:'not valid email'});
          return;
        }
        this.setState({showDetails:true});
    }

    handleCloseDialog = () => this.setState({showTermNCondition:false, showErrorDialog:false});

    renderLogoImg(){
      const {classes} = this.props;
      return(
          <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:20}}>
              <img src ={require("../assets/babelIconBlack.png")} alt="logo" style={{width:screenWidth*0.1, height:screenWidth*0.1}} />
          </div>
      )
  }

  renderBackArrow () {
    return(
        <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} onClick={()=>{
                this.setState({showKeyInDetails:false, showBikeOptions:false})
            }}>
            <ArrowBackIcon style = {{width:'2rem', height:'2rem', color:'black'}}/>
        </div>
    )
}

renderShowDialog = (message=null) => {
  const {classes} = this.props;
  const {errorMessage} = this.state;
  if (this.state.showErrorDialog){
    
    return(
      <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showErrorDialog}>
        <div 
          style = {{backgroundColor:'white', paddingBottom:10, paddingTop:10, paddingLeft:50, paddingRight:50}}
          // className = {classes.contentInner}
          >
          <Typography 
            style={{textAlign:'center', marginBottom:20, fontWeight:800}}
            className={classes.smallMontSerrat}
            >
            {errorMessage}
          </Typography>
          <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex'}}>
            <RoundButton
                text = {'OK'}
                key = {'okDialogButton'}
                onClick={()=>this.setState({showErrorDialog:false})}
            />
          </div>
        </div>
      </Dialog>
    );
  }
};

    renderShowTermsNCondition () {
      const {classes} = this.props;
      const {isMobile} = this.state;

      return(
          <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showTermNCondition}>
            <div 
              style = {{margin:30, width:0.9*screenWidth, maxWidth:800, display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto'}}
              className = {classes.termNConditionContainer}
              >
              {this.renderLogoImg(true)}
              <Typography 
                type="h4" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center', fontSize:'0.9rem'}}
                className={classes.boldMontSerrat}
              >
              {`TERMS & CONDITIONS`}
              </Typography>
              <ol type="1">
                  <li color="primary" type="body1"  className={classes.fontTermNCond}>
                      {`The Management reserves the right to reject any application to join Babel using the Babel FLX promotion, for any reason whatsoever.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX and all the benefits included therein, is a standalone promotion and cannot be used in combination with any other existing or past Babel promotions.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX is only valid to be purchased once (1) per individual and multiple purchases under the same name is prohibited.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX is valid for purchase by both Babel members and non-members.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX is only valid for purchase until 1 May 2021`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`The Babel FLX promotion is subject to the bonus feature FLX Transfer, whereby purchasers of Babel FLX are entitled to transfer their Babel membership, and all the benefits and privileges included therein, to another person.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Bequeathal of Babel FLX membership through FLX Transfer is only valid for non Babel members exclusively and cannot be used to transfer membership to existing Babel members.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`The Management reserves the right to reject any request to transfer membership using FLX Transfer, for any reason whatsoever.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX purchasers are entitled to a maximum of one (1) FLX Transfer only, per person whereby recipients of Babel FLX membership through FLX Transfer `}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX Transfers are subject to a minimum requirement of one (1) month, whereby Babel FLX purchasers may only bequeath their membership to another person using FLX Transfer upon the completion of a minimum of one (1) month of the Babel FLX contract.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX Transfers will result in the complete transfer of Babel membership and all the benefits and privileges included therein, to another person in it's entirety, whereby all current and future privileges accrued through Babel membership will be given to the recipient of the FLX Transfer.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`As a FLX Transfer will result in a complete transference and forfeiture of an individuals Babel membership, and all the benefits and privileges included therein, therefore rejoining Babel after transferring Babel FLX membership will incur an RM350 Joining Fee unless`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Upon completion of 12 months, membership will automatically be extended via auto billing on a monthly basis using the regular monthly fee rates. To avoid this, individuals may send an email to The Management via hello@babel.fit requesting termination of their membership, at least 7 days before the end of their Babel FLX contract.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`It is the recipient of the FLX Transfer and not the initial purchaser under whose name membership will be extended.`}
                  </li>

                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX promotion is subject to the bonus feature 'FLX Credits' whereby purchasers of Babel FLX are entitled to convert membership months into FLX credits. `}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`A FLX credit is an in-store token that can be used in exchange for in-store Babel retail items, that are equivalent in value.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Babel FLX credits are only valid to be used in exchange for in-store Babel retail items exclusively and cannot be used to purchase Babel services or promotions.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX credits are subject to one-way conversion whereby only Babel FLX membership months can be converted into FLX credits. However, FLX Credits cannot be converted into Babel FLX membership months.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX credits are subject to a membership to credit conversion ratio of 1:1, whereby RM1 = 1 FLX Credit. `}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX credits are subject to a minimum requirement of six (6) months whereby conversion of Babel FLX membership months into FLX credits will only be available upon completing a minimum of 6 months of Babel FLX membership.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Conversion of months into FLX credits is only applicable upon cancellation exclusively after the 6th month of Babel FLX.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX Credits are only valid until MAY 2021 and must be used in completion before then.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX Credits are only valid to be used by one (1) person only and cannot be transferred to any other individuals.`}
                  </li>
                  
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`The Babel FLX promotion is subject to the bonus feature 'FLX Signup' whereby purchasers of Babel FLX are entitled to postpone their membership start date up to one (1) month after their initial purchase date.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`FLX Signup entitles all Babel FLX purchasers to a full waiver of Babel's RM350 Joining Fee upon signing up.`}
                  </li>

                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`The Babel FLX promotion is subject to the bonus feature 'FLX Freezes' whereby purchasers of Babel FLX are entitled to a maximum of four (4) complimentary membership month freezes only.`}
                  </li>

                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`The Babel FLX promotion is subject to the bonus feature 'FLX Cancellation' whereby purchasers of Babel FLX are entitled to cancel their anytime after 6 months have passed,  Free of Charge.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Cancellation of the Babel FLX promotion before 6 months have passed will incur a cancellation fee of RM350.`}
                  </li>
                  <li color="primary" type="body1" className={classes.fontTermNCond}>
                      {`Cancellation of Babel FLX membership will result in the automatic conversion of your remaining membership months into FLX Credits.`}
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

    renderTop(){
        // console.log('screenHeight: ', screenHeight);
        const {classes} = this.props;
        const maximumWidth = '400px'
        return(
            <div className={classes.topcontainer}>
               {this.state.selectedVendPkgId && <div style = {{cursor: 'pointer', position: 'absolute', left:20, top:20}} onClick={()=>{this.setState({selectedVendPkgId:null})}}>
                    <ArrowBackIcon style = {{width:'2rem', height:'2rem'}}/>
                </div>}
                <div style={{marginBottom:20, marginTop:50}}>
                    <img src ={require("../assets/babelIconBlack.png")} alt="logo" style={{width:screenWidth*0.15, height:screenWidth*0.15}} />
                </div>
                <Typography type="h3" component="h1" color="primary" 
                    className={classes.boldMontSerrat}
                    style={{textAlign:'center', marginBottom:0, marginTop:20, letterSpacing:1}}
                >{'BABEL FLX'}
                </Typography>
                <Typography type="h3" component="h1" color="primary" 
                    // className={classes.boldMontSerrat}
                    style={{textAlign:'center', marginBottom:25, marginTop:0, letterSpacing:1, color:'#000', fontSize:'1rem',
                    fontFamily: "Montserrat",
                    // fontFamily :'sans-serif', 
                    //fontWeight: 800,
                    }}
                >{'Your flexible gym membership'}
                </Typography>
            </div>
        )
    }

    handleChange = name => event => {
        var updatedState = {};
        var value = event.target.value;
        if(name === 'checked'){
          value = event.target.checked;
        }
        updatedState[name] = value;
        this.setState({ ...updatedState });
    }
    
  // handleCheckBox = name => event => {
  //   this.setState({[name]: event.target.checked });
  // };
    // handleCheckBox = name => event =>{
    //   var value = event.target.checked;
    //   this.setState({name:value});
    // } 

    handleBuy = () => {
      // console.log('handleBuy: ', this.state);
      const lowerCaseEmail = this.state.email.toLowerCase();
      const emailMatch = this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email;
      const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;
      if (!isValidEmail){
        this.setState({showErrorDialog:true, errorMessage:'not valid email'});
        return;
      }
      if (!this.state.name || this.state.name.length < 4){
        this.setState({showErrorDialog:true, errorMessage:'not valid name'});
        return;
      }
      if (!this.state.phone || this.state.phone.length < 4){
        this.setState({showErrorDialog:true, errorMessage:'not valid phone number'});
        return;
      }
      if (!this.state.nric || this.state.nric.length < 6){
        this.setState({showErrorDialog:true, errorMessage:'not valid IC number'});
        return;
      }
      if (!this.state.city || this.state.city.length < 4){
        this.setState({showErrorDialog:true, errorMessage:'not valid city'});
        return;
      }
      if (!this.state.achieveTargetSource){
        this.setState({showErrorDialog:true, errorMessage:'not valid target'});
        return;
      }
      if (!this.state.refSource){
        this.setState({showErrorDialog:true, errorMessage:'not valid referral source'});
        return;
      }
      if (!this.state.checked){
        this.setState({showErrorDialog:true, errorMessage:'please tick the term & condition tickbox'});
        return;
      }

      this.setState({showLoading:true});
      this.props.actions.addInvoiceForFLX(lowerCaseEmail, this.state.name, this.state.phone, this.state.nric, this.state.refSource, this.state.achieveTargetSource, this.state.selectedVendPkgId, (response)=>{
            console.log('response: ', response);
            if (response){
                this.setState({showLoading:false});
            }
        });
    }

    handleViewTermsConditions = () => {console.log('view term n conditions'); this.setState({showTermNCondition:true})}

    renderOption(){
      const {classes} = this.props;
      const maximumWidth = '650px'
      return(
        <div className={classes.topcontainer}>
            <img src={edm} alt="loading..." style={{width:screenWidth*0.6, height:screenWidth*0.6, maxWidth:maximumWidth, maxHeight:maximumWidth, marginBottom:50}}/>
            <RoundButton
                key={'buyflx1'}
                text = {'SINGLE ACCESS RM 240'}
                onClick = {()=>{this.handlePickPkg(flxSingleAccess240VendProdId)}}
                textStyle = {{color:'#000', 
                          fontFamily: "Montserrat",
                          fontWeight: 700,
                          fontSize:15.6,
                          letterSpacing:0,
                        }}
            />
             <RoundButton
                key={'buyflx2'}
                text = {'ALL ACCESS RM 320'}
                onClick = {()=>{this.handlePickPkg(flxAllAccess320VendProdId)}}
                textStyle = {{color:'#000', 
                          fontFamily: "Montserrat",
                          fontWeight: 700,
                          fontSize:15.6,
                          letterSpacing:0,
                        }}
                // selectedButton = {(this.state.selectedWeek === week)? true:false}
            />
        </div>
    )
    }
    
    renderKeyInDetails(){
        const {classes} = this.props;
        const {name, phone, showDetails, selectedVendPkgId, selectedPackageName, nric, city} = this.state;

        // console.log('renderKeyInDetails: ', this.state);

        const emailMatch = this.state.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const email = (emailMatch && emailMatch.length > 0) ? emailMatch[0] : this.state.email;
        const isValidEmail = (emailMatch && emailMatch.length > 0) ? true : false;

        const howDidUknowLabel = 'How did you know about us?';
        const whatUWantToAchieveLabel = 'What would you like to achieve?';

        // define the layout
        const TextFieldEmail = <TextField id="email" label="Email*" fullWidth
        onChange={this.handleChange('email')} autoComplete='off' value={email} style={{marginBottom:8}}/>;

        const TextFieldName = <TextField id="name" label="Full Name (as in IC/Passport) *" fullWidth
            onChange={this.handleChange('name')} autoComplete='off' value={name} style={{marginBottom:8}}/>;

        const TextFieldPhoneNum = <TextField id="phone" label="Phone Number *" fullWidth
            onChange={this.handleChange('phone')} autoComplete='off' value={phone} type='number'
            style={{marginBottom:8}}/>;

        const TextFieldIC = <TextField id="icnumber" label="IC/Passport Number *" fullWidth
            onChange={this.handleChange('nric')} autoComplete='off' value={nric}
            // type='number'
            style={{marginBottom:8}}
          />;

        const TextFieldCity = <TextField id="city" label="which city you live in" fullWidth
                onChange={this.handleChange('city')} autoComplete='off' value={city} style={{marginBottom:8}}/>;
        return(
            <div className={classes.keyInDetailscontainer}>
                 {<Typography type="title" component="h1" color="primary" 
                    // className={classes.boldMontSerrat}
                    style={{textAlign:'center', marginBottom:10, marginTop:20, letterSpacing:1, color:'#000', 
                    fontFamily: "Montserrat",
                    // fontFamily :'sans-serif', 
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontSize:'0.9rem'}}
                >{`Package Selected: ${selectedPackageName}`}
                </Typography>}
              
                <div style = {{width:screenWidth*0.75, backgroundColor:'white', padding:20, borderRadius:20}}>
                  <Typography type="title" component="h1" color="primary" 
                      // className={classes.boldMontSerrat}
                      style={{textAlign:'center', marginBottom:5, marginTop:0, letterSpacing:1, color:'#000', 
                      fontFamily: "Montserrat",
                      // fontFamily :'sans-serif', 
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize:'0.9rem'}}
                  >{'FILL IN YOUR DETAILS'}
                  </Typography>
                 
                  {TextFieldEmail}

                  {showDetails && <div>
                    {TextFieldName}
                    {TextFieldPhoneNum}
                    {TextFieldIC}
                    {TextFieldCity}
                    {!this.state.refSource && <IntegrationAutosuggest selections='referralSource' placeholder={howDidUknowLabel} onSelectionChange={selectedRefSource => this.handleAutosuggest('refSource', selectedRefSource)}/>}
                    {this.state.refSource && 
                    <div style={{marginTop:16}}>
                        <FormLabel component="legend">Referral Source</FormLabel>
                        <Chip
                        avatar={null}
                        label={this.state.refSource}
                        style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                        onDelete={()=>this.handleAutosuggest('refSource', null)}
                        />
                    </div>
                    }
                    {!this.state.achieveTargetSource && <IntegrationAutosuggest selections='achieveTargetSource' placeholder={whatUWantToAchieveLabel} onSelectionChange={selectedAchieveTargetSource => this.handleAutosuggest('achieveTargetSource', selectedAchieveTargetSource)}/>}
                    {this.state.achieveTargetSource && 
                    <div style={{marginTop:16}}>
                        <FormLabel component="legend">Achieve Target Source</FormLabel>
                        <Chip
                        avatar={null}
                        label={this.state.achieveTargetSource}
                        style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                        onDelete={()=>this.handleAutosuggest('achieveTargetSource', null)}
                        />
                    </div>}
                  </div>}
                </div>
                
                {!showDetails && 
                <div style = {{marginTop:20, justifyContent:'center', alignItems:'center',  display:'flex', }}>
                  <RoundButton
                      key={'continueEmail'}
                      text = {'Continue'}
                      onClick = {()=>{this.handleContinueEmail()}}
                      textStyle = {{color:'#000', 
                                fontFamily: "Montserrat",
                                fontWeight: 700,
                                fontSize:15.6,
                                letterSpacing:0,
                              }}
                      // selectedButton = {(this.state.selectedWeek === week)? true:false}
                      // disabled={(this.state.email && this.state.email.length<5)||!isValidEmail}
                  />
                </div>
                }
                {showDetails && 
                    <FormGroup row style={{justifyContent:'center', marginLeft:20, marginRight:20}}>
                    <FormControlLabel
                        control={
                        <Checkbox
                            checked={this.state.checked}
                            // onChange={this.handleCheckBox('checked')}
                            onChange={this.handleChange('checked')}
                            value="checked"
                        />
                        }
                        label={(
                        <div style = {{}}>I agree to the <a style={{textDecoration: 'underline'}} 
                            onClick={()=>this.handleViewTermsConditions()}>Terms & Conditions</a>
                        </div>)}
                    />
                  </FormGroup>
                }
                {showDetails &&
                  <RoundButton
                    key={'buyBtn'}
                    text = {'BUY'}
                    onClick = {()=>{this.handleBuy()}}
                    textStyle = {{color:'#000', 
                              fontFamily: "Montserrat",
                              fontWeight: 700,
                              fontSize:15.6,
                              letterSpacing:0,
                            }}
                    // selectedButton = {(this.state.selectedWeek === week)? true:false}
                    // disabled = {!isValidEmail || !name || !phone || !nric || !this.state.refSource || !this.state.achieveTargetSource || !this.state.checked}
                  />
                }
               
               {showDetails && <BabelLogo hideLogo = {true} textColor = '#000'/>}
            </div>
        )
    }

    renderLoading(){
      // const {classes} = this.props;
      // console.log('showLoading...', this.state.showLoading);
      return( 
        <div 
          // className={classes.container}
          style= {{height:window.innerHeight}}
        >
           <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>
        </div>
      );
    }

    render() {
      const {classes} = this.props;
        // console.log('thestate: ', this.state);
      const {selectedVendPkgId} = this.state;

      return (
        <div className={classes.container}>
           {!this.state.showLoading && this.renderTop()}
           {!this.state.showLoading && !selectedVendPkgId && this.renderOption()}
           {!this.state.showLoading && selectedVendPkgId && this.renderKeyInDetails()}
           {!this.state.showLoading && this.state.showTermNCondition && this.renderShowTermsNCondition()}
           {this.state.showLoading && this.renderLoading()}
           {this.renderShowDialog()}
        </div>
      );
    }
  }
  
  buyFLX.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyFLXStyled = withStyles(styles)(buyFLX);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyFLXStyled)
  