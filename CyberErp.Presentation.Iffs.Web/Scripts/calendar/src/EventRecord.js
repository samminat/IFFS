
Ext.calendar.EventMappings = {
    EventId: {
        name: 'EventId',
        mapping: 'id',
        type: 'int'
    },
    CalendarId: {
        name: 'CalendarId',
        mapping: 'cid',
        type: 'int'
    },
    Title: {
        name: 'Title',
        mapping: 'title',
        type: 'string'
    },
    StartDate: {
        name: 'StartDate',
        mapping: 'start',
        type: 'date',
        dateFormat: 'c'
    },
    EndDate: {
        name: 'EndDate',
        mapping: 'end',
        type: 'date',
        dateFormat: 'c'
    },
    StartTime: {
        name: 'StartTime',
        mapping: 'startTime',
        type: 'time'
    },
    EndTime: {
        name: 'EndTime',
        mapping: 'endTime',
        type: 'time'
    },
    Location: {
        name: 'Location',
        mapping: 'loc',
        type: 'string'
    },
    Notes: {
        name: 'Notes',
        mapping: 'notes',
        type: 'string'
    },
    Url: {
        name: 'Url',
        mapping: 'url',
        type: 'string'
    },
    IsAllDay: {
        name: 'IsAllDay',
        mapping: 'ad',
        type: 'boolean'
    },
    Reminder: {
        name: 'Reminder',
        mapping: 'rem',
        type: 'string'
    },
    IsNew: {
        name: 'IsNew',
        mapping: 'n',
        type: 'boolean'
    }
};

(function () {
    var M = Ext.calendar.EventMappings;

    Ext.calendar.EventRecord = Ext.data.Record.create([
    M.EventId,
    M.StartTime,
    M.EndTime,
    M.CalendarId,
    M.Title,
    M.StartDate,
    M.EndDate,
    M.Location,
    M.Notes,
    M.Url,
    M.IsAllDay,
    M.Reminder,
    M.IsNew
    ]);

    /**
     * Reconfigures the default record definition based on the current Ext.calendar.EventMappings object
     */
    Ext.calendar.EventRecord.reconfigure = function () {
        Ext.calendar.EventRecord = Ext.data.Record.create([
        M.EventId,
        M.CalendarId,
        M.Title,
        M.StartDate,
        M.EndDate,
        M.StartTime,
        M.EndTime,
        M.Location,
        M.Notes,
        M.Url,
        M.IsAllDay,
        M.Reminder,
        M.IsNew
        ]);
    };
})();
