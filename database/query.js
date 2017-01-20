var QUERY = {};



/* boilerplate

,SELECT :
    "SELECT" +
    "  FROM" +
    " WHERE" +
    "" +

,UPDATE :
    "UPDATE `` " +
    " WHERE" +
    "" +

,DELETE
    "DELETE FROM `` " +
    " WHERE " +
    ""
*/

QUERY.ADMIN = {
    ResetPassword:
    "update `admin` set password=? " +
    "where `id`=? and name=?;"
	,GetList :
		"select * from `admin` "+
		"where fc_id=? " +
		"order by `id` asc;"
    ,GetAdminBranch :
        "SELECT b.`id`, b.`name` " +
        "  FROM `branch` AS b " +
        " INNER JOIN `admin_branch` AS ab " +
        "    ON b.`id` = ab.`branch_id` " +
        "   AND ab.`admin_id` = ? " +
        " WHERE b.`fc_id` = ? " + 
        "   AND b.`active` = 1; "        
	,CreateAdmin :
		"insert into `admin` (`name`, `email`, `password`, `role`, `fc_id`) " +
		"values(?,?,?,?,?);"
    ,ModifyAdmin :
        "update `admin` set `name`=?, `email`=? " +
        " where `id`=? "
    ,ResetPassword:
        "update `admin` set password=? " +
        "where `id`=?; "
    ,ResetRole:
        "update `admin` set role=? " +
        "where `id`=?; "
    ,InsertAdminBranch: 
        "INSERT IGNORE `admin_branch` (`admin_id`, `branch_id`) VALUES ?; "
    ,DeleteAdminBranch:
        "DELETE FROM `admin_branch` WHERE `admin_id` = ?; "
    
};

QUERY.LOGIN = {
  login :
    "select a.id as admin_id, a.name, a.email, a.password, a.role, f.name as fc_name, f.id as fc_id " +
    "from `admin` as a " +
    "left join `fc` as f " +
    "on f.id = a.fc_id " +
    "where a.email=?;"
};

QUERY.EMPLOYEE = {
  GetBranch :
    "select b.id, b.name from `branch` as b " +
    "where b.fc_id=? and b.active=true;"
  ,GETDUTY:
    "select d.id, d.name from `duty` as d " +
    "where d.fc_id=? and d.active=true;"
  ,CreateEmployee :
    "insert into `users` (`name`, `password`, `email`, `phone`, `fc_id`, `duty_id`, `branch_id`) " +
    "values(?,?,?,?,?,?,?);"
  ,CreateBranch :
    "insert into `branch` (`name`, `fc_id`) values(?,?);"
  ,CreateDuty :
    "insert into `duty` (`name`, `fc_id`) values(?,?);"
  ,GET_EMPLOYEE_LIST:
    "select u.id as id, u.name as name, u.phone as phone, u.email as email, b.name as branch, d.name as duty, b.id as branch_id, d.id as duty_id " +
    "from `users` as u " +
    "left join `fc` as f " +
    "on f.id = u.fc_id " +
    "left join `branch` as b " +
    "on b.id = u.branch_id " +
    "left join `duty` as d " +
    "on d.id = u.duty_id " +
    "where u.fc_id=? and u.active=true " +
    "order by u.id desc;"
  ,ResetPassword:
    "update `users` set password=? " +
    "where `id`=? and name=?;"
  ,ModifyEmployee :
    "update `users` " +
    "set name=?, email=?, phone=?, branch_id=?, duty_id=? " +
    "where id=? and fc_id=?;"
};

