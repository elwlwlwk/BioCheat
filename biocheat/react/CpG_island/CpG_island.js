requirejs([], function(){

class CpGIsland extends React.Component{
	constructor(props){
		super(props);
		this.state={
			codon_input:"",
			obs_exp_threshold: 0.6,
			GC_content_threshold: 0.5,
			scanning_window_size: 200,
		}
	}

	codon_textarea_changed(e){
		this.setState({
			codon_input: e.target.value,
			codon_seq: e.target.value.toUpperCase().replace(/[^ATUCG]/g,"").trim(),

		});
	}

	FASTA_file_changed(e){
		var reader= new FileReader();
		reader.onload= function (e){
			this.setState({
				codon_input: e.target.result.replace(/^>.+\n/,""),
				codon_seq: e.target.result.replace(/^>.+\n/,"").toUpperCase().replace(/[^ATUCG]/g,"").trim(),
			})

		}.bind(this);
		reader.readAsText(e.target.files[0]);
	}

	render(){
			return <div className="col-sm-12">
				<div className="col-sm-12 form-group">
					<label className="col-sm-3">Obs/Exp Threshold (0-1)</label>
					<div className="col-sm-4">
						<input className="form-control" defaultValue={this.state.obs_exp_threshold} />
					</div>
				</div>
				<div className="col-sm-12 form-group">
					<label className="col-sm-3">GC Content Threshold (0-1)</label>
					<div className="col-sm-4">
						<input className="form-control" defaultValue={this.state.GC_content_threshold} />
					</div>
				</div>
				<div className="col-sm-12 form-group">
					<label className="col-sm-3">Scanning Window Size (bp)</label>
					<div className="col-sm-4">
						<input className="form-control" defaultValue={this.state.scanning_window_size} />
					</div>
				</div>
				<div className="col-sm-12">
					<textarea className="form-control" rows="10" onChange={(e) => this.codon_textarea_changed(e)} value={this.state.codon_input}></textarea>
					<div className="form_group">
						<label>Upload FASTA file</label>
						<input type="file" onChange={ (e) => this.FASTA_file_changed(e) } />
					</div>
				</div>
			</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<CpGIsland/>, mountingPoint);

});
