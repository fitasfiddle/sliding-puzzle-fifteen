class FifteenPuzzle {
	
	constructor() {
		this.pageBody = '';
		this.gridPanelRetain = '';
		this.gridElemWithSizeInfoObjectList = new Array();
		this.gridSizeVal = 4; // default grid dimension
		this.tileSizeVal = 40; // default tile dimension
		this.boardCount = 0;	
	}
	
	// Generates a grid for the puzzle
	addGrid(gridSizeId,tileSizeId) {
		this.pageBody = document.querySelector('body');
		console.log(this.pageBody);
		let tempSolvedState = 1; // 1 will signify grid is still unsolved and 0 will signify solved
		let tempGridId;
		let gridPanel = document.createElement('div');
		let gridElemWithSizeInfoObject = {};
		gridElemWithSizeInfoObject.gridPanelElem = null;
		gridElemWithSizeInfoObject.gridSizeInfo = null;
		gridElemWithSizeInfoObject.solvedState = null;
		
		this.boardCount += 1;
		gridPanel.id = 'puzzle'+this.boardCount;
		gridPanel.classList.add("grid");
		
		if(gridSizeId){
			this.gridSizeVal = document.getElementById(gridSizeId).value;
		}

		if(tileSizeId){
			let tempTileSizeVal;
			tempTileSizeVal = document.getElementById(tileSizeId).value;
			if(tempTileSizeVal >40){
			this.tileSizeVal= tempTileSizeVal;
			}
		}
		
		gridPanel.innerHTML = '';
			
		if(this.gridSizeVal && this.gridSizeVal >1){
		
			let n = 1;
			for(let i = 0; i <= this.gridSizeVal-1; i++){
				for(let j = 0; j <= this.gridSizeVal-1; j++){
					let tile = document.createElement('span');
					tile.id = 'tile-'+i+'-'+j+'_'+this.boardCount;
					tile.style.left = (j*(this.tileSizeVal)+1*j+1)+'px';
					tile.style.top = (i*(this.tileSizeVal)+1*i+1)+'px';
					tile.style.width = this.tileSizeVal+'px';
					tile.style.height = this.tileSizeVal+'px';			
					tile.style.fontSize = (this.tileSizeVal/2)+'px';			
					tile.style.lineHeight = tile.style.width;			
					
					if(n <= (this.gridSizeVal*this.gridSizeVal -1)){
						tile.innerHTML = (n++).toString();
					} else{
						tile.className = 'blank';
					}
					
					gridPanel.appendChild(tile);
				}
				this.pageBody.appendChild(gridPanel);	
			}
			this.gridPanelRetain = document.getElementById('puzzle'+this.boardCount);
			this.gridPanelRetain.style.width = (this.tileSizeVal*this.gridSizeVal+40)+'px';
			this.gridPanelRetain.style.height = (this.tileSizeVal*this.gridSizeVal+40)+'px';
			gridElemWithSizeInfoObject.gridPanelElem = this.gridPanelRetain;
			gridElemWithSizeInfoObject.gridSizeInfo = this.gridSizeVal;			
			gridElemWithSizeInfoObject.solvedState = 1;			
			this.gridElemWithSizeInfoObjectList.push(gridElemWithSizeInfoObject);
			gridElemWithSizeInfoObject.gridPanelElem.addEventListener('click', (e)=>{
				if(gridElemWithSizeInfoObject.solvedState == 1){
					if(e.currentTarget.id){
						tempGridId = e.currentTarget.id;
						tempGridId = tempGridId.substring(6);
						this.moveCell(gridElemWithSizeInfoObject,tempGridId,this.boardCount,e.target);
					}
					else{
						this.moveCell(gridElemWithSizeInfoObject,'',this.boardCount,e.target);
					}

				}
			});
			if(tempGridId){
				this.resetGrid(this.gridElemWithSizeInfoObjectList[tempGridId-1],tempGridId,this.boardCount);
			}
			else{
				this.resetGrid(this.gridElemWithSizeInfoObjectList[this.boardCount-1],'',this.boardCount);
			}
		}
		else{
			alert('Puzzle size mandatory - Please enter a number greater than 1'+'\n'+'Tile size is optional - Number less than 40 will be ignored while generating the puzzle');
			this.boardCount -= 1;				
		}
		
	}

	// Move the numbered tile to the blank tile
	moveCell(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam,tile) {
		
		// Check if the selected tile contains number
		if(tile.className != 'blank'){
			let tempGridSizeVal = gridElemWithSizeInfoObjectParam.gridSizeInfo;
			let blankCell = this.fetchEmptyAdjacentTile(tempGridSizeVal,tempGridIdParam,boardCountParam,tile);
			
			if(blankCell){
				let tmp = {style: tile.style.cssText, id: tile.id};
				tile.style.cssText = blankCell.style.cssText;
				tile.id = blankCell.id;
				blankCell.style.cssText = tmp.style;
				blankCell.id = tmp.id;
				
				if(gridElemWithSizeInfoObjectParam.solvedState == 1){
					this.verifyNumberedTileOrder(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam);
				}
			}			
		}	
	}
	
	
	// Fetch the blank tile
	fetchEmptyTile(grid) {
		return grid.querySelector('.blank');
	}
	
	// Fetch specific tile by row and column
	fetchTile(row,col,tempGridIdParam,boardCountParam) {
		if(tempGridIdParam){
			return document.getElementById('tile-'+row+'-'+col+'_'+tempGridIdParam);		
		}
		else {
			return document.getElementById('tile-'+row+'-'+col+'_'+boardCountParam);		  
		}
	}
	
	// Generate a random number for usage in the application
	randNumber(from, to) {

		return Math.floor(Math.random() * (to - from + 1)) + from;

	}
	
	// Check and fetch blank adjacent tile
	fetchEmptyAdjacentTile(gridSizeValParam,tempGridIdParam,boardCountParam,tile) {
		
		let adjacent = this.fetchAdjacentTiles(gridSizeValParam,tempGridIdParam,boardCountParam,tile);
		
		// Iterate and find the blank tile
		for(let i = 0; i < adjacent.length; i++){
			if(adjacent[i].className == 'blank'){
				return adjacent[i];
			}
		}
		return false;
	}

	// Fetch all adjacent tiles
	fetchAdjacentTiles(gridSizeValParam,tempGridIdParam,boardCountParam,tile) {
		
		let id = tile.id.split('-');
		
		// This gives the index values of tile
		let row = parseInt(id[1]);
		let col = parseInt(id[2]);
		
		let adjacent = [];
		
		// Gets all possible adjacent tiles
		if(row < gridSizeValParam-1){adjacent.push(this.fetchTile(row+1,col,tempGridIdParam,boardCountParam));}			
		if(row > 0){adjacent.push(this.fetchTile(row-1,col,tempGridIdParam,boardCountParam));}
		if(col < gridSizeValParam-1){adjacent.push(this.fetchTile(row, col+1,tempGridIdParam,boardCountParam));}
		if(col > 0){adjacent.push(this.fetchTile(row,col-1,tempGridIdParam,boardCountParam));}
		
		return adjacent;
		
	}
	
	// Verify if the order of numbers in the grid is correct
	verifyNumberedTileOrder(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam) {
		
		let temGridSizeVal = gridElemWithSizeInfoObjectParam.gridSizeInfo;
		// Find whether the blank tile is in correct position
		if(this.fetchTile(temGridSizeVal-1,temGridSizeVal-1,tempGridIdParam,boardCountParam).className != 'blank'){
			return;
		}
	
		let n = 1;
		// Iterate all tiles and check numbers
		for(let i = 0; i <= temGridSizeVal-1; i++){
			for(let j = 0; j <= temGridSizeVal-1; j++){
			if(n <= (temGridSizeVal*temGridSizeVal -1) && this.fetchTile(i, j,tempGridIdParam,boardCountParam).innerHTML != n.toString()){
					return;
				}
				n++;
			}
		}
		
		// Show a alert message when puzzle solved
		if(confirm('Awesome, you just solved it! \n Do you want to reset this puzzle and play again?')){
			this.resetGrid(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam);
		}
	}
	
	// Reset all the puzzle grids
	resetAllGrids(){
		if(this.gridElemWithSizeInfoObjectList && this.gridElemWithSizeInfoObjectList.length >=1){
			let tempGridElemWithSizeInfoList = this.gridElemWithSizeInfoObjectList;
			for(let i = 1; i <= this.boardCount; i++){
			 this.resetGrid(tempGridElemWithSizeInfoList[i-1], i);
			}
		}
	}
	
	// Reset a single puzzle grid
	resetGrid(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam) {

		let previousCell = null;
		let i = 1;
		let tempGridSizeVal = gridElemWithSizeInfoObjectParam.gridSizeInfo;
		let tempGridElem = null;
		let tempEmptyTile = null;
		if(tempGridIdParam){
			tempGridElem = document.getElementById('puzzle'+tempGridIdParam);		
		}
		else{
			tempGridElem = document.getElementById('puzzle'+boardCountParam);		
		}
		tempGridElem = gridElemWithSizeInfoObjectParam.gridPanelElem;
		gridElemWithSizeInfoObjectParam.solvedState = 0;

		let interval = setInterval(()=>{
			if(i <= 100){
				let tempEmptyTile = this.fetchEmptyTile(tempGridElem);
				let adjacent = this.fetchAdjacentTiles(tempGridSizeVal,tempGridIdParam,boardCountParam,tempEmptyTile);
				if(previousCell){
					for(let j = adjacent.length-1; j >= 0; j--){
						if(adjacent[j].innerHTML == previousCell.innerHTML){
							adjacent.splice(j, 1);
						}
					}
				}
				previousCell = adjacent[this.randNumber(0, adjacent.length-1)];
				this.moveCell(gridElemWithSizeInfoObjectParam,tempGridIdParam,boardCountParam,previousCell);
				i++;
			} else{
				clearInterval(interval);
				gridElemWithSizeInfoObjectParam.solvedState = 1;
			}
		}, 5);	
	}	

	
}

var puzzleGrid = new FifteenPuzzle();
puzzleGrid.addGrid('','');

function addGridFunc(gridSizeParam,tileSizeParam) {
	puzzleGrid.addGrid(gridSizeParam,tileSizeParam);
}

function resetAllGridsFunc() {
	puzzleGrid.resetAllGrids();
}