QUERY.COURSE = {

  // 특정 fc 의 전체 강의목록을 조회한다.
  GetCourseList :
    "select c.id as course_id, c.name, t.name as teacher, c.created_dt, a.name as creator " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "left join `admin` as a " +
    "on a.id = c.creator_id " +
    "where a.fc_id=? " +
    "order by c.created_dt desc;"

   // 강의정보를 조회한다.
  ,GetCourseListById :
    "SELECT c.id as course_id, c.name, t.name as teacher, c.created_dt, a.name as creator, c.desc " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "left join `admin` as a " +
    "on a.id = c.creator_id " +
    "where a.fc_id=? and c.id=? " +
    "order by c.created_dt desc;"

  // 강의평가를 조회한다.
  ,GetStarRatingByCourseId:
    "select round(avg(course_rate),1) as rate " +
    "from `user_rating` " +
    "where course_id=? " +
    "group by `course_id`;"

  // 강의평가를 조회한다.
  ,GetStarRatingByTeacherId:
    "SELECT ROUND(AVG(`teacher_rate`), 1) AS teacher_rate " +
    "  FROM `user_rating` " +
    " WHERE teacher_id = ? " +
    " GROUP BY `teacher_id`; "    

  // 세션목록을 조회한다.
  ,GetSessionListByCourseId:
    "select * from `course_list` as cl " +
    "where cl.course_id=? " +
    "order by cl.`order` asc, cl.`id` asc;"

 // 세션 정보를 id 로 조회한다.
 ,GetSessionById:
    "SELECT `id`, `course_id`, `type`,`title`,`quiz_group_id`, `order` " +
    "  FROM `course_list` " +
    " WHERE `id` = ? "

  // 강사정보를 조회한다.
  ,GetTeacherInfoByCourseId :
    "select t.`id` AS teacher_id, t.name, t.desc " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "where c.id=? ;"

  // 강사목록을 조회한다.
  ,GetTeacherList:
    "select t.id, t.name, t.desc " +
    "from `teacher` as t " +
    "left join `admin` as a " +
    "on a.id = t.creator_id " +
    "where a.fc_id=?;"

  // 강사를 생성한다.
  ,CreateTeacher:
    "insert into `teacher` (`name`, `desc`, `creator_id`) " +
    "values(?,?,?);"

  // 강의를 생성한다.
  ,CreateCourse :
    "insert into `course` (`name`, `teacher_id`, `desc`, `creator_id`) " +
    "values (?,?,?,?);"

  // 강의를 수정한다.
  ,UpdateCourse:
    "update `course` set `name`=?, `teacher_id`=?, `desc`=?, `creator_id`=?, `updated_dt`=? " +
    "where `id`=?;"
  
  // 강의 세션수를 조회한다.
  ,GetSessionCount:
    "SELECT COUNT(*) AS session_count FROM `course_list` WHERE `course_id` = ?; "
  
  // 비디오를 ID로 조회한다.
  ,GetVideoDataById :
    "select * from `video` where id=?;"

  // 비디오 ID 로 삭제한다.
  ,DeleteVideoById :
    "DELETE FROM `video` WHERE `id` = ?; "    

  // 비디오 ID 로 수정한다.
  ,UpdateVideoById:
    "UPDATE `video` SET `name` = ?, `type` = ?, `url` = ?, `updated_dt` = NOW() " +
    " WHERE `id` = ?; "     

  // 특정 세션의 그룹아이디로 퀴즈를 조회한다.
  ,GetQuizDataByGroupId:
    "SELECT q.`id` AS quiz_id " +
    "     , q.`type` " +
    "     , q.`quiz_type` AS quiz_type " +
    "     , q.`question` " +
    "     , q.`answer_desc` " +
    "     , q.`answer_desc` " +
    "     , qg.`order` AS quiz_order " +
    "     , q.`option_id` as `option_group_id` " +
    "     , qo.`id` as `option_id` " +    
    "     , qo.`option` " +
    "     , qo.`order` AS option_order " +     
    "     , qo.`iscorrect`  " +
    "  FROM `quiz_group` AS qg " +
    " INNER JOIN `quiz` AS q " +
    "    ON qg.`quiz_id` = q.`id` " +
    "  LEFT JOIN `quiz_option` AS qo " +
    "    ON qo.`opt_id` = q.`option_id` " +
    " WHERE qg.`group_id` = ? " +
    " ORDER BY qg.`order`, qo.`order` "
  
  // 특정 세션의 그룹아이디로 퀴즈를 조회한다.(deprecated)
  ,GetQuizDataByGroupId_bak :
    "select " +
    "q.id, q.type, q.question, q.answer, q.answer_desc, qo.option, qo.order, qo.id as option_id " +
    "from `quiz` as q " +
    "left join `quiz_option` as qo " +
    "on qo.opt_id = q.option_id " +
    "where q.id in ( " +
        "select quiz_id from `quiz_group` " +
        "where group_id=? " +
        "order by `order` desc, id asc " +
    ")" +
    "order by `order` desc, qo.`id`;"

    // 비디오를 생성한다.
	,CreateVideo :
		"insert into `video` (`name`, `type`, `url`, `creator_id`) " +
		"values(?,?,?,?);"

    // 비디오 세션을 생성한다.
	,InsertIntoCourseListForVideo :
		"insert into `course_list` (`course_id`, `type`, `title`, `video_id`) " +
		"values (?,?,?,?);"
    
    // 퀴즈/파이널테스트 세션을 생생헌다.
	,InsertIntoCourseListForQuiz :
		"INSERT IGNORE INTO `course_list` (`course_id`, `type`, `title`, `quiz_group_id`, `order`) " +
		"VALUES (?,?,?,?,?);"

    // 퀴즈 그룹을 생생헌다.
    // `group_id`, `quiz_id` 가 중복일 경우 순서만 변경할 수 있다.
	,InsertOrUpdateQuizGroup  :
		"INSERT INTO `quiz_group` (`group_id`, `quiz_id`, `order`) " +
		"VALUES (?,?,?) " +
        "ON DUPLICATE KEY UPDATE `order` = ?; "
    
    // 퀴즈(단합형) 를 생성한다.
    ,CreateQuizNoOption :
        "INSERT INTO `quiz` (`type`, `quiz_type`, `question`, `answer_desc`) " +
        "VALUES (?,?,?,?) "

    // 퀴즈(선택형, 다답형)를 수정한다.
    ,UpdateQuizWithNoOption:
        "UPDATE `quiz` SET `question` = ?, `answer_desc` = ?, updated_dt = NOW() WHERE `id` = ?; "

    // 퀴즈(선택형, 다답형)를 생성한다.
    ,CreateQuizWithOption:
        "INSERT INTO `quiz` (`type`, `quiz_type`, `question`, `option_id`) " +
        "VALUES (?,?,?,?) "
    
    // 퀴즈(선택형, 다답형)를 수정한다.
    ,UpdateQuizWithOption:
        "UPDATE `quiz` SET `question` = ?, `updated_dt` = NOW() WHERE `id` = ?; "

    // 퀴즈(선택형, 다답형)의 보기를 생성한다.
    ,CreateQuizOption:
        "INSERT INTO `quiz_option` SET ? "

    ,UpdateQuizOption:
        "UPDATE `quiz_option` SET `option` = ?, `iscorrect` = ?, `order` = ?, `updated_dt` = NOW() WHERE `id` = ?; "        

    // 퀴즈(선택형, 다답형)의 보기를 일괄 생성한다.
    ,CreateQuizMultipleOption:
        "INSERT INTO `quiz_option` (`opt_id`, `option`, `iscorrect`, `order`) " +
        "VALUES ?; "

    // 세션정보(course_list) 삭제
    ,DeleteCourseListId :
        "DELETE FROM `course_list` WHERE `id` = ? "
    
    // 퀴즈 보기(quiz_option) 삭제
    ,DeleteQuizOptionByGroupId :
        "DELETE qo FROM `quiz_option` AS qo " +
        " WHERE EXISTS ( " +
		"           SELECT 'X' " +
		"             FROM `quiz` AS q " +
		"            WHERE EXISTS ( " +
		"	                SELECT 'X' " +
		"	                  FROM `quiz_group` " +
		"	                 WHERE `group_id` = ? " +
		"	                   AND `quiz_id` = q.`id`) " +
        "              AND qo.`opt_id` = q.`option_id`) "

    // 퀴즈 보기(quiz_option) option_group_id 로 삭제
    ,DeleteQuizOptionByOptionGroupId :
        "DELETE qo FROM `quiz_option` AS qo " +
        " WHERE qo.`opt_id` = ?; "

    // 퀴즈 보기(quiz_option) id로 삭제
    ,DeleteQuizOptionById :
        "DELETE qo FROM `quiz_option` AS qo " +
        " WHERE qo.`id` = ?; "

    // 퀴즈(quiz) 를 삭제한다.
    ,DeleteQuizByGroupId:
        "DELETE q " +
        "  FROM `quiz` AS q " +
        " WHERE EXISTS ( " +
	    "           SELECT 'X' " +
	    "             FROM `quiz_group` " +
	    "            WHERE `group_id` = ? " +
        "              AND `quiz_id` = q.`id`) "  

    // 퀴즈(quiz) id로 삭제한다.
    ,DeleteQuizById:
        "DELETE q " +
        "  FROM `quiz` AS q " +
        " WHERE q.`id` = ?; "

    // 퀴즈 보기 그룹(quiz_group) 삭제 (deprecated)
    // 퀴즈가 삭제 시 CASCADE 제약으로 함께 삭제된다.
    ,DeleteQuizGroupByGroupId:
        "DELETE qg " + 
        "  FROM `quiz_group` AS qg " +
        " WHERE qg.`group_id` = ? "
    
    // 세션을 수정한다.
    ,UpdateSession:
        "UPDATE `course_list` SET " +
        "       `title` = ? " +
        "     , `order` = ? " +
        "     , `updated_dt` = NOW() " + 
        " WHERE `id` = ?; "

    // 세션 제목을 수정한다.
    ,UpdateSessionTitleById:
        "UPDATE `course_list` SET " +
        "       `title` = ? " +
        "     , `updated_dt` = NOW() " + 
        " WHERE `id` = ?; "        
};

