requirejs([], function(){

class RandomBaseGenerator extends React.Component{
	constructor(props){
		super(props);

		this.state={
			length: 1000,
			GC_ratio: 50,
		};
	}

	render_ratio_controller(){
		return <div className="form_group">
			<label className="col-sm-4 control-label">GC Ratio:</label>
			<div className="col-sm-6">
				<input type="range" step="any" min="0" max="100" value={this.state.GC_ratio? parseFloat(this.state.GC_ratio):0} onChange={ (e) => this.GC_ratio_changed(e)}/>
			</div>
			<div className="col-sm-2">
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
					<button className="btn btn-primary" onClick={ (e) => this.generate_sequence(e) }>generate</button>
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" value={this.state.sequence? this.state.sequence.toString().replace(/\,/g,""): ""}></textarea>
			</div>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<RandomBaseGenerator/>, mountingPoint);

});
