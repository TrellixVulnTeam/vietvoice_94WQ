var Player = React.createClass({
    getInitialState: function() {
        return ({
            audioData: ''
        });
    },
    contextTypes: {
        appState: React.PropTypes.func
    },
    componentWillMount: function() {
        this.getAudio();
    },
    getNext: function(){
        var num = this.state.audioData.name.substring(0,this.state.audioData.name.length-4);
        this.setState({
            audioData: ''
        });
        $.get("/getnext/"+num, function(data){
            var newData = JSON.parse(JSON.stringify(data));
            if (data.hasOwnProperty('textFix')) {
                newData.textFix = data.textFix.map(function(val, index) {
                    return val.toLowerCase();
                })
            }
            else if (data.constructor === Array && data.length === 0) {
                this.getAudio();
                return;
                newData = {
                    _id: "580056eb0f2c2a346ec1d72b",
                    checked: 999,
                    driveID: "",
                    link: "#",
                    name: "empty file",
                    text: "Hết file check, click vào menu để tìm thêm",
                    textFix: [
                        "Hết file check, click vào menu để tìm thêm"
                    ]
                }
            }
            this.setState({
                audioData: newData
            });
        }.bind(this)); 
    },
    getAudio: function() {
        this.setState({
            audioData: ''
        });

        // choose checked time
        var check0range = this.context.appState("randomSetting").check0;
        var check1range = check0range + this.context.appState("randomSetting").check0;
        var check2range = check1range + this.context.appState("randomSetting").check1;
        var check3range = check2range + this.context.appState("randomSetting").check2;
        var check4range = check3range + this.context.appState("randomSetting").check3;

        var randomNumber = Math.floor(Math.random() * (check4range + 1));
        var chooseChecked;

        switch (true) {
            case randomNumber <= check0range:
                chooseChecked = 0;
                break;
            case randomNumber <= check1range:
                chooseChecked = 1;
                break;
            case randomNumber <= check2range:
                chooseChecked = 2;
                break;
            case randomNumber <= check3range:
                chooseChecked = 3;
                break;
            case randomNumber <= check4range:
                chooseChecked = 4;
                break;
            default:
                chooseChecked = 0;
        }
        
        $.get("/getrandomcheck/" + chooseChecked, function(data) {
            var newData = JSON.parse(JSON.stringify(data));
            if (data.hasOwnProperty('textFix')) {
                newData.textFix = data.textFix.map(function(val, index) {
                    return val.toLowerCase();
                })
            }
            else if (data.constructor === Array && data.length === 0) {
                this.getAudio();
                return;
                newData = {
                    _id: "580056eb0f2c2a346ec1d72b",
                    checked: 999,
                    driveID: "",
                    link: "#",
                    name: "empty file",
                    text: "Hết file check, click vào menu để tìm thêm",
                    textFix: [
                        "Hết file check, click vào menu để tìm thêm"
                    ]
                }
            }
            this.setState({
                audioData: newData
            });
        }.bind(this));
    },
    submitAudio: function() {
        var newText = $(":checked").parent().parent().find(".textFix").text().toLowerCase();
        if (newText == "") {
            alert("Hãy chọn 1 câu");
        }
        else {
            var checkedIncrease = newText == this.state.audioData.textFix[$(":checked").attr("id").substr(8)];
            var foo = {
                driveID: this.state.audioData.driveID,
                text: newText,
                checkedIncrease: checkedIncrease
            };
            $.post("/updateaudio", {
                driveID: this.state.audioData.driveID,
                text: newText,
                checkedIncrease: checkedIncrease
            }, function(data) {
                this.getNext();
            }.bind(this));
        }
    },
    isInArrs: function(val, arrays) {
        for (var i = 0; i < arrays.length; i++) {
            if (arrays[i].indexOf(val) === -1) {
                return false;
            }
        }
        return true;
    },
    findCommon: function(bigArrs) {
        var foo = bigArrs[0].slice();
        foo = foo.filter(function(val) {
            return this.isInArrs(val, bigArrs);
        }.bind(this));
        return foo;
    },
    highlightCommon: function(val, common) {
        val = val.map(function(a, b) {
            if (common.indexOf(a) !== -1) {
                return '<span class="commontext">' + a + '</span>'
            }
            else {
                return a;
            }
        });
        return '<div>' + val.join(" ") + '</div>';
    },
    render: function() {
        var textArr, highlightText, common;
        if (typeof this.state.audioData === "object" && typeof this.state.audioData.textFix !== "undefined") {
            textArr = this.state.audioData.textFix.filter(function(val, index, arr) {
                return arr.indexOf(val) !== index ? false : true;
            });
            highlightText = textArr.map(function(val, index) {
                return val.split(" ");
            });
            common = this.findCommon(highlightText);
        }

        return (
            <div className="height100">
                <div className="height10 vv-main text-light color-dark text-center middle message text-300-size">
                    Chọn câu đúng nhất, nếu không có thì chọn 1 câu để sửa. Lưu ý sửa số thành chữ (VD: 1 -> một)
                </div>
                <div className="height10 color-dark text-light middle" onClick={this.playSound}>
                    {typeof this.state.audioData === "object" ? 
                    <audio controls className="width100 height100">
            				<source src={this.state.audioData.link} type="audio/wav" />
            		</audio> : "Đang tải audio" }
                </div>
                <div className="height50 scrollY">
                    {typeof this.state.audioData === "object" && typeof this.state.audioData.textFix !== "undefined" ?
                    highlightText.map(function(val,index){
                        return (
                            <div className="width100 transcript border-mid clearfix">
                                <div className="width10 middle color-mid"><input type="checkbox" value="1" id={"checkbox"+index}/></div>
                                <div className="width90 middle">
                                    <div ref={"text"+index} className="form-group text-center middle textFix" contentEditable dangerouslySetInnerHTML={{__html: this.highlightCommon(val, common)}}>
                                		
                                	</div>
                                </div>
                            </div>
                        );
                    }.bind(this))
                    
                    : <Loading />
                    }
                </div>
                <div className="height30 color-dark">
                    <div className="col-xs-6 middle size4 text-light height100 pointer" onClick={this.submitAudio}>✓</div>
                    <div className="col-xs-6 middle size4 text-light height100 pointer" onClick={this.getNext}>✘</div>
                </div>
            </div>
        );


        /*
        return (
            <div className="height100">
                <div className="height10 vv-main text-light color-dark text-center middle message">
                    Chọn câu đúng nhất, nếu không có thì chọn 1 câu để sửa
                </div>
                <div className="height10 color-dark text-light middle" onClick={this.playSound}>
                    {typeof this.state.audioData === "object" ? 
                    <audio controls className="width100 height100">
            				<source src={this.state.audioData.link} type="audio/wav" />
            		</audio> : "Đang tải audio" }
                </div>
                <div className="height50 scrollY">
                    {typeof this.state.audioData === "object" && typeof this.state.audioData.textFix !== "undefined" ?
                    highlightText.map(function(val,index){
                        return (
                            <div className="width100 transcript border-mid clearfix">
                                <div className="width10 middle color-mid"><input type="checkbox" value="1" id={"checkbox"+index}/></div>
                                <div className="width90 middle">
                                    <div ref={"text"+index} className="form-group text-center middle textFix" contentEditable dangerouslySetInnerHTML={{__html: this.highlightCommon(val, common)}}>
                                		
                                	</div>
                                </div>
                            </div>
                        );
                    }.bind(this))
                    
                    : <Loading />
                    }
                </div>
                <div className="height30 color-dark">
                    <div className="col-xs-6 middle size4 text-light height100 pointer" onClick={this.submitAudio}>✓</div>
                    <div className="col-xs-6 middle size4 text-light height100 pointer" onClick={this.getAudio}>✘</div>
                </div>
            </div>
        );
        */
    },


    componentDidMount: function() {
        $(document).on("click", ".textFix", function() {
            $("input[type=checkbox]").prop('checked', false);
            $(this).parent().parent().find("input[type=checkbox]").prop('checked', true);
            /*    
            if($(this).parent().parent().find("input[type=checkbox]").is(":checked")){
                $("input[type=checkbox]").prop('checked', false);
                $(this).parent().parent().find("input[type=checkbox]").prop('checked', false);
            } else {
                $("input[type=checkbox]").prop('checked', false);
                $(this).parent().parent().find("input[type=checkbox]").prop('checked', true);
            }
            */
        });
        $(document).on("click", "input[type=checkbox]", function() {
            $("input[type=checkbox]").prop('checked', false);
            $(this).prop('checked', true);
        });

    }
});