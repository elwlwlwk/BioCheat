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
				GC_ratio: 50
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
						{ className: "col-sm-6" },
						React.createElement("input", { type: "range", step: "any", min: "0", max: "100", value: this.state.GC_ratio ? parseFloat(this.state.GC_ratio) : 0, onChange: function onChange(e) {
								return _this2.GC_ratio_changed(e);
							} })
					),
					React.createElement(
						"div",
						{ className: "col-sm-2" },
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
					)
				);
			}
		}]);

		return RandomBaseGenerator;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(RandomBaseGenerator, null), mountingPoint);
});