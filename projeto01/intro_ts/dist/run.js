import 'dotenv/config';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
const rl = readline.createInterface({ input, output });
export function hello(name) {
    return `Olá, ${name}!`;
}
function showMenu() {
    console.log('\n=== Menu ===');
    console.log('1 - Opção 1');
    console.log('2 - Opção 2');
    console.log('q - Sair');
    console.log('============');
}
function handleChoice(choice) {
    switch (choice) {
        case '1':
            console.log('Opção 1');
            break;
        case '2':
            console.log('Opção 2');
            break;
        case 'q':
            console.log('Saindo...');
            rl.close();
            break;
        default:
            console.log('Opção inválida');
    }
}
function main() {
    showMenu();
    rl.question('Escolha uma opção: ', (answer) => {
        handleChoice(answer.trim());
        if (answer.trim() !== 'q') {
            main();
        }
    });
}
console.log(process.env.MY_VARIABLE);
console.log(hello('Mundo'));
let i = 0;
let qPressed = false;
while (!qPressed) {
    console.log(i++);
    if (i > 100) {
        qPressed = true;
    }
}
main();
