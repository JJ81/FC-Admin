var QUERY = {};

QUERY.ADMIN = {
  ResetPassword:
    'UPDATE `admin` SET password= ? ' +
    'WHERE `id` = ? and name= ?; ',

  GetList:
    'SELECT * ' +
    '  FROM `admin` ' +
    ' WHERE `fc_id` = ? ' +
    '   AND `active` = 1 ' +
    ' ORDER BY `id` ASC; ',

  GetAdminBranch:
    'SELECT b.`id`, b.`name` ' +
    '  FROM `branch` AS b ' +
    ' INNER JOIN `admin_branch` AS ab ' +
    '    ON b.`id` = ab.`branch_id` ' +
    '   AND ab.`admin_id` = ? ' +
    ' WHERE b.`fc_id` = ? ' +
    '   AND b.`active` = 1; ',

  CreateAdmin:
    'INSERT INTO `admin` (`name`, `email`, `password`, `role`, `fc_id`) ' +
    'VALUES(?,?,?,?,?); ',

  ModifyAdmin:
    'UPDATE `admin` SET `name` = ?, `email` = ? ' +
    ' WHERE `id` = ?; ',

  ResetPassword:
    'UPDATE `admin` SET password = ? ' +
    ' WHERE `id` = ?; ',

  ResetRole:
    'UPDATE `admin` SET role = ? ' +
    ' WHERE `id`= ?; ',

  InsertAdminBranch:
    'INSERT IGNORE `admin_branch` (`admin_id`, `branch_id`) VALUES ?; ',

  DeleteAdminBranch:
    'DELETE FROM `admin_branch` WHERE `admin_id` = ?; ',

  // 관리자를 비활성화 한다.
  DisableAdminById:
    'UPDATE `admin` SET `active` = 0 WHERE `id` = ?; '
};

QUERY.LOGIN = {
  login:
    'SELECT a.`id` AS admin_id ' +
    '     , a.`name` ' +
    '     , a.`email` ' +
    '     , a.`password` ' +
    '     , a.`role` ' +
    '     , f.`name` AS fc_name ' +
    '     , f.`id` AS fc_id ' +
    '     , CURDATE() AS curdate ' +
    '  FROM `admin` AS a ' +
    '  LEFT JOIN `fc` AS f ' +
    '    ON f.`id` = a.`fc_id` ' +
    ' WHERE a.`email` = ?; '
};

QUERY.EMPLOYEE = {
  // 지점을 조회한다.
  GetBranch:
    'SELECT b.`id`, b.`name` ' +
    '  FROM `branch` AS b ' +
    ' WHERE b.`fc_id` = ? ' +
    '   AND b.`active` = 1; ',

  // 지점명으로 지점을 검색한다.
  GetBranchByName:
    'SELECT b.`id`, b.`name` ' +
    '  FROM `branch` AS b ' +
    ' WHERE b.`fc_id` = ? ' +
    '   AND b.`active` = true ' +
    '   AND b.`name` = ?; ',

  // 지점을 비활성화 한다.
  DisableEmployeeById:
    'UPDATE `users` SET `active` = 0 WHERE `id` = ?; ',

  // 지점을 비활성화 한다.
  DisableBranchById:
    'UPDATE `branch` SET `active` = 0 WHERE `id` = ?; ',

  // 직책을 조회한다.
  GetDuty:
    'SELECT d.`id`, d.`name` ' +
    '  FROM `duty` AS d ' +
    ' WHERE d.`fc_id` = ? ' +
    '   AND d.`active` = 1; ',

  // 직책명으로 직책을 검색한다.
  GetDutyByName:
    'SELECT b.`id`, b.`name` ' +
    '  FROM `duty` AS b ' +
    ' WHERE b.`fc_id` = ? ' +
    '   AND b.`active` = true ' +
    '   AND b.`name` = ?; ',

  // 직책을 비활성화 한다.
  DisableDutyById:
    'UPDATE `duty` SET `active` = 0 WHERE `id` = ?; ',

  CreateEmployee:
    'INSERT INTO `users` (`name`, `password`, `email`, `phone`, `fc_id`, `duty_id`, `branch_id`) ' +
    'VALUES(?,?,?,?,?,?,?); ',

  CreateBranch:
    'INSERT IGNORE `branch` (`name`, `fc_id`) VALUES (?,?);',

  ModifyBranch:
    'UPDATE `branch` SET `name` = ? WHERE `id` = ?; ',

  CreateDuty:
    'INSERT IGNORE `duty` (`name`, `fc_id`) VALUES(?,?); ',

  ModifyDuty:
    'UPDATE `duty` SET `name` = ? WHERE `id` = ?; ',

  // 직원목록 조회
  GetEmployeeList:
    'SELECT u.`id` AS id ' +
    '     , u.`name` AS name ' +
    '     , u.`phone` AS phone ' +
    '     , u.`email` AS email ' +
    '     , b.`name` AS branch ' +
    '     , d.`name` AS duty ' +
    '     , b.`id` AS branch_id ' +
    '     , d.`id` AS duty_id ' +
    '  FROM `users` AS u ' +
    '  LEFT JOIN `fc` AS f ' +
    '    ON f.`id` = u.`fc_id` ' +
    '  LEFT JOIN `branch` AS b ' +
    '    ON b.`id` = u.`branch_id` ' +
    '  LEFT JOIN `duty` AS d ' +
    '    ON d.`id` = u.`duty_id` ' +
    ' WHERE u.`fc_id` = ? ' +
    '   AND u.`active` = true ' +
    ' ORDER BY `branch`, d.`order`, u.`name`; ',

  ResetPassword:
    'UPDATE `users` SET password = ? ' +
    'WHERE `id` = ? and name = ?; ',

  // 직원정보를 수정한다.
  ModifyEmployee:
    'UPDATE `users` SET ' +
    '       `name` = ? ' +
    '     , `email` = ? ' +
    '     , `phone` = ? ' +
    '     , `branch_id` = ? ' +
    '     , `duty_id` = ? ' +
    ' WHERE `id` = ? ' +
    '   AND `fc_id` = ?; ',

  // 활성화된 사용자 중 휴대폰 번호가 같은 사람이 있는지 조회한다.
  GetActivatedUserByPhone:
    'SELECT `id`, `phone` ' +
    '  FROM `users` ' +
    ' WHERE `phone` = ? ' +
    '   AND `active` = 1; ',

  // 활성화된 다른 사용자 중 휴대폰 번호가 같은 사람이 있는지 조회한다.
  GetAnotherActivatedUserByPhone:
    'SELECT `id`, `phone` ' +
    '  FROM `users` ' +
    ' WHERE `id` <> ? ' +
    '   AND `phone` = ? ' +
    '   AND `active` = 1; '
};

