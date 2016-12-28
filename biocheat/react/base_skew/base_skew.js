requirejs([], function(){

class BaseSkew extends React.Component{
	constructor(props){
		super(props);
		this.state={
			base_input: "",
			base_seq: [],
			window_size: 100,
			window_pivot: 0,
			base1: "G",
			base2: "C",
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
		var gc_skew=[];
		var window_size= this.state.window_size;
		var rotated_base_seq= base_seq.slice(base_seq.length-this.state.window_pivot).concat(base_seq.slice(0, base_seq.length-this.state.window_pivot));
		var extended_base_seq= rotated_base_seq.concat(rotated_base_seq.slice(0, window_size));
		var g_cnt=0, c_cnt=0;
		for(let i=0; i< window_size; i++){
			switch(extended_base_seq[i]){
				case "G":
					g_cnt++;
					break;
				case "C":
					c_cnt++;
					break;
			}
		}
		if(g_cnt+ c_cnt!= 0){
			gc_skew.push((g_cnt-c_cnt)/(g_cnt+c_cnt));
		}else{
			gc_skew.push(0);
		}
		for(let i= window_size; i< extended_base_seq.length-1; i++){
			switch(extended_base_seq[i]){
				case 'G':
					g_cnt++;
					break;
				case 'C':
					c_cnt++;
					break;
			}
			switch(extended_base_seq[i-window_size]){
				case 'G':
					g_cnt--;
					break;
				case 'C':
					c_cnt--;
					break;
			}
			if(g_cnt<0 || c_cnt<0){
				console.log("error");
			}
			if(g_cnt+ c_cnt== 0){
				gc_skew.push(0);
				continue;
			}
			gc_skew.push((g_cnt-c_cnt)/(g_cnt+c_cnt));
		}
		return gc_skew;
	}

	draw_skew_graph(gc_skew, gc_skew_cumul){
		var height= 500;
		var width= 720;
		var padding= 40;

		var xScale= d3.scaleLinear().domain([0, gc_skew.length]).range([padding, width-padding]);
		var yScale= d3.scaleLinear().domain([d3.min(gc_skew), d3.max(gc_skew)]).range([height-padding, padding]);
		var yCumulScale= d3.scaleLinear().domain([d3.min(gc_skew_cumul), d3.max(gc_skew_cumul)]).range([height-padding, padding]);

		var line_data=[];
		for(let idx in gc_skew){
			line_data.push({pos:xScale(idx), skew:yScale(gc_skew[idx])});
		}

		var cumul_line_data=[];
		for(let idx in gc_skew_cumul){
			cumul_line_data.push({pos:xScale(idx), skew:yCumulScale(gc_skew_cumul[idx])});
		}

		var valueline= d3.line().x((e)=>e.pos).y((e)=>e.skew);
		var path_d= valueline(line_data);
		var cumul_path_d= valueline(cumul_line_data);

		return <svg height={height} width={width}>
			<text x={10} y={30} fontSize="10">GC skew normal</text>
			<text x={width-120} y={30} fontSize="10" fill="red">GC skew cumulative </text>
			<text x={width/2-30} y={20} fontSize="10">window size: {this.state.window_size}</text>
			<path d={path_d} stroke="black" strokeWidth={2} fill="none"></path>
			<path d={cumul_path_d} stroke="red" strokeWidth={2} fill="none"></path>
			<XYAxis height={height} padding={padding} width={width} xScale={xScale} yScale={yScale} yCumulScale={yCumulScale}/>
		</svg>
	}

	window_size_changed(e){
		this.setState({
			window_size: parseInt(e.target.value),
		})
	}

	window_pivot_changed(e){
		this.setState({
			window_pivot: parseInt(e.target.value),
		})
	}

	render(){
		var gc_skew= this.calc_gc_skew(this.state.base_seq);
		var gc_skew_cumul=[0];
		gc_skew.forEach( (d, idx)=>{
			gc_skew_cumul.push(gc_skew_cumul[idx]+ d);
		});
		gc_skew_cumul= gc_skew_cumul.slice(1);
		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Scanning Window Size</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.window_size_changed(e)} defaultValue={this.state.window_size} />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Scanning Window Pivot</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.window_pivot_changed(e)} defaultValue={this.state.window_pivot} />
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
				{this.draw_skew_graph(gc_skew, gc_skew_cumul)}
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
		const yCumulSettings = {
            translate: `translate(${this.props.width - this.props.padding}, 0)`,
            scale: this.props.yCumulScale,
            orient: 'right'
    };
    return <g className="xy-axis">
			<Axis {...xSettings}/>
      <Axis {...ySettings}/>
			<Axis {...yCumulSettings}/>
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
ReactDOM.render(<BaseSkew/>, mountingPoint);

});
