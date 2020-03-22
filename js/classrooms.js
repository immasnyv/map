function Classrooms(mapJSON, mapHandler) {
    this.init = function() {
        let slider = document.querySelector('#map .classrooms-selector .slider-input');
        let sliderText = document.querySelector('#map .classroom-slider-text');
        let classroomsInfo = document.querySelector('#map .classrooms-selector .info');

        let sliderBBox = slider.getBoundingClientRect();
        sliderText.style.setProperty('top', sliderBBox.top + 'px');
        sliderText.style.setProperty('left', sliderBBox.left + 'px');

        this_rooms.updateLessonInInfo(classroomsInfo, this.lesson);
        this_rooms.updateDateInInfo(classroomsInfo, this.date);
        
        sliderText.innerHTML = 'Hodina: ' + this.lesson;
        slider.value = this.lesson;

        function followMouse(ev) {
            sliderText.style.setProperty('left', ev.clientX + 'px');
            sliderText.style.setProperty('top', ev.clientY + 'px');
        }

        slider.addEventListener("mousedown", function(ev) {
            if(ev.button == 0) {
                sliderText.style.setProperty('display', 'initial');
                slider.addEventListener("mousemove", followMouse);
            }
        });

        slider.addEventListener("mouseup", function(ev) {
            sliderText.style.setProperty('display', 'none');
            slider.removeEventListener('mousemove', followMouse, false);
        });

        slider.addEventListener("input", function(ev) {
            sliderText.innerHTML = 'Hodina: ' + this.value;
        });
        
        slider.addEventListener("change", function(ev) {
            this_rooms.showRooms('subject', this_rooms.date, this_rooms.lesson = this.value);
            this_rooms.updateLessonInInfo(classroomsInfo, this_rooms.lesson);
        });

        let arrows = [].slice.call(document.querySelectorAll('#map .classrooms-selector .arrow'));
        arrows.forEach(function(arrow) {
            arrow.addEventListener("click", function(ev) {
                this_rooms.date.setDate(this_rooms.date.getDate() + (this.classList.contains('arrow__back') ? (-1) : +1));
                this_rooms.showRooms('subject', this_rooms.date, this_rooms.lesson);
                this_rooms.updateDateInInfo(classroomsInfo, this_rooms.date);
            });
        }); 
    }

    this.updateLessonInInfo = function(infoBar, lesson) {
        infoBar.querySelector('.lesson').innerHTML = lesson;
    }

    this.updateDateInInfo = function(infoBar, date) {
        let euroDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        infoBar.querySelector('.date').innerHTML = euroDate;
    }
    
    this.refresh = function(mode) {
        this.showRooms(mode, this_rooms.date, this_rooms.lesson);
    }

    this.showRooms = function(mode, date, lesson) {
        let loader = document.querySelector('#map .loader');
        loader.style.display = 'initial';

        if(typeof lesson === 'undefined') {
            var lesson = this_rooms.getLessonFromTime(date);
        }

        let url = this.getURL(date, lesson);
        console.log(url);

        var data = new FormData();
        data.append('url', url);
        data.append('secret', 'El258dfktpd2HTR4UGfZLGLo2');

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            if (this.status == 200) {
                let msg = JSON.parse(this.response);
                this_rooms.clear();
                this_rooms.indicateRooms(msg, mode);

                console.log('AJAX succesful');
                loader.style.display = 'none';
            } else {
                console.log('onLoad Error AJAX');

                // let's show demo at least -->
                this_rooms.clear();
                this_rooms.indicateRooms(schedule, mode);
                loader.style.display = 'none';
            }
        };
        xhr.onerror = function() {
            console.log('onError Error AJAX');
        };
        xhr.send(data);
    }

    this.indicateRooms = function(rooms, mode) {  
        Object.keys(rooms).forEach(function(room) {
            //console.log(room, rooms[room]);

            if(rooms[room].subject === undefined || rooms[room].subject === undefined) {
                return;
            }

            mapHandler.showRoom(parseInt(room), this_rooms.toColor(rooms[room].subject_color));
            mapHandler.writeOnRoom(parseInt(room), mapJSON[parseInt(room)].level, rooms[room][mode], "map__text");
        });
    }

    this.clear = function() {
        mapHandler.deleteTextOnRooms('map__text');        
        mapHandler.unshowRooms();
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

    this.toColor = function(num) {
        num >>>= 0;
        let r = num & 0xFF,
            g = (num & 0xFF00) >>> 8,
            b = (num & 0xFF0000) >>> 16;

        return "rgb(" + [r, g, b].join(",") + ")";
    }

    this.hide = function() {
        this_rooms.clear();
        document.querySelector('#map .classrooms-selector').style.display = 'none';
    }

    this.show = function() {
        document.querySelector('#map .classrooms-selector').style.display = 'flex';
    }

    this_rooms = this;

    this.date = new Date();
    this.lesson = this.getLessonFromTime(this.date);

    this.init();
}