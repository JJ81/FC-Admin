var QUERY = {};

QUERY.ADMIN = {
  ResetPassword:
  "update `admin` set password=? " +
  "where `id`=? and name=?;"
	,GetList :
		"select * from `admin` "+
		"where fc_id=? " +
		"order by `id` asc;"
	,CreateAdmin :
		"insert into `admin` (`name`, `email`, `password`, `role`, `fc_id`) " +
		"values(?,?,?,?,?);"
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
  GETBRANCH :
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
  GetCourseList :
    "select c.id as course_id, c.name, t.name as teacher, c.created_dt, a.name as creator " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "left join `admin` as a " +
    "on a.id = c.creator_id " +
    "where a.fc_id=? " +
    "order by c.created_dt desc;"
  ,GetCourseListById :
    "select c.id as course_id, c.name, t.name as teacher, c.created_dt, a.name as creator, c.desc " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "left join `admin` as a " +
    "on a.id = c.creator_id " +
    "where a.fc_id=? and c.id=? " +
    "order by c.created_dt desc;"
  ,GetStarRatingByCourseId:
    "select round(avg(course_rate),1) as rate " +
    "from `user_rating` " +
    "where course_id=? " +
    "group by `course_id`;"
  ,GetSessionListByCourseId:
    "select * from `course_list` as cl " +
    "where cl.course_id=? " +
    "order by cl.`order` desc, cl.`id` asc;"
  ,GetTeacherInfoByCourseId :
    "select t.name, t.desc " +
    "from `course` as c " +
    "left join `teacher` as t " +
    "on c.teacher_id = t.id " +
    "where c.id=? ;"
  ,GetTeacherList:
    "select t.id, t.name, t.desc " +
    "from `teacher` as t " +
    "left join `admin` as a " +
    "on a.id = t.creator_id " +
    "where a.fc_id=?;"
  ,CreateTeacher:
    "insert into `teacher` (`name`, `desc`, `creator_id`) " +
    "values(?,?,?);"
  ,CreateCourse :
    "insert into `course` (`name`, `teacher_id`, `desc`, `creator_id`) " +
    "values (?,?,?,?);"
  ,UpdateCourse:
    "update `course` set `name`=?, `teacher_id`=?, `desc`=?, `creator_id`=?, `updated_dt`=? " +
    "where `id`=?;"
	,GetVideoDataById :
		"select * from `video` where id=?;"
	,GetQuizDataByGroupId :
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
	,CreateVideo :
		"insert into `video` (`name`, `type`, `url`, `creator_id`) " +
		"values(?,?,?,?);"
	,InsertIntoCourseListForVideo :
		"insert into `course_list` (`course_id`, `type`, `title`, `video_id`) " +
		"values (?,?,?,?);"
};

QUERY.EDU = {
	GetList : // offset, limit이 한동안 없이 진행한다.
	"select e.id, e.`name`, e.`created_dt`, e.`start_dt`, e.`end_dt`, a.`name` as creator, e.course_group_id " +
	"from `edu` as e " +
	"left join `admin` as a " +
	"on e.creator_id = a.id " +
	"where e.active=true and a.fc_id=? " +
	"order by e.`created_dt` desc, e.`id` desc;"
	,GetCourseListByGroupId :
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
	,GetCourseList :
		"select c.id, c.name, t.name as teacher " +
		"from `course` as c " +
		"left join `admin` as a " +
		"on a.id = c.creator_id " +
		"left join `teacher` as t " +
		"on t.id = c.teacher_id " +
		"where a.fc_id=?;"
	,InsertCourseDataInEdu :
		"insert into `edu` (`name`, `desc`, `course_group_id`, `creator_id`) " +
		"values(?,?,?,?);"
	,InsertCourseGroup :
		"insert into `course_group` (`group_id`, `course_id`) " +
		"values(?,?);"
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
	,GetAssignEduHistory :
		"select e.id as edu_id, te.id, e.name, te.created_dt, e.start_dt, e.end_dt, a.name as admin, lbu.title as target " +
		"from `training_edu` as te " +
		"left join `edu` as e " +
		"on e.id = te.edu_id " +
		"left join `admin` as a " +
		"on a.id = te.assigner " +
		"left join `log_assign_edu` as lae " +
		"on lae.training_edu_id = te.id " +
		"left join `log_bind_users` as lbu " +
		"on lbu.id = lae.target_users_id " +
		"where a.fc_id=? " +
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
		"group by `course_id`;",
	GetListWithCompletedSessByTrainingEduId_old : // deprecated
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
		"select * from `edu` " +
		"where `id`=?;"
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