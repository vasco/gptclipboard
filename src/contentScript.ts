import TurndownService from 'turndown'

interface ConversationData {
  title: string
  model: string
  items: {
    from: 'human' | 'gpt'
    value: string
  }[]
}

const turndown = (() => {
  return (html: string | TurndownService.Node): string => {
    const turndownService = new TurndownService()
    return turndownService.turndown(html)
  }
})();

function init() {
  const shareButton = createBtn()
  // const shareBtnText = shareButton.textContent;
  // const shareBtnCursorStyle = shareButton.style.cursor;

  function appendShareButton() {
    const buttonsWrapper = document.querySelector('#__next main form > div div:nth-of-type(1) > div')

    buttonsWrapper.appendChild(shareButton)
  }

  appendShareButton()

  setInterval(() => {
    const exportBtn = document.querySelector('#export-button')
    if (exportBtn && (exportBtn as HTMLElement).style.display === 'none') {
      appendShareButton()
    }
  }, 500)

  shareButton.addEventListener('click', () => {
    const threadContainer = document.getElementsByClassName('flex flex-col items-center text-sm dark:bg-gray-800')[0]

    // show the model for chatgpt+ users
    let model

    const chatGptPlusElement = document.querySelector('.gold-new-button')
    const isNotChatGptPlus = chatGptPlusElement && (chatGptPlusElement as HTMLElement).innerText.includes('Upgrade')

    if (!isNotChatGptPlus) {
      const modelElement = threadContainer.firstChild as HTMLElement
      model = modelElement.innerText
    }

    const conversationData: ConversationData = {
      title: document.title,
      model,
      items: [],
    }

    for (const node of threadContainer.children) {
      const markdown = node.querySelector('.markdown')

      // tailwind class indicates human or gpt
      if ([...node.classList].includes('dark:bg-gray-800')) {
        const warning = node.querySelector('.text-orange-500') as HTMLElement
        if (warning) {
          conversationData.items.push({
            from: 'human',
            value: warning.innerText.split('\n')[0],
          })
        } else {
          const text = node.querySelector('.whitespace-pre-wrap')
          conversationData.items.push({
            from: 'human',
            value: text.textContent,
          })
        }
        // if it's a GPT response, it might contain code blocks
      } else if (markdown) {
        conversationData.items.push({
          from: 'gpt',
          value: turndown(markdown.outerHTML),
        })
      }
    }

    // Convert conversationData to a formatted string for copying to the clipboard
    const formattedConversation = conversationData.items.map((item) => (item.from === 'human' ? '> ' + item.value : item.value)).join('\n\n')

    // Copy the formatted conversation to the clipboard
    navigator.clipboard.writeText(formattedConversation).then(
      function () {
        console.log('Conversation copied to clipboard')
      },
      function (err) {
        console.error('Unable to copy conversation to clipboard: ', err)
      }
    )
  })
}

function createBtn() {
  const button = document.createElement('button')

  button.id = 'export-button'

  button.classList.add('btn', 'flex', 'gap-2', 'justify-center', 'btn-neutral')

  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg>Share`

  return button
}

init()
