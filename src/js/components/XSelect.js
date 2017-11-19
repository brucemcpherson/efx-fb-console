import React from "react";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * props.onChange
 * props.options
 * props.value
 * props.label
 */
export default class XSelect extends React.Component {
    

    render() {
        let options = this.props.options.map((t,i) => {
            return(
                <MenuItem value={t} primaryText={t} key={i}/>
            );
        });

        return(
            <span>
            <SelectField 
                style = {{verticalAlign:"bottom"}}
                floatingLabelText = {this.props.label}
                value={this.props.value} 
                onChange={(event,index,value) => this.props.onChange(value)}>
                {options}
            </SelectField>
            </span>
        );
    }
}
