"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XYAxis = function (_React$Component) {
	_inherits(XYAxis, _React$Component);

	function XYAxis() {
		_classCallCheck(this, XYAxis);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(XYAxis).apply(this, arguments));
	}

	_createClass(XYAxis, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				"XYAxis"
			);
		}
	}]);

	return XYAxis;
}(React.Component);

var Markers = function (_React$Component2) {
	_inherits(Markers, _React$Component2);

	function Markers() {
		_classCallCheck(this, Markers);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Markers).apply(this, arguments));
	}

	_createClass(Markers, [{
		key: "renderMarker",
		value: function renderMarker(props) {
			return function (coords, index) {
				console.log(props.yScale(coords[1]));
				return React.createElement("rect", { width: "10", height: "3", x: props.xScale(coords[0]), y: props.yScale(coords[1]), key: index });
			};
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"g",
				null,
				this.props.markers.map(this.renderMarker(this.props))
			);
		}
	}]);

	return Markers;
}(React.Component);

var Electrophoresis = function (_React$Component3) {
	_inherits(Electrophoresis, _React$Component3);

	function Electrophoresis(props) {
		_classCallCheck(this, Electrophoresis);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Electrophoresis).call(this, props));

		_this3.state = { markers: [[0, 0], [1, 0], [2, 0], [0, 5], [1, 1], [1, 4], [2, 3]] };
		return _this3;
	}

	_createClass(Electrophoresis, [{
		key: "render",
		value: function render() {
			var xScale = d3.scaleLinear().domain([0, d3.max(this.state.markers, function (d) {
				return d[0];
			})]).range([10, this.props.width - 10]);
			var yScale = d3.scaleLinear().domain([0, d3.max(this.state.markers, function (d) {
				return d[1];
			})]).range([10, this.props.height - 10]);
			var scales = { xScale: xScale, yScale: yScale };
			return React.createElement(
				"div",
				null,
				React.createElement(
					"svg",
					{ width: this.props.width, height: this.props.height },
					React.createElement(XYAxis, _extends({}, this.state, scales)),
					React.createElement(Markers, _extends({}, this.state, scales))
				)
			);
		}
	}]);

	return Electrophoresis;
}(React.Component);