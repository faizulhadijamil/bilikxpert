import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from './actions';
import packageJson from '../package.json';
import StdText from './components/StdText';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  extraLightMontSerrat:{
    fontFamily: "Montserrat",
    fontWeight: 200,
    fontSize:10, margin:10,
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
  }
})

class BabelLogo extends React.Component {

  render(){
    const {classes} = this.props;
     // for buiild version
    const buildVersion = packageJson.version;
    let hideLogo = this.props.hideLogo? this.props.hideLogo:false;
    let hideTnC = this.props.hideTnC? this.props.hideTnC:false;
    const stdColor = 'rgba(0, 0, 0, 0.54)';
    let textColor = this.props.textColor? this.props.textColor:stdColor;
    const tncLink = this.props.tncLink? this.props.tncLink:null;
    const privacyPolicyLink = this.props.privacyPolicyLink? this.props.privacyPolicyLink:null;
    const fontStyle =  this.props.fontStyle? this.props.fontStyle:null;
    const isMonserratFontStyle = fontStyle && fontStyle === 'montserrat';
    // const buildVersion = this.props.version? this.props.version:null;

    console.log('themonserratStyle: ', fontStyle);
    console.log('isMonserratFontStyle: ', isMonserratFontStyle);

    return (
      <div style={{maxWidth:600, height:128, marginLeft:'auto', marginRight:'auto', marginTop:32, marginBottom:96}}>
        {!hideLogo && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
          <img src ={require("./assets/bilikxpert_logos_black.png")} alt="logo" style={{width:128, height:128}} />
        </div>}
        <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'center'}}>
          {!isMonserratFontStyle && <StdText 
            text = {`Terms & Conditions`} variant = 'caption' style={{margin:8, textDecoration: 'underline', color:textColor}} 
            onClick={()=>this.props.actions.viewTermsConditions(false, tncLink)}
          />}
          {!isMonserratFontStyle && <StdText 
            text = {`Privacy Policy`} variant = 'caption' style={{margin:8, textDecoration: 'underline', color:textColor}} 
            onClick={()=>this.props.actions.viewPrivacyPolicy(privacyPolicyLink)}
          />}
          {isMonserratFontStyle && !hideTnC &&<Typography className={classes.extraLightMontSerrat}
            variant = 'caption' style={{margin:8, textDecoration: 'underline', color:textColor}} 
            onClick={()=>this.props.actions.viewTermsConditions(false, tncLink)}
          >
             {`Terms & Conditions`}   
          </Typography>}
          {isMonserratFontStyle && !hideTnC && <Typography className={classes.extraLightMontSerrat}
            variant = 'caption' style={{margin:8, textDecoration: 'underline', color:textColor}} 
            onClick={()=>this.props.actions.viewPrivacyPolicy(privacyPolicyLink)}
          >
            {`Privacy Policy`}
          </Typography>}
        </div>
        {!isMonserratFontStyle && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
          <StdText text = {`Copyright © 2022 B Fitness Asia Sdn. Bhd. All Rights Reserved.`} variant = 'caption' style={{marginBottom:8, marginLeft:8, marginRight:8, color:textColor, textAlign:'center'}} />
        </div>}
        {!isMonserratFontStyle && buildVersion && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
          <StdText text = {`v${buildVersion}`} variant = 'caption' style={{marginBottom:8, marginLeft:8, marginRight:8, color:textColor, textAlign:'center'}} />
        </div>}
        {isMonserratFontStyle && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
          <Typography className={classes.extraLightMontSerrat} variant = 'caption' style={{marginBottom:8, marginLeft:8, marginRight:8, color:textColor, textAlign:'center'}}> {`Copyright © 2022 B Fitness Asia Sdn. Bhd. All Rights Reserved.`} </Typography>
        </div>}
        {isMonserratFontStyle && buildVersion && <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
          <Typography className={classes.extraLightMontSerrat} variant = 'caption' style={{marginBottom:8, marginLeft:8, marginRight:8, color:textColor, textAlign:'center'}}> {`v${buildVersion}`} </Typography>
        </div>}
      </div>
    );
  }
}

const BabelLogoStyled = withStyles(styles)(BabelLogo);

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(BabelLogoStyled)
// export default connect(null, mapDispatchToProps)(BabelLogo)
