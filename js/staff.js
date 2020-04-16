function Staff(mapJSON, mapHandler, ghrabApi) {
    var teacherList;
    var lastClickedPinRoom;
    this.name;
    this.room;

    this.init = function() {
        this_staff.showStaffList();

        let showButton = document.querySelector('#map .list-button');
        showButton.addEventListener("click", function(ev) {
            document.querySelector('#map #list-panel').style.display = 'flex';
        });
    }

    this.showStaffList = function() {
        ghrabApi.getStaff(this_staff.showStaffListOk, this_staff.showStaffListError);
    }

    this.showStaffListOk = function(data) {
        var values = [];
        for(var teacher in data.staff) {
            values.push({name: (data.staff[teacher].surname + ' ' + data.staff[teacher].firstname), room: data.staff[teacher].room});
        }

        var options = {
            valueNames: ['name', 'room'],
            item: '<li><span class="name"></span><span class="room"></span></li>'
        };

        teacherList = new List('list-panel', options, values);
        teacherList.sort('name', { alphabet: 'AÁBCČDĎEÉĚFGHChIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽaábcčdďeéěfghchiíjklmnňoópqrřsštťuúůvwxyýzž'});

        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var name = space.children[0].innerHTML;
            var spaceRoom = space.children[1].innerHTML;

            if(spaceRoom !== '') {
                space.addEventListener("click", function(ev) {
                    if(window.matchMedia("(orientation: portrait)").matches) {
                        document.querySelector('#map #list-panel').style.display = 'none';
                    }

                    this_staff.clear(lastClickedPinRoom);

                    mapHandler.showRoom(spaceRoom, 'var(--map-primary-color)');
                    mapHandler.writeOnRoom(spaceRoom, mapJSON[spaceRoom].level, spaceRoom, "map__text");
                    this_staff.showCurrentPosition(name, spaceRoom);
                });
            }
        });
    }

    this.showStaffListError = function() {
        var values = [];
        for(var teacher in staffJSON.staff) {
            values.push({name: (staffJSON.staff[teacher].surname + ' ' + staffJSON.staff[teacher].firstname), room: staffJSON.staff[teacher].room});
        }

        var options = {
            valueNames: ['name', 'room'],
            item: '<li><span class="name"></span><span class="room"></span></li>'
        };

        teacherList = new List('list-panel', options, values);
        teacherList.sort('name', { alphabet: 'AÁBCČDĎEÉĚFGHChIÍJKLMNŇOÓPQRŘSŠTŤUÚŮVWXYÝZŽaábcčdďeéěfghchiíjklmnňoópqrřsštťuúůvwxyýzž'});

        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var name = space.children[0].innerHTML;
            var spaceRoom = space.children[1].innerHTML;

            if(spaceRoom !== '') {
                space.addEventListener("click", function(ev) {
                    if(window.matchMedia("(orientation: portrait)").matches) {
                        document.querySelector('#map #list-panel').style.display = 'none';
                    }

                    this_staff.clear(lastClickedPinRoom);

                    mapHandler.showRoom(spaceRoom, 'var(--map-primary-color)');
                    mapHandler.writeOnRoom(spaceRoom, mapJSON[spaceRoom].level, spaceRoom, "map__text");
                    this_staff.showCurrentPosition(name, spaceRoom);
                });
            }
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

        document.querySelector('#map #list-panel').style.display = 'none';
        document.querySelector('#map .list-button').style.display = 'none';
        document.querySelector('#map .school').style.transform = '';
    }

    this.show = function() {
        if(window.matchMedia("(orientation: landscape)").matches) {
            document.querySelector('#map #list-panel').style.display = 'flex';
            document.querySelector('#map .list-button').style.display = 'none';

            let dims = document.querySelector('#map #list-panel').getBoundingClientRect();
            document.querySelector('#map .school').style.transform = 'translateX(-' + dims.width/2 +'px)';
        } else {
            document.querySelector('#map #list-panel').style.display = 'none';
            document.querySelector('#map .list-button').style.display = 'initial';
        }
    }

    this_staff = this;
    this.init();
}