import * as React from 'react'
import { mount } from '@cypress/react'
import App from './App'
it('should render App', () => {
  mount(<App />)
  cy.get('h1').contains('Mindmapping')
})
