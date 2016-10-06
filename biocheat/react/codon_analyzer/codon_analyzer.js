requirejs(["static/script/codon_analyzer/codon_translation_graph.js", "static/FileSaver.js"], function(){

class CodonAnalyzer extends React.Component{
	constructor(props){
		super(props);
		this.state={
			codon_ratio_organism: "custom",
			codon_ratio_list: [],
			codon_ratio: new Map(),
			codon_translation_organism: "standard",
			codon_translation: new Map(),
			codon_input: [],
			codon_seq: [],
			amino_seq: [],
		}
	}

	componentDidMount(){
		this.serverRequest= $.get("/static/spsum/list", function(result) {
			this.setState({
				codon_ratio_list: JSON.parse(result),
			})
		}.bind(this));

		$.get("/static/codon_translation/"+this.state.codon_translation_organism, function(result){
			var codon_label= ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
			var amino= result.trim().split(" ");
			this.setState({
				codon_translation: new Map(d3.zip(codon_label, amino)),
			});
		}.bind(this))
	}

	componentWillUnmount(){
		this.serverRequest.abort();
	}

	render_codon_ratio_select(){
		return <select className="form-control" defaultValue={this.state.codon_ratio_organism} onChange={ (e) => this.codon_ratio_select_changed(e) }>
			<option value="custom">custom</option>
			{ this.state.codon_ratio_list.map( (elem) => <option value={elem}>{elem}</option> )}
		</select>
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
			<option value="standard">standard</option>
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
				<td>{base_set[0]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[0]) } value={react_this.state.codon_translation.get(base_set[0])}/></td>
				<td>{base_set[1]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[1]) } value={react_this.state.codon_translation.get(base_set[1])}/></td>
				<td>{base_set[2]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[2]) } value={react_this.state.codon_translation.get(base_set[2])}/></td>
				<td>{base_set[3]}</td><td><input size="5" onChange={ (e) => react_this.translation_table_changed(e, base_set[3]) } value={react_this.state.codon_translation.get(base_set[3])}/></td>
			</tr>;
		}

		return <table className="table table-bordered table-hover">
			<tbody>
				{base_combi_set.map( (combi_set) => render_base_combi(combi_set, this) )}
			</tbody>
		</table>
	}

	translation_table_changed(e, codon){
		this.setState({
			codon_translation: this.state.codon_translation.set(codon, e.target.value),
		})
	}

	codon_ratio_select_changed(e){
		$.get("/static/spsum/"+e.target.value, function(result){
			var codon_label= ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
			var spsum= result.trim().split(" ").map( (d) => parseInt(d) );
			var codon_total= spsum.reduce( (a,b) => a+b );
			this.setState({
				codon_ratio: new Map(d3.zip(codon_label, spsum.map( (d) => (1000*d/codon_total).toFixed(3) ))),
			});
		}.bind(this));
	}

	codon_translation_select_changed(e){
		$.get("/static/codon_translation/"+e.target.value, function(result){
			var codon_label= ["CGA", "CGC", "CGG", "CGU", "AGA", "AGG", "CUA", "CUC", "CUG", "CUU", "UUA", "UUG", "UCA", "UCC", "UCG", "UCU", "AGC", "AGU", "ACA", "ACC", "ACG", "ACU", "CCA", "CCC", "CCG", "CCU", "GCA", "GCC", "GCG", "GCU", "GGA", "GGC", "GGG", "GGU", "GUA", "GUC", "GUG", "GUU", "AAA", "AAG", "AAC", "AAU", "CAA", "CAG", "CAC", "CAU", "GAA", "GAG", "GAC", "GAU", "UAC", "UAU", "UGC", "UGU", "UUC", "UUU", "AUA", "AUC", "AUU", "AUG", "UGG", "UAA", "UAG", "UGA"];
			var amino= result.trim().split(" ");
			this.setState({
				codon_translation: new Map(d3.zip(codon_label, amino)),
			});
		}.bind(this))
	}

	codon_textarea_changed(e){
		var codon_input= e.target.value.trim().toUpperCase().replace(/T/g, "U").split("").filter( (d) => ["A","G","U","C"].includes(d) );
		var codon_input_temp= codon_input.slice(0);
		var codon_seq=[];
		while(codon_input_temp.length){
			codon_seq.push(codon_input_temp.splice(0,3));
		}
		var amino_seq= codon_seq.map( (codon) => this.state.codon_translation.get(codon.reduce( (a, b) => a+b )) )
		this.setState({
			codon_input: codon_input,
			codon_seq: codon_seq,
			amino_seq: amino_seq
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
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<CodonAnalyzer/>, mountingPoint);

});
