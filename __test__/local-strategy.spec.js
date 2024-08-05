import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";
import { localStrategyHandler } from "../handler/local-strategy.mjs";

jest.mock('../mongoose/schemas/user.mjs');
jest.mock('../utils/helpers.mjs');

const done = jest.fn();

describe('localStrategyHandler', () => {
    it('should return user not found if no user is found', async() => {
        User.findOne.mockResolvedValue(null);

        await localStrategyHandler('test', 'pass', done);
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ username: 'test' });
        expect(done).toHaveBeenCalledWith(null, false, { message: "User not found"})
    })

    it('should return Invalid credentials if password is incorrect', async() => {
        User.findOne.mockResolvedValue({ username:'test11', password:'hashedpass'});

        comparePassword.mockReturnValue(false);
        await localStrategyHandler('test', 'pass', done);
        expect(User.findOne).toHaveBeenCalledWith({username: "test"})
        expect(comparePassword).toHaveBeenCalled();
        expect(comparePassword).toHaveBeenCalledWith('pass','hashedpass');
        expect(comparePassword).toHaveReturnedWith(false);
        expect(done).toHaveBeenCalledWith(null, false, {message: "Invalid credentials"});
    })

    it('should return user details if all credentials are valid', async() => {
        User.findOne.mockResolvedValue({ username:'test1', password:'hashedpass1', displayName: "test1"});
        comparePassword.mockResolvedValue(true);

        await localStrategyHandler('test', 'passcode', done);
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({username: "test"});
        expect(comparePassword).toHaveBeenCalled();
        expect(comparePassword).toHaveBeenCalledWith('passcode', 'hashedpass1');
        expect(done).toHaveBeenCalledWith(null, { username:'test1', password:'hashedpass1', displayName: "test1"});
    })

    it('should return errors if any error occurs', async() => {
        const error = new Error('Created Test Error');
        User.findOne.mockRejectedValue(error);

        await localStrategyHandler('test', 'passcode', done);
        expect(done).toHaveBeenCalledWith(error);
    })
})