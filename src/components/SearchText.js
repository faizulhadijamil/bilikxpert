import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {TextField, InputAdornment, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import * as Actions from '../actions';

const styles = theme => ({
    search: {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        // // position: 'fixed',
        // // top: 64,
        // backgroundColor: '#fff',
        // zIndex: 1200,
        // marginRight: theme.spacing(2),
        // marginLeft: theme.spacing(2),
        // width: '90%',
        // borderRadius:3
        // // alignItems: 'end'
        // // borderRadius: 8,
        // // padding: 8
        // marginTop: 64,
        marginTop: -48,
        marginBottom: 32,
        // paddingRight: theme.spacing(2),
        // paddingLeft: theme.spacing(2),
        position: 'fixed',
        // top: 64,
        backgroundColor: '#fff',
        zIndex: 1200,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: '90%',
        left:20
        // alignItems: 'end'
        // borderRadius: 8,
        // padding: 8
    },
});

class SearchText extends React.Component {
  
    // handleBack = () => {
    //   this.props.actions.goBackOnce();
    // }
  
    render() {
        // console.log('renderBtnProps: ', this.props);
        const {classes, selectedStaffChip} = this.props;

        var inputPropsAdornment = selectedStaffChip? {
            startAdornment:(
                <InputAdornment position="start">
                  {this.props.selectedStaffChip}
                </InputAdornment>
            ),
            endAdornment:(
                <InputAdornment position="end">
                <IconButton onClick={this.props.onIconClick}>
                    {(this.props.value && this.props.value.length > 0) ? <CloseIcon color='disabled'/> : <SearchIcon color='disabled'/>}
                </IconButton>
            </InputAdornment>
            ),
            style:{alignItems : 'end', paddingTop:8, paddingLeft:8, paddingBottom:8}
        } : {
                endAdornment:(
                    <InputAdornment position="end">
                    <IconButton onClick={this.props.onIconClick}>
                        {(this.props.value && this.props.value.length > 0) ? <CloseIcon color='disabled'/> : <SearchIcon color='disabled'/>}
                    </IconButton>
                </InputAdornment>
                )
            }

        return (
            <TextField
                id="search"
                label={this.props.searchLabel? this.props.searchLabel:'Search'}
                value={this.props.value}
                onChange = {this.props.onChange}
                className={classes.search}
                InputProps={inputPropsAdornment}
                style={this.props.style}
                onFocus={()=>window.scrollTo(0, 0)}
            />
        );
    }
  }

  SearchText.propTypes = {
    classes: PropTypes.object.isRequired,
};

const SearchTextStyled = withStyles(styles)(SearchText);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(SearchTextStyled)