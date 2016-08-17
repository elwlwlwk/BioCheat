requirejs(["static/script/electrophoresis", "static/script/regression_graph", "static/regression/regression_r"], function(){

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
		var default_regression_method= "power";
		this.state= {
			markers: this.estimate_length(default_regression_method, default_parsed_result.markers).points,
			marker_label: default_parsed_result.marker_label,
			marker_input: default_marker_input,
			electro_width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(default_parsed_result.markers, (d) => d[0])+1) - this.props.column_padding,
			electro_height: 300,
			render_dis: false,
			render_length: true,
			regression_method: default_regression_method,
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
		return {
			points: points.map( (p) => [p[0], p[1]? p[1]: result.equation[0]* Math.pow(p[0], result.equation[1]), p[2]] ),
			regression_result: result,
		};
	}

	logarithmic_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], Math.log10(p[1])]);
		var result= regression("linear", data);
		return {
			points: points.map( (p) => [p[0], p[1]? p[1]: Math.pow(10, result.equation[1]+ result.equation[0]*p[0]), p[2]] ),
			regression_result: result,
		};
	}

	linear_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], p[1]]);
		var result= regression("linear", data);
		return {
			points: points.map( (p) => [p[0], p[1]? p[1]: result.equation[1]+ result.equation[0]*p[0], p[2]] ),
			regression_result: result,
		};
	}

	polynomial_regression(points){
		var data= points.filter( (p) => p[1] ).map( (p) => [p[0], p[1]]);
		var result= regression("polynomial", data, 5);
		return {
			points: points.map( (p) => [p[0], p[1]? p[1]: ( () => {
				var sum= 0;
				result.equation.forEach( (n, idx) => {
					sum+= n* Math.pow(p[0], idx);
				})
				return sum;
			})(), p[2]] ),
			regression_result: result,
		};
	}

	estimate_length(method, markers){
		var points= markers.map( (marker) => [marker[1], marker[2], marker[0]] );
		var result;
		switch (method){
			case "power":
				result= this.power_regression(points);
				break;
			case "logarithmic":
				result= this.logarithmic_regression(points);
				break;
			case "linear":
				result= this.linear_regression(points);
				break;
		}
		result.points= result.points.map( (marker) => [marker[2], marker[0], marker[1]]);
		return result;
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
		result.markers= this.estimate_length(this.state.regression_method, result.markers).points;
		this.setState({
			markers: result.markers,
			marker_label: result.marker_label,
			electro_width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(result.markers, (d) => d[0])+1) - this.props.column_padding,
			marker_input: input,
		});
	}

	regression_method_changed(e){
		var result= this.parse_marker_input(this.state.marker_input);
		result.markers= this.estimate_length(e.target.value, result.markers).points;
		this.setState({
			markers: result.markers,
			regression_method: e.target.value,
		});
	}

	render(){
			return <div>
				<Electrophoresis {...this.props} { ...this.state }/>
				<textarea onChange={ (e) => this.marker_input_changed(e) } defaultValue={this.state.marker_input} cols="50" rows="5">
				</textarea>
				<table><tbody>
					<tr>
						<td><input type="checkbox" onChange= { (e) => this.render_distance_changed(e) } checked={this.state.render_dis} />render distance</td>
					</tr>
					<tr>
						<td><input type="checkbox" onChange= { (e) => this.render_length_changed(e) } checked={this.state.render_length} />render base length</td>
					</tr>
					<tr>
						<td>
							regression method:
							<select name="regression_method" defaultValue={this.state.regression_method} onChange= { (e) => this.regression_method_changed(e) } >
								<option value="power">power</option>
								<option value="logarithmic">logarithmic</option>
								<option value="linear">linear</option>
							</select>
						</td>
					</tr>
				</tbody></table>
				<RegressionGraph width={300} height={300} padding={40} regression_result={this.estimate_length(this.state.regression_method, this.parse_marker_input(this.state.marker_input).markers)} orig_input={this.parse_marker_input(this.state.marker_input)} regression_method={this.state.regression_method}/>
			</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(<BaseLen {...styles}/>, mountingPoint);

});
