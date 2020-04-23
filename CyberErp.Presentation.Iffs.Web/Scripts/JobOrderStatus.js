Ext.ns('Ext.erp.iffs.ux.jobOrderStatus');

/**
* @desc      Job Order Grid grid
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.jobOrderStatus
* @class     Ext.erp.iffs.ux.jobOrderStatus.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderStatus.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrderStatus.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.GroupingStore({
            proxy: new Ext.data.DirectProxy({
                directFn: JobOrderStatus.GetOperations,
                paramsAsHash: false,
                paramOrder: 'start|limit|sort|dir|param'
            }),
            reader: new Ext.data.JsonReader({
                root: 'data',
                idProperty: 'Id',
                totalProperty: 'total',
                fields: ['Id', 'JobOrderHeaderId', 'OperationNo', 'JobOrderNo', 'Version', 'OperationTypeId', 'OperationType', 'Date', 'ReceivingClient', 'UltimateClient', 'IsChecked', 'IsApproved', 'PreparedBy', 'PreparedDate', 'CheckedBy', 'CheckedDate', 'ApprovedBy', 'ApprovalDate', 'IsRequiredDocumentsSubmited']
            }),
            groupField: 'JobOrderNo',
            sortInfo: {
                field: 'JobOrderNo',
                direction: 'ASC'
            },

            remoteSort: true
        }),
        id: 'jobOrderStatus-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        view: new Ext.grid.GroupingView({
            forceFit: false,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Operations" : "Operation"]})'
        }),
        listeners: {
            rowClick: function () {
                this.loadStatus();
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
            dataIndex: 'JobOrderHeaderId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            hidden: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'OperationNo',
            header: 'OperationNo',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OperationType',
            header: 'Operation Type',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivingClient',
            header: 'Receiving Client',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'UltimateClient',
            header: 'Ultimate Client',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedBy',
            header: 'Prepared By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'PreparedDate',
            header: 'Prepared Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CheckedBy',
            header: 'Checked By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'CheckedDate',
            header: 'Checked Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ApprovedBy',
            header: 'Approved By',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ApprovalDate',
            header: 'Approval Date',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IsChecked',
            header: 'Checked?',
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
        }, {
            dataIndex: 'IsApproved',
            header: 'Approved?',
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
        }, {
            dataIndex: 'IsRequiredDocumentsSubmited',
            header: 'Required Docs Submited?',
            sortable: true,
            width: 150,
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
}
Ext.extend(Ext.erp.iffs.ux.jobOrderStatus.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };

        this.tbar = [{
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
                        var grid = Ext.getCmp('jobOrderStatus-grid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('jobOrderStatus-grid');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }];

        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderStatus-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderStatus.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.jobOrderStatus.Grid.superclass.afterRender.apply(this, arguments);
    },
    loadStatus: function () {
        var jobOrderStatusDetailGrid = Ext.getCmp('jobOrderStatus-detailGrid');
        var jobOrderStatusDetailStore = jobOrderStatusDetailGrid.getStore();

        var operationId = this.getSelectionModel().getSelected().get('Id');
        jobOrderStatusDetailGrid.operationId = operationId;
        jobOrderStatusDetailStore.baseParams = { param: Ext.encode({ operationId: operationId }) };
        jobOrderStatusDetailStore.load({
            params: { start: 0, limit: jobOrderStatusDetailGrid.pageSize }
        });
    }
});
Ext.reg('jobOrderStatus-grid', Ext.erp.iffs.ux.jobOrderStatus.Grid);

/**
* @desc      Job Order Status grid
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.jobOrderStatus
* @class     Ext.erp.iffs.ux.jobOrderStatus.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.jobOrderStatus.GridDetail = function (config) {
    Ext.erp.iffs.ux.jobOrderStatus.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderStatus.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
          //  idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Status',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'StatusId', 'Status', 'DataType', 'Value', 'Remark'],
            remoteSort: true,
        }),
        id: 'jobOrderStatus-detailGrid',
        loadMask: true,
        pageSize: 30,
        clicksToEdit: 1,
        height: 350,
        jobOrderId: 0,
        columnLines: true,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            beforeedit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('jobOrderStatus-detailGrid');

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
                var grid = Ext.getCmp('jobOrderStatus-detailGrid');
                var cm;
                if (e.field == 'Value') {
                    cm = grid.getColumnModel();
                    var editor = cm.getColumnAt(3).editor;
                    if (record.get('DataType') == 'Date') {
                        record.set('Value', record.get('Value').format('M d, Y H:i'));
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
Ext.extend(Ext.erp.iffs.ux.jobOrderStatus.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanAdd'),
            handler: this.onSaveClick
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderStatus-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderStatus.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.iffs.ux.jobOrderStatus.Grid.superclass.afterRender.apply(this, arguments);
    },
    onSaveClick: function () {
        var gridDetail = Ext.getCmp('jobOrderStatus-detailGrid');
        var store = gridDetail.getStore();
        var operationId = gridDetail.operationId;

        var joStatuses = [];
        store.each(function (item) {
            if (item.data['StatusId'] != '') {
                var objStatus = {
                    Id: item.data['Id'],
                    OperationId: item.data['OperationId'],
                    StatusId: item.data['StatusId'],
                    Value: item.data['Value'],
                    Remark: item.data['Remark']
                };
                joStatuses.push(objStatus);
            }
        });

        if (joStatuses.length == 0) {
            Ext.MessageBox.show({
                title: 'Incomplete',
                msg: 'Empty Operation Status cannot be saved!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        JobOrderStatus.SaveStatus(Ext.encode(joStatuses), function (result) {
            if (result.success) {
                store.baseParams = { param: Ext.encode({ operationId: operationId }) };
                store.load({
                    params: { start: 0, limit: gridDetail.pageSize }
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
Ext.reg('jobOrderStatus-detailGrid', Ext.erp.iffs.ux.jobOrderStatus.GridDetail);

/**
* @desc      Job Order Status panel
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.jobOrderStatus
* @class     Ext.erp.iffs.ux.jobOrderStatus.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.jobOrderStatus.Panel = function (config) {
    Ext.erp.iffs.ux.jobOrderStatus.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'jobOrderStatus-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderStatus.Panel, Ext.Panel, {
    initComponent: function () {
        this.gridDetail = new Ext.erp.iffs.ux.jobOrderStatus.GridDetail();
        this.grid = new Ext.erp.iffs.ux.jobOrderStatus.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 700,
                minSize: 200,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.grid]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.gridDetail]
            }]
        }];
        Ext.erp.iffs.ux.jobOrderStatus.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderStatus-panel', Ext.erp.iffs.ux.jobOrderStatus.Panel);