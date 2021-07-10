import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { CreateHive } from "@HIHM/src/services/Hive/usecases/CreateHive";

describe("CreateHive - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({env:'development'})
  const usecase = new CreateHive(repo,config);
  const userId = "1";
  const newApiary = new ApiaryDto("GrandApiary", userId);
  const newHive = new HiveDTO("HH/01", "Top Bar", newApiary._id + "");
  it("should successfully create a new Hive", async () => {
    const mockCreate = jest
      .spyOn(repo, "createHive")
      .mockImplementation((a) =>
        Promise.resolve({ ...a, Hive_id: "1", Apiary_id: "1" } as HiveDTO)
      );
    const hive = (await usecase.add(newHive)) as ResultPayload<HiveDTO>;
    expect(hive).toBeDefined();
    expect(hive?.getPayload()?.Hive_id).toBeDefined();
    expect(hive?.getPayload()?.Name).toEqual(newHive.Name);
    expect(hive?.getPayload()?.Type).toEqual(newHive.Type);
    expect(hive?.getPayload()?.Apiary_id).toEqual("1");
    mockCreate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockCreate = jest.spyOn(repo, "createHive").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env:'development'})
    const hive = await usecase.add(newHive);
    expect(hive).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(hive?.getError()?.message).toBe("testing for Exceptions");
    expect(hive).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockCreate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockCreate = jest.spyOn(repo, "createHive").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env:'production'})
    const hive = await usecase.add(newHive);
    expect(hive).toBeDefined();


    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while creating Hive"),
      500
    );
    expect(hive?.getError()?.message).toBe("error while creating Hive");
    expect(hive).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockCreate.mockClear();
  });
});
