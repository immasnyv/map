function Navigation(mapJSON, mapNodesJSON, mapHandler) {

    // ******  Init  ******
    this.init = function() {
        this.initCanvas();
        this.initNavigation();
    }

    // ******  Canvas handling functions  ******

    this.canvas = [
        document.getElementById("level--1-navigator").getContext('2d'),
        document.getElementById("level--2-navigator").getContext('2d'),
        document.getElementById("level--3-navigator").getContext('2d')
    ];

    /**
     * Initializate style of all canvases.
     */
    this.initCanvas = function() {
        for (let i = 0; i <= mapHandler.schoolLevelsTotal - 1; i++) {
            this.canvas[i].lineWidth = 10;
            this.canvas[i].lineCap = 'round';
            this.canvas[i].lineJoin = 'round';
            this.canvas[i].fillStyle = this.accentColor;
            this.canvas[i].strokeStyle = this.accentColor;
            this.canvas[i].imageSmoothingEnabled = true;
            this.canvas[i].beginPath();
        }
    }

    this.clearCanvas = function() {
        for (let i = 0; i <= 2; i++) {
            this.canvas[i].clearRect(0, 0, 1200, 800);
            this.canvas[i].beginPath();
        }
    }

    
    // ******  Path finding algorithm  ******
    this.nodeChain = [];

    // Find way from startNode (<x) to endNode (>x) and store result into nodeChain[]
    this.computePath = function() {
        // every time navigation is started, new fresh nodeMap must be loaded (otherwise there will be relations with previously used nodes)
        this.mNodeMap = new NodeMap(mapNodesJSON);
        // add <x start node to mNodeMap
        this.mNodeMap.addNodeByPosition(this_nav.startNode.name, this_nav.startNode.x, this_nav.startNode.y, this_nav.startNode.level);
        // add >x end node to mNodeMap
        this.mNodeMap.addNodeByPosition(this_nav.endNode.name, this_nav.endNode.x, this_nav.endNode.y, this_nav.endNode.level);

        // calculate path using djikstra algorithm
        let djikstra = new Djikstra();
        let result = djikstra.calculate(this.mNodeMap.nodes, this_nav.startNode.name);

        this.nodeChain = result.shortestPaths[this_nav.endNode.name]; // shortest path to end node
        let pathDistance = Math.round(result.shortestDistances[this_nav.endNode.name] / 9); // distance to end node

        // simplify path (delete nodes, where the line goes in 180° angle) - fix for issue causing slowdowns on straight path
        for(let i = 1; i < this.nodeChain.length - 1; i++) {
            if(this.nodeChain[i].includes("S")) {
                continue;
            }

            let prevNode = this.mNodeMap.nodes[this.nodeChain[i - 1]];
            let middleNode = this.mNodeMap.nodes[this.nodeChain[i]];
            let nextNode = this.mNodeMap.nodes[this.nodeChain[i + 1]];

            if((prevNode.x == middleNode.x && middleNode.x == nextNode.x) || (prevNode.y == middleNode.y && middleNode.y == nextNode.y)) {
                this.nodeChain.splice(i, 1);
            }
        }
		
		console.log(this.nodeChain);

        return pathDistance;
    }

    // ******  Path drawing functions  ******

    //mapHandler = new MapHandler();
    this.ANIM_SPEED = 192;
    this.REND_FPS = 60; // fps - default value

    this.initNavigation = function() {
        this.currentLevel = this.startNode.level;
        this.nodeChainIndex = 1;
        this.lineIndex = 0;
        this.lineWaypoints = [];

        mapHandler.resetLevelsTransparency();
    }

    this.startNavigation = function() {
        // make level above startNode/endNode's level transparent if there's chance that the path and/or here/target pin couldn't be seen throught it
        if (/*this_nav.startNode.y > 510 &&*/ this_nav.startNode.level < 3) {
            mapHandler.makeLevelTransparent(this_nav.startNode.level);
        }
        if (/*this_nav.endNode.y > 510 &&*/ this_nav.endNode.level < 3) {
            mapHandler.makeLevelTransparent(this_nav.endNode.level);
        }

        // highlight start room
        mapHandler.highlightRoom(this_nav.startNode.room);

        // show here pin with hint
        mapHandler.showHerePin(this_nav.startNode);
        mapHandler.showHereHint(this_nav.startNode.level - 1);

        setTimeout(function() {
            mapHandler.removeHereHint(this_nav.startNode.level - 1);
            this_nav.startPathDrawing();
            this_nav.runNavigation();
        }, 1500);
    }

    this.runNavigation = function() {
        this_nav.t1 = performance.now();

        if (this_nav.nodeChainIndex >= this_nav.nodeChain.length) {
            this_nav.endPathDrawing();
            return;
        }

        this_nav.drawPathPoint();
    }

    // Start drawing the path. Draw start dot and then move cursor to startNode.
    this.startPathDrawing = function() {
        this.canvas[this_nav.startNode.level - 1].arc(this_nav.startNode.x, 800 - this_nav.startNode.y, 10, 0, 2 * Math.PI, 0); // make startNode dot
        this.canvas[this_nav.startNode.level - 1].stroke();
        this.canvas[this_nav.startNode.level - 1].moveTo(this_nav.startNode.x, 800 - this_nav.startNode.y); // move cursor to startNode

        this.line = { linePosition: 0 };
        this_nav.t0 = null;
    }

    // ----------------

    this.easeInOutCubic = function(t) {
        return (t < 0.5) ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    this.drawPathPoint = function() {
        if(this_nav.t0 != null && this_nav.t1 != null) {
            this_nav.REND_FPS = 1000 / (this_nav.t1 - this_nav.t0);
            //console.log(this_nav.REND_FPS);

            if(this_nav.REND_FPS > 240) {
                this_nav.REND_FPS = 240;
            }
        }

        if (this_nav.line.linePosition == 0) {
            this_nav.line.node0 = this_nav.mNodeMap.nodes[this.nodeChain[this_nav.nodeChainIndex - 1]];
            this_nav.line.node1 = this_nav.mNodeMap.nodes[this.nodeChain[this_nav.nodeChainIndex]];
            this_nav.line.dx = this_nav.line.node1.x - this_nav.line.node0.x;
            this_nav.line.dy = this_nav.line.node1.y - this_nav.line.node0.y;
            this_nav.line.c = Math.round(Math.sqrt(Math.pow(this_nav.line.dx, 2) + Math.pow(this_nav.line.dy, 2)));
        }

        this_nav.line.linePosition = (this_nav.line.linePosition + (this_nav.ANIM_SPEED / this_nav.REND_FPS));
        if(this_nav.line.linePosition > this_nav.line.c) this_nav.line.linePosition = this_nav.line.c;
        let linePercent = this_nav.line.linePosition / this_nav.line.c;        

        let x = this_nav.line.node0.x + this_nav.line.dx * this_nav.easeInOutCubic(linePercent);
        let y = this_nav.line.node0.y + this_nav.line.dy * this_nav.easeInOutCubic(linePercent);

        this_nav.canvas[this_nav.currentLevel - 1].lineTo(x, 800 - y); // y axis in json (from Inkscape) is inverted
        this_nav.canvas[this_nav.currentLevel - 1].stroke();

        if (linePercent >= 1) {
            this_nav.line.linePosition = 0;

            if (this.nodeChain[this_nav.nodeChainIndex].includes("S")) {
                let node = this_nav.mNodeMap.nodes[this.nodeChain[this_nav.nodeChainIndex]];
                let newLevel = this.nodeChain[this_nav.nodeChainIndex + 1][1];
				let stairs = (newLevel < this_nav.currentLevel) ? -1 : 0;

                do {
					this_nav.canvas[this_nav.currentLevel - 1].moveTo(node.x, 800 - node.y);
					this_nav.canvas[this_nav.currentLevel - 1].beginPath();
					this_nav.canvas[this_nav.currentLevel - 1].arc(node.x, 800 - node.y, 5, 0, 2 * Math.PI, 0); // make stairs dot
					this_nav.canvas[this_nav.currentLevel - 1].stroke();
					this_nav.canvas[this_nav.currentLevel - 1].fill();
                    
                    mapHandler.setStairsPinPosition(node.x, 800 - node.y, this_nav.currentLevel + stairs)
					mapHandler.showStairsPin(this_nav.currentLevel - 1 + stairs);
					
					this_nav.currentLevel = (newLevel > this_nav.currentLevel) ? (this_nav.currentLevel + 1) : (this_nav.currentLevel - 1);
                } while (this_nav.currentLevel != newLevel);
				
				this_nav.canvas[this_nav.currentLevel - 1].moveTo(node.x, 800 - node.y);
				this_nav.canvas[this_nav.currentLevel - 1].beginPath();
				this_nav.canvas[this_nav.currentLevel - 1].arc(node.x, 800 - node.y, 5, 0, 2 * Math.PI, 0); // make stairs dot
				this_nav.canvas[this_nav.currentLevel - 1].stroke();
				this_nav.canvas[this_nav.currentLevel - 1].fill();
				
                var wait = true;
            }

            this_nav.nodeChainIndex++;
        }

        if (!wait) {
            requestAnimationFrame(this_nav.runNavigation);
            this_nav.t0 = performance.now();
        } else {
            setTimeout(this_nav.runNavigation, 500);
            this_nav.t0 = null;
        }
    }

    //----------

    this.endPathDrawing = function() {
        this_nav.canvas[this_nav.currentLevel - 1].arc(this_nav.endNode.x, 800 - this_nav.endNode.y, 10, 0, 2 * Math.PI, 0); // make target dot
        this_nav.canvas[this_nav.currentLevel - 1].stroke();

        /* TIP: přidat do pinu ikonku funkce místnosti */
        // highlight target room
        mapHandler.highlightRoom(this_nav.endNode.room);

        mapHandler.showTargetPin(this_nav.endNode);
        mapHandler.showTargetHint(this_nav.endNode.level - 1);

        this_nav.setNavigatingState(false);

        /*setTimeout(function() {
            mapHandler.removeTargetHint(this_nav.endNode.level - 1);
        }, 1500);*/
    }

    this.setNavigatingState = function(state) {
        if(!state) setTimeout(function() {this_nav.listener(state)}, 1000);
    }

    // ******  Main control functions  ******
    this.listener = function(val) {};

    this.navigate = function(endRoom, startRoom=0, primaryColor='#4caf50') {
        this.setNavigatingState(true);

        let startRoomInfo = mapJSON[startRoom] || null;        
        let endRoomInfo = mapJSON[endRoom] || null;

        if(startRoomInfo == null || endRoomInfo == null || startRoomInfo.enabled == false || endRoomInfo.enabled == false) {
            return -1;
        }

        this.startNode = {name: "<" + startRoomInfo.level, x: startRoomInfo.x, y: startRoomInfo.y, level: startRoomInfo.level, room: startRoom};
        this.endNode = {name: ">" + endRoomInfo.level, x: endRoomInfo.x, y: endRoomInfo.y, level: endRoomInfo.level, room: endRoom};

        // set color scheme
        mapHandler.setPrimaryColor(primaryColor);
        this.accentColor = primaryColor;

        // configure start and end pins
        mapHandler.setTargetHintText(this.endNode.level - 1, endRoom);

        this.init();
        let pathDist = this.computePath();

        /*document.querySelector(".info .room").innerHTML = endRoom;
        document.querySelector(".info .steps").innerHTML = pathDist;*/

        this.startNavigation();	

        return 0;
    }

    this.registerListener = function(listener) {
        this.listener = listener;
    }

    this.clear = function() {
        if(typeof this.startNode === 'undefined' || typeof this.endNode === 'undefined')
            return;

        this.clearCanvas();
        mapHandler.removePins(this.startNode, this.endNode);

        mapHandler.unhighlightRoom(this.startNode.room);
        mapHandler.unhighlightRoom(this.endNode.room);
    }

    this_nav = this;
}
