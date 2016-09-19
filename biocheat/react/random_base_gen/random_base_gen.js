requirejs([], function(){

class RandomBaseGenerator extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return <div class="col-sm-12">
			<p>
				Length: <input type="text"></input>bp
			</p>
			<p>
				<textarea>test</textarea>
			</p>
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<RandomBaseGenerator/>, mountingPoint);

});
