import zigne from './';
import util from 'util';

const inspect = result => console.log(util.inspect(result, { depth: 5 }));

test('calculates significance of changes in a series', () => {
    const last = zigne.series({ sampleSize: 1003 });
    last.add({ name: 'A', percentage: 23.4 });
    last.add({ name: 'B', percentage: 13.1 });

    const current = zigne.series({ sampleSize: 1002 });
    current.add({ name: 'A', percentage: 25.1 });
    current.add({ name: 'B', percentage: 15.9 });

    const result = last.compare(current);

    expect(result.A.difference).toBeCloseTo(1.7);
    expect(result.A.marginOfError).toBeCloseTo(3.15, 1);
    expect(result.A.significant).toBe(false);

    expect(result.B.difference).toBeCloseTo(2.8);
    expect(result.B.marginOfError).toBeCloseTo(2.59, 1);
    expect(result.B.significant).toBe(true);
});

test('series fails if adding an invalid item', () => {
    const series = zigne.series({ sampleSize: 100 });

    expect(() => {
        series.add({ percentage: 1 });
    }).toThrow();
});

test('eøs', () => {
    const old = zigne.series({ sampleSize: 1000 });
    old.add({ name: 'eu', percentage: 55 });

    const n = zigne.series({ sampleSize: 1100 });
    n.add({ name: 'eu', percentage: 59 });

    const compared = old.compare(n);
    expect(compared.eu.marginOfError).toBeCloseTo(3.6, 1);
    expect(compared.eu.significant).toBe(true);
});

test('calculates significance of a real poll (A)', () => {
    const a = zigne.series({ sampleSize: 1000 });

    a.add({ name: 'RV', percentage: 1.8 });
    a.add({ name: 'SV', percentage: 5.9 });
    a.add({ name: 'A', percentage: 34.9 });
    a.add({ name: 'V', percentage: 3.9 });
    a.add({ name: 'KrF', percentage: 16.9 });
    a.add({ name: 'SP', percentage: 7.9 });
    a.add({ name: 'H', percentage: 13.1 });
    a.add({ name: 'FrP', percentage: 14.6 });
    a.add({ name: 'Andre', percentage: 1.0 });

    const b = zigne.series({ sampleSize: 1000 });

    b.add({ name: 'RV', percentage: 2.0 });
    b.add({ name: 'SV', percentage: 8.3 });
    b.add({ name: 'A', percentage: 30.0 });
    b.add({ name: 'V', percentage: 5.9 });
    b.add({ name: 'KrF', percentage: 13.5 });
    b.add({ name: 'SP', percentage: 8.2 });
    b.add({ name: 'H', percentage: 14.8 });
    b.add({ name: 'FrP', percentage: 16.0 });
    b.add({ name: 'Andre', percentage: 0.5 });

    const result = a.compare(b);

    expect(result.RV.difference).toBeCloseTo(0.2);
    expect(result.RV.marginOfError).toBeCloseTo(1.0, 1);
    expect(result.RV.significant).toBe(false);

    expect(result.SV.difference).toBeCloseTo(2.4);
    expect(result.SV.marginOfError).toBeCloseTo(1.89);
    expect(result.SV.significant).toBe(true);

    expect(result.A.difference).toBeCloseTo(-4.9);
    expect(result.A.marginOfError).toBeCloseTo(3.45);
    expect(result.A.significant).toBe(true);

    expect(result.V.difference).toBeCloseTo(2.0);
    expect(result.V.marginOfError).toBeCloseTo(1.59);
    expect(result.V.significant).toBe(true);

    expect(result.KrF.difference).toBeCloseTo(-3.4);
    expect(result.KrF.marginOfError).toBeCloseTo(2.64, 1);
    expect(result.KrF.significant).toBe(true);

    expect(result.SP.difference).toBeCloseTo(0.3);
    expect(result.SP.marginOfError).toBeCloseTo(2.0, 1);
    expect(result.SP.significant).toBe(false);

    expect(result.H.difference).toBeCloseTo(1.7);
    expect(result.H.marginOfError).toBeCloseTo(2.55, 1);
    expect(result.H.significant).toBe(false);

    expect(result.FrP.difference).toBeCloseTo(1.4);
    expect(result.FrP.marginOfError).toBeCloseTo(2.65, 1);
    expect(result.FrP.significant).toBe(false);

    expect(result.Andre.difference).toBeCloseTo(-0.5);
    expect(result.Andre.marginOfError).toBeCloseTo(0.6, 1);
    expect(result.Andre.significant).toBe(false);
});

