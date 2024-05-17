import { randomUUID } from 'node:crypto'
import { Database } from '../database.js';

import * as fs from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { parse } from 'csv-parse'

const database = new Database();

const folderName = './external-file';
const csvDirectory = new URL(folderName, import.meta.url)

export async function processCsvFiles() {
  const dir = await fs.opendir(csvDirectory)
  const files = []
  for await (const dirent of dir)
    files.push(dirent.name)

  const csvFiles = files.filter(file => file.endsWith('.csv'))

  if (csvFiles.length === 0) {
    console.log('No CSV files found')
    return
  }

  for (const file of csvFiles) {
    const filePath = folderName + '/' + file
    console.log(`Processing file: ${filePath}`)

    const delimiter = await new Promise((resolve, reject) => {
      createReadStream('./src/db/etl/' + filePath, { encoding: 'utf-8' })
        .on('data', async (data) => {
          resolve(data.toString().split('\n')[0].slice('title'.length, 'title'.length + 1))
        })
        .on('error', (error) => {
          console.error(`Error processing file: ${filePath}`, error)
          reject(error)
        })
    })

    await processCsvFile(filePath, delimiter)
  }
}

function processCsvFile(filePath, delimiter) {
  return new Promise((resolve, reject) => {
    createReadStream('./src/db/etl/' + filePath, { encoding: 'utf-8' })
      .pipe(parse({ delimiter }))
      .on('data', (data) => {
        if (!data[0].includes('title')) {
          const task = {
            id: randomUUID(),
            title: data[0],
            description: data[1],
            completed_at: null,
            created_at: new Date().toISOString(),
            updated_at: null,
          }

          database.insert('tasks', task)
        }
      })
      .on('end', () => {
        // Process the CSV data as needed
        console.log(`File processed successfully: ${filePath}`,)
        fs.unlink('./src/db/etl/' + filePath)
        resolve()
      })
      .on('error', (error) => {
        console.error(`Error processing file: ${filePath}`, error)
        reject(error)
      })
  })
}

