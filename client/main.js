import bot from './assets/bot.svg'
import user from './assets/user.svg'

//Target HTML manually using document.querySelector
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadAnimation

//Function for loading messagers 
function loaderAnim(element) {
  element.textContent = ''

  loadAnimation = setInterval(()=>{
    element.textContent += '.'
    if(element.textContent === '....'){
      element.textContent = ''
    }
  }, 300)
}

function typeText(element, text){
  let index= 0

  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index)
      index++
    }else{
      clearInterval(interval)
    }
  },20)
}

function generateId(){
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

function chatDivider(isitAi, value, uniqueId){
  return (
    ` 
    <div class="wrapper ${isitAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img 
            src="${isitAi ? bot : user}"
            alt="${isitAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    ` 
  )
}

// trigger of AI
const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)
  chatContainer.innerHTML += chatDivider(false, data.get('prompt'))
  form.reset()

  //AI, Bot chat divider
  const uniqueId = generateId()
  chatContainer.innerHTML += chatDivider(true, " ", uniqueId)
  
  // New message in view
  chatContainer.scrollTop = chatContainer.scrollHeight
  const messageView = document.getElementById(uniqueId)
  loaderAnim(messageView)

  const response = await fetch('https://gptwork.onrender.com',{
    method: 'Post',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  clearInterval(loadAnimation)
  messageView.innerHTML = ''

  if(response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()

    typeText(messageView,parsedData)
  } else{
    const err = await response.text()

    messageView.innerHTML = "Try again, not right"
    alert(err)
  }
}

form.addEventListener('submit', handleSubmit)
//Enter key submition
form.addEventListener('keyup', (e) =>{
  if(e.keyCode === 13){
    handleSubmit(e)
  }
})