import { FC, FormEvent, useEffect, useState } from 'react';
import { Button, EndpointWrapper, Form, Heading } from './Components.styled';

import {
  initialize,
  EmbeddedManager,
  trackEmbeddedMessageReceived,
  trackEmbeddedMessageClick,
  trackEmbeddedSession
} from '@iterable/web-sdk';

interface Props { }

export const EmbeddedMessage: FC<Props> = () => {
  const [isFetchingEmbeddedMessages, setFetchingEmbeddedMessages] =
    useState<boolean>(false);

  useEffect(() => {
    initialize(process.env.API_KEY);
  }, []);

  const handleFetchEmbeddedMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFetchingEmbeddedMessages(true);
    try {
      await new EmbeddedManager().syncMessages('harrymash2006', () =>
        console.log('Synced message')
      );
    } catch (error: any) {
      setFetchingEmbeddedMessages(false);
    }
  };

  const submitEmbeddedMessagesReceivedEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const receivedMessage = {
      metadata: {
        messageId: 'abc123',
        campaignId: 1,
      },
      elements: {
        title: 'Welcome Message',
        body: 'Thank you for using our app!',
      },
    };

    trackEmbeddedMessageReceived(receivedMessage)
      .then(response => {
        console.log('Message reception tracked:', response);
      })
      .catch(error => {
        console.error('Error tracking message reception:', error);
      });
  };

  const submitEmbeddedMessagesClickEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      messageId: 'abc123',
      campaignId: 1,
    };

    const buttonIdentifier = 'button-123';
    const clickedUrl = 'https://example.com';
    const appPackageName = 'com.example.app';

    trackEmbeddedMessageClick(payload, buttonIdentifier, clickedUrl, appPackageName)
      .then(response => {
        console.log('Click tracking successful:', response);
      })
      .catch(error => {
        console.error('Error tracking click:', error);
      });
  };

  const submitEmbeddedMessagesImpressionEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sessionData = {
      id: '123',
      start: new Date(),
      end: new Date(),
      impressions: [
        {
          messageId: 'abc123',
          displayCount: 3,
          duration: 10,
        },
        {
          messageId: 'def456',
          displayCount: 2,
          duration: 8,
        },
      ],
    };

    trackEmbeddedSession(sessionData)
      .then(response => {
        console.log('Session tracking successful:', response);
      })
      .catch(error => {
        console.error('Error tracking session:', error);
      });
  };

  return (
    <>
      <h1>Embedded Message</h1>
      <Heading>GET /embedded-messaging/events/received</Heading>
      <EndpointWrapper>
        <Form onSubmit={handleFetchEmbeddedMessages} data-qa-cart-submit>
          <Button disabled={isFetchingEmbeddedMessages} type="submit">
            Fetch Embedded Messages
          </Button>
        </Form>
      </EndpointWrapper>

      <Heading>POST /embedded-messaging/events/received</Heading>
      <EndpointWrapper>
        <Form onSubmit={submitEmbeddedMessagesReceivedEvent} data-qa-cart-submit>
          <Button type="submit">
            Submit
          </Button>
        </Form>
      </EndpointWrapper>

      <Heading>POST /embedded-messaging/events/click</Heading>
      <EndpointWrapper>
        <Form onSubmit={submitEmbeddedMessagesClickEvent} data-qa-cart-submit>
          <Button type="submit">
            Submit
          </Button>
        </Form>
      </EndpointWrapper>

      <Heading>POST /embedded-messaging/events/impression</Heading>
      <EndpointWrapper>
        <Form onSubmit={submitEmbeddedMessagesImpressionEvent} data-qa-cart-submit>
          <Button type="submit">
            Submit
          </Button>
        </Form>
      </EndpointWrapper>
    </>
  );
};

export default EmbeddedMessage;