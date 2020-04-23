/// <reference path="Quotation.js" />
Ext.ns('Ext.erp.iffs.ux.quotation');
/**
* @desc      Quotation registration form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.quotation.Form = function (config) {
    Ext.erp.iffs.ux.quotation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Quotation.Get,
            submit: Quotation.Save
        },
        paramOrder: ['id'],
        defaults: {
            //anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'quotation-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        refreshForm: function () {
            Quotation.GetDocumentNo(function (result) {
                var form = Ext.getCmp('quotation-form').getForm();
                form.findField('QuotationNo').setValue(result.data.Number);
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
                columnWidth: .4,
                defaults: {
                    anchor: '95%', labelStyle: 'text-align:right;', msgTarget: 'side', 
                },
                layout: 'form',
                border: false,
                items: [{
                    name: 'Id', xtype: 'hidden'
                }, {
                    name: 'ServiceRequestId',
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
                    name: 'PreparedById',
                    xtype: 'hidden'
                },  {
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'ParentQuotationId'
                }, {
                    hiddenName: 'ServiceRequest',
                    xtype: 'combo',
                    fieldLabel: 'Service Request',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search Service Request---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' + '<h3><span>{Name}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'CustomerId', 'Customer', 'CustomerGroupId', 'CustomerGroup']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetServiceRequest }
                    }),
                    valueField: 'Name',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('quotation-form').getForm();
                            form.findField('ServiceRequestId').setValue(rec.id);
                            form.findField('CustomerId').setValue(rec.data['CustomerId']);
                            form.findField('Customer').setValue(rec.data['Customer']);
                            form.findField('CustomerGroupId').setValue(rec.data['CustomerGroupId']);
                            form.findField('CustomerGroup').setValue(rec.data['CustomerGroup']);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('quotation-form').getForm();
                                form.findField('ServiceRequestId').reset();;s
                                form.findField('Customer').reset();
                                form.findField('CustomerId').reset();
                                form.findField('CustomerGroupId').reset();
                                form.findField('CustomerGroup').reset();
                                
                            }
                        }
                    }
                }, {
                    name: 'QuotationNo',
                    xtype: 'textfield',
                    fieldLabel: 'Quotation Number',
                    readOnly: true,
                    allowBlank: false
                }, {
                    xtype: 'hidden',
                    name: 'PrevQuotationId'
                }, {
                    hiddenName: 'PrevQuotationNumber',
                    xtype: 'combo',
                    fieldLabel: 'Prev Quotation No.',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search Quotation---',
                    mode: 'remote',
                    allowBlank: true,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {QuotationNo}" class="x-combo-list-item">' + '<h3><span>{QuotationNo}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'QuotationNo']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetQuotations }
                    }),
                    valueField: 'QuotationNo',
                    displayField: 'QuotationNo',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('quotation-form').getForm();
                            form.findField('PrevQuotationId').setValue(rec.id);
                        },
                        change: function (cmb, newvalue, oldvalue) {
                            if (newvalue == "") {
                                var form = Ext.getCmp('quotation-form').getForm();
                                form.findField('PrevQuotationId').reset();; s

                            }
                        }
                    }
                }, {
                    name: 'Version',
                    xtype: 'textfield',
                    value: '00',
                    fieldLabel: 'Version',
                    allowBlank: false
                }, {
                    name: 'CustomerId',
                    xtype: 'hidden'
                }, {
                    name: 'Customer',
                    xtype: 'textfield',
                    fieldLabel: 'Customer',
                    readOnly: true,
                    allowBlank: false
                },  {
                    name: 'CustomerGroupId',
                    xtype: 'hidden'
                }, {
                    xtype: 'textfield',
                    name: 'CustomerGroup',
                    allowBlank: true,
                    fieldLabel: 'Customer Group',
                    disabled: true,

                    readOnly: true
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    width: 100,
                    allowBlank: false,
                    value: new Date(),
                    maxValue: (new Date()).format('m/d/Y')
                }, {
                    name: 'ValidityDate',
                    xtype: 'datefield',
                    fieldLabel: 'Valid Upto Date',
                    width: 100,
                    allowBlank: false,
                   // value: new Date()
                }, {
                    name: 'PreparedBy',
                    xtype: 'textfield',
                    fieldLabel: 'Prepared By',
                    readOnly: true,
                    allowBlank: false
                },  {
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remark',
                    width:100,
                    height:70,
                    readOnly: false,
                    allowBlank: true,
                },
                ]
            }, {
                columnWidth: .6,
                defaults: {
                    //anchor: '98%',
                    labelStyle: 'text-align:right;',
                    msgTarget: 'side'
                },
                layout: 'form',
                border: false,
                items: [{
                        xtype: 'compositefield',
                        fieldLabel: 'Terms & Conditions',
                        defaults: {
                            //flex: 1
                        },
                        items: [{
                            name: 'TermsAndConditions',
                            xtype: 'htmleditor',
                            fieldLabel: 'Terms & Conditions',
                            readOnly: false,
                            allowBlank: false,
                            height: 304,
                            width:540,
                            enableFont: false,
                            autoScroll: true,
                        },
                             {
                                 xtype: 'button',
                                 iconCls: 'icon-filter',
                                 width: 25,
                                 handler: function () {
                                     var form = Ext.getCmp('quotation-form').getForm();
                                     new Ext.erp.iffs.ux.common.TermAndConditionSelectionWindow({
                                         parentForm: form,
                                         field: 'TermsAndConditions'
                                     }).show();
                                 }
                             }]
                    }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotation.Form, Ext.form.FormPanel);
Ext.reg('quotation-form', Ext.erp.iffs.ux.quotation.Form);

/**
* @desc      Quotation registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.quotation.Window = function (config) {
    Ext.erp.iffs.ux.quotation.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 1200,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        id: 'quotation-window',
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.quotationId != '' && this.quotationId > 0) {
                    Ext.getCmp('quotation-window').actionType = "Edit";
                    this.form.load({ params: { id: this.quotationId } });
                    var grid = Ext.getCmp('quotation-detailGrid');
                    Ext.getCmp('quotation-Save').setDisabled(this.isApproved);                   
                    grid.store.baseParams = { param: Ext.encode({ quotationId: this.quotationId }) };
                    grid.getStore().load({
                        params: {
                            start: 0,
                            limit: grid.pageSize
                        }
                    });
                }
                else if (this.isRevised == true) {
                    Ext.getCmp('quotation-window').actionType = "Revised";
                    var form = Ext.getCmp('quotation-form');
                    form.load({
                        params: { id: this.parentQuotationId },
                        success: function () {
                            var form = Ext.getCmp('quotation-form').getForm();
                            form.findField('Id').setValue(0);
                            form.findField('ParentQuotationId').setValue(parentQuotationId);
                }
                    });
                    var grid = Ext.getCmp('quotation-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { param: Ext.encode({ quotationId: this.parentQuotationId }) };
                    store.load({ params: { start: 0, limit: grid.pageSize } });
                }
                else if (this.isCopy == true) {
                    Ext.getCmp('quotation-window').actionType = "Add";
                    var form = Ext.getCmp('quotation-form');
                    form.load({
                        params: { id: this.parentQuotationId },
                        success: function () {
                           
                            Ext.getCmp('quotation-form').getForm().findField('Id').setValue(0);
                            Ext.getCmp('quotation-form').getForm().findField('CheckedById').setValue(null);
                            Ext.getCmp('quotation-form').getForm().findField('ApprovedById').setValue(null);
                            Ext.getCmp('quotation-form').getForm().findField('QuotationNo').setValue("Auto-Genereted");
                   
                        }
                    });
                    var grid = Ext.getCmp('quotation-detailGrid');
                    var store = grid.getStore();
                    store.baseParams = { param: Ext.encode({ quotationId: this.parentQuotationId }) };
                    store.load({ params: { start: 0, limit: grid.pageSize } });
                }
                else {
                   Ext.getCmp('quotation-window').actionType = "Add";
                   Ext.getCmp('quotation-form').getForm().findField('ParentQuotationId').reset();
                   this.form.getForm().findField('Id').setValue(this.quotationId);
                   this.form.refreshForm();

                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotation.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.quotation.Form(          
            );
        this.grid = new Ext.erp.iffs.ux.quotation.DetailGrid(         
            );
        this.items = [this.form, this.grid];
        this.buttons = [{
            text: 'Save',
            iconCls: 'icon-save',
            id:"quotation-Save",
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
        Ext.erp.iffs.ux.quotation.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var detailGrid = Ext.getCmp('quotation-detailGrid');
        var store = detailGrid.getStore();
        var action = Ext.getCmp('quotation-window').actionType;
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
                errorMessage = "please enter UnitPrice";

            records = records + item.data['Id'] + ':' +
                                item.data['OperationTypeId'] + ':' +
                                item.data['CurrencyId'] + ':' +
                                item.data['Quantity'] + ':' +
                                item.data['QuotationId'] + ':' +
                                item.data['Remark'] + ':' +
                                item.data['ServiceUnitTypeId'] + ':' +
                                item.data['UnitPrice'] + ':' +                          
                                item.data['ServiceId'] + ':' +
                                item.data['ServiceDescription'] + ':' +
                                item.data['ComparingSign'] + ':' +
                                item.data['ServiceRequestDetailId'] + ';';
            

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
        var termandConditon = this.form.getForm().findField('TermsAndConditions').getValue();

        this.form.getForm().findField('TermsAndConditions').setValue('')
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            params: { record: Ext.encode({ services: records, action: action }) },
            success: function (form, action) {
                if (typeof termandConditon != "undefined" && termandConditon != "")
                {
                  
                    Quotation.SaveTermAndCondition(termandConditon, action.result.quotationId, function (result) {
                        if (result.success) {
                            Ext.MessageBox.show({
                                title: 'Success',
                                msg: "Term and Condition is successfully saved",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.SUCCESS,
                                scope: this
                            });
                        }
                        else
                        {
                            Ext.MessageBox.show({
                                title: 'error',
                                msg: "Error in saving Term and Condition",
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.SUCCESS,
                                scope: this
                            });
                        }
                    });
                  
                }
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.SUCCESS,
                    scope: this
                });
                Ext.getCmp('quotation-form').getForm().reset();
                Ext.getCmp('quotation-paging').doRefresh();
                var Grid = Ext.getCmp('quotation-detailGrid').getStore().removeAll();
            },
            failure: function (form, action) {
                Ext.getCmp('quotation-form').getForm().findField('TermsAndConditions').setValue(termandConditon);
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
Ext.reg('quotation-window', Ext.erp.iffs.ux.quotation.Window);

/**
* @desc      Quotation grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.quotation.Grid = function (config) {
    Ext.erp.iffs.ux.quotation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: Quotation.GetAll,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|param',
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                fields: ['Id', 'QuotationNo', 'PrevQuotationNumber', 'ValidityDate', 'PreparedBy', 'Customer', 'Date', 'Status', 'NetPay', 'IsAccepted', 'IsChecked', 'IsApproved', 'Version', 'ApprovedBy', 'ApprovalDate', 'CheckedBy', 'PreparedDate', 'CheckedDate'],
            }),
            groupField: 'QuotationNo',
            sortInfo: {
                field: 'QuotationNo',
                direction: 'ASC'
            },

            remoteSort: true
        }),
        view: new Ext.grid.GroupingView({
            //forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Quotation" : "QuotationNo"]})'
        }),
        id: 'quotation-grid',
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
        }, {
            dataIndex: 'OperationTypeId',
            header: 'OperationTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'QuotationNo',
            header: 'Quotation Number',
            sortable: true,
            hidden:true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PrevQuotationNumber',
            header: 'Prev Quotation Number',
            sortable: true,
            hidden: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Version',
            header: 'Version',
            sortable: true,
            width: 100,
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
        }, {
            dataIndex: 'ValidityDate',
            header: 'Validity Date',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
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
        }, {
            dataIndex: 'IsAccepted',
            header: 'Quotation Status',
            sortable: true,
            width: 250,
            hidden: false,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        },]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'quotation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.quotation.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.quotation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('quotation-grid', Ext.erp.iffs.ux.quotation.Grid);


/**
* @desc      Quotation detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.quotation.DetailGrid = function (config) {
    Ext.erp.iffs.ux.quotation.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Quotation.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationTypeId', 'ComparingSign','ServiceRequestDetailId', 'OperationType', 'ServiceDescription', 'CurrencyId', 'Currency', 'Quantity', 'QuotationId', 'Remark', 'ServiceUnitTypeId', 'ServiceUnitType', 'UnitPrice', 'ServiceId', 'Service'],
            remoteSort: true
        }),

        id: 'quotation-detailGrid',
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
            dataIndex: 'QuotationId',
            header: 'QuotationId',
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
        }, {
            dataIndex: 'OperationTypeId',
            header: 'Operation Type',
            sortable: true,
            width: 100,
            hidden:true,
            menuDisabled: true
        },  {
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,
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
                        var grid = Ext.getCmp('quotation-detailGrid');
                        var selectedrecord = grid.getSelectionModel().getSelected();
                         selectedrecord.set('CurrencyId', rec.id);

                    },
                }
            })
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
                        var grid = Ext.getCmp('quotation-detailGrid');
                        var selectedrecord = grid.getSelectionModel().getSelected();
                        selectedrecord.set('ServiceUnitTypeId', rec.id);


                    },
                }
            })
        }, {
            dataIndex: 'ComparingSign',
            header: 'Qty Sign',
            sortable: true,
            width: 110,
            menuDisabled: true,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                mode: 'local',
                editable: true,
                forceSelection: true,
                store: new Ext.data.ArrayStore({
                    fields: ['Id', 'Name'],
                    idProperty: 'Id',
                    data: [
                        [1, '='],
                        [2, '+'],
                        [3, '-']

                    ]
                }),
                valueField: 'Name',
                displayField: 'Name'
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
Ext.extend(Ext.erp.iffs.ux.quotation.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({operationTypeId:this.operationTypeId }) };
        this.tbar = [
            {
                id: 'remove-quotationDetail',
                iconCls: 'icon-delete',
                text: 'Remove Item',
                handler: function () {
                    var grid = Ext.getCmp('quotation-detailGrid');
                    if (!grid.getSelectionModel().hasSelection()) return;
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.getStore().remove(selectedrecord);
                }
            }, {
                id: 'select-quotationDetail',
                iconCls: 'icon-accept',
                text: 'Select Item',
                handler: function () {

                    var grid = Ext.getCmp('quotation-detailGrid');
                    var selectedrecord = grid.getSelectionModel().getSelected();
                    grid.selectedrecord = selectedrecord;

                }
            }, {
                id: 'move-quotationDetail',
                iconCls: 'icon-accept',
                text: 'Move Item',
                handler: function () {
                    


                    var grid = Ext.getCmp('quotation-detailGrid');
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
            '->',
            {
                iconCls: 'icon-edit',
                disabled: false,
                text: 'Load Term & Condition',
                handler: function () {
                    var form = Ext.getCmp('quotation-form').getForm();
                    var id = form.findField('Id').getValue();

                    Quotation.GetTermAndCondition(id, function (result) {
                        if (result.data != "")
                            form.findField('TermsAndConditions').setValue(result.data);
                    }

                    );
                }
            }, {
                id: 'servicePicker-quotationDetail',
                iconCls: 'icon-add',
                disabled: false,
                text: 'Service Picker',
                handler: function () {
                    var grid = Ext.getCmp('quotation-detailGrid');
                    var form = Ext.getCmp('quotation-form').getForm();
                    var customerGroupId = form.findField('CustomerGroupId').getValue();
                    var serviceRequestId = form.findField('ServiceRequestId').getValue();
                     if (typeof serviceRequestId == "undefined" || serviceRequestId == "" ||  serviceRequestId == 0)
                    {
                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: 'please select service request first!',
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.OK,
                            scope: this
                        });
                        return;
                    }
                    var customerGroup = form.findField('CustomerGroup').getValue();

                    new Ext.erp.iffs.ux.common.ServiceItemSelectionWindow({
                        title: 'Load Service',
                        targetGrid: grid,
                        customerGroupId: customerGroupId,
                        serviceRequestId: serviceRequestId,
                        customerGroup: customerGroup,
                        showServicePicker: true,
                        }).show();
                }
            }, {
                id: 'serviceDetail-quotationDetail',
                iconCls: 'icon-add',
                disabled: false,
                text: 'Commodity Info',
                handler: function () {
                    var grid = Ext.getCmp('quotation-detailGrid');
                    var form = Ext.getCmp('quotation-form').getForm();
                    var serviceRequestId = form.findField('ServiceRequestId').getValue();
                    new Ext.erp.iffs.ux.common.CommodityInfoSelectionWindow({
                        title: 'Commodity Info',
                        targetGrid: grid,
                        serviceRequestId: serviceRequestId
                      }).show();
                }
            }

        ];
        Ext.erp.iffs.ux.quotation.DetailGrid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('quotation-detailGrid', Ext.erp.iffs.ux.quotation.DetailGrid);

/**
* @desc      Common registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.quotation.CustomerResponseForm = function (config) {
    Ext.erp.iffs.ux.quotation.CustomerResponseForm.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Quotation.GetCustomerResponse,
            submit: Quotation.SaveCustomerResponse
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'quotation-CustomerResponseForm',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: true,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'IsAccepted',
            checked: true,
            xtype: 'checkbox',
            fieldLabel: 'Is Accepted',
            width: 100,
            readOnly: false,
            allowBlank: true,
            checked: false,
        },
        {
            name: 'CustomerResponseDate',
            xtype: 'datefield',
            fieldLabel: 'Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'CustomerResponseRemark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            height: 70,
            readOnly: false,
            allowBlank: true,
        }]

    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotation.CustomerResponseForm, Ext.form.FormPanel);
Ext.reg('quotation-CustomerResponseForm', Ext.erp.iffs.ux.quotation.CustomerResponseForm);


/**
* @desc      Customer Response window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 16, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.CustomerResponseWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.quotation.CustomerResponseWindow = function (config) {
    Ext.erp.iffs.ux.quotation.CustomerResponseWindow.superclass.constructor.call(this, Ext.apply({
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
            this.form.getForm().findField('Id').setValue(this.quotationId);
            if (this.quotationId != '') {
                this.form.load({ params: { id: this.quotationId } });
            }
        },
        scope: this
    }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.quotation.CustomerResponseWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.quotation.CustomerResponseForm();
        this.items = [this.form];
        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Save',
            iconCls: 'icon-save',
            scope: this,
            handler: this.onSave
        }, {
            xtype: 'tbseparator'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.quotation.CustomerResponseWindow.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var window = this;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                Ext.getCmp('quotation-CustomerResponseForm').getForm().reset();
                Ext.getCmp('quotation-paging').doRefresh();
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.OK,
                    scope: this
                });
                window.close();
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
Ext.reg('Common-customerResponseWindow', Ext.erp.iffs.ux.quotation.CustomerResponseWindow);

/**
* @desc      Quotation Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.quotation
* @class     Ext.erp.iffs.ux.quotation.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.quotation.Panel = function (config) {
    Ext.erp.iffs.ux.quotation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [
                {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Copy',
                id: 'copyQuotatioin',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanAdd'),
                handler: this.onCopy
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Revise',
                id: 'reviseQuotatioin',
                iconCls: 'icon-refresh',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanEdit'),
                handler: this.onRevise
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewQuotation',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Customer Response',
                id: 'customerResponseQuotation',
                iconCls: 'icon-accept',
                handler: this.onCustomerResponse
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'textfield',
                id:"quotation.searchText",
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
                            var grid = Ext.getCmp('quotation-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('quotation-grid');
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
                    var searchText = Ext.getCmp('quotation.searchText').getValue();
                    window.open('Quotation/ExportToExcel?st=' + searchText, '', '');
                }
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'button',
                text: 'Check',
                iconCls: 'icon-select',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanCertify'),
                handler: this.onCheck
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Approve',
                iconCls: 'icon-accept',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Quotation', 'CanApprove'),
                handler: this.onApprove
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.quotation.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.quotation.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.quotation.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.quotation.Window({
            quotationId: 0,
            operationTypeId:0,
            title: 'Add Quotation'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('quotation-grid');
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
        var isApproved = grid.getSelectionModel().getSelected().get('IsApproved');

          new Ext.erp.iffs.ux.quotation.Window({
              quotationId: id,
              isApproved:isApproved,
            title: 'Edit Quotation'
        }).show();
    },
    onCopy: function () {
        var grid = Ext.getCmp('quotation-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var quotationNo = grid.getSelectionModel().getSelected().get('QuotationNo');
        new Ext.erp.iffs.ux.quotation.Window({
            isCopy: true,
            parentQuotationId: id,
            title: 'Copy Quotation'
        }).show();
    },
    onRevise: function () {
        var grid = Ext.getCmp('quotation-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var quotationNo = grid.getSelectionModel().getSelected().get('QuotationNo');
        new Ext.erp.iffs.ux.quotation.Window({
            isRevised: true,
            parentQuotationId: id,
            parentQuotationNo: quotationNo,
            title: 'Revise Quotation'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('quotation-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewQuote&id=' + id + '&showTotalDetail=' + false, 'PreviewQuote', parameter);
    },
    onCustomerResponse: function () {
        var grid = Ext.getCmp('quotation-grid');
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
        new Ext.erp.iffs.ux.quotation.CustomerResponseWindow({
            quotationId: id,
            title: 'Customer Response'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('quotation-grid');
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
                    Quotation.Delete(id, function (result, response) {
                        Ext.getCmp('quotation-paging').doRefresh();
                    }, this);
                }
            }
        });
    },
    onCheck: function () {
        var grid = Ext.getCmp('quotation-grid');
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
                        cmpPaging: Ext.getCmp('quotation-paging'),
                        api: {
                            submit: Quotation.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('quotation-grid');
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
                        cmpPaging: Ext.getCmp('quotation-paging'),
                        api: {
                            submit: Quotation.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    }
});
Ext.reg('quotation-panel', Ext.erp.iffs.ux.quotation.Panel);