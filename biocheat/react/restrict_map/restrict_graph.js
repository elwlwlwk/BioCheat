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

		function calc_linear_double_affinity(a, b, a_b){
			var affinity=0;
			var pos_a_b=0;
			var affinity_a_b=[];
			a_b.slice(0, -1).forEach( (e_a_b) => {
				pos_a_b+= e_a_b;

				var a_affinity=[];
				var pos_a=0;
				a.slice(0,-1).forEach( (e_a) => {
					pos_a+= e_a;
					a_affinity.push( Math.exp(Math.pow(pos_a_b- pos_a, 2)* -0.1) );
				})

				var b_affinity=[];
				var pos_b=0;
				b.slice(0,-1).forEach( (e_b) => {
					pos_b+= e_b;
					b_affinity.push( Math.exp(Math.pow(pos_a_b- pos_b, 2)* -0.1) );
				})
				affinity+= d3.max(a_affinity.concat(b_affinity));

				affinity_a_b.push({a:d3.max(a_affinity), b:d3.max(b_affinity)})
			});
			return [affinity, affinity_a_b];
		}

		function calc_circular_double_affinity(a, b, a_b){
			var pos_a= [0];
			var pos_b=[0];
			var pos_a_b=[0];

			a.slice(0,-1).forEach( (e_a, idx, a) => {
				pos_a.push(a.slice(0,idx+1).reduce( (a,b)=> a+b ));
			})
			b.slice(0,-1).forEach( (e_b, idx, b) => {
				pos_b.push(b.slice(0,idx+1).reduce( (a,b)=> a+b ));
			})
			a_b.slice(0,-1).forEach( (e_a_b, idx, a_b) => {
				pos_a_b.push(a_b.slice(0,idx+1).reduce( (a,b)=> a+b ));
			})

			function rotate_DNA(pos, distance){
				return pos.map( (p) => p+distance>=100? p+distance-100: p+distance )
			}

			var affinities=[];
			pos_a_b.forEach( (e_a_b, idx_a_b, p_a_b) => {
				var a_start_pos= e_a_b;

				pos_a_b.forEach( (e_a_b) => {
					var b_start_pos= e_a_b;

					var rotated_a= rotate_DNA(pos_a, a_start_pos).sort();
					var rotated_b= rotate_DNA(pos_b, b_start_pos).sort();

					var rotation_affinity= 0;
					var rotation_affinity_a_b=[];

					pos_a_b.forEach( (p_a_b) => {
						var a_affinity=[];
						rotated_a.forEach( (r_a) => {
							a_affinity.push( Math.exp(Math.pow(p_a_b- r_a, 2)* -0.1) );
						});
						var b_affinity=[];
						rotated_b.forEach( (r_b) => {
							b_affinity.push( Math.exp(Math.pow(p_a_b- r_b, 2)* -0.1) );
						});
						rotation_affinity+= d3.max(a_affinity.concat(b_affinity));
						rotation_affinity_a_b.push({a: d3.max(a_affinity), b: d3.max(b_affinity)});
					})
					affinities.push([rotation_affinity, rotation_affinity_a_b, a_start_pos, b_start_pos]);
				})
			})
			return affinities.sort( (a,b) => a[0]<b[0] )[0];
		}

		function remove_duplications(combis, DNA_form){
			var result=[];
			switch(DNA_form){
				case "linear":
					combis.forEach( (combi) => {
						if(!result.map( (r) => JSON.stringify(r) ).includes(JSON.stringify(combi.slice(0).reverse()))){
							result.push(combi);
						}
					})
					break;
				case "circular":
					function rotate(arr){
						return arr.slice(-1).concat(arr.slice(0, -1));
					}
					result.push(combis[0]);
					combis.forEach( (combi) => {
						var dupli= false;
						for(var i in result){
							var comp= result[i].slice(0);
							while(combi[0]!= comp[0]){
								comp= rotate(comp);
							}
							if(JSON.stringify(comp)== JSON.stringify(combi)){
								dupli= true;
								break;
							}
						}
						if(!dupli){
							result.push(combi);
						}
					})
					break;
			}
			return result;
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

				comb_a_b= remove_duplications(comb_a_b, this.props.DNA_form);
				
				comb_a.forEach( (a) => {
					comb_b.forEach( (b) =>{
						comb_a_b.forEach( (a_b) =>{
							switch(this.props.DNA_form){
								case "linear":
									var affinity= calc_linear_double_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
									break;
								case "circular":
									var affinity= calc_circular_double_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
									break;
							}
							result.push([affinity[0], a.slice(0), b.slice(0), a_b.slice(0), affinity[1]]);
						})
					})
				})
				return result.sort( (r1, r2) => r1[0]< r2[0]? 1: -1 );
			case "partial":
				break;
		}
	}

	render_restrict_map(restrict_map, fragScale, label){
		switch(this.props.DNA_form){
			case "linear":
				//var fragScale= d3.scaleLinear().domain([0, restrict_maps[0][3].reduce( (a, b) => a+b )]).range([0, this.props.width- this.props.padding*2])
				return <div>
					<LinearRestrictMap {...this.props} restrict_map={restrict_map} fragScale={fragScale} padding={30} label={label}/>
				</div>
			case "circular":
				return <div>
					<CircularRestrictMap {...this.props} restrict_map={restrict_map} width={250} height={250} padding={25} label={label}/>
				</div>
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
					(sorted by affinity)
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
		var x= this.props.fragScale([0].concat(this.props.restrict_map[3].slice(0, idx)).reduce( (a, b) => a+b ) )+ this.props.label_padding;
		return <text x={x} y={50} fontSize="10px" key={idx}>{Math.round(marker)}</text>
	}

	render_restrict_point(markers, marker, idx){
		var x= this.props.fragScale([0].concat(this.props.restrict_map[3].slice(0, idx)).reduce( (a, b) => a+b )+ marker )+ this.props.label_padding;
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
			<rect width={this.props.fragScale(this.props.restrict_map[3].reduce( (a, b) => a+b ))} x={this.props.label_padding} y={35} height={2}/>
			{this.props.restrict_map[3].map( (marker, idx) => this.render_len(marker, idx) )}
			{this.props.restrict_map[3].slice(0,-1).map( (marker, idx) => this.render_restrict_point(this.props.restrict_map, marker, idx) )}
		</svg>
	}
}

