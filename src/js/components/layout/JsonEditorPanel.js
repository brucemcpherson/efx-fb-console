import React from "react";
import CodeMirror from 'react-codemirror';


require('react-codemirror/node_modules/codemirror/lib/codemirror.css');
require('react-codemirror/node_modules/codemirror/addon/lint/lint.css');
require ('react-codemirror/node_modules/codemirror/addon/lint/lint');
require ('react-codemirror/node_modules/codemirror/mode/javascript/javascript');
require ('react-codemirror/node_modules/codemirror/addon/lint/json-lint');
require ('react-codemirror/node_modules/codemirror/addon/fold/brace-fold');

export default class  extends React.Component {
  
  constructor (props) {
    super (props);

    this.state = {
      ready:false
    };
  }  

  /// waiting for 0.4 - that might fix this problem and make this work properly
  componentDidMount = () => {
    // if lint is set to true before component mounts, it fails, so wait till it mounts before setting the option
    this.setState ({
      ready:true
    });
  }

  render() {

    // shortcuts
    const props = this.props;

    // TODO Can't get code folding to work in the react mode for now
    // will revisit in a later version - leaving these options as a reminder
    
    // set up codemirror to edit and lint JSON
		const cmOptions = {
		  gutters: ['CodeMirror-lint-markers',"CodeMirror-foldgutter","CodeMirror-linenumbers"],
			lineNumbers: true,
			lineWrapping: true,
			tabSize:2,
			foldGutter: true,
			mode:"application/json",
			extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
			lint:props.editorCode.length ? true : false                 // dont lint if code is empty
		};
		

    // careful not to render until component is mounted else it will fail
    const xcs = this.state.ready ?    
      <CodeMirror 
        ref="editor" 
        value={props.editorCode} 
        onChange={props.updateCode} 
        options={cmOptions} 
      /> : "";

    return <span>{xcs}</span>;

  }
}
 