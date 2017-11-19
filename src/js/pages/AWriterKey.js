import React from "react";
import TAGenericKey from '../components/layout/TAGenericKey';
import TAWrap from '../components/layout/TAWrap';

  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAGenericKey
          keyType = {"writer"}
          title={"Writer Keys"} 
          subtitle = {
            `A writer key is needed to write data items to the store. Multiple writer keys can be owned by one boss key`
          }
          intro = {
            `A writer key has already been generated for use during the tutorial. You can create some more here and they will become
            available for use in other lessons. Multiple data items can be written with a writer key.`
          }
        />
      </TAWrap>
    );
  }
}

      