class XYAxis extends React.Component{
	render(){
		return <div>
			XYAxis
		</div>
	}
}
class Markers extends React.Component{
	renderMarker(props){
		return (coords, index) => {
			console.log(props.yScale(coords[1]));
			return <rect width="10" height="3" x={props.xScale(coords[0])} y={props.yScale(coords[1])} key={index}/>;
		}
	}

	render(){
		return <g>
			{ this.props.markers.map(this.renderMarker(this.props)) }
		</g>;
	}
}
class Electrophoresis extends React.Component{
	constructor(props){
		super(props);
		this.state= { markers:[[0,0],[1,0],[2,0],[0,5],[1,1],[1,4],[2,3]] };
	}
	render(){
		var xScale= d3.scaleLinear().domain([0, d3.max(this.state.markers, (d) => d[0])]).range([10, this.props.width-10]);
		var yScale= d3.scaleLinear().domain([0, d3.max(this.state.markers, (d) => d[1])]).range([10, this.props.height-10]);
		var scales= { xScale: xScale, yScale: yScale };
		return <div>
			<svg width={this.props.width} height={this.props.height}>
				<XYAxis {...this.state} {...scales}/>
				<Markers {...this.state} {...scales}/>
			</svg>
		</div>;
	}
}
