// @flow

import { Button, Form } from 'carbon-components-react'
import { bull, getAccountData, TextInput } from 'polymath-ui'
import { required, email } from 'polymath-ui/dist/validate'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { reduxForm, Field } from 'redux-form'

import { confirmEmail } from './actions'

export const formName = 'confirmEmail'

class ConfirmEmailFormUnwrapped extends Component<any> {
  render () {
    return (
      <Form onSubmit={this.props.handleSubmit} className='confirm-email-form'>
        <Field
          name='email'
          component={TextInput}
          placeholder='you@example.com'
          validate={[required, email]}
        />
        <Button type='submit'>
          Send Confirmation Email
        </Button>
      </Form>
    )
  }
}

const ConfirmEmailForm = reduxForm({
  form: formName,
})(ConfirmEmailFormUnwrapped)

type StateProps = {|
  email: string,
|}

type DispatchProps = {|
  confirmEmail: () => mixed,
|}

type Props = StateProps & DispatchProps

const mapStateToProps = (state) => {
  const accountData = getAccountData(state)
  let email = ''

  if (accountData && accountData.account) {
    email = accountData.account.email
  }

  return {
    email,
  }
}

const mapDispatchToProps = {
  confirmEmail,
}

class ConfirmEmailPage extends Component<Props> {
  handleSubmit = () => {
    this.props.confirmEmail()
  }

  render () {
    return (
      <DocumentTitle title='Sign Up – Polymath'>
        <div className='pui-single-box'>
          <div className='pui-single-box-header'>
            <div className='pui-single-box-bull'>
              <img src={bull} alt='Bull' />
            </div>
            <h1 className='pui-h1'>Verify Your Email Address</h1>
            <h3 className='pui-h4'>
              Please check that we can contact you at the email address below.
              Once you have confirmed your email address {'we\'ll'} send you a copy
              of your transaction details.
            </h3>
            <div className='pui-clearfix' />
            <ConfirmEmailForm
              onSubmit={this.handleSubmit}
              initialValues={{ email: this.props.email }}
            />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmailPage)
