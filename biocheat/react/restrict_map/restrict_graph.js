class RestrictGraph extends React.Component{
	constructor(props){
		super(props);
	}
	findRestrictMap(){
	}
	render(){
		var col_length= [];
		var cols= new Set(this.props.markers.map( (marker) => marker[0] ));
		if (this.props.exclude_ladder){
			cols.delete(0);
		}
		var frag_padding= 25;
		cols.forEach((col) => col_length.push(this.props.markers.filter( (marker) => marker[0]==col).map( (marker) => Math.round(parseFloat(marker[2])) ).reduce( (a, b) => a+b )));

		var height= this.props.row_padding* cols.size+ this.props.padding*2;
		var fragScale= d3.scaleLinear().domain([0, d3.max(col_length)]).range( [0, this.props.width- (this.props.padding)*2- frag_padding* d3.max([...cols].map( (col) => this.props.markers.filter( (marker) => marker[0]== col )), (col)=> col.length )] );
		var yScale= d3.scaleLinear().domain([d3.min([...cols]), d3.max([...cols])]).range([this.props.padding, height-this.props.padding]);

		var scale={fragScale: fragScale, yScale: yScale};

		this.findRestrictMap();

		return <div>
			<div>
				<svg width={this.props.width} height={height}>
					<FragmentGraph {...this.props} {...scale} cols={cols} frag_padding={frag_padding}/>
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

class FragmentGraph extends React.Component{
	renderFragment(marker, idx, row){
		var x= this.props.fragScale([0].concat(row.slice(0, idx).map( (mark) => mark[2] )).reduce( (a, b) => a+b ))+ this.props.frag_padding* idx+ parseInt(this.props.label_padding);
		return <g>
			<text x={x} y={this.props.yScale(marker[0])-4} fontSize="10px">{Math.round(marker[2])}</text>
			<rect width={this.props.fragScale(marker[2])} height="2" x={x} y={this.props.yScale(marker[0])} key={idx}/>
		</g>;
	}
	renderLabel(label){
		return <text x={0} y={this.props.yScale(label[0])} fontSize="10" key={label[0]}>{label[1]}</text>
	}
	render(){
		var markers= this.props.markers.filter( (marker) => this.props.cols.has(marker[0]) );
		return <g>
			{this.props.marker_label.filter( (label) => this.props.cols.has(label[0]) ).map( (label) => this.renderLabel(label) )}
			{[...this.props.cols].map( (col) => this.props.markers.filter( (marker) => marker[0]== col )).map( (row) => row.map( (marker, idx) => this.renderFragment(marker, idx, row) ) )}
		</g>;
	}
}
