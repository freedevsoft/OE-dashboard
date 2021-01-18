
export const productConfigs = [
  {
    name: 'Announcer',
    type: '',
    data: {
      mainMenu: [
        {
          name: 'Alerts',
          ingestCollections: [ // do not filter by ownerId
            {
              name: 'OrganizerIngestNWS',
              displayName: 'NWS',
              icon: 'url for NWS icon',
            },
            {
              name: 'OrganizerIngestFire',
              displayName: 'Fire Dept',
              icon: 'url for icon',
            },
            {
              name: 'OrganizerIngestUserSubmitted',
              displayName: 'User Submitted',
              icon: 'url for icon',
            },
          ],
          editCollections: [ // filter by ownerId
            {
              name: 'OrganizerArticles',
              displayName: 'Articles',
            },
          ],
        },
        {
          name: 'Breaking News',
        },
        {
          name: 'ActionBanners',
        },
        {
          name: 'Notifications',
        },
      ],
    },
  },
]

export const organizerConfigs = [
  {
    product: 'Editor',
    collections: [
      {
        name: 'OrganizerIngestCNN',
        displayName: 'CNN',
        icon: 'url for cnn icon',
      },
      {
        name: 'OrganizerIngestAP',
        displayName: 'AP',
        icon: 'url for ap icon',
      },
    ],
  },
  {
    product: 'Announcer',
    collections: [
      {
        name: 'OrganizerIngestNWS',
        displayName: 'NWS',
        icon: 'url for NWS icon',
      },
    ],
  },
]

export const collectionConfigs = {
   Menu:[
      {name: "Groupings"}, 
      {name: "Media"},
      {name: "Students"}
    ]
  }