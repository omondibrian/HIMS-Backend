import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import Apiary from "@HIHM/src/entities/Apiary.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { ModifyApiary } from "@HIHM/src/services/Hive/usecases/ModifyApiary";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";

describe("ModifyApiary - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new ModifyApiary(repo, config);
  const userId = "1";
  const newlyModifiedApiary = new ApiaryDto("GrandApiary", userId);
  it("should successfully Modify an existing apiary", async () => {
    const mockCreate = jest
      .spyOn(repo, "modifyApiary")
      .mockResolvedValue(newlyModifiedApiary as Apiary);
    const apiary = (await usecase.modify(
      "1",
      newlyModifiedApiary
    )) as ResultPayload<ApiaryDto>;
    console.log(apiary);
    expect(apiary).toBeDefined();
    expect(apiary?.getPayload()?._id).toBeDefined();
    expect(apiary?.getPayload()?.name).toEqual(newlyModifiedApiary.name);
    expect(apiary?.getPayload()?.User_id).toEqual(newlyModifiedApiary.User_id);
    mockCreate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockCreate = jest
      .spyOn(repo, "modifyApiary")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    const apiary = (await usecase.modify(
      "1",
      newlyModifiedApiary
    )) as unknown as ResultPayload<Error>;
    expect(apiary).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(apiary?.getError()?.message).toBe("testing for Exceptions");
    expect(apiary).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockCreate = jest
      .spyOn(repo, "modifyApiary")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    config.mockReturnValue({ env: "production" });
    const apiary = (await usecase.modify(
      "1",
      newlyModifiedApiary
    )) as unknown as ResultPayload<Error>;
    expect(apiary).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while modifying data"),
      500
    );
    expect(apiary?.getError()?.message).toBe("error while modifying data");
    expect(apiary).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreate.mockClear();
  });
});
