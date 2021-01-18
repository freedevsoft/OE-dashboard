export const getInfoFromKey = (myfolder, key) => {
  const keys = key.split('-').map(key => parseInt(key))

  if (key !== '' && keys.length > 0 && myfolder) {
    let current = myfolder
    let parent = null

    for (let i = 1; i < keys.length; i++) {
      const { name, folders, data } = current
      const index = keys[i]

      parent = current

      if (folders && folders[index]) current = folders[index]
    }

    return {
      node: current,
      parent,
      isRoot: !!(current && !parent),
      isLeaf: !current.folders || !current.folders.length,
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

export const isAddEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false

  return true
}

export const isDeleteEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node || keyInfo.isRoot) return false
  if (keyInfo.node.deletable == false) return false

  return true
}

export const addToFolder = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return false
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.push(folder)

  return keyInfo.node.folders.length - 1
}

export const deleteByKeyInfo = (keyInfo, currentKey) => {
  if (isDeleteEnabled(keyInfo) == false) {
    console.log('delete disabled')

    return null
  }
  const keys = currentKey.split('-')
  const index = parseInt(keys[keys.length - 1])
  let newIndex = index

  if (keyInfo.parent.folders.length == index + 1) newIndex--

  keys[keys.length - 1] = `${newIndex}`

  // if you delete all folders
  if (newIndex < 0) keys.splice(keys.length - 1, 1)

  let newKey = ''; let
    i
  for (i = 0; i < keys.length - 1; i++) newKey += `${keys[i]}-`
  newKey += `${keys[i]}`

  keyInfo.parent.folders.splice(index, 1)

  return newKey
}

export const updateFolder = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !comp) return false
  if (comp.style) keyInfo.node.style = comp.style
  if (comp.data) keyInfo.node.data = comp.data
  if (comp.name) keyInfo.node.name = comp.name

  return true
}
