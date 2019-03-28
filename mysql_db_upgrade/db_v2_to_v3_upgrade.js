/**
 * Created by asterix on 7/26/17.
 */

////////////////////////////////////////////////////////////////////////////////
// Table leftover
////////////////////////////////////////////////////////////////////////////////
// Original table leftover definition:
// CREATE TABLE `leftover` (
//     `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//     `cage` int(10) unsigned NOT NULL,
//     `number` int(11) NOT NULL DEFAULT '0',
//     `day` date NOT NULL,
//     PRIMARY KEY (`id`))

// Add the missing unique-constraint on 'cage + day' for the leftover table.
// Due to this constraint, it is simply possible to use
// 'INSERT INTO ... ON DUPLICATE KEY UPDATE ...' for leftovers.
// @Ref: model/leftover2.js -> leftover.save()
var sql = "ALTER TABLE leftover ADD CONSTRAINT uc_leftover UNIQUE (cage, day);";

// Remove superfluous records from the leftover table (i.e. number=0)
// Note that for deleting rows in safe mode, a KEY must be used,
// so just use an expression that covers them all (i.e. id>=0).
// Note also that due to another implementation of leftover.save(), which will
// remove a record when number is set to 0, this cleaning is only needed once.
// @Ref: model/leftover2.js -> leftover.save()
var sql = "DELETE FROM leftover WHERE number = 0 AND id >= 0;";

// Remove the superfluous definition default 0 from leftover.number,
// redefine to unsigned integer and rename to quantity.
var sql = "ALTER TABLE leftover " +
    "CHANGE COLUMN number quantity INT(10) UNSIGNED NOT NULL;";

// Due to another implementation of leftover.save(), the SP set_left_over()
// is no longer needed and can be dropped.
// @Ref: model/leftover2.js -> leftover.save()
var sql = "DROP PROCEDURE IF EXISTS set_left_over;";

// Due to an alternative implementation leftover.getAll(), replacing
// leftover.getReport(), the SP left_over_report() is no longer needed and
// can be dropped.
// @Ref: model/leftover2.js -> leftover.getAll(), leftover.getReport()
var sql = "DROP PROCEDURE IF EXISTS left_over_report;";

// Add the missing foreign key 'cage' to the leftover table. Additionally,
// add ON UPDATE CASCADE ON DELETE CASCADE, to automatically update/remove
// leftover-records when the referenced cage-record is updated/removed.
// Before the FK can be added, remove all conflicting leftover-records.
var sql = "DELETE FROM leftover " +
    "WHERE cage NOT IN (SELECT cage.id FROM cage) AND id >= 0;";
var sql = "ALTER TABLE leftover ADD CONSTRAINT fk_leftover_cage " +
    "FOREIGN KEY (cage) REFERENCES cage(id) ON UPDATE CASCADE ON DELETE CASCADE;";

// Improve leftover management by adding menu_quantity and animal_count. Due to
// backward compatibility (all current records don't have these fields), the
// columns are defined with DEFAULT NULL (optional values) i.s.o. the preferred
// NOT NULL (mandatory values).
var sql = "ALTER TABLE leftover " +
    "ADD COLUMN menu_quantity INT(10) UNSIGNED DEFAULT NULL, " +
    "ADD COLUMN animal_count INT(10) UNSIGNED DEFAULT NULL;";

////////////////////////////////////////////////////////////////////////////////
// Archiving / clean-up / speed-up
////////////////////////////////////////////////////////////////////////////////
// At first, it was decided to move ENDed hospitalizations to a separate
// hospitalization_archived table. This was a wrong decision and thus reversed.
//
//     // Create archive hospitalization table
//     var sql = "CREATE TABLE IF NOT EXISTS hospitalization_archived " +
//         "LIKE hospitalization;";
//
//     // Move ENDed hospitalizations to the archive table
//     var sql = "INSERT INTO hospitalization_archived " +
//         "SELECT * FROM hospitalization " +
//         "WHERE status_code = 'END' ORDER BY id;";
//
//     var sql = "DELETE FROM hospitalization " +
//         "WHERE uuid IN (SELECT uuid FROM hospitalization_archived) " +
//         "AND id >= 0;";
//
// The benefit of 2 separate tables is to ease the selection of 'active' or
// 'archived' hospitalizations. This is now realized as 2 different views on
// the hospitalization table.
var sql = "CREATE VIEW hospitalization_archived AS " +
    "SELECT * FROM hospitalization " +
    "HAVING status_code = 'END';";
var sql = "CREATE VIEW hospitalization_active AS " +
    "SELECT * FROM hospitalization " +
    "HAVING status_code <> 'END';";

// The triggers, defined on the menu table, use the DEFINER=`bthaens`@`%`
// clause, meaning that no triggering SQL statements can be executed if that
// DB user does not exist. This doesn't make any sense, so remove those clauses.
// Unfortunately, it cannot be done by altering the triggers, so just drop them
// and recreate them without the unnecessary limiting clause.
var sql = "DROP TRIGGER IF EXISTS trg_menu_af_ins;";
// TODO: When it is decided to phase-out the animal.menu_hash + triggers, this is no longer needed.
var sql = "DELIMITER $$";
var sql = "CREATE TRIGGER trg_menu_af_ins AFTER INSERT ON menu " +
    "FOR EACH ROW " +
    "BEGIN " +
    "CALL animal_define_menu_hash(new.animal); " +
    "END $$ " +
    "DELIMITER ;";

