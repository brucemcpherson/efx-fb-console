import React from "react";
import Handy from '../../utils/handy';
import XSelect from '../XSelect';

export default class extends React.Component {

  
  render() {
    
    const props = this.props;

    // we'll use the selected account later
    const data = props.data;
    const accountId = props.accountId || "";
    const dataKeys = Handy.sortKeys (data, true);
    if (!dataKeys.length) return <span></span>;

    
    const itemStyle = {
      display:'inline-block',
      marginRight:8
    };
    const dropperJsx = <XSelect 
      options={dataKeys}
      value={accountId}
      onChange={props.handleAccountSelection}
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