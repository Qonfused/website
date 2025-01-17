import React, { useState, useEffect, useRef, Fragment } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { useScrollRestore, useWindowSize, useAppContext } from 'hooks';
import { media } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';
import './Info.css';

function correctDate(time)  {
  let date = new Date(time);
  date = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));

  return date;
}

function hasFired(time) {
  if (!time) return false;

  return new Date() >= new Date(time);
}

function Info(props) {
  const { match: { params: { eventID } } } = props;
  const { events, user, dispatch } = useAppContext();
  const activeEvent = events?.length > 0 && events.filter(({ id }) => id === eventID)[0];
  const otherEvents = events?.length > 0 && events.filter(({ id, time }) => !hasFired(time) && id !== eventID);
  const isPlaying = activeEvent?.players && activeEvent?.players[user?.id];
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
        as: Link,
        label: isPlaying ? 'Update' : 'Signup',
        to: `/events/signup/${eventID}`
      }
    : {
        as: 'a',
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
                <section className="info__wrapper">
                  <header className={classNames('info__header', `info__header--${status}`)}>
                    <div className="info__panel">
                      <Title2 loading={!activeEvent?.name ? 1 : 0}>{activeEvent.name}</Title2>
                      <Paragraph loading={!activeEvent?.description ? 1 : 0}>{activeEvent.description}</Paragraph>
                      {(!activeEvent?.fired && !isMobile) && <Button {...buttonProps} />}
                    </div>
                    <div className="info__panel">
                      <div>
                        <Paragraph className="info__tag" loading={!activeEvent?.time ? 1 : 0}>
                          <label>Date:</label>
                          {activeEvent?.time && correctDate(activeEvent.time).toLocaleDateString('default', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Paragraph>
                        <Paragraph className="info__tag" loading={!activeEvent?.time ? 1 : 0}>
                          <label>Time:</label>
                          {activeEvent?.time && new Date(activeEvent.time).toLocaleTimeString('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short',
                          })}
                        </Paragraph>
                        {activeEvent?.platform &&
                          <Paragraph className="info__tag">
                            <label>Platform:</label>
                            {activeEvent.platform}
                          </Paragraph>
                        }
                        {activeEvent?.players &&
                          <Paragraph className="info__tag">
                            <label>Players:</label>
                            {Object.values(activeEvent.players).length}
                          </Paragraph>
                        }
                      </div>
                      {(!activeEvent?.fired && isMobile) && <Button style={{ marginTop: '50px' }} {...buttonProps} />}
                      {(!activeEvent || otherEvents?.length > 1) &&
                        <div className="info__related-events">
                          <h4>Other Events</h4>
                          {!activeEvent &&
                            <Paragraph loading={1}>
                              <br/><br/><br/>
                            </Paragraph>
                          }
                          {otherEvents && otherEvents?.map(({ id, name }, index) => index < 4 && (
                            <Anchor
                              key={id}
                              secondary={1}
                              as={Link}
                              to={`/events/${id}`}
                            >
                              {name}
                            </Anchor>
                          ))}
                        </div>
                      }
                    </div>
                  </header>
                </section>
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

export default Info;
