import { IncomingForm } from 'formidable';

export function parseMultipart(req) {
  return new Promise(async (resolve, reject) => {
    const form = new IncomingForm();
    const fields = {};
    const files = {};

    form.on('field', (name, value) => {
      fields[name] = value;
    });

    form.on('file', async (name, file) => {
      files[name] = file;
    });

    form.on('end', () => {
      resolve({ fields, files });
    });

    form.on('error', (err) => {
      reject(err);
    });

    form.parse(req);
  });
}
