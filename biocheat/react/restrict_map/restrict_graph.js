class RestrictGraph extends React.Component{
	expect_overlapped(markers){
		return markers;
	}

	find_restrict_map(markers){

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
			var affinity_a_b=[];
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

				affinity_a_b.push({a:d3.max(a_affinity), b:d3.max(b_affinity)})
			});
			return [affinity, affinity_a_b];
		}

		switch(this.props.digest_manner){
			case "double":
				var markers_a= markers.filter( (marker) => marker[0]== 1 );
				var markers_b= markers.filter( (marker) => marker[0]== 2 );
				var markers_a_b= markers.filter( (marker) => marker[0]== 3 );

				var comb_a= find_all_combi(markers_a.map( (e) => e[2] ));
				var comb_b= find_all_combi(markers_b.map( (e) => e[2] ));
				var comb_a_b= find_all_combi(markers_a_b.map( (e) => e[2] ));

				var result=[];
				
				comb_a.forEach( (a) => {
					comb_b.forEach( (b) =>{
						comb_a_b.forEach( (a_b) =>{
							var affinity= calc_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
							result.push([affinity[0], a.slice(0), b.slice(0), a_b.slice(0), affinity[1]]);
						})
					})
				})
				return result.sort( (r1, r2) => r1[0]< r2[0]? 1: -1 );

				break;
			case "partial":
				break;
		}
	}

	render_restrict_map(restrict_map, fragScale, label){
		switch(this.props.DNA_form){
			case "linear":
				//var fragScale= d3.scaleLinear().domain([0, restrict_maps[0][3].reduce( (a, b) => a+b )]).range([0, this.props.width- this.props.padding*2])
				return <div><LinearRestrictMap {...this.props} favorite={restrict_map} fragScale={fragScale} padding={30} label={label}/></div>
				break;
			case "circular":
				break;
		}
	}

	render(){
		var col_length= [];
		var cols= new Set(this.props.markers.map( (marker) => marker[0] ));
		if (this.props.exclude_ladder){
			cols.delete(0);
		}
		var frag_padding= 25;
		cols.forEach((col) => col_length.push(this.props.markers.filter( (marker) => marker[0]==col).map( (marker) => Math.round(parseFloat(marker[2])) ).reduce( (a, b) => a+b )));

		var height= this.props.row_padding* cols.size+ this.props.padding*2;
		var fragScale= d3.scaleLinear().domain([0, d3.max(col_length)]).range( [0, this.props.width- (this.props.padding)- this.props.label_padding- frag_padding* d3.max([...cols].map( (col) => this.props.markers.filter( (marker) => marker[0]== col )), (col)=> col.length )] );
		var yScale= d3.scaleLinear().domain([d3.min([...cols]), d3.max([...cols])]).range([this.props.padding, height-this.props.padding]);

		var scale={fragScale: fragScale, yScale: yScale};

		var restrict_maps= this.find_restrict_map(this.expect_overlapped(this.props.markers));

		return <div>
			<div>
				<svg width={this.props.width} height={height}>
					<FragmentGraph {...this.props} {...scale} cols={cols} frag_padding={frag_padding}/>
				</svg>
			</div>
			<div>
				{this.render_restrict_map(restrict_maps[0], fragScale, "restrict_map")}
			</div>
			<div>
				<div id="candidate_div" className="collapse">
					{restrict_maps.map( (restrict_map, idx) => this.render_restrict_map(restrict_map, fragScale, idx+1) )}
				</div>
				<div>
					<button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#candidate_div">Show All Candidates</button>
				</div>
			</div>
		</div>;
	}
}

class FragmentGraph extends React.Component{
	render_fragment(marker, idx, row){
		var x= this.props.fragScale([0].concat(row.slice(0, idx).map( (mark) => mark[2] )).reduce( (a, b) => a+b ))+ this.props.frag_padding* idx+ this.props.label_padding;
		return <g>
			<text x={x} y={this.props.yScale(marker[0])-4} fontSize="10px" key={"enzyme"+idx}>{Math.round(marker[2])}</text>
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
	render_len(marker, idx){
		var x= this.props.fragScale([0].concat(this.props.favorite[3].slice(0, idx)).reduce( (a, b) => a+b ) )+ this.props.label_padding;
		return <text x={x} y={50} fontSize="10px" key={idx}>{Math.round(marker)}</text>
	}

	render_restrict_point(markers, marker, idx){
		var x= this.props.fragScale([0].concat(this.props.favorite[3].slice(0, idx)).reduce( (a, b) => a+b )+ marker )+ this.props.label_padding;
		function get_label(markers, marker_label){
			if(markers[4][idx].a> markers[4][idx].b){
				return marker_label[1][1];
			}
			else{
				return marker_label[2][1];
			}
		}
		return <g key={idx}>
			<text x={x} y={28} fontSize="10px" key={"label"+idx}>{get_label(markers, this.props.marker_label)}</text>
			<rect x={x} y={30} width={2} height={5} key={"restrict_site"+idx}/>
		</g>
	}

	render(){
		return <svg width={this.props.width} height={70}>
			<text x={0} y={35} fontSize="10" key={this.props.label}>{this.props.label}</text>
			<rect width={this.props.fragScale(this.props.favorite[3].reduce( (a, b) => a+b ))} x={this.props.label_padding} y={35} height={2}/>
			{this.props.favorite[3].map( (marker, idx) => this.render_len(marker, idx) )}
			{this.props.favorite[3].slice(0,-1).map( (marker, idx) => this.render_restrict_point(this.props.favorite, marker, idx) )}
		</svg>
	}
}
