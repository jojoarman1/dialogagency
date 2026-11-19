export const CHAT_STEP_IDS = [
  'name',
  'subject',
  'project',
  'projectNeeds',
  'projectDeadline',
  'job',
  'internship',
  'country',
  'about',
  'something',
  'contact'
] as const
export type ChatStepId = (typeof CHAT_STEP_IDS)[number]

// Language-independent: the answers carry these ids, the dictionaries give their wording
export const CHAT_OPTION_IDS = [
  'newProject',
  'job',
  'internship',
  'something',
  'platform',
  'mobileApp',
  'companySite',
  'onlineStore',
  'marketingSite',
  'portfolioSite',
  'projectOther',
  'branding',
  'design',
  'development',
  'asap',
  'threeMonths',
  'sixMonths',
  'yourTerms',
  'deadlineOther',
  'designer',
  'frontendDeveloper',
  'backendDeveloper',
  'qaEngineer',
  'projectManager',
  'jobOther',
  'frontend',
  'backend',
  'projectManagement'
] as const
export type ChatOptionId = (typeof CHAT_OPTION_IDS)[number]

export interface ChatOption {
  id: ChatOptionId
  next?: ChatStepId
}

export interface ChatStep {
  next?: ChatStepId
  isNewParagraph?: boolean
  isMultiline?: boolean
  isMultiselect?: boolean
  inputMode?: 'text' | 'email'
  isContact?: boolean
  options?: ChatOption[]
}

export const CHAT_FIRST_STEP_ID: ChatStepId = 'name'

const options = (...ids: ChatOptionId[]) => ids.map(id => ({ id }))

export const CHAT_STEPS: Record<ChatStepId, ChatStep> = {
  name: { next: 'subject' },
  subject: {
    options: [
      { id: 'newProject', next: 'project' },
      { id: 'job', next: 'job' },
      { id: 'internship', next: 'internship' },
      { id: 'something', next: 'something' }
    ]
  },
  project: {
    next: 'projectNeeds',
    isNewParagraph: true,
    options: options(
      'platform',
      'mobileApp',
      'companySite',
      'onlineStore',
      'marketingSite',
      'portfolioSite',
      'projectOther'
    )
  },
  projectNeeds: {
    next: 'projectDeadline',
    isMultiselect: true,
    options: options('branding', 'design', 'development')
  },
  projectDeadline: {
    next: 'contact',
    options: options('asap', 'threeMonths', 'sixMonths', 'yourTerms', 'deadlineOther')
  },
  job: {
    next: 'country',
    isNewParagraph: true,
    options: options(
      'designer',
      'frontendDeveloper',
      'backendDeveloper',
      'qaEngineer',
      'projectManager',
      'jobOther'
    )
  },
  internship: {
    next: 'country',
    isNewParagraph: true,
    options: options('frontend', 'backend', 'projectManagement')
  },
  country: { next: 'about', isNewParagraph: true },
  about: { next: 'contact', isNewParagraph: true, isMultiline: true },
  something: { next: 'contact', isNewParagraph: true, isMultiline: true },
  contact: {
    isNewParagraph: true,
    // The email keyboard has @ for a Telegram username too
    inputMode: 'email',
    isContact: true
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// @username, username or a t.me link; 4-character usernames exist too (sold on Fragment)
const TELEGRAM_PATTERN = /^(?:@|(?:https?:\/\/)?t\.me\/)?[a-z][a-z0-9_]{3,31}$/i

export const isChatContact = (value: string) =>
  EMAIL_PATTERN.test(value) || TELEGRAM_PATTERN.test(value)

// An email is at most 254 characters
const CHAT_MAX_LENGTH = { line: 100, contact: 254, multiline: 2000 }

export const getChatMaxLength = (step: ChatStep) => {
  if (step.isContact) return CHAT_MAX_LENGTH.contact
  return step.isMultiline ? CHAT_MAX_LENGTH.multiline : CHAT_MAX_LENGTH.line
}

export const CHAT_SEND_STATUSES = ['idle', 'sending', 'error'] as const
export type ChatSendStatus = (typeof CHAT_SEND_STATUSES)[number]

export const getChatSendStatus = (isSending: boolean, isSendError: boolean): ChatSendStatus => {
  if (isSending) return 'sending'
  return isSendError ? 'error' : 'idle'
}
