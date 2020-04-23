Ext.ns('Ext.erp.iffs.ux.SurveyRequestNotification');

Ext.erp.iffs.ux.SurveyRequestNotification.NotificationDetail = Ext.extend(Ext.Panel, {
    tplMarkup: [
  
       '<table style="width:100%" >',
        '<colgroup>'+
        '<col span="2" style="color:green; background-color:lightgrey;">' +
        '</colgroup>'+
        '<tr >',
             '<td style="width:50%"> <span style = "font-weight:bold;"> Survey No.:</span>   {Number}   </td>',
             //'<td size =150>  </td>',
             '<td><span style = "font-weight:bold;"> Ordering Client: </span>   {OrderingClient} </td>',
             //'<td> </td>',
        '</tr>',
         '<tr>',
             '<td style="width:50%;"> <span style = "font-weight:bold;">Proposed SurveyDate:  </span> {ProposedSurveyDate:date("d-m-Y")} </td>',
             //'<td>  </td>',
             '<td> <span style = "font-weight:bold;">Receiving Client: </span>  {ReceivingClient}  </td>',
             //'<td>   </td>',
         '</tr>',
          '<tr>',
             '<td style="width:50%;"><span style = "font-weight:bold;"> Survey Location:  </span>  {SurveyLocation}   </td>',
             //'<td> </td>',
             '<td><span style = "font-weight:bold;"> Proposed Packing Date: </span>  {ProposedPackingDate:date("d-m-Y")}</td>',
             //'<td>  </td>',
         '</tr>',
          '<tr>',
             '<td style="width:50%;"><span style = "font-weight:bold;"> Client Allowance Volume:</span> {ClientAllowanceVolume}  </td>',
             //'<td>  </td>',
             '<td> <span style = "font-weight:bold;">Handling Agent:     </span>   {HandlingAgent}</td>',
             //'<td>  </td>',
         '</tr>',
           '<tr>',
             '<td style="width:50%;"><span style = "font-weight:bold;"> Origin City:        </span>  {OriginCity}  </td>',
             //'<td>  </td>',
             '<td><span style = "font-weight:bold;"> Survey Report Date :  </span>  {SurveyReportDate:date("d-m-Y")} </td>',
             //'<td>   </td>',
         '</tr>',
           '<tr>',
             '<td style="width:50%;"> <span style = "font-weight:bold;">Prepared date :   </span>  {Date:date("d-m-Y")}  </td>',
             '<td> <span style = "font-weight:bold;">Prepared By:      </span>  {PreparedBy} </td>',
         '</tr>',
           '<tr>',
             '<td style="width:50%;"> <span style = "font-weight:bold;">Destination (City and Country):</span>   {DestinationCityCountry}</td>',
             '<td> <span style = "font-weight:bold;">Additional Instruction :  </span>   {AdditionalInstruction}</td>',
         '</tr>',
       //  '<tr>',

         //'</tr>',
    '</table>',
    ],
    id: 'NotificationDetail',
    height: 90,
    startingMarkup: 'Please select a Survey Request to see additional details',
    initComponent: function () {
        this.tpl = new Ext.XTemplate(this.tplMarkup);
        Ext.apply(this, {
            border: false,
            bodyStyle: {
                background: '#ffffff',
                padding: '7px'
            },
            html: this.startingMarkup
        });
        Ext.erp.iffs.ux.SurveyRequestNotification.NotificationDetail.superclass.initComponent.call(this);
    },
    updateDetail: function (data) {
        this.tpl.overwrite(this.body, data);
    }
});
Ext.reg('NotificationDetail', Ext.erp.iffs.ux.SurveyRequestNotification.NotificationDetail);


