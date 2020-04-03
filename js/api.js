function GhrabApi() {
    this.getSchedule = function(callbackOk, callbackError, date = new Date('22 Mar 2020 12:15'), lesson) {
        if(isNaN(lesson)) {
            var lesson = this_api.getLessonFromTime(date);
            if(isNaN(lesson)) {
                callbackError(lesson);
                return;
            }
        }
        let url = this_api.getURL(date, lesson);

        var data = new FormData();
        data.append('url', url);
        data.append('secret', /*<?php echo '*/'El258dfktpd2HTR4UGfZLGLo2'/*';?>*/);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.responseType = 'json';
        xhr.onload = function() {
            if(this.readyState === 4) {
                if (this.status == 200) {
                    callbackOk(this.response);
                    console.log('AJAX succesful');
                } else {
                    callbackError('Load Error');
                    console.log('onLoad Error AJAX');
                }
            }
        };
        xhr.onerror = function() {
            callbackError('Load Error');
            console.log('onError Error AJAX');
        };
        xhr.ontimeout = function() {
            callbackError('Timeout');
            console.log('Timeot AJAX');
        };
        xhr.send(data);
    }

    this.getStaff = function(callbackOk, callbackError) {
        let url = 'https://is.ghrabuvka.cz/api/staff';

        var data = new FormData();
        data.append('url', url);
        data.append('secret', /*<?php echo '*/'El258dfktpd2HTR4UGfZLGLo2'/*';?>*/);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "../getURL.php", true);
        xhr.timeout = 5000;
        xhr.responseType = 'json';
        xhr.onload = function() {
            if(this.readyState === 4) {
                if (this.status == 200) {
                    callbackOk(this.response);
                    console.log('AJAX succesful');
                } else {
                    callbackError('Load Error');
                    console.log('onLoad Error AJAX');
                }
            }
        };
        xhr.onerror = function() {
            callbackError('Load Error');
            console.log('onError Error AJAX');
        };
        xhr.timeout = function() {
            callbackError('Timeout');
            console.log('Timeot AJAX');
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

    this.timetable = [
        [07*60 + 00, 07*60 + 45], // 1
        [07*60 + 50, 08*60 + 35], // 2
        [08*60 + 40, 09*60 + 25], // 3
        [09*60 + 35, 10*60 + 20], // 4
        [10*60 + 40, 11*60 + 25], // 5
        [11*60 + 35, 12*60 + 20], // 6
        [12*60 + 30, 13*60 + 15], // 7
        [13*60 + 20, 14*60 + 05], // 8
        [14*60 + 10, 14*60 + 55], // 9
        [15*60 + 00, 15*60 + 45]  // 10
    ];

    this.getLessonFromTime = function(now) {
        let time = now.getHours() * 60 + now.getMinutes();

        if(time < this_api.timetable[0][0]) {
            return 'Před výukou';
        }
        for(var lesson = 0; lesson < this_api.timetable.length - 1; lesson++) {
            if(this_api.timetable[lesson][0] <= time && time < this_api.timetable[lesson][1]) {
                return lesson + 1;
            } else if(this_api.timetable[lesson][1] <= time && time < this_api.timetable[lesson + 1][0]) {
                return 'Přestávka ' + (lesson + 1);
            }
        }

        if(this_api.timetable[lesson][0] <= time && time < this_api.timetable[lesson][1]) {
            return lesson + 1;
        }

        return 'Po výuce';
    }

    this.getTimeFromLesson = function(lesson) {
        if(!isNaN(lesson)) {
            return this_api.timetable[lesson - 1];
        }

        if(lesson.substring(0,10) = 'Přestávka ') {
            let number = parseInt(lesson.slice(10)) - 1;
            let result = [this_api.timetable[number][1], this_api.timetable[number + 1][0]];

            return result;
        }

        return [this_api.timetable[this_api.timetable.length - 1][1], this_api.timetable[0][0]];
    }

    this.getLessonNumber = function(lesson) {
        if(!isNaN(lesson)) {
            return lesson;
        }

        if(lesson.substring(0,10) == 'Přestávka ') {
            return parseInt(lesson.slice(10));
        }

        if(lesson == 'Před výukou') {
            return 1;
        }

        return this_api.timetable.length;
    }

    this_api = this;
}