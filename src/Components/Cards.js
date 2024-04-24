import React from 'react'
import "./Cards.css"

const Cards = (props) => {
  return (
    <div className='main'>
      <div class="tag-cloud card1" >Total Cases<br/>
       <h6>{props.newCases}</h6>
       
      </div>
      
      
      <div class="tag-cloud card2">Recoveries
      <h6>{props.newRecoveries}</h6>
      </div>
      

      
      <div class="tag-cloud card3">Deaths
      <h6>{props.newDeaths}</h6>
      
    </div>
    </div>
   
  )
}

export default Cards
