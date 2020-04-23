
Ext.calendar.WeekView = Ext.extend(Ext.calendar.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});

Ext.reg('weekview', Ext.calendar.WeekView);