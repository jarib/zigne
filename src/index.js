import Series, { Item } from './Series';

module.exports = {
    series: opts => new Series(opts),
    item: opts => new Item(opts),
};
