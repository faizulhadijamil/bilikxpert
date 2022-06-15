import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Typography} from '@material-ui/core';

import * as Actions from '../actions';

var ismobile = window.innerWidth<=550?true:false;

const styles = theme => ({
    button:{
        fontSize: "0.875rem",
        textTransform: "uppercase",
        fontWeight: 500,
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        marginTop: 4, marginBottom: 4,
        backgroundColor: "#fde298",
        color: '#062845',
        paddingTop: 8, paddingBottom: 8,
        paddingLeft: 16, paddingRight: 16,
        borderRadius: 2,
        minHeight: 36,
        minWidth: 88,
        width: '100%',
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        justifyContent: 'flexEnd',
        '&:hover': {color: "#fde298", background: '#062845'},
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'0.65rem':'1.4rem', color:'#525252', textAlign:'center'
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

class StdText extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
  
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, key,} = this.props;
        const variant = this.props.variant? this.props.variant:'body1';
        const component = this.props.component? this.props.component:null;
        // const selectedBtnStyle = selectedButton? {backgroundColor: '#A7998B',  border: '1.3px #A7998B',}:null
        //const buttonwidth = this.props.width||null
        // return (
        //     <div 
        //         color={this.props.color? this.props.color:'white'}
        //         key={key} 
        //         onClick={this.props.onClick} 
        //         className = {this.props.bigbutton? classes.bigbutton:classes.button}
        //         disabled={this.props.disabled? this.props.disabled:false}
        //         // style = {this.props.style, selectedBtnStyle}
        //         >
        //         <Typography className={this.props.bigbutton? classes.buttonTextBig:classes.buttonText} style={this.props.textStyle}>
        //             {this.props.text}
        //         </Typography>
        //     </div>
        // );
        return (
            <Typography key = {key} variant={variant} component={component} color={this.props.color? this.props.color:"primary"} gutterBottom style = {this.props.style}
                onClick = {this.props.onClick}
            >
               {this.props.text}
            </Typography>
        )
    }
  }

  StdText.propTypes = {
    classes: PropTypes.object.isRequired,
};

const StdTextStyled = withStyles(styles)(StdText);

const mapStateToProps = state => ({...state});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(StdTextStyled)