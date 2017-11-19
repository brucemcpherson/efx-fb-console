import React from "react";
import TASharedReadItem from '../components/layout/TASharedReadItem';
import TAWrap from '../components/layout/TAWrap';


  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TASharedReadItem

          title={"A data item can be read using the key that wrote it, or by an authorized reader"} 
          subtitle = {
            `some items will have been created automatically along with any keys needed for
            the demonstration`
          }
          intro = {
            `You can pick which item to read from the list below which will also show the shared items you have 
            created during the tutorial. You can also select from the keys that have been authorized to read the item you select.`
          }
        />
      </TAWrap>
    );
  }
}
