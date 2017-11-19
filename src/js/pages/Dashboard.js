import React from "react";
import DashBody from '../components/layout/DashBody';
import AAWrap from '../components/layout/AAWrap';

export default class Console extends React.Component {
  render() {

    return ( 
      <AAWrap location={this.props.location} propagate={["stats","dispatch","accounts","auth"]}>
        <DashBody />
      </AAWrap> 
    );
  }
}