test('calculates significance of a real poll (B)', () => {
    const a = zigne.series({ sampleSize: 1003 });

    a.add({ name: 'RV', percentage: 3.1 });
    a.add({ name: 'SV', percentage: 7.2 });
    a.add({ name: 'A', percentage: 23.4 });
    a.add({ name: 'V', percentage: 4.7 });
    a.add({ name: 'KrF', percentage: 4.4 });
    a.add({ name: 'SP', percentage: 11.6 });
    a.add({ name: 'H', percentage: 28.0 });
    a.add({ name: 'FrP', percentage: 13.1 });
    a.add({ name: 'MDG', percentage: 3.1 });
    a.add({ name: 'Andre', percentage: 1.4 });

    const b = zigne.series({ sampleSize: 1002 });

    b.add({ name: 'RV', percentage: 2.5 });
    b.add({ name: 'SV', percentage: 6.4 });
    b.add({ name: 'A', percentage: 25.1 });
    b.add({ name: 'V', percentage: 4.4 });
    b.add({ name: 'KrF', percentage: 3.2 });
    b.add({ name: 'SP', percentage: 10.8 });
    b.add({ name: 'H', percentage: 26.9 });
    b.add({ name: 'FrP', percentage: 15.9 });
    b.add({ name: 'MDG', percentage: 3.1 });
    b.add({ name: 'Andre', percentage: 1.7 });

    const result = a.compare(b);

    expect(result.RV.difference).toBeCloseTo(-0.6);
    expect(result.RV.marginOfError).toBeCloseTo(1.2, 1);
    expect(result.RV.significant).toBe(false);

    expect(result.SV.difference).toBeCloseTo(-0.8);
    expect(result.SV.marginOfError).toBeCloseTo(1.8, 0);
    expect(result.SV.significant).toBe(false);

    expect(result.A.difference).toBeCloseTo(1.7);
    expect(result.A.marginOfError).toBeCloseTo(3.1, 0);
    expect(result.A.significant).toBe(false);

    expect(result.V.difference).toBeCloseTo(-0.3);
    expect(result.V.marginOfError).toBeCloseTo(1.5, 1);
    expect(result.V.significant).toBe(false);

    expect(result.KrF.difference).toBeCloseTo(-1.2);
    expect(result.KrF.marginOfError).toBeCloseTo(1.4, 1);
    expect(result.KrF.significant).toBe(false);

    expect(result.SP.difference).toBeCloseTo(-0.8);
    expect(result.SP.marginOfError).toBeCloseTo(2.3, 1);
    expect(result.SP.significant).toBe(false);

    expect(result.H.difference).toBeCloseTo(-1.1);
    expect(result.H.marginOfError).toBeCloseTo(3.3, 1);
    expect(result.H.significant).toBe(false);

    expect(result.FrP.difference).toBeCloseTo(2.8);
    expect(result.FrP.marginOfError).toBeCloseTo(2.6, 1);
    expect(result.FrP.significant).toBe(true);

    expect(result.Andre.difference).toBeCloseTo(0.3);
    expect(result.Andre.marginOfError).toBeCloseTo(0.9, 1);
    expect(result.Andre.significant).toBe(false);

    // check error margins of individual items
    expect(b.items.A.marginOfError).toBeCloseTo(2.7, 1);
    expect(b.items.A.low).toBeCloseTo(22.4, 1);
    expect(b.items.A.high).toBeCloseTo(27.8, 1);

    expect(b.items.FrP.marginOfError).toBeCloseTo(2.3, 1);
    expect(b.items.FrP.low).toBeCloseTo(13.6, 1);
    expect(b.items.FrP.high).toBeCloseTo(18.2, 1);
});

