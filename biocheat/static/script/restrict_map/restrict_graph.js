"use strict";

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
			var frag_padding = d3.min(this.props.markers.filter(function (marker) {
				return cols.has(marker[0]);
			}), function (d) {
				return d[2];
			}) / 3;
			cols.forEach(function (col) {
				return col_length.push(_this2.props.markers.filter(function (marker) {
					return marker[0] == col;
				}).map(function (marker) {
					return Math.round(parseFloat(marker[2]));
				}).reduce(function (a, b) {
					return a + b;
				}) + (_this2.props.markers.filter(function (marker) {
					return marker[0] == col;
				}).length - 1) * frag_padding);
			});

			var height = this.props.row_padding * cols.size + this.props.padding * 2;

			var xScale = d3.scaleLinear().domain([0, d3.max(col_length)]).range([this.props.padding, this.props.width - this.props.padding]);
			var yScale = d3.scaleLinear().domain([d3.min([].concat(_toConsumableArray(cols))), d3.max([].concat(_toConsumableArray(cols)))]).range([this.props.padding, this.height - this.props.padding]);

			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					null,
					React.createElement("svg", { width: this.props.width, height: height })
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