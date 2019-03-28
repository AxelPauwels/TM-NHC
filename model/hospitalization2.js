var logger = require('../logic/log-util');
logger.debug("Loading model 'hospitalization'");

var database = require('../logic/db-util2');
var Uuid = require('node-uuid');

var hospitalization = module.exports;

//to simplify the new model creations!
const theModelQuery = hospitalization;
const tableName = "hospitalization";

hospitalization.getAll = function (db) {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id "
    );
};

hospitalization.get = function (db, id) {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ?", [{'h.id': id}]
    );
};

hospitalization.getByUuid = function (db, uuid) {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ?", [{'h.uuid': uuid}]
    );
};

hospitalization.getForCage = function (db, cage, userData) {
    return database.sqlExtendedPromise(db, userData,
        "SELECT h.*, a.name, a.group_name, a.eats_at_night, " +
        "c.name AS cage_name, r.color " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ?", [{'h.cage': cage}]
    );
};

hospitalization.getByState = function (db, status_code) {
    // if (status_code !== 'ARCHIVED') {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
        "FROM hospitalization h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ?", [{'h.status_code': status_code}]
    );
    // } else {
    //     return database.sqlPromise(db,
    //         "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
    //         "FROM hospitalization_archived h " +
    //         "JOIN animal a ON h.animal = a.id " +
    //         "JOIN cage c ON h.cage = c.id " +
    //         "LEFT OUTER JOIN route r ON c.route = r.id "
    //     );
    // }
};

hospitalization.getByStateUuid = function (db, status_code, uuid) {
    // if (status_code !== 'ARCHIVED') {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
        "FROM hospitalization h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE ? AND ?", [{status_code: status_code}, {uuid: uuid}]
    );
    // } else {
    //     return database.sqlPromise(db,
    //         "SELECT h.*, a.name AS animal_name, c.name AS cage_name, r.color " +
    //         "FROM hospitalization_archived h " +
    //         "JOIN animal a ON h.animal = a.id " +
    //         "JOIN cage c ON h.cage = c.id " +
    //         "LEFT OUTER JOIN route r ON c.route = r.id " +
    //         "WHERE ?", [{uuid: uuid}]
    //     );
    // }
};

hospitalization.getForAdoption = function (db) {
    return database.sqlPromise(db,
        "SELECT h.*, a.name AS animal_name, " +
        "c.name AS cage_name, r.color " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "LEFT JOIN cage c ON h.cage = c.id " +
        "LEFT JOIN route r ON c.route = r.id " +
        "WHERE for_adoption = '1' AND status_code = 'RECOVER' " +
        "ORDER BY color, cage_name "
    );
};

hospitalization.fillCageContent = function (db, cage, userData) {
    return database.sqlExtendedPromise(db, userData,
        "SELECT a.group_name, a.menu_hash, SUM(h.quantity) AS quantity " +
        "FROM hospitalization_active h " +
        "LEFT JOIN animal a ON h.animal = a.id " +
        "WHERE ? " +
        "GROUP BY a.menu_hash, a.group_name",
        [{'h.cage': cage}]
    );
};

// hospitalization.create = function (db, data) {
//     var fiche = build(data);
//     fiche.uuid = Uuid.v1();
//     // // Status IC
//     // if (fiche.cage === 0) {
//     //     fiche.status_code = "IC";
//     // }
//     return database.sqlPromise(db,
//         "INSERT INTO hospitalization SET ?", fiche);
// };


// hospitalization.update = function (db, data) {
//     var fiche = build(data);
//     // if (fiche.status_code === 'END') {
//     //     return hospitalization.archive(db, data.id, fiche);
//     // }
//
//     console.log(data);
//     console.log("fiche: ");
//     console.log(fiche);
//
//     return database.sqlPromise(db,
//         "UPDATE hospitalization SET ? WHERE ?",
//         [fiche, {id: data.id}]);
// };

// hospitalization.archive = function (db, id, fiche) {
//     return database.sqlPromise(db,
//         "UPDATE hospitalization SET ? WHERE ?", [fiche, {id: id}])
//         .then(function (result) {
//             return database.sqlPromise(db,
//                 "INSERT INTO hospitalization_archived " +
//                 "SELECT * FROM hospitalization " +
//                 "WHERE status_code = 'END' AND ?", [{id: id}]);
//         })
//         .then(function (result) {
//             return database.sqlPromise(db,
//                 "DELETE FROM hospitalization " +
//                 "WHERE status_code = 'END' AND ?", [{id: id}]);
//         });
// };

