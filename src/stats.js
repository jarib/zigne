function round(number, precision = 1) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function stddev(p, n, N) {
    let v = variance(p, n);

    if (N) {
        v *= 1 - N / n;
    }

    return Math.sqrt(v);
}

function variance(p, n) {
    return p * (100 - p) / n;
}

export default { stddev, variance, round };
