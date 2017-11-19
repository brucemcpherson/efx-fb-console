import React from "react";
import Article from "../components/Article";
;
import Process from '../containers/process';
import { acMenuSelectedValue }  from '../actions/index';  

import MenuWrapper from '../components/layout/MenuWrapper';
export default class  extends React.Component {
  
  componentDidMount(){
    Process.store.dispatch (acMenuSelectedValue(Process.xRef[this.props.location.pathname]));
  } 

  render() {
    return (
      <MenuWrapper>

        <Article 
            title={"Getting started"}
            content={<span><p>You can take this tutorial with or without signing in, but before you 
            can create items in the store you need to sign in using your Google credentials.
            You can sign in on the Navigation bar.</p>
            <p>There is no need for any additional registration as no additional personal
            information is required to use the free service.</p>
            </span>
            } 
            subtitle={"Registering"}
            initiallyExpanded={true}
        /> 
      </MenuWrapper>
    );
  }
}
