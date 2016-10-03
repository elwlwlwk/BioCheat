"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var CodonAnalyzer = function (_React$Component) {
		_inherits(CodonAnalyzer, _React$Component);

		function CodonAnalyzer(props) {
			_classCallCheck(this, CodonAnalyzer);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CodonAnalyzer).call(this, props));

			_this.state = {
				codon_ratio_organism: "custom",
				codon_ratio_list: [],
				codon_ratio: new Map(),
				codon_translation_organism: "standard",
				codon_translation: new Map()
			};
			return _this;
		}

		_createClass(CodonAnalyzer, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				this.serverRequest = $.get("/static/spsum/list", function (result) {
					this.setState({
						codon_ratio_list: JSON.parse(result)
					});
				}.bind(this));
			}
		}, {
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				this.serverRequest.abort();
			}
		}, {
			key: "render_codon_ratio_select",
			value: function render_codon_ratio_select() {
				var _this2 = this;

				return React.createElement(
					"select",
					{ className: "form-control", defaultValue: this.state.codon_ratio_organism, onChange: function onChange(e) {
							return _this2.codon_ratio_select_changed(e);
						} },
					React.createElement(
						"option",
						{ value: "custom" },
						"custom"
					),
					this.state.codon_ratio_list.map(function (elem) {
						return React.createElement(
							"option",
							{ value: elem },
							elem
						);
					})
				);
			}
		}, {
			key: "render_codon_ratio_table",
			value: function render_codon_ratio_table() {
				var _this3 = this;

				var base_set = ["U", "C", "A", "G"];
				var base_combi = [];

				base_set.forEach(function (i) {
					base_set.forEach(function (j) {
						base_set.forEach(function (k) {
							base_combi.push(i + j + k);
						});
					});
				});

				var base_combi_set = [];

				while (base_combi.length) {
					base_combi_set.push(base_combi.splice(0, 4));
				}

				function render_base_combi(base_set, react_this) {
					return React.createElement(
						"tr",
						null,
						React.createElement(
							"td",
							null,
							base_set[0]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.ratio_table_changed(e, base_set[0]);
								}, value: react_this.state.codon_ratio.get(base_set[0]) })
						),
						React.createElement(
							"td",
							null,
							base_set[1]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.ratio_table_changed(e, base_set[1]);
								}, value: react_this.state.codon_ratio.get(base_set[1]) })
						),
						React.createElement(
							"td",
							null,
							base_set[2]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.ratio_table_changed(e, base_set[2]);
								}, value: react_this.state.codon_ratio.get(base_set[2]) })
						),
						React.createElement(
							"td",
							null,
							base_set[3]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.ratio_table_changed(e, base_set[3]);
								}, value: react_this.state.codon_ratio.get(base_set[3]) })
						)
					);
				}

				return React.createElement(
					"table",
					{ className: "table table-bordered table-hover" },
					React.createElement(
						"tbody",
						null,
						base_combi_set.map(function (combi_set) {
							return render_base_combi(combi_set, _this3);
						})
					)
				);
			}
		}, {
			key: "ratio_table_changed",
			value: function ratio_table_changed(e, codon) {
				this.setState({
					codon_ratio: this.state.codon_ratio.set(codon, e.target.value)
				});
			}
		}, {
			key: "render_codon_translation_select",
			value: function render_codon_translation_select() {
				var _this4 = this;

				return React.createElement(
					"select",
					{ className: "form-control", defaultValue: this.state.codon_translation_organism, onChange: function onChange(e) {
							return _this4.codon_translation_select_changed(e);
						} },
					React.createElement(
						"option",
						{ value: "standard" },
						"standard"
					),
					React.createElement(
						"option",
						{ value: "standard" },
						"standard"
					)
				);
			}
		}, {
			key: "render_codon_translation_table",
			value: function render_codon_translation_table() {
				var _this5 = this;

				var base_set = ["U", "C", "A", "G"];
				var base_combi = [];

				base_set.forEach(function (i) {
					base_set.forEach(function (j) {
						base_set.forEach(function (k) {
							base_combi.push(i + j + k);
						});
					});
				});

				var base_combi_set = [];

				while (base_combi.length) {
					base_combi_set.push(base_combi.splice(0, 4));
				}

				function render_base_combi(base_set, react_this) {
					return React.createElement(
						"tr",
						null,
						React.createElement(
							"td",
							null,
							base_set[0]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.translation_table_changed(e, base_set[0]);
								}, value: react_this.state.codon_translation.get(base_set[0]) })
						),
						React.createElement(
							"td",
							null,
							base_set[1]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.translation_table_changed(e, base_set[1]);
								}, value: react_this.state.codon_translation.get(base_set[1]) })
						),
						React.createElement(
							"td",
							null,
							base_set[2]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.translation_table_changed(e, base_set[2]);
								}, value: react_this.state.codon_translation.get(base_set[2]) })
						),
						React.createElement(
							"td",
							null,
							base_set[3]
						),
						React.createElement(
							"td",
							null,
							React.createElement("input", { size: "5", onChange: function onChange(e) {
									return react_this.translation_table_changed(e, base_set[3]);
								}, value: react_this.state.codon_translation.get(base_set[3]) })
						)
					);
				}

				return React.createElement(
					"table",
					{ className: "table table-bordered table-hover" },
					React.createElement(
						"tbody",
						null,
						base_combi_set.map(function (combi_set) {
							return render_base_combi(combi_set, _this5);
						})
					)
				);
			}
		}, {
			key: "translation_table_changed",
			value: function translation_table_changed(e, codon) {
				this.setState({
					codon_translation: this.state.codon_translation.set(codon, e.target.value)
				});
			}
		}, {
			key: "codon_ratio_select_changed",
			value: function codon_ratio_select_changed(e) {
				$.get("/static/spsum/" + e.target.value, function (result) {
					var codon_label = ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
					var spsum = result.trim().split(" ").map(function (d) {
						return parseInt(d);
					});
					var codon_total = spsum.reduce(function (a, b) {
						return a + b;
					});
					this.setState({
						codon_ratio: new Map(d3.zip(codon_label, spsum.map(function (d) {
							return (1000 * d / codon_total).toFixed(3);
						})))
					});
				}.bind(this));
			}
		}, {
			key: "codon_translation_select_changed",
			value: function codon_translation_select_changed(e) {
				$.get("/static/codon_translation/" + e.target.value, function (result) {
					var codon_label = ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
					var amino = result.trim().split(" ");
					this.setState({
						codon_translation: new Map(d3.zip(codon_label, amino))
					});
				}.bind(this));
			}
		}, {
			key: "render",
			value: function render() {
				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Codon Ratio Table (‰)"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							this.render_codon_ratio_select()
						),
						React.createElement(
							"div",
							{ id: "codon_ratio_div", className: "collapse col-sm-12" },
							this.render_codon_ratio_table()
						),
						React.createElement(
							"div",
							{ className: "col-sm-12" },
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-primary", "data-toggle": "collapse", "data-target": "#codon_ratio_div" },
								"Show Codon Ratio Table"
							)
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Codon Translation Table"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							this.render_codon_translation_select()
						),
						React.createElement(
							"div",
							{ id: "codon_translation_div", className: "collapse col-sm-12" },
							this.render_codon_translation_table()
						),
						React.createElement(
							"div",
							{ className: "col-sm-12" },
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-primary", "data-toggle": "collapse", "data-target": "#codon_translation_div" },
								"Show Codon Translation Table"
							)
						)
					)
				);
			}
		}]);

		return CodonAnalyzer;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(CodonAnalyzer, null), mountingPoint);
});