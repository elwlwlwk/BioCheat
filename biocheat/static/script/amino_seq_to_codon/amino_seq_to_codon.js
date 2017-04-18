"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs(["static/script/amino_seq_to_codon/codon_sequence_graph.js", "static/FileSaver.js"], function () {
	var AminoToCodon = function (_React$Component) {
		_inherits(AminoToCodon, _React$Component);

		function AminoToCodon(props) {
			_classCallCheck(this, AminoToCodon);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AminoToCodon).call(this, props));

			_this.state = {
				codon_ratio_organism: "",
				codon_ratio: new Map(),
				codon_translation_organism: "Standard",
				codon_translation: new Map(),
				codon_translation_list: [],
				codon_seq: [],
				amino_seq: [],
				suggest_ratio_list: [],
				amino_input_format: "3_letter",
				amino_seq_input: "",
				render_manner: "consider"
			};
			return _this;
		}

		_createClass(AminoToCodon, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this2 = this;

				fetch('/api/codon_translation_list').then(function (r) {
					return r.json();
				}).then(function (r) {
					_this2.setState({
						codon_translation_list: r
					});
				});

				fetch('/api/codon_translation?organism=' + this.state.codon_translation_organism).then(function (r) {
					return r.json();
				}).then(function (r) {
					_this2.setState({
						codon_translation: r
					});
				});
			}
		}, {
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				this.serverRequest.abort();
			}
		}, {
			key: "render_codon_ratio_select",
			value: function render_codon_ratio_select() {
				var _this3 = this;

				return React.createElement(
					"div",
					null,
					React.createElement("input", { className: "form-control", placeholder: "Input Organism", onChange: function onChange(e) {
							return _this3.codon_ratio_select_changed(e);
						}, list: "suggest_ratio_list" }),
					React.createElement(
						"datalist",
						{ id: "suggest_ratio_list" },
						this.state.suggest_ratio_list.map(function (elem) {
							return React.createElement("option", { value: elem });
						})
					)
				);
			}
		}, {
			key: "render_codon_ratio_table",
			value: function render_codon_ratio_table() {
				var _this4 = this;

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
							return render_base_combi(combi_set, _this4);
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
				var _this5 = this;

				return React.createElement(
					"select",
					{ className: "form-control", defaultValue: this.state.codon_translation_organism, onChange: function onChange(e) {
							return _this5.codon_translation_select_changed(e);
						} },
					this.state.codon_translation_list.map(function (org) {
						return React.createElement(
							"option",
							{ value: org },
							org
						);
					})
				);
			}
		}, {
			key: "render_codon_translation_table",
			value: function render_codon_translation_table() {
				var _this6 = this;

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
								}, value: react_this.state.codon_translation[base_set[0]] })
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
								}, value: react_this.state.codon_translation[base_set[1]] })
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
								}, value: react_this.state.codon_translation[base_set[2]] })
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
								}, value: react_this.state.codon_translation[base_set[3]] })
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
							return render_base_combi(combi_set, _this6);
						})
					)
				);
			}
		}, {
			key: "translation_table_changed",
			value: function translation_table_changed(e, codon) {
				var codon_translation = this.state.codon_translation;
				codon_translation[codon] = e.target.value;
				this.setState({
					codon_translation: codon_translation
				});
			}
		}, {
			key: "codon_ratio_select_changed",
			value: function codon_ratio_select_changed(e) {
				var _this7 = this;

				if (e.target.value.length < 3) return;
				fetch('/api/spsum_list?organism=' + e.target.value).then(function (r) {
					return r.json();
				}).then(function (r) {
					_this7.setState({
						suggest_ratio_list: r
					});
				});

				fetch('/api/spsum?organism=' + e.target.value).then(function (r) {
					return r.json();
				}).then(function (r) {
					if (!r) return;
					var codon_label = ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
					var spsum = r["spsum"].trim().split(" ").map(function (d) {
						return parseInt(d);
					});
					var codon_total = spsum.reduce(function (a, b) {
						return a + b;
					});
					_this7.setState({
						codon_ratio_organism: r["organism"],
						codon_ratio: new Map(d3.zip(codon_label, spsum.map(function (d) {
							return (1000 * d / codon_total).toFixed(3);
						})))
					});
				});
			}
		}, {
			key: "codon_translation_select_changed",
			value: function codon_translation_select_changed(e) {
				var _this8 = this;

				fetch('/api/codon_translation?organism=' + e.target.value).then(function (r) {
					return r.json();
				}).then(function (r) {
					var codon_translation = r;
					var amino_seq = _this8.state.codon_seq.map(function (codon) {
						return codon_translation[codon.reduce(function (a, b) {
							return a + b;
						})];
					});
					_this8.setState({
						codon_translation: codon_translation
					});
				});
				this.setState({
					codon_translation_organism: e.target.value
				});
			}
		}, {
			key: "amino_seq_textarea_changed",
			value: function amino_seq_textarea_changed(e) {
				var amino_seq;
				if (this.state.amino_input_format == "1_letter") {
					var FASTA_amino_map = { "A": "Ala", "C": "Cys", "D": "Asp", "E": "Glu", "F": "Phe", "G": "Gly", "H": "His", "I": "Ile", "K": "Lys", "L": "Leu", "M": "Met", "N": "Asn", "P": "Pro", "Q": "Gln", "R": "Arg", "S": "Ser", "T": "Thr", "V": "Val", "W": "Trp", "Y": "Tyr", "Z": "Ter" };
					amino_seq = e.target.value.trim().toUpperCase().replace(/[^A-Z]/g, "").split("").map(function (letter) {
						return FASTA_amino_map[letter] ? FASTA_amino_map[letter] : letter;
					});
				} else {
					amino_seq = e.target.value.trim().toUpperCase().replace(/[^A-Z]/g, "").match(/.{1,3}/g).map(function (amino) {
						return amino[0] + amino.slice(1, 3).toLowerCase();
					});
				}
				this.setState({
					amino_seq: amino_seq,
					amino_seq_input: e.target.value
				});
			}
		}, {
			key: "amino_input_format_changed",
			value: function amino_input_format_changed(e) {
				var amino_seq;
				if (e.target.value == "1_letter") {
					var FASTA_amino_map = { "A": "Ala", "C": "Cys", "D": "Asp", "E": "Glu", "F": "Phe", "G": "Gly", "H": "His", "I": "Ile", "K": "Lys", "L": "Leu", "M": "Met", "N": "Asn", "P": "Pro", "Q": "Gln", "R": "Arg", "S": "Ser", "T": "Thr", "V": "Val", "W": "Trp", "Y": "Tyr", "Z": "Ter" };
					amino_seq = this.state.amino_seq_input.trim().toUpperCase().replace(/[^A-Z]/g, "").split("").map(function (letter) {
						return FASTA_amino_map[letter] ? FASTA_amino_map[letter] : letter;
					});
				} else {
					amino_seq = this.state.amino_seq_input.trim().toUpperCase().replace(/[^A-Z]/g, "").match(/.{1,3}/g).map(function (amino) {
						return amino[0] + amino.slice(1, 3).toLowerCase();
					});
				}
				this.setState({
					amino_seq: amino_seq,
					amino_input_format: e.target.value
				});
			}
		}, {
			key: "FASTA_file_changed",
			value: function FASTA_file_changed(e) {
				var reader = new FileReader();
				reader.onload = function (e) {
					var FASTA_amino_map = { "A": "Ala", "C": "Cys", "D": "Asp", "E": "Glu", "F": "Phe", "G": "Gly", "H": "His", "I": "Ile", "K": "Lys", "L": "Leu", "M": "Met", "N": "Asn", "P": "Pro", "Q": "Gln", "R": "Arg", "S": "Ser", "T": "Thr", "V": "Val", "W": "Trp", "Y": "Tyr", "Z": "Ter" };
					this.setState({
						amino_seq_input: e.target.result.replace(/^>.+/, "").trim(),
						amino_seq: e.target.result.replace(/^>.+/, "").trim().toUpperCase().replace(/[^A-Z]/g, "").split("").map(function (letter) {
							return FASTA_amino_map[letter] ? FASTA_amino_map[letter] : letter;
						}),
						amino_input_format: "1_letter"
					});
				}.bind(this);
				reader.readAsText(e.target.files[0]);
			}
		}, {
			key: "render_manner_changed",
			value: function render_manner_changed(e) {
				this.setState({
					render_manner: e.target.value
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this9 = this;

				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Codon Ratio Table (\u2030)"
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
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement(
							"div",
							{ className: "col-sm-3" },
							React.createElement(
								"select",
								{ className: "form-control", value: this.state.amino_input_format, onChange: function onChange(e) {
										return _this9.amino_input_format_changed(e);
									} },
								React.createElement(
									"option",
									{ value: "3_letter" },
									" 3 letter format "
								),
								React.createElement(
									"option",
									{ value: "1_letter" },
									" 1 letter format "
								)
							)
						),
						React.createElement("textarea", { className: "form-control", rows: "10", onChange: function onChange(e) {
								return _this9.amino_seq_textarea_changed(e);
							}, value: this.state.amino_seq_input }),
						React.createElement(
							"div",
							{ className: "form_group" },
							React.createElement(
								"label",
								null,
								"Upload FASTA file"
							),
							React.createElement("input", { type: "file", onChange: function onChange(e) {
									return _this9.FASTA_file_changed(e);
								} })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Convert Manner"
						),
						React.createElement(
							"div",
							{ className: "col-sm-3" },
							React.createElement(
								"select",
								{ className: "form-control", value: this.state.render_manner, onChange: function onChange(e) {
										return _this9.render_manner_changed(e);
									} },
								React.createElement(
									"option",
									{ value: "consider" },
									" Consider Adaption Index "
								),
								React.createElement(
									"option",
									{ value: "highest" },
									" Highest Adaption Index only "
								),
								React.createElement(
									"option",
									{ value: "show_all" },
									" Show All Probability "
								)
							)
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement(CodonSequence, this.state)
					)
				);
			}
		}]);

		return AminoToCodon;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(AminoToCodon, null), mountingPoint);
});