import { parseJson } from './parse-json.js';
import { parseUrlEncoded } from './parse-url-encoded.js';
import { parseMultipart } from './parse-multipart.js';
import { saveMultipart } from '../../utils/save-multipart.js';

export async function parseBody(req, res) {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    return parseJson(req);
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return parseUrlEncoded(req);
  }

  if (contentType.includes('multipart/form-data')) {
    const parsed = await parseMultipart(req);
    await saveMultipart(parsed, res);

    return parsed
  }

  return null;
}