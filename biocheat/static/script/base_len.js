'use strict';

var mountingPoint = document.createElement('div');
mountingPoint.className = 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(React.createElement(Chart, null), mountingPoint);