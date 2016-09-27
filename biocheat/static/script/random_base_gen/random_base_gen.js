"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var RandomBaseGenerator = function (_React$Component) {
		_inherits(RandomBaseGenerator, _React$Component);

		function RandomBaseGenerator(props) {
			_classCallCheck(this, RandomBaseGenerator);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RandomBaseGenerator).call(this, props));

			_this.state = {
				length: 1000,
				GC_ratio: 50,
				T2U: false,
				sequence: []
			};
			return _this;
		}

		_createClass(RandomBaseGenerator, [{
			key: "render_ratio_controller",
			value: function render_ratio_controller() {
				var _this2 = this;

				return React.createElement(
					"div",
					{ className: "form_group" },
					React.createElement(
						"label",
						{ className: "col-sm-4 control-label" },
						"GC Ratio:"
					),
					React.createElement(
						"div",
						{ className: "col-sm-5" },
						React.createElement("input", { type: "range", step: "any", min: "0", max: "100", value: this.state.GC_ratio ? parseFloat(this.state.GC_ratio) : 0, onChange: function onChange(e) {
								return _this2.GC_ratio_changed(e);
							} })
					),
					React.createElement(
						"div",
						{ className: "col-sm-3" },
						React.createElement("input", { type: "text", className: "form-control", value: this.state.GC_ratio, onChange: function onChange(e) {
								return _this2.GC_ratio_changed(e);
							} })
					)
				);
			}
		}, {
			key: "generate_sequence",
			value: function generate_sequence(e) {
				var GC_count = Math.round(this.state.length * this.state.GC_ratio / 100);
				var sequence = [];
				for (var i = 0; i < GC_count; i++) {
					sequence.push(Math.random() > 0.5 ? "G" : "C");
				}
				for (var _i = 0; _i < this.state.length - GC_count; _i++) {
					sequence.push(Math.random() > 0.5 ? "A" : "T");
				}

				if (this.state.T2U) {
					sequence = sequence.map(function (elem) {
						return elem == "T" ? "U" : elem;
					});
				}

				this.setState({
					sequence: d3.shuffle(sequence)
				});
			}
		}, {
			key: "GC_ratio_changed",
			value: function GC_ratio_changed(e) {
				this.setState({
					GC_ratio: e.target.value
				});
			}
		}, {
			key: "length_changed",
			value: function length_changed(e) {
				this.setState({
					length: parseInt(e.target.value)
				});
			}
		}, {
			key: "T2U_changed",
			value: function T2U_changed(e) {
				this.setState({
					T2U: e.target.checked
				});
			}
		}, {
			key: "render_visual",
			value: function render_visual() {
				var block_size = 10;
				var padding = 30;
				var col_size = 50;
				var width = col_size * block_size + padding * 2;
				var height = Math.ceil(this.state.sequence.length / col_size) * 10 + padding * 2;

				var seq = this.state.sequence.map(function (elem, idx) {
					return [idx % col_size, Math.floor(idx / col_size), elem];
				});

				var xScale = d3.scaleLinear().domain([0, col_size - 1]).range([padding, width - padding - block_size]);
				var yScale = d3.scaleLinear().domain([0, d3.max(seq, function (d) {
					return d[1];
				})]).range([padding, height - padding - block_size]);
				var scale = {
					xScale: xScale,
					yScale: yScale
				};

				var base_color = { "A": "#B24848", "G": "#B09A47", "T": "#476FAD", "U": "#476FAD", "C": "#599562" };

				function render_block(d) {
					return React.createElement("rect", { width: block_size, height: block_size, x: xScale(d[0]), y: yScale(d[1]), fill: base_color[d[2]] });
				}
				return React.createElement(
					"svg",
					{ width: width, height: height },
					React.createElement(XYAxis, { xScale: d3.scaleLinear().domain([0, col_size]).range([padding, width - padding]), yScale: d3.scaleLinear().domain([0, d3.max(seq, function (d) {
							return d[1];
						}) + 1]).range([padding, height - padding]), padding: padding }),
					React.createElement(
						"text",
						{ x: width - padding / 2, y: 15, fill: base_color["A"], fontWeight: "bold" },
						"A"
					),
					React.createElement(
						"text",
						{ x: width - padding / 2, y: 30, fill: base_color["G"], fontWeight: "bold" },
						"G"
					),
					React.createElement(
						"text",
						{ x: width - padding / 2, y: 45, fill: base_color["T"], fontWeight: "bold" },
						this.state.T2U ? "U" : "T"
					),
					React.createElement(
						"text",
						{ x: width - padding / 2, y: 60, fill: base_color["C"], fontWeight: "bold" },
						"C"
					),
					seq.map(function (d) {
						return render_block(d);
					})
				);
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-6" },
						React.createElement(
							"div",
							{ className: "form_group" },
							React.createElement(
								"label",
								{ className: "col-sm-4 control-label" },
								"Length(bp):"
							),
							React.createElement(
								"div",
								{ className: "col-sm-8" },
								React.createElement("input", { type: "text", className: "form-control", value: this.state.length, onChange: function onChange(e) {
										return _this3.length_changed(e);
									} })
							)
						),
						this.render_ratio_controller(),
						React.createElement(
							"div",
							{ className: "form_group" },
							React.createElement(
								"label",
								null,
								React.createElement("input", { type: "checkbox", checked: this.state.T2U, onChange: function onChange(e) {
										return _this3.T2U_changed(e);
									} }),
								" Thymine to Uracil"
							)
						),
						React.createElement(
							"div",
							{ className: "form_group" },
							React.createElement(
								"button",
								{ className: "btn btn-primary", onClick: function onClick(e) {
										return _this3.generate_sequence(e);
									} },
								"generate"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("textarea", { className: "form-control", rows: "10", value: this.state.sequence ? this.state.sequence.toString().replace(/\,/g, "") : "" })
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						this.render_visual()
					)
				);
			}
		}]);

		return RandomBaseGenerator;
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
					translate: "translate(0, " + (this.props.padding - 10) + ")",
					scale: this.props.xScale,
					orient: 'top'
				};
				var ySettings = {
					translate: "translate(" + (this.props.padding - 10) + ", 0)",
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
					case "top":
						axis = d3.axisTop(this.props.scale);
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

		return Axis;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(RandomBaseGenerator, null), mountingPoint);
});