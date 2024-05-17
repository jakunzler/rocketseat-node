import querystring from 'querystring';

export async function parseUrlEncoded(req) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const rawBody = Buffer.concat(buffers).toString();
  return querystring.parse(rawBody);
}
