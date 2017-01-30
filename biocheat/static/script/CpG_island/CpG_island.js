"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var CpGIsland = function (_React$Component) {
		_inherits(CpGIsland, _React$Component);

		function CpGIsland(props) {
			_classCallCheck(this, CpGIsland);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CpGIsland).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: [],
				obs_exp_threshold: 0.6,
				GC_content_threshold: 0.5,
				scanning_window_size: 200,
				highlight_CpG: true
			};
			return _this;
		}

		_createClass(CpGIsland, [{
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
					var base_input = e.target.result.replace(/^>.+/, "");
					var base_seq = base_input.toUpperCase().replace(/[^ATUCG]/g, "").trim().split("");
					this.setState({
						base_input: base_input,
						base_seq: base_seq
					});
				}.bind(this);
				reader.readAsText(e.target.files[0]);
			}
		}, {
			key: "detect_CpG_island",
			value: function detect_CpG_island() {
				var _this2 = this;

				var num_c = 0;
				var num_g = 0;
				var num_cg = 0;
				var scanning_window = [];

				var CpG_islands = [];

				this.state.base_seq.forEach(function (base, idx) {
					var prev_input = scanning_window.slice(-1);
					scanning_window.push(base);

					if (base == "C") {
						num_c++;
					} else if (base == "G") {
						num_g++;
					}
					if (prev_input == "C" && base == "G") {
						num_cg++;
					}

					if (scanning_window.length < _this2.state.scanning_window_size) {
						return;
					}

					if (scanning_window.length > _this2.state.scanning_window_size) {
						var base_to_loss = scanning_window.shift();
						if (base_to_loss == "C") {
							num_c--;
						}
						if (base_to_loss == "G") {
							num_g--;
						}
						if (base_to_loss == "C" && scanning_window[0] == "G") {
							num_cg--;
						}
					}

					var obs_exp = num_cg / (num_c * num_g / scanning_window.length);
					var GC_content = (num_c + num_g) / scanning_window.length;

					if (obs_exp > _this2.state.obs_exp_threshold && GC_content > _this2.state.GC_content_threshold) {
						CpG_islands.push([idx, obs_exp, GC_content]);
					}
				});
				return CpG_islands;
			}
		}, {
			key: "obs_exp_threshold_changed",
			value: function obs_exp_threshold_changed(e) {
				this.setState({
					obs_exp_threshold: parseFloat(e.target.value)
				});
			}
		}, {
			key: "gc_content_threshold_changed",
			value: function gc_content_threshold_changed(e) {
				this.setState({
					GC_content_threshold: parseFloat(e.target.value)
				});
			}
		}, {
			key: "scanning_window_size_changed",
			value: function scanning_window_size_changed(e) {
				this.setState({
					scanning_window_size: parseInt(e.target.value)
				});
			}
		}, {
			key: "render_CpG_islands",
			value: function render_CpG_islands(CpG_islands) {
				var scanning_window_size = this.state.scanning_window_size;
				return React.createElement(
					"div",
					{ id: "CpG_island_list_div", className: "collapse in" },
					React.createElement(
						"ul",
						{ className: "list-unstyled" },
						CpG_islands.map(function (e) {
							return React.createElement(
								"li",
								null,
								"CpG island at ",
								React.createElement(
									"b",
									null,
									e[0] - scanning_window_size + 2
								),
								" to ",
								React.createElement(
									"b",
									null,
									e[0] + 1
								),
								" (Obs/Exp=",
								e[1],
								", GC Content=",
								e[2],
								")"
							);
						})
					)
				);
			}
		}, {
			key: "render_CpG_island_graph",
			value: function render_CpG_island_graph(CpG_islands) {
				var _this3 = this;

				var divStyle = {
					fontFamily: "Courier, monospace"
				};
				var spanStyle = {
					CpG_island: {
						backgroundColor: 'yellow'
					},
					CpG_site: {
						color: 'red'
					},
					CpG_site_in_island: {
						color: 'red',
						backgroundColor: 'yellow'
					}
				};
				var island_site = CpG_islands.map(function (e) {
					return e[0] - _this3.state.scanning_window_size + 1;
				}).sort(function (a, b) {
					return a - b;
				});
				var CpG_site = function (base_seq) {
					var CpG_site = [];
					for (var i = 0; i < base_seq.length - 1; i++) {
						if (base_seq[i] == "C" && base_seq[i + 1] == "G") {
							CpG_site.push(i);
						}
					}
					return CpG_site.sort(function (a, b) {
						return a - b;
					});
				}(this.state.base_seq);

				var col_size = 50;
				var base_mat = function (base_seq, island_site, CpG_site, scanning_window_size) {
					var rows = [];
					var base_seq = base_seq.slice(0).map(function (base, idx) {
						var in_island = false;
						var in_CpG = false;
						for (var i = 0; i < island_site.length; i++) {
							if (idx >= island_site[i] && idx < island_site[i] + scanning_window_size) {
								in_island = true;
								break;
							}
						}
						for (var i = 0; i < CpG_site.length; i++) {
							if (idx >= CpG_site[i] && idx < CpG_site[i] + 2) {
								in_CpG = true;
								break;
							}
						}
						if (in_island && in_CpG) {
							return ['island_CpG', base];
						} else if (in_island) {
							return ['island', base];
						} else if (in_CpG) {
							return ['CpG', base];
						} else {
							return ['normal', base];
						}
					});
					var island_site = island_site.slice(0);

					while (base_seq.length != 0) {
						rows.push(base_seq.splice(0, col_size));
					}
					return rows;
				}(this.state.base_seq, island_site, CpG_site, this.state.scanning_window_size);

				return React.createElement(
					"div",
					{ style: divStyle },
					base_mat.map(function (row) {
						return React.createElement(
							"p",
							null,
							row.map(function (col) {
								switch (col[0]) {
									case "normal":
										return col[1];
									case "island":
										return React.createElement(
											"span",
											{ style: spanStyle['CpG_island'] },
											col[1]
										);
									case 'CpG':
										return React.createElement(
											"span",
											{ style: spanStyle['CpG_site'] },
											col[1]
										);
									case 'island_CpG':
										return React.createElement(
											"span",
											{ style: spanStyle['CpG_site_in_island'] },
											col[1]
										);
								}
							})
						);
					})
				);
			}
		}, {
			key: "render",
			value: function render() {
				var _this4 = this;

				var CpG_islands = this.detect_CpG_island();

				return React.createElement(
					"div",
					{ className: "col-sm-12" },
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Obs/Exp Threshold (0-1)"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							React.createElement("input", { className: "form-control", onChange: function onChange(e) {
									return _this4.obs_exp_threshold_changed(e);
								}, defaultValue: this.state.obs_exp_threshold })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"GC Content Threshold (0-1)"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							React.createElement("input", { className: "form-control", onChange: function onChange(e) {
									return _this4.gc_content_threshold_changed(e);
								}, defaultValue: this.state.GC_content_threshold })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12 form-group" },
						React.createElement(
							"label",
							{ className: "col-sm-3" },
							"Scanning Window Size (bp)"
						),
						React.createElement(
							"div",
							{ className: "col-sm-4" },
							React.createElement("input", { className: "form-control", onChange: function onChange(e) {
									return _this4.scanning_window_size_changed(e);
								}, defaultValue: this.state.scanning_window_size })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("textarea", { className: "form-control", rows: "10", onChange: function onChange(e) {
								return _this4.base_textarea_changed(e);
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
									return _this4.FASTA_file_changed(e);
								} })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement(
							"div",
							null,
							React.createElement(
								"button",
								{ type: "button", className: "btn btn-primary", "data-toggle": "collapse", "data-target": "#CpG_island_list_div" },
								"Fold CpG Island List"
							)
						),
						this.render_CpG_islands(CpG_islands)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("div", null),
						this.render_CpG_island_graph(CpG_islands)
					)
				);
			}
		}]);

		return CpGIsland;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(CpGIsland, null), mountingPoint);
});