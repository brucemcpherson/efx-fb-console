import React from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardText,
  CardTitle
}
from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class XCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.initiallyExpanded 
    };
  }
  
  componentWillReceiveProps (nextProps) {
    if (nextProps.expanded !== this.props.expanded) {
      this.setState({expanded:nextProps.expanded});
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };
  
  render() {

    const props = this.props;
    const cardActions = (props.cardActions || []).map((d,i) => {
      return (<RaisedButton 
        label={d.name || d} 
        key={i} 
        onClick={d.action}
        primary={d.primary ? true:false}
        secondary={d.secondary ? true:false}
        disabled={d.disabled ? true:false}
      />);
    });
    
    return (
      <Card 
        expanded={this.state.expanded}
        onExpandChange={this.handleExpandChange}
        style = {{fontFamily:"Noto Sans"}}
      >
        
        <CardHeader
            title={props.title}
            subtitle={props.subtitle}
            actAsExpander={true}
            showExpandableButton={true}
        />

        <CardText expandable={true}>
          {this.props.content}
        </CardText>
    
        <CardActions expandable={true}>
          {cardActions}
        </CardActions>
      </Card>
      
    );
  }
}
export default XCard;
