Ext.ns('Ext.erp.iffs.ux.PackingTruckAndMachine');

/**
* @desc      Employee Store
* @author    Samson Solomon
* @copyright (c) 2019, Cybersoft
* @date      July 23, 2019
* @namespace Ext.erp.iffs.ux.PackingTruckAndMachineTruckAndMachine
* @class     Ext.erp.iffs.ux.PackingTruckAndMachine.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.PackingTruckAndMachine.Store = function (config) {
    Ext.erp.iffs.ux.PackingTruckAndMachine.Store.superclass.constructor.call(this, Ext.apply({
        reader: new Ext.data.JsonReader({
            successProperty: 'success',
            idProperty: 'Id',
            root: 'data',
            fields: ['Id', 'Name']
        }),
        api: { read: PackingTruckAndMachine.GetTruckTypes }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingTruckAndMachine.Store, Ext.data.DirectStore);
Ext.reg('TruckTypes-store', Ext.erp.iffs.ux.PackingTruckAndMachine.Store);

/**
* @desc      PackingTruckAndMachineTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.PackingTruckAndMachine
* @class     Ext.erp.iffsux.PackingTruckAndMachine.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.PackingTruckAndMachine.Window = function (config) {
    Ext.erp.iffs.ux.PackingTruckAndMachine.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {

                this.grid.loadDetail(this.HeaderId);
            }
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingTruckAndMachine.Window, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.PackingTruckAndMachine.Grid();

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
        Ext.erp.iffs.ux.PackingTruckAndMachine.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        Ext.getCmp('PackingTruckAndMachine-grid').SaveDetail(this.HeaderId);
    },
    onClose: function () {

        if (typeof this.NotificationId != 'undefined') {
            window.PackingTruckAndMachine.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('PackingTruckAndMachine-paging').doRefresh();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        this.close();
    }
});
Ext.reg('PackingTruckAndMachine-window', Ext.erp.iffs.ux.PackingTruckAndMachine.Window);


/**
* @desc      PackingTruckAndMachineTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingTruckAndMachine
* @class     Ext.erp.iffs.ux.PackingTruckAndMachine.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingTruckAndMachine.Grid = function (config) {
    Ext.erp.iffs.ux.PackingTruckAndMachine.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingTruckAndMachine.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'TruckTypeName',
                direction: 'ASC'
            },
            fields: ['Id', 'HeaderId', 'TruckType', 'TruckTypeName', 'NumberOfTrip', 'EstimatedKmCovered', 'Remark'],
            remoteSort: true
        }),
        id: 'PackingTruckAndMachine-grid',
        pageSize: 20,
        height: 300,
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
            dataIndex: 'HeaderId',
            header: 'HeaderId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'TruckType',
            header: 'Truck or Machine Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                id:'CmbTruckTypes',
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                allowBlank: false,
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'NumberOfTrip',
            header: 'No. Of Trip',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'EstimatedKmCovered',
            header: 'Estimated KM Covered',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Remark',
            header: 'Remarks',
            sortable: true,
            width: 150,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingTruckAndMachine.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertRows',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteRows',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }];
    

        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingTruckAndMachine.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        var store = new Ext.erp.iffs.ux.PackingTruckAndMachine.Store();
        store.load();
        Ext.getCmp('CmbTruckTypes').store = store;

        this.addRow();
        
        Ext.erp.iffs.ux.PackingTruckAndMachine.Grid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingTruckAndMachine-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            HeaderId: 0,
            TruckType: '',
            TruckTypeName: '',
            NumberOfTrip: 0,
            EstimatedKmCovered: 0,
            Remark: ''
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    deleteRow: function () {
        var grid = Ext.getCmp('PackingTruckAndMachine-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelections();
        for (var i = 0; i < record.length; i++) {
            grid.store.remove(record);
            if (typeof record[i].id === 'number') {
                var id = record[i].id;
                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to delete the selected record',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            PackingTruckAndMachine.Delete(id, function (result, response) {
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
                });
            }
        }
    },
    SaveDetail: function (headerId) {
        var gridDatastore = this.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var Detail = [];

        gridDatastore.each(function (item) {
            if (item.data.TruckType == null || item.data.TruckType == "") {
                QuantityError = 'Truck Or Machin Type is empty!';
            }
            Detail.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing Truck And Machine ',
                msg: " Packing Truck And Machine  is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'PackingTruckAndMachine ',
                msg: ', Since ' + QuantityError + ', So the Packing Truck And Machine has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingTruckAndMachine.Save(headerId, Detail, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing Truck And Machine',
                    msg: rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingTruckAndMachine-grid').getStore().reload();
                Ext.getCmp('PackingTruckAndMachine-window').close();
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
Ext.reg('PackingTruckAndMachine-grid', Ext.erp.iffs.ux.PackingTruckAndMachine.Grid);