test('it finds the confidence interval and error margin of a single item (confidence level = 95%)', () => {
    const item = zigne.item({
        name: 'test',
        percentage: 52.0,
        sampleSize: 1000,
    });

    expect(item.low).toBeCloseTo(48.9);
    expect(item.high).toBeCloseTo(55.1);
    expect(item.marginOfError).toBeCloseTo(3.1);
});

test('it finds the confidence interval and error margin of a single item (confidence level = 99%)', () => {
    const item = zigne.item({
        name: 'test',
        percentage: 50.0,
        sampleSize: 1000,
        confidenceLevel: 99,
    });

    expect(item.low).toBeCloseTo(45.9, 1);
    expect(item.high).toBeCloseTo(54.1, 1);
    expect(item.marginOfError).toBeCloseTo(4.1, 1);
});

test('smokers', () => {
    const a = zigne.item({ name: 'Smokers', percentage: 63, sampleSize: 150 });

    const b = zigne.item({
        name: 'Non-smokers',
        percentage: 42,
        sampleSize: 250,
    });

    expect(a.stddev).toBeCloseTo(3.94);
    expect(b.stddev).toBeCloseTo(3.12);

    const diff = a.compare(b);

    expect(diff.stddev).toBeCloseTo(5.0, 1);
});

test('it compares two values from the same sample (A)', () => {
    const sampleSize = 220;

    const Kåre = zigne.item({ name: 'Kåre', percentage: 56, sampleSize });
    const Gro = zigne.item({ name: 'Gro', percentage: 44, sampleSize });
    const diff = Kåre.compare(Gro, { sameSample: true, test: 'oneTailed' });

    expect(diff.marginOfError).toBeCloseTo(12.3, 1);
    expect(diff.significant).toBe(false);
});

test('it compares two values from the same sample (B)', () => {
    const sampleSize = 220;

    const Kåre = zigne.item({ name: 'Kåre', percentage: 58, sampleSize });
    const Gro = zigne.item({ name: 'Gro', percentage: 42, sampleSize });
    const diff = Kåre.compare(Gro, { sameSample: true, test: 'oneTailed' });

    expect(diff.marginOfError).toBeCloseTo(12.27, 1);
    expect(diff.significant).toBe(true);
});

test('adjusts for population size (same sample)', () => {
    const sampleSize = 220;
    const populationSize = 300;

    const Kåre = zigne.item({
        name: 'Kåre',
        percentage: 58,
        sampleSize,
        populationSize,
    });

    const Gro = zigne.item({
        name: 'Gro',
        percentage: 42,
        sampleSize,
        populationSize,
    });

    const diff = Kåre.compare(Gro, { sameSample: true, test: 'oneTailed' });

    expect(diff.marginOfError).toBeCloseTo(6.3, 1);
    expect(diff.significant).toBe(true);
});

test('adjusts for population size for two separate samples', () => {
    let a = zigne.item({ name: 'a', percentage: 63, sampleSize: 150 });

    let b = zigne.item({
        name: 'b',
        percentage: 42,
        sampleSize: 250,
    });

    expect(a.marginOfError).toBeCloseTo(7.7, 1);
    expect(b.marginOfError).toBeCloseTo(6.1, 1);

    let diff = a.compare(b, { test: 'twoTailed' });
    expect(diff.marginOfError).toBeCloseTo(9.9, 1);
    expect(diff.significant).toBe(true);

    a = zigne.item({
        name: 'a',
        percentage: 63,
        sampleSize: 150,
        populationSize: 300,
    });

    b = zigne.item({
        name: 'b',
        percentage: 42,
        sampleSize: 250,
        populationSize: 300,
    });

    expect(a.marginOfError).toBeCloseTo(5.5, 1);
    expect(b.marginOfError).toBeCloseTo(2.5, 1);

    diff = a.compare(b, { test: 'twoTailed' });
    expect(diff.marginOfError).toBeCloseTo(6.0, 1);
});
