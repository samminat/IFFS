
Ext.calendar.EventEditWindow = function (config) {
    var formPanelCfg = {
        api: {
            load: Schedule.Get,
            submit: Schedule.Save
        },
        xtype: 'form',
        labelWidth: 65,
        frame: false,
        bodyStyle: 'background:transparent;padding:5px 10px 10px;',
        bodyBorder: false,
        border: false,
        items: [{
            id: 'title',
            name: Ext.calendar.EventMappings.Title.name,
            fieldLabel: 'Title',
            xtype: 'textfield',
            anchor: '100%'
        },
        {
            xtype: 'daterangefield',
            id: 'date-range',
            anchor: '100%',
            fieldLabel: 'When'
        }]
    };

    if (config.calendarStore) {
        this.calendarStore = config.calendarStore;
        delete config.calendarStore;

        formPanelCfg.items.push({
            xtype: 'calendarpicker',
            id: 'calendar',
            name: 'calendar',
            anchor: '100%',
            store: this.calendarStore
        });
    }

    Ext.calendar.EventEditWindow.superclass.constructor.call(this, Ext.apply({
        titleTextAdd: 'Add Event',
        titleTextEdit: 'Edit Event',
        width: 600,
        autocreate: true,
        border: true,
        closeAction: 'hide',
        modal: false,
        resizable: false,
        buttonAlign: 'left',
        savingMessage: 'Saving changes...',
        deletingMessage: 'Deleting event...',

        fbar: [{
            xtype: 'tbtext',
            text: '<a href="#" id="tblink">Edit Details...</a>'
        },
        '->', {
            text: 'Save',
            disabled: false,
            handler: this.onSave,
            scope: this
        },
        {
            id: 'delete-btn',
            text: 'Delete',
            disabled: false,
            handler: this.onDelete,
            scope: this,
            hideMode: 'offsets'
        },
        {
            text: 'Cancel',
            disabled: false,
            handler: this.onCancel,
            scope: this
        }],
        items: formPanelCfg
    },
    config));
};

