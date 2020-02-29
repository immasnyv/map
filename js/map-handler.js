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

    // ******  Level transparency handling  ******

    this.makeLevelTransparent = function(level) {
        this.schoolLevels[level].querySelector(".level_map").classList.add('transparent');
    }

    this.resetLevelsTransparency = function() {
        for(let i = 0; i < this.schoolLevelsTotal; i++) {
            this.schoolLevels[i].querySelector(".level_map").classList.remove('transparent');
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
        this.schoolLevels[startNode.level - 1].querySelector('.here').classList.add('pin--active');
    }

    this.showHereHint = function(level) {
        this.schoolLevels[level].querySelector('.here-text').classList.remove('pin-hidden'); // show here pin hint
    }

    this.setHereHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".here-text").innerHTML = text;
    }



    this.showTargetPin = function(endNode) {
        document.getElementById("target-" + endNode.level).setAttribute("style", "left: calc((100%/1200) * " + endNode.x + " - 2px); top: calc((100%/800) * " + (800 - endNode.y) + ");");
        this.schoolLevels[endNode.level - 1].querySelector('.target').classList.add('pin--active');
    }

    this.showTargetHint = function(level) {
        this.schoolLevels[level].querySelector('.target-text').classList.remove('pin-hidden'); // show target pin hint
    }

    this.setTargetHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".target-text").innerHTML = text;
    }



    this.showStairsPin = function(level) {
        this.schoolLevels[level].querySelector('.stairs').classList.add('pin--active');
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
        this.schoolLevels[startNode.level - 1].querySelector('.here').classList.remove('pin--active');
    }

    this.removeHereHint = function(level) {
        this.schoolLevels[level].querySelector('.here-text').classList.add('pin-hidden'); // hide here pin hint
    }

    this.removeTargetPin = function(endNode) {
        this.schoolLevels[endNode.level - 1].querySelector('.target').classList.remove('pin--active');
    }

    this.removeTargetHint = function(level) {
        this.schoolLevels[level].querySelector('.target-text').classList.add('pin-hidden'); // show target pin hint
    }

    this.removeStairsPin = function(level) {
        this.schoolLevels[level].querySelector('.stairs').classList.remove('pin--active');
    }
    
    //******  Svg map handling ******

    this.highlightRoom = function(room) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            roomEl.classList.add('room--highlight');
        }
    }

    this.unhighlightRoom = function(room) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            roomEl.classList.remove('room--highlight');
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
        
        this.schoolLevelsEl.querySelector('#gLevel' + level).appendChild(newText);
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

    // ******  3D mouse rotate interaction handlers  ******
    this.minX = parseInt(getComputedStyle(this.mapEl).getPropertyValue('--map-rotateX'));
    this.drag = false;
    this.x0 = null;
    this.y0 = null;
    this.rotX = 0;
    this.rotY = 0;

    this.init3Dmouse = function() {
        addEventListener('mousedown', this.lock, false);
        addEventListener('touchstart', this.lock, false);

        addEventListener('mouseup', this.release, false);
        addEventListener('touchend', this.release, false);
    }

    this.getE = function(ev) {
        return ev.touches ? ev.touches[0] : ev;
    }

    this.lock = function(ev) {
        let e = this_mapHandler.getE(ev);

        addEventListener('mousemove', this_mapHandler.rotate, false);
        addEventListener('touchmove', this_mapHandler.rotate, false);
        addEventListener('onwheel', this_mapHandler.zoom, false);

        this_mapHandler.drag = true;
        this_mapHandler.x0 = e.clientX;
        this_mapHandler.y0 = e.clientY;
    }

    this.Ax = 0.25;
    this.Ay = 0.25;

    this.rotate = function(ev) {
        if(this_mapHandler.drag) {
            let e = this_mapHandler.getE(ev),
                x = e.clientX, y = e.clientY,
                dx = x - this_mapHandler.x0, dy = y - this_mapHandler.y0;
                
            if(dx != 0 || dy != 0) {
                this_mapHandler.rotX = Math.min(Math.max(this_mapHandler.rotX + (-dy) * this_mapHandler.Ax, -this_mapHandler.minX), 90 - this_mapHandler.minX); // rotace kolem osy X je posun v y
                this_mapHandler.rotY += (-dx) * this_mapHandler.Ay;

                this_mapHandler.x0 = x;
                this_mapHandler.y0 = y;

                this_mapHandler.schoolLevelsEl.style.setProperty('--x', (this_mapHandler.rotX).toFixed(2) + 'deg');
                this_mapHandler.schoolLevelsEl.style.setProperty('--y', (this_mapHandler.rotY).toFixed(2) + 'deg');
            }
        }
    }

    this.zoom = function(ev) {
        if(this_mapHandler.drag) {
            let e = this_mapHandler.getE(ev),
                dz = e.x0;
                
            if(dz != 0) {
                this_mapHandler.rotX = Math.min(Math.max(this_mapHandler.rotX + (-dy) * this_mapHandler.Ax, -this_mapHandler.minX), 90 - this_mapHandler.minX); // rotace kolem osy X je posun v y
                this_mapHandler.rotY += (-dx) * this_mapHandler.Ay;

                this_mapHandler.x0 = x;
                this_mapHandler.y0 = y;

                this_mapHandler.schoolLevelsEl.style.setProperty('--x', (this_mapHandler.rotX).toFixed(2) + 'deg');
                this_mapHandler.schoolLevelsEl.style.setProperty('--y', (this_mapHandler.rotY).toFixed(2) + 'deg');
            }
        }
    }

    this.release = function(ev) {
        if(this_mapHandler.drag) {
            this_mapHandler.drag = false;
            this_mapHandler.x0 = this_mapHandler.y0 = null;

            removeEventListener('mousemove', this_mapHandler.rotate, false);
            removeEventListener('touchmove', this_mapHandler.rotate, false);
            removeEventListener('onwheel', this_mapHandler.zoom, false);
        }
    }

    this_mapHandler = this;

    this.drawMapPlaces();
    this.init3Dmouse();
}