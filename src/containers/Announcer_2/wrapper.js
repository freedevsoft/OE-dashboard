import React, { useState, useEffect } from 'react'
import { groupingQuery } from 'utils/queries'
import { createGroupingMuation } from 'utils/mutations'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Announcer_2 from './index'

const Seed = ({ clients, children }) => {
  const [isInited, setIsInited] = useState(false)

  const [createGroup, { loading, error }] = useMutation(createGroupingMuation)

  useEffect(() => {
    if (!clients.length) {
      createGroup({
        variables: {
          clientId: 'clients',
          name: 'Default',
          type: '/',
          collectionName: 'Groupings',
        },
      })
        .then(res => {
          console.log(res)
          setIsInited(true)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      setIsInited(true)
    }
  }, [clients])

  if (!isInited) {
    return 'loading...'
  }

  return React.Children.map(children, child =>
    child ? React.cloneElement(child, { clients: [{ _id: 'clients', name: 'Clients' }, ...clients], ...child.props }) : '',
  )
}

const AnnouncerWrapper = ({ children }) => {
  const { loading, error, data } = useQuery(groupingQuery, {
    variables: {
      clientId: 'clients',
      type: '/',
      ids: null,
    },
  })

  if (loading || error || !data?.grouping) {
    return 'loading...'
  }

  return <Seed clients={data?.grouping}>{children}</Seed>
}

export default AnnouncerWrapper
