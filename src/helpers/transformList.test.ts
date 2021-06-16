import transformList from './transformList'
describe('transformList', () => {
  it('should transform list in markdown', () => {
    expect(
      transformList(`
- root
  - parent 1
    - child 1
    - child 2
  - parent 2
    - child 3
    - child 4`)
    ).toEqual([
      {
        title: 'root',
        children: [
          {
            title: 'parent 1',
            children: ['child 1', 'child 2'],
          },
          {
            title: 'parent 2',
            children: ['child 3', 'child 4'],
          },
        ],
      },
    ])
  })

  it('should transform multiple lists', () => {
    expect(
      transformList(`
- root 1
  - parent 1
- root 2
  - parent 2`)
    ).toEqual([
      {
        title: 'root 1',
        children: ['parent 1'],
      },
      {
        title: 'root 2',
        children: ['parent 2'],
      },
    ])
  })

  it('should throw when list does not exist in the beginning', () => {
    expect(() =>
      transformList(`
      # heading 1`)
    ).toThrow()
  })
})
