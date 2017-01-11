
  
SELECT g.`branch_id`
     , MAX(b.`name`) AS branch_name
     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate
  FROM (
		SELECT tu.`user_id`
			 , u.`name` AS user_name
			 , @training_user_id := tu.`id` AS training_user_id
			 , @course_id := e.`course_id` AS course_id
			 , tu.`training_edu_id`
			 , tu.`start_dt`
			 , tu.`end_dt`
			 , e.`edu_id`
			 , (
				SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) 
				  FROM `course_list` AS cl
				  LEFT JOIN `log_session_progress` AS up
					ON cl.id = up.course_list_id
				   AND up.`training_user_id` = @training_user_id
				   AND up.`end_dt` IS NOT NULL
				 WHERE cl.`course_id` = @course_id
				) AS completed_rate           
			 , u.`fc_id`
			 , u.`branch_id`
		  FROM `training_users` AS tu
		 INNER JOIN `users` AS u
			ON tu.`user_id` = u.`id`     
		 INNER JOIN `admin_branch` AS ab
			ON u.`branch_id` = ab.`branch_id`
		   AND ab.`admin_id` = 8  
		 INNER JOIN `training_edu` AS te
			ON tu.`training_edu_id` = te.`id`
		   AND te.`edu_id` = 24
		 INNER JOIN 
			   (
				SELECT e.`id` AS edu_id, cg.`course_id`
				  FROM `edu` AS e
				 INNER JOIN `course_group` AS cg
					ON e.`course_group_id` = cg.`group_id`
				 WHERE e.`id` = 24
			   ) AS e
			ON te.`edu_id` = e.`edu_id` 
		 -- WHERE tu.`user_id` = 1    
		 -- ORDER BY tu.`user_id`, tu.`training_edu_id`, e.`course_id`
	  ) AS g
 INNER JOIN `branch` AS b
    ON g.`branch_id` = b.`id`
 GROUP BY g.`branch_id`
 ORDER BY `completed_rate` DESC

    
   
  
  
  
  
  