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
					{ x: props.xScale(coords[0]), y: "15", dy: "0.35em", key: index },
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

		_this3.state = {
			markers: [[0, 0]],
			marker_label: [[0, "test"]],
			width: props.padding * 2 + props.marker_width,
			height: 300
		};
		return _this3;
	}

	_createClass(Electrophoresis, [{
		key: "add_column",
		value: function add_column() {
			var _this4 = this;

			if (this.state.markers.length == 1) {
				this.setState({
					markers: [[d3.max(this.state.markers, function (d) {
						return d[0];
					}), 0]].concat(this.state.marker_input.split(/[\s,]+/).map(function (pos) {
						return [d3.max(_this4.state.markers, function (d) {
							return d[0];
						}), parseFloat(pos)];
					})),
					width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(this.state.markers, function (d) {
						return d[0];
					}) + 2) - this.props.column_padding
				});
			} else {
				this.setState({
					markers: this.state.markers.concat([[d3.max(this.state.markers, function (d) {
						return d[0];
					}) + 1, 0]]).concat(this.state.marker_input.split(/[\s,]+/).map(function (pos) {
						return [d3.max(_this4.state.markers, function (d) {
							return d[0];
						}) + 1, parseFloat(pos)];
					})),
					width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(this.state.markers, function (d) {
						return d[0];
					}) + 2) - this.props.column_padding
				});
			}
		}
	}, {
		key: "marker_input_change",
		value: function marker_input_change(e) {
			this.setState({
				marker_input: e.target.value
			});
		}
	}, {
		key: "render_position_change",
		value: function render_position_change(e) {
			console.log(e.target.checked);
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

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
					React.createElement("input", { onChange: function onChange(e) {
							return _this5.marker_input_change(e);
						}, type: "text", placeholder: "1.1 4.2 6.4" }),
					React.createElement(
						"button",
						{ onClick: function onClick() {
								return _this5.add_column();
							} },
						"Add Column"
					),
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this5.show_position_change(e);
						} }),
					"render position"
				)
			);
		}
	}]);

	return Electrophoresis;
}(React.Component);