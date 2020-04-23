Ext.ns('Ext.erp.iffs.ux.ReceivingClient');
/**
* @desc      ReceivingClient registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ReceivingClient
* @class     Ext.erp.iffs.ux.ReceivingClient.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.ReceivingClient.Form = function (config) {
    Ext.erp.iffs.ux.ReceivingClient.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ReceivingClient.Get,
            submit: ReceivingClient.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'ReceivingClient-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'Name',
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false
        }, {
            name: 'ContactPerson',
            xtype: 'textfield',
            fieldLabel: 'Contact Person',
            allowBlank: false
        }, {
            name: 'Mobile',
            xtype: 'textfield',
            fieldLabel: 'Mobile',
            allowBlank: false
        }, {
            name: 'Telephone',
            xtype: 'textfield',
            fieldLabel: 'Telephone',
            allowBlank: false
        }, {
            name: 'Email',
            xtype: 'textfield',
            fieldLabel: 'Email',
            allowBlank: false
        }, {
            name: 'AlternativeEmail',
            xtype: 'textfield',
            fieldLabel: 'Email(Alternative)',
            allowBlank: false
        }, {
            name: 'Address',
            xtype: 'textarea',
            fieldLabel: 'Address',
            allowBlank: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ReceivingClient.Form, Ext.form.FormPanel);
Ext.reg('ReceivingClient-form', Ext.erp.iffs.ux.ReceivingClient.Form);

/**
* @desc      ReceivingClient registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ReceivingClient
* @class     Ext.erp.iffs.ux.ReceivingClient.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.ReceivingClient.Window = function (config) {
    Ext.erp.iffs.ux.ReceivingClient.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.ReceivingClientId);
                if (this.ReceivingClientId != undefined) {
                    this.form.load({ params: { id: this.ReceivingClientId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ReceivingClient.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.ReceivingClient.Form({targetForm:this.targetForm});
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
        Ext.erp.iffs.ux.ReceivingClient.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {
                if (typeof form.targetForm != "undefined" && form.targetForm != null) {
                    form.targetForm.findField('ReceivingClientId').setValue(action.result.ReceivingClientId);
                    form.targetForm.findField('ReceivingClient').setValue(Ext.getCmp('ReceivingClient-form').getForm().findField('Name').getValue());
                    Ext.MessageBox.show({
                        title: 'Sucess',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.SUCCESS,
                        scope: this
                    });
                }
                Ext.getCmp('ReceivingClient-form').getForm().reset();
                Ext.getCmp('ReceivingClient-paging').doRefresh();
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
Ext.reg('ReceivingClient-window', Ext.erp.iffs.ux.ReceivingClient.Window);

/**
* @desc      ReceivingClient grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ReceivingClient
* @class     Ext.erp.iffs.ux.ReceivingClient.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.ReceivingClient.Grid = function (config) {
    Ext.erp.iffs.ux.ReceivingClient.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ReceivingClient.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'ContactPerson', 'Mobile', 'Telephone', 'Email', 'AlternativeEmail'],
            remoteSort: true
        }),
        id: 'ReceivingClient-grid',
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
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'ContactPerson',
            header: 'Contact Person',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Mobile',
            header: 'Mobile',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Telephone',
            header: 'Telephone',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'Email',
            header: 'Email',
            sortable: true,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'AlternativeEmail',
            header: 'Email(Alternative)',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ReceivingClient.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'ReceivingClient-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.ReceivingClient.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.ReceivingClient.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('ReceivingClient-grid', Ext.erp.iffs.ux.ReceivingClient.Grid);

/**
* @desc      ReceivingClient Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ReceivingClient
* @class     Ext.erp.iffs.ux.ReceivingClient.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.ReceivingClient.Panel = function (config) {
    Ext.erp.iffs.ux.ReceivingClient.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Receiving Client', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Receiving Client', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Receiving Client', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'ReceivingClient.searchText',
                emptyText: 'Type search text here',
                submitEmptyText: false,
                enableKeyEvents: true,
                style: {
                    borderRadius: '25px',
                    padding: '0 10px',
                    width: '300px'
                },
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var grid = Ext.getCmp('ReceivingClient-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('ReceivingClient-grid');
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
                    var searchText = Ext.getCmp('ReceivingClient.searchText').getValue();
                    window.open('ReceivingClient/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ReceivingClient.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.ReceivingClient.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.ReceivingClient.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.ReceivingClient.Window({
            ReceivingClientId: 0,
            title: 'Add Receiving Client'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('ReceivingClient-grid');
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
        new Ext.erp.iffs.ux.ReceivingClient.Window({
            ReceivingClientId: id,
            title: 'Edit Receiving Client'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('ReceivingClient-grid');
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
                    ReceivingClient.Delete(id, function (result, response) {
                        Ext.getCmp('ReceivingClient-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('ReceivingClient-panel', Ext.erp.iffs.ux.ReceivingClient.Panel);