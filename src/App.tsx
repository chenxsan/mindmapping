import * as React from 'react'
import { schemeAccent } from 'd3-scale-chromatic'
import transformList, { Data } from './helpers/transformList'
import 'tailwindcss/tailwind.css'

const { useState } = React

interface ParentNodeProps {
  title: string
  children: React.ReactElement
  color: string
  root?: boolean
}
function ParentNode({ title, children, color, root = false }: ParentNodeProps) {
  return (
    <div className={`flex items-center ${root === false && 'my-6'}`}>
      <div
        className={`border-solid mr-8 text-white ${
          root === true ? 'border bg-[#141f16] p-2' : `border-b-4 px-2`
        }`}
        style={{
          borderColor: root === false ? color : 'white',
        }}
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
}
function LeafNode({ color, title }: LeafNodeProps) {
  return (
    <div className="my-2">
      <span
        className="px-2 border-b-4 border-solid text-white"
        style={{
          borderBottomColor: color,
        }}
      >
        {title}
      </span>
    </div>
  )
}

interface TreeProps {
  data: Data[]
  root: boolean
  color?: string
}

function Tree(props: TreeProps) {
  const { data, root = false, color = undefined } = props
  return (
    <>
      {data.map((node, index) => {
        const { title, children } = node
        return (
          <ParentNode root={root} title={title} color={color} key={index}>
            <div>
              {children.map((child, index) => {
                const c = color ?? schemeAccent[index]
                if (child.children.length === 0)
                  return <LeafNode color={c} title={child.title} />
                return (
                  <Tree key={index} data={[child]} root={false} color={c} />
                )
              })}
            </div>
          </ParentNode>
        )
      })}
    </>
  )
}
export default function App(): React.ReactElement {
  const [userInput, setUserInput] = useState('')
  const data = React.useMemo(() => transformList(userInput), [userInput])

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
          <div className="bg-[#142216] p-4">
            {/* {JSON.stringify(data, null, 2)} */}
            {data.map((d, index) => (
              <Tree key={index} data={d} root={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
