Ext.ns('Ext.erp.iffs.ux.jobOrder');

/**
* @desc      JobOrderTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.jobOrder.Form = function (config) {
    Ext.erp.iffs.ux.jobOrder.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.JobOrder.Get,
            submit: window.JobOrder.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'jobOrder-form',
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
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedDate',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovalDate',
                    xtype: 'hidden'
                }, {
                    name: 'CheckedDate',
                    xtype: 'hidden'
                }, {
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'ParentJobOrderId'
                }, {
                    xtype: 'hidden',
                    name: 'IsRequiredDocumentsSubmited'
                }, {
                    hiddenName: 'OperationTypeId',
                    xtype: 'combo',
                    fieldLabel: 'Operation Type',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetOperationType }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    listeners: {
                        scope: this,
                        select: function (cmb, rec, idx) {
                            var operationid = rec.id;
                            var grid = Ext.getCmp('jobOrder-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ operationTypeId: operationid, source: "New" }) };
                            store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: 'QuotationRecs'
                }, {
                    xtype: 'compositefield',
                    name: 'compositeQuotations',
                    fieldLabel: 'Quotations',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'Quotations',
                        xtype: 'textarea',
                        fieldLabel: 'Quotations',
                        allowBlank: false,
                        readOnly: true
                    }, {
                        xtype: 'button',
                        id: 'findQuotations',
                        iconCls: 'icon-filter',
                        width: 25,
                        handler: function () {
                            var form = Ext.getCmp('jobOrder-form').getForm();
                            new Ext.erp.iffs.ux.jobOrder.QuotationWindow({
                                parentForm: form,
                                controlIdField: 'QuotationRecs',
                                controlNameField: 'Quotations'
                            }).show();
                        }
                    }]
                }, {
                    name: 'JobOrderNo',
                    xtype: 'textfield',
                    fieldLabel: 'Job Order No',
                    width: 100,
                    allowBlank: false,
                    readOnly: false
                }, {
                    name: 'Version',
                    xtype: 'textfield',
                    fieldLabel: 'Version',
                    allowBlank: false,
                    hidden: true,
                    readOnly: true
                }, {
                    name: 'ReceivingClient',
                    xtype: 'textfield',
                    fieldLabel: 'Receiving Client',
                    width: 100,
                    hidden: false,
                    value:' ',
                    allowBlank: false
                }, {
                    name: 'UltimateClient',
                    xtype: 'textfield',
                    fieldLabel: 'Ultimate Client',
                    width: 100,
                    hidden: true,
                    value: ' ',
                    allowBlank: false
                }, {
                    hiddenName: 'Status',
                    xtype: 'combo',
                    fieldLabel: 'Status',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        data: [
                            ['Standing', 'Standing'],
                            ['OneTime', 'One Time']
                        ]
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    name: 'ValidityDate',
                    xtype: 'datefield',
                    fieldLabel: 'Validity Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                   // value: (new Date()).format('m/d/Y')
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'ContactPersonLocal',
                    xtype: 'textarea',
                    fieldLabel: 'Contact Person(Local)',
                    width: 100,
                    hidden: true,
                    value: ' ',
                    allowBlank: true
                }, {
                    name: 'ContactPersonForeign',
                    xtype: 'textarea',
                    fieldLabel: 'Contact Person(Fore.)',
                    width: 100,
                    hidden: true,
                    value: ' ',
                    allowBlank: true
                }, {
                    name: 'IsViewed',
                    xtype: 'checkbox',
                    fieldLabel: 'IsViewed',
                    hidden:true,
                    allowBlank: true},{
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remarks',
                    allowBlank: true
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrder.Form, Ext.form.FormPanel);
Ext.reg('jobOrder-form', Ext.erp.iffs.ux.jobOrder.Form);

/**
* @desc      JobOrderTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.jobOrder
* @class     Ext.erp.iffsux.jobOrder.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.jobOrder.Window = function (config) {
    Ext.erp.iffs.ux.jobOrder.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        id: 'jobOrder-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
             if (this.isCopy == true) {
                 Ext.getCmp('jobOrder-window').actionType = "Add";
                 var form = Ext.getCmp('jobOrder-form');
                form.load({
                    params: { id: this.parentJobOrderId },
                    success: function () {
                           
                        Ext.getCmp('jobOrder-form').getForm().findField('Id').setValue(0);
                        Ext.getCmp('jobOrder-form').getForm().findField('CheckedById').setValue(null);
                        Ext.getCmp('jobOrder-form').getForm().findField('CheckedDate').setValue(null);
                        Ext.getCmp('jobOrder-form').getForm().findField('ApprovedById').setValue(null);
                        Ext.getCmp('jobOrder-form').getForm().findField('ApprovalDate').setValue(null);
                        Ext.getCmp('jobOrder-form').getForm().findField('JobOrderNo').setValue("Auto-Generated");
                   
                    }
                });
                var grid = Ext.getCmp('jobOrder-detailGrid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ operationTypeId: this.parentJobOrderId, source: 'Edit' }) };
                store.load({ params: { start: 0, limit: grid.pageSize } });

             }
             else  if (this.operationTypeId > 0) {
                    Ext.getCmp('jobOrder-window').actionType = "Edit";
                    var isrevised = this.isRevised;
                    if (isrevised == true) {
                        var parentJobOrderId = this.parentJobOrderId;
                        var parentJobOrder = this.parentJobOrder;

                        var form = Ext.getCmp('jobOrder-form');
                        form.load({
                            params: { id: this.parentJobOrderId },
                            success: function () {
                                //Ext.getCmp('jobOrder-form').getForm().findField('Id').setValue(0);
                                Ext.getCmp('jobOrder-form').getForm().findField('ParentJobOrderId').setValue(parentJobOrderId);
                            }
                        });

                        Ext.getCmp('jobOrder-window').actionType = "Revised";
                        
                        var grid = Ext.getCmp('jobOrder-detailGrid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ operationTypeId: this.parentJobOrderId, source: 'Edit' }) };
                        store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                    else
                    {
                        var form = Ext.getCmp('jobOrder-form');
                        form.load({
                            params: { id: this.operationTypeId },
                            success: function () {

                            }
                        });

                        var grid = Ext.getCmp('jobOrder-detailGrid');
                        var store = grid.getStore();
                        store.baseParams = { record: Ext.encode({ operationTypeId: this.operationTypeId, source: 'Edit' }) };
                        store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
                else {
                    
                    Ext.getCmp('jobOrder-window').actionType = "Add";
                    Ext.getCmp('jobOrder-form').getForm().findField('JobOrderNo').setValue('Auto-Generated');
                    Ext.getCmp('jobOrder-form').getForm().findField('Version').setValue("000");
                    Ext.getCmp('jobOrder-form').getForm().findField('ParentJobOrderId').reset();

                }
                //var grid = Ext.getCmp('jobOrder-detailGrid');
                //var store = grid.getStore();
                //store.baseParams = { record: Ext.encode({ operationTypeId: this.operationTypeId }) };
                //store.load({ params: { start: 0, limit: grid.pageSize } });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrder.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.jobOrder.Form();
        this.gridDetail = new Ext.erp.iffs.ux.jobOrder.GridDetail({
            tbar: [{
                xtype: 'button',
                text: 'Add Fields',
                iconCls: 'icon-accept',
                handler: this.onAddRow
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Remove Fields',
                iconCls: 'icon-delete',
                handler: this.onRemove
            }, {
                id: 'select-jobOrderDetail',
                iconCls: 'icon-accept',
                text: 'Select Item',
                handler: function () {

                    var grid = Ext.getCmp('jobOrder-detailGrid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.selectedrecord = selectedrecord;

                }
            }, {
                id: 'move-jobOrderDetail',
                iconCls: 'icon-accept',
                text: 'Move Item',
                handler: function () {



                    var grid = Ext.getCmp('jobOrder-detailGrid');
                    var movedRecord = grid.selectedrecord;
                    var store = grid.getStore();
                    var selectedrecord = grid.getSelectionModel().getSelected();

                    if (!grid.getSelectionModel().hasSelection() || movedRecord == '') {
                        return;
                    }
                    var selectedIndex = store.indexOf(selectedrecord);
                    grid.getStore().remove(movedRecord);
                    store.insert(selectedIndex, movedRecord);
                }
            }, ]
        });
        this.items = [this.form, this.gridDetail];

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
        Ext.erp.iffs.ux.jobOrder.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var gridDetail = Ext.getCmp('jobOrder-detailGrid');
        var rec = '';
        var store = gridDetail.getStore();
        var action = Ext.getCmp('jobOrder-window').actionType;
        store.each(function (item) {
            if (item.data['Value'] != '') {
                rec = rec + item.data['FieldCategory'] + ':' +
                    item.data['Field'] + ':' +
                    item.data['Value'] + ';';
            }
        });

        if (rec.length == 0) {
            Ext.MessageBox.show({
                title: 'Incomplete',
                msg: 'Value cannot be empty!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }


        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ templateDetails: rec, action: action }) },
            success: function (form, action) {
                //Ext.getCmp('jobOrder-form').getForm().reset();
                Ext.getCmp('jobOrder-paging').doRefresh();
                Ext.getCmp('jobOrder-window').close();

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
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
            window.Notifications.ChangeViewStatus(this.NotificationId, function(result) {
                if (result.success) {
                    Ext.getCmp('notifications-paging').doRefresh();
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
        Ext.getCmp('jobOrder-window').addRow();
    },
    addRow: function () {
        var grid = Ext.getCmp('jobOrder-detailGrid');
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
    },
    onRemove: function () {
        var grid = Ext.getCmp('jobOrder-detailGrid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelections();
        for (var i = 0; i < record.length; i++) {
            grid.store.remove(record);
        }
    }
});
Ext.reg('jobOrder-window', Ext.erp.iffs.ux.jobOrder.Window);

/**
* @desc      JobOrderTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrder.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrder.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderNo', 'Date', 'Status', 'ReceivingClient', 'UltimateClient', 'IsChecked', 'IsApproved', 'PreparedBy', 'Version', 'CheckedBy', 'ApprovedBy', 'PreparedDate', 'CheckedDate', 'ApprovalDate'],
            remoteSort: true
        }),
        id: 'jobOrder-grid',
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
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivingClient',
            header: 'Receiving Client',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Status',
            header: 'JO Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedDate',
            header: 'Prepared Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CheckedBy',
            header: 'Checked By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CheckedDate',
            header: 'Checked Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ApprovedBy',
            header: 'Approved By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ApprovalDate',
            header: 'Approval Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IsChecked',
            header: 'Checked?',
            sortable: false,
            width: 100,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        }, {
            dataIndex: 'IsApproved',
            header: 'Approved?',
            sortable: false,
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
Ext.extend(Ext.erp.iffs.ux.jobOrder.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrder-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrder.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.jobOrder.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('jobOrder-grid', Ext.erp.iffs.ux.jobOrder.Grid);

/**
* @desc      PurchaseOrder grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.GridDetail
* @extends   Ext.grid.GridPanel
*/
var jobOrderSM = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.iffs.ux.jobOrder.GridDetail = function (config) {
    Ext.erp.iffs.ux.jobOrder.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetGridDetails,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'FieldCategory',
                direction: 'ASC'
            },
            fields: ['Id', 'FieldCategory', 'Field', 'Value'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('jobOrder-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('jobOrder-detailGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('jobOrder-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrder-detailGrid',
        pageSize: 10,
        clicksToEdit: 1,
        height: 350,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        //sm: jobOrderSM,
        viewConfig: {
            forceFit: true,
            autoFill: true,
            listeners: {
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    contextMenu.showAt(e.getXY());
                    return false;
                }
            }
        },
        listeners: {
            rowcontextmenu: function (grid, index, event) {
                event.stopEvent();
                mnuJVRContext.showAt(event.xy);
            }
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'FieldCategory',
            header: 'Field Category',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'Field',
            header: 'Field',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: false
            }
        }, {
            dataIndex: 'Value',
            header: 'Default Value',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: {
                xtype: 'textarea',
                allowBlank: false
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrder.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrder-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrder.GridDetail.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrder-detailGrid', Ext.erp.iffs.ux.jobOrder.GridDetail);

/**
* @desc      QuotationSelection window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.QuotationWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.jobOrder.QuotationWindow = function (config) {
    Ext.erp.iffs.ux.jobOrder.QuotationWindow.superclass.constructor.call(this, Ext.apply({
        title: 'Quotation Selection',
        width: 500,
        height: 400,
        layout: 'fit',
        bodyStyle: 'padding:5px;',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrder.QuotationWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.jobOrder.QuotationGrid();
        this.items = [this.grid];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Select',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onSelect
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.jobOrder.QuotationWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('quotationSelection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var form = this.parentForm;
        var rec = form.findField(this.controlIdField).getValue();
        var names = form.findField(this.controlNameField).getValue();

        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
            rec = rec + selectedRows[i].get("Id") + ';';
            names = names + selectedRows[i].get("QuotationNo") + ', '
        }
        var id = rec;
        var name = names;
       
        form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue(name);
      //  this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('quotationSelection-window', Ext.erp.iffs.ux.jobOrder.QuotationWindow);


/**
* @desc      QuotationSelection grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.QuotationGrid
* @extends   Ext.grid.GridPanel
*/
var jobQuotationSm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.iffs.ux.jobOrder.QuotationGrid = function (config) {
    Ext.erp.iffs.ux.jobOrder.QuotationGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetActiveQuotations,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'QuotationNo',
                direction: 'ASC'
            },
            fields: ['Id', 'QuotationNo', 'PrevQuotationNumber', 'ValidtyDate'],
            remoteSort: true
        }),
        id: 'quotationSelection-grid',
        pageSize: 10,
        stripeRows: true,
        border: false,
        sm: jobQuotationSm,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [jobQuotationSm, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'QuotationNo',
            header: 'Quotation No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PrevQuotationNumber',
            header: 'Prev Quotation No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ValidtyDate',
            header: 'Validty Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrder.QuotationGrid, Ext.grid.GridPanel, {
    initComponent: function () {


        this.tbar = [{
            text: 'Clear Selection',
            iconCls: 'icon-accept',
            scope: this,
            handler: function () {
                var form = Ext.getCmp('jobOrder-form').getForm(); 
                form.findField('QuotationRecs').setValue('');
                form.findField('Quotations').setValue('');

            }
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            emptyText: 'Type Search text here and press "Enter"',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialKey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('quotationSelection-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('quotationSelection-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'quotationSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrder.QuotationGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ mode: 'get' }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.jobOrder.QuotationGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('quotationSelection-grid', Ext.erp.iffs.ux.jobOrder.QuotationGrid);


/**
* @desc      JobOrderTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrder
* @class     Ext.erp.iffs.ux.jobOrder.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.jobOrder.Panel = function (config) {
    Ext.erp.iffs.ux.jobOrder.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addJobOrder',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editJobOrder',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteJobOrder',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewJobOrder',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Copy',
                id: 'copyJobOrder',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanAdd'),
                handler: this.onCopy
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Revise',
                id: 'reviseJobOrder',
                iconCls: 'icon-refresh',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanEdit'),
                handler: this.onRevise
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanApprove'),
                handler: this.onApprove
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'History',
                iconCls: 'icon-education',
                handler: this.onHistory
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'jobOrder.searchText',
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
                            var grid = Ext.getCmp('jobOrder-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('jobOrder-grid');
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
                    var searchText = Ext.getCmp('jobOrder.searchText').getValue();
                    window.open('JobOrder/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrder.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'jobOrder-grid',
            id: 'jobOrder-grid'
        }];
        Ext.erp.iffs.ux.jobOrder.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.jobOrder.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.jobOrder.Window({
            operationTypeId: 0,
            isRevised: false,
            title: 'Add Job Order'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('jobOrder-grid');
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
        new Ext.erp.iffs.ux.jobOrder.Window({
            operationTypeId: id,
            isRevised: false,
            title: 'Edit Job Order'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('jobOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onCopy: function () {
        var grid = Ext.getCmp('jobOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.jobOrder.Window({
            isCopy: true,
            parentJobOrderId: id,
            title: 'Copy Job Order'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('jobOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected jobOrder',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Role.Delete(id, function (result, response) {
                        Ext.getCmp('jobOrder-paging').doRefresh();
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
    onRevise: function () {
        var grid = Ext.getCmp('jobOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var jobOrder = grid.getSelectionModel().getSelected().get('JobOrderNo');

        new Ext.erp.iffs.ux.jobOrder.Window({
            operationTypeId: id,
            isRevised: true,
            parentJobOrderId: id,
            parentJobOrder: jobOrder,
            title: 'Revise Job Order'
        }).show();
    },
    onHistory: function () {
        var grid = Ext.getCmp('jobOrder-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.iffs.ux.jobOrderHistory.Window({
            title: 'Job Order Revision History',
            jobOrderId: id
        }).show();
    },
    onCheck: function () {
        var grid = Ext.getCmp('jobOrder-grid');
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
                        cmpPaging: Ext.getCmp('jobOrder-paging'),
                        api: {
                            submit: JobOrder.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
        
    },
    onApprove: function () {
        var grid = Ext.getCmp('jobOrder-grid');
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
                        cmpPaging: Ext.getCmp('jobOrder-paging'),
                        api: {
                            submit: JobOrder.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('jobOrder-panel', Ext.erp.iffs.ux.jobOrder.Panel);


/////////////////////////////////////
var mnuJVRContext = new Ext.menu.Menu({
    items: [{
        id: 'btnJVRInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    }],
    listeners: {
        itemclick: function (item) {
            switch (item.id) {
                case 'btnJVRInsertRow':
                    {
                        var grid = Ext.getCmp('jobOrder-detailGrid');
                        if (!grid.getSelectionModel().hasSelection()) {
                            Ext.MessageBox.show({
                                title: 'Empty Selection',
                                msg: 'You must select a row to complete the action.',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.WARNING,
                                scope: this
                            });
                            return;
                        }
                        var store = grid.getStore();
                        var voucher = store.recordType;
                        var p = new voucher({
                            DebitAmount: 0,
                            CreditAmount: 0
                        });

                        var record = grid.getSelectionModel().getSelected();
                        var index = grid.store.indexOf(record);

                        grid.stopEditing();
                        if (index >= 0) {
                            store.insert(index, p);
                        }
                        if (index > 0) {
                            grid.startEditing(index, 3);
                        }
                    }
                    break;
            }
        }
    }
});