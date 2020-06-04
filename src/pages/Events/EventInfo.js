import React, { useState, useEffect, useRef, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { AnimFade, media } from 'utils/style';
import { useScrollRestore, useWindowSize, useAppContext } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';

function EventInfo(props) {
  const { match: { params: { eventID } } } = props;
  const { events, user, dispatch } = useAppContext();
  const activeEvent = events?.length > 0 && events.filter(({ id }) => id === eventID)[0];
  const otherEvents = events?.length > 0 && events.filter(({ id }) => id !== eventID);
  const isPlaying = user && activeEvent?.players[user?.id];
  const cta = useRef();
  const [visible, setVisible] = useState();
  const { width } = useWindowSize();
  const isMobile = width <= media.mobile;
  useScrollRestore();

  const handleRedirect = () => {
    dispatch({ type: 'setRedirect', value: `/events/signup/${eventID}` });
  };

  const buttonProps = user
    ? {
      label: isPlaying ? 'Update' : 'Signup',
      to: `/events/signup/${eventID}`
    }
    : {
      label: 'Signup',
      onClick: handleRedirect,
      href: config.authURL
    };

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);

          return visible ? false : setVisible(true);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    if (activeEvent) sectionObserver.observe(cta.current);

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visible, activeEvent]);

  return (
    <Fragment>
      {(!activeEvent && events) && <NotFound />}
      {(activeEvent || !events) &&
        <Fragment>
          <Helmet
            title={`Event ${activeEvent?.name || ''} - Project Modern`}
          />
          <PageLayout>
            <Transition
              appear={!prerender}
              in={!prerender}
              timeout={3000}
              onEnter={reflow}
            >
              {status => (
                <EventsInfoWrapper>
                  <EventsInfoHeader status={status}>
                    <InfoPanel>
                      <Title2 loading={!activeEvent?.name ? 1 : 0}>{activeEvent.name}</Title2>
                      <Paragraph loading={!activeEvent?.description ? 1 : 0}>{activeEvent.description}</Paragraph>
                      {(activeEvent && !isMobile) && <Button {...buttonProps} />}
                    </InfoPanel>
                    <InfoPanel>
                      <div>
                        <Tag loading={!activeEvent?.time ? 1 : 0}>
                          <label>Date:</label>
                          {activeEvent?.time && new Date(parseInt(activeEvent.time)).toLocaleDateString('default', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Tag>
                        <Tag loading={!activeEvent?.time ? 1 : 0}>
                          <label>Time:</label>
                          {activeEvent?.time && new Date(parseInt(activeEvent.time)).toLocaleTimeString('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short',
                          })}
                        </Tag>
                        {activeEvent?.platform &&
                          <Tag>
                            <label>Platform:</label>
                            {activeEvent.platform}
                          </Tag>
                        }
                        {activeEvent?.players &&
                          <Tag>
                            <label>Players:</label>
                            {Object.values(activeEvent.players).length}
                          </Tag>
                        }
                      </div>
                      {(activeEvent && isMobile) && <Button style={{ marginTop: '50px' }} {...buttonProps} />}
                      <RelatedEvents>
                        <h4>{otherEvents.length > 0 && 'Other Events'}</h4>
                        {!otherEvents.length > 0 &&
                          <Paragraph loading={1}>
                            <br/><br/><br/>
                          </Paragraph>
                        }
                        {activeEvent && otherEvents.map(({ id, name }, index) => index < 4 && (
                          <Anchor
                            key={id}
                            secondary={1}
                            as={Link}
                            to={`/events/${id}`}
                          >
                            {name}
                          </Anchor>
                        ))}
                      </RelatedEvents>
                    </InfoPanel>
                  </EventsInfoHeader>
                </EventsInfoWrapper>
              )}
            </Transition>
            <GetStarted
              accent
              sectionRef={cta}
              visible={visible}
            />
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
}

const EventsInfoWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 0 var(--space2XL);

  @media (max-width: ${media.mobile}px) {
    padding: 0 var(--spaceL);
  }
`;

const EventsInfoHeader = styled.div`
  display: grid;
  grid-gap: var(--space3XL);
  grid-template-columns: 1fr auto;
  margin: var(--space7XL) auto;
  max-width: var(--maxWidthXL);
  opacity: 0;
  width: 100%;

  @media (max-width: ${media.desktop}px) {
    max-width: var(--maxWidthL);
  }

  @media (max-width: ${media.laptop}px) {
    max-width: var(--maxWidthM);
  }

  @media (max-width: ${media.tablet}px) {
    grid-template-columns: 1fr;
    max-width: var(--maxWidthS);
  }

  @media (max-width: ${media.mobile}px) {
    grid-gap: var(--space2XL);
    margin: var(--space4XL) auto;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const InfoPanel = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  position: relative;

  :first-of-type {
    ${Paragraph} {
      margin-top: var(--spaceXL);

      :first-of-type {
        margin-top: var(--space2XL);
      }
    }

    a {
      bottom: 0;
      margin-top: var(--space3XL);
      position: absolute;
      width: 0;
    }
  }

  @media (max-width: ${media.tablet}px) {
    width: 100%;
    margin-top: var(--space2XL);

    :first-of-type {
      margin-top: 0;

      a {
        margin-top: var(--space2XL);
        position: relative;
      }
    }
  }
`;

const Tag = styled(Paragraph)`
  align-items: center;
  color: var(--colorTextTitle);
  display: flex;
  margin-top: var(--spaceM);

  :first-of-type {
    margin-top: 0;
  }

  ::before {
    background-color: rgb(var(--rgbAccent));
    border-radius: 50%;
    content: '';
    display: inline-block;
    height: var(--spaceXS);
    margin-right: var(--spaceL);
    width: var(--spaceXS);
    align-self: center;
  }

  label {
    font-weight: var(--fontWeightSemiBold);
    margin-right: var(--spaceS);
  }
`;

const RelatedEvents = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  margin-top: var(--space9XL);

  h4 {
    color: var(--colorTextTitle);
    font-size: var(--fontSizeH4);
    font-weight: var(--fontWeightBold);
    letter-spacing: var(--letterSpacingH4);
    line-height: var(--lineHeightLabel);
    margin-bottom: var(--spaceS);
    text-transform: uppercase;
  }

  a {
    margin: var(--spaceS) 0;
  }

  @media (max-width: ${media.tablet}px) {
    margin-top: var(--space2XL);

    a {
      margin-top: var(--spaceM);

      :first-of-type {
        margin-top: 0;
      }
    }
  }
`;

export default EventInfo;
