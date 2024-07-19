export const createUserValidationSchema = {
    username : {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username at least 5-32 charcters long"
        },
        notEmpty: {
            errorMessage: "Username must not be empty!"
        },
        isString: {
            errorMessage: "Must be String!"
        } 
    },
    displayName : {
        notEmpty: {
            errorMessage: "displayName must not be empty!"
        }
    },
    password : {
        notEmpty: {
            errorMessage: "Password should not be empty!"
        }
    }
}

export const idValidationSchema = {
    id: {
        in: ['params'],
        notEmpty: {
            errorMessage: 'Must not be Empty!',
        },
        isInt: {
            errorMessage: 'ID must be an integer',
        },
        toInt: true,
    }
};

export const filterValidationSchema = {
    filter: {
        in: ['query'],
        optional: true, // Make this optional if it's not always required
        isString: {
            errorMessage: 'Must be a string',
        },
        notEmpty: {
            errorMessage: 'Must not be empty',
        },
        isLength: {
            options: { min: 3, max: 10 },
            errorMessage: 'Must be at least 3-10 characters',
        }
    },
    value: {
        in: ['query'],
        optional: true, // Make this optional if it's not always required
        isString: {
            errorMessage: 'Must be a string',
        },
        notEmpty: {
            errorMessage: 'Must not be empty',
        }
    }
};