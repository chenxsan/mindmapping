import * as fromMarkdown from 'mdast-util-from-markdown'
import { List, Root } from 'mdast'
interface Data {
  title: string
  children: (string | Data)[]
}
function extractData(list: List): Data[] {
  const { children: listItems } = list
  const result = listItems.map((listItem) => {
    const [paragraph, subList] = listItem.children
    const title = paragraph.children[0].value

    if (typeof subList === 'undefined') {
      // leaf node
      return title
    } else {
      return {
        title: title,
        children: extractData(subList as List),
      }
    }
  })
  return result
}
export default function transformInput(input: string): Data[] {
  const output: Root = fromMarkdown(input)
  const { children: tree } = output
  // we only handle the first list in this specific case
  const [list] = tree
  const { type } = list
  if (type !== 'list') throw new Error('List not found in the beginning')
  return extractData(list as List)
}
