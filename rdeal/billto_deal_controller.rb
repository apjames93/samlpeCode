def show
  debugger
  @billto = Deal.joins('left join addresses bill_to on bill_to.id = deals.billto_id').\
  where('deals.id = ?', params[:id]).select('bill_to.*')
end



# in the show 
# json.deal(@billto) do |data|
#   json.address1 data.address1
#   json.address2 data.address2
#   json.city data.city
#   json.state data.state
#   json.zip data.zip
# end
