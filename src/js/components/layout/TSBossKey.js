import React from "react";
import TextField from 'material-ui/TextField';
import { getTutorialKeys } from "../../actions/tutorial";

export default class  extends React.Component {

  render() {

    const boss = getTutorialKeys (this.props, "boss")[0];
   
    return <TextField
            floatingLabelText={`Your boss key`}
            value = {boss || ""}
            disabled = {true}
          />;
  }
}
 