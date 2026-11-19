import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getPathLocale, localizePath, matchAcceptLanguage, switchPathLocale } from './locale.utils'

describe('localizePath', () => {
  it('Should put the language in front of the path, keeping the hash', () => {
    assert.equal(localizePath('en', '/'), '/en')
    assert.equal(localizePath('en', '/#works'), '/en#works')
    assert.equal(localizePath('ru', '/privacy'), '/ru/privacy')
  })
})

describe('getPathLocale', () => {
  it('Should read only a known language from the first segment', () => {
    assert.equal(getPathLocale('/en/privacy'), 'en')
    assert.equal(getPathLocale('/ru'), 'ru')
    assert.equal(getPathLocale('/privacy'), null)
    assert.equal(getPathLocale('/english'), null)
  })
})

describe('switchPathLocale', () => {
  it('Should keep the page and swap the language', () => {
    assert.equal(switchPathLocale('/ru/privacy', 'en'), '/en/privacy')
    assert.equal(switchPathLocale('/ru', 'en'), '/en')
  })
})

describe('matchAcceptLanguage', () => {
  it('Should pick the most wanted language the site has', () => {
    assert.equal(matchAcceptLanguage('en-GB,en;q=0.9,ru;q=0.8'), 'en')
    assert.equal(matchAcceptLanguage('de-DE,ru;q=0.9,en;q=0.8'), 'ru')
    assert.equal(matchAcceptLanguage('ru;q=0.5,en;q=0.9'), 'en')
  })

  it('Should fall back to Russian when nothing matches or there is no header', () => {
    assert.equal(matchAcceptLanguage('de-DE,fr;q=0.9'), 'ru')
    assert.equal(matchAcceptLanguage(null), 'ru')
  })
})
