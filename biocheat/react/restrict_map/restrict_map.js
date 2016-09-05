var styles={
	padding: 40,
	marker_width: 40,
	column_padding: 40,
};

class RestrictMap extends React.Component{
	constructor(props){
		super(props);
		var default_marker_inputs=["ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000", "A: 4.3 4.55", "B: 5.1 4", "A+B: 6.05 5.1 4.55"];
		var default_parsed_result= this.parse_marker_input(default_marker_inputs.reduce( (a, b) => a+ "\n"+ b ));
		var default_regression_method= "power";
		var default_DNA_form= "linear";
		var default_digest_manner= "double";
		this.state= {
			markers: this.estimate_length(default_regression_method, default_parsed_result.markers).points,
			marker_label: default_parsed_result.marker_label,
			marker_inputs: default_marker_inputs,
			width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(default_parsed_result.markers, (d) => d[0])+1) - this.props.column_padding,
			height: 300,
			render_dis: false,
			render_length: true,
			exclude_ladder: true,
			regression_method: default_regression_method,
			DNA_form: default_DNA_form,
			digest_manner: default_digest_manner,
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

	exclude_ladder_changed(e){
		this.setState({
			exclude_ladder: e.target.checked,
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
			try{
				var label= column.split(":")[0].trim();
				var elements= column.split(":")[1].trim().split(/[\s,]+/);
			} catch(e){
				var label= "";
				var elements= column.trim().split(/[\s,]+/);
			}
			marker_label.push([idx, label]);
			elements.forEach( (marker) => {
				markers.push([idx, isNaN(parseFloat(marker.split("-")[0]))? 0: parseFloat(marker.split("-")[0]), isNaN(parseFloat(marker.split("-")[1]))? null: parseFloat(marker.split("-")[1])]);
			})
		});
		return {markers: markers, marker_label: marker_label};
	}

	marker_input_changed(e, method){
		var input= e.target.value;
		var marker_inputs= this.state.marker_inputs.slice(0);
		switch(method){
			case "ladder":
				marker_inputs[0]= input;
				break;
			case "first":
				marker_inputs[1]= input;
				break;
			case "second":
				marker_inputs[2]= input;
				break;
			case "double":
				marker_inputs[3]= input;
				break;
			case "partial":
				marker_inputs[1]= input;
				break;
		}
		var result= this.parse_marker_input(marker_inputs.reduce( (a,b) => a+ "\n"+ b ));
		result.markers= this.estimate_length(this.state.regression_method, result.markers).points;
		this.setState({
			markers: result.markers,
			marker_label: result.marker_label,
			width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(result.markers, (d) => d[0])+1) - this.props.column_padding,
			marker_inputs: marker_inputs,
		});
	}

	regression_method_changed(e){
		var result= this.parse_marker_input(this.state.marker_inputs.reduce( (a,b) => a+ "\n"+ b));
		result.markers= this.estimate_length(e.target.value, result.markers).points;
		this.setState({
			markers: result.markers,
			regression_method: e.target.value,
		});
	}

	DNA_form_changed(e){
		this.setState({
			DNA_form: e.target.value,
		})
	}

	digest_manner_changed(e){
		var digest_manner= e.target.value;
		var default_marker_inputs=[];
		switch(digest_manner){
			case "double":
				default_marker_inputs.push("ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000");
				default_marker_inputs.push("A: 4.3 4.55");
				default_marker_inputs.push("B: 5.1 4");
				default_marker_inputs.push("A+B: 6.05 5.1 4.55");
				break;
			case "partial":
				default_marker_inputs.push("ladder: 2.6-10000 2.8-8000 3.1-6000 3.3-5000 3.6-4000 4-3000 4.6-2000 5.1-1500 5.8-1000");
				default_marker_inputs.push("A: 4.3 4.55");
				break;
		}

		var result= this.parse_marker_input(default_marker_inputs.reduce( (a,b) => a+ "\n"+ b ));
		result.markers= this.estimate_length(this.state.regression_method, result.markers).points;

		this.setState({
			digest_manner: digest_manner,
			markers: result.markers,
			marker_label: result.marker_label,
			width: this.props.padding*2+ (this.props.marker_width+ this.props.column_padding)* (d3.max(result.markers, (d) => d[0])+1) - this.props.column_padding,
			marker_inputs: default_marker_inputs,
		})
	}

