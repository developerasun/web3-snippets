-- https://school.programmers.co.kr/learn/courses/30/lessons/133025
SELECT f.flavor from first_half as f
left join icecream_info as i 
on f.flavor = i.flavor
where (f.total_order > 3000 and i.ingredient_type = "fruit_based")
order by f.total_order desc