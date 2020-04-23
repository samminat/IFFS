Ext.ns('Ext.erp.iffs.ux.approver');
/**
* @desc      Approver registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approver
* @class     Ext.erp.iffs.ux.approver.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.approver.Form = function (config) {
    Ext.erp.iffs.ux.approver.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Approver.Get,
            submit: Approver.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'approver-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'EmployeeId',
            xtype: 'hidden'
        }, {
            hiddenName: 'Employee',
            xtype: 'combo',
            fieldLabel: 'Employee',
            typeAhead: false,
            hideTrigger: true,
            minChars: 2,
            listWidth: 280,
            mode: 'remote',
            allowBlank: false,
            itemSelected: false,
            tpl: '<tpl for="."><div ext:qtip="{Id}" class="x-combo-list-item">' +
                    '{FullName}</div></tpl>',
            store: new Ext.data.DirectStore({
                reader: new Ext.data.JsonReader({
                    successProperty: 'success',
                    idProperty: 'Id',
                    totalProperty: 'total',
                    root: 'data',
                    fields: ['Id', 'FullName']
                }),
                api: { read: Iffs.GetEmployees }
            }),
            displayField: 'FullName',
            pageSize: 10,
            listeners: {
                select: function (cmb, rec, idx) {
                    var form = Ext.getCmp('approver-form').getForm();
                    form.findField('EmployeeId').setValue(rec.id);
                    this.itemSelected = true;
                },
                blur: function (cmb) {
                    var form = Ext.getCmp('approver-form').getForm();
                    if (this.getValue() == '') {
                        form.findField('EmployeeId').reset();
                    }
                    if (!this.itemSelected) {
                        form.findField('EmployeeId').reset();
                        form.findField('Employee').reset();
                    }
                    this.itemSelected = false;
                }
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approver.Form, Ext.form.FormPanel);
Ext.reg('approver-form', Ext.erp.iffs.ux.approver.Form);

/**
* @desc      Approver registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approver
* @class     Ext.erp.iffs.ux.approver.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.approver.Window = function (config) {
    Ext.erp.iffs.ux.approver.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.approverId);
                if (this.approverId != '') {
                    this.form.load({ params: { id: this.approverId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approver.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.approver.Form();
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
        Ext.erp.iffs.ux.approver.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('approver-form').getForm().reset();
                Ext.getCmp('approver-paging').doRefresh();
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
Ext.reg('approver-window', Ext.erp.iffs.ux.approver.Window);

/**
* @desc      Approver grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approver
* @class     Ext.erp.iffs.ux.approver.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.approver.Grid = function (config) {
    Ext.erp.iffs.ux.approver.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Approver.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'FullName', 'Position'],
            remoteSort: true
        }),
        id: 'approver-grid',
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
            dataIndex: 'FullName',
            header: 'Full Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Position',
            header: 'Position',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approver.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'approver-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.approver.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.approver.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('approver-grid', Ext.erp.iffs.ux.approver.Grid);

/**
* @desc      Approver Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.approver
* @class     Ext.erp.iffs.ux.approver.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.approver.Panel = function (config) {
    Ext.erp.iffs.ux.approver.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Approver', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Approver', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Approver', 'CanDelete'),
                handler: this.onDeleteClick
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.approver.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.approver.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.approver.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.approver.Window({
            approverId: 0,
            title: 'Add Approver'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('approver-grid');
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
        new Ext.erp.iffs.ux.approver.Window({
            approverId: id,
            title: 'Edit Approver'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('approver-grid');
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
                    Approver.Delete(id, function (result, response) {
                        Ext.getCmp('approver-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('approver-panel', Ext.erp.iffs.ux.approver.Panel);