	render_input_area(){
		switch(this.state.digest_manner){
			case "double":
				return <div>
					<div className="form-group">
						<label className="col-sm-2 control-label">DNA Ladder</label>
						<div className="col-sm-10">
							<input className="form-control" defaultValue={this.state.marker_inputs[0]} onChange= { (e) => this.marker_input_changed(e, "ladder") } ></input>
						</div>
					</div>
					<div className="form-group">
						<label className="col-sm-2 control-label">First Digest</label>
						<div className="col-sm-10">
							<input className="form-control" defaultValue={this.state.marker_inputs[1]} onChange= { (e) => this.marker_input_changed(e, "first") } ></input>
						</div>
					</div>
					<div className="form-group">
						<label className="col-sm-2 control-label">Second Digest</label>
						<div className="col-sm-10">
							<input className="form-control" defaultValue={this.state.marker_inputs[2]} onChange= { (e) => this.marker_input_changed(e, "second") } ></input>
						</div>
					</div>
					<div className="form-group">
						<label className="col-sm-2 control-label">Double Digest</label>
						<div className="col-sm-10">
							<input className="form-control" defaultValue={this.state.marker_inputs[3]} onChange= { (e) => this.marker_input_changed(e, "double") } ></input>
						</div>
					</div>
				</div>;
			case "partial":
				return <div>
					<div className="form-group">
						<label className="col-sm-2 control-label">DNA Ladder</label>
						<div className="col-sm-10">
							<input className="form-control" onChange= { (e) => this.marker_input_changed(e, "ladder") } ></input>
						</div>
					</div>
					<div className="form-group">
						<label className="col-sm-2 control-label">Partial Digest</label>
						<div className="col-sm-10">
							<input className="form-control" onChange= { (e) => this.marker_input_changed(e, "partial") } ></input>
						</div>
					</div>
				</div>;
		}
	}

	render(){
			return <div className="col-sm-12">
				<Electrophoresis {...this.props} { ...this.state }/>
				<div className="form-group">
					<label>Digest manner:</label>
					<select name="digest_manner" defaultValue={this.state.digest_manner} onChange= { (e) => this.digest_manner_changed(e) } >
						<option value="double">double</option>
						<option value="partial" disabled={true}>partial</option>
					</select>
				</div>
				{this.render_input_area()}
				<div className="form-group">
					<label>DNA form:</label>
					<select name="DNA_Form" defaultValue={this.state.DNA_Form} onChange= { (e) => this.DNA_form_changed(e) } >
						<option value="linear">linear</option>
						<option value="circular">circular</option>
					</select>
				</div>
				<div className="form-group">
					<input type="checkbox" onChange= { (e) => this.render_distance_changed(e) } checked={this.state.render_dis} />render distance<br/>
					<input type="checkbox" onChange= { (e) => this.render_length_changed(e) } checked={this.state.render_length} />render base length<br/>
				</div>
				<div className="form-group">
					<label>regression method:</label>
					<select name="regression_method" defaultValue={this.state.regression_method} onChange= { (e) => this.regression_method_changed(e) } >
						<option value="power">power</option>
						<option value="logarithmic">logarithmic</option>
						<option value="linear">linear</option>
					</select>
				</div>
				<div id="regression_div" className="collapse">
					<RegressionGraph width={300} height={300} padding={40} regression_result={this.estimate_length(this.state.regression_method, this.parse_marker_input(this.state.marker_inputs.reduce( (a,b) => a+ "\n"+ b )).markers)} orig_input={this.parse_marker_input(this.state.marker_inputs.reduce( (a,b) => a+ "\n"+ b ))} regression_method={this.state.regression_method}/>
				</div>
				<div>
					<button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#regression_div">Show Regression Graph</button>
				</div>
				<RestrictGraph {...this.props} {...this.state} width={500} height={500} row_padding={50} padding={30} label_padding={60} />
			</div>
	}
}

requirejs(["static/script/restrict_map/electrophoresis", "static/script/restrict_map/regression_graph", "static/regression/regression_r", "static/script/restrict_map/restrict_graph", "static/script/restrict_map/linear_dna"], function(){
const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.body.appendChild(mountingPoint);
ReactDOM.render(<RestrictMap {...styles}/>, mountingPoint);
});
