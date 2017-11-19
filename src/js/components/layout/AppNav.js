
import React from 'react';
import AppBar from 'material-ui/AppBar';
import LeftDrawer from './LeftDrawer';
import PersonItem from './PersonItem';
import { acDrawerOpen }  from '../../actions/index'; 
import { acMenuSelectedValue }  from '../../actions/index'; 
import { connect } from 'react-redux';


@connect(store => {
  return {
    menu: store.menu
  };
})

export default class  extends React.Component {


  // this is called from the left drawer to handle a list selection change
  handleListRequestChange (value) {
    this.props.dispatch (acMenuSelectedValue(value));
  }
  
  // toggle the drawer
  handleToggle = () => {
    this.props.dispatch (acDrawerOpen (!this.props.menu.drawerOpen));
  };

  // close the drawer .. its a drawer that goes away on menu selection.
  handleClose = () => this.props.dispatch (acDrawerOpen (false));
  
  // handling a reuqest change TODO .. do i need this any more?
  handleRequestChange = (open) => this.props.dispatch (acDrawerOpen (true));

  
  render() {

    return (
      <AppBar 
        onLeftIconButtonTouchTap = {this.handleToggle}
        title={"Ephemeral Exchange Store"}
        style={{position:'fixed',left:0,top:0}}
      >
        
        <PersonItem />
        
        <LeftDrawer 
          menu={this.props.menu}
          handleRequestChange = {this.handleRequestChange.bind(this)} 
          handleClose = {this.handleClose.bind(this)}
          handleListRequestChange = {this.handleListRequestChange.bind(this)}
        />
        
      </AppBar>
    );
  }
}





