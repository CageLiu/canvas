/* 获取索引 */
function getIndex(cur,obj){
	for(var i = 0;i < obj.length; i++){
		if(obj[i] == cur) return i;
	}
}

/* 计数器、翻转角度 */
count.index = 0;
count.type = "";
count.radius = 0;
function count(type){
	var imgList = document.getElementById("pic_list").getElementsByTagName("img");
	switch(count.type){
		case "next" :
		if(count.index < imgList.length-1) return count.index++;
		else return count.index = 0;
		break;
		
		case "prev" :
		if(count.index <= 0) return count.index = imgList.length-1;
		else return count.index--;
		break;
		
		case "rotate_left" :
		if(count.radius < 3) return count.radius++;
		else return count.radius = 0;
		break;
		
		case "rotate_right" :
		if(count.radius > 3 ) return count.radius = 0;
		else return count.radius--;
		break;
	}
}

/* 显示图片 */
function showImg(box,canvas,img,canvasObj,src){
	canvasObj.clearRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight);
	img.onload = function(){
		canvasPosit(box,canvas);
		if(this.height >= box.clientHeight){
			this.showHeight = box.clientHeight;
			this.showWidth = Math.round(this.width*box.clientHeight/this.height);
		}
		else{
			this.showHeight = this.height;
			this.showWidth = this.width;
		}
		canvas.setAttribute("width",this.showWidth);
		canvas.setAttribute("height",this.showHeight);
		canvasPosit(box,canvas);
		canvasObj.drawImage(this,0,0,this.showWidth,this.showHeight);
	}
	img.src = "";
	img.src = src;
}

/* 垂直居中设置 */
function canvasPosit(box,canvas){
	var wrapHeight = window.innerHeight;
	var barHeight = document.getElementById("bar").clientHeight + 6;
	box.style.height = parseInt((wrapHeight - barHeight) * 0.98) + "px";
	box.style.top = parseInt((wrapHeight - barHeight) * 0.01) + "px";
	canvas.height < box.clientHeight ? canvas.style.top = (box.clientHeight - canvas.clientHeight)/2 + "px" : canvas.style.top = 0;
}


/* 查看大图 */
function viewImg(){
	var myCanvas = document.getElementById("myCanvas");
	if(!myCanvas.getContext) return;
	var ctx = myCanvas.getContext("2d");
	var canvasBox = document.getElementById("canvas_box");
	var oImgList = document.getElementById("pic_list").getElementsByTagName("img");
	var img = document.getElementById("view_img");
	var btn = document.getElementById("bar").getElementsByTagName("a");
	
	
	/* 事件方法 */
	var operate = {
		page : function(obj){
			count.type = obj.id;
			count();
			showImg(canvasBox,myCanvas,img,ctx,oImgList[count.index].src);
			count.radius = 0;
		},
		rotate : function(oBtn,oImg){
			count.type = oBtn.id;
			count();
			canvasPosit(canvasBox,myCanvas);
			var x = 0;
			var y = 0;
			if(count.radius % 2 != 0){
				if(oImg.width >= canvasBox.clientHeight){
					oImg.showWidth = canvasBox.clientHeight;
					oImg.showHeight = oImg.height*oImg.showWidth/oImg.width;
				}
				else{
					oImg.showWidth = oImg.width;
					oImg.showHeight = oImg.height;
				}
				x = oImg.showHeight;
				y = oImg.showWidth;
			}
			else{
				if(oImg.height >= canvasBox.clientHeight){
					oImg.showHeight = canvasBox.clientHeight;
					oImg.showWidth = Math.round(oImg.width*canvasBox.clientHeight/oImg.height);
				}
				else{
					oImg.showHeight = oImg.height;
					oImg.showWidth = oImg.width;
				}
				x = oImg.showWidth;
				y = oImg.showHeight;
			}
			myCanvas.setAttribute("width",x);
			myCanvas.setAttribute("height",y);
			ctx.translate(x/2,y/2);
			canvasPosit(canvasBox,myCanvas);
			ctx.save();
			ctx.rotate(-count.radius*Math.PI/2);
			ctx.drawImage(oImg,-oImg.showWidth/2,-oImg.showHeight/2,oImg.showWidth,oImg.showHeight);
			ctx.restore();
			ctx.translate(-x/2,-y/2);
			if(document.getElementById("cover")){
			var cover = document.getElementById("cover");
				cover.style.width = document.documentElement.clientWidth + "px";
				cover.style.height = document.documentElement.clientHeight + "px";
			}
			console.log(count.radius);
		},
		close : function(obj){
			count.index = 0;
			count.radius = 0;
			document.getElementsByTagName("html")[0].style.overflow = "auto";
			document.getElementById("bar").style.display = "none";
			canvasBox.style.display = "none";
			document.getElementById("cover").style.display = "none";
		},
		zoom : function(obj){
			alert("zoom");
		},
	}
	
	myCanvas.onmousemove = function(e){
		var px = e.clientX;
		var py = e.clientY;
		var a = document.documentElement.clientWidth;
		var b = myCanvas.width;
		if(px >= (a - b)/2 && px < a/2){
			this.style.cursor = "url(http://s3.chenchao.cctvcjw.com/statics/images/shenghuo/left.cur), pointer";
			this.onclick = function(){
				operate["page"](document.getElementById("prev"),img);
			}
		}
		else if(px > a/2 && px <= (a+b)/2){
			this.style.cursor = "url(http://s3.chenchao.cctvcjw.com/statics/images/shenghuo/right.cur), pointer";
			this.onclick =function(){
				operate["page"](document.getElementById("next"),img);
			}
		}
	}
	
	/* 跟随窗口大小变化 */
	window.onresize = function(){
		operate["rotate"]('',img);
	}
	
	
	/* 触发显示大图 */
	for(var i = 0; i < oImgList.length; i++){
		oImgList[i].onclick = function(){
			count.index = getIndex(this,oImgList);
			count.radius = 0;
			document.getElementsByTagName("html")[0].style.overflow = "hidden";
			document.getElementById("bar").style.display = "block";
			canvasBox.style.display = "block";
			showImg(canvasBox,myCanvas,img,ctx,this.src);
			if(!document.getElementById("cover")){
				var cover = document.createElement("div");
				cover.setAttribute("id","cover");
				var style = 
					"width : "+document.documentElement.clientWidth +"px;height:"+document.documentElement.clientHeight +"px;position :absolute;top : 0px;left : 0px;zIndex : 888;opacity : 0.3;background:#30f;display:block"
				cover.setAttribute("style",style)
				document.body.appendChild(cover);
			}
			else{
				document.getElementById("cover").style.display = "block";
			}
		}
	}
	
	/* 绑定事件 */
	for(var i = 0; i < btn.length; i++){
		btn[i].onclick = function(){
			var oType = this.getAttribute("class");
			operate[oType](this,img);
		}
	}
}

window.onload = viewImg;
