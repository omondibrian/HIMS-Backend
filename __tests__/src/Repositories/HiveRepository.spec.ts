import "reflect-metadata";

import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import UserRepository from "@HIHM/src/Repositories/UserRepository";
import { HiveRepository } from "@Repositories/HiveRepository";
import User from "@HIHM/src/entities/user.entity";
import Apiary from "@HIHM/src/entities/Apiary.entity";
import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import Hive from "@HIHM/src/entities/Hive.entity";

describe("Hive Repository", () => {
  const repository = new HiveRepository();
  const testData = new UserDto(
    "jane Doe",
    "janeDoe@testEmail.com",
    "./testPath",
    "./testPath",
    "Bee Keeper",
    "testPass"
  );
  beforeAll(async () => {
    await User.query().delete().where("email", "=", testData.email);
    // await Hive.query().delete().where("email", "=", testData.email);
  });
  afterAll(async () => {
    await User.query().delete().where("email", "=", testData.email);
    await User.knex().destroy();
    await Apiary.knex().destroy()
  });
  describe("HiveRepository - createApiary", () => {
    it("should create new Apiary based on the data obtained", async () => {
      const { _id } = await new UserRepository().insert(testData);
      const newApiary = new ApiaryDto("GrandApiary", _id + "");
      const result = await repository.createApiary(newApiary);
      expect(result.name).toEqual(newApiary.name);
      expect(result.User_id).toBeDefined();
      expect(result._id).toBeDefined();
    });
  });

  describe("HiveRepository - modifyApiary", () => {
    it("should update an existing Apiary based on the data provided", async () => {
      const apiary = await Apiary.query()
        .select("*")
        .where("name ", "=", "GrandApiary");
      const result = await repository.modifyApiary(apiary[0]._id + "", {
        name: "grandApiary",
      });
      expect(result.name).toEqual("grandApiary");
      expect(result.User_id).toBeDefined();
      expect(result._id).toBeDefined();
    });
  });

  describe("HiveRepository - getApiary", () => {
    it("should retrive an existing Apiary based on the data provided", async () => {
      const owner = await User.query()
        .select("*")
        .where("email", "=", testData.email);
      const result = await repository.getApiary(owner[0]._id + "");
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toEqual("grandApiary");
      expect(result[0].User_id).toBeDefined();
      expect(result[0]._id).toBeDefined();
    });
  });

  describe("HiveRepository - fetchInspectionSites", () => {
    const inspectorData = new UserDto(
      "inspector",
      "inspector2@site.com",
      "./test2Path",
      "./test2Path",
      "Inspector",
      "testPass3"
    );
    beforeAll(async () => {
      await User.query().delete().where("email", "=", inspectorData.email);
      //create a new Inspector
      await User.query().insert(inspectorData);
    });
  
    it("should retrive an existing Apiary based on the data provided", async () => {
      const inspector = await User.query()
        .select("*")
        .where("email", "=", inspectorData.email);
      const result = await repository.fetchInspectionSites("163");
      expect(result.length).toBeGreaterThanOrEqual(0);
      
    });
  });

  describe("Hives", () => {
    describe("HiveRepository - createHive", () => {
      it("should insert new hive with the info provided ", async () => {
        const apiary = await Apiary.query()
          .select("*")
          .where("name ", "=", "grandApiary");
        const hive = new HiveDTO("BumbleBee", "TopBar", apiary[0]._id + "");
        const newHive = await repository.createHive(hive);
        console.log(newHive);
        expect(newHive).toBeDefined();
      });
    });
    describe("HiveRepository - GetHives", () => {
      it("should retrive an existing hives in an Apiary based on the data provided", async () => {
        const apiary = await Apiary.query()
          .select("*")
          .where("name ", "=", "grandApiary");
        const result = await repository.GetHives(apiary[0]._id + "");
        expect(result).toBeDefined();
      });
    });

    describe("HiveRepository - GetHiveDetails", () => {
      it("should retrive all the info related to a particular hive", async () => {
        const hiveId = await Hive.query()
          .select("*")
          .where("Name", "=", "BumbleBee");
        const hiveDetails = await repository.GetHiveDetails(hiveId[0]._id + "");
        expect(hiveDetails).toBeDefined();
        expect(hiveDetails.HiveReport?.length).toBeDefined();
      });
    });

    describe("HiveRepository - insertHiveReport", () => {
      it("should insert new Report with the info provided by the particular hive inspection", async () => {
        const hiveId = await Hive.query()
          .select("*")
          .where("Name", "=", "BumbleBee");
        const report: IHiveReport = {
          Pests: false,
          sawQueen: true,
          occupied: true,
          presenceOfQueenCells: true,
          exccessiveDroneCells: false,
          harvested: true,
          broodType: "Average",
          beePopulation: "High",
          hiveTemperament: "moderate",
          honeyStores: "High",
          InspectionDate: "678940404",
          Produce:10,
          generalApiaryObservations: "nice super ,colony is nice and strong",
        };
        const hiveReport = await repository.insertHiveReport(
          hiveId[0]._id + "",
          report
        );
        expect(hiveReport).toBeDefined();
      });
    });
    describe("HiveRepository - updateHive", () => {
      it("should update hive info based on the data provided", async () => {
        const hiveId = await Hive.query()
          .select("*")
          .where("Name", "=", "BumbleBee");
        const apiary = await Apiary.query()
          .select("*")
          .where("name ", "=", "grandApiary");
        const hive = new HiveDTO("BumbleBee", "Flow Hive", apiary[0]._id + "");
        const hiveData = await repository.updateHive(
          hiveId[0]._id + "",
          hive
        );
        expect(hiveData.Type).toEqual("Flow Hive");
      });
    });
    describe("HiveRepository - RemoveHive", () => {
      it("should delete an existing Hive based on the data provided", async () => {
        const hive = await Hive.query()
          .select("*")
          .where("Name", "=", "BumbleBee");
        const result = await repository.RemoveHive(hive[0]._id + "");
        expect(result.Name).toEqual("BumbleBee");
        expect(result.Type).toEqual("Flow Hive");
        expect(result.Apiary_id).toBeDefined();
        expect(result._id).toBeDefined();
      });
    });
  });
  describe("HiveRepository - DeleteApiary", () => {
    it("should delete an existing Apiary based on the data provided", async () => {
      const apiary = await Apiary.query()
        .select("*")
        .where("name ", "=", "grandApiary");
      const result = await repository.DeleteApiary(apiary[0]._id + "");
      expect(result.name).toEqual("grandApiary");
      expect(result.User_id).toBeDefined();
      expect(result._id).toBeDefined();
    });
  });
});
