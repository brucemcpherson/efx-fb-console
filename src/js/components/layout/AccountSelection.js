import React from "react";

import {
  acAccountsSelectedRows,
  acFetchBosses,
  dispatchStats 
}
from '../../actions/index';
import XSelect from '../XSelect';


export default class extends React.Component {


  /**
   * called to handle account change
   * This value tracks on the console page too
   * so this is a dispatch process that's shared
   */
  handleAccountChange = (value) => {
    
    // the new account
    const ad = acAccountsSelectedRows  ( {
      selectedItems:[value], 
      pageResults:"accounts"
    });
    
    if (ad) {
      this.props.dispatch(ad);
    }
    
    // and its boss keys
    const ab = acFetchBosses({
      pageResults:"bosses",
      accountId:value
    });
    
    if (ab) {
      this.props.dispatch(ab);
    }
    // need a fetch stats here...
    dispatchStats (value, this.props.stats.ranges.start, this.props.stats.ranges.finish);
    
    // in case someone wants to know
    if (this.props.onChange) this.props.onChange (value);
    
  }

  
  
  render() {
    
    const props = this.props;

    // we'll use the selected account later
    const place = props.accounts.pageResults.accounts;
    const selectedAccount = place.selectedItems ? place.selectedItems[0] : "";

    const itemStyle = {
      display:'inline-block',
      marginRight:8
    };
    const dropperJsx = <XSelect 
      options={Object.keys(place.data || {})}
      value={selectedAccount}
      onChange={this.handleAccountChange}
      label={props.label}
      style={itemStyle}
    /> ;
    
    
      
    // now render  .. 
    return  ( 
      <span>
        {dropperJsx}
    </span>);
  }
}