class CircularRestrictMap extends React.Component{
	constructor(props){
		super(props);
		this.state={
			bias: 0,
		}
	}
	render_fragment(fragment, idx){
		var fragScale= d3.scaleLinear().domain([0, this.props.restrict_map[3].reduce( (a, b) => a+b )]).range([0, Math.PI*2]);
		var start_angle= fragScale( [0].concat(this.props.restrict_map[3].slice(0,idx)).reduce( (a,b) => a+b ) )+this.state.bias;
		var end_angle= start_angle+ fragScale(fragment);
		var arc= d3.arc().innerRadius(this.props.width/2-this.props.padding-10).outerRadius(this.props.width/2-this.props.padding).startAngle(start_angle).endAngle(end_angle);

		return <g>
			<path d={arc()} id="1" stroke="black" strokeWidth="2" fill="none" transform={`translate(${this.props.width/2},${this.props.width/2})`}/>
		</g>
	}
	render_label(fragment, idx){
		var fragScale= d3.scaleLinear().domain([0, this.props.restrict_map[3].reduce( (a, b) => a+b )]).range([0, Math.PI*2]);
		var start_angle= fragScale( [0].concat(this.props.restrict_map[3].slice(0,idx)).reduce( (a,b) => a+b ) )+this.state.bias;
		var end_angle= start_angle+ fragScale(fragment);
		var arc= d3.arc().innerRadius(this.props.width/2-this.props.padding).outerRadius(this.props.width/2- this.props.padding).startAngle(start_angle).endAngle(end_angle);
		var marker_label= this.props.restrict_map[4][idx].a> this.props.restrict_map[4][idx].b? this.props.marker_label[1][1]: this.props.marker_label[2][1]
		var textpath= `<textpath xlink:href=${"#"+this.props.label+"label_path_"+idx}>${marker_label}</textpath>`;
		return <g>
			<defs>
				<path id={this.props.label+"label_path_"+idx} d={arc()} stroke="red" strokeWidth="2" fill="none" transform={`translate(${this.props.width/2},${this.props.width/2})`}/>
			</defs>
			<text fontSize="10px" dangerouslySetInnerHTML={{__html: textpath }}></text>
		</g>
	}
	render_length(fragment, idx){
		var fragScale= d3.scaleLinear().domain([0, this.props.restrict_map[3].reduce( (a, b) => a+b )]).range([0, Math.PI*2]);
		var start_angle= fragScale( [0].concat(this.props.restrict_map[3].slice(0,idx)).reduce( (a,b) => a+b ) )+this.state.bias;
		var end_angle= start_angle+ fragScale(fragment);
		var arc= d3.arc().innerRadius(this.props.width/2-this.props.padding-20).outerRadius(this.props.width/2- this.props.padding-20).startAngle(start_angle).endAngle(end_angle);
		var marker_label= this.props.restrict_map[4][idx].a> this.props.restrict_map[4][idx].b? this.props.marker_label[1][1]: this.props.marker_label[2][1]
		var textpath= `<textpath xlink:href=${"#"+this.props.label+"length_path_"+idx}>${Math.round(fragment)}</textpath>`;
		return <g>
			<defs>
				<path id={this.props.label+"length_path_"+idx} d={arc()} stroke="red" strokeWidth="2" fill="none" transform={`translate(${this.props.width/2},${this.props.width/2})`}/>
			</defs>
			<text fontSize="10px" dangerouslySetInnerHTML={{__html: textpath }}></text>
		</g>
	}
	render(){
		var mask_arc= d3.arc().innerRadius(this.props.width/2-this.props.padding).outerRadius(this.props.width/2-this.props.padding).startAngle(0).endAngle(Math.PI*2);
		return <svg width={this.props.width} height={this.props.height} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
			<text x={0} y={35} fontSize="10" key={this.props.label}>{this.props.label}</text>
			{ this.props.restrict_map[3].map((fragment, idx) => this.render_fragment(fragment, idx)) }
			<path d={mask_arc()} stroke="white" strokeWidth="4" fill="none" transform={`translate(${this.props.width/2},${this.props.width/2})`}/>
			{ this.props.restrict_map[3].map((fragment, idx) => this.render_label(fragment, idx)) }
			{ this.props.restrict_map[3].map((fragment, idx) => this.render_length(fragment, idx)) }
		</svg>;
	}
}