QUERY.COURSE = {

  // 특정 fc 의 전체 강의목록을 조회한다.
  GetCourseList:
    'SELECT c.`id` AS course_id, c.`name`, t.`name` AS teacher, c.`created_dt`, a.`name` AS creator ' +
    '  FROM `course` AS c ' +
    '  LEFT JOIN `teacher` AS t ' +
    '    ON c.`teacher_id` = t.`id` ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = c.`creator_id` ' +
    ' WHERE a.`fc_id` = ? ' +
    '   AND c.`active` = 1 ' +
    ' ORDER BY c.`created_dt` DESC; ',

   // 강의정보를 조회한다.
  GetCourseListById:
    'SELECT c.`id` AS course_id, c.`name`, t.`name` AS teacher, c.`created_dt`, a.`name` AS creator, c.`desc` ' +
    '  FROM `course` AS c ' +
    '  LEFT JOIN `teacher` AS t ' +
    '    ON c.`teacher_id` = t.`id` ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = c.`creator_id` ' +
    ' WHERE a.`fc_id` = ? ' +
    '   AND c.`id` = ? ' +
    ' ORDER BY c.`created_dt` DESC; ',

  // 강의평가를 조회한다.
  GetStarRatingByCourseId:
    'SELECT ROUND(AVG(`course_rate`), 1) AS rate ' +
    '  FROM `user_rating` ' +
    ' WHERE course_id= ? ' +
    ' GROUP BY `course_id`; ',

  // 강의평가를 조회한다.
  GetStarRatingByTeacherId:
    'SELECT ROUND(AVG(`teacher_rate`), 1) AS teacher_rate ' +
    '  FROM `user_rating` ' +
    ' WHERE teacher_id = ? ' +
    ' GROUP BY `teacher_id`; ',

  // 세션목록을 조회한다.
  GetSessionListByCourseId:
    'SELECT * ' +
    '  FROM `course_list` AS cl ' +
    ' WHERE cl.`course_id` = ? ' +
    ' ORDER BY cl.`order` ASC, cl.`id` ASC; ',

 // 세션 정보를 id 로 조회한다.
  GetSessionById:
    'SELECT * ' +
    '  FROM `course_list` ' +
    ' WHERE `id` = ?; ',

  // 강사정보를 조회한다.
  GetTeacherInfoByCourseId:
    'SELECT t.`id` AS teacher_id, t.name, t.desc ' +
    'FROM `course` AS c ' +
    'LEFT JOIN `teacher` AS t ' +
    'ON c.teacher_id = t.id ' +
    'WHERE c.id= ? ; ',

  // 강사목록을 조회한다.
  GetTeacherList:
    'SELECT t.`id`, t.`name`, t.desc ' +
    '  FROM `teacher` AS t ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = t.`creator_id` ' +
    '   AND t.`active` = 1 ' +
    ' WHERE a.`fc_id` = ?; ',

  // 강사를 생성한다.
  CreateTeacher:
    'INSERT INTO `teacher` (`name`, `desc`, `creator_id`) ' +
    'VALUES(?,?,?); ',

  // 강사를 수정한다.
  UpdateTeacher:
    'UPDATE `teacher` SET ' +
    '       `name` = ? ' +
    '     , `desc` = ? ' +
    ' WHERE `id` = ?; ',

  // 강의를 생성한다.
  CreateCourse:
    'INSERT INTO `course` (`name`, `teacher_id`, `desc`, `creator_id`) ' +
    'VALUES (?,?,?,?); ',

  // 강의를 수정한다.
  UpdateCourse:
    'UPDATE `course` SET `name` = ?, `teacher_id` = ?, `desc` = ?, `creator_id` = ?, `updated_dt` = ? ' +
    'WHERE `id` = ?; ',

  // 강의 세션수를 조회한다.
  GetSessionCount:
    'SELECT COUNT(*) AS session_count FROM `course_list` WHERE `course_id` = ?; ',

  // 비디오를 ID로 조회한다.
  GetVideoDataById:
    'SELECT * FROM `video` WHERE id = ?;',

  // 비디오 ID 로 삭제한다.
  DeleteVideoById:
    'DELETE FROM `video` WHERE `id` = ?; ',

  // 비디오 ID 로 수정한다.
  UpdateVideoById:
    'UPDATE `video` SET `name` = ?, `type` = ?, `url` = ?, `updated_dt` = NOW() ' +
    ' WHERE `id` = ?; ',

  // 특정 세션의 그룹아이디로 퀴즈를 조회한다.
  GetQuizDataByGroupId:
    'SELECT q.`id` AS quiz_id ' +
    '     , q.`type` ' +
    '     , q.`quiz_type` AS quiz_type ' +
    '     , q.`question` ' +
    '     , q.`answer_desc` ' +
    '     , q.`answer_desc` ' +
    '     , qg.`order` AS quiz_order ' +
    '     , q.`option_id` AS `option_group_id` ' +
    '     , qo.`id` AS `option_id` ' +
    '     , qo.`option` ' +
    '     , qo.`order` AS option_order ' +
    '     , qo.`iscorrect`  ' +
    '  FROM `quiz_group` AS qg ' +
    ' INNER JOIN `quiz` AS q ' +
    '    ON qg.`quiz_id` = q.`id` ' +
    '  LEFT JOIN `quiz_option` AS qo ' +
    '    ON qo.`opt_id` = q.`option_id` ' +
    ' WHERE qg.`group_id` = ? ' +
    ' ORDER BY qg.`order`, qo.`order`; ',

  // 특정 세션의 그룹아이디로 퀴즈를 조회한다.(deprecated)
  GetQuizDataByGroupId_bak:
    'SELECT ' +
    'q.id, q.type, q.question, q.answer, q.answer_desc, qo.option, qo.order, qo.id AS option_id ' +
    'FROM `quiz` AS q ' +
    'LEFT JOIN `quiz_option` AS qo ' +
    'ON qo.opt_id = q.option_id ' +
    'WHERE q.id IN ( ' +
        'SELECT quiz_id FROM `quiz_group` ' +
        'WHERE group_id= ? ' +
        'ORDER BY `order` DESC, id ASC ' +
    ')' +
    'ORDER BY `order` DESC, qo.`id`; ',

  // 비디오를 생성한다.
  CreateVideo:
    'INSERT INTO `video` (`name`, `type`, `url`, `creator_id`) ' +
    'VALUES (?,?,?,?); ',

    // 비디오 세션을 생성한다.
  InsertIntoCourseListForVideo:
    'INSERT INTO `course_list` (`course_id`, `type`, `title`, `video_id`) ' +
    'VALUES (?,?,?,?); ',

    // 퀴즈/파이널테스트 세션을 생생헌다.
  InsertIntoCourseListForQuiz:
    'INSERT IGNORE `course_list` (`course_id`, `type`, `title`, `quiz_group_id`, `order`) ' +
    'VALUES (?,?,?,?,?); ',

  // 체크리스트 세션을 생성한다.
  InsertCourseListForChecklist:
    'INSERT IGNORE `course_list` (`course_id`, `type`, `title`, `checklist_group_id`, `order`) ' +
    'SELECT ?,?,?,?,(SELECT IFNULL(MAX(`order`), 0) + 1 FROM `course_list` WHERE `course_id` = ?) ',

  // 특정 세션의 아이디로 체크리스트를 조회한다.
  GetChecklistByCourseListId:
    'SELECT c.`id` AS checklist_id ' +
    '     , c.`item_type` ' +
    '     , c.`item_name` ' +
    '     , c.`item_section` ' +
    '     , c.`sample` ' +
    '     , cg.`order` AS checklist_order ' +
    '     , cl.`title` ' +
    '  FROM `course_list` AS cl ' +
    ' INNER JOIN `checklist_group` AS cg ' +
    '    ON cl.`checklist_group_id` = cg.`group_id` ' +
    ' INNER JOIN `checklist` AS c ' +
    '    ON cg.`checklist_id` = c.`id` ' +
    ' WHERE cl.`id` = ?; ',

  // 특정 세션의 그룹아이디로 체크리스트를 조회한다.
  GetChecklistByGroupId:
    'SELECT c.`id` AS checklist_id ' +
    '     , c.`item_type` ' +
    '     , c.`item_name` ' +
    '     , c.`item_section` ' +
    '     , c.`sample` ' +
    '     , cg.`order` AS checklist_order ' +
    '  FROM `checklist_group` AS cg ' +
    ' INNER JOIN `checklist` AS c ' +
    '    ON cg.`checklist_id` = c.`id` ' +
    ' WHERE cg.`group_id` = ? ' +
    ' ORDER BY cg.`order`; ',

  // 퀴즈 그룹을 생생헌다.
  // `group_id`, `quiz_id` 가 중복일 경우 순서만 변경할 수 있다.
  InsertOrUpdateQuizGroup:
    'INSERT INTO `quiz_group` (`group_id`, `quiz_id`, `order`) ' +
    'VALUES (?,?,?) ' +
    '    ON DUPLICATE KEY UPDATE `order` = ?; ',

  // 체크리스트 그룹을 생생헌다.
  // `group_id`, `checklist_id` 가 중복일 경우 순서만 변경할 수 있다.
  InsertOrUpdateChecklistGroup:
    'INSERT INTO `checklist_group` (`group_id`, `checklist_id`, `order`) ' +
    'VALUES (?,?,?) ' +
    '    ON DUPLICATE KEY UPDATE `order` = ?; ',

  // 체크리스트 입력
  InsertChecklist:
    'INSERT INTO `checklist` (`item_name`, `item_type`, `item_section`, `sample`) ' +
    'VALUES (?,?,?,?); ',

  // 체크리스트 수정
  UpdateChecklist:
    'UPDATE `checklist` SET ' +
    '       `item_name` = ? ' +
    '     , `item_type` = ? ' +
    '     , `item_section` = ? ' +
    '     , `sample` = ? ' +
    '     , `updated_dt` = NOW() ' +
    ' WHERE `id` = ?; ',

  // 퀴즈(단합형) 를 생성한다.
  CreateQuizNoOption:
    'INSERT INTO `quiz` (`type`, `quiz_type`, `question`, `answer_desc`) ' +
    'VALUES (?,?,?,?); ',

  // 퀴즈(선택형, 다답형)를 수정한다.
  UpdateQuizWithNoOption:
    'UPDATE `quiz` SET `question` = ?, `answer_desc` = ?, updated_dt = NOW() WHERE `id` = ?; ',

  // 퀴즈(선택형, 다답형)를 생성한다.
  CreateQuizWithOption:
    'INSERT INTO `quiz` (`type`, `quiz_type`, `question`, `option_id`) ' +
    'VALUES (?,?,?,?); ',

  // 퀴즈(선택형, 다답형)를 수정한다.
  UpdateQuizWithOption:
    'UPDATE `quiz` SET `question` = ?, `updated_dt` = NOW() WHERE `id` = ?; ',

  // 퀴즈(선택형, 다답형)의 보기를 생성한다.
  CreateQuizOption:
    'INSERT INTO `quiz_option` SET ? ',

  UpdateQuizOption:
    'UPDATE `quiz_option` SET `option` = ?, `iscorrect` = ?, `order` = ?, `updated_dt` = NOW() WHERE `id` = ?; ',

  // 퀴즈(선택형, 다답형)의 보기를 일괄 생성한다.
  CreateQuizMultipleOption:
    'INSERT INTO `quiz_option` (`opt_id`, `option`, `iscorrect`, `order`) ' +
    ' VALUES ?; ',

  // 세션정보(course_list) 삭제
  DeleteCourseListId:
    'DELETE FROM `course_list` WHERE `id` = ?; ',

 // 퀴즈 보기(quiz_option) 삭제
  DeleteQuizOptionByGroupId:
    'DELETE qo FROM `quiz_option` AS qo ' +
    ' WHERE EXISTS ( ' +
    '           SELECT \'X\' ' +
    '             FROM `quiz` AS q ' +
    '            WHERE EXISTS ( ' +
    '              SELECT \'X\' ' +
    '                FROM `quiz_group` ' +
    '               WHERE `group_id` = ? ' +
    '                 AND `quiz_id` = q.`id`) ' +
    '                 AND qo.`opt_id` = q.`option_id`); ',

    // 퀴즈 보기(quiz_option) option_group_id 로 삭제
  DeleteQuizOptionByOptionGroupId:
    'DELETE qo FROM `quiz_option` AS qo ' +
    ' WHERE qo.`opt_id` = ?; ',

  // 퀴즈 보기(quiz_option) id로 삭제
  DeleteQuizOptionById:
    'DELETE qo FROM `quiz_option` AS qo ' +
    ' WHERE qo.`id` = ?; ',

  // 퀴즈(quiz) 를 삭제한다.
  DeleteQuizByGroupId:
    'DELETE q ' +
    '  FROM `quiz` AS q ' +
    ' WHERE EXISTS ( ' +
    '           SELECT \'X\' ' +
    '             FROM `quiz_group` ' +
    '            WHERE `group_id` = ? ' +
    '              AND `quiz_id` = q.`id`) ',

  // 퀴즈(quiz) id로 삭제한다.
  DeleteQuizById:
    'DELETE q ' +
    '  FROM `quiz` AS q ' +
    ' WHERE q.`id` = ?; ',

  // 퀴즈 보기 그룹(quiz_group) 삭제 (deprecated)
  // 퀴즈가 삭제 시 CASCADE 제약으로 함께 삭제된다.
  DeleteQuizGroupByGroupId:
    'DELETE qg ' +
    '  FROM `quiz_group` AS qg ' +
    ' WHERE qg.`group_id` = ?; ',

  // 세션을 수정한다.
  UpdateSession:
    'UPDATE `course_list` SET ' +
    '       `title` = ? ' +
    '     , `order` = ? ' +
    '     , `updated_dt` = NOW() ' +
    ' WHERE `id` = ?; ',

  // 세션 제목을 수정한다.
  UpdateSessionTitleById:
    'UPDATE `course_list` SET ' +
    '       `title` = ? ' +
    '     , `updated_dt` = NOW() ' +
    ' WHERE `id` = ?; ',

  // 강의를 비활성화 한다.
  DisableCourseById:
    'UPDATE `course` SET `active` = 0 WHERE `id` = ?; ',

  // 강의를 비활성화 한다.
  DisableTeacherById:
    'UPDATE `teacher` SET `active` = 0 WHERE `id` = ?; ',

  // 체크리스트 그룹을 삭제한다.
  DeleteChecklistGroup:
    'DELETE cg ' +
    '  FROM `checklist_group` AS cg ' +
    ' WHERE cg.`group_id` = ? ' +
    '   AND cg.`checklist_id` = ?; ',

  // 체크리스트를 삭제한다.
  DeleteChecklist:
    'DELETE c ' +
    '  FROM `checklist` AS c ' +
    ' WHERE c.`id` = ?; ',

  // 퀴즈(quiz) 를 삭제한다.
  DeleteChecklistByGroupId:
    'DELETE c ' +
    '  FROM `checklist` AS c ' +
    ' WHERE EXISTS ( ' +
    '        SELECT \'X\' ' +
    '          FROM `checklist_group` ' +
    '         WHERE `group_id` = ? ' +
    '           AND `checklist_id` = c.`id` ' +
    '       ) '
};

