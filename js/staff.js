function Staff(mapJSON, mapHandler, ghrabApi) {
    var teacherList = new List('list-panel', { valueNames: ['name', { data: ['room']}]} );
    var lastClickedPinRoom;
    this.name;
    this.room;

    this.init = function() {
        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var spaceRoom = space.getAttribute('data-room');
            var name = space.children[0].innerHTML;

            space.addEventListener("click", function(ev) {
                this_staff.clear(lastClickedPinRoom);

                mapHandler.showRoom(spaceRoom, 'var(--map-primary-color)');
                mapHandler.writeOnRoom(spaceRoom, mapJSON[spaceRoom].level, spaceRoom, "map__text");
                this_staff.showCurrentPosition(name, spaceRoom);
            });
        });
    }

    this.showCurrentPosition = function(name, room) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'initial';

        this_staff.name = name;
        this_staff.room = room;
        ghrabApi.getSchedule(this_staff.showCurrentPositionOk, this_staff.showCurrentPositionError);
    }
    
    this.showCurrentPositionOk = function(rooms) {
        let found = false;

        for(var room in rooms) {
            if(rooms[room].teacher_name == this_staff.name) {
                let roomInt = parseInt(room);
                let node = mapJSON[roomInt];

                mapHandler.showTargetPin(node);
                mapHandler.setTargetHintText(node.level - 1, this_staff.name);
                mapHandler.showTargetHint(node.level - 1);

                mapHandler.showRoom(roomInt, ghrabApi.toColor(rooms[room].subject_color));
                mapHandler.writeOnRoom(roomInt, node.level, rooms[room].subject, "map__text");

                lastClickedPinRoom = roomInt;
                found = true;
                break;
            }
        }

        if(found == false) {
            let node = mapJSON[this_staff.room];

            mapHandler.showTargetPin(node);
            mapHandler.setTargetHintText(node.level - 1, this_staff.name);
            mapHandler.showTargetHint(node.level - 1);

            lastClickedPinRoom = this_staff.room;
        }

        let loader = document.querySelector('#map .loader');
        loader.style.display = 'none';
    }

    this.showCurrentPositionError = function(error) {
        // let's show demo at least -->
        
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'none';

        if(error == "Po výuce" || error == "Před výukou") {
            let node = mapJSON[this_staff.room];

            mapHandler.showTargetPin(node);
            mapHandler.setTargetHintText(node.level - 1, this_staff.name);
            mapHandler.showTargetHint(node.level - 1);

            lastClickedPinRoom = this_staff.room;

            return;
        }

        let rooms = schedule;
        let found = false;

        for(var room in rooms) {
            if(rooms[room].teacher_name == this_staff.name) {
                let roomInt = parseInt(room);
                let node = mapJSON[roomInt];

                mapHandler.showTargetPin(node);
                mapHandler.setTargetHintText(node.level - 1, this_staff.name);
                mapHandler.showTargetHint(node.level - 1);

                mapHandler.showRoom(roomInt, ghrabApi.toColor(rooms[room].subject_color));
                mapHandler.writeOnRoom(roomInt, node.level, rooms[room].subject, "map__text");

                lastClickedPinRoom = roomInt;
                found = true;
                break;
            }
        }

        if(!found) {
            let node = mapJSON[this_staff.room];

            mapHandler.showTargetPin(node);
            mapHandler.setTargetHintText(node.level - 1, this_staff.name);
            mapHandler.showTargetHint(node.level - 1);

            lastClickedPinRoom = this_staff.room;
        }
    }

    this.clear = function(pinRoom) {
        if(pinRoom !== undefined) {
            mapHandler.deleteTextOnRooms('map__text');
            mapHandler.unshowRooms();

            let node = mapJSON[pinRoom];
            mapHandler.removeTargetPin(node);
            mapHandler.removeTargetHint(node.level - 1);
        }
    }

    this.hide = function() {
        this_staff.clear(lastClickedPinRoom);

        mapHandler.resetLevelsTransparency();
        document.querySelector('#map #list-panel').style.display = 'none';
        document.querySelector('#map .school').style.transform = '';
    }

    this.show = function() {
        document.querySelector('#map #list-panel').style.display = 'flex';
        mapHandler.makeLevelTransparent(1);
        mapHandler.makeLevelTransparent(2);

        let dims = document.querySelector('#map #list-panel').getBoundingClientRect();
        document.querySelector('#map .school').style.transform = 'translateX(-' + dims.width/2 +'px)';
    }

    this_staff = this;
    this.init();
}