import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Button from 'material-ui/Button';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import * as Actions from '../actions';
import Typography from 'material-ui/Typography';

var ismobile = window.innerWidth<=550?true:false;
const screenWidth = window.innerWidth;

const styles = theme => ({
    buttonStyle:{
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: "white",
        color: '#062845',
        borderRadius: 5,
        cursor: 'pointer',
        paddingLeft:20, paddingRight:20, paddingTop:2, paddingBottom:2,
        width:screenWidth*0.2
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'1rem':'1.4rem', color:'#525252', textAlign:'center'
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

class SmallButton extends React.Component {
  
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

SmallButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const SmallButtonStyled = withStyles(styles)(SmallButton);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SmallButtonStyled)