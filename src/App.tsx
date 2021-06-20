import * as React from 'react'
import { schemeAccent } from 'd3-scale-chromatic'
import transformList, { Data } from './helpers/transformList'
import 'tailwindcss/tailwind.css'

const { useState, useRef } = React

interface ParentNodeProps {
  title: string
  children: React.ReactElement
  color: string
  root?: boolean
  level: string
}
function ParentNode({
  title,
  children,
  color,
  level,
  root = false,
}: ParentNodeProps) {
  return (
    <div
      className={`flex items-center ${
        root === false ? 'my-6' : 'my-10 relative'
      }`}
    >
      <div
        className={`border-solid mr-8 text-white ${
          root === true ? 'border bg-[#141f16] p-2' : `px-2`
        }`}
        style={{
          borderColor: root === false ? color : 'white',
        }}
        data-level={level}
        data-color={root === false ? color : 'white'}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
interface LeafNodeProps {
  color: string
  title: string
  level: string
}
function LeafNode({ color, title, level }: LeafNodeProps) {
  return (
    <div className="my-2">
      <div
        data-level={level}
        data-color={color}
        className="px-2 border-solid text-white inline-flex"
        style={{
          borderBottomColor: color,
        }}
      >
        {title}
      </div>
    </div>
  )
}

interface TreeProps {
  data: Data[]
  root: boolean
  color?: string
  level?: string
}

function Tree(props: TreeProps) {
  const { data, root = false, color = undefined, level } = props
  return (
    <>
      {data.map((node, index) => {
        const { title, children } = node
        return (
          <ParentNode
            root={root}
            title={title}
            color={color}
            key={index}
            level={level}
          >
            <div>
              {children.map((child, index) => {
                const c =
                  color ??
                  schemeAccent[
                    index < schemeAccent.length
                      ? index
                      : index % schemeAccent.length
                  ]
                if (child.children.length === 0)
                  return (
                    <LeafNode
                      color={c}
                      title={child.title}
                      key={index}
                      level={`${level}.${index}`}
                    />
                  )
                return (
                  <Tree
                    key={index}
                    data={[child]}
                    root={false}
                    color={c}
                    level={`${level}.${index}`}
                  />
                )
              })}
            </div>
          </ParentNode>
        )
      })}
    </>
  )
}
function isRootNode(node: Element): boolean {
  const levels = (node as HTMLElement).dataset.level.split('.')
  return levels.length === 1
}

export default function App(): React.ReactElement {
  const [userInput, setUserInput] = useState('')
  const data = React.useMemo(() => transformList(userInput), [userInput])
  const svgRef = useRef<SVGSVGElement>()

  React.useEffect(() => {
    // All relevant nodes are marked with data-level for later fetching
    const elements = document.querySelectorAll('[data-level]')
    const groups = {}

    if (svgRef.current) {
      // clean up svg first because we're redrawing from the ground up
      svgRef.current.querySelectorAll('*').forEach((n) => n.remove())

      const svgPosition = svgRef.current?.getBoundingClientRect()
      const { x: X, y: Y } = svgPosition

      elements.forEach((element) => {
        const levels = (element as HTMLElement).dataset.level.split('.')
        const color = (element as HTMLElement).dataset.color
        groups[levels.length] = (groups[levels.length] || []).concat([element])
        if (levels.length === 1) {
          // root, skip
        } else {
          const parent = groups[levels.length - 1].find(
            (parent: Element) =>
              (parent as HTMLElement).dataset.level ===
              levels.slice(0, -1).join('.')
          )
          // draw a line between element and parent
          const path = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'path'
          )
          const { left, top, width, height } = parent.getBoundingClientRect()
          const {
            left: myLeft,
            top: myTop,
            height: myHeight,
            width: myWidth,
          } = element.getBoundingClientRect()
          path.setAttributeNS(null, 'stroke', color)
          path.setAttributeNS(null, 'stroke-width', '2')
          path.setAttributeNS(null, 'fill', 'transparent')
          path.setAttributeNS(
            null,
            'd',
            `M${
              isRootNode(parent)
                ? left + width - (width > 30 ? width / 5 : width) - X
                : left + width - X
            } ${
              isRootNode(parent) ? top + height / 2 - Y : top + height - Y
            } L ${myLeft - X} ${myTop + myHeight - Y} L ${
              myLeft + myWidth - X
            } ${myTop + myHeight - Y}`
          )
          svgRef.current && svgRef.current.appendChild(path)
        }
      })
    }
  })

  return (
    <div className="p-4">
      <h1 className="text-3xl">Mindmapping</h1>
      <div className="h-4" />
      <form>
        <textarea
          id="input"
          className="border-solid border-2 border-gray-500 w-full p-1 h-[200px]"
          placeholder="Input a list in markdown syntax"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </form>
      <div className="h-10"></div>
      <div>
        {data === null || data.length === 0 ? (
          <div />
        ) : (
          <div className="bg-[#142216] p-4 relative">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="absolute left-0 top-0"
            ></svg>
            {data.map((d, index) => {
              return (
                <Tree key={index} data={d} root={true} level={`${index}`} />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
