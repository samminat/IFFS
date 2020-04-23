Ext.erp.iffs.ux.common.CommodityInfoGrid = function (config) {
    Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.constructor.call(this, Ext.apply({
        store: new Ext.data.DirectStore({
            directFn: Iffs.GetPagedExpense,
            paramsAsHash: false,
            paramOrder: 'start|limit|sort|dir|param',
            root: 'data',
            idProperty: 'Id',
            totalProperty: 'total',
            sortInfo: {
                field: 'Code',
                direction: 'ASC'
            },

            fields: ['Id', 'Name', 'Code'],
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
        id: 'Common-commodityInfoGrid',
        pageSize: 10,
        height: 280,
        stripeRows: true,
        columnLines: true,
        border: false,
        sm: selModel,
        columns: [

        selModel, new Ext.grid.RowNumberer(),
        {
            dataIndex: 'Id',
            header: 'Id',
            sortable: true,
            hidden: true,
            width: 100,
            menuDisabled: true
        }, {
            dataIndex: 'Name',
            header: 'Name',
            sortable: true,
            width: 250,
            menuDisabled: true
        }
        , {
            dataIndex: 'Code',
            header: 'Code',
            sortable: true,
            width: 120,
            menuDisabled: true
        }
        ]
    }, config));
};
Ext.extend(Ext.erp.iffs.ux.common.CommodityInfoGrid, Ext.grid.GridPanel, {
    initComponent: function () {
        this.store.baseParams = { param: Ext.encode({ searchText: '' }) };

        this.tbar = [
       '->',
      {
          xtype: 'tbfill'
      }, {
          xtype: 'textfield',
          emptyText: 'Type Search text here and press                                             "Enter"',
          submitEmptyText: false,
          enableKeyEvents: true,
          style: {
              borderRadius: '25px',
              padding: '0 10px',
              width: '200px'
          },
          listeners: {
              specialKey: function (field, e) {
                  if (e.getKey() == e.ENTER) {
                      var grid = Ext.getCmp('Common-commodityInfoGrid');
                      grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                      grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                  }
              },
              Keyup: function (field, e) {
                  if (field.getValue() == '') {

                      var grid = Ext.getCmp('Common-commodityInfoGrid');
                      grid.store.baseParams['param'] = Ext.encode({ searchText: field.getValue() });
                      grid.store.load({ params: { start: 0, limit: grid.pageSize } });
                  }
              }
          }
      }
        ];
        this.bbar = new Ext.PagingToolbar({
            id: 'Common-itemSelectionPaging',
            store: this.store,
            displayInfo: true,
            pageSize: this.pageSize
        });
        Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.initComponent.apply(this, arguments);
    },
    afterRender: function () {
        this.getSelectionModel().clearSelections();
        this.getStore().load({
            params: { start: 0, limit: this.pageSize }
        });
        Ext.erp.iffs.ux.common.CommodityInfoGrid.superclass.afterRender.apply(this, arguments);
    }
});
Ext.reg('Common-commodityInfoGrid', Ext.erp.iffs.ux.common.CommodityInfoGrid);