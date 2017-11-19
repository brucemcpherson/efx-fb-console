import React from "react";
import TAGenericKey from '../components/layout/TAGenericKey';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAGenericKey
          keyType = {"updater"}
          title={"Updater Keys"} 
          subtitle = {
            `An updater key is needed to update, or read data items in the store`
          }
          intro = {
            `An updater key has already been generated for use during the tutorial. You can create some more here and they will become
            available for use in other lessons. Multiple data items can be updated with a single updater key, but only if they
            have explicitly been 
            given permission when the data item was created. A writer key always has permission to update items it owns.`
          }
        />
      </TAWrap>
    );
  }
}

      