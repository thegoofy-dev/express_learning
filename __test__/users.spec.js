import { validationResult } from "express-validator";
import { getUserByIdHandler } from "../handler/user.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock("../mongoose/schemas/user.mjs")

jest.mock("express-validator", () => ({
    validationResult: jest.fn(),
  }));

const req = { params: { id: "invalid-id" } };
const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
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
        expect(res.send).toHaveBeenCalledWith({ errors: expect.any(Array) });
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