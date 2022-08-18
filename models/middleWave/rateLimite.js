const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiterRedis = new RateLimiterMemory({
    points: 100, // 100 points
    duration: 10,
});

module.exports = (req, res, next) => {
    const isIpLimited = req.ip;
    if (isIpLimited) {
        // Consume 1 point for each request
        rateLimiterRedis.consume(req.ip, 1)
            .then((rateLimiterRes) => {
                //console.log(rateLimiterRes)
                next();
            })
            .catch((rejRes) => {
                // All points consumed
                const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
                res.set('Retry-After', String(secs));
                res.status(429).send('Too Many Requests');
            });
    } else {
        next();
    }
}