export const getInfoFromKey = (myfolder, key) => {
  const keys = key.split('-').map(key => parseInt(key))

  if (key !== '' && keys.length > 0 && myfolder) {
    let current = myfolder
    let cur_doc = null
    let parent = null

    for (let i = 1; i < keys.length; i++) {
      const { folders, ids, doc } = current
      const index = keys[i]

      parent = current

      if (doc) cur_doc = doc
      if (folders && folders[index]) current = folders[index]
      else current = ids[index]
    }

    return {
      node: current,
      parent,
      isAsset: !!current.id,
      isFolder: !current.id,
      maybeComponent: !!(parent && !current.id),
      isComponent: !!(parent && !current.id && keys.length > 2),
      isSection: !!(parent && !current.id && keys.length == 2),
      isRoot: !!(current && !parent),
      hasAssets: !!(!current.id && current.ids && current.ids.length),
      hasFolders: !!(!current.id && current.folders && current.folders.length),
      doc: cur_doc,
    }
  }

  return null
}

export const changeName = (keyInfo, newName) => {
  if (!keyInfo || !keyInfo.node) return false
  keyInfo.node.name = newName

  return true
}

export const getAssetIDFromKey = (myfolder, key) => {
  const keyInfo = getInfoFromKey(myfolder, key)

  if (!keyInfo || !keyInfo.node || !keyInfo.isAsset) return null

  return keyInfo.node.id
}

export const getDocFromKey = (myfolder, key) => {
  const keyInfo = getInfoFromKey(myfolder, key)
  if (!keyInfo || !keyInfo.node || !keyInfo.doc) return null

  return keyInfo.doc
}

export const getNodeFromKey = (myfolder, key) => {
  const keyInfo = getInfoFromKey(myfolder, key)
  if (!keyInfo || !keyInfo.node) return null

  return keyInfo.node
}

export const isAddAssetEnabled = (keyInfo, docType = null) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.doc) return false
  if (docType && (docType != keyInfo.doc.type)) return false
  if (keyInfo.isFolder && !keyInfo.hasFolders) return true

  return false
}

export const isAddFolderEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node) return false
  if (keyInfo.node.component_type) return false
  if (!keyInfo.isFolder || keyInfo.hasAssets) return false

  return true
}

export const isDeleteEnabled = keyInfo => {
  if (!keyInfo || !keyInfo.node || !keyInfo.parent) return false
  if (keyInfo.node.deletable == false) return false

  return true
}

export const addAssetToFolder = (keyInfo, asset) => {
  if (!keyInfo || !keyInfo.node) return false
  if (!keyInfo.node.ids) keyInfo.node.ids = []
  keyInfo.node.ids.push(asset)

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

export const addFolderToFolder = (keyInfo, folder) => {
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

  if (keyInfo.isAsset) {
    if (keyInfo.parent.ids.length == index + 1) newIndex--
  } else if (keyInfo.parent.folders.length == index + 1) newIndex--

  keys[keys.length - 1] = `${newIndex}`

  // if you delete all folders
  if (newIndex < 0) keys.splice(keys.length - 1, 1)

  let newKey = ''; let
    i
  for (i = 0; i < keys.length - 1; i++) newKey += `${keys[i]}-`
  newKey += `${keys[i]}`

  if (keyInfo.isAsset) keyInfo.parent.ids.splice(index, 1)
  else keyInfo.parent.folders.splice(index, 1)

  return newKey
}

export const updateComponent = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.maybeComponent || !comp) return false
  if (comp.style) keyInfo.node.style = comp.style
  if (comp.data) keyInfo.node.data = comp.data
  if (comp.component_type) keyInfo.node.component_type = comp.component_type

  return true
}

export const updateRoot = (keyInfo, comp) => {
  if (!keyInfo || !keyInfo.node || !keyInfo.isRoot) return false
  keyInfo.node.style = comp.style
  keyInfo.node.data = comp.data

  return true
}
