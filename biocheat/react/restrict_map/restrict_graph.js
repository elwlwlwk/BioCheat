class RestrictGraph extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		var col_length= [];
		var cols= new Set(this.props.markers.map( (marker) => marker[0] ));
		if (this.props.exclude_ladder){
			cols.delete(0);
		}
		var frag_padding= d3.min(this.props.markers.filter( (marker) => cols.has(marker[0]) ), (d) => d[2])/3;
		cols.forEach((col) => col_length.push(this.props.markers.filter( (marker) => marker[0]==col).map( (marker) => Math.round(parseFloat(marker[2])) ).reduce( (a, b) => a+b )+ (this.props.markers.filter( (marker) => marker[0]== col ).length-1)* frag_padding));	

		var height= this.props.row_padding* cols.size+ this.props.padding*2;

		var xScale= d3.scaleLinear().domain([0, d3.max(col_length)]).range([this.props.padding, this.props.width-this.props.padding]);
		var yScale= d3.scaleLinear().domain([d3.min([...cols]), d3.max([...cols])]).range([this.props.padding, this.height-this.props.padding]);

		return <div>
			<div>
				<svg width={this.props.width} height={height}>
				</svg>
			</div>
			<div>
				<svg>
					<LinearDNA/>
				</svg>
			</div>
		</div>;
	}
}
