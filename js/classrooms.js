function Classrooms(mapJSON, mapHandler) {
    // ******  Init  ******
    this.init = function() {
        let today = new Date();
        let date = this.getFormattedDate(today);
        let time = today.getHours() * 60 + today.getMinutes();

        var timetable = [
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

        for(lesson = 0; lesson < timetable.length; lesson++) {
            if(timetable[lesson][0] < time && timetable[lesson][1] > time) {
                break;
            }
        }

        lesson++;
        //lesson = <?php echo isset($_GET['lesson']) ? $_GET['lesson'] : 'lesson'?>;

        var data = new FormData();
        data.append('url', 'https://is.ghrabuvka.cz/api/schedule/' + date + '/' + lesson);
        data.append('secret', 'El258dfktpd2HTR4UGfZLGLo2');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            if (this.status == 200) {
                let msg = JSON.parse(this.response);
                this_rooms.showUsedRooms(msg);

                console.log('AJAX succesful');
            } else {
                console.log('onLoad Error AJAX');

                // let's show demo at least -->
                this_rooms.showUsedRooms(schedule);
            }
        };
        xhr.onerror = function() {
            console.log('onError Error AJAX');
        };
        xhr.send(data);
    }

    this.showUsedRooms = function(rooms) {
        Object.keys(rooms).forEach(function(room) {
            console.log(room, rooms[room]);

            this_rooms.indicateRoom(parseInt(room), this_rooms.toColor(rooms[room].subject_color), rooms[room].subject, "map__text");
        });
    }

    this.indicateRoom = function(room, color, text, textClass) {
        mapHandler.showRoom(room, color);
        mapHandler.writeOnRoom(room, mapJSON[room].level, text, textClass);
    }

    // get current date in yyyymmdd -> 20200223
    this.getFormattedDate = function(today) {        
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        let date = yyyy + mm + dd;
        console.log(date);
    }

    this.toColor = function(num) {
        num >>>= 0;
        let r = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            b = (num & 0xFF0000) >>> 16;

        return "rgb(" + [r, g, b].join(",") + ")";
    }

    this_rooms = this;

    this.init();
}