Ext.ns('Ext.erp.iffs.ux.jobOrderDocumentChecklist');

/**
* @desc      Job Order grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocumentChecklist
* @class     Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid = function (config) {
    Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrder.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'JobOrderNo',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderNo', 'Version', 'OperationTypeId', 'Date', 'ReceivingClient', 'IsChecked', 'IsApproved', 'IsRequiredDocumentsSubmited'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    this.body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    this.body.unmask();
                },
                loadException: function () {
                    this.body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrderDocumentChecklist-jobOrderGrid',
        pageSize: 15,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {

        },
        listeners: {
            rowClick: function (grid, rowIndex, e) {
                var jobOrderDocumentChecklistGrid = Ext.getCmp('jobOrderDocumentChecklist-grid');
                var jobOrderDocumentChecklistStore = jobOrderDocumentChecklistGrid.getStore();

                var jobOrderDocumentChecklistTemplateGrid = Ext.getCmp('jobOrderDocumentChecklist-templateGrid');
                var jobOrderDocumentChecklistTemplateStore = jobOrderDocumentChecklistTemplateGrid.getStore();

                var jobOrderId = 0;
                var operationTypeId = 0;
                if (this.getSelectionModel().hasSelection()) {
                    jobOrderId = this.getSelectionModel().getSelected().get('Id');
                    operationTypeId = this.getSelectionModel().getSelected().get('OperationTypeId');
                }
                jobOrderDocumentChecklistStore.baseParams = { record: Ext.encode({ jobOrderId: jobOrderId }) };
                jobOrderDocumentChecklistStore.load({ params: { start: 0, limit: 100 } });

                jobOrderDocumentChecklistTemplateStore.baseParams = { param: Ext.encode({ operationTypeId: operationTypeId }) };
                jobOrderDocumentChecklistTemplateStore.load({ params: { start: 0, limit: 100 } });


                Ext.getCmp('jobOrderDocumentChecklist-jobOrderLabel').setValue('Job Order No: ' + this.getSelectionModel().getSelected().get('JobOrderNo'));
            },
            containermousedown: function (grid) {

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
            dataIndex: 'JobOrderNo',
            header: 'Job Order No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Version',
            header: 'Version',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Date',
            header: 'Date',
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
            dataIndex: 'IsRequiredDocumentsSubmited',
            header: ' Required Documents Submited?',
            sortable: false,
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
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };

        this.tbar = ['->', {
            xtype: 'textfield',
            emptyText: 'Type search text here',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '200px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('jobOrderDocumentChecklist-jobOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('jobOrderDocumentChecklist-jobOrderGrid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize} });
                    }
                }
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'jobOrderDocumentChecklist-jobOrderPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({ params: { start: 0, limit: this.pageSize} });
        Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocumentChecklist-jobOrderGrid', Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid);

/**
* @desc      Job Document Checklist grid
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocumentChecklist
* @class     Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid = function (config) {
    Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderDocument.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'JobOrderHeaderId', 'DocumentType', 'FileName', 'NoOfPagesOriginal', 'NoOfPagesCopy', 'NoOfAttachedPagesOriginal', 'NoOfAttachedPagesCopy', 'Remark'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-grid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-grid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-grid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrderDocumentChecklist-grid',
        pageSize: 10,
        stripeRows: true,
        columnLines: true,
        border: true,
        clicksToEdit: 1,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        columns: [{
            dataIndex: 'Id',
            header: 'Id',
            sortable: false,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DocumentType',
            header: 'Document Type',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'FileName',
            header: 'File Name',
            sortable: false,
            width: 150,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfPagesOriginal',
            header: 'No of Docs(Original)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfPagesCopy',
            header: 'No of Docs(Copy)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfAttachedPagesOriginal',
            header: 'No of Attached Docs(Original)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'NoOfAttachedPagesCopy',
            header: 'No of Attached Docs(Copy)',
            sortable: false,
            width: 80,
            menuDisabled: true
        }, {
            dataIndex: 'Remark',
            header: 'Remark',
            sortable: false,
            width: 300,
            menuDisabled: true
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ jobOrderId: 0 }) };
        this.tbar = [{
            xtype: 'displayfield',
            id: 'jobOrderDocumentChecklist-jobOrderLabel',
            style: 'font-weight: bold',
            value: 'Job Order No:'
        }];
        
        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocumentChecklist-grid', Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid);

/**
* @desc      Job Document Template Grid
* @author    Meftuh Mohammed
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.jobOrderDocumentChecklist
* @class     Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid = function (config) {
    Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: OperationDocumentTemplate.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'DocumentType',
                direction: 'ASC'
            },
            fields: ['Id', 'DocumentTypeId', 'DocumentType'],
            remoteSort: true,
            listeners: {
                beforeLoad: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-templateGrid').body.mask('Loading...', 'x-mask-loading');
                },
                load: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-templateGrid').body.unmask();
                },
                loadException: function () {
                    Ext.getCmp('jobOrderDocumentChecklist-templateGrid').body.unmask();
                },
                scope: this
            }
        }),
        id: 'jobOrderDocumentChecklist-templateGrid',
        pageSize: 30,
        stripeRows: true,
        height: 400,
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
        }, {
            dataIndex: 'DocumentTypeId',
            header: 'DocumentTypeId',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'DocumentType',
            header: 'DocumentType',
            sortable: true,
            width: 350,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ operationTypeId: 0 }) };
        this.tbar = [{
            xtype: 'displayfield',
            style: 'font-weight: bold',
            value: 'Document Template List'
        }];

        this.bbar = new Ext.PagingToolbar({
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });

        Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOrderDocumentChecklist-templateGrid', Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid);

/**
* @desc      Job Document Checklist panel
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.jobOrderDocumentChecklist
* @class     Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel = function (config) {
    Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Checklist Approval',
                iconCls: 'icon-select',
                disabled: !(Ext.erp.iffs.ux.Reception.getPermission('Job Order Document Checklist', 'CanCertify') || Ext.erp.iffs.ux.Reception.getPermission('Job Order Document Checklist', 'CanApprove')),
                handler: this.onCheckChecklistCompleted
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel, Ext.Panel, {
    initComponent: function () {
        this.jobOrderGrid = new Ext.erp.iffs.ux.jobOrderDocumentChecklist.JobOrderGrid();
        this.jobOrderDocumentChecklistGrid = new Ext.erp.iffs.ux.jobOrderDocumentChecklist.Grid();
        this.templateGrid = new Ext.erp.iffs.ux.jobOrderDocumentChecklist.TemplateGrid();

        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                collapsible: true,
                split: true,
                width: 400,
                minSize: 200,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.jobOrderGrid]
            }, {
                region: 'center',
                border: false,
                layout: 'fit',
                items: [this.jobOrderDocumentChecklistGrid]
            }, {
                region: 'east',
                border: true,
                collapsible: false,
                split: true,
                width: 300,
                minSize: 200,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.templateGrid]
            }]
        }];
        Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel.superclass.initComponent.apply(this, arguments);
    },
    onCheckChecklistCompleted: function () {
        var grid = Ext.getCmp('jobOrderDocumentChecklist-jobOrderGrid');
        if (!grid.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
                title: 'Validation',
                msg: 'You must select a Job Order.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }
        
        var submittedDocCount = Ext.getCmp('jobOrderDocumentChecklist-grid').getStore().getTotalCount();
        var templateDocCount = Ext.getCmp('jobOrderDocumentChecklist-templateGrid').getStore().getTotalCount();

        if (submittedDocCount < templateDocCount) {
            Ext.MessageBox.show({
                title: 'Validation',
                msg: 'All the documents defined in the template are not completly submitted.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.INFO,
                scope: this
            });
            return;
        }

        var selectedRecord = grid.getSelectionModel().getSelected();
        var id = selectedRecord.get('Id');

        Ext.MessageBox.show({
            title: 'Checking',
            msg: 'Are you sure you want to approve that all the required documents are submitted?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            width: 400,
            fn: function (buttonType) {
                if (buttonType == 'yes') {
                    JobOrderDocument.ApproveDocumentSubmitted(id, function (result, response) {
                        Ext.getCmp('jobOrderDocumentChecklist-jobOrderPaging').doRefresh();
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
});
Ext.reg('jobOrderDocumentChecklist-panel', Ext.erp.iffs.ux.jobOrderDocumentChecklist.Panel);