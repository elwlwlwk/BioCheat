'use strict';

requirejs(["static/script/electrophoresis"], function () {
	var styles = {
		padding: 40,
		marker_width: 40,
		column_padding: 40
	};
	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(React.createElement(Electrophoresis, styles), mountingPoint);
});