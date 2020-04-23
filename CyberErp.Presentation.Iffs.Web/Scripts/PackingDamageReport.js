Ext.ns('Ext.erp.iffs.ux.PackingDamageReport');

/**
* @desc      PackingDamageReportTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingDamageReport
* @class     Ext.erp.iffs.ux.PackingDamageReport.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.PackingDamageReport.Form = function (config) {
    Ext.erp.iffs.ux.PackingDamageReport.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.PackingDamageReport.Get,
            submit: window.PackingDamageReport.Save
        },
        paramOrder: ['id'],
        defaults: {
            anchor: '98%',
            labelStyle: 'text-align:left;',
            msgTarget: 'side',
            layout: 'form'
        },
        id: 'PackingDamageReport-form',
        padding: 5,
        labelWidth: 100,
        // width: 700,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            layout: 'column',
            border: false,
            bodyStyle: 'background-color:transparent;',
            defaults: {
                columnWidth: .5,
                border: false,
                bodyStyle: 'background-color:transparent;',
                layout: 'form'
            },
            items: [{
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'Date',
                    xtype: 'hidden'
                }, {
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'ReceivingClientId'
                }, {
                    xtype: 'hidden',
                    name: 'OrderingClientId'
                }, {
                    hiddenName: 'OperationId',
                    xtype: 'combo',
                    fieldLabel: 'Operation No.',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    typeAhead: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Number']
                        }),
                        autoLoad: true,
                        api: { read: PackingMaterial.GetOperations }
                    }),
                    valueField: 'Id',
                    displayField: 'Number'
                }, {
                    name: 'ShippersName',
                    xtype: 'textfield',
                    fieldLabel: "Shipper's Name",
                    width: 100,
                    allowBlank: false,
                }, {
                    name: 'ClientId',
                    xtype: 'hidden',
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Company Name',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        hiddenName: 'ClientName',
                        xtype: 'combo',
                        typeAhead: true,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span style="display: inline-block; width: 120px;">{Name}</span></h3>{ContactPerson}</div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'ContactPerson']
                            }),
                            autoLoad: true,
                            api: { read: Iffs.GetCustomer }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10,
                        listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('PackingDamageReport-form').getForm();
                                form.findField('ClientId').setValue(rec.id);
                            }
                        }
                    }, {
                        xtype: 'button',
                        width: 30,
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('PackingDamageReport-form').getForm();
                            new Ext.erp.iffs.ux.ReceivingClient.Window({
                                ReceivingClient: 0,
                                title: 'Add  Client'
                            }).show();

                        }
                    }]
                }, {
                    name: 'SuprvisorId',
                    xtype: 'hidden',

                }, {
                    hiddenName: 'Suprvisor',
                    fieldLabel: 'Supervisor',
                    xtype: 'combo',
                    typeAhead: true,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    emptyText: '---Type to Search---',
                    mode: 'remote',
                    allowBlank: false,
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {FullName}" class="x-combo-list-item">' +
                        '<h3><span>{FullName}</span></h3> </div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'FullName']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetEmployees }
                    }),
                    //  valueField: 'FullName',
                    displayField: 'FullName',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('PackingDamageReport-form').getForm();
                            form.findField('SuprvisorId').setValue(rec.id);
                        }
                    }
                }]
            }, {
                defaults: {
                    anchor: '98%'
                },
                items: [{

                    name: 'DeliveryAddress',
                    xtype: 'textarea',
                    fieldLabel: "Delivery Address",
                    allowBlank: false,
                    height: 80
                }, {
                    name: 'OriginCountry',
                    xtype: 'textfield',
                    fieldLabel: 'Origin Country',
                    width: 100,
                    allowBlank: false
                }]

            }]
        }, {
            anchor: '97%',
            name: 'Remarks',
            xtype: 'textarea',
            fieldLabel: 'Remark',
            width: 100,
            allowBlank: false,
            height: 40
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingDamageReport.Form, Ext.form.FormPanel);
Ext.reg('PackingDamageReport-form', Ext.erp.iffs.ux.PackingDamageReport.Form);

/**
* @desc      PackingDamageReportTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.PackingDamageReport
* @class     Ext.erp.iffsux.PackingDamageReport.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.PackingDamageReport.Window = function (config) {
    Ext.erp.iffs.ux.PackingDamageReport.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 750,
        id: 'PackingDamageReport-window',
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        actionType: 'Add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                if (this.Id > 0) {
                    Ext.getCmp('PackingDamageReport-window').actionType = "Edit";
                    var form = Ext.getCmp('PackingDamageReport-form');
                    form.load({
                        params: { id: this.Id },
                    });
                    this.grid.loadDetail(this.Id);
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingDamageReport.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.PackingDamageReport.Form();
        this.grid = new Ext.erp.iffs.ux.PackingDamageReport.DetailGrid();
        this.items = [this.form, this.grid];

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
        Ext.erp.iffs.ux.PackingDamageReport.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            success: function (form, action) {

                extMessage = action.result.data;
                Ext.getCmp('PackingDamageReportDetail-grid').SaveDetail(action.result.HeaderId);
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

        if (typeof this.NotificationId != 'undefined') {
            window.PackingDamageReport.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('PackingDamageReport-paging').doRefresh();
                } else {
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: action.result.data,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }
            });
        }
        this.close();
    },
    onAddRow: function () {
        Ext.getCmp('PackingDamageReport-window').addRow();

    }
});
Ext.reg('PackingDamageReport-window', Ext.erp.iffs.ux.PackingDamageReport.Window);

/**
* @desc      PackingDamageReportTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingDamageReport
* @class     Ext.erp.iffs.ux.PackingDamageReport.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingDamageReport.Grid = function (config) {
    Ext.erp.iffs.ux.PackingDamageReport.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingDamageReport.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'ClientId', 'SuprvisorId', 'OperationNumber', 'ClientName', 'Suprvisor', 'DeliveryAddress', 'OriginCountry', 'ShippersName'],
            remoteSort: true
        }),
        id: 'PackingDamageReport-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
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
            dataIndex: 'OperationId',
            header: 'OperationId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ClientId',
            header: 'ClientId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SuprvisorId',
            header: 'SuprvisorId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'OperationNumber',
            header: 'Operation No.',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ClientName',
            header: 'Client',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Suprvisor',
            header: 'Suprvisor',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DeliveryAddress',
            header: 'DeliveryAddress',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ShippersName',
            header: 'ShippersName',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OriginCountry',
            header: 'Origin Country',
            sortable: true,
            width: 100,
            menuDisabled: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingDamageReport.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingDamageReport-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingDamageReport.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.PackingDamageReport.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('PackingDamageReport-grid', Ext.erp.iffs.ux.PackingDamageReport.Grid);
/**
* @desc      PackingDamageReportTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingDamageReport
* @class     Ext.erp.iffs.ux.PackingDamageReport.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingDamageReport.DetailGrid = function (config) {
    Ext.erp.iffs.ux.PackingDamageReport.DetailGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingDamageReport.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'HeaderId', 'DamagedItems', 'DamageType'],
            remoteSort: true
        }),
        id: 'PackingDamageReportDetail-grid',
        pageSize: 30,
        height: 300,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
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
            dataIndex: 'HeaderId',
            header: 'HeaderId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DamagedItems',
            header: 'Damaged Items',
            sortable: true,
            width: 250,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'DamageType',
            header: 'Damage Type',
            sortable: true,
            width: 250,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: true,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingDamageReport.DetailGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'button',
            text: 'Remove',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingDamageReportDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingDamageReport.DetailGrid.superclass.initComponent.apply(this, arguments);
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingDamageReportDetail-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var record = grid.getSelectionModel().getSelections();
        for (var i = 0; i < record.length; i++) {
            grid.store.remove(record);
            if (typeof record[i].id === 'number') {
                var id = record[i].id;
                Ext.MessageBox.show({
                    title: 'Delete',
                    msg: 'Are you sure you want to delete the selected record',
                    buttons: {
                        ok: 'Yes',
                        no: 'No'
                    },
                    icon: Ext.MessageBox.QUESTION,
                    scope: this,
                    fn: function (btn) {
                        if (btn == 'ok') {
                            PackingDamageReport.DeleteDetail(id, function (result, response) {
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
        }
    },
    SaveDetail: function (headerId) {
        var grid = Ext.getCmp('PackingDamageReportDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var damgeItems = [];

        gridDatastore.each(function (item) {
            if (item.data['DamagedItems'] == null || item.data['DamagedItems'] == "") {
                QuantityError = 'The Damaged Items Must Not be Empty';
            }
            if (item.data['DamageType'] == null)
                QuantityError = 'Damage Type of the must be filled';
            damgeItems.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Damage Item Report Detail',
                msg: extMessage + ", But Damage Item Report Detail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Damage Item Report   Header and Detail',
                msg: QuantityError + ', So the Damage Item Report  has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingDamageReport.SaveDetail(headerId, damgeItems, function (rest, resp) {
            if (rest.success) {
                Ext.MessageBox.show({
                    title: 'Damage Item Report Header and Detail',
                    msg: extMessage + 'And also' + rest.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingDamageReport-form').getForm().reset();
                Ext.getCmp('PackingDamageReport-paging').doRefresh();
                Ext.getCmp('PackingDamageReport-window').close();
            }
        });
    },
    loadDetail: function (HeaderId) {
        var DetailStore = this.getStore();

        DetailStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        DetailStore.load({
            params: { start: 0, limit: this.pageSize }
        });

        
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingDamageReportDetail-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({
            Id: 0,
            HeaderId: 0,
            DamagedItems: '',
            DamageType: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }

    },
    afterRender: function () {
        //this.getStore().load({
        //    params: { start: 0, limit: this.pageSize }
        //});
        this.addRow();
        Ext.erp.iffs.ux.PackingDamageReport.DetailGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('PackingDamageReportDetail-grid', Ext.erp.iffs.ux.PackingDamageReport.DetailGrid);

/**
* @desc      PackingDamageReportTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingDamageReport
* @class     Ext.erp.iffs.ux.PackingDamageReport.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingDamageReport.Panel = function (config) {
    Ext.erp.iffs.ux.PackingDamageReport.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addPackingDamageReport',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Damage Report', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editPackingDamageReport',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Damage Report', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deletePackingDamageReport',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Damage Report', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewPackingDamageReport',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'PackingDamageReport.searchText',
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
                            var grid = Ext.getCmp('PackingDamageReport-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingDamageReport-grid');
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
                    var searchText = Ext.getCmp('PackingDamageReport.searchText').getValue();
                    window.open('PackingDamageReport/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingDamageReport.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'PackingDamageReport-grid',
            id: 'PackingDamageReport-grid'
        }];
        Ext.erp.iffs.ux.PackingDamageReport.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.PackingDamageReport.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.PackingDamageReport.Window({
            operationTypeId: 0,
            isRevised: false,
            title: 'Add Damage Report'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        var selectedRecord = grid.getSelectionModel().getSelected();
        //if (selectedRecord.get('IsApproved') == true) {
        //    Ext.MessageBox.show({
        //        title: 'Select',
        //        msg: 'The record is already approved. You cannot make changes.',
        //        buttons: Ext.Msg.OK,
        //        icon: Ext.MessageBox.INFO,
        //        scope: this
        //    });
        //    return;
        //}
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.PackingDamageReport.Window({
            Id: id,
            isRevised: false,
            title: 'Edit Damage Report'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingDamageReport',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingDamageReport.Delete(id, function (result, response) {
                        Ext.getCmp('PackingDamageReport-paging').doRefresh();
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
    },
    onRevise: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var PackingDamageReport = grid.getSelectionModel().getSelected().get('PackingDamageReportNo');

        new Ext.erp.iffs.ux.PackingDamageReport.Window({
            operationTypeId: id,
            isRevised: true,
            parentPackingDamageReportId: id,
            parentPackingDamageReport: PackingDamageReport,
            title: 'Revise Damage Report'
        }).show();
    },
    onHistory: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.iffs.ux.PackingDamageReportHistory.Window({
            title: 'Damage Report Revision History',
            PackingDamageReportId: id
        }).show();
    },
    onCheck: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var selectedRecord = grid.getSelectionModel().getSelected();
        if (selectedRecord.get('IsChecked') == true) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'The record is already checked.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = selectedRecord.get('Id');

        Ext.MessageBox.show({
            title: 'Checking',
            msg: 'Are you sure you want to check the selected record?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {

                    new Ext.erp.iffs.ux.documentConfirmation.Window({
                        id: id,
                        cmpPaging: Ext.getCmp('PackingDamageReport-paging'),
                        api: {
                            submit: PackingDamageReport.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('PackingDamageReport-grid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select a record.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var selectedRecord = grid.getSelectionModel().getSelected();
        if (selectedRecord.get('IsApproved') == true) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'The record is already approved.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        if (selectedRecord.get('IsChecked') == false) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'Record should be checked before approval.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var id = selectedRecord.get('Id');

        Ext.MessageBox.show({
            title: 'Checking',
            msg: 'Are you sure you want to approve the selected record?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    new Ext.erp.iffs.ux.documentConfirmation.Window({
                        id: id,
                        cmpPaging: Ext.getCmp('PackingDamageReport-paging'),
                        api: {
                            submit: PackingDamageReport.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('PackingDamageReport-panel', Ext.erp.iffs.ux.PackingDamageReport.Panel);



