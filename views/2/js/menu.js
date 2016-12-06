var Menu = React.createClass({
    getInitialState: function() {
        return ({
            
        });
    },
    contextTypes: {
        appState: React.PropTypes.func,
        logout: React.PropTypes.func,
        getRandomSetting: React.PropTypes.func
    },
    componentWillMount: function() {
        this.context.getRandomSetting();
    },
    appState: function(val){
        this.context.appState(val);
    },
    render: function() {

        return (
            <div className="height100">
                    {this.context.appState("user") !== "admin" 
                    ?
                    <ul className="nav vv-menu">
                    <li onClick={this.appState.bind(this, {"page": "VIETVOICE"})}>Check Audio</li>
                    <li onClick={this.appState.bind(this, {"page": "Báo cáo"})}>Xem Report</li>
                    <li onClick={this.appState.bind(this, {"page": "Hướng dẫn"})}>Xem Hướng dẫn</li>
                    <li onClick={this.context.appState("user") === "Guest" ? this.appState.bind(this, {"page": "Đăng nhập"}) : this.context.logout}
                    >Xin chào {this.context.appState("user")}, {this.context.appState("user") === "Guest" ? "Đăng nhập" : "Đăng xuất"}</li>
                    </ul>
                    :
                    <ul className="nav vv-menu">
                    <li onClick={this.appState.bind(this, {"page": "VIETVOICE"})}>Check Audio</li>
                    <li onClick={this.appState.bind(this, {"page": "Báo cáo"})}>Xem Report của các thành viên</li>
                    <li onClick={this.appState.bind(this, {"page": "Hướng dẫn"})}>Xem Hướng dẫn</li>
                    <li onClick={this.appState.bind(this, {"page": "Import Files"})}>Import Files</li>
                    <li onClick={this.appState.bind(this, {"page": "Random Settings"})}>Thiết lập Random</li>
                    <li onClick={this.appState.bind(this, {"page": "Tạo mới User"})}>Tạo mới User</li>
                    <li onClick={this.context.logout} >Xin chào {this.context.appState("user")}, Đăng xuất</li>
                    </ul>
                    }
            </div>
        );
    }
});