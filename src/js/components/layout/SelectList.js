import React from 'react';
import Process from '../../containers/process';
import {List,  makeSelectable} from 'material-ui/List';
import {acDrawerOpen} from '../../actions/index';

let SelectableList = makeSelectable(List);

export default class SelectList extends React.Component {


    handleRequestChange (event, index) {
        this.props.requestChange(index);
    }
    
    componentDidMount () {
      // if we're on the main page, close the drawer by default
      if (this.props.selectedValue === 1 || !this.props.selectedValue) {
        Process.store.dispatch (acDrawerOpen(false));
      }
    }
    render() {

        return (<div>{this.renderAside()}</div>);
    }

    renderAside() {
        return (
          <SelectableList 
            value={this.props.selectedValue} 
            onChange={(event,target)=>this.handleRequestChange(event,target)} 
          >
            {this.props.xRoutes}
          </SelectableList>
        );
    }
}


