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
		key: "renderAxis",
		value: function renderAxis(props) {
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
				this.props.marker_label.map(this.renderAxis(this.props))
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
				var col_num = d3.max(props.markers, function (d) {
					return d[0];
				}) + 1;
				return React.createElement("rect", { width: props.marker_width, height: "3", x: props.xScale(coords[0]), y: props.yScale(coords[1]), key: index });
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

		var default_marker_input = "ladder: 1.1 2.4 5.5 6.7\nA: 1.3 2.5 5.5 8.8";
		var default_parsed_result = _this3.parse_marker_input(default_marker_input);
		_this3.state = {
			markers: default_parsed_result.markers,
			marker_label: default_parsed_result.marker_label,
			marker_input: default_marker_input,
			width: _this3.props.padding * 2 + (_this3.props.marker_width + _this3.props.column_padding) * (d3.max(default_parsed_result.markers, function (d) {
				return d[0];
			}) + 1) - _this3.props.column_padding,
			height: 300
		};
		return _this3;
	}

	_createClass(Electrophoresis, [{
		key: "parse_marker_input",
		value: function parse_marker_input(input) {
			var columns = input.trim().split("\n").map(function (i) {
				return i.trim();
			});
			var markers = [];
			var marker_label = [];
			columns.forEach(function (column, idx) {
				var label = column.split(":")[0];
				var elements = column.split(":")[1].split(/[\s,]+/);
				marker_label.push([idx, label]);
				elements.forEach(function (marker) {
					markers.push([idx, isNaN(parseFloat(marker)) ? 0 : parseFloat(marker)]);
				});
				markers.push([idx, 0]);
			});
			return { markers: markers, marker_label: marker_label };
		}
	}, {
		key: "marker_input_changed",
		value: function marker_input_changed(e) {
			var input = e.target.value;
			var result = this.parse_marker_input(input);
			this.setState({
				markers: result.markers,
				marker_label: result.marker_label,
				width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(result.markers, function (d) {
					return d[0];
				}) + 1) - this.props.column_padding,
				marker_input: input
			});
		}
	}, {
		key: "render_position_changed",
		value: function render_position_changed(e) {
			console.log(e.target.checked);
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var xScale = d3.scaleLinear().domain([0, d3.max(this.state.markers, function (d) {
				return d[0];
			})]).range([this.props.padding, this.state.width - this.props.padding - this.props.marker_width]);
			var yScale = d3.scaleLinear().domain([0, d3.max(this.state.markers, function (d) {
				return d[1];
			})]).range([this.props.padding, this.state.height - this.props.padding]);
			var scales = { xScale: xScale, yScale: yScale };
			return React.createElement(
				"div",
				null,
				React.createElement(
					"svg",
					{ width: this.state.width, height: this.state.height },
					React.createElement(XYAxis, _extends({}, this.state, scales, this.props)),
					React.createElement(Markers, _extends({}, this.state, scales, this.props))
				),
				React.createElement(
					"div",
					null,
					React.createElement("textarea", { onChange: function onChange(e) {
							return _this4.marker_input_changed(e);
						}, defaultValue: this.state.marker_input, cols: "50", rows: "5" }),
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this4.render_position_changed(e);
						} }),
					"render position"
				)
			);
		}
	}]);

	return Electrophoresis;
}(React.Component);