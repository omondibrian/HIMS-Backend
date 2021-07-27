import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";
import { IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import HiveReport from "@HIHM/src/entities/HiveReport.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { CreateHiveReport } from "@HIHM/src/services/Hive/usecases/CreateHiveReport";

describe("CreateHiveReport - usecase", () => {
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
  const hiveId = "1";
  const config = jest.fn().mockReturnValue({
    env: "development",
  });
  const repo = new MockHiveRepository();
  const usecase = new CreateHiveReport(repo, config);
  it("should successfully create new hive report", async () => {
    const mockInsert = jest
      .spyOn(repo, "insertHiveReport")
      .mockResolvedValue(report as unknown as HiveReport);
    const result = await usecase.Generate(hiveId, report);
    expect(result).toBeDefined();
    expect(result).toStrictEqual<ResultPayload<IHiveReport>>(
      new ResultPayload<IHiveReport>(report, 200)
    );
    mockInsert.mockClear();
  });

  it("should return resultPayload with an error incase of an exception", async () => {
    const mockInsert = jest.spyOn(repo, "insertHiveReport").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env: "development"});
    const result = await usecase.Generate(hiveId, report);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(result?.getError()?.message).toBe("testing for Exceptions");
    expect(result).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockInsert.mockClear();
  });

  it("should return resultPayload with an error incase of an exception - in ProductionMode", async () => {
    const mockInsert = jest.spyOn(repo, "insertHiveReport").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env: "production"});
    const result = await usecase.Generate(hiveId, report);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while creating Report"),
      500
    );
    expect(result?.getError()?.message).toBe("error while creating Report");
    expect(result).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockInsert.mockClear();
  });

});
