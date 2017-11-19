import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
export default class extends React.Component {


  render() {
    const props = this.props;
    const cardActions = (props.actions || []).map((d,i) => {
      return (<FlatButton 
        label={d.name || d} 
        key={i} 
        onClick={d.action}
        primary={d.primary ? true:false}
        secondary={d.secondary ? true:false}
        disabled={d.disabled ? true:false}
      />);
    });
    
    return  (
      <span>
        <Dialog
          title={props.title}
          actions={cardActions}
          modal={false}
          open={props.open}
          onRequestClose={props.close}
        >
          {props.content}
        </Dialog>
      </span>
    ) ;
  }
}