QUERY.EDU = {

    // 교육과정 리스트를 조회한다.
    // offset, limit이 한동안 없이 진행한다.
	GetList : 
        "SELECT e.`id` AS education_id " +
        "     , e.`name` " +   
        "     , e.`created_dt` " +   
        "     , e.`start_dt` " +   
        "     , e.`end_dt` " +   
        "     , a.`name` AS creator " +   
        "     , e.`course_group_id` " +   
        "  FROM `edu` AS e " +
        "  LEFT JOIN `admin` AS a " +
        "    ON e.`creator_id` = a.`id` " +
        " WHERE e.`active` = 1 " +
        "   AND a.`fc_id` = ? " +
        " ORDER BY e.`created_dt` DESC, e.`id` DESC; "

        // "select e.id, e.`name`, e.`created_dt`, e.`start_dt`, e.`end_dt`, a.`name` as creator, e.course_group_id " +
        // "from `edu` as e " +
        // "left join `admin` as a " +
        // "on e.creator_id = a.id " +
        // "where e.active=true and a.fc_id=? " +
        // "order by e.`created_dt` desc, e.`id` desc;"

    // 교육과정 정보를 조회한다.
    ,GetEduInfoById : 
        "SELECT e.`id` " +
        "     , e.`name` " +
        "     , e.`desc` " +
        "     , e.`start_dt` " +
        "     , e.`end_dt` " +
        "     , e.`course_group_id` AS course_group_key " +
        "  FROM `edu` AS e " + 
        " WHERE e.`id` = ?; "

    // 교육과정의 강의를 조회한다.
    ,GetCourseListByGroupId:
        "SELECT c.`id` AS course_id " +
        "     , c.`name` AS course_name " +
        "     , c.`desc` AS course_desc " +
        "     , t.`name` AS teacher_name " +
        "     , cg.`id` AS course_group_id " +
        "     , cg.`group_id` AS course_group_key " +
        "  FROM `course_group` AS cg " +
        " INNER JOIN `course` AS c " +
        "    ON cg.`course_id` = c.`id` " +
        "   AND c.`active` = 1 " +
        "  LEFT JOIN `teacher` AS t " +
        "    ON c.`teacher_id` = t.`id` " +    
        " WHERE `group_id` = ? " +
        " ORDER BY cg.`order` ASC, cg.`id` ASC "

    // 교육과정의 강의를 조회한다. (deprecated)
	,GetCourseListByGroupId_bak :
		"select c.`id`, c.`name` as name, c.`desc`, t.`name` as teacher " +
		"from `course` as c " +
		"left join `teacher` as t " +
		"on c.teacher_id = t.id " +
		"where c.id in ( " +
			"select course_id from `course_group` " +
			"where group_id=? " +
			"order by `order` desc, `id` asc " +
		")" +
		"and c.`active`=true;"

    // 해당 FC의 전체 강의리스트를 조회한다. 
	,GetCourseList :
        "SELECT c.`id` AS course_id " +
        "     , c.`name` AS course_name " +
        "     , t.`name` AS teacher_name " +
        "  FROM `course` AS c " +
		"  LEFT JOIN `admin` AS a " +
		"    ON a.`id` = c.`creator_id` " +
		"  LEFT JOIN `teacher` AS t " +
		"    ON t.`id` = c.`teacher_id` " +        
        " WHERE a.`fc_id` = ? " +
        " ORDER BY c.`name` ASC "
    
		// "select c.id, c.name, t.name as teacher " +
		// "from `course` as c " +
		// "left join `admin` as a " +
		// "on a.id = c.creator_id " +
		// "left join `teacher` as t " +
		// "on t.id = c.teacher_id " +
		// "where a.fc_id=?; "    
    
    // 교육과정을 생성한다.
    ,InsertCourseDataInEdu :
		"insert into `edu` (`name`, `desc`, `course_group_id`, `creator_id`, `start_dt`, `end_dt`) " +
		"values(?,?,?,?,?,?); "
        
	,InsertCourseGroup :
		"insert into `course_group` (`group_id`, `course_id`) " +
		"values(?,?);"
    // 강의그룹 순서를 변경한다.
    ,UpdateCourseGroup:
        "UPDATE `course_group` SET `order` = ? WHERE `id` = ?; "

	,GetUserDataByPhone :
		"select id from `users` " +
		"where `phone` in (?);"
	,InsertIntoLogGroupUser :
		"insert into `log_group_user` (`user_id`, `group_id`) " +
		"values(?,?);"
	,InsertIntoLogBindUser :
		"insert into `log_bind_users` (`title`,`desc`,`creator_id`, `group_id`) " +
		"values(?,?,?,?);"
	,GetCustomUserList :
		"select lbu.id, lbu.title, lbu.desc, a.name as creator, lbu.created_dt, lbu.group_id " +
		"from `log_bind_users` as lbu " +
		"left join `admin` as a " +
		"on a.id = lbu.creator_id " +
		"where a.fc_id=? " +
		"order by lbu.`created_dt` desc, lbu.`id` desc;"
	,GetAssignmentDataById :
		"select lbu.id, lbu.title, lbu.desc, lbu.group_id, lbu.created_dt, a.name as creator " +
		"from `log_bind_users` as lbu " +
		"left join `admin` as a " +
		"on a.id = lbu.creator_id " +
		"where lbu.`id`=?;"
	,GetUserListByGroupId :
		"select u.id, u.name, u.email, u.phone, b.name as branch, d.name as duty " +
		"from `users` as u " +
		"left join `branch` as b " +
		"on b.id = u.branch_id " +
		"left join `duty` as d " +
		"on d.id = u.duty_id " +
		"where u.`id` in " +
		"( " +
			"select user_id from `log_group_user` " +
			"where `group_id`=? " +
			"order by `id` asc " +
		");"
	,InsertTrainingEdu :
        "insert into `training_edu` (`edu_id`, `assigner`) " +
        "values(?,?);"
    ,InsertUserIdInTrainingUsers :
        "insert into `training_users` (`user_id`, `training_edu_id`) " +
        "values(?,?);"
    
    // 강의그룹에서 id로 삭제한다.
    ,DeleteCourseGroupById:
        "DELETE FROM `course_group` " +
        " WHERE `id` = ?; "
};