var sql = "DROP TRIGGER IF EXISTS trg_menu_af_upd;";
// TODO: When it is decided to phase-out the animal.menu_hash + triggers, this is no longer needed.
var sql = "DELIMITER $$";
var sql = "CREATE TRIGGER trg_menu_af_upd AFTER UPDATE ON menu " +
    "FOR EACH ROW " +
    "BEGIN " +
    "CALL animal_define_menu_hash(old.animal); " +
    "CALL animal_define_menu_hash(new.animal); " +
    "END $$ " +
    "DELIMITER ;";

var sql = "DROP TRIGGER IF EXISTS trg_menu_af_del;";
// TODO: When it is decided to phase-out the animal.menu_hash + triggers, this is no longer needed.
var sql = "DELIMITER $$";
var sql = "CREATE TRIGGER trg_menu_af_del AFTER DELETE ON menu " +
    "FOR EACH ROW " +
    "BEGIN " +
    "CALL animal_define_menu_hash(old.animal); " +
    "END $$ " +
    "DELIMITER ;";

////////////////////////////////////////////////////////////////////////////////
// Cleanup booleans
////////////////////////////////////////////////////////////////////////////////
var sql = "ALTER TABLE hospitalization " +
    "MODIFY COLUMN staff_only TINYINT(1) NOT NULL DEFAULT '0', " +
    "MODIFY COLUMN dangerous TINYINT(1) NOT NULL DEFAULT '0', " +
    "MODIFY COLUMN for_adoption TINYINT(1) NOT NULL DEFAULT '0', " +
    "MODIFY COLUMN reserved TINYINT(1) NOT NULL DEFAULT '0';";

var sql = "ALTER TABLE animal " +
    "MODIFY COLUMN eats_at_night TINYINT(1) NOT NULL DEFAULT '0';";

var sql = "ALTER TABLE food " +
    "MODIFY COLUMN prepare TINYINT(1) NOT NULL DEFAULT '0';";

////////////////////////////////////////////////////////////////////////////////
// Cleanup numbers
////////////////////////////////////////////////////////////////////////////////
var sql = "UPDATE food SET extra_quantity = NULL " +
    "WHERE id >= 0 AND extra_quantity = 0;";

var sql = "DELETE FROM menu " +
    "WHERE id >= 0 AND quantity = 0;";

////////////////////////////////////////////////////////////////////////////////
// Table textblob
////////////////////////////////////////////////////////////////////////////////
// For the time being, the preferences are stored as a text-blob.
// TODO: Upgrade to a MySQL/MariaDB version that supports JSON-data and adapt the NodeJS Preference-Controller and -Model
var sql = "CREATE TABLE textblob (" +
    "name VARCHAR(128) NOT NULL, " +
    "value TEXT, " +
    "PRIMARY KEY (name));";

////////////////////////////////////////////////////////////////////////////////
// Table weight
////////////////////////////////////////////////////////////////////////////////
// To support multiple weight-measurements, a new table is required i.s.o.
// fields on the hospitalization-table. Create the weight-table with a FK to the
// hospitalization-table and a unique constraint on 'hospitalization + date'.
var sql = "CREATE TABLE weight (" +
    "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, " +
    "hospitalization INT(10) UNSIGNED NOT NULL, " +
    "grams INT(10) UNSIGNED NOT NULL, " +
    "date DATE NOT NULL, " +
    "PRIMARY KEY (id), " +
    "CONSTRAINT uc_weight UNIQUE (hospitalization, date), " +
    "CONSTRAINT fk_weight_hospitalization " +
    "FOREIGN KEY (hospitalization) REFERENCES hospitalization(id) " +
    "ON UPDATE CASCADE ON DELETE CASCADE);";

// Copy the weight-data from the existing hospitalization-table to the new
// weight-table. In case the 'weight_date' is NULL for an existing
// 'weight_in_grams', the date in the weight-table is set to the entrance date
// (as it cannot be NULL in the new table).
var sql = "INSERT INTO weight (hospitalization, grams, date) " +
    "SELECT id, weight_in_grams, " +
    "(IF(weight_date IS NULL, entrance, weight_date)) " +
    "FROM hospitalization WHERE weight_in_grams > 0;";

// TODO: If possible, try to add the weight-data from the free-form text in the comments to the weight-table.

// TODO: Workflow to preserve the weight-data when a hospitalizations gets archived e.g. also archive weight-data.

////////////////////////////////////////////////////////////////////////////////
// Table hospitalization
////////////////////////////////////////////////////////////////////////////////
// Add the missing foreign keys 'animal' and 'cage' to the hospitalization
// table without ON UPDATE/DELETE, to automatically reject updates/removals of
// the referenced animal-/cage-records.

