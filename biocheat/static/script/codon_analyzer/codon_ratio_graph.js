"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CodonRatio = function (_React$Component) {
	_inherits(CodonRatio, _React$Component);

	function CodonRatio(props) {
		_classCallCheck(this, CodonRatio);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CodonRatio).call(this, props));

		_this.state = {
			col: 4,
			col_size: 160,
			row_size: 40,
			padding: 30,
			upper_padding: 60
		};
		return _this;
	}

	_createClass(CodonRatio, [{
		key: "render_codon_ratio",
		value: function render_codon_ratio(codon, idx, xScale, yScale, ratioScale, codon_ratio) {
			return React.createElement(
				"g",
				null,
				React.createElement(
					"text",
					{ x: xScale(idx % this.state.col), y: yScale(Math.floor(idx / this.state.col)), fontSize: "10" },
					codon
				),
				React.createElement("rect", { x: xScale(idx % this.state.col) + 25, y: yScale(Math.floor(idx / this.state.col)) - 15, height: "10", width: ratioScale(codon_ratio.get(codon)), fill: "steelblue" }),
				React.createElement("rect", { x: xScale(idx % this.state.col) + 25, y: yScale(Math.floor(idx / this.state.col)) - 3, height: "10", width: ratioScale(this.props.codon_ratio.get(codon)) }),
				React.createElement(
					"text",
					{ x: xScale(idx % this.state.col) + this.state.col_size - 40, y: yScale(Math.floor(idx / this.state.col)) - 6, fontSize: "10" },
					codon_ratio.get(codon) ? codon_ratio.get(codon) : 0 .toFixed(3)
				),
				React.createElement(
					"text",
					{ x: xScale(idx % this.state.col) + this.state.col_size - 40, y: yScale(Math.floor(idx / this.state.col)) + 6, fontSize: "10" },
					this.props.codon_ratio.get(codon) ? this.props.codon_ratio.get(codon) : 0 .toFixed(3)
				)
			);
		}
	}, {
		key: "calc_codon_ratio",
		value: function calc_codon_ratio() {
			var codon_count = new Map();
			var codon_ratio = new Map();
			var codon_total = 0;
			this.props.codon_seq.map(function (codon) {
				if (codon.join("").length != 3) return;
				if (!codon_count.get(codon.join(""))) codon_count.set(codon.join(""), 0);
				codon_count.set(codon.join(""), codon_count.get(codon.join("")) + 1);
			});

			if (this.props.codon_seq.length) codon_total = this.props.codon_seq.slice(-1)[0].length < 3 ? this.props.codon_seq.length - 1 : this.props.codon_seq.length;

			codon_count.forEach(function (val, key) {
				codon_ratio.set(key, (val / codon_total * 1000).toFixed(3));
			});

			return codon_ratio;
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var base_set = ["U", "C", "A", "G"];
			var base_combi = [];

			base_set.forEach(function (i) {
				base_set.forEach(function (j) {
					base_set.forEach(function (k) {
						base_combi.push(i + j + k);
					});
				});
			});

			var codon_ratio = this.calc_codon_ratio();

			var width = this.state.col_size * this.state.col + this.state.padding * 2;
			var height = this.state.row_size * Math.floor((base_combi.length - 1) / this.state.col) + this.state.padding + this.state.upper_padding;

			var xScale = d3.scaleLinear().domain([0, this.state.col]).range([this.state.padding, width - this.state.padding]);
			var yScale = d3.scaleLinear().domain([0, Math.floor((base_combi.length - 1) / this.state.col)]).range([this.state.upper_padding, height - this.state.padding]);
			var ratioScale = d3.scaleLinear().domain([0, d3.max(Array.from(codon_ratio.values()).concat(Array.from(this.props.codon_ratio.values())).map(function (d) {
				return parseFloat(d);
			}))]).range([0, this.state.col_size - 70]);

			return React.createElement(
				"svg",
				{ width: width, height: height },
				React.createElement(
					"text",
					{ x: width / 2 - 60, y: 20 },
					"Codon Ratio"
				),
				React.createElement(
					"text",
					{ x: width - 80, y: 30, fontSize: "10" },
					"(\u2030)"
				),
				base_combi.map(function (codon, idx) {
					return _this2.render_codon_ratio(codon, idx, xScale, yScale, ratioScale, codon_ratio);
				})
			);
		}
	}]);

	return CodonRatio;
}(React.Component);