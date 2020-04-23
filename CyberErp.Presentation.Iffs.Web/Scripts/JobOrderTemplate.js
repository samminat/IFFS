Ext.ns('Ext.erp.iffs.ux.jobOrderTemplate');

/**
* @desc      JobOrderTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderTemplate
* @class     Ext.erp.iffs.ux.jobOrderTemplate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.jobOrderTemplate.Form = function (config) {
    Ext.erp.iffs.ux.jobOrderTemplate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: JobOrderTemplate.Get,
            submit: JobOrderTemplate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'jobOrderTemplate-form',
        padding: 5,
        labelWidth: 100,
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
            name: 'FieldCategory',
            xtype: 'textfield',
            fieldLabel: 'Field Category',
            allowBlank: true
        }, {
            name: 'Field',
            xtype: 'textfield',
            fieldLabel: 'Field',
            allowBlank: true
        }, {
            name: 'DefaultValue',
            xtype: 'textarea',
            fieldLabel: 'Default Value',
            allowBlank: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderTemplate.Form, Ext.form.FormPanel);
Ext.reg('jobOrderTemplate-form', Ext.erp.iffs.ux.jobOrderTemplate.Form);

/**
* @desc      JobOrderTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.jobOrderTemplate
* @class     Ext.erp.iffsux.jobOrderTemplate.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.jobOrderTemplate.Window = function (config) {
    Ext.erp.iffs.ux.jobOrderTemplate.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 400,
        id: 'jobOrderTemplate-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.operationTemplateId > 0) {
                    this.form.load({
                        params: { id: this.operationTemplateId },
                        success: function (form, action) {
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                    
                }
                else {
                    var operationTypeId = Ext.getCmp('jobOrderTemplate-grid').operationTypeId;
                    this.form.getForm().findField('OperationTypeId').setValue(operationTypeId);
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderTemplate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.jobOrderTemplate.Form();
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
        Ext.erp.iffs.ux.jobOrderTemplate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                Ext.getCmp('jobOrderTemplate-form').getForm().reset();
                Ext.getCmp('jobOrderTemplate-paging').doRefresh();
                
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
        this.close();
    }
});
Ext.reg('jobOrderTemplate-window', Ext.erp.iffs.ux.jobOrderTemplate.Window);

/**
* @desc      JobOrderTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderTemplate
* @class     Ext.erp.iffs.ux.jobOrderTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrderTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderTemplate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'FieldCategory', 'Field', 'DefaultValue'],
            remoteSort: true
        }),
        id: 'jobOrderTemplate-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        operationTypeId: 0,
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
        }, {
            dataIndex: 'OperationTypeId',
            header: 'OperationTypeId',
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
            dataIndex: 'DefaultValue',
            header: 'Default Value',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ operationTypeId: 0, searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderTemplate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.jobOrderTemplate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('jobOrderTemplate-grid', Ext.erp.iffs.ux.jobOrderTemplate.Grid);

/**
* @desc      JobOrderTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.jobOrderTemplate
* @class     Ext.erp.iffs.ux.jobOrderTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.jobOrderTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.jobOrderTemplate.Panel.superclass.constructor.call(this, Ext.apply({
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
                        var grid = Ext.getCmp('jobOrderTemplate-grid');
                        grid.operationTypeId = this.getValue();
                        grid.store.baseParams['param'] = Ext.encode({ operationTypeId: this.getValue(), searchText: '' });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Add',
                id: 'addJobOrderTemplate',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order Template', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editJobOrderTemplate',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order Template', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteJobOrderTemplate',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order Template', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'jobOrderTemplate-grid',
            id: 'jobOrderTemplate-grid'
        }];
        Ext.erp.iffs.ux.jobOrderTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.jobOrderTemplate.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('jobOrderTemplate-grid');
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

        new Ext.erp.iffs.ux.jobOrderTemplate.Window({
            operationTemplateId: 0,
            title: 'Add Job Order Template'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('jobOrderTemplate-grid');
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
        new Ext.erp.iffs.ux.jobOrderTemplate.Window({
            operationTemplateId: id,
            title: 'Edit Job Order Template'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('jobOrderTemplate-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected jobOrderTemplate',
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
                        Ext.getCmp('jobOrderTemplate-paging').doRefresh();
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
Ext.reg('jobOrderTemplate-panel', Ext.erp.iffs.ux.jobOrderTemplate.Panel);


/////////////////////////////////////
var mnuJOTContext = new Ext.menu.Menu({
    items: [{
        id: 'btnJOTInsertRow',
        iconCls: 'icon-RowAdd',
        text: 'Insert Row'
    }],
    listeners: {
        itemclick: function (item) {
            switch (item.id) {
                case 'btnJOTInsertRow':
                    {
                        var grid = Ext.getCmp('jobOrderTemplate-detailGrid');
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