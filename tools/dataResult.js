/*
author:whk
plugin:数据校验
*/

(function($){
    //用来定义数据校验插件的信息
    var __INFO__ = {
        pluginName: 'dataResult',
        version: '1.0.0',
        author:'whk'
    }
    //定义一些基础配置
    var OPTIONS = {
        'initEvent':'input',
        'data_extName':'dr',
        'submitVerify':true
    }
    //定义一些基础校验规则
    var RULES = {
        'required':function(){
            //当前的this指向的是当前元素的jquery对象
            return this.val();
        },
        'reg':function(val){
            return new RegExp(val).test(this.val());
        },
        'min-length':function(val){
            return this.val().length >= val;
        },
        'confirm':function(){
            //获取所有的密码框
            var passWord = $(':password')[0];
            return passWord.value == this.val();
        }
    }
    var dataResult = function(rules,options){
        
        //判断当前是否为form元素调用,如果不是，直接return
        if(!this.is('form')) return;
        //将基本配置扩展到当前的jquery对象上去
        $.extend(this,OPTIONS,options);
        var Rules = { };
        $.extend(Rules,RULES,rules);

        //获取form下的所有input元素,监听默认事件
        var inputEles = this.find('input');
        //保存当前的表单元素
        var _thisform = this;
        inputEles.on(this.initEvent,function(){
            //每次进来,清空提示信息
            $(this).siblings('p').remove();
            //注：当前的this为element元素,不是我们需要的jquery元素
             var _this = $(this);
            //遍历现有的规则
            $.each(Rules,function(key,fn){
                //获取自定义属性中是否有该规则
                var val = _this.data(_thisform.data_extName + '-' + key);
                var msg = _this.data(_thisform.data_extName + '-' + key + '-msg');
                //说明有该规则,需要校验
                if(val) {
                    //当值为空时，只校验required选项，不校验其他的规则
                    if(_this.val()== '' && key != 'required') return;
                    var res = fn.call(_this,val);
                    if(!res) {
                        //添加一个兄弟节点
                        _this.after("<p class='errorMsg' style='color:red;'>" + msg + "</p>");
                    }
                }  
            })
        })
        
        //判断是否需要在提交的时候强制校验
        if(this.submitVerify) {
            var submit = this.find(':submit');
            submit.on('click',function(){
                inputEles.trigger(_thisform.initEvent);
                //找到所有的错误标记
                var errMsg = _thisform.find('.errorMsg');
                if(errMsg.length == 0) {
                    //如果一个都没有，就返回true
                    return true;
                }
                return false;
            })   
        }
    };
    //将插件挂载到jQuery的原型对象上，这样每一个jQuery实例都可以使用该方法
    $.prototype[__INFO__.pluginName] = dataResult;
})(jQuery);