Ext.extend(Ext.calendar.EventEditWindow, Ext.Window, {
    // private
    newId: 10000,

    // private
    initComponent: function () {
        Ext.calendar.EventEditWindow.superclass.initComponent.call(this);

        this.formPanel = this.items.items[0];

        this.addEvents({
            /**
             * @event eventadd
             * Fires after a new event is added
             * @param {Ext.calendar.EventEditWindow} this
             * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was added
             */
            eventadd: true,
            /**
             * @event eventupdate
             * Fires after an existing event is updated
             * @param {Ext.calendar.EventEditWindow} this
             * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was updated
             */
            eventupdate: true,
            /**
             * @event eventdelete
             * Fires after an event is deleted
             * @param {Ext.calendar.EventEditWindow} this
             * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was deleted
             */
            eventdelete: true,
            /**
             * @event eventcancel
             * Fires after an event add/edit operation is canceled by the user and no store update took place
             * @param {Ext.calendar.EventEditWindow} this
             * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was canceled
             */
            eventcancel: true,
            /**
             * @event editdetails
             * Fires when the user selects the option in this window to continue editing in the detailed edit form
             * (by default, an instance of {@link Ext.calendar.EventEditForm}. Handling code should hide this window
             * and transfer the current event record to the appropriate instance of the detailed form by showing it
             * and calling {@link Ext.calendar.EventEditForm#loadRecord loadRecord}.
             * @param {Ext.calendar.EventEditWindow} this
             * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} that is currently being edited
             */
            editdetails: true
        });
    },

    // private
    afterRender: function () {
        Ext.calendar.EventEditWindow.superclass.afterRender.call(this);

        this.el.addClass('ext-cal-event-win');

        Ext.get('tblink').on('click',
        function (e) {
            e.stopEvent();
            this.updateRecord();
            this.fireEvent('editdetails', this, this.activeRecord);
        },
        this);
    },

    /**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
	 * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
	 * for an existing event in edit mode, or a plain object containing a StartDate property (and 
	 * optionally an EndDate property) for showing the form in add mode. 
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function (o, animateTarget) {
        // Work around the CSS day cell height hack needed for initial render in IE8/strict:
        var anim = (Ext.isIE8 && Ext.isStrict) ? null : animateTarget;

        Ext.calendar.EventEditWindow.superclass.show.call(this, anim,
        function () {
            Ext.getCmp('title').focus(false, 100);
        });
        Ext.getCmp('delete-btn')[o.data && o.data.EventId ? 'show' : 'hide']();

        var rec,
        f = this.formPanel.form;

        if (o.data) {
            rec = o;
            this.isAdd = !!rec.data.IsNew;
            if (this.isAdd) {
                // Enable adding the default record that was passed in
                // if it's new even if the user makes no changes
                rec.markDirty();
                this.setTitle(this.titleTextAdd);
            }
            else {
                this.setTitle(this.titleTextEdit);
            }
            //rec.data.StartDate = new Date(rec.data.StartDate);
            //rec.data.EndDate = new Date(rec.data.EndDate);
            f.loadRecord(rec);
        }
        else {
            this.isAdd = true;
            this.setTitle(this.titleTextAdd);

            //eventId = M.EventId.name,
            var start = o.StartDate,
              end = o.EndDate || start.add('h', 1);

            rec = new Ext.calendar.EventRecord();
            rec.data.EventId = this.newId++;
            rec.data.StartDate = start;
            rec.data.EndDate = end;
            //rec.data.IsAllDay = !!o[M.IsAllDay.name] || start.getDate() != end.clone().add(Date.MILLI, 1).getDate();
            rec.data.IsNew = true;

            f.reset();
            f.loadRecord(rec);
        }

        if (this.calendarStore) {
            Ext.getCmp('calendar').setValue(rec.data.CalendarId);
        }
        Ext.getCmp('date-range').setValue(rec.data);
        this.activeRecord = rec;

        return this;
    },

    // private
    roundTime: function (dt, incr) {
        incr = incr || 15;
        var m = parseInt(dt.getMinutes(), 10);
        return dt.add('mi', incr - (m % incr));
    },

    // private
    onCancel: function () {
        this.cleanup(true);
        this.fireEvent('eventcancel', this);
    },

    // private
    cleanup: function (hide) {
        if (this.activeRecord && this.activeRecord.dirty) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;

        if (hide === true) {
            // Work around the CSS day cell height hack needed for initial render in IE8/strict:
            //var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },

    // private
    updateRecord: function () {
        var f = this.formPanel.form;
        dates = Ext.getCmp('date-range').getValue();

        M = Ext.calendar.EventMappings;
        f.updateRecord(this.activeRecord);
        this.activeRecord.set(M.StartDate.name, dates[0]);
        //this.activeRecord.set(M.StartTime.name, dates[0].toTimeString());
        this.activeRecord.set(M.EndDate.name, dates[1]);
        //this.activeRecord.set(M.EndTime.name, dates[1].toTimeString());
        this.activeRecord.set(M.IsAllDay.name, dates[2]);
       
        //f.submit({
        //    waitMsg: 'Please wait...',
        //    success: function (form, action) {

        //    },
        //    failure: function (form, action) {
        //        Ext.MessageBox.show({
        //            title: 'Error',
        //            msg: action.result.data,
        //            buttons: Ext.Msg.OK,
        //            icon: Ext.MessageBox.ERROR,
        //            scope: this
        //        });
        //    }
        //});

        this.activeRecord.set(M.CalendarId.name, this.formPanel.form.findField('calendar').getValue());
    },

    // private
    onSave: function () {
        if (!this.formPanel.form.isValid()) {
            return;
        }
        this.updateRecord();
        Schedule.Save(this.activeRecord.data, function (res) {
            waitMsg: 'Please wait...';
            if (!res.success) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: res.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
        if (!this.activeRecord.dirty) {
            this.onCancel();
            return;
        }

        this.fireEvent(this.isAdd ? 'eventadd' : 'eventupdate', this, this.activeRecord);
    },

    // private
    onDelete: function () {
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});