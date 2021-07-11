import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import User from "@Entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { UserMockRepository } from "@HIHM/__mocks__/UserRepository";
import { EditProfile } from "@HIHM/src/services/User/usecase/EditProfile";

class Bcrypt {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  compare() {
    return true;
  }
  hash(pass: string) {
    return `pass${pass}`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  genSalt(): any {}
}

describe("EditProfile - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const bcrypt = new Bcrypt();
  const usecase = new EditProfile(testRepo,bcrypt,config);
  const user = new UserDto(
    "testUser",
    "test@email.com",
    "./profilePic.jpg",
    "./background.jpg",
    "Bee Keeper",
    "testPass"
  );
  const newUserProfile = new UserDto(
    "testUser",
    "test@email.com",
    "./profilePic.jpg",
    "./background.jpg",
    "inspector",
    "testPass"
  );
  const userId = '1';
  it("should successfully Edit User Profile password changed", async () => {
    //setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "update")
      .mockResolvedValue(newUserProfile as User);
    const mockBcrypt = jest
      .spyOn(bcrypt, "hash")
      .mockReturnValue(user.password as string);
    const result = await usecase.update(userId,newUserProfile);

    expect(testRepo.update).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined()
    mockUpdate.mockClear();
    mockBcrypt.mockClear();
  });

  it("should successfully Edit User Profile - password not changed", async () => {
    const newUserProfile = new UserDto(
        "testUser",
        "test@email.com",
        "./profilePic.jpg",
        "./background.jpg",
        "inspector",
      );
    //setup mocks
    const mockUpdate = jest
      .spyOn(testRepo, "update")
      .mockResolvedValue(newUserProfile as User);
   
    const result = await usecase.update(userId,newUserProfile);

    expect(testRepo.update).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined()
    mockUpdate.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFindUser = jest.spyOn(testRepo, "update").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = ( await usecase.update(userId,newUserProfile)) as ResultPayload<Error>;

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
    const mockFindUser = jest.spyOn(testRepo, "update").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = ( await usecase.update(userId,newUserProfile)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to update Profile"),
      500
    );
    expect(result?.getError()?.message).toBe(
        "Unable to update Profile"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFindUser.mockClear();
  });
});
