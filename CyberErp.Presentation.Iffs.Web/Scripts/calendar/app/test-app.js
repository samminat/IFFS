
Ext.ns('Ext.erp.iffs.ux.Calendar');
var calendarList = {
    "calendars": [{
        "id": 1,
        "title": "Home"
    }, {
        "id": 2,
        "title": "Work"
    }, {
        "id": 3,
        "title": "School"
    }]
};

// multi-calendar implementation, which is beyond the scope of this sample app
Ext.erp.iffs.ux.Calendar.Store = function (config) {
    Ext.erp.iffs.ux.Calendar.Store.superclass.constructor.call(this, Ext.apply({
        directFn: Schedule.GetCalanderTypes,
        successProperty: 'success',
        idProperty: 'Id',
        root: 'data',
        fields: ['CalendarId', 'Title'],
        sortInfo: {
            field: 'CalendarId',
            direction: 'ASC'
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.Calendar.Store, Ext.data.DirectStore);
Ext.reg('calenderStore', Ext.erp.iffs.ux.Calendar.Store);

Ext.erp.iffs.ux.Calendar.eventStore = function (config) {
    Ext.erp.iffs.ux.Calendar.eventStore.superclass.constructor.call(this, Ext.apply({
        reader: new Ext.data.JsonReader({
            successProperty: 'success',
            idProperty: 'Id',
            root: 'data',
            fields: this.fields.getRange(),
        }),
        autoLoad: true,
        api: { read: Schedule.GetScheduleByUser }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.Calendar.eventStore, Ext.data.DirectStore);
Ext.reg('eventStore', Ext.erp.iffs.ux.Calendar.eventStore);


//Ext.erp.iffs.ux.Calendar.eventStore = new Ext.data.JsonStore({
//    id: 'eventStore',
//    root: 'evts',
//    data: eventList, // defined in event-list.js
//    proxy: new Ext.data.MemoryProxy(),
//    fields: Ext.calendar.EventRecord.prototype.fields.getRange(),
//    sortInfo: {
//        field: 'StartDate',
//        direction: 'ASC'
//    }
//});

/**
* @desc      Calendar panel
* @author    Samson
* @copyright (c) 2019, Cybersoft
* @date      Oct 02, 2019
* @namespace Ext.erp.iffs.ux.Calendar
* @class     Ext.erp.iffs.ux.Calendar.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.Calendar.Panel = function (config) {
    Ext.erp.iffs.ux.Calendar.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.Calendar.Panel, Ext.Panel, {
    initComponent: function () {
        this.calendarStore = new Ext.erp.iffs.ux.Calendar.Store();
        this.calendarStore.load();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                title: 'Packing Material',
                // id: 'PackingCalander',
                items: [{
                    xtype: 'calendarpanel',
                    eventStore: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'CalendarId', 'EventId', 'Title', 'StartDate', 'EndDate', 'ScheduleType', 'PreparedById', 'Notes', 'IsNew', 'Location', 'Reminder', 'Url', 'ScheduleTypeId', 'EndTime', 'StartTime']//root.fields.getRange()
                        }),
                        autoLoad: true,
                        api: { read: Schedule.GetScheduleByUser }
                    }),// this.eventStore,
                    //   calendarStore: new Ext.erp.iffs.ux.Calendar.calendarStore(),//this.calendarStore,
                    border: false,
                    id: 'app-calendar',
                    region: 'center',
                    activeItem: 2, // month view
                    monthViewCfg: {
                        showHeader: true,
                        showWeekLinks: true,
                        showWeekNumbers: true
                    },
                    listeners: {
                        'eventclick': {
                            fn: function (vw, rec, el) {
                                this.showEditWindow(rec, el);
                            },
                            scope: this
                        },
                        'eventover': function (vw, rec, el) {
                            //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventout': function (vw, rec, el) {
                            //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventadd': {
                            fn: function (cp, rec) {
                                this.showMsg('Event ' + rec.data.Title + ' was added');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function (cp, rec) {
                                this.showMsg('Event ' + rec.data.Title + ' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function (cp, rec) {
                                this.showMsg('Event ' + rec.data.Title + ' was deleted');
                            },
                            scope: this
                        },
                        'eventcancel': {
                            fn: function (cp, rec) {
                                // edit canceled
                            },
                            scope: this
                        },
                        'viewchange': {
                            fn: function (p, vw, dateInfo) {
                                if (this.editWin) {
                                    this.editWin.hide();
                                };
                                if (dateInfo !== null) {
                                    this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                }
                            },
                            scope: this
                        },
                        'dayclick': {
                            fn: function (vw, dt, ad, el) {
                                this.showEditWindow({
                                    StartDate: dt,
                                    IsAllDay: ad
                                }, el);
                            },
                            scope: this
                        },
                        'rangeselect': {
                            fn: function (win, dates, onComplete) {
                                this.showEditWindow(dates);
                                this.editWin.on('hide', onComplete, this, { single: true });
                            },
                            scope: this
                        },
                        'eventmove': {
                            fn: function (vw, rec) {
                                rec.commit();
                                var time = rec.data.IsAllDay ? '' : ' \\a\\t g:i a';
                                this.showMsg('Event ' + rec.data.Title + ' was moved to ' + rec.data.StartDate.format('F jS' + time));
                            },
                            scope: this
                        },
                        'eventresize': {
                            fn: function (vw, rec) {
                                rec.commit();
                                this.showMsg('Event ' + rec.data.Title + ' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function (win, rec) {
                                this.eventStore.remove(rec);
                                this.showMsg('Event ' + rec.data.Title + ' was deleted');
                            },
                            scope: this
                        },
                        'initdrag': {
                            fn: function (vw) {
                                if (this.editWin && this.editWin.isVisible()) {
                                    this.editWin.hide();
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }]
        }];

        Ext.erp.iffs.ux.Calendar.Panel.superclass.initComponent.apply(this, arguments);
    },
    showEditWindow: function (rec, animateTarget) {
        if (!this.editWin) {
            this.editWin = new Ext.calendar.EventEditWindow({
                calendarStore: this.calendarStore,
                listeners: {
                    'eventadd': {
                        fn: function (win, rec) {
                            win.hide();
                            rec.data.IsNew = false;
                            this.eventStore.add(rec);
                            this.showMsg('Event ' + rec.data.Title + ' was added');
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function (win, rec) {
                            win.hide();
                            rec.commit();
                            this.showMsg('Event ' + rec.data.Title + ' was updated');
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function (win, rec) {
                            this.eventStore.remove(rec);
                            win.hide();
                            this.showMsg('Event ' + rec.data.Title + ' was deleted');
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function (win, rec) {
                            var cal = Ext.getCmp('app-calendar');
                            win.hide();
                            cal.showEditForm(rec);
                        }
                    }
                }
            });
        }
        this.editWin.show(rec, animateTarget);
    },
    updateTitle: function (startDt, endDt) {
        var p = Ext.getCmp('app-calendar');

        if (startDt.clearTime().getTime() == endDt.clearTime().getTime()) {
            p.setTitle(startDt.format('F j, Y'));
        }
        else if (startDt.getFullYear() == endDt.getFullYear()) {
            if (startDt.getMonth() == endDt.getMonth()) {
                p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
            }
            else {
                p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
            }
        }
        else {
            p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
        }
    },
    showMsg: function (msg) {
        Ext.MessageBox.alert('Status', msg);//.removeClass('x-hidden');
    }
});
Ext.reg('Calendar-panel', Ext.erp.iffs.ux.Calendar.Panel);