QUERY.HISTORY = {
	GetAssignHistory :
		"select te.id, e.name, te.created_dt, e.start_dt, e.end_dt, a.name as admin " +
		"from `training_edu` as te " +
		"left join `edu` as e " +
		"on e.id = te.edu_id " +
		"left join `admin` as a " +
		"on a.id = te.assigner " +
		"where a.fc_id=? " +
		"order by te.created_dt desc;"
	,InsertIntoLogAssignEdu :
		"insert into `log_assign_edu` (`training_edu_id`, `target_users_id`) " +
		"values(?,?);"

    // 진척도관리
	,GetAssignEduHistory :
		"select e.id as edu_id, te.id, e.name, te.created_dt, e.start_dt, e.end_dt, a.name as admin, lbu.title as target " +
		"from `training_edu` as te " +
        "inner join `admin` as a " + 
        "on a.id = te.assigner " +
        "and a.fc_id = ? " +
		"left join `edu` as e " +
		"on e.id = te.edu_id " +
		"left join `log_assign_edu` as lae " +
		"on lae.training_edu_id = te.id " +
		"left join `log_bind_users` as lbu " +
		"on lbu.id = lae.target_users_id " +
		"order by te.created_dt desc;"
    
    // 진척도관리(슈퍼바이저)
	,GetAssignEduHistory2 :
		"select e.id as edu_id, te.id, e.name, te.created_dt, e.start_dt, e.end_dt, a.name as admin, lbu.title as target " +
		"from `training_edu` as te " +
        "inner join `admin` as a " + 
        "on a.id = te.assigner " +
        "and a.fc_id = ? " +
		"left join `edu` as e " +
		"on e.id = te.edu_id " +
		"left join `log_assign_edu` as lae " +
		"on lae.training_edu_id = te.id " +
		"left join `log_bind_users` as lbu " +
		"on lbu.id = lae.target_users_id " +
        "where te.id IN ( " +
        "    SELECT DISTINCT training_edu_id " +
        "      FROM `training_users` AS tu  " +
        "     INNER JOIN `users` AS u " +
        "        ON tu.`user_id` = u.`id` " +     
        "     INNER JOIN `admin_branch` AS ab " +
        "        ON u.`branch_id` = ab.`branch_id` " +
        "       AND ab.`admin_id` = ?) " +
		"order by te.created_dt desc;"      
};

