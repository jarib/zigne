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

        const v = stats.variance(data.percentage, sampleSize);
        const stddev = stats.stddev(data.percentage, sampleSize);

        const z = this._getCoefficient(opts.z || 95, opts.test || 'twoTailed');
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
        });
    }

    _getCoefficient(z, test) {
        const zdata = coefficients[`z${z}`];

        if (!zdata) {
            throw new Error(`unknown z value for z = ${z}, expected 95 or 99`);
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
            z = 95,
            sameSample = false,
        } = {}
    ) {
        const left = this;
        const diff = right.percentage - left.percentage;
        const diffAbs = Math.abs(diff);

        let variance = left.variance + right.variance;

        if (sameSample) {
            if (left.sampleSize !== right.sampleSize) {
                throw new Error(
                    'sample size of both items must be equal when comparing same sample'
                );
            }

            const sampleSize = left.sampleSize;

            if (left.percentage + right.percentage > 100) {
                throw new Error(
                    'sum of percentages from same sample cannot be greater than 100'
                );
            }

            variance += (3 * (left.percentage * right.percentage)) / sampleSize;
        }

        const stddev = Math.sqrt(variance);
        const zValue = this._getCoefficient(z, test);

        const marginOfError = zValue * stddev;
        const low = diff - marginOfError;
        const high = diff + marginOfError;

        return {
            items: [left, right],
            stddev: stddev,
            difference: diff,
            t: diffAbs / stddev,
            z: zValue,
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
