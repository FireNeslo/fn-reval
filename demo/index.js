import value, { merge } from '../index.js'

function interval(ms, current) {
  const target = value()
  setInterval(() => target(current), ms)
  return target
}

const flattened = merge([ value('hello'), value('world') ])
  .map(value => value.join(' '))
  .flatMap(value => interval(1000, value))
  .startWith("test")
  .filter(msg => msg !== 'test')
  .changed()

flattened(value => {
  console.log(value)
})
