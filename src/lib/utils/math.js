export const getRandomNumber = (limit) => (Math.floor(Math.random() * limit));
export const getNextRoundRobin = (total, current) => (Math.floor(current % total));