hospitalization.delete = function (db, id) {
    return database.sqlPromise(db,
        "DELETE FROM hospitalization WHERE ?", {id: id});
};

hospitalization.getOverviewReport = function (db, start, end) {
    start = database.dateString(start);
    end = database.dateString(end);
    logger.debug("hospitalization.getOverviewReport", start, end);

    return database.sqlPromise(db,
        "SELECT a.name," +
        "       enr.name AS entrance_reason, " +
        "       exr.name AS exit_reason, " +
        "       SUM(quantity) AS animal_count," +
        "       COUNT(*) AS fiche_count " +
        "FROM hospitalization h " +
        "LEFT JOIN animal a ON a.id=h.animal " +
        "LEFT JOIN entrance_reason enr ON enr.id=h.entrance_reason " +
        "LEFT JOIN exit_reason exr ON exr.id=h.exit_reason " +
        "WHERE h.entrance >= ? AND h.entrance <= ? " +
        "GROUP BY a.name,exit_reason;", [start, end, start, end]);
};

function build(data) {
    logger.debug("build:", data);
    // if (data.cage > 0)
    //     data.status_code = "RECOVER";
    if (!data.for_adoption || data.for_adoption !== 1)
        data.reserved = 0;
    if (!data.reserved || data.reserved !== 1)
        data.reserved_for = null;

    var fieldDefaults = [
        ['uuid', null],
        ['animal', null],
        ['quantity', 1],
        ['cage', null],
        ['exit_reason', null],
        ['staff_only', 0],
        ['dangerous', 0],
        ['medication', null],
        ['comment', null],
        ['for_adoption', 0],
        ['origin', null],
        ['id_number', null],
        ['status_code', null],
        ['exit_comment', null],
        ['just_comment', null],
        ['reserved', 0],
        ['menu_percentage', null],
        ['reserved_for', null],
        ['hospitalization_comment', null],
        ['contact', null],
        ['male_quantity', null],
        ['female_quantity', null],
        ['entrance_reason', null],
        ['hospitalization_group', null]
    ];

    // return database.sqlPromise(db, "UPDATE taskv2 SET ? WHERE ?", [{
    //     date_completed: new Date(task.date_completed),
    //     staff_name: task.staff_name
    // }, {id: task.id}]);

    var fiche = database.build(data, [], fieldDefaults);

    fiche.entrance =
        database.dateString(data.entrance = new Date(data.entrance));
    // database.dateString(data.entrance || (new Date()).toJSON());
    fiche.exit = data.exit ? database.dateString(data.exit) : null;
    fiche.adoption_from =
        data.adoption_from ? database.dateString(data.adoption_from) : null;

    logger.debug("fiche:", fiche);
    return fiche;
}

// logger.silly("Loading model 'hospitalization'");

//THOMAS MORE new methods!
hospitalization.updateTheContact = function (db, data) {
    // var fiche = build(data);
    // if (fiche.status_code === 'END') {
    //     return hospitalization.archive(db, data.id, fiche);
    // }
    console.log(data); //todo: Log weghalen?
    return database.sqlPromise(db,
        "UPDATE `hospitalization` SET `contact` = " + data.contact + " WHERE `hospitalization`.`id` = " + data.id + ";");
};

hospitalization.getSingle = function (db, id) {
    return database.sqlPromise(db,
        "SELECT * FROM hospitalization WHERE id = " + id + ";"
    );
};

hospitalization.getLastId = function (db) {
    return database.sqlPromise(db,
        "SELECT id FROM hospitalization ORDER BY id DESC LIMIT 1");
};


hospitalization.getForExcel = function (db) {
    return database.sqlPromise(db,
        "SELECT h.id, h.entrance, h.quantity, h.exit, a.name AS animal_name, e.name as entrance_name, x.name as exit_name " +
        "FROM hospitalization h " +
        "LEFT JOIN animal a ON h.animal = a.id " +

        "LEFT JOIN entrance_reason e ON h.entrance_reason = e.id " +
        "LEFT JOIN exit_reason x ON h.exit_reason = x.id"
    );
};

