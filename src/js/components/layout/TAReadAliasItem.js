// Tutorial page for shared data updating
// will generate data items and keys as required to demo
// read action will get the selected item, using the selected key
// and display the result in the standard format
import React from "react";
import TACommonReadItem from './TACommonReadItem';
import {  atReadItem }  from '../../actions/tutorial'; 

export default class  extends React.Component {

  render() {
    
    const props = {
      ...this.props,initialState: {
        touchSelected:"",
        // the kind of keys that can be found in the item to use
        touchCollections:["key"],
        // the type of items that can be used for this page
        keyTypes:["alias","aliasitem","aliasshared","aliassharedUpdate"],
        // the selected item key to use
        keyValue:"",
        // a list of keys that have been derived as able to touch the item
        touchers:[],
        // generalize some of the verbiage
        verb:"read",
        // where to put the results of the the update
        pageResults:"readAlias",
        // a list of item objects that are able to be selected from
        items:[],
        requestUrl:`/reader/:key/:alias`,
        dispatchAction:atReadItem 
      },
      itemTitle:"Data items",
      itemSubtitle:"reading by alias"

      
    };

    return <TACommonReadItem {...props} />;
  }
}
 