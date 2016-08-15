'use strict';

requirejs(["static/script/electrophoresis"], function () {
	var styles = {
		padding: 30,
		marker_width: 40,
		column_padding: 20
	};
	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(React.createElement(Electrophoresis, styles), mountingPoint);
});