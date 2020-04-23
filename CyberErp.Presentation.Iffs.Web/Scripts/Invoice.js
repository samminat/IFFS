/// <reference path="Invoice.js" />
Ext.ns('Ext.erp.iffs.ux.invoice');
/**
* @desc      Invoice registration form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.invoice.Form = function (config) {
    Ext.erp.iffs.ux.invoice.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Invoice.Get,
            submit: Invoice.Save
        },
        paramOrder: ['id'],
        defaults: {
            //anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invoice-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        refreshForm: function () {
            Invoice.GetDocumentNo(function (result) {
                var form = Ext.getCmp('invoice-form').getForm();
                form.findField('InvoiceNo').setValue(result.data.Number);
                form.findField('PreparedBy').setValue(result.data.user);
                form.findField('PreparedById').setValue(result.data.userId);
                         
            });
        },
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
                columnWidth: .5,
                defaults: {
                    anchor: '95%', labelStyle: 'text-align:right;', msgTarget: 'side', 
                },
                layout: 'form',
                border: false,
                items: [{
                    name: 'Id', xtype: 'hidden'
                }, {
                    name: 'OperationTypeId',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedDate',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                },  {
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'OperationIds',
                    xtype: 'hidden'
                }, {
                    name: 'JobOrderIds',
                    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'CustomerId'
                }, {
                    hiddenName: 'Customer',
                    xtype: 'combo',
                    fieldLabel: 'Customer',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search Customer---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetCustomer }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('invoice-form').getForm();
                            form.findField('CustomerId').setValue(rec.id);
                                           },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('invoice-form').getForm();
                                  form.findField('CustomerId').reset();       
                            }
                        }
                    }
                }, {
                    hiddenName: 'OperationType',
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
                            var form = Ext.getCmp('invoice-form').getForm();
                            form.findField('OperationTypeId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'InvoiceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Invoice Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    name: 'FsNo',
                    xtype: 'textfield',
                    fieldLabel: 'Fs Number',
                    readOnly: false,
                    allowBlank: false
                }, {
                    hiddenName: 'PaymentMode',
                    xtype: 'combo',
                    fieldLabel: 'Payment Mode',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    forceSelection: false,
                    emptyText: '---Select---',
                    allowBlank: false,
                    hidden: false,
                    store: new Ext.data.ArrayStore({
                        fields: ['Id', 'Name'],
                        idProperty: 'Id',
                        data: [
                            [1, 'Cash'],
                            [2, 'Check/CPO'],
                            [3, 'TT']

                        ]
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                }, {
                    name: 'CustomerReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Customer Reference No',
                    readOnly: false,
                    allowBlank: false
                }, {
                    xtype: 'compositefield',
                    name: 'compositeOperations',
                    fieldLabel: 'Operation No',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'OperationNo',
                        xtype: 'textarea',
                        fieldLabel: 'Operation No',
                        height: 70,
                        readOnly: false,
                        allowBlank: true,
                    }, {
                        xtype: 'button',
                        iconCls: 'icon-filter',
                        width: 25,
                        handler: function () {
                            var form = Ext.getCmp('invoice-form').getForm();
                            var customerId= form.findField('CustomerId').getValue();
                            var operationTypeId = form.findField('OperationTypeId').getValue();
                            new Ext.erp.iffs.ux.invoice.OperationWindow({
                                parentForm: form,
                                controlIdField: 'OperationIds',
                                controlNameField: 'OperationNo',
                                customerId: customerId,
                                operationTypeId: operationTypeId
                            }).show();
                        }
                    }]
                }, {
                    name: 'WithHoldingApplied',
                    checked: true,
                    xtype: 'checkbox',
                    hidden: false,
                    fieldLabel: 'Apply Withholding',
                    width: 100,
                    readOnly: false,
                    allowBlank: true,
                    checked: false,
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    name: 'PreparedBy',
                    xtype: 'textfield',
                    fieldLabel: 'Prepared By',
                    readOnly: true,
                    allowBlank: false
                }, 
                ]
            }, {
                columnWidth: .5,
                defaults: {
                    anchor: '95%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                layout: 'form',
                border: false,
                items: [
                    {
                    name: 'BL_AWB',
                    xtype: 'textfield',
                    fieldLabel: 'BL/AWB',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'HBL',
                    xtype: 'textfield',
                    fieldLabel: 'HBL',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'Carrier',
                    xtype: 'textfield',
                    fieldLabel: 'Carrier',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'ExchangeRate',
                    xtype: 'numberfield',
                    width: 100,
                    fieldLabel: 'Exchange Rate',
                    allowBlank: false
                } ,{
                    name: 'NoofContainer',
                    xtype: 'textfield',
                    fieldLabel: 'No of Containers/Loose(KG)',
                    readOnly: false,
                    allowBlank: true,
                }, {
                    name: 'Container',
                    xtype: 'textarea',
                    fieldLabel: 'Container',
                    width: 100,
                    height: 70,
                    readOnly: false,
                    allowBlank: true,
                },{
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remark',
                    width:100,
                    height:70,
                    readOnly: false,
                    allowBlank: true,
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.Form, Ext.form.FormPanel);
Ext.reg('invoice-form', Ext.erp.iffs.ux.invoice.Form);

/**
* @desc      Invoice registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.invoice.Window = function (config) {
    Ext.erp.iffs.ux.invoice.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 1100,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'invoice-window',
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.invoiceId != '' && this.invoiceId > 0) {
                    Ext.getCmp('invoice-window').actionType = "Edit";
                    this.form.load({ params: { id: this.invoiceId } });
                    var grid = Ext.getCmp('invoice-detailGrid');
                    grid.store.baseParams = { param: Ext.encode({ invoiceId: this.invoiceId }) };
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else {
                   Ext.getCmp('invoice-window').actionType = "Add";
                    this.form.getForm().findField('Id').setValue(this.invoiceId);
                   this.form.refreshForm();

                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.invoice.Form(          
            );
        this.grid = new Ext.erp.iffs.ux.invoice.DetailGrid(         
            );
        this.items = [this.form, this.grid];
        this.buttons = [{
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
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
                this.form.refreshForm();
            },
            scope: this
        }];
        Ext.erp.iffs.ux.invoice.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var detailGrid = Ext.getCmp('invoice-detailGrid');
        var store = detailGrid.getStore();
        var action = Ext.getCmp('invoice-window').actionType;
        var operationIds = this.form.getForm().findField('OperationIds').getValue();
                          
        if (store.getCount() == 0) {
            var msg = Ext.MessageBox;
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please fill services", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        var records = '';
        var errorMessage = "";
        store.each(function (item) {
            if (typeof item.data['Quantity'] == "undefined" || item.data['Quantity'] == "")
                errorMessage = "please enter Quantity";
          if (typeof item.data['UnitPrice'] == "undefined" || item.data['UnitPrice'] == "" || item.data['UnitPrice'] <=0)
                errorMessage = "please enter Unit Price";

            records = records + item.data['Id'] + ':' +
                                item.data['CurrencyId'] + ':' +
                                item.data['Quantity'] + ':' +
                                item.data['InvoiceId'] + ':' +
                                item.data['Remark'] + ':' +
                                item.data['ServiceUnitTypeId'] + ':' +
                                item.data['UnitPrice'] + ':' +                          
                                item.data['ServiceId'] + ':' +
                                item.data['ServiceDescription'] + ';';
                               
            

        });
        if (errorMessage != "") {
                var msg = Ext.MessageBox;
                Ext.MessageBox.show({
                    title: 'Save failed',
                    msg: errorMessage,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
        }
      
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ services: records, action: action, operationIds: operationIds }) },
            success: function (form, action) {

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.SUCCESS,
                    scope: this
                });
                Ext.getCmp('invoice-form').getForm().reset();
                Ext.getCmp('invoice-paging').doRefresh();
                var Grid = Ext.getCmp('invoice-detailGrid').getStore().removeAll();
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
        this.close();
    }
});
Ext.reg('invoice-window', Ext.erp.iffs.ux.invoice.Window);

/**
* @desc      Invoice grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.invoice.Grid = function (config) {
    Ext.erp.iffs.ux.invoice.Grid.superclass.constructor.call(this, Ext.apply({

        store: new Ext.data.DirectStore({
            directFn: Invoice.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },

            fields: ['Id', 'InvoiceNo', 'OperationType', 'PaymentMode', 'WithHoldingApplied', 'OperationNo', 'Date', 'FsNo', 'ExchangeRate', 'Customer', 'IsChecked', 'IsApproved', 'PreparedBy', 'CustomerReferenceNo', 'CheckedBy', 'ApprovedBy', 'PreparedDate', 'CheckedDate', 'ApprovalDate'],
            remoteSort: true
        }),

        id: 'invoice-grid',
        loadMask: true,
        height:300,
        pageSize: 30,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,
            hidden:false,
            width: 120,
            menuDisabled: true
        },{
            dataIndex: 'InvoiceNo',
            header: 'Invoice Number',
            sortable: true,
            hidden:false,
            width: 200,
            menuDisabled: true
        },  
        {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
            width: 200,
            menuDisabled: true
        },
        {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 200,
            menuDisabled: true
        },{
            dataIndex: 'FsNo',
            header: 'Fs No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PaymentMode',
            header: 'Payment Mode',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'WithHoldingApplied',
            header: 'Is WithHolding Applied?',
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
        }, {
            dataIndex: 'OperationNo',
            header: 'Operation No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CustomerReferenceNo',
            header: 'Customer Reference No',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'IsChecked',
            header: 'Checked?',
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
        }, {
            dataIndex: 'CheckedBy',
            header: 'CheckedBy',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CheckedDate',
            header: 'CheckedDate',
            sortable: true,
            width: 100,
            menuDisabled: true
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
        }, {
            dataIndex: 'ApprovedBy',
            header: 'ApprovedBy',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ApprovalDate',
            header: 'ApprovalDate',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'invoice-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.invoice.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.invoice.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('invoice-grid', Ext.erp.iffs.ux.invoice.Grid);


/**
* @desc      Invoice detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.invoice.DetailGrid = function (config) {
    Ext.erp.iffs.ux.invoice.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Invoice.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ServiceDescription','IsTaxable', 'CurrencyId', 'Currency', 'Quantity', 'InvoiceId', 'Remark', 'ServiceUnitTypeId', 'ServiceUnitType', 'UnitPrice', 'ServiceId', 'Service'],
            remoteSort: true
        }),

        id: 'invoice-detailGrid',
        loadMask: true,
        pageSize: 30,
        columnLines: true,
        stripeRows: true,
        height:320,
        border: true,
        clicksToEdit: 1,
        selectedRecord:'',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'InvoiceId',
            header: 'InvoiceId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        },{
            dataIndex: 'CurrencyId',
            header: 'CurrencyId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ServiceId',
            header: 'Service',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        },  {
            dataIndex: 'Service',
            header: 'Service',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'ServiceDescription',
            header: 'Service Description',
            sortable: true,
            width: 220,
            menuDisabled: true,
            editor: new Ext.form.TextArea({
                disabled: false, allowBlank: false, decimalPrecision: 3,height:80,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        },  {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: true,
            width:110,
            menuDisabled: true,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Iffs.GetCurrency },

                }),
                valueField: 'Name',
                displayField: 'Name',
                listeners: {
                    select: function (cmb,rec) {
                        var grid = Ext.getCmp('invoice-detailGrid');
                        var selectedrecord = grid.getSelectionModel().getSelected();
                         selectedrecord.set('CurrencyId', rec.id);

                    },
                }
            })
        }, {
            dataIndex: 'IsTaxable',
            header: 'IsTaxable?',
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
        }, {
            dataIndex: 'ServiceUnitType',
            header: 'Unit Type',
            sortable: true,
            width: 120,
            menuDisabled: true,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                forceSelection: true,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: Iffs.GetServiceUnitType },

                }),
                valueField: 'Name',
                displayField: 'Name',
                listeners: {
                    select: function (cmb, rec) {
                        var grid = Ext.getCmp('invoice-detailGrid');
                        var selectedrecord = grid.getSelectionModel().getSelected();
                        selectedrecord.set('ServiceUnitTypeId', rec.id);


                    },
                }
            })
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
                disabled: false, allowBlank: false, decimalPrecision: 3,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        },{
            dataIndex: 'UnitPrice',
            header: 'Unit Price',
            sortable: true,
            width: 80,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
                disabled: false, allowBlank: false, decimalPrecision: 3,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: true,
            width: 80,
            menuDisabled: true,
            editor: new Ext.form.TextArea({
                disabled: false, allowBlank: false, decimalPrecision: 3,height:80,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }],
       
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({operationTypeId:this.operationTypeId }) };
        this.tbar = [
            {
                id: 'remove-invoiceDetail',
                iconCls: 'icon-delete',
                text: 'Remove Item',
                handler: function () {
                    var grid = Ext.getCmp('invoice-detailGrid');
                    if (!grid.getSelectionModel().hasSelection()) return;
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, {
                id: 'select-invoiceDetail',
                iconCls: 'icon-accept',
                text: 'Select Item',
                handler: function () {

                    var grid = Ext.getCmp('invoice-detailGrid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.selectedrecord = selectedrecord;

                }
            }, {
                id: 'move-invoiceDetail',
                iconCls: 'icon-accept',
                text: 'Move Item',
                handler: function () {
                    


                    var grid = Ext.getCmp('invoice-detailGrid');
                    var movedRecord = grid.selectedrecord;
                    var store = grid.getStore();
                    var selectedrecord = grid.getSelectionModel().getSelected();

                    if (!grid.getSelectionModel().hasSelection() || movedRecord=='') {
                        return;
                    }
                    var selectedIndex = store.indexOf(selectedrecord);
                    grid.getStore().remove(movedRecord);
                    store.insert(selectedIndex, movedRecord);
                }
            },
            '->', {
                id: 'servicePicker-invoiceDetail',
                iconCls: 'icon-add',
                disabled: false,
                text: 'Service Picker',
                handler: function () {
                    var grid = Ext.getCmp('invoice-detailGrid');
                    var form = Ext.getCmp('invoice-form').getForm();
                    var operationTypeId = form.findField('OperationTypeId').getValue();
                    var jobOrderIds = form.findField('JobOrderIds').getValue();

                    if (typeof operationTypeId == "undefined" || operationTypeId == "" || operationTypeId == 0)
                    {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'please select operation Type first!',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.OK,
                            scope: this
                        });
                        return;
                    }
                  
                    new Ext.erp.iffs.ux.invoice.ServiceSelectionWindow({
                        title: 'Load Service',
                        targetGrid: grid,
                        operationTypeId: operationTypeId,
                        jobOrderIds: jobOrderIds
                    }).show();
                }
            }

        ];
        Ext.erp.iffs.ux.invoice.DetailGrid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('invoice-detailGrid', Ext.erp.iffs.ux.invoice.DetailGrid);




/**
* @desc      Customer Response window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.OperationWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.invoice.OperationWindow = function (config) {
    Ext.erp.iffs.ux.invoice.OperationWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
        show: function () {
        },
        scope: this
    }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.invoice.OperationWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.invoice.OperationGrid({
            customerId: this.customerId,
            operationTypeId: this.operationTypeId
        });
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
        Ext.erp.iffs.ux.invoice.OperationWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var grid = Ext.getCmp('operationSelection-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var form = this.parentForm;

        var rec = '';
        var names = '';
        var noofContainer = 0;
        var jobOrderIds = '';
        var containers =typeof form.findField('Container').getValue()!= "undefined"?form.findField('Container').getValue():"";
        var carrier = typeof form.findField('Carrier').getValue() != "undefined" ? form.findField('Carrier').getValue() : ""; 
        var hBL = typeof form.findField('HBL').getValue() != "undefined" ? form.findField('HBL').getValue() : "";
        var bL_AWB = typeof form.findField('BL_AWB').getValue() != "undefined" ? form.findField('BL_AWB').getValue() : "";
        var customerReferenceNo = typeof form.findField('CustomerReferenceNo').getValue() != "undefined" ? form.findField('CustomerReferenceNo').getValue() : "";
        var selectedRows = grid.getSelectionModel().getSelections();

        for (var i = 0; i < selectedRows.length; i++) {
             rec = rec == '' ? selectedRows[i].get("Id") : name + ', ' + selectedRows[i].get("Id");
            names = names == '' ? selectedRows[i].get("OperationNo") : name + ', ' + selectedRows[i].get("OperationNo");
            jobOrderIds = jobOrderIds == '' ? selectedRows[i].get("JobOrderId") : jobOrderIds + ', ' + selectedRows[i].get("JobOrderId");

            noofContainer = noofContainer +parseInt( selectedRows[i].get("NumberOfContainers"));
            if (containers.indexOf(selectedRows[i].get("Containers")) == -1)
            containers = containers == '' ? selectedRows[i].get("Containers") : containers + ', ' + selectedRows[i].get("Containers");
            if (carrier.indexOf(selectedRows[i].get("Carrier")) == -1)
                carrier = carrier == '' ? selectedRows[i].get("Carrier") : carrier + ', ' + selectedRows[i].get("Carrier");
            if (hBL.indexOf(selectedRows[i].get("HBL")) == -1)
                hBL = hBL == '' ? selectedRows[i].get("HBL") : hBL + ', ' + selectedRows[i].get("HBL");
            if (bL_AWB.indexOf(selectedRows[i].get("BL_AWB")) == -1)
                bL_AWB = bL_AWB == '' ? selectedRows[i].get("BL_AWB") : hBL + ', ' + selectedRows[i].get("BL_AWB");
            if (customerReferenceNo.indexOf(selectedRows[i].get("CustomerReferenceNo")) == -1)
                customerReferenceNo = customerReferenceNo == '' ? selectedRows[i].get("CustomerReferenceNo") : customerReferenceNo + ', ' + selectedRows[i].get("CustomerReferenceNo");

        }
        var id = rec;
        var name = names;
         form.findField(this.controlIdField).setValue(id);
        form.findField(this.controlNameField).setValue(name);
        form.findField('NoofContainer').setValue(noofContainer);
        form.findField('Container').setValue(containers);
        form.findField('Carrier').setValue(carrier);
        form.findField('HBL').setValue(hBL);
        form.findField('BL_AWB').setValue(bL_AWB);
        form.findField('JobOrderIds').setValue(jobOrderIds);
        form.findField('CustomerReferenceNo').setValue(customerReferenceNo);

        this.close();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('operation-Window', Ext.erp.iffs.ux.invoice.OperationWindow);



/**
* @desc      OperationSelection grid
* @author    Meftuh mohammed
* @copyright (c) 2017, Cybersoft
* @date      jun 26, 2019
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.OperationGrid
* @extends   Ext.grid.GridPanel
*/
var operationSm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.iffs.ux.invoice.OperationGrid = function (config) {
    Ext.erp.iffs.ux.invoice.OperationGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Operation.GetActiveOperation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationNo', 'JobOrderId', 'CustomerReferenceNo', 'NumberOfContainers', 'Containers', 'Date', 'Carrier', 'HBL', 'BL_AWB'],
            remoteSort: true
        }),
        id: 'operationSelection-grid',
        pageSize: 10,
        height:250,
        stripeRows: true,
        border: false,
        sm: operationSm,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [operationSm, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OperationNo',
            header: 'Operation No',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.invoice.OperationGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'operationSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.invoice.OperationGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.store.baseParams = { record: Ext.encode({ customerId: this.customerId, operationTypeId: this.operationTypeId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.invoice.OperationGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operationSelection-grid', Ext.erp.iffs.ux.invoice.OperationGrid);


