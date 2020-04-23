Ext.ns('Ext.erp.iffs.ux.container');
/**
* @desc      DocumentUpload form
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.container
* @class     Ext.erp.iffs.ux.container.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.container.Form = function (config) {
    Ext.erp.iffs.ux.container.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Container.Get,
            submit: Container.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            msgTarget: 'side'
        },
        id: 'container-form',
        labelWidth: 100,
        autoHeight: true,
        border: false,
        padding: 5,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'OperationId',
            xtype: 'hidden'
        }, {
            name: 'ContainerNo',
            xtype: 'textfield',
            fieldLabel: 'Container No',
            allowBlank: false
        }, {
            hiddenName: 'ContainerTypeId',
            xtype: 'combo',
            fieldLabel: 'Container Type',
            triggerAction: 'all',
            mode: 'remote',
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
                api: { read: Iffs.GetContainerType }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            hiddenName: 'Description',
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
                idProperty: 'Id',
                data: [
                    ['COC', 'COC'],
                    ['SOC', 'SOC'],
                    ['LCL', 'LCL'],
                    ['FCL', 'FCL']
                ]
            }),
            valueField: 'Id',
            displayField: 'Name',
        }, {
            name: 'Quantity',
            xtype: 'numberfield',
            fieldLabel: 'Quantity',
            allowBlank: false
        }, {
            name: 'NetWeight',
            xtype: 'numberfield',
            fieldLabel: 'Net Weight',
            allowBlank: true
        }, {
            name: 'GracePeriod',
            xtype: 'numberfield',
            fieldLabel: 'Grace Period',
            allowBlank: true
        }, {
            name: 'Charge20',
            xtype: 'numberfield',
            fieldLabel: 'Charge 20',
            allowBlank: true
        }, {
            name: 'Charge40',
            xtype: 'numberfield',
            fieldLabel: 'Charge 40',
            allowBlank: true
        }, {
            name: 'Length',
            xtype: 'numberfield',
            fieldLabel: 'Length',
            allowBlank: true
        }, {
            name: 'Height',
            xtype: 'numberfield',
            fieldLabel: 'Height',
            allowBlank: true
        }, {
            hiddenName: 'CurrencyId',
            xtype: 'combo',
            fieldLabel: 'Currency',
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
                api: { read: Iffs.GetCurrency }
            }),
            valueField: 'Id',
            displayField: 'Name'
        }, {
            name: 'Remark',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            allowBlank: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.container.Form, Ext.form.FormPanel);
Ext.reg('container-form', Ext.erp.iffs.ux.container.Form);

/**
* @desc      Container form host window
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.container
* @class     Ext.erp.iffs.ux.container.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.container.Window = function (config) {
    Ext.erp.iffs.ux.container.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:2px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.containerId);
                if (this.containerId > 0) {
                    this.form.load({
                        params: { id: this.containerId },
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
Ext.extend(Ext.erp.iffs.ux.container.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.container.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
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
        Ext.erp.iffs.ux.container.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = this.form.getForm();
        form.findField('OperationId').setValue(this.operationId);
        if (!form.isValid()) return;
        form.submit({
            waitMsg: 'Please wait...',
            success: function () {
                form.reset();
                Ext.getCmp('container-paging').doRefresh();
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
Ext.reg('container-window', Ext.erp.iffs.ux.container.Window);

/**
* @desc      Container grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.container
* @class     Ext.erp.iffs.ux.container.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.container.Grid = function (config) {
    Ext.erp.iffs.ux.container.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Container.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationTypeId', 'Description', 'OperationId', 'OperationNo', 'ContainerNo', 'ContainerType', 'Quantity', 'NetWeight', 'GracePeriod', 'Charge20', 'Charge40', 'Length', 'Height', 'Currency', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('container-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('container-grid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('container-grid').body.unmask();
                },
                scope: this
            }
        }),
        listeners: {
            rowClick: function () {
                if (!this.getSelectionModel().hasSelection()) return;
                var id = this.getSelectionModel().getSelected().get('Id');
                var operationTypeId = this.getSelectionModel().getSelected().get('OperationTypeId');
                 var description = this.getSelectionModel().getSelected().get('Description');
                if (description == "COC" && operationTypeId == 3)
                    Ext.getCmp('container-returnStatus').setDisabled(false);
                else
                    Ext.getCmp('container-returnStatus').setDisabled(true);
            },
            scope: this
        },
        id: 'container-grid',
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
            dataIndex: 'ContainerNo',
            header: 'Container No',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'ContainerType',
            header: 'Container Type',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Status',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Quantity',
            header: 'Quantity',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NetWeight',
            header: 'Net Weight',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'GracePeriod',
            header: 'Grace Period',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Charge20',
            header: 'Charge 20',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Charge40',
            header: 'Charge 40',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Length',
            header: 'Length',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Height',
            header: 'Height',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: false,
            width: 80,
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
Ext.extend(Ext.erp.iffs.ux.container.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ operationId: 0 }) };

        var containerGrid = this;

        this.tbar = [{
            xtype: 'button',
            text: 'Add',
            iconCls: 'icon-add',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container', 'CanAdd'),
            handler: function () {
                new Ext.erp.iffs.ux.container.Window({
                    containerId: 0,
                    operationId: containerGrid.operationId,
                    title: 'Add Container'
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Edit',
            iconCls: 'icon-edit',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container', 'CanEdit'),
            handler: function () {
                var grid = Ext.getCmp('container-grid');
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
                new Ext.erp.iffs.ux.container.Window({
                    containerId: id,
                    operationId: containerGrid.operationId,
                    title: 'Edit Container'
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Delete',
            iconCls: 'icon-delete',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container', 'CanDelete'),
            handler: function () {
                var grid = Ext.getCmp('container-grid');
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
                    msg: 'Are you sure you want to remove the selected record?',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            var id = grid.getSelectionModel().getSelected().get('Id');
                            Container.Delete(id, function (result) {
                                Ext.getCmp('container-paging').doRefresh();
                                if (!result.success) {
                                    Ext.MessageBox.show({
                                        title: 'Error',
                                        msg: result.data,
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        scope: this
                                    });
                                }
                            }, this);
                        }
                    }
                });
            }
        }, '->', {
            xtype: 'button',
            text: 'Incoming Status',
            iconCls: 'icon-undo',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container', 'CanEdit'),
            handler: function () {
                var grid = Ext.getCmp('container-grid');
                if (!grid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select a container.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var id = grid.getSelectionModel().getSelected().get('Id');
                var operationTypeId = grid.getSelectionModel().getSelected().get('OperationTypeId');

                new Ext.erp.iffs.ux.containerStatus.Window({
                    containerId: id,
                    operationTypeId:operationTypeId,
                    title: 'Incoming Status'
                }).show();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Return Status',
            iconCls: 'icon-redo',
            id:'container-returnStatus',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Container', 'CanEdit'),
            handler: function () {
                var grid = Ext.getCmp('container-grid');
                if (!grid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select a container.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var id = grid.getSelectionModel().getSelected().get('Id');
                var operationTypeId = grid.getSelectionModel().getSelected().get('OperationTypeId');

                new Ext.erp.iffs.ux.containerStatus.Window({
                    containerId: id,
                    operationTypeId: operationTypeId,
                    title: 'Return Status'
                }).show();
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'container-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.container.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('container-grid', Ext.erp.iffs.ux.container.Grid);
