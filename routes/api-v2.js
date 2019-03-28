var logger = require('../logic/log-util');
logger.debug("Loading router 'api-v2'");

var express = require('express');
var router = express.Router();

// All responses to api requests should not be cached by the browser
router.use('/', require('./nocache'));

router.use('/cage', require('../controller/cage'));
router.use('/user', require('../controller/user'));
router.use('/animal', require('../controller/animal'));
router.use('/fiche', require('../controller/fiche')); //DB => hospitalization
router.use('/entrancereason', require('../controller/entrancereason'));
router.use('/exitreason', require('../controller/exitreason'));
router.use('/food', require('../controller/food'));
router.use('/menu', require('../controller/menu'));
router.use('/measure', require('../controller/measure'));
router.use('/preparecategory', require('../controller/preparecategory'));
router.use('/route', require('../controller/route'));
router.use('/taskexecutor', require('../controller/taskexecutor'));
router.use('/leftover', require('../controller/leftover'));
router.use('/work', require('../controller/work'));
router.use('/workflow', require('../controller/workflow'));

//New tables (Thomas More)!
router.use('/preferences', require('../controller/preferences'));
router.use('/weight', require('../controller/weight'));
router.use('/logger', require('../controller/logger'));
router.use('/animalkingdom', require('../controller/animal_kingdom'));
router.use('/hedgehogcontainer', require('../controller/hedgehog_container'));
router.use('/hedgehogcontainerdivision', require('../controller/hedgehog_container_division'));
router.use('/hospitalizationhedgehogcontainer', require('../controller/hospitalization_hedgehog_container'));
router.use('/contact', require('../controller/contact'));
router.use('/hospitalizationcomment', require('../controller/hospitalization_comment'));
router.use('/hospitalizationgroup', require('../controller/hospitalization_group'));
router.use('/quarantaine', require('../controller/quarantaine'));
router.use('/quarantaineaction', require('../controller/quarantaine_action'));
router.use('/recurmodel', require('../controller/recur-model'));
router.use('/taskv2', require('../controller/taskv2'));
router.use('/taskv2category', require('../controller/taskv2-category'));
router.use('/taskv2model', require('../controller/taskv2-model'));
router.use('/taskplanner', require('../controller/taskplanner'));
router.use('/quarantaineaction', require('../controller/quarantaine_action'));
router.use('/worker', require('../controller/worker'));
router.use('/environment', require('../controller/environment'));


module.exports = router;
logger.silly("Loaded router 'api-v2'");
