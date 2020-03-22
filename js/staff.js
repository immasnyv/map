function Staff(mapJSON, mapHandler) {
    var teacherList = new List('list-panel', { valueNames: ['name', { data: ['room']}]} );
    var lastClickedPinRoom;

    this.init = function() {
        let spaces = [].slice.call(document.querySelectorAll('.list > li'));                
        spaces.forEach(function(space) {
            var spaceRoom = space.getAttribute('data-room');
            var name = space.children[0].innerHTML;

            space.addEventListener("click", function(ev) {
                this_staff.clear(lastClickedPinRoom);

                this_staff.showRoom(spaceRoom, name);
                this_staff.showCurrentPosition(name);
            });
        });
    }

    this.showCurrentPosition = function(name) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'initial';

        let date = new Date();
        let lesson = this_staff.getLessonFromTime(date);
        let url = this_staff.getURL(date, lesson);

        var data = new FormData();
        data.append('url', url);
        data.append('secret', 'El258dfktpd2HTR4UGfZLGLo2');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            if (this.status == 200) {
                let rooms = JSON.parse(this.response);

                for(var room in rooms) {
                    if(rooms[room].teacher_name == name) {
                        let roomInt = parseInt(room);
                        let node = mapJSON[roomInt];

                        mapHandler.showTargetPin(node);
                        mapHandler.setTargetHintText(node.level - 1, name);
                        mapHandler.showTargetHint(node.level - 1);

                        mapHandler.showRoom(roomInt, this_staff.toColor(rooms[room].subject_color));
                        mapHandler.writeOnRoom(roomInt, node.level, rooms[room].subject, "map__text");

                        lastClickedPinRoom = roomInt;
                        break;
                    }
                }

                console.log('AJAX succesful');
                loader.style.display = 'none';
            } else {
                console.log('onLoad Error AJAX');

                // let's show demo at least -->
                let rooms = schedule;

                for(var room in rooms) {
                    if(rooms[room].teacher_name == name) {
                        let roomInt = parseInt(room);
                        let node = mapJSON[roomInt];

                        mapHandler.showTargetPin(node);
                        mapHandler.setTargetHintText(node.level - 1, name);
                        mapHandler.showTargetHint(node.level - 1);

                        mapHandler.showRoom(roomInt, this_staff.toColor(rooms[room].subject_color));
                        mapHandler.writeOnRoom(roomInt, node.level, rooms[room].subject, "map__text");

                        lastClickedPinRoom = roomInt;
                        break;
                    }
                }

                loader.style.display = 'none';
            }
        };
        xhr.onerror = function() {
            console.log('onError Error AJAX');
            loader.style.display = 'none';
        };
        xhr.send(data);
    }

    this.toColor = function(num) {
        num >>>= 0;
        let r = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            b = (num & 0xFF0000) >>> 16;

        return "rgb(" + [r, g, b].join(",") + ")";
    }

    this.getURL = function(now, lesson) {
        // get current date in yyyymmdd -> 20200223
        let dd = String(now.getDate()).padStart(2, '0');
        let mm = String(now.getMonth() + 1).padStart(2, '0');
        let yyyy = now.getFullYear();

        let date = yyyy + mm + dd;

        return ('https://is.ghrabuvka.cz/api/schedule/' + date + '/' + lesson);
    }

    this.getLessonFromTime = function(now) {
        let time = now.getHours() * 60 + now.getMinutes();

        const timetable = [
            [07*60 + 00, 07*60 + 45],
            [07*60 + 50, 08*60 + 35],
            [08*60 + 40, 09*60 + 25],
            [09*60 + 35, 10*60 + 20],
            [10*60 + 40, 11*60 + 25],
            [11*60 + 35, 12*60 + 20],
            [12*60 + 30, 13*60 + 15],
            [13*60 + 20, 14*60 + 05],
            [14*60 + 10, 14*60 + 55],
            [15*60 + 00, 15*60 + 45]
        ];

        var lesson = 0;
        for(; lesson < timetable.length; lesson++) {
            if(timetable[lesson][0] < time && timetable[lesson][1] > time) {
                break;
            }
        }
        lesson++;

        return lesson;
    }

    this.clear = function(pinRoom) {
        mapHandler.deleteTextOnRooms('map__text');
        mapHandler.unshowRooms();
        
        if(pinRoom !== undefined) {
            let node = mapJSON[pinRoom];
            mapHandler.removeTargetPin(node);
            mapHandler.removeTargetHint(node.level - 1);
        }
    }

    this.showRoom = function(room, name) {
        let node = mapJSON[room];

        mapHandler.showRoom(room, '#4caf50');
        mapHandler.writeOnRoom(room, node.level, room, "map__text");
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
        document.querySelector('#map .school').style.transform = 'translateX(-10%)';
    }

    this_staff = this;
    this.init();
}