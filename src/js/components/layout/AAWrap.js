// every tutorial page will be wrapped in this
// it will send through the redux info
// sort out the routing
// wrap the content in nav bar and take care of the drawer status

import React from "react";

import Process from '../../containers/process';
import { acMenuSelectedValue }  from '../../actions/index';  
import { connect} from 'react-redux';
import MenuWrapper from './MenuWrapper';
import TAService from './TAService';

@connect(store => {
  return {
    accounts: store.accounts,
    auth:store.auth,
    stats:store.stats,
    tutorial:store.tutorial
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

  } 


  /**
   * rendering will only start if we have initial keys to play with
   * otherwise we show something else
   */
  render() {

    // no need to propagate everything to everything
    const propOb = (this.props.propagate || ["dispatch","accounts","auth"])
    .reduce ((p,c) => {
      p[c] = this.props[c];
      return p;
    },{});
    
    // using data- tags to clone props - like this, any regular html elements
    // will not complain if they receive a tag they dont like
    const xcs = 
      <span>
          { React.cloneElement(this.props.children, propOb) }
      </span> ;
    return (
      <MenuWrapper>
        <TAService tutorial = {this.props.tutorial} dispatch = {this.props.dispatch} />
        {xcs}
      </MenuWrapper>
    );
  
  }
}
 