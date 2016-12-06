var Instruction = React.createClass({
    getInitialState: function() {
        return ({
            
        });
    },
    contextTypes: {
        appState: React.PropTypes.func
    },
    componentWillMount: function() {
        
    },
    render: function() {
        return (
            <div className="height100">
                <div className="width100">
                    {this.context.appState("user") !== "admin" ?
                    <ul className="nav vv-menu">
						<li>Bấm &#9658; để nghe đoạn âm thanh</li>
						<li>Click hoặc chạm vào đoạn chữ để thay đổi nếu thấy không đúng</li>
						<li>Bấm <strong>✓</strong> để xác nhận</li>
						<li>Bấm <strong>X</strong> để hủy bỏ và bỏ qua đoạn âm thanh hiện tại</li>
						<li>Xem thông tin thêm tại <span className="glyphicon glyphicon-menu-hamburger"></span></li>
					</ul>
					:
					<ul className="nav vv-menu">
						<li>Mục <b>Report</b> chủ yếu kết hợp với Google Sheets để tăng tốc độ deploy, có thể sẽ thay đổi sau.</li>
						<li>Xem Sheet <a href="https://docs.google.com/spreadsheets/d/1Uv7GXDL5ToLp1Gb-ClwU-oCnXwjo0rXrgXki3u3sxbg/pubhtml?gid=770393788&single=true" target="_blank" >"Hướng dẫn tạo User"</a> trong file google sheet để tạo link report cho user</li>
						<li>Để import file, dùng tài khoản google drive để upload file audio vào thư mục share cho trước, sau đó vào <b>Import File</b> và làm theo hướng dẫn</li>
					</ul>
                    }
                </div>
            </div>
        );
    }
});