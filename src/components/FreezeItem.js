  import {ListItem, ListItemText, ListItemSecondaryAction, IconButton} from '@material-ui/core';
  import {
    bindActionCreators
  } from 'redux';
  import {
    connect
  } from 'react-redux';
  import {withStyles} from '@material-ui/core';
  import CloseIcon from '@material-ui/icons/Close';
  import React from 'react';
  
  import PropTypes from 'prop-types';
  
  import * as Actions from '../actions';
  
  const styles = theme => ({});
  
  class FreezeItem extends React.Component {
  
    action = () => {
      // this.setState({ open: !this.state.open });
  
    };
  
    render() {
      const {
        primaryText,
        secondaryText,
        secondaryAction,
        bgColor,
        id, executorId, executorEmail, freezeStartMoment, userId,
        removeDisable
      } = this.props;
  
      const k = id;
      const freezeKey = k;
      // console.log(primaryText, secondaryText, action);
  
      // const getCurrentUserData = (state, props) => state.state && state.state.has('user') ? state.state.get('user') : null;
      // console.log('currentUserData: ', getCurrentUserData);
  
      return (
        <ListItem divider button key={freezeKey} style={{ backgroundColor: bgColor? bgColor:null }}>
          <ListItemText primary={primaryText} secondary={secondaryText} />
          {secondaryAction && false &&
            <ListItemSecondaryAction onClick={()=>this.props.actions.removeFreeze(k)}>
              <IconButton aria-label="Remove">
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          }
        {secondaryAction && true &&
            <ListItemSecondaryAction onClick={()=>this.props.actions.removeFreeze(k, userId, freezeStartMoment, executorId, executorEmail)}>
              {!removeDisable && <IconButton aria-label="Remove">
                <CloseIcon />
              </IconButton>}
            </ListItemSecondaryAction>
          }
        </ListItem>
      );
    }
  }
  
  FreezeItem.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  FreezeItem.defaultProps = {
    primaryText: '',
    secondaryText: '',
    action: null
  }
  
  const FreezeItemStyled = withStyles(styles)(FreezeItem);
  
  const mapStateToProps = (state, ownProps) => ({
    ...state,
    // currentUserData: getCurrentUserData(state, props),
  });
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FreezeItemStyled)