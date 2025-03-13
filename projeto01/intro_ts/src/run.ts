/*
  Project to study TypeScript. This project is a simple introduction to TypeScript.
  The main goal is to understand the basic concepts of TypeScript implementing a basic function.
*/

import 'dotenv/config'

export function hello(name: string): string {
  return `Olá, ${name}!`
}

console.log(process.env.MY_VARIABLE)

console.log(hello('Mundo'))
