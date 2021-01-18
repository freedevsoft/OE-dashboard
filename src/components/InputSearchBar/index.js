import React from 'react'
import './index.scss'

const InputSearchBar = ({}) => (
  <div className="input-search-bar">
    <form className="form-wrapper cf">
      <input type="text" placeholder="Search here..." required />
      <button type="submit">Search</button>
    </form>
  </div>
)

export default InputSearchBar
