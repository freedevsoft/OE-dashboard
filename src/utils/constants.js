import colorString from 'color-string'
import * as queries from './queries'

export const EnumScreen = {
  Groups: 'Group',
  Articles: 'Articles',
  GroupEdit: 'GroupEdit',
  ArticleEdit: 'ArticleEdit',
}

export const subscriptionLevelOptions = [
  { label: 'Gold', value: 'gold' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Basic', value: 'basic' },
]

export const imageTypelist = ['Default', 'Icon', 'Logo', 'Avatar', 'StockImage']
export const contactimageTypelist = ['Avatar', 'Logo', 'StockImage']
export const streamTypeList = ['Default', 'GroupStream']
export const videoTypeList = ['Default', 'StockVideo']
export const attachmentTypeList = ['Default', 'Books', 'StockAttachment']

export const organizer = {
  Article: {
    docType: 'Article',
    mode: 'editor',
    collectionName: 'Articles',
    query: queries.articleQuery,
    responseType: 'article',
  },
  Image: {
    docType: 'StockImage',
    mode: 'image',
    collectionName: 'Images',
    query: queries.imageQuery,
    responseType: 'image',
  },
  Video: {
    docType: 'StockVideo',
    mode: 'video',
    collectionName: 'Videos',
    query: queries.videoQuery,
    responseType: 'video',
  },
  Icon: {
    docType: 'Icon',
    mode: 'icon',
    collectionName: 'Icons',
    query: queries.videoQuery,
    responseType: 'icon',
  },
  Attachment: {
    docType: 'Attachment',
    mode: 'attachment',
    collectionName: 'Attachments',
    query: queries.dataQuery,
    responseType: 'attachment',
  },
}

export const defaultPanelStyle = {
  width: 300,
  minWidth: 250,
  bgcolor: 'white',
  fgcolor: 'black',
  bgcolor_selected: 'gray',
  fgcolor_selected: 'white',
  border_right: '#C5C5C5',
}

export const getHoverColor = color => {
  const clrArray = colorString.get(color).value

  return `rgb(${(200 + clrArray[0]) % 256}, ${(200 + clrArray[1]) % 256}, ${(200 + clrArray[2]) % 256})`
}

export const getColor = (theme, highlight = false) => {
  if (color_themes[theme]) return highlight ? color_themes[theme].hColor : color_themes[theme].color

  return highlight ? color_themes.default.hColor : color_themes.default.color
}
export const getBackground = (theme, highlight = false) => {
  if (color_themes[theme]) {
    return highlight ? color_themes[theme].hBackground : color_themes[theme].background
  }

  return highlight ? color_themes.default.hBackground : color_themes.default.background
}

export const isDarkTheme = theme => {
  if (color_themes[theme]) return color_themes[theme].bDark

  return color_themes.default.bDark
}

export const color_themes = {
  gray: {
    color: 'white',
    hColor: '#FFFF00',
    background: '#aaa',
    hBackground: '#FFFF00',
    bDark: true,
  },
  white: {
    color: 'black',
    hColor: '#FFFF00',
    background: 'white',
    hBackground: '#FFFF00',
    bDark: false,
  },
  darkgreen: {
    color: 'white',
    hColor: '#FFFF00',
    background: 'rgb(0, 77, 84)',
    hColor: '#FFFF00',
    bDark: true,
  },
  default: {
    color: 'black',
    hColor: '#FFFF00',
    background: 'white',
    hBackground: '#FFFF00',
    bDark: false,
  },
}

export const cViewType = {
  PAGE_VIEW: 'page_view',
  HOME_VIEW: 'home_view',
}

export const DB_LAYOUTCONFIG_TYPES = {
  header: 'header',
  footer: 'footer',
  index: 'index',
  body: 'body',
}

export const cComponentType = {
  ADVERTISER_TOOL: 'AdvertiserTool',
  ANNOUNCER_TOOL: 'AnnouncerTool',
  ANNOUNCER_2_TOOL: 'Announcer_2Tool',
  APPLICATION_TOOL: 'ApplicationTool',
  COLLECTOR_TOOL: 'CollectorTool',
  COMPOSITOR_TOOL: 'CompositorTool',
  CREATOR_TOOL: 'CreatorTool',
  BUILDER_TOOL: 'BuilderTool',
  EDITOR_TOOL: 'EditorTool',
  ORGANIZER_TOOL: 'OrganizerTool',
  PERSONALIZER_TOOL: 'PersonalizerTool',
  STATS_TOOL: 'StatsTool',
  STREAMER_TOOL: 'StreamerTool',
  ADMIN_TOOL: 'AdminTool',
  MANAGER_TOOL: 'ManagerTool',
  PACKAGER_TOOL: 'PackagerTool',
  TOOL_HEADER: 'ToolHeader',
  TOOL_FOOTER: 'ToolFooter',
  ARTICLES_GRID: 'articles-grid',
  ARTICLE_DETAIL: 'article-detail',
  ADVERTISEMENT: 'advertisement',
  NOTIFICATION_WRAPPER: 'notification',
  NOTIFICATION_SIMPLE: 'notification-simple', // appears inside notification

  SOCIAL_MEDIA_LINKS: 'social-media-links',
  MENU_LINK_LIST: 'menu-link-list',
  TEXT_DISPLAY: 'text-display',
  IFRAME: 'iframe',

  LOGO_BAR: 'logo-bar',
  NAVBAR_1: 'navbar-1',
  NAVBAR_2: 'navbar-2',
  COLOR_BAR: 'color-bar',
  LOGIN_COMPONENT: 'login-component',

  // components which are appeared inside the App Organizer
  NWS_Alert: 'NWSAlert',
  GRID_ALERT: 'GridAlert',
  GEO_ALERT: 'GeoAlert',
  ZONE_ALERT: 'ZoneAlert',
  ZIP_ALERT: 'ZipAlert',
  FULL_ALERT: 'FullAlert',
  WEATHER: 'Weather',
  BANNER: 'Banner',
  CONTENT_BANNER: 'ContentBanner',
  SUMMARY: 'Summary',
  DETAIL: 'Detail',
  TEXT_ONLY: 'TextOnly',
  DONATE: 'Donate',
}

// This should be changed...
// export const GRAPHQL_URIS = {
//   https: "https://backend-dev.oelement.openznet.com:4000/",
//   wss: "wss://backend-dev.oelement.openznet.com:4000/"
// };

export const gridTypes = [
  {
    name: '1 * 3 Grid',
    layout: {
      type: 'row',
      children: [{ type: 'components', component_type: 'article-top', count: 3 }],
    },
  },
  {
    name: '1 * 2 Grid',
    layout: {
      type: 'row',
      children: [{ type: 'components', component_type: 'article-top', count: 2 }],
    },
  },
]

export const defaultNode = {
  row: {
    type: 'row',
    style: {},
    children: [],
  },
  col: {
    type: 'col',
    ratio: 'col-md-6',
    style: {},
    children: [],
  },
  component: {
    'logo-bar': {
      type: 'component',
      component_type: 'logo-bar',
      style: {},
      data: {
        style: {
          background: 'gray',
          align: 'center',
        },
        data: {
          logo_url: 'https://media.keyt.com/npg-keyt-media-us-east-1/photo/2016/08/22/KEYT_3395649_ver1.0.png',
        },
      },
    },
    'login-component': {
      type: 'component',
      component_type: 'login-component',
      style: {},
      data: {},
    },
    'navbar-1': {
      type: 'component',
      component_type: 'navbar-1',
      style: {},
      data: {
        style: {
          background: '#333',
        },
        data: {
          menus: [
            {
              heading: {
                text: 'Top News',
                type: 'internal',
                link: 'top-news',
                configId: '5cee9e3570c4351139038b50',
              },
              dropdowns: [],
            },
            {
              heading: { text: 'MarketPlace' },
              dropdowns: [
                {
                  text: 'TV Listings',
                  type: 'internal',
                  link: 'tvlist',
                  configId: '5cee9eeb70c4351139038b52',
                },
                {
                  text: 'Deals',
                  type: 'external',
                  link: 'google.com',
                  configId: '',
                },
              ],
            },
          ],
        },
      },
    },
    'navbar-2': {
      type: 'component',
      component_type: 'navbar-2',
      style: {},
      data: {
        style: { background: '#333' },
        data: {
          menus: [
            {
              heading: {
                text: 'Entertainment',
                type: 'internal',
                link: 'entertainment',
                configId: '5cee9e9870c4351139038b51',
                color: 'red',
              },
              dropdowns: [],
            },
            {
              heading: {
                text: 'Sports',
                type: 'internal',
                link: 'sports',
                configId: '5cee9dc770c4351139038b4f',
                color: 'purple',
              },
              dropdowns: [],
            },
            {
              heading: { text: 'Weather', color: 'gray' },
              dropdowns: [
                {
                  text: 'Santa Clara',
                  type: 'internal',
                  link: 'santaclara',
                  configId: '5cee9f2970c4351139038b53',
                },
                {
                  text: 'Santa Maria',
                  type: 'internal',
                  link: 'santamaria',
                  configId: '5cee9f2970c4351139038b53',
                },
              ],
            },
            {
              heading: {
                text: 'Lifestyle',
                type: 'internal',
                link: 'lifestyle',
                configId: '5cee9e9870c4351139038b51',
                color: 'green',
              },
              dropdowns: [],
            },
          ],
        },
      },
    },
    'articles-grid': {
      type: 'component',
      component_type: 'articles-grid',
      style: { margin: '10px 0px 0px 0px' },
      data: {
        style: {
          shadow_show: false,
          header_show: true,
          header_bg: 'lightseagreen',
          header_fg: 'white',
          background: 'white',
          foreground: 'black',
        },
        layout: {
          type: 'row',
          children: [{ type: 'components', component_type: 'article-top', count: 3 }],
        },
        content: { article_group_id: '99990003', subsection_name: 'Sports' },
      },
    },
    iframe: {
      type: 'component',
      component_type: 'iframe',
      style: { margin: '10px 0px 0px 0px' },
      data: { src: 'https://titantvguide.titantv.com/apg/ttv.aspx?siteid=1532' },
    },
    'text-display': {
      type: 'component',
      component_type: 'text-display',
      style: {},
      data: {
        text: '© 2019 NPG of California, LLC',
        style: {
          align: 'center',
          foreground: '#bbb',
          background: '',
          fontSize: '11.2px',
          height: 'auto',
        },
      },
    },
    'menu-link-list': {
      type: 'component',
      component_type: 'menu-link-list',
      style: { background: 'gray' },
      data: {
        color_heading: '#333',
        color_text: 'white',
        columns: [
          {
            heading: 'Connect',
            items: [
              {
                text: 'Top Stories',
                type: 'internal',
                link: 'topstories',
                configId: '5cee9f2970c4351139038b53',
              },
              {
                text: 'Share Your Story',
                type: 'internal',
                link: 'share-your-story',
                configId: '5cee9f2970c4351139038b53',
              },
            ],
          },
          {
            heading: 'Information',
            items: [
              {
                text: 'Meet the Team',
                type: 'internal',
                link: 'meet-the-team',
                configId: '5cee9f2970c4351139038b53',
              },
              {
                text: 'TV Listings',
                type: 'internal',
                link: 'tvlist',
                configId: '5cee9eeb70c4351139038b52',
              },
              {
                text: 'Advertise',
                type: 'internal',
                link: 'advertise',
                configId: '5cee9eeb70c4351139038b52',
              },
              {
                text: 'Jobs',
                type: 'external',
                link:
                  'https://recruiting.adp.com/srccar/public/RTI.home?c=1059541&d=External-Corporate&city=%22Ventura%22,%22Santa%20Barbara%22,%22Santa%20Maria%22,%22San%20Luis%20Obispo%22',
              },
              {
                text: 'Help',
                type: 'external',
                link: 'https://openznet.atlassian.net/servicedesk/customer/portals',
              },
            ],
          },
          {
            heading: 'Legal',
            items: [
              {
                text: 'FCC Public File KEYT',
                type: 'external',
                link: 'https://publicfiles.fcc.gov/tv-profile/keyt-tv',
              },
              {
                text: 'FCC Public File KCOY',
                type: 'external',
                link: 'https://publicfiles.fcc.gov/tv-profile/kcoy-tv',
              },
              {
                text: 'FCC Public File KKFX',
                type: 'external',
                link: 'https://publicfiles.fcc.gov/tv-profile/kkfx-cd',
              },
              {
                text: 'EEO Form',
                type: 'external',
                link: 'https://media.keyt.com/npg-keyt-media-us-east-1/document_dev/2018/07/31/EEOReport2018_1533084922601_12630549_ver1.0.pdf',
              },
              {
                text: 'Terms of Service',
                type: 'internal',
                link: 'terms-of-service',
                configId: '5cee9eeb70c4351139038b52',
              },
              {
                text: 'Privacy Policy',
                type: 'internal',
                link: 'privacy-policy',
                configId: '5cee9eeb70c4351139038b52',
              },
            ],
          },
        ],
      },
    },
    'social-media-links': {
      type: 'component',
      component_type: 'social-media-links',
      style: {},
      data: {
        links: [
          { type: 'fb', url: 'https://www.facebook.com/KEYTNC3/' },
          { type: 'tw', url: 'https://twitter.com/KEYTNC3' },
          { type: 'in', url: 'https://www.instagram.com/keyt3kcoy12' },
          {
            type: 'sna',
            url: 'https://www.instagram.com/p/BEe7QBlzbp0/?hl=en',
          },
          {
            type: 'li',
            url: 'https://www.linkedin.com/company/keyt-tv/about/',
          },
          { type: 'yt', url: 'http://www.youtube.com/c/KEYTKCOYKKFXNews31211' },
        ],
      },
    },
    notification: {
      type: 'component',
      component_type: 'notification',
      style: {},
      data: {
        shrinkOn: 100,
        shrinkPosition: 108,
        listeners: [
          {
            channel_name: 'test-channel',
            component_type: 'text-display',
            style: {
              fontSize: '1rem',
              background: 'red',
              foreground: 'white',
              padding: '5px',
              showExit: true,
            },
          },
        ],
      },
    },
    'color-bar': {
      type: 'component',
      component_type: 'color-bar',
      style: {},
      data: { height: '100px', background: 'red' },
    },
  },
}
