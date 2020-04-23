Ext.ns('Ext.erp.iffs.ux.serviceAgreement');
/**
* @desc      DocumentUpload form
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.serviceAgreement
* @class     Ext.erp.iffs.ux.serviceAgreement.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.serviceAgreement.Form = function (config) {
    Ext.erp.iffs.ux.serviceAgreement.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ServiceAgreement.Get,
            submit: ServiceAgreement.Upload
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            msgTarget: 'side'
        },
        id: 'serviceAgreement-form',
        labelWidth: 90,
        autoHeight: true,
        fileUpload: true,
        frame: true,
        border: false,
        padding: 5,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'AgreementNo',
            xtype: 'textfield',
            fieldLabel: 'Agreement No',
            allowBlank: false
        }, {
            name: 'Date',
            xtype: 'datefield',
            fieldLabel: 'Date',
            width: 100,
            allowBlank: false,
            value: new Date(),
            maxValue: (new Date()).format('m/d/Y')
        }, {
            name: 'CustomerId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Customer',
            xtype: 'combo',
            fieldLabel: 'Customer',
            typeAhead: false,
            hideTrigger: true,
            minChars: 1,
            listWidth: 280,
            mode: 'remote',
            allowBlank: false,
            itemSelected: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                    '{Name}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Code', 'Name']
                }),
                api: { read: Iffs.GetCustomer }
            }),
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('serviceAgreement-form').getForm();
                    form.findField('CustomerId').setValue(rec.id);
                    this.itemSelected = true;
                },
                blur: function (cmb) {
                    var form = Ext.getCmp('serviceAgreement-form').getForm();
                    if (this.getValue() == '') {
                        form.findField('CustomerId').reset();
                    }
                    if (!this.itemSelected) {
                        form.findField('CustomerId').reset();
                        form.findField('Customer').reset();
                    }
                    this.itemSelected = false;
                }
            }
        }, {
            name: 'QuotationId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Quotation',
            xtype: 'combo',
            fieldLabel: 'Quotation',
            typeAhead: false,
            hideTrigger: true,
            minChars: 1,
            listWidth: 280,
            mode: 'remote',
            allowBlank: true,
            tpl: '<tpl for="."><div ext:qtip="{Id}" class="x-combo-list-item">' +
                    '<h3><span></span></h3> {QuotationNo}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'QuotationNo']
                }),
                api: { read: Iffs.GetApprovedQuotations }
            }),
            displayField: 'QuotationNo',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('serviceAgreement-form').getForm();
                    form.findField('QuotationId').setValue(rec.id);
                    this.itemSelected = true;
                },
                blur: function (cmb) {
                    var form = Ext.getCmp('serviceAgreement-form').getForm();
                    if (this.getValue() == '') {
                        form.findField('QuotationId').reset();
                    }
                    if (!this.itemSelected) {
                        form.findField('QuotationId').reset();
                        form.findField('Quotation').reset();
                    }
                    this.itemSelected = false;
                }
            }
        }, {
            xtype: 'fileuploadfield',
            fieldLabel: 'File',
            emptyText: 'Select document',
            name: 'File[]',
            buttonText: 'Browse...',
            multiple: true,
            iconCls: 'icon-browse',
            listeners: {
                'fileselected': function (field, value) {
                    
                }
            }
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            allowBlank: false
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceAgreement.Form, Ext.form.FormPanel);
Ext.reg('serviceAgreement-form', Ext.erp.iffs.ux.serviceAgreement.Form);

/**
* @desc      ServiceAgreement form host window
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.serviceAgreement
* @class     Ext.erp.iffs.ux.serviceAgreement.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.serviceAgreement.Window = function (config) {
    Ext.erp.iffs.ux.serviceAgreement.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 470,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:2px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('serviceAgreement-form').getForm();
                form.findField('Id').setValue(this.serviceAgreementId);
                if (this.serviceAgreementId > 0) {
                    this.form.load({
                        params: { id: this.serviceAgreementId },
                        success: function (form, action) {
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceAgreement.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.serviceAgreement.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onUpload,
            scope: this
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
            },
            scope: this
        }];
        Ext.erp.iffs.ux.serviceAgreement.Window.superclass.initComponent.call(this, arguments);
    },
    onUpload: function () {
        var form = this.form.getForm();
        if (!form.isValid()) return;
        form.submit({
            waitMsg: 'Please wait...',
            success: function () {
                form.reset();
                Ext.getCmp('serviceAgreement-paging').doRefresh();
            },
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Errors',
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
Ext.reg('serviceAgreement-window', Ext.erp.iffs.ux.serviceAgreement.Window);

/**
* @desc      ServiceAgreement grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.serviceAgreement
* @class     Ext.erp.iffs.ux.serviceAgreement.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.serviceAgreement.Grid = function (config) {
    Ext.erp.iffs.ux.serviceAgreement.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ServiceAgreement.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'AgreementNo', 'Date', 'CustomerId', 'Customer', 'QuotationId', 'Quotation', 'AgreementFile', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('serviceAgreement-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('serviceAgreement-grid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('serviceAgreement-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'serviceAgreement-grid',
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'AgreementNo',
            header: 'Agreement No.',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: false,
            width: 300,
            menuDisabled: true
        }, {
            dataIndex: 'Quotation',
            header: 'Quotation No.',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'AgreementFile',
            header: 'Agreement File',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: false,
            width: 300,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceAgreement.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'serviceAgreement-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.serviceAgreement.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.customer.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('serviceAgreement-grid', Ext.erp.iffs.ux.serviceAgreement.Grid);

/**
* @desc      ServiceAgreement panel
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.serviceAgreement
* @class     Ext.erp.iffs.ux.serviceAgreement.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.serviceAgreement.Panel = function (config) {
    Ext.erp.iffs.ux.serviceAgreement.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Agreement', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Agreement', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'serviceAgreement.searchText',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '200px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('serviceAgreement-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('serviceAgreement-grid');
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
                    var searchText = Ext.getCmp('serviceAgreement.searchText').getValue();
                    window.open('ServiceAgreement/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.serviceAgreement.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.serviceAgreement.Grid();
        this.items = [grid];
        Ext.erp.iffs.ux.serviceAgreement.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.serviceAgreement.Window({
            customerId: 0,
            title: 'Service Agreement'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('serviceAgreement-grid');
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
                    ServiceAgreement.Delete(id, function (result, response) {
                        Ext.getCmp('serviceAgreement-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('serviceAgreement-panel', Ext.erp.iffs.ux.serviceAgreement.Panel);