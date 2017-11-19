import React from "react";
import TAGenericKey from '../components/layout/TAGenericKey';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAGenericKey
          keyType = {"reader"}
          title={"Reader Keys"} 
          subtitle = {
            `A reader key is needed to read data items from the store`
          }
          intro = {
            `A reader key has already been generated for use during the tutorial. You can create some more here and they will become
            available for use in other lessons. Multiple data items can be read with a single reader key, but only if they
            have explicitly been 
            given permission when the data item was created. A writer key can always read items it has created.`
          }
        />
      </TAWrap>
    );
  }
}

      