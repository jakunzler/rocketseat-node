import { hello } from '../src/run'

test('Hello', () => {
  expect(hello('Mundo')).toBe('Olá, Mundo!')
})
