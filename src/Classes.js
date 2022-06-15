// @flow weak
import {CircularProgress, GridList,GridListTile,GridListTileBar,InputAdornment,Button,TextField,Typography} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search'

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import BabelLogo from './BabelLogo';

const styles = theme => ({
  container: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    overflow: 'hidden',
    // background: theme.palette.background.paper,
    // boxSizing: 'border-box',
    maxWidth: theme.spacing(120),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(8),
    paddingBottom: 56
    // alignItems:'center'
    // overflowX: 'hidden'
  },
  gridList: {
    width: 'auto',
    height: 'auto',
    // paddingLeft:16,
    // paddingRight:16
    padding: 16
  },

  // root: {
  //   boxSizing: 'border-box',
  //   flexShrink: 0,
  // },
  tile: {
    position: 'relative',
    display: 'block', // In case it's not renderd with a div.
    overflow: 'hidden',
    borderRadius: 3,
    height: theme.spacing(25),
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  barRoot: {
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845',
    // padding:0,
    minWidth: 0
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  defaultTileIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'block',
    height: theme.spacing(20),
    width: 'auto'
  },
  subtitle: {
    whiteSpace: 'normal',
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  subtitleTrim: {
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  tileTitle: {
    paddingTop: theme.spacing(2),
    fontSize: 19,
    lineHeight: '22px',
    fontWeight: 700
  },
  center: {
    // flexDirection:'column',
    // flex:1,
    // justifyContent:'space-around',
  }
});

class Classes extends React.Component {

  state = {
    search: ''
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  handleSearch = name => event => {
    this.setState({
      search: event.target.value
    });
  }

  render() {
    const {
      classes,
      actions,
      state
    } = this.props;


    const allClasses = state.getIn(['classes', 'classesById']);

    const user = this.props.state.get('user');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;

    if (!allClasses) {
      return (
        <div className={classes.container}>
          <MenuAppBar />
          <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
        </div>
      );
    }
    const searchText = this.state.search.length > 0 ? this.state.search.toLowerCase() : null;
    const activeClassesData = allClasses.filter(x => x.get("active") === true &&
      (!searchText ||
        ((searchText.length > 0 && x.get('name').toLowerCase().indexOf(searchText)) !== -1 ||
          x.get('description').toLowerCase().indexOf(searchText) !== -1 ||
          x.get('longDescription').toLowerCase().indexOf(searchText) !== -1 ||
          x.get('venue').toLowerCase().indexOf(searchText) !== -1
        )
      ));
    const inactiveClassesData = allClasses.filter(x => x.get("active") !== true &&
      (!searchText ||
        ((searchText.length > 0 && (x.get('name') && x.get('name').toLowerCase().indexOf(searchText)) !== -1) ||
          (x.get('description') && x.get('description').toLowerCase().indexOf(searchText) !== -1) ||
          (x.get('longDescription') && x.get('longDescription').toLowerCase().indexOf(searchText) !== -1) ||
          (x.get('venue') && x.get('venue').toLowerCase().indexOf(searchText) !== -1)
        )
      ));

    var activeClassTiles = [];
    var inactiveClassTiles = [];
    activeClassesData.toKeyedSeq().forEach((v, k) => {
      if (activeClassTiles.length === 0) {
        activeClassTiles.push(
          <GridListTile key={'active-title'} cols={2} style={{ height: 'auto' }}>
          <Typography type="title">
            Classes
          </Typography>
          </GridListTile>
        );
      }

      const tempImg = v.get('image');
      const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

      activeClassTiles.push(
        <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(v.get('slug'))}>
          <img key={k} src={thumbImg} alt={v.get('name')}  />
          <GridListTileBar
            classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
            title={v.get('name')}
            subtitle={v.get('description')}
            actionIcon={
              <Button className={classes.button}>
                  {isAdmin ? 'Manage' : 'Book Now'}
              </Button>
            }
          />
        </GridListTile>
      );
    })

    inactiveClassesData.toKeyedSeq().forEach((v, k) => {
      if (inactiveClassTiles.length === 0) {
        inactiveClassTiles.push(
          <GridListTile key={'inactive-title'} cols={2} style={{ height: 'auto' }}>
          <Typography type="title">
            Coming Soon
          </Typography>
          </GridListTile>
        );
      }
      const tempImg = v.get('image');
      const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

      inactiveClassTiles.push(
        <GridListTile key={k} cols={1} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(v.get('slug'))}>
        <img key={k} src={thumbImg} alt={v.get('name')}  />
        <GridListTileBar
          classes={{title:classes.tileTitle, subtitle:classes.subtitleTrim, root:classes.barRoot}}
          title={v.get('name')}
          subtitle={v.get('description')}
        />
        </GridListTile>
      );
    })

    return (
      <div className={classes.container}>
          <MenuAppBar />
          <GridList className={classes.gridList} spacing={16} cellHeight='auto'>
          <GridListTile cols={2} style={{ height: 'auto' }}>
            <TextField
              id="search"
              label="Search Classes"
              fullWidth
              onChange={this.handleSearch('search')}
              style={{marginBottom:16}}
              InputProps={{
                endAdornment:(
                  <InputAdornment style={{marginTop:0}} position="end"><SearchIcon color='disabled'/></InputAdornment>
                )
              }}
            />
          </GridListTile>
          {activeClassTiles}
          {inactiveClassTiles}
          </GridList>
          <BabelLogo/>
        </div>
    );
  }
}

Classes.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ClassesStyled = withStyles(styles)(Classes);

const mapStateToProps = state => ({
  ...state
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassesStyled)
