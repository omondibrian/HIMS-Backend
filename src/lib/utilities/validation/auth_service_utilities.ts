/**
 * @fileOverview contains the various functions to manage the users route.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UserDto } from "@HIHM/src/DTOs/UserDTO";
import Joi from "joi";

export interface IAuthserviceUtilities {
  loginValidation(
    _entityBody: {email:string,password:string}
  ): Joi.ValidationResult;

  registrationValidation(
    _entityBody: UserDto
  ): Joi.ValidationResult;
}

export default class AuthServiceUtilities implements IAuthserviceUtilities {
  loginValidation(
    _entityBody: {email:string,password:string}
  ): Joi.ValidationResult {
    const schema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    });

    const result = schema.validate(_entityBody);
    return result;
  }
  registrationValidation(
    _entityBody: UserDto
  ): Joi.ValidationResult {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      profilePic: Joi.any(),
      BackGroundImg:Joi.string(),
      Type:Joi.string().required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
    });

    const result = schema.validate(_entityBody);
    return result;
  }
}
