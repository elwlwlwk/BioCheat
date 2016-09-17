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

var RestrictMap = function (_React$Component) {
	_inherits(RestrictMap, _React$Component);

	function RestrictMap(props) {
		_classCallCheck(this, RestrictMap);

		//var default_marker_inputs=["ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000", "A: 4.3 4.55", "B: 5.1 4", "A+B: 6.05 5.1 4.55"];
		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RestrictMap).call(this, props));

		var default_marker_inputs = ["ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000", "A: 2.95 4", "B: 3.1 3.6", "A+B: 3.6 4 4.6 5.8"];
		var default_parsed_result = _this.parse_marker_input(default_marker_inputs.reduce(function (a, b) {
			return a + "\n" + b;
		}));
		var default_regression_method = "power";
		var default_DNA_form = "circular";
		var default_digest_manner = "double";
		_this.state = {
			markers: _this.estimate_length(default_regression_method, default_parsed_result.markers).points,
			marker_label: default_parsed_result.marker_label,
			marker_inputs: default_marker_inputs,
			width: _this.props.padding * 2 + (_this.props.marker_width + _this.props.column_padding) * (d3.max(default_parsed_result.markers, function (d) {
				return d[0];
			}) + 1) - _this.props.column_padding,
			height: 300,
			render_dis: false,
			render_length: true,
			exclude_ladder: true,
			regression_method: default_regression_method,
			DNA_form: default_DNA_form,
			digest_manner: default_digest_manner
		};
		return _this;
	}

	_createClass(RestrictMap, [{
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
		key: "exclude_ladder_changed",
		value: function exclude_ladder_changed(e) {
			this.setState({
				exclude_ladder: e.target.checked
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
				try {
					var label = column.split(":")[0].trim();
					var elements = column.split(":")[1].trim().split(/[\s,]+/);
				} catch (e) {
					var label = "";
					var elements = column.trim().split(/[\s,]+/);
				}
				marker_label.push([idx, label]);
				elements.forEach(function (marker) {
					markers.push([idx, isNaN(parseFloat(marker.split("-")[0])) ? 0 : parseFloat(marker.split("-")[0]), isNaN(parseFloat(marker.split("-")[1])) ? null : parseFloat(marker.split("-")[1])]);
				});
			});
			return { markers: markers, marker_label: marker_label };
		}
	}, {
		key: "marker_input_changed",
		value: function marker_input_changed(e, method) {
			var input = e.target.value;
			var marker_inputs = this.state.marker_inputs.slice(0);
			switch (method) {
				case "ladder":
					marker_inputs[0] = input;
					break;
				case "first":
					marker_inputs[1] = input;
					break;
				case "second":
					marker_inputs[2] = input;
					break;
				case "double":
					marker_inputs[3] = input;
					break;
				case "partial":
					marker_inputs[1] = input;
					break;
			}
			var result = this.parse_marker_input(marker_inputs.reduce(function (a, b) {
				return a + "\n" + b;
			}));
			result.markers = this.estimate_length(this.state.regression_method, result.markers).points;
			this.setState({
				markers: result.markers,
				marker_label: result.marker_label,
				width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(result.markers, function (d) {
					return d[0];
				}) + 1) - this.props.column_padding,
				marker_inputs: marker_inputs
			});
		}
	}, {
		key: "regression_method_changed",
		value: function regression_method_changed(e) {
			var result = this.parse_marker_input(this.state.marker_inputs.reduce(function (a, b) {
				return a + "\n" + b;
			}));
			result.markers = this.estimate_length(e.target.value, result.markers).points;
			this.setState({
				markers: result.markers,
				regression_method: e.target.value
			});
		}
	}, {
		key: "DNA_form_changed",
		value: function DNA_form_changed(e) {
			this.setState({
				DNA_form: e.target.value
			});
		}
	}, {
		key: "digest_manner_changed",
		value: function digest_manner_changed(e) {
			var digest_manner = e.target.value;
			var default_marker_inputs = [];
			switch (digest_manner) {
				case "double":
					default_marker_inputs.push("ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000");
					default_marker_inputs.push("A: 4.3 4.55");
					default_marker_inputs.push("B: 5.1 4");
					default_marker_inputs.push("A+B: 6.05 5.1 4.55");
					/*default_marker_inputs.push("ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000");
     default_marker_inputs.push("A: 2.95 4");
     default_marker_inputs.push("B: 3.1 3.6");
     default_marker_inputs.push("A+B: 3.6 4 4.6 5.8");
     */
					break;
				case "partial":
					default_marker_inputs.push("ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000");
					default_marker_inputs.push("A: 4.3 4.55");
					break;
			}

			var result = this.parse_marker_input(default_marker_inputs.reduce(function (a, b) {
				return a + "\n" + b;
			}));
			result.markers = this.estimate_length(this.state.regression_method, result.markers).points;

			this.setState({
				digest_manner: digest_manner,
				markers: result.markers,
				marker_label: result.marker_label,
				width: this.props.padding * 2 + (this.props.marker_width + this.props.column_padding) * (d3.max(result.markers, function (d) {
					return d[0];
				}) + 1) - this.props.column_padding,
				marker_inputs: default_marker_inputs
			});
		}
	}, {
		key: "render_input_area",
		value: function render_input_area() {
			var _this2 = this;

			switch (this.state.digest_manner) {
				case "double":
					return React.createElement(
						"div",
						null,
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"DNA Ladder"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", defaultValue: this.state.marker_inputs[0], onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "ladder");
									} })
							)
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"First Digest"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", defaultValue: this.state.marker_inputs[1], onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "first");
									} })
							)
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"Second Digest"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", defaultValue: this.state.marker_inputs[2], onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "second");
									} })
							)
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"Double Digest"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", defaultValue: this.state.marker_inputs[3], onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "double");
									} })
							)
						)
					);
				case "partial":
					return React.createElement(
						"div",
						null,
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"DNA Ladder"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "ladder");
									} })
							)
						),
						React.createElement(
							"div",
							{ className: "form-group" },
							React.createElement(
								"label",
								{ className: "col-sm-2 control-label" },
								"Partial Digest"
							),
							React.createElement(
								"div",
								{ className: "col-sm-10" },
								React.createElement("input", { className: "form-control", onChange: function onChange(e) {
										return _this2.marker_input_changed(e, "partial");
									} })
							)
						)
					);
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			return React.createElement(
				"div",
				{ className: "col-sm-12" },
				React.createElement(Electrophoresis, _extends({}, this.props, this.state)),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"label",
						null,
						"Digest manner:"
					),
					React.createElement(
						"select",
						{ name: "digest_manner", defaultValue: this.state.digest_manner, onChange: function onChange(e) {
								return _this3.digest_manner_changed(e);
							} },
						React.createElement(
							"option",
							{ value: "double" },
							"double"
						),
						React.createElement(
							"option",
							{ value: "partial", disabled: true },
							"partial (will be implemented)"
						)
					)
				),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement(
						"label",
						null,
						"DNA form:"
					),
					React.createElement(
						"select",
						{ name: "DNA_Form", defaultValue: this.state.DNA_form, onChange: function onChange(e) {
								return _this3.DNA_form_changed(e);
							} },
						React.createElement(
							"option",
							{ value: "linear" },
							"linear"
						),
						React.createElement(
							"option",
							{ value: "circular" },
							"circular"
						)
					)
				),
				this.render_input_area(),
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this3.render_distance_changed(e);
						}, checked: this.state.render_dis }),
					"render distance",
					React.createElement("br", null),
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this3.render_length_changed(e);
						}, checked: this.state.render_length }),
					"render base length",
					React.createElement("br", null)
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
								return _this3.regression_method_changed(e);
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
					{ id: "regression_div", className: "collapse" },
					React.createElement(RegressionGraph, { width: 300, height: 300, padding: 40, regression_result: this.estimate_length(this.state.regression_method, this.parse_marker_input(this.state.marker_inputs.reduce(function (a, b) {
							return a + "\n" + b;
						})).markers), orig_input: this.parse_marker_input(this.state.marker_inputs.reduce(function (a, b) {
							return a + "\n" + b;
						})), regression_method: this.state.regression_method })
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"button",
						{ type: "button", className: "btn btn-primary", "data-toggle": "collapse", "data-target": "#regression_div" },
						"Show Regression Graph"
					)
				),
				React.createElement(RestrictGraph, _extends({}, this.props, this.state, { width: 500, height: 500, row_padding: 50, padding: 30, label_padding: 60 }))
			);
		}
	}]);

	return RestrictMap;
}(React.Component);

requirejs(["static/script/restrict_map/electrophoresis", "static/script/restrict_map/regression_graph", "static/regression/regression_r", "static/script/restrict_map/restrict_graph", "static/script/restrict_map/linear_dna"], function () {
	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.body.appendChild(mountingPoint);
	ReactDOM.render(React.createElement(RestrictMap, styles), mountingPoint);
});