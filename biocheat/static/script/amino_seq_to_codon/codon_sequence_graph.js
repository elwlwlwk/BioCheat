"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CodonSequence = function (_React$Component) {
	_inherits(CodonSequence, _React$Component);

	function CodonSequence(props) {
		_classCallCheck(this, CodonSequence);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CodonSequence).call(this, props));

		_this.state = {
			row_size: 40,
			codon_row_size: 15,
			col_size: 45,
			col: 20,
			padding: 30,
			top_padding: 50,
			render_probability: true
		};

		_this.codon_seq = [];
		return _this;
	}

	_createClass(CodonSequence, [{
		key: "render_amino_seq",
		value: function render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index) {
			var render_codons = function () {
				var _this2 = this;

				switch (this.props.render_manner) {
					case "show_all":
						return usage_table[amino] ? usage_table[amino].sort(function (a, b) {
							return parseFloat(selected_adaptation_index[b]) - parseFloat(selected_adaptation_index[a]);
						}).map(function (codon, codon_idx) {
							return React.createElement(
								"g",
								null,
								React.createElement(
									"text",
									{ x: xScale(idx % _this2.state.col), y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "10", fontFamily: "Courier, monospace" },
									codon
								),
								React.createElement(
									"text",
									{ x: xScale(idx % _this2.state.col) + 20, y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "8", fontFamily: "Courier, monospace" },
									parseInt(selected_adaptation_index[codon]) && _this2.state.render_probability ? parseInt(selected_adaptation_index[codon]) + "%" : null
								)
							);
						}) : null;
					case "highest":
						return usage_table[amino] ? usage_table[amino].sort(function (a, b) {
							return parseFloat(selected_adaptation_index[b]) - parseFloat(selected_adaptation_index[a]);
						}).slice(0, 1).map(function (codon, codon_idx) {
							_this2.codon_seq.push(codon);
							return React.createElement(
								"g",
								null,
								React.createElement(
									"text",
									{ x: xScale(idx % _this2.state.col), y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "10", fontFamily: "Courier, monospace" },
									codon
								),
								React.createElement(
									"text",
									{ x: xScale(idx % _this2.state.col) + 20, y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "8", fontFamily: "Courier, monospace" },
									parseInt(selected_adaptation_index[codon]) && _this2.state.render_probability ? parseInt(selected_adaptation_index[codon]) + "%" : null
								)
							);
						}) : null;
					case "consider":
						var select_codon = function select_codon(codons) {
							var random = Math.random() * 100;
							var cursor = 0;
							var selected = "";
							for (var i = 0; i < codons.length; i++) {
								cursor += parseFloat(selected_adaptation_index[codons[i]]);
								selected = codons[i];
								if (random < cursor) {
									break;
								}
							}
							return [selected];
						};
						return usage_table[amino] ? select_codon(usage_table[amino]).map(function (codon, codon_idx) {
							_this2.codon_seq.push(codon);
							return React.createElement(
								"g",
								null,
								React.createElement(
									"text",
									{ key: "codon_" + idx + "_" + codon_idx, x: xScale(idx % _this2.state.col), y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "10", fontFamily: "Courier, monospace" },
									codon
								),
								React.createElement(
									"text",
									{ key: "proba_" + idx + "_" + codon_idx, x: xScale(idx % _this2.state.col) + 20, y: yScale(Math.floor(idx / _this2.state.col)) + (codon_idx + 1) * 15, fontSize: "8", fontFamily: "Courier, monospace" },
									parseInt(selected_adaptation_index[codon]) && _this2.state.render_probability ? parseInt(selected_adaptation_index[codon]) + "%" : null
								)
							);
						}) : null;
				}
			}.bind(this);
			return React.createElement(
				"g",
				{ key: "amino_g_" + idx },
				React.createElement(
					"text",
					{ key: "amino_" + idx, x: xScale(idx % this.state.col), y: yScale(Math.floor(idx / this.state.col)), fontSize: "10", fontFamily: "Courier, monospace" },
					amino
				),
				render_codons()
			);
		}
	}, {
		key: "render_probability_changed",
		value: function render_probability_changed(e) {
			this.setState({
				render_probability: e.target.checked
			});
		}
	}, {
		key: "FASTA_download",
		value: function FASTA_download(e) {
			var file = new File([">" + this.props.codon_ratio_organism + " amino acid sequence to codon sequence\n", this.codon_seq.join("")], "amino_seq_to_codon.fna", { type: "text/plain" });
			saveAs(file);
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			this.codon_seq = [];
			var usage_table = {
				Ala: [],
				Arg: [],
				Asn: [],
				Asp: [],
				Cys: [],
				Gln: [],
				Glu: [],
				Gly: [],
				His: [],
				Ile: [],
				Leu: [],
				Lys: [],
				Met: [],
				Phe: [],
				Pro: [],
				Ser: [],
				Ter: [],
				Thr: [],
				Trp: [],
				Tyr: [],
				Val: []
			};
			Object.keys(this.props.codon_translation).map(function (key) {
				usage_table[_this3.props.codon_translation[key]] = usage_table[_this3.props.codon_translation[key]].concat(key).sort();
			});

			var selected_adaptation_index = {};
			Object.keys(usage_table).map(function (amino) {
				var _this4 = this;

				var codons = usage_table[amino];
				var indexScale = d3.scaleLinear().domain([0, [0].concat(codons.map(function (codon) {
					return parseFloat(_this4.props.codon_ratio.get(codon));
				})).reduce(function (a, b) {
					return a + b;
				})]).range([0, 100]);
				codons.forEach(function (codon) {
					selected_adaptation_index[codon] = indexScale(parseFloat(this.props.codon_ratio.get(codon)) ? parseFloat(this.props.codon_ratio.get(codon)) : 0);
				}.bind(this));
			}.bind(this));

			var width = this.state.col_size * this.state.col + this.state.padding * 2;
			var row_cnt = this.props.amino_seq.length ? Math.floor((this.props.amino_seq.length - 1) / this.state.col) + 1 : 0;
			if (this.props.render_manner == "show_all") {
				var height = row_cnt * (this.state.row_size + d3.max(Object.keys(usage_table).map(function (key) {
					return usage_table[key].length;
				})) * this.state.codon_row_size) + this.state.padding + this.state.top_padding;
			} else {
				var height = row_cnt * this.state.row_size + this.state.padding + this.state.top_padding;
			}

			var xScale = d3.scaleLinear().domain([0, this.state.col]).range([this.state.padding, width - this.state.padding]);
			var yScale = d3.scaleLinear().domain([0, row_cnt]).range([this.state.top_padding, height - this.state.padding]);

			var axis_renderer = function (x) {
				return React.createElement(
					"text",
					{ key: "axis_" + x, x: xScale(x) - 30, y: this.state.top_padding - 15, fontSize: "10", fontFamily: "monospace" },
					x
				);
			}.bind(this);

			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ className: "form-group" },
					React.createElement("input", { type: "checkbox", onChange: function onChange(e) {
							return _this3.render_probability_changed(e);
						}, checked: this.state.render_probability }),
					"Render Probability"
				),
				React.createElement(
					"svg",
					{ width: width, height: height },
					[5, 10, 15, 20].map(function (x) {
						return axis_renderer(x);
					}),
					this.props.amino_seq.map(function (amino, idx) {
						return _this3.render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index);
					})
				),
				React.createElement("br", null),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-default", onClick: function onClick(e) {
							return _this3.FASTA_download(e);
						} },
					"Download As FASTA Format"
				)
			);
		}
	}]);

	return CodonSequence;
}(React.Component);