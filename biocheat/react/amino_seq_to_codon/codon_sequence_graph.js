class CodonSequence extends React.Component{
	constructor(props){
		super(props);
		this.state={
			row_size: 40,
			codon_row_size: 15,
			col_size: 45,
			col: 20,
			padding: 30,
			top_padding: 50,
			render_probability: true,
		}

		this.codon_seq=[];
	}

	render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index){
		var render_codons= function(){
			switch(this.props.render_manner){
				case "show_all":
					return usage_table[amino]? usage_table[amino].sort( (a, b) => parseFloat(selected_adaptation_index[b])- parseFloat(selected_adaptation_index[a])).map( (codon, codon_idx) => {
						return <g>
							<text x={xScale(idx%this.state.col)} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="10" fontFamily="Courier, monospace">
								{codon}
							</text>
							<text x={xScale(idx%this.state.col)+20} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="8" fontFamily="Courier, monospace">
								{parseInt(selected_adaptation_index[codon])&&this.state.render_probability? parseInt(selected_adaptation_index[codon])+"%":null}
							</text>
						</g>
					}): null
				case "highest":
					return usage_table[amino]? usage_table[amino].sort( (a, b) => parseFloat(selected_adaptation_index[b])- parseFloat(selected_adaptation_index[a])).slice(0,1).map( (codon, codon_idx) => {
						this.codon_seq.push(codon);
						return <g>
							<text x={xScale(idx%this.state.col)} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="10" fontFamily="Courier, monospace">
								{codon}
							</text>
							<text x={xScale(idx%this.state.col)+20} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="8" fontFamily="Courier, monospace">
								{parseInt(selected_adaptation_index[codon])&&this.state.render_probability? parseInt(selected_adaptation_index[codon])+"%":null}
							</text>
						</g>
					}): null
				case "consider":
					var select_codon= function(codons){
						var random=Math.random()*100;
						var cursor=0;
						var selected="";
						for(var i=0; i< codons.length; i++){
							cursor+= parseFloat(selected_adaptation_index[codons[i]]);
							selected=codons[i]
							if(random<cursor){
								break;
							}
						}
						return [selected];
					}
					return usage_table[amino]? select_codon(usage_table[amino]).map( (codon, codon_idx) => {
						this.codon_seq.push(codon);
						return <g>
							<text key={"codon_"+idx+"_"+codon_idx} x={xScale(idx%this.state.col)} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="10" fontFamily="Courier, monospace">
								{codon}
							</text>
							<text key={"proba_"+idx+"_"+codon_idx} x={xScale(idx%this.state.col)+20} y={yScale(Math.floor(idx/this.state.col))+ (codon_idx+1)*15} fontSize="8" fontFamily="Courier, monospace">
								{parseInt(selected_adaptation_index[codon])&&this.state.render_probability? parseInt(selected_adaptation_index[codon])+"%":null}
							</text>
						</g>
					}): null
			}
		}.bind(this);
		return <g key={"amino_g_"+idx}>
			<text key={"amino_"+idx} x={xScale(idx%this.state.col)} y={yScale(Math.floor(idx/this.state.col))} fontSize="10" fontFamily="Courier, monospace">
				{amino}
			</text>
			{render_codons()}
		</g>
	}

	render_probability_changed(e){
		this.setState({
			render_probability: e.target.checked,
		})
	}

	FASTA_download(e){
		var file= new File([">"+this.props.codon_ratio_organism+" amino acid sequence to codon sequence\n", this.codon_seq.join("")], "amino_seq_to_codon.fna", {type:"text/plain"});
		saveAs(file);
	}

	render(){
		this.codon_seq=[];
		var usage_table={
			Ala:[],
			Arg:[],
			Asn:[],
			Asp:[],
			Cys:[],
			Gln:[],
			Glu:[],
			Gly:[],
			His:[],
			Ile:[],
			Leu:[],
			Lys:[],
			Met:[],
			Phe:[],
			Pro:[],
			Ser:[],
			Ter:[],
			Thr:[],
			Trp:[],
			Tyr:[],
			Val:[],
		}
		Object.keys(this.props.codon_translation).map( (key) => {
			usage_table[this.props.codon_translation[key]]= usage_table[this.props.codon_translation[key]].concat(key).sort();
		});

		var selected_adaptation_index={};
		Object.keys(usage_table).map( function(amino){
			var codons= usage_table[amino];
			var indexScale= d3.scaleLinear().domain([0, [0].concat(codons.map( (codon) => parseFloat(this.props.codon_ratio.get(codon)) )).reduce( (a,b) => a+b )]).range([0, 100]);
			codons.forEach( function(codon){
				selected_adaptation_index[codon]= indexScale(parseFloat(this.props.codon_ratio.get(codon))?parseFloat(this.props.codon_ratio.get(codon)):0);
			}.bind(this))
		}.bind(this));

		var width= this.state.col_size* this.state.col+ this.state.padding*2;
		var row_cnt= this.props.amino_seq.length? Math.floor((this.props.amino_seq.length-1)/this.state.col)+1: 0
		if(this.props.render_manner == "show_all"){
			var height= row_cnt*(this.state.row_size+ d3.max(Object.keys(usage_table).map( (key) => usage_table[key].length ))* this.state.codon_row_size)+ this.state.padding+ this.state.top_padding;
		}
		else{
			var height= row_cnt*(this.state.row_size)+ this.state.padding+ this.state.top_padding;
		}

		var xScale= d3.scaleLinear().domain([0, this.state.col]).range([this.state.padding, width- this.state.padding]);
		var yScale= d3.scaleLinear().domain([0, row_cnt]).range([this.state.top_padding, height-this.state.padding]);


		var axis_renderer= function (x){
			return <text key={"axis_"+x} x={xScale(x)-30} y={this.state.top_padding-15} fontSize="10" fontFamily="monospace">{x}</text>
		}.bind(this)

		return <div>
			<div className="form-group">
				<input type="checkbox" onChange={(e) => this.render_probability_changed(e)} checked={this.state.render_probability}/>Render Probability
			</div>
			<svg width={width} height={height}>
				{[5,10,15,20].map( (x) => axis_renderer(x) )}
				{this.props.amino_seq.map( (amino, idx) => this.render_amino_seq(amino, idx, xScale, yScale, usage_table, selected_adaptation_index) )}
			</svg>
			<br/>
			<button type="button" className="btn btn-default" onClick={ (e) => this.FASTA_download(e)}>Download As FASTA Format</button>
		</div>
	}
}
