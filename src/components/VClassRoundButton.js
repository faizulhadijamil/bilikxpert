import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography} from '@material-ui/core';

import * as Actions from '../actions';

var ismobile = window.innerWidth<=550?true:false;

const styles = theme => ({
    buttonStyle:{
        // paddingLeft: 25,
        // paddingRight: 25,
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        borderRadius: 30,
        cursor: 'pointer', 
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1.3px solid #F7B23D',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '16rem':'20rem'
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'1.4rem':'1.4rem', color:'#F7B23D', textAlign:'center'
    },
    buttonTextSmall:{
        letterSpacing:1, fontSize: ismobile? '1rem':'1rem', color:'#F7B23D', textAlign:'center'
    },
    smallbutton:{
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        borderRadius: 30,
        cursor: 'pointer', 
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1.3px solid #F7B23D',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '10rem':'10rem'
    },
  });

class VClassRoundButton extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
  
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, key, selectedButton, style} = this.props;
        const selectedBtnStyle = selectedButton? {backgroundColor:'#F7B23D', border: '1.5px solid #F7B23D'}:{border: '1.5px solid #F7B23D'}
        const selectedTextStyle = selectedButton? {color:'#0C0C07'}:{color:'#F7B23D'}
        //const buttonwidth = this.props.width||null
        const propStyle = style;
        return (
            <div 
                // color='primary' 
                key={key} 
                onClick={this.props.onClick} 
                className = {this.props.smallbutton? classes.smallbutton:classes.buttonStyle}
                disabled={this.props.disabled? this.props.disabled:false}
                style = {this.props.style, selectedBtnStyle}
                >
                <Typography className={this.props.smallbutton? classes.buttonTextSmall:classes.buttonText} style={this.props.textStyle, selectedTextStyle}>
                    {this.props.text}
                </Typography>
            </div>
        );
    }
  }

  VClassRoundButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const VClassRoundButtonStyled = withStyles(styles)(VClassRoundButton);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(VClassRoundButtonStyled)