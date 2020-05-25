import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title2 } from 'components/Type';
import Button from 'components/Button';
import { AnimFade } from 'utils/style';
import { reflow } from 'utils/transition';

function GetStarted(props) {
  const { id, sectionRef, visible, accent, ...rest } = props;
  const titleId = `${id}-title`;

  return (
    <GetStartedWrapper
      ref={sectionRef}
      id={id}
      accent={accent}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition
        in={visible}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <GetStartedContainer status={status}>
            <GetStartedContent>
              <div>
                <Label>Get Started</Label>
                <Title2 id={titleId}>Ready to Play?</Title2>
              </div>
              <Button accent={accent} href="https://discord.gg/mjtTnr8" target="_blank" label="Get Started" />
            </GetStartedContent>
          </GetStartedContainer>
        )}
      </Transition>
    </GetStartedWrapper>
  );
}

const GetStartedWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackground};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }

  ${props => props.accent && css`
    background: ${props => props.theme.colorAccent};

    &, * {
      color: ${props => props.theme.colorWhite};
    }
  `}
`;

const GetStartedContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: 100%;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const GetStartedContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 180px 0;

  ${Label} {
    position: relative;
    margin-left: -50px;
  }

  ${Title2} {
    margin-top: 40px;
  }

  a {
    margin-top: 60px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    ${Label} {
      margin-left: -35px;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px 0;

    ${Label} {
      margin-left: 0;
    }

    ${Title2} {
      margin-top: 20px;
    }

    a {
      margin-top: 45px;
    }
  }
`;

export default memo(GetStarted);
