
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles} from '@material-ui/core';
  import React from 'react';
  
  import PropTypes from 'prop-types';
  // import { ZoomMtg } from '@zoomus/websdk';
  
  import {
    makeGetCurrentUser,
  } from '../selectors'
  import * as Actions from '../actions';

  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  });
  
//   var __html = require('./verifyzoom.html');
//   var template = { __html: __html };

  class vidConfPage extends React.Component {
  
    state = {
    
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);
    }
  
    componentDidUpdate(prevProps) {
      if (this.props.userId !== prevProps.userId) {
        this.handleSelectPerson(this.props.userId);
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    render() {
      const {
        classes
      } = this.props;

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      console.log('email: ', email);

      // return React.createElement("h1", {dangerouslySetInnerHTML: {__html: html}});
      return(
        <div> 
            <p>{`86f539ec9ba1499c9b5a939add9c0002`}</p>
        </div>
        
      );
    }
  }
  
  vidConfPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const vidConfPageStyled = withStyles(styles)(vidConfPage);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
      }
    }
    return mapStateToProps
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(vidConfPageStyled)