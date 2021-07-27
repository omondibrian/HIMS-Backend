import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import { BeeKeeperMode } from "@HIHM/src/lib/middleware";
import { HiveServiceProvider } from "@HIHM/src/services/Hive";
import { Router } from "express";

const hiveRoutes = Router();
const hiveProvider = new HiveServiceProvider();

/**
 * @openapi
 * definitions:
 *  Apiary:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description: name for the new Apiary
 *       required: true
 *       example: 'TrueHives'
 * /api/v1/hive/apiary:
 *   post:
 *    description: creates a new Apiary
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/Apiary'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Apiary'
 *    responses:
 *      200:
 *       description:  sucessfully created new Apairy
 *      500:
 *       description: Error while creating Apiary
 *
 */
hiveRoutes.post("/apiary",BeeKeeperMode, async (req:any, res) => {
  const apiary = new ApiaryDto(req.body.name, req.UserId);
  const result = await hiveProvider.createApiary.add(apiary);
  res.status(result!.status).json({
    Apiary: result!.getResult().payload,
    message: result!.getResult().message,
  });
});


/**
 * @openapi
 * definitions:
 *  Inspector:
 *   type: object
 *   properties:
 *      userId:
 *       type: string
 *       description: id of the inspector
 *       required: true
 *       example: '1'
 *      apiaryId:
 *       type: string
 *       description: id of the apiary
 *       required: true
 *       example: '1'
 * /api/v1/hive/addInspector:
 *   post:
 *    description: assings an inspector to a particular apiary a.k.a inspection site
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/Inspector'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Inspector'
 *    responses:
 *      200:
 *       description:  sucessfully added new Inspector
 *      500:
 *       description: Error while adding data
 *
 */
 hiveRoutes.post("/addInspector",BeeKeeperMode, async (req:any, res) => {
  const inspector = {
    userId:req.body.userId,apiaryId:req.body.apiaryId
  }
  const result = await hiveProvider.addInspector.add(inspector);
  res.status(result!.status).json({
    Apiary: result!.getResult().payload,
    message: result!.getResult().message,
  });
});
/**
 * @openapi
 * definitions:
 *  Hive:
 *   type: object
 *   properties:
 *      name:
 *       type: string
 *       description: name for the new hive structure
 *       required: true
 *       example: 'TrueHives'
 *      Type:
 *       type: string
 *       description:  type of the hive structure
 *       required: true
 *       example: 'flow hive'
 *      apiaryId:
 *       type: string
 *       description:  type of the hive structure
 *       required: true
 *       example: 'flow hive'
 * /api/v1/hive:
 *   post:
 *    description: creates a new Hive
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/Hive'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/Hive'
 *    responses:
 *      200:
 *       description:  sucessfully created new Hive
 *      500:
 *       description: Error while creating Hive
 *
 */
