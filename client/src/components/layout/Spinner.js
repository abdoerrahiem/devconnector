import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'

const Spinner = () => (
  <div
    className='container'
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <ScaleLoader size={150} color={'#48bec7'} loading={true} />
  </div>
)

export default Spinner
