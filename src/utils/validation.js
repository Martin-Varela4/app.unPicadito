export const validateWithSchema = async (schema, values) => {
    try {
        const data = await schema.validate(values, { abortEarly: false });
        return { isValid: true, data, errors: {} };
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            error.inner.forEach((err) => {
                if (err.path && !errors[err.path]) {
                    errors[err.path] = err.message;
                }
            });
            return { isValid: false, data: null, errors };
        }
        throw error;
    }
};
