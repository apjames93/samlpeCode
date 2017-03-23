
json.array! @deals, partial: 'deals/deal', as: :deal


# in file _deal.json.jbuilder
json.extract! deal, :deal_id, :customer_id,
:trade_date, :market,
:customer_name, :beg_date, :end_date,
:pipeline_name, :locations_name


# show
json.volume(@deal) do |data|
  json.id data.deal_id
  json.contract_volume data.contract_volume
  json.actual_volume data.actual_volume
  json.trigger_volume data.trigger_volume
  json.risk_types data.risk_types_name
  json.pipeline_name data.pipeline_name
  json.begDate data.beg_date
  json.customerId data.deal_customer_id
end

json.billTo (@address) do |data|
  json.address1 data.bill_to_address1
  json.address2 data.bill_to_address2
  json.city data.bill_to_city
  json.state data.bill_to_state
  json.zip data.bill_to_zip
end

json.serviceAddress (@address) do |data|
  json.address1 data.service_address1
  json.address2 data.service_address2
  json.city data.service_address_city
  json.state data.service_address_state
  json.zip data.service_address_zip
end
json.contact (@address) do |data|
  json.name data.name
  json.email data.email_address
  json.workPhone data.work_phone
  json.mobilePhone data.mobile_phone
  json.fax data.fax
end


json.index (@index) do |data|
  json.overPremium data.over_premium
  json.underPremium data.under_premium
  json.baseMargin data.base_margin
  json.indexName data.index_description
  json.indexType data.index_ind_types_description
  json.swingName data.swing_description
  json.swingType data.swing_ind_types_description
end
