import AuthServiceUtilities from "@HIHM/__mocks__/auth_service_utilities";
import { NotificationService } from "@HIHM/__mocks__/notificationService";
import { UserMockRepository } from "@HIHM/__mocks__/UserRepository";
import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import User from "@HIHM/src/entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { LogIn } from "@Services/User/usecase/LogIn";
import Joi from "joi";

class Bcrypt {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  public compare() {
    return true;
  }
  public hash(pass: string) {
    return `pass${pass}`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public genSalt(): any {}
}

describe("Login - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const testUtilities = new AuthServiceUtilities();
  const jwt = { sign: (): string => "testToken" };
  const config = jest.fn().mockReturnValue({ env: "development" });

  const mailer = new NotificationService();
  const bcrypt = new Bcrypt();
  const usecase = new LogIn(testRepo, testUtilities, jwt, bcrypt, config);
  const user = new UserDto(
    "testUser",
    "test@email.com",
    "./profilePic.jpg",
    "./background.jpg",
    "Bee Keeper",
    "testPass"
  );
  const userCredentials = {
    password: "testPass",
    email: "testUser@email.com",
  };
  it("should successfully login new user", async () => {
    // setup mocks
    const mockLogInValidation = jest.spyOn(testUtilities, "loginValidation");
    mockLogInValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired

    const mockFindUser = jest
      .spyOn(testRepo, "find")
      .mockResolvedValue(user as User);
    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockReturnValue(true);
    const mockJwt = jest.spyOn(jwt, "sign").mockReturnValue("test token");
    const result = await usecase.login(userCredentials);
    expect(testUtilities.loginValidation).toHaveBeenCalledWith(userCredentials);

    expect(testRepo.find).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toReturnWith("test token");
    expect(result).toStrictEqual<
      ResultPayload<{ message: string; token: string }>
    >(
      new ResultPayload(
        {
          message: "login sucessfull",
          token: "test token",
        },
        200
      )
    );
    mockFindUser.mockClear();
    mockBcrypt.mockClear();
    mockJwt.mockClear();
  });
  it("should return error message if invalid credentialFormat is passed", async () => {
    const mockValidation = jest.spyOn(testUtilities, "loginValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
        error: {
          details: [
            {
              message: "error while testing",
            },
          ],
        },
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    const result = (await usecase.login(
      userCredentials
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual("error while testing");
    mockValidation.mockClear();
  });

  it("should return error message if invalid email is passed", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "find")
      .mockReturnValue(Promise.resolve(undefined));
    const mockValidation = jest.spyOn(testUtilities, "loginValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    const result = (await usecase.login(
      userCredentials
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual(
      "Error authenticating please try again !"
    );
    mockValidation.mockClear();
    mockFindUser.mockClear();
  });
  it("should return error message if invalid password is passed", async () => {
    const mockFindUser = jest
      .spyOn(testRepo, "find")
      .mockReturnValue(Promise.resolve(user as User));

    const mockBcrypt = jest.spyOn(bcrypt, "compare").mockReturnValue(false);

    const mockValidation = jest.spyOn(testUtilities, "loginValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    const result = (await usecase.login(
      userCredentials
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual(
      "Error authenticating please try again !"
    );
    mockValidation.mockClear();
    mockBcrypt.mockClear();
    mockFindUser.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockValidation = jest.spyOn(testUtilities, "loginValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired

    const mockFindUser = jest.spyOn(testRepo, "find").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.login(
      userCredentials
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockValidation.mockClear();
    mockFindUser.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockValidation = jest.spyOn(testUtilities, "loginValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired

    const mockFindUser = jest.spyOn(testRepo, "find").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.login(
      userCredentials
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("unable to login at the moment please try again"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "unable to login at the moment please try again"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockValidation.mockClear();
    mockFindUser.mockClear();
  });
});
