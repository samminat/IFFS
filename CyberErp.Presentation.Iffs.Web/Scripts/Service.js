Ext.ns('Ext.erp.iffs.ux.service');
/**
* @desc      Service registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.service
* @class     Ext.erp.iffs.ux.service.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.service.Form = function (config) {
    Ext.erp.iffs.ux.service.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Service.Get,
            submit: Service.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'service-form',
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
            name: 'Code',
            xtype: 'textfield',
            fieldLabel: 'Code',
            allowBlank: false
        }, {
            name: 'Description',
            xtype: 'textarea',
            fieldLabel: 'Description',
            height: 200,
            allowBlank: true
        }, {
            name: 'IsTaxable',
            xtype: 'checkbox',
            checked: false,
            boxLabel: 'Is Taxable'
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.service.Form, Ext.form.FormPanel);
Ext.reg('service-form', Ext.erp.iffs.ux.service.Form);

/**
* @desc      Service registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.service
* @class     Ext.erp.iffs.ux.service.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.service.Window = function (config) {
    Ext.erp.iffs.ux.service.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.serviceId);
                if (this.serviceId != '') {
                    this.form.load({ params: { id: this.serviceId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.service.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.service.Form();
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
        Ext.erp.iffs.ux.service.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('service-form').getForm().reset();
                Ext.getCmp('service-paging').doRefresh();
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
Ext.reg('service-window', Ext.erp.iffs.ux.service.Window);

/**
* @desc      Service grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.service
* @class     Ext.erp.iffs.ux.service.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.service.Grid = function (config) {
    Ext.erp.iffs.ux.service.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Service.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'Name', 'Code', 'Description', 'IsTaxable'],
            remoteSort: true
        }),
        id: 'service-grid',
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
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 400,
            menuDisabled: true
        }, {
            dataIndex: 'IsTaxable',
            header: 'Taxable?',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'center',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (value)
                    return '<img src="Content/images/app/select.png" />';
                else
                    return '<img src="Content/images/app/cross.png" />';
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.service.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'service-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.service.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.service.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('service-grid', Ext.erp.iffs.ux.service.Grid);


/**
* @desc      Service Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.service
* @class     Ext.erp.iffs.ux.service.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.service.Panel = function (config) {
    Ext.erp.iffs.ux.service.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'service.searchText',
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
                            var grid = Ext.getCmp('service-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('service-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
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
                    var searchText = Ext.getCmp('service.searchText').getValue();
                    window.open('Service/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.service.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.service.Grid();
     
        this.items = [grid];

        Ext.erp.iffs.ux.service.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.service.Window({
            serviceId: 0,
            title: 'Add Service'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('service-grid');
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
        new Ext.erp.iffs.ux.service.Window({
            serviceId: id,
            title: 'Edit Service'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('service-grid');
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
                    Service.Delete(id, function (result, response) {
                        Ext.getCmp('service-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('service-panel', Ext.erp.iffs.ux.service.Panel);