export const CHAT_SELECTORS = {
  title: '[data-chat-title]',
  control: '[data-chat-control]',
  option: '[data-chat-option]',
  // A tap on these does its own thing instead of focusing the input
  interactive: 'a, button, [role="textbox"]'
}

export const getHiddenElements = (form: HTMLElement | null, selector: string) =>
  Array.from(form?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
    element => getComputedStyle(element).visibility === 'hidden'
  )

// Every character takes its place up front, so words don't jump to the next line mid-typing
export const getHiddenChars = (title: HTMLElement, text: string) => {
  if (!title.childElementCount) {
    title.replaceChildren(
      ...Array.from(text, char => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.opacity = '0'
        return span
      })
    )
  }

  return Array.from(title.children).filter(
    char => char instanceof HTMLElement && Number(char.style.opacity) < 1
  )
}

export const focusAtEnd = (element: HTMLElement) => {
  element.focus()

  const selection = window.getSelection()
  selection?.selectAllChildren(element)
  selection?.collapseToEnd()
}
