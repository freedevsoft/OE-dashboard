import { gql } from 'apollo-boost'

const layoutUpdate = gql`
  subscription layoutUpdate {
    layoutUpdate {
      _id
      name
      layout
      type
      updatedAt
    }
  }
`

const articleGroupUpdate = gql`
  subscription articleGroupUpdate {
    articleGroupUpdate {
      _id
      name
      moreLayoutId
    }
  }
`
const articleUpdate = gql`
  subscription articleUpdate {
    articleUpdate {
      _id
      name
      title
      shortDescr
      longDescr
      data
      location
      startAt
      endAt
      source {
        url
        name
        __typename
      }
      widgets {
        name
        data
      }
      videoURL
      minorVer
      imageList {
        name
        url
      }
      videoList {
        name
        url
      }
      version
    }
  }
`
const groupingAdd = gql`
  subscription groupingAdd {
    groupingAdd {
      _id
      collectionName
      name
      clientId
      type
      schedule {
        bActive
        bFilter
        startAt
        endAt
        recurrenceType
        repeatsEvery
        repeatsType
        repeatsOn
        endType
        endOn
        endAfter
        status
      }
      availability {
        state
      }
      data
      emails
      phoneNumbers
      version
      state
      tags
      updatedAt
      assignee
      rank
    }
  }
`
const groupingUpdate = gql`
  subscription groupingUpdate {
    groupingUpdate {
      _id
      collectionName
      name
      clientId
      type
      schedule {
        bActive
        bFilter
        startAt
        endAt
        recurrenceType
        repeatsEvery
        repeatsType
        repeatsOn
        endType
        endOn
        endAfter
        status
      }
      availability {
        state
      }
      data
      phoneNumbers
      emails
      version
      state
      tags
      updatedAt
      assignee
      rank
    }
  }
`
const dataUpdate = gql`
  subscription dataUpdate {
    dataUpdate {
      _id
      version
      createdAt
      updatedAt
      name
      type
      data
    }
  }
`

const organizerUpdate = gql`
  subscription organizerUpdate {
    organizerUpdate {
      _id
      ownerId
      name
      type
      root
      version
      createdAt
      updatedAt
    }
  }
`
const accountUpdate = gql`
  subscription accountUpdate {
    accountUpdate {
      _id
      version
      createdAt
      updatedAt
      name
      type
      data
    }
  }
`

const userAdded = gql`
  subscription userAdd {
    userAdd {
      _id
      name
      type
      createdAt
      updatedAt
      version
      access
      data
    }
  }
`

const documentDelete = gql`
  subscription documentDelete {
    documentDelete {
      _id
      _ids
      collectionName
    }
  }
`

export {
  layoutUpdate,
  articleGroupUpdate,
  articleUpdate,
  groupingUpdate,
  dataUpdate,
  accountUpdate,
  organizerUpdate,
  userAdded,
  groupingAdd,
  documentDelete,
}
