import React from "react";
import CopyToClipboard from 'react-copy-to-clipboard';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {indigo500} from 'material-ui/styles/colors';
export default class  extends React.Component {
  
  render() {
    // what to display
    const content = this.props.content;
    const noContent = content || this.props.noContent || "";

    return  content ? 
      <span>
        <span style={{color:indigo500}}>{content}</span>
        <CopyToClipboard text={content}>
          <IconButton tooltip="copy" onClick={(e) => { e.preventDefault(); e.stopPropagation();}}><FontIcon className="material-icons">content_copy</FontIcon></IconButton>
        </CopyToClipboard>
      </span> : 
      <span>{noContent}</span>;
    
  }
}
