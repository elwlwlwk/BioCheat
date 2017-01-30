requirejs(['/static/dct.js'], function(){

class ExonIntron extends React.Component{
	constructor(props){
		super(props);
		this.state={
			base_input: "",
			base_seq: [],
			window_size: 100,
			step_size: 100,
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

	window_size_changed(e){
		this.setState({
			window_size: parseInt(e.target.value),
		})
	}

	step_size_changed(e){
		this.setState({
			step_size: parseInt(e.target.value),
		})
	}

	normalcdf(X){   //HASTINGS.  MAX ERROR = .000001
		var T=1/(1+.2316419*Math.abs(X));
		var D=.3989423*Math.exp(-X*X/2);
		var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
		if (X>0) {
			Prob=1-Prob;
		}
		return Prob;
	}

	compute_cdf(Z, M, SD) {
		var Prob=0;
		if (SD<0) {
			alert("The standard deviation must be nonnegative.")
		} else if (SD==0) {
		    if (Z<M){
		        Prob=0
		    } else {
			    Prob=1
			}
		} else {
			Prob=this.normalcdf((Z-M)/SD);
		}
	    return Prob;
	}
	

	calc_exon_prob(base_seq, window_size, step_size){
		var G_cnt=[];
		var codon_peaks=[];
		base_seq.forEach( (base)=>{
			switch(base){
				case 'A':
				case 'T':
				case 'C':
					G_cnt.push(0);
					break;
				case 'G':
					G_cnt.push(1);
					break;
			}
		})
		var extract_codon_peak= function (base_dct){
			var codon_area= base_dct.slice(Math.floor(base_dct.length*2/3-base_dct.length/20), Math.ceil(base_dct.length*2/3+base_dct.length/20))
			var max_peak= d3.max(codon_area);
			var min_peak= d3.min(codon_area);
			var max_index= codon_area.indexOf(max_peak);
			var min_index= codon_area.indexOf(min_peak);
			var codon_padding= codon_area.length/10;
			var second_max= d3.max(codon_area.slice(0, max_index-codon_padding).concat(codon_area.slice(max_index+codon_padding+1)));
			var second_min= d3.min(codon_area.slice(0, min_index-codon_padding).concat(codon_area.slice(min_index+codon_padding+1)));
			return d3.max([max_peak/second_max, min_peak/second_min]);
			//var mean= codon_area.reduce( (a,b)=>a+b )/codon_area.length;
			//var variance= codon_area.map( (x)=>Math.pow(x-mean,2) ).reduce( (a,b)=>a+b )/codon_area.length; 
			//return d3.max([(max_peak-mean)/variance, Math.abs((min_peak-mean)/variance)]);
		}.bind(this);
		for(let i=0; i<base_seq.length; i+=step_size){
			let dct_peak_prob= extract_codon_peak(dct(G_cnt.slice(i, i+window_size)));
			codon_peaks.push(dct_peak_prob);
		}

		return codon_peaks;
	}

	render(){
		var exon_probs= this.calc_exon_prob(this.state.base_seq, this.state.window_size, this.state.step_size);
		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-4">Scanning Window Size</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.window_size_changed(e)} defaultValue={this.state.window_size} />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-4">Step Size</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.step_size_changed(e)} defaultValue={this.state.step_size} />
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" onChange={(e) => this.base_textarea_changed(e)} value={this.state.base_input}></textarea>
				<div className="form_group">
					<label>Upload FASTA file</label>
					<input type="file" onChange={ (e) => this.FASTA_file_changed(e) } />
				</div>
			</div>
			<div className="col-sm-12">
				<ExonIntronGraph exon_probs={exon_probs} {...this.state} />
			</div>
		</div>
	}
}

class ExonIntronGraph extends React.Component{
	constructor(props){
		super(props);
		this.state={
			exon_prob_threshold_bar: 50,
			exon_prob_threshold: -1,
		}
	}

	draw_exon_prob_graph(exon_prob, threshold){
		var height= 500;
		var width= 720;
		var padding= 40;

		var xScale= d3.scaleLinear().domain([0, exon_prob.length*this.props.step_size]).range([padding, width-padding]);
		var yScale= d3.scaleLinear().domain([d3.min(exon_prob), d3.max(exon_prob)]).range([height-padding, padding]);

		var line_data=[];
		for(let idx in exon_prob){
			line_data.push({pos:xScale(idx*this.props.step_size), prob:yScale(exon_prob[idx])});
		}

		var valueline= d3.line().x((e)=>e.pos).y((e)=>e.prob);
		var path_d= valueline(line_data);
		var exon_prob_threshold=0;
		if(this.state.exon_prob_threshold== -1){
			let threshold_scale= d3.scaleLinear().domain([0, 100]).range([d3.min(this.props.exon_probs), d3.max(this.props.exon_probs)]);
			exon_prob_threshold= threshold_scale(50);
		}else{
			exon_prob_threshold= this.state.exon_prob_threshold;
		}

		var threshold_line= valueline([{pos:xScale(0), prob:yScale(exon_prob_threshold)}, {pos:xScale(exon_prob.length*this.props.step_size), prob:yScale(exon_prob_threshold)}]);

		return <svg height={height} width={width}>
			<text x={width/2-30} y={20} fontSize="10">Exon Intensity</text>
			<path d={path_d} stroke="black" strokeWidth={2} fill="none"></path>
			<path d={threshold_line} stroke="black" strokeWidth={2} fill="none"></path>
			<XYAxis height={height} padding={padding} width={width} xScale={xScale} yScale={yScale}/>
		</svg>
	}

	exon_prob_threshold_changed(e){
		var threshold_scale= d3.scaleLinear().domain([0, 100]).range([d3.min(this.props.exon_probs), d3.max(this.props.exon_probs)]);
		this.setState({
			exon_prob_threshold: threshold_scale(parseInt(e.target.value)),
			exon_prob_threshold_bar: parseInt(e.target.value),
		})
	}

	render(){
		var color_scale= d3.scaleLinear().range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"])
		return <div class="col-sm-12">
			<div class="col-sm-12">
				<label className="col-sm-4 control-label">Exon Intensity Threshold:</label>
				<div className="col-sm-5">
					<input type="range" step="any" min="0" max="100" value={this.state.exon_prob_threshold_bar} onChange={ (e) => this.exon_prob_threshold_changed(e) }></input>
				</div>
			</div>
			<div class="col-sm-12">
				{this.draw_exon_prob_graph(this.props.exon_probs)}
			</div>
		</div>
	}
}

class XYAxis extends React.Component{
	render(){
		const xSettings = {
			translate: `translate(0, ${this.props.height - this.props.padding})`,
			scale: this.props.xScale,
			orient: 'bottom'
		};
		const ySettings = {
			translate: `translate(${this.props.padding}, 0)`,
			scale: this.props.yScale,
			orient: 'left'
		};
	    return <g className="xy-axis">
			<Axis {...xSettings}/>
			<Axis {...ySettings}/>
		</g>
	}
}

class Axis extends React.Component{
	componentDidMount(){
		this.renderAxis();
	}

	componentDidUpdate(){
		this.renderAxis();
	}

	renderAxis(){
		var node= this.refs.axis;
		var axis;
		switch(this.props.orient){
			case "bottom":
			axis= d3.axisBottom(this.props.scale);
			break;
			case "left":
			axis= d3.axisLeft(this.props.scale);
			break;
			case "right":
			axis= d3.axisRight(this.props.scale);
			break;
		}
		d3.select(node).call(axis);
	}

	render(){
		return <g className="axis" ref="axis" transform={this.props.translate}></g>
	}
}



const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<ExonIntron/>, mountingPoint);

});
