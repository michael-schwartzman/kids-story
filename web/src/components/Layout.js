import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
`

const Logo = styled.div`
  font-family: 'Fredoka', cursive;
  font-size: 2rem;
  font-weight: 600;
  color: #6B73FF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📚';
    font-size: 1.8rem;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#6B73FF' : '#666'};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #6B73FF;
    background: rgba(107, 115, 255, 0.1);
  }
`

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserName = styled.span`
  color: #333;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const LogoutButton = styled.button`
  background: #ff6b6b;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-1px);
  }
`

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 2rem;
  color: #666;
  margin-top: auto;
`

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <LayoutContainer>
      {user && (
        <Header>
          <Nav>
            <Logo onClick={() => handleNavigation('/dashboard')}>
              KidsStory
            </Logo>
            
            <NavLinks>
              <NavLink 
                active={location.pathname === '/dashboard'}
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </NavLink>
              <NavLink 
                active={location.pathname === '/children'}
                onClick={() => handleNavigation('/children')}
              >
                Children
              </NavLink>
              <NavLink 
                active={location.pathname === '/library'}
                onClick={() => handleNavigation('/library')}
              >
                Story Library
              </NavLink>
            </NavLinks>

            <UserMenu>
              <UserName>Hello, {user.name}!</UserName>
              <LogoutButton onClick={handleLogout}>
                Logout
              </LogoutButton>
            </UserMenu>
          </Nav>
        </Header>
      )}
      
      <Main>
        {children}
      </Main>
      
      <Footer>
        <p>© 2025 KidsStory. Made with ❤️ for families everywhere.</p>
      </Footer>
    </LayoutContainer>
  )
}

export default Layout