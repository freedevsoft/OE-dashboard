import { gql } from 'apollo-boost'

const layoutConfigCollectionName = 'ToolsLayoutConfigs'
const websiteLayoutConfigCollectionName = 'LayoutConfigs'
const articleGroupCollection = 'ArticleGroups'
const articleCollection = 'Articles'
const eventCollection = 'Articles'
const componentCollection = 'Articles'
const categoryCollection = 'Collections'

const allLayoutQuery = gql`
  query layout($layoutConfigCollectionName: String!) {
    layoutConfig(collectionName: $layoutConfigCollectionName) {
      _id
      name
      type
      version
    }
  }
`

const layoutQuery = gql`
  query layout($ids: [String!], $names: [String!], $types: [String!], $layoutConfigCollectionName: String!) {
    layoutConfig(ids: $ids, names: $names, types: $types, collectionName: $layoutConfigCollectionName) {
      _id
      name
      type
      layout
      version
    }
  }
`

const articleGroupsOrganizerQuery = gql`
  query articleGroup($articleGroupCollection: String!, $articleCollection: String!) {
    articleGroup(collectionName: $articleGroupCollection, artCollectionName: $articleCollection) {
      _id
      name
      realArticles {
        _id
        name
        category
        shortDescr
        version
      }
    }
  }
`

const articlesNameOrganizerQuery = gql`
  query articleGroup($articleGroupCollection: String!, $articleCollection: String!, $_id: String) {
    articleGroup(collectionName: $articleGroupCollection, artCollectionName: $articleCollection, _id: $_id) {
      _id
      name
      realArticles {
        _id
        name
        category
        shortDescr
        version
      }
    }
  }
`

const allArticleGroupsNameQuery = gql`
  query articleGroup($articleGroupCollection: String!, $articleCollection: String!) {
    articleGroup(collectionName: $articleGroupCollection, artCollectionName: $articleCollection) {
      _id
      name
    }
  }
`

const articleGroupsQuery = gql`
  query articleGroup($articleGroupCollection: String!, $articleCollection: String!, $_id: String) {
    articleGroup(collectionName: $articleGroupCollection, artCollectionName: $articleCollection, _id: $_id) {
      _id
      name
      version
      realArticles {
        _id
        name
        category
        shortDescr
        version
      }
    }
  }
`

const articleQuery = gql`
  query article($_id: String, $collectionName: String!) {
    article(_id: $_id, collectionName: $collectionName) {
      _id
      name
      title
      shortDescr
      body
      imageList {
        name
        url
      }
      videoList {
        name
        url
      }
      icon
      tags
      widgets {
        name
        data
      }
      startAt
      endAt
      version
    }
  }
`

const eventQuery = gql`
  query article($_id: String, $collectionName: String!) {
    article(_id: $_id, collectionName: $collectionName) {
      _id
      name
      title
      shortDescr
      longDescr
      data
      location
      startAt
      endAt
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
      }
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

const imageQuery = gql`
  query image($_id: String) {
    image(_id: $_id) {
      _id
      name
      url
      version
    }
  }
`

const videoQuery = gql`
  query video($_id: String) {
    video(_id: $_id) {
      _id
      name
      url
      version
    }
  }
`

const articleNameQuery = gql`
  query article($_id: String, $collectionName: String!) {
    article(_id: $_id, collectionName: $collectionName) {
      name
    }
  }
`

const articlesQuery = gql`
  query article($collectionName: String!) {
    article(collectionName: $collectionName) {
      _id
      category
      name
      shortDescr
      version
    }
  }
