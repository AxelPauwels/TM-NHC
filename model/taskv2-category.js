var logger = require('../logic/log-util');
var database = require('../logic/db-util2');
var taskv2 = require('./taskv2');
var taskv2Model = require('./taskv2-model');

var taskv2Category = module.exports;

taskv2Category.getAll = function (db) {
    return database.sqlPromise(db, "SELECT * FROM taskv2_category");
};

taskv2Category.getAllConfigViewModels = function (db) {
    return database.sqlPromise(db, "SELECT tc.id as id, tc.name as name, (SELECT COUNT(*) FROM taskv2 t WHERE t.taskv2_category = tc.id)+(SELECT COUNT(*) FROM taskv2 t WHERE t.taskv2_model IS NOT NULL AND (SELECT tm.taskv2_category FROM taskv2_model tm WHERE tm.id=t.taskv2_model)=tc.id) as numberOfTasks FROM taskv2_category tc");
};

taskv2Category.get = function (db, id) {
    return database.sqlPromise(db, "SELECT * FROM taskv2_category WHERE ?", {id: id});
};

taskv2Category.create = function (db, taskCategory) {
    return database.sqlPromise(db, "INSERT INTO taskv2_category SET ?", taskCategory);
};

taskv2Category.update = function (db, taskCategory) {
    return database.sqlPromise(db, "UPDATE taskv2_category SET ? WHERE ?", [taskCategory, {id: taskCategory.id}]);
};

taskv2Category.delete = function (db, taskCategoryId) {
    return database.sqlPromise(db, "DELETE FROM taskv2_category WHERE ?", {id: taskCategoryId});
};

taskv2Category.getAllWithTasksForDate = function (db, date) {
    let categories;
    return new Promise((resolve, reject) => {
        taskv2Category.getAll(db).then(categoryResult => {
            categories = categoryResult;
            taskv2.getAllForDateWithModel(db, date).then(taskResult => {
                let taskv2Models;
                taskv2Model.getAll(db).then(modelResult => {
                    taskv2Models = modelResult;
                    categories.forEach(category => {
                        category.tasks = [];
                        taskResult.forEach(task => {
                            if (task.taskv2_model != null) {
                                let model = taskv2Models.find(mdl => mdl.id == task.taskv2_model);
                                if (model.taskv2_category == category.id) {
                                    task.name = model.name;
                                    task.taskv2_category = model.taskv2_category;
                                    task.information = model.information;
                                    category.tasks.push(task);
                                }
                            } else {
                                if (task.taskv2_category == category.id) {
                                    if (task.custom_name != null)
                                        task.name = task.custom_name;
                                    category.tasks.push(task);
                                }
                            }
                        });
                    })
                    resolve(categories);
                });
            });
        });
    });
};
