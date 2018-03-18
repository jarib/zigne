import Joi from 'joi';

function validate(item, schema) {
    if (!item) {
        throw new Error(`invalid argument: ${item}`);
    }

    const result = Joi.validate(item, schema);

    if (result.error) {
        throw new Error(result.error);
    }

    return item;
}

const series = Joi.object().keys({
    sampleSize: Joi.number().required(),
});

const item = Joi.object().keys({
    name: Joi.string().required(),
    percentage: Joi.number().required(),
    sampleSize: Joi.number().required(),
});

export default {
    item,
    series,

    validate,
};