// Before the FK's can be added, resolve all conflicting hospitalizations.
// Guests that are moved from 'recovery' to 'IC' are no longer subject to
// recovery treatment and thus will not be allocated to a cage. This is
// indicated on the hospitalization-record by setting the cage to '0' which is
// a non-existing cage. By defining a virtual _IC_ cage with id 0, the current
// implementation can be preserved (is not impacted) while it resolves the FK
// conflict. Note that after insertion, the auto-incrementing 'id' needs to be
// set to '0' explicitly.
var sql = "INSERT INTO cage (name, board_position) VALUES ('_IC_', 0);";
var sql = "UPDATE cage SET id='0' WHERE name='_IC_' AND id >= 0;";

// Define a virtual _ERROR_ cage with id 1 to resolve all other
// cage FK conflicts.
var sql = "INSERT INTO cage (name, board_position) VALUES ('_ERROR_', '0');";
var sql = "UPDATE cage SET id='1' WHERE name='_ERROR_' AND id >= 0;";

// Update the cage of all conflicting hospitalizations
var sql = "UPDATE hospitalization SET cage='1' " +
    "WHERE cage NOT IN (SELECT cage.id FROM cage) AND id >= 0;";

// Define a virtual _ERROR_ animal with id 1 to resolve all
// animal FK conflicts.
var sql = "INSERT INTO animal (name) VALUES ('_ERROR_');";
var sql = "UPDATE animal SET id='1' WHERE name='_ERROR_' AND id >= 0;";

// Update the animal of all conflicting hospitalizations
var sql = "UPDATE hospitalization SET animal='1' " +
    "WHERE animal NOT IN (SELECT animal.id FROM animal) AND id >= 0;";

// Now add the foreign keys 'animal' and 'cage'.
var sql = "ALTER TABLE hospitalization " +
    "ADD CONSTRAINT fk_hospitalization_animal " +
    "FOREIGN KEY (animal) REFERENCES animal(id), " +
    "ADD CONSTRAINT fk_hospitalization_cage " +
    "FOREIGN KEY (cage) REFERENCES cage(id);";

// Add the column 'reserved_for' (extra adoption info) to the hospitalization
// table.
var sql = "ALTER TABLE hospitalization " +
    "ADD COLUMN reserved_for VARCHAR(64);";

// To support multiple weight-measurements, a new weight-table is used i.s.o.
// fields on the hospitalization-table, so drop the superfluous
// 'weight_in_grams' and 'weight_date' columns (after the weight-data has been
// copied to the new weight-table!).
var sql = "ALTER TABLE hospitalization " +
    "DROP COLUMN weight_in_grams, " +
    "DROP COLUMN weight_date;";

// Clean-up the hospitalization-table by removing the unused 'statistic_code'
// column.
var sql = "ALTER TABLE hospitalization " +
    "DROP COLUMN statistic_code;";

// Clean-up the hospitalization-table by changing the optional 'origin' column
// from NOT NULL (mostly with an empty string value) to DEFAULT NULL.
var sql = "ALTER TABLE hospitalization " +
    "MODIFY COLUMN origin VARCHAR(64) DEFAULT NULL;";

// Clean-up the hospitalization-table by changing the optional VARCHAR columns
// from an empty string value to NULL i.e. medication, comment, origin,
// id_number, exit_comment, just_comment, reserved_for
var sql = "UPDATE hospitalization " +
    "SET medication = NULL WHERE medication = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET `comment` = NULL WHERE `comment` = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET origin = NULL WHERE origin = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET id_number = NULL WHERE id_number = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET exit_comment = NULL WHERE exit_comment = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET just_comment = NULL WHERE just_comment = '' AND id>=0;";
var sql = "UPDATE hospitalization " +
    "SET reserved_for = NULL WHERE reserved_for = '' AND id>=0;";

// The introduced sex distribution requires a 'male_quantity' and a
// 'female_quantity' i.s.o. the simple 'sex' indicator. Note that
// 'unspecified_sex_quantity' is not needed as it equals:
// 'quantity' - 'male_quantity' - 'female_quantity'.
// First create the 'male_quantity' and 'female_quantity' columns. Now copy
// the current 'quantity' to 'male_quantity', if the current 'sex' equals
// 'male' ('M') or to 'female_quantity' if the current 'sex' equals
// 'female' ('V'). Don't copy the 'quantity' if the current 'sex' is
// unspecified. And last, drop the superfluous 'sex' column.
var sql = "ALTER TABLE hospitalization " +
    "ADD COLUMN male_quantity INT(10) UNSIGNED NOT NULL DEFAULT '0', " +
    "ADD COLUMN female_quantity INT(10) UNSIGNED NOT NULL DEFAULT '0';";

var sql = "UPDATE hospitalization " +
    "SET male_quantity = quantity " +
    "WHERE sex = 'M' AND id >= 0;";

var sql = "UPDATE hospitalization " +
    "SET female_quantity = quantity " +
    "WHERE sex = 'V' AND id >= 0;";

var sql = "ALTER TABLE hospitalization " +
    "DROP COLUMN sex;";

////////////////////////////////////////////////////////////////////////////////
// Table animal
////////////////////////////////////////////////////////////////////////////////
// Add the column 'default_for_adoption' to the 'animal' table. This boolean
// indicates whether a new hospitalization of this kind of animal will (by
// default) be offered for adoption or not.
var sql = "ALTER TABLE animal " +
    "ADD COLUMN default_for_adoption TINYINT(1) NOT NULL DEFAULT '0';";

