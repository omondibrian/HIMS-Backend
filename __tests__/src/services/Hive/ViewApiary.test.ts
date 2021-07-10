import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import Apiary from "@HIHM/src/entities/Apiary.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { ViewApiary } from "@Services/Hive/usecases/ViewApiary";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";

describe("ViewApiary - Usecase", () => {
  const repo = new MockHiveRepository();
  const usecase = new ViewApiary(repo);
  const ownerId = "1";
  const ApiaryData = new ApiaryDto("GrandApiary", ownerId);
  it("should successfully retrive an existing apiary", async () => {
    const mockView = jest
      .spyOn(repo, "getApiary")
      .mockResolvedValue([ApiaryData] as [Apiary]);
    const apiary = (await usecase.fetch(ownerId)) as ResultPayload<Array<ApiaryDto>>;
    expect(apiary).toBeDefined();
    expect(apiary?.getPayload()?.length).toBeGreaterThan(0);
 
    mockView.mockClear();
  });

  it("should successfully retrive apiary info for a specified inspection sites", async () => {
    const mockView = jest
      .spyOn(repo, "fetchInspectionSites")
      .mockResolvedValue([ApiaryData]);
      const mode = true;
    const apiary = (await usecase.fetch(ownerId,mode)) as ResultPayload<Array<ApiaryDto>>;
    expect(apiary).toBeDefined();
    expect(apiary?.getPayload()?.length).toBeGreaterThan(0);
 
    mockView.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockView = jest.spyOn(repo, "getApiary").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    const apiary = (await usecase.fetch(
      ownerId
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
});
