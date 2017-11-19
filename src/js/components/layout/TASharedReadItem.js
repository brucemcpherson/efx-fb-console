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
        touchCollections:["readers","updaters","writer","key"],
        // the type of items that can be used for this page
        keyTypes:["shared","sharedUpdate","aliasshared","aliassharedUpdate","alias","aliasitem"],
        // the selected item key to use
        keyValue:"",
        // a list of keys that have been derived as able to touch the item
        touchers:[],
        // generalize some of the verbiage
        verb:"read",
        // where to put the results of the the update
        pageResults:"sharedRead",
        // a list of item objects that are able to be selected from
        items:[],
        requestUrl:`/reader/:key/:itemid`,
        dispatchAction:atReadItem 
      },
      itemTitle:"Shared data items",
      itemSubtitle:"a shared data item"
      
    };
    return <TACommonReadItem {...props} />;
  }
}
 