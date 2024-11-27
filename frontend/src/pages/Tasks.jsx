import { useState } from 'react';
import styled from 'styled-components';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import TaskList from '../components/tasks/TaskList';

const TasksWrapper = styled.div`
  padding: 2rem;
`;

const TasksContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);

  const handleTaskCreated = () => {
    setRefreshTasks(prev => !prev);
  };

  return (
    <TasksWrapper>
      <TasksContainer>
        <Header>
          <Title>Mis Tareas</Title>
          <CreateButton onClick={() => setIsModalOpen(true)}>
            Crear Nueva Tarea
          </CreateButton>
        </Header>

        <TaskList key={refreshTasks} />

        <CreateTaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      </TasksContainer>
    </TasksWrapper>
  );
}

export default Tasks; 