Ext.ns('Ext.erp.iffs.ux.operation');

/**
* @desc      operation form
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 9, 2018
* @namespace Ext.erp.iffs.ux.operation
* @class     Ext.erp.iffs.ux.operation.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.operation.Form = function (config) {
    Ext.erp.iffs.ux.operation.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: Operation.Get,
            submit: Operation.Save
        },
        paramOrder: ['id'],
        defaults: {
            //anchor: '95%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'operation-form',
        padding: 5,
        labelWidth: 140,
        autoHeight: false,
        border: false,
        bodyStyle: 'background: #dfe8f6; padding: 20px 5px 5px 10px;',
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
                labelWidth: 120,
                defaults: {
                    anchor: '96%'
                },
                items: [{
                    name: 'Id',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedById',
                    xtype: 'hidden'
                }, {
                    name: 'PreparedDate',
                    xtype: 'hidden'
                }, {
                    name: 'CheckedById',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovedById',
                    xtype: 'hidden'
                }, {
                    name: 'CheckedDate',
                    xtype: 'hidden'
                }, {
                    name: 'ApprovalDate',
                    xtype: 'hidden'
                }, {
                    name: 'JobOrderId',
                    xtype: 'hidden'
                }, {
                    name: 'OperationTypeId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'JobOrder',
                    xtype: 'combo',
                    fieldLabel: 'Job Order',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    allowBlank: false,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {Id}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {OperationType}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'OperationTypeId', 'OperationType']
                        }),
                        api: { read: Operation.GetFilteredJobOrders }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('JobOrderId').setValue(rec.id);
                            var operationid = rec.data.OperationTypeId;
                            form.findField('OperationTypeId').setValue(operationid);

                            if (operationid == 3) { //Ocean Import
                                form.findField('ClientReferenceNo').show();
                                form.findField('GoodsDescription').show();
                                form.findField('MBLNo').show();
                                form.findField('HBLNo').show();
                                form.findField('SSLine').show();
                                form.findField('Vessel').show();
                                form.findField('Voyage').show();
                                form.findField('PortOfOriginId').show();
                                form.findField('PortOfDestinationId').show();
                                form.findField('ETAPort').show();
                                form.findField('PortDischargeDate').show();
                                form.findField('NumberOfContainers').show();
                                form.findField('packageCompositeField').show();
                                form.findField('LoadingPortId').show();

                                form.findField('MAWBNo').hide();
                                form.findField('HAWBNo').hide();
                                form.findField('Carrier').hide();
                                form.findField('FlightNo').hide();
                                form.findField('LoadingAir').hide();
                                form.findField('ETD').hide();
                                form.findField('ETA').hide();
                                form.findField('CargoAgent').hide();
                            }
                            else if (operationid == 4) { //Ocean Export
                                form.findField('ClientReferenceNo').show();
                                form.findField('GoodsDescription').show();
                                form.findField('MBLNo').show();
                                form.findField('HBLNo').show();
                                form.findField('SSLine').show();
                                form.findField('Vessel').show();
                                form.findField('Voyage').show();
                                form.findField('PortOfOriginId').show();
                                form.findField('PortOfDestinationId').show();
                                form.findField('ETAPort').show();
                                form.findField('PortDischargeDate').show();
                                form.findField('NumberOfContainers').show();
                                form.findField('packageCompositeField').show();
                                form.findField('LoadingPortId').show();

                                form.findField('MAWBNo').hide();
                                form.findField('HAWBNo').hide();
                                form.findField('Carrier').hide();
                                form.findField('FlightNo').hide();
                                form.findField('LoadingAir').hide();
                                form.findField('ETD').hide();
                                form.findField('ETA').hide();
                                form.findField('CargoAgent').hide();
                            }
                            else if (operationid == 1) { //Air Import
                                form.findField('ClientReferenceNo').show();
                                form.findField('GoodsDescription').show();
                                form.findField('MAWBNo').show();
                                form.findField('HAWBNo').show();
                                form.findField('Carrier').show();
                                form.findField('FlightNo').show();
                                form.findField('LoadingAir').show();
                                form.findField('ETD').show();
                                form.findField('ETA').show();
                                form.findField('MBLNo').hide();
                                form.findField('HBLNo').hide();
                                form.findField('SSLine').hide();
                                form.findField('Vessel').hide();
                                form.findField('Voyage').hide();
                                form.findField('PortOfOriginId').show();
                                form.findField('PortOfDestinationId').show();
                                form.findField('ETAPort').hide();
                                form.findField('PortDischargeDate').show();
                                form.findField('NumberOfContainers').hide();
                                form.findField('packageCompositeField').show();
                                form.findField('LoadingPortId').show();
                                form.findField('CargoAgent').hide();
                            }
                            else if (operationid == 2 || operationid == 7) { //Air Export and FZ Operation
                                form.findField('ClientReferenceNo').show();
                                form.findField('GoodsDescription').show();
                                form.findField('MAWBNo').show();
                                form.findField('HAWBNo').show();
                                form.findField('Carrier').hide();
                                form.findField('FlightNo').hide();
                                form.findField('LoadingAir').hide();
                                form.findField('ETD').hide();
                                form.findField('ETA').hide();
                                form.findField('MBLNo').hide();
                                form.findField('HBLNo').hide();
                                form.findField('SSLine').hide();
                                form.findField('Vessel').hide();
                                form.findField('Voyage').hide();
                                form.findField('PortOfOriginId').hide();
                                form.findField('PortOfDestinationId').hide();
                                form.findField('ETAPort').hide();
                                form.findField('PortDischargeDate').hide();
                                form.findField('NumberOfContainers').hide();
                                form.findField('packageCompositeField').show();
                                form.findField('LoadingPortId').hide();
                                form.findField('CargoAgent').show();
                            }
                            else if (operationid == 8) { //TR Operation
                                form.findField('ClientReferenceNo').show();
                                form.findField('GoodsDescription').show();
                                form.findField('MAWBNo').hide();
                                form.findField('HAWBNo').hide();
                                form.findField('Carrier').hide();
                                form.findField('FlightNo').hide();
                                form.findField('LoadingAir').hide();
                                form.findField('ETD').hide();
                                form.findField('ETA').hide();
                                form.findField('MBLNo').show();
                                form.findField('HBLNo').show();
                                form.findField('SSLine').hide();
                                form.findField('Vessel').hide();
                                form.findField('Voyage').hide();
                                form.findField('PortOfOriginId').hide();
                                form.findField('PortOfDestinationId').hide();
                                form.findField('ETAPort').hide();
                                form.findField('PortDischargeDate').hide();
                                form.findField('NumberOfContainers').hide();
                                form.findField('NumberOfPackages').show();
                                form.findField('Weight').show();
                                form.findField('Volume').hide();
                                form.findField('LoadingPortId').hide();
                                form.findField('CargoAgent').hide();
                            }
                            else {
                                form.findField('ClientReferenceNo').hide();
                                form.findField('GoodsDescription').hide();
                                form.findField('MAWBNo').hide();
                                form.findField('HAWBNo').hide();
                                form.findField('Carrier').hide();
                                form.findField('FlightNo').hide();
                                form.findField('LoadingAir').hide();
                                form.findField('ETD').hide();
                                form.findField('ETA').hide();
                                form.findField('MBLNo').hide();
                                form.findField('HBLNo').hide();
                                form.findField('SSLine').hide();
                                form.findField('Vessel').hide();
                                form.findField('Voyage').hide();
                                form.findField('PortOfOriginId').hide();
                                form.findField('PortOfDestinationId').hide();
                                form.findField('ETAPort').hide();
                                form.findField('PortDischargeDate').hide();
                                form.findField('NumberOfContainers').hide();
                                form.findField('packageCompositeField').hide();
                                form.findField('LoadingPortId').hide();
                                form.findField('CargoAgent').hide();
                            }
                        }
                    }
                }, {
                    name: 'OperationNo',
                    xtype: 'textfield',
                    fieldLabel: 'Operation No',
                    width: 100,
                    allowBlank: false,
                    readOnly: false
                }, {
                    name: 'Date',
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: false,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'ClientReferenceNo',
                    xtype: 'textfield',
                    fieldLabel: 'Client Reference No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    hiddenName: 'OpeningLocationId',
                    xtype: 'combo',
                    fieldLabel: 'Opening Location',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: false,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetOperationOpeningLocation }
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    name: 'GoodsDescription',
                    xtype: 'textarea',
                    fieldLabel: 'Goods Description',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'MBLNo',
                    xtype: 'textfield',
                    fieldLabel: 'MBL No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'HBLNo',
                    xtype: 'textfield',
                    fieldLabel: 'HBL No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'SSLine',
                    xtype: 'textfield',
                    fieldLabel: 'SS Line',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'Vessel',
                    xtype: 'textfield',
                    fieldLabel: 'Vessel',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'Voyage',
                    xtype: 'textfield',
                    fieldLabel: 'Voyage',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    hiddenName: 'PortOfOriginId',
                    xtype: 'combo',
                    fieldLabel: 'Port Of Origin',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    hidden: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetPortOfOrigin }
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    hiddenName: 'PortOfDestinationId',
                    xtype: 'combo',
                    fieldLabel: 'Port Of Destination',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    hidden: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetPortOfDestination }
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    name: 'ETAPort',
                    xtype: 'datefield',
                    fieldLabel: 'ETA Port',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'PortDischargeDate',
                    xtype: 'datefield',
                    fieldLabel: 'Port Discharge Date',
                    altFormats: 'c',
                    editable: true,
                    hidden: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }]
            }, {
                defaults: {
                    anchor: '95%'
                },
                items: [{
                    name: 'NumberOfContainers',
                    xtype: 'numberfield',
                    fieldLabel: 'No Of Containers',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    xtype: 'compositefield',
                    name: 'packageCompositeField',
                    hidden: true,
                    fieldLabel: 'Package/Weight/Volume',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'NumberOfPackages',
                        xtype: 'numberfield',
                        fieldLabel: 'No Of Packages',
                        allowBlank: true
                    }, {
                        name: 'Weight',
                        xtype: 'numberfield',
                        fieldLabel: 'Weight',
                        allowBlank: true,
                        allowDecimals: true
                    }, {
                        name: 'Volume',
                        xtype: 'numberfield',
                        fieldLabel: 'Volume',
                        allowBlank: true,
                        allowDecimals: true
                    }]
                }, {
                    hiddenName: 'LoadingPortId',
                    xtype: 'combo',
                    fieldLabel: 'Loading Port',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    hidden: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name']
                        }),
                        autoLoad: true,
                        api: { read: Iffs.GetLoadingPort }
                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    name: 'OperationManagerId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'OperationManager',
                    xtype: 'combo',
                    fieldLabel: 'Operation Manager',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Position}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Position', 'IdentityNo']
                        }),
                        api: { read: Operation.GetFilteredEmployee }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('OperationManagerId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'TransitorId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'Transitor',
                    xtype: 'combo',
                    fieldLabel: 'Transitor',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Position}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Position', 'IdentityNo']
                        }),
                        api: { read: Operation.GetFilteredEmployee }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('TransitorId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'FinanceOfficerId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'FinanceOfficer',
                    xtype: 'combo',
                    fieldLabel: 'Finance Officer',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Position}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Position', 'IdentityNo']
                        }),
                        api: { read: Operation.GetFilteredEmployee }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('FinanceOfficerId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'MarketingOfficerId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'MarketingOfficer',
                    xtype: 'combo',
                    fieldLabel: 'Marketing Officer',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Position}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Position', 'IdentityNo']
                        }),
                        api: { read: Operation.GetFilteredEmployee }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('MarketingOfficerId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'CargoAgentId',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'CargoAgent',
                    xtype: 'combo',
                    fieldLabel: 'Cargo Agent',
                    typeAhead: false,
                    hideTrigger: true,
                    minChars: 2,
                    listWidth: 280,
                    hidden: true,
                    mode: 'remote',
                    tpl: '<tpl for="."><div ext:qtip="{Id}. {IdentityNo}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> {Position}</div></tpl>',
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            totalProperty: 'total',
                            root: 'data',
                            fields: ['Id', 'Name', 'Position', 'IdentityNo']
                        }),
                        api: { read: Operation.GetFilteredEmployee }
                    }),
                    valueField: 'Id',
                    displayField: 'Name',
                    pageSize: 10,
                    listeners: {
                        select: function (cmb, rec, idx) {
                            var form = Ext.getCmp('operation-form').getForm();
                            form.findField('CargoAgentId').setValue(rec.id);
                        }
                    }
                }, {
                    name: 'BoxFile',
                    xtype: 'textfield',
                    fieldLabel: 'Box File',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'FileNo',
                    xtype: 'textfield',
                    fieldLabel: 'File No',
                    width: 100,
                    allowBlank: true
                }, {
                    name: 'MAWBNo',
                    xtype: 'textfield',
                    fieldLabel: 'MAWB No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'HAWBNo',
                    xtype: 'textfield',
                    fieldLabel: 'HAWB No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'Carrier',
                    xtype: 'textfield',
                    fieldLabel: 'Carrier',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'FlightNo',
                    xtype: 'textfield',
                    fieldLabel: 'Flight No',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'LoadingAir',
                    xtype: 'textfield',
                    fieldLabel: 'Loading Airport',
                    width: 100,
                    hidden: true,
                    allowBlank: true
                }, {
                    name: 'ETD',
                    xtype: 'datefield',
                    fieldLabel: 'ETD',
                    altFormats: 'c',
                    hidden: true,
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'ETA',
                    xtype: 'datefield',
                    fieldLabel: 'ETA',
                    altFormats: 'c',
                    editable: true,
                    hidden: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'Remarks',
                    xtype: 'textarea',
                    fieldLabel: 'Remarks',
                    width: 100,
                    allowBlank: true
                }]
            }]
        }],
        tbar: [{
            xtype: 'button',
            text: 'Reset',
            iconCls: 'icon-refresh',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Operation', 'CanAdd'),
            handler: function () {
                var form = Ext.getCmp('operation-form').getForm();
                form.reset();
                //form.findField('OperationNo').setValue("Auto-Generated");
                form.findField('ClientReferenceNo').hide();
                form.findField('GoodsDescription').hide();
                form.findField('MAWBNo').hide();
                form.findField('HAWBNo').hide();
                form.findField('Carrier').hide();
                form.findField('FlightNo').hide();
                form.findField('LoadingAir').hide();
                form.findField('ETD').hide();
                form.findField('ETA').hide();
                form.findField('MBLNo').hide();
                form.findField('HBLNo').hide();
                form.findField('SSLine').hide();
                form.findField('Vessel').hide();
                form.findField('Voyage').hide();
                form.findField('PortOfOriginId').hide();
                form.findField('PortOfDestinationId').hide();
                form.findField('ETAPort').hide();
                form.findField('PortDischargeDate').hide();
                form.findField('NumberOfContainers').hide();
                form.findField('packageCompositeField').hide();
                form.findField('LoadingPortId').hide();
                form.findField('CargoAgent').hide();
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Save',
            id: 'saveOperation',
            iconCls: 'icon-save',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Operation', 'CanAdd'),
            handler: function () {
                var form = Ext.getCmp('operation-form');
                form.getForm().submit({
                    waitMsg: 'Please wait...',
                    success: function () {
                        Ext.getCmp('operation-paging').doRefresh();
                        form.getForm().reset();
                        //form.getForm().findField('OperationNo').setValue('Auto-Generated');
                    },
                    failure: function (option, response) {
                        Ext.MessageBox.show({
                            title: 'Failure',
                            msg: response.result.data,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                    }
                });
            }
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Container',
            iconCls: 'icon-module',
            id:'jobOrderOperation-Container',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Operation', 'CanAdd'),
            handler: function () {
                var grid = Ext.getCmp('operation-grid');
                if (!grid.getSelectionModel().hasSelection()) {
                    Ext.MessageBox.show({
                        title: 'Select',
                        msg: 'You must select operation to register container info.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO,
                        scope: this
                    });
                    return;
                }
                var id = grid.getSelectionModel().getSelected().get('Id');
                new Ext.erp.iffs.ux.operation.ContainerWindow({
                    operationId: id,
                    title: 'Conatainers'
                }).show();
            }
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operation.Form, Ext.form.FormPanel);
Ext.reg('operation-form', Ext.erp.iffs.ux.operation.Form);


/**
* @desc      Container grid host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.operation
* @class     Ext.erp.iffs.ux.operation.ContainerWindow
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.operation.ContainerWindow = function (config) {
    Ext.erp.iffs.ux.operation.ContainerWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 1000,
        height: 600,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
        listeners: {
            show: function () {
                var store = this.grid.getStore();
                store.baseParams = { param: Ext.encode({ operationId: this.operationId }) };
                store.load({ params: { start: 0, limit: this.grid.pageSize } });
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operation.ContainerWindow, Ext.Window, {
    initComponent: function () {
        this.grid = new Ext.erp.iffs.ux.container.Grid({
            operationId: this.operationId
        });
        this.items = [this.grid];

        this.bbar = [{
            xtype: 'tbfill'
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];
        Ext.erp.iffs.ux.operation.ContainerWindow.superclass.initComponent.call(this, arguments);
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('operation-JobOrderWindow', Ext.erp.iffs.ux.operation.ContainerWindow);

/**
* @desc      JobOrderTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.operation
* @class     Ext.erp.iffs.ux.operation.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.operation.Grid = function (config) {
    Ext.erp.iffs.ux.operation.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Operation.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Id',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationNo', 'OperationTypeId', 'Date', 'IsChecked', 'IsApproved', 'PreparedBy', 'CheckedBy', 'ApprovedBy', 'PreparedDate', 'CheckedDate', 'ApprovalDate'],
            remoteSort: true
        }),
        id: 'operation-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            //forceFit: true,
            autoFill: true
        },
        listeners: {
            containermousedown: function (grid, e) {
                grid.getSelectionModel().deselectRange(0, grid.pageSize);
            },
            rowClick: function () {
                this.loadForm();
                this.loadStatus();

                var operationTypeId = this.getSelectionModel().getSelected().get('OperationTypeId');
                if (operationTypeId == 3 || operationTypeId==4)
                    Ext.getCmp('jobOrderOperation-Container').setDisabled(false);
                else
                    Ext.getCmp('jobOrderOperation-Container').setDisabled(true);



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
            dataIndex: 'OperationNo',
            header: 'Operation No',
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
            dataIndex: 'IsChecked',
            header: 'Checked?',
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
            dataIndex: 'IsApproved',
            header: 'Approved?',
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
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.operation.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.tbar = [{
            xtype: 'button',
            text: 'Check',
            iconCls: 'icon-select',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Operation', 'CanCertify'),
            handler: this.onCheck
        }, {
            xtype: 'tbseparator'
        }, {
            xtype: 'button',
            text: 'Approve',
            iconCls: 'icon-accept',
            disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Operation', 'CanApprove'),
            handler: this.onApprove
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            id: 'operation.searchText',
            emptyText: 'Type search text here',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '150px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('operation-grid');
                        grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('operation-grid');
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
                var searchText = Ext.getCmp('operation.searchText').getValue();
                window.open('Operation/ExportToExcel?st=' + searchText, '', '');
            }
        }];
        this.bbar = new Ext.PagingToolbar({
            id: 'operation-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operation.Grid.superclass.initComponent.apply(this, arguments);
    },
    loadStatus: function () {
        var jobOrderStatusDetailGrid = Ext.getCmp('operation-detailGrid');
        var jobOrderStatusDetailStore = jobOrderStatusDetailGrid.getStore();

        var operationId = this.getSelectionModel().getSelected().get('Id');
        jobOrderStatusDetailGrid.operationId = operationId;
        jobOrderStatusDetailStore.baseParams = { param: Ext.encode({ operationId: operationId }) };
        jobOrderStatusDetailStore.load({
            params: { start: 0, limit: jobOrderStatusDetailGrid.pageSize }
        });
    },
    loadForm: function () {
        if (!this.getSelectionModel().hasSelection()) return;
        var id = this.getSelectionModel().getSelected().get('Id');
        var form = Ext.getCmp('operation-form').getForm();

        Ext.getCmp('operation-form').getForm().load({
            params: { id: id },
            success: function () {
                var operationid = form.findField('OperationTypeId').getValue();
                if (operationid == 3) { //Ocean Import
                    form.findField('ClientReferenceNo').show();
                    form.findField('GoodsDescription').show();
                    form.findField('MBLNo').show();
                    form.findField('HBLNo').show();
                    form.findField('SSLine').show();
                    form.findField('Vessel').show();
                    form.findField('Voyage').show();
                    form.findField('PortOfOriginId').show();
                    form.findField('PortOfDestinationId').show();
                    form.findField('ETAPort').show();
                    form.findField('PortDischargeDate').show();
                    form.findField('NumberOfContainers').show();
                    form.findField('packageCompositeField').show();
                    form.findField('LoadingPortId').show();

                    form.findField('MAWBNo').hide();
                    form.findField('HAWBNo').hide();
                    form.findField('Carrier').hide();
                    form.findField('FlightNo').hide();
                    form.findField('LoadingAir').hide();
                    form.findField('ETD').hide();
                    form.findField('ETA').hide();
                    form.findField('CargoAgent').hide();
                }
                else if (operationid == 4) { //Ocean Export
                    form.findField('ClientReferenceNo').show();
                    form.findField('GoodsDescription').show();
                    form.findField('MBLNo').show();
                    form.findField('HBLNo').show();
                    form.findField('SSLine').show();
                    form.findField('Vessel').show();
                    form.findField('Voyage').show();
                    form.findField('PortOfOriginId').show();
                    form.findField('PortOfDestinationId').show();
                    form.findField('ETAPort').show();
                    form.findField('PortDischargeDate').show();
                    form.findField('NumberOfContainers').show();
                    form.findField('packageCompositeField').show();
                    form.findField('LoadingPortId').show();

                    form.findField('MAWBNo').hide();
                    form.findField('HAWBNo').hide();
                    form.findField('Carrier').hide();
                    form.findField('FlightNo').hide();
                    form.findField('LoadingAir').hide();
                    form.findField('ETD').hide();
                    form.findField('ETA').hide();
                    form.findField('CargoAgent').hide();
                }
                else if (operationid == 1) { //Air Import
                    form.findField('ClientReferenceNo').show();
                    form.findField('GoodsDescription').show();
                    form.findField('MAWBNo').show();
                    form.findField('HAWBNo').show();
                    form.findField('Carrier').show();
                    form.findField('FlightNo').show();
                    form.findField('LoadingAir').show();
                    form.findField('ETD').show();
                    form.findField('ETA').show();
                    form.findField('MBLNo').hide();
                    form.findField('HBLNo').hide();
                    form.findField('SSLine').hide();
                    form.findField('Vessel').hide();
                    form.findField('Voyage').hide();
                    form.findField('PortOfOriginId').show();
                    form.findField('PortOfDestinationId').show();
                    form.findField('ETAPort').hide();
                    form.findField('PortDischargeDate').show();
                    form.findField('NumberOfContainers').hide();
                    form.findField('packageCompositeField').show();
                    form.findField('LoadingPortId').show();
                    form.findField('CargoAgent').hide();
                }
                else if (operationid == 2 || operationid == 7) { //Air Export and FZ Operation
                    form.findField('ClientReferenceNo').show();
                    form.findField('GoodsDescription').show();
                    form.findField('MAWBNo').show();
                    form.findField('HAWBNo').show();
                    form.findField('Carrier').hide();
                    form.findField('FlightNo').hide();
                    form.findField('LoadingAir').hide();
                    form.findField('ETD').hide();
                    form.findField('ETA').hide();
                    form.findField('MBLNo').hide();
                    form.findField('HBLNo').hide();
                    form.findField('SSLine').hide();
                    form.findField('Vessel').hide();
                    form.findField('Voyage').hide();
                    form.findField('PortOfOriginId').hide();
                    form.findField('PortOfDestinationId').hide();
                    form.findField('ETAPort').hide();
                    form.findField('PortDischargeDate').hide();
                    form.findField('NumberOfContainers').hide();
                    form.findField('packageCompositeField').show();
                    form.findField('LoadingPortId').hide();
                    form.findField('CargoAgent').show();
                }
                else if (operationid == 8) { //TR Operation
                    form.findField('ClientReferenceNo').show();
                    form.findField('GoodsDescription').show();
                    form.findField('MAWBNo').hide();
                    form.findField('HAWBNo').hide();
                    form.findField('Carrier').hide();
                    form.findField('FlightNo').hide();
                    form.findField('LoadingAir').hide();
                    form.findField('ETD').hide();
                    form.findField('ETA').hide();
                    form.findField('MBLNo').show();
                    form.findField('HBLNo').show();
                    form.findField('SSLine').hide();
                    form.findField('Vessel').hide();
                    form.findField('Voyage').hide();
                    form.findField('PortOfOriginId').hide();
                    form.findField('PortOfDestinationId').hide();
                    form.findField('ETAPort').hide();
                    form.findField('PortDischargeDate').hide();
                    form.findField('NumberOfContainers').hide();
                    form.findField('NumberOfPackages').show();
                    form.findField('Weight').show();
                    form.findField('Volume').hide();
                    form.findField('LoadingPortId').hide();
                    form.findField('CargoAgent').hide();
                }
                else {
                    form.findField('ClientReferenceNo').hide();
                    form.findField('GoodsDescription').hide();
                    form.findField('MAWBNo').hide();
                    form.findField('HAWBNo').hide();
                    form.findField('Carrier').hide();
                    form.findField('FlightNo').hide();
                    form.findField('LoadingAir').hide();
                    form.findField('ETD').hide();
                    form.findField('ETA').hide();
                    form.findField('MBLNo').hide();
                    form.findField('HBLNo').hide();
                    form.findField('SSLine').hide();
                    form.findField('Vessel').hide();
                    form.findField('Voyage').hide();
                    form.findField('PortOfOriginId').hide();
                    form.findField('PortOfDestinationId').hide();
                    form.findField('ETAPort').hide();
                    form.findField('PortDischargeDate').hide();
                    form.findField('NumberOfContainers').hide();
                    form.findField('packageCompositeField').hide();
                    form.findField('LoadingPortId').hide();
                    form.findField('CargoAgent').hide();
                }
            }
        });
    },
    onCheck: function () {
        var grid = Ext.getCmp('operation-grid');
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
                        cmpPaging: Ext.getCmp('operation-paging'),
                        api: {
                            submit: Operation.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('operation-grid');
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
                        cmpPaging: Ext.getCmp('operation-paging'),
                        api: {
                            submit: Operation.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.operation.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('operation-grid', Ext.erp.iffs.ux.operation.Grid);

/**
* @desc      Job Order Status grid
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 29, 2018
* @namespace Ext.erp.iffs.ux.operation
* @class     Ext.erp.iffs.ux.operation.GridDetail
* @extends   Ext.grid.GridPanel
*/

