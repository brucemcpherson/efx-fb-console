import React from 'react';
import Drawer from 'material-ui/Drawer';
import SelectList from './SelectList';
import Process from '../../containers/process';

export default class extends React.Component {


  handleListRequestChange (value) {
    this.props.handleListRequestChange (value);
  }
  

  render() {
    const {props} = this;
    return (
      <div>
        <Drawer 
          open={props.menu.drawerOpen}
          docked={true}
          containerStyle={{height: 'calc(100% - 64px)', top: 64}}
        > 

          <SelectList 
            xRoutes={Process.xRoutes} 
            selectedValue={props.menu.selectedValue} 
            requestChange={this.handleListRequestChange.bind(this)}
          />
        </Drawer>
      </div>
    );
  }
}





