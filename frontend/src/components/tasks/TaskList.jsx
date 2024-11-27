import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { taskService } from '../../services/taskService';
import TaskItem from './TaskItem';
import EmptyMessage from '../ui/EmptyMessage';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const tasksData = await taskService.getTasks();
      console.log('Tareas obtenidas:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Cargando tareas...</div>;
  }

  return (
    <ListContainer>
      {tasks && tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem 
            key={task._id}
            taskData={task}
            onUpdate={fetchTasks}
          />
        ))
      ) : (
        <EmptyMessage icon="✔️">
          No hay tareas disponibles
        </EmptyMessage>
      )}
    </ListContainer>
  );
}

export default TaskList; 