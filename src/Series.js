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

export class Item {
    constructor(opts) {
        const data = schema.validate(opts, schema.item);

        const sampleSize = opts.sampleSize;

        const v = stats.variance(data.percentage, sampleSize);
        const sdev = stats.stddev(data.percentage, sampleSize);
        const moe = coefficients.z95.twoTailed * sdev;

        Object.assign(this, {
            name: opts.name,
            percentage: opts.percentage,
            count: sampleSize * (opts.percentage / 100),
            variance: v,
            stddev: sdev,
            marginOfError: moe,
            low: opts.percentage - moe,
            high: opts.percentage + moe,
            sampleSize: sampleSize,
        });
    }

    compare(right) {
        const left = this;
        const diff = right.percentage - left.percentage;

        const stddev = Math.sqrt(left.variance + right.variance);

        const marginOfError = coefficients.z95.oneTailed * stddev;
        const low = diff - marginOfError;
        const high = diff + marginOfError;

        return {
            items: [left, right],
            stddev: stddev,
            difference: diff,
            low,
            high,
            marginOfError: marginOfError,
            significant: Math.abs(diff) > Math.abs(marginOfError),
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

    compare(otherSeries) {
        const result = {};

        Object.entries(this.items).forEach(([name, left]) => {
            const right = otherSeries.items[left.name];

            if (right) {
                result[name] = left.compare(right);
            } else {
                result[name] = null;
            }
        });

        return result;
    }
}