`

const organizerQuery = gql`
  query organizer($collectionName: String, $_ids: [String!], $ownerIds: [String!], $names: [String!], $types: [String!]) {
    organizer(collectionName: $collectionName, _ids: $_ids, ownerIds: $ownerIds, names: $names, types: $types) {
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

const groupsQuery = gql`
  query toolsgroups {
    toolsgroups {
      _id
      name
    }
  }
`

const groupsQueryWCollection = gql`
  query toolsgroups($collectionName: String) {
    toolsgroups(collectionName: $collectionName) {
      _id
      name
    }
  }
`

const usersQuery = gql`
  query toolsusers {
    toolsusers {
      _id
      name
      cognitoId
      organizers
    }
  }
`

const usersIdQuery = gql`
  query toolsusers($_ids: [String!]!) {
    toolsusers(_ids: $_ids) {
      _id
      name
      cognitoId
      organizers
    }
  }
`

const userInfo = gql`
  query userInfo {
    user @client {
      cognitoId
      name
    }
  }
`
const getUserInfo = gql`
  query userInfo($collectionName: String, $_ids: [String!], $names: [String!], $cognitoIds: [String!]) {
    toolsusers(collectionName: $collectionName, _ids: $_ids, names: $names, cognitoIds: $cognitoIds) {
      _id
      name
      cognitoId
      organizers
    }
  }
`

const accessedQuery = gql`
  query accessed($ids: [String!], $collectionName: String!, $action: String) {
    accessed(ids: $ids, collectionName: $collectionName, action: $action) {
      _id
      accessed {
        action
        counter
      }
    }
  }
`

const trackingQuery = gql`
  query tracking($ids: [String!], $collectionName: String!) {
    tracking(ids: $ids, collectionName: $collectionName) {
      _id
      tracking {
        _id
        collectionName
        serverId
        IPaddress
        url
        userId
        action
        comment
        timestamp
      }
    }
  }
`

const groupingQuery = gql`
  query groupingQuery(
    $names: [String!]
    $ids: [String!]
    $clientId: String
    $type: String
  ) {
    grouping(names: $names, ids: $ids, clientId: $clientId, type: $type) {
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
      tags
      version
      state
      updatedAt
      assignee
      rank
    }
  }
`
const dataQuery = gql`
  query data($names: [String!], $ids: [String!], $types: [String!], $collectionName: String!, $dashboard: String) {
    data(names: $names, ids: $ids, types: $types, collectionName: $collectionName, dashboard: $dashboard) {
      _id
      name
      data
      root
      type
      version
      createdAt
      updatedAt
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
      }
      __typename
    }
  }
`

const accountQuery = gql`
  query account($names: [String!], $ids: [String!], $types: [String!], $collectionName: String!) {
    account(names: $names, ids: $ids, types: $types, collectionName: $collectionName) {
      _id
      name
      data
      type
      version
      createdAt
      updatedAt
      clientId
      ownerId
      access
      summary
      __typename
    }
  }
`

const userQuery = gql`
  query user($ids: [String!], $names: [String!], $collectionName: String, $types: [String!]) {
    user(ids: $ids, names: $names, collectionName: $collectionName, types: $types) {
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

const videoDataQuery = gql`
  query videoData($names: [String!], $ids: [String!], $types: [String!], $collectionName: String) {
    videoData(names: $names, ids: $ids, types: $types, collectionName: $collectionName) {
      _id
      name
      clientId
      type
      version
      data
      params
      availability {
        state
      }
      conversionState
      videoFileInput
      videoFileOutput
    }
  }
`

const sendMessagesQuery = gql`
  query sendMessages($collectionName: String, $_id: String!, $message: MessageInput) {
    sendMessages(collectionName: $collectionName, _id: $_id, message: $message)
  }
`

const commentsQuery = gql`
  query comments($ids: [String!], $collectionName: String!, $last: Int) {
    comments(ids: $ids, collectionName: $collectionName, last: $last) {
      _id
      comments {
        id
        type
        comment
        timestamp
      }
    }
  }
`

export {
  allLayoutQuery,
  userInfo,
  getUserInfo,
  usersIdQuery,
  groupsQuery,
  organizerQuery,
  groupsQueryWCollection,
  usersQuery,
  allArticleGroupsNameQuery,
  layoutQuery,
  articleQuery,
  imageQuery,
  videoQuery,
  layoutConfigCollectionName,
  websiteLayoutConfigCollectionName,
  articleGroupCollection,
  articleCollection,
  categoryCollection,
  articleGroupsQuery,
  articleGroupsOrganizerQuery,
  articlesNameOrganizerQuery,
  articlesQuery,
  articleNameQuery,
  eventCollection,
  eventQuery,
  groupingQuery,
  dataQuery,
  accountQuery,
  componentCollection,
  userQuery,
  trackingQuery,
  accessedQuery,
  videoDataQuery,
  sendMessagesQuery,
  commentsQuery,
}