QUERY.EDU = {

  // 교육과정 리스트를 조회한다.
  // offset, limit이 한동안 없이 진행한다.
  GetList:
    'SELECT e.`id` AS education_id ' +
    '     , e.`name` ' +
    '     , e.desc ' +
    '     , e.`created_dt` ' +
    '     , e.`start_dt` ' +
    '     , e.`end_dt` ' +
    '     , a.`name` AS creator ' +
    '     , e.`course_group_id` ' +
    '  FROM `edu` AS e ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON e.`creator_id` = a.`id` ' +
    ' WHERE e.`active` = 1 ' +
    '   AND a.`fc_id` = ? ' +
    ' ORDER BY e.`created_dt` DESC, e.`id` DESC; ',

    // 교육과정 정보를 조회한다.
  GetEduInfoById:
    'SELECT e.`id` ' +
    '     , e.`name` ' +
    '     , e.desc ' +
    '     , e.`start_dt` ' +
    '     , e.`end_dt` ' +
    '     , e.`course_group_id` AS course_group_key ' +
    '  FROM `edu` AS e ' +
    ' WHERE e.`id` = ?; ',

    // 교육과정의 강의를 조회한다.
  GetCourseListByGroupId:
    'SELECT c.`id` AS course_id ' +
    '     , c.`name` AS course_name ' +
    '     , c.desc AS course_desc ' +
    '     , t.`name` AS teacher_name ' +
    '     , cg.`id` AS course_group_id ' +
    '     , cg.`group_id` AS course_group_key ' +
    '  FROM `course_group` AS cg ' +
    ' INNER JOIN `course` AS c ' +
    '    ON cg.`course_id` = c.`id` ' +
    '   AND c.`active` = 1 ' +
    '  LEFT JOIN `teacher` AS t ' +
    '    ON c.`teacher_id` = t.`id` ' +
    ' WHERE `group_id` = ? ' +
    ' ORDER BY cg.`order` ASC, cg.`id` ASC ',

  // 교육과정의 강의를 조회한다. (deprecated)
  GetCourseListByGroupId_bak:
    'SELECT c.`id`, c.`name` AS name, c.`desc`, t.`name` AS teacher ' +
    '  FROM `course` AS c ' +
    '  LEFT JOIN `teacher` AS t ' +
    '    ON c.teacher_id = t.id ' +
    ' WHERE c.id IN ( ' +
    '   SELECT course_id FROM `course_group` ' +
    '    WHERE group_id= ? ' +
    '    ORDER BY `order` DESC, `id` ASC ' +
    '   )' +
    '   AND c.`active`=true; ',

  // 해당 FC의 전체 강의리스트를 조회한다.
  GetCourseList:
    'SELECT c.`id` AS course_id ' +
    '     , c.`name` AS course_name ' +
    '     , t.`name` AS teacher_name ' +
    '     , c.`active` ' +
    '  FROM `course` AS c ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = c.`creator_id` ' +
    '  LEFT JOIN `teacher` AS t ' +
    '    ON t.`id` = c.`teacher_id` ' +
    ' WHERE a.`fc_id` = ? ' +
    '   AND c.`active` = 1 ' +
    ' ORDER BY c.`name` ASC; ',

  // 교육과정을 생성한다.
  InsertEdu:
    'INSERT INTO `edu` (`name`, `desc`, `course_group_id`, `creator_id`) ' +
    'VALUES(?,?,?,?); ',
  // InsertEdu:
  //   'INSERT INTO `edu` (`name`, `desc`, `course_group_id`, `creator_id`, `start_dt`, `end_dt`) ' +
  //   'VALUES(?,?,?,?,?,?); ',

  // 교육과정을 수정한다.
  UpdateEdu:
    'UPDATE `edu` SET ' +
    '       `name` = ? ' +
    '     , `desc` = ? ' +
    '     , `updated_dt` = NOW() ' +
    '     , `start_dt` = ? ' +
    '     , `end_dt` = ? ' +
    ' WHERE `id` = ?; ',

    // 강의그룹을 생성한다.
  InsertCourseGroup:
    'INSERT INTO `course_group` (`group_id`, `course_id`, `order`) ' +
    'VALUES(?,?,?); ',

  // 강의그룹 순서를 변경한다.
  UpdateCourseGroup:
    'UPDATE `course_group` SET `order` = ? WHERE `id` = ?; ',

  // 강의그룹을 삭제한다.
  DeleteCourseGroup:
    'DELETE FROM `course_group` WHERE `id` = ?; ',

  // 휴대폰번호를 통해 사용자 정보를 조회한다.
  GetUserDataByPhone:
    'SELECT `id`, `phone` ' +
    '  FROM `users` ' +
    ' WHERE `phone` IN (?); ',

  // 이메일을 통해 사용자 정보를 조회한다.
  GetUserDataByEmail:
    'SELECT `id`, `email` ' +
    '  FROM `users` ' +
    ' WHERE `email` IN (?); ',

  InsertIntoLogGroupUser:
    'INSERT INTO `log_group_user` (`user_id`, `group_id`) ' +
    'VALUES(?,?); ',

  InsertIntoLogBindUser:
    'INSERT INTO `log_bind_users` (`title`,`desc`,`creator_id`, `group_id`) ' +
    'VALUES(?,?,?,?); ',

  GetCustomUserList:
    'SELECT lbu.`id`, lbu.`title`, lbu.`desc`, a.`name` AS creator, lbu.`created_dt`, lbu.`group_id` ' +
    '  FROM `log_bind_users` AS lbu ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = lbu.`creator_id` ' +
    ' WHERE a.`fc_id` = ? ' +
    '   AND lbu.`active` = 1 ' +
    ' ORDER BY lbu.`created_dt` DESC, lbu.`id` DESC; ',

  GetAssignmentDataById:
    'SELECT lbu.`id`, lbu.`title`, lbu.`desc`, lbu.`group_id`, lbu.`created_dt`, a.`name` AS creator ' +
    '  FROM `log_bind_users` AS lbu ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = lbu.`creator_id` ' +
    ' WHERE lbu.`id` = ?; ',

  GetUserListByGroupId:
    'SELECT u.`id`, u.`name`, u.`email`, u.`phone`, b.`name` AS branch, d.`name` AS duty ' +
    '  FROM `users` AS u ' +
    '  LEFT JOIN `branch` AS b ' +
    '    ON b.`id` = u.`branch_id` ' +
    '  LEFT JOIN `duty` AS d ' +
    '    ON d.`id` = u.`duty_id` ' +
    ' WHERE u.`id` IN ' +
    '       ( ' +
    '        SELECT `user_id` FROM `log_group_user` ' +
    '         WHERE `group_id` = ? ' +
    '         ORDER BY `id` ASC ' +
    '       ); ',

  InsertTrainingEdu:
    'INSERT INTO `training_edu` (`edu_id`, `assigner`) ' +
    'VALUES(?,?); ',

  // training_users 입력
  InsertUserIdInTrainingUsers:
    'INSERT INTO `training_users` (`user_id`, `training_edu_id`) ' +
    'SELECT lgu.`user_id`, ? AS `training_edu_id` ' +
    '  FROM `log_bind_users` AS lbu ' +
    ' INNER JOIN `log_group_user` AS lgu ' +
    '    ON lbu.`group_id` = lgu.`group_id` ' +
    ' WHERE lbu.`id` = ?; ',

  InsertUserIdInTrainingUsers_bak:
    'INSERT INTO `training_users` (`user_id`, `training_edu_id`) ' +
    'VALUES(?,?);',

  // 강의그룹에서 id로 삭제한다.
  DeleteCourseGroupById:
    'DELETE FROM `course_group` ' +
    ' WHERE `id` = ?; ',

  // 교육과정 포인트 설정 조회
  GetRecentPointWeight:
    'SELECT pw.`point_complete` ' +
    '     , pw.`point_quiz` ' +
    '     , pw.`point_final` ' +
    '     , pw.`point_reeltime` ' +
    '     , pw.`point_speed` ' +
    '     , pw.`point_repetition` ' +
    ' FROM `edu_point_weight` AS pw ' +
    ' LEFT JOIN `admin` AS a ' +
    '   ON a.`id` = pw.`setter_id` ' +
    'WHERE a.`fc_id` = ? ' +
    '  AND pw.`edu_id` = ? ' +
    'ORDER BY pw.`created_dt` DESC ' +
    'LIMIT 1; ',

    // 교육과정 포인트 설정값 입력
  SetPointWeight:
    'INSERT INTO `edu_point_weight` (`point_complete`,`point_quiz`, `point_final`, `point_reeltime`, `point_speed`, `point_repetition`, `setter_id`, `edu_id`, `fc_id`) ' +
    'VALUES (?,?,?,?,?,?,?,?,?); ',

  // 교육과정을 비활성화 한다.
  DisableEduById:
    'UPDATE `edu` SET `active` = 0 WHERE `id` = ?; '
};

