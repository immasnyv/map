function Staff(mapJSON, mapHandler, ghrabApi) {
    var teacherList;
    var lastClickedPinRoom;
    this.name;
    this.room;

    this.init = function() {
        this_staff.showStaffList();

        let showButton = document.querySelector('#map .list-button');
        showButton.addEventListener("click", function(ev) {
            document.querySelector('#map .list-panel').style.display = 'flex';
        });

        let search = document.querySelector('#map .list-panel .search');
        search.addEventListener("keyup", function(ev) {
            let filter = search.value.toUpperCase();
            let liElements = document.querySelector('#map .list-panel .list').getElementsByTagName('li');

            for (i = 0; i < liElements.length; i++) {
                let name = liElements[i].querySelector('.name');
                let txtValue = name.textContent || name.innerText;

                if (txtValue.toUpperCase().includes(filter)) {
                    liElements[i].style.display = "";
                } else {
                    liElements[i].style.display = "none";
                }
            }
        });
    };

    // Get data about staff from the Ghrab API 
    this.showStaffList = function() {
        ghrabApi.getStaff(this_staff.showStaffListOk, this_staff.showStaffListError);
    };

    // Function called from API - Staff data received -> Get staff names and rooms, sort them and put them into list
    this.showStaffListOk = function(data) {
        let values = [];
        for(let teacher in data.staff) {
            values.push(data.staff[teacher].surname + ' ' + data.staff[teacher].firstname + ',' + data.staff[teacher].room);
        }
        values.sort(function (a,b) {
            return a.localeCompare(b, 'cz');
        });

        let teacherList = document.querySelector('#map .list-panel .list');
        teacherList.innerHTML = '';
        for(let item in values) {
            let parts = values[item].split(',');
            let namePart = '<span class="name">' + parts[0] + '</span>';
            let roomPart = '<span class="room">' + ((parts[1] === 'null') ? '' : parts[1]) + '</span>';

            teacherList.innerHTML += '<li>' + namePart + roomPart + '</li>';
        }

        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var name = space.children[0].innerHTML;
            var spaceRoom = space.children[1].innerHTML;

            if(spaceRoom !== '') {
                space.addEventListener("click", function(ev) {
                    if(window.matchMedia("(orientation: portrait)").matches) {
                        document.querySelector('#map .list-panel').style.display = 'none';
                    }

                    this_staff.clear(lastClickedPinRoom);
 
                    mapHandler.showRoom(spaceRoom, 'var(--map-primary-color)');
                    mapHandler.writeOnRoom(spaceRoom, mapJSON[spaceRoom].level, spaceRoom, "map__text");
                    this_staff.showCurrentPosition(name, spaceRoom);
                });
            }
        });
    };

    // Function called from API - Data NOT received -> we are screwed up - nothing happens
    this.showStaffListError = function() {
        let values = [];
        for(let teacher in staffJSON.staff) {
            values.push(staffJSON.staff[teacher].surname + ' ' + staffJSON.staff[teacher].firstname + ',' + staffJSON.staff[teacher].room);
        }
        values.sort(function (a,b) {
            return a.localeCompare(b, 'cz');
        });

        let teacherList = document.querySelector('#map .list-panel .list');
        teacherList.innerHTML = '';
        for(let item in values) {
            let parts = values[item].split(',');
            let namePart = '<span class="name">' + parts[0] + '</span>';
            let roomPart = '<span class="room">' + ((parts[1] === 'null') ? '' : parts[1]) + '</span>';

            teacherList.innerHTML += '<li>' + namePart + roomPart + '</li>';
        }

        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var name = space.children[0].innerHTML;
            var spaceRoom = space.children[1].innerHTML;

            if(spaceRoom !== '') {
                space.addEventListener("click", function(ev) {
                    if(window.matchMedia("(orientation: portrait)").matches) {
                        document.querySelector('#map .list-panel').style.display = 'none';
                    }

                    this_staff.clear(lastClickedPinRoom);
 
                    mapHandler.showRoom(spaceRoom, 'var(--map-primary-color)');
                    mapHandler.writeOnRoom(spaceRoom, mapJSON[spaceRoom].level, spaceRoom, "map__text");
                    this_staff.showCurrentPosition(name, spaceRoom);
                });
            }
        });
    };

    // Get data about schedule from the Ghrab API
    this.showCurrentPosition = function(name, room) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'initial';

        this_staff.name = name;
        this_staff.room = room;
        ghrabApi.getSchedule(this_staff.showCurrentPositionOk, this_staff.showCurrentPositionError);
    };
    
    // Function called from API - Data received -> search for the teacher and put the pin where she/he is
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
                mapHandler.writeOnRoom(roomInt, node.level, rooms[room].class, "map__text");

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
    };

    // Function called from API - Data NOT received -> nothing happens, it may be better next time
    this.showCurrentPositionError = function(error) {
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

        // let's show demo at least -->
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
                mapHandler.writeOnRoom(roomInt, node.level, rooms[room].class, "map__text");

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
    };

    // Clear the map from the mess this file has done
    this.clear = function(pinRoom) {
        if(pinRoom !== undefined) {
            mapHandler.deleteTextOnRooms('map__text');
            mapHandler.unshowRooms();

            let node = mapJSON[pinRoom];
            mapHandler.removeTargetPin(node);
            mapHandler.removeTargetHint(node.level - 1);
        }
    };

    // Exit this mode
    this.hide = function() {
        this_staff.clear(lastClickedPinRoom);

        document.querySelector('#map .list-panel').style.display = 'none';
        document.querySelector('#map .list-button').style.display = 'none';
        document.querySelector('#map .school').style.transform = '';
    };

    // Enter this mode
    this.show = function() {
        if(window.matchMedia("(orientation: landscape)").matches) {
            document.querySelector('#map .list-panel').style.display = 'flex';
            document.querySelector('#map .list-button').style.display = 'none';

            let dims = document.querySelector('#map .list-panel').getBoundingClientRect();
            document.querySelector('#map .school').style.transform = 'translateX(-' + dims.width/2 +'px)';
        } else {
            document.querySelector('#map .list-panel').style.display = 'none';
            document.querySelector('#map .list-button').style.display = 'initial';
        }
    };

    this_staff = this;
    this.init();
}