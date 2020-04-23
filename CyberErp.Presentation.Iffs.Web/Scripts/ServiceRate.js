Ext.ns('Ext.erp.iffs.ux.serviceRate');
/**
* @desc      ServiceRate registration form
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.serviceRate.Form = function (config) {
    Ext.erp.iffs.ux.serviceRate.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: ServiceRate.Get,
            submit: ServiceRate.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'serviceRate-form',
        padding: 5,
        labelWidth: 120,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'ServiceId',
            xtype: 'hidden'
        }, {
            hiddenName: 'OperationTypeId',
            xtype: 'combo',
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
                listeners: {
                    load: function () {
                        var operatioinTypeId = Ext.getCmp('serviceRate-form').getForm().findField('OperationTypeId').getValue();
                        Ext.getCmp('serviceRate-form').getForm().findField('OperationTypeId').setValue(operatioinTypeId);
                    },
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
        },  {
            hiddenName: 'ServiceUnitTypeId',
            xtype: 'combo',
            fieldLabel: 'Service Unit Type',
            triggerAction: 'all',
            mode: 'remote',
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
                api: { read: Iffs.GetServiceUnitType },
                listeners: {
                    load: function () {
                        var serviceUnitTypeId = Ext.getCmp('serviceRate-form').getForm().findField('ServiceUnitTypeId').getValue();
                        Ext.getCmp('serviceRate-form').getForm().findField('ServiceUnitTypeId').setValue(serviceUnitTypeId);

                    },
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
        }, {
            hiddenName: 'CurrencyId',
            xtype: 'combo',
            fieldLabel: 'Currency',
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
                api: { read: Iffs.GetCurrency },
                listeners: {
                    load: function () {
                        var currencyId = Ext.getCmp('serviceRate-form').getForm().findField('CurrencyId').getValue();
                        Ext.getCmp('serviceRate-form').getForm().findField('CurrencyId').setValue(currencyId);
                    },
                }
            }),
            valueField: 'Id',
            displayField: 'Name',
        },{
            hiddenName: 'ComparingSign',
            xtype: 'combo',
            fieldLabel: 'Qty Sign',
            triggerAction: 'all',
            mode: 'local',
            anchor: '90%',
            editable: false,
            forceSelection: false,
            emptyText: '---Select---',
            allowBlank: true,
            store: new Ext.data.ArrayStore({
                fields: ['Id', 'Name'],
                idProperty: 'Id',
                data: [
                    [1, '='],
                    [2, '+'],
                    [3, '-']

                ]
            }),
            valueField: 'Name',
            displayField: 'Name'
        }, {
            name: 'Description',
            xtype: 'textfield',
            anchor: '90%',

            fieldLabel: 'Description',
            allowBlank: true
        },{
            name: 'Rate',
            xtype: 'numberfield',
            fieldLabel: 'Rate',
            anchor: '90%',
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.Form, Ext.form.FormPanel);
Ext.reg('serviceRate-form', Ext.erp.iffs.ux.serviceRate.Form);

/**
* @desc      ServiceRate registration form host window
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.serviceRate.Window = function (config) {
    Ext.erp.iffs.ux.serviceRate.Window.superclass.constructor.call(this, Ext.apply({
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
                this.form.getForm().findField('Id').setValue(this.serviceRateId);
                this.form.getForm().findField('ServiceId').setValue(this.serviceId);
                if (this.serviceRateId != '') {
                    this.form.load({ params: { id: this.serviceRateId } });
                }
            },
            scope: this
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.serviceRate.Form();
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
        Ext.erp.iffs.ux.serviceRate.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var serviceId = Ext.getCmp('serviceRate-grid').getSelectionModel().getSelected().get('Id');
        Ext.getCmp('serviceRate-form').getForm().findField('ServiceId').setValue(serviceId);
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function () {
                Ext.getCmp('serviceRate-form').getForm().reset();
                var serviceId = Ext.getCmp('serviceRate-grid').getSelectionModel().getSelected().get('Id');
                var detailGrid = Ext.getCmp('serviceRate-detailGrid');
                detailGrid.store.baseParams = { param: Ext.encode({ serviceId: serviceId }) };
                detailGrid.getStore().load({
                    params: {
                        start: 0,
                        limit: 100
                    }
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
Ext.reg('serviceRate-window', Ext.erp.iffs.ux.serviceRate.Window);

/**
* @desc      ServiceRate grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.serviceRate.Grid = function (config) {
    Ext.erp.iffs.ux.serviceRate.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'Name', 'Code', 'Description'],
            remoteSort: true
        }),
        id: 'serviceRate-grid',
        loadMask: true,
        pageSize: 10,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                scope: this,
                rowselect: function () {
                    var serviceId = this.getSelectionModel().getSelected().get('Id');
                    var detailGrid = Ext.getCmp('serviceRate-detailGrid')
                    detailGrid.store.baseParams = { param: Ext.encode({ serviceId: serviceId }) };
                    detailGrid.getStore().load({
                        params: {
                            start: 0,
                            limit: this.pageSize
                        }
                    });
                }
            },
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
            width: 300,
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
            width: 900,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'serviceRate-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.serviceRate.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.serviceRate.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('serviceRate-grid', Ext.erp.iffs.ux.serviceRate.Grid);
/**
* @desc      ServiceRate detailGrid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.DetailGrid
* @extends   Ext.detailGrid.DetailGridPanel
*/
Ext.erp.iffs.ux.serviceRate.DetailGrid = function (config) {
    Ext.erp.iffs.ux.serviceRate.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: ServiceRate.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Name',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationType', 'ServiceUnitType', 'Currency', 'Rate', 'Description', 'ComparingSign'],
            remoteSort: true
        }),
        id: 'serviceRate-detailGrid',
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
        }, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'ServiceUnitType',
            header: 'Unit Type',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'Currency',
            header: 'Currency',
            sortable: true,
            width: 200,
            menuDisabled: true
        }, {
            dataIndex: 'ComparingSign',
            header: 'Qty Sign',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'Rate',
            header: 'Rate',
            sortable: true,
            width: 200,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.DetailGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'serviceRateDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.serviceRate.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.iffs.ux.serviceRate.DetailGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('serviceRate-detailGrid', Ext.erp.iffs.ux.serviceRate.DetailGrid);
/**
* @desc      ServiceRate Item DetailGridPanel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.DetailGridPanel
* @extends   Ext.DetailGridPanel
*/
Ext.erp.iffs.ux.serviceRate.DetailGridPanel = function (config) {
    Ext.erp.iffs.ux.serviceRate.DetailGridPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Rate', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Rate', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Rate', 'CanDelete'),
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
                            var grid = Ext.getCmp('serviceRate-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('serviceRate-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.DetailGridPanel, Ext.Panel, {
    initComponent: function () {
        this.detailGrid = new Ext.erp.iffs.ux.serviceRate.DetailGrid();
        this.items = [this.detailGrid];

        Ext.erp.iffs.ux.serviceRate.DetailGridPanel.superclass.initComponent.apply(this, arguments);
    },
    onAddClick: function () {
        var grid = Ext.getCmp('serviceRate-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a Service record to edit.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.iffs.ux.serviceRate.Window({
            serviceRateId: 0,
            serviceId:id,
            title: 'Add ServiceRate'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('serviceRate-detailGrid');
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
        new Ext.erp.iffs.ux.serviceRate.Window({
            serviceRateId: id,
            title: 'Edit ServiceRate'
        }).show();
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('serviceRate-detailGrid');
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
                    ServiceRate.Delete(id, function (result, response) {
                        var serviceId = Ext.getCmp('serviceRate-grid').getSelectionModel().getSelected().get('Id');
                        var detailGrid = Ext.getCmp('serviceRate-detailGrid');
                        detailGrid.store.baseParams = { param: Ext.encode({ serviceId: serviceId }) };
                        detailGrid.getStore().load({
                            params: {
                                start: 0,
                                limit: 100
                            }
                        });
                    }, this);
                }
            }
        });
    }
});
Ext.reg('serviceRate-detailGridPanel', Ext.erp.iffs.ux.serviceRate.DetailGridPanel);

