import React from "react";
import TARemoveItem from '../components/layout/TARemoveItem';
import TAWrap from '../components/layout/TAWrap';


  
export default class  extends React.Component {
  
  // This will reselect the current item if the brower back is selected

  render() {

    return ( 
      <TAWrap location={this.props.location}>
        <TARemoveItem

          title={"A data item can be removed using the key that wrote it"} 
          subtitle = {
            `some items will have been created automatically along with any keys needed for
            the demonstration`
          }
          intro = {
            `You can pick which item to remove from the list below which will also show the items 
            you have created during the session. You can only remove these items with the key that created them.
            Note that removing some items will mean that you can't read them in other parts of the tutorial, unless you
            recreate them first using the write items tutorial sections. To recreate
            a completely new set of keys and items, you can simply refresh the site.`
          }
        />
      </TAWrap>
    );
  }
}
