import Series, { Item } from './Series';

export default {
    series: opts => new Series(opts),
    item: opts => new Item(opts),
};
