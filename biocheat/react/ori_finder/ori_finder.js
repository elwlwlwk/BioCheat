requirejs([], function(){

class OriFinder extends React.Component{
	render(){

		return <div className="col-sm-12">
		</div>
	}
}

const mountingPoint= document.createElement('div');
mountingPoint.className= 'react-app';
document.getElementById("div_application").appendChild(mountingPoint);
ReactDOM.render(<CpGIsland/>, mountingPoint);

});
