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
            content={<span><p>Your account profile is accessible via the console, where you can also find 
            a dashboard showing API usage.</p>
            <h4>Accounts</h4>
            <p>Accounts can be deleted or added at the console. You can have several accounts associated with 
            your profile.</p>
            <h4>Boss Keys</h4>
            <p>These are used to generate reader, writer and updater keys, and are specific to an account. You can have 
            multiple boss keys for each account.</p>
            <h4>Key Usage</h4>
            <p>The dashboard shows all the activitiy for each of your keys in a given period</p>
            <h4>Store Usage</h4>
            <p>The dashboard shows detailed item activity for a given period</p>
            </span>
            } 
            subtitle={"The console and dashboard"}
            
        /> 
      </MenuWrapper>
    );
  }
}
