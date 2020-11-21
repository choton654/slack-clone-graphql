import { useMutation } from "@apollo/client"
import React from "react"
import Dropzone from "react-dropzone"
import { Button } from "semantic-ui-react"
import { createMessageMutation, SingleUpload } from "../graphql/mutation"

const FileUpload = ({ disableClick, channelId }) => {
  // const [createMessage] = useMutation(createMessageMutation, {
  //   onCompleted: data => console.log(data),
  //   onError: err => console.error(err),
  // })
  const [singleUpload] = useMutation(SingleUpload, {
    onCompleted: data => console.log(data),
    onError: err => console.error(err),
  })

  return (
    <Dropzone
      className="ignore"
      onDrop={([file]) => {
        console.log(file)
        // createMessage({
        //   variables: { channelId, file },
        // })
        singleUpload({
          variables: { file },
        })
      }}
      disableClick={disableClick}
    >
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
            <Button icon="plus" />
          </div>
        </section>
      )}
    </Dropzone>
  )
}
export default FileUpload