// Add the columns 'ideal_weight_general_male' and 'ideal_weight_female' to the
// 'animal' table. The column 'ideal_weight_general_male' contains the ideal
// weight in general, if no 'ideal_weight_female' is specified/available.
// Otherwise, it should be interpreted as the ideal male weight.
var sql = "ALTER TABLE animal " +
    "ADD COLUMN ideal_weight_general_male INT(10) UNSIGNED DEFAULT NULL, " +
    "ADD COLUMN ideal_weight_female INT(10) UNSIGNED DEFAULT NULL;";

// Add the column 'image' to the 'animal' table. It contains a reference to an
// image, not the binary image data.
var sql = "ALTER TABLE animal " +
    "ADD COLUMN image VARCHAR(255);";

// Add the column 'scientific_name' to the 'animal' table.
var sql = "ALTER TABLE animal " +
    "ADD COLUMN scientific_name VARCHAR(64) DEFAULT NULL;";

// TODO: Remove the field 'animal.menu_hash' + triggers !!!
// The menu_hash is a list of food-item references, which is actually a copy of
// the same info that is already contained in the menu-table.

// Add the missing unique-constraint on 'name' for the animal table. Before the
// UC can be added, resolve all conflicting animal names (duplicates) by
// appending a marker and the unique id to the name. Note that the inner select
// is for finding all id's with duplicate names. The outer select is just a
// wrapper to use a temp table, as it is not possible to apply an update and
// select on the same table in the same query.
var sql = "UPDATE animal " +
    "SET name = CONCAT(name, ' ###', id) " +
    "WHERE id>=0 AND id IN (" +
    "  SELECT id FROM (" +
    "    SELECT DISTINCT(a.id) FROM animal a, animal b " +
    "    WHERE a.name = b.name AND a.id <> b.id " +
    "  ) AS tmp" +
    ");";

// Now add the unique-constraint on 'name'.
var sql = "ALTER TABLE animal ADD CONSTRAINT uc_animal_name UNIQUE (name);";

// Add the missing foreign key 'prepare_category' to the animal
// table without ON UPDATE/DELETE, to automatically reject updates/removals of
// the referenced prepare_category records. Note that there are no conflicting
// animals; checked with:
// select * from animal WHERE food_prepare_category NOT IN (
//      SELECT prepare_category.id FROM prepare_category
// ) AND id >= 0;
// However, the FK and it's reference must be of the same type, so the
// food_prepare_category type must be changed from INT(11) to INT(10) UNSIGNED.
var sql = "ALTER TABLE animal " +
    "MODIFY food_prepare_category INT(10) UNSIGNED DEFAULT NULL, " +
    "ADD CONSTRAINT fk_animal_prepare_category " +
    "FOREIGN KEY (food_prepare_category) REFERENCES prepare_category(id);";

////////////////////////////////////////////////////////////////////////////////
// Table food
////////////////////////////////////////////////////////////////////////////////
// Add the missing foreign key 'feeding_measure' to the food table
// without ON UPDATE/DELETE, to automatically reject updates/removals of
// the referenced measure-records.
// Before the FK can be added, resolve all conflicting foods.

// Define a virtual _ERROR_ measure with id 0 to resolve all
// feeding_measure FK conflicts.
var sql = "INSERT INTO measure (name, short_name) VALUES ('_ERROR_', 'ERR');";
var sql = "UPDATE measure SET id='0' WHERE name='_ERROR_' AND id >= 0;";

// Update the feeding_measure of all conflicting foods
var sql = "UPDATE food SET feeding_measure='0' " +
    "WHERE feeding_measure NOT IN (SELECT id FROM measure) AND id >= 0;";

// Now add the foreign key 'feeding_measure'.
var sql = "ALTER TABLE food " +
    "ADD CONSTRAINT fk_food_measure " +
    "FOREIGN KEY (feeding_measure) REFERENCES measure(id);";

// Add the missing unique-constraint on 'name' for the food table. Before the
// UC can be added, resolve all conflicting names (duplicates) by appending a
// marker and the unique id to the name. Note that the inner select is for
// finding all id's with duplicate names. The outer select is just a wrapper
// to use a temp table, as it is not possible to apply an update and select on
// the same table in the same query.
var sql = "UPDATE food " +
    "SET name = CONCAT(name, ' ###', id) " +
    "WHERE id>=0 AND id IN (" +
    "  SELECT id FROM (" +
    "    SELECT DISTINCT(a.id) FROM food a, food b " +
    "    WHERE a.name = b.name AND a.id <> b.id " +
    "  ) AS tmp" +
    ");";

// Now add the unique-constraint on 'name'.
var sql = "ALTER TABLE food ADD CONSTRAINT uc_food_name UNIQUE (name);";

// Due to a new implementation, each food-item can be marked for
// leftover-logging, i.s.o. searching for certain strings in food-items.
var sql = "ALTER TABLE food " +
    "ADD COLUMN leftover_logging TINYINT(1) NOT NULL DEFAULT '0';";

// The fields display_singular and display_plural are not really used. Therefor,
// they are replaced by a new field short_name.
var sql = "ALTER TABLE food " +
    "ADD COLUMN short_name VARCHAR(16) DEFAULT NULL;";

