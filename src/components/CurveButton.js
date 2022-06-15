import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography} from '@material-ui/core';

import * as Actions from '../actions';

var ismobile = window.innerWidth<=550?true:false;
const screenWidth = window.innerWidth;

const styles = theme => ({
    buttonStyle:{
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        marginBottom: 2,
        backgroundColor: "white",
        color: '#062845',
        borderRadius: 25,
        cursor: 'pointer',
        paddingLeft:30, paddingRight:30, paddingTop:5, paddingBottom:5,
        width:screenWidth*0.5
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'1.2rem':'1.4rem', color:'#525252', textAlign:'center'
    },
    buttonTextBig:{
        letterSpacing:1, fontSize: ismobile? '1rem':'2rem', color:'#525252', textAlign:'center'
    },
    bigbutton:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        borderRadius: 30,
        cursor: 'pointer', 
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1.3px solid #525252',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'5%',
        paddingRight:'5%',
        width: ismobile? '4.5rem':'8rem'
    },
  });

class CurveButton extends React.Component {
  
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, key, selectedButton} = this.props;
        const selectedBtnStyle = selectedButton? {backgroundColor: '#A7998B',  border: '1.3px #A7998B'}:null
        //const buttonwidth = this.props.width||null
        return (
            <div 
                color={this.props.color? this.props.color:'primary'} 
                key={key} 
                onClick={this.props.onClick} 
                className = {classes.buttonStyle}
                disabled={this.props.disabled? this.props.disabled:false}
                style = {this.props.style, selectedBtnStyle}
                >
                <Typography className={this.props.bigbutton? classes.buttonTextBig:classes.buttonText} style={this.props.textStyle}>
                    {this.props.text}
                </Typography>
            </div>
        );
    }
}

CurveButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const CurveButtonStyled = withStyles(styles)(CurveButton);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(CurveButtonStyled)