import objectAssignDeep from 'object-assign-deep'

export const getInfoFromKey = (myfolder, key) => {
  const keys = key.split('-').map(key => parseInt(key, 10))

  if (key !== '' && keys.length > 0 && myfolder) {
    let current = myfolder
    let curRootType = null
    let parent = null

    for (let i = 1; i < keys.length; i += 1) {
      const { rootType, folders } = current
      const index = keys[i]

      parent = current

      if (rootType) {
        curRootType = rootType
      }
      if (folders && folders[index]) current = folders[index]
    }

    const hasFolders = current && current.folders && current.folders.length
    const isComponent = current && current.type === 'Component'
    const isMenu = current && current.type === 'Menu'

    return {
      node: current,
      parent,
      isTop: current && !parent,
      isRoot: current && current.type === 'Root',
      rootType: curRootType || current.rootType,
      isGroupComponent: current && current.type === 'GroupComponent',
      isSection: current && current.type === 'Section',
      isAlert: current && current.type === 'Alert',
      maybeMenuComponent: current && (isComponent || (isMenu && !hasFolders)),
      isMenu,
      isComponent,
      hasFolders,
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

export const isAddEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.isTop || keyInfo.isGroupComponent || keyInfo.isComponent) return false

  return true
}

export const isDeleteEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.isTop || keyInfo.isRoot || keyInfo.deletable === false) return false

  return true
}

export const addSectionToRoot = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return -1
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  if (keyInfo.node.folders.length > 1) {
    keyInfo.node.folders.splice(keyInfo.node.folders.length - 1, 0, folder)

    return keyInfo.node.folders.length - 2
  }

  keyInfo.node.folders.push(folder)

  return keyInfo.node.folders.length - 1

  return true
}

export const insertFolderToPosition = (keyInfo, folder, index) => {
  if (!keyInfo || !keyInfo.node) return -1
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.splice(index, 0, folder)

  return index
}

export const addFolderToFolder = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return -1
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.push(folder)

  return keyInfo.node.folders.length - 1
}

export const addGroupComponentToRoot = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return -1
  if (!keyInfo.node.folders) keyInfo.node.folders = []
  keyInfo.node.folders.push(folder)

  return keyInfo.node.folders.length - 1
}

export const addAlertToAlerts = (keyInfo, folder) => {
  if (!keyInfo || !keyInfo.node) return -1
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

export const updateMenu = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isMenu || !comp) return false
  if (comp.menuStyle) keyInfo.node.menuStyle = comp.menuStyle

  return true
}

export const updateRootAlert = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !comp) return false

  const { type, ...nodeValues } = comp

  objectAssignDeep(keyInfo.node, nodeValues)

  return true
}

export const updateAlert = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !comp) return false

  const { type, ...nodeValues } = comp

  objectAssignDeep(keyInfo.node, nodeValues)

  return true
}

export const updateGroupComponent = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isGroupComponent || !comp) return false
  // if (comp.componentType) keyInfo.node.componentType = comp.componentType
  // if (comp.showMode) keyInfo.node.showMode = comp.showMode
  // if (comp.groupName) keyInfo.node.groupName = comp.groupName
  // if (comp.menuStyle) keyInfo.node.menuStyle = comp.menuStyle
  // if (comp.style) keyInfo.node.style = comp.style
  // if (comp.layout) keyInfo.node.layout = comp.layout
  // if (comp.data) keyInfo.node.data = comp.data

  const { type, ...nodeValues } = comp

  objectAssignDeep(keyInfo.node, nodeValues)

  return true
}

export const updateMenuComponent = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.maybeMenuComponent || !comp) return false
  // if (comp.componentType) keyInfo.node.componentType = comp.componentType
  // if (comp.showMode) keyInfo.node.showMode = comp.showMode
  // if (comp.groupName) keyInfo.node.groupName = comp.groupName
  // if (comp.menuStyle) keyInfo.node.menuStyle = comp.menuStyle
  // if (comp.style) keyInfo.node.style = comp.style
  // if (comp.layout) keyInfo.node.layout = comp.layout
  // if (comp.data) keyInfo.node.data = comp.data
  const { type, ...nodeValues } = comp

  objectAssignDeep(keyInfo.node, nodeValues)

  keyInfo.node.type = 'Component'

  return true
}

export const updateRoot = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isRoot) return false
  keyInfo.node.style = comp.style
  keyInfo.node.data = comp.data

  return true
}
