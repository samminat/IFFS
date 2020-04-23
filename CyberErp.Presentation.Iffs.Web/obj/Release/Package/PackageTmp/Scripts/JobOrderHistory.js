Ext.ns('Ext.erp.iffs.ux.jobOrderHistory');

/**
* @desc      jobOrderHistoryTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderHistory
* @class     Ext.erp.iffs.ux.jobOrderHistory.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.jobOrderHistory.Form = function (config) {
    Ext.erp.iffs.ux.jobOrderHistory.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.JobOrderHistory.Get
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'jobOrderHistory-form',
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
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'ParentjobOrderHistoryId'
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
                    readOnly: true,
                    disabled: true,
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
                            var grid = Ext.getCmp('jobOrderHistory-detailGrid');
                            var store = grid.getStore();
                            store.baseParams = { record: Ext.encode({ operationTypeId: operationid, source: "New" }) };
                            store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }, {
                    xtype: 'hidden',
                    name: 'QuotationRecs'
                }, {
                    name: 'Quotations',
                    xtype: 'textarea',
                    fieldLabel: 'Quotations',
                    allowBlank: false,
                    disabled: true,
                    readOnly: true
                }, {
                    name: 'JobOrderNo',
                    xtype: 'textfield',
                    fieldLabel: 'Job Order No',
                    width: 100,
                    allowBlank: false,
                    disabled: true,
                    readOnly: true
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
                    allowBlank: false
                }, {
                    name: 'UltimateClient',
                    xtype: 'textfield',
                    fieldLabel: 'Ultimate Client',
                    width: 100,
                    allowBlank: false
                }, {
                    hiddenName: 'Status',
                    xtype: 'combo',
                    fieldLabel: 'Status',
                    triggerAction: 'all',
                    mode: 'local',
                    editable: false,
                    disabled: true,
                    readOnly: true,
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
                    disabled: true,
                    readOnly: true,
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'ContactPersonLocal',
                    xtype: 'textarea',
                    fieldLabel: 'Contact Person(Local)',
                    disabled: true,
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'ContactPersonForeign',
                    xtype: 'textarea',
                    fieldLabel: 'Contact Person(Fore.)',
                    disabled: true,
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'IsViewed',
                    xtype: 'checkbox',
                    fieldLabel: 'IsViewed',
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'Remark',
                    xtype: 'textarea',
                    fieldLabel: 'Remarks',
                    disabled: true,
                    allowBlank: true
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderHistory.Form, Ext.form.FormPanel);
Ext.reg('jobOrderHistory-form', Ext.erp.iffs.ux.jobOrderHistory.Form);


/**
* @desc      jobOrderHistoryTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.jobOrderHistory
* @class     Ext.erp.iffsux.jobOrderHistory.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.jobOrderHistory.Window = function (config) {
    Ext.erp.iffs.ux.jobOrderHistory.Window.superclass.constructor.call(this, Ext.apply({
        width: 900,
        height: 560,
        layout: 'hbox',
        bodyStyle: 'margin: 5px; padding-right: 10px',
        align: 'stretch',
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        listeners: {
            show: function () {
                
                var grid = Ext.getCmp('jobOrderHistory-grid');
                var store = grid.getStore();
                store.baseParams = { record: Ext.encode({ jobOrderId: this.jobOrderId }) };
                store.load({ params: { start: 0, limit: grid.pageSize } });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderHistory.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.jobOrderHistory.Form();
        this.gridHeader = new Ext.erp.iffs.ux.jobOrderHistory.Grid();
        this.gridDetail = new Ext.erp.iffs.ux.jobOrderHistory.GridDetail();

        this.items = [{
            xtype: 'panel',
            width: 300,
            height: 500,
            layout: 'fit',
            bodyStyle: 'background:transparent',
            flex: 1,
            items: [this.gridHeader]
        }, {
            xtype: 'panel',
            width: 10,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1
        }, {
            xtype: 'panel',
            layout: 'vbox',
            height: 500,
            width: 570,
            bodyStyle: 'background:transparent',
            border: false,
            flex: 1,
            align: 'stretch',
            items: [{
                xtype: 'panel',
                height: 260,
                layout: 'fit',
                width: 565,
                autoScroll: true,
                bodyStyle: 'background:transparent; padding-top: 10px;',
                flex: 1,
                items: [this.form]
            }, {
                xtype: 'panel',
                layout: 'fit',
                width: 565,
                height: 240,
                bodyStyle: 'background:transparent',
                flex: 1,
                items: [this.gridDetail]
            }]
        }];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.jobOrderHistory.Window.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {
        this.close();
    },
});
Ext.reg('jobOrderHistory-window', Ext.erp.iffs.ux.jobOrderHistory.Window);

/**
* @desc      JobOrderTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderHistory
* @class     Ext.erp.iffs.ux.jobOrderHistory.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderHistory.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrderHistory.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderHistory.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Version',
                direction: 'ASC'
            },
            fields: ['Id', 'Version'],
            remoteSort: true
        }),
        id: 'jobOrderHistory-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            autoFill: true,
            emptyText: 'No version history to display'
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            rowClick: function () {
                this.loadForm();
                this.loadVoucherDetail();
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
            dataIndex: 'Version',
            header: 'Version',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderHistory.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        //this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderHistory-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderHistory.Grid.superclass.initComponent.apply(this, arguments);
    },
    loadForm: function () {
        if (!this.getSelectionModel().hasSelection()) return;
        var form = Ext.getCmp('jobOrderHistory-form');
        var id = this.getSelectionModel().getSelected().get('Id');
        form.load({
            params: { id: id }
        });
    },
    loadVoucherDetail: function () {
        var voucherDetailGrid = Ext.getCmp('jobOrderHistory-detailGrid');
        var voucherDetailStore = voucherDetailGrid.getStore();
        var voucherHeaderId = 0;
        if (this.getSelectionModel().hasSelection()) {
            voucherHeaderId = this.getSelectionModel().getSelected().get('Id');
        }
        voucherDetailStore.baseParams = { record: Ext.encode({ jobOrderId: voucherHeaderId }) };
        voucherDetailStore.load({
            params: { start: 0, limit: 100 }
        });
    }
});
Ext.reg('jobOrderHistory-grid', Ext.erp.iffs.ux.jobOrderHistory.Grid);


/**
* @desc      PurchaseOrder grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderHistory
* @class     Ext.erp.iffs.ux.jobOrderHistory.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.jobOrderHistory.GridDetail = function (config) {
    Ext.erp.iffs.ux.jobOrderHistory.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderHistory.GetGridDetails,
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
                    Ext.getCmp('jobOrderHistory-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('jobOrderHistory-detailGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('jobOrderHistory-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrderHistory-detailGrid',
        pageSize: 10,
        clicksToEdit: 1,
        height: 350,
        columnLines: true,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        //sm: jobOrderSM,
        viewConfig: {
            forceFit: true,
            autoFill: true
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
            menuDisabled: true
        }, {
            dataIndex: 'Field',
            header: 'Field',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Value',
            header: 'Default Value',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderHistory.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderHistory-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderHistory.GridDetail.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderHistory-detailGrid', Ext.erp.iffs.ux.jobOrderHistory.GridDetail);