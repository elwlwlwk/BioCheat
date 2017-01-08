requirejs(["static/plotly/plotly-1.21.2.min.js"], function(plotly){

class ZCurve extends React.Component{
	constructor(props){
		super(props);
		this.state={
			base_input: "",
			base_seq: [],
		}
	}

	base_textarea_changed(e){
		var base_seq= e.target.value.toUpperCase().replace(/[^ATUCG]/g,"").trim().split("");

		this.setState({
			base_input: e.target.value,
			base_seq: base_seq,
		});
	}

	FASTA_file_changed(e){
		var reader= new FileReader();

		reader.onload= function (e){
			var base_input=e.target.result.replace(/^>.+\n/,"");
			var base_seq= base_input.toUpperCase().replace(/[^ATUCG]/g,"").trim().split("");
			this.setState({
				base_input: base_input,
				base_seq: base_seq,
			})

		}.bind(this);
		reader.readAsText(e.target.files[0]);
	}

	calc_z_curve(base_seq){
		var cnt={A:0, C:0, G:0, T:0};
		var Xn=[], Yn=[], Zn=[];
		for(let base of base_seq){
			cnt[base]++;
			Xn.push(cnt.A+cnt.G-cnt.C-cnt.T);
			Yn.push(cnt.A+cnt.C-cnt.G-cnt.T);
			Zn.push(cnt.A+cnt.T-cnt.C-cnt.G);
		}
		return [Xn, Yn, Zn];
	}

	draw_z_curve_graph(z_curve){
		return <ZCurveGraph z_curve={z_curve} plotly={plotly} />
	}

	render(){
		var z_curve= this.calc_z_curve(this.state.base_seq);
		return <div className="col-sm-12">
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" onChange={(e) => this.base_textarea_changed(e)} value={this.state.base_input}></textarea>
				<div className="form_group">
					<label>Upload FASTA file</label>
					<input type="file" onChange={ (e) => this.FASTA_file_changed(e) } />
				</div>
			</div>
			<div className="col-sm-12">
				{this.draw_z_curve_graph(z_curve)}
			</div>
		</div>
	}
}

class ZCurveGraph extends React.Component{
	constructor(props){
		super(props);
		this.state={
			hold_graph: false,
		}
	}
	componentDidMount(){
		this.plot_z_curve()
	}
	componentDidUpdate(){
		this.plot_z_curve()
	}
	plot_z_curve(){
		var index= Array.from(Array(this.props.z_curve[0].length).keys()).map((idx) => "position: "+(idx+1));
		if(this.state.hold_graph){
			this.props.plotly.plot('plot', [{
			  type: 'scatter3d',
			  mode: 'lines',
			  x: this.props.z_curve[0],
			  y: this.props.z_curve[1],
			  z: this.props.z_curve[2],
				text: index,
			  opacity: 1,
			  line: {
			    width: 6,
			    reversescale: false
			  }
			}], {
			  height: 640,
				width: 720
			});
		}
		else{
			this.props.plotly.newPlot('plot', [{
			  type: 'scatter3d',
			  mode: 'lines',
			  x: this.props.z_curve[0],
			  y: this.props.z_curve[1],
			  z: this.props.z_curve[2],
				text: index,
			  opacity: 1,
			  line: {
			    width: 6,
			    reversescale: false
			  }
			}], {
			  height: 640,
				width: 720
			});
		}
	}
	hold_graph_changed(e){
		this.setState({
			hold_graph: e.target.checked,
		})
	}
	render(){
		return <div className="col-sm-12">
			<div className="form-group">
				<input type="checkbox" onChange={ (e) => this.hold_graph_changed(e) } />hold graph<br/>
			</div>
			<div id="plot" className="col-sm-12"></div>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<ZCurve plotly={plotly}/>, mountingPoint);

});
