// every tutorial page will be wrapped in this
// it will send through the redux info
// sort out the routing
// wrap the content in nav bar and take care of the drawer status

import React from "react";

import Process from '../../containers/process';
import { acMenuSelectedValue }  from '../../actions/index';  
import { atMakeEverything }  from '../../actions/tutorial'; 
import { connect} from 'react-redux';
import TAWaitingForKeys from './TAWaitingForKeys';
import MenuWrapper from './MenuWrapper';
import TAService from './TAService';
import TAEverything from './TAEverything';

@connect(store => {
  return {
    tutorial: store.tutorial
  };
})

export default class  extends React.Component {

  /**
   * when component mounts, kick off a request to get some keys
   * nothing will happen if we already have them
   * also sorts out where we are in routing 
   */
  componentDidMount(){
    this.props.dispatch (acMenuSelectedValue(Process.xRef[this.props.location.pathname]));
    if (!this.props.skipKeys) {
      const ab = atMakeEverything();
      if (ab) {
        this.props.dispatch (ab);
      }
    }
  } 


  /**
   * rendering will only start if we have initial keys to play with
   * otherwise we show something else
   */
  render() {

    // using data- tags to clone props - like this, any regular html elements
    // will not complain if they receive a tag they dont like
    const xcs = this.props.tutorial.everything.ready || this.props.skipKeys ? 
      <span>
          {
            React.cloneElement(this.props.children, { 
              dispatch:this.props.dispatch,
              tutorial:this.props.tutorial
            })
          }
      </span> : <TAWaitingForKeys everything={this.props.tutorial.everything}/>;
    return (
      <MenuWrapper>
      <TAService tutorial = {this.props.tutorial} dispatch = {this.props.dispatch} />
      <TAEverything tutorial = {this.props.tutorial} dispatch = {this.props.dispatch} />
        {xcs}
      </MenuWrapper>
    );
  
  }
}
 