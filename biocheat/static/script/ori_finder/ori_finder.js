"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

requirejs([], function () {
	var OriFinder = function (_React$Component) {
		_inherits(OriFinder, _React$Component);

		function OriFinder(props) {
			_classCallCheck(this, OriFinder);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(OriFinder).call(this, props));

			_this.state = {
				base_input: "",
				base_seq: []
			};
			return _this;
		}

		_createClass(OriFinder, [{
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
			key: "calc_gc_skew",
			value: function calc_gc_skew(base_seq) {
				var gc_skew = [0];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = base_seq[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var base = _step.value;

						switch (base) {
							case "G":
								gc_skew.push(gc_skew.slice(-1)[0] + 1);
								break;
							case "C":
								gc_skew.push(gc_skew.slice(-1)[0] - 1);
								break;
							default:
								gc_skew.push(gc_skew.slice(-1)[0]);
								break;
						}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return gc_skew;
			}
		}, {
			key: "draw_skew_graph",
			value: function draw_skew_graph(gc_skew) {
				var height = 500;
				var width = 720;
				var padding = 30;

				var xScale = d3.scaleLinear().domain([0, gc_skew.length]).range([padding, width - padding]);
				var yScale = d3.scaleLinear().domain([d3.max(gc_skew), d3.min(gc_skew)]).range([padding, height - padding]);

				var line_data = [];
				for (var idx in gc_skew) {
					line_data.push({ pos: xScale(idx), skew: yScale(gc_skew[idx]) });
				}

				var valueline = d3.line().x(function (e) {
					return e.pos;
				}).y(function (e) {
					return e.skew;
				});
				var path_d = valueline(line_data);

				return React.createElement(
					"svg",
					{ height: height, width: width },
					React.createElement("path", { d: path_d, stroke: "black", strokeWidth: 2, fill: "none" })
				);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var gc_skew = this.calc_gc_skew(this.state.base_seq);
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
						this.draw_skew_graph(gc_skew)
					)
				);
			}
		}]);

		return OriFinder;
	}(React.Component);

	var mountingPoint = document.createElement('div');
	mountingPoint.className = 'react-app';
	document.getElementById("div_application").appendChild(mountingPoint);
	ReactDOM.render(React.createElement(OriFinder, null), mountingPoint);
});