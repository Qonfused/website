import React, { useState, useEffect, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import AllEvents from './AllEvents';
import EventSignup from './EventSignup';
import EventInfo from './EventInfo';
import EventsPanel from './EventsPanel';
import prerender from 'utils/prerender';

function Events(props) {
  const { id, sectionRef, visible, ...rest } = props;
  const titleId = `${id}-title`;
  const [events, setEvents] = useState();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/functions/events', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) return false;

        const data = await response.json();

        return data && setEvents(Object.values(data));
      } catch (error) {
        return console.error(error.message);
      }
    }

    if (!prerender) fetchEvents();
  }, []);

  if (!sectionRef) return (
    <Suspense fallback={<Fragment />}>
      <Switch>
        <Route exact path="/events" render={() => <AllEvents events={events} />} />
        <Route path="/events/signup" component={EventSignup} />
        <Route render={() => <EventInfo events={events} />} />
      </Switch>
    </Suspense>
  );

  return (
    <EventsPanel
      id={id}
      titleId={titleId}
      sectionRef={sectionRef}
      visible={visible}
      events={events}
      {...rest}
    />
  );
}

export default Events;