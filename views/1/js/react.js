var App = React.createClass({
	getInitialState: function() {
		return ({
			user: "Guest",
			firstTime: localStorage.getItem("firsttime") === null ? true : false,
			audioLink: "",
			audioText: "",
			audioGid: "",
			loading: true,
			checked: 0,
			webPage: 'player'
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
		getRandom: React.PropTypes.func,
		user: React.PropTypes.string,
		changeLogInStatus: React.PropTypes.func,
		cookie: React.PropTypes.func,
		logout: React.PropTypes.func

	},
	getChildContext: function() {
		return {
			appState: this.appState,
			getRandom: this.getRandomCheck,
			user: this.state.user,
			changeLogInStatus: this.changeLogInStatus,
			cookie: this.cookie,
			logout: this.logout
		};
	},
	componentWillMount: function() {
		this.checklogin();
		this.getRandomCheck();
		this.getBackground();
	},
	getBackground: function(){
		$("canvas").remove();
		var pattern = Trianglify({
			width: window.innerWidth,
			height: window.innerHeight
		});
		document.body.appendChild(pattern.canvas());	
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
	changeLogInStatus: function(val) {
		this.setState({
			user: val,
			webPage: "userPage"
		});
	},
	logout: function() {
		this.setState({
			user: "Guest",
			webPage: "login"
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
	getRandomCheck: function() {
		this.setState({
			loading: true
		});
		$.get("/getrandomcheck/" + this.state.checked, function(data) {
			this.setState({
				loading: false,
				audioLink: data.link,
				audioText: data.text,
				audioGid: data.driveID
			});
		}.bind(this));
		this.getBackground();
	},
	check: function(number) {
		this.setState({
			checked: number
		}, function() {
			this.getRandomCheck();
		});
	},
	render: function() {
		var webPage;
		switch (this.state.webPage) {
			case 'player':
				webPage = this.state.loading === true ? <Loading /> : <Player notAvailable={typeof this.state.audioGid === "undefined" ? true : false} driveID={this.state.audioGid} link={this.state.audioLink} text={this.state.audioText}/>;
				break;
			case 'instruction':
				webPage = <Instruction />;
				break;
			case 'login':
				webPage = <Login />;
				break;
			case 'userPage':
				webPage = <UserPage />;
				break;
			default:
				webPage = this.state.loading === true ? <Loading /> : <Player notAvailable={typeof this.state.audioGid === "undefined" ? true : false} driveID={this.state.audioGid} link={this.state.audioLink} text={this.state.audioText}/>;
		}
		return (
			<main >
				<Header />
				<div className="main-content">			
					{webPage}
				</div>
				{this.state.firstTime === true ? <Footer /> : ""}
			</main>
		);
	}
});

var Footer = React.createClass({
	contextTypes: {
		appState: React.PropTypes.func
	},
	hideTooltip: function(){
		this.context.appState({"firstTime": false});
		localStorage.setItem("firsttime", "false");
	},
	render: function(){
		return (
			<footer>
				Bỡ ngỡ về cách sử dụng? truy cập menu &nbsp; <span className="glyphicon glyphicon-menu-hamburger"></span> &nbsp; để xem hướng dẫn. <em onClick={this.hideTooltip} 
				style={{"fontSize": "0.8em", "cursor": "pointer", "color": "yellow"}}>(Ẩn chỉ dẫn này)</em>
			</footer>
		);
	}	
});

var Instruction = React.createClass({
	render: function() {
		return (
			<div className="page">
				<div className="row">
					<div className="col-md-12">
					<ul>
						<li>Bấm &#9658; để nghe đoạn âm thanh</li>
						<li>Click hoặc chạm vào đoạn chữ để thay đổi nếu thấy không đúng</li>
						<li>Bấm <strong>✓</strong> để xác nhận</li>
						<li>Bấm <strong>X</strong> để hủy bỏ và bỏ qua đoạn âm thanh hiện tại</li>
						<li>Chọn loại file âm thanh qua truy cập Menu <span className="glyphicon glyphicon-menu-hamburger"></span></li>
					</ul>
					</div>
				</div>
			</div>
		);
	}
});

var Loading = React.createClass({
	render: function() {
		return (
			<img src="https://s5.postimg.org/fmrccmeqf/147540210527913.gif" className="img-responsive" />
		);
	}

});

var Player = React.createClass({
	getInitialState: function() {
		return ({
			playIcon: "glyphicon glyphicon-play",
			text: this.props.text
		});
	},
	contextTypes: {
		appState: React.PropTypes.func,
		getRandom: React.PropTypes.func
	},
	componentDidMount: function() {
		$('textarea').autogrow({
			vertical: true,
			horizontal: false
		});
	},
	togglePlay: function() {
		if (this.state.playIcon === "glyphicon glyphicon-play") {
			this.setState({
				playIcon: "glyphicon glyphicon-pause"
			});
			document.querySelector('audio').play();
			document.querySelector('audio').onended = function() {
				this.setState({
					playIcon: "glyphicon glyphicon-play"
				});
			}.bind(this);
		}
		else {
			this.setState({
				playIcon: "glyphicon glyphicon-play"
			});
			document.querySelector('audio').pause();
			document.querySelector('audio').onended = function() {
				this.setState({
					playIcon: "glyphicon glyphicon-play"
				});
			}.bind(this);
		}
	},
	modifyText: function(e) {
		this.setState({
			text: e.target.value
		});
	},
	handleForm: function(e) {
		e.preventDefault();
		// update to database
		$.post("/updateaudio", {
			driveID: this.props.driveID,
			text: this.state.text
		}, function(data) {

		});

		//save user history
		$.ajax({
			data: 'entry.1551398819=' + encodeURI(this.context.appState("user")) + '&entry.889551034=' + this.props.driveID + '&entry.476751177=' + encodeURI(this.state.text),
			type: "POST",
			url: "https://docs.google.com/forms/d/e/1FAIpQLScvN9jRH1T9VlmXlyK8eTqo0mrisbKlVkTQdVZphQdiPJlV6A/formResponse",
			contentType: "application/x-www-form-urlencoded;charset=utf-8"
		});
		this.context.getRandom();
	},
	skip: function(e) {
		e.preventDefault();
		this.context.getRandom();
	},
	render: function() {
		return (
			<div className="player text-center">
		{this.props.notAvailable === true 
		?
		<h2>Hết file để check</h2>
		:
		<div>
		<button type="button" className={this.state.playIcon} onClick={this.togglePlay} ></button>
		<audio controls style={{"display": "none"}}>
				<source src={this.props.link} type="audio/wav" />
		</audio>
		<form>
			<textarea ref="text" onChange={this.modifyText} className="form-group text-center">
			{this.state.text}
			</textarea>
			<button className="glyphicon glyphicon-ok" onClick={this.handleForm}></button>
			<button className="glyphicon glyphicon-remove" onClick={this.skip}></button>
		</form>
		</div>
		}
		</div>
		);
	}
});

var Header = React.createClass({
	getInitialState: function() {
		return ({
			menuDisplay: {
				"display": "none"
			}
		});
	},
	contextTypes: {
		appState: React.PropTypes.func,
		getRandom: React.PropTypes.func,
		user: React.PropTypes.string,
		logout: React.PropTypes.func
	},
	toggleMenu: function() {
		this.context.appState({firstTime: false});
		if (this.state.menuDisplay.display === "none") {
			this.setState({
				menuDisplay: {
					"display": "block"
				}
			});
		}
		else {
			this.setState({
				menuDisplay: {
					"display": "none"
				}
			});

		}
	},
	componentDidMount: function() {

		$(window).resize(function() {
			if (window.innerWidth <= 450) {
				$("#menu-content").width(window.innerWidth - 40);
			}
			if (window.innerHeight <= 600) {
				$("#menu-content img").css("display", "none");
			}
			else {
				$("#menu-content img").css("display", "inline-block");
			}
		});
		if (window.innerWidth <= 400) {
			$("#menu-content").width(window.innerWidth - 40);
		}
		if ($('#menu-content ul').height() >= window.innerHeight) {
			$("#menu-content img").css("display", "none");
			$("#menu-content ul").height(window.innerHeight - 60);
			$("#menu-content ul").css("overflow-y", "scroll");
		}
		if (window.innerHeight <= 600) {
			$("#menu-content img").css("display", "none");
		}
	},
	check: function(val) {
		this.context.appState({
			webPage: 'player',
			checked: val
		}, function() {
			this.context.getRandom();
		}.bind(this));
	},
	webPage: function(val) {
		this.context.appState({
			webPage: val
		});
	},
	render: function() {
		return (
			<div className="menu-wraper">
			<button id="menu-button" type="button" className="glyphicon glyphicon-menu-hamburger" onClick={this.toggleMenu}></button>
			<div id="menu-container" style={this.state.menuDisplay} onClick={this.toggleMenu}>
				<div id="menu-content">
					<button id="exit-menu" type="button" className="glyphicon glyphicon-menu-left" onClick={this.toggleMenu}></button>
					<ul className="nav text-left">
						<li onClick={this.context.appState("user") === "Guest" ? this.webPage.bind(this, "instruction") : this.webPage.bind(this, "userPage")}>{this.context.appState("user") === "Guest" ? "Hướng dẫn sử dụng" : "Bảng điều khiển"}</li>
						<li onClick={this.check.bind(this, 0)}>File chưa check</li>
						<li onClick={this.check.bind(this, 1)}>File check lần 1</li>
						<li onClick={this.check.bind(this, 2)}>File check lần 2</li>
						<li onClick={this.check.bind(this, 3)}>File check lần 3</li>
						<li onClick={this.check.bind(this, 4)}>File check lần 4</li>
						<li onClick={this.context.appState("user") === "Guest" ? this.webPage.bind(this, "login") : this.context.logout}>Xin chào {this.context.appState("user") === "Guest" ? "Guest, Đăng nhập" : this.context.appState("user") + ", Đăng xuất"}</li>
					</ul>
					<img src="//s5.postimg.org/e2li7bcwn/trans_logo.png" id="logo"/>
				</div>
			</div>
		</div>
		);
	}
});

var Login = React.createClass({
	getInitialState: function() {
		return ({
			loginMessage: ''
		});
	},
	contextTypes: {
		appState: React.PropTypes.func,
		getRandom: React.PropTypes.func,
		user: React.PropTypes.string,
		changeLogInStatus: React.PropTypes.func,
		cookie: React.PropTypes.func
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
		var loginForm;
		if (this.context.user === "Guest") {
			loginForm =
				<form className="form-group" onSubmit={this.login}>
				<p>{this.state.loginMessage}</p>
				<input type="text" ref="username" className="form-group form-control" placeholder="Tên đăng nhập" />
				<input type="password" ref="password" className="form-group form-control" placeholder="Password" />
				<input type="submit" className="btn btn-danger" value="Đăng nhập" />
			</form>;
		}
		else {
			loginForm =
				<div>
				Xin chào {this.context.user}
			</div>;
		}
		return (
			<div>
				{loginForm}
			</div>
		);
	}
});

var UserPage = React.createClass({
	contextTypes: {
		appState: React.PropTypes.func,
		getRandom: React.PropTypes.func,
		user: React.PropTypes.string,
		changeLogInStatus: React.PropTypes.func,
		cookie: React.PropTypes.func
	},
	render: function() {
		var role = this.context.appState("user") === 'admin' ? <Admin /> : <NormalUser />
		return (
			<div className="page">
				{role}
			</div>
		);
	}
});

var Admin = React.createClass({
	getInitialState: function() {
		return ({
			tab: 'report'
		});
	},
	changeTab: function(tabName) {
		this.setState({
			tab: tabName
		});
	},
	render: function() {
		var pageTab;
		switch (this.state.tab) {
			case 'report':
				pageTab = <Report />;
				break;
			case 'instruction':
				pageTab = <AdminInstruction />;
				break;
			case 'importFile':
				pageTab = <ImportFile />;
				break;
			case 'addUser':
				pageTab = <AddUser />;
				break;
			default:
				pageTab = <Report />;
		}
		return (
			<div className="row">
				<div className="col-md-12">
					<h3 className="admin-tab"><span style={{"cursor": "pointer", "border-bottom": this.state.tab === "report" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "report")}>Report</span> | <span style={{"cursor": "pointer", "border-bottom": this.state.tab === "instruction" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "instruction")}>Hướng dẫn</span> | <span style={{"cursor": "pointer", "border-bottom": this.state.tab === "importFile" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "importFile")}>Import File</span>  | <span style={{"cursor": "pointer", "border-bottom": this.state.tab === "addUser" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "addUser")}>Tạo User</span></h3>
					
				</div>
				<div className="col-md-12">
					{pageTab}
				</div>
			</div>
		);
	}
});

var NormalUser = React.createClass({
	getInitialState: function() {
		return ({
			tab: 'report'
		});
	},
	changeTab: function(tabName) {
		this.setState({
			tab: tabName
		});
	},
	render: function() {
		return (
			<div className="row">
				<div className="col-md-12">
					<h3><span style={{"cursor": "pointer", "border-bottom": this.state.tab === "report" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "report")}>Report</span> | <span style={{"cursor": "pointer", "border-bottom": this.state.tab === "instruction" ? "1px dashed grey": "none"}} onClick={this.changeTab.bind(this, "instruction")}>Hướng dẫn</span></h3>
					
				</div>
				<div className="col-md-12">
					{this.state.tab === "report" ? <Report /> : <Instruction />}
				</div>
			</div>
		);
	}
});

var Report = React.createClass({
	contextTypes: {
		appState: React.PropTypes.func,
		user: React.PropTypes.string
	},
	getInitialState: function() {
		return ({
			link: '',
			res0: 'đang tải..',
			res1: 'đang tải..',
			res2: 'đang tải..',
			res3: 'đang tải..',
			res4: 'đang tải..'
		});
	},
	componentWillMount: function() {
		this.getUserReportLink();
		this.getAudioResults(0);
		this.getAudioResults(1);
		this.getAudioResults(2);
		this.getAudioResults(3);
		this.getAudioResults(4);
	},
	getAudioResults: function(number) {
		$.get("/audioresults/" + number, function(data) {
			switch (number) {
				case 0:
					this.setState({
						res0: data.count
					});
					break;
				case 1:
					this.setState({
						res1: data.count
					});
					break;
				case 2:
					this.setState({
						res2: data.count
					});
					break;
				case 3:
					this.setState({
						res3: data.count
					});
					break;
				case 4:
					this.setState({
						res4: data.count
					});
					break;
			}
		}.bind(this));
	},
	getUserReportLink: function() {
		if (this.context.appState("user") !== "admin") {
			$.get("/getuserlink/" + this.context.appState("user"), function(data) {
				this.setState({
					link: data
				});
			}.bind(this));
		}
	},
	render: function() {
		return (

			<div>
			{this.context.appState("user") !== "admin" ? 
			
			<p><a target="_blank" href={this.state.link}>Xem report của bạn</a></p>
			
			:
			<div>
			<h3>Một số kết quả thống kê được</h3>
			<ul>
				<li>Số file chưa check: <strong>{this.state.res0}</strong></li>
				<li>Số file check 1 lần: <strong>{this.state.res1}</strong></li>
				<li>Số file check 2 lần: <strong>{this.state.res2}</strong></li>
				<li>Số file check 3 lần: <strong>{this.state.res3}</strong></li>
				<li>Số file check 4 lần: <strong>{this.state.res4}</strong></li>
			</ul>
			<a target="_blank" href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/edit#gid=6642618"><button className="btn btn-normal form-control form-group" >Xem report của tất cả thành viên </button></a>
			</div>
			}
			</div>
		);
	}
});

var AdminInstruction = React.createClass({
	getInitialState: function() {
		return ({

		});
	},
	render: function() {
		return (
			<div className="page">
				<div className="row">
					<div className="col-md-12">
					<ul>
						<li>Mục <b>Report</b> chủ yếu kết hợp với Google Sheets để tăng tốc độ deploy, có thể sẽ thay đổi sau.</li>
						<li>Xem Sheet "Hướng dẫn tạo User" trong file google sheet để tạo link report cho user</li>
						<li>Để import file, dùng tài khoản google drive để upload file audio vào thư mục share cho trước, sau đó vào <b>Import File</b> và làm theo hướng dẫn</li>
					</ul>
					</div>
				</div>
			</div>
		);
	}

});

var ImportFile = React.createClass({
	getInitialState: function() {
		return ({
			loading: false,
			message: "Nhập số file audio đã upload, để không bỏ sót hãy nhập số lớn hơn số file đã upload 1 chút, hệ thống sẽ tự lọc các file không phải âm thanh",
			resultData: "none",
			resultStyle: {"height": "250px"}
		});
	},
	importFile: function(e) {
		e.preventDefault();
		this.setState({
			loading: true,
			message: "Vui lòng đợi và không thoát website trong thời gian tải"
		});
		$.get("/importfile/" + this.refs.number.value, function(data) {
			this.setState({
				loading: false,
				message: "Đã import xong, thao tác tương tự để import tiếp",
				resultData: data
			});
		}.bind(this)).fail(function() {
			this.setState({
				loading: false,
				message: "Có lỗi xảy ra"
			});
		}.bind(this));
	},
	render: function() {
		return (
			<div className="col-xd-12">
			{this.state.loading === false ? 
				<form className="form-group" onSubmit={this.importFile}>
					<p style={{"text-align": "center"}}>{this.state.message}</p>
					{typeof this.state.resultData === "object" ? <textarea style={this.state.resultStyle} className="form-control form-group" value={JSON.stringify(this.state.resultData, undefined, 4)} /> : ""}
					<input type="number" ref="number" className="form-control form-group" defaultValue="1000" />
					<input type="submit" className="form-control form-group" value="Import Files" />
				</form>
			:
			<div className="main-content">
			<div>
				<p style={{"text-align": "center"}}>{this.state.message}</p>
				<Loading />
			</div>
			</div>
			}
			</div>
		);
	}
});

var AddUser = React.createClass({
	getInitialState: function() {
		return ({
			message: 'Đọc phần hướng dẫn để tạo user'
		});
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
			<div>
				<h3>{this.state.message}</h3>
				<p><a href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/pubhtml?gid=770393788&single=true" target="_blank">Link hướng dẫn</a></p>
				<form onSubmit={this.addUser}>
					<input type="text" placeholder="Tên đăng nhập" ref="username" className="form-control form-group" />
					<input type="text" placeholder="Mật khẩu" ref="password" className="form-control form-group" />
					<input type="text" placeholder="Link Report" ref="link" className="form-control form-group"/>
					<input type="submit" value="Tạo user" className="form-control form-group btn btn-danger" />
				</form>
			</div>
		);
	}
});

ReactDOM.render(<App />, document.querySelector("#main"));