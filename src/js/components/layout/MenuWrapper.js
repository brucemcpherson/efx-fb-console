import React from 'react';
import AppNav from './AppNav';
import {
  connect
}
from 'react-redux';

// Wrapping this around every page takes care of 
// adding the appnav and the left drawer
// it also handles passing through the state of leftdrawer
// and selected item from the redux store
// and the sidebar
@connect(store => {
  return {
    menu: store.menu
  };
})

export default class extends React.Component {


  render() {

    // adjust for left drawer and top, with a standard padding
    // for non fixed elements.
    const pad = 16;
    const appbarHeight = 64;
    const drawerWidth = 255;
    
    // this will be padding (or fixed positions) depending on whethere drawer is open
    const left = this.props.menu.drawerOpen ? drawerWidth : 0;
    const top = appbarHeight;
    
    const width = this.props.menu.drawerOpen ? 
      'calc(100% - ' +  (drawerWidth+2*pad) + 'px)' : 
      'calc(100% - ' +  (2*pad) + 'px)';
    const contentWidth = this.props.menu.drawerOpen ? 
      'calc(100% - ' +  drawerWidth + 'px)' :
      '100%';
      
    // each child will be enclosed in this style

    const contentStyle = {
      width: width,
      marginTop: top + pad,
      marginLeft: left + pad,
      marginBottom: pad,
      marginRight: pad,
      padding:0
    };

    if (this.props.fixed) {
      // need to do special things to add props needed by fixed content
      return (
        <div>
          <AppNav />
          {React.cloneElement(this.props.children, { 
            contentLeft:left,
            contentWidth:contentWidth,
            contentTop:top
          })}
        </div>
      );
    }
    else {
      return (
        <div style={contentStyle}>
        <AppNav />
        {this.props.children}
      </div>
      );
    }
  }
}