hospitalization.create = function (db, data) {

    if (data.quantity === 0) {
        data.quantity = 1;
    }
    var fiche = build(data);
    // // Status IC
    // if (fiche.cage === 0) {
    //     fiche.status_code = "IC";
    //  }

    var dataHosp = [];
    var dataHospObj = {};

    var dataHospSingle;
    for (var i = 0; i < fiche.quantity; i++) {
        fiche.uuid = Uuid.v1();
        //PLAN WAS TO PUSH EVERYTHING TO AN ARRAY, BUT DIDN'T WORK
        // dataHosp.push(database.sqlPromise(db,
        //     "INSERT INTO hospitalization SET ?", fiche));

        //PLAN B TO MAKE OBJECTS OF OBJECTS, DIDN'T WORK EITHER
        // dataHospObj.add(database.sqlPromise(db,
        //     "INSERT INTO hospitalization SET ?", fiche));

        dataHospSingle = (database.sqlPromise(db,
            "INSERT INTO hospitalization SET ?", fiche));
    }

    // console.log("the dataHosp array");
    // console.log(dataHosp);

    return dataHospSingle;
};

hospitalization.createSingle = function (db, data) {

    var fiche = build(data);

    var dataHospSingle;
    fiche.uuid = Uuid.v1();

    dataHospSingle = (database.sqlPromise(db,
        "INSERT INTO hospitalization SET ?", fiche));

    return dataHospSingle;
};


theModelQuery.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE " + tableName +
        " SET ? WHERE ? ", [data, {id: data.id}]);
};

theModelQuery.update = function (db, data) {
    return database.sqlPromise(db,
        "UPDATE " + tableName +
        " SET ? WHERE ? ", [data, {id: data.id}]);
};

theModelQuery.updateAllWhereGroupId = function (db, data) {
    // console.log(data);
    // return hospitalization_group_promise = new Promise((resolve, reject) => {
    //     (database.sqlPromise(db,
    //         "SELECT hospitalization_group FROM `hospitalization` WHERE id = " + data.id)
    //         .then(value => {
    //             // database.sqlPromise(db,
    //             //     "UPDATE `nhc`.`hospitalization` SET ? WHERE `hospitalization`.`hospitalization_group` = " +
    //             //     value[0].hospitalization_group, [data, {id: data.id}])
    //             //// [fiche, {hospitalization_group: value[0]}])
    //             database.sqlPromise(db,
    //                 "UPDATE " + tableName +
    //                 " SET ? WHERE ? ", [data, {hospitalization_group: value[0].hospitalization_group}])
    //                 .then(value2 => {
    //                     // console.log(value[0].hospitalization_group); // Success!
    //                     resolve(value2);
    //                     console.log(value2);
    //                 });
    //         }))
    // });
    delete data.id;
    console.log(data);

    return database.sqlPromise(db,
        "UPDATE " + tableName +
        " SET ? WHERE ? ", [data, {hospitalization_group: data.hospitalization_group}]);
};

hospitalization.getAllComplete = function (db) {
    return database.sqlPromise(db,
        // "SELECT * FROM hospitalization"
        // "SELECT * FROM hospitalization h JOIN animal a ON h.animal = a.id"
        "SELECT h.*, a.name FROM hospitalization h JOIN animal a ON h.animal = a.id ORDER BY h.hospitalization_group ASC"
    );
};

hospitalization.createHospGroup = function (db, id) {
    return (database.sqlPromise(db,
        "INSERT INTO `nhc`.`hospitalization_group` (`id`) VALUES ('+ " + id + "') ;"));
};

hospitalization.setTheHospitalizationGroups = function (db, total) {
    // var total = id;
    function updateHospitalizationGroup(idd) {
        database.sqlPromise(db,
            "UPDATE `hospitalization` SET `hospitalization_group` = " + idd + " WHERE `hospitalization`.`id` = " + idd + " ;"
        );
        console.log("updateHospitalizationGroup " + idd)
    }

    function createHospGroup(hosp_group_no) {
        (database.sqlPromise(db,
            "INSERT INTO `nhc`.`hospitalization_group` (`id`) VALUES ('+ " + hosp_group_no + "') ;"));
        console.log("createHospGroup " + hosp_group_no)

    }

    for (let idd = 0; idd < total; idd++) {
        let quantityMoreThanOne = '';

        quantityMoreThanOne = database.sqlPromise(db,
            ("SELECT * FROM `hospitalization` h WHERE h.id = " + idd)
        ).then(
            function (results) {
                if (results[0].quantity > 1) {
                    results[0].hospitalization_group = results[0].id;
                    for (let j = 0; j < results[0].quantity - 1; j++) {
                        hospitalization.createSingle(db, results[0]);
                        updateHospitalizationGroup(idd);
                    }
                    createHospGroup(results[0].id);
                    console.log("Updated Multiple Hospitalizations")

                }
                else {
                    updateHospitalizationGroup(idd);
                    createHospGroup(idd);
                    console.log("Updated Single Hospitalization")
                }
                console.log(idd);
            },
            function (err) {
                console.log(err);
            }

        );
    }
    return null;
};