// Preserve the value of display_singular (more widely used than display_plural)
var sql = "UPDATE food " +
    "SET short_name = display_singular " +
    "WHERE id>=0;";

// Now drop display_singular and display_plural
var sql = "ALTER TABLE food " +
    "DROP COLUMN display_singular, " +
    "DROP COLUMN display_plural;";

// Remove the superfluous definition NOT NULL from extra_quantity and
// set the default to NULL.
var sql = "ALTER TABLE food " +
    "MODIFY COLUMN extra_quantity INT(10) UNSIGNED DEFAULT NULL;";

////////////////////////////////////////////////////////////////////////////////
// Table menu
////////////////////////////////////////////////////////////////////////////////
// Add the missing foreign keys 'animal' and 'food' to the menu table.
// The FK 'animal' with ON UPDATE/DELETE, to automatically update/remove a
// record when updating/removing a referenced animal-record.
// The FK 'food' without ON UPDATE/DELETE, to automatically reject
// updates/removals of the referenced food-records.
// Before the FK's can be added, resolve all conflicting menus.

// A virtual _ERROR_ animal with id 1 is already defined to resolve all
// animal FK conflicts.

// Update the animal of all conflicting menus
var sql = "UPDATE menu SET animal='1' " +
    "WHERE animal NOT IN (SELECT id FROM animal) AND id >= 0;";

// Define a virtual _ERROR_ food with id 1 to resolve all
// food FK conflicts (using the _ERROR_ feeding_measure).
var sql = "INSERT INTO food (name, feeding_measure) VALUES ('_ERROR_', 0);";
var sql = "UPDATE food SET id='1' WHERE name='_ERROR_' AND id >= 0;";

// Before the food of all conflicting menus can be updated, the trigger
// 'trg_menu_af_upd' needs to be dropped (temporarily).
// TODO: When it is decided to phase-out the animal.menu_hash + triggers, this is no longer needed.
var sql = "DROP TRIGGER IF EXISTS trg_menu_af_upd;";

// Update the food of all conflicting menus
var sql = "UPDATE menu SET food='1' " +
    "WHERE food NOT IN (SELECT id FROM food) AND id >= 0;";

// Create the trigger 'trg_menu_af_upd' again.
// TODO: When it is decided to phase-out the animal.menu_hash + triggers, this is no longer needed.
var sql = "DELIMITER $$";
var sql = "CREATE TRIGGER trg_menu_af_upd AFTER UPDATE ON menu " +
    "FOR EACH ROW " +
    "BEGIN " +
    "CALL animal_define_menu_hash(old.animal); " +
    "CALL animal_define_menu_hash(new.animal); " +
    "END $$ " +
    "DELIMITER ;";

// Now add the foreign keys 'animal' and 'food'.
var sql = "ALTER TABLE menu " +
    "ADD CONSTRAINT fk_menu_animal " +
    "FOREIGN KEY (animal) REFERENCES animal(id) " +
    "ON UPDATE CASCADE ON DELETE CASCADE, " +
    "ADD CONSTRAINT fk_menu_food " +
    "FOREIGN KEY (food) REFERENCES food(id);";

// Also add a unique-constraint on 'animal' and 'food'.
// Before the UC can be added, resolve the conflicting entries of the
// _ERROR_ animal (just added above ;-). After a manual check via the web-UI,
// it seems OK to remove them.
var sql = "DELETE FROM menu WHERE animal='1' AND id >= 0;";

// Now add the unique-constraint on 'animal' and 'food'.
var sql = "ALTER TABLE menu " +
    "ADD CONSTRAINT uc_menu_animal_food UNIQUE (animal, food);";

// Redefine 'each' to unsigned integer. Note that the quotes around
// each (also a keyword) are required.
var sql = "ALTER TABLE menu " +
    "MODIFY COLUMN `each` INT(10) UNSIGNED NOT NULL;";

// Drop the unused field board
// TODO: Are the boards really needed/used !!! For now, they are disabled !!!
// var sql = "ALTER TABLE menu " +
//     "DROP COLUMN board;";
var sql = "ALTER TABLE menu " +
    "MODIFY COLUMN board INT(10) UNSIGNED DEFAULT NULL;";
////////////////////////////////////////////////////////////////////////////////
// Table measure
////////////////////////////////////////////////////////////////////////////////
// Add the missing unique-constraint on 'name' for the measure table. Before the
// UC can be added, resolve all conflicting names (duplicates) by appending a
// marker and the unique id to the name. Note that the inner select is for
// finding all id's with duplicate names. The outer select is just a wrapper
// to use a temp table, as it is not possible to apply an update and select on
// the same table in the same query.
var sql = "UPDATE measure " +
    "SET name = CONCAT(name, ' ###', id) " +
    "WHERE id>=0 AND id IN (" +
    "  SELECT id FROM (" +
    "    SELECT DISTINCT(a.id) FROM measure a, measure b " +
    "    WHERE a.name = b.name AND a.id <> b.id " +
    "  ) AS tmp" +
    ");";

// Now add the unique-constraint on 'name'.
var sql = "ALTER TABLE measure ADD CONSTRAINT uc_measure_name UNIQUE (name);";

// The fields display_singular and display_plural are not really used. Therefor,
// they are replaced by the existing field short_name. The short_name is
// redefined to be similar to food.short_name.
var sql = "ALTER TABLE measure " +
    "MODIFY COLUMN short_name VARCHAR(16) DEFAULT NULL;";

