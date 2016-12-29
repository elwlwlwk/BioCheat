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

	calc_skew(base_seq){
		var skew=[];
		var window_size= this.state.window_size;
		var rotated_base_seq= base_seq.slice(base_seq.length-this.state.window_pivot).concat(base_seq.slice(0, base_seq.length-this.state.window_pivot));
		var extended_base_seq= rotated_base_seq.concat(rotated_base_seq.slice(0, window_size));
		var base1_cnt=0, base2_cnt=0;
		for(let i=0; i< window_size; i++){
			switch(extended_base_seq[i]){
				case this.state.base1:
					base1_cnt++;
					break;
				case this.state.base2:
					base2_cnt++;
					break;
			}
		}
		if(base1_cnt+ base2_cnt!= 0){
			skew.push((base1_cnt-base2_cnt)/(base1_cnt+base2_cnt));
		}else{
			skew.push(0);
		}
		for(let i= window_size; i< extended_base_seq.length-1; i++){
			switch(extended_base_seq[i]){
				case this.state.base1:
					base1_cnt++;
					break;
				case this.state.base2:
					base2_cnt++;
					break;
			}
			switch(extended_base_seq[i-window_size]){
				case this.state.base1:
					base1_cnt--;
					break;
				case this.state.base2:
					base2_cnt--;
					break;
			}
			if(base1_cnt<0 || base2_cnt<0){
				console.log("error");
			}
			if(base1_cnt+ base2_cnt== 0){
				skew.push(0);
				continue;
			}
			skew.push((base1_cnt-base2_cnt)/(base1_cnt+base2_cnt));
		}
		return skew;
	}

	draw_skew_graph(skew, skew_cumul){
		var height= 500;
		var width= 720;
		var padding= 40;

		var xScale= d3.scaleLinear().domain([0, skew.length]).range([padding, width-padding]);
		var yScale= d3.scaleLinear().domain([d3.min(skew), d3.max(skew)]).range([height-padding, padding]);
		var yCumulScale= d3.scaleLinear().domain([d3.min(skew_cumul), d3.max(skew_cumul)]).range([height-padding, padding]);

		var line_data=[];
		for(let idx in skew){
			line_data.push({pos:xScale(idx), skew:yScale(skew[idx])});
		}

		var cumul_line_data=[];
		for(let idx in skew_cumul){
			cumul_line_data.push({pos:xScale(idx), skew:yCumulScale(skew_cumul[idx])});
		}

		var valueline= d3.line().x((e)=>e.pos).y((e)=>e.skew);
		var path_d= valueline(line_data);
		var cumul_path_d= valueline(cumul_line_data);

		return <svg height={height} width={width}>
			<text x={10} y={30} fontSize="10">skew normal</text>
			<text x={width-100} y={30} fontSize="10" fill="red">skew cumulative </text>
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

	base_changed(idx, e){
		if(idx== 1){
			this.setState({
				base1: e.target.value,
			})
		}
		else if(idx== 2){
			this.setState({
				base2: e.target.value,
			})
		}
	}

	render(){
		var skew= this.calc_skew(this.state.base_seq);
		var skew_cumul=[0];
		skew.forEach( (d, idx)=>{
			skew_cumul.push(skew_cumul[idx]+ d);
		});
		skew_cumul= skew_cumul.slice(1);
		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-2">Base 1</label>
				<div className="col-sm-2">
					<select className="form-control" onChange={( (e) => this.base_changed(1, e) )} defaultValue={this.state.base1}>
						<option value="A">A</option>
						<option value="C">C</option>
						<option value="G">G</option>
						<option value="T">T</option>
					</select>
				</div>
				<label className="col-sm-2">Base 2</label>
				<div className="col-sm-2">
					<select className="form-control" onChange={( (e) => this.base_changed(2, e) )} defaultValue={this.state.base2}>
						<option value="A">A</option>
						<option value="C">C</option>
						<option value="G">G</option>
						<option value="T">T</option>
					</select>
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-4">Scanning Window Size</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.window_size_changed(e)} defaultValue={this.state.window_size} />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-4">Scanning Window Pivot</label>
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
				{this.draw_skew_graph(skew, skew_cumul)}
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
