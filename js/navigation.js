
function Navigation(mapJSON, mapNodesJSON) {

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
        for (let i = 0; i <= 2; i++) {
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
        this.mNodeMap = new NodeMap(mapNodesJSON);
        // add <x start node to mNodeMap
        //this.mNodeMap.removeNode(_this.startNode.name);
        this.mNodeMap.addNodeByPosition(_this.startNode.name, _this.startNode.x, _this.startNode.y, _this.startNode.level);
        // add >x end node to mNodeMap
        //this.mNodeMap.removeNode(_this.endNode.name);
        this.mNodeMap.addNodeByPosition(_this.endNode.name, _this.endNode.x, _this.endNode.y, _this.endNode.level);

        // calculate path using djikstra algorithm
        let djikstra = new Djikstra();
        let result = djikstra.calculate(this.mNodeMap.nodes, _this.startNode.name);

        this.nodeChain = result.shortestPaths[_this.endNode.name]; // shortest path to end node
        let pathDistance = Math.round(result.shortestDistances[_this.endNode.name] / 9); // distance to end node

        // simplify path (delete nodes, where the line goes in 180� angle)
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

    this.mapHandler = new MapHandler();
    this.ANIM_SPEED = 192;
    this.REND_FPS = 60; // fps - default value

    this.initNavigation = function() {
        this.currentLevel = this.startNode.level;
        this.nodeChainIndex = 1;
        this.lineIndex = 0;
        this.lineWaypoints = [];

        this.mapHandler.resetLevelsTransparency();
    }

    this.startNavigation = function() {
        // make level above startNode/endNode transparent if path and/or here/target pin couldn't be seen throught it
        if (/*_this.startNode.y > 510 &&*/ _this.startNode.level < 3) {
            _this.mapHandler.makeLevelTransparent(_this.startNode.level);
        }
        if (/*_this.endNode.y > 510 &&*/ _this.endNode.level < 3) {
            _this.mapHandler.makeLevelTransparent(_this.endNode.level);
        }

        // highlight start room
        _this.mapHandler.highlightRoom(_this.startNode.room);

        // show here pin with hint
        this.mapHandler.showHerePin(_this.startNode);
        this.mapHandler.showHereHint(_this.startNode.level - 1);

        setTimeout(function() {
            _this.mapHandler.removeHereHint(_this.startNode.level - 1);
            _this.startPathDrawing();
            _this.runNavigation();
        }, 1500);
    }

    this.runNavigation = function() {
        _this.t1 = performance.now();

        if (_this.nodeChainIndex >= _this.nodeChain.length) {
            _this.endPathDrawing();
            return;
        }

        _this.drawPathPoint();
    }

    // Start drawing the path. Draw start dot and then move cursor to startNode.
    this.startPathDrawing = function() {
        this.canvas[_this.startNode.level - 1].arc(_this.startNode.x, 800 - _this.startNode.y, 10, 0, 2 * Math.PI, 0); // make startNode dot
        this.canvas[_this.startNode.level - 1].stroke();
        this.canvas[_this.startNode.level - 1].moveTo(_this.startNode.x, 800 - _this.startNode.y); // move cursor to startNode

        this.line = { linePosition: 0 };
        _this.t0 = null;
    }

    // ----------------

    this.easeInOutCubic = function(t) {
        return (t < 0.5) ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    this.drawPathPoint = function() {
        if(_this.t0 != null && _this.t1 != null) {
            _this.REND_FPS = 1000 / (_this.t1 - _this.t0);
            //console.log(_this.REND_FPS);

            if(_this.REND_FPS > 240) {
                _this.REND_FPS = 240;
            }
        }

        if (_this.line.linePosition == 0) {
            _this.line.node0 = _this.mNodeMap.nodes[this.nodeChain[_this.nodeChainIndex - 1]];
            _this.line.node1 = _this.mNodeMap.nodes[this.nodeChain[_this.nodeChainIndex]];
            _this.line.dx = _this.line.node1.x - _this.line.node0.x;
            _this.line.dy = _this.line.node1.y - _this.line.node0.y;
            _this.line.c = Math.round(Math.sqrt(Math.pow(_this.line.dx, 2) + Math.pow(_this.line.dy, 2)));
        }

        _this.line.linePosition = (_this.line.linePosition + (_this.ANIM_SPEED / _this.REND_FPS));
        if(_this.line.linePosition > _this.line.c) _this.line.linePosition = _this.line.c;
        let linePercent = _this.line.linePosition / _this.line.c;        

        let x = _this.line.node0.x + _this.line.dx * _this.easeInOutCubic(linePercent);
        let y = _this.line.node0.y + _this.line.dy * _this.easeInOutCubic(linePercent);

        _this.canvas[_this.currentLevel - 1].lineTo(x, 800 - y); // y axis in json is inverted
        _this.canvas[_this.currentLevel - 1].stroke();

        if (linePercent >= 1) {
            _this.line.linePosition = 0;

            if (this.nodeChain[_this.nodeChainIndex].includes("S")) {
                let node = _this.mNodeMap.nodes[this.nodeChain[_this.nodeChainIndex]];
                let newLevel = this.nodeChain[_this.nodeChainIndex + 1][1];
				let stairs = (newLevel < _this.currentLevel) ? -1 : 0;

                do {
					_this.canvas[_this.currentLevel - 1].moveTo(node.x, 800 - node.y);
					_this.canvas[_this.currentLevel - 1].beginPath();
					_this.canvas[_this.currentLevel - 1].arc(node.x, 800 - node.y, 5, 0, 2 * Math.PI, 0); // make stairs dot
					_this.canvas[_this.currentLevel - 1].stroke();
					_this.canvas[_this.currentLevel - 1].fill();
                    
                    _this.mapHandler.setStairsPinPosition(node.x, 800 - node.y, _this.currentLevel + stairs)
					_this.mapHandler.showStairsPin(_this.currentLevel - 1 + stairs);
					
					_this.currentLevel = (newLevel > _this.currentLevel) ? (_this.currentLevel + 1) : (_this.currentLevel - 1);
                } while (_this.currentLevel != newLevel);
				
				_this.canvas[_this.currentLevel - 1].moveTo(node.x, 800 - node.y);
				_this.canvas[_this.currentLevel - 1].beginPath();
				_this.canvas[_this.currentLevel - 1].arc(node.x, 800 - node.y, 5, 0, 2 * Math.PI, 0); // make stairs dot
				_this.canvas[_this.currentLevel - 1].stroke();
				_this.canvas[_this.currentLevel - 1].fill();
				
                var wait = true;
            }

            _this.nodeChainIndex++;
        }

        if (!wait) {
            requestAnimationFrame(_this.runNavigation);
            _this.t0 = performance.now();
        } else {
            setTimeout(_this.runNavigation, 500);
            _this.t0 = null;
        }
    }

    //----------

    this.endPathDrawing = function() {
        _this.canvas[_this.currentLevel - 1].arc(_this.endNode.x, 800 - _this.endNode.y, 10, 0, 2 * Math.PI, 0); // make target dot
        _this.canvas[_this.currentLevel - 1].stroke();

        /* TIP: p�idat do pinu ikonku funkce m�stnosti */
        // highlight target room
        _this.mapHandler.highlightRoom(_this.endNode.room);

        _this.mapHandler.showTargetPin(_this.endNode);
        _this.mapHandler.showTargetHint(_this.endNode.level - 1);

        _this.setNavigatingState(false);

        /*setTimeout(function() {
            _this.mapHandler.removeTargetHint(_this.endNode.level - 1);
        }, 1500);*/
    }

    // ---------------------   Main function  --------------------
    this.map = mapJSON;
    this.listener = function(val) {};

    this.navigate = function(endRoom, startRoom=0, primaryColor='#4caf50') {
        this.setNavigatingState(true);

        let startRoomInfo = this.map[startRoom] || null;        
        let endRoomInfo = this.map[endRoom] || null;

        if(startRoomInfo == null || endRoomInfo == null || startRoomInfo.enabled == false || endRoomInfo.enabled == false) {
            return -1;
        }

        this.startNode = {name: "<" + startRoomInfo.level, x: startRoomInfo.x, y: startRoomInfo.y, level: startRoomInfo.level, room: startRoom};
        this.endNode = {name: ">" + endRoomInfo.level, x: endRoomInfo.x, y: endRoomInfo.y, level: endRoomInfo.level, room: endRoom};

        // set color scheme
        this.mapHandler.setPrimaryColor(primaryColor);
        this.accentColor = primaryColor;

        // configure start and end pins
        this.mapHandler.setTargetHintText(this.endNode.level - 1, endRoom);

        this.init();
        let pathDist = this.computePath();

        document.querySelector(".info .room").innerHTML = endRoom;
        document.querySelector(".info .steps").innerHTML = pathDist;

        this.startNavigation();	

        return 0;
    }

    this.registerListener = function(listener) {
        this.listener = listener;
    }
    
    this.setNavigatingState = function(state) {
        if(!state) setTimeout(function() {_this.listener(state)}, 1000);
    }

    this.clear = function() {
        if(typeof this.startNode === 'undefined' || typeof this.endNode === 'undefined')
            return;

        this.clearCanvas();
        this.mapHandler.removePins(this.startNode, this.endNode);

        this.init();
        this.mapHandler.unhighlightRoom(this.startNode.room);
        this.mapHandler.unhighlightRoom(this.endNode.room);
    }

    this.indicateRoom = function(room, color, text, textClass) {
        this.mapHandler.showRoom(room, color);
        this.mapHandler.writeOnRoom(room, this.map[room].level, text, textClass);
    }

    this.showRoom = function(room) {
        let node = this.map[room];

        this.mapHandler.highlightRoom(room);
        this.mapHandler.showTargetPin(node);
        this.mapHandler.setTargetHintText(node.level - 1, room);;
        this.mapHandler.showTargetHint(node.level - 1);
    }

    this.hideRoom = function(room) {
        let node = this.map[room];

        this.mapHandler.unhighlightRoom(room);
        this.mapHandler.removeTargetPin(node);        
        setTimeout(function() {
            _this.mapHandler.removeTargetHint(node.level - 1);
        }, 200);
    }

    _this = this;
}