// Now drop display_singular and display_plural
var sql = "ALTER TABLE measure " +
    "DROP COLUMN display_singular, " +
    "DROP COLUMN display_plural;";

////////////////////////////////////////////////////////////////////////////////
// Table route
////////////////////////////////////////////////////////////////////////////////
// Change the color from a symbolic class-name into an RGB-value.
var sql = "ALTER TABLE route " +
    "ADD COLUMN color VARCHAR(32) DEFAULT 'rgb(0,0,0)', " +
    "DROP COLUMN color_class;";

// Add the missing unique-constraint on 'name' for the route table. Before the
// UC can be added, resolve all conflicting names (duplicates) by appending a
// marker and the unique id to the name. Note that the inner select is for
// finding all id's with duplicate names. The outer select is just a wrapper
// to use a temp table, as it is not possible to apply an update and select on
// the same table in the same query.
var sql = "UPDATE route " +
    "SET name = CONCAT(name, ' ###', id) " +
    "WHERE id>=0 AND id IN (" +
    "  SELECT id FROM (" +
    "    SELECT DISTINCT(a.id) FROM route a, route b " +
    "    WHERE a.name = b.name AND a.id <> b.id " +
    "  ) AS tmp" +
    ");";

// Now add the unique-constraint on 'name'.
var sql = "ALTER TABLE route ADD CONSTRAINT uc_route_name UNIQUE (name);";

////////////////////////////////////////////////////////////////////////////////
// Table cage
////////////////////////////////////////////////////////////////////////////////
// Add the missing unique-constraint on 'name' for the cage table. Before the
// UC can be added, resolve all conflicting names (duplicates) by appending a
// marker and the unique id to the name. Note that the inner select is for
// finding all id's with duplicate names. The outer select is just a wrapper
// to use a temp table, as it is not possible to apply an update and select on
// the same table in the same query.
var sql = "UPDATE cage " +
    "SET name = CONCAT(name, ' ###', id) " +
    "WHERE id>=0 AND id IN (" +
    "  SELECT id FROM (" +
    "    SELECT DISTINCT(a.id) FROM cage a, cage b " +
    "    WHERE a.name = b.name AND a.id <> b.id " +
    "  ) AS tmp" +
    ");";

// Now add the unique-constraint on 'name'.
var sql = "ALTER TABLE cage ADD CONSTRAINT uc_cage_name UNIQUE (name);";

// Redefine 'board_position' to unsigned integer and default null.
var sql = "ALTER TABLE cage " +
    "MODIFY COLUMN board_position INT(10) UNSIGNED DEFAULT NULL;";

// Add the missing foreign key 'route' to the cage table
// without ON UPDATE/DELETE, to automatically reject updates/removals of
// the referenced route-records.
// Before the FK's can be added, resolve all conflicting menus.

// Define a virtual _ERROR_ route with id 0 to resolve all
// route FK conflicts. Note that 'board_position' is no longer mandatory.
var sql = "INSERT INTO route (name) VALUES ('_ERROR_');";
var sql = "UPDATE route SET id='0' WHERE name='_ERROR_' AND id >= 0;";

// Update the route of all conflicting cages
var sql = "UPDATE cage SET route='0' " +
    "WHERE route NOT IN (SELECT id FROM route) AND id >= 0;";

// Now add the foreign key 'route'.
var sql = "ALTER TABLE cage " +
    "ADD CONSTRAINT fk_cage_route " +
    "FOREIGN KEY (route) REFERENCES route(id);";

// Drop the unused 'current_action'
var sql = "ALTER TABLE cage " +
    "DROP COLUMN current_action;";

// Redefine the length of name (to be consistent with other tables)
var sql = "ALTER TABLE cage " +
    "MODIFY COLUMN name VARCHAR(64) NOT NULL;";

// Add 'lights_on' field to indicate whether the lights have to be on
// during the day. Also set the field for all current cages that must have
// the lights on during the day.
var sql = "ALTER TABLE cage " +
    "ADD COLUMN lights_on TINYINT(1) NOT NULL DEFAULT '0';";

var sql = "UPDATE cage SET lights_on=1 " +
    "WHERE id>=0 AND " +
    "name IN ('G 1', 'G 2', 'G 3', 'G 4', 'G 5', 'G 6', " +
    "'B 1', 'B 2', 'B 3', 'B 4');";

// Add 'to_clean' field to indicate whether the cage needs to be cleaned.
var sql = "ALTER TABLE cage " +
    "ADD COLUMN to_clean TINYINT(1) NOT NULL DEFAULT '0';";

////////////////////////////////////////////////////////////////////////////////
// Table entrance_reason
////////////////////////////////////////////////////////////////////////////////
// Create a new table for entrance reasons
var sql = "CREATE TABLE entrance_reason (" +
    "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, " +
    "name VARCHAR(64) NOT NULL, " +
    "standard TINYINT(1) NOT NULL DEFAULT '0', " +
    "use_allowed TINYINT(1) NOT NULL DEFAULT '0', " +
    "PRIMARY KEY (id), " +
    "CONSTRAINT uc_entrance_reason_name UNIQUE (name));";

