import { AddInspector } from "@Services/Hive/usecases/addInspector";
import { UserMockRepository } from "@HIHM/__mocks__/UserRepository";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";

describe("AddInspector - usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({
    env: "development",
  });
  const usecase = new AddInspector(repo, config);
  const inspector = {
    userId: "1",
    apiaryId: "1",
  };
  it("should add an inspector to a particular inspection site", async () => {
    const result = await usecase.add(inspector);
    expect(result).toBeDefined();
  });

  it("should return resultPayload with an error incase of no  inserting ", async () => {
    const mockCreate = jest
      .spyOn(repo, "insertInspector")
      .mockResolvedValue(false);
    const result = await usecase.add(inspector);
    expect(result).toBeDefined();
    expect(result?.getPayload()?.message).toBe(
      "Error while adding user to an inspection site"
    );
    mockCreate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockCreate = jest
      .spyOn(repo, "insertInspector")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    const result = await usecase.add(inspector);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(result?.getError()?.message).toBe("testing for Exceptions");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockCreate = jest
      .spyOn(repo, "insertInspector")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    config.mockReturnValue({ env: "production" });
    const result = await usecase.add(inspector);
    expect(result).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while adding an inspector"),
      500
    );
    expect(result?.getError()?.message).toBe("error while adding an inspector");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreate.mockClear();
  });
});
