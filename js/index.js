;(function($){
	//alert($);
	
	var Carousel = function(pic){
		var self = this;
		//console.log(pic.attr("data-setting"));
		//保存单张图片对象
		this.pic = pic;
		this.ul = pic.find("ul");
		this.prevBtn = pic.find(".icon-prev");
		this.nextBtn = pic.find(".icon-next");
		this.picItems = pic.find("ul li")
		this.picFirst = this.picItems.eq(0);
		this.picLast = this.picItems.last();
		this.flipFlag = true;
		//默认参数设置 写在节点上的data-setting是人工设置的参数
		this.setting = {
			"width":1000,//容器宽
			"height":270,//容器高
			"picWidth":640,//第一帧宽
			"picHeight":270,//第一帧高
			"scale":0.9,
			"autoPlay":true,
			"speed":500,
			"delay":2000,
			"verticalAlign":"middle"
		}
		//console.log(this.setting)
		//合并对象 target object...
		$.extend(this.setting,this.getSetting());
		
		

		this.setSettingValue();
		this.setPicPos();
		//console.log(this.getSetting());
		//执行
		
		this.nextBtn.on("click",function(){
			if(self.flipFlag ){
				self.carouselFlip("left");
			}
			
		});
	
		this.prevBtn.click(function(){
			if(self.flipFlag){
				self.carouselFlip("right");
			}
			
		});
		//是否开启自动播放功能
		if(this.setting.autoPlay){
			this.autoPlay();
			this.pic.hover(function(){
				window.clearInterval(self.timer);
				console.log("1hahah");
			},function(){
				self.autoPlay();
				console.log("2hahah");
			})
		}
		
	}

	//初始化 启动整个模块
	Carousel.init = function(pics){
		var _this_ = this;
		pics.each(function(){
			new _this_($(this));
		})
	}


	Carousel.prototype = {
		//自动播放
		autoPlay:function(){
			var self = this;
			//坑，相当于跟对象增加属性
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},this.setting.delay);
			
		},
		//向左弹
		carouselFlip:function(dir){
			var _self_ = this;
			//保存zIndex的变量
			var zIndexAjust = [];
			if(dir === "left"){
				this.picItems.each(
					function(){
						var self = $(this);
						//难点
						var prev = self.prev().get(0) ? self.prev():_self_.picLast;
						//console.log(prev);
						var width = prev.width();
						var height = prev.height();
						var zIndex = prev.css("zIndex");
						var top = prev.css("top");
						var opacity = prev.css("opacity");
						var left = prev.css("left");
						zIndexAjust.push(zIndex);
						self.animate({
							width:width,
							height:height,
							// zIndex:zIndex,
							top:top,
							opacity:opacity,
							left:left
						},_self_.setting.speed,function(){
							_self_.flipFlag = true;
						});

					});
				this.picItems.each(function(i){
					$(this).css("zIndex",zIndexAjust[i]);
				});
			}else if(dir === "right"){
				this.picItems.each(
					function(){
						var self = $(this);
						//难点
						var next = self.next().get(0) ? self.next():_self_.picFirst;
						//console.log(next);
						var width = next.width();
						var height = next.height();
						var zIndex = next.css("zIndex");
						var top = next.css("top");
						var opacity = next.css("opacity");
						var left = next.css("left");
						zIndexAjust.push(zIndex);
						self.animate({
							width:width,
							height:height,
							// zIndex:zIndex,
							top:top,
							opacity:opacity,
							left:left
						},_self_.setting.speed,function(){
							_self_.flipFlag = true;
							//console.log(_self_.flipFlag);
						});


					});
				this.picItems.each(function(i){
							$(this).css("zIndex",zIndexAjust[i]);
						});
			}
		},
		//其他帧的位置确定
		setPicPos:function(){
			// 阻止this漂移
			var self = this;
			var otherPics = this.picItems.slice(1);
			//console.log(otherPic.length);
			var rightPicsLen = Math.ceil(otherPics.size()/2);
			var rightPics = otherPics.slice(0,rightPicsLen);
			var layer = Math.ceil(rightPics.size());
			//配置左边
			var leftPics = otherPics.slice(rightPicsLen); 
			//alert(leftPics.size());			

			//设置右边帧各元素的属性值。
			var rightW = this.setting.picWidth;
			var rightH = this.setting.picHeight;
			var gap = ((this.setting.width - this.setting.picWidth)/2)/layer;
			//alert(gap);
			var firstPicLeft = (this.setting.width - this.setting.picWidth)/2;
			var baseLeft = firstPicLeft + rightW;
			
			rightPics.each(function(i){
				//进来减一目的是让第一帧始终在最上层
				layer--;
				rightW = rightW * self.setting.scale;
				rightH = rightH * self.setting.scale;
				var j = i;
				$(this).css({
					zIndex:layer,
					width:rightW,
					height:rightH,
					left:(baseLeft + (++j)*gap)-rightW,
					opacity:1/(++i),
					// top:(self.setting.height - rightH)/2
					top:self.setVerticalAlign(rightH)
				});
				
			});

			//设置左边帧各元素的属性值
			var leftW = rightPics.last().width();
			var leftH = rightPics.last().height();
			var opacityLayer = Math.ceil(otherPics.size()/2);
			leftPics.each(function(i){
				//console.log("i="+i); 0 1
				//console.log("layer"+layer);
				$(this).css({
					zIndex:i,
					width:leftW,
					height:leftH,
					left:i*gap,
					opacity:1/opacityLayer,
					top:self.setVerticalAlign(leftH)
				});
				leftW = leftW/self.setting.scale;
				leftH = leftH/self.setting.scale;
				opacityLayer--;
			});
			
		},
		//设置垂直排列对齐
		setVerticalAlign:function(height){
			//alert(height);
			var verticalType = this.setting.verticalAlign;
			var top=0;
			if(verticalType === "middle"){
				top = (this.setting.height - height)/2;
			}else if(verticalType === "top"){
				top = 0;
			}else if(verticalType === "bottom"){
				console.log("bottom+");
				top = this.setting.height - height;
			}else{
				top = (this.setting.height - height)/2;
			}
			console.log("top"+top);
			return top;
		},
		//配置数值控制基本宽高
		setSettingValue:function(){
			this.pic.css({
				width:this.setting.width,
				height:this.setting.height
			});

			this.ul.css({
				width:this.setting.width,
				height:this.setting.height
			});

			var w = (this.setting.width - this.setting.picWidth)/2;
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.picItems.size()/2)
			});
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.picItems.size()/2)
			});
			this.picFirst.css({
				width:this.setting.picWidth,
				height:this.setting.picHeight,
				left:w,
				top:0,
				zIndex:Math.ceil(this.picItems.size()/2)
			})
		},
		//获取人工配置参数
		getSetting:function(){
			//JSON字符串 setting
			var setting = this.pic.attr("data-setting")
			//把json字符串转换成JavaScript对象，返回值可以是任意类型
			if(setting && (setting != "")){
				return $.parseJSON(setting);
			}else{
				return {};
			}

		}
	}

	
	//函数引用
	window.Carousel = Carousel;
})(jQuery)