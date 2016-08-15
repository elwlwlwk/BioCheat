class XYAxis extends React.Component{
	renderAxis(props){
		return (coords, index) => {
			var col_num= d3.max(props.markers, (d) => d[0])+1;
			return <text x={props.xScale(coords[0])} y="15" dy="0.35em" fontSize="10px" key={index}>{ coords[1] }</text>;
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

	renderPosition(props){
		return (coords, index) => {
			return <text x={props.xScale(coords[0])+props.marker_width+3} y={props.yScale(coords[1])} dy="0.35em" fontSize="10px" key={index}>{ coords[1] }</text>
		}
	}

	render(){
		if(this.props.render_pos){
			return <g>
				{ this.props.markers.map(this.renderMarker(this.props)) }
				{ this.props.markers.map(this.renderPosition(this.props)) }
			</g>;
		}
		else{
			return <g>
				{ this.props.markers.map(this.renderMarker(this.props)) }
			</g>;
		}
	}
}
class Electrophoresis extends React.Component{
	constructor(props){
		super(props);
		var default_marker_input= "ladder: 1.1 2.4 5.5 6.7\nA: 1.3 2.5 5.5 8.8";
		var default_parsed_result= this.parse_marker_input(default_marker_input);
		this.state= {
			markers: default_parsed_result.markers,
			marker_label: default_parsed_result.marker_label,
			marker_input: default_marker_input,
			width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(default_parsed_result.markers, (d) => d[0])+1) - this.props.column_padding,
			height: 300,
			render_pos: false,
		};
	}

	parse_marker_input(input){
		var columns= input.trim().split("\n").map( (i) => i.trim() );
		var markers=[];
		var marker_label=[]
		columns.forEach( (column, idx) => {
			var label= column.split(":")[0];
			var elements= column.split(":")[1].split(/[\s,]+/);
			marker_label.push([idx, label]);
			elements.forEach( (marker) => {
				markers.push([idx, isNaN(parseFloat(marker))? 0: parseFloat(marker)]);
			})
			markers.push([idx, 0]);
		});
		return {markers: markers, marker_label: marker_label};
	}

	marker_input_changed(e){
		var input= e.target.value;
		var result= this.parse_marker_input(input);
		this.setState({
			markers: result.markers,
			marker_label: result.marker_label,
			width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(result.markers, (d) => d[0])+1) - this.props.column_padding,
			marker_input: input,
		});
	}

	render_position_changed(e){
		this.setState({
			render_pos: e.target.checked,
		})
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
				<textarea onChange={ (e) => this.marker_input_changed(e) } defaultValue={this.state.marker_input} cols="50" rows="5">
				</textarea>
				<input type="checkbox" onChange= { (e) => this.render_position_changed(e) } />render position
			</div>
		</div>;
	}
}
