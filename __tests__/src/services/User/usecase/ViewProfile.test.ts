import User from "@Entities/user.entity";
import { UserMockRepository } from "@HIHM/__mocks__/UserRepository";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { ViewProfile } from "@HIHM/src/services/User/usecase/ViewProfile";

describe("ViewProfile - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new ViewProfile(testRepo, config);
  const user = new UserDto(
    "testUser",
    "test@email.com",
    "./profilePic.jpg",
    "./background.jpg",
    "Bee Keeper",
    "testPass"
  );

  const userId = "1";
  it("should successfully Retrive User Profile", async () => {
    // setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "findById")
      .mockResolvedValue(user as User);

    const result = await usecase.profile(userId);

    expect(testRepo.findById).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    mockUpdate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "findById")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.profile(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "findById")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.profile(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to fetch Profile"),
      500
    );
    expect(result?.getError()?.message).toBe("Unable to fetch Profile");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });
});
