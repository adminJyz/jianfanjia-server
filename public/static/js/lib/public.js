// 全局数据
var globalData = {
	role : ['管理员','业主','设计师'],
	sex  : ['男','女'],
	dec_type : ['家装','商装','软装'],
	work_type : ['半包','全包'],
	dec_style : ['欧式','中式','现代','地中海','美式','东南亚'],
	scheme_state : ['沟通中','已中标','未中标'],
	orders_area : ['汉口','汉阳','武昌'],
	price_area  : ['50－100','100-200','200－300','300以上'],
	house_type : ['一居','二居','三居','四居','复式','别墅'],
	dec_flow : ['开工','拆改','水电','泥木','油漆','安装','竣工'],
	des_type : ['不限','表达型','聆听型'],
	auth_type : ['未提交认证','审核中','审核通过'],
	scheme_status : ['已预约但没有响应','已拒绝业主','已响应但是没有方案','提交了方案','方案被拒绝','方案被选中']
}
//var RootUrl = 'http://192.168.1.107:8080/';
var global_success_url = window.location;
var RootUrl = 'http://www.jianfanjia.com:8080/';
// 检测浏览器是否支持css3新属性，来给低版本浏览器做优雅降级；
function testCss3(c){var p=['webkit','Moz','ms','o'],i,a=[],s=document.documentElement.style,t=function(r){return r.replace(/-(\w)/g,function($0,$1){return $1.toUpperCase()})};for(i in p){a.push(t(p[i]+'-'+c));a.push(t(c))}for(i in a){if(a[i]in s){return true}}return false};
//Cookie操作
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}
(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
window.username = $.cookie("username");
window.usertype = $.cookie("usertype");
//消息提示框
function promptMessage(str,msg){
	var $win = $(window);
	var $body = $(document.body);
	var $promptBox = $('<div class="k-prompt"><h3>消息提示</h3><p class="'+msg+'">'+str+'</p></div>');
	$body.append($promptBox)
	var top = ($win.height()-$promptBox.outerHeight())/2;
	$promptBox.stop().animate({top:top,opacity:1},function(){
		setTimeout(function(){
            $promptBox.stop().fadeToggle('slow',0,function(){
            	$promptBox.remove();
            })
		}, 3000)
	});
}
/*
	下拉选择框插件
	3个参数：
		1：id用来生成input的name值的提供给后台
		2：下拉选项列表数据
		3：是否有下拉箭头按钮
*/
;(function($){
	function ComboBox(options){
		this.init(options)
	}
	ComboBox.prototype = {
		init : function(options){
			var self = this;
			this.win = $(window);
			this.doc = $(document);
			this.body = $(document.body);
			$.extend(this.settings = {
				id : null,
				list : [],
				btn : true,
				editor : false,
				index : false,
				query : 0
			},options || {});
			this.selectBox = $('#'+this.settings.id);
			this.input = $('<input type="hidden" name="'+this.settings.id+'" value="'+(this.settings.index ? "0" : this.settings.list[this.settings.query])+'" />');
			this.option = $('<div class="option"><span class="value">'+this.settings.list[this.settings.query]+'</span>'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>');
			this.editor = $('<div class="editor"><input class="value" name="'+this.settings.id+'" value="'+this.settings.list[this.settings.query]+'" />'+(this.settings.btn?'<span class="arrow"><em></em><i></i></span>':'')+'</div>');
			this.createList(this.settings.list);
			if(this.settings.editor){
				this.selectBox.append(this.editor);
				this.editorEvent();
			}else{
				this.selectBox.append(this.input);
				this.selectBox.append(this.option);
				this.optionEvevt();
			}
			this.select = this.selectBox.find('.select');
			this.selectEvent();
		},
		createList : function(data){
			var sLi = '<ul class="select">';
			for (var i = 0; i < data.length; i++) {
				sLi+= '<li><a href="javascript:;">'+data[i]+'</a></li>'
			};
			sLi+='</ul>';
			this.selectBox.append(sLi);
		},
		optionEvevt : function(){
			var self = this;
			self.option.on('click' , function(ev){
				self.body.click(); 
				self.selectShow();
				return false;
			});
		},
		selectEvent : function(){
			var self = this;
			this.body.on('click' , function(ev){
				self.selectHide(); 
			});
			this.select.delegate('li', 'click' , function(ev){
				ev.stopPropagation();
				var value = $(this).find('a').text();
				if(self.settings.index){
					self.input.val($(this).index())
				}else{
					self.input.val(value)
				}
				if(self.settings.editor){
					self.editor.find('.value').val(value).data('val',value);
				}else{
					self.option.find('.value').html(value);
				}
				self.selectHide();
			});
		},
		editorEvent : function(){
			var self = this;
			this.editor.on('click' , function(ev){
				self.body.click(); 
				self.selectShow();
				return false;
			});
			this.editor.find('.value').on('focus keyup',function(){
				self.selectShow();
				return false;
			})
		},
		selectHide : function(){
			this.selectBox.each(function(index, el) {
				$(el).css('zIndex',5).find('.select').hide();
			});
		},
		selectShow : function(){
			this.select.show(); 
			this.selectBox.css('zIndex',20)
		}
	}
	window["ComboBox"] = ComboBox;
})(jQuery);

/*
	1,格式化形式 "yyyy-MM-dd hh:mm:ss"
	2，时间 

*/ 
function format(format,data){
	var date = new Date(data)
    var o = {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(),    //day
        "h+" : date.getHours(),   //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
        "S" : date.getMilliseconds() //millisecond
    };
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o){
        if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
    }
    return format;
}
function IdentityCodeValid(code){ 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    return {
        verify : pass,
        info : tip
    }
}

/*
	pStr  要截取字符串
	pLen  截取长度
*/
function ellipsisStr(pStr, pLen) { 
 
    var _ret = cutString(pStr, pLen); 
    var _cutFlag = _ret.cutflag; 
    var _cutStringn = _ret.cutstring; 
 	function cutString(pStr, pLen) { 
	    // 原字符串长度 
	    var _strLen = pStr.length,
	    	_tmpCode,
	   	    _cutString; 
	    // 默认情况下，返回的字符串是原字符串的一部分 
	    var _cutFlag = "1"; 
	    var _lenCount = 0; 
	    var _ret = false; 
	    if (_strLen <= pLen/2) { 
	        _cutString = pStr; 
	        _ret = true; 
	    } 
	    if (!_ret) { 
	        for (var i = 0; i < _strLen ; i++ ) { 
	            if (isFull(pStr.charAt(i))) { 
	                _lenCount += 2; 
	            } else { 
	                _lenCount += 1; 
	            } 
	 
	            if (_lenCount > pLen) { 
	                _cutString = pStr.substring(0, i); 
	                _ret = true; 
	                break; 
	            } else if (_lenCount == pLen) { 
	                _cutString = pStr.substring(0, i + 1); 
	                _ret = true; 
	                break; 
	            } 
	        } 
	    }  
	    if (!_ret) { 
	        _cutString = pStr; 
	        _ret = true; 
	    } 
	    if (_cutString.length == _strLen) { 
	        _cutFlag = "0"; 
	    } 
	    return {"cutstring":_cutString, "cutflag":_cutFlag}; 
	}
	function isFull(pChar) {
		for (var i = 0; i < pChar.strLen ; i++ ) {     
		    if ((pChar.charCodeAt(i) > 128)) { 
		        return true; 
		    } else { 
		        return false; 
		    }
		}
	}
    return "1" == _cutFlag ? _cutStringn + "..." : _cutStringn;
} 
 

    

$(function(){
	//encodeURI("url地址")//编码
	//decodeURI("url地址")//解码
	var userLogin = $('#j-userLogin');
	if(window.username && window.usertype){
		if(window.usertype == 0){
			userLogin.html('<a href="../jyz/live.html">管理员 '+decodeURI(window.username)+'</a><a href="javascript:;" id="signout">退出</a>')
		}else if(window.usertype == 1){
			userLogin.html('<a href="../user/owner.html">业主 '+decodeURI(window.username)+'</a><a href="javascript:;" id="signout">退出</a>')
		}else if(window.usertype == 2){
			userLogin.html('<a href="../user/design.html">设计师 '+decodeURI(window.username)+'</a><a href="javascript:;" id="signout">退出</a>')
		}
	}else{
		console.log('未登陆状态')
	}
	//退出操作
	$(document.body).delegate('#signout','click',function(ev){
		ev.preventDefault();
		var url = RootUrl+'api/v1/signout';
		$.ajax({
			url:url,
			type: 'GET',
			contentType : 'application/json; charset=utf-8',
			dataType: 'json',
			cache : false,
			success: function(res){
				if(res["msg"] === "success"){
					$.removeCookie("username");
					$.removeCookie("usertype");
					window.location.href = "/";
					userLogin.html('<a href="../user/login.html">登录</a>/<a href="../user/reg.html">注册</a>')
				}else{
					alert('提交失败')
				}
				
		   	}
		});
	})
})