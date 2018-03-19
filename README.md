# zigne

Simple utilities to calculate statistical significance and confidence intervals. Made in the context of multi-party election polling where you may want to check if the difference between two population proportions are significant.

### Installation

    $ npm install zigne

or

    $ yarn add zigne

### Usage

```js
import zigne from 'zigne';

// Check if diff between two items change is significant

const itemLeft = zigne.item({ name: 'A', percentage: 25.8, sampleSize: 977 });
const itemRight = zigne.item({ name: 'A', percentage: 20.1, sampleSize: 980 });

const comparison = itemLeft.compare(itemRight);
comparison.significant; //=> true
comparison.marginOfError; //=> 3.12
comparison.difference; //=> -5.6...

// Compare two series

const seriesLeft = zigne.series({ sampleSize: 1000 });
const seriesRight = zigne.series({ sampleSize: 980 });

seriesLeft.add({ name: 'A', percentage: 25.8 });
seriesLeft.add({ name: 'B', percentage: 13.8 });
seriesLeft.add({ name: 'C', percentage: 2.2 });

seriesRight.add({ name: 'A', percentage: 29.8 });
seriesRight.add({ name: 'B', percentage: 11.8 });
seriesRight.add({ name: 'C', percentage: 1.2 });

const seriesComparison = seriesLeft.compare(seriesRight);

seriesComparison.A.significant; //=> true
seriesComparison.B.significant; //=> false
seriesComparison.C.significant; //=> true
```

### Development

    $ yarn install
    $ yarn test:watch

### Credits

* [Bernt Aardal's original Zigne](http://www.aardal.info/celius-zigne/)
