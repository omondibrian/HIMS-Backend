/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const TableNames = {
  user: "User",
  Apiary: "Apiary",
  Hive: "Hive",
  Hive_Report: "Hive_Report",
  Ispection_Sites: "Ispection_Sites",
};

export default TableNames;

export const orderedTables = [
 TableNames.Ispection_Sites,
 TableNames.Hive_Report,
 TableNames.Hive,
 TableNames.Apiary,
 TableNames.user
];
