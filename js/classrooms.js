function Classrooms(mapJSON, mapHandler) {
    this.init = function() {
        let slider = document.querySelector('#map .slider-input');
        let sliderText = document.querySelector('#map .slider-text');

        slider.addEventListener("input", function(ev) {
            sliderText.innerHTML = 'Hodina: ' + this.value;
            sliderText.style.setProperty('--position', ((this.value * 100) / 8) + '%');
            this_rooms.show(false, new Date(), this.value);
        });
    }
    
    this.refresh = function(mode = false) {
        this.show(mode, new Date());
    }

    this.show = function(mode, date, lesson) {
        if(typeof lesson === 'undefined') {
            var lesson = this_rooms.getLessonFromTime(date);
        }

        let url = this.getURL(date, lesson);

        var data = new FormData();
        data.append('url', url);
        data.append('secret', 'El258dfktpd2HTR4UGfZLGLo2');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            if (this.status == 200) {
                let msg = JSON.parse(this.response);
                this_rooms.indicateRooms(msg, mode);

                console.log('AJAX succesful');
            } else {
                console.log('onLoad Error AJAX');

                // let's show demo at least -->
                this_rooms.indicateRooms(schedule, mode);
            }
        };
        xhr.onerror = function() {
            console.log('onError Error AJAX');
        };
        xhr.send(data);
    }

    this.indicateRooms = function(rooms, mode) {
        document.querySelectorAll('#map .map__text').forEach(function(el){
			el.remove();
        });

        mapHandler.unshowRooms();
        
        Object.keys(rooms).forEach(function(room) {
            //console.log(room, rooms[room]);

            mapHandler.showRoom(parseInt(room), this_rooms.toColor(rooms[room].subject_color));
            mapHandler.writeOnRoom(parseInt(room), mapJSON[parseInt(room)].level, mode ? rooms[room].subject : rooms[room].teacher, "map__text");
        });
    }

    // get current date in yyyymmdd -> 20200223
    this.getURL = function(now, lesson) {
        let dd = String(now.getDate()).padStart(2, '0');
        let mm = String(now.getMonth() + 1).padStart(2, '0');
        let yyyy = now.getFullYear();

        let date = yyyy + mm + dd;
        console.log(date);
        
        //lesson = <?php echo isset($_GET['lesson']) ? $_GET['lesson'] : 'lesson'?>;

        return ('https://is.ghrabuvka.cz/api/schedule/' + date + '/' + lesson);
    }

    this.getLessonFromTime = function(now) {
        let time = now.getHours() * 60 + now.getMinutes();

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
        for(; lesson < timetable.length; lesson++) {
            if(timetable[lesson][0] < time && timetable[lesson][1] > time) {
                break;
            }
        }
        lesson++;

        return lesson;
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