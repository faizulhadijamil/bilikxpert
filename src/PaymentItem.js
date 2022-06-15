import {ListItem, ListItemText, ListItemSecondaryAction, IconButton} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import PropTypes from 'prop-types';
import * as Actions from './actions';

const styles = theme => ({

});

class PaymentItem extends React.Component {

  action = () => {
    // this.setState({ open: !this.state.open });

  };

  render() {
    const {
      primaryText,
      secondaryText,
      secondaryAction,
      bgColor,
      id
    } = this.props;

    const k = id;
    const freezeKey = k;
    // console.log(primaryText, secondaryText, action);

    return (
      <ListItem divider button key={freezeKey} style={{ backgroundColor: bgColor? bgColor:null }}>
        <ListItemText primary={primaryText} secondary={secondaryText} />
        {secondaryAction &&
          <ListItemSecondaryAction onClick={()=>this.props.actions.removeFreeze(k)}>
            <IconButton aria-label="Remove">
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        }
      </ListItem>
    );
  }
}

// {this.state.freezeDialogOpen &&
//   <ListItemSecondaryAction onClick={()=>this.props.actions.removeFreeze(k)}>
//     <IconButton aria-label="Remove">
//       <CloseIcon />
//     </IconButton>
//   </ListItemSecondaryAction>
// }

PaymentItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

PaymentItem.defaultProps = {
  primaryText: '',
  secondaryText: '',
  action: null
}

const PaymentItemStyled = withStyles(styles)(PaymentItem);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentItemStyled)