var Header = React.createClass({
    getInitialState: function(){
        return ({
            
        });
    },
	contextTypes: {
		appState: React.PropTypes.func,
		user: React.PropTypes.string,
		page: React.PropTypes.string
	},
    componentWillMount: function(){
        
    },
    render: function(){
        return (
            <header className="color-mid text-light height10">
                <div className="vv-header">
                    <span>{this.context.appState("page")}</span>
                    <button id="menu-button" type="button" className="glyphicon glyphicon-menu-hamburger text-light" onClick={this.showMenu}></button>
                </div>
            </header>
        );
    },
    showMenu: function(){
        this.context.appState({"page": "Menu"});
    }
});