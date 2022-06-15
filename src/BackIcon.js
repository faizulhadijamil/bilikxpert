import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IconButton} from '@material-ui/core';
import {ArrowBack} from '@material-ui/icons';
import React from 'react';

import * as Actions from './actions';

class BackIcon extends React.Component {

  handleBack = () => {
    this.props.actions.goBackOnce();
  }

  render() {
    return (
      <IconButton aria-label="Menu" onClick={()=>this.handleBack()}>
        <ArrowBack style={{fill:'#fff'}}/>
      </IconButton>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackIcon)