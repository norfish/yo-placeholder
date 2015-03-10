/**
 * @desc Placeholder shim for lte IE9 
 * @author yongxiang.li@qunar.com
 * @date 2014.11.13
 *
 * Todo
 * 支持密码input的placeholder
 *
 * @usage
 * html: <input type="text" id="demo" placeholder="I am a placeholder" >
 * js: $('#demo').placeholder();
 */

!function($){

    var _VERSION = "0.0.2";

    var _createElement = (function() {
        if (typeof document.createElement !== 'function') {
            // This is the case in IE7, where the type of createElement is "object".
            // For this reason, we cannot call apply() as Object is not a Function.
            return function(){
                return document.createElement(arguments[0]);
            }
        } else {
            return function(){
                return document.createElement.apply(document, arguments);
            }
        }
    })();

    /**
     * [_supportPlaceholder determain if the brower support placeholder]
     * @return {[type]} [description]
     */
    function _supportPlaceholder(){
        var inp = _createElement('input');
        //return typeof inp.placeholder !== 'undefined';
        //return ('placeholder' in inp);
        return inp.placeholder !== undefined;
    }

    var Placeholder = function(elem, msg, ocolor,isPsw){

        //element
        this.$elem = $(elem);

        //placeholder 文字
        this.msg = msg;

        //原始颜色
        this.ocolor = ocolor; 

        //是否是密码框
        this.isPsw = isPsw || false;

        //初始化状态
        this._inited = false;
    }

    Placeholder.prototype = {
        constructor: Placeholder,

        init: function(){

            this.fixPlaceholder();

            //对于支持placeholder的直接返回，不需初始化
            if(_supportPlaceholder()){
                return false;
            }

            this.bindEvents();

            this.onShow();

            //缓存到元素上，方便再次调用
            this.$elem.data('yoplaceholder', this);

            this._inited = true;

            return this;
        },

        //如果元素已经初始化过，再调用的时候只改变值，不重新绑定事件
        reset: function(msg, ocolor, isPsw){
            this._inited = false;
            this.msg = msg;
            this.ocolor = ocolor; //原始颜色
            this.isPsw = isPsw || false;

            var $elem = this.$elem;

            //为了兼容之前的placeholder，以及jvalidate校验
            if($elem.data('placeholder') !== msg){
                $elem.data('placeholder', msg);
            }

            //对于支持placeholder的直接返回，不需初始化
            if(_supportPlaceholder()){
                return false;
            }

            this.onShow();

            //缓存到元素上，方便再次调用
            $elem.data('yoplaceholder', this);

            this._inited = true;

            return this;
        },

        //fix
        fixPlaceholder: function() {
            var $elem = this.$elem,
                msg = this.msg;

            //为了兼容之前的placeholder，以及jvalidate校验
            if($elem.data('placeholder') !== msg){
                $elem.data('placeholder', msg);
            }

            //兼容只有”data-placeholder“这种形式
            if( !$elem.attr('placeholder') ){
                $elem.attr('placeholder', msg);
            }
        },

        //展示placeholder
        showPH: function(){
            this.$elem.val(this.msg)
                .css('color', '#AAA');
        },
        
        //触发展示
        onShow: function(){
            if( this._shouldPlace() ){
                this.showPH();
            }
        },

        //触发隐藏
        onHide: function(){
            if( this._shoulClean() ){
                this.hidePH();
            }
        },

        //隐藏placeholder
        hidePH: function(){
            this.$elem.val('')
                .css('color', this.ocolor);
        },

        bindEvents: function(){
            var self = this,
                $elem = self.$elem;

            $elem.on('focus', function(){
                self.onHide();
            });

            $elem.on('blur', function(){
                self.onShow();
            });
        },

        //判断输入框内容是否为空
        isPlaceHolderEmpty: function(){
            var self = this,
                $elem = self.$elem;

            return $.trim($elem.val()) === "" || $elem.val() === self.msg;
        },

        //是否应该展示placeholder
        _shouldPlace: function(){
            return !this._inited || !this.$elem.val().length;
        },

        //是否应该清空内容
        _shoulClean: function(){
            return this.$elem.attr('placeholder') === this.$elem.val();
        }
    };


    $.fn.placeholder = function(){
        var elems = this;

        $.each(elems, function(i, elem){
            var $elem = $(elem),
                msg = $elem.attr('placeholder') || $elem.data('placeholder') || '',
                ocolor = $elem.css('color') || '#000',
                isPsw = ($elem.attr('type') === 'password'),
                ph;

            //是否已经初始化过
            if( $elem.data('yoplaceholder') ){
                ph = $elem.data('yoplaceholder');
                ph.reset(msg, ocolor, isPsw);

            } else {
                ph = new Placeholder($elem, msg, ocolor, isPsw);
                ph.init();
            }

            var _isDef = function(){
                return $.trim( $elem.val() ) == "" || $elem.val() == msg;
            };

            $elem[0].isPlaceHolderEmpty = _isDef;

        });
    };

}(jQuery);