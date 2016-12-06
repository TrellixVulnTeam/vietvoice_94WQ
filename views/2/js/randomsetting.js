var RandomSetting = React.createClass({
	getInitialState: function() {
		return ({
			message: 'Thiết lập trường số để lấy file random cho user',
			check0: 'Đang tải',
			check1: 'Đang tải',
			check2: 'Đang tải',
			check3: 'Đang tải',
			check4: 'Đang tải'
		});
	},
	contextTypes: {
		appState: React.PropTypes.func,
		getRandomSetting: React.PropTypes.func
	},
	componentWillMount: function() {
		this.getRandomSetting();
	},
	getRandomSetting: function() {
		$.get("/getrandomsetting", function(data) {
			this.setState({
				check0: data.check0,
				check1: data.check1,
				check2: data.check2,
				check3: data.check3,
				check4: data.check4
			});
		}.bind(this));
	},
	editSetting: function(e) {
		e.preventDefault();
		$.post("/editrandomsetting", {
			check0: this.state.check0,
			check1: this.state.check1,
			check2: this.state.check2,
			check3: this.state.check3,
			check4: this.state.check4
		}, function(data) {
			this.setState({
				message: 'Update thành công'
			});
		}.bind(this));
	},
	handleForm: function() {
		this.setState({
			check0: this.refs.check0.value,
			check1: this.refs.check1.value,
			check2: this.refs.check2.value,
			check3: this.refs.check3.value,
			check4: this.refs.check4.value
		});
	},
	render: function() {
		return (
			<div className="height100 middle topbot10 scrollY">
			<div className="width90">
				<h4>{this.state.message}</h4>
				<form onSubmit={this.editSetting}>
				    <h5>Trọng số cho file chưa check</h5>
					<input type="text" ref="check0" className="form-control form-group" value={this.state.check0} onChange={this.handleForm} />
					<h5>Trọng số cho file check 1 lần</h5>
					<input type="text" ref="check1" className="form-control form-group" value={this.state.check1} onChange={this.handleForm} />
					<h5>Trọng số cho file check 2 lần</h5>
					<input type="text" ref="check2" className="form-control form-group" value={this.state.check2} onChange={this.handleForm} />
					<h5>Trọng số cho file check 3 lần</h5>
					<input type="text" ref="check3" className="form-control form-group" value={this.state.check3} onChange={this.handleForm} />
					<h5>Trọng số cho file check 4 lần</h5>
					<input type="text" ref="check4" className="form-control form-group" value={this.state.check4} onChange={this.handleForm} />
					<input type="submit" value="Xác nhận" className="form-control form-group btn btn-danger text-light color-dark hover-mid no-border" />
				</form>
			</div>
			</div>
		);
	},
	componentWillReceiveProps: function() {
		this.setState({
			check0: this.props.data.check0,
			check1: this.props.data.check1,
			check2: this.props.data.check2,
			check3: this.props.data.check3,
			check4: this.props.data.check4
		});
	}
});