SELECT h.* FROM hospitalization h INNER JOIN  animal a ON a.id=h.animal  left join hospitalization_hedgehog_container hhc on hhc.hospitalization = h.id  WHERE a.group_name='Egel' AND h.exit is NULL AND hhc.id is NULL

