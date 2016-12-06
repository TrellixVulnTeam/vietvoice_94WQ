var NewUser = React.createClass({
    getInitialState: function() {
        return ({
            message: 'Đọc phần hướng dẫn để tạo user'
        });
    },
    contextTypes: {
        appState: React.PropTypes.func
    },
    componentWillMount: function() {
        
    },
    addUser: function(e) {
		e.preventDefault();
		var username = this.refs.username.value;
		var password = this.refs.password.value;
		var link = this.refs.link.value;
		$.post("/adduser", {
			username: username,
			password: password,
			link: link
		}, function(data) {
			this.setState({
				message: 'Tạo user thành công (' + username + '/' + password + '), thao tác tương tự để tạo tiếp'
			});
		}.bind(this));
	},
	render: function() {
		return (
			<div className="height100 middle">
			<div className="width90">
				<h3>{this.state.message}</h3>
				<p><a href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/pubhtml?gid=770393788&single=true" target="_blank">Link hướng dẫn</a></p>
				<form onSubmit={this.addUser}>
					<input type="text" placeholder="Tên đăng nhập" ref="username" className="form-control form-group" />
					<input type="text" placeholder="Mật khẩu" ref="password" className="form-control form-group" />
					<input type="text" placeholder="Link Report" ref="link" className="form-control form-group"/>
					<input type="submit" value="Tạo user" className="form-control form-group btn btn-danger text-light color-dark hover-mid no-border" />
				</form>
			</div>
			</div>
		);
	}
});