import { useFormik } from "formik"
import React from "react"
import { Button, Input } from "semantic-ui-react"
import styled from "styled-components"
import FileUpload from "./FileUploads"

const SendMessageWrapper = styled.div`
  grid-column: 3;
  padding: 20px;
  grid-row: 3;
  ${"" /* display: grid;
  grid-template-columns: 3% auto; */}
`

function SendMessage({ placeholder, channelId, msgSubmit }) {
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: values => {
      msgSubmit(values.message)
      formik.resetForm({ message: "" })
    },
  })

  const ENTER_KEY = 13

  return (
    <SendMessageWrapper>
      {/* <FileUpload channelId={channelId} /> */}
      <Input
        fluid
        onKeyDown={e => {
          if (e.keyCode === ENTER_KEY) {
            formik.handleSubmit(e)
          }
        }}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="message"
        value={formik.values.message}
        placeholder={`Message #${placeholder}`}
      />
    </SendMessageWrapper>
  )
}

export default SendMessage
