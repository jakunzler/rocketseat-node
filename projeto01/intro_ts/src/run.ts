/*
  Project to study TypeScript. This project is a simple introduction to TypeScript.
  The main goal is to understand the basic concepts of TypeScript implementing a basic function.
*/

import 'dotenv/config'

import * as readline from 'node:readline'
import { stdin as input, stdout as output } from 'node:process'

const rl = readline.createInterface({input, output})

export function hello(name: string): string {
  return `Olá, ${name}!`
}

function showMenu() {
  console.log('\n=== Menu ===')
  console.log('1 - Opção 1')
  console.log('2 - Opção 2')
  console.log('q - Sair')
  console.log('============')
}

function handleChoice(choice: string) {
  switch (choice) {
    case '1':
      console.log('Opção 1')
      break
    case '2':
      console.log('Opção 2')
      break
    case 'q':
      console.log('Saindo...')
      rl.close()
      break
    default:
      console.log('Opção inválida')
  }
}

function main() {
  showMenu()
  rl.question('Escolha uma opção: ', (answer) => {
    handleChoice(answer.trim())
    if (answer.trim() !== 'q') {
      main()
    }
  })
}

console.log(process.env.MY_VARIABLE)

console.log(hello('Mundo'))

// Create a simple loop that matches the condition of keyboard letter 'q' pressed
let i = 0
let qPressed = false
while (!qPressed) {
  console.log(i++)
  if (i > 100) {
    qPressed = true
  }
}

main()