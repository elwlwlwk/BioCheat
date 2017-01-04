"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var ZCurve = function (_React$Component) {
		_inherits(ZCurve, _React$Component);

		function ZCurve(props) {
			_classCallCheck(this, ZCurve);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ZCurve).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: []
			};
			return _this;
		}

		_createClass(ZCurve, [{
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
			key: "calc_z_curve",
			value: function calc_z_curve(base_seq) {}
		}, {
			key: "draw_z_curve_graph",
			value: function draw_z_curve_graph(z_curve) {}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var z_curve = this.calc_z_curve(this.state.base_seq);
				return React.createElement(
					"div",
					{ className: "col-sm-12" },
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
						this.draw_z_curve_graph(z_curve)
					)
				);
			}
		}]);

		return ZCurve;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(ZCurve, null), mountingPoint);
});