import * as fs from 'node:fs/promises';

const folderName = '../db/etl/external-file';
const csvDirectory = new URL(folderName, import.meta.url)

export async function saveMultipart(parsedInfo, res) {

  const sentFields = Object.values(parsedInfo.fields);
  const sentFile = Object.values(parsedInfo.files);

  const dir = await fs.opendir(csvDirectory);

  const existingFiles = [];

  for await (const dirent of dir)
    existingFiles.push(dirent.name);

  if (sentFields.length > 0) {
    const isExistingName = existingFiles.includes('tasks.csv');

    if (isExistingName) {
      console.log('File already exists');
      return res.writeHead(409).end();
    } else {
      await fs.writeFile('./src/db/etl/external-file/tasks.csv', sentFields[0]);
      console.log('File created');

    }
  }

  if (sentFile.length > 0) {
    const fileInfo = sentFile[0];
    const isExistingName = existingFiles.includes(fileInfo.originalFilename);

    if (isExistingName) {
      console.log('File already exists');
      await fs.unlink(fileInfo.filepath);

      return res.writeHead(409).end();

    } else {
      const fileContent = await fs.readFile(fileInfo.filepath, { encoding: 'utf8' });
      await fs.writeFile('./src/db/etl/external-file/' + fileInfo.originalFilename, fileContent);
      await fs.unlink(fileInfo.filepath)

      fileInfo.filepath = csvDirectory

      console.log('File uploaded');

    }
  }

  return null;
}
