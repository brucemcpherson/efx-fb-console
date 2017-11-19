import React from "react";
import TAInfo from '../components/layout/TAInfo';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAInfo
          keyType = {"info"}
          title={"Service info"} 
          subtitle = {
            `Getting info about the API`
          }
          intro = {
            `You can see version info here`
          }
        />
      </TAWrap>
    );
  }
}

      