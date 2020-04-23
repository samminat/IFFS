Ext.ns('Ext.erp.iffs.ux.documentNoSetting');
/**
* @desc      DocumentNoSetting registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentNoSetting
* @class     Ext.erp.iffs.ux.documentNoSetting.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.documentNoSetting.Form = function (config) {
    Ext.erp.iffs.ux.documentNoSetting.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: DocumentNoSetting.Get,
            submit: DocumentNoSetting.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'documentNoSetting-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'DocumentType',
            xtype: 'textfield',
            fieldLabel: 'Document Type',
            allowBlank: false
        }, {
            name: 'Prefix',
            xtype: 'textfield',
            fieldLabel: 'Prefix',
            allowBlank: false
        }, {
            name: 'SurFix',
            xtype: 'textfield',
            fieldLabel: 'SurFix',
            allowBlank: true
        }, {
            name: 'Year',
            xtype: 'textfield',
            fieldLabel: 'Year',
            allowBlank: true
        }, {
            name: 'NoOfDigit',
            xtype: 'textfield',
            fieldLabel: 'No Of Digit',
            allowBlank: true
        }, {
            name: 'CurrentNo',
            xtype: 'textfield',
            fieldLabel: 'Current No',
            allowBlank: false
        }, ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentNoSetting.Form, Ext.form.FormPanel);
Ext.reg('documentNoSetting-form', Ext.erp.iffs.ux.documentNoSetting.Form);

/**
* @desc      DocumentNoSetting registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentNoSetting
* @class     Ext.erp.iffs.ux.documentNoSetting.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.documentNoSetting.Window = function (config) {
    Ext.erp.iffs.ux.documentNoSetting.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.documentNoSettingId);
                if (this.documentNoSettingId != '') {
                    this.form.load({ params: { id: this.documentNoSettingId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentNoSetting.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.documentNoSetting.Form();
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
        Ext.erp.iffs.ux.documentNoSetting.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('documentNoSetting-form').getForm().reset();
                Ext.getCmp('documentNoSetting-paging').doRefresh();
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
Ext.reg('documentNoSetting-window', Ext.erp.iffs.ux.documentNoSetting.Window);

/**
* @desc      DocumentNoSetting grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentNoSetting
* @class     Ext.erp.iffs.ux.documentNoSetting.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.documentNoSetting.Grid = function (config) {
    Ext.erp.iffs.ux.documentNoSetting.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: DocumentNoSetting.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'DocumentType', 'Prefix', 'SurFix', 'Year', 'CurrentNo', 'NoOfDigit'],
            remoteSort: true
        }),
        id: 'documentNoSetting-grid',
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
            dataIndex: 'DocumentType',
            header: 'Document Type',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Prefix',
            header: 'Prefix',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'SurFix',
            header: 'SurFix',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Year',
            header: 'Year',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfDigit',
            header: 'NoOfDigit',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'CurrentNo',
            header: 'CurrentNo',
            sortable: true,
            width: 200,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentNoSetting.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'documentNoSetting-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.documentNoSetting.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.documentNoSetting.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('documentNoSetting-grid', Ext.erp.iffs.ux.documentNoSetting.Grid);


/**
* @desc      DocumentNoSetting Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.documentNoSetting
* @class     Ext.erp.iffs.ux.documentNoSetting.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.documentNoSetting.Panel = function (config) {
    Ext.erp.iffs.ux.documentNoSetting.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Document No Setting', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Document No Setting', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Document No Setting', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
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
                            var grid = Ext.getCmp('documentNoSetting-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('documentNoSetting-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.documentNoSetting.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.documentNoSetting.Grid();
     
        this.items = [grid];

        Ext.erp.iffs.ux.documentNoSetting.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.documentNoSetting.Window({
            documentNoSettingId: 0,
            title: 'Add DocumentNoSetting'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('documentNoSetting-grid');
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
        new Ext.erp.iffs.ux.documentNoSetting.Window({
            documentNoSettingId: id,
            title: 'Edit DocumentNoSetting'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('documentNoSetting-grid');
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
                    DocumentNoSetting.Delete(id, function (result, response) {
                        Ext.getCmp('documentNoSetting-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('documentNoSetting-panel', Ext.erp.iffs.ux.documentNoSetting.Panel);