import styled from 'styled-components';

const SortContainer = styled.div`
  margin-bottom: 1rem;
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  background-color: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.primary};
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

function ProjectSort({ ordenActual, setOrden }) {
  return (
    <SortContainer>
      <SortButton
        $isActive={ordenActual === 'fecha'}
        onClick={() => setOrden('fecha')}
      >
        Fecha
      </SortButton>
      <SortButton
        $isActive={ordenActual === 'prioridad'}
        onClick={() => setOrden('prioridad')}
      >
        Prioridad
      </SortButton>
      <SortButton
        $isActive={ordenActual === 'nombre'}
        onClick={() => setOrden('nombre')}
      >
        Nombre
      </SortButton>
    </SortContainer>
  );
}

export default ProjectSort; 