// Insert the standard entrance reasons
var sql = "INSERT INTO entrance_reason (name, standard, use_allowed) VALUES " +
    "('Hoogspanningskabel', 1, 1), " +
    "('Afsluiting/draad', 1, 1), " +
    "('Venster', 1, 1), " +
    "('Wonde', 1, 1), " +
    "('Breuk', 1, 1), " +
    "('Verkeer', 1, 1), " +
    "('Hond', 1, 1), " +
    "('Kat', 1, 1), " +
    "('Natuurlijke predator', 1, 1), " +
    "('Schotwonde', 1, 1), " +
    "('Klemkwetsuur', 1, 1), " +
    "('Hengelsport', 1, 1), " +
    "('Ondervoeding', 1, 1), " +
    "('Uitputting', 1, 1), " +
    "('Vergiftiging', 1, 1), " +
    "('Nestjong/jong', 1, 1), " +
    "('Inbeslagname', 1, 1), " +
    "('Verwaarloosd', 1, 1), " +
    "('Vervuiling', 1, 1), " +
    "('Stookolie', 1, 1), " +
    "('Botulisme', 1, 1), " +
    "('Ziekte', 1, 1), " +
    "('Vast in schouw', 1, 1), " +
    "('Vast in loods', 1, 1), " +
    "('Prikkeldraad', 1, 1), " +
    "('Verdwaald', 1, 1), " +
    "('Ontsnapt', 1, 1), " +
    "('Afstand', 1, 1), " +
    "('Andere oorzaak', 1, 1);";

// Create a new hospitalization field 'entrance_reason' as foreign key
// without ON UPDATE/DELETE, to automatically reject updates/removals of
// the referenced entrance_reason-records.
// First create an 'Unknown' entrance_reason with id 0 for all current
// hospitalizations (marked as 'non-standard' and 'use no longer allowed').
var sql = "INSERT INTO entrance_reason (name, standard, use_allowed) " +
    "VALUES ('Onbekend', 0, 0);";
var sql = "UPDATE entrance_reason SET id='0' " +
    "WHERE name='Onbekend' AND id >= 0;";

// Now create the column and foreign key for entrance_reason in hospitalization.
var sql = "ALTER TABLE hospitalization " +
    "ADD COLUMN entrance_reason INT(10) UNSIGNED NOT NULL, " +
    "ADD CONSTRAINT fk_hospitalization_entrance_reason " +
    "FOREIGN KEY (entrance_reason) REFERENCES entrance_reason(id);";

////////////////////////////////////////////////////////////////////////////////
// Table exit_reason
////////////////////////////////////////////////////////////////////////////////
// Create a new table for exit reasons
var sql = "CREATE TABLE exit_reason (" +
    "id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, " +
    "name VARCHAR(64) NOT NULL, " +
    "standard TINYINT(1) NOT NULL DEFAULT '0', " +
    "use_allowed TINYINT(1) NOT NULL DEFAULT '0', " +
    "PRIMARY KEY (id), " +
    "CONSTRAINT uc_exit_reason_name UNIQUE (name));";

// Insert the standard exit reasons
var sql = "INSERT INTO exit_reason (name, standard, use_allowed) VALUES " +
    "('Gestorven', 1, 1), " +
    "('Geëuthanaseerd', 1, 1), " +
    "('Overgebracht', 1, 1), " +
    "('Geplaatst', 1, 1), " +
    "('Terug naar eigenaar', 1, 1), " +
    "('In vrijheid', 1, 1);";

// Insert currently used non-standard exit reasons that cannot be mapped to
// a standard reason
var sql = "INSERT INTO exit_reason (name, standard, use_allowed) VALUES " +
    "('Ontsnapt', 0, 1), " +
    "('Andere reden', 0, 1);";

// As first step for a FK relation between the hospitalization.exit_reason and
// the exit_reason table, map all existing string-based exit reasons in the
// hospitalization table to a reference in the exit_reason table.
//     "FREE" (Vrijlating)      -> "In vrijheid"
//     "ESCAPE" (Ontsnapping)   -> "Ontsnapt"
//     "DECEASE" (Overlijden)   -> "Gestorven"
//     "ADOPTED" (Herplaatsing) -> "Geplaatst"
//     "OTHER" (Iets anders)    -> "Andere reden"
var sql = "UPDATE hospitalization SET " +
    "exit_reason=(SELECT id FROM exit_reason WHERE name='In vrijheid') " +
    "WHERE id>=0 AND exit_reason='FREE';";

var sql = "UPDATE hospitalization SET " +
    "exit_reason=(SELECT id FROM exit_reason WHERE name='Ontsnapt') " +
    "WHERE id>=0 AND exit_reason='ESCAPE';";

var sql = "UPDATE hospitalization SET " +
    "exit_reason=(SELECT id FROM exit_reason WHERE name='Gestorven') " +
    "WHERE id>=0 AND exit_reason='DECEASE';";

var sql = "UPDATE hospitalization SET " +
    "exit_reason=(SELECT id FROM exit_reason WHERE name='Geplaatst') " +
    "WHERE id>=0 AND exit_reason='ADOPTED';";

var sql = "UPDATE hospitalization SET " +
    "exit_reason=(SELECT id FROM exit_reason WHERE name='Andere reden') " +
    "WHERE id>=0 AND exit_reason='OTHER';";

