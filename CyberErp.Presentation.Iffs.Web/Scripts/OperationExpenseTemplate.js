Ext.ns('Ext.erp.iffs.ux.operationExpenseTemplate');
/**
* @desc      OperationExpenseTemplate registration form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationExpenseTemplate
* @class     Ext.erp.iffs.ux.operationExpenseTemplate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.operationExpenseTemplate.Form = function (config) {
    Ext.erp.iffs.ux.operationExpenseTemplate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: OperationExpenseTemplate.Get,
            submit: OperationExpenseTemplate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'operationExpenseTemplate-form',
        padding: 5,
        labelWidth: 80,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'OperationTypeId',
            xtype: 'hidden'
        }, {
            hiddenName: 'ExpenseTypeId',
            xtype: 'combo',
            fieldLabel: 'Expense Type',
            triggerAction: 'all',
            mode: 'local',
            forceSelection: true,
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                autoLoad: true,
                api: { read: Iffs.GetExpenseTypes }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationExpenseTemplate.Form, Ext.form.FormPanel);
Ext.reg('operationExpenseTemplate-form', Ext.erp.iffs.ux.operationExpenseTemplate.Form);

/**
* @desc      OperationExpenseTemplate registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationExpenseTemplate
* @class     Ext.erp.iffs.ux.operationExpenseTemplate.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.operationExpenseTemplate.Window = function (config) {
    Ext.erp.iffs.ux.operationExpenseTemplate.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = this.form.getForm();
                form.findField('Id').setValue(this.operationExpenseTemplateId);

                if (this.operationExpenseTemplateId > 0) {
                    this.form.load({
                        params: { id: this.operationExpenseTemplateId },
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
};
Ext.extend(Ext.erp.iffs.ux.operationExpenseTemplate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.operationExpenseTemplate.Form();
        this.items = [this.form];
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
            },
            scope: this
        }];
        Ext.erp.iffs.ux.operationExpenseTemplate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var operationTypeId = Ext.getCmp('operationExpenseTemplate-grid').operationTypeId;
        this.form.getForm().findField('OperationTypeId').setValue(operationTypeId);

        if (!this.form.getForm().isValid()) return;
        
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('operationExpenseTemplate-form').getForm().reset();
                Ext.getCmp('operationExpenseTemplate-paging').doRefresh();
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
Ext.reg('operationExpenseTemplate-window', Ext.erp.iffs.ux.operationExpenseTemplate.Window);

/**
* @desc      OperationExpenseTemplate grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationExpenseTemplate
* @class     Ext.erp.iffs.ux.operationExpenseTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.operationExpenseTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.operationExpenseTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationExpenseTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'ExpenseType',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationType', 'OperationTypeId', 'ExpenseTypeId', 'ExpenseType'],
            remoteSort: true
        }),
        id: 'operationExpenseTemplate-grid',
        operationTypeId: 0,
        loadMask: true,
        pageSize: 30,
        stripeRows: true,
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'ExpenseType',
            header: 'Expense Type',
            sortable: true,
            width: 500,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationExpenseTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ operationTypeId: 0, searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'operationExpenseTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationExpenseTemplate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.operationExpenseTemplate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operationExpenseTemplate-grid', Ext.erp.iffs.ux.operationExpenseTemplate.Grid);

/**
* @desc      OperationExpenseTemplate Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.operationExpenseTemplate
* @class     Ext.erp.iffs.ux.operationExpenseTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.operationExpenseTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.operationExpenseTemplate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Operation Type:', {
                hiddenName: 'OperationTypeId',
                xtype: 'combo',
                triggerAction: 'all',
                mode: 'remote',
                editable: false,
                forceSelection: true,
                emptyText: '---Select---',
                allowBlank: true,
                width: 300,
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
                    'select': function (cmb, rec, idx) {
                        var grid = Ext.getCmp('operationExpenseTemplate-grid');
                        grid.operationTypeId = this.getValue();
                        grid.store.baseParams['param'] = Ext.encode({ operationTypeId: this.getValue(), searchText: '' });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Expense Template', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Expense Template', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Expense Template', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operationExpenseTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.operationExpenseTemplate.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.operationExpenseTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('operationExpenseTemplate-grid');
        if (grid.operationTypeId == 0) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select Operation Type to add.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        new Ext.erp.iffs.ux.operationExpenseTemplate.Window({
            operationExpenseTemplateId: 0,
            operationTypeId:0,
            title: 'Add Operation Expense Template'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('operationExpenseTemplate-grid');
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

        new Ext.erp.iffs.ux.operationExpenseTemplate.Window({
            operationExpenseTemplateId: id,
            title: 'Edit Operation Expense Template'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('operationExpenseTemplate-grid');
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
                    OperationExpenseTemplate.Delete(id, function (result, response) {
                        Ext.getCmp('operationExpenseTemplate-paging').doRefresh();
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
});
Ext.reg('operationExpenseTemplate-panel', Ext.erp.iffs.ux.operationExpenseTemplate.Panel);