hiveRoutes.post("/",BeeKeeperMode, async (req, res) => {
  const hive = new HiveDTO(req.body.name, req.body.Type, req.body.apiaryId);
  const result = await hiveProvider.createHive.add(hive);
  res.status(result!.status).json({
    Hive: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * definitions:
 *  HiveReport:
 *   type: object
 *   properties:
 *      Pests:
 *       type: boolean
 *       description: signals presence of pests in the hive structure
 *       required: true
 *       example: true
 *      sawQueen:
 *       type: boolean
 *       description: signals presence of queen in the hive structure
 *       required: true
 *       example: true
 *      occupied:
 *       type: boolean
 *       description: shows if the hive structure is currently occupied by bees
 *       required: true
 *       example: true
 *      presenceOfQueenCells:
 *       type: boolean
 *       description: signals presence of presenceOfQueenCells in the hive structure
 *       required: true
 *       example: true
 *      exccessiveDroneCells:
 *       type: boolean
 *       description: signals presence of exccessiveDroneCells in the hive structure
 *       required: true
 *       example: true
 *      harvested:
 *       type: boolean
 *       description: shows if honey was harvested in the hive structure during the current inspection report
 *       required: true
 *       example: false
 *      broodType:
 *       type: string
 *       description: hive brood Type
 *       required: true
 *       example: "Average"
 *      beePopulation:
 *       type: string
 *       description:  current bee population in the structure
 *       required: true
 *       example: "High"
 *      hiveTemperament:
 *       type: string
 *       description: hive Temper
 *       required: true
 *       example: "moderate"
 *      honeyStores:
 *       type: string
 *       description: conditions of the super in the hive structure
 *       required: true
 *       example: "moderate"
 *      InspectionDate:
 *       type: string
 *       description: date of inspection
 *       required: true
 *       example: "12/01/2021"
 *      Produce:
 *       type: string
 *       description: hive production in (Kilos) during harvest
 *       required: true
 *       example: "10"
 *      generalApiaryObservations:
 *       type: string
 *       description: visual observations of the hive structure
 *       required: true
 *       example: "nice super ,colony is nice and strong"
 * /api/v1/hive/report/{id}:
 *   post:
 *    description: creates a new HiveReport
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/HiveReport'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/HiveReport'
 *    responses:
 *      200:
 *       description:  sucessfully created new HiveReport
 *      500:
 *       description: Error while creating HiveReport
 *
 */
hiveRoutes.post("/report/:id", async (req, res) => {
  const report: IHiveReport = {
    Pests: req.body.Pests,
    sawQueen: req.body.sawQueen,
    occupied: req.body.occupied,
    presenceOfQueenCells: req.body.presenceOfQueenCells,
    exccessiveDroneCells: req.body.exccessiveDroneCells,
    harvested: req.body.harvested,
    broodType: req.body.broodType,
    beePopulation: req.body.beePopulation,
    hiveTemperament: req.body.hiveTemperament,
    honeyStores: req.body.honeyStores,
    InspectionDate: req.body.InspectionDate,
    Produce: req.body.Produce,
    generalApiaryObservations: req.body.generalApiaryObservations,
  };
  const result = await hiveProvider.createHiveReport.Generate(
    req.params.id,
    report
  );
  res.status(result!.status).json({
    Report: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/apiary/{id}:
 *   delete:
 *     description: removes an event
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: interger
 *        example: 1
 *        description: id of the apiary to be deleted
 *     responses:
 *      200:
 *       description: apiary has been successfully removed
 *      401:
 *       description: their was an error removing apiary
 */
hiveRoutes.delete("/apiary/:id",BeeKeeperMode, async (req, res) => {
  const result = await hiveProvider.deleteApiary.delete(req.params.id);
  res.status(result!.status).json({
    apiary: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/hive/reports/{id}:
 *   get:
 *     description: fetch hive reports
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: interger
 *        example: 1
 *        description: id of the hive
 *     responses:
 *      200:
 *       description:  retrival successfull
 *      500:
 *       description: error retriving hive data
 */

hiveRoutes.get("/reports/:id", async (req, res) => {
  const result = await hiveProvider.fetchHiveReport.get(req.params.id);
  res.status(result!.status).json({
    hive: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/hive/apiary:
 *   get:
 *     description: view apiary details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: interger
 *        example: 1
 *        description: id of the apiary
 *     responses:
 *      200:
 *       description:  retrival successfull
 *      500:
 *       description: error retriving apiaries
 */

hiveRoutes.get("/apiary", async (req:any, res) => {
  const result = await hiveProvider.veiwApiary.fetch(req.UserId, req.userMode);
  res.status(result!.status).json({
    apiary: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/hive/{id}:
 *   get:
 *     description: view hive details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: interger
 *        example: 1
 *        description: id of the apiary to which the hive belong to
 *     responses:
 *      200:
 *       description:  retrival successfull
 *      500:
 *       description: error retriving hives data
 */

hiveRoutes.get("/:id", async (req, res) => {
  const result = await hiveProvider.viewHives.fetch(req.params.id);
  res.status(result!.status).json({
    hives: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * /api/v1/hive/analytics/{id}:
 *   get:
 *     description: view hive stats
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: interger
 *        example: 1
 *        description: id of the hive
 *     responses:
 *      200:
 *       description:  retrival successfull
 *      500:
 *       description: error retriving hive stats
 */

hiveRoutes.get("/analytics/:id", async (req, res) => {
  const result = await hiveProvider.hiveAnalytics.fetchAnalytics(req.params.id);
  res.status(result!.status).json({
    hiveAnalytics: result!.getResult().payload,
    message: result!.getResult().message,
  });
});

/**
 * @openapi
 * definitions:
 *  update:
 *   type: object
 *   properties:
 *      id:
 *       type: string
 *       description: apiary id
 *       required: true
 *       example: '1'
 *      apiary:
 *       type: object
 *       properties:
 *          name:
 *          type: string
 *          description: name for the new Apiary
 *          required: true
 *          example: 'TrueHives'
 * /api/v1/hive/apiary:
 *   put:
 *     description: edit apiary details
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/update'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/update'
 *     responses:
 *      200:
 *       description: successfully applied the requested changes
 *      500:
 *       description: error while applying changes
 */

 hiveRoutes.put("/apiary",BeeKeeperMode, async (req:any, res) => {
    const apiary = new ApiaryDto(req.body.apiary.name, req.UserId);
    const result = await hiveProvider.modifyApiary.modify(req.body.id,apiary);
    res.status(result!.status).json({
      apiary: result!.getResult().payload,
      message: result!.getResult().message,
    });
  });

/**
 * @openapi
 * definitions:
 *  updateHive:
 *   type: object
 *   properties:
 *      id:
 *       type: string
 *       description: apiary id
 *       required: true
 *       example: '1'
 *      hive:
 *       type: object
 *       properties:
 *          name:
 *           type: string
 *           description: name for the new hive structure
 *           required: true
 *           example: 'TrueHives'
 *          Type:
 *           type: string
 *           description:  type of the hive structure
 *           required: true
 *           example: 'flow hive'
 *          apiaryId:
 *           type: string
 *           description:  type of the hive structure
 *           required: true
 *           example: 'flow hive'
 * /api/v1/hive:
 *   put:
 *     description: edit hive details
 *    parameters:
 *     - in: body
 *       name: body
 *       required: true
 *       schema:
 *        $ref: '#/definitions/updateHive'
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/definitions/updateHive'
 *     responses:
 *      200:
 *       description: successfully applied the requested changes
 *      500:
 *       description: error while applying changes
 */

 hiveRoutes.put("/",BeeKeeperMode, async (req, res) => {
    const hive = new HiveDTO(req.body.hive.name, req.body.hive.Type, req.body.hive.apiaryId);
    const result = await hiveProvider.modifyHive.modify(req.body.id,hive);
    res.status(result!.status).json({
      hive: result!.getResult().payload,
      message: result!.getResult().message,
    });
  });
export default hiveRoutes;
