﻿Ext.ns('Ext.erp.iffs.ux.PackingCrateAndBoxRequest');

/**
* @desc      PackingCrateAndBoxRequestTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingCrateAndBoxRequest
* @class     Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Form = function (config) {
    Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.PackingCrateAndBoxRequest.Get,
            submit: window.PackingCrateAndBoxRequest.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'PackingCrateAndBoxRequest-form',
        padding: 5,
        labelWidth: 130,
        // width: 700,
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
                    name: 'ApprovedBy',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedBy',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedDate',
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
                        api: { read: PackingCrateAndBoxRequest.GetOperations }
                    }),
                    valueField: 'Id',
                    displayField: 'Number'
                }, {
                    name: 'HasPrevOrderNumber',
                    xtype: 'checkbox',
                    checked: false,
                    fieldLabel: 'Has Prev Order No.?',
                    listeners: {
                        scope: this,
                        check: function (field, checked) {
                            var form = Ext.getCmp('PackingCrateAndBoxRequest-form').getForm();
                            if (checked) {
                                form.findField('PrevOrderNumber').show();
                            }
                            else {
                                form.findField('PrevOrderNumber').hide();
                            }
                        }
                    }
                }, {
                    name: 'PrevOrderNumber',
                    xtype: 'textfield',
                    hidden: true,
                    fieldLabel: 'Prev Order No.',
                    width: 100,
                    allowBlank: true,
                }, {
                    name: 'OrderNumber',
                    xtype: 'textfield',
                    fieldLabel: 'Order No.',
                    readOnly: true,
                    allowBlank: false,
                    value: 'AutoGenerated',
                    style: 'font-weight: italics; color: grey;'
                }]
            }, {
                defaults: {
                    anchor: '100%'
                },
                items: [{
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
                    name: 'RequestedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Requested Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'ExpectedDelivery',
                    xtype: 'datefield',
                    fieldLabel: 'Expected Delivery Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                }]
            }]
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            allowBlank: true,
            height: 50
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Form, Ext.form.FormPanel);
Ext.reg('PackingCrateAndBoxRequest-form', Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Form);


/**
* @desc      PackingCrateAndBoxRequestTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingCrateAndBoxRequest
* @class     Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid = function (config) {
    Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingCrateAndBoxRequest.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'OrderNumber', 'PrevOrderNumber', 'OperationNo', 'RequestedDate', 'ExpectedDelivery', 'IsIronSheetCover', 'PreparedBy', 'PreparedDate', 'Remark'],
            remoteSort: true
        }),
        // id: 'PackingCrateAndBoxRequest-grid',
        pageSize: 20,
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OrderNumber',
            header: 'Order No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PrevOrderNumber',
            header: 'Prev. Order No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OperationNo',
            header: 'Operation No.',
            sortable: true,
            width: 100,
            menuDisabled: true

            //}, {
            //    dataIndex: 'PreparedBy',
            //    header: 'Prepared By',
            //    sortable: true,
            //    width: 100,
            //    menuDisabled: true
        }, {
            dataIndex: 'RequestedDate',
            header: 'Requested Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'ExpectedDelivery',
            header: 'Expected Delivery Date',
            sortable: true,
            xtype: 'datecolumn',
            format: 'M d, Y',
            width: 100, menuDisabled: true
            //}, {
            //    dataIndex: 'ClientName',
            //    header: 'Client Name',
            //    sortable: true,
            //    width: 100,
            //    menuDisabled: true
            //}, {
            //    dataIndex: 'IsViewed',
            //    header: 'IsViewed',
            //    sortable: true,
            //    width: 100,
            //    hidden: true,
            //    menuDisabled: true

        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            //id: 'PackingCrateAndBoxRequest-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.loadGrid();
        //this.getStore().baseParams = { record: Ext.encode({ PackingId: '' }) };
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid.superclass.afterRender.apply(this, arguments);
    },
    initEvents: function () {
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid.superclass.initEvents.call(this);

        //var surveyGridSm = Ext.getCmp('PackingCrateAndBoxRequest-grid').getSelectionModel();
        this.getSelectionModel().on('rowselect', this.onRowSelect, this);
    },
    onRowSelect: function (sm, rowIdx, r) {
        if (this.Caller == 'Consumption') {
            Ext.getCmp('CrateAndBoxConsumption-grid').loadDetail(r.id);
            return;
        }
        var detailForm = Ext.getCmp('PackingCrateAndBoxRequest-form');
        detailForm.getForm().load({ params: { id: r.id } });
        Ext.getCmp('PackingCrateAndBoxRequestDetail-grid').loadDetail(r.id);
    },
    loadGrid: function (operationId) {
        if (this.Caller == 'Consumption' && operationId == undefined)
            return;
        if (operationId == undefined)
            operationId = '';
        this.getStore().baseParams = { record: Ext.encode({ searchText: '', OperationId: operationId }) };
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
    }
});
Ext.reg('PackingCrateAndBoxRequest', Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid);

/**
* @desc      Packing Material Detail grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingCrateAndBoxRequest
* @class     Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid = function (config) {
    Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingCrateAndBoxRequest.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'BoxType',
                direction: 'ASC'
            },
            fields: ['Id', 'BoxType', 'HeaderId', 'Length', 'Width', 'Height', 'Qty', 'MeasurmentId', 'Remark'],
            remoteSort: true
        }),
        id: 'PackingCrateAndBoxRequestDetail-grid',
        pageSize: 20,
        //height: 500,
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
            dataIndex: 'BoxType',
            header: 'Box Type',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: PackingCrateAndBoxRequest.GetBoxTypes }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'Length',
            header: 'Length',
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
            dataIndex: 'Width',
            header: 'Width',
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
            dataIndex: 'Height',
            header: 'Height',
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
            dataIndex: 'Qty',
            header: 'Qty',
            sortable: true,
            width: 70,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'MeasurmentId',
            header: 'Measurment Unit',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: PackingMaterialConsumption.GetMeasurementUnits }
                }),
                valueField: 'Id',
                displayField: 'Name',
                pageSize: 10
            })
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 200,
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
Ext.extend(Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertRows',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'tbseparator',
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteRows',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingCrateAndBoxRequestDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        this.addRow();
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingCrateAndBoxRequestDetail-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            HeaderId: 0,
            MeasurmentUnit: '',
            Length: '',
            Height: '',
            Width: '',
            Qty: 0,
            Remark: '',
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingCrateAndBoxRequestDetail-grid');
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
                            PackingCrateAndBoxRequest.DeleteDetail(id, function (result, response) {
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
        var grid = Ext.getCmp('PackingCrateAndBoxRequestDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var SurveyDetail = [];

        gridDatastore.each(function (item) {
            if (item.data.Qty == null || item.data.Qty == "" ||
                item.data.Length == null || item.data.Length == "" ||
                item.data.Height == null || item.data.Height == "" ||
                item.data.Width == null || item.data.Width == "") {
                QuantityError = 'Length,Width, Height or Qty is zero';
            }
            SurveyDetail.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing Crate And Box Request Details ',
                msg: extMessage + ", But Packing Crate And Box Request Detail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing Crate And Box Request',
                msg: extMessage + ', Since ' + QuantityError + ', So the Packing Crate And Box Request Detail has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingCrateAndBoxRequest.SaveDetail(headerId, SurveyDetail, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Crate And Box Request Header And detail',
                    msg: extMessage + ' and also ' + rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingCrateAndBoxRequest-grid').getStore().reload();
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
Ext.reg('PackingCrateAndBoxRequestDetail-grid', Ext.erp.iffs.ux.PackingCrateAndBoxRequest.DetailGrid);

/**
* @desc      Approved Job Orders registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.PackingCrateAndBoxRequest
* @class     Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window = function (config) {
    Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 900,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window, Ext.Window, {
    initComponent: function () {
        //this.grid = new Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Grid();
        //this.detail = new Ext.erp.iffs.ux.PackingCrateAndBoxRequest.NotificationDetail();
        this.items = [{

            xtype: 'PackingCrateAndBoxRequest',
        }];

        this.buttons = [{
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        this.close();
    }
});
Ext.reg('PackingCrateAndBoxRequest-window', Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Window);


/**
* @desc      PackingCrateAndBoxRequestTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingCrateAndBoxRequest
* @class     Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel = function (config) {
    Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                text: 'Save',
                iconCls: 'icon-save',
                handler: this.onSave,
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Crate And Box Request', 'CanAdd'),
                scope: this
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePackingCrateAndBoxRequest',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Crate And Box Request', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Crate And Box Request', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Crate And Box Request', 'CanApprove'),
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewPackingCrateAndBoxRequest',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'PackingCrateAndBoxRequest.searchText',
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
                            var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
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
                    var searchText = Ext.getCmp('PackingCrateAndBoxRequest.searchText').getValue();
                    window.open('PackingCrateAndBoxRequest/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel, Ext.Panel, {
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
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                title: 'Packing Crate And Box Request',
                items: [{
                    xtype: 'PackingCrateAndBoxRequest',
                    id: 'PackingCrateAndBoxRequest-grid'
                }]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: { margins: '0 5 5 0' },
                    items: [{
                        xtype: 'PackingCrateAndBoxRequest-form',
                        id: 'PackingCrateAndBoxRequest-form',
                        flex: 1
                    }, {
                        xtype: 'PackingCrateAndBoxRequestDetail-grid',
                        id: 'PackingCrateAndBoxRequestDetail-grid',
                        flex: 2
                    }]

                }]
            }]

        }];
        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('PackingCrateAndBoxRequest-form');
        if (!form.getForm().isValid()) return;
        form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                extMessage = action.result.data;
                Ext.getCmp('PackingCrateAndBoxRequestDetail-grid').SaveDetail(action.result.HeaderId);
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
    afterRender: function () {

        Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel.superclass.afterRender.apply(this, arguments);
    },
    onPreview: function () {
        var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingCrateAndBoxRequest',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingCrateAndBoxRequest.Delete(id, function (result, response) {
                        Ext.getCmp('PackingCrateAndBoxRequest-grid').getStore().reload();
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
        var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
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
                        //cmpPaging: Ext.getCmp('PackingCrateAndBoxRequest-paging'),
                        api: {
                            submit: PackingCrateAndBoxRequest.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('PackingCrateAndBoxRequest-grid');
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
        if (selectedRecord.get('IsApproved') == true) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'The record is already approved.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        if (selectedRecord.get('IsChecked') == false) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'Record should be checked before approval.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = selectedRecord.get('Id');

        Ext.MessageBox.show({
            title: 'Checking',
            msg: 'Are you sure you want to approve the selected record?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    new Ext.erp.iffs.ux.documentConfirmation.Window({
                        id: id,
                        // cmpPaging: Ext.getCmp('PackingCrateAndBoxRequest-paging'),
                        api: {
                            submit: PackingCrateAndBoxRequest.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('PackingCrateAndBoxRequest-panel', Ext.erp.iffs.ux.PackingCrateAndBoxRequest.Panel);




