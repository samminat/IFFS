Ext.ns('Ext.erp.iffs.ux.PackingMaterial');

/**
* @desc      PackingMaterialTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterial
* @class     Ext.erp.iffs.ux.PackingMaterial.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.PackingMaterial.Form = function (config) {
    Ext.erp.iffs.ux.PackingMaterial.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.PackingMaterial.Get,
            submit: window.PackingMaterial.Save
        },
        paramOrder: ['id'],
        defaults: {
            //  anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'PackingMaterial-form',
        padding: 5,
        labelWidth: 90,
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
                    name: 'PreparedById',
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
                        api: { read: PackingMaterial.GetOperations }
                    }),
                    valueField: 'Id',
                    displayField: 'Number'
                }, {
                    name: 'Number',
                    xtype: 'textfield',
                    fieldLabel: 'Store Req. No.',
                    width: 100,
                    allowBlank: false,
                    readOnly: true
                }, {
                    name: 'RequestedDate',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }]
            }, {
                defaults: {
                    anchor: '98%'
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
                    name: 'RequestedDept',
                    xtype: 'textfield',
                    fieldLabel: 'Requested Dept',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'ToDept',
                    xtype: 'textfield',
                    fieldLabel: 'To.',
                    width: 100,
                    allowBlank: false
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingMaterial.Form, Ext.form.FormPanel);
Ext.reg('PackingMaterial-form', Ext.erp.iffs.ux.PackingMaterial.Form);

/**
* @desc      Packing Material grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterial
* @class     Ext.erp.iffs.ux.PackingMaterial.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingMaterial.Grid = function (config) {
    Ext.erp.iffs.ux.PackingMaterial.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingMaterial.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'Number', 'RequestedDept', 'ToDept', 'RequestedDate', 'PreparedBy', 'PreparedDate', 'CheckedBy', 'CheckedDate', 'ApprovedBy', 'ApprovalDate'],
            remoteSort: true
        }),
        // id: 'PackingMaterial-grid',
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
            dataIndex: 'Number',
            header: 'Stock Req. No.',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'RequestedDept',
            header: 'Requested',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'RequestedDate',
            header: 'Requested Date',
            sortable: true,
            width: 120,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'ToDept',
            header: 'To.',
            sortable: true,
            width: 120,
            menuDisabled: true
        //}, {
        //    dataIndex: 'PreparedBy',
        //    header: 'Prepared By',
        //    sortable: true,
        //    width: 100,
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'PreparedDate',
        //    header: 'Prepared Date',
        //    sortable: true,
        //    width: 100,
        //    xtype: 'datecolumn',
        //    format: 'M d, Y',
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'CheckedBy',
        //    header: 'Checked By',
        //    sortable: true,
        //    width: 100,
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'CheckedDate',
        //    header: 'Checked Date',
        //    sortable: true,
        //    width: 100,
        //    xtype: 'datecolumn',
        //    format: 'M d, Y',
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'ApprovedBy',
        //    header: 'Approved By',
        //    sortable: true,
        //    width: 100,
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'ApprovedDate',
        //    header: 'Approved Date',
        //    sortable: true,
        //    width: 100,
        //    xtype: 'datecolumn',
        //    format: 'M d, Y',
        //    menuDisabled: true
        }, {
            dataIndex: 'IsApproved',
            header: 'Approved?',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterial.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            //id: 'PackingMaterial-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingMaterial.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        if (this.Caller == 'Consumption') {

            var columnModel = this.getColumnModel();
            var count = columnModel.getColumnCount(false);
            for (var i = 8; i < count; i++) {
                columnModel.setHidden(i, true);
            }
        }
        this.loadGrid();
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        Ext.erp.iffs.ux.PackingMaterial.Grid.superclass.afterRender.apply(this, arguments);
    },
    initEvents: function () {
        Ext.erp.iffs.ux.PackingMaterial.Grid.superclass.initEvents.call(this);

        // var surveyGridSm = Ext.getCmp('PackingMaterial-grid').getSelectionModel();
        this.getSelectionModel().on('rowselect', this.onRowSelect, this);
    },
    onRowSelect: function (sm, rowIdx, r) {
        if (this.Caller == 'Consumption') {
            Ext.getCmp('PackingMaterialConsumptionDetail-grid').loadDetail(r.id);
            return;
        }
        var form = Ext.getCmp('PackingMaterial-form');
        form.load({
            params: { id: r.id }
        });
        Ext.getCmp('PackingMaterialDetail-grid').loadDetail(r.id);

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
Ext.reg('PackingMaterial-grid', Ext.erp.iffs.ux.PackingMaterial.Grid);

/**
* @desc      Packing Material Detail grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterial
* @class     Ext.erp.iffs.ux.PackingMaterial.DetailGrid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingMaterial.DetailGrid = function (config) {
    Ext.erp.iffs.ux.PackingMaterial.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingMaterial.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'HeaderId', 'Description', 'GRNNumber', 'Qty', 'MeasurmentUnit', 'Remark'],
            remoteSort: true
        }),
        id: 'PackingMaterialDetail-grid',
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
            dataIndex: 'Description',
            header: 'Description',
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

        }, {
            dataIndex: 'GRNNumber',
            header: 'GRN No.',
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
            dataIndex: 'MeasurmentUnit',
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
Ext.extend(Ext.erp.iffs.ux.PackingMaterial.DetailGrid, Ext.grid.EditorGridPanel, {
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
            id: 'PackingMaterialDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingMaterial.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        this.addRow();
        Ext.erp.iffs.ux.PackingMaterial.DetailGrid.superclass.afterRender.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingMaterialDetail-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            HeaderId: 0,
            MeasurmentUnit: '',
            Description: '',
            GRNNumber: '',
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

        var grid = Ext.getCmp('PackingMaterialDetail-grid');
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
                            PackingMaterial.DeleteDetial(id, function (result, response) {
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
        var grid = Ext.getCmp('PackingMaterialDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var SurveyDetail = [];

        gridDatastore.each(function (item) {
            if (item.data['Qty'] == null || item.data['Qty'] == "" ||
                item.data['GRNNumber'] == null || item.data['GRNNumber'] == "" ||
                item.data['Description'] == null || item.data['Description'] == "") {
                QuantityError = 'Description,GRN No., Operation No. or Qty is zero';
            }
            SurveyDetail.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing Material RequestDetails ',
                msg: extMessage + ", But Packing Material RequestDetail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing Material Request ',
                msg: extMessage + ', Since ' + QuantityError + ', So the Packing Material Requestdetail has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingMaterial.SaveDetail(headerId, SurveyDetail, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Packing Survey',
                    msg: extMessage + ' and also ' + rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingMaterial-grid').getStore().reload();
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
Ext.reg('PackingMaterialDetail-grid', Ext.erp.iffs.ux.PackingMaterial.DetailGrid);

/**
* @desc      PackingMaterialTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterial
* @class     Ext.erp.iffs.ux.PackingMaterial.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingMaterial.Panel = function (config) {
    Ext.erp.iffs.ux.PackingMaterial.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                text: 'Save',
                iconCls: 'icon-save',
                handler: this.onSave,
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanAdd'),
                scope: this
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePackingMaterial',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Request', 'CanApprove'),
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewPackingMaterial',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'PackingMaterial.searchText',
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
                            var grid = Ext.getCmp('PackingMaterial-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingMaterial-grid');
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
                    var searchText = Ext.getCmp('PackingMaterial.searchText').getValue();
                    window.open('PackingMaterial/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterial.Panel, Ext.Panel, {
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
                minSize: 400,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                title: 'Packing Material',
                items: [{
                    xtype: 'PackingMaterial-grid',
                    id: 'PackingMaterial-grid'
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
                        xtype: 'PackingMaterial-form',
                        id: 'PackingMaterial-form',
                        flex: 1
                    }, {
                        xtype: 'PackingMaterialDetail-grid',
                        id: 'PackingMaterialDetail-grid',
                        flex: 2
                    }]

                }]
            }]

        }];
        Ext.erp.iffs.ux.PackingMaterial.Panel.superclass.initComponent.apply(this, arguments);
    },
    onSave: function () {
        var form = Ext.getCmp('PackingMaterial-form');
        if (!form.getForm().isValid()) return;
        form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                extMessage = action.result.data;
                Ext.getCmp('PackingMaterialDetail-grid').SaveDetail(action.result.HeaderId);
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

        Ext.erp.iffs.ux.PackingMaterial.Panel.superclass.afterRender.apply(this, arguments);
    },
    onPreview: function () {
        var grid = Ext.getCmp('PackingMaterial-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingMaterial-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingMaterial',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingMaterial.Delete(id, function (result, response) {
                        // Ext.getCmp('PackingMaterial-paging').doRefresh();
                        Ext.getCmp('PackingMaterial-grid').getStore().reload();
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
        var grid = Ext.getCmp('PackingMaterial-grid');
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
                        // cmpPaging: Ext.getCmp('PackingMaterial-paging'),
                        api: {
                            submit: PackingMaterial.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('PackingMaterial-grid');
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
                        // cmpPaging: Ext.getCmp('PackingMaterial-paging'),
                        api: {
                            submit: PackingMaterial.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('PackingMaterial-panel', Ext.erp.iffs.ux.PackingMaterial.Panel);



