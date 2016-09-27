requirejs([], function(){

class RandomBaseGenerator extends React.Component{
	constructor(props){
		super(props);

		this.state={
			length: 1000,
			GC_ratio: 50,
			T2U: false,
			sequence: [],
		};
	}

	render_ratio_controller(){
		return <div className="form_group">
			<label className="col-sm-4 control-label">GC Ratio:</label>
			<div className="col-sm-5">
				<input type="range" step="any" min="0" max="100" value={this.state.GC_ratio? parseFloat(this.state.GC_ratio):0} onChange={ (e) => this.GC_ratio_changed(e)}/>
			</div>
			<div className="col-sm-3">
				<input type="text" className="form-control" value={this.state.GC_ratio} onChange= { (e) => this.GC_ratio_changed(e) }></input>
			</div>
		</div>
	}

	generate_sequence(e){
		var GC_count= Math.round(this.state.length* this.state.GC_ratio/ 100);
		var sequence=[];
		for( let i=0; i< GC_count; i++){
			sequence.push(Math.random()>0.5? "G": "C");
		}
		for( let i=0; i< this.state.length- GC_count; i++){
			sequence.push(Math.random()>0.5? "A": "T");
		}

		if(this.state.T2U){
			sequence= sequence.map( (elem) => elem=="T"? "U":elem );
		}

		this.setState({
			sequence: d3.shuffle(sequence),
		})
	}

	GC_ratio_changed(e){
		this.setState({
			GC_ratio: e.target.value,
		})
	}

	length_changed(e){
		this.setState({
			length: parseInt(e.target.value),
		})
	}

	T2U_changed(e){
		this.setState({
			T2U: e.target.checked,
		})
	}

	render_visual(){
		var block_size= 10;
		var padding= 30;
		var col_size= 50;
		var width= col_size*block_size+padding*2;
		var height= Math.ceil((this.state.sequence.length/col_size))*10+padding*2;

		var seq= this.state.sequence.map( (elem, idx) => [ idx%col_size, Math.floor(idx/col_size), elem ] );

		var xScale= d3.scaleLinear().domain([0, col_size-1]).range([padding, width-padding- block_size]);
		var yScale= d3.scaleLinear().domain([0, d3.max(seq, (d) => d[1])]).range([padding, height-padding- block_size]);
		var scale= {
			xScale: xScale,
			yScale: yScale,
		}

		var base_color={"A":"#B24848", "G":"#B09A47","T":"#476FAD","U":"#476FAD","C":"#599562"};

		function render_block(d){
			return <rect width={block_size} height={block_size} x={xScale(d[0])} y={yScale(d[1])} fill={base_color[d[2]]}/>
		}
		return <svg width={width} height={height}>
			<XYAxis xScale={d3.scaleLinear().domain([0, col_size]).range([padding, width-padding])} yScale={d3.scaleLinear().domain([0, d3.max(seq, (d) => d[1])+1]).range([padding, height-padding])} padding={padding} />
			<text x={width-padding/2} y={15} fill={base_color["A"]} fontWeight="bold" >A</text>
			<text x={width-padding/2} y={30} fill={base_color["G"]} fontWeight="bold" >G</text>
			<text x={width-padding/2} y={45} fill={base_color["T"]} fontWeight="bold" >{this.state.T2U? "U":"T"}</text>
			<text x={width-padding/2} y={60} fill={base_color["C"]} fontWeight="bold" >C</text>
			{seq.map( (d) => render_block(d) )}
		</svg>
	}

	render(){
		return <div className="col-sm-12">
			<div className="col-sm-6">
				<div className="form_group">
					<label className="col-sm-4 control-label">Length(bp):</label>
					<div className="col-sm-8">
						<input type="text" className="form-control" value={this.state.length} onChange={ (e) => this.length_changed(e) }></input>
					</div>
				</div>
				{this.render_ratio_controller()}
				<div className="form_group">
					<label>
						<input type="checkbox" checked={ this.state.T2U } onChange={ (e) => this.T2U_changed(e) }/> Thymine to Uracil
					</label>
				</div>
				<div className="form_group">
					<button className="btn btn-primary" onClick={ (e) => this.generate_sequence(e) }>generate</button>
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" value={this.state.sequence? this.state.sequence.toString().replace(/\,/g,""): ""}></textarea>
			</div>
			<div className="col-sm-12">
				{this.render_visual()}
			</div>
		</div>
	}
}

class XYAxis extends React.Component{
	render(){
		const xSettings = {
			translate: `translate(0, ${this.props.padding-10})`,
			scale: this.props.xScale,
			orient: 'top'
		};
		const ySettings = {
			translate: `translate(${this.props.padding-10}, 0)`,
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
		this.renderRegressionAxis();
	}

	componentDidUpdate(){
		this.renderRegressionAxis();
	}

	renderRegressionAxis(){
		var node= this.refs.regression_axis;
		var axis;
		switch(this.props.orient){
			case "top":
				axis= d3.axisTop(this.props.scale);
				break;
			case "left":
				axis= d3.axisLeft(this.props.scale);
				break;
		}
		d3.select(node).call(axis);
	}

	render(){
		return <g className="regression_axis" ref="regression_axis" transform={this.props.translate}></g>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<RandomBaseGenerator/>, mountingPoint);

});
