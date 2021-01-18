
export const getInfoFromKey = (myfolder, key) => {
  const keys = key.split('-').map(key => parseInt(key))

  if (key !== '' && keys.length > 0 && myfolder) {
    let current = myfolder
    let parent = null

    for (let i = 1; i < keys.length; i++) {
      const {
        folders, component_type, data, style,
      } = current
      const index = keys[i]

      parent = current

      if (folders && folders[index]) current = folders[index]
    }

    const firstChild = current && current.folders && current.folders.length ? current.folders[0] : null

    return {
      node: current,
      parent,
      isComponent: !current.folders,
      isFolder: !!current.folders,
      hasChild: !!(current.folders && current.folders.length),
      hasComponent: !!(firstChild && !firstChild.folders),
      hasFolders: !!(firstChild && firstChild.folders),
    }
  }

  return null
}

export const isAddFolderEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (!keyInfo.isFolder || keyInfo.hasComponent) return false

  return true
}

export const isAddComponentEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node || !keyInfo.parent) return false
  if (keyInfo.isFolder && !keyInfo.hasChild) return true

  return false
}

export const addComponentToFolder = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.parent) return false
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.push(comp)

  return true
}

export const updateComponent = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isComponent) return false
  keyInfo.node.style = comp.style
  keyInfo.node.component_type = comp.component_type

  return true
}

export const addFolderToFolder = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return false
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.push(folder)

  return true
}

export const isDeleteEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node || !keyInfo.parent) return false

  return true
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

export const changeName = (keyInfo, newName) => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.node.name == newName) return false
  keyInfo.node.name = newName

  return true
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
