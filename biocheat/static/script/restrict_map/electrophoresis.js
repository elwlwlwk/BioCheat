"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ElectroXYAxis = function (_React$Component) {
	_inherits(ElectroXYAxis, _React$Component);

	function ElectroXYAxis() {
		_classCallCheck(this, ElectroXYAxis);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ElectroXYAxis).apply(this, arguments));
	}

	_createClass(ElectroXYAxis, [{
		key: "renderElectroAxis",
		value: function renderElectroAxis(props) {
			return function (coords, index) {
				var col_num = d3.max(props.markers, function (d) {
					return d[0];
				}) + 1;
				return React.createElement(
					"text",
					{ x: props.xScale(coords[0]), y: "15", dy: "0.35em", fontSize: "10px", key: index },
					coords[1]
				);
			};
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"g",
				null,
				this.props.marker_label.map(this.renderElectroAxis(this.props))
			);
		}
	}]);

	return ElectroXYAxis;
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
				var col_num = d3.max(props.markers, function (d) {
					return d[0];
				}) + 1;
				return React.createElement("rect", { width: props.marker_width, height: "3", x: props.xScale(coords[0]), y: props.yScale(coords[1]), key: index });
			};
		}
	}, {
		key: "renderDistance",
		value: function renderDistance(props) {
			if (props.render_dis) {
				return function (coords, index) {
					return React.createElement(
						"text",
						{ x: props.xScale(coords[0]) + props.marker_width + 3, y: props.yScale(coords[1]), dy: "0.35em", fontSize: "10px", key: index },
						coords[1]
					);
				};
			} else {
				return function (coords, index) {
					return null;
				};
			}
		}
	}, {
		key: "renderLength",
		value: function renderLength(props) {
			if (props.render_length) {
				return function (coords, index) {
					return React.createElement(
						"text",
						{ x: props.xScale(coords[0]) + props.marker_width + 3, y: props.yScale(coords[1]), dy: "0.35em", fontSize: "10px", key: index },
						Math.round(coords[2])
					);
				};
			} else {
				return function (coords, index) {
					return null;
				};
			}
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"g",
				null,
				this.props.markers.map(this.renderMarker(this.props)),
				this.props.markers.map(this.renderDistance(this.props)),
				this.props.markers.map(this.renderLength(this.props))
			);
		}
	}]);

	return Markers;
}(React.Component);

var Electrophoresis = function (_React$Component3) {
	_inherits(Electrophoresis, _React$Component3);

	function Electrophoresis() {
		_classCallCheck(this, Electrophoresis);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Electrophoresis).apply(this, arguments));
	}

	_createClass(Electrophoresis, [{
		key: "render",
		value: function render() {
			var xScale = d3.scaleLinear().domain([0, d3.max(this.props.markers, function (d) {
				return d[0];
			})]).range([this.props.padding, this.props.width - this.props.padding - this.props.marker_width]);
			var yScale = d3.scaleLinear().domain([0, d3.max(this.props.markers, function (d) {
				return d[1];
			})]).range([this.props.padding, this.props.height - this.props.padding]);
			var scales = { xScale: xScale, yScale: yScale };
			return React.createElement(
				"div",
				null,
				React.createElement(
					"svg",
					{ width: this.props.width, height: this.props.height },
					React.createElement(ElectroXYAxis, _extends({}, this.state, scales, this.props)),
					React.createElement(Markers, _extends({}, this.state, scales, this.props))
				)
			);
		}
	}]);

	return Electrophoresis;
}(React.Component);