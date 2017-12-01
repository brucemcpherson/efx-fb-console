import React from "react";
import ConsoleBody from '../components/layout/ConsoleBody';
import AAWrap from '../components/layout/AAWrap';

export default class Console extends React.Component {
  render() {

    return ( 
      <AAWrap location={this.props.location} propagate={["dispatch","accounts","auth","tutorial","stats"]}>
        <ConsoleBody consolePage={"json"}/>
      </AAWrap> 
    );
  }
}


