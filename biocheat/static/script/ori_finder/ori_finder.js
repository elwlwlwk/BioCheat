"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var OriFinder = function (_React$Component) {
		_inherits(OriFinder, _React$Component);

		function OriFinder(props) {
			_classCallCheck(this, OriFinder);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OriFinder).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: [],
				num_ori: 1
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
				var gc_skew = [];
				var extended_base_seq = base_seq.concat(base_seq.slice(0, Math.ceil(base_seq.length / 2)));
				var window_size = Math.round(base_seq.length / 2);
				var g_cnt = 0,
				    c_cnt = 0;
				for (var i = 0; i < window_size; i++) {
					switch (extended_base_seq[i]) {
						case "G":
							g_cnt++;
							break;
						case "C":
							c_cnt++;
							break;
					}
				}
				gc_skew.push((g_cnt - c_cnt) / (g_cnt + c_cnt));
				for (var _i = window_size; _i < extended_base_seq.length - 1; _i++) {
					switch (extended_base_seq[_i]) {
						case 'G':
							g_cnt++;
							break;
						case 'C':
							c_cnt++;
							break;
					}
					switch (extended_base_seq[_i - window_size]) {
						case 'G':
							g_cnt--;
							break;
						case 'C':
							c_cnt--;
							break;
					}
					if (g_cnt < 0 || c_cnt < 0) {
						console.log("error");
					}
					gc_skew.push((g_cnt - c_cnt) / (g_cnt + c_cnt));
				}
				return gc_skew;
			}
		}, {
			key: "draw_skew_graph",
			value: function draw_skew_graph(gc_skew, gc_skew_cumul) {
				var height = 500;
				var width = 720;
				var padding = 40;

				var xScale = d3.scaleLinear().domain([0, gc_skew.length]).range([padding, width - padding]);
				var yScale = d3.scaleLinear().domain([d3.min(gc_skew), d3.max(gc_skew)]).range([height - padding, padding]);
				var yCumulScale = d3.scaleLinear().domain([d3.min(gc_skew_cumul), d3.max(gc_skew_cumul)]).range([height - padding, padding]);

				var line_data = [];
				for (var idx in gc_skew) {
					line_data.push({ pos: xScale(idx), skew: yScale(gc_skew[idx]) });
				}

				var cumul_line_data = [];
				for (var _idx in gc_skew_cumul) {
					cumul_line_data.push({ pos: xScale(_idx), skew: yCumulScale(gc_skew_cumul[_idx]) });
				}

				var valueline = d3.line().x(function (e) {
					return e.pos;
				}).y(function (e) {
					return e.skew;
				});
				var path_d = valueline(line_data);
				var cumul_path_d = valueline(cumul_line_data);

				return React.createElement(
					"svg",
					{ height: height, width: width },
					React.createElement(
						"text",
						{ x: 10, y: 30, fontSize: "10" },
						"GC skew normal"
					),
					React.createElement(
						"text",
						{ x: width - 120, y: 30, fontSize: "10", fill: "red" },
						"GC skew cumulative "
					),
					React.createElement(
						"text",
						{ x: width / 2 - 30, y: 20, fontSize: "10" },
						"window size: ",
						Math.round(gc_skew.length / 2)
					),
					React.createElement("path", { d: path_d, stroke: "black", strokeWidth: 2, fill: "none" }),
					React.createElement("path", { d: cumul_path_d, stroke: "red", strokeWidth: 2, fill: "none" }),
					React.createElement(XYAxis, { height: height, padding: padding, width: width, xScale: xScale, yScale: yScale, yCumulScale: yCumulScale })
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
			key: "expected_ori",
			value: function expected_ori(gc_skew, gc_skew_cumul) {
				var min = d3.min(gc_skew);
				var oris = gc_skew.map(function (d, idx) {
					return [idx, d];
				}).filter(function (d) {
					return d[1] == min;
				});
				return React.createElement(
					"p",
					null,
					"Expected ori positions using GC skew: ",
					React.createElement(
						"b",
						null,
						oris.map(function (d) {
							return d[0] + ", ";
						})
					),
					React.createElement("br", null)
				);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var gc_skew = this.calc_gc_skew(this.state.base_seq);
				var gc_skew_cumul = [0];
				gc_skew.forEach(function (d, idx) {
					gc_skew_cumul.push(gc_skew_cumul[idx] + d);
				});
				gc_skew_cumul = gc_skew_cumul.slice(1);
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
						this.expected_ori(gc_skew, gc_skew_cumul)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						this.draw_skew_graph(gc_skew, gc_skew_cumul)
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
				var yCumulSettings = {
					translate: "translate(" + (this.props.width - this.props.padding) + ", 0)",
					scale: this.props.yCumulScale,
					orient: 'right'
				};
				return React.createElement(
					"g",
					{ className: "xy-axis" },
					React.createElement(Axis, xSettings),
					React.createElement(Axis, ySettings),
					React.createElement(Axis, yCumulSettings)
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
					case "right":
						axis = d3.axisRight(this.props.scale);
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