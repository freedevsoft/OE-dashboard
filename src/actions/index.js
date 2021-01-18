export function checkStoriesInSection(type) {
  return { type }
}

export function setStatusMessage(type, message) {
  return { type, message }
}

export function savePageInfo(type, data) {
  return { type, data }
}

export function changePageLink(type, data) {
  return { type, data }
}

export function resetStore(type) {
  return { type }
}

export function toggleLeftSidebar(type) {
  return { type }
}
