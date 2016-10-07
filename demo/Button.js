const React = require('react');


module.exports = class Button extends React.PureComponent {

	render(){
		const {color, text} = this.props;
		return <button style={{background: color}}>{text}</button>;
	}
}