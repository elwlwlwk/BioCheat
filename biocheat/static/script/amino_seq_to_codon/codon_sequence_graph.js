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
			top_padding: 50
		};
		return _this;
	}

	_createClass(CodonSequence, [{
		key: "render_amino_seq",
		value: function render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index) {
			var _this2 = this;

			return React.createElement(
				"g",
				null,
				React.createElement(
					"text",
					{ x: xScale(idx % this.state.col), y: yScale(Math.floor(idx / this.state.col)), fontSize: "10", fontFamily: "Courier, monospace" },
					amino
				),
				usage_table[amino] ? usage_table[amino].sort(function (a, b) {
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
							parseInt(selected_adaptation_index[codon]) ? parseInt(selected_adaptation_index[codon]) + "%" : null
						)
					);
				}) : null
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

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
			var height = row_cnt * (this.state.row_size + d3.max(Object.keys(usage_table).map(function (key) {
				return usage_table[key].length;
			})) * this.state.codon_row_size) + this.state.padding + this.state.top_padding;

			var xScale = d3.scaleLinear().domain([0, this.state.col]).range([this.state.padding, width - this.state.padding]);
			var yScale = d3.scaleLinear().domain([0, row_cnt]).range([this.state.top_padding, height - this.state.padding]);

			var axis_renderer = function (x) {
				return React.createElement(
					"text",
					{ x: xScale(x) - 30, y: this.state.top_padding - 15, fontSize: "10", fontFamily: "monospace" },
					x
				);
			}.bind(this);

			return React.createElement(
				"svg",
				{ width: width, height: height },
				[5, 10, 15, 20].map(function (x) {
					return axis_renderer(x);
				}),
				this.props.amino_seq.map(function (amino, idx) {
					return _this3.render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index);
				})
			);
		}
	}]);

	return CodonSequence;
}(React.Component);