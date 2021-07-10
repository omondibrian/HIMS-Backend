import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import Hive from "@Entities/Hive.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";
import { ModifyHive } from "@Services/Hive/usecases/ModifyHive";

describe("ModifyHive - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({env:'development'})
  const usecase = new ModifyHive(repo,config);
  const userId = "1";
  const apiaryID = '1';
  const newlyModifiedHive = new HiveDTO("Bumblebee","TopBar",apiaryID, undefined, userId);
  it("should successfully Modify an existing hive", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateHive")
      .mockResolvedValue(newlyModifiedHive as Hive);
    const hive = (await usecase.modify(
      "1",
      newlyModifiedHive
    )) as ResultPayload<HiveDTO>;
    console.log(hive)
    expect(hive).toBeDefined();
    expect(hive?.getPayload()?.Apiary_id).toBeDefined();
    expect(hive?.getPayload()?.Hive_id).toBeDefined();
    expect(hive?.getPayload()?.Name).toEqual(newlyModifiedHive.Name);
    expect(hive?.getPayload()?.Type).toEqual(newlyModifiedHive?.Type);
    mockUpdate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateHive")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    const hive = (await usecase.modify(
      "1",
      newlyModifiedHive
    )) as unknown as ResultPayload<Error>;
    expect(hive).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(hive?.getError()?.message).toBe("testing for Exceptions");
    expect(hive).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockUpdate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockUpdate = jest
      .spyOn(repo, "updateHive")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
      config.mockReturnValue({env:'production'})
    const hive = (await usecase.modify(
      "1",
      newlyModifiedHive
    )) as unknown as ResultPayload<Error>;
    expect(hive).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while modifying data"),
      500
    );
    expect(hive?.getError()?.message).toBe("error while modifying data");
    expect(hive).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockUpdate.mockClear();
  });
});
