import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import Apiary from "@HIHM/src/entities/Apiary.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { DeleteApiary } from "@HIHM/src/services/Hive/usecases/DeleteApiary";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";

describe("DeleteApiary - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new DeleteApiary(repo, config);
  const apiaryID = "1";
  const ApiaryData = new ApiaryDto("GrandApiary", apiaryID);
  it("should successfully retrive an existing apiary", async () => {
    const mockView = jest
      .spyOn(repo, "DeleteApiary")
      .mockResolvedValue(ApiaryData as Apiary);
    const apiary = (await usecase.delete(apiaryID)) as ResultPayload<ApiaryDto>;
    expect(apiary).toBeDefined();
    expect(apiary?.getPayload()?.name).toEqual(ApiaryData.name);
    expect(apiary?.getPayload()?.User_id).toEqual(ApiaryData.User_id);
    mockView.mockClear();
  });

  it("should return resultPayload with an error incase of an exception", async () => {
    const mockView = jest.spyOn(repo, "DeleteApiary").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    const apiary = (await usecase.delete(
      apiaryID
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
    mockView.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockView = jest.spyOn(repo, "DeleteApiary").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({ env: "production" });
    const apiary = (await usecase.delete(
      apiaryID
    )) as unknown as ResultPayload<Error>;
    expect(apiary).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while deleting data"),
      500
    );
    expect(apiary?.getError()?.message).toBe("error while deleting data");
    expect(apiary).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockView.mockClear();
  });
});
