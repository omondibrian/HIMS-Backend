require("module-alias/register");
import "reflect-metadata";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import UserRepository from "@Repositories/UserRepository";
import User from "@HIHM/src/entities/user.entity";
import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import Apiary from "@HIHM/src/entities/Apiary.entity";

describe("UserRepository", () => {
  const repository = new UserRepository();
  const testData = new UserDto(
    "john Doe",
    "johnDoe@testEmail.com",
    "./testPath",
    "./testPath",
    "Bee Keeper",
    "testPass"
  );
  const inspectorData = new UserDto(
    "inspector",
    "inspector@site.com",
    "./test2Path",
    "./test2Path",
    "Inspector",
    "testPass3"
  );
  beforeAll(async () => {
    await User.query().delete().where("email", "=", testData.email);
    //create a new Inspector
    await User.query().insert(inspectorData);
  });

  afterAll(async () => {
    await User.query().delete().where("name", "=", inspectorData.name);
    await User.knex().destroy();
    await Apiary.knex().destroy()
  });
  describe("UserRepository - Insert", () => {
    it("should successfully insert the new User Detail based on the specified Data", async () => {
      const result = await repository.insert(testData);
      expect(result.name).toEqual(testData.name);
      expect(result.email).toEqual(testData.email);
      expect(result.profilePic).toEqual(testData.profilePic);
      expect(result.BackGroundImg).toEqual(testData.BackGroundImg);
      expect(result.Type).toEqual(testData.Type);
      expect(result.password).toEqual(testData.password);
    });
  });
  const UpdatedData = new UserDto(
    "john1 Doe",
    "johnDoe@testEmail.com",
    "./test2Path",
    "./test2Path",
    "Bee Keeper",
    "testPass3"
  );
  describe("UserRepository - Update", () => {
    it("should successfully Update the new User details based on the specified data", async () => {
      const result = await repository.update(
        { field: "email", value: testData.email },
        UpdatedData
      );
      expect(result.name).toEqual(UpdatedData.name);
      expect(result.email).toEqual(UpdatedData.email);
      expect(result.profilePic).toEqual(UpdatedData.profilePic);
      expect(result.BackGroundImg).toEqual(UpdatedData.BackGroundImg);
      expect(result.Type).toEqual(UpdatedData.Type);
      expect(result.password).toEqual(UpdatedData.password);
    });
  });

  describe("UserRepository - find", () => {
    const data = { field: "email", value: "johnDoe@testEmail.com" };
    it("should successfully retrive  User data based on the specified parameters", async () => {
      const result = await repository.find(data);
      expect(result.name).toEqual(UpdatedData.name);
      expect(result.email).toEqual(UpdatedData.email);
      expect(result.profilePic).toEqual(UpdatedData.profilePic);
      expect(result.BackGroundImg).toEqual(UpdatedData.BackGroundImg);
      expect(result.Type).toEqual(UpdatedData.Type);
      expect(result.password).toEqual(UpdatedData.password);
    });
  });

  describe("UserRepository - findById", () => {
    const data = { field: "email", value: "johnDoe@testEmail.com" };

    it("should successfully retrive  User data based on the specified parameters", async () => {
      const { _id } = await repository.find(data);
      const result = await repository.findById(_id + "");
      expect(result.name).toEqual(UpdatedData.name);
      expect(result.email).toEqual(UpdatedData.email);
      expect(result.profilePic).toEqual(UpdatedData.profilePic);
      expect(result.BackGroundImg).toEqual(UpdatedData.BackGroundImg);
      expect(result.Type).toEqual(UpdatedData.Type);
      expect(result.password).toEqual(UpdatedData.password);
    });
  });

  describe("UserRepository - insertInspector", () => {
    it("should add an inspector to the specified Apiary", async () => {
      const inspector = await User.query()
        .select("*")
        .where("name", "=", inspectorData.name);
      const owner = await User.query()
        .select("*")
        .where("name", "=", UpdatedData.name);
      const newApiary = new ApiaryDto("TestApiary", owner[0]._id + "");
      const { _id } = await Apiary.query().insert(newApiary);
      const result = await repository.insertInspector(
        inspector[0]._id + "",
        _id + ""
      );
      expect(result).toBeTruthy();
    });
  });

  describe("UserRepository - fetchInspector", () => {
    // afterAll(async () => {
    //   await User.query().delete().where("name", "=", inspectorData.name);
    // });
    it("should fetch the requested inspector details", async () => {
      const inspector = await repository.fetchInspector(inspectorData.name);
      expect(inspector.name).toEqual(inspectorData.name);
      expect(inspector._id).toBeDefined();
    });
  });
  describe("UserRepository - removeAnInspector", () => {
    it("should remove the specified inspector based on the id", async () => {
      const inspector = await User.query()
        .select("*")
        .where("name", "=", inspectorData.name);
      const result = await repository.removeAnInspector(inspector[0]._id + "");
      expect(result.name).toEqual(inspectorData.name);
      expect(result._id).toBeDefined();
    });
  });

  describe("UserRepository - Delete", () => {
    const data = { field: "email", value: "johnDoe@testEmail.com" };

    it("should successfully Delete  User data based on the specified parameters", async () => {
      const { _id } = await repository.find(data);
      const result = await repository.Delete(_id + "");
      expect(result.name).toEqual(UpdatedData.name);
      expect(result.email).toEqual(UpdatedData.email);
      expect(result.profilePic).toEqual(UpdatedData.profilePic);
      expect(result.BackGroundImg).toEqual(UpdatedData.BackGroundImg);
      expect(result.Type).toEqual(UpdatedData.Type);
      expect(result.password).toEqual(UpdatedData.password);
    });
  });
});
