import { InMemoryCache, useApolloClient } from "@apollo/client";
import { useFormik } from "formik";
import findIndex from "lodash/findIndex";
import React from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import { getOrCreateChannelMutation } from "../graphql/mutation";
import { meQuery } from "../graphql/query";
import MultiSelectUsers from "./MultiSelectUsers";

const DirectMessageModal = ({ open, onClose, teamId, currentUserId }) => {
  const client = useApolloClient();
  const cache = new InMemoryCache();
  const formik = useFormik({
    initialValues: {
      members: [],
    },
    onSubmit: async (values) => {
      try {
        const res = await client.mutate({
          mutation: getOrCreateChannelMutation,
          variables: { members: values.members, teamId },
          update: (store, { data: { getOrCreateChannel } }) => {
            const { id, name } = getOrCreateChannel;

            const data = store.readQuery({ query: meQuery });
            const teamIdx = findIndex(data.me.teams, ["id", teamId]);
            const notInChannelList = data.me.teams[teamIdx].channels.every(
              (c) => c.id !== id
            );
            if (notInChannelList) {
              // data.me.teams[teamIdx].channels.push({
              //   __typename: "Channel",
              //   id,
              //   name,
              //   dm: true,
              // })
              store.writeQuery({
                query: meQuery,
                data: {
                  me: data.me.teams.map((team) =>
                    team.id === teamId
                      ? {
                          ...team,
                          channels: [
                            ...team.channels,
                            { __typename: "Channel", id, name, dm: true },
                          ],
                        }
                      : team
                  ),
                },
              });
            }
            // navigate(`/app/view-twam/${teamId}/${id}`)
          },
        });
      } catch (error) {
        console.error(error);
      }
      onClose();
      formik.resetForm();
    },
  });

  // if (loading) return "Loading..."
  // if (error) return `Error! ${error.message}`

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Direct Messaging</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <MultiSelectUsers
              value={formik.values.members}
              handleChange={(e, { value }) =>
                formik.setFieldValue("members", value)
              }
              teamId={teamId}
              placeholder="select members to message"
              currentUserId={currentUserId}
            />
          </Form.Field>
          <Form.Group>
            <Button
              disabled={formik.isSubmitting}
              fluid
              onClick={(e) => {
                formik.resetForm();
                onClose(e);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={formik.isSubmitting}
              fluid
              onClick={formik.handleSubmit}
            >
              Start Messaging
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default DirectMessageModal;

// const { loading, error, data } = useQuery(getTeamMembersQuery, {
//   variables: { teamId },
//   fetchPolicy: "network-only",
// })
{
  /* <Form.Field>
            <Downshift
              onChange={selectedUser => {
                window.location.replace(
                  `/app/view-team/${teamId}/user/${selectedUser.id}`
                )
                onClose()
              }}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex,
              }) => (
                <div>
                  <Input
                    {...getInputProps({
                      placeholder: "select members to messaging",
                    })}
                    fluid
                  />
                  {isOpen ? (
                    <div style={{ border: "1px solid #ccc" }}>
                      {data?.getTeamMembers
                        .filter(
                          i =>
                            !inputValue ||
                            i.username
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                        .map((item, index) => (
                          <div
                            {...getItemProps({ item })}
                            key={item.id}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ? "gray" : "white",
                              fontWeight:
                                selectedItem === item ? "bold" : "normal",
                            }}
                          >
                            {item.username}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              )}
            </Downshift>
          </Form.Field> */
}
{
  /* <Button fluid onClick={onClose}>
            Cancel
          </Button> */
}