// Now redefine the hospitalization.exit_reason to be an integer and a FK to
// the exit_reason table, without ON UPDATE/DELETE, to automatically reject
// updates/removals of the referenced exit_reason-records.
var sql = "ALTER TABLE hospitalization " +
    "MODIFY COLUMN exit_reason INT(10) UNSIGNED DEFAULT NULL, " +
    "ADD CONSTRAINT fk_hospitalization_exit_reason " +
    "FOREIGN KEY (exit_reason) REFERENCES exit_reason(id);";

////////////////////////////////////////////////////////////////////////////////
// View group_guest and group_cage
////////////////////////////////////////////////////////////////////////////////
// Drop the unused views group_guest and group_cage
var sql = "DROP VIEW group_guest, group_cage;";

////////////////////////////////////////////////////////////////////////////////
// View group_menu FKA group_diet
////////////////////////////////////////////////////////////////////////////////
// Rename and update the view group_diet.
// Remove the unused fields food_1, food_p, measure_1, measure_p.
// Replace the more complex fields by more elementary fields, as it improves
// the debugging capabilities without paying a performance penalty i.e.
// drop the derived fields measure_name_calculated and food_name_calculated
// and add short_name for both food and measure and calculate the quantity
// without 'ceiling' it. Add some other fields just for debugging purposes.
var sql = "DROP VIEW group_diet;";
var sql = "CREATE VIEW group_menu AS " +
    "SELECT " +
    "    h.cage AS cage, " +
    "    MIN(m.id) AS order_column, " +
    "    m.board AS board, " +
    "    a.id AS animal_id, " +
    "    a.name AS animal_name, " +
    "    a.menu_hash AS menu_hash, " +
    "    f.id AS food_id, " +
    "    f.name AS food_name, " +
    "    f.short_name AS short_food_name, " +
    "    s.id AS measure_id, " +
    "    s.name AS measure_name, " +
    "    s.short_name AS short_measure_name, " +
    "    SUM(h.quantity * h.menu_percentage * m.quantity / " +
    "        IF(m.each > 0, m.each, 1) / 100) AS quantity, " +
    "    COUNT(*) AS count " +
    "FROM " +
    "    ((((hospitalization h " +
    "    JOIN menu m ON h.animal = m.animal AND h.cage > 1) " +
    "    JOIN food f ON m.food = f.id) " +
    "    JOIN animal a ON h.animal = a.id) " +
    "    JOIN measure s ON f.feeding_measure = s.id) " +
    "GROUP BY h.cage , m.food , a.menu_hash " +
    "HAVING quantity > 0;";

////////////////////////////////////////////////////////////////////////////////
// View group_prepare_daily
////////////////////////////////////////////////////////////////////////////////
// Update the view group_prepare_daily.
// Remove the unused fields display_singular, display_plural, singular, singular.
// Calculate the quantity by 'ceiling' it per cage and put extra_quantity in a
// separate field. Add COUNT(*) just for debugging purposes.
// Note that the original quantity calculation was wrong i.e. summing 'ceiled'
// values i.s.o. summing "per cage 'ceiled' values" which requires joining
// with the view group_menu. Because ceiling depends on a preference setting,
// the implementation is changed from a view to an ordinary select statement,
// so drop the view group_prepare_daily.
// @Ref: model/food2.js -> food.getDailyPrepare()

// var sql = "ALTER VIEW group_prepare_daily AS " +
//     "SELECT " +
//     "    f.name AS name, " +
//     "    f.short_name AS short_name, " +
//     "    f.feeding_measure AS feeding_measure, " +
//     "    SUM(m.quantity * h.quantity * h.menu_percentage / 100 / " +
//     "        IF(m.each > 0, m.each, 1)) AS quantity, " +
//     "    f.extra_quantity AS extra_quantity, " +
//     "    COUNT(*) AS count " +
//     "FROM " +
//     "    (((food f " +
//     "    JOIN measure s ON f.feeding_measure = s.id) " +
//     "    JOIN menu m ON f.id = m.food) " +
//     "    JOIN hospitalization h ON m.animal = h.animal AND h.cage > 1) " +
//     "WHERE f.prepare = 1 " +
//     "GROUP BY f.id " +
//     "HAVING quantity > 0 OR extra_quantity > 0;";

// var sql = "ALTER VIEW group_prepare_daily AS " +
//     "SELECT " +
//     "    f.name AS name, " +
//     "    f.short_name AS short_name, " +
//     "    f.feeding_measure AS feeding_measure, " +
//     "    d.measure_name AS measure_name, " +
//     "    d.short_measure_name AS short_measure_name, " +
//     "    f.extra_quantity AS extra_quantity, " +
//     "    SUM(ceiling(d.quantity*2)/2) AS quantity, " +
//     "    COUNT(*) AS count " +
//     "FROM " +
//     "    food f " +
//     "    JOIN group_menu d ON f.id = d.food_id " +
//     "WHERE f.prepare = 1 " +
//     "GROUP BY f.id " +
//     "HAVING quantity > 0 OR extra_quantity > 0;";

// Drop the view group_prepare_daily
var sql = "DROP VIEW group_prepare_daily;";
