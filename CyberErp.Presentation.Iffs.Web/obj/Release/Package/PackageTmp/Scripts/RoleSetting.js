Ext.ns('Ext.erp.iffs.ux.roleSetting');
/**
* @desc      RoleSetting registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.roleSetting
* @class     Ext.erp.iffs.ux.roleSetting.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.roleSetting.Form = function (config) {
    Ext.erp.iffs.ux.roleSetting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: RoleSetting.Get,
            submit: RoleSetting.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'roleSetting-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'RoleId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Role',
            xtype: 'combo',
            fieldLabel: 'Role',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            mode: 'remote',
            allowBlank: false,
            itemSelected: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}" class="x-combo-list-item">' +
                    '{Name}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'Name']
                }),
                api: { read: Iffs.GetRoles }
            }),
            displayField: 'Name',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('roleSetting-form').getForm();
                    form.findField('RoleId').setValue(rec.id);
                    this.itemSelected = true;
                },
                blur: function (cmb) {
                    var form = Ext.getCmp('roleSetting-form').getForm();
                    if (this.getValue() == '') {
                        form.findField('RoleId').reset();
                    }
                    if (!this.itemSelected) {
                        form.findField('RoleId').reset();
                        form.findField('Role').reset();
                    }
                    this.itemSelected = false;
                }
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.roleSetting.Form, Ext.form.FormPanel);
Ext.reg('roleSetting-form', Ext.erp.iffs.ux.roleSetting.Form);

/**
* @desc      RoleSetting registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.roleSetting
* @class     Ext.erp.iffs.ux.roleSetting.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.roleSetting.Window = function (config) {
    Ext.erp.iffs.ux.roleSetting.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 500,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                this.form.getForm().findField('Id').setValue(this.roleSettingId);
                if (this.roleSettingId != '') {
                    this.form.load({ params: { id: this.roleSettingId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.roleSetting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.roleSetting.Form();
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
        Ext.erp.iffs.ux.roleSetting.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('roleSetting-form').getForm().reset();
                Ext.getCmp('roleSetting-paging').doRefresh();
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
Ext.reg('roleSetting-window', Ext.erp.iffs.ux.roleSetting.Window);

/**
* @desc      RoleSetting grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.roleSetting
* @class     Ext.erp.iffs.ux.roleSetting.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.roleSetting.Grid = function (config) {
    Ext.erp.iffs.ux.roleSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: RoleSetting.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'RoleId', 'Role'],
            remoteSort: true
        }),
        id: 'roleSetting-grid',
        loadMask: true,
        pageSize: 30,
        columnLines: true,
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
            dataIndex: 'Role',
            header: 'Role',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.roleSetting.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'roleSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.roleSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.roleSetting.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('roleSetting-grid', Ext.erp.iffs.ux.roleSetting.Grid);

/**
* @desc      RoleSetting panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.roleSetting
* @class     Ext.erp.iffs.ux.roleSetting.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.roleSetting.Panel = function (config) {
    Ext.erp.iffs.ux.roleSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Role Setting', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Role Setting', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Role Setting', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.roleSetting.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.roleSetting.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.roleSetting.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.roleSetting.Window({
            roleSettingId: 0,
            title: 'Add Role'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('roleSetting-grid');
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
        new Ext.erp.iffs.ux.roleSetting.Window({
            roleSettingId: id,
            title: 'Edit Role'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('roleSetting-grid');
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
                    RoleSetting.Delete(id, function (result, response) {
                        Ext.getCmp('roleSetting-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('roleSetting-panel', Ext.erp.iffs.ux.roleSetting.Panel);