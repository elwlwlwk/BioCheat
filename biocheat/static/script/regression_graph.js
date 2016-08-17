"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RegressionGraph = function (_React$Component) {
	_inherits(RegressionGraph, _React$Component);

	function RegressionGraph() {
		_classCallCheck(this, RegressionGraph);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RegressionGraph).apply(this, arguments));
	}

	_createClass(RegressionGraph, [{
		key: "gen_path",
		value: function gen_path(method, result, xScale, yScale) {
			var equation = result.regression_result.equation;
			switch (method) {
				case "power":
					var M = "M" + xScale(0) + "," + yScale(equation[0] * Math.pow(d3.max(result.regression_result.points, function (d) {
						return d[0];
					}) / 100, equation[1]));
					var L = "";
					for (var i = 1; i < 50; i++) {
						var x = d3.max(result.regression_result.points, function (d) {
							return d[0];
						}) / 50 * i;
						var y = equation[0] * Math.pow(x, equation[1]);
						L += "L" + xScale(x) + "," + yScale(y);
					}
					return M + L;
				case "logarithmic":
					return "";
				case "linear":
					return "";
			}
		}
	}, {
		key: "power_graph",
		value: function power_graph() {
			var known_points = this.props.orig_input.markers.filter(function (m) {
				return m[2];
			}).map(function (m) {
				return [m[1], m[2]];
			});
			var regressed_points = this.props.regression_result.points.map(function (m) {
				return [m[1], m[2]];
			});
			var xScale = d3.scaleLinear().domain([0, d3.max(regressed_points, function (d) {
				return d[0];
			}) * 1.1]).range([this.props.padding, this.props.width - this.props.padding]);
			var yScale = d3.scaleLinear().domain([0, d3.max(regressed_points, function (d) {
				return d[1];
			}) * 1.1]).range([this.props.height - this.props.padding, 0]);

			var path = this.gen_path(this.props.regression_method, this.props.regression_result, xScale, yScale);

			function render_point(coords, index) {
				return React.createElement("circle", { cx: xScale(coords[0]), cy: yScale(coords[1]), r: 2, stroke: "black", key: index });
			}
			return React.createElement(
				"g",
				null,
				React.createElement("path", { d: path, stroke: "black", strokeWidth: 2, fill: "none" }),
				React.createElement(RegressionXYAxis, _extends({}, this.props, { xScale: xScale, yScale: yScale })),
				known_points.map(render_point),
				React.createElement(
					"text",
					{ x: this.props.width - 150, y: 16, dy: "0.35em", fontSize: "12px" },
					this.props.regression_result.regression_result.string
				)
			);
		}
	}, {
		key: "log_graph",
		value: function log_graph() {
			return React.createElement("g", null);
		}
	}, {
		key: "linear_graph",
		value: function linear_graph() {
			return React.createElement("g", null);
		}
	}, {
		key: "render_graph",
		value: function render_graph() {
			var graph;
			switch (this.props.regression_method) {
				case "power":
					graph = this.power_graph();
					break;
				case "logarithmic":
					graph = this.log_graph();
					break;
				case "linear":
					graph = this.linear_graph();
					break;
			}
			return React.createElement(
				"g",
				null,
				React.createElement(R2, { x: this.props.width - 150, y: 32, dy: "0.35em", r2: this.props.regression_result.regression_result.r2 }),
				graph
			);
		}
	}, {
		key: "render",
		value: function render() {
			switch (this.props.regression_method) {
				case "power":
					break;
				case "logarithmic":
					break;
				case "linear":
					break;
			}
			return React.createElement(
				"div",
				null,
				React.createElement(
					"svg",
					{ width: this.props.width, height: this.props.height },
					this.render_graph()
				)
			);
		}
	}]);

	return RegressionGraph;
}(React.Component);

var R2 = function (_React$Component2) {
	_inherits(R2, _React$Component2);

	function R2() {
		_classCallCheck(this, R2);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(R2).apply(this, arguments));
	}

	_createClass(R2, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"g",
				null,
				React.createElement(
					"text",
					{ x: this.props.x, y: this.props.y, dy: this.props.dy, fontSize: "12px" },
					"R"
				),
				React.createElement(
					"text",
					{ x: this.props.x + 8, y: this.props.y - 3, dy: this.props.dy, fontSize: "6px" },
					"2"
				),
				React.createElement(
					"text",
					{ x: this.props.x + 16, y: this.props.y, dy: this.props.dy, fontSize: "12px" },
					"=",
					this.props.r2
				)
			);
		}
	}]);

	return R2;
}(React.Component);

var RegressionXYAxis = function (_React$Component3) {
	_inherits(RegressionXYAxis, _React$Component3);

	function RegressionXYAxis() {
		_classCallCheck(this, RegressionXYAxis);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RegressionXYAxis).apply(this, arguments));
	}

	_createClass(RegressionXYAxis, [{
		key: "render",
		value: function render() {
			var xSettings = {
				translate: "translate(0, " + (this.props.height - this.props.padding) + ")",
				scale: this.props.xScale,
				orient: 'bottom'
			};
			var ySettings = {
				translate: "translate(" + this.props.padding + ", 0)",
				scale: this.props.yScale,
				orient: 'left'
			};
			return React.createElement(
				"g",
				{ className: "xy-axis" },
				React.createElement(RegressionAxis, xSettings),
				React.createElement(RegressionAxis, ySettings)
			);
		}
	}]);

	return RegressionXYAxis;
}(React.Component);

var RegressionAxis = function (_React$Component4) {
	_inherits(RegressionAxis, _React$Component4);

	function RegressionAxis() {
		_classCallCheck(this, RegressionAxis);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RegressionAxis).apply(this, arguments));
	}

	_createClass(RegressionAxis, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.renderRegressionAxis();
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.renderRegressionAxis();
		}
	}, {
		key: "renderRegressionAxis",
		value: function renderRegressionAxis() {
			var node = this.refs.regression_axis;
			var axis;
			switch (this.props.orient) {
				case "bottom":
					axis = d3.axisBottom(this.props.scale);
					break;
				case "left":
					axis = d3.axisLeft(this.props.scale);
					break;
			}
			d3.select(node).call(axis);
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement("g", { className: "regression_axis", ref: "regression_axis", transform: this.props.translate });
		}
	}]);

	return RegressionAxis;
}(React.Component);