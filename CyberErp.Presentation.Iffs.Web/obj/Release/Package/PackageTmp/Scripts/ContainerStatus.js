Ext.ns('Ext.erp.iffs.ux.containerStatus');

/**
* @desc      Container Status window
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.containerStatus
* @class     Ext.erp.iffs.ux.containerStatus.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.containerStatus.Window = function (config) {
    Ext.erp.iffs.ux.containerStatus.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'form',
        width: 700,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        saveMode: 'add',
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;'
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.containerStatus.Window, Ext.Window, {
    initComponent: function () {
        if (this.title == 'Incoming Status') {
            this.grid = new Ext.erp.iffs.ux.containerStatus.IncomingGrid({
                containerId: this.containerId,
                operationTypeId: this.operationTypeId
            });
        } else {
            this.grid = new Ext.erp.iffs.ux.containerStatus.ReturnGrid({
                containerId: this.containerId,
                operationTypeId: this.operationTypeId
            });
        }
        
        this.items = [this.grid];
        Ext.erp.iffs.ux.containerStatus.Window.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('containerStatus-window', Ext.erp.iffs.ux.containerStatus.Window);

/**
* @desc      Container Incoming Status grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.containerStatus
* @class     Ext.erp.iffs.ux.containerStatus.IncomingGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.containerStatus.IncomingGrid = function (config) {
    Ext.erp.iffs.ux.containerStatus.IncomingGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Container.GetAllStatus,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Status',
                direction: 'ASC'
            },
            fields: ['Id', 'ContainerId', 'StatusId', 'Status', 'DataType', 'Value', 'Remark'],
            remoteSort: true,
        }),
        id: 'containerStatus-incomingGrid',
        loadMask: true,
        pageSize: 10,
        clicksToEdit: 1,
        height: 450,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            beforeedit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('containerStatus-incomingGrid');

                var store, col;
                if (e.field == 'Value') {
                    col = grid.getColumnModel().getColumnAt(3);

                    if (record.get('DataType') == 'Date') {
                        col.setEditor({
                            xtype: 'datefield',
                            format: 'm/d/Y H:i',
                            editable: true,
                            allowBlank: true,
                            listeners: {
                                focus: function (field) {
                                    if (!isNaN(Date.parse(record.get('Value'), "m/d/Y H:i"))) {
                                        field.setValue(new Date(record.get('Value')));
                                    }
                                }
                            }
                        });
                    } else if (record.get('DataType') == 'Number') {
                        col.setEditor({
                            xtype: 'numberfield',
                            allowBlank: true,
                            listeners: {
                                focus: function (field) {
                                    field.setValue(parseFloat(record.get("Value").split(',').join('')));
                                }
                            }
                        });
                    } else {
                        col.setEditor({
                            xtype: 'textfield',
                            allowBlank: true,
                        });
                    }
                }
            },
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('containerStatus-incomingGrid');
                var cm;
                if (e.field == 'Value') {
                    cm = grid.getColumnModel();
                    var editor = cm.getColumnAt(3).editor;
                    if (record.get('DataType') == 'Date') {
                        record.set('Value', record.get('Value').format('M d, Y H:i'));
                    } else if (record.get('DataType') == 'Number') {
                        record.set('Value', Ext.util.Format.number(record.get('Value'), '0,000.00'));
                    }
                } else if (e.field == 'Remark') {
                    cm = grid.getColumnModel();
                    var editor = cm.getColumnAt(4).editor;
                    if (editor.getValue() == '') {
                        record.set('Remark', e.originalValue);
                    }
                }
            }
        },
        viewConfig: {
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Status',
            header: 'Status',
            sortable: false,
            width: 200,
            ediatable: false,
            menuDisabled: true
        }, {
            dataIndex: 'Value',
            header: 'Value',
            sortable: false,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: true
            }
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: false,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textarea',
                allowBlank: true
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.containerStatus.IncomingGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ containerId: this.containerId, containerStatusType: 'IncomingStatus', operationTypeId: this.operationTypeId }) };
        
        this.bbar = ['->', {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveClick
        }];
        Ext.erp.iffs.ux.containerStatus.IncomingGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.containerStatus.IncomingGrid.superclass.afterRender.apply(this, arguments);
    },
    onSaveClick: function () {
        var gridDetail = Ext.getCmp('containerStatus-incomingGrid');
        var store = gridDetail.getStore();
        var containerId = gridDetail.containerId;

        var containerStatuses = [];
        store.each(function (item) {
            if (item.data['StatusId'] != '') {
                var objStatus = {
                    Id: item.data['Id'],
                    ContainerId: item.data['ContainerId'],
                    StatusId: item.data['StatusId'],
                    Value: item.data['Value'],
                    Remark: item.data['Remark']
                };
                containerStatuses.push(objStatus);
            }
        });

        if (containerStatuses.length == 0) {
            Ext.MessageBox.show({
                title: 'Incomplete',
                msg: 'Empty Container Status cannot be saved!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        Container.SaveStatus(Ext.encode(containerStatuses), function (result) {
            if (result.success) {
                store.baseParams = { param: Ext.encode({ containerId: containerId, containerStatusType: 'IncomingStatus' }) };
                store.load({
                    params: { start: 0, limit: 100 }
                });

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    }
});
Ext.reg('containerStatus-incomingGrid', Ext.erp.iffs.ux.containerStatus.IncomingGrid);


/**
* @desc      Container Return Status grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.containerStatus
* @class     Ext.erp.iffs.ux.containerStatus.ReturnGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.containerStatus.ReturnGrid = function (config) {
    Ext.erp.iffs.ux.containerStatus.ReturnGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Container.GetAllStatus,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Status',
                direction: 'ASC'
            },
            fields: ['Id', 'ContainerId', 'StatusId', 'Status', 'DataType', 'Value', 'Remark'],
            remoteSort: true,
        }),
        id: 'containerStatus-returnGrid',
        loadMask: true,
        pageSize: 10,
        clicksToEdit: 1,
        height: 450,
        columnLines: true,
        stripeRows: true,
        border: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            beforeedit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('containerStatus-returnGrid');

                var store, col;
                if (e.field == 'Value') {
                    col = grid.getColumnModel().getColumnAt(3);

                    if (record.get('DataType') == 'Date') {
                        col.setEditor({
                            xtype: 'datefield',
                            format: 'm/d/Y H:i',
                            editable: true,
                            allowBlank: true,
                            listeners: {
                                focus: function (field) {
                                    if (!isNaN(Date.parse(record.get('Value'), "m/d/Y H:i"))) {
                                        field.setValue(new Date(record.get('Value')));
                                    }
                                }
                            }
                        });
                    } else if (record.get('DataType') == 'Number') {
                        col.setEditor({
                            xtype: 'numberfield',
                            allowBlank: true,
                            listeners: {
                                focus: function (field) {
                                    field.setValue(parseFloat(record.get("Value").split(',').join('')));
                                }
                            }
                        });
                    } else {
                        col.setEditor({
                            xtype: 'textfield',
                            allowBlank: true,
                        });
                    }
                }
            },
            afteredit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('containerStatus-returnGrid');
                var cm;
                if (e.field == 'Value') {
                    cm = grid.getColumnModel();
                    var editor = cm.getColumnAt(3).editor;
                    if (record.get('DataType') == 'Date') {
                        record.set('Value', record.get('Value').format('M d, Y H:i'));
                    } else if (record.get('DataType') == 'Number') {
                        record.set('Value', Ext.util.Format.number(record.get('Value'), '0,000.00'));
                    }
                } else if (e.field == 'Remark') {
                    cm = grid.getColumnModel();
                    var editor = cm.getColumnAt(4).editor;
                    if (editor.getValue() == '') {
                        record.set('Remark', e.originalValue);
                    }
                }
            }
        },
        viewConfig: {
        },
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Status',
            header: 'Status',
            sortable: false,
            width: 200,
            ediatable: false,
            menuDisabled: true
        }, {
            dataIndex: 'Value',
            header: 'Value',
            sortable: false,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textfield',
                allowBlank: true
            }
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: false,
            width: 200,
            menuDisabled: true,
            editor: {
                xtype: 'textarea',
                allowBlank: true
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.containerStatus.ReturnGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ containerId: this.containerId, containerStatusType: 'ReturnStatus', operationTypeId: this.operationTypeId }) };

        this.bbar = ['->', {
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSaveClick
        }];
        Ext.erp.iffs.ux.containerStatus.ReturnGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: {
                start: 0,
                limit: this.pageSize
            }
        });
        Ext.erp.iffs.ux.containerStatus.ReturnGrid.superclass.afterRender.apply(this, arguments);
    },
    onSaveClick: function () {
        var gridDetail = Ext.getCmp('containerStatus-returnGrid');
        var store = gridDetail.getStore();
        var containerId = gridDetail.containerId;

        var containerStatuses = [];
        store.each(function (item) {
            if (item.data['StatusId'] != '') {
                var objStatus = {
                    Id: item.data['Id'],
                    ContainerId: item.data['ContainerId'],
                    StatusId: item.data['StatusId'],
                    Value: item.data['Value'],
                    Remark: item.data['Remark']
                };
                containerStatuses.push(objStatus);
            }
        });

        if (containerStatuses.length == 0) {
            Ext.MessageBox.show({
                title: 'Incomplete',
                msg: 'Empty Container Status cannot be saved!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        Container.SaveStatus(Ext.encode(containerStatuses), function (result) {
            if (result.success) {
                store.baseParams = { param: Ext.encode({ containerId: containerId, containerStatusType: 'ReturnStatus' }) };
                store.load({
                    params: { start: 0, limit: 100 }
                });

                Ext.MessageBox.show({
                    title: 'Success',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO,
                    scope: this
                });
            }
            else {
                Ext.MessageBox.show({
                    title: 'Failure',
                    msg: result.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            }
        });
    }
});
Ext.reg('containerStatus-returnGrid', Ext.erp.iffs.ux.containerStatus.ReturnGrid);