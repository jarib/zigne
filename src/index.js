import Series, { Item } from './Series';
import stats from './stats';

export default {
    series: opts => new Series(opts),
    item: opts => new Item(opts),
    stats,
};
