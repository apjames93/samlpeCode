array = [Deal.joins('left join customers on customers.id = deals.customer_id').\
        joins('left join dealmakers on dealmakers.id = customers.dealmaker_id').\
        joins('join deal_details on deal_details.deal_id = deals.id').\
        joins('join risk_types on risk_types.id = deal_details.risk_type_id').\
        joins('join pipelines on deal_details.pipeline_id = pipelines.id ').\
        joins('join locations on locations.id = deal_details.location_id').\
        joins('left join commissions on commissions.id = deals.commission_id').\
        joins('left join contacts on contacts.id = deals.contact_id').\
        joins('left outer join addresses on addresses.id = deals.billto_id').\
        joins('left outer join fees feeOne on feeOne.id = deal_details.fee_1_id').\
        joins('left outer join fees feeTwo on feeTwo.id = deal_details.fee_2_id').\
        joins('left outer join fees feeThree on feeThree.id = deal_details.fee_3_id').\
        joins('left outer join fees feeFour on feeFour.id = deal_details.fee_4_id').\
        joins('left outer join fees feeFive on feeFive.id = deal_details.fee_5_id').\
        joins('left outer join fees feeSix on feeSix.id = deal_details.fee_6_id').\
        joins('left outer join fees feeSeven on feeSeven.id = deal_details.fee_7_id').\
        joins('left outer join fees feeEight on feeEight.id = deal_details.fee_8_id').\
        select('deals.id AS deal_id, deals.*,'\
        'customers.name AS customer_name, customers.*,'\
        'deal_details.*, dealmakers.name AS dealmakers_name ,'\
        'deal_details.risk_type_id AS deal_risk_types, risk_types.name AS risk_type_name ,'\
        'pipelines.name AS pipeline_name, pipelines.* ,'\
        'locations.name as locations_name, locations.*,'\
        'commissions.*, contacts.*, addresses.*, '\
        'feeOne.description As fee_one_discription,'\
        'feeTwo.description As fee_two_discription,'\
        'feeThree.description As fee_three_discription,'\
        'feeFour.description As fee_four_discription,'\
        'feeFive.description As fee_five_discription,'\
        'feeSix.description As fee_six_discription,'\
        'feeSeven.description As fee_seven_discription,'\
        'feeEight.description As fee_eight_discription').\
        find(params[:id])]

        SELECT *
FROM deal_details
WHERE id = 7607

        SELECT deal_details.id,deal_details.trigger, deal_detail_volumes.beg_date,
        	SUM(
        	CASE WHEN
        		deal_details.trigger = 'true'
        	THEN
        		deal_detail_volumes.contract_volume
        	ELSE
        	 0
        	END) AS contract_sum,
          SUM(
          CASE WHEN
            deal_details.trigger = 'true'
          THEN
            deal_detail_volumes.actual_volume
          ELSE
           0
          END) AS actual_sum
        FROM
        	deals JOIN deal_details using(id)
        JOIN
        	deal_detail_volumes ON deal_details.id = deal_detail_volumes.deal_detail_id
        WHERE
           deal_details.id = 7607
        GROUP BY
		      deal_details.id, deal_details.trigger, deal_detail_volumes.beg_date
        ORDER BY
          deal_detail_volumes.beg_date DESC
