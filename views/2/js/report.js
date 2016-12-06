var Report = React.createClass({
    getInitialState: function() {
        return ({
            link:'',
            res0: 'đang tải..',
			res1: 'đang tải..',
			res2: 'đang tải..',
			res3: 'đang tải..',
			res4: 'đang tải..'
        });
    },
    contextTypes: {
        appState: React.PropTypes.func
    },
    componentWillMount: function() {
        this.getUserReportLink();
        this.getAudioResults(0);
		this.getAudioResults(1);
		this.getAudioResults(2);
		this.getAudioResults(3);
		this.getAudioResults(4);
    },
    getUserReportLink: function() {
		if (this.context.appState("user") !== "admin" && this.context.appState("user") !== "Guest") {
			$.get("/getuserlink/" + this.context.appState("user"), function(data) {
				this.setState({
					link: data
				});
			}.bind(this));
		}
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
    render: function() {
        var userReport;
        switch(this.context.appState("user")){
            case "Guest": userReport = <a href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/pubhtml?gid=474205267&single=true" target="_blank">Link report</a>;
            break;
            case "admin": userReport =  <a href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/edit#gid=6642618" target="_blank">Link report</a>;
            break;
            default:{this.state.link === '' ? "Đang tải" : 
                    userReport =  <a href={this.state.link} target="_blank">Link report</a>;
                    }
        }
        return (
            <div className="height100">
                <div className="width100">
                    {this.context.appState("user") === "admin" ?
                    <ul className="nav vv-menu">
                        <li>{userReport}</li>
                        <li>Số file chưa check: <strong>{this.state.res0}</strong></li>
				        <li>Số file check 1 lần: <strong>{this.state.res1}</strong></li>
				        <li>Số file check 2 lần: <strong>{this.state.res2}</strong></li>
				        <li>Số file check 3 lần: <strong>{this.state.res3}</strong></li>
				        <li>Số file check 4 lần: <strong>{this.state.res4}</strong></li>
				        <li><a href="/correct" target="_blank">Dữ liệu text chuẩn - nhiều text (JSON)</a></li>
				        <li><a href="/correctone" target="_blank">Dữ liệu text chuẩn - 1 text (JSON)</a></li>
                    </ul>
                    :
                    <ul className="nav vv-menu">
                        <li>{userReport}</li>
                    </ul>
                    }
                </div>
            </div>
        );
    }
});