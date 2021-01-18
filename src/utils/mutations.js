import gql from 'graphql-tag'

const deleteMutation = gql`
  mutation($collectionName: String!, $_id: String) {
    deleteDocument(collectionName: $collectionName, _id: $_id)
  }
`

const layoutConfigsMutation = gql`
  mutation upsertLayoutConfig(
    $collectionName: String!
    $_id: String
    $name: String
    $type: String
    $layout: JSONObject
    $version: Int
  ) {
    upsertLayoutConfig(collectionName: $collectionName, _id: $_id, name: $name, type: $type, layout: $layout, version: $version) {
      _id
      name
      type
      layout
      version
    }
  }
`

const articleGroupsMutation = gql`
  mutation upsertArticleGroup(
    $articleGroupCollection: String!
    $articleCollection: String!
    $_id: String
    $name: String
    $rArticles: [String]
  ) {
    upsertArticleGroup(
      collectionName: $articleGroupCollection
      artCollectionName: $articleCollection
      _id: $_id
      name: $name
      rArticles: $rArticles
    ) {
      _id
      name
    }
  }
`

const createArticle = gql`
  mutation createArticle(
    $collectionName: String
    $name: String!
    $title: String
    $shortDescr: String
    $longDescr: String
    $data: JSONObject
    $startAt: String
    $endAt: String
    $source: SourceInput
    $widgets: [WidgetInput!]
    $location: JSONObject
    $videoURL: String
    $imageList: [ImageInfoInput]
    $videoList: [VideoInfoInput]
  ) {
    createArticle(
      collectionName: $collectionName
      name: $name
      title: $title
      shortDescr: $shortDescr
      longDescr: $longDescr
      data: $data
      location: $location
      startAt: $startAt
      endAt: $endAt
      source: $source
      widgets: $widgets
      videoURL: $videoURL
      imageList: $imageList
      videoList: $videoList
    ) {
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

const updateArticle = gql`
  mutation updateArticle(
    $collectionName: String
    $_id: String
    $name: String!
    $title: String
    $shortDescr: String
    $longDescr: String
    $data: JSONObject
    $startAt: String
    $endAt: String
    $source: SourceInput
    $widgets: [WidgetInput!]
    $location: JSONObject
    $videoURL: String
    $imageList: [ImageInfoInput]
    $videoList: [VideoInfoInput]
    $version: Int!
  ) {
    updateArticle(
      collectionName: $collectionName
      _id: $_id
      name: $name
      title: $title
      shortDescr: $shortDescr
      longDescr: $longDescr
      data: $data
      location: $location
      startAt: $startAt
      endAt: $endAt
      source: $source
      widgets: $widgets
      videoURL: $videoURL
      imageList: $imageList
      videoList: $videoList
      version: $version
    ) {
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

const imageMutation = gql`
  mutation upsertImage($_id: String, $name: String, $url: String!) {
    upsertImage(_id: $_id, url: $url, name: $name) {
      _id
      url
      name
    }
  }
`

const videoMutation = gql`
  mutation upsertVideo($_id: String, $name: String, $url: String!) {
    upsertVideo(_id: $_id, name: $name, url: $url) {
      _id
      name
      url
    }
  }
`

const organizerMutation = gql`
  mutation upsertOrganizer($collectionName: String, $_id: String, $ownerId: String, $name: String, $type: String, $root: JSONObject, $version: Int) {
    upsertOrganizer(collectionName: $collectionName, _id: $_id, ownerId: $ownerId, name: $name, type: $type, root: $root, version: $version) {
      _id
      ownerId
      type
      root
      name
      createdAt
      updatedAt
      version
    }
  }
`

const upsertGroupMuation = gql`
  mutation upsertToolsGroup($_id: String, $name: String, $userIds: [String!], $rUserIds: [String!]) {
    upsertToolsGroup(_id: $_id, name: $name, userIds: $userIds, rUserIds: $rUserIds) {
      _id
      name
      userIds
    }
  }
`

const upsertUserMutation = gql`
  mutation upsertUserMuation($_id: String, $name: String, $cognitoId: String, $groupIds: [String!], $rGroupIds: [String!], $collectionName: String) {
    upsertToolsUser(_id: $_id, name: $name, cognitoId: $cognitoId, groupIds: $groupIds, rGroupIds: $rGroupIds, collectionName: $collectionName) {
      _id
      name
      groupIds
      cognitoId
    }
  }
`

const deleteGroup = gql`
  mutation deleteGroup($_ids: [String!]!, $collectionName: String, $uCollectionName: String) {
    deleteGroup(_ids: $_ids, collectionName: $collectionName, uCollectionName: $uCollectionName)
  }
`

const deleteUser = gql`
  mutation deleteUser($_ids: [String!]!, $collectionName: String, $gCollectionName: String) {
    deleteUser(_ids: $_ids, collectionName: $collectionName, gCollectionName: $gCollectionName)
  }
`

const upsertTracking = gql`
  mutation upsertTracking(
    $_id: String!
    $collectionName: String!
    $serverId: String
    $url: String
    $userId: String
    $action: String!
    $comment: String
  ) {
    upsertTracking(_id: $_id, collectionName: $collectionName, serverId: $serverId, url: $url, userId: $userId, action: $action, comment: $comment) {
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
`

const createGroupingMuation = gql`
  mutation createGrouping(
    $clientId: String
    $type: String
    $name: String!
    $collectionName: String!
    $schedule: ScheduleInput
    $availability: AvailabilityInput
    $data: JSONObject
    $rank: Int
  ) {
    createGrouping(
      clientId: $clientId
      type: $type
      name: $name
      collectionName: $collectionName
      schedule: $schedule
      availability: $availability
      data: $data
      rank: $rank
    ) {
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
      rank
      version
      state
      updatedAt
    }
  }
`

const updateGroupingMuation = gql`
  mutation updateGrouping(
    $_id: String!
    $clientId: String
    $type: String
    $version: Int!
    $name: String!
    $collectionName: String!
    $schedule: ScheduleInput
    $availability: AvailabilityInput
    $data: JSONObject
    $tags: [String]
    $assignee: String
    $rank: Int
  ) {
    updateGrouping(
      _id: $_id
      clientId: $clientId
      type: $type
      version: $version
      name: $name
      collectionName: $collectionName
      schedule: $schedule
      availability: $availability
      data: $data
      tags: $tags
      assignee: $assignee
      rank: $rank
    ) {
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
      version
      state
      tags
      updatedAt
      assignee
      rank
    }
  }
`

const dataMutation = gql`
  mutation upsertData(
    $collectionName: String!
    $_id: String
    $name: String
    $type: String
    $data: JSONObject
    $root: JSONObject
    $version: Int
    $schedule: ScheduleInput
  ) {
    upsertData(
      collectionName: $collectionName
      _id: $_id
      name: $name
      type: $type
      data: $data
      root: $root
      version: $version
      schedule: $schedule
    ) {
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
const accountMutation = gql`
  mutation upsertAccount(
    $collectionName: String!
    $_id: String
    $name: String
    $type: String
    $data: JSONObject
    $version: Int
    $clientId: String
    $ownerId: String
    $access: JSONObject
    $summary: JSONObject
  ) {
    upsertAccount(
      collectionName: $collectionName
      _id: $_id
      name: $name
      type: $type
      data: $data
      version: $version
      clientId: $clientId
      ownerId: $ownerId
      access: $access
      summary: $summary
    ) {
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

const createUser = gql`
  mutation createUser(
    $name: String!
    $type: String
    $access: JSONObject
    $data: JSONObject
    $collectionName: String
  ) {
    createUser(
      name: $name
      type: $type
      access: $access
      data: $data
      collectionName: $collectionName
    ) {
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

const updateUser = gql`
  mutation updateUser(
    $_id: String!
    $version: Int!
    $name: String!
    $type: String
    $access: JSONObject
    $data: JSONObject
    $collectionName: String
  ) {
    updateUser(
      _id: $_id
      version: $version
      name: $name
      type: $type
      access: $access
      data: $data
      collectionName: $collectionName
    ) {
      _id
      version
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

const createVideoData = gql`
  mutation createVideoData(
    $collectionName: String
    $name: String!
    $clientId: String
    $type: String
    $data: JSONObject
    $availability: AvailabilityInput
    $conversionState: String
    $videoFileInput: String!
    $params: JSONObject
  ) {
    createVideoData(
      collectionName: $collectionName
      name: $name
      clientId: $clientId
      type: $type
      data: $data
      availability: $availability
      conversionState: $conversionState
      videoFileInput: $videoFileInput
      params: $params
    ) {
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
      params
    }
  }
`

const updateVideoData = gql`
  mutation updateVideoData(
    $collectionName: String
    $_id: String!
    $name: String!
    $clientId: String
    $type: String
    $data: JSONObject
    $availability: AvailabilityInput
    $conversionState: String
    $videoFileInput: String!
    $initiateConversion: Boolean
    $params: JSONObject
  ) {
    updateVideoData(
      collectionName: $collectionName
      _id: $_id
      name: $name
      clientId: $clientId
      type: $type
      data: $data
      availability: $availability
      conversionState: $conversionState
      videoFileInput: $videoFileInput
      initiateConversion: $initiateConversion
      params: $params
    ) {
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
      params
    }
  }
`
const upsertCommentMutation = gql`
  mutation upsertComment($collectionName: String!, $_id: String!, $comment: String!, $type: String) {
    upsertComment(_id: $_id, collectionName: $collectionName, comment: $comment, type: $type) {
      id
      type
      comment
      timestamp
    }
  }
`

const deleteCommentMutation = gql`
  mutation deleteComment($collectionName: String!, $_id: String!, $commentId: String!) {
    deleteComment(_id: $_id, collectionName: $collectionName, commentId: $commentId)
  }
`

const upsertPhoneNumberMutation = gql`
  mutation upsertPhoneNumber($collectionName: String!, $_id: String!, $phoneNumber: String!) {
    upsertPhoneNumber(_id: $_id, collectionName: $collectionName, phoneNumber: $phoneNumber)
  }
`

const deletePhoneNumberMutation = gql`
  mutation deletePhoneNumber($collectionName: String!, $_id: String!, $phoneNumber: String!) {
    deletePhoneNumber(_id: $_id, collectionName: $collectionName, phoneNumber: $phoneNumber)
  }
`

const upsertEmailMutation = gql`
  mutation upsertEmail($collectionName: String!, $_id: String!, $email: String!) {
    upsertEmail(_id: $_id, collectionName: $collectionName, email: $email)
  }
`

const deleteEmailMutation = gql`
  mutation deleteEmail($collectionName: String!, $_id: String!, $email: String!) {
    deleteEmail(_id: $_id, collectionName: $collectionName, email: $email)
  }
`

export {
  articleGroupsMutation,
  upsertUserMutation,
  imageMutation,
  deleteMutation,
  deleteGroup,
  deleteUser,
  videoMutation,
  upsertGroupMuation,
  layoutConfigsMutation,
  organizerMutation,
  dataMutation,
  accountMutation,
  createUser,
  updateUser,
  upsertTracking,
  createGroupingMuation,
  updateGroupingMuation,
  createArticle,
  updateArticle,
  createVideoData,
  updateVideoData,
  upsertCommentMutation,
  deleteCommentMutation,
  upsertPhoneNumberMutation,
  deletePhoneNumberMutation,
  upsertEmailMutation,
  deleteEmailMutation,
}
