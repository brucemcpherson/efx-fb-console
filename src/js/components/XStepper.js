import React from "react";

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

import FlatButton from 'material-ui/FlatButton';

export default class XStepper extends React.Component {
  
  state = {
    finished:false,
    stepIndex:0
  };
  
  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= this.props.steps.length,
    });
    
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  
  getStepContent(stepIndex) {
    return this.props.steps[stepIndex].content;
  }
  
  render() {

    const {stepIndex} = this.state;
    const steps = this.props.steps.map(function (d,i) {
      return <Step key={i}><StepLabel>{d.label}</StepLabel></Step>;
    });
    const xcs = <span>
      <Stepper activeStep={stepIndex}>
        {steps}
      </Stepper>
      <div>
      <div style={{marginTop:16,marginRight:16,marginTop:16,marginBottom:32}}>{this.getStepContent(stepIndex)}</div>
      <div>
        <FlatButton
          label="Back"
          disabled={stepIndex === 0}
          onTouchTap={this.handlePrev}
          style={{marginRight: 12}}
        />
        <FlatButton
          label={stepIndex === this.props.steps.length-1 ? 'Finish' : 'Next'}
          primary={true}
          onTouchTap={this.handleNext}
        />
      </div>
      </div>
     </span>;

    return xcs;
  }
}
