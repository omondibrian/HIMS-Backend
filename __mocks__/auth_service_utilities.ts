import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import Joi from "joi";
import { IAuthserviceUtilities } from "../src/lib/utilities/validation/auth_service_utilities";

class AuthServiceUtilities implements IAuthserviceUtilities {
  public loginValidation(_entityBody: { email: string; password: string; }): Joi.ValidationResult {
    throw new Error("Method not implemented.");
  }
  public registrationValidation(_entityBody: UserDto): Joi.ValidationResult {
    throw new Error("Method not implemented.");
  }

}

export default AuthServiceUtilities;
