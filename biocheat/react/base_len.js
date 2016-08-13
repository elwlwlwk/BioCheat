requirejs(["static/script/electrophoresis"], function(){
	const mountingPoint= document.createElement('div');
	mountingPoint.className= 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(<Electrophoresis/>, mountingPoint);
});
