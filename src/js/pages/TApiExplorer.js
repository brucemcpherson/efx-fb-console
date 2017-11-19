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
            content={<span><p>The rest of this tutorial takes the form of interactive examples.
            Calls will be made live to the API, and you will see the structure of the request, along 
            with the response.</p>
            <p>Keys needed to make calls will be automatically generated, but they will have a short lifetime
            and will expire. Note that the tutorial activity is not taking place in your account, but in
            a special one belonging to the API.
            </p>
            </span>
            } 
            subtitle={"The API explorer"}
            initiallyExpanded={true}
        /> 
      </MenuWrapper>
    );
  }
}
