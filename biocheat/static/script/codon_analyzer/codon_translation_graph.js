"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CodonTranslation = function (_React$Component) {
	_inherits(CodonTranslation, _React$Component);

	function CodonTranslation(props) {
		_classCallCheck(this, CodonTranslation);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CodonTranslation).call(this, props));

		_this.state = {
			amino_FASTA_map: {
				ala: "A", cys: "C", asp: "D", glu: "E", phe: "F", gly: "G", his: "H", ile: "I", lys: "K",
				leu: "L", met: "M", asn: "N", pro: "P", gln: "Q", arg: "R", ser: "S", thr: "T", val: "V", trp: "W", tyr: "Y",
				ter: "Z"
			}
		};
		return _this;
	}

	_createClass(CodonTranslation, [{
		key: "render_codon_translation",
		value: function render_codon_translation(xScale, yScale, col) {
			function codon_renderer(codon, idx) {
				return React.createElement(
					"text",
					{ fontSize: "10", x: xScale(idx % col), y: yScale(Math.floor(idx / col)), fontFamily: "Courier New, Courier, monospace" },
					codon
				);
			}
			function amino_renderer(amino, idx) {
				return React.createElement(
					"text",
					{ fontSize: "10", x: xScale(idx % col), y: yScale(Math.floor(idx / col)) + 10, fontFamily: "Courier New, Courier, monospace" },
					amino
				);
			}
			function axis_renderer(x) {
				return React.createElement(
					"text",
					{ x: xScale(x) - 10, y: "10", fontSize: "10", fontFamily: "monospace" },
					x
				);
			}
			return React.createElement(
				"g",
				null,
				[5, 10, 15, 20, 25].map(function (x) {
					return axis_renderer(x);
				}),
				React.createElement(
					"text",
					{ x: "10", y: yScale(0), fontSize: "10", fontFamily: "monospace" },
					"5'-"
				),
				this.props.codon_seq.map(function (codon, idx) {
					return codon_renderer(codon, idx);
				}),
				this.props.amino_seq.map(function (amino, idx) {
					return amino_renderer(amino, idx);
				}),
				React.createElement(
					"text",
					{ x: xScale(25), y: d3.max([yScale(Math.floor((this.props.codon_seq.length - 1) / col)), yScale(0)]), fontSize: "10", fontFamily: "monospace" },
					"-3'"
				)
			);
		}
	}, {
		key: "translated_FASTA_download",
		value: function translated_FASTA_download(e) {
			var _this2 = this;

			var amino_seq_FASTA = this.props.amino_seq.map(function (amino) {
				return _this2.state.amino_FASTA_map[amino.toLowerCase()] ? _this2.state.amino_FASTA_map[amino.toLowerCase()] : "";
			}).join("");
			var file = new File([">" + this.props.codon_translation_organism + " translation table\n", amino_seq_FASTA], "codon_translation.faa", { type: "text/plain" });
			saveAs(file);
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var col = 25;
			var col_size = 25;
			var padding = 30;
			var width = col * col_size + padding * 2;
			var height = Math.floor((this.props.codon_seq.length - 1) / col) * 30 + padding * 2;

			var xScale = d3.scaleLinear().domain([0, col]).range([padding, width - padding]);
			var yScale = d3.scaleLinear().domain([0, Math.floor((this.props.codon_seq.length - 1) / col)]).range([padding, height - padding]);
			return React.createElement(
				"div",
				{ className: "col-sm-12" },
				React.createElement(
					"svg",
					{ width: width, height: height },
					this.render_codon_translation(xScale, yScale, col)
				),
				React.createElement("br", null),
				React.createElement(
					"button",
					{ type: "button", className: "btn btn-default", onClick: function onClick(e) {
							return _this3.translated_FASTA_download(e);
						} },
					"Download Translation FASTA Format"
				)
			);
		}
	}]);

	return CodonTranslation;
}(React.Component);