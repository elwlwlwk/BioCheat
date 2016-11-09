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
				scanning_window_size: 200
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
				var base_seq = e.target.result.replace(/^>.+\n/, "").toUpperCase().replace(/[^ATUCG]/g, "").trim().split("");

				reader.onload = function (e) {
					this.setState({
						base_input: e.target.result.replace(/^>.+\n/, ""),
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
					obs_exp_threshold: e.target.value
				});
			}
		}, {
			key: "gc_content_threshold_changed",
			value: function gc_content_threshold_changed(e) {
				this.setState({
					gc_content_threshold: e.target.value
				});
			}
		}, {
			key: "scanning_window_size_changed",
			value: function scanning_window_size_changed(e) {
				this.setState({
					scanngin_window_size: e.target.value
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
									e[0] - scanning_window_size
								),
								" to ",
								React.createElement(
									"b",
									null,
									e[0]
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
			key: "render",
			value: function render() {
				var _this3 = this;

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
									return _this3.obs_exp_threshold_changed(e);
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
									return _this3.gc_content_threshold_changed(e);
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
									return _this3.scanning_window_size_changed(e);
								}, defaultValue: this.state.scanning_window_size })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("textarea", { className: "form-control", rows: "10", onChange: function onChange(e) {
								return _this3.base_textarea_changed(e);
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
									return _this3.FASTA_file_changed(e);
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