var calendar = Object.create(Calendar);
calendar.init({
    events: [
        new CalendarEvent("Митинг на болотной", "", new Date(2013, 9, 6), "Володя Пу, Дима Мищечкин"),
        new CalendarEvent("Напиться!", "", new Date(2013, 9, 9), "Витя Костин, Петр Михайлов"),
        new CalendarEvent("ДР!", "", new Date(2013, 9, 22), "Дима Молодцов")
    ],
    helpers: Object.create(Helpers)
});
