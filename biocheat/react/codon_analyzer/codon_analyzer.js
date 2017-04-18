requirejs(["static/script/codon_analyzer/codon_translation_graph.js", "static/script/codon_analyzer/codon_ratio_graph.js", "static/script/codon_analyzer/codon_adaptation_graph.js", "static/FileSaver.js"], function(){

class CodonAnalyzer extends React.Component{
	constructor(props){
		super(props);
		this.state={
			codon_ratio_organism: "",
			codon_ratio: new Map(),
			codon_translation_organism: "Standard",
			codon_translation: new Map(),
			codon_translation_list: [],
			codon_input: [],
			codon_seq: [],
			amino_seq: [],
			suggest_ratio_list: [],
		}
	}

	componentDidMount(){
		fetch('http://home.wisewolf.org/api/codon_translation_list', {mode: 'no-cors'})
		.then( (r) => r.json())
		.then( (r) => {
			this.setState({
				codon_translation_list: r,
			})
		});

		fetch('http://home.wisewolf.org/api/codon_translation?organism='+this.state.codon_translation_organism, {mode: 'no-cors'})
		.then( (r) => r.json())
		.then( (r) => {
			this.setState({
				codon_translation: r,
			})
		});
	}

	componentWillUnmount(){
		this.serverRequest.abort();
	}

	render_codon_ratio_select(){
		return <div>
			<input className="form-control" placeholder="Input Organism" onChange={ (e) => this.codon_ratio_select_changed(e) } list="suggest_ratio_list" />
			<datalist id="suggest_ratio_list">
				{this.state.suggest_ratio_list.map( (elem) => {
					return <option value={elem} />
				})}
			</datalist>
		</div>
	}

	render_codon_ratio_table(){
		var base_set=["U", "C", "A" ,"G"];
		var base_combi=[];
		
		base_set.forEach( (i) => {
			base_set.forEach( (j) => {
				base_set.forEach( (k) => {
					base_combi.push(i+j+k);
				})
			})
		})

		var base_combi_set=[];
		
		while(base_combi.length){
			base_combi_set.push(base_combi.splice(0, 4));
		}

		function render_base_combi(base_set, react_this){
			return <tr>
				<td>{base_set[0]}</td><td><input size="5" onChange={ (e) => react_this.ratio_table_changed(e, base_set[0]) } value={react_this.state.codon_ratio.get(base_set[0])}/></td>
				<td>{base_set[1]}</td><td><input size="5" onChange={ (e) => react_this.ratio_table_changed(e, base_set[1]) } value={react_this.state.codon_ratio.get(base_set[1])}/></td>
				<td>{base_set[2]}</td><td><input size="5" onChange={ (e) => react_this.ratio_table_changed(e, base_set[2]) } value={react_this.state.codon_ratio.get(base_set[2])}/></td>
				<td>{base_set[3]}</td><td><input size="5" onChange={ (e) => react_this.ratio_table_changed(e, base_set[3]) } value={react_this.state.codon_ratio.get(base_set[3])}/></td>
			</tr>;
		}

		return <table className="table table-bordered table-hover">
			<tbody>
				{base_combi_set.map( (combi_set) => render_base_combi(combi_set, this) )}
			</tbody>
		</table>
	}

	ratio_table_changed(e, codon){
		this.setState({
			codon_ratio: this.state.codon_ratio.set(codon, e.target.value),
		})
	}

	render_codon_translation_select(){
		return <select className="form-control" defaultValue={this.state.codon_translation_organism} onChange={ (e) => this.codon_translation_select_changed(e) }>
			{this.state.codon_translation_list.map( (org) => {
				return <option value={org}>{org}</option>;
			} )}
		</select>
	}

	render_codon_translation_table(){
		var base_set=["U", "C", "A" ,"G"];
		var base_combi=[];
		
		base_set.forEach( (i) => {
			base_set.forEach( (j) => {
				base_set.forEach( (k) => {
					base_combi.push(i+j+k);
				})
			})
		})

		var base_combi_set=[];
		
		while(base_combi.length){
			base_combi_set.push(base_combi.splice(0, 4));
		}

		function render_base_combi(base_set, react_this){
			return <tr>
				<td>{base_set[0]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[0]) } value={react_this.state.codon_translation[base_set[0]]}/></td>
				<td>{base_set[1]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[1]) } value={react_this.state.codon_translation[base_set[1]]}/></td>
				<td>{base_set[2]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[2]) } value={react_this.state.codon_translation[base_set[2]]}/></td>
				<td>{base_set[3]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[3]) } value={react_this.state.codon_translation[base_set[3]]}/></td>
			</tr>;
		}

		return <table className="table table-bordered table-hover">
			<tbody>
				{base_combi_set.map( (combi_set) => render_base_combi(combi_set, this) )}
			</tbody>
		</table>
	}

	translation_table_changed(e, codon){
		var codon_translation= this.state.codon_translation;
		codon_translation[codon]= e.target.value;
		this.setState({
			codon_translation: codon_translation,
		})
	}

	codon_ratio_select_changed(e){
		if(e.target.value.length<3) return;
		fetch('http://home.wisewolf.org/api/spsum_list?organism='+e.target.value, {mode: 'no-cors'})
		.then( (r) => r.json() )
		.then( (r) => {
			this.setState({
				suggest_ratio_list: r,
			})
		})

		fetch('http://home.wisewolf.org/api/spsum?organism='+e.target.value, {mode: 'no-cors'})
		.then( (r) => r.json() )
		.then( (r) => {
			if(!r) return;
			var codon_label= ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
			var spsum= r["spsum"].trim().split(" ").map( (d) => parseInt(d) );
			var codon_total= spsum.reduce( (a,b) => a+b );
			this.setState({
				codon_ratio: new Map(d3.zip(codon_label, spsum.map( (d) => (1000*d/codon_total).toFixed(3) ))),
			});
		})
	}

	codon_translation_select_changed(e){
		fetch('http://home.wisewolf.org/api/codon_translation?organism='+e.target.value, {mode: 'no-cors'})
		.then( (r) => r.json() )
		.then( (r) => {
			var codon_translation= r;
			var amino_seq= this.state.codon_seq.map( (codon) => codon_translation[codon.reduce( (a, b) => a+b )] );
			this.setState({
				codon_translation: codon_translation,
				amino_seq: amino_seq[amino_seq.length-1]? amino_seq: amino_seq.slice(0,-1),
			});

		})
		this.setState({
			codon_translation_organism: e.target.value,
		})
	}

	codon_textarea_changed(e){
		var codon_input= e.target.value.trim().toUpperCase().replace(/T/g, "U").split("").filter( (d) => ["A","G","U","C"].includes(d) );
		var codon_input_temp= codon_input.slice(0);
		var codon_seq=[];
		while(codon_input_temp.length){
			codon_seq.push(codon_input_temp.splice(0,3));
		}
		var amino_seq= codon_seq.map( (codon) => this.state.codon_translation[codon.reduce( (a, b) => a+b )] );
		this.setState({
			codon_input: codon_input,
			codon_seq: codon_seq,
			amino_seq: amino_seq[amino_seq.length-1]? amino_seq: amino_seq.slice(0,-1),
		})
	}

	render(){
		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Codon Ratio Table (‰)</label>
				<div className="col-sm-4">
					{this.render_codon_ratio_select()}
				</div>
				<div id="codon_ratio_div" className="collapse col-sm-12">
					{this.render_codon_ratio_table()}
				</div>
				<div className="col-sm-12">
					<button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#codon_ratio_div">Show Codon Ratio Table</button>
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Codon Translation Table</label>
				<div className="col-sm-4">
					{this.render_codon_translation_select()}
				</div>
				<div id="codon_translation_div" className="collapse col-sm-12">
					{this.render_codon_translation_table()}
				</div>
				<div className="col-sm-12">
					<button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#codon_translation_div">Show Codon Translation Table</button>
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" onChange={(e) => this.codon_textarea_changed(e)}></textarea>
			</div>
			<div className="col-sm-12">
				<CodonTranslation {...this.state}/>
			</div>
			<div className="col-sm-12">
				<CodonRatio {...this.state}/>
			</div>
			<div className="col-sm-12">
				<CodonAdaptation {...this.state} />
			</div>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<CodonAnalyzer/>, mountingPoint);

});
