var Main = React.createClass({
    getInitialState: function(){
        return ({
            
        });
    },
	contextTypes: {
		appState: React.PropTypes.func
	},
    componentWillMount: function(){
        
    },
    render: function(){
        var webPage;
        switch(this.context.appState("page")){
            case "VIETVOICE": webPage = <Player />;
                break;
            case "Menu": webPage = <Menu />;
                break;
            case "Báo cáo": webPage = <Report />;
                break;
            case "Hướng dẫn": webPage = <Instruction />;
                break;
            case "Đăng nhập": webPage = <Login />;
                break;
            case "Tạo mới User": webPage = <NewUser />;
                break;
            case "Import Files": webPage = <ImportFile />;
                break;
            case "Random Settings": webPage = <RandomSetting />;
                break;
            default: webPage = <Player />;
        }
        return (
            <main className="height90">
                {webPage}
            </main>
        );
    }
});