/**
* @desc      Customer Response window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.ServiceSelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.invoice.ServiceSelectionWindow = function (config) {
    Ext.erp.iffs.ux.invoice.ServiceSelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.invoice.ServiceSelectionWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.invoice.ServiceSelectionGrid({
            operationTypeId: this.operationTypeId
        });
        this.items = [this.grid];
        Ext.getCmp('quotationId-invoice').store.baseParams = { jobOrderIds: this.jobOrderIds };

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
        Ext.erp.iffs.ux.invoice.ServiceSelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onSelect: function () {
        var selectionGrid = this.grid;
        if (!selectionGrid.getSelectionModel().hasSelection())
            return;
        var selectedItems = selectionGrid.getSelectionModel().getSelections();
        var gridDatastore = this.targetGrid.getStore();
        var item = gridDatastore.recordType;
 
        for (var i = 0; i < selectedItems.length; i++) {

                var p = new item({
                     CurrencyId: selectedItems[i].get('CurrencyId'),
                    Currency: selectedItems[i].get('Currency'),
                    ServiceUnitTypeId: selectedItems[i].get('ServiceUnitTypeId'),
                    ServiceUnitType: selectedItems[i].get('ServiceUnitType'),
                    UnitPrice: selectedItems[i].get('Rate'),
                    ServiceId: selectedItems[i].get('ServiceId'),
                    Service: selectedItems[i].get('Service'),
                    ServiceDescription: selectedItems[i].get('ServiceDescription'),
                    Quantity: selectedItems[i].get('Quantity'),
                    IsTaxable: selectedItems[i].get('IsTaxable'),
                    Remark: '',
             
                });
                var count = gridDatastore.getCount();
                gridDatastore.insert(count, p);
        }

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('serviceSelection-Window', Ext.erp.iffs.ux.invoice.ServiceSelectionWindow);



/**
* @desc      ServiceSelection grid
* @author    Meftuh mohammed
* @copyright (c) 2017, Cybersoft
* @date      jun 26, 2019
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.ServiceSelectionGrid
* @extends   Ext.grid.GridPanel
*/
var serviceSelectionSm = new Ext.grid.CheckboxSelectionModel({
    clicksToEdit: 1,
    checkOnly: true,
    singleSelect: false
});

