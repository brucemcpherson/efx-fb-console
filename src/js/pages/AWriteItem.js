import React from "react";
import TAWriteItem from '../components/layout/TAWriteItem';
import TAWrap from '../components/layout/TAWrap';

export default class  extends React.Component {
  
  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TAWriteItem

          title={"A data item in the store is referenced by an item key"} 
          subtitle = {
            `A writer key is needed to create an item and  
            multiple data items can be 'owned' by a single writer key. Some items will have been created automatically along with any keys needed for
            the demonstration`
          }
          intro = {
            `In this example, I'll create a data item  that can only be accessible with 
            the key used to write it`
          }
        />
      </TAWrap>
    );
  }
}

