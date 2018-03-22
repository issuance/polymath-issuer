import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, InlineNotification } from 'carbon-components-react'
import { SecurityTokenRegistrar } from 'polymath.js_v2'
import type { SecurityToken } from 'polymath.js_v2/types'

import { tokenDetails, completeToken } from './actions'
import NotFoundPage from '../NotFoundPage'
import { etherscanAddress, etherscanToken } from '../helpers'
import CompleteTokenForm from './components/CompleteTokenForm'

import './style.css'

class TokenPage extends Component {
  static propTypes = {
    init: PropTypes.func.isRequired,
    complete: PropTypes.func.isRequired,
    // eslint-disable-next-line
    token: PropTypes.object,
    isMainnet: PropTypes.bool.isRequired,
  }

  handleCompleteSubmit = () => {
    this.props.complete()
  }

  completeToken (token: SecurityToken) {
    const completeFee = SecurityTokenRegistrar.fee.toNumber()
    return (
      <div>
        <InlineNotification
          title={'Complete ' + token.ticker + ' Token Registration'}
          subtitle='Complete your security token registration before it expires. If your registration expires the token symbol you selected will be made available for others to claim.'
          kind='warning'
          hideCloseButton
        />
        <h3 className='bx--type-beta'>Security Token Issuance</h3><br />
        <p>
          You are one step away from issuing the security token for your company.
          Please complete your token details to finish the process.
          Issuing a Security Token requires a payment of <strong>{completeFee} POLY</strong> tokens. *
        </p>
        <br />
        <CompleteTokenForm onSubmit={this.handleCompleteSubmit} />
        <br /><br />
        <p className='bx--type-caption'>
          * If you don’t own any POLY tokens,{' '}
          {this.props.isMainnet ?
            <span>please{' '} <a href='https://polymath.network'>get in touch with us</a></span> :
            <span> they will be automatically requested from the Polymath testnet faucet</span>
          }
          .
        </p>
      </div>
    )
  }

  render () {
    if (!this.props.token) {
      return <NotFoundPage />
    }
    const token: SecurityToken = this.props.token
    return (
      <DocumentTitle title={token.ticker + ' Token – Polymath'}>
        <div>
          <div className='bx--row'>
            <div className='bx--col-xs-12'>
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to='/'>Home</Link>
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
          </div>
          <div className='bx--row'>
            <div className='bx--col-xs-5'>
              <h1 className='bx--type-mega'>{token.ticker} Token</h1>
              <div className='bx--form-item'>
                <label htmlFor='owner' className='bx--label'>Owner</label>
                <p>{etherscanAddress(token.owner)}</p>
              </div>
              <div className='bx--form-item'>
                <label htmlFor='owner' className='bx--label'>Contact email</label>
                <p><a href={'mailto://' + token.contact}>{token.contact}</a></p>
              </div>
            </div>
            <div className='bx--col-xs-7'>
              {token.isGenerated ? (
                <div className='completed-token-details'>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Address</label>
                    <p>{etherscanToken(token.address)}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Name</label>
                    <p>{token.name}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Decimals</label>
                    <p>{token.decimals}</p>
                  </div>
                  <div className='bx--form-item'>
                    <label htmlFor='owner' className='bx--label'>Website</label>
                    <p><a href={token.url} target='_blank'>{token.url}</a></p>
                  </div>
                </div>
              ) : this.completeToken(token)}
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.dashboard.token,
  isMainnet: state.network.id === 1,
})

const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(tokenDetails()),
  complete: () => dispatch(completeToken()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenPage)
