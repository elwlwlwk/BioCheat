'use strict';

requirejs(["static/script/electrophoresis"], function () {
	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(React.createElement(Electrophoresis, { width: '300', height: '300' }), mountingPoint);
});