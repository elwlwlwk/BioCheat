class CodonAdaptation extends React.Component{
	constructor(props){
		super(props);
		this.state={
			col_size: 50,
			col_max: 12,
			padding: 30,
			top_padding: 50,
			row_size: 160,
		}
	}

	calc_codon_ratio(){
		var codon_count= new Map();
		var codon_ratio= new Map();
		var codon_total= 0;
		this.props.codon_seq.map( (codon) => {
			if(codon.join("").length!=3)
				return;
			if(!codon_count.get(codon.join("")))
				codon_count.set(codon.join(""), 0);
			codon_count.set(codon.join(""),codon_count.get(codon.join(""))+1);
		} )

		if(this.props.codon_seq.length)
			codon_total= this.props.codon_seq.slice(-1)[0].length<3? this.props.codon_seq.length-1:this.props.codon_seq.length;

		codon_count.forEach( (val, key) => {
			codon_ratio.set(key, ((val/codon_total)*1000).toFixed(3));
		})

		return codon_ratio;
	}

	render_adaptation_graph(usage_table, amino_y_pos_idx, selected_adaptation_index, input_adaptation_index, xScale, yScale){
		var max_bar_height= this.state.row_size-60;
		var barScale= d3.scaleLinear().domain([0, 1]).range([0, max_bar_height]);
		return Array.from(new Set(Object.keys(amino_y_pos_idx).map( (key) => amino_y_pos_idx[key] ))).map( (y_pos) => {
			var aminos= Object.keys(amino_y_pos_idx).filter( (amino) => amino_y_pos_idx[amino] == y_pos );
			return <g>
				{aminos.map( (amino) => usage_table[amino] ).reduce( (a, b) => a.concat(b) ).map( (codon, idx) => {
					return <g>
						<text x={xScale(idx)-11} y={yScale(y_pos)} fontSize="10">{input_adaptation_index[codon]}</text>
						<text x={xScale(idx)+11} y={yScale(y_pos)} fontSize="10">{selected_adaptation_index[codon]}</text>
						<rect x={xScale(idx)-3} y={yScale(y_pos)+max_bar_height-barScale(input_adaptation_index[codon])+5} width="10" height={barScale(input_adaptation_index[codon])} fill="steelblue"></rect>
						<rect x={xScale(idx)+13} y={yScale(y_pos)+max_bar_height-barScale(selected_adaptation_index[codon])+5} width="10" height={barScale(selected_adaptation_index[codon])}>></rect>
						<text x={xScale(idx)} y={yScale(y_pos)+ max_bar_height+15} fontSize="10">{codon}</text>
					</g>
				})}
				{aminos.map( (amino, idx, aminos) => {
					var x_idx= [0].concat(aminos.slice(0, idx).map( (amino) => usage_table[amino].length )).reduce( (a, b) => a+b );
					return <text x={xScale(x_idx)-10} y={yScale(y_pos)+max_bar_height+30}>| {amino}</text>
				})}
			</g>
		})
	}

	render(){
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

		var amino_y_pos_idx={};
		var y_pos_sum= 0;
		var y_pos_idx= 0;
		Object.keys(usage_table).forEach( function(key, idx){
			y_pos_sum+= usage_table[key].length;
			if(y_pos_sum/ this.state.col_max>1){
				y_pos_sum=usage_table[key].length;
				y_pos_idx++;
			}
			amino_y_pos_idx[key]= y_pos_idx;
		}.bind(this))

		var selected_adaptation_index={};
		Object.keys(usage_table).map( function(amino){
			var codons= usage_table[amino];
			var indexScale= d3.scaleLinear().domain([0, d3.max(codons.map( (codon) => parseFloat(this.props.codon_ratio.get(codon))?parseFloat(this.props.codon_ratio.get(codon)):0 ))]).range([0, 1]);
			codons.forEach( function(codon){
				selected_adaptation_index[codon]= indexScale(parseFloat(this.props.codon_ratio.get(codon))?parseFloat(this.props.codon_ratio.get(codon)):0).toFixed(2);
			}.bind(this))
		}.bind(this))

		var input_codon_ratio= this.calc_codon_ratio();
		var input_adaptation_index={};
		Object.keys(usage_table).map( function(amino){
			var codons= usage_table[amino];
			var indexScale= d3.scaleLinear().domain([0, d3.max(codons.map( (codon) => parseFloat(input_codon_ratio.get(codon))?parseFloat(input_codon_ratio.get(codon)):0 ))]).range([0, 1]);
			codons.forEach( function(codon){
				input_adaptation_index[codon]= indexScale(parseFloat(input_codon_ratio.get(codon))?parseFloat(input_codon_ratio.get(codon)):0).toFixed(2);
			}.bind(this))
		}.bind(this))

		var width= this.state.col_size* this.state.col_max+ this.state.padding*2;
		var height= this.state.row_size* (d3.max(Object.keys(amino_y_pos_idx).map( (key) => amino_y_pos_idx[key] ))+1)+ this.state.padding+ this.state.top_padding;
		var xScale= d3.scaleLinear().domain([0, this.state.col_max]).range([this.state.padding, width-this.state.padding]);
		var yScale= d3.scaleLinear().domain([0, d3.max(Object.keys(amino_y_pos_idx).map( (key) => amino_y_pos_idx[key] ))+1]).range([this.state.top_padding, height- this.state.padding]);

		return <svg width={width} height={height}>
			<text x={width/2-60} y={20}>Codon Adaptation Index</text>
			{this.render_adaptation_graph(usage_table, amino_y_pos_idx, selected_adaptation_index, input_adaptation_index, xScale, yScale)}
		</svg>
	}
}
