Ext.ns('Ext.erp.iffs.ux.operationExpense');

/**
* @desc      Operation Management grid
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.operationExpense
* @class     Ext.erp.iffs.ux.operationExpense.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.operationExpense.Grid = function (config) {
    Ext.erp.iffs.ux.operationExpense.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationExpense.GetAllOperation,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'Date', 'OperationType', 'Customer', 'OperationNo', 'JobOrderNo', 'OperationTypeId'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'operationExpense-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            rowClick: function () {
                this.loadExpense();
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
            dataIndex: 'OperationTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OperationId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OperationNo',
            header: 'OperationNo',
            sortable: true,
         
            width: 180,
            menuDisabled: true
        }, {
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,

            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Customer',
            header: 'Customer',
            sortable: true,
           
            width: 180,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operationExpense.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.tbar = [{
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
                        var grid = Ext.getCmp('operationExpense-grid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                Keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('operationExpense-grid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'operationExpense-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationExpense.Grid.superclass.initComponent.apply(this, arguments);
    },
    loadExpense: function () {
        var detailGrid = Ext.getCmp('operationExpense-detailGrid');
        var detailStore = detailGrid.getStore();

        var operationId = this.getSelectionModel().getSelected().get('Id');
        var operationTypeId = this.getSelectionModel().getSelected().get('OperationTypeId');

        detailGrid.operationId = operationId;
        detailStore.baseParams = { param: Ext.encode({ operationId: operationId, operationTypeId: operationTypeId }) };
        detailStore.load({
            params: { start: 0, limit: detailGrid.pageSize }
        });
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.operationExpense.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operationExpense-grid', Ext.erp.iffs.ux.operationExpense.Grid);

/**
* @desc      PurchaseOrder grid
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.operationExpense
* @class     Ext.erp.iffs.ux.operationExpense.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.operationExpense.GridDetail = function (config) {
    Ext.erp.iffs.ux.operationExpense.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationExpense.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Expense',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'ExpenseTypeId', 'Expense', 'Amount', 'CurrencyId', 'Currency', 'ExchangeRate'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('operationExpense-detailGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('operationExpense-detailGrid').body.unmask();
                    if (this.store.data.length == 0) {
                        this.addRow();
                    }
                },
                loadException: function () {
                    Ext.getCmp('operationExpense-detailGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'operationExpense-detailGrid',
        pageSize: 10,
        clicksToEdit: 1,
        height: 350,
        operationId: 0,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('operationExpense-gridDetail');
                var store, cm;
                if (e.field == 'Expense') {
                    cm = grid.getColumnModel();
                    var expenseCol = cm.getColumnAt(4);
                    var editor = expenseCol.editor;
                    store = editor.store;
                    if (store.data.length == 0) {
                        record.set('Expense', e.originalValue);
                    }
                    else {
                        var expenseId = store.getById(editor.getValue()).data.Id;

                        record.set('ExpenseTypeId', expenseId);
                    }
                }
            }
        },
        viewConfig: {
            autoFill: true
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
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ExpenseTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }
        , new Ext.grid.RowNumberer(), {
            dataIndex: 'Expense',
            header: 'Expense',
            sortable: true,
            width: 200,
            menuDisabled: true,
        }, {
            dataIndex: 'CurrencyId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }
        , {
            dataIndex: 'Currency', header: 'Currency', sortable: false, width: 50, menuDisabled: true,
            editor: new Ext.form.ComboBox({
                xtype: 'combo',
                triggerAction: 'all',
                mode: 'remote',
                editable: false,
                forceSelection: true,
                emptyText: '---Select---',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name', ]
                    }),
                    autoLoad: true,
                    api: { read: Iffs.GetCurrency }
                }),
                valueField: 'Name',
                displayField: 'Name',
                listeners: {
                    select: function (combo, record, index) {
                        var grid = Ext.getCmp('operationExpense-detailGrid');
                        var selectedrecord = grid.getSelectionModel().getSelected();
                        selectedrecord.set("CurrencyId", record.id);
                        rec.commit();

                    }
                }

            })
        },{
            dataIndex: 'Amount',
            header: 'Amount',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
                disabled: false, allowBlank: false, decimalPrecision: 2,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        },{
            dataIndex: 'ExchangeRate',
            header: 'Exchange Rate',
            sortable: true,
            width: 100,
            menuDisabled: true,
            editor: new Ext.form.NumberField({
                disabled: false, allowBlank: true, decimalPrecision: 2,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationExpense.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Save',
            id: 'saveOperationExpense',
            iconCls: 'icon-save',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Expense', 'CanAdd'),
            handler: this.onSaveClick
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'operationExpense-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationExpense.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    onSaveClick: function () {
        var gridDetail = Ext.getCmp('operationExpense-detailGrid');
        var rec = '';
        var store = gridDetail.getStore();
        var operationId = gridDetail.operationId;
        store.each(function (item) {
            if (item.data['Amount'] != '' && item.data['Amount'] >0) {            
                rec = rec + item.data['ExpenseTypeId'] + ':' + item.data['CurrencyId'] + ':' + item.data['ExchangeRate'] + ':'
                    + item.data['Amount'] + ';';
            }
        });

        if (rec.length == 0) {
            Ext.MessageBox.show({
                title: 'Incomplete',
                msg: 'Expense details cannot be empty!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        OperationExpense.SaveExpense(operationId, rec, function (result) {
            if (result.success) {
                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
                return;
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
                return;
            }
        });
    },
    addRow: function () {
        var grid = Ext.getCmp('operationExpense-detailGrid');
        var store = grid.getStore();
        var opExpense = store.recordType;
        var operationexpense = new opExpense({
            Expense: '',
            Value: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, operationexpense);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    }
});
Ext.reg('operationExpense-detailGrid', Ext.erp.iffs.ux.operationExpense.GridDetail);

/**
* @desc      operationExpense panel
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.operationExpense
* @class     Ext.erp.iffs.ux.operationExpense.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.operationExpense.Panel = function (config) {
    Ext.erp.iffs.ux.operationExpense.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'operationExpense-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationExpense.Panel, Ext.Panel, {
    initComponent: function () {
        this.gridDetail = new Ext.erp.iffs.ux.operationExpense.GridDetail();
        this.grid = new Ext.erp.iffs.ux.operationExpense.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.grid]
            }, {
                region: 'east',
                border: true,
                collapsible: false,
                split: true,
                width: 700,
                minSize: 200,
                maxSize: 700,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.gridDetail]
            }]
        }];
        Ext.erp.iffs.ux.operationExpense.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('operationExpense-panel', Ext.erp.iffs.ux.operationExpense.Panel);