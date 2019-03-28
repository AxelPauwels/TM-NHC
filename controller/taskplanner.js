var logger = require('../logic/log-util');

var express = require('express');
var router = express.Router();
var taskv2 = require('../model/taskv2');
var taskv2Category = require('../model/taskv2-category');
var taskv2Model = require('../model/taskv2-model');
var moment = require('moment');
var momentRecur = require('moment-recur');

const SECET_VALIDATION_KEY = 'B7532B35FE75FBAFBA7DCB7B7EC9F';

router.get('/:date?', function (req, res, next) {
    const date = req.params.date == undefined ? new Date() : new Date(parseFloat(req.params.date));
    req.getConnection((err, connection) => {
        taskv2Category.getAllWithTasksForDate(connection, date).then(result => {
            res.json({date: date, taskCategories: result});
        }).catch(err => console.log(err));
    });
});


router.post('/createtasks', async (req, res, next) => {
    if (req.body.authorization != 'B7532B35FE75FBAFBA7DCB7B7EC9F') {
        res.send(401);
        return;
    }
    req.getConnection(async (err, db) => {
        let taskModels = await taskv2Model.getAll(db);
        let totalTasksCreated = 0;
        for (let i = 0; i < taskModels.length; i++) {
            const tm = taskModels[i];
            let recur;
            if (tm.recur_model == 1)
                recur = moment().recur().every(1).days();
            else if (tm.recur_model == 2)
                recur = moment().recur().every(tm.recur_day + 1).daysOfWeek();
            else if (tm.recur_model == 3)
                recur = moment().recur().every(tm.recur_day).daysOfMonth();
            else if (tm.recur_model == 4)
                recur = moment().recur().every(tm.recur_day).daysOfMonth().every(tm.recur_month).monthsOfYear();
            let lastTask = await taskv2.getLastTaskForModel(db, tm.id);
            let recurMoments = recur.next(5 * (tm.recur_multiplier == null || tm.recur_multiplier == 0 ? 1 : tm.recur_multiplier));
            for (let k = 0; k < recurMoments.length; k += (tm.recur_multiplier == null || tm.recur_multiplier == 0 ? 1 : tm.recur_multiplier)) {
                let recurMoment = recurMoments[k];
                if (lastTask.length == 0 || moment(lastTask[0].date_created).isBefore(recurMoment)) {
                    await taskv2.create(db, {taskv2_model: tm.id, date_created: recurMoment.dateOnly().toDate()});
                    totalTasksCreated++;
                }
            }
        }
        res.json({totalCreated: totalTasksCreated});
    });
});


module.exports = router;