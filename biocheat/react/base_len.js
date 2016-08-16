requirejs(["static/script/electrophoresis", "static/regression/regression"], function(){

var styles={
	padding: 40,
	marker_width: 40,
	column_padding: 40,
};

class BaseLen extends React.Component{
	constructor(props){
		super(props);
		var default_marker_input= "ladder: 2-23130 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000\nA: 1.3 2.5 5.5";
		var default_parsed_result= this.parse_marker_input(default_marker_input);
		this.state= {
			markers: this.estimate_length(default_parsed_result.markers),
			marker_label: default_parsed_result.marker_label,
			marker_input: default_marker_input,
			electro_width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(default_parsed_result.markers, (d) => d[0])+1) - this.props.column_padding,
			electro_height: 300,
			render_dis: false,
			render_length: true,
		};
	}

	render_distance_changed(e){
		this.setState({
			render_dis: e.target.checked,
		})
	}

	render_length_changed(e){
		this.setState({
			render_length: e.target.checked,
		})
	}

	power_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], p[1]]);
		var result= regression("power", data);
		return points.map( (p) => [p[0], p[1]? p[1]: result.equation[0]* Math.pow(p[0], result.equation[1]), p[2]] );
	}

	logarithmic_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], Math.log10(p[1])]);
		var result= regression("linear", data);
		return points.map( (p) => [p[0], p[1]? p[1]: Math.pow(10, result.equation[1]+ result.equation[0]*p[0]), p[2]] );
	}

	linear_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], p[1]]);
		var result= regression("linear", data);
		return points.map( (p) => [p[0], p[1]? p[1]: result.equation[1]+ result.equation[0]*p[0], p[2]] );
	}

	estimate_length(markers){
		var points= markers.map( (marker) => [marker[1], marker[2], marker[0]] );
		var result= this.linear_regression(points);
		return result.map( (marker) => [marker[2], marker[0], marker[1]]);
	}

	parse_marker_input(input){
		var columns= input.trim().split("\n").map( (i) => i.trim() );
		var markers=[];
		var marker_label=[]
		columns.forEach( (column, idx) => {
			var label= column.split(":")[0].trim();
			var elements= column.split(":")[1].trim().split(/[\s,]+/);
			marker_label.push([idx, label]);
			elements.forEach( (marker) => {
				markers.push([idx, isNaN(parseFloat(marker.split("-")[0]))? 0: parseFloat(marker.split("-")[0]), isNaN(parseFloat(marker.split("-")[1]))? null: parseFloat(marker.split("-")[1])]);
			})
		});
		return {markers: markers, marker_label: marker_label};
	}

	marker_input_changed(e){
		var input= e.target.value;
		var result= this.parse_marker_input(input);
		result.markers= this.estimate_length(result.markers);
		this.setState({
			markers: result.markers,
			marker_label: result.marker_label,
			electro_width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(result.markers, (d) => d[0])+1) - this.props.column_padding,
			marker_input: input,
		});
	}

	render(){
			return <div>
				<Electrophoresis {...this.props} { ...this.state }/>
				<textarea onChange={ (e) => this.marker_input_changed(e) } defaultValue={this.state.marker_input} cols="50" rows="5">
				</textarea>
				<input type="checkbox" onChange= { (e) => this.render_distance_changed(e) } checked={this.state.render_dis} />render distance 
				<input type="checkbox" onChange= { (e) => this.render_length_changed(e) } checked={this.state.render_length} />render base length
			</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(<BaseLen {...styles}/>, mountingPoint);

});
