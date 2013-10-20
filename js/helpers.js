var Helpers = (function(window, document){
    var date = new Date(),
        todayDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    var Helpers = {
        getTodayDate: function (){
            return todayDate;
        },
        guid: function(){
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },
        dateToString: function(date){
            date = date || todayDate;
            var m = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
                d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return d + "." + m + "." + date.getFullYear();
        },
        getDayOfWeek: function(day){
            if (day === 0) {
                day = 7;
            }
            return day - 1;
        }
    };
    return Helpers;
})(window, document, undefined);