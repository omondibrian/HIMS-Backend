import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import {
  HiveAnalytics,
  IHiveAnalytics,
} from "@HIHM/src/services/Hive/usecases/HiveAnalytics";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";

describe("Hive Analytics", () => {
  const repo = new MockHiveRepository();
  const usecase = new HiveAnalytics(repo);
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
  const mockData: IHiveAnalytics = {
    Name: "testHive",
    Type: "FlowHive",
    HiveReport: [report],
    Hive_id: "1",
    Apiary_id: "1",
    Data: ["10"], //production per harvest
    labelDescription: "Hive Yearly Honey Production ",
  };
  const ExpectedData = new ResultPayload<IHiveAnalytics>(mockData, 200);
  const hiveID = "1";

  const hiveDTO = new HiveDTO("testHive", "FlowHive", "1", [report], "1");
  it("should provide statistical data for a perticular Hive", async () => {
    const mockReport = jest
      .spyOn(repo, "GetHiveDetails")
      .mockResolvedValue(hiveDTO);
    const result = await usecase.fetchAnalytics(hiveID);
    console.log(result);
    expect(result).toBeDefined();
    expect(result).toStrictEqual<ResultPayload<IHiveAnalytics>>(ExpectedData);
    mockReport.mockClear();
  });
  it("should return an empty array incase of no reports", async () => {
    const hiveDTO = new HiveDTO("testHive", "FlowHive", "1", undefined, "1");
    const mockReport = jest
      .spyOn(repo, "GetHiveDetails")
      .mockResolvedValue(hiveDTO);
    const result = (await usecase.fetchAnalytics(
      hiveID
    )) as ResultPayload<IHiveAnalytics>;
    expect(result).toBeDefined();
    expect(result?.getPayload()?.Data?.length).toBe(0);
    const ExpectedData = new ResultPayload<IHiveAnalytics>(
      { ...mockData, Data: [], HiveReport: undefined },
      200
    );
    expect(result).toStrictEqual<ResultPayload<IHiveAnalytics>>(ExpectedData);
    mockReport.mockClear();
  });
  it("should return an error on the request payload incase of an exception", async () => {
    const mockReport = jest
      .spyOn(repo, "GetHiveDetails")
      .mockImplementationOnce(() => {
        throw new Error("Testing for Errors");
      });
    const result = await usecase.fetchAnalytics(hiveID);
    expect(result).toBeDefined();
    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Testing for Errors"),
      500
    );
    expect(result?.getError()?.message).toBe("Testing for Errors");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockReport.mockClear();
  });
});
