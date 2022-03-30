import * as React from 'react'
import { Dialog } from '@progress/kendo-react-dialogs'
import { observer } from 'mobx-react-lite'
import {
  Form,
  Field,
  FormElement,
  FieldRenderProps,
  FormRenderProps,
} from '@progress/kendo-react-form'
import { Error } from '@progress/kendo-react-labels'
import { Input } from '@progress/kendo-react-inputs'
import { useStore } from '../../store/store'
import { useState } from 'react'
import { DropDownList } from '@progress/kendo-react-dropdowns'
import { userType } from '../../types'

const user = {
  userName: '',
  firstName: '',
  lastName: '',
  fullName: '',
  lastLogin: '02-02-2022',
  enabled: '',
}

const Validator = (values: any) => {
  return values ? "" : "This field is required"
}
const ValidatedInput = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  )
}

const AddUser = observer((props: any) => {
  const { dataStore } = useStore()
  const [userData, setUserData] = useState(user)
  const handleChange = (
    event: { target: { name: string; value: string }; value: string } | any,
  ) => {

    if (event.target.name === 'userName') {
      setUserData({ ...userData, userName: event.value })
    } else if (event.target.name === 'firstName') {
      setUserData({ ...userData, firstName: event.value })
    } else if (event.target.name === 'lastName') {
      setUserData({ ...userData, lastName: event.value })
    } else if (event.target.name === 'enabled') {
      setUserData({ ...userData, enabled: event.value })
    }
  }
  const handleSubmit = () => {
    const newUser = userData
    const fullName = newUser.firstName.trim() + newUser.lastName.trim()
    if (fullName.length > 40) {
      alert('Full name must be less than 40 character')
      return
    } else {
      newUser.fullName =
        newUser.firstName.trim() + ' ' + newUser.lastName.trim()
    }
    if (newUser.userName.trim().length > 0) {
      let notUnique = false
      dataStore.data.map((item: userType | any) => {
        if (item.userName == newUser.userName) notUnique = true
      })
      if (notUnique) {
        alert('This user already exist. Please try another user')
        return
      }
      props.addUser(newUser)
    } else {
      alert('user name must have some character')
      return
    }
  }
  return (
    <Dialog title={`Add User`} onClose={props.cancelEdit}>
      <div
        className="row example-wrapper"
        style={{
          width: 650,
        }}
      >
        <Form
          onSubmit={handleSubmit}
          render={(formRenderProps: FormRenderProps) => (
            <FormElement style={{ maxWidth: 650 }}>
              <fieldset className={'k-form-fieldset'}>
                <legend>Add User:</legend>
                {formRenderProps.visited &&
                  formRenderProps.errors &&
                  formRenderProps.errors.VALIDATION_SUMMARY && (
                    <div className={'k-messagebox k-messagebox-error'}>
                      {formRenderProps.errors.VALIDATION_SUMMARY}
                    </div>
                  )}
                <div className="mb-3">
                  <Field
                    name={'userName'}
                    component={ValidatedInput}
                    validator={Validator}
                    pattern={'[A-Za-z0-9_ ]+'}
                    minLength={2}
                    maxLength={25}
                    label={'Username'}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <Field
                    name={'firstName'}
                    component={ValidatedInput}
                    validator={Validator}
                    pattern={'[A-Za-z0-9_ ]+'}
                    minLength={2}
                    maxLength={25}
                    label={'First Name'}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <Field
                    name={'lastName'}
                    component={ValidatedInput}
                    validator={Validator}
                    pattern={'[A-Za-z0-9_ ]+'}
                    minLength={2}
                    maxLength={25}
                    label={'Last Name'}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ width: '15%' }}>
                  <DropDownList
                    name={'enabled'}
                    label={'Enabled'}
                    data={['Yes', 'No']}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
              <div className="k-form-buttons">
                <button
                  type={'submit'}
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                  disabled={!formRenderProps.allowSubmit}
                >
                  Submit
                </button>
              </div>
            </FormElement>
          )}
        />
      </div>
    </Dialog>
  )
})
export default AddUser
