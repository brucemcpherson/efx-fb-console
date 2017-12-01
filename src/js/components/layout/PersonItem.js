import React from "react";
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import cs from '../../constants/params';
import {connect} from 'react-redux';
import {acSignout,acSignin} from '../../actions/index';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Spinner from 'react-spinner-material';

// this is  smart component, which needs access to the current auth status and info
@connect(store => {
  return {
    auth:store.auth
  };
})

// this will probably render top right
// if logged in there'll be a chip
// closing the chip is logging out
// if not logged in there'll be a sign in button
// if in the process of logging there'll be nothing (dont want the sign in to flash unecessarily)
class PersonItem extends React.Component {

  signin() {
    this.props.dispatch (acSignin());
  } 
  
  signout() {
    this.props.dispatch (acSignout());
  }


  
  render() {
    let item;
    const props = this.props;
    
    if ( props.auth.status === cs.status.AUTH_LOGGED_IN ) {
      item = <span>
        <Chip onRequestDelete={this.signout.bind(this)}>
          <Avatar src={props.auth.photoURL}/>
          {props.auth.displayName}
        </Chip>
      </span>;
    }
    else if (props.auth.status === cs.status.AUTH_AWAITING_RESPONSE || props.auth.status === cs.status.AUTH_AWAITING_USER) {
      item = <span>
        <Spinner
          size={30}
          spinnerColor={"#ffffff"}
          spinnerWidth={2}
          visible={true} />
      </span>;
    }
    else {
     
      item = <span><FlatButton style={{color:"white"}} onClick={this.signin.bind(this)} label="Sign in" /></span>;
    }

    return (
      <span style={{display:"table",height:64}}>
        <span style={{display:"table-cell",verticalAlign:'middle'}}>{item}</span>
      </span>
    );

  }
}
export default PersonItem;
