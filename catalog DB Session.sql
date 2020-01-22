SELECT
  p.id,
  p.name,
  p.producer,
  p.price,
  p.avaliable,
  p.create_user_id as "createdUserID"
FROM product p
LEFT JOIN product_section_assign p_s ON p_s.product_id = p.id
LEFT JOIN section s ON s.id = p_s.section_id
WHERE
  s.id = 'd11b763b-5564-4af5-a94f-27d1543fcc0e'
  AND p.create_user_id = '3992a688-a0e7-4f78-bac5-99ac85f56e43'
SELECT
  DISTINCT s.id,
  s.name
FROM product p
LEFT JOIN product_section_assign p_s ON p.id = p_s.product_id
LEFT JOIN section s ON s.id = p_s.section_id
WHERE
  create_user_id = '3992a688-a0e7-4f78-bac5-99ac85f56e43' 90d28474 - 028f -4359 - b335 - 16114f27e5e2
select
  *
from section
where
  id = 'd11b763b-5564-4af5-a94f-27d1543fcc0e'