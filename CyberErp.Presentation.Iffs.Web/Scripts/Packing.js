Ext.ns('Ext.erp.iffs.ux.Packing');

/**
* @desc      Employee Store
* @author    Samson Solomon
* @copyright (c) 2019, Cybersoft
* @date      July 23, 2019
* @namespace Ext.erp.iffs.ux.Packing
* @class     Ext.erp.iffs.ux.Packing.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.Packing.Store = function (config) {
    Ext.erp.iffs.ux.Packing.Store.superclass.constructor.call(this, Ext.apply({
        reader: new Ext.data.JsonReader({
            successProperty: 'success',
            idProperty: 'Id',
            root: 'data',
            fields: ['Id', 'FullName']
        }),
        autoLoad: true,
        api: { read: Iffs.GetEmployees }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.Packing.Store, Ext.data.DirectStore);
Ext.reg('employee-store', Ext.erp.iffs.ux.Packing.Store);

/**
* @desc      PackingTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.Packing
* @class     Ext.erp.iffs.ux.Packing.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.Packing.Form = function (config) {
    Ext.erp.iffs.ux.Packing.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.Packing.Get,
            submit: window.Packing.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            layout: 'form'
        },
        id: 'Packing-form',
        padding: 5,
        labelWidth: 100,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
            bodyStyle: 'background-color:transparent;',
            defaults: {
                columnWidth: .5,
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedBy',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedDate',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'OperationId',
                    xtype: 'combo',
                    fieldLabel: 'Operation No.',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    typeAhead: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Number']
                        }),
                        autoLoad: true,
                        api: { read: Packing.GetOperations }
                    }),
                    valueField: 'Id',
                    displayField: 'Number'
                }, {
                    hiddenName: 'SurveyId',
                    xtype: 'combo',
                    fieldLabel: 'Survey No.',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    typeAhead: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Number']
                        }),
                        autoLoad: true,
                        api: { read: SurveyRequest.GetSurveyRequests }
                    }),
                    valueField: 'Id',
                    displayField: 'Number'
                }, {
                    name: 'ActivityType',
                    xtype: 'textfield',
                    fieldLabel: 'Activity Type',
                    width: 100,
                    allowBlank: false

                }, {
                    name: 'SupervisorId',
                    xtype: 'hidden',
                }, {
                    hiddenName: 'Supervisor',
                    fieldLabel: 'Supervisor',
                    xtype: 'combo',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {FullName}" class="x-combo-list-item">' +
                        '<h3><span>{FullName}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'FullName']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetEmployees }
                    }),
                    //  valueField: 'FullName',
                    displayField: 'FullName',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('Packing-form').getForm();
                            form.findField('SupervisorId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'StartDate',
                    xtype: 'datefield',
                    fieldLabel: 'Start Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'EndDate',
                    xtype: 'datefield',
                    fieldLabel: 'End Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                    value: (new Date()).format('m/d/Y')
                }]
            }, {
                defaults: {
                    anchor: '98%'
                },
                items: [{

                    name: 'NumberofStaff',
                    xtype: 'numberfield',
                    fieldLabel: 'No. of Staff',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'ActualVolume',
                    xtype: 'numberfield',
                    fieldLabel: 'Actual Volume',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'EstimatedVolume',
                    xtype: 'numberfield',
                    fieldLabel: 'Estimated Volume',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'ActualWeight',
                    xtype: 'numberfield',
                    fieldLabel: 'Actual Weight',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'LunchProvided',
                    xtype: 'numberfield',
                    fieldLabel: 'No. Of Lunch Provided',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'OtherRelatedCost',
                    xtype: 'textfield',
                    fieldLabel: 'Other Related Cost',
                    width: 100,
                    allowBlank: false

                }]

            }]
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'General Remark',
            width: 100,
            allowBlank: false
        }]

    }, config));
};
Ext.extend(Ext.erp.iffs.ux.Packing.Form, Ext.form.FormPanel);
Ext.reg('Packing-form', Ext.erp.iffs.ux.Packing.Form);

/**
* @desc      PackingTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.Packing
* @class     Ext.erp.iffsux.Packing.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.Packing.Window = function (config) {
    Ext.erp.iffs.ux.Packing.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        id: 'Packing-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('Packing-form');

                if (this.Id > 0) {
                    Ext.getCmp('Packing-window').actionType = "Edit";

                    form.load({
                        params: { id: this.Id },
                        success: function (act, res) {
                            Ext.getCmp('PackingDetail-grid').loadDetail(res.result.data.Id);
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.Packing.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.Packing.Form();
        this.grid = new Ext.erp.iffs.ux.Packing.DetailGrid();
        this.items = [this.form, this.grid];

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
        Ext.erp.iffs.ux.Packing.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        //var gridDetail = Ext.getCmp('Packing-grid');
        //var rec = '';
        //var store = gridDetail.getStore();
        //var action = Ext.getCmp('Packing-window').actionType;
        //store.each(function (item) {
        //    if (item.data['Value'] != '') {
        //        rec = rec + item.data['FieldCategory'] + ':' +
        //            item.data['Field'] + ':' +
        //            item.data['Value'] + ';';
        //    }
        //});

        //if (rec.length == 0) {
        //    Ext.MessageBox.show({
        //        title: 'Incomplete',
        //        msg: 'Value cannot be empty!',
        //        buttons: Ext.Msg.OK,
        //        scope: this
        //    });
        //    return;
        //}


        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            //  params: { record: Ext.encode({ templateDetails: rec, action: action }) },
            success: function (form, action) {
                extMessage = action.result.data;
                Ext.getCmp('PackingDetail-grid').SaveDetail(action.result.HeaderId);
                //Ext.MessageBox.show({
                //    title: 'Success',
                //    msg: action.result.data,
                //    buttons: Ext.Msg.OK,
                //    icon: Ext.MessageBox.INFO,
                //    scope: this
                //});
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    },
    onClose: function () {

        if (typeof this.NotificationId != 'undefined') {
            window.Packing.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('Packing-paging').doRefresh();
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
    },
    onAddRow: function () {
        Ext.getCmp('Packing-window').addRow();
    },
    addRow: function () {
        var grid = Ext.getCmp('Packing-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({
            FieldCategory: '',
            Field: '',
            Value: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }

    }
});
Ext.reg('Packing-window', Ext.erp.iffs.ux.Packing.Window);

/**
* @desc      PackingTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.Packing
* @class     Ext.erp.iffs.ux.Packing.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.Packing.Grid = function (config) {
    Ext.erp.iffs.ux.Packing.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Packing.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'OperationNo', 'SurveyNumber', 'ActivityType', 'PreparedBy', 'PreparedDate', 'StartDate', 'EndDate'],
            remoteSort: true
        }),
        //id: 'Packing-grid',
        pageSize: 30,
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
            dataIndex: 'OperationId',
            header: 'OperationId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OperationNo',
            header: 'Operation No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SurveyNumber',
            header: 'Survey No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ActivityType',
            header: 'Activity Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
        }, {
            dataIndex: 'StartDate',
            header: 'Start Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'EndDate',
            header: 'End Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        //}, {
        //    dataIndex: 'PreparedDate',
        //    header: 'Prepared Date',
        //    sortable: true,
        //    width: 100,
        //    xtype: 'datecolumn',
        //    format: 'M d, Y',
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'PreparedBy',
        //    header: 'Prepared By',
        //    sortable: true,
        //    width: 100,
        //    menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.Packing.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            //id: 'Packing-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.Packing.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        if (this.Caller == 'Consumption') {

            var columnModel = this.getColumnModel();
            var count = columnModel.getColumnCount(false);
            for (var i = 5; i < count; i++) {
                if (i == 6 || i == 7)
                    continue;
                columnModel.setHidden(i, true);
            }
        }
        this.LoadGrid();

        Ext.erp.iffs.ux.Packing.Grid.superclass.afterRender.apply(this, arguments);
    },
    initEvents: function () {
        Ext.erp.iffs.ux.Packing.Grid.superclass.initEvents.call(this);
        this.getSelectionModel().on('rowselect', this.onRowSelect, this);
    },
    onRowSelect: function (sm, rowIdx, r) {
        if (this.Caller == 'Consumption') {
            Ext.getCmp('MaterialConsumption-grid').loadGrid(r.data.OperationId);
            Ext.getCmp('CrateAndBoxRequestConsumption-grid').loadGrid(r.data.OperationId);
        } else
            Ext.getCmp('PackingList-grid').loadDetail(r.id);
    },
    LoadGrid: function (OperationId) {
        if (OperationId == null)
            OperationId = '';
        this.getStore().baseParams = { record: Ext.encode({ searchText: '', OperationId: OperationId }) };
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
    }
});
Ext.reg('Packing-grid', Ext.erp.iffs.ux.Packing.Grid);

/**
* @desc      PackingTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.Packing
* @class     Ext.erp.iffs.ux.Packing.DetailGrid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.Packing.DetailGrid = function (config) {
    Ext.erp.iffs.ux.Packing.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Packing.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'HeaderId', 'PackersId', 'Packers', 'StartDate', 'EndDate'],
            remoteSort: true
        }),
        id: 'PackingDetail-grid',
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
        }, {
            dataIndex: 'PackersId',
            header: 'PackersId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'StartDate',
            header: 'StartDate',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'EndDate',
            header: 'EndDate',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Packers',
            header: 'Packers',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                hideTrigger: true,
                minChars: 2,
                listWidth: 280,
                emptyText: '---Type to Search---',
                mode: 'remote',
                allowBlank: false,
                tpl: '<tpl for="."><div ext:qtip="{Id}. {FullName}" class="x-combo-list-item">' +
                    '<h3><span>{FullName}</span></h3> </div></tpl>',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'FullName']
                    }),
                    autoLoad: true,
                    api: { read: Iffs.GetEmployees }
                }),
                //valueField: 'Id',
                displayField: 'FullName', pageSize: 10,
                listeners: {
                    select: function (cmb, rec, idx) {
                        var grid = Ext.getCmp('PackingDetail-grid');
                        var selectedRecord = grid.getSelectionModel().getSelected();
                        var row = grid.store.indexOf(selectedRecord);
                        var record = grid.store.getAt(row);
                        record.set('PackersId', rec.id);
                    }
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.Packing.DetailGrid, Ext.grid.EditorGridPanel, {
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
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'button',
            text: 'Absent Days',
            iconCls: 'icon-add',
            handler: this.AbsentDays
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.Packing.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        this.addRow();
        Ext.erp.iffs.ux.Packing.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingDetail-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            HeaderId: 0,
            PackersId: '',
            Packers: '',
            StartDate: '',
            EndDate: ''
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingDetail-grid');
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
                            Packing.DeleteDetail(id, function (result, response) {
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
        var grid = Ext.getCmp('PackingDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var SurveyDetail = [];

        gridDatastore.each(function (item) {
            if (item.data['PackersId'] == null || item.data['PackersId'] == "") {
                QuantityError = 'Packers list is empty!';
            }
            SurveyDetail.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'PackingDetails ',
                msg: extMessage + ", But Packing Detail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing ',
                msg: extMessage + ', Since ' + QuantityError + ', So the Packing detail has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        Packing.SaveDetail(headerId, SurveyDetail, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing Survey',
                    msg: extMessage + ' and also ' + rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('Packing-grid').getStore().reload();
                Ext.getCmp('Packing-window').close();
            }
        });
    },
    loadDetail: function (HeaderId) {

        var DetailStore = this.getStore();

        DetailStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        DetailStore.load({
            params: { start: 0, limit: this.pageSize }
        });
    },
    AbsentDays: function () {
        var DetailGrid = Ext.getCmp('PackingDetail-grid');
        if (!DetailGrid.getSelectionModel().hasSelection()) return;
        var staffId = DetailGrid.getSelectionModel().getSelected().get('Id');
        var startDate = DetailGrid.getSelectionModel().getSelected().get('StartDate');
        var endDate = DetailGrid.getSelectionModel().getSelected().get('EndDate');


        new Ext.erp.iffs.ux.PackingAbsentDays.Window({
            title: 'Insert Staff Absent Dates ',
            HeaderId: staffId,
            StartDate: startDate,
            EndDate: endDate
        }).show();
    }
});
Ext.reg('PackingDetail-grid', Ext.erp.iffs.ux.Packing.DetailGrid);

/**
* @desc      PackingTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.Packing
* @class     Ext.erp.iffs.ux.Packing.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.Packing.Panel = function (config) {
    Ext.erp.iffs.ux.Packing.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addPacking',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editPacking',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePacking',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewPacking',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'Packing.searchText',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('Packing-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('Packing-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: '',
                iconCls: 'icon-excel',
                handler: function () {
                    var searchText = Ext.getCmp('Packing.searchText').getValue();
                    window.open('Packing/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.Packing.Panel, Ext.Panel, {
    initComponent: function () {

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 500,
                minSize: 500,
                layout: 'fit',
                margins: '0 3 0 0',
                title: 'Packing',
                items: [{
                    xtype: 'Packing-grid',
                    id: 'Packing-grid',
                }]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                title: 'Packing List',
                items: [{
                    xtype: 'PackingList-grid',
                    id: 'PackingList-grid'
                }]
            }]
        }];
        Ext.erp.iffs.ux.Packing.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.Packing.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.Packing.Window({
            operationTypeId: 0,
            isRevised: false,
            title: 'Add Packing'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('Packing-grid');
        var selectedRecord = grid.getSelectionModel().getSelected();
        //if (selectedRecord.get('IsApproved') == true) {
        //    Ext.MessageBox.show({
        //        title: 'Select',
        //        msg: 'The record is already approved. You cannot make changes.',
        //        buttons: Ext.Msg.OK,
        //        icon: Ext.MessageBox.INFO,
        //        scope: this
        //    });
        //    return;
        //}
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.Packing.Window({
            Id: id,
            isRevised: false,
            title: 'Edit Packing'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('Packing-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('Packing-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected Packing',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Packing.Delete(id, function (result, response) {
                        Ext.getCmp('Packing-grid').getStore().reload();
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
    },
    onCheck: function () {
        var grid = Ext.getCmp('Packing-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var selectedRecord = grid.getSelectionModel().getSelected();
        if (selectedRecord.get('IsChecked') == true) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'The record is already checked.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = selectedRecord.get('Id');

        Ext.MessageBox.show({
            title: 'Checking',
            msg: 'Are you sure you want to check the selected record?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {

                    new Ext.erp.iffs.ux.documentConfirmation.Window({
                        id: id,
                        // cmpPaging: Ext.getCmp('Packing-paging'),
                        api: {
                            submit: Packing.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('Packing-panel', Ext.erp.iffs.ux.Packing.Panel);



