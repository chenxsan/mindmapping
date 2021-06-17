import * as fromMarkdown from 'mdast-util-from-markdown'
import { List, Root, ListItem } from 'mdast'
export interface Data {
  title: string
  children: Data[]
}
function extractData(list: List): Data[] {
  const listItems: ListItem[] = list.children

  return listItems.map((listItem) => {
    const title = listItem.children[0]?.children[0]?.value
    const subList = listItem.children[1]
    return {
      title,
      children:
        typeof subList === 'undefined' ? [] : extractData(subList as List),
    }
  })
}
export default function transformInput(input: string): Data[][] | null {
  try {
    const output: Root = fromMarkdown(input)
    const { children } = output
    const lists = children
      .filter((t) => t.type === 'list')
      .filter((list) => {
        // validate list for its title
        return list.children[0]?.children[0]
      })
    return lists.map((list) => extractData(list as List))
  } catch (_err) {
    // invalid data
    // we don't want to show the chart
    return null
  }
}
