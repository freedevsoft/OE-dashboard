export const addToList = (list, asset, index) => {
  if (!list) list = []
  if (index > list.length) return null
  if (index == list.length) {
    list.push(asset)

    return list
  }
  list.splice(index, 0, { ...asset })

  return list
}

export const includes = (list, field, value) => {
  if (!list) return null
  const index = list.findIndex(item => item[field] == value)

  return index >= 0
}

export const updateListItem = (list, index, asset) => {
  if (!list || !list[index]) return null
  list[index] = { ...asset }

  return list
}

export const removeListItem = (list, index) => {
  if (!list || !list[index]) return null
  list.splice(index, 1)

  return list
}

export const moveItem = (list, drag_index, drop_index) => {
  if (!list || !list[drag_index] || list.length < drop_index) return null
  if (drop_index == list.length) {
    var element = list[drag_index]
    list.splice(drag_index, 1)
    list.push(element)

    return list
  }
  var element = list[drag_index]
  list.splice(drag_index, 1)
  list.splice(drop_index, 0, element)

  return list
}
