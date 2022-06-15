import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography} from '@material-ui/core';

import * as Actions from '../actions';

const ismobile = window.innerWidth<=550?true:false;
const screenWidth = window.innerWidth;

const styles = theme => ({
    buttonStyle:{
        // paddingLeft: 25,
        // paddingRight: 25,
        paddingTop:3,
        paddingBottom:3,
        alignItems:'center', justifyContent:'center',
        borderRadius: 30,
        cursor: 'pointer', 
        backgroundColor: 'transparent',
        // border: '1.3px',
        border: '2px solid white',
        borderColor:'#E8C888',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width:screenWidth*0.8,
        maxWidth:'18rem'
        // width: ismobile? '4.5rem':'12rem'
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'1.2rem':'1.4rem', color:'#E8C888', textAlign:'center'
    },
    buttonTextBig:{
        letterSpacing:1, fontSize: ismobile? '1rem':'2rem', color:'#E8C888', textAlign:'center'
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
        // width: ismobile? '4.5rem':'8rem'
    },
  });

class AngpauButton extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
  
    render() {
        console.log('renderBtnProps: ', this.props);
        const {classes, key, selectedButton} = this.props;
        // const selectedBtnStyle = selectedButton? {backgroundColor: '#fff',  border: '1.5px #E8C888'}:{border: '1.5px #E8C888'};
        //const buttonwidth = this.props.width||null
        return (
            <div 
                color='primary' 
                key={key} 
                onClick={this.props.disabled? null:this.props.onClick} 
                className = {this.props.bigbutton? classes.bigbutton:classes.buttonStyle}
                disabled={this.props.disabled? this.props.disabled:false}
                style = {this.props.style}
                >
                <Typography className={this.props.bigbutton? classes.buttonTextBig:classes.buttonText} style={this.props.textStyle}>
                    {this.props.text}
                </Typography>
            </div>
        );
    }
  }

  AngpauButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

const AngpauButtonStyled = withStyles(styles)(AngpauButton);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(AngpauButtonStyled)