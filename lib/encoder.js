export const encodeUrl = (url) => Buffer.from(url).toString('base64');
export const decodeUrl = (encoded) => Buffer.from(encoded, 'base64').toString('utf-8');
