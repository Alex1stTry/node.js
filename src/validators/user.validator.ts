import joi from "joi";

import { regexConstant } from "../const/regex";

export class UserValidator {
  private static name = joi.string().min(3).max(15).trim();
  private static age = joi.number().min(18).max(60);
  private static email = joi
    .string()
    .regex(regexConstant.EMAIL)
    .trim()
    .lowercase();
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();

  public static create = joi.object({
    name: this.name.required(),
    age: this.age.required(),
    email: this.email.required(),
    password: this.password.required(),
  });
  public static update = joi.object({
    name: this.name,
    age: this.age,
    password: this.password,
  });
}
