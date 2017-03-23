# GET /deals
# GET /deals.json
def index
  dataLength = params[:id].to_i
  @deals = Deal.joins('left join customers on customers.id = deals.customer_id').\
  joins('join deal_details on deal_details.deal_id = deals.id').\
  joins('join pipelines on deal_details.pipeline_id = pipelines.id ').\
  joins('join locations on locations.id = deal_details.location_id').\
  select('deals.id AS deal_id, deals.customer_id, deals.trade_date, deals.market , deals.created_at,'\
  'customers.name AS customer_name,'\
  'deal_details.beg_date, deal_details.end_date,'\
  'pipelines.name AS pipeline_name,'\
  'locations.name as locations_name').order('deals.created_at DESC').\
  offset(dataLength).limit(300)
  end

  if params[:abc]
    @deals = @deals.where('pipeline_name ilike ? or ','%abc%')
  end

# GET /deals/1
# GET /deals/1.json
def show
    @deal = Deal.joins('left join deal_details dd on dd.deal_id = deals.id').\
    joins('left join deal_detail_volumes ddv on ddv.deal_detail_id = dd.id').\
    joins('left join risk_types on risk_types.id = dd.risk_type_id').\
    joins('left join pipelines on pipelines.id = dd.utility_id').\
    where('deals.id = ?', params[:id]).\
    select('deals.id AS deal_id, ddv.beg_date, dd.*, deals.customer_id AS deal_customer_id,'\
    'risk_types.*, risk_types.name AS risk_types_name, pipelines.*, pipelines.name AS pipeline_name,'\
    'sum(case when dd.trigger = false then ddv.contract_volume else 0 end) contract_volume,'\
    'sum(case when dd.trigger = false then ddv.actual_volume else 0 end) actual_volume,'\
    'sum(case when dd.trigger = true then ddv.contract_volume else 0 end)'\
    'trigger_volume').group('deals.id, ddv.beg_date, dd.id, deal_customer_id,'\
    'risk_types.id, pipelines.id').\
    order('ddv.beg_date')

    @address = Deal.joins('left join addresses bill_to on bill_to.id = deals.billto_id').\
    joins('left join addresses service_address on service_address.id = deals.service_id ').\
    joins('left join contacts on contacts.id = deals.contact_id').\
    select('deals.*, bill_to.*, service_address.*, contacts.*,'\
    'bill_to.address1 AS bill_to_address1, bill_to.address2 AS bill_to_address2,'\
    'bill_to.city AS bill_to_city, bill_to.state AS bill_to_state, bill_to.zip AS bill_to_zip,'\
    'service_address.address1 AS service_address1, service_address.address2 AS service_address2,'\
    'service_address.city AS service_address_city, service_address.state AS service_address_state,'\
    'service_address.zip AS service_address_zip').\
    where('deals.id = ?', params[:id])

    @index = Deal.joins('left join deal_details dd on dd.deal_id = deals.id').\
      joins('left join indices index on dd.index_id = index.id').\
      joins('left join ind_types index_ind_types on index.ind_type_id = index_ind_types.id').\
      joins('left join indices swing on dd.swing_index_id = swing.id').\
      joins('left join ind_types swing_ind_types on swing.ind_type_id = swing_ind_types.id').\
      select('index.*, index_ind_types.*, swing.*, swing_ind_types.*, dd.*,'\
      'index.description AS index_description, index_ind_types.description AS index_ind_types_description,'\
      'swing.description AS swing_description, swing_ind_types.description AS swing_ind_types_description').\
      where('deals.id = ?', params[:id])
end
