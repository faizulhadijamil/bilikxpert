import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, MenuItem, Paper, TextField} from '@material-ui/core';
import Downshift from 'downshift';
import React from 'react';
import PropTypes from 'prop-types';
import * as Actions from './actions';
function renderInput(inputProps) {
  const {
    classes,
    autoFocus,
    value,
    ref,
    ...other
  } = inputProps;
  //
  // var name = ""
  // if(value.length > 1){
  //   name = value.name;
  // }

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(params) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = params;

  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion[1].get('name');

  return (
    <MenuItem
      {...itemProps}
      key={suggestion[1]}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected
          ? 500
          : 400,
      }}
    >
      {suggestion[1].get('name')}
    </MenuItem>
  );
}

function renderRefSuggestion(params) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = params;

  const isHighlighted = highlightedIndex === index;
  var isSelected = selectedItem === suggestion;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected
          ? 500
          : 400,
      }}
    >
      {suggestion}
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const {
    containerProps,
    children
  } = options;

  // console.log(children);

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getRefSuggestions(referralOptions, inputValue) {
  // let count = 0;
  const filteredOptions = referralOptions.filter(suggestion =>{
    const keep = (!inputValue || suggestion.includes(inputValue.toLowerCase()));
    return keep;
  })
  return filteredOptions;
}

function getSuggestions(users, inputValue) {
  let count = 0;

  const filteredUsers = users.filter(suggestion => {
    const name = suggestion.has('name') ? suggestion.get('name') : null;
    const email = suggestion.has('email') ? suggestion.get('email') : null;
    const phone = suggestion.has('phone') ? `${suggestion.get('phone')}` : null;
    const roomNumber = suggestion.has('rooms') ? `${suggestion.get('roomNumber')}` : null;
    const keep =
      // (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) &&
      (!inputValue || (name && name.toLowerCase().includes(inputValue.toLowerCase())) ||
        (email && email.toLowerCase().includes(inputValue.toLowerCase())) ||
        (phone && phone.toLowerCase().includes(inputValue.toLowerCase()))) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
  // console.log(filteredUsers);
  return filteredUsers.entrySeq();
}

const styles = {
  container: {
    marginTop: 16,
    flexGrow: 1,
  },
  textField: {
    width: '100%',
  },
};

class IntegrationAutosuggest extends React.Component {

    state = {
      inputValue: '',
      open : false
    }

    onSelect = (selectedItem, stateAndHelpers) => {
      if (selectedItem){
        //console.log('selectedItem: ', selectedItem);
        this.props.onSelectionChange(selectedItem[0]);
        stateAndHelpers.clearSelection();
      }  
    }

    onRefSelect = (selectedItem, stateAndHelpers) => {
      if (selectedItem) {
        this.props.onSelectionChange(selectedItem);
        stateAndHelpers.clearSelection();
      }
    }

    handleFocus = (so) =>{
      this.setState({open:true});
    }

    shuffleArray = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    

    render() {
        const {
          classes,
          theme
        } = this.props;

        const referralOptions = ['Newspapers and magazines', 'Recommendation from friends/family', 'Online articles/media',
      'Social media adverts', `Friend's post`, 'Google', 'Other online platform', 'Corporate benefit', 'Just passing by'];
        const refOptionsMap = referralOptions.map(refOption=>refOption);

        const achieveTargetOptions = this.shuffleArray(['Lose Weight', 'Bulk Up', 'Be Healthier', 'Get Fitter', 'Recover from Injury', 'Tone Up']);
          const achieveTargetOptMap = achieveTargetOptions.map(refOption=>refOption);
      
        const admins = this.props.state && this.props.state.hasIn(['admins', 'adminsById']) ? this.props.state.getIn(['admins', 'adminsById']) : null;
        const trainers = this.props.state && this.props.state.hasIn(['trainers', 'trainersById']) ? this.props.state.getIn(['trainers', 'trainersById']) : null;
        // const membershipConsultants = this.props.state && this.props.state.hasIn(['membershipConsultants', 'membershipConsultantsById']) ? this.props.state.getIn(['membershipConsultants', 'membershipConsultantsById']) : null;
        // 14/8/2020, get all staff instead of mcId
        const membershipConsultants = this.props.state && this.props.state.hasIn(['staffs', 'staffsById']) ? this.props.state.getIn(['staffs', 'staffsById']) : null;

        const placeholder = this.props.placeholder ? this.props.placeholder : 'Search by name, email or phone';
        const selections = this.props.selections ? this.props.selections : 'users';
        const rooms = this.props.rooms ? this.props.rooms : 'roomNumber';
        console.log('integration autosuggets selection: ', selections);
        //console.log('integration autosuggets rooms: ', rooms);
        //console.log('theselection: ', selections);
        var users = this.props.state && this.props.state.has(selections) ? this.props.state.getIn([selections, `${this.props.selections}ById`]) : null;
        var branches = this.props.state && this.props.state.has(selections) ? this.props.state.getIn([selections, `${this.props.selections}ById`]) : null;
        var roomNumber= this.props.state && this.props.state.has(selections) ? this.props.state.getIn([selections, `${this.props.selections}BybranchesId`]) : null;
        if (selections === 'membershipConsultants') {
          users = membershipConsultants ? membershipConsultants.merge(trainers).merge(admins) : null;
        } else if (selections === 'activeMembers') {
          const expiredMembers = this.props.state && this.props.state.hasIn(['expiredMembers', 'expiredMembersById']) ? this.props.state.getIn(['expiredMembers', 'expiredMembersById']) : null;
          users = users ? users.merge(expiredMembers) : null;
        }
        // else if (selections === 'branches') {

        // }

        if (!users) {
          users = this.props.state && this.props.state.has('users') ? this.props.state.getIn(['users', 'usersById']) : null;
        }

        if(users && users.size > 0){
          users = users.sort((a,b)=>{
            const aName = a.get('name');
            const bName = b.get('name');
            if (aName < bName) { return -1; }
            if (aName > bName) { return 1; }
            return 0;
          });
        }

        return (
            <Downshift
              isOpen={this.state.open}
              onOuterClick={()=>{
                this.setState({open:false})}
              }
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput(
              getInputProps({
                classes,
                placeholder: placeholder,
                id: 'integration-downshift',
                autoFocus:false,
                onFocus:this.handleFocus
              }),
            )}
            {isOpen
              ? (selections === 'referralSource' || selections === 'achieveTargetSource') ? 
              renderSuggestionsContainer({
                  children: getRefSuggestions(((selections === 'referralSource')? refOptionsMap:achieveTargetOptMap), inputValue).map((suggestion, index) =>
                    renderRefSuggestion({
                      suggestion,
                      index,
                      theme,
                      itemProps: getItemProps({ item: suggestion }),
                      highlightedIndex,
                      selectedItem,
                    }),
                  ),
                })
              : (selections === 'branches') ?
              renderSuggestionsContainer({
                children: getSuggestions(branches, inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    theme,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem,
                    roomNumber,
                  }),
                ),
              }):
              renderSuggestionsContainer({
                children: getSuggestions(users, inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    theme,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem,
                  }),
                ),
              }): null}
          </div>
        )}
        onSelect={(selectedItem, stateAndHelpers)=>{(selections === 'referralSource' || selections === 'achieveTargetSource')? this.onRefSelect(selectedItem, stateAndHelpers):this.onSelect(selectedItem, stateAndHelpers)}}
      />
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

// export default withStyles(styles, { withTheme: true })(IntegrationAutosuggest);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const IntegrationAutosuggestStyled = withStyles(styles)(IntegrationAutosuggest);

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationAutosuggestStyled)
