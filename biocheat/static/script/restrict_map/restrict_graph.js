"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RestrictGraph = function (_React$Component) {
	_inherits(RestrictGraph, _React$Component);

	function RestrictGraph(props) {
		_classCallCheck(this, RestrictGraph);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RestrictGraph).call(this, props));
	}

	_createClass(RestrictGraph, [{
		key: "render",
		value: function render() {
			var _this2 = this;

			var col_length = [];
			var cols = new Set(this.props.markers.map(function (marker) {
				return marker[0];
			}));
			if (this.props.exclude_ladder) {
				cols.delete(0);
			}
			var frag_padding = 20;
			cols.forEach(function (col) {
				return col_length.push(_this2.props.markers.filter(function (marker) {
					return marker[0] == col;
				}).map(function (marker) {
					return Math.round(parseFloat(marker[2]));
				}).reduce(function (a, b) {
					return a + b;
				}));
			});

			var height = this.props.row_padding * cols.size + this.props.padding * 2;
			var fragScale = d3.scaleLinear().domain([0, d3.max(col_length)]).range([0, this.props.width - this.props.padding * 2 - frag_padding * d3.max([].concat(_toConsumableArray(cols)).map(function (col) {
				return _this2.props.markers.filter(function (marker) {
					return marker[0] == col;
				});
			}), function (col) {
				return col.length;
			})]);
			var yScale = d3.scaleLinear().domain([d3.min([].concat(_toConsumableArray(cols))), d3.max([].concat(_toConsumableArray(cols)))]).range([this.props.padding, height - this.props.padding]);

			var scale = { fragScale: fragScale, yScale: yScale };

			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					null,
					React.createElement(
						"svg",
						{ width: this.props.width, height: height },
						React.createElement(FragmentGraph, _extends({}, this.props, scale, { cols: cols, frag_padding: frag_padding }))
					)
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"svg",
						null,
						React.createElement(LinearDNA, null)
					)
				)
			);
		}
	}]);

	return RestrictGraph;
}(React.Component);

var FragmentGraph = function (_React$Component2) {
	_inherits(FragmentGraph, _React$Component2);

	function FragmentGraph() {
		_classCallCheck(this, FragmentGraph);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(FragmentGraph).apply(this, arguments));
	}

	_createClass(FragmentGraph, [{
		key: "renderFragment",
		value: function renderFragment(marker, idx, row) {
			var x = this.props.fragScale([0].concat(row.slice(0, idx).map(function (mark) {
				return mark[2];
			})).reduce(function (a, b) {
				return a + b;
			})) + this.props.frag_padding * idx + parseInt(this.props.padding);
			return React.createElement("rect", { width: this.props.fragScale(marker[2]), height: "2", x: x, y: this.props.yScale(marker[0]), key: idx });
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var markers = this.props.markers.filter(function (marker) {
				return _this4.props.cols.has(marker[0]);
			});
			return React.createElement(
				"g",
				null,
				[].concat(_toConsumableArray(this.props.cols)).map(function (col) {
					return _this4.props.markers.filter(function (marker) {
						return marker[0] == col;
					});
				}).map(function (row) {
					return row.map(function (marker, idx) {
						return _this4.renderFragment(marker, idx, row);
					});
				})
			);
		}
	}]);

	return FragmentGraph;
}(React.Component);