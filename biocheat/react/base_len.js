requirejs(["static/script/electrophoresis"], function(){
	var styles={
		padding: 30,
		marker_width: 40,
		column_padding: 20,
	};
	const mountingPoint= document.createElement('div');
	mountingPoint.className= 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(<Electrophoresis {...styles}/>, mountingPoint);
});