/**
* @desc      SurveyRequestNotificationTemplate registration form
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequestNotification
* @class     Ext.erp.iffs.ux.SurveyRequestNotification.Form
* @extends   Ext.form.FormPanel
*/
Ext.erp.iffs.ux.SurveyRequestNotification.Form = function (config) {
    Ext.erp.iffs.ux.SurveyRequestNotification.Form.superclass.constructor.call(this, Ext.apply({
        api: {
            load: window.SurveyRequest.Get,
            submit: window.SurveyRequest.SaveSchedule
        },
        paramOrder: ['id'],
        defaults: {
            //  anchor: '98%',
            labelStyle: 'text-align:right;',
            msgTarget: 'side'
        },
        id: 'SurveyRequestNotification-form',
        padding: 5,
        labelWidth: 130,
        // width: 700,
        autoHeight: true,
        border: false,
        baseCls: 'x-plain',
        items: [{
            name: 'Id',
            xtype: 'hidden'
        }, {
            name: 'ScheduleDate',
            xtype: 'datefield',
            fieldLabel: 'Schedule Date',
            altFormats: 'c',
            editable: true,
            allowBlank: false
        }]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.SurveyRequestNotification.Form, Ext.form.FormPanel);
Ext.reg('SurveyRequestNotification-form', Ext.erp.iffs.ux.SurveyRequestNotification.Form);

/**
* @desc      SurveyRequestNotificationTemplate grid
* @author    Henock Melisse
* @copyright (c) 2017, Cybersoft
* @date      December 15, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequestNotification
* @class     Ext.erp.iffs.ux.SurveyRequestNotification.Grid
* @extends   Ext.grid.GridPanel
*/
Ext.erp.iffs.ux.SurveyRequestNotification.Grid = function (config) {
    Ext.erp.iffs.ux.SurveyRequestNotification.Grid.superclass.constructor.call(this, Ext.apply({
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
            fields: ['Id', 'Number', 'Date', 'ProposedSurveyDate', 'ReceivingClient', 'OrderingClient', 'ClientAllowanceVolume', 'PreparedBy', 'DestinationCityCountry', 'OriginCity', 'ScheduleDate', 'PreparedDate', 'ProposedPackingDate', 'HandlingAgent', 'SurveyReportDate', 'AdditionalInstruction', 'SurveyLocation'],
            remoteSort: true
        }),
        id: 'SurveyRequestNotification-grid',
        pageSize: 20,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        viewConfig: {
            autoFill: true,
            getRowClass: function (record) {
                return record.get('IsViewed') == false ? 'unviewed-row' : 'viewed-row';
            }
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
            header: 'No.',
            sortable: true,
            width: 100,
            menuDisabled: true
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
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'ProposedSurveyDate',
            header: 'Proposed Survey Date',
            sortable: true,
            xtype: 'datecolumn',
            format: 'M d, Y',
            width: 120,
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
            xtype: 'datecolumn',
            format: 'M d, Y',
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'IsViewed',
            header: 'IsViewed',
            sortable: true,
            width: 100,
            hidden: true,
            menuDisabled: true

        }]
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.SurveyRequestNotification.Grid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { record: Ext.encode({ searchText: '' }) };
        //this.bbar = new Ext.PagingToolbar({
        //    id: 'SurveyRequestNotification-paging',
        //    store: this.store,
        //    displayInfo: true,
        //    pageSize: this.pageSize
        //});
        Ext.erp.iffs.ux.SurveyRequestNotification.Grid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.SurveyRequestNotification.Grid.superclass.afterRender.apply(this, arguments);
    },
    initEvents: function () {
        Ext.erp.iffs.ux.SurveyRequestNotification.Grid.superclass.initEvents.call(this);

        var surveyGridSm = Ext.getCmp('SurveyRequestNotification-grid').getSelectionModel();
        surveyGridSm.on('rowselect', this.onRowSelect, this);
    },
    onRowSelect: function (sm, rowIdx, r) {
        var detailPanel = Ext.getCmp('NotificationDetail');
        detailPanel.updateDetail(r.data);
        SurveyRequest.ChangeStatus(r.data.Id, function () { });
    }
});
Ext.reg('SurveyRequestNotification', Ext.erp.iffs.ux.SurveyRequestNotification.Grid);


/**
* @desc      Approved Job Orders registration form host window
* @author    Dawit Kiros
* @copyright (c) 2017, Cybersoft
* @date      November 01, 2017
* @namespace Ext.erp.iffs.ux.SurveyRequestNotification
* @class     Ext.erp.iffs.ux.SurveyRequestNotification.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.SurveyRequestNotification.Window = function (config) {
    Ext.erp.iffs.ux.SurveyRequestNotification.Window.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 950,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:5px;',
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.SurveyRequestNotification.Window, Ext.Window, {
    initComponent: function () {
        //this.grid = new Ext.erp.iffs.ux.SurveyRequestNotification.Grid();
        //this.detail = new Ext.erp.iffs.ux.SurveyRequestNotification.NotificationDetail();
        this.items = [{
            height: 500,
            layout: 'border',
            items: [{
                xtype: 'SurveyRequestNotification',
                region: 'north',
                height: 350,
                split: true
            }, {
                xtype: 'NotificationDetail',
                region: 'center'
            }]
        }];

        this.buttons = [{
            text: 'Schedule',
            iconCls: 'icon-add',
            handler: this.onSchedule,
            scope: this
        }, {
            text: 'Close',
            iconCls: 'icon-exit',
            handler: this.onClose,
            scope: this
        }];

        Ext.erp.iffs.ux.SurveyRequestNotification.Window.superclass.initComponent.call(this, arguments);
    },
    onSchedule: function () {
        var grid = Ext.getCmp('SurveyRequestNotification-grid');
        if (!grid.getSelectionModel().hasSelection()) return;
        var id = grid.getSelectionModel().getSelected().get('Id');
        new Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow({
            title: 'Survey Request Schedule',
            Id: id
        }).show();
    },
    onClose: function () {
        this.close();
    }
});
Ext.reg('SurveyRequestNotification-window', Ext.erp.iffs.ux.SurveyRequestNotification.Window);


/**
* @desc      DocumentUpload form host window
* @author    Wondwosen Desalegn
* @namespace Ext.erp.iffs.ux.SurveyRequestNotification
* @class     Ext.erp.iffs.ux.SurveyRequestNotification.Window
* @extends   Ext.Window
*/
Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow = function (config) {
    Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow.superclass.constructor.call(this, Ext.apply({
        layout: 'fit',
        width: 470,
        autoHeight: true,
        closeAction: 'close',
        modal: true,
        resizable: false,
        buttonAlign: 'right',
        bodyStyle: 'padding:2px;',
        listeners: {
            show: function () {
                if (this.Id > 0) {
                    this.form.load({
                        params: { id: this.Id },
                        success: function (form, action) {
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert("Load failed", action.result.errorMessage);
                        }
                    });
                }
            },
            scope: this
        }
    }, config));
}
Ext.extend(Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow, Ext.Window, {
    initComponent: function () {
        this.form = new Ext.erp.iffs.ux.SurveyRequestNotification.Form();
        this.items = [this.form];
        this.bbar = ['->', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: this.onSave,
            scope: this
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
        Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow.superclass.initComponent.call(this, arguments);
    },
    onSave: function () {
        var form = this.form.getForm();
        if (!form.isValid()) return;
        form.submit({
            success: function (form, action) {
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
                    title: 'Errors',
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
Ext.reg('SurveyRequestSchedule-window', Ext.erp.iffs.ux.SurveyRequestNotification.ScheduleWindow);

