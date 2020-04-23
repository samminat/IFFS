Ext.ns('Ext.erp.iffs.ux.SurveyRequest');

/**
* @desc      SurveyRequestTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequest
* @class     Ext.erp.iffs.ux.SurveyRequest.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.SurveyRequest.Form = function (config) {
    Ext.erp.iffs.ux.SurveyRequest.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.SurveyRequest.Get,
            submit: window.SurveyRequest.Save
        },
        paramOrder: ['id'],
        defaults: {
            //  anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'SurveyRequest-form',
        padding: 5,
        labelWidth: 130,
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
                    //}, {
                    //    name: 'CheckedById',
                    //    xtype: 'hidden'
                    //}, {
                    //    name: 'ApprovedById',
                    //    xtype: 'hidden'
                }, {
                    xtype: 'hidden',
                    name: 'ReceivingClientId'
                }, {
                    xtype: 'hidden',
                    name: 'OrderingClientId'
                    //}, {
                    //    hiddenName: 'OperationTypeId',
                    //    xtype: 'combo',
                    //    fieldLabel: 'Operation Type',
                    //    triggerAction: 'all',
                    //    mode: 'remote',
                    //    forceSelection: true,
                    //    emptyText: '---Select---',
                    //    allowBlank: true,
                    //    store: new Ext.data.DirectStore({
                    //        reader: new Ext.data.JsonReader({
                    //            successProperty: 'success',
                    //            idProperty: 'Id',
                    //            root: 'data',
                    //            fields: ['Id', 'Name']
                    //        }),
                    //        autoLoad: true,
                    //        api: { read: Iffs.GetOperationType }
                    //    }),
                    //    valueField: 'Id',
                    //    displayField: 'Name',
                    //    listeners: {
                    //        scope: this,
                    //        select: function (cmb, rec, idx) {
                    //            var operationid = rec.id;
                    //            var grid = Ext.getCmp('SurveyRequest-grid');
                    //            var store = grid.getStore();
                    //            store.baseParams = { record: Ext.encode({ operationTypeId: operationid, source: "New" }) };
                    //            store.load({ params: { start: 0, limit: grid.pageSize } });
                    //        }
                    //    }
                    //}, {
                    //    xtype: 'hidden',
                    //    name: 'QuotationRecs'
                    //}, {
                    //    xtype: 'compositefield',
                    //    name: 'compositeQuotations',
                    //    fieldLabel: 'Quotations',
                    //    defaults: {
                    //        flex: 1
                    //    },
                    //    items: [{
                    //        name: 'Quotations',
                    //        xtype: 'textarea',
                    //        fieldLabel: 'Quotations',
                    //        allowBlank: false,
                    //        readOnly: true
                    //    }, {
                    //        xtype: 'button',
                    //        id: 'findQuotations',
                    //        iconCls: 'icon-filter',
                    //        width: 25,
                    //        handler: function () {
                    //            var form = Ext.getCmp('SurveyRequest-form').getForm();
                    //            new Ext.erp.iffs.ux.SurveyRequest.QuotationWindow({
                    //                parentForm: form,
                    //                controlIdField: 'QuotationRecs',
                    //                controlNameField: 'Quotations'
                    //            }).show();
                    //        }
                    //    }]
                }, {
                    name: 'Number',
                    xtype: 'textfield',
                    fieldLabel: 'Survey Request No.',
                    width: 100,
                    allowBlank: false,
                    readOnly: true
                }, {
                    //name: 'OrderingClient',
                    //xtype: 'textfield',
                    //fieldLabel: 'Ordering Client',
                    //width: 100,
                    //allowBlank: false
                    xtype: 'compositefield',
                    fieldLabel: 'Ordering Client',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        hiddenName: 'OrderingClient',
                        xtype: 'combo',
                        typeAhead: true,
                        hideTrigger: true,
                        minChars: 2,
                        listWidth: 280,
                        emptyText: '---Type to Search---',
                        mode: 'remote',
                        allowBlank: false,
                        tpl: '<tpl for="."><div ext:qtip="{Id}. {Name}" class="x-combo-list-item">' +
                            '<h3><span>{Name}</span></h3> </div></tpl>',
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'CustomerGroupId', 'CustomerGroup']
                            }),
                            autoLoad: true,
                            api: { read: Iffs.GetCustomer }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10,
                        listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('SurveyRequest-form').getForm();
                                form.findField('OrderingClient').setValue(rec.data.Name);
                                form.findField('OrderingClientId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('SurveyRequest-form').getForm();

                                    form.findField('OrderingClient').reset();
                                }
                            }
                        }
                    }, {
                        //    xtype: 'button',
                        //    iconCls: 'icon-filter',
                        //    width: 25,
                        //    handler: function () {
                        //        var form = Ext.getCmp('SurveyRequest-form').getForm();
                        //        new Ext.erp.iffs.ux.common.CustomerSelectionWindow({
                        //            parentForm: form
                        //        }).show();
                        //    }
                        //},
                        //{
                        xtype: 'button',
                        width: 30,
                        id: 'new-OrderingCustomer',
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('SurveyRequest-form').getForm();
                            new Ext.erp.iffs.ux.customer.Window({
                                targetForm: form,
                                customerId: 0,
                            }).show();

                        }
                    }]
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Receiving Client',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        hiddenName: 'ReceivingClient',
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
                            api: { read: window.SurveyRequest.GetReceivingClients }
                        }),
                        valueField: 'Name',
                        displayField: 'Name',
                        pageSize: 10,
                        listeners: {
                            select: function (cmb, rec, idx) {
                                var form = Ext.getCmp('SurveyRequest-form').getForm();
                                form.findField('ReceivingClient').setValue(rec.data.Name);
                                form.findField('ReceivingClientId').setValue(rec.id);
                            },
                            change: function (cmb, newvalue, oldvalue) {
                                if (newvalue == "") {
                                    var form = Ext.getCmp('SurveyRequest-form').getForm();
                                    form.findField('ReceivingClient').reset();
                                }
                            }
                        }
                    }, {
                        xtype: 'button',
                        width: 30,
                        id: 'new-ReceivingCustomer',
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('SurveyRequest-form').getForm();
                            new Ext.erp.iffs.ux.ReceivingClient.Window({
                                title: 'Add Receiving Client'
                            }).show();

                        }
                    }]
                }, {
                    name: 'ProposedSurveyDate',
                    xtype: 'datefield',
                    fieldLabel: 'Proposed Survey Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'SurveyLocation',
                    xtype: 'textarea',
                    fieldLabel: 'Survey Location',
                    width: 100,
                    height: 50,
                    allowBlank: true
                }, {
                    name: 'ProposedPackingDate',
                    xtype: 'datefield',
                    fieldLabel: 'Proposed Packing Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {

                    xtype: 'fieldset',
                    title: 'Shipment Mode',
                    collapsible: false,
                    autoHeight: true,
                    layout: 'column',
                    border: true,
                    bodyStyle: 'background-color:transparent;',
                    defaults: {
                        columnWidth: .2,
                        border: false,
                        bodyStyle: 'background-color:transparent;  padding: 0px',

                        layout: 'form'
                    },
                    items: [{
                        defaults: {
                            hideLabel: true,
                            anchor: '100%'
                        },
                        xtype: 'fieldset',
                        autoHeight: true,
                        hideLabel: true,
                        border: false,
                        defaultType: 'checkbox',
                        items: [{
                            labelSeparator: '',
                            boxLabel: 'Air',
                            name: 'IsAir',
                            inputValue: true,
                            listeners: {
                                check: function (chkG, val) {
                                    var form = Ext.getCmp('SurveyRequest-form');
                                    var cmbAirLine = form.getForm().findField('AirLineId')
                                    var airLine = Ext.getCmp('compFIeldAirLine');
                                    if (val)
                                        airLine.show();
                                    else {
                                        airLine.hide();
                                        cmbAirLine.clearValue();
                                    }
                                },
                                afterrender: function (chk) {
                                    var airLine = Ext.getCmp('compFIeldAirLine');
                                    if (chk.checked)
                                        airLine.show();
                                    else
                                        airLine.hide();
                                }
                            }
                        }]

                    }, {
                        columnWidth: .3,
                        defaults: {
                            hideLabel: true,
                            anchor: '100%'
                        },
                        xtype: 'fieldset',
                        autoHeight: true,
                        hideLabel: true,
                        border: false,
                        defaultType: 'checkbox',
                        items: [{
                            labelSeparator: '',
                            boxLabel: 'Sea(Ocean)',
                            name: 'IsOcean',
                            inputValue: true,
                            listeners: {
                                check: function (chkG, val) {
                                    var form = Ext.getCmp('SurveyRequest-form');
                                    var cmbShippingLine = form.getForm().findField('ShippingLineId')
                                    var shipping = Ext.getCmp('compFIeldShippingLine');
                                    if (val)
                                        shipping.show();
                                    else {
                                        shipping.hide();
                                        cmbShippingLine.clearValue();
                                    }
                                },
                                afterrender: function (chk) {
                                    var shipping = Ext.getCmp('compFIeldShippingLine');
                                    if (chk.checked)
                                        shipping.show();
                                    else
                                        shipping.hide();
                                }
                            }
                        }]
                    }, {
                        columnWidth: .3,
                        defaults: {
                            hideLabel: true,
                            anchor: '100%'
                        },
                        autoHeight: true,
                        hideLabel: true,
                        border: false,
                        defaultType: 'checkbox',
                        items: [{
                            labelSeparator: '',
                            boxLabel: 'Rail Way',
                            name: 'IsRailWay',
                            inputValue: true,
                            listeners: {
                                check: function (chkG, val) {
                                    var form = Ext.getCmp('SurveyRequest-form');
                                    var cmbRailWay = form.getForm().findField('RailWayId')
                                    var railWay = Ext.getCmp('compFIeldRailWayLine');
                                    if (val)
                                        railWay.show();
                                    else {
                                        railWay.hide();
                                        cmbRailWay.clearValue();
                                    }
                                },
                                afterrender: function (chk) {
                                    var railWay = Ext.getCmp('compFIeldRailWayLine');
                                    if (chk.checked)
                                        railWay.show();
                                    else
                                        railWay.hide();
                                }
                            }
                        }]
                    }]
                    //  }]
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Air Line',
                    id: 'compFIeldAirLine',
                    hidden: true,
                    defaults: {
                        flex: 1,
                        layout: 'form'
                    },
                    items: [{
                        hiddenName: 'AirLineId',
                        xtype: 'combo',
                        triggerAction: 'all',
                        mode: 'local',
                        hideLable: true,
                        editable: false,
                        forceSelection: false,
                        emptyText: '---Select---',
                        allowBlank: true,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Type']
                            }),
                            autoLoad: true,
                            api: { read: window.SurveyRequest.GetShipmentTypes }

                        }),
                        valueField: 'Id',
                        displayField: 'Name'
                    }, {
                        xtype: 'button',
                        width: 30,
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('SurveyRequest-form').getForm();
                            new Ext.erp.iffs.ux.ShipmentType.Window({
                                Id: 0,
                            }).show();

                        }
                    }]

                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Shipping Line',
                    id: 'compFIeldShippingLine',
                    hidden: true,
                    defaults: {
                        flex: 1,
                        layout: 'form'
                    },
                    items: [{
                        hiddenName: 'ShippingLineId',
                        xtype: 'combo',
                        triggerAction: 'all',
                        mode: 'local',
                        hideLable: true,
                        editable: false,
                        forceSelection: false,
                        emptyText: '---Select---',
                        allowBlank: true,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Type']
                            }),
                            autoLoad: true,
                            api: { read: window.SurveyRequest.GetShipmentTypes }

                        }),
                        valueField: 'Id',
                        displayField: 'Name'
                    }, {
                        xtype: 'button',
                        width: 30,
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('SurveyRequest-form').getForm();
                            new Ext.erp.iffs.ux.ShipmentType.Window({
                                Id: 0,
                            }).show();

                        }
                    }]
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Rail Way Line',
                    id: 'compFIeldRailWayLine',
                    hidden: true,
                    defaults: {
                        flex: 1,
                        layout: 'form'
                    },
                    items: [{
                        hiddenName: 'RailWayId',
                        xtype: 'combo',
                        triggerAction: 'all',
                        mode: 'local',
                        hideLable: true,
                        editable: false,
                        forceSelection: false,
                        emptyText: '---Select---',
                        allowBlank: true,
                        store: new Ext.data.DirectStore({
                            reader: new Ext.data.JsonReader({
                                successProperty: 'success',
                                idProperty: 'Id',
                                root: 'data',
                                fields: ['Id', 'Name', 'Type']
                            }),
                            autoLoad: true,
                            api: { read: window.SurveyRequest.GetShipmentTypes }

                        }),
                        valueField: 'Id',
                        displayField: 'Name'
                    }, {
                        xtype: 'button',
                        width: 30,
                        iconCls: 'icon-add',
                        handler: function () {
                            var form = Ext.getCmp('SurveyRequest-form').getForm();
                            new Ext.erp.iffs.ux.ShipmentType.Window({
                                Id: 0,
                            }).show();

                        }
                    }]

                }]

            }, {
                defaults: {
                    anchor: '98%'
                },
                items: [{

                    xtype: 'radiogroup',
                    name: 'MeasurmentUnit',
                    border: false,
                    items: [
                        { boxLabel: 'CBM', name: 'MeasurmentUnit', inputValue: 'CBM', checked: true },
                        { boxLabel: 'Kg', name: 'MeasurmentUnit', inputValue: 'KG' }],
                    listeners: {
                        change: function (radioG, val) {
                            //var selected = val.inputValue;
                            //Ext.getCmp('SurveyRequest-form').selectShipmenMode(selected);
                        },
                        afterrender: function (radioG, val) {
                            //var form = Ext.getCmp('SurveyRequest-form');
                            //var selected = form.getForm().findField('ShipmentMode').getValue();
                            //var val = selected.inputValue;
                            //form.selectShipmenMode(val);
                        }
                    }
                }, {
                    name: 'ClientAllowanceVolume',
                    xtype: 'numberfield',
                    fieldLabel: 'Client Allowance Volume',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'HandlingAgent',
                    xtype: 'textfield',
                    fieldLabel: 'Handling Agent',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'SurveyReportDate',
                    xtype: 'datefield',
                    fieldLabel: 'Survey Report Return Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'OriginCity',
                    xtype: 'textarea',
                    fieldLabel: 'Origin City(Ethiopia)',
                    width: 100,
                    height: 50,
                    allowBlank: true
                }, {
                    name: 'DestinationCityCountry',
                    xtype: 'textarea',
                    fieldLabel: 'Destination City and Country',
                    width: 100, height: 50,
                    value: 'N/A',
                    allowBlank: false
                }, {
                    name: 'AdditionalInstruction',
                    xtype: 'textarea',
                    fieldLabel: 'Additional Instruction',
                    value: 'Please contact the ordering client for the exact address of the pack out',
                    width: 100,
                    allowBlank: false
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.SurveyRequest.Form, Ext.form.FormPanel, {
    selectShipmenMode: function (mode) {
        var combo = Ext.getCmp('SurveyRequest-form').getForm().findField('ShipmentTypeId');
        combo.getStore().clearFilter(true);
        switch (mode) {
            case 1:
                Ext.getCmp('shipmentlable').setText('Air Craft Type:');
                combo.getStore().filter('Type', 'AirCraftType', true, true);
                break;
            case 2:
                Ext.getCmp('shipmentlable').setText('Shipping Line:');
                combo.getStore().filter('Type', 'ShippingLine', true, true);
                break;
            case 3:
                Ext.getCmp('shipmentlable').setText('RailWay Line:');
                combo.getStore().filter('Type', 'RailWayLine', true, true);
                break;
        }
    }
});
Ext.reg('SurveyRequest-form', Ext.erp.iffs.ux.SurveyRequest.Form);

/**
* @desc      SurveyRequestTemplate registration form host window
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffsux.SurveyRequest
* @class     Ext.erp.iffsux.SurveyRequest.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.SurveyRequest.Window = function (config) {
    Ext.erp.iffs.ux.SurveyRequest.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 800,
        id: 'SurveyRequest-window',
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
                    Ext.getCmp('SurveyRequest-window').actionType = "Edit";
                    var form = Ext.getCmp('SurveyRequest-form');
                    form.load({
                        params: { id: this.Id },
                    });
                }
                else {

                    Ext.getCmp('SurveyRequest-window').actionType = "Add";
                    Ext.getCmp('SurveyRequest-form').getForm().findField('Number').setValue('Auto-Generated');
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.SurveyRequest.Window, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.SurveyRequest.Form();

        this.items = [this.form];

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
        Ext.erp.iffs.ux.SurveyRequest.Window.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        if (!this.form.getForm().isValid()) return;
        //var gridDetail = Ext.getCmp('SurveyRequest-grid');
        //var rec = '';
        //var store = gridDetail.getStore();
        //var action = Ext.getCmp('SurveyRequest-window').actionType;
        //store.each(function (item) {
        //    if (item.data['Value'] != '') {
        //        rec = rec + item.data['FieldCategory'] + ':' +
        //            item.data['Field'] + ':' +
        //            item.data['Value'] + ';';
        //    }
        //});

        //if (rec.length == 0) {
        //    Ext.MessageBox.show({
        //        title: 'Incomplete',
        //        msg: 'Value cannot be empty!',
        //        buttons: Ext.Msg.OK,
        //        scope: this
        //    });
        //    return;
        //}


        this.form.getForm().submit({
            waitMsg: 'Please wait...',
            //  params: { record: Ext.encode({ templateDetails: rec, action: action }) },
            success: function (form, action) {
                //Ext.getCmp('SurveyRequest-form').getForm().reset();
                Ext.getCmp('SurveyRequest-paging').doRefresh();
                Ext.getCmp('SurveyRequest-window').close();

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
            window.SurveyRequest.ChangeViewStatus(this.NotificationId, function (result) {
                if (result.success) {
                    Ext.getCmp('SurveyRequest-paging').doRefresh();
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
        Ext.getCmp('SurveyRequest-window').addRow();
    },
    addRow: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
        var store = grid.getStore();
        var voucher = store.recordType;
        var p = new voucher({
            FieldCategory: '',
            Field: '',
            Value: ''
        });
        var count = store.getCount();
        grid.stopEditing();
        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }

    }
});
Ext.reg('SurveyRequest-window', Ext.erp.iffs.ux.SurveyRequest.Window);

/**
* @desc      SurveyRequestTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequest
* @class     Ext.erp.iffs.ux.SurveyRequest.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.SurveyRequest.Grid = function (config) {
    Ext.erp.iffs.ux.SurveyRequest.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: SurveyRequest.GetAll,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'Number', 'Date', 'ProposedSurveyDate', 'ReceivingClient', 'OrderingClient',  'PreparedBy', 'DestinationCityCountry', 'OriginCity', 'ScheduleDate', 'PreparedDate', 'ProposedPackingDate', 'ApprovalDate'],
            remoteSort: true
        }),
        id: 'SurveyRequest-grid',
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
        }, new Ext.grid.RowNumberer(), {
            dataIndex: 'Number',
            header: 'Survey Request No',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'OrderingClient',
            header: 'Ordering Client',
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
            dataIndex: 'ProposedSurveyDate',
            header: 'Proposed Survey Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'ProposedPackingDate',
            header: 'Proposed Packing Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'OriginCity',
            header: 'Origin City',
            sortable: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'DestinationCityCountry',
            header: 'Destination City and Country',
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
            dataIndex: 'Date',
            header: 'Prepared Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        }, {
            dataIndex: 'ScheduleDate',
            header: 'Schedule Date',
            sortable: true,
            width: 100,
            xtype: 'datecolumn',
            format: 'M d, Y',
            menuDisabled: true
        //}, {
        //    dataIndex: 'ApprovalDate',
        //    header: 'Approval Date',
        //    sortable: true,
        //    width: 100,
        //    xtype: 'datecolumn',
        //    format: 'M d, Y',
        //    menuDisabled: true
        //}, {
        //    dataIndex: 'IsApproved',
        //    header: 'Approved?',
        //    sortable: true,
        //    width: 100,
        //    menuDisabled: true,
        //    align: 'center',
        //    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
        //        if (value)
        //            return '<img src="Content/images/app/select.png" />';
        //        else
        //            return '<img src="Content/images/app/cross.png" />';
        //    }
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.SurveyRequest.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'SurveyRequest-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.SurveyRequest.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.SurveyRequest.Grid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('SurveyRequest-grid', Ext.erp.iffs.ux.SurveyRequest.Grid);


/**
* @desc      SurveyRequestTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequest
* @class     Ext.erp.iffs.ux.SurveyRequest.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.SurveyRequest.Panel = function (config) {
    Ext.erp.iffs.ux.SurveyRequest.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
        tbar: {
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                text: 'Add',
                id: 'addSurveyRequest',
                iconCls: 'icon-add',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Request', 'CanAdd'),
                handler: this.onAddClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Edit',
                id: 'editSurveyRequest',
                iconCls: 'icon-edit',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Request', 'CanEdit'),
                handler: this.onEditClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Delete',
                id: 'deleteSurveyRequest',
                iconCls: 'icon-delete',
                disabled: !Ext.erp.iffs.ux.Reception.getPermission('Service Request', 'CanDelete'),
                handler: this.onDeleteClick
            }, {
                xtype: 'tbseparator'
            }, {
                xtype: 'button',
                text: 'Preview',
                id: 'previewSurveyRequest',
                iconCls: 'icon-preview',
                handler: this.onPreview
            }, {
                xtype: 'tbfill'
            }, {
                xtype: 'textfield',
                id: 'SurveyRequest.searchText',
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
                            var grid = Ext.getCmp('SurveyRequest-grid');
                            grid.store.baseParams['record'] = Ext.encode({ searchText: field.getValue() });
                            grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    },
                    keyup: function (field, e) {
                        if (field.getValue() == '') {
                            var grid = Ext.getCmp('SurveyRequest-grid');
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
                    var searchText = Ext.getCmp('SurveyRequest.searchText').getValue();
                    window.open('SurveyRequest/ExportToExcel?st=' + searchText, '', '');
                }
            }]
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.SurveyRequest.Panel, Ext.Panel, {
    initComponent: function () {
        this.items = [{
            xtype: 'SurveyRequest-grid',
            id: 'SurveyRequest-grid'
        }];
        Ext.erp.iffs.ux.SurveyRequest.Panel.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {

        Ext.erp.iffs.ux.SurveyRequest.Panel.superclass.afterRender.apply(this, arguments);
    },
    onAddClick: function () {
        new Ext.erp.iffs.ux.SurveyRequest.Window({
            operationTypeId: 0,
            isRevised: false,
            title: 'Add Survey Request'
        }).show();
    },
    onEditClick: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
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
        new Ext.erp.iffs.ux.SurveyRequest.Window({
            Id: id,
            isRevised: false,
            title: 'Edit Survey Request'
        }).show();
    },
    onPreview: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;

        var id = grid.getSelectionModel().getSelected().get('Id');
        var parameter = 'width=900,height=700,toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,resizable=yes';
        window.open('Reports/ErpReportViewer.aspx?rt=PreviewJO&id=' + id, 'PreviewJO', parameter);
    },
    onDeleteClick: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        Ext.MessageBox.show({
            title: 'Delete',
            msg: 'Are you sure you want to delete the selected SurveyRequest',
            buttons: {
                ok: 'Yes',
                no: 'No'
            },
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn == 'ok') {
                    var id = grid.getSelectionModel().getSelected().get('Id');
                    SurveyRequest.Delete(id, function (result, response) {
                        Ext.getCmp('SurveyRequest-paging').doRefresh();
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
        var grid = Ext.getCmp('SurveyRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        var SurveyRequest = grid.getSelectionModel().getSelected().get('SurveyRequestNo');

        new Ext.erp.iffs.ux.SurveyRequest.Window({
            operationTypeId: id,
            isRevised: true,
            parentSurveyRequestId: id,
            parentSurveyRequest: SurveyRequest,
            title: 'Revise Survey Request'
        }).show();
    },
    onHistory: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');

        new Ext.erp.iffs.ux.SurveyRequestHistory.Window({
            title: 'Survey Request Revision History',
            SurveyRequestId: id
        }).show();
    },
    onCheck: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
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
                        cmpPaging: Ext.getCmp('SurveyRequest-paging'),
                        api: {
                            submit: SurveyRequest.Check
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });

    },
    onApprove: function () {
        var grid = Ext.getCmp('SurveyRequest-grid');
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
                        cmpPaging: Ext.getCmp('SurveyRequest-paging'),
                        api: {
                            submit: SurveyRequest.Approve
                        },
                        title: 'Document Confirmation'
                    }).show();
                }
            }
        });
    }
});
Ext.reg('SurveyRequest-panel', Ext.erp.iffs.ux.SurveyRequest.Panel);



