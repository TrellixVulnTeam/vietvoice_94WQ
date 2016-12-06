var ImportFile = React.createClass({
    getInitialState: function() {
        return ({
            loading: false,
            message: "Nhập số file audio đã upload, để không bỏ sót hãy nhập số lớn hơn số file đã upload 1 chút, hệ thống sẽ tự lọc các file không phải âm thanh",
            resultData: "none",
            resultStyle: {
                "height": "250px"
            }
        });
    },
    componentWillMount: function(){
        $.ajaxSetup({
          timeout: 86400000
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
            <div className="height100 middle">
    			<div className="width90">
    			    <p style={{"text-align": "center"}}>Thao tác này tạm thời sẽ chỉ giới hạn cho admin quản lý server</p>
    			</div>
			</div>
        );
    }
});