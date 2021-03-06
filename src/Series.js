import stats from './stats';
import schema from './schema';

// see http://www.sjsu.edu/faculty/gerstman/StatPrimer/t-table.pdf

const coefficients = {
    z95: {
        oneTailed: 1.65,
        twoTailed: 1.96,
    },
    z99: {
        oneTailed: 2.326,
        twoTailed: 2.576,
    },
};

const sampleTypes = {
    simpleRandom: 1,
    clustered: 1.2,
    quota: 1.5,
};

export class Item {
    constructor(opts) {
        const data = schema.validate(opts, schema.item);

        const sampleSize = opts.sampleSize;
        const populationSize = opts.populationSize;

        if (populationSize && populationSize < sampleSize) {
            throw new Error('population size must be greater than sample size');
        }

        const v = stats.variance(data.percentage, sampleSize, populationSize);

        const stddev = stats.stddev(
            data.percentage,
            sampleSize,
            populationSize
        );

        const z = this._getCoefficient(
            opts.confidenceLevel || 95,
            opts.test || 'twoTailed'
        );

        const moe = z * stddev;

        Object.assign(this, {
            name: opts.name,
            percentage: opts.percentage,
            count: sampleSize * (opts.percentage / 100),
            variance: v,
            stddev,
            z,
            marginOfError: moe,
            low: opts.percentage - moe,
            high: opts.percentage + moe,
            sampleSize: sampleSize,
            populationSize: populationSize,
        });
    }

    _getCoefficient(confidenceLevel, test) {
        const zdata = coefficients[`z${confidenceLevel}`];

        if (!zdata) {
            throw new Error(
                `unknown value for confidenceLevel = ${z}, expected 95 or 99`
            );
        }

        const coeff = zdata[test];

        if (!coeff) {
            throw new Error(
                `unknown test ${test}, expected oneTailed or twoTailed`
            );
        }

        return coeff;
    }

    compare(
        right,
        {
            test = 'oneTailed',
            sampleType = 'simpleRandom',
            confidenceLevel = 95,
            sameSample = false,
        } = {}
    ) {
        const left = this;
        const diff = right.percentage - left.percentage;
        const diffAbs = Math.abs(diff);

        let variance;

        if (sameSample && left.populationSize !== right.populationSize) {
            throw new Error(
                `population size of both items must be equal, got ${left.populationSize} and ${right.populationSize}`
            );
        }

        if (
            (left.populationSize && left.populationSize < left.sampleSize) ||
            (right.populationSize && right.populationSize < right.sampleSize)
        ) {
            throw new Error('population size must be greater than sample size');
        }

        if (sameSample) {
            if (left.sampleSize !== right.sampleSize) {
                throw new Error(
                    'sample size of both items must be equal when comparing same sample'
                );
            }

            if (left.percentage + right.percentage > 100) {
                throw new Error(
                    'sum of percentages from same sample cannot be greater than 100'
                );
            }

            const sampleSize = left.sampleSize;
            const populationSize = left.populationSize;

            variance = left.variance + right.variance;
            variance += (3 * (left.percentage * right.percentage)) / sampleSize;

            if (populationSize) {
                variance *= 1 - sampleSize / populationSize;
            }
        } else {
            variance = left.populationSize
                ? left.variance * (1 - left.sampleSize / left.populationSize)
                : left.variance;

            variance += right.populationSize
                ? right.variance * (1 - right.sampleSize / right.populationSize)
                : right.variance;
        }

        const stddev = Math.sqrt(variance);
        const z = this._getCoefficient(confidenceLevel, test);

        const marginOfError = z * stddev;
        const low = diff - marginOfError;
        const high = diff + marginOfError;

        return {
            items: [left, right],
            stddev: stddev,
            difference: diff,
            t: diffAbs / stddev,
            z,
            low,
            high,
            marginOfError: marginOfError,
            significant: diffAbs > Math.abs(marginOfError),
        };
    }
}

export default class Series {
    constructor(opts) {
        schema.validate(opts, schema.series);

        this.sampleSize = opts.sampleSize;
        this.items = {};
    }

    add(item) {
        item =
            item instanceof Item
                ? item
                : new Item({ ...item, sampleSize: this.sampleSize });

        if (this.items[item.name]) {
            throw new Error(`'${item.name}' was already added to this series`);
        } else {
            this.items[item.name] = item;
        }
    }

    compare(otherSeries, opts = {}) {
        const result = {};

        Object.entries(this.items).forEach(([name, left]) => {
            const right = otherSeries.items[left.name];

            if (right) {
                result[name] = left.compare(right, {
                    ...opts,
                    sameSample: false,
                });
            } else {
                result[name] = null;
            }
        });

        return result;
    }
}
