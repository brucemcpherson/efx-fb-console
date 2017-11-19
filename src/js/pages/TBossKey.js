import React from "react";
import Article from "../components/Article";

import Process from '../containers/process';
import { acMenuSelectedValue }  from '../actions/index';  
import MenuWrapper from '../components/layout/MenuWrapper';

export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected
  // or if a direct link is used.
  componentDidMount(){
    Process.store.dispatch (acMenuSelectedValue(Process.xRef[this.props.location.pathname]));
  } 
  render() {
    return (
      <MenuWrapper>

        <Article 
            title={"Getting started"}
            content={<span><p>Boss keys are a kind of master key that enables you to create other keys. You cannot 
            access data items with a boss key, but you use it to create keys that can.</p>
            <h4>Accounts</h4>
            <p>A boss key is specific to an account, and it knows which account it belongs to.You can create
            multiple boss keys per acccount at the console. When you create 
            the boss key you can specify how long you want it to be valid for. Keys created with 
            a particular boss key all expire at the same time as the boss key that created them.</p>
            <h4>Delete a boss key</h4>
            <p>You can delete a boss key at the console, and it will no longer be able to make new keys. However
            any keys created by that boss key will continue to work until they expire</p>
            <h4>Sharing a boss key</h4>
            <p>Generally speaking boss keys should not be shared. If you want a collaborator to read, write or update a 
            data item in your store, you should generate an appropriate key and share that with him. The only role 
            of the boss key is to generate other access keys.
            </p>
            
            </span>
            } 
            subtitle={"Boss keys"}
        /> 
      </MenuWrapper>
    );
  }
}