Ext.erp.iffs.ux.operation.GridDetail = function (config) {
    Ext.erp.iffs.ux.operation.GridDetail.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: JobOrderStatus.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            //idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Status',
                direction: 'ASC'
            },
            fields: ['Id', 'OperationId', 'StatusId', 'Status', 'DataType', 'Value', 'Remark'],
            remoteSort: true,
        }),
        id: 'operation-detailGrid',
        loadMask: true,
        pageSize: 30,
        clicksToEdit: 1,
        height: 350,
        operationId: 0,
        columnLines: true,
        stripeRows: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        listeners: {
            beforeedit: function (e) {
                var record = e.record;
                var grid = Ext.getCmp('operation-detailGrid');

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
                var grid = Ext.getCmp('operation-detailGrid');
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
Ext.extend(Ext.erp.iffs.ux.operation.GridDetail, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Save',
            iconCls: 'icon-save',
            //disabled: !Ext.erp.iffs.ux.Reception.getPermission('Job Order', 'CanAdd'),
            handler: this.onSaveClick
        }, {
            xtype: 'textfield',
            id: 'operation.searchStatusText',
            emptyText: 'Type search text here',
            submitEmptyText: false,
            enableKeyEvents: true,
            style: {
                borderRadius: '25px',
                padding: '0 10px',
                width: '150px'
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        var grid = Ext.getCmp('operation-detailGrid');
                        var operationId = Ext.getCmp('operation-grid').getSelectionModel().getSelected().get('Id');
                        var searchValue = field.getValue();
                        grid.store.baseParams['param'] = Ext.encode({ searchText: searchValue, operationId: operationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                },
                keyup: function (field, e) {
                    if (field.getValue() == '') {
                        var grid = Ext.getCmp('operation-detailGrid');
                        var operationId = Ext.getCmp('operation-grid').getSelectionModel().getSelected().get('Id');
                        grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue(), operationId: operationId });
                        grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                    }
                }
            }
        }, ];
        this.bbar = new Ext.PagingToolbar({
            id: 'operation-detailPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.operation.GridDetail.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        Ext.erp.iffs.ux.operation.Grid.superclass.afterRender.apply(this, arguments);
    },
    onSaveClick: function () {
        var gridDetail = Ext.getCmp('operation-detailGrid');
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
Ext.reg('operation-detailGrid', Ext.erp.iffs.ux.operation.GridDetail);

/**
* @desc      operation panel
* @author    Henock Melisse
* @copyright (c) 2018, Cybersoft
* @date      January 9, 2018
* @namespace Ext.erp.iffs.ux.operation
* @class     Ext.erp.iffs.ux.operation.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.operation.Panel = function (config) {
    Ext.erp.iffs.ux.operation.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        id: 'operation-panel',
        border: false
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.operation.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.operation.Form();
        this.grid = new Ext.erp.iffs.ux.operation.Grid();
        this.statusGrid = new Ext.erp.iffs.ux.operation.GridDetail();

        //this.form.getForm().findField('OperationNo').setValue('Auto-Generated')
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'west',
                border: true,
                layout: 'fit',
                collapsible: true,
                split: true,
                width: 400,
                minSize: 200,
                maxSize: 400,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.grid]
            }, {
                region: 'center',
                border: true,
                layout: 'fit',
                items: [this.form]
            }, {
                region: 'east',
                border: true,
                layout: 'fit',
                collapsible: true,
                split: true,
                width: 500,
                minSize: 200,
                maxSize: 600,
                layout: 'fit',
                margins: '0 3 0 0',
                items: [this.statusGrid]
            }]
        }];
        Ext.erp.iffs.ux.operation.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('jobOperation-panel', Ext.erp.iffs.ux.operation.Panel);