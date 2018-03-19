function validate(item, schema) {
    if (!item) {
        throw new Error(`invalid argument: ${item}`);
    }

    const errors = [];

    Object.entries(schema).forEach(([key, type]) => {
        if (typeof item[key] !== type) {
            errors.push(`expected '${type}' for ${key}`);
        }
    });

    if (Object.keys(errors).length) {
        throw new Error(`validation failed: ${errors.join(', ')}`);
    }

    return item;
}

const series = {
    sampleSize: 'number',
};

const item = {
    name: 'string',
    percentage: 'number',
    sampleSize: 'number',
};

export default {
    item,
    series,

    validate,
};
