import test from 'japa'

test.group('Japa', () => {
  test('assert hello world', (assert) => {
    assert.equal('hello world', 'hello world')
  })
})
