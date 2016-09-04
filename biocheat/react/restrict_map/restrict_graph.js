class RestrictGraph extends React.Component{
	constructor(props){
		super(props);
		this.state={
			markers: this.expect_overlapped(props.markers),
		}
	}

	expect_overlapped(markers){
		return markers;
	}

	find_restrict_map(){

		function relative_mapper(markers){
			var scale= d3.scaleLinear().domain([0, markers.reduce( (a, b) => a+b )]).range([0, 100]);
			return markers.map( (marker) => scale(marker) );
		}

		function find_all_combi(elem){
			var combi=[]
			function perm(arr, n){
				if (n== 0){
					combi.push(arr.slice(0));
					return;
				}
				for(var i= n-1; i>=0; i--){
					var temp= arr[i];
					arr[i]= arr[n-1];
					arr[n-1]= temp;
	
					perm(arr, n-1);
	
					var temp= arr[i];
					arr[i]= arr[n-1];
					arr[n-1]= temp;
				}
			}
			perm(elem, elem.length);
			return combi;
		}

		function calc_affinity(a, b, a_b){
			var affinity=0;
			var pos_a_b=0;
			a_b.slice(0, -1).forEach( (e_a_b) => {
				pos_a_b+= e_a_b;

				var a_affinity=[];
				var pos_a=0;
				a.slice(0,-1).forEach( (e_a) => {
					pos_a+= e_a;
					a_affinity.push( Math.exp(Math.abs(pos_a_b- pos_a)* -1) );
				})
				affinity+= d3.max(a_affinity);

				var b_affinity=[];
				var pos_b=0;
				b.slice(0,-1).forEach( (e_b) => {
					pos_b+= e_b;
					b_affinity.push( Math.exp(Math.abs(pos_a_b- pos_b)* -1) );
				})
				affinity+= d3.max(b_affinity);
			});
			return affinity;
		}

		switch(this.props.digest_manner){
			case "double":
				var markers_a= this.state.markers.filter( (marker) => marker[0]== 1 );
				var markers_b= this.state.markers.filter( (marker) => marker[0]== 2 );
				var markers_a_b= this.state.markers.filter( (marker) => marker[0]== 3 );

				var comb_a= find_all_combi(markers_a.map( (e) => e[2] ));
				var comb_b= find_all_combi(markers_b.map( (e) => e[2] ));
				var comb_a_b= find_all_combi(markers_a_b.map( (e) => e[2] ));

				var result=[];
				
				comb_a.forEach( (a) => {
					comb_b.forEach( (b) =>{
						comb_a_b.forEach( (a_b) =>{
							var affinity= calc_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
							result.push([affinity, a.slice(0), b.slice(0), a_b.slice(0)]);
						})
					})
				})
				return result.sort( (r1, r2) => r1[0]< r2[0]? 1: -1 );

				break;
			case "partial":
				break;
		}
	}

	render_restrict_map(restrict_maps){
		switch(this.props.DNA_form){
			case "linear":
				return <LinearRestrictMap {...this.props} restrict_maps={restrict_maps} />
				break;
			case "circular":
				break;
		}
	}

	render(){
		var col_length= [];
		var cols= new Set(this.state.markers.map( (marker) => marker[0] ));
		if (this.props.exclude_ladder){
			cols.delete(0);
		}
		var frag_padding= 25;
		cols.forEach((col) => col_length.push(this.state.markers.filter( (marker) => marker[0]==col).map( (marker) => Math.round(parseFloat(marker[2])) ).reduce( (a, b) => a+b )));

		var height= this.props.row_padding* cols.size+ this.props.padding*2;
		var fragScale= d3.scaleLinear().domain([0, d3.max(col_length)]).range( [0, this.props.width- (this.props.padding)*2- frag_padding* d3.max([...cols].map( (col) => this.state.markers.filter( (marker) => marker[0]== col )), (col)=> col.length )] );
		var yScale= d3.scaleLinear().domain([d3.min([...cols]), d3.max([...cols])]).range([this.props.padding, height-this.props.padding]);

		var scale={fragScale: fragScale, yScale: yScale};

		var restrict_maps= this.find_restrict_map();

		return <div>
			<div>
				<svg width={this.props.width} height={height}>
					<FragmentGraph {...this.props} {...scale} cols={cols} frag_padding={frag_padding}/>
				</svg>
			</div>
			<div>
				{this.render_restrict_map(restrict_maps)}
			</div>
		</div>;
	}
}

class FragmentGraph extends React.Component{
	render_fragment(marker, idx, row){
		var x= this.props.fragScale([0].concat(row.slice(0, idx).map( (mark) => mark[2] )).reduce( (a, b) => a+b ))+ this.props.frag_padding* idx+ parseInt(this.props.label_padding);
		return <g>
			<text x={x} y={this.props.yScale(marker[0])-4} fontSize="10px">{Math.round(marker[2])}</text>
			<rect width={this.props.fragScale(marker[2])} height="2" x={x} y={this.props.yScale(marker[0])} key={idx}/>
		</g>;
	}

	render_label(label){
		return <text x={0} y={this.props.yScale(label[0])} fontSize="10" key={label[0]}>{label[1]}</text>
	}

	render(){
		var markers= this.props.markers.filter( (marker) => this.props.cols.has(marker[0]) );
		return <g>
			{this.props.marker_label.filter( (label) => this.props.cols.has(label[0]) ).map( (label) => this.render_label(label) )}
			{[...this.props.cols].map( (col) => this.props.markers.filter( (marker) => marker[0]== col ) ).map( (row) => row.map( (marker, idx) => this.render_fragment(marker, idx, row) ) )}
		</g>;
	}
}

class LinearRestrictMap extends React.Component{
	render_map(){
		return <rect width={} height="2" x={} y={}>
	}
	render(){
		var favorite= this.props.restrict_maps[0];
		return <svg width={this.props.width} height={70}>
			{favorite[3].map( (marker) => this.render_fragment(marker, idx) )}
		</svg>
	}
}
