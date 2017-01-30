"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs(['/static/dct.js'], function () {
	var ExonIntron = function (_React$Component) {
		_inherits(ExonIntron, _React$Component);

		function ExonIntron(props) {
			_classCallCheck(this, ExonIntron);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExonIntron).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: [],
				window_size: 100,
				step_size: 100
			};
			return _this;
		}

		_createClass(ExonIntron, [{
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
			key: "window_size_changed",
			value: function window_size_changed(e) {
				this.setState({
					window_size: parseInt(e.target.value)
				});
			}
		}, {
			key: "step_size_changed",
			value: function step_size_changed(e) {
				this.setState({
					step_size: parseInt(e.target.value)
				});
			}
		}, {
			key: "normalcdf",
			value: function normalcdf(X) {
				//HASTINGS.  MAX ERROR = .000001
				var T = 1 / (1 + .2316419 * Math.abs(X));
				var D = .3989423 * Math.exp(-X * X / 2);
				var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
				if (X > 0) {
					Prob = 1 - Prob;
				}
				return Prob;
			}
		}, {
			key: "compute_cdf",
			value: function compute_cdf(Z, M, SD) {
				var Prob = 0;
				if (SD < 0) {
					alert("The standard deviation must be nonnegative.");
				} else if (SD == 0) {
					if (Z < M) {
						Prob = 0;
					} else {
						Prob = 1;
					}
				} else {
					Prob = this.normalcdf((Z - M) / SD);
				}
				return Prob;
			}
		}, {
			key: "calc_exon_prob",
			value: function calc_exon_prob(base_seq, window_size, step_size) {
				var G_cnt = [];
				var codon_peaks = [];
				base_seq.forEach(function (base) {
					switch (base) {
						case 'A':
						case 'T':
						case 'C':
							G_cnt.push(0);
							break;
						case 'G':
							G_cnt.push(1);
							break;
					}
				});
				var extract_codon_peak = function (base_dct) {
					var codon_area = base_dct.slice(Math.floor(base_dct.length * 2 / 3 - base_dct.length / 20), Math.ceil(base_dct.length * 2 / 3 + base_dct.length / 20));
					var max_peak = d3.max(codon_area);
					var min_peak = d3.min(codon_area);
					var max_index = codon_area.indexOf(max_peak);
					var min_index = codon_area.indexOf(min_peak);
					var codon_padding = codon_area.length / 10;
					var second_max = d3.max(codon_area.slice(0, max_index - codon_padding).concat(codon_area.slice(max_index + codon_padding + 1)));
					var second_min = d3.min(codon_area.slice(0, min_index - codon_padding).concat(codon_area.slice(min_index + codon_padding + 1)));
					return d3.max([max_peak / second_max, min_peak / second_min]);
					//var mean= codon_area.reduce( (a,b)=>a+b )/codon_area.length;
					//var variance= codon_area.map( (x)=>Math.pow(x-mean,2) ).reduce( (a,b)=>a+b )/codon_area.length; 
					//return d3.max([(max_peak-mean)/variance, Math.abs((min_peak-mean)/variance)]);
				}.bind(this);
				for (var i = 0; i < base_seq.length; i += step_size) {
					var dct_peak_prob = extract_codon_peak(dct(G_cnt.slice(i, i + window_size)));
					codon_peaks.push(dct_peak_prob);
				}

				return codon_peaks;
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var exon_probs = this.calc_exon_prob(this.state.base_seq, this.state.window_size, this.state.step_size);
				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-4" },
							"Scanning Window Size"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							React.createElement("input", { className: "form-control", onChange: function onChange(e) {
									return _this2.window_size_changed(e);
								}, defaultValue: this.state.window_size })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-4" },
							"Step Size"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							React.createElement("input", { className: "form-control", onChange: function onChange(e) {
									return _this2.step_size_changed(e);
								}, defaultValue: this.state.step_size })
						)
					),
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
						React.createElement(ExonIntronGraph, _extends({ exon_probs: exon_probs }, this.state))
					)
				);
			}
		}]);

		return ExonIntron;
	}(React.Component);

	var ExonIntronGraph = function (_React$Component2) {
		_inherits(ExonIntronGraph, _React$Component2);

		function ExonIntronGraph(props) {
			_classCallCheck(this, ExonIntronGraph);

			var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(ExonIntronGraph).call(this, props));

			_this3.state = {
				exon_prob_threshold_bar: 50,
				exon_prob_threshold: -1
			};
			return _this3;
		}

		_createClass(ExonIntronGraph, [{
			key: "draw_exon_prob_graph",
			value: function draw_exon_prob_graph(exon_prob, threshold) {
				var height = 500;
				var width = 720;
				var padding = 40;

				var xScale = d3.scaleLinear().domain([0, exon_prob.length * this.props.step_size]).range([padding, width - padding]);
				var yScale = d3.scaleLinear().domain([d3.min(exon_prob), d3.max(exon_prob)]).range([height - padding, padding]);

				var line_data = [];
				for (var idx in exon_prob) {
					line_data.push({ pos: xScale(idx * this.props.step_size), prob: yScale(exon_prob[idx]) });
				}

				var valueline = d3.line().x(function (e) {
					return e.pos;
				}).y(function (e) {
					return e.prob;
				});
				var path_d = valueline(line_data);
				var exon_prob_threshold = 0;
				if (this.state.exon_prob_threshold == -1) {
					var threshold_scale = d3.scaleLinear().domain([0, 100]).range([d3.min(this.props.exon_probs), d3.max(this.props.exon_probs)]);
					exon_prob_threshold = threshold_scale(50);
				} else {
					exon_prob_threshold = this.state.exon_prob_threshold;
				}

				var threshold_line = valueline([{ pos: xScale(0), prob: yScale(exon_prob_threshold) }, { pos: xScale(exon_prob.length * this.props.step_size), prob: yScale(exon_prob_threshold) }]);

				return React.createElement(
					"svg",
					{ height: height, width: width },
					React.createElement(
						"text",
						{ x: width / 2 - 30, y: 20, fontSize: "10" },
						"Exon Intensity"
					),
					React.createElement("path", { d: path_d, stroke: "black", strokeWidth: 2, fill: "none" }),
					React.createElement("path", { d: threshold_line, stroke: "black", strokeWidth: 2, fill: "none" }),
					React.createElement(XYAxis, { height: height, padding: padding, width: width, xScale: xScale, yScale: yScale })
				);
			}
		}, {
			key: "exon_prob_threshold_changed",
			value: function exon_prob_threshold_changed(e) {
				var threshold_scale = d3.scaleLinear().domain([0, 100]).range([d3.min(this.props.exon_probs), d3.max(this.props.exon_probs)]);
				this.setState({
					exon_prob_threshold: threshold_scale(parseInt(e.target.value)),
					exon_prob_threshold_bar: parseInt(e.target.value)
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this4 = this;

				var color_scale = d3.scaleLinear().range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c", "#f9d057", "#f29e2e", "#e76818", "#d7191c"]);
				return React.createElement(
					"div",
					{ "class": "col-sm-12" },
					React.createElement(
						"div",
						{ "class": "col-sm-12" },
						React.createElement(
							"label",
							{ className: "col-sm-4 control-label" },
							"Exon Intensity Threshold:"
						),
						React.createElement(
							"div",
							{ className: "col-sm-5" },
							React.createElement("input", { type: "range", step: "any", min: "0", max: "100", value: this.state.exon_prob_threshold_bar, onChange: function onChange(e) {
									return _this4.exon_prob_threshold_changed(e);
								} })
						)
					),
					React.createElement(
						"div",
						{ "class": "col-sm-12" },
						this.draw_exon_prob_graph(this.props.exon_probs)
					)
				);
			}
		}]);

		return ExonIntronGraph;
	}(React.Component);

	var XYAxis = function (_React$Component3) {
		_inherits(XYAxis, _React$Component3);

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

	var Axis = function (_React$Component4) {
		_inherits(Axis, _React$Component4);

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
	ReactDOM.render(React.createElement(ExonIntron, null), mountingPoint);
});