QUERY.ACHIEVEMENT = {
	GetTotalSessByEdu : // edu아이디를 통해서 강의별 총 세션수를 가져온다.
		"select course_id, count(*) as sess_total from `course_list` " +
		"where `course_id` in ( " +
		"select c.`id` " +
		"from `course` as c " +
		"where c.id in ( " +
			"select course_id from `course_group` " +
		"where group_id=(select course_group_id from `edu` where id=?) " + // edu_id를 바인딩할 것.(ex 22)
		"order by `order` desc, `id` asc " +
		") and c.`active`=true " +
		") " +
		"group by `course_id`;"
	,GetListWithCompletedSessByTrainingEduId_old : // deprecated
		"select " +
		"tu.user_id, if(sess.completed_sess is null, 0, sess.completed_sess) as completed_sess, u.name, d.name as duty, b.name as branch " +
		"from `training_users` as tu " +
		"left join ( " +
			"select user_id, count(*) as completed_sess from `log_session_progress` " +
			"where user_id in ('1', '2') and course_id in ('7', '8') and training_user_id in ('25', '26') " +
			"group by `user_id` " +
		") as sess " +
		"on tu.user_id = sess.user_id " +
		"left join `users` as u " +
		"on tu.user_id = u.id " +
		"left join `branch` as b " +
		"on u.branch_id = b.id " +
		"left join `duty` as d " +
		"on d.id = u.duty_id " +
		"where tu.training_edu_id=15 " + // training_edu_id는 테이블에서 넘겨 받도록 한다
		"order by `completed_sess` desc;"
	,GetListWithCompletedSessByTrainingEduId :
		"select " +
		"tu.user_id, if(sess.completed_sess is null, 0, sess.completed_sess) as completed_sess, u.name, d.name as duty, b.name as branch " +
		"from `training_users` as tu " +
		"left join ( " +
		"select user_id, count(*) as completed_sess from `log_session_progress` " +
		"where course_id in (?) " +
		"group by `user_id` " +
		") as sess " +
		"on tu.user_id = sess.user_id " +
		"left join `users` as u " +
		"on tu.user_id = u.id " +
		"left join `branch` as b " +
		"on u.branch_id = b.id " +
		"left join `duty` as d " +
		"on d.id = u.duty_id " +
		"where tu.training_edu_id=? " + // training_edu_id는 테이블에서 넘겨 받도록 한다
		"order by `completed_sess` desc;"

	,GetCompletionByBranch :
		"select b.name as branch, if( sum(sess.completed_sess) is null, 0, sum(sess.completed_sess)) as sess_sum, count(*) as user_count " +
		"from `training_users` as tu " +
		"left join " +
		"( " +
			"select user_id, count(*) as completed_sess " +
			"from `log_session_progress` as lsp " +
			"where course_id in (?) " +
			"group by `user_id` " +
		") as sess " +
		"on tu.user_id = sess.user_id " +
		"left join `users` as u " +
		"on u.id = tu.user_id " +
		"left join `branch` as b " +
		"on b.id = u.branch_id " +
		"where tu.training_edu_id=? " +
		"group by branch " +
		"order by `completed_sess` desc;"
        
	,GetEduInfoById :
		"select `name` from `edu` " +
		"where `id`=?;"

    // 지점별 이수율
    ,GetBranchProgress:
        "SELECT g.`branch_id` " +
        "     , MAX(b.`name`) AS branch_name " +
        "     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate " +
        "  FROM ( " +
        "		SELECT @training_user_id := tu.`id` AS training_user_id " +
        "			 , @course_id := e.`course_id` AS course_id " +
        "			 , ( " +
        "				SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) " + 
        "				  FROM `course_list` AS cl " +
        "				  LEFT JOIN `log_session_progress` AS up " +
        "					ON cl.id = up.`course_list_id` " +
        "				   AND up.`training_user_id` = @training_user_id " +
        "				   AND up.`end_dt` IS NOT NULL " +
        "				 WHERE cl.`course_id` = @course_id " +
        "				) AS completed_rate " + 
        "			 , u.`branch_id` " +
        "		  FROM `training_users` AS tu " +
        "		 INNER JOIN `users` AS u " +
        "			ON tu.`user_id` = u.`id` " +  
        "          AND u.`fc_id` = ? " +
        "          AND u.`active` = 1 " +
        "		 INNER JOIN `admin_branch` AS ab " +
        "			ON u.`branch_id` = ab.`branch_id` " +
        "		   AND ab.`admin_id` = ? " +
        "		 INNER JOIN `training_edu` AS te " +
        "			ON tu.`training_edu_id` = te.`id` " +
        "		   AND te.`edu_id` = ? " +
        "		 INNER JOIN " + 
        "			   ( " +
        "				SELECT e.`id` AS edu_id, cg.`course_id` " +
        "				  FROM `edu` AS e " +
        "				 INNER JOIN `course_group` AS cg " +
        "					ON e.`course_group_id` = cg.`group_id` " +
        "				 WHERE e.`id` = ? " +
        "			   ) AS e " +
        "			ON te.`edu_id` = e.`edu_id` " + 
        "	  ) AS g " +
        " INNER JOIN `branch` AS b " +
        "   ON g.`branch_id` = b.`id` " +
        " GROUP BY g.`branch_id` " +
        " ORDER BY `completed_rate` DESC; "

    // 교육생별 이수율
    ,GetUserProgress:        
        "SELECT MAX(g.`user_name`) AS user_name " +
        "     , MAX(b.`name`) AS branch_name " +
        "     , MAX(d.`name`) AS duty_name " +
        "     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate " +
        "  FROM ( " +
        "		SELECT tu.`user_id` " +
        "			 , u.`name` AS user_name " +
        "			 , @training_user_id := tu.`id` AS training_user_id " +
        "			 , @course_id := e.`course_id` AS course_id " +
        "			 , ( " +
        "				SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) " + 
        "				  FROM `course_list` AS cl " +
        "				  LEFT JOIN `log_session_progress` AS up " +
        "					ON cl.id = up.`course_list_id` " +
        "				   AND up.`training_user_id` = @training_user_id " +
        "				   AND up.`end_dt` IS NOT NULL " +
        "				 WHERE cl.`course_id` = @course_id " +
        "				) AS completed_rate " +           
        "			 , u.`branch_id` " +
        "            , u.`duty_id` " +
        "		  FROM `training_users` AS tu " +
        "		 INNER JOIN `users` AS u " +
        "			ON tu.`user_id` = u.`id` " +   
        "          AND u.`fc_id` = ? " +
        "          AND u.`active` = 1 " +
        "		 INNER JOIN `admin_branch` AS ab " +
        "			ON u.`branch_id` = ab.`branch_id` " +
        "		   AND ab.`admin_id` = ? " +
        "		 INNER JOIN `training_edu` AS te " +
        "			ON tu.`training_edu_id` = te.`id` " +
        "		   AND te.`edu_id` = ? " +
        "		 INNER JOIN  " +
        "			   ( " +
        "				SELECT e.`id` AS edu_id, cg.`course_id` " +
        "				  FROM `edu` AS e " +
        "				 INNER JOIN `course_group` AS cg " +
        "					ON e.`course_group_id` = cg.`group_id` " +
        "				 WHERE e.`id` = ? " +
        "			   ) AS e " +
        "			ON te.`edu_id` = e.`edu_id` " + 
        "	  ) AS g " +
        "  LEFT JOIN `branch` AS b " +
        "    ON g.`branch_id` = b.`id` " +
        "  LEFT JOIN `duty` AS d " +
        "    ON g.`duty_id` = d.`id` " +    
        " GROUP BY g.`user_id` " +
        " ORDER BY `completed_rate` DESC; "    
};

