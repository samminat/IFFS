Ext.ns('Ext.erp.iffs.ux.containerStatusTemplate');
/**
* @desc      ContainerStatusTemplate registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.containerStatusTemplate
* @class     Ext.erp.iffs.ux.containerStatusTemplate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.containerStatusTemplate.Form = function (config) {
    Ext.erp.iffs.ux.containerStatusTemplate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Container.GetStatusTemplate,
            submit: Container.SaveStatusTemplate
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'containerStatusTemplate-form',
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
            hiddenName: 'ContainerStatusType',
            xtype: 'combo',
            fieldLabel: 'Status Type',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: false,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                data: [
                    ['IncomingStatus', 'Incoming Status'],
                    ['ReturnStatus', 'Return Status']
                ]
            }),
            valueField: 'Id',
            displayField: 'Name'
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
Ext.extend(Ext.erp.iffs.ux.containerStatusTemplate.Form, Ext.form.FormPanel);
Ext.reg('containerStatusTemplate-form', Ext.erp.iffs.ux.containerStatusTemplate.Form);

/**
* @desc      ContainerStatusTemplate registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.containerStatusTemplate
* @class     Ext.erp.iffsux.containerStatusTemplate.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.containerStatusTemplate.Window = function (config) {
    Ext.erp.iffs.ux.containerStatusTemplate.Window.superclass.constructor.call(this, Ext.apply({
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
                var form = Ext.getCmp('containerStatusTemplate-form').getForm();
                form.findField('Id').setValue(this.containerStatusTemplateId);
              
                if (this.containerStatusTemplateId > 0) {
                    this.form.load({
                        params: { id: this.containerStatusTemplateId },
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
Ext.extend(Ext.erp.iffs.ux.containerStatusTemplate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.containerStatusTemplate.Form();
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
        Ext.erp.iffs.ux.containerStatusTemplate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        var operationTypeId = Ext.getCmp('containerStatusTemplate-OperationTypeId').getValue();
        this.form.getForm().findField('OperationTypeId').setValue(operationTypeId);

         this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('containerStatusTemplate-form').getForm().reset();
                Ext.getCmp('containerStatusTemplate-paging').doRefresh();
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
Ext.reg('containerStatusTemplate-window', Ext.erp.iffs.ux.containerStatusTemplate.Window);

/**
* @desc      ContainerStatusTemplate grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.containerStatusTemplate
* @class     Ext.erp.iffs.ux.containerStatusTemplate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.containerStatusTemplate.Grid = function (config) {
    Ext.erp.iffs.ux.containerStatusTemplate.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Container.GetAllStatusTemplate,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },
            fields: ['Id', 'ContainerStatusType', 'Code', 'Name', 'Description', 'DataTypeId', 'DataType', 'RoleId', 'Role'],
            remoteSort: true
        }),
        id: 'containerStatusTemplate-grid',
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
            dataIndex: 'ContainerStatusType',
            header: 'Status Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
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
            dataIndex: 'Role',
            header: 'Role',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.containerStatusTemplate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'containerStatusTemplate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.containerStatusTemplate.Grid.superclass.initComponent.apply(this, arguments);
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
Ext.reg('containerStatusTemplate-grid', Ext.erp.iffs.ux.containerStatusTemplate.Grid);


/**
* @desc      ContainerStatusTemplate panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.containerStatusTemplate
* @class     Ext.erp.iffs.ux.containerStatusTemplate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.containerStatusTemplate.Panel = function (config) {
    Ext.erp.iffs.ux.containerStatusTemplate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [
                'Operation Type:', {
                hiddenName: 'OperationTypeId',
                xtype: 'combo',
                id: 'containerStatusTemplate-OperationTypeId',
                fieldLabel: 'Operation Type',
                triggerAction: 'all',
                mode: 'local',
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
                    api: { read: Iffs.GetOperationType },
                }),
                valueField: 'Id',
                displayField: 'Name',
                listeners: {
                    select: function (cmb, rec, idx) {
                        var detailGrid = Ext.getCmp('containerStatusTemplate-grid');
                        detailGrid.store.baseParams = { param: Ext.encode({ operationTypeId: rec.id, }) };
                        detailGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: detailGrid.pageSize
                            }
                        });
                    }
                }
            }, {
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container Status Template', 'CanAdd'),
                handler: this.onAddClick
            },  {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container Status Template', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container Status Template', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.containerStatusTemplate.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'containerStatusTemplate-grid',
            id: 'containerStatusTemplate-grid'
        }];
        Ext.erp.iffs.ux.containerStatusTemplate.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.containerStatusTemplate.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        var operationTypeId = Ext.getCmp('containerStatusTemplate-OperationTypeId').getValue();
        if (!operationTypeId > 0) {
            Ext.MessageBox.show({
                title: 'Save failed',
                msg: "Please select operation type first", buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR,
                scope: this
            });
            return;
        }
        new Ext.erp.iffs.ux.containerStatusTemplate.Window({
            containerStatusTemplateId: 0,
            title: 'Add Operation Status Template'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('containerStatusTemplate-grid');
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
        new Ext.erp.iffs.ux.containerStatusTemplate.Window({
            containerStatusTemplateId: id,
            title: 'Edit Operation Status Template'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('containerStatusTemplate-grid');
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
                    Container.DeleteStatusTemplate(id, function (result, response) {
                        Ext.getCmp('containerStatusTemplate-paging').doRefresh();
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
Ext.reg('containerStatusTemplate-panel', Ext.erp.iffs.ux.containerStatusTemplate.Panel);
