function MapHandler() {
     // map element
    this.mapEl = document.getElementById('map');
    // the school element
    this.school = this.mapEl.querySelector('.school');
    // school´s levels wrapper
    this.schoolLevelsEl = this.school.querySelector('.levels');
    // school´s levels
    this.schoolLevels = [].slice.call(this.schoolLevelsEl.querySelectorAll('.level'));
    // total levels
    this.schoolLevelsTotal = this.schoolLevels.length;
    // surroundings elems
    this.schoolSurroundings = [].slice.call(this.school.querySelectorAll('.surroundings'));
    // selected level position
    this.selectedLevel;
    // check if currently animating/navigating
    this.isNavigating;

    _this = this;

    // ******  Level transparency handling  ******

    this.makeLevelTransparent = function(level) {
        classie.add(this.schoolLevels[level].querySelector(".level_map"), 'transparent');
        //classie.add(this.schoolLevels[level].querySelector(".level__pins"), 'transparent');
    }

    this.resetLevelsTransparency = function() {
        for(let i = 0; i < 3; i++) {
            classie.remove(this.schoolLevels[i].querySelector(".level_map"), 'transparent');
            //classie.remove(this.schoolLevels[i].querySelector(".level__pins"), 'transparent');
        }
    }

    // ******  Map color scheme handling  ******
    this.setPrimaryColor = function(accentColor) {
        this.mapEl.style.setProperty('--map-primary-color', accentColor);
    }

    // ******  Pin handling  ******

    // Show all needed pins for start and end node
    this.showPins = function(startNode, endNode) {
        this.showHerePin(startNode);
        
        this.showTargetPin(endNode);
        
        if(Math.abs(startNode.level - endNode.level) == 2) {
            this.showStairsPin(1);
            this.showStairsPin(0);
        } else if(Math.abs(startNode.level - endNode.level) == 1) {
            if(startNode.level == 1 || endNode.level == 1) {
                this.showStairsPin(0);
            } else {
                this.showStairsPin(1);
            }
        }
    }

    this.showHerePin = function(startNode) {
        document.getElementById("here-" + startNode.level).setAttribute("style", "left: calc((100%/1200) * " + startNode.x + " - 2px); top: calc((100%/800) * " + (800 - startNode.y) + ");");
        classie.add(this.schoolLevels[startNode.level - 1].querySelector('.here'), 'pin--active');
    }

    this.showHereHint = function(level) {
        classie.remove(this.schoolLevels[level].querySelector('.here-text'), 'pin-hidden'); // show here pin hint
    }

    this.setHereHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".here-text").innerHTML = text;
    }



    this.showTargetPin = function(endNode) {
        document.getElementById("target-" + endNode.level).setAttribute("style", "left: calc((100%/1200) * " + endNode.x + " - 2px); top: calc((100%/800) * " + (800 - endNode.y) + ");");
        classie.add(this.schoolLevels[endNode.level - 1].querySelector('.target'), 'pin--active');
    }

    this.showTargetHint = function(level) {
        classie.remove(this.schoolLevels[level].querySelector('.target-text'), 'pin-hidden'); // show target pin hint
    }

    this.setTargetHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".target-text").innerHTML = text;
    }



    this.showStairsPin = function(level) {
        classie.add(this.schoolLevels[level].querySelector('.stairs'), 'pin--active');
    }

    this.setStairsPinPosition = function(x, y, level) {
        document.getElementById("stairs-" + level).setAttribute("style", "left: calc((100%/1200) * " + x + " - 2px); top: calc((100%/800) * " + y + ");");
    }

    

    // Remove all pins
    this.removePins = function(startNode, endNode) {
        this.removeHerePin(startNode);
        this.removeHereHint(startNode.level - 1);
        this.removeTargetPin(endNode);
        this.removeTargetHint(endNode.level - 1);

        if(Math.abs(startNode.level - endNode.level) == 2) {
            this.removeStairsPin(1);
            this.removeStairsPin(0);
        } else if(Math.abs(startNode.level - endNode.level) == 1) {
            if(startNode.level == 1 || endNode.level == 1) {
                this.removeStairsPin(0);
            } else {
                this.removeStairsPin(1);
            }
        }
    }

    this.removeHerePin = function(startNode) {
        classie.remove(this.schoolLevels[startNode.level - 1].querySelector('.here'), 'pin--active');
    }

    this.removeHereHint = function(level) {
        classie.add(this.schoolLevels[level].querySelector('.here-text'), 'pin-hidden'); // hide here pin hint
    }

    this.removeTargetPin = function(endNode) {
        classie.remove(this.schoolLevels[endNode.level - 1].querySelector('.target'), 'pin--active');
    }

    this.removeTargetHint = function(level) {
        classie.add(this.schoolLevels[level].querySelector('.target-text'), 'pin-hidden'); // show target pin hint
    }

    this.removeStairsPin = function(level) {
        classie.remove(this.schoolLevels[level].querySelector('.stairs'), 'pin--active');
    }
    
    //******  Svg map handling ******

    this.highlightRoom = function(room) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            classie.add(roomEl, 'room--highlight');
        }
    }

    this.unhighlightRoom = function(room) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            classie.remove(roomEl, 'room--highlight');
        }
    }

    this.showRoom = function(room, color) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            roomEl.style.fill = color;
        }
    }
    
    this.getRoomDimensions = function(room) {
        let roomEl = document.getElementById(room);

        let bbox = roomEl.getBBox();
        return {x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height};
    }

    this.writeOnRoom = function(rooms, level, text, textClass) {
        var centerX = 0, centerY = 0;

        if(Array.isArray(rooms)) {
            var centersPosition = [];

            rooms.forEach(room => {
                let dims = this.getRoomDimensions(room);
                centersPosition.push({ x: Math.round(dims.x + dims.width / 2), y: Math.round(dims.y + dims.height / 2)});
            });

            centersPosition.forEach(center => {
                centerX += center.x;
                centerY += center.y;
            });

            centerX /= centersPosition.length;
            centerY /= centersPosition.length;
        } else {
            let dims = this.getRoomDimensions(rooms);

            centerX = Math.round(dims.x + dims.width / 2);
            centerY = Math.round(dims.y + dims.height / 2);
        }

        let newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        newText.setAttributeNS(null, "x", centerX);
        newText.setAttributeNS(null, "y", centerY);
        newText.setAttributeNS(null, "class", textClass);

        let textNode = document.createTextNode(text);
        newText.appendChild(textNode);
        
        document.querySelector('#gLevel' + level).appendChild(newText);
    }

    this.drawMapPlaces = function() {
        let text = 'WC';

        this.writeOnRoom([11, 14], 1, text, "map__wc_text");
        this.writeOnRoom([108, 131, 133], 1, text, "map__wc_text");
        this.writeOnRoom(126, 1, text, "map__wc_text");

        this.writeOnRoom([207, 221, 223], 2, text, "map__wc_text");
        this.writeOnRoom([200, 201], 2, text, "map__wc_text");
        this.writeOnRoom(219, 2, text, "map__wc_text");

        this.writeOnRoom([300, 301], 3, text, "map__wc_text");
        this.writeOnRoom(320, 3, text, "map__wc_text");
        this.writeOnRoom([307, 321, 323], 3, text, "map__wc_text");
    }

    //******  Map Surroundings appearence handling ******

    /**
     * Show the surroundings level
     */
    /*this.showSurroundings = function() {
        schoolSurroundings.forEach(function(el) {
            classie.remove(el, 'surroundings--hidden');
        });
    }*/

    /**
     * Hide the surroundings level
     */
    /*this.hideSurroundings = function() {
        schoolSurroundings.forEach(function(el) {
            classie.add(el, 'surroundings--hidden');
        });
    }*/

    // ******  Animations handling  ******

    // Move 1 level up or down (direction)
    /*this.moveByOneLevel = function(direction) {
        if( _this.isNavigating || !_this.isExpanded || _this.isOpenContentArea ) {
            return false;
        }
        _this.isNavigating = true;

        var prevSelectedLevel = _this.selectedLevel;
        var currentLevel = schoolLevels[prevSelectedLevel-1];

        if( direction === 'Up' && prevSelectedLevel > 1 ) {
            --_this.selectedLevel;
        }
        else if( direction === 'Down' && prevSelectedLevel < _this.schoolLevelsTotal ) {
            ++_this.selectedLevel;
        }
        else {
            _this.isNavigating = false;	
            return false;
        }
        
        classie.add(currentLevel, 'level--moveOut' + direction);
        
        var nextLevel = _this.schoolLevels[_this.selectedLevel-1];
        classie.add(nextLevel, 'level--current');

        onEndTransition(currentLevel, function() {
            classie.remove(currentLevel, 'level--moveOut' + direction);
            
            setTimeout(function() {classie.remove(currentLevel, 'level--current');}, 60);

            classie.remove(_this.schoolLevelsEl, 'levels--selected-' + prevSelectedLevel);
            classie.add(_this.schoolLevelsEl, 'levels--selected-' + _this.selectedLevel);

            _this.isNavigating = false;
        });
    }*/

    this.drawMapPlaces();
}