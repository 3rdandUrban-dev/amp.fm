/**
 * jquery.expose 1.0.0 - Make HTML elements stand out
 * 
 * Copyright (c) 2009 Tero Piirainen
 * http://flowplayer.org/tools/expose.html
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Launch  : June 2008
 * Version : 1.0.0 - Sun Feb 15 2009 13:55:48 GMT-0000 (GMT+00:00)
 */
(function($){function fireEvent(opts,name,self){var fn=opts[name];if($.isFunction(fn)){try{return fn.call(self);}catch(error){if(opts.alert){alert("Error calling expose."+name+": "+error);}else{throw error;}return false;}}return true;}var mask=null;var exposed,conf=null;$.expose={getVersion:function(){return[1,0,0];},getMask:function(){return mask;},getExposed:function(){return exposed;},getConf:function(){return conf;},isLoaded:function(){return mask&&mask.is(":visible");},load:function(els,opts){if(this.isLoaded()){return this;}if(els){exposed=els;conf=opts;}else{els=exposed;opts=conf;}if(!els||!els.length){return this;}if(!mask){mask=$('<div id="'+opts.maskId+'"></div>').css({position:'absolute',top:0,left:0,width:'100%',height:$(document).height(),display:'none',opacity:0,zIndex:opts.zIndex});$("body").append(mask);$(document).bind("keypress.unexpose",function(evt){if(evt.keyCode==27){$.expose.close();}});if(opts.closeOnClick){mask.bind("click.unexpose",function(){$.expose.close();});}}if(fireEvent(opts,"onBeforeLoad",this)===false){return this;}$.each(els,function(){var el=$(this);if(!/relative|absolute/i.test(el.css("position"))){el.css("position","relative");}});els.css({zIndex:opts.zIndex+1});if(opts.color){mask.css("backgroundColor",opts.color);}if(!this.isLoaded()){mask.css({opacity:0,display:'block'}).fadeTo(opts.loadSpeed,opts.opacity,function(){fireEvent(opts,"onLoad",$.expose);});}return this;},close:function(){var self=this;if(!this.isLoaded()){return self;}if(fireEvent(conf,"onBeforeClose",self)===false){return self;}mask.fadeOut(conf.closeSpeed,function(){exposed.css({zIndex:conf.zIndex-1});fireEvent(conf,"onClose",self);});}};$.prototype.expose=function(conf){if(!this.length){return this;}var opts={alert:true,maskId:'exposeMask',loadSpeed:'slow',closeSpeed:'fast',closeOnClick:true,zIndex:9998,opacity:0.8,color:'#333'};if(typeof conf=='string'){conf={color:conf};}$.extend(opts,conf);$.expose.load(this,opts);return this;};})(jQuery);