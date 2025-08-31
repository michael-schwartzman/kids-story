import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { childrenAPI, storiesAPI } from '../services/api'

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Welcome = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-family: 'Fredoka', cursive;
    font-size: 2.5rem;
    color: white;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const StatCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .number {
    font-size: 2rem;
    font-weight: bold;
    color: #6B73FF;
    margin-bottom: 0.5rem;
  }
  
  .label {
    color: #666;
    font-size: 1rem;
  }
`

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const ActionCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`

const Button = styled.button`
  background: ${props => props.primary ? '#6B73FF' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '2px solid #e0e6ed'};
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#5a63f0' : '#e9ecef'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`

const RecentStories = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-bottom: 1.5rem;
    color: #333;
  }
`

const StoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  
  .icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
  
  .content {
    flex: 1;
    
    .title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.3rem;
    }
    
    .meta {
      color: #666;
      font-size: 0.9rem;
    }
  }
  
  .status {
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 500;
    
    &.completed {
      background: #d4edda;
      color: #155724;
    }
    
    &.generating {
      background: #fff3cd;
      color: #856404;
    }
    
    &.failed {
      background: #f8d7da;
      color: #721c24;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    margin-bottom: 0.5rem;
  }
`

const Dashboard = () => {
  const { user, canGenerateStory } = useAuth()
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const [recentStories, setRecentStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [childrenResponse, storiesResponse] = await Promise.all([
        childrenAPI.getChildren(),
        storiesAPI.getStories({ limit: 5 })
      ])
      
      setChildren(childrenResponse.data.children)
      setRecentStories(storiesResponse.data.stories)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'generating': return '⏳'
      case 'failed': return '❌'
      default: return '📖'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <DashboardContainer>
        <Welcome>
          <h1>Loading...</h1>
        </Welcome>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <Welcome>
        <h1>Welcome back, {user?.name}! ✨</h1>
        <p>Ready to create some magical stories today?</p>
      </Welcome>

      <StatsGrid>
        <StatCard>
          <div className="icon">👶</div>
          <div className="number">{children.length}</div>
          <div className="label">Children Profiles</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">📚</div>
          <div className="number">{user?.storiesGenerated || 0}</div>
          <div className="label">Stories Created</div>
        </StatCard>
        
        <StatCard>
          <div className="icon">⭐</div>
          <div className="number">{user?.subscriptionTier === 'premium' ? 'Premium' : 'Free'}</div>
          <div className="label">Account Type</div>
        </StatCard>
      </StatsGrid>

      <ActionGrid>
        <ActionCard>
          <div className="icon">📖</div>
          <h3>Create New Story</h3>
          <p>Generate a personalized story for your child to help them overcome challenges and grow.</p>
          <Button 
            primary 
            onClick={() => navigate('/create-story')}
            disabled={!canGenerateStory()}
          >
            {canGenerateStory() ? 'Create Story' : 'Upgrade for More Stories'}
          </Button>
        </ActionCard>
        
        <ActionCard>
          <div className="icon">👶</div>
          <h3>Manage Children</h3>
          <p>Add or update your children's profiles, photos, and preferences to personalize their stories.</p>
          <Button onClick={() => navigate('/children')}>
            Manage Children
          </Button>
        </ActionCard>
        
        <ActionCard>
          <div className="icon">📚</div>
          <h3>Story Library</h3>
          <p>Browse and read all your previously created stories, or download them as PDFs.</p>
          <Button onClick={() => navigate('/library')}>
            View Library
          </Button>
        </ActionCard>
      </ActionGrid>

      <RecentStories>
        <h3>Recent Stories</h3>
        {recentStories.length > 0 ? (
          recentStories.map(story => (
            <StoryItem key={story._id}>
              <div className="icon">{getStatusIcon(story.status)}</div>
              <div className="content">
                <div className="title">{story.title}</div>
                <div className="meta">
                  {story.metadata.childName} • {formatDate(story.createdAt)}
                </div>
              </div>
              <div className={`status ${story.status}`}>
                {story.status}
              </div>
            </StoryItem>
          ))
        ) : (
          <EmptyState>
            <div className="icon">📚</div>
            <h4>No stories yet</h4>
            <p>Create your first magical story!</p>
          </EmptyState>
        )}
      </RecentStories>
    </DashboardContainer>
  )
}

export default Dashboard