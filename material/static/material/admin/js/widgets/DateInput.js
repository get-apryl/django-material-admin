(function() {
    'use strict';
    window.addEventListener('load', function () {
        const todayIcons = document.querySelectorAll('i.today');
        if (todayIcons.length) {
            for (let todayIcon of todayIcons) {
                todayIcon.addEventListener('click', function() {
                    let today = new Date();
                    let input = this.closest('.date-input').querySelector('.datepicker');
                    input.value = today.strftime(get_format('DATE_INPUT_FORMATS')[0]);
                });
            }
        }
        const calendars = document.querySelectorAll('i.calendar');
        if (calendars.length) {
            for (let calendar of calendars) {
                calendar.addEventListener('click', function() {
                    let input = this.closest('.date-input').querySelector('.datepicker');
                    input.click();
                });
            }
        }
    });
})();