QUERY.HISTORY = {
  GetAssignHistory:
    'SELECT te.`id`, e.`name`, te.`created_dt`, e.`start_dt`, e.`end_dt`, a.`name` AS admin ' +
    '  FROM `training_edu` AS te ' +
    '  LEFT JOIN `edu` AS e ' +
    '    ON e.`id` = te.`edu_id` ' +
    '  LEFT JOIN `admin` AS a ' +
    '    ON a.`id` = te.`assigner` ' +
    ' WHERE a.`fc_id` = ? ' +
    ' ORDER BY te.`created_dt` DESC;',

  InsertIntoLogAssignEdu:
    'INSERT INTO `log_assign_edu` (`training_edu_id`, `target_users_id`, `creator_id`, `start_dt`, `end_dt`) ' +
    'VALUES(?,?,?,?,?); ',

  // 교육과정 배정 정보
  GetAssignEduHistory: (showAll) => {
    let sql =
      'SELECT e.`id` AS edu_id, te.`id`, e.`name`, te.`created_dt` ' +
      '     , lae.`start_dt` ' +
      '     , lae.`end_dt` ' +
      '     , e.`course_group_id` ' +
      '     , a.`name` AS admin, lbu.`title` AS target ' +
      '     , lbu.`id` AS logBindUserId, lbu.`group_id` AS logBindUserGroupId ' +
      '  FROM `training_edu` AS te ' +
      ' INNER JOIN `admin` AS a ' +
      '    ON a.`id` = te.`assigner` ' +
      '   and a.`fc_id` = ? ' +
      '  LEFT JOIN `edu` AS e ' +
      '    ON e.`id` = te.`edu_id` ' +
      '  LEFT JOIN `log_assign_edu` AS lae ' +
      '    ON lae.`training_edu_id` = te.`id` ' +
      '  LEFT JOIN `log_bind_users` AS lbu ' +
      '    ON lbu.`id` = lae.`target_users_id` ' +
      ' WHERE te.`active` = 1 ';

    if (!showAll) {
      sql +=
        ' AND te.`id` IN ( ' +
        '    SELECT DISTINCT training_edu_id ' +
        '      FROM `training_users` AS tu  ' +
        '     INNER JOIN `users` AS u ' +
        '        ON tu.`user_id` = u.`id` ' +
        '     INNER JOIN `admin_branch` AS ab ' +
        '        ON u.`branch_id` = ab.`branch_id` ' +
        '       AND ab.`admin_id` = ?) ';
    }
    sql += ' ORDER BY te.`created_dt` DESC; ';
    return sql;
  },

  // 진척도관리(슈퍼바이저) - deprecated
  GetAssignEduHistory2:
    'SELECT e.id AS edu_id, te.id, e.name, te.created_dt, e.start_dt, e.end_dt, a.name AS admin, lbu.title AS target ' +
    '  FROM `training_edu` AS te ' +
    ' INNER JOIN `admin` AS a ' +
    '    ON a.`id` = te.`assigner` ' +
    '   AND a.`fc_id` = ? ' +
    '  LEFT JOIN `edu` AS e ' +
    '    ON e.`id` = te.`edu_id` ' +
    '  LEFT JOIN `log_assign_edu` AS lae ' +
    '    ON lae.`training_edu_id` = te.`id` ' +
    '  LEFT JOIN `log_bind_users` AS lbu ' +
    '    ON lbu.`id` = lae.`target_users_id` ' +
    ' WHERE te.`id` IN ( ' +
    '    SELECT DISTINCT training_edu_id ' +
    '      FROM `training_users` AS tu  ' +
    '     INNER JOIN `users` AS u ' +
    '        ON tu.`user_id` = u.`id` ' +
    '     INNER JOIN `admin_branch` AS ab ' +
    '        ON u.`branch_id` = ab.`branch_id` ' +
    '       AND ab.`admin_id` = ?) ' +
    'ORDER BY te.created_dt DESC; ',

  // 진척도관리
  GetAssignEduHistoryById:
    'SELECT e.`id` AS edu_id, te.`id`, e.`name`, te.`created_dt` ' +
    '     , lae.`start_dt` ' +
    '     , lae.`end_dt` ' +
    '     , e.`course_group_id` ' +
    // '     , e.`start_dt` ' +
    // '     , e.`end_dt` ' +
    '     , a.`name` AS admin, lbu.`title` AS target ' +
    '     , lae.`id` AS logAssignEduId ' +
    '  FROM `training_edu` AS te ' +
    ' INNER JOIN `admin` AS a ' +
    '    ON a.`id` = te.`assigner` ' +
    '   and a.`fc_id` = ? ' +
    '  LEFT JOIN `edu` AS e ' +
    '    ON e.`id` = te.`edu_id` ' +
    ' INNER JOIN `log_assign_edu` AS lae ' +
    '    ON lae.`training_edu_id` = te.`id` ' +
    '   AND lae.`active` = 1 ' +
    ' INNER JOIN `log_bind_users` AS lbu ' +
    '    ON lbu.`id` = lae.`target_users_id` ' +
    '   AND lbu.`id` = ? ' +
    ' ORDER BY te.`created_dt` DESC; '
};

