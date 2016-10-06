class CodonTranslation extends React.Component{
	constructor(props){
		super(props);
		this.state={
			amino_FASTA_map: {
				ala: "A", cys: "C", asp: "D", glu: "E", phe: "F", gly: "G", his: "H", ile: "I", lys: "K",
leu: "L", met: "M", asn: "N", pro: "P", gln: "Q", arg: "R", ser: "S", thr: "T", val: "V", trp: "W", tyr: "Y",
ter: "Z",
			}
		}
	}

	render_codon_translation(xScale, yScale, col){
		function codon_renderer(codon, idx){
			return <text fontSize="10" x={xScale(idx%col)} y={yScale(Math.floor(idx/col))} fontFamily="monospace">{codon}</text>
		}
		function amino_renderer(amino, idx){
			return <text fontSize="10" x={xScale(idx%col)} y={yScale(Math.floor(idx/col))+10} fontFamily="monospace">{amino}</text>
		}
		function axis_renderer(x){
			return <text x={xScale(x)-10} y="10" fontSize="10" fontFamily="monospace">{x}</text>
		}
		return <g>
			{[5,10,15,20,25].map( (x) => axis_renderer(x) )}
			<text x="10" y={yScale(0)} fontSize="10" fontFamily="monospace">5'-</text>
			{this.props.codon_seq.map( (codon, idx) => codon_renderer(codon, idx) )}
			{this.props.amino_seq.map( (amino, idx) => amino_renderer(amino, idx) )}
			<text x={xScale(25)} y={d3.max([yScale(Math.floor((this.props.codon_seq.length-1)/col)), yScale(0)])} fontSize="10" fontFamily="monospace">-3'</text>
		</g>
	}

	translated_FASTA_download(e){
		var amino_seq_FASTA= this.props.amino_seq.map( (amino) => this.state.amino_FASTA_map[amino]? this.state.amino_FASTA_map[amino]:"" ).reduce( (a,b) => a+b );
		var file= new File([">"+this.props.codon_translation_organism+" translation table\n", amino_seq_FASTA], "codon_translation.txt", {type:"text/plain"});
		saveAs(file);
	}

	render(){
		var col= 25;
		var col_size= 20;
		var padding= 30;
		var width= col*col_size+padding*2;
		var height= Math.floor((this.props.codon_seq.length-1)/col)*30+ padding*2;

		var xScale= d3.scaleLinear().domain([0, col]).range([padding, width- padding]);
		var yScale= d3.scaleLinear().domain([0, Math.floor((this.props.codon_seq.length-1)/col)]).range([padding, height- padding]);
		return <div className="col-sm-12">
			<svg width={width} height={height}>
				{this.render_codon_translation(xScale, yScale, col)}
			</svg>
			<br/>
			<button type="button" className="btn btn-default" onClick={ (e) => this.translated_FASTA_download(e)}>Download Translation FASTA Format</button>
		</div>
	}
}
