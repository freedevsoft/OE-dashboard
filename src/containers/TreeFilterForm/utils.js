const subscriptionLevelOptions = [
  { label: 'Gold', value: 'gold' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Silver', value: 'silver' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Basic', value: 'basic' },
]

const ruleTypes = [
  {
    label: 'Geolocation',
    value: 'geolocation',
    comparisonTypes: [
      { label: 'is inside', value: 'inside' },
      { label: 'is outside', value: 'outside' },
    ],
    valueType: 'button',
  },
  {
    label: 'Tags',
    value: 'tags',
    comparisonTypes: [
      { label: 'contains', value: 'contain' },
      { label: "doesn't contain", value: 'not_contain' },
    ],
    valueType: 'string',
  },
  {
    label: 'Logged in',
    value: 'b_log',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  {
    label: 'Data Collection',
    value: 'data_collection',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'OPT IN', value: 'OPT IN' },
      { label: 'OPT OUT', value: 'OPT OUT' },
    ],
  },
  {
    label: 'Destination',
    value: 'destination',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  {
    label: 'Device Type',
    value: 'device_type',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  {
    label: 'User Group',
    value: 'user_group',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  {
    label: 'Site ID',
    value: 'site_id',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  {
    label: 'User ID',
    value: 'user_id',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  // {
  //   label: 'Machine Learning',
  //   value: 'ML',
  //   comparisonTypes: [{ label: 'any', value: 'any' }],
  //   valueType: 'button',
  // },
  {
    label: 'Zip Code',
    value: 'zip_code',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'string',
  },
  {
    label: 'Gender',
    value: 'gender',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'Female', value: 'F' },
      { label: 'Male', value: 'M' },
      { label: 'N/A', value: null },
    ],
  },
  {
    label: 'Age',
    value: 'age',
    comparisonTypes: [
      { label: 'is equal to', value: '=' },
      { label: 'is less than', value: '<' },
      { label: 'is greater than', value: '>' },
    ],
    valueType: 'number',
  },
  {
    label: 'Income',
    value: 'income',
    comparisonTypes: [
      { label: 'is equal to', value: '=' },
      { label: 'is less than', value: '<' },
      { label: 'is greater than', value: '>' },
    ],
    valueType: 'number',
  },
  {
    label: 'Affiliations',
    value: 'affiliations',
    comparisonTypes: [
      { label: 'contains', value: 'contain' },
      { label: "doesn't contain", value: 'not_contain' },
    ],
    valueType: 'string',
  },
  {
    label: 'Interests',
    value: 'interests',
    comparisonTypes: [
      { label: 'contains', value: 'contain' },
      { label: "doesn't contain", value: 'not_contain' },
    ],
    valueType: 'string',
  },
  {
    label: 'Subscriptions',
    value: 'subscriptions',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: subscriptionLevelOptions,
  },
  {
    label: 'Broadcast Flag',
    value: 'broadcast',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'None', value: null },
      { label: 'ATSC 3.0', value: 'ATSC 3.0' },
      { label: 'ATSC 1.0', value: 'ATSC 1.0' },
    ],
  },
  {
    label: 'Broadband Flag',
    value: 'broadband',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'Connection', value: true },
      { label: 'No Connection', value: false },
    ],
  },
  {
    label: 'Alert Level',
    value: 'alert_level',
    comparisonTypes: [
      { label: 'is', value: '=' },
      { label: 'is not', value: '<>' },
    ],
    valueType: 'select',
    enumValues: [
      { label: 'LOW', value: 'LOW' },
      { label: 'MEDIUM', value: 'MEDIUM' },
      { label: 'HIGH', value: 'HIGH' },
    ],
  },
]

export { ruleTypes, subscriptionLevelOptions }