QUERY.ACHIEVEMENT = {
  GetTotalSessByEdu: // edu아이디를 통해서 강의별 총 세션수를 가져온다.
    'SELECT `course_id`, count(*) AS sess_total FROM `course_list` ' +
    ' WHERE `course_id` IN ' +
    '       ( ' +
    '        SELECT c.`id` ' +
    '          FROM `course` AS c ' +
    '         WHERE c.`id` IN ( ' +
    '               ( ' +
    '                SELECT `course_id` FROM `course_group` ' +
    '                 WHERE group_id = (SELECT `course_group_id` FROM `edu` WHERE id= ?) ' + // edu_id를 바인딩할 것.(ex 22)
    '                 ORDER BY `order` DESC, `id` ASC ' +
    '               ) ' +
    '           AND c.`active` = true ' +
    '       ) ' +
    'GROUP BY `course_id`; ',

  GetListWithCompletedSessByTrainingEduId_old: // deprecated
    'SELECT tu.`user_id`, if(sess.`completed_sess` IS NULL, 0, sess.`completed_sess`) AS completed_sess, u.`name`, d.`name` AS duty, b.`name` AS branch ' +
    '  FROM `training_users` AS tu ' +
    '  LEFT JOIN ( ' +
    '             SELECT `user_id`, count(*) AS completed_sess FROM `log_session_progress` ' +
    '              WHERE `user_id` IN (\'1\', \'2\') AND `course_id` IN (\'7\', \'8\') AND `training_user_id` IN (\'25\', \'26\') ' +
    '              GROUP BY `user_id` ' +
    '            ) AS sess ' +
    '    ON tu.`user_id` = sess.`user_id` ' +
    '  LEFT JOIN `users` AS u ' +
    '    ON tu.`user_id` = u.`id` ' +
    '  LEFT JOIN `branch` AS b ' +
    '    ON u.`branch_id` = b.`id` ' +
    '  LEFT JOIN `duty` AS d ' +
    '    ON d.`id` = u.`duty_id` ' +
    ' WHERE tu.`training_edu_id` = 15 ' + // training_edu_id는 테이블에서 넘겨 받도록 한다
    ' ORDER BY `completed_sess` DESC; ',

  GetListWithCompletedSessByTrainingEduId:
    'SELECT tu.`user_id`, if(sess.`completed_sess` IS NULL, 0, sess.`completed_sess`) AS completed_sess, u.`name`, d.`name` AS duty, b.`name` AS branch ' +
    '  FROM `training_users` AS tu ' +
    '  LEFT JOIN ( ' +
    '             SELECT `user_id`, count(*) AS completed_sess FROM `log_session_progress` ' +
    '              WHERE `course_id` IN (?) ' +
    '              GROUP BY `user_id` ' +
    '            ) AS sess ' +
    '    ON tu.`user_id` = sess.`user_id` ' +
    '  LEFT JOIN `users` AS u ' +
    'ON tu.user_id = u.id ' +
    'LEFT JOIN `branch` AS b ' +
    'ON u.branch_id = b.id ' +
    'LEFT JOIN `duty` AS d ' +
    'ON d.id = u.duty_id ' +
    'WHERE tu.training_edu_id= ? ' + // training_edu_id는 테이블에서 넘겨 받도록 한다
    'ORDER BY `completed_sess` DESC;',

  GetCompletionByBranch:
    'SELECT b.name AS branch, if( sum(sess.completed_sess) IS NULL, 0, sum(sess.completed_sess)) AS sess_sum, count(*) AS user_count ' +
    'FROM `training_users` AS tu ' +
    'LEFT JOIN ' +
    '( ' +
      'SELECT user_id, count(*) AS completed_sess ' +
      'FROM `log_session_progress` AS lsp ' +
      'WHERE course_id IN (?) ' +
      'GROUP BY `user_id` ' +
    ') AS sess ' +
    'ON tu.user_id = sess.user_id ' +
    'LEFT JOIN `users` AS u ' +
    'ON u.id = tu.user_id ' +
    'LEFT JOIN `branch` AS b ' +
    'ON b.id = u.branch_id ' +
    'WHERE tu.training_edu_id= ? ' +
    'GROUP BY branch ' +
    'ORDER BY `completed_sess` DESC;',

  GetEduInfoById:
    'SELECT `name` FROM `edu` ' +
    'WHERE `id` = ?;',

    // 지점별 이수율
  GetBranchProgress:
    'SELECT g.`branch_id` ' +
    '     , MAX(b.`name`) AS branch_name ' +
    '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '    SELECT @training_user_id:= tu.`id` AS training_user_id ' +
    '       , @course_id:= e.`course_id` AS course_id ' +
    '       , ( ' +
    '        SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '          FROM `course_list` AS cl ' +
    '          LEFT JOIN `log_session_progress` AS up ' +
    '          ON cl.id = up.`course_list_id` ' +
    '           AND up.`training_user_id` = @training_user_id ' +
    '           AND up.`end_dt` IS NOT NULL ' +
    '         WHERE cl.`course_id` = @course_id ' +
    '        ) AS completed_rate ' +
    '       , u.`branch_id` ' +
    '      FROM `training_users` AS tu ' +
    '     INNER JOIN `users` AS u ' +
    '      ON tu.`user_id` = u.`id` ' +
    '          AND u.`fc_id` = ? ' +
    '          AND u.`active` = 1 ' +
    '     INNER JOIN `admin_branch` AS ab ' +
    '      ON u.`branch_id` = ab.`branch_id` ' +
    '       AND ab.`admin_id` = ? ' +
    '     INNER JOIN `training_edu` AS te ' +
    '      ON tu.`training_edu_id` = te.`id` ' +
    '       AND te.`edu_id` = ? ' +
    '     INNER JOIN ' +
    '         ( ' +
    '        SELECT e.`id` AS edu_id, cg.`course_id` ' +
    '          FROM `edu` AS e ' +
    '         INNER JOIN `course_group` AS cg ' +
    '          ON e.`course_group_id` = cg.`group_id` ' +
    '         WHERE e.`id` = ? ' +
    '         ) AS e ' +
    '      ON te.`edu_id` = e.`edu_id` ' +
    '    ) AS g ' +
    ' INNER JOIN `branch` AS b ' +
    '   ON g.`branch_id` = b.`id` ' +
    ' GROUP BY g.`branch_id` ' +
    ' ORDER BY `completed_rate` DESC; ',

  // 교육생별 이수율
  GetUserProgress:
    'SELECT MAX(g.`user_name`) AS user_name ' +
    '     , MAX(b.`name`) AS branch_name ' +
    '     , MAX(d.`name`) AS duty_name ' +
    '     , ( ' +
    '        SELECT (`complete` * ?) + ' +
    '               (`quiz_correction` * ?) + ' +
    '               (`final_correction` * ?) + ' +
    '               (`reeltime` * ?) + ' +
    '               (`speed` * ?) + ' +
    '               (`repetition` * ?) ' +
    '          FROM `log_user_point` ' +
    '         WHERE `training_user_id` = g.`training_user_id` ' +
    '       ) AS point ' +
    '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '    SELECT tu.`user_id` ' +
    '         , u.`name` AS user_name ' +
    '         , @training_user_id:= tu.`id` AS training_user_id ' +
    '         , @course_id:= e.`course_id` AS course_id ' +
    '         , ( ' +
    '            SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '              FROM `course_list` AS cl ' +
    '              LEFT JOIN `log_session_progress` AS up ' +
    '                ON cl.id = up.`course_list_id` ' +
    '               AND up.`training_user_id` = @training_user_id ' +
    '               AND up.`end_dt` IS NOT NULL ' +
    '             WHERE cl.`course_id` = @course_id ' +
    '           ) AS completed_rate ' +
    '         , u.`branch_id` ' +
    '         , u.`duty_id` ' +
    '      FROM `training_users` AS tu ' +
    '     INNER JOIN `users` AS u ' +
    '        ON tu.`user_id` = u.`id` ' +
    '       AND u.`fc_id` = ? ' +
    '       AND u.`active` = 1 ' +
    '     INNER JOIN `admin_branch` AS ab ' +
    '        ON u.`branch_id` = ab.`branch_id` ' +
    '       AND ab.`admin_id` = ? ' +
    '     INNER JOIN `training_edu` AS te ' +
    '        ON tu.`training_edu_id` = te.`id` ' +
    '       AND te.`edu_id` = ? ' +
    '     INNER JOIN  ' +
    '           ( ' +
    '            SELECT e.`id` AS edu_id, cg.`course_id` ' +
    '              FROM `edu` AS e ' +
    '             INNER JOIN `course_group` AS cg ' +
    '                ON e.`course_group_id` = cg.`group_id` ' +
    '             WHERE e.`id` = ? ' +
    '           ) AS e ' +
    '       ON te.`edu_id` = e.`edu_id` ' +
    '    ) AS g ' +
    '  LEFT JOIN `branch` AS b ' +
    '    ON g.`branch_id` = b.`id` ' +
    '  LEFT JOIN `duty` AS d ' +
    '    ON g.`duty_id` = d.`id` ' +
    ' GROUP BY g.`user_id` ' +
    ' ORDER BY `completed_rate` DESC; ',

  // 지점별 이수율 (전체)
  GetBranchProgressAllByEdu: (showAll) => {
    let sql =
      'SELECT g.`branch_id` ' +
      '     , MAX(b.`name`) AS branch_name ' +
      '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
      '  FROM ( ' +
      '    SELECT @training_user_id:= tu.`id` AS training_user_id ' +
      '       , @course_id:= e.`course_id` AS course_id ' +
      '       , ( ' +
      '        SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
      '          FROM `course_list` AS cl ' +
      '          LEFT JOIN `log_session_progress` AS up ' +
      '          ON cl.id = up.`course_list_id` ' +
      '           AND up.`training_user_id` = @training_user_id ' +
      '           AND up.`end_dt` IS NOT NULL ' +
      '         WHERE cl.`course_id` = @course_id ' +
      '        ) AS completed_rate ' +
      '       , u.`branch_id` ' +
      '      FROM `training_users` AS tu ' +
      '     INNER JOIN `users` AS u ' +
      '      ON tu.`user_id` = u.`id` ' +
      '          AND u.`fc_id` = ? ' +
      '          AND u.`active` = 1 ' +
      '     INNER JOIN `training_edu` AS te ' +
      '      ON tu.`training_edu_id` = te.`id` ' +
      '       AND te.`edu_id` = ? ' +
      '     INNER JOIN ' +
      '         ( ' +
      '        SELECT e.`id` AS edu_id, cg.`course_id` ' +
      '          FROM `edu` AS e ' +
      '         INNER JOIN `course_group` AS cg ' +
      '          ON e.`course_group_id` = cg.`group_id` ' +
      '         WHERE e.`id` = ? ' +
      '         ) AS e ' +
      '      ON te.`edu_id` = e.`edu_id` ';
    if (!showAll) {
      sql +=
          '     INNER JOIN `admin_branch` AS ab ' +
          '        ON u.`branch_id` = ab.`branch_id` ' +
          '       AND ab.`admin_id` = ? ';
    }

    sql +=
      '    ) AS g ' +
      ' INNER JOIN `branch` AS b ' +
      '   ON g.`branch_id` = b.`id` ' +
      ' GROUP BY g.`branch_id` ' +
      ' ORDER BY `completed_rate` DESC; ';
    return sql;
  },

    // 교육생별 이수율 (전체)
  GetUserProgressAllByEdu: (showAll) => {
    let sql =
      'SELECT MAX(g.`user_name`) AS user_name ' +
      '     , MAX(b.`name`) AS branch_name ' +
      '     , MAX(d.`name`) AS duty_name ' +
      '     , ( ' +
      '        SELECT (`complete` * ?) + ' +
      '               (`quiz_correction` * ?) + ' +
      '               (`final_correction` * ?) + ' +
      '               (`reeltime` * ?) + ' +
      '               (`speed` * ?) + ' +
      '               (`repetition` * ?) ' +
      '          FROM `log_user_point` ' +
      '         WHERE `training_user_id` = g.`training_user_id` ' +
      '       ) AS point ' +
      '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
      '  FROM ( ' +
      '    SELECT tu.`user_id` ' +
      '       , u.`name` AS user_name ' +
      '       , @training_user_id:= tu.`id` AS training_user_id ' +
      '       , @course_id:= e.`course_id` AS course_id ' +
      '       , ( ' +
      '        SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
      '          FROM `course_list` AS cl ' +
      '          LEFT JOIN `log_session_progress` AS up ' +
      '          ON cl.id = up.`course_list_id` ' +
      '           AND up.`training_user_id` = @training_user_id ' +
      '           AND up.`end_dt` IS NOT NULL ' +
      '         WHERE cl.`course_id` = @course_id ' +
      '        ) AS completed_rate ' +
      '       , u.`branch_id` ' +
      '            , u.`duty_id` ' +
      '      FROM `training_users` AS tu ' +
      '     INNER JOIN `users` AS u ' +
      '      ON tu.`user_id` = u.`id` ' +
      '          AND u.`fc_id` = ? ' +
      '          AND u.`active` = 1 ' +
      '     INNER JOIN `training_edu` AS te ' +
      '      ON tu.`training_edu_id` = te.`id` ' +
      '       AND te.`edu_id` = ? ' +
      '     INNER JOIN  ' +
      '         ( ' +
      '        SELECT e.`id` AS edu_id, cg.`course_id` ' +
      '          FROM `edu` AS e ' +
      '         INNER JOIN `course_group` AS cg ' +
      '          ON e.`course_group_id` = cg.`group_id` ' +
      '         WHERE e.`id` = ? ' +
      '         ) AS e ' +
      '      ON te.`edu_id` = e.`edu_id` ';
    if (!showAll) {
      sql +=
          '     INNER JOIN `admin_branch` AS ab ' +
          '        ON u.`branch_id` = ab.`branch_id` ' +
          '       AND ab.`admin_id` = ? ';
    }
    sql +=
      '    ) AS g ' +
      '  LEFT JOIN `branch` AS b ' +
      '    ON g.`branch_id` = b.`id` ' +
      '  LEFT JOIN `duty` AS d ' +
      '    ON g.`duty_id` = d.`id` ' +
      ' GROUP BY g.`user_id` ' +
      ' ORDER BY `completed_rate` DESC; ';

    return sql;
  },

  // 교육생별 전체(전 교육과정에 대한) 이수율
  GetUserProgressAll:
    'SELECT x.`user_name` ' +
    '     , x.`branch_name` ' +
    '     , x.`duty_name` ' +
    '     , x.`edu_id` ' +
    '     , x.`user_id` ' +
    '     , x.`training_user_id` ' +
    '     , IFNULL(TRUNCATE(AVG(( ' +
    '        SELECT SUM((`complete` * epg.`point_complete`) + ' +
    '               (`quiz_correction` * epg.`point_quiz`) + ' +
    '               (`final_correction` * epg.`point_final`) + ' +
    '               (`reeltime` * epg.`point_reeltime`) + ' +
    '               (`speed` * epg.`point_speed`) + ' +
    '               (`repetition` * epg.`point_repetition`)) ' +
    '          FROM `log_user_point` ' +
    '         WHERE `training_user_id` = x.`training_user_id` ' +
    '       )), 2), 0) AS point ' +
    '     , IFNULL(TRUNCATE(AVG(x.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '        SELECT MAX(g.`user_name`) AS user_name ' +
    '             , MAX(b.`name`) AS branch_name ' +
    '             , MAX(d.`name`) AS duty_name ' +
    '             , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
    '             , MAX(g.`edu_id`) AS edu_id ' +
    '             , MAX(g.`user_id`) AS user_id ' +
    '             , g.`training_user_id` ' +
    '          FROM ( ' +
    '                SELECT tu.`user_id` ' +
    '                     , u.`name` AS user_name ' +
    '                     , @training_user_id:= tu.`id` AS training_user_id ' +
    '                     , @course_id:= e.`course_id` AS course_id ' +
    '                     , ( ' +
    '                        SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '                          FROM `course_list` AS cl ' +
    '                          LEFT JOIN `log_session_progress` AS up ' +
    '                            ON cl.id = up.`course_list_id` ' +
    '                           AND up.`training_user_id` = @training_user_id ' +
    '                           AND up.`end_dt` IS NOT NULL ' +
    '                         WHERE cl.`course_id` = @course_id ' +
    '                       ) AS completed_rate ' +
    '                     , u.`branch_id` ' +
    '                     , u.`duty_id` ' +
    '                     , te.`edu_id` ' +
    '                  FROM `training_users` AS tu ' +
    '                 INNER JOIN `users` AS u ' +
    '                    ON tu.`user_id` = u.`id` ' +
    '                   AND u.`fc_id` = ? ' +
    '                   AND u.`active` = 1 ' +
    // SUPERVISOR 별 점포에 대한 처리
    '                  LEFT JOIN `admin_branch` AS ab ' +
    '                    ON u.`branch_id` = ab.`branch_id` ' +
    '                   AND ab.`admin_id` = ? ' +
    '                 INNER JOIN `training_edu` AS te ' +
    '                    ON tu.`training_edu_id` = te.`id` ' +
    '                 INNER JOIN  ' +
    '                       ( ' +
    '                        SELECT e.`id` AS edu_id, cg.`course_id` ' +
    '                          FROM `edu` AS e ' +
    '                         INNER JOIN `course_group` AS cg ' +
    '                            ON e.`course_group_id` = cg.`group_id` ' +
    '                       ) AS e ' +
    '                    ON te.`edu_id` = e.`edu_id` ' +
    '               ) AS g ' +
    '           LEFT JOIN `branch` AS b ' +
    '             ON g.`branch_id` = b.`id` ' +
    '           LEFT JOIN `duty` AS d ' +
    '             ON g.`duty_id` = d.`id` ' +
    '          GROUP BY g.`training_user_id` ' +
    '       ) AS x ' +
    '  LEFT JOIN ' +
    '       ( ' +
    '        SELECT pw.`point_complete` ' +
    '             , pw.`point_quiz` ' +
    '             , pw.`point_final` ' +
    '             , pw.`point_reeltime` ' +
    '             , pw.`point_speed` ' +
    '             , pw.`point_repetition` ' +
    '             , pw.`edu_id` ' +
    '          FROM (SELECT `fc_id`, `edu_id`, MAX(`id`) AS `id` FROM `edu_point_weight` WHERE `fc_id` = ? GROUP BY `fc_id`, `edu_id`) AS pwg ' +
    '         INNER JOIN `edu_point_weight` AS pw ' +
    '            ON pwg.`fc_id` = pw.`fc_id` ' +
    '           AND pwg.`id` = pw.`id` ' +
    '       ) AS epg ' +
    '    ON x.`edu_id` = epg.`edu_id` ' +
    ' GROUP BY x.`user_id` ' +
    ' ORDER BY `completed_rate` DESC; ',

  // 교육생별 전체(전 교육과정에 대한) 이수율
  GetUserEduProgressAll: (showall) => {
    let sql =
    'SELECT x.`training_user_id` ' +
    '     , MAX(x.`edu_name`) AS edu_name ' +
    '     , MAX(x.`assign_start_dt`) AS assign_start_dt ' +
    '     , MAX(x.`assign_end_dt`) AS assign_end_dt ' +
    '     , MAX(x.`study_start_dt`) AS study_start_dt ' +
    '     , MAX(x.`study_end_dt`) AS study_end_dt ' +
    '     , IFNULL(TRUNCATE(AVG(x.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '        SELECT tu.`user_id` ' +
    '           , u.`name` AS user_name ' +
    '           , e.`edu_name` ' +
    '           , e.`course_name` ' +
    '           , @training_user_id:= tu.`id` AS training_user_id ' +
    '           , @course_id:= e.`course_id` AS course_id ' +
    '           , e.`course_order` ' +
    '           , ( ' +
    '             SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '               FROM `course_list` AS cl ' +
    '               LEFT JOIN `log_session_progress` AS up ' +
    '                ON cl.id = up.`course_list_id` ' +
    '                AND up.`training_user_id` = @training_user_id ' +
    '                AND up.`end_dt` IS NOT NULL ' +
    '              WHERE cl.`course_id` = @course_id ' +
    '             ) AS completed_rate ' +
    '           , u.`branch_id` ' +
    '           , u.`duty_id` ' +
    '           , te.`edu_id` ' +
    '           , lae.`start_dt` AS assign_start_dt ' +
    '           , lae.`end_dt` AS assign_end_dt ' +
    '           , tu.`start_dt` AS study_start_dt ' +
    '           , tu.`end_dt` AS study_end_dt ' +
    '           , lcp.`start_dt` AS course_start_dt ' +
    '           , lcp.`end_dt` AS course_end_dt ' +
    '        FROM `training_users` AS tu ' +
    '       INNER JOIN `users` AS u ' +
    '         ON tu.`user_id` = u.`id` ' +
    '         AND u.`fc_id` = ? ' +
    '         AND u.`active` = 1 ' +
    '       INNER JOIN `training_edu` AS te ' +
    '         ON tu.`training_edu_id` = te.`id` ' +
    '       INNER JOIN `log_assign_edu` AS lae ' +
    '         ON lae.`training_edu_id` = te.`id` ';
    if (!showall) {
      sql += '         AND DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(lae.`start_dt`, \'%Y-%m\') AND DATE_FORMAT(lae.`end_dt`,\'%Y-%m\') ';
    }

    sql +=
    '       INNER JOIN ' +
    '            ( ' +
    '            SELECT e.`id` AS edu_id ' +
    '                , cg.`course_id` ' +
    '                , e.`name` AS edu_name ' +
    '                , c.`name` AS course_name ' +
    '                , cg.`order` AS course_order ' +
    '              FROM `edu` AS e ' +
    '             INNER JOIN `course_group` AS cg ' +
    '               ON e.`course_group_id` = cg.`group_id` ' +
    '             INNER JOIN `course` AS c ' +
    '               ON cg.`course_id` = c.`id` ' +
    '            ) AS e ' +
    '         ON te.`edu_id` = e.`edu_id` ' +
    '         AND tu.`user_id` = ? ' +
    '        LEFT JOIN `log_course_progress` AS lcp ' +
    '         ON tu.`id` = lcp.`training_user_id` ' +
    '         AND lcp.`course_id` = e.`course_id` ' +
    '       ) AS x ' +
    ' GROUP BY x.training_user_id ' +
    ' ORDER BY assign_start_dt DESC; ';

    return sql;
  },
  // 특정 교육과정의 강의별 이수율
  GetUserEduCourseProgress: () => {
    let sql =
    'SELECT x.`training_user_id` ' +
    '     , x.`course_id` ' +
    '     , MAX(x.`course_name`) AS course_name ' +
    '     , MAX(x.`assign_start_dt`) AS assign_start_dt ' +
    '     , MAX(x.`assign_end_dt`) AS assign_end_dt ' +
    '     , MAX(DATE_FORMAT(x.`course_start_dt`, \'%Y-%m-%d\')) AS course_start_dt ' +
    '     , MAX(DATE_FORMAT(x.`course_end_dt`, \'%Y-%m-%d\')) AS course_end_dt ' +
    '     , IFNULL(TRUNCATE(AVG(x.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '        SELECT tu.`user_id` ' +
    '             , u.`name` AS user_name ' +
    '             , e.`edu_name` ' +
    '             , e.`course_name` ' +
    '             , @training_user_id:= tu.`id` AS training_user_id ' +
    '             , @course_id:= e.`course_id` AS course_id ' +
    '             , e.`course_order` ' +
    '             , ( ' +
    '                SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '                  FROM `course_list` AS cl ' +
    '                  LEFT JOIN `log_session_progress` AS up ' +
    '                    ON cl.id = up.`course_list_id` ' +
    '                   AND up.`training_user_id` = @training_user_id ' +
    '                   AND up.`end_dt` IS NOT NULL ' +
    '                 WHERE cl.`course_id` = @course_id ' +
    '               ) AS completed_rate ' +
    '             , u.`branch_id` ' +
    '             , u.`duty_id` ' +
    '             , te.`edu_id` ' +
    '             , lae.`start_dt` AS assign_start_dt ' +
    '             , lae.`end_dt` AS assign_end_dt ' +
    '             , tu.`start_dt` AS study_start_dt ' +
    '             , tu.`end_dt` AS study_end_dt ' +
    '             , lcp.`start_dt` AS course_start_dt ' +
    '             , lcp.`end_dt` AS course_end_dt ' +
    '          FROM `training_users` AS tu ' +
    '         INNER JOIN `users` AS u ' +
    '            ON tu.`user_id` = u.`id` ' +
    '           AND u.`fc_id` = ? ' +
    '           AND u.`active` = 1 ' +
    '         INNER JOIN `training_edu` AS te ' +
    '            ON tu.`training_edu_id` = te.`id` ' +
    '         INNER JOIN `log_assign_edu` AS lae ' +
    '            ON lae.`training_edu_id` = te.`id` ' +
    '         INNER JOIN ' +
    '               ( ' +
    '                SELECT e.`id` AS edu_id ' +
    '                     , cg.`course_id` ' +
    '                     , e.`name` AS edu_name ' +
    '                     , c.`name` AS course_name ' +
    '                     , cg.`order` AS course_order ' +
    '                  FROM `edu` AS e ' +
    '                 INNER JOIN `course_group` AS cg ' +
    '                    ON e.`course_group_id` = cg.`group_id` ' +
    '                 INNER JOIN `course` AS c ' +
    '                    ON cg.`course_id` = c.`id` ' +
    '               ) AS e ' +
    '             ON te.`edu_id` = e.`edu_id` ' +
    '           LEFT JOIN `log_course_progress` AS lcp ' +
    '             ON tu.`id` = lcp.`training_user_id` ' +
    '            AND lcp.`course_id` = e.`course_id` ' +
    '          WHERE tu.`id` = ? ' +
    '      ) AS x ' +
    ' GROUP BY x.`training_user_id`, x.`course_id` ' +
    ' ORDER BY x.`course_order`; ';
    return sql;
  },
  // 체크리스트
  GetChecklistQuestionByEduId:
    'SELECT cl.`id` ' +
    '     , cl.`title` ' +
    '     , c.`item_name` ' +
    '     , c.`item_type` ' +
    '     , c.`item_section` ' +
    '     , c.`sample` ' +
    '  FROM `course_list` AS cl ' +
    ' INNER JOIN `checklist_group` AS cg ' +
    '    ON cl.`checklist_group_id` = cg.`group_id` ' +
    ' INNER JOIN `checklist` AS c ' +
    '    ON cg.`checklist_id` = c.`id` ' +
    ' INNER JOIN ' +
    '       ( ' +
    '        SELECT cg.`course_id` ' +
    '          FROM `edu` AS e ' +
    '         INNER JOIN `course_group` AS cg ' +
    '            ON e.`course_group_id` = cg.`group_id` ' +
    '         WHERE e.`id` = ? ' +
    '       ) AS e ' +
    '    ON cl.`course_id` = e.`course_id` ' +
    ' WHERE cl.`type` = \'CHECKLIST\' ' +
    ' ORDER BY cl.`order`, cg.`order`; ',

  GetChecklistUserAnswers:
    'SELECT luc.`user_id`, luc.`course_id`, luc.`course_list_id` ' +
    '     , MAX(d.`name`) AS duty_name ' +
    '     , MAX(b.`name`) AS branch_name ' +
    '     , MAX(u.`name`) AS user_name ' +
    '     , GROUP_CONCAT(luc.`answer` ORDER BY luc.`user_id`, luc.`course_id`, luc.`course_list_id`, cg.`order` SEPARATOR \',\' ) AS answered ' +
    '  FROM `course_list` AS cl ' +
    ' INNER JOIN `checklist_group` AS cg ' +
    '    ON cl.`checklist_group_id` = cg.`group_id` ' +
    ' INNER JOIN `checklist` AS c ' +
    '    ON cg.`checklist_id` = c.`id` ' +
    ' INNER JOIN ' +
    '       ( ' +
    '        SELECT cg.`course_id` ' +
    '          FROM `edu` AS e ' +
    '        INNER JOIN `course_group` AS cg ' +
    '            ON e.`course_group_id` = cg.`group_id` ' +
    '        WHERE e.`id` = ? ' +
    '       ) AS e ' +
    '    ON cl.`course_id` = e.`course_id` ' +
    ' INNER JOIN `log_user_checklist` AS luc ' +
    '    ON c.`id` = luc.`checklist_id` ' +
    '   AND luc.`edu_id` = ? ' +
    '   AND luc.`id` = ( ' +
    '         SELECT MAX(`id`) ' +
    '           FROM `log_user_checklist` ' +
    '          WHERE `edu_id` = luc.`edu_id` ' +
    '            AND `course_list_id` = luc.`course_list_id` ' +
    '            AND `checklist_id` = luc.`checklist_id` ' +
    '            AND `user_id` = luc.`user_id` ' +
    '        ) ' +
    '  INNER JOIN `users` AS u ' +
    '     ON luc.`user_id` = u.`id` ' +
    '   LEFT JOIN `branch` AS b ' +
    '     ON u.`branch_id` = b.`id` ' +
    '   LEFT JOIN `duty` AS d ' +
    '     ON d.`id` = u.`duty_id` ' +
    '  WHERE cl.`type` = \'CHECKLIST\' ' +
    '  GROUP BY luc.`user_id`, luc.`course_id`, luc.`course_list_id` ' +
    '  ORDER BY b.`name`; '
};

