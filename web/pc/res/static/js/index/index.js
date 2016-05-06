require.config({
    baseUrl: '/static/js/',
    paths  : {
        jquery: 'lib/jquery',
        lodash : 'lib/lodash',
        lazyload : 'lib/lazyload',
        cookie : 'lib/jquery.cookie'
    }
});
require(['jquery','index/search'],function($,Search){
    var search = new Search();
    search.init();
});
require(['jquery','lazyload'],function($){
    $(function(){
        $("img.lazyimg").lazyload({
            effect : "fadeIn"
        });
    });
});
require(['jquery','index/banner'],function($,Banner){
    var banner = new Banner('#j-banner');
    $(function(){
        banner.init();
    });
});
require(['jquery','index/user'],function($,User){
    var user = new User('#j-user');
    $(function(){
        user.init();
    })
});
require(['jquery','index/tabs','index/Scrollswitch'],function($,Tabs,Scrollswitch){
    var $designers = $('#j-designers');
    var $designersList = $designers.find('.list');
    var list = new Scrollswitch($('#j-potter'),5);
        list.init();
    var list = new Scrollswitch($designersList.eq(0),10);
        list.init();
    var designer = new Tabs('#j-designers','click',function(index){
        list.stop();
        list = new Scrollswitch($designersList.eq(index),10);
        list.init();
    });
    designer.init();
});
require(['jquery','index/live'],function($,Live){
    var live = new Live('#j-live');
    $(function(){
        live.init();
    })
});
require(['jquery','index/tabs'],function($,Tabs){
    var media = new Tabs('#j-media');
    $(function(){
       media.init();
    })
});
require(['jquery','cookie','index/goto'],function($,cookie,Goto){
    var goto = new Goto();
    $(function(){
        goto.init({scroll : false});
    })
});
