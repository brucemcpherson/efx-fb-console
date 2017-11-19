import React from "react";
import TASharedUpdateItem from '../components/layout/TASharedUpdateItem';
import TAWrap from '../components/layout/TAWrap';


  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TASharedUpdateItem

          title={"A data item can be updated using the key that wrote it, or by an authorized updater"} 
          subtitle = {
            `some items will have been created automatically along with any keys needed for
            the demonstration`
          }
          intro = {
            `You can pick which item to update from the list below which will also show the shared items you have 
            created during the tutorial. You can also select from the keys that have been authorized to update the item you select.`
          }
        />
      </TAWrap>
    );
  }
}
