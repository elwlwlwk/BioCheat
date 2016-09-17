"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
	padding: 40,
	marker_width: 40,
	column_padding: 40
};

var BaseLen = function (_React$Component) {
	_inherits(BaseLen, _React$Component);

	function BaseLen(props) {
		_classCallCheck(this, BaseLen);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseLen).call(this, props));

		var default_marker_input = "ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000\nA: 2.5 5.5 6.4";
		var default_parsed_result = _this.parse_marker_input(default_marker_input);
		var default_regression_method = "power";
		_this.state = {
			markers: _this.estimate_length(default_regression_method, default_parsed_result.markers).points,
			marker_label: default_parsed_result.marker_label,
			marker_input: default_marker_input,
			electro_width: _this.props.padding * 2 + (_this.props.marker_width + _this.props.column_padding) * (d3.max(default_parsed_result.markers, function (d) {
				return d[0];
			}) + 1) - _this.props.column_padding,
			electro_height: 300,
			render_dis: false,
			render_length: true,
			regression_method: default_regression_method
		};
		return _this;
	}

	_createClass(BaseLen, [{
		key: "render_distance_changed",
		value: function render_distance_changed(e) {
			this.setState({
				render_dis: e.target.checked
			});
		}
	}, {
		key: "render_length_changed",
		value: function render_length_changed(e) {
			this.setState({
				render_length: e.target.checked
			});
		}
	}, {
		key: "power_regression",
		value: function power_regression(points) {
			var data = points.filter(function (p) {
				return p[1];
			}).map(function (p) {
				return [p[0], p[1]];
			});
			var result = regression("power", data);
			return {
				points: points.map(function (p) {
					return [p[0], p[1] ? p[1] : result.equation[0] * Math.pow(p[0], result.equation[1]), p[2]];
				}),
				regression_result: result
			};
		}
	}, {
		key: "logarithmic_regression",
		value: function logarithmic_regression(points) {
			var data = points.filter(function (p) {
				return p[1];
			}).map(function (p) {
				return [p[0], Math.log10(p[1])];
			});
			var result = regression("linear", data);
			return {
				points: points.map(function (p) {
					return [p[0], p[1] ? p[1] : Math.pow(10, result.equation[1] + result.equation[0] * p[0]), p[2]];
				}),
				regression_result: result
			};
		}
	}, {
		key: "linear_regression",
		value: function linear_regression(points) {
			var data = points.filter(function (p) {
				return p[1];
			}).map(function (p) {
				return [p[0], p[1]];
			});
			var result = regression("linear", data);
			return {
				points: points.map(function (p) {
					return [p[0], p[1] ? p[1] : result.equation[1] + result.equation[0] * p[0], p[2]];
				}),
				regression_result: result
			};
		}
	}, {
		key: "polynomial_regression",
		value: function polynomial_regression(points) {
			var data = points.filter(function (p) {
				return p[1];
			}).map(function (p) {
				return [p[0], p[1]];
			});
			var result = regression("polynomial", data, 5);
			return {
				points: points.map(function (p) {
					return [p[0], p[1] ? p[1] : function () {
						var sum = 0;
						result.equation.forEach(function (n, idx) {
							sum += n * Math.pow(p[0], idx);
						});
						return sum;
					}(), p[2]];
				}),
				regression_result: result
			};
		}
	}, {
		key: "estimate_length",
		value: function estimate_length(method, markers) {
			var points = markers.map(function (marker) {
				return [marker[1], marker[2], marker[0]];
			});
			var result;
			switch (method) {
				case "power":
					result = this.power_regression(points);
					break;
				case "logarithmic":
					result = this.logarithmic_regression(points);
					break;
				case "linear":
					result = this.linear_regression(points);
					break;
			}
			result.points = result.points.map(function (marker) {
				return [marker[2], marker[0], marker[1]];
			});
			return result;
		}
	}, {
		key: "parse_marker_input",
		value: function parse_marker_input(input) {
			var columns = input.trim().split("\n").map(function (i) {
				return i.trim();
			});
			var markers = [];
			var marker_label = [];
			columns.forEach(function (column, idx) {
				var label = column.split(":")[0].trim();
				var elements = column.split(":")[1].trim().split(/[\s,]+/);
				marker_label.push([idx, label]);
				elements.forEach(function (marker) {
					markers.push([idx, isNaN(parseFloat(marker.split("-")[0])) ? 0 : parseFloat(marker.split("-")[0]), isNaN(parseFloat(marker.split("-")[1])) ? null : parseFloat(marker.split("-")[1])]);
				});
			});
			return { markers: markers, marker_label: marker_label };
		}
	}, {
		key: "marker_input_changed",
		value: function marker_input_changed(e) {
			var input = e.target.value;
			var result = this.parse_marker_input(input);
			result.markers = this.estimate_length(this.state.regression_method, result.markers).points;
			this.setState({
				markers: result.markers,
				marker_label: result.marker_label,
				electro_width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(result.markers, function (d) {
					return d[0];
				}) + 1) - this.props.column_padding,
				marker_input: input
			});
		}
	}, {
		key: "regression_method_changed",
		value: function regression_method_changed(e) {
			var result = this.parse_marker_input(this.state.marker_input);
			result.markers = this.estimate_length(e.target.value, result.markers).points;
			this.setState({
				markers: result.markers,
				regression_method: e.target.value
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			return React.createElement(
				"div",
				null,
				React.createElement(Electrophoresis, _extends({}, this.props, this.state)),
				React.createElement("textarea", { onChange: function onChange(e) {
						return _this2.marker_input_changed(e);
					}, defaultValue: this.state.marker_input, cols: "50", rows: "5" }),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this2.render_distance_changed(e);
						}, checked: this.state.render_dis }),
					"render distance",
					React.createElement("br", null),
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this2.render_length_changed(e);
						}, checked: this.state.render_length }),
					"render base length"
				),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"label",
						null,
						"regression method:"
					),
					React.createElement(
						"select",
						{ name: "regression_method", defaultValue: this.state.regression_method, onChange: function onChange(e) {
								return _this2.regression_method_changed(e);
							} },
						React.createElement(
							"option",
							{ value: "power" },
							"power"
						),
						React.createElement(
							"option",
							{ value: "logarithmic" },
							"logarithmic"
						),
						React.createElement(
							"option",
							{ value: "linear" },
							"linear"
						)
					)
				),
				React.createElement(
					"div",
					null,
					React.createElement(RegressionGraph, { width: 300, height: 300, padding: 40, regression_result: this.estimate_length(this.state.regression_method, this.parse_marker_input(this.state.marker_input).markers), orig_input: this.parse_marker_input(this.state.marker_input), regression_method: this.state.regression_method })
				)
			);
		}
	}]);

	return BaseLen;
}(React.Component);

requirejs(["static/script/restrict_map/electrophoresis", "static/script/restrict_map/regression_graph", "static/regression/regression_r"], function () {
	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(React.createElement(BaseLen, styles), mountingPoint);
});