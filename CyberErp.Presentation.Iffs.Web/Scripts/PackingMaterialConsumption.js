Ext.ns('Ext.erp.iffs.ux.PackingMaterialConsumption');



/**
* @desc      PackingTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialConsumption
* @class     Ext.erp.iffs.ux.PackingMaterialConsumptionGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingMaterialConsumption.CrateAndBoxGrid = function (config) {
    Ext.erp.iffs.ux.PackingMaterialConsumption.CrateAndBoxGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingMaterialConsumption.GetAllCrateAndBoxDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'CrateAndBoxDetailId', 'BoxType', 'Length', 'Width', 'Height', 'Requested', 'Consumed', 'Returned', 'MeasurmentUnit', 'Remarks'],
            remoteSort: true
        }),
        //id: 'Packing-grid',
        pageSize: 30,
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
            afteredit: function (e) {
                var rec = e.record;
                var recVal = rec.data.Requested - e.value;

                if (e.field == 'Consumed') {
                    rec.set('Returned', recVal);
                    if (recVal < 0) {
                        Ext.MessageBox.alert('Consumed Cannot be greater than Requested.');
                        rec.set('Consumed', rec.data.Requested);
                        rec.set('Returned', '0');
                    }
                }
                if (e.field == 'Returned') {
                    rec.set('Consumed', recVal);
                    if (recVal < 0) {
                        Ext.MessageBox.alert('Consumed Cannot be greater than Requested.');
                        rec.set('Returned', rec.data.Requested);
                        rec.set('Consumed', '0');
                    }
                }

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
            dataIndex: 'CrateAndBoxDetailId',
            header: 'CrateAndBoxDetailId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'BoxType',
            header: 'BoxType',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Length',
            header: 'Length',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Width',
            header: 'Width',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Height',
            header: 'Height',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Requested',
            header: 'Requested',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Consumed',
            header: 'Consumed',
            sortable: true,
            width: 100,
            //  menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Returned',
            header: 'Returned',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'MeasurmentUnit',
            header: 'MeasurmentUnit',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: PackingMaterialConsumption.GetMeasurementUnits }
                }),
                valueField: 'Id',
                displayField: 'Name',
                pageSize: 10
            })
        }, {
            dataIndex: 'Remarks',
            header: 'Remarks',
            sortable: true,
            width: 150,
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
Ext.extend(Ext.erp.iffs.ux.PackingMaterialConsumption.CrateAndBoxGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingMaterialConsumption-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingMaterialConsumption.CrateAndBoxGrid.superclass.initComponent.apply(this, arguments);
    },
    SaveDetail: function (packingId) {
        var gridDatastore = this.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var materialConsumptions = [];

        gridDatastore.each(function (item) {
            if (item.data.Consumed == 0 && item.data.Returned == 0) {
                QuantityError = 'Consumed or Returned Must be greater Than Zero';
            }

            if (item.data.Id == null)
                item.data.Id = 0;
            materialConsumptions.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing Material Consumption ',
                msg: extMessage + ", But PackingMaterialConsumptionDetail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing Material Consumption ',
                msg: QuantityError + ', So the Packing Material Consumption has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingMaterialConsumption.SaveCrateAndBoxConsumption(packingId, materialConsumptions, function (rest, resp) {
            if (resp.success) {
                Ext.MessageBox.show({
                    title: 'Packing Material Consumption',
                    msg: res.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingMaterialConsumption-paging').doRefresh();
                Ext.getCmp('PackingMaterialConsumption-window').close();
            }
        });
    },
    loadDetail: function (HeaderId) {
        var gridStore = this.getStore();

        gridStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        gridStore.load({
            params: { start: 0, limit: this.pageSize }
        });

    }
});
Ext.reg('CrateAndBoxConsumption-grid', Ext.erp.iffs.ux.PackingMaterialConsumption.CrateAndBoxGrid);
/**
* @desc      PackingMaterialConsumptionTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialConsumption
* @class     Ext.erp.iffs.ux.PackingMaterialConsumption.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingMaterialConsumption.MaterialGrid = function (config) {
    Ext.erp.iffs.ux.PackingMaterialConsumption.MaterialGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingMaterialConsumption.GetAllMaterialDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Description',
                direction: 'ASC'
            },
            fields: ['Id', 'PackingMaterialId', 'Description', 'MeasurmentUnit', 'Requested', 'Consumed', 'Returned', 'Remarks'],
            remoteSort: true
        }),
        //id: 'PackingMaterialConsumption-grid',
        pageSize: 30,
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
            afteredit: function (e) {
                var rec = e.record;
                var recVal = rec.data.Requested - e.value;

                if (e.field == 'Consumed') {
                    rec.set('Returned', recVal);
                    if (recVal < 0) {
                        Ext.MessageBox.alert('Consumed Cannot be greater than Requested.');
                        rec.set('Consumed', rec.data.Requested);
                        rec.set('Returned', '0');
                    }
                }
                if (e.field == 'Returned') {
                    rec.set('Consumed', recVal);
                    if (recVal < 0) {
                        Ext.MessageBox.alert('Consumed Cannot be greater than Requested.');
                        rec.set('Returned', rec.data.Requested);
                        rec.set('Consumed', '0');
                    }
                }
                
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
            dataIndex: 'PackingMaterialId',
            header: 'PackingMaterialId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'MeasurmentUnit',
            header: 'Measurment Unit',
            sortable: true,
            width: 100,
            menuDisabled: true,
            forceSelection: true,
            xtype: 'combocolumn',
            editor: new Ext.form.ComboBox({
                typeAhead: false,
                triggerAction: 'all',
                mode: 'local',
                allowBlank: false,
                store: new Ext.data.DirectStore({
                    reader: new Ext.data.JsonReader({
                        successProperty: 'success',
                        idProperty: 'Id',
                        root: 'data',
                        fields: ['Id', 'Name']
                    }),
                    autoLoad: true,
                    api: { read: PackingMaterialConsumption.GetMeasurementUnits }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'Requested',
            header: 'Requested',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Consumed',
            header: 'Consumed',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Returned',
            header: 'Returned',
            sortable: true,
            width: 100,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Remarks',
            header: 'Remarks',
            sortable: true,
            width: 150,
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
Ext.extend(Ext.erp.iffs.ux.PackingMaterialConsumption.MaterialGrid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingMaterialConsumptionDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingMaterialConsumption.MaterialGrid.superclass.initComponent.apply(this, arguments);
    },
    SaveDetail: function (packingId) {
        var grid = Ext.getCmp('PackingMaterialConsumptionDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var materialConsumptions = [];

        gridDatastore.each(function (item) {
            if (item.data.Consumed == 0 && item.data.Returned == 0) {
                QuantityError = 'Consumed or Returned Must be greater Than Zero';
            }
            if (item.data.Id == null)
                item.data.Id = 0;
            materialConsumptions.push(item.data);
        });


        if (totalCount == 0) {
            Ext.MessageBox.show({
                title: 'Packing Material Consumption ',
                msg: extMessage + ", But PackingMaterialConsumptionDetail is empty !",
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }
        if (QuantityError != '') {
            Ext.MessageBox.show({
                title: 'Packing Material Consumption ',
                msg: QuantityError + ', So the Packing Material Consumption has been jumped!',
                buttons: Ext.Msg.OK,
                scope: this
            });
            return;
        }

        PackingMaterialConsumption.SaveMaterialConsumption(packingId, materialConsumptions, function (rest, resp) {
            if (resp.success) {
                Ext.MessageBox.show({
                    title: 'Packing Material Consumption',
                    msg: res.result.data,
                    buttons: Ext.Msg.OK,
                    scope: this
                });
                Ext.getCmp('PackingMaterialConsumption-paging').doRefresh();
                Ext.getCmp('PackingMaterialConsumption-window').close();
            }
        });
    },
    loadDetail: function (HeaderId) {
        var gridStore = this.getStore();

        gridStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        gridStore.load({
            params: { start: 0, limit: this.pageSize }
        });
    }
});
Ext.reg('PackingMaterialConsumptionDetail-grid', Ext.erp.iffs.ux.PackingMaterialConsumption.MaterialGrid);


/**
* @desc      PackingMaterialConsumptionTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingMaterialConsumption
* @class     Ext.erp.iffs.ux.PackingMaterialConsumption.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingMaterialConsumption.Panel = function (config) {
    Ext.erp.iffs.ux.PackingMaterialConsumption.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: ['Operation No.', {
                hiddenName: 'OperationId',
                xtype: 'combo',
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
                displayField: 'Number',
                listeners: {
                    select: function (cmb, idx) {
                        Ext.getCmp('PackingConsumption-grid').LoadGrid(idx.id);
                    }
                }

            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Truck Or Machines Used',
                iconCls: 'icon-add',
                handler: this.onAddTruckOrMachines
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'PackingMaterialConsumption.searchText',
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
                            var grid = Ext.getCmp('PackingMaterialConsumption-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingMaterialConsumption-grid');
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
                    var searchText = Ext.getCmp('PackingMaterialConsumption.searchText').getValue();
                    window.open('PackingMaterialConsumption/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingMaterialConsumption.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                collapsible: true,
                split: true,
                width: 400,
                minSize: 350,
                layout: 'fit',
                margins: '0 3 0 3',
                title: 'Packing',
                items: [{
                    xtype: 'Packing-grid',
                    id: 'PackingConsumption-grid',
                    Caller: 'Consumption',
                }]
            }, {
                region: 'center',
                split: true,
                layout: 'fit',
                margins: '0 3 0 3',
                title: 'Packing Material Requested',
                items: [{
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: { margins: '0 5 5 0' },
                    items: [{
                        xtype: 'PackingMaterial-grid',
                        id: 'MaterialConsumption-grid',
                        Caller: 'Consumption',
                        flex: 1
                    }, {
                        title: 'Packing Material Consumption Detail',
                        xtype: 'PackingMaterialConsumptionDetail-grid',
                        id: 'PackingMaterialConsumptionDetail-grid',
                        flex: 1
                    }],
                    tbar: [{
                        xtype: 'button',
                        text: 'Save',
                        iconCls: 'icon-save',
                        disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Consumption', 'CanAdd'),
                        handler: function () {
                            var packingGrid = Ext.getCmp('PackingConsumption-grid');
                            if (!packingGrid.getSelectionModel().hasSelection()) {
                                Ext.MessageBox.show({
                                    title: 'Select',
                                    msg: 'You must select Packing Operation To save Material Consumption',
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO,
                                    scope: this
                                });
                                return;
                            }
                            var packingId = packingGrid.getSelectionModel().getSelected().get('Id');
                            Ext.getCmp('PackingMaterialConsumptionDetail-grid').SaveDetail(packingId);
                        }
                    }, {
                        xtype: 'tbseparator'
                    }, {
                        xtype: 'button',
                        text: 'Preview',
                        iconCls: 'icon-preview',
                        handler: this.onMaterialConsumptionPreview
                    }]
                }]
            }, {
                region: 'east',
                layout: 'fit',
                split: true,
                width: 700,
                minSize: 550,
                margins: '0 3 0 0',
                title: 'Crate And Box Requested',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'start'
                },
                defaults: { margins: '0 5 5 0' },
                items: [{
                    xtype: 'PackingCrateAndBoxRequest',
                    id: 'CrateAndBoxRequestConsumption-grid',
                    Caller: 'Consumption',
                    flex: 1
                }, {
                    title: 'Crate And Box Consumption ',
                    xtype: 'CrateAndBoxConsumption-grid',
                    id: 'CrateAndBoxConsumption-grid',
                    flex: 1
                }],
                tbar: [{
                    xtype: 'button',
                    text: 'Save',
                    iconCls: 'icon-save',
                    disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Material Consumption', 'CanAdd'),
                    handler: function () {
                        var packingGrid = Ext.getCmp('PackingConsumption-grid');
                        if (!packingGrid.getSelectionModel().hasSelection()) {
                            Ext.MessageBox.show({
                                title: 'Select',
                                msg: 'You must select Packing Operation To save Crate And Box Consumption',
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                            return;
                        }
                        var packingId = packingGrid.getSelectionModel().getSelected().get('Id');
                        Ext.getCmp('CrateAndBoxConsumption-grid').SaveDetail(packingId);
                    }
                }, {
                    xtype: 'tbseparator'
                }, {
                    xtype: 'button',
                    text: 'Preview',
                    iconCls: 'icon-preview',
                    handler: this.onCrateAndBoxConsumptionPreview
                }]
            }]
        }];
        Ext.erp.iffs.ux.PackingMaterialConsumption.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.PackingMaterialConsumption.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddTruckOrMachines: function () {
        var packingGrid = Ext.getCmp('PackingConsumption-grid');
        if (!packingGrid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Select',
                msg: 'You must select Packing Operation To save Material Consumption',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        var packingId = packingGrid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.PackingTruckAndMachine.Window({
            HeaderId: packingId,
            isRevised: false,
            title: 'Add Truck And Machine used For Packing '
        }).show();
    },
    onMaterialConsumptionPreview: function () {
        //var grid = Ext.getCmp('PackingMaterialConsumption-grid');
        //var selectedRecord = grid.getSelectionModel().getSelected();
        //if (!grid.getSelectionModel().hasSelection()) return;
        //var id = grid.getSelectionModel().getSelected().get('Id');

        //  Ext.getCmp('PackingMaterialConsumptionDetail-grid').SaveDetail();
    },
    onCrateAndBoxConsumptionPreview: function () {
        //var grid = Ext.getCmp('PackingMaterialConsumption-grid');
        //var selectedRecord = grid.getSelectionModel().getSelected();
        //if (!grid.getSelectionModel().hasSelection()) return;
        //var id = grid.getSelectionModel().getSelected().get('Id');
        //new Ext.erp.iffs.ux.PackingMaterialConsumption.Window({
        //    Id: id,
        //    isRevised: false,
        //    title: 'Edit PackingMaterialConsumption'
        //}).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('PackingMaterialConsumption-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingMaterialConsumption-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingMaterialConsumption',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingMaterialConsumption.Delete(id, function (result, response) {
                        Ext.getCmp('PackingMaterialConsumption-paging').doRefresh();
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
    onCheck: function () {
        var grid = Ext.getCmp('PackingMaterialConsumption-grid');
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
                        cmpPaging: Ext.getCmp('PackingMaterialConsumption-paging'),
                        api: {
                            submit: PackingMaterialConsumption.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('PackingMaterialConsumption-panel', Ext.erp.iffs.ux.PackingMaterialConsumption.Panel);



