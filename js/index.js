function validate(id){
	this.regexp = {
		name      	 :   /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,10})$/,
		post    	 :   /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/,
		company 	 :   /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/,
		phonenumber  :   /^1[3|4|5|8][0-9]\d{8}$/,
		email		 :   /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ 

		};
		this.id = id;
		// 是否可提交
		this.isSub = false;
		this.init()
	};
	// {realname:name,huodongid:hdid,phonenumber:mobile,company:company,from:from,career:post}

	//需要提交的数据
	validate.reqData = {
		huodongid:'',
		realname:'',
		career:'',
		company:'',
		phonenumber:'',
		email:''
	};

	// 执行验证
	validate.prototype.check = function($_this_dom){
		var _this = this;
		var _thisData = {};
		_thisData.regexp   =  this.regexp[$_this_dom.attr('regtype')];  // 验证正则
		_thisData.empty    =  $_this_dom.attr('data-empty');			//为空提示信息
		_thisData.sucMsg   =  $_this_dom.attr('suc-msg');				//成功提示信息
		_thisData.errprMsg =  $_this_dom.attr('error-msg');				//错误提示信息
		_thisData._value   =  $_this_dom.val();							//输入值
		// 如果输入值没有改变不执行验证 否则更新
		if($_this_dom.attr('data-val') == _thisData._value && _thisData._value != ''){
			console.log('a');
			if($_this_dom.attr('check-static') == 'error'){
				$_this_dom.parent().next().removeClass('suc').addClass('error').text(_thisData.errprMsg);
			}else if($_this_dom.attr('check-static') == 'success'){
				$_this_dom.parent().next().removeClass('error').addClass('suc').text(_thisData.sucMsg);
			}
			return;
		}else{
			$_this_dom.attr('data-val',_thisData._value)
		}
		// 开始验证
		if(_thisData.empty && $.trim(_thisData._value) == '' ){
			_this.checkEmpty($_this_dom,_thisData);
		}else if(_thisData.regexp && !(_thisData.regexp.test($.trim(_thisData._value)))){
			console.log(_thisData.regexp);
			_this.checkError($_this_dom,_thisData);
		}else{
			_this.checkSuc($_this_dom,_thisData);
		}
	}
	// 非空验证
	validate.prototype.checkEmpty = function($_this_dom,_thisData){
		$_this_dom
			.attr('check-static', 'error')							
			.parent().next().removeClass('suc').addClass('error')
			.text(_thisData.empty);
	};
	// 错误验证
	validate.prototype.checkError = function($_this_dom,_thisData){
		$_this_dom
			.attr('check-static', 'error')							
			.parent().next().removeClass('suc').addClass('error')
			.text(_thisData.errprMsg);
	};
	// 验证通过
	validate.prototype.checkSuc = function($_this_dom,_thisData){
		var dateType = $_this_dom.attr('data-ipt');
		var curVal = $.trim($_this_dom.val());
		// 将通过验证的值传要提交的对象
		switch(dateType){
			case 'name':
				validate.reqData.realname = curVal;
				break;
			case 'post':
				validate.reqData.career = curVal;
				break;
			case 'company':
				validate.reqData.company = curVal;
				break;
			case 'phonenumber':
				validate.reqData.phonenumber = curVal;
				break;
			case 'email':
				validate.reqData.email = curVal;
				break;
		};
		$_this_dom
			.attr('check-static', 'success')
			.parent().next().removeClass('error').addClass('suc')
			.text(_thisData.sucMsg);
	};
	// 清除默认样式
	validate.prototype.clear = function($_this_dom){
		$_this_dom.parent().next().html('');
	};
	// 验证表单是否可提交
	validate.prototype.checkSub = function(){
		var _this = this,subHeader = true;
		var checkDom = $('[data-ipt]');
		for (var i = 0; i < checkDom.length; i++) {
			var domStatic = $(checkDom[i]).attr('check-static');
			if(domStatic == 'error' || domStatic == undefined){
				subHeader = false
			}else{
				this.isSub = true;
			}
		};
		
		if(this.isSub && subHeader){
			_this.subAjax()
		}
	};
	// 表单提交
	validate.prototype.subAjax = function(){
		 $.getJSON(
		 	'/viphuodong/adduser/?jsoncallback=?',
			validate.reqData,
		 	 function(data){
			        if(data.code == 'succ'){
			            $('#ext3').val(data.gotourl);
			            $('#hdid').val(hdid);
			            alert(data.msg);
			        }else{
			            alert(data.msg);
			        }
			        return false;
			    });
	};
	validate.prototype.init = function(){
		var _this = this;
		// 失去焦点开始验证
		$('[data-ipt]').on('blur',function(){
			_this.check($(this));
		})
		// 绑定获得焦点 获得焦点清除验证样式
		.on('focus',function(){
			_this.clear($(this))
		});
		// 绑定提交事件
		$('#'+this.id).on('click',function(){
			_this.checkSub();
		})
	};


	