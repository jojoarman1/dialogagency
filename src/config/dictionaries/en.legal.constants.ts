import { LEGAL_OPERATOR, LEGAL_SITE_HOST } from '../legal'
import type { LegalDictionary } from './dictionary.types'

const OPERATOR_NAME = 'Artem Ilshatovich Mukhametdinov'
const OPERATOR_LINE = `${OPERATOR_NAME}, a payer of the professional income tax (self-employed), taxpayer number (INN) ${LEGAL_OPERATOR.inn}, email for requests: ${LEGAL_OPERATOR.email}`
const DATA_LIST =
  'name; email address or Telegram username; answers in the chat on the site (subject of the request, project details, role, country, information about yourself, message text)'
const TELEGRAM_RECIPIENT =
  "Telegram (Telegram FZ-LLC, United Arab Emirates): the request is forwarded to the operator's private channel"

// A courtesy translation of RU_LEGAL; the Russian version is the binding one
export const EN_LEGAL: LegalDictionary = {
  operatorName: OPERATOR_NAME,
  updatedLabel: 'Version of',
  operatorLabel: 'Personal data operator',
  translationNote:
    'This is a translation provided for convenience. The Russian version of this document is the legally binding one.',
  privacy: {
    title: 'Personal data processing policy',
    sections: [
      {
        id: 'general',
        title: '1. General provisions',
        paragraphs: [
          `This Policy is drawn up under Russian Federal Law No. 152-FZ "On Personal Data" of 27.07.2006 and sets out how the personal data of visitors to ${LEGAL_SITE_HOST} is processed.`,
          `Personal data operator: ${OPERATOR_LINE}.`,
          'By using the site and sending a request, the visitor reads this Policy. Personal data from a request is processed only with a separate consent, which the visitor gives by ticking a box in the chat before sending.'
        ]
      },
      {
        id: 'data',
        title: '2. What data is processed',
        paragraphs: [
          `Data the visitor enters in the chat: ${DATA_LIST}.`,
          'Data about visits to the site, only if the visitor has accepted cookies: cookies, IP address, browser and device details, pages and actions on the site. It is collected by the Yandex Metrica service.'
        ]
      },
      {
        id: 'purposes',
        title: '3. Purposes of processing',
        paragraphs: [
          'Reviewing the request, contacting the visitor about it and preparing a proposal for cooperation.',
          'Analysing traffic and improving the site, if the visitor has accepted cookies.'
        ]
      },
      {
        id: 'basis',
        title: '4. Legal basis',
        paragraphs: [
          "The data subject's consent to the processing of their personal data (clause 1, part 1, article 6 of Federal Law No. 152-FZ)."
        ]
      },
      {
        id: 'actions',
        title: '5. How data is processed and shared with third parties',
        paragraphs: [
          'The operator collects, records, organises, stores, updates, uses, transfers, deletes and destroys personal data by automated means.',
          `To deliver a request, the data is sent to the messenger ${TELEGRAM_RECIPIENT}. This is a cross-border transfer of personal data.`,
          'Data about visits to the site is processed by YANDEX LLC (the Yandex Metrica service) under its own terms.',
          'The operator does not sell personal data and does not share it with other third parties, except where the law requires it.'
        ]
      },
      {
        id: 'storage',
        title: '6. Storage periods',
        paragraphs: [
          'Personal data from a request is kept until the purposes of processing are achieved, but no longer than 3 years after the last request, or until consent is withdrawn.',
          "Cookies are kept as long as the browser's settings allow, and no longer than 1 year. The visitor can delete cookies in the browser's settings at any time."
        ]
      },
      {
        id: 'rights',
        title: "7. The data subject's rights",
        paragraphs: [
          'The visitor has the right to learn how their personal data is processed, to have it corrected, blocked or destroyed, and to withdraw their consent to processing.',
          `To do so, it is enough to write to the operator at ${LEGAL_OPERATOR.email}. The operator replies within 10 working days of receiving the request.`,
          'Declining cookies does not stop anyone from using the site: analytics is simply not loaded.'
        ]
      },
      {
        id: 'security',
        title: '8. Data protection',
        paragraphs: [
          'Data is sent over the secure HTTPS protocol. Only the operator has access to requests. The operator takes legal, organisational and technical measures to protect personal data from unauthorised access, alteration and destruction.'
        ]
      },
      {
        id: 'changes',
        title: '9. Changes to the Policy',
        paragraphs: [
          'The operator may change this Policy. A new version applies from the moment it is published on this page.'
        ]
      }
    ]
  },
  consent: {
    title: 'Consent to the processing of personal data',
    sections: [
      {
        id: 'consent',
        title: '',
        paragraphs: [
          `By ticking the consent box in the chat on ${LEGAL_SITE_HOST} before sending a request, I freely, of my own will and in my own interest give my consent to the operator ${OPERATOR_LINE} to process my personal data on the following terms.`
        ]
      },
      { id: 'data', title: 'Personal data', paragraphs: [`${DATA_LIST}.`] },
      {
        id: 'purpose',
        title: 'Purpose of processing',
        paragraphs: [
          'Reviewing my request, contacting me about it and preparing a proposal for cooperation.'
        ]
      },
      {
        id: 'actions',
        title: 'Actions with the data',
        paragraphs: [
          'Collection, recording, organisation, accumulation, storage, updating, retrieval, use, transfer (provision, access), blocking, deletion and destruction, by automated means.',
          `I agree to the cross-border transfer of the data to the messenger ${TELEGRAM_RECIPIENT}.`
        ]
      },
      {
        id: 'term',
        title: 'Term and withdrawal of consent',
        paragraphs: [
          'This consent is valid until the purpose of processing is achieved, but no longer than 3 years after it was given.',
          `I can withdraw this consent at any time by writing to the operator at ${LEGAL_OPERATOR.email}. After the withdrawal the operator stops processing and destroys the data within 30 days, unless the law provides otherwise.`
        ]
      }
    ]
  }
}
