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
    };

    this.resetLevelsTransparency = function() {
        for(let i = 0; i < this.schoolLevelsTotal; i++) {
            this.schoolLevels[i].querySelector(".level_map").classList.remove('transparent');
        }
    };

    // ******  Map color scheme handling  ******
    this.setColors = function(primaryColor, textColor, bgGradientColor) {
        let primaryDarkColor = this_mapHandler.shadeColor(primaryColor, -40);
        let primaryClickedColor = this_mapHandler.shadeColor(primaryColor, -60);
        let secondaryTextColor = this_mapHandler.shadeColor(textColor, -50);

        this_mapHandler.mapEl.style.setProperty('--map-primary-color', primaryColor);
        this_mapHandler.mapEl.style.setProperty('--map-dark-primary-color', primaryDarkColor);
        this_mapHandler.mapEl.style.setProperty('--map-clicked-color', primaryClickedColor);
        this_mapHandler.mapEl.style.setProperty('--map-text-color', textColor);
        this_mapHandler.mapEl.style.setProperty('--map-secondary-text-color', secondaryTextColor);
        this_mapHandler.mapEl.style.setProperty('--map-background-primary-color', bgGradientColor);
    };

    // Add addition to all RGB components of color (works only with ccs' rgb(x,x,x))
    this.shadeColor = function(color, addition) {
        color = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
        let rgb = color.split(',');

        for(let i = 0; i < 3; i++) {
            rgb[i] = Math.min(Math.max(parseInt(rgb[i]) + addition, 0), 255);
        }

        return "rgb(" + [rgb[0], rgb[1], rgb[2]].join(",") + ")";
    };

    this.setPrimaryColor = function(accentColor) {
        this.mapEl.style.setProperty('--map-primary-color', accentColor);
    };

    this.getPrimaryColor = function() {
        return getComputedStyle(this.mapEl).getPropertyValue('--map-primary-color');
    };

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
    };

    this.showHerePin = function(startNode) {
        document.getElementById("here-" + startNode.level).setAttribute("style", "left: calc((100%/1200) * " + startNode.x + " - 2px); top: calc((100%/800) * " + (800 - startNode.y) + ");");
        this.schoolLevels[startNode.level - 1].querySelector('.here').classList.add('pin--active');
    };

    this.showHereHint = function(level) {
        this.schoolLevels[level].querySelector('.here-text').classList.remove('pin-hidden'); // show here pin hint
    };

    this.setHereHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".here-text").innerHTML = text;
    };



    this.showTargetPin = function(endNode) {
        document.getElementById("target-" + endNode.level).setAttribute("style", "left: calc((100%/1200) * " + endNode.x + " - 2px); top: calc((100%/800) * " + (800 - endNode.y) + ");");
        this.schoolLevels[endNode.level - 1].querySelector('.target').classList.add('pin--active');
    };

    this.showTargetHint = function(level) {
        this.schoolLevels[level].querySelector('.target-text').classList.remove('pin-hidden'); // show target pin hint
    };

    this.setTargetHintText = function(level, text) {
        this.schoolLevels[level].querySelector(".target-text").innerHTML = text;
    };



    this.showStairsPin = function(level) {
        this.schoolLevels[level].querySelector('.stairs').classList.add('pin--active');
    };

    this.setStairsPinPosition = function(x, y, level) {
        document.getElementById("stairs-" + level).setAttribute("style", "left: calc((100%/1200) * " + x + " - 2px); top: calc((100%/800) * " + y + ");");
    };

    this.showStairsS5Pin = function() {
        document.getElementById("stairs-1b").classList.add('pin--active');
    };

    this.setStairsS5PinPosition = function(x, y) {
        document.getElementById("stairs-1b").setAttribute("style", "left: calc((100%/1200) * " + x + " - 2px); top: calc((100%/800) * " + y + ");");
    };

    // ------------

   // Remove all pins
   this.removePins = function(startNode, endNode) {
       this.removeHerePin(startNode);
       this.removeHereHint(startNode.level - 1);
       this.removeTargetPin(endNode);
       this.removeTargetHint(endNode.level - 1);

       this.removeStairsPin(1);
       this.removeStairsPin(0);
       this.removeStairsS5Pin();
    };

    this.removeHerePin = function(startNode) {
        this.schoolLevels[startNode.level - 1].querySelector('.here').classList.remove('pin--active');
    };

    this.removeHereHint = function(level) {
        this.schoolLevels[level].querySelector('.here-text').classList.add('pin-hidden'); // hide here pin hint
    };

    this.removeTargetPin = function(endNode) {
        this.schoolLevels[endNode.level - 1].querySelector('.target').classList.remove('pin--active');
    };

    this.removeTargetHint = function(level) {
        this.schoolLevels[level].querySelector('.target-text').classList.add('pin-hidden'); // show target pin hint
    };

    this.removeStairsPin = function(level) {
        this.schoolLevels[level].querySelector('.stairs').classList.remove('pin--active');
    };

    this.removeStairsS5Pin = function() {
        document.getElementById("stairs-1b").classList.remove('pin--active');
    };
   
    //******  Svg map handling ******
    // Dye room with color
    this.showRoom = function(room, color) {
        let roomEl = document.getElementById(room);
        if (roomEl) {
            roomEl.style.fill = color;
            roomEl.classList.add('room--colored');
        }
    };

    // Uncolor ALL rooms that have been colored since last uncoloring
    this.unshowRooms = function() {
        document.querySelectorAll('#map .room--colored').forEach(function(el) {
            el.style.fill = '';
            el.classList.remove('room--colored');
        });
    };

    this.getRoomDimensions = function(room) {
        let roomEl = document.getElementById(room);

        let bbox = roomEl.getBBox();
        return {x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height};
    };

    // Write a label on the middle of a room (or multiple rooms) on certain level with a certain css class (textClass)
    this.writeOnRoom = function(rooms, level, text, textClass) {
        if(Array.isArray(rooms)) {
            for(room in rooms) {
                if(document.getElementById(rooms[room]) === null) {
                    return;
                }
            }
        } else {
            if(document.getElementById(rooms) === null) {
                return;
            }
        }

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
    };

    // Delete all rooms' label with certain css class (textClass)
    this.deleteTextOnRooms = function(textClass) {
        document.querySelectorAll('#map .' + textClass).forEach(function(el){
            el.remove();
        });
    };

    // Initial adding color and label to special rooms (WC, Buffet, ...) + set level's transparency
    this.drawMapPlaces = function() {
        let text = 'WC';

        this.writeOnRoom([11, 14], 1, text, "map__wc_text");
        this.writeOnRoom([131, 133], 1, text, "map__wc_text");
        //this.writeOnRoom(126, 1, text, "map__wc_text");

        this.writeOnRoom([221, 223], 2, text, "map__wc_text");
        this.writeOnRoom(200, 2, text, "map__wc_text");
        this.writeOnRoom(219, 2, text, "map__wc_text");

        this.writeOnRoom(300, 3, text, "map__wc_text");
        this.writeOnRoom(320, 3, text, "map__wc_text");
        this.writeOnRoom([321, 323], 3, text, "map__wc_text");

        text = 'Bufet';
        this.writeOnRoom(124, 1, text, "map__buffet_text");

        this.makeLevelTransparent(1);
        this.makeLevelTransparent(2);
    };

    // ******  3D mouse rotate interaction handlers  ******
    this.minX = parseInt(getComputedStyle(this.mapEl).getPropertyValue('--map-rotateX'));
    this.x0 = null;
    this.y0 = null;
    this.rotX = 0;
    this.rotY = 0;
    this.scaleZ = 1;

    this.init3Dmouse = function() {
        this.school.addEventListener('mousedown', this.lock, false);
        this.school.addEventListener('touchstart', this.lock, false);

        this.school.addEventListener('touchmove', this.rotate, false);

        this.school.addEventListener('mouseup', this.release, false);
        this.school.addEventListener('touchend', this.release, false);

        this.school.addEventListener('mousewheel', this.zoom, false);     // Chrome/Safari/Opera
        this.school.addEventListener('DOMMouseScroll', this.zoom, false); // Firefox
    };

    this.getE = function(ev) {
        return ev.touches ? ev.touches[0] : ev;
    };

    // Set up user watcher or do view reset
    this.lock = function(ev) {
        let e = this_mapHandler.getE(ev);

        if(e.button == 0) {
            this_mapHandler.school.addEventListener('mousemove', this_mapHandler.rotate, false);
        } else if(e.button == 1) {
            this_mapHandler.rotX = 0;
            this_mapHandler.rotY = 0;
            this_mapHandler.schoolLevelsEl.style.setProperty('--x', '0deg');
            this_mapHandler.schoolLevelsEl.style.setProperty('--y', '0deg');

            this_mapHandler.scaleZ = 1;
            this_mapHandler.schoolLevelsEl.style.setProperty('--z', '1');
        }

        this_mapHandler.x0 = e.clientX;
        this_mapHandler.y0 = e.clientY;
    };

    this.Ax = 0.25;
    this.Ay = 0.25;
    this.Az = 0.10;

    // On mouse drag changes appropriate css variables (--x, --y) to rotate the view
    this.rotate = function(ev) {
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
    };

    // Returns browserwide unified wheel distance
    this.wheelDistance = function(ev) {
        if(!ev) ev = event;
        let w = ev.wheelDelta;
        let d = ev.detail;
        let isMac = window.navigator.platform.toUpperCase().includes('MAC');

        if (d) {
            if (w) {
                return (w / d / 40 * d > 0) ? 1 : (-1); // Opera
            } else {
                return (isMac) ? (-d) : (-d / 3); // Firefox; do not /3 for OS X
            }
        } else {
            return (isMac) ? (w / 120 / 3) : (w / 120); // IE/Safari/Chrome; /3 for Chrome OS X
        }
    };

    // On mouse wheel travel change --z css variable to zoom
    this.zoom = function(ev) {
        if(ev.target === ev.currentTarget) {
            let distance = this_mapHandler.wheelDistance(ev);
            this_mapHandler.scaleZ = Math.min(Math.max(this_mapHandler.scaleZ + this_mapHandler.Az * distance, 0.45), 3);
            this_mapHandler.schoolLevelsEl.style.setProperty('--z', (this_mapHandler.scaleZ).toFixed(2));
        }
    };

    // User doesn't mouse drag -> disable watching user's mouse moves
    this.release = function(ev) {
        this_mapHandler.x0 = this_mapHandler.y0 = null;

        this_mapHandler.school.removeEventListener('mousemove', this_mapHandler.rotate, false);
    };

    this_mapHandler = this;

    this.drawMapPlaces();
    this.init3Dmouse();
}