var Login = React.createClass({
    getInitialState: function() {
        return ({
            loginMessage: ''
        });
    },
    contextTypes: {
        appState: React.PropTypes.func,
        changeLogInStatus: React.PropTypes.func,
		cookie: React.PropTypes.func
    },
    componentWillMount: function() {
        
    },
    login: function(e) {
		//clear all cookie
		document.cookie.split(";").forEach(function(c) {
			document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
		});

		var username = this.refs.username.value;
		var password = this.refs.password.value;
		e.preventDefault();
		$.post("/login", {
			username: username,
			password: password
		}, function(data) {
			if (data.message === "success") {
				this.context.changeLogInStatus(username);
				this.context.cookie(data.cookie, username);
			}
			else {
				this.setState({
					loginMessage: data.message
				});
			}
		}.bind(this));
	},
    render: function() {
        return (
            <div className="height100 middle">
                <form className="form-group" onSubmit={this.login}>
				    <p>{this.state.loginMessage}</p>
				    <input type="text" ref="username" className="form-group form-control" placeholder="Tên đăng nhập" />
				    <input type="password" ref="password" className="form-group form-control" placeholder="Password" />
				    <input type="submit" className="btn btn-danger form-group form-control color-dark text-light" value="Đăng nhập" />
			    </form>
            </div>
        );
    }
});