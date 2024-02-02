import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Button, Typography, TextField, Grid} from '@material-ui/core';


import * as Actions from '../actions';
import { Edit, Photo } from '@material-ui/icons';
import { makeGetSelectedUserInvoices } from '../selectors';

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
        backgroundColor: '#fff',
        border: '1.3px',
        // border: '1.3px solid #525252',
        // borderColor: isSelected? bgColorNotSelected:bgColorSelected,
        margin:'1%',
        paddingLeft:'4%',
        paddingRight:'4%',
        width:screenWidth*0.6,
        maxWidth:'15rem'
        // width: ismobile? '4.5rem':'12rem'
    },
    buttonText:{
        letterSpacing:1, fontSize:ismobile?'0.8rem':'0.8rem', color:'#525252'
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
        // width: ismobile? '4.5rem':'8rem'
    },
    selectedUser: {
        position: 'fixed',
        zIndex: 1200
      },
      listSection: {
    },
    title: {
      marginBottom: theme.spacing(1)
    },
    bookButton: {
      margin: theme.spacing(2),
      backgroundColor: "#fde298",
      color: '#fff',
    },
    addButton: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: "#fde298",
        color: '#fff',
      },
      fileInput: {
        display: 'none'
      },
      buttonLarge: {
        fontSize: "1.5rem",
        textTransform: "capitalize",
        fontWeight: 500,
        fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
          backgroundColor: "#fde298",
          // backgroundColor: "#FFF",
        color: '#062845',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 20,
        minHeight: 36,
        minWidth: 88,
        width: '100%',
        maxWidth:300,
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        justifyContent: 'flexEnd'
      },

  });


class InvoiceCard extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
   
    
    
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, key, selectedButton} = this.props;
        const selectedBtnStyle = selectedButton? {backgroundColor: '#fff',  border: '1.5px #A7998B',}:this.props.style;
        //const buttonwidth = this.props.width||null
        
        return (
            <div 
                color='primary' 
                key={key} 
                onClick={this.props.disabled? null:this.props.onClick} 
                className = {this.props.bigbutton? classes.bigbutton:classes.buttonStyle}
                disabled={this.props.disabled? this.props.disabled:false}
                style = {selectedBtnStyle}
                >
        
        
                <Typography className={this.props.bigbutton? classes.buttonTextBig:classes.buttonText} style={this.props.textStyle}>
                    {this.props.text}
                </Typography>
                <Typography className={classes.buttonText} style={this.props.textStyle}>
                    {`Start Date: ${this.props.startDate}`}
                </Typography>
                <Typography className={classes.buttonText} style={this.props.textStyle}>
                    {`End Date: ${this.props.endDate}`}
                </Typography>
                <Typography className={classes.buttonText} style={this.props.textStyle}>
                    {`branch: ${this.props.branchId}`}
                   
                </Typography>
                <Typography className={classes.buttonText} style={this.props.textStyle}>
                    {`Trans Date: ${this.props.transDate}`}
                </Typography>

                <Typography className={classes.buttonText} style={this.props.textStyle}>
                    
                    {`roomNumber: ${this.props.roomNumber}`}

                </Typography>
                <Typography className={classes.buttonText} style={this.props.textStyle}>
                  
                    {`totalPrice:RM${this.props.totalPrice}`}

                </Typography>

                
                {this.props.showDetails && <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    defaultValue={this.props.defaultEmail}
                    value={this.props.email}
                    fullWidth
                    //onChange={this.props.handleChange('email')}
                    //disabled={!roles || isShared || isTrainer}
                    required
                />}

                {this.props.showDetails && <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        defaultValue={this.props.UserName}
                        value={this.props.Name}
                        fullWidth
                       // onChange={this.handleChange('name')}
                        //disabled={true}
                        required  
               /> }


                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="phone"
                            label="Phone Number"
                            type="number"
                            defaultValue={this.props.selectedUserPhone}
                            value={this.props.Phone}
                            fullWidth
                           // onChange={this.handleChange('phone')}
                            //disabled={true}
                            required

                     />}
                
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="branch"
                            label="Branch"
                            defaultValue={this.props.selectedBranchName}
                            value={this.props.BranchName}
                            fullWidth
                            //onChange={this.handleChange('currentBranchName')}
                            //disabled={true}
                            required
                    />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="roomNumber"
                            label="Room Number"
                            defaultValue={this.props.selectedUserRoomNumber}
                            value={this.props.selectedUserRoomNumber}
                            fullWidth
                            //onChange={this.handleChange('roomNumber')}
                            //disabled={true}
                            required
                        />}
                     
                     { this.props.showDetails && <TextField
                            margin="dense"
                            id="package"
                            label="Package"
                            defaultValue={this.props.selectedUserPackage}
                            value={this.props.selectedUserPackage}
                            fullWidth
                            //onChange={this.handleChange('package')}
                            required
                     />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="deposit"
                            label="Deposit"
                            //defaultValue={this.props.selectedUserDeposit}
                            //value={this.props.selectedUserDeposit}
                            fullWidth
                           // onChange={this.handleChange('monthlyDeposit')}
                            required
                    />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="roomPrice"
                            label="Room Price"
                            type="price"
                            defaultValue={this.props.selectedRoomPrice}
                            value={this.props.selectedRoomPrice}
                            fullWidth
                           // onChange={this.handleChange('roomPrice')}
                            required
                        />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="startDate"
                            label="Start Date"
                            type="date"
                            defaultValue={this.props.selectedUserStartDate}
                            value={this.props.selectedUserStartDate}
                            fullWidth
                            //onChange={this.handleChange('startDate')}
                            required
                        />}
                     {this.props.showDetails && <TextField
                            margin="dense"
                            id="endDate"
                            label="End Date"
                            type="date"
                            defaultValue={this.props.selectedUserEndDate}
                            value={this.props.selectedUserEndDate}
                            fullWidth
                           // onChange={this.handleChange('endDate')}
                            required
                        />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="paymentType"
                            label="Cash/online transfer/cash deposit"
                            defaultValue={this.props.Cash}
                            value={this.props.paymentType}
                            fullWidth
                            //onChange={this.handleChange('paymentType')}
                            required
                        />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="paymentStatus"
                            label="status: PAID/UNPAID"
                            value={this.props.paymentStatus}
                            fullWidth
                           // onChange={this.handleChange('paymentStatus')}
                            required
                        />}
                    {this.props.showDetails && <TextField
                            margin="dense"
                            id="remarks"
                            label="notes/remark"
                            value={this.props.remark}
                            fullWidth
                           // onChange={this.handleChange('remark')}
                            required
                        />}
                        

                    <Button> Edit </Button> <Button>VOID</Button> 

                     
            </div>
        );
    }
  }

  

  

  InvoiceCard.propTypes = {
    classes: PropTypes.object.isRequired,
};


const InvoiceCardStyled = withStyles(styles)(InvoiceCard);


const mapStateToProps = state => ({

    ...state
});

  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
        
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(InvoiceCardStyled)