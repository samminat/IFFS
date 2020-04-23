Ext.ns('Ext.erp.iffs.ux.PackingAbsentDays');

/**
* @desc      PackingAbsentDaysTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.PackingAbsentDays
* @class     Ext.erp.iffsux.PackingAbsentDays.Window
* @extends   Ext.Window
*/

Ext.erp.iffs.ux.PackingAbsentDays.Window = function (config) {
    Ext.erp.iffs.ux.PackingAbsentDays.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'PackingAbsentDays-window',
        width: 550,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.grid.loadDetail(this.HeaderId);
                this.grid.StartDate = this.StartDate;
                this.grid.EndDate = this.EndDate;
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingAbsentDays.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.PackingAbsentDays.Grid();

        this.items = [this.grid];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.PackingAbsentDays.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        Ext.getCmp('PackingAbsentDays-grid').SaveDetail(this.HeaderId);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('PackingAbsentDays-window', Ext.erp.iffs.ux.PackingAbsentDays.Window);

/**
* @desc      PackingAbsentDaysTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingAbsentDays
* @class     Ext.erp.iffs.ux.PackingAbsentDays.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingAbsentDays.Grid = function (config) {
    Ext.erp.iffs.ux.PackingAbsentDays.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Packing.GetAllAbsentDays,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Date',
                direction: 'ASC'
            },
            fields: ['Id', 'StaffId', 'Date'],
            remoteSort: true
        }),
        id: 'PackingAbsentDays-grid',
        StartDate: '',
        EndDate: '',
        pageSize: 10,
        height: 250,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            afteredit: function (e) {
                var record = e.record;
                var store = this.getStore();
                var modified = store.getModifiedRecords();
                count = 0;
                store.each(function (item) {
                    // var d = item.data.Date.toString().substring(0, 10);
                    var d = e.record.data.Date;
                    var r = e.value;
                    if (typeof item.id === 'number' && d == r) {
                        count++;
                    }
                });
                store.filter('Date', record.data.Date);
                var storeCount = store.getCount();
                if (storeCount >= 2 || count > 0) {
                    Ext.MessageBox.alert('The Date has already been selected, Please select an other date!');
                    store.remove(record);
                }
                store.clearFilter();
            },
            scope: this
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'StaffId',
            header: 'StaffId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            format: 'm/d/Y',
            xtype: 'datecolumn',
            editor: new Ext.form.DateField({
                allowBlank: false,
                altFormats: 'c',
                editable: true,
                listeners: {
                    focus: function (field) {
                        var grid = Ext.getCmp('PackingAbsentDays-grid');
                        field.setMaxValue(grid.EndDate);
                        field.setMinValue(grid.StartDate);
                    }
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingAbsentDays.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingAbsentDays-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingAbsentDays.Grid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingAbsentDays-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            StaffId: 0,
            Date: ''
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingAbsentDays-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelections();
        for (var i = 0; i < record.length; i++) {
            grid.store.remove(record);
            if (typeof record[i].id === 'number') {
                var id = record[i].id;
                Packing.DeleteAbsentDays(id, function (result, response) {
                    Ext.MessageBox.show({
                        title: result.success ? 'Success' : 'Error',
                        msg: result.data,
                        buttons: Ext.Msg.OK,
                        icon: result.success ? Ext.MessageBox.INFO : Ext.MessageBox.ERROR,
                        scope: this
                    });
                }, this);
            }
        }
    },
    SaveDetail: function (headerId) {
        var gridDatastore = this.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var Detail = [];

        gridDatastore.each(function (item) {
            if (item.data.Date == null || item.data.Date == "") {
                QuantityError = 'Date is empty!';
            }
            Detail.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: ' Staff Absent Dates ',
                msg: "  Staff Absent Dates  is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: ' Staff Absent Dates ',
                msg: ', Since ' + QuantityError + ', So the  Staff Absent Dates has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        Packing.SaveAbsentDays(headerId, Detail, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: ' Staff Absent Dates',
                    msg: rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                gridDatastore.reload();
                Ext.getCmp('PackingAbsentDays-window').close();
            }
        });
    },
    loadDetail: function (HeaderId) {


        var DetailStore = this.getStore();

        DetailStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        DetailStore.load({
            params: { start: 0, limit: this.pageSize }
        });
    }
});
Ext.reg('PackingAbsentDays-grid', Ext.erp.iffs.ux.PackingAbsentDays.Grid);