QUERY.DASHBOARD = {
  GetUserCount:
    'SELECT count(*) AS total_users FROM `users` ' +
    'WHERE fc_id= ?; ',

  GetBranchCount:
    'SELECT count(*) total_branch FROM `branch` ' +
    'WHERE fc_id= ?;',

  // 진행중인 교육과정 수
  GetCurrentEduCount:
    'SELECT COUNT(DISTINCT e.`id`) AS current_edu ' +
    '  FROM `training_edu` AS te ' +
    ' INNER JOIN `log_assign_edu` AS lae ' +
    '    ON lae.`training_edu_id` = te.`id` ' +
    ' INNER JOIN `edu` AS e ' +
    '    ON e.id = te.edu_id ' +
    '   AND e.`active` = 1 ' +
    ' INNER JOIN `admin` AS a ' +
    '    ON a.`id` = e.`creator_id` ' +
    ' WHERE lae.`start_dt` <= now() ' +
    '   AND lae.`end_dt` >= now() ' +
    '   AND a.fc_id = ?; ',

  GetCurrentEduCount_deprecated:
    'SELECT count(*) AS current_edu ' +
    '  FROM `training_edu` AS te ' +
    '  LEFT JOIN `edu` AS e ' +
    '    ON e.id = te.edu_id ' +
    '  LEFT JOIN `admin` AS a ' +
    '   ON a.`id` = e.`creator_id` ' +
    ' WHERE e.`start_dt` <= now() ' +
    '   AND e.`end_dt` >= now() ' +
    '   AND a.fc_id= ?; ',

  GetTotalEduCount:
    'SELECT count(*) AS total_edu FROM `edu` AS e ' +
    'LEFT JOIN `admin` AS a ' +
    'ON a.id = e.creator_id ' +
    'WHERE fc_id= ?;',

  GetRecentPointWeight:
    'SELECT pw.point_complete, pw.point_quiz, pw.point_final, pw.point_reeltime, pw.point_speed, pw.point_repetition ' +
    'FROM `point_weight` AS pw ' +
    'LEFT JOIN `admin` AS a ' +
    'ON a.id = pw.setter_id ' +
    'WHERE a.fc_id = ? ' +
    'ORDER BY `created_dt` DESC ' +
    'limit 1; ',

  SetPointWeight:
    'INSERT INTO `point_weight` (`point_complete`,`point_quiz`, `point_final`, ' +
    '`point_reeltime`, `point_speed`, `point_repetition`, `setter_id`) ' +
    'VALUES(?,?,?,?,?,?,?);',

  // 이번 달 전체 교육 이수율
  GetThisMonthProgress:
    'SELECT IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
    '  FROM ( ' +
    '        SELECT @training_user_id:= tu.`id` AS training_user_id ' +
    '             , @course_id:= e.`course_id` AS course_id ' +
    '             , ( ' +
    '                SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
    '                  FROM `course_list` AS cl ' +
    '                  LEFT JOIN `log_session_progress` AS up ' +
    '                    ON cl.id = up.`course_list_id` ' +
    '                   AND up.`training_user_id` = @training_user_id ' +
    '                   AND up.`end_dt` IS NOT NULL ' +
    '                 WHERE cl.`course_id` = @course_id ' +
    '               ) AS completed_rate ' +
    '             , te.`edu_id` ' +
    '             , e.`edu_name` ' +
    '             , e.`start_dt` ' +
    '             , e.`end_dt` ' +
    '          FROM `training_users` AS tu ' +
    '         INNER JOIN `users` AS u ' +
    '            ON tu.`user_id` = u.`id` ' +
    '           AND u.`fc_id` = ? ' +
    '           AND u.`active` = 1 ' +
    '         INNER JOIN `training_edu` AS te ' +
    '            ON tu.`training_edu_id` = te.`id` ' +
    '         INNER JOIN `log_assign_edu` AS lae ' +
    '            ON lae.`training_edu_id` = te.`id` ' +
    '           AND DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(lae.`start_dt`, \'%Y-%m\') AND DATE_FORMAT(lae.`end_dt`, \'%Y-%m\') ' +
    '         INNER JOIN ' +
    '               ( ' +
    '                SELECT e.`name` AS edu_name ' +
    '                     , e.`id` AS edu_id ' +
    '                     , cg.`course_id` ' +
    '                     , e.`start_dt` ' +
    '                     , e.`end_dt` ' +
    '                  FROM `edu` AS e ' +
    '                 INNER JOIN `course_group` AS cg ' +
    '                    ON e.`course_group_id` = cg.`group_id` ' +
    // '                 WHERE DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(e.`start_dt`, \'%Y-%m\') AND DATE_FORMAT(e.`end_dt`, \'%Y-%m\') ' +
    '               ) AS e ' +
    '            ON te.`edu_id` = e.`edu_id` ' +
    '       ) AS g ',

  // 이번 달 교육 진척도
  GetThisMonthProgressByEdu:
       'SELECT g.`fc_id`, g.`edu_id` ' +
       '     , MAX(g.`edu_name`) AS edu_name ' +
       '     , MAX(g.`start_dt`) AS edu_start_dt ' +
       '     , MAX(g.`end_dt`) AS edu_end_dt ' +
       '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
       '  FROM ( ' +
       '        SELECT @training_user_id:= tu.`id` AS training_user_id ' +
       '             , @course_id:= e.`course_id` AS course_id ' +
       '             , ( ' +
       '                SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
       '                  FROM `course_list` AS cl ' +
       '                  LEFT JOIN `log_session_progress` AS up ' +
       '                    ON cl.id = up.`course_list_id` ' +
       '                   AND up.`training_user_id` = @training_user_id ' +
       '                   AND up.`end_dt` IS NOT NULL ' +
       '                 WHERE cl.`course_id` = @course_id ' +
       '               ) AS completed_rate ' +
       '             , te.`edu_id` ' +
       '             , e.`edu_name` ' +
       '             , lae.`start_dt` ' +
       '             , lae.`end_dt` ' +
      //  '             , e.`start_dt` ' +
      //  '             , e.`end_dt` ' +
       '             , u.`fc_id` ' +
       '          FROM `training_users` AS tu ' +
       '         INNER JOIN `users` AS u ' +
       '            ON tu.`user_id` = u.`id` ' +
       '           AND u.`fc_id` = ? ' +
       '           AND u.`active` = 1 ' +
       '         INNER JOIN `training_edu` AS te ' +
       '            ON tu.`training_edu_id` = te.`id` ' +
       '         INNER JOIN `log_assign_edu` AS lae ' +
       '            ON lae.`training_edu_id` = te.`id` ' +
       '           AND DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(lae.`start_dt`, \'%Y-%m\') AND DATE_FORMAT(lae.`end_dt`, \'%Y-%m\') ' +
       '         INNER JOIN ' +
       '               ( ' +
       '                SELECT e.`name` AS edu_name ' +
       '                     , e.`id` AS edu_id ' +
       '                     , cg.`course_id` ' +
       '                     , e.`start_dt` ' +
       '                     , e.`end_dt` ' +
       '                  FROM `edu` AS e ' +
       '                 INNER JOIN `course_group` AS cg ' +
       '                    ON e.`course_group_id` = cg.`group_id` ' +
      //  '                 WHERE DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(e.`start_dt`, \'%Y-%m\') AND DATE_FORMAT(e.`end_dt`, \'%Y-%m\') ' +
       '               ) AS e ' +
       '            ON te.`edu_id` = e.`edu_id` ' +
       '       ) AS g ' +
       ' GROUP BY g.`fc_id`, g.`edu_id` ' +
       ' ORDER BY `edu_start_dt` ASC, `edu_name` ASC; ',
    //    ' ORDER BY `completed_rate` DESC; '

    // 지점별 이수율 (전체)
  GetBranchProgressAll:
        'SELECT g.`branch_id` ' +
        '     , MAX(b.`name`) AS branch_name ' +
        '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
        '  FROM ( ' +
        '    SELECT @training_user_id:= tu.`id` AS training_user_id ' +
        '       , @course_id:= e.`course_id` AS course_id ' +
        '       , ( ' +
        '        SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
        '          FROM `course_list` AS cl ' +
        '          LEFT JOIN `log_session_progress` AS up ' +
        '          ON cl.id = up.`course_list_id` ' +
        '           AND up.`training_user_id` = @training_user_id ' +
        '           AND up.`end_dt` IS NOT NULL ' +
        '         WHERE cl.`course_id` = @course_id ' +
        '        ) AS completed_rate ' +
        '       , u.`branch_id` ' +
        '      FROM `training_users` AS tu ' +
        '     INNER JOIN `users` AS u ' +
        '      ON tu.`user_id` = u.`id` ' +
        '          AND u.`fc_id` = ? ' +
        '          AND u.`active` = 1 ' +
        '     INNER JOIN `training_edu` AS te ' +
        '      ON tu.`training_edu_id` = te.`id` ' +
        '     INNER JOIN ' +
        '         ( ' +
        '        SELECT e.`id` AS edu_id, cg.`course_id` ' +
        '          FROM `edu` AS e ' +
        '         INNER JOIN `course_group` AS cg ' +
        '          ON e.`course_group_id` = cg.`group_id` ' +
        '         ) AS e ' +
        '      ON te.`edu_id` = e.`edu_id` ' +
        '    ) AS g ' +
        ' INNER JOIN `branch` AS b ' +
        '   ON g.`branch_id` = b.`id` ' +
        ' GROUP BY g.`branch_id` ' +
        ' ORDER BY `completed_rate` DESC; ',

     // 교육과정 강의뱔 이수율
  GetCourseProgressByEduId:
       'SELECT @course_id:= g.course_id AS course_id ' +
       '     , MAX(g.`course_name`) AS course_name ' +
       '     , IFNULL(TRUNCATE(AVG(g.`completed_rate`), 2), 0) AS completed_rate ' +
       '     , ( ' +
       '        SELECT IFNULL(TRUNCATE(AVG(course_rate), 2), 0) ' +
       '      FROM `user_rating` AS ur ' +
       '       WHERE ur.`course_id` = @course_id ' +
       '     ) AS course_rate ' +
       '     , ( ' +
       '        SELECT COUNT(DISTINCT ur.user_id) ' +
       '      FROM `user_rating` AS ur ' +
       '       WHERE ur.`course_id` = @course_id ' +
       '     ) AS vote_count ' +
       '  FROM ( ' +
       '        SELECT @training_user_id:= tu.`id` AS training_user_id ' +
       '             , @course_id:= e.`course_id` AS course_id ' +
       '             , ( ' +
       '                SELECT IFNULL(TRUNCATE(SUM(CASE WHEN ISNULL(up.`id`) THEN 0 ELSE 1 END) / COUNT(cl.`id`), 2) * 100, 0) ' +
       '                  FROM `course_list` AS cl ' +
       '                  LEFT JOIN `log_session_progress` AS up ' +
       '                    ON cl.id = up.`course_list_id` ' +
       '                   AND up.`training_user_id` = @training_user_id ' +
       '                   AND up.`end_dt` IS NOT NULL ' +
       '                 WHERE cl.`course_id` = @course_id ' +
       '               ) AS completed_rate ' +
       '             , e.`course_name` ' +
       '          FROM `training_users` AS tu ' +
       '         INNER JOIN `users` AS u ' +
       '            ON tu.`user_id` = u.`id` ' +
       '           AND u.`fc_id` = ? ' +
       '           AND u.`active` = 1 ' +
       '         INNER JOIN `training_edu` AS te ' +
       '            ON tu.`training_edu_id` = te.`id` ' +
       '         INNER JOIN ' +
       '               ( ' +
       '                SELECT e.`id` AS edu_id ' +
       '                     , cg.`course_id` ' +
       '                     , c.`name` AS course_name ' +
       '                  FROM `edu` AS e ' +
       '                 INNER JOIN `course_group` AS cg ' +
       '                    ON e.`course_group_id` = cg.`group_id` ' +
       '                 INNER JOIN `course` AS c ' +
       '                    ON cg.`course_id` = c.`id` ' +
       '                 WHERE e.`id` = ? ' +
       '               ) AS e ' +
       '            ON te.`edu_id` = e.`edu_id` ' +
       '       ) AS g ' +
       ' GROUP BY g.`course_id` ' +
       ' ORDER BY `completed_rate` DESC; ',

    // 포인트 현황
  GetUserPointList:
        'SELECT r.`user_id` ' +
        '    , MAX(r.`user_name`) AS user_name ' +
        '    , MAX(r.`branch_name`) AS branch_name ' +
        '    , MAX(r.`duty_name`) AS duty_name ' +
        '    , MAX(r.`fc_id`) AS `fc_id` ' +
        '    , SUM( ' +
        '        r.`complete` +  ' +
        '        r.`quiz_correction` +  ' +
        '        r.`final_correction` + ' +
        '        r.`reeltime` + ' +
        '        r.`speed` + ' +
        '        r.`repetition` ' +
        '    ) AS point_total ' +
        '  FROM ( ' +
        '        SELECT u.`id` AS user_id ' +
        '            , u.`name` AS user_name ' +
        '            , b.`name` AS branch_name ' +
        '            , d.`name` AS duty_name ' +
        '            , u.`fc_id` ' +
        '            , lup.`training_user_id` ' +
        '            , (lup.`complete` * epw.`point_complete`) AS complete ' +
        '            , (lup.`quiz_correction` * epw.`point_quiz`) AS quiz_correction ' +
        '            , (lup.`final_correction` * epw.`point_final`) AS final_correction ' +
        '            , (lup.`reeltime` * epw.`point_reeltime`) AS reeltime ' +
        '            , (lup.`speed` * epw.`point_speed`) AS speed ' +
        '            , (lup.`repetition` * epw.`point_repetition`) AS repetition ' +
        '          FROM `log_user_point` AS lup ' +
        '         INNER JOIN `users` AS u ' +
        '            ON lup.`user_id` = u.`id` ' +
        '           AND u.`fc_id` = ? ' +
        '          LEFT JOIN `branch` AS b ' +
        '            ON u.`branch_id` = b.`id` ' +
        '          LEFT JOIN `duty` AS d ' +
        '            ON u.`duty_id` = d.`id` ' +
        '          LEFT JOIN `edu_point_weight` AS epw ' +
        '            ON lup.`edu_id` = epw.`edu_id` ' +
        '           AND epw.`id` = (SELECT MAX(`id`) FROM `edu_point_weight` WHERE `fc_id` = ? AND `edu_id` = epw.`edu_id`) ' +
        '        ) AS r ' +
        ' WHERE 1=1 ' +
        ' GROUP BY r.`user_id` ' +
        ' ORDER BY `point_total` DESC ',

    // 포인트 현황(교육과정별 포인트 지정으로 사용안함)
  GetUserPointList_deprecated:
        'SELECT r.`user_id` ' +
        '    , MAX(r.`user_name`) AS user_name ' +
        '    , MAX(r.`branch_name`) AS branch_name ' +
        '    , MAX(r.`duty_name`) AS duty_name ' +
        '    , MAX(r.`fc_id`) AS `fc_id` ' +
        '    , SUM( ' +
        '        r.`complete` +  ' +
        '        r.`quiz_correction` +  ' +
        '        r.`final_correction` + ' +
        '        r.`reeltime` + ' +
        '        r.`speed` + ' +
        '        r.`repetition` ' +
        '    ) AS point_total ' +
        '  FROM ( ' +
        '        SELECT u.`id` AS user_id ' +
        '            , u.`name` AS user_name ' +
        '            , b.`name` AS branch_name ' +
        '            , d.`name` AS duty_name ' +
        '            , u.`fc_id` ' +
        '            , lup.`training_user_id` ' +
        '            , (lup.`complete` * ?) AS complete ' +
        '            , (lup.`quiz_correction` * ?) AS quiz_correction ' +
        '            , (lup.`final_correction` * ?) AS final_correction ' +
        '            , (lup.`reeltime` * ?) AS reeltime ' +
        '            , (lup.`speed` * ?) AS speed ' +
        '            , (lup.`repetition` * ?) AS repetition ' +
        '          FROM `log_user_point` AS lup ' +
        '         INNER JOIN `users` AS u ' +
        '            ON lup.`user_id` = u.`id` ' +
        '          LEFT JOIN `branch` AS b ' +
        '            ON u.`branch_id` = b.`id` ' +
        '          LEFT JOIN `duty` AS d ' +
        '            ON u.`duty_id` = d.`id` ' +
        '        AND u.`fc_id` = ? ' +
        '        ) AS r ' +
        ' WHERE 1=1 ' +
        ' GROUP BY r.`user_id` ' +
        ' ORDER BY `point_total` DESC ',

    // 교육과정별 포인트 현황
  GetUserPointListByEduId:
        'SELECT r.`training_user_id` ' +
        '     , MAX(r.`logs`) AS logs ' +
        '     , MAX(r.`user_name`) AS user_name ' +
        '     , MAX(r.`branch_name`) AS branch_name ' +
        '     , MAX(r.`duty_name`) AS duty_name ' +
        '     , MAX(r.`fc_id`) AS `fc_id` ' +
        '     , SUM( ' +
        '        r.`complete` +  ' +
        '        r.`quiz_correction` +  ' +
        '        r.`final_correction` + ' +
        '        r.`reeltime` + ' +
        '        r.`speed` + ' +
        '        r.`repetition` ' +
        '       ) AS point_total ' +
        '  FROM ( ' +
        '        SELECT u.`id` AS user_id ' +
        '             , u.`name` AS user_name ' +
        '             , b.`name` AS branch_name ' +
        '             , d.`name` AS duty_name ' +
        '             , u.`fc_id` ' +
        '             , lup.`training_user_id` ' +
        '             , (lup.`complete` * epw.`point_complete`) AS complete ' +
        '             , (lup.`quiz_correction` * epw.`point_quiz`) AS quiz_correction ' +
        '             , (lup.`final_correction` * epw.`point_final`) AS final_correction ' +
        '             , (lup.`reeltime` * epw.`point_reeltime`) AS reeltime ' +
        '             , (lup.`speed` * epw.`point_speed`) AS speed ' +
        '             , (lup.`repetition` * epw.`point_repetition`) AS repetition ' +
        // '             , (lup.`complete` * ?) AS complete ' +
        // '             , (lup.`quiz_correction` * ?) AS quiz_correction ' +
        // '             , (lup.`final_correction` * ?) AS final_correction ' +
        // '             , (lup.`reeltime` * ?) AS reeltime ' +
        // '             , (lup.`speed` * ?) AS speed ' +
        // '             , (lup.`repetition` * ?) AS repetition ' +
        '             , lup.`logs` ' +
        '          FROM `log_user_point` AS lup ' +
        '          LEFT JOIN `edu_point_weight` AS epw ' +
        '            ON lup.`edu_id` = epw.`edu_id` ' +
        '           AND epw.`id` = (SELECT MAX(`id`) FROM `edu_point_weight` WHERE `fc_id` = ? AND `edu_id` = epw.`edu_id`) ' +
        '         INNER JOIN `users` AS u ' +
        '            ON lup.`user_id` = u.`id` ' +
        '          LEFT JOIN `branch` AS b ' +
        '            ON u.`branch_id` = b.`id` ' +
        '          LEFT JOIN `duty` AS d ' +
        '            ON u.`duty_id` = d.`id` ' +
        '           AND u.`fc_id` = ? ' +
        '         WHERE 1=1 ' +
        '           AND lup.`edu_id` = ? ' +
        '        ) AS r ' +
        ' WHERE 1=1 ' +
        ' GROUP BY r.`training_user_id` ' +
        ' ORDER BY `point_total` DESC ',

    // 사용자 포인트 상세내역
  GetUserPointDetails:
        'SELECT `logs` ' +
        '     , epw.`point_complete` ' +
        '     , epw.`point_quiz` ' +
        '     , epw.`point_final` ' +
        '     , epw.`point_reeltime` ' +
        '     , epw.`point_speed` ' +
        '     , epw.`point_repetition` ' +
        '  FROM `log_user_point` AS lup ' +
        '  LEFT JOIN `edu_point_weight` AS epw ' +
        '    ON lup.`edu_id` = epw.`edu_id` ' +
        '   AND epw.`id` = (SELECT MAX(`id`) FROM `edu_point_weight` WHERE `fc_id` = ? AND `edu_id` = epw.`edu_id`) ' +
        ' WHERE lup.`user_id` = ? ' +
        '   AND lup.`logs` IS NOT NULL ' +
        ' ORDER BY lup.`created_dt`; '
};

QUERY.ASSIGNMENT = {

  DisableLogBindUserById:
    'UPDATE `log_bind_users` SET `active` = 0 WHERE `id` = ?; ',

  DisableLogAssignEduById:
    'UPDATE `log_assign_edu` SET `active` = 0 WHERE `id` = ?; ',

  UpdateLogAssignEduById:
    'UPDATE `log_assign_edu` SET `start_dt` = ?, `end_dt` = ? WHERE `id` = ?; ',

  DeleteLogBindUserById:
    'DELETE FROM `log_bind_users` WHERE `id` = ?; ',

  DeleteLogGroupUserByGroupId:
    'DELETE FROM `log_group_user` WHERE `group_id` = ?; '
};

module.exports = QUERY;
