Ext.ns('Ext.erp.iffs.ux.ShipmentType');
/**
* @desc      ShipmentType registration form
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ShipmentType
* @class     Ext.erp.iffs.ux.ShipmentType.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.ShipmentType.Form = function (config) {
    Ext.erp.iffs.ux.ShipmentType.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.ShipmentType.Get,
            submit: window.ShipmentType.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side'
        },
        id: 'ShipmentType-form',
        padding: 5,
        labelWidth: 95,
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
            allowBlank: false,
        }, {
            xtype: 'radiogroup',
            name: 'Type',
            fieldLabel: 'Transport Type',
            border: true,
            items: [
                { boxLabel: 'Air Line', name: 'Type', inputValue: 'AirLine', checked: true },
                { boxLabel: 'Shipping Line', name: 'Type', inputValue: 'ShippingLine' },
                { boxLabel: 'Rail Way Line', name: 'Type', inputValue: 'RailWayLine' }]

        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ShipmentType.Form, Ext.form.FormPanel);
Ext.reg('ShipmentType-form', Ext.erp.iffs.ux.ShipmentType.Form);

/**
* @desc      ShipmentType registration form host window
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ShipmentType
* @class     Ext.erp.iffs.ux.ShipmentType.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.ShipmentType.Window = function (config) {
    Ext.erp.iffs.ux.ShipmentType.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.Id);
                if (this.Id != '') {
                    this.form.load({ params: { id: this.Id } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ShipmentType.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.ShipmentType.Form({ targetForm: this.targetForm });
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
        Ext.erp.iffs.ux.ShipmentType.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {

                Ext.MessageBox.show({
                    title: 'Sucess',
                    msg: action.result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.SUCCESS,
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
Ext.reg('ShipmentType-window', Ext.erp.iffs.ux.ShipmentType.Window);



/**
* @desc      ShipmentType grid
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ShipmentType
* @class     Ext.erp.iffs.ux.ShipmentType.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.ShipmentType.Grid = function (config) {
    Ext.erp.iffs.ux.ShipmentType.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: window.ShipmentType.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'ShipmentTypeGroup',
                direction: 'ASC'
            },
            fields: ['Id', 'Type', 'Name', 'Code'],
            remoteSort: true
        }),
        id: 'ShipmentType-grid',
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
            dataIndex: 'Type',
            header: 'Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ShipmentType.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'ShipmentType-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.ShipmentType.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.ShipmentType.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('ShipmentType-grid', Ext.erp.iffs.ux.ShipmentType.Grid);

/**
* @desc      ShipmentType Item panel
* @author    Wondwosen Desalegn
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.ShipmentType
* @class     Ext.erp.iffs.ux.ShipmentType.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.ShipmentType.Panel = function (config) {
    Ext.erp.iffs.ux.ShipmentType.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Shipment Type', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Shipment Type', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Shipment Type', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'ShipmentType.searchText',
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
                            var grid = Ext.getCmp('ShipmentType-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('ShipmentType-grid');
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
                    var searchText = Ext.getCmp('ShipmentType.searchText').getValue();
                    window.open('ShipmentType/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.ShipmentType.Panel, Ext.Panel, {
    initComponent: function () {
        var grid = new Ext.erp.iffs.ux.ShipmentType.Grid();
        this.items = [grid];

        Ext.erp.iffs.ux.ShipmentType.Panel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.ShipmentType.Window({
            Id: 0,
            title: 'Add ShipmentType'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('ShipmentType-grid');
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
        new Ext.erp.iffs.ux.ShipmentType.Window({
            Id: id,
            title: 'Edit ShipmentType'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('ShipmentType-grid');
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
                    ShipmentType.Delete(id, function (result, response) {
                        Ext.getCmp('ShipmentType-paging').doRefresh();
                    }, this);
                }
            }
        });
    }
});
Ext.reg('ShipmentType-panel', Ext.erp.iffs.ux.ShipmentType.Panel);