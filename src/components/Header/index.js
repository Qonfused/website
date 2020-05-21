import React, { memo } from 'react';
import styled, { useTheme } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import NavToggle from './NavToggle';
import Anchor from 'components/Anchor';
import Socials from 'components/Socials';
import { rgba } from 'utils/style';
import { useAppContext, useWindowSize } from 'hooks';
import { reflow } from 'utils/transition';
import { navLinks } from 'data/nav';

function Header(props) {
  const { dark } = props;
  const { menuOpen, dispatch } = useAppContext();
  const { mobile, colorAccent } = useTheme();
  const { width } = useWindowSize();
  const isMobile = width <= mobile;
  const isDark = menuOpen ? !dark : dark;

  const onClick = () => dispatch({ type: 'toggleMenu' });

  return (
    <HeaderWrapper role="banner" dark={isDark}>
      <LogoLink
        to={{ pathname: '/', hash: '#intro' }}
        aria-label="Project Modern, Putting Players First"
      >
        <Icon icon="logo" />
      </LogoLink>
      <HeaderNav>
        <CTALink
          dark={isDark}
          href="https://discord.gg/mjtTnr8"
          target="_blank"
          rel="noreferrer noopener"
        >
          Get Started
        </CTALink>
        <NavToggle dark={isDark} menuOpen={menuOpen} />
      </HeaderNav>
      <Transition
        in={menuOpen}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <HeaderMenu dark={isDark} menuOpen={menuOpen}>
            <HeaderMenuContent>
              <HeaderContentWrapper>
                <PrimaryNav dark={isDark}>
                  <NavLabel>Menu</NavLabel>
                  <NavMenu>
                    {navLinks?.map(({ to, label }, index) => (
                      <NavItem
                        to={to}
                        aria-label={label}
                        onClick={onClick}
                      >
                        <h4>{label}</h4>
                        <label>{label}</label>
                        <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                      </NavItem>
                    ))}
                  </NavMenu>
                </PrimaryNav>
                <NavInfo dark={isDark}>
                  <Anchor
                    href="mailto:support@projectmodern.gg"
                    style={{ marginBottom: '6px', color: colorAccent }}
                  >
                    support@projectmodern.gg
                  </Anchor>
                  <Anchor
                    href="https://discord.gg/mjtTnr8"
                    target="_blank"
                    style={{ marginBottom: '6px', color: colorAccent }}
                  >
                    discord.gg/mjtTnr8
                  </Anchor>
                  <h4>&copy; {new Date().getFullYear()} Project Modern</h4>
                  {!isMobile && <NavSocials dark={isDark} />}
                </NavInfo>
              </HeaderContentWrapper>
            </HeaderMenuContent>
          </HeaderMenu>
        )}
      </Transition>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  align-items: center;
  display: flex;
  height: 150px;
  justify-content: space-between;
  left: 0;
  margin: 0 auto;
  max-width: calc(100% - 100px);
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.55s ${props => props.theme.ease1};
  z-index: 1024;

  &, a {
    color: ${props => props.dark
      ? props.theme.colorWhite
      : props.theme.colorTitle};
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    height: 116px;
    max-width: calc(100% - 40px);
  }
`;

const LogoLink = styled(Link)`
  pointer-events: all;
  z-index: 21;
`;

const HeaderNav = styled.nav`
  align-items: center;
  display: flex;
  pointer-events: all;
  z-index: 21;
`;

const CTALink = styled.a`
  color: ${props => props.dark
    ? props.theme.colorWhite
    : props.theme.colorTitle};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 28px;
  margin-right: 30px;
  text-decoration: none;
  text-transform: uppercase;

  ::after {
    background: ${props => props.dark
      ? props.theme.colorWhite
      : props.theme.colorTitle};
    content: '';
    display: block;
    height: 1px;
    margin-top: 5px;
    transform-origin: left;
    transform: scaleX(1);
    transition: transform 0.4s ${props => props.theme.ease1};
    width: 100%;
  }

  &:hover,
  &:focus {
    ::after {
      transform-origin: right;
      transform: scaleX(0);
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    line-height: 24px;
  }
`;

const HeaderMenu = styled.div`
  background: ${props => props.dark
    ? props.theme.colorBackgroundDark
    : props.theme.colorBackground};
  height: 100vh;
  left: 0;
  opacity: ${props => props.menuOpen ? '1' : '0'};
  overflow: hidden;
  pointer-events: ${props => props.menuOpen ? 'all' : 'none'};
  position: fixed;
  top: 0;
  transition: opacity 0.55s ${props => props.theme.ease1};
  width: 100vw;
  z-index: 20;
`;

const HeaderMenuContent = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
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
`;

const HeaderContentWrapper = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: ${props => props.theme.mobile}px) {
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 20px;
  }
`;

const PrimaryNav = styled.nav`
  color: ${props => props.dark
    ? props.theme.colorWhite
    : props.theme.colorTitle};

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-bottom: 80px;
  }
`;

const NavLabel = styled.label`
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.25em;
  line-height: 24px;
  text-transform: uppercase;
  transform-origin: bottom left;
  transform: rotate(-90deg) translate3d(-45px, 0, 0);

  @media (max-width: ${props => props.theme.mobile}px) {
    display: none;
  }
`;

const NavMenu = styled.ul`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0 0 0 60px;
  padding: 0;
  transform: translate3d(0, -20px, 0);

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-left: 0;
  }
`;

const NavItem = styled(Link)`
  font-size: 75px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 95px;
  text-decoration: none;
  transform-origin: left;
  transform: scaleX(0.98);

  h4 {
    clip-path: inset(0 0 0 0);
    display: block;
    position: relative;
    transition: all 0.75s cubic-bezier(0.63, 0.03, 0.21, 1);
    z-index: 3;
  }

  label {
    left: 0;
    opacity: 0.8;
    pointer-events: none;
    position: absolute;
    top: 0;
    transition: all 0.75s cubic-bezier(0.63, 0.03, 0.21, 1);
    z-index: 1;
  }

  span {
    font-size: 12px;
    font-weight: 700;
    left: 0;
    letter-spacing: 0.25em;
    line-height: 24px;
    margin-left: 20px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 10px;
    transition: all 0.85s cubic-bezier(0.63, 0.03, 0.21, 1);
    z-index: 1;
  }

  :hover, :active, :focus {
    h4 {
      clip-path: inset(0 100% 0 0);
    }

    h4, label {
      margin-left: 35px;
    }

    span {
      margin-left: 0;
      opacity: 1;
    }

    @media (max-width: ${props => props.theme.mobile}px) {
      h4, label {
        margin-left: 0;
      }
    }
  }

  @media (max-width: ${props => props.theme.desktop}px) {
    font-size: 67px;
    line-height: 87px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    font-size: 59px;
    line-height: 79px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 40px;
    line-height: 55px;

    span {
      display: none;
    }
  }
`;

const NavInfo = styled.div`
  align-items: flex-start;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  margin-bottom: -38px;
  position: relative;
  z-index: 22;

  h4 {
    color: ${props => rgba(props.dark
      ? props.theme.colorWhite
      : props.theme.colorTitle, 0.4)};
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.8px;
    line-height: 32px;
    margin: 15px 0 30px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    align-self: flex-start;
    margin: 0;

    h4 {
      display: none;
    }
  }
`;

const NavSocials = styled(Socials)`
  margin-top: 35px;
`;

export default memo(Header);
