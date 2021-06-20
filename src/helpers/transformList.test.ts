import transformList from './transformList'
import { describe, it, expect } from '@jest/globals'
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
      [
        {
          title: 'root',
          children: [
            {
              title: 'parent 1',
              children: [
                {
                  title: 'child 1',
                  children: [],
                },
                {
                  title: 'child 2',
                  children: [],
                },
              ],
            },
            {
              title: 'parent 2',
              children: [
                {
                  title: 'child 3',
                  children: [],
                },
                {
                  title: 'child 4',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    ])
  })

  it('should transform multiple lists with other items between', () => {
    expect(
      transformList(`
- root 1
  - parent 1

# test

hello world

- root 2
  - parent 2`)
    ).toEqual([
      [
        {
          title: 'root 1',
          children: [
            {
              title: 'parent 1',
              children: [],
            },
          ],
        },
      ],
      [
        {
          title: 'root 2',
          children: [
            {
              title: 'parent 2',
              children: [],
            },
          ],
        },
      ],
    ])
  })

  it('should transform multiple lists', () => {
    expect(
      transformList(`
- root 1

- root 2`)
    ).toEqual([
      [
        {
          title: 'root 1',
          children: [],
        },
      ],
      [
        {
          title: 'root 2',
          children: [],
        },
      ],
    ])
  })

  it('should transform input successfully', () => {
    expect(
      transformList(`
- hi
  -`)
    ).toEqual([
      [
        {
          title: 'hi',
          children: [],
        },
      ],
    ])
  })

  it('should return []', () => {
    expect(
      transformList(`
-`)
    ).toEqual([])
  })

  it('should transform empty content', () => {
    expect(transformList('')).toEqual([])
  })
})
