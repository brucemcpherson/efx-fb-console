import React from "react";
import TAValidateKey from '../components/layout/TAValidateKey';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAValidateKey
          keyType = {"validate"}
          title={"validate Keys"} 
          subtitle = {
            `Any kind of key can be validated by the API`
          }
          intro = {
            `You can get information key validity, type and expiration date by requesting a key validation. All the 
            keys generated in this tutorial session are available for selection below.`
          }
        />
      </TAWrap>
    );
  }
}

      