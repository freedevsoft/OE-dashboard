
import objectAssignDeep from 'object-assign-deep'

export const getInfoFromKey = (myfolder, key) => {
  const keys = key.split('-').map(key => parseInt(key))

  if (key !== '' && keys.length > 0 && myfolder) {
    let current = myfolder
    let parent = null

    for (let i = 1; i < keys.length; i++) {
      const { children } = current
      const index = keys[i]

      parent = current

      if (children) current = children[index]
    }

    const hasChildren = current && current.children && current.children.length

    return {
      node: current,
      parent,
      isRoot: current && !parent,
      isRow: current && current.type == 'row',
      isCol: current && current.type == 'col',
      isComponent: current && current.type == 'component',
      hasChildren,
      deletable: current.deletable,
    }
  }

  return null
}

export const changeName = (keyInfo, newName) => {
  if (!keyInfo || !keyInfo.node) return false
  keyInfo.node.name = newName

  return true
}

export const getNodeFromKey = (myfolder, key) => {
  const keyInfo = getInfoFromKey(myfolder, key)
  if (!keyInfo || !keyInfo.node) return null

  return keyInfo.node
}

export const isAddComponentEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.isCol) return true

  return false
}

export const isAddRowEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.isCol) return true

  return false
}

export const isAddColEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.isRow) return true

  return false
}

export const isDeleteEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node || keyInfo.isRoot) return false
  if (keyInfo.deletable == false) return false

  return true
}

export const addChildToCol = (keyInfo, child) => {
  if (!keyInfo || !keyInfo.node) return -1
  if (!keyInfo.node.children) keyInfo.node.children = []
  keyInfo.node.children.push(child)

  return keyInfo.node.children.length - 1
}

export const deleteByKeyInfo = (keyInfo, currentKey) => {
  if (isDeleteEnabled(keyInfo) == false) {
    console.log('delete disabled')

    return null
  }
  const keys = currentKey.split('-')
  const index = parseInt(keys[keys.length - 1])
  let newIndex = index

  if (keyInfo.parent.children.length == index + 1) newIndex--

  keys[keys.length - 1] = `${newIndex}`

  // if you delete all children
  if (newIndex < 0) keys.splice(keys.length - 1, 1)

  let newKey = ''; let
    i
  for (i = 0; i < keys.length - 1; i++) newKey += `${keys[i]}-`
  newKey += `${keys[i]}`

  keyInfo.parent.children.splice(index, 1)

  return newKey
}

export const updateComponent = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isComponent || !comp) return false
  if (comp.type) keyInfo.node.type = comp.type

  const { type, ...nodeValues } = comp

  objectAssignDeep(keyInfo.node, nodeValues)

  return true
}

export const updateCol = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isCol || !comp) return false
  if (comp.ratio) keyInfo.node.ratio = comp.ratio

  return true
}

export const updateRoot = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isRoot) return false
  keyInfo.node.type = comp.type
  keyInfo.node.ratio = comp.ratio
  keyInfo.node.style = comp.style
  keyInfo.node.data = comp.data

  return true
}
