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
        alignItems:'center', justifyContent:'center',
        // borderRadius: 30,
        cursor: 'pointer', 
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1.0px solid #fff',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        // marginBottom:20,
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '16rem':'20rem'
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'1rem':'1.4rem', color:'#F7B23D', textAlign:'center'
    },
    buttonTextSmall:{
        letterSpacing:1, fontSize: ismobile? '1rem':'1rem', color:'#F7B23D', textAlign:'center'
    },
    smallbutton:{
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        cursor: 'pointer', 
        // backgroundColor: isSelected? bgColorSelected:bgColorNotSelected,
        border: '1px solid white',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'2%',
        paddingTop:'1%',
        paddingBottom:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width: ismobile? '6rem':'10rem'
    },
  });

class SquareButton1 extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
  
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, key, selectedButton, style} = this.props;
        const selectedBtnStyle = selectedButton? {backgroundColor:'white', border: '1.5px solid black'}:{border: '1.5px solid white', backgroundColor:'black'}
        const selectedTextStyle = selectedButton? {color:'black'}:{color:'white'}
        //const buttonwidth = this.props.width||null
        const propStyle = style;
        return (
            <div 
                // color='primary' 
                key={key} 
                onClick={!this.props.disabled? this.props.onClick:null} 
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

SquareButton1.propTypes = {classes: PropTypes.object.isRequired};

const SquareButton1Styled = withStyles(styles)(SquareButton1);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SquareButton1Styled)