import React from 'react';
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_EVENT } from '../utils/mutations';
import { removeEventId } from '../utils/localStorage';

import Auth from '../utils/auth';

const SavedEvents = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeEvent, { error }] = useMutation(REMOVE_EVENT);

  const userData = data?.me || {};

  const handleDeleteEvent = async (eventId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeEvent({
        variables: { eventId },
      });

      removeEventId(eventId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing {userData.username}'s Events!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedEvents?.length
            ? `Viewing ${userData.savedEvents.length} saved ${
                userData.savedEvents.length === 1 ? 'event' : 'events'
              }:`
            : 'You have no events saved.'}
        </h2>
        <CardColumns>
          {userData.savedEvents?.map((event) => {
            return (
              <Card key={event.eventId} border="dark">
                {event.image ? (
                  <Card.Img
                    src={event.image}
                    alt={`The cover for ${event.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <p className="small">Host: {event.host}</p>
                  <Card.Text>{event.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteEvent(event.eventId)}
                  >
                    Delete event.
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedEvents;
