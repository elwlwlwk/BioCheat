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
				codon_input: "",
				obs_exp_threshold: 0.6,
				GC_content_threshold: 0.5,
				scanning_window_size: 200
			};
			return _this;
		}

		_createClass(CpGIsland, [{
			key: "codon_textarea_changed",
			value: function codon_textarea_changed(e) {
				this.setState({
					codon_input: e.target.value,
					codon_seq: e.target.value.toUpperCase().replace(/[^ATUCG]/g, "").trim()

				});
			}
		}, {
			key: "FASTA_file_changed",
			value: function FASTA_file_changed(e) {
				var reader = new FileReader();
				reader.onload = function (e) {
					this.setState({
						codon_input: e.target.result.replace(/^>.+\n/, ""),
						codon_seq: e.target.result.replace(/^>.+\n/, "").toUpperCase().replace(/[^ATUCG]/g, "").trim()
					});
				}.bind(this);
				reader.readAsText(e.target.files[0]);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

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
							React.createElement("input", { className: "form-control", defaultValue: this.state.obs_exp_threshold })
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
							React.createElement("input", { className: "form-control", defaultValue: this.state.GC_content_threshold })
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
							React.createElement("input", { className: "form-control", defaultValue: this.state.scanning_window_size })
						)
					),
					React.createElement(
						"div",
						{ className: "col-sm-12" },
						React.createElement("textarea", { className: "form-control", rows: "10", onChange: function onChange(e) {
								return _this2.codon_textarea_changed(e);
							}, value: this.state.codon_input }),
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