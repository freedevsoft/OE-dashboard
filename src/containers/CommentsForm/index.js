import React, { useState } from 'react'
import { Input, Button, Icon, Comment, Tooltip, List, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { commentsQuery } from 'utils/queries'
import { upsertCommentMutation, deleteCommentMutation } from 'utils/mutations'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import './index.scss'

const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <TextArea rows={4} onChange={onChange} value={value} disabled={submitting} />
    <Button type="dashed" loading={submitting} onClick={onSubmit}>
      <Icon type="plus" /> Add Comment
    </Button>
  </div>
)

const CommentsForm = ({ _id, collectionName }) => {
  const [newComment, setNewComment] = useState('')

  const { loading, error, data } = useQuery(commentsQuery, {
    variables: {
      ids: [_id],
      collectionName,
    },
  })

  const upsertCommentCache = (cache, { data }) => {
    const prev = cache.readQuery({
      query: commentsQuery,
      variables: {
        ids: [_id],
        collectionName,
      },
    })
    const newComment = data?.upsertComment

    cache.writeQuery({
      query: commentsQuery,
      variables: {
        ids: [_id],
        collectionName,
      },
      data: {
        comments: [
          {
            ...prev.comments[0],
            comments: [...(prev.comments[0].comments || []), newComment],
          },
        ],
      },
    })
  }

  const [upsertComment, { loading: upserting, error: upsertError }] = useMutation(upsertCommentMutation, {
    update: upsertCommentCache,
  })

  const [deleteComment, { loading: deleting, error: deleteError }] = useMutation(deleteCommentMutation)

  if (loading) {
    return ''
  }

  if (error || !data) {
    return ''
  }

  const { comments: docComments } = data

  if (!docComments || !docComments[0]) {
    return ''
  }

  const { comments } = docComments[0]

  const add = () => {
    upsertComment({
      variables: {
        _id,
        collectionName,
        comment: newComment,
      },
    }).then(() => {
      setNewComment('')
    })
  }

  const remove = commentId => {
    deleteComment({
      variables: {
        _id,
        collectionName,
        commentId,
      },
      update: cache => {
        const prev = cache.readQuery({
          query: commentsQuery,
          variables: {
            ids: [_id],
            collectionName,
          },
        })
        // const newComment = data?.upsertComment

        cache.writeQuery({
          query: commentsQuery,
          variables: {
            ids: [_id],
            collectionName,
          },
          data: {
            comments: [
              {
                ...prev.comments[0],
                comments: prev.comments[0].comments?.filter(comment => comment.id !== commentId),
              },
            ],
          },
        })
      },
    })
  }

  return (
    <div className="comments-form">
      <List
        className="comment-list"
        header={`${comments?.length || 0} comments`}
        itemLayout="horizontal"
        dataSource={comments || []}
        renderItem={item => (
          <li>
            <Comment
              actions={[
                <span key={item.id} onClick={() => remove(item.id)}>
                  Remove
                </span>,
              ]}
              author="Username"
              avatar={<Avatar style={{ color: 'blue' }} icon={<UserOutlined />} />}
              content={item.comment}
              datetime={
                <Tooltip title={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment(item.timestamp).fromNow()}</span>
                </Tooltip>
              }
            />
          </li>
        )}
      />
      <Comment
        avatar={<Avatar style={{ color: 'blue' }} icon={<UserOutlined />} />}
        content={<Editor value={newComment} onChange={e => setNewComment(e.target.value)} onSubmit={add} submitting={upserting} />}
      />
    </div>
  )
}

export default CommentsForm
