class XYAxis extends React.Component{
	renderAxis(props){
		return (coords, index) => {
			var col_num= d3.max(props.markers, (d) => d[0])+1;
			return <text x={props.xScale(coords[0])} y="15" dy="0.35em" key={index}>{ coords[1] }</text>;
		}
	}
	render(){
		return <g>
			{ this.props.marker_label.map(this.renderAxis(this.props)) }
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

	render(){
		return <g>
			{ this.props.markers.map(this.renderMarker(this.props)) }
		</g>;
	}
}
class Electrophoresis extends React.Component{
	constructor(props){
		super(props);
		this.state= {
			markers:[[0,0]],
			marker_label:[[0,"test"]],
			width: props.padding*2+ props.marker_width,
			height: 300,
		};
	}

	add_column(){
		if(this.state.markers.length== 1){
			this.setState({
				markers: [[d3.max(this.state.markers, (d) => d[0]), 0]]
.concat(this.state.marker_input.split(/[\s,]+/).map( (pos) => [d3.max(this.state.markers, (d) => d[0]), parseFloat(pos)] )),
				width: this.props.padding*2+ (this.props.marker_width + this.props.column_padding)* (d3.max(this.state.markers, (d) => d[0])+2)-this.props.column_padding,
			});
		}
		else{
			this.setState({
				markers: this.state.markers.concat([[d3.max(this.state.markers, (d) => d[0])+1, 0]])
.concat(this.state.marker_input.split(/[\s,]+/).map( (pos) => [d3.max(this.state.markers, (d) => d[0])+1, parseFloat(pos)] )),
				width: this.props.padding*2+ (this.props.marker_width + this.props.column_padding)* (d3.max(this.state.markers, (d) => d[0])+2)-this.props.column_padding,
			});
		}
	}

	marker_input_change(e){
		this.setState({
			marker_input: e.target.value,
		})
	}

	render_position_change(e){
		console.log(e.target.checked);
	}

	render(){
		var xScale= d3.scaleLinear().domain([0, d3.max(this.state.markers, (d) => d[0])]).range([this.props.padding, this.state.width-this.props.padding-this.props.marker_width]);
		var yScale= d3.scaleLinear().domain([0, d3.max(this.state.markers, (d) => d[1])]).range([this.props.padding, this.state.height-this.props.padding]);
		var scales= { xScale: xScale, yScale: yScale };
		return <div>
			<svg width={this.state.width} height={this.state.height}>
				<XYAxis {...this.state} {...scales} {...this.props}/>
				<Markers {...this.state} {...scales} {...this.props}/>
			</svg>
			<div>
				<input onChange={ (e) => this.marker_input_change(e) } type="text" placeholder="1.1 4.2 6.4"/>
				<button onClick={() => this.add_column()}>
					Add Column
				</button>
				<input type="checkbox" onChange= { (e) => this.show_position_change(e) } />render position
			</div>
		</div>;
	}
}
