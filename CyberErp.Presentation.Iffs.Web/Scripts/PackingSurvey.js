Ext.ns('Ext.erp.iffs.ux.PackingSurvey');

/**
* @desc      PackingSurveyTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingSurvey
* @class     Ext.erp.iffs.ux.PackingSurvey.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.PackingSurvey.Grid = function (config) {
    Ext.erp.iffs.ux.PackingSurvey.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingSurvey.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'Number', 'SurveyDate', 'PackingDate', 'ReceivingClient', 'OrderingClient', 'PackingDate', 'DepartureDate', 'ServiceType', 'DestinationCountry', 'DestinationAddress', 'ClientStatus'],
            remoteSort: true
        }),
        id: 'PackingSurvey-grid',
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
            click: function () {
                var grid = this;
                var selectedRecord = grid.getSelectionModel().getSelected();
                if (!grid.getSelectionModel().hasSelection()) return;
                var id = grid.getSelectionModel().getSelected().get('Id');
                var form = Ext.getCmp('PackingSurveyDetail-form');
                form.load({
                    params: { id: id },
                    success: function (act, res) {
                        Ext.getCmp('PackingSurveyDetail-grid').loadDetail(res.result.data.Id);
                    }
                });
            },
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Number',
            header: 'Survey Req. No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'SurveyDate',
            header: 'Survey Date',
            sortable: true,
            width: 70,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'PackingDate',
            header: 'Packing Date',
            sortable: true,
            width: 70,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'OrderingClient',
            header: 'Ordering Client',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'ReceivingClient',
            header: 'Receiving Client',
            sortable: true,
            width: 120,
            menuDisabled: true
        }, {
            dataIndex: 'PackingDate',
            header: 'Packing Date',
            sortable: true,
            width: 70,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'DepartureDate',
            header: 'Departure Date',
            sortable: true,
            width: 70,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'ServiceType',
            header: 'Service Type',
            sortable: true,
            width: 120,
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'DestinationCountry',
            header: 'Destination Country',
            sortable: true,
            width: 100,
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'DestinationAddress',
            header: 'Destination Address',
            sortable: true,
            width: 100,
            menuDisabled: true,
            hidden: true
        }, {
            dataIndex: 'ClientStatus',
            header: 'Client Status',
            sortable: true,
            width: 100,
            menuDisabled: true,
            hidden: true
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingSurvey.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingSurvey-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingSurvey.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.PackingSurvey.Grid.superclass.afterRender.apply(this, arguments);
    },
    SaveSurveyServiceRequest: function (serviceId) {
        if (!this.getSelectionModel().hasSelection()) return;
        var packingId = this.getSelectionModel().getSelected().get('Id');
        PackingSurvey.SaveSurveyServiceRequest(packingId, serviceId, function (res) { });
    }
});
Ext.reg('PackingSurvey-grid', Ext.erp.iffs.ux.PackingSurvey.Grid);


/**
* @desc      PackingSurveyTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingSurvey
* @class     Ext.erp.iffs.ux.PackingSurvey.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingSurvey.Panel = function (config) {
    Ext.erp.iffs.ux.PackingSurvey.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,

        tbar: {
            xtype: 'toolbar',
            items: [{
                text: 'New',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Survey', 'CanAdd'),
                handler: this.onNewClick
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Save',
                iconCls: 'icon-save',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Survey', 'CanAdd'),
                handler: this.onSaveClick
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Delete',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Packing Survey', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbfill'
            }, {
                text: 'Detail',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Request', 'CanAdd'),
                menu: [{
                    text: 'Packing Material',
                    handler: this.onPackingMaterialClick,
                    scope: this,
                }, {
                    text: 'Crate and Box',
                    handler: this.onCrateAndBoxClick,
                    scope: this,
                }, {
                    text: 'Truck And Machinary',
                    handler: this.onTruckAndMachinaryClick,
                    scope: this
                }]
            }, {
                xtype: 'button',
                text: 'Add Service Request',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Request', 'CanAdd'),
                handler: this.onAddServiceRequest
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                iconCls: 'icon-preview',
                handler: this.onPreview

            }, {
                xtype: 'textfield',
                id: 'PackingSurvey.searchText',
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
                            var grid = Ext.getCmp('PackingSurvey-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('PackingSurvey-grid');
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
                    var searchText = Ext.getCmp('PackingSurvey.searchText').getValue();
                    window.open('PackingSurvey/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingSurvey.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: false,
                layout: 'fit',
                margins: '3 0 0 3',
                cmargins: '3 3 0 3',
                width: 450,
                minSize: 450,
                maxSize: 500,
                items: [{
                    xtype: 'PackingSurvey-grid',
                    id: 'PackingSurvey-grid'
                }]
            }, {
                region: 'center',
                collapsible: false,
                split: true,
                layout: 'fit',
                margins: '3 3 0 0',
                cmargins: '3 3 0 0',
                items: [{
                    xtype: 'PackingSurveyDetail-panel',
                    id: 'PackingSurveyDetail'
                }]
            }]
        }];
        Ext.erp.iffs.ux.PackingSurvey.Panel.superclass.initComponent.apply(this, arguments);
    },
    onPackingMaterialClick: function () {
        var grid = Ext.getCmp('PackingSurvey-grid');
        if (grid.getSelectionModel().hasSelection()) {
            var id = grid.getSelectionModel().getSelected().get('Id');
            new Ext.erp.iffs.ux.PackingMaterialSurvey.Window({ HeaderId: id }).show();
        }
    },
    afterRender: function () {

        Ext.erp.iffs.ux.PackingSurvey.Panel.superclass.afterRender.apply(this, arguments);
    },
    onNewClick: function () {
        var form = Ext.getCmp('PackingSurveyDetail-form').getForm();
        form.reset();
        Ext.getCmp('PackingSurveyDetail-grid').ClearStore();
    },
    onSaveClick: function () {
        var form = Ext.getCmp('PackingSurveyDetail-form');
        var formRes = form.SaveForm();
        form.on({
            actioncomplete: function (form, action) {
                if (action.type == 'directsumbit') {
                    var gridRes = Ext.getCmp('PackingSurveyDetail-grid').SaveDetail(action.result.HeaderId);
                    if (gridRes.success) {
                        Ext.MessageBox.show({
                            title: 'Packing Survey',
                            msg: gridRes.data,
                            buttons: Ext.Msg.OK,
                            scope: this
                        });
                        Ext.getCmp('PackingSurvey-paging').doRefresh();
                    }
                }
            }
        });
        ////if (formRes != undefined && formRes.IsSuccess) {
        ////    Ext.getCmp('PackingSurveyDetail-grid').SaveDetail(formRes.HeaderId);

            

        ////} if (formRes != undefined && !formRes.IsSuccess) {
            

        ////}
    },
    onPreview: function () {
        var grid = Ext.getCmp('PackingSurvey-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('PackingSurvey-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected PackingSurvey',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    PackingSurvey.Delete(id, function (result, response) {
                        Ext.getCmp('PackingSurvey-paging').doRefresh();
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
    onApprove: function () {
        var grid = Ext.getCmp('PackingSurvey-grid');
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
                        cmpPaging: Ext.getCmp('PackingSurvey-paging'),
                        api: {
                            submit: PackingSurvey.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    },
    onAddServiceRequest: function () {
        var grid = Ext.getCmp('PackingSurvey-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.serviceRequest.Window({
            ServiceRequestId: '',
            PackingSurveyId: id,
            title: 'Add Service Request'
        }).show();

    }
});
Ext.reg('PackingSurvey-panel', Ext.erp.iffs.ux.PackingSurvey.Panel);



