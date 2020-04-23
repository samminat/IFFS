Ext.ns('Ext.erp.iffs.ux.PackingSurveyDetail');

/**
* @desc      PackingSurveyDetailTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingSurveyDetail
* @class     Ext.erp.iffs.ux.PackingSurveyDetail.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.PackingSurveyDetail.Form = function (config) {
    Ext.erp.iffs.ux.PackingSurveyDetail.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.PackingSurvey.Get,
            submit: window.PackingSurvey.Save
        },
        paramOrder: ['id'],
        defaults: {
            //  anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'PackingSurveyDetail-form',
        padding: 5,
        labelWidth: 130,
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
                    name: 'SurveyDate',
                    xtype: 'hidden'
                }, {
                    hiddenName: 'SurveyRequestId',
                    xtype: 'combo',
                    fieldLabel: 'Survey Req. No.',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Number']
                        }),
                        autoLoad: true,
                        api: { read: window.SurveyRequest.GetSurveyRequests }
                    }),
                    valueField: 'Id',
                    displayField: 'Number',
                    listeners: {
                        scope: this,
                        select: function (cmb, rec, idx) {
                            var operationid = rec.id;
                            var grid = Ext.getCmp('PackingSurveyDetail-grid');
                            var store = grid.getStore();
                            //store.baseParams = { record: Ext.encode({ operationTypeId: operationid, source: "New" }) };
                            //store.load({ params: { start: 0, limit: grid.pageSize } });
                        }
                    }
                }, {
                    hiddenName: 'ClientStatusId',
                    xtype: 'combo',
                    fieldLabel: 'Client Status',
                    triggerAction: 'all',
                    mode: 'remote',
                    forceSelection: true,
                    emptyText: '---Select---',
                    allowBlank: true,
                    store: new Ext.data.DirectStore({
                        reader: new Ext.data.JsonReader({
                            successProperty: 'success',
                            idProperty: 'Id',
                            root: 'data',
                            fields: ['Id', 'Name', 'Code']
                        }),
                        autoLoad: true,
                        api: { read: window.PackingSurvey.GetClientStatus }

                    }),
                    valueField: 'Id',
                    displayField: 'Name'
                }, {
                    name: 'DepartureDate',
                    xtype: 'datefield',
                    fieldLabel: 'Expected Departure Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'PackingDate',
                    xtype: 'datefield',
                    fieldLabel: 'Tentative Packing Date',
                    altFormats: 'c',
                    editable: true,
                    allowBlank: true,
                    value: (new Date()).format('m/d/Y')
                }, {
                    name: 'EstimatedStuffQty',
                    xtype: 'numberfield',
                    fieldLabel: 'Estd No. of Stuff',
                    allowBlank: true
                }, {
                    hiddenName: 'SurveyedById',
                    fieldLabel: 'Surveyor',
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
                    valueField: 'Id',
                    displayField: 'FullName',
                    pageSize: 10,

                }]
            }, {
                defaults: {
                    anchor: '98%'
                },
                items: [{
                    name: 'DestinationCountry',
                    xtype: 'textfield',
                    fieldLabel: 'Destination Country',
                    width: 100,
                    allowBlank: false
                }, {
                    name: 'DestinationAddress',
                    xtype: 'textarea',
                    fieldLabel: 'Destination Address',
                    width: 100,
                    height: 50,
                    allowBlank: true
                }, {
                    name: 'DestinationPort',
                    xtype: 'textarea',
                    fieldLabel: 'Destination Port',
                    width: 100, height: 50,
                    allowBlank: false
                }, {
                    xtype: 'compositefield',
                    fieldLabel: 'Estimated CBM',
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        name: 'CBMAir',
                        xtype: 'numberfield',
                        emptyText: '---Air---',
                        allowBlank: true,
                    }, {
                        name: 'CBMOcean',
                        xtype: 'numberfield',
                        emptyText: '---Ocean---',
                        allowBlank: true,
                    }]
                }]
            }]
        }, {
            xtype: 'fieldset',
            title: 'Service Type',
            collapsible: false,
            autoHeight: true,
            items: [{
                layout: 'column',
                border: false,
                bodyStyle: 'background-color:transparent;',
                defaults: {
                    columnWidth: .4,
                    border: false,
                    bodyStyle: 'background-color:transparent;',
                    labelWidth: 80,
                    layout: 'form'
                },
                items: [{
                    defaults: {
                        anchor: '95%'
                    },
                    xtype: 'fieldset',
                    autoHeight: true,
                    hideLabel: true,
                    border: false,
                    padding: 0,
                    defaultType: 'checkbox',
                    items: [{
                        hideLabel: true,
                        labelSeparator: '',
                        boxLabel: 'Packing',
                        name: 'IsPacking',
                        inputValue: true
                    }, {
                        hideLabel: true,
                        labelSeparator: '',
                        boxLabel: 'Custom Clearance',
                        name: 'IsCustomClearance',
                        inputValue: true
                    }, {
                        hideLabel: true,
                        labelSeparator: '',
                        boxLabel: 'Moving(Local)',
                        name: 'IsMoving',
                        inputValue: true
                    }]

                }, {
                    columnWidth: .3,
                    defaults: {
                        anchor: '98%'
                    },
                    xtype: 'fieldset',
                    autoHeight: true,
                    hideLabel: true,
                    border: false,
                    padding: 0,
                    defaultType: 'checkbox',
                    items: [{
                        hideLabel: true,
                        labelSeparator: '',
                        boxLabel: 'Door To Door',
                        name: 'IsDoorToDoor',
                        inputValue: true
                    }, {
                        hideLabel: true,
                        labelSeparator: '',
                        boxLabel: 'Door To Port',
                        name: 'IsDoorToPort',
                        inputValue: true
                    }]
                }, {
                    columnWidth: .3,
                    defaults: {
                        anchor: '98%'
                    },
                    autoHeight: true,
                    hideLabel: true,
                    border: false,
                    padding: 0,
                    defaultType: 'checkbox',
                    items: [{
                        labelSeparator: '',
                        boxLabel: 'Air',
                        name: 'IsAir',
                        inputValue: true
                    }, {
                        labelSeparator: '',
                        boxLabel: 'Ocean',
                        name: 'IsOcean',
                        inputValue: true
                    }]
                }]
            }]
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.PackingSurveyDetail.Form, Ext.form.FormPanel, {
    SaveForm: function () {

        var form = this.getForm();
        if (!form.isValid()) return;

        form.submit({
            waitMsg: 'Please wait...',
            failure: function (form, action) {
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: formRes.data,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
});
Ext.reg('PackingSurveyDetail-form', Ext.erp.iffs.ux.PackingSurveyDetail.Form);



/**
* @desc      PackingSurveyDetailTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingSurveyDetail
* @class     Ext.erp.iffs.ux.PackingSurveyDetail.Grid
* @extends   Ext.grid.GridPanel
*/
var extMessage = '';
Ext.erp.iffs.ux.PackingSurveyDetail.Grid = function (config) {
    Ext.erp.iffs.ux.PackingSurveyDetail.Grid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: PackingSurvey.GetAllDetail,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|record',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'OperationType',
                direction: 'ASC'
            },
            fields: ['Id', 'RoomTypeId', 'HeaderId', 'Description', 'Length', 'Width', 'Height', 'Quantity'],
            remoteSort: true
        }),
        id: 'PackingSurveyDetail-grid',
        pageSize: 50,
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
            dataIndex: 'RoomTypeId',
            header: 'Room Type',
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
                    api: { read: PackingSurvey.GetRoomTypes }
                }),
                valueField: 'Id',
                displayField: 'Name'
            })
        }, {
            dataIndex: 'Description',
            header: 'Description',
            sortable: true,
            width: 200,
            menuDisabled: true,
            align: 'left',
            editor: new Ext.form.TextField({
                allowBlank: false,
                allowNegative: false,
                listeners: {
                    focus: function (field) {
                        field.selectText();
                    }
                }
            })
        }, {
            dataIndex: 'Length',
            header: 'Length',
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
            dataIndex: 'Width',
            header: 'Width',
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
            dataIndex: 'Height',
            header: 'Height',
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
            dataIndex: 'Quantity',
            header: 'Quantity',
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
        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingSurveyDetail.Grid, Ext.grid.EditorGridPanel, {
    initComponent: function () {
        this.tbar = [{
            xtype: 'button',
            text: 'Insert',
            id: 'insertRows',
            iconCls: 'icon-add',
            handler: this.addRow
        }, {
            xtype: 'button',
            text: 'Remove',
            id: 'deleteRows',
            iconCls: 'icon-delete',
            handler: this.deleteRow
        }, {
            xtype: 'tbfill',
        }, {
            xtype: 'button',
            text: 'Calculate',
            id: 'calculateCBM',
            iconCls: 'icon-calculate',
            handler: this.calculateCBM
        }];
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        this.bbar = new Ext.PagingToolbar({
            id: 'PackingSurveyDetail-paging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.PackingSurveyDetail.Grid.superclass.initComponent.apply(this, arguments);
    },
    addRow: function () {
        var grid = Ext.getCmp('PackingSurveyDetail-grid');
        var store = grid.getStore();
        var requestDetail = store.recordType;
        var p = new requestDetail({
            Id: 0,
            RoomTypeId: '',
            HeaderId: 0,
            Description: '',
            Length: 0,
            Width: 0,
            Height: 0,
        });
        var count = store.getCount();
        grid.stopEditing();

        store.insert(count, p);
        if (count > 0) {
            grid.startEditing(count, 2);
        }
    },
    calculateCBM: function () {
        var grid = Ext.getCmp('PackingSurveyDetail-grid');
        var form = Ext.getCmp('PackingSurveyDetail-form').getForm();
        var air = form.findField('IsAir');
        var Ocean = form.findField('IsOcean');
        var CBMOcean = form.findField('CBMOcean');
        var CBMAir = form.findField('CBMAir');

        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var SurveyDetail = [];
        var cbm = 0;

        gridDatastore.each(function (item) {
            if (item.data['Length'] == null || item.data['Length'] == "" ||
                item.data['Width'] == null || item.data['Width'] == "" ||
                item.data['Height'] == null || item.data['Height'] == "") {
                QuantityError = 'Length, Width or Height is zero';
            }
            var vol = item.data.Length * item.data.Width * item.data.Height;
            SurveyDetail.push(vol);
        });
        Ext.each(SurveyDetail, function (item) {
            cbm += item;
        });
        if (air.checked) {
            var airCbm = (cbm * 3.2) / 2.5
            CBMAir.setValue(airCbm);
            CBMOcean.setValue(null);
        }
        if (Ocean.checked) {
            CBMOcean.setValue(cbm);
            CBMAir.setValue(null);
        }
    },
    deleteRow: function () {

        var grid = Ext.getCmp('PackingSurveyDetail-grid');
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
                            PackingSurvey.DeleteDetail(id, function (result, response) {
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
        var grid = Ext.getCmp('PackingSurveyDetail-grid');
        var gridDatastore = grid.getStore();
        var totalCount = gridDatastore.getCount();
        var QuantityError = '';

        var SurveyDetail = [];

        gridDatastore.each(function (item) {
            if (item.data.Length == null || item.data.Length == "" ||
                item.data.Width == null || item.data.Width == "" ||
                item.data.Height == null || item.data.Height == "" ||
                item.data.Quantity == null || item.data.Quantity == "") {
                QuantityError = item.data.Name + ', ';
            }
            SurveyDetail.push(item.data);
        });


        if (totalCount == 0) {
            extMessage = "Packing Survey Detail is empty ";
        }
        if (QuantityError != '') {

            QuantityError = 'The Following Items \"' + QuantityError + '\" Length, Width, Height or Quantity is zero';
        }
        var msg = extMessage != '' && QuantityError != '' ? QuantityError + '; ' + extMessage : extMessage != '' ? extMessage : QuantityError != '' ? QuantityError : '';
        PackingSurvey.SaveDetail(headerId, SurveyDetail, function (rest, resp) {
            return { success: rest.success, data: msg != '' ? rest.data + '; ' + msg : rest.data };
        });
    },
    loadDetail: function (HeaderId) {
        var DetailStore = this.getStore();

        DetailStore.baseParams = { record: Ext.encode({ HeaderId: HeaderId }) };
        DetailStore.load({
            params: { start: 0, limit: this.pageSize }
        });

    },
    ClearStore: function () {
        this.getStore().removeAll(false);
        this.getStore().commitChanges();
    }
});
Ext.reg('PackingSurveyDetail-grid', Ext.erp.iffs.ux.PackingSurveyDetail.Grid);

/**
* @desc      PackingSurveyDetailTemplate panel
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.PackingSurveyDetail
* @class     Ext.erp.iffs.ux.PackingSurveyDetail.Panel
* @extends   Ext.Panel
*/
Ext.erp.iffs.ux.PackingSurveyDetail.Panel = function (config) {
    Ext.erp.iffs.ux.PackingSurveyDetail.Panel.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        border: false,
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.PackingSurveyDetail.Panel, Ext.Panel, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.PackingSurveyDetail.Form();
        this.grid = new Ext.erp.iffs.ux.PackingSurveyDetail.Grid();
        this.items = [{
            layout: 'border',
            border: false,
            items: [{
                region: 'center',
                border: false,
                layout: 'fit',
                items: [{
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                        pack: 'start'
                    },
                    defaults: { border: false },
                    items: [{
                        layout: 'fit',
                        items: [this.form],
                        flex: 1.75
                    }, {
                        layout: 'fit',
                        items: [this.grid],
                        flex: 1.25
                    }]

                }]
            }]
        }];
        Ext.erp.iffs.ux.PackingSurveyDetail.Panel.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('PackingSurveyDetail-panel', Ext.erp.iffs.ux.PackingSurveyDetail.Panel);



