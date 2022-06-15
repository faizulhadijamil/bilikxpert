import 'react-credit-cards/es/styles-compiled.css';
import moment from 'moment-timezone';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withStyles
} from '@material-ui/core';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List, {ListItem, ListItemText} from 'material-ui/List';
import {CircularProgress} from 'material-ui/Progress'
import React from 'react';
import Typography from 'material-ui/Typography';

import PropTypes from 'prop-types';

import {makeGetSelectedUserGantnerLogs} from '../selectors';
import * as Actions from '../actions';

const styles = theme => ({
  title: {
  },
  margin: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

class VClassButton extends React.Component {

  state = {
    open: this.props.isOpen? this.props.isOpen:false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleOpen = () => {
    this.setState({
      open: !this.state.open,
    });

  };


  


  render() {



      return(
        <List component="div">
         
        </List>
      )
    
  }
}

VClassButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

VClassButton.defaultProps = {
  open: false,
  title: "No title",
  items: [],
  type: 'none',
  headerBackgroundColor: '#062845'
}

const VClassButtonStyled = withStyles(styles)(VClassButton);

const makeMapStateToProps = () => {
  const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
  const mapStateToProps = (state, props) => {
    return {
      selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
    }
  }
  return mapStateToProps
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(makeMapStateToProps, mapDispatchToProps)(VClassButtonStyled)
