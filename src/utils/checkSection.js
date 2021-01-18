export const checkSection = (section, contentsData) => {
  const retSection = Object.assign({}, section)
  retSection.stories = section.stories.filter((hasStory, storyIndex) => {
    let foundContents = null
    if (contentsData.length > 0) {
      foundContents = contentsData.filter(content => content.id == hasStory.storyID)

      if (!foundContents || !foundContents[0]) {
        // console.log(`in checking section, catch removed story`)
        return false
      }
    }

    return true
  })

  return retSection
}

export default checkSection
