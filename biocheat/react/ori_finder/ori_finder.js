requirejs(["static/regression/regression_r"], function(){

class OriFinder extends React.Component{
	constructor(props){
		super(props);
		this.state={
			base_input: "",
			base_seq: [],
			num_ori: 1,
			render_regression: true,
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

	calc_gc_skew(base_seq){
		var gc_skew=[0];
		for(let base of base_seq){
			switch(base){
				case "G":
					gc_skew.push(gc_skew.slice(-1)[0]+1);
					break;
				case "C":
					gc_skew.push(gc_skew.slice(-1)[0]-1);
					break;
				default:
					gc_skew.push(gc_skew.slice(-1)[0]);
					break;
			}
		}
		return gc_skew;
	}

	draw_skew_graph(gc_skew, regression_result){
		var height= 500;
		var width= 720;
		var padding= 30;

		var xScale= d3.scaleLinear().domain([0, gc_skew.length]).range([padding, width-padding]);
		var yScale= d3.scaleLinear().domain([d3.min(gc_skew), d3.max(gc_skew)]).range([height-padding, padding]);

		var line_data=[];
		for(let idx in gc_skew){
			line_data.push({pos:xScale(idx), skew:yScale(gc_skew[idx])});
		}

		var valueline= d3.line().x((e)=>e.pos).y((e)=>e.skew);
		var path_d= valueline(line_data);

		var regress_x= [];
		for(let i=0; i< width; i++){
			regress_x.push((gc_skew.length/width)*i);
		}
		var regress_data= regress_x.map((x) =>{
			var equation= regression_result.equation;
			var y=0;
			for(let i=0; i< equation.length; i++){
				y+= equation[i]*Math.pow(x, i);
			}
			return {pos:xScale(x),skew:yScale(y)};
		})
		var regress_path_d= valueline(regress_data);

		return <svg height={height} width={width}>
			<path d={path_d} stroke="black" strokeWidth={2} fill="none"></path>
			{(function(){
				if(this.state.render_regression)
					return <path d={regress_path_d} stroke="red" strokeWidth={2} fill="none"></path>
			}.bind(this))()}
		</svg>
	}

	num_ori_changed(e){
		this.setState({
			num_ori: parseInt(e.target.value),
		})
	}

	render_regression_changed(e){
		this.setState({
			render_regression: e.target.checked,
		})
	}

	render(){
		var gc_skew= this.calc_gc_skew(this.state.base_seq);
		var regression_result= regression('polynomial', gc_skew.map((d, idx) => [idx, d]), this.state.num_ori+2);
		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Number Of Origin Of Replication</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.num_ori_changed(e)} defaultValue={this.state.num_ori} />
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" onChange={(e) => this.base_textarea_changed(e)} value={this.state.base_input}></textarea>
				<div className="form_group">
					<label>Upload FASTA file</label>
					<input type="file" onChange={ (e) => this.FASTA_file_changed(e) } />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<input type="checkbox" onChange= { (e) => this.render_regression_changed(e) } checked={this.state.render_regression} />render regression<br/>
			</div>
			<div className="col-sm-12">
				{this.draw_skew_graph(gc_skew, regression_result)}
			</div>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<OriFinder/>, mountingPoint);

});
