requirejs([], function(){

class CpGIsland extends React.Component{
	constructor(props){
		super(props);
		this.state={
			base_input: "",
			base_seq: [],
			obs_exp_threshold: 0.6,
			GC_content_threshold: 0.5,
			scanning_window_size: 200,
			highlight_CpG: true,
		}
	}

	base_textarea_changed(e){
		var base_seq= e.target.value.toUpperCase().replace(/[^ATUCG]/g,"").trim().split("");

		this.setState({
			base_input: e.target.value,
			base_seq: base_seq,

		});
	}

	FASTA_file_changed(e){
		var reader= new FileReader();
		var base_seq= e.target.result.replace(/^>.+\n/,"").toUpperCase().replace(/[^ATUCG]/g,"").trim().split("");

		reader.onload= function (e){
			this.setState({
				base_input: e.target.result.replace(/^>.+\n/,""),
				base_seq: base_seq,
			})

		}.bind(this);
		reader.readAsText(e.target.files[0]);
	}

	detect_CpG_island(){
		var num_c=0;
		var num_g=0;
		var num_cg=0;
		var scanning_window=[];

		var CpG_islands=[];

		this.state.base_seq.forEach( (base, idx) => {
			var prev_input= scanning_window.slice(-1);
			scanning_window.push(base);

			if(base== "C"){
				num_c++;
			}else if(base=="G"){
				num_g++;
			}
			if(prev_input=="C" && base=="G"){
				num_cg++;
			}

			if(scanning_window.length< this.state.scanning_window_size){
				return;
			}

			if(scanning_window.length> this.state.scanning_window_size){
				var base_to_loss= scanning_window.shift();
				if(base_to_loss== "C"){
					num_c--;
				}
				if(base_to_loss== "G"){
					num_g--;
				}
				if(base_to_loss=="C" && scanning_window[0]=="G"){
					num_cg--;
				}
			}

			var obs_exp= num_cg/((num_c* num_g)/scanning_window.length);
			var GC_content= (num_c+ num_g)/scanning_window.length

			if(obs_exp>this.state.obs_exp_threshold && GC_content>this.state.GC_content_threshold){
				CpG_islands.push([idx, obs_exp, GC_content]);
			}
		})
		return CpG_islands;
	}

	obs_exp_threshold_changed(e){
		this.setState({
			obs_exp_threshold: parseFloat(e.target.value),
		})
	}

	gc_content_threshold_changed(e){
		this.setState({
			GC_content_threshold: parseFloat(e.target.value),
		})
	}

	scanning_window_size_changed(e){
		this.setState({
			scanning_window_size: parseInt(e.target.value),
		})
	}

	render_CpG_islands(CpG_islands){
		var scanning_window_size= this.state.scanning_window_size;
		return <div id="CpG_island_list_div" className="collapse in">
			<ul className="list-unstyled">
				{CpG_islands.map( (e)=> {
					return <li>
						CpG island at <b>{e[0]-scanning_window_size+2}</b> to <b>{e[0]+1}</b> (Obs/Exp={e[1]}, GC Content={e[2]})
					</li>
				})}
			</ul>
		</div>
	}

	render_CpG_island_graph(CpG_islands){
		const divStyle={
			fontFamily: "Courier, monospace",
		}
		const spanStyle={
			CpG_island: {
				backgroundColor: 'yellow',
			},
			CpG_site: {
				color: 'red',
			},
			CpG_site_in_island: {
				color: 'red',
				backgroundColor: 'yellow',
			},
		}
		var island_site= CpG_islands.map( (e) => e[0]-this.state.scanning_window_size+1 ).sort( (a,b) => a-b );
		var CpG_site=function(base_seq){
			var CpG_site=[];
			for(var i=0; i< base_seq.length-1; i++){
				if(base_seq[i]=="C" && base_seq[i+1]=="G"){
					CpG_site.push(i);
				}
			}
			return CpG_site.sort( (a,b) => a-b );
		}(this.state.base_seq);

		var col_size= 50;
		var base_mat= function(base_seq, island_site, CpG_site, scanning_window_size){
			var rows=[];
			var base_seq= base_seq.slice(0).map( (base, idx) => {
				var in_island= false;
				var in_CpG= false
				for(var i=0; i< island_site.length; i++){
					if(idx>=island_site[i] && idx<island_site[i]+scanning_window_size){
						in_island= true;
						break;
					}
				}
				for(var i=0; i< CpG_site.length; i++){
					if(idx>=CpG_site[i] && idx<CpG_site[i]+2){
						in_CpG= true;
						break;
					}
				}
				if(in_island && in_CpG){
					return ['island_CpG', base];
				}
				else if(in_island){
					return ['island', base];
				}
				else if(in_CpG){
					return ['CpG', base];
				}
				else{
					return ['normal', base];
				}
			} );
			var island_site= island_site.slice(0);

			while(base_seq.length!= 0){
				rows.push(base_seq.splice(0, col_size));
			}
			return rows;
		}(this.state.base_seq, island_site, CpG_site, this.state.scanning_window_size)

		return <div style={divStyle}>
			{ base_mat.map( (row) => {
				return <p>
					{ row.map( (col) => {
						switch(col[0]){
							case "normal":
								return col[1]
							case "island":
								return <span style={spanStyle['CpG_island']}>
									{col[1]}
								</span>
							case 'CpG':
								return <span style={spanStyle['CpG_site']}>
									{col[1]}
								</span>
							case 'island_CpG':
								return <span style={spanStyle['CpG_site_in_island']}>
									{col[1]}
								</span>
						}
					} )}
				</p>
			} )}
		</div>
	}

	render(){

		var CpG_islands= this.detect_CpG_island();

		return <div className="col-sm-12">
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Obs/Exp Threshold (0-1)</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.obs_exp_threshold_changed(e)} defaultValue={this.state.obs_exp_threshold} />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">GC Content Threshold (0-1)</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.gc_content_threshold_changed(e)}defaultValue={this.state.GC_content_threshold} />
				</div>
			</div>
			<div className="col-sm-12 form-group">
				<label className="col-sm-3">Scanning Window Size (bp)</label>
				<div className="col-sm-4">
					<input className="form-control" onChange={(e) => this.scanning_window_size_changed(e)} defaultValue={this.state.scanning_window_size} />
				</div>
			</div>
			<div className="col-sm-12">
				<textarea className="form-control" rows="10" onChange={(e) => this.base_textarea_changed(e)} value={this.state.base_input}></textarea>
				<div className="form_group">
					<label>Upload FASTA file</label>
					<input type="file" onChange={ (e) => this.FASTA_file_changed(e) } />
				</div>
			</div>
			<div className="col-sm-12">
				<div>
					<button type="button" className="btn btn-primary" data-toggle="collapse" data-target="#CpG_island_list_div">Fold CpG Island List</button>
				</div>
				{this.render_CpG_islands(CpG_islands)}
			</div>
			<div className="col-sm-12">
				<div>
				</div>
				{this.render_CpG_island_graph(CpG_islands)}
			</div>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<CpGIsland/>, mountingPoint);

});
