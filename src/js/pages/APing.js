import React from "react";
import TAPing from '../components/layout/TAPing';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAPing
          keyType = {"ping"}
          title={"Service status"} 
          subtitle = {
            `Checking the API is available`
          }
          intro = {
            `You can see whether the API is running normally by pinging it`
          }
        />
      </TAWrap>
    );
  }
}

      