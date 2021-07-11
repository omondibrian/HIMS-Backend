import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import User from "@HIHM/src/entities/user.entity";
import { ResultPayload } from "@HIHM/src/lib/utilities/result";
import { Registration } from "@HIHM/src/services/User/usecase/Register";
import AuthServiceUtilities from "@HIHM/__mocks__/auth_service_utilities";
import { NotificationService } from "@HIHM/__mocks__/notificationService";
import { UserMockRepository } from "@HIHM/__mocks__/UserRepository";
import Joi from "joi";

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

describe("Registeruser - Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testRepo = new UserMockRepository();
  const testUtilities = new AuthServiceUtilities();
  const jwt = { sign: () => {} };
  const config = jest.fn().mockReturnValue({ env: "development" });

  const mailer = new NotificationService();
  const bcrypt = new Bcrypt();
  const usecase = new Registration(
    testRepo,
    testUtilities,
    jwt,
    bcrypt,
    mailer,
    config
  );

  const userToRegister = new UserDto(
    "testUser",
    "test@email.com",
    "./profilePic.jpg",
    "./background.jpg",
    "Bee Keeper",
    "testPass"
  );
  it("should successfully register new user", async () => {
    //setup mocks
    const mockregistrationValidation = jest.spyOn(
      testUtilities,
      "registrationValidation"
    );
    mockregistrationValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired

    const mockFindUser = jest
      .spyOn(testRepo, "find")
      .mockReturnValue(Promise.resolve(undefined));
    const mockInsert = jest
      .spyOn(testRepo, "insert")
      .mockResolvedValue(userToRegister as User);
    jest.spyOn(bcrypt, "hash");

    const result = await usecase.registeruser(userToRegister);
    expect(testUtilities.registrationValidation).toHaveBeenCalledWith(
      userToRegister
    );

    expect(testRepo.find).toHaveBeenCalledTimes(1);
    expect(testRepo.insert).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);

    expect(result).toStrictEqual<ResultPayload<{ message: string }>>(
      new ResultPayload(
        {
          message: "registration sucessfull please check your email",
        },
        200
      )
    );
    mockFindUser.mockClear();
    mockInsert.mockClear();
  });
  it("should return error message if existing email is used", async () => {
    jest.spyOn(testRepo, "find").mockResolvedValue(userToRegister as User);

    const mockValidation = jest.spyOn(testUtilities, "registrationValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    const result = (await usecase.registeruser(
      userToRegister
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual("email already exists");
    mockValidation.mockClear();
  });

  it("should return error message if user is undefined", async () => {

    const mockFindUser = jest
    .spyOn(testRepo, "find")
    .mockReturnValue(Promise.resolve(undefined));
    jest
      .spyOn(testRepo, "insert")
      .mockResolvedValue(undefined as unknown as User);

    const mockValidation = jest.spyOn(testUtilities, "registrationValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    const result = (await usecase.registeruser(
      userToRegister
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual("cannot send mail to user of undefined");
    mockValidation.mockClear();
    mockFindUser.mockClear()
  });
  it("should return error if invalid credentials are passed", async () => {
    const mockValidation = jest.spyOn(testUtilities, "registrationValidation");
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

    jest.spyOn(testRepo, "find").mockResolvedValue(userToRegister as User);
    const result = (await usecase.registeruser(
      userToRegister
    )) as ResultPayload<Error>;
    expect(result.getError()?.message).toEqual("error while testing");
    mockValidation.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    jest.spyOn(testRepo, "find").mockResolvedValue(userToRegister as User);

    const mockValidation = jest.spyOn(testUtilities, "registrationValidation");
    mockValidation.mockImplementationOnce(() => {
      return {
        value: "",
      } as Joi.ValidationResult;
    }); // replace the implementation if desired
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.registeruser(
      userToRegister
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("unable to register new user at the moment please try again"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "unable to register new user at the moment please try again"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockValidation.mockClear();
  });
});
