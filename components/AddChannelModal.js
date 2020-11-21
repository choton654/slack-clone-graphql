import { useApolloClient, useMutation } from "@apollo/client"
import { useFormik } from "formik"
import { findIndex } from "lodash"
import React from "react"
import { Button, Checkbox, Form, Input, Modal } from "semantic-ui-react"
import { CREATE_CHANNEL } from "../graphql/mutation"
import { allTeamsQuery, meQuery } from "../graphql/query"
import MultiSelectUsers from "./MultiSelectUsers"

function AddChannelModal({ open, onClose, teamId, currentUserId }) {
  const client = useApolloClient()
  const formik = useFormik({
    initialValues: {
      name: "",
      public: true,
      members: [],
    },
    onSubmit: async values => {
      try {
        const res = await client.mutate({
          mutation: CREATE_CHANNEL,
          variables: {
            teamId,
            name: values.name,
            public: values.public,
            members: values.members,
          },
          optimisticResponse: {
            createChannel: {
              __typename: "Mutation",
              ok: true,
              channel: {
                __typename: "Channel",
                id: -1,
                name: values.name,
                dm: false,
              },
            },
          },
          update: (store, { data: { createChannel } }) => {
            const { ok, channel } = createChannel

            if (!ok) {
              return
            }
            const data = store.readQuery({ query: meQuery })
            // const teamIdx = findIndex(data.me.teams, ["id", teamId])
            // data.me.teams[teamIdx].channels.push(channel)
            store.writeQuery({
              query: meQuery,
              data: {
                me: data.me.teams.map(team =>
                  team.id === teamId
                    ? {
                        ...team,
                        channels: [...team.channels, channel],
                      }
                    : team
                ),
              },
            })
          },
        })
      } catch (error) {
        console.error(error)
      }
      onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Field>
            <Input
              fluid
              name="name"
              value={formik.values.name}
              placeholder="Channel Name"
              onChange={formik.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              toggle
              label="Private"
              checked={!formik.values.public}
              onChange={(e, { checked }) => {
                console.log(checked)
                formik.setFieldValue("public", !checked)
              }}
            />
          </Form.Field>
          {formik.values.public ? null : (
            <Form.Field>
              <MultiSelectUsers
                value={formik.values.members}
                handleChange={(e, { value }) => {
                  console.log(value)
                  formik.setFieldValue("members", value)
                }}
                teamId={teamId}
                currentUserId={currentUserId}
                placeholder="select members to invite"
              />
            </Form.Field>
          )}
          <Form.Group widths="equal">
            <Button fluid onClick={onClose}>
              Cancel
            </Button>
            <Button fluid>Create Channel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AddChannelModal

// createChannel({
//   optimisticResponse: {
//     createChannel: {
//       __typename: "Mutation",
//       ok: true,
//       channel: {
//         __typename: "Channel",
//         id: -1,
//         name: values.name,
//       },
//     },
//   },
//   variables: {
//     teamId,
//     name: values.name,
//     public: values.public,
//     members: values.members,
//   },
// })
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => console.error(err.message))

//   },
// })

// const [createChannel] = useMutation(CREATE_CHANNEL, {
//   update: (store, { data: { createChannel } }) => {
//     const { ok, channel } = createChannel
//     console.log("channel", createChannel)
//     if (!ok) {
//       return
//     }

//     const data = store.readQuery({ query: meQuery })
//     console.log(data)
//     const teamIdx = findIndex(data.me.teams, ["id", teamId])
//     data.me.teams[teamIdx].channels.push(channel)
//     store.writeQuery({
//       query: meQuery, data: {
//         me: data.me.teams.map(team => team.id === teamId ? {...team, channels: [...team.channels, channel ]} : team)
//       }  })

// const data = cache.readQuery({ query: allTeamsQuery })
// console.log("data", data)
// cache.writeQuery({
//   query: allTeamsQuery,
//   data: {
//     allTeams: data.allTeams.map(team => {
//       if (team.id === teamId) {
//         return {
//           ...team,
//           channels: [...team.channels, channel],
//         }
//       } else return team
//     }),
//   },
// })
// },
// })