QUERY.DASHBOARD = {
	GetUserCount :
		"select count(*) as total_users from `users` " +
		"where fc_id=?;"
	,GetBranchCount :
		"select count(*) total_branch from `branch` " +
		"where fc_id=?;"
	,GetCurrentEduCount :
		"select count(*) as current_edu from `training_edu` as te " +
		"left join `edu` as e " +
		"on e.id = te.edu_id " +
		"left join `admin` as a " +
		"on a.id = e.creator_id " +
		"where start_dt <= now() and end_dt >= now() " +
		"and a.fc_id=?;"
	,GetTotalEduCount :
		"select count(*) as total_edu from `edu` as e " +
		"left join `admin` as a " +
		"on a.id = e.creator_id " +
		"where fc_id=?;"
	,GetRecentPointWeight :
		"select pw.point_complete, pw.point_quiz, pw.point_final, pw.point_reeltime, pw.point_speed, pw.point_repetition " +
		"from `point_weight` as pw " +
		"left join `admin` as a " +
		"on a.id = pw.setter_id " +
		"where a.fc_id=? " +
		"order by `created_dt` desc " +
		"limit 1;"
	,SetPointWeight :
		"insert into `point_weight` (`point_complete`,`point_quiz`, `point_final`, " +
		"`point_reeltime`, `point_speed`, `point_repetition`, `setter_id`) " +
		"values(?,?,?,?,?,?,?);"
};


module.exports = QUERY;