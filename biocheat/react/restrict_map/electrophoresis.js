class ElectroXYAxis extends React.Component{
	renderElectroAxis(props){
		return (coords, index) => {
			var col_num= d3.max(props.markers, (d) => d[0])+1;
			return <text x={props.xScale(coords[0])} y="15" dy="0.35em" fontSize="10px" key={index}>{ coords[1] }</text>;
		}
	}
	render(){
		return <g>
			{ this.props.marker_label.map(this.renderElectroAxis(this.props)) }
		</g>
	}
}
class Markers extends React.Component{
	renderMarker(props){
		return (coords, index) => {
			var col_num= d3.max(props.markers, (d) => d[0])+1;
			return <rect width={props.marker_width} height="3" x={props.xScale(coords[0])} y={props.yScale(coords[1])} key={index}/>;
		}
	}

	renderDistance(props){
		if(props.render_dis){
			return (coords, index) => {
				return <text x={props.xScale(coords[0])+props.marker_width+3} y={props.yScale(coords[1])} dy="0.35em" fontSize="10px" key={index}>{ coords[1] }</text>
			}
		}
		else{
			return (coords, index) => {
				return null;
			}
		}
	}

	renderLength(props){
		if(props.render_length){
			return (coords, index) => {
				return <text x={props.xScale(coords[0])+props.marker_width+3} y={props.yScale(coords[1])} dy="0.35em" fontSize="10px" key={index}>{ Math.round(coords[2]) }</text>
			}
		}
		else{
			return (coords, index) => {
				return null;
			}
		}
	}

	render(){
		return <g>
			{ this.props.markers.map(this.renderMarker(this.props)) }
			{ this.props.markers.map(this.renderDistance(this.props)) }
			{ this.props.markers.map(this.renderLength(this.props)) }
		</g>;
	}
}
class Electrophoresis extends React.Component{
	render(){
		var xScale= d3.scaleLinear().domain([0, d3.max(this.props.markers, (d) => d[0])]).range([this.props.padding, this.props.width-this.props.padding-this.props.marker_width]);
		var yScale= d3.scaleLinear().domain([0, d3.max(this.props.markers, (d) => d[1])]).range([this.props.padding, this.props.height-this.props.padding]);
		var scales= { xScale: xScale, yScale: yScale };
		return <div>
			<svg width={this.props.width} height={this.props.height}>
				<ElectroXYAxis {...this.state} {...scales} {...this.props}/>
				<Markers {...this.state} {...scales} {...this.props}/>
			</svg>
		</div>;
	}
}
