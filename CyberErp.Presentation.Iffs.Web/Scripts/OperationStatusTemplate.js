Ext.ns('Ext.erp.iffs.ux.operationStatusTemplate');
/**
* @desc      OperationStatusTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.operationStatusTemplate
* @class     Ext.erp.iffs.ux.operationStatusTemplate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.operationStatusTemplate.Form = function (config) {
    Ext.erp.iffs.ux.operationStatusTemplate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: OperationStatusTemplate.Get,
            submit: OperationStatusTemplate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'operationStatusTemplate-form',
        padding: 5,
        labelWidth: 130,
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
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        }, {
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false
        }, {
            name: 'Description',
            xtype: 'textfield',
            fieldLabel: 'Description',
            allowBlank: true
        }, {
            name: 'PlannedDuration',
            xtype: 'numberfield',
            fieldLabel: 'Planned Duration(days)',
            anchor: '60%',
            allowBlank: true
        }, {
            hiddenName: 'DataTypeId',
            xtype: 'combo',
            fieldLabel: 'Data Type',
            triggerAction: 'all',
            anchor: '60%',
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
                api: { read: Iffs.GetDataTypes }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'RoleId',
            xtype: 'combo',
            fieldLabel: 'Role',
            triggerAction: 'all',
            anchor: '60%',
            mode: 'local',
            forceSelection: true,
            allowBlank: false,
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    root: 'data',
                    fields: ['RoleId', 'Name']
                }),
                autoLoad: true,
                api: { read: Iffs.GetRoleSettings }
            }),
            valueField: 'RoleId',
            displayField: 'Name'
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operationStatusTemplate.Form, Ext.form.FormPanel);
Ext.reg('operationStatusTemplate-form', Ext.erp.iffs.ux.operationStatusTemplate.Form);

/**
* @desc      OperationStatusTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.operationStatusTemplate
* @class     Ext.erp.iffsux.operationStatusTemplate.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.operationStatusTemplate.Window = function (config) {
    Ext.erp.iffs.ux.operationStatusTemplate.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 600,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var form = Ext.getCmp('operationStatusTemplate-form').getForm();
                form.findField('Id').setValue(this.operationStatusTemplateId);

                if (this.operationStatusTemplateId > 0) {
                    this.form.load({
                        params: { id: this.operationStatusTemplateId },
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
Ext.extend(Ext.erp.iffs.ux.operationStatusTemplate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.operationStatusTemplate.Form();
        this.items = [this.form];

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
        this.tools = [{
            id: 'refresh',
            qtip: 'Reset',
            handler: function () {
                this.form.getForm().reset();
            },
            scope: this
        }];
        Ext.erp.iffs.ux.operationStatusTemplate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var operationTypeId = Ext.getCmp('operationStatusTemplate-grid').operationTypeId;
        this.form.getForm().findField('OperationTypeId').setValue(operationTypeId);
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('operationStatusTemplate-form').getForm().reset();
                Ext.getCmp('operationStatusTemplate-paging').doRefresh();
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
Ext.reg('operationStatusTemplate-window', Ext.erp.iffs.ux.operationStatusTemplate.Window);

/**
* @desc      OperationStatusTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.operationStatusTemplate
* @class     Ext.erp.iffs.ux.operationStatusTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.operationStatusTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.operationStatusTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationStatusTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationType', 'OperationTypeId', 'Code', 'Name', 'Description', 'DataTypeId', 'DataType', 'PlannedDuration', 'RoleId', 'Role'],
            remoteSort: true
        }),
        id: 'operationStatusTemplate-grid',
        operationTypeId: 0,
        loadMask: true,
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            forceFit: true,
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
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DataType',
            header: 'Data Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PlannedDuration',
            header: 'Planned Duration',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Role',
            header: 'Role',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operationStatusTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ operationTypeId: 0, searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'operationStatusTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operationStatusTemplate.Grid.superclass.initComponent.apply(this, arguments);
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
Ext.reg('operationStatusTemplate-grid', Ext.erp.iffs.ux.operationStatusTemplate.Grid);


/**
* @desc      OperationStatusTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.operationStatusTemplate
* @class     Ext.erp.iffs.ux.operationStatusTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.operationStatusTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.operationStatusTemplate.Panel.superclass.constructor.call(this, Ext.apply({
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
                        var grid = Ext.getCmp('operationStatusTemplate-grid');
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
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Status Template', 'CanAdd'),
                handler: this.onAddClick
            },  {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Status Template', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Operation Status Template', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operationStatusTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'operationStatusTemplate-grid',
            id: 'operationStatusTemplate-grid'
        }];
        Ext.erp.iffs.ux.operationStatusTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.operationStatusTemplate.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('operationStatusTemplate-grid');
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
        new Ext.erp.iffs.ux.operationStatusTemplate.Window({
            operationStatusTemplateId: 0,
            title: 'Add Operation Status Template'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('operationStatusTemplate-grid');
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
        new Ext.erp.iffs.ux.operationStatusTemplate.Window({
            operationStatusTemplateId: id,
            title: 'Edit Operation Status Template'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('operationStatusTemplate-grid');
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
            msg: 'Are you sure you want to delete the selected Operation Status Template',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    OperationStatusTemplate.Delete(id, function (result, response) {
                        Ext.getCmp('operationStatusTemplate-paging').doRefresh();
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
Ext.reg('operationStatusTemplate-panel', Ext.erp.iffs.ux.operationStatusTemplate.Panel);
