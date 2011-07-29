window.onload = init_all;

function init_all(){
	//获取canvas上下文
	var canvas = document.getElementById("canvas");
	if(!canvas.getContext) return;
	var ctx = canvas.getContext("2d");
	
	//获取图片列表
	var imgList = document.getElementById("pic_list").getElementsByTagName("img");
	
	//获取初始尺寸
	var box = document.getElementById("canvas_box");
	
	var record = {};
	for(var i = 0; i < imgList.length; i++){
		record["img" + i] = {
			"trueWidth" : imgList[i].width,
			"trueHeight" : imgList[i].height
		}
	}
	
	
	
	//重置图片尺寸
	function rSize(){
		for(var i = 0; i < imgList.length; i++){
			var trueHeight = imgList[i].height;
			if(record["img" + i]["trueHeight"] >= box.clientHeight){
			imgList[i].height = Math.round((box.clientHeight)*10)/10;
			imgList[i].width = Math.round((imgList[i].width*box.clientHeight/trueHeight)*10)/10;}
			else{
				imgList[i].height = record["img" + i]["trueHeight"];
				imgList[i].width = record["img" + i]["trueWidth"];
			}
		}
	}
	rSize();
	
	//定义计数器、操作类型、翻转角度
	count.num = 0;
	count.type = "";
	count.radius = 0;
	count.curImg = imgList[count.num];
	
	function count(){
	
		//根据操作类型改变计数器和翻转角度的值
		switch(count.type){
			case "next" :
			if(count.num < imgList.length-1) return count.num++;
			else return count.num = 0;
			break;
			
			case "prev" :
			if(count.num <= 0) return count.num = imgList.length-1;
			else return count.num--;
			break;
			
			case "rotate_left" :
			if(count.radius < 3) return count.radius++;
			else return count.radius = 0;
			break;
			
			case "rotate_right" :
			if(count.radius >= 3) return count.radius = 0;
			else return count.radius--;
			break;
		}
	}
	
	//显示初始图
	showImg(imgList[count.num]);
	
	
	//窗口大小改变重绘图像
	window.onresize = function(){
		draw();
	}
	
	
	//下一张
	document.getElementById("next").onclick = function(){
		page(this.id);
	};
	
	
	//上一张
	document.getElementById("prev").onclick = function(){
		page(this.id);
	};
	
	
	//左旋转
	document.getElementById("rotate_left").onclick = function(){
		draw(this.id);
	};
	
	
	
	//右旋转
	document.getElementById("rotate_right").onclick = function(){
		draw(this.id);
	};
	
	
	//翻页函数
	function page(type){
		rSize();
		count.type = type;
		count.radius = 0;
		count();
		count.curImg = imgList[count.num];
		showImg(count.curImg);
	}
	
	
	
	//旋转函数
	function draw(type){
		count.type = type;
		count();
		console.log(count.radius);
		if(count.radius%2 != 0){
			var trueWidth = count.curImg.width;
			if(record["img" + count.num]["trueWidth"] >= box.clientHeight){
				count.curImg.width = box.clientHeight;
				count.curImg.height = count.curImg.height*box.clientHeight/trueWidth;}
			else if(record["img" + count.num]["trueHeight"] <= box.clientHeight){
				count.curImg.width = record["img" + count.num]["trueHeight"];
				count.curImg.height = record["img" + count.num]["trueWidth"];
			}
			canvas.setAttribute("width",count.curImg.height);
			canvas.setAttribute("height",count.curImg.width);
			canvasPosit();
			ctx.translate(count.curImg.height/2,count.curImg.width/2);
			rotate();
		}
		else{
			rSize();
			canvas.setAttribute("width",count.curImg.width);
			canvas.setAttribute("height",count.curImg.height);
			canvasPosit();
			ctx.translate(count.curImg.width/2,count.curImg.height/2);
			rotate();
		}
	}
	
	
	//旋转绘制
	function rotate(){
		ctx.save();
		ctx.rotate(-count.radius*Math.PI/2);
		ctx.drawImage(count.curImg,-count.curImg.width/2,-count.curImg.height/2,count.curImg.width,count.curImg.height);
		ctx.restore();
	}
	
	//绘制图像
	function showImg(obj){
		canvas.setAttribute("width",obj.width);
		canvas.setAttribute("height",obj.height);
		canvasPosit();
		ctx.drawImage(obj,0,0,obj.width,obj.height);
	}
	
	//图像垂直居中
	function canvasPosit(){
		var mTop = (box.clientHeight - canvas.clientHeight)/2 + "px";
		canvas.style.top = mTop;
	}
	
}