Ext.erp.iffs.ux.invoice.ServiceSelectionGrid = function (config) {
    Ext.erp.iffs.ux.invoice.ServiceSelectionGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetAllServiceTemplateWithRate,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'ServiceDescription','Quantity', 'ComparingSign','IsTaxable', 'Description', 'ServiceId', 'Service', 'CurrencyId', 'Currency', 'ServiceUnitTypeId', 'ServiceUnitType', 'Rate'],
            remoteSort: true
        }),
        id: 'serviceSelection-grid',
        pageSize: 10,
        height: 250,
        stripeRows: true,
        border: false,
        sm: serviceSelectionSm,
        viewConfig: {
            forceFit: true,
            autoFill: true
        },
        columns: [serviceSelectionSm, {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Service',
            header: 'Service',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ServiceUnitType',
            header: 'Unit Type',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'IsTaxable',
            header: 'Is Taxable',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'ComparingSign',
            header: 'Comparing Sign',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 120,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.invoice.ServiceSelectionGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.tbar = [
        {
            hiddenName: 'quotationId',
            id: 'quotationId-invoice',
            xtype: 'combo',
            fieldLabel: 'Quotation',
            triggerAction: 'all',
            mode: 'remote',
            anchor: '90%',
            editable: true,
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
                paramOrder: ['jobOrderIds'],
                api: { read: Iffs.GetQuotationsByJobOrder },
                listeners: {
                    load: function () {
                    },
                   
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
            listeners: {
                select: function (comb,rec) {
                    var grid = Ext.getCmp('serviceSelection-grid');
                    var quotationId = rec.id;
                    var operationTypeId = grid.operationTypeId;
                 
                    Ext.getCmp('txtServiceSelectionSearch').reset();

                    grid.store.baseParams['param'] = Ext.encode({ searchText: "", operationTypeId: operationTypeId, quotationId: quotationId });
                    grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                }
            }
        },
          '->',
        {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id: 'txtServiceSelectionSearch',
            emptyText: 'Type Search text here and press Enter',
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
                        var grid = Ext.getCmp('serviceSelection-grid');
                        var quotationId = Ext.getCmp('quotationId-invoice').getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(),quotationId:quotationId, operationTypeId: this.operationTypeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('serviceSelection-grid');
                        var quotationId = Ext.getCmp('quotationId-invoice').getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(),quotationId:quotationId, operationTypeId: this.operationTypeId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });

                    }
                }
            }
        }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'serviceSelection-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.invoice.ServiceSelectionGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        this.store.baseParams = { param: Ext.encode({ searchText: '', operationTypeId: this.operationTypeId }) };
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.invoice.ServiceSelectionGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('serviceSelection-grid', Ext.erp.iffs.ux.invoice.ServiceSelectionGrid);

