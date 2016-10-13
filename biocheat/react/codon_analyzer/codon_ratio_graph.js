class CodonRatio extends React.Component{
	constructor(props){
		super(props);
		this.state={
			col: 4,
			col_size: 160,
			row_size: 40,
			padding: 30,
			upper_padding: 60,
		}
	}

	render_codon_ratio(codon, idx, xScale, yScale, ratioScale, codon_ratio){
		return <g>
			<text x={xScale(idx%this.state.col)} y={yScale(Math.floor(idx/this.state.col))} fontSize="10">{codon}</text>
			<rect x={xScale(idx%this.state.col)+25} y={yScale(Math.floor(idx/this.state.col))-15} height="10" width={ratioScale(codon_ratio.get(codon))} fill="steelblue"/>
			<rect x={xScale(idx%this.state.col)+25} y={yScale(Math.floor(idx/this.state.col))-3} height="10" width={ratioScale(this.props.codon_ratio.get(codon))}/>
			<text x={xScale(idx%this.state.col)+this.state.col_size-40} y={yScale(Math.floor(idx/this.state.col))-6} fontSize="10">{codon_ratio.get(codon)?codon_ratio.get(codon):(0).toFixed(3)}</text>
			<text x={xScale(idx%this.state.col)+this.state.col_size-40} y={yScale(Math.floor(idx/this.state.col))+6} fontSize="10">{this.props.codon_ratio.get(codon)?this.props.codon_ratio.get(codon):(0).toFixed(3)}</text>
		</g>;
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

	render(){
		var base_set=["U", "C", "A" ,"G"];
		var base_combi=[];

		base_set.forEach( (i) => {
			base_set.forEach( (j) => {
				base_set.forEach( (k) => {
					base_combi.push(i+j+k);
				})
			})
		});

		var codon_ratio= this.calc_codon_ratio();

		var width= this.state.col_size*this.state.col+ this.state.padding*2;
		var height= this.state.row_size*Math.floor((base_combi.length-1)/this.state.col)+ this.state.padding+ this.state.upper_padding;

		var xScale= d3.scaleLinear().domain([0, this.state.col]).range([this.state.padding, width- this.state.padding]);
		var yScale= d3.scaleLinear().domain([0, Math.floor((base_combi.length-1)/this.state.col)]).range([this.state.upper_padding, height- this.state.padding]);
		var ratioScale= d3.scaleLinear().domain([0, d3.max(Array.from(codon_ratio.values()).concat(Array.from(this.props.codon_ratio.values())).map( (d) => parseFloat(d) ))]).range([0, this.state.col_size-70]);

		return <svg width={width} height={height}>
			<text x={width/2-60} y={20}>Codon Ratio</text>
			<text x={width-80} y={30} fontSize="10">(‰)</text>
			{base_combi.map( (codon, idx) => this.render_codon_ratio(codon, idx, xScale, yScale, ratioScale, codon_ratio) )}
		</svg>;
	}
}
