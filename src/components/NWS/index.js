import { Component } from 'react'
import axios from 'axios'
import convert from 'xml-js'

class NWSListener extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastFetch: null, // *TODO: We don't need to keep this in state, once we update UI and don't show this anymore.
      fullFeedItems: 0, // *TODO: We don't need to keep this in state, same reason.
      NWSUpdateDate: '', // *TODO: We don't need to keep this in state, same reason.
      filteredFeed: null,
      myFips: null,
    }
  }

  componentDidMount = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.gotPosition)
    }
    this.checkFeed()
    setInterval(() => {
      this.checkFeed()
    }, 5000)
  }

  gotPosition = position => {
    axios
      .get(`https://geo.fcc.gov/api/census/area?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
      .then(response => {
        if (response.data && response.data.results && response.data.results.length > 0) {
          const myFips = response.data.results[0].county_fips
          this.setState({ myFips })
          this.checkFeed()
        }
      })
      .catch(() => {
        console.log('error retrieving location data from geo.fcc.gov')
        // *TODO: Include a default location(s) (come in as props from db for client's area)
      })
  }

  checkFeed = () => {
    console.log('NWSListener >> checkFeed')
    const alertLocation = 'us' // *TODO: Eventually, this should come in as props from db for client's state
    axios
      .get(`https://alerts.weather.gov/cap/${alertLocation}.php?x=1`)
      .then(response => {
        const { feed } = convert.xml2js(response.data, { compact: true })
        this.setState({
          lastFetch: new Date(),
          fullFeedItems: feed.entry.length,
          NWSUpdateDate: new Date(feed.updated._text),
        })
        this.filterFeed(feed)
      })
      .catch(error => {
        console.log('error trying to retrieve NWS feed', error)
      })
  }

  filterFeed = feed => {
    // use feed/fips from params first. If either is null, use it from state. If still null, do nothing.
    const { myFips } = this.state
    if (!feed || !myFips) return
    // myFips = '006083' // Santa Barbara County

    // filter feed based on myFips
    // *TODO: accept fips array (or space-delimited string) in props and filter on myFips + props.fipsArray. Myfips is current location and props.fips is other fips user is interested in.
    const filteredFeed = {}
    filteredFeed.entry = feed.entry.filter(elem => {
      const geocode = elem['cap:geocode']
      const index = geocode.valueName.findIndex(name => {
        return name._text === 'FIPS6'
      })
      if (index > -1) {
        const values = geocode.value[index]
        //  values is space-delimited string. Turn into array and look for a match on fips
        const valueArr = values._text.split(' ')
        const fipsMatchIndex = valueArr.findIndex(value => {
          return value === myFips
        })
        // Exclude from filteredFeed if this is not a location we are interested in.
        if (fipsMatchIndex === -1) return false
        // Exclude from filteredFeed if this is not an urgency/severity/certainty we are interested in

        const { showUrgency, showSeverity, showCertainty } = this.props

        if (!showUrgency.includes(elem['cap:urgency']._text) || !showSeverity.includes(elem['cap:severity']._text) || !showCertainty.includes(elem['cap:certainty']._text)) {
          return false
        }

        return true
      }

      return false
    })
    this.setState({ filteredFeed })
  }

  render() {
    const { NWSUpdateDate, filteredFeed, lastFetch, fullFeedItems } = this.state

    if (NWSUpdateDate && filteredFeed) {
      return `  >>>>> NWS Data Feed >>>>> last fetched ${lastFetch.toString()} >>>>> last updated by NWS ${NWSUpdateDate} >>>>> items in full feed = ${fullFeedItems} >>>>> items in filtered feed = ${
        filteredFeed.entry.length
      }`
    }

    return '>>>>> NWS Data Feed >>>>>> no feed data yet'
  }
}

NWSListener.defaultProps = {
  showUrgency: 'Immediate|Expected|Future',
  showSeverity: 'Extreme|Severe|Moderate',
  showCertainty: 'Observed|Likely|Very Likely|Possible',
}

export default NWSListener
