var QUERY = {};

QUERY.ADMIN = {
  ResetPassword:
  "update `admin` set password=? " +
  "where `id`=? and name=?;"

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
    "select round(avg(rate),1) as rate " +
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
  ,GetTeacherList: // 특정 fc 소속의 모든 admin이 등록한 강사 리스트를 가져온다.
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
};


module.exports = QUERY;