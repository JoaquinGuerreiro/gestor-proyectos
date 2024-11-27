import styled, { css } from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 64px);
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
`;

export const Container = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.dark};
  font-weight: 500;
`;

export const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => 
    props.$error ? props.theme.colors.danger : props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => 
    props.$variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.$variant === 'danger'
      ? props.theme.colors.danger
      : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  ${props => props.$isLoading && css`
    cursor: wait;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  `}
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing.lg};
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const Subtitle = styled.h2`
  color: ${props => props.theme.colors.dark};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const Text = styled.p`
  color: ${props => props.theme.colors.dark};
  line-height: 1.5;
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'pending':
        return props.theme.colors.warning + '20';
      case 'in-progress':
        return props.theme.colors.info + '20';
      case 'completed':
        return props.theme.colors.success + '20';
      default:
        return props.theme.colors.light;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return props.theme.colors.warning;
      case 'in-progress':
        return props.theme.colors.info;
      case 'completed':
        return props.theme.colors.success;
      default:
        return props.theme.colors.dark;
    }
  }};
`;

export const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => 
    props.error ? props.theme.colors.danger : props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.lg} 0;
`;

export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.spacing.md};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  flex-direction: ${props => props.direction || 'row'};
`;

export const IconButton = styled(Button)`
  padding: ${props => props.theme.spacing.xs};
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  & > svg {
    width: 16px;
    height: 16px;
  }
`;

export const Badge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.sizes.sm};
  font-weight: 500;
  
  ${props => {
    switch (props.$variant) {
      case 'alta':
        return css`
          background-color: ${props.theme.colors.danger}20;
          color: ${props.theme.colors.danger};
        `;
      case 'pendiente':
        return css`
          background-color: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
      case 'privado':
        return css`
          background-color: ${props.theme.colors.secondary}20;
          color: ${props.theme.colors.secondary};
        `;
      case 'completada':
        return css`
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'en-progreso':
        return css`
          background-color: ${props.theme.colors.info}20;
          color: ${props.theme.colors.info};
        `;
      default:
        return css`
          background-color: ${props.theme.colors.primary}20;
          color: ${props.theme.colors.primary};
        `;
    }
  }}
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${props => props.theme.colors.light};
  margin: ${props => props.theme.spacing.md} 0;
`;

export const Select = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => 
    props.error ? props.theme.colors.danger : props.theme.colors.light};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

// Animación para el spinner
const spin = css`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.sizes.xl};
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

export const ContentCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const ActionButton = styled(Button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-weight: 600;
  
  &:hover {
    opacity: 0.9;
  }
`; 