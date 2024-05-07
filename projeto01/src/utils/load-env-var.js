import fs from 'node:fs/promises'

const envPath = new URL('../../.env', import.meta.url)

if (envPath) {

  await fs.readFile(envPath, 'utf8')
    .then(data => {
      data
        .split('\n')
        .map((item) => {
          return item.split('=')
        })
        .forEach(([key, value]) => {
          process.env[key] = value
        })
    });
} else {
  console.error('Arquivo .env não encontrado!');
}
