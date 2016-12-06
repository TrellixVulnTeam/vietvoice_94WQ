var App = React.createClass({
    getInitialState: function(){
        return ({
            user: "Guest",
            page: "VIETVOICE",
            randomSetting: {
            	check0: 'đang tải',
		        check1: 'đang tải',
		        check2: 'đang tải',
		        check3: 'đang tải',
		        check4: 'đang tải'
            }
        });
    },
    appState: function(obj, callback) {
		if (typeof obj == "string") {
			return this.state[obj];
		}
		if (callback) {
			this.setState(obj, callback);
		}
		else {
			this.setState(obj);
		}
	},
	childContextTypes: {
		appState: React.PropTypes.func,
		changeLogInStatus: React.PropTypes.func,
		cookie: React.PropTypes.func,
		logout: React.PropTypes.func,
		getRandomSetting: React.PropTypes.func
	},
	getChildContext: function() {
		return {
			appState: this.appState,
			changeLogInStatus: this.changeLogInStatus,
			cookie: this.cookie,
			logout: this.logout,
			getRandomSetting: this.getRandomSetting
		};
	},
    componentWillMount: function(){
        this.checklogin();
        this.getRandomSetting();
    },
    checklogin: function() {
		$.get("/checklogin", function(data) {
			if (data !== "false") {
				this.changeLogInStatus(data);
			}
			else {

			}
		}.bind(this));
	},
	getRandomSetting: function(){
	    $.get("/getrandomsetting", function(data){
	        this.setState({
	        	randomSetting: {
	        		check0: data.check0,
		            check1: data.check1,
		            check2: data.check2,
		            check3: data.check3,
		            check4: data.check4
	        	}
	        });
	    }.bind(this));
	},
	changeLogInStatus: function(val) {
		this.setState({
			user: val,
			page: "Menu"
		});
	},
	logout: function() {
		this.setState({
			user: "Guest",
			page: "Đăng nhập"
		});
		//clear all cookie
		document.cookie.split(";").forEach(function(c) {
			document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		});

	},
	cookie: function(id, username) {
		//clear all cookie
		document.cookie.split(";").forEach(function(c) {
			document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		});
		//set new cookie
		document.cookie = "user=" + username + "; path=/";
		document.cookie = "au=" + id + "; path=/";
	},
    render: function(){
        return (
            <div id="main">
                <Header />
                <Main />
            </div>
        );
    }
});

ReactDOM.render(<App /> ,document.body);