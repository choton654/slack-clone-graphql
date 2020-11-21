import { useMutation } from "@apollo/client"
import { useFormik } from "formik"
import React, { useState } from "react"
import { Button, Form, Input, Modal } from "semantic-ui-react"
import { addTeamMemberMutation } from "../graphql/mutation"

function InvitePeopleModal({ open, onClose, teamId }) {
  const [error, seterror] = useState("")

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: values => {
      console.log(values)
      console.log(teamId)
      addTeamMember({
        variables: {
          email: values.email,
          teamId,
        },
      })
        .then(res => {
          console.log(res)
          const {
            data: { addTeamMember },
          } = res
          if (!addTeamMember.ok) {
            seterror(addTeamMember.error.error)
          } else {
            onClose()
          }
          formik.resetForm({ email: "" })
        })
        .catch(err => console.error(err.message))
    },
  })

  const [addTeamMember] = useMutation(addTeamMemberMutation)

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Add People To Team</Modal.Header>
      <Modal.Content>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <Input
              fluid
              name="email"
              value={formik.values.email}
              placeholder="Enter User email"
              onChange={formik.handleChange}
            />
          </Form.Field>
          {error && <h4>{error}</h4>}
          <Form.Group widths="equal">
            <Button fluid onClick={onClose}>
              Cancel
            </Button>
            <Button fluid type="submit">
              Add People
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default InvitePeopleModal
