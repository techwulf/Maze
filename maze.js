function makeMaze(id,color,cell,wall){
	var element = document.getElementById(id);
	var width = element.offsetWidth;
	var height = element.offsetHeight;
	var cellData = getCellData(); 
	function drawCanvas(){
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = element.offsetWidth;
		canvas.height = element.offsetHeight;
		canvas.style.position = "absolute";
		canvas.id = id+"-maze";
		ctx.fillStyle = color;
		ctx.fillRect(0,0,width,height);
		element.appendChild(canvas);
	}
	function getCellData(){
		var mazew = (Math.floor(width/(cell+wall))*(cell+wall)-(cell+wall+cell+wall)+(wall));
		var mazeh = (Math.floor(height/(cell+wall))*(cell+wall)-(cell+wall+cell+wall)+(wall));
		var xset = (width-mazew)/2;
		var yset = (height-mazeh)/2;
		var xcntgy = 0;
		var ycntgy = 0;
		if (xset%1 != 0){
			xcntgy = 1;
			Math.floor(xset);
			//console.log("x is odd");
		}
		if (yset%1 != 0){
			ycntgy = 1;
			Math.floor(yset);
			//console.log("y is odd");
		}
		var cellnum = 0;
		var corner = {};
		var cornerData = [];
		var cel = {};
		var mazes = [];
		var mazecel = {};
		var cellData = [];
		var cellswidth = Math.floor(mazew/(cell+wall));
		var cellsheight = Math.floor(mazeh/(cell+wall));
		var neighbors = [];
		var neighbor;
		//console.log("mazew",mazew,"mazeh",mazeh,"xset",xset,"yset",yset);
		//console.log(width,height);
		for (var i=yset;i<mazeh+yset;i+=(cell+wall)){
			for (var j=xset;j<mazew+xset;j+=(cell+wall)){
				corner = { x:j,y:i };
				cornerData.push(corner);
				cel = { cell,x:0,y:0,up:"open",right:"open",down:"open",left:"open",neighbors };
				mazecel = { cell,x:0,y:0,up:"wall",right:"open",down:"open",left:"wall",neighbors };
				if ( j < mazew+xset-(cell+wall+xcntgy) && i < mazeh+yset-(cell+wall+ycntgy)){
					cel.x = j+wall;
					cel.y = i+wall;
					mazecel.x = cel.x;
					mazecel.y = cel.y;
					if (i === yset){
						cel.up = "wall";
					}
					else {
						neighbor = cellnum-cellswidth;
						neighbors.push(neighbor);
					}
					if (j === mazew+xset-(cell+wall+wall)){
						cel.right = "wall";
						mazecel.right = "wall";
					}
					else {
						neighbor = cellnum+1;
						neighbors.push(neighbor);
					}
					if (i === mazeh+yset-(cell+wall+wall)){
						cel.bottom = "wall";
						mazecel.bottom = "wall";
					}
					else {
						neighbor = cellnum+cellswidth;
						neighbors.push(neighbor);
					}
					if (j === xset){
						cel.left = "wall";
					}
					else {
						neighbor = cellnum-1;
						neighbors.push(neighbor);
					}
					cel.cell = cellnum;
					mazecel.cell = cellnum;
					cellnum++
					cellData.push(cel);
					neighbors = [];
					neighbor = 0;
					mazes.push(mazecel);
				}
			}
		}
		var Data = { corners:cornerData,cells:cellData,maze:mazes};
		return { Data,cellswidth,cellsheight };
	}
	function drawMaze(){
		var canvas = document.getElementById(id+"-maze");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "black";
		var xcor;
		var ycor;
		var corlen = cellData.Data.corners.length;
		for (var i=0;i<corlen;i++){
			xcor = cellData.Data.corners[i].x;
			ycor = cellData.Data.corners[i].y;
			ctx.fillRect(xcor,ycor,wall,wall);
		}
		var cellen = cellData.Data.cells.length;
		for (var i=0;i<cellen;i++){
			var xcor = cellData.Data.cells[i].x;
			var ycor = cellData.Data.cells[i].y;
			if (cellData.Data.cells[i].up === "wall"){
			ctx.fillRect(xcor,ycor-wall,cell,wall);
			}
			if (cellData.Data.cells[i].right === "wall"){
			ctx.fillRect(xcor+cell,ycor,wall,cell);
			}
			if (cellData.Data.cells[i].bottom === "wall"){
			ctx.fillRect(xcor,ycor+cell,cell,wall);
			}
			if (cellData.Data.cells[i].left === "wall"){
			ctx.fillRect(xcor-wall,ycor,wall,cell);
			}
		}
	}
	function genMaze(){
		var start = Math.floor(Math.random()*cellData.cellsheight)*cellData.cellswidth;
		var mazeData = cellData.Data.maze;
		mazeData[start].left = "open";
		var randnum = 0;
		var sneigh = [];
		var sneighn = [];
		var rneigh = [];
		var rneighn = [];
		var pathend = true;
		var end = true;
		var parents = [start];
		var ppool = [start];
		var tppool = [];
		var endmaze = true;

		while(endmaze){
			while (pathend){
				randnum = mazeData[start].neighbors[Math.floor(Math.random()*mazeData[start].neighbors.length)];
				if (start-cellData.cellswidth === randnum){
					mazeData[start].up = "open";
				}
				if (start-1 === randnum){
					mazeData[start].left = "open";
				}
				if (start+cellData.cellswidth === randnum){
					mazeData[randnum].up = "open";
				}
				if (start+1 === randnum){
					mazeData[randnum].left = "open";
					if (end === true && cellData.Data.cells[randnum].right === "wall"){
						mazeData[randnum].right = "open";
						mazeData[randnum].neighbors = [];
						end = false;
						pathend = false;
					}
				}
				sneigh = cellData.Data.cells[start].neighbors;
				rneigh = cellData.Data.cells[randnum].neighbors;
				for (var i=0;i<sneigh.length;i++){
					sneighn = mazeData[sneigh[i]].neighbors;
					//console.log(start,sneighn);
					mazeData[sneigh[i]].neighbors = [];
					for (var j=0;j<sneighn.length;j++){
						if (sneighn[j] != start){
							mazeData[sneigh[i]].neighbors.push(sneighn[j]);
						}
					}
					//console.log(start,mazeData[sneigh[i]].neighbors);
					sneighn = [];
				}
				sneigh = [];
				for (var i=0;i<rneigh.length;i++){
					rneighn = mazeData[rneigh[i]].neighbors;
					mazeData[rneigh[i]].neighbors = [];
					for (var j=0;j<rneighn.length;j++){
						if (rneighn[j] != randnum){
							mazeData[rneigh[i]].neighbors.push(rneighn[j]);
						}
					}
					rneighn = [];
				}
				rneigh = [];
				start = randnum;
				parents.push(start);
				ppool.push(start);
				if (mazeData[start].neighbors.length === 0){
					pathend = false;
				}
			}
			//console.log(parents.length,mazeData.length);
			tppool = ppool;
			ppool = [];
			for (var i=0;i<tppool.length;i++){
				if (mazeData[tppool[i]].neighbors.length != 0){
					ppool.push(tppool[i]);
				}
			}
			//console.log("ppool before ",tppool,"ppool after ",ppool);
			tppool = [];
			start = ppool[Math.floor(Math.random()*ppool.length)];
			pathend = true;
			if (parents.length === mazeData.length){
				endmaze = false;
			}
		}

		cellData.Data.cells = cellData.Data.maze;
	}
	//console.log(cellData.Data.corners.length);
	drawCanvas();
	genMaze();
	drawMaze();
	//console.log(cellData);
}
