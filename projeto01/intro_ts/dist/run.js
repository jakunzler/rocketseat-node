import 'dotenv/config';
export function hello(name) {
    return `Olá, ${name}!`;
}
console.log(process.env.MY_VARIABLE);
console.log(hello('Mundo'));
