class RegressionGraph extends React.Component{
	gen_path(method, result, points, xScale, yScale){
		var equation= result.regression_result.equation;
		switch(method){
			case "power":
				var M= "M"+ xScale(d3.max(points, (d) => d[0])/100)+ ","+ yScale(equation[0]* Math.pow(d3.max(points, (d) => d[0])/100, equation[1]));
				var L= "";
				for(var i=1; i<50; i++){
					var x= d3.max(points, (d) => d[0])/50*i;
					var y= equation[0]* Math.pow(x, equation[1]);
					L+="L"+xScale(x)+","+yScale(y);
				}
				return M+L;
			case "logarithmic":
				var M= "M"+ xScale(d3.max(points, (d) => d[0])/100)+ ","+ yScale(equation[0]* d3.max(points, (d) => d[0])/100 + equation[1]);
				var L= "";
				for(var i=1; i<50; i++){
					var x= d3.max(points, (d) => d[0])/50*i;
					var y= equation[0]* x+ equation[1];
					L+="L"+xScale(x)+","+yScale(y);
				}
				return M+L;
			case "linear":
				var M= "M"+ xScale(d3.max(points, (d) => d[0])/100)+ ","+ yScale(equation[0]* d3.max(points, (d) => d[0])/100 + equation[1]);
				var L= "";
				for(var i=1; i<50; i++){
					var x= d3.max(points, (d) => d[0])/50*i;
					var y= equation[0]* x+ equation[1];
					if(y<0){
						break;
					}
					L+="L"+xScale(x)+","+yScale(y);
				}
				return M+L;
		}
	}

	power_graph(){
		var known_points= this.props.orig_input.markers.filter( (m) => m[2] ).map( (m) => [m[1], m[2]] );
		var regressed_points= this.props.regression_result.points.map( (m) => [m[1], m[2]] );
		var xScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => d[0])*1.1]).range([this.props.padding, this.props.width-this.props.padding]);
		var yScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => d[1])*1.1]).range([this.props.height-this.props.padding, 0]);

		var path= this.gen_path(this.props.regression_method, this.props.regression_result, regressed_points, xScale, yScale);

		function render_point(coords, index){
			return <circle cx={xScale(coords[0])} cy={yScale(coords[1])} r={2} stroke="black" key={index}/>
		}
		return <g>
			<path d={path} stroke="black" strokeWidth={2} fill="none"></path>
			<RegressionXYAxis {...this.props} xScale={xScale} yScale={yScale}/>
			{known_points.map(render_point)}
			<text x={this.props.width-150} y={16} dy="0.35em" fontSize="12px">{this.props.regression_result.regression_result.string}</text>
		</g>
	}

	log_graph(){
		var known_points= this.props.orig_input.markers.filter( (m) => m[2] ).map( (m) => [m[1], Math.log10(m[2])] );
		var regressed_points= this.props.regression_result.points.map( (m) => [m[1], m[2]] );
		var xScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => d[0])*1.1]).range([this.props.padding, this.props.width-this.props.padding]);
		var yScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => Math.log10(d[1]))*1.1]).range([this.props.height-this.props.padding, 0]);

		var path= this.gen_path(this.props.regression_method, this.props.regression_result, regressed_points, xScale, yScale);

		function render_point(coords, index){
			return <circle cx={xScale(coords[0])} cy={yScale(coords[1])} r={2} stroke="black" key={index}/>
		}
		return <g>
			<path d={path} stroke="black" strokeWidth={2} fill="none"></path>
			<RegressionXYAxis {...this.props} xScale={xScale} yScale={yScale}/>
			{known_points.map(render_point)}
			<text x={this.props.width-150} y={16} dy="0.35em" fontSize="12px">{this.props.regression_result.regression_result.string.replace("y", "log(y)")}</text>
		</g>
	}

	linear_graph(){
		var known_points= this.props.orig_input.markers.filter( (m) => m[2] ).map( (m) => [m[1], m[2]] );
		var regressed_points= this.props.regression_result.points.map( (m) => [m[1], m[2]] );
		var xScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => d[0])*1.1]).range([this.props.padding, this.props.width-this.props.padding]);
		var yScale= d3.scaleLinear().domain([0, d3.max(regressed_points, (d) => d[1])*1.1]).range([this.props.height-this.props.padding, 0]);

		var path= this.gen_path(this.props.regression_method, this.props.regression_result, regressed_points, xScale, yScale);

		function render_point(coords, index){
			return <circle cx={xScale(coords[0])} cy={yScale(coords[1])} r={2} stroke="black" key={index}/>
		}
		return <g>
			<path d={path} stroke="black" strokeWidth={2} fill="none"></path>
			<RegressionXYAxis {...this.props} xScale={xScale} yScale={yScale}/>
			{known_points.map(render_point)}
			<text x={this.props.width-150} y={16} dy="0.35em" fontSize="12px">{this.props.regression_result.regression_result.string}</text>
		</g>
	}

	render_graph(){
		var graph;
		switch(this.props.regression_method){
			case "power":
				graph= this.power_graph();
				break;
			case "logarithmic":
				graph= this.log_graph();
				break;
			case "linear":
				graph= this.linear_graph();
				break;
		}
		return <g>
			<R2 x={this.props.width-150} y={32} dy="0.35em" r2={this.props.regression_result.regression_result.r2}/>
			{graph}
		</g>;
	}

	render(){
		switch(this.props.regression_method){
			case "power":
				break;
			case "logarithmic":
				break;
			case "linear":
				break;
		}
		return <div>
			<svg width={this.props.width} height={this.props.height}>
				{ this.render_graph() }
			</svg>
		</div>;
	}
}

class R2 extends React.Component{
	render(){
		return <g>
			<text x={this.props.x} y={this.props.y} dy={this.props.dy} fontSize="12px">R</text>
			<text x={this.props.x+8} y={this.props.y-3} dy={this.props.dy} fontSize="6px">2</text>
			<text x={this.props.x+16} y={this.props.y} dy={this.props.dy} fontSize="12px">={this.props.r2}</text>
		</g>
	}
}

class RegressionXYAxis extends React.Component{
	render(){
		const xSettings = {
			translate: `translate(0, ${this.props.height - this.props.padding})`,
			scale: this.props.xScale,
			orient: 'bottom'
		};
		const ySettings = {
			translate: `translate(${this.props.padding}, 0)`,
			scale: this.props.yScale,
			orient: 'left'
		};
		return <g className="xy-axis">
			<RegressionAxis {...xSettings}/>
			<RegressionAxis {...ySettings}/>
		</g>
	}
}

class RegressionAxis extends React.Component{
	componentDidMount(){
		this.renderRegressionAxis();
	}

	componentDidUpdate(){
		this.renderRegressionAxis();
	}

	renderRegressionAxis(){
		var node= this.refs.regression_axis;
		var axis;
		switch(this.props.orient){
			case "bottom":
				axis= d3.axisBottom(this.props.scale);
				break;
			case "left":
				axis= d3.axisLeft(this.props.scale);
				break;
		}
		d3.select(node).call(axis);
	}

	render(){
		return <g className="regression_axis" ref="regression_axis" transform={this.props.translate}></g>
	}
}
