import Hive from "@Entities/Hive.entity";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";
import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { HiveDTO } from "@HIHM/src/DTOs/HiveDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { ViewHives } from "@Services/Hive/usecases/ViewHives";

describe("ViewHives - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({env: "development"});
  const usecase = new ViewHives(repo, config);
  const userId = "1";
  const apiaryId = "1";
  const newApiary = new ApiaryDto("GrandApiary", userId);
  const newHive = new HiveDTO("HH/01", "Top Bar", newApiary._id + "");
  it("should successfully retrive all hive data for a specific apairy", async () => {
    const mockView = jest
      .spyOn(repo, "GetHives")
      .mockResolvedValue([newHive] as Hive[]);
    const hives = (await usecase.fetch(apiaryId)) as ResultPayload<HiveDTO[]>;
    expect(hives.getPayload()?.length).toBeGreaterThan(0);
    mockView.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockView = jest.spyOn(repo, "GetHives").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    const hives = await usecase.fetch(apiaryId);
    expect(hives).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("testing for Exceptions"),
      500
    );
    expect(hives?.getError()?.message).toBe("testing for Exceptions");
    expect(hives).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockView.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockView = jest.spyOn(repo, "GetHives").mockImplementation(() => {
      throw new Error("testing for Exceptions");
    });
    config.mockReturnValue({env: "production"});
    const hives = await usecase.fetch(apiaryId);
    expect(hives).toBeDefined();

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while retriving data"),
      500
    );
    expect(hives?.getError()?.message).toBe("error while retriving data");
    expect(hives).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockView.mockClear();
  });
});
