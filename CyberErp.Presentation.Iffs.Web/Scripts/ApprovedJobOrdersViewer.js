Ext.ns('Ext.erp.iffs.ux.approvedJobOrdersViewer');

/**
* @desc      JobOrderTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrdersViewer
* @class     Ext.erp.iffs.ux.approvedJobOrdersViewer.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.approvedJobOrdersViewer.Form = function (config) {
    Ext.erp.iffs.ux.approvedJobOrdersViewer.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.JobOrder.Get,
            submit: window.JobOrder.ChangeViewStatus
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'approvedJobOrdersViewer-form',
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
                            var grid = Ext.getCmp('approvedJobOrdersViewer-detailGrid');
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
                            var form = Ext.getCmp('approvedJobOrdersViewer-form').getForm();
                            new Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow({
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
                    readOnly: true
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Request Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    xtype: 'hidden',
                    name: 'ReceivingClientId'
                }, {
                    hiddenName: 'ReceivingClient',
                    xtype: 'combo',
                    fieldLabel: 'Receiving Client',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    allowBlank: false,
                    itemSelected: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}" class="x-combo-list-item">' +
                            '{Name}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        api: { read: Iffs.GetCustomer }
                    }),
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('approvedJobOrdersViewer-form').getForm();
                            form.findField('ReceivingClientId').setValue(rec.id);
                            this.itemSelected = true;
                        },
                        blur: function (cmb) {
                            var form = Ext.getCmp('approvedJobOrdersViewer-form').getForm();
                            if (this.getValue() == '') {
                                form.findField('ReceivingClientId').reset();
                            }
                            if (!this.itemSelected) {
                                form.findField('ReceivingClientId').reset();
                                form.findField('ReceivingClientId').reset();
                            }
                            this.itemSelected = false;
                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: 'UltimateClientId'
                }, {
                    hiddenName: 'UltimateClient',
                    xtype: 'combo',
                    fieldLabel: 'Ultimate Client',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    allowBlank: false,
                    itemSelected: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}" class="x-combo-list-item">' +
                            '{Name}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        api: { read: Iffs.GetCustomer }
                    }),
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('approvedJobOrdersViewer-form').getForm();
                            form.findField('UltimateClientId').setValue(rec.id);
                            this.itemSelected = true;
                        },
                        blur: function (cmb) {
                            var form = Ext.getCmp('approvedJobOrdersViewer-form').getForm();
                            if (this.getValue() == '') {
                                form.findField('UltimateClientId').reset();
                            }
                            if (!this.itemSelected) {
                                form.findField('UltimateClientId').reset();
                                form.findField('UltimateClientId').reset();
                            }
                            this.itemSelected = false;
                        }
                    }
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [{
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
                    name: 'ContactPersonLocal',
                    xtype: 'textfield',
                    fieldLabel: 'Contact Person(Local)',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'ContactPersonForeign',
                    xtype: 'textfield',
                    fieldLabel: 'Contact Person(Fore.)',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'ValidityDate',
                    xtype: 'datefield',
                    fieldLabel: 'Validity Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remarks',
                    allowBlank: true
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approvedJobOrdersViewer.Form, Ext.form.FormPanel);
Ext.reg('approvedJobOrdersViewer-form', Ext.erp.iffs.ux.approvedJobOrdersViewer.Form);

/**
* @desc      JobOrderTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.approvedJobOrdersViewer
* @class     Ext.erp.iffsux.approvedJobOrdersViewer.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.approvedJobOrdersViewer.Window = function (config) {
    Ext.erp.iffs.ux.approvedJobOrdersViewer.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 700,
        id: 'approvedJobOrdersViewer-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        closable: false,
        jobOrderId: 0,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.operationTypeId > 0) {
                    Ext.getCmp('approvedJobOrdersViewer-window').actionType = "Edit";
                    var form = Ext.getCmp('approvedJobOrdersViewer-form');

                    form.load({
                        params: { id: this.operationTypeId }
                    });

                    var grid = Ext.getCmp('approvedJobOrdersViewer-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { record: Ext.encode({ operationTypeId: this.operationTypeId, source: 'Edit' }) };
                    store.load({ params: { start: 0, limit: grid.pageSize } });
                }
                else {
                    Ext.getCmp('approvedJobOrdersViewer-window').actionType = "Add";
                    Ext.getCmp('approvedJobOrdersViewer-form').getForm().findField('JobOrderNo').setValue('Auto-Generated');
                }

               

                
                this.form.setDisabled(true);
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.approvedJobOrdersViewer.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.approvedJobOrdersViewer.Form();
        this.gridDetail = new Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail();
        this.items = [this.form, this.gridDetail];

        this.bbar = [{
            xtype: 'tbfill'
        },{
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.approvedJobOrdersViewer.Window.superclass.initComponent.call(this, arguments);
    },

    onClose: function () {
        var form = Ext.getCmp('approvedJobOrdersViewer-form');
      //  var joborderid = Ext.getCmp('approvedJobOrdersViewer-window').jobOrderId;
        JobOrder.ChangeViewStatus(this.operationTypeId, function (result) {
            if (result.success) {
                Ext.getCmp('approvedJobOrders-paging').doRefresh();
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

        // mp('approvedJobOrdersViewer-form');
       Ext.getCmp('approvedJobOrdersViewer-window').close();
    }
});
Ext.reg('approvedJobOrdersViewer-window', Ext.erp.iffs.ux.approvedJobOrdersViewer.Window);



/**
* @desc      PurchaseOrder grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrdersViewer
* @class     Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail
* @extends   Ext.grid.GridPanel
*/
var jobOrderSM = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail = function (config) {
    Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail.superclass.constructor.call(this, Ext.apply({
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
                    Ext.getCmp('approvedJobOrdersViewer-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('approvedJobOrdersViewer-detailGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('approvedJobOrdersViewer-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'approvedJobOrdersViewer-detailGrid',
        pageSize: 10,
        clicksToEdit: 1,
        height: 350,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true
            
        },
        columns: [ {
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
Ext.extend(Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [];
        this.bbar = new Ext.PagingToolbar({
            id: 'approvedJobOrdersViewer-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('approvedJobOrdersViewer-detailGrid', Ext.erp.iffs.ux.approvedJobOrdersViewer.GridDetail);

/**
* @desc      QuotationSelection window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.approvedJobOrdersViewer
* @class     Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow = function (config) {
    Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow.superclass.constructor.call(this, Ext.apply({
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
Ext.extend(Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationGrid();
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
        Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('quotationSelection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var rec = '';
        var names = '';

        var selectedRows = grid.getSelectionModel().getSelections();
        for (var i = 0; i < selectedRows.length; i++) {
            rec = rec + selectedRows[i].get("Id") + ';';
            names = names + selectedRows[i].get("QuotationNo") + ', '
        }
        var id = rec;
        var name = names;
        var form = this.parentForm;
        form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue(name);
        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('quotationSelection-window', Ext.erp.iffs.ux.approvedJobOrdersViewer.QuotationWindow);



