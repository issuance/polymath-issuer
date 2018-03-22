// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { RouterHistory } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Contract from 'polymath.js_v2'
import { Toaster, ToasterContainer } from 'polymath-ui'

import 'polymath-ui/dist/style.css'
import 'carbon-components/css/carbon-components.min.css'
import './style.css'

import { setupHistory, txHash, txEnd } from './ui/actions'
import { etherscanTx } from './helpers'
import type { Notify } from './ui/state.types'

type Props = {
  route: any, // react-router-config doesn't seem to have Flow types.
  history: RouterHistory,
  setupHistory: (RouterHistory) => void,
  network: any, // TODO Adam0000: Use polymath-auth exported type once it exists
  txHash: (string) => Promise<void>,
  txEnd: (string) => Promise<void>,
  isLoading: boolean,
  loadingMessage: ?string,
  miningTxHash: ?string,
  notify: ?Notify,
}

class App extends Component<Props> {
  toaster: ?Toaster

  componentWillMount () {
    this.props.setupHistory(this.props.history)
    Contract.params = {
      ...this.props.network,
      txHashCallback: (hash) => this.props.txHash(hash),
      txEndCallback: (receipt) => this.props.txEnd(receipt),
    }
  }

  componentWillReceiveProps (nextProps) {
    const notify = nextProps.notify

    if (notify && notify !== this.props.notify && this.toaster) {
      this.toaster.show({
        title: notify.title || '',
        subtitle: notify.subtitle || '',
        caption: notify.caption || null,
        kind: notify.isSuccess ? 'success' : 'error',
      }, notify.isPinned ? 0 : 4000)
    }
  }

  referenceToaster = (toaster) => this.toaster = toaster

  render () {
    const hash = this.props.miningTxHash

    return (
      <div>
        <ToasterContainer>
          <Toaster ref={this.referenceToaster} />
        </ToasterContainer>
        {this.props.isLoading ? (
          <DocumentTitle title={this.props.loadingMessage}>
            <div className='bx--grid'>
              <h3 className='bx--type-beta'>{this.props.loadingMessage}</h3>
              {hash ? (
                <p>
                  <br />
                  Transaction hash:{' '}
                  { etherscanTx(hash, true) }
                </p>
              ) : ''}
            </div>
          </DocumentTitle>
        ) : (
          <div className='bx--grid'>
            {renderRoutes(this.props.route.routes)}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  network: state.network,
  isLoading: state.ui.isLoading,
  loadingMessage: state.ui.loadingMessage,
  miningTxHash: state.ui.txHash,
  notify: state.ui.notify,
})

const mapDispatchToProps = {
  setupHistory,
  txHash,
  txEnd,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
