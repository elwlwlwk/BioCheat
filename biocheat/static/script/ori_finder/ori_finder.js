"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs(["static/regression/regression_r"], function () {
	var OriFinder = function (_React$Component) {
		_inherits(OriFinder, _React$Component);

		function OriFinder(props) {
			_classCallCheck(this, OriFinder);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OriFinder).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: [],
				num_ori: 1,
				render_regression: true
			};
			return _this;
		}

		_createClass(OriFinder, [{
			key: "base_textarea_changed",
			value: function base_textarea_changed(e) {
				var base_seq = e.target.value.toUpperCase().replace(/[^ATUCG]/g, "").trim().split("");

				this.setState({
					base_input: e.target.value,
					base_seq: base_seq
				});
			}
		}, {
			key: "FASTA_file_changed",
			value: function FASTA_file_changed(e) {
				var reader = new FileReader();

				reader.onload = function (e) {
					var base_input = e.target.result.replace(/^>.+\n/, "");
					var base_seq = base_input.toUpperCase().replace(/[^ATUCG]/g, "").trim().split("");
					this.setState({
						base_input: base_input,
						base_seq: base_seq
					});
				}.bind(this);
				reader.readAsText(e.target.files[0]);
			}
		}, {
			key: "calc_gc_skew",
			value: function calc_gc_skew(base_seq) {
				var gc_skew = [0];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = base_seq[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var base = _step.value;

						switch (base) {
							case "G":
								gc_skew.push(gc_skew.slice(-1)[0] + 1);
								break;
							case "C":
								gc_skew.push(gc_skew.slice(-1)[0] - 1);
								break;
							default:
								gc_skew.push(gc_skew.slice(-1)[0]);
								break;
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return gc_skew;
			}
		}, {
			key: "draw_skew_graph",
			value: function draw_skew_graph(gc_skew, regression_result) {
				var height = 500;
				var width = 720;
				var padding = 30;

				var xScale = d3.scaleLinear().domain([0, gc_skew.length]).range([padding, width - padding]);
				var yScale = d3.scaleLinear().domain([d3.min(gc_skew), d3.max(gc_skew)]).range([height - padding, padding]);

				var line_data = [];
				for (var idx in gc_skew) {
					line_data.push({ pos: xScale(idx), skew: yScale(gc_skew[idx]) });
				}

				var valueline = d3.line().x(function (e) {
					return e.pos;
				}).y(function (e) {
					return e.skew;
				});
				var path_d = valueline(line_data);

				var regress_x = [];
				for (var i = 0; i < width; i++) {
					regress_x.push(gc_skew.length / width * i);
				}
				var regress_data = regress_x.map(function (x) {
					var equation = regression_result.equation;
					var y = 0;
					for (var _i = 0; _i < equation.length; _i++) {
						y += equation[_i] * Math.pow(x, _i);
					}
					return { pos: xScale(x), skew: yScale(y) };
				});
				var regress_path_d = valueline(regress_data);

				return React.createElement(
					"svg",
					{ height: height, width: width },
					React.createElement("path", { d: path_d, stroke: "black", strokeWidth: 2, fill: "none" }),
					function () {
						if (this.state.render_regression) return React.createElement("path", { d: regress_path_d, stroke: "red", strokeWidth: 2, fill: "none" });
					}.bind(this)(),
					React.createElement(XYAxis, { height: height, padding: padding, width: width, xScale: xScale, yScale: yScale })
				);
			}
		}, {
			key: "num_ori_changed",
			value: function num_ori_changed(e) {
				this.setState({
					num_ori: parseInt(e.target.value)
				});
			}
		}, {
			key: "render_regression_changed",
			value: function render_regression_changed(e) {
				this.setState({
					render_regression: e.target.checked
				});
			}
		}, {
			key: "expected_ori",
			value: function expected_ori(gc_skew) {
				var min = d3.min(gc_skew);
				var oris = gc_skew.map(function (d, idx) {
					return [idx, d];
				}).filter(function (d) {
					return d[1] == min;
				});
				return React.createElement(
					"p",
					null,
					"Expected Ori Positions: Around ",
					React.createElement(
						"b",
						null,
						oris.map(function (d) {
							return d[0] + ", ";
						})
					)
				);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var gc_skew = this.calc_gc_skew(this.state.base_seq);
				var regression_result = regression('polynomial', gc_skew.map(function (d, idx) {
					return [idx, d];
				}), this.state.num_ori + 2);
				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("textarea", { className: "form-control", rows: "10", onChange: function onChange(e) {
								return _this2.base_textarea_changed(e);
							}, value: this.state.base_input }),
						React.createElement(
							"div",
							{ className: "form_group" },
							React.createElement(
								"label",
								null,
								"Upload FASTA file"
							),
							React.createElement("input", { type: "file", onChange: function onChange(e) {
									return _this2.FASTA_file_changed(e);
								} })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						this.expected_ori(gc_skew)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
								return _this2.render_regression_changed(e);
							}, checked: this.state.render_regression }),
						"render regression",
						React.createElement("br", null)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						this.draw_skew_graph(gc_skew, regression_result)
					)
				);
			}
		}]);

		return OriFinder;
	}(React.Component);

	var XYAxis = function (_React$Component2) {
		_inherits(XYAxis, _React$Component2);

		function XYAxis() {
			_classCallCheck(this, XYAxis);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(XYAxis).apply(this, arguments));
		}

		_createClass(XYAxis, [{
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
					React.createElement(Axis, xSettings),
					React.createElement(Axis, ySettings)
				);
			}
		}]);

		return XYAxis;
	}(React.Component);

	var Axis = function (_React$Component3) {
		_inherits(Axis, _React$Component3);

		function Axis() {
			_classCallCheck(this, Axis);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(Axis).apply(this, arguments));
		}

		_createClass(Axis, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				this.renderAxis();
			}
		}, {
			key: "componentDidUpdate",
			value: function componentDidUpdate() {
				this.renderAxis();
			}
		}, {
			key: "renderAxis",
			value: function renderAxis() {
				var node = this.refs.axis;
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
				return React.createElement("g", { className: "axis", ref: "axis", transform: this.props.translate });
			}
		}]);

		return Axis;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(OriFinder, null), mountingPoint);
});