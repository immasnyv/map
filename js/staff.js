function Staff(mapJSON, mapHandler) {
    var teacherList = new List('list-panel', { valueNames: ['name', { data: ['room']}]} );
    var lastClicked;

    this.init = function() {
        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var spaceRoom = space.getAttribute('data-room');
            var name = space.children[0].innerHTML;

            /*space.addEventListener("mouseover", function(ev) {
                this_staff.showRoom(spaceRoom);
            });
            
            space.addEventListener("mouseout", function(ev) {
                this_staff.hideRoom(spaceRoom);
            });

            space.addEventListener("click", function(ev) {
                let detailListEl = document.querySelector(".list-detail");

                detailListEl.querySelector(".detail-name").innerHTML = ev.target.innerHTML;
                detailListEl.querySelector(".detail-time").innerHTML = mapJSON[spaceRoom].x;
                detailListEl.querySelector(".detail-job").innerHTML = mapJSON[spaceRoom].comment;

                detailListEl.style.opacity = 1;
            });*/

            space.addEventListener("click", function(ev) {
                if(lastClicked !== undefined) {
                    this_staff.clearRooms(lastClicked);
                }

                this_staff.showRoom(spaceRoom, name);
                lastClicked = spaceRoom;
            });
        });
    }

    this.clearRooms = function(room) {
        let node = mapJSON[room];

        mapHandler.deleteTextOnRooms('map__text');
        mapHandler.unshowRooms();
        mapHandler.removeTargetPin(node);
        mapHandler.removeTargetHint(node.level - 1);
    }

    this.showRoom = function(room, name) {
        let node = mapJSON[room];

        mapHandler.showRoom(room, '#4caf50');
        mapHandler.writeOnRoom(room, node.level, room, "map__text");

        mapHandler.showTargetPin(node);
        mapHandler.setTargetHintText(node.level - 1, room);
        mapHandler.showTargetHint(node.level - 1);
    }
    
    /*this.showRoom = function(room) {
        let node = mapJSON[room];

        mapHandler.highlightRoom(room);
        mapHandler.showRoom(parseInt(room), '#4caf50');
        mapHandler.writeOnRoom(parseInt(room), mapJSON[parseInt(room)].level, room, "map__text");

        mapHandler.showTargetPin(node);
        mapHandler.setTargetHintText(node.level - 1, room);;
        mapHandler.showTargetHint(node.level - 1);
    }

    this.hideRoom = function(room) {
        let node = mapJSON[room];

        mapHandler.unhighlightRoom(room);
        mapHandler.removeTargetPin(node);
        mapHandler.removeTargetHint(node.level - 1);
    }*/

    this_staff = this;
    this.init();
}