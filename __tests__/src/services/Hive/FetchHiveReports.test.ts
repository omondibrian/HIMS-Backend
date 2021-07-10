import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { FetchHiveReport } from "@Services/Hive/usecases/FetchHiveReports";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";

describe("FetchHiveReports - usecase", () => {
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
    Produce: 10,
    generalApiaryObservations: "nice super ,colony is nice and strong",
  };
  const newHiveDetails = new HiveDTO("HH/01", "Top Bar", "1",[report],'1');
  const hiveId = "1";
  const config = jest.fn().mockReturnValue({
    env: "development",
  });
  const repo = new MockHiveRepository();
  const usecase = new FetchHiveReport(repo, config);
  it("should successfully fetch hive details", async () => {
    const mockFetch = jest
      .spyOn(repo, "GetHiveDetails")
      .mockResolvedValue(newHiveDetails);
    const result = await usecase.get(hiveId);
    expect(result).toBeDefined();
    expect(result).toStrictEqual<ResultPayload<HiveDTO>>(
      new ResultPayload<HiveDTO>(newHiveDetails, 200)
    );
    mockFetch.mockClear()
  });

  it("should return resultPayload with an error incase of an exception", async () => {
    const mockFetch = jest.spyOn(repo, "GetHiveDetails").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env:'development'})
    const result = await usecase.get(hiveId);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(result?.getError()?.message).toBe("testing for Exceptions");
    expect(result).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockFetch.mockClear();
  });

  it("should return resultPayload with an error incase of an exception - in ProductionMode", async () => {
    const mockFetch = jest.spyOn(repo, "GetHiveDetails").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env:'production'})
    const result = await usecase.get(hiveId);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while fetching hive details"),
      500
    );
    expect(result?.getError()?.message).toBe("error while fetching hive details");
    expect(result).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockFetch.mockClear();
  });
});