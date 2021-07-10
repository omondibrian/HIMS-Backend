import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import Apiary from "@Entities/Apiary.entity";
import { MockHiveRepository } from "@HIHM/__mocks__/HiveRepository";
import { CreateApiary } from "@Services/Hive/usecases/CreateApiary";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";

describe("CreateApiary - Usecase", () => {
  const repo = new MockHiveRepository();
  const config = jest.fn().mockReturnValue({env:'development'})
  const usecase = new CreateApiary(repo,config);
  const userId = "1";
  const newApiary = new ApiaryDto("GrandApiary", userId);
  it("should successfully create a new apiary", async () => {
    const mockCreate = jest
      .spyOn(repo, "createApiary")
      .mockImplementation((a) => Promise.resolve(a as Apiary));
    const apiary = await usecase.add(newApiary) as  ResultPayload<ApiaryDto>;
    expect(apiary).toBeDefined();
    expect(apiary?.getPayload()?._id).toBeDefined();
    expect(apiary?.getPayload()?.name).toEqual(newApiary.name);
    expect(apiary?.getPayload()?.User_id).toEqual(newApiary.User_id);
    mockCreate.mockClear();
  });
  it("should return resultPayload with an error incase of an exception", async () => {
    const mockCreate = jest
      .spyOn(repo, "createApiary")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
    const apiary = await usecase.add(newApiary);
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
      .spyOn(repo, "createApiary")
      .mockImplementation(() => {
        throw new Error("testing for Exceptions");
      });
      config.mockReturnValue({env:'production'})
    const apiary = await usecase.add(newApiary);
    expect(apiary).toBeDefined();


    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("error while creating Apiary"),
      500
    );
    expect(apiary?.getError()?.message).toBe("error while creating Apiary");
    expect(apiary).toStrictEqual<ResultPayload<Error>>(expectedSimulatedResults);
    mockCreate.mockClear();
  });
  
});