/**
* @desc      Currency Selection form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      july 01, 2019
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.invoice.CurrencySelectionForm = function (config) {
    Ext.erp.iffs.ux.invoice.CurrencySelectionForm.superclass.constructor.call(this, Ext.apply({
        api: {
            //load: Quotation.GetCurrencySelection,
           // submit: Quotation.SaveCurrencySelection
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'invoice-CurrencySelectionForm',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        baseCls: 'x-plain',
        items: [{
            hiddenName: 'CurrencyId',
            xtype: 'combo',
            fieldLabel: 'Currency',
            triggerAction: 'all',
            mode: 'local',
            anchor: '90%',
            editable: true,
            forceSelection: true,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Iffs.GetCurrency }
            }),
            valueField: 'Id',
            displayField: 'Name',
        }, ]

    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.CurrencySelectionForm, Ext.form.FormPanel);
Ext.reg('invoice-currencySelectionForm', Ext.erp.iffs.ux.invoice.CurrencySelectionForm);


/**
* @desc      Customer Response window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.CurrencySelectionWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.invoice.CurrencySelectionWindow = function (config) {
    Ext.erp.iffs.ux.invoice.CurrencySelectionWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.invoice.CurrencySelectionWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.invoice.CurrencySelectionForm();
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Preview',
            iconCls: 'icon-accept',
            scope: this,
            handler: this.onPreview
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.invoice.CurrencySelectionWindow.superclass.initComponent.call(this, arguments);
    },
    onPreview: function () {
        if (!this.form.getForm().isValid()) return;
        var grid = Ext.getCmp('invoice-grid');
        var id = grid.getSelectionModel().getSelected().get('Id');
        var currencyId = this.form.getForm().findField('CurrencyId').getValue();
        var currencyName = this.form.getForm().findField('CurrencyId').getRawValue();

        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewInvoice&id=' + id + "&currencyId=" + currencyId + "&currencyName=" + currencyName, 'PreviewQuote', parameter);

    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('invoice-customerResponseWindow', Ext.erp.iffs.ux.invoice.CurrencySelectionWindow);

/**
* @desc      Invoice Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.invoice
* @class     Ext.erp.iffs.ux.invoice.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.invoice.Panel = function (config) {
    Ext.erp.iffs.ux.invoice.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [
                {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Invoice', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Invoice', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Invoice', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            },  {
                xtype: 'button',
                text: 'Preview',
                id: 'previewInvoice',
                iconCls: 'icon-preview',
                handler: this.onPreview
            },  {
                xtype: 'tbseparator'
            }, {
                xtype: 'textfield',
                id:"invoice.searchText",
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
                            var grid = Ext.getCmp('invoice-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('invoice-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
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
                    var searchText = Ext.getCmp('invoice.searchText').getValue();
                    window.open('Invoice/ExportToExcel?st=' + searchText, '', '');
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Invoice', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Invoice', 'CanApprove'),
                handler: this.onApprove
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.invoice.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.invoice.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.invoice.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.invoice.Window({
            invoiceId: 0,
            operationTypeId:0,
            title: 'Add Invoice'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('invoice-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
          new Ext.erp.iffs.ux.invoice.Window({
              invoiceId: id,
            title: 'Edit Invoice'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('invoice-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        new Ext.erp.iffs.ux.invoice.CurrencySelectionWindow({
                       title: 'Customer Selection'
        }).show();
    },
    onOperation: function () {
        var grid = Ext.getCmp('invoice-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.invoice.OperationWindow({
            invoiceId: id,
            title: 'Customer Response'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('invoice-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record to delete.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected record',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            animEl: 'Delete',
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    Invoice.Delete(id, function (result, response) {
                        Ext.getCmp('invoice-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onCheck: function () {
        var grid = Ext.getCmp('invoice-grid');
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
                        cmpPaging: Ext.getCmp('invoice-paging'),
                        api: {
                            submit: Invoice.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('invoice-grid');
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
                        cmpPaging: Ext.getCmp('invoice-paging'),
                        api: {
                            submit: Invoice.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    }
});
Ext.reg('invoice-panel', Ext.erp.iffs.ux.invoice.Panel);