/**
* @desc      ServiceRate Item MainGridPanel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.MainGridPanel
* @extends   Ext.MainGridPanel
*/
Ext.erp.iffs.ux.serviceRate.MainGridPanel = function (config) {
    Ext.erp.iffs.ux.serviceRate.MainGridPanel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [ {
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
                            var grid = Ext.getCmp('serviceRate-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('serviceRate-grid');
                            grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }
            }]
        }
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.MainGridPanel, Ext.Panel, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.serviceRate.Grid();
        this.items = [this.grid];
        Ext.erp.iffs.ux.serviceRate.MainGridPanel.superclass.initComponent.apply(this, arguments);
    },
});
Ext.reg('serviceRate-mainGridPanel', Ext.erp.iffs.ux.serviceRate.MainGridPanel);
/**
* @desc      ServiceRate Item panel
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      Dec 15, 2017
* @namespace Ext.erp.iffs.ux.serviceRate
* @class     Ext.erp.iffs.ux.serviceRate.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.serviceRate.Panel = function (config) {
    Ext.erp.iffs.ux.serviceRate.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.serviceRate.Panel, Ext.Panel, {
    initComponent: function () {
        this.mainGridPanel = new Ext.erp.iffs.ux.serviceRate.MainGridPanel();
        this.detailGridPanel = new Ext.erp.iffs.ux.serviceRate.DetailGridPanel();
        this.items = [{
            layout: 'vbox',
            layoutConfig: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                flex: 1
            },
            items :[this.mainGridPanel, this.detailGridPanel]
            //items: [this.DetailPanel]

        }

        ];
      

        Ext.erp.iffs.ux.serviceRate.Panel.superclass.initComponent.apply(this, arguments);
    },
});
Ext.reg('serviceRate-panel', Ext.erp.iffs.ux.serviceRate.Panel);