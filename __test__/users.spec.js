import { validationResult } from "express-validator";
import { getUserByIdHandler, createUserHandler } from "../handler/user.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import validator from "express-validator";
import helpers from "../utils/helpers.mjs";

jest.mock("../mongoose/schemas/user.mjs");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
  matchedData: jest.fn(() => ({
    username: "test",
    password: "password25",
    displayName: "test1",
  })),
}));

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

const req = { params: { id: "invalid-id" } };
const res = {
  status: jest.fn(() => res),
  send: jest.fn(),
  sendStatus: jest.fn(),
};

describe('get users', () => {
    it('should return a 400 if validation fails', async () => {
        validationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => [{msg:"Invalid ID"}]
        })

        await getUserByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({ msg : expect.any(Array) });
    });

    it('should return a 404  if user is not found', async() =>{

        validationResult.mockReturnValue({
            isEmpty: () => true
        })

        User.findById.mockResolvedValue(null);

        const req = {params: {id: "non-existing-id"}};
        await getUserByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({message: 'User Not Found'});
    });

    it('should return 500 if an internal error occurs', async() => {

        validationResult.mockReturnValue({
            isEmpty: () => true
        })

        jest.spyOn(User, 'findById').mockImplementation(() => Promise.reject(new Error('Internal Error')));
        await getUserByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({message : "Internal Server Error"});
    });

    it('should return 200 and user data if user is found', async() => {
        const userId = 'existing-user-id';
        const userData = { username : 'Son Goku', password: "goku28M"};

        jest.spyOn(User, 'findById').mockImplementation(()=> Promise.resolve(userData));

        const req = { params: { id: userId}};
        await getUserByIdHandler(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith(userData);
    });
})

describe("creating user", () => {
  it("should return 400 if validation fails", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid ID" }],
    });
    await createUserHandler(req, res);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ msg: expect.any(Array) });
  });

  it("should return status of 201 and create the user", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    const savedMethod = jest.spyOn(User.prototype, "save").mockReturnValueOnce({
      id: 1,
      username: "test",
      password: "password25",
      displayName: "test1",
    });
    await createUserHandler(req, res);
    expect(validator.matchedData).toHaveBeenCalled();
    expect(helpers.hashPassword).toHaveBeenCalledWith("password25");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_password25");
    expect(User).toHaveBeenCalled();
    expect(User).toHaveBeenCalledWith({
      username: "test",
      password: "hashed_password25",
      displayName: "test1",
    });
    expect(savedMethod).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({
      id: 1,
      username: "test",
      password: "password25",
      displayName: "test1",
    });
  });

  it("should return 400 if there any error while saving the user in database", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
    });

    const savedMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() =>
        Promise.reject("Failed to save user in database")
      );

    await createUserHandler(req, res);
    expect(savedMethod).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });
});
