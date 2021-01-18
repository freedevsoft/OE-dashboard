import React from 'react'
import { notification } from 'antd'

import { graphql, withApollo } from 'react-apollo'
import * as compose from 'lodash.flowright'
import AccordionList from 'components/AccordionList/AccordionList'
import * as queries from 'utils/queries'
import * as mutations from 'utils/mutations'
import * as listUtils from 'utils/list'
import _ from 'lodash'

import './GroupInside.scss'

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  })
}

class GroupInside extends React.Component {
  drag_index = null

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
    }
  }

  selectItem = selectedIndex => {
    const {
      groupingQuery: { loading, grouping, error },
      onSelectItem,
    } = this.props

    if (loading || error || !grouping || !grouping[0] || !grouping[0].list || !grouping[0].list[selectedIndex]) return

    onSelectItem(grouping[0].list[selectedIndex].id)
    this.setState({ selectedIndex })
  }

  trackStateChange = (index, action) => {
    const {
      groupingQuery: { loading, grouping, error },
      upsertTracking,
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    const { list } = grouping[0]

    upsertTracking({
      variables: {
        _id: list[index].id,
        collectionName: 'Articles',
        action,
        comment: `Changed State of the Article to '${action}'`,
      },
    })
      .then(() => {
        openNotificationWithIcon('success', 'Announcer', 'Tracking success!')
      })
      .catch(err => {
        openNotificationWithIcon('warning', 'Announcer', 'Tracking Failed!')
      })
  }

  selectIcon = index => {
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    let { list } = grouping[0]

    if (list[index].active === 'true') {
      this.trackStateChange(index, 'Article Inactive')
    } else {
      this.trackStateChange(index, 'Article Active')
    }

    list = listUtils.updateListItem(list, index, {
      ...list[index],
      active: list[index].active === 'true' ? 'false' : 'true',
    })

    this.saveFunc(list)
  }

  dragArticle = (e, index) => {
    e.dataTransfer.setData('grouping_drag_index', index)
    this.drag_index = index
  }

  saveFunc = list => {
    const {
      groupingQuery: { loading, grouping, error },
      updateGroupingMuation,
      groupId,
      groupName,
      collectionName,
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    updateGroupingMuation({
      variables: {
        _id: grouping[0]._id,
        name: grouping[0].name,
        collectionName: grouping[0].collectionName,
        list: list.map(item => {
          const { __typename, ...rest } = item

          return rest
        }),
        version: grouping[0].version,
      },
      update: (proxy, { data: { updateGrouping } }) => {
        try {
          grouping[0] = updateGrouping
          proxy.writeQuery({
            query: queries.groupingQuery,
            variables: { ids: [groupId] },
            data: { grouping },
          })
        } catch (error) {
          console.error(error)
        }
      },
    })
      .then(() => {})
      .catch(err => {
        console.log(err)
      })
  }

  dropArticle = (e, f, dropIndex) => {
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    let { list } = grouping[0]

    const dragIndex = parseInt(e.dataTransfer.getData('grouping_drag_index'), 10)
    let eventNode = e.dataTransfer.getData('normal_dragNode')
    let eventDoc = e.dataTransfer.getData('normal_dragDoc')

    if (dragIndex >= 0) {
      // reorder inside same panel
      console.log('moveItem ', dragIndex, dropIndex)

      list = listUtils.moveItem(list, dragIndex, dropIndex)

      this.setState({ selectedIndex: dropIndex === list.length ? dropIndex - 1 : dropIndex })
      this.saveFunc(list)

      e.dataTransfer.setData('grouping_drag_index', null)
    } else if (eventNode && eventDoc) {
      // copy from another panel

      eventNode = JSON.parse(eventNode)
      eventDoc = JSON.parse(eventDoc)

      if (!listUtils.includes(list, 'id', eventNode.id)) {
        list = listUtils.addToList(list, { id: eventNode.id, active: 'false' }, dropIndex)

        this.saveFunc(list)

        e.dataTransfer.setData('normal_dragNode', null)
        e.dataTransfer.setData('normal_dragDoc', null)
      } else {
        openNotificationWithIcon('warning', 'Notification', 'Data already exists in the group and cannot be added again.')
      }
    }
  }

  dragLeaveArticle = () => {}

  dragOverArticle = () => {}

  dragEnd = e => {
    const accepted = e.dataTransfer.dropEffect !== 'none'
    if (!accepted && this.drag_index !== null) {
      const {
        groupingQuery: { loading, grouping, error },
      } = this.props

      if (loading || error || !grouping || !grouping[0]) return

      let { list } = grouping[0]

      list = listUtils.removeListItem(list, this.drag_index)
      this.saveFunc(list)

      this.drag_index = null
    }
  }

  removeListItem = index => {
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    let { list } = grouping[0]

    list = listUtils.removeListItem(list, index)
    this.saveFunc(list)
  }

  removeItem = () => {
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props

    if (loading || error || !grouping || !grouping[0]) return

    let { list } = grouping[0]
    const { selectedIndex } = this.state

    list = listUtils.removeListItem(list, selectedIndex)
    this.saveFunc(list)
  }

  render() {
    const {
      groupingQuery: { loading, grouping, error },
    } = this.props
    const { selectedIndex } = this.state

    if (loading || error) {
      return (
        <div className="group-inside-panel group-inside-panel-loading">
          <AccordionList loading />
        </div>
      )
    }

    if (!grouping || !grouping[0]) {
      return (
        <div className="group-inside-panel group-inside-panel-loading">
          {/* <div style={{ position: 'absolute', top: 'calc(50% - 105px)', left: 'calc(50% - 110px)' }}>
            <img src='/oops.png'></img>
          </div> */}
        </div>
      )
    }

    const { list } = grouping[0]
    const { articles } = grouping[0]

    return (
      <div className="group-inside-panel">
        <AccordionList
          dataList={
            list
              ? list.map(item => {
                  const findArticle = articles.find(article => article._id === item.id)
                  const name = findArticle ? findArticle.name : item.id

                  return {
                    name,
                    icon: item.active === 'true' ? '/images/icons/grouping-icon-selected.png' : '/images/icons/grouping-icon.png',
                    borderLeftSecond: _.get(findArticle, 'style.title.bg_type') === 'color' ? _.get(findArticle, 'style.title.bg_color') : null,
                  }
                })
              : []
          }
          selectedIndex={selectedIndex}
          selectItem={this.selectItem}
          selectIcon={this.selectIcon}
          itemThumb="none"
          itemEditable={false}
          draggable
          droppable
          onDragItem={this.dragArticle}
          onDragLeave={this.dragLeaveArticle}
          onDropItem={this.dropArticle}
          onDragOverItem={this.dragOverArticle}
          onDragEnd={this.dragEnd}
          showTrash
          removeItem={this.removeListItem}
          doubleSelectable
          spaceLabel="Drag & Drop Articles HERE to INSERT"
        />
      </div>
    )
  }
}

export default compose(
  graphql(queries.groupingQuery, {
    name: 'groupingQuery',
    options: props => ({
      variables: { ids: [props.groupId] },
    }),
  }),
  graphql(mutations.upsertTracking, { name: 'upsertTracking' }),
  graphql(mutations.updateGroupingMuation, { name: 'updateGroupingMuation' }),
  withApollo,
)(GroupInside)
