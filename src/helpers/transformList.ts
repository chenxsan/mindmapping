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
export default function transformList(input: string): Data[][] | null {
  try {
    const output: Root = fromMarkdown(input)
    const { children } = output
    let lists: List[] = children.filter((t) => t.type === 'list') as List[]
    if (lists.length === 1 && (lists[0] as List).children.length > 1) {
      lists = (lists[0] as List).children.map((c) => ({
        ...lists[0],
        children: [c],
      }))
    }
    lists = lists